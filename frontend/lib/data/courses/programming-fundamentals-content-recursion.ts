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
      definition: "Problem-solving in programming involves understanding the problem, breaking it down, designing a solution, implementing it, and testing. It's a systematic approach to developing working code.",
      whyItMatters: "Good problem-solving skills are more important than memorizing syntax. A systematic approach leads to correct solutions faster and with less frustration.",
      coreConcept: "Steps: 1) Understand the problem (inputs, outputs, examples), 2) Break down into smaller parts, 3) Design algorithm (pseudo-code, logic), 4) Implement code, 5) Test with various inputs, 6) Debug and refine.",
      syntax: "// Problem-solving template:\n// 1. Read problem carefully\n// 2. Identify inputs and expected outputs\n// 3. Work through examples by hand\n// 4. Write pseudo-code\n// 5. Translate to Java code\n// 6. Test and debug",
      javaExample: "// Problem: Check if a number is prime\n\n// Step 1: Understand\n// Input: integer n\n// Output: true if prime, false otherwise\n\n// Step 2: Examples\n// 2 → true, 4 → false, 7 → true\n\n// Step 3: Algorithm\n// If n < 2, not prime\n// Check if any number 2 to sqrt(n) divides n\n\n// Step 4: Implement\npublic static boolean isPrime(int n) {\n    if (n < 2) return false;\n    for (int i = 2; i <= Math.sqrt(n); i++) {\n        if (n % i == 0) {\n            return false;\n        }\n    }\n    return true;\n}\n\n// Step 5: Test\nSystem.out.println(isPrime(2));  // true\nSystem.out.println(isPrime(4));  // false\nSystem.out.println(isPrime(7));  // true",
      howItWorks: "Understanding comes before coding. Breaking down reduces complexity. Examples reveal edge cases. Pseudo-code clarifies logic. Testing validates correctness.",
      realWorldUse: "Algorithm design, interview problems, feature development, debugging, optimization, code review.",
      commonMistakes: [
        "Jumping to code before understanding the problem",
        "Not testing edge cases (0, negative, large values)",
        "Not breaking down complex problems",
        "Skipping the planning phase"
      ],
      interviewQuestions: [
        { question: "What should you do before writing any code?", answer: "Understand the problem fully, identify inputs and outputs, work through examples, and design the algorithm (often with pseudo-code)." },
        { question: "Why is testing important?", answer: "Testing reveals bugs, validates edge cases, ensures the solution works for all inputs, and builds confidence in the code." }
      ],
      quickRevision: "Understand → Break down → Design → Implement → Test → Debug. Don't skip steps.",
      practicePrompt: "Apply the problem-solving approach to: find the largest of three numbers.",
      quickCheck: {
        question: "What is the first step in problem-solving?",
        options: [
          "Write code",
          "Understand the problem",
          "Debug errors",
          "Optimize solution"
        ],
        answer: 1,
        explanation: "Understanding the problem is the first and most critical step. You can't solve a problem you don't understand."
      }
    }
  },
  {
    slug: "breaking-problems-into-steps",
    title: "Breaking Problems Into Steps",
    content: {
      definition: "Breaking problems into steps (decomposition) means dividing a complex problem into smaller, manageable sub-problems. Each sub-problem can be solved independently and combined for the final solution.",
      whyItMatters: "Complex problems become approachable when broken down. Decomposition enables modular design, easier testing, and clearer code organization.",
      coreConcept: "Divide and conquer: Split problem into smaller parts. Solve each part. Combine solutions. Use methods for each sub-problem. Top-down design: Start with main problem, break into sub-problems.",
      syntax: "// Problem: Calculate total price with tax and discount\n//\n// Step 1: Calculate subtotal\n// Step 2: Calculate discount\n// Step 3: Apply discount\n// Step 4: Calculate tax\n// Step 5: Apply tax\n// Step 6: Return final price",
      javaExample: "// Problem: Check if a string is a palindrome\n\n// Without decomposition (harder to understand)\npublic static boolean isPalindrome(String s) {\n    String clean = s.toLowerCase().replaceAll(\"[^a-z]\", \"\");\n    int left = 0, right = clean.length() - 1;\n    while (left < right) {\n        if (clean.charAt(left) != clean.charAt(right)) {\n            return false;\n        }\n        left++;\n        right--;\n    }\n    return true;\n}\n\n// With decomposition (clearer)\npublic static String cleanString(String s) {\n    return s.toLowerCase().replaceAll(\"[^a-z]\", \"\");\n}\n\npublic static boolean isPalindromeHelper(String s) {\n    int left = 0, right = s.length() - 1;\n    while (left < right) {\n        if (s.charAt(left) != s.charAt(right)) {\n            return false;\n        }\n        left++;\n        right--;\n    }\n    return true;\n}\n\npublic static boolean isPalindrome(String s) {\n    String cleaned = cleanString(s);\n    return isPalindromeHelper(cleaned);\n}",
      howItWorks: "Identify distinct tasks. Each task becomes a method or step. Solve independently. Test each part. Combine for complete solution.",
      realWorldUse: "Complex algorithms, feature development, system design, refactoring large functions, team collaboration.",
      commonMistakes: [
        "Breaking into too many tiny steps (over-engineering)",
        "Not breaking down enough (monolithic functions)",
        "Sub-problems that depend too heavily on each other",
        "Not testing sub-problems independently"
      ],
      interviewQuestions: [
        { question: "What is the divide and conquer approach?", answer: "Divide the problem into smaller sub-problems, solve each independently, and combine solutions. This makes complex problems manageable." },
        { question: "How do methods help with decomposition?", answer: "Each method handles one sub-problem. This makes code modular, testable, reusable, and easier to understand." }
      ],
      quickRevision: "Divide problem → Solve sub-problems → Combine. Use methods for each step. Test independently.",
      practicePrompt: "Break down the problem 'validate email address' into smaller steps.",
      quickCheck: {
        question: "Why is breaking problems into steps useful?",
        options: [
          "Makes code run faster",
          "Makes complex problems manageable",
          "Reduces memory usage",
          "Avoids all bugs"
        ],
        answer: 1,
        explanation: "Breaking problems into steps makes complex problems manageable by reducing them to smaller, solvable pieces."
      }
    }
  },
  {
    slug: "what-is-recursion",
    title: "What is Recursion?",
    content: {
      definition: "Recursion is a programming technique where a method calls itself to solve a problem. Each recursive call works on a smaller part of the problem until reaching a base case.",
      whyItMatters: "Recursion elegantly solves problems that have recursive structure: tree traversal, divide-and-conquer algorithms, mathematical sequences, and nested data structures.",
      coreConcept: "Recursive method calls itself. Must have base case(s) to stop recursion. Each call should work toward the base case. Recursive solutions often mirror the mathematical definition of a problem.",
      syntax: "returnType methodName(parameters) {\n    if (baseCaseCondition) {\n        return baseCaseValue;\n    }\n    return methodName(smallerProblem);\n}",
      javaExample: "// Iterative factorial\npublic static int factorialIterative(int n) {\n    int result = 1;\n    for (int i = 2; i <= n; i++) {\n        result *= i;\n    }\n    return result;\n}\n\n// Recursive factorial\npublic static int factorial(int n) {\n    if (n <= 1) {  // Base case\n        return 1;\n    }\n    return n * factorial(n - 1);  // Recursive call\n}\n\n// How it works for factorial(5):\n// factorial(5) = 5 * factorial(4)\n// factorial(4) = 4 * factorial(3)\n// factorial(3) = 3 * factorial(2)\n// factorial(2) = 2 * factorial(1)\n// factorial(1) = 1 (base case)\n// Unwinding: 2*1=2, 3*2=6, 4*6=24, 5*24=120\n\nSystem.out.println(factorial(5));  // 120",
      howItWorks: "Method calls itself with smaller input. Call stack grows with each call. When base case reached, returns propagate back up. Stack unwinds, combining results.",
      realWorldUse: "Tree traversals, recursive algorithms (quicksort, mergesort), file system traversal, mathematical computations, parsing nested structures.",
      commonMistakes: [
        "Missing or wrong base case (infinite recursion → StackOverflowError)",
        "Not progressing toward base case",
        "Too deep recursion (stack overflow for large inputs)",
        "Using recursion when iteration is simpler"
      ],
      interviewQuestions: [
        { question: "What is a base case in recursion?", answer: "A condition that stops the recursion. Without a base case, the method calls itself infinitely, causing StackOverflowError." },
        { question: "What happens if recursion has no base case?", answer: "Infinite recursion until the call stack overflows, causing StackOverflowError. The program crashes." }
      ],
      quickRevision: "Recursion = method calls itself. Must have base case. Each call moves toward base case. Can replace iteration.",
      practicePrompt: "Write a recursive method that prints numbers from n down to 1.",
      quickCheck: {
        question: "What is essential for a recursive method?",
        options: [
          "Return type must be int",
          "Must have a base case",
          "Cannot have parameters",
          "Must use loops"
        ],
        answer: 1,
        explanation: "A base case is essential. It stops the recursion. Without it, the method calls itself infinitely."
      }
    }
  },
  {
    slug: "base-case",
    title: "Base Case",
    content: {
      definition: "The base case is the condition that stops recursion. It's the simplest version of the problem that can be solved directly without further recursive calls.",
      whyItMatters: "Without a proper base case, recursion never stops, causing stack overflow. The base case defines when to stop recursing and start returning.",
      coreConcept: "Base case is the smallest problem - solved directly. Must be reachable through recursive calls. Usually checks for simple input (n=0, n=1, empty string, null). Some problems have multiple base cases.",
      syntax: "if (baseCaseCondition) {\n    return baseCaseValue;  // Direct solution\n}",
      javaExample: "// Factorial - single base case\npublic static int factorial(int n) {\n    if (n <= 1) {  // Base case\n        return 1;\n    }\n    return n * factorial(n - 1);\n}\n\n// Fibonacci - multiple base cases\npublic static int fibonacci(int n) {\n    if (n == 0) return 0;  // Base case 1\n    if (n == 1) return 1;  // Base case 2\n    return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\n// Sum of digits - base case when n < 10\npublic static int sumDigits(int n) {\n    if (n < 10) {  // Base case: single digit\n        return n;\n    }\n    return (n % 10) + sumDigits(n / 10);\n}\n\n// String length - base case when empty\npublic static int length(String s) {\n    if (s.isEmpty()) {  // Base case\n        return 0;\n    }\n    return 1 + length(s.substring(1));\n}",
      howItWorks: "Each recursive call should bring input closer to base case. Base case returns without recursion. Returns propagate up through the call stack.",
      realWorldUse: "Any recursive algorithm: tree traversal, binary search, divide and conquer, recursive mathematical functions, nested structure processing.",
      commonMistakes: [
        "Forgetting the base case",
        "Base case that's never reached",
        "Wrong base case condition",
        "Multiple base cases that conflict or miss cases"
      ],
      interviewQuestions: [
        { question: "How do you identify the base case?", answer: "Ask: what's the simplest version of this problem? What input can I solve directly? When should recursion stop?" },
        { question: "Can a recursive method have multiple base cases?", answer: "Yes. For example, Fibonacci has two base cases (n=0 and n=1). Some problems require multiple stopping conditions." }
      ],
      quickRevision: "Base case = stopping condition. Solve directly without recursion. Must be reachable. Can have multiple base cases.",
      practicePrompt: "What is the base case for recursively checking if a string is a palindrome?",
      quickCheck: {
        question: "What is the base case for factorial(n)?",
        options: [
          "n == 0",
          "n <= 1",
          "n > 0",
          "n == 1",
        ],
        answer: 1,
        explanation: "n <= 1 is the typical base case. factorial(0) = 1 and factorial(1) = 1. Both stop recursion."
      }
    }
  },
  {
    slug: "recursive-case",
    title: "Recursive Case",
    content: {
      definition: "The recursive case is where the method calls itself with a modified (usually smaller) input. It breaks the problem into a smaller sub-problem and combines the result.",
      whyItMatters: "The recursive case defines how the problem is divided and how results are combined. It must progress toward the base case.",
      coreConcept: "Break problem into smaller piece. Make recursive call. Combine result with current context. Must reduce problem size. Can have multiple recursive calls (like Fibonacci).",
      syntax: "if (baseCaseCondition) {\n    return baseCaseValue;\n}\n// Recursive case\nreturn combineCurrentWith(methodName(smallerInput));",
      javaExample: "// Power function: x^n\npublic static double power(double x, int n) {\n    if (n == 0) return 1;  // Base case\n    return x * power(x, n - 1);  // Recursive case\n}\n\n// Sum of array elements\npublic static int sumArray(int[] arr, int index) {\n    if (index >= arr.length) return 0;  // Base case\n    return arr[index] + sumArray(arr, index + 1);  // Recursive\n}\n\n// Reverse string\npublic static String reverse(String s) {\n    if (s.length() <= 1) return s;  // Base case\n    // Recursive: last char + reverse of rest\n    return s.charAt(s.length() - 1) + reverse(s.substring(0, s.length() - 1));\n}\n\n// Count occurrences\npublic static int countChar(String s, char c) {\n    if (s.isEmpty()) return 0;  // Base case\n    int count = (s.charAt(0) == c) ? 1 : 0;\n    return count + countChar(s.substring(1), c);  // Recursive\n}",
      howItWorks: "Recursive case: 1) Extract current piece, 2) Recursively solve smaller problem, 3) Combine current piece with recursive result. Progress toward base case with each call.",
      realWorldUse: "Divide and conquer algorithms, tree/graph traversal, nested data processing, mathematical computations, string processing.",
      commonMistakes: [
        "Not reducing problem size (infinite recursion)",
        "Wrong way of combining results",
        "Forgetting to use the recursive result",
        "Multiple recursive calls without understanding the complexity"
      ],
      interviewQuestions: [
        { question: "What should happen in the recursive case?", answer: "Make the problem smaller, make the recursive call, and combine the result with the current context to form the solution." },
        { question: "Why must each recursive call reduce the problem size?", answer: "To eventually reach the base case. If the problem doesn't get smaller, recursion never terminates, causing stack overflow." }
      ],
      quickRevision: "Recursive case: reduce problem, call recursively, combine result. Must progress to base case.",
      practicePrompt: "Write the recursive case for a method that counts how many times a digit appears in a number.",
      quickCheck: {
        question: "In the recursive case, what must happen to the input?",
        options: [
          "It stays the same",
          "It gets larger",
          "It gets smaller or closer to base case",
          "It gets doubled"
        ],
        answer: 2,
        explanation: "Each recursive call must work with smaller or simpler input, progressing toward the base case."
      }
    }
  },
  {
    slug: "basic-recursion-problems",
    title: "Basic Recursion Problems",
    content: {
      definition: "Basic recursion problems are fundamental patterns that teach recursive thinking: factorial, Fibonacci, sum, printing, searching, and simple calculations.",
      whyItMatters: "These problems build the foundation for understanding more complex recursive algorithms. They appear in interviews and help develop recursive problem-solving skills.",
      coreConcept: "Pattern: Identify base case, identify recursive case, make progress toward base case. Common problems: factorial, Fibonacci, sum/series, string operations, array processing.",
      syntax: "// Standard recursion template\nreturnType solve(Input input) {\n    if (isBaseCase(input)) return baseResult;\n    return combine(currentValue, solve(reducedInput));\n}",
      javaExample: "// 1. Sum from 1 to n\npublic static int sum(int n) {\n    if (n <= 0) return 0;\n    return n + sum(n - 1);\n}\n\n// 2. Fibonacci\npublic static int fib(int n) {\n    if (n <= 1) return n;\n    return fib(n - 1) + fib(n - 2);\n}\n\n// 3. Count digits\npublic static int countDigits(int n) {\n    if (n < 10) return 1;\n    return 1 + countDigits(n / 10);\n}\n\n// 4. Print 1 to n\npublic static void printIncreasing(int n) {\n    if (n == 0) return;\n    printIncreasing(n - 1);\n    System.out.print(n + \" \");\n}\n\n// 5. Check if array is sorted\npublic static boolean isSorted(int[] arr, int index) {\n    if (index >= arr.length - 1) return true;\n    if (arr[index] > arr[index + 1]) return false;\n    return isSorted(arr, index + 1);\n}\n\n// 6. Find max in array\npublic static int findMax(int[] arr, int index) {\n    if (index == arr.length - 1) return arr[index];\n    return Math.max(arr[index], findMax(arr, index + 1));\n}",
      howItWorks: "Each problem follows the same pattern: identify when to stop (base case), identify how to reduce problem (recursive case), identify how to combine results.",
      realWorldUse: "Tree traversal, divide and conquer algorithms, dynamic programming foundation, mathematical computations, nested structure processing.",
      commonMistakes: [
        "Not handling edge cases (negative, zero input)",
        "Inefficient recursion (Fibonacci recalculates many values)",
        "Stack overflow for large inputs",
        "Using recursion where iteration is more natural"
      ],
      interviewQuestions: [
        { question: "What's the time complexity of recursive Fibonacci?", answer: "O(2^n) exponential. It recalculates the same values many times. Can be optimized with memoization or use iteration." },
        { question: "When should you use recursion vs iteration?", answer: "Use recursion when the problem has a natural recursive structure (trees, nested data). Use iteration for simple loops or when stack depth is a concern." }
      ],
      quickRevision: "Base case + recursive case = recursion. Practice factorial, Fibonacci, sum, string/array problems.",
      practicePrompt: "Write a recursive method to calculate the sum of digits of a number.",
      quickCheck: {
        question: "For sum(3), how many recursive calls are made (including the initial call)?",
        options: [
          "1",
          "3",
          "4",
          "2"
        ],
        answer: 2,
        explanation: "sum(3) calls sum(2), which calls sum(1), which calls sum(0). Total: 4 calls (3, 2, 1, 0)."
      }
    }
  }
];
