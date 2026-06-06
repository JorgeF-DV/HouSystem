import { NextRequest } from "next/server";
import { requirePartnerAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { takeTask } from "@/lib/services/tasks-service";
import type { MessageResponse } from "@/types/api";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requirePartnerAuth();
    const { id } = await params;
    const result = await takeTask(user.partnerId, user.id, id);
    return apiSuccess<MessageResponse>(result);
  } catch (error) {
    return handleApiError(error, "tasks/take");
  }
}
