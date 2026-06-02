"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Avatar } from "@/components/ui/Avatar";
import { StatusPill } from "@/components/ui/StatusPill";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { Button } from "@/components/ui/Button";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Input } from "@/components/ui/Input";
import { formatCurrency } from "@/lib/utils";
import { IconPlus, IconArrowRight, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

const categories = [
  { name: "Mercado", icon: "🛒", spent: 180000, budget: 250000 },
  { name: "Servicios", icon: "💡", spent: 45000, budget: 60000 },
  { name: "Salidas", icon: "🍽️", spent: 72000, budget: 80000 },
  { name: "Transporte", icon: "🚗", spent: 15000, budget: 30000 },
  { name: "Salud", icon: "💊", spent: 8000, budget: 20000 },
  { name: "Otros", icon: "📦", spent: 12000, budget: 25000 },
];

const monthNames = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export default function FinanzasPage() {
  const [monthIndex, setMonthIndex] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [sheetOpen, setSheetOpen] = useState(false);

  const current = monthIndex === new Date().getMonth();
  const monthName = monthNames[monthIndex];

  const prevMonth = () => {
    if (monthIndex === 0) {
      setMonthIndex(11);
      setYear(year - 1);
    } else {
      setMonthIndex(monthIndex - 1);
    }
  };

  const nextMonth = () => {
    if (monthIndex === 11) {
      setMonthIndex(0);
      setYear(year + 1);
    } else {
      setMonthIndex(monthIndex + 1);
    }
  };

  const jorgeContribution = 160000;
  const lorenaContribution = 120000;
  const monthlyGoal = 400000;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 md:px-6 pb-24 md:pb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-syne text-[28px] font-medium text-text-primary">Finanzas</h1>
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="p-2 hover:bg-surface-1 rounded-btn transition-colors">
            <IconChevronLeft size={18} className="text-text-secondary" />
          </button>
          <span className="font-dm-sans text-[15px] text-text-secondary min-w-[100px] text-center">
            {monthName} {year}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-surface-1 rounded-btn transition-colors"
          >
            <IconChevronRight size={18} className="text-text-secondary" />
          </button>
        </div>
      </div>

      {/* Alert */}
      <AlertBanner variant="warning" className="mb-6" actionLabel="Revisar" onAction={() => {}}>
        Salidas está al 90% del presupuesto
      </AlertBanner>

      {/* Aportes Individuales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <div className="flex items-center gap-3 mb-3">
            <Avatar user="jorge" />
            <span className="font-dm-sans text-[15px] text-text-primary font-medium">Jorge</span>
            <StatusPill variant="positive" className="ml-auto">Al día</StatusPill>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-dm-sans text-[13px] text-text-tertiary">Aportado</span>
            <span className="font-syne text-[20px] font-medium text-text-primary">
              {formatCurrency(jorgeContribution)}
            </span>
          </div>
          <ProgressBar percent={65} />
          <p className="font-dm-sans text-[12px] text-text-tertiary mt-2">Meta: {formatCurrency(250000)}</p>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-3">
            <Avatar user="lorena" />
            <span className="font-dm-sans text-[15px] text-text-primary font-medium">Lorena</span>
            <StatusPill variant="positive" className="ml-auto">Al día</StatusPill>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-dm-sans text-[13px] text-text-tertiary">Aportado</span>
            <span className="font-syne text-[20px] font-medium text-text-primary">
              {formatCurrency(lorenaContribution)}
            </span>
          </div>
          <ProgressBar percent={48} />
          <p className="font-dm-sans text-[12px] text-text-tertiary mt-2">Meta: {formatCurrency(250000)}</p>
        </Card>
      </div>

      {/* Pozo Común */}
      <Card className="mb-6">
        <h2 className="font-syne text-[18px] font-medium text-text-primary mb-3">Pozo Común</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="font-dm-sans text-[12px] text-text-tertiary">Acumulado</p>
            <p className="font-syne text-[22px] font-medium text-text-primary">
              {formatCurrency(jorgeContribution + lorenaContribution)}
            </p>
          </div>
          <div>
            <p className="font-dm-sans text-[12px] text-text-tertiary">Meta mensual</p>
            <p className="font-syne text-[22px] font-medium text-text-primary">
              {formatCurrency(monthlyGoal)}
            </p>
          </div>
          <div>
            <p className="font-dm-sans text-[12px] text-text-tertiary">Completado</p>
            <p className="font-syne text-[22px] font-medium text-text-primary">
              {Math.round(((jorgeContribution + lorenaContribution) / monthlyGoal) * 100)}%
            </p>
          </div>
        </div>
        <ProgressBar percent={((jorgeContribution + lorenaContribution) / monthlyGoal) * 100} />
      </Card>

      {/* Presupuesto por categoría */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-syne text-[18px] font-medium text-text-primary">
            Presupuesto por categoría
          </h2>
          <Link
            href="/finanzas/presupuestos"
            className="text-green text-[13px] font-dm-sans font-medium flex items-center gap-1"
          >
            Editar <IconArrowRight size={14} />
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          {categories.map((cat) => {
            const percent = (cat.spent / cat.budget) * 100;
            return (
              <div key={cat.name}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">{cat.icon}</span>
                  <span className="font-dm-sans text-[13px] text-text-secondary flex-1">
                    {cat.name}
                  </span>
                  <span className="font-dm-sans text-[13px] text-text-tertiary">
                    {formatCurrency(cat.spent)}
                  </span>
                </div>
                <ProgressBar percent={percent} />
                <div className="flex justify-between mt-0.5">
                  <span className="font-dm-sans text-[11px] text-text-tertiary">
                    {formatCurrency(cat.budget)} presupuestado
                  </span>
                  <span className="font-dm-sans text-[11px] text-text-tertiary">
                    {Math.round(percent)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <Link
          href="/finanzas/historial"
          className="block text-center text-green text-[13px] font-dm-sans font-medium mt-4 pt-4 border-t border-surface-2"
        >
          Ver historial completo
        </Link>
      </Card>

      {/* FAB */}
      {current && (
        <button
          onClick={() => setSheetOpen(true)}
          className="fixed bottom-20 md:bottom-8 right-6 z-20 w-14 h-14 rounded-full bg-green text-black flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
        >
          <IconPlus size={24} />
        </button>
      )}

      {/* Bottom Sheet */}
      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Nuevo gasto">
        <div className="flex flex-col gap-4 py-4">
          <Input label="Monto" type="number" placeholder="$0" />
          <Input label="Descripción" placeholder="¿En qué gastaron?" />
          <div>
            <label className="text-text-secondary text-[13px] font-dm-sans font-medium block mb-2">
              Categoría
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  className="whitespace-nowrap px-4 py-2 rounded-pill bg-surface-2 text-text-secondary text-[13px] font-dm-sans hover:bg-surface-3 transition-colors"
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-text-secondary text-[13px] font-dm-sans font-medium block mb-2">
              ¿Quién pagó?
            </label>
            <div className="flex gap-3">
              <button className="flex-1 py-3 rounded-btn border border-surface-2 text-text-secondary text-[13px] font-dm-sans hover:bg-surface-1 transition-colors">
                Jorge
              </button>
              <button className="flex-1 py-3 rounded-btn border border-surface-2 text-text-secondary text-[13px] font-dm-sans hover:bg-surface-1 transition-colors">
                Lorena
              </button>
            </div>
          </div>
          <Button className="w-full mt-2">Guardar</Button>
        </div>
      </BottomSheet>
    </div>
  );
}
