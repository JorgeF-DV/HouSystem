"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type CategoryInfo = { name: string; icon: string; spent: number; budget: number };

interface AddExpenseSheetProps {
  open: boolean;
  onClose: () => void;
  categories: CategoryInfo[];
  members: { id: string; name: string; role: string }[];
  onSaved: () => void;
}

export function AddExpenseSheet({ open, onClose, categories, members, onSaved }: AddExpenseSheetProps) {
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [cat, setCat] = useState("");
  const [who, setWho] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!amount || Number(amount) <= 0) errs.amount = "El monto debe ser mayor a 0";
    if (!cat) errs.category = "Seleccioná una categoría";
    if (!who) errs.who = "Seleccioná quién pagó";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const reset = () => { setAmount(""); setDesc(""); setCat(""); setWho(""); setErrors({}); onClose(); };

  const submit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const r = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount), description: desc, categoryName: cat, paidById: who }),
      });
      const d = await r.json();
      if (d.expense) { reset(); onSaved(); }
    } catch (e) { console.error("[AddExpenseSheet]", e); } finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onClose={reset} title="Nuevo gasto">
      <div className="flex flex-col gap-3">
        <Input label="Monto" type="number" placeholder="$0" value={amount} onChange={(e) => { setAmount(e.target.value); setErrors({}); }} error={errors.amount} />
        <Input label="Descripción" placeholder="¿En qué gastaron?" value={desc} onChange={(e) => setDesc(e.target.value)} />
        <div>
          <label className="text-text-secondary text-[13px] font-dm-sans font-medium block mb-2">Categoría</label>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button key={c.name} onClick={() => { setCat(c.name); setErrors({}); }}
                className={`whitespace-nowrap px-3 py-1.5 rounded-pill text-[12px] font-dm-sans transition-colors ${cat === c.name ? "bg-green text-black" : "bg-surface-2 text-text-secondary hover:bg-surface-3"}`}>
                {c.icon} {c.name}
              </button>
            ))}
          </div>
          {errors.category && <span className="text-coral text-[12px] font-dm-sans">{errors.category}</span>}
        </div>
        <div>
          <label className="text-text-secondary text-[13px] font-dm-sans font-medium block mb-2">¿Quién pagó?</label>
          <div className="flex gap-2">
            {members.map((m) => (
              <button key={m.id} onClick={() => { setWho(m.id); setErrors({}); }}
                className={`flex-1 py-2 rounded-btn border text-[13px] font-dm-sans transition-colors ${who === m.id ? "border-jorge text-jorge bg-jorge/10" : "border-surface-2 text-text-secondary"}`}>
                {m.name || m.role}
              </button>
            ))}
          </div>
          {errors.who && <span className="text-coral text-[12px] font-dm-sans">{errors.who}</span>}
        </div>
        <Button className="w-full mt-1" loading={saving} onClick={submit}>Guardar</Button>
      </div>
    </Dialog>
  );
}
