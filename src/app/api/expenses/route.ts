import { NextRequest } from "next/server";
import { requirePartnerAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { getExpenses, createExpense } from "@/lib/services/finance-service";
import type { ExpensesListResponse, ExpenseCreateResponse } from "@/types/api";

export async function GET(req: Request) {
  try {
    const user = await requirePartnerAuth();

    const url = new URL(req.url);
    const month = parseInt(url.searchParams.get("month") ?? String(new Date().getMonth()));
    const year = parseInt(url.searchParams.get("year") ?? String(new Date().getFullYear()));

    const result = await getExpenses(user.partnerId, month, year);
    return apiSuccess<ExpensesListResponse>(result);
  } catch (error) {
    return handleApiError(error, "expenses");
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requirePartnerAuth();
    const body = await req.json();
    const result = await createExpense(user.partnerId, body);
    return apiSuccess<ExpenseCreateResponse>(result, 201);
  } catch (error) {
    return handleApiError(error, "expenses");
  }
}
