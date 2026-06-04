import { NextRequest } from "next/server";
import { requirePartnerAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import { getWeekStart } from "@/lib/utils";

type TaskWithAssignee = Awaited<ReturnType<typeof prisma.task.findMany>>[number];

export async function GET() {
  try {
    const user = await requirePartnerAuth();

    const weekStart = getWeekStart();
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const tasks = await prisma.task.findMany({
      where: {
        partnerId: user.partnerId,
        weekStart: { gte: weekStart, lt: weekEnd },
      },
      include: { assignee: { select: { id: true, name: true, role: true } } },
      orderBy: { createdAt: "asc" },
    });

    const available = tasks.filter((t: TaskWithAssignee) => t.status === "available");
    const inProgress = tasks.filter((t: TaskWithAssignee) => t.status === "in_progress");
    const completed = tasks.filter((t: TaskWithAssignee) => t.status === "completed");

    return apiSuccess({ available, inProgress, completed, weekStart: weekStart.toISOString() });
  } catch (error) {
    return handleApiError(error, "tasks");
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requirePartnerAuth();

    const { name, duration, frequency } = await req.json();
    if (!name?.trim()) return apiError("El nombre es obligatorio");

    const task = await prisma.task.create({
      data: {
        partnerId: user.partnerId,
        name: name.trim(),
        duration: duration ?? "",
        frequency: frequency ?? "semanal",
        weekStart: getWeekStart(),
      },
    });

    return apiSuccess({ task }, 201);
  } catch (error) {
    return handleApiError(error, "tasks");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requirePartnerAuth();

    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return apiError("ID de tarea requerido");

    const { name, duration, frequency } = await req.json();
    const task = await prisma.task.findFirst({ where: { id, partnerId: user.partnerId } });
    if (!task) return apiError("Tarea no encontrada", 404);

    await prisma.task.update({ where: { id }, data: { name, duration, frequency } });
    return apiSuccess({ message: "Tarea actualizada" });
  } catch (error) {
    return handleApiError(error, "tasks");
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await requirePartnerAuth();

    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return apiError("ID de tarea requerido");

    const task = await prisma.task.findFirst({ where: { id, partnerId: user.partnerId } });
    if (!task) return apiError("Tarea no encontrada", 404);

    await prisma.task.delete({ where: { id } });
    return apiSuccess({ message: "Tarea eliminada" });
  } catch (error) {
    return handleApiError(error, "tasks");
  }
}
