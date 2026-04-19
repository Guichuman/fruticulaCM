"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { Package, Plus, Eye, Truck, User, Calendar, ChevronLeft, ChevronRight, X, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { api } from "@/lib/api";
import { toast } from "sonner";

type Carga = {
  id: number;
  criadoEm: string;
  status: string;
  totalPallets: number;
  caminhao: {
    placa: string;
    qtdBlocos: number;
    palletBaixo: string;
    motorista?: { nome?: string };
  };
};

type RespostaPaginada = {
  dados: Carga[];
  total: number;
  pagina: number;
  totalPaginas: number;
};

type Filtro = 'C' | 'F';

const LIMITE = 20;

export default function PaginaCargas() {
  const roteador = useRouter();

  const [cargas, setCargas] = useState<Carga[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [navegandoPara, setNavegandoPara] = useState<number | null>(null);
  const [pesquisando, setPesquisando] = useState(false);
  const [filtro, setFiltro] = useState<Filtro>('C');
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [total, setTotal] = useState(0);
  const [rascunhoInicio, setRascunhoInicio] = useState('');
  const [rascunhoFim, setRascunhoFim] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const buscarCargas = useCallback(async (
    paginaAtual: number,
    statusAtual: Filtro,
    inicio: string,
    fim: string,
  ) => {
    setCarregando(true);
    try {
      let url = `/carga?pagina=${paginaAtual}&limite=${LIMITE}&status=${statusAtual}`;
      if (inicio) url += `&dataInicio=${inicio}`;
      if (fim) url += `&dataFim=${fim}`;
      const dados = await api.get<RespostaPaginada>(url);
      setCargas(dados.dados);
      setTotal(dados.total);
      setTotalPaginas(dados.totalPaginas);
    } catch {
      toast.error("Erro ao carregar cargas");
    } finally {
      setCarregando(false);
      setPesquisando(false);
    }
  }, []);

  useEffect(() => {
    buscarCargas(pagina, filtro, dataInicio, dataFim);
  }, [pagina, filtro, dataInicio, dataFim, buscarCargas]);

  const mudarFiltro = (novoFiltro: Filtro) => {
    setFiltro(novoFiltro);
    setPagina(1);
  };

  const pesquisar = () => {
    setPesquisando(true);
    setDataInicio(rascunhoInicio);
    setDataFim(rascunhoFim);
    setPagina(1);
  };

  const limparDatas = () => {
    setRascunhoInicio('');
    setRascunhoFim('');
    setDataInicio('');
    setDataFim('');
    setPagina(1);
  };

  const obterCorStatus = (status: string) => {
    switch (status) {
      case 'C': return "bg-yellow-500";
      case 'F': return "bg-green-500";
      case 'V': return "bg-gray-400";
      default:  return "bg-gray-500";
    }
  };

  const obterTextoStatus = (status: string) => {
    switch (status) {
      case 'C': return "Carregando";
      case 'F': return "Finalizada";
      case 'V': return "Vazia";
      default:  return status;
    }
  };

  const inicio = (pagina - 1) * LIMITE + 1;
  const fim = Math.min(pagina * LIMITE, total);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto py-10">

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-primary">Cargas</h1>
            <Button
              className="bg-primary hover:bg-primary/90"
              disabled={navegandoPara === -1}
              onClick={() => { setNavegandoPara(-1); roteador.push("/cargas/novo"); }}
            >
              {navegandoPara === -1
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Carregando...</>
                : <><Plus className="mr-2 h-4 w-4" />Nova Carga</>}
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <button
              type="button"
              disabled={carregando}
              onClick={() => mudarFiltro('C')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border-2 flex items-center gap-1.5 ${
                filtro === 'C'
                  ? 'bg-yellow-500 border-yellow-500 text-white shadow-md'
                  : 'bg-transparent border-yellow-400 text-yellow-600 hover:bg-yellow-50'
              } disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {carregando && filtro === 'C' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              Carregando
            </button>
            <button
              type="button"
              disabled={carregando}
              onClick={() => mudarFiltro('F')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border-2 flex items-center gap-1.5 ${
                filtro === 'F'
                  ? 'bg-green-600 border-green-600 text-white shadow-md'
                  : 'bg-transparent border-green-500 text-green-700 hover:bg-green-50'
              } disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {carregando && filtro === 'F' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              Finalizada
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground font-medium">De</label>
              <input
                type="date"
                value={rascunhoInicio}
                onChange={(e) => setRascunhoInicio(e.target.value)}
                className="border rounded-md px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground font-medium">Até</label>
              <input
                type="date"
                value={rascunhoFim}
                onChange={(e) => setRascunhoFim(e.target.value)}
                className="border rounded-md px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="button"
              disabled={carregando}
              onClick={pesquisar}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {pesquisando && carregando
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : <Search className="h-3.5 w-3.5" />}
              {pesquisando && carregando ? "Pesquisando..." : "Pesquisar"}
            </button>
            {(dataInicio || dataFim || rascunhoInicio || rascunhoFim) && (
              <button
                type="button"
                onClick={limparDatas}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-semibold border text-muted-foreground hover:bg-muted transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                Limpar
              </button>
            )}
          </div>

          {carregando ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin text-4xl mb-4">◌</div>
                <p className="text-muted-foreground">Carregando cargas...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[300px]">
                {cargas.length > 0 ? (
                  cargas.map((carga) => (
                    <Card key={carga.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Carga #{carga.id}</CardTitle>
                          <Badge className={obterCorStatus(carga.status)}>
                            {obterTextoStatus(carga.status)}
                          </Badge>
                        </div>
                        <CardDescription>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-4 w-4" />
                            {new Date(carga.criadoEm).toLocaleDateString("pt-BR")}
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-muted-foreground" />
                            <span>{carga.caminhao.placa}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{carga.caminhao.motorista?.nome || "Motorista não vinculado"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {carga.totalPallets} de{" "}
                              {carga.caminhao.qtdBlocos * (carga.caminhao.palletBaixo === 'S' ? 4 : 2)} pallets
                            </span>
                          </div>
                        </div>

                        <div className="mt-4">
                          {carga.status === 'C' ? (
                            <Button
                              size="sm"
                              className="w-full bg-primary hover:bg-primary/90"
                              disabled={navegandoPara === carga.id}
                              onClick={() => { setNavegandoPara(carga.id); roteador.push(`/cargas/carregamento/${carga.id}`); }}
                            >
                              {navegandoPara === carga.id
                                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Carregando...</>
                                : <><Eye className="mr-2 h-4 w-4" />Continuar Carregamento</>}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full bg-transparent"
                              disabled={navegandoPara === carga.id}
                              onClick={() => { setNavegandoPara(carga.id); roteador.push(`/cargas/resumo/${carga.id}`); }}
                            >
                              {navegandoPara === carga.id
                                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Carregando...</>
                                : <><Eye className="mr-2 h-4 w-4" />Visualizar</>}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-16">
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      {filtro === 'C' ? 'Nenhuma carga em andamento' : 'Nenhuma carga finalizada'}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {filtro === 'C'
                        ? 'Comece criando uma nova carga de entrega.'
                        : 'As cargas finalizadas aparecerão aqui.'}
                    </p>
                    {filtro === 'C' && (
                      <Button
                        disabled={navegandoPara === -1}
                        onClick={() => { setNavegandoPara(-1); roteador.push("/cargas/novo"); }}
                      >
                        {navegandoPara === -1
                          ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Carregando...</>
                          : <><Plus className="mr-2 h-4 w-4" />Criar Nova Carga</>}
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {totalPaginas > 1 && (
                <div className="flex items-center justify-between mt-8">
                  <p className="text-sm text-muted-foreground">
                    Exibindo <span className="font-medium">{inicio}–{fim}</span> de{" "}
                    <span className="font-medium">{total}</span> cargas
                  </p>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setPagina((p) => p - 1)}
                      disabled={pagina === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <span className="text-sm text-muted-foreground">
                      Página <span className="font-medium text-foreground">{pagina}</span> de{" "}
                      <span className="font-medium text-foreground">{totalPaginas}</span>
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setPagina((p) => p + 1)}
                      disabled={pagina === totalPaginas}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}