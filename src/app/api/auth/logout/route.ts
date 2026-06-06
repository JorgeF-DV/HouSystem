import { createSupabaseServerClient } from "@/lib/supabase/server";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import type { MessageResponse } from "@/types/api";

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signOut();
    if (error) return apiError(error.message);
    return apiSuccess<MessageResponse>({ message: "Sesión cerrada" });
  } catch (error) {
    return handleApiError(error, "auth/logout");
  }
}
