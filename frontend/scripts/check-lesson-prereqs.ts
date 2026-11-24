// Validates curated lesson prerequisites: both ends exist, no self-links, no duplicates,
// and a same-course prerequisite comes earlier in the course. Usage: npx tsx scripts/check-lesson-prereqs.ts
import { LESSON_PREREQS, lessonRef, prerequisitesFor } from '../lib/learn/lessonPrereqs';
import { ALL_COURSES } from '../lib/data/courses/index';

let problems = 0;
const seen = new Set<string>();
for (const [from, to, reason] of LESSON_PREREQS) {
  const a = lessonRef(from), b = lessonRef(to);
  const fail = (msg: string) => { problems++; console.log(`${from} -> ${to}: ${msg}`); };
  if (!a) fail('unknown prerequisite lesson');
  if (!b) fail('unknown target lesson');
  if (from === to) fail('self-link');
  if (seen.has(from + '>' + to)) fail('duplicate');
  seen.add(from + '>' + to);
  if (!reason.trim()) fail('missing reason');
  if (a && b && a.course === b.course && a.index >= b.index) fail('prerequisite comes after the lesson in the same course');
}
let lessonsWithPrereqs = 0, total = 0;
for (const c of ALL_COURSES) for (const m of c.modules) for (const l of m.lessons) {
  total++;
  if (prerequisitesFor(c.slug, l.slug).length) lessonsWithPrereqs++;
}
console.log({ curated: LESSON_PREREQS.length, lessonsWithPrereqs, total, problems });
if (problems) process.exit(1);
