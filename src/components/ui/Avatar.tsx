"use client";

import { cn } from "@/lib/utils";

type UserType = "jorge" | "lorena";

interface AvatarProps {
  user: UserType;
  size?: number;
  className?: string;
}

const userConfig: Record<UserType, { color: string; initial: string }> = {
  jorge: { color: "#1D9E75", initial: "J" },
  lorena: { color: "#378ADD", initial: "L" },
};

export function Avatar({ user, size = 36, className }: AvatarProps) {
  const config = userConfig[user];

  return (
    <div
      role="img"
      aria-label={user === "jorge" ? "Jorge" : "Lorena"}
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
