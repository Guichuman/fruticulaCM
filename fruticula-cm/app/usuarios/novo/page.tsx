"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Loader2, UserPlus } from "lucide-react";
import { ProtectedAdminRoute } from "@/components/ProtectedAdminRoute";
import { api } from "@/lib/api";

export default function PaginaNovoUsuario() {
  const roteador = useRouter();
  const [nome, setNome] = useState("");
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [perfil, setPerfil] = useState<"A" | "F">("F");
  const [salvando, setSalvando] = useState(false);
  const [voltando, setVoltando] = useState(false);

  const aoSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !username || !senha) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    if (senha !== confirmarSenha) {
      toast.error("As senhas não coincidem");
      return;
    }
    if (senha.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres");
      return;
    }
    setSalvando(true);
    try {
      await api.post("/usuario/registrar", { nome, username, senha, perfil });
      toast.success("Usuário cadastrado com sucesso!");
      roteador.push("/usuarios");
    } catch (erro) {
      toast.error(erro instanceof Error ? erro.message : "Erro ao cadastrar usuário");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto py-10">
          <Button
            variant="ghost"
            className="mb-6"
            disabled={voltando || salvando}
            onClick={() => { setVoltando(true); roteador.push("/usuarios"); }}
          >
            {voltando
              ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Voltando...</>
              : <><ArrowLeft className="mr-2 h-4 w-4" />Voltar</>}
          </Button>
          <Card className="max-w-lg mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <UserPlus className="mr-2 h-5 w-5" />
                Novo Usuário
              </CardTitle>
              <CardDescription>Preencha os dados do novo usuário</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={aoSalvar} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo *</Label>
                  <Input
                    id="nome"
                    placeholder="Ex: João Silva"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    disabled={salvando}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Usuário (login) *</Label>
                  <Input
                    id="username"
                    placeholder="Ex: joao.silva"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
                    disabled={salvando}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="perfil">Perfil *</Label>
                  <Select value={perfil} onValueChange={(v) => setPerfil(v as "A" | "F")} disabled={salvando}>
                    <SelectTrigger id="perfil">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="F">Funcionário</SelectItem>
                      <SelectItem value="A">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha *</Label>
                  <Input
                    id="senha"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    disabled={salvando}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmarSenha">Confirmar senha *</Label>
                  <Input
                    id="confirmarSenha"
                    type="password"
                    placeholder="Repita a senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    disabled={salvando}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={voltando || salvando}
                    onClick={() => { setVoltando(true); roteador.push("/usuarios"); }}
                    className="flex-1"
                  >
                    {voltando ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Voltando...</> : "Cancelar"}
                  </Button>
                  <Button type="submit" disabled={salvando} className="flex-1">
                    {salvando
                      ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando...</>
                      : "Salvar"}
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
