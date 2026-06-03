"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { IconArrowLeft, IconMapPin, IconClock, IconCurrencyDollar, IconCalendarEvent } from "@tabler/icons-react";

export default function EventoDetailPage() {
  const router = useRouter();
  useEffect(() => { document.title = "Evento — HouSystem"; }, []);
  const [showConfirm, setShowConfirm] = useState(false);

  const event = {
    name: "Cena en La Cabrera",
    date: "Sábado 14 de junio",
    time: "20:00",
    location: "Av. Cabrera 1234, Palermo",
    price: "$25,000 aprox.",
    description:
      "Una noche para disfrutar de la mejor parrilla de Buenos Aires. Reserva confirmada para dos personas.",
    createdBy: "jorge" as const,
    createdAt: "Hace 3 días",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 md:px-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/planes" className="p-2 -ml-2 hover:bg-surface-1 rounded-btn transition-colors">
          <IconArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <h1 className="font-syne text-[22px] font-medium text-text-primary">{event.name}</h1>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <IconCalendarEvent size={20} className="text-green" />
            <span className="font-dm-sans text-[15px] text-text-primary">{event.date}</span>
          </div>
          <div className="flex items-center gap-3">
            <IconClock size={20} className="text-text-tertiary" />
            <span className="font-dm-sans text-[15px] text-text-primary">{event.time}</span>
          </div>
          <div className="flex items-center gap-3">
            <IconMapPin size={20} className="text-text-tertiary" />
            <span className="font-dm-sans text-[15px] text-text-primary">{event.location}</span>
          </div>
          <div className="flex items-center gap-3">
            <IconCurrencyDollar size={20} className="text-text-tertiary" />
            <span className="font-dm-sans text-[15px] text-text-primary">{event.price}</span>
          </div>
        </div>
      </Card>

      <Card className="mb-6">
        <h2 className="font-syne text-[18px] font-medium text-text-primary mb-2">Descripción</h2>
        <p className="font-dm-sans text-[15px] text-text-secondary leading-relaxed">
          {event.description}
        </p>
      </Card>

      <Card className="mb-8">
        <div className="flex items-center gap-3">
          <Avatar user={event.createdBy} size={28} />
          <div>
            <p className="font-dm-sans text-[13px] text-text-secondary">
              Agendado por {event.createdBy === "jorge" ? "Jorge" : "Lorena"}
            </p>
            <p className="font-dm-sans text-[12px] text-text-tertiary">{event.createdAt}</p>
          </div>
        </div>
      </Card>

      {showConfirm ? (
        <div className="flex flex-col gap-3">
          <p className="font-dm-sans text-[13px] text-text-tertiary text-center">
            ¿Estás seguro de eliminar este evento?
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setShowConfirm(false)}>
              Cancelar
            </Button>
            <Button className="flex-1 bg-coral text-white hover:bg-coral/80" onClick={() => router.push("/planes")}>
              Eliminar
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="secondary" className="w-full text-coral border-coral/30" onClick={() => setShowConfirm(true)}>
          Eliminar del calendario
        </Button>
      )}
    </div>
  );
}
