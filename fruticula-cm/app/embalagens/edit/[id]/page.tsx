"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { Package2, ArrowLeft } from "lucide-react";
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

type Embalagem = {
  id: number;
  nome: string;
};

type FieldErrors = {
  nome?: string;
};

export default function EditEmbalagemPage() {
  const router = useRouter();
  const params = useParams();
  const embalagemId = params.id as string;

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    const fetchEmbalagem = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/embalagem/${embalagemId}`
        );
        if (response.ok) {
          const embalagem: Embalagem = await response.json();
          setNome(embalagem.nome);
        } else {
          toast.error("Embalagem não encontrada");
          router.push("/embalagens");
        }
      } catch (error) {
        console.error("Erro ao buscar embalagem:", error);
        toast.error("Erro ao carregar dados da embalagem");
        router.push("/embalagens");
      } finally {
        setIsLoadingData(false);
      }
    };

    if (embalagemId) {
      fetchEmbalagem();
    }
  }, [embalagemId, router]);

  const validateFields = (): FieldErrors => {
    const errors: FieldErrors = {};

    if (!nome.trim()) {
      errors.nome = "Nome da embalagem é obrigatório";
    } else if (nome.trim().length < 2) {
      errors.nome = "Nome deve ter pelo menos 2 caracteres";
    }

    return errors;
  };

  const processApiErrors = (errorData: any) => {
    const errors: FieldErrors = {};

    if (errorData.message) {
      if (Array.isArray(errorData.message)) {
        errorData.message.forEach((msg: string) => {
          if (msg.includes("nome")) {
            errors.nome = msg;
          }
        });
      } else if (typeof errorData.message === "string") {
        // Processar mensagem única
        const message = errorData.message.toLowerCase();
        if (message.includes("nome")) {
          errors.nome = errorData.message;
        } else {
          toast.error(errorData.message);
        }
      }
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFieldErrors({});

    const localErrors = validateFields();
    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors);
      toast.error("Por favor, corrija os erros nos campos destacados");
      return;
    }

    setIsLoading(true);

    try {
      const embalagemData = {
        nome: nome.trim(),
        descricao: descricao.trim() || undefined,
      };

      const response = await fetch(
        `http://localhost:3000/embalagem/${embalagemId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(embalagemData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        const apiErrors = processApiErrors(errorData);

        if (Object.keys(apiErrors).length > 0) {
          setFieldErrors(apiErrors);
          toast.error("Erro de validação. Verifique os campos destacados.");
        } else {
          toast.error(errorData.message || "Erro ao atualizar embalagem");
        }

        return;
      }

      toast.success("Embalagem atualizada com sucesso!", {
        description: `${nome} foi atualizada no sistema.`,
        duration: 4000,
      });

      setTimeout(() => {
        router.push("/embalagens");
      }, 2000);
    } catch (err) {
      console.error("Erro na requisição:", err);
      toast.error("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <ProtectedRoute>
    <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto py-10">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin text-4xl mb-4">◌</div>
              <p className="text-muted-foreground">
                Carregando dados da embalagem...
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto py-10">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="outline"
            className="mb-6 bg-transparent"
            onClick={() => router.push("/embalagens")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Embalagens
          </Button>

          <Card>
            <CardHeader className="bg-primary/10">
              <CardTitle className="flex items-center text-primary">
                <Package2 className="mr-2 h-5 w-5" />
                Editar Embalagem
              </CardTitle>
              <CardDescription>Atualize os dados da embalagem</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome da Embalagem</Label>
                    <Input
                      id="name"
                      placeholder="Ex: Caixa de papelão, Saco plástico, Bandeja..."
                      value={nome}
                      onChange={(e) => {
                        setNome(e.target.value);
                        if (fieldErrors.nome) {
                          setFieldErrors((prev) => ({
                            ...prev,
                            nome: undefined,
                          }));
                        }
                      }}
                      className={
                        fieldErrors.nome
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }
                    />
                    {fieldErrors.nome && (
                      <p className="text-sm text-red-600">{fieldErrors.nome}</p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
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
