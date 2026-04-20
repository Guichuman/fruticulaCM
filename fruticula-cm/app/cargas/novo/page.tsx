"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { ArrowLeft, TruckIcon, UserIcon, Loader2 } from "lucide-react";
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
import { api } from "@/lib/api";

type Caminhao = {
  id: number;
  placa: string;
  qtdBlocos: number;
  status: string;
  motorista?: {
    nome: string;
  };
};

type Motorista = {
  id: number;
  nome: string;
  telefone: string;
  cpf: string;
  status: string;
};

export default function PaginaNovaCarga() {
  const roteador = useRouter();

  const [idCaminhaoSelecionado, setIdCaminhaoSelecionado] = useState("");
  const [idMotoristaSelecionado, setIdMotoristaSelecionado] = useState("");

  const [caminhoes, setCaminhoes] = useState<Caminhao[]>([]);
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [carregandoCaminhoes, setCarregandoCaminhoes] = useState(true);
  const [carregandoMotoristas, setCarregandoMotoristas] = useState(true);
  const [criandoCarga, setCriandoCarga] = useState(false);
  const [voltando, setVoltando] = useState(false);

  useEffect(() => {
    const buscarCaminhoes = async () => {
      try {
        const dados = await api.get<Caminhao[]>("/caminhao");
        setCaminhoes(dados);
      } catch (erro) {
        toast.error("Erro ao carregar caminhões");
      } finally {
        setCarregandoCaminhoes(false);
      }
    };

    buscarCaminhoes();
  }, []);

  useEffect(() => {
    const buscarMotoristas = async () => {
      try {
        const dados = await api.get<Motorista[]>("/motorista");
        setMotoristas(dados);
      } catch (erro) {
        toast.error("Erro ao carregar motoristas");
      } finally {
        setCarregandoMotoristas(false);
      }
    };

    buscarMotoristas();
  }, []);

  const aoIniciarCarregamento = async () => {
    if (!idCaminhaoSelecionado || !idMotoristaSelecionado) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setCriandoCarga(true);

    try {
      const qtdBlocos =
        caminhoes.find((t) => t.id.toString() === idCaminhaoSelecionado)
          ?.qtdBlocos || 1;

      const dadosCarga = {
        idCaminhao: Number.parseInt(idCaminhaoSelecionado),
        idMotorista: Number.parseInt(idMotoristaSelecionado),
        totalBlocos: qtdBlocos,
        maxCaixas: qtdBlocos,
      };

      const cargaCriada = await api.post<{ id: number }>("/carga", dadosCarga);

      toast.success("Carga criada com sucesso!", {
        description: "Redirecionando para a tela de carregamento...",
        duration: 2000,
      });

      setTimeout(() => {
        roteador.push(`/cargas/carregamento/${cargaCriada.id}`);
      }, 1000);
    } catch (erro) {
      const mensagem =
        erro instanceof Error ? erro.message : "Erro ao criar carga";
      toast.error(mensagem);
    } finally {
      setCriandoCarga(false);
    }
  };

  const caminhaoSelecionado = caminhoes.find(
    (t) => t.id.toString() === idCaminhaoSelecionado,
  );
  const motoristaSelecionado = motoristas.find(
    (d) => d.id.toString() === idMotoristaSelecionado,
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
              disabled={voltando || criandoCarga}
              onClick={() => {
                setVoltando(true);
                roteador.push("/cargas");
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
                  Voltar
                </>
              )}
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
                  <Label htmlFor="caminhao">Selecione o Caminhão</Label>
                  <Select
                    value={idCaminhaoSelecionado}
                    onValueChange={setIdCaminhaoSelecionado}
                  >
                    <SelectTrigger id="caminhao" className="w-full">
                      <SelectValue
                        placeholder={
                          carregandoCaminhoes ? "Carregando..." : "Selecione..."
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {caminhoes.map((caminhao) => (
                        <SelectItem
                          key={caminhao.id}
                          value={caminhao.id.toString()}
                        >
                          <div className="flex items-center gap-2">
                            <TruckIcon className="h-4 w-4" />
                            <span>
                              {caminhao.placa} - {caminhao.qtdBlocos} blocos
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motorista">Selecione o Motorista</Label>
                  <Select
                    value={idMotoristaSelecionado}
                    onValueChange={setIdMotoristaSelecionado}
                  >
                    <SelectTrigger id="motorista" className="w-full">
                      <SelectValue
                        placeholder={
                          carregandoMotoristas
                            ? "Carregando..."
                            : "Selecione..."
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {motoristas.map((motorista) => (
                        <SelectItem
                          key={motorista.id}
                          value={motorista.id.toString()}
                        >
                          <div className="flex items-center gap-2">
                            <UserIcon className="h-4 w-4" />
                            <span>{motorista.nome}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {(caminhaoSelecionado || motoristaSelecionado) && (
                  <div className="p-4 bg-primary/5 rounded-lg space-y-2">
                    <h3 className="font-semibold text-primary">
                      Resumo da Seleção
                    </h3>
                    {caminhaoSelecionado && (
                      <div className="text-sm">
                        <span className="font-medium">Caminhão:</span>{" "}
                        {caminhaoSelecionado.placa} -{" "}
                        {caminhaoSelecionado.qtdBlocos} blocos
                      </div>
                    )}
                    {motoristaSelecionado && (
                      <div className="text-sm">
                        <span className="font-medium">Motorista:</span>{" "}
                        {motoristaSelecionado.nome}
                      </div>
                    )}
                    {caminhaoSelecionado && (
                      <div className="text-sm">
                        <span className="font-medium">Capacidade:</span>{" "}
                        {caminhaoSelecionado.qtdBlocos} pallets
                      </div>
                    )}
                  </div>
                )}

                <Button
                  onClick={aoIniciarCarregamento}
                  disabled={
                    !idCaminhaoSelecionado ||
                    !idMotoristaSelecionado ||
                    criandoCarga
                  }
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 text-lg"
                >
                  {criandoCarga ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
