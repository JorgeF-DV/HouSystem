import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";

export async function GET() {
  try {
    const user = await requireAuth();

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return apiSuccess({ notifications });
  } catch (error) {
    return handleApiError(error, "notifications");
  }
}

export async function POST(req: Request) {
  try {
    const user = await requireAuth();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop()!;

    await prisma.notification.update({
      where: { id },
      data: { unread: false },
    });

    return apiSuccess({ message: "Notificación leída" });
  } catch (error) {
    return handleApiError(error, "notifications");
  }
}
