// Every formula-sheet key must be a real lesson slug in that course. Run: npx tsx scripts/check-formulas.ts
import { FORMULAS } from "../lib/data/formulas";
import { getCourseBySlug } from "../lib/data/courses/index";

let bad = 0;
for (const [course, lessons] of Object.entries(FORMULAS)) {
  const c = getCourseBySlug(course);
  const slugs = new Set(c?.modules.flatMap((m) => m.lessons.map((l) => l.slug)) ?? []);
  for (const slug of Object.keys(lessons)) if (!slugs.has(slug)) {
    bad++;
    console.log(`missing lesson: ${course}/${slug}`);
  }
  const rows = Object.values(lessons).flat().length;
  console.log(`${course}: ${Object.keys(lessons).length} lessons, ${rows} formulas`);
}
if (bad) process.exit(1);
console.log("formulas ok");
