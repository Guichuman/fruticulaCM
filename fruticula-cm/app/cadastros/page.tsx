import Link from "next/link";
import { NavBar } from "@/components/nav-bar";
import { Truck, User, Apple, Package2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CadastrosPage() {
  return (
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
          <Link href="/drivers" className="block">
            <Card className="transition-all hover:shadow-xl border-l-4 border-l-blue-500 h-full min-h-[200px] bg-blue-50/30 hover:bg-blue-50/50">
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
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg">
                  <User className="mr-2 h-5 w-5" />
                  Gerenciar Motoristas
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/trucks" className="block">
            <Card className="transition-all hover:shadow-xl border-l-4 border-l-green-500 h-full min-h-[200px] bg-green-50/30 hover:bg-green-50/50">
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
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg">
                  <Truck className="mr-2 h-5 w-5" />
                  Gerenciar Caminhões
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/fruits" className="block">
            <Card className="transition-all hover:shadow-xl border-l-4 border-l-orange-500 h-full min-h-[200px] bg-orange-50/30 hover:bg-orange-50/50">
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
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 text-lg">
                  <Apple className="mr-2 h-5 w-5" />
                  Gerenciar Frutas
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/embalagens" className="block">
            <Card className="transition-all hover:shadow-xl border-l-4 border-l-purple-500 h-full min-h-[200px] bg-purple-50/30 hover:bg-purple-50/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-2xl font-medium text-purple-700">
                  Embalagens
                </CardTitle>
                <Package2 className="h-12 w-12 text-purple-600" />
              </CardHeader>
              <CardContent className="pt-2">
                <CardDescription className="text-base mb-6 text-purple-600">
                  Gerencie os tipos de embalagem
                </CardDescription>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg">
                  <Package2 className="mr-2 h-5 w-5" />
                  Gerenciar Embalagens
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  );
}
