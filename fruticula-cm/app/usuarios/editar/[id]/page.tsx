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
import { ArrowLeft, Loader2, UserCog } from "lucide-react";
import { ProtectedAdminRoute } from "@/components/ProtectedAdminRoute";
import { api } from "@/lib/api";

interface UsuarioDetalhe {
  id: number;
  nome: string;
  username: string;
  status: string;
  perfil: "A" | "F";
}

export default function PaginaEditarUsuario() {
  const roteador = useRouter();
  const params = useParams();
  const usuarioId = params.id;

  const [nome, setNome] = useState("");
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [perfil, setPerfil] = useState<"A" | "F">("F");
  const [status, setStatus] = useState<"A" | "I">("A");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [voltando, setVoltando] = useState(false);

  useEffect(() => {
    api
      .get<UsuarioDetalhe>(`/usuario/${usuarioId}`)
      .then((usuario) => {
        setNome(usuario.nome);
        setUsername(usuario.username);
        setPerfil(usuario.perfil);
        setStatus((usuario.status as "A" | "I") ?? "A");
      })
      .catch(() => {
        toast.error("Erro ao carregar dados do usuário");
        roteador.push("/usuarios");
      })
      .finally(() => setCarregando(false));
  }, [usuarioId, roteador]);

  const aoSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (senha && senha !== confirmarSenha) {
      toast.error("As senhas não coincidem");
      return;
    }
    if (senha && senha.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres");
      return;
    }
    setSalvando(true);
    try {
      const payload: Record<string, unknown> = { nome, username, perfil, status };
      if (senha) payload.senha = senha;
      await api.patch(`/usuario/${usuarioId}`, payload);
      toast.success("Usuário atualizado com sucesso!");
      roteador.push("/usuarios");
    } catch (erro) {
      toast.error(erro instanceof Error ? erro.message : "Erro ao atualizar usuário");
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
                <UserCog className="mr-2 h-5 w-5" />
                Editar Usuário
              </CardTitle>
              <CardDescription>Atualize os dados do usuário</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={aoSalvar} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome completo</Label>
                  <Input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    disabled={salvando}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Usuário (login)</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
                    disabled={salvando}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="perfil">Perfil</Label>
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
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as "A" | "I")} disabled={salvando}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Ativo</SelectItem>
                      <SelectItem value="I">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    Deixe em branco para manter a senha atual
                  </p>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="senha">Nova senha</Label>
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
                      <Label htmlFor="confirmarSenha">Confirmar nova senha</Label>
                      <Input
                        id="confirmarSenha"
                        type="password"
                        placeholder="Repita a nova senha"
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        disabled={salvando}
                      />
                    </div>
                  </div>
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
