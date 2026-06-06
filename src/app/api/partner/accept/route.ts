import { requireAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { acceptInvitation } from "@/lib/services/auth-service";
import type { PartnerAcceptResponse } from "@/types/api";

export async function POST() {
  try {
    const user = await requireAuth();
    const result = await acceptInvitation(user.id);
    return apiSuccess<PartnerAcceptResponse>(result);
  } catch (error) {
    return handleApiError(error, "partner/accept");
  }
}
