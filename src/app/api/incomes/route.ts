import { NextRequest } from "next/server";
import { requirePartnerAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { getIncomes, createIncome } from "@/lib/services/finance-service";
import type { IncomesListResponse, IncomeCreateResponse } from "@/types/api";

export async function GET() {
  try {
    const user = await requirePartnerAuth();
    const result = await getIncomes(user.partnerId);
    return apiSuccess<IncomesListResponse>(result);
  } catch (error) {
    return handleApiError(error, "incomes");
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requirePartnerAuth();
    const body = await req.json();
    const result = await createIncome(user.partnerId, user.id, body);
    return apiSuccess<IncomeCreateResponse>(result, 201);
  } catch (error) {
    return handleApiError(error, "incomes");
  }
}
