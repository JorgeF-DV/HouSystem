import { prisma } from "@/lib/db";
import { AuthError } from "@/lib/auth";
import type { ProfileResponse, MessageResponse, SettingsResponse, SettingsUpdateResponse, NotificationsListResponse, NotificationPreferencesListResponse, MessageResponse as NotifMessage } from "@/types/api";

const DEFAULT_THEME = "Oscuro";

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AuthError("No autorizado");

  let partner = null;
  if (user.partnerId) {
    partner = await prisma.partner.findUnique({
      where: { id: user.partnerId },
      include: { users: { select: { id: true, name: true, role: true } } },
    });
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    partnerId: user.partnerId,
    partner,
  } satisfies ProfileResponse;
}

export async function updateProfile(userId: string, data: { name?: string }) {
  const { name } = data;
  if (name?.trim()) {
    await prisma.user.update({ where: { id: userId }, data: { name: name.trim() } });
  }
  return { message: "Perfil actualizado" } satisfies MessageResponse;
}

export async function getSettings(userId: string) {
  const settings = await prisma.userSettings.findUnique({ where: { userId } });
  return { settings: settings ?? { theme: DEFAULT_THEME } } satisfies SettingsResponse;
}

export async function updateSettings(userId: string, data: { theme?: string }) {
  const { theme } = data;
  const settings = await prisma.userSettings.upsert({
    where: { userId },
    create: { userId, theme: theme ?? DEFAULT_THEME },
    update: { theme },
  });
  return { settings } satisfies SettingsUpdateResponse;
}

export async function clearCache() {
  return { message: "Caché limpiado" } satisfies MessageResponse;
}

export async function exportData() {
  return { message: "Export no implementado" } satisfies MessageResponse;
}

export async function getNotifications(userId: string) {
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return { notifications } satisfies NotificationsListResponse;
}

export async function markNotificationRead(userId: string, id: string) {
  const notification = await prisma.notification.findFirst({ where: { id, userId } });
  if (!notification) throw new AuthError("Notificación no encontrada", 404);
  await prisma.notification.update({ where: { id }, data: { unread: false } });
  return { message: "Notificación leída" } satisfies NotifMessage;
}

export async function getNotificationPreferences(userId: string) {
  const preferences = await prisma.notificationPreference.findMany({ where: { userId } });
  return { preferences } satisfies NotificationPreferencesListResponse;
}

export async function updateNotificationPreference(userId: string, data: { type: string; enabled: boolean }) {
  const { type, enabled } = data;
  await prisma.notificationPreference.upsert({
    where: { userId_type: { userId, type } },
    create: { userId, type, enabled },
    update: { enabled },
  });
  return { message: "Preferencia actualizada" } satisfies NotifMessage;
}

export async function markAllNotificationsRead(userId: string) {
  await prisma.notification.updateMany({
    where: { userId },
    data: { unread: false },
  });
  return { message: "Todas marcadas como leídas" } satisfies NotifMessage;
}
