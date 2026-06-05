"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { IconX } from "@tabler/icons-react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Dialog({ open, onClose, title, children }: DialogProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div
          ref={ref}
          className={cn(
            "bg-surface-1 rounded-card w-full max-w-sm border border-surface-2 transition-all duration-200",
            open ? "scale-100" : "scale-95"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <div className="flex items-center justify-between px-5 pt-5 pb-1">
              <h2 className="text-[17px] font-syne font-medium text-text-primary">{title}</h2>
              <button onClick={onClose} className="p-1 hover:bg-surface-2 rounded-btn transition-colors text-text-tertiary -mr-1">
                <IconX size={18} />
              </button>
            </div>
          )}
          <div className="px-5 pb-5 pt-2">{children}</div>
        </div>
      </div>
    </>
  );
}
