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
      definition: "Control flow refers to the order in which statements are executed in a program. By default, code executes sequentially from top to bottom. Control flow statements allow you to alter this order based on conditions.",
      whyItMatters: "Control flow enables programs to make decisions, repeat actions, and respond differently to different inputs—essential for any non-trivial program.",
      coreConcept: "Three types of control flow: sequential (default), selection (if, switch), and iteration (loops). Selection statements choose which code path to execute based on conditions.",
      syntax: "// Control flow changes execution order\nif (condition) { }\nswitch(value) { }\nfor (init; condition; update) { }",
      javaExample: "// Sequential (default)\nint a = 5;\nint b = 10;\n\n// Selection (if statement)\nif (a < b) {\n    System.out.println(\"a is smaller\");\n}\n\n// Iteration (for loop)\nfor (int i = 0; i < 5; i++) {\n    System.out.println(i);\n}",
      howItWorks: "1. Sequential: Execute statements in order they appear\n2. Selection: Evaluate condition, execute appropriate branch\n3. Iteration: Repeat code block while condition is true",
      realWorldUse: "Every program uses control flow: validating user input (if), processing lists (loops), menu systems (switch), game logic, business rules.",
      commonMistakes: [
        "Using = instead of == in conditions",
        "Forgetting braces for multi-statement blocks",
        "Infinite loops from incorrect conditions",
        "Off-by-one errors in loop boundaries"
      ],
      interviewQuestions: [
        { question: "What are the three types of control flow?", answer: "Sequential (default top-to-bottom), Selection (if, switch), and Iteration (loops like for, while)." },
        { question: "Why is control flow important in programming?", answer: "It allows programs to make decisions and respond differently based on conditions, enabling complex logic and user interaction." }
      ],
      quickRevision: "Control flow = execution order. Types: sequential, selection (if/switch), iteration (loops).",
      practicePrompt: "List three scenarios where you would use each type of control flow in a real application.",
      quickCheck: {
        question: "Which statement is used for selection control flow?",
        options: ["for", "while", "if", "System.out.println"],
        answer: 2,
        explanation: "The if statement is used for selection control flow—it chooses which code path to execute based on a condition."
      }
    }
  },
  {
    slug: "if-statement",
    title: "if Statement",
    content: {
      definition: "The if statement executes a block of code only if a specified condition evaluates to true. It is the most basic form of decision-making in programming.",
      whyItMatters: "if statements allow programs to respond to different situations, validate input, check conditions, and make decisions.",
      coreConcept: "The condition must be a boolean expression. If true, the block executes. If false, the block is skipped. Braces {} define the block; without them, only one statement executes.",
      syntax: "if (condition) {\n    // code to execute if true\n}",
      javaExample: "int age = 20;\n\nif (age >= 18) {\n    System.out.println(\"You are an adult\");\n}\n\n// Without braces (only one statement)\nif (temperature > 30)\n    System.out.println(\"It's hot\");",
      howItWorks: "1. Evaluate the boolean condition\n2. If true, execute the block\n3. If false, skip the block\n4. Continue with code after the block",
      realWorldUse: "Validating user input, checking permissions, error handling, game logic (collision detection, scoring), feature flags.",
      commonMistakes: [
        "Using = (assignment) instead of == (comparison)",
        "Forgetting braces when you have multiple statements",
        "Putting semicolon after if condition: if (x > 5);",
        "Not understanding that condition must be boolean"
      ],
      interviewQuestions: [
        { question: "What happens if you put a semicolon after if condition?", answer: "if (x > 5); creates an empty statement. The block after it always executes, regardless of the condition. This is a common bug." },
        { question: "Can an if statement execute without braces?", answer: "Yes, but only the immediately following single statement will be part of the if. Best practice is to always use braces for clarity." }
      ],
      quickRevision: "if (condition) { block }. Execute block only if condition is true. Always use braces.",
      practicePrompt: "Write an if statement that prints \"Pass\" if a score is 40 or above.",
      quickCheck: {
        question: "What is wrong with: if (x = 5) { }",
        options: [
          "Nothing, it's correct",
          "Should use == for comparison, = is assignment",
          "Missing semicolon",
          "x must be declared"
        ],
        answer: 1,
        explanation: "x = 5 is assignment, not comparison. It sets x to 5 and returns 5 (truthy in some languages, but Java requires boolean). Correct: if (x == 5)."
      }
    }
  },
  {
    slug: "if-else-statement",
    title: "if-else Statement",
    content: {
      definition: "The if-else statement provides two paths: one to execute if the condition is true (if block), and another if it's false (else block).",
      whyItMatters: "Allows programs to handle both possibilities of a condition—when something is true AND when it's false.",
      coreConcept: "The else block executes only when the if condition is false. Either the if block OR the else block executes, never both.",
      syntax: "if (condition) {\n    // if true\n} else {\n    // if false\n}",
      javaExample: "int number = 7;\n\nif (number % 2 == 0) {\n    System.out.println(\"Even\");\n} else {\n    System.out.println(\"Odd\");\n}\n// Output: Odd",
      howItWorks: "1. Evaluate condition\n2. If true, execute if block\n3. If false, execute else block\n4. Continue with code after",
      realWorldUse: "Checking pass/fail, valid/invalid, positive/negative numbers, deciding between two actions, default handling.",
      commonMistakes: [
        "Not using else when you need to handle the false case",
        "Duplicating code between if and else blocks",
        "Using else when a simple return in if would suffice",
        "Not understanding that else doesn't have a condition"
      ],
      interviewQuestions: [
        { question: "Can both if and else blocks execute?", answer: "No. Either the if block or the else block executes, never both. They are mutually exclusive." },
        { question: "When should you use if-else instead of just if?", answer: "Use if-else when you need to handle both cases (true and false) differently. Use just if when you only care about the true case." }
      ],
      quickRevision: "if-else: two paths. if runs when true, else runs when false. Mutually exclusive.",
      practicePrompt: "Write code that checks if a number is positive or negative and prints the result.",
      quickCheck: {
        question: "What prints when x = -5?\nif (x > 0) {\n    System.out.println(\"Positive\");\n} else {\n    System.out.println(\"Non-positive\");\n}",
        options: ["Positive", "Non-positive", "Error", "Nothing"],
        answer: 1,
        explanation: "x = -5 is not greater than 0, so the condition is false. The else block executes, printing \"Non-positive\"."
      }
    }
  },
  {
    slug: "else-if-ladder",
    title: "else-if Ladder",
    content: {
      definition: "The else-if ladder allows checking multiple conditions in sequence. It's used when you need to choose one option from many alternatives.",
      whyItMatters: "Real-world problems often have more than two possibilities. else-if handles multiple conditions elegantly without deeply nested if statements.",
      coreConcept: "Conditions are checked top to bottom. The first true condition's block executes, and the rest are skipped. The final else is optional and acts as a default.",
      syntax: "if (condition1) {\n    // block 1\n} else if (condition2) {\n    // block 2\n} else if (condition3) {\n    // block 3\n} else {\n    // default block\n}",
      javaExample: "int marks = 75;\n\nif (marks >= 90) {\n    System.out.println(\"Grade: A\");\n} else if (marks >= 80) {\n    System.out.println(\"Grade: B\");\n} else if (marks >= 70) {\n    System.out.println(\"Grade: C\");\n} else if (marks >= 60) {\n    System.out.println(\"Grade: D\");\n} else {\n    System.out.println(\"Grade: F\");\n}\n// Output: Grade: C",
      howItWorks: "1. Check condition1, if true execute block1 and exit\n2. If false, check condition2, if true execute block2\n3. Continue until a true condition is found\n4. If none true, execute final else if present",
      realWorldUse: "Grade calculation, menu systems, age categories, tax brackets, discount tiers, time-based greetings.",
      commonMistakes: [
        "Ordering conditions incorrectly (smaller ranges first)",
        "Forgetting that only one block executes",
        "Not including a final else for unexpected values",
        "Overlapping conditions that cause confusion"
      ],
      interviewQuestions: [
        { question: "Why does order matter in else-if ladder?", answer: "Conditions are checked sequentially. If a condition is true, its block executes and remaining conditions are skipped. Order conditions from most specific to least specific." },
        { question: "How many blocks can execute in an else-if ladder?", answer: "Exactly one (or zero if no condition matches and there's no final else)." }
      ],
      quickRevision: "else-if: check multiple conditions in order. First true wins. Final else is default.",
      practicePrompt: "Create an else-if ladder that categorizes age: child (0-12), teen (13-19), adult (20-59), senior (60+).",
      quickCheck: {
        question: "What is printed when score = 85?\nif (score >= 90) System.out.println(\"A\");\nelse if (score >= 80) System.out.println(\"B\");\nelse if (score >= 70) System.out.println(\"C\");",
        options: ["A", "B", "C", "B and C"],
        answer: 1,
        explanation: "score = 85 fails the first check (not >= 90), passes the second (>= 80), prints \"B\", and exits. Only one block executes."
      }
    }
  },
  {
    slug: "nested-conditions",
    title: "Nested Conditions",
    content: {
      definition: "Nested conditions are if statements inside other if statements. They allow checking multiple levels of conditions for complex decision-making.",
      whyItMatters: "Some decisions require checking multiple related conditions. Nested ifs let you build complex logic trees.",
      coreConcept: "An if statement can contain another if statement. The inner if only executes if the outer condition is true. Deeply nested code can become hard to read.",
      syntax: "if (outerCondition) {\n    if (innerCondition) {\n        // both true\n    }\n}",
      javaExample: "int age = 25;\nboolean hasLicense = true;\n\nif (age >= 18) {\n    if (hasLicense) {\n        System.out.println(\"Can drive\");\n    } else {\n        System.out.println(\"Get a license first\");\n    }\n} else {\n    System.out.println(\"Too young to drive\");\n}",
      howItWorks: "1. Check outer condition\n2. If true, enter outer block\n3. Check inner condition\n4. Execute appropriate inner block",
      realWorldUse: "Multi-level validation, game logic (is player alive AND has weapon?), permission checks, eligibility criteria.",
      commonMistakes: [
        "Nesting too deeply (more than 3 levels is hard to read)",
        "Not using else-if when appropriate",
        "Forgetting to handle all cases",
        "Duplicating logic in nested branches"
      ],
      interviewQuestions: [
        { question: "What is the alternative to deeply nested if statements?", answer: "Use else-if chains, combine conditions with &&, extract logic to methods, or use guard clauses (early returns)." },
        { question: "When should you use nested if vs && operator?", answer: "Use && when both conditions are independent checks. Use nested when the inner check is only meaningful if the outer one passes." }
      ],
      quickRevision: "Nested if = if inside if. Inner runs only if outer is true. Avoid deep nesting.",
      practicePrompt: "Rewrite nested conditions using && to combine them. Then decide which version is clearer.",
      quickCheck: {
        question: "When does the innermost block execute in nested if statements?",
        options: [
          "When any condition is true",
          "When the innermost condition is true",
          "When all outer conditions AND innermost condition are true",
          "Always"
        ],
        answer: 2,
        explanation: "In nested ifs, each outer condition must be true to reach the inner condition. All conditions on the path must be true."
      }
    }
  },
  {
    slug: "switch-statement",
    title: "switch Statement",
    content: {
      definition: "The switch statement selects one of many code blocks to execute based on the value of an expression. It's an alternative to long else-if chains for checking specific values.",
      whyItMatters: "switch provides cleaner, more readable code when checking a variable against many specific constant values (integers, strings, enums).",
      coreConcept: "switch compares a value against multiple case constants. When a match is found, execution starts at that case and continues until break or end. No fallthrough with modern switch expressions.",
      syntax: "switch (expression) {\n    case value1:\n        // code\n        break;\n    case value2:\n        // code\n        break;\n    default:\n        // default code\n}",
      javaExample: "int day = 3;\nString dayName;\n\nswitch (day) {\n    case 1: dayName = \"Monday\"; break;\n    case 2: dayName = \"Tuesday\"; break;\n    case 3: dayName = \"Wednesday\"; break;\n    case 4: dayName = \"Thursday\"; break;\n    case 5: dayName = \"Friday\"; break;\n    default: dayName = \"Weekend\";\n}\n\nSystem.out.println(dayName); // Wednesday",
      howItWorks: "1. Evaluate switch expression\n2. Find matching case\n3. Execute from that case\n4. Break exits switch (or fallthrough to next case)\n5. If no match, run default (if present)",
      realWorldUse: "Menu systems, day/month names, command processing, state machines, enum handling, simple text parsing.",
      commonMistakes: [
        "Forgetting break causes fallthrough",
        "Using switch for ranges (use if-else instead)",
        "Switching on non-compatible types (booleans not allowed)",
        "Not handling default case"
      ],
      interviewQuestions: [
        { question: "What happens if you forget break in a case?", answer: "Execution falls through to the next case, executing its code too. This is called fallthrough and is usually a bug (though sometimes intentional)." },
        { question: "What types can be used in a switch statement?", answer: "byte, short, int, char, String (since Java 7), and enum types. Long, float, double, and boolean are not allowed." }
      ],
      quickRevision: "switch checks exact matches. Use break to exit. default handles unmatched. Works with int, char, String, enum.",
      practicePrompt: "Write a switch that converts number 1-7 to day name (Monday-Sunday).",
      quickCheck: {
        question: "What is wrong with this switch?\nswitch(x) {\n  case 1: System.out.println(\"One\");\n  case 2: System.out.println(\"Two\");\n}",
        options: [
          "Nothing wrong",
          "Missing break statements",
          "switch cannot be used with int",
          "Missing default"
        ],
        answer: 1,
        explanation: "Without break, if x is 1, it will print both \"One\" and \"Two\" (fallthrough). Add break after each case to fix."
      }
    }
  },
  {
    slug: "ternary-operator",
    title: "Ternary Operator",
    content: {
      definition: "The ternary operator (? :) is a concise way to write simple if-else statements. It takes three operands: a condition, a value if true, and a value if false.",
      whyItMatters: "Ternary operator makes simple conditional assignments more concise and readable, reducing boilerplate code.",
      coreConcept: "Syntax: condition ? valueIfTrue : valueIfFalse. It's an expression that returns a value. Use for simple conditions; stick to if-else for complex logic.",
      syntax: "result = condition ? value1 : value2;",
      javaExample: "int age = 20;\nString status = (age >= 18) ? \"Adult\" : \"Minor\";\nSystem.out.println(status); // Adult\n\nint a = 10, b = 5;\nint max = (a > b) ? a : b;\nSystem.out.println(max); // 10",
      howItWorks: "1. Evaluate condition\n2. If true, return value1\n3. If false, return value2\n4. The result can be assigned or used in expressions",
      realWorldUse: "Quick assignments, finding max/min, default values, conditional formatting, simple validation.",
      commonMistakes: [
        "Using ternary for complex logic (makes code unreadable)",
        "Nesting ternary operators (avoid this)",
        "Side effects in ternary (like ++ inside)",
        "Using void method calls in ternary"
      ],
      interviewQuestions: [
        { question: "When should you use ternary vs if-else?", answer: "Use ternary for simple value selection based on a condition. Use if-else for complex logic, multiple statements, or when you don't need a return value." },
        { question: "Can you nest ternary operators?", answer: "Yes, but it's strongly discouraged. It makes code hard to read and debug. Use if-else chains instead." }
      ],
      quickRevision: "Ternary: condition ? trueValue : falseValue. Use for simple conditions. Returns a value.",
      practicePrompt: "Rewrite using ternary: if (x > 0) result = \"positive\"; else result = \"non-positive\";",
      quickCheck: {
        question: "What does this return?\nint x = 5;\nString s = x % 2 == 0 ? \"even\" : \"odd\";",
        options: ["\"even\"", "\"odd\"", "Compilation error", "Runtime error"],
        answer: 1,
        explanation: "x = 5, so x % 2 = 1 (not 0). The condition is false, so the ternary returns \"odd\"."
      }
    }
  },
  {
    slug: "break-statement",
    title: "break Statement",
    content: {
      definition: "The break statement immediately exits the nearest enclosing loop or switch statement, transferring control to the statement after it.",
      whyItMatters: "break provides early exit from loops when a condition is met, making code more efficient and readable.",
      coreConcept: "In loops, break stops iteration immediately. In switch, break prevents fallthrough. Cannot be used outside loops or switch (except labeled blocks).",
      syntax: "break;",
      javaExample: "// Break in loop\nfor (int i = 0; i < 10; i++) {\n    if (i == 5) {\n        break;  // exit loop when i is 5\n    }\n    System.out.println(i);\n}\n// Output: 0, 1, 2, 3, 4\n\n// Break in switch\nswitch (day) {\n    case 1:\n        System.out.println(\"Monday\");\n        break;  // prevent fallthrough\n    case 2:\n        System.out.println(\"Tuesday\");\n        break;\n}",
      howItWorks: "1. break statement is encountered\n2. Control immediately exits enclosing loop/switch\n3. Execution continues with statement after the loop/switch",
      realWorldUse: "Search loops (stop when found), input validation loops, menu-driven programs (exit on specific input), early termination.",
      commonMistakes: [
        "Using break outside loops or switch (compile error)",
        "Break exits only the INNERMOST loop in nested loops",
        "Forgetting break in switch causing fallthrough",
        "Using break when continue was intended"
      ],
      interviewQuestions: [
        { question: "What does break do in nested loops?", answer: "break only exits the innermost enclosing loop. To exit outer loops, use labeled break." },
        { question: "What's the difference between break and continue?", answer: "break exits the loop entirely. continue skips the current iteration and moves to the next iteration of the loop." }
      ],
      quickRevision: "break = immediate exit from loop/switch. Exits only innermost loop. Use in switch to prevent fallthrough.",
      practicePrompt: "Write a loop that searches for the number 7 in an array and breaks when found.",
      quickCheck: {
        question: "What happens when break executes inside a for loop?",
        options: [
          "Restarts the loop",
          "Skips to next iteration",
          "Exits the loop immediately",
          "Throws an exception"
        ],
        answer: 2,
        explanation: "break immediately terminates the loop and control continues with the statement after the loop."
      }
    }
  },
  {
    slug: "continue-statement",
    title: "continue Statement",
    content: {
      definition: "The continue statement skips the rest of the current loop iteration and jumps to the next iteration. It's used to skip specific values or cases within a loop.",
      whyItMatters: "continue helps you skip unwanted iterations without using nested if statements, making code cleaner.",
      coreConcept: "In for loops, continue jumps to the update step. In while/do-while, it jumps to the condition check. Use when you want to skip, not exit, specific iterations.",
      syntax: "continue;",
      javaExample: "// Print odd numbers only\nfor (int i = 1; i <= 10; i++) {\n    if (i % 2 == 0) {\n        continue;  // skip even numbers\n    }\n    System.out.println(i);\n}\n// Output: 1, 3, 5, 7, 9",
      howItWorks: "In for loop:\n1. continue encountered\n2. Skip to update step (i++)\n3. Check condition\n4. Continue loop\n\nIn while loop:\n1. continue encountered\n2. Jump to condition check\n3. Continue if condition true",
      realWorldUse: "Filtering data (skip invalid entries), processing only certain items, avoiding deep nesting, skipping specific cases in loops.",
      commonMistakes: [
        "Confusing continue with break",
        "Using continue outside a loop (compile error)",
        "Infinite loops when continue skips the update in while loops",
        "Overusing continue when simple if would be clearer"
      ],
      interviewQuestions: [
        { question: "What is the difference between break and continue?", answer: "break exits the loop entirely. continue skips the current iteration and proceeds to the next iteration." },
        { question: "How does continue behave in a for loop vs while loop?", answer: "In for loop, continue jumps to the update step (i++) then checks condition. In while loop, it jumps directly to condition check—be careful that the update isn't skipped." }
      ],
      quickRevision: "continue = skip current iteration, go to next. In for: updates, then checks. In while: checks condition.",
      practicePrompt: "Write a loop that prints numbers 1-10 but skips 5 using continue.",
      quickCheck: {
        question: "In a while loop, where does continue jump to?",
        options: [
          "Start of loop body",
          "Condition check",
          "Statement after loop",
          "Next iteration automatically"
        ],
        answer: 1,
        explanation: "In while loops, continue jumps to the condition check. This can cause infinite loops if the update statement is after continue."
      }
    }
  },
  {
    slug: "return-statement",
    title: "return Statement",
    content: {
      definition: "The return statement exits the current method and optionally returns a value to the caller. It's used to send results back from methods and to exit methods early.",
      whyItMatters: "return is fundamental to methods—it provides output to the caller and controls when a method stops executing.",
      coreConcept: "For void methods: return; exits the method. For methods with return type: return value; exits and sends a value back. Code after return is unreachable.",
      syntax: "return;           // for void methods\nreturn value;     // for methods with return type",
      javaExample: "public int findMax(int a, int b) {\n    if (a > b) {\n        return a;  // exit and return a\n    }\n    return b;  // exit and return b\n}\n\npublic void printIfPositive(int n) {\n    if (n < 0) {\n        return;  // exit early, print nothing\n    }\n    System.out.println(n);\n}",
      howItWorks: "1. return statement is executed\n2. Method exits immediately\n3. If return has a value, it's passed to caller\n4. Execution continues in the calling method",
      realWorldUse: "Returning calculation results, early exit from methods (guard clauses), terminating recursion, sending data back from methods.",
      commonMistakes: [
        "Code after return is unreachable (compile error)",
        "Forgetting to return a value in non-void method",
        "Returning wrong type",
        "Not returning in all code paths"
      ],
      interviewQuestions: [
        { question: "Can a void method have a return statement?", answer: "Yes, a void method can have 'return;' (without value) to exit early. You cannot return a value from a void method." },
        { question: "What happens if you forget a return statement in a non-void method?", answer: "Compile error: 'missing return statement'. All code paths in a non-void method must return a value." }
      ],
      quickRevision: "return exits method. void: return; Non-void: return value; Code after return is unreachable.",
      practicePrompt: "Write a method that returns \"even\" or \"odd\" based on a number parameter.",
      quickCheck: {
        question: "What is wrong with this method?\npublic int getValue() {\n    if (true) {\n        return 5;\n    }\n}",
        options: [
          "Nothing wrong",
          "Missing return for false case",
          "Cannot use if in method",
          "return must be void"
        ],
        answer: 1,
        explanation: "Though if(true) always runs, the compiler doesn't analyze logic deeply. It sees a path without return. Add a final return or else clause."
      }
    }
  }
];
