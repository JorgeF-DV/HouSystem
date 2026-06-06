import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import type { ProfileResponse, MessageResponse } from "@/types/api";

export async function GET() {
  try {
    const user = await requireAuth();

    let partner = null;
    if (user.partnerId) {
      partner = await prisma.partner.findUnique({
        where: { id: user.partnerId },
        include: { users: { select: { id: true, name: true, role: true } } },
      });
    }

    return apiSuccess<ProfileResponse>({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      partnerId: user.partnerId,
      partner,
    });
  } catch (error) {
    return handleApiError(error, "profile");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { name } = await req.json();

    if (name?.trim()) {
      await prisma.user.update({ where: { id: user.id }, data: { name: name.trim() } });
    }

    return apiSuccess<MessageResponse>({ message: "Perfil actualizado" });
  } catch (error) {
    return handleApiError(error, "profile");
  }
}
