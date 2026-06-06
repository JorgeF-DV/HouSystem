import { requirePartnerAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import { getRouteId } from "@/lib/utils";
import type { EventCreateResponse } from "@/types/api";

export async function POST(req: Request) {
  try {
    const user = await requirePartnerAuth();
    const id = getRouteId(new URL(req.url));

    const recommendation = await prisma.recommendation.findFirst({
      where: { id, partnerId: user.partnerId },
    });

    if (!recommendation) return apiError("Recomendación no encontrada", 404);

    const event = await prisma.event.create({
      data: {
        partnerId: user.partnerId,
        name: recommendation.name,
        date: recommendation.date,
        price: recommendation.price,
        createdById: user.id,
      },
    });

    return apiSuccess<EventCreateResponse>({ event }, 201);
  } catch (error) {
    return handleApiError(error, "recommendations/save");
  }
}
