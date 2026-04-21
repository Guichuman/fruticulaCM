"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { toast } from "sonner";
import { LogIn, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { salvarSessao, Usuario } from "@/lib/auth";
import { eAdministrador } from "@/lib/auth";

interface RespostaLogin {
  token: string;
  usuario: Usuario;
}

export default function PaginaLogin() {
  const roteador = useRouter();
  const [nomeUsuario, setNomeUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  const aoFazerLogin = async (evento: React.FormEvent) => {
    evento.preventDefault();

    if (!nomeUsuario || !senha) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    setCarregando(true);

    try {
      const resposta = await api.post<RespostaLogin>(
        "/usuario/login",
        { username: nomeUsuario, senha },
        true,
      );

      salvarSessao(resposta.token, resposta.usuario);

      toast.success(`Bem-vindo, ${resposta.usuario.nome}!`);
      roteador.push(resposta.usuario.perfil === 'A' ? "/" : "/cargas");
    } catch (erro) {
      const mensagemErro =
        erro instanceof Error ? erro.message : "Credenciais inválidas";
      toast.error(mensagemErro);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center">
              <LogIn className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-primary">
            Frutícola CM
          </CardTitle>
          <CardDescription className="text-base">
            Faça login para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={aoFazerLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nomeUsuario" className="text-base font-medium">
                Usuário
              </Label>
              <Input
                id="nomeUsuario"
                type="text"
                placeholder="Digite seu usuário"
                value={nomeUsuario}
                onChange={(e) => setNomeUsuario(e.target.value)}
                disabled={carregando}
                className="h-11"
                autoComplete="username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senha" className="text-base font-medium">
                Senha
              </Label>
              <Input
                id="senha"
                type="password"
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                disabled={carregando}
                className="h-11"
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold"
              disabled={carregando}
            >
              {carregando ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Entrar
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Sistema de Gerenciamento de Entregas</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
