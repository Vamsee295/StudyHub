// Lesson-level prerequisites: what to know before a lesson.
// Three sources: the previous lesson in the course, curated lesson-to-lesson links (below),
// and, on a module's first lesson, the cross-course module links from the concept graph.
import { ALL_COURSES } from "@/lib/data/courses/index";
import { CROSS_LINKS } from "@/lib/learn/conceptGraph";

// [prerequisite "course/lesson", lesson "course/lesson", reason]
export const LESSON_PREREQS: [string, string, string][] = [
  // DSA builds on Programming Fundamentals
  ["programming-fundamentals/traversing-arrays", "dsa/two-sum-lesson", "Two Sum starts from a plain array traversal"],
  ["programming-fundamentals/searching-arrays", "dsa/two-sum-lesson", "Linear search is the brute-force baseline Two Sum improves on"],
  ["programming-fundamentals/basic-string-problems", "dsa/palindromes-and-anagrams", "Covers two-pointer palindromes and frequency counting at a basic level"],
  ["programming-fundamentals/charat-method", "dsa/strings-in-java", "String algorithms index characters with charAt"],
  ["programming-fundamentals/nested-loops", "dsa/analyzing-time-complexity", "Nested loops are the first O(n²) pattern to analyse"],
  ["programming-fundamentals/what-is-recursion", "dsa/recursion-fundamentals", "Introduces base and recursive cases"],
  ["programming-fundamentals/stack-memory", "dsa/recursion-fundamentals", "Each recursive call adds a stack frame"],
  ["programming-fundamentals/basic-recursion-problems", "dsa/subsets-and-permutations", "Subsets extend the include/exclude recursion pattern"],
  ["programming-fundamentals/basic-recursion-problems", "dsa/dp-introduction", "Memoized Fibonacci is the first dynamic programming example"],
  ["programming-fundamentals/two-dimensional-arrays", "dsa/two-dimensional-dp", "2D DP tables are 2D arrays filled row by row"],
  ["dsa/hashing-patterns", "dsa/prefix-sum-with-hashmap", "Uses HashMap counting patterns"],
  ["dsa/queue-basics-circular-queue", "dsa/bfs-and-dfs", "BFS visits nodes in queue order"],
  ["dsa/stack-basics", "dsa/bfs-and-dfs", "Iterative DFS uses an explicit stack"],
  ["dsa/heap-basics", "dsa/dijkstra-shortest-path", "Dijkstra picks the nearest node from a priority queue"],
  ["dsa/binary-tree-traversals", "dsa/binary-search-trees", "BST in-order traversal yields sorted order"],
  ["dsa/bfs-and-dfs", "dsa/topological-sort", "Topological sort is DFS or BFS with in-degrees"],

  // OOP builds on Programming Fundamentals
  ["programming-fundamentals/heap-memory", "oop/stack-vs-heap-objects", "Introduces the heap where objects live"],
  ["programming-fundamentals/method-overloading-basics", "oop/method-overloading", "Covers overload resolution at a basic level"],
  ["programming-fundamentals/method-parameters", "oop/the-this-keyword", "Parameters that shadow fields are why this exists"],
  ["programming-fundamentals/constants", "oop/final-keyword-advanced", "Introduces final variables and constants"],
  ["oop/what-is-inheritance", "oop/what-is-polymorphism", "Runtime polymorphism needs a class hierarchy"],
  ["oop/what-is-polymorphism", "oop/polymorphism-in-system-design", "Applies dynamic dispatch to real designs"],
  ["oop/interfaces-in-java", "oop/lambda-expressions-and-functional-interfaces", "Lambdas implement functional interfaces"],
  ["oop/abstract-class-vs-interface", "oop/interface-segregation-and-dependency-inversion", "ISP and DIP are about designing interfaces"],

  // SQL and DBMS
  ["dbms/keys-in-dbms", "sql/keys-primary-foreign-candidate", "Defines candidate, primary and foreign keys formally"],
  ["dbms/joins-and-division", "sql/inner-join-lesson", "SQL joins implement relational algebra joins"],
  ["dbms/normal-forms-1nf-2nf-3nf", "sql/normalization-in-practice", "Explains the normal forms applied in SQL schemas"],
  ["dbms/acid-properties", "sql/transactions-in-sql", "SQL transactions put ACID into practice"],
  ["dbms/b-trees-and-b-plus-trees", "sql/indexes-and-views", "Most SQL indexes are B+ trees"],
  ["sql/group-by", "sql/top-n-per-group", "Per-group queries extend GROUP BY thinking"],
  ["sql/window-functions-ranking", "sql/nth-highest-salary", "DENSE_RANK is the cleanest nth-highest solution"],
  ["sql/correlated-subqueries", "sql/duplicates-find-and-delete", "Duplicate detection often uses correlated subqueries"],
  ["dsa/binary-search-trees", "dbms/b-trees-and-b-plus-trees", "B-trees generalize binary search trees to many keys per node"],
  ["os/deadlock-conditions", "dbms/deadlocks-and-timestamps", "The same four deadlock conditions apply to database locks"],
  ["os/mutex-and-semaphores", "dbms/locking-and-2pl", "Database locks build on mutual exclusion"],

  // OS, networks and system design
  ["dsa/queue-basics-circular-queue", "os/round-robin-and-priority", "Round Robin cycles through a ready queue"],
  ["dsa/heap-basics", "os/round-robin-and-priority", "Priority scheduling picks from a priority queue"],
  ["programming-fundamentals/stack-memory", "os/context-switching", "A context switch saves and restores each thread's stack and registers"],
  ["dsa/dijkstra-shortest-path", "computer-networks/routing-algorithms", "Link-state routing runs Dijkstra"],
  ["computer-networks/dns", "system-design/dns-and-cdn", "CDN routing builds on DNS resolution"],
  ["computer-networks/tcp-vs-udp-and-ports", "system-design/load-balancers-and-reverse-proxies", "Layer 4 load balancing works on TCP and UDP connections"],
  ["computer-networks/http-and-https", "system-design/api-design", "REST APIs are built on HTTP methods and status codes"],
  ["dsa/how-hashmap-works", "system-design/consistent-hashing", "Consistent hashing extends hash-based placement"],
  ["dbms/replication-sharding-partitioning", "system-design/database-replication-and-sharding", "Covers the database side of replication and sharding"],
  ["dbms/sql-vs-nosql-and-cap", "system-design/sql-vs-nosql-choosing-storage", "Introduces the CAP trade-offs used to choose storage"],
  ["dsa/queue-basics-circular-queue", "system-design/message-queues-and-event-streaming", "Message queues are distributed FIFO queues"],

  // Aptitude
  ["quantitative-aptitude/percentages", "quantitative-aptitude/profit-and-loss", "Profit and loss are percentages of cost price"],
  ["quantitative-aptitude/percentages", "quantitative-aptitude/compound-interest", "Compound growth is successive percentage change"],
  ["quantitative-aptitude/simple-interest", "quantitative-aptitude/compound-interest", "Compound interest is compared against simple interest"],
  ["quantitative-aptitude/time-and-work", "quantitative-aptitude/pipes-and-cisterns", "Pipes problems are time and work with negative rates"],
  ["quantitative-aptitude/time-speed-distance", "quantitative-aptitude/trains", "Trains add object length to speed and distance"],
  ["quantitative-aptitude/time-speed-distance", "quantitative-aptitude/boats-and-streams", "Boats apply relative speed to moving water"],
  ["quantitative-aptitude/permutations", "quantitative-aptitude/combinations", "Combinations are permutations with order removed"],
  ["quantitative-aptitude/combinations", "quantitative-aptitude/probability", "Probability counts favourable outcomes with combinations"],
  ["quantitative-aptitude/percentages", "data-interpretation/pie-charts", "Pie charts convert between percentages and values"],
  ["quantitative-aptitude/averages", "data-interpretation/data-comparison", "Weighted averages decide many comparisons"],
  ["logical-reasoning/data-sufficiency", "data-interpretation/di-data-sufficiency", "Introduces the data sufficiency answer options"],
  ["verbal-ability/subject-verb-agreement", "verbal-ability/sentence-correction", "Agreement is the most common error in sentence correction"],
];

export interface PrereqItem {
  course: string;
  courseTitle: string;
  lesson: string;
  lessonId: string;
  title: string;
  reason: string;
  kind: "previous" | "lesson" | "module";
}

type LessonRef = { course: string; courseTitle: string; module: string; slug: string; id: string; title: string; index: number };

let lookup: Map<string, LessonRef> | null = null;
function lessons(): Map<string, LessonRef> {
  if (lookup) return lookup;
  lookup = new Map();
  for (const c of ALL_COURSES) {
    let index = 0;
    for (const m of c.modules) for (const l of m.lessons) {
      lookup.set(`${c.slug}/${l.slug}`, { course: c.slug, courseTitle: c.title, module: m.slug, slug: l.slug, id: l.id, title: l.title, index: index++ });
    }
  }
  return lookup;
}

export function lessonRef(key: string): LessonRef | undefined {
  return lessons().get(key);
}

const toItem = (ref: LessonRef, reason: string, kind: PrereqItem["kind"]): PrereqItem => ({
  course: ref.course, courseTitle: ref.courseTitle, lesson: ref.slug, lessonId: ref.id, title: ref.title, reason, kind,
});

/** Prerequisites for a lesson, most specific first. */
export function prerequisitesFor(course: string, lesson: string): PrereqItem[] {
  const all = lessons();
  const me = all.get(`${course}/${lesson}`);
  if (!me) return [];
  const out: PrereqItem[] = [];
  const seen = new Set<string>();
  const push = (ref: LessonRef | undefined, reason: string, kind: PrereqItem["kind"]) => {
    if (!ref) return;
    const k = `${ref.course}/${ref.slug}`;
    if (k === `${course}/${lesson}` || seen.has(k)) return;
    seen.add(k);
    out.push(toItem(ref, reason, kind));
  };

  for (const [from, to, reason] of LESSON_PREREQS) if (to === `${course}/${lesson}`) push(all.get(from), reason, "lesson");

  // On a module's first lesson, surface cross-course modules this module builds on.
  const courseData = ALL_COURSES.find((c) => c.slug === course);
  const mod = courseData?.modules.find((m) => m.slug === me.module);
  if (mod && mod.lessons[0]?.slug === lesson) {
    for (const [from, to, reason] of CROSS_LINKS) {
      if (to !== `${course}:${me.module}`) continue;
      const [fc, fm] = from.split(":");
      const src = ALL_COURSES.find((c) => c.slug === fc)?.modules.find((m) => m.slug === fm);
      const first = src?.lessons[0];
      if (first) push(all.get(`${fc}/${first.slug}`), `${reason} (start of the ${src!.title} module)`, "module");
    }
  }

  // The lesson right before this one in its own course.
  if (me.index > 0) {
    const prev = [...all.values()].find((r) => r.course === course && r.index === me.index - 1);
    push(prev, "The previous lesson in this course", "previous");
  }
  return out;
}
