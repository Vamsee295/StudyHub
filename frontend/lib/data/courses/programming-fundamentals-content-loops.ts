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
      definition: "Loops are control structures that repeat a block of code multiple times. They eliminate the need to write repetitive code manually.",
      whyItMatters: "Without loops, you'd have to write the same code multiple times for repetitive tasks. Loops make programs efficient, maintainable, and capable of handling variable amounts of data.",
      coreConcept: "A loop has three parts: initialization, condition, and update. While the condition is true, the loop body executes. When false, the loop stops.",
      syntax: "// Three types of loops in Java:\nfor (init; condition; update) { }\nwhile (condition) { }\ndo { } while (condition);",
      javaExample: "// Without loop - repetitive\nSystem.out.println(1);\nSystem.out.println(2);\nSystem.out.println(3);\n\n// With loop - efficient\nfor (int i = 1; i <= 3; i++) {\n    System.out.println(i);\n}",
      howItWorks: "1. Initialize loop variable\n2. Check condition\n3. If true, execute body\n4. Update variable\n5. Repeat from step 2 until condition is false",
      realWorldUse: "Processing arrays, reading files line by line, validation loops, game loops, menu systems, batch processing, generating sequences.",
      commonMistakes: [
        "Off-by-one errors (starting at 0 vs 1)",
        "Infinite loops from never-false conditions",
        "Wrong loop type for the task",
        "Not updating loop variable correctly"
      ],
      interviewQuestions: [
        { question: "What are the three types of loops in Java?", answer: "for loop (known iterations), while loop (condition-based), do-while loop (runs at least once)." },
        { question: "When would you use a loop?", answer: "Use loops when you need to repeat code: processing arrays, validation, counting, generating sequences, or any repetitive task." }
      ],
      quickRevision: "Loops repeat code. Three types: for, while, do-while. Have initialization, condition, update.",
      practicePrompt: "Explain what would happen if you tried to print numbers 1-100 without a loop.",
      quickCheck: {
        question: "What is the main benefit of using a loop?",
        options: [
          "Makes code run faster",
          "Repeats code without writing it multiple times",
          "Reduces memory usage",
          "Handles exceptions"
        ],
        answer: 1,
        explanation: "Loops allow you to repeat code execution without manually writing the same statements multiple times, making code more efficient and maintainable."
      }
    }
  },
  {
    slug: "for-loop",
    title: "for Loop",
    content: {
      definition: "The for loop is used when the number of iterations is known. It combines initialization, condition, and update in a single line.",
      whyItMatters: "for loops are the most common loop for counted iterations—perfect for array processing, counting, and known ranges.",
      coreConcept: "Syntax: for (init; condition; update) { }. Init runs once at start. Condition is checked before each iteration. Update runs after each iteration. All three are optional.",
      syntax: "for (initialization; condition; update) {\n    // code to repeat\n}",
      javaExample: "// Count 1 to 5\nfor (int i = 1; i <= 5; i++) {\n    System.out.println(i);\n}\n\n// Count down\nfor (int i = 5; i >= 1; i--) {\n    System.out.println(i);\n}\n\n// Process array\nint[] nums = {10, 20, 30};\nfor (int i = 0; i < nums.length; i++) {\n    System.out.println(nums[i]);\n}",
      howItWorks: "1. Execute initialization (int i = 0) - once\n2. Check condition (i < 5) - before each iteration\n3. If true, execute loop body\n4. Execute update (i++) - after each iteration\n5. Repeat steps 2-4 until condition is false",
      realWorldUse: "Array processing, string character iteration, generating sequences, timed operations, grid processing (nested for loops), file processing.",
      commonMistakes: [
        "Off-by-one errors (< vs <=)",
        "Using wrong comparison in condition",
        "Modifying loop variable inside body",
        "Forgetting semicolons in for statement"
      ],
      interviewQuestions: [
        { question: "What is the output of: for (int i = 0; i < 3; i++) { System.out.print(i); }", answer: "012. The loop starts at 0, prints 0, 1, 2, then stops when i becomes 3 (not < 3)." },
        { question: "Can you omit parts of a for loop?", answer: "Yes, all three parts are optional. for (;;) { } is an infinite loop. You can omit init, condition, or update as needed." }
      ],
      quickRevision: "for (init; condition; update) { }. Use when iterations are known. Most common loop for arrays.",
      practicePrompt: "Write a for loop that prints even numbers from 2 to 10.",
      quickCheck: {
        question: "How many times does this loop execute?\nfor (int i = 0; i < 5; i++) { }",
        options: ["4", "5", "6", "Infinite"],
        answer: 1,
        explanation: "The loop runs for i = 0, 1, 2, 3, 4 (5 times). It stops when i = 5 because 5 < 5 is false."
      }
    }
  },
  {
    slug: "while-loop",
    title: "while Loop",
    content: {
      definition: "The while loop repeats as long as a condition is true. The condition is checked before each iteration. Use while when you don't know how many iterations are needed.",
      whyItMatters: "while loops are perfect for indefinite iterations: reading until end-of-file, validating input, game loops, and any situation where the end condition isn't a simple count.",
      coreConcept: "The condition is evaluated before the loop body. If false initially, the body never executes. The loop continues while condition is true.",
      syntax: "while (condition) {\n    // code to repeat\n}",
      javaExample: "// Print 1 to 5\nint i = 1;\nwhile (i <= 5) {\n    System.out.println(i);\n    i++;\n}\n\n// Input validation\nScanner sc = new Scanner(System.in);\nint number;\nwhile (true) {\n    System.out.print(\"Enter positive number: \");\n    number = sc.nextInt();\n    if (number > 0) break;\n}",
      howItWorks: "1. Check condition\n2. If true, execute body\n3. Repeat step 1\n4. If false, exit loop",
      realWorldUse: "Input validation, reading files until EOF, game loops, processing until sentinel value, waiting for a condition, menu-driven programs.",
      commonMistakes: [
        "Forgetting to update the condition variable (infinite loop)",
        "Condition never becomes false",
        "Using while when for is more appropriate",
        "Not initializing variables before the loop"
      ],
      interviewQuestions: [
        { question: "What happens if the while condition is false initially?", answer: "The loop body never executes. The program jumps to the statement after the while loop." },
        { question: "How do you create an infinite loop with while?", answer: "while (true) { } creates an infinite loop. Use break inside to exit when needed." }
      ],
      quickRevision: "while (condition) { }. Checks before executing. Use for unknown iterations. Update condition to avoid infinite loops.",
      practicePrompt: "Write a while loop that doubles a number until it exceeds 100.",
      quickCheck: {
        question: "What is the risk of while loops?",
        options: [
          "Run too few times",
          "Infinite loops if condition never becomes false",
          "Cannot use break",
          "Slower than for loops"
        ],
        answer: 1,
        explanation: "while loops can run forever if the condition never becomes false. Always ensure something in the loop body changes the condition."
      }
    }
  },
  {
    slug: "do-while-loop",
    title: "do-while Loop",
    content: {
      definition: "The do-while loop executes the body at least once, then checks the condition. The condition is evaluated after each iteration.",
      whyItMatters: "do-while is perfect for situations where you need to run code at least once before checking a condition, like input validation or menus.",
      coreConcept: "The body executes first, then the condition is checked. If true, repeat. This guarantees at least one execution.",
      syntax: "do {\n    // code to repeat\n} while (condition);",
      javaExample: "// Input validation - run at least once\nScanner sc = new Scanner(System.in);\nint number;\n\ndo {\n    System.out.print(\"Enter positive number: \");\n    number = sc.nextInt();\n} while (number <= 0);\n\nSystem.out.println(\"You entered: \" + number);\n\n// Menu system\ndoint choice;\n System.out.println(\"1. Option 1\");\n System.out.println(\"2. Exit\");\n choice = sc.nextInt();\n} while (choice != 2);",
      howItWorks: "1. Execute loop body (always runs at least once)\n2. Check condition\n3. If true, go back to step 1\n4. If false, exit loop",
      realWorldUse: "Input validation (prompt at least once), menu systems, game loops that must run at least once, retry logic.",
      commonMistakes: [
        "Forgetting semicolon after while condition",
        "Using when you need zero iterations possible",
        "Not updating condition variable",
        "Confusing with regular while loop"
      ],
      interviewQuestions: [
        { question: "What is the difference between while and do-while?", answer: "while checks condition before executing (may run 0 times). do-while executes first, then checks condition (always runs at least once)." },
        { question: "When would you choose do-while over while?", answer: "Choose do-when you need at least one execution before checking the condition, like input validation or menu display." }
      ],
      quickRevision: "do { } while (condition); - runs at least once. Condition checked after. Don't forget semicolon.",
      practicePrompt: "Write a do-while loop that asks for a password until the user enters 'secret'.",
      quickCheck: {
        question: "How many times does a do-while loop execute minimum?",
        options: ["0", "1", "2", "Depends on condition"],
        answer: 1,
        explanation: "A do-while loop always executes at least once because the condition is checked after the body executes."
      }
    }
  },
  {
    slug: "nested-loops",
    title: "Nested Loops",
    content: {
      definition: "Nested loops are loops inside other loops. The inner loop completes all its iterations for each iteration of the outer loop.",
      whyItMatters: "Nested loops are essential for working with 2D arrays, generating patterns, and processing multi-dimensional data structures.",
      coreConcept: "The outer loop runs once, the inner loop runs to completion. Then outer loop runs again. For nested loops, total iterations = outer iterations × inner iterations.",
      syntax: "for (int i = 0; i < n; i++) {\n    for (int j = 0; j < m; j++) {\n        // runs n × m times\n    }\n}",
      javaExample: "// Print multiplication table\nfor (int i = 1; i <= 3; i++) {\n    for (int j = 1; j <= 3; j++) {\n        System.out.print(i * j + \" \");\n    }\n    System.out.println();\n}\n// Output:\n// 1 2 3\n// 2 4 6\n// 3 6 9\n\n// 2D array processing\nint[][] matrix = {{1,2,3}, {4,5,6}};\nfor (int i = 0; i < matrix.length; i++) {\n    for (int j = 0; j < matrix[i].length; j++) {\n        System.out.print(matrix[i][j] + \" \");\n    }\n}",
      howItWorks: "1. Outer loop starts (i = 0)\n2. Inner loop runs to completion (j = 0, 1, 2...)\n3. Outer loop increments (i = 1)\n4. Inner loop runs again\n5. Repeat until outer loop completes",
      realWorldUse: "2D array processing, matrix operations, pattern printing, coordinate systems, nested data structures, grid-based games.",
      commonMistakes: [
        "Confusing inner and outer loop variables",
        "Wrong bounds for inner loop",
        "O(n²) complexity without realizing",
        "Not printing newlines between rows"
      ],
      interviewQuestions: [
        { question: "If outer loop runs n times and inner loop runs m times, how many total iterations?", answer: "n × m iterations. Each outer iteration triggers m inner iterations." },
        { question: "Why are nested loops potentially slow?", answer: "Nested loops have O(n²) or higher time complexity. For large datasets, this becomes very slow. Consider algorithmic alternatives when possible." }
      ],
      quickRevision: "Inner loop completes for each outer iteration. Total = outer × inner. Use for 2D data and patterns.",
      practicePrompt: "Write nested loops to print a 4x4 grid of asterisks (*).",
      quickCheck: {
        question: "How many times does the inner loop body execute?\nfor (int i = 0; i < 3; i++) {\n    for (int j = 0; j < 4; j++) { }\n}",
        options: ["3", "4", "7", "12"],
        answer: 3,
        explanation: "Outer loop runs 3 times. For each outer iteration, inner loop runs 4 times. Total: 3 × 4 = 12."
      }
    }
  },
  {
    slug: "break-continue-loops",
    title: "break & continue in Loops",
    content: {
      definition: "break exits a loop immediately. continue skips the current iteration and jumps to the next one. Both are used for loop control.",
      whyItMatters: "break and continue provide flexible control over loop execution, allowing early exit or selective iteration skipping.",
      coreConcept: "break terminates the loop. continue skips to the next iteration. In nested loops, they affect only the innermost loop. Labels can specify which loop to affect.",
      syntax: "break;      // exit loop\ncontinue;   // skip to next iteration",
      javaExample: "// break - search and stop\nfor (int i = 0; i < 10; i++) {\n    if (i == 5) break;  // stops at 5\n    System.out.print(i);\n}\n// Output: 01234\n\n// continue - skip specific values\nfor (int i = 0; i < 5; i++) {\n    if (i == 2) continue;  // skip 2\n    System.out.print(i);\n}\n// Output: 0134",
      howItWorks: "break: 1. Exit loop immediately 2. Continue with code after loop\ncontinue: 1. Skip rest of current iteration 2. Jump to loop condition/iteration step",
      realWorldUse: "break: search loops (find first match), validation (stop on error), early termination. continue: filtering, skipping invalid data, avoiding deep nesting.",
      commonMistakes: [
        "Using break/continue outside loops",
        "Expecting break to exit outer loop in nested loops",
        "Using continue in while without updating variable",
        "Overusing when simple conditions would work"
      ],
      interviewQuestions: [
        { question: "How do you break out of an outer loop from an inner loop?", answer: "Use labeled break: outer: for(...) { for(...) { break outer; } }" },
        { question: "What happens with continue in a for loop vs while loop?", answer: "In for, continue jumps to update step then condition. In while, it jumps to condition—be careful that update isn't skipped." }
      ],
      quickRevision: "break = exit loop. continue = skip to next iteration. Affect innermost loop. Use labels for outer loops.",
      practicePrompt: "Write a loop that prints 1-10 but skips 5 using continue and stops at 8 using break.",
      quickCheck: {
        question: "What is the output?\nfor (int i = 0; i < 5; i++) {\n    if (i == 3) continue;\n    System.out.print(i);\n}",
        options: ["01234", "0124", "012", "0125"],
        answer: 1,
        explanation: "The loop prints 0, 1, 2, skips 3 (continue), then prints 4. Output: 0124."
      }
    }
  },
  {
    slug: "counting-accumulation-patterns",
    title: "Counting & Accumulation Patterns",
    content: {
      definition: "Counting patterns track how many times something occurs. Accumulation patterns sum or combine values. Both are fundamental loop patterns.",
      whyItMatters: "These patterns appear everywhere: summing values, counting occurrences, finding averages, tracking statistics, and aggregating data.",
      coreConcept: "Initialize a counter/accumulator variable before the loop. Update it inside the loop. Use the final value after the loop.",
      syntax: "// Counting\nint count = 0;\nfor (item in items) {\n    if (condition) count++;\n}\n\n// Accumulation\nint sum = 0;\nfor (item in items) {\n    sum += item;\n}",
      javaExample: "// Sum of array\nint[] numbers = {10, 20, 30, 40, 50};\nint sum = 0;\nfor (int num : numbers) {\n    sum += num;\n}\nSystem.out.println(\"Sum: \" + sum);  // 150\n\n// Count even numbers\nint count = 0;\nfor (int i = 1; i <= 10; i++) {\n    if (i % 2 == 0) count++;\n}\nSystem.out.println(\"Even count: \" + count);  // 5\n\n// Find average\ndouble average = (double) sum / numbers.length;",
      howItWorks: "1. Initialize accumulator (sum = 0) or counter (count = 0) before loop\n2. In loop, update the variable based on condition or value\n3. After loop, use the accumulated result",
      realWorldUse: "Sum/average calculations, counting occurrences, finding frequency, statistical analysis, aggregating totals, progress tracking.",
      commonMistakes: [
        "Forgetting to initialize before loop",
        "Using wrong initial value (0 for sum, 1 for product)",
        "Integer division when calculating average",
        "Not resetting for multiple calculations"
      ],
      interviewQuestions: [
        { question: "What should the initial value be for a product accumulator?", answer: "Initialize to 1 (multiplicative identity). Initializing to 0 would always give 0 result." },
        { question: "How do you calculate average in Java without integer division?", answer: "Cast to double: double average = (double) sum / count; or make sum a double from the start." }
      ],
      quickRevision: "Counter: initialize 0, increment when condition true. Accumulator: initialize 0 (sum) or 1 (product), update in loop. Use after loop.",
      practicePrompt: "Write code to count how many numbers in an array are greater than 50.",
      quickCheck: {
        question: "What is wrong with this sum code?\nint sum;\nfor (int i = 0; i < 5; i++) sum += i;",
        options: [
          "Loop is wrong",
          "sum is not initialized",
          "Should use i++ not i",
          "Nothing wrong"
        ],
        answer: 1,
        explanation: "sum is declared but not initialized. Must be: int sum = 0; otherwise it has undefined value (compile error for locals)."
      }
    }
  },
  {
    slug: "basic-pattern-problems",
    title: "Basic Pattern Problems",
    content: {
      definition: "Pattern problems involve printing shapes or sequences using nested loops and conditional logic. They help develop loop logic and problem-solving skills.",
      whyItMatters: "Pattern problems strengthen your understanding of nested loops, iteration control, and logical thinking—essential for DSA and interviews.",
      coreConcept: "Use outer loop for rows, inner loop for columns. Analyze the pattern to find relationships between row number and what to print. Use conditions to modify output.",
      syntax: "for (rows) {\n    for (columns) {\n        System.out.print(pattern);\n    }\n    System.out.println();\n}",
      javaExample: "// Rectangle of stars\nfor (int i = 0; i < 4; i++) {\n    for (int j = 0; j < 5; j++) {\n        System.out.print(\"* \");\n    }\n    System.out.println();\n}\n\n// Right triangle\nfor (int i = 1; i <= 5; i++) {\n    for (int j = 1; j <= i; j++) {\n        System.out.print(\"* \");\n    }\n    System.out.println();\n}\n\n/* Output:\n*\n* *\n* * *\n* * * *\n* * * * *\n*/",
      howItWorks: "1. Identify pattern structure (rows, columns, what to print)\n2. Determine relationship: columns per row\n3. Write outer loop for rows\n4. Write inner loop for columns\n5. Print appropriate character\n6. Add newline after each row",
      realWorldUse: "Building UI layouts, game boards, formatting output, matrix visualization, understanding 2D structures.",
      commonMistakes: [
        "Wrong bounds for inner loop",
        "Forgetting newline after each row",
        "Using println instead of print for characters",
        "Not analyzing pattern relationship correctly"
      ],
      interviewQuestions: [
        { question: "How do you determine the inner loop bound for a right triangle?", answer: "The inner loop runs from 1 to current row number (i). Row 1 has 1 star, row 2 has 2 stars, etc. So: for (j = 1; j <= i; j++)." },
        { question: "How would you print an inverted right triangle?", answer: "Reverse the pattern: row 1 has n stars, row n has 1 star. Use: for (j = i; j <= n; j++) or for (j = n; j >= i; j--)." }
      ],
      quickRevision: "Outer = rows, inner = columns. Find pattern: columns per row. Use print() for chars, println() after each row.",
      practicePrompt: "Write code to print a number triangle: 1, 22, 333, 4444, 55555",
      quickCheck: {
        question: "For a 5x5 square pattern, how many total stars are printed?",
        options: ["5", "10", "25", "Depends on pattern"],
        answer: 2,
        explanation: "5 rows × 5 columns = 25 stars. In a square pattern, each row has the same number of stars as there are rows."
      }
    }
  }
];
