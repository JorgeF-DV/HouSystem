import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import type { SettingsResponse, SettingsUpdateResponse, MessageResponse } from "@/types/api";

const DEFAULT_THEME = "Oscuro";

export async function GET() {
  try {
    const user = await requireAuth();

    const settings = await prisma.userSettings.findUnique({ where: { userId: user.id } });

    return apiSuccess<SettingsResponse>({ settings: settings ?? { theme: DEFAULT_THEME } });
  } catch (error) {
    return handleApiError(error, "settings");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth();

    const { theme } = await req.json();

    const settings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      create: { userId: user.id, theme: theme ?? DEFAULT_THEME },
      update: { theme },
    });

    return apiSuccess<SettingsUpdateResponse>({ settings });
  } catch (error) {
    return handleApiError(error, "settings");
  }
}
