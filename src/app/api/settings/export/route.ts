import { requireAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";

export async function POST() {
  try {
    await requireAuth();
    return apiSuccess({ message: "Export no implementado" });
  } catch (error) {
    return handleApiError(error, "settings/export");
  }
}
