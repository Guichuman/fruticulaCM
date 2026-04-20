"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import {
  ArrowLeft,
  Truck,
  User,
  Calendar,
  Package,
  FileSpreadsheet,
  FileText,
  Wrench,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { api } from "@/lib/api";

type PalletFrutaApi = {
  id: number;
  quantidadeCaixa: number;
  idTipoFrutaEmbalagem: number;
  tipoFrutaEmbalagem: {
    id: number;
    nome: string;
    sku: number;
    tipoFruta: {
      id: number;
      nome: string;
      fruta: { id: number; nome: string };
    };
  };
};

type PalletApi = {
  id: number;
  bloco: number;
  lado: string;
  palletFrutas: PalletFrutaApi[];
};

type DadosCarga = {
  id: number;
  criadoEm: string;
  status: string;
  motorista: { nome: string };
  caminhao: {
    placa: string;
    modelo?: string;
    qtdBlocos: number;
    palletBaixo: string;
  };
  pallets: PalletApi[];
};

type ResumoItem = {
  descricao: string; // "Goiaba Tipo 1 — Plástico"
  totalCaixas: number;
};

export default function PaginaResumoCarga() {
  const roteador = useRouter();
  const params = useParams();
  const cargaId = params.id as string;

  const [carga, setCarga] = useState<DadosCarga | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [baixandoPdf, setBaixandoPdf] = useState(false);
  const [exportandoPlanilha, setExportandoPlanilha] = useState(false);
  const [voltando, setVoltando] = useState(false);

  useEffect(() => {
    if (!cargaId) return;
    api
      .get<DadosCarga>(`/carga/${cargaId}`)
      .then(setCarga)
      .catch(() => {
        toast.error("Erro ao carregar resumo da carga");
        roteador.push("/cargas");
      })
      .finally(() => setCarregando(false));
  }, [cargaId, roteador]);

  // Agrupa caixas por tipoFrutaEmbalagem
  const calcularResumo = (pallets: PalletApi[]): ResumoItem[] => {
    const mapa = new Map<string, number>();

    for (const pallet of pallets) {
      for (const pf of pallet.palletFrutas ?? []) {
        const nomeFruta = pf.tipoFrutaEmbalagem?.tipoFruta?.fruta?.nome ?? "—";
        const nomeTipo = pf.tipoFrutaEmbalagem?.tipoFruta?.nome ?? "—";
        const nomeEmb = pf.tipoFrutaEmbalagem?.nome ?? "—";
        const chave = `${nomeFruta} ${nomeTipo} — ${nomeEmb}`;
        mapa.set(chave, (mapa.get(chave) ?? 0) + pf.quantidadeCaixa);
      }
    }

    return Array.from(mapa.entries())
      .map(([descricao, totalCaixas]) => ({ descricao, totalCaixas }))
      .sort((a, b) => b.totalCaixas - a.totalCaixas);
  };

  const exportarPDF = async () => {
    if (!carga || baixandoPdf) return;
    setBaixandoPdf(true);
    try {
      const { jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;

      // ── Cores ────────────────────────────────────────────────────────────
      const GREEN: [number, number, number] = [106, 168, 79];
      const WHITE: [number, number, number] = [255, 255, 255];
      const LIGHT_GREEN: [number, number, number] = [240, 253, 244];
      const GRAY_BG: [number, number, number] = [249, 249, 249];

      const motorista = carga.motorista?.nome ?? "—";
      const dataStr = new Date(carga.criadoEm).toLocaleDateString("pt-BR");
      const dataHifen = dataStr.replace(/\//g, "-");
      const modelo = carga.caminhao.modelo ?? "";
      const placa = carga.caminhao.placa ?? "—";
      const temBaixo = carga.caminhao.palletBaixo === "S";

      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const PW = doc.internal.pageSize.getWidth();

      // ── Mapa pallet: "bloco-lado" → itens ────────────────────────────────
      type ItemPallet = { nomeFruta: string; nomeTipo: string; nomeEmb: string; qtd: number };
      const palletMap = new Map<string, ItemPallet[]>();
      for (const p of carga.pallets ?? []) {
        palletMap.set(
          `${p.bloco}-${p.lado}`,
          (p.palletFrutas ?? []).map((pf) => ({
            nomeFruta: pf.tipoFrutaEmbalagem?.tipoFruta?.fruta?.nome ?? "—",
            nomeTipo: pf.tipoFrutaEmbalagem?.tipoFruta?.nome ?? "—",
            nomeEmb: pf.tipoFrutaEmbalagem?.nome ?? "—",
            qtd: pf.quantidadeCaixa,
          }))
        );
      }

      const lados = temBaixo ? ["MA", "AA", "MB", "AB"] : ["MA", "AA"];
      const labelLado: Record<string, string> = {
        MA: "Motorista Alto",
        AA: "Passageiro Alto",
        MB: "Motorista Baixo",
        AB: "Passageiro Baixo",
      };
      const formatarItens = (items: ItemPallet[]) =>
        items.map((i) => `${i.nomeFruta} ${i.nomeTipo} - ${i.nomeEmb}: ${i.qtd}`).join("\n");

      // ════════════════════════════════════════════════════════════════════
      // PÁGINA 1 — Tabela por bloco e lado
      // ════════════════════════════════════════════════════════════════════
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(`Romaneio ${motorista} ${dataHifen}`, PW / 2, 18, { align: "center" });

      const qtdBlocos = carga.caminhao.qtdBlocos ?? 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bodyPag1: any[][] = [];
      for (let b = 1; b <= qtdBlocos; b++) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const row: any[] = [
          { content: `Bloco ${b}`, styles: { fontStyle: "bold", fillColor: LIGHT_GREEN, halign: "center" } },
        ];
        for (const lado of lados) {
          const items = palletMap.get(`${b}-${lado}`) ?? [];
          row.push(
            items.length > 0
              ? { content: formatarItens(items) }
              : { content: "—", styles: { textColor: [170, 170, 170], halign: "center" } }
          );
        }
        bodyPag1.push(row);
      }

      autoTable(doc, {
        head: [["Bloco", ...lados.map((l) => labelLado[l])]],
        body: bodyPag1,
        startY: 25,
        styles: { fontSize: 8, cellPadding: 3, valign: "top", overflow: "linebreak" },
        headStyles: { fillColor: GREEN, textColor: WHITE, fontStyle: "bold", fontSize: 9 },
        columnStyles: { 0: { cellWidth: 20, halign: "center" } },
        alternateRowStyles: { fillColor: [250, 255, 250] },
        theme: "grid",
        margin: { left: 14, right: 14 },
      });

      // ════════════════════════════════════════════════════════════════════
      // PÁGINA 2 — Resumo por fruta
      // ════════════════════════════════════════════════════════════════════
      doc.addPage();

      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(`Romaneio de Carga - ID: ${carga.id}`, 14, 18);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Data: ${dataStr}`, 14, 28);
      doc.text(`Caminhão: ${placa}${modelo ? ` - ${modelo}` : ""}`, 14, 34);
      doc.text(`Motorista: ${motorista}`, 14, 40);

      // Agrupamento por fruta
      type SubItem = { descricao: string; quantidade: number };
      const grupoFruta = new Map<string, SubItem[]>();
      for (const p of carga.pallets ?? []) {
        for (const pf of p.palletFrutas ?? []) {
          const nomeFruta = pf.tipoFrutaEmbalagem?.tipoFruta?.fruta?.nome ?? "—";
          const nomeTipo = pf.tipoFrutaEmbalagem?.tipoFruta?.nome ?? "—";
          const nomeEmb = pf.tipoFrutaEmbalagem?.nome ?? "—";
          const sku = pf.tipoFrutaEmbalagem?.sku ?? 0;
          const descricao = `${nomeFruta} ${nomeTipo} - ${nomeEmb} (Código - ${sku})`;
          if (!grupoFruta.has(nomeFruta)) grupoFruta.set(nomeFruta, []);
          const lista = grupoFruta.get(nomeFruta)!;
          const existente = lista.find((i) => i.descricao === descricao);
          if (existente) existente.quantidade += pf.quantidadeCaixa;
          else lista.push({ descricao, quantidade: pf.quantidadeCaixa });
        }
      }

      const totalPallets = carga.pallets?.length ?? 0;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const summaryBody: any[][] = [
        [
          { content: "Total de Pallets na Carga", styles: { fontStyle: "bold" } },
          { content: String(totalPallets), styles: { fontStyle: "bold" } },
        ],
      ];

      for (const [nomeFruta, itens] of grupoFruta) {
        // linha separadora
        summaryBody.push([
          { content: "", colSpan: 2, styles: { fillColor: GRAY_BG, minCellHeight: 3, cellPadding: 0 } },
        ]);
        // cabeçalho da fruta
        summaryBody.push([
          { content: nomeFruta, colSpan: 2, styles: { fontStyle: "bold", fillColor: GRAY_BG } },
        ]);
        let totalFruta = 0;
        for (const item of itens) {
          summaryBody.push([
            { content: `    ${item.descricao}`, styles: { fillColor: WHITE } },
            { content: String(item.quantidade), styles: { fillColor: WHITE } },
          ]);
          totalFruta += item.quantidade;
        }
        // total da fruta
        summaryBody.push([
          { content: `Total ${nomeFruta}`, styles: { fontStyle: "bold", halign: "right", fillColor: GRAY_BG } },
          { content: String(totalFruta), styles: { fontStyle: "bold", fillColor: GRAY_BG } },
        ]);
      }

      autoTable(doc, {
        head: [[
          { content: "Descrição do Sumário", styles: { fillColor: GREEN, textColor: WHITE, fontStyle: "bold" } },
          { content: "Quantidade", styles: { fillColor: GREEN, textColor: WHITE, fontStyle: "bold", halign: "center" } },
        ]],
        body: summaryBody,
        startY: 48,
        styles: { fontSize: 9, cellPadding: 3, overflow: "linebreak" },
        columnStyles: { 1: { cellWidth: 30, halign: "left" } },
        theme: "grid",
        margin: { left: 14, right: 14 },
      });

      // ── Download ─────────────────────────────────────────────────────────
      const nomeArq = `romaneio-${motorista.toLowerCase().replace(/\s+/g, "-")}-${dataHifen}.pdf`;
      doc.save(nomeArq);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao gerar PDF");
    } finally {
      setBaixandoPdf(false);
    }
  };

  const exportarPlanilha = () => {
    if (!carga || exportandoPlanilha) return;
    setExportandoPlanilha(true);

    const motorista = carga.motorista?.nome ?? "—";
    const modelo = carga.caminhao.modelo ?? "—";
    const placa = carga.caminhao.placa ?? "—";
    const data = new Date(carga.criadoEm).toLocaleDateString("pt-BR");
    const totalPallets = carga.pallets?.length ?? 0;

    // ── Agrupamento por fruta → tipoFrutaEmbalagem ──────────────────────────
    type SubItem = { descricao: string; quantidade: number };
    const grupoFruta = new Map<string, SubItem[]>();

    for (const pallet of carga.pallets ?? []) {
      for (const pf of pallet.palletFrutas ?? []) {
        const nomeFruta = pf.tipoFrutaEmbalagem?.tipoFruta?.fruta?.nome ?? "—";
        const nomeTipo = pf.tipoFrutaEmbalagem?.tipoFruta?.nome ?? "—";
        const nomeEmb = pf.tipoFrutaEmbalagem?.nome ?? "—";
        const sku = pf.tipoFrutaEmbalagem?.sku ?? 0;
        const descricao = `${nomeFruta} ${nomeTipo} - ${nomeEmb} (Código - ${sku})`;
        const qtd = pf.quantidadeCaixa;

        if (!grupoFruta.has(nomeFruta)) grupoFruta.set(nomeFruta, []);
        const lista = grupoFruta.get(nomeFruta)!;
        const existente = lista.find((i) => i.descricao === descricao);
        if (existente) existente.quantidade += qtd;
        else lista.push({ descricao, quantidade: qtd });
      }
    }

    // ── Monta CSV ───────────────────────────────────────────────────────────
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const linhas: string[] = [];

    linhas.push(`Romaneio de Carga - ID: ${carga.id}`);
    linhas.push(`Data: ${data}`);
    linhas.push(`Caminhão: ${placa} - ${modelo}`);
    linhas.push(`Motorista: ${motorista}`);
    linhas.push("");
    linhas.push(`${esc("Descrição do Sumário")},${esc("Quantidade")}`);
    linhas.push(`${esc("Total de Pallets na Carga")},${totalPallets}`);

    for (const [nomeFruta, itens] of grupoFruta) {
      linhas.push("");
      linhas.push(`${esc(nomeFruta)},`);
      let totalFruta = 0;
      for (const item of itens) {
        linhas.push(`${esc(item.descricao)},${item.quantidade}`);
        totalFruta += item.quantidade;
      }
      linhas.push(`,${esc(`Total ${nomeFruta} ${totalFruta}`)}`);
    }

    const csv = linhas.join("\n");
    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `romaneio-${carga.id}-${data.replace(/\//g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExportandoPlanilha(false);
  };

  if (carregando) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <NavBar />
          <div className="container mx-auto py-10 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin text-4xl mb-4">◌</div>
              <p className="text-muted-foreground">Carregando resumo...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!carga) return null;

  const resumo = calcularResumo(carga.pallets ?? []);
  const totalPallets = carga.pallets?.length ?? 0;
  const totalCaixas = resumo.reduce((s, i) => s + i.totalCaixas, 0);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto py-10">
          <div className="max-w-2xl mx-auto">
            {/* Voltar */}
            <Button
              variant="outline"
              className="mb-8 bg-transparent"
              disabled={voltando}
              onClick={() => {
                setVoltando(true);
                roteador.push("/cargas");
              }}
            >
              {voltando ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Voltando...
                </>
              ) : (
                <>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </>
              )}
            </Button>

            {/* Cabeçalho */}
            <h1 className="text-2xl font-bold text-primary text-center mb-8">
              Resumo da Carga #{carga.id}
            </h1>

            {/* Informações básicas */}
            <div className="bg-muted/40 rounded-xl p-6 mb-6 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">Data:</span>
                <span className="font-medium">
                  {new Date(carga.criadoEm).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Truck className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">Caminhão:</span>
                <span className="font-medium">
                  {carga.caminhao.placa}
                  {carga.caminhao.modelo ? ` — ${carga.caminhao.modelo}` : ""}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <User className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">Motorista:</span>
                <span className="font-medium">
                  {carga.motorista?.nome ?? "—"}
                </span>
              </div>
            </div>

            {/* Itens carregados */}
            <div className="mb-6">
              <h2 className="text-base font-semibold mb-3">Itens Carregados</h2>
              <div className="border rounded-xl overflow-hidden">
                {resumo.length > 0 ? (
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                          Produto
                        </th>
                        <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                          Caixas
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {resumo.map((item, idx) => (
                        <tr key={idx} className="hover:bg-muted/20">
                          <td className="px-4 py-3 font-medium">
                            {item.descricao}
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums">
                            {item.totalCaixas}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-muted/30 border-t-2">
                      <tr>
                        <td className="px-4 py-3 font-semibold text-sm">
                          Total
                        </td>
                        <td className="px-4 py-3 text-right font-bold tabular-nums">
                          {totalCaixas}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                ) : (
                  <div className="flex items-center justify-center py-10 text-muted-foreground text-sm">
                    Nenhum item registrado nesta carga.
                  </div>
                )}
              </div>
            </div>

            {/* Totalizador de pallets */}
            <div className="flex items-center gap-3 mb-8 p-4 bg-primary/5 border border-primary/20 rounded-xl">
              <Package className="h-5 w-5 text-primary shrink-0" />
              <span className="text-sm font-medium">
                Total de pallets carregados:
              </span>
              <span className="text-sm font-bold text-primary ml-auto">
                {totalPallets}
              </span>
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={exportarPDF}
                disabled={baixandoPdf}
              >
                {baixandoPdf ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando PDF...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Download PDF
                  </>
                )}
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={exportarPlanilha}
                disabled={exportandoPlanilha}
              >
                {exportandoPlanilha ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Exportando...
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Exportar Planilha
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-destructive text-destructive hover:bg-destructive hover:text-white"
                onClick={() =>
                  roteador.push(`/cargas/carregamento/${carga.id}`)
                }
              >
                <Wrench className="mr-2 h-4 w-4" />
                Corrigir Carga
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
