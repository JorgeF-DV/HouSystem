import { NextRequest } from "next/server";
import { requirePartnerAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { getBudgets, upsertBudgets } from "@/lib/services/finance-service";
import type { BudgetsListResponse } from "@/types/api";

export async function GET(req: Request) {
  try {
    const user = await requirePartnerAuth();

    const url = new URL(req.url);
    const month = parseInt(url.searchParams.get("month") ?? String(new Date().getMonth()));
    const year = parseInt(url.searchParams.get("year") ?? String(new Date().getFullYear()));

    const result = await getBudgets(user.partnerId, month, year);
    return apiSuccess<BudgetsListResponse>(result);
  } catch (error) {
    return handleApiError(error, "budgets");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requirePartnerAuth();
    const body = await req.json();
    const result = await upsertBudgets(user.partnerId, body);
    return apiSuccess<BudgetsListResponse>(result);
  } catch (error) {
    return handleApiError(error, "budgets");
  }
}
