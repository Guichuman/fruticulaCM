"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { Truck, Plus, Edit, Trash2, User, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ConfirmacaoExclusao } from "@/components/confirmacao-exclusao";
import { api } from "@/lib/api";

interface Caminhao {
  id: number;
  placa: string;
  modelo: string;
  qtdBlocos: number;
  status: string;
  motorista?: { nome: string };
}

export default function PaginaCaminhoes() {
  const roteador = useRouter();
  const [caminhoes, setCaminhoes] = useState<Caminhao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;
  const [confirmacao, setConfirmacao] = useState<{ id: number; placa: string } | null>(null);
  const [excluindoId, setExcluindoId] = useState<number | null>(null);
  const [navegandoPara, setNavegandoPara] = useState<number | null>(null);

  const caminhoesFiltrados = caminhoes.filter((c) =>
    c.placa.toLowerCase().includes(termoPesquisa.toLowerCase())
  );
  const totalPaginas = Math.ceil(caminhoesFiltrados.length / itensPorPagina);
  const indiceInicio = (paginaAtual - 1) * itensPorPagina;
  const caminhoesPaginados = caminhoesFiltrados.slice(indiceInicio, indiceInicio + itensPorPagina);

  useEffect(() => { setPaginaAtual(1); }, [termoPesquisa]);

  useEffect(() => {
    const buscarCaminhoes = async () => {
      try {
        const dados = await api.get<Caminhao[]>('/caminhao');
        setCaminhoes(dados);
      } catch (erro) {
        toast.error("Erro ao carregar caminhões");
      } finally {
        setCarregando(false);
      }
    };
    buscarCaminhoes();
  }, []);

  const aoExcluir = async () => {
    if (!confirmacao) return;
    const { id, placa } = confirmacao;
    setExcluindoId(id);
    try {
      await api.delete(`/caminhao/${id}`);
      setCaminhoes((prev) => prev.filter((c) => c.id !== id));
      toast.success(`Caminhão ${placa} excluído com sucesso`);
      setConfirmacao(null);
    } catch (erro) {
      toast.error(erro instanceof Error ? erro.message : "Erro ao excluir caminhão");
    } finally {
      setExcluindoId(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-primary">Caminhões</h1>
              <p className="text-muted-foreground">Gerencie sua frota de caminhões</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90" onClick={() => roteador.push("/caminhoes/novo")}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Caminhão
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Truck className="mr-2 h-5 w-5" />
                Lista de Caminhões
              </CardTitle>
              <CardDescription>
                {termoPesquisa ? `${caminhoesFiltrados.length} caminhão(ões) encontrado(s)` : `${caminhoes.length} caminhão(ões) cadastrado(s)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {carregando ? (
                <div className="flex items-center justify-center py-10"><div className="animate-spin text-4xl">◌</div></div>
              ) : caminhoes.length > 0 ? (
                <>
                  <div className="mb-4">
                    <div className="relative max-w-sm">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input placeholder="Pesquisar por placa..." value={termoPesquisa} onChange={(e) => setTermoPesquisa(e.target.value)} className="pl-10" />
                    </div>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Placa</TableHead>
                        <TableHead>Modelo</TableHead>
                        <TableHead>Qtd. Blocos</TableHead>
                        <TableHead>Motorista</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {caminhoesPaginados.map((caminhao) => (
                        <TableRow key={caminhao.id}>
                          <TableCell className="font-medium">{caminhao.placa}</TableCell>
                          <TableCell>{caminhao.modelo}</TableCell>
                          <TableCell>{caminhao.qtdBlocos}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              {caminhao.motorista?.nome || "Sem motorista"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={caminhao.status === 'A' ? "default" : "secondary"}>{caminhao.status === 'A' ? 'Ativo' : 'Inativo'}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                disabled={navegandoPara === caminhao.id || excluindoId === caminhao.id}
                                onClick={() => { setNavegandoPara(caminhao.id); roteador.push(`/caminhoes/editar/${caminhao.id}`); }}
                              >
                                {navegandoPara === caminhao.id
                                  ? <Loader2 className="h-4 w-4 animate-spin" />
                                  : <Edit className="h-4 w-4" />}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive h-8 w-8 p-0"
                                disabled={excluindoId === caminhao.id || navegandoPara === caminhao.id}
                                onClick={() => setConfirmacao({ id: caminhao.id, placa: caminhao.placa })}
                              >
                                {excluindoId === caminhao.id
                                  ? <Loader2 className="h-4 w-4 animate-spin" />
                                  : <Trash2 className="h-4 w-4" />}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
                  <Truck className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum caminhão cadastrado</h3>
                  <Button onClick={() => roteador.push("/caminhoes/novo")}><Plus className="mr-2 h-4 w-4" />Adicionar Caminhão</Button>
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
    </ProtectedRoute>
  );
}
