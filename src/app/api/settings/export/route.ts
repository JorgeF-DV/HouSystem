import { requireAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { exportData } from "@/lib/services/profile-service";
import type { MessageResponse } from "@/types/api";

export async function POST() {
  try {
    await requireAuth();
    const result = await exportData();
    return apiSuccess<MessageResponse>(result);
  } catch (error) {
    return handleApiError(error, "settings/export");
  }
}
