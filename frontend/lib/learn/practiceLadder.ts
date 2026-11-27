// Practice ladder for a lesson: problems from the matching topic, Easy → Medium → Hard,
// so a reader can go straight from "I understand it" to "I can do it" to "interview level".
import { categoryOf, problems, type ProblemCategory, type ProblemDefinition } from "@/lib/problems/problemRegistry";

// Which problem sections fit which lessons. Checked in order; the first match wins.
const MAP: [RegExp, ProblemCategory[]][] = [
  // Programming fundamentals
  [/^programming-fundamentals\/(what-is-recursion|base-case|recursive-case|basic-recursion-problems)$/, ["Recursion"]],
  [/^programming-fundamentals\/(what-is-an-array|array-|traversing-arrays|taking-array-input|searching-arrays|min-max-sum)/, ["Arrays"]],
  [/^programming-fundamentals\/two-dimensional-arrays$/, ["Matrix"]],
  [/^programming-fundamentals\/(what-is-a-string|string-|length-method|charat-method|substring-method|basic-string-problems)/, ["Strings"]],
  [/^programming-fundamentals\/bitwise-operators$/, ["Bit Manipulation"]],
  [/^programming-fundamentals\/(control-flow|if-|else-if|nested-conditions|switch|ternary|why-loops|for-loop|while-loop|do-while|nested-loops|break|continue|counting|basic-pattern|problem-solving|breaking-problems|arithmetic|relational|logical-operators|what-is-control-flow)/, ["Basics"]],
  // Pseudocode: trace it here, then write it as code
  [/^pseudocode\/(operators-and-precedence|conditions-and-branches|loops-and-tracing)$/, ["Basics"]],
  [/^pseudocode\/nested-loops-and-counting$/, ["Basics", "Matrix"]],
  [/^pseudocode\/recursion-tracing$/, ["Recursion"]],
  [/^pseudocode\/arrays-and-strings$/, ["Arrays", "Strings"]],
  [/^pseudocode\/bitwise-operations$/, ["Bit Manipulation"]],
  [/^pseudocode\/recognising-algorithms$/, ["Sorting", "Binary Search"]],
  // DSA
  [/^dsa\/(big-o-notation|analyzing-time-complexity|space-complexity|problem-solving-framework)$/, ["Arrays"]],
  [/^dsa\/two-sum-lesson$/, ["Hashing"]],
  [/^dsa\/arrays-lesson-2$/, ["Arrays", "Matrix"]],
  [/^dsa\/arrays-lesson-3$/, ["Binary Search"]],
  [/^dsa\/arrays-lesson-4$/, ["Two Pointers"]],
  [/^dsa\/arrays-lesson-5$/, ["Sorting"]],
  [/^dsa\/arrays-lesson-6$/, ["Prefix Sum", "Sliding Window"]],
  [/^dsa\/sliding-window-on-strings$/, ["Sliding Window"]],
  [/^dsa\/(strings-in-java|palindromes-and-anagrams)$/, ["Strings"]],
  [/^dsa\/(linked-list-basics|reverse-a-linked-list|fast-and-slow-pointers|merge-sorted-lists)$/, ["Linked List"]],
  [/^dsa\/(stack-basics|balanced-parentheses|monotonic-stack|expression-evaluation|queue-basics-circular-queue|deque-sliding-window-maximum|queue-using-stacks)$/, ["Stack & Queue"]],
  [/^dsa\/prefix-sum-with-hashmap$/, ["Prefix Sum", "Hashing"]],
  [/^dsa\/(how-hashmap-works|hashing-patterns)$/, ["Hashing"]],
  [/^dsa\/(binary-tree-traversals|level-order-traversal|binary-search-trees|classic-tree-problems)$/, ["Trees"]],
  [/^dsa\/(heap-basics|priority-queue-top-k|merge-k-sorted-and-heap-sort)$/, ["Heap"]],
  [/^dsa\/(graph-representation|bfs-and-dfs|topological-sort|dijkstra-shortest-path|union-find-and-mst)$/, ["Graphs"]],
  [/^dsa\/recursion-fundamentals$/, ["Recursion"]],
  [/^dsa\/(subsets-and-permutations|combination-sum-and-n-queens)$/, ["Backtracking"]],
  [/^dsa\/(dp-introduction|one-dimensional-dp|knapsack-01|two-dimensional-dp|longest-increasing-subsequence)$/, ["Dynamic Programming"]],
];

/** The problem topics a lesson practises, or [] when none fits. */
export function categoriesFor(course: string, lesson: string): ProblemCategory[] {
  const key = `${course}/${lesson}`;
  return MAP.find(([re]) => re.test(key))?.[1] ?? [];
}

/** Small stable hash so lessons sharing a topic get different problems. */
function seed(s: string) {
  let h = 0;
  for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

function pick(pool: ProblemDefinition[], n: number, offset: number) {
  if (pool.length <= n) return pool;
  return Array.from({ length: n }, (_, i) => pool[(offset + i * Math.max(1, Math.floor(pool.length / n))) % pool.length]);
}

export interface Ladder {
  categories: ProblemCategory[];
  easy: ProblemDefinition[];
  medium: ProblemDefinition[];
  hard: ProblemDefinition[];
}

/** Two easy, two medium and one hard problem for the lesson, or null when no problem topic fits. */
export function ladderFor(course: string, lesson: string): Ladder | null {
  const categories = categoriesFor(course, lesson);
  if (!categories.length) return null;
  const all = Object.values(problems).filter((p) => categories.includes(categoryOf(p)));
  // warm-up ladder problems first (they're the gentlest), then by id for a stable order
  const sorted = (d: ProblemDefinition["difficulty"]) =>
    all.filter((p) => p.difficulty === d).sort((a, b) => (a.ladder ?? 1e9) - (b.ladder ?? 1e9) || a.id.localeCompare(b.id));
  const s = seed(`${course}/${lesson}`);
  const ladder = { categories, easy: pick(sorted("Easy"), 2, s), medium: pick(sorted("Medium"), 2, s), hard: pick(sorted("Hard"), 1, s) };
  return ladder.easy.length + ladder.medium.length + ladder.hard.length ? ladder : null;
}
