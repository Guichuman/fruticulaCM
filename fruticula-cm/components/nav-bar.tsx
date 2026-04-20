"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Truck, User, Apple, Package, Home, LogOut, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { obterUsuario, encerrarSessao, eAdministrador, Usuario } from "@/lib/auth";
import { toast } from "sonner";

const itensNavBase = [
  { href: "/",           label: "Início",     Icon: Home,  apenasAdmin: false },
  { href: "/motoristas", label: "Motoristas", Icon: User,  apenasAdmin: false },
  { href: "/caminhoes",  label: "Caminhões",  Icon: Truck, apenasAdmin: false },
  { href: "/frutas",     label: "Frutas",     Icon: Apple, apenasAdmin: false },
  { href: "/cargas",     label: "Cargas",     Icon: Package, apenasAdmin: false },
  { href: "/usuarios",   label: "Usuários",   Icon: Users, apenasAdmin: true  },
];

export function NavBar() {
  const roteador = useRouter();
  const pathname = usePathname();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [navegandoPara, setNavegandoPara] = useState<string | null>(null);
  const [saindo, setSaindo] = useState(false);

  useEffect(() => {
    setUsuario(obterUsuario());
    setIsAdmin(eAdministrador());
  }, []);

  const itensNav = itensNavBase.filter(
    (item) => !item.apenasAdmin || isAdmin
  );

  // Limpa o loading quando a rota muda (navegação completou)
  useEffect(() => {
    setNavegandoPara(null);
  }, [pathname]);

  const navegar = (href: string) => {
    if (navegandoPara) return;
    setNavegandoPara(href);
    roteador.push(href);
  };

  const aoSair = () => {
    setSaindo(true);
    encerrarSessao();
    toast.success("Sessão encerrada com sucesso");
    roteador.push("/login");
  };

  return (
    <nav className="border-b bg-background">
      <div className="container flex h-16 items-center px-4 justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navegar("/")}
            className="mr-6 flex items-center space-x-2 focus:outline-none"
          >
            <Image src="/logo.png" alt="Logo Frutícola CM" width={40} height={40} />
            <span className="font-bold text-primary">Frutícola CM</span>
          </button>
          <div className="flex items-center space-x-1">
            {itensNav.map(({ href, label, Icon }) => {
              const ativo = navegandoPara === href;
              return (
                <Button
                  key={href}
                  variant="ghost"
                  size="sm"
                  disabled={navegandoPara !== null}
                  onClick={() => navegar(href)}
                >
                  {ativo
                    ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    : <Icon className="mr-2 h-4 w-4" />}
                  {label}
                </Button>
              );
            })}
          </div>
        </div>

        {usuario && (
          <div className="flex items-center space-x-3">
            <div className="text-sm">
              <span className="text-muted-foreground">Olá, </span>
              <span className="font-semibold text-primary">{usuario.nome}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={saindo}
              onClick={aoSair}
              className="border-destructive text-destructive hover:bg-destructive hover:text-white"
            >
              {saindo
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saindo...</>
                : <><LogOut className="mr-2 h-4 w-4" />Sair</>}
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
