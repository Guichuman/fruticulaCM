"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { Users, Plus, Edit, Trash2, Search, Loader2, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ProtectedAdminRoute } from "@/components/ProtectedAdminRoute";
import { ConfirmacaoExclusao } from "@/components/confirmacao-exclusao";
import { api } from "@/lib/api";

interface Usuario {
  id: number;
  nome: string;
  username: string;
  status: string;
  perfil: "A" | "F";
}

export default function PaginaUsuarios() {
  const roteador = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [confirmacao, setConfirmacao] = useState<Usuario | null>(null);
  const [excluindoId, setExcluindoId] = useState<number | null>(null);
  const [navegandoPara, setNavegandoPara] = useState<number | null>(null);
  const [adicionando, setAdicionando] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nome.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
      u.username.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  const totalPaginas = Math.ceil(usuariosFiltrados.length / itensPorPagina);
  const indiceInicio = (paginaAtual - 1) * itensPorPagina;
  const indiceFim = indiceInicio + itensPorPagina;
  const usuariosPaginados = usuariosFiltrados.slice(indiceInicio, indiceFim);

  useEffect(() => {
    setPaginaAtual(1);
  }, [termoPesquisa]);

  useEffect(() => {
    api
      .get<Usuario[]>("/usuario")
      .then(setUsuarios)
      .catch(() => toast.error("Erro ao carregar usuários"))
      .finally(() => setCarregando(false));
  }, []);

  const aoExcluir = async () => {
    if (!confirmacao) return;
    const { id, nome } = confirmacao;
    setExcluindoId(id);
    try {
      await api.delete(`/usuario/${id}`);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
      toast.success(`Usuário ${nome} excluído com sucesso`);
    } catch (erro) {
      toast.error(erro instanceof Error ? erro.message : "Erro ao excluir usuário");
    } finally {
      setExcluindoId(null);
      setConfirmacao(null);
    }
  };

  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-primary">Usuários</h1>
              <p className="text-muted-foreground">Gerencie os usuários do sistema</p>
            </div>
            <Button
              className="bg-primary hover:bg-primary/90"
              disabled={adicionando}
              onClick={() => { setAdicionando(true); roteador.push("/usuarios/novo"); }}
            >
              {adicionando
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Carregando...</>
                : <><Plus className="mr-2 h-4 w-4" />Adicionar Funcionário</>}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Users className="mr-2 h-5 w-5" />
                Lista de Usuários
              </CardTitle>
              <CardDescription>
                {termoPesquisa
                  ? `${usuariosFiltrados.length} usuário(s) encontrado(s) de ${usuarios.length} total`
                  : `${usuarios.length} usuário(s) cadastrado(s)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {carregando ? (
                <div className="flex items-center justify-center py-10">
                  <div className="text-center">
                    <div className="animate-spin text-4xl mb-4">◌</div>
                    <p className="text-muted-foreground">Carregando usuários...</p>
                  </div>
                </div>
              ) : usuarios.length > 0 ? (
                <>
                  <div className="mb-4">
                    <div className="relative max-w-sm">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Pesquisar por nome ou usuário..."
                        value={termoPesquisa}
                        onChange={(e) => setTermoPesquisa(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {usuariosPaginados.length > 0 ? (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nome</TableHead>
                            <TableHead>Usuário</TableHead>
                            <TableHead>Perfil</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {usuariosPaginados.map((usuario) => (
                            <TableRow key={usuario.id}>
                              <TableCell className="font-medium">{usuario.nome}</TableCell>
                              <TableCell className="text-muted-foreground">@{usuario.username}</TableCell>
                              <TableCell>
                                {usuario.perfil === "A" ? (
                                  <Badge className="bg-purple-600 hover:bg-purple-700 gap-1">
                                    <ShieldCheck className="h-3 w-3" />
                                    Administrador
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="gap-1">
                                    <User className="h-3 w-3" />
                                    Funcionário
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge variant={usuario.status === "A" ? "default" : "secondary"}>
                                  {usuario.status === "A" ? "Ativo" : "Inativo"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    disabled={navegandoPara === usuario.id || excluindoId === usuario.id}
                                    onClick={() => { setNavegandoPara(usuario.id); roteador.push(`/usuarios/editar/${usuario.id}`); }}
                                  >
                                    {navegandoPara === usuario.id
                                      ? <Loader2 className="h-4 w-4 animate-spin" />
                                      : <Edit className="h-4 w-4" />}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                                    disabled={excluindoId === usuario.id || navegandoPara === usuario.id}
                                    onClick={() => setConfirmacao(usuario)}
                                  >
                                    {excluindoId === usuario.id
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
                            Mostrando {indiceInicio + 1} a {Math.min(indiceFim, usuariosFiltrados.length)} de {usuariosFiltrados.length} usuários
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
                      <h3 className="text-lg font-semibold mb-2">Nenhum usuário encontrado</h3>
                      <p className="text-muted-foreground mb-4">
                        Não encontramos usuários com o termo &quot;{termoPesquisa}&quot;.
                      </p>
                      <Button variant="outline" onClick={() => setTermoPesquisa("")}>Limpar pesquisa</Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-10">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum usuário cadastrado</h3>
                  <Button onClick={() => { setAdicionando(true); roteador.push("/usuarios/novo"); }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Primeiro Funcionário
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
