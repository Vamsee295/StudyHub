import type { VisualMap } from "./types";

const c = "dsa";

export const dsaVisuals: VisualMap = {
  [`${c}/big-o-notation`]: {
    plain:
      "Big-O describes how the work grows as the input grows, ignoring small details. Finding a name by reading every page of a phone book is O(n); opening it in the middle and halving each time is O(log n). For a million names that's a million checks versus about twenty.",
    diagram: `flowchart LR
  A["O(1)<br/>array[i]"] --> B["O(log n)<br/>binary search"] --> C["O(n)<br/>one loop"] --> D["O(n log n)<br/>merge sort"] --> E["O(n²)<br/>nested loops"] --> F["O(2ⁿ)<br/>all subsets"]`,
    caption: "From fastest-growing slowest (left) to explodes quickly (right).",
  },
  [`${c}/analyzing-time-complexity`]: {
    plain:
      "To find the complexity, count how many times the busiest line runs as n grows. One loop over n items: n times. A loop inside a loop: n × n. Halving each step: log n. Then keep only the biggest term.",
    diagram: `flowchart TB
  L1["for i in 0..n<br/>→ n"] --> T1["O(n)"]
  L2["for i in 0..n<br/>  for j in 0..n<br/>→ n × n"] --> T2["O(n²)"]
  L3["while n > 1: n = n / 2<br/>→ log₂ n"] --> T3["O(log n)"]`,
    caption: "Count how often the innermost work runs.",
  },
  [`${c}/problem-solving-framework`]: {
    plain:
      "In an interview, don't jump to code. Restate the problem, try examples and edge cases, say the brute force and its cost, then improve it with a better data structure or pattern. Code only once the plan is clear, then test by hand.",
    diagram: `flowchart LR
  U["Understand<br/>+ examples"] --> B["Brute force<br/>+ its cost"] --> O["Optimise<br/>pattern / data structure"] --> C["Code"] --> T["Dry-run tests<br/>edge cases"]`,
    caption: "A repeatable path from problem to tested solution.",
  },

  // ── Arrays ──
  [`${c}/two-sum-lesson`]: {
    plain:
      "Two Sum with a hash map is like going round a party asking 'is my partner here?'. For each number you check if target − number was already seen; if not, you note yourself down. One pass, O(n), instead of trying every pair.",
    diagram: `flowchart LR
  A["2: need 7, not seen<br/>store 2→0"] --> B["7: need 2, seen at 0!"] --> R(["answer [0, 1]"])`,
    caption: "nums = [2, 7, 11, 15], target = 9.",
  },
  [`${c}/arrays-lesson-3`]: {
    plain:
      "Binary search is how you find a word in a dictionary: open the middle, decide whether your word is before or after, and throw away the other half. Each step halves the search space, so even a million items take about twenty steps. It only works on sorted data.",
    diagram: `flowchart TB
  S["[1 3 5 7 9 11 13] find 9<br/>mid = 7 → go right"] --> T["[9 11 13]<br/>mid = 11 → go left"] --> U["[9]<br/>found ✓"]`,
    caption: "Each comparison discards half of what's left.",
  },
  [`${c}/arrays-lesson-4`]: {
    plain:
      "Two pointers start at both ends of a sorted array and walk towards each other. If the pair's sum is too small, move the left pointer right; too big, move the right pointer left. Each step rules out a whole row of pairs, so it's O(n).",
    diagram: `flowchart LR
  A["L=1 · R=11 → 12 > 10<br/>move R left"] --> B["L=1 · R=9 → 10 ✓"]`,
    caption: "Sorted [1, 3, 5, 9, 11], target 10.",
  },
  [`${c}/arrays-lesson-5`]: {
    plain:
      "Merge sort splits the list in half again and again until each piece has one item (already sorted), then merges sorted pieces back together, like combining two sorted piles of exam papers by always taking the smaller top sheet.",
    diagram: `flowchart TB
  A["38 27 43 3"] --> B["38 27"]
  A --> C["43 3"]
  B --> D["38"]
  B --> E["27"]
  C --> F["43"]
  C --> G["3"]
  D --> H["27 38"]
  E --> H
  F --> I["3 43"]
  G --> I
  H --> J["3 27 38 43"]
  I --> J`,
    caption: "Split down to single items, then merge back up in order: O(n log n).",
  },
  [`${c}/arrays-lesson-6`]: {
    plain:
      "A sliding window is a frame you slide along the array, keeping a running total instead of re-adding everything. To move the window one step, add the new element on the right and subtract the one leaving on the left.",
    diagram: `flowchart LR
  W1["[2 1 5] 1 3 2<br/>sum 8"] --> W2["2 [1 5 1] 3 2<br/>8 − 2 + 1 = 7"] --> W3["2 1 [5 1 3] 2<br/>7 − 1 + 3 = 9"]`,
    caption: "Window of size 3: one add and one subtract per step.",
  },

  // ── Linked list ──
  [`${c}/linked-list-basics`]: {
    plain:
      "A linked list is a treasure hunt: each clue (node) holds a value and tells you where the next clue is. Adding a clue in the middle is easy, just change one pointer, but to reach the 50th clue you must follow the first 49.",
    diagram: `flowchart LR
  H["head"] --> A["10 | next"] --> B["20 | next"] --> C["30 | next"] --> N["null"]`,
    caption: "Each node points to the next; the last points to null.",
  },
  [`${c}/reverse-a-linked-list`]: {
    plain:
      "Reversing a linked list means turning every arrow around. Walk along with three pointers: prev, curr and next. Save next, point curr back at prev, then step all three forward. When curr falls off the end, prev is the new head.",
    diagram: `flowchart LR
  subgraph Before
    a1["1"] --> a2["2"] --> a3["3"] --> an["null"]
  end
  subgraph After
    bn["null"] --- b1["1"]
    b2["2"] --> b1
    b3["3 (new head)"] --> b2
  end`,
    caption: "Same nodes, every next pointer flipped.",
  },
  [`${c}/fast-and-slow-pointers`]: {
    plain:
      "Two runners on a track, one twice as fast: if the track is a loop, the fast one eventually laps the slow one. If it's a straight road, the fast one just reaches the end. That's how Floyd's algorithm detects a cycle in O(1) memory.",
    diagram: `flowchart LR
  A["1"] --> B["2"] --> C["3"] --> D["4"] --> E["5"]
  E --> C`,
    caption: "Slow moves 1 step, fast moves 2; they meet inside the loop 3 → 4 → 5 → 3.",
  },

  // ── Stack & queue ──
  [`${c}/stack-basics`]: {
    plain:
      "A stack is a pile of plates: you can only add to the top (push) and take from the top (pop). The last plate put on is the first taken off: LIFO. Your browser's back button and the call stack both work this way.",
    diagram: `flowchart TB
  P["push 30 ↓ · pop ↑"] --> T["30 · top"] --> M["20"] --> B["10 · bottom"]`,
    caption: "Last in, first out.",
  },
  [`${c}/balanced-parentheses`]: {
    plain:
      "Push every opening bracket onto a stack. Each closing bracket must match the bracket on top; if it does, pop it. The string is balanced only if nothing ever mismatches and the stack is empty at the end.",
    diagram: `flowchart LR
  A["( → push<br/>stack: ("] --> B["[ → push<br/>stack: ( ["] --> C["] → matches [, pop<br/>stack: ("] --> D[") → matches (, pop<br/>stack empty ✓"]`,
    caption: "Checking \"([])\" with a stack.",
  },
  [`${c}/queue-basics-circular-queue`]: {
    plain:
      "A queue is a ticket line: join at the back (enqueue), leave from the front (dequeue). First in, first out. A circular queue reuses the space at the front by wrapping the back pointer around, like seats on a Ferris wheel.",
    diagram: `flowchart LR
  F["front → 10"] --> B["20"] --> C["30 ← rear"]
  N["enqueue 40"] -.-> C`,
    caption: "First in, first out.",
  },

  // ── Hashing ──
  [`${c}/how-hashmap-works`]: {
    plain:
      "A HashMap is a wall of numbered pigeonholes. A hash function turns the key into a pigeonhole number, so you go straight to the right hole instead of searching. When two keys land in the same hole (a collision), they share it in a small list.",
    diagram: `flowchart LR
  K1["'apple'"] -->|"hash → 2"| S2["bucket 2"]
  K2["'mango'"] -->|"hash → 5"| S5["bucket 5"]
  K3["'grape'"] -->|"hash → 2"| S2
  S2 --> L["apple:3 → grape:7<br/>(collision list)"]`,
    caption: "Keys are hashed to a bucket; collisions share a bucket.",
  },
  [`${c}/prefix-sum-with-hashmap`]: {
    plain:
      "A prefix sum is a running total. The sum of any slice equals 'total up to the end' minus 'total before the start'. Store each running total in a map, and you can find slices with a target sum in one pass.",
    diagram: `flowchart LR
  A["nums: 3 4 7 2"] --> P["prefix: 3 7 14 16"]
  P --> S["sum(1..2) = 14 − 3 = 11"]`,
    caption: "Any range sum is a difference of two prefix sums.",
  },

  // ── Trees ──
  [`${c}/binary-tree-traversals`]: {
    plain:
      "Traversals are routes for visiting every node. Pre-order: visit the node, then left, then right (good for copying). In-order: left, node, right (gives a BST in sorted order). Post-order: left, right, node (good for deleting).",
    diagram: `flowchart TB
  A["1"] --> B["2"]
  A --> C["3"]
  B --> D["4"]
  B --> E["5"]`,
    caption: "Pre-order 1 2 4 5 3 · In-order 4 2 5 1 3 · Post-order 4 5 2 3 1.",
  },
  [`${c}/level-order-traversal`]: {
    plain:
      "Level order visits a tree floor by floor, left to right, like reading a family tree generation by generation. A queue makes it easy: take a node from the front, then add its children to the back.",
    diagram: `flowchart TB
  A["1 · level 0"] --> B["2 · level 1"]
  A --> C["3 · level 1"]
  B --> D["4 · level 2"]
  C --> E["5 · level 2"]`,
    caption: "Visit order: 1, then 2 3, then 4 5.",
  },
  [`${c}/binary-search-trees`]: {
    plain:
      "In a binary search tree, everything left of a node is smaller and everything right is bigger. To find a value you go left or right at each node, halving the choices like binary search, as long as the tree stays balanced.",
    diagram: `flowchart TB
  A["8"] --> B["3"]
  A --> C["10"]
  B --> D["1"]
  B --> E["6"]
  C --> F["14"]`,
    caption: "Find 6: 8 → left to 3 → right to 6.",
  },

  // ── Heaps ──
  [`${c}/heap-basics`]: {
    plain:
      "A min-heap is a company where every boss earns less than their team, so the smallest value is always at the top. Taking the top out and fixing the order costs only O(log n), which makes heaps perfect for 'always give me the smallest next'.",
    diagram: `flowchart TB
  A["1"] --> B["3"]
  A --> C["5"]
  B --> D["7"]
  B --> E["9"]
  C --> F["8"]`,
    caption: "Every parent is smaller than its children; the minimum sits at the root.",
  },
  [`${c}/priority-queue-top-k`]: {
    plain:
      "To find the k largest numbers, keep a min-heap of size k: a VIP room with k seats. A newcomer only gets in if they're bigger than the smallest VIP, who is then shown out. At the end the room holds the top k.",
    diagram: `flowchart LR
  N["stream: 5 1 9 3 7"] --> H["min-heap size 3"]
  H --> R["top 3 = {5, 7, 9}"]`,
    caption: "A size-k min-heap keeps the k largest seen so far.",
  },

  // ── Graphs ──
  [`${c}/graph-representation`]: {
    plain:
      "A graph is places joined by roads. You can store it as an adjacency list (for each place, a list of its neighbours) or an adjacency matrix (a grid with a tick where a road exists). Lists save space for sparse maps; matrices answer 'is there a road?' instantly.",
    diagram: `flowchart LR
  A((A)) --- B((B))
  A --- C((C))
  B --- D((D))
  C --- D`,
    caption: "Adjacency list: A → B, C · B → A, D · C → A, D · D → B, C.",
  },
  [`${c}/bfs-and-dfs`]: {
    plain:
      "BFS explores like ripples in a pond: all neighbours first, then their neighbours, using a queue. It finds the shortest path in steps. DFS explores like walking a maze with one hand on the wall: go as deep as possible, then backtrack, using a stack or recursion.",
    diagram: `flowchart TB
  S((S)) --> A((A))
  S --> B((B))
  A --> C((C))
  B --> D((D))
  C --> E((E))`,
    caption: "BFS from S: S A B C D E (by distance). DFS from S: S A C E B D (deep first).",
  },
  [`${c}/topological-sort`]: {
    plain:
      "A topological order lists tasks so every task comes after the tasks it depends on, like getting dressed: socks before shoes. It exists only when there are no circular dependencies.",
    diagram: `flowchart LR
  U["Underwear"] --> P["Pants"] --> S["Shoes"]
  K["Socks"] --> S
  P --> B["Belt"]
  T["Shirt"] --> B`,
    caption: "One valid order: Underwear, Socks, Shirt, Pants, Belt, Shoes.",
  },
  [`${c}/dijkstra-shortest-path`]: {
    plain:
      "Dijkstra is a sat-nav. It always settles the closest unvisited place next, then updates its neighbours if going through it is quicker. With non-negative road lengths, once a place is settled its distance is final.",
    diagram: `flowchart LR
  A((A)) -->|"4"| B((B))
  A -->|"1"| C((C))
  C -->|"2"| B
  B -->|"1"| D((D))
  C -->|"5"| D`,
    caption: "Shortest A → D is A → C → B → D = 4, not A → B → D = 5.",
  },
  [`${c}/union-find-and-mst`]: {
    plain:
      "Union-Find tracks which items are in the same group, like friend circles. find tells you a group's leader; union merges two circles. Kruskal's MST uses it to add the cheapest roads that don't create a loop.",
    diagram: `flowchart TB
  R1["leader 1"] --- a["2"]
  R1 --- b["3"]
  R2["leader 4"] --- c["5"]
  U["union(3, 5)"] -.-> R1
  U -.-> R2`,
    caption: "Two groups merge into one when you union their members.",
  },

  // ── Recursion & DP ──
  [`${c}/recursion-fundamentals`]: {
    plain:
      "A recursive function trusts itself to solve a smaller copy of the problem, then uses that answer. The call tree shows every call made. Fibonacci done naively recomputes the same values again and again, which DP will fix.",
    diagram: `flowchart TB
  F4["fib(4)"] --> F3["fib(3)"]
  F4 --> F2a["fib(2)"]
  F3 --> F2b["fib(2)"]
  F3 --> F1a["fib(1)"]
  F2a --> F1b["fib(1)"]
  F2a --> F0a["fib(0)"]
  F2b --> F1c["fib(1)"]
  F2b --> F0b["fib(0)"]`,
    caption: "fib(2) is computed twice already at n = 4: the waste grows exponentially.",
  },
  [`${c}/subsets-and-permutations`]: {
    plain:
      "Backtracking explores choices as a tree: for each item, choose it or skip it. Walk down a path, record the result at the bottom, then step back and try the other choice. Every root-to-leaf path is one subset.",
    diagram: `flowchart TB
  R["{}"] -->|"take 1"| A["{1}"]
  R -->|"skip 1"| B["{}"]
  A -->|"take 2"| C["{1,2}"]
  A -->|"skip 2"| D["{1}"]
  B -->|"take 2"| E["{2}"]
  B -->|"skip 2"| F["{}"]`,
    caption: "Subsets of {1, 2}: the four leaves.",
  },
  [`${c}/dp-introduction`]: {
    plain:
      "Dynamic programming is recursion with a notebook. Every time you solve a small problem you write the answer down, and next time you just look it up. Fibonacci goes from exponential to linear time.",
    diagram: `flowchart LR
  A["fib(0)=0"] --> B["fib(1)=1"] --> C["fib(2)=1"] --> D["fib(3)=2"] --> E["fib(4)=3"] --> F["fib(5)=5"]`,
    caption: "Bottom-up: each answer is built from the two before it, computed once.",
  },
  [`${c}/knapsack-01`]: {
    plain:
      "0/1 knapsack: a bag with a weight limit and items you either take whole or leave. For each item and each capacity, the best value is the better of 'skip it' or 'take it plus the best for the remaining capacity'. A table records every answer.",
    diagram: `flowchart TB
  Q{"item i, capacity w"} --> S["skip: best(i−1, w)"]
  Q --> T["take: value[i] + best(i−1, w − weight[i])"]
  S --> M["best(i, w) = max of the two"]
  T --> M`,
    caption: "Each cell is the better of two smaller answers.",
  },
};
