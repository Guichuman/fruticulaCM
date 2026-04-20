"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Loader2, User } from "lucide-react";
import { ProtectedAdminRoute } from "@/components/ProtectedAdminRoute";
import { api } from "@/lib/api";

export default function PaginaNovoMotorista() {
  const roteador = useRouter();
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [voltando, setVoltando] = useState(false);

  const aoSalvar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    if (!nome || !telefone || !cpf) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    setSalvando(true);
    try {
      await api.post("/motorista", { nome, telefone, cpf });
      toast.success("Motorista cadastrado com sucesso!");
      roteador.push("/motoristas");
    } catch (erro) {
      const mensagem = erro instanceof Error ? erro.message : "Erro ao cadastrar motorista";
      toast.error(mensagem);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <ProtectedAdminRoute>
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
                Novo Motorista
              </CardTitle>
              <CardDescription>Preencha os dados do novo motorista</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={aoSalvar} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input id="nome" placeholder="Digite o nome" value={nome} onChange={(e) => setNome(e.target.value)} disabled={salvando} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" placeholder="(11) 99999-9999" value={telefone} onChange={(e) => setTelefone(e.target.value)} disabled={salvando} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input id="cpf" placeholder="000.000.000-00" value={cpf} onChange={(e) => setCpf(e.target.value)} disabled={salvando} />
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
    </ProtectedAdminRoute>
  );
}
