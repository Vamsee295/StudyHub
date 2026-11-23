// Long-form theory for DSA recursion, backtracking and dynamic programming. Original writing.
import { LessonTheory } from './utils';
import { THE_ALGORITHMS, TIH, CP_ALGO, MIT_6006 } from './dsa-theory-sources';

export const dsaParadigmsTheory: Record<string, LessonTheory> = {
  "recursion-fundamentals": {
    theory: `Recursion solves a problem by solving smaller instances of the same problem. A recursive function calls itself on a smaller input until it reaches a case it can answer directly. Recursion is the natural way to work with trees, divide-and-conquer algorithms and backtracking, and it's the starting point for dynamic programming. This lesson explains base cases and the call stack, how to design recursive functions with the leap of faith, fast exponentiation, and the costs of recursion.

## The two parts of a recursive function

Every recursive function has two parts:

- **Base case**: an input small enough to answer directly, with no further calls
- **Recursive case**: break the input into smaller pieces, call the function on them, and combine the results

~~~java
long factorial(int n) {
    if (n <= 1) return 1;          // base case
    return n * factorial(n - 1);   // recursive case
}
~~~

Each recursive call must move toward a base case. If it doesn't, because the base case is missing or the input doesn't shrink, the recursion never ends and throws \`StackOverflowError\`.

## The call stack

Each call gets its own stack frame with its own copy of \`n\`. Calling \`factorial(4)\` pushes frames for 4, 3, 2 and 1. The call for 1 returns 1, then each frame multiplies and returns as the stack unwinds: 2 · 1 = 2, 3 · 2 = 6, 4 · 6 = 24.

The maximum depth of the stack determines the memory cost. \`factorial(n)\` uses O(n) stack space. Java doesn't optimize tail calls, so deep recursion, in the range of 10,000 frames or more, risks overflow regardless of how the function is written.

## The leap of faith

Tracing every call quickly becomes overwhelming. The productive way to design a recursive function is to **trust** that it works correctly on smaller inputs, then ask only:

1. What's the base case, and what does it return?
2. Assuming the call on a smaller input returns the right answer, how do I build the answer for this input?

For reversing a string: assume \`reverse(s.substring(1))\` correctly reverses everything after the first character; then the answer is that result followed by the first character. This is the same reasoning as mathematical induction: prove the base case, prove that correctness for smaller inputs implies correctness for this one, and the whole function is correct.

## Types of recursion

Recursive functions come in a few shapes:

| Shape | Calls per invocation | Example | Typical cost |
|---|---|---|---|
| Linear | One | Factorial, sum of a list | O(n) |
| Halving | One, on half the input | Binary search, fast power | O(log n) |
| Divide and conquer | Two or more, on parts | Merge sort | O(n log n) |
| Tree recursion | Two or more, overlapping | Naive Fibonacci | Exponential |

Tree recursion with overlapping calls is the warning sign that leads to dynamic programming.

## Fast exponentiation

Computing xⁿ with a loop takes n multiplications. Recursion with halving takes O(log n), using the fact that xⁿ = (x^(n/2))², with an extra factor of x when n is odd:

~~~java
double power(double x, long n) {
    if (n == 0) return 1;
    if (n < 0) return 1 / power(x, -n);
    double half = power(x, n / 2);
    return (n % 2 == 0) ? half * half : half * half * x;
}
~~~

Computing \`half\` once and squaring it is essential. Writing \`power(x, n / 2) * power(x, n / 2)\` makes two calls at each level and falls back to O(n) work. Taking \`n\` as a \`long\` avoids overflow when negating \`Integer.MIN_VALUE\`, a classic edge case in this problem.

The same idea, **binary exponentiation**, computes large powers modulo a number in cryptography, and raises matrices to powers to compute the n-th Fibonacci number in O(log n).

## Recursion versus iteration

Any recursive function can be written iteratively, and vice versa. Recursion is clearer for problems that are naturally recursive, such as trees, nested structures and backtracking. Iteration avoids stack overflow and the overhead of function calls. A common approach: design recursively, then convert to iteration with an explicit stack if depth is a concern.

## Analyzing recursive functions

Write a recurrence for the running time. For fast power, T(n) = T(n/2) + O(1), giving O(log n). For naive Fibonacci, T(n) = T(n − 1) + T(n − 2) + O(1), giving exponential time. Drawing the recursion tree and summing the work per level is the most reliable method, as covered in the complexity lesson.

## Common mistakes

Most recursion bugs come from a few sources:

- a missing or incorrect base case, including forgetting \`null\` or empty inputs
- a recursive call that doesn't shrink the input
- modifying shared state, such as a list, without undoing the change afterwards
- recomputing the same subproblem many times, which signals the need for memoization

## How interviewers test this

Expect power(x, n), reversing a list or string recursively, and tree problems. State the base case first, explain the recursive step with the leap of faith, write the recurrence for the time cost, and mention stack depth. For power, handle negative exponents and the \`Integer.MIN_VALUE\` edge case.`,
    sources: [MIT_6006, CP_ALGO, THE_ALGORITHMS]
  },

  "subsets-and-permutations": {
    theory: `Backtracking builds solutions one choice at a time, and undoes each choice after exploring where it leads. It systematically explores every possibility, so it suits problems that ask for all subsets, all permutations or all valid arrangements. This lesson explains the backtracking template as a decision tree, applies it to subsets and permutations, and covers the duplicate-handling technique that variants require.

## The decision tree

Picture every solution as a path through a tree of decisions. To generate subsets of \`[1, 2, 3]\`, the first level decides whether to include 1, the second whether to include 2, and the third whether to include 3. Each of the eight leaves is one subset. Backtracking walks this tree depth-first: make a choice, explore everything below it, undo the choice, and try the next option.

## The template

Every backtracking solution follows the same structure:

~~~java
void backtrack(State state, List<Result> results) {
    if (isComplete(state)) {
        results.add(copyOf(state));    // record a snapshot
        return;
    }
    for (Choice c : choices(state)) {
        apply(c, state);               // choose
        backtrack(state, results);     // explore
        undo(c, state);                // un-choose
    }
}
~~~

The **undo** step is what makes this backtracking: the shared state returns to exactly how it was, so the next choice starts clean.

## Copying the result

When recording a solution, add a **copy**: \`results.add(new ArrayList<>(path))\`. If you add \`path\` itself, every entry in the results refers to the same list, which is emptied by the end of the search, so you return a list of empty lists. This is the most common backtracking bug.

## Subsets

Generate every subset of distinct numbers. One approach loops over the remaining elements, adding each in turn:

~~~java
void subsets(int[] nums, int start, List<Integer> path, List<List<Integer>> out) {
    out.add(new ArrayList<>(path));          // every node is a valid subset
    for (int i = start; i < nums.length; i++) {
        path.add(nums[i]);
        subsets(nums, i + 1, path, out);
        path.remove(path.size() - 1);
    }
}
~~~

The \`start\` index ensures each subset is generated once, in increasing index order, so \`[1, 2]\` and \`[2, 1]\` aren't both produced. There are 2ⁿ subsets, and copying each costs up to O(n), so the total is O(n · 2ⁿ).

An alternative uses bitmasks: the numbers 0 to 2ⁿ − 1 each encode a subset, where bit i says whether element i is included. It's iterative and compact, but less flexible for constrained variants.

## Permutations

Every permutation uses all elements, in every order. Instead of a start index, track which elements are already used:

~~~java
void permute(int[] nums, boolean[] used, List<Integer> path, List<List<Integer>> out) {
    if (path.size() == nums.length) {
        out.add(new ArrayList<>(path));
        return;
    }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        used[i] = true;
        path.add(nums[i]);
        permute(nums, used, path, out);
        path.remove(path.size() - 1);
        used[i] = false;
    }
}
~~~

There are n! permutations, each copied in O(n), so the total is O(n · n!). An in-place alternative swaps elements into position: swap \`nums[start]\` with each \`nums[i]\` for i ≥ start, recurse on \`start + 1\`, and swap back.

## Subsets versus permutations

| | Subsets | Permutations |
|---|---|---|
| Order matters | No | Yes |
| Tracks | A start index | A used array |
| Records at | Every node | Leaves only (full length) |
| Count | 2ⁿ | n! |

Combinations of size k are subsets with a length condition: record only when the path has k elements, and stop exploring when not enough elements remain to reach k.

## Handling duplicates

With duplicate input, such as \`[1, 2, 2]\`, the plain algorithms produce repeated results. The fix: **sort** the input so duplicates sit together, then skip a duplicate when it would start the same branch twice.

For subsets, inside the loop:

~~~java
if (i > start && nums[i] == nums[i - 1]) continue;
~~~

This skips a value that equals the previous one at the same level of the tree, while still allowing duplicates deeper in the same path. For permutations, skip \`nums[i]\` if it equals \`nums[i - 1]\` and \`nums[i - 1]\` is unused, which forces equal values to be used in their original order. Using a set of results to remove duplicates afterwards works, but wastes time generating them.

## Why backtracking is exponential

Backtracking enumerates solutions, and the number of solutions is itself exponential: you can't list 2ⁿ subsets in less than 2ⁿ steps. The constraints signal this: backtracking problems usually have n up to about 10 for permutations and about 20 for subsets. Pruning, covered in the next lesson, can cut the search dramatically, but the worst case remains exponential.

## How interviewers test this

Expect subsets, subsets with duplicates, permutations, permutations with duplicates and combinations. Describe the decision tree, write the choose-explore-unchoose template, copy the path when recording, and explain the sort-and-skip rule for duplicates. State the O(n · 2ⁿ) and O(n · n!) costs.`,
    sources: [TIH, THE_ALGORITHMS, CP_ALGO]
  },

  "combination-sum-and-n-queens": {
    theory: `Plain backtracking explores every branch of the decision tree. Pruning stops exploring a branch as soon as it can't lead to a valid solution, which turns hopeless searches into fast ones. This lesson applies pruning to combination sum, where sorting enables early stops, and to the N-Queens problem, where constant-time conflict checks make the search practical. It also covers word search, Sudoku and the general rules for effective pruning.

## What pruning is

Pruning means abandoning a partial solution early. In the decision tree, it cuts off a whole subtree without visiting its leaves. Good pruning checks constraints as soon as a choice is made, rather than waiting for a complete solution. The worst case usually stays exponential, but real running times can drop by orders of magnitude.

## Combination sum

Given distinct positive candidates and a target, find all combinations that sum to the target, where each candidate can be used any number of times. For candidates \`[2, 3, 6, 7]\` and target 7, the answers are \`[2, 2, 3]\` and \`[7]\`.

~~~java
void combine(int[] cand, int start, int remaining, List<Integer> path, List<List<Integer>> out) {
    if (remaining == 0) { out.add(new ArrayList<>(path)); return; }
    for (int i = start; i < cand.length; i++) {
        if (cand[i] > remaining) break;     // pruning: sorted, so the rest are too large
        path.add(cand[i]);
        combine(cand, i, remaining - cand[i], path, out);   // i, not i + 1: reuse allowed
        path.remove(path.size() - 1);
    }
}
// sort cand first, then call combine(cand, 0, target, new ArrayList<>(), out)
~~~

Three details carry the solution:

- passing \`i\` rather than \`i + 1\` allows reusing the same candidate
- the \`start\` index prevents generating \`[2, 3, 2]\` after \`[2, 2, 3]\`
- after sorting, once a candidate exceeds the remaining sum, every later candidate does too, so \`break\` ends the loop instead of trying each one

## Combination sum variants

In the variant where each candidate can be used once and the input contains duplicates, pass \`i + 1\` and add the duplicate-skipping rule: \`if (i > start && cand[i] == cand[i - 1]) continue\`. Another variant fixes the number of elements k; prune when the path already has k elements, or when too few candidates remain to reach k.

## The N-Queens problem

Place n queens on an n × n chessboard so that no two attack each other: no two share a row, column or diagonal. For n = 8 there are 92 solutions.

Brute force would try every placement of n queens on n² squares, an astronomical number. Two observations shrink the search:

1. Each row must contain exactly one queen, so place one queen per row and choose only its column. That leaves at most nⁿ candidates
2. Check conflicts as each queen is placed, and abandon the row's choice immediately if it's attacked

## Constant-time conflict checks

Scanning the board for attacks costs O(n) per check. Three boolean arrays make it O(1):

- \`cols[c]\`: a queen occupies column c
- \`diag[r - c + n - 1]\`: a queen occupies the diagonal going down-right, where r − c is constant
- \`anti[r + c]\`: a queen occupies the anti-diagonal going down-left, where r + c is constant

~~~java
void solve(int r, int n, boolean[] cols, boolean[] diag, boolean[] anti, int[] queens, List<int[]> out) {
    if (r == n) { out.add(queens.clone()); return; }
    for (int c = 0; c < n; c++) {
        if (cols[c] || diag[r - c + n - 1] || anti[r + c]) continue;   // prune
        cols[c] = diag[r - c + n - 1] = anti[r + c] = true;
        queens[r] = c;
        solve(r + 1, n, cols, diag, anti, queens, out);
        cols[c] = diag[r - c + n - 1] = anti[r + c] = false;
    }
}
~~~

There are 2n − 1 diagonals in each direction, so the diagonal arrays have that length. Adding \`n - 1\` to r − c shifts negative values into a valid index.

The search is bounded by n!, since each row has fewer free columns than the one before, and pruning keeps it far below that in practice. Bitmasks can replace the boolean arrays for extra speed, and counting solutions instead of listing them avoids building boards.

## Word search

Given a grid of letters and a word, check whether the word can be traced through adjacent cells without reusing a cell. Start a DFS from every cell matching the first letter. At each step, prune immediately if the cell is out of bounds, already used, or doesn't match the next letter. Mark the cell as used during exploration, for example by temporarily replacing its letter with \`'#'\`, and restore it when backtracking. Forgetting to restore it breaks later searches from other starting cells.

## Sudoku

A Sudoku solver fills empty cells one at a time, trying digits 1 to 9 and pruning any digit already in the cell's row, column or 3 × 3 box. Tracking used digits in arrays or bitmasks makes each check O(1). Choosing the empty cell with the fewest legal digits first is a powerful heuristic: it fails fast, and cells with one option fill without branching.

## Rules for effective pruning

Across these problems, the same principles make backtracking fast:

- **Check constraints early**: validate each choice when it's made, not at the end
- **Sort to enable early exits**: sorted candidates let one failed check skip all later ones
- **Make checks O(1)**: maintain helper arrays or sets instead of rescanning
- **Choose the most constrained decision first**: fewer options at the top of the tree means smaller subtrees overall
- **Skip duplicate branches**: sort and skip equal values at the same level

## How interviewers test this

Expect combination sum I and II, N-Queens, word search and Sudoku solver. Explain which branches you prune and why the pruning is safe, show the O(1) diagonal indexing for N-Queens, and remember to restore state when backtracking.`,
    sources: [TIH, CP_ALGO, THE_ALGORITHMS]
  },

  "dp-introduction": {
    theory: `Dynamic programming (DP) solves problems by breaking them into overlapping subproblems, solving each subproblem once, and storing its answer for reuse. It turns many exponential recursive solutions into polynomial ones. DP has a reputation for difficulty, but it follows a repeatable method. This lesson explains the two properties a problem needs, the top-down and bottom-up approaches, a four-step method for designing DP solutions, and how to reduce memory.

## Overlapping subproblems

Naive recursive Fibonacci recomputes the same values over and over:

~~~java
int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}
~~~

Computing \`fib(5)\` calls \`fib(3)\` twice and \`fib(2)\` three times. The number of calls grows roughly like 1.6ⁿ, so \`fib(50)\` makes tens of billions of calls. Yet there are only 51 distinct subproblems. When a recursive solution keeps solving the same subproblems, it has **overlapping subproblems**, and storing answers eliminates the waste.

## Optimal substructure

The second property is **optimal substructure**: an optimal solution can be built from optimal solutions to its subproblems. The shortest path from A to C through B consists of a shortest path from A to B followed by a shortest path from B to C. Problems without this property, such as the longest path that never repeats a vertex in a general graph, can't be solved by combining subproblem answers.

Divide and conquer, such as merge sort, also splits problems into subproblems, but its subproblems don't overlap, so there's nothing to reuse.

## Top-down: memoization

Memoization keeps the recursive structure and adds a cache. Before computing, check whether the answer is stored; after computing, store it:

~~~java
long fib(int n, long[] memo) {
    if (n <= 1) return n;
    if (memo[n] != 0) return memo[n];
    return memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
}
~~~

Each subproblem is now computed once, so the time drops from exponential to O(n). Memoization is often the fastest way to a correct DP solution, because you write the natural recursion first and add caching. When a valid answer can be 0, initialize the memo with a sentinel such as −1, or the cache check fails.

## Bottom-up: tabulation

Tabulation fills a table iteratively, starting from the base cases and working toward the answer:

~~~java
long fib(int n) {
    if (n <= 1) return n;
    long[] dp = new long[n + 1];
    dp[1] = 1;
    for (int i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
    return dp[n];
}
~~~

There's no recursion, so no stack overflow risk and no function call overhead. The catch is that you must order the computation so every subproblem is solved before it's needed.

## Choosing between them

| | Memoization (top-down) | Tabulation (bottom-up) |
|---|---|---|
| Style | Recursion plus a cache | Loops filling a table |
| Subproblems solved | Only those reachable from the start | All of them |
| Stack overflow risk | Yes, for deep recursion | No |
| Space optimization | Hard | Often straightforward |
| Ease of writing | Follows the recursion directly | Requires a fill order |

A good interview approach: derive the recursion, memoize it, then convert to tabulation if asked or if depth is a concern.

## A four-step method

Most DP problems yield to the same steps:

1. **Define the state**: what does \`dp[i]\` or \`dp[i][j]\` mean, in words? For example, "the minimum cost to reach step i"
2. **Write the recurrence**: how does a state depend on smaller states? For example, \`dp[i] = cost[i] + min(dp[i - 1], dp[i - 2])\`
3. **Set the base cases**: the smallest states, answered directly
4. **Decide the order and the answer**: fill states so dependencies come first, and identify which state holds the final answer

Writing the state definition as a sentence is the most important step. Most DP bugs come from a vague definition.

## Reducing memory

When each state depends only on the last few states, you don't need the whole table. Fibonacci needs only the previous two values:

~~~java
long prev = 0, cur = 1;
for (int i = 2; i <= n; i++) {
    long next = prev + cur;
    prev = cur;
    cur = next;
}
~~~

That's O(1) space. A 2D table where each row depends only on the previous row can keep two rows, reducing O(n · m) space to O(m). Interviewers often ask for this optimization after the full-table version.

## Recognizing DP problems

Look for these clues:

- the problem asks for a **count** of ways, a **minimum** or **maximum**, or whether something is **possible**
- each step involves a **choice**: take or skip, go left or right, match or don't
- a brute-force recursion would revisit the same states
- the constraints allow O(n²) or O(n · m) but not exponential time

Greedy algorithms also make choices, but they commit to the locally best option without reconsidering. When a greedy choice can be proven safe, it's faster; when it can't, as in coin change with arbitrary coins, DP is needed.

## How interviewers test this

Expect Fibonacci or climbing stairs as a warm-up, and an explanation of memoization versus tabulation. State both properties, define the state in words, write the recurrence and base cases, give the time as the number of states times the work per state, and offer the space optimization.`,
    sources: [MIT_6006, CP_ALGO, TIH]
  },

  "one-dimensional-dp": {
    theory: `One-dimensional DP problems have states indexed by a single number, such as a position in an array or an amount of money. They're the best place to practise the DP method, and a few classics cover patterns that recur everywhere: counting ways, choosing whether to take each element, and building an amount from parts. This lesson works through climbing stairs, house robber and coin change, and shows how each fits the four-step method.

## Climbing stairs

You can climb 1 or 2 steps at a time. How many distinct ways are there to reach step n?

1. **State**: \`dp[i]\` is the number of ways to reach step i
2. **Recurrence**: the last move was either 1 step, from step i − 1, or 2 steps, from step i − 2, so \`dp[i] = dp[i - 1] + dp[i - 2]\`
3. **Base cases**: \`dp[0] = 1\`, the empty climb, and \`dp[1] = 1\`
4. **Answer**: \`dp[n]\`

This is the Fibonacci recurrence, and it reduces to two variables for O(n) time and O(1) space. The general lesson: to count ways, consider the **last step** and add the counts for each way you could have arrived.

If the allowed steps were 1, 2 or 3, the recurrence would add three terms. If some steps were broken, \`dp[i]\` would be 0 for those steps.

## Min cost climbing stairs

Each step has a cost, and you pay it when you stand on it. Starting from step 0 or 1, find the minimum cost to reach the top. The state changes from a count to a minimum: \`dp[i] = cost[i] + min(dp[i - 1], dp[i - 2])\`. Counting problems add, and optimization problems take a minimum or maximum, but the structure is identical.

## House robber

Houses in a row contain money. You can't rob two adjacent houses. What's the maximum you can rob?

1. **State**: \`dp[i]\` is the maximum money from the first i + 1 houses
2. **Recurrence**: at house i, either skip it, keeping \`dp[i - 1]\`, or rob it, adding its money to \`dp[i - 2]\`. So \`dp[i] = max(dp[i - 1], dp[i - 2] + nums[i])\`
3. **Base cases**: \`dp[0] = nums[0]\` and \`dp[1] = max(nums[0], nums[1])\`
4. **Answer**: \`dp[n - 1]\`

~~~java
int rob(int[] nums) {
    int prev2 = 0, prev1 = 0;
    for (int x : nums) {
        int cur = Math.max(prev1, prev2 + x);
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}
~~~

This "take it or skip it" choice is one of the most common DP patterns. The circular variant, where the first and last houses are adjacent, runs the same algorithm twice: once excluding the first house and once excluding the last, taking the better result.

## Why greedy fails here

Robbing the largest houses first, or alternating houses, doesn't work. For \`[2, 1, 1, 2]\`, robbing every other house gives 3, but robbing the first and last gives 4. Only by comparing both choices at each step does DP guarantee the optimum.

## Coin change: fewest coins

Given coin denominations and an amount, find the fewest coins that make the amount, or −1 if impossible.

1. **State**: \`dp[a]\` is the fewest coins making amount a
2. **Recurrence**: the last coin used was some coin c, so \`dp[a] = 1 + min(dp[a - c])\` over every coin c ≤ a
3. **Base case**: \`dp[0] = 0\`
4. **Answer**: \`dp[amount]\`, or −1 if it's still unreachable

~~~java
int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);          // acts as infinity
    dp[0] = 0;
    for (int a = 1; a <= amount; a++)
        for (int c : coins)
            if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
    return dp[amount] > amount ? -1 : dp[amount];
}
~~~

Using \`amount + 1\` as infinity, rather than \`Integer.MAX_VALUE\`, avoids overflow when adding 1. The cost is O(amount × number of coins) time and O(amount) space.

Greedy, always taking the largest coin, fails for some coin systems. With coins \`[1, 3, 4]\` and amount 6, greedy takes 4 + 1 + 1, three coins, while 3 + 3 uses two. Greedy happens to work for standard currency denominations, but not in general.

## Coin change: counting combinations

Counting the ways to make an amount needs care about order. Should 1 + 2 and 2 + 1 count as one way or two?

- **Combinations** (order doesn't matter): loop over coins in the **outer** loop and amounts in the inner loop. Each coin is considered in a fixed order, so each combination is counted once
- **Permutations** (order matters): loop over amounts in the outer loop and coins in the inner loop

Swapping the loops changes the answer, and interviewers like to ask why. With coins as the outer loop, by the time a coin is processed, only combinations using earlier coins exist, so arrangements of the same coins aren't counted twice.

## Other 1D patterns

Several more problems follow the same template:

- **Decode ways**: count the ways to decode a digit string where 1 to 26 map to letters; \`dp[i]\` adds \`dp[i - 1]\` for a valid single digit and \`dp[i - 2]\` for a valid two-digit number
- **Word break**: \`dp[i]\` is true if the first i characters split into dictionary words; check every j where \`dp[j]\` is true and the substring from j to i is a word
- **Maximum subarray**: Kadane's algorithm is 1D DP, where the state is the best sum ending at index i

## How interviewers test this

Expect climbing stairs, house robber, coin change and decode ways. For each, define the state in words, derive the recurrence from the last choice, set base cases carefully, and reduce space when the recurrence looks back a fixed distance. For coin change, explain why greedy fails and how loop order separates combinations from permutations.`,
    sources: [TIH, CP_ALGO, MIT_6006]
  },

  "knapsack-01": {
    theory: `The 0/1 knapsack problem asks: given items with weights and values, and a bag with a weight capacity, which items should you take to maximize total value? Each item is either taken whole or left, hence "0/1". It's the model for a large family of interview problems about choosing subsets under a budget. This lesson builds the 2D DP solution, reduces it to one dimension, explains why the inner loop runs backwards, and shows how subset sum and partition problems map onto it.

## The problem

You have n items, where item i has weight \`w[i]\` and value \`v[i]\`, and a capacity W. Choose a subset with total weight at most W and maximum total value. Greedy approaches, such as taking items by best value-to-weight ratio, fail. With capacity 10 and items (weight 6, value 30), (weight 5, value 20) and (weight 5, value 20), the best ratio picks the first item for 30, but the other two together give 40.

Trying every subset costs O(2ⁿ). DP does better when the capacity is moderate.

## The 2D state

1. **State**: \`dp[i][c]\` is the maximum value using only the first i items with capacity c
2. **Recurrence**: for item i, either skip it or take it, if it fits:

~~~text
dp[i][c] = dp[i-1][c]                               if w[i] > c
dp[i][c] = max(dp[i-1][c], dp[i-1][c - w[i]] + v[i])  otherwise
~~~

3. **Base cases**: \`dp[0][c] = 0\` for every c, since no items give no value
4. **Answer**: \`dp[n][W]\`

Each item's decision looks only at the row for the previous items. Taking the item reduces the remaining capacity by its weight, and since each item can be used once, the lookup goes to the previous row.

~~~java
int knapsack(int[] w, int[] v, int W) {
    int n = w.length;
    int[][] dp = new int[n + 1][W + 1];
    for (int i = 1; i <= n; i++) {
        for (int c = 0; c <= W; c++) {
            dp[i][c] = dp[i - 1][c];
            if (w[i - 1] <= c)
                dp[i][c] = Math.max(dp[i][c], dp[i - 1][c - w[i - 1]] + v[i - 1]);
        }
    }
    return dp[n][W];
}
~~~

The cost is O(n · W) time and space.

## Pseudo-polynomial time

O(n · W) looks polynomial, but W is a number, not a count of items. If W is a billion, the table has billions of columns. Because the running time grows with the numeric value of the input rather than its length, it's called **pseudo-polynomial**. The general knapsack problem is NP-hard, and DP works only when capacities are reasonably small. Mentioning this distinction shows depth.

## Recovering the chosen items

To find which items were taken, walk the table backwards from \`dp[n][W]\`. If \`dp[i][c]\` differs from \`dp[i - 1][c]\`, item i was taken, so record it and reduce c by its weight. Otherwise item i was skipped. This needs the full 2D table, so it conflicts with the space optimization below.

## Reducing to one dimension

Each row depends only on the previous row, so one array of size W + 1 suffices, updated in place. The inner loop must run **from high capacity down to low**:

~~~java
int[] dp = new int[W + 1];
for (int i = 0; i < n; i++)
    for (int c = W; c >= w[i]; c--)
        dp[c] = Math.max(dp[c], dp[c - w[i]] + v[i]);
~~~

## Why the loop runs backwards

The update for \`dp[c]\` reads \`dp[c - w[i]]\`, which must still hold the value from before item i was considered. Going downward, smaller capacities haven't been updated yet in this round, so they still hold previous-row values. Going upward, \`dp[c - w[i]]\` would already include item i, letting the same item be added again and again.

That accidental behaviour is exactly the **unbounded knapsack**, where each item can be used any number of times. So the loop direction is the only difference between the two problems in the 1D form: backwards for 0/1, forwards for unbounded. Coin change is an unbounded knapsack.

## Subset sum

Given positive integers and a target, can some subset sum to the target exactly? This is a knapsack where each number's weight is its value and the question is reachability:

~~~java
boolean[] dp = new boolean[target + 1];
dp[0] = true;
for (int x : nums)
    for (int s = target; s >= x; s--)
        dp[s] = dp[s] || dp[s - x];
~~~

## Partition equal subset sum

Can an array be split into two subsets with equal sums? If the total is odd, no. Otherwise, the question becomes whether some subset sums to half the total, which is subset sum. Recognizing this reduction is the whole problem.

## Target sum

Assign a plus or minus sign to each number so the expression equals a target. If P is the sum of numbers with plus signs and N the sum with minus signs, then P − N = target and P + N = total, so P = (target + total) / 2. The problem becomes counting subsets with sum P, a counting version of subset sum where \`dp[s] += dp[s - x]\`. The reduction requires \`target + total\` to be even and non-negative.

## Recognizing knapsack problems

The clues: a set of items, each used at most once, a budget or target, and a question about the best value, whether the target is reachable, or how many ways reach it. Partition problems, last stone weight II and ones-and-zeroes, a knapsack with two capacities, all fit the pattern.

## How interviewers test this

Expect 0/1 knapsack itself, partition equal subset sum, target sum and last stone weight II. Define the take-or-skip state, explain the backwards loop in the 1D version and how forwards gives the unbounded variant, and mention pseudo-polynomial time. For reductions, show the algebra that turns the problem into subset sum.`,
    sources: [CP_ALGO, MIT_6006, TIH]
  },

  "two-dimensional-dp": {
    theory: `Two-dimensional DP problems have states indexed by two numbers, usually positions in a grid or positions in two strings. The table becomes a grid, and each cell depends on its neighbours above, to the left, or diagonally. This lesson covers grid path counting and minimum path sum, then the two most important string DP problems: longest common subsequence and edit distance. It closes with space reduction to a single row.

## Unique paths in a grid

A robot starts at the top-left of an m × n grid and moves only right or down. How many paths reach the bottom-right?

1. **State**: \`dp[r][c]\` is the number of paths to cell (r, c)
2. **Recurrence**: the last move came from above or from the left, so \`dp[r][c] = dp[r - 1][c] + dp[r][c - 1]\`
3. **Base cases**: every cell in the first row and first column has exactly one path
4. **Answer**: \`dp[m - 1][n - 1]\`

The time and space are O(m · n). With obstacles, set \`dp[r][c] = 0\` for blocked cells, and remember that an obstacle in the first row blocks every cell to its right. There's also a closed form: the path is m − 1 downs and n − 1 rights in some order, so the count is the binomial coefficient C(m + n − 2, m − 1).

## Minimum path sum

Each cell has a cost, and you want the cheapest path from the top-left to the bottom-right. Replace addition of counts with a minimum: \`dp[r][c] = grid[r][c] + min(dp[r - 1][c], dp[r][c - 1])\`, with the first row and column accumulating along their single paths. The same template handles the maximum path, the triangle problem and falling paths.

## Longest common subsequence

A **subsequence** keeps characters in order but can skip some; \`"ace"\` is a subsequence of \`"abcde"\`. The longest common subsequence (LCS) of two strings is the longest sequence that's a subsequence of both. For \`"abcde"\` and \`"ace"\`, it's \`"ace"\`, length 3. LCS powers the \`diff\` tool and DNA sequence comparison.

1. **State**: \`dp[i][j]\` is the LCS length of the first i characters of a and the first j characters of b
2. **Recurrence**:

~~~text
if a[i-1] == b[j-1]:  dp[i][j] = dp[i-1][j-1] + 1
else:                 dp[i][j] = max(dp[i-1][j], dp[i][j-1])
~~~

3. **Base cases**: \`dp[0][j] = dp[i][0] = 0\`, since an empty string shares nothing
4. **Answer**: \`dp[m][n]\`

~~~java
int lcs(String a, String b) {
    int m = a.length(), n = b.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 1; i <= m; i++)
        for (int j = 1; j <= n; j++)
            dp[i][j] = (a.charAt(i - 1) == b.charAt(j - 1))
                ? dp[i - 1][j - 1] + 1
                : Math.max(dp[i - 1][j], dp[i][j - 1]);
    return dp[m][n];
}
~~~

The extra row and column for empty prefixes remove special cases, at the cost of the \`i - 1\` and \`j - 1\` offsets when reading characters. When the last characters match, they can always be part of an LCS; when they don't, at least one of them is excluded, so take the better of dropping either.

## Edit distance

The edit distance between two strings is the minimum number of insertions, deletions and substitutions to turn one into the other. Turning \`"horse"\` into \`"ros"\` takes 3 operations. Spell checkers and fuzzy search use it.

1. **State**: \`dp[i][j]\` is the edit distance between the first i characters of a and the first j characters of b
2. **Recurrence**: if the last characters match, \`dp[i][j] = dp[i - 1][j - 1]\`. Otherwise, take 1 plus the minimum of the three operations listed below
3. **Base cases**: \`dp[i][0] = i\` (delete everything) and \`dp[0][j] = j\` (insert everything)
4. **Answer**: \`dp[m][n]\`

The three operations each map to a neighbouring cell:

- \`dp[i - 1][j]\`: delete a's last character
- \`dp[i][j - 1]\`: insert b's last character
- \`dp[i - 1][j - 1]\`: substitute one for the other

The base cases differ from LCS, and they're a common mistake: they're not zero, because turning a string into an empty one costs one deletion per character.

## Reconstructing the answer

To print the LCS itself or the list of edits, walk back from \`dp[m][n]\`: where characters match, step diagonally and record the character; otherwise, step toward the neighbour that produced the current value. This requires the full table.

## Reducing space

Each row depends only on the row above and the current row, so two rows of length n + 1 suffice, cutting space from O(m · n) to O(n). With one row, you must save the diagonal value \`dp[i - 1][j - 1]\` in a variable before overwriting it, because it's needed for the next cell. Choosing the shorter string for the row dimension minimizes memory.

## Other 2D problems

The same structure solves many more: longest palindromic subsequence, which is the LCS of a string and its reverse; interleaving strings; distinct subsequences; regular expression and wildcard matching; and maximal square in a binary matrix, where \`dp[r][c] = 1 + min\` of the three neighbours.

## How interviewers test this

Expect unique paths, minimum path sum, longest common subsequence and edit distance. Define the state for prefixes of both strings, explain each branch of the recurrence, get the base cases right, especially for edit distance, and offer the two-row space optimization.`,
    sources: [CP_ALGO, MIT_6006, TIH]
  },

  "longest-increasing-subsequence": {
    theory: `The longest increasing subsequence (LIS) problem asks for the length of the longest subsequence whose elements strictly increase. In \`[10, 9, 2, 5, 3, 7, 101, 18]\`, one LIS is \`[2, 3, 7, 18]\`, with length 4. LIS has a classic O(n²) DP solution and an elegant O(n log n) solution that combines a greedy idea with binary search. This lesson explains both, how to reconstruct the sequence, and the problems that reduce to LIS.

## Subsequence, not subarray

A subsequence keeps the original order but can skip elements; a subarray must be contiguous. In the example, \`[2, 5, 7, 101]\` is an increasing subsequence even though other elements sit between its members. Clarify whether the problem means strictly increasing or non-decreasing, since it changes one comparison.

## The O(n²) DP

1. **State**: \`dp[i]\` is the length of the longest increasing subsequence **ending at** index i
2. **Recurrence**: \`dp[i] = 1 + max(dp[j])\` over all j < i with \`nums[j] < nums[i]\`, or 1 if no such j exists
3. **Base case**: every \`dp[i]\` starts at 1, the element alone
4. **Answer**: the maximum over all \`dp[i]\`, not \`dp[n - 1]\`

~~~java
int lis(int[] nums) {
    int n = nums.length, best = 0;
    int[] dp = new int[n];
    for (int i = 0; i < n; i++) {
        dp[i] = 1;
        for (int j = 0; j < i; j++)
            if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
        best = Math.max(best, dp[i]);
    }
    return best;
}
~~~

## Why "ending at"

Defining the state as "the LIS among the first i elements" doesn't work: to extend a subsequence with \`nums[i]\`, you need to know its last element, and that definition loses it. "Ending at index i" pins down the last element, so the recurrence can check \`nums[j] < nums[i]\`. Taking the maximum over all \`dp[i]\` at the end is necessary because the LIS can end anywhere. Returning \`dp[n - 1]\` is a common bug.

This runs in O(n²) time and O(n) space, fine for n up to a few thousand.

## The O(n log n) idea

Keep an array \`tails\`, where \`tails[k]\` is the **smallest possible last element** of any increasing subsequence of length k + 1 found so far. A smaller tail is always better, because it leaves more room for future elements to extend it.

For each new number x:

- if x is larger than every tail, append it: it extends the longest subsequence
- otherwise, find the first tail that's at least x and replace it with x: there's now a subsequence of that length with a smaller ending

~~~java
int lis(int[] nums) {
    int[] tails = new int[nums.length];
    int size = 0;
    for (int x : nums) {
        int lo = 0, hi = size;
        while (lo < hi) {                       // lower bound: first tail >= x
            int mid = lo + (hi - lo) / 2;
            if (tails[mid] < x) lo = mid + 1;
            else hi = mid;
        }
        tails[lo] = x;
        if (lo == size) size++;
    }
    return size;
}
~~~

The \`tails\` array stays sorted, which is what allows binary search. Each element costs O(log n), so the total is O(n log n).

## Tracing it

For \`[10, 9, 2, 5, 3, 7, 101, 18]\`:

| x | Action | tails |
|---|---|---|
| 10 | Append | 10 |
| 9 | Replace 10 | 9 |
| 2 | Replace 9 | 2 |
| 5 | Append | 2, 5 |
| 3 | Replace 5 | 2, 3 |
| 7 | Append | 2, 3, 7 |
| 101 | Append | 2, 3, 7, 101 |
| 18 | Replace 101 | 2, 3, 7, 18 |

The length is 4.

## What tails isn't

\`tails\` is not necessarily an actual increasing subsequence of the input. After processing \`[3, 4, 1]\`, \`tails\` is \`[1, 4]\`, but 1 comes after 4 in the input. Only its length is guaranteed to be correct. Interviewers often probe this point.

For a non-decreasing subsequence, search for the first tail strictly greater than x (upper bound) instead.

## Reconstructing the sequence

With the O(n²) DP, keep a \`parent\` array: when \`dp[i]\` improves through j, set \`parent[i] = j\`. Start from the index with the largest \`dp\` value and follow parents back. With the O(n log n) method, store the index of the element at each tail position, and for each element, record the index of the tail before it; following those links recovers a valid LIS.

## Problems that reduce to LIS

Several problems become LIS after a transformation:

- **Russian doll envelopes**: an envelope fits inside another if both its width and height are smaller. Sort by width ascending and, for equal widths, by height **descending**, then find the LIS of the heights. The descending tie-break stops two envelopes of the same width from being counted as nested
- **Number of longest increasing subsequences**: alongside each \`dp[i]\`, track how many subsequences achieve it
- **Largest divisible subset**: sort, then apply the O(n²) DP with divisibility instead of comparison
- **Minimum deletions to make an array sorted**: the array length minus the LIS length
- **Box stacking and building bridges**: sort by one dimension, then LIS on the other

## How interviewers test this

Expect the O(n²) DP first, then "Can you do better?" Explain why the state must end at index i, describe the tails array and why it stays sorted, give the O(n log n) argument, and point out that tails isn't the subsequence itself. Russian doll envelopes is a common follow-up that tests the sorting trick.`,
    sources: [CP_ALGO, TIH, THE_ALGORITHMS]
  }
};
