"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

export default function PaginaNovoCaminhao() {
  const roteador = useRouter();
  const [placa, setPlaca] = useState("");
  const [modelo, setModelo] = useState("");
  const [qtdBlocos, setQtdBlocos] = useState("");
  const [idMotorista, setIdMotorista] = useState("");
  const [palletBaixo, setPalletBaixo] = useState(false);
  const [motoristas, setMotoristas] = useState<Motorista[]>([]);
  const [salvando, setSalvando] = useState(false);
  const [voltando, setVoltando] = useState(false);

  useEffect(() => {
    api.get<Motorista[]>('/motorista').then(setMotoristas).catch(() => {});
  }, []);

  const aoSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!placa || !modelo || !qtdBlocos) { toast.error("Preencha todos os campos obrigatórios"); return; }
    setSalvando(true);
    try {
      await api.post("/caminhao", {
        placa,
        modelo,
        qtdBlocos: Number(qtdBlocos),
        idMotorista: idMotorista ? Number(idMotorista) : undefined,
        palletBaixo: palletBaixo ? 'S' : 'N',
      });
      toast.success("Caminhão cadastrado com sucesso!");
      roteador.push("/caminhoes");
    } catch (erro) {
      toast.error(erro instanceof Error ? erro.message : "Erro ao cadastrar caminhão");
    } finally { setSalvando(false); }
  };

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
                Novo Caminhão
              </CardTitle>
              <CardDescription>Preencha os dados do novo caminhão</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={aoSalvar} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="placa">Placa *</Label>
                  <Input
                    id="placa"
                    placeholder="ABC1234 ou ABC1D23"
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                    disabled={salvando}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modelo">Modelo *</Label>
                  <Input
                    id="modelo"
                    placeholder="Ex: Carreta, Truck, Toco"
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    disabled={salvando}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qtdBlocos">Quantidade de Blocos *</Label>
                  <Input
                    id="qtdBlocos"
                    type="number"
                    min="1"
                    placeholder="Ex: 10"
                    value={qtdBlocos}
                    onChange={(e) => setQtdBlocos(e.target.value)}
                    disabled={salvando}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Motorista (opcional)</Label>
                  <Select onValueChange={setIdMotorista} disabled={salvando}>
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
