import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import type { Prisma } from "@/generated/prisma/client";

export async function POST() {
  try {
    const user = await requireAuth();
    if (user.partnerId) return apiError("Ya tenés una pareja vinculada");

    const invitation = await prisma.invitation.findFirst({
      where: { receiverId: user.id, status: "pending" },
      include: { sender: true },
    });

    if (!invitation) return apiError("No tenés invitaciones pendientes");

    const partner = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const pair = await tx.partner.create({
        data: {
          users: { connect: [{ id: invitation.senderId }, { id: invitation.receiverId }] },
        },
      });
      await tx.user.update({ where: { id: invitation.senderId }, data: { partnerId: pair.id, role: "jorge" } });
      await tx.user.update({ where: { id: invitation.receiverId }, data: { partnerId: pair.id, role: "lorena" } });
      await tx.invitation.update({ where: { id: invitation.id }, data: { status: "accepted" } });
      return pair;
    });

    return apiSuccess({ partner: partner, message: "Pareja vinculada" });
  } catch (error) {
    return handleApiError(error, "partner/accept");
  }
}
