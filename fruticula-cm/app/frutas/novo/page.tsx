"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { Apple, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ProtectedAdminRoute } from "@/components/ProtectedAdminRoute";
import { api } from "@/lib/api";

type FieldErrors = {
  nome?: string;
};

export default function PaginaNovaFruta() {
  const roteador = useRouter();
  const [nome, setNome] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [errosCampo, setErrosCampo] = useState<FieldErrors>({});

  const validarCampos = (): FieldErrors => {
    const erros: FieldErrors = {};
    if (!nome.trim()) {
      erros.nome = "Nome da fruta é obrigatório";
    } else if (nome.trim().length < 1) {
      erros.nome = "Nome da fruta é obrigatório";
    }
    return erros;
  };

  const aoSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrosCampo({});

    const errosLocais = validarCampos();
    if (Object.keys(errosLocais).length > 0) {
      setErrosCampo(errosLocais);
      toast.error("Por favor, corrija os erros nos campos destacados");
      return;
    }

    setSalvando(true);
    try {
      const frutaData = { nome: nome.trim() };
      const fruta = await api.post<{ id: number }>("/fruta", frutaData);
      toast.success("Fruta cadastrada com sucesso!");
      roteador.push(`/frutas/editar/${fruta.id}`);
    } catch (erro) {
      toast.error(erro instanceof Error ? erro.message : "Erro ao cadastrar fruta");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <ProtectedAdminRoute>
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto py-10">
          <div className="max-w-lg mx-auto">
            <Button variant="ghost" className="mb-6" onClick={() => roteador.push("/frutas")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Apple className="mr-2 h-5 w-5" />
                  Adicionar Fruta
                </CardTitle>
                <CardDescription>Cadastre uma nova fruta no inventário</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={aoSalvar} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome da Fruta</Label>
                    <Input
                      id="nome"
                      placeholder="Digite o nome da fruta"
                      value={nome}
                      onChange={(e) => {
                        setNome(e.target.value);
                        if (errosCampo.nome) {
                          setErrosCampo((prev) => ({ ...prev, nome: undefined }));
                        }
                      }}
                      disabled={salvando}
                      className={errosCampo.nome ? "border-red-500 focus:border-red-500" : ""}
                    />
                    {errosCampo.nome && (
                      <p className="text-sm text-red-600">{errosCampo.nome}</p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={() => roteador.push("/frutas")} disabled={salvando} className="flex-1">Cancelar</Button>
                    <Button type="submit" disabled={salvando} className="flex-1">
                      {salvando ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando...</> : "Salvar"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedAdminRoute>
  );
}
