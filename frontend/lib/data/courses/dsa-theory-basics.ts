// Long-form theory for DSA fundamentals, arrays and strings. Original writing.
import { LessonTheory } from './utils';
import { ODS, THE_ALGORITHMS, TIH, CP_ALGO, MIT_6006, JAVA_API } from './dsa-theory-sources';

export const dsaBasicsTheory: Record<string, LessonTheory> = {
  "big-o-notation": {
    theory: `Big-O notation describes how the running time or memory of an algorithm grows as its input grows. It ignores machine speed and constant factors, and keeps only the term that dominates for large inputs. This lesson explains what Big-O means formally, the common growth classes, the rules for simplifying expressions, and the difference between best, average, worst and amortized cases.

## Why count operations instead of seconds

A program that takes 2 seconds on your laptop might take 0.5 seconds on a server. Seconds depend on hardware, language and compiler, so they can't compare algorithms fairly. Instead, you count the basic operations an algorithm performs, such as comparisons or array accesses, as a function of the input size n. Then you ask how that count grows when n doubles or grows tenfold.

## The formal idea

A function f(n) is O(g(n)) if there are constants c and n₀ such that f(n) ≤ c · g(n) for every n ≥ n₀. In plain terms: beyond some input size, f never grows faster than a constant multiple of g. Big-O is an upper bound. Two related notations complete the picture:

- **Big-Omega (Ω)**: a lower bound; f grows at least as fast as g
- **Big-Theta (Θ)**: a tight bound; f grows at the same rate as g, bounded above and below

In interviews, people say "O(n)" when they usually mean the tight bound Θ(n). That's accepted, but knowing the distinction shows depth.

## Common growth classes

| Class | Name | Example | n = 1,000,000 |
|---|---|---|---|
| O(1) | Constant | Array access by index | 1 step |
| O(log n) | Logarithmic | Binary search | about 20 steps |
| O(n) | Linear | Scanning an array | 10⁶ steps |
| O(n log n) | Linearithmic | Merge sort | about 2 × 10⁷ steps |
| O(n²) | Quadratic | Comparing every pair | 10¹² steps |
| O(2ⁿ) | Exponential | Generating all subsets | Infeasible |
| O(n!) | Factorial | Generating all permutations | Infeasible |

A modern computer performs roughly 10⁸ to 10⁹ basic operations per second. That turns into a practical guide: with n up to 10⁵, an O(n²) solution takes around 10¹⁰ operations and times out, while O(n log n) finishes in milliseconds.

## Simplification rules

You simplify a precise count into its Big-O class with three rules:

1. **Drop constants**: 3n + 5 becomes O(n). Constant factors depend on hardware and implementation details
2. **Keep the dominant term**: n² + 100n + 1000 becomes O(n²), because n² outgrows the rest as n grows
3. **Keep different inputs separate**: a loop over an array of size n and another over a list of size m costs O(n + m), not O(n). Nested loops over both cost O(n · m)

A common mistake is writing O(2n) or O(n² + n). Both are correct but unsimplified; write O(n) and O(n²).

## Best, average and worst case

The same algorithm can behave differently on different inputs of the same size. Linear search for a value finds it at index 0 in the best case, somewhere in the middle on average, and at the end or not at all in the worst case. Quick sort runs in O(n log n) on average but O(n²) in the worst case, when its pivots split the array badly.

Interviewers usually want the **worst case**, because it's a guarantee. Mention the average case when it differs and matters, as with quick sort and hash tables.

## Amortized analysis

Some operations are usually cheap and occasionally expensive. Appending to a Java \`ArrayList\` is O(1) most of the time, but when the internal array is full, it allocates a larger array (about 1.5 times the size) and copies every element, which costs O(n). Averaged over a long sequence of appends, the total copying work stays proportional to the number of appends, so each append costs O(1) **amortized**. Amortized cost is a guarantee about sequences, not an average over random inputs.

## Big-O in practice

Big-O isn't the whole story. An O(n) algorithm with a huge constant can lose to an O(n log n) one for realistic sizes, and cache-friendly array scans often beat pointer-heavy structures with the same Big-O. Java's sort for primitive arrays switches to insertion sort for tiny ranges for this reason. Use Big-O to rule out approaches that can't scale, then think about constants when choosing among the rest.

## How interviewers test this

Expect to state the time and space complexity of every solution you write, and to justify it. Count the loops and what each iteration costs, name the dominant term, and say which case you're describing. If your first solution is O(n²), the follow-up is almost always "Can you do better?", so know which growth class the input size demands.`,
    sources: [MIT_6006, TIH, ODS]
  },

  "analyzing-time-complexity": {
    theory: `Knowing the growth classes is half the job. The other half is reading a piece of code and deriving its complexity correctly, including loops whose bounds change, logarithmic loops, and recursive functions. This lesson gives you a repeatable method for loops, explains why halving loops are O(log n), and shows how to analyze recursion with recurrence relations, recursion trees and the master theorem.

## Sequential and nested loops

Code that runs one block after another adds its costs. Code nested inside a loop multiplies by the number of iterations:

~~~java
for (int i = 0; i < n; i++) { ... }        // O(n)
for (int j = 0; j < m; j++) { ... }        // + O(m)  => O(n + m)

for (int i = 0; i < n; i++)
    for (int j = 0; j < n; j++) { ... }    // O(n * n) = O(n^2)
~~~

The method: find how many times the innermost statement runs, as a sum over the loop variables, then simplify.

## Loops with dependent bounds

When the inner loop depends on the outer variable, count the total iterations:

~~~java
for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++) { ... }
~~~

The inner loop runs n − 1, then n − 2, down to 0 times. The sum is n(n − 1)/2, which is still O(n²). This pattern, every pair once, appears in brute-force pair problems such as Two Sum.

## Logarithmic loops

A loop that multiplies or divides its variable by a constant runs O(log n) times:

~~~java
for (int i = 1; i < n; i *= 2) { ... }     // i = 1, 2, 4, 8, ...
~~~

After k iterations, i equals 2ᵏ. The loop stops when 2ᵏ ≥ n, so k is about log₂ n. Binary search works the same way: each step halves the search range, so a range of a million elements needs about 20 steps. The base of the logarithm doesn't matter in Big-O, because log₂ n and log₁₀ n differ only by a constant factor.

## A tricky case

This loop looks like O(n log n), but it's O(n):

~~~java
for (int size = n; size > 0; size /= 2)
    for (int j = 0; j < size; j++) { ... }
~~~

The inner loop runs n, then n/2, then n/4 times, and so on. That series sums to less than 2n, so the total is O(n). Always sum the actual work instead of multiplying the outer count by the largest inner count.

## Recurrence relations

A recursive function's cost is described by a recurrence: the cost for input n in terms of the cost of smaller inputs. Merge sort splits the array in half, sorts both halves recursively and merges in linear time:

~~~text
T(n) = 2T(n/2) + O(n)
~~~

Binary search makes one recursive call on half the input and does constant work: T(n) = T(n/2) + O(1). Naive Fibonacci makes two calls on slightly smaller inputs: T(n) = T(n − 1) + T(n − 2) + O(1).

## The recursion tree method

Draw the calls as a tree and add up the work at each level. For merge sort, level 0 does n work, level 1 has two calls doing n/2 each, level 2 has four calls doing n/4 each. Every level totals n, and there are log₂ n levels, so the total is O(n log n).

For naive Fibonacci, each call branches into two, and the tree is roughly n levels deep, so the number of calls grows like 2ⁿ. The precise base is about 1.618, the golden ratio, but the conclusion is the same: exponential time. Memoization, covered in the dynamic programming module, reduces it to O(n).

## The master theorem

For recurrences of the form T(n) = aT(n/b) + O(nᵈ), with a calls on inputs of size n/b and nᵈ work outside the calls, compare d with log_b a:

| Condition | Result | Example |
|---|---|---|
| d > log_b a | O(nᵈ) | T(n) = 2T(n/2) + n² gives O(n²) |
| d = log_b a | O(nᵈ log n) | Merge sort: 2T(n/2) + n gives O(n log n) |
| d < log_b a | O(n^(log_b a)) | T(n) = 4T(n/2) + n gives O(n²) |

The intuition: either the work at the top dominates, every level contributes equally, or the leaves dominate.

## Hidden costs

Some lines hide loops. In Java, \`s1 + s2\` on strings copies both, \`list.contains(x)\` on an \`ArrayList\` scans the list, and \`list.remove(0)\` shifts every element. A loop that calls any of these is at least O(n²). Library calls are not free; know the cost of the ones you use.

## How interviewers test this

Expect "What's the complexity of this code?" with nested loops, halving loops or recursion. State the recurrence for recursive code, solve it with the tree or the master theorem, and point out hidden costs such as string concatenation in a loop.`,
    sources: [MIT_6006, CP_ALGO, ODS]
  },

  "space-complexity": {
    theory: `Space complexity measures how much extra memory an algorithm needs as its input grows. It matters because memory is limited, because allocation takes time, and because interviewers often ask for an in-place solution after you find a fast one. This lesson explains what counts toward space, how the call stack adds hidden memory to recursion, how Java lays out objects, and how time and space trade off against each other.

## What counts

Space complexity usually means **auxiliary space**: the extra memory an algorithm uses beyond its input. Reversing an array in place with two pointers uses O(1) auxiliary space. Copying it into a new reversed array uses O(n). When someone asks for the space complexity of your solution, state the auxiliary space, and say so if you also count the input or output.

Variables that hold a fixed number of values, such as a few integers or pointers, are O(1) regardless of n. Data structures that grow with the input, such as a hash map holding every element or a 2D table of size n × m, are O(n) or O(n · m).

## The call stack

Every function call pushes a **stack frame** holding its parameters, local variables and return address. The frame is freed when the call returns. Recursion keeps frames alive for every call still waiting on the stack, so recursive code uses memory proportional to its maximum depth, even when it allocates nothing on the heap.

~~~java
int sum(int[] a, int i) {
    if (i == a.length) return 0;
    return a[i] + sum(a, i + 1);   // n frames deep before any returns
}
~~~

This function uses O(n) space for the stack. An iterative loop computing the same sum uses O(1). Recursive binary search is O(log n) deep, and recursive DFS on a tree is O(h), where h is the tree's height: O(log n) for a balanced tree, but O(n) for a tree shaped like a linked list.

## Stack overflow

The call stack has a fixed size, often about 512 KB to 1 MB per thread in Java by default. Each frame takes tens to hundreds of bytes, so recursion depth of around 10,000 to 100,000 can throw \`StackOverflowError\`. A recursive DFS on a graph with a million nodes in a long chain will crash where an iterative version with an explicit stack won't. Java doesn't perform tail-call optimization, so rewriting recursion in tail form doesn't help; you need a loop.

## Memory layout in Java

Primitive arrays are compact: an \`int[]\` of a million elements takes about 4 MB. Collections of objects are much heavier. An \`ArrayList<Integer>\` stores references to separate \`Integer\` objects, each with a header of about 12 to 16 bytes plus its value and padding. A million boxed integers can take four to five times the memory of an \`int[]\`. A \`HashMap\` entry costs roughly 32 to 48 bytes on top of its key and value.

This matters in practice: prefer primitive arrays for large numeric data, and be aware that a "linear space" hash map has a large constant.

## Strings and copies

Java strings are immutable, so operations such as \`substring\`, \`toCharArray\` and concatenation create new objects. Building a string by concatenating in a loop creates a new string each iteration, costing O(n²) time and lots of garbage. \`StringBuilder\` keeps one growing buffer. Slicing arrays with \`Arrays.copyOfRange\` in recursive calls also adds hidden copies; passing indices instead of copies keeps space low.

## Time-space trade-offs

Many optimizations spend memory to save time:

- **Hash maps**: Two Sum drops from O(n²) time with O(1) space to O(n) time with O(n) space
- **Memoization**: caching subproblem results turns exponential recursion into polynomial time, at the cost of a table
- **Precomputation**: a prefix sum array of size n answers any range sum in O(1)

The reverse also happens. If memory is tight, you can sort an array in place and use two pointers, accepting O(n log n) time for O(1) extra space. Choosing between them depends on the constraints, so state the trade-off explicitly in interviews.

## Reducing space in dynamic programming

Many DP tables only need the previous row or the last few values. Fibonacci needs only the last two numbers, so an O(n) table shrinks to O(1). A 2D table for longest common subsequence can keep two rows, shrinking O(n · m) to O(m). This optimization is a common follow-up question once you've written the full table.

## How interviewers test this

Expect "What's the space complexity?" after every solution, and "Can you do it in O(1) extra space?" as a follow-up. Remember to count the recursion stack, distinguish auxiliary space from input space, and explain any time-space trade-off you made.`,
    sources: [ODS, MIT_6006, JAVA_API]
  },

  "problem-solving-framework": {
    theory: `Coding interviews test how you think as much as whether you reach the answer. A consistent process keeps you from freezing, shows the interviewer your reasoning, and catches bugs before they cost you. This lesson presents a six-step framework, shows how input constraints point to the right complexity, and lists the patterns that cover most interview problems.

## Step 1: understand the problem

Restate the problem in your own words and ask clarifying questions before writing anything. Useful questions include:

- What are the input sizes and value ranges? Can values be negative or zero?
- Can the input be empty? Are there duplicates?
- What should be returned if there's no answer?
- Is the input sorted? Can I modify it?

Then work through one or two small examples by hand, including an edge case. Misunderstanding the problem is the most expensive mistake, because everything after it is wasted.

## Step 2: read the constraints

Input size tells you which complexity the interviewer expects:

| Maximum n | Target complexity | Typical approach |
|---|---|---|
| Up to about 10 | O(n!) or O(2ⁿ · n) | Permutations, brute-force backtracking |
| Up to about 20 | O(2ⁿ) | Subsets, bitmask DP |
| Up to about 500 | O(n³) | Triple loops, interval DP |
| Up to about 5,000 | O(n²) | Pair loops, 2D DP |
| Up to about 10⁶ | O(n log n) or O(n) | Sorting, hashing, two pointers, heaps |
| Larger | O(log n) or O(1) | Binary search, math |

This table assumes about 10⁸ basic operations per second. It's a guide, not a law, but it's often the fastest clue to the intended solution.

## Step 3: start with brute force

State the most direct solution and its complexity, even if it's slow. It proves you understand the problem, gives you a correct baseline, and often reveals the inefficiency to remove. For Two Sum, checking every pair is O(n²); the waste is searching the array again for each element's complement.

## Step 4: optimize

Look for the bottleneck in the brute force and ask which tool removes it:

- Repeated searching for values: a hash set or hash map
- Sorted input, or input you can sort: binary search or two pointers
- A contiguous subarray or substring: sliding window or prefix sums
- The k largest, smallest or most frequent: a heap
- Matching pairs or "next greater" questions: a stack
- Shortest path in an unweighted graph or grid: BFS
- Overlapping subproblems with choices at each step: dynamic programming
- All combinations, subsets or arrangements: backtracking

Explain the idea and its complexity, and get agreement before coding.

## Step 5: write clean code

Write the code in clear pieces with meaningful names. Use helper functions for distinct steps, such as \`isValid(row, col)\` in a grid problem. Talk as you write, explaining what each block does. Handle edge cases where they arise, rather than adding patches at the end.

## Step 6: test

Don't announce you're done straight away. Trace your code on the example by hand, tracking variables line by line. Then test edge cases:

- Empty input, a single element, two elements
- All elements equal, or already sorted, or reverse sorted
- Negative numbers and zero
- Large values that might overflow \`int\`; use \`long\` when sums can exceed about 2.1 billion

Finding and fixing your own bug impresses interviewers more than flawless code they suspect you memorized.

## Communicating while you work

Silence is the most common reason good candidates fail. The interviewer can only credit reasoning they hear. Narrate your thinking, including approaches you reject and why. When stuck, say what you're considering; interviewers often give hints, and using a hint well counts in your favour.

## Recognizing patterns

Most interview problems are variations of about 15 patterns: two pointers, sliding window, prefix sums, binary search, hashing, stacks, heaps, linked-list pointer tricks, tree DFS and BFS, graph BFS and DFS, topological sort, union-find, backtracking and dynamic programming. This course covers each one. When practicing, after solving a problem, name the pattern it used and note the clue that pointed to it. Over time, the clue-to-pattern mapping becomes automatic.

## How interviewers test this

Interviewers grade four areas: problem understanding, algorithm design, coding and communication. Following this framework visibly covers all four. Clarify first, state the brute force, optimize with a named pattern, code cleanly, and test with edge cases before you say you're done.`,
    sources: [TIH, MIT_6006]
  },

  "two-sum-lesson": {
    theory: `Two Sum is the most famous interview problem: given an array and a target, find two elements that add up to the target. It's short, but it teaches the single most useful optimization in interviews: replacing a repeated search with a hash map lookup. This lesson analyzes the brute force, the hash map solution and the two-pointer solution for sorted input, and covers the variations interviewers ask next.

## The problem

Given \`nums = [2, 7, 11, 15]\` and \`target = 9\`, return the indices \`[0, 1]\`, because 2 + 7 = 9. You may assume exactly one solution exists, and you can't use the same element twice. Clarify both assumptions in an interview: what to return when there's no pair, and whether duplicates appear.

## Brute force

Check every pair:

~~~java
for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++)
        if (nums[i] + nums[j] == target) return new int[]{i, j};
~~~

That's n(n − 1)/2 pairs, so O(n²) time and O(1) space. For n = 10⁵, it's about 5 × 10⁹ checks, far too slow.

## Finding the waste

For each element x, the inner loop searches the rest of the array for target − x, its **complement**. That's a lookup problem, and searching an unsorted array costs O(n). A hash map answers "have I seen this value, and where?" in O(1) on average. Replacing the inner loop with a hash map lookup removes a factor of n.

## The hash map solution

Scan once. For each element, check whether its complement has been seen; if not, record the element and its index:

~~~java
Map<Integer, Integer> seen = new HashMap<>();
for (int i = 0; i < nums.length; i++) {
    int need = target - nums[i];
    if (seen.containsKey(need)) return new int[]{seen.get(need), i};
    seen.put(nums[i], i);
}
return new int[0];
~~~

This runs in O(n) time with O(n) space. Checking before inserting matters: it prevents pairing an element with itself, so \`[3, 4]\` with target 6 correctly finds no pair rather than returning \`[0, 0]\`.

## Duplicates

With \`nums = [3, 3]\` and target 6, the first 3 is stored at index 0. When the second 3 arrives, its complement 3 is in the map, so the answer is \`[0, 1]\`. If the map is built fully before the search, a later duplicate overwrites the earlier index, which still works here but is a common source of subtle bugs. The one-pass version avoids the question.

## The two-pointer solution for sorted input

If the array is sorted, you don't need extra memory. Place one pointer at each end:

~~~java
int lo = 0, hi = nums.length - 1;
while (lo < hi) {
    int sum = nums[lo] + nums[hi];
    if (sum == target) return new int[]{lo, hi};
    if (sum < target) lo++; else hi--;
}
~~~

If the sum is too small, the only way to increase it is to move the left pointer right; if it's too large, move the right pointer left. Each step discards one element that can't be part of any answer, so the loop is O(n) time and O(1) space.

If the input isn't sorted, sorting first costs O(n log n) and loses the original indices, unless you sort pairs of value and index. Use the hash map when indices matter, and two pointers when the input is sorted or you need only the values.

## Comparing approaches

| Approach | Time | Extra space | Needs sorted input |
|---|---|---|---|
| Brute force | O(n²) | O(1) | No |
| Hash map | O(n) | O(n) | No |
| Sort then two pointers | O(n log n) | O(1) to O(n) | Sorts it |
| Two pointers on sorted input | O(n) | O(1) | Yes |

## Variations

Interviewers extend Two Sum in predictable ways:

- **Count all pairs**: store counts instead of indices, and add the complement's count at each step
- **Three Sum**: sort, fix one element, and run two pointers on the rest, for O(n²); skip duplicate values to avoid repeated triples
- **Two Sum in a binary search tree**: use an in-order traversal, which produces sorted order, then two pointers, or a hash set during traversal
- **Data stream**: support \`add\` and \`find\`, trading which operation is O(1)

## How interviewers test this

Two Sum often opens an interview. Explain the brute force, identify the repeated search as the waste, and introduce the hash map with its time and space trade-off. Then mention the two-pointer approach for sorted input, which sets up the Three Sum follow-up.`,
    sources: [TIH, THE_ALGORITHMS, JAVA_API]
  },

  "arrays-lesson-2": {
    theory: `An array stores elements of the same type in one contiguous block of memory. That layout is what makes arrays fast: any element can be found with one calculation, and scanning them uses the processor's cache efficiently. This lesson explains how arrays sit in memory, why index access is O(1) but insertion is O(n), how 2D arrays work in Java, and how \`ArrayList\` grows.

## Contiguous memory and O(1) access

When you create \`int[] a = new int[5]\`, Java allocates space for five integers side by side. To find \`a[i]\`, the machine computes:

~~~text
address of a[i] = base address + i × element size
~~~

For an \`int\` array, the element size is 4 bytes, so \`a[3]\` sits 12 bytes after the start. The calculation takes the same time for any index, so access is O(1). This is called **random access**. Zero-based indexing falls out of the formula: the first element is 0 elements away from the base.

## Cache friendliness

Processors load memory in blocks called cache lines, usually 64 bytes. Reading \`a[0]\` also brings \`a[1]\` through \`a[15]\` into the cache, so a sequential scan rarely waits for main memory. Linked structures scatter their nodes around memory, causing far more cache misses. This is why scanning an array is often several times faster than traversing a linked list of the same length, even though both are O(n).

## Insertion and deletion

The contiguous layout has a cost. Inserting at index i requires shifting every element from i onward one place right, and deleting requires shifting them left:

| Operation | Time |
|---|---|
| Read or write \`a[i]\` | O(1) |
| Insert or delete at the end (with spare capacity) | O(1) |
| Insert or delete at the start or middle | O(n) |
| Search an unsorted array | O(n) |
| Search a sorted array (binary search) | O(log n) |

Java arrays also have a fixed size, set at creation. To grow, you must allocate a bigger array and copy.

## Default values and bounds

A new Java array is filled with default values: 0 for numbers, \`false\` for booleans, \`null\` for objects. Every access is bounds-checked, and an invalid index throws \`ArrayIndexOutOfBoundsException\`. Off-by-one errors, such as looping with \`i <= a.length\`, are the most common array bug; the last valid index is \`a.length - 1\`.

## 2D arrays

Java doesn't have true 2D arrays. \`int[][] grid = new int[3][4]\` creates an array of 3 references, each pointing to its own array of 4 integers. Consequences:

- \`grid[r][c]\` takes two lookups: the row reference, then the element
- rows can have different lengths, called a **jagged array**
- iterating row by row is cache friendly; iterating column by column jumps between separate row arrays and runs slower

Grid problems use \`grid.length\` for the number of rows and \`grid[0].length\` for columns. A common pattern for exploring neighbours uses direction arrays:

~~~java
int[][] dirs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
for (int[] d : dirs) {
    int nr = r + d[0], nc = c + d[1];
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) { ... }
}
~~~

## ArrayList and dynamic arrays

\`ArrayList\` is a **dynamic array**: it wraps an internal array and grows it automatically. When the internal array is full and you add an element, it allocates a new array about 1.5 times larger and copies everything across. Copying costs O(n), but it happens rarely enough that the total cost of n additions is O(n), so \`add\` is O(1) amortized.

Growing by a multiple is essential. If the list grew by a fixed 10 slots each time, n additions would trigger n/10 copies of growing size, costing O(n²) in total.

Other \`ArrayList\` costs follow from the array underneath: \`get(i)\` is O(1), while \`add(0, x)\`, \`remove(0)\` and \`contains(x)\` are O(n).

## Primitive arrays versus ArrayList

\`ArrayList\` holds objects, so integers are boxed into \`Integer\` objects. Boxing costs memory and time, and it introduces a trap: comparing two \`Integer\` objects with \`==\` compares references, which happens to work for values from −128 to 127 because of caching, and fails silently for larger ones. Use \`.equals()\`, or unbox to \`int\`. Prefer \`int[]\` when the size is known, and \`ArrayList\` when it must grow.

## Useful library methods

\`Arrays.sort(a)\` sorts primitives with a dual-pivot quick sort and objects with a stable merge-based sort (TimSort). \`Arrays.fill\`, \`Arrays.copyOf\`, \`Arrays.toString\` and \`Arrays.asList\` save time in interviews. Know their costs: all of them except \`asList\` are O(n) or more.

## How interviewers test this

Expect "Why is array access O(1)?", "Array versus linked list?" and "How does ArrayList grow, and what's the amortized cost of add?" Explain the address formula, contrast insertion costs and cache behaviour, and describe geometric growth with amortized O(1).`,
    sources: [ODS, JAVA_API, MIT_6006]
  },

  "arrays-lesson-3": {
    theory: `Searching is the most common operation on data. Linear search works on any array; binary search works only on sorted data, but it's dramatically faster and generalizes into one of the most powerful interview techniques. This lesson explains both searches, the exact loop invariants that make binary search correct, the lower-bound and upper-bound variants, and binary search on the answer.

## Linear search

Linear search checks each element in turn until it finds the target or reaches the end. It's O(n) in the worst case, needs no preparation, and works on unsorted data and linked lists. For a one-off search in a small or unsorted array, it's the right choice: sorting first costs O(n log n), more than the search itself.

## The binary search idea

In a sorted array, comparing the target with the middle element tells you which half can contain it. Each comparison discards half the remaining range, so a million elements need at most 20 comparisons and a billion need about 30. That's O(log n).

~~~java
int lo = 0, hi = a.length - 1;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (a[mid] == target) return mid;
    if (a[mid] < target) lo = mid + 1;
    else hi = mid - 1;
}
return -1;
~~~

## Getting the details right

Binary search is famous for subtle bugs. Three details matter:

- **The midpoint**: \`(lo + hi) / 2\` can overflow when lo and hi are both large. \`lo + (hi - lo) / 2\` gives the same value without overflow. This bug sat in Java's own \`Arrays.binarySearch\` for about nine years before it was fixed in 2006
- **The loop condition**: with an inclusive range \`[lo, hi]\`, the loop runs while \`lo <= hi\`, because a range of one element is still worth checking
- **The updates**: \`lo = mid + 1\` and \`hi = mid - 1\` must exclude mid, or the range might stop shrinking and loop forever

## Loop invariants

The reliable way to write binary search is to state an invariant: a fact true before every iteration. For the version above: "if the target exists, its index is in \`[lo, hi]\`". Each update keeps the invariant true, and the range shrinks every iteration, so when the range becomes empty, the target isn't there. Thinking in invariants turns binary search from memorized code into something you can derive.

## Lower bound and upper bound

Often you need the position of the first element meeting a condition, not an exact match. With duplicates in \`[1, 2, 2, 2, 3]\`, finding "any 2" isn't enough when the question asks for the first or last occurrence.

**Lower bound** finds the first index whose value is ≥ target:

~~~java
int lo = 0, hi = a.length;          // half-open range [lo, hi)
while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (a[mid] < target) lo = mid + 1;
    else hi = mid;
}
return lo;                           // a.length if every value < target
~~~

**Upper bound** finds the first index whose value is > target, by changing \`<\` to \`<=\`. The count of target values is upper bound minus lower bound, and the last occurrence is upper bound minus one. This half-open style, with \`hi = mid\` instead of \`mid - 1\`, matches how C++ and Python implement these functions.

## The general pattern

Lower bound is a special case of a broader idea: binary search finds the boundary in any **monotonic** condition, one that is false for a prefix of the range and true for the rest. You don't need an array at all. Problems that use this idea include:

- the first bad version in a sequence of software builds
- the minimum and maximum in a rotated sorted array
- a peak element, by comparing \`a[mid]\` with \`a[mid + 1]\`
- integer square root: the largest x with x · x ≤ n

## Binary search on the answer

Some optimization problems ask for the minimum value that satisfies a condition, where checking any candidate is straightforward. For example: what's the minimum eating speed that lets someone finish all piles of bananas within h hours? Speeds from 1 to the largest pile form a monotonic condition: slow speeds fail and fast speeds succeed. Binary search over speeds, and for each candidate, check feasibility in O(n). The total is O(n log M), where M is the largest pile.

The clue for this technique is a phrase such as "minimize the maximum" or "find the smallest value such that", combined with a feasibility check that's monotonic.

## Library support

\`Arrays.binarySearch\` and \`Collections.binarySearch\` return the index if found. If not, they return \`-(insertion point) - 1\`, a negative value encoding where the target would go. With duplicates, they return any matching index, not necessarily the first, so write your own lower bound when position matters.

## How interviewers test this

Expect binary search on sorted arrays, first and last occurrence, rotated arrays, and "binary search on the answer" problems. State your invariant and range convention, use the overflow-safe midpoint, and test with one element, two elements and a missing target.`,
    sources: [CP_ALGO, TIH, JAVA_API]
  },

  "arrays-lesson-4": {
    theory: `The two-pointer technique uses two indices that move through an array in a coordinated way, turning many O(n²) pair searches into O(n) scans. It comes in two main forms: pointers that start at opposite ends and move inward, and pointers that move in the same direction at different speeds. This lesson explains both forms, why they're correct, and the classic problems each one solves, including in-place array rotation.

## Opposite-end pointers

Place one pointer at the start and one at the end, and move them toward each other based on a comparison. This works when the array is sorted, or when the problem is symmetric, as with palindromes.

On a sorted array, finding a pair with a target sum works like this: if the current sum is too small, move the left pointer right; if too large, move the right pointer left. The correctness argument is the key interview point. When the sum is too small, the left element can't pair with anything, because the right element is already the largest remaining candidate. So discarding it never loses an answer. Each step discards one element, giving O(n) time.

## Container with most water

Given heights of vertical lines, find two lines that hold the most water: the area is the distance between them times the shorter height. Start with the widest pair. Moving the taller line inward can only reduce the width without raising the limiting height, so always move the shorter line. This greedy step makes an O(n²) search O(n), and it's a favourite follow-up because the justification requires reasoning, not memory.

## Same-direction pointers

In the second form, a **slow** pointer marks where the next kept element goes, and a **fast** pointer scans every element. This rewrites an array in place.

Removing duplicates from a sorted array:

~~~java
int write = 1;
for (int read = 1; read < a.length; read++) {
    if (a[read] != a[write - 1]) {
        a[write] = a[read];
        write++;
    }
}
return write;   // the first 'write' elements are the unique values
~~~

The invariant: \`a[0..write-1]\` holds the unique values seen so far, in order. The same pattern moves all zeros to the end, removes every copy of a value, or keeps at most two copies of each value.

## Partitioning

Partitioning rearranges an array so elements satisfying a condition come first. The Dutch national flag problem sorts an array of 0s, 1s and 2s in one pass with three pointers:

- \`low\`: everything before it is 0
- \`mid\`: the element under examination
- \`high\`: everything after it is 2

When \`a[mid]\` is 0, swap it to \`low\` and advance both. When it's 2, swap it to \`high\` and decrement \`high\`, but don't advance \`mid\`, because the swapped-in element hasn't been checked. When it's 1, advance \`mid\`. Quick sort's partition step uses the same idea with a pivot.

## Rotating an array

Rotating \`[1, 2, 3, 4, 5, 6, 7]\` right by 3 gives \`[5, 6, 7, 1, 2, 3, 4]\`. Shifting one step at a time costs O(n · k). Copying into a new array costs O(n) space. The reversal trick does it in O(n) time and O(1) space:

1. Reverse the whole array: \`[7, 6, 5, 4, 3, 2, 1]\`
2. Reverse the first k elements: \`[5, 6, 7, 4, 3, 2, 1]\`
3. Reverse the rest: \`[5, 6, 7, 1, 2, 3, 4]\`

Reduce k with \`k % n\` first, because rotating by n leaves the array unchanged. Each reversal is itself a two-pointer swap from both ends.

## Three Sum

Three Sum asks for all unique triples that sum to zero. Sort the array, then fix each element in turn and run opposite-end pointers on the elements to its right, looking for a pair that sums to its negative. That's O(n²) overall, better than the O(n³) brute force. Skip repeated values, both for the fixed element and when moving the pointers, so each triple appears once.

## When two pointers apply

Look for these clues:

- the input is sorted, or sorting it doesn't break the problem
- the task involves pairs or triples with a target sum or difference
- the problem asks you to modify an array in place with O(1) extra space
- the problem is symmetric, such as checking a palindrome

Two pointers is the default answer when an interviewer asks you to remove the extra space from a hash-based solution on sorted data.

## How interviewers test this

Expect pair sums on sorted arrays, removing duplicates in place, moving zeros, Three Sum, container with most water and array rotation. For each, state which pointer moves and why moving it can never skip a valid answer. That justification is what separates understanding from memorization.`,
    sources: [TIH, THE_ALGORITHMS, CP_ALGO]
  },

  "arrays-lesson-5": {
    theory: `Sorting puts data in order, and sorted data makes binary search, two pointers and duplicate detection possible. Interviews rarely ask you to implement a sort from scratch, but they do expect you to know how the main algorithms work, their complexities and trade-offs, and what stability means. This lesson covers insertion sort, merge sort and quick sort in depth, the lower bound for comparison sorting, and the linear-time sorts that beat it.

## Insertion sort

Insertion sort builds a sorted prefix one element at a time, like sorting playing cards in your hand. Each new element shifts larger elements in the prefix right until it finds its place.

It's O(n²) in the worst case, on reverse-sorted input, but O(n) on already sorted input, because each element needs one comparison. It sorts in place, is stable, and has tiny constants. That's why production sorts, including Java's, switch to insertion sort for small ranges of roughly 32 to 47 elements.

## Merge sort

Merge sort is divide and conquer: split the array in half, sort each half recursively, and merge the two sorted halves.

~~~java
void mergeSort(int[] a, int lo, int hi, int[] tmp) {
    if (hi - lo < 1) return;
    int mid = lo + (hi - lo) / 2;
    mergeSort(a, lo, mid, tmp);
    mergeSort(a, mid + 1, hi, tmp);
    int i = lo, j = mid + 1, k = lo;
    while (i <= mid && j <= hi) tmp[k++] = (a[i] <= a[j]) ? a[i++] : a[j++];
    while (i <= mid) tmp[k++] = a[i++];
    while (j <= hi) tmp[k++] = a[j++];
    for (k = lo; k <= hi; k++) a[k] = tmp[k];
}
~~~

The recurrence is T(n) = 2T(n/2) + O(n), giving O(n log n) in every case. Merging needs an O(n) buffer. Using \`<=\` in the comparison takes equal elements from the left half first, which keeps the sort **stable**.

Merge sort also suits linked lists, where merging needs no extra array, and external sorting of data too large for memory. A modified merge counts **inversions**, pairs out of order, in O(n log n): whenever an element from the right half is placed before remaining left-half elements, it forms an inversion with each of them.

## Quick sort

Quick sort picks a **pivot**, partitions the array so smaller elements come before it and larger ones after, and recursively sorts both sides. Partitioning happens in place, so quick sort needs only O(log n) stack space on average.

Its performance depends on the pivot. Balanced splits give O(n log n). Consistently bad splits, such as always picking the first element of an already sorted array, give partitions of size n − 1 and 0, and O(n²) time. Defences include picking a random pivot, or the median of the first, middle and last elements.

Despite its worst case, quick sort is often the fastest in practice: it works in place, scans memory sequentially, and has small constants. It isn't stable.

## Stability

A sort is **stable** if equal elements keep their original relative order. Stability matters when sorting by multiple keys: sort a list of students by name, then stably by grade, and students with the same grade stay in name order. Merge sort and insertion sort are stable; quick sort and heap sort aren't.

This explains Java's choices. \`Arrays.sort\` on primitives uses dual-pivot quick sort, because equal integers are indistinguishable and stability doesn't matter. On objects, it uses TimSort, a stable merge-insertion hybrid that runs in O(n) on input with long already-sorted runs.

## Comparing the algorithms

| Algorithm | Best | Average | Worst | Extra space | Stable |
|---|---|---|---|---|---|
| Insertion sort | O(n) | O(n²) | O(n²) | O(1) | Yes |
| Merge sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Quick sort | O(n log n) | O(n log n) | O(n²) | O(log n) | No |
| Heap sort | O(n log n) | O(n log n) | O(n log n) | O(1) | No |

## The comparison lower bound

Any sort that works only by comparing pairs of elements needs Ω(n log n) comparisons in the worst case. The argument: there are n! possible orderings of the input, and each comparison has two outcomes, so a decision tree that distinguishes all orderings needs height at least log₂(n!), which is about n log n. Merge sort and heap sort are therefore optimal among comparison sorts.

## Beating the bound

Sorts that don't compare elements can run in linear time on suitable data:

- **Counting sort**: counts occurrences of each value in a range of size k, then writes them out in order; O(n + k) time. Useful for small integer ranges, such as exam scores from 0 to 100
- **Radix sort**: sorts numbers digit by digit with a stable counting sort; O(d · (n + b)) for d digits in base b
- **Bucket sort**: spreads values that are uniformly distributed into buckets, sorts each, and concatenates

## How interviewers test this

Expect "Merge sort versus quick sort?", "What does stable mean?", "Why is quick sort's worst case O(n²) and how do you avoid it?" and "Can you sort in less than O(n log n)?" Know the comparison table, the pivot problem, the lower bound argument, and when counting sort applies.`,
    sources: [MIT_6006, THE_ALGORITHMS, ODS, JAVA_API]
  },

  "arrays-lesson-6": {
    theory: `Many array problems ask about contiguous subarrays: their sums, their lengths, or their maximum values. Checking every subarray costs O(n²) or worse. Three techniques bring these problems down to O(n): prefix sums answer range queries instantly, sliding windows reuse work as a range moves, and Kadane's algorithm finds the maximum subarray sum in one pass. This lesson explains each technique and how to recognize which one a problem needs.

## Prefix sums

A prefix sum array stores the running total: \`prefix[i]\` is the sum of the first i elements, with \`prefix[0] = 0\`:

~~~java
long[] prefix = new long[n + 1];
for (int i = 0; i < n; i++) prefix[i + 1] = prefix[i] + a[i];
// sum of a[l..r] inclusive = prefix[r + 1] - prefix[l]
~~~

Building it costs O(n), and then any range sum costs O(1). If an application answers thousands of range-sum queries, this reduces O(n · q) work to O(n + q). The extra slot at index 0 removes a special case for ranges that start at the beginning. Use \`long\` when sums might exceed the \`int\` range.

The idea extends to two dimensions. A 2D prefix table answers the sum of any sub-rectangle in O(1) using inclusion and exclusion: add the big rectangle, subtract the two overlapping strips, and add back the corner subtracted twice.

## Difference arrays

The reverse operation also helps. To add a value v to every element in a range \`[l, r]\` many times, record \`diff[l] += v\` and \`diff[r + 1] -= v\`. After all updates, a single prefix sum over \`diff\` produces the final array. Each update costs O(1) instead of O(n). This solves problems such as counting passengers on a car-pooling route or flight bookings across seat ranges.

## Fixed-size sliding window

To find the maximum sum of any k consecutive elements, compute the first window's sum, then slide: add the element entering on the right and subtract the one leaving on the left.

~~~java
long window = 0;
for (int i = 0; i < k; i++) window += a[i];
long best = window;
for (int i = k; i < n; i++) {
    window += a[i] - a[i - k];
    best = Math.max(best, window);
}
~~~

Each step reuses the previous sum instead of recomputing k elements, so the total is O(n) instead of O(n · k).

## Variable-size sliding window

When the window size isn't fixed, two pointers mark its edges. The right pointer expands the window; the left pointer shrinks it when a condition breaks. For example, the shortest subarray with a sum of at least S, with all elements positive:

~~~java
int left = 0, best = Integer.MAX_VALUE;
long sum = 0;
for (int right = 0; right < n; right++) {
    sum += a[right];
    while (sum >= S) {
        best = Math.min(best, right - left + 1);
        sum -= a[left++];
    }
}
~~~

Each element enters and leaves the window once, so the total work is O(n), even with the inner loop. This only works when expanding the window always moves the condition in one direction. With negative numbers, adding an element can lower the sum, the window logic breaks, and you need prefix sums with a hash map instead, covered in the hashing module.

## Kadane's algorithm

The maximum subarray problem asks for the contiguous subarray with the largest sum. In \`[-2, 1, -3, 4, -1, 2, 1, -5, 4]\`, the answer is 6, from \`[4, -1, 2, 1]\`.

Kadane's algorithm tracks the best sum of a subarray ending at the current index. At each element, either extend the previous subarray or start fresh here, whichever is larger:

~~~java
long current = a[0], best = a[0];
for (int i = 1; i < n; i++) {
    current = Math.max(a[i], current + a[i]);
    best = Math.max(best, current);
}
~~~

The reasoning: if the best sum ending at the previous index is negative, it can only drag down anything that extends it, so starting fresh is better. That runs in O(n) time with O(1) space. Initializing with \`a[0]\` rather than 0 handles arrays where every element is negative; the answer then is the largest single element.

Kadane's algorithm is dynamic programming with the table reduced to one variable. A variant tracks both the maximum and minimum product ending at each index to solve the maximum product subarray, because a negative number turns the smallest product into the largest.

## Choosing the technique

| Clue in the problem | Technique |
|---|---|
| Many range-sum queries on a fixed array | Prefix sums |
| Many range updates, then read the result | Difference array |
| Window of exactly k elements | Fixed sliding window |
| Longest or shortest subarray meeting a condition, non-negative values | Variable sliding window |
| Subarray sum equal to k with negative values | Prefix sums with a hash map |
| Largest sum of any subarray | Kadane's algorithm |

## How interviewers test this

Expect maximum subarray (Kadane), range sum queries, maximum sum of k consecutive elements and shortest subarray with a target sum. Explain why each technique avoids recomputation, state the O(n) argument for the sliding window, and know why negative numbers break the variable window.`,
    sources: [CP_ALGO, TIH, THE_ALGORITHMS]
  },

  "strings-in-java": {
    theory: `Strings appear in nearly every interview, and in Java they carry specific behaviour that affects both correctness and performance. Java strings are immutable, compared by reference with \`==\`, and expensive to build by repeated concatenation. This lesson explains immutability and the string pool, how to compare strings correctly, why \`StringBuilder\` matters, and the character arithmetic that powers most string problems.

## Immutability

A Java \`String\` can't be changed after it's created. Methods that seem to modify a string, such as \`toUpperCase\`, \`replace\` or \`substring\`, return a new string and leave the original untouched. Immutability brings real benefits:

- strings can be shared safely between threads without locks
- a string's hash code can be cached, which makes strings fast hash map keys
- strings used as file paths or network addresses can't be changed by other code after a security check

The cost is that every modification allocates a new object.

## The string pool and equality

String literals are stored in a shared **string pool**, so two identical literals refer to the same object. Strings created at runtime, such as from user input or \`new String(...)\`, are separate objects even when their contents match.

That makes \`==\` unreliable: it compares references, not contents. \`"abc" == "abc"\` is true because both literals come from the pool, but comparing a literal with a string read from input returns false even when the text matches. Always compare contents with \`.equals()\`, or \`.equalsIgnoreCase()\` when case doesn't matter. Use \`compareTo\` for alphabetical ordering; it returns a negative number, zero or a positive number.

## Building strings efficiently

Concatenating in a loop is a classic performance bug:

~~~java
String result = "";
for (int i = 0; i < n; i++) result += i;   // copies the whole string every time
~~~

Each \`+=\` creates a new string and copies all existing characters into it, so the total work is 1 + 2 + ... + n, which is O(n²). \`StringBuilder\` keeps one resizable character buffer, growing it geometrically like an \`ArrayList\`:

~~~java
StringBuilder sb = new StringBuilder();
for (int i = 0; i < n; i++) sb.append(i);
String result = sb.toString();
~~~

This is O(n) total. \`StringBuilder\` also offers \`insert\`, \`deleteCharAt\`, \`setCharAt\` and \`reverse\`. The Java compiler optimizes a single expression such as \`a + b + c\`, so use \`StringBuilder\` specifically for loops. \`StringBuffer\` is a synchronized, slower version that you rarely need.

## Characters as numbers

A \`char\` in Java is a 16-bit number, so characters support arithmetic. This drives many string tricks:

- \`c - 'a'\` maps lowercase letters to 0 through 25, a ready-made array index
- \`(char) ('a' + i)\` converts an index back to a letter
- \`c - '0'\` converts a digit character to its integer value
- \`Character.isLetterOrDigit\`, \`isDigit\`, \`isLetter\` and \`toLowerCase\` handle classification

A frequency count for lowercase text uses an \`int[26]\` instead of a hash map, which is faster and uses fixed memory:

~~~java
int[] freq = new int[26];
for (char c : s.toCharArray()) freq[c - 'a']++;
~~~

For general ASCII text, use \`int[128]\`; for arbitrary Unicode, use a \`HashMap<Character, Integer>\`.

## Common operations and their costs

| Operation | Cost |
|---|---|
| \`s.length()\`, \`s.charAt(i)\` | O(1) |
| \`s.substring(i, j)\` | O(j − i); it copies |
| \`s.equals(t)\` | O(n) |
| \`s.indexOf(t)\` | O(n · m) worst case |
| \`s.toCharArray()\` | O(n); it copies |
| \`String.join\`, \`String.valueOf\` | O(total length) |

Since Java 7, \`substring\` copies characters instead of sharing the original array, which avoids memory leaks but means calling it in a loop adds real cost. Prefer passing start and end indices in recursive string algorithms.

## Converting between forms

To modify characters, convert to a \`char[]\`, change it, and build a new string with \`new String(chars)\`. Sorting characters this way is the standard way to compute an anagram signature: \`"listen"\` and \`"silent"\` both become \`"eilnst"\`. Splitting with \`s.split(" ")\` uses regular expressions, so splitting on \`"."\` or \`"|"\` needs escaping, and \`s.trim().split("\\\\s+")\` handles multiple spaces between words.

## Unicode caveats

A \`char\` holds one UTF-16 code unit. Characters outside the Basic Multilingual Plane, such as many emoji, take two \`char\` values, called a surrogate pair. Reversing such a string \`char\` by \`char\` breaks those characters. Interview problems usually assume ASCII; mention the caveat if the input could contain arbitrary text.

## How interviewers test this

Expect "Why are Java strings immutable?", "== versus equals?" and "Why use StringBuilder?" Then apply the tools: frequency arrays with \`c - 'a'\`, building output with \`StringBuilder\`, and being explicit about the O(n) cost of \`substring\` and \`toCharArray\`.`,
    sources: [JAVA_API, TIH]
  },

  "palindromes-and-anagrams": {
    theory: `Palindromes and anagrams are two of the most common string themes in interviews. A palindrome reads the same forwards and backwards; an anagram rearranges the letters of another word. Palindrome problems are solved with two pointers and center expansion, and anagram problems with character counting. This lesson covers checking, cleaning, finding the longest palindromic substring, grouping anagrams and finding anagrams inside a longer string.

## Checking a palindrome

Compare characters from both ends, moving inward:

~~~java
boolean isPalindrome(String s) {
    int i = 0, j = s.length() - 1;
    while (i < j) {
        if (s.charAt(i) != s.charAt(j)) return false;
        i++; j--;
    }
    return true;
}
~~~

This is O(n) time and O(1) space. Reversing the string and comparing also works, but it allocates a copy.

## Valid palindrome with cleanup

A common variant ignores case and non-alphanumeric characters, so \`"A man, a plan, a canal: Panama"\` counts as a palindrome. Skip characters that aren't letters or digits by advancing each pointer past them, and compare with \`Character.toLowerCase\`. Doing this in place keeps O(1) space; building a cleaned copy first is quicker to write but costs O(n).

A second variant asks whether the string can become a palindrome by deleting at most one character. At the first mismatch, try skipping either the left or the right character and check whether the remaining range is a palindrome. That's still O(n), because the second check happens once.

## Longest palindromic substring

Checking every substring and testing each for palindromes costs O(n³). Center expansion is much better. Every palindrome mirrors around its center, which is either a character (odd length, such as \`"aba"\`) or the gap between two characters (even length, such as \`"abba"\`). For each of the 2n − 1 possible centers, expand outward while the characters match:

~~~java
int expand(String s, int left, int right) {
    while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
        left--; right++;
    }
    return right - left - 1;   // length of the palindrome found
}
~~~

Call it with \`(i, i)\` and \`(i, i + 1)\` for each i, and track the longest. That's O(n²) time with O(1) space. Forgetting the even-length centers is the most common bug. A dynamic programming table also gives O(n²) but uses O(n²) memory. Manacher's algorithm solves it in O(n), but interviewers rarely expect it.

Counting all palindromic substrings uses the same expansion: each successful expansion step is one more palindrome.

## Anagrams through counting

Two strings are anagrams if they contain the same characters with the same frequencies. Sorting both and comparing costs O(n log n). Counting is O(n):

~~~java
boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    int[] count = new int[26];
    for (int i = 0; i < s.length(); i++) {
        count[s.charAt(i) - 'a']++;
        count[t.charAt(i) - 'a']--;
    }
    for (int c : count) if (c != 0) return false;
    return true;
}
~~~

The early length check is cheap and catches many mismatches. For Unicode input, replace the array with a hash map.

## Grouping anagrams

Given a list of words, group the anagrams together: \`["eat", "tea", "tan", "ate", "nat", "bat"]\` becomes \`[["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]\`. Give every word a **signature** that all its anagrams share, and use it as a hash map key:

- **Sorted letters**: \`"eat"\` becomes \`"aet"\`. Costs O(k log k) per word of length k
- **Count signature**: the 26 counts joined into a string, such as \`"1#0#0#0#1#..."\`. Costs O(k) per word

The total is O(n · k log k) or O(n · k). Separators in the count signature matter: without them, counts of 1 and 11 could produce the same key.

## Finding anagrams inside a string

To find every position in a string s where an anagram of a pattern p starts, slide a window of length |p| across s and compare character counts. Update the window's counts in O(1) per step by adding the entering character and removing the leaving one. Comparing two 26-element arrays each step costs O(26), so the total is O(26 · n), which is O(n). A refinement tracks how many of the 26 counts currently match, avoiding the full comparison.

The same window powers "does s contain a permutation of p?", which is the same problem returning true at the first match.

## Recognizing the patterns

| Clue | Technique |
|---|---|
| Reads the same both ways | Two pointers from both ends |
| Longest or count of palindromic substrings | Expand around 2n − 1 centers |
| Same letters, different order | Character counts or sorted signature |
| Group words by letters | Hash map keyed by signature |
| Anagram or permutation inside a longer string | Fixed sliding window with counts |

## How interviewers test this

Expect valid palindrome, longest palindromic substring, valid anagram, group anagrams and find all anagrams in a string. Explain why center expansion needs both odd and even centers, why counting beats sorting, and how a sliding window keeps counts updated in O(1) per step.`,
    sources: [TIH, CP_ALGO, THE_ALGORITHMS]
  },

  "sliding-window-on-strings": {
    theory: `The variable sliding window is the go-to technique for "longest" or "shortest" substring problems. Two pointers mark a window that grows on the right and shrinks on the left, and a small data structure tracks what's inside. Each character enters and leaves the window at most once, so problems that look quadratic run in O(n). This lesson explains the template, applies it to the longest substring without repeating characters, and extends it to minimum window substring and k-distinct problems.

## Why brute force fails

The longest substring without repeating characters in \`"abcabcbb"\` is \`"abc"\`, with length 3. Checking every substring and testing it for duplicates costs O(n³), or O(n²) with a set built incrementally. For a string of 10⁵ characters, both are too slow. The waste is that overlapping substrings are examined from scratch.

## The template

A variable window keeps a **valid** state as it moves:

1. Expand: move the right pointer one step and add the new character to the window's state
2. Shrink: while the window is invalid, remove the left character from the state and advance the left pointer
3. Record: the window is now valid, so update the answer

~~~java
int left = 0, best = 0;
for (int right = 0; right < s.length(); right++) {
    // add s.charAt(right) to the window state
    while (/* window is invalid */) {
        // remove s.charAt(left) from the window state
        left++;
    }
    best = Math.max(best, right - left + 1);
}
~~~

The right pointer moves n times and the left pointer moves at most n times in total, so the whole loop is O(n), even though it contains a nested \`while\`. This **amortized** argument is the key point to state in an interview.

## Longest substring without repeating characters

The window is invalid when it contains a duplicate. Track counts in an array:

~~~java
int[] count = new int[128];
int left = 0, best = 0;
for (int right = 0; right < s.length(); right++) {
    char c = s.charAt(right);
    count[c]++;
    while (count[c] > 1) {
        count[s.charAt(left)]--;
        left++;
    }
    best = Math.max(best, right - left + 1);
}
~~~

An optimization stores the last index of each character instead of counts, and jumps the left pointer directly past the previous occurrence: \`left = Math.max(left, lastIndex[c] + 1)\`. The \`Math.max\` matters, because a stale index from before the current window must not move the left pointer backwards.

## Minimum window substring

Given strings s and t, find the shortest substring of s containing every character of t, with multiplicity. For \`s = "ADOBECODEBANC"\` and \`t = "ABC"\`, the answer is \`"BANC"\`.

This flips the template: expand until the window is **valid**, then shrink as far as possible while it stays valid, recording the answer during the shrink. Track two things:

- \`need\`: the required count of each character in t
- \`formed\`: how many distinct characters currently meet their required count

When \`formed\` equals the number of distinct characters in t, the window covers t. Shrink from the left, updating the best answer, until removing a character breaks coverage. The total is O(|s| + |t|).

## At most k distinct characters

For the longest substring with at most k distinct characters, the window is invalid when it holds more than k distinct characters. Track counts in a map or array, plus the number of distinct characters with a nonzero count. When a count drops to zero during shrinking, the distinct count falls by one.

A related trick counts substrings with **exactly** k distinct characters as the count with at most k minus the count with at most k − 1. "Exactly" conditions don't shrink cleanly, but "at most" conditions do.

## Longest repeating character replacement

Given a string and k allowed replacements, find the longest substring you can make of one repeated letter. A window is valid if its length minus the count of its most frequent character is at most k, because those are the characters you'd replace. Expand, and shrink when the condition fails. This problem tests whether you can turn a description into a window validity condition.

## When the template applies

The variable window works when validity is **monotonic**: if a window is invalid, every larger window containing it is also invalid, so shrinking is the only way back to validity. Duplicate characters, distinct counts and coverage of t all behave this way.

Conditions that aren't monotonic break it. A subarray sum equal to k with negative numbers is the standard counterexample: adding an element can fix or break the sum unpredictably. Those problems need prefix sums with a hash map instead.

## How interviewers test this

Expect longest substring without repeating characters, minimum window substring and longest substring with k distinct characters. State the window's validity condition, what state you track, and the amortized O(n) argument. Clarify the character set, because it decides between an array and a hash map.`,
    sources: [TIH, CP_ALGO, THE_ALGORITHMS]
  }
};
