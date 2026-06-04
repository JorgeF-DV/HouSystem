"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  useEffect(() => { document.title = "Entrar — HouSystem"; }, []);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const errs: typeof errors = {};
    if (!email.trim()) errs.email = "El email es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Email inválido";
    if (!password) errs.password = "La contraseña es obligatoria";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error || "Error al iniciar sesión");
        return;
      }
      router.push("/dashboard");
    } catch {
      setServerError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-syne text-[28px] font-bold text-text-primary">Entrar</h1>
        <p className="font-dm-sans text-[15px] text-text-tertiary mt-1">
          Iniciá sesión para continuar.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Email" id="email" type="email" placeholder="correo@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
        <Input label="Contraseña" id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />

        {serverError && (
          <p className="text-[13px] text-coral font-dm-sans">{serverError}</p>
        )}

        <Button type="submit" loading={loading} className="w-full mt-2">
          Entrar
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
