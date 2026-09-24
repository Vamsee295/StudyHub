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
      definition: "Operators are special symbols that perform operations on variables and values. Java supports various types including arithmetic, relational, logical, assignment, and bitwise operators.",
      whyItMatters: "Operators are fundamental to every Java program—they allow you to manipulate data, make decisions, and perform calculations.",
      coreConcept: "An operator works on one, two, or three operands. Operators have precedence and associativity rules that determine evaluation order.",
      syntax: "// operand operator operand\nint result = a + b;",
      javaExample: "int a = 10, b = 5;\nint sum = a + b;     // 15\nboolean isGreater = a > b;  // true",
      howItWorks: "Operators take operands and produce results based on the operator type. Precedence determines which operators evaluate first.",
      realWorldUse: "Used in every program: calculating totals, comparing values, checking conditions, incrementing counters, and bitwise operations.",
      commonMistakes: [
        "Confusing = (assignment) with == (equality)",
        "Not understanding operator precedence",
        "Using wrong operator types for the task"
      ],
      interviewQuestions: [
        { question: "What is operator precedence?", answer: "Operator precedence determines the order in which operators are evaluated in an expression." },
        { question: "How many operands does a unary operator take?", answer: "A unary operator takes exactly one operand, like ++, --, or !" }
      ],
      quickRevision: "Operators = symbols that perform operations. Types: arithmetic, relational, logical, assignment, bitwise.",
      practicePrompt: "List five different operators and create examples for each.",
      quickCheck: {
        question: "What type of operator is '+' in 'a + b'?",
        options: ["Unary operator", "Binary operator", "Ternary operator", "Assignment operator"],
        answer: 1,
        explanation: "The '+' operator takes two operands (a and b), making it a binary operator."
      }
    }
  },
  {
    slug: "arithmetic-operators",
    title: "Arithmetic Operators",
    content: {
      definition: "Arithmetic operators perform basic mathematical operations: addition (+), subtraction (-), multiplication (*), division (/), and modulo (%).",
      whyItMatters: "Essential for calculations, counters, percentages, and any numerical processing in programs.",
      coreConcept: "Arithmetic operators work with numeric types. Division of integers yields an integer result. Modulo returns the remainder.",
      syntax: "+ - * / %",
      javaExample: "int a = 10, b = 3;\nint sum = a + b;    // 13\nint diff = a - b;   // 7\nint product = a * b; // 30\nint quotient = a / b; // 3 (integer division)\nint remainder = a % b; // 1",
      howItWorks: "Operators evaluate left to right with standard math precedence (*, /, % before +, -). Parentheses override precedence.",
      realWorldUse: "Calculating prices, discounts, averages, remainders for even/odd checks, and all numeric processing.",
      commonMistakes: [
        "Integer division truncates: 10/3 = 3, not 3.33",
        "Division by zero causes runtime error",
        "Modulo with negative numbers can be confusing"
      ],
      interviewQuestions: [
        { question: "What is 17 % 5?", answer: "17 % 5 = 2 (17 divided by 5 equals 3 with remainder 2)" },
        { question: "How do you check if a number is even using operators?", answer: "Use modulo: if (n % 2 == 0), the number is even." }
      ],
      quickRevision: "+, -, *, /, %. Division of integers truncates. Modulo gives remainder.",
      practicePrompt: "Calculate 15 % 4, 20 / 6, and 7 * 3. Verify with Java.",
      quickCheck: {
        question: "What is the result of 17 / 5 in Java when both operands are int?",
        options: ["3.4", "3", "4", "2"],
        answer: 1,
        explanation: "Integer division truncates the decimal part, so 17 / 5 = 3, not 3.4."
      }
    }
  },
  {
    slug: "assignment-operators",
    title: "Assignment Operators",
    content: {
      definition: "Assignment operators assign values to variables. The basic assignment operator is =. Compound operators like +=, -=, *=, /=, %= combine an operation with assignment.",
      whyItMatters: "Essential for storing and updating values in variables throughout your program.",
      coreConcept: "The = operator assigns the right-hand value to the left-hand variable. Compound operators provide shorthand: a += b means a = a + b.",
      syntax: "= += -= *= /= %=",
      javaExample: "int x = 10;    // basic assignment\nx += 5;       // x is now 15 (same as x = x + 5)\nx -= 3;       // x is now 12\nx *= 2;       // x is now 24\nx /= 4;       // x is now 6\nx %= 4;       // x is now 2",
      howItWorks: "Right-hand expression is evaluated first, then result is assigned to left-hand variable. Compound operators modify the existing value.",
      realWorldUse: "Updating counters, accumulating totals, modifying values in loops and calculations.",
      commonMistakes: [
        "Confusing = (assignment) with == (comparison)",
        "Using = in conditions instead of ==",
        "Forgetting that compound operators modify the variable in place"
      ],
      interviewQuestions: [
        { question: "What is the difference between = and ==?", answer: "= is the assignment operator (assigns value), == is the equality operator (compares values and returns boolean)." },
        { question: "What does x %= 3 do?", answer: "It calculates x % 3 and assigns the result back to x. Equivalent to x = x % 3." }
      ],
      quickRevision: "= assigns value. +=, -=, etc. combine operation with assignment.",
      practicePrompt: "Rewrite 'count = count + 1' using a compound operator.",
      quickCheck: {
        question: "What is x after: int x = 5; x *= 3;",
        options: ["5", "8", "15", "3"],
        answer: 2,
        explanation: "x *= 3 means x = x * 3, so x = 5 * 3 = 15."
      }
    }
  },
  {
    slug: "relational-operators",
    title: "Relational Operators",
    content: {
      definition: "Relational operators compare two values and return a boolean result (true or false). They include: ==, !=, <, >, <=, >=.",
      whyItMatters: "Critical for decision-making in programs—used in if statements, loops, and conditional expressions.",
      coreConcept: "All relational operators return boolean values. They compare primitives for value equality. For objects, == compares references, not content.",
      syntax: "== != < > <= >=",
      javaExample: "int a = 10, b = 5;\nboolean result1 = a == b;  // false\nboolean result2 = a != b;  // true\nboolean result3 = a > b;   // true\nboolean result4 = a <= b;  // false",
      howItWorks: "Operators compare left and right operands, producing true or false based on the relationship. Used primarily in conditional statements.",
      realWorldUse: "Checking if user input matches expected value, comparing scores, validating age limits, sorting comparisons.",
      commonMistakes: [
        "Using == to compare String content (use .equals() instead)",
        "Confusing = with ==",
        "Comparing floating-point numbers with == (due to precision issues)"
      ],
      interviewQuestions: [
        { question: "Why should you not use == to compare String objects?", answer: "== compares object references (memory addresses), not the actual content. Use .equals() to compare String content." },
        { question: "What is the result of 5 != 5?", answer: "false. The != operator checks if values are NOT equal, and 5 equals 5, so the result is false." }
      ],
      quickRevision: "==, !=, <, >, <=, >= return boolean. Don't use == for String comparison.",
      practicePrompt: "Write expressions to check if a number is positive, negative, or zero.",
      quickCheck: {
        question: "What does 'a >= b' evaluate to when a = 5 and b = 5?",
        options: ["false", "true", "error", "5"],
        answer: 1,
        explanation: ">= means 'greater than or equal to'. Since 5 equals 5, the condition is true."
      }
    }
  },
  {
    slug: "logical-operators",
    title: "Logical Operators",
    content: {
      definition: "Logical operators work with boolean values: && (AND), || (OR), and ! (NOT). They are used to combine or invert boolean expressions.",
      whyItMatters: "Essential for building complex conditions in decision-making, validating multiple criteria, and controlling program flow.",
      coreConcept: "&& returns true only if both operands are true. || returns true if at least one operand is true. ! inverts the boolean value. These operators short-circuit.",
      syntax: "&& || !",
      javaExample: "int age = 25;\nboolean hasID = true;\n\nboolean canEnter = (age >= 18) && hasID;  // true\nboolean isWeekend = false;\nboolean isHoliday = true;\nboolean dayOff = isWeekend || isHoliday;   // true\nboolean isWorking = !dayOff;  // false",
      howItWorks: "&& and || use short-circuit evaluation: && stops if left is false, || stops if left is true. This improves efficiency and prevents errors.",
      realWorldUse: "Checking multiple conditions (age verification AND has ID), form validation, game logic, business rule enforcement.",
      commonMistakes: [
        "Using & instead of && (non-short-circuit version)",
        "Not understanding short-circuit evaluation",
        "Overcomplicating boolean expressions"
      ],
      interviewQuestions: [
        { question: "What is short-circuit evaluation?", answer: "In && and ||, if the result can be determined from the first operand, the second operand is not evaluated. && stops on false, || stops on true." },
        { question: "What is the difference between & and &&?", answer: "& always evaluates both operands. && uses short-circuit evaluation—it stops if the first operand is false." }
      ],
      quickRevision: "&& (AND), || (OR), ! (NOT). Short-circuit: && stops on false, || stops on true.",
      practicePrompt: "Write a condition that checks if a person is eligible to vote (age >= 18 AND citizen).",
      quickCheck: {
        question: "What is the result of true && false?",
        options: ["true", "false", "error", "null"],
        answer: 1,
        explanation: "The && (AND) operator requires both operands to be true. Since one is false, the result is false."
      }
    }
  },
  {
    slug: "unary-operators",
    title: "Unary Operators",
    content: {
      definition: "Unary operators work with a single operand. They include: + (unary plus), - (unary minus), ++ (increment), -- (decrement), and ! (logical NOT).",
      whyItMatters: "Commonly used for incrementing/decrementing counters, inverting boolean values, and representing negative numbers.",
      coreConcept: "Increment (++) and decrement (--) have prefix and postfix forms with different behaviors. Prefix changes value before use, postfix changes after use.",
      syntax: "+ - ++ -- !",
      javaExample: "int x = 5;\nx++;        // x is now 6 (postfix increment)\n++x;        // x is now 7 (prefix increment)\nint y = -x; // y is -7 (unary minus)\nboolean flag = true;\nboolean notFlag = !flag;  // false (logical NOT)",
      howItWorks: "Prefix (++x): increment then use the new value. Postfix (x++): use current value then increment. NOT (!) inverts boolean.",
      realWorldUse: "Incrementing loop counters, toggling boolean flags, representing negative values, pre/post increment in expressions.",
      commonMistakes: [
        "Confusing x++ and ++x behavior in expressions",
        "Using increment/decrement multiple times on same variable in one statement",
        "Applying unary operators to wrong types"
      ],
      interviewQuestions: [
        { question: "What is the difference between ++x and x++?", answer: "++x (prefix) increments x first, then returns the new value. x++ (postfix) returns the current value first, then increments x." },
        { question: "If int x = 5, what is the value of x after int y = x++?", answer: "x is 6 after the statement. y gets the value 5 (old x), then x is incremented to 6." }
      ],
      quickRevision: "++, --: prefix changes first, postfix changes after. ! inverts boolean.",
      practicePrompt: "Test the difference between ++x and x++ by assigning the result to another variable.",
      quickCheck: {
        question: "If int a = 3; int b = ++a; what are the values of a and b?",
        options: ["a=3, b=3", "a=4, b=3", "a=4, b=4", "a=3, b=4"],
        answer: 2,
        explanation: "Prefix ++a increments a to 4 first, then assigns 4 to b. Both a and b are 4."
      }
    }
  },
  {
    slug: "bitwise-operators",
    title: "Bitwise Operators",
    content: {
      definition: "Bitwise operators work at the bit level: & (AND), | (OR), ^ (XOR), ~ (NOT), << (left shift), >> (right shift), >>> (unsigned right shift).",
      whyItMatters: "Useful for low-level programming, optimizing certain operations, working with flags, and understanding how data is stored.",
      coreConcept: "These operators manipulate individual bits within integer types. Shift operators move bits left or right, effectively multiplying or dividing by powers of 2.",
      syntax: "& | ^ ~ << >> >>>",
      javaExample: "int a = 5;  // binary: 0101\nint b = 3;  // binary: 0011\nint and = a & b;   // 0001 = 1\nint or = a | b;    // 0111 = 7\nint xor = a ^ b;   // 0110 = 6\nint shifted = a << 2;  // 010100 = 20",
      howItWorks: "&: 1 if both bits are 1. |: 1 if either bit is 1. ^: 1 if bits differ. << shifts left (multiply by 2^n). >> shifts right with sign extension.",
      realWorldUse: "Flag manipulation, encryption algorithms, graphics programming, optimizing multiplication/division by powers of 2, embedded systems.",
      commonMistakes: [
        "Confusing & and &&, | and ||",
        "Not understanding that >> preserves sign bit, >>> does not",
        "Applying to non-integer types"
      ],
      interviewQuestions: [
        { question: "What is 8 << 2?", answer: "8 << 2 = 32. Left shifting by 2 is equivalent to multiplying by 2^2 = 4. So 8 * 4 = 32." },
        { question: "What is the difference between >> and >>>?", answer: ">> preserves the sign bit (sign-extended right shift), while >>> fills with zeros (unsigned right shift), always producing a positive result for positive numbers." }
      ],
      quickRevision: "& | ^ ~ << >> >>> operate on bits. << multiply by 2^n, >> divide by 2^n.",
      practicePrompt: "Use bitwise operators to check if a number is odd without using modulo.",
      quickCheck: {
        question: "What operation checks if a number is even using bitwise operators?",
        options: ["n & 1", "n | 1", "n ^ 1", "n << 1"],
        answer: 0,
        explanation: "n & 1 extracts the last bit. If result is 0, the number is even. If result is 1, it's odd."
      }
    }
  },
  {
    slug: "operator-precedence",
    title: "Operator Precedence & Expressions",
    content: {
      definition: "Operator precedence determines the order in which operators are evaluated in an expression. Higher precedence operators are evaluated first.",
      whyItMatters: "Understanding precedence prevents logical errors and ensures expressions evaluate as intended. Parentheses override default precedence.",
      coreConcept: "Order: postfix > unary > multiplicative (* / %) > additive (+ -) > shift > relational > equality > bitwise AND > bitwise XOR > bitwise OR > logical AND > logical OR > ternary > assignment.",
      syntax: "// Use parentheses for clarity\nint result = (a + b) * c;",
      javaExample: "int result = 2 + 3 * 4;  // 14, not 20\nint result2 = (2 + 3) * 4;  // 20\nboolean check = a > 5 && b < 10 || c == 0;\n// && has higher precedence than ||",
      howItWorks: "Higher precedence operators bind tighter. When operators have equal precedence, associativity (usually left-to-right) determines order. Parentheses force evaluation order.",
      realWorldUse: "Writing correct mathematical expressions, building complex boolean conditions, avoiding subtle bugs.",
      commonMistakes: [
        "Assuming left-to-right evaluation for all operators",
        "Not using parentheses when in doubt",
        "Forgetting that && has higher precedence than ||"
      ],
      interviewQuestions: [
        { question: "What is the result of 2 + 3 * 4?", answer: "14. Multiplication (*) has higher precedence than addition (+), so 3 * 4 = 12, then 2 + 12 = 14." },
        { question: "Which has higher precedence: && or ||?", answer: "&& (logical AND) has higher precedence than || (logical OR)." }
      ],
      quickRevision: "Precedence: () > unary > * / % > + - > relational > && > || > assignment. Use parentheses when in doubt.",
      practicePrompt: "Write an expression that evaluates as (a+b)*c but without parentheses, then fix it.",
      quickCheck: {
        question: "How do you make 2 + 3 * 4 evaluate to 20?",
        options: [
          "2 + (3 * 4)",
          "(2 + 3) * 4",
          "2 * 3 + 4",
          "2 + 3 * 4 + 0"
        ],
        answer: 1,
        explanation: "Parentheses override precedence. (2 + 3) * 4 evaluates to 5 * 4 = 20."
      }
    }
  }
];
