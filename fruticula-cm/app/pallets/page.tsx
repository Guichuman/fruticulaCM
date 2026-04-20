"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { Layers, Plus, Edit, Trash2, Search, Loader2 } from "lucide-react";
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
import { ProtectedAdminRoute } from "@/components/ProtectedAdminRoute";
import { api } from "@/lib/api";

type Carga = {
  id: number;
  numeroCarga?: number;
  destino?: string;
};

type Pallet = {
  id: number;
  lado: string;
  bloco: number;
  idCarga: number;
  carga?: Carga;
};

export default function PalletsPage() {
  const roteador = useRouter();
  const [pallets, setPallets] = useState<Pallet[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [confirmacao, setConfirmacao] = useState<Pallet | null>(null);
  const [excluindoId, setExcluindoId] = useState<number | null>(null);
  const [navegandoPara, setNavegandoPara] = useState<number | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  const palletsFiltrados = pallets.filter((pallet) =>
    pallet.lado.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
    String(pallet.bloco).includes(termoPesquisa) ||
    String(pallet.idCarga).includes(termoPesquisa)
  );

  const totalPaginas = Math.ceil(palletsFiltrados.length / itensPorPagina);
  const indiceInicio = (paginaAtual - 1) * itensPorPagina;
  const indiceFim = indiceInicio + itensPorPagina;
  const palletsAtuais = palletsFiltrados.slice(indiceInicio, indiceFim);

  useEffect(() => {
    setPaginaAtual(1);
  }, [termoPesquisa]);

  useEffect(() => {
    const buscarPallets = async () => {
      try {
        const dados = await api.get<Pallet[]>("/pallet");
        setPallets(dados);
      } catch (erro) {
        console.error("Erro ao buscar pallets:", erro);
        toast.error("Erro ao carregar pallets");
      } finally {
        setCarregando(false);
      }
    };

    buscarPallets();
  }, []);

  const aoExcluir = async () => {
    if (!confirmacao) return;
    const { id } = confirmacao;
    setExcluindoId(id);
    try {
      await api.delete(`/pallet/${id}`);
      setPallets((prev) => prev.filter((p) => p.id !== id));
      toast.success(`Pallet #${id} excluído com sucesso`);
      setConfirmacao(null);
    } catch (erro) {
      toast.error("Erro ao excluir pallet");
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
              <h1 className="text-3xl font-bold text-primary">Pallets</h1>
              <p className="text-muted-foreground">
                Gerencie os pallets de cargas
              </p>
            </div>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => roteador.push("/pallets/novo")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Pallet
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Layers className="mr-2 h-5 w-5" />
                Lista de Pallets
              </CardTitle>
              <CardDescription>
                {termoPesquisa
                  ? `${palletsFiltrados.length} pallet(s) encontrado(s) de ${pallets.length} total`
                  : `${pallets.length} pallet(s) cadastrado(s)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {carregando ? (
                <div className="flex items-center justify-center py-10">
                  <div className="text-center">
                    <div className="animate-spin text-4xl mb-4">◌</div>
                    <p className="text-muted-foreground">Carregando pallets...</p>
                  </div>
                </div>
              ) : pallets.length > 0 ? (
                <>
                  <div className="mb-4">
                    <div className="relative max-w-sm">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Pesquisar por lado, bloco ou carga..."
                        value={termoPesquisa}
                        onChange={(e) => setTermoPesquisa(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {palletsAtuais.length > 0 ? (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="font-semibold">ID</TableHead>
                            <TableHead className="font-semibold">Lado</TableHead>
                            <TableHead className="font-semibold">Bloco</TableHead>
                            <TableHead className="font-semibold">Carga</TableHead>
                            <TableHead className="text-center font-semibold w-32">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {palletsAtuais.map((pallet) => (
                            <TableRow key={pallet.id} className="hover:bg-muted/50">
                              <TableCell className="font-medium">#{pallet.id}</TableCell>
                              <TableCell>
                                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                                  {pallet.lado}
                                </span>
                              </TableCell>
                              <TableCell>{pallet.bloco}</TableCell>
                              <TableCell>
                                {pallet.carga
                                  ? `Carga #${pallet.idCarga}${pallet.carga.destino ? ` — ${pallet.carga.destino}` : ""}`
                                  : `Carga #${pallet.idCarga}`}
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="flex justify-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    disabled={navegandoPara === pallet.id || excluindoId === pallet.id}
                                    onClick={() => { setNavegandoPara(pallet.id); roteador.push(`/pallets/editar/${pallet.id}`); }}
                                  >
                                    {navegandoPara === pallet.id
                                      ? <Loader2 className="h-4 w-4 animate-spin" />
                                      : <Edit className="h-4 w-4" />}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive/90 h-8 w-8 p-0"
                                    disabled={excluindoId === pallet.id || navegandoPara === pallet.id}
                                    onClick={() => setConfirmacao(pallet)}
                                  >
                                    {excluindoId === pallet.id
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
                            Mostrando {indiceInicio + 1} a{" "}
                            {Math.min(indiceFim, palletsFiltrados.length)} de{" "}
                            {palletsFiltrados.length} pallets
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
                      <h3 className="text-lg font-semibold mb-2">Nenhum pallet encontrado</h3>
                      <p className="text-muted-foreground mb-4">
                        Não encontramos pallets com o termo &quot;{termoPesquisa}&quot;.
                      </p>
                      <Button variant="outline" onClick={() => setTermoPesquisa("")}>
                        Limpar pesquisa
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-10">
                  <Layers className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum pallet cadastrado</h3>
                  <p className="text-muted-foreground mb-4">
                    Comece adicionando o primeiro pallet.
                  </p>
                  <Button onClick={() => roteador.push("/pallets/novo")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Primeiro Pallet
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
