import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import type { Prisma } from "@/generated/prisma/client";
import type { MessageResponse } from "@/types/api";

export async function POST() {
  try {
    const user = await requireAuth();
    if (!user.partnerId) return apiError("No tenés pareja vinculada");

    const partnerId = user.partnerId;

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.user.updateMany({ where: { partnerId }, data: { partnerId: null } });
      await tx.partner.delete({ where: { id: partnerId } });
    });

    return apiSuccess<MessageResponse>({ message: "Pareja desvinculada" });
  } catch (error) {
    return handleApiError(error, "partner/unlink");
  }
}
