"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/lib/utils";
import { IconArrowLeft, IconTrash, IconPlus } from "@tabler/icons-react";

type IncomeItem = {
  id: string; amount: number; description: string; registeredBy: { id: string; name: string; role: string }; date: string;
};

export default function IngresosPage() {
  const router = useRouter();
  useEffect(() => { document.title = "Ingresos — HouSystem"; }, []);
  const [incomes, setIncomes] = useState<IncomeItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [saving, setSaving] = useState(false);

  const refetch = useCallback(async () => {
    try {
      const r = await fetch("/api/incomes");
      const d = await r.json();
      if (d.error) { router.push("/login"); return; }
      setIncomes(d.incomes ?? []);
      setTotal(d.total ?? 0);
    } catch (e) { console.error("[IngresosPage]", e); } finally { setLoading(false); }
  }, [router]);

  useEffect(() => { refetch(); }, [refetch]);

  const addIncome = async () => {
    if (!amount || Number(amount) <= 0) return;
    setSaving(true);
    try {
      const r = await fetch("/api/incomes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount), description: desc }),
      });
      const d = await r.json();
      if (d.income) {
        setShowNew(false);
        setAmount("");
        setDesc("");
        refetch();
      }
    } catch (e) { console.error("[IngresosPage/add]", e); } finally { setSaving(false); }
  };

  const deleteIncome = async (id: string) => {
    setDeleting(id);
    try {
      await fetch(`/api/incomes/${id}`, { method: "DELETE" });
      refetch();
    } catch (e) { console.error("[IngresosPage/delete]", e); } finally { setDeleting(null); }
  };

  if (loading) return <IngresosSkeleton />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 md:px-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/finanzas" className="p-2 -ml-2 hover:bg-surface-1 rounded-btn transition-colors">
          <IconArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <h1 className="font-syne text-[22px] font-medium text-text-primary">Ingresos</h1>
      </div>

      <div className="py-3 px-4 rounded-btn bg-green/10 border border-green/20 mb-6 flex justify-between items-center">
        <span className="font-dm-sans text-[13px] text-text-tertiary">Ingreso total</span>
        <span className="font-syne text-[18px] font-medium text-green">{formatCurrency(total)}</span>
      </div>

      {incomes.length > 0 ? (
        <div className="flex flex-col gap-2 mb-6">
          {incomes.map((item) => (
            <div key={item.id} className="flex items-center gap-3 py-3 px-4 rounded-btn bg-surface-1 border border-surface-2 group">
              <div className="w-8 h-8 flex items-center justify-center text-lg rounded-full bg-green/10">💰</div>
              <div className="flex-1 min-w-0">
                <p className="font-dm-sans text-[15px] text-text-primary">{item.description || "Ingreso"}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Avatar user={item.registeredBy.role} size={16} />
                  <span className="font-dm-sans text-[11px] text-text-tertiary">{item.registeredBy.name}</span>
                </div>
              </div>
              <span className="font-dm-sans text-[15px] text-green font-medium">{formatCurrency(item.amount)}</span>
              <button onClick={() => deleteIncome(item.id)} disabled={deleting === item.id}
                className="p-1.5 rounded-btn hover:bg-coral/10 text-text-tertiary hover:text-coral opacity-0 group-hover:opacity-100 transition-all">
                {deleting === item.id ? <span className="block w-3.5 h-3.5 border-2 border-coral border-t-transparent rounded-full animate-spin" /> : <IconTrash size={14} />}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="font-dm-sans text-[13px] text-text-tertiary text-center py-8 mb-4">No hay ingresos registrados.</p>
      )}

      <Button className="w-full" variant="secondary" onClick={() => setShowNew(true)}>
        <IconPlus size={16} /> Agregar ingreso
      </Button>

      <Dialog open={showNew} onClose={() => setShowNew(false)} title="Nuevo ingreso">
        <div className="flex flex-col gap-3">
          <Input label="Monto" type="number" placeholder="$0" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <Input label="Descripción" placeholder="Ej: Sueldo, freelance..." value={desc} onChange={(e) => setDesc(e.target.value)} />
          <Button className="w-full mt-1" loading={saving} disabled={!amount || Number(amount) <= 0} onClick={addIncome}>
            Agregar
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

function IngresosSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Skeleton className="h-8 w-32 mb-6" />
      <Skeleton className="h-12 w-full mb-6 rounded-btn" />
      {[1,2,3].map((i) => <Skeleton key={i} className="h-16 w-full mb-2 rounded-btn" />)}
    </div>
  );
}
