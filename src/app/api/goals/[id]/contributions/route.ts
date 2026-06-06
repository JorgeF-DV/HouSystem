import { NextRequest } from "next/server";
import { requirePartnerAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import type { GoalContributionsListResponse, GoalContributionCreateResponse } from "@/types/api";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requirePartnerAuth();
    const { id: goalId } = await params;

    const goal = await prisma.goal.findFirst({ where: { id: goalId, partnerId: user.partnerId } });
    if (!goal) return apiError("Meta no encontrada", 404);

    const contributions = await prisma.goalContribution.findMany({
      where: { goalId },
      include: { contributedBy: { select: { id: true, name: true, role: true } } },
      orderBy: { date: "desc" },
    });

    return apiSuccess<GoalContributionsListResponse>({ contributions });
  } catch (error) {
    return handleApiError(error, "goals/contributions");
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requirePartnerAuth();
    const { id: goalId } = await params;

    const goal = await prisma.goal.findFirst({ where: { id: goalId, partnerId: user.partnerId } });
    if (!goal) return apiError("Meta no encontrada", 404);

    const { amount, contributedById } = await req.json();
    if (!amount || amount <= 0) return apiError("El monto debe ser mayor a 0");

    const contribution = await prisma.goalContribution.create({
      data: { goalId, contributedById: contributedById ?? user.id, amount: Math.round(amount) },
    });

    return apiSuccess<GoalContributionCreateResponse>({ contribution }, 201);
  } catch (error) {
    return handleApiError(error, "goals/contributions");
  }
}
