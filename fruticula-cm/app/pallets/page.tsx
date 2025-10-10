"use client"

import { useState } from "react"
import { NavBar } from "@/components/nav-bar"
import { Layers, Plus, Trash2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type FruitItem = {
  id: number
  name: string
  type: string
  quantity: number
}

export default function PalletsPage() {
  const [fruitItems, setFruitItems] = useState<FruitItem[]>([])
  const [nextId, setNextId] = useState(1)
  const [selectedFruit, setSelectedFruit] = useState("")
  const [fruitType, setFruitType] = useState("")
  const [quantity, setQuantity] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const addFruitItem = () => {
    if (selectedFruit && quantity) {
      const newItem: FruitItem = {
        id: nextId,
        name: selectedFruit,
        type: fruitType,
        quantity: Number.parseInt(quantity, 10),
      }

      setFruitItems([...fruitItems, newItem])
      setNextId(nextId + 1)

      setSelectedFruit("")
      setFruitType("")
      setQuantity("")

      setIsDialogOpen(false)
    }
  }

  const removeFruitItem = (id: number) => {
    setFruitItems(fruitItems.filter((item) => item.id !== id))
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-primary">Pallets</h1>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Pallet
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader className="bg-primary/10">
            <CardTitle className="flex items-center text-primary">
              <Layers className="mr-2 h-5 w-5" />
              Cadastrar Romaneio
            </CardTitle>
            <CardDescription>Crie um novo romaneio de frutas</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="romaneio">Nº do Romaneio</Label>
                <Input id="romaneio" placeholder="Digite o número do romaneio" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input id="date" type="date" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="driver">Motorista</Label>
                <Select>
                  <SelectTrigger id="driver">
                    <SelectValue placeholder="Selecione o motorista" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="driver1">João Silva</SelectItem>
                    <SelectItem value="driver2">Maria Oliveira</SelectItem>
                    <SelectItem value="driver3">Carlos Santos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="plate">Placa Nº</Label>
                <Input id="plate" placeholder="Digite a placa do veículo" />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Discriminação de Frutas</h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90">
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Fruta
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Fruta ao Pallet</DialogTitle>
                      <DialogDescription>Selecione a fruta e informe a quantidade.</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="fruit-select">Fruta</Label>
                        <Select value={selectedFruit} onValueChange={setSelectedFruit}>
                          <SelectTrigger id="fruit-select">
                            <SelectValue placeholder="Selecione a fruta" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="limao">Limão</SelectItem>
                            <SelectItem value="goiaba">Goiaba</SelectItem>
                            <SelectItem value="abacaxi">Abacaxi</SelectItem>
                            <SelectItem value="laranja">Laranja</SelectItem>
                            <SelectItem value="manga">Manga</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="type-select">Tipo/Número</Label>
                        <Select value={fruitType} onValueChange={setFruitType}>
                          <SelectTrigger id="type-select">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="1V">1V</SelectItem>
                            <SelectItem value="2V">2V</SelectItem>
                            <SelectItem value="3V">3V</SelectItem>
                            <SelectItem value="4V">4V</SelectItem>
                            <SelectItem value="plant. verde">plant. verde</SelectItem>
                            <SelectItem value="plant. mad.">plant. mad.</SelectItem>
                            <SelectItem value="miúda">miúda</SelectItem>
                            <SelectItem value="média">média</SelectItem>
                            <SelectItem value="grande">grande</SelectItem>
                            <SelectItem value="bom">bom</SelectItem>
                            <SelectItem value="fraco">fraco</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="quantity-input">Quantidade</Label>
                        <Input
                          id="quantity-input"
                          type="number"
                          placeholder="Digite a quantidade"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button onClick={addFruitItem}>Adicionar Fruta ao Pallet</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="border rounded-md">
                {fruitItems.length > 0 ? (
                  <div className="divide-y">
                    {fruitItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3">
                        <div className="flex-1">
                          <span className="font-medium">{item.name} </span>
                          <span className="text-muted-foreground">{item.type} - </span>
                          <span>{item.quantity}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive/90"
                          onClick={() => removeFruitItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    Nenhuma fruta adicionada. Clique em "Adicionar Fruta" para começar.
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <Label htmlFor="signature">Assinatura</Label>
              <Input id="signature" placeholder="Digite o nome para assinatura" />
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
              <Save className="mr-2 h-4 w-4" />
              Salvar Romaneio
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

