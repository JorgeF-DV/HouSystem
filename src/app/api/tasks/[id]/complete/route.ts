import { requirePartnerAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import { getRouteId } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const user = await requirePartnerAuth();
    const id = getRouteId(new URL(req.url));

    const task = await prisma.task.findFirst({ where: { id, partnerId: user.partnerId, status: "in_progress" } });
    if (!task) return apiError("Tarea no está en progreso", 404);

    await prisma.task.update({ where: { id }, data: { status: "completed", completedAt: new Date() } });

    return apiSuccess({ message: "Tarea completada" });
  } catch (error) {
    return handleApiError(error, "tasks/complete");
  }
}
