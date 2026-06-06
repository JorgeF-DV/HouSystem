import { NextRequest } from "next/server";
import { apiSuccess, handleApiError } from "@/lib/api-utils";
import { login } from "@/lib/services/auth-service";
import type { LoginResponse } from "@/types/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await login(body);
    return apiSuccess<LoginResponse>(result);
  } catch (error) {
    return handleApiError(error, "auth/login");
  }
}
