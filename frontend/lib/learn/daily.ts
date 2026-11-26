// Calendar-day helpers and streak maths, shared by the daily coding problem (lib/learn/dailyCode.ts).
// The old daily multiple-choice history (studyhub:daily) is still synced as-is, so its type stays.
export interface DailyEntry { id: string; correct: boolean; pick?: number }
export type DailyHistory = Record<string, DailyEntry>; // keyed by local date "YYYY-MM-DD"

const DAY = 86_400_000;
/** Local calendar date as YYYY-MM-DD. */
export function dateKey(d: Date = new Date()): string {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, "0"), day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Whole days since 1970-01-01 for a YYYY-MM-DD key, independent of time zone. */
export const dayNumber = (key: string) => Math.round(Date.UTC(+key.slice(0, 4), +key.slice(5, 7) - 1, +key.slice(8, 10)) / DAY);
export const keyFromDayNumber = (n: number) => new Date(n * DAY).toISOString().slice(0, 10);

/** Consecutive answered days ending today, or ending yesterday if today isn't answered yet. */
export function currentStreak(history: Record<string, unknown>, today: string = dateKey()): number {
  let n = dayNumber(today);
  if (!history[keyFromDayNumber(n)]) n -= 1;
  let streak = 0;
  while (history[keyFromDayNumber(n)]) { streak++; n--; }
  return streak;
}

export function bestStreak(history: Record<string, unknown>): number {
  const days = Object.keys(history).map(dayNumber).sort((a, b) => a - b);
  let best = 0, run = 0;
  days.forEach((d, i) => { run = i > 0 && d === days[i - 1] + 1 ? run + 1 : 1; best = Math.max(best, run); });
  return best;
}
