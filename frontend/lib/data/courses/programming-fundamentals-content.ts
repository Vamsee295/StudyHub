// Programming Fundamentals Content - Complete 75 lessons with structured content

import { CourseLessonContent } from './types';

/**
 * MODULE 1 — PROGRAMMING BASICS (6 lessons)
 */

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
          title: "Prerequisites",
          content: "Before learning about programming, you should have basic computer literacy - knowing how to use a computer, navigate files, and understand what software does. No prior coding experience is needed."
        },
        {
          type: "text",
          title: "Start With a Real Problem",
          content: "Let's begin with a concrete problem: \"I want to calculate the average score of a student across five subjects.\" If you tell this to a friend, they understand immediately. But if you tell this exact sentence to a computer, it will not understand what you mean. Why? Because human language relies on shared context, assumptions, and implicit knowledge that computers don't possess.",
          explanation: "Your friend knows what 'average' means, understands scores and subjects, and can figure out the steps. A computer needs every single step spelled out explicitly, with no room for interpretation."
        },
        {
          type: "text",
          title: "What Programming Actually Is",
          content: "Programming is the entire process of taking a human problem or goal and turning it into a sequence of precise instructions that a computer can follow to produce a desired result. It's not just writing code—it's problem-solving from start to finish.",
          explanation: "Think of programming as translation: you're translating human intentions into computer-understandable instructions. This involves understanding the problem, designing a solution, expressing that solution in a formal language, and ensuring it works correctly."
        },
        {
          type: "text",
          title: "The Mental Model",
          content: "Here's how programming works in practice:\n\nHuman Goal → Problem Understanding → Solution Design → Algorithm → Source Code → Translation/Execution → Output → Verification",
          explanation: "Each arrow represents a critical transition where decisions are made. Skipping or rushing any step leads to broken programs. Programming is about managing this entire chain, not just the coding part."
        },
        {
          type: "text",
          title: "Why Computers Need Precise Instructions",
          content: "Computers are fundamentally simple machines that can only perform very basic operations extremely quickly and repeatedly. They have no intuition, no common sense, and no ability to 'figure out' what you meant if your instructions are ambiguous or incomplete.",
          explanation: "Consider the instruction 'Get me a cup of coffee.' To a human, this implies: go to the kitchen, find a cup, fill it with coffee, and bring it back. But a computer would need: locate kitchen, identify cup object, grasp cup with appropriate force, navigate to coffee machine, initiate brewing process, wait for completion, retrieve filled cup, navigate back to recipient, release cup into hands. Missing any detail causes failure.",
        },
        {
          type: "text",
          title: "From Problem to Algorithm",
          content: "Let's return to our average score problem. An algorithm is a step-by-step procedure for solving a problem, independent of any programming language. For our problem:\n\n1. Get scores for all five subjects\n2. Add the scores together to get a total\n3. Count how many subjects we have (should be 5)\n4. Divide the total by the number of subjects\n5. Display or store the result",
          explanation: "Notice this algorithm doesn't mention Java, Python, or any specific language. It's a language-independent recipe for solving the problem. The same algorithm could be followed by a person with pen and paper, or implemented in any programming language."
        },
        {
          type: "text",
          title: "Algorithm vs Program",
          content: "This distinction is crucial:\n\n• Algorithm: The abstract solution procedure (what needs to be done)\n• Program: The concrete implementation of that algorithm in a specific programming language (how it's done)",
          explanation: "The same algorithm for calculating an average can be implemented as:\n- Java: double average = (s1 + s2 + s3 + s4 + s5) / 5;\n- Python: average = (s1 + s2 + s3 + s4 + s5) / 5\n- JavaScript: let average = (s1 + s2 + s3 + s4 + s5) / 5;\nAll three programs express the same algorithm using different syntax.",
        },
        {
          type: "text",
          title: "Why Programming Languages Exist",
          content: "Humans cannot conveniently write instructions in the binary code (0s and 1s) that computers actually execute. Programming languages serve as intermediaries that are easier for humans to read and write, yet can be translated into machine code.",
          explanation: "Think of it like this:\n- Machine code: 10110000 01100001 (incomprehensible to humans)\n- Assembly language: MOV AL, 61h (still difficult)\n- High-level language: score = 97; (much clearer)\nProgramming languages provide abstraction layers that let us focus on problem-solving rather than hardware details.",
        },
        {
          type: "text",
          title: "Source Code and Execution",
          content: "Source code is the human-readable form of a program written in a programming language. For the computer to use it, this source code must be translated into machine-executable form through either compilation or interpretation.",
          explanation: "Here's what happens when you run a simple program:\n1. You write source code (e.g., `int average = (score1 + score2 + score3 + score4 + score5) / 5;`)\n2. A compiler or interpreter translates this to machine code\n3. The computer executes the machine code\n4. The result (the average) is produced as output\n\nThis process happens millions of times per second in modern computers.",
        },
        {
          type: "text",
          title: "Programming is More Than Coding",
          content: "Many beginners confuse programming with coding. Coding is just one part of programming:\n\nCoding: Writing the actual syntax in a programming language\nProgramming: The complete process including:\n- Understanding the problem\n- Planning the solution\n- Writing code (coding)\n- Testing the solution\n- Finding and fixing bugs\n- Maintaining and improving the program over time",
          explanation: "Imagine building a house. Coding is like laying bricks and hammering nails. Programming is the entire process: talking to the homeowner to understand what they want, designing the blueprint, obtaining materials, managing construction, inspecting the work, and handling repairs years later. Both are essential, but programming encompasses much more than just the physical construction.",
        },
        {
          type: "text",
          title: "Programming as Problem Solving",
          content: "At its core, programming is about solving problems. Let's walk through how a programmer approaches our average score problem:\n\n1. **Understand**: Clarify what 'average score' means, what subjects are included, where the data comes from\n2. **Decompose**: Break into smaller parts: get each score, sum them, divide by count, output result\n3. **Model**: Decide how to represent scores (variables), what operations are needed\n4. **Design**: Create the algorithm (the steps above)\n5. **Implement**: Write the code in a programming language\n6. **Test**: Try with known values (e.g., all 100s should give 100)\n7. **Debug**: If we get 75 when expecting 80, find where the logic went wrong\n8. **Improve**: Consider edge cases like missing scores or invalid input",
          explanation: "This problem-solving mindset is what separates programmers from those who merely memorize syntax. The same approach applies whether you're calculating averages, building a web app, or creating an operating system.",
        },
        {
          type: "text",
          title: "Real-World Applications",
          content: "Programming isn't just for tech companies—it's everywhere:\n\n• **Web Applications**: Every time you use Facebook, Google, or Amazon, programs are running on servers and in your browser\n• **Mobile Apps**: Your phone's apps are programs designed for touch interfaces and limited resources\n• **Operating Systems**: Windows, macOS, Linux are complex programs that manage your computer's hardware\n• **Video Games**: Games like Fortnite or Minecraft are programs that render graphics, process input, and simulate physics in real-time\n• **Scientific Research**: Programs analyze data from telescopes, particle accelerators, and DNA sequencers\n• **Medical Devices**: Programs control MRI machines, pacemakers, and diagnostic equipment\n• **Automotive Systems**: Modern cars have hundreds of programs managing everything from engine timing to braking\n• **Financial Systems**: Banks use programs to process transactions, detect fraud, and manage investments\n• **Automation**: Programs control factory robots, manage inventory, and automate repetitive tasks\n• **Developer Tools**: The very tools programmers use (IDEs, compilers, debuggers) are themselves programs",
          explanation: "In each case, programming is what turns human needs into functional software that solves real problems.",
        },
        {
          type: "text",
          title: "What Happens When a Program is Wrong?",
          content: "Programs can fail in several ways, and it's important to understand the difference:\n\n• **Syntax Errors**: Violations of the programming language's grammar (like missing a semicolon in Java). These are caught by the compiler/interpreter before the program even runs.\n• **Logical Errors**: The program runs without crashing but produces wrong results (like calculating average as (a+b)/2 instead of (a+b+c)/3). These are the hardest to find because the program seems to work.\n• **Runtime Errors**: Problems that occur only when the program is executing (like dividing by zero or accessing invalid memory).\n• **Wrong Assumptions**: The program works correctly for some inputs but fails for others due to incorrect assumptions about the data.",
          explanation: "A program that 'runs' isn't necessarily correct. Just because a program doesn't crash doesn't mean it solves the problem correctly. This is why testing and verification are essential parts of programming.",
        },
        {
          type: "text",
          title: "Testing and Debugging",
          content: "Testing asks: 'Does the program behave correctly for all expected inputs?'\nDebugging asks: 'When it behaves incorrectly, why and how do we fix it?'\n\nLet's say our average program returns 82 when we expect 85 for scores [90, 80, 90, 85, 80]. We'd debug by:\n1. Checking each step: Is the sum correct? (90+80+90+85+80 = 425)\n2. Is the count correct? (5 subjects)\n3. Is the division correct? (425/5 = 85, not 82)\n4. Discovering we accidentally divided by 5.2 instead of 5\n5. Fixing the error and retesting",
          explanation: "Testing validates correctness; debugging finds and fixes faults. Both are iterative processes that continue throughout a program's lifetime.",
        },
        {
          type: "warning",
          title: "Common Misconceptions",
          items: [
            "Programming = memorizing syntax: Actually, programming is about problem-solving; syntax is just the tool.",
            "You need to be a math genius: While some areas use advanced math, most programming relies on logical thinking more than mathematical ability.",
            "Good programmers never make mistakes: Everyone writes bugs; skilled programmers are just better at finding and fixing them.",
            "Coding and programming are identical: Coding is just one part of the broader programming process.",
            "Learning one language means you know programming: Programming concepts transfer across languages; syntax is the easy part.",
            "Programs should work perfectly on the first attempt: Professional programmers expect to iterate and refine their work.",
            "Programming is solitary work: Most programming involves collaboration, code reviews, and team communication.",
            "Once you write a program, it's done: Programs require ongoing maintenance, updates, and bug fixes."
          ]
        },
        {
          type: "table",
          title: "Important Distinctions",
          headers: ["Concept A", "Concept B", "Key Difference"],
          rows: [
            ["Programming", "Coding", "Programming is the entire problem-solving process; coding is just writing the code"],
            ["Algorithm", "Program", "An algorithm is the abstract solution; a program is its concrete implementation in a language"],
            ["Source Code", "Machine Code", "Source code is human-readable; machine code is what the CPU actually executes"],
            ["Syntax", "Semantics", "Syntax is the structure/grammar; semantics is the meaning/behavior"],
            ["Problem", "Solution", "The problem is what needs to be solved; the solution is how we solve it"],
            ["Compilation", "Interpretation", "Compilation translates the whole program first; interpretation translates and executes line by line"]
          ]
        },
        {
          type: "text",
          title: "Real Thinking Example",
          content: "Let's work through a slightly more complex problem: \"Create a program that determines if a student passed or failed based on their score.\"",
          explanation: "Here's the programmer's thought process:\n\n**Understand**: Need to define 'passed' (let's say ≥60 is passing)\n**Decompose**: Get score, compare to threshold, output result\n**Model**: Need a variable for the score, a constant for the threshold (60), and logic to compare\n**Design**: Algorithm: 1) Input score, 2) If score ≥ 60, output 'Pass', 3) Else output 'Fail'\n**Implement**: In Java: `if (score >= 60) System.out.println(\"Pass\"); else System.out.println(\"Fail\");`\n**Test**: Try score 60 (should pass), 59 (should fail), 100 (should pass), 0 (should fail)\n**Debug**: If score 60 outputs 'Fail', check if we used > instead of ≥\n**Improve**: Handle invalid inputs like negative scores or scores over 100\n\nThis example shows how even simple problems require careful thinking at each stage.",
        },
        {
          type: "interviewTraps",
          title: "Interview Traps & Edge Cases",
          traps: [
            {
              question: "What is programming?",
              trap: "Saying 'writing code' or 'telling computers what to do' without mentioning problem-solving.",
              solution: "Programming is the complete process of understanding a problem, designing a solution, expressing that solution in a formal language, and verifying it works correctly. Coding is just one part of this process. Interviewers want to see if you understand programming as a discipline, not just a technical skill. Programming is problem-solving expressed through precise instructions that computers can execute. It involves understanding requirements, designing algorithms, implementing them in programming languages, testing correctness, and maintaining the solution over time."
            },
            {
              question: "Is coding the same as programming?",
              trap: "Saying yes without explaining the broader scope of programming.",
              solution: "No. Coding refers specifically to writing code in a programming language. Programming encompasses the entire lifecycle: problem analysis, solution design, coding, testing, debugging, and maintenance. This tests whether you see programming as a holistic discipline rather than just syntax writing. Coding is a subset of programming. While all programming involves coding, not all coding constitutes programming (e.g., typing existing code without understanding it). Programming requires the full problem-solving context."
            },
            {
              question: "Why do computers require precise instructions?",
              trap: "Saying 'because they're stupid' or giving a vague answer about needing clarity.",
              solution: "Computers operate on basic electrical signals and have no intuition or common sense. They can only perform predefined operations. Ambiguity in instructions leads to unpredictable behavior because the computer must choose arbitrarily when faced with unclear directions. This probes your understanding of computer architecture and the nature of computation. Computers are finite state machines that execute exact sequences of operations. Unlike humans who use context and inference, computers need every step explicitly defined because they lack the ability to interpret intent or fill in gaps through reasoning."
            },
            {
              question: "What's the difference between an algorithm and a program?",
              trap: "Giving a definition but not explaining why the distinction matters.",
              solution: "An algorithm is a language-independent step-by-step procedure for solving a problem. A program is the implementation of that algorithm in a specific programming language. The same algorithm can be expressed as different programs in Java, Python, or C++. Interviewers use this to assess if you understand abstraction and language independence. The algorithm is the 'what' (the solution strategy); the program is the 'how' (the specific language implementation). This separation allows us to focus on problem-solving without getting bogged down in syntax details, and enables the same solution to work across different platforms."
            },
            {
              question: "Can the same algorithm be implemented in different programming languages?",
              trap: "Saying yes but not giving examples or explaining implications.",
              solution: "Yes, absolutely. For example, the algorithm to find the largest number in a list can be implemented identically in logic across Java, Python, JavaScript, and C++, differing only in syntax. This demonstrates that programming concepts transcend specific languages. This checks if you grasp the portability of programming knowledge. Programming fundamentals like loops, conditionals, and variables are transferable across languages. While syntax differs, the core problem-solving skills remain the same, making it easier to learn additional languages once you understand programming concepts."
            }
          ]
        },
        {
          type: "think",
          title: "Think About It",
          question: "If programming is about giving instructions to computers, why can't we just use natural language like English instead of formal programming languages?",
          answerReveal: "Natural language is full of ambiguity, context-dependence, and implicit assumptions that computers cannot resolve. Consider the instruction 'Time flies like an arrow; fruit flies like a banana.' Humans understand the wordplay, but a computer would be completely confused by the multiple meanings of 'flies' and 'like'. Programming languages eliminate this ambiguity through precise syntax and semantics."
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Which of the following best represents the programming process?",
          options: [
            "Writing code in a text editor",
            "Understanding a problem → designing a solution → implementing it → testing → debugging",
            "Memorizing programming language syntax",
            "Running existing programs to see what they do"
          ],
          answer: 1,
          explanation: "Programming encompasses the entire problem-solving lifecycle, not just writing code or running programs."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Programming is problem-solving expressed through precise instructions that computers can execute.",
            "The programming process includes understanding problems, designing algorithms, writing code, testing, and debugging.",
            "Algorithms are language-independent solution procedures; programs are their implementations in specific languages.",
            "Computers require precise instructions because they lack intuition and cannot handle ambiguity.",
            "Programming is used everywhere in modern society, from smartphones to spacecraft to medical equipment.",
            "Confusing programming with just coding misses the broader problem-solving nature of the discipline."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Now that you understand what programming is—the process of turning human problems into computer-executable solutions—the next logical step is learning about programming languages themselves. Since programming requires expressing solutions in a formal language, we'll explore what programming languages are, why different languages exist, and how they help us bridge the gap between human thinking and machine execution."
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
          title: "Concept",
          content: "A programming language is a formal language comprising a set of instructions that produce various kinds of output. Programming languages are used in computer programming to implement algorithms."
        },
        {
          type: "callout",
          title: "Why It Matters",
          content: "Different programming languages are suited for different tasks. Understanding the landscape helps you choose the right tool for the job and makes learning new languages easier."
        },
        {
          type: "text",
          title: "Core Concept",
          content: "Programming languages provide abstractions over machine code, making it easier for humans to write complex instructions. They fall into paradigms like procedural, object-oriented, functional, and declarative."
        },
        {
          type: "text",
          title: "How It Works",
          content: "1. Humans write code in a programming language (high-level)\n2. The code is translated to machine code via compiler or interpreter\n3. Machine code executes directly on the CPU\n4. Results are returned to the user"
        },
        {
          type: "text",
          title: "Real World Use",
          content: "Web development (JavaScript, Python, Ruby), Data science (Python, R), Mobile apps (Swift, Kotlin, Java), Systems programming (C, Rust, Go), Game development (C++, C#), Enterprise software (Java, .NET)"
        },
        {
          type: "warning",
          title: "Common Mistakes",
          items: [
            "Thinking one language is best for all tasks",
            "Believing languages are completely unrelated",
            "Focusing only on syntax without understanding concepts",
            "Not learning why certain languages exist"
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Questions",
          traps: [
            {
              question: "What are the main types of programming languages?",
              trap: "Listing specific languages instead of paradigms.",
              solution: "The main paradigms are procedural (C, Pascal), object-oriented (Java, C++, Python), functional (Haskell, Scala, Clojure), and declarative (SQL, Prolog)."
            },
            {
              question: "Why are there so many programming languages?",
              trap: "Saying it's just preference.",
              solution: "Different languages excel at different domains: systems programming needs performance and control (C/Rust), web development benefits from flexibility (JavaScript/Python), and enterprise applications value robustness and tooling (Java/.NET)."
            }
          ]
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Programming languages are tools for expressing algorithms. Choose based on task requirements, not popularity alone."
          ]
        },
        {
          type: "quickCheck",
          question: "Which language is primarily used for Android app development?",
          options: ["Python", "Swift", "Java/Kotlin", "JavaScript"],
          answer: 2,
          explanation: "Android applications are primarily developed using Java or Kotlin, though other technologies like Flutter (Dart) and React Native (JavaScript) are also used."
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
          title: "Concept",
          content: "High-level languages are programming languages with strong abstraction from the hardware, while low-level languages provide little or no abstraction and are closer to machine code."
        },
        {
          type: "callout",
          title: "Why It Matters",
          content: "Understanding the trade-offs helps you choose the right language for performance-critical applications versus rapid development needs."
        },
        {
          type: "text",
          title: "Core Concept",
          content: "Low-level languages (like assembly) offer maximum control and performance but are harder to write and maintain. High-level languages (like Java, Python) sacrifice some performance for developer productivity and portability."
        },
        {
          type: "code",
          title: "Code Comparison",
          code: "// High-level:\nint sum = a + b;\n\n// Low-level equivalent would involve multiple assembly instructions",
          explanation: "High-level code is readable and concise."
        },
        {
          type: "text",
          title: "How It Works",
          content: "Low-level: Directly manipulates registers and memory\nHigh-level: Uses variables, expressions, and constructs that abstract away hardware details\nTranslation: Compilers/interpreters convert high-level to low-level machine code"
        },
        {
          type: "text",
          title: "Real World Use",
          content: "Low-level: Operating systems, device drivers, embedded systems, performance-critical applications\nHigh-level: Most business applications, web development, data analysis, scripting"
        },
        {
          type: "warning",
          title: "Common Mistakes",
          items: [
            "Assuming high-level languages are always slower",
            "Believing low-level languages are obsolete",
            "Thinking you must learn assembly to be a good programmer",
            "Not understanding that modern compilers optimize high-level code well"
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Questions",
          traps: [
            {
              question: "What is the main advantage of high-level languages?",
              trap: "Saying they are 'better' without explaining why.",
              solution: "High-level languages provide abstraction from hardware details, making code more portable, easier to write, read, and maintain."
            },
            {
              question: "When would you choose a low-level language?",
              trap: "Saying 'when I need it to be fast' without context.",
              solution: "Choose low-level languages when you need direct hardware access, maximum performance (like in device drivers or real-time systems), or when working with severely constrained resources."
            }
          ]
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "High-level = programmer-friendly, portable; Low-level = hardware-friendly, fast but complex. Most applications use high-level languages."
          ]
        },
        {
          type: "quickCheck",
          question: "Which of the following is a low-level language?",
          options: ["Python", "Java", "Assembly Language", "JavaScript"],
          answer: 2,
          explanation: "Assembly language is a low-level language that has a strong correspondence between its instructions and the architecture's machine code instructions."
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
          title: "Concept",
          content: "A compiler translates entire source code programs into machine code before execution, while an interpreter translates and executes code line by line at runtime."
        },
        {
          type: "callout",
          title: "Why It Matters",
          content: "Understanding this difference explains performance characteristics, development workflows, and why languages like Java use both approaches."
        },
        {
          type: "text",
          title: "Core Concept",
          content: "Compilers produce standalone executables that run fast but require compilation step. Interpreters allow immediate execution and easier debugging but typically run slower. Some languages use both (Java compiles to bytecode, then interprets/JIT compiles that)."
        },
        {
          type: "text",
          title: "How It Works",
          content: "Compiler: Source Code → Compiler → Machine Code Executable → Run\nInterpreter: Source Code → Interpreter (line by line) → Execute"
        },
        {
          type: "text",
          title: "Real World Use",
          content: "Compiled: C, C++, Go, Rust (produce .exe files)\nInterpreted: Python, JavaScript, PHP, Ruby (run via interpreter)\nHybrid: Java, C# (compile to intermediate language, then JIT interpret)"
        },
        {
          type: "warning",
          title: "Common Mistakes",
          items: [
            "Thinking interpreted languages are always slower",
            "Believing compiled languages cannot be debugged easily",
            "Not understanding Java's hybrid approach",
            "Confusing compilation with interpretation"
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Questions",
          traps: [
            {
              question: "Is Java compiled or interpreted?",
              trap: "Saying it is purely one or the other.",
              solution: "Java uses both: source code is compiled to bytecode by javac, then the bytecode is interpreted or JIT-compiled by the JVM at runtime."
            },
            {
              question: "What is JIT compilation?",
              trap: "Confusing it with standard ahead-of-time compilation.",
              solution: "Just-In-Time compilation compiles bytecode to native machine code during execution, combining portability of interpretation with performance of compilation."
            }
          ]
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Compiler = translate entire program first; Interpreter = translate and execute line by line. Java uses both approaches."
          ]
        },
        {
          type: "quickCheck",
          question: "Which step comes first in the Java execution process?",
          options: [
            "JVM execution",
            "Source code compilation to bytecode",
            "Bytecode interpretation",
            "Machine code execution"
          ],
          answer: 1,
          explanation: "In Java, the first step is compiling .java source code to .bytecode using the javac compiler. Only then does the JVM execute or compile the bytecode further."
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
          title: "Concept",
          content: "Source code is the human-readable form of a program written in a programming language. Compilation is the process of translating source code into machine-executable code. Execution is the process of running that compiled code to produce results."
        },
        {
          type: "callout",
          title: "Why It Matters",
          content: "Understanding this pipeline is essential for troubleshooting, performance optimization, and understanding how your code becomes a running application."
        },
        {
          type: "text",
          title: "Core Concept",
          content: "The journey from idea to running program involves: writing source code → compiling (if needed) → linking → loading → execution. Each step transforms the code closer to what the hardware can execute."
        },
        {
          type: "code",
          title: "Example Flow",
          code: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}",
          explanation: "This source code is compiled via `javac Main.java` and executed via `java Main`."
        },
        {
          type: "text",
          title: "How It Works",
          content: "1. Edit: Write Main.java using text editor or IDE\n2. Compile: javac Main.java creates Main.class (bytecode)\n3. Execute: java Main runs the bytecode in JVM\n4. Output: 'Hello, World!' appears in console"
        },
        {
          type: "warning",
          title: "Common Mistakes",
          items: [
            "Forgetting to recompile after changing source code",
            "Confusing .java (source) with .class (compiled) files",
            "Not understanding that syntax errors are caught at compile time",
            "Believing Java runs source code directly"
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Questions",
          traps: [
            {
              question: "What file extension does Java source code use?",
              trap: "Answering .class or .exe.",
              solution: "Java source code uses the .java file extension."
            },
            {
              question: "What happens if you try to run a .java file directly with 'java'?",
              trap: "Thinking it works like Python or JavaScript.",
              solution: "You will get an error because the java command expects compiled .class files, not source .java files. You must compile first with javac."
            }
          ]
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Source (.java) → Compile (javac) → Bytecode (.class) → Execute (java) → Output. Errors caught early in compilation."
          ]
        },
        {
          type: "quickCheck",
          question: "What command compiles a Java source file named Hello.java?",
          options: ["java Hello.java", "javac Hello.java", "compile Hello.java", "java -compile Hello.java"],
          answer: 1,
          explanation: "The javac command is the Java compiler that translates .java source files into .class bytecode files."
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
          title: "Concept",
          content: "Syntax refers to the grammatical structure and rules that govern how code must be written in a programming language. Semantics refers to the meaning of what the syntactically correct code actually does when executed."
        },
        {
          type: "callout",
          title: "Why It Matters",
          content: "You can write code that follows all syntax rules (compiles without errors) but still does the wrong thing due to semantic errors. Understanding both is crucial for effective programming."
        },
        {
          type: "code",
          title: "Syntax vs Semantics",
          code: "// Syntax error: Missing semicolon\nint x = 5\n\n// Semantic error: Valid syntax, wrong meaning\n// Intended to add, but subtracted instead:\ntotal = price - tax;",
          explanation: "Syntax errors are caught by the compiler. Semantic errors are logical bugs caught during testing."
        },
        {
          type: "text",
          title: "How It Works",
          content: "Syntax Check: Compiler verifies code follows language grammar rules\nSemantic Check: Developer/testing verifies code produces intended results\nExecution: Computer runs the semantically meaningful instructions"
        },
        {
          type: "warning",
          title: "Common Mistakes",
          items: [
            "Assuming if code compiles, it must be correct",
            "Focusing only on syntax errors during debugging",
            "Not testing edge cases that reveal semantic issues",
            "Confusing compiler errors with logical errors"
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Questions",
          traps: [
            {
              question: "Can code be syntactically correct but semantically wrong? Give an example.",
              trap: "Saying no, or struggling for an example.",
              solution: "Yes. Example: calculating average as (a + b) / 2 when you meant (a + b + c) / 3. Syntax is correct but semantics (meaning) is wrong."
            },
            {
              question: "What type of errors does the compiler catch?",
              trap: "Thinking it catches logic errors.",
              solution: "The compiler catches syntax errors and some basic semantic errors (like type mismatches in strongly typed languages), but it cannot catch logical errors in your algorithm."
            }
          ]
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Syntax = structure (compiler checks); Semantics = meaning (you/test verify). Both must be correct for a working program."
          ]
        },
        {
          type: "quickCheck",
          question: "Which of the following is a syntax error in Java?",
          options: [
            "Using the wrong variable name",
            "Forgetting a semicolon at end of statement",
            "Dividing by zero",
            "Using an uninitialized variable"
          ],
          answer: 1,
          explanation: "Forgetting a semicolon is a syntax error because it violates Java's grammatical rules. The other options may cause runtime errors or logical issues but are syntactically valid."
        }
      ]
    }
  }
];

/**
 * MODULE 2 — VARIABLES & DATA TYPES (8 lessons)
 */

export const variablesDataTypesLessons: Array<{
  slug: string;
  title: string;
  content: CourseLessonContent
}> = [
  {
    slug: "variables",
    title: "Variables",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "Before learning about variables, you should understand basic programming concepts such as what a program is and how instructions are executed sequentially."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of a variable as a labeled box in your computer's memory where you can store a value. The label (variable name) lets you refer to that box later to retrieve or change what's inside."
        },
        {
          type: "text",
          title: "Concept",
          content: "A variable is a named storage location in memory that holds a value which can be changed during program execution. Variables are fundamental to storing and manipulating data in programs."
        },
        {
          type: "callout",
          title: "Why It Matters",
          content: "Without variables, programs could only work with fixed constants. Variables enable programs to handle dynamic data, user input, and changing state during execution."
        },
        {
          type: "text",
          title: "How It Works",
          content: "1. Declaration: You tell the compiler the variable's name and type (e.g., `int score;`)\n2. Initialization: You assign an initial value (e.g., `score = 0;`)\n3. Usage: You read or modify the variable's value in expressions and statements\n4. Memory: The JVM allocates space in memory for each variable based on its type"
        },
        {
          type: "text",
          title: "Core Concept",
          content: "Variables combine three key aspects: a name (identifier), a type (what kind of data it holds), and a value (the actual data stored). The type determines what operations you can perform and how much memory is allocated."
        },
        {
          type: "code",
          title: "Syntax & Examples",
          code: "int age = 25;\ndouble salary = 50000.50;\nboolean isEmployed = true;\nchar grade = 'A';",
          explanation: "In Java, you must specify the `dataType` before the `variableName`."
        },
        {
          type: "tryIt",
          title: "Try It: Predict the Output",
          code: "int a = 5;\nint b = 10;\na = b;\nb = 20;\nSystem.out.println(a);",
          expectedOutput: "10",
          explanation: "When `a = b` runs, `a` gets the value 10. Changing `b` to 20 afterwards doesn't affect `a`."
        },
        {
          type: "dryRun",
          title: "Variable Assignment Trace",
          iterations: [
            { step: 1, variables: { a: "5", b: "undefined" }, description: "Declare a and initialize to 5." },
            { step: 2, variables: { a: "5", b: "10" }, description: "Declare b and initialize to 10." },
            { step: 3, variables: { a: "10", b: "10" }, description: "Assign the value of b to a." },
            { step: 4, variables: { a: "10", b: "20" }, description: "Assign 20 to b. Note that a remains 10." }
          ]
        },
        {
          type: "text",
          title: "Real-World Use Cases",
          content: "Variables are used everywhere in programming: counting loop iterations, storing user input, keeping track of game scores, holding configuration settings, and temporary calculations in complex algorithms."
        },
        {
          type: "text",
          title: "When to Use It",
          content: "Use a variable whenever you need to store a value that might change during program execution, or when you want to give a meaningful name to a value used multiple times."
        },
        {
          type: "text",
          title: "When Not to Use It",
          content: "Don't use a variable for a value that never changes (use a constant instead) or for temporary values used only once in an expression where a literal would be clearer."
        },
        {
          type: "table",
          title: "Variable Types Comparison",
          headers: ["Type", "Size", "Range", "Default Value", "Example"],
          rows: [
            ["boolean", "1 bit", "true or false", "false", "isReady = true"],
            ["char", "16 bits", "0 to 65535 (Unicode)", "‘\\u0000‘", "grade = 'A'"],
            ["byte", "8 bits", "-128 to 127", "0", "count = 10"],
            ["short", "16 bits", "-32,768 to 32,767", "0", "year = 2023"],
            ["int", "32 bits", "-2,147,483,648 to 2,147,483,647", "0", "population = 100000"],
            ["long", "64 bits", "-9 quintillion to 9 quintillion", "0L", "distance = 15000000000L"],
            ["float", "32 bits", "±3.4×10³⁸ (approx)", "0.0f", "price = 19.99f"],
            ["double", "64 bits", "±1.8×10³⁰⁸ (approx)", "0.0", "pi = 3.14159"]
          ]
        },
        {
          type: "warning",
          title: "Common Mistakes",
          items: [
            "Using a variable before declaring it",
            "Using a variable before initializing it",
            "Using the wrong data type for the value",
            "Using reserved keywords as variable names"
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps",
          traps: [
            {
              question: "What happens if you use a variable before initializing it in Java?",
              trap: "Saying it will hold garbage data like in C/C++.",
              solution: "In Java, local variables must be initialized before use, or you'll get a compile-time error. Instance variables get default values (0, false, null)."
            },
            {
              question: "Can you declare multiple variables of the same type in one line?",
              trap: "Thinking you must declare each variable separately.",
              solution: "Yes, you can declare multiple variables of the same type in one line: `int x = 5, y = 10, z = 20;`"
            }
          ]
        },
        {
          type: "quickCheck",
          question: "What is the correct way to declare and initialize an integer variable named 'count' with value 10?",
          options: [
            "int count = 10;",
            "integer count = 10;",
            "count = 10 int;",
            "var count = 10;"
          ],
          answer: 0,
          explanation: "In Java, the correct syntax is 'dataType variableName = value;', so 'int count = 10;' is correct."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Variables store changeable values; constants store fixed values.",
            "Always declare variables with a type and initialize before use.",
            "Choose the smallest type that can hold your needed range to conserve memory.",
            "Use meaningful names that describe the variable's purpose."
          ]
        },
        {
          type: "quickCheck",
          question: "Which variable declaration will cause a compile-time error?",
          options: [
            "int x = 5;",
            "double y = 3.14;",
            "z = 10;",
            "boolean flag = true;"
          ],
          answer: 2,
          explanation: "Option C uses a variable 'z' without declaring it first, which is not allowed in Java."
        }
      ]
    }
  },
  {
    slug: "constants",
    title: "Constants",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "Before learning about constants, you should understand variables and basic data types in Java. You should also be familiar with the concept of immutability and why some values in programming should not change."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of a constant as a sealed container in your computer's memory. Unlike a variable (which is like an open box you can put things in and take things out of), a constant is like a locked box - once you put a value in it and seal it, you can never change what's inside. You can only look at what's inside."
        },
        {
          type: "text",
          title: "Concept",
          content: "A constant is a variable whose value cannot be changed after it is initialized. In Java, constants are declared using the 'final' keyword, which creates a read-only reference to a value. Once assigned, the value remains fixed for the lifetime of the constant."
        },
        {
          type: "callout",
          title: "Why It Matters",
          content: "Constants eliminate 'magic numbers' (unexplained numeric values) from your code, making it more readable, maintainable, and less prone to errors. They also communicate intent - when other developers see a constant named MAX_RETRIES, they immediately understand its purpose rather than having to decode what the number 3 means in context."
        },
        {
          type: "text",
          title: "How It Works",
          content: "1. Declaration with 'final': The 'final' keyword specifies that the variable cannot be reassigned\n2. Initialization: Must assign a value either at declaration or in a constructor (for blank finals)\n3. Usage: You can read the constant's value but cannot assign to it again\n4. Compiler Enforcement: Any attempt to reassign a final variable results in a compile-time error\n5. Memory: Constants are typically stored in the method area (for static finals) or stack/heap (for instance/local finals) but their values cannot be modified"
        },
        {
          type: "text",
          title: "Core Concept",
          content: "Constants combine three key aspects: immutability (value cannot change), meaningful naming (descriptive identifiers), and type safety (the data type constrains what values can be stored). The 'final' modifier creates a binding that, once established, cannot be altered."
        },
        {
          type: "text",
          title: "Real-World Use Cases",
          content: "Constants are used extensively in real-world applications: mathematical constants (PI, E, gravitational constant), configuration values (database connection limits, timeout values), status codes (HTTP status codes, error codes), application limits (maximum file size, buffer sizes), and any fixed values that benefit from descriptive names rather than raw literals."
        },
        {
          type: "text",
          title: "When to Use It",
          content: "Use a constant whenever you have a value that:\n1. Never changes during program execution\n2. Is used multiple times throughout your code\n3. Would benefit from a descriptive name rather than a raw literal\n4. Represents a fundamental value in your domain (like PI for geometry calculations)"
        },
        {
          type: "text",
          title: "When Not to Use It",
          content: "Don't use a constant for:\n1. Values that might change based on configuration or environment\n2. Temporary values used only once in a calculation\n3. Values that should be configurable by users or administrators\n4. Data that comes from external sources (user input, database, API responses)\n5. Values that need to be different for different instances of an object"
        },
        {
          type: "text",
          title: "Syntax & Examples",
          content: "final dataType CONSTANT_NAME = value;",
          explanation: "In Java, constants are declared using the 'final' keyword followed by the data type, constant name (by convention in UPPER_SNAKE_CASE), and an initial value. The constant name should be descriptive and all uppercase with words separated by underscores."
        },
        {
          type: "code",
          title: "Basic Constant Declarations",
          code: "final double PI = 3.14159;\nfinal int MAX_STUDENTS = 100;\nfinal String COMPANY_NAME = \"Acme Corp\";\nfinal boolean IS_DEBUG = true;\nfinal char GRADE_A = 'A';",
          language: "java",
          explanation: "Examples of constants for different data types: floating-point, integer, string, boolean, and character."
        },
        {
          type: "code",
          title: "Constants in Context",
          code: "public class CircleCalculator {\n    // Class-level constants (static)\n    private static final double PI = 3.14159;\n    private static final double DEFAULT_PRECISION = 0.01;\n    \n    // Instance constants (final but not static)\n    private final String calculatorId;\n    \n    public CircleCalculator(String id) {\n        this.calculatorId = id; // Blank final initialized in constructor\n    }\n    \n    public double calculateArea(double radius) {\n        return PI * radius * radius; // Using the constant\n    }\n    \n    public double calculateCircumference(double radius) {\n        return 2 * PI * radius;\n    }\n}",
          language: "java",
          explanation: "Shows how constants are used in a real class, including static constants (shared across all instances) and instance constants (unique to each object)."
        },
        {
          type: "dryRun",
          title: "Constant Initialization Trace",
          iterations: [
            { step: 1, variables: { radius: "5.0", area: "undefined" }, description: "Method starts with radius parameter set to 5.0" },
            { step: 2, variables: { radius: "5.0", area: "78.53975" }, description: "Calculate area using PI constant: 3.14159 * 5.0 * 5.0 = 78.53975" },
            { step: 3, variables: { radius: "5.0", area: "78.53975" }, description: "Return the calculated area" }
          ]
        },
        {
          type: "warning",
          title: "Common Mistakes",
          items: [
            "Forgetting the 'final' keyword (creates a variable, not a constant)",
            "Not initializing constants at declaration (for local/instance finals)",
            "Using lowercase or camelCase for constant names (violates UPPER_SNAKE_CASE convention)",
            "Trying to reassign a constant after initialization (causes compile-time error)",
            "Using constants for values that actually might change (should use variables or configuration instead)",
            "Having constants with unclear or misleading names",
            "Declaring constants with overly broad scope when narrower scope would be better"
          ]
        },
        {
          type: "think",
          title: "Think About It",
          question: "Why does Java use the keyword 'final' for constants instead of introducing a new keyword like 'const'?",
          answerReveal: "Java chose 'final' because it already had a clear meaning in the context of inheritance (final classes/methods cannot be subclassed/overridden). Using 'final' for constants extends this concept of immutability to variables. Additionally, 'const' is a reserved word in Java (inherited from C/C++) but was not given a meaning to avoid confusion, allowing Java to evolve without breaking existing code that might use 'const' as an identifier."
        },
        {
          type: "table",
          title: "Variable vs Constant Comparison",
          headers: ["Aspect", "Variable", "Constant"],
          rows: [
            ["Mutability", "Can be changed after initialization", "Cannot be changed after initialization"],
            ["Declaration Keyword", "dataType name = value;", "final dataType NAME = value;"],
            ["Naming Convention", "camelCase", "UPPER_SNAKE_CASE"],
            ["Typical Use Case", "Values that change during execution", "Fixed values that benefit from naming"],
            ["Memory Allocation", "Stack/heap (varies by scope)", "Stack/heap or method area (depends on static)"],
            ["Compiler Flexibility", "Can be reassigned", "Assignment locked after initialization"]
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps & Edge Cases",
          traps: [
            {
              question: "What is a 'blank final' in Java?",
              trap: "Thinking it's a final variable that hasn't been declared yet.",
              solution: "A blank final is a final variable that is declared but not initialized at the point of declaration. It must be initialized exactly once before use, either in an instance initializer block or in every constructor of the class."
            },
            {
              question: "Can a final reference refer to an object whose state can still be changed?",
              trap: "Believing that 'final' makes the referenced object completely immutable.",
              solution: "Yes! The 'final' keyword only makes the reference itself immutable (you cannot change what object the reference points to). The object's internal state can still be modified if it has setter methods or mutable fields. For true immutability, you need both a final reference and an immutable object."
            },
            {
              question: "Are interface fields automatically constants in Java?",
              trap: "Assuming all interface fields behave like constants regardless of modifiers.",
              solution: "Yes, fields in interfaces are implicitly public, static, and final. This means they are constants by default, though it's good practice to explicitly declare them as such for clarity."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Which of the following declarations creates a constant in Java?",
          options: [
            "int MAX = 100;",
            "final int MAX = 100;",
            "const int MAX = 100;",
            "final int max = 100;"
          ],
          answer: 1,
          explanation: "Option B is correct because it uses the 'final' keyword and follows the UPPER_SNAKE_CASE naming convention. Option A lacks 'final', Option C uses 'const' which is not valid for constants in Java, and Option D uses lowercase naming which violates the convention."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Constants = final variables. Their values cannot change after initialization.",
            "Use UPPER_SNAKE_CASE naming convention for constants (MAX_VALUE, DEFAULT_TIMEOUT).",
            "Constants eliminate magic numbers and improve code readability and maintainability.",
            "Blank finals must be initialized exactly once before use, either at declaration or in every constructor.",
            "The 'final' keyword makes the reference immutable, not necessarily the object it references."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Now that you understand constants and how they provide immutable named values, the next logical step is learning about primitive data types in depth. You'll explore the characteristics, ranges, and appropriate use cases for each of Java's eight primitive types (boolean, char, byte, short, int, long, float, double). Understanding both constants and primitives will give you a solid foundation for working with data in Java programs."
        }
      ]
    }
  },
  {
    slug: "primitive-data-types",
    title: "Primitive Data Types",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "Before studying primitive data types, you should understand what variables are, how memory allocation generally works, and how the computer uses binary bits (0s and 1s) to encode numbers and characters."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Imagine having 8 fixed-size storage compartments built directly into the computer's CPU and RAM. Each compartment has a strict hardware size (from 1 byte to 8 bytes) and an exact format for interpreting binary patterns. Unlike complex objects that require an address pointer to look up data stored elsewhere on the heap, primitive variables hold their raw binary values directly in the variable's memory slot on the stack."
        },
        {
          type: "callout",
          title: "Why Primitive Types Exist",
          content: "Computers are physical electronic devices whose CPU registers and arithmetic logic units (ALU) operate on fixed bit widths (8, 16, 32, 64 bits). Primitive data types allow programmers to map high-level code directly to bare-metal hardware operations with maximum execution speed and zero memory overhead."
        },
        {
          type: "text",
          title: "The 8 Java Primitives Overview",
          content: "Java provides exactly eight built-in primitive types divided into four distinct categories:\n\n1. Integer family: byte (8-bit), short (16-bit), int (32-bit), long (64-bit)\n2. Floating-point family: float (32-bit), double (64-bit)\n3. Character: char (16-bit unsigned Unicode)\n4. Boolean: boolean (true or false, 1-bit logical value)"
        },
        {
          type: "table",
          title: "Comprehensive Primitive Types Specification",
          headers: ["Type", "Bits", "Bytes", "Min Value", "Max Value", "Default", "Example Literal"],
          rows: [
            ["byte", "8", "1", "-128 (-2⁷)", "127 (2⁷ - 1)", "0", "byte b = 100;"],
            ["short", "16", "2", "-32,768 (-2¹⁵)", "32,767 (2¹⁵ - 1)", "0", "short s = 30000;"],
            ["int", "32", "4", "-2,147,483,648 (-2³¹)", "2,147,483,647 (2³¹ - 1)", "0", "int x = 1_000_000;"],
            ["long", "64", "8", "-2⁶³", "2⁶³ - 1", "0L", "long id = 9876543210L;"],
            ["float", "32", "4", "±1.4E-45", "±3.4028235E+38", "0.0f", "float f = 3.14159f;"],
            ["double", "64", "8", "±4.9E-324", "±1.7976931348623157E+308", "0.0d", "double d = 2.71828182845;"],
            ["char", "16", "2", "\\u0000 (0)", "\\uffff (65,535)", "'\\u0000'", "char c = 'A'; // or 65"],
            ["boolean", "1 (JVM varies)", "1", "false", "true", "false", "boolean active = true;"]
          ]
        },
        {
          type: "text",
          title: "Integer Representation & Two's Complement",
          content: "All integer types in Java (byte, short, int, long) are signed and represented in memory using Two's Complement notation.\n\nIn an 8-bit byte:\n• The Most Significant Bit (MSB, leftmost bit) is the sign bit: 0 for positive, 1 for negative.\n• Positive numbers: 00000000 (0) up to 01111111 (+127).\n• Negative numbers: 10000000 (-128) up to 11111111 (-1).\n\nThis explains why a byte maxes out at +127 and not 255—half the bit patterns are reserved for negative numbers."
        },
        {
          type: "code",
          title: "Literals, Radixes & Underscores in Java",
          code: "// Decimal literal (base 10)\nint decimal = 42;\n\n// Binary literal (base 2) with 0b prefix\nint binary = 0b0010_1010; // 42\n\n// Hexadecimal literal (base 16) with 0x prefix\nint hex = 0x2A; // 42\n\n// Octal literal (base 8) with leading 0 (Caution!)\nint octal = 052; // 42 (5 * 8 + 2)\n\n// Long literal requires 'L' or 'l' suffix (always use capital 'L')\nlong nationalDebt = 34_000_000_000_000L;\n\n// Float literal requires 'F' or 'f' suffix; without it, decimals default to double\nfloat interestRate = 5.75f;\ndouble standardGravity = 9.80665;",
          language: "java",
          explanation: "Java allows numeric literals in binary, octal, decimal, and hexadecimal formats. Underscores '_' can be placed anywhere between digits to improve readability without affecting the value."
        },
        {
          type: "text",
          title: "Floating Point Gotcha: IEEE 754 Representation",
          content: "Floating-point numbers (float and double) do not store exact base-10 decimals. They store a binary approximation using sign, exponent, and mantissa based on the IEEE 754 standard.\n\nBecause numbers like 0.1 cannot be represented cleanly as finite sums of binary fractions (1/2, 1/4, 1/8, 1/16...), calculations can accumulate tiny precision errors.\n\nExample:\n0.1 + 0.2 produces 0.30000000000000004 in standard floating-point arithmetic!\n\nRule of Thumb:\nNever use float or double for monetary, banking, or crypto calculations. Always use BigDecimal for exact precision."
        },
        {
          type: "tryIt",
          title: "Try It: Character Arithmetic",
          code: "char letter = 'A';\nint asciiCode = letter;\nletter++;\nSystem.out.println(asciiCode + \" -> \" + letter);",
          expectedOutput: "65 -> B",
          explanation: "Characters in Java are 16-bit unsigned numbers representing Unicode code points. 'A' has ASCII/Unicode value 65. Incrementing 'letter' gives the next character code 66 ('B')."
        },
        {
          type: "dryRun",
          title: "Integer Overflow State Trace",
          iterations: [
            { step: 1, variables: { "b (binary)": "01111111", "b (decimal)": "127" }, description: "Initialize byte b to its maximum positive value (127)." },
            { step: 2, variables: { "b (binary)": "10000000", "b (decimal)": "-128" }, description: "Add 1 to b. The binary addition rolls over into the sign bit (MSB becomes 1), which in two's complement represents -128." },
            { step: 3, variables: { "b (binary)": "10000001", "b (decimal)": "-127" }, description: "Add another 1. The byte counts upwards from -128 towards zero." }
          ]
        },
        {
          type: "think",
          title: "Why is char 16 bits in Java unlike C/C++?",
          question: "Why did Java design the char primitive as a 16-bit type instead of the traditional 8-bit byte used in languages like C?",
          answerReveal: "Java was designed from the ground up for international internet applications. In 1995, Java adopted Unicode 1.0 (UTF-16 encoding), which used 16 bits to represent characters from all world alphabets (Latin, Greek, Cyrillic, Arabic, Devanagari, Hanzi, etc.) directly in a single data type, eliminating single-byte character encoding conflicts."
        },
        {
          type: "warning",
          title: "Common Mistakes with Primitives",
          items: [
            "Omitting the 'L' suffix on long values larger than 2,147,483,647: 'long x = 3000000000;' fails to compile because integer literals default to 32-bit int before assignment.",
            "Omitting the 'f' suffix on float literals: 'float f = 3.14;' fails to compile because 3.14 is typed as a 64-bit double.",
            "Accidentally creating octal numbers by adding a leading zero: 'int zip = 054;' becomes 44 in decimal.",
            "Comparing floats or doubles using '==' equality operator: tiny precision differences will cause comparisons to fail unexpectedly.",
            "Relying on integer types without considering overflow when multiplying large values (e.g. calculating timestamps or byte sizes in milliseconds)."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Primitives",
          traps: [
            {
              question: "What is the exact output of: byte b = 127; b += 1; System.out.println(b); vs byte b = 127; b = b + 1;?",
              trap: "Thinking both produce -128 or both fail to compile.",
              solution: "'b += 1' compiles and outputs -128 because compound assignment operators (+=, -=, *=) contain an implicit cast: 'b = (byte)(b + 1)'. In contrast, 'b = b + 1' fails to compile because binary arithmetic '+' promotes byte operands to 32-bit int, and assigning int back to byte requires an explicit cast."
            },
            {
              question: "Does Java specify the exact memory size of a boolean variable?",
              trap: "Confidently stating it is always 1 bit.",
              solution: "The Java Language Specification (JLS) defines boolean as representing one bit of logical information (true/false), but the physical memory layout is JVM implementation-dependent. Most JVMs represent standalone boolean variables as 32-bit ints for 4-byte CPU alignment and boolean arrays as packed 8-bit bytes."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check: Primitive Types",
          question: "Which of the following variable declarations will cause a compile-time error?",
          options: [
            "long count = 2147483648L;",
            "float price = 19.99;",
            "char symbol = 65;",
            "int hex = 0xDeadBeef;"
          ],
          answer: 1,
          explanation: "In Java, decimal literals like '19.99' are evaluated as 64-bit doubles by default. Assigning a double to a 32-bit float without an explicit cast or 'f' suffix causes a compile-time type mismatch error."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Java has 8 primitives: byte (1B), short (2B), int (4B), long (8B), float (4B), double (8B), char (2B), boolean (1B/logical).",
            "All primitive numeric types in Java are signed using Two's Complement representation.",
            "Default numeric literal types: Whole numbers are 'int', fractional numbers are 'double'.",
            "Use 'L' for long and 'F' for float literals.",
            "Never use float or double for currency; use BigDecimal to avoid IEEE 754 precision drift."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Now that you understand the 8 primitive data types and their memory limits, the next step is discovering how values transition between different types through Type Casting and Conversion. You will learn about implicit widening, explicit narrowing, bit truncation, and how expressions evaluate when mixed data types interact."
        }
      ]
    }
  },
  {
    slug: "type-casting",
    title: "Type Casting & Conversion",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "Before learning type casting, you should understand the 8 primitive data types, their bit widths, ranges, and how values are represented in binary memory."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of type casting as pouring liquid between different sized measuring cups.\n\n• Widening (Small cup &rarr; Large cup): Pouring water from a 1-cup container into a 5-gallon bucket is completely safe. No water can spill, so Java does this automatically (Implicit Casting).\n\n• Narrowing (Large cup &rarr; Small cup): Pouring water from a 5-gallon bucket into a 1-cup container will spill excess water if the volume exceeds capacity. Java requires the developer to explicitly sign off on this risk using a cast operator `(targetType)`."
        },
        {
          type: "callout",
          title: "Why Type Casting Exists",
          content: "In real-world programming, data arrives in diverse formats: sensor readings as floats, user inputs as strings, array indices as ints, and database IDs as longs. Type casting gives programmers control over converting values between compatible data types while managing precision and memory constraints."
        },
        {
          type: "text",
          title: "The Two Types of Casting",
          content: "1. Widening Casting (Implicit / Automatic):\nConverts a smaller data type into a larger data type. No data loss occurs (except potential precision loss from long to float). Performed automatically by the Java compiler.\nOrder: byte → short → int → long → float → double (and char → int)\n\n2. Narrowing Casting (Explicit / Manual):\nConverts a larger data type into a smaller data type. Can cause truncation of decimal digits or integer overflow. Requires the cast operator `(type)`.\nOrder: double → float → long → int → short → byte"
        },
        {
          type: "code",
          title: "Widening vs Narrowing in Java",
          code: "// 1. WIDENING CASTING (Automatic)\nint myInt = 100;\ndouble myDouble = myInt; // Automatic conversion: 100.0\nSystem.out.println(myDouble); // 100.0\n\n// 2. NARROWING CASTING (Explicit)\ndouble price = 99.99;\nint truncatedPrice = (int) price; // Discards decimal fraction\nSystem.out.println(truncatedPrice); // 99\n\n// 3. NARROWING WITH BIT OVERFLOW\nint largeNumber = 130;\nbyte smallByte = (byte) largeNumber;\nSystem.out.println(smallByte); // -126 (Bit truncation!)",
          language: "java",
          explanation: "In narrowing casting, Java simply discards the upper bits. For floating-point to integer casting, the entire fractional component is truncated toward zero."
        },
        {
          type: "text",
          title: "Binary Mechanism: How Narrowing Causes Overflow",
          content: "When you cast a 32-bit `int` to an 8-bit `byte`, Java takes only the lowest 8 bits and discards the top 24 bits.\n\nLet's trace casting `130` to `byte`:\n1. 32-bit representation of 130: 00000000 00000000 00000000 10000010\n2. Discard top 24 bits &rarr; remaining 8 bits: 10000010\n3. In Two's Complement, the MSB is 1 (negative number).\n4. Value = -128 + 2 = -126!\n\nThis explains why casting large numbers into small primitive types creates unexpected negative values."
        },
        {
          type: "text",
          title: "Automatic Type Promotion in Expressions",
          content: "When evaluating expressions, Java automatically promotes operands following strict rules:\n\n1. All `byte`, `short`, and `char` values are promoted to `int` in any arithmetic operation.\n2. If any operand is `long`, the entire expression evaluates to `long`.\n3. If any operand is `float`, the entire expression evaluates to `float`.\n4. If any operand is `double`, the entire expression evaluates to `double`.\n\nExample:\n`byte a = 10; byte b = 20; byte c = a + b;` &rarr; FAILS TO COMPILE!\nWhy? `a + b` evaluates to an `int`. You must write: `byte c = (byte)(a + b);`"
        },
        {
          type: "tryIt",
          title: "Try It: Integer Division vs Floating-Point Casting",
          code: "int totalScore = 15;\nint totalSubjects = 4;\n\ndouble wrongAvg = totalScore / totalSubjects;\ndouble correctAvg = (double) totalScore / totalSubjects;\n\nSystem.out.println(\"Wrong: \" + wrongAvg);\nSystem.out.println(\"Correct: \" + correctAvg);",
          expectedOutput: "Wrong: 3.0\nCorrect: 3.75",
          explanation: "In 'totalScore / totalSubjects', both operands are ints, so Java performs integer division resulting in 3 before assigning to the double (3.0). By casting one operand '(double) totalScore', the division is promoted to double arithmetic (3.75)."
        },
        {
          type: "dryRun",
          title: "Narrowing Cast Execution Trace",
          iterations: [
            { step: 1, variables: { "val (int)": "260", "binary (32-bit)": "...00000001 00000100" }, description: "Value 260 represented in 32-bit binary (256 + 4)." },
            { step: 2, variables: { "cast": "(byte) val", "retained (8-bit)": "00000100" }, description: "Narrowing discards upper 24 bits, retaining only 00000100." },
            { step: 3, variables: { "result (byte)": "4" }, description: "The resulting byte is 4 because 260 % 256 = 4." }
          ]
        },
        {
          type: "warning",
          title: "Common Type Casting Mistakes",
          items: [
            "Performing integer division before casting: 'double result = (double)(a / b);' still truncates decimals because 'a / b' finishes before the cast runs.",
            "Assuming floating point to integer cast rounds to nearest integer: '(int) 9.99' produces 9, not 10 (use Math.round() for rounding).",
            "Casting boolean to int or vice versa: In Java, boolean is completely incompatible with numeric types and cannot be cast.",
            "Silent overflow during multiplication: 'long millis = 1000 * 60 * 60 * 24 * 30;' overflows 32-bit int before being assigned to long (use '1000L' at start).",
            "Downcasting objects without checking 'instanceof', leading to runtime ClassCastException."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Type Casting",
          traps: [
            {
              question: "What does this output: System.out.println((int)(char)(byte) -1);?",
              trap: "Thinking it stays -1 throughout.",
              solution: "Outputs 65535! Step 1: byte -1 is 0xFF. Step 2: casting to char (unsigned 16-bit) causes zero-extension, producing 0x00FF (which is 255) if treated as byte, but byte to char actually sign-extends to int (0xFFFFFFFF) then truncates to 16 bits (0xFFFF = 65535). Step 3: char 65535 cast to int zero-extends to +65535."
            },
            {
              question: "Why does 'short s = 5; s = s + 1;' fail while 's++;' succeeds?",
              trap: "Thinking 's++' is identical to 's = s + 1'.",
              solution: "'s = s + 1' evaluates 's + 1' as an int, which cannot be assigned to short without an explicit cast. The increment operator 's++' and compound operator 's += 1' automatically insert an implicit cast: 's = (short)(s + 1)'."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check: Type Casting",
          question: "What is the value of 'result' after executing: double d = 7.8; int result = (int) d * 2;",
          options: [
            "15",
            "14",
            "15.6",
            "Compile error"
          ],
          answer: 1,
          explanation: "Cast operator '(int)' has higher precedence than multiplication '*'. Therefore, '(int) 7.8' evaluates to 7 first, and then 7 * 2 evaluates to 14."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Widening casting is automatic and safe; Narrowing casting is manual and carries overflow/truncation risks.",
            "Narrowing discards high-order bits in integers and fractional parts in floating-point numbers.",
            "All byte, short, and char values are promoted to 32-bit int in arithmetic operations.",
            "To prevent integer division truncation, cast at least one operand to double or float before division.",
            "Compound assignment operators (+=, -=, *=, /=, ++) include implicit narrowing casts."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Now that you understand primitive conversions, the next topic explores Wrapper Classes & Autoboxing. You will learn how Java bridges the gap between raw primitives and object-oriented programming, enabling primitives to work seamlessly with collections, generics, and null values."
        }
      ]
    }
  },
  {
    slug: "wrapper-classes",
    title: "Wrapper Classes & Autoboxing",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "Before studying wrapper classes, you should understand primitive data types (int, double, boolean), basic object-oriented concepts (objects, heap memory, references), and method calls."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of a primitive like a raw coin in your pocket (fast, compact, no packaging). A wrapper class is like placing that coin inside a velvet presentation box. The box allows the coin to be stored in display cases (Java Collections like ArrayList, HashMap) and given extra labels and helper tools (utility methods), even though it takes up slightly more space."
        },
        {
          type: "callout",
          title: "Why Wrapper Classes Exist",
          content: "Java is an object-oriented language, but primitive types (int, double, etc.) are not objects—they cannot inherit, have methods, or be passed into generic data structures like ArrayList<T>. Wrapper classes provide an object representation for every primitive type."
        },
        {
          type: "table",
          title: "Primitive Types and Their Corresponding Wrapper Classes",
          headers: ["Primitive Type", "Wrapper Class", "Package", "Conversion Method", "Parsed from String"],
          rows: [
            ["byte", "Byte", "java.lang", "byteValue()", "Byte.parseByte(\"127\")"],
            ["short", "Short", "java.lang", "shortValue()", "Short.parseShort(\"32000\")"],
            ["int", "Integer", "java.lang", "intValue()", "Integer.parseInt(\"100\")"],
            ["long", "Long", "java.lang", "longValue()", "Long.parseLong(\"5000000\")"],
            ["float", "Float", "java.lang", "floatValue()", "Float.parseFloat(\"3.14\")"],
            ["double", "Double", "java.lang", "doubleValue()", "Double.parseDouble(\"99.99\")"],
            ["char", "Character", "java.lang", "charValue()", "No parse method (use str.charAt(0))"],
            ["boolean", "Boolean", "java.lang", "booleanValue()", "Boolean.parseBoolean(\"true\")"]
          ]
        },
        {
          type: "text",
          title: "Autoboxing and Unboxing Mechanisms",
          content: "Introduced in Java 5, Autoboxing and Unboxing allow seamless transitions between primitives and wrappers without manual method calls:\n\n• Autoboxing: Automatic conversion of primitive &rarr; Wrapper object\n  `Integer obj = 50;` (Compiler transforms to: `Integer obj = Integer.valueOf(50);`)\n\n• Unboxing: Automatic conversion of Wrapper object &rarr; Primitive\n  `int val = obj;` (Compiler transforms to: `int val = obj.intValue();`)"
        },
        {
          type: "code",
          title: "Autoboxing & Utility Methods in Action",
          code: "import java.util.ArrayList;\n\n// 1. Collections require Wrapper Classes (cannot do ArrayList<int>)\nArrayList<Integer> scores = new ArrayList<>();\nscores.add(95); // Autoboxing: int 95 -> Integer.valueOf(95)\nscores.add(88);\n\n// 2. Unboxing in expressions\nint total = scores.get(0) + scores.get(1); // Unboxed to primitives for addition\n\n// 3. Essential String parsing utility methods\nint parsed = Integer.parseInt(\"456\");\ndouble pi = Double.parseDouble(\"3.14159\");\nboolean flag = Boolean.parseBoolean(\"true\");\n\n// 4. Base conversions and constants\nString binaryStr = Integer.toBinaryString(42); // \"101010\"\nint maxPossibleInt = Integer.MAX_VALUE; // 2,147,483,647\n\n// 5. Character utility checks\nboolean isDigit = Character.isDigit('7'); // true\nboolean isLetter = Character.isLetter('$'); // false",
          language: "java",
          explanation: "Wrapper classes provide extensive static utility methods for conversions, radix formatting, bit manipulation, and parsing."
        },
        {
          type: "text",
          title: "The Integer Cache: A Crucial Interview Topic",
          content: "To optimize memory and performance, the JVM maintains an internal cache of Integer objects for values in the range of -128 to +127 (inclusive).\n\nWhen you autobox using `Integer.valueOf(x)`:\n• If `x` is between -128 and 127, Java returns a pre-existing cached instance.\n• If `x` is outside this range, Java creates a new heap object.\n\nConsequence:\n`Integer a = 100; Integer b = 100;` &rarr; `a == b` is TRUE (same cached reference)\n`Integer x = 200; Integer y = 200;` &rarr; `x == y` is FALSE (distinct heap objects)!\n\nRule: ALWAYS use `.equals()` to compare wrapper objects, NEVER `==`!"
        },
        {
          type: "tryIt",
          title: "Try It: Integer Cache Comparison",
          code: "Integer a = 120;\nInteger b = 120;\nInteger c = 300;\nInteger d = 300;\n\nSystem.out.println((a == b) + \" \" + (c == d) + \" \" + c.equals(d));",
          expectedOutput: "true false true",
          explanation: "120 is within the -128 to 127 cache range so 'a == b' checks identical object references (true). 300 is outside the cache, creating two different heap objects so 'c == d' is false. 'c.equals(d)' compares primitive values and returns true."
        },
        {
          type: "dryRun",
          title: "Autoboxing in Loops Performance Overhead",
          iterations: [
            { step: 1, variables: { "sum (Long obj)": "0L", "i": "0" }, description: "Declare wrapper 'Long sum = 0L;' on heap." },
            { step: 2, variables: { "unboxed": "0L + 1L", "new obj": "Long(1L)" }, description: "In loop: sum is unboxed to primitive, 1 is added, new Long(1) object is allocated on heap." },
            { step: 3, variables: { "unboxed": "1L + 2L", "new obj": "Long(3L)" }, description: "Next iteration allocates another new Long(3) object, discarding the old one for garbage collection." },
            { step: 4, variables: { "impact": "Millions of objects created" }, description: "Using wrapper types in large loops causes severe GC pressure and slowdown compared to primitive 'long sum = 0L;'." }
          ]
        },
        {
          type: "warning",
          title: "Common Wrapper Class Pitfalls",
          items: [
            "NullPointerException during unboxing: Calling methods or evaluating arithmetic on a null wrapper variable (e.g. 'Integer count = null; if (count > 0)...') throws a runtime NullPointerException.",
            "Comparing wrapper objects with '==' instead of '.equals()': Leads to intermittent bugs that only trigger when numbers exceed 127.",
            "Using wrappers for intensive calculations: Autoboxing in tight loops creates millions of short-lived objects, degrading application performance.",
            "Assuming Wrapper objects are mutable: All Java wrapper classes (Integer, Double, etc.) are strictly immutable once constructed."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Wrapper Classes",
          traps: [
            {
              question: "What happens when executing: Integer num = null; int val = num;?",
              trap: "Thinking 'val' gets default value 0.",
              solution: "Throws NullPointerException at runtime! The compiler inserts 'num.intValue()' for unboxing, which attempts to invoke a method on a null reference."
            },
            {
              question: "Can the Integer Cache range be configured in the JVM?",
              trap: "Thinking -128 to 127 is hardcoded permanently.",
              solution: "The lower bound is fixed at -128, but the upper bound can be adjusted at JVM startup using the VM argument: '-XX:AutoBoxCacheMax=<size>'."
            },
            {
              question: "What is the memory footprint difference between an 'int' and an 'Integer'?",
              trap: "Saying they both take 4 bytes.",
              solution: "A primitive 'int' takes exactly 4 bytes on the stack. An 'Integer' object on a 64-bit JVM with compressed OOPs takes 16 bytes on the heap (12 bytes object header + 4 bytes int value) plus an 8-byte reference pointer on the stack, consuming up to 24 bytes in total (6x more memory!)."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check: Wrapper Classes",
          question: "Which of the following lines will throw a NullPointerException at runtime?",
          options: [
            "Integer x = Integer.valueOf(\"100\");",
            "Boolean b = Boolean.valueOf(null);",
            "Integer val = null; int result = val + 5;",
            "String str = String.valueOf((Object) null);"
          ],
          answer: 2,
          explanation: "In option C, 'val + 5' triggers automatic unboxing by calling 'val.intValue()'. Because 'val' is null, it immediately throws a NullPointerException."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Wrapper classes provide object representations and extensive utility methods for primitive types.",
            "Autoboxing and unboxing automate conversion between primitives and wrappers.",
            "Integer Cache caches instances from -128 to 127. Always use .equals() for comparing wrapper objects.",
            "Unboxing a null wrapper variable throws a NullPointerException.",
            "All wrapper classes are immutable; use primitives in high-throughput math loops for performance."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Module",
          content: "Congratulations! You have completed Module 2: Variables & Data Types. You now have an in-depth understanding of memory storage, primitives, casting, and wrapper classes. In Module 3: Operators & Expressions, you will learn how to combine variables and literals with arithmetic, relational, logical, and bitwise operators to compute dynamic results."
        }
      ]
    }
  }
];

export const programmingFundamentalsLessons = [
  ...programmingBasicsLessons,
  ...variablesDataTypesLessons
];