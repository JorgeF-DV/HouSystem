"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { IconAdjustmentsHorizontal } from "@tabler/icons-react";

type Task = {
  id: string; name: string; duration: string; frequency: string; status: string;
  assignee: { id: string; name: string; role: string } | null;
};

export default function TareasPage() {
  const router = useRouter();
  useEffect(() => { document.title = "Tareas — HouSystem"; }, []);
  const [available, setAvailable] = useState<Task[]>([]);
  const [inProgress, setInProgress] = useState<Task[]>([]);
  const [completed, setCompleted] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [taking, setTaking] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/tasks");
        const d = await r.json();
        if (d.error) { router.push("/login"); return; }
        setAvailable(d.available ?? []);
        setInProgress(d.inProgress ?? []);
        setCompleted(d.completed ?? []);
      } catch {} finally { setLoading(false); }
    })();
  }, [router]);

  const takeTask = async (id: string) => {
    setTaking(id);
    try {
      await fetch(`/api/tasks/${id}/take`, { method: "POST" });
      const r = await fetch("/api/tasks");
      const d = await r.json();
      if (!d.error) { setAvailable(d.available ?? []); setInProgress(d.inProgress ?? []); setCompleted(d.completed ?? []); }
    } catch {} finally { setTaking(null); }
  };

  if (loading) return <TareasSkeleton />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 md:px-6 pb-24 md:pb-10">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-syne text-[28px] font-medium text-text-primary">Tareas</h1>
        <Link href="/tareas/gestionar" aria-label="Gestionar tareas" className="p-2 hover:bg-surface-1 rounded-btn transition-colors">
          <IconAdjustmentsHorizontal size={20} className="text-text-secondary" aria-hidden="true" />
        </Link>
      </div>
      <p className="font-dm-sans text-[13px] text-text-tertiary mb-6">
        Semana del {new Date().toLocaleDateString("es-AR", { day: "numeric", month: "long" })}
      </p>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 py-3 px-4 rounded-btn bg-surface-1 border border-surface-2 text-center">
          <p className="font-syne text-[22px] font-medium text-text-secondary">{available.length}</p>
          <p className="font-dm-sans text-[11px] text-text-tertiary">Disponibles</p>
        </div>
        <div className="flex-1 py-3 px-4 rounded-btn bg-surface-1 border border-surface-2 text-center">
          <p className="font-syne text-[22px] font-medium text-amber">{inProgress.length}</p>
          <p className="font-dm-sans text-[11px] text-text-tertiary">Tomadas</p>
        </div>
        <div className="flex-1 py-3 px-4 rounded-btn bg-surface-1 border border-surface-2 text-center">
          <p className="font-syne text-[22px] font-medium text-green">{completed.length}</p>
          <p className="font-dm-sans text-[11px] text-text-tertiary">Completadas</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-syne text-[18px] font-medium text-text-primary mb-3">Disponibles</h2>
        {available.length === 0 ? (
          <Card><p className="font-dm-sans text-[15px] text-text-tertiary text-center py-4">No hay tareas para esta semana</p></Card>
        ) : (
          <div className="flex flex-col gap-2">
            {available.map((task) => (
              <Card key={task.id} className="flex items-center gap-3 py-3 px-4">
                <div className="flex-1">
                  <p className="font-dm-sans text-[15px] text-text-primary">{task.name}</p>
                  <p className="font-dm-sans text-[12px] text-text-tertiary">{task.duration}</p>
                </div>
                <Button variant="secondary" className="h-9 text-[12px] px-4" loading={taking === task.id} onClick={() => takeTask(task.id)}>
                  Tomar
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="mb-8">
        <h2 className="font-syne text-[18px] font-medium text-text-primary mb-3">En progreso</h2>
        {inProgress.length === 0 ? (
          <Card><p className="font-dm-sans text-[15px] text-text-tertiary text-center py-4">Sin tareas en progreso</p></Card>
        ) : (
          <div className="flex flex-col gap-2">
            {inProgress.map((task) => (
              <Card key={task.id} className="flex items-center gap-3 py-3 px-4">
                <Avatar user={task.assignee?.role ?? "jorge"} size={28} />
                <div className="flex-1">
                  <p className="font-dm-sans text-[15px] text-text-primary">{task.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-dm-sans text-[12px] text-text-tertiary">{task.assignee?.name}</span>
                    <StatusPill variant="alerta">En curso</StatusPill>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="font-syne text-[18px] font-medium text-text-primary mb-3">Completadas</h2>
        {completed.length === 0 ? (
          <Card><p className="font-dm-sans text-[15px] text-text-tertiary text-center py-4">Sin tareas completadas</p></Card>
        ) : (
          <div className="flex flex-col gap-2">
            {completed.map((task) => (
              <Card key={task.id} className="flex items-center gap-3 py-3 px-4 opacity-60">
                <Avatar user={task.assignee?.role ?? "jorge"} size={28} />
                <div className="flex-1">
                  <p className="font-dm-sans text-[15px] text-text-primary line-through">{task.name}</p>
                  <span className="font-dm-sans text-[12px] text-text-tertiary">{task.assignee?.name} · Completada</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TareasSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-4 w-48 mb-6" />
      <div className="flex gap-4 mb-6">
        {[1,2,3].map((i) => <Skeleton key={i} className="flex-1 h-20 rounded-btn" />)}
      </div>
      <Skeleton className="h-4 w-24 mb-3" />
      {[1,2,3].map((i) => <Skeleton key={i} className="h-16 w-full mb-2 rounded-card" />)}
    </div>
  );
}
