import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function MainNotFound() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
      <span className="text-[48px] mb-4">🔍</span>
      <h1 className="text-2xl font-syne font-bold mb-2">Sección no encontrada</h1>
      <p className="text-text-tertiary mb-8 max-w-md">
        Esta sección no existe o fue movida.
      </p>
      <Link href="/dashboard">
        <Button>Ir al dashboard</Button>
      </Link>
    </div>
  );
}
