"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatusPill } from "@/components/ui/StatusPill";
import { formatCurrency } from "@/lib/utils";
import { IconPlus, IconTarget } from "@tabler/icons-react";

const goals = [
  {
    name: "Sillón nuevo",
    platform: "MercadoLibre",
    saved: 180000,
    price: 450000,
    image: null,
  },
  {
    name: "Viaje a la costa",
    platform: "Booking",
    saved: 95000,
    price: 350000,
    image: null,
  },
];

export default function MetasPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 md:px-6 pb-24 md:pb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-syne text-[28px] font-medium text-text-primary">Metas</h1>
        <Link
          href="/metas/agregar"
          className="p-2 hover:bg-surface-1 rounded-btn transition-colors"
        >
          <IconPlus size={20} className="text-text-secondary" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const percent = Math.round((goal.saved / goal.price) * 100);
          const monthsLeft = Math.ceil((goal.price - goal.saved) / 80000);

          return (
            <Link key={goal.name} href={`/metas/${goal.name.toLowerCase().replace(/\s+/g, "-")}`}>
              <Card hover>
                <div className="w-full h-36 rounded-card bg-surface-2 flex items-center justify-center mb-4">
                  <IconTarget size={36} className="text-text-tertiary" />
                </div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-dm-sans text-[15px] text-text-primary font-medium">
                      {goal.name}
                    </h3>
                    <p className="font-dm-sans text-[12px] text-text-tertiary">{goal.platform}</p>
                  </div>
                  <StatusPill variant="neutro">
                    {percent}%
                  </StatusPill>
                </div>
                <ProgressBar percent={percent} />
                <div className="flex justify-between mt-2">
                  <span className="font-dm-sans text-[13px] text-text-secondary">
                    {formatCurrency(goal.saved)}
                  </span>
                  <span className="font-dm-sans text-[13px] text-text-tertiary">
                    {formatCurrency(goal.price)}
                  </span>
                </div>
                <p className="font-dm-sans text-[11px] text-text-tertiary mt-1">
                  ~{monthsLeft} meses estimados
                </p>
              </Card>
            </Link>
          );
        })}

        {/* Add placeholder */}
        <Link href="/metas/agregar">
          <div className="rounded-card border-2 border-dashed border-surface-2 p-5 flex flex-col items-center justify-center min-h-[280px] hover:bg-surface-1 transition-colors cursor-pointer">
            <IconPlus size={32} className="text-text-tertiary mb-2" />
            <p className="font-dm-sans text-[15px] text-text-tertiary">Agregar meta</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
