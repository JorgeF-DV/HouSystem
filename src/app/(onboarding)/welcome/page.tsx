"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { IconHeartHandshake } from "@tabler/icons-react";

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center text-center gap-8">
      <div className="w-20 h-20 rounded-full bg-green/10 flex items-center justify-center">
        <IconHeartHandshake size={40} className="text-green" />
      </div>

      <div>
        <h1 className="font-syne text-[32px] font-bold text-text-primary mb-2">
          HouSystem
        </h1>
        <p className="font-dm-sans text-[18px] text-text-secondary font-medium">
          Organízate. Juntos.
        </p>
      </div>

      <p className="font-dm-sans text-[15px] text-text-tertiary leading-relaxed">
        Tu hogar, tus finanzas y tus planes, compartidos con quien más importa.
      </p>

      <div className="w-full flex flex-col gap-3 mt-4">
        <Link href="/register" className="w-full">
          <Button className="w-full">Crear cuenta</Button>
        </Link>
        <Link href="/login" className="w-full">
          <Button variant="secondary" className="w-full">
            Ya tengo cuenta
          </Button>
        </Link>
      </div>
    </div>
  );
}
