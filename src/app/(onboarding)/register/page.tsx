"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/link-partner");
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-syne text-[28px] font-bold text-text-primary">Crear cuenta</h1>
        <p className="font-dm-sans text-[15px] text-text-tertiary mt-1">
          Completá los datos para empezar.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Nombre" id="name" placeholder="Tu nombre" />
        <Input label="Email" id="email" type="email" placeholder="correo@ejemplo.com" />
        <Input label="Contraseña" id="password" type="password" placeholder="••••••••" />
        <Input
          label="Confirmar contraseña"
          id="confirm"
          type="password"
          placeholder="••••••••"
        />

        <Button type="submit" loading={loading} className="w-full mt-2">
          Crear cuenta
        </Button>
      </form>

      <Link
        href="/welcome"
        className="text-center text-[13px] font-dm-sans text-text-tertiary hover:text-text-secondary transition-colors"
      >
        Volver
      </Link>
    </div>
  );
}
