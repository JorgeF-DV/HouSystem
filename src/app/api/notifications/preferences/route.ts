import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { getNotificationPreferences, updateNotificationPreference } from "@/lib/services/profile-service";
import type { NotificationPreferencesListResponse, MessageResponse } from "@/types/api";

export async function GET() {
  try {
    const user = await requireAuth();
    const result = await getNotificationPreferences(user.id);
    return apiSuccess<NotificationPreferencesListResponse>(result);
  } catch (error) {
    return handleApiError(error, "notifications/preferences");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const result = await updateNotificationPreference(user.id, body);
    return apiSuccess<MessageResponse>(result);
  } catch (error) {
    return handleApiError(error, "notifications/preferences");
  }
}
