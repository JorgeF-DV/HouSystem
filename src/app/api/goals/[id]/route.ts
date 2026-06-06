import { NextRequest } from "next/server";
import { requirePartnerAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import type { GoalDetailResponse, MessageResponse } from "@/types/api";
import { getRouteId } from "@/lib/utils";
import { getGoal, updateGoal, deleteGoal } from "@/lib/services/goals-service";

export async function GET(req: Request) {
  try {
    const user = await requirePartnerAuth();
    const id = getRouteId(new URL(req.url));
    const result = await getGoal(user.partnerId, id);
    return apiSuccess<GoalDetailResponse>(result);
  } catch (error) {
    return handleApiError(error, "goals/[id]");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requirePartnerAuth();
    const id = getRouteId(new URL(req.url));
    const body = await req.json();
    const result = await updateGoal(user.partnerId, id, body);
    return apiSuccess<MessageResponse>(result);
  } catch (error) {
    return handleApiError(error, "goals/[id]");
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await requirePartnerAuth();
    const id = getRouteId(new URL(req.url));
    const result = await deleteGoal(user.partnerId, id);
    return apiSuccess<MessageResponse>(result);
  } catch (error) {
    return handleApiError(error, "goals/[id]");
  }
}
