import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { getRecommendationPreferences, updateRecommendationPreferences } from "@/lib/services/plans-service";
import type { PreferencesResponse, PreferencesUpdateResponse } from "@/types/api";

export async function GET() {
  try {
    const user = await requireAuth();
    const result = await getRecommendationPreferences(user.id);
    return apiSuccess<PreferencesResponse>(result);
  } catch (error) {
    return handleApiError(error, "preferences");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const result = await updateRecommendationPreferences(user.id, body);
    return apiSuccess<PreferencesUpdateResponse>(result);
  } catch (error) {
    return handleApiError(error, "preferences");
  }
}
