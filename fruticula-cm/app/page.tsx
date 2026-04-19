"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { Package, Settings, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function PaginaInicial() {
  const roteador = useRouter();
  const [navegandoPara, setNavegandoPara] = useState<string | null>(null);

  const navegar = (destino: string) => {
    if (navegandoPara) return;
    setNavegandoPara(destino);
    roteador.push(destino);
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto py-16 px-4">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Frutícola CM
            </h1>
            <p className="text-xl text-muted-foreground">
              Sistema de Entrega Agrícola
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <Card
              className="transition-all hover:shadow-2xl border-l-4 border-l-primary h-full min-h-[280px] bg-primary/5 hover:bg-primary/10 cursor-pointer"
              onClick={() => navegar("/cadastros")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                <CardTitle className="text-3xl font-medium text-primary">
                  Cadastros
                </CardTitle>
                <Settings className="h-16 w-16 text-primary" />
              </CardHeader>
              <CardContent className="pt-4">
                <CardDescription className="text-lg mb-8 text-muted-foreground leading-relaxed">
                  Gerencie motoristas, caminhões, frutas e embalagens do seu
                  sistema de entrega
                </CardDescription>
                <Button
                  className="w-full bg-primary hover:bg-primary/90 py-4 text-xl font-semibold"
                  disabled={navegandoPara !== null}
                  onClick={(e) => { e.stopPropagation(); navegar("/cadastros"); }}
                >
                  {navegandoPara === "/cadastros"
                    ? <><Loader2 className="mr-3 h-6 w-6 animate-spin" />Carregando...</>
                    : <><Settings className="mr-3 h-6 w-6" />Acessar Cadastros</>}
                </Button>
              </CardContent>
            </Card>

            <Card
              className="transition-all hover:shadow-2xl border-l-4 border-l-primary h-full min-h-[280px] bg-primary/5 hover:bg-primary/10 cursor-pointer"
              onClick={() => navegar("/cargas")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                <CardTitle className="text-3xl font-medium text-primary">
                  Cargas
                </CardTitle>
                <Package className="h-16 w-16 text-primary" />
              </CardHeader>
              <CardContent className="pt-4">
                <CardDescription className="text-lg mb-8 text-muted-foreground leading-relaxed">
                  Gerencie suas cargas de entrega, pallets e acompanhe o
                  status dos carregamentos
                </CardDescription>
                <Button
                  className="w-full bg-primary hover:bg-primary/90 py-4 text-xl font-semibold"
                  disabled={navegandoPara !== null}
                  onClick={(e) => { e.stopPropagation(); navegar("/cargas"); }}
                >
                  {navegandoPara === "/cargas"
                    ? <><Loader2 className="mr-3 h-6 w-6 animate-spin" />Carregando...</>
                    : <><Package className="mr-3 h-6 w-6" />Gerenciar Cargas</>}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
