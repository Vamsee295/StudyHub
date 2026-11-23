// Concept graph: nodes are course modules; edges are "builds on" relations.
// Edges come from (1) each course's own module order, (2) explicit lesson prerequisite sections,
// and (3) curated cross-course links, each with a stated reason.
import { ALL_COURSES } from "@/lib/data/courses/index";

export interface GraphNode {
  id: string;            // `${course}:${module}`
  course: string;
  courseTitle: string;
  module: string;
  title: string;
  lessons: { slug: string; id: string; title: string }[];
}
export interface GraphEdge { from: string; to: string; kind: "sequence" | "prerequisite" | "cross"; reason: string }

// from → to means "to builds on from".
export const CROSS_LINKS: [string, string, string][] = [
  ["programming-fundamentals:arrays", "dsa:arrays", "DSA array techniques assume fluent loops and array syntax"],
  ["programming-fundamentals:strings", "dsa:strings", "String algorithms build on basic String methods"],
  ["programming-fundamentals:problem-solving", "dsa:recursion-and-backtracking", "Backtracking extends basic recursion"],
  ["programming-fundamentals:methods", "oop:oop-fundamentals", "Classes group fields with the methods that use them"],
  ["programming-fundamentals:memory-and-execution", "oop:oop-fundamentals", "Objects live on the heap and are reached through references"],
  ["oop:oop-fundamentals", "dsa:linked-list", "Linked lists are objects connected by references"],
  ["dsa:dsa-fundamentals", "system-design:sd-foundations", "Big-O thinking scales up to capacity estimates"],
  ["dsa:hashing", "dbms:indexing", "Hash indexes reuse hash tables"],
  ["dsa:trees", "dbms:indexing", "B+ tree indexes extend search trees"],
  ["dsa:graphs", "computer-networks:network-layer", "Routing protocols run Dijkstra and Bellman-Ford"],
  ["dsa:graphs", "dbms:concurrency-control", "Precedence and wait-for graphs detect conflicts and deadlocks"],
  ["dsa:queue", "os:cpu-scheduling", "Ready queues and Round Robin are queue applications"],
  ["dsa:heaps", "os:cpu-scheduling", "Priority scheduling picks from a priority queue"],
  ["dsa:hashing", "system-design:sd-data", "Caches and consistent hashing build on hashing"],
  ["dbms:relational-model", "sql:sql-basics", "SQL implements the relational model"],
  ["dbms:relational-algebra", "sql:joins", "Joins are relational algebra operators"],
  ["dbms:normalization", "sql:database-design", "Schema design applies normalization"],
  ["dbms:transactions", "sql:database-design", "SQL transactions put ACID into practice"],
  ["os:synchronization", "dbms:concurrency-control", "Locks, deadlocks and waiting reappear inside databases"],
  ["os:file-systems", "dbms:indexing", "Indexes are laid out in disk blocks and pages"],
  ["dbms:nosql-and-scaling", "system-design:sd-data", "Replication, sharding and CAP are the core of data design"],
  ["dbms:transactions", "system-design:sd-data", "Consistency choices start from ACID"],
  ["computer-networks:transport-layer", "system-design:sd-networking", "Load balancers work at layer 4 or layer 7"],
  ["computer-networks:application-layer", "system-design:sd-networking", "DNS and HTTP underpin CDNs, proxies and APIs"],
  ["os:threads", "system-design:sd-async-reliability", "Thread pools and bulkheads come from concurrency basics"],
  ["quantitative-aptitude:arithmetic", "data-interpretation:basic-di", "Data interpretation runs on percentages, ratios and averages"],
  ["quantitative-aptitude:number-fundamentals", "logical-reasoning:patterns", "Number series use divisibility and number properties"],
  ["quantitative-aptitude:advanced-aptitude", "placement-aptitude:company-specific", "Company tests combine quantitative sections"],
  ["logical-reasoning:advanced-reasoning", "placement-aptitude:company-specific", "Company tests include reasoning sections"],
  ["verbal-ability:comprehension", "placement-aptitude:company-specific", "Company tests include verbal sections"],
];

export function buildConceptGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const key = new Set<string>();
  const add = (e: GraphEdge) => {
    const k = `${e.from}>${e.to}`;
    if (e.from === e.to || key.has(k)) return;
    key.add(k);
    edges.push(e);
  };

  for (const c of ALL_COURSES) {
    c.modules.forEach((m, i) => {
      nodes.push({
        id: `${c.slug}:${m.slug}`, course: c.slug, courseTitle: c.title, module: m.slug, title: m.title,
        lessons: m.lessons.map((l) => ({ slug: l.slug, id: l.id, title: l.title })),
      });
      if (i > 0) add({ from: `${c.slug}:${c.modules[i - 1].slug}`, to: `${c.slug}:${m.slug}`, kind: "sequence", reason: `Next module in ${c.title}` });
      // Explicit prerequisite sections link to modules of the same course by slug.
      for (const l of m.lessons) for (const s of l.content.sections ?? []) {
        if (s.type !== "prerequisites") continue;
        for (const link of s.links ?? []) {
          if (c.modules.some((x) => x.slug === link.slug)) add({ from: `${c.slug}:${link.slug}`, to: `${c.slug}:${m.slug}`, kind: "prerequisite", reason: `Listed as a prerequisite of "${l.title}"` });
        }
      }
    });
  }
  for (const [from, to, reason] of CROSS_LINKS) add({ from, to, kind: "cross", reason });
  return { nodes, edges };
}
