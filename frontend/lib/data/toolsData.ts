import {
  ToolCategory,
  CoreToolItem,
  InterviewUtilityItem,
  CalculatorTrackerItem,
} from "@/types";

// Every tool listed here has a working page under app/tools. The ten placeholder tools that
// were never built (coding timer, bullet generator, HR practice, DSA tracker and others) were dropped.

export const corePlacementTools: CoreToolItem[] = [
  {
    id: "cp-1",
    title: "DSA Visualizer",
    description: "Step through sorting and searching algorithms and watch each comparison and swap.",
    category: "coding",
    tag: "Coding",
    codeAst: "Step-by-step animation",
    href: "/tools/dsa-visualizer",
  },
  {
    id: "cp-2",
    title: "Resume Analyzer",
    description: "Compare PDF or pasted resume text with a target company and role.",
    category: "resume",
    tag: "Resume & Career",
    codeAst: "PDF / Text + Structured Report",
    href: "/tools/resume-analyzer",
  },
  {
    id: "cp-3",
    title: "SQL Playground",
    description: "Practice queries against sample schemas, executed in your browser.",
    category: "sql",
    tag: "SQL",
    codeAst: "SQLite In-Memory",
    href: "/tools/sql-playground",
  },
  {
    id: "cp-4",
    title: "Technical Question Drill",
    description: "Flashcard drill from every course's question bank; misses go to your review queue.",
    category: "interview",
    tag: "Interview",
    codeAst: "13 courses, spaced repetition",
    href: "/tools/tech-questions",
  },
  {
    id: "cp-5",
    title: "Aptitude Pacing Timer",
    description: "Time each question in a section and see where you lose minutes.",
    category: "aptitude",
    tag: "Aptitude",
    codeAst: "Per-question laps",
    href: "/tools/aptitude-timer",
  },
  {
    id: "cp-6",
    title: "Company Prep Sheet",
    description: "One printable page per company: reported process, topics to cover and your progress on them.",
    category: "placement",
    tag: "Placement",
    codeAst: "Sourced profiles",
    href: "/tools/company-prep",
  },
  {
    id: "cp-7",
    title: "Placement Readiness",
    description: "A readiness score per subject from your real lesson progress, test scores and review queue.",
    category: "placement",
    tag: "Placement",
    codeAst: "From your own data",
    href: "/tools/readiness-calculator",
  },
];

export const interviewUtilities: InterviewUtilityItem[] = [
  {
    id: "iu-1",
    title: "Mock Interview Simulator",
    description: "VOICE & CODING",
    tag: "VOICE & CODING",
    durationOrStep: "30–45 min",
    meta: "Role-based questions",
    actionLabel: "Launch Simulator ↗",
    href: "/tools/interview-simulator",
    isPrimaryAction: true,
  },
  {
    id: "iu-2",
    title: "STAR Answer Builder",
    description: "FRAMEWORK",
    tag: "FRAMEWORK",
    durationOrStep: "4-Step",
    meta: "Speaking-time estimate",
    actionLabel: "Build Story",
    href: "/tools/star-builder",
  },
  {
    id: "iu-3",
    title: "Technical Question Drill",
    description: "FLASHCARDS",
    tag: "FLASHCARDS",
    durationOrStep: "10–30 cards",
    meta: "Feeds your review queue",
    actionLabel: "Start Drill",
    href: "/tools/tech-questions",
  },
];

export const calculatorsTrackers: CalculatorTrackerItem[] = [
  {
    id: "ct-1",
    title: "CGPA → %",
    subtitle: "CONVERTER",
    description: "CONVERTER",
    tag: "CONVERTER",
    actionLabel: "Calculate →",
    href: "/tools/cgpa-converter",
  },
  {
    id: "ct-2",
    title: "Readiness %",
    subtitle: "DIAGNOSTIC",
    description: "DIAGNOSTIC",
    tag: "DIAGNOSTIC",
    actionLabel: "Inspect →",
    href: "/tools/readiness-calculator",
  },
  {
    id: "ct-3",
    title: "Pacing Timer",
    subtitle: "STOPWATCH",
    description: "STOPWATCH",
    tag: "STOPWATCH",
    actionLabel: "Start →",
    href: "/tools/aptitude-timer",
  },
];

/** Title and badge for every tool page, used by the real "Continue using" list. */
export const TOOL_REGISTRY: Record<string, { title: string; badge: string }> = {
  "/tools/dsa-visualizer": { title: "DSA Visualizer", badge: "CODING" },
  "/tools/resume-analyzer": { title: "Resume Analyzer", badge: "RESUME" },
  "/tools/sql-playground": { title: "SQL Playground", badge: "SQL" },
  "/tools/interview-simulator": { title: "Mock Interview Simulator", badge: "INTERVIEW" },
  "/tools/tech-questions": { title: "Technical Question Drill", badge: "FLASHCARDS" },
  "/tools/aptitude-timer": { title: "Aptitude Pacing Timer", badge: "STOPWATCH" },
  "/tools/company-prep": { title: "Company Prep Sheet", badge: "PLACEMENT" },
  "/tools/readiness-calculator": { title: "Placement Readiness", badge: "DIAGNOSTIC" },
  "/tools/cgpa-converter": { title: "CGPA Converter", badge: "CALCULATOR" },
  "/tools/star-builder": { title: "STAR Answer Builder", badge: "INTERVIEW" },
};

export const toolsCategories: { id: ToolCategory; label: string; count: number }[] = (
  [
    { id: "all", label: "All Tools" },
    { id: "coding", label: "Coding" },
    { id: "interview", label: "Interview" },
    { id: "resume", label: "Resume & Career" },
    { id: "aptitude", label: "Aptitude" },
    { id: "sql", label: "SQL" },
    { id: "placement", label: "Placement" },
    { id: "productivity", label: "Productivity" },
  ] as { id: ToolCategory; label: string }[]
)
  .map((c) => ({
    ...c,
    count: c.id === "all" ? corePlacementTools.length : corePlacementTools.filter((t) => t.category === c.id).length,
  }))
  .filter((c) => c.id === "all" || c.count > 0);
