// Self-check for the daily coding problem and streaks. Usage: npx tsx scripts/check-daily.ts
import assert from "node:assert/strict";
import { currentStreak, bestStreak, dayNumber, keyFromDayNumber } from "../lib/learn/daily";
import { dailyProblem, dailyStreak, dailyBestStreak, msUntilMidnight, type DailyCodeHistory } from "../lib/learn/dailyCode";
import { problems } from "../lib/problems/problemRegistry";
import { mergeDailyCode } from "../lib/sync/userSync";

assert.equal(keyFromDayNumber(dayNumber("2026-11-24")), "2026-11-24");
assert.equal(dayNumber("2026-03-01") - dayNumber("2026-02-28"), 1);
assert.equal(dayNumber("2028-03-01") - dayNumber("2028-02-28"), 2); // leap year

// Same date -> same problem; every problem appears once before any repeats.
assert.equal(dailyProblem("2026-11-24").id, dailyProblem("2026-11-24").id);
const pool = Object.values(problems).filter((p) => p.visibleTests.length > 0).length;
const start = dayNumber("2026-11-24");
const ids = new Set(Array.from({ length: pool }, (_, i) => dailyProblem(keyFromDayNumber(start + i)).id));
assert.equal(ids.size, pool, "no repeats until the whole pool has been used");
assert.ok(dailyProblem("2026-11-24").visibleTests.length > 0, "daily problems always have tests");

// Streaks count solved days only; an attempt doesn't keep a streak alive.
const h = (days: [string, "solved" | "attempted"][]): DailyCodeHistory => Object.fromEntries(days.map(([d, status]) => [d, { id: "x", status, attempts: 1 }]));
assert.equal(dailyStreak(h([]), "2026-11-24"), 0);
assert.equal(dailyStreak(h([["2026-11-22", "solved"], ["2026-11-23", "solved"], ["2026-11-24", "solved"]]), "2026-11-24"), 3);
assert.equal(dailyStreak(h([["2026-11-22", "solved"], ["2026-11-23", "solved"]]), "2026-11-24"), 2, "today still open keeps yesterday's streak");
assert.equal(dailyStreak(h([["2026-11-22", "solved"], ["2026-11-23", "attempted"]]), "2026-11-24"), 0, "an unsolved day breaks the streak");
assert.equal(dailyBestStreak(h([["2026-11-01", "solved"], ["2026-11-02", "solved"], ["2026-11-03", "solved"], ["2026-11-10", "solved"]])), 3);
assert.equal(currentStreak({ "2026-02-28": 1, "2026-03-01": 1 }, "2026-03-01"), 2, "month boundary");
assert.equal(bestStreak({}), 0);

// The countdown always points at the next local midnight.
const ms = msUntilMidnight(new Date(2026, 10, 24, 23, 59, 30));
assert.equal(ms, 30_000);

// Sync merge: a solve on either device wins and attempts never go down.
const merged = mergeDailyCode(
  { "2026-11-24": { id: "1", status: "attempted", attempts: 4 } },
  { "2026-11-24": { id: "1", status: "solved", attempts: 2 } }
);
assert.equal(merged["2026-11-24"].status, "solved");
assert.equal(merged["2026-11-24"].attempts, 4);
console.log(`daily checks passed (${pool} problems in the daily pool)`);
