"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { Truck, User, Apple, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProtectedAdminRoute } from "@/components/ProtectedAdminRoute";

export default function CadastrosPage() {
  const roteador = useRouter();
  const [navegandoPara, setNavegandoPara] = useState<string | null>(null);

  const navegar = (destino: string) => {
    if (navegandoPara) return;
    setNavegandoPara(destino);
    roteador.push(destino);
  };

  return (
    <ProtectedAdminRoute>
      <main className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto py-10 px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary">Cadastros</h1>
            <p className="text-muted-foreground">
              Gerencie os cadastros básicos do sistema
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card
              className="transition-all hover:shadow-xl border-l-4 border-l-blue-500 h-full min-h-[200px] bg-blue-50/30 hover:bg-blue-50/50 cursor-pointer"
              onClick={() => navegar("/motoristas")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-2xl font-medium text-blue-700">
                  Motoristas
                </CardTitle>
                <User className="h-12 w-12 text-blue-600" />
              </CardHeader>
              <CardContent className="pt-2">
                <CardDescription className="text-base mb-6 text-blue-600">
                  Gerencie seus motoristas de entrega
                </CardDescription>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                  disabled={navegandoPara !== null}
                  onClick={(e) => { e.stopPropagation(); navegar("/motoristas"); }}
                >
                  {navegandoPara === "/motoristas"
                    ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Carregando...</>
                    : <><User className="mr-2 h-5 w-5" />Gerenciar Motoristas</>}
                </Button>
              </CardContent>
            </Card>

            <Card
              className="transition-all hover:shadow-xl border-l-4 border-l-green-500 h-full min-h-[200px] bg-green-50/30 hover:bg-green-50/50 cursor-pointer"
              onClick={() => navegar("/caminhoes")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-2xl font-medium text-green-700">
                  Caminhões
                </CardTitle>
                <Truck className="h-12 w-12 text-green-600" />
              </CardHeader>
              <CardContent className="pt-2">
                <CardDescription className="text-base mb-6 text-green-600">
                  Gerencie seus caminhões de entrega
                </CardDescription>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
                  disabled={navegandoPara !== null}
                  onClick={(e) => { e.stopPropagation(); navegar("/caminhoes"); }}
                >
                  {navegandoPara === "/caminhoes"
                    ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Carregando...</>
                    : <><Truck className="mr-2 h-5 w-5" />Gerenciar Caminhões</>}
                </Button>
              </CardContent>
            </Card>

            <Card
              className="transition-all hover:shadow-xl border-l-4 border-l-orange-500 h-full min-h-[200px] bg-orange-50/30 hover:bg-orange-50/50 cursor-pointer"
              onClick={() => navegar("/frutas")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-2xl font-medium text-orange-700">
                  Frutas
                </CardTitle>
                <Apple className="h-12 w-12 text-orange-600" />
              </CardHeader>
              <CardContent className="pt-2">
                <CardDescription className="text-base mb-6 text-orange-600">
                  Gerencie seu inventário de frutas
                </CardDescription>
                <Button
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-lg"
                  disabled={navegandoPara !== null}
                  onClick={(e) => { e.stopPropagation(); navegar("/frutas"); }}
                >
                  {navegandoPara === "/frutas"
                    ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Carregando...</>
                    : <><Apple className="mr-2 h-5 w-5" />Gerenciar Frutas</>}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </ProtectedAdminRoute>
  );
}
