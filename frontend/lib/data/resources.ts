import { Resource } from "@/types";

export const resources: Resource[] = [
  {
    title: "Java OOP Complete Engineering Notes",
    category: "Java",
    difficulty: "Beginner",
    time: "45 min read",
    detail: "v2.4 · 12 code snippets",
    description:
      "Heap vs stack memory layout, dynamic dispatch under the hood, the diamond problem, and immutable object patterns.",
  },
  {
    title: "SQL Interview Query Handbook",
    category: "SQL",
    difficulty: "Intermediate",
    time: "1h 20m read",
    detail: "v3.1 · 45 queries tested",
    description:
      "Recursive CTEs, cumulative sums, consecutive-attendance sequences, Nth-highest-salary edge cases, self-joins.",
  },
  {
    title: "DSA Pattern Recognition Guide",
    category: "DSA",
    difficulty: "Intermediate",
    time: "3h intensive",
    detail: "v4.0 · Python / C++ / Java",
    description:
      "Monotonic deques, DP state design, cycle detection, and union-find graph clustering, grouped by pattern.",
  },
  {
    title: "OS: Concurrency & Virtual Memory",
    category: "OS",
    difficulty: "Advanced",
    time: "55 min read",
    detail: "v2.1 · 18 diagrams",
    description:
      "Page-replacement algorithms, TLB cache invalidation, semaphore vs mutex deadlocks, and IPC via shared memory.",
  },
  {
    title: "Computer Networks Essentials for SDE-1",
    category: "Computer Networks",
    difficulty: "Beginner",
    time: "40 min read",
    detail: "v1.9 · packet traces",
    description:
      "The lifecycle of a URL request — TCP handshake, TLS key exchange, DNS resolution, HTTP/2 vs HTTP/3.",
  },
  {
    title: "System Design SDE-1 Primer",
    category: "System Design",
    difficulty: "Intermediate",
    time: "1h 10m read",
    detail: "v3.0 · high-level blueprints",
    description:
      "Designing a URL shortener, token-bucket rate limiters, cache strategies, and event-driven basics.",
  },
];

export const resourceCategories = [
  "All",
  ...Array.from(new Set(resources.map((r) => r.category))),
];
