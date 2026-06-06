import { NextRequest } from "next/server";
import { requirePartnerAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { getRouteId } from "@/lib/utils";
import { getEvent, updateEvent, deleteEvent } from "@/lib/services/plans-service";
import type { EventDetailResponse, MessageResponse } from "@/types/api";

export async function GET(req: Request) {
  try {
    const user = await requirePartnerAuth();
    const id = getRouteId(new URL(req.url));
    const result = await getEvent(user.partnerId, id);
    return apiSuccess<EventDetailResponse>(result);
  } catch (error) {
    return handleApiError(error, "events/[id]");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requirePartnerAuth();
    const id = getRouteId(new URL(req.url));
    const body = await req.json();
    const result = await updateEvent(user.partnerId, id, body);
    return apiSuccess<MessageResponse>(result);
  } catch (error) {
    return handleApiError(error, "events/[id]");
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await requirePartnerAuth();
    const id = getRouteId(new URL(req.url));
    const result = await deleteEvent(user.partnerId, id);
    return apiSuccess<MessageResponse>(result);
  } catch (error) {
    return handleApiError(error, "events/[id]");
  }
}
