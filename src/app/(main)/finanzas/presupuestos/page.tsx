"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { IconArrowLeft } from "@tabler/icons-react";

const defaultCategories = [
  { name: "Mercado", icon: "🛒", budget: 250000 },
  { name: "Servicios", icon: "💡", budget: 60000 },
  { name: "Salidas", icon: "🍽️", budget: 80000 },
  { name: "Transporte", icon: "🚗", budget: 30000 },
  { name: "Salud", icon: "💊", budget: 20000 },
  { name: "Otros", icon: "📦", budget: 25000 },
];

export default function PresupuestosPage() {
  const [budgets, setBudgets] = useState(defaultCategories);
  const [dirty, setDirty] = useState(false);

  const updateBudget = (index: number, value: string) => {
    const updated = [...budgets];
    updated[index] = { ...updated[index], budget: Number(value) || 0 };
    setBudgets(updated);
    setDirty(true);
  };

  const total = budgets.reduce((s, c) => s + c.budget, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 md:px-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/finanzas" className="p-2 -ml-2 hover:bg-surface-1 rounded-btn transition-colors">
          <IconArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <h1 className="font-syne text-[22px] font-medium text-text-primary">Presupuestos</h1>
      </div>

      <p className="font-dm-sans text-[13px] text-text-tertiary mb-6">
        {new Date().toLocaleString("es-AR", { month: "long", year: "numeric" })}
      </p>

      <div className="flex flex-col gap-3 mb-8">
        {budgets.map((cat, i) => (
          <div
            key={cat.name}
            className="flex items-center gap-4 py-3 px-4 rounded-btn bg-surface-1 border border-surface-2"
          >
            <span className="text-lg">{cat.icon}</span>
            <span className="font-dm-sans text-[15px] text-text-secondary flex-1">{cat.name}</span>
            <div className="flex items-center gap-1">
              <span className="font-dm-sans text-[12px] text-text-tertiary">$</span>
              <input
                type="number"
                value={cat.budget}
                onChange={(e) => updateBudget(i, e.target.value)}
                className="w-24 text-right bg-transparent text-text-primary font-dm-sans text-[15px] outline-none"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="py-4 px-4 rounded-btn bg-surface-1 border border-surface-2 mb-6 flex justify-between items-center">
        <span className="font-dm-sans text-[15px] text-text-primary font-medium">Total</span>
        <span className="font-syne text-[20px] font-medium text-text-primary">
          {formatCurrency(total)}
        </span>
      </div>

      <Button className="w-full" disabled={!dirty}>
        Guardar cambios
      </Button>
    </div>
  );
}
