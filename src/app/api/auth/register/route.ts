import { NextRequest } from "next/server";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { register } from "@/lib/services/auth-service";
import type { RegisterResponse } from "@/types/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await register(body);
    return apiSuccess<RegisterResponse>(result);
  } catch (error) {
    return handleApiError(error, "auth/register");
  }
}
