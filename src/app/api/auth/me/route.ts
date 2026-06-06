import { getAuthenticatedUser } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { apiError } from "@/lib/api-utils";
import type { AuthMeResponse } from "@/types/api";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return apiError("No autorizado", 401);

    return apiSuccess<AuthMeResponse>({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      partnerId: user.partnerId,
      partner: user.partner,
    });
  } catch (error) {
    return handleApiError(error, "auth/me");
  }
}
