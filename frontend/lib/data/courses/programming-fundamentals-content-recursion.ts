// Module 10 - Recursion & Problem Solving (6 lessons)
import { CourseLessonContent } from './types';

export const recursionLessons: Array<{
  slug: string;
  title: string;
  content: CourseLessonContent
}> = [
  {
    slug: "problem-solving-approach",
    title: "Problem-Solving Approach",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand basic programming constructs: variables, control flow, loops, methods, arrays, and strings."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of algorithmic problem solving as **Architectural Drafting & Forensic Engineering**:\n• **Beginner Mistake**: Immediately typing code the instant they finish reading the problem prompt, leading to messy patches, spaghetti logic, and failed edge cases.\n• **Senior Engineer Approach**: 80% of the time is spent analyzing constraints, drawing dry-run diagrams on paper, evaluating time/space trade-offs, and verifying edge cases before typing a single line of Java code."
        },
        {
          type: "callout",
          title: "The 6-Stage Problem-Solving Lifecycle",
          content: "1. **Understand & Clarify**: Identify input types, output requirements, value ranges, and explicit constraints.\n2. **Hand-Simulate Examples**: Walk through 2 standard cases, 1 minimal case, and 1 extreme/negative edge case.\n3. **Formulate Strategy & Pseudocode**: Choose data structures (Array vs HashMap vs Two-Pointer) and state invariants.\n4. **Implement Clean Code**: Write modular code using descriptive identifiers, guard clauses, and helper functions.\n5. **Dry-Run Trace**: Walk through the code on paper with sample inputs before compiling or submitting.\n6. **Analyze & Optimize**: Calculate Big-O time and space complexity and eliminate redundant operations."
        },
        {
          type: "code",
          title: "Case Study: Prime Number Verification ($O(N)$ vs $O(\\sqrt{N})$ Optimization)",
          code: "public class ProblemSolvingCaseStudy {\n    // === STAGE 1: Brute Force Approach (O(N) time) ===\n    public static boolean isPrimeBruteForce(int n) {\n        if (n < 2) return false;\n        for (int i = 2; i < n; i++) {\n            if (n % i == 0) return false; // Found factor\n        }\n        return true;\n    }\n\n    // === STAGE 2: Optimized Approach (O(sqrt(N)) time) ===\n    // Mathematical Invariant: If n = a * b, at least one factor <= sqrt(n)\n    public static boolean isPrimeOptimized(int n) {\n        if (n < 2) return false;\n        if (n == 2 || n == 3) return true;\n        if (n % 2 == 0 || n % 3 == 0) return false; // Filter evens & multiples of 3\n\n        // Test divisors up to sqrt(n) stepping by 6 (6k +/- 1)\n        for (int i = 5; i * i <= n; i += 6) {\n            if (n % i == 0 || n % (i + 2) == 0) {\n                return false;\n            }\n        }\n        return true;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(\"isPrime(29): \" + isPrimeOptimized(29));   // true\n        System.out.println(\"isPrime(100): \" + isPrimeOptimized(100)); // false\n        System.out.println(\"isPrime(1): \" + isPrimeOptimized(1));     // false (Edge case!)\n    }\n}",
          language: "java",
          explanation: "Iterating up to sqrt(n) (checked via i * i <= n to avoid floating-point Math.sqrt overhead) reduces computations for n=1,000,000 from 1,000,000 steps to just 1,000 steps."
        },
        {
          type: "table",
          title: "The Problem Solver's Edge Case Checklist",
          headers: ["Category", "Representative Test Values", "Why It Breaks Naive Code"],
          rows: [
            ["Zero & Negative", "`0`, `-1`, `-999`", "Division by zero, negative array indexing, invalid loops."],
            ["Boundary Limits", "`1`, `Integer.MAX_VALUE`, `Integer.MIN_VALUE`", "Integer overflow during addition/multiplication, off-by-one errors."],
            ["Empty & Null", "`\"\"`, `null`, `new int[0]`", "Throws `NullPointerException` or `ArrayIndexOutOfBoundsException`."],
            ["Single Element", "`[42]`, `\"a\"`", "Two-pointer algorithms crashing when `left == right` immediately."],
            ["Duplicates / All Identical", "`[5, 5, 5, 5]`", "Infinite loops in partition algorithms (e.g. QuickSelect/QuickSort)."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Find the Second Largest Element Safely",
          code: "class SecondLargest {\n    public static int findSecond(int[] arr) {\n        if (arr == null || arr.length < 2) return -1;\n        int largest = Integer.MIN_VALUE;\n        int second = Integer.MIN_VALUE;\n        for (int num : arr) {\n            if (num > largest) {\n                second = largest;\n                largest = num;\n            } else if (num > second && num != largest) {\n                second = num;\n            }\n        }\n        return (second == Integer.MIN_VALUE) ? -1 : second;\n    }\n    public static void main(String[] args) {\n        System.out.println(findSecond(new int[] { 10, 20, 4, 45, 99, 99 })); // 45\n    }\n}",
          expectedOutput: "45",
          explanation: "Single pass O(N) solution that correctly handles duplicate maximum values and arrays with fewer than 2 distinct elements."
        },
        {
          type: "dryRun",
          title: "Optimization Trace: $N = 100$ Divisor Checks",
          iterations: [
            { step: 1, variables: { "Brute Force": "Checks 2, 3, 4, 5, ..., 99 (98 iterations)" }, description: "Examines every integer up to N-1." },
            { step: 2, variables: { "Optimized sqrt(N)": "Checks i=2, 3, ..., 10 (9 iterations max)" }, description: "Stops as soon as i*i > 100. Discovers factor 2 immediately." },
            { step: 3, variables: { "Performance Gain": "~10x speedup on small inputs, 1,000x on large inputs" }, description: "Massive complexity reduction from O(N) to O(sqrt(N))." }
          ]
        },
        {
          type: "warning",
          title: "Common Problem-Solving Mistakes",
          items: [
            "**Jumping Straight to Code**: Writing code before having a clear algorithm leads to dead ends and wasted time.",
            "**Ignoring Constraint Limits**: An algorithm that works for $N \\le 100$ will time out with Time Limit Exceeded (TLE) when $N = 10^5$.",
            "**Using Floating Point for Precise Checks**: Calling `Math.sqrt(n)` repeatedly in loop conditions introduces floating-point precision inaccuracies; use integer multiplication `i * i <= n` instead.",
            "**Not Verifying Minimum Inputs**: Forgetting to check `if (n < 2)` or `if (arr.length == 0)`."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: The $10^8$ Operations Rule of Thumb",
          traps: [
            {
              question: "How do you know if your algorithm will pass within the standard 1.0-second time limit on platforms like LeetCode or HackerRank?",
              trap: "Guessing or submitting brute-force solutions blindly.",
              solution: "As a standard rule of thumb in computer science, modern CPU judges execute approximately **$10^8$ basic operations per second**:\n• If $N \\le 10^4$: An $O(N^2)$ algorithm (up to $10^8$ operations) will barely pass.\n• If $N = 10^5$ to $10^6$: You MUST use an $O(N)$ or $O(N \\log N)$ algorithm ($10^5 \\times 17 \\approx 1.7 \\times 10^6$ ops).\n• If $N = 10^9$: You MUST use an $O(\\log N)$ or $O(1)$ algorithm."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "If a coding interview problem states that array length $N \\le 100,000$, which time complexity will likely pass within the 1-second limit?",
          options: [
            "O(N^2) quadratic time",
            "O(N!) factorial time",
            "O(N log N) linearithmic time",
            "O(2^N) exponential time"
          ],
          answer: 2,
          explanation: "For N = 100,000, O(N^2) requires 10,000,000,000 operations (100 seconds, causing TLE). O(N log N) requires ~1.7 million operations, executing in under 0.05 seconds."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Follow the 6-stage lifecycle: Understand, Examples, Pseudocode, Implement, Trace, Optimize.",
            "Always test extreme edge cases: 0, negative values, empty arrays, null, and duplicates.",
            "Evaluate time complexity against problem constraints using the $10^8$ ops/sec rule.",
            "Use integer arithmetic `i * i <= n` instead of `i <= Math.sqrt(n)` for prime checking."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Breaking Problems Into Steps, mastering modular decomposition, top-down design, and pipeline orchestration."
        }
      ]
    }
  },
  {
    slug: "breaking-problems-into-steps",
    title: "Breaking Problems Into Steps",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `problem-solving-approach`, `methods`, modular design principles, and boolean logic."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of Problem Decomposition as an **Industrial Assembly Line**:\n• A car is never stamped out of a single giant mold in one second.\n• Instead, the problem is broken into specialized workstation stages:\n  - **Stage 1**: Sanitize & validate incoming raw metal sheets (Input Cleaning).\n  - **Stage 2**: Weld the frame chassis (Core Transformation).\n  - **Stage 3**: Paint and seal the exterior (Formatting & Output).\n• If the painting machine develops a leak, you inspect only Stage 3 without touching the chassis welding robots."
        },
        {
          type: "callout",
          title: "Divide and Conquer (Decomposition)",
          content: "**Decomposition** is the practice of breaking a complex, intimidating problem down into a series of smaller, isolated, and easily solvable sub-problems. Each sub-problem is implemented as a dedicated helper method, tested independently, and orchestrated by a clean master function."
        },
        {
          type: "code",
          title: "Case Study: Monolithic Code vs Clean Pipeline Decomposition",
          code: "public class DecompositionDemo {\n    // === BAD APPROACH: 40-line messy monolithic blob ===\n    // Hard to read, hard to debug, impossible to unit test individual rules.\n\n    // === GOOD APPROACH: Modular Decomposed Pipeline ===\n    \n    // Sub-step 1: Clean and normalize text\n    public static String cleanInput(String text) {\n        if (text == null) return \"\";\n        return text.trim().toLowerCase();\n    }\n\n    // Sub-step 2: Validate structural rules\n    public static boolean hasValidLength(String text, int min, int max) {\n        return text.length() >= min && text.length() <= max;\n    }\n\n    public static boolean containsSpecialChar(String text) {\n        for (int i = 0; i < text.length(); i++) {\n            char ch = text.charAt(i);\n            if (!Character.isLetterOrDigit(ch)) return true;\n        }\n        return false;\n    }\n\n    // Master Orchestrator Method\n    public static boolean validatePassword(String rawPassword) {\n        String cleaned = cleanInput(rawPassword);\n        if (!hasValidLength(cleaned, 8, 30)) return false;\n        if (!containsSpecialChar(cleaned)) return false;\n        return true; // Passed all stages\n    }\n\n    public static void main(String[] args) {\n        System.out.println(validatePassword(\"Pass@1234\")); // true\n        System.out.println(validatePassword(\"short\"));     // false\n    }\n}",
          language: "java",
          explanation: "Each helper method has a single responsibility. If length requirements change from 8 to 10, only hasValidLength() is adjusted."
        },
        {
          type: "table",
          title: "The Standard 4-Phase Algorithmic Pipeline",
          headers: ["Phase", "Purpose", "Typical Operations", "Example Helper Method"],
          rows: [
            ["Phase 1: Ingestion & Sanitation", "Defend against nulls, strip whitespace, normalize casing.", "Null-checks, `.trim()`, `.toLowerCase()`, boundary guards.", "`sanitizeInput(str)`"],
            ["Phase 2: Validation", "Verify preconditions and format conformance.", "Regex matching, length assertions, character type checks.", "`isValidUsername(str)`"],
            ["Phase 3: Core Transformation", "Execute the primary business or algorithmic logic.", "Two-pointer traversal, hash table lookups, mathematical computations.", "`computeHash(str)`"],
            ["Phase 4: Formatting & Response", "Package the result into the expected return container.", "Rounding floats, building output strings, packaging array records.", "`formatResponse(data)`"]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Decomposed Word Counter",
          code: "class WordProcessor {\n    public static String[] splitWords(String text) {\n        if (text == null || text.trim().isEmpty()) return new String[0];\n        return text.trim().split(\"\\\\s+\");\n    }\n    public static int countLongWords(String text, int minLength) {\n        String[] words = splitWords(text);\n        int count = 0;\n        for (String w : words) {\n            if (w.length() >= minLength) count++;\n        }\n        return count;\n    }\n    public static void main(String[] args) {\n        System.out.println(\"Long words (>=5): \" + countLongWords(\"Java provides clean modular methods for engineering\", 5));\n    }\n}",
          expectedOutput: "Long words (>=5): 5",
          explanation: "Words with length >= 5: \"provides\", \"clean\", \"modular\", \"methods\", \"engineering\" (total = 5)."
        },
        {
          type: "dryRun",
          title: "Pipeline Execution Trace: `validatePassword(\"  Dev#2026  \")`",
          iterations: [
            { step: 1, variables: { "Input": "\"  Dev#2026  \"" }, description: "Pass into validatePassword." },
            { step: 2, variables: { "cleanInput()": "\"dev#2026\"" }, description: "Whitespace trimmed, lowercased." },
            { step: 3, variables: { "hasValidLength(8, 30)": "true (length = 8)" }, description: "Length constraint validated." },
            { step: 4, variables: { "containsSpecialChar()": "true ('#')" }, description: "Special character found at index 3." },
            { step: 5, variables: { "Result": "true" }, description: "All pipeline stages passed. Returns true." }
          ]
        },
        {
          type: "warning",
          title: "Common Decomposition Mistakes",
          items: [
            "**Over-Fragmentation**: Creating 1-line helper methods for trivial operations used only once, creating cognitive clutter.",
            "**Hidden Side Effects**: Writing helper methods that silently mutate shared global/static variables instead of taking parameters and returning values.",
            "**Skipping Helper Testing**: Assuming the master method works without testing each decomposed sub-method with boundary values."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Live Coding Helper Stubs",
          traps: [
            {
              question: "During a fast 45-minute live coding interview with a complex multi-step problem, how should you structure your code?",
              trap: "Writing a giant monolithic 80-line function with nested loops and complex edge case handlers.",
              solution: "Top interviewers reward candidates who practice **Top-Down Decomposition**. Define your master function immediately with clean helper method stubs:\n```java\npublic boolean isComplexValid(String s) {\n    if (!isValidHeader(s)) return false;\n    int checksum = computeChecksum(s);\n    return verifyPayload(s, checksum);\n}\n```\nThis proves your system design architecture first, allowing you to implement each self-contained helper method with zero cognitive overload."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "What is the primary advantage of breaking a large programming problem into smaller helper methods?",
          options: [
            "It makes the program run 10x faster automatically",
            "It isolates functionality into manageable, independently testable, and reusable components",
            "It eliminates the need for unit tests",
            "It reduces total line count to zero"
          ],
          answer: 1,
          explanation: "Decomposition reduces complexity by isolating logic into small, modular methods that can be developed, tested, and debugged independently."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Break complex tasks into an orderly 4-phase pipeline: Sanitize &rarr; Validate &rarr; Transform &rarr; Format.",
            "Each helper method should follow the Single Responsibility Principle.",
            "Write top-down orchestrator methods with clean helper stubs during technical interviews.",
            "Avoid hidden side-effects by writing pure functions that rely only on parameters."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we enter What is Recursion?, discovering how algorithms solve complex self-similar problems by having methods invoke smaller instances of themselves."
        }
      ]
    }
  },
  {
    slug: "what-is-recursion",
    title: "What is Recursion?",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `what-is-a-method`, `scope-and-tracing`, JVM Call Stack memory allocation, and basic conditional branching."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of Recursion as a **Set of Russian Matryoshka Nesting Dolls**:\n• You hold a giant wooden doll ($N=5$). You open it up, and inside is an identical but slightly smaller doll ($N=4$).\n• You keep opening nested dolls ($N=3, 2, 1$) until you reach the solid, unbreakable micro-doll in the center (**The Base Case: $N=1$**).\n• You cannot close and reassemble the giant doll until every smaller inner doll has been assembled and passed back out (**Stack Unwinding & Result Combination**)."
        },
        {
          type: "callout",
          title: "The 2 Inviolable Laws of Recursion",
          content: "Every valid recursive function in computer science MUST satisfy two invariants:\n1. **The Base Case**: A simple, non-recursive conditional branch that stops the recursion and returns a known answer immediately.\n2. **The Recursive Step (Reduction Step)**: Calling itself with a strictly smaller or simpler input ($n - 1$, $n / 2$, or `subproblem`), guaranteed to move closer to the base case on every invocation."
        },
        {
          type: "code",
          title: "Factorial: Iterative Loop vs Recursive Call Stack",
          code: "public class RecursionBasicsDemo {\n    // 1. Iterative Approach (Explicit loop, O(1) auxiliary space)\n    public static long factorialIterative(int n) {\n        long result = 1;\n        for (int i = 2; i <= n; i++) {\n            result *= i;\n        }\n        return result;\n    }\n\n    // 2. Recursive Approach (Self-invocation, O(N) Call Stack space)\n    public static long factorialRecursive(int n) {\n        // LAW 1: Base Case (Stopping condition)\n        if (n <= 1) {\n            return 1;\n        }\n        // LAW 2: Recursive Step (n * factorial(n - 1))\n        return n * factorialRecursive(n - 1);\n    }\n\n    public static void main(String[] args) {\n        System.out.println(\"5! (Iterative): \" + factorialIterative(5)); // 120\n        System.out.println(\"5! (Recursive): \" + factorialRecursive(5)); // 120\n    }\n}",
          language: "java",
          explanation: "factorialRecursive(5) delegates to 5 * factorial(4), which delegates down to factorial(1)=1. Once base case 1 is reached, the stack unwinds multiplying: 1 -> 2 -> 6 -> 24 -> 120."
        },
        {
          type: "table",
          title: "Recursion vs Iteration: Architectural Comparison",
          headers: ["Attribute", "Iteration (`for` / `while`)", "Recursion (Self-Method Calls)"],
          rows: [
            ["Mechanism", "Repeated execution of a code block via loop jumps.", "Repeated method invocation creating new Call Stack Frames."],
            ["Termination", "Loop condition evaluates to `false`.", "Base case condition evaluates to `true`."],
            ["Auxiliary Memory", "$O(1)$ constant stack memory.", "$O(N)$ stack memory proportional to recursion depth."],
            ["Infinite Failure", "Infinite loop (CPU hangs at 100%, program freezes).", "`StackOverflowError` (Call Stack memory exhausted, JVM crashes)."],
            ["Best Suited For", "Linear array scans, counters, simple sequences.", "Trees, Graphs, Divide-and-Conquer (MergeSort), Backtracking."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Recursive Sum of 1 to N",
          code: "class RecursiveSum {\n    public static int sum(int n) {\n        if (n <= 1) return n; // Base case\n        return n + sum(n - 1); // Recursive step\n    }\n    public static void main(String[] args) {\n        System.out.println(\"Sum(5): \" + sum(5)); // 5 + 4 + 3 + 2 + 1 = 15\n    }\n}",
          expectedOutput: "Sum(5): 15",
          explanation: "sum(5) computes 5 + sum(4) -> 5 + 4 + sum(3) -> ... -> returns 15."
        },
        {
          type: "dryRun",
          title: "Call Stack Push & Unwind Trace for `factorial(3)`",
          iterations: [
            { step: 1, variables: { "Call Stack": "[factorial(3)]", "Action": "n = 3; evaluates 3 * factorial(2)" }, description: "Frame 1 pushed. Pauses waiting for factorial(2)." },
            { step: 2, variables: { "Call Stack": "[factorial(3)] -> [factorial(2)]", "Action": "n = 2; evaluates 2 * factorial(1)" }, description: "Frame 2 pushed. Pauses waiting for factorial(1)." },
            { step: 3, variables: { "Call Stack": "[factorial(3)] -> [factorial(2)] -> [factorial(1)]", "Action": "n = 1; BASE CASE HIT! Returns 1." }, description: "Frame 3 hits base case. Returns 1 immediately." },
            { step: 4, variables: { "Call Stack": "[factorial(3)] -> [factorial(2)]", "Action": "Frame 2 resumes: 2 * 1 = 2. Returns 2." }, description: "Frame 3 popped. Frame 2 completes and returns 2." },
            { step: 5, variables: { "Call Stack": "[factorial(3)]", "Action": "Frame 1 resumes: 3 * 2 = 6. Returns 6." }, description: "Frame 2 popped. Frame 1 completes and delivers final result 6." }
          ]
        },
        {
          type: "warning",
          title: "Common Recursion Traps",
          items: [
            "**Missing Base Case**: Forgetting the base case causes infinite self-invocation until `StackOverflowError` crashes the thread.",
            "**Wrong Reduction Direction**: Writing `return n * factorial(n + 1);` moves away from the base case, exhausting the stack.",
            "**Excessive Stack Depth**: Recursion depths $> 10,000$ will typically overflow the standard JVM thread stack (~1MB `-Xss`).",
            "**Overlapping Sub-problems Without Memoization**: Naive recursive Fibonacci calculates identical sub-trees repeatedly, exploding to $O(2^N)$ exponential time."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Recursive Auxiliary Space Complexity",
          traps: [
            {
              question: "What is the space complexity of `factorialRecursive(N)`? Does it use $O(1)$ extra memory since no arrays or objects are created?",
              trap: "Claiming O(1) space because no 'new' keyword is used.",
              solution: "The auxiliary space complexity is **$O(N)$**. Even though no heap objects are allocated, each active method invocation pushes a new Stack Frame onto the JVM Call Stack containing local parameters and the return address. With recursion depth $N$, there are $N$ simultaneous stack frames in memory at the deepest point."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "What error occurs if a recursive method has no base case or fails to reach it?",
          options: [
            "OutOfMemoryError: Java heap space",
            "StackOverflowError",
            "NullPointerException",
            "ArithmeticException"
          ],
          answer: 1,
          explanation: "Without a base case, continuous recursive calls push frames onto the JVM Call Stack until it runs out of memory, throwing a StackOverflowError."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Recursion is a programming technique where a method calls itself to solve smaller sub-problems.",
            "Every recursive function requires a Base Case and a Recursive Reduction Step.",
            "Call Stack frames grow during descending calls and unwind during return resolution.",
            "Recursion has an intrinsic $O(N)$ auxiliary space complexity due to Call Stack frames."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Base Case design in depth, learning how to identify single vs multiple base cases, boundary conditions, and reachability invariants."
        }
      ]
    }
  },
  {
    slug: "base-case",
    title: "Base Case",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `what-is-recursion`, conditionals, call stack frame lifecycles, and relational operators."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of the Base Case as an **Elevator's Ground Floor Electronic Limit Sensor**:\n• As an elevator cab descends floor by floor ($10 \\to 9 \\to 8 \\dots$), the ground floor sensor detects floor $0$ and safely stops the motor.\n• Without that base sensor, the motor pulls the cable forever, crashing through the floor into the basement (`StackOverflowError`).\n• The Base Case is the anchor of reality that provides a directly computed, non-recursive answer."
        },
        {
          type: "callout",
          title: "The Invariant of Convergence & Reachability",
          content: "A base case is useless unless every recursive call **guarantees convergence** toward it.\n• ❌ **Bug**: If base case is `n == 0` and step is `n - 2`, calling with `n = 5` steps $5 \\to 3 \\to 1 \\to -1 \\to -3 \\dots$ jumping clean over $0$ and crashing!\n• ✅ **Defensive Fix**: Always use relational inequality guards (`n <= 0` or `left >= right`) rather than strict equality."
        },
        {
          type: "code",
          title: "Single Base Case vs Multiple Base Cases in Action",
          code: "public class BaseCaseDemo {\n    // 1. SINGLE BASE CASE: Factorial (n <= 1)\n    public static long factorial(int n) {\n        if (n <= 1) return 1; // Base case: 0! = 1, 1! = 1\n        return n * factorial(n - 1);\n    }\n\n    // 2. DUAL BASE CASES: Fibonacci (n == 0 -> 0, n == 1 -> 1)\n    public static int fibonacci(int n) {\n        if (n <= 0) return 0; // Base case 1\n        if (n == 1) return 1; // Base case 2\n        return fibonacci(n - 1) + fibonacci(n - 2);\n    }\n\n    // 3. SUCCESS + FAILURE BASE CASES: Recursive Binary Search\n    public static int binarySearch(int[] arr, int target, int left, int right) {\n        // Failure Base Case: Search space exhausted\n        if (left > right) return -1;\n\n        int mid = left + (right - left) / 2;\n\n        // Success Base Case: Target found!\n        if (arr[mid] == target) return mid;\n\n        // Recursive Reduction Steps\n        if (arr[mid] > target) {\n            return binarySearch(arr, target, left, mid - 1);\n        } else {\n            return binarySearch(arr, target, mid + 1, right);\n        }\n    }\n\n    public static void main(String[] args) {\n        System.out.println(\"Fib(7): \" + fibonacci(7)); // 13\n        int[] sorted = { 3, 9, 14, 21, 35, 42, 68 };\n        System.out.println(\"Find 35 at index: \" + binarySearch(sorted, 35, 0, sorted.length - 1)); // 4\n        System.out.println(\"Find 99 at index: \" + binarySearch(sorted, 99, 0, sorted.length - 1)); // -1\n    }\n}",
          language: "java",
          explanation: "Binary search demonstrates the dual base case pattern: one base case for immediate success (found element), and one for termination upon failure (search space inverted)."
        },
        {
          type: "table",
          title: "Classic Base Case Taxonomy",
          headers: ["Problem Domain", "Input State", "Base Case Condition", "Base Return Value"],
          rows: [
            ["Numeric Countdown", "`n`", "`if (n <= 0)`", "`return 0;` or `return 1;`"],
            ["String Processing", "`String s`", "`if (s.isEmpty())` or `if (s.length() <= 1)`", "`return \"\";` or `return s;`"],
            ["Array / List Traversal", "`int index`", "`if (index >= arr.length)`", "`return 0;` or `return false;`"],
            ["Two-Pointer Range", "`left, right`", "`if (left >= right)`", "`return true;` (Palindrome)"],
            ["Tree Node Traversal", "`TreeNode node`", "`if (node == null)`", "`return 0;` (Depth/Sum)"]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Recursive Palindrome Base Cases",
          code: "class PalindromeRecursive {\n    public static boolean isPal(String s, int l, int r) {\n        if (l >= r) return true; // Base case 1: Checked all characters\n        if (s.charAt(l) != s.charAt(r)) return false; // Base case 2: Mismatch!\n        return isPal(s, l + 1, r - 1); // Recursive step\n    }\n    public static void main(String[] args) {\n        String word = \"racecar\";\n        System.out.println(\"Is '\" + word + \"' palindrome: \" + isPal(word, 0, word.length() - 1));\n    }\n}",
          expectedOutput: "Is 'racecar' palindrome: true",
          explanation: "Iterates inward from both ends. When l >= r, all pairs matched, returning true."
        },
        {
          type: "dryRun",
          title: "Base Case Evaluation Trace: `binarySearch([10, 20, 30], target=99, left=0, right=2)`",
          iterations: [
            { step: 1, variables: { "left": "0", "right": "2", "mid": "1 (arr[1]=20)" }, description: "20 < 99. Recurse right with left = mid + 1 = 2." },
            { step: 2, variables: { "left": "2", "right": "2", "mid": "2 (arr[2]=30)" }, description: "30 < 99. Recurse right with left = mid + 1 = 3." },
            { step: 3, variables: { "left": "3", "right": "2", "left > right": "true" }, description: "FAILURE BASE CASE HIT! left (3) > right (2). Returns -1 immediately." }
          ]
        },
        {
          type: "warning",
          title: "Common Base Case Traps",
          items: [
            "**Placing Base Case Below Recursive Call**: If recursive calls appear before the base case check, the base case will never execute.",
            "**Overly Strict Equality (`== 0`)**: Using `n == 0` instead of `n <= 0` creates infinite recursion on negative inputs or odd-step decrements.",
            "**Forgetting Edge-Case Base Conditions**: In recursive string parsing, forgetting to check for `null` or empty string `\"\"` before calling `charAt(0)` causes `StringIndexOutOfBoundsException`."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: The Zero and Negative Parameter Trap",
          traps: [
            {
              question: "What happens if you call `factorial(-5)` on `public static int factorial(int n) { if (n == 0) return 1; return n * factorial(n - 1); }`?",
              trap: "Assuming it returns 0 or throws an IllegalArgumentException.",
              solution: "Because the base case tests strictly `n == 0`, passing `-5` results in calls `factorial(-6)`, `factorial(-7)`, ..., indefinitely decrementing into negative numbers until `StackOverflowError` crashes the program. The base case must always be defensively written as `if (n <= 1) return 1;`."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Why should you use `if (n <= 1)` instead of `if (n == 1)` as the base case for factorial?",
          options: [
            "It runs 50% faster",
            "It defensively handles n = 0 and negative numbers, preventing infinite recursion",
            "Java syntax requires relational operators in if conditions",
            "It avoids creating heap objects"
          ],
          answer: 1,
          explanation: "`n <= 1` correctly handles `0! = 1` and prevents negative arguments from initiating infinite descending recursion."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "The Base Case is the terminal condition that provides a direct answer without self-invocation.",
            "Always position base cases at the very top of the recursive method.",
            "Use relational guards (`<=`, `>=`) rather than strict equality to prevent stepping over the base boundary.",
            "Complex algorithms like search and divide-and-conquer often require multiple base cases (success and termination)."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore the Recursive Case, analyzing reduction mechanisms, combination strategies, and the difference between head, body, and tail recursion."
        }
      ]
    }
  },
  {
    slug: "recursive-case",
    title: "Recursive Case",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `base-case`, `what-is-recursion`, stack unwinding, and algebraic substitution."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of the Recursive Case as a **3-Step Relay Race Hand-off**:\n1. **Shrink**: You break off a manageable piece of the total problem (e.g. current character or array element).\n2. **Delegate**: You pass the remaining sub-problem to your clone teammate (the recursive call `helper(smallerInput)`).\n3. **Combine**: When your teammate returns their finished result, you glue your piece together with their result and pass the combined package up to your caller."
        },
        {
          type: "callout",
          title: "The Mathematical Reduction Requirement",
          content: "Every valid recursive step MUST perform a **monotonic reduction**:\n$$\\text{Size}(\\text{SubProblem}) < \\text{Size}(\\text{CurrentProblem})$$\nIf the problem size does not strictly decrease on every single call, the algorithm violates the Well-Ordering Principle and will never terminate."
        },
        {
          type: "code",
          title: "Reduction Architectures: Linear vs Divide-and-Conquer ($O(\\log N)$)",
          code: "public class RecursiveCaseDemo {\n    // 1. LINEAR REDUCTION: Sum of array elements (n -> n - 1)\n    public static int sumArray(int[] arr, int index) {\n        if (index >= arr.length) return 0; // Base case\n        // Recursive Case: current element + sum of rest\n        return arr[index] + sumArray(arr, index + 1);\n    }\n\n    // 2. DIVIDE & CONQUER: Fast Exponentiation (n -> n / 2) in O(log N) time\n    public static double fastPower(double x, int n) {\n        if (n == 0) return 1.0; // Base case: x^0 = 1\n        if (n < 0) return 1.0 / fastPower(x, -n); // Negative exponent\n\n        double half = fastPower(x, n / 2); // Divide problem in half\n\n        if (n % 2 == 0) {\n            return half * half; // Even exponent: x^n = (x^(n/2))^2\n        } else {\n            return x * half * half; // Odd exponent: x^n = x * (x^(n/2))^2\n        }\n    }\n\n    public static void main(String[] args) {\n        int[] values = { 10, 20, 30, 40 };\n        System.out.println(\"Array Sum: \" + sumArray(values, 0)); // 100\n        System.out.println(\"2^10 (Fast Power): \" + fastPower(2.0, 10)); // 1024.0\n    }\n}",
          language: "java",
          explanation: "fastPower(2, 10) calculates half=fastPower(2, 5) in O(log N) steps rather than multiplying 10 times in O(N). The recursive case squares the half-result."
        },
        {
          type: "table",
          title: "Comparison of Recursive Structures",
          headers: ["Recursion Paradigm", "Recurrence Relation", "Time Complexity", "Classic Algorithm"],
          rows: [
            ["Linear Decrement", "$T(N) = T(N - 1) + O(1)$", "$O(N)$", "Factorial, Array Linear Scan, String Reversal"],
            ["Binary Halving (D&C)", "$T(N) = T(N / 2) + O(1)$", "$O(\\log N)$", "Binary Search, Fast Exponentiation"],
            ["Divide & Conquer with Merge", "$T(N) = 2T(N / 2) + O(N)$", "$O(N \\log N)$", "MergeSort"],
            ["Branching / Tree Recursion", "$T(N) = 2T(N - 1) + O(1)$", "$O(2^N)$", "Towers of Hanoi, Subsets / Subsequences"]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Recursive Sum of Digits",
          code: "class DigitSum {\n    public static int sumOfDigits(int n) {\n        if (n == 0) return 0; // Base case\n        return (n % 10) + sumOfDigits(n / 10); // Last digit + sum of remaining\n    }\n    public static void main(String[] args) {\n        System.out.println(\"Sum of digits in 4567: \" + sumOfDigits(4567)); // 4+5+6+7 = 22\n    }\n}",
          expectedOutput: "Sum of digits in 4567: 22",
          explanation: "4567 % 10 = 7; adds 7 to sumOfDigits(456) -> returns 22."
        },
        {
          type: "dryRun",
          title: "Fast Power Recursion Tree: `fastPower(2.0, 8)`",
          iterations: [
            { step: 1, variables: { "Call": "fastPower(2.0, 8)", "Action": "Calls fastPower(2.0, 4)" }, description: "n=8 (even). Halves exponent to 4." },
            { step: 2, variables: { "Call": "fastPower(2.0, 4)", "Action": "Calls fastPower(2.0, 2)" }, description: "n=4 (even). Halves exponent to 2." },
            { step: 3, variables: { "Call": "fastPower(2.0, 2)", "Action": "Calls fastPower(2.0, 1)" }, description: "n=2 (even). Halves exponent to 1." },
            { step: 4, variables: { "Call": "fastPower(2.0, 1)", "Action": "Calls fastPower(2.0, 0)" }, description: "n=1 (odd). Halves exponent to 0." },
            { step: 5, variables: { "Call": "fastPower(2.0, 0)", "Action": "BASE CASE HIT! Returns 1.0" }, description: "Returns 1.0. Unwinds squaring: 2.0 -> 4.0 -> 16.0 -> 256.0." }
          ]
        },
        {
          type: "warning",
          title: "Common Recursive Case Mistakes",
          items: [
            "**Recalculating Branches Repeatedly**: Writing `return fastPower(x, n/2) * fastPower(x, n/2);` invokes two duplicate recursive branches, degrading performance from $O(\\log N)$ back to $O(N)$. Cache the half-result in a local variable!",
            "**Forgetting to Combine Results**: Calling the recursive step without adding or multiplying its return value discards the sub-problem computation.",
            "**Modifying Non-Local State in Branches**: Mutating shared static variables during multiple recursive calls creates subtle race conditions and data corruption."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Tail Recursion & Java's JVM Limitation",
          traps: [
            {
              question: "What is 'Tail Recursion', and does the standard Oracle/OpenJDK HotSpot JVM optimize tail-recursive methods into iterative loops (Tail Call Optimization)?",
              trap: "Assuming Java automatically optimizes tail recursion like Scala, Kotlin, or C++ compilers.",
              solution: "A method is **tail-recursive** when the recursive self-call is the absolute last statement executed, with no pending operations (e.g. `return helper(n - 1, acc * n);`). While languages like Scala and Scheme optimize tail calls to reuse a single stack frame ($O(1)$ space), standard **Java HotSpot does NOT support Tail Call Optimization (TCO)** because JVM security checks require full stack frame visibility. Deep tail recursion in Java will still throw `StackOverflowError`."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Why is `double half = fastPower(x, n / 2); return half * half;` much faster than `return fastPower(x, n / 2) * fastPower(x, n / 2);`?",
          options: [
            "Local variables use less RAM than expressions",
            "Storing the result avoids executing two identical recursive sub-trees, maintaining O(log N) instead of O(N)",
            "The compiler cannot multiply two method calls",
            "It avoids floating-point rounding errors"
          ],
          answer: 1,
          explanation: "Calling `fastPower` twice splits execution into a binary tree with $2^{\\log N} = N$ calls ($O(N)$ time), whereas computing it once and squaring achieves true $O(\\log N)$ logarithmic time."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "The Recursive Case must strictly reduce the problem size closer to the base case.",
            "Store intermediate recursive results in variables to prevent branching tree explosions.",
            "Divide-and-Conquer reduction ($N \\to N/2$) achieves $O(\\log N)$ logarithmic complexity.",
            "Java does not perform Tail Call Optimization; all recursive calls consume Call Stack frames."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we synthesize everything into Basic Recursion Problems, solving string reversals, subsequence generation, array sorting checks, and mathematical series."
        }
      ]
    }
  },
  {
    slug: "basic-recursion-problems",
    title: "Basic Recursion Problems",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `base-case`, `recursive-case`, array indexing, string manipulation, and stack frame traces."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of Classic Recursion Problems as **The 4 Fundamental Structural Patterns**:\n1. **Linear Index Accumulation**: Passing an index pointer `i` through an array or string (Sum, Max, Linear Search).\n2. **Two-Pointer Convergence**: Inward shrinking from left and right bounds (Palindrome, In-place Reversal).\n3. **Subproblem Halving**: Halving the problem magnitude logarithmically (Binary Search, Power $x^n$).\n4. **Branching Decision Trees (Pick or Don't Pick)**: Generating all $2^N$ combinations/subsets by branching on whether to include each element."
        },
        {
          type: "callout",
          title: "The Index Helper Method Pattern",
          content: "⚠️ **CRITICAL INTERVIEW PATTERN**: When solving array problems recursively, NEVER slice arrays with `Arrays.copyOfRange()` ($O(N)$ copying overhead per call). Instead, pass the original array reference and an integer index pointer: `helper(int[] arr, int index)` ($O(1)$ memory per frame)."
        },
        {
          type: "code",
          title: "Problem Portfolio: Array Verification, String Reversal & Subsets",
          code: "public class ClassicRecursionProblems {\n    // 1. Check if Array is Sorted in Ascending Order (O(N) time, O(N) stack)\n    public static boolean isSorted(int[] arr, int index) {\n        // Base Case 1: Reached last element\n        if (index >= arr.length - 1) return true;\n        // Base Case 2: Inversion found\n        if (arr[index] > arr[index + 1]) return false;\n        // Recursive Step: Check remaining elements\n        return isSorted(arr, index + 1);\n    }\n\n    // 2. Reverse a String Recursively (O(N) time)\n    public static String reverseString(String s) {\n        if (s.length() <= 1) return s; // Base case\n        // Recursive Case: reverse(rest) + first_char\n        return reverseString(s.substring(1)) + s.charAt(0);\n    }\n\n    // 3. Generate All Subsets / Subsequences (Pick or Don't Pick Pattern - O(2^N))\n    public static void printSubsequences(String input, String currentChoice, int index) {\n        if (index == input.length()) {\n            System.out.print(\"[\" + currentChoice + \"] \");\n            return; // Base case: leaf node in decision tree\n        }\n        // CHOICE 1: Include current character\n        printSubsequences(input, currentChoice + input.charAt(index), index + 1);\n        // CHOICE 2: Exclude current character\n        printSubsequences(input, currentChoice, index + 1);\n    }\n\n    public static void main(String[] args) {\n        int[] numbers = { 2, 5, 8, 12, 19 };\n        System.out.println(\"Is Sorted: \" + isSorted(numbers, 0)); // true\n        System.out.println(\"Reversed 'StudyHub': \" + reverseString(\"StudyHub\")); // buHydutS\n        System.out.print(\"Subsequences of 'ABC': \");\n        printSubsequences(\"ABC\", \"\", 0); // [ABC] [AB] [AC] [A] [BC] [B] [C] []\n        System.out.println();\n    }\n}",
          language: "java",
          explanation: "printSubsequences constructs a binary decision tree of depth N, producing 2^N total leaves representing every possible subset."
        },
        {
          type: "table",
          title: "Classic Recursion Problems Complexity Matrix",
          headers: ["Problem", "State Variables", "Time Complexity", "Auxiliary Space", "Key Pattern"],
          rows: [
            ["Is Array Sorted?", "`arr, index`", "$O(N)$", "$O(N)$ stack", "Early exit if `arr[i] > arr[i+1]`."],
            ["Find Maximum in Array", "`arr, index`", "$O(N)$", "$O(N)$ stack", "`Math.max(arr[i], findMax(arr, i+1))`."],
            ["Reverse String", "`String s`", "$O(N^2)$ (due to substring copy)", "$O(N^2)$", "Better with `char[]` two-pointer in $O(N)$."],
            ["All Subsequences", "`input, choice, idx`", "$O(2^N)$", "$O(N)$ stack", "Binary decision tree: Pick vs Don't Pick."],
            ["Tower of Hanoi", "`n, src, aux, dst`", "$O(2^N)$", "$O(N)$ stack", "$2^N - 1$ total moves."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Recursive Count of Character Occurrences",
          code: "class CharCounter {\n    public static int countChar(String str, char target, int index) {\n        if (index >= str.length()) return 0; // Base case\n        int match = (str.charAt(index) == target) ? 1 : 0;\n        return match + countChar(str, target, index + 1);\n    }\n    public static void main(String[] args) {\n        System.out.println(\"Occurrences of 'a': \" + countChar(\"banana\", 'a', 0)); // 3\n    }\n}",
          expectedOutput: "Occurrences of 'a': 3",
          explanation: "Traverses indices 0 to 5, tallying 1 whenever charAt(index) == 'a'."
        },
        {
          type: "dryRun",
          title: "Subsequence Binary Decision Tree Trace for `\"AB\"`",
          iterations: [
            { step: 1, variables: { "Depth 0": "index=0 ('A')", "Choices": "Include 'A' vs Exclude 'A'" }, description: "Tree branches into (\"A\", idx=1) and (\"\", idx=1)." },
            { step: 2, variables: { "Depth 1 (Branch 1)": "index=1 ('B') with choice \"A\"", "Choices": "\"AB\" vs \"A\"" }, description: "Leaves reach index=2: prints [AB] and [A]." },
            { step: 3, variables: { "Depth 1 (Branch 2)": "index=1 ('B') with choice \"\"", "Choices": "\"B\" vs \"\"" }, description: "Leaves reach index=2: prints [B] and []." },
            { step: 4, variables: { "Total Leaves": "4 subsets ($2^2 = 4$)" }, description: "Complete power set generated." }
          ]
        },
        {
          type: "warning",
          title: "Common Problem Traps",
          items: [
            "**Array Slicing Space Bomb**: Slicing an array with `Arrays.copyOfRange()` at each step copies $N + (N-1) + \\dots + 1 = O(N^2)$ elements into heap garbage. Always use index pointers!",
            "**Exponential Subsets Without Base Case Bounds**: Forgetting `if (index == input.length()) return;` causes infinite tree generation.",
            "**String Concatenation in Recursive Tree**: Using `+` in massive backtracking problems creates many temporary strings; use `StringBuilder` with undo-steps (Backtracking) for advanced search."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: The Tower of Hanoi Move Count",
          traps: [
            {
              question: "What is the exact minimum number of moves required to solve the Tower of Hanoi puzzle with $N$ disks recursively, and what is its time complexity?",
              trap: "Guessing O(N^2) or O(N!).",
              solution: "To move $N$ disks from Source to Destination using Auxiliary: Move $N-1$ disks to Auxiliary ($T(N-1)$), move the largest disk to Destination ($1$ move), then move $N-1$ disks from Auxiliary to Destination ($T(N-1)$). This yields the recurrence $T(N) = 2T(N-1) + 1$, which solves mathematically to exactly **$2^N - 1$ moves** ($O(2^N)$ exponential time)."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "How many total subsequences (including the empty string) exist for a string of length $N$?",
          options: [
            "N!",
            "N^2",
            "2^N",
            "2 * N"
          ],
          answer: 2,
          explanation: "Because each character has exactly 2 independent binary choices (either include it or exclude it), there are $2 \\times 2 \\times \\dots \\times 2 = 2^N$ total subsequences."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Use the Index Pointer pattern (`arr, index`) to traverse arrays recursively in $O(1)$ memory per frame.",
            "Subsequence generation relies on the binary Pick/Don't-Pick choice tree with $2^N$ outputs.",
            "Recursion is the foundational prerequisite for Trees, Graphs, Divide-and-Conquer, and Dynamic Programming.",
            "Always verify time complexity and stack depth before choosing recursion over iteration."
          ]
        },
        {
          type: "text",
          title: "Course Completion Summary",
          content: "🎉 **Congratulations! You have completed Module 10 and the entire Programming Fundamentals Curriculum.** You have mastered core programming concepts: execution lifecycles, data types, operators, I/O, control flow, loops & patterns, arrays, strings, methods & functions, and recursive problem solving."
        }
      ]
    }
  }
];

