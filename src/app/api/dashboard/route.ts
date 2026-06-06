import { requireAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { getDashboard } from "@/lib/services/finance-service";
import type { DashboardResponse } from "@/types/api";

export async function GET() {
  try {
    const user = await requireAuth();
    const result = await getDashboard(user.id, user.partnerId, user.name);
    return apiSuccess<DashboardResponse>(result);
  } catch (error) {
    return handleApiError(error, "dashboard");
  }
}
