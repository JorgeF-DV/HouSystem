import { NextRequest } from "next/server";
import { requirePartnerAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import type { Prisma } from "@/generated/prisma/client";
import type { GoalsListResponse, GoalCreateResponse } from "@/types/api";

type GoalWithContrib = Prisma.GoalGetPayload<{ include: { contributions: true } }>;

export async function GET() {
  try {
    const user = await requirePartnerAuth();

    const goals = await prisma.goal.findMany({
      where: { partnerId: user.partnerId },
      include: { contributions: true },
      orderBy: { createdAt: "desc" },
    });

    const result = (goals as GoalWithContrib[]).map((g) => ({
      ...g,
      saved: g.contributions.reduce((s: number, c: { amount: number }) => s + c.amount, 0),
      contributionCount: g.contributions.length,
    }));

    return apiSuccess<GoalsListResponse>({ goals: result });
  } catch (error) {
    return handleApiError(error, "goals");
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requirePartnerAuth();

    const { name, price, platform, link, initialAmount } = await req.json();
    if (!name?.trim()) return apiError("El nombre es obligatorio");
    if (!price || price <= 0) return apiError("El precio debe ser mayor a 0");

    const goal = await prisma.goal.create({
      data: {
        partnerId: user.partnerId,
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
          contributedById: user.id,
          amount: Math.round(initialAmount),
        },
      });
    }

    return apiSuccess<GoalCreateResponse>({ goal }, 201);
  } catch (error) {
    return handleApiError(error, "goals");
  }
}
