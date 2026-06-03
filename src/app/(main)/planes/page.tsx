"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/Button";
import { IconPlus, IconSettings, IconCalendarEvent, IconHeart } from "@tabler/icons-react";

const events = [
  { name: "Cena en La Cabrera", date: "Sábado 20:00", who: "Jorge" },
  { name: "Museo MALBA", date: "Domingo 15:00", who: "Lorena" },
];

const recommendations = [
  {
    category: "Música en vivo",
    name: "Concierto en el Teatro Colón",
    date: "Vie 14 jun",
    price: "$12,000",
    match: 92,
  },
  {
    category: "Gastronomía",
    name: "Feria de comida coreana",
    date: "Sáb 15 jun",
    price: "Gratis",
    match: 85,
  },
];

const weekDays = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];
const today = new Date();
const currentMonth = today.toLocaleString("es-AR", { month: "long", year: "numeric" });

export default function PlanesPage() {
  useEffect(() => { document.title = "Planes — HouSystem"; }, []);
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 md:px-6 pb-24 md:pb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-syne text-[28px] font-medium text-text-primary">Planes</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/planes/preferencias"
            className="p-2 hover:bg-surface-1 rounded-btn transition-colors"
          >
            <IconSettings size={18} className="text-text-secondary" />
          </Link>
          <button className="p-2 hover:bg-surface-1 rounded-btn transition-colors">
            <IconPlus size={18} className="text-text-secondary" />
          </button>
        </div>
      </div>

      {/* Mini calendar */}
      <Card className="mb-6">
        <p className="font-dm-sans text-[13px] text-text-secondary font-medium mb-3">{currentMonth}</p>
        <div className="grid grid-cols-7 gap-1 text-center">
          {weekDays.map((d) => (
            <span key={d} className="font-dm-sans text-[11px] text-text-tertiary py-1">{d}</span>
          ))}
          {Array.from({ length: 35 }, (_, i) => {
            const day = i - 2; // offset
            const inMonth = day > 0 && day <= 30;
            const hasEvent = [3, 7, 14, 21].includes(day);
            const isToday = day === today.getDate();
            return (
              <div
                key={i}
                className={`py-1 text-[13px] font-dm-sans rounded-full relative ${
                  inMonth ? "text-text-primary" : "text-transparent"
                } ${isToday ? "bg-green text-black font-medium" : ""}`}
              >
                {inMonth ? day : ""}
                {hasEvent && !isToday && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-green" />
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Esta semana */}
      <div className="mb-8">
        <h2 className="font-syne text-[18px] font-medium text-text-primary mb-3">Esta semana</h2>
        {events.length === 0 ? (
          <Card>
            <p className="font-dm-sans text-[15px] text-text-tertiary text-center py-4">
              Ningún plan en agenda esta semana
            </p>
          </Card>
        ) : (
          <div className="flex flex-col gap-2">
            {events.map((event) => (
              <Link key={event.name} href={`/planes/${event.name.toLowerCase().replace(/\s+/g, "-")}`}>
                <Card hover className="flex items-center gap-4 py-3 px-4">
                  <div className="w-10 h-10 rounded-card bg-green/10 flex items-center justify-center shrink-0">
                    <IconCalendarEvent size={20} className="text-green" />
                  </div>
                  <div className="flex-1">
                    <p className="font-dm-sans text-[15px] text-text-primary">{event.name}</p>
                    <p className="font-dm-sans text-[12px] text-text-tertiary">
                      {event.date} · Agendado por {event.who}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recomendaciones */}
      <div>
        <h2 className="font-syne text-[18px] font-medium text-text-primary mb-3">
          Recomendado para ustedes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recommendations.map((rec) => (
            <Card key={rec.name} hover>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-1">
                  <StatusPill variant="positive">{rec.category}</StatusPill>
                  <h3 className="font-dm-sans text-[15px] text-text-primary font-medium mt-2">
                    {rec.name}
                  </h3>
                  <p className="font-dm-sans text-[12px] text-text-tertiary">
                    {rec.date} · {rec.price}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-green">
                  <IconHeart size={14} />
                  <span className="font-dm-sans text-[12px] font-medium">{rec.match}%</span>
                </div>
              </div>
              <Button variant="secondary" className="w-full h-9 text-[12px]">
                Agendar
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
