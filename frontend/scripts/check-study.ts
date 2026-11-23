// Self-check for the study bank and Leitner scheduling. Usage: npx tsx scripts/check-study.ts
import assert from "node:assert/strict";
import { questionBank, revisionData, schedule, dueItems, BOX_INTERVAL_DAYS } from "../lib/learn/study";
import { ALL_COURSES } from "../lib/data/courses/index";

const DAY = 86_400_000;
let items = schedule([], "a", true, 0);
assert.deepEqual(items, [], "right on first sight is not queued");
items = schedule(items, "a", false, 0);
assert.deepEqual(items, [{ id: "a", box: 1, due: 0 }], "wrong answer -> box 1, due now");
assert.equal(dueItems(items, 0).length, 1);
assert.equal(dueItems(schedule(items, "a", true, 0), DAY - 1).length, 0, "box 2 waits a day");
for (let box = 2; box < BOX_INTERVAL_DAYS.length; box++) {
  items = schedule(items, "a", true, 0);
  assert.equal(items[0].box, box);
  assert.equal(items[0].due, BOX_INTERVAL_DAYS[box] * DAY);
}
assert.deepEqual(schedule(items, "a", true, 0), [], "right answer out of the last box retires the item");
assert.equal(schedule(items, "a", false, 0)[0].box, 1, "wrong answer resets to box 1");

for (const c of ALL_COURSES) {
  const bank = questionBank(c.slug);
  assert.ok(bank.length > 0, `${c.slug} has questions`);
  assert.equal(new Set(bank.map((q) => q.id)).size, bank.length, `${c.slug} ids unique`);
  for (const q of bank) assert.ok(q.answer >= 0 && q.answer < q.options.length, `${q.id} answer in range`);
  assert.equal(revisionData(c.slug).length, c.modules.length);
  console.log(c.slug.padEnd(26), "questions", bank.length);
}
console.log("study checks passed");
