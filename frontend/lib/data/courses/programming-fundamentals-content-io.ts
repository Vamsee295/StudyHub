// Module 4 - Input & Output (5 lessons)
import { CourseLessonContent } from './types';

export const inputOutputLessons: Array<{
  slug: string;
  title: string;
  content: CourseLessonContent
}> = [
  {
    slug: "printing-output",
    title: "Printing Output",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "Before studying console output, you should understand primitive data types, variables, strings, and basic Java class structure."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of your computer as having three standard pipes (streams) connected to your program: Standard Input (`System.in`), Standard Output (`System.out`), and Standard Error (`System.err`). Printing output is the act of pushing formatted character bytes into the Standard Output pipe so your operating system terminal can display them."
        },
        {
          type: "callout",
          title: "Standard Streams in Java",
          content: "Java provides two built-in output streams in the `java.lang.System` class:\n• `System.out` (Standard Output): Buffered output stream for normal application messages, results, and prompts.\n• `System.err` (Standard Error): Unbuffered output stream dedicated to error messages, warnings, and stack traces, ensuring errors appear immediately even if the main output buffer is full."
        },
        {
          type: "table",
          title: "Console Output Methods Comparison",
          headers: ["Method", "Stream", "Appends Newline?", "Supports Formatting?", "Typical Use Case"],
          rows: [
            ["System.out.print()", "PrintStream", "No", "No", "Prompts (\"Enter age: \"), inline loops"],
            ["System.out.println()", "PrintStream", "Yes", "No", "Standard line-by-line messages"],
            ["System.out.printf()", "PrintStream", "No (use %n)", "Yes", "Tables, decimal precision, aligned reports"],
            ["System.out.format()", "PrintStream", "No (use %n)", "Yes", "Exact synonym for printf()"],
            ["System.err.println()", "PrintStream", "Yes", "No", "Error logging, diagnostic warnings"]
          ]
        },
        {
          type: "code",
          title: "The Core Output Methods in Action",
          code: "// 1. print() keeps cursor on the same line\nSystem.out.print(\"Connecting\");\nSystem.out.print(\"...\");\nSystem.out.print(\" [DONE]\"); // Output: Connecting... [DONE]\n\n// 2. println() appends a newline character\nSystem.out.println(); // Prints empty newline\nSystem.out.println(\"User: Vamsee\");\nSystem.out.println(\"Role: Admin\");\n\n// 3. String concatenation in println\nint score = 95;\nSystem.out.println(\"Final Score: \" + score + \" / 100\");\n\n// 4. System.err for distinct error streams\nif (score < 0) {\n    System.err.println(\"CRITICAL: Negative score detected!\");\n}",
          language: "java",
          explanation: "System.out is an instance of java.io.PrintStream. It handles byte-to-character encoding automatically based on your system console."
        },
        {
          type: "tryIt",
          title: "Try It: Predict Output Stream Sequence",
          code: "System.out.print(\"A\");\nSystem.out.println(\"B\");\nSystem.out.print(\"C\");\nSystem.out.println(\"D\");",
          expectedOutput: "AB\nCD",
          explanation: "'A' prints with no newline. 'B' prints right after 'A' on line 1, then moves cursor to line 2. 'C' prints on line 2, and 'D' prints after 'C' before moving to line 3."
        },
        {
          type: "dryRun",
          title: "Console Cursor Movement Trace",
          iterations: [
            { step: 1, variables: { "call": "print(\"Loading\")", "cursor": "Col 8, Line 1" }, description: "Prints 'Loading'. Cursor stays at end of word on Line 1." },
            { step: 2, variables: { "call": "print(\": \")", "cursor": "Col 10, Line 1" }, description: "Appends ': '. Cursor remains on Line 1." },
            { step: 3, variables: { "call": "println(\"100%\")", "cursor": "Col 1, Line 2" }, description: "Prints '100%' and sends newline separator, advancing cursor to start of Line 2." }
          ]
        },
        {
          type: "warning",
          title: "Common Output Mistakes",
          items: [
            "Excessive string concatenation inside tight loops: 'System.out.println(\"val: \" + a + \", \" + b)' creates multiple temporary String objects.",
            "Assuming System.out and System.err print in exact chronological order on the console: Because System.err is unbuffered and System.out is buffered, their output lines can interleave unpredictably.",
            "Forgetting that System.out.println() with no arguments prints a clean blank newline."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Output Streams",
          traps: [
            {
              question: "What is 'System.out' in terms of Java class hierarchy?",
              trap: "Calling it a method or keyword.",
              solution: "'System' is a final class in 'java.lang'. 'out' is a public static final field of type 'java.io.PrintStream'. Methods like 'println()' are member methods of the PrintStream class."
            },
            {
              question: "Can System.out.println() ever throw an IOException?",
              trap: "Thinking all I/O operations must declare 'throws IOException'.",
              solution: "No! Unlike standard Java I/O streams, PrintStream methods (print, println, printf) suppress and catch internal IOExceptions, storing an error flag accessible via 'System.out.checkError()'."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "What is the return type of System.out.println(\"Hello\")?",
          options: [
            "int",
            "boolean",
            "void",
            "String"
          ],
          answer: 2,
          explanation: "System.out.println() has a 'void' return type because its sole purpose is performing the side effect of writing bytes to the console stream."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "System.out is a PrintStream for standard output; System.err is an unbuffered stream for diagnostics.",
            "print() stays on the same line; println() appends a newline.",
            "PrintStream methods never throw checked IOExceptions."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we compare print() vs println() vs printf(), mastering formatted output specifiers (%d, %f, %s, %n), precision control, and column alignment."
        }
      ]
    }
  },
  {
    slug: "print-vs-println",
    title: "print() vs println()",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand primitive types, strings, and basic console output."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of console output like typing on a typewriter. `print()` types characters and leaves the typewriter carriage exactly where it stopped. `println()` types the characters and then pulls the carriage return lever, moving to the start of the next line. `printf()` is a stencil that formats and positions values before printing."
        },
        {
          type: "table",
          title: "The Core printf() Format Specifiers",
          headers: ["Specifier", "Data Type", "Formatting Example", "Input Value", "Formatted Output"],
          rows: [
            ["%d", "Integer (byte, short, int, long)", "\"Count: %5d\"", "42", "\"Count:    42\" (width 5)"],
            ["%05d", "Zero-padded integer", "\"ID: %05d\"", "7", "\"ID: 00007\""],
            ["%f", "Floating point (float, double)", "\"Price: %.2f\"", "19.956", "\"Price: 19.96\" (2 decimal round)"],
            ["%e", "Scientific notation", "\"Exp: %.2e\"", "12345.67", "\"Exp: 1.23e+04\""],
            ["%s", "String or Object toString()", "\"User: %-10s!\"", "\"Alice\"", "\"User: Alice     !\" (left-align)"],
            ["%c", "Character (char)", "\"Grade: %c\"", "'A'", "\"Grade: A\""],
            ["%b", "Boolean", "\"Active: %b\"", "true", "\"Active: true\""],
            ["%n", "Platform-neutral newline", "\"Line1%nLine2\"", "None", "Works on Windows (\\r\\n) & Linux (\\n)"],
            ["%%", "Literal percent sign", "\"Tax: %d%%\"", "18", "\"Tax: 18%\""]
          ]
        },
        {
          type: "code",
          title: "Tabular & Currency Formatting with printf()",
          code: "// 1. Aligning columns with width specifiers\nSystem.out.printf(\"%-15s %-10s %8s%n\", \"ITEM\", \"QTY\", \"PRICE\");\nSystem.out.printf(\"-----------------------------------%n\");\nSystem.out.printf(\"%-15s %-10d $%7.2f%n\", \"Mechanical KB\", 2, 129.99);\nSystem.out.printf(\"%-15s %-10d $%7.2f%n\", \"Gaming Mouse\", 1, 59.50);\nSystem.out.printf(\"%-15s %-10d $%7.2f%n\", \"USB-C Cable\", 4, 9.99);\n\n// Output:\n// ITEM            QTY            PRICE\n// -----------------------------------\n// Mechanical KB   2            $ 129.99\n// Gaming Mouse    1            $  59.50\n// USB-C Cable     4            $   9.99\n\n// 2. Comma grouping for large numbers with ',':\nlong population = 8100000000L;\nSystem.out.printf(\"World Pop: %,d%n\", population); // \"World Pop: 8,100,000,000\"",
          language: "java",
          explanation: "Flags in printf: '-' left-aligns, ',' adds thousands separators, '.2' specifies 2 decimal places, and '%n' ensures cross-platform newlines."
        },
        {
          type: "tryIt",
          title: "Try It: Formatted Price Output",
          code: "double itemPrice = 45.6789;\nint quantity = 3;\nSystem.out.printf(\"%d x $%.2f = $%.2f%n\", quantity, itemPrice, quantity * itemPrice);",
          expectedOutput: "3 x $45.68 = $137.04",
          explanation: "'%.2f' rounds 45.6789 to 45.68, and rounds 137.0367 to 137.04."
        },
        {
          type: "dryRun",
          title: "printf() Specifier Parsing Trace",
          iterations: [
            { step: 1, variables: { "formatStr": "\"%04d\"", "val": "25" }, description: "Format requires a minimum width of 4 with leading zero padding." },
            { step: 2, variables: { "val length": "2 digits (\"25\")", "padding needed": "4 - 2 = 2 zeros" }, description: "Calculate 2 leading zeros required to satisfy width 4." },
            { step: 3, variables: { "output": "\"0025\"" }, description: "Generates final formatted string \"0025\"." }
          ]
        },
        {
          type: "warning",
          title: "Common printf Mistakes",
          items: [
            "Using '\\n' instead of '%n' in printf: '\\n' hardcodes Unix linebreaks, while '%n' respects the host OS line separator (important on Windows servers).",
            "Mismatching specifier types (e.g. passing a double to '%d'): Throws a runtime 'java.util.IllegalFormatConversionException'.",
            "Forgetting that printf() does NOT automatically add a newline at the end."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Formatting",
          traps: [
            {
              question: "What happens if you run: System.out.printf(\"%d\", 3.14);?",
              trap: "Thinking it truncates 3.14 to 3.",
              solution: "Throws runtime 'IllegalFormatConversionException: d != java.lang.Double'! Unlike casting, printf() does not perform narrowing conversions—the format specifier must match the argument type."
            },
            {
              question: "What does 'System.out.printf(\"%b\", \"hello\");' print?",
              trap: "Thinking it causes a format error or prints false.",
              solution: "Prints 'true'! In Java printf, '%b' evaluates any non-null object or string as 'true', and null as 'false'. It only tests boolean values directly if a boolean primitive is passed."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Which format specifier prints a floating-point number with exactly 3 decimal digits?",
          options: [
            "%3f",
            "%.3f",
            "%f.3",
            "%float(3)"
          ],
          answer: 1,
          explanation: "'%.3f' instructs printf to format a floating point number with a precision of 3 digits after the decimal point."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "print() = no newline; println() = automatic newline; printf() = parameterized formatting.",
            "Key specifiers: %d (int), %f (float/double), %s (string), %n (portable newline), %,d (comma grouping).",
            "Mismatching format specifiers throws runtime IllegalFormatConversionException."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Escape Sequences (\\n, \\t, \\\\, \\\", \\uXXXX), mastering special character syntax inside strings, Windows file path formatting, and Unicode literals."
        }
      ]
    }
  },
  {
    slug: "escape-sequences",
    title: "Escape Sequences",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand string literals (`\"text\"`), character literals (`'A'`), and console output."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "In Java source code, quotes `\"` and backslashes `\\` have special grammatical meanings (starting strings, etc.). An escape sequence uses the backslash as an 'escape key', telling the compiler: 'Do not treat the next character as code syntax; treat it as a literal or control character inside the string.'"
        },
        {
          type: "table",
          title: "Complete List of Java Escape Sequences",
          headers: ["Escape Sequence", "Name", "Unicode Code", "Description / Behavior", "Example"],
          rows: [
            ["\\n", "Newline (Line Feed)", "\\u000A", "Moves cursor to start of next line", "\"Hello\\nWorld\""],
            ["\\t", "Horizontal Tab", "\\u0009", "Inserts tab space (aligns to 4/8 char boundary)", "\"Col1\\tCol2\""],
            ["\\\\", "Backslash", "\\u005C", "Prints a literal backslash character", "\"C:\\\\Users\\\\Admin\""],
            ["\\\"", "Double Quote", "\\u0022", "Includes quote inside string literal", "\"He said, \\\"Hi\\\"\""],
            ["\\'", "Single Quote", "\\u0027", "Includes single quote inside character literal", "'\\''"],
            ["\\r", "Carriage Return", "\\u000D", "Moves cursor to column 0 on current line", "\"Over\\rDone\""],
            ["\\b", "Backspace", "\\u0008", "Moves cursor back one position", "\"Hi\\b!\" -> \"H!\""],
            ["\\uXXXX", "Unicode Escape", "Varies", "Inserts any 16-bit Unicode character (hex code)", "\"\\u20AC 50\" (€ 50)"]
          ]
        },
        {
          type: "code",
          title: "Escape Sequences in Practice",
          code: "// 1. Quotes inside strings\nString quote = \"Albert Einstein once said, \\\"Creativity is intelligence having fun.\\\"\";\nSystem.out.println(quote);\n\n// 2. Windows file path requiring escaped backslashes\nString windowsPath = \"C:\\\\Program Files\\\\Java\\\\jdk-21\\\\bin\";\nSystem.out.println(\"Path: \" + windowsPath);\n\n// 3. Multiline output with tabs\nString menu = \"MENU:\\n\\t1. Start Game\\n\\t2. Settings\\n\\t3. Exit\";\nSystem.out.println(menu);\n\n// 4. Unicode symbols\nchar heart = '\\u2764';\nchar rupee = '\\u20B9';\nSystem.out.println(\"I \" + heart + \" Coding in \" + rupee + \" prices!\");",
          language: "java",
          explanation: "In Java, file paths on Windows must always use escaped backslashes '\\\\' or forward slashes '/' (which Java translates automatically across OSs)."
        },
        {
          type: "tryIt",
          title: "Try It: Predict Output with Escapes",
          code: "System.out.println(\"A\\tB\\nC\\t\\\"D\\\"\");",
          expectedOutput: "A\tB\nC\t\"D\"",
          explanation: "Prints 'A' then a tab then 'B' on line 1. Moves to line 2 with '\\n', prints 'C', a tab, and '\"D\"'."
        },
        {
          type: "dryRun",
          title: "Carriage Return '\\r' Overwrite Trace",
          iterations: [
            { step: 1, variables: { "print": "\"Loading...\"" }, description: "Terminal prints 'Loading...' (cursor at col 10)." },
            { step: 2, variables: { "escape": "'\\r'" }, description: "Carriage return moves cursor back to column 0 on the same line." },
            { step: 3, variables: { "print": "\"Finished! \"" }, description: "Prints 'Finished! ' overwriting 'Loading...'. Used for inline progress bars." }
          ]
        },
        {
          type: "warning",
          title: "Common Escape Sequence Traps",
          items: [
            "Single backslash in file paths: 'C:\\Users\\notes.txt' fails to compile because '\\U' and '\\n' are parsed as invalid/newline escapes.",
            "Unicode escapes '\\uXXXX' are processed by the Java preprocessor BEFORE lexical parsing. Even inside comments, an invalid '\\u' sequence causes compile errors!",
            "Confusing single quote escapes: inside strings '\"' needs '\\\"', inside chars '\\'' needs '\\''."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Escape Sequences",
          traps: [
            {
              question: "Why does this comment cause a compile error: // Look at folder: C:\\users\\new?",
              trap: "Assuming comments are completely ignored by the compiler.",
              solution: "Java processes Unicode escapes '\\u' in source files before stripping comments. In 'C:\\users', the compiler sees '\\u' followed by 'sers' (which is not 4 valid hex digits) and throws a compile-time 'Invalid unicode escape' error!"
            },
            {
              question: "How do you represent a newline portably across Windows and Linux in Java?",
              trap: "Thinking '\\n' works identically everywhere.",
              solution: "While '\\n' works on modern terminals, the standard OS-independent line separator is obtained via 'System.lineSeparator()' or '%n' in printf()."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Which escape sequence represents a tab character?",
          options: [
            "\\b",
            "\\t",
            "\\n",
            "\\r"
          ],
          answer: 1,
          explanation: "'\\t' is the escape sequence for a horizontal tab."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Escape sequences use '\\' to insert non-printable and syntax characters into strings.",
            "Common sequences: \\n (newline), \\t (tab), \\\\ (backslash), \\\" (quote), \\uXXXX (Unicode).",
            "Windows paths require double backslashes '\\\\' or forward slashes '/'."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we transition from output to user input by studying Taking Input with Scanner, learning how to connect to System.in, parse tokens, and read diverse data types."
        }
      ]
    }
  },
  {
    slug: "taking-input-scanner",
    title: "Taking Input with Scanner",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand variables, data types, console printing, and basic object instantiation (`new ClassName()`)."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of `System.in` as an incoming stream of raw keyboard keystrokes (bytes). The `java.util.Scanner` class is like an intelligent translator standing at the end of that stream, breaking down raw characters into recognized tokens (words, integers, doubles) based on whitespace boundaries."
        },
        {
          type: "callout",
          title: "Why Scanner Exists",
          content: "Raw input streams like `System.in.read()` only read single bytes (0-255). The Scanner class provides a high-level API with built-in tokenization, regex parsing, and automatic type conversion for primitive types and strings."
        },
        {
          type: "table",
          title: "Core Scanner Input Methods",
          headers: ["Method", "Returns", "Reads", "Delimiter / Stopping Condition"],
          rows: [
            ["nextInt()", "int", "Next integer value", "Stops at whitespace; leaves newline in buffer"],
            ["nextDouble()", "double", "Next decimal number", "Stops at whitespace; leaves newline in buffer"],
            ["nextLong()", "long", "Next 64-bit integer", "Stops at whitespace; leaves newline in buffer"],
            ["nextBoolean()", "boolean", "true or false", "Stops at whitespace; leaves newline in buffer"],
            ["next()", "String", "Single word token", "Stops at next whitespace (space/tab/newline)"],
            ["nextLine()", "String", "Entire remaining line", "Reads everything up to and INCLUDING newline '\n'"],
            ["hasNextInt()", "boolean", "true if next token is int", "Non-blocking check to prevent crashes"],
            ["close()", "void", "Releases scanner resources", "Closes the underlying input stream"]
          ]
        },
        {
          type: "code",
          title: "Interactive User Input Program with Scanner",
          code: "import java.util.Scanner;\n\npublic class UserRegistration {\n    public static void main(String[] args) {\n        // 1. Create Scanner tied to keyboard input (System.in)\n        Scanner scanner = new Scanner(System.in);\n\n        System.out.print(\"Enter your full name: \");\n        String fullName = scanner.nextLine(); // Reads entire line including spaces\n\n        System.out.print(\"Enter your age: \");\n        int age = scanner.nextInt(); // Reads integer token\n\n        System.out.print(\"Enter your GPA: \");\n        double gpa = scanner.nextDouble(); // Reads floating point token\n\n        System.out.println(\"\\n--- Profile Created ---\");\n        System.out.printf(\"Name: %s%nAge: %d%nGPA: %.2f%n\", fullName, age, gpa);\n\n        // 2. Always close scanner when done\n        scanner.close();\n    }\n}",
          language: "java",
          explanation: "Scanner requires importing 'java.util.Scanner'. Use nextLine() for strings containing spaces, and nextInt()/nextDouble() for numeric data."
        },
        {
          type: "tryIt",
          title: "Try It: next() vs nextLine()",
          code: "// If user enters: \"John Doe\"\n// Scanner sc = new Scanner(\"John Doe\");\n// String word = sc.next();\n// System.out.println(\"next: \" + word);\n// Output: next: John",
          expectedOutput: "next: John",
          explanation: "'next()' only extracts a single token up to the first space ('John'). 'nextLine()' would capture 'John Doe'."
        },
        {
          type: "dryRun",
          title: "Scanner Tokenization Trace",
          iterations: [
            { step: 1, variables: { "input buffer": "\"100 200\\n\"" }, description: "User enters '100 200' and hits Enter." },
            { step: 2, variables: { "sc.nextInt()": "100", "buffer left": "\" 200\\n\"" }, description: "First nextInt() parses 100 and stops at the space." },
            { step: 3, variables: { "sc.nextInt()": "200", "buffer left": "\"\\n\"" }, description: "Second nextInt() skips leading whitespace, parses 200, and stops at '\\n'." }
          ]
        },
        {
          type: "warning",
          title: "Critical Rule: Closing Scanner on System.in",
          items: [
            "Calling 'scanner.close()' closes the underlying stream 'System.in'. Once closed, System.in CANNOT be reopened for the lifetime of your JVM process!",
            "If your application has multiple methods reading input, do NOT create and close a new Scanner(System.in) in each method. Pass one shared Scanner instance or close it only when the entire program exits."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Scanner",
          traps: [
            {
              question: "What happens if you create two Scanners on System.in and close the first one?",
              trap: "Thinking the second Scanner continues working normally.",
              solution: "Closing the first Scanner calls 'System.in.close()'. Any subsequent read attempt on the second Scanner will immediately throw an 'IllegalStateException' or 'NoSuchElementException'!"
            },
            {
              question: "Is Scanner thread-safe in Java?",
              trap: "Assuming standard utility classes are thread-safe.",
              solution: "No, Scanner is NOT thread-safe. If multiple threads access a Scanner instance concurrently, external synchronization is required."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Which method should you use to read a user's multi-word home address containing spaces?",
          options: [
            "sc.next()",
            "sc.nextLine()",
            "sc.readString()",
            "sc.readWords()"
          ],
          answer: 1,
          explanation: "'sc.nextLine()' reads the entire line of text until the user presses Enter, capturing all words and spaces."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Scanner tokenizes input by whitespace for primitives (nextInt, nextDouble, next).",
            "nextLine() reads the entire line including spaces up to the newline character.",
            "Closing a Scanner on System.in closes standard input globally for the JVM process."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we tackle the most common bug in beginner Java: Input Buffer Traps & Parsing Errors, learning why nextLine() skips input after nextInt() and how to write crash-proof validation."
        }
      ]
    }
  },
  {
    slug: "input-parsing-errors",
    title: "Input Parsing & Common Errors",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand how Scanner reads input, token delimiters, and primitive parsing methods."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "When you type a number and press Enter on the keyboard, you are actually sending TWO pieces of data into the input stream: the digits of the number (e.g. `2` and `5`) followed by the newline character `\n`. Methods like `nextInt()` consume only the digits, leaving the `\n` sitting orphaned in the buffer. The next `nextLine()` call sees that leftover `\n` and assumes you entered an empty line!"
        },
        {
          type: "callout",
          title: "The Infamous nextInt() &rarr; nextLine() Trap",
          content: "This is the single most frequent bug encountered in Java console applications. Understanding the input buffer lifecycle prevents mysterious 'skipped input' bugs."
        },
        {
          type: "code",
          title: "The Problem vs The Correct Solutions",
          code: "import java.util.Scanner;\n\nScanner sc = new Scanner(System.in);\n\n// --- THE BUGGY CODE ---\nSystem.out.print(\"Enter Age: \");\nint age = sc.nextInt(); // User types '25' + ENTER. nextInt() reads 25, leaves '\\n' in buffer\n\nSystem.out.print(\"Enter City: \");\nString city = sc.nextLine(); // BUG: Reads the leftover '\\n' immediately, city becomes \"\"!\n\n// --- SOLUTION 1: Consume the leftover newline ---\nSystem.out.print(\"Enter Age: \");\nint age1 = sc.nextInt();\nsc.nextLine(); // Consumes the leftover '\\n' from the buffer!\nSystem.out.print(\"Enter City: \");\nString city1 = sc.nextLine(); // Now correctly waits for user input!\n\n// --- SOLUTION 2 (Industry Best Practice): Read everything as nextLine() and parse ---\nSystem.out.print(\"Enter Age: \");\nint age2 = Integer.parseInt(sc.nextLine().trim());\nSystem.out.print(\"Enter City: \");\nString city2 = sc.nextLine(); // Completely immune to buffer bugs!",
          language: "java",
          explanation: "Solution 2 is the most robust: always read full lines with nextLine() and parse numbers manually using Integer.parseInt() or Double.parseDouble()."
        },
        {
          type: "table",
          title: "Common Scanner Input Exceptions and Solutions",
          headers: ["Exception", "Root Cause", "Example Trigger", "Prevention / Fix"],
          rows: [
            ["InputMismatchException", "Input doesn't match expected type", "Entering \"twenty\" for nextInt()", "Use sc.hasNextInt() check first"],
            ["NoSuchElementException", "Input stream ended unexpectedly", "Reading past EOF or empty input", "Use sc.hasNext() check before reading"],
            ["NumberFormatException", "Integer.parseInt() fails on text", "Integer.parseInt(\"abc\")", "Wrap in try-catch block"],
            ["IllegalStateException", "Scanner was closed before reading", "Calling nextInt() after sc.close()", "Keep scanner open until exit"]
          ]
        },
        {
          type: "code",
          title: "Crash-Proof Defensive Input Validation",
          code: "import java.util.Scanner;\n\npublic class SafeInput {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int validAge = -1;\n\n        // Loop until user enters a valid positive integer\n        while (true) {\n            System.out.print(\"Enter your age (1-120): \");\n            if (sc.hasNextInt()) {\n                validAge = sc.nextInt();\n                if (validAge >= 1 && validAge <= 120) {\n                    break; // Valid input received!\n                } else {\n                    System.out.println(\"Age out of range! Try again.\");\n                }\n            } else {\n                System.out.println(\"Invalid number! That wasn't an integer.\");\n                sc.next(); // Discard the invalid token from buffer\n            }\n        }\n\n        System.out.println(\"Recorded Age: \" + validAge);\n        sc.close();\n    }\n}",
          language: "java",
          explanation: "Always check hasNextInt() before calling nextInt(). If invalid, consume and discard the bad token with sc.next() to prevent an infinite loop."
        },
        {
          type: "tryIt",
          title: "Try It: Trace Buffer Bug",
          code: "// Buffer state after typing 42 and Enter:\n// [ '4', '2', '\\n' ]\n// After nextInt(): [ '\\n' ]\n// After sc.nextLine(): [ ] (Buffer clean)",
          expectedOutput: "Buffer clean",
          explanation: "Consuming the newline with an extra sc.nextLine() resets the buffer to empty."
        },
        {
          type: "dryRun",
          title: "Input Buffer State Trace",
          iterations: [
            { step: 1, variables: { "keyboard input": "\"25\\nDallas\\n\"" }, description: "User enters age 25 (Enter) and city Dallas (Enter)." },
            { step: 2, variables: { "sc.nextInt()": "25", "buffer": "\"\\nDallas\\n\"" }, description: "nextInt() consumes '25'. Buffer still starts with '\\n'." },
            { step: 3, variables: { "sc.nextLine() [dummy]": "\"\"", "buffer": "\"Dallas\\n\"" }, description: "Dummy nextLine() eats the leftover '\\n'." },
            { step: 4, variables: { "sc.nextLine() [city]": "\"Dallas\"", "buffer": "\"\"" }, description: "Real nextLine() captures 'Dallas' accurately." }
          ]
        },
        {
          type: "warning",
          title: "Common Input Parsing Traps",
          items: [
            "Forgetting to discard invalid input in validation loops: If 'sc.hasNextInt()' is false, you MUST call 'sc.next()' to discard the bad token, otherwise your loop spins forever!",
            "Assuming nextDouble() accepts commas or dots universally: Scanner uses system locale (some European locales expect '3,14' instead of '3.14'). Use 'sc.useLocale(Locale.US)' to enforce standard decimal dots."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Input Handling",
          traps: [
            {
              question: "Why does an input validation loop with 'if (!sc.hasNextInt()) continue;' create an infinite loop?",
              trap: "Thinking continue resets the scanner.",
              solution: "'hasNextInt()' only inspects the token without consuming it. If the token is invalid (e.g. \"abc\"), it stays in the buffer forever unless explicitly discarded using 'sc.next()'."
            },
            {
              question: "How does BufferedReader compare to Scanner for competitive programming input?",
              trap: "Saying they are identical.",
              solution: "BufferedReader is significantly faster than Scanner because it uses a large internal 8KB buffer and performs no regex parsing. In competitive programming, 'BufferedReader + StringTokenizer' is preferred for processing hundreds of thousands of inputs within time limits."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "How do you prevent nextLine() from returning an empty string after nextInt()?",
          options: [
            "Call sc.reset()",
            "Call an extra sc.nextLine() to consume the leftover newline",
            "Call sc.flush()",
            "Use sc.skip()"
          ],
          answer: 1,
          explanation: "Calling an extra 'sc.nextLine()' consumes the dangling newline character left in the buffer by nextInt()."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Token methods (nextInt, nextDouble) leave the trailing newline character in the buffer.",
            "Always consume the leftover newline with an extra sc.nextLine() or use Integer.parseInt(sc.nextLine()).",
            "Use hasNextInt() / hasNextDouble() for crash-proof input validation.",
            "Discard bad tokens in validation loops using sc.next() to avoid infinite loops."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Module",
          content: "Congratulations! You have completed Module 4: Input & Output. You now possess deep knowledge of standard streams, formatting with printf, escape sequences, and robust Scanner buffer management. In Module 5: Control Flow, you will learn how programs make complex decisions using if-else, switch expressions, while loops, for loops, and jump statements."
        }
      ]
    }
  }
];
