"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { StatusPill } from "@/components/ui/StatusPill";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/lib/utils";
import {
  IconWallet,
  IconCheckbox,
  IconCalendarEvent,
  IconArrowRight,
} from "@tabler/icons-react";

type DashboardData = {
  greeting: string;
  date: string;
  budgetSummary: {
    categories: { name: string; icon: string; spent: number; budget: number }[];
    totalSpent: number;
    totalBudget: number;
    percentUsed: number;
  };
  tasks: { available: number; inProgress: number; completed: number; total: number };
  todayExpenses: { id: string; amount: number; description: string; categoryName: string; paidById: string; date: string }[];
  nextEvent: { name: string; date: string; time?: string } | null;
  totalIncome: number;
};

export default function DashboardPage() {
  const router = useRouter();
  useEffect(() => { document.title = "Dashboard — HouSystem"; }, []);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          if (d.error === "No autorizado") router.push("/login");
          return;
        }
        setData(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <DashboardSkeleton />;
  if (!data) return null;

  const { budgetSummary, tasks, todayExpenses, nextEvent, totalIncome } = data;
  const balance = totalIncome - budgetSummary.totalSpent;
  const alertCategory = budgetSummary.categories.find((c) => (c.spent / c.budget) * 100 >= 90);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 md:px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-syne text-[28px] font-medium text-text-primary">
          {data.greeting}
        </h1>
        <p className="font-dm-sans text-[15px] text-text-tertiary">
          {data.date}
        </p>
      </div>

      {/* Alert */}
      {alertCategory && (
        <AlertBanner variant="warning" className="mb-6" actionLabel="Ver finanzas" onAction={() => router.push("/finanzas")}>
          {alertCategory.name} está al {Math.round((alertCategory.spent / alertCategory.budget) * 100)}% del gasto fijo
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
              {formatCurrency(budgetSummary.totalSpent)}
            </p>
          </div>
          <div>
            <p className="font-dm-sans text-[12px] text-text-tertiary mb-1">Ejecución</p>
            <p className="font-syne text-[20px] font-medium text-text-primary">
              {budgetSummary.percentUsed}%
            </p>
          </div>
          <div>
            <p className="font-dm-sans text-[12px] text-text-tertiary mb-1">Restan</p>
            <p className="font-syne text-[20px] font-medium text-text-primary">
              {new Date().getDate()} días
            </p>
          </div>
        </div>
        {budgetSummary.categories.length > 0 ? (
          <div className="flex flex-col gap-3">
            {budgetSummary.categories.map((cat) => (
              <div key={cat.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-dm-sans text-[13px] text-text-secondary">{cat.icon} {cat.name}</span>
                  <span className="font-dm-sans text-[13px] text-text-tertiary">
                    {formatCurrency(cat.spent)} / {formatCurrency(cat.budget)}
                  </span>
                </div>
                <ProgressBar percent={(cat.spent / cat.budget) * 100} />
              </div>
            ))}
          </div>
        ) : (
          <p className="font-dm-sans text-[13px] text-text-tertiary text-center py-4">
            No hay gastos fijos configurados este mes.
          </p>
        )}
      </Card>

      {/* Ingresos */}
      <Card className="mb-4 md:col-span-full">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-syne text-[18px] font-medium text-text-primary">Ingresos del mes</h2>
          <Link href="/finanzas/ingresos" className="text-green text-[13px] font-dm-sans font-medium flex items-center gap-1">
            Ver más <IconArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-dm-sans text-[12px] text-text-tertiary mb-1">Ingresos</p>
            <p className="font-syne text-[20px] font-medium text-green">{formatCurrency(totalIncome)}</p>
          </div>
          <div>
            <p className="font-dm-sans text-[12px] text-text-tertiary mb-1">Balance</p>
            <p className={`font-syne text-[20px] font-medium ${balance >= 0 ? "text-green" : "text-coral"}`}>
              {formatCurrency(balance)}
            </p>
          </div>
        </div>
      </Card>

      {/* Grid 2 cols */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* El Día de Hoy */}
        <Card>
          <h2 className="font-syne text-[18px] font-medium text-text-primary mb-3">
            El Día de Hoy
          </h2>
          {todayExpenses.length > 0 ? todayExpenses.map((exp) => (
            <div key={exp.id} className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-jorge/20 flex items-center justify-center">
                <IconWallet size={20} className="text-jorge" />
              </div>
              <div className="flex-1">
                <p className="font-dm-sans text-[15px] text-text-primary">{exp.description || exp.categoryName}</p>
                <p className="font-dm-sans text-[12px] text-text-tertiary">{formatCurrency(exp.amount)}</p>
              </div>
            </div>
          )) : (
            <p className="font-dm-sans text-[13px] text-text-tertiary text-center py-4">
              Sin gastos hoy
            </p>
          )}
          {tasks.available > 0 && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-lorena/20 flex items-center justify-center">
                <IconCheckbox size={20} className="text-lorena" />
              </div>
              <div className="flex-1">
                <p className="font-dm-sans text-[15px] text-text-primary">
                  {tasks.available} tarea{tasks.available > 1 ? "s" : ""} pendiente{tasks.available > 1 ? "s" : ""}
                </p>
                <p className="font-dm-sans text-[12px] text-text-tertiary">Tareas disponibles</p>
              </div>
              <StatusPill variant="alerta">Pendiente</StatusPill>
            </div>
          )}
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
              <span className="font-dm-sans text-[13px] text-text-secondary">
                {tasks.completed}/{tasks.total}
              </span>
            </div>
            <ProgressBar percent={tasks.total > 0 ? (tasks.completed / tasks.total) * 100 : 0} />
          </Card>
        </Link>
      </div>

      {/* Eventos */}
      {nextEvent && (
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
              <p className="font-dm-sans text-[15px] text-text-primary">{nextEvent.name}</p>
              <p className="font-dm-sans text-[12px] text-text-tertiary">{nextEvent.date}{nextEvent.time ? ` ${nextEvent.time}` : ""}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 md:px-6">
      <div className="mb-6">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-48 w-full mb-4 rounded-card" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Skeleton className="h-32 w-full rounded-card" />
        <Skeleton className="h-32 w-full rounded-card" />
      </div>
      <Skeleton className="h-24 w-full rounded-card" />
    </div>
  );
}
