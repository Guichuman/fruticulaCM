"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { Apple, Plus, ArrowLeft, Trash2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type EmbalagemFruta = {
  id: number;
  peso: number;
  sku: string;
  tipo: string;
  embalagem: {
    id: number;
    nome: string;
  };
};

type EmbalagemDisponivel = {
  id: number;
  nome: string;
  descricao?: string;
};

type Fruit = {
  id: number;
  nome: string;
  frutasEmbalagens: EmbalagemFruta[];
};

type FieldErrors = {
  nome?: string;
};

type EmbalagemFieldErrors = {
  embalagemId?: string;
  peso?: string;
  sku?: string;
  tipo?: string;
};

export default function EditFruitPage() {
  const router = useRouter();
  const params = useParams();
  const fruitId = params.id as string;

  const [nome, setNome] = useState("");

  const [embalagensFruta, setEmbalagensFruta] = useState<EmbalagemFruta[]>([]);

  const [embalagensDisponiveis, setEmbalagensDisponiveis] = useState<
    EmbalagemDisponivel[]
  >([]);
  const [isLoadingEmbalagens, setIsLoadingEmbalagens] = useState(false);

  const [isEmbalagemModalOpen, setIsEmbalagemModalOpen] = useState(false);
  const [selectedEmbalagemId, setSelectedEmbalagemId] = useState("");
  const [embalagemPeso, setEmbalagemPeso] = useState("");
  const [embalagemSku, setEmbalagemSku] = useState("");
  const [embalagemTipo, setEmbalagemTipo] = useState("");
  const [isCreatingEmbalagem, setIsCreatingEmbalagem] = useState(false);
  const [embalagemFieldErrors, setEmbalagemFieldErrors] =
    useState<EmbalagemFieldErrors>({});

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    const fetchFruit = async () => {
      try {
        const response = await fetch(`http://localhost:3000/fruta/${fruitId}`);
        if (response.ok) {
          const fruit: Fruit = await response.json();
          setNome(fruit.nome);
          setEmbalagensFruta(fruit.frutasEmbalagens || []);
        } else {
          toast.error("Fruta não encontrada");
          router.push("/fruits");
        }
      } catch (error) {
        console.error("Erro ao buscar fruta:", error);
        toast.error("Erro ao carregar dados da fruta");
        router.push("/fruits");
      } finally {
        setIsLoadingData(false);
      }
    };

    if (fruitId) {
      fetchFruit();
    }
  }, [fruitId, router]);

  const fetchEmbalagensDisponiveis = async () => {
    if (embalagensDisponiveis.length > 0) return;

    setIsLoadingEmbalagens(true);
    try {
      const response = await fetch("http://localhost:3000/embalagem");
      if (response.ok) {
        const data = await response.json();
        setEmbalagensDisponiveis(data);
      } else {
        toast.error("Erro ao carregar embalagens disponíveis");
      }
    } catch (error) {
      console.error("Erro ao buscar embalagens:", error);
      toast.error("Erro ao carregar embalagens disponíveis");
    } finally {
      setIsLoadingEmbalagens(false);
    }
  };

  const openEmbalagemModal = () => {
    setSelectedEmbalagemId("");
    setEmbalagemPeso("");
    setEmbalagemSku("");
    setEmbalagemTipo("");
    setEmbalagemFieldErrors({});
    setIsEmbalagemModalOpen(true);
    fetchEmbalagensDisponiveis(); 
  };

  const validateEmbalagemFields = (): EmbalagemFieldErrors => {
    const errors: EmbalagemFieldErrors = {};

    if (!selectedEmbalagemId) {
      errors.embalagemId = "Selecione uma embalagem";
    }

    if (!embalagemPeso.trim()) {
      errors.peso = "Peso é obrigatório";
    } else if (Number.parseFloat(embalagemPeso) <= 0) {
      errors.peso = "Peso deve ser maior que zero";
    }

    if (!embalagemSku.trim()) {
      errors.sku = "SKU é obrigatório";
    } else if (embalagemSku.trim().length < 2) {
      errors.sku = "SKU deve ter pelo menos 2 caracteres";
    }

    if (!embalagemTipo.trim()) {
      errors.tipo = "Tipo é obrigatório";
    } else if (embalagemTipo.trim().length < 1) {
      errors.tipo = "Tipo deve ter pelo menos 2 caracteres";
    }

    return errors;
  };

  const handleCreateEmbalagem = async () => {
    setEmbalagemFieldErrors({});

    const localErrors = validateEmbalagemFields();
    if (Object.keys(localErrors).length > 0) {
      setEmbalagemFieldErrors(localErrors);
      toast.error("Por favor, corrija os erros nos campos destacados");
      return;
    }

    setIsCreatingEmbalagem(true);

    try {
      const embalagemData = {
        frutaId: Number.parseInt(fruitId),
        embalagemId: Number.parseInt(selectedEmbalagemId),
        peso: Number.parseFloat(embalagemPeso),
        sku: embalagemSku.trim(),
        tipo: embalagemTipo.trim(),
      };

      const response = await fetch("http://localhost:3000/frutas-embalagens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(embalagemData),
      });

      if (response.ok) {
        const newEmbalagemFruta = await response.json();

        const embalagemSelecionada = embalagensDisponiveis.find(
          (e) => e.id.toString() === selectedEmbalagemId
        );

        const embalagemToAdd: EmbalagemFruta = {
          id: newEmbalagemFruta.id,
          peso: Number.parseFloat(embalagemPeso),
          sku: embalagemSku.trim(),
          tipo: embalagemTipo.trim(),
          embalagem: {
            id: Number.parseInt(selectedEmbalagemId),
            nome: embalagemSelecionada?.nome || "Embalagem",
          },
        };

        setEmbalagensFruta([...embalagensFruta, embalagemToAdd]);
        setIsEmbalagemModalOpen(false);
        toast.success("Embalagem cadastrada com sucesso!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Erro ao cadastrar embalagem");
      }
    } catch (error) {
      console.error("Erro ao cadastrar embalagem:", error);
      toast.error("Erro de conexão ao cadastrar embalagem");
    } finally {
      setIsCreatingEmbalagem(false);
    }
  };

  const handleDeleteEmbalagem = async (embalagemFrutaId: number) => {
    if (!confirm("Tem certeza que deseja excluir esta embalagem?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/frutas-embalagens/${embalagemFrutaId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setEmbalagensFruta(
          embalagensFruta.filter((e) => e.id !== embalagemFrutaId)
        );
        toast.success("Embalagem removida com sucesso");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Erro ao remover embalagem");
      }
    } catch (error) {
      console.error("Erro ao remover embalagem:", error);
      toast.error("Erro de conexão ao remover embalagem");
    }
  };

  const validateFields = (): FieldErrors => {
    const errors: FieldErrors = {};

    if (!nome.trim()) {
      errors.nome = "Nome da fruta é obrigatório";
    } else if (nome.trim().length < 2) {
      errors.nome = "Nome deve ter pelo menos 2 caracteres";
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setFieldErrors({});

    // Validação local
    const localErrors = validateFields();
    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors);
      toast.error("Por favor, corrija os erros nos campos destacados");
      return;
    }

    setIsLoading(true);

    try {
      const frutaData = {
        nome: nome.trim(),
      };

      const response = await fetch(`http://localhost:3000/fruta/${fruitId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(frutaData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "Erro ao atualizar fruta");
        return;
      }

      toast.success("Fruta atualizada com sucesso!", {
        description: `${nome} foi atualizada no inventário.`,
        duration: 4000,
      });

      setTimeout(() => {
        router.push("/fruits");
      }, 2000);
    } catch (err) {
      console.error("Erro na requisição:", err);
      toast.error("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto py-10">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin text-4xl mb-4">◌</div>
              <p className="text-muted-foreground">
                Carregando dados da fruta...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto py-10">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="outline"
            className="mb-6 bg-transparent"
            onClick={() => router.push("/fruits")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Frutas
          </Button>

          <Card>
            <CardHeader className="bg-primary/10">
              <CardTitle className="flex items-center text-primary">
                <Apple className="mr-2 h-5 w-5" />
                Editar Fruta
              </CardTitle>
              <CardDescription>
                Atualize os dados da fruta e suas embalagens
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Fruta</Label>
                  <Input
                    id="name"
                    placeholder="Digite o nome da fruta"
                    value={nome}
                    onChange={(e) => {
                      setNome(e.target.value);
                      if (fieldErrors.nome) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          nome: undefined,
                        }));
                      }
                    }}
                    className={
                      fieldErrors.nome
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }
                  />
                  {fieldErrors.nome && (
                    <p className="text-sm text-red-600">{fieldErrors.nome}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Embalagens</Label>
                    <Button
                      type="button"
                      onClick={openEmbalagemModal}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Cadastrar Embalagem
                    </Button>
                  </div>

                  {embalagensFruta.length > 0 && (
                    <div className="border rounded-md">
                      <div className="divide-y">
                        {embalagensFruta.map((embalagemFruta) => (
                          <div
                            key={embalagemFruta.id}
                            className="flex items-center justify-between p-3"
                          >
                            <div className="flex-1">
                              <span className="font-medium">
                                {embalagemFruta.embalagem.nome}
                              </span>
                              <span className="text-muted-foreground ml-2">
                                - {embalagemFruta.tipo} - {embalagemFruta.peso}g
                                - SKU: {embalagemFruta.sku}
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive/90"
                              onClick={() =>
                                handleDeleteEmbalagem(embalagemFruta.id)
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {embalagensFruta.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground border rounded-md border-dashed">
                      Nenhuma embalagem cadastrada. Clique em "Cadastrar
                      Embalagem" para adicionar.
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">◌</span>
                      Atualizando...
                    </>
                  ) : (
                    <>
                      <Apple className="mr-2 h-4 w-4" />
                      Atualizar Fruta
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog
        open={isEmbalagemModalOpen}
        onOpenChange={setIsEmbalagemModalOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cadastrar Embalagem</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="embalagem-select">Embalagem</Label>
              <Select
                value={selectedEmbalagemId}
                onValueChange={(value) => {
                  setSelectedEmbalagemId(value);
                  if (embalagemFieldErrors.embalagemId) {
                    setEmbalagemFieldErrors((prev) => ({
                      ...prev,
                      embalagemId: undefined,
                    }));
                  }
                }}
              >
                <SelectTrigger
                  id="embalagem-select"
                  className={
                    embalagemFieldErrors.embalagemId
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }
                >
                  <SelectValue
                    placeholder={
                      isLoadingEmbalagens
                        ? "Carregando embalagens..."
                        : "Selecione uma embalagem"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {embalagensDisponiveis.map((embalagem) => (
                    <SelectItem
                      key={embalagem.id}
                      value={embalagem.id.toString()}
                    >
                      {embalagem.nome}
                      {embalagem.descricao && (
                        <span className="text-muted-foreground ml-2">
                          - {embalagem.descricao}
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {embalagemFieldErrors.embalagemId && (
                <p className="text-sm text-red-600">
                  {embalagemFieldErrors.embalagemId}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="embalagem-peso">Peso (kg)</Label>
              <Input
                id="embalagem-peso"
                type="number"
                step="0.01"
                placeholder="Digite o peso da embalagem"
                value={embalagemPeso}
                onChange={(e) => {
                  setEmbalagemPeso(e.target.value);
                  if (embalagemFieldErrors.peso) {
                    setEmbalagemFieldErrors((prev) => ({
                      ...prev,
                      peso: undefined,
                    }));
                  }
                }}
                className={
                  embalagemFieldErrors.peso
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }
              />
              {embalagemFieldErrors.peso && (
                <p className="text-sm text-red-600">
                  {embalagemFieldErrors.peso}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="embalagem-sku">SKU</Label>
              <Input
                id="embalagem-sku"
                placeholder="Digite o SKU da embalagem"
                value={embalagemSku}
                onChange={(e) => {
                  setEmbalagemSku(e.target.value);
                  if (embalagemFieldErrors.sku) {
                    setEmbalagemFieldErrors((prev) => ({
                      ...prev,
                      sku: undefined,
                    }));
                  }
                }}
                className={
                  embalagemFieldErrors.sku
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }
              />
              {embalagemFieldErrors.sku && (
                <p className="text-sm text-red-600">
                  {embalagemFieldErrors.sku}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="embalagem-tipo">Tipo</Label>
              <Input
                id="embalagem-tipo"
                placeholder="Digite o tipo da embalagem"
                value={embalagemTipo}
                onChange={(e) => {
                  setEmbalagemTipo(e.target.value);
                  if (embalagemFieldErrors.tipo) {
                    setEmbalagemFieldErrors((prev) => ({
                      ...prev,
                      tipo: undefined,
                    }));
                  }
                }}
                className={
                  embalagemFieldErrors.tipo
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }
              />
              {embalagemFieldErrors.tipo && (
                <p className="text-sm text-red-600">
                  {embalagemFieldErrors.tipo}
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEmbalagemModalOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleCreateEmbalagem}
                disabled={isCreatingEmbalagem || isLoadingEmbalagens}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {isCreatingEmbalagem ? (
                  <>
                    <span className="animate-spin mr-2">◌</span>
                    Cadastrando...
                  </>
                ) : (
                  "Cadastrar"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
