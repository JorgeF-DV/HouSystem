import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, handleApiError } from "@/lib/api-utils";

export async function POST() {
  try {
    const user = await requireAuth();

    await prisma.notification.updateMany({
      where: { userId: user.id },
      data: { unread: false },
    });

    return apiSuccess({ message: "Todas marcadas como leídas" });
  } catch (error) {
    return handleApiError(error, "notifications/read-all");
  }
}
