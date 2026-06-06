import { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import type { LoginResponse } from "@/types/api";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return apiError("Email y contraseña son obligatorios");
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return apiError("Email o contraseña incorrectos", 401);

    return apiSuccess<LoginResponse>({ user: data.user });
  } catch (error) {
    return handleApiError(error, "auth/login");
  }
}
