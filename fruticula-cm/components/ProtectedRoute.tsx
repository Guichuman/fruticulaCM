"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { estaAutenticado } from "@/lib/auth";

interface RotaProtegidaProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: RotaProtegidaProps) {
  const roteador = useRouter();
  const [verificando, setVerificando] = useState(true);

  useEffect(() => {
    if (!estaAutenticado()) {
      roteador.push("/login");
    } else {
      setVerificando(false);
    }
  }, [roteador]);

  if (verificando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">◌</div>
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
