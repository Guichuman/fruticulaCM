"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { estaAutenticado, eAdministrador } from "@/lib/auth";

interface Props {
  children: React.ReactNode;
}

export function ProtectedAdminRoute({ children }: Props) {
  const roteador = useRouter();
  const [verificando, setVerificando] = useState(true);

  useEffect(() => {
    if (!estaAutenticado()) {
      roteador.push("/login");
    } else if (!eAdministrador()) {
      roteador.push("/");
    } else {
      setVerificando(false);
    }
  }, [roteador]);

  if (verificando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">◌</div>
          <p className="text-muted-foreground">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
