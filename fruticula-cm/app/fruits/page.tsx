"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { Apple, Plus, Edit, Trash2, Search } from "lucide-react";
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

type Fruit = {
  id: number;
  nome: string;
  embalagens: Array<{
    id: number;
    peso: number;
    sku: string;
    tipo: string;
  }>;
};

export default function FruitsPage() {
  const router = useRouter();
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredFruits = fruits.filter((fruit) =>
    fruit.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFruits.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFruits = filteredFruits.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const fetchFruits = async () => {
      try {
        const response = await fetch("http://localhost:3000/fruta");
        if (response.ok) {
          const data = await response.json();
          setFruits(data);
        } else {
          toast.error("Erro ao carregar frutas");
        }
      } catch (error) {
        console.error("Erro ao buscar frutas:", error);
        toast.error("Erro ao carregar frutas");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFruits();
  }, []);

  const handleDelete = async (id: number, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir a fruta ${nome}?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/fruta/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setFruits(fruits.filter((fruit) => fruit.id !== id));
        toast.success(`Fruta ${nome} excluída com sucesso`);
      } else {
        toast.error("Erro ao excluir fruta");
      }
    } catch (error) {
      console.error("Erro ao excluir fruta:", error);
      toast.error("Erro ao excluir fruta");
    }
  };

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">Frutas</h1>
            <p className="text-muted-foreground">
              Gerencie seu inventário de frutas
            </p>
          </div>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => router.push("/fruits/new")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Fruta
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <Apple className="mr-2 h-5 w-5" />
              Lista de Frutas
            </CardTitle>
            <CardDescription>
              {searchTerm
                ? `${filteredFruits.length} fruta(s) encontrada(s) de ${fruits.length} total`
                : `${fruits.length} fruta(s) cadastrada(s)`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="text-center">
                  <div className="animate-spin text-4xl mb-4">◌</div>
                  <p className="text-muted-foreground">Carregando frutas...</p>
                </div>
              </div>
            ) : fruits.length > 0 ? (
              <>
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

                {currentFruits.length > 0 ? (
                  <>
                    <div className="max-w-lg mx-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="font-semibold">
                              Nome
                            </TableHead>
                            <TableHead className="font-semibold text-right w-24">
                              Ações
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentFruits.map((fruit) => (
                            <TableRow
                              key={fruit.id}
                              className="hover:bg-muted/50"
                            >
                              <TableCell className="font-medium py-3">
                                {fruit.nome}
                              </TableCell>
                              <TableCell className="text-right py-3">
                                <div className="flex justify-end gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      router.push(`/fruits/edit/${fruit.id}`)
                                    }
                                    className="h-8 w-8 p-0"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive/90 h-8 w-8 p-0"
                                    onClick={() =>
                                      handleDelete(fruit.id, fruit.nome)
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
                    </div>

                    {totalPages > 1 && (
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-sm text-muted-foreground">
                          Mostrando {startIndex + 1} a{" "}
                          {Math.min(endIndex, filteredFruits.length)} de{" "}
                          {filteredFruits.length} frutas
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
                      Nenhuma fruta encontrada
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Não encontramos frutas com o termo "{searchTerm}".
                    </p>
                    <Button variant="outline" onClick={() => setSearchTerm("")}>
                      Limpar pesquisa
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-10">
                <Apple className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Nenhuma fruta cadastrada
                </h3>
                <p className="text-muted-foreground mb-4">
                  Comece adicionando sua primeira fruta ao inventário.
                </p>
                <Button onClick={() => router.push("/fruits/new")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Primeira Fruta
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
