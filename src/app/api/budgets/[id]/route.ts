import { NextRequest } from "next/server";
import { requirePartnerAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { handleApiError } from "@/lib/api-utils";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requirePartnerAuth();
    const { id } = await params;

    const budget = await prisma.budgetCategory.findFirst({
      where: { id, partnerId: user.partnerId },
    });
    if (!budget) return Response.json({ error: "No encontrado" }, { status: 404 });

    await prisma.budgetCategory.delete({ where: { id } });
    return Response.json({ message: "Eliminado" });
  } catch (error) {
    return handleApiError(error, "budget delete");
  }
}
