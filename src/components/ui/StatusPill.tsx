"use client";

import { cn } from "@/lib/utils";

type PillVariant = "positive" | "alerta" | "critico" | "neutro";

interface StatusPillProps {
  variant: PillVariant;
  children: React.ReactNode;
  className?: string;
}

const variants: Record<PillVariant, string> = {
  positive: "bg-green/15 text-green",
  alerta: "bg-amber/15 text-amber",
  critico: "bg-coral/15 text-coral",
  neutro: "bg-white/10 text-text-tertiary",
};

export function StatusPill({ variant, children, className }: StatusPillProps) {
  return (
    <span
      role="status"
      className={cn(
        "inline-flex items-center px-[10px] py-[3px] rounded-pill text-[11px] font-dm-sans font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
