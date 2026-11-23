// Self-check for daily questions and streaks. Usage: npx tsx scripts/check-daily.ts
import assert from "node:assert/strict";
import { dailyQuestion, currentStreak, bestStreak, dayNumber, keyFromDayNumber, DailyHistory } from "../lib/learn/daily";

assert.equal(keyFromDayNumber(dayNumber("2026-11-24")), "2026-11-24");
assert.equal(dayNumber("2026-03-01") - dayNumber("2026-02-28"), 1);
assert.equal(dayNumber("2028-03-01") - dayNumber("2028-02-28"), 2); // leap year
// Same date -> same question; consecutive dates -> different questions for a long run.
assert.equal(dailyQuestion("2026-11-24").id, dailyQuestion("2026-11-24").id);
const ids = new Set<string>();
const start = dayNumber("2026-11-24");
for (let i = 0; i < 365; i++) ids.add(dailyQuestion(keyFromDayNumber(start + i)).id + dailyQuestion(keyFromDayNumber(start + i)).course);
assert.equal(ids.size, 365, "no repeats within a year");
const q = dailyQuestion("2026-11-24");
assert.ok(q.answer >= 0 && q.answer < q.options.length);

const h = (days: string[]): DailyHistory => Object.fromEntries(days.map((d) => [d, { id: "x", correct: true }]));
assert.equal(currentStreak(h([]), "2026-11-24"), 0);
assert.equal(currentStreak(h(["2026-11-22", "2026-11-23", "2026-11-24"]), "2026-11-24"), 3);
assert.equal(currentStreak(h(["2026-11-22", "2026-11-23"]), "2026-11-24"), 2, "today not answered yet keeps yesterday's streak");
assert.equal(currentStreak(h(["2026-11-21", "2026-11-22"]), "2026-11-24"), 0, "a missed day breaks the streak");
assert.equal(currentStreak(h(["2026-02-28", "2026-03-01"]), "2026-03-01"), 2, "month boundary");
assert.equal(bestStreak(h(["2026-11-01", "2026-11-02", "2026-11-03", "2026-11-10", "2026-11-11"])), 3);
assert.equal(bestStreak(h([])), 0);
console.log("daily checks passed");
