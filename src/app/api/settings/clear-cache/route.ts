import { requireAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";

export async function POST() {
  try {
    await requireAuth();
    return apiSuccess({ message: "Caché limpiado" });
  } catch (error) {
    return handleApiError(error, "settings/clear-cache");
  }
}
