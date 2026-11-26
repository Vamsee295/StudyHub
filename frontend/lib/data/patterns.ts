// A guide for each problem topic on the Practice page: the idea in plain words, a picture, when to reach
// for it, the step-by-step template, typical complexity, and where to learn or watch it.
// Visualiser links were checked live (HTTP 200) on 2026-11-26.
import type { ProblemCategory } from "@/lib/problems/problemRegistry";

export interface PatternGuide {
  plain: string;
  diagram: string;
  caption: string;
  whenToUse: string[];
  steps: string[];
  complexity: string;
  learn?: { title: string; href: string };
  watch?: { title: string; url: string };
}

export const PATTERN_GUIDES: Record<ProblemCategory, PatternGuide> = {
  Basics: {
    plain:
      "Basics problems test the building blocks: variables, conditions, loops and simple maths. The skill is turning the words of the problem into exact steps, one small piece at a time.",
    diagram: `flowchart LR
  I["read the input"] --> P["process: if / loop / maths"] --> O["return the answer"]`,
    caption: "Input → process → output.",
    whenToUse: ["The problem is about digits, counting, simple maths or patterns", "No special data structure is needed"],
    steps: ["Work two small examples by hand", "Write the steps in plain words", "Turn each step into one or two lines of code", "Test the smallest and edge inputs (0, 1, negative)"],
    complexity: "Usually O(n) time or better, O(1) extra space.",
    learn: { title: "Control flow", href: "/learn/programming-fundamentals/what-is-control-flow" },
    watch: { title: "Python Tutor (step through Java code)", url: "https://pythontutor.com/java.html" },
  },
  Arrays: {
    plain:
      "Arrays are rows of numbered boxes. Most array problems are one careful walk from left to right while remembering something useful: the best so far, a running total, or where you last saw a value.",
    diagram: `flowchart LR
  a0["[0] 3"] --> a1["[1] 8"] --> a2["[2] 1"] --> a3["[3] 9"] --> R(["best so far = 9"])`,
    caption: "One pass, keeping a summary of what you've seen.",
    whenToUse: ["Input is a list of numbers", "Answer depends on positions, max/min, sums or counts"],
    steps: ["Decide what to remember while walking (max, sum, last index…)", "Initialise it from the first element, not 0", "Update it at each index", "Return it after the loop"],
    complexity: "One pass is O(n) time; nested loops are O(n²), so look for one pass first.",
    learn: { title: "Arrays in memory", href: "/learn/dsa/arrays-lesson-2" },
    watch: { title: "VisuAlgo: arrays", url: "https://visualgo.net/en/array" },
  },
  Strings: {
    plain:
      "A string is an array of characters. Most string problems walk the characters, count them, or compare from both ends. Build new strings with StringBuilder, not + inside a loop.",
    diagram: `flowchart LR
  L["L → r"] --- a["a"] --- c["c"] --- e["e"] --- c2["c"] --- a2["a"] --- R["r ← R"]`,
    caption: "Comparing from both ends: \"racecar\" is a palindrome.",
    whenToUse: ["Palindromes, anagrams, counting characters", "Reversing, parsing or transforming text"],
    steps: ["Pick a tool: index loop, two ends, or a count array of 26", "Normalise if needed (lowercase, skip spaces)", "Build output with StringBuilder", "Test empty and one-character strings"],
    complexity: "Usually O(n); a frequency array of 26 is O(1) space.",
    learn: { title: "Strings in Java", href: "/learn/dsa/strings-in-java" },
  },
  Hashing: {
    plain:
      "A hash map remembers what you've seen so you can answer 'have I seen this before, and where?' instantly instead of searching again. It trades a little memory for a lot of speed.",
    diagram: `flowchart LR
  N["for each number x"] --> Q{"target − x in map?"}
  Q -->|"yes"| F["found the pair"]
  Q -->|"no"| S["store x → index"] --> N`,
    caption: "The Two Sum pattern: look back in O(1).",
    whenToUse: ["You'd otherwise search the array again inside a loop", "Counting frequencies, finding duplicates or pairs"],
    steps: ["Decide the key (value, character, prefix sum) and what to store", "Walk once: check the map, then update it", "Order matters: check before inserting for pair problems"],
    complexity: "O(n) time on average, O(n) extra space.",
    learn: { title: "How HashMap works", href: "/learn/dsa/how-hashmap-works" },
    watch: { title: "VisuAlgo: hash table", url: "https://visualgo.net/en/hashtable" },
  },
  "Two Pointers": {
    plain:
      "Two pointers walk the array at the same time, usually from both ends towards the middle, or one fast and one slow. Each step rules out many possibilities, turning O(n²) pair checks into one pass.",
    diagram: `flowchart LR
  L["L at start"] --> C{"sum vs target"}
  R["R at end"] --> C
  C -->|"too small"| ML["move L right"]
  C -->|"too big"| MR["move R left"]
  C -->|"equal"| F["found"]`,
    caption: "Shrinking the search from both ends of a sorted array.",
    whenToUse: ["Sorted array and a pair/triple condition", "In-place removal or partitioning", "Comparing from both ends"],
    steps: ["Sort first if order doesn't matter", "Place pointers (both ends, or slow/fast)", "Move the pointer that can improve the answer", "Stop when they meet"],
    complexity: "O(n) after an O(n log n) sort; O(1) extra space.",
    learn: { title: "Two pointers", href: "/learn/dsa/arrays-lesson-4" },
  },
  "Sliding Window": {
    plain:
      "A sliding window is a frame over a stretch of the array. Grow it on the right, shrink it on the left when it breaks a rule, and keep a running summary instead of recounting everything.",
    diagram: `flowchart LR
  A["expand right"] --> Q{"window still valid?"}
  Q -->|"yes"| U["update best"] --> A
  Q -->|"no"| S["shrink from left"] --> Q`,
    caption: "Expand, check, shrink: each element enters and leaves once.",
    whenToUse: ["Longest/shortest contiguous subarray or substring", "Sum or count over every window of size k"],
    steps: ["Keep left = 0 and a summary (sum, counts)", "For each right: add arr[right]", "While the window is invalid: remove arr[left], left++", "Record the best window"],
    complexity: "O(n) time: each element is added and removed at most once.",
    learn: { title: "Sliding window on strings", href: "/learn/dsa/sliding-window-on-strings" },
  },
  "Prefix Sum": {
    plain:
      "A prefix sum is a running total. Once you have it, the sum of any range is a subtraction: total up to the end minus total before the start. Pair it with a hash map to count subarrays with a target sum.",
    diagram: `flowchart LR
  A["nums 2 4 1 3"] --> P["prefix 2 6 7 10"]
  P --> S["sum(1..3) = 10 − 2 = 8"]`,
    caption: "Any range sum in O(1) after one pass.",
    whenToUse: ["Many range-sum questions on the same array", "Count subarrays with sum k (with a hash map)"],
    steps: ["Build prefix[i + 1] = prefix[i] + nums[i]", "Range sum (l..r) = prefix[r + 1] − prefix[l]", "For 'sum = k' counts: store how often each prefix appeared"],
    complexity: "O(n) to build, O(1) per query.",
    learn: { title: "Prefix sum with a HashMap", href: "/learn/dsa/prefix-sum-with-hashmap" },
  },
  Sorting: {
    plain:
      "Sorting first often makes a hard problem easy: duplicates sit next to each other, and the smallest and largest are at the ends. Know when to sort with a custom comparator, and when a counting trick beats sorting.",
    diagram: `flowchart LR
  U["7 2 9 2 5"] -->|"sort"| S["2 2 5 7 9"]
  S --> D["duplicates adjacent"]
  S --> E["min and max at the ends"]`,
    caption: "Order reveals structure.",
    whenToUse: ["Intervals, meetings, grouping or 'closest' questions", "When adjacent elements need comparing"],
    steps: ["Decide the sort key (start time, value, frequency)", "Sort with Arrays.sort or a comparator", "Do one pass over the sorted data"],
    complexity: "O(n log n) time for the sort.",
    learn: { title: "Sorting algorithms", href: "/learn/dsa/arrays-lesson-5" },
    watch: { title: "VisuAlgo: sorting", url: "https://visualgo.net/en/sorting" },
  },
  "Binary Search": {
    plain:
      "Binary search halves the search space each step, like opening a dictionary in the middle. It works on any sorted data, and on 'answer' spaces too: the smallest capacity, speed or day that works.",
    diagram: `flowchart TB
  S["lo, hi"] --> M["mid = lo + (hi − lo) / 2"]
  M --> Q{"condition at mid?"}
  Q -->|"go left"| H["hi = mid − 1"] --> M
  Q -->|"go right"| L["lo = mid + 1"] --> M
  Q -->|"found"| F["answer"]`,
    caption: "Halve the range until it closes.",
    whenToUse: ["Sorted array or rotated sorted array", "'Minimum value that satisfies…' (search on the answer)"],
    steps: ["Set lo and hi to cover every possible answer", "Compute mid without overflow", "Decide which half can still contain the answer", "Loop while lo <= hi"],
    complexity: "O(log n) time.",
    learn: { title: "Linear and binary search", href: "/learn/dsa/arrays-lesson-3" },
    watch: { title: "USFCA: binary search", url: "https://www.cs.usfca.edu/~galles/visualization/Search.html" },
  },
  Recursion: {
    plain:
      "Recursion solves a problem by trusting a smaller copy of itself to be solved, then using that answer. Every recursive function needs a base case (the smallest problem, answered directly) and a step that moves towards it.",
    diagram: `flowchart TB
  F3["f(3)"] --> F2["f(2)"] --> F1["f(1)"] --> F0["f(0) · base"]
  F0 -.->|"answer"| F1 -.-> F2 -.-> F3`,
    caption: "Calls go down to the base case, answers come back up.",
    whenToUse: ["The problem is defined in terms of a smaller version of itself", "Trees, nested structures, divide and conquer"],
    steps: ["Write the base case first", "Assume f(n − 1) works; build f(n) from it", "Make sure every call gets closer to the base case"],
    complexity: "Depends on the call tree; stack space equals the recursion depth.",
    learn: { title: "What is recursion?", href: "/learn/programming-fundamentals/what-is-recursion" },
    watch: { title: "VisuAlgo: recursion tree", url: "https://visualgo.net/en/recursion" },
  },
  "Stack & Queue": {
    plain:
      "A stack is a pile of plates (last in, first out): perfect for matching brackets, undo, and 'nearest greater' questions. A queue is a ticket line (first in, first out): perfect for processing things in arrival order.",
    diagram: `flowchart LR
  subgraph Stack["Stack · LIFO"]
    t["top: 30"] --> m["20"] --> b["10"]
  end
  subgraph Queue["Queue · FIFO"]
    f["front: 10"] --> q2["20"] --> r["rear: 30"]
  end`,
    caption: "Take from the top, or from the front.",
    whenToUse: ["Matching pairs, nested structures (stack)", "Next greater / smaller element (monotonic stack)", "Level-by-level processing (queue)"],
    steps: ["Pick the structure: Deque as stack (push/pop) or queue (offer/poll)", "Decide what to push: values or indexes", "Pop while the top no longer matters"],
    complexity: "Each element is pushed and popped once: O(n).",
    learn: { title: "Stack basics", href: "/learn/dsa/stack-basics" },
    watch: { title: "USFCA: stack", url: "https://www.cs.usfca.edu/~galles/visualization/StackArray.html" },
  },
  "Linked List": {
    plain:
      "A linked list is a chain of nodes, each pointing to the next. You can't jump to the middle; you walk. Most problems are pointer juggling: draw the boxes and arrows before you code.",
    diagram: `flowchart LR
  D["dummy"] --> A["1"] --> B["2"] --> C["3"] --> N["null"]`,
    caption: "A dummy head avoids special cases at the start.",
    whenToUse: ["Reverse, merge, reorder or detect cycles in a list", "Find the middle or kth from the end (fast/slow pointers)"],
    steps: ["Draw the list and the pointer changes", "Use a dummy head when the head might change", "Save next before changing a pointer", "Test with 0, 1 and 2 nodes"],
    complexity: "Usually O(n) time, O(1) extra space.",
    learn: { title: "Linked list basics", href: "/learn/dsa/linked-list-basics" },
    watch: { title: "VisuAlgo: linked list", url: "https://visualgo.net/en/list" },
  },
  Matrix: {
    plain:
      "A matrix is a grid: row then column. Many problems walk it in a particular order (row by row, spiral, diagonals) or treat each cell as a node with four neighbours.",
    diagram: `flowchart TB
  C["cell (r, c)"] --> U["(r − 1, c) up"]
  C --> D["(r + 1, c) down"]
  C --> L["(r, c − 1) left"]
  C --> R["(r, c + 1) right"]`,
    caption: "Four neighbours; always check the bounds.",
    whenToUse: ["Grids, boards, images", "Rotations, spirals, islands and paths"],
    steps: ["Use direction arrays dr = {-1, 1, 0, 0}, dc = {0, 0, -1, 1}", "Check 0 <= r < rows and 0 <= c < cols", "Mark visited cells to avoid loops"],
    complexity: "O(rows × cols) to visit every cell.",
    learn: { title: "2D arrays", href: "/learn/programming-fundamentals/two-dimensional-arrays" },
  },
  "Bit Manipulation": {
    plain:
      "Bit tricks work on the 0s and 1s inside a number. x & 1 tells you odd or even, x & (x − 1) removes the lowest 1-bit, and XOR cancels pairs: a ^ a = 0, so XOR-ing everything leaves the single unpaired number.",
    diagram: `flowchart LR
  A["4 ^ 1 ^ 2 ^ 1 ^ 2"] --> B["pairs cancel: 1 ^ 1 = 0, 2 ^ 2 = 0"] --> C["answer 4"]`,
    caption: "XOR finds the element that appears once.",
    whenToUse: ["'Every element appears twice except one'", "Counting set bits, powers of two, subsets as bitmasks"],
    steps: ["Write small numbers in binary first", "Pick the operator: & to test, | to set, ^ to toggle/cancel, << >> to shift", "Mind negative numbers and use >>> for unsigned shifts"],
    complexity: "O(1) per operation; O(n) over an array.",
    learn: { title: "Bitwise operators", href: "/learn/programming-fundamentals/bitwise-operators" },
    watch: { title: "VisuAlgo: bitmask", url: "https://visualgo.net/en/bitmask" },
  },
  Greedy: {
    plain:
      "Greedy takes the best-looking choice at each step and never looks back, like always grabbing the biggest coin that fits. It's fast, but only correct when a local best choice can't ruin the overall answer, so convince yourself (or test) before trusting it.",
    diagram: `flowchart LR
  S["sort by finish time"] --> P["pick the meeting that ends earliest"] --> N["skip overlapping ones"] --> P`,
    caption: "Interval scheduling: earliest finish first is provably optimal.",
    whenToUse: ["Intervals, scheduling, jumps, buying/selling", "A clear 'best next move' exists"],
    steps: ["Find the greedy rule (often after sorting)", "Try to break it with a counterexample", "Apply it in one pass"],
    complexity: "Often O(n log n) because of the sort.",
  },
  Trees: {
    plain:
      "A tree is a family chart: each node has children and no loops. Most tree problems are a recursive question: 'if I know the answer for the left and right subtrees, what's the answer here?'",
    diagram: `flowchart TB
  R["node"] --> L["left subtree<br/>answer a"]
  R --> Ri["right subtree<br/>answer b"]
  L -.-> C["combine a, b at node"]
  Ri -.-> C`,
    caption: "Solve the children, combine at the parent.",
    whenToUse: ["Height, diameter, path sums, balanced checks", "BST search, insert, validate", "Level-order views (use a queue)"],
    steps: ["Base case: null node", "Recurse left and right", "Combine their answers with the current node", "Use BFS when the question is about levels"],
    complexity: "O(n) to visit every node; recursion depth = tree height.",
    learn: { title: "Binary tree traversals", href: "/learn/dsa/binary-tree-traversals" },
    watch: { title: "VisuAlgo: binary search tree", url: "https://visualgo.net/en/bst" },
  },
  Heap: {
    plain:
      "A heap always gives you the smallest (or largest) item quickly. Use one when you keep asking 'what's the next best?': the k largest, merging sorted lists, or the closest points.",
    diagram: `flowchart LR
  S["stream of numbers"] --> H["min-heap of size k"] --> T["top k largest"]
  H -->|"newcomer bigger than top?"| R["pop top, push newcomer"]`,
    caption: "A size-k heap keeps the best k.",
    whenToUse: ["Top-k / kth largest or smallest", "Repeatedly taking the next smallest (merge k lists, scheduling)"],
    steps: ["Choose min-heap or max-heap (PriorityQueue is min by default)", "Keep its size bounded when you only need k", "poll() for the best, offer() for new candidates"],
    complexity: "O(log k) per push/pop; O(n log k) for top-k.",
    learn: { title: "Heap basics", href: "/learn/dsa/heap-basics" },
    watch: { title: "VisuAlgo: binary heap", url: "https://visualgo.net/en/heap" },
  },
  Backtracking: {
    plain:
      "Backtracking tries every choice in turn: choose, explore, then undo the choice and try the next, like walking a maze and stepping back at dead ends. Pruning skips branches that can't work, which makes it fast enough.",
    diagram: `flowchart TB
  R["[]"] -->|"choose 1"| A["[1]"]
  R -->|"skip 1"| B["[]"]
  A -->|"choose 2"| C["[1,2]"]
  A -->|"skip 2"| D["[1]"]
  B -->|"choose 2"| E["[2]"]
  B -->|"skip 2"| F["[]"]`,
    caption: "Every root-to-leaf path is one complete choice.",
    whenToUse: ["All subsets, permutations or combinations", "Puzzles: N-Queens, Sudoku, word search"],
    steps: ["Write backtrack(state, choices)", "If the state is complete, record it", "For each choice: apply → recurse → undo", "Prune when the state can no longer succeed"],
    complexity: "Exponential in the worst case (2ⁿ subsets, n! permutations).",
    learn: { title: "Subsets and permutations", href: "/learn/dsa/subsets-and-permutations" },
    watch: { title: "USFCA: N-Queens", url: "https://www.cs.usfca.edu/~galles/visualization/RecQueens.html" },
  },
  Graphs: {
    plain:
      "A graph is places joined by roads. BFS explores in rings (shortest steps), DFS dives deep then backtracks (connectivity, cycles). Grids, social networks and course prerequisites are all graphs in disguise.",
    diagram: `flowchart LR
  S((S)) --> A((A))
  S --> B((B))
  A --> C((C))
  B --> C
  C --> D((D))`,
    caption: "BFS from S visits by distance: S, A B, C, D.",
    whenToUse: ["Connections, islands, reachability", "Shortest path in steps (BFS) or weights (Dijkstra)", "Ordering with prerequisites (topological sort)"],
    steps: ["Build an adjacency list", "Keep a visited set", "BFS with a queue, DFS with recursion or a stack", "Process each node and edge once"],
    complexity: "O(V + E) for BFS/DFS.",
    learn: { title: "BFS and DFS", href: "/learn/dsa/bfs-and-dfs" },
    watch: { title: "VisuAlgo: graph traversal", url: "https://visualgo.net/en/dfsbfs" },
  },
  "Dynamic Programming": {
    plain:
      "Dynamic programming is recursion with a notebook: break the problem into overlapping smaller problems, solve each once, and write the answer down. The hard part is choosing what dp[i] means.",
    diagram: `flowchart LR
  D0["dp[0]"] --> D1["dp[1]"] --> D2["dp[2]"] --> D3["dp[3]"] --> Dn["… dp[n] = answer"]
  D1 -.-> D3`,
    caption: "Each cell is built from smaller, already-solved cells.",
    whenToUse: ["'Count the ways', 'minimum cost', 'maximum value'", "A brute-force recursion repeats the same calls"],
    steps: ["Define dp[i] in words", "Write the recurrence from smaller states", "Set the base cases", "Fill in order (or memoise the recursion) and return the final cell"],
    complexity: "Number of states × work per state, often O(n) or O(n²).",
    learn: { title: "Introduction to DP", href: "/learn/dsa/dp-introduction" },
    watch: { title: "USFCA: memoised Fibonacci", url: "https://www.cs.usfca.edu/~galles/visualization/DPFib.html" },
  },
};

/** More free practice elsewhere, easiest first. Links checked live on 2026-11-26. */
export const PRACTICE_RESOURCES: { title: string; url: string; why: string }[] = [
  { title: "CodingBat Java", url: "https://codingbat.com/java", why: "Tiny warm-up problems with instant feedback: ideal for your first 50." },
  { title: "Exercism Java track", url: "https://exercism.org/tracks/java", why: "Free exercises with optional human mentoring on your solutions." },
  { title: "HackerRank Java", url: "https://www.hackerrank.com/domains/java", why: "Language-feature drills, from syntax to collections." },
  { title: "NeetCode roadmap", url: "https://neetcode.io/roadmap", why: "Interview problems grouped by pattern, with video explanations." },
  { title: "Grind 75", url: "https://www.techinterviewhandbook.org/grind75/", why: "A time-boxed interview plan built from the most useful problems." },
  { title: "SQLBolt", url: "https://sqlbolt.com/", why: "Interactive SQL lessons to pair with our SQL lab." },
];

/** The order to practise topics in, from first loops to interview-level problems. */
export const PRACTICE_PATH: { stage: string; goal: string; topics: ProblemCategory[] }[] = [
  { stage: "1 · Warm-up", goal: "Loops, conditions and simple data.", topics: ["Basics", "Arrays", "Strings"] },
  { stage: "2 · Core patterns", goal: "The patterns behind most easy and medium problems.", topics: ["Hashing", "Two Pointers", "Sliding Window", "Prefix Sum", "Sorting", "Binary Search"] },
  { stage: "3 · Data structures", goal: "Choose the right structure for the job.", topics: ["Recursion", "Stack & Queue", "Linked List", "Matrix", "Bit Manipulation", "Greedy"] },
  { stage: "4 · Interview level", goal: "The topics that separate good from great.", topics: ["Trees", "Heap", "Backtracking", "Graphs", "Dynamic Programming"] },
];
