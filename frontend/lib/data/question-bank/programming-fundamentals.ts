import type { LessonQuestions } from './index';

export const pfQuestions: LessonQuestions = {
  "what-is-programming": [
    { q: "What is an algorithm?", o: ["A finite, step-by-step procedure that solves a problem", "A programming language", "A type of computer", "A compiler error"], a: 0, e: "Programs are algorithms written in a language a computer can run." },
    { q: "Which is the best first step before writing code?", o: ["Understand the problem and work through an example by hand", "Pick a font", "Write the longest solution", "Optimize for speed"], a: 0, e: "Code written for a misunderstood problem is wasted." },
    { q: "Which property must every algorithm have?", o: ["It terminates after a finite number of steps", "It uses recursion", "It is written in Java", "It runs in O(1) time"], a: 0, e: "Finiteness, definiteness, input, output and effectiveness define an algorithm." },
  ],
  "programming-languages": [
    { q: "Which language is mainly used for styling web pages rather than general programming?", o: ["CSS", "Java", "Python", "C"], a: 0, e: "CSS describes presentation; it isn't a general-purpose programming language." },
    { q: "What does 'Write once, run anywhere' refer to in Java?", o: ["Bytecode runs on any platform with a JVM", "Java compiles to every machine's native code at once", "Java needs no runtime", "Java runs only in browsers"], a: 0, e: "javac produces platform-neutral bytecode that each JVM executes." },
    { q: "Which language family is Python?", o: ["High-level, dynamically typed", "Low-level assembly", "Statically typed and compiled to native code only", "Markup language"], a: 0, e: "Python checks types at runtime and abstracts away memory management." },
  ],
  "high-level-vs-low-level-languages": [
    { q: "Which is a low-level language?", o: ["Assembly", "Python", "Java", "JavaScript"], a: 0, e: "Assembly maps closely to machine instructions." },
    { q: "What is the main advantage of high-level languages?", o: ["Easier to read, write and port across machines", "Always faster than assembly", "Direct hardware register control", "No need for translation"], a: 0, e: "Compilers and interpreters translate them to machine code." },
    { q: "Machine code consists of what?", o: ["Binary instructions the CPU executes directly", "English keywords", "Bytecode for the JVM", "HTML tags"], a: 0, e: "Each CPU architecture has its own instruction set." },
  ],
  "compiler-vs-interpreter": [
    { q: "How does a compiler differ from an interpreter?", o: ["A compiler translates the whole program before running; an interpreter translates and runs statement by statement", "They're identical", "An interpreter produces an executable file", "A compiler runs code line by line"], a: 0, e: "Many modern systems combine both, like Java's bytecode plus JIT." },
    { q: "Java source code is first compiled into what?", o: ["Bytecode (.class files)", "Machine code (.exe)", "Python files", "Assembly"], a: 0, e: "The JVM then interprets or JIT-compiles the bytecode." },
    { q: "When does an interpreted language usually report a syntax error in a rarely-run branch?", o: ["Possibly only when that line is reached", "Always before running", "Never", "At install time"], a: 0, e: "Compiled languages catch such errors before execution." },
  ],
  "source-code-compilation-execution": [
    { q: "Which command compiles Hello.java?", o: ["javac Hello.java", "java Hello.java only at compile time", "jar Hello.java", "run Hello.java"], a: 0, e: "javac produces Hello.class; java Hello runs it." },
    { q: "In Java, what must the public class name match?", o: ["The file name", "The package name", "The method name", "The variable name"], a: 0, e: "public class Hello must be in Hello.java." },
    { q: "What is the JVM's entry point signature?", o: ["public static void main(String[] args)", "void main()", "public main(String args)", "static int main()"], a: 0, e: "Java 21+ previews simpler main methods, but this is the classic form." },
  ],
  "syntax-vs-semantics": [
    { q: "A missing semicolon in Java is what kind of error?", o: ["Syntax error", "Logic error", "Runtime error", "Semantic warning only"], a: 0, e: "The compiler rejects code that breaks grammar rules." },
    { q: "Code compiles and runs but computes the wrong average. What kind of error is this?", o: ["Logic (semantic) error", "Syntax error", "Compile error", "Linker error"], a: 0, e: "The program is valid but doesn't mean what you intended." },
    { q: "Dividing an int by zero at runtime in Java causes what?", o: ["ArithmeticException", "A compile error", "Infinity", "0"], a: 0, e: "Floating-point division by zero gives Infinity; integer division throws." },
  ],
  "variables": [
    { q: "Which is a valid Java variable name?", o: ["_count", "2count", "my-count", "class"], a: 0, e: "Names can't start with a digit, contain hyphens or be keywords." },
    { q: "int x = 5; x = x + 3; What is x?", o: ["8", "5", "3", "53"], a: 0, e: "The right side is evaluated using the old value, then stored." },
    { q: "What does var x = 10; declare in Java 10+?", o: ["An int inferred from the value", "A dynamically typed variable", "A String", "A compile error"], a: 0, e: "var is local type inference; the type is still fixed at compile time." },
  ],
  "constants": [
    { q: "How do you declare a constant in Java?", o: ["final int MAX = 100;", "const int MAX = 100;", "constant MAX = 100;", "static MAX = 100;"], a: 0, e: "const is reserved but unused in Java." },
    { q: "What is the naming convention for Java constants?", o: ["UPPER_SNAKE_CASE", "camelCase", "PascalCase", "kebab-case"], a: 0, e: "For example MAX_SIZE or PI." },
    { q: "final int x = 5; x = 6; What happens?", o: ["Compile error", "x becomes 6", "Runtime exception", "x stays 5 silently"], a: 0, e: "A final variable can be assigned only once." },
  ],
  "primitive-data-types": [
    { q: "How many primitive types does Java have?", o: ["8", "4", "6", "10"], a: 0, e: "byte, short, int, long, float, double, char, boolean." },
    { q: "What is the range of a Java byte?", o: ["-128 to 127", "0 to 255", "-256 to 255", "-32768 to 32767"], a: 0, e: "A byte is 8 bits, signed." },
    { q: "Why does long big = 3000000000; fail to compile?", o: ["The literal is an int and is too large; add L", "long can't hold it", "It needs a cast to short", "It compiles fine"], a: 0, e: "Integer literals default to int, whose maximum is about 2.1 billion. Write 3000000000L." },
  ],
  "type-casting": [
    { q: "What is (int) 3.99?", o: ["3", "4", "3.99", "Compile error"], a: 0, e: "Casting a double to int truncates toward zero." },
    { q: "What is (byte) 130?", o: ["-126", "130", "127", "2"], a: 0, e: "130 wraps around the byte range: 130 − 256 = −126." },
    { q: "Which conversion happens automatically in Java?", o: ["int to double", "double to int", "long to int", "int to byte"], a: 0, e: "Widening is implicit; narrowing needs an explicit cast." },
  ],
  "wrapper-classes": [
    { q: "Integer a = 127, b = 127; what is a == b?", o: ["true", "false", "Compile error", "NullPointerException"], a: 0, e: "Values from -128 to 127 are cached, so both refer to the same object." },
    { q: "Integer a = 128, b = 128; what is a == b?", o: ["false", "true", "Compile error", "Depends on the OS only"], a: 0, e: "Outside the cache, separate objects are created. Use equals()." },
    { q: "Integer n = null; int x = n; what happens?", o: ["NullPointerException when unboxing", "x becomes 0", "Compile error", "x becomes null"], a: 0, e: "Auto-unboxing calls n.intValue() on null." },
  ],
  "what-are-operators": [
    { q: "How many operands does a ternary operator take?", o: ["3", "2", "1", "4"], a: 0, e: "condition ? a : b is Java's only ternary operator." },
    { q: "Which is a unary operator?", o: ["++", "+ (addition of two values)", "&&", "=="], a: 0, e: "Unary operators act on one operand." },
    { q: "What does the instanceof operator return?", o: ["A boolean", "An int", "A String", "An object"], a: 0, e: "It tests whether an object is an instance of a type." },
  ],
  "arithmetic-operators": [
    { q: "What is 7 / 2 in Java with int operands?", o: ["3", "3.5", "4", "Compile error"], a: 0, e: "Integer division discards the remainder." },
    { q: "What is -7 % 3 in Java?", o: ["-1", "2", "1", "-2"], a: 0, e: "The result takes the sign of the dividend." },
    { q: "What does \"1\" + 2 + 3 evaluate to?", o: ["\"123\"", "\"15\"", "6", "\"6\""], a: 0, e: "Once a String is involved, + concatenates left to right." },
  ],
  "assignment-operators": [
    { q: "int x = 10; x += 5; x *= 2; What is x?", o: ["30", "25", "20", "15"], a: 0, e: "10 + 5 = 15, then 15 × 2 = 30." },
    { q: "byte b = 10; b += 5; compiles, but b = b + 5; does not. Why?", o: ["Compound assignment casts implicitly; b + 5 is an int", "+= is illegal for bytes", "b + 5 overflows", "Both compile"], a: 0, e: "b += 5 is equivalent to b = (byte)(b + 5)." },
    { q: "int a, b; a = b = 4; What are a and b?", o: ["Both 4", "a = 0, b = 4", "Compile error", "a = 4, b = 0"], a: 0, e: "Assignment returns the assigned value and is right-associative." },
  ],
  "relational-operators": [
    { q: "What type does 5 > 3 produce?", o: ["boolean", "int", "String", "char"], a: 0, e: "Relational operators produce true or false." },
    { q: "Why shouldn't you compare doubles with ==?", o: ["Rounding errors can make equal-looking values differ", "== doesn't work on doubles", "It's slower", "It throws"], a: 0, e: "Compare with a tolerance: Math.abs(a − b) < 1e-9." },
    { q: "What does 0.1 + 0.2 == 0.3 evaluate to in Java?", o: ["false", "true", "Compile error", "NaN"], a: 0, e: "0.1 + 0.2 is 0.30000000000000004 in binary floating point." },
  ],
  "logical-operators": [
    { q: "In a && b, when is b not evaluated?", o: ["When a is false", "When a is true", "Never", "Always"], a: 0, e: "Short-circuiting skips the right side when the result is already known." },
    { q: "Why write if (s != null && s.length() > 0)?", o: ["Short-circuiting avoids NullPointerException when s is null", "It's faster always", "&& is required for strings", "To compare lengths"], a: 0, e: "Reversing the order would call length() on null." },
    { q: "What is !(true || false)?", o: ["false", "true", "Compile error", "null"], a: 0, e: "true || false is true; negated it's false." },
  ],
  "unary-operators": [
    { q: "int x = 5; int y = x++; What are x and y?", o: ["x = 6, y = 5", "x = 6, y = 6", "x = 5, y = 5", "x = 5, y = 6"], a: 0, e: "Post-increment returns the old value, then increments." },
    { q: "int x = 5; int y = ++x; What are x and y?", o: ["x = 6, y = 6", "x = 6, y = 5", "x = 5, y = 6", "x = 5, y = 5"], a: 0, e: "Pre-increment increments first, then returns the new value." },
    { q: "int x = 5; int z = x++ + ++x; What is z?", o: ["12", "11", "10", "13"], a: 0, e: "x++ gives 5 (x becomes 6), ++x gives 7: 5 + 7 = 12." },
  ],
  "bitwise-operators": [
    { q: "What is 10 & 6?", o: ["2", "14", "12", "16"], a: 0, e: "In binary, 1010 & 0110 = 0010: only bits set in both numbers survive, giving 2." },
    { q: "What is 5 << 2?", o: ["20", "10", "7", "1"], a: 0, e: "Shifting left by 2 multiplies by 4." },
    { q: "What is ~5 in Java?", o: ["-6", "-5", "2", "10"], a: 0, e: "Bitwise NOT gives −(x + 1) in two's complement." },
  ],
  "operator-precedence": [
    { q: "What is 2 + 3 * 4?", o: ["14", "20", "24", "9"], a: 0, e: "Multiplication binds tighter than addition." },
    { q: "What does 1 + 2 + \"3\" evaluate to?", o: ["\"33\"", "\"123\"", "6", "\"6\""], a: 0, e: "1 + 2 is computed first as numbers, then concatenated." },
    { q: "What is 10 - 4 - 3?", o: ["3", "9", "-3", "17"], a: 0, e: "Subtraction is left-associative: (10 − 4) − 3." },
  ],
  "printing-output": [
    { q: "Which prints formatted output like 'Total: 3.14'?", o: ["System.out.printf(\"Total: %.2f%n\", 3.14159)", "System.out.print(\"%.2f\", 3.14)", "System.out.format() with no arguments", "System.print(3.14)"], a: 0, e: "printf uses format specifiers such as %d, %s and %.2f." },
    { q: "Where does System.err print?", o: ["The standard error stream", "A file", "The standard input", "Nowhere"], a: 0, e: "It's separate from System.out and often unbuffered." },
    { q: "What does System.out.println(5 + 5 + \"x\") print?", o: ["10x", "55x", "x10", "Compile error"], a: 0, e: "Numbers are added before meeting the String." },
  ],
  "print-vs-println": [
    { q: "How does print() differ from println()?", o: ["println adds a line break after the output", "print adds a line break", "println prints twice", "They're identical"], a: 0, e: "print leaves the cursor on the same line." },
    { q: "What does System.out.print(\"A\"); System.out.print(\"B\"); print?", o: ["AB on one line", "A and B on separate lines", "BA", "Nothing"], a: 0, e: "No newline is added between them." },
    { q: "What does System.out.println() with no arguments do?", o: ["Prints an empty line", "Compile error", "Prints null", "Nothing"], a: 0, e: "It outputs just the line separator." },
  ],
  "escape-sequences": [
    { q: "Which escape sequence inserts a tab?", o: ["\\t", "\\n", "\\b", "\\r"], a: 0, e: "\\n is newline, \\b is backspace, \\r is carriage return." },
    { q: "How do you print a double quote inside a Java string?", o: ["\\\"", "\"\"", "\\q", "'\"' only inside char"], a: 0, e: "Backslash escapes the quote so it doesn't end the string." },
    { q: "How do you print a single backslash?", o: ["\\\\", "\\", "/\\", "\\b"], a: 0, e: "A backslash starts an escape, so it must itself be escaped." },
  ],
  "taking-input-scanner": [
    { q: "Which package contains Scanner?", o: ["java.util", "java.io", "java.lang", "java.scanner"], a: 0, e: "import java.util.Scanner;" },
    { q: "After nextInt(), why does the next nextLine() often return an empty string?", o: ["nextInt leaves the newline in the buffer", "nextLine is broken", "Scanner closes", "The input is lost"], a: 0, e: "Call an extra nextLine() to consume the leftover newline." },
    { q: "Which method reads a single word (up to whitespace)?", o: ["next()", "nextLine()", "read()", "nextWord()"], a: 0, e: "nextLine reads the rest of the line including spaces." },
  ],
  "input-parsing-errors": [
    { q: "What does Integer.parseInt(\"12a\") throw?", o: ["NumberFormatException", "NullPointerException", "ArithmeticException", "Nothing; returns 12"], a: 0, e: "The whole string must be a valid integer." },
    { q: "Scanner.nextInt() on input 'abc' throws what?", o: ["InputMismatchException", "NumberFormatException", "IOException", "Nothing"], a: 0, e: "Check with hasNextInt() first, or catch the exception." },
    { q: "How do you safely parse user input as a number?", o: ["Wrap the parse in try/catch and ask again on failure", "Assume it's valid", "Use (int) on the string", "Parse with charAt"], a: 0, e: "Validate at the boundary where untrusted input enters." },
  ],
  "what-is-control-flow": [
    { q: "What are the three basic control structures?", o: ["Sequence, selection and iteration", "Classes, objects and methods", "Input, output and storage", "Compile, link and run"], a: 0, e: "Any algorithm can be built from these three." },
    { q: "Which statement is a selection structure?", o: ["if-else", "for", "while", "do-while"], a: 0, e: "Loops are iteration structures." },
    { q: "By default, in what order do statements execute?", o: ["Top to bottom, one after another", "Bottom to top", "Randomly", "In parallel"], a: 0, e: "Control structures change this default sequence." },
  ],
  "if-statement": [
    { q: "What does if (x = 5) do in Java when x is an int?", o: ["Compile error: an int isn't a boolean", "Assigns 5 and runs the block", "Compares x to 5", "Runtime exception"], a: 0, e: "Java requires a boolean condition, which prevents this C-style bug." },
    { q: "if (x > 0); { System.out.println(\"pos\"); } What happens when x = -1?", o: ["pos is printed anyway", "Nothing prints", "Compile error", "Runtime exception"], a: 0, e: "The stray semicolon ends the if; the block always runs." },
    { q: "Without braces, how many statements does an if control?", o: ["Exactly one", "All following statements", "Two", "None"], a: 0, e: "Always using braces prevents bugs when lines are added later." },
  ],
  "if-else-statement": [
    { q: "How many branches of an if-else run?", o: ["Exactly one", "Both", "Neither", "Depends on the compiler"], a: 0, e: "Either the if block or the else block executes." },
    { q: "Which checks whether n is even?", o: ["n % 2 == 0", "n / 2 == 0", "n % 2 == 1 for all n", "n & 2 == 0"], a: 0, e: "n % 2 == 1 fails for negative odd numbers, where the remainder is −1." },
    { q: "if (a) if (b) x(); else y(); Which if does the else belong to?", o: ["The nearest if (b)", "The outer if (a)", "Both", "Compile error"], a: 0, e: "The dangling else binds to the closest if; use braces." },
  ],
  "else-if-ladder": [
    { q: "Marks = 85. Conditions: >= 90 'A', >= 80 'B', >= 70 'C'. What's printed?", o: ["B", "A", "C", "B and C"], a: 0, e: "The first true condition wins and the rest are skipped." },
    { q: "Why order an else-if ladder from most to least restrictive for ranges?", o: ["Broad conditions placed first would catch values meant for later branches", "It's faster to compile", "Java requires it", "It doesn't matter"], a: 0, e: "If >= 70 came first, an 85 would be graded C." },
    { q: "What runs if no condition in an else-if ladder is true and there's no final else?", o: ["Nothing from the ladder", "The first branch", "The last branch", "A runtime error"], a: 0, e: "Add a final else for a default case." },
  ],
  "nested-conditions": [
    { q: "How can deeply nested ifs often be simplified?", o: ["Combine conditions with && or use early returns", "Add more braces", "Use more variables", "They can't"], a: 0, e: "Guard clauses keep the main logic flat." },
    { q: "if (a > 0) { if (b > 0) print(\"Q1\"); } is equivalent to what?", o: ["if (a > 0 && b > 0) print(\"Q1\");", "if (a > 0 || b > 0) print(\"Q1\");", "if (a > b) print(\"Q1\");", "if (!(a > 0)) print(\"Q1\");"], a: 0, e: "Both conditions must be true." },
    { q: "Leap year: divisible by 4 and not by 100, or divisible by 400. Is 1900 a leap year?", o: ["No", "Yes", "Only in some calendars", "Can't tell"], a: 0, e: "1900 is divisible by 100 but not 400." },
  ],
  "switch-statement": [
    { q: "What happens when a case lacks break in a classic switch?", o: ["Execution falls through into the next case", "Compile error", "The switch exits", "It loops"], a: 0, e: "Fall-through continues until a break or the end." },
    { q: "Which types can a classic Java switch use?", o: ["int-compatible types, char, String and enums", "double", "boolean", "long"], a: 0, e: "Pattern matching for switch in Java 21 extends this further." },
    { q: "What does the arrow form case 1 -> x(); change?", o: ["No fall-through, so no break is needed", "It allows doubles", "It runs all cases", "Nothing"], a: 0, e: "Switch expressions with arrows can also return values." },
  ],
  "ternary-operator": [
    { q: "int max = (a > b) ? a : b; with a = 3, b = 7. What is max?", o: ["7", "3", "true", "10"], a: 0, e: "The condition is false, so the second value is chosen." },
    { q: "When is the ternary operator a poor choice?", o: ["When nested deeply, hurting readability", "For choosing between two values", "In assignments", "In return statements"], a: 0, e: "Use if-else for complex logic." },
    { q: "Can the ternary operator replace an if-else that runs statements with no value?", o: ["No; it's an expression that must produce a value", "Yes, always", "Only in loops", "Only for strings"], a: 0, e: "Both branches must yield values of compatible types." },
  ],
  "break-statement": [
    { q: "In nested loops, what does a plain break exit?", o: ["The innermost loop only", "All loops", "The method", "The program"], a: 0, e: "Use a labeled break to exit an outer loop." },
    { q: "for (int i = 0; i < 10; i++) { if (i == 3) break; print(i); } prints what?", o: ["0 1 2", "0 1 2 3", "3", "0 to 9"], a: 0, e: "The loop exits when i reaches 3, before printing." },
    { q: "How do you break out of an outer loop directly?", o: ["Label it, for example outer: for (...), then break outer;", "break 2;", "exit loop;", "return break;"], a: 0, e: "Java supports labeled break and continue." },
  ],
  "continue-statement": [
    { q: "What does continue do inside a for loop?", o: ["Skips to the next iteration, running the update step", "Exits the loop", "Restarts from i = 0", "Ends the method"], a: 0, e: "Remaining statements in the body are skipped." },
    { q: "for (int i = 1; i <= 5; i++) { if (i % 2 == 0) continue; print(i); } prints what?", o: ["1 3 5", "2 4", "1 2 3 4 5", "1"], a: 0, e: "Even numbers are skipped." },
    { q: "In a while loop, what bug does continue commonly cause?", o: ["Skipping the counter update, creating an infinite loop", "Compile errors", "Stack overflow", "Nothing"], a: 0, e: "Update the counter before continue." },
  ],
  "return-statement": [
    { q: "What happens to code after a return in the same block?", o: ["It's unreachable, and Java reports a compile error", "It runs anyway", "It runs after the caller finishes", "It's skipped silently"], a: 0, e: "Unreachable statements are errors in Java." },
    { q: "Can a void method use return?", o: ["Yes, return; with no value to exit early", "No", "Only return null;", "Only at the end"], a: 0, e: "It ends the method immediately." },
    { q: "A method declared to return int has a path with no return. What happens?", o: ["Compile error: missing return statement", "It returns 0", "It returns null", "Runtime exception"], a: 0, e: "Every path must return a value." },
  ],
  "why-loops": [
    { q: "What is the main reason to use loops?", o: ["Repeat work without duplicating code", "Make code longer", "Avoid variables", "Speed up compilation"], a: 0, e: "Loops handle any number of repetitions, known or not." },
    { q: "Which loop suits an unknown number of repetitions until a condition fails?", o: ["while", "for with a fixed count", "switch", "if"], a: 0, e: "for loops fit known counts; while fits condition-driven repetition." },
    { q: "What causes an infinite loop?", o: ["A condition that never becomes false", "Using break", "A for loop", "Printing in the loop"], a: 0, e: "Usually a missing or wrong update to the loop variable." },
  ],
  "for-loop": [
    { q: "How many times does for (int i = 0; i < 5; i += 2) run?", o: ["3", "5", "2", "6"], a: 0, e: "i takes 0, 2 and 4; the next value, 6, fails the condition i < 5." },
    { q: "What is the scope of i in for (int i = 0; ...)?", o: ["Only inside the loop", "The whole method", "The whole class", "Global"], a: 0, e: "Using i after the loop is a compile error." },
    { q: "What does for (;;) {} do?", o: ["Loops forever", "Compile error", "Runs once", "Never runs"], a: 0, e: "All three parts are optional; an empty condition means true." },
  ],
  "while-loop": [
    { q: "int n = 1234, count = 0; while (n > 0) { n /= 10; count++; } What is count?", o: ["4", "3", "1234", "10"], a: 0, e: "Each division removes one digit." },
    { q: "When is a while loop's condition checked?", o: ["Before each iteration", "After each iteration", "Only once", "Never"], a: 0, e: "If it's false initially, the body never runs." },
    { q: "int i = 10; while (i < 5) { i++; } How many times does the body run?", o: ["0", "5", "1", "Infinite"], a: 0, e: "The condition is false from the start." },
  ],
  "do-while-loop": [
    { q: "How many times does a do-while body run at minimum?", o: ["Once", "Zero", "Twice", "Depends on the condition"], a: 0, e: "The condition is checked after the body." },
    { q: "Which task suits a do-while loop?", o: ["Showing a menu at least once until the user chooses exit", "Iterating a known array", "Summing 1 to 10", "Nothing"], a: 0, e: "The action must happen before the first check." },
    { q: "What is required at the end of a do-while in Java?", o: ["A semicolon after while (condition)", "A colon", "Braces after while", "Nothing"], a: 0, e: "do { ... } while (cond);" },
  ],
  "nested-loops": [
    { q: "for (i = 0; i < 3; i++) for (j = 0; j < 4; j++) ... How many inner iterations?", o: ["12", "7", "3", "4"], a: 0, e: "The inner loop runs 4 times for each of the 3 outer iterations: 3 × 4 = 12." },
    { q: "What is the typical time complexity of two nested loops over n?", o: ["O(n²)", "O(n)", "O(2n)", "O(log n)"], a: 0, e: "Each outer iteration runs the full inner loop." },
    { q: "for (i = 0; i < n; i++) for (j = i; j < n; j++) ... runs how many times?", o: ["n(n + 1) / 2", "n²", "n", "2n"], a: 0, e: "n + (n − 1) + ... + 1." },
  ],
  "break-continue-loops": [
    { q: "Searching an array for a target, why use break after finding it?", o: ["To stop scanning once the answer is known", "To skip the target", "break is required", "To restart the loop"], a: 0, e: "It avoids unnecessary iterations." },
    { q: "for (i = 0; i < 5; i++) { if (i == 2) continue; if (i == 4) break; print(i); } prints what?", o: ["0 1 3", "0 1 2 3", "0 1", "0 1 3 4"], a: 0, e: "2 is skipped and the loop stops at 4." },
    { q: "Does continue in an inner loop affect the outer loop?", o: ["No; it skips to the inner loop's next iteration", "Yes, it skips the outer iteration", "It exits both", "It restarts the outer loop"], a: 0, e: "Use a labeled continue to target the outer loop." },
  ],
  "counting-accumulation-patterns": [
    { q: "To sum an array, what should the accumulator start at?", o: ["0", "1", "The first element always", "null"], a: 0, e: "Start at the identity for addition." },
    { q: "To compute a product of numbers, what should the accumulator start at?", o: ["1", "0", "-1", "The array length"], a: 0, e: "Starting at 0 would make every product 0." },
    { q: "Why use long for the sum of many large ints?", o: ["The total can overflow int's range of about 2.1 billion", "long is faster", "int can't be summed", "To store decimals"], a: 0, e: "Overflow wraps silently to negative values." },
  ],
  "basic-pattern-problems": [
    { q: "A right triangle of stars with 5 rows prints how many stars in total?", o: ["15", "25", "10", "5"], a: 0, e: "1 + 2 + 3 + 4 + 5 = 15." },
    { q: "In a pattern loop, what usually controls the number of rows?", o: ["The outer loop", "The inner loop", "A switch", "The print statement"], a: 0, e: "The inner loop controls what's printed on each row." },
    { q: "For row i (starting at 1) of a centred pyramid of n rows, how many leading spaces?", o: ["n − i", "i", "2i − 1", "n"], a: 0, e: "Then print 2i − 1 stars." },
  ],
  "what-is-an-array": [
    { q: "Which statement about Java arrays is true?", o: ["Their size is fixed after creation", "They grow automatically", "They can mix int and String elements", "They start at index 1"], a: 0, e: "Use ArrayList when the size must change." },
    { q: "Why is accessing arr[i] fast?", o: ["Elements are contiguous, so the address is computed directly", "Java searches from the start", "Arrays are hash tables", "It isn't fast"], a: 0, e: "Access by index is O(1)." },
    { q: "Arrays in Java are what kind of type?", o: ["Objects stored on the heap", "Primitives", "Stack-only values", "Strings"], a: 0, e: "An array variable holds a reference." },
  ],
  "array-declaration-initialization": [
    { q: "What are the default values in new int[5]?", o: ["All 0", "Garbage", "All null", "1 to 5"], a: 0, e: "Numeric arrays default to 0, booleans to false, objects to null." },
    { q: "Which is a valid initialization?", o: ["int[] a = {1, 2, 3};", "int a[] = new int[];", "int[] a = new int[3]{1, 2, 3};", "int a = {1, 2, 3};"], a: 0, e: "When values are given, the size is inferred." },
    { q: "What is the default value of each element in new String[3]?", o: ["null", "\"\"", "\"null\"", "0"], a: 0, e: "Object references default to null." },
  ],
  "array-indexing": [
    { q: "What is the last valid index of an array of length n?", o: ["n − 1", "n", "n + 1", "1"], a: 0, e: "Indexing starts at 0." },
    { q: "Accessing arr[arr.length] throws what?", o: ["ArrayIndexOutOfBoundsException", "NullPointerException", "Nothing; returns 0", "IndexError"], a: 0, e: "Java bounds-checks every access." },
    { q: "Which loop condition causes an off-by-one error?", o: ["i <= arr.length", "i < arr.length", "i < n where n = arr.length", "i >= 0 counting down from length − 1"], a: 0, e: "<= reaches index length, which doesn't exist." },
  ],
  "traversing-arrays": [
    { q: "What can't you do inside an enhanced for loop (for (int x : arr))?", o: ["Get the index directly or reassign array elements through x", "Read elements", "Sum elements", "Print elements"], a: 0, e: "x is a copy; assigning to it doesn't change the array." },
    { q: "How do you traverse an array in reverse?", o: ["for (int i = arr.length - 1; i >= 0; i--)", "for (int i = arr.length; i > 0; i--) using arr[i]", "for (int x : arr.reverse())", "Arrays can't be reversed"], a: 0, e: "Start at the last valid index." },
    { q: "What does Arrays.toString(new int[]{1, 2}) return?", o: ["\"[1, 2]\"", "\"12\"", "A memory address", "\"{1, 2}\""], a: 0, e: "Printing the array directly shows a type and hash code instead." },
  ],
  "taking-array-input": [
    { q: "To read n numbers into an array, what do you do first?", o: ["Read n, then create int[] arr = new int[n]", "Create an array of size 0", "Read numbers until EOF into a fixed array of 10", "Nothing"], a: 0, e: "The size must be known before creating the array." },
    { q: "Which loop fills arr from input correctly?", o: ["for (int i = 0; i < n; i++) arr[i] = sc.nextInt();", "for (int i = 1; i <= n; i++) arr[i] = sc.nextInt();", "while (true) arr = sc.nextInt();", "arr = sc.nextInt();"], a: 0, e: "Array indices run from 0 to n − 1, so starting at 1 skips arr[0] and overflows at arr[n]." },
    { q: "Why use BufferedReader instead of Scanner for huge inputs?", o: ["It's much faster for large inputs", "Scanner can't read ints", "BufferedReader parses automatically", "It uses less code"], a: 0, e: "Scanner's regex parsing is slow at millions of tokens." },
  ],
  "searching-arrays": [
    { q: "What is the worst-case time of linear search?", o: ["O(n)", "O(log n)", "O(1)", "O(n²)"], a: 0, e: "The target may be last or absent." },
    { q: "What does binary search require?", o: ["A sorted array", "An unsorted array", "A linked list", "Unique elements only"], a: 0, e: "Each comparison discards half of the sorted range." },
    { q: "About how many comparisons does binary search need for 1,000,000 elements?", o: ["20", "1,000", "500,000", "100"], a: 0, e: "log₂(1,000,000) ≈ 20." },
  ],
  "min-max-sum": [
    { q: "Why initialize max to arr[0] rather than 0?", o: ["0 would be wrong if all elements are negative", "arr[0] is always the max", "It's faster", "0 can't be compared"], a: 0, e: "Integer.MIN_VALUE is another safe start." },
    { q: "How many comparisons does finding the max of n elements need?", o: ["n − 1", "n²", "log n", "2n"], a: 0, e: "Compare each remaining element once." },
    { q: "What is the average of {2, 4, 9} using int arithmetic sum / 3?", o: ["5", "5.0", "5.33", "6"], a: 0, e: "15 / 3 = 5 exactly; use (double) sum / n for non-integer averages." },
  ],
  "two-dimensional-arrays": [
    { q: "int[][] m = new int[3][4]; What is m.length?", o: ["3", "4", "12", "7"], a: 0, e: "m.length is the number of rows; m[0].length is columns." },
    { q: "What is a jagged array?", o: ["A 2D array whose rows have different lengths", "An unsorted array", "An array of chars", "A broken array"], a: 0, e: "Java's 2D arrays are arrays of arrays." },
    { q: "How many elements does a 3 × 4 matrix's main diagonal have, starting at m[0][0]?", o: ["3", "4", "12", "7"], a: 0, e: "The diagonal stops at the smaller dimension." },
  ],
  "what-is-a-string": [
    { q: "Are Java Strings mutable?", o: ["No; operations return new strings", "Yes", "Only with final", "Only short strings"], a: 0, e: "Use StringBuilder for repeated modification." },
    { q: "Is String a primitive type in Java?", o: ["No; it's a class", "Yes", "Only for literals", "Only in arrays"], a: 0, e: "String has methods such as length() and charAt()." },
    { q: "s.toUpperCase(); System.out.println(s); with s = \"hi\" prints what?", o: ["hi", "HI in capitals", "null", "Compile error"], a: 0, e: "The result was discarded; s itself didn't change." },
  ],
  "string-creation": [
    { q: "String a = \"java\"; String b = \"java\"; a == b is what?", o: ["true, both use the string pool", "false", "Compile error", "Random"], a: 0, e: "Identical literals share one pooled object." },
    { q: "String a = \"java\"; String b = new String(\"java\"); a == b is what?", o: ["false", "true", "Compile error", "NullPointerException"], a: 0, e: "new always creates a separate object." },
    { q: "Which efficiently builds a string in a loop?", o: ["StringBuilder", "String +=", "String.concat in a loop", "char arrays printed one by one"], a: 0, e: "StringBuilder appends to one buffer." },
  ],
  "string-indexing": [
    { q: "In \"hello\", what is the index of 'o'?", o: ["4", "5", "3", "0"], a: 0, e: "Indices run 0 to length − 1." },
    { q: "What does \"hello\".indexOf('l') return?", o: ["2", "3", "1", "-1"], a: 0, e: "indexOf returns the first occurrence." },
    { q: "What does \"hello\".indexOf('z') return?", o: ["-1", "0", "Exception", "5"], a: 0, e: "indexOf returns -1 when the character doesn't occur anywhere in the string." },
  ],
  "length-method": [
    { q: "What is \"Hello World\".length()?", o: ["11", "10", "12", "2"], a: 0, e: "The space counts as a character." },
    { q: "How do you get an array's size compared with a String's?", o: ["arr.length (field) vs str.length() (method)", "Both length()", "Both .length", "size() for both"], a: 0, e: "A common source of compile errors." },
    { q: "What is \"\".length()?", o: ["0", "1", "null", "Exception"], a: 0, e: "An empty string has no characters." },
  ],
  "charat-method": [
    { q: "What does \"Java\".charAt(1) return?", o: ["'a'", "'J'", "'v'", "\"a\""], a: 0, e: "charAt returns a char at a zero-based index." },
    { q: "\"Java\".charAt(4) throws what?", o: ["StringIndexOutOfBoundsException", "ArrayIndexOutOfBoundsException", "Nothing; returns ' '", "NullPointerException"], a: 0, e: "Valid indices are 0 to 3." },
    { q: "What is 'a' + 1 in Java?", o: ["98 (an int)", "'b'", "\"a1\"", "Compile error"], a: 0, e: "char promotes to int in arithmetic; cast to char for 'b'." },
  ],
  "substring-method": [
    { q: "What is \"hello\".substring(1, 3)?", o: ["\"el\"", "\"ell\"", "\"he\"", "\"llo\""], a: 0, e: "The end index is exclusive." },
    { q: "What is \"hello\".substring(2)?", o: ["\"llo\"", "\"he\"", "\"ello\"", "\"l\""], a: 0, e: "From index 2 to the end." },
    { q: "What is \"hello\".substring(2, 2)?", o: ["\"\" (empty string)", "\"l\"", "Exception", "null"], a: 0, e: "Equal start and end give an empty string." },
  ],
  "string-comparison": [
    { q: "Which compares string contents ignoring case?", o: ["equalsIgnoreCase()", "==", "compareTo()", "equals() always"], a: 0, e: "\"Java\".equalsIgnoreCase(\"JAVA\") is true." },
    { q: "What sign does \"apple\".compareTo(\"banana\") have?", o: ["Negative", "Positive", "Zero", "It throws"], a: 0, e: "'a' comes before 'b' lexicographically." },
    { q: "Why does s.equals(\"yes\") throw when s is null, but \"yes\".equals(s) doesn't?", o: ["Calling a method on null throws NullPointerException", "equals is static", "Literals are special", "Both throw"], a: 0, e: "Put the literal first, or use Objects.equals." },
  ],
  "basic-string-problems": [
    { q: "How do you reverse a String concisely in Java?", o: ["new StringBuilder(s).reverse().toString()", "s.reverse()", "String.reverse(s)", "s.charAt(-1)"], a: 0, e: "String has no reverse method." },
    { q: "How many vowels are in \"programming\"?", o: ["3", "2", "4", "5"], a: 0, e: "The vowels in programming are o, a and i, so the count is 3." },
    { q: "Which checks whether s is a palindrome?", o: ["Compare s.charAt(i) with s.charAt(n − 1 − i) for i < n/2", "s == s", "s.length() % 2 == 0", "s.equals(s.toUpperCase())"], a: 0, e: "Two pointers moving inward." },
  ],
  "what-is-a-method": [
    { q: "What is a method?", o: ["A named block of code that performs a task and can be called", "A variable", "A class file", "A loop"], a: 0, e: "Methods may take parameters and return a value." },
    { q: "What do you call the values passed in a call like add(2, 3)?", o: ["Arguments", "Parameters", "Return values", "Fields"], a: 0, e: "Parameters are the variables in the method declaration." },
    { q: "Which keyword means a method returns nothing?", o: ["void", "null", "empty", "none"], a: 0, e: "void methods perform actions without producing a value." },
  ],
  "why-use-methods": [
    { q: "Which is a main benefit of methods?", o: ["Reuse and easier testing of small pieces", "Longer programs", "Fewer variables", "Avoiding compilation"], a: 0, e: "Fix a bug once inside the method and every caller benefits." },
    { q: "What does the DRY principle stand for?", o: ["Don't Repeat Yourself", "Do Repeat Yourself", "Debug Run Yield", "Define Return Yes"], a: 0, e: "Duplicate logic belongs in a shared method." },
    { q: "Why keep methods short and focused?", o: ["They're easier to read, name and test", "The JVM limits method length to 10 lines", "Short methods use less RAM", "They run in parallel"], a: 0, e: "One task per method improves clarity." },
  ],
  "method-syntax": [
    { q: "In public static int sum(int a, int b), what is the return type?", o: ["int", "public", "static", "sum"], a: 0, e: "Modifiers, return type, name, then parameters." },
    { q: "What makes up a method's signature in Java?", o: ["Its name and parameter types", "Its return type only", "Its access modifier", "Its body"], a: 0, e: "Return type isn't part of the signature for overloading." },
    { q: "Can you call a non-static method directly from main?", o: ["No; create an object first", "Yes, always", "Only if public", "Only if void"], a: 0, e: "main is static and has no current object." },
  ],
  "method-parameters": [
    { q: "void change(int x) { x = 10; } int a = 5; change(a); What is a?", o: ["5", "10", "0", "Compile error"], a: 0, e: "Primitives are passed by value; the method changes its own copy." },
    { q: "void change(int[] arr) { arr[0] = 10; } What happens to the caller's array?", o: ["Its first element becomes 10", "Nothing", "It becomes null", "Compile error"], a: 0, e: "The reference is copied, but both point to the same array." },
    { q: "What does int... nums in a parameter list mean?", o: ["Varargs: any number of int arguments as an array", "A pointer", "An optional parameter", "A syntax error"], a: 0, e: "Varargs must be the last parameter." },
  ],
  "return-values": [
    { q: "How many values can a Java method return directly?", o: ["One (which can be an object or array holding several)", "Unlimited", "Two", "None"], a: 0, e: "Return a record or array to bundle results." },
    { q: "int f() { return 3.5; } What happens?", o: ["Compile error: possible lossy conversion", "Returns 3", "Returns 4", "Returns 3.5"], a: 0, e: "Narrowing double to int needs an explicit cast." },
    { q: "Can you ignore a method's return value?", o: ["Yes; calling it as a statement is allowed", "No", "Only for void methods", "Only in main"], a: 0, e: "Ignoring results of methods like s.trim() is a common bug, though." },
  ],
  "void-methods": [
    { q: "What does System.out.println(voidMethod()) do?", o: ["Compile error: void can't be printed", "Prints null", "Prints nothing", "Runtime exception"], a: 0, e: "A void call isn't an expression with a value." },
    { q: "When is a void method appropriate?", o: ["When the method performs an action, such as printing or updating state", "When computing a value for the caller", "Never", "Only in main"], a: 0, e: "Methods that compute values should return them." },
    { q: "What does return; inside a void method do?", o: ["Exits the method early", "Returns null", "Compile error", "Restarts the method"], a: 0, e: "Useful for guard clauses." },
  ],
  "method-overloading-basics": [
    { q: "Which pair overloads correctly?", o: ["add(int, int) and add(double, double)", "add(int, int) returning int and returning long", "add(int a) and add(int b)", "add() and Add() only by case"], a: 0, e: "Overloads differ in parameter types or counts." },
    { q: "Given show(int) and show(double), which does show(5) call?", o: ["show(int)", "show(double)", "Compile error", "Both"], a: 0, e: "5 is an int literal, so the exact match show(int) wins over widening to double." },
    { q: "Is println an overloaded method?", o: ["Yes; it has versions for int, String, double and more", "No", "Only in Java 21", "It's a field"], a: 0, e: "That's why println works with many types." },
  ],
  "scope-and-tracing": [
    { q: "A variable declared inside an if block is visible where?", o: ["Only inside that block", "In the whole method", "In the whole class", "Everywhere"], a: 0, e: "Scope ends at the closing brace." },
    { q: "Can a local variable have the same name as a field?", o: ["Yes; it shadows the field within its scope", "No", "Only if final", "Only in static methods"], a: 0, e: "Use this.name to reach the field." },
    { q: "Why trace code with a table of variable values?", o: ["To find logic errors by following each step", "To compile faster", "To format output", "To remove variables"], a: 0, e: "Dry runs reveal off-by-one and update mistakes." },
  ],
  "memory-execution-overview": [
    { q: "Which JVM memory area stores objects?", o: ["Heap", "Stack", "Program counter register", "Native method stack"], a: 0, e: "Each thread has its own stack; the heap is shared." },
    { q: "What is stored in a stack frame?", o: ["Local variables, parameters and the return address", "All objects", "Class bytecode", "Static fields"], a: 0, e: "A frame is pushed per method call." },
    { q: "Where does Java store class metadata in modern JVMs?", o: ["Metaspace", "Stack", "Young generation", "Registers"], a: 0, e: "Metaspace replaced PermGen in Java 8." },
  ],
  "stack-memory": [
    { q: "What causes StackOverflowError?", o: ["Recursion that is too deep or never ends", "Too many objects", "A full disk", "An infinite while loop with no calls"], a: 0, e: "Each call adds a frame until the stack's fixed size runs out." },
    { q: "When is a method's stack frame removed?", o: ["When the method returns", "When the GC runs", "At program exit only", "Never"], a: 0, e: "Stack memory is freed automatically and instantly." },
    { q: "Do threads share a call stack?", o: ["No; each thread has its own stack", "Yes", "Only daemon threads", "Only in main"], a: 0, e: "That's why local variables are thread-confined." },
  ],
  "heap-memory": [
    { q: "What error occurs when the heap is exhausted?", o: ["OutOfMemoryError", "StackOverflowError", "NullPointerException", "HeapException"], a: 0, e: "Increase -Xmx or fix leaks holding references." },
    { q: "Which JVM option sets the maximum heap size?", o: ["-Xmx", "-Xss", "-Xms only", "-heap"], a: 0, e: "-Xms sets the initial size; -Xss sets thread stack size." },
    { q: "Most objects die young. Which heap design uses this?", o: ["Generational collection with young and old generations", "Single flat heap only", "Stack allocation only", "Reference counting only"], a: 0, e: "Young objects are collected cheaply and often." },
  ],
  "garbage-collection": [
    { q: "Does System.gc() guarantee immediate garbage collection?", o: ["No; it's only a request", "Yes", "Only on Windows", "Only for strings"], a: 0, e: "The JVM decides when to collect." },
    { q: "Can Java have memory leaks despite garbage collection?", o: ["Yes, when unused objects remain referenced, for example in static collections", "No, never", "Only with native code", "Only in Java 8"], a: 0, e: "The GC can't free reachable objects." },
    { q: "Two objects reference only each other and nothing else does. Are they collected?", o: ["Yes; the GC traces reachability from roots", "No; cyclic references leak in Java", "Only if final", "Only after restart"], a: 0, e: "Java's tracing collectors handle cycles, unlike pure reference counting." },
  ],
  "jit-compilation": [
    { q: "What does the JIT compiler do?", o: ["Compiles frequently run bytecode into native machine code at runtime", "Compiles Java source to bytecode", "Removes unused classes", "Interprets every line forever"], a: 0, e: "Hot methods get optimized as the program runs." },
    { q: "Why do Java programs often get faster after running a while?", o: ["Warm-up: the JIT optimizes hot code paths", "The CPU heats up", "The GC stops", "Caches are cleared"], a: 0, e: "Benchmarks should include warm-up runs." },
    { q: "Which optimization replaces a method call with the method's body?", o: ["Inlining", "Boxing", "Garbage collection", "Serialization"], a: 0, e: "Inlining removes call overhead and enables further optimizations." },
  ],
  "execution-engine": [
    { q: "Which component loads .class files into the JVM?", o: ["The class loader", "The JIT compiler", "The garbage collector", "javac"], a: 0, e: "Loading, linking and initialization prepare classes for execution." },
    { q: "What does the bytecode verifier check?", o: ["That bytecode is well formed and type safe before running", "Code style", "Performance", "Spelling"], a: 0, e: "It protects the JVM from malformed or malicious class files." },
    { q: "Which parts make up the JVM execution engine?", o: ["Interpreter, JIT compiler and garbage collector", "javac and jar", "Stack and heap only", "The OS kernel"], a: 0, e: "They execute bytecode and manage memory." },
  ],
  "problem-solving-approach": [
    { q: "What should you do after understanding a problem?", o: ["Work through small examples, including edge cases", "Start coding immediately", "Optimize first", "Skip testing"], a: 0, e: "Examples reveal patterns and pitfalls." },
    { q: "Which is an edge case for 'find the largest number in an array'?", o: ["An array with one element or all negatives", "An array of 10 positive numbers", "A sorted array of 5 numbers", "An array of even numbers"], a: 0, e: "Edge cases test boundaries of the input space." },
    { q: "What is pseudocode?", o: ["An informal, language-neutral outline of an algorithm", "Broken code", "Compiled code", "A Java keyword"], a: 0, e: "It lets you focus on logic before syntax." },
  ],
  "breaking-problems-into-steps": [
    { q: "What does decomposition mean in problem solving?", o: ["Splitting a problem into smaller sub-problems", "Deleting code", "Compiling in parts", "Using recursion only"], a: 0, e: "Each part can be solved and tested separately." },
    { q: "To check if a number is an Armstrong number, which is a good first sub-step?", o: ["Count its digits", "Sort the digits", "Reverse the number", "Convert to binary"], a: 0, e: "Each digit is raised to the power of the digit count." },
    { q: "Why write a helper method like isPrime(n)?", o: ["It isolates one sub-problem, making the main logic clearer", "It's required", "It runs faster", "It avoids loops"], a: 0, e: "Small named steps read like the algorithm." },
  ],
  "what-is-recursion": [
    { q: "What is recursion?", o: ["A method calling itself on a smaller version of the problem", "A loop keyword", "A type of array", "An exception"], a: 0, e: "Every recursive solution needs a base case." },
    { q: "Which problem is naturally recursive?", o: ["Traversing a folder tree", "Adding two numbers", "Printing one line", "Swapping two variables"], a: 0, e: "Nested structures suit recursion." },
    { q: "Can every recursive algorithm be written iteratively?", o: ["Yes, for example with an explicit stack", "No", "Only tail-recursive ones", "Only in Java"], a: 0, e: "Recursion uses the call stack implicitly." },
  ],
  "base-case": [
    { q: "What happens if a recursive method has no base case?", o: ["It recurses until StackOverflowError", "It returns 0", "It loops once", "Compile error"], a: 0, e: "Nothing stops the calls." },
    { q: "What is the base case for factorial(n)?", o: ["n <= 1 returns 1", "n == 10", "n < 0 returns n", "There is none"], a: 0, e: "0! and 1! both equal 1, and stopping there prevents infinite recursion." },
    { q: "What is a good base case for summing the digits of n?", o: ["n == 0 returns 0", "n == 1 returns 1 only", "n == 10", "n < 100"], a: 0, e: "sumDigits(n) = n % 10 + sumDigits(n / 10)." },
  ],
  "recursive-case": [
    { q: "What must the recursive case do?", o: ["Move toward the base case with a smaller input", "Call main", "Print output", "Increase n"], a: 0, e: "Otherwise the recursion never ends." },
    { q: "What is the recursive case of power(x, n)?", o: ["x * power(x, n − 1)", "power(x, n + 1)", "x + power(x, n)", "power(n, x)"], a: 0, e: "With base case power(x, 0) = 1." },
    { q: "f(n) = n + f(n − 1), f(0) = 0. What is f(4)?", o: ["10", "4", "24", "6"], a: 0, e: "4 + 3 + 2 + 1 + 0 = 10." },
  ],
  "basic-recursion-problems": [
    { q: "What is factorial(5)?", o: ["120", "24", "60", "720"], a: 0, e: "factorial(5) = 5 × 4 × 3 × 2 × 1 = 120." },
    { q: "With fib(0) = 0 and fib(1) = 1, what is fib(6)?", o: ["8", "5", "13", "6"], a: 0, e: "The sequence runs 0, 1, 1, 2, 3, 5, 8, so fib(6) = 8." },
    { q: "Why is naive recursive Fibonacci slow?", o: ["It recomputes the same subproblems exponentially many times", "Recursion is always slow", "It uses doubles", "It has no base case"], a: 0, e: "Memoization or iteration makes it O(n)." },
  ],
};
