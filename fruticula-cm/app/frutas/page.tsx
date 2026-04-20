"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { Apple, Plus, Edit, Trash2, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ProtectedAdminRoute } from "@/components/ProtectedAdminRoute";
import { ConfirmacaoExclusao } from "@/components/confirmacao-exclusao";
import { api } from "@/lib/api";

interface Fruta { id: number; nome: string; }

export default function PaginaFrutas() {
  const roteador = useRouter();
  const [frutas, setFrutas] = useState<Fruta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;
  const [confirmacao, setConfirmacao] = useState<Fruta | null>(null);
  const [excluindoId, setExcluindoId] = useState<number | null>(null);
  const [navegandoPara, setNavegandoPara] = useState<number | null>(null);
  const [adicionandoNovo, setAdicionandoNovo] = useState(false);

  const frutasFiltradas = frutas.filter((f) => f.nome.toLowerCase().includes(termoPesquisa.toLowerCase()));
  const totalPaginas = Math.ceil(frutasFiltradas.length / itensPorPagina);
  const indiceInicio = (paginaAtual - 1) * itensPorPagina;
  const frutasPaginadas = frutasFiltradas.slice(indiceInicio, indiceInicio + itensPorPagina);

  useEffect(() => { setPaginaAtual(1); }, [termoPesquisa]);

  useEffect(() => {
    api.get<Fruta[]>('/fruta').then(setFrutas).catch(() => toast.error("Erro ao carregar frutas")).finally(() => setCarregando(false));
  }, []);

  const aoExcluir = async () => {
    if (!confirmacao) return;
    const { id, nome } = confirmacao;
    setExcluindoId(id);
    try {
      await api.delete(`/fruta/${id}`);
      setFrutas((prev) => prev.filter((f) => f.id !== id));
      toast.success(`Fruta ${nome} excluída com sucesso`);
      setConfirmacao(null);
    } catch (erro) {
      toast.error(erro instanceof Error ? erro.message : "Erro ao excluir fruta");
    } finally {
      setExcluindoId(null);
    }
  };

  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto py-10">
          <div className="flex items-center justify-between mb-6">
            <div><h1 className="text-3xl font-bold text-primary">Frutas</h1><p className="text-muted-foreground">Gerencie seu inventário de frutas</p></div>
            <Button className="bg-primary hover:bg-primary/90" disabled={adicionandoNovo} onClick={() => { setAdicionandoNovo(true); roteador.push("/frutas/novo"); }}>
              {adicionandoNovo ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Aguarde...</> : <><Plus className="mr-2 h-4 w-4" />Adicionar Fruta</>}
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary"><Apple className="mr-2 h-5 w-5" />Lista de Frutas</CardTitle>
              <CardDescription>{termoPesquisa ? `${frutasFiltradas.length} fruta(s) encontrada(s)` : `${frutas.length} fruta(s) cadastrada(s)`}</CardDescription>
            </CardHeader>
            <CardContent>
              {carregando ? (
                <div className="flex items-center justify-center py-10"><div className="animate-spin text-4xl">◌</div></div>
              ) : frutas.length > 0 ? (
                <>
                  <div className="mb-4">
                    <div className="relative max-w-sm">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input placeholder="Pesquisar por nome..." value={termoPesquisa} onChange={(e) => setTermoPesquisa(e.target.value)} className="pl-10" />
                    </div>
                  </div>
                  <div className="max-w-lg mx-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead className="text-right w-24">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {frutasPaginadas.map((fruta) => (
                          <TableRow key={fruta.id}>
                            <TableCell className="font-medium">{fruta.nome}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  disabled={navegandoPara === fruta.id || excluindoId === fruta.id}
                                  onClick={() => { setNavegandoPara(fruta.id); roteador.push(`/frutas/editar/${fruta.id}`); }}
                                >
                                  {navegandoPara === fruta.id
                                    ? <Loader2 className="h-4 w-4 animate-spin" />
                                    : <Edit className="h-4 w-4" />}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                                  disabled={excluindoId === fruta.id || navegandoPara === fruta.id}
                                  onClick={() => setConfirmacao(fruta)}
                                >
                                  {excluindoId === fruta.id
                                    ? <Loader2 className="h-4 w-4 animate-spin" />
                                    : <Trash2 className="h-4 w-4" />}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {totalPaginas > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-sm text-muted-foreground">Página {paginaAtual} de {totalPaginas}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setPaginaAtual(p => p - 1)} disabled={paginaAtual === 1}>Anterior</Button>
                        <Button variant="outline" size="sm" onClick={() => setPaginaAtual(p => p + 1)} disabled={paginaAtual === totalPaginas}>Próxima</Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-10">
                  <Apple className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhuma fruta cadastrada</h3>
                  <Button disabled={adicionandoNovo} onClick={() => { setAdicionandoNovo(true); roteador.push("/frutas/novo"); }}>
                    {adicionandoNovo ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Aguarde...</> : <><Plus className="mr-2 h-4 w-4" />Adicionar Primeira Fruta</>}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <ConfirmacaoExclusao
        open={!!confirmacao}
        onOpenChange={(v) => { if (!v && !excluindoId) setConfirmacao(null); }}
        onConfirmar={aoExcluir}
        carregando={excluindoId !== null}
      />
    </ProtectedAdminRoute>
  );
}
