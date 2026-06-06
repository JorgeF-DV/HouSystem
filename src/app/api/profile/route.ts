import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { getProfile, updateProfile } from "@/lib/services/profile-service";
import type { ProfileResponse, MessageResponse } from "@/types/api";

export async function GET() {
  try {
    const user = await requireAuth();
    const result = await getProfile(user.id);
    return apiSuccess<ProfileResponse>(result);
  } catch (error) {
    return handleApiError(error, "profile");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const result = await updateProfile(user.id, body);
    return apiSuccess<MessageResponse>(result);
  } catch (error) {
    return handleApiError(error, "profile");
  }
}
