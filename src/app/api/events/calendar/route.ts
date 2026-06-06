import { requirePartnerAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { getCalendarEvents } from "@/lib/services/plans-service";
import type { CalendarEventsResponse } from "@/types/api";

export async function GET() {
  try {
    const user = await requirePartnerAuth();
    const result = await getCalendarEvents(user.partnerId);
    return apiSuccess<CalendarEventsResponse>(result);
  } catch (error) {
    return handleApiError(error, "events/calendar");
  }
}
