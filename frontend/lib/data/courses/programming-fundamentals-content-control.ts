// Module 5 - Control Flow (10 lessons)
import { CourseLessonContent } from './types';

export const controlFlowLessons: Array<{
  slug: string;
  title: string;
  content: CourseLessonContent
}> = [
  {
    slug: "what-is-control-flow",
    title: "What is Control Flow?",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "Before learning control flow, you should understand variables, data types, arithmetic and logical operators, and standard console output."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "By default, a computer program is a single straight train track: the CPU's Program Counter (PC) executes instructions one by one from top to bottom (Sequential Execution). Control flow statements are the railroad switches and loop-tracks that allow the train to branch onto different paths (Selection) or circle back to repeat a track section (Iteration) based on real-time track signals (Boolean Conditions)."
        },
        {
          type: "callout",
          title: "The 3 Pillars of Structured Programming",
          content: "In 1966, mathematicians Corrado Böhm and Giuseppe Jacopini proved that ANY computable algorithm can be constructed using only three control structures:\n1. Sequence: Execute statements in orderly top-to-bottom succession.\n2. Selection: Choose between alternative paths based on a condition (`if`, `if-else`, `switch`).\n3. Iteration: Repeat a block of code while a condition remains true (`for`, `while`, `do-while`)."
        },
        {
          type: "table",
          title: "The Control Flow Architecture in Java",
          headers: ["Type", "Keywords", "Decision Mechanism", "Primary Purpose", "Example Use Case"],
          rows: [
            ["Sequential", "None (Default)", "Linear execution", "Step-by-step processing", "Calculating tax and total bill"],
            ["Selection", "if, else, switch, ?", "Boolean evaluation / value matching", "Branching logic", "User authentication & permission check"],
            ["Iteration", "for, while, do-while", "Loop condition test", "Repeated execution", "Processing array items, reading file lines"],
            ["Jump / Transfer", "break, continue, return", "Direct instruction pointer jump", "Altering normal loop/method flow", "Exiting loop early when search item found"]
          ]
        },
        {
          type: "text",
          title: "How the CPU & JVM Handle Branching Internally",
          content: "Under the hood, the JVM compiles selection statements into low-level conditional branch bytecode instructions (such as `ifeq`, `ifne`, `if_icmpeq`) and unconditional jump instructions (`goto`).\n\nWhen the CPU evaluates a condition:\n• If the condition is met, the Program Counter jumps directly to the memory offset of the targeted branch.\n• If not met, execution simply falls through to the next sequential instruction."
        },
        {
          type: "code",
          title: "Comparing the Three Control Flow Paradigms",
          code: "// 1. SEQUENTIAL: Always runs line 1, then line 2\nint price = 100;\nint tax = 18;\nint total = price + tax; // 118\n\n// 2. SELECTION: Runs ONLY ONE branch depending on condition\nboolean hasDiscount = true;\nif (hasDiscount) {\n    total -= 10; // Executes\n} else {\n    total += 5;  // Skipped\n}\n\n// 3. ITERATION: Repeats code block\nint attempts = 0;\nwhile (attempts < 3) {\n    System.out.println(\"Attempt #\" + (++attempts));\n}",
          language: "java",
          explanation: "Combining selection and iteration allows programs to make complex real-world decisions and process arbitrary amounts of data."
        },
        {
          type: "tryIt",
          title: "Try It: Predict Execution Path",
          code: "int x = 5;\nif (x > 2) {\n    x += 3;\n}\nif (x > 10) {\n    x *= 2;\n}\nSystem.out.println(\"x = \" + x);",
          expectedOutput: "x = 8",
          explanation: "Initial x is 5. The first 'if (5 > 2)' is true, so x becomes 8. The second 'if (8 > 10)' is false and skipped. Final value is 8."
        },
        {
          type: "dryRun",
          title: "Control Flow Branching Trace",
          iterations: [
            { step: 1, variables: { "status": "\"PENDING\"", "score": "80" }, description: "Sequential setup of initial variables." },
            { step: 2, variables: { "eval": "score >= 50 (true)" }, description: "Selection evaluates boolean condition: 80 >= 50 is true." },
            { step: 3, variables: { "status": "\"APPROVED\"" }, description: "CPU branches into if-block, updating status to APPROVED." },
            { step: 4, variables: { "output": "APPROVED" }, description: "Execution returns to main sequential stream and prints result." }
          ]
        },
        {
          type: "warning",
          title: "Fundamental Control Flow Rules",
          items: [
            "In Java, conditions MUST evaluate to a boolean primitive (`true` or `false`). Numeric values like `if (1)` or `if (0)` are compilation errors.",
            "Always use braces `{}` even for single-statement branches to avoid maintenance bugs and accidental dangling statements."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Control Flow Basics",
          traps: [
            {
              question: "Can C/C++ style truthy/falsy integers (e.g. if (1)) be used in Java control flow?",
              trap: "Assuming non-zero integers are implicitly true in Java.",
              solution: "No! Java is strictly type-safe. The condition in 'if', 'while', and 'do-while' must be of type 'boolean' or 'Boolean' (autounboxed). Writing 'if (1)' results in a compile error: 'incompatible types: int cannot be converted to boolean'."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Which of the following represents an iteration control flow structure?",
          options: [
            "switch statement",
            "if-else ladder",
            "while loop",
            "ternary operator"
          ],
          answer: 2,
          explanation: "A while loop is an iteration structure that repeatedly executes a block of statements while its condition remains true."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Control flow alters default top-to-bottom sequential execution.",
            "Three main structures: Sequence, Selection (decision branching), and Iteration (loops).",
            "Java conditions must strictly evaluate to boolean expressions."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we study the single most fundamental selection construct: the if Statement, analyzing syntax rules, block scoping, and the infamous dangling semicolon bug."
        }
      ]
    }
  },
  {
    slug: "if-statement",
    title: "if Statement",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand boolean expressions, relational operators (==, !=, <, >), and logical operators (&&, ||, !)."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "An `if` statement is a security checkpoint. Before allowing the program to enter and execute a block of code, it inspects a boolean credential (the condition). If the credential is `true`, the gate opens and the code runs; if `false`, the checkpoint is bypassed completely."
        },
        {
          type: "callout",
          title: "Syntax and Structure",
          content: "```java\nif (boolean_condition) {\n    // Statements executed ONLY if condition is true\n}\n```\nThe parentheses `()` around the condition are mandatory in Java syntax. The curly braces `{}` group multiple statements into a single compound block."
        },
        {
          type: "code",
          title: "The if Statement in Action",
          code: "int accountBalance = 500;\nint withdrawalAmount = 200;\n\n// Single branch validation\nif (withdrawalAmount <= accountBalance) {\n    accountBalance -= withdrawalAmount;\n    System.out.println(\"Withdrawal successful!\");\n    System.out.println(\"Remaining balance: $\" + accountBalance);\n}\n\nSystem.out.println(\"Transaction session ended.\");",
          language: "java",
          explanation: "If withdrawalAmount exceeds accountBalance, the entire inner block is skipped, and execution proceeds directly to the session ended message."
        },
        {
          type: "text",
          title: "The Dangerous Dangling Semicolon Trap",
          content: "A notorious beginner bug in Java is placing an accidental semicolon immediately after the `if` condition:\n\n```java\nint age = 15;\nif (age >= 18); // BUG: Semicolon terminates the if statement immediately as an empty statement!\n{\n    System.out.println(\"You can vote!\"); // ALWAYS EXECUTES!\n}\n```\n\nWhy this happens:\nThe compiler treats `if (age >= 18);` as an `if` statement guarding an empty statement (a no-op). The subsequent `{ ... }` block is treated as an independent anonymous block that runs unconditionally on every execution!"
        },
        {
          type: "text",
          title: "Braceless if Statements & Historical Bugs",
          content: "If braces `{}` are omitted, the `if` statement guards ONLY the single immediately following statement:\n\n```java\nif (score >= 90)\n    System.out.println(\"Passed\");\n    System.out.println(\"Grade A\"); // NOT part of if! Always executes!\n```\n\nIndustry Best Practice:\nAlways include curly braces `{}` even for single-line statements. The famous Apple SSL security bug (CVE-2014-1266 / \"goto fail\") was caused by a duplicated unbraced statement."
        },
        {
          type: "tryIt",
          title: "Try It: The Semicolon Bug",
          code: "int num = -5;\nif (num > 0);\n{\n    num = 100;\n}\nSystem.out.println(\"num = \" + num);",
          expectedOutput: "num = 100",
          explanation: "Because of the semicolon after 'if (num > 0);', the block '{ num = 100; }' is an independent block and executes regardless of num being negative."
        },
        {
          type: "dryRun",
          title: "if Statement State Trace",
          iterations: [
            { step: 1, variables: { "cartTotal": "120", "discount": "0" }, description: "Initial cart state." },
            { step: 2, variables: { "eval": "cartTotal > 100 (120 > 100 = true)" }, description: "Condition evaluates to true." },
            { step: 3, variables: { "discount": "20", "cartTotal": "100" }, description: "Body of if executes: apply 20 discount." },
            { step: 4, variables: { "finalTotal": "100" }, description: "Program continues with discounted total." }
          ]
        },
        {
          type: "warning",
          title: "Common if Statement Pitfalls",
          items: [
            "Accidental semicolon after if: 'if (x > 5);' causes the following block to run unconditionally.",
            "Omission of curly braces causing misleading indentation bugs.",
            "Accidental assignment: 'if (flag = false)' assigns false to boolean variable flag and evaluates to false."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: if Statements",
          traps: [
            {
              question: "What is the output of: boolean b = false; if (b = true) System.out.println(\"TRUE\"); else System.out.println(\"FALSE\");?",
              trap: "Thinking it prints 'FALSE' because b was false.",
              solution: "Prints 'TRUE'! 'b = true' is an assignment expression that mutates b to true and returns the value 'true' to the if statement condition. To prevent this, always use '==' for comparison or simply 'if (b)'."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "What prints after executing:\nint x = 10;\nif (x < 5)\n  x = 20;\nx = 30;\nSystem.out.println(x);",
          options: [
            "10",
            "20",
            "30",
            "Compile error"
          ],
          answer: 2,
          explanation: "Without braces, only 'x = 20;' belongs to the if statement. 'x = 30;' executes unconditionally, setting x to 30."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "if statements execute code blocks only when their boolean condition is true.",
            "Never place a semicolon after the if condition header.",
            "Always use explicit curly braces `{}` to guarantee safety and clarity."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we expand from single decisions to binary branching with the if-else Statement, exploring mutually exclusive paths and bytecode branching mechanics."
        }
      ]
    }
  },
  {
    slug: "if-else-statement",
    title: "if-else Statement",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand basic `if` statements, boolean logic, and block scoping."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "An `if-else` statement is a fork in the road. You must choose exactly one path: if the primary road is open (condition is `true`), you take the `if` route; otherwise (condition is `false`), you are forced onto the alternate `else` route. You can never take both roads, and you can never skip both roads."
        },
        {
          type: "callout",
          title: "Mutual Exclusivity Principle",
          content: "In an `if-else` construct, the two code blocks are mutually exclusive:\n• `if` block executes &hArr; condition is `true`\n• `else` block executes &hArr; condition is `false`\nOne and only one block will execute on every pass."
        },
        {
          type: "code",
          title: "Binary Branching in Practice",
          code: "int number = 17;\n\nif (number % 2 == 0) {\n    System.out.println(number + \" is EVEN\");\n} else {\n    System.out.println(number + \" is ODD\"); // Executes\n}\n\n// Variable declaration & scoping inside branches\nString accessLevel;\nboolean isAdmin = true;\n\nif (isAdmin) {\n    accessLevel = \"FULL_CONTROL\";\n} else {\n    accessLevel = \"READ_ONLY\";\n}\n// Java compiler verifies that 'accessLevel' is guaranteed to be initialized in all paths!\nSystem.out.println(\"Access: \" + accessLevel);",
          language: "java",
          explanation: "Because if-else guarantees exhaustive coverage, the Java compiler recognizes that 'accessLevel' is definitely assigned and safe to use afterwards."
        },
        {
          type: "text",
          title: "Block Scoping Inside if and else",
          content: "Variables declared inside an `if` or `else` block have local block scope. They exist only within those curly braces and are destroyed as soon as the block terminates:\n\n```java\nif (isValid) {\n    int tempId = 42; // Exists only in if block\n} else {\n    // tempId is NOT accessible here\n}\n// tempId is NOT accessible here either!\n```"
        },
        {
          type: "tryIt",
          title: "Try It: Even/Odd Parity Check",
          code: "int val = 28;\nif (val % 2 == 0 && val % 7 == 0) {\n    System.out.println(\"Divisible by 14\");\n} else {\n    System.out.println(\"Not divisible by 14\");\n}",
          expectedOutput: "Divisible by 14",
          explanation: "28 % 2 is 0 (true) and 28 % 7 is 0 (true). The if block executes."
        },
        {
          type: "dryRun",
          title: "if-else Execution Trace",
          iterations: [
            { step: 1, variables: { "n": "-12" }, description: "Initialize n to -12." },
            { step: 2, variables: { "eval": "n >= 0 (-12 >= 0 = false)" }, description: "Evaluate if condition: returns false." },
            { step: 3, variables: { "branch": "else block" }, description: "Bypasses if body, jumps directly into else block." },
            { step: 4, variables: { "output": "\"Negative\"" }, description: "Prints 'Negative' and exits structure." }
          ]
        },
        {
          type: "warning",
          title: "Common if-else Mistakes",
          items: [
            "Attempting to attach a condition to 'else': 'else (x < 0)' is a SYNTAX ERROR (use 'else if' for conditional alternatives).",
            "Declaring a variable inside if and attempting to read it after the if-else block.",
            "Writing redundant else blocks after a return statement (e.g. 'if (cond) return a; else return b;' can be simplified to 'if (cond) return a; return b;')."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Definite Assignment",
          traps: [
            {
              question: "Why does this fail to compile: int res; if (flag) { res = 10; } System.out.println(res); vs with an else block?",
              trap: "Assuming 'res' defaults to 0.",
              solution: "In Java, local variables must be definitely assigned before access. Without an 'else' block, the compiler detects that if 'flag' is false, 'res' remains uninitialized, causing a compile error: 'variable res might not have been initialized'. Adding an 'else { res = 20; }' guarantees assignment across all code paths."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Can both the if block and the else block execute in the same pass?",
          options: [
            "Yes, if the condition changes inside the if block",
            "Yes, if multithreading is used",
            "No, they are mutually exclusive",
            "Yes, if no break statement is used"
          ],
          answer: 2,
          explanation: "The if and else blocks are strictly mutually exclusive. Exactly one block executes depending on the boolean condition."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "if-else provides guaranteed two-way binary branching.",
            "Variables declared inside branch blocks have local scope.",
            "Compilers use if-else for definite assignment verification of local variables."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we examine the else-if Ladder for handling multiple non-binary alternatives (grades, tax tiers, status codes) and the importance of rule ordering."
        }
      ]
    }
  },
  {
    slug: "else-if-ladder",
    title: "else-if Ladder",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `if` and `if-else` statements, relational comparisons, and logical operators."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "An `else-if` ladder is a multi-tier sieve or waterfall. You drop a value in from the top. It tests against tier 1; if it matches, it gets caught and processed, and the rest of the waterfall is skipped. If it doesn't match, it falls to tier 2, then tier 3, until either a match is found or it hits the catch-all bucket at the bottom (the final `else`)."
        },
        {
          type: "callout",
          title: "Waterfall Execution Rule",
          content: "Conditions in an else-if ladder are evaluated sequentially from TOP to BOTTOM:\n• The FIRST condition that evaluates to `true` executes its block.\n• All subsequent `else if` and `else` blocks are IMMEDIATELY SKIPPED.\n• If NO conditions match, the optional fallback `else` block executes."
        },
        {
          type: "code",
          title: "Grade Evaluation using else-if Ladder",
          code: "int score = 85;\nchar grade;\n\n// Order matters! Check from highest/most-restrictive to lowest\nif (score >= 90) {\n    grade = 'A';\n} else if (score >= 80) {\n    grade = 'B'; // 85 matches here -> grade = 'B' (rest skipped)\n} else if (score >= 70) {\n    grade = 'C';\n} else if (score >= 60) {\n    grade = 'D';\n} else {\n    grade = 'F'; // Fallback for scores < 60\n}\n\nSystem.out.println(\"Score: \" + score + \" -> Grade: \" + grade); // Grade: B",
          language: "java",
          explanation: "Because 85 >= 80 is true, grade is assigned 'B' and Java instantly jumps past the remaining grade C, D, and F checks."
        },
        {
          type: "text",
          title: "The Critical Importance of Condition Ordering",
          content: "Because evaluation stops at the first `true` condition, inverted condition ordering creates subtle logic bugs:\n\n```java\n// --- BROKEN ORDERING ---\nif (score >= 60) {\n    grade = 'D'; // BUG: A score of 95 satisfies >= 60, getting assigned 'D'!\n} else if (score >= 80) {\n    grade = 'B'; // UNREACHABLE for any score >= 80!\n} else if (score >= 90) {\n    grade = 'A'; // UNREACHABLE!\n}\n```\n\nRule: Always order numeric range conditions monotonically from most restrictive (highest threshold) to least restrictive (lowest threshold), or vice-versa."
        },
        {
          type: "tryIt",
          title: "Try It: HTTP Status Category Classifier",
          code: "int statusCode = 404;\nString category;\n\nif (statusCode >= 500) {\n    category = \"Server Error\";\n} else if (statusCode >= 400) {\n    category = \"Client Error\";\n} else if (statusCode >= 300) {\n    category = \"Redirection\";\n} else if (statusCode >= 200) {\n    category = \"Success\";\n} else {\n    category = \"Informational\";\n}\nSystem.out.println(statusCode + \" is \" + category);",
          expectedOutput: "404 is Client Error",
          explanation: "404 is not >= 500, but is >= 400, so it matches 'Client Error' and halts further checks."
        },
        {
          type: "dryRun",
          title: "else-if Waterfall Evaluation Trace: score = 73",
          iterations: [
            { step: 1, variables: { "score >= 90": "73 >= 90 = false" }, description: "Check Tier 1: False, falls through." },
            { step: 2, variables: { "score >= 80": "73 >= 80 = false" }, description: "Check Tier 2: False, falls through." },
            { step: 3, variables: { "score >= 70": "73 >= 70 = true" }, description: "Check Tier 3: True! Executes 'grade = C'." },
            { step: 4, variables: { "subsequent checks": "SKIPPED" }, description: "All remaining else-if and else branches bypassed." }
          ]
        },
        {
          type: "warning",
          title: "Common else-if Mistakes",
          items: [
            "Inverting range checks so broader conditions shadow specific conditions.",
            "Using multiple independent 'if' statements instead of 'else if', causing multiple blocks to execute and overwrite results.",
            "Omitting the final fallback 'else' when unexpected inputs could leave variables unassigned."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Independent if vs else-if Ladder",
          traps: [
            {
              question: "What is the difference in execution between 4 sequential 'if' statements vs an 'else if' ladder?",
              trap: "Thinking they behave identically if conditions are mutually exclusive.",
              solution: "In 4 independent 'if' statements, the CPU evaluates ALL 4 conditions unconditionally, potentially executing multiple blocks. In an 'else if' ladder, evaluation short-circuits on the FIRST true match, skipping all remaining conditions for superior performance and safety."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "How many code blocks can execute in an else-if ladder with a final else?",
          options: [
            "At least one, possibly all",
            "Exactly one",
            "Zero or one",
            "Unlimited"
          ],
          answer: 1,
          explanation: "With a final 'else' clause present, exactly one block is guaranteed to execute (the first matching condition, or the default else)."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "else-if ladders evaluate sequentially from top to bottom.",
            "The first true match executes its block and terminates the ladder.",
            "Order conditions from most specific/restrictive to least specific.",
            "Always include a final default else for defensive robustness."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Nested Conditions & Guard Clauses, learning how to handle hierarchical decisions and refactor deep 'Pyramid of Doom' indentations."
        }
      ]
    }
  },
  {
    slug: "nested-conditions",
    title: "Nested Conditions",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `if`, `if-else`, and `else-if` ladders, as well as logical operators (`&&`, `||`)."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Nested conditions represent hierarchical decision trees. Think of entering a high-security vault: Gate 1 checks if you have a valid ID badge (outer `if`). ONLY if Gate 1 opens can you walk forward to Gate 2, which scans your biometric fingerprint (inner `if`). If Gate 1 fails, you never even reach Gate 2."
        },
        {
          type: "callout",
          title: "When to Nest vs When to Combine with &&",
          content: "• Use `&&` (flat condition): When both checks are simple, independent criteria for the same action (e.g. `if (age >= 18 && hasTicket)`).\n• Use Nested `if`s (hierarchical): When the inner check is only valid or meaningful after the outer check succeeds (e.g. checking if an object is non-null before checking its properties, or providing distinct error messages at each level)."
        },
        {
          type: "code",
          title: "Hierarchical Decision Making with Nested Conditions",
          code: "int age = 22;\nboolean hasDriversLicense = true;\nboolean hasInsurance = false;\n\nif (age >= 18) {\n    System.out.println(\"Age requirement met.\");\n    \n    if (hasDriversLicense) {\n        System.out.println(\"License verified.\");\n        \n        if (hasInsurance) {\n            System.out.println(\"Approved to rent car!\");\n        } else {\n            System.out.println(\"DENIED: Insurance required.\"); // Triggers here\n        }\n    } else {\n        System.out.println(\"DENIED: Valid driver's license required.\");\n    }\n} else {\n    System.out.println(\"DENIED: Must be at least 18 years old.\");\n}",
          language: "java",
          explanation: "Nesting allows specific contextual feedback for each failure mode at every level of validation."
        },
        {
          type: "text",
          title: "Refactoring the 'Pyramid of Doom' with Guard Clauses",
          content: "Deeply nested code (> 3 levels) is known as the 'Pyramid of Doom' or 'Arrow Anti-Pattern'. It pushes code far to the right, making it difficult to read and maintain.\n\nIndustry Solution: Guard Clauses (Early Returns / Bouncer Pattern)\nInstead of nesting the success cases, check for failures first and return immediately:\n\n```java\n// --- CLEAN GUARD CLAUSE PATTERN ---\npublic String verifyRental(int age, boolean hasLicense, boolean hasInsurance) {\n    if (age < 18) return \"DENIED: Must be 18+\";\n    if (!hasLicense) return \"DENIED: No license\";\n    if (!hasInsurance) return \"DENIED: No insurance\";\n    \n    // Main happy path stays flat at indent level 0!\n    return \"Approved to rent car!\";\n}\n```"
        },
        {
          type: "tryIt",
          title: "Try It: Nested Login Verification",
          code: "boolean userExists = true;\nboolean passwordCorrect = false;\n\nif (userExists) {\n    if (passwordCorrect) {\n        System.out.println(\"Login successful\");\n    } else {\n        System.out.println(\"Invalid password\");\n    }\n} else {\n    System.out.println(\"User not found\");\n}",
          expectedOutput: "Invalid password",
          explanation: "'userExists' is true so outer if opens. 'passwordCorrect' is false so inner else executes, printing 'Invalid password'."
        },
        {
          type: "dryRun",
          title: "Nested Decision Tree Trace",
          iterations: [
            { step: 1, variables: { "age": "16", "license": "false" }, description: "Applicant data." },
            { step: 2, variables: { "outer check (age >= 18)": "false" }, description: "Outer if evaluates to false. Entire inner block is skipped." },
            { step: 3, variables: { "branch": "outer else" }, description: "Jumps directly to outer else." },
            { step: 4, variables: { "output": "\"Must be 18+\"" }, description: "Prints failure message without evaluating license status." }
          ]
        },
        {
          type: "warning",
          title: "Common Nested Condition Pitfalls",
          items: [
            "The 'Dangling Else' ambiguity: In unbraced nested code, an 'else' binds to the NEAREST preceding 'if'. Always use braces to make association explicit.",
            "Nesting code more than 3-4 levels deep, creating high cognitive complexity (flatten using guard clauses)."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: The Dangling Else Problem",
          traps: [
            {
              question: "In this unbraced code, what prints: int x = 5, y = 2; if (x > 10) if (y > 1) System.out.println(\"A\"); else System.out.println(\"B\");?",
              trap: "Thinking 'else' belongs to the outer 'if (x > 10)' and prints 'B'.",
              solution: "Prints NOTHING! In Java grammar, an 'else' always binds to the closest preceding unmatched 'if' (which is 'if (y > 1)'). Because the outer 'if (x > 10)' is false, the entire inner if-else structure is skipped!"
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "How do you refactor deeply nested conditions into clean, readable code?",
          options: [
            "Use while loops instead of if",
            "Use Guard Clauses (early returns / exits)",
            "Remove all error handling",
            "Place all conditions on one line"
          ],
          answer: 1,
          explanation: "Guard clauses test for failure conditions first and return early, keeping the happy path flat and readable."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Nested if statements model multi-level decision hierarchies.",
            "An unbraced 'else' always binds to the closest preceding 'if' (Dangling Else problem).",
            "Refactor deep nesting into flat guard clauses with early returns."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore the switch Statement & Expressions, mastering value matching, the break keyword, fallthrough mechanics, and modern arrow syntax."
        }
      ]
    }
  },
  {
    slug: "switch-statement",
    title: "switch Statement",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `if-else` ladders, relational comparisons, literal constants, and basic data types."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "A `switch` statement is an indexed direct-dial telephone switchboard or lookup router. In an `else-if` ladder, the CPU evaluates condition 1, then condition 2, then condition 3 sequentially ($O(N)$ comparisons). In a `switch` statement, the expression is evaluated once, and the runtime jumps directly to the matching `case` label ($O(1)$ direct branch via bytecode jump tables)."
        },
        {
          type: "callout",
          title: "Permitted Data Types in switch",
          content: "Java allows switching ONLY on specific data types:\n• Primitives & Wrappers: `byte`, `short`, `char`, `int` (and `Byte`, `Short`, `Character`, `Integer`)\n• Strings: `String` (supported since Java 7)\n• Enums: `enum` constants (supported since Java 5)\n\n❌ Types NOT allowed: `long`, `float`, `double`, `boolean` (cannot switch on continuous decimals, 64-bit longs, or simple boolean flags)."
        },
        {
          type: "code",
          title: "Classic switch with Fallthrough & Modern Enhanced switch",
          code: "// --- 1. CLASSIC SWITCH STATEMENT ---\nint dayOfWeek = 3;\nString dayName;\n\nswitch (dayOfWeek) {\n    case 1: dayName = \"Monday\"; break;\n    case 2: dayName = \"Tuesday\"; break;\n    case 3: dayName = \"Wednesday\"; break; // Matches! Exits switch via break\n    case 4: dayName = \"Thursday\"; break;\n    case 5: dayName = \"Friday\"; break;\n    case 6: \n    case 7: dayName = \"Weekend\"; break; // Grouped cases (intentional fallthrough)\n    default: dayName = \"Invalid Day\"; break; // Fallback for unmatched inputs\n}\nSystem.out.println(\"Day: \" + dayName); // Day: Wednesday\n\n// --- 2. MODERN JAVA ENHANCED SWITCH EXPRESSION (Java 14+) ---\n// Arrow syntax prevents accidental fallthrough and returns a value directly!\nString typeOfDay = switch (dayOfWeek) {\n    case 1, 2, 3, 4, 5 -> \"Weekday\";\n    case 6, 7          -> \"Weekend\";\n    default            -> \"Invalid\";\n};\nSystem.out.println(\"Type: \" + typeOfDay);",
          language: "java",
          explanation: "In classic switch, omitting 'break' causes execution to fall through into subsequent cases. Modern enhanced switch expressions use arrow syntax '->' which eliminates fallthrough bugs and returns values cleanly."
        },
        {
          type: "text",
          title: "The Mechanics of Case Fallthrough",
          content: "In a classic switch statement, the `case` labels act merely as entry markers. Once execution enters a matching case, it executes all statements sequentially across subsequent cases until it encounters an explicit `break;` statement or reaches the end of the switch block.\n\nWhile intentional fallthrough is useful for grouping multiple values (like matching cases 6 and 7 for weekends), unintentional fallthrough caused by a forgotten `break;` is one of the most infamous sources of bugs in software engineering."
        },
        {
          type: "tryIt",
          title: "Try It: Quarter Identifier",
          code: "int month = 4;\nString quarter;\n\nswitch (month) {\n    case 1: case 2: case 3:\n        quarter = \"Q1\";\n        break;\n    case 4: case 5: case 6:\n        quarter = \"Q2\";\n        break;\n    case 7: case 8: case 9:\n        quarter = \"Q3\";\n        break;\n    case 10: case 11: case 12:\n        quarter = \"Q4\";\n        break;\n    default:\n        quarter = \"Invalid Month\";\n}\nSystem.out.println(\"Month \" + month + \" is in \" + quarter);",
          expectedOutput: "Month 4 is in Q2",
          explanation: "Month 4 matches case 4, falls through to assign 'quarter = Q2', and breaks out of the switch."
        },
        {
          type: "dryRun",
          title: "Accidental Fallthrough Trace: Missing break",
          iterations: [
            { step: 1, variables: { "code": "2", "output": "\"\"" }, description: "Input code is 2." },
            { step: 2, variables: { "match": "case 2" }, description: "Direct jump to case 2. Prints 'TWO'. No break present!" },
            { step: 3, variables: { "fallthrough": "case 3" }, description: "Execution falls through into case 3! Prints 'THREE'. No break present!" },
            { step: 4, variables: { "fallthrough": "default" }, description: "Falls through into default! Prints 'OTHER'. Exits." }
          ]
        },
        {
          type: "warning",
          title: "Common switch Statement Pitfalls",
          items: [
            "Forgetting `break;` at the end of a case, causing silent fallthrough logic corruption.",
            "Attempting to use variables in case labels: `case x:` is illegal. Case values must be compile-time constants (literals or `final` variables).",
            "Switching on a `null` String or Object: throws `NullPointerException` immediately upon evaluating the switch expression header.",
            "Attempting to test boolean expressions or ranges (`case score >= 90:` is a syntax error in Java)."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: switch Bytecode & Constraints",
          traps: [
            {
              question: "How does the JVM optimize switch statements under the hood compared to else-if chains?",
              trap: "Thinking switch is just syntactic sugar for a series of if-else statements.",
              solution: "The Java compiler generates specialized bytecode instructions: `tableswitch` (when case values are densely packed integers, enabling an $O(1)$ direct array index jump) or `lookupswitch` (when case values are sparse, performing an $O(\\log N)$ binary search on sorted keys). This makes switch significantly faster than long $O(N)$ else-if chains."
            },
            {
              question: "What happens if a String switch variable is null: String s = null; switch(s) { case \"A\": break; }?",
              trap: "Thinking it jumps to the default case.",
              solution: "It throws a `NullPointerException` at the `switch(s)` header line before inspecting any case labels because Java calls `s.hashCode()` internally to evaluate String switches."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Which of the following data types CANNOT be used in a switch statement?",
          options: [
            "int",
            "String",
            "double",
            "char"
          ],
          answer: 2,
          explanation: "Floating-point numbers (`float` and `double`) are not permitted in switch statements due to precision and rounding ambiguities."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "switch provides fast, direct O(1) multi-way branch selection for exact constant matches.",
            "Permitted types: byte, short, char, int, String, and enums (no float, double, long, boolean).",
            "In classic switch, every case requires a break to prevent fallthrough.",
            "Case values must be compile-time constants."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we examine the Ternary Operator (`? :`), a concise 3-operand inline conditional expression for fast value assignment."
        }
      ]
    }
  },
  {
    slug: "ternary-operator",
    title: "Ternary Operator",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `if-else` branching, boolean conditions, and the difference between expressions and statements."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "The ternary operator (`? :`) is an inline binary selector or compact valve. While an `if-else` construct is a *statement* (it executes a block of actions but does not return a value on its own), the ternary operator is an *expression*—it evaluates to a concrete value that can be assigned directly to a variable or passed as an argument."
        },
        {
          type: "callout",
          title: "Syntax Structure",
          content: "`variable = (booleanCondition) ? valueIfTrue : valueIfFalse;`\n\n1. Operand 1: The condition to evaluate (must yield a boolean).\n2. `?`: The decision separator.\n3. Operand 2: The value/expression returned if condition is `true`.\n4. `:`: The alternate separator.\n5. Operand 3: The value/expression returned if condition is `false`."
        },
        {
          type: "code",
          title: "Ternary Operator in Action",
          code: "int score = 78;\n\n// 1. Clean assignment\nString result = (score >= 60) ? \"PASSED\" : \"FAILED\";\nSystem.out.println(\"Status: \" + result); // Status: PASSED\n\n// 2. Finding minimum / maximum of two numbers\nint a = 45, b = 72;\nint max = (a > b) ? a : b; // 72\n\n// 3. Inline formatting & pluralization\nint itemCount = 1;\nSystem.out.println(\"You have \" + itemCount + \" \" + (itemCount == 1 ? \"item\" : \"items\"));\n\n// 4. Safe default fallback\nString input = null;\nString displayName = (input != null) ? input : \"Guest\";\nSystem.out.println(\"Welcome, \" + displayName); // Welcome, Guest",
          language: "java",
          explanation: "Ternary expressions compress simple 5-line if-else assignment blocks into a single, highly readable line."
        },
        {
          type: "text",
          title: "Type Promotion and Type Unification in Ternary Expressions",
          content: "Both branches (Operand 2 and Operand 3) must be compatible with the target assignment type. If the two operands have different numeric types, the Java compiler applies binary numeric promotion to harmonize them to a common super-type:\n\n```java\nboolean condition = true;\nNumber num = condition ? Integer.valueOf(1) : Double.valueOf(2.5); // Unified type\n\n// SUBTLE TRAP: Numeric promotion to double\nObject obj = true ? 1 : 2.0; \nSystem.out.println(obj); // Prints 1.0 (promoted to Double, not Integer 1!)\n```"
        },
        {
          type: "tryIt",
          title: "Try It: Absolute Value Calculator",
          code: "int n = -25;\nint absVal = (n < 0) ? -n : n;\nSystem.out.println(\"Absolute value: \" + absVal);",
          expectedOutput: "Absolute value: 25",
          explanation: "Because n (-25) is < 0, the true branch (-(-25) = 25) evaluates and assigns 25 to absVal."
        },
        {
          type: "dryRun",
          title: "Ternary Expression Evaluation Trace",
          iterations: [
            { step: 1, variables: { "age": "20" }, description: "Input age is 20." },
            { step: 2, variables: { "eval": "age >= 18 (20 >= 18 = true)" }, description: "Condition evaluates to true." },
            { step: 3, variables: { "branch": "Left operand (\"Adult\")" }, description: "Returns left value; right operand (\"Minor\") is never evaluated." },
            { step: 4, variables: { "assignment": "status = \"Adult\"" }, description: "Value assigned to status variable." }
          ]
        },
        {
          type: "warning",
          title: "Common Ternary Mistakes",
          items: [
            "Deeply nesting ternary operators: `a ? b : c ? d : e ? f : g` creates unreadable 'spaghetti code' (use an `else-if` ladder instead).",
            "Auto-unboxing NullPointerException: mixing primitive and wrapper types where the wrapper is null: `boolean flag = false; Integer x = null; int y = flag ? 10 : x;` throws NPE when Java unboxes null `x` into primitive `int`.",
            "Using ternary operators for statements with side-effects instead of value returns: `flag ? System.out.println(\"A\") : System.out.println(\"B\")` is a SYNTAX ERROR in Java (the operands must be expressions with values)."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Auto-Unboxing & Type Promotion",
          traps: [
            {
              question: "What is printed by: System.out.println(true ? Integer.valueOf(1) : Double.valueOf(2.0));?",
              trap: "Thinking it prints '1' because the true branch is an Integer.",
              solution: "It prints '1.0'! Because one operand is an Integer and the other is a Double, Java's ternary type promotion rules unbox the Integer to int and promote it to double (1.0) to match the Double operand."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "What is the key functional difference between an if-else statement and a ternary operator?",
          options: [
            "if-else runs faster than ternary",
            "Ternary is an expression that yields a value; if-else is a statement block",
            "Ternary can execute multiple statement blocks",
            "if-else cannot use boolean conditions"
          ],
          answer: 1,
          explanation: "Ternary is an expression returning a value for direct assignment; if-else is a statement construct for executing blocks of code."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Ternary operator `condition ? trueVal : falseVal` is the only 3-operand operator in Java.",
            "Use ternary for clean, concise single-line conditional assignments.",
            "Avoid nesting ternary expressions.",
            "Beware of numeric type promotion and unboxing NullPointerExceptions."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Jump Statements starting with the break Statement, understanding how to escape loops and switch blocks immediately."
        }
      ]
    }
  },
  {
    slug: "break-statement",
    title: "break Statement",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand loops (`for`, `while`, `do-while`), `switch` blocks, and basic control flow."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "The `break` statement is an Emergency Stop Button on an industrial conveyor belt. When triggered, it immediately halts the entire enclosing loop or switch construct and transfers execution directly to the first line of code outside that structure."
        },
        {
          type: "callout",
          title: "Where break is Permitted",
          content: "In Java, `break` can ONLY be used inside:\n1. Loops (`for`, `while`, `do-while`) — to abort loop execution early.\n2. `switch` statements — to prevent fallthrough.\n3. Labeled blocks — to break out of named scopes.\n\n❌ Using `break` inside a regular `if` statement that is NOT inside a loop or switch produces a compile-time error."
        },
        {
          type: "code",
          title: "Early Loop Termination & Labeled Break",
          code: "// 1. UNLABELED BREAK: Search for target and stop immediately\nint target = 42;\nint[] numbers = { 10, 25, 42, 88, 99 };\nboolean found = false;\n\nfor (int i = 0; i < numbers.length; i++) {\n    if (numbers[i] == target) {\n        found = true;\n        System.out.println(\"Found \" + target + \" at index \" + i);\n        break; // Stops checking remaining elements (saves CPU cycles!)\n    }\n}\n\n// 2. LABELED BREAK: Exiting nested multi-level loops\n// By default, break ONLY exits the innermost loop. Use labels for outer loops!\nint[][] matrix = {\n    { 1, 2, 3 },\n    { 4, 5, 6 },\n    { 7, 8, 9 }\n};\n\nsearchMatrix: // Label definition\nfor (int row = 0; row < matrix.length; row++) {\n    for (int col = 0; col < matrix[row].length; col++) {\n        if (matrix[row][col] == 5) {\n            System.out.println(\"Found 5 at [\" + row + \",\" + col + \"]\");\n            break searchMatrix; // Exits BOTH loops entirely!\n        }\n    }\n}\nSystem.out.println(\"Search finished.\");",
          language: "java",
          explanation: "Unlabeled break terminates the immediate innermost loop. Labeled break allows escaping multiple nested loop levels in a single jump without maintaining complex boolean flags."
        },
        {
          type: "text",
          title: "Innermost Scope Rule vs Labeled Breaks",
          content: "When loops are nested 2, 3, or more levels deep, a standard `break;` statement applies strictly to the innermost enclosing loop. The outer loops will continue running unless you either:\n• Use a **labeled break** (`break labelName;`), or\n• Set a shared `boolean isDone = true` flag checked by all outer loops, or\n• Return directly from the enclosing method."
        },
        {
          type: "tryIt",
          title: "Try It: Breaking on Threshold",
          code: "int sum = 0;\nfor (int i = 1; i <= 100; i++) {\n    sum += i;\n    if (sum > 50) {\n        System.out.println(\"Threshold exceeded at i = \" + i + \", sum = \" + sum);\n        break;\n    }\n}",
          expectedOutput: "Threshold exceeded at i = 10, sum = 55",
          explanation: "When i reaches 10, sum becomes 55 (> 50). The if condition triggers break, terminating the loop early."
        },
        {
          type: "dryRun",
          title: "Early Exit Loop Trace with break",
          iterations: [
            { step: 1, variables: { "i": "1", "sum": "1" }, description: "sum < 50, continue loop." },
            { step: 2, variables: { "i": "5", "sum": "15" }, description: "sum < 50, continue loop." },
            { step: 3, variables: { "i": "10", "sum": "55" }, description: "sum > 50 condition triggers!" },
            { step: 4, variables: { "action": "break executed" }, description: "Loop terminates immediately. Remaining 90 iterations skipped." }
          ]
        },
        {
          type: "warning",
          title: "Common break Mistakes",
          items: [
            "Expecting `break` to exit an outer loop when used in nested loops (only exits innermost loop unless labeled).",
            "Unreachable code error: placing statements directly after an unconditional `break;` inside a block.",
            "Using `break` in a standalone `if` block outside of any loop or switch (syntax error)."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: break with finally Blocks",
          traps: [
            {
              question: "If a loop contains a try-finally block and executes break inside try, does the finally block execute?",
              trap: "Thinking break bypasses the finally block.",
              solution: "YES, the finally block is GUARANTEED to execute before the break transfers control outside the loop. The JVM ensures cleanup in finally blocks executes whenever a scope is exited via break, continue, or return."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "What does an unlabeled break statement do inside a nested loop?",
          options: [
            "Terminates all running loops",
            "Terminates only the innermost enclosing loop",
            "Skips to the next iteration of the inner loop",
            "Exits the entire method"
          ],
          answer: 1,
          explanation: "An unlabeled break statement only terminates the nearest enclosing (innermost) loop."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "break halts loop or switch execution immediately.",
            "Unlabeled break exits only the innermost enclosing structure.",
            "Labeled break `break label;` allows escaping multi-level nested loops directly.",
            "Crucial for optimizing linear searches and preventing switch fallthrough."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore the continue Statement, learning how to skip specific iterations without terminating the entire loop."
        }
      ]
    }
  },
  {
    slug: "continue-statement",
    title: "continue Statement",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `for`, `while`, and `do-while` loops, and the difference between `break` and `continue`."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "The `continue` statement is the 'Skip Track' button on a music player. It doesn't turn off the music player (unlike `break` which halts everything); it simply abandons the remainder of the currently playing song and immediately cues up the next song in the playlist."
        },
        {
          type: "callout",
          title: "Where Does continue Jump?",
          content: "• In a `for` loop: `continue` jumps directly to the **update step** (`i++`), and then re-evaluates the condition.\n• In a `while` / `do-while` loop: `continue` jumps directly to the **boolean condition check**.\n\n⚠️ CRITICAL DANGER: In a `while` loop, if your variable increment (`i++`) is placed *after* the `continue` statement, it will be skipped, causing a permanent **INFINITE LOOP**!"
        },
        {
          type: "code",
          title: "Filtering Iterations with continue & The while Loop Pitfall",
          code: "// --- 1. SAFE USE IN FOR LOOP (Prints odd numbers only) ---\nfor (int i = 1; i <= 6; i++) {\n    if (i % 2 == 0) {\n        continue; // Skip even numbers -> jumps directly to i++\n    }\n    System.out.print(i + \" \"); // Output: 1 3 5 \n}\nSystem.out.println();\n\n// --- 2. DANGEROUS PITFALL IN WHILE LOOPS ---\nint count = 0;\nwhile (count < 5) {\n    count++; // MUST increment BEFORE continue to avoid infinite loop!\n    if (count == 3) {\n        continue; // Skips printing 3\n    }\n    System.out.print(count + \" \"); // Output: 1 2 4 5\n}\nSystem.out.println();\n\n// --- 3. LABELED CONTINUE IN NESTED LOOPS ---\nouter: \nfor (int r = 1; r <= 3; r++) {\n    for (int c = 1; c <= 3; c++) {\n        if (c == 2) continue outer; // Aborts inner loop, advances outer 'r'\n        System.out.println(\"r=\" + r + \", c=\" + c);\n    }\n}",
          language: "java",
          explanation: "In for loops, continue reliably triggers the increment clause. In while loops, developers must ensure the loop counter is updated before invoking continue."
        },
        {
          type: "text",
          title: "Using continue as a Loop Guard Clause",
          content: "Instead of wrapping large loop bodies in deep `if` statements, use `continue` at the top of the loop as a guard clause to filter out unwanted items early:\n\n```java\n// Deep nesting anti-pattern\nfor (User user : users) {\n    if (user != null) {\n        if (user.isActive()) {\n            if (user.hasValidEmail()) {\n                // 4 levels indented!\n            }\n        }\n    }\n}\n\n// Clean Guard Clause Pattern using continue\nfor (User user : users) {\n    if (user == null || !user.isActive() || !user.hasValidEmail()) continue;\n    \n    // Main processing stays flat at indent level 1!\n    sendNotification(user);\n}\n```"
        },
        {
          type: "tryIt",
          title: "Try It: Skip Multiples of 3",
          code: "for (int n = 1; n <= 10; n++) {\n    if (n % 3 == 0) {\n        continue;\n    }\n    System.out.print(n + \" \");\n}",
          expectedOutput: "1 2 4 5 7 8 10 ",
          explanation: "When n is 3, 6, and 9, continue triggers, skipping the print statement and moving straight to n++."
        },
        {
          type: "dryRun",
          title: "continue Step-by-Step Execution Trace",
          iterations: [
            { step: 1, variables: { "i": "1", "i % 2 == 0": "false" }, description: "Prints '1'." },
            { step: 2, variables: { "i": "2", "i % 2 == 0": "true" }, description: "continue encountered! Jumps straight to i++." },
            { step: 3, variables: { "i": "3", "i % 2 == 0": "false" }, description: "Prints '3'." },
            { step: 4, variables: { "i": "4", "i % 2 == 0": "true" }, description: "continue encountered! Jumps straight to i++." }
          ]
        },
        {
          type: "warning",
          title: "Common continue Mistakes",
          items: [
            "Creating accidental infinite while loops by placing counter increments after the continue statement.",
            "Confusing `break` (aborts entire loop) with `continue` (aborts current iteration only).",
            "Attempting to use `continue` inside a `switch` block (continue belongs only to loops)."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: continue in while Loops",
          traps: [
            {
              question: "What happens when this code runs: int i = 0; while (i < 5) { if (i == 3) continue; i++; }?",
              trap: "Thinking it prints numbers 0 to 4 except 3.",
              solution: "It hangs in an INFINITE LOOP! When `i` reaches 3, `continue` jumps to the condition `while (i < 5)`. Because `i++` was skipped, `i` remains 3 indefinitely, re-triggering continue forever."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "When continue executes inside a for loop `for(int i=0; i<10; i++)`, what executes next?",
          options: [
            "The statement immediately after the loop",
            "The update step `i++`, then the condition `i < 10`",
            "The condition check `i < 10` without incrementing i",
            "The loop terminates"
          ],
          answer: 1,
          explanation: "In a for loop, continue jumps directly to the update expression (i++), and then evaluates the loop termination condition."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "continue abandons the rest of the current iteration and begins the next.",
            "In for loops, continue jumps to the update step.",
            "In while loops, ensure the loop variable is incremented before continue to prevent infinite loops.",
            "Use continue as a guard clause to flatten deeply nested loop bodies."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore the return Statement, mastering method termination, value delivery, and compiler definite return requirements."
        }
      ]
    }
  },
  {
    slug: "return-statement",
    title: "return Statement",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand method declarations, return types (`void` vs data types), and control flow structures."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "The `return` statement is the Exit Door & Delivery Parcel of a method. It halts all execution within the current method immediately, pops the method's stack frame off the execution call stack, and hands control (and any resulting parcel / value) back to the calling function."
        },
        {
          type: "callout",
          title: "Rules of the return Statement",
          content: "1. **In `void` methods**: `return;` (with no value) is optional at the end, but can be used anywhere to exit early.\n2. **In non-void methods**: `return value;` is MANDATORY. The returned value must be assignment-compatible with the declared return type.\n3. **Definite Assignment & Return**: The compiler verifies that EVERY possible execution path produces a return statement.\n4. **Unreachable Code**: Any code placed directly after an unconditional return produces a compile error."
        },
        {
          type: "code",
          title: "Guaranteed Return Paths & Early Exit Guard Clauses",
          code: "public class MathUtils {\n    // 1. Guard clauses for early exit in typed methods\n    public static double divide(double numerator, double denominator) {\n        if (denominator == 0.0) {\n            System.out.println(\"Error: Division by zero\");\n            return 0.0; // Early exit with default fallback\n        }\n        return numerator / denominator; // Normal calculation path\n    }\n\n    // 2. Early exit in void methods\n    public static void printUserGreeting(String username) {\n        if (username == null || username.trim().isEmpty()) {\n            return; // Exit immediately, print nothing\n        }\n        System.out.println(\"Hello, \" + username + \"!\");\n    }\n\n    // 3. Exhaustive return paths across all branches\n    public static String getSign(int n) {\n        if (n > 0) return \"Positive\";\n        if (n < 0) return \"Negative\";\n        return \"Zero\"; // Guarantees a return in all possible paths\n    }\n}",
          language: "java",
          explanation: "Early returns simplify complex method logic by rejecting invalid inputs immediately at the top."
        },
        {
          type: "text",
          title: "The Definite Return Rule & Unreachable Code",
          content: "The Java compiler enforces rigorous flow analysis:\n\n```java\n// COMPILE ERROR: Missing return statement\npublic int getAbs(int x) {\n    if (x > 0) {\n        return x;\n    }\n    // Error: If x <= 0, no return statement is reached!\n}\n\n// COMPILE ERROR: Unreachable code\npublic int calculate() {\n    return 42;\n    int x = 100; // Error: Unreachable code!\n}\n```"
        },
        {
          type: "tryIt",
          title: "Try It: Number Clamp Function",
          code: "public class ClampTest {\n    public static int clamp(int val, int min, int max) {\n        if (val < min) return min;\n        if (val > max) return max;\n        return val;\n    }\n    public static void main(String[] args) {\n        System.out.println(clamp(150, 0, 100));\n    }\n}",
          expectedOutput: "100",
          explanation: "Because val (150) is greater than max (100), the method returns max (100) immediately."
        },
        {
          type: "dryRun",
          title: "Call Stack Trace with return Statement",
          iterations: [
            { step: 1, variables: { "caller": "main() invokes clamp(150, 0, 100)" }, description: "New stack frame pushed for clamp()." },
            { step: 2, variables: { "val < min": "150 < 0 = false" }, description: "First guard clause skipped." },
            { step: 3, variables: { "val > max": "150 > 100 = true" }, description: "Second guard clause matched: returns max (100)." },
            { step: 4, variables: { "stack": "clamp() frame popped, control returns to main()" }, description: "main() receives value 100." }
          ]
        },
        {
          type: "warning",
          title: "Common return Statement Mistakes",
          items: [
            "Missing return statement in one branch of an if-else structure.",
            "Attempting to return a value from a method declared with `void` return type.",
            "Placing executable statements immediately after a `return`, causing an 'unreachable code' compile error."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: return vs finally Block",
          traps: [
            {
              question: "What is returned by this method: public static int test() { try { return 1; } finally { return 2; } }?",
              trap: "Thinking it returns 1 or throws an error.",
              solution: "It returns 2! When a `finally` block contains a `return` statement, it silently discards and overrides any return value or pending exception from the `try` block. (Warning: placing a return inside a finally block is a severe anti-pattern)."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Can a method with a `void` return type include a return statement?",
          options: [
            "No, return is forbidden in void methods",
            "Yes, but only 'return;' without any value to exit early",
            "Yes, it can return null",
            "Yes, but only inside loops"
          ],
          answer: 1,
          explanation: "A void method can use 'return;' with no attached value to terminate execution early."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "return exits the current method immediately and returns control to the caller.",
            "Non-void methods must return a compatible value across every possible path.",
            "Code directly following an unconditional return is flagged as unreachable.",
            "Guard clauses with early returns keep methods flat, clean, and readable."
          ]
        },
        {
          type: "text",
          title: "Module 5 Complete",
          content: "Congratulations on mastering Control Flow! In Module 6, we dive deep into Loops & Iteration (`for`, `while`, `do-while`, nested loops, and accumulator patterns)."
        }
      ]
    }
  }
];

