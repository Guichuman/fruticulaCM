"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { Truck, Plus, Edit, Trash2, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/ProtectedRoute";

type TruckType = {
  id: number;
  placa: string;
  qtdBlocos: number;
  motorista?: {
    nome: string;
  };
};

export default function TrucksPage() {
  const router = useRouter();
  const [trucks, setTrucks] = useState<TruckType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredTrucks = trucks.filter((truck) =>
    truck.placa.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTrucks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTrucks = filteredTrucks.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        const response = await fetch("http://localhost:3000/caminhao");
        if (response.ok) {
          const data = await response.json();
          setTrucks(data);
        } else {
          toast.error("Erro ao carregar caminhões");
        }
      } catch (error) {
        console.error("Erro ao buscar caminhões:", error);
        toast.error("Erro ao carregar caminhões");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrucks();
  }, []);

  const handleDelete = async (id: number, placa: string) => {
    if (!confirm(`Tem certeza que deseja excluir o caminhão ${placa}?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/caminhao/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTrucks(trucks.filter((truck) => truck.id !== id));
        toast.success(`Caminhão ${placa} excluído com sucesso`);
      } else {
        toast.error("Erro ao excluir caminhão");
      }
    } catch (error) {
      console.error("Erro ao excluir caminhão:", error);
      toast.error("Erro ao excluir caminhão");
    }
  };

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">Caminhões</h1>
            <p className="text-muted-foreground">
              Gerencie seus caminhões de entrega
            </p>
          </div>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => router.push("/trucks/new")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Caminhão
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <Truck className="mr-2 h-5 w-5" />
              Lista de Caminhões
            </CardTitle>
            <CardDescription>
              {searchTerm
                ? `${filteredTrucks.length} caminhão(ões) encontrado(s) de ${trucks.length} total`
                : `${trucks.length} caminhão(ões) cadastrado(s)`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="text-center">
                  <div className="animate-spin text-4xl mb-4">◌</div>
                  <p className="text-muted-foreground">
                    Carregando caminhões...
                  </p>
                </div>
              </div>
            ) : trucks.length > 0 ? (
              <>
                {/* Input de Pesquisa */}
                <div className="mb-4">
                  <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Pesquisar por placa..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {currentTrucks.length > 0 ? (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Placa</TableHead>
                          <TableHead>Qtd. Blocos</TableHead>
                          <TableHead>Motorista</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentTrucks.map((truck) => (
                          <TableRow key={truck.id}>
                            <TableCell className="font-medium font-mono">
                              {truck.placa}
                            </TableCell>
                            <TableCell>{truck.qtdBlocos} blocos</TableCell>
                            <TableCell>
                              {truck.motorista ? (
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-muted-foreground" />
                                  {truck.motorista.nome}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">
                                  Não atribuído
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    router.push(`/trucks/edit/${truck.id}`)
                                  }
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive/90"
                                  onClick={() =>
                                    handleDelete(truck.id, truck.placa)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {totalPages > 1 && (
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-sm text-muted-foreground">
                          Mostrando {startIndex + 1} a{" "}
                          {Math.min(endIndex, filteredTrucks.length)} de{" "}
                          {filteredTrucks.length} caminhões
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            Anterior
                          </Button>
                          <span className="text-sm">
                            Página {currentPage} de {totalPages}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            Próxima
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-10">
                    <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Nenhum caminhão encontrado
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Não encontramos caminhões com a placa "{searchTerm}".
                    </p>
                    <Button variant="outline" onClick={() => setSearchTerm("")}>
                      Limpar pesquisa
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-10">
                <Truck className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Nenhum caminhão cadastrado
                </h3>
                <p className="text-muted-foreground mb-4">
                  Comece adicionando seu primeiro caminhão de entrega.
                </p>
                <Button onClick={() => router.push("/trucks/new")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Primeiro Caminhão
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    </ProtectedRoute>
  );
}
