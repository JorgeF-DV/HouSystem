"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { IconArrowLeft } from "@tabler/icons-react";

const categories = [
  "Música en vivo",
  "Gastronomía",
  "Teatro",
  "Cine",
  "Naturaleza",
  "Deportes",
  "Arte",
  "Otros",
];

const priceRanges = ["Gratis", "Hasta $50K", "Hasta $150K", "Sin límite"];

export default function PreferenciasPage() {
  const [selected, setSelected] = useState<string[]>(["Gastronomía", "Cine"]);
  const [city, setCity] = useState("Buenos Aires");
  const [priceRange, setPriceRange] = useState("Hasta $50K");

  const toggle = (cat: string) => {
    setSelected((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 md:px-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/planes" className="p-2 -ml-2 hover:bg-surface-1 rounded-btn transition-colors">
          <IconArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <h1 className="font-syne text-[22px] font-medium text-text-primary">Preferencias</h1>
      </div>

      {/* Categorías */}
      <div className="mb-8">
        <label className="text-text-secondary text-[13px] font-dm-sans font-medium block mb-3">
          Categorías de eventos
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => toggle(cat)}
              className={`px-4 py-2 rounded-pill text-[13px] font-dm-sans transition-colors ${
                selected.includes(cat)
                  ? "bg-green text-black font-medium"
                  : "bg-surface-2 text-text-secondary hover:bg-surface-3"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Ciudad */}
      <div className="mb-8">
        <Input
          label="Ciudad"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Tu ciudad"
        />
      </div>

      {/* Precio */}
      <div className="mb-8">
        <label className="text-text-secondary text-[13px] font-dm-sans font-medium block mb-3">
          Rango de precio
        </label>
        <div className="flex flex-wrap gap-2">
          {priceRanges.map((range) => (
            <button
              key={range}
              onClick={() => setPriceRange(range)}
              className={`px-4 py-2 rounded-pill text-[13px] font-dm-sans transition-colors ${
                priceRange === range
                  ? "bg-green text-black font-medium"
                  : "bg-surface-2 text-text-secondary hover:bg-surface-3"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <Button className="w-full">Guardar preferencias</Button>
    </div>
  );
}
