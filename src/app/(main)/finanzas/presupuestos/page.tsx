"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/lib/utils";
import { IconArrowLeft, IconTrash, IconPlus } from "@tabler/icons-react";

type BudgetCat = { id: string; name: string; icon: string; budget: number };

const ICONS = ["🏠", "🍽️", "🛒", "🚗", "💡", "🎮", "🏋️", "👕", "📚", "🐾", "✈️", "💰"];

const PRESETS: { name: string; icon: string }[] = [
  { name: "Alquiler", icon: "🏠" },
  { name: "Expensas", icon: "🏢" },
  { name: "Luz", icon: "⚡" },
  { name: "Gas", icon: "🔥" },
  { name: "Agua", icon: "💧" },
  { name: "Internet", icon: "📶" },
  { name: "Teléfono", icon: "📱" },
  { name: "Seguros", icon: "🛡️" },
  { name: "ABL / Impuestos", icon: "📋" },
  { name: "Alarma / Seguridad", icon: "🏘️" },
];

export default function PresupuestosPage() {
  const router = useRouter();
  useEffect(() => { document.title = "Gastos fijos — HouSystem"; }, []);
  const [budgets, setBudgets] = useState<BudgetCat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("🍽️");
  const [newBudget, setNewBudget] = useState("");

  useEffect(() => {
    fetch("/api/budgets")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { router.push("/login"); return; }
        setBudgets(d.budgets);
      })
      .catch((e) => console.error("[PresupuestosPage]", e))
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

  const deleteCategory = async (i: number) => {
    const cat = budgets[i];
    if (cat.id.startsWith("new_")) {
      setBudgets((prev) => prev.filter((_, idx) => idx !== i));
      if (budgets.length === 1) setDirty(false);
      return;
    }
    setDeleting(cat.id);
    try {
      await fetch(`/api/budgets/${cat.id}`, { method: "DELETE" });
      setBudgets((prev) => prev.filter((_, idx) => idx !== i));
      if (budgets.length === 1) setDirty(false);
    } catch (e) { console.error("[PresupuestosPage/delete]", e); } finally { setDeleting(null); }
  };

  const addCategory = () => {
    if (!newName.trim()) return;
    setBudgets((prev) => [...prev, { id: `new_${Date.now()}`, name: newName.trim(), icon: newIcon, budget: Number(newBudget) || 0 }]);
    setShowNew(false);
    setNewName("");
    setNewIcon("🍽️");
    setNewBudget("");
    setDirty(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const r = await fetch("/api/budgets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories: budgets.map(({ name, icon, budget }) => ({ name, icon, budget })) }),
      });
      const d = await r.json();
      if (!d.error) {
        setBudgets(d.budgets);
        setDirty(false);
      }
    } catch (e) { console.error("[PresupuestosPage/save]", e); } finally { setSaving(false); }
  };

  const total = budgets.reduce((s, c) => s + c.budget, 0);

  if (loading) return <PresupuestosSkeleton />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 md:px-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/finanzas" className="p-2 -ml-2 hover:bg-surface-1 rounded-btn transition-colors">
          <IconArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <h1 className="font-syne text-[22px] font-medium text-text-primary">Gastos fijos</h1>
      </div>

        <p className="font-dm-sans text-[13px] text-text-tertiary mb-6">
          Gastos fijos del mes
        </p>

      {budgets.length > 0 ? (
        <div className="flex flex-col gap-3 mb-6">
          {budgets.map((cat, i) => (
            <div key={cat.id} className="flex items-center gap-2 py-3 px-4 rounded-btn bg-surface-1 border border-surface-2">
              <span className="text-lg shrink-0">{cat.icon}</span>
              <span className="font-dm-sans text-[15px] text-text-secondary flex-1 truncate">{cat.name}</span>
              <div className="flex items-center gap-1">
                <span className="font-dm-sans text-[12px] text-text-tertiary">$</span>
                <div className="flex flex-col items-end">
                  <input type="number" value={cat.budget} onChange={(e) => updateBudget(i, e.target.value)} className="w-20 text-right bg-transparent text-text-primary font-dm-sans text-[15px] outline-none" />
                  {errors[i] && <span className="text-coral text-[11px] font-dm-sans">{errors[i]}</span>}
                </div>
              </div>
              <button onClick={() => deleteCategory(i)} disabled={deleting === cat.id} className="p-1.5 hover:bg-surface-2 rounded-btn transition-colors text-text-tertiary hover:text-coral shrink-0">
                {deleting === cat.id ? <span className="block w-4 h-4 border-2 border-coral border-t-transparent rounded-full animate-spin" /> : <IconTrash size={16} />}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="font-dm-sans text-[13px] text-text-tertiary text-center py-8 mb-4">
          No hay gastos fijos configurados.
        </p>
      )}

      <button onClick={() => setShowNew(true)} className="w-full mb-6 py-3 px-4 rounded-btn border-2 border-dashed border-surface-3 text-text-tertiary hover:text-text-secondary hover:border-text-tertiary transition-colors flex items-center justify-center gap-2 font-dm-sans text-[13px]">
        <IconPlus size={16} /> Agregar gasto fijo
      </button>

      <Dialog open={showNew} onClose={() => setShowNew(false)} title="Nuevo gasto fijo">
        <div className="flex flex-col gap-3">
          <div>
            <label className="font-dm-sans text-[12px] text-text-tertiary block mb-2">Sugeridos</label>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <button key={p.name} onClick={() => { setNewName(p.name); setNewIcon(p.icon); }}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-pill text-[12px] font-dm-sans transition-colors ${newName === p.name ? "bg-green/20 text-green border border-green" : "bg-surface-2 text-text-secondary hover:bg-surface-3 border border-transparent"}`}>
                  {p.icon} {p.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="font-dm-sans text-[12px] text-text-tertiary block mb-1">Nombre</label>
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ej: Alquiler" className="w-full h-10 px-3 rounded-btn bg-surface-2 text-text-primary font-dm-sans text-[14px] outline-none placeholder:text-text-tertiary" />
          </div>
          <div>
            <label className="font-dm-sans text-[12px] text-text-tertiary block mb-1">Icono</label>
            <div className="flex gap-2 flex-wrap">
              {ICONS.map((ic) => (
                <button key={ic} onClick={() => setNewIcon(ic)} className={`w-9 h-9 flex items-center justify-center rounded-btn text-lg transition-colors ${newIcon === ic ? "bg-green text-black" : "bg-surface-2 hover:bg-surface-3"}`}>
                  {ic}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="font-dm-sans text-[12px] text-text-tertiary block mb-1">Monto</label>
            <input type="number" value={newBudget} onChange={(e) => setNewBudget(e.target.value)} placeholder="0" className="w-full h-10 px-3 rounded-btn bg-surface-2 text-text-primary font-dm-sans text-[14px] outline-none placeholder:text-text-tertiary" />
          </div>
          <Button className="w-full" disabled={!newName.trim()} onClick={addCategory}>
            Agregar
          </Button>
        </div>
      </Dialog>

      <div className="py-4 px-4 rounded-btn bg-surface-1 border border-surface-2 mb-6 flex justify-between items-center">
        <span className="font-dm-sans text-[15px] text-text-primary font-medium">Total gastos fijos</span>
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
