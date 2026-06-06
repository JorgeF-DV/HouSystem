import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import type { NotificationPreferencesListResponse, MessageResponse } from "@/types/api";

export async function GET() {
  try {
    const user = await requireAuth();

    const preferences = await prisma.notificationPreference.findMany({
      where: { userId: user.id },
    });

    return apiSuccess<NotificationPreferencesListResponse>({ preferences });
  } catch (error) {
    return handleApiError(error, "notifications/preferences");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth();

    const { type, enabled } = await req.json();

    await prisma.notificationPreference.upsert({
      where: { userId_type: { userId: user.id, type } },
      create: { userId: user.id, type, enabled },
      update: { enabled },
    });

    return apiSuccess<MessageResponse>({ message: "Preferencia actualizada" });
  } catch (error) {
    return handleApiError(error, "notifications/preferences");
  }
}
