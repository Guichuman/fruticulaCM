"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { ArrowLeft, Plus, Trash2, Edit, X, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ConfirmacaoExclusao } from "@/components/confirmacao-exclusao";
import { api } from "@/lib/api";

type ItemPallet = {
  id: number;
  idTipoFrutaEmbalagem: number;
  nomeFruta: string;
  nomeTipo: string;
  nomeEmbalagem: string;
  quantidade: number;
};

type Pallet = {
  id: number;
  dbId?: number;
  bloco: number;
  lado: string;
  itens: ItemPallet[];
};

type PalletFrutaApi = {
  id: number;
  quantidadeCaixa: number;
  idTipoFrutaEmbalagem: number;
  tipoFrutaEmbalagem: {
    id: number;
    nome: string;
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
  motorista: { nome: string };
  caminhao: {
    placa: string;
    qtdBlocos: number;
    palletBaixo: string;
  };
  status: string;
  maxCaixas: number;
  pallets: PalletApi[];
};

type Fruta = { id: number; nome: string };
type TipoFruta = { id: number; nome: string };
type Embalagem = { id: number; nome: string; sku: number };

const LADOS = ["MA", "MB", "AA", "AB"] as const;
type LadoValor = (typeof LADOS)[number];

const LADO_LABEL: Record<LadoValor, string> = {
  MA: "L.D. Motorista",
  MB: "L.D. Motorista Baixo",
  AA: "L.D. Ajudante",
  AB: "L.D. Ajudante Baixo",
};

export default function PaginaCarregamento() {
  const roteador = useRouter();
  const params = useParams();
  const cargaId = params.id as string;

  const [dadosCarga, setDadosCarga] = useState<DadosCarga | null>(null);
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [palletesCarregados, setPalletesCarregados] = useState<Pallet[]>([]);

  const [modalAberta, setModalAberta] = useState(false);
  const [blocoSelecionado, setBlocoSelecionado] = useState("");
  const [ladoSelecionado, setLadoSelecionado] = useState("");
  const [blocoLadoFixo, setBlocoLadoFixo] = useState(false);

  const [frutas, setFrutas] = useState<Fruta[]>([]);
  const [idFrutaSelecionada, setIdFrutaSelecionada] = useState("");
  const [tiposFruta, setTiposFruta] = useState<TipoFruta[]>([]);
  const [idTipoSelecionado, setIdTipoSelecionado] = useState("");
  const [embalagensDisponiveis, setEmbalagensDisponiveis] = useState<
    Embalagem[]
  >([]);
  const [idEmbalagemSelecionada, setIdEmbalagemSelecionada] = useState("");
  const [quantidade, setQuantidade] = useState("");

  const [itensPallet, setItensPallet] = useState<ItemPallet[]>([]);
  const [proximoIdItem, setProximoIdItem] = useState(1);

  const [palletDbIdEditando, setPalletDbIdEditando] = useState<number | null>(
    null,
  );

  const [idItemEditando, setIdItemEditando] = useState<number | null>(null);
  const [quantidadeEditando, setQuantidadeEditando] = useState("");

  const [confirmItemId, setConfirmItemId] = useState<number | null>(null);
  const [confirmPallet, setConfirmPallet] = useState<Pallet | null>(null);
  const [voltando, setVoltando] = useState(false);

  useEffect(() => {
    if (!cargaId) return;
    api
      .get<DadosCarga>(`/carga/${cargaId}`)
      .then((carga) => {
        setDadosCarga(carga);
        const palletsExistentes: Pallet[] = (carga.pallets ?? []).map((p) => ({
          id: p.id,
          dbId: p.id,
          bloco: p.bloco,
          lado: p.lado,
          itens: (p.palletFrutas ?? []).map((pf, idx) => ({
            id: idx + 1,
            idTipoFrutaEmbalagem: pf.idTipoFrutaEmbalagem,
            nomeFruta: pf.tipoFrutaEmbalagem?.tipoFruta?.fruta?.nome ?? "",
            nomeTipo: pf.tipoFrutaEmbalagem?.tipoFruta?.nome ?? "",
            nomeEmbalagem: pf.tipoFrutaEmbalagem?.nome ?? "",
            quantidade: pf.quantidadeCaixa,
          })),
        }));
        setPalletesCarregados(palletsExistentes);
      })
      .catch(() => {
        toast.error("Erro ao carregar dados da carga");
        roteador.push("/cargas");
      })
      .finally(() => setCarregandoDados(false));
  }, [cargaId, roteador]);

  useEffect(() => {
    api
      .get<Fruta[]>("/fruta")
      .then(setFrutas)
      .catch(() => toast.error("Erro ao carregar frutas"));
  }, []);

  useEffect(() => {
    setIdTipoSelecionado("");
    setTiposFruta([]);
    setIdEmbalagemSelecionada("");
    setEmbalagensDisponiveis([]);
    if (!idFrutaSelecionada) return;
    api
      .get<TipoFruta[]>(`/tipo-fruta/fruta/${idFrutaSelecionada}`)
      .then(setTiposFruta)
      .catch(() => setTiposFruta([]));
  }, [idFrutaSelecionada]);

  useEffect(() => {
    setIdEmbalagemSelecionada("");
    setEmbalagensDisponiveis([]);
    if (!idTipoSelecionado) return;
    api
      .get<Embalagem[]>(`/tipo-fruta-embalagem/tipo/${idTipoSelecionado}`)
      .then(setEmbalagensDisponiveis)
      .catch(() => setEmbalagensDisponiveis([]));
  }, [idTipoSelecionado]);

  const temPalletBaixo = dadosCarga?.caminhao.palletBaixo === "S";

  const calcularProgresso = () => {
    if (!dadosCarga) return 0;
    const posicoesPorBloco = temPalletBaixo ? 4 : 2;
    const totalPosicoes = dadosCarga.caminhao.qtdBlocos * posicoesPorBloco;
    if (totalPosicoes === 0) return 0;
    return Math.min((palletesCarregados.length / totalPosicoes) * 100, 100);
  };

  const totalPosicoes = dadosCarga
    ? dadosCarga.caminhao.qtdBlocos * (temPalletBaixo ? 4 : 2)
    : 0;

  const numBlocos = dadosCarga ? dadosCarga.caminhao.qtdBlocos : 0;

  const resetarFormItem = () => {
    setIdFrutaSelecionada("");
    setIdTipoSelecionado("");
    setIdEmbalagemSelecionada("");
    setQuantidade("");
    setTiposFruta([]);
    setEmbalagensDisponiveis([]);
  };

  const abrirModalPorCelula = (bloco: number, lado: string) => {
    resetarFormItem();
    setItensPallet([]);
    setProximoIdItem(1);
    setBlocoSelecionado(String(bloco));
    setLadoSelecionado(lado);
    setBlocoLadoFixo(true);
    setPalletDbIdEditando(null);
    setIdItemEditando(null);
    setModalAberta(true);
  };

  const editarPallet = (pallet: Pallet) => {
    resetarFormItem();
    setBlocoSelecionado(pallet.bloco.toString());
    setLadoSelecionado(pallet.lado);
    setBlocoLadoFixo(true);
    setItensPallet([...pallet.itens]);
    const maxId = pallet.itens.reduce((max, i) => Math.max(max, i.id), 0);
    setProximoIdItem(maxId + 1);
    setPalletDbIdEditando(pallet.dbId ?? null);
    setIdItemEditando(null);
    setModalAberta(true);
  };

  const adicionarItem = () => {
    if (
      !idFrutaSelecionada ||
      !idTipoSelecionado ||
      !idEmbalagemSelecionada ||
      !quantidade
    ) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    const fruta = frutas.find((f) => f.id.toString() === idFrutaSelecionada);
    const tipo = tiposFruta.find((t) => t.id.toString() === idTipoSelecionado);
    const embalagem = embalagensDisponiveis.find(
      (e) => e.id.toString() === idEmbalagemSelecionada,
    );
    if (!fruta || !tipo || !embalagem) {
      toast.error("Seleção inválida");
      return;
    }

    const novoItem: ItemPallet = {
      id: proximoIdItem,
      idTipoFrutaEmbalagem: embalagem.id,
      nomeFruta: fruta.nome,
      nomeTipo: tipo.nome,
      nomeEmbalagem: embalagem.nome,
      quantidade: Number.parseInt(quantidade, 10),
    };
    setItensPallet([...itensPallet, novoItem]);
    setProximoIdItem(proximoIdItem + 1);
    resetarFormItem();
    toast.success("Item adicionado ao pallet");
  };

  const solicitarRemocaoItem = (itemId: number) => {
    setIdItemEditando(null);
    setConfirmItemId(itemId);
  };

  // Executado após confirmação do diálogo
  const confirmarRemocaoItem = async () => {
    if (confirmItemId === null) return;
    const novosItens = itensPallet.filter((item) => item.id !== confirmItemId);
    setConfirmItemId(null);

    if (novosItens.length === 0 && palletDbIdEditando) {
      try {
        await api.delete(`/pallet/${palletDbIdEditando}`);
        setPalletesCarregados((prev) =>
          prev.filter((p) => p.dbId !== palletDbIdEditando),
        );
        setModalAberta(false);
        setPalletDbIdEditando(null);
        toast.success("Pallet excluído pois não restaram itens");
      } catch (erro) {
        toast.error(
          erro instanceof Error ? erro.message : "Erro ao excluir pallet",
        );
      }
      return;
    }

    setItensPallet(novosItens);
  };

  const iniciarEdicao = (item: ItemPallet) => {
    setIdItemEditando(item.id);
    setQuantidadeEditando(String(item.quantidade));
  };

  const cancelarEdicao = () => {
    setIdItemEditando(null);
    setQuantidadeEditando("");
  };

  const confirmarEdicao = (itemId: number) => {
    const nova = Number.parseInt(quantidadeEditando, 10);
    if (!nova || nova < 1) {
      toast.error("Quantidade inválida");
      return;
    }
    setItensPallet(
      itensPallet.map((item) =>
        item.id === itemId ? { ...item, quantidade: nova } : item,
      ),
    );
    setIdItemEditando(null);
    setQuantidadeEditando("");
  };

  const [salvandoPallet, setSalvandoPallet] = useState(false);
  const [finalizando, setFinalizando] = useState(false);

  const salvarPallet = async () => {
    if (!blocoSelecionado || !ladoSelecionado) {
      toast.error("Bloco e posição são obrigatórios");
      return;
    }
    if (itensPallet.length === 0) {
      toast.error("Adicione pelo menos um item ao pallet");
      return;
    }
    setSalvandoPallet(true);
    try {
      const existente = palletesCarregados.find(
        (p) =>
          p.bloco === Number.parseInt(blocoSelecionado) &&
          p.lado === ladoSelecionado,
      );
      if (existente?.dbId) {
        await api.delete(`/pallet/${existente.dbId}`);
      }

      const novoPallet = await api.post<{ id: number }>("/pallet", {
        lado: ladoSelecionado,
        bloco: Number.parseInt(blocoSelecionado),
        idCarga: Number(cargaId),
      });

      for (const item of itensPallet) {
        await api.post("/pallet-fruta", {
          quantidadeCaixa: item.quantidade,
          idPallet: novoPallet.id,
          idTipoFrutaEmbalagem: item.idTipoFrutaEmbalagem,
        });
      }

      if (existente) {
        setPalletesCarregados(
          palletesCarregados.map((p) =>
            p.id === existente.id
              ? { ...p, dbId: novoPallet.id, itens: [...itensPallet] }
              : p,
          ),
        );
      } else {
        setPalletesCarregados([
          ...palletesCarregados,
          {
            id: Date.now(),
            dbId: novoPallet.id,
            bloco: Number.parseInt(blocoSelecionado),
            lado: ladoSelecionado,
            itens: [...itensPallet],
          },
        ]);
      }

      setModalAberta(false);
      setIdItemEditando(null);
      toast.success("Pallet salvo na carga!");
    } catch (erro) {
      toast.error(
        erro instanceof Error ? erro.message : "Erro ao salvar pallet",
      );
    } finally {
      setSalvandoPallet(false);
    }
  };

  const removerPallet = async (palletId: number) => {
    const pallet = palletesCarregados.find((p) => p.id === palletId);
    try {
      if (pallet?.dbId) {
        await api.delete(`/pallet/${pallet.dbId}`);
      }
      setPalletesCarregados((prev) => prev.filter((p) => p.id !== palletId));
      setConfirmPallet(null);
      toast.success("Pallet removido");
    } catch (erro) {
      toast.error(
        erro instanceof Error ? erro.message : "Erro ao remover pallet",
      );
    }
  };

  const finalizarCarga = async () => {
    if (calcularProgresso() < 50) {
      toast.error(
        "A carga deve estar pelo menos 50% carregada para ser finalizada",
      );
      return;
    }
    setFinalizando(true);
    try {
      await api.patch(`/carga/${cargaId}`, { status: "F" });
      toast.success("Carga finalizada com sucesso!");
      roteador.push(`/cargas/resumo/${cargaId}`);
    } catch (erro) {
      toast.error(
        erro instanceof Error ? erro.message : "Erro ao finalizar carga",
      );
      setFinalizando(false);
    }
  };

  const renderCelula = (
    bloco: number,
    lado: string,
    pallet: Pallet | undefined,
    borderClass: string,
    desativada = false,
  ) => (
    <TableCell className={`${borderClass} p-2`}>
      {desativada ? (
        <div className="bg-gray-100 border border-dashed border-gray-300 rounded p-2 min-h-[60px] flex items-center justify-center">
          <span className="text-xs text-gray-400 select-none">—</span>
        </div>
      ) : pallet ? (
        <div className="bg-green-100 border border-green-300 rounded p-2 min-h-[60px] relative group cursor-pointer">
          <div className="space-y-1.5 pr-10">
            {pallet.itens.length > 0 ? (
              pallet.itens.map((item, idx) => (
                <div key={idx}>
                  <div className="text-xs font-semibold text-green-900 leading-tight">
                    {item.nomeFruta} {item.nomeTipo}
                  </div>
                  <div className="text-xs text-green-700 leading-tight">
                    {item.nomeEmbalagem} - {item.quantidade}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-green-700">Pallet vazio</div>
            )}
          </div>
          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 bg-white/80 hover:bg-white"
              onClick={() => editarPallet(pallet)}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 bg-white/80 hover:bg-white text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmPallet(pallet);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="bg-gray-50 border border-gray-200 rounded p-2 min-h-[60px] flex items-center justify-center cursor-pointer hover:bg-primary/5 hover:border-primary/30 transition-colors"
          onClick={() => abrirModalPorCelula(bloco, lado)}
        >
          <Plus className="h-5 w-5 text-gray-400" />
        </div>
      )}
    </TableCell>
  );

  if (carregandoDados) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <NavBar />
          <div className="container mx-auto py-10 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin text-4xl mb-4">◌</div>
              <p className="text-muted-foreground">
                Carregando dados da carga...
              </p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!dadosCarga) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <NavBar />
          <div className="container mx-auto py-10 text-center">
            <p className="text-muted-foreground">Carga não encontrada</p>
            <Button
              onClick={() => {
                setVoltando(true);
                roteador.push("/cargas");
              }}
              className="mt-4"
            >
              {voltando ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Voltando...
                </>
              ) : (
                "Voltar para Cargas"
              )}
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto py-10">
          <div className="max-w-[73rem] mx-auto">
            <Button
              variant="outline"
              className="mb-6 bg-transparent"
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
                  Voltar para Cargas Abertas
                </>
              )}
            </Button>

            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-primary">
                  Detalhes da Carga
                </CardTitle>
                <CardDescription>
                  Gerencie o carregamento dos pallets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">ID da Carga:</span>{" "}
                      {dadosCarga.id}
                    </div>
                    <div>
                      <span className="font-medium">Data:</span>{" "}
                      {new Date(dadosCarga.criadoEm).toLocaleDateString(
                        "pt-BR",
                      )}
                    </div>
                    <div>
                      <span className="font-medium">Caminhão:</span>{" "}
                      {dadosCarga.caminhao.placa}
                    </div>
                    <div>
                      <span className="font-medium">Motorista:</span>{" "}
                      {dadosCarga.motorista?.nome}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                      {palletesCarregados.length} de {totalPosicoes} pallets
                      carregados ({Math.round(calcularProgresso())}%)
                    </span>
                  </div>
                  <Progress value={calcularProgresso()} className="h-4" />
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-center mb-6">
                    Visualização da Carga
                  </h3>

                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="text-center font-semibold border-r">
                            Bloco
                          </TableHead>
                          <TableHead className="text-center font-semibold border-r">
                            {LADO_LABEL.MA}
                          </TableHead>
                          <TableHead className="text-center font-semibold border-r">
                            {LADO_LABEL.MB}
                          </TableHead>
                          <TableHead className="text-center font-semibold border-r">
                            {LADO_LABEL.AA}
                          </TableHead>
                          <TableHead className="text-center font-semibold">
                            {LADO_LABEL.AB}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.from({ length: numBlocos }, (_, i) => {
                          const bloco = i + 1;
                          const porLado = (lado: string) =>
                            palletesCarregados.find(
                              (p) => p.bloco === bloco && p.lado === lado,
                            );
                          return (
                            <TableRow key={bloco} className="hover:bg-muted/30">
                              <TableCell className="text-center font-medium border-r bg-muted/20">
                                {bloco}
                              </TableCell>
                              {renderCelula(
                                bloco,
                                "MA",
                                porLado("MA"),
                                "border-r",
                              )}
                              {renderCelula(
                                bloco,
                                "MB",
                                porLado("MB"),
                                "border-r",
                                !temPalletBaixo,
                              )}
                              {renderCelula(
                                bloco,
                                "AA",
                                porLado("AA"),
                                "border-r",
                              )}
                              {renderCelula(
                                bloco,
                                "AB",
                                porLado("AB"),
                                "",
                                !temPalletBaixo,
                              )}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex justify-center mt-6">
                    <Button
                      className="bg-yellow-500 hover:bg-yellow-600 text-black px-8"
                      onClick={finalizarCarga}
                      disabled={calcularProgresso() < 50 || finalizando}
                    >
                      {finalizando ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Finalizando...
                        </>
                      ) : (
                        "Finalizar Carga"
                      )}
                    </Button>
                  </div>

                  <div className="mt-4 flex flex-wrap justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-100 border border-green-300 rounded" />
                      <span>Pallet Carregado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded flex items-center justify-center">
                        <Plus className="h-2.5 w-2.5 text-gray-400" />
                      </div>
                      <span>Posição Vazia (clique para adicionar)</span>
                    </div>
                    {!temPalletBaixo && (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-100 border border-dashed border-gray-300 rounded" />
                        <span>Posição indisponível (sem pallet baixo)</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={modalAberta} onOpenChange={setModalAberta}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-semibold">
                Montar Pallet
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-medium">Bloco do Pallet</Label>
                  {blocoLadoFixo ? (
                    <div className="flex h-10 items-center rounded-md border border-input bg-muted px-3 text-sm font-medium">
                      Bloco {blocoSelecionado}
                    </div>
                  ) : (
                    <Select
                      value={blocoSelecionado}
                      onValueChange={setBlocoSelecionado}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: numBlocos }, (_, i) => i + 1).map(
                          (b) => (
                            <SelectItem key={b} value={b.toString()}>
                              Bloco {b}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="font-medium">Posição do Pallet</Label>
                  {blocoLadoFixo ? (
                    <div className="flex h-10 items-center rounded-md border border-input bg-muted px-3 text-sm font-medium">
                      {LADO_LABEL[ladoSelecionado as LadoValor] ??
                        ladoSelecionado}
                    </div>
                  ) : (
                    <Select
                      value={ladoSelecionado}
                      onValueChange={setLadoSelecionado}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {LADOS.map((l) => (
                          <SelectItem key={l} value={l}>
                            {LADO_LABEL[l]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              <hr />

              <div className="space-y-3">
                <h3 className="text-center text-base font-medium">
                  Itens do Pallet
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Fruta</Label>
                    <Select
                      value={idFrutaSelecionada}
                      onValueChange={setIdFrutaSelecionada}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {frutas.map((f) => (
                          <SelectItem key={f.id} value={f.id.toString()}>
                            {f.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium">
                      Tipo/Variedade
                    </Label>
                    <Select
                      value={idTipoSelecionado}
                      onValueChange={setIdTipoSelecionado}
                      disabled={!idFrutaSelecionada || tiposFruta.length === 0}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue
                          placeholder={
                            !idFrutaSelecionada
                              ? "Selecione fruta"
                              : tiposFruta.length === 0
                                ? "Sem tipos"
                                : "Selecione..."
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposFruta.map((t) => (
                          <SelectItem key={t.id} value={t.id.toString()}>
                            {t.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Embalagem</Label>
                    <Select
                      value={idEmbalagemSelecionada}
                      onValueChange={setIdEmbalagemSelecionada}
                      disabled={
                        !idTipoSelecionado || embalagensDisponiveis.length === 0
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue
                          placeholder={
                            !idTipoSelecionado
                              ? "Selecione tipo"
                              : embalagensDisponiveis.length === 0
                                ? "Sem embalagens"
                                : "Selecione..."
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {embalagensDisponiveis.map((e) => (
                          <SelectItem key={e.id} value={e.id.toString()}>
                            {e.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Qtd. Caixas</Label>
                    <div className="flex gap-1">
                      <Input
                        type="number"
                        placeholder="0"
                        value={quantidade}
                        onChange={(e) => setQuantidade(e.target.value)}
                        min="1"
                        className="h-9"
                      />
                      <Button
                        onClick={adicionarItem}
                        disabled={
                          !idFrutaSelecionada ||
                          !idTipoSelecionado ||
                          !idEmbalagemSelecionada ||
                          !quantidade
                        }
                        className="h-9 px-3 bg-primary hover:bg-primary/90 shrink-0"
                      >
                        Adicionar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <hr />

              <div className="space-y-3">
                <h3 className="text-center text-base font-medium">
                  Itens no Pallet
                </h3>
                <div className="border rounded-md min-h-[100px]">
                  {itensPallet.length > 0 ? (
                    <div className="divide-y">
                      {itensPallet.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 gap-2"
                        >
                          <div className="flex-1 text-sm min-w-0">
                            <span className="font-medium">
                              {item.nomeFruta}
                            </span>
                            <span className="text-primary text-xs font-medium">
                              {" "}
                              {item.nomeTipo}
                            </span>
                            <span className="text-muted-foreground">
                              {" "}
                              — {item.nomeEmbalagem}
                            </span>
                            {idItemEditando !== item.id && (
                              <span className="ml-2 font-medium">
                                {item.quantidade} caixas
                              </span>
                            )}
                          </div>

                          {idItemEditando === item.id ? (
                            <div className="flex items-center gap-1.5 shrink-0">
                              <Input
                                type="number"
                                value={quantidadeEditando}
                                onChange={(e) =>
                                  setQuantidadeEditando(e.target.value)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter")
                                    confirmarEdicao(item.id);
                                  if (e.key === "Escape") cancelarEdicao();
                                }}
                                min="1"
                                className="h-7 w-20 text-sm"
                                autoFocus
                              />
                              <span className="text-xs text-muted-foreground">
                                caixas
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-green-600 hover:text-green-700"
                                onClick={() => confirmarEdicao(item.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-muted-foreground"
                                onClick={cancelarEdicao}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-muted-foreground hover:text-primary"
                                onClick={() => iniciarEdicao(item)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive/90 h-7 w-7 p-0"
                                onClick={() => solicitarRemocaoItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[100px] text-muted-foreground text-sm">
                      Nenhum item adicionado.
                    </div>
                  )}
                </div>
              </div>

              <Button
                onClick={salvarPallet}
                disabled={
                  !blocoSelecionado ||
                  !ladoSelecionado ||
                  itensPallet.length === 0 ||
                  salvandoPallet
                }
                className="bg-primary hover:bg-primary/90 w-full py-3 text-base"
              >
                {salvandoPallet ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar Pallet na Carga"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {(() => {
          const item = itensPallet.find((i) => i.id === confirmItemId);
          return (
            <ConfirmacaoExclusao
              open={confirmItemId !== null}
              onOpenChange={(v) => {
                if (!v) setConfirmItemId(null);
              }}
              onConfirmar={confirmarRemocaoItem}
            />
          );
        })()}

        <ConfirmacaoExclusao
          open={confirmPallet !== null}
          onOpenChange={(v) => {
            if (!v) setConfirmPallet(null);
          }}
          onConfirmar={() => confirmPallet && removerPallet(confirmPallet.id)}
        />
      </div>
    </ProtectedRoute>
  );
}
