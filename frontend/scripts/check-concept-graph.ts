// Self-check for the concept graph and its layout. Usage: npx tsx scripts/check-concept-graph.ts
import assert from "node:assert/strict";
import { buildConceptGraph, CROSS_LINKS } from "../lib/learn/conceptGraph";
import { forceLayout } from "../lib/learn/forceLayout";

const { nodes, edges } = buildConceptGraph();
const ids = new Set(nodes.map((n) => n.id));
for (const [from, to] of CROSS_LINKS) {
  assert.ok(ids.has(from), `unknown module ${from}`);
  assert.ok(ids.has(to), `unknown module ${to}`);
}
for (const e of edges) assert.ok(ids.has(e.from) && ids.has(e.to), `dangling edge ${e.from} -> ${e.to}`);

// No cycles: "builds on" must be acyclic so a study order exists.
const out = new Map<string, string[]>(nodes.map((n) => [n.id, []]));
for (const e of edges) out.get(e.from)!.push(e.to);
const state = new Map<string, number>();
const visit = (id: string): void => {
  state.set(id, 1);
  for (const n of out.get(id)!) {
    assert.notEqual(state.get(n), 1, `cycle through ${id} -> ${n}`);
    if (!state.get(n)) visit(n);
  }
  state.set(id, 2);
};
for (const n of nodes) if (!state.get(n.id)) visit(n.id);

const pos = forceLayout(nodes.map((n) => ({ id: n.id, group: n.course })), edges.map((e) => ({ ...e, weight: e.kind === "cross" ? 0.08 : 1 })));
for (const [id, p] of pos) assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y) && p.x >= 0 && p.x <= 1200 && p.y >= 0 && p.y <= 900, `bad position for ${id}`);
// Clustering: same-course pairs should sit closer on average than cross-course pairs.
let same = 0, sameN = 0, diff = 0, diffN = 0;
for (const a of nodes) for (const b of nodes) {
  if (a.id >= b.id) continue;
  const d = Math.hypot(pos.get(a.id)!.x - pos.get(b.id)!.x, pos.get(a.id)!.y - pos.get(b.id)!.y);
  if (a.course === b.course) { same += d; sameN++; } else { diff += d; diffN++; }
}
assert.ok(same / sameN < (diff / diffN) * 0.6, `weak clustering: ${(same / sameN).toFixed(0)} vs ${(diff / diffN).toFixed(0)}`);
console.log(`concept graph checks passed: ${nodes.length} modules, ${edges.length} edges (${edges.filter((e) => e.kind === "cross").length} cross-course)`);
