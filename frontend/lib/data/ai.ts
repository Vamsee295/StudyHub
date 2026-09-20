import { DashboardSkill } from "@/types";

export const aiRoles = [
  { value: "swe", label: "Software Engineer (SDE-1)" },
  { value: "data", label: "Data Engineer" },
  { value: "ai", label: "AI / ML Engineer" },
] as const;

export type AIRoleValue = (typeof aiRoles)[number]["value"];

export const aiTargets = [
  { value: "campus26", label: "Campus Placements 2026" },
  { value: "offcampus", label: "Off-Campus Product Hiring" },
  { value: "tier1", label: "Tier-1 Product Companies" },
];

export const aiTimelines = [
  { value: "45", label: "45 Days Sprint" },
  { value: "90", label: "90 Days Deep Prep" },
  { value: "120", label: "120 Days Full Cycle" },
];

export const aiBaselines = [
  { value: "beginner", label: "Beginner (starting fresh)" },
  { value: "intermediate", label: "Intermediate (knows the basics)" },
  { value: "advanced", label: "Advanced (revising patterns)" },
];

export interface AIPlanStage {
  label: string;
  title: string;
  description: string;
  metric: string;
}

export const planLibrary: Record<AIRoleValue, AIPlanStage[]> = {
  swe: [
    {
      label: "Weeks 1–2",
      title: "Data Structures & SQL Foundations",
      description:
        "Two pointers, sliding windows, fast/slow pointers, plus SQL group-by and window aggregates.",
      metric: "Target: 35 problems",
    },
    {
      label: "Weeks 3–4",
      title: "Non-Linear Structures & Database Internals",
      description: "Binary trees, BFS/DFS, Dijkstra basics, and normalization plus ACID locking.",
      metric: "Target: 40 problems",
    },
    {
      label: "Week 5",
      title: "Core CS: OS Concurrency & Networks",
      description: "Deadlocks, page-fault simulations, TCP handshake teardown, HTTP/3 basics.",
      metric: "Target: 18 notes reviewed",
    },
    {
      label: "Week 6",
      title: "Mock Assessments & Resume Fine-Tuning",
      description: "Full-length timed mocks, behavioral rehearsal, and company blueprint checks.",
      metric: "Target: 3 mock assessments",
    },
  ],
  data: [
    {
      label: "Stage 01",
      title: "Advanced SQL & Dimensional Modeling",
      description: "Star and snowflake schemas, slowly changing dimensions (types 1 & 2).",
      metric: "50 queries",
    },
    {
      label: "Stage 02",
      title: "Distributed Computing Basics",
      description: "DataFrames, partitions, shuffle operations, and memory tuning fundamentals.",
      metric: "12 pipelines",
    },
    {
      label: "Stage 03",
      title: "Streaming & Orchestration",
      description: "Event brokers, consumer lag, DAG scheduling, and idempotent retries.",
      metric: "Production-style rig",
    },
  ],
  ai: [
    {
      label: "Stage 01",
      title: "Linear Algebra & Tensor Fundamentals",
      description: "Matrix multiplication, eigenvalues, and automatic differentiation basics.",
      metric: "15 notebooks",
    },
    {
      label: "Stage 02",
      title: "Deep Learning Architectures",
      description: "Self-attention, multi-head attention from scratch, transformer decoder blocks.",
      metric: "4 projects",
    },
    {
      label: "Stage 03",
      title: "Model Serving & Optimization",
      description: "Deployment basics, fine-tuning, and latency benchmarking fundamentals.",
      metric: "Evaluation ready",
    },
  ],
};

export const dashboardSkills: DashboardSkill[] = [
  { name: "DSA & Algorithms", value: 72 },
  { name: "Java & OOP Principles", value: 85 },
  { name: "SQL & Databases", value: 90 },
  { name: "DBMS Core Theory", value: 68 },
  { name: "Operating Systems", value: 60 },
  { name: "Quantitative Aptitude", value: 80 },
];

export const dashboardStats = {
  readiness: 78,
  streakDays: 14,
  problemsSolved: 168,
  problemsTarget: 200,
  nextTask: "Solve 3 graph-traversal questions (Medium) — targeting an Amazon-style SDE OA.",
};
