export function cn(...inputs: (string | false | undefined | null)[]) {
  return inputs.filter(Boolean).join(" ");
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
  }).format(date);
}

export function getProgressColor(percent: number): string {
  if (percent >= 90) return "#FF5B5B";
  if (percent > 70) return "#F5A623";
  return "#00C896";
}

export function getRouteId(url: URL): string {
  return url.pathname.split("/").pop()!;
}

export function getWeekStart(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
