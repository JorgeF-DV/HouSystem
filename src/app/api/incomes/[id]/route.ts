import { NextRequest } from "next/server";
import { requirePartnerAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requirePartnerAuth();
    const { id } = await params;

    const income = await prisma.income.findFirst({ where: { id, partnerId: user.partnerId } });
    if (!income) return apiError("Ingreso no encontrado", 404);

    await prisma.income.delete({ where: { id } });

    return apiSuccess({ message: "Ingreso eliminado" });
  } catch (error) {
    return handleApiError(error, "incomes/[id]");
  }
}
