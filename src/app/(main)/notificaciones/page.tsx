"use client";

import Link from "next/link";
import { IconArrowLeft, IconChecks, IconWallet, IconCheckbox, IconCalendarEvent } from "@tabler/icons-react";

const notifications = [
  {
    id: 1,
    icon: IconWallet,
    message: "Salidas está al 90% del presupuesto",
    time: "Hace 2 horas",
    unread: true,
    href: "/finanzas",
  },
  {
    id: 2,
    icon: IconCheckbox,
    message: "Limpiar el baño lleva 3 días sin tomarse",
    time: "Hace 5 horas",
    unread: true,
    href: "/tareas",
  },
  {
    id: 3,
    icon: IconCalendarEvent,
    message: "Cena en La Cabrera es mañana a las 20:00",
    time: "Hace 1 día",
    unread: false,
    href: "/planes",
  },
];

export default function NotificacionesPage() {
  const hasUnread = notifications.some((n) => n.unread);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 md:px-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard" className="p-2 -ml-2 hover:bg-surface-1 rounded-btn transition-colors">
          <IconArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <h1 className="font-syne text-[22px] font-medium text-text-primary">Notificaciones</h1>
        {hasUnread && (
          <button className="ml-auto p-2 hover:bg-surface-1 rounded-btn transition-colors">
            <IconChecks size={18} className="text-green" />
          </button>
        )}
      </div>

      {/* List */}
      <div className="flex flex-col gap-1">
        {notifications.map((n) => {
          const Icon = n.icon;
          return (
            <Link
              key={n.id}
              href={n.href}
              className="flex items-start gap-3 py-4 px-4 rounded-btn hover:bg-surface-1 transition-colors"
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                n.unread ? "bg-green/10" : "bg-surface-2"
              }`}>
                <Icon size={18} className={n.unread ? "text-green" : "text-text-tertiary"} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-dm-sans text-[14px] ${n.unread ? "text-text-primary font-medium" : "text-text-secondary"}`}>
                  {n.message}
                </p>
                <p className="font-dm-sans text-[12px] text-text-tertiary mt-0.5">{n.time}</p>
              </div>
              {n.unread && (
                <span className="w-2 h-2 rounded-full bg-green mt-2 shrink-0" />
              )}
            </Link>
          );
        })}
      </div>

      {!hasUnread && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center mx-auto mb-4">
            <IconChecks size={28} className="text-text-tertiary" />
          </div>
          <p className="font-dm-sans text-[15px] text-text-tertiary">Estás al día</p>
        </div>
      )}
    </div>
  );
}
