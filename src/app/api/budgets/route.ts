import { NextRequest } from "next/server";
import { requirePartnerAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";

export async function GET(req: Request) {
  try {
    const user = await requirePartnerAuth();

    const url = new URL(req.url);
    const month = parseInt(url.searchParams.get("month") ?? String(new Date().getMonth()));
    const year = parseInt(url.searchParams.get("year") ?? String(new Date().getFullYear()));

    const budgets = await prisma.budgetCategory.findMany({
      where: { partnerId: user.partnerId, month, year },
    });

    return apiSuccess({ budgets });
  } catch (error) {
    return handleApiError(error, "budgets");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requirePartnerAuth();

    const { categories, month, year } = await req.json();
    if (!Array.isArray(categories)) return apiError("Formato inválido");

    const partnerId = user.partnerId;
    const m = month ?? new Date().getMonth();
    const y = year ?? new Date().getFullYear();

    await prisma.$transaction(
      categories.map((cat: { name: string; icon?: string; budget: number }) =>
        prisma.budgetCategory.upsert({
          where: {
            partnerId_name_month_year: { partnerId, name: cat.name, month: m, year: y },
          },
          create: {
            partnerId, name: cat.name, icon: cat.icon ?? "📦", budget: cat.budget, month: m, year: y,
          },
          update: { budget: cat.budget },
        })
      )
    );

    return apiSuccess({ message: "Presupuestos guardados" });
  } catch (error) {
    return handleApiError(error, "budgets");
  }
}
