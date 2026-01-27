"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/ProtectedRoute";

type FieldErrors = {
  nome?: string;
  descricao?: string;
};

export default function NewEmbalagemPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const clearForm = () => {
    setNome("");
    setDescricao("");
    setFieldErrors({});
  };

  const validateFields = (): FieldErrors => {
    const errors: FieldErrors = {};

    if (!nome.trim()) {
      errors.nome = "Nome da embalagem é obrigatório";
    } else if (nome.trim().length < 2) {
      errors.nome = "Nome deve ter pelo menos 2 caracteres";
    }

    if (descricao.trim() && descricao.trim().length < 5) {
      errors.descricao = "Descrição deve ter pelo menos 5 caracteres";
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
          } else if (msg.includes("descricao")) {
            errors.descricao = msg;
          }
        });
      } else if (typeof errorData.message === "string") {
        const message = errorData.message.toLowerCase();
        if (message.includes("nome")) {
          errors.nome = errorData.message;
        } else if (message.includes("descricao")) {
          errors.descricao = errorData.message;
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

      const response = await fetch("http://localhost:3000/embalagem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(embalagemData),
      });

      if (!response.ok) {
        const errorData = await response.json();

        const apiErrors = processApiErrors(errorData);

        if (Object.keys(apiErrors).length > 0) {
          setFieldErrors(apiErrors);
          toast.error("Erro de validação. Verifique os campos destacados.");
        } else {
          toast.error(errorData.message || "Erro ao cadastrar embalagem");
        }

        return;
      }

      clearForm();
      toast.success("Embalagem cadastrada com sucesso!", {
        description: `${nome} foi adicionada ao sistema.`,
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

  return (
    <ProtectedRoute>
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
                Cadastrar Embalagem
              </CardTitle>
              <CardDescription>
                Adicione um novo tipo de embalagem para suas frutas
              </CardDescription>
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
                      Cadastrando...
                    </>
                  ) : (
                    <>
                      <Package2 className="mr-2 h-4 w-4" />
                      Cadastrar Embalagem
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
