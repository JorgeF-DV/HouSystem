"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/Button";
import { IconAdjustmentsHorizontal } from "@tabler/icons-react";

const available = [
  { name: "Limpiar el baño", duration: "30 min" },
  { name: "Ordenar el living", duration: "20 min" },
  { name: "Regar las plantas", duration: "10 min" },
];

const inProgress = [
  { name: "Limpiar cocina", who: "jorge" as const },
  { name: "Pasar la aspiradora", who: "lorena" as const },
];

const completed = [
  { name: "Sacar la basura", who: "lorena" as const, day: "Hoy" },
  { name: "Lavar los platos", who: "jorge" as const, day: "Ayer" },
];

export default function TareasPage() {
  useEffect(() => { document.title = "Tareas — HouSystem"; }, []);
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 md:px-6 pb-24 md:pb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-syne text-[28px] font-medium text-text-primary">Tareas</h1>
        <Link
          href="/tareas/gestionar"
          aria-label="Gestionar tareas"
          className="p-2 hover:bg-surface-1 rounded-btn transition-colors"
        >
          <IconAdjustmentsHorizontal size={20} className="text-text-secondary" aria-hidden="true" />
        </Link>
      </div>
      <p className="font-dm-sans text-[13px] text-text-tertiary mb-6">
        Semana del {new Date().toLocaleDateString("es-AR", { day: "numeric", month: "long" })}
      </p>

      {/* Summary */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 py-3 px-4 rounded-btn bg-surface-1 border border-surface-2 text-center">
          <p className="font-syne text-[22px] font-medium text-text-secondary">
            {available.length + inProgress.length + completed.length}
          </p>
          <p className="font-dm-sans text-[11px] text-text-tertiary">Pendientes</p>
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

      {/* Disponibles */}
      <div className="mb-8">
        <h2 className="font-syne text-[18px] font-medium text-text-primary mb-3">Disponibles</h2>
        {available.length === 0 ? (
          <Card>
            <p className="font-dm-sans text-[15px] text-text-tertiary text-center py-4">
              No hay tareas para esta semana
            </p>
          </Card>
        ) : (
          <div className="flex flex-col gap-2">
            {available.map((task) => (
              <Card key={task.name} className="flex items-center gap-3 py-3 px-4">
                <div className="flex-1">
                  <p className="font-dm-sans text-[15px] text-text-primary">{task.name}</p>
                  <p className="font-dm-sans text-[12px] text-text-tertiary">{task.duration}</p>
                </div>
                <Button variant="secondary" className="h-9 text-[12px] px-4">
                  Tomar
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* En progreso */}
      <div className="mb-8">
        <h2 className="font-syne text-[18px] font-medium text-text-primary mb-3">En progreso</h2>
        <div className="flex flex-col gap-2">
          {inProgress.map((task) => (
            <Card key={task.name} className="flex items-center gap-3 py-3 px-4">
              <Avatar user={task.who} size={28} />
              <div className="flex-1">
                <p className="font-dm-sans text-[15px] text-text-primary">{task.name}</p>
                <StatusPill variant="alerta">En curso</StatusPill>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Completadas */}
      <div>
        <h2 className="font-syne text-[18px] font-medium text-text-primary mb-3">Completadas</h2>
        <div className="flex flex-col gap-2">
          {completed.map((task) => (
            <Card key={task.name} className="flex items-center gap-3 py-3 px-4 opacity-60">
              <Avatar user={task.who} size={28} />
              <div className="flex-1">
                <p className="font-dm-sans text-[15px] text-text-primary line-through">{task.name}</p>
                <p className="font-dm-sans text-[12px] text-text-tertiary">{task.day}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
