// Self-check for aptitude practice sets: every lesson's set has ~30 questions, four distinct options,
// a valid answer index, an explanation, and a balance of answer positions.
// Usage: npx tsx scripts/check-practice.ts [--show slug]
import assert from "node:assert/strict";
import { practiceFor, PRACTICE_COURSES } from "../lib/aptitude/practice/index";
import { getCourseBySlug } from "../lib/data/courses/index";

const show = process.argv.indexOf("--show");
if (show > 0) {
  const [course, slug] = process.argv[show + 1].split("/");
  for (const q of practiceFor(course, slug)) console.log(`[${q.level}] ${q.q}\n   ${q.options.map((o, i) => (i === q.answer ? `*${o}*` : o)).join(" | ")}\n   → ${q.explanation}\n`);
  process.exit(0);
}

let total = 0, lessons = 0;
const thin: string[] = [];
const fails: string[] = [];
const check = (ok: boolean, msg: string) => { if (!ok) fails.push(msg); };
const pos = [0, 0, 0, 0];
for (const course of PRACTICE_COURSES) {
  const c = getCourseBySlug(course);
  assert.ok(c, `unknown course ${course}`);
  for (const m of c!.modules) for (const l of m.lessons) {
    const set = practiceFor(course, l.slug);
    lessons++;
    if (set.length < 20) thin.push(`${course}/${l.slug} (${set.length})`);
    const ids = new Set<string>();
    for (const q of set) {
      const where = `${course}/${l.slug}: ${q.q.slice(0, 60)}`;
      check(q.options.length === 4, `${where}: needs 4 options`);
      check(new Set(q.options).size === 4, `${where}: duplicate options ${q.options.join(" | ")}`);
      check(q.answer >= 0 && q.answer < 4, `${where}: answer out of range`);
      check(q.explanation.length > 15, `${where}: needs an explanation (${q.explanation})`);
      check(!/NaN|undefined|Infinity/.test(q.q + q.options.join() + q.explanation), `${where}: bad number`);
      check(!ids.has(q.id), `${where}: duplicate id`);
      ids.add(q.id);
      pos[q.answer]++;
      total++;
    }
  }
}
console.log(`${lessons} lessons, ${total} questions, answer positions ${pos.join("/")}`);
if (thin.length) console.log(`under 20 questions: ${thin.join(", ")}`);
if (fails.length) {
  for (const f of fails.slice(0, 40)) console.log(f);
  console.log(`${fails.length} problems`);
  process.exitCode = 1;
} else console.log("practice checks passed");
