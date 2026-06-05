import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { apiSuccess, handleApiError } from "@/lib/api-utils";

export async function GET() {
  try {
    const user = await requireAuth();

    let invitation = null;
    if (!user.partnerId) {
      invitation = await prisma.invitation.findFirst({
        where: { receiverId: user.id, status: "pending" },
        include: { sender: { select: { id: true, name: true, email: true, role: true } } },
      });
    }

    let partner = null;
    if (user.partnerId) {
      const p = await prisma.partner.findUnique({
        where: { id: user.partnerId },
        include: {
          users: { select: { id: true, name: true, email: true, role: true } },
        },
      });
      partner = p;
    }

    return apiSuccess({ invitation, partner });
  } catch (error) {
    return handleApiError(error, "partner/status");
  }
}
