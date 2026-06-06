"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";
import { IconArrowLeft, IconMapPin, IconClock, IconCurrencyDollar, IconCalendarEvent, IconTrash, IconEdit } from "@tabler/icons-react";

type EventData = {
  id: string; name: string; date: string; time: string | null; location: string | null;
  price: number | null; description: string | null;
  createdBy: { id: string; name: string; role: string };
};

export default function EventoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  useEffect(() => { document.title = "Evento — HouSystem"; }, []);
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [editName, setEditName] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editLocation, setEditLocation] = useState("");

  useEffect(() => {
    fetch(`/api/events/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { router.push("/planes"); return; }
        setEvent(d.event);
        setEditName(d.event.name);
        setEditDate(d.event.date);
        setEditTime(d.event.time ?? "");
        setEditLocation(d.event.location ?? "");
      })
      .catch((e) => console.error("[EventoDetail]", e))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleDelete = async () => {
    setSaving(true);
    try {
      const r = await fetch(`/api/events/${id}`, { method: "DELETE" });
      const d = await r.json();
      if (!d.error) router.push("/planes");
    } catch (e) { console.error("[EventoDetail/delete]", e); } finally { setSaving(false); }
  };

  const updateEvent = async () => {
    setSaving(true);
    try {
      const r = await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim(), date: editDate, time: editTime || null, location: editLocation || null }),
      });
      const d = await r.json();
      if (!d.error) {
        setEditOpen(false);
        setEvent({ ...event!, name: editName.trim(), date: editDate, time: editTime || null, location: editLocation || null });
      }
    } catch (e) { console.error("[EventoDetail/update]", e); } finally { setSaving(false); }
  };

  if (loading) return <EventSkeleton />;
  if (!event) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 md:px-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/planes" className="p-2 -ml-2 hover:bg-surface-1 rounded-btn transition-colors">
          <IconArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <h1 className="font-syne text-[22px] font-medium text-text-primary">{event.name}</h1>
        <button onClick={() => setEditOpen(true)} className="ml-auto p-2 hover:bg-surface-1 rounded-btn transition-colors">
          <IconEdit size={18} className="text-text-secondary" />
        </button>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col gap-4">
          {[{ icon: IconCalendarEvent, color: "text-green", label: event.date },
            event.time ? { icon: IconClock, color: "text-text-tertiary", label: event.time } : null,
            event.location ? { icon: IconMapPin, color: "text-text-tertiary", label: event.location } : null,
            event.price ? { icon: IconCurrencyDollar, color: "text-text-tertiary", label: `$${event.price.toLocaleString("es-AR")}` } : null,
          ].filter(Boolean).map((item, i) => {
            const { icon: Icon, color, label } = item!;
            return (
              <div key={i} className="flex items-center gap-3">
                <Icon size={20} className={color} />
                <span className="font-dm-sans text-[15px] text-text-primary">{label}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {event.description && (
        <Card className="mb-6">
          <h2 className="font-syne text-[18px] font-medium text-text-primary mb-2">Descripción</h2>
          <p className="font-dm-sans text-[15px] text-text-secondary leading-relaxed">{event.description}</p>
        </Card>
      )}

      <Card className="mb-8">
        <div className="flex items-center gap-3">
          <Avatar user={event.createdBy.role} size={28} />
          <div>
            <p className="font-dm-sans text-[13px] text-text-secondary">
              Agendado por {event.createdBy.name || (event.createdBy.role === "jorge" ? "Jorge" : "Lorena")}
            </p>
          </div>
        </div>
      </Card>

      {showConfirm ? (
        <div className="flex flex-col gap-3">
          <p className="font-dm-sans text-[13px] text-text-tertiary text-center">¿Estás seguro de eliminar este evento?</p>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setShowConfirm(false)}>Cancelar</Button>
            <Button className="flex-1 bg-coral text-white hover:bg-coral/80" loading={saving} onClick={handleDelete}>Eliminar</Button>
          </div>
        </div>
      ) : (
        <Button variant="secondary" className="w-full text-coral border-coral/30" onClick={() => setShowConfirm(true)}>
          <IconTrash size={16} /> Eliminar del calendario
        </Button>
      )}

      <BottomSheet open={editOpen} onClose={() => setEditOpen(false)} title="Editar evento">
        <div className="flex flex-col gap-4 py-4">
          <Input label="Nombre" value={editName} onChange={(e) => setEditName(e.target.value)} />
          <Input label="Fecha" type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
          <Input label="Hora (opcional)" type="time" value={editTime} onChange={(e) => setEditTime(e.target.value)} />
          <Input label="Lugar (opcional)" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} />
          <Button className="w-full mt-2" loading={saving} onClick={updateEvent}>Guardar cambios</Button>
        </div>
      </BottomSheet>
    </div>
  );
}

function EventSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Skeleton className="h-8 w-48 mb-6" />
      <Skeleton className="h-48 w-full mb-6 rounded-card" />
      <Skeleton className="h-24 w-full rounded-card" />
    </div>
  );
}
