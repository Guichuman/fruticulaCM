"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Loader2, User } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { api } from "@/lib/api";

export default function PaginaEditarMotorista() {
  const roteador = useRouter();
  const params = useParams();
  const motoristaId = params.id as string;
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [status, setStatus] = useState<"A" | "I">("A");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [voltando, setVoltando] = useState(false);

  useEffect(() => {
    const buscarMotorista = async () => {
      try {
        const dados = await api.get<{ nome: string; telefone: string; cpf: string; status: "A" | "I" }>(`/motorista/${motoristaId}`);
        setNome(dados.nome);
        setTelefone(dados.telefone);
        setCpf(dados.cpf);
        setStatus(dados.status ?? "A");
      } catch (erro) {
        toast.error("Erro ao carregar motorista");
        roteador.push("/motoristas");
      } finally {
        setCarregando(false);
      }
    };
    buscarMotorista();
  }, [motoristaId, roteador]);

  const aoSalvar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setSalvando(true);
    try {
      await api.patch(`/motorista/${motoristaId}`, { nome, telefone, cpf, status });
      toast.success("Motorista atualizado com sucesso!");
      roteador.push("/motoristas");
    } catch (erro) {
      const mensagem = erro instanceof Error ? erro.message : "Erro ao atualizar motorista";
      toast.error(mensagem);
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) return (
    <ProtectedRoute><div className="min-h-screen flex items-center justify-center"><div className="animate-spin text-4xl">◌</div></div></ProtectedRoute>
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto py-10">
          <Button variant="ghost" className="mb-6" disabled={voltando || salvando} onClick={() => { setVoltando(true); roteador.push("/motoristas"); }}>
            {voltando ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Voltando...</> : <><ArrowLeft className="mr-2 h-4 w-4" />Voltar</>}
          </Button>
          <Card className="max-w-lg mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <User className="mr-2 h-5 w-5" />
                Editar Motorista
              </CardTitle>
              <CardDescription>Atualize os dados do motorista</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={aoSalvar} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} disabled={salvando} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} disabled={salvando} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input id="cpf" value={cpf} onChange={(e) => setCpf(e.target.value)} disabled={salvando} />
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
                  <Button type="button" variant="outline" disabled={voltando || salvando} onClick={() => { setVoltando(true); roteador.push("/motoristas"); }} className="flex-1">
                    {voltando ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Voltando...</> : "Cancelar"}
                  </Button>
                  <Button type="submit" disabled={salvando} className="flex-1">
                    {salvando ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando...</> : "Salvar"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
