import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function RootNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <span className="text-[48px] mb-4">🔍</span>
      <h1 className="text-2xl font-syne font-bold mb-2">Página no encontrada</h1>
      <p className="text-text-tertiary mb-8 max-w-md">
        La página que buscas no existe o fue movida.
      </p>
      <Link href="/">
        <Button>Volver al inicio</Button>
      </Link>
    </div>
  );
}
