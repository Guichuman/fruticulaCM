import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { CargaConsultaService } from './carga-consulta.service';

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
      const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 0, autoFirstPage: true });
      const chunks: Buffer[] = [];

      doc.on('data', (c: Buffer) => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // ─── Constantes de layout ────────────────────────────────────────────
      const ML = 40;          // margem lateral
      const MT = 35;          // margem topo
      const PW = doc.page.width;  // 841.89pt (A4 landscape)
      const TABLE_W = PW - ML * 2;

      const motorista = carga.caminhao?.motorista?.nome ?? '—';
      const dataStr = carga.criadoEm
        ? new Date(carga.criadoEm).toLocaleDateString('pt-BR')
        : '—';
      const placa = carga.caminhao?.placa ?? '';
      const temBaixo = carga.caminhao?.palletBaixo === 'S';
      const lados = temBaixo ? ['MA', 'MB', 'AA', 'AB'] : ['MA', 'MB'];
      const labelLado: Record<string, string> = {
        MA: 'L.D. Motorista Alto',
        MB: 'L.D. Motorista Baixo',
        AA: 'L.D. Ajudante Alto',
        AB: 'L.D. Ajudante Baixo',
      };

      const BLOCO_W = 45;
      const COL_W = (TABLE_W - BLOCO_W) / lados.length;
      const HEADER_H = 24;
      const PAD = 5;
      const FS = 9;
      const LH = 13;
      const ITEM_GAP = 3;

      // ─── Mapa pallet ────────────────────────────────────────────────────
      const palletMap = new Map<string, ItemCelula[]>();
      for (const p of carga.pallets ?? []) {
        const key = `${p.bloco}-${p.lado}`;
        palletMap.set(
          key,
          (p.palletFrutas ?? []).map((pf) => ({
            nomeFruta: pf.tipoFrutaEmbalagem?.tipoFruta?.fruta?.nome ?? '—',
            nomeTipo: pf.tipoFrutaEmbalagem?.tipoFruta?.nome ?? '—',
            nomeEmb: pf.tipoFrutaEmbalagem?.nome ?? '—',
            qtd: pf.quantidadeCaixa,
          })),
        );
      }

      // ─── Helpers ─────────────────────────────────────────────────────────
      const fillRect = (x: number, y: number, w: number, h: number, hex: string) => {
        doc.save().rect(x, y, w, h).fill(hex).restore();
      };

      const drawHeader = (y: number) => {
        fillRect(ML, y, TABLE_W, HEADER_H, '#166534');
        doc.fontSize(9).font('Helvetica-Bold').fillColor('#ffffff');
        doc.text('Bloco', ML, y + 7, { width: BLOCO_W, align: 'center', lineBreak: false });
        for (let i = 0; i < lados.length; i++) {
          doc.text(
            labelLado[lados[i]],
            ML + BLOCO_W + i * COL_W,
            y + 7,
            { width: COL_W, align: 'center', lineBreak: false },
          );
        }
        doc.fillColor('#000000');
        return y + HEADER_H;
      };

      const rowHeight = (bloco: number): number => {
        let maxItems = 0;
        for (const lado of lados) {
          const items = palletMap.get(`${bloco}-${lado}`) ?? [];
          if (items.length > maxItems) maxItems = items.length;
        }
        if (maxItems === 0) return 28;
        return maxItems * (LH * 2 + ITEM_GAP) - ITEM_GAP + PAD * 2;
      };

      // ─── Título ──────────────────────────────────────────────────────────
      doc
        .fontSize(16)
        .font('Helvetica-Bold')
        .fillColor('#000000')
        .text(`Romaneio ${motorista}`, ML, MT, { width: TABLE_W, align: 'center', lineBreak: false });
      doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor('#555555')
        .text(`${dataStr}  ·  ${placa}`, ML, MT + 22, { width: TABLE_W, align: 'center', lineBreak: false });
      doc.fillColor('#000000');

      let y = MT + 50;
      y = drawHeader(y);

      // ─── Linhas ──────────────────────────────────────────────────────────
      for (let bloco = 1; bloco <= carga.totalBlocos; bloco++) {
        const rH = rowHeight(bloco);

        // Page break
        if (y + rH > doc.page.height - ML) {
          doc.addPage({ size: 'A4', layout: 'landscape', margin: 0 });
          y = MT;
          y = drawHeader(y);
        }

        // Fundo alternado
        fillRect(ML, y, TABLE_W, rH, bloco % 2 === 0 ? '#f5fbf5' : '#ffffff');

        // Célula bloco
        fillRect(ML, y, BLOCO_W, rH, '#f0fdf4');
        doc
          .fontSize(11)
          .font('Helvetica-Bold')
          .fillColor('#000000')
          .text(`${bloco}`, ML, y + rH / 2 - 7, { width: BLOCO_W, align: 'center', lineBreak: false });

        // Células de conteúdo
        for (let ci = 0; ci < lados.length; ci++) {
          const cx = ML + BLOCO_W + ci * COL_W;
          const items = palletMap.get(`${bloco}-${lados[ci]}`) ?? [];

          if (items.length === 0) {
            doc
              .fontSize(FS)
              .font('Helvetica')
              .fillColor('#aaaaaa')
              .text('—', cx, y + rH / 2 - 6, { width: COL_W, align: 'center', lineBreak: false });
          } else {
            let ty = y + PAD;
            for (const item of items) {
              doc
                .fontSize(FS)
                .font('Helvetica-Bold')
                .fillColor('#000000')
                .text(`${item.nomeFruta} ${item.nomeTipo}`, cx + PAD, ty, {
                  width: COL_W - PAD * 2,
                  lineBreak: false,
                });
              ty += LH;
              doc
                .fontSize(FS)
                .font('Helvetica')
                .fillColor('#555555')
                .text(`${item.nomeEmb} - ${item.qtd}`, cx + PAD, ty, {
                  width: COL_W - PAD * 2,
                  lineBreak: false,
                });
              ty += LH + ITEM_GAP;
            }
          }
        }

        // Bordas da linha
        doc.save().strokeColor('#cccccc').lineWidth(0.5);
        doc.rect(ML, y, TABLE_W, rH).stroke();
        // Separadores de colunas
        doc.moveTo(ML + BLOCO_W, y).lineTo(ML + BLOCO_W, y + rH).stroke();
        for (let ci = 1; ci < lados.length; ci++) {
          const cx = ML + BLOCO_W + ci * COL_W;
          doc.moveTo(cx, y).lineTo(cx, y + rH).stroke();
        }
        doc.restore();

        y += rH;
      }

      doc.end();
    });
  }
}
