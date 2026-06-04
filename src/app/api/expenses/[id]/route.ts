import { NextRequest } from "next/server";
import { requirePartnerAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import { getRouteId } from "@/lib/utils";

export async function PUT(req: NextRequest) {
  try {
    const user = await requirePartnerAuth();
    const id = getRouteId(new URL(req.url));

    const expense = await prisma.expense.findFirst({ where: { id, partnerId: user.partnerId } });
    if (!expense) return apiError("Gasto no encontrado", 404);

    const { amount, description, categoryName } = await req.json();
    await prisma.expense.update({
      where: { id },
      data: { amount: amount ?? expense.amount, description: description ?? expense.description, categoryName: categoryName ?? expense.categoryName },
    });

    return apiSuccess({ message: "Gasto actualizado" });
  } catch (error) {
    return handleApiError(error, "expenses/[id]");
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await requirePartnerAuth();
    const id = getRouteId(new URL(req.url));

    const expense = await prisma.expense.findFirst({ where: { id, partnerId: user.partnerId } });
    if (!expense) return apiError("Gasto no encontrado", 404);

    await prisma.expense.delete({ where: { id } });

    return apiSuccess({ message: "Gasto eliminado" });
  } catch (error) {
    return handleApiError(error, "expenses/[id]");
  }
}
