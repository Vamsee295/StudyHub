// Daily question: one question per calendar day, the same for every learner, drawn from all
// question banks in a fixed shuffled order so nothing repeats until the whole pool is used.
import { ALL_COURSES } from "@/lib/data/courses/index";
import { BankQuestion, questionBank, seededRandom, shuffle } from "@/lib/learn/study";
import { markChanged } from "@/lib/sync/userSync";

export interface DailyQuestion extends BankQuestion { course: string; courseTitle: string; date: string; dayNumber: number }
export interface DailyEntry { id: string; correct: boolean; pick?: number }
export type DailyHistory = Record<string, DailyEntry>; // keyed by local date "YYYY-MM-DD"

const DAY = 86_400_000;
let pool: { q: BankQuestion; course: string; courseTitle: string }[] | null = null;

function getPool() {
  if (!pool) {
    const all = ALL_COURSES.flatMap((c) => questionBank(c.slug).map((q) => ({ q, course: c.slug, courseTitle: c.title })));
    // ponytail: fixed seed means the order changes only when banks change; acceptable for a daily feed.
    pool = shuffle(all, seededRandom("studyhub-daily-v1"));
  }
  return pool;
}

/** Local calendar date as YYYY-MM-DD. */
export function dateKey(d: Date = new Date()): string {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, "0"), day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Whole days since 1970-01-01 for a YYYY-MM-DD key, independent of time zone. */
export const dayNumber = (key: string) => Math.round(Date.UTC(+key.slice(0, 4), +key.slice(5, 7) - 1, +key.slice(8, 10)) / DAY);
export const keyFromDayNumber = (n: number) => new Date(n * DAY).toISOString().slice(0, 10);

export function dailyQuestion(key: string = dateKey()): DailyQuestion {
  const p = getPool();
  const n = dayNumber(key);
  const item = p[((n % p.length) + p.length) % p.length];
  return { ...item.q, course: item.course, courseTitle: item.courseTitle, date: key, dayNumber: n };
}

/** Consecutive answered days ending today, or ending yesterday if today isn't answered yet. */
export function currentStreak(history: DailyHistory, today: string = dateKey()): number {
  let n = dayNumber(today);
  if (!history[keyFromDayNumber(n)]) n -= 1;
  let streak = 0;
  while (history[keyFromDayNumber(n)]) { streak++; n--; }
  return streak;
}

export function bestStreak(history: DailyHistory): number {
  const days = Object.keys(history).map(dayNumber).sort((a, b) => a - b);
  let best = 0, run = 0;
  days.forEach((d, i) => { run = i > 0 && d === days[i - 1] + 1 ? run + 1 : 1; best = Math.max(best, run); });
  return best;
}

// ---------- persistence (per browser, like the review queue) ----------
const KEY = "studyhub:daily";
export function getDailyHistory(): DailyHistory {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}
export function saveDailyAnswer(date: string, entry: DailyEntry) {
  try { localStorage.setItem(KEY, JSON.stringify({ ...getDailyHistory(), [date]: entry })); } catch { /* storage blocked */ }
  markChanged(KEY);
}
