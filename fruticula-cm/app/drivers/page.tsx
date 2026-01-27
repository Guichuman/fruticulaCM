"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import {
  User,
  Plus,
  Edit,
  Trash2,
  Phone,
  CreditCard,
  Search,
} from "lucide-react";
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

// Tipo para motorista
type Driver = {
  id: number;
  nome: string;
  telefone: string;
  cpf: string;
};

export default function DriversPage() {
  const router = useRouter();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrar motoristas por nome
  const filteredDrivers = drivers.filter((driver) =>
    driver.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular paginação
  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDrivers = filteredDrivers.slice(startIndex, endIndex);

  // Reset página quando pesquisar
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Carregar motoristas
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch("http://localhost:3000/motorista");
        if (response.ok) {
          const data = await response.json();
          setDrivers(data);
        } else {
          toast.error("Erro ao carregar motoristas");
        }
      } catch (error) {
        console.error("Erro ao buscar motoristas:", error);
        toast.error("Erro ao carregar motoristas");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  // Função para excluir motorista
  const handleDelete = async (id: number, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir o motorista ${nome}?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/motorista/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDrivers(drivers.filter((driver) => driver.id !== id));
        toast.success(`Motorista ${nome} excluído com sucesso`);
      } else {
        toast.error("Erro ao excluir motorista");
      }
    } catch (error) {
      console.error("Erro ao excluir motorista:", error);
      toast.error("Erro ao excluir motorista");
    }
  };

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">Motoristas</h1>
            <p className="text-muted-foreground">
              Gerencie seus motoristas de entrega
            </p>
          </div>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => router.push("/drivers/new")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Motorista
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <User className="mr-2 h-5 w-5" />
              Lista de Motoristas
            </CardTitle>
            <CardDescription>
              {searchTerm
                ? `${filteredDrivers.length} motorista(s) encontrado(s) de ${drivers.length} total`
                : `${drivers.length} motorista(s) cadastrado(s)`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="text-center">
                  <div className="animate-spin text-4xl mb-4">◌</div>
                  <p className="text-muted-foreground">
                    Carregando motoristas...
                  </p>
                </div>
              </div>
            ) : drivers.length > 0 ? (
              <>
                {/* Input de Pesquisa */}
                <div className="mb-4">
                  <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Pesquisar por nome..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {currentDrivers.length > 0 ? (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Telefone</TableHead>
                          <TableHead>CPF</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentDrivers.map((driver) => (
                          <TableRow key={driver.id}>
                            <TableCell className="font-medium">
                              {driver.nome}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                {driver.telefone}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                                {driver.cpf}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    router.push(`/drivers/edit/${driver.id}`)
                                  }
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive/90"
                                  onClick={() =>
                                    handleDelete(driver.id, driver.nome)
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
                          {Math.min(endIndex, filteredDrivers.length)} de{" "}
                          {filteredDrivers.length} motoristas
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
                      Nenhum motorista encontrado
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Não encontramos motoristas com o termo "{searchTerm}".
                    </p>
                    <Button variant="outline" onClick={() => setSearchTerm("")}>
                      Limpar pesquisa
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-10">
                <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Nenhum motorista cadastrado
                </h3>
                <p className="text-muted-foreground mb-4">
                  Comece adicionando seu primeiro motorista de entrega.
                </p>
                <Button onClick={() => router.push("/drivers/new")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Primeiro Motorista
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
