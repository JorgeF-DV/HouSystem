"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EMAIL_REGEX } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  useEffect(() => { document.title = "Crear cuenta — HouSystem"; }, []);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirm?: string }>({});
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = "El nombre es obligatorio";
    if (!email.trim()) errs.email = "El email es obligatorio";
    else if (!EMAIL_REGEX.test(email)) errs.email = "Email inválido";
    if (!password) errs.password = "La contraseña es obligatoria";
    else if (password.length < 6) errs.password = "Mínimo 6 caracteres";
    if (confirm !== password) errs.confirm = "Las contraseñas no coinciden";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error || "Error al crear cuenta");
        return;
      }
      router.push("/link-partner");
    } catch (e) {
      console.error("[RegisterPage]", e);
      setServerError("Error de conexión");
    } finally {
      setLoading(false);
    }
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
        <Input label="Nombre" id="name" placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
        <Input label="Email" id="email" type="email" placeholder="correo@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
        <Input label="Contraseña" id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
        <Input
          label="Confirmar contraseña"
          id="confirm"
          type="password"
          placeholder="••••••••"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={errors.confirm}
        />

        {serverError && (
          <p className="text-[13px] text-coral font-dm-sans">{serverError}</p>
        )}

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
