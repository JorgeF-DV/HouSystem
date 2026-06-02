"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { IconArrowLeft, IconLink } from "@tabler/icons-react";

export default function PerfilPage() {
  const router = useRouter();
  const [showUnlink, setShowUnlink] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 md:px-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard" className="p-2 -ml-2 hover:bg-surface-1 rounded-btn transition-colors">
          <IconArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <h1 className="font-syne text-[22px] font-medium text-text-primary">Perfil</h1>
      </div>

      {/* Avatares */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="text-center">
          <Avatar user="jorge" size={64} />
          <p className="font-dm-sans text-[13px] text-text-primary mt-2 font-medium">Jorge</p>
        </div>
        <div className="w-10 h-px bg-surface-2 mt-3" />
        <div className="w-8 h-8 rounded-full bg-green/10 flex items-center justify-center">
          <IconLink size={16} className="text-green" />
        </div>
        <div className="w-10 h-px bg-surface-2 mt-3" />
        <div className="text-center">
          <Avatar user="lorena" size={64} />
          <p className="font-dm-sans text-[13px] text-text-primary mt-2 font-medium">Lorena</p>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="py-3 px-4 rounded-btn bg-surface-1 border border-surface-2">
          <p className="font-dm-sans text-[12px] text-text-tertiary">Vinculados desde</p>
          <p className="font-dm-sans text-[15px] text-text-primary">15 de marzo, 2025</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 mb-8">
        <Button variant="secondary" className="w-full justify-between">
          Cambiar contraseña <IconArrowLeft size={14} className="rotate-180" />
        </Button>
        <Button variant="secondary" className="w-full justify-between">
          Cambiar email <IconArrowLeft size={14} className="rotate-180" />
        </Button>
      </div>

      {/* Destructive */}
      {showUnlink ? (
        <div className="flex flex-col gap-3">
          <p className="font-dm-sans text-[13px] text-text-tertiary text-center">
            Esta acción desvinculará ambas cuentas. Ingresá tu contraseña para confirmar.
          </p>
          <Input type="password" placeholder="Contraseña" />
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setShowUnlink(false)}>
              Cancelar
            </Button>
            <Button className="flex-1 bg-coral text-white hover:bg-coral/80">
              Desvincular
            </Button>
          </div>
        </div>
      ) : (
        <>
          <Button
            variant="secondary"
            className="w-full text-coral border-coral/30 mb-3"
            onClick={() => setShowUnlink(true)}
          >
            Desvincular pareja
          </Button>
          <Button
            variant="ghost"
            className="w-full text-text-tertiary"
            onClick={() => router.push("/welcome")}
          >
            Cerrar sesión
          </Button>
        </>
      )}
    </div>
  );
}
