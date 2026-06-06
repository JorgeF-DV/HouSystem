import { NextRequest } from "next/server";
import { requirePartnerAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import type { MessageResponse } from "@/types/api";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requirePartnerAuth();
    const { id } = await params;

    const task = await prisma.task.findFirst({ where: { id, partnerId: user.partnerId, status: "in_progress" } });
    if (!task) return apiError("Tarea no está en progreso", 404);

    await prisma.task.update({ where: { id }, data: { status: "completed", completedAt: new Date() } });

    return apiSuccess<MessageResponse>({ message: "Tarea completada" });
  } catch (error) {
    return handleApiError(error, "tasks/complete");
  }
}
