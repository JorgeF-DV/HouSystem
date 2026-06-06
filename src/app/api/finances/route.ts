import { requirePartnerAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { getFinancesResume } from "@/lib/services/finance-service";
import type { FinancesResumeResponse } from "@/types/api";

export async function GET(req: Request) {
  try {
    const user = await requirePartnerAuth();

    const url = new URL(req.url);
    const month = parseInt(url.searchParams.get("month") ?? String(new Date().getMonth()));
    const year = parseInt(url.searchParams.get("year") ?? String(new Date().getFullYear()));

    const result = await getFinancesResume(user.partnerId, month, year);
    return apiSuccess<FinancesResumeResponse>(result);
  } catch (error) {
    return handleApiError(error, "finances");
  }
}
