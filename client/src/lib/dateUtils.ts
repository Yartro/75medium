// Client-side date helpers are for DISPLAY / calendar-grid generation only.
// The source of truth for "today" and all achieved/day-count math is the API response.

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

export function getWorkWeekDates(dateIso: string): string[] {
  return getWeekDates(dateIso).slice(0, 5);
}

const WEEKDAY_SHORT = ["zo", "ma", "di", "wo", "do", "vr", "za"];
const MONTH_NAMES = [
  "januari", "februari", "maart", "april", "mei", "juni",
  "juli", "augustus", "september", "oktober", "november", "december",
];

export function weekdayShort(dateIso: string): string {
  return WEEKDAY_SHORT[toUtcNoon(dateIso).getUTCDay()];
}

export function dayOfMonth(dateIso: string): number {
  return toUtcNoon(dateIso).getUTCDate();
}

export function monthLabel(year: number, month0: number): string {
  return `${MONTH_NAMES[month0]} ${year}`;
}

export function formatLongDutch(dateIso: string): string {
  const d = toUtcNoon(dateIso);
  return `${WEEKDAY_SHORT[d.getUTCDay()]} ${d.getUTCDate()} ${MONTH_NAMES[d.getUTCMonth()]}`;
}

export interface MonthGridDay {
  date: string;
  inMonth: boolean;
}

/** Monday-first 6-week grid covering `year`/`month0` (0-indexed month). */
export function getMonthGrid(year: number, month0: number): MonthGridDay[] {
  const firstOfMonth = `${year}-${String(month0 + 1).padStart(2, "0")}-01`;
  const gridStart = startOfIsoWeek(firstOfMonth);
  const days: MonthGridDay[] = [];
  let cursor = gridStart;
  for (let i = 0; i < 42; i++) {
    const inMonth = toUtcNoon(cursor).getUTCMonth() === month0;
    days.push({ date: cursor, inMonth });
    cursor = addDays(cursor, 1);
  }
  return days;
}
