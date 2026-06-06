import { requireAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { unlinkPartner } from "@/lib/services/auth-service";
import type { MessageResponse } from "@/types/api";

export async function POST() {
  try {
    const user = await requireAuth();
    const result = await unlinkPartner(user.id);
    return apiSuccess<MessageResponse>(result);
  } catch (error) {
    return handleApiError(error, "partner/unlink");
  }
}
