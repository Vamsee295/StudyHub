// Turning a company's hiring process into a study plan: what each kind of round checks, how to prepare,
// and which StudyHub lessons, practice topics and tools cover each topic a round lists.
// External links were checked live (HTTP 200) on 2026-11-26.
import { categoryOf, problems, type ProblemCategory } from "@/lib/problems/problemRegistry";

export interface PrepLink {
  label: string;
  href: string;
  topic?: ProblemCategory; // a Practice topic, so progress can be shown
}

export interface RoundType {
  name: string;
  checks: string;
  prep: string;
  links: PrepLink[];
}

const practice = (topic: ProblemCategory): PrepLink => ({ label: `Practice: ${topic}`, href: `/practice/problems?topic=${encodeURIComponent(topic)}`, topic });

/** Every kind of round a campus candidate meets, explained for someone who has never interviewed. */
export const ROUND_TYPES: RoundType[] = [
  {
    name: "Online assessment (OA)",
    checks: "Can you solve 2–3 coding problems correctly within a time limit, usually on HackerRank, Codility or the company's own platform?",
    prep: "Solve easy then medium problems with a timer. Read constraints first; they hint at the expected complexity. Test edge cases before submitting.",
    links: [{ label: "Practice path", href: "/practice" }, practice("Arrays"), practice("Strings")],
  },
  {
    name: "Aptitude test",
    checks: "Speed and accuracy on quantitative maths, logical reasoning and English, the first filter at most mass-hiring companies.",
    prep: "Learn the standard shortcuts per topic, then practise under time pressure. Skip questions that take too long and come back later.",
    links: [{ label: "Quantitative aptitude", href: "/learn/quantitative-aptitude" }, { label: "Logical reasoning", href: "/learn/logical-reasoning" }, { label: "Aptitude timer", href: "/tools/aptitude-timer" }],
  },
  {
    name: "DSA interview",
    checks: "How you think: clarifying the problem, starting with brute force, improving it, explaining complexity, and writing clean code while talking.",
    prep: "Learn the patterns (each Practice topic has a guide), then solve problems out loud. Always say the time and space complexity.",
    links: [{ label: "DSA course", href: "/learn/dsa" }, practice("Trees"), practice("Graphs")],
  },
  {
    name: "Machine coding",
    checks: "Building a small working app or module (a parking lot, an expense splitter) in 60–120 minutes with clean, extensible code.",
    prep: "Practise designing classes before coding, keep methods small, and make it run end to end first, then refine.",
    links: [{ label: "OOP course", href: "/learn/oop" }, { label: "SOLID principles", href: "/learn/oop/single-responsibility-principle" }],
  },
  {
    name: "Low-level design (LLD)",
    checks: "Turning requirements into classes, interfaces and relationships, using OOP principles and design patterns sensibly.",
    prep: "Practise designing common systems (LRU cache, parking lot, library) on paper: entities, relationships, key methods.",
    links: [{ label: "OOP course", href: "/learn/oop" }, { label: "Design patterns", href: "/learn/oop/oop-design-patterns-and-interview-traps" }],
  },
  {
    name: "System design (HLD)",
    checks: "Designing a large system: APIs, storage, caching, scaling and trade-offs. Usually for experienced roles, but freshers get lighter versions.",
    prep: "Learn the building blocks, then follow one framework every time: requirements, estimates, API, high-level design, deep dive.",
    links: [{ label: "System design course", href: "/learn/system-design" }, { label: "Interview framework", href: "/learn/system-design/system-design-interview-framework" }],
  },
  {
    name: "Core CS",
    checks: "Fundamentals: OS (processes, deadlocks, memory), DBMS and SQL, computer networks, OOP. Common in service companies and for freshers.",
    prep: "Revise the most-asked topics per subject and practise explaining each in two minutes with an example.",
    links: [{ label: "Operating systems", href: "/learn/os" }, { label: "DBMS", href: "/learn/dbms" }, { label: "Computer networks", href: "/learn/computer-networks" }],
  },
  {
    name: "Behavioural / HR",
    checks: "Teamwork, ownership and how you handle problems, through stories from your projects and experience. Amazon calls these Leadership Principles.",
    prep: "Prepare 5–6 stories in the STAR format (Situation, Task, Action, Result) that can answer many questions.",
    links: [{ label: "STAR story builder", href: "/tools/star-builder" }, { label: "Mock interview", href: "/tools/interview-simulator" }],
  },
  {
    name: "Hiring manager / bar raiser",
    checks: "A senior interviewer checking overall fit and raising the bar: deeper follow-ups on your projects, design and behaviour.",
    prep: "Know every line of your resume and project. Be ready to discuss trade-offs and what you'd do differently.",
    links: [{ label: "Resume analyser", href: "/tools/resume-analyzer" }, { label: "Mock interview", href: "/tools/interview-simulator" }],
  },
];

/** Two typical pipelines, drawn on the Companies page. */
export const PIPELINES: { title: string; diagram: string; caption: string }[] = [
  {
    title: "Product companies (Google, Microsoft, Amazon…)",
    diagram: `flowchart LR
  R["Resume shortlist"] --> O["Online assessment<br/>2–3 coding problems"] --> T["2–3 technical interviews<br/>DSA · LLD"] --> H["Hiring manager /<br/>behavioural"] --> F(["Offer"])`,
    caption: "Coding-heavy: most of the weight is on DSA interviews.",
  },
  {
    title: "Mass-hiring IT (TCS, Infosys, Cognizant…)",
    diagram: `flowchart LR
  A["Aptitude + coding test<br/>(NQT, AMCAT, InfyTQ…)"] --> T["Technical interview<br/>core CS · projects · basic coding"] --> H["HR interview"] --> F(["Offer"])`,
    caption: "The aptitude test is the big filter; interviews are broader but lighter.",
  },
];

// Topic words in a round's tags → where to study them. Checked in order; the first match wins per tag.
const TAG_LINKS: [RegExp, PrepLink][] = [
  [/^arrays?$/i, practice("Arrays")],
  [/^strings?$/i, practice("Strings")],
  [/sort/i, practice("Sorting")],
  [/hash/i, practice("Hashing")],
  [/linked/i, practice("Linked List")],
  [/tree|bst|trie/i, practice("Trees")],
  [/heap|priority/i, practice("Heap")],
  [/graph/i, practice("Graphs")],
  [/^dp$|dynamic/i, practice("Dynamic Programming")],
  [/math|simulation/i, practice("Basics")],
  [/^dsa$|problem solving|data structures|algorithm|complexity/i, { label: "DSA course", href: "/learn/dsa" }],
  [/machine coding/i, { label: "OOP course", href: "/learn/oop" }],
  [/lld|ood|design pattern|uml|object/i, { label: "OOP: design patterns", href: "/learn/oop/oop-design-patterns-and-interview-traps" }],
  [/system design|hld|database|caching|load balanc|scal/i, { label: "System design course", href: "/learn/system-design" }],
  [/sql/i, { label: "SQL course", href: "/learn/sql" }],
  [/core cs|\bos\b|operating/i, { label: "Operating systems", href: "/learn/os" }],
  [/aptitude|quant/i, { label: "Quantitative aptitude", href: "/learn/quantitative-aptitude" }],
  [/logic|reasoning|puzzle/i, { label: "Logical reasoning", href: "/learn/logical-reasoning" }],
  [/verbal|communication|english/i, { label: "Verbal ability", href: "/learn/verbal-ability" }],
  [/pseudo/i, { label: "Programming fundamentals", href: "/learn/programming-fundamentals" }],
  [/^lp$|leadership|behaviou?ral|culture|values|experience|^hr$|fit/i, { label: "STAR story builder", href: "/tools/star-builder" }],
  [/project/i, { label: "Resume analyser", href: "/tools/resume-analyzer" }],
];

/** Where to study the topics one round lists (deduplicated). */
export function prepFor(tags: string[]): PrepLink[] {
  const out: PrepLink[] = [];
  for (const tag of tags) {
    const link = TAG_LINKS.find(([re]) => re.test(tag.trim()))?.[1];
    if (link && !out.some((l) => l.href === link.href)) out.push(link);
  }
  return out;
}

const norm = (s: string) => s.toLowerCase().replace(/^sql:\s*/, "").replace(/[^a-z0-9]+/g, " ").trim();
let titleIndex: Map<string, string> | null = null;

/** The problem in our bank with this title, if any ("Number of Islands" → its id). */
export function problemIdForTitle(title: string): string | undefined {
  titleIndex ??= new Map(Object.values(problems).map((p) => [norm(p.title), p.id]));
  return titleIndex.get(norm(title));
}

/** Where to go for a sample question we don't have as a coding problem, by its domain. */
export function fallbackFor(domain: string): { label: string; href: string } {
  if (/sql/i.test(domain)) return { label: "SQL lab", href: "/practice/sql" };
  if (/design/i.test(domain)) return { label: "OOP: design patterns", href: "/learn/oop/oop-design-patterns-and-interview-traps" };
  if (/core cs|os|operating/i.test(domain)) return { label: "Operating systems", href: "/learn/os" };
  return { label: "Problem set", href: "/practice/problems" };
}

/** Practice topic progress, for prep links that point at a topic. */
export function topicProgress(topic: ProblemCategory, solved: Record<string, string>) {
  const ids = Object.values(problems).filter((p) => categoryOf(p) === topic).map((p) => p.id);
  return { done: ids.filter((id) => solved[id] === "solved").length, total: ids.length };
}

/** General interview preparation, beyond any one company. */
export const INTERVIEW_RESOURCES: { title: string; url: string; why: string }[] = [
  { title: "Tech Interview Handbook: coding interviews", url: "https://www.techinterviewhandbook.org/coding-interview-prep/", why: "How to prepare and what to do in the room." },
  { title: "Tech Interview Handbook: behavioural interviews", url: "https://www.techinterviewhandbook.org/behavioral-interview/", why: "Common questions and how to structure answers." },
  { title: "Amazon Leadership Principles", url: "https://www.amazon.jobs/content/en/our-workplace/leadership-principles", why: "The values behind Amazon's behavioural questions." },
  { title: "The System Design Primer", url: "https://github.com/donnemartin/system-design-primer", why: "The standard free guide for design rounds." },
];

/** A Mermaid diagram of a company's rounds, from its hiring stages. */
export function stagesDiagram(stages: { stageNumber: number; title: string; duration: string }[]): string {
  const clean = (s: string) => s.replace(/"/g, "#quot;").replace(/&/g, "and");
  const nodes = stages.map((s) => `  S${s.stageNumber}["${s.stageNumber}. ${clean(s.title)}<br/>${clean(s.duration)}"]`);
  const chain = stages.map((s) => `S${s.stageNumber}`).join(" --> ");
  return ["flowchart LR", ...nodes, `  ${chain} --> OFFER(["Offer"])`].join("\n");
}
