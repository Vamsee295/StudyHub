// Pictures and planning for /roadmaps: what each stage needs first, the whole roadmap as a map,
// a plain-words framing per stage, and a time plan from real lesson minutes.

/** Stages that should come before each stage. The roadmap is a map, not a single line: several stages run in parallel. */
export const STAGE_NEEDS: Record<string, string[]> = {
  "programming-fundamentals": [],
  oop: ["programming-fundamentals"],
  sql: ["programming-fundamentals"],
  dsa: ["programming-fundamentals"],
  dbms: ["sql"],
  os: ["programming-fundamentals"],
  "computer-networks": ["programming-fundamentals"],
  projects: ["oop", "sql"],
  resume: ["projects"],
  "online-assessment": ["dsa"],
  "technical-interview": ["dsa", "dbms", "os", "computer-networks", "projects"],
  "hr-interview": ["resume"],
};

/** Each stage in one or two everyday sentences, for someone starting from zero. */
export const STAGE_PLAIN: Record<string, string> = {
  "programming-fundamentals": "Learning to write simple, exact instructions for a computer: the alphabet and grammar every other stage is written in.",
  oop: "Organising code the way the real world is organised, into things (objects) that hold facts and do jobs, so big programs stay manageable.",
  sql: "Asking a database precise questions, like a librarian who can find any record among millions in a second.",
  dsa: "Choosing the right container and the right method for a problem, so a program finishes in milliseconds instead of minutes. Coding rounds are mostly this.",
  dbms: "How databases work underneath: keeping data correct when thousands of people use it at once, and fast when it grows huge.",
  os: "How the computer's manager shares one CPU and one memory between many programs without them crashing into each other.",
  "computer-networks": "How a message travels from your laptop to a server on another continent, layer by layer, and arrives intact.",
  projects: "Proof you can build something real and explain every decision in it. Interviewers spend a lot of time here.",
  resume: "A one-page advert for yourself that a recruiter can scan in seconds, then apply where you fit.",
  "online-assessment": "The first filter: timed aptitude and coding tests. Speed and accuracy under a clock.",
  "technical-interview": "A conversation where you solve problems out loud and explain your thinking, not just the answer.",
  "hr-interview": "Showing you'll work well with people: real stories about teamwork, ownership and handling problems.",
};

/** Rough effort for stages without lessons behind them (hours). Estimates, labelled as such on the page. */
export const SELF_PACED_HOURS: Record<string, number> = {
  projects: 40,
  resume: 6,
  "online-assessment": 25,
  "technical-interview": 20,
  "hr-interview": 6,
};

export interface MapStage {
  slug: string;
  name: string;
  phase: string;
  done: boolean;
  current: boolean;
}

const clean = (s: string) => s.replace(/"/g, "#quot;").replace(/&/g, "and");

function node(s: MapStage) {
  const mark = s.done ? "✓ " : s.current ? "▶ " : "";
  return `${s.slug.replace(/-/g, "_")}["${mark}${clean(s.name)}"]`;
}

/** The whole roadmap as a left-to-right dependency map (columns are "can start after"). */
export function roadmapDiagram(stages: MapStage[]): string {
  const id = (slug: string) => slug.replace(/-/g, "_");
  const lines = ["flowchart LR", ...stages.map((s) => `  ${node(s)}`)];
  for (const s of stages) for (const need of STAGE_NEEDS[s.slug] ?? []) lines.push(`  ${id(need)} --> ${id(s.slug)}`);
  const cur = stages.find((s) => s.current);
  if (cur) lines.push(`  style ${id(cur.slug)} stroke-width:3px`);
  return lines.join("\n");
}

/** One stage with what it needs first and what it unlocks. */
export function stageNeighbourhood(slug: string, stages: MapStage[]): string {
  const id = (s: string) => s.replace(/-/g, "_");
  const by = new Map(stages.map((s) => [s.slug, s]));
  const needs = (STAGE_NEEDS[slug] ?? []).map((s) => by.get(s)).filter(Boolean) as MapStage[];
  const unlocks = stages.filter((s) => (STAGE_NEEDS[s.slug] ?? []).includes(slug));
  const me = by.get(slug)!;
  const lines = ["flowchart LR", `  ${node({ ...me, current: true })}`];
  for (const n of needs) lines.push(`  ${node(n)} --> ${id(slug)}`);
  for (const u of unlocks) lines.push(`  ${id(slug)} --> ${node(u)}`);
  if (!needs.length && !unlocks.length) return lines.join("\n");
  lines.push(`  style ${id(slug)} stroke-width:3px`);
  return lines.join("\n");
}

/** A Gantt chart of the remaining stages at a given pace, starting today. */
export function planGantt(items: { name: string; phase: string; hoursLeft: number }[], hoursPerDay: number, start: Date): { diagram: string; days: number; finish: Date } {
  const fmt = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const lines = ["gantt", "  dateFormat YYYY-MM-DD", "  axisFormat %d %b"];
  let days = 0;
  let phase = "";
  let lastId = -1;
  items.forEach((it, i) => {
    if (it.hoursLeft <= 0) return;
    const d = Math.max(1, Math.ceil(it.hoursLeft / hoursPerDay));
    if (it.phase !== phase) {
      lines.push(`  section ${clean(it.phase)}`);
      phase = it.phase;
    }
    lines.push(`  ${clean(it.name).replace(/:/g, " ")} :t${i}, ${lastId < 0 ? fmt(start) : `after t${lastId}`}, ${d}d`);
    lastId = i;
    days += d;
  });
  const finish = new Date(start);
  finish.setDate(finish.getDate() + days);
  return { diagram: lines.join("\n"), days, finish };
}
