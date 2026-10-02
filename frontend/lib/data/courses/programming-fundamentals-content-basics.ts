import { CourseLessonContent } from './types';

export const programmingBasicsLessons: Array<{
  slug: string;
  title: string;
  content: CourseLessonContent
}> = [
  {
    slug: "what-is-programming",
    title: "What is Programming?",
    content: {
      sections: [
        {
          type: "text",
          title: "The Core Dilemma",
          content: "Programming is the process of designing and writing a sequence of instructions that enables a computer to solve a problem or perform a task.\n\nA computer does not independently understand a human's intention. For example, a human can say: \"Calculate the average marks of five students.\"\n\nA computer needs precise instructions describing:\n- where the marks come from\n- how to store them\n- how to add them up\n- how to divide them\n- where to display the final result",
        },
        {
          type: "text",
          title: "The Nature of Computers",
          content: "Computers are fundamentally completely obedient but devoid of intuition. They follow instructions flawlessly at blinding speeds, but they cannot fill in blanks or make assumptions. \n\nBecause of this, programming isn't just typing code—it is an exercise in extreme clarity. You must break down a large, intuitive human desire into microscopic, unambiguous steps."
        },
        {
          type: "text",
          title: "Algorithm vs. Program",
          content: "Before code is ever written, a programmer develops an **Algorithm**. An algorithm is a step-by-step procedure for solving a problem, independent of any specific programming language.\n\nOnce the algorithm is clear, it is translated into a **Program** using a specific programming language (like Java, Python, or C++)."
        },
        {
          type: "table",
          title: "Algorithm vs Program Comparison",
          headers: ["Aspect", "Algorithm", "Program"],
          rows: [
            ["Format", "Human-readable steps (often pseudocode)", "Strict syntax of a programming language"],
            ["Execution", "Executed mentally or on paper", "Executed by a computer"],
            ["Language", "Language-agnostic", "Language-specific (Java, Python, etc.)"]
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps & Edge Cases",
          traps: [
            {
              question: "What is the difference between an algorithm and a program?",
              trap: "Saying 'an algorithm is a mathematical formula'.",
              solution: "An algorithm is a conceptual, step-by-step procedure to solve a problem, independent of any programming language. A program is the concrete implementation of that algorithm in a specific programming language."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Knowledge Check",
          question: "Why do computers require programming rather than just understanding natural human language?",
          options: [
            "Because computers are too slow to process English.",
            "Because natural languages are filled with ambiguity and require intuition.",
            "Because programming languages were invented before English.",
            "Because computers only speak binary natively."
          ],
          answer: 1,
          explanation: "Natural language is highly contextual and ambiguous, requiring intuition to fill in gaps. Computers lack intuition and require deterministic, unambiguous instructions."
        }
      ]
    }
  },
  {
    slug: "programming-languages",
    title: "Programming Languages",
    content: {
      sections: [
        {
          type: "text",
          title: "Why Do Programming Languages Exist?",
          content: "At the hardware level, computers only understand machine code—a continuous stream of binary 1s and 0s representing electrical signals (on/off). \n\nIf humans had to write programs in binary, software development would be agonizingly slow, prone to errors, and practically impossible to read or maintain. Programming languages act as a bridge. They provide a structured, human-readable vocabulary that can express complex logic, which is then translated down into the 1s and 0s the computer needs."
        },
        {
          type: "text",
          title: "Levels of Abstraction",
          content: "A programming language abstracts away the underlying hardware details. Instead of writing instructions to move a bit from memory register A to register B, a programmer can simply write `x = 5`. The language's translator handles the tedious hardware mapping."
        },
        {
          type: "text",
          title: "Paradigm Shift",
          content: "Programming languages also enforce paradigms—ways of thinking about problems. \n- **Procedural languages** (like C) focus on a sequence of steps.\n- **Object-Oriented languages** (like Java) model the world as interacting objects.\n- **Functional languages** (like Haskell) treat computation as the evaluation of mathematical functions."
        },
        {
          type: "interviewTraps",
          title: "Interview Traps",
          traps: [
            {
              question: "Why can't a CPU execute Java or Python code directly?",
              trap: "Assuming the CPU 'doesn't have Java installed'.",
              solution: "A CPU's physical circuitry is designed to execute specific binary machine code instructions (its Instruction Set Architecture). High-level languages use abstractions that do not correspond one-to-one with hardware gates, requiring a translation step."
            }
          ]
        }
      ]
    }
  },
  {
    slug: "high-level-vs-low-level-languages",
    title: "High-Level vs Low-Level Languages",
    content: {
      sections: [
        {
          type: "text",
          title: "The Language Spectrum",
          content: "Programming languages exist on a spectrum based on how closely they resemble human language versus machine language. This distance is called **abstraction**."
        },
        {
          type: "text",
          title: "Low-Level Languages",
          content: "Low-level languages are exceptionally close to the hardware. They provide minimal abstraction.\n\n**Machine Code:** The absolute lowest level. Pure binary (1s and 0s). Directly executed by the CPU.\n**Assembly Language:** Uses short mnemonic codes (like `MOV`, `ADD`) to represent binary instructions. It is still mapped directly to the CPU's architecture.\n\n*Pros:* Blistering fast execution, precise control over memory and hardware.\n*Cons:* Extremely difficult to write, read, and maintain. Hardware-dependent (code written for an Intel CPU won't run on an ARM CPU)."
        },
        {
          type: "text",
          title: "High-Level Languages",
          content: "High-level languages are designed for human comprehension. They abstract away memory management, CPU registers, and hardware specifics.\n\nExamples: Java, Python, JavaScript, C#, C++.\n\n*Pros:* Easy to read and write. Portable (code written once can run on many different types of hardware with the right translator).\n*Cons:* Slower execution due to the translation overhead. Less direct control over system resources."
        },
        {
          type: "table",
          title: "High vs Low Level Comparison",
          headers: ["Feature", "Low-Level", "High-Level"],
          rows: [
            ["Hardware Abstraction", "None or Minimal", "High"],
            ["Readability", "Poor (Machine focused)", "Excellent (Human focused)"],
            ["Portability", "Tied to specific CPU architecture", "Cross-platform (Portable)"],
            ["Execution Speed", "Extremely fast", "Slower (Requires translation)"],
            ["Memory Management", "Manual", "Often automated (e.g., Garbage Collection)"]
          ]
        },
        {
          type: "quickCheck",
          title: "Check Your Understanding",
          question: "Which of the following is the primary advantage of high-level languages over low-level languages?",
          options: [
            "High-level languages execute faster on the CPU.",
            "High-level languages take up less memory.",
            "High-level languages are portable across different hardware and easier to write.",
            "High-level languages do not need to be translated into machine code."
          ],
          answer: 2,
          explanation: "High-level languages abstract away the hardware, making the code portable and significantly easier for humans to develop and maintain."
        }
      ]
    }
  },
  {
    slug: "compiler-vs-interpreter",
    title: "Compiler vs Interpreter",
    content: {
      sections: [
        {
          type: "text",
          title: "The Translation Problem",
          content: "Because high-level code cannot be executed directly by the CPU, it must be translated into machine code. There are two primary ways to do this: Compilation and Interpretation."
        },
        {
          type: "text",
          title: "What is a Compiler?",
          content: "A compiler is a program that reads the **entire** source code file and translates it into a separate, executable machine code file (like a `.exe` on Windows) *before* the program ever runs.\n\nBecause the translation happens entirely upfront, the resulting executable program runs very fast. However, if you change a single line of code, you must recompile the entire program before testing it. C and C++ are classic compiled languages."
        },
        {
          type: "text",
          title: "What is an Interpreter?",
          content: "An interpreter does not create a separate executable file. Instead, it reads the source code **line by line**, translating and executing each instruction in real-time as the program runs.\n\nBecause it translates on the fly, execution is generally slower. However, development is faster because you can test code changes immediately without waiting for a compilation step. Python and JavaScript are classic interpreted languages."
        },
        {
          type: "text",
          title: "The Hybrid Approach (Java)",
          content: "Java does something unique. It uses **both**.\n\n1. First, the Java **Compiler** (`javac`) translates the human-readable `.java` source code into an intermediate format called **Bytecode** (`.class` files).\n2. Then, at runtime, the Java Virtual Machine (**JVM**) acts as an **Interpreter** (and Just-In-Time compiler), executing the bytecode on the specific host machine.\n\nThis hybrid approach gives Java its famous 'Write Once, Run Anywhere' portability."
        },
        {
          type: "table",
          title: "Compiler vs Interpreter",
          headers: ["Aspect", "Compiler", "Interpreter"],
          rows: [
            ["Translation Time", "Entire code translated upfront", "Translated line-by-line during runtime"],
            ["Execution Speed", "Faster (already translated)", "Slower (translation overhead at runtime)"],
            ["Error Detection", "Reports all syntax errors before running", "Stops running when it hits the first error"],
            ["Output", "Generates an executable machine code file", "No intermediate object code is generated"]
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps",
          traps: [
            {
              question: "Is Java a compiled or an interpreted language?",
              trap: "Saying it is just a compiled language.",
              solution: "Java is both compiled and interpreted. Source code is compiled into platform-independent bytecode by the Java compiler. The JVM then interprets (and JIT compiles) this bytecode at runtime to execute it."
            }
          ]
        }
      ]
    }
  },
  {
    slug: "source-code-compilation-execution",
    title: "Source Code, Compilation & Execution",
    content: {
      sections: [
        {
          type: "text",
          title: "The Journey of a Program",
          content: "Let's trace the exact lifecycle of a program from the developer's fingertips to the CPU executing the instructions."
        },
        {
          type: "text",
          title: "Phase 1: Source Code",
          content: "The programmer writes text files containing instructions written in a high-level language. This is the **Source Code**.\nIn Java, these files are saved with a `.java` extension. To the computer, this is just plain text; it does not know how to run it."
        },
        {
          type: "text",
          title: "Phase 2: Compilation",
          content: "The programmer passes the source code to a tool called a **Compiler**. The compiler analyzes the text to ensure it follows the rules of the language. If there is a typo (like a missing semicolon), the compiler halts and throws a compile-time error.\n\nIf the code is perfectly formatted, the compiler translates it. In Java, it translates the `.java` file into a `.class` file containing **Bytecode**."
        },
        {
          type: "text",
          title: "Phase 3: Execution",
          content: "To run the program, the system invokes an execution environment (in Java, the JVM). The JVM loads the compiled bytecode into memory, checks it for security, and begins interpreting the instructions, translating them into the final machine code that the CPU executes to perform the program's work."
        },
        {
          type: "code",
          title: "The Flow in Commands",
          code: "// 1. You write MyProgram.java\n\n// 2. You compile the program\n$ javac MyProgram.java\n// (This creates MyProgram.class)\n\n// 3. You execute the program\n$ java MyProgram\n// (The JVM runs the bytecode)",
          explanation: "This two-step command-line process is what IDEs (like IntelliJ or Eclipse) do automatically behind the scenes when you click 'Run'."
        },
        {
          type: "quickCheck",
          title: "Pipeline Check",
          question: "What is the output of the Java compiler (javac)?",
          options: [
            "An executable binary file (.exe)",
            "A plain text file containing source code",
            "A file containing platform-independent bytecode (.class)",
            "Machine code tailored to the specific CPU"
          ],
          answer: 2,
          explanation: "The Java compiler (javac) translates .java source files into .class files, which contain bytecode. This bytecode is not native machine code; it requires the JVM to execute."
        }
      ]
    }
  },
  {
    slug: "syntax-vs-semantics",
    title: "Syntax vs Semantics",
    content: {
      sections: [
        {
          type: "text",
          title: "The Two Layers of Code",
          content: "Programming languages have strict rules governing how code must look and what the code actually means. These are divided into **Syntax** and **Semantics**."
        },
        {
          type: "text",
          title: "Syntax: The Grammar",
          content: "Syntax refers to the structural rules of the language—the spelling, the punctuation, the formatting.\n\nJust as English requires sentences to end with a period, Java requires statements to end with a semicolon. If you violate syntax, the compiler will refuse to compile the program. This is known as a **Syntax Error** or Compile-time Error."
        },
        {
          type: "text",
          title: "Semantics: The Meaning",
          content: "Semantics refers to the logic and behavior of the code. Code can have perfect syntax (it compiles successfully) but terrible semantics (it does the wrong thing).\n\nIf you write a program to calculate a bank withdrawal, and you accidentally add the money instead of subtracting it, the syntax is perfectly fine. The compiler sees valid math. But the semantics are entirely wrong. This results in a **Logical Error** or Runtime Error."
        },
        {
          type: "code",
          title: "Syntax Error Example",
          code: "// Syntax Error: Missing semicolon\nint total = 5 + 10\n\n// Syntax Error: Missing closing quote\nSystem.out.println(\"Hello World);\n\n// The compiler will catch these and refuse to run.",
          explanation: "Syntax errors prevent a program from compiling or starting."
        },
        {
          type: "code",
          title: "Semantic Error Example",
          code: "int numberOfStudents = 5;\nint totalScore = 400;\n\n// Semantic Error: Calculating average incorrectly\n// We meant to divide, but accidentally multiplied\nint average = totalScore * numberOfStudents;\n\nSystem.out.println(\"The average is: \" + average);",
          explanation: "This code compiles perfectly. There are no syntax errors. But the logic is fundamentally flawed. Instead of an average of 80, the program will output 2000."
        },
        {
          type: "table",
          title: "Errors Comparison",
          headers: ["Type", "What is wrong?", "When is it caught?", "Example"],
          rows: [
            ["Syntax Error", "Grammar / Formatting", "Compile time", "Missing semicolon, unclosed bracket"],
            ["Semantic (Logic) Error", "Meaning / Logic", "Run time (during testing)", "Using '+' instead of '-', incorrect math formula"]
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps",
          traps: [
            {
              question: "If a program compiles without any errors, does that mean the program is correct?",
              trap: "Saying yes, because compilation means the code works.",
              solution: "No. A successful compilation only proves that the code is syntactically valid. It does not prove that the code is semantically correct. The program could still contain logical errors, crash during runtime, or produce entirely incorrect results."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Check Your Understanding",
          question: "You write a program to calculate area as `width + height`. The compiler accepts this code without issue. What type of error is this?",
          options: [
            "A Syntax Error",
            "A Semantic (Logical) Error",
            "A Compiler Error",
            "A Machine Code Error"
          ],
          answer: 1,
          explanation: "The grammar is correct, so the compiler accepts it (no syntax error). But the meaning is wrong (area is width * height, not width + height), making it a semantic error."
        }
      ]
    }
  }
];
