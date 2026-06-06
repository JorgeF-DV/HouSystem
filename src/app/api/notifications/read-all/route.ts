import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import type { MessageResponse } from "@/types/api";

export async function POST() {
  try {
    const user = await requireAuth();

    await prisma.notification.updateMany({
      where: { userId: user.id },
      data: { unread: false },
    });

    return apiSuccess<MessageResponse>({ message: "Todas marcadas como leídas" });
  } catch (error) {
    return handleApiError(error, "notifications/read-all");
  }
}
