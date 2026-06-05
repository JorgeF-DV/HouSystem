"use client";

import { use, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/lib/utils";
import { IconArrowLeft, IconTarget, IconExternalLink, IconEdit, IconTrash } from "@tabler/icons-react";

type Contribution = { id: string; amount: number; date: string; contributedBy: { id: string; name: string; role: string } };
type GoalData = { id: string; name: string; price: number; platform: string; link: string | null; saved: number; contributions: Contribution[] };

export default function MetaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  useEffect(() => { document.title = "Meta — HouSystem"; }, []);

  const [goal, setGoal] = useState<GoalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editPlatform, setEditPlatform] = useState("");
  const [editLink, setEditLink] = useState("");

  const refetch = useCallback(async () => {
    try {
      const r = await fetch(`/api/goals/${id}`);
      const d = await r.json();
      if (d.error) { router.push("/metas"); return; }
      setGoal(d);
      setEditName(d.name);
      setEditPrice(String(d.price));
      setEditPlatform(d.platform);
      setEditLink(d.link ?? "");
    } catch {} finally { setLoading(false); }
  }, [id, router]);

  useEffect(() => { refetch(); }, [refetch]);

  const addContribution = async () => {
    if (!amount || Number(amount) <= 0) { setError("El monto debe ser mayor a 0"); return; }
    setError("");
    setSaving(true);
    try {
      const r = await fetch(`/api/goals/${id}/contributions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount) }),
      });
      const d = await r.json();
      if (d.contribution) { setAmount(""); refetch(); }
    } catch {} finally { setSaving(false); }
  };

  const updateGoal = async () => {
    setSaving(true);
    try {
      const r = await fetch(`/api/goals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim(), price: Number(editPrice), platform: editPlatform, link: editLink || null }),
      });
      const d = await r.json();
      if (!d.error) { setEditOpen(false); refetch(); }
    } catch {} finally { setSaving(false); }
  };

  const deleteGoal = async () => {
    setSaving(true);
    try {
      const r = await fetch(`/api/goals/${id}`, { method: "DELETE" });
      const d = await r.json();
      if (d.error) { setError(d.error); setDeleteConfirm(false); }
      else router.push("/metas");
    } catch { setError("Error al eliminar la meta"); setDeleteConfirm(false); }
    finally { setSaving(false); }
  };

  if (loading) return <MetaDetailSkeleton />;
  if (!goal) return null;

  const percent = goal.price > 0 ? Math.round((goal.saved / goal.price) * 100) : 0;
  const remaining = goal.price - goal.saved;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 md:px-6 pb-24 md:pb-10">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/metas" className="p-2 -ml-2 hover:bg-surface-1 rounded-btn transition-colors">
          <IconArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <h1 className="font-syne text-[22px] font-medium text-text-primary">{goal.name}</h1>
        <button onClick={() => setEditOpen(true)} className="ml-auto p-2 hover:bg-surface-1 rounded-btn transition-colors">
          <IconEdit size={18} className="text-text-secondary" />
        </button>
        <button onClick={() => setDeleteConfirm(true)} className="p-2 hover:bg-surface-1 rounded-btn transition-colors">
          <IconTrash size={18} className="text-coral" />
        </button>
      </div>

      <div className="w-full h-48 rounded-card bg-surface-2 flex items-center justify-center mb-6">
        <IconTarget size={48} className="text-text-tertiary" />
      </div>

      <Card className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <span className="font-dm-sans text-[13px] text-text-tertiary">{goal.platform}</span>
          {goal.link && (
            <a href={goal.link} target="_blank" rel="noopener noreferrer" className="text-green text-[13px] font-dm-sans flex items-center gap-1">
              Ver producto <IconExternalLink size={14} />
            </a>
          )}
        </div>
        <p className="font-syne text-[28px] font-medium text-text-primary mb-4">{formatCurrency(goal.price)}</p>

        <ProgressBar percent={percent} />
        <div className="flex justify-between mt-2 mb-6">
          <span className="font-dm-sans text-[13px] text-text-secondary">{formatCurrency(goal.saved)}</span>
          <span className="font-dm-sans text-[13px] text-text-tertiary">{percent}%</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="py-3 px-3 rounded-btn bg-surface-2 text-center">
            <p className="font-dm-sans text-[12px] text-text-tertiary">Ahorrado</p>
            <p className="font-syne text-[18px] font-medium text-text-primary">{formatCurrency(goal.saved)}</p>
          </div>
          <div className="py-3 px-3 rounded-btn bg-surface-2 text-center">
            <p className="font-dm-sans text-[12px] text-text-tertiary">Faltante</p>
            <p className="font-syne text-[18px] font-medium text-text-primary">{formatCurrency(remaining)}</p>
          </div>
          <div className="py-3 px-3 rounded-btn bg-surface-2 text-center">
            <p className="font-dm-sans text-[12px] text-text-tertiary">Estimado</p>
            <p className="font-syne text-[18px] font-medium text-text-primary">~{Math.ceil(remaining / 80000)}m</p>
          </div>
        </div>
      </Card>

      <Card className="mb-6">
        <h2 className="font-syne text-[18px] font-medium text-text-primary mb-4">Abonar al ahorro</h2>
        <div className="flex flex-col gap-4">
          <Input label="Monto" type="number" placeholder="$0" value={amount} onChange={(e) => { setAmount(e.target.value); setError(""); }} error={error} />
          <Button className="w-full" loading={saving} onClick={addContribution}>Guardar abono</Button>
        </div>
      </Card>

      {goal.contributions.length > 0 && (
        <Card>
          <h2 className="font-syne text-[18px] font-medium text-text-primary mb-4">Historial de abonos</h2>
          <div className="flex flex-col gap-3">
            {goal.contributions.map((c) => (
              <div key={c.id} className="flex items-center gap-3">
                <Avatar user={c.contributedBy.role} size={24} />
                <span className="font-dm-sans text-[13px] text-text-secondary flex-1">
                  {new Date(c.date).toLocaleDateString("es-AR", { day: "numeric", month: "short" })}
                </span>
                <span className="font-dm-sans text-[15px] text-text-primary font-medium">{formatCurrency(c.amount)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <BottomSheet open={editOpen} onClose={() => setEditOpen(false)} title="Editar meta">
        <div className="flex flex-col gap-4 py-4">
          <Input label="Nombre" value={editName} onChange={(e) => setEditName(e.target.value)} />
          <Input label="Precio objetivo" type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
          <Input label="Plataforma" value={editPlatform} onChange={(e) => setEditPlatform(e.target.value)} />
          <Input label="Link (opcional)" value={editLink} onChange={(e) => setEditLink(e.target.value)} />
          <Button className="w-full mt-2" loading={saving} onClick={updateGoal}>Guardar cambios</Button>
        </div>
      </BottomSheet>

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(false)}>
          <div className="bg-surface-1 rounded-card p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <p className="font-dm-sans text-[15px] text-text-primary mb-4 text-center">¿Eliminar esta meta?</p>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setDeleteConfirm(false)}>Cancelar</Button>
              <Button className="flex-1 bg-coral text-white hover:bg-coral/80" loading={saving} onClick={deleteGoal}>Eliminar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MetaDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Skeleton className="h-8 w-48 mb-6" />
      <Skeleton className="h-48 w-full mb-6 rounded-card" />
      <Skeleton className="h-40 w-full mb-6 rounded-card" />
      <Skeleton className="h-24 w-full rounded-card" />
    </div>
  );
}
