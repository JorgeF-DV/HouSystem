import { requirePartnerAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { getRecommendations } from "@/lib/services/plans-service";
import type { RecommendationsListResponse } from "@/types/api";

export async function GET() {
  try {
    const user = await requirePartnerAuth();
    const result = await getRecommendations(user.partnerId, user.id);
    return apiSuccess<RecommendationsListResponse>(result);
  } catch (error) {
    return handleApiError(error, "recommendations");
  }
}
