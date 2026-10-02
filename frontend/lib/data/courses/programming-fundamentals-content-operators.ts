// Module 3 - Operators & Expressions (8 lessons)
import { CourseLessonContent } from './types';

export const operatorsExpressionsLessons: Array<{
  slug: string;
  title: string;
  content: CourseLessonContent
}> = [
  {
    slug: "what-are-operators",
    title: "What are Operators?",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "Before studying operators, you should understand variables, primitive data types (int, double, boolean), and how values are stored in memory."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "If variables and literals are the nouns of a programming language, operators are the verbs. They instruct the CPU's Arithmetic Logic Unit (ALU) to perform calculations, make comparisons, modify memory locations, or make decisions based on input values (operands)."
        },
        {
          type: "callout",
          title: "Why Operators Exist",
          content: "Without operators, programs could only store static data and never compute, compare, or transform information. Operators form the foundation of all algorithmic decision-making and computational logic."
        },
        {
          type: "text",
          title: "Operands and Arity (Classification by Operand Count)",
          content: "The data items an operator acts upon are called operands. Operators are classified into three categories based on how many operands they take:\n\n1. Unary Operators (1 operand):\n   Act on a single value (e.g. `++x`, `-count`, `!isActive`).\n\n2. Binary Operators (2 operands):\n   Act between two values (e.g. `a + b`, `x * y`, `age >= 18`). Most operators in programming are binary.\n\n3. Ternary Operators (3 operands):\n   Act across three expressions (the conditional operator `condition ? expr1 : expr2`)."
        },
        {
          type: "table",
          title: "Major Operator Categories in Java",
          headers: ["Category", "Symbols", "Purpose", "Sample Expression", "Return Type"],
          rows: [
            ["Arithmetic", "+, -, *, /, %", "Mathematical calculations", "15 + 4", "Numeric (int/double/etc.)"],
            ["Assignment", "=, +=, -=, *=, /=", "Store or update values in memory", "score += 10", "Value assigned"],
            ["Relational", "==, !=, <, >, <=, >=", "Compare two values", "age >= 18", "boolean (true/false)"],
            ["Logical", "&&, ||, !", "Combine or invert boolean conditions", "isMember && hasCoupon", "boolean (true/false)"],
            ["Bitwise / Shift", "&, |, ^, ~, <<, >>, >>>", "Manipulate individual binary bits", "flags & 0b0010", "Integral (int/long)"],
            ["Ternary", "? :", "Inline conditional expression", "score >= 50 ? \"Pass\" : \"Fail\"", "Matches branch types"]
          ]
        },
        {
          type: "text",
          title: "Expressions vs Statements & Side Effects",
          content: "• Expression: Any valid combination of variables, literals, and operators that evaluates to a single value (e.g. `5 + 3`, `a > b`).\n\n• Statement: A complete unit of execution terminated by a semicolon (e.g. `int total = a + b;`).\n\n• Side Effect: When an operator modifies state in memory during evaluation. Most arithmetic operators (`+`, `*`) are pure (no side effects), whereas assignment (`=`, `+=`) and increment (`++`) produce side effects."
        },
        {
          type: "code",
          title: "Operators in Action",
          code: "int a = 20;\nint b = 6;\n\n// Arithmetic (returns number)\nint sum = a + b; // 26\nint quotient = a / b; // 3 (integer division)\n\n// Relational (returns boolean)\nboolean isGreater = a > b; // true\n\n// Side-effect assignment\na += 5; // a is now 25\n\n// Ternary expression\nString status = (a >= 25) ? \"High\" : \"Normal\"; // \"High\"",
          language: "java",
          explanation: "Expressions can be nested and chained together according to precedence rules to form complex calculations."
        },
        {
          type: "tryIt",
          title: "Try It: Predict Side Effects and Results",
          code: "int x = 10;\nint y = (x = 20) + 5;\nSystem.out.println(\"x = \" + x + \", y = \" + y);",
          expectedOutput: "x = 20, y = 25",
          explanation: "The assignment expression '(x = 20)' assigns 20 to x and evaluates to 20. Then 20 + 5 evaluates to 25 and is assigned to y."
        },
        {
          type: "dryRun",
          title: "Expression Evaluation Trace",
          iterations: [
            { step: 1, variables: { a: "10", b: "5", result: "unassigned" }, description: "Initial variables in memory." },
            { step: 2, variables: { "a * 2": "20", "b": "5" }, description: "Evaluate higher-precedence multiplication 'a * 2' yielding 20." },
            { step: 3, variables: { "20 + b": "25" }, description: "Evaluate addition '20 + 5' yielding 25." },
            { step: 4, variables: { result: "25" }, description: "Assign the final calculated value 25 to variable result." }
          ]
        },
        {
          type: "warning",
          title: "Common Mistakes with Operators",
          items: [
            "Confusing single equals '=' (assignment) with double equals '==' (equality check).",
            "Assuming all operators evaluate strictly left-to-right without considering operator precedence.",
            "Writing complex nested expressions with side effects (like 'a++ + ++a * a--') which makes code unreadable and prone to undefined bugs."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Operator Basics",
          traps: [
            {
              question: "Does the assignment operator '=' return a value in Java?",
              trap: "Thinking '=' only executes a statement without returning anything.",
              solution: "Yes! In Java, an assignment is an expression that returns the assigned value. That is why chained assignments like 'a = b = c = 10;' and conditions like 'if ((line = reader.readLine()) != null)' are valid syntax."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "How many operands does the ternary operator '? :' require?",
          options: [
            "1 operand",
            "2 operands",
            "3 operands",
            "Variable number of operands"
          ],
          answer: 2,
          explanation: "The ternary operator is the only 3-operand operator in Java: (1) condition, (2) value if true, and (3) value if false."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Operators perform actions on operands (unary = 1, binary = 2, ternary = 3).",
            "Expressions produce values; statements execute complete actions.",
            "Operators like ++ and = produce side effects by mutating variable values in memory."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Now that you understand what operators and operands are, the next lesson delves into Arithmetic Operators (+, -, *, /, %), exploring integer division truncation, modulo remainder rules with negative numbers, and floating-point arithmetic."
        }
      ]
    }
  },
  {
    slug: "arithmetic-operators",
    title: "Arithmetic Operators",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand primitive numeric types (int, long, double) and how binary expressions evaluate in Java."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Arithmetic operators mimic elementary mathematics (+, -, ×, ÷), but with strict digital hardware rules regarding bit capacity, integer division truncation, and sign preservation in remainders."
        },
        {
          type: "table",
          title: "The 5 Arithmetic Operators",
          headers: ["Operator", "Name", "Description", "Example", "Result"],
          rows: [
            ["+", "Addition", "Adds two numeric values; concatenates strings", "10 + 5", "15"],
            ["-", "Subtraction", "Subtracts right operand from left operand", "10 - 3", "7"],
            ["*", "Multiplication", "Multiplies two numbers", "4 * 6", "24"],
            ["/", "Division", "Divides left operand by right (truncates if both int)", "17 / 5", "3"],
            ["%", "Modulo (Remainder)", "Returns remainder after integer division", "17 % 5", "2"]
          ]
        },
        {
          type: "text",
          title: "Deep Dive: Integer Division vs Floating-Point Division",
          content: "When both operands in a division are integers (byte, short, int, long), Java performs integer division. It truncates the decimal portion entirely towards zero:\n\n• `7 / 2` &rarr; `3` (not `3.5`!)\n• `-7 / 2` &rarr; `-3`\n\nTo retain decimal precision, at least one operand must be a floating-point type (`float` or `double`):\n• `7.0 / 2` &rarr; `3.5`\n• `(double) 7 / 2` &rarr; `3.5`"
        },
        {
          type: "text",
          title: "The Modulo (%) Operator & Sign Rules",
          content: "The modulo operator calculates the remainder of division using the formula:\n`a % b = a - (a / b) * b`\n\nKey Rule for Sign:\nIn Java, the sign of the modulo result is ALWAYS determined by the numerator (dividend `a`), NEVER by the divisor `b`:\n\n• `17 % 5` &rarr; `2`\n• `-17 % 5` &rarr; `-2` (numerator is negative)\n• `17 % -5` &rarr; `2` (sign of divisor is ignored!)\n• `-17 % -5` &rarr; `-2`\n\nPractical Uses of Modulo:\n1. Even/Odd checks: `n % 2 == 0`\n2. Cyclic array indexing: `index = (index + 1) % arrayLength`\n3. Extracting digits: `lastDigit = number % 10`"
        },
        {
          type: "code",
          title: "String Concatenation Overloading with '+'",
          code: "// Left-to-right evaluation with string concatenation\nSystem.out.println(\"Total: \" + 10 + 20);   // \"Total: 1020\"\nSystem.out.println(10 + 20 + \" Total\");   // \"30 Total\"\nSystem.out.println(\"Total: \" + (10 + 20)); // \"Total: 30\"\n\n// Division by zero behavior\ntry {\n    int error = 10 / 0; // Throws ArithmeticException: / by zero\n} catch (ArithmeticException e) {\n    System.out.println(\"Integer division by zero throws exception!\");\n}\n\ndouble inf = 10.0 / 0.0; // Produces Infinity (no exception in floating-point!)\ndouble nan = 0.0 / 0.0;   // Produces NaN (Not a Number)",
          language: "java",
          explanation: "The '+' operator is overloaded: if either operand is a String, it converts the other operand to String and concatenates. For division by zero, integer arithmetic throws ArithmeticException while floating-point arithmetic returns Infinity or NaN."
        },
        {
          type: "tryIt",
          title: "Try It: Modulo and String Precedence",
          code: "int a = -13;\nint b = 5;\nSystem.out.println(\"Result: \" + a % b + \" and \" + (a % b));",
          expectedOutput: "Result: -3 and -3",
          explanation: "'-13 % 5' evaluates to -3 (sign matches dividend -13). In the first part, '%' has higher precedence than '+', so 'a % b' is evaluated first to -3, then concatenated."
        },
        {
          type: "dryRun",
          title: "Modulo Formula Trace: -14 % 4",
          iterations: [
            { step: 1, variables: { a: "-14", b: "4" }, description: "Operands set: a = -14, b = 4." },
            { step: 2, variables: { "a / b": "-3" }, description: "Integer division: -14 / 4 = -3 (truncated towards 0)." },
            { step: 3, variables: { "(a / b) * b": "-12" }, description: "Multiply by divisor: -3 * 4 = -12." },
            { step: 4, variables: { "a - ((a/b)*b)": "-2" }, description: "Subtract from a: -14 - (-12) = -2. The result is -2." }
          ]
        },
        {
          type: "warning",
          title: "Common Arithmetic Mistakes",
          items: [
            "Integer division precision loss: 'double rate = 1 / 4;' gives 0.0 because 1/4 evaluates to integer 0 before assignment.",
            "Testing for odd numbers with 'n % 2 == 1': Fails for negative odd numbers (e.g. -5 % 2 is -1, not 1). Always use 'n % 2 != 0'.",
            "Assuming floating-point division by zero crashes the program: '5.0 / 0' results in 'Double.POSITIVE_INFINITY' rather than throwing an exception."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Arithmetic",
          traps: [
            {
              question: "How do you write a foolproof method to check if an integer 'n' is odd in Java?",
              trap: "Writing 'return n % 2 == 1;'.",
              solution: "Use 'return n % 2 != 0;' or bitwise 'return (n & 1) != 0;'. 'n % 2 == 1' fails for negative odd numbers because -3 % 2 evaluates to -1."
            },
            {
              question: "What is the difference between (10 / 0) and (10.0 / 0.0)?",
              trap: "Claiming both throw an ArithmeticException.",
              solution: "'10 / 0' is integer division and throws runtime 'ArithmeticException: / by zero'. '10.0 / 0.0' follows IEEE 754 floating-point standards and returns 'Double.POSITIVE_INFINITY' without throwing any exception."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "What is the output of: System.out.println(1 + 2 + \"3\" + 4 + 5);",
          options: [
            "\"12345\"",
            "\"3345\"",
            "\"339\"",
            "\"15\""
          ],
          answer: 1,
          explanation: "Evaluation proceeds left to right: 1 + 2 = 3 (int addition). 3 + \"3\" = \"33\" (string concatenation). \"33\" + 4 = \"334\". \"334\" + 5 = \"3345\"."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Integer division truncates decimals towards zero. Use at least one double/float operand to preserve decimals.",
            "Modulo sign in Java matches the dividend (numerator), not the divisor.",
            "To check for odd numbers across all integers, use 'n % 2 != 0'.",
            "Floating point division by zero yields Infinity/NaN, while integer division by zero throws ArithmeticException."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Assignment Operators (=, +=, -=, *=, %=), examining compound assignments, chaining, and the compiler's implicit type casting rules."
        }
      ]
    }
  },
  {
    slug: "assignment-operators",
    title: "Assignment Operators",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand variables, data types, and arithmetic operators."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of the assignment operator '=' as an arrow (&larr;) storing the computed value of the right-hand expression into the memory box labeled on the left. Compound operators like '+=' combine an arithmetic operation with assignment in a single, atomic-like shorthand."
        },
        {
          type: "table",
          title: "Compound Assignment Operators in Java",
          headers: ["Operator", "Example", "Equivalent Expansion", "Hidden Cast Mechanism"],
          rows: [
            ["=", "x = 10", "x = 10", "None"],
            ["+=", "x += 5", "x = x + 5", "x = (typeOf(x))(x + 5)"],
            ["-=", "x -= 3", "x = x - 3", "x = (typeOf(x))(x - 3)"],
            ["*=", "x *= 4", "x = x * 4", "x = (typeOf(x))(x * 4)"],
            ["/=", "x /= 2", "x = x / 2", "x = (typeOf(x))(x / 2)"],
            ["%=", "x %= 3", "x = x % 3", "x = (typeOf(x))(x % 3)"],
            ["&=", "x &= mask", "x = x & mask", "x = (typeOf(x))(x & mask)"],
            ["|=", "x |= flag", "x = x | flag", "x = (typeOf(x))(x | flag)"],
            ["^=", "x ^= key", "x = x ^ key", "x = (typeOf(x))(x ^ key)"],
            ["<<=", "x <<= 2", "x = x << 2", "x = (typeOf(x))(x << 2)"],
            [">>=", "x >>= 1", "x = x >> 1", "x = (typeOf(x))(x >> 1)"]
          ]
        },
        {
          type: "text",
          title: "The Hidden Implicit Cast Feature of Compound Operators",
          content: "A fundamental technical detail in Java is that compound assignment operators (`+=`, `*=`, etc.) automatically insert an explicit cast to the type of the left-hand variable.\n\nCompare these two code snippets:\n\n1. Standard assignment:\n`byte b = 10;`\n`b = b + 5;` &rarr; COMPILE ERROR! (`b + 5` promotes to `int`, cannot assign to `byte`)\n\n2. Compound assignment:\n`byte b = 10;`\n`b += 5;` &rarr; COMPILES CLEANLY! (Java translates this to `b = (byte)(b + 5)`)\n\nThis makes compound operators both convenient and subtly dangerous if overflow occurs."
        },
        {
          type: "code",
          title: "Chained and Complex Assignments",
          code: "// 1. Chained assignment (Right-to-Left associativity)\nint a, b, c;\na = b = c = 100; // All three variables become 100\n\n// 2. Compound assignment with expressions on right side\nint x = 5;\n// Note: right-hand side is fully evaluated first before the operation\nx *= 2 + 3; // Equivalent to: x = x * (2 + 3) -> x = 5 * 5 = 25 (NOT 5 * 2 + 3 = 13!)\nSystem.out.println(\"x = \" + x); // 25\n\n// 3. Increment within compound assignments (avoid in production!)\nint k = 10;\nk += (k = 3); // Java evaluates left operand 'k' (10) first, then assigns 3, then 10 + 3 = 13\nSystem.out.println(\"k = \" + k); // 13",
          language: "java",
          explanation: "In compound assignment 'x *= 2 + 3', the entire right-hand expression is grouped with implicit parentheses as 'x = x * (2 + 3)'."
        },
        {
          type: "tryIt",
          title: "Try It: Compound Assignment with Right-Hand Expressions",
          code: "int val = 8;\nval /= 2 + 2;\nSystem.out.println(\"val = \" + val);",
          expectedOutput: "val = 2",
          explanation: "The right-hand expression '2 + 2' evaluates to 4 first. Then 'val = val / 4' produces 8 / 4 = 2."
        },
        {
          type: "dryRun",
          title: "Compound Cast Trace: byte b = 120; b += 10;",
          iterations: [
            { step: 1, variables: { "b (byte)": "120" }, description: "Initial byte value 120." },
            { step: 2, variables: { "sum (int)": "130" }, description: "Evaluate 120 + 10 as 32-bit int 130 (binary 00000000 ... 10000010)." },
            { step: 3, variables: { "cast (byte)": "-126" }, description: "Implicit cast '(byte) 130' truncates to lowest 8 bits (10000010), representing -126 in two's complement." },
            { step: 4, variables: { "b (final)": "-126" }, description: "b is assigned -126 without any compiler error or runtime exception." }
          ]
        },
        {
          type: "warning",
          title: "Common Assignment Pitfalls",
          items: [
            "Using '=' inside an 'if' condition: 'if (isReady = true)' assigns true instead of comparing (always use '==').",
            "Assuming 'x *= 2 + 3' equals 'x * 2 + 3': Right-hand expression is always evaluated with full parentheses.",
            "Unintended silent overflow with compound operators on byte/short/char."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Assignment",
          traps: [
            {
              question: "Why does 'short s = 10; s = s + 5;' fail to compile, while 's += 5;' compiles without error?",
              trap: "Thinking they are completely identical in the compiler.",
              solution: "'s = s + 5' promotes 's' to int, producing an int result that cannot be assigned to short without explicit casting. In contrast, 's += 5' is defined by the JLS (§15.26.2) to include an implicit cast: 's = (short)(s + 5)'."
            },
            {
              question: "What is the value of 'a' after: int a = 5; a += (a = 2);?",
              trap: "Thinking 'a' becomes 4 (2 + 2) or 2.",
              solution: "Java evaluates the left-hand operand of '+=' first (retaining the value 5). Then the right-hand side executes '(a = 2)' setting a to 2. Finally, 5 + 2 is added and assigned to a, resulting in 7."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "If int n = 6;, what is the value of n after: n *= 3 + 2;?",
          options: [
            "20",
            "30",
            "11",
            "Compile error"
          ],
          answer: 1,
          explanation: "'n *= 3 + 2' evaluates as 'n = n * (3 + 2)' -> 6 * 5 = 30."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Assignment '=' is right-to-left associative and returns the assigned value.",
            "Compound operators (+=, -=, *=, /=) evaluate the entire right-hand expression first.",
            "Compound operators contain built-in implicit type casts: 'E1 op= E2' is equivalent to 'E1 = (T)(E1 op (E2))'."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we examine Relational Operators (==, !=, <, >, <=, >=) to compare numbers, understand reference equality vs value equality, and avoid floating-point comparison pitfalls."
        }
      ]
    }
  },
  {
    slug: "relational-operators",
    title: "Relational Operators",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand primitive types, boolean values (true/false), and basic assignment operators."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Relational operators are balance scales. They take two values, inspect their numerical or reference relationship, and output a boolean verdict (`true` or `false`). They are the decision engines for conditional branching (`if`, `while`, `for`)."
        },
        {
          type: "table",
          title: "The 6 Relational Operators in Java",
          headers: ["Operator", "Meaning", "Sample Expression", "Evaluates To", "Applicable Types"],
          rows: [
            ["==", "Equal to", "5 == 5", "true", "Primitives & Object References"],
            ["!=", "Not equal to", "5 != 3", "true", "Primitives & Object References"],
            [">", "Strictly greater than", "10 > 5", "true", "Numeric primitives (int, double, char)"],
            ["<", "Strictly less than", "4 < 8", "true", "Numeric primitives (int, double, char)"],
            [">=", "Greater than or equal to", "5 >= 5", "true", "Numeric primitives (int, double, char)"],
            ["<=", "Less than or equal to", "6 <= 2", "false", "Numeric primitives (int, double, char)"]
          ]
        },
        {
          type: "text",
          title: "Primitive Value Equality vs Object Reference Equality",
          content: "A major source of bugs in Java is confusing primitive comparison with object comparison:\n\n1. For Primitives (`int`, `double`, `char`):\n   `==` compares the raw binary value stored in the variable.\n   `5 == 5` &rarr; `true`\n   `'A' == 65` &rarr; `true` (char 'A' is Unicode value 65)\n\n2. For Objects (`String`, `Integer`, custom classes):\n   `==` compares heap memory addresses (references), NOT content!\n   `String s1 = new String(\"hello\");`\n   `String s2 = new String(\"hello\");`\n   `s1 == s2` &rarr; `false` (two different objects on the heap)\n   `s1.equals(s2)` &rarr; `true` (compares text contents)"
        },
        {
          type: "code",
          title: "Relational Operations & Comparison Traps",
          code: "// 1. Character comparison (uses Unicode numeric values)\nchar letter = 'B';\nboolean isUpper = (letter >= 'A' && letter <= 'Z'); // true ('B' is 66, between 65 and 90)\n\n// 2. Floating-point comparison gotcha (IEEE 754 precision)\ndouble val1 = 0.1 + 0.2; // 0.30000000000000004\ndouble val2 = 0.3;\nboolean badCheck = (val1 == val2); // false!\n\n// Correct way to compare floating points: Epsilon comparison\nfinal double EPSILON = 1e-9;\nboolean goodCheck = Math.abs(val1 - val2) < EPSILON; // true\n\n// 3. Reference vs Content comparison\nString a = new String(\"Java\");\nString b = new String(\"Java\");\nSystem.out.println(\"== : \" + (a == b));           // false\nSystem.out.println(\"equals : \" + a.equals(b)); // true",
          language: "java",
          explanation: "Never use '==' for floating point values without an epsilon tolerance, and never use '==' to compare String contents."
        },
        {
          type: "tryIt",
          title: "Try It: Character and Integer Comparison",
          code: "char ch = 'a';\nint num = 97;\nSystem.out.println((ch == num) + \" and \" + (ch > 'A'));",
          expectedOutput: "true and true",
          explanation: "In 'ch == num', char 'a' has ASCII code 97, so 97 == 97 is true. In 'ch > 'A'', 'a' (97) is greater than 'A' (65), so it evaluates to true."
        },
        {
          type: "dryRun",
          title: "Conditional Comparison Trace",
          iterations: [
            { step: 1, variables: { score: "85", passing: "70" }, description: "Student score set to 85, passing mark is 70." },
            { step: 2, variables: { condition: "score >= passing" }, description: "Evaluate 85 >= 70." },
            { step: 3, variables: { verdict: "true" }, description: "Relation holds true; conditional branch allows entry." }
          ]
        },
        {
          type: "warning",
          title: "Common Relational Operator Mistakes",
          items: [
            "Chaining relational comparisons like in math: '10 < x < 20' is INVALID Java syntax! You must write '(10 < x) && (x < 20)'.",
            "Using '==' for String comparisons instead of '.equals()'.",
            "Using '<=' or '>=' when strict '<' or '>' was required, causing off-by-one errors in loops."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Relational Operators",
          traps: [
            {
              question: "Why does (Double.NaN == Double.NaN) evaluate to false in Java?",
              trap: "Assuming everything equals itself.",
              solution: "According to the IEEE 754 standard and Java Language Specification, NaN (Not a Number) is defined to be unequal to every value, including itself. To check if a value is NaN, you must call 'Double.isNaN(x)'."
            },
            {
              question: "What is the difference between: 's1 == s2' and 's1.equals(s2)'?",
              trap: "Saying they do the same thing for strings.",
              solution: "'s1 == s2' checks if both variables reference the exact same memory address on the heap. 's1.equals(s2)' compares the sequence of characters inside the String objects."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Which expression correctly checks if variable 'x' is between 1 and 10 inclusive?",
          options: [
            "1 <= x <= 10",
            "x >= 1 & x <= 10",
            "x >= 1 && x <= 10",
            "1 <= x and x <= 10"
          ],
          answer: 2,
          explanation: "In Java, range checks must be combined with logical AND (&&): 'x >= 1 && x <= 10'. Java does not support mathematical chained comparisons like '1 <= x <= 10'."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "All relational operators return a boolean (true or false).",
            "Use '==' for primitives, but use '.equals()' for Objects (Strings, Collections).",
            "Compare floating-point numbers with an epsilon tolerance 'Math.abs(a - b) < 1e-9'.",
            "Range checks cannot be chained as 'a < b < c'; write '(a < b) && (b < c)'."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Now that you understand comparisons, the next lesson explores Logical Operators (&&, ||, !) and Short-Circuit Evaluation, enabling you to build complex multi-condition decisions."
        }
      ]
    }
  },
  {
    slug: "logical-operators",
    title: "Logical Operators",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand boolean variables (true/false) and relational operators (==, !=, <, >)."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Logical operators combine individual truth statements into compound decisions, exactly like logical gates (AND, OR, NOT) in computer hardware. They act as decision trees, determining whether a multi-part condition is met."
        },
        {
          type: "table",
          title: "The Core Logical Operators in Java",
          headers: ["Operator", "Name", "Truth Condition", "Example Expression", "Result"],
          rows: [
            ["&&", "Logical AND (Short-Circuit)", "True only if BOTH operands are true", "true && false", "false"],
            ["||", "Logical OR (Short-Circuit)", "True if AT LEAST ONE operand is true", "true || false", "true"],
            ["!", "Logical NOT (Inversion)", "Inverts boolean value (true→false, false→true)", "!false", "true"],
            ["^", "Logical XOR (Exclusive OR)", "True if operands are DIFFERENT", "true ^ false", "true"],
            ["&", "Boolean Logical AND (Non-Short-Circuit)", "Evaluates BOTH operands, true if both true", "true & false", "false"],
            ["|", "Boolean Logical OR (Non-Short-Circuit)", "Evaluates BOTH operands, true if either true", "true | false", "true"]
          ]
        },
        {
          type: "text",
          title: "Short-Circuit Evaluation: A Vital Safety Feature",
          content: "Java's `&&` and `||` operators employ Short-Circuit Evaluation to optimize performance and prevent runtime crashes:\n\n1. For `A && B` (Short-Circuit AND):\n   If `A` is `false`, Java immediately concludes the entire expression is `false` without ever evaluating `B`.\n\n2. For `A || B` (Short-Circuit OR):\n   If `A` is `true`, Java immediately concludes the entire expression is `true` without ever evaluating `B`.\n\nGuard Clause Pattern:\nShort-circuiting is essential for preventing NullPointerExceptions and division by zero:\n• `if (user != null && user.isActive())` &rarr; If user is null, `user.isActive()` is never called!\n• `if (count != 0 && total / count > 5)` &rarr; If count is 0, division by zero never occurs!"
        },
        {
          type: "text",
          title: "De Morgan's Laws for Simplifying Conditions",
          content: "De Morgan's Laws provide mathematical rules for negating complex logical expressions:\n\n1. `!(A && B)` is equivalent to `!A || !B`\n   (\"Not (sunny AND warm)\" means \"Not sunny OR Not warm\")\n\n2. `!(A || B)` is equivalent to `!A && !B`\n   (\"Not (raining OR snowing)\" means \"Not raining AND Not snowing\")\n\nApplying De Morgan's laws often simplifies complex nested conditions and makes business logic much easier to test."
        },
        {
          type: "code",
          title: "Short-Circuiting and Guard Clauses in Practice",
          code: "String username = null;\n\n// 1. Guard against NullPointerException using && short-circuit\nif (username != null && username.length() > 3) {\n    System.out.println(\"Valid username: \" + username);\n} else {\n    System.out.println(\"Username is null or too short\"); // Safely executed!\n}\n\n// 2. Side-effect demonstration with short-circuiting\nint counter = 0;\nboolean test = (5 > 10) && (++counter > 0); // 5 > 10 is false, ++counter is SKIPPED\nSystem.out.println(\"counter after &&: \" + counter); // counter is still 0!\n\n// 3. Non-short-circuit '&' always evaluates right side\nboolean test2 = (5 > 10) & (++counter > 0); // ++counter RUNS\nSystem.out.println(\"counter after &: \" + counter);  // counter is now 1!",
          language: "java",
          explanation: "In production code, always use '&&' and '||' for boolean logic. Only use single '&' and '|' when bitwise integer manipulation is explicitly intended."
        },
        {
          type: "tryIt",
          title: "Try It: Predict Short-Circuit Behavior",
          code: "int a = 10, b = 20;\nboolean check = (a > 5) || (++b > 20);\nSystem.out.println(\"check = \" + check + \", b = \" + b);",
          expectedOutput: "check = true, b = 20",
          explanation: "Because '(a > 5)' evaluates to true, the short-circuit OR ('||') immediately halts evaluation without executing '++b'. Therefore, 'b' remains 20."
        },
        {
          type: "dryRun",
          title: "Guard Clause Evaluation Trace",
          iterations: [
            { step: 1, variables: { "str": "null" }, description: "String reference initialized to null." },
            { step: 2, variables: { "str != null": "false" }, description: "Evaluate left side of '&&': 'str != null' yields false." },
            { step: 3, variables: { "short-circuit": "active" }, description: "Right-hand 'str.isEmpty()' is skipped entirely." },
            { step: 4, variables: { "result": "false" }, description: "Entire condition evaluates to false without throwing NullPointerException." }
          ]
        },
        {
          type: "warning",
          title: "Common Logical Operator Mistakes",
          items: [
            "Accidentally using '&' or '|' instead of '&&' or '||', losing short-circuit protection and risking NullPointerException.",
            "Confusing bitwise XOR '^' with mathematical power/exponent (in Java, 2^3 is bitwise XOR, not 8; use Math.pow(2,3) for powers).",
            "Negating compound expressions incorrectly without applying De Morgan's Laws."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Logical Operators",
          traps: [
            {
              question: "What is the key difference between '&&' and '&' when applied to boolean operands?",
              trap: "Claiming '&' cannot be used on booleans.",
              solution: "'&' can be used on booleans, but it is a non-short-circuit logical operator that evaluates both operands unconditionally. '&&' is short-circuiting: if the left operand is false, the right operand is not evaluated."
            },
            {
              question: "How would you rewrite: '!(age >= 18 && hasTicket)' without using the outer '!' operator?",
              trap: "Writing 'age < 18 && !hasTicket'.",
              solution: "By De Morgan's Law, '!(A && B)' becomes '!A || !B'. Thus: '(age < 18 || !hasTicket)'."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Given int x = 0; if (x != 0 && 100 / x > 2), what happens?",
          options: [
            "Throws ArithmeticException: / by zero",
            "Condition evaluates to false safely",
            "Condition evaluates to true",
            "Compile-time error"
          ],
          answer: 1,
          explanation: "Because 'x != 0' is false, the '&&' operator short-circuits and never evaluates '100 / x > 2', preventing an ArithmeticException."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "&& (AND) and || (OR) use short-circuit evaluation, skipping right-hand evaluation when result is already decided.",
            "Always use short-circuiting to build safe guard clauses (null checks, zero division checks).",
            "De Morgan's Laws: !(A && B) = !A || !B, and !(A || B) = !A && !B."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Unary Operators (+, -, ++, --, !, ~), focusing on the critical differences between prefix (++x) and postfix (x++) evaluation."
        }
      ]
    }
  },
  {
    slug: "unary-operators",
    title: "Unary Operators",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand variables, memory assignment, and basic arithmetic expressions."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Unary operators act on a single variable or value. They modify signs, invert boolean states, or increment/decrement values in place. The crucial distinction lies between doing something BEFORE reading a value (prefix) vs AFTER reading it (postfix)."
        },
        {
          type: "table",
          title: "Unary Operators in Java",
          headers: ["Operator", "Name", "Description", "Example", "Result"],
          rows: [
            ["+", "Unary Plus", "Indicates positive value (default in Java)", "+5", "5"],
            ["-", "Unary Minus", "Negates an arithmetic expression", "-count", "Inverts sign"],
            ["++ (prefix)", "Prefix Increment", "Increments variable by 1, returns NEW value", "++x", "x becomes x+1, returns x+1"],
            ["++ (postfix)", "Postfix Increment", "Returns CURRENT value, then increments variable", "x++", "returns old x, then x becomes x+1"],
            ["-- (prefix)", "Prefix Decrement", "Decrements variable by 1, returns NEW value", "--x", "x becomes x-1, returns x-1"],
            ["-- (postfix)", "Postfix Decrement", "Returns CURRENT value, then decrements variable", "x--", "returns old x, then x becomes x-1"],
            ["!", "Logical NOT", "Inverts a boolean value", "!isReady", "true ↔ false"],
            ["~", "Bitwise Complement", "Inverts all bits of an integer (Two's complement ~x = -x-1)", "~5", "-6"]
          ]
        },
        {
          type: "text",
          title: "Prefix vs Postfix Mechanics in Memory & Bytecode",
          content: "Understanding prefix vs postfix is essential for interview questions and loop counters:\n\n1. Prefix (`++x`):\n   • Step 1: Increment variable `x` in memory immediately.\n   • Step 2: Return the newly incremented value to the enclosing expression.\n\n2. Postfix (`x++`):\n   • Step 1: Store a temporary copy of the current value of `x` for the expression.\n   • Step 2: Increment variable `x` in memory.\n   • Step 3: Return the old temporary copy to the enclosing expression."
        },
        {
          type: "code",
          title: "Prefix vs Postfix in Complex Expressions",
          code: "int a = 5;\nint b = ++a; // Prefix: a becomes 6, then 6 is assigned to b\nSystem.out.println(\"a = \" + a + \", b = \" + b); // a = 6, b = 6\n\nint x = 5;\nint y = x++; // Postfix: old value 5 assigned to y, then x becomes 6\nSystem.out.println(\"x = \" + x + \", y = \" + y); // x = 6, y = 5\n\n// Complex multi-increment expression:\nint i = 3;\nint result = i++ + ++i * 2;\n// 1. i++ evaluates to 3 (i is now 4)\n// 2. ++i increments i to 5 and evaluates to 5\n// 3. Multiplication: 5 * 2 = 10\n// 4. Addition: 3 + 10 = 13\nSystem.out.println(\"result = \" + result + \", i = \" + i); // result = 13, i = 5",
          language: "java",
          explanation: "In expressions with multiple increments, Java strictly evaluates operands left-to-right, maintaining state updates in memory as each unary operation runs."
        },
        {
          type: "tryIt",
          title: "Try It: The Famous 'x = x++' Trap",
          code: "int x = 10;\nx = x++;\nSystem.out.println(\"x = \" + x);",
          expectedOutput: "x = 10",
          explanation: "Here is why x remains 10: 1) Java evaluates the right-hand side 'x++', saving temporary value 10. 2) 'x' is incremented to 11 in memory. 3) The assignment '=' overwrites 'x' with the saved temporary value (10)! Hence, x remains 10."
        },
        {
          type: "dryRun",
          title: "Expression Evaluation Trace: int a = 2; int res = a++ + ++a;",
          iterations: [
            { step: 1, variables: { a: "2", res: "unassigned" }, description: "Initial value: a = 2." },
            { step: 2, variables: { "left operand": "2", "a in memory": "3" }, description: "Evaluate 'a++': yields 2 for expression, increments memory a to 3." },
            { step: 3, variables: { "right operand": "4", "a in memory": "4" }, description: "Evaluate '++a': increments memory a to 4, yields 4 for expression." },
            { step: 4, variables: { res: "6", "a final": "4" }, description: "Compute 2 + 4 = 6, assign to res." }
          ]
        },
        {
          type: "warning",
          title: "Best Practice: Avoid Complex Unary Combinations",
          items: [
            "Never write code like 'a = a++ + ++a - a--' in production software. It is confusing, difficult to maintain, and prone to bugs.",
            "Use increment/decrement as standalone statements in loops: 'for (int i = 0; i < n; i++)' or 'i++;'."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Unary Operators",
          traps: [
            {
              question: "What is the value of 'count' after executing: int count = 0; for(int i=0; i<5; i++) count = count++;?",
              trap: "Thinking count becomes 5.",
              solution: "'count' is 0! Because 'count = count++' retrieves old value 0, increments count to 1, then overwrites count with old value 0 on every iteration."
            },
            {
              question: "What is the value of bitwise complement: ~5?",
              trap: "Thinking it is -5.",
              solution: "In Two's Complement arithmetic, ~x is defined as '-(x + 1)'. Therefore, ~5 evaluates to -6."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "If int p = 4; int q = --p + p++; what are the values of p and q?",
          options: [
            "p = 4, q = 6",
            "p = 4, q = 7",
            "p = 3, q = 6",
            "p = 5, q = 8"
          ],
          answer: 0,
          explanation: "1) '--p' decrements p to 3 and evaluates to 3. 2) 'p++' evaluates to 3 and then increments p to 4. 3) q = 3 + 3 = 6. Finally, p = 4 and q = 6."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Prefix (++x, --x) modifies the variable first and returns the new value.",
            "Postfix (x++, x--) returns the current value first and then modifies the variable.",
            "Assignment 'x = x++' does not increment x because the old value overwrites the updated memory value.",
            "Bitwise NOT '~x' equals '-(x + 1)'."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Bitwise & Shift Operators (&, |, ^, ~, <<, >>, >>>), learning how to manipulate binary bits for high-performance computing, masks, and flags."
        }
      ]
    }
  },
  {
    slug: "bitwise-operators",
    title: "Bitwise Operators",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand binary numbers (base 2), Two's complement representation, and primitive integer types (byte, int, long)."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Bitwise operators operate directly on individual binary columns (bits) inside CPU registers. Instead of treating `5` as a decimal concept, bitwise operators see `00000101` and manipulate each wire/bit independently."
        },
        {
          type: "table",
          title: "Bitwise & Shift Operators in Java",
          headers: ["Operator", "Name", "Logic Rule", "Example (4-bit)", "Mathematical Equivalent"],
          rows: [
            ["&", "Bitwise AND", "1 only if BOTH bits are 1", "0101 & 0011 = 0001 (1)", "Bit masking (clearing bits)"],
            ["|", "Bitwise OR", "1 if EITHER bit is 1", "0101 | 0011 = 0111 (7)", "Bit setting (turning bits on)"],
            ["^", "Bitwise XOR", "1 if bits are DIFFERENT (odd parity)", "0101 ^ 0011 = 0110 (6)", "Bit toggling / Invertible hashing"],
            ["~", "Bitwise NOT", "Inverts every single bit (0↔1)", "~00000101 = 11111010", "~x = -(x + 1)"],
            ["<<", "Signed Left Shift", "Shifts bits left, fills right with 0s", "5 << 2 = 20", "x * (2^n)"],
            [">>", "Signed Right Shift", "Shifts bits right, preserves sign bit (MSB)", "-16 >> 2 = -4", "x / (2^n) (floored)"],
            [">>>", "Unsigned Right Shift", "Shifts bits right, ALWAYS fills left with 0s", "-1 >>> 1 = 2147483647", "Logical shift (zero-fill)"]
          ]
        },
        {
          type: "text",
          title: "Arithmetic Right Shift (>>) vs Unsigned Right Shift (>>>)",
          content: "The distinction between `>>` and `>>>` is a classic Java interview topic:\n\n1. Signed Right Shift (`>>`):\n   Preserves the sign bit (MSB). If the number is positive (MSB=0), it inserts 0s on the left. If negative (MSB=1), it inserts 1s on the left (Sign Extension).\n   Example: `-8 >> 1` &rarr; `-4`\n\n2. Unsigned Right Shift (`>>>`):\n   ALWAYS inserts 0s into the top bits regardless of the sign. This transforms a negative number into a very large positive integer!\n   Example: `-1` in binary is `32 ones` (`11111111...`).\n   `-1 >>> 1` fills the MSB with 0, yielding `01111111...` (`Integer.MAX_VALUE = 2,147,483,647`)."
        },
        {
          type: "code",
          title: "High-Frequency Practical Bit Manipulation Tricks",
          code: "// 1. Fast parity check (Even vs Odd)\nint n = 43;\nboolean isOdd = (n & 1) == 1; // true (checks if lowest bit is 1)\n\n// 2. Fast multiplication / division by powers of 2\nint mult = 5 << 3; // 5 * (2^3) = 5 * 8 = 40\nint div  = 40 >> 2; // 40 / (2^2) = 40 / 4 = 10\n\n// 3. Check if number is a Power of Two\nint num = 16;\nboolean isPowerOfTwo = (num > 0) && ((num & (num - 1)) == 0); // true\n// 16 is 10000, (16-1) is 01111 -> 10000 & 01111 = 00000\n\n// 4. In-place variable swap without temporary variable\nint a = 15, b = 27;\na ^= b;\nb ^= a;\na ^= b;\nSystem.out.println(\"a = \" + a + \", b = \" + b); // a = 27, b = 15",
          language: "java",
          explanation: "Bit manipulation is used heavily in cryptography, graphics algorithms, compressed data structures, and algorithmic optimization."
        },
        {
          type: "tryIt",
          title: "Try It: Left and Right Shifting",
          code: "int val = 6; // binary: 0110\nint shiftedLeft = val << 2;  // 6 * 4\nint shiftedRight = val >> 1; // 6 / 2\nSystem.out.println(shiftedLeft + \" \" + shiftedRight);",
          expectedOutput: "24 3",
          explanation: "'6 << 2' shifts binary 0110 to 011000 (24). '6 >> 1' shifts binary 0110 to 0011 (3)."
        },
        {
          type: "dryRun",
          title: "Power of Two Bitwise Check Trace: num = 8",
          iterations: [
            { step: 1, variables: { "num": "8", "num (binary)": "00001000" }, description: "Binary representation of 8." },
            { step: 2, variables: { "num - 1": "7", "num-1 (binary)": "00000111" }, description: "Subtract 1: flips lowest set bit and all bits below it." },
            { step: 3, variables: { "num & (num - 1)": "00000000 (0)" }, description: "Bitwise AND produces 0, proving 8 has exactly one bit set and is a power of 2." }
          ]
        },
        {
          type: "warning",
          title: "Common Bitwise Mistakes",
          items: [
            "Confusing '&' (bitwise) with '&&' (logical short-circuit).",
            "Shift count modulo: Shifting a 32-bit int by 32 (`x << 32`) does NOT clear the integer to 0; Java uses `32 % 32 = 0`, so `x << 32` returns `x` unchanged!",
            "Forgetting operator precedence: Bitwise operators (&, |, ^) have lower precedence than comparison operators (==, <, >). Always write `(n & 1) == 0` with parentheses!"
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Bitwise Operators",
          traps: [
            {
              question: "Why does (1 << 35) evaluate to 8 for a 32-bit integer in Java?",
              trap: "Thinking it overflows to 0 or throws an error.",
              solution: "The Java Language Specification states that for 32-bit ints, only the lowest 5 bits of the shift distance are used (distance & 0x1F or distance % 32). 35 % 32 is 3, so '1 << 35' is evaluated as '1 << 3', which equals 8."
            },
            {
              question: "How does '>>>' behave on negative byte values?",
              trap: "Expecting an 8-bit unsigned shift.",
              solution: "In Java, byte is promoted to 32-bit int before bit shifting. 'byte b = -1;' sign-extends to 32-bit 0xFFFFFFFF. 'b >>> 1' shifts the 32-bit int, yielding 0x7FFFFFFF (2,147,483,647) instead of 127."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "What is the result of (12 ^ 12) in Java?",
          options: [
            "24",
            "12",
            "0",
            "144"
          ],
          answer: 2,
          explanation: "Any number XORed with itself produces 0 (x ^ x = 0), because identical bits produce 0 in XOR."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "& (AND), | (OR), ^ (XOR), ~ (NOT) operate on individual bit positions.",
            "<< shifts left (multiply by 2^k); >> shifts right preserving sign; >>> shifts right filling with zeros.",
            "Shift distance for int is taken modulo 32; for long it is taken modulo 64.",
            "Fast power-of-two check: '(n > 0) && ((n & (n - 1)) == 0)'."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we examine Operator Precedence & Associativity, mastering the exact rules that determine how complex expressions evaluate in Java."
        }
      ]
    }
  },
  {
    slug: "operator-precedence",
    title: "Operator Precedence & Expressions",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand arithmetic, relational, logical, unary, and assignment operators."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Operator precedence is the grammatical order of operations in programming (like PEMDAS/BODMAS in algebra). When multiple operators appear in a single statement without parentheses, Java uses strict precedence tiers and associativity rules to decide which operation binds to which operands first."
        },
        {
          type: "table",
          title: "Complete Java Operator Precedence Hierarchy (Highest to Lowest)",
          headers: ["Level", "Operator Type", "Operators", "Associativity"],
          rows: [
            ["1 (Highest)", "Postfix", "expr++, expr--", "Left-to-Right"],
            ["2", "Unary", "++expr, --expr, +expr, -expr, ~, !", "Right-to-Left"],
            ["3", "Multiplicative", "*, /, %", "Left-to-Right"],
            ["4", "Additive", "+, -", "Left-to-Right"],
            ["5", "Shift", "<<, >>, >>>", "Left-to-Right"],
            ["6", "Relational", "<, >, <=, >=, instanceof", "Left-to-Right"],
            ["7", "Equality", "==, !=", "Left-to-Right"],
            ["8", "Bitwise AND", "&", "Left-to-Right"],
            ["9", "Bitwise XOR", "^", "Left-to-Right"],
            ["10", "Bitwise OR", "|", "Left-to-Right"],
            ["11", "Logical AND", "&&", "Left-to-Right"],
            ["12", "Logical OR", "||", "Left-to-Right"],
            ["13", "Ternary", "? :", "Right-to-Left"],
            ["14 (Lowest)", "Assignment", "=, +=, -=, *=, /=, %=, &=, |=, ^=, <<=, >>=, >>>=", "Right-to-Left"]
          ]
        },
        {
          type: "text",
          title: "Precedence vs Order of Evaluation (Critical Distinction)",
          content: "Precedence determines which operators group with which operands. However, operand evaluation in Java ALWAYS proceeds strictly from Left-to-Right.\n\nExample:\n`int result = getA() + getB() * getC();`\n\n1. Evaluation Order: Java executes `getA()`, then `getB()`, then `getC()` in strict left-to-right sequence.\n2. Precedence Binding: The returned value of `getB()` is multiplied by `getC()` first, and then added to `getA()`."
        },
        {
          type: "code",
          title: "Parentheses and Precedence in Practice",
          code: "// 1. Arithmetic precedence: Multiplication (*) before Addition (+)\nint res1 = 10 + 5 * 2;   // 10 + 10 = 20 (not 15 * 2 = 30)\nint res2 = (10 + 5) * 2; // (15) * 2 = 30\n\n// 2. Logical precedence: && before ||\nboolean a = true, b = false, c = false;\nboolean verdict1 = a || b && c;   // true || (false && false) -> true || false -> true\nboolean verdict2 = (a || b) && c; // (true || false) && false -> true && false -> false\n\n// 3. Bitwise vs Relational trap\nint n = 6;\n// boolean bad = n & 1 == 0; // COMPILE ERROR! '==' has higher precedence than '&', tries to evaluate '1 == 0' first!\nboolean good = (n & 1) == 0; // true",
          language: "java",
          explanation: "Always use explicit parentheses when mixing bitwise, logical, and relational operators to guarantee clarity and avoid compiler errors."
        },
        {
          type: "tryIt",
          title: "Try It: Complex Expression Precedence",
          code: "int x = 2 + 3 * 4 / 2 - 1;\nboolean cond = true || false && false;\nSystem.out.println(\"x = \" + x + \", cond = \" + cond);",
          expectedOutput: "x = 7, cond = true",
          explanation: "For x: 3 * 4 = 12, then 12 / 2 = 6, then 2 + 6 = 8, then 8 - 1 = 7. For cond: '&&' runs before '||', so false && false = false, then true || false = true."
        },
        {
          type: "dryRun",
          title: "Precedence Evaluation Trace: 5 + 3 * 2 > 10 && 4 == 4",
          iterations: [
            { step: 1, variables: { "3 * 2": "6" }, description: "Multiplication '*' (level 3) runs: 3 * 2 = 6." },
            { step: 2, variables: { "5 + 6": "11" }, description: "Addition '+' (level 4) runs: 5 + 6 = 11." },
            { step: 3, variables: { "11 > 10": "true" }, description: "Relational '>' (level 6) runs: 11 > 10 is true." },
            { step: 4, variables: { "4 == 4": "true" }, description: "Equality '==' (level 7) runs: 4 == 4 is true." },
            { step: 5, variables: { "true && true": "true" }, description: "Logical AND '&&' (level 11) runs: true && true evaluates to true." }
          ]
        },
        {
          type: "warning",
          title: "Defensive Coding Standard",
          items: [
            "Do not rely on obscure precedence rules. If there is any ambiguity, use explicit parentheses '()'.",
            "Parentheses carry zero performance penalty at runtime and make your intentions immediately clear to other engineers and code reviewers."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Precedence",
          traps: [
            {
              question: "Why does 'System.out.println(1 + 2 + \" = \" + 1 + 2);' output '3 = 12'?",
              trap: "Thinking it outputs '3 = 3' or '12 = 12'.",
              solution: "Because '+' is left-associative: 1 + 2 evaluates to integer 3. Then 3 + \" = \" evaluates to String \"3 = \". Once a String operand exists, all subsequent '+' operations perform String concatenation: \"3 = \" + 1 = \"3 = 1\", and \"3 = 1\" + 2 = \"3 = 12\"."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Which operator has the lowest precedence among the following?",
          options: [
            "==",
            "&&",
            "=",
            "+"
          ],
          answer: 2,
          explanation: "Assignment operators (=, +=, etc.) have the lowest precedence among standard operators, ensuring the entire right-hand expression is fully calculated before being stored."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Precedence order: Postfix > Unary > Multiplicative (* / %) > Additive (+ -) > Shift > Relational > Equality > Bitwise > Logical (&& before ||) > Ternary > Assignment.",
            "Operands are always evaluated strictly Left-to-Right in Java.",
            "Use parentheses to override precedence and eliminate ambiguity in complex conditions."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Module",
          content: "Congratulations! You have completed Module 3: Operators & Expressions. You now have mastery over mathematical, logical, unary, bitwise, and assignment mechanics. In Module 4: Input & Output, you will learn how programs interact with users and external systems using Scanner, BufferedReader, System.out formatting, and streams."
        }
      ]
    }
  }
];
