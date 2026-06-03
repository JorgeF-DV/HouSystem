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
