"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      <div
        ref={ref}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 bg-surface-1 rounded-t-[12px] border-t border-surface-2 transition-transform duration-300 ease-out safe-bottom pb-4",
          open ? "translate-y-0" : "translate-y-full"
        )}
      >
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-8 h-1 rounded-pill bg-surface-2" />
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
