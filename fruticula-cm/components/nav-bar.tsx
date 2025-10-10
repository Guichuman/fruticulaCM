import Link from "next/link"
import Image from "next/image"
import { Truck, User, Apple, Package, Home, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NavBar() {
  return (
    <nav className="border-b bg-background">
      <div className="container flex h-16 items-center px-4">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Image src="/logo.png" alt="Logo Frutícola CM" width={40} height={40} />
          <span className="font-bold text-primary">Frutícola CM</span>
        </Link>
        <div className="flex items-center space-x-1">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <Home className="mr-2 h-4 w-4" />
              Início
            </Button>
          </Link>
          <Link href="/drivers">
            <Button variant="ghost" size="sm">
              <User className="mr-2 h-4 w-4" />
              Motoristas
            </Button>
          </Link>
          <Link href="/trucks">
            <Button variant="ghost" size="sm">
              <Truck className="mr-2 h-4 w-4" />
              Caminhões
            </Button>
          </Link>
          <Link href="/fruits">
            <Button variant="ghost" size="sm">
              <Apple className="mr-2 h-4 w-4" />
              Frutas
            </Button>
          </Link>
          <Link href="/loads">
            <Button variant="ghost" size="sm">
              <Package className="mr-2 h-4 w-4" />
              Cargas
            </Button>
          </Link>
          <Link href="/pallets">
            <Button variant="ghost" size="sm">
              <Layers className="mr-2 h-4 w-4" />
              Pallets
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

