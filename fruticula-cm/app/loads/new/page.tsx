"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { ArrowLeft, TruckIcon, UserIcon } from "lucide-react";
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

type TruckType = {
  id: number;
  placa: string;
  qtdBlocos: number;
  status: string;
  motorista?: {
    nome: string;
  };
};

type DriverType = {
  id: number;
  nome: string;
  telefone: string;
  cpf: string;
  status: string;
};

type FrutasEmbalagemType = {
  id: number;
  peso: number;
  sku: number;
  tipo: string;
  fruta?: { nome: string };
  embalagem?: { nome: string };
};

export default function NewLoadPage() {
  const router = useRouter();

  const [date, setDate] = useState("");
  const [selectedTruckId, setSelectedTruckId] = useState("");
  const [selectedDriverId, setSelectedDriverId] = useState("");

  const [trucks, setTrucks] = useState<TruckType[]>([]);
  const [drivers, setDrivers] = useState<DriverType[]>([]);
  const [isLoadingTrucks, setIsLoadingTrucks] = useState(true);
  const [isLoadingDrivers, setIsLoadingDrivers] = useState(true);
  const [isCreatingLoad, setIsCreatingLoad] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
  }, []);

  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        const response = await fetch("http://localhost:3000/caminhao");
        if (response.ok) {
          const data = await response.json();
          setTrucks(data);
        } else {
          toast.error("Erro ao carregar caminhões");
        }
      } catch (error) {
        console.error("Erro ao buscar caminhões:", error);
        toast.error("Erro ao carregar caminhões");
      } finally {
        setIsLoadingTrucks(false);
      }
    };

    fetchTrucks();
  }, []);

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

  const handleStartLoading = async () => {
    if (!selectedTruckId || !selectedDriverId || !date) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setIsCreatingLoad(true);

    try {
      const loadData = {
        data: date,
        idCaminhao: Number.parseInt(selectedTruckId),
        idMotorista: Number.parseInt(selectedDriverId),
        status: "carregando",
        totalBlocos: 0,
        maxCaixas:
          trucks.find((t) => t.id.toString() === selectedTruckId)?.qtdBlocos ||
          0,
      };

      const response = await fetch("http://localhost:3000/carga", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loadData),
      });

      if (response.ok) {
        const createdLoad = await response.json();

        toast.success("Carga criada com sucesso!", {
          description: "Redirecionando para a tela de carregamento...",
          duration: 2000,
        });

        setTimeout(() => {
          router.push(`/loads/loading/${createdLoad.id}`);
        }, 1000);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Erro ao criar carga");
      }
    } catch (error) {
      console.error("Erro ao criar carga:", error);
      toast.error("Erro de conexão. Tente novamente.");
    } finally {
      setIsCreatingLoad(false);
    }
  };

  const selectedTruck = trucks.find((t) => t.id.toString() === selectedTruckId);
  const selectedDriver = drivers.find(
    (d) => d.id.toString() === selectedDriverId
  );

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto py-10">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="outline"
            className="mb-6 bg-transparent"
            onClick={() => router.push("/loads")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-primary">
                Iniciar Nova Carga
              </CardTitle>
              <CardDescription>
                Selecione o caminhão e motorista para começar o carregamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="truck">Selecione o Caminhão</Label>
                <Select
                  value={selectedTruckId}
                  onValueChange={setSelectedTruckId}
                >
                  <SelectTrigger id="truck" className="w-full">
                    <SelectValue
                      placeholder={
                        isLoadingTrucks ? "Carregando..." : "Selecione..."
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {trucks.map((truck) => (
                      <SelectItem key={truck.id} value={truck.id.toString()}>
                        <div className="flex items-center gap-2">
                          <TruckIcon className="h-4 w-4" />
                          <span>
                            {truck.placa} - {truck.qtdBlocos} blocos
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="driver">Selecione o Motorista</Label>
                <Select
                  value={selectedDriverId}
                  onValueChange={setSelectedDriverId}
                >
                  <SelectTrigger id="driver" className="w-full">
                    <SelectValue
                      placeholder={
                        isLoadingDrivers ? "Carregando..." : "Selecione..."
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers.map((driver) => (
                      <SelectItem key={driver.id} value={driver.id.toString()}>
                        <div className="flex items-center gap-2">
                          <UserIcon className="h-4 w-4" />
                          <span>{driver.nome}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(selectedTruck || selectedDriver) && (
                <div className="p-4 bg-primary/5 rounded-lg space-y-2">
                  <h3 className="font-semibold text-primary">
                    Resumo da Seleção
                  </h3>
                  {selectedTruck && (
                    <div className="text-sm">
                      <span className="font-medium">Caminhão:</span>{" "}
                      {selectedTruck.placa} - {selectedTruck.qtdBlocos} blocos
                    </div>
                  )}
                  {selectedDriver && (
                    <div className="text-sm">
                      <span className="font-medium">Motorista:</span>{" "}
                      {selectedDriver.nome}
                    </div>
                  )}
                  {selectedTruck && (
                    <div className="text-sm">
                      <span className="font-medium">Capacidade:</span>{" "}
                      {selectedTruck.qtdBlocos} pallets
                    </div>
                  )}
                </div>
              )}

              <Button
                onClick={handleStartLoading}
                disabled={
                  !selectedTruckId ||
                  !selectedDriverId ||
                  !date ||
                  isCreatingLoad
                }
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 text-lg"
              >
                {isCreatingLoad ? (
                  <>
                    <span className="animate-spin mr-2">◌</span>
                    Criando Carga...
                  </>
                ) : (
                  "Iniciar Carregamento"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
