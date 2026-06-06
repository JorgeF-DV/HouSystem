import { requireAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import type { MessageResponse } from "@/types/api";

export async function POST() {
  try {
    await requireAuth();
    return apiSuccess<MessageResponse>({ message: "Caché limpiado" });
  } catch (error) {
    return handleApiError(error, "settings/clear-cache");
  }
}
