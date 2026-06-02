"use client";

import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-text-secondary text-[13px] font-dm-sans font-medium">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "h-11 px-4 rounded-btn bg-surface-1 border text-white text-[15px] font-dm-sans placeholder:text-text-tertiary outline-none transition-colors",
            error ? "border-coral" : "border-surface-2 focus:border-green",
            className
          )}
          {...props}
        />
        {error && <span className="text-coral text-[12px] font-dm-sans">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
