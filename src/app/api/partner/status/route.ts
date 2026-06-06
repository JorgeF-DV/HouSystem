import { requireAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { getPartnerStatus } from "@/lib/services/auth-service";
import type { PartnerStatusResponse } from "@/types/api";

export async function GET() {
  try {
    const user = await requireAuth();
    const result = await getPartnerStatus(user.id);
    return apiSuccess<PartnerStatusResponse>(result);
  } catch (error) {
    return handleApiError(error, "partner/status");
  }
}
