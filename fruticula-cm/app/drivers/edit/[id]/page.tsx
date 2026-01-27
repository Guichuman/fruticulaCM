"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { User, ArrowLeft } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/ProtectedRoute";

type FieldErrors = {
  nome?: string;
  telefone?: string;
  cpf?: string;
};

type Driver = {
  id: number;
  nome: string;
  telefone: string;
  cpf: string;
};

export default function EditDriverPage() {
  const router = useRouter();
  const params = useParams();
  const driverId = params.id as string;

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/motorista/${driverId}`
        );
        if (response.ok) {
          const driver: Driver = await response.json();
          setNome(driver.nome);
          setTelefone(driver.telefone);
          setCpf(driver.cpf);
        } else {
          toast.error("Motorista não encontrado");
          router.push("/drivers");
        }
      } catch (error) {
        console.error("Erro ao buscar motorista:", error);
        toast.error("Erro ao carregar dados do motorista");
        router.push("/drivers");
      } finally {
        setIsLoadingData(false);
      }
    };

    if (driverId) {
      fetchDriver();
    }
  }, [driverId, router]);

  const isValidCPF = (cpf: string): boolean => {
    const cleanCPF = cpf.replace(/\D/g, "");
    if (cleanCPF.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
    return true;
  };

  const isValidPhone = (phone: string): boolean => {
    const cleanPhone = phone.replace(/\D/g, "");
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
  };

  const validateFields = (): FieldErrors => {
    const errors: FieldErrors = {};

    if (!nome.trim()) {
      errors.nome = "Nome é obrigatório";
    } else if (nome.trim().length < 2) {
      errors.nome = "Nome deve ter pelo menos 2 caracteres";
    }

    if (!telefone.trim()) {
      errors.telefone = "Telefone é obrigatório";
    } else if (!isValidPhone(telefone)) {
      errors.telefone = "Telefone deve ter entre 10 e 11 dígitos";
    }

    if (!cpf.trim()) {
      errors.cpf = "CPF é obrigatório";
    } else if (!isValidCPF(cpf)) {
      errors.cpf = "CPF deve ter 11 dígitos e ser válido";
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
          } else if (msg.includes("telefone")) {
            errors.telefone = msg;
          } else if (msg.includes("cpf")) {
            errors.cpf = msg;
          }
        });
      } else if (typeof errorData.message === "string") {
        const message = errorData.message.toLowerCase();
        if (message.includes("nome")) {
          errors.nome = errorData.message;
        } else if (message.includes("telefone")) {
          errors.telefone = errorData.message;
        } else if (message.includes("cpf")) {
          errors.cpf = errorData.message;
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
      const motoristaData = {
        nome: nome.trim(),
        telefone: telefone.trim(),
        cpf: cpf.replace(/\D/g, ""),
      };

      const response = await fetch(
        `http://localhost:3000/motorista/${driverId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(motoristaData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();

        const apiErrors = processApiErrors(errorData);

        if (Object.keys(apiErrors).length > 0) {
          setFieldErrors(apiErrors);
          toast.error("Erro de validação. Verifique os campos destacados.");
        } else {
          toast.error(errorData.message || "Erro ao atualizar motorista");
        }

        return;
      }

      toast.success("Motorista atualizado com sucesso!", {
        description: `${nome} foi atualizado na equipe de entrega.`,
        duration: 4000,
      });

      setTimeout(() => {
        router.push("/drivers");
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
                Carregando dados do motorista...
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
            onClick={() => router.push("/drivers")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Motoristas
          </Button>

          <Card>
            <CardHeader className="bg-primary/10">
              <CardTitle className="flex items-center text-primary">
                <User className="mr-2 h-5 w-5" />
                Editar Motorista
              </CardTitle>
              <CardDescription>Atualize os dados do motorista</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Motorista</Label>
                    <Input
                      id="name"
                      placeholder="Digite o nome completo do motorista"
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

                  <div className="space-y-2">
                    <Label htmlFor="phone">Número de Telefone</Label>
                    <Input
                      id="phone"
                      placeholder="Digite o número de telefone do motorista"
                      value={telefone}
                      onChange={(e) => {
                        setTelefone(e.target.value);
                        if (fieldErrors.telefone) {
                          setFieldErrors((prev) => ({
                            ...prev,
                            telefone: undefined,
                          }));
                        }
                      }}
                      className={
                        fieldErrors.telefone
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }
                    />
                    {fieldErrors.telefone && (
                      <p className="text-sm text-red-600">
                        {fieldErrors.telefone}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      placeholder="Digite o CPF do motorista"
                      value={cpf}
                      onChange={(e) => {
                        setCpf(e.target.value);
                        if (fieldErrors.cpf) {
                          setFieldErrors((prev) => ({
                            ...prev,
                            cpf: undefined,
                          }));
                        }
                      }}
                      className={
                        fieldErrors.cpf
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }
                    />
                    {fieldErrors.cpf && (
                      <p className="text-sm text-red-600">{fieldErrors.cpf}</p>
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
                      <User className="mr-2 h-4 w-4" />
                      Atualizar Motorista
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
