import { createSupabaseServerClient } from "./supabase/server";
import { prisma } from "./db";

export class AuthError extends Error {
  constructor(message: string, public statusCode: number = 401) {
    super(message);
  }
}

export async function getAuthenticatedUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { partner: true },
  });

  return dbUser;
}

export async function requireAuth() {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new AuthError("No autorizado");
  }
  return user;
}

export type AuthenticatedUser = NonNullable<Awaited<ReturnType<typeof requireAuth>>>;
export type UserWithPartner = AuthenticatedUser & { partnerId: string };

export async function requirePartnerAuth(): Promise<UserWithPartner> {
  const user = await requireAuth();
  if (!user.partnerId) {
    throw new AuthError("Sin pareja vinculada", 400);
  }
  return { ...user, partnerId: user.partnerId };
}
