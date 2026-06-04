"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { IconArrowLeft, IconEdit, IconTrash } from "@tabler/icons-react";

type Task = { id: string; name: string; duration: string; frequency: string };

export default function GestionarTareasPage() {
  const router = useRouter();
  useEffect(() => { document.title = "Gestionar tareas — HouSystem"; }, []);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [frequency, setFrequency] = useState("semanal");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchTasks = async () => {
    try {
      const r = await fetch("/api/tasks");
      const d = await r.json();
      if (d.error) { router.push("/login"); return; }
      setTasks([...d.available, ...d.inProgress, ...d.completed]);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(); }, [router]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "El nombre es obligatorio";
    if (!duration.trim()) errs.duration = "La duración es obligatoria";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const openNew = () => {
    setEditingId(null); setName(""); setDuration(""); setFrequency("semanal"); setErrors({}); setSheetOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingId(task.id); setName(task.name); setDuration(task.duration); setFrequency(task.frequency); setErrors({}); setSheetOpen(true);
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (editingId) {
        await fetch(`/api/tasks?id=${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, duration, frequency }),
        });
      } else {
        await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, duration, frequency }),
        });
      }
      setSheetOpen(false);
      fetchTasks();
    } catch {} finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/tasks?id=${id}`, { method: "DELETE" });
      fetchTasks();
    } catch {}
  };

  if (loading) return <GestionarSkeleton />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 md:px-6 pb-24 md:pb-10">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/tareas" className="p-2 -ml-2 hover:bg-surface-1 rounded-btn transition-colors">
          <IconArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <h1 className="font-syne text-[22px] font-medium text-text-primary">Gestionar tareas</h1>
      </div>

      {tasks.length > 0 ? (
        <div className="flex flex-col gap-2 mb-6">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3 py-3 px-4 rounded-btn bg-surface-1 border border-surface-2">
              <div className="flex-1 min-w-0">
                <p className="font-dm-sans text-[15px] text-text-primary truncate">{task.name}</p>
                <p className="font-dm-sans text-[12px] text-text-tertiary">{task.duration} · {task.frequency}</p>
              </div>
              <button onClick={() => openEdit(task)} aria-label={`Editar ${task.name}`} className="p-2 hover:bg-surface-2 rounded-btn transition-colors">
                <IconEdit size={16} className="text-text-tertiary" aria-hidden="true" />
              </button>
              <button onClick={() => handleDelete(task.id)} aria-label={`Eliminar ${task.name}`} className="p-2 hover:bg-surface-2 rounded-btn transition-colors">
                <IconTrash size={16} className="text-coral" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="font-dm-sans text-[13px] text-text-tertiary text-center py-8 mb-4">No hay tareas.</p>
      )}

      <Button variant="secondary" className="w-full" onClick={openNew}>Agregar tarea</Button>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title={editingId !== null ? "Editar tarea" : "Nueva tarea"}>
        <div className="flex flex-col gap-4 py-4">
          <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre de la tarea" error={errors.name} />
          <Input label="Duración estimada" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="30 min" error={errors.duration} />
          <div>
            <label className="text-text-secondary text-[13px] font-dm-sans font-medium block mb-2">Frecuencia</label>
            <div className="flex gap-2">
              {["única", "semanal", "mensual"].map((f) => (
                <button key={f} onClick={() => setFrequency(f)} aria-pressed={frequency === f} className={`flex-1 py-3 rounded-btn border text-[13px] font-dm-sans transition-colors ${frequency === f ? "border-green text-green bg-green/10" : "border-surface-2 text-text-secondary"}`}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <Button className="w-full mt-2" loading={saving} onClick={handleSave}>
            {editingId !== null ? "Guardar cambios" : "Agregar tarea"}
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}

function GestionarSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Skeleton className="h-8 w-48 mb-6" />
      {[1,2,3,4,5].map((i) => <Skeleton key={i} className="h-16 w-full mb-2 rounded-btn" />)}
    </div>
  );
}
