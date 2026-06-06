import { NextRequest } from "next/server";
import { requirePartnerAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import type { MessageResponse } from "@/types/api";
import { getRouteId } from "@/lib/utils";
import { updateExpense, deleteExpense } from "@/lib/services/finance-service";

export async function PUT(req: NextRequest) {
  try {
    const user = await requirePartnerAuth();
    const id = getRouteId(new URL(req.url));
    const body = await req.json();
    const result = await updateExpense(user.partnerId, id, body);
    return apiSuccess<MessageResponse>(result);
  } catch (error) {
    return handleApiError(error, "expenses/[id]");
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await requirePartnerAuth();
    const id = getRouteId(new URL(req.url));
    const result = await deleteExpense(user.partnerId, id);
    return apiSuccess<MessageResponse>(result);
  } catch (error) {
    return handleApiError(error, "expenses/[id]");
  }
}
