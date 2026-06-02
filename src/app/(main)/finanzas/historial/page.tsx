"use client";

import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { formatCurrency } from "@/lib/utils";
import { IconArrowLeft, IconFilter } from "@tabler/icons-react";

const expenses = [
  { day: "Hoy", items: [
    { icon: "🛒", description: "Mercado semanal", who: "jorge" as const, amount: 45000 },
    { icon: "🚗", description: "Uber al trabajo", who: "lorena" as const, amount: 3500 },
  ]},
  { day: "Ayer", items: [
    { icon: "🍽️", description: "Cena en Mostaza", who: "jorge" as const, amount: 12000 },
    { icon: "💡", description: "Factura de luz", who: "lorena" as const, amount: 8500 },
  ]},
  { day: "26 may", items: [
    { icon: "🛒", description: "Desayuno", who: "jorge" as const, amount: 3200 },
  ]},
];

export default function HistorialPage() {
  const total = expenses.reduce((s, d) => s + d.items.reduce((si, i) => si + i.amount, 0), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 md:px-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/finanzas" className="p-2 -ml-2 hover:bg-surface-1 rounded-btn transition-colors">
          <IconArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <h1 className="font-syne text-[22px] font-medium text-text-primary">Historial</h1>
        <button className="ml-auto p-2 hover:bg-surface-1 rounded-btn transition-colors">
          <IconFilter size={18} className="text-text-secondary" />
        </button>
      </div>

      {/* Total banner */}
      <div className="py-3 px-4 rounded-btn bg-surface-1 border border-surface-2 mb-6 flex justify-between items-center">
        <span className="font-dm-sans text-[13px] text-text-tertiary">Total del período</span>
        <span className="font-syne text-[18px] font-medium text-text-primary">
          {formatCurrency(total)}
        </span>
      </div>

      {/* List */}
      {expenses.map((day) => (
        <div key={day.day} className="mb-6">
          <h3 className="font-dm-sans text-[13px] text-text-tertiary font-medium mb-2">{day.day}</h3>
          <div className="flex flex-col gap-2">
            {day.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-3 px-4 rounded-btn hover:bg-surface-1 transition-colors cursor-pointer"
              >
                <span className="text-lg w-8 h-8 flex items-center justify-center">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-dm-sans text-[15px] text-text-primary truncate">
                    {item.description}
                  </p>
                </div>
                <Avatar user={item.who} size={24} />
                <span className="font-dm-sans text-[15px] text-text-primary font-medium min-w-[70px] text-right">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
