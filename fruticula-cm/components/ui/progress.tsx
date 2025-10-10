"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number;
  dynamicColor?: boolean;
}

// Função para calcular a cor baseada na porcentagem
const getProgressColor = (value: number): string => {
  if (value === 0) return "bg-gray-200"; // Branco/cinza claro quando vazio

  // Interpolação de cores de vermelho para verde
  if (value <= 25) {
    return "bg-red-500"; // Vermelho para 0-25%
  } else if (value <= 50) {
    return "bg-orange-500"; // Laranja para 25-50%
  } else if (value <= 75) {
    return "bg-yellow-500"; // Amarelo para 50-75%
  } else if (value < 100) {
    return "bg-lime-500"; // Verde claro para 75-99%
  } else {
    return "bg-green-500"; // Verde para 100%
  }
};

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value = 0, dynamicColor = false, ...props }, ref) => {
  const indicatorColor = dynamicColor ? getProgressColor(value) : "bg-primary";

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-gray-100 border",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 transition-all duration-500 ease-in-out",
          indicatorColor
        )}
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
