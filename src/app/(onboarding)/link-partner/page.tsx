"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { IconUsers } from "@tabler/icons-react";

export default function LinkPartnerPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invitationReceived] = useState(false);

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1000);
  };

  const handleAccept = () => {
    router.push("/dashboard");
  };

  if (invitationReceived) {
    return (
      <div className="flex flex-col items-center text-center gap-6">
        <div className="w-20 h-20 rounded-full bg-green/10 flex items-center justify-center">
          <IconUsers size={40} className="text-green" />
        </div>
        <div>
          <h1 className="font-syne text-[28px] font-bold text-text-primary mb-2">
            ¡Invitación recibida!
          </h1>
          <p className="font-dm-sans text-[15px] text-text-tertiary">
            Lorena quiere vincularse con vos.
          </p>
        </div>
        <Button onClick={handleAccept} className="w-full mt-4">
          Aceptar
        </Button>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center text-center gap-6">
        <div className="w-20 h-20 rounded-full bg-amber/10 flex items-center justify-center">
          <IconUsers size={40} className="text-amber" />
        </div>
        <div>
          <h1 className="font-syne text-[28px] font-bold text-text-primary mb-2">
            Invitación enviada
          </h1>
          <p className="font-dm-sans text-[15px] text-text-tertiary">
            Esperando que {email} acepte la invitación.
          </p>
        </div>
        <Button variant="secondary" onClick={() => setSent(false)} className="w-full">
          Reenviar
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-20 h-20 rounded-full bg-green/10 flex items-center justify-center">
          <IconUsers size={40} className="text-green" />
        </div>
        <div>
          <h1 className="font-syne text-[28px] font-bold text-text-primary mb-2">
            Vincular pareja
          </h1>
          <p className="font-dm-sans text-[15px] text-text-tertiary">
            Para que HouSystem funcione, ambos deben tener cuenta y estar vinculados.
          </p>
        </div>
      </div>

      <form onSubmit={handleSendInvite} className="flex flex-col gap-4">
        <Input
          label="Email de tu pareja"
          id="partner-email"
          type="email"
          placeholder="correo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" loading={loading} className="w-full mt-2">
          Enviar invitación
        </Button>
      </form>
    </div>
  );
}
