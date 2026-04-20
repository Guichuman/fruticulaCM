"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { User, Plus, Edit, Trash2, Phone, CreditCard, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ProtectedAdminRoute } from "@/components/ProtectedAdminRoute";
import { ConfirmacaoExclusao } from "@/components/confirmacao-exclusao";
import { api } from "@/lib/api";

interface Motorista {
  id: number;
  nome: string;
  telefone: string;
  cpf: string;
  status: string;
}

export default function PaginaMotoristas() {
  const roteador = useRouter();
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [confirmacao, setConfirmacao] = useState<Motorista | null>(null);
  const [excluindoId, setExcluindoId] = useState<number | null>(null);
  const [navegandoPara, setNavegandoPara] = useState<number | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  const motoristasFiltrados = motoristas.filter((motorista) =>
    motorista.nome.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  const totalPaginas = Math.ceil(motoristasFiltrados.length / itensPorPagina);
  const indiceInicio = (paginaAtual - 1) * itensPorPagina;
  const indiceFim = indiceInicio + itensPorPagina;
  const motoristasPaginados = motoristasFiltrados.slice(indiceInicio, indiceFim);

  useEffect(() => {
    setPaginaAtual(1);
  }, [termoPesquisa]);

  useEffect(() => {
    const buscarMotoristas = async () => {
      try {
        const dados = await api.get<Motorista[]>('/motorista');
        setMotoristas(dados);
      } catch (erro) {
        const mensagem = erro instanceof Error ? erro.message : "Erro ao carregar motoristas";
        toast.error(mensagem);
      } finally {
        setCarregando(false);
      }
    };
    buscarMotoristas();
  }, []);

  const aoExcluir = async () => {
    if (!confirmacao) return;
    const { id, nome } = confirmacao;
    setExcluindoId(id);
    try {
      await api.delete(`/motorista/${id}`);
      setMotoristas((prev) => prev.filter((m) => m.id !== id));
      toast.success(`Motorista ${nome} excluído com sucesso`);
      setConfirmacao(null);
    } catch (erro) {
      toast.error(erro instanceof Error ? erro.message : "Erro ao excluir motorista");
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
            <div>
              <h1 className="text-3xl font-bold text-primary">Motoristas</h1>
              <p className="text-muted-foreground">Gerencie seus motoristas de entrega</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90" onClick={() => roteador.push("/motoristas/novo")}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Motorista
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <User className="mr-2 h-5 w-5" />
                Lista de Motoristas
              </CardTitle>
              <CardDescription>
                {termoPesquisa
                  ? `${motoristasFiltrados.length} motorista(s) encontrado(s) de ${motoristas.length} total`
                  : `${motoristas.length} motorista(s) cadastrado(s)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {carregando ? (
                <div className="flex items-center justify-center py-10">
                  <div className="text-center">
                    <div className="animate-spin text-4xl mb-4">◌</div>
                    <p className="text-muted-foreground">Carregando motoristas...</p>
                  </div>
                </div>
              ) : motoristas.length > 0 ? (
                <>
                  <div className="mb-4">
                    <div className="relative max-w-sm">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Pesquisar por nome..."
                        value={termoPesquisa}
                        onChange={(e) => setTermoPesquisa(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  {motoristasPaginados.length > 0 ? (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Telefone</TableHead>
                            <TableHead>CPF</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {motoristasPaginados.map((motorista) => (
                            <TableRow key={motorista.id}>
                              <TableCell className="font-medium">{motorista.nome}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  {motorista.telefone}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                                  {motorista.cpf}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    disabled={navegandoPara === motorista.id || excluindoId === motorista.id}
                                    onClick={() => { setNavegandoPara(motorista.id); roteador.push(`/motoristas/editar/${motorista.id}`); }}
                                  >
                                    {navegandoPara === motorista.id
                                      ? <Loader2 className="h-4 w-4 animate-spin" />
                                      : <Edit className="h-4 w-4" />}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive/90 h-8 w-8 p-0"
                                    disabled={excluindoId === motorista.id || navegandoPara === motorista.id}
                                    onClick={() => setConfirmacao(motorista)}
                                  >
                                    {excluindoId === motorista.id
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
                          <p className="text-sm text-muted-foreground">
                            Mostrando {indiceInicio + 1} a {Math.min(indiceFim, motoristasFiltrados.length)} de {motoristasFiltrados.length} motoristas
                          </p>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => setPaginaAtual(paginaAtual - 1)} disabled={paginaAtual === 1}>Anterior</Button>
                            <span className="text-sm">Página {paginaAtual} de {totalPaginas}</span>
                            <Button variant="outline" size="sm" onClick={() => setPaginaAtual(paginaAtual + 1)} disabled={paginaAtual === totalPaginas}>Próxima</Button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-10">
                      <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Nenhum motorista encontrado</h3>
                      <p className="text-muted-foreground mb-4">Não encontramos motoristas com o termo "{termoPesquisa}".</p>
                      <Button variant="outline" onClick={() => setTermoPesquisa("")}>Limpar pesquisa</Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-10">
                  <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum motorista cadastrado</h3>
                  <p className="text-muted-foreground mb-4">Comece adicionando seu primeiro motorista de entrega.</p>
                  <Button onClick={() => roteador.push("/motoristas/novo")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Primeiro Motorista
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
