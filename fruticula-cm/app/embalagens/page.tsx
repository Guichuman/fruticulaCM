"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { Package2, Plus, Edit, Trash2, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmacaoExclusao } from "@/components/confirmacao-exclusao";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { api } from "@/lib/api";

type Embalagem = {
  id: number;
  nome: string;
};

export default function EmbalagensPage() {
  const roteador = useRouter();
  const [embalagens, setEmbalagens] = useState<Embalagem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [confirmacao, setConfirmacao] = useState<Embalagem | null>(null);
  const [excluindoId, setExcluindoId] = useState<number | null>(null);
  const [navegandoPara, setNavegandoPara] = useState<number | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  const embalagensFiltradasList = embalagens.filter((embalagem) =>
    embalagem.nome.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  const totalPaginas = Math.ceil(embalagensFiltradasList.length / itensPorPagina);
  const indiceInicio = (paginaAtual - 1) * itensPorPagina;
  const indiceFim = indiceInicio + itensPorPagina;
  const embalagensAtuais = embalagensFiltradasList.slice(indiceInicio, indiceFim);

  useEffect(() => {
    setPaginaAtual(1);
  }, [termoPesquisa]);

  useEffect(() => {
    const buscarEmbalagens = async () => {
      try {
        const dados = await api.get<Embalagem[]>("/embalagem");
        setEmbalagens(dados);
      } catch (erro) {
        console.error("Erro ao buscar embalagens:", erro);
        toast.error("Erro ao carregar embalagens");
      } finally {
        setCarregando(false);
      }
    };

    buscarEmbalagens();
  }, []);

  const aoExcluir = async () => {
    if (!confirmacao) return;
    const { id, nome } = confirmacao;
    setExcluindoId(id);
    try {
      await api.delete(`/embalagem/${id}`);
      setEmbalagens((prev) => prev.filter((e) => e.id !== id));
      toast.success(`Embalagem ${nome} excluída com sucesso`);
      setConfirmacao(null);
    } catch (erro) {
      toast.error("Erro ao excluir embalagem");
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
              <h1 className="text-3xl font-bold text-primary">Embalagens</h1>
              <p className="text-muted-foreground">
                Gerencie os tipos de embalagem
              </p>
            </div>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => roteador.push("/embalagens/novo")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Embalagem
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Package2 className="mr-2 h-5 w-5" />
                Lista de Embalagens
              </CardTitle>
              <CardDescription>
                {termoPesquisa
                  ? `${embalagensFiltradasList.length} embalagem(ns) encontrada(s) de ${embalagens.length} total`
                  : `${embalagens.length} embalagem(ns) cadastrada(s)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {carregando ? (
                <div className="flex items-center justify-center py-10">
                  <div className="text-center">
                    <div className="animate-spin text-4xl mb-4">◌</div>
                    <p className="text-muted-foreground">
                      Carregando embalagens...
                    </p>
                  </div>
                </div>
              ) : embalagens.length > 0 ? (
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

                  {embalagensAtuais.length > 0 ? (
                    <>
                      <div className="max-w-2xl mx-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-center font-semibold">
                                Nome
                              </TableHead>
                              <TableHead className="text-center font-semibold w-32">
                                Ações
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {embalagensAtuais.map((embalagem) => (
                              <TableRow
                                key={embalagem.id}
                                className="hover:bg-muted/50"
                              >
                                <TableCell className="font-medium text-center py-4">
                                  {embalagem.nome}
                                </TableCell>
                                <TableCell className="text-center py-4">
                                  <div className="flex justify-center gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      disabled={navegandoPara === embalagem.id || excluindoId === embalagem.id}
                                      onClick={() => {
                                        setNavegandoPara(embalagem.id);
                                        roteador.push(`/embalagens/editar/${embalagem.id}`);
                                      }}
                                    >
                                      {navegandoPara === embalagem.id
                                        ? <Loader2 className="h-4 w-4 animate-spin" />
                                        : <Edit className="h-4 w-4" />}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-destructive hover:text-destructive/90 h-8 w-8 p-0"
                                      disabled={excluindoId === embalagem.id || navegandoPara === embalagem.id}
                                      onClick={() => setConfirmacao(embalagem)}
                                    >
                                      {excluindoId === embalagem.id
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
                          <p className="text-sm text-muted-foreground">
                            Mostrando {indiceInicio + 1} a{" "}
                            {Math.min(indiceFim, embalagensFiltradasList.length)} de{" "}
                            {embalagensFiltradasList.length} embalagens
                          </p>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPaginaAtual(paginaAtual - 1)}
                              disabled={paginaAtual === 1}
                            >
                              Anterior
                            </Button>
                            <span className="text-sm">
                              Página {paginaAtual} de {totalPaginas}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPaginaAtual(paginaAtual + 1)}
                              disabled={paginaAtual === totalPaginas}
                            >
                              Próxima
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-10">
                      <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Nenhuma embalagem encontrada
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Não encontramos embalagens com o termo &quot;{termoPesquisa}&quot;.
                      </p>
                      <Button variant="outline" onClick={() => setTermoPesquisa("")}>
                        Limpar pesquisa
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-10">
                  <Package2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Nenhuma embalagem cadastrada
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Comece adicionando seu primeiro tipo de embalagem.
                  </p>
                  <Button onClick={() => roteador.push("/embalagens/novo")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Primeira Embalagem
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
    </ProtectedRoute>
  );
}
