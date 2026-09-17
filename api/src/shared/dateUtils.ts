// All dates in this app are plain "yyyy-MM-dd" strings with no time component.
// Arithmetic is done via UTC-anchored Date objects purely as a calendar calculator
// (noon UTC avoids any DST edge crossing a local midnight) - never used for display.

const TIME_ZONE = "Europe/Amsterdam";

export function getTodayISO(): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  // en-CA formats as yyyy-MM-dd
  return formatter.format(new Date());
}

function toUtcNoon(dateIso: string): Date {
  return new Date(`${dateIso}T12:00:00Z`);
}

function fromUtcNoon(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(dateIso: string, days: number): string {
  const d = toUtcNoon(dateIso);
  d.setUTCDate(d.getUTCDate() + days);
  return fromUtcNoon(d);
}

export function diffDays(a: string, b: string): number {
  const ms = toUtcNoon(a).getTime() - toUtcNoon(b).getTime();
  return Math.round(ms / (24 * 60 * 60 * 1000));
}

export function isValidDateIso(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = toUtcNoon(value);
  return fromUtcNoon(d) === value;
}

export function startOfIsoWeek(dateIso: string): string {
  const d = toUtcNoon(dateIso);
  const dayOfWeek = d.getUTCDay(); // 0=Sun..6=Sat
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  d.setUTCDate(d.getUTCDate() + diffToMonday);
  return fromUtcNoon(d);
}

export function getWeekDates(dateIso: string): string[] {
  const monday = startOfIsoWeek(dateIso);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}
