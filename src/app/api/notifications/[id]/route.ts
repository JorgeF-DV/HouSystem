import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { getRouteId } from "@/lib/utils";
import { markNotificationRead } from "@/lib/services/profile-service";
import type { MessageResponse } from "@/types/api";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const id = getRouteId(new URL(req.url));
    const result = await markNotificationRead(user.id, id);
    return apiSuccess<MessageResponse>(result);
  } catch (error) {
    return handleApiError(error, "notifications/[id]");
  }
}
