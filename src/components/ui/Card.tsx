"use client";

import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

interface CardProps extends ComponentProps<"div"> {
  hover?: boolean;
  loading?: boolean;
}

export function Card({ className, hover, loading, children, ...props }: CardProps) {
  if (loading) {
    return (
      <div className={cn("rounded-card bg-surface-1 border border-surface-2 p-5", className)}>
        <div className="shimmer h-4 w-3/4 rounded mb-3" />
        <div className="shimmer h-3 w-1/2 rounded mb-2" />
        <div className="shimmer h-8 w-full rounded" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-card bg-surface-1 border border-surface-2 p-5",
        hover && "transition-colors hover:bg-surface-3 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
