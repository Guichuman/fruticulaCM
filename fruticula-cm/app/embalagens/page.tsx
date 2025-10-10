"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { Package2, Plus, Edit, Trash2, Search } from "lucide-react";
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

type Embalagem = {
  id: number;
  nome: string;
  descricao?: string;
};

export default function EmbalagensPage() {
  const router = useRouter();
  const [embalagens, setEmbalagens] = useState<Embalagem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredEmbalagens = embalagens.filter((embalagem) =>
    embalagem.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmbalagens.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmbalagens = filteredEmbalagens.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    const fetchEmbalagens = async () => {
      try {
        const response = await fetch("http://localhost:3000/embalagem");
        if (response.ok) {
          const data = await response.json();
          setEmbalagens(data);
        } else {
          toast.error("Erro ao carregar embalagens");
        }
      } catch (error) {
        console.error("Erro ao buscar embalagens:", error);
        toast.error("Erro ao carregar embalagens");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmbalagens();
  }, []);

  const handleDelete = async (id: number, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir a embalagem ${nome}?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/embalagem/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setEmbalagens(embalagens.filter((embalagem) => embalagem.id !== id));
        toast.success(`Embalagem ${nome} excluída com sucesso`);
      } else {
        toast.error("Erro ao excluir embalagem");
      }
    } catch (error) {
      console.error("Erro ao excluir embalagem:", error);
      toast.error("Erro ao excluir embalagem");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">Embalagens</h1>
            <p className="text-muted-foreground">
              Gerencie os tipos de embalagem
            </p>
          </div>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => router.push("/embalagens/new")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Embalagem
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <Package2 className="mr-2 h-5 w-5" />
              Lista de Embalagens
            </CardTitle>
            <CardDescription>
              {searchTerm
                ? `${filteredEmbalagens.length} embalagem(ns) encontrada(s) de ${embalagens.length} total`
                : `${embalagens.length} embalagem(ns) cadastrada(s)`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="text-center">
                  <div className="animate-spin text-4xl mb-4">◌</div>
                  <p className="text-muted-foreground">
                    Carregando embalagens...
                  </p>
                </div>
              </div>
            ) : embalagens.length > 0 ? (
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

                {currentEmbalagens.length > 0 ? (
                  <>
                    <div className="max-w-2xl mx-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-center font-semibold">
                              Nome
                            </TableHead>
                            <TableHead className="text-center font-semibold w-32">
                              Ações
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentEmbalagens.map((embalagem) => (
                            <TableRow
                              key={embalagem.id}
                              className="hover:bg-muted/50"
                            >
                              <TableCell className="font-medium text-center py-4">
                                {embalagem.nome}
                              </TableCell>
                              <TableCell className="text-center py-4">
                                <div className="flex justify-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      router.push(
                                        `/embalagens/edit/${embalagem.id}`
                                      )
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
                                      handleDelete(embalagem.id, embalagem.nome)
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
                          {Math.min(endIndex, filteredEmbalagens.length)} de{" "}
                          {filteredEmbalagens.length} embalagens
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
                      Nenhuma embalagem encontrada
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Não encontramos embalagens com o termo "{searchTerm}".
                    </p>
                    <Button variant="outline" onClick={() => setSearchTerm("")}>
                      Limpar pesquisa
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-10">
                <Package2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Nenhuma embalagem cadastrada
                </h3>
                <p className="text-muted-foreground mb-4">
                  Comece adicionando seu primeiro tipo de embalagem.
                </p>
                <Button onClick={() => router.push("/embalagens/new")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Primeira Embalagem
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
