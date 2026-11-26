// The tools on /tools. Every entry has a working page under app/tools, and each tool appears once.
// SQL practice lives in Practice → SQL Lab (the tables the SQL lessons use), so it isn't repeated here.

export type ToolGroup = "Interview prep" | "Resume & companies" | "Coding" | "Calculators & trackers";

export interface ToolItem {
  href: string;
  title: string;
  /** One line on what you do with it. */
  description: string;
  /** Short mono label: what powers it or what you get. */
  meta: string;
  badge: string;
  group: ToolGroup;
}

export const TOOL_GROUPS: { name: ToolGroup; blurb: string }[] = [
  { name: "Interview prep", blurb: "Practise answering out loud before the real rounds." },
  { name: "Resume & companies", blurb: "Get your resume and your target list ready." },
  { name: "Coding", blurb: "See algorithms run step by step." },
  { name: "Calculators & trackers", blurb: "Quick numbers for forms, readiness and test pacing." },
];

export const TOOLS: ToolItem[] = [
  {
    href: "/tools/interview-simulator",
    title: "Mock Interview",
    description: "Answer real interview questions from the courses, then compare with a model answer and the trap interviewers look for.",
    meta: "Questions from 8 courses",
    badge: "INTERVIEW",
    group: "Interview prep",
  },
  {
    href: "/tools/tech-questions",
    title: "Question Drill",
    description: "A quick multiple-choice drill across every course's question bank. Misses join your review queue.",
    meta: "13 courses · spaced repetition",
    badge: "FLASHCARDS",
    group: "Interview prep",
  },
  {
    href: "/tools/star-builder",
    title: "STAR Answer Builder",
    description: "Shape behavioural stories as Situation, Task, Action, Result, with a speaking-time estimate.",
    meta: "Saved to your account",
    badge: "HR ROUND",
    group: "Interview prep",
  },
  {
    href: "/tools/resume-analyzer",
    title: "Resume Analyzer",
    description: "Check a PDF or pasted resume against a target company and role: skills, formatting and gaps.",
    meta: "PDF or text",
    badge: "RESUME",
    group: "Resume & companies",
  },
  {
    href: "/tools/company-prep",
    title: "Company Prep Sheet",
    description: "One printable page per company: the reported process, topics to cover and your progress on them.",
    meta: "Sourced company profiles",
    badge: "COMPANIES",
    group: "Resume & companies",
  },
  {
    href: "/tools/dsa-visualizer",
    title: "DSA Visualizer",
    description: "Step through sorting and searching algorithms and watch every comparison and swap.",
    meta: "5 algorithms",
    badge: "CODING",
    group: "Coding",
  },
  {
    href: "/tools/cgpa-converter",
    title: "CGPA to Percentage",
    description: "Convert a 10-point CGPA with a common formula or the one your university prints.",
    meta: "3 conventions + custom",
    badge: "CALCULATOR",
    group: "Calculators & trackers",
  },
  {
    href: "/tools/readiness-calculator",
    title: "Placement Readiness",
    description: "A readiness score per subject from your real lessons, mock tests and review queue.",
    meta: "From your own data",
    badge: "DIAGNOSTIC",
    group: "Calculators & trackers",
  },
  {
    href: "/tools/aptitude-timer",
    title: "Aptitude Pacing Timer",
    description: "Time each question in a section and see exactly where the minutes went.",
    meta: "Per-question laps",
    badge: "STOPWATCH",
    group: "Calculators & trackers",
  },
];

/** Title and badge for every tool page, used by the "Continue where you left off" list. */
export const TOOL_REGISTRY: Record<string, { title: string; badge: string }> = Object.fromEntries(
  TOOLS.map((t) => [t.href, { title: t.title, badge: t.badge }])
);
