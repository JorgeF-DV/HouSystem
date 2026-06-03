"use client";

import { cn } from "@/lib/utils";

type AlertVariant = "info" | "warning" | "error";

interface AlertBannerProps {
  variant?: AlertVariant;
  children: React.ReactNode;
  className?: string;
  onAction?: () => void;
  actionLabel?: string;
}

const variants: Record<AlertVariant, string> = {
  info: "bg-[#1A2E1A] border-l-green",
  warning: "bg-[#2E2A1A] border-l-amber",
  error: "bg-[#2E1A1A] border-l-coral",
};

export function AlertBanner({
  variant = "info",
  children,
  className,
  onAction,
  actionLabel,
}: AlertBannerProps) {
  return (
    <div
      role="alert"
      className={cn(
        "border-l-3 py-3 px-4 rounded-btn text-[13px] font-dm-sans flex items-center gap-3",
        variants[variant],
        className
      )}
    >
      <span className="flex-1 text-text-secondary">{children}</span>
      {onAction && actionLabel && (
        <button
          onClick={onAction}
          className="text-green font-medium whitespace-nowrap hover:opacity-80 transition-opacity"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
