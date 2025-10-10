"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { Truck, ArrowLeft } from "lucide-react";
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

type Driver = {
  id: number;
  nome: string;
};

type FieldErrors = {
  placa?: string;
  qtdBlocos?: string;
  motoristaId?: string;
};

export default function NewTruckPage() {
  const router = useRouter();

  const [placa, setPlaca] = useState("");
  const [qtdBlocos, setQtdBlocos] = useState("");
  const [motoristaId, setMotoristaId] = useState("");

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoadingDrivers, setIsLoadingDrivers] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch("http://localhost:3000/motorista");
        if (response.ok) {
          const data = await response.json();
          setDrivers(data);
        } else {
          toast.error("Erro ao carregar motoristas");
        }
      } catch (error) {
        console.error("Erro ao buscar motoristas:", error);
        toast.error("Erro ao carregar motoristas");
      } finally {
        setIsLoadingDrivers(false);
      }
    };

    fetchDrivers();
  }, []);


  const clearForm = () => {
    setPlaca("");
    setQtdBlocos("");
    setMotoristaId("");
    setFieldErrors({});
  };


  const validateFields = (): FieldErrors => {
    const errors: FieldErrors = {};

    if (!placa.trim()) {
      errors.placa = "Placa é obrigatória";
    } else if (placa.trim().length < 7) {
      errors.placa = "Placa deve ter pelo menos 7 caracteres";
    }

    if (!qtdBlocos.trim()) {
      errors.qtdBlocos = "Quantidade de blocos é obrigatória";
    } else if (Number.parseInt(qtdBlocos) <= 0) {
      errors.qtdBlocos = "Quantidade deve ser maior que zero";
    }

    return errors;
  };

  const processApiErrors = (errorData: any) => {
    const errors: FieldErrors = {};

    if (errorData.message) {
      if (Array.isArray(errorData.message)) {
        errorData.message.forEach((msg: string) => {
          if (msg.includes("placa")) {
            errors.placa = msg;
          } else if (msg.includes("qtdBlocos") || msg.includes("blocos")) {
            errors.qtdBlocos = msg;
          } else if (msg.includes("motorista")) {
            errors.motoristaId = msg;
          }
        });
      } else if (typeof errorData.message === "string") {
        const message = errorData.message.toLowerCase();
        if (message.includes("placa")) {
          errors.placa = errorData.message;
        } else if (message.includes("blocos")) {
          errors.qtdBlocos = errorData.message;
        } else if (message.includes("motorista")) {
          errors.motoristaId = errorData.message;
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
      const caminhaoData: {
        placa: string;
        qtdBlocos: number;
        motoristaId?: number;
      } = {
        placa: placa.trim().toUpperCase(),
        qtdBlocos: parseInt(qtdBlocos, 10),
        motoristaId: Number(motoristaId) ?? undefined,
      };

      const response = await fetch("http://localhost:3000/caminhao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(caminhaoData),
      });

      if (!response.ok) {
        const errorData = await response.json();

        const apiErrors = processApiErrors(errorData);

        if (Object.keys(apiErrors).length > 0) {
          setFieldErrors(apiErrors);
          toast.error("Erro de validação. Verifique os campos destacados.");
        } else {
          toast.error(errorData.message || "Erro ao cadastrar caminhão");
        }

        return;
      }

      clearForm();
      toast.success("Caminhão cadastrado com sucesso!", {
        description: `${placa.toUpperCase()} foi adicionado à frota.`,
        duration: 4000,
      });

      setTimeout(() => {
        router.push("/trucks");
      }, 2000);
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
            onClick={() => router.push("/trucks")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Caminhões
          </Button>

          <Card>
            <CardHeader className="bg-primary/10">
              <CardTitle className="flex items-center text-primary">
                <Truck className="mr-2 h-5 w-5" />
                Cadastrar Caminhão
              </CardTitle>
              <CardDescription>
                Adicione um novo caminhão à sua frota de entrega
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="license">Placa do Veículo</Label>
                    <Input
                      id="license"
                      placeholder="Digite a placa do caminhão"
                      value={placa}
                      onChange={(e) => {
                        setPlaca(e.target.value);
                        if (fieldErrors.placa) {
                          setFieldErrors((prev) => ({
                            ...prev,
                            placa: undefined,
                          }));
                        }
                      }}
                      className={
                        fieldErrors.placa
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }
                    />
                    {fieldErrors.placa && (
                      <p className="text-sm text-red-600">
                        {fieldErrors.placa}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="blocks">Quantidade de Blocos</Label>
                    <Input
                      id="blocks"
                      type="number"
                      placeholder="Digite a quantidade de blocos"
                      value={qtdBlocos}
                      onChange={(e) => {
                        setQtdBlocos(e.target.value);
                        if (fieldErrors.qtdBlocos) {
                          setFieldErrors((prev) => ({
                            ...prev,
                            qtdBlocos: undefined,
                          }));
                        }
                      }}
                      className={
                        fieldErrors.qtdBlocos
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }
                    />
                    {fieldErrors.qtdBlocos && (
                      <p className="text-sm text-red-600">
                        {fieldErrors.qtdBlocos}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="driver">Motorista (Opcional)</Label>
                    <Select value={motoristaId} onValueChange={setMotoristaId}>
                      <SelectTrigger id="driver">
                        <SelectValue
                          placeholder={
                            isLoadingDrivers
                              ? "Carregando..."
                              : "Selecione o motorista"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhum motorista</SelectItem>
                        {drivers.map((driver) => (
                          <SelectItem
                            key={driver.id}
                            value={driver.id.toString()}
                          >
                            {driver.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldErrors.motoristaId && (
                      <p className="text-sm text-red-600">
                        {fieldErrors.motoristaId}
                      </p>
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
                      <Truck className="mr-2 h-4 w-4" />
                      Cadastrar Caminhão
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
