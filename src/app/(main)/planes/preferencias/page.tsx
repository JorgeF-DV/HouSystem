"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { IconArrowLeft } from "@tabler/icons-react";

const categories = [
  "Música en vivo", "Gastronomía", "Teatro", "Cine",
  "Naturaleza", "Deportes", "Arte", "Otros",
];

const priceRanges = ["Gratis", "Hasta $50K", "Hasta $150K", "Sin límite"];

export default function PreferenciasPage() {
  const router = useRouter();
  useEffect(() => { document.title = "Preferencias — HouSystem"; }, []);
  const [selected, setSelected] = useState<string[]>([]);
  const [city, setCity] = useState("Buenos Aires");
  const [priceRange, setPriceRange] = useState("Hasta $50K");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/preferences")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { router.push("/planes"); return; }
        const p = d.preferences;
        if (p) {
          setSelected(p.selectedCategories ?? []);
          setCity(p.city ?? "Buenos Aires");
          setPriceRange(p.priceRange ?? "Hasta $50K");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const toggle = (cat: string) => {
    setSelected((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
  };

  const save = async () => {
    setSaving(true);
    try {
      await fetch("/api/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedCategories: selected, city, priceRange }),
      });
      router.push("/planes");
    } catch {} finally { setSaving(false); }
  };

  if (loading) return <PrefsSkeleton />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 md:px-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/planes" className="p-2 -ml-2 hover:bg-surface-1 rounded-btn transition-colors">
          <IconArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <h1 className="font-syne text-[22px] font-medium text-text-primary">Preferencias</h1>
      </div>

      <div className="mb-8">
        <label className="text-text-secondary text-[13px] font-dm-sans font-medium block mb-3">Categorías de eventos</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button key={cat} onClick={() => toggle(cat)} aria-pressed={selected.includes(cat)}
              className={`px-4 py-2 rounded-pill text-[13px] font-dm-sans transition-colors ${selected.includes(cat) ? "bg-green text-black font-medium" : "bg-surface-2 text-text-secondary hover:bg-surface-3"}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <Input label="Ciudad" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Tu ciudad" />
      </div>

      <div className="mb-8">
        <label className="text-text-secondary text-[13px] font-dm-sans font-medium block mb-3">Rango de precio</label>
        <div className="flex flex-wrap gap-2">
          {priceRanges.map((range) => (
            <button key={range} onClick={() => setPriceRange(range)} aria-pressed={priceRange === range}
              className={`px-4 py-2 rounded-pill text-[13px] font-dm-sans transition-colors ${priceRange === range ? "bg-green text-black font-medium" : "bg-surface-2 text-text-secondary hover:bg-surface-3"}`}>
              {range}
            </button>
          ))}
        </div>
      </div>

      <Button className="w-full" loading={saving} onClick={save}>Guardar preferencias</Button>
    </div>
  );
}

function PrefsSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Skeleton className="h-8 w-40 mb-6" />
      <Skeleton className="h-10 w-full mb-3 rounded-btn" />
      <Skeleton className="h-10 w-full mb-3 rounded-btn" />
      <Skeleton className="h-10 w-full mb-3 rounded-btn" />
    </div>
  );
}
