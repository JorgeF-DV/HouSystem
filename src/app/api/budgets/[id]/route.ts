import { NextRequest } from "next/server";
import { requirePartnerAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import type { MessageResponse } from "@/types/api";
import { getOwnedResource } from "@/lib/db-utils";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requirePartnerAuth();
    const { id } = await params;

    await getOwnedResource(prisma.budgetCategory, id, user.partnerId);

    await prisma.budgetCategory.delete({ where: { id } });
    return apiSuccess<MessageResponse>({ message: "Eliminado" });
  } catch (error) {
    return handleApiError(error, "budget delete");
  }
}
