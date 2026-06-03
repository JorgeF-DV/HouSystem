"use client";

import { Button } from "@/components/ui/Button";

export default function RootError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <span className="text-[48px] mb-4">⚠️</span>
      <h1 className="text-2xl font-syne font-bold mb-2">Algo salió mal</h1>
      <p className="text-text-tertiary mb-8 max-w-md">
        Ocurrió un error inesperado. Ya lo estamos registrando.
      </p>
      <Button onClick={reset}>Intentar de nuevo</Button>
    </div>
  );
}
