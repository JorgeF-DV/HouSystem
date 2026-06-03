"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && ref.current) {
        const focusable = ref.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      previousFocus.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
      setTimeout(() => ref.current?.querySelector<HTMLElement>("button, input, [tabindex]:not([tabindex='-1'])")?.focus(), 50);
    } else {
      document.body.style.overflow = "";
      previousFocus.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, handleKeyDown]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title ?? "Panel inferior"}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 bg-surface-1 rounded-t-[12px] border-t border-surface-2 transition-transform duration-300 ease-out safe-bottom pb-4",
          open ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="flex justify-center pt-2 pb-1">
          <button
            onClick={onClose}
            className="w-8 h-1 rounded-pill bg-surface-2 hover:bg-surface-3 transition-colors cursor-pointer"
            aria-label="Cerrar"
          />
        </div>
        {title && (
          <h2 className="px-6 py-2 text-[18px] font-syne font-medium text-text-primary">
            {title}
          </h2>
        )}
        <div className="px-6">{children}</div>
      </div>
    </>
  );
}
