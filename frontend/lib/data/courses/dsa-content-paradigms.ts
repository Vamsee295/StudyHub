// DSA Modules 11-12: Recursion & Backtracking, Dynamic Programming
// All Java code is compiled and tested.
import { CourseLesson } from './types';

export const recursionBacktrackingLessons: CourseLesson[] = [
  {
    id: "recursion-fundamentals",
    slug: "recursion-fundamentals",
    title: "Recursion Fundamentals: Base Case, Call Stack and Fast Power",
    description: "How recursive calls execute, how to design a recursive function, and divide-and-conquer exponentiation.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "text",
          title: "The Recipe",
          content: "A recursive function solves a problem by solving smaller versions of the same problem.\n1. Base case: the smallest input, answered directly (without it you get StackOverflowError).\n2. Recursive case: reduce the input, call yourself, and combine the result.\n3. Trust it: assume the recursive call returns the right answer for the smaller input (this is the 'leap of faith', and it's mathematical induction)."
        },
        {
          type: "code",
          title: "Fast Exponentiation: O(log n) instead of O(n)",
          language: "java",
          code: "static long power(long base, int exp) {\n    if (exp == 0) return 1;                       // base case\n    long half = power(base, exp / 2);             // solve a problem of half the size\n    return (exp % 2 == 0) ? half * half : half * half * base;\n}\n// power(2, 10) -> 1024, power(3, 5) -> 243",
          explanation: "Computing `half` once and squaring it matters. Calling power(base, exp/2) twice would bring the cost back to O(n)."
        },
        {
          type: "dryRun",
          title: "Call Stack for power(2, 5)",
          iterations: [
            { step: "call", variables: { "stack": "power(2,5) → power(2,2) → power(2,1) → power(2,0)" }, description: "Calls go down until the base case." },
            { step: "return", variables: { "power(2,0)": "1", "power(2,1)": "1·1·2 = 2" }, description: "Results bubble up." },
            { step: "return", variables: { "power(2,2)": "2·2 = 4", "power(2,5)": "4·4·2 = 32" }, description: "Each frame combines its child's answer." }
          ]
        },
        {
          type: "warning",
          title: "Common Mistakes",
          items: [
            "A missing or unreachable base case causes infinite recursion and StackOverflowError.",
            "Recomputing the same subproblems (naive Fibonacci is O(2^n)). Memoize, which leads into dynamic programming.",
            "Forgetting that recursion depth costs stack space: O(depth)."
          ]
        },
        {
          type: "quickCheck",
          question: "How many recursive calls does power(2, 16) make, including the base case?",
          options: ["16", "5", "4", "6"],
          answer: 3,
          explanation: "The exponent goes 16 → 8 → 4 → 2 → 1 → 0, which is 6 calls in total: O(log n)."
        },
        {
          type: "takeaways",
          items: ["Base case + smaller recursive case + combine.", "Divide and conquer halves the problem: O(log n) depth.", "Repeated subproblems → memoize."]
        }
      ]
    }
  },
  {
    id: "subsets-and-permutations",
    slug: "subsets-and-permutations",
    title: "Backtracking: Subsets and Permutations",
    description: "The choose / explore / un-choose template that generates every subset and every ordering.",
    estimatedMinutes: 30,
    content: {
      sections: [
        {
          type: "text",
          title: "The Backtracking Template",
          content: "Backtracking builds candidates step by step and undoes each choice after exploring it:\n\nvoid backtrack(state) {\n    if (state is a complete solution) { record a COPY; return; }\n    for (each choice) {\n        make the choice;\n        backtrack(next state);\n        undo the choice;          // this is the 'back' in backtracking\n    }\n}"
        },
        {
          type: "code",
          title: "All Subsets (power set)",
          language: "java",
          code: "static List<List<Integer>> subsets(int[] nums) {\n    List<List<Integer>> res = new ArrayList<>();\n    backtrackSubsets(nums, 0, new ArrayList<>(), res);\n    return res;\n}\nstatic void backtrackSubsets(int[] nums, int start, List<Integer> path, List<List<Integer>> res) {\n    res.add(new ArrayList<>(path));                 // every node of the tree is a subset (copy!)\n    for (int i = start; i < nums.length; i++) {\n        path.add(nums[i]);                          // choose\n        backtrackSubsets(nums, i + 1, path, res);   // explore (only later elements)\n        path.remove(path.size() - 1);               // un-choose\n    }\n}\n// {1, 2, 3} -> [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]",
          explanation: "2^n subsets, each copied in O(n): O(n · 2^n). `start` prevents reusing earlier elements, which would create duplicates like [2, 1]."
        },
        {
          type: "code",
          title: "All Permutations",
          language: "java",
          code: "static List<List<Integer>> permute(int[] nums) {\n    List<List<Integer>> res = new ArrayList<>();\n    permuteHelper(nums, new boolean[nums.length], new ArrayList<>(), res);\n    return res;\n}\nstatic void permuteHelper(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> res) {\n    if (path.size() == nums.length) { res.add(new ArrayList<>(path)); return; }\n    for (int i = 0; i < nums.length; i++) {\n        if (used[i]) continue;\n        used[i] = true;  path.add(nums[i]);\n        permuteHelper(nums, used, path, res);\n        path.remove(path.size() - 1);  used[i] = false;\n    }\n}\n// {1, 2, 3} -> 6 permutations: [1,2,3], [1,3,2], [2,1,3], ...",
          explanation: "Order matters for permutations, so every unused element is a valid next choice (no `start` index). n! results, O(n · n!)."
        },
        {
          type: "warning",
          title: "The #1 Backtracking Bug",
          items: [
            "Adding `path` itself instead of `new ArrayList<>(path)`. Every stored result is the same list object, which is empty after all the un-choosing."
          ]
        },
        {
          type: "quickCheck",
          question: "How many subsets does a set of 5 distinct elements have?",
          options: ["5", "25", "32", "120"],
          answer: 2,
          explanation: "Each element is either in or out: 2^5 = 32 (including the empty set). 120 = 5! is the number of permutations."
        },
        {
          type: "takeaways",
          items: ["Choose → explore → un-choose.", "Subsets use a start index; permutations use a used[] array.", "Always store a copy of the current path."]
        }
      ]
    }
  },
  {
    id: "combination-sum-and-n-queens",
    slug: "combination-sum-and-n-queens",
    title: "Backtracking With Pruning: Combination Sum and N-Queens",
    description: "Cut off dead branches early to make exponential searches practical.",
    estimatedMinutes: 30,
    content: {
      sections: [
        {
          type: "code",
          title: "Combination Sum (reuse allowed)",
          language: "java",
          code: "static List<List<Integer>> combinationSum(int[] candidates, int target) {\n    List<List<Integer>> res = new ArrayList<>();\n    Arrays.sort(candidates);                          // enables early stopping\n    combo(candidates, target, 0, new ArrayList<>(), res);\n    return res;\n}\nstatic void combo(int[] c, int remain, int start, List<Integer> path, List<List<Integer>> res) {\n    if (remain == 0) { res.add(new ArrayList<>(path)); return; }\n    for (int i = start; i < c.length && c[i] <= remain; i++) {   // prune: too big -> stop the loop\n        path.add(c[i]);\n        combo(c, remain - c[i], i, path, res);    // i (not i + 1): the same number may be reused\n        path.remove(path.size() - 1);\n    }\n}\n// {2, 3, 6, 7}, target 7 -> [[2, 2, 3], [7]]",
          explanation: "Sorting plus `c[i] <= remain` cuts whole branches: once a candidate is too big, every later one is too."
        },
        {
          type: "code",
          title: "N-Queens (count the solutions)",
          language: "java",
          code: "static int nQueens(int n) {\n    return place(0, n, new boolean[n], new boolean[2 * n], new boolean[2 * n]);\n}\nstatic int place(int row, int n, boolean[] cols, boolean[] d1, boolean[] d2) {\n    if (row == n) return 1;                                   // all queens placed\n    int count = 0;\n    for (int c = 0; c < n; c++) {\n        if (cols[c] || d1[row + c] || d2[row - c + n]) continue;   // attacked: prune\n        cols[c] = d1[row + c] = d2[row - c + n] = true;\n        count += place(row + 1, n, cols, d1, d2);\n        cols[c] = d1[row + c] = d2[row - c + n] = false;\n    }\n    return count;\n}\n// nQueens(4) -> 2, nQueens(8) -> 92",
          explanation: "One queen per row. Cells on the same '/' diagonal share row + c; cells on the same '\\' diagonal share row − c. Boolean arrays make every attack check O(1)."
        },
        {
          type: "think",
          question: "Without pruning, how many placements would 8-Queens try with one queen per row?",
          answerReveal: "8^8 ≈ 16.7 million complete placements. Pruning attacked squares as you go reduces the explored nodes to about 15,000, which is why pruning makes backtracking practical."
        },
        {
          type: "quickCheck",
          question: "In Combination Sum, why recurse with i rather than i + 1?",
          options: ["To avoid duplicates", "Because each candidate may be used more than once", "To sort the results", "It's a bug"],
          answer: 1,
          explanation: "Passing i lets the same number be picked again. Combination Sum II (each number used once) passes i + 1."
        },
        {
          type: "takeaways",
          items: ["Prune invalid branches as early as possible: sort and break, or check constraints before recursing.", "Represent constraints with O(1) lookups (boolean arrays, sets).", "Backtracking is still exponential; pruning makes it practical."]
        }
      ]
    }
  }
];

export const dynamicProgrammingLessons: CourseLesson[] = [
  {
    id: "dp-introduction",
    slug: "dp-introduction",
    title: "Introduction to DP: Memoization vs Tabulation",
    description: "Recognize overlapping subproblems, then turn exponential recursion into linear time two ways.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "text",
          title: "When Is a Problem DP?",
          content: "Dynamic programming applies when a problem has:\n1. Optimal substructure: the answer can be built from answers to smaller subproblems.\n2. Overlapping subproblems: the same subproblems are solved again and again.\n\nNaive fib(n) = fib(n−1) + fib(n−2) recomputes fib(n−2) many times, so fib(50) needs billions of calls. Store each answer once, and it takes 50 steps."
        },
        {
          type: "code",
          title: "Top-Down: Memoization",
          language: "java",
          code: "static long fibMemo(int n, long[] memo) {\n    if (n <= 1) return n;\n    if (memo[n] != 0) return memo[n];                     // already computed\n    return memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);\n}\n// fibMemo(50, new long[51]) -> 12586269025",
          explanation: "Same recursion, plus a cache. Easy to write from the recurrence; uses an O(n) stack."
        },
        {
          type: "code",
          title: "Bottom-Up: Tabulation (with O(1) space)",
          language: "java",
          code: "static long fibTab(int n) {\n    if (n <= 1) return n;\n    long prev2 = 0, prev1 = 1;\n    for (int i = 2; i <= n; i++) {\n        long cur = prev1 + prev2;\n        prev2 = prev1;\n        prev1 = cur;\n    }\n    return prev1;\n}\n// fibTab(50) -> 12586269025",
          explanation: "Fill the answers from the smallest up. No recursion, and since each step needs only the last two values, the table shrinks to two variables."
        },
        {
          type: "list",
          title: "The 5-Step DP Method",
          items: [
            "**1. Define the state**: what does dp[i] (or dp[i][j]) mean in words?",
            "**2. Recurrence**: how is dp[i] built from smaller states?",
            "**3. Base cases**: the smallest states, known directly.",
            "**4. Order**: compute the states so their dependencies are ready first.",
            "**5. Answer**: which state holds the final result? Then optimize space if only recent rows are needed."
          ]
        },
        {
          type: "quickCheck",
          question: "Naive recursive Fibonacci is O(2^n). With memoization it becomes:",
          options: ["O(log n)", "O(n)", "O(n²)", "Still O(2^n)"],
          answer: 1,
          explanation: "Each fib(k) for k = 0..n is computed once, and each costs O(1) after that."
        },
        {
          type: "takeaways",
          items: ["DP = optimal substructure + overlapping subproblems.", "Memoization: top-down recursion with a cache. Tabulation: bottom-up loops.", "Always define the state in words first."]
        }
      ]
    }
  },
  {
    id: "one-dimensional-dp",
    slug: "one-dimensional-dp",
    title: "1D DP: Climbing Stairs, House Robber and Coin Change",
    description: "Three classic 1D recurrences: counting ways, choose-or-skip, and minimum cost.",
    estimatedMinutes: 30,
    content: {
      sections: [
        {
          type: "code",
          title: "Climbing Stairs (count the ways)",
          language: "java",
          code: "// You can climb 1 or 2 steps. Ways to reach step n?  ways(n) = ways(n-1) + ways(n-2)\nstatic int climbStairs(int n) {\n    int a = 1, b = 1;                 // ways(0) = 1, ways(1) = 1\n    for (int i = 2; i <= n; i++) { int c = a + b; a = b; b = c; }\n    return b;\n}\n// climbStairs(5) -> 8",
          explanation: "The last move was either a 1-step (from n − 1) or a 2-step (from n − 2), so add both counts. It's Fibonacci in disguise."
        },
        {
          type: "code",
          title: "House Robber (choose or skip)",
          language: "java",
          code: "// Can't rob two adjacent houses. Maximize the loot.\n// best(i) = max(best(i-1), best(i-2) + nums[i])\nstatic int rob(int[] nums) {\n    int take = 0, skip = 0;           // best total if the previous house was robbed / not robbed\n    for (int x : nums) {\n        int newTake = skip + x;       // rob this one -> the previous must be skipped\n        skip = Math.max(skip, take);  // skip this one -> keep the better previous state\n        take = newTake;\n    }\n    return Math.max(take, skip);\n}\n// {2, 7, 9, 3, 1} -> 12   (2 + 9 + 1)",
          explanation: "The 'take or skip each item' structure appears in many problems: scheduling, stock trading with cooldown, and more."
        },
        {
          type: "code",
          title: "Coin Change (fewest coins)",
          language: "java",
          code: "static int coinChange(int[] coins, int amount) {\n    int[] dp = new int[amount + 1];            // dp[a] = fewest coins to make amount a\n    Arrays.fill(dp, amount + 1);               // 'infinity' (more than any real answer)\n    dp[0] = 0;\n    for (int a = 1; a <= amount; a++)\n        for (int c : coins)\n            if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);\n    return dp[amount] > amount ? -1 : dp[amount];\n}\n// coins {1, 2, 5}, amount 11 -> 3 (5 + 5 + 1);  coins {2}, amount 3 -> -1",
          explanation: "Greedy (always take the biggest coin) fails for coin sets like {1, 3, 4} with amount 6: greedy gives 4+1+1 = 3 coins, but 3+3 = 2 coins. DP checks every option. O(amount × coins)."
        },
        {
          type: "quickCheck",
          question: "House Robber on {5, 1, 1, 5} returns:",
          options: ["6", "10", "11", "7"],
          answer: 1,
          explanation: "Rob houses 1 and 4: 5 + 5 = 10. They aren't adjacent, and no other valid choice is better."
        },
        {
          type: "takeaways",
          items: ["Counting ways → add the counts of the predecessor states.", "Take or skip → max(skip, previous-skip + value).", "Minimum cost → min over choices + 1; initialize with 'infinity'."]
        }
      ]
    }
  },
  {
    id: "knapsack-01",
    slug: "knapsack-01",
    title: "0/1 Knapsack",
    description: "The template for 'pick items under a capacity' problems, with 2D intuition and a 1D optimization.",
    estimatedMinutes: 30,
    content: {
      sections: [
        {
          type: "text",
          title: "The Problem",
          content: "There are n items, each with a weight and a value, and a bag with capacity W. Each item can be taken at most once (that's the '0/1'). Maximize the total value.\n\nState: dp[i][w] = the best value using the first i items with capacity w.\nRecurrence: dp[i][w] = max( dp[i−1][w]  (skip item i),  dp[i−1][w − wt[i]] + val[i]  (take it, if it fits) ).\nAnswer: dp[n][W]. O(n·W) time."
        },
        {
          type: "code",
          title: "Space-Optimized 1D Version",
          language: "java",
          code: "static int knapsack(int[] wt, int[] val, int W) {\n    int[] dp = new int[W + 1];                   // dp[w] = best value with capacity w\n    for (int i = 0; i < wt.length; i++)\n        for (int w = W; w >= wt[i]; w--)         // BACKWARDS so each item is used at most once\n            dp[w] = Math.max(dp[w], dp[w - wt[i]] + val[i]);\n    return dp[W];\n}\n// weights {1, 3, 4, 5}, values {1, 4, 5, 7}, W = 7 -> 9  (items with weights 3 and 4)",
          explanation: "Going backwards means dp[w − wt[i]] still holds the previous row's value (before item i). Going forwards would allow reusing the item, which is the unbounded knapsack."
        },
        {
          type: "table",
          title: "The Knapsack Family",
          headers: ["Problem", "Twist"],
          rows: [
            ["Subset sum / partition equal subset", "Boolean dp: can we reach exactly sum s?"],
            ["Target sum (+/− signs)", "Count the subsets with a given sum"],
            ["Unbounded knapsack, coin change", "Loop w forwards (items are reusable)"],
            ["Count the ways to make change", "dp[w] += dp[w − coin], coins in the outer loop"]
          ]
        },
        {
          type: "quickCheck",
          question: "In the 1D 0/1 knapsack, what happens if the inner loop runs w from wt[i] up to W instead?",
          options: ["Nothing changes", "Items can be taken more than once (unbounded knapsack)", "It crashes", "It finds the minimum value"],
          answer: 1,
          explanation: "Going forwards, dp[w − wt[i]] may already include item i from this same pass, so the item gets reused."
        },
        {
          type: "takeaways",
          items: ["0/1 knapsack: take or skip each item; dp over capacity.", "1D optimization: iterate capacity backwards for 0/1, forwards for unbounded.", "Subset sum, partition and target sum are all knapsack variants."]
        }
      ]
    }
  },
  {
    id: "two-dimensional-dp",
    slug: "two-dimensional-dp",
    title: "2D DP: Grid Paths, Longest Common Subsequence and Edit Distance",
    description: "DP over two indices: grids and pairs of strings.",
    estimatedMinutes: 30,
    content: {
      sections: [
        {
          type: "code",
          title: "Unique Paths in a Grid",
          language: "java",
          code: "// Robot moves only right or down. Paths from top-left to bottom-right of an m x n grid?\nstatic int uniquePaths(int m, int n) {\n    int[] dp = new int[n];\n    Arrays.fill(dp, 1);                                  // first row: one way to reach each cell\n    for (int r = 1; r < m; r++)\n        for (int c = 1; c < n; c++)\n            dp[c] += dp[c - 1];                          // from above (old dp[c]) + from the left\n    return dp[n - 1];\n}\n// uniquePaths(3, 7) -> 28",
          explanation: "paths(r, c) = paths(r−1, c) + paths(r, c−1). A single row suffices because each row only depends on the one above."
        },
        {
          type: "code",
          title: "Longest Common Subsequence",
          language: "java",
          code: "static int lcs(String a, String b) {\n    int[][] dp = new int[a.length() + 1][b.length() + 1];   // dp[i][j]: LCS of a[0..i), b[0..j)\n    for (int i = 1; i <= a.length(); i++)\n        for (int j = 1; j <= b.length(); j++)\n            dp[i][j] = a.charAt(i - 1) == b.charAt(j - 1)\n                ? dp[i - 1][j - 1] + 1                         // match: extend the diagonal\n                : Math.max(dp[i - 1][j], dp[i][j - 1]);        // skip a char from either string\n    return dp[a.length()][b.length()];\n}\n// lcs(\"abcde\", \"ace\") -> 3,   lcs(\"ABCBDAB\", \"BDCABA\") -> 4",
          explanation: "A subsequence keeps the order but not contiguity. Row 0 and column 0 (empty prefixes) are 0. O(n·m)."
        },
        {
          type: "code",
          title: "Edit Distance (Levenshtein)",
          language: "java",
          code: "static int editDistance(String a, String b) {\n    int[][] dp = new int[a.length() + 1][b.length() + 1];\n    for (int i = 0; i <= a.length(); i++) dp[i][0] = i;     // delete everything\n    for (int j = 0; j <= b.length(); j++) dp[0][j] = j;     // insert everything\n    for (int i = 1; i <= a.length(); i++)\n        for (int j = 1; j <= b.length(); j++)\n            dp[i][j] = a.charAt(i - 1) == b.charAt(j - 1)\n                ? dp[i - 1][j - 1]\n                : 1 + Math.min(dp[i - 1][j - 1],              // replace\n                      Math.min(dp[i - 1][j],                  // delete from a\n                               dp[i][j - 1]));                // insert into a\n    return dp[a.length()][b.length()];\n}\n// (\"horse\", \"ros\") -> 3,   (\"intention\", \"execution\") -> 5",
          explanation: "Used in spell checkers, DNA alignment and diff tools. The three neighbouring cells are the three possible edit operations."
        },
        {
          type: "quickCheck",
          question: "In the LCS table, when a[i−1] == b[j−1], dp[i][j] comes from:",
          options: ["max(left, up)", "The diagonal + 1", "The left cell + 1", "0"],
          answer: 1,
          explanation: "A matching character extends the LCS of both shorter prefixes, which is the diagonal cell dp[i−1][j−1]."
        },
        {
          type: "takeaways",
          items: ["Grid DP: each cell combines the cells above and to the left.", "Two-string DP: dp[i][j] over prefixes; match → diagonal, otherwise the best neighbour.", "Many 2D DPs can be reduced to one row of space."]
        }
      ]
    }
  },
  {
    id: "longest-increasing-subsequence",
    slug: "longest-increasing-subsequence",
    title: "Longest Increasing Subsequence: O(n²) DP and O(n log n)",
    description: "A classic DP improved with binary search, a favourite follow-up in interviews.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "code",
          title: "O(n²) DP",
          language: "java",
          code: "static int lisN2(int[] nums) {\n    int[] dp = new int[nums.length];          // dp[i] = LIS ending exactly at i\n    Arrays.fill(dp, 1);\n    int best = 0;\n    for (int i = 0; i < nums.length; i++) {\n        for (int j = 0; j < i; j++)\n            if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);\n        best = Math.max(best, dp[i]);\n    }\n    return best;\n}\n// {10, 9, 2, 5, 3, 7, 101, 18} -> 4   (e.g. 2, 3, 7, 18)",
          explanation: "The state 'ending exactly at i' is what makes the recurrence work. The answer is the best over all i, not dp[n−1]."
        },
        {
          type: "code",
          title: "O(n log n) With Patience Sorting",
          language: "java",
          code: "static int lisNLogN(int[] nums) {\n    List<Integer> tails = new ArrayList<>();   // tails[k] = smallest tail of any increasing subsequence of length k+1\n    for (int x : nums) {\n        int i = Collections.binarySearch(tails, x);\n        if (i < 0) i = -(i + 1);              // insertion point (lower bound)\n        if (i == tails.size()) tails.add(x);  // x extends the longest subsequence\n        else tails.set(i, x);                 // x is a smaller tail for length i+1\n    }\n    return tails.size();\n}\n// same input -> 4",
          explanation: "tails stays sorted, so each element costs one binary search. Note that tails isn't the actual subsequence, only its length is meaningful."
        },
        {
          type: "dryRun",
          title: "tails on {10, 9, 2, 5, 3, 7, 101, 18}",
          iterations: [
            { step: "10, 9, 2", variables: { tails: "[2]" }, description: "Each one replaces the smaller tail for length 1." },
            { step: "5", variables: { tails: "[2, 5]" }, description: "Extends." },
            { step: "3", variables: { tails: "[2, 3]" }, description: "A better (smaller) tail for length 2." },
            { step: "7, 101", variables: { tails: "[2, 3, 7, 101]" }, description: "Both extend." },
            { step: "18", variables: { tails: "[2, 3, 7, 18]" }, description: "Replaces 101. Length 4 is the answer." }
          ]
        },
        {
          type: "quickCheck",
          question: "Why is the answer of the O(n²) DP max(dp[i]) rather than dp[n−1]?",
          options: ["dp[n−1] is always 1", "dp[i] is the LIS ending at i, and the overall LIS may end anywhere", "To handle negatives", "It's the same thing"],
          answer: 1,
          explanation: "With {1, 2, 3, 0}, dp[3] = 1 but the LIS (1, 2, 3) ends at index 2."
        },
        {
          type: "takeaways",
          items: ["dp[i] = LIS ending at i, giving O(n²).", "Keep the smallest tail for each length + binary search, giving O(n log n).", "Choosing what a DP state means is often the hardest part."]
        }
      ]
    }
  }
];
