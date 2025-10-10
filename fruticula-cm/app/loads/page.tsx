"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { Package, Plus, Eye, Truck, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Load = {
  id: number;
  data: string;
  caminhao: {
    placa: string;
    qtdBlocos: number;
    motorista?: {
      nome?: string;
    };
  };

  status: string;
  totalPallets: number;
  maxCaixas: number;
};

export default function LoadsPage() {
  const router = useRouter();
  const [loads, setLoads] = useState<Load[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLoads = async () => {
      try {
        const response = await fetch("http://localhost:3000/carga");
        if (response.ok) {
          const data = await response.json();
          setLoads(data);
        } else {
          console.error("Erro ao carregar cargas");
        }
      } catch (error) {
        console.error("Erro ao buscar cargas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoads();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "carregando":
        return "bg-yellow-500";
      case "finalizada":
        return "bg-green-500";
      case "cancelada":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "carregando":
        return "Carregando";
      case "finalizada":
        return "Finalizada";
      case "cancelada":
        return "Cancelada";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-primary">Cargas</h1>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => router.push("/loads/new")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Carga
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <div className="text-center">
              <div className="animate-spin text-4xl mb-4">◌</div>
              <p className="text-muted-foreground">Carregando cargas...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loads.length > 0 ? (
              loads.map((load) => (
                <Card
                  key={load.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        Carga #{load.id}
                      </CardTitle>
                      <Badge className={getStatusColor(load.status)}>
                        {getStatusText(load.status)}
                      </Badge>
                    </div>
                    <CardDescription>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-4 w-4" />
                        {new Date(load.data).toLocaleDateString("pt-BR")}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span>{load.caminhao.placa}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {load.caminhao.motorista?.nome ||
                            "Motorista não vinculado"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {load.totalPallets || 0} de {load.maxCaixas} pallets
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      {load.status === "carregando" ? (
                        <Button
                          size="sm"
                          className="flex-1 bg-primary hover:bg-primary/90"
                          onClick={() =>
                            router.push(`/loads/loading/${load.id}`)
                          }
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Continuar Carregamento
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 bg-transparent"
                          onClick={() =>
                            router.push(`/loads/loading/${load.id}`)
                          }
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Nenhuma carga encontrada
                </h3>
                <p className="text-muted-foreground mb-4">
                  Comece criando sua primeira carga de entrega.
                </p>
                <Button onClick={() => router.push("/loads/new")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Nova Carga
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
