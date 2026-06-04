"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency } from "@/lib/utils";
import { IconArrowLeft, IconFilter, IconTrash } from "@tabler/icons-react";

type ExpenseItem = {
  id: string; amount: number; description: string; categoryName: string; paidBy: { id: string; name: string; role: string }; date: string;
};

export default function HistorialPage() {
  const router = useRouter();
  useEffect(() => { document.title = "Historial — HouSystem"; }, []);
  const [grouped, setGrouped] = useState<Record<string, ExpenseItem[]>>({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchExpenses = async () => {
    try {
      const r = await fetch("/api/expenses");
      const d = await r.json();
      if (d.error) { router.push("/login"); return; }
      setGrouped(d.expenses ?? {});
      setTotal(d.total ?? 0);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchExpenses(); }, [router]);

  const deleteExpense = async (id: string) => {
    setDeleting(id);
    try {
      await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      fetchExpenses();
    } catch {} finally { setDeleting(null); }
  };

  if (loading) return <HistorialSkeleton />;

  const entries = Object.entries(grouped);
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 md:px-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/finanzas" className="p-2 -ml-2 hover:bg-surface-1 rounded-btn transition-colors">
          <IconArrowLeft size={20} className="text-text-secondary" />
        </Link>
        <h1 className="font-syne text-[22px] font-medium text-text-primary">Historial</h1>
        <button className="ml-auto p-2 hover:bg-surface-1 rounded-btn transition-colors">
          <IconFilter size={18} className="text-text-secondary" />
        </button>
      </div>

      <div className="py-3 px-4 rounded-btn bg-surface-1 border border-surface-2 mb-6 flex justify-between items-center">
        <span className="font-dm-sans text-[13px] text-text-tertiary">Total del período</span>
        <span className="font-syne text-[18px] font-medium text-text-primary">{formatCurrency(total)}</span>
      </div>

      {entries.length > 0 ? entries.map(([day, items]) => (
        <div key={day} className="mb-6">
          <h3 className="font-dm-sans text-[13px] text-text-tertiary font-medium mb-2 capitalize">{day}</h3>
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-3 px-4 rounded-btn hover:bg-surface-1 transition-colors group">
                <span className="w-8 h-8 flex items-center justify-center text-lg">💳</span>
                <div className="flex-1 min-w-0">
                  <p className="font-dm-sans text-[15px] text-text-primary truncate">{item.description || item.categoryName}</p>
                </div>
                <Avatar user={item.paidBy.role} size={24} />
                <span className="font-dm-sans text-[15px] text-text-primary font-medium min-w-[70px] text-right">{formatCurrency(item.amount)}</span>
                <button onClick={() => deleteExpense(item.id)} disabled={deleting === item.id}
                  className="p-1.5 rounded-btn hover:bg-coral/10 text-text-tertiary hover:text-coral opacity-0 group-hover:opacity-100 transition-all">
                  <IconTrash size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )) : (
        <p className="font-dm-sans text-[13px] text-text-tertiary text-center py-8">No hay gastos registrados.</p>
      )}
    </div>
  );
}

function HistorialSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Skeleton className="h-8 w-32 mb-6" />
      <Skeleton className="h-12 w-full mb-6 rounded-btn" />
      {[1,2,3].map((i) => (
        <div key={i} className="mb-6">
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-16 w-full rounded-btn" />
        </div>
      ))}
    </div>
  );
}
