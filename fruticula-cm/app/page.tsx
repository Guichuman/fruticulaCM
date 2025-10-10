import Link from "next/link";
import { NavBar } from "@/components/nav-bar";
import { Package, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto py-16 px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Frutícola CM</h1>
          <p className="text-xl text-muted-foreground">
            Sistema de Entrega Agrícola
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <Link href="/cadastros" className="block">
            <Card className="transition-all hover:shadow-2xl border-l-4 border-l-primary h-full min-h-[280px] bg-primary/5 hover:bg-primary/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                <CardTitle className="text-3xl font-medium text-primary">
                  Cadastros
                </CardTitle>
                <Settings className="h-16 w-16 text-primary" />
              </CardHeader>
              <CardContent className="pt-4">
                <CardDescription className="text-lg mb-8 text-muted-foreground leading-relaxed">
                  Gerencie motoristas, caminhões, frutas e embalagens do seu
                  sistema de entrega
                </CardDescription>
                <Button className="w-full bg-primary hover:bg-primary/90 py-4 text-xl font-semibold">
                  <Settings className="mr-3 h-6 w-6" />
                  Acessar Cadastros
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/loads" className="block">
            <Card className="transition-all hover:shadow-2xl border-l-4 border-l-primary h-full min-h-[280px] bg-primary/5 hover:bg-primary/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
                <CardTitle className="text-3xl font-medium text-primary">
                  Cargas
                </CardTitle>
                <Package className="h-16 w-16 text-primary" />
              </CardHeader>
              <CardContent className="pt-4">
                <CardDescription className="text-lg mb-8 text-muted-foreground leading-relaxed">
                  Gerencie suas cargas de entrega, pallets e acompanhe o status
                  dos carregamentos
                </CardDescription>
                <Button className="w-full bg-primary hover:bg-primary/90 py-4 text-xl font-semibold">
                  <Package className="mr-3 h-6 w-6" />
                  Gerenciar Cargas
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  );
}
