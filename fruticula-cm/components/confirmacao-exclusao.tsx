"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmacaoExclusaoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Chamado quando o usuário confirma a exclusão */
  onConfirmar: () => void | Promise<void>;
  /** Exibe botão em estado de loading enquanto a operação está em curso */
  carregando?: boolean;
}

export function ConfirmacaoExclusao({
  open,
  onOpenChange,
  onConfirmar,
  carregando = false,
}: ConfirmacaoExclusaoProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Confirmar exclusão</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground py-1">
          Tem certeza que deseja excluir esse item?
        </p>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={carregando}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirmar}
            disabled={carregando}
          >
            {carregando ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
