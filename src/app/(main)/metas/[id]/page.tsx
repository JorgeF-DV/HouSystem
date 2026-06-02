"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatCurrency } from "@/lib/utils";
import { IconArrowLeft, IconTarget, IconExternalLink } from "@tabler/icons-react";

const goalData = {
  name: "Sillón nuevo",
  platform: "MercadoLibre",
  price: 450000,
  saved: 180000,
  link: "https://mercadolibre.com.ar/...",
};

const contributions = [
  { who: "jorge" as const, amount: 25000, date: "Hoy" },
  { who: "lorena" as const, amount: 15000, date: "Ayer" },
  { who: "jorge" as const, amount: 30000, date: "20 may" },
];

export default function MetaDetailPage() {
  const [amount, setAmount] = useState("");
  const [who, setWho] = useState<"jorge" | "lorena">("jorge");

  const percent = Math.round((goalData.saved / goalData.price) * 100);
  const remaining = goalData.price - goalData.saved;
  const monthlyRate = 80000;
  const monthsLeft = Math.ceil(remaining / monthlyRate);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 md:px-6 pb-24 md:pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/metas" className="p-2 -ml-2 hover:bg-surface-1 rounded-btn transition-colors">
          <IconArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <h1 className="font-syne text-[22px] font-medium text-text-primary">{goalData.name}</h1>
      </div>

      {/* Image */}
      <div className="w-full h-48 rounded-card bg-surface-2 flex items-center justify-center mb-6">
        <IconTarget size={48} className="text-text-tertiary" />
      </div>

      {/* Info */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <span className="font-dm-sans text-[13px] text-text-tertiary">{goalData.platform}</span>
          <a
            href={goalData.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green text-[13px] font-dm-sans flex items-center gap-1"
          >
            Ver producto <IconExternalLink size={14} />
          </a>
        </div>
        <p className="font-syne text-[28px] font-medium text-text-primary mb-4">
          {formatCurrency(goalData.price)}
        </p>

        <ProgressBar percent={percent} />
        <div className="flex justify-between mt-2 mb-6">
          <span className="font-dm-sans text-[13px] text-text-secondary">
            {formatCurrency(goalData.saved)}
          </span>
          <span className="font-dm-sans text-[13px] text-text-tertiary">{percent}%</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="py-3 px-3 rounded-btn bg-surface-2 text-center">
            <p className="font-dm-sans text-[12px] text-text-tertiary">Ahorrado</p>
            <p className="font-syne text-[18px] font-medium text-text-primary">
              {formatCurrency(goalData.saved)}
            </p>
          </div>
          <div className="py-3 px-3 rounded-btn bg-surface-2 text-center">
            <p className="font-dm-sans text-[12px] text-text-tertiary">Faltante</p>
            <p className="font-syne text-[18px] font-medium text-text-primary">
              {formatCurrency(remaining)}
            </p>
          </div>
          <div className="py-3 px-3 rounded-btn bg-surface-2 text-center">
            <p className="font-dm-sans text-[12px] text-text-tertiary">Estimado</p>
            <p className="font-syne text-[18px] font-medium text-text-primary">
              ~{monthsLeft}m
            </p>
          </div>
        </div>
      </Card>

      {/* Abonar */}
      <Card className="mb-6">
        <h2 className="font-syne text-[18px] font-medium text-text-primary mb-4">Abonar al ahorro</h2>
        <div className="flex flex-col gap-4">
          <Input
            label="Monto"
            type="number"
            placeholder="$0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div>
            <label className="text-text-secondary text-[13px] font-dm-sans font-medium block mb-2">
              ¿Quién abona?
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setWho("jorge")}
                className={`flex-1 py-3 rounded-btn border text-[13px] font-dm-sans transition-colors flex items-center justify-center gap-2 ${
                  who === "jorge"
                    ? "border-jorge text-jorge bg-jorge/10"
                    : "border-surface-2 text-text-secondary"
                }`}
              >
                <Avatar user="jorge" size={20} /> Jorge
              </button>
              <button
                onClick={() => setWho("lorena")}
                className={`flex-1 py-3 rounded-btn border text-[13px] font-dm-sans transition-colors flex items-center justify-center gap-2 ${
                  who === "lorena"
                    ? "border-lorena text-lorena bg-lorena/10"
                    : "border-surface-2 text-text-secondary"
                }`}
              >
                <Avatar user="lorena" size={20} /> Lorena
              </button>
            </div>
          </div>
          <Button className="w-full">Guardar abono</Button>
        </div>
      </Card>

      {/* Historial */}
      <Card>
        <h2 className="font-syne text-[18px] font-medium text-text-primary mb-4">Historial de abonos</h2>
        <div className="flex flex-col gap-3">
          {contributions.map((c, i) => (
            <div key={i} className="flex items-center gap-3">
              <Avatar user={c.who} size={24} />
              <span className="font-dm-sans text-[13px] text-text-secondary flex-1">{c.date}</span>
              <span className="font-dm-sans text-[15px] text-text-primary font-medium">
                {formatCurrency(c.amount)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
