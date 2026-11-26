import { RoadmapStage } from "@/types";
import { roadmapModules } from "./roadmapModules";

// The landing page's stage explorer. Built from roadmapModules (the /roadmaps data) so the two can't
// drift apart. `preview` is a short, accurate summary of each course's modules; the landing page is
// client-side and doesn't load the full course content just to list module titles.
const preview: Record<string, string[]> = {
  "programming-fundamentals": ["Variables and data types", "Operators, input and output", "Control flow and loops", "Arrays and strings", "Methods and recursion", "Stack, heap and how code runs"],
  oop: ["Classes and objects", "Encapsulation and constructors", "Inheritance and polymorphism", "Abstraction and interfaces", "SOLID principles"],
  sql: ["SELECT and filtering", "Functions and GROUP BY", "Joins and subqueries", "Window functions", "Schema design", "Placement-style queries"],
  dsa: ["Arrays, strings and hashing", "Linked lists, stacks and queues", "Trees and heaps", "Graphs", "Recursion and backtracking", "Dynamic programming"],
  dbms: ["ER modelling and normalization", "Transactions and ACID", "Concurrency control and recovery", "B+ tree indexing", "NoSQL and the CAP theorem"],
  os: ["Processes and threads", "CPU scheduling", "Synchronization and deadlocks", "Memory management and paging", "File systems"],
  "computer-networks": ["OSI and TCP/IP models", "IP addressing and subnetting", "TCP and UDP", "DNS and HTTP", "Network security basics"],
  "online-assessment": ["Quantitative aptitude", "Logical reasoning", "Verbal ability", "Data interpretation", "Timed coding"],
  "technical-interview": ["Thinking aloud while coding", "Questions on your projects", "Core-subject follow-ups", "System design: storage, caching, queues", "Design walkthroughs"],
};

export const roadmap: RoadmapStage[] = roadmapModules.map((m) => ({
  id: m.slug,
  title: m.title,
  phase: m.badge,
  description: m.description,
  topics: m.topics ?? preview[m.slug] ?? [],
  courses: m.courses,
  sampleQuestion: m.interviewQuestion.question,
}));
