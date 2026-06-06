import { requirePartnerAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { getRouteId } from "@/lib/utils";
import { saveRecommendationAsEvent } from "@/lib/services/plans-service";
import type { EventCreateResponse } from "@/types/api";

export async function POST(req: Request) {
  try {
    const user = await requirePartnerAuth();
    const id = getRouteId(new URL(req.url));
    const result = await saveRecommendationAsEvent(user.partnerId, user.id, id);
    return apiSuccess<EventCreateResponse>(result, 201);
  } catch (error) {
    return handleApiError(error, "recommendations/save");
  }
}
