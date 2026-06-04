"use client";

import { cn } from "@/lib/utils";

const userConfig: Record<string, { color: string; initial: string }> = {
  jorge: { color: "#1D9E75", initial: "J" },
  lorena: { color: "#378ADD", initial: "L" },
};

interface AvatarProps {
  user: string;
  size?: number;
  className?: string;
}

export function Avatar({ user, size = 36, className }: AvatarProps) {
  const config = userConfig[user] ?? { color: "#666", initial: "?" };

  return (
    <div
      role="img"
      aria-label={user}
      className={cn("rounded-full flex items-center justify-center font-syne font-medium", className)}
      style={{
        width: size,
        height: size,
        backgroundColor: config.color,
        fontSize: Math.round(size * 0.36),
        color: "#FFFFFF",
      }}
    >
      {config.initial}
    </div>
  );
}
