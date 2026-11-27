// Spreads a company's course modules (in roadmap order) over the weeks a learner has left.
// The modules and their minutes are computed on the server (app/page.tsx) from the real course lessons.

export type PlanStage = { id: string; title: string; stage: string; lessons: number; minutes: number }; // one course module
export type PlanBlock = { stages: PlanStage[]; from: number; to: number }; // 1-based week range, inclusive

/** One block per stage when there's room (weeks split by study time, at least one each);
 *  otherwise neighbouring stages share a week. */
export function allocate(stages: PlanStage[], weeks: number): PlanBlock[] {
  const n = stages.length;
  if (!n || weeks < 1) return [];
  let groups: { stages: PlanStage[]; weeks: number }[];
  if (weeks >= n) {
    const total = stages.reduce((s, x) => s + x.minutes, 0) || 1;
    const spare = weeks - n;
    const exact = stages.map((s) => (spare * s.minutes) / total);
    const extra = exact.map(Math.floor);
    // largest remainder, so the extra weeks add up exactly
    let left = spare - extra.reduce((a, b) => a + b, 0);
    for (const i of exact.map((v, i) => i).sort((a, b) => exact[b] - Math.floor(exact[b]) - (exact[a] - Math.floor(exact[a])))) {
      if (left-- <= 0) break;
      extra[i]++;
    }
    groups = stages.map((s, i) => ({ stages: [s], weeks: 1 + extra[i] }));
  } else {
    groups = Array.from({ length: weeks }, (_, i) => ({ stages: stages.slice(Math.floor((i * n) / weeks), Math.floor(((i + 1) * n) / weeks)), weeks: 1 }));
  }
  let week = 1;
  return groups.map((g) => {
    const b = { stages: g.stages, from: week, to: week + g.weeks - 1 };
    week += g.weeks;
    return b;
  });
}

// Self-check: npx tsx components/landing/plan.ts
if (typeof process !== "undefined" && process.argv[1]?.endsWith("plan.ts")) {
  const s = (id: string, minutes: number): PlanStage => ({ id, title: id, stage: "s", lessons: 1, minutes });
  const st = [s("a", 100), s("b", 300), s("c", 100)];
  const span = (b: PlanBlock[]) => b.at(-1)!.to;
  const roomy = allocate(st, 10);
  console.assert(span(roomy) === 10 && roomy.length === 3 && roomy[1].to - roomy[1].from >= roomy[0].to - roomy[0].from, "roomy", roomy);
  const tight = allocate(st, 2);
  console.assert(span(tight) === 2 && tight.flatMap((b) => b.stages).length === 3, "tight", tight);
  console.assert(allocate(st, 3).every((b) => b.from === b.to), "exact");
  console.assert(allocate([], 4).length === 0 && allocate(st, 0).length === 0, "empty");
  console.log("plan.ts ok");
}
