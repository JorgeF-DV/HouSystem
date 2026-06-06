import { NextRequest } from "next/server";
import { requirePartnerAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { getGoals, createGoal } from "@/lib/services/goals-service";
import type { GoalsListResponse, GoalCreateResponse } from "@/types/api";

export async function GET() {
  try {
    const user = await requirePartnerAuth();
    const result = await getGoals(user.partnerId);
    return apiSuccess<GoalsListResponse>(result);
  } catch (error) {
    return handleApiError(error, "goals");
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requirePartnerAuth();
    const body = await req.json();
    const result = await createGoal(user.partnerId, user.id, body);
    return apiSuccess<GoalCreateResponse>(result, 201);
  } catch (error) {
    return handleApiError(error, "goals");
  }
}
