import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import { getRouteId } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const id = getRouteId(new URL(req.url));

    const notification = await prisma.notification.findFirst({ where: { id, userId: user.id } });
    if (!notification) return apiError("Notificación no encontrada", 404);

    await prisma.notification.update({ where: { id }, data: { unread: false } });

    return apiSuccess({ message: "Notificación leída" });
  } catch (error) {
    return handleApiError(error, "notifications/[id]");
  }
}
