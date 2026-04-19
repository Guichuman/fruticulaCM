"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { Package2, ArrowLeft, Loader2 } from "lucide-react";
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
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { api } from "@/lib/api";

type Embalagem = {
  id: number;
  nome: string;
};

type ErrosCampo = {
  nome?: string;
};

export default function EditarEmbalagemPage() {
  const roteador = useRouter();
  const params = useParams();
  const embalagemId = params.id as string;

  const [nome, setNome] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [voltando, setVoltando] = useState(false);
  const [errosCampo, setErrosCampo] = useState<ErrosCampo>({});

  useEffect(() => {
    const buscarEmbalagem = async () => {
      try {
        const embalagem = await api.get<Embalagem>(`/embalagem/${embalagemId}`);
        setNome(embalagem.nome);
      } catch (erro) {
        console.error("Erro ao buscar embalagem:", erro);
        toast.error("Embalagem não encontrada");
        roteador.push("/embalagens");
      } finally {
        setCarregandoDados(false);
      }
    };

    if (embalagemId) {
      buscarEmbalagem();
    }
  }, [embalagemId, roteador]);

  const validarCampos = (): ErrosCampo => {
    const erros: ErrosCampo = {};
    if (!nome.trim()) {
      erros.nome = "Nome da embalagem é obrigatório";
    } else if (nome.trim().length < 2) {
      erros.nome = "Nome deve ter pelo menos 2 caracteres";
    }
    return erros;
  };

  const aoEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrosCampo({});

    const errosLocais = validarCampos();
    if (Object.keys(errosLocais).length > 0) {
      setErrosCampo(errosLocais);
      toast.error("Por favor, corrija os erros nos campos destacados");
      return;
    }

    setCarregando(true);
    try {
      await api.patch(`/embalagem/${embalagemId}`, { nome: nome.trim() });
      toast.success("Embalagem atualizada com sucesso!", {
        description: `${nome} foi atualizada no sistema.`,
        duration: 4000,
      });
      setTimeout(() => roteador.push("/embalagens"), 2000);
    } catch (erro) {
      const mensagem =
        erro instanceof Error ? erro.message : "Erro ao atualizar embalagem";
      toast.error(mensagem);
    } finally {
      setCarregando(false);
    }
  };

  if (carregandoDados) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <NavBar />
          <div className="container mx-auto py-10 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin text-4xl mb-4">◌</div>
              <p className="text-muted-foreground">
                Carregando dados da embalagem...
              </p>
            </div>
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
          <div className="max-w-2xl mx-auto">
            <Button
              variant="outline"
              className="mb-6 bg-transparent"
              disabled={voltando || carregando}
              onClick={() => {
                setVoltando(true);
                roteador.push("/embalagens");
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
                  Voltar para Embalagens
                </>
              )}
            </Button>

            <Card>
              <CardHeader className="bg-primary/10">
                <CardTitle className="flex items-center text-primary">
                  <Package2 className="mr-2 h-5 w-5" />
                  Editar Embalagem
                </CardTitle>
                <CardDescription>
                  Atualize os dados da embalagem
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form className="space-y-4" onSubmit={aoEnviar}>
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome da Embalagem</Label>
                    <Input
                      id="nome"
                      placeholder="Ex: Caixa de papelão, Saco plástico, Bandeja..."
                      value={nome}
                      onChange={(e) => {
                        setNome(e.target.value);
                        if (errosCampo.nome) {
                          setErrosCampo((prev) => ({
                            ...prev,
                            nome: undefined,
                          }));
                        }
                      }}
                      className={
                        errosCampo.nome
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }
                    />
                    {errosCampo.nome && (
                      <p className="text-sm text-red-600">{errosCampo.nome}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={carregando}
                  >
                    {carregando ? (
                      <>
                        <span className="animate-spin mr-2">◌</span>
                        Atualizando...
                      </>
                    ) : (
                      <>
                        <Package2 className="mr-2 h-4 w-4" />
                        Atualizar Embalagem
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
