"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Input } from "@/components/ui/Input";
import { IconArrowLeft, IconEdit, IconTrash } from "@tabler/icons-react";

const initialTasks = [
  { name: "Limpiar el baño", duration: "30 min", frequency: "semanal" },
  { name: "Ordenar el living", duration: "20 min", frequency: "semanal" },
  { name: "Sacar la basura", duration: "5 min", frequency: "semanal" },
  { name: "Pasar la aspiradora", duration: "25 min", frequency: "semanal" },
  { name: "Limpiar cocina", duration: "30 min", frequency: "semanal" },
  { name: "Lavar los platos", duration: "15 min", frequency: "semanal" },
  { name: "Regar las plantas", duration: "10 min", frequency: "semanal" },
];

export default function GestionarTareasPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [frequency, setFrequency] = useState("semanal");

  const openNew = () => {
    setEditingIndex(null);
    setName("");
    setDuration("");
    setFrequency("semanal");
    setSheetOpen(true);
  };

  const openEdit = (index: number) => {
    setEditingIndex(index);
    setName(tasks[index].name);
    setDuration(tasks[index].duration);
    setFrequency(tasks[index].frequency);
    setSheetOpen(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    if (editingIndex !== null) {
      const updated = [...tasks];
      updated[editingIndex] = { name, duration, frequency };
      setTasks(updated);
    } else {
      setTasks([...tasks, { name, duration, frequency }]);
    }
    setSheetOpen(false);
  };

  const handleDelete = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
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
        {tasks.map((task, i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-3 px-4 rounded-btn bg-surface-1 border border-surface-2"
          >
            <div className="flex-1 min-w-0">
              <p className="font-dm-sans text-[15px] text-text-primary truncate">{task.name}</p>
              <p className="font-dm-sans text-[12px] text-text-tertiary">
                {task.duration} · {task.frequency}
              </p>
            </div>
            <button
              onClick={() => openEdit(i)}
              className="p-2 hover:bg-surface-2 rounded-btn transition-colors"
            >
              <IconEdit size={16} className="text-text-tertiary" />
            </button>
            <button
              onClick={() => handleDelete(i)}
              className="p-2 hover:bg-surface-2 rounded-btn transition-colors"
            >
              <IconTrash size={16} className="text-coral" />
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
        title={editingIndex !== null ? "Editar tarea" : "Nueva tarea"}
      >
        <div className="flex flex-col gap-4 py-4">
          <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre de la tarea" />
          <Input label="Duración estimada" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="30 min" />
          <div>
            <label className="text-text-secondary text-[13px] font-dm-sans font-medium block mb-2">
              Frecuencia
            </label>
            <div className="flex gap-2">
              {["única", "semanal", "mensual"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFrequency(f)}
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
            {editingIndex !== null ? "Guardar cambios" : "Agregar tarea"}
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
