import { NextRequest } from "next/server";
import { requirePartnerAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import { getRouteId } from "@/lib/utils";
import { getOwnedResource } from "@/lib/db-utils";

export async function GET(req: Request) {
  try {
    const user = await requirePartnerAuth();
    const id = getRouteId(new URL(req.url));

    const event = await prisma.event.findFirst({
      where: { id, partnerId: user.partnerId },
      include: { createdBy: { select: { id: true, name: true, role: true } } },
    });

    if (!event) return apiError("Evento no encontrado", 404);

    return apiSuccess({ event });
  } catch (error) {
    return handleApiError(error, "events/[id]");
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requirePartnerAuth();
    const id = getRouteId(new URL(req.url));

    const { name, date, time, location, price, description } = await req.json();

    await getOwnedResource(prisma.event, id, user.partnerId);

    await prisma.event.update({ where: { id }, data: { name, date, time, location, price, description } });

    return apiSuccess({ message: "Evento actualizado" });
  } catch (error) {
    return handleApiError(error, "events/[id]");
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await requirePartnerAuth();
    const id = getRouteId(new URL(req.url));

    await getOwnedResource(prisma.event, id, user.partnerId);

    await prisma.event.delete({ where: { id } });
    return apiSuccess({ message: "Evento eliminado" });
  } catch (error) {
    return handleApiError(error, "events/[id]");
  }
}
