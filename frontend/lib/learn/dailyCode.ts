// Daily coding problem: one problem per local calendar day, the same for every learner, picked from
// the problem set's problems that have real tests. It changes at 12:00 AM on the learner's own clock.
// Progress is one entry per date, stored locally and synced to the account (see lib/sync/userSync.ts).
import { problems, type ProblemDefinition } from "@/lib/problems/problemRegistry";
import { seededRandom, shuffle } from "@/lib/learn/study";
import { bestStreak, currentStreak, dateKey, dayNumber, keyFromDayNumber } from "@/lib/learn/daily";
import { markChanged } from "@/lib/sync/userSync";

export { dateKey, dayNumber, keyFromDayNumber };

export type DailyStatus = "solved" | "attempted";
export interface DailyCodeEntry {
  id: string; // problem id
  status: DailyStatus;
  attempts: number; // runs + submits
  solvedAt?: number; // ms
  language?: string;
}
export type DailyCodeHistory = Record<string, DailyCodeEntry>; // keyed by local date "YYYY-MM-DD"

export const DAILY_CODE_KEY = "studyhub:daily-code";
export const draftKeyFor = (date: string) => `studyhub:daily-draft:${date}`;

let pool: ProblemDefinition[] | null = null;
function getPool() {
  if (!pool) {
    const withTests = Object.values(problems).filter((p) => p.visibleTests.length > 0);
    // ponytail: a fixed seed means the order only changes when problems are added; fine for a daily feed.
    pool = shuffle(withTests, seededRandom("studyhub-daily-code-v1"));
  }
  return pool;
}

export function dailyProblem(key: string = dateKey()): ProblemDefinition {
  const p = getPool();
  const n = dayNumber(key);
  return p[((n % p.length) + p.length) % p.length];
}

/** Milliseconds until the next local midnight, when the daily problem changes. */
export function msUntilMidnight(now = new Date()): number {
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  return next.getTime() - now.getTime();
}

// ---------- persistence ----------

export function getDailyCodeHistory(): DailyCodeHistory {
  try {
    const h = JSON.parse(localStorage.getItem(DAILY_CODE_KEY) || "{}");
    return h && typeof h === "object" ? h : {};
  } catch {
    return {};
  }
}

/** Record a run or submit for today's problem. A solved day stays solved. */
export function recordDailyResult(date: string, problemId: string, accepted: boolean, kind: "run" | "submit", language: string): DailyCodeHistory {
  const h = getDailyCodeHistory();
  const prev = h[date];
  const solvedNow = kind === "submit" && accepted;
  const entry: DailyCodeEntry = {
    id: problemId,
    status: prev?.status === "solved" || solvedNow ? "solved" : "attempted",
    attempts: (prev?.attempts ?? 0) + 1,
    solvedAt: prev?.solvedAt ?? (solvedNow ? Date.now() : undefined),
    language: solvedNow ? language : (prev?.language ?? language),
  };
  const next = { ...h, [date]: entry };
  try {
    localStorage.setItem(DAILY_CODE_KEY, JSON.stringify(next));
  } catch {
    /* storage blocked */
  }
  markChanged(DAILY_CODE_KEY);
  return next;
}

// ---------- stats ----------

const solvedOnly = (h: DailyCodeHistory) => Object.fromEntries(Object.entries(h).filter(([, e]) => e.status === "solved"));

/** Consecutive solved days ending today, or ending yesterday while today is still open. */
export const dailyStreak = (h: DailyCodeHistory, today = dateKey()) => currentStreak(solvedOnly(h), today);
export const dailyBestStreak = (h: DailyCodeHistory) => bestStreak(solvedOnly(h));
export const dailySolvedCount = (h: DailyCodeHistory) => Object.values(h).filter((e) => e.status === "solved").length;
