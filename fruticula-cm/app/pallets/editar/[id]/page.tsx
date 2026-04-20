"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { Layers, ArrowLeft, Loader2 } from "lucide-react";
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

type Carga = {
  id: number;
  destino?: string;
};

type Pallet = {
  id: number;
  lado: string;
  bloco: number;
  idCarga: number;
};

type ErrosCampo = {
  lado?: string;
  bloco?: string;
  idCarga?: string;
};

const OPCOES_LADO = ["E", "D", "C", "F", "T", "L", "R"];

export default function EditarPalletPage() {
  const roteador = useRouter();
  const params = useParams();
  const palletId = params.id as string;

  const [lado, setLado] = useState("");
  const [bloco, setBloco] = useState("");
  const [idCarga, setIdCarga] = useState("");
  const [cargas, setCargas] = useState<Carga[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [voltando, setVoltando] = useState(false);
  const [errosCampo, setErrosCampo] = useState<ErrosCampo>({});

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const [pallet, cargasData] = await Promise.all([
          api.get<Pallet>(`/pallet/${palletId}`),
          api.get<Carga[]>("/carga"),
        ]);
        setLado(pallet.lado);
        setBloco(String(pallet.bloco));
        setIdCarga(String(pallet.idCarga));
        setCargas(cargasData);
      } catch (erro) {
        toast.error("Pallet não encontrado");
        roteador.push("/pallets");
      } finally {
        setCarregandoDados(false);
      }
    };

    if (palletId) {
      buscarDados();
    }
  }, [palletId, roteador]);

  const validarCampos = (): ErrosCampo => {
    const erros: ErrosCampo = {};
    if (!lado) erros.lado = "Lado é obrigatório";
    if (!bloco || isNaN(Number(bloco)) || Number(bloco) <= 0)
      erros.bloco = "Bloco deve ser um número positivo";
    if (!idCarga) erros.idCarga = "Carga é obrigatória";
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
      await api.patch(`/pallet/${palletId}`, {
        lado,
        bloco: Number(bloco),
        idCarga: Number(idCarga),
      });
      toast.success("Pallet atualizado com sucesso!", { duration: 4000 });
      setTimeout(() => roteador.push("/pallets"), 2000);
    } catch (erro) {
      const mensagem = erro instanceof Error ? erro.message : "Erro ao atualizar pallet";
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
              <p className="text-muted-foreground">Carregando dados do pallet...</p>
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
              onClick={() => { setVoltando(true); roteador.push("/pallets"); }}
            >
              {voltando ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Voltando...</> : <><ArrowLeft className="mr-2 h-4 w-4" />Voltar para Pallets</>}
            </Button>

            <Card>
              <CardHeader className="bg-primary/10">
                <CardTitle className="flex items-center text-primary">
                  <Layers className="mr-2 h-5 w-5" />
                  Editar Pallet #{palletId}
                </CardTitle>
                <CardDescription>Atualize os dados do pallet</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form className="space-y-4" onSubmit={aoEnviar}>
                  <div className="space-y-2">
                    <Label htmlFor="lado">Lado</Label>
                    <Select
                      value={lado}
                      onValueChange={(val) => {
                        setLado(val);
                        if (errosCampo.lado) setErrosCampo((prev) => ({ ...prev, lado: undefined }));
                      }}
                    >
                      <SelectTrigger id="lado" className={errosCampo.lado ? "border-red-500" : ""}>
                        <SelectValue placeholder="Selecione o lado" />
                      </SelectTrigger>
                      <SelectContent>
                        {OPCOES_LADO.map((opcao) => (
                          <SelectItem key={opcao} value={opcao}>
                            {opcao}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errosCampo.lado && (
                      <p className="text-sm text-red-600">{errosCampo.lado}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bloco">Bloco</Label>
                    <Input
                      id="bloco"
                      type="number"
                      placeholder="Número do bloco"
                      value={bloco}
                      onChange={(e) => {
                        setBloco(e.target.value);
                        if (errosCampo.bloco) setErrosCampo((prev) => ({ ...prev, bloco: undefined }));
                      }}
                      className={errosCampo.bloco ? "border-red-500 focus:border-red-500" : ""}
                      min={1}
                    />
                    {errosCampo.bloco && (
                      <p className="text-sm text-red-600">{errosCampo.bloco}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="idCarga">Carga</Label>
                    <Select
                      value={idCarga}
                      onValueChange={(val) => {
                        setIdCarga(val);
                        if (errosCampo.idCarga) setErrosCampo((prev) => ({ ...prev, idCarga: undefined }));
                      }}
                    >
                      <SelectTrigger id="idCarga" className={errosCampo.idCarga ? "border-red-500" : ""}>
                        <SelectValue placeholder="Selecione a carga" />
                      </SelectTrigger>
                      <SelectContent>
                        {cargas.map((carga) => (
                          <SelectItem key={carga.id} value={String(carga.id)}>
                            Carga #{carga.id}{carga.destino ? ` — ${carga.destino}` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errosCampo.idCarga && (
                      <p className="text-sm text-red-600">{errosCampo.idCarga}</p>
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
                        <Layers className="mr-2 h-4 w-4" />
                        Atualizar Pallet
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
