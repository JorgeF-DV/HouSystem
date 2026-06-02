"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { Avatar } from "@/components/ui/Avatar";
import { StatusPill } from "@/components/ui/StatusPill";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  IconWallet,
  IconCheckbox,
  IconCalendarEvent,
  IconArrowRight,
} from "@tabler/icons-react";

const today = new Date();

const categories = [
  { name: "Mercado", spent: 180000, budget: 250000 },
  { name: "Servicios", spent: 45000, budget: 60000 },
  { name: "Salidas", spent: 72000, budget: 80000 },
];

export default function DashboardPage() {
  const totalSpent = categories.reduce((s, c) => s + c.spent, 0);
  const totalBudget = categories.reduce((s, c) => s + c.budget, 0);
  const percentUsed = Math.round((totalSpent / totalBudget) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 md:px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-syne text-[28px] font-medium text-text-primary">
          Buen día, Jorge
        </h1>
        <p className="font-dm-sans text-[15px] text-text-tertiary">
          {formatDate(today)}
        </p>
      </div>

      {/* Alert */}
      {percentUsed >= 80 && (
        <AlertBanner variant="warning" className="mb-6" actionLabel="Ver finanzas" onAction={() => {}}>
          El presupuesto de Salidas está al 90%
        </AlertBanner>
      )}

      {/* Salud Financiera */}
      <Card className="mb-4 md:col-span-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-syne text-[18px] font-medium text-text-primary">Salud Financiera</h2>
          <Link
            href="/finanzas"
            className="text-green text-[13px] font-dm-sans font-medium flex items-center gap-1"
          >
            Ver más <IconArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div>
            <p className="font-dm-sans text-[12px] text-text-tertiary mb-1">Gastado</p>
            <p className="font-syne text-[20px] font-medium text-text-primary">
              {formatCurrency(totalSpent)}
            </p>
          </div>
          <div>
            <p className="font-dm-sans text-[12px] text-text-tertiary mb-1">Ejecución</p>
            <p className="font-syne text-[20px] font-medium text-text-primary">{percentUsed}%</p>
          </div>
          <div>
            <p className="font-dm-sans text-[12px] text-text-tertiary mb-1">Restan</p>
            <p className="font-syne text-[20px] font-medium text-text-primary">
              {28 - today.getDate()} días
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {categories.map((cat) => (
            <div key={cat.name}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-dm-sans text-[13px] text-text-secondary">{cat.name}</span>
                <span className="font-dm-sans text-[13px] text-text-tertiary">
                  {formatCurrency(cat.spent)} / {formatCurrency(cat.budget)}
                </span>
              </div>
              <ProgressBar percent={(cat.spent / cat.budget) * 100} />
            </div>
          ))}
        </div>
      </Card>

      {/* Grid 2 cols */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* El Día de Hoy */}
        <Card>
          <h2 className="font-syne text-[18px] font-medium text-text-primary mb-3">
            El Día de Hoy
          </h2>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-jorge/20 flex items-center justify-center">
              <IconWallet size={20} className="text-jorge" />
            </div>
            <div className="flex-1">
              <p className="font-dm-sans text-[15px] text-text-primary">Mercado semanal</p>
              <p className="font-dm-sans text-[12px] text-text-tertiary">Jorge pagó $45,000</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-lorena/20 flex items-center justify-center">
              <IconCheckbox size={20} className="text-lorena" />
            </div>
            <div className="flex-1">
              <p className="font-dm-sans text-[15px] text-text-primary text-tertiary">
                Sacar la basura
              </p>
              <p className="font-dm-sans text-[12px] text-text-tertiary">Tarea pendiente</p>
            </div>
            <StatusPill variant="alerta">Pendiente</StatusPill>
          </div>
        </Card>

        {/* Tareas Pendientes */}
        <Link href="/tareas">
          <Card hover className="h-full">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-syne text-[18px] font-medium text-text-primary">
                Tareas Pendientes
              </h2>
              <IconArrowRight size={18} className="text-text-tertiary" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-dm-sans text-[13px] text-text-tertiary">Progreso semanal</span>
              <span className="font-dm-sans text-[13px] text-text-secondary">3/8</span>
            </div>
            <ProgressBar percent={37.5} />
            <div className="mt-4 flex items-center gap-2">
              <Avatar user="jorge" size={24} />
              <span className="font-dm-sans text-[13px] text-text-secondary">
                Tomó: Limpiar cocina
              </span>
            </div>
          </Card>
        </Link>
      </div>

      {/* Eventos */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-syne text-[18px] font-medium text-text-primary">
            Eventos Próximos
          </h2>
          <Link
            href="/planes"
            className="text-green text-[13px] font-dm-sans font-medium flex items-center gap-1"
          >
            Ver más <IconArrowRight size={14} />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-card bg-green/10 flex items-center justify-center shrink-0">
            <IconCalendarEvent size={22} className="text-green" />
          </div>
          <div>
            <p className="font-dm-sans text-[15px] text-text-primary">Cena en La Cabrera</p>
            <p className="font-dm-sans text-[12px] text-text-tertiary">Sábado 20:00</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
