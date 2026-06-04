import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, handleApiError } from "@/lib/api-utils";

export async function GET() {
  try {
    const user = await requireAuth();

    const result: Record<string, unknown> = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    if (user.partnerId) {
      const partner = await prisma.partner.findUnique({
        where: { id: user.partnerId },
        include: { users: { select: { id: true, name: true, role: true } } },
      });
      result.partner = partner;
    }

    return apiSuccess(result);
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

    return apiSuccess({ message: "Perfil actualizado" });
  } catch (error) {
    return handleApiError(error, "profile");
  }
}
