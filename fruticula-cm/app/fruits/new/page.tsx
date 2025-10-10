"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { Apple, ArrowLeft } from "lucide-react";
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

type FieldErrors = {
  nome?: string;
};

export default function NewFruitPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const clearForm = () => {
    setNome("");
    setFieldErrors({});
  };

  const validateFields = (): FieldErrors => {
    const errors: FieldErrors = {};

    if (!nome.trim()) {
      errors.nome = "Nome da fruta é obrigatório";
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
      const frutaData = {
        nome: nome.trim(),
        peso: 0,
        tipo: "Não especificado",
        sku: `SKU-${Date.now()}`,
        status: "ativo",
      };

      const response = await fetch("http://localhost:3000/fruta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(frutaData),
      });

      if (!response.ok) {
        const errorData = await response.json();

        const apiErrors = processApiErrors(errorData);

        if (Object.keys(apiErrors).length > 0) {
          setFieldErrors(apiErrors);
          toast.error("Erro de validação. Verifique os campos destacados.");
        } else {
          toast.error(errorData.message || "Erro ao cadastrar fruta");
        }

        return;
      }

      const createdFruit = await response.json();

      toast.success("Fruta cadastrada com sucesso!", {
        description: `${nome} foi adicionada ao inventário. Redirecionando para edição...`,
        duration: 3000,
      });

      setTimeout(() => {
        router.push(`/fruits/edit/${createdFruit.id}`);
      }, 1500);
    } catch (err) {
      console.error("Erro na requisição:", err);
      toast.error("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto py-10">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="outline"
            className="mb-6 bg-transparent"
            onClick={() => router.push("/fruits")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Frutas
          </Button>

          <Card>
            <CardHeader className="bg-primary/10">
              <CardTitle className="flex items-center text-primary">
                <Apple className="mr-2 h-5 w-5" />
                Cadastrar Fruta
              </CardTitle>
              <CardDescription>
                Adicione uma nova fruta ao inventário. Os detalhes podem ser
                configurados após o cadastro.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Fruta</Label>
                  <Input
                    id="name"
                    placeholder="Digite o nome da fruta"
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

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Apple className="h-5 w-5 text-blue-600 mt-0.5" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">
                        Sobre os detalhes da fruta
                      </h3>
                      <p className="text-sm text-blue-700 mt-1">
                        Após cadastrar a fruta, você será redirecionado para a
                        tela de edição onde poderá adicionar peso, tipo, SKU
                        personalizado e gerenciar as embalagens disponíveis.
                      </p>
                    </div>
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
                      <Apple className="mr-2 h-4 w-4" />
                      Cadastrar Fruta
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
