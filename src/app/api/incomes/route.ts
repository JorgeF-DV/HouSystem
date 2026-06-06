import { NextRequest } from "next/server";
import { requirePartnerAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import type { IncomesListResponse, IncomeCreateResponse } from "@/types/api";

export async function GET() {
  try {
    const user = await requirePartnerAuth();

    const incomes = await prisma.income.findMany({
      where: { partnerId: user.partnerId },
      include: { registeredBy: { select: { id: true, name: true, role: true } } },
      orderBy: { date: "desc" },
    });

    const total = incomes.reduce((s, e) => s + e.amount, 0);

    return apiSuccess<IncomesListResponse>({ incomes, total });
  } catch (error) {
    return handleApiError(error, "incomes");
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requirePartnerAuth();

    const { amount, description } = await req.json();
    if (!amount || amount <= 0) return apiError("El monto debe ser mayor a 0");

    const income = await prisma.income.create({
      data: {
        partnerId: user.partnerId,
        amount: Math.round(amount),
        description: description ?? "",
        registeredById: user.id,
      },
    });

    return apiSuccess<IncomeCreateResponse>({ income }, 201);
  } catch (error) {
    return handleApiError(error, "incomes");
  }
}
