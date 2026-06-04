import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, handleApiError } from "@/lib/api-utils";

const DEFAULT_PREFERENCES = { selectedCategories: [], city: "Buenos Aires", priceRange: "Hasta $50K" };

export async function GET() {
  try {
    const user = await requireAuth();

    const preferences = await prisma.userPreferences.findUnique({ where: { userId: user.id } });

    return apiSuccess({
      preferences: preferences ?? DEFAULT_PREFERENCES,
    });
  } catch (error) {
    return handleApiError(error, "preferences");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth();

    const { selectedCategories, city, priceRange } = await req.json();

    const preferences = await prisma.userPreferences.upsert({
      where: { userId: user.id },
      create: { userId: user.id, selectedCategories: selectedCategories ?? [], city: city ?? DEFAULT_PREFERENCES.city, priceRange: priceRange ?? DEFAULT_PREFERENCES.priceRange },
      update: { selectedCategories, city, priceRange },
    });

    return apiSuccess({ preferences });
  } catch (error) {
    return handleApiError(error, "preferences");
  }
}
