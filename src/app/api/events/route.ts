import { NextRequest } from "next/server";
import { requirePartnerAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import type { EventsListResponse, EventCreateResponse } from "@/types/api";

export async function GET() {
  try {
    const user = await requirePartnerAuth();

    const events = await prisma.event.findMany({
      where: { partnerId: user.partnerId },
      orderBy: { date: "asc" },
    });

    return apiSuccess<EventsListResponse>({ events });
  } catch (error) {
    return handleApiError(error, "events");
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requirePartnerAuth();

    const { name, date, time, location, price, description } = await req.json();
    if (!name?.trim()) return apiError("El nombre es obligatorio");

    const event = await prisma.event.create({
      data: {
        partnerId: user.partnerId,
        name: name.trim(),
        date: date ?? "",
        time: time ?? null,
        location: location ?? null,
        price: price ?? null,
        description: description ?? null,
        createdById: user.id,
      },
    });

    return apiSuccess<EventCreateResponse>({ event }, 201);
  } catch (error) {
    return handleApiError(error, "events");
  }
}
