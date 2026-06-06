import { requireAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { getNotifications } from "@/lib/services/profile-service";
import type { NotificationsListResponse } from "@/types/api";

export async function GET() {
  try {
    const user = await requireAuth();
    const result = await getNotifications(user.id);
    return apiSuccess<NotificationsListResponse>(result);
  } catch (error) {
    return handleApiError(error, "notifications");
  }
}
