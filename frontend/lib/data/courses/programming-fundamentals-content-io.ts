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
      definition: "Printing output is the process of displaying information to the user via the console. In Java, we use System.out methods to print text, variables, and formatted data.",
      whyItMatters: "Output is essential for communicating results to users, debugging programs, and creating interactive console applications.",
      coreConcept: "Java provides System.out for output operations. The print() and println() methods display text, while printf() offers formatted output.",
      syntax: "System.out.print(data);\nSystem.out.println(data);",
      javaExample: "System.out.print(\"Hello \");\nSystem.out.println(\"World\");\nint age = 25;\nSystem.out.println(\"Age: \" + age);\nSystem.out.printf(\"Age: %d%n\", age);",
      howItWorks: "System.out is a PrintStream object. Methods convert data to strings and write to standard output (console). Print stays on same line, println adds newline.",
      realWorldUse: "Displaying results, user prompts, debugging information, error messages, and program status in console applications.",
      commonMistakes: [
        "Forgetting that print() doesn't add a newline",
        "Not closing Scanner when reading input (resource leak)",
        "Concatenating strings with + instead of using printf"
      ],
      interviewQuestions: [
        { question: "What is the difference between print() and println()?", answer: "print() displays output without moving to a new line, while println() adds a newline after displaying output." },
        { question: "How do you print multiple variables on one line?", answer: "Use concatenation: System.out.println(\"a=\" + a + \", b=\" + b); or use printf(): System.out.printf(\"a=%d, b=%d%n\", a, b);" }
      ],
      quickRevision: "print() - no newline, println() - adds newline, printf() - formatted output.",
      practicePrompt: "Print your name, age, and favorite color on one line using concatenation.",
      quickCheck: {
        question: "Which method adds a newline after printing?",
        options: ["print()", "println()", "printf()", "display()"],
        answer: 1,
        explanation: "println() (print line) adds a newline character after printing the output, moving the cursor to the next line."
      }
    }
  },
  {
    slug: "print-vs-println",
    title: "print() vs println()",
    content: {
      definition: "print() displays output without a newline, keeping the cursor on the same line. println() displays output and moves the cursor to the beginning of the next line.",
      whyItMatters: "Choosing the right method affects how your output appears—whether items print on the same line or separate lines.",
      coreConcept: "print() is useful for building output incrementally or prompting for input. println() is used when you want each output on its own line.",
      syntax: "System.out.print(text);    // no newline\nSystem.out.println(text); // adds newline",
      javaExample: "System.out.print(\"Hello \");\nSystem.out.print(\"World\");\n// Output: Hello World (on one line)\n\nSystem.out.println(\"Hello\");\nSystem.out.println(\"World\");\n// Output:\n// Hello\n// World",
      howItWorks: "print() writes to output stream without newline character. println() appends system-dependent line separator (\\n on Unix, \\r\\n on Windows).",
      realWorldUse: "print() for prompts (\"Enter name: \"), progress indicators, building formatted output. println() for complete messages, results, errors.",
      commonMistakes: [
        "Using println() when you want output on the same line",
        "Using print() and wondering why everything appears on one line",
        "Not understanding that println() with no argument just prints a blank line"
      ],
      interviewQuestions: [
        { question: "What does System.out.println() with no arguments do?", answer: "It prints an empty line (just a newline character), effectively creating a blank line in the output." },
        { question: "How do you print \"Hello\" and \"World\" on the same line?", answer: "Use print() for the first item: System.out.print(\"Hello \"); System.out.println(\"World\"); or just System.out.println(\"Hello World\");" }
      ],
      quickRevision: "print() = no newline, println() = with newline. Use println() for line-by-line output.",
      practicePrompt: "Print numbers 1 to 5 on one line separated by spaces using print(), then print \"Done!\" on a new line using println().",
      quickCheck: {
        question: "What is the output of:\nSystem.out.print(\"A\");\nSystem.out.print(\"B\");\nSystem.out.println(\"C\");",
        options: ["A\\nB\\nC", "ABC", "A B C", "A\\nBC"],
        answer: 1,
        explanation: "print() doesn't add newlines, so all three letters print on one line: ABC. The final println() just adds a newline after C."
      }
    }
  },
  {
    slug: "escape-sequences",
    title: "Escape Sequences",
    content: {
      definition: "Escape sequences are special character combinations starting with backslash (\\) that represent characters that cannot be typed directly, like newline, tab, or quotes.",
      whyItMatters: "Escape sequences allow you to include special characters in strings, format output, and handle characters that have special meaning in Java syntax.",
      coreConcept: "Common escape sequences: \\n (newline), \\t (tab), \\\\ (backslash), \\\" (double quote), \\' (single quote), \\r (carriage return).",
      syntax: "\\n \\t \\\\ \\\" \\' \\r",
      javaExample: "System.out.println(\"Line1\\nLine2\");    // Two lines\nSystem.out.println(\"Col1\\tCol2\");      // Tab between\nSystem.out.println(\"Path: C:\\\\Users\");  // Backslash\nSystem.out.println(\"He said \\\"Hi\\\"\");   // Quotes in string",
      howItWorks: "The backslash tells Java to interpret the next character specially. \\n becomes newline, \\t becomes tab, \\\" becomes a quote character within the string.",
      realWorldUse: "Formatting output, file paths on Windows, including quotes in strings, creating multi-line strings, tabular output.",
      commonMistakes: [
        "Forgetting to escape backslashes in Windows paths",
        "Using \\n vs println() inconsistently",
        "Not escaping quotes inside strings",
        "Confusing \\n (newline) and \\r (carriage return)"
      ],
      interviewQuestions: [
        { question: "How do you print a double quote character inside a string?", answer: "Escape it with backslash: System.out.println(\"He said \\\"Hello\\\"\");" },
        { question: "How do you print a backslash character?", answer: "Use double backslash: System.out.println(\"Path: C:\\\\Users\\\\Documents\");" }
      ],
      quickRevision: "\\n newline, \\t tab, \\\\ backslash, \\\" quote, \\' single quote. Use them inside string literals.",
      practicePrompt: "Print a formatted table with headers using tabs, and a message with quotes.",
      quickCheck: {
        question: "What does \\t represent in Java?",
        options: ["The letter t", "A tab character", "A newline", "An error"],
        answer: 1,
        explanation: "\\t is the escape sequence for a tab character, which adds horizontal spacing (usually 4-8 spaces depending on terminal)."
      }
    }
  },
  {
    slug: "taking-input-scanner",
    title: "Taking Input with Scanner",
    content: {
      definition: "Scanner is a class in java.util package used to read input from various sources including keyboard (System.in), files, and strings.",
      whyItMatters: "Interactive programs need to accept user input. Scanner provides easy methods to read different data types from the keyboard.",
      coreConcept: "Create Scanner object connected to System.in. Use methods like nextInt(), nextDouble(), nextLine() to read different types. Always close the Scanner when done.",
      syntax: "import java.util.Scanner;\nScanner sc = new Scanner(System.in);\nint num = sc.nextInt();\nsc.close();",
      javaExample: "import java.util.Scanner;\n\nScanner sc = new Scanner(System.in);\n\nSystem.out.print(\"Enter name: \");\nString name = sc.nextLine();\n\nSystem.out.print(\"Enter age: \");\nint age = sc.nextInt();\n\nSystem.out.println(\"Hello \" + name + \", age \" + age);\n\nsc.close();",
      howItWorks: "Scanner reads from input stream. nextInt() reads integer, nextDouble() reads decimal, nextLine() reads entire line. Methods block until input is provided.",
      realWorldUse: "Interactive console applications, reading configuration, data entry programs, menu-driven applications, testing and debugging.",
      commonMistakes: [
        "Forgetting to import java.util.Scanner",
        "Not closing Scanner (resource leak)",
        "Mixing nextInt() and nextLine() causing empty string issues",
        "Not handling invalid input (InputMismatchException)"
      ],
      interviewQuestions: [
        { question: "What is the difference between next() and nextLine()?", answer: "next() reads until whitespace (one word), nextLine() reads the entire line including spaces until Enter is pressed." },
        { question: "Why should you close a Scanner?", answer: "To release system resources. If Scanner reads from a file or System.in, closing prevents resource leaks." }
      ],
      quickRevision: "Scanner reads input. nextInt(), nextDouble(), next(), nextLine(). Import and close it.",
      practicePrompt: "Write a program that asks for the user's name and age, then prints a greeting.",
      quickCheck: {
        question: "Which Scanner method reads an integer?",
        options: ["nextInt()", "readInt()", "getInt()", "scanInt()"],
        answer: 0,
        explanation: "nextInt() is the Scanner method that reads the next integer from input."
      }
    }
  },
  {
    slug: "input-parsing-errors",
    title: "Input Parsing & Common Errors",
    content: {
      definition: "Input parsing is the process of converting input text to appropriate data types. Common errors occur when input doesn't match the expected format or type.",
      whyItMatters: "Robust programs must handle invalid input gracefully. Understanding common errors helps you write user-friendly applications that don't crash.",
      coreConcept: "Scanner methods throw InputMismatchException when input doesn't match expected type. The nextInt()/nextLine() issue occurs because nextInt() leaves the newline in the buffer.",
      syntax: "// Handling nextInt/nextLine issue\nsc.nextInt();\nsc.nextLine(); // consume leftover newline",
      javaExample: "// Common problem:\nSystem.out.print(\"Enter age: \");\nint age = sc.nextInt();\n\nSystem.out.print(\"Enter name: \");\nString name = sc.nextLine(); // Problem: reads empty!\n\n// Solution:\nint age = sc.nextInt();\nsc.nextLine(); // consume newline\nString name = sc.nextLine(); // now works",
      howItWorks: "nextInt() reads the number but leaves the Enter key (newline) in buffer. The next nextLine() reads that leftover newline, returning empty string. Call nextLine() after nextInt() to consume the newline.",
      realWorldUse: "Reading mixed numeric and text input, validating user input, building robust console applications.",
      commonMistakes: [
        "Not consuming newline after nextInt()/nextDouble()",
        "Not handling InputMismatchException",
        "Assuming input is always valid",
        "Not providing clear prompts for expected input format"
      ],
      interviewQuestions: [
        { question: "Why does nextLine() return empty string after nextInt()?", answer: "nextInt() reads the integer but leaves the newline character (from pressing Enter) in the input buffer. The next nextLine() reads that leftover newline, resulting in an empty string." },
        { question: "How do you fix the nextInt()/nextLine() issue?", answer: "Call nextLine() immediately after nextInt() to consume the leftover newline, then call nextLine() again for the actual string input." }
      ],
      quickRevision: "nextInt() leaves newline in buffer. Add extra nextLine() to consume it. Validate input.",
      practicePrompt: "Write a program that reads an integer and then a sentence, handling the newline issue correctly.",
      quickCheck: {
        question: "What exception is thrown if you call nextInt() but enter text?",
        options: ["NumberFormatException", "InputMismatchException", "IOException", "NullPointerException"],
        answer: 1,
        explanation: "InputMismatchException is thrown when Scanner cannot convert the input to the expected type (like entering \"hello\" when nextInt() expects an integer)."
      }
    }
  }
];
