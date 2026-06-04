"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/lib/utils";
import { IconArrowLeft } from "@tabler/icons-react";

type BudgetCat = { name: string; icon: string; budget: number };

export default function PresupuestosPage() {
  const router = useRouter();
  useEffect(() => { document.title = "Presupuestos — HouSystem"; }, []);
  const [budgets, setBudgets] = useState<BudgetCat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [errors, setErrors] = useState<Record<number, string>>({});

  useEffect(() => {
    fetch("/api/budgets")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { router.push("/login"); return; }
        setBudgets(d.budgets);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const updateBudget = (index: number, value: string) => {
    const num = Number(value);
    if (num < 0) { setErrors((prev) => ({ ...prev, [index]: "No puede ser negativo" })); return; }
    setErrors((prev) => { const c = { ...prev }; delete c[index]; return c; });
    const updated = [...budgets];
    updated[index] = { ...updated[index], budget: num || 0 };
    setBudgets(updated);
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const r = await fetch("/api/budgets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories: budgets }),
      });
      const d = await r.json();
      if (!d.error) setDirty(false);
    } catch {} finally { setSaving(false); }
  };

  const total = budgets.reduce((s, c) => s + c.budget, 0);

  if (loading) return <PresupuestosSkeleton />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 md:px-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/finanzas" className="p-2 -ml-2 hover:bg-surface-1 rounded-btn transition-colors">
          <IconArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <h1 className="font-syne text-[22px] font-medium text-text-primary">Presupuestos</h1>
      </div>

      <p className="font-dm-sans text-[13px] text-text-tertiary mb-6 capitalize">
        {new Date().toLocaleString("es-AR", { month: "long", year: "numeric" })}
      </p>

      {budgets.length > 0 ? (
        <div className="flex flex-col gap-3 mb-8">
          {budgets.map((cat, i) => (
            <div key={cat.name} className="flex items-center gap-4 py-3 px-4 rounded-btn bg-surface-1 border border-surface-2">
              <span className="text-lg">{cat.icon}</span>
              <span className="font-dm-sans text-[15px] text-text-secondary flex-1">{cat.name}</span>
              <div className="flex items-center gap-1">
                <span className="font-dm-sans text-[12px] text-text-tertiary">$</span>
                <div className="flex flex-col items-end">
                  <input type="number" value={cat.budget} onChange={(e) => updateBudget(i, e.target.value)} className="w-24 text-right bg-transparent text-text-primary font-dm-sans text-[15px] outline-none" />
                  {errors[i] && <span className="text-coral text-[11px] font-dm-sans">{errors[i]}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="font-dm-sans text-[13px] text-text-tertiary text-center py-8 mb-4">
          No hay presupuestos configurados.
        </p>
      )}

      <div className="py-4 px-4 rounded-btn bg-surface-1 border border-surface-2 mb-6 flex justify-between items-center">
        <span className="font-dm-sans text-[15px] text-text-primary font-medium">Total</span>
        <span className="font-syne text-[20px] font-medium text-text-primary">{formatCurrency(total)}</span>
      </div>

      <Button className="w-full" disabled={!dirty} loading={saving} onClick={save}>
        Guardar cambios
      </Button>
    </div>
  );
}

function PresupuestosSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Skeleton className="h-8 w-32 mb-6" />
      <Skeleton className="h-4 w-40 mb-6" />
      {[1,2,3,4,5,6].map((i) => (
        <Skeleton key={i} className="h-14 w-full mb-3 rounded-btn" />
      ))}
      <Skeleton className="h-14 w-full mb-6 rounded-btn" />
    </div>
  );
}
