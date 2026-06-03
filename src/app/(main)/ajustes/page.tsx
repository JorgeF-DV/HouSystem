"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { IconArrowLeft, IconDownload, IconTrash, IconInfoCircle } from "@tabler/icons-react";

const notificationTypes = [
  { label: "Alertas financieras", enabled: true },
  { label: "Recordatorios de tareas", enabled: true },
  { label: "Novedades de planes", enabled: false },
];

export default function AjustesPage() {
  useEffect(() => { document.title = "Ajustes — HouSystem"; }, []);
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 md:px-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard" className="p-2 -ml-2 hover:bg-surface-1 rounded-btn transition-colors">
          <IconArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <h1 className="font-syne text-[22px] font-medium text-text-primary">Ajustes</h1>
      </div>

      {/* Apariencia */}
      <div className="mb-8">
        <h2 className="font-dm-sans text-[13px] text-text-tertiary font-medium mb-3">APARIENCIA</h2>
        <div className="flex gap-2">
          {["Oscuro", "Claro", "Sistema"].map((theme) => (
            <button
              key={theme}
              aria-pressed={theme === "Oscuro"}
              className={`flex-1 py-3 rounded-btn border text-[13px] font-dm-sans transition-colors ${
                theme === "Oscuro"
                  ? "border-green text-green bg-green/10"
                  : "border-surface-2 text-text-secondary"
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      {/* Notificaciones */}
      <div className="mb-8">
        <h2 className="font-dm-sans text-[13px] text-text-tertiary font-medium mb-3">NOTIFICACIONES</h2>
        <div className="flex flex-col gap-2">
          {notificationTypes.map((n) => (
            <div
              key={n.label}
              className="flex items-center justify-between py-3 px-4 rounded-btn bg-surface-1 border border-surface-2"
            >
              <span className="font-dm-sans text-[15px] text-text-primary">{n.label}</span>
              <button
                role="switch"
                aria-checked={n.enabled}
                aria-label={n.label}
                className={`w-10 h-6 rounded-pill relative transition-colors cursor-pointer ${
                  n.enabled ? "bg-green" : "bg-surface-2"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    n.enabled ? "translate-x-[18px]" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Datos */}
      <div className="mb-8">
        <h2 className="font-dm-sans text-[13px] text-text-tertiary font-medium mb-3">DATOS</h2>
        <div className="flex flex-col gap-2">
          <Button variant="secondary" className="w-full justify-between">
            Exportar datos (CSV) <IconDownload size={16} />
          </Button>
          <Button variant="secondary" className="w-full justify-between">
            Limpiar caché <IconTrash size={16} />
          </Button>
        </div>
      </div>

      {/* Acerca de */}
      <div>
        <h2 className="font-dm-sans text-[13px] text-text-tertiary font-medium mb-3">ACERCA DE</h2>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between py-3 px-4 rounded-btn bg-surface-1 border border-surface-2">
            <span className="font-dm-sans text-[15px] text-text-primary">Versión</span>
            <span className="font-dm-sans text-[13px] text-text-tertiary">1.0.0</span>
          </div>
          <Button variant="secondary" className="w-full justify-between">
            Términos y condiciones <IconInfoCircle size={16} />
          </Button>
          <Button variant="secondary" className="w-full justify-between">
            Privacidad <IconInfoCircle size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
