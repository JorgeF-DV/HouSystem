"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Input } from "@/components/ui/Input";
import { IconArrowLeft, IconEdit, IconTrash } from "@tabler/icons-react";

let nextId = 1;
const initialTasks = [
  { id: nextId++, name: "Limpiar el baño", duration: "30 min", frequency: "semanal" },
  { id: nextId++, name: "Ordenar el living", duration: "20 min", frequency: "semanal" },
  { id: nextId++, name: "Sacar la basura", duration: "5 min", frequency: "semanal" },
  { id: nextId++, name: "Pasar la aspiradora", duration: "25 min", frequency: "semanal" },
  { id: nextId++, name: "Limpiar cocina", duration: "30 min", frequency: "semanal" },
  { id: nextId++, name: "Lavar los platos", duration: "15 min", frequency: "semanal" },
  { id: nextId++, name: "Regar las plantas", duration: "10 min", frequency: "semanal" },
];

export default function GestionarTareasPage() {
  useEffect(() => { document.title = "Gestionar tareas — HouSystem"; }, []);
  const [tasks, setTasks] = useState(initialTasks);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [frequency, setFrequency] = useState("semanal");
  const [errors, setErrors] = useState<{ name?: string; duration?: string }>({});

  const validate = () => {
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = "El nombre es obligatorio";
    if (!duration.trim()) errs.duration = "La duración es obligatoria";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const openNew = () => {
    setEditingId(null);
    setName("");
    setDuration("");
    setFrequency("semanal");
    setSheetOpen(true);
  };

  const openEdit = (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    setEditingId(id);
    setName(task.name);
    setDuration(task.duration);
    setFrequency(task.frequency);
    setSheetOpen(true);
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editingId !== null) {
      setTasks(tasks.map((t) =>
        t.id === editingId ? { ...t, name, duration, frequency } : t
      ));
    } else {
      setTasks([...tasks, { id: nextId++, name, duration, frequency }]);
    }
    setSheetOpen(false);
  };

  const handleDelete = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 md:px-6 pb-24 md:pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/tareas" className="p-2 -ml-2 hover:bg-surface-1 rounded-btn transition-colors">
          <IconArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <h1 className="font-syne text-[22px] font-medium text-text-primary">Gestionar tareas</h1>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2 mb-6">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-3 py-3 px-4 rounded-btn bg-surface-1 border border-surface-2"
          >
            <div className="flex-1 min-w-0">
              <p className="font-dm-sans text-[15px] text-text-primary truncate">{task.name}</p>
              <p className="font-dm-sans text-[12px] text-text-tertiary">
                {task.duration} · {task.frequency}
              </p>
            </div>
            <button
              onClick={() => openEdit(task.id)}
              aria-label={`Editar ${task.name}`}
              className="p-2 hover:bg-surface-2 rounded-btn transition-colors"
            >
              <IconEdit size={16} className="text-text-tertiary" aria-hidden="true" />
            </button>
            <button
              onClick={() => handleDelete(task.id)}
              aria-label={`Eliminar ${task.name}`}
              className="p-2 hover:bg-surface-2 rounded-btn transition-colors"
            >
              <IconTrash size={16} className="text-coral" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>

      <Button variant="secondary" className="w-full" onClick={openNew}>
        Agregar tarea
      </Button>

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title={editingId !== null ? "Editar tarea" : "Nueva tarea"}
      >
        <div className="flex flex-col gap-4 py-4">
          <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre de la tarea" error={errors.name} />
          <Input label="Duración estimada" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="30 min" error={errors.duration} />
          <div>
            <label className="text-text-secondary text-[13px] font-dm-sans font-medium block mb-2">
              Frecuencia
            </label>
            <div className="flex gap-2">
              {["única", "semanal", "mensual"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFrequency(f)}
                  aria-pressed={frequency === f}
                  className={`flex-1 py-3 rounded-btn border text-[13px] font-dm-sans transition-colors ${
                    frequency === f
                      ? "border-green text-green bg-green/10"
                      : "border-surface-2 text-text-secondary"
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <Button className="w-full mt-2" onClick={handleSave}>
            {editingId !== null ? "Guardar cambios" : "Agregar tarea"}
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
