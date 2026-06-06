import { requirePartnerAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import type { RecommendationsListResponse } from "@/types/api";

export async function GET() {
  try {
    const user = await requirePartnerAuth();

    const preferences = await prisma.userPreferences.findUnique({ where: { userId: user.id } });
    if (!preferences) return apiSuccess<RecommendationsListResponse>({ recommendations: [] });

    const recommendations = await prisma.recommendation.findMany({
      where: { partnerId: user.partnerId },
      orderBy: { match: "desc" },
      take: 10,
    });

    return apiSuccess<RecommendationsListResponse>({ recommendations });
  } catch (error) {
    return handleApiError(error, "recommendations");
  }
}
