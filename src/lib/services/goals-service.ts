import { prisma } from "@/lib/db";
import { InputError, NotFoundError, getOwnedResource } from "@/lib/db-utils";
import type { Prisma } from "@/generated/prisma/client";
import type { GoalsListResponse, GoalCreateResponse, GoalDetailResponse, GoalContributionsListResponse, GoalContributionCreateResponse, MessageResponse } from "@/types/api";

type GoalWithContrib = Prisma.GoalGetPayload<{ include: { contributions: true } }>;

export async function getGoals(partnerId: string) {
  const goals = await prisma.goal.findMany({
    where: { partnerId },
    include: { contributions: true },
    orderBy: { createdAt: "desc" },
  });

  const result = (goals as GoalWithContrib[]).map((g) => ({
    ...g,
    saved: g.contributions.reduce((s: number, c: { amount: number }) => s + c.amount, 0),
    contributionCount: g.contributions.length,
  }));

  return { goals: result } satisfies GoalsListResponse;
}

export async function createGoal(partnerId: string, userId: string, data: { name: string; price: number; platform?: string; link?: string | null; initialAmount?: number }) {
  const { name, price, platform, link, initialAmount } = data;
  if (!name?.trim()) throw new InputError("El nombre es obligatorio");
  if (!price || price <= 0) throw new InputError("El precio debe ser mayor a 0");

  const goal = await prisma.goal.create({
    data: {
      partnerId,
      name: name.trim(),
      price: Math.round(price),
      platform: platform ?? "Otra",
      link: link ?? null,
    },
  });

  if (initialAmount && initialAmount > 0) {
    await prisma.goalContribution.create({
      data: {
        goalId: goal.id,
        contributedById: userId,
        amount: Math.round(initialAmount),
      },
    });
  }

  return { goal } satisfies GoalCreateResponse;
}

type GoalWithContribs = Prisma.GoalGetPayload<{
  include: { contributions: { include: { contributedBy: { select: { id: true; name: true; role: true } } } } };
}>;

export async function getGoal(partnerId: string, id: string) {
  const goal = await prisma.goal.findFirst({
    where: { id, partnerId },
    include: { contributions: { include: { contributedBy: { select: { id: true, name: true, role: true } } }, orderBy: { date: "desc" } } },
  });

  if (!goal) throw new NotFoundError("Meta no encontrada");

  const saved = (goal as GoalWithContribs).contributions.reduce((s: number, c: { amount: number }) => s + c.amount, 0);
  return { ...goal, saved } satisfies GoalDetailResponse;
}

export async function updateGoal(partnerId: string, id: string, data: { name?: string; price?: number; platform?: string; link?: string | null }) {
  await getOwnedResource(prisma.goal, id, partnerId);
  await prisma.goal.update({ where: { id }, data });
  return { message: "Meta actualizada" } satisfies MessageResponse;
}

export async function deleteGoal(partnerId: string, id: string) {
  await getOwnedResource(prisma.goal, id, partnerId);
  await prisma.goal.delete({ where: { id } });
  return { message: "Meta eliminada" } satisfies MessageResponse;
}

export async function getGoalContributions(partnerId: string, goalId: string) {
  const goal = await prisma.goal.findFirst({ where: { id: goalId, partnerId } });
  if (!goal) throw new NotFoundError("Meta no encontrada");

  const contributions = await prisma.goalContribution.findMany({
    where: { goalId },
    include: { contributedBy: { select: { id: true, name: true, role: true } } },
    orderBy: { date: "desc" },
  });

  return { contributions } satisfies GoalContributionsListResponse;
}

export async function createGoalContribution(partnerId: string, userId: string, goalId: string, data: { amount: number; contributedById?: string }) {
  const goal = await prisma.goal.findFirst({ where: { id: goalId, partnerId } });
  if (!goal) throw new NotFoundError("Meta no encontrada");

  const { amount, contributedById } = data;
  if (!amount || amount <= 0) throw new InputError("El monto debe ser mayor a 0");

  const contribution = await prisma.goalContribution.create({
    data: { goalId, contributedById: contributedById ?? userId, amount: Math.round(amount) },
  });

  return { contribution } satisfies GoalContributionCreateResponse;
}
