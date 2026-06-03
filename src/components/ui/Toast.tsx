"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ToastProps {
  message: string;
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

export function Toast({ message, visible, onHide, duration = 2500 }: ToastProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      timerRef.current = setTimeout(() => {
        onHide();
      }, duration);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, duration, onHide]);

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-btn bg-surface-1 border border-surface-2 text-text-primary text-[13px] font-dm-sans transition-all duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      {message}
    </div>
  );
}
