import type { VisualMap } from "./types";

const c = "dsa";

export const dsaMoreVisuals: VisualMap = {
  [`${c}/space-complexity`]: {
    plain:
      "Space complexity counts the extra memory an algorithm needs as input grows. Don't forget the call stack: a recursive function n levels deep keeps n frames alive at once, so it uses O(n) space even if it creates no arrays.",
    diagram: `flowchart TB
  F3["fact(3) frame"] --> F2["fact(2) frame"] --> F1["fact(1) frame"] --> M["main frame"]`,
    caption: "Recursion depth n means n frames on the stack: O(n) space.",
  },
  [`${c}/arrays-lesson-2`]: {
    plain:
      "An array is one solid block of memory, so element i lives at start + i × size: instant access. An ArrayList is an array that, when full, moves into a new array twice as big, which keeps adding cheap on average.",
    diagram: `flowchart LR
  A["capacity 4: [1 2 3 4] full"] -->|"add(5): copy to capacity 8"| B["[1 2 3 4 5 _ _ _]"]`,
    caption: "ArrayList doubles its backing array when it fills up.",
  },
  [`${c}/strings-in-java`]: {
    plain:
      "Strings can't be changed, so s = s + c in a loop builds a brand-new string every time: O(n²) work. StringBuilder is an editable buffer you append to, then turn into a String once at the end: O(n).",
    diagram: `flowchart LR
  A["s + 'a' + 'b' + 'c'<br/>new string each step"] ==> B["StringBuilder: append a, b, c<br/>toString() once"]`,
    caption: "Use StringBuilder to build strings in loops.",
  },
  [`${c}/palindromes-and-anagrams`]: {
    plain:
      "Two words are anagrams if they use exactly the same letters the same number of times. Count letters in the first word (+1 each), uncount them for the second (−1 each); if every count ends at zero, they're anagrams.",
    diagram: `flowchart LR
  A["listen: +1 each letter"] --> C["counts: e l i n s t"]
  B["silent: −1 each letter"] --> C
  C --> Z["all zero → anagrams ✓"]`,
    caption: "A frequency array of 26 counters.",
  },
  [`${c}/sliding-window-on-strings`]: {
    plain:
      "For the longest substring without repeats, stretch the window's right edge one character at a time. When a repeat enters, shrink from the left until it's gone. Track the best window length seen.",
    diagram: `flowchart LR
  A["[a b c] a b c b b<br/>len 3"] --> B["a [b c a] b c b b<br/>repeat 'a': move left"] --> C["best = 3 (abc)"]`,
    caption: "Expand right, shrink left on a repeat.",
  },
  [`${c}/merge-sorted-lists`]: {
    plain:
      "Merging two sorted lists is like merging two sorted queues of people by height: compare the fronts, send the shorter person forward, repeat. A dummy head node avoids special cases at the start.",
    diagram: `flowchart LR
  A["1 → 4 → 6"] --> M["compare fronts each step"]
  B["2 → 3 → 7"] --> M
  M --> R["1 → 2 → 3 → 4 → 6 → 7"]`,
    caption: "Always take the smaller head.",
  },
  [`${c}/monotonic-stack`]: {
    plain:
      "To find each element's next greater element, keep a stack of values still waiting for an answer, smallest on top. When a bigger number arrives, it is the answer for everything smaller on the stack, which gets popped.",
    diagram: `flowchart LR
  A["2 pushed"] --> B["1 pushed (stack 2,1)"] --> C["5 arrives: pops 1 and 2<br/>next greater of both = 5"] --> D["3 pushed (stack 5,3)"]`,
    caption: "Next greater element for [2, 1, 5, 3]: 5, 5, −1, −1.",
  },
  [`${c}/expression-evaluation`]: {
    plain:
      "Postfix notation puts operators after their numbers: 3 4 + 2 * means (3 + 4) × 2. Evaluate it with a stack: push numbers; on an operator, pop two, combine, push the result.",
    diagram: `flowchart LR
  A["push 3, push 4"] --> B["'+': pop 4 and 3, push 7"] --> C["push 2"] --> D["'*': pop 2 and 7, push 14"] --> R["answer 14"]`,
    caption: "Evaluating 3 4 + 2 * with a stack.",
  },
  [`${c}/deque-sliding-window-maximum`]: {
    plain:
      "For the maximum of every window, keep a deque of indexes whose values are decreasing. The front is always the current max; drop indexes from the back that are smaller than the newcomer, and from the front when they leave the window.",
    diagram: `flowchart LR
  A["window [1 3 −1] → max 3"] --> B["[3 −1 −3] → max 3"] --> C["[−1 −3 5] → max 5"]`,
    caption: "Sliding window maximum, k = 3, in O(n).",
  },
  [`${c}/queue-using-stacks`]: {
    plain:
      "Two stacks make a queue: push new items onto an 'in' stack; when you need the front, pour the 'in' stack into an 'out' stack, which reverses the order so the oldest item is on top.",
    diagram: `flowchart LR
  I["in stack: 3 (top) 2 1"] -->|"pour when out is empty"| O["out stack: 1 (top) 2 3"]
  O --> F["dequeue → 1 (oldest)"]`,
    caption: "Reversing twice restores first-in, first-out order.",
  },
  [`${c}/hashing-patterns`]: {
    plain:
      "For the longest run of consecutive numbers, put everything in a set. Only start counting from a number whose predecessor isn't in the set (the start of a run), then walk upward. Every number is visited about twice: O(n).",
    diagram: `flowchart LR
  S["set {100, 4, 200, 1, 3, 2}"] --> A["1 is a start (0 missing)"] --> B["1 → 2 → 3 → 4"] --> R["length 4"]`,
    caption: "Start runs only at their first number.",
  },
  [`${c}/classic-tree-problems`]: {
    plain:
      "The lowest common ancestor of two nodes is the deepest node that has both below it, like the closest shared grandparent in a family tree. Recursively: if the two are found in different subtrees, the current node is the answer.",
    diagram: `flowchart TB
  A["3"] --> B["5"]
  A --> C["1"]
  B --> D["6"]
  B --> E["2"]
  C --> F["0"]
  C --> G["8"]`,
    caption: "LCA(6, 2) = 5; LCA(6, 8) = 3.",
  },
  [`${c}/merge-k-sorted-and-heap-sort`]: {
    plain:
      "To merge k sorted lists, put the first element of each in a min-heap. Repeatedly take the smallest, then push the next element from the same list. Each step costs O(log k).",
    diagram: `flowchart LR
  L1["1 → 4 → 5"] --> H["min-heap of current heads"]
  L2["1 → 3 → 4"] --> H
  L3["2 → 6"] --> H
  H --> O["1 1 2 3 4 4 5 6"]`,
    caption: "The heap always holds one candidate per list.",
  },
  [`${c}/combination-sum-and-n-queens`]: {
    plain:
      "Pruning makes backtracking fast: stop exploring a branch as soon as it can't succeed. In combination sum, once the running total passes the target, there's no point going deeper down that path.",
    diagram: `flowchart TB
  R["target 7, sum 0"] --> A["take 2 → 2"]
  R --> B["take 7 → 7 ✓"]
  A --> C["take 2 → 4"]
  C --> D["take 3 → 7 ✓"]
  C --> E["take 6 → 10 ✗ prune"]`,
    caption: "Branches over the target are cut off immediately.",
  },
  [`${c}/one-dimensional-dp`]: {
    plain:
      "Climbing stairs one or two steps at a time: the ways to reach step n are the ways to reach n − 1 plus the ways to reach n − 2. Each answer is built from the two before it, filling a single row from left to right.",
    diagram: `flowchart LR
  S0["step 0: 1"] --> S1["step 1: 1"] --> S2["step 2: 2"] --> S3["step 3: 3"] --> S4["step 4: 5"] --> S5["step 5: 8"]`,
    caption: "dp[i] = dp[i − 1] + dp[i − 2].",
  },
  [`${c}/two-dimensional-dp`]: {
    plain:
      "For the longest common subsequence, fill a grid where cell (i, j) is the answer for the first i letters of one word and the first j of the other. Matching letters extend the diagonal; otherwise take the better of above and left.",
    diagram: `flowchart TB
  Q{"a[i] == b[j]?"} -->|"yes"| D["dp[i][j] = dp[i−1][j−1] + 1"]
  Q -->|"no"| M["dp[i][j] = max(dp[i−1][j], dp[i][j−1])"]`,
    caption: "Each cell depends on its top, left and diagonal neighbours.",
  },
  [`${c}/longest-increasing-subsequence`]: {
    plain:
      "The O(n log n) LIS trick keeps a list 'tails' where tails[k] is the smallest possible last value of an increasing run of length k + 1. Each new number either extends the list or replaces the first tail that's ≥ it (found by binary search).",
    diagram: `flowchart LR
  A["10 → [10]"] --> B["9 → [9]"] --> C["2 → [2]"] --> D["5 → [2, 5]"] --> E["3 → [2, 3]"] --> F["7 → [2, 3, 7]"] --> G["101 → [2, 3, 7, 101]"]`,
    caption: "Length of tails = LIS length (4).",
  },
};
