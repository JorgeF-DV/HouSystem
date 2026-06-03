"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-green text-black font-dm-sans font-medium text-[14px] h-11 px-5 rounded-btn hover:opacity-90 disabled:opacity-40 transition-opacity",
  secondary:
    "bg-transparent border border-surface-2 text-white font-dm-sans font-medium text-[14px] h-11 px-5 rounded-btn hover:bg-surface-1 disabled:opacity-40 transition-colors",
  ghost:
    "bg-transparent text-green font-dm-sans font-medium text-[14px] h-11 px-3 rounded-btn hover:bg-surface-1 transition-colors",
};

export function Button({
  variant = "primary",
  loading,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(variants[variant], "inline-flex items-center justify-center gap-2", className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
