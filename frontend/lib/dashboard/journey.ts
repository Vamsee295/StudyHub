// The dashboard's "where am I, and what next?": a getting-started checklist, the four-stage journey from
// zero to interview-ready, and the next concrete steps. Everything is computed from the learner's real data.
import { courseProgress } from "@/lib/learn/progress";
import { BEGINNER_PATH } from "@/lib/data/learnResources";
import { PRACTICE_PATH } from "@/lib/data/patterns";
import { categoryOf, problemOrder, problems } from "@/lib/problems/problemRegistry";
import { problemStorage } from "@/lib/problems/problemStorage";
import { getDailyCodeHistory } from "@/lib/learn/dailyCode";
import { usedTools } from "@/lib/tools/recentTools";

export interface ChecklistItem {
  label: string;
  done: boolean;
  href: string;
}
export interface JourneyStage {
  name: string;
  detail: string;
  pct: number;
  href: string;
}
export interface NextStep {
  kind: string;
  title: string;
  note: string;
  href: string;
}

export interface Snapshot {
  checklist: ChecklistItem[];
  stages: JourneyStage[];
  current: number; // index of the first unfinished stage (stages.length when all done)
  next: NextStep[];
}

const pct = (done: number, total: number) => (total ? Math.round((100 * done) / total) : 0);

export function snapshot(targetCompanies: string[]): Snapshot {
  const courses = courseProgress();
  const course = (slug: string) => courses.find((c) => c.slug === slug);
  const lessons = (slugs: string[]) => {
    const cs = slugs.map(course).filter(Boolean) as ReturnType<typeof courseProgress>;
    return { done: cs.reduce((n, c) => n + c.done, 0), total: cs.reduce((n, c) => n + c.total, 0) };
  };
  const status = problemStorage.getAllStatuses();
  const solvedIds = Object.keys(status).filter((id) => status[id] === "solved");
  const order = problemOrder();
  const solvedIn = (topics: string[]) => {
    const ids = order.filter((id) => topics.includes(categoryOf(problems[id])));
    return { done: ids.filter((id) => status[id] === "solved").length, total: ids.length };
  };
  const tools = usedTools();
  const dailySolved = Object.values(getDailyCodeHistory()).some((e) => e.status === "solved");
  const lessonsDone = courses.reduce((n, c) => n + c.done, 0);

  const checklist: ChecklistItem[] = [
    { label: "Choose your target companies", done: targetCompanies.length > 0, href: "/profile/target-companies" },
    { label: "Finish your first lesson", done: lessonsDone > 0, href: "/learn/programming-fundamentals/what-is-programming" },
    { label: "Solve your first problem", done: solvedIds.length > 0, href: "/practice" },
    { label: "Solve a daily problem", done: dailySolved, href: "/learn/daily" },
    { label: "Check your resume", done: tools.has("/tools/resume-analyzer"), href: "/tools/resume-analyzer" },
    { label: "Write one STAR story", done: tools.has("/tools/star-builder"), href: "/tools/star-builder" },
    { label: "Try a mock interview", done: tools.has("/tools/interview-simulator"), href: "/tools/interview-simulator" },
  ];

  const basics = lessons(["programming-fundamentals", "oop"]);
  const patterns = solvedIn([...PRACTICE_PATH[0].topics, ...PRACTICE_PATH[1].topics]);
  const core = lessons(["sql", "dbms", "os", "computer-networks"]);
  const advanced = solvedIn([...PRACTICE_PATH[2].topics, ...PRACTICE_PATH[3].topics]);
  const design = lessons(["system-design"]);
  const interviewTools = ["/tools/resume-analyzer", "/tools/star-builder", "/tools/interview-simulator"].filter((t) => tools.has(t)).length;
  // interview-ready blends harder problems, system design and the three interview tools
  const ready = Math.round((pct(advanced.done, advanced.total) + pct(design.done, design.total) + pct(interviewTools, 3)) / 3);

  const stages: JourneyStage[] = [
    { name: "Learn the basics", detail: `${basics.done}/${basics.total} programming & OOP lessons`, pct: pct(basics.done, basics.total), href: "/learn/programming-fundamentals" },
    { name: "Master the patterns", detail: `${patterns.done}/${patterns.total} warm-up & core problems`, pct: pct(patterns.done, patterns.total), href: "/practice" },
    { name: "Core CS", detail: `${core.done}/${core.total} SQL, DBMS, OS & networks lessons`, pct: pct(core.done, core.total), href: "/learn" },
    { name: "Interview ready", detail: `harder problems · system design · ${interviewTools}/3 interview tools`, pct: ready, href: "/companies" },
  ];
  // a stage counts as finished at 80%: perfection isn't needed to move on
  const firstOpen = stages.findIndex((s) => s.pct < 80);
  const current = firstOpen === -1 ? stages.length : firstOpen;

  // next lesson: first unfinished lesson in the first unfinished course on the zero-to-pro path
  const pathCourse = BEGINNER_PATH.flatMap((s) => s.courses).map(course).find((c) => c && c.next);
  const nextProblem = order.map((id) => problems[id]).find((p) => status[p.id] !== "solved");
  const next: NextStep[] = [];
  if (pathCourse?.next)
    next.push({ kind: "Lesson", title: pathCourse.next.title, note: `${pathCourse.title} · ${pathCourse.done}/${pathCourse.total} done`, href: `/learn/${pathCourse.slug}/${pathCourse.next.slug}` });
  if (nextProblem)
    next.push({ kind: "Problem", title: nextProblem.title, note: `${categoryOf(nextProblem)} · ${nextProblem.difficulty}`, href: `/practice/problems/${nextProblem.id}` });
  if (!targetCompanies.length) next.push({ kind: "Companies", title: "Choose your target companies", note: "Your prep plan follows the rounds they run", href: "/profile/target-companies" });
  else {
    const tool = checklist.find((c) => !c.done && c.href.startsWith("/tools/"));
    next.push(
      tool
        ? { kind: "Tool", title: tool.label, note: "Part of getting interview-ready", href: tool.href }
        : { kind: "Companies", title: `Review ${targetCompanies[0]}'s rounds`, note: "See the prep plan for each round", href: "/companies" }
    );
  }

  return { checklist, stages, current, next };
}

/** The journey as a Mermaid flowchart: finished stages ticked, the current one marked. */
export function journeyDiagram(stages: JourneyStage[], current: number): string {
  const nodes = stages.map((s, i) => {
    const mark = i < current ? "✓ " : i === current ? "▶ " : "";
    const here = i === current ? "<br/>you are here" : "";
    return `  J${i}["${mark}${s.name}<br/>${s.pct}%${here}"]`;
  });
  return ["flowchart LR", ...nodes, `  ${stages.map((_, i) => `J${i}`).join(" --> ")} --> O(["Offer"])`, current < stages.length ? `  style J${current} stroke-width:3px` : ""]
    .filter(Boolean)
    .join("\n");
}
