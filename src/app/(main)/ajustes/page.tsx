"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { IconArrowLeft, IconDownload, IconTrash, IconInfoCircle } from "@tabler/icons-react";

const allowedTypes = ["finance_alert", "task_reminder", "plan_updates"];
const defaultLabels: Record<string, string> = {
  finance_alert: "Alertas financieras",
  task_reminder: "Recordatorios de tareas",
  plan_updates: "Novedades de planes",
};

type Pref = { type: string; enabled: boolean };

export default function AjustesPage() {
  const router = useRouter();
  useEffect(() => { document.title = "Ajustes — HouSystem"; }, []);
  const [theme, setTheme] = useState("Oscuro");
  const [preferences, setPreferences] = useState<Pref[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingTheme, setSavingTheme] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/settings").then((r) => r.json()),
      fetch("/api/notifications/preferences").then((r) => r.json()),
    ])
      .then(([sData, pData]) => {
        if (sData.error || pData.error) { router.push("/login"); return; }
        setTheme(sData.settings?.theme ?? "Oscuro");
        setPreferences(pData.preferences ?? []);
      })
      .catch((e) => console.error("[AjustesPage]", e))
      .finally(() => setLoading(false));
  }, [router]);

  const updateTheme = async (t: string) => {
    setTheme(t);
    setSavingTheme(true);
    try { await fetch("/api/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ theme: t }) }); }
    catch (e) { console.error("[AjustesPage/theme]", e); } finally { setSavingTheme(false); }
  };

  const togglePref = async (type: string, enabled: boolean) => {
    setPreferences(preferences.map((p) => p.type === type ? { ...p, enabled } : p));
    try { await fetch("/api/notifications/preferences", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, enabled }) }); }
    catch (e) { console.error("[AjustesPage/pref]", e); }
  };

  if (loading) return <AjustesSkeleton />;

  const getEnabled = (type: string) => preferences.find((p) => p.type === type)?.enabled ?? true;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 md:px-6">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard" className="p-2 -ml-2 hover:bg-surface-1 rounded-btn transition-colors">
          <IconArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <h1 className="font-syne text-[22px] font-medium text-text-primary">Ajustes</h1>
      </div>

      <div className="mb-8">
        <h2 className="font-dm-sans text-[13px] text-text-tertiary font-medium mb-3">APARIENCIA</h2>
        <div className="flex gap-2">
          {["Oscuro", "Claro", "Sistema"].map((t) => (
            <button key={t} onClick={() => updateTheme(t)} aria-pressed={theme === t} disabled={savingTheme}
              className={`flex-1 py-3 rounded-btn border text-[13px] font-dm-sans transition-colors ${theme === t ? "border-green text-green bg-green/10" : "border-surface-2 text-text-secondary"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-dm-sans text-[13px] text-text-tertiary font-medium mb-3">NOTIFICACIONES</h2>
        <div className="flex flex-col gap-2">
          {allowedTypes.map((type) => {
            const enabled = getEnabled(type);
            return (
              <div key={type} className="flex items-center justify-between py-3 px-4 rounded-btn bg-surface-1 border border-surface-2">
                <span className="font-dm-sans text-[15px] text-text-primary">{defaultLabels[type]}</span>
                <button role="switch" aria-checked={enabled} aria-label={defaultLabels[type]} onClick={() => togglePref(type, !enabled)}
                  className={`w-10 h-6 rounded-pill relative transition-colors cursor-pointer ${enabled ? "bg-green" : "bg-surface-2"}`}>
                  <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${enabled ? "translate-x-[18px]" : "translate-x-0.5"}`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

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

function AjustesSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Skeleton className="h-8 w-24 mb-8" />
      <Skeleton className="h-12 w-full mb-3 rounded-btn" />
      <Skeleton className="h-12 w-full mb-3 rounded-btn" />
      <Skeleton className="h-12 w-full mb-3 rounded-btn" />
    </div>
  );
}
