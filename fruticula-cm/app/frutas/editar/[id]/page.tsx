"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import {
  Apple,
  ArrowLeft,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  ChevronUp,
} from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogFooter,
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
import { ProtectedAdminRoute } from "@/components/ProtectedAdminRoute";
import { ConfirmacaoExclusao } from "@/components/confirmacao-exclusao";
import { api } from "@/lib/api";

type ErrosCampo = { nome?: string };
type Embalagem = { id: number; nome: string; sku: number };
type TipoFruta = { id: number; nome: string };

export default function PaginaEditarFruta() {
  const roteador = useRouter();
  const params = useParams();
  const frutaId = params.id as string;

  const [nome, setNome] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [voltando, setVoltando] = useState(false);
  const [errosCampo, setErrosCampo] = useState<ErrosCampo>({});

  const [tipos, setTipos] = useState<TipoFruta[]>([]);
  const [carregandoTipos, setCarregandoTipos] = useState(false);

  const [modalAberta, setModalAberta] = useState(false);
  const [tipoEditando, setTipoEditando] = useState<TipoFruta | null>(null);
  const [tipoNome, setTipoNome] = useState("");
  const [salvandoTipo, setSalvandoTipo] = useState(false);

  const [embalagensTipo, setEmbalagensTipo] = useState<Embalagem[]>([]);
  const [carregandoEmbalagens, setCarregandoEmbalagens] = useState(false);
  const [mostrarFormEmbalagem, setMostrarFormEmbalagem] = useState(false);
  const [embalagemEditando, setEmbalagemEditando] = useState<Embalagem | null>(
    null,
  );
  const [embNome, setEmbNome] = useState("");
  const [embSku, setEmbSku] = useState("");
  const [salvandoEmbalagem, setSalvandoEmbalagem] = useState(false);

  const [confirmTipo, setConfirmTipo] = useState<TipoFruta | null>(null);
  const [confirmEmbalagem, setConfirmEmbalagem] = useState<Embalagem | null>(null);

  const buscarTipos = useCallback(async () => {
    setCarregandoTipos(true);
    try {
      const dados = await api.get<TipoFruta[]>(`/tipo-fruta/fruta/${frutaId}`);
      setTipos(dados);
    } catch {
      toast.error("Erro ao carregar tipos");
    } finally {
      setCarregandoTipos(false);
    }
  }, [frutaId]);

  const buscarEmbalagensTipo = useCallback(async (idTipo: number) => {
    setCarregandoEmbalagens(true);
    try {
      const dados = await api.get<Embalagem[]>(
        `/tipo-fruta-embalagem/tipo/${idTipo}`,
      );
      setEmbalagensTipo(dados);
    } catch {
      toast.error("Erro ao carregar embalagens");
    } finally {
      setCarregandoEmbalagens(false);
    }
  }, []);

  useEffect(() => {
    const buscarFruta = async () => {
      try {
        const dados = await api.get<{ id: number; nome: string }>(
          `/fruta/${frutaId}`,
        );
        setNome(dados.nome);
      } catch {
        toast.error("Erro ao carregar fruta");
        roteador.push("/frutas");
      } finally {
        setCarregando(false);
      }
    };
    buscarFruta();
    buscarTipos();
  }, [frutaId, roteador, buscarTipos]);

  const validarCampos = (): ErrosCampo => {
    const erros: ErrosCampo = {};
    if (!nome.trim()) erros.nome = "Nome da fruta é obrigatório";
    else if (nome.trim().length < 1)
      erros.nome = "Nome da fruta é obrigatório";
    return erros;
  };

  const aoSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrosCampo({});
    const errosLocais = validarCampos();
    if (Object.keys(errosLocais).length > 0) {
      setErrosCampo(errosLocais);
      toast.error("Por favor, corrija os erros nos campos destacados");
      return;
    }
    setSalvando(true);
    try {
      await api.patch(`/fruta/${frutaId}`, { nome: nome.trim() });
      toast.success("Fruta atualizada com sucesso!");
      roteador.push("/frutas");
    } catch (erro) {
      toast.error(
        erro instanceof Error ? erro.message : "Erro ao atualizar fruta",
      );
    } finally {
      setSalvando(false);
    }
  };

  const resetarFormEmbalagem = () => {
    setEmbalagemEditando(null);
    setEmbNome("");
    setEmbSku("");
  };

  const abrirModalNovo = () => {
    setTipoEditando(null);
    setTipoNome("");
    setEmbalagensTipo([]);
    setMostrarFormEmbalagem(false);
    resetarFormEmbalagem();
    setModalAberta(true);
  };

  const abrirModalEditar = (tipo: TipoFruta) => {
    setTipoEditando(tipo);
    setTipoNome(tipo.nome);
    setMostrarFormEmbalagem(false);
    resetarFormEmbalagem();
    setModalAberta(true);
    buscarEmbalagensTipo(tipo.id);
  };

  const aoSalvarTipo = async () => {
    if (!tipoNome.trim()) {
      toast.error("Preencha o nome do tipo");
      return;
    }
    setSalvandoTipo(true);
    try {
      if (tipoEditando) {
        await api.patch(`/tipo-fruta/${tipoEditando.id}`, {
          nome: tipoNome.trim(),
        });
        setTipoEditando({ ...tipoEditando, nome: tipoNome.trim() });
        toast.success("Tipo atualizado com sucesso!");
        buscarTipos();
      } else {
        const novoTipo = await api.post<TipoFruta>("/tipo-fruta", {
          nome: tipoNome.trim(),
          idFruta: Number(frutaId),
        });
        toast.success("Tipo adicionado! Agora pode adicionar embalagens.");
        setTipoEditando(novoTipo);
        buscarTipos();
        buscarEmbalagensTipo(novoTipo.id);
      }
    } catch (erro) {
      toast.error(erro instanceof Error ? erro.message : "Erro ao salvar tipo");
    } finally {
      setSalvandoTipo(false);
    }
  };

  const aoRemoverTipo = async () => {
    if (!confirmTipo) return;
    try {
      await api.delete(`/tipo-fruta/${confirmTipo.id}`);
      toast.success("Tipo removido com sucesso!");
      buscarTipos();
    } catch (erro) {
      toast.error(erro instanceof Error ? erro.message : "Erro ao remover tipo");
    } finally {
      setConfirmTipo(null);
    }
  };

  // --- Embalagem handlers ---
  const iniciarEdicaoEmbalagem = (emb: Embalagem) => {
    setEmbalagemEditando(emb);
    setEmbNome(emb.nome);
    setEmbSku(String(emb.sku));
    setMostrarFormEmbalagem(true);
  };

  const aoSalvarEmbalagem = async () => {
    if (!embNome.trim() || !embSku) {
      toast.error("Preencha nome e SKU");
      return;
    }
    const skuNum = Number(embSku);
    if (!Number.isInteger(skuNum) || skuNum <= 0) {
      toast.error("SKU deve ser um número inteiro positivo");
      return;
    }
    setSalvandoEmbalagem(true);
    try {
      if (embalagemEditando) {
        await api.patch(`/tipo-fruta-embalagem/${embalagemEditando.id}`, {
          nome: embNome.trim(),
          sku: skuNum,
        });
        toast.success("Embalagem atualizada!");
      } else {
        await api.post("/tipo-fruta-embalagem", {
          nome: embNome.trim(),
          sku: skuNum,
          idTipoFruta: tipoEditando!.id,
        });
        toast.success("Embalagem adicionada!");
      }
      resetarFormEmbalagem();
      setMostrarFormEmbalagem(false);
      buscarEmbalagensTipo(tipoEditando!.id);
    } catch (erro) {
      toast.error(
        erro instanceof Error ? erro.message : "Erro ao salvar embalagem",
      );
    } finally {
      setSalvandoEmbalagem(false);
    }
  };

  const aoRemoverEmbalagem = async () => {
    if (!confirmEmbalagem) return;
    try {
      await api.delete(`/tipo-fruta-embalagem/${confirmEmbalagem.id}`);
      toast.success("Embalagem removida!");
      buscarEmbalagensTipo(tipoEditando!.id);
    } catch (erro) {
      toast.error(erro instanceof Error ? erro.message : "Erro ao remover embalagem");
    } finally {
      setConfirmEmbalagem(null);
    }
  };

  if (carregando) {
    return (
      <ProtectedAdminRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin text-4xl">◌</div>
        </div>
      </ProtectedAdminRoute>
    );
  }

  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto py-10">
          <div className="max-w-2xl mx-auto">
            <Button
              variant="ghost"
              className="mb-6"
              disabled={voltando || salvando}
              onClick={() => { setVoltando(true); roteador.push("/frutas"); }}
            >
              {voltando ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Voltando...</> : <><ArrowLeft className="mr-2 h-4 w-4" />Voltar</>}
            </Button>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Apple className="mr-2 h-5 w-5" />
                  Editar Fruta
                </CardTitle>
                <CardDescription>Atualize os dados da fruta</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={aoSalvar} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome da Fruta</Label>
                    <Input
                      id="nome"
                      value={nome}
                      onChange={(e) => {
                        setNome(e.target.value);
                        if (errosCampo.nome)
                          setErrosCampo((p) => ({ ...p, nome: undefined }));
                      }}
                      disabled={salvando}
                      className={errosCampo.nome ? "border-red-500" : ""}
                    />
                    {errosCampo.nome && (
                      <p className="text-sm text-red-600">{errosCampo.nome}</p>
                    )}
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => roteador.push("/frutas")}
                      disabled={salvando}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={salvando}
                      className="flex-1"
                    >
                      {salvando ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        "Salvar"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">
                    Tipos / Variedades
                  </CardTitle>
                  <CardDescription>
                    Gerencie os tipos e suas embalagens
                  </CardDescription>
                </div>
                <Button size="sm" onClick={abrirModalNovo}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar tipo
                </Button>
              </CardHeader>
              <CardContent>
                {carregandoTipos ? (
                  <div className="flex justify-center py-6">
                    <div className="animate-spin text-2xl text-muted-foreground">
                      ◌
                    </div>
                  </div>
                ) : tipos.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    Nenhum tipo cadastrado.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">ID</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead className="w-24 text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tipos.map((tipo) => (
                        <TableRow key={tipo.id}>
                          <TableCell className="text-muted-foreground">
                            {tipo.id}
                          </TableCell>
                          <TableCell className="font-medium">
                            {tipo.nome}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => abrirModalEditar(tipo)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                onClick={() => setConfirmTipo(tipo)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal Tipo + Embalagens */}
      <Dialog
        open={modalAberta}
        onOpenChange={(open) => {
          setModalAberta(open);
          if (!open) {
            resetarFormEmbalagem();
            setMostrarFormEmbalagem(false);
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {tipoEditando
                ? `Editar tipo: ${tipoEditando.nome}`
                : "Adicionar tipo"}
            </DialogTitle>
          </DialogHeader>

          {/* Nome do tipo */}
          <div className="space-y-2 mt-2">
            <Label htmlFor="tipoNome">Nome do tipo</Label>
            <div className="flex gap-2">
              <Input
                id="tipoNome"
                placeholder="Ex: Cat 1, Premium..."
                value={tipoNome}
                onChange={(e) => setTipoNome(e.target.value)}
                disabled={salvandoTipo}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    aoSalvarTipo();
                  }
                }}
                className="flex-1"
              />
              <Button onClick={aoSalvarTipo} disabled={salvandoTipo}>
                {salvandoTipo ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : tipoEditando ? (
                  "Atualizar"
                ) : (
                  "Criar tipo"
                )}
              </Button>
            </div>
          </div>

          {/* Seção embalagens — só quando há tipo salvo */}
          {tipoEditando && (
            <div className="mt-5 border-t pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Embalagens</h3>
                <Button
                  size="sm"
                  variant={
                    mostrarFormEmbalagem && !embalagemEditando
                      ? "outline"
                      : "default"
                  }
                  onClick={() => {
                    if (mostrarFormEmbalagem) {
                      resetarFormEmbalagem();
                      setMostrarFormEmbalagem(false);
                    } else {
                      setMostrarFormEmbalagem(true);
                    }
                  }}
                >
                  {mostrarFormEmbalagem && !embalagemEditando ? (
                    <>
                      <ChevronUp className="mr-2 h-4 w-4" />
                      Cancelar
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar embalagem
                    </>
                  )}
                </Button>
              </div>

              {/* Formulário inline de embalagem */}
              {mostrarFormEmbalagem && (
                <div className="rounded-md border p-4 bg-muted/30 space-y-3">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {embalagemEditando
                      ? "Editando embalagem"
                      : "Nova embalagem"}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="embNome">Nome</Label>
                      <Input
                        id="embNome"
                        placeholder="Ex: Caixa 22kg"
                        value={embNome}
                        onChange={(e) => setEmbNome(e.target.value)}
                        disabled={salvandoEmbalagem}
                        maxLength={32}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="embSku">SKU</Label>
                      <Input
                        id="embSku"
                        type="number"
                        placeholder="Ex: 1001"
                        value={embSku}
                        onChange={(e) => setEmbSku(e.target.value)}
                        disabled={salvandoEmbalagem}
                        min={1}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        resetarFormEmbalagem();
                        setMostrarFormEmbalagem(false);
                      }}
                      disabled={salvandoEmbalagem}
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      onClick={aoSalvarEmbalagem}
                      disabled={salvandoEmbalagem}
                    >
                      {salvandoEmbalagem ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Salvando...
                        </>
                      ) : embalagemEditando ? (
                        "Atualizar"
                      ) : (
                        "Adicionar"
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Tabela de embalagens */}
              {carregandoEmbalagens ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin text-xl text-muted-foreground">
                    ◌
                  </div>
                </div>
              ) : embalagensTipo.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma embalagem cadastrada.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead className="w-24">SKU</TableHead>
                      <TableHead className="w-20 text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {embalagensTipo.map((emb) => (
                      <TableRow key={emb.id}>
                        <TableCell className="font-medium">
                          {emb.nome}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {emb.sku}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => iniciarEdicaoEmbalagem(emb)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                              onClick={() => setConfirmEmbalagem(emb)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setModalAberta(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmacaoExclusao
        open={!!confirmTipo}
        onOpenChange={(v) => { if (!v) setConfirmTipo(null); }}
        onConfirmar={aoRemoverTipo}
      />
      <ConfirmacaoExclusao
        open={!!confirmEmbalagem}
        onOpenChange={(v) => { if (!v) setConfirmEmbalagem(null); }}
        onConfirmar={aoRemoverEmbalagem}
      />
    </ProtectedAdminRoute>
  );
}
