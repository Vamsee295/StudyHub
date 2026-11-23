// Self-check for the study bank and Leitner scheduling. Usage: npx tsx scripts/check-study.ts
import assert from "node:assert/strict";
import { questionBank, revisionData, schedule, dueItems, BOX_INTERVAL_DAYS } from "../lib/learn/study";
import { ALL_COURSES } from "../lib/data/courses/index";
import { EXTRA_QUESTIONS } from "../lib/data/question-bank/index";

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
// Shuffled extras must still point at the same correct text.
for (const [course, lessons] of Object.entries(EXTRA_QUESTIONS)) {
  const bank = new Map(questionBank(course).map((q) => [q.id, q]));
  for (const [slug, qs] of Object.entries(lessons)) qs.forEach((x, i) => {
    const q = bank.get(`${slug}#x${i}`)!;
    assert.equal(q.options[q.answer], x.o[x.a], `${course}/${slug}#x${i} answer moved`);
  });
}
// Extra question quality: known lessons, four distinct options, answer in range, explanation, varied answer positions.
for (const [course, lessons] of Object.entries(EXTRA_QUESTIONS)) {
  const c = ALL_COURSES.find((x) => x.slug === course);
  assert.ok(c, `unknown course ${course}`);
  const slugs = new Set(c!.modules.flatMap((m) => m.lessons.map((l) => l.slug)));
  const pos = [0, 0, 0, 0];
  let n = 0;
  for (const [slug, qs] of Object.entries(lessons)) {
    assert.ok(slugs.has(slug), `${course}: unknown lesson ${slug}`);
    for (const q of qs) {
      const where = `${course}/${slug}: ${q.q.slice(0, 50)}`;
      assert.equal(q.o.length, 4, `${where} needs 4 options`);
      assert.equal(new Set(q.o.map((o) => o.trim().toLowerCase())).size, 4, `${where} duplicate options`);
      assert.ok(Number.isInteger(q.a) && q.a >= 0 && q.a < 4, `${where} answer out of range`);
      assert.ok(q.e.trim().length > 20, `${where} needs an explanation`);
      assert.ok(!/—/.test(q.q + q.o.join("") + q.e), `${where} em dash`);
      n++;
    }
  }
  const missing = [...slugs].filter((s) => !(s in lessons));
  for (const q of questionBank(course)) if (q.id.includes("#x")) pos[q.answer]++;
  if (n) {
    // Small banks can't balance evenly by chance; check position spread only where it is meaningful.
    // Shuffle is pseudo-random: allow more variance for mid-sized banks (expected share is 25%).
    const floor = n >= 100 ? 0.15 : 0.1;
    if (n >= 40) for (let i = 0; i < 4; i++) assert.ok(pos[i] / n >= floor, `${course}: answer position ${"ABCD"[i]} used only ${pos[i]}/${n} times`);
    console.log(`${course.padEnd(26)} extra ${n}, positions ${pos.join("/")}, lessons without extras: ${missing.length}`);
  }
}
console.log("study checks passed");
