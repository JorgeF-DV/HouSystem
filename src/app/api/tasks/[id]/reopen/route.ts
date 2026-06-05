import { NextRequest } from "next/server";
import { requirePartnerAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requirePartnerAuth();
    const { id } = await params;

    const task = await prisma.task.findFirst({ where: { id, partnerId: user.partnerId, status: "completed" } });
    if (!task) return apiError("Tarea no completada", 404);

    await prisma.task.update({ where: { id }, data: { status: "available", assignedTo: null, completedAt: null } });

    return apiSuccess({ message: "Tarea reabierta" });
  } catch (error) {
    return handleApiError(error, "tasks/reopen");
  }
}
