import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import type { MessageResponse } from "@/types/api";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { partnerEmail } = await req.json();

    if (!partnerEmail?.trim()) return apiError("Email obligatorio");
    if (user.partnerId) return apiError("Ya tenés una pareja vinculada");

    const partner = await prisma.user.findUnique({ where: { email: partnerEmail } });
    if (!partner) return apiError("No hay usuario con ese email");
    if (partner.id === user.id) return apiError("No podés vincularte con vos mismo");
    if (partner.partnerId) return apiError("Esa persona ya tiene pareja");

    const existingInvitation = await prisma.invitation.findFirst({
      where: { senderId: user.id, receiverId: partner.id, status: "pending" },
    });
    if (existingInvitation) return apiError("Ya enviaste una invitación a esa persona");

    await prisma.invitation.create({
      data: { senderId: user.id, receiverId: partner.id },
    });

    return apiSuccess<MessageResponse>({ message: "Invitación enviada" });
  } catch (error) {
    return handleApiError(error, "partner/invite");
  }
}
