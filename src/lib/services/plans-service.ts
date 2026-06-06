import { prisma } from "@/lib/db";
import { InputError, NotFoundError, getOwnedResource } from "@/lib/db-utils";
import type { EventsListResponse, EventCreateResponse, EventDetailResponse, CalendarEventsResponse, RecommendationsListResponse, EventCreateResponse as EventCreateFromReco, PreferencesResponse, PreferencesUpdateResponse, MessageResponse } from "@/types/api";

const DEFAULT_PREFERENCES = { selectedCategories: [] as string[], city: "Buenos Aires", priceRange: "Hasta $50K" };

export async function getEvents(partnerId: string) {
  const events = await prisma.event.findMany({
    where: { partnerId },
    orderBy: { date: "asc" },
  });
  return { events } satisfies EventsListResponse;
}

export async function createEvent(partnerId: string, userId: string, data: {
  name: string; date?: string; time?: string | null; location?: string | null;
  price?: unknown; description?: string | null;
}) {
  const { name, date, time, location, price, description } = data;
  if (!name?.trim()) throw new InputError("El nombre es obligatorio");

  const event = await prisma.event.create({
    data: {
      partnerId,
      name: name.trim(),
      date: date ?? "",
      time: time ?? null,
      location: location ?? null,
      price: price != null ? String(price) : null,
      description: description ?? null,
      createdById: userId,
    },
  });

  return { event } satisfies EventCreateResponse;
}

export async function getEvent(partnerId: string, id: string) {
  const event = await prisma.event.findFirst({
    where: { id, partnerId },
    include: { createdBy: { select: { id: true, name: true, role: true } } },
  });

  if (!event) throw new NotFoundError("Evento no encontrado");
  return { event } satisfies EventDetailResponse;
}

export async function updateEvent(partnerId: string, id: string, data: {
  name?: string; date?: string; time?: string | null; location?: string | null;
  price?: unknown; description?: string | null;
}) {
  await getOwnedResource(prisma.event, id, partnerId);
  await prisma.event.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.date !== undefined && { date: data.date }),
      ...(data.time !== undefined && { time: data.time }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.price !== undefined && { price: data.price != null ? String(data.price) : null }),
      ...(data.description !== undefined && { description: data.description }),
    },
  });
  return { message: "Evento actualizado" } satisfies MessageResponse;
}

export async function deleteEvent(partnerId: string, id: string) {
  await getOwnedResource(prisma.event, id, partnerId);
  await prisma.event.delete({ where: { id } });
  return { message: "Evento eliminado" } satisfies MessageResponse;
}

export async function getCalendarEvents(partnerId: string) {
  const events = await prisma.event.findMany({
    where: { partnerId },
    select: { id: true, name: true, date: true, time: true },
  });
  return { events } satisfies CalendarEventsResponse;
}

export async function getRecommendations(partnerId: string, userId: string) {
  const preferences = await prisma.userPreferences.findUnique({ where: { userId } });
  if (!preferences) return { recommendations: [] } satisfies RecommendationsListResponse;

  const recommendations = await prisma.recommendation.findMany({
    where: { partnerId },
    orderBy: { match: "desc" },
    take: 10,
  });

  return { recommendations } satisfies RecommendationsListResponse;
}

export async function saveRecommendationAsEvent(partnerId: string, userId: string, id: string) {
  const recommendation = await prisma.recommendation.findFirst({ where: { id, partnerId } });
  if (!recommendation) throw new NotFoundError("Recomendación no encontrada");

  const event = await prisma.event.create({
    data: {
      partnerId,
      name: recommendation.name,
      date: recommendation.date,
      price: recommendation.price,
      createdById: userId,
    },
  });

  return { event } satisfies EventCreateFromReco;
}

export async function getRecommendationPreferences(userId: string) {
  const preferences = await prisma.userPreferences.findUnique({ where: { userId } });
  return { preferences: preferences ?? DEFAULT_PREFERENCES } satisfies PreferencesResponse;
}

export async function updateRecommendationPreferences(userId: string, data: { selectedCategories?: string[]; city?: string; priceRange?: string }) {
  const { selectedCategories, city, priceRange } = data;
  const preferences = await prisma.userPreferences.upsert({
    where: { userId },
    create: {
      userId,
      selectedCategories: selectedCategories ?? [],
      city: city ?? DEFAULT_PREFERENCES.city,
      priceRange: priceRange ?? DEFAULT_PREFERENCES.priceRange,
    },
    update: { selectedCategories, city, priceRange },
  });

  return { preferences } satisfies PreferencesUpdateResponse;
}
