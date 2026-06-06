import { requireAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { clearCache } from "@/lib/services/profile-service";
import type { MessageResponse } from "@/types/api";

export async function POST() {
  try {
    await requireAuth();
    const result = await clearCache();
    return apiSuccess<MessageResponse>(result);
  } catch (error) {
    return handleApiError(error, "settings/clear-cache");
  }
}
