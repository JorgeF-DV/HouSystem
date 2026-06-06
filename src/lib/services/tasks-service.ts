import { prisma } from "@/lib/db";
import { InputError, NotFoundError, getOwnedResource } from "@/lib/db-utils";
import { getWeekStart } from "@/lib/utils";
import type { $Enums } from "@/generated/prisma/client";
import type { TasksListResponse, TaskCreateResponse, MessageResponse } from "@/types/api";

type TaskWithAssignee = Awaited<ReturnType<typeof prisma.task.findMany>>[number];

export async function getTasks(partnerId: string) {
  const weekStart = getWeekStart();
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const tasks = await prisma.task.findMany({
    where: {
      partnerId,
      weekStart: { gte: weekStart, lt: weekEnd },
    },
    include: { assignee: { select: { id: true, name: true, role: true } } },
    orderBy: { createdAt: "asc" },
  });

  const available = tasks.filter((t: TaskWithAssignee) => t.status === "available");
  const inProgress = tasks.filter((t: TaskWithAssignee) => t.status === "in_progress");
  const completed = tasks.filter((t: TaskWithAssignee) => t.status === "completed");

  return { available, inProgress, completed, weekStart: weekStart.toISOString() } satisfies TasksListResponse;
}

export async function createTask(partnerId: string, data: { name: string; duration?: string; frequency?: string }) {
  const { name, duration, frequency } = data;
  if (!name?.trim()) throw new InputError("El nombre es obligatorio");

  const task = await prisma.task.create({
    data: {
      partnerId,
      name: name.trim(),
      duration: duration ?? "",
      frequency: (frequency ?? "semanal") as $Enums.TaskFrequency,
      weekStart: getWeekStart(),
    },
  });

  return { task } satisfies TaskCreateResponse;
}

export async function updateTask(partnerId: string, id: string, data: { name?: string; duration?: string; frequency?: string }) {
  if (!id) throw new InputError("ID de tarea requerido");
  await getOwnedResource(prisma.task, id, partnerId);
  await prisma.task.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.duration !== undefined && { duration: data.duration }),
      ...(data.frequency !== undefined && { frequency: data.frequency as $Enums.TaskFrequency }),
    },
  });
  return { message: "Tarea actualizada" } satisfies MessageResponse;
}

export async function deleteTask(partnerId: string, id: string) {
  if (!id) throw new InputError("ID de tarea requerido");
  await getOwnedResource(prisma.task, id, partnerId);
  await prisma.task.delete({ where: { id } });
  return { message: "Tarea eliminada" } satisfies MessageResponse;
}

export async function completeTask(partnerId: string, id: string) {
  const task = await prisma.task.findFirst({ where: { id, partnerId, status: "in_progress" } });
  if (!task) throw new NotFoundError("Tarea no está en progreso");
  await prisma.task.update({ where: { id }, data: { status: "completed", completedAt: new Date() } });
  return { message: "Tarea completada" } satisfies MessageResponse;
}

export async function reopenTask(partnerId: string, id: string) {
  const task = await prisma.task.findFirst({ where: { id, partnerId, status: "completed" } });
  if (!task) throw new NotFoundError("Tarea no completada");
  await prisma.task.update({ where: { id }, data: { status: "available", assignedTo: null, completedAt: null } });
  return { message: "Tarea reabierta" } satisfies MessageResponse;
}

export async function takeTask(partnerId: string, userId: string, id: string) {
  const task = await prisma.task.findFirst({ where: { id, partnerId, status: "available" } });
  if (!task) throw new NotFoundError("Tarea no disponible");
  await prisma.task.update({ where: { id }, data: { status: "in_progress", assignedTo: userId } });
  return { message: "Tarea tomada" } satisfies MessageResponse;
}
