"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconHome,
  IconWallet,
  IconCheckbox,
  IconTarget,
  IconCalendarEvent,
  IconSettings,
  IconBell,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Avatar } from "./Avatar";

const navItems = [
  { href: "/dashboard", label: "Inicio", icon: IconHome },
  { href: "/finanzas", label: "Finanzas", icon: IconWallet },
  { href: "/tareas", label: "Tareas", icon: IconCheckbox },
  { href: "/metas", label: "Metas", icon: IconTarget },
  { href: "/planes", label: "Planes", icon: IconCalendarEvent },
] as const;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-60 bg-bg-base border-r border-surface-2 z-30">
      <div className="p-6 pb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex -space-x-2">
            <Avatar user="jorge" size={32} />
            <Avatar user="lorena" size={32} />
          </div>
          <span className="font-syne font-bold text-[16px] text-text-primary">HouSystem</span>
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-btn text-[14px] font-dm-sans font-medium transition-colors",
                  active
                    ? "bg-green/10 text-green"
                    : "text-text-tertiary hover:text-text-secondary hover:bg-surface-1"
                )}
              >
                <Icon size={20} stroke={active ? 2 : 1.5} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-surface-2 flex items-center justify-between">
        <Link
          href="/ajustes"
          className="flex items-center gap-2 text-text-tertiary hover:text-text-secondary transition-colors"
        >
          <IconSettings size={18} />
          <span className="text-[13px] font-dm-sans">Ajustes</span>
        </Link>
        <Link
          href="/notificaciones"
          aria-label="Notificaciones"
          className="flex items-center gap-2 text-text-tertiary hover:text-text-secondary transition-colors"
        >
          <IconBell size={18} aria-hidden="true" />
        </Link>
      </div>
    </aside>
  );
}
