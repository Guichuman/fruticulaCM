import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { CargaConsultaService } from './carga-consulta.service';

const GREEN      = '#6AA84F';
const GREEN_LITE = '#f0fdf4';
const GRAY_BG    = '#f9f9f9';
const WHITE      = '#ffffff';
const BLACK      = '#000000';
const GRAY_TEXT  = '#555555';
const GRAY_CELL  = '#aaaaaa';
const BORDER_CLR = '#cccccc';

interface ItemCelula {
  nomeFruta: string;
  nomeTipo: string;
  nomeEmb: string;
  qtd: number;
}

@Injectable()
export class RomaneioService {
  constructor(private readonly consultaService: CargaConsultaService) {}

  async gerarPdf(id: number): Promise<Buffer> {
    const carga = await this.consultaService.buscarPorId(id);

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', layout: 'portrait', margin: 0, autoFirstPage: true });
      const chunks: Buffer[] = [];
      doc.on('data', (c: Buffer) => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // ─── Layout constants ────────────────────────────────────────────────
      const PW   = doc.page.width;   // 595.28 pt
      const PH   = doc.page.height;  // 841.89 pt
      const ML   = 40;
      const TW   = PW - ML * 2;      // table width = 515.28
      const PAD  = 4;
      const FS   = 8;
      const LH   = 10;               // line height at FS 8

      // ─── Carga metadata ──────────────────────────────────────────────────
      const motorista = carga.motorista?.nome ?? '—';
      const dataStr   = carga.criadoEm ? new Date(carga.criadoEm).toLocaleDateString('pt-BR') : '—';
      const dataHifen = dataStr.replace(/\//g, '-');
      const placa     = carga.caminhao?.placa ?? '—';
      const modelo    = carga.caminhao?.modelo ?? '';
      const temBaixo  = carga.caminhao?.palletBaixo === 'S';

      const lados = temBaixo ? ['MA', 'AA', 'MB', 'AB'] : ['MA', 'AA'];
      const labelLado: Record<string, string> = {
        MA: 'L.D. Motorista Alto',
        MB: 'L.D. Motorista Baixo',
        AA: 'L.D. Ajudante Alto',
        AB: 'L.D. Ajudante Baixo',
      };

      const BLOCO_W  = 50;
      const COL_W    = (TW - BLOCO_W) / lados.length;
      const HEADER_H = 22;

      // ─── Pallet map ──────────────────────────────────────────────────────
      const palletMap = new Map<string, ItemCelula[]>();
      for (const p of carga.pallets ?? []) {
        palletMap.set(
          `${p.bloco}-${p.lado}`,
          (p.palletFrutas ?? []).map((pf) => ({
            nomeFruta: pf.tipoFrutaEmbalagem?.tipoFruta?.fruta?.nome ?? '—',
            nomeTipo:  pf.tipoFrutaEmbalagem?.tipoFruta?.nome ?? '—',
            nomeEmb:   pf.tipoFrutaEmbalagem?.nome ?? '—',
            qtd:       pf.quantidadeCaixa,
          })),
        );
      }

      // ─── Helpers ─────────────────────────────────────────────────────────
      const fillRect = (x: number, y: number, w: number, h: number, color: string) => {
        doc.save().rect(x, y, w, h).fill(color).restore();
      };

      const strokeGrid = (x: number, y: number, w: number, h: number, colWidths: number[]) => {
        doc.save().lineWidth(0.5).strokeColor(BORDER_CLR);
        doc.rect(x, y, w, h).stroke();
        let cx = x;
        for (let i = 0; i < colWidths.length - 1; i++) {
          cx += colWidths[i];
          doc.moveTo(cx, y).lineTo(cx, y + h).stroke();
        }
        doc.restore();
      };

      const drawTableHeader = (y: number): number => {
        fillRect(ML, y, TW, HEADER_H, GREEN);
        doc.fontSize(9).font('Helvetica-Bold').fillColor(WHITE);
        doc.text('Bloco', ML + PAD, y + 7, { width: BLOCO_W - PAD * 2, align: 'center', lineBreak: false });
        for (let i = 0; i < lados.length; i++) {
          const cx = ML + BLOCO_W + i * COL_W;
          doc.text(labelLado[lados[i]], cx + PAD, y + 7, { width: COL_W - PAD * 2, align: 'center', lineBreak: false });
        }
        doc.fillColor(BLACK);
        return y + HEADER_H;
      };

      // Retorna a altura real que o texto ocupará dentro da largura da coluna
      const alturaTexto = (texto: string): number => {
        doc.fontSize(FS).font('Helvetica');
        return doc.heightOfString(texto, { width: COL_W - PAD * 2 });
      };

      const ITEM_GAP = 2; // espaço vertical entre itens da mesma célula

      const rowHeight = (bloco: number): number => {
        let maxH = LH + PAD * 2; // mínimo: uma linha vazia
        for (const lado of lados) {
          const items = palletMap.get(`${bloco}-${lado}`) ?? [];
          if (items.length === 0) continue;
          let colH = PAD * 2;
          for (let k = 0; k < items.length; k++) {
            const item = items[k];
            const texto = `${item.nomeFruta} ${item.nomeTipo} - ${item.nomeEmb}: ${item.qtd}`;
            colH += alturaTexto(texto);
            if (k < items.length - 1) colH += ITEM_GAP;
          }
          if (colH > maxH) maxH = colH;
        }
        return maxH;
      };

      // ════════════════════════════════════════════════════════════════════
      // PAGE 1 — Pallet table
      // ════════════════════════════════════════════════════════════════════
      doc.fontSize(16).font('Helvetica-Bold').fillColor(BLACK);
      doc.text(`Romaneio ${motorista} ${dataHifen}`, ML, 30, { width: TW, align: 'center', lineBreak: false });

      let y = 58;
      y = drawTableHeader(y);

      const qtdBlocos = carga.totalBlocos ?? 0;
      for (let bloco = 1; bloco <= qtdBlocos; bloco++) {
        const rH = rowHeight(bloco);

        if (y + rH > PH - ML) {
          doc.addPage({ size: 'A4', layout: 'portrait', margin: 0 });
          y = 30;
          y = drawTableHeader(y);
        }

        fillRect(ML, y, TW, rH, bloco % 2 === 0 ? '#f5fbf5' : WHITE);
        fillRect(ML, y, BLOCO_W, rH, GREEN_LITE);

        // Bloco number
        doc.fontSize(10).font('Helvetica-Bold').fillColor(BLACK);
        doc.text(`${bloco}`, ML + PAD, y + (rH - 10) / 2, { width: BLOCO_W - PAD * 2, align: 'center', lineBreak: false });

        // Content cells
        for (let ci = 0; ci < lados.length; ci++) {
          const cx    = ML + BLOCO_W + ci * COL_W;
          const items = palletMap.get(`${bloco}-${lados[ci]}`) ?? [];

          if (items.length === 0) {
            doc.fontSize(FS).font('Helvetica').fillColor(GRAY_CELL);
            doc.text('—', cx + PAD, y + (rH - FS) / 2, { width: COL_W - PAD * 2, align: 'center', lineBreak: false });
          } else {
            let ty = y + PAD;
            for (let k = 0; k < items.length; k++) {
              const item = items[k];
              const texto = `${item.nomeFruta} ${item.nomeTipo} - ${item.nomeEmb}: ${item.qtd}`;
              doc.fontSize(FS).font('Helvetica').fillColor(BLACK);
              doc.text(texto, cx + PAD, ty, { width: COL_W - PAD * 2 });
              ty += alturaTexto(texto);
              if (k < items.length - 1) ty += ITEM_GAP;
            }
          }
        }

        strokeGrid(ML, y, TW, rH, [BLOCO_W, ...lados.map(() => COL_W)]);
        y += rH;
      }

      // ════════════════════════════════════════════════════════════════════
      // PAGE 2 — Summary
      // ════════════════════════════════════════════════════════════════════
      doc.addPage({ size: 'A4', layout: 'portrait', margin: 0 });

      doc.fontSize(16).font('Helvetica-Bold').fillColor(BLACK);
      doc.text(`Romaneio de Carga - ID: ${carga.id}`, ML, 30, { width: TW });

      doc.fontSize(10).font('Helvetica').fillColor(BLACK);
      doc.text(`Data: ${dataStr}`, ML, 58);
      doc.text(`Caminhão: ${placa}${modelo ? ` - ${modelo}` : ''}`, ML, 72);
      doc.text(`Motorista: ${motorista}`, ML, 86);

      // ─── Summary table ───────────────────────────────────────────────────
      const QTD_W  = 60;
      const DESC_W = TW - QTD_W;
      const ROW_H  = 18;
      const FS_SUM = 9;

      let ys = 108;

      const drawSumHeader = (y: number): number => {
        fillRect(ML, y, TW, ROW_H, GREEN);
        doc.fontSize(FS_SUM).font('Helvetica-Bold').fillColor(WHITE);
        doc.text('Descrição do Sumário', ML + PAD, y + 5, { width: DESC_W - PAD * 2, lineBreak: false });
        doc.text('Quantidade', ML + DESC_W + PAD, y + 5, { width: QTD_W - PAD * 2, align: 'center', lineBreak: false });
        doc.fillColor(BLACK);
        return y + ROW_H;
      };

      const drawRow = (
        desc: string, qty: string, bold: boolean, bg: string, alignRight = false,
      ) => {
        if (ys + ROW_H > PH - ML) {
          doc.addPage({ size: 'A4', layout: 'portrait', margin: 0 });
          ys = 30;
          ys = drawSumHeader(ys);
        }
        fillRect(ML, ys, TW, ROW_H, bg);
        const font = bold ? 'Helvetica-Bold' : 'Helvetica';
        doc.fontSize(FS_SUM).font(font).fillColor(BLACK);
        doc.text(desc, ML + PAD, ys + 5, { width: DESC_W - PAD * 2, align: alignRight ? 'right' : 'left', lineBreak: false });
        if (qty) {
          doc.text(qty, ML + DESC_W + PAD, ys + 5, { width: QTD_W - PAD * 2, lineBreak: false });
        }
        doc.save().lineWidth(0.5).strokeColor(BORDER_CLR).rect(ML, ys, TW, ROW_H).stroke();
        doc.save().lineWidth(0.5).strokeColor(BORDER_CLR).moveTo(ML + DESC_W, ys).lineTo(ML + DESC_W, ys + ROW_H).stroke();
        doc.restore();
        ys += ROW_H;
      };

      ys = drawSumHeader(ys);

      // Total pallets row
      drawRow('Total de Pallets na Carga', String(carga.pallets?.length ?? 0), true, WHITE);

      // Group by fruta
      type SubItem = { descricao: string; quantidade: number };
      const grupoFruta = new Map<string, SubItem[]>();
      for (const p of carga.pallets ?? []) {
        for (const pf of p.palletFrutas ?? []) {
          const nomeFruta = pf.tipoFrutaEmbalagem?.tipoFruta?.fruta?.nome ?? '—';
          const nomeTipo  = pf.tipoFrutaEmbalagem?.tipoFruta?.nome ?? '—';
          const nomeEmb   = pf.tipoFrutaEmbalagem?.nome ?? '—';
          const sku       = pf.tipoFrutaEmbalagem?.sku ?? 0;
          const descricao = `${nomeFruta} ${nomeTipo} - ${nomeEmb} (Código - ${sku})`;
          if (!grupoFruta.has(nomeFruta)) grupoFruta.set(nomeFruta, []);
          const lista = grupoFruta.get(nomeFruta)!;
          const existente = lista.find((i) => i.descricao === descricao);
          if (existente) existente.quantidade += pf.quantidadeCaixa;
          else lista.push({ descricao, quantidade: pf.quantidadeCaixa });
        }
      }

      const grupoFrutaOrdenado = Array.from(grupoFruta.entries())
        .sort(([a], [b]) => a.localeCompare(b, 'pt-BR'));

      for (const [nomeFruta, itens] of grupoFrutaOrdenado) {
        // spacer
        if (ys + 4 > PH - ML) {
          doc.addPage({ size: 'A4', layout: 'portrait', margin: 0 });
          ys = 30;
          ys = drawSumHeader(ys);
        }
        fillRect(ML, ys, TW, 4, GRAY_BG);
        doc.save().lineWidth(0.5).strokeColor(BORDER_CLR).rect(ML, ys, TW, 4).stroke().restore();
        ys += 4;

        // Fruit group header
        drawRow(nomeFruta, '', true, GRAY_BG);

        let totalFruta = 0;
        for (const item of itens) {
          drawRow(`    ${item.descricao}`, String(item.quantidade), false, WHITE);
          totalFruta += item.quantidade;
        }

        // Total fruit row
        drawRow(`Total ${nomeFruta}`, String(totalFruta), true, GRAY_BG, true);
      }

      doc.end();
    });
  }
}
