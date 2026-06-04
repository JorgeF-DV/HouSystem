"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/Skeleton";
import { IconArrowLeft, IconChecks, IconWallet, IconCheckbox, IconCalendarEvent } from "@tabler/icons-react";

type Notification = {
  id: string; type: string; title: string; message: string; unread: boolean; createdAt: string;
};

const iconMap: Record<string, typeof IconWallet> = {
  finance: IconWallet, task: IconCheckbox, event: IconCalendarEvent,
};

const hrefMap: Record<string, string> = {
  finance: "/finanzas", task: "/tareas", event: "/planes",
};

export default function NotificacionesPage() {
  const router = useRouter();
  useEffect(() => { document.title = "Notificaciones — HouSystem"; }, []);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const r = await fetch("/api/notifications");
      const d = await r.json();
      if (d.error) { router.push("/login"); return; }
      setNotifications(d.notifications ?? []);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchNotifications(); }, [router]);

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications/read-all", { method: "POST" });
      setNotifications(notifications.map((n) => ({ ...n, unread: false })));
    } catch {}
  };

  if (loading) return <NotifSkeleton />;

  const hasUnread = notifications.some((n) => n.unread);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 md:px-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard" className="p-2 -ml-2 hover:bg-surface-1 rounded-btn transition-colors">
          <IconArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <h1 className="font-syne text-[22px] font-medium text-text-primary">Notificaciones</h1>
        {hasUnread && (
          <button className="ml-auto p-2 hover:bg-surface-1 rounded-btn transition-colors" onClick={markAllRead}>
            <IconChecks size={18} className="text-green" />
          </button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="flex flex-col gap-1">
          {notifications.map((n) => {
            const Icon = iconMap[n.type] || IconChecks;
            const href = hrefMap[n.type] || "/dashboard";
            return (
              <Link key={n.id} href={href} className={`flex items-start gap-3 py-4 px-4 rounded-btn hover:bg-surface-1 transition-colors`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${n.unread ? "bg-green/10" : "bg-surface-2"}`}>
                  <Icon size={18} className={n.unread ? "text-green" : "text-text-tertiary"} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-dm-sans text-[14px] ${n.unread ? "text-text-primary font-medium" : "text-text-secondary"}`}>
                    {n.message || n.title}
                  </p>
                  <p className="font-dm-sans text-[12px] text-text-tertiary mt-0.5">
                    {new Date(n.createdAt).toLocaleDateString("es-AR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                {n.unread && <span className="w-2 h-2 rounded-full bg-green mt-2 shrink-0" />}
              </Link>
            );
          })}
        </div>
      ) : (
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

function NotifSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Skeleton className="h-8 w-40 mb-6" />
      {[1,2,3].map((i) => <Skeleton key={i} className="h-16 w-full mb-2 rounded-btn" />)}
    </div>
  );
}
