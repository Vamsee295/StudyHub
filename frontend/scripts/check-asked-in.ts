// Self-check: every tagged module exists, and topic mapping behaves. Usage: npx tsx scripts/check-asked-in.ts
import assert from "node:assert/strict";
import { COMPANY_PROFILES, companiesForModule, companiesForProblem, dsaModulesForTopics, DSA_CORE } from "../lib/data/askedIn";
import { ALL_COURSES } from "../lib/data/courses/index";

for (const p of COMPANY_PROFILES) {
  assert.ok(p.sources.length > 0, `${p.name} needs sources`);
  for (const a of p.areas) {
    const c = ALL_COURSES.find((x) => x.slug === a.course);
    assert.ok(c, `${p.name}: unknown course ${a.course}`);
    if (a.modules !== "*") for (const m of a.modules) assert.ok(c!.modules.some((x) => x.slug === m), `${p.name}: unknown module ${a.course}/${m}`);
  }
}
const dsa = ALL_COURSES.find((c) => c.slug === "dsa")!;
assert.deepEqual([...DSA_CORE].sort(), dsa.modules.map((m) => m.slug).sort(), "DSA_CORE matches the DSA course");
assert.deepEqual(dsaModulesForTopics(["Two Pointers", "HASHMAP / HASHSET"]), ["arrays", "hashing"]);
assert.deepEqual(dsaModulesForTopics(["Binary Search Tree"]), ["trees"]);
assert.deepEqual(dsaModulesForTopics(["Linked List"]), ["linked-list"]);
assert.ok(companiesForProblem(["Linked List"]).includes("Infosys"));
assert.ok(!companiesForProblem(["Graph BFS / DFS"]).includes("TCS"));
assert.deepEqual(companiesForProblem(["BIT MANIPULATION"]), ["Amazon", "Google"]); // falls back to whole-course coverage
assert.ok(companiesForModule("quantitative-aptitude", "percentages-module-anything").some((p) => p.name === "TCS"));
console.log("asked-in checks passed");
