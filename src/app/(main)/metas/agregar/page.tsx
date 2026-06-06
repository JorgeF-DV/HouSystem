"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatCurrency } from "@/lib/utils";
import { IconArrowLeft, IconTarget } from "@tabler/icons-react";

export default function AgregarMetaPage() {
  const router = useRouter();
  useEffect(() => { document.title = "Nueva meta — HouSystem"; }, []);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [platform, setPlatform] = useState("");
  const [link, setLink] = useState("");
  const [initial, setInitial] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const hasData = name || price || platform || link || initial;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "El nombre es obligatorio";
    if (!price || Number(price) <= 0) errs.price = "El precio debe ser mayor a 0";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const r = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          price: Number(price),
          platform: platform || "Otra",
          link: link || null,
          initialAmount: initial ? Number(initial) : null,
        }),
      });
      const d = await r.json();
      if (d.goal) router.push("/metas");
    } catch (e) { console.error("[AgregarMeta]", e); } finally { setSaving(false); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 md:px-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/metas" className="p-2 -ml-2 hover:bg-surface-1 rounded-btn transition-colors" onClick={(e) => { if (hasData && !confirm("Hay cambios sin guardar. ¿Descartar?")) e.preventDefault(); }}>
          <IconArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <h1 className="font-syne text-[22px] font-medium text-text-primary">Nueva meta</h1>
      </div>

      <div className="w-full h-36 rounded-card bg-surface-2 flex flex-col items-center justify-center mb-6">
        <IconTarget size={32} className="text-text-tertiary mb-2" />
        <p className="font-dm-sans text-[13px] text-text-tertiary">{name || "Nombre del producto"}</p>
        {price && <p className="font-syne text-[20px] font-medium text-text-primary">{formatCurrency(Number(price))}</p>}
      </div>

      <div className="flex flex-col gap-4 mb-8">
        <Input label="Nombre del producto" placeholder="Ej: Sillón nuevo" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
        <Input label="Precio objetivo" type="number" placeholder="$0" value={price} onChange={(e) => setPrice(e.target.value)} error={errors.price} />
        <div>
          <label className="text-text-secondary text-[13px] font-dm-sans font-medium block mb-2">Plataforma</label>
          <div className="flex gap-2">
            {["MercadoLibre", "Amazon", "Otra"].map((p) => (
              <button key={p} onClick={() => setPlatform(p)} aria-pressed={platform === p}
                className={`flex-1 py-3 rounded-btn border text-[13px] font-dm-sans transition-colors ${platform === p ? "border-green text-green bg-green/10" : "border-surface-2 text-text-secondary"}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
        <Input label="Link del producto (opcional)" placeholder="https://..." value={link} onChange={(e) => setLink(e.target.value)} />
        <Input label="Monto inicial de ahorro (opcional)" type="number" placeholder="$0" value={initial} onChange={(e) => setInitial(e.target.value)} />
      </div>

      <Button className="w-full" loading={saving} onClick={save}>Crear meta</Button>
    </div>
  );
}
