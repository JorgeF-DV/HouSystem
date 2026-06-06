"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { IconUsers } from "@tabler/icons-react";

export default function AcceptInvitePage() {
  const router = useRouter();
  useEffect(() => { document.title = "Aceptar invitación — HouSystem"; }, []);
  const [invitation, setInvitation] = useState<{ sender: { name: string; email: string } } | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/partner/status")
      .then((r) => r.json())
      .then((d) => {
        if (d.invitation) setInvitation(d.invitation);
        else if (d.partner) router.push("/dashboard");
      })
      .catch((e) => console.error("[AcceptInvitePage]", e))
      .finally(() => setLoading(false));
  }, [router]);

  const accept = async () => {
    setAccepting(true);
    setError("");
    try {
      const r = await fetch("/api/partner/accept", { method: "POST" });
      const d = await r.json();
      if (d.error) { setError(d.error); return; }
      router.push("/dashboard");
    } catch { setError("Error de conexión"); }
    finally { setAccepting(false); }
  };

  if (loading) return (
    <div className="flex flex-col items-center text-center gap-6">
      <Skeleton className="w-20 h-20 rounded-full" />
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-5 w-64" />
      <Skeleton className="h-12 w-full" />
    </div>
  );

  return (
    <div className="flex flex-col items-center text-center gap-6">
      <div className="w-20 h-20 rounded-full bg-green/10 flex items-center justify-center">
        <IconUsers size={40} className="text-green" />
      </div>

      {invitation ? (
        <>
          <div>
            <h1 className="font-syne text-[28px] font-bold text-text-primary mb-2">
              Tenés una invitación
            </h1>
            <p className="font-dm-sans text-[15px] text-text-tertiary">
              <strong className="text-text-primary">{invitation.sender.name || invitation.sender.email}</strong>{" "}
              te invitó a usar HouSystem en pareja.
            </p>
          </div>
          {error && <p className="font-dm-sans text-[13px] text-coral">{error}</p>}
          <Button className="w-full" loading={accepting} onClick={accept}>
            Aceptar invitación
          </Button>
        </>
      ) : (
        <div>
          <h1 className="font-syne text-[28px] font-bold text-text-primary mb-2">
            Sin invitaciones
          </h1>
          <p className="font-dm-sans text-[15px] text-text-tertiary">
            No tenés invitaciones pendientes.
          </p>
        </div>
      )}
    </div>
  );
}
