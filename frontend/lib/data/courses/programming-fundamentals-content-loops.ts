// Module 6 - Loops & Pattern Basics (8 lessons)
import { CourseLessonContent } from './types';

export const loopsPatternLessons: Array<{
  slug: string;
  title: string;
  content: CourseLessonContent
}> = [
  {
    slug: "why-loops",
    title: "Why Loops?",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand sequential execution, variables, control flow branching (`if`/`else`), and arithmetic increment operators (`++`, `+=`)."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Loops are the Automation Engines of computing. Why do computers exist? Humans tire quickly and make errors when repeating tasks; computers can execute identical mathematical operations millions of times per second with 100% precision. Without loops, processing 10,000 bank accounts would require copy-pasting 10,000 identical lines of code—creating an unmaintainable codebase."
        },
        {
          type: "callout",
          title: "The 3 Fundamental Invariants of Every Loop",
          content: "Regardless of programming language or syntax, EVERY loop relies on three essential elements:\n1. **Initialization**: Setting up the starting state or counter variable before looping begins.\n2. **Termination Condition**: A boolean expression evaluated on each cycle. When `true`, loop continues; when `false`, loop terminates.\n3. **Update / Step**: Mutating the state on every iteration so the program moves closer to the termination condition.\n\n⚠️ If the update step is missing or faulty, the condition never becomes `false`, resulting in an **Infinite Loop** that freezes the CPU thread."
        },
        {
          type: "code",
          title: "The Problem: Manual Duplication vs Loop Automation",
          code: "// --- MANUAL REPETITION (Anti-pattern: rigid, bloated, unscalable) ---\nSystem.out.println(\"Student 1 score: \" + 85);\nSystem.out.println(\"Student 2 score: \" + 92);\nSystem.out.println(\"Student 3 score: \" + 78);\n// Imagine copy-pasting this 10,000 times!\n\n// --- LOOP AUTOMATION (Clean, dynamic, scalable) ---\nint[] scores = { 85, 92, 78, 90, 65, 88 };\n\nfor (int i = 0; i < scores.length; i++) {\n    // Single instruction processes any arbitrary dataset size!\n    System.out.println(\"Student \" + (i + 1) + \" score: \" + scores[i]);\n}",
          language: "java",
          explanation: "Loops decouple the volume of data being processed from the physical length of your source code."
        },
        {
          type: "text",
          title: "The Three Loop Archetypes in Java",
          content: "Java provides three distinct looping mechanisms tailored for specific programming scenarios:\n\n• `for` loop: Used for **Definite / Counted Iteration** where the number of steps or collection bounds are known in advance.\n• `while` loop: Used for **Indefinite / State-Driven Iteration** where execution continues until a dynamic condition or sentinel value is met.\n• `do-while` loop: Used for **Post-Tested Iteration** where the loop body must execute at least once (e.g. interactive user prompts)."
        },
        {
          type: "tryIt",
          title: "Try It: Predict Iteration Count",
          code: "int count = 0;\nfor (int step = 10; step <= 50; step += 10) {\n    count++;\n}\nSystem.out.println(\"Total loops: \" + count);",
          expectedOutput: "Total loops: 5",
          explanation: "The loop runs for step = 10, 20, 30, 40, 50 (5 iterations total)."
        },
        {
          type: "dryRun",
          title: "Loop Lifecycle State Trace",
          iterations: [
            { step: 1, variables: { "i": "1", "i <= 3": "true" }, description: "Init: i=1. Condition check passes. Executes body: prints 1." },
            { step: 2, variables: { "i": "2 (after i++)", "i <= 3": "true" }, description: "Update: i becomes 2. Condition check passes. Executes body: prints 2." },
            { step: 3, variables: { "i": "3 (after i++)", "i <= 3": "true" }, description: "Update: i becomes 3. Condition check passes. Executes body: prints 3." },
            { step: 4, variables: { "i": "4 (after i++)", "i <= 3": "false" }, description: "Update: i becomes 4. Condition check FAILS. Loop terminates immediately." }
          ]
        },
        {
          type: "warning",
          title: "Common Loop Pitfalls",
          items: [
            "**Off-by-One Errors (Fencepost Problem)**: Using `<` instead of `<=` (or starting at 1 vs 0), causing the loop to run 1 too many or 1 too few times.",
            "**Missing Update Step**: Forgetting to increment the loop variable in `while` loops, causing permanent thread hangs.",
            "**Modifying Loop Variable inside Body**: Mutating `i` both in the loop header and inside the loop body, causing unpredictable skip bugs."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Loop vs Recursion",
          traps: [
            {
              question: "What is the primary operational difference between a loop and recursion in Java?",
              trap: "Thinking they have identical memory overhead.",
              solution: "Loops execute iteratively within a single stack frame, using $O(1)$ constant stack memory. Recursion pushes a brand new stack frame onto the Call Stack for EVERY iteration. If recursion runs 10,000+ levels deep without tail-call optimization (which Java does not support), it will throw a `StackOverflowError`, whereas a loop can run billions of iterations safely."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "What are the three essential components required by every well-formed loop?",
          options: [
            "Class, Method, and Return",
            "Initialization, Termination Condition, and Update",
            "If, Else, and Break",
            "Try, Catch, and Finally"
          ],
          answer: 1,
          explanation: "Every loop requires Initialization (starting state), a Termination Condition (exit criteria), and an Update step (progress towards exit)."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Loops automate repetitive computational tasks with O(1) code size.",
            "Every loop must have: Initialization, Condition, and Update.",
            "Choose `for` for counted iterations, `while` for indeterminate conditions, and `do-while` for at-least-once execution."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we deep-dive into the for Loop, examining its 4-phase execution lifecycle, block scoping, and multi-variable headers."
        }
      ]
    }
  },
  {
    slug: "for-loop",
    title: "for Loop",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `why-loops`, increment/decrement operators (`++`, `--`), and relational comparisons (`<`, `<=`, `>`, `>=`)."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "The `for` loop is an Odometer / Fixed-Interval Stepper. When you know in advance how many times an operation should run (e.g. counting from 1 to 100, visiting every element in an array of size $N$, or counting down by 5s), the `for` loop packages the initialization, condition, and step update into a single, compact header line."
        },
        {
          type: "callout",
          title: "The 4-Phase Execution Lifecycle",
          content: "Syntax: `for (Phase 1: Init; Phase 2: Condition; Phase 4: Update) { Phase 3: Body }`\n\n1. **Phase 1 (Initialization)**: Executes EXACTLY ONCE when the loop is first encountered.\n2. **Phase 2 (Condition Evaluation)**: Evaluated BEFORE every iteration. If `false`, loop terminates immediately.\n3. **Phase 3 (Body Execution)**: All statements inside `{}` execute.\n4. **Phase 4 (Update Step)**: Executes AFTER the body finishes. Control then jumps directly back to **Phase 2**."
        },
        {
          type: "code",
          title: "Versatile for Loop Patterns in Practice",
          code: "// 1. STANDARD INCREMENT (Count 0 to 4)\nfor (int i = 0; i < 5; i++) {\n    System.out.print(i + \" \"); // 0 1 2 3 4\n}\nSystem.out.println();\n\n// 2. COUNTDOWN DECREMENT (10 down to 1)\nfor (int count = 10; count >= 1; count--) {\n    System.out.print(count + \" \"); // 10 9 8 7 6 5 4 3 2 1\n}\nSystem.out.println();\n\n// 3. CUSTOM STEP SIZE (Multiples of 5 up to 30)\nfor (int step = 0; step <= 30; step += 5) {\n    System.out.print(step + \" \"); // 0 5 10 15 20 25 30\n}\nSystem.out.println();\n\n// 4. MULTI-VARIABLE TWO-POINTER HEADER (Comma operator)\nfor (int left = 0, right = 10; left < right; left++, right--) {\n    System.out.println(\"left: \" + left + \", right: \" + right);\n}",
          language: "java",
          explanation: "The for loop header supports multiple variable declarations of the same type and multiple step expressions separated by commas."
        },
        {
          type: "text",
          title: "Loop Variable Scope & Optional Header Clauses",
          content: "Variables declared inside the `for` header have **block scope**—they exist only within the loop construct and are discarded once the loop ends:\n\n```java\nfor (int i = 0; i < 5; i++) { ... }\n// System.out.println(i); // COMPILE ERROR: 'i' cannot be resolved to a variable\n```\n\nAll three header clauses are optional:\n• `for (;;)` is valid Java syntax creating an **infinite loop** (equivalent to `while (true)`).\n• Initialization can occur outside the loop if the variable must outlive the loop."
        },
        {
          type: "tryIt",
          title: "Try It: Sum of First N Even Numbers",
          code: "int n = 5;\nint sum = 0;\nfor (int i = 1; i <= n; i++) {\n    sum += (2 * i);\n}\nSystem.out.println(\"Sum of first 5 evens: \" + sum);",
          expectedOutput: "Sum of first 5 evens: 30",
          explanation: "Calculates 2 + 4 + 6 + 8 + 10 = 30."
        },
        {
          type: "dryRun",
          title: "4-Phase Lifecycle Trace: for (int i=0; i<3; i++)",
          iterations: [
            { step: 1, variables: { "Phase 1": "int i = 0", "Phase 2 (i < 3)": "0 < 3 (true)" }, description: "Init runs once. Condition true -> executes body." },
            { step: 2, variables: { "Phase 3": "Body executes", "Phase 4": "i++ (i becomes 1)" }, description: "Body finishes. Update increments i to 1." },
            { step: 3, variables: { "Phase 2 (i < 3)": "1 < 3 (true)", "Phase 4": "i++ (i becomes 2)" }, description: "Condition true. Body runs. Update increments i to 2." },
            { step: 4, variables: { "Phase 2 (i < 3)": "2 < 3 (true)", "Phase 4": "i++ (i becomes 3)" }, description: "Condition true. Body runs. Update increments i to 3." },
            { step: 5, variables: { "Phase 2 (i < 3)": "3 < 3 (FALSE)", "Action": "Loop Exits" }, description: "Condition fails. Control jumps past the loop body." }
          ]
        },
        {
          type: "warning",
          title: "Common for Loop Mistakes",
          items: [
            "**Accidental Semicolon after Header**: `for (int i = 0; i < 5; i++); { ... }` runs an empty loop 5 times, then executes the `{}` block ONCE unconditionally.",
            "**Array Index Out of Bounds**: `for (int i = 0; i <= arr.length; i++)` causes `ArrayIndexOutOfBoundsException` at `i == arr.length` (use `< arr.length`).",
            "**Using Floating-Point Counters**: `for (double d = 0.0; d != 1.0; d += 0.1)` enters an infinite loop because IEEE 754 floating-point inaccuracies prevent `d` from ever equaling exactly `1.0`."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Unreachable Code in for Loops",
          traps: [
            {
              question: "Why does `for (int i=0; false; i++) { System.out.println(i); }` fail compilation?",
              trap: "Thinking the loop simply skips execution without error.",
              solution: "In Java, if the compiler can determine at compile time that a loop condition is constant `false`, the statements inside the body are marked as UNREACHABLE CODE, triggering a compile-time error: 'unreachable statement'."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "When does the update expression (e.g. `i++`) in a for loop execute?",
          options: [
            "Before the condition is checked",
            "At the very beginning of the loop cycle",
            "At the end of each iteration, after the body finishes",
            "Only when the loop terminates"
          ],
          answer: 2,
          explanation: "The update step executes strictly at the end of each iteration after the loop body has finished, just before re-checking the condition."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "for loop packages Init, Condition, and Update into a single compact header.",
            "Execution order: 1. Init -> 2. Condition -> 3. Body -> 4. Update -> repeat from 2.",
            "Variables declared in the header have block scope restricted to the loop.",
            "Never place a semicolon directly after the for header."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore the while Loop, ideal for indefinite, event-driven, and sentinel-controlled iterations."
        }
      ]
    }
  },
  {
    slug: "while-loop",
    title: "while Loop",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand boolean conditions, relational operators, and basic iteration concepts."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "The `while` loop is a Guarded Sentry Gate. It checks credentials *before* granting entry. You use a `while` loop when you do NOT know how many times the code needs to repeat beforehand—such as reading data until a network connection closes, finding the greatest common divisor of two numbers, or extracting digits until a number becomes 0."
        },
        {
          type: "callout",
          title: "Pre-Condition Testing Principle",
          content: "In a `while` loop, the boolean condition is evaluated **BEFORE** entering the body:\n• If the condition is `true`, the body executes, then loops back to re-evaluate.\n• If the condition is `false` initially, the loop body executes **ZERO times**.\n\n⚠️ State Invariant: Something inside the loop body MUST eventually mutate the variables involved in the condition, otherwise the loop runs forever."
        },
        {
          type: "code",
          title: "Classic while Loop Patterns: Digit Extraction & Sentinel Control",
          code: "// 1. DIGIT EXTRACTION / NUMBER REVERSAL (Indeterminate iteration)\nint number = 8492;\nint reversed = 0;\n\nwhile (number > 0) {\n    int lastDigit = number % 10;       // Extract rightmost digit\n    reversed = (reversed * 10) + lastDigit; // Shift and append\n    number = number / 10;              // Strip rightmost digit\n}\nSystem.out.println(\"Reversed: \" + reversed); // 2948\n\n// 2. SENTINEL VALUE PROCESSING\n// Simulating reading a stream of inputs until sentinel -1 is encountered\nint[] stream = { 15, 28, 42, 99, -1, 55, 77 };\nint idx = 0;\nint sum = 0;\n\nwhile (idx < stream.length && stream[idx] != -1) {\n    sum += stream[idx];\n    idx++;\n}\nSystem.out.println(\"Stream sum up to sentinel: \" + sum); // 184",
          language: "java",
          explanation: "Digit processing algorithms naturally fit while loops because the number of digits is state-dependent rather than a static pre-counted range."
        },
        {
          type: "text",
          title: "Mechanical Equivalence: for vs while",
          content: "Any `for` loop can be mechanically transformed into an equivalent `while` loop:\n\n```java\n// for loop\nfor (int i = 0; i < 5; i++) { System.out.println(i); }\n\n// Equivalent while loop\nint i = 0;              // 1. Initialization\nwhile (i < 5) {         // 2. Condition\n    System.out.println(i);\n    i++;                // 3. Update\n}\n```\n\nRule of Thumb: Use `for` when iterating over fixed ranges/indices; use `while` when looping depends on dynamic state, user input, or mathematical convergence."
        },
        {
          type: "tryIt",
          title: "Try It: Sum of Digits",
          code: "int num = 456;\nint sum = 0;\n\nwhile (num > 0) {\n    sum += (num % 10);\n    num /= 10;\n}\nSystem.out.println(\"Sum of digits: \" + sum);",
          expectedOutput: "Sum of digits: 15",
          explanation: "Extracts 6 (sum=6, num=45), 5 (sum=11, num=4), and 4 (sum=15, num=0). Loop terminates."
        },
        {
          type: "dryRun",
          title: "Digit Extraction Trace: while (n > 0) for n = 35",
          iterations: [
            { step: 1, variables: { "n": "35", "n > 0": "true" }, description: "Condition passes. digit = 35 % 10 = 5. n becomes 35 / 10 = 3." },
            { step: 2, variables: { "n": "3", "n > 0": "true" }, description: "Condition passes. digit = 3 % 10 = 3. n becomes 3 / 10 = 0." },
            { step: 3, variables: { "n": "0", "n > 0": "false" }, description: "Condition FAILS (0 > 0 is false). Loop exits immediately." }
          ]
        },
        {
          type: "warning",
          title: "Common while Loop Pitfalls",
          items: [
            "**The Semicolon Lock**: `while (count < 10); { count++; }` creates an infinite empty loop because the semicolon terminates the header.",
            "**Variable Leakage**: Unlike `for` loops, variables initialized before a `while` loop persist in the outer scope, potentially causing name collisions.",
            "**Missing State Progression**: Forgetting to update loop variables inside complex conditional branches within the while loop."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Sentinel & Zero-Execution Loops",
          traps: [
            {
              question: "How many times does this loop execute: int x = 10; while (x < 5) { x++; }?",
              trap: "Assuming it executes at least once.",
              solution: "Zero times! Because `while` is a pre-test loop, `10 < 5` evaluates to false immediately on entry, skipping the entire body."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "What is the minimum number of times a while loop body can execute?",
          options: [
            "0 times",
            "1 time",
            "2 times",
            "Infinite times"
          ],
          answer: 0,
          explanation: "If the condition evaluates to false on the very first check, the body executes 0 times."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "while loops evaluate their condition before each iteration (pre-test loop).",
            "Can execute 0 times if condition is initially false.",
            "Ideal for indeterminate iteration, digit manipulation, and sentinel checks.",
            "Ensure the body updates state to avoid infinite loops."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore the do-while Loop, where code is guaranteed to execute at least once before testing the condition."
        }
      ]
    }
  },
  {
    slug: "do-while-loop",
    title: "do-while Loop",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `while` loops, boolean expressions, and user input/menu logic."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "The `do-while` loop is a 'Try First, Ask Later' / Post-Test Gate. Unlike `while` (which checks your ticket before letting you ride), a `do-while` loop lets you ride once first, and only checks if you want/qualify to ride again *after* the ride finishes."
        },
        {
          type: "callout",
          title: "Post-Condition Testing Principle",
          content: "In a `do-while` loop, the boolean condition is evaluated **AFTER** executing the body:\n• The loop body is **GUARANTEED to execute at least 1 time**, even if the condition is `false` from the beginning.\n• Syntax Requirement: The trailing semicolon `while (condition);` is **MANDATORY** in Java grammar."
        },
        {
          type: "code",
          title: "Interactive CLI Menu & Input Validation Pattern",
          code: "// --- 1. ROBUST INPUT VALIDATION (At least one prompt required) ---\n// Simulating user input validation\nint userInput = -5;\nint promptCount = 0;\n\ndo {\n    promptCount++;\n    System.out.println(\"Prompt \" + promptCount + \": Please enter a positive number.\");\n    // Simulate user correcting input on prompt 3\n    if (promptCount == 3) userInput = 42;\n} while (userInput <= 0);\n\nSystem.out.println(\"Accepted valid input: \" + userInput); // Accepted: 42\n\n// --- 2. SCOPE OF CONDITION VARIABLE TRAP ---\n// Variables tested in 'while()' MUST be declared BEFORE the 'do' block!\nint choice;\ndo {\n    choice = 2; // Menu action: 2 = Exit\n    System.out.println(\"Executing selected menu option: \" + choice);\n} while (choice != 2);\nSystem.out.println(\"Program exited gracefully.\");",
          language: "java",
          explanation: "Input validation and menu systems naturally require running the prompt at least once before knowing whether to re-prompt."
        },
        {
          type: "text",
          title: "The Variable Scoping Trap in do-while",
          content: "A common beginner error is declaring the loop variable inside the `do` block:\n\n```java\n// COMPILE ERROR: Scope violation\ndo {\n    int option = readOption(); // Declared inside local block scope\n} while (option != 0); // ERROR: 'option' is not visible outside the braces!\n\n// CORRECT PATTERN:\nint option;\ndo {\n    option = readOption();\n} while (option != 0); // Valid: 'option' is in scope!\n```"
        },
        {
          type: "tryIt",
          title: "Try It: Post-Test Execution Guarantee",
          code: "int val = 100;\ndo {\n    System.out.println(\"Executes even though condition is false: \" + val);\n    val++;\n} while (val < 50);\nSystem.out.println(\"Loop finished.\");",
          expectedOutput: "Executes even though condition is false: 100\nLoop finished.",
          explanation: "Even though 100 is not < 50, the body runs once before the condition is checked."
        },
        {
          type: "dryRun",
          title: "do-while Post-Condition Trace: False Condition on Startup",
          iterations: [
            { step: 1, variables: { "val": "100" }, description: "Enters do body unconditionally." },
            { step: 2, variables: { "output": "\"Executes: 100\"", "val": "101" }, description: "Prints output and increments val to 101." },
            { step: 3, variables: { "eval": "val < 50 (101 < 50 = FALSE)" }, description: "Condition evaluates to false." },
            { step: 4, variables: { "action": "Loop Terminates" }, description: "Control continues past the loop after exactly 1 iteration." }
          ]
        },
        {
          type: "warning",
          title: "Common do-while Mistakes",
          items: [
            "**Omitting the Trailing Semicolon**: `do { ... } while (cond)` without a semicolon `;` is a compile error.",
            "**Declaring Variables inside the `do` Block**: The `while(...)` condition cannot access variables declared inside the `{}` body.",
            "**Using do-while when 0 iterations may be required**: If processing an empty collection or null stream, `do-while` will attempt to process the first element and potentially crash with a `NullPointerException`."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Comparison of Minimum Loop Iterations",
          traps: [
            {
              question: "What are the minimum possible execution counts for `for`, `while`, and `do-while` loops in Java?",
              trap: "Confusing `while` and `do-while` minimums.",
              solution: "• `for` loop: Minimum = 0\n• `while` loop: Minimum = 0\n• `do-while` loop: Minimum = 1 (Guaranteed at least one execution because the condition check is deferred until after the body completes)."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Why is a do-while loop preferred over a while loop for interactive CLI menus?",
          options: [
            "It runs faster in the JVM",
            "The menu must be displayed to the user at least once before checking their selection",
            "It does not require boolean conditions",
            "It allows multiple exit points"
          ],
          answer: 1,
          explanation: "CLI menus require rendering options to the user at least once before evaluating whether they chose to exit."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "do-while guarantees at least ONE execution of the loop body (post-test loop).",
            "Must terminate with a semicolon: `while (condition);`.",
            "Variables used in the condition must be declared outside the do block.",
            "Ideal for menus, input re-prompts, and retry loops."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Nested Loops, analyzing 2D grid iteration, multiplication tables, and time complexity calculations."
        }
      ]
    }
  },
  {
    slug: "nested-loops",
    title: "Nested Loops",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `for` and `while` loops, 2D Cartesian coordinates $(x, y)$, and basic time complexity intuition."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Nested loops are like the Hands of a Clock (Hour Hand vs Minute Hand). For every single tick/advance the slow Hour Hand makes (the outer loop), the fast Minute Hand must complete a full 360-degree rotation of 60 ticks (the inner loop). The inner loop starts over from the beginning on every single iteration of the outer loop."
        },
        {
          type: "callout",
          title: "The Multiplicative Iteration Rule",
          content: "If an outer loop runs $N$ times and its inner loop runs $M$ times, the statements inside the inner loop execute a total of:\n$$\\text{Total Operations} = N \\times M$$\n\n• For quadratic loops ($N = M$): Runs $N^2$ times ($O(N^2)$ time complexity).\n• For 3 nested loops of size $N$: Runs $N^3$ times ($O(N^3)$ cubic complexity)."
        },
        {
          type: "code",
          title: "2D Matrix Traversal & Multiplication Tables",
          code: "// --- 1. MULTIPLICATION TABLE GRID (3x3) ---\nfor (int row = 1; row <= 3; row++) {\n    for (int col = 1; col <= 3; col++) {\n        // Inner loop runs to completion for each outer row step\n        System.out.printf(\"%2d \", (row * col));\n    }\n    System.out.println(); // Newline after each complete row\n}\n/* Output:\n 1  2  3 \n 2  4  6 \n 3  6  9 \n*/\n\n// --- 2. 2D ARRAY / MATRIX TRAVERSAL ---\nint[][] matrix = {\n    { 10, 20, 30 },\n    { 40, 50, 60 }\n};\n\nfor (int r = 0; r < matrix.length; r++) {           // Rows: 0 to 1\n    for (int c = 0; c < matrix[r].length; c++) {    // Cols: 0 to 2\n        System.out.print(\"[\" + r + \",\" + c + \"]=\" + matrix[r][c] + \" \");\n    }\n    System.out.println();\n}",
          language: "java",
          explanation: "The outer loop controls vertical row progression, while the inner loop scans horizontally across columns."
        },
        {
          type: "text",
          title: "Independent vs Dependent Nested Loops",
          content: "• **Independent Inner Loops**: The inner loop bounds are constant and do not depend on the outer variable (e.g. `for(int j=0; j<M; j++)`). Total work = $N \\times M$.\n• **Dependent Inner Loops**: The inner loop bound varies based on the current outer variable `i` (e.g. `for(int j=0; j<=i; j++)`). Total operations form an arithmetic series: $1 + 2 + 3 + \\dots + N = \\frac{N(N+1)}{2} \\approx \\frac{N^2}{2}$, which is still $O(N^2)$ time complexity."
        },
        {
          type: "tryIt",
          title: "Try It: Coordinate Pair Generator",
          code: "for (int x = 1; x <= 2; x++) {\n    for (int y = 1; y <= 3; y++) {\n        System.out.print(\"(\" + x + \",\" + y + \") \");\n    }\n}",
          expectedOutput: "(1,1) (1,2) (1,3) (2,1) (2,2) (2,3) ",
          explanation: "Outer x=1 pairs with y=1,2,3. Then x=2 pairs with y=1,2,3."
        },
        {
          type: "dryRun",
          title: "Nested Iteration Trace: 2 Rows x 2 Columns",
          iterations: [
            { step: 1, variables: { "row": "1", "col": "1" }, description: "Outer row 1 starts. Inner col 1 runs -> prints (1,1)." },
            { step: 2, variables: { "row": "1", "col": "2" }, description: "Outer row 1 continues. Inner col 2 runs -> prints (1,2). Inner loop ends." },
            { step: 3, variables: { "row": "2", "col": "1" }, description: "Outer row 2 starts. Inner col resets to 1 -> prints (2,1)." },
            { step: 4, variables: { "row": "2", "col": "2" }, description: "Outer row 2 continues. Inner col 2 runs -> prints (2,2). All loops finish." }
          ]
        },
        {
          type: "warning",
          title: "Common Nested Loop Pitfalls",
          items: [
            "**Variable Name Shadowing / Re-use**: Accidentally using `i` for both outer and inner loops, corrupting the loop counter.",
            "**Forgetting Newline between Rows**: Printing all elements on a single unreadable line by omitting `System.out.println()` after the inner loop.",
            "**Unintentional Complexity Explosions**: Nesting 3 or 4 loops over large collections ($1000^3 = 10^9$ operations), freezing the application."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Triangular Loop Complexity",
          traps: [
            {
              question: "What is the time complexity of: for(int i=0; i<n; i++) for(int j=0; j<=i; j++) { sum++; }?",
              trap: "Thinking it is O(N) because the inner loop only goes up to i.",
              solution: "It is $O(N^2)$! The number of inner iterations is $1 + 2 + 3 + \\dots + n = \\frac{n(n+1)}{2} = \\frac{n^2 + n}{2}$. Dropping lower-order terms and constants yields $O(N^2)$ quadratic time complexity."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "If an outer loop runs 5 times and an inner loop runs 4 times per outer iteration, how many total times does the inner loop body execute?",
          options: [
            "9 times",
            "20 times",
            "25 times",
            "16 times"
          ],
          answer: 1,
          explanation: "Total executions = Outer count × Inner count = 5 × 4 = 20."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Inner loops complete their entire lifecycle for every single tick of the outer loop.",
            "Total iterations equal the product of outer and inner loop counts ($N \\times M$).",
            "Essential for 2D matrix manipulation, image processing, and pattern printing.",
            "Use distinct, descriptive variable names (e.g., `row` and `col`)."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore break & continue in Loops, mastering labeled jumps and early termination across multi-level nested loops."
        }
      ]
    }
  },
  {
    slug: "break-continue-loops",
    title: "break & continue in Loops",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand single and nested `for`/`while` loops, and basic jump statement mechanics."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of `break` and `continue` as precision flight controls for loops:\n• `break` is the **Emergency Ejection Seat**: It aborts the entire flight mission immediately and lands outside the loop.\n• `continue` is the **Skip Waypoint Thruster**: It abandons the current waypoint coordinates and flies directly to the next scheduled flight path."
        },
        {
          type: "callout",
          title: "The Innermost Enclosure Rule vs Labeled Controls",
          content: "By default, `break` and `continue` apply STRICTLY to the **innermost** enclosing loop.\n\nTo control an outer loop from deep within an inner loop, Java provides **Labeled Statements**:\n```java\nouterLoop:\nfor (...) {\n    for (...) {\n        if (condition) break outerLoop;    // Aborts BOTH loops!\n        if (skipRow) continue outerLoop;  // Advances outer loop immediately\n    }\n}\n```"
        },
        {
          type: "code",
          title: "Search Optimization with Labeled break and continue",
          code: "// --- 1. LABELED BREAK: 2D GRID SEARCH OPTIMIZATION ---\nint[][] grid = {\n    { 12, 45, 78 },\n    { 33, 99, 21 },\n    { 54, 88, 67 }\n};\nint target = 99;\nboolean found = false;\n\ngridSearch: // Label\nfor (int r = 0; r < grid.length; r++) {\n    for (int c = 0; c < grid[r].length; c++) {\n        if (grid[r][c] == target) {\n            found = true;\n            System.out.println(\"Found target at row=\" + r + \", col=\" + c);\n            break gridSearch; // Instantly escapes BOTH loops!\n        }\n    }\n}\n\n// --- 2. LABELED CONTINUE: SKIPPING ENTIRE ROWS ---\nrowProcessor:\nfor (int row = 1; row <= 3; row++) {\n    for (int col = 1; col <= 3; col++) {\n        if (row == 2) {\n            System.out.println(\"Skipping remaining cells in row 2\");\n            continue rowProcessor; // Jumps directly to row++ in outer loop!\n        }\n        System.out.println(\"Cell: (\" + row + \",\" + col + \")\");\n    }\n}",
          language: "java",
          explanation: "Labeled breaks avoid the need to maintain cumbersome boolean flags (`boolean stopAll = true`) across multiple nested levels."
        },
        {
          type: "text",
          title: "Performance Benefits of Early Search Aborts",
          content: "In a dataset with $1,000,000$ elements, searching for a key that appears at index $5$ takes:\n• Without `break`: $1,000,000$ iterations (wasteful CPU burn).\n• With `break`: Exactly $6$ iterations (99.9994% reduction in CPU time!)."
        },
        {
          type: "tryIt",
          title: "Try It: Filter & Early Stop",
          code: "for (int i = 1; i <= 10; i++) {\n    if (i % 2 == 0) continue; // Skip evens\n    if (i > 7) break;         // Stop after 7\n    System.out.print(i + \" \");\n}",
          expectedOutput: "1 3 5 7 ",
          explanation: "Prints odd numbers 1, 3, 5, 7. When i reaches 9 (> 7), break terminates the loop before printing."
        },
        {
          type: "dryRun",
          title: "Labeled Break Execution Trace",
          iterations: [
            { step: 1, variables: { "r": "0", "c": "0", "grid[0][0]": "12" }, description: "No match. Continues inner loop." },
            { step: 2, variables: { "r": "1", "c": "1", "grid[1][1]": "99" }, description: "Match found! 'break gridSearch' executed." },
            { step: 3, variables: { "execution": "Control transfers past outer loop" }, description: "Both inner and outer loops terminate in a single step." }
          ]
        },
        {
          type: "warning",
          title: "Common Pitfalls with Loop Jumps",
          items: [
            "Placing labels on statements that are not loops (labels can only be applied to blocks or loops).",
            "Using `continue` inside a `while` loop without incrementing the counter variable first (causes infinite loop).",
            "Overusing labeled breaks instead of decomposing complex nested code into small, focused helper methods with `return` statements."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: break vs return in Nested Loops",
          traps: [
            {
              question: "When should you use a labeled break vs extracting the loops into a method and using 'return'?",
              trap: "Assuming labeled break is always the preferred clean code approach.",
              solution: "Modern clean coding standards generally recommend extracting deeply nested search loops into a dedicated helper method (e.g. `findCoordinates()`) and using `return new Point(r, c);`. Labeled break is useful for localized algorithmic scripts, but helper methods with returns provide cleaner abstraction."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "In a 2-level nested loop without labels, what happens when 'continue' executes inside the inner loop?",
          options: [
            "It skips to the next iteration of the outer loop",
            "It skips the rest of the inner loop body and advances the inner loop",
            "It terminates both loops",
            "It restarts the outer loop from zero"
          ],
          answer: 1,
          explanation: "An unlabeled continue applies strictly to the innermost loop, advancing its iteration."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "break halts execution immediately; continue skips to the next iteration.",
            "Unlabeled jump statements affect strictly the innermost enclosing loop.",
            "Labeled break/continue allows surgical multi-level navigation.",
            "Early termination via break transforms O(N) worst-case into O(1) best-case for searches."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we master Counting & Accumulation Patterns, learning the algorithmic blueprints for totals, frequencies, products, and averages."
        }
      ]
    }
  },
  {
    slug: "counting-accumulation-patterns",
    title: "Counting & Accumulation Patterns",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand loops (`for`/`while`), compound assignment operators (`+=`, `*=`), and primitive data types."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of these two patterns as Turnstile Clickers vs Cash Register Drawers:\n• **Counter Pattern (Clicker)**: Starts at $0$. Whenever an event of interest occurs (e.g., encountering a negative number or passing a test), you click `count++`.\n• **Accumulator Pattern (Cash Register)**: Starts with a neutral identity value ($0$ for additions, $1$ for multiplications). Every incoming item is absorbed into the running total: `sum += item` or `product *= item`."
        },
        {
          type: "callout",
          title: "The Identity Value Invariants",
          content: "Choosing the correct initial value before the loop begins is critical:\n• **Summation Accumulator**: Start at `0` (Additive Identity: $x + 0 = x$).\n• **Product Accumulator**: Start at `1` (Multiplicative Identity: $x \\times 1 = x$. Starting at 0 makes everything 0!).\n• **Minimum Finder**: Start at `Integer.MAX_VALUE` (or array's first element).\n• **Maximum Finder**: Start at `Integer.MIN_VALUE` (or array's first element)."
        },
        {
          type: "code",
          title: "The 4 Core Accumulation Blueprints in Practice",
          code: "int[] data = { 14, 25, -8, 42, 19, -3, 50 };\n\n// 1. COUNTER: Count negative values\nint negativeCount = 0;\nfor (int val : data) {\n    if (val < 0) negativeCount++;\n}\nSystem.out.println(\"Negative count: \" + negativeCount); // 2\n\n// 2. SUMMATION & AVERAGE (Watch for integer truncation!)\nlong sum = 0L; // Use long to prevent integer overflow\nfor (int val : data) {\n    sum += val;\n}\ndouble average = (double) sum / data.length; // Explicit cast for floating-point division\nSystem.out.printf(\"Sum: %d, Average: %.2f%n\", sum, average);\n\n// 3. MIN / MAX TRACKER\nint min = Integer.MAX_VALUE;\nint max = Integer.MIN_VALUE;\nfor (int val : data) {\n    if (val < min) min = val;\n    if (val > max) max = val;\n}\nSystem.out.println(\"Min: \" + min + \", Max: \" + max); // Min: -8, Max: 50\n\n// 4. PRODUCT ACCUMULATOR (Factorial of 5)\nint n = 5;\nlong factorial = 1L; // Multiplicative identity = 1\nfor (int i = 1; i <= n; i++) {\n    factorial *= i;\n}\nSystem.out.println(\"5! = \" + factorial); // 120",
          language: "java",
          explanation: "These four patterns form the algorithmic building blocks for data aggregations, statistics, and business calculations."
        },
        {
          type: "text",
          title: "The Reset Trap in Nested Accumulators",
          content: "When calculating totals across multiple sub-groups (like summing each individual row of a 2D matrix), the accumulator MUST be reset to `0` inside the outer loop:\n\n```java\nint[][] matrix = { {1, 2}, {3, 4} };\n\nfor (int r = 0; r < matrix.length; r++) {\n    int rowSum = 0; // MUST reset for every new row!\n    for (int c = 0; c < matrix[r].length; c++) {\n        rowSum += matrix[r][c];\n    }\n    System.out.println(\"Row \" + r + \" sum: \" + rowSum);\n}\n```"
        },
        {
          type: "tryIt",
          title: "Try It: Count Multiples of 5",
          code: "int[] nums = { 10, 12, 15, 22, 25, 30 };\nint count = 0;\nfor (int num : nums) {\n    if (num % 5 == 0) {\n        count++;\n    }\n}\nSystem.out.println(\"Multiples of 5: \" + count);",
          expectedOutput: "Multiples of 5: 4",
          explanation: "10, 15, 25, and 30 are divisible by 5, giving a count of 4."
        },
        {
          type: "dryRun",
          title: "Accumulator Running State Trace: Sum of [10, 20, 30]",
          iterations: [
            { step: 1, variables: { "sum": "0", "num": "10" }, description: "sum becomes 0 + 10 = 10." },
            { step: 2, variables: { "sum": "10", "num": "20" }, description: "sum becomes 10 + 20 = 30." },
            { step: 3, variables: { "sum": "30", "num": "30" }, description: "sum becomes 30 + 30 = 60." },
            { step: 4, variables: { "final result": "60" }, description: "Loop terminates; 60 available for downstream processing." }
          ]
        },
        {
          type: "warning",
          title: "Common Accumulator Mistakes",
          items: [
            "**Initializing Product to 0**: Setting `int product = 0;` causes the result to remain `0` forever.",
            "**Integer Division in Averages**: Writing `double avg = sum / count;` where both are integers truncates decimals (e.g. `7 / 2` yields `3.0` instead of `3.5`).",
            "**Integer Overflow**: Summing many large integers exceeds `2,147,483,647`, silently wrapping to negative numbers (use `long`)."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Division by Zero on Empty Datasets",
          traps: [
            {
              question: "What happens when calculating the average of an empty array: int[] arr = {}; double avg = (double) sum / arr.length;?",
              trap: "Assuming it returns 0.0.",
              solution: "Because `arr.length` is 0 and double division by zero is defined in IEEE 754, `0.0 / 0` results in `Double.NaN` (Not a Number)! In production code, always guard with `if (arr.length == 0) return 0.0;`."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "What should a product accumulator variable be initialized to?",
          options: [
            "0",
            "1",
            "-1",
            "Integer.MAX_VALUE"
          ],
          answer: 1,
          explanation: "A product accumulator must start at 1 (the multiplicative identity). Starting at 0 would multiply everything by 0."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Counters tally events (`count++`); Accumulators aggregate values (`sum += val`).",
            "Initialize sum to 0, product to 1, min to MAX_VALUE, max to MIN_VALUE.",
            "Cast to double before division to preserve decimal precision in averages.",
            "Reset nested accumulators inside outer loops."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Basic Pattern Problems, combining nested loops, spaces, and math formulas to print geometric star and number grids."
        }
      ]
    }
  },
  {
    slug: "basic-pattern-problems",
    title: "Basic Pattern Problems",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand nested loops, row-by-row iteration, and `System.out.print()` vs `System.out.println()`."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Pattern printing is like a Dot Matrix / CRT Printer. The printer print head sweeps horizontally across Row 1 character by character (using `System.out.print()`). When the row ends, it issues a carriage return newline (`System.out.println()`) to drop down to Row 2. You can NEVER jump backwards to an earlier row or column."
        },
        {
          type: "callout",
          title: "The 4-Step Universal Pattern Formula",
          content: "Every geometric pattern can be solved using this standard structure:\n1. **Outer Loop**: Controls the row number `r` (typically `1` to `N`).\n2. **Inner Loop 1 (Leading Spaces)**: Prints spaces for right-aligned or symmetric pyramid shapes.\n3. **Inner Loop 2 (Symbols/Numbers)**: Prints characters based on a formula relating current row `r` to column `c`.\n4. **Row Terminator**: Execute `System.out.println()` after all inner loops finish to begin the next line."
        },
        {
          type: "code",
          title: "Classic Geometries: Triangle, Inverted, and Centered Pyramid",
          code: "int n = 4;\n\n// --- 1. RIGHT-ANGLED STAR TRIANGLE ---\n// Row r has exactly r stars\nSystem.out.println(\"--- Right-Angled Triangle ---\");\nfor (int r = 1; r <= n; r++) {\n    for (int c = 1; c <= r; c++) {\n        System.out.print(\"* \");\n    }\n    System.out.println();\n}\n\n// --- 2. INVERTED STAR TRIANGLE ---\n// Row r has (n - r + 1) stars\nSystem.out.println(\"--- Inverted Triangle ---\");\nfor (int r = 1; r <= n; r++) {\n    for (int c = 1; c <= (n - r + 1); c++) {\n        System.out.print(\"* \");\n    }\n    System.out.println();\n}\n\n// --- 3. CENTERED PYRAMID (Spaces + Stars) ---\n// Spaces = (n - r), Stars = (2r - 1)\nSystem.out.println(\"--- Centered Pyramid ---\");\nfor (int r = 1; r <= n; r++) {\n    for (int s = 1; s <= (n - r); s++) {\n        System.out.print(\"  \"); // 2 spaces for alignment\n    }\n    for (int star = 1; star <= (2 * r - 1); star++) {\n        System.out.print(\"* \");\n    }\n    System.out.println();\n}",
          language: "java",
          explanation: "Analyzing the mathematical relationship between the row index 'r' and the column counts (stars & spaces) unlocks any 2D pattern."
        },
        {
          type: "text",
          title: "Number Patterns: Floyd's Triangle & Binary Alternating Triangles",
          content: "Number patterns substitute mathematical formulas for star characters:\n\n```java\n// FLOYD'S TRIANGLE (Sequential natural numbers)\nint count = 1;\nfor (int r = 1; r <= 3; r++) {\n    for (int c = 1; c <= r; c++) {\n        System.out.print(count++ + \" \");\n    }\n    System.out.println();\n}\n/* Output:\n1 \n2 3 \n4 5 6 \n*/\n\n// BINARY ALTERNATING TRIANGLE (Parity check: (r + c) % 2)\nfor (int r = 1; r <= 3; r++) {\n    for (int c = 1; c <= r; c++) {\n        System.out.print(((r + c) % 2 == 0 ? \"1 \" : \"0 \"));\n    }\n    System.out.println();\n}\n```"
        },
        {
          type: "tryIt",
          title: "Try It: Number Repeater Triangle",
          code: "for (int r = 1; r <= 3; r++) {\n    for (int c = 1; c <= r; c++) {\n        System.out.print(r);\n    }\n    System.out.println();\n}",
          expectedOutput: "1\n22\n333",
          explanation: "Row 1 prints '1', Row 2 prints '22', Row 3 prints '333'."
        },
        {
          type: "dryRun",
          title: "Pattern Matrix Dry Run: Centered Pyramid n = 3",
          iterations: [
            { step: 1, variables: { "r": "1", "spaces (3-1)": "2", "stars (2*1-1)": "1" }, description: "Prints '    * ' and newline." },
            { step: 2, variables: { "r": "2", "spaces (3-2)": "1", "stars (2*2-1)": "3" }, description: "Prints '  * * * ' and newline." },
            { step: 3, variables: { "r": "3", "spaces (3-3)": "0", "stars (2*3-1)": "5" }, description: "Prints '* * * * * ' and newline." }
          ]
        },
        {
          type: "warning",
          title: "Common Pattern Mistakes",
          items: [
            "**Accidental `println()` in Inner Loop**: Using `println` instead of `print` inside the inner loop breaks the shape into a vertical line.",
            "**Forgetting Outer Loop `println()`**: All rows print on a single continuous horizontal line.",
            "**Space Width Mismatch**: Using 1 space for padding when star characters are printed with trailing spaces (`* ` requires `  ` 2 spaces)."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Diamond Pattern Symmetry",
          traps: [
            {
              question: "How do you construct a symmetrical diamond pattern of size N without duplicating code?",
              trap: "Attempting to create complex condition formulas inside a single inner loop.",
              solution: "Deconstruct the diamond into two distinct halves: Top Pyramid (rows 1 to N) followed by Bottom Inverted Pyramid (rows N-1 down to 1). This separation makes loop bounds trivial and avoids error-prone conditional branching inside inner loops."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "For a right-angled triangle of height N, how many stars are printed in row index r (1-indexed)?",
          options: [
            "N stars",
            "r stars",
            "2r - 1 stars",
            "N - r stars"
          ],
          answer: 1,
          explanation: "In a standard right-angled triangle, row 1 has 1 star, row 2 has 2 stars, ..., and row r has exactly r stars."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Outer loop controls rows; inner loops control spaces and characters.",
            "Use `System.out.print()` inside inner loops, and `System.out.println()` after each row.",
            "Derive algebraic formulas relating row index `r` to column counts.",
            "Pattern problems build essential muscle memory for nested coordinate traversals in DSA."
          ]
        },
        {
          type: "text",
          title: "Module 6 Complete",
          content: "Congratulations! You have mastered Loops, Accumulators, Nested Traversals, and Pattern Geometries. In Module 7, we explore 1D and 2D Arrays, Contiguous Heap Memory, and Array Manipulation Algorithms."
        }
      ]
    }
  }
];

