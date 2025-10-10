"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { ArrowLeft, Plus, Trash2, Edit, X } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type FruitItem = {
  id: number;
  name: string;
  packaging: string;
  quantity: number;
};

type Pallet = {
  id: number;
  bloco: number;
  lado: string;
  frutas: FruitItem[];
};

type LoadData = {
  id: number;
  data: string;
  caminhao: {
    placa: string;
    qtdBlocos: number;
    motorista: {
      nome: string;
    };
  };
  status: string;
  maxCaixas: number;
};

type Fruit = {
  id: number;
  nome: string;
  embalagens: Array<{
    id: number;
    nome: string;
  }>;
};

export default function LoadingPage() {
  const router = useRouter();
  const params = useParams();
  const loadId = params.id as string;

  const [loadData, setLoadData] = useState<LoadData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [loadedPallets, setLoadedPallets] = useState<Pallet[]>([]);

  const [isPalletModalOpen, setIsPalletModalOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedSide, setSelectedSide] = useState("");

  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [selectedFruitId, setSelectedFruitId] = useState("");
  const [availablePackaging, setAvailablePackaging] = useState<
    Array<{ id: number; nome: string }>
  >([]);
  const [selectedPackagingId, setSelectedPackagingId] = useState("");
  const [quantity, setQuantity] = useState("");

  const [palletItems, setPalletItems] = useState<FruitItem[]>([]);
  const [nextItemId, setNextItemId] = useState(1);

  useEffect(() => {
    const fetchLoadData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/carga/${loadId}`);
        if (response.ok) {
          const data = await response.json();
          setLoadData(data);
        } else {
          toast.error("Erro ao carregar dados da carga");
          router.push("/loads");
        }
      } catch (error) {
        console.error("Erro ao buscar dados da carga:", error);
        toast.error("Erro ao carregar dados da carga");
        router.push("/loads");
      } finally {
        setIsLoadingData(false);
      }
    };

    if (loadId) {
      fetchLoadData();
    }
  }, [loadId, router]);

  useEffect(() => {
    const fetchFruits = async () => {
      try {
        const response = await fetch("http://localhost:3000/fruta");
        if (response.ok) {
          const data = await response.json();
          setFruits(data);
        }
      } catch (error) {
        console.error("Erro ao buscar frutas:", error);
      }
    };

    fetchFruits();
  }, []);

  useEffect(() => {
    const fetchPackaging = async () => {
      if (!selectedFruitId) {
        setAvailablePackaging([]);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/frutas-embalagens/?id=${selectedFruitId}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log("DATA: ", data);
          setAvailablePackaging(data.embalagem);
        } else {
          setAvailablePackaging([]);
        }
      } catch (error) {
        console.error("Erro ao buscar embalagens:", error);
        setAvailablePackaging([]);
      }
    };

    fetchPackaging();
    setSelectedPackagingId("");
  }, [selectedFruitId]);

  const calculateProgress = () => {
    if (!loadData) return 0;
    const maxPallets = loadData.maxCaixas;
    const currentPallets = loadedPallets.length;

    if (maxPallets === 0) return 0;
    return Math.min((currentPallets / maxPallets) * 100, 100);
  };

  const getAvailableBlocks = () => {
    if (!loadData) return [];

    const blocks = [];
    const maxBlocks = Math.min(loadData.maxCaixas, 14);
    for (let i = 1; i <= maxBlocks; i++) {
      blocks.push(i);
    }
    return blocks;
  };

  const getAvailableSides = (blockNumber: string) => {
    if (!blockNumber) return [];

    const allSides = [
      { value: "L.D. Motorista", label: "L.D. Motorista" },
      { value: "L.D. Motorista Baixo", label: "L.D. Motorista Baixo" },
      { value: "L.D. Ajudante", label: "L.D. Ajudante" },
      { value: "L.D. Ajudante Baixo", label: "L.D. Ajudante Baixo" },
    ];

    const occupiedSides = loadedPallets
      .filter((pallet) => pallet.bloco === Number.parseInt(blockNumber))
      .map((pallet) => pallet.lado);

    return allSides.filter((side) => !occupiedSides.includes(side.value));
  };

  const openAddPalletModal = () => {
    setSelectedBlock("");
    setSelectedSide("");
    setSelectedFruitId("");
    setSelectedPackagingId("");
    setQuantity("");
    setPalletItems([]);
    setIsPalletModalOpen(true);
  };

  const addItemToPallet = () => {
    if (!selectedFruitId || !selectedPackagingId || !quantity) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    const selectedFruit = fruits.find(
      (f) => f.id.toString() === selectedFruitId
    );
    const selectedPackaging = availablePackaging.find(
      (p) => p.id.toString() === selectedPackagingId
    );

    if (!selectedFruit || !selectedPackaging) {
      toast.error("Fruta ou embalagem não encontrada");
      return;
    }

    const newItem: FruitItem = {
      id: nextItemId,
      name: selectedFruit.nome,
      packaging: selectedPackaging.nome,
      quantity: Number.parseInt(quantity, 10),
    };

    setPalletItems([...palletItems, newItem]);
    setNextItemId(nextItemId + 1);

    setSelectedFruitId("");
    setSelectedPackagingId("");
    setQuantity("");
    setAvailablePackaging([]);

    toast.success("Item adicionado ao pallet");
  };

  const removeItemFromPallet = (itemId: number) => {
    setPalletItems(palletItems.filter((item) => item.id !== itemId));
    toast.success("Item removido do pallet");
  };

  const savePalletToLoad = () => {
    if (!selectedBlock || !selectedSide) {
      toast.error("Por favor, selecione o bloco e a posição");
      return;
    }

    if (palletItems.length === 0) {
      toast.error("Adicione pelo menos um item ao pallet");
      return;
    }

    const newPallet: Pallet = {
      id: Date.now(),
      bloco: Number.parseInt(selectedBlock),
      lado: selectedSide,
      frutas: [...palletItems],
    };

    setLoadedPallets([...loadedPallets, newPallet]);
    setIsPalletModalOpen(false);
    toast.success("Pallet salvo na carga com sucesso!");
  };

  const editPallet = (pallet: Pallet) => {
    setSelectedBlock(pallet.bloco.toString());
    setSelectedSide(pallet.lado);
    setPalletItems([...pallet.frutas]);
    setIsPalletModalOpen(true);
  };

  const removePallet = (palletId: number) => {
    setLoadedPallets(loadedPallets.filter((p) => p.id !== palletId));
    toast.success("Pallet removido com sucesso");
  };

  const finalizarCarga = async () => {
    if (calculateProgress() < 100) {
      toast.error("A carga deve estar 100% carregada para ser finalizada");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/carga/${loadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "finalizada",
          pallets: loadedPallets,
        }),
      });

      if (response.ok) {
        toast.success("Carga finalizada com sucesso!", {
          description: "Redirecionando para a lista de cargas...",
          duration: 3000,
        });

        setTimeout(() => {
          router.push("/loads");
        }, 2000);
      } else {
        toast.error("Erro ao finalizar carga");
      }
    } catch (error) {
      console.error("Erro ao finalizar carga:", error);
      toast.error("Erro de conexão ao finalizar carga");
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
                Carregando dados da carga...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!loadData) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar />
        <div className="container mx-auto py-10">
          <div className="text-center">
            <p className="text-muted-foreground">Carga não encontrada</p>
            <Button onClick={() => router.push("/loads")} className="mt-4">
              Voltar para Cargas
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto py-10">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="outline"
            className="mb-6 bg-transparent"
            onClick={() => router.push("/loads")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Cargas Abertas
          </Button>

          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-primary">
                Detalhes da Carga
              </CardTitle>
              <CardDescription>
                Gerencie o carregamento dos pallets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-4 bg-gray-100 rounded-lg space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">ID da Carga:</span>{" "}
                    {loadData.id}
                  </div>
                  <div>
                    <span className="font-medium">Data:</span>{" "}
                    {new Date(loadData.data).toLocaleDateString("pt-BR")}
                  </div>
                  <div>
                    <span className="font-medium">Caminhão:</span>{" "}
                    {loadData.caminhao.placa}
                  </div>
                  <div>
                    <span className="font-medium">Motorista:</span>{" "}
                    {loadData.caminhao.motorista.nome}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
                    {loadedPallets.length} de {loadData.maxCaixas} pallets
                    carregados ({Math.round(calculateProgress())}
                    %)
                  </span>
                </div>
                <Progress
                  value={calculateProgress()}
                  dynamicColor={true}
                  className="h-4"
                />
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-center mb-6">
                  Visualização da Carga
                </h3>

                <div className="flex justify-center gap-4 mb-6">
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={openAddPalletModal}
                    disabled={loadedPallets.length >= loadData.maxCaixas}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Pallet
                  </Button>

                  <Button
                    className="bg-yellow-500 hover:bg-yellow-600 text-black"
                    onClick={finalizarCarga}
                    disabled={calculateProgress() < 100}
                  >
                    Finalizar Carga
                  </Button>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-center font-semibold border-r">
                          Bloco
                        </TableHead>
                        <TableHead className="text-center font-semibold border-r">
                          L.D. Motorista
                        </TableHead>
                        <TableHead className="text-center font-semibold border-r">
                          L.D. Motorista Baixo
                        </TableHead>
                        <TableHead className="text-center font-semibold border-r">
                          L.D. Ajudante
                        </TableHead>
                        <TableHead className="text-center font-semibold">
                          L.D. Ajudante Baixo
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.from(
                        { length: Math.min(loadData.maxCaixas, 14) },
                        (_, index) => {
                          const blockNumber = index + 1;

                          // Encontrar pallets para este bloco
                          const motoristaAlto = loadedPallets.find(
                            (p) =>
                              p.bloco === blockNumber &&
                              p.lado === "L.D. Motorista"
                          );
                          const motoristaBaixo = loadedPallets.find(
                            (p) =>
                              p.bloco === blockNumber &&
                              p.lado === "L.D. Motorista Baixo"
                          );
                          const ajudanteAlto = loadedPallets.find(
                            (p) =>
                              p.bloco === blockNumber &&
                              p.lado === "L.D. Ajudante"
                          );
                          const ajudanteBaixo = loadedPallets.find(
                            (p) =>
                              p.bloco === blockNumber &&
                              p.lado === "L.D. Ajudante Baixo"
                          );

                          return (
                            <TableRow
                              key={blockNumber}
                              className="hover:bg-muted/30"
                            >
                              <TableCell className="text-center font-medium border-r bg-muted/20">
                                {blockNumber}
                              </TableCell>

                              <TableCell className="border-r p-2">
                                {motoristaAlto ? (
                                  <div className="bg-green-100 border border-green-300 rounded p-2 min-h-[60px] relative group cursor-pointer">
                                    <div className="text-xs font-medium text-green-800 mb-1">
                                      {motoristaAlto.frutas.length > 0
                                        ? motoristaAlto.frutas[0].name
                                        : "Pallet"}
                                    </div>
                                    <div className="text-xs text-green-600">
                                      {motoristaAlto.frutas.reduce(
                                        (total, fruta) =>
                                          total + fruta.quantity,
                                        0
                                      )}{" "}
                                      caixas
                                    </div>

                                    {/* Botões de ação - aparecem no hover */}
                                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 bg-white/80 hover:bg-white"
                                        onClick={() =>
                                          editPallet(motoristaAlto)
                                        }
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 bg-white/80 hover:bg-white text-destructive"
                                        onClick={() =>
                                          removePallet(motoristaAlto.id)
                                        }
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="bg-gray-50 border border-gray-200 rounded p-2 min-h-[60px] flex items-center justify-center">
                                    <span className="text-gray-400 text-xs">
                                      Vazio
                                    </span>
                                  </div>
                                )}
                              </TableCell>

                              <TableCell className="border-r p-2">
                                {motoristaBaixo ? (
                                  <div className="bg-green-100 border border-green-300 rounded p-2 min-h-[60px] relative group cursor-pointer">
                                    <div className="text-xs font-medium text-green-800 mb-1">
                                      {motoristaBaixo.frutas.length > 0
                                        ? motoristaBaixo.frutas[0].name
                                        : "Pallet"}
                                    </div>
                                    <div className="text-xs text-green-600">
                                      {motoristaBaixo.frutas.reduce(
                                        (total, fruta) =>
                                          total + fruta.quantity,
                                        0
                                      )}{" "}
                                      caixas
                                    </div>

                                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 bg-white/80 hover:bg-white"
                                        onClick={() =>
                                          editPallet(motoristaBaixo)
                                        }
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 bg-white/80 hover:bg-white text-destructive"
                                        onClick={() =>
                                          removePallet(motoristaBaixo.id)
                                        }
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="bg-gray-50 border border-gray-200 rounded p-2 min-h-[60px] flex items-center justify-center">
                                    <span className="text-gray-400 text-xs">
                                      Vazio
                                    </span>
                                  </div>
                                )}
                              </TableCell>

                              <TableCell className="border-r p-2">
                                {ajudanteAlto ? (
                                  <div className="bg-green-100 border border-green-300 rounded p-2 min-h-[60px] relative group cursor-pointer">
                                    <div className="text-xs font-medium text-green-800 mb-1">
                                      {ajudanteAlto.frutas.length > 0
                                        ? ajudanteAlto.frutas[0].name
                                        : "Pallet"}
                                    </div>
                                    <div className="text-xs text-green-600">
                                      {ajudanteAlto.frutas.reduce(
                                        (total, fruta) =>
                                          total + fruta.quantity,
                                        0
                                      )}{" "}
                                      caixas
                                    </div>

                                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 bg-white/80 hover:bg-white"
                                        onClick={() => editPallet(ajudanteAlto)}
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 bg-white/80 hover:bg-white text-destructive"
                                        onClick={() =>
                                          removePallet(ajudanteAlto.id)
                                        }
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="bg-gray-50 border border-gray-200 rounded p-2 min-h-[60px] flex items-center justify-center">
                                    <span className="text-gray-400 text-xs">
                                      Vazio
                                    </span>
                                  </div>
                                )}
                              </TableCell>

                              <TableCell className="p-2">
                                {ajudanteBaixo ? (
                                  <div className="bg-green-100 border border-green-300 rounded p-2 min-h-[60px] relative group cursor-pointer">
                                    <div className="text-xs font-medium text-green-800 mb-1">
                                      {ajudanteBaixo.frutas.length > 0
                                        ? ajudanteBaixo.frutas[0].name
                                        : "Pallet"}
                                    </div>
                                    <div className="text-xs text-green-600">
                                      {ajudanteBaixo.frutas.reduce(
                                        (total, fruta) =>
                                          total + fruta.quantity,
                                        0
                                      )}{" "}
                                      caixas
                                    </div>

                                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 bg-white/80 hover:bg-white"
                                        onClick={() =>
                                          editPallet(ajudanteBaixo)
                                        }
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 bg-white/80 hover:bg-white text-destructive"
                                        onClick={() =>
                                          removePallet(ajudanteBaixo.id)
                                        }
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="bg-gray-50 border border-gray-200 rounded p-2 min-h-[60px] flex items-center justify-center">
                                    <span className="text-gray-400 text-xs">
                                      Vazio
                                    </span>
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        }
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-4 flex justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                    <span>Pallet Carregado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
                    <span>Posição Vazia</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isPalletModalOpen} onOpenChange={setIsPalletModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="relative">
            <DialogTitle className="text-center text-xl font-semibold">
              Montar Pallet
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-6 w-6 p-0"
              onClick={() => setIsPalletModalOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="block-select" className="font-medium">
                  Bloco do Pallet
                </Label>
                <Select value={selectedBlock} onValueChange={setSelectedBlock}>
                  <SelectTrigger id="block-select">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableBlocks().map((block) => (
                      <SelectItem key={block} value={block.toString()}>
                        Bloco {block}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="side-select" className="font-medium">
                  Posição do Pallet
                </Label>
                <Select
                  value={selectedSide}
                  onValueChange={setSelectedSide}
                  disabled={!selectedBlock}
                >
                  <SelectTrigger id="side-select">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableSides(selectedBlock).map((side) => (
                      <SelectItem key={side.value} value={side.value}>
                        {side.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div className="space-y-4">
              <h3 className="text-center text-lg font-medium">
                Itens do Pallet
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-2">
                  <Label htmlFor="fruit-select" className="font-medium">
                    Fruta
                  </Label>
                  <Select
                    value={selectedFruitId}
                    onValueChange={setSelectedFruitId}
                  >
                    <SelectTrigger id="fruit-select">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {fruits.map((fruit) => (
                        <SelectItem key={fruit.id} value={fruit.id.toString()}>
                          {fruit.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="packaging-select" className="font-medium">
                    Embalagem
                  </Label>
                  <Select
                    value={selectedPackagingId}
                    onValueChange={setSelectedPackagingId}
                    disabled={
                      !selectedFruitId || availablePackaging.length === 0
                    }
                  >
                    <SelectTrigger id="packaging-select">
                      <SelectValue
                        placeholder={
                          !selectedFruitId
                            ? "Selecione uma fruta primeiro"
                            : availablePackaging.length === 0
                            ? "Nenhuma embalagem disponível"
                            : "Selecione..."
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePackaging.map((packaging) => (
                        <SelectItem
                          key={packaging.id}
                          value={packaging.id.toString()}
                        >
                          {packaging.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity-input" className="font-medium">
                    Qtd. Caixas
                  </Label>
                  <Input
                    id="quantity-input"
                    type="number"
                    placeholder="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                  />
                </div>

                <Button
                  onClick={addItemToPallet}
                  disabled={
                    !selectedFruitId || !selectedPackagingId || !quantity
                  }
                  className="bg-primary hover:bg-primary/90"
                >
                  Adicionar
                </Button>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div className="space-y-4">
              <h3 className="text-center text-lg font-medium">
                Itens no Pallet
              </h3>

              <div className="border rounded-md min-h-[120px]">
                {palletItems.length > 0 ? (
                  <div className="divide-y">
                    {palletItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3"
                      >
                        <div className="flex-1">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-muted-foreground ml-2">
                            ({item.packaging})
                          </span>
                          <span className="ml-2">- {item.quantity} caixas</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive/90"
                          onClick={() => removeItemFromPallet(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[120px] text-muted-foreground">
                    Nenhum item adicionado a este pallet.
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-start">
              <Button
                onClick={savePalletToLoad}
                disabled={
                  !selectedBlock || !selectedSide || palletItems.length === 0
                }
                className="bg-primary hover:bg-primary/90 px-8 py-3 text-lg"
              >
                Salvar Pallet na Carga
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
