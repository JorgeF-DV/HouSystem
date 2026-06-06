import { NextRequest } from "next/server";
import { requirePartnerAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { getEvents, createEvent } from "@/lib/services/plans-service";
import type { EventsListResponse, EventCreateResponse } from "@/types/api";

export async function GET() {
  try {
    const user = await requirePartnerAuth();
    const result = await getEvents(user.partnerId);
    return apiSuccess<EventsListResponse>(result);
  } catch (error) {
    return handleApiError(error, "events");
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requirePartnerAuth();
    const body = await req.json();
    const result = await createEvent(user.partnerId, user.id, body);
    return apiSuccess<EventCreateResponse>(result, 201);
  } catch (error) {
    return handleApiError(error, "events");
  }
}
