// DSA Modules 1-2: Fundamentals (complexity), Arrays (lessons 2-6; lesson 1 is Two Sum in dsa.ts)
// All Java code is compiled and tested (see the algorithm test suite used to build this course).
import { CourseLesson } from './types';

export const dsaFundamentalsLessons: CourseLesson[] = [
  {
    id: "big-o-notation",
    slug: "big-o-notation",
    title: "Big-O Notation: Measuring How Code Scales",
    description: "What Big-O, Big-Omega and Big-Theta mean, the common growth rates, and how to compare them.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "text",
          title: "Why Not Just Time It?",
          content: "Running time in seconds depends on the machine, the language and the input. Big-O describes how the number of steps grows as the input size n grows, independent of hardware. Interviewers expect you to state it for every solution you write.\n\nBig-O (O): an upper bound on growth; the worst case unless stated otherwise.\nBig-Omega (Ω): a lower bound.\nBig-Theta (Θ): a tight bound (both upper and lower).\nIn interviews, 'complexity' usually means the worst-case Big-O."
        },
        {
          type: "table",
          title: "Common Growth Rates (best to worst)",
          headers: ["Big-O", "Name", "Example", "Steps for n = 1,000,000"],
          rows: [
            ["O(1)", "Constant", "Array access by index, HashMap get", "1"],
            ["O(log n)", "Logarithmic", "Binary search", "~20"],
            ["O(n)", "Linear", "One loop over the array", "1,000,000"],
            ["O(n log n)", "Linearithmic", "Merge sort, Arrays.sort", "~20,000,000"],
            ["O(n²)", "Quadratic", "Two nested loops over the array", "10^12 (too slow)"],
            ["O(2^n)", "Exponential", "All subsets, naive recursive Fibonacci", "Impossible"],
            ["O(n!)", "Factorial", "All permutations", "Impossible"]
          ]
        },
        {
          type: "list",
          title: "Simplification Rules",
          items: [
            "**Drop constants**: O(3n + 5) → O(n). O(n/2) → O(n).",
            "**Keep the dominant term**: O(n² + n log n + n) → O(n²).",
            "**Different inputs get different variables**: looping over arrays a and b is O(a + b) sequentially, or O(a × b) if nested. Not O(n²).",
            "**Rule of thumb for limits**: about 10^8 simple operations per second. With n = 10^5, O(n²) = 10^10 is too slow, but O(n log n) is fine."
          ]
        },
        {
          type: "table",
          title: "Input Size → Acceptable Complexity (competitive programming / OA guide)",
          headers: ["n up to", "Target complexity"],
          rows: [["10-12", "O(n!) or O(2^n · n)"], ["20-25", "O(2^n)"], ["500", "O(n³)"], ["5,000", "O(n²)"], ["10^6", "O(n log n) or O(n)"], ["10^9 and above", "O(log n) or O(1)"]]
        },
        {
          type: "quickCheck",
          question: "Simplify O(5n² + 100n log n + 1000).",
          options: ["O(n log n)", "O(n²)", "O(5n²)", "O(n² log n)"],
          answer: 1,
          explanation: "Drop the constants and the lower-order terms: n² grows fastest."
        },
        {
          type: "takeaways",
          items: [
            "Big-O = growth rate as n grows, worst case by default.",
            "Drop constants and lower-order terms; use separate variables for separate inputs.",
            "Use the input constraints to work out which complexity the problem expects."
          ]
        }
      ]
    }
  },
  {
    id: "analyzing-time-complexity",
    slug: "analyzing-time-complexity",
    title: "Analyzing Loops and Recursion",
    description: "Count the work in nested loops, halving loops and recursive calls, including the Master Theorem.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "code",
          title: "Loop Patterns",
          language: "java",
          code: "// O(n): a single pass\nfor (int i = 0; i < n; i++) sum += a[i];\n\n// O(n^2): nested passes (inner runs n-1, n-2, ... 1 times -> n(n-1)/2)\nfor (int i = 0; i < n; i++)\n    for (int j = i + 1; j < n; j++)\n        if (a[i] + a[j] == target) count++;\n\n// O(log n): the variable doubles (or halves) each step\nfor (int i = 1; i < n; i *= 2) steps++;\n\n// O(n log n): log n outer iterations x n inner work\nfor (int size = 1; size < n; size *= 2)\n    for (int i = 0; i < n; i++) work++;\n\n// O(n), not O(n^2)! Two pointers move forward at most n times in total\nint j = 0;\nfor (int i = 0; i < n; i++)\n    while (j < n && a[j] - a[i] < k) j++;",
          explanation: "Count how many times the innermost statement runs in total, not how many loops there are. The last example has nested loops but is linear, because j never moves backwards."
        },
        {
          type: "text",
          title: "Recursion: Draw the Recursion Tree",
          content: "Total work = (number of calls) × (work per call), summed over the levels of the call tree.\n\nfib(n) = fib(n−1) + fib(n−2): each call branches into 2, and the depth is n, so about 2^n calls → O(2^n).\nBinary search: one call per level, n halves each time → O(log n).\nMerge sort: 2 calls on halves plus O(n) merging per level, with log n levels → O(n log n)."
        },
        {
          type: "table",
          title: "Master Theorem: T(n) = a·T(n/b) + O(n^d)",
          headers: ["Case", "Condition", "Result", "Example"],
          rows: [
            ["1", "d > log_b(a)", "O(n^d)", "T(n) = 2T(n/2) + n² → O(n²)"],
            ["2", "d = log_b(a)", "O(n^d · log n)", "Merge sort: 2T(n/2) + n → O(n log n)"],
            ["3", "d < log_b(a)", "O(n^(log_b a))", "T(n) = 4T(n/2) + n → O(n²)"],
            ["–", "Binary search", "a = 1, b = 2, d = 0 → case 2", "O(log n)"]
          ]
        },
        {
          type: "think",
          question: "What is the complexity of: for (i = n; i > 0; i /= 2) for (j = 0; j < i; j++) work();",
          answerReveal: "The inner loop runs n + n/2 + n/4 + ... times, a geometric series that adds up to less than 2n. So it's O(n), not O(n log n)."
        },
        {
          type: "quickCheck",
          question: "Using the Master Theorem, T(n) = 2T(n/2) + O(1) is:",
          options: ["O(log n)", "O(n)", "O(n log n)", "O(1)"],
          answer: 1,
          explanation: "a = 2, b = 2, d = 0. log_2(2) = 1 > 0, so case 3: O(n^1) = O(n). An example is a recursive tree traversal."
        },
        {
          type: "takeaways",
          items: [
            "Count the total executions of the innermost statement; pointers that only move forward are linear in total.",
            "Halving or doubling loops → log n. Recursion → draw the tree or use the Master Theorem.",
            "Naive branching recursion is exponential; memoization makes it polynomial."
          ]
        }
      ]
    }
  },
  {
    id: "space-complexity",
    slug: "space-complexity",
    title: "Space Complexity and the Call Stack",
    description: "Auxiliary vs total space, recursion depth, and in-place algorithms.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "text",
          title: "What Counts",
          content: "Space complexity measures the extra memory an algorithm uses as n grows. Interviewers usually mean auxiliary space: memory beyond the input itself.\n\nCounts: new arrays, collections (HashMap, lists), and recursion depth. Every active recursive call holds a stack frame, so a recursion that goes n levels deep uses O(n) space even if it allocates nothing."
        },
        {
          type: "table",
          title: "Examples",
          headers: ["Code", "Time", "Auxiliary space"],
          rows: [
            ["Sum an array with a loop", "O(n)", "O(1)"],
            ["Reverse an array in place with two pointers", "O(n)", "O(1)"],
            ["Copy the array into a HashSet", "O(n)", "O(n)"],
            ["Recursive sum: sum(a, i) = a[i] + sum(a, i+1)", "O(n)", "O(n) call stack"],
            ["Binary search (iterative / recursive)", "O(log n)", "O(1) / O(log n)"],
            ["Merge sort", "O(n log n)", "O(n) temporary arrays"],
            ["Quick sort (average)", "O(n log n)", "O(log n) recursion stack"]
          ]
        },
        {
          type: "warning",
          title: "Common Mistakes",
          items: [
            "Saying recursive solutions use O(1) space. The call stack counts.",
            "Very deep recursion (e.g. 10^5 levels) in Java can throw StackOverflowError. Convert it to iteration or use an explicit stack.",
            "Forgetting that `s.substring()` and string concatenation in a loop create new strings, using hidden time and space."
          ]
        },
        {
          type: "quickCheck",
          question: "A recursive DFS on a linked-list-shaped tree with n nodes uses how much stack space?",
          options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
          answer: 2,
          explanation: "The recursion depth equals the tree's height, which is n for a degenerate (list-like) tree."
        },
        {
          type: "takeaways",
          items: ["Auxiliary space = extra memory beyond the input.", "Recursion depth counts as space.", "There is often a trade-off: use more space (a hash map) to save time."]
        }
      ]
    }
  },
  {
    id: "problem-solving-framework",
    slug: "problem-solving-framework",
    title: "How to Approach Any DSA Problem in an Interview",
    description: "A repeatable 6-step method plus a pattern-recognition cheat sheet.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "list",
          title: "The 6-Step Method",
          items: [
            "**1. Clarify**: input size, value ranges, duplicates, negatives, empty input, the expected output format. Ask before coding.",
            "**2. Work through examples**: walk through a small example by hand, plus one edge case.",
            "**3. Brute force first**: state the simplest correct idea and its complexity. It proves you understand the problem.",
            "**4. Optimize**: find the bottleneck (usually a repeated search) and remove it with the right pattern or data structure.",
            "**5. Code it cleanly**: meaningful names, small helper functions, handle the edge cases.",
            "**6. Test and analyze**: dry-run your code on the example, check the edge cases, and state the time and space complexity."
          ]
        },
        {
          type: "table",
          title: "Pattern Recognition Cheat Sheet",
          headers: ["If the problem mentions ...", "Try ..."],
          rows: [
            ["Sorted array, 'find target / first position'", "Binary search"],
            ["Pairs or triplets with a target sum in a sorted array", "Two pointers"],
            ["Longest / shortest subarray or substring meeting a condition", "Sliding window"],
            ["Subarray sum equals k, range sums", "Prefix sums + hash map"],
            ["'Have we seen this before?', counting, grouping", "HashMap / HashSet"],
            ["Next greater / smaller element, matching brackets", "Stack (monotonic stack)"],
            ["Top k, kth largest, streaming median", "Heap / PriorityQueue"],
            ["Linked list middle, cycle detection", "Fast and slow pointers"],
            ["Tree problems", "Recursion (DFS) or BFS by level"],
            ["Shortest path in an unweighted graph or grid", "BFS"],
            ["Dependencies and ordering", "Topological sort"],
            ["All combinations / permutations / subsets", "Backtracking"],
            ["Count ways, min/max cost, overlapping subproblems", "Dynamic programming"]
          ]
        },
        {
          type: "callout",
          title: "Think Out Loud",
          content: "Interviewers grade your process, not just the final code. Narrate your reasoning ('a hash map would turn this O(n) lookup into O(1)'), state the trade-offs, and say so when you're unsure. A partially optimized but well-explained solution often beats silent perfect code."
        },
        {
          type: "quickCheck",
          question: "'Find the length of the longest substring with at most 2 distinct characters' most likely needs:",
          options: ["Binary search", "Sliding window", "Topological sort", "Heap"],
          answer: 1,
          explanation: "'Longest substring satisfying a condition' is the signature of the sliding-window pattern."
        },
        {
          type: "takeaways",
          items: ["Clarify, work through examples, brute force, optimize, code, test.", "Learn to map problem phrases to patterns; that's most of the job."]
        }
      ]
    }
  }
];

export const arrayLessons: CourseLesson[] = [
  {
    id: "arrays-lesson-2",
    slug: "arrays-lesson-2",
    title: "Arrays in Memory, 2D Arrays and ArrayList",
    description: "Why index access is O(1), what insertions cost, 2D traversal, and arrays vs ArrayList in Java.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "text",
          title: "How Arrays Work",
          content: "An array stores elements of one type in contiguous memory. The address of element i is base + i × elementSize, so reading or writing any index takes O(1) time.\n\nThe catch: the size is fixed at creation. Inserting or deleting in the middle means shifting every later element, which costs O(n)."
        },
        {
          type: "table",
          title: "Operation Costs",
          headers: ["Operation", "Array", "ArrayList"],
          rows: [
            ["Access a[i]", "O(1)", "O(1) (get)"],
            ["Search an unsorted array", "O(n)", "O(n)"],
            ["Insert or delete at the end", "N/A (fixed size)", "O(1) amortized (add) / O(1)"],
            ["Insert or delete in the middle", "O(n) shifting", "O(n) shifting"],
            ["Memory", "Primitives stored directly", "Stores objects (boxed Integer), more memory"]
          ]
        },
        {
          type: "code",
          title: "1D, 2D and ArrayList in Java",
          language: "java",
          code: "int[] nums = {5, 3, 8};            // fixed size 3\nint[] zeros = new int[4];          // [0, 0, 0, 0]\n\nint[][] grid = new int[3][4];      // 3 rows, 4 columns\nfor (int r = 0; r < grid.length; r++)\n    for (int c = 0; c < grid[0].length; c++)\n        grid[r][c] = r * 4 + c;    // row-major traversal (cache-friendly)\n\nList<Integer> list = new ArrayList<>();\nlist.add(10); list.add(20);        // grows automatically\nlist.add(1, 15);                   // [10, 15, 20] - shifts elements right\nint first = list.get(0);           // 10\n\nSystem.out.println(Arrays.toString(nums));   // [5, 3, 8]",
          explanation: "When full, ArrayList allocates an internal array about 1.5× larger and copies everything over. Copying is O(n) but rare, so add() is O(1) amortized."
        },
        {
          type: "warning",
          title: "Common Mistakes",
          items: [
            "Off-by-one errors: the valid indices are 0 to length − 1; `i <= arr.length` throws ArrayIndexOutOfBoundsException.",
            "Printing an array with `System.out.println(arr)` prints a memory reference. Use `Arrays.toString(arr)` (or `Arrays.deepToString` for 2D).",
            "`list.remove(1)` removes index 1, but `list.remove(Integer.valueOf(1))` removes the value 1. A classic ArrayList trap.",
            "Comparing arrays with `==` checks references. Use `Arrays.equals(a, b)`."
          ]
        },
        {
          type: "quickCheck",
          question: "Why is accessing arr[5000] as fast as arr[0]?",
          options: ["Arrays are cached", "The address is computed directly: base + index × size", "Java pre-sorts arrays", "It isn't; it's O(n)"],
          answer: 1,
          explanation: "Contiguous storage lets the CPU compute any element's address with one multiplication and one addition."
        },
        {
          type: "takeaways",
          items: ["Arrays: O(1) access, O(n) middle insert/delete, fixed size.", "ArrayList: dynamic size, amortized O(1) append.", "Use Arrays.toString / Arrays.equals, not println / ==."]
        }
      ]
    }
  },
  {
    id: "arrays-lesson-3",
    slug: "arrays-lesson-3",
    title: "Linear Search and Binary Search",
    description: "Search unsorted and sorted arrays, write an overflow-safe binary search, and find boundaries with lower bound.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "text",
          title: "Linear vs Binary Search",
          content: "Linear search checks every element: O(n), and it works on any array.\nBinary search needs a sorted array. It compares with the middle element and throws away half the range each time: O(log n). A billion sorted elements need only about 30 comparisons."
        },
        {
          type: "code",
          title: "Binary Search (iterative)",
          language: "java",
          code: "static int binarySearch(int[] nums, int target) {\n    int lo = 0, hi = nums.length - 1;\n    while (lo <= hi) {\n        int mid = lo + (hi - lo) / 2;          // avoids int overflow of (lo + hi)\n        if (nums[mid] == target) return mid;\n        if (nums[mid] < target) lo = mid + 1;\n        else hi = mid - 1;\n    }\n    return -1;\n}\n// binarySearch({1, 3, 5, 7, 9, 11}, 7) -> 3\n// binarySearch({1, 3, 5, 7, 9, 11}, 4) -> -1",
          explanation: "The loop condition lo <= hi and the updates mid ± 1 go together. Mixing styles (lo < hi with hi = mid − 1) causes missed elements or infinite loops."
        },
        {
          type: "dryRun",
          title: "Searching 7 in [1, 3, 5, 7, 9, 11]",
          iterations: [
            { step: 1, variables: { lo: "0", hi: "5", mid: "2", "nums[mid]": "5" }, description: "5 < 7, so search the right half: lo = 3." },
            { step: 2, variables: { lo: "3", hi: "5", mid: "4", "nums[mid]": "9" }, description: "9 > 7, so search the left half: hi = 3." },
            { step: 3, variables: { lo: "3", hi: "3", mid: "3", "nums[mid]": "7" }, description: "Found at index 3." }
          ]
        },
        {
          type: "code",
          title: "Lower Bound: First Index With nums[i] >= target",
          language: "java",
          code: "static int lowerBound(int[] nums, int target) {\n    int lo = 0, hi = nums.length;               // hi = length: the answer may be 'past the end'\n    while (lo < hi) {\n        int mid = lo + (hi - lo) / 2;\n        if (nums[mid] < target) lo = mid + 1; else hi = mid;\n    }\n    return lo;\n}\n// lowerBound({1, 2, 2, 2, 5}, 2) -> 1   (first occurrence of 2)\n// lowerBound({1, 2, 4}, 3)       -> 2   (where 3 would be inserted)",
          explanation: "This 'boundary' template solves first/last occurrence, insert position, and 'minimum value that satisfies a condition' problems (binary search on the answer)."
        },
        {
          type: "warning",
          title: "Common Mistakes",
          items: [
            "`(lo + hi) / 2` can overflow when lo and hi are near Integer.MAX_VALUE. Use `lo + (hi - lo) / 2`.",
            "Running binary search on unsorted data gives wrong answers silently.",
            "Returning `mid` from a boundary search instead of `lo`."
          ]
        },
        {
          type: "practice",
          title: "Practice Problems",
          problems: [
            { id: "704", title: "Binary Search", difficulty: "Easy" },
            { id: "33", title: "Search in Rotated Sorted Array", difficulty: "Medium" },
            { id: "4", title: "Median of Two Sorted Arrays", difficulty: "Hard" }
          ]
        },
        {
          type: "quickCheck",
          question: "What is the maximum number of comparisons binary search needs for 1,000 sorted elements?",
          options: ["1000", "500", "10", "100"],
          answer: 2,
          explanation: "⌈log₂(1000)⌉ = 10, since 2^10 = 1024 ≥ 1000."
        },
        {
          type: "takeaways",
          items: [
            "Binary search: sorted input, O(log n), mid = lo + (hi − lo) / 2.",
            "Learn two templates: exact match (lo <= hi) and boundary/lower bound (lo < hi, hi = mid).",
            "'Minimize the maximum' or 'smallest x such that ...' → binary search on the answer."
          ]
        }
      ]
    }
  },
  {
    id: "arrays-lesson-4",
    slug: "arrays-lesson-4",
    title: "Two Pointers: Pair Sums, Removing Duplicates, Rotating",
    description: "Solve sorted-array and in-place problems in O(n) time and O(1) space with two indices.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "text",
          title: "The Pattern",
          content: "Use two indices instead of nested loops.\nOpposite ends (l = 0, r = n − 1) moving inwards: pair sums in a sorted array, palindromes, reversing.\nSame direction (a read pointer and a write pointer): in-place filtering and de-duplication.\nEach pointer moves at most n times, so the total is O(n), down from O(n²)."
        },
        {
          type: "code",
          title: "Pair With Target Sum in a Sorted Array",
          language: "java",
          code: "static int[] twoSumSorted(int[] nums, int target) {\n    int l = 0, r = nums.length - 1;\n    while (l < r) {\n        int sum = nums[l] + nums[r];\n        if (sum == target) return new int[]{l, r};\n        if (sum < target) l++;      // need a bigger sum\n        else r--;                   // need a smaller sum\n    }\n    return new int[]{-1, -1};\n}\n// twoSumSorted({2, 7, 11, 15}, 9) -> [0, 1]",
          explanation: "Because the array is sorted, moving l right always increases the sum and moving r left always decreases it, so no pair is ever skipped."
        },
        {
          type: "code",
          title: "Remove Duplicates From a Sorted Array (in place)",
          language: "java",
          code: "static int removeDuplicates(int[] nums) {\n    if (nums.length == 0) return 0;\n    int write = 1;\n    for (int read = 1; read < nums.length; read++)\n        if (nums[read] != nums[write - 1]) nums[write++] = nums[read];\n    return write;               // new length\n}\n// {1, 1, 2, 3, 3, 3, 4} -> returns 4, array starts with [1, 2, 3, 4]",
          explanation: "The read pointer scans every element; the write pointer marks where the next unique value goes."
        },
        {
          type: "code",
          title: "Rotate Right by k Using Three Reversals",
          language: "java",
          code: "static void reverse(int[] a, int i, int j) {\n    while (i < j) { int t = a[i]; a[i++] = a[j]; a[j--] = t; }\n}\nstatic void rotateRight(int[] nums, int k) {\n    int n = nums.length; k %= n;            // k may exceed n\n    reverse(nums, 0, n - 1);                // [7 6 5 4 3 2 1]\n    reverse(nums, 0, k - 1);                // [5 6 7 | 4 3 2 1]\n    reverse(nums, k, n - 1);                // [5 6 7 1 2 3 4]\n}",
          explanation: "O(n) time and O(1) space. `k %= n` handles k larger than the array length."
        },
        {
          type: "practice",
          title: "Practice Problems",
          problems: [
            { id: "26", title: "Remove Duplicates from Sorted Array", difficulty: "Easy" },
            { id: "15", title: "3Sum", difficulty: "Medium" }
          ]
        },
        {
          type: "quickCheck",
          question: "3Sum (find all triplets summing to 0) using sort + two pointers runs in:",
          options: ["O(n)", "O(n log n)", "O(n²)", "O(n³)"],
          answer: 2,
          explanation: "Sorting costs O(n log n), then for each element there's an O(n) two-pointer scan: O(n²) total, down from O(n³)."
        },
        {
          type: "takeaways",
          items: ["Opposite-end pointers for sorted pair problems; read/write pointers for in-place filtering.", "Two pointers turn many O(n²) scans into O(n)."]
        }
      ]
    }
  },
  {
    id: "arrays-lesson-5",
    slug: "arrays-lesson-5",
    title: "Sorting Algorithms: Insertion, Merge and Quick Sort",
    description: "How the key sorting algorithms work, their complexity and stability, and what Java's Arrays.sort uses.",
    estimatedMinutes: 30,
    content: {
      sections: [
        {
          type: "table",
          title: "Sorting Algorithms Compared",
          headers: ["Algorithm", "Best", "Average", "Worst", "Space", "Stable"],
          rows: [
            ["Bubble sort", "O(n)", "O(n²)", "O(n²)", "O(1)", "Yes"],
            ["Selection sort", "O(n²)", "O(n²)", "O(n²)", "O(1)", "No"],
            ["Insertion sort", "O(n)", "O(n²)", "O(n²)", "O(1)", "Yes"],
            ["Merge sort", "O(n log n)", "O(n log n)", "O(n log n)", "O(n)", "Yes"],
            ["Quick sort", "O(n log n)", "O(n log n)", "O(n²)", "O(log n)", "No"],
            ["Heap sort", "O(n log n)", "O(n log n)", "O(n log n)", "O(1)", "No"],
            ["Counting sort", "O(n + k)", "O(n + k)", "O(n + k)", "O(k)", "Yes"]
          ]
        },
        {
          type: "code",
          title: "Insertion Sort (great for small or nearly sorted data)",
          language: "java",
          code: "static void insertionSort(int[] a) {\n    for (int i = 1; i < a.length; i++) {\n        int key = a[i], j = i - 1;\n        while (j >= 0 && a[j] > key) { a[j + 1] = a[j]; j--; }   // shift bigger ones right\n        a[j + 1] = key;\n    }\n}",
          explanation: "Like sorting playing cards in your hand. On nearly sorted input the inner loop barely runs, giving O(n)."
        },
        {
          type: "code",
          title: "Merge Sort (divide and conquer, stable)",
          language: "java",
          code: "static void mergeSort(int[] a, int lo, int hi) {\n    if (lo >= hi) return;\n    int mid = lo + (hi - lo) / 2;\n    mergeSort(a, lo, mid);\n    mergeSort(a, mid + 1, hi);\n    int[] tmp = new int[hi - lo + 1];\n    int i = lo, j = mid + 1, k = 0;\n    while (i <= mid && j <= hi) tmp[k++] = (a[i] <= a[j]) ? a[i++] : a[j++];  // <= keeps it stable\n    while (i <= mid) tmp[k++] = a[i++];\n    while (j <= hi) tmp[k++] = a[j++];\n    System.arraycopy(tmp, 0, a, lo, tmp.length);\n}\n// {38, 27, 43, 3, 9, 82, 10} -> {3, 9, 10, 27, 38, 43, 82}",
          explanation: "Split until single elements remain, then merge sorted halves. Guaranteed O(n log n), at the cost of O(n) extra space."
        },
        {
          type: "code",
          title: "Quick Sort (Lomuto partition)",
          language: "java",
          code: "static void quickSort(int[] a, int lo, int hi) {\n    if (lo >= hi) return;\n    int pivot = a[hi], p = lo;\n    for (int i = lo; i < hi; i++)\n        if (a[i] < pivot) { int t = a[i]; a[i] = a[p]; a[p] = t; p++; }   // smaller -> left side\n    int t = a[p]; a[p] = a[hi]; a[hi] = t;                                 // pivot to its final spot\n    quickSort(a, lo, p - 1);\n    quickSort(a, p + 1, hi);\n}\n// {10, 7, 8, 9, 1, 5} -> {1, 5, 7, 8, 9, 10}",
          explanation: "After partitioning, the pivot is in its final position. A last-element pivot gives O(n²) on already sorted input, so real implementations use a random pivot or median-of-three."
        },
        {
          type: "text",
          title: "What Java Actually Uses",
          content: "Arrays.sort(int[]) for primitives uses dual-pivot quicksort: fast, but not stable, which doesn't matter for primitives.\nArrays.sort(Object[]) and Collections.sort use TimSort (a merge/insertion hybrid): stable, and O(n) on already sorted data.\nStability matters when sorting objects by one key while preserving an earlier order, e.g. sort students by marks while keeping alphabetical order within equal marks."
        },
        {
          type: "quickCheck",
          question: "Which sort guarantees O(n log n) in the worst case AND is stable?",
          options: ["Quick sort", "Heap sort", "Merge sort", "Selection sort"],
          answer: 2,
          explanation: "Heap sort is O(n log n) but unstable; quick sort can degrade to O(n²); merge sort is both guaranteed and stable."
        },
        {
          type: "takeaways",
          items: [
            "Merge sort: O(n log n) always, stable, O(n) space.",
            "Quick sort: fastest in practice, O(n²) worst case, use a random pivot.",
            "Insertion sort shines on small or nearly sorted arrays (TimSort uses it internally)."
          ]
        }
      ]
    }
  },
  {
    id: "arrays-lesson-6",
    slug: "arrays-lesson-6",
    title: "Prefix Sums, Sliding Window and Kadane's Algorithm",
    description: "Answer range-sum queries in O(1), scan fixed-size windows in O(n), and find the maximum subarray.",
    estimatedMinutes: 30,
    content: {
      sections: [
        {
          type: "code",
          title: "Prefix Sums: Any Range Sum in O(1)",
          language: "java",
          code: "static int[] prefixSums(int[] a) {\n    int[] p = new int[a.length + 1];\n    for (int i = 0; i < a.length; i++) p[i + 1] = p[i] + a[i];\n    return p;                       // sum(l..r) = p[r + 1] - p[l]\n}\n// a = {3, 1, 4, 1, 5, 9}  ->  p = {0, 3, 4, 8, 9, 14, 23}\n// sum(2..4) = p[5] - p[2] = 14 - 4 = 10   (4 + 1 + 5)",
          explanation: "O(n) preprocessing, then every range query is O(1). The extra leading 0 removes the special case for l = 0."
        },
        {
          type: "code",
          title: "Fixed-Size Sliding Window: Max Sum of k Consecutive Elements",
          language: "java",
          code: "static int maxSumWindow(int[] a, int k) {\n    int sum = 0;\n    for (int i = 0; i < k; i++) sum += a[i];          // first window\n    int best = sum;\n    for (int i = k; i < a.length; i++) {\n        sum += a[i] - a[i - k];                         // add the new element, drop the old one\n        best = Math.max(best, sum);\n    }\n    return best;\n}\n// maxSumWindow({2, 1, 5, 1, 3, 2}, 3) -> 9   (5 + 1 + 3)",
          explanation: "Instead of re-adding k elements for each window (O(n·k)), update the sum in O(1) as the window slides: O(n) total."
        },
        {
          type: "code",
          title: "Kadane's Algorithm: Maximum Subarray Sum",
          language: "java",
          code: "static int maxSubArray(int[] nums) {\n    int best = nums[0], cur = nums[0];\n    for (int i = 1; i < nums.length; i++) {\n        cur = Math.max(nums[i], cur + nums[i]);   // extend the run, or start fresh here\n        best = Math.max(best, cur);\n    }\n    return best;\n}\n// {-2, 1, -3, 4, -1, 2, 1, -5, 4} -> 6   (subarray [4, -1, 2, 1])",
          explanation: "If the running sum becomes worse than starting over at the current element, drop the past. Starting best at nums[0] handles all-negative arrays."
        },
        {
          type: "dryRun",
          title: "Kadane on {-2, 1, -3, 4, -1, 2, 1}",
          iterations: [
            { step: "-2", variables: { cur: "-2", best: "-2" }, description: "Start." },
            { step: "1", variables: { cur: "max(1, -1) = 1", best: "1" }, description: "Start fresh at 1." },
            { step: "-3", variables: { cur: "max(-3, -2) = -2", best: "1" }, description: "" },
            { step: "4", variables: { cur: "max(4, 2) = 4", best: "4" }, description: "Start fresh at 4." },
            { step: "-1, 2, 1", variables: { cur: "3 → 5 → 6", best: "6" }, description: "Keep extending: 4 − 1 + 2 + 1 = 6." }
          ]
        },
        {
          type: "practice",
          title: "Practice Problems",
          problems: [
            { id: "53", title: "Maximum Subarray", difficulty: "Medium" },
            { id: "121", title: "Best Time to Buy and Sell Stock", difficulty: "Easy" }
          ]
        },
        {
          type: "quickCheck",
          question: "What does Kadane's algorithm return for {-3, -1, -2}?",
          options: ["0", "-1", "-6", "-3"],
          answer: 1,
          explanation: "The best non-empty subarray is just [-1]. Initializing best to 0 would wrongly return 0, which is a common bug."
        },
        {
          type: "takeaways",
          items: [
            "Prefix sums: O(1) range sums after O(n) setup.",
            "Sliding window: update incrementally instead of recomputing each window.",
            "Kadane: cur = max(x, cur + x); best = max(best, cur)."
          ]
        }
      ]
    }
  }
];
