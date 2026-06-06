import { NextRequest } from "next/server";
import { requirePartnerAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { deleteIncome } from "@/lib/services/finance-service";
import type { MessageResponse } from "@/types/api";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requirePartnerAuth();
    const { id } = await params;
    const result = await deleteIncome(user.partnerId, id);
    return apiSuccess<MessageResponse>(result);
  } catch (error) {
    return handleApiError(error, "incomes/[id]");
  }
}
