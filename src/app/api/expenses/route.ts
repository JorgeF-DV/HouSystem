import { NextRequest } from "next/server";
import { requirePartnerAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import type { ExpensesListResponse, ExpenseCreateResponse } from "@/types/api";

type ExpenseEntry = Awaited<ReturnType<typeof prisma.expense.findMany>>[number];

export async function GET(req: Request) {
  try {
    const user = await requirePartnerAuth();

    const url = new URL(req.url);
    const month = parseInt(url.searchParams.get("month") ?? String(new Date().getMonth()));
    const year = parseInt(url.searchParams.get("year") ?? String(new Date().getFullYear()));

    const expenses = await prisma.expense.findMany({
      where: { partnerId: user.partnerId },
      include: { paidBy: { select: { id: true, name: true, role: true } } },
      orderBy: { date: "desc" },
    });

    const filtered = expenses.filter((e: ExpenseEntry) => {
      const d = new Date(e.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });

    const grouped: Record<string, typeof filtered> = {};
    for (const exp of filtered) {
      const day = new Date(exp.date).toLocaleDateString("es-AR", { day: "numeric", month: "long" });
      if (!grouped[day]) grouped[day] = [];
      grouped[day].push(exp);
    }

    return apiSuccess<ExpensesListResponse>({ expenses: grouped, total: filtered.reduce((s: number, e: ExpenseEntry) => s + e.amount, 0) });
  } catch (error) {
    return handleApiError(error, "expenses");
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requirePartnerAuth();

    const { amount, description, categoryName, paidById } = await req.json();
    if (!amount || amount <= 0 || !categoryName || !paidById) {
      return apiError("Todos los campos son obligatorios");
    }

    const expense = await prisma.expense.create({
      data: {
        partnerId: user.partnerId,
        amount: Math.round(amount),
        description: description ?? "",
        categoryName,
        paidById,
        date: new Date(),
      },
    });

    return apiSuccess<ExpenseCreateResponse>({ expense }, 201);
  } catch (error) {
    return handleApiError(error, "expenses");
  }
}
