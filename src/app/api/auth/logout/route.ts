import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { logout } from "@/lib/services/auth-service";
import type { MessageResponse } from "@/types/api";

export async function POST() {
  try {
    const result = await logout();
    return apiSuccess<MessageResponse>(result);
  } catch (error) {
    return handleApiError(error, "auth/logout");
  }
}
