"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Skeleton } from "@/components/ui/Skeleton";
import { IconPlus, IconSettings, IconCalendarEvent, IconHeart } from "@tabler/icons-react";

type Event = { id: string; name: string; date: string; time: string | null; location: string | null; price: number | null; description: string | null; createdById: string };
type Recommendation = { id: string; name: string; category: string; date: string; price: string; match: number };

const weekDays = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];
const today = new Date();
const currentMonth = today.toLocaleString("es-AR", { month: "long", year: "numeric" });

export default function PlanesPage() {
  const router = useRouter();
  useEffect(() => { document.title = "Planes — HouSystem"; }, []);
  const [events, setEvents] = useState<Event[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchData = async () => {
    try {
      const [eRes, rRes] = await Promise.all([
        fetch("/api/events"),
        fetch("/api/recommendations"),
      ]);
      const eData = await eRes.json();
      const rData = await rRes.json();
      if (eData.error || rData.error) { router.push("/login"); return; }
      setEvents(eData.events ?? []);
      setRecommendations(rData.recommendations ?? []);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [router]);

  const validateEvent = () => {
    const errs: Record<string, string> = {};
    if (!eventName.trim()) errs.name = "El nombre es obligatorio";
    if (!eventDate.trim()) errs.date = "La fecha es obligatoria";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const createEvent = async () => {
    if (!validateEvent()) return;
    setSaving(true);
    try {
      const r = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: eventName.trim(), date: eventDate, time: eventTime || null, location: eventLocation || null }),
      });
      const d = await r.json();
      if (d.event) {
        setSheetOpen(false);
        setEventName(""); setEventDate(""); setEventTime(""); setEventLocation("");
        setErrors({});
        fetchData();
      }
    } catch {} finally { setSaving(false); }
  };

  if (loading) return <PlanesSkeleton />;

  const weekEvents = events.filter((e) => {
    const d = new Date(e.date);
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    return d >= weekStart && d < weekEnd;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 md:px-6 pb-24 md:pb-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-syne text-[28px] font-medium text-text-primary">Planes</h1>
        <div className="flex items-center gap-2">
          <Link href="/planes/preferencias" className="p-2 hover:bg-surface-1 rounded-btn transition-colors">
            <IconSettings size={18} className="text-text-secondary" />
          </Link>
          <button onClick={() => setSheetOpen(true)} className="p-2 hover:bg-surface-1 rounded-btn transition-colors">
            <IconPlus size={18} className="text-text-secondary" />
          </button>
        </div>
      </div>

      <Card className="mb-6">
        <p className="font-dm-sans text-[13px] text-text-secondary font-medium mb-3 capitalize">{currentMonth}</p>
        <div className="grid grid-cols-7 gap-1 text-center">
          {weekDays.map((d) => <span key={d} className="font-dm-sans text-[11px] text-text-tertiary py-1">{d}</span>)}
          {Array.from({ length: 35 }, (_, i) => {
            const day = i - 2;
            const inMonth = day > 0 && day <= 30;
            const isToday = day === today.getDate();
            return (
              <div key={i} className={`py-1 text-[13px] font-dm-sans rounded-full relative ${inMonth ? "text-text-primary" : "text-transparent"} ${isToday ? "bg-green text-black font-medium" : ""}`}>
                {inMonth ? day : ""}
              </div>
            );
          })}
        </div>
      </Card>

      <div className="mb-8">
        <h2 className="font-syne text-[18px] font-medium text-text-primary mb-3">Esta semana</h2>
        {weekEvents.length === 0 ? (
          <Card><p className="font-dm-sans text-[15px] text-text-tertiary text-center py-4">Ningún plan en agenda esta semana</p></Card>
        ) : (
          <div className="flex flex-col gap-2">
            {weekEvents.map((ev) => (
              <Link key={ev.id} href={`/planes/${ev.id}`}>
                <Card hover className="flex items-center gap-4 py-3 px-4">
                  <div className="w-10 h-10 rounded-card bg-green/10 flex items-center justify-center shrink-0">
                    <IconCalendarEvent size={20} className="text-green" />
                  </div>
                  <div className="flex-1">
                    <p className="font-dm-sans text-[15px] text-text-primary">{ev.name}</p>
                    <p className="font-dm-sans text-[12px] text-text-tertiary">{ev.date}{ev.time ? ` ${ev.time}` : ""}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {recommendations.length > 0 && (
        <div>
          <h2 className="font-syne text-[18px] font-medium text-text-primary mb-3">Recomendado para ustedes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recommendations.map((rec) => (
              <Card key={rec.id} hover>
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-1">
                    <StatusPill variant="positive">{rec.category}</StatusPill>
                    <h3 className="font-dm-sans text-[15px] text-text-primary font-medium mt-2">{rec.name}</h3>
                    <p className="font-dm-sans text-[12px] text-text-tertiary">{rec.date}</p>
                  </div>
                  <div className="flex items-center gap-1 text-green">
                    <IconHeart size={14} />
                    <span className="font-dm-sans text-[12px] font-medium">{rec.match}%</span>
                  </div>
                </div>
                <Button variant="secondary" className="w-full h-9 text-[12px]">Agendar</Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      <BottomSheet open={sheetOpen} onClose={() => { setSheetOpen(false); setErrors({}); }} title="Nuevo evento">
        <div className="flex flex-col gap-4 py-4">
          <Input label="Nombre" value={eventName} onChange={(e) => { setEventName(e.target.value); setErrors({}); }} placeholder="Ej: Cena en La Cabrera" error={errors.name} />
          <Input label="Fecha" type="date" value={eventDate} onChange={(e) => { setEventDate(e.target.value); setErrors({}); }} error={errors.date} />
          <Input label="Hora (opcional)" type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} />
          <Input label="Lugar (opcional)" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} placeholder="Dirección o nombre del lugar" />
          <Button className="w-full mt-2" loading={saving} onClick={createEvent}>Crear evento</Button>
        </div>
      </BottomSheet>
    </div>
  );
}

function PlanesSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Skeleton className="h-8 w-24 mb-6" />
      <Skeleton className="h-48 w-full mb-6 rounded-card" />
      <Skeleton className="h-4 w-24 mb-3" />
      <Skeleton className="h-16 w-full mb-2 rounded-card" />
      <Skeleton className="h-4 w-48 mb-3 mt-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Skeleton className="h-32 w-full rounded-card" />
        <Skeleton className="h-32 w-full rounded-card" />
      </div>
    </div>
  );
}
