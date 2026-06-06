import { NextRequest } from "next/server";
import { requirePartnerAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { getGoalContributions, createGoalContribution } from "@/lib/services/goals-service";
import type { GoalContributionsListResponse, GoalContributionCreateResponse } from "@/types/api";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requirePartnerAuth();
    const { id: goalId } = await params;
    const result = await getGoalContributions(user.partnerId, goalId);
    return apiSuccess<GoalContributionsListResponse>(result);
  } catch (error) {
    return handleApiError(error, "goals/contributions");
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requirePartnerAuth();
    const { id: goalId } = await params;
    const body = await req.json();
    const result = await createGoalContribution(user.partnerId, user.id, goalId, body);
    return apiSuccess<GoalContributionCreateResponse>(result, 201);
  } catch (error) {
    return handleApiError(error, "goals/contributions");
  }
}
