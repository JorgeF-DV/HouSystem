import { requirePartnerAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import type { CalendarEventsResponse } from "@/types/api";

export async function GET() {
  try {
    const user = await requirePartnerAuth();

    const events = await prisma.event.findMany({
      where: { partnerId: user.partnerId },
      select: { id: true, name: true, date: true, time: true },
    });

    return apiSuccess<CalendarEventsResponse>({ events });
  } catch (error) {
    return handleApiError(error, "events/calendar");
  }
}
