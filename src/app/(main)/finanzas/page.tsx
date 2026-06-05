"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Avatar } from "@/components/ui/Avatar";
import { StatusPill } from "@/components/ui/StatusPill";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { Skeleton } from "@/components/ui/Skeleton";
import { AddExpenseSheet } from "@/components/AddExpenseSheet";
import { formatCurrency } from "@/lib/utils";
import { IconPlus, IconArrowRight, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

type CategoryInfo = { name: string; icon: string; spent: number; budget: number };
type MemberInfo = { userId: string; name: string; role: string; total: number };
type FinancesData = { categories: CategoryInfo[]; perMember: MemberInfo[]; total: number };

export default function FinanzasPage() {
  const router = useRouter();
  useEffect(() => { document.title = "Finanzas — HouSystem"; }, []);
  const [monthIndex, setMonthIndex] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [sheetOpen, setSheetOpen] = useState(false);
  const [data, setData] = useState<FinancesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<{ id: string; name: string; role: string }[]>([]);
  const [incomeTotal, setIncomeTotal] = useState(0);

  const refetch = useCallback(async () => {
    try {
      const r = await fetch(`/api/finances?month=${monthIndex}&year=${year}`);
      const d = await r.json();
      if (d.error) { router.push("/login"); return; }
      setData(d);
      setMembers(d.perMember.map((m: MemberInfo) => ({ id: m.userId, name: m.name, role: m.role })));
    } catch {} finally { setLoading(false); }
    fetch("/api/incomes").then((ri) => ri.json()).then((di) => { if (!di.error) setIncomeTotal(di.total); }).catch(() => {});
  }, [monthIndex, year, router]);

  useEffect(() => { refetch(); }, [refetch]);

  const current = monthIndex === new Date().getMonth();

  if (loading) return <FinanzasSkeleton />;

  const { categories, perMember, total } = data || { categories: [], perMember: [], total: 0 };
  const totalBudget = categories.reduce((s, c) => s + c.budget, 0);
  const alertCategory = categories.find((c) => c.budget > 0 && (c.spent / c.budget) * 100 >= 90);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 md:px-6 pb-24 md:pb-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-syne text-[28px] font-medium text-text-primary">Finanzas</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => monthIndex === 0 ? (setMonthIndex(11), setYear((y) => y - 1)) : setMonthIndex(monthIndex - 1)}
            aria-label="Mes anterior" className="p-2 hover:bg-surface-1 rounded-btn transition-colors">
            <IconChevronLeft size={18} className="text-text-secondary" />
          </button>
          <span className="font-dm-sans text-[15px] text-text-secondary min-w-[100px] text-center">
            {MONTHS[monthIndex]} {year}
          </span>
          <button onClick={() => monthIndex === 11 ? (setMonthIndex(0), setYear((y) => y + 1)) : setMonthIndex(monthIndex + 1)}
            aria-label="Mes siguiente" className="p-2 hover:bg-surface-1 rounded-btn transition-colors">
            <IconChevronRight size={18} className="text-text-secondary" />
          </button>
        </div>
      </div>

      {alertCategory && (
        <AlertBanner variant="warning" className="mb-6">
          {alertCategory.name} está al {Math.round((alertCategory.spent / alertCategory.budget) * 100)}% del gasto fijo
        </AlertBanner>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {perMember.map((member) => (
          <Card key={member.userId}>
            <div className="flex items-center gap-3 mb-3">
              <Avatar user={member.role} />
              <span className="font-dm-sans text-[15px] text-text-primary font-medium capitalize">{member.name || member.role}</span>
              <StatusPill variant="positive" className="ml-auto">Al día</StatusPill>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-dm-sans text-[13px] text-text-tertiary">Gastado</span>
              <span className="font-syne text-[20px] font-medium text-text-primary">{formatCurrency(member.total)}</span>
            </div>
            <ProgressBar percent={totalBudget > 0 ? Math.min(100, (member.total / totalBudget) * 100) : 0} />
          </Card>
        ))}
      </div>

      <Card className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-syne text-[18px] font-medium text-text-primary">Ingresos</h2>
          <Link href="/finanzas/ingresos" className="text-green text-[13px] font-dm-sans font-medium flex items-center gap-1">
            Ver más <IconArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-dm-sans text-[12px] text-text-tertiary mb-1">Ingresos del mes</p>
            <p className="font-syne text-[20px] font-medium text-green">{formatCurrency(incomeTotal)}</p>
          </div>
          <div>
            <p className="font-dm-sans text-[12px] text-text-tertiary mb-1">Balance</p>
            <p className={`font-syne text-[20px] font-medium ${incomeTotal - total >= 0 ? "text-green" : "text-coral"}`}>
              {formatCurrency(incomeTotal - total)}
            </p>
          </div>
        </div>
      </Card>

      <Card className="mb-6">
        <h2 className="font-syne text-[18px] font-medium text-text-primary mb-3">Gasto Total</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[{ label: "Gastado", value: formatCurrency(total) }, { label: "Presupuesto", value: formatCurrency(totalBudget) }, { label: "Ejecución", value: `${totalBudget > 0 ? Math.round((total / totalBudget) * 100) : 0}%` }].map((s) => (
            <div key={s.label}>
              <p className="font-dm-sans text-[12px] text-text-tertiary">{s.label}</p>
              <p className="font-syne text-[22px] font-medium text-text-primary">{s.value}</p>
            </div>
          ))}
        </div>
        <ProgressBar percent={totalBudget > 0 ? (total / totalBudget) * 100 : 0} />
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-syne text-[18px] font-medium text-text-primary">Gastos fijos</h2>
          <Link href="/finanzas/presupuestos" className="text-green text-[13px] font-dm-sans font-medium flex items-center gap-1">
            Editar <IconArrowRight size={14} />
          </Link>
        </div>
        {categories.length > 0 ? (
          <div className="flex flex-col gap-4">
            {categories.map((cat) => {
              const percent = cat.budget > 0 ? (cat.spent / cat.budget) * 100 : 0;
              return (
                <div key={cat.name}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">{cat.icon}</span>
                    <span className="font-dm-sans text-[13px] text-text-secondary flex-1">{cat.name}</span>
                    <span className="font-dm-sans text-[13px] text-text-tertiary">{formatCurrency(cat.spent)}</span>
                  </div>
                  <ProgressBar percent={percent} />
                  <div className="flex justify-between mt-0.5">
                    <span className="font-dm-sans text-[11px] text-text-tertiary">{formatCurrency(cat.budget)} presupuestado</span>
                    <span className="font-dm-sans text-[11px] text-text-tertiary">{Math.round(percent)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="font-dm-sans text-[13px] text-text-tertiary text-center py-4">No hay gastos fijos este mes.</p>
        )}
        <Link href="/finanzas/historial" className="block text-center text-green text-[13px] font-dm-sans font-medium mt-4 pt-4 border-t border-surface-2">
          Ver historial completo
        </Link>
      </Card>

      {current && (
        <button onClick={() => setSheetOpen(true)} aria-label="Agregar gasto"
          className="fixed bottom-20 md:bottom-8 right-6 z-20 w-14 h-14 rounded-full bg-green text-black flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity">
          <IconPlus size={24} aria-hidden="true" />
        </button>
      )}

      <AddExpenseSheet open={sheetOpen} onClose={() => setSheetOpen(false)} categories={categories} members={members} onSaved={refetch} />
    </div>
  );
}

function FinanzasSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 md:px-6">
      <Skeleton className="h-8 w-32 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Skeleton className="h-32 w-full rounded-card" />
        <Skeleton className="h-32 w-full rounded-card" />
      </div>
      <Skeleton className="h-32 w-full mb-6 rounded-card" />
      <Skeleton className="h-64 w-full rounded-card" />
    </div>
  );
}
