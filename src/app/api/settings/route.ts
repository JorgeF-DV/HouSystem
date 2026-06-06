import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { getSettings, updateSettings } from "@/lib/services/profile-service";
import type { SettingsResponse, SettingsUpdateResponse } from "@/types/api";

export async function GET() {
  try {
    const user = await requireAuth();
    const result = await getSettings(user.id);
    return apiSuccess<SettingsResponse>(result);
  } catch (error) {
    return handleApiError(error, "settings");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const result = await updateSettings(user.id, body);
    return apiSuccess<SettingsUpdateResponse>(result);
  } catch (error) {
    return handleApiError(error, "settings");
  }
}
