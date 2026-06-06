import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db";
import { getAuthenticatedUser, AuthError } from "@/lib/auth";
import { InputError } from "@/lib/db-utils";
import { EMAIL_REGEX } from "@/lib/utils";
import type { Prisma } from "@/generated/prisma/client";
import type { LoginResponse, RegisterResponse, MessageResponse, AuthMeResponse, PartnerStatusResponse, PartnerAcceptResponse } from "@/types/api";

const MIN_PASSWORD_LENGTH = 6;

export async function login(data: { email: string; password: string }) {
  const { email, password } = data;
  if (!email || !password) {
    throw new InputError("Email y contraseña son obligatorios");
  }

  const supabase = await createSupabaseServerClient();
  const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) throw new AuthError("Email o contraseña incorrectos", 401);

  return { user: authData.user } satisfies LoginResponse;
}

export async function logout() {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
  return { message: "Sesión cerrada" } satisfies MessageResponse;
}

export async function getMe() {
  const user = await getAuthenticatedUser();
  if (!user) throw new AuthError("No autorizado");

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    partnerId: user.partnerId,
    partner: user.partner,
  } satisfies AuthMeResponse;
}

export async function register(data: { name: string; email: string; password: string }) {
  const { name, email, password } = data;

  if (!name?.trim() || !email?.trim() || !password) {
    throw new InputError("Todos los campos son obligatorios");
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new InputError("La contraseña debe tener al menos 6 caracteres");
  }
  if (!EMAIL_REGEX.test(email)) {
    throw new InputError("Email inválido");
  }

  const supabase = await createSupabaseServerClient();
  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });

  if (error) throw new Error(error.message);
  if (!authData.user) throw new Error("Error al crear usuario");

  await prisma.user.create({
    data: {
      id: authData.user.id,
      name,
      email,
      password: "managed-by-supabase",
      role: "jorge",
    },
  });

  await prisma.userSettings.create({ data: { userId: authData.user.id } });
  await prisma.notificationPreference.createMany({
    data: [
      { userId: authData.user.id, type: "Alertas financieras", enabled: true },
      { userId: authData.user.id, type: "Recordatorios de tareas", enabled: true },
      { userId: authData.user.id, type: "Novedades de planes", enabled: false },
    ],
  });

  return { user: authData.user } satisfies RegisterResponse;
}

export async function acceptInvitation(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AuthError("No autorizado");
  if (user.partnerId) throw new InputError("Ya tenés una pareja vinculada");

  const invitation = await prisma.invitation.findFirst({
    where: { receiverId: userId, status: "pending" },
    include: { sender: true },
  });

  if (!invitation) throw new InputError("No tenés invitaciones pendientes");

  const partner = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const pair = await tx.partner.create({
      data: {
        users: { connect: [{ id: invitation.senderId }, { id: invitation.receiverId }] },
      },
    });
    await tx.user.update({ where: { id: invitation.senderId }, data: { partnerId: pair.id, role: "jorge" } });
    await tx.user.update({ where: { id: invitation.receiverId }, data: { partnerId: pair.id, role: "lorena" } });
    await tx.invitation.update({ where: { id: invitation.id }, data: { status: "accepted" } });
    return pair;
  });

  return { partner, message: "Pareja vinculada" } satisfies PartnerAcceptResponse;
}

export async function invitePartner(userId: string, partnerEmail: string) {
  if (!partnerEmail?.trim()) throw new InputError("Email obligatorio");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AuthError("No autorizado");
  if (user.partnerId) throw new InputError("Ya tenés una pareja vinculada");

  const partner = await prisma.user.findUnique({ where: { email: partnerEmail } });
  if (!partner) throw new InputError("No hay usuario con ese email");
  if (partner.id === userId) throw new InputError("No podés vincularte con vos mismo");
  if (partner.partnerId) throw new InputError("Esa persona ya tiene pareja");

  const existingInvitation = await prisma.invitation.findFirst({
    where: { senderId: userId, receiverId: partner.id, status: "pending" },
  });
  if (existingInvitation) throw new InputError("Ya enviaste una invitación a esa persona");

  await prisma.invitation.create({
    data: { senderId: userId, receiverId: partner.id },
  });

  return { message: "Invitación enviada" } satisfies MessageResponse;
}

export async function getPartnerStatus(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AuthError("No autorizado");

  let invitation = null;
  if (!user.partnerId) {
    invitation = await prisma.invitation.findFirst({
      where: { receiverId: userId, status: "pending" },
      include: { sender: { select: { id: true, name: true, email: true, role: true } } },
    });
  }

  let partner = null;
  if (user.partnerId) {
    partner = await prisma.partner.findUnique({
      where: { id: user.partnerId },
      include: { users: { select: { id: true, name: true, email: true, role: true } } },
    });
  }

  return { invitation, partner } satisfies PartnerStatusResponse;
}

export async function unlinkPartner(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AuthError("No autorizado");
  if (!user.partnerId) throw new InputError("No tenés pareja vinculada");

  const partnerId = user.partnerId;

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.user.updateMany({ where: { partnerId }, data: { partnerId: null } });
    await tx.partner.delete({ where: { id: partnerId } });
  });

  return { message: "Pareja desvinculada" } satisfies MessageResponse;
}
