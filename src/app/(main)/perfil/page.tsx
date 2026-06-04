"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { IconArrowLeft, IconLink } from "@tabler/icons-react";

type Profile = {
  id: string; name: string; email: string; role: string;
  partner: { id: string; createdAt: string; users: { id: string; name: string; role: string }[] } | null;
};

export default function PerfilPage() {
  const router = useRouter();
  useEffect(() => { document.title = "Perfil — HouSystem"; }, []);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUnlink, setShowUnlink] = useState(false);
  const [unlinking, setUnlinking] = useState(false);
  const [password, setPassword] = useState("");

  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { router.push("/login"); return; }
        setProfile(d);
        setNewName(d.name || "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const updateName = async () => {
    if (!newName.trim()) return;
    setSavingName(true);
    try {
      const r = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      const d = await r.json();
      if (!d.error) { setEditingName(false); setProfile({ ...profile!, name: newName.trim() }); }
    } catch {} finally { setSavingName(false); }
  };

  const handleUnlink = async () => {
    if (!password) return;
    setUnlinking(true);
    try {
      const r = await fetch("/api/partner/unlink", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const d = await r.json();
      if (!d.error) router.push("/link-partner");
    } catch {} finally { setUnlinking(false); }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  if (loading) return <PerfilSkeleton />;
  if (!profile) return null;

  const partner = profile.partner;
  const otherUser = partner?.users.find((u) => u.id !== profile.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 md:px-6">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard" className="p-2 -ml-2 hover:bg-surface-1 rounded-btn transition-colors">
          <IconArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <h1 className="font-syne text-[22px] font-medium text-text-primary">Perfil</h1>
      </div>

      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="text-center">
          <Avatar user={profile.role} size={64} />
          <p className="font-dm-sans text-[13px] text-text-primary mt-2 font-medium capitalize">{profile.name || profile.role}</p>
        </div>
        {partner && otherUser && (
          <>
            <div className="w-10 h-px bg-surface-2 mt-3" />
            <div className="w-8 h-8 rounded-full bg-green/10 flex items-center justify-center">
              <IconLink size={16} className="text-green" />
            </div>
            <div className="w-10 h-px bg-surface-2 mt-3" />
            <div className="text-center">
              <Avatar user={otherUser.role} size={64} />
              <p className="font-dm-sans text-[13px] text-text-primary mt-2 font-medium capitalize">{otherUser.name || otherUser.role}</p>
            </div>
          </>
        )}
      </div>

      {partner && (
        <div className="flex flex-col gap-4 mb-8">
          <div className="py-3 px-4 rounded-btn bg-surface-1 border border-surface-2">
            <p className="font-dm-sans text-[12px] text-text-tertiary">Vinculados desde</p>
            <p className="font-dm-sans text-[15px] text-text-primary">
              {new Date(partner.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 mb-8">
        {editingName ? (
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Input label="Nombre" value={newName} onChange={(e) => setNewName(e.target.value)} />
            </div>
            <Button loading={savingName} onClick={updateName} className="h-[42px]">Guardar</Button>
            <Button variant="secondary" className="h-[42px]" onClick={() => setEditingName(false)}>Cancelar</Button>
          </div>
        ) : (
          <div className="flex items-center justify-between py-3 px-4 rounded-btn bg-surface-1 border border-surface-2">
            <div>
              <p className="font-dm-sans text-[12px] text-text-tertiary">Nombre</p>
              <p className="font-dm-sans text-[15px] text-text-primary">{profile.name || profile.role}</p>
            </div>
            <Button variant="ghost" className="text-[12px] h-8 px-3" onClick={() => setEditingName(true)}>Editar</Button>
          </div>
        )}
        <div className="py-3 px-4 rounded-btn bg-surface-1 border border-surface-2">
          <p className="font-dm-sans text-[12px] text-text-tertiary">Email</p>
          <p className="font-dm-sans text-[15px] text-text-primary">{profile.email}</p>
        </div>
      </div>

      {partner && (
        showUnlink ? (
          <div className="flex flex-col gap-3 mb-4">
            <p className="font-dm-sans text-[13px] text-text-tertiary text-center">Esta acción desvinculará ambas cuentas.</p>
            <Input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setShowUnlink(false)}>Cancelar</Button>
              <Button className="flex-1 bg-coral text-white hover:bg-coral/80" loading={unlinking} onClick={handleUnlink}>Desvincular</Button>
            </div>
          </div>
        ) : (
          <Button variant="secondary" className="w-full text-coral border-coral/30 mb-4" onClick={() => setShowUnlink(true)}>
            Desvincular pareja
          </Button>
        )
      )}

      <Button variant="ghost" className="w-full text-text-tertiary" onClick={handleLogout}>Cerrar sesión</Button>
    </div>
  );
}

function PerfilSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Skeleton className="h-8 w-24 mb-8" />
      <div className="flex justify-center gap-4 mb-8">
        <Skeleton className="w-16 h-16 rounded-full" />
        <Skeleton className="w-16 h-16 rounded-full" />
      </div>
      <Skeleton className="h-14 w-full mb-3 rounded-btn" />
    </div>
  );
}
