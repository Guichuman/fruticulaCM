"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Truck } from "lucide-react";
import { ProtectedAdminRoute } from "@/components/ProtectedAdminRoute";
import { api } from "@/lib/api";

interface Motorista { id: number; nome: string; }
interface CaminhaoDetalhe {
  id: number;
  placa: string;
  modelo: string;
  qtdBlocos: number;
  status: string;
  palletBaixo: string;
  motorista?: { id: number; nome: string };
}

export default function PaginaEditarCaminhao() {
  const roteador = useRouter();
  const params = useParams();
  const caminhaoId = params.id;

  const [placa, setPlaca] = useState("");
  const [modelo, setModelo] = useState("");
  const [qtdBlocos, setQtdBlocos] = useState("");
  const [idMotorista, setIdMotorista] = useState("");
  const [palletBaixo, setPalletBaixo] = useState(false);
  const [status, setStatus] = useState<"A" | "I">("A");
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [voltando, setVoltando] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get<CaminhaoDetalhe>(`/caminhao/${caminhaoId}`),
      api.get<Motorista[]>("/motorista"),
    ])
      .then(([caminhao, listaMotoristas]) => {
        setPlaca(caminhao.placa);
        setModelo(caminhao.modelo ?? "");
        setQtdBlocos(String(caminhao.qtdBlocos));
        setPalletBaixo(caminhao.palletBaixo === 'S');
        setStatus((caminhao.status as "A" | "I") ?? "A");
        setMotoristas(listaMotoristas);
        if (caminhao.motorista) setIdMotorista(String(caminhao.motorista.id));
      })
      .catch((erro) => {
        toast.error(erro instanceof Error ? erro.message : "Erro ao carregar dados");
        roteador.push("/caminhoes");
      })
      .finally(() => setCarregando(false));
  }, [caminhaoId, roteador]);

  const aoSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    try {
      await api.patch(`/caminhao/${caminhaoId}`, {
        placa,
        modelo,
        qtdBlocos: Number(qtdBlocos),
        idMotorista: idMotorista ? Number(idMotorista) : undefined,
        palletBaixo: palletBaixo ? 'S' : 'N',
        status,
      });
      toast.success("Caminhão atualizado com sucesso!");
      roteador.push("/caminhoes");
    } catch (erro) {
      toast.error(erro instanceof Error ? erro.message : "Erro ao atualizar caminhão");
    } finally {
      setSalvando(false);
    }
  };

  if (carregando)
    return (
      <ProtectedAdminRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin text-4xl">◌</div>
        </div>
      </ProtectedAdminRoute>
    );

  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto py-10">
          <Button variant="ghost" className="mb-6" disabled={voltando || salvando} onClick={() => { setVoltando(true); roteador.push("/caminhoes"); }}>
            {voltando ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Voltando...</> : <><ArrowLeft className="mr-2 h-4 w-4" />Voltar</>}
          </Button>
          <Card className="max-w-lg mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Truck className="mr-2 h-5 w-5" />
                Editar Caminhão
              </CardTitle>
              <CardDescription>Atualize os dados do caminhão</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={aoSalvar} className="space-y-4">
                <div className="space-y-2">
                  <Label>Placa</Label>
                  <Input
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                    disabled={salvando}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Modelo</Label>
                  <Input
                    placeholder="Ex: Carreta, Truck, Toco"
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    disabled={salvando}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quantidade de Blocos</Label>
                  <Input
                    type="number"
                    min="1"
                    value={qtdBlocos}
                    onChange={(e) => setQtdBlocos(e.target.value)}
                    disabled={salvando}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Motorista</Label>
                  <Select value={idMotorista} onValueChange={setIdMotorista} disabled={salvando}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um motorista" />
                    </SelectTrigger>
                    <SelectContent>
                      {motoristas.map((m) => (
                        <SelectItem key={m.id} value={String(m.id)}>{m.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <Checkbox
                    id="palletBaixo"
                    checked={palletBaixo}
                    onCheckedChange={(checked) => setPalletBaixo(checked === true)}
                    disabled={salvando}
                  />
                  <Label htmlFor="palletBaixo" className="cursor-pointer">
                    Pallet Baixo
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as "A" | "I")} disabled={salvando}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Ativo</SelectItem>
                      <SelectItem value="I">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" disabled={voltando || salvando} onClick={() => { setVoltando(true); roteador.push("/caminhoes"); }} className="flex-1">
                    {voltando ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Voltando...</> : "Cancelar"}
                  </Button>
                  <Button type="submit" disabled={salvando} className="flex-1">
                    {salvando ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : "Salvar"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedAdminRoute>
  );
}
