import { requireAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { markAllNotificationsRead } from "@/lib/services/profile-service";
import type { MessageResponse } from "@/types/api";

export async function POST() {
  try {
    const user = await requireAuth();
    const result = await markAllNotificationsRead(user.id);
    return apiSuccess<MessageResponse>(result);
  } catch (error) {
    return handleApiError(error, "notifications/read-all");
  }
}
