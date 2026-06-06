import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import type { NotificationsListResponse } from "@/types/api";

export async function GET() {
  try {
    const user = await requireAuth();

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return apiSuccess<NotificationsListResponse>({ notifications });
  } catch (error) {
    return handleApiError(error, "notifications");
  }
}
