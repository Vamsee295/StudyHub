// Day-by-day activity, built from what the learner actually did (all stored locally / synced):
// - lessons completed (lesson progress records when each was completed)
// - problems solved (first-solve time per problem)
// - every submission (lib/problems/submissions.ts), accepted or not
// - daily problems solved
// Used by the heatmap on Profile → Progress and the streak on the Practice page.
import { ALL_COURSES } from "@/lib/data/courses";
import { getStoredProgress } from "@/lib/services/learnService";
import { problemStorage } from "@/lib/problems/problemStorage";
import { getSubmissions } from "@/lib/problems/submissions";
import { dateKey, dayNumber, getDailyCodeHistory, keyFromDayNumber } from "@/lib/learn/dailyCode";

export interface DayActivity {
  lessons: number;
  problems: number; // first solves
  submissions: number; // every Submit, accepted or not
  accepted: number;
  daily: boolean;
}
export type ActivityMap = Record<string, DayActivity>; // keyed by local date YYYY-MM-DD

const day = (m: ActivityMap, key: string) => (m[key] ??= { lessons: 0, problems: 0, submissions: 0, accepted: 0, daily: false });

export function activityByDay(): ActivityMap {
  const m: ActivityMap = {};

  // Lessons: progress is stored under both the lesson id and slug, so walk the real lessons to count each once.
  const store = getStoredProgress();
  for (const c of ALL_COURSES)
    for (const mod of c.modules)
      for (const l of mod.lessons) {
        const p = store[l.id] ?? store[l.slug];
        if (p?.status === "completed" && p.updatedAt) day(m, dateKey(new Date(p.updatedAt))).lessons++;
      }

  for (const at of Object.values(problemStorage.getSolvedAt())) if (at) day(m, dateKey(new Date(at))).problems++;

  for (const s of getSubmissions()) {
    const d = day(m, dateKey(new Date(s.at)));
    d.submissions++;
    if (s.v === "accepted") d.accepted++;
  }

  for (const [date, e] of Object.entries(getDailyCodeHistory())) if (e.status === "solved") day(m, date).daily = true;

  return m;
}

// Coding counts once per submission; older days from before the submission log fall back to first solves,
// and a daily problem solved without a logged submission still counts.
export const activityCount = (d?: DayActivity) => (d ? d.lessons + Math.max(d.submissions, d.problems, d.daily ? 1 : 0) : 0);

/** Consecutive days (ending today, or yesterday while today is still open) where `active(date)` holds. */
export function streakOf(active: (date: string) => boolean, today = dateKey()): number {
  let n = dayNumber(today);
  if (!active(keyFromDayNumber(n))) n -= 1;
  let streak = 0;
  while (active(keyFromDayNumber(n))) {
    streak++;
    n--;
  }
  return streak;
}

export function bestStreakOf(dates: string[]): number {
  const days = [...new Set(dates)].map(dayNumber).sort((a, b) => a - b);
  let best = 0;
  let run = 0;
  days.forEach((d, i) => {
    run = i > 0 && d === days[i - 1] + 1 ? run + 1 : 1;
    best = Math.max(best, run);
  });
  return best;
}
