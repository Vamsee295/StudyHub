// Self-check: every course has a reading order covering each module exactly once, in course order.
// Usage: npx tsx scripts/check-reading-order.ts   (add --urls to print resource URLs for a link check)
import assert from "node:assert/strict";
import { READING_ORDERS } from "../lib/data/readingOrder";
import { ALL_COURSES } from "../lib/data/courses/index";

for (const c of ALL_COURSES) {
  const order = READING_ORDERS.find((o) => o.course === c.slug);
  assert.ok(order, `${c.slug} has no reading order`);
  const mods = order!.steps.flatMap((s) => ("module" in s ? [s.module] : []));
  assert.deepEqual(mods, c.modules.map((m) => m.slug), `${c.slug}: modules must appear once each, in course order`);
  for (const s of order!.steps) if ("resource" in s) {
    assert.ok(s.resource.url.startsWith("https://"), `${s.resource.title}: https URL`);
    assert.ok(s.resource.why.length > 40, `${s.resource.title}: needs a why note`);
    assert.ok(!/—/.test(s.resource.why), `${s.resource.title}: em dash`);
  }
}
if (process.argv.includes("--urls")) {
  const urls = new Set(READING_ORDERS.flatMap((o) => o.steps.flatMap((s) => ("resource" in s ? [s.resource.url] : []))));
  console.log([...urls].join("\n"));
} else console.log(`reading order checks passed: ${READING_ORDERS.length} courses, ${READING_ORDERS.reduce((n, o) => n + o.steps.filter((s) => "resource" in s).length, 0)} resources`);
