"use client";

import { cn } from "@/lib/utils";

interface PillSelectorProps {
  options: { value: string; label?: string }[];
  selected: string | string[];
  onChange: (value: string) => void;
  multi?: boolean;
  className?: string;
}

export function PillSelector({ options, selected, onChange, multi, className }: PillSelectorProps) {
  const isSelected = (value: string) => multi
    ? (selected as string[]).includes(value)
    : selected === value;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          aria-pressed={isSelected(opt.value)}
          className={cn(
            "px-4 py-2 rounded-pill text-[13px] font-dm-sans transition-colors",
            isSelected(opt.value)
              ? "bg-green text-black font-medium"
              : "bg-surface-2 text-text-secondary hover:bg-surface-3"
          )}
        >
          {opt.label ?? opt.value}
        </button>
      ))}
    </div>
  );
}
