import { NextRequest } from "next/server";
import { requirePartnerAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import type { Prisma } from "@/generated/prisma/client";
import { getRouteId } from "@/lib/utils";
import { getOwnedResource } from "@/lib/db-utils";

type GoalWithContribs = Prisma.GoalGetPayload<{ include: { contributions: { include: { contributedBy: { select: { id: true; name: true; role: true } } } } } }>;

export async function GET(req: Request) {
  try {
    const user = await requirePartnerAuth();
    const id = getRouteId(new URL(req.url));

    const goal = await prisma.goal.findFirst({
      where: { id, partnerId: user.partnerId },
      include: { contributions: { include: { contributedBy: { select: { id: true, name: true, role: true } } }, orderBy: { date: "desc" } } },
    });

    if (!goal) return apiError("Meta no encontrada", 404);

    const saved = (goal as GoalWithContribs).contributions.reduce((s: number, c: { amount: number }) => s + c.amount, 0);
    return apiSuccess({ ...goal, saved });
  } catch (error) {
    return handleApiError(error, "goals/[id]");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requirePartnerAuth();
    const id = getRouteId(new URL(req.url));

    const { name, price, platform, link } = await req.json();

    await getOwnedResource(prisma.goal, id, user.partnerId);

    await prisma.goal.update({
      where: { id },
      data: { name, price, platform, link },
    });

    return apiSuccess({ message: "Meta actualizada" });
  } catch (error) {
    return handleApiError(error, "goals/[id]");
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await requirePartnerAuth();
    const id = getRouteId(new URL(req.url));

    await getOwnedResource(prisma.goal, id, user.partnerId);

    await prisma.goal.delete({ where: { id } });
    return apiSuccess({ message: "Meta eliminada" });
  } catch (error) {
    return handleApiError(error, "goals/[id]");
  }
}
