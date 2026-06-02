"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconHome,
  IconWallet,
  IconCheckbox,
  IconTarget,
  IconCalendarEvent,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Inicio", icon: IconHome },
  { href: "/finanzas", label: "Finanzas", icon: IconWallet },
  { href: "/tareas", label: "Tareas", icon: IconCheckbox },
  { href: "/metas", label: "Metas", icon: IconTarget },
  { href: "/planes", label: "Planes", icon: IconCalendarEvent },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-bg-base border-t border-surface-2 safe-bottom">
      <div className="flex items-center justify-around h-16">
        {items.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-0.5 min-w-[44px] min-h-[44px]"
            >
              <Icon
                size={20}
                className={cn(
                  "transition-colors",
                  active ? "text-green" : "text-text-tertiary"
                )}
                stroke={active ? 2 : 1.5}
              />
              <span
                className={cn(
                  "text-[10px] font-dm-sans font-medium transition-colors",
                  active ? "text-green" : "text-text-tertiary"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
