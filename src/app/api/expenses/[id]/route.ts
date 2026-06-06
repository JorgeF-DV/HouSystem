import { NextRequest } from "next/server";
import { requirePartnerAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import type { MessageResponse } from "@/types/api";
import { getRouteId } from "@/lib/utils";
import { getOwnedResource } from "@/lib/db-utils";

export async function PUT(req: NextRequest) {
  try {
    const user = await requirePartnerAuth();
    const id = getRouteId(new URL(req.url));

    const expense = await getOwnedResource(prisma.expense, id, user.partnerId);

    const { amount, description, categoryName } = await req.json();
    await prisma.expense.update({
      where: { id },
      data: { amount: amount ?? expense.amount, description: description ?? expense.description, categoryName: categoryName ?? expense.categoryName },
    });

    return apiSuccess<MessageResponse>({ message: "Gasto actualizado" });
  } catch (error) {
    return handleApiError(error, "expenses/[id]");
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await requirePartnerAuth();
    const id = getRouteId(new URL(req.url));

    await getOwnedResource(prisma.expense, id, user.partnerId);

    await prisma.expense.delete({ where: { id } });

    return apiSuccess<MessageResponse>({ message: "Gasto eliminado" });
  } catch (error) {
    return handleApiError(error, "expenses/[id]");
  }
}
