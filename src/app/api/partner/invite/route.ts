import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { invitePartner } from "@/lib/services/auth-service";
import type { MessageResponse } from "@/types/api";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { partnerEmail } = await req.json();
    const result = await invitePartner(user.id, partnerEmail);
    return apiSuccess<MessageResponse>(result);
  } catch (error) {
    return handleApiError(error, "partner/invite");
  }
}
