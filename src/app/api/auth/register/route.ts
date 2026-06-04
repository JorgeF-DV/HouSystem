import { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { apiSuccess, apiError, handleApiError } from "@/lib/api-utils";
import { EMAIL_REGEX } from "@/lib/utils";

const MIN_PASSWORD_LENGTH = 6;

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name?.trim() || !email?.trim() || !password) {
      return apiError("Todos los campos son obligatorios");
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return apiError("La contraseña debe tener al menos 6 caracteres");
    }
    if (!EMAIL_REGEX.test(email)) {
      return apiError("Email inválido");
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) return apiError(error.message);
    if (!data.user) return apiError("Error al crear usuario");

    await prisma.user.create({
      data: {
        id: data.user.id,
        name,
        email,
        password: "managed-by-supabase",
        role: "jorge",
      },
    });

    await prisma.userSettings.create({ data: { userId: data.user.id } });
    await prisma.notificationPreference.createMany({
      data: [
        { userId: data.user.id, type: "Alertas financieras", enabled: true },
        { userId: data.user.id, type: "Recordatorios de tareas", enabled: true },
        { userId: data.user.id, type: "Novedades de planes", enabled: false },
      ],
    });

    return apiSuccess({ user: data.user });
  } catch (error) {
    return handleApiError(error, "auth/register");
  }
}
