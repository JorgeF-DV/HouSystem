import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { getMe } from "@/lib/services/auth-service";
import type { AuthMeResponse } from "@/types/api";

export async function GET() {
  try {
    const result = await getMe();
    return apiSuccess<AuthMeResponse>(result);
  } catch (error) {
    return handleApiError(error, "auth/me");
  }
}
