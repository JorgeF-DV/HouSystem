"use client";

import { getProgressColor } from "@/lib/utils";

interface ProgressBarProps {
  percent: number;
  className?: string;
}

export function ProgressBar({ percent, className }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  const color = getProgressColor(clamped);

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${Math.round(clamped)}%`}
      className={`h-2 rounded-pill bg-surface-2 overflow-hidden ${className ?? ""}`}
    >
      <div
        className="h-full rounded-pill transition-all duration-500 ease-out"
        style={{ width: `${clamped}%`, backgroundColor: color }}
      />
    </div>
  );
}
