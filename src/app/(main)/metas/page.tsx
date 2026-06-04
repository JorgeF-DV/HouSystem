"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StatusPill } from "@/components/ui/StatusPill";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/lib/utils";
import { IconPlus, IconTarget } from "@tabler/icons-react";

type Goal = {
  id: string; name: string; price: number; platform: string; link: string | null;
  saved: number; contributionCount: number; createdAt: string;
};

export default function MetasPage() {
  const router = useRouter();
  useEffect(() => { document.title = "Metas — HouSystem"; }, []);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/goals")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { router.push("/login"); return; }
        setGoals(d.goals ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <MetasSkeleton />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 md:px-6 pb-24 md:pb-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-syne text-[28px] font-medium text-text-primary">Metas</h1>
        <Link href="/metas/agregar" aria-label="Agregar meta" className="p-2 hover:bg-surface-1 rounded-btn transition-colors">
          <IconPlus size={20} className="text-text-secondary" aria-hidden="true" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const percent = goal.price > 0 ? Math.round((goal.saved / goal.price) * 100) : 0;
          return (
            <Link key={goal.id} href={`/metas/${goal.id}`}>
              <Card hover>
                <div className="w-full h-36 rounded-card bg-surface-2 flex items-center justify-center mb-4">
                  <IconTarget size={36} className="text-text-tertiary" />
                </div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-dm-sans text-[15px] text-text-primary font-medium">{goal.name}</h3>
                    <p className="font-dm-sans text-[12px] text-text-tertiary">{goal.platform}</p>
                  </div>
                  <StatusPill variant="neutro">{percent}%</StatusPill>
                </div>
                <ProgressBar percent={percent} />
                <div className="flex justify-between mt-2">
                  <span className="font-dm-sans text-[13px] text-text-secondary">{formatCurrency(goal.saved)}</span>
                  <span className="font-dm-sans text-[13px] text-text-tertiary">{formatCurrency(goal.price)}</span>
                </div>
                <p className="font-dm-sans text-[11px] text-text-tertiary mt-1">~{Math.ceil((goal.price - goal.saved) / 80000)} meses estimados</p>
              </Card>
            </Link>
          );
        })}

        <Link href="/metas/agregar">
          <div className="rounded-card border-2 border-dashed border-surface-2 p-5 flex flex-col items-center justify-center min-h-[280px] hover:bg-surface-1 transition-colors cursor-pointer">
            <IconPlus size={32} className="text-text-tertiary mb-2" />
            <p className="font-dm-sans text-[15px] text-text-tertiary">Agregar meta</p>
          </div>
        </Link>
      </div>

      {goals.length === 0 && (
        <p className="font-dm-sans text-[13px] text-text-tertiary text-center py-8">No hay metas todavía. ¡Creá la primera!</p>
      )}
    </div>
  );
}

function MetasSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Skeleton className="h-8 w-24 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1,2].map((i) => (
          <div key={i} className="rounded-card border border-surface-2">
            <Skeleton className="h-36 w-full rounded-t-card" />
            <div className="p-4">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-20 mb-3" />
              <Skeleton className="h-3 w-full mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
