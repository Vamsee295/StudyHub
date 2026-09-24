import { Course } from './types';
import { programmingBasicsLessons, variablesDataTypesLessons } from './programming-fundamentals-content';
import { operatorsExpressionsLessons } from './programming-fundamentals-content-operators';
import { inputOutputLessons } from './programming-fundamentals-content-io';
import { controlFlowLessons } from './programming-fundamentals-content-control';
import { loopsPatternLessons } from './programming-fundamentals-content-loops';
import { arraysLessons } from './programming-fundamentals-content-arrays';
import { stringsLessons } from './programming-fundamentals-content-strings';
import { methodsFunctionsLessons } from './programming-fundamentals-content-methods';
import { recursionLessons } from './programming-fundamentals-content-recursion';

export const programmingFundamentalsCourse: Course = {
  id: "course-pf",
  slug: "programming-fundamentals",
  title: "Programming Fundamentals",
  description: "Master the building blocks of programming. Learn syntax, variables, control flow, loops, and basic algorithmic thinking.",
  category: "Technical",
  icon: "Code2",
  displayOrder: 1,
  modules: [
    {
      id: "pf-mod-1",
      slug: "programming-basics",
      title: "Programming Basics",
      description: "Understand the foundational concepts of programming languages, compilation, and basic data storage.",
      difficulty: "Beginner",
      estimatedMinutes: 90,
      lessons: programmingBasicsLessons.map(lesson => ({
        id: `pf-${lesson.slug}`,
        slug: lesson.slug,
        title: lesson.title,
        description: lesson.content.definition || '',
        estimatedMinutes: 15,
        content: lesson.content
      }))
    },
    {
      id: "pf-mod-2",
      slug: "variables-and-data-types",
      title: "Variables & Data Types",
      description: "Learn how to store and manage data using variables and primitive types.",
      difficulty: "Beginner",
      estimatedMinutes: 150,
      lessons: variablesDataTypesLessons.map(lesson => ({
        id: `pf-${lesson.slug}`,
        slug: lesson.slug,
        title: lesson.title,
        description: lesson.content.definition || '',
        estimatedMinutes: 15,
        content: lesson.content
      }))
    },
    {
      id: "pf-mod-3",
      slug: "operators",
      title: "Operators",
      description: "Master arithmetic, relational, and logical operators.",
      difficulty: "Beginner",
      estimatedMinutes: 120,
      lessons: operatorsExpressionsLessons.map(lesson => ({
        id: `pf-${lesson.slug}`,
        slug: lesson.slug,
        title: lesson.title,
        description: lesson.content.definition || '',
        estimatedMinutes: 15,
        content: lesson.content
      }))
    },
    {
      id: "pf-mod-4",
      slug: "input-and-output",
      title: "Input & Output",
      description: "Learn how to read data from the user and format output.",
      difficulty: "Beginner",
      estimatedMinutes: 75,
      lessons: inputOutputLessons.map(lesson => ({
        id: `pf-${lesson.slug}`,
        slug: lesson.slug,
        title: lesson.title,
        description: lesson.content.definition || '',
        estimatedMinutes: 15,
        content: lesson.content
      }))
    },
    {
      id: "pf-mod-5",
      slug: "control-flow",
      title: "Control Flow",
      description: "Control program execution using conditionals and loops.",
      difficulty: "Intermediate",
      estimatedMinutes: 150,
      lessons: controlFlowLessons.map(lesson => ({
        id: `pf-${lesson.slug}`,
        slug: lesson.slug,
        title: lesson.title,
        description: lesson.content.definition || '',
        estimatedMinutes: 15,
        content: lesson.content
      }))
    },
    {
      id: "pf-mod-6",
      slug: "arrays",
      title: "Arrays",
      description: "Store and manipulate collections of data using arrays.",
      difficulty: "Intermediate",
      estimatedMinutes: 105,
      lessons: arraysLessons.map(lesson => ({
        id: `pf-${lesson.slug}`,
        slug: lesson.slug,
        title: lesson.title,
        description: lesson.content.definition || '',
        estimatedMinutes: 15,
        content: lesson.content
      }))
    },
    {
      id: "pf-mod-7",
      slug: "strings",
      title: "Strings",
      description: "Process and manipulate text data effectively.",
      difficulty: "Intermediate",
      estimatedMinutes: 105,
      lessons: stringsLessons.map(lesson => ({
        id: `pf-${lesson.slug}`,
        slug: lesson.slug,
        title: lesson.title,
        description: lesson.content.definition || '',
        estimatedMinutes: 15,
        content: lesson.content
      }))
    },
    {
      id: "pf-mod-8",
      slug: "methods",
      title: "Methods",
      description: "Organize code into reusable functions with parameters and return values.",
      difficulty: "Intermediate",
      estimatedMinutes: 105,
      lessons: methodsFunctionsLessons.map(lesson => ({
        id: `pf-${lesson.slug}`,
        slug: lesson.slug,
        title: lesson.title,
        description: lesson.content.definition || '',
        estimatedMinutes: 15,
        content: lesson.content
      }))
    },
    {
      id: "pf-mod-9",
      slug: "memory-and-execution",
      title: "Memory & Execution",
      description: "Understand the stack, heap, and how Java executes your code.",
      difficulty: "Advanced",
      estimatedMinutes: 90,
      lessons: [
        {
          id: "pf-memory-execution-1",
          slug: "memory-execution-overview",
          title: "Memory & Execution Overview",
          description: "Understanding how Java manages memory and executes code.",
          estimatedMinutes: 15,
          content: {
            definition: "Memory & Execution in Java refers to how the JVM manages memory allocation (stack vs heap) and executes bytecode through interpretation and JIT compilation.",
            whyItMatters: "Understanding Java's memory model helps you write more efficient code, avoid memory leaks, and understand performance characteristics.",
            coreConcept: "Java divides memory into stack (for method calls and local variables) and heap (for objects and arrays). Execution involves interpreting bytecode or JIT compiling to native machine code.",
            syntax: "// Conceptual - JVM memory model",
            javaExample: "// Conceptual - no specific code example",
            howItWorks: "1. Class Loading: JVM loads .class files\n2. Memory Allocation: Stack for frames, heap for objects\n3. Execution: Interpreter processes bytecode\n4. JIT Compilation: Hot spots compiled to native code\n5. Garbage Collection: Automatic memory reclamation",
            realWorldUse: "Every Java application relies on the JVM's memory management and execution model.",
            commonMistakes: [
              "Confusing stack and heap memory usage",
              "Believing Java has manual memory management like C++",
              "Not understanding what makes objects eligible for garbage collection",
              "Assuming all Java code runs at the same speed"
            ],
            interviewQuestions: [
              { question: "What is the difference between stack and heap memory in Java?", answer: "Stack memory stores primitive variables and object references (method call frames), while heap memory stores actual objects and arrays." },
              { question: "When is an object eligible for garbage collection in Java?", answer: "An object is eligible for garbage collection when no live thread can access it, i.e., when there are no more references to it." }
            ],
            quickRevision: "Stack = method frames & primitives; Heap = objects & arrays. JVM executes via interpretation/JIT compilation.",
            practicePrompt: "Draw a diagram showing stack and heap memory usage for a simple Java program with method calls and object creation.",
            quickCheck: {
              question: "Where are local variables stored in Java?",
              options: ["Heap memory", "Stack memory", "CPU registers", "Disk storage"],
              answer: 1,
              explanation: "Local variables (primitives and object references) are stored in stack memory, which is used for method call frames."
            }
          }
        },
        {
          id: "pf-memory-execution-2",
          slug: "stack-memory",
          title: "Stack Memory",
          description: "How Java uses stack memory for method execution and local variables.",
          estimatedMinutes: 15,
          content: {
            definition: "Stack memory in Java is used for storing method call frames, which include local variables, parameters, return addresses, and temporary calculations during method execution.",
            whyItMatters: "Understanding stack memory helps you grasp method invocation, recursion limits, and variable scope in Java programs.",
            coreConcept: "Each method call creates a new stack frame. The stack operates in LIFO (Last In, First Out) order. Primitive variables and object references are stored here.",
            syntax: "// Conceptual - stack frame illustration",
            javaExample: "void methodA() {\n    int x = 1; // stored in stack\n    methodB();\n}\n\nvoid methodB() {\n    int y = 2; // stored in stack\n    // methodA's x is still in stack below this frame\n}",
            howItWorks: "1. Method Call: New stack frame created\n2. Local Variables: Allocated in the frame\n3. Execution: Statements execute using frame values\n4. Method Return: Frame popped, value returned\n5. Caller Resumes: Previous frame becomes active",
            realWorldUse: "Stack memory is used in every Java program for method execution, enabling features like recursion, nested method calls, and local variable scoping.",
            commonMistakes: [
              "Thinking objects are stored in the stack (only references are)",
              "Believing stack size is unlimited (it can overflow with deep recursion)",
              "Confusing stack allocation with heap allocation",
              "Not understanding that stack frames are destroyed when methods return"
            ],
            interviewQuestions: [
              { question: "What causes a StackOverflowError in Java?", answer: "A StackOverflowError occurs when the stack memory is exhausted, typically due to too-deep recursion or excessively large stack frames." },
              { question: "Are primitive variables stored on the stack or heap?", answer: "Primitive variables (int, boolean, etc.) are stored directly on the stack as part of stack frames." }
            ],
            quickRevision: "Stack = LIFO memory for method frames. Stores primitives, references, and execution state.",
            practicePrompt: "Trace through the stack frames for a recursive factorial method call with n=3.",
            quickCheck: {
              question: "What happens to a stack frame when a method returns?",
              options: [
                "It remains in memory for future use",
                "It is moved to the heap",
                "It is popped off the stack and destroyed",
                "It is cached for performance"
              ],
              answer: 2,
              explanation: "When a method returns, its stack frame is popped off the stack and the memory becomes available for future stack frames."
            }
          }
        },
        {
          id: "pf-memory-execution-3",
          slug: "heap-memory",
          title: "Heap Memory",
          description: "How Java uses heap memory for object and array storage.",
          estimatedMinutes: 15,
          content: {
            definition: "Heap memory in Java is used for dynamic allocation of objects and arrays. Unlike stack memory, heap memory is managed automatically by the garbage collector.",
            whyItMatters: "Understanding heap memory is crucial for working with objects, understanding memory usage, and avoiding memory leaks in Java applications.",
            coreConcept: "Objects and arrays are allocated on the heap. References to these objects are stored on the stack. The garbage collector automatically reclaims memory from unreachable objects.",
            syntax: "// Conceptual - object creation\nObject obj = new Object();",
            javaExample: "String name = \"Vamsee\"; // \"Vamsee\" object on heap\nint[] numbers = new int[5]; // array on heap\nObject obj = new Object(); // object on heap",
            howItWorks: "1. Object Creation: 'new' allocates memory on heap\n2. Reference Storage: Reference value stored on stack\n3. Usage: Access object via reference\n4. Garbage Collection: Unreferenced objects reclaimed\n5. Memory Compaction: Optional optimization",
            realWorldUse: "Every object created with 'new' in Java resides on heap memory, including Strings, arrays, collections, and custom class instances.",
            commonMistakes: [
              "Believing objects are stored on the stack",
              "Thinking you need to manually free objects in Java",
              "Not understanding that only unreachable objects are garbage collected",
              "Confusing reference values with object storage location"
            ],
            interviewQuestions: [
              { question: "Where are String objects stored in Java?", answer: "String objects are stored on heap memory. The reference to the String object is stored on the stack (if local) or in another object's field (if instance variable)." },
              { question: "What makes an object eligible for garbage collection in Java?", answer: "An object is eligible for garbage collection when no live thread can access it, meaning there are no references to it from any active part of the application." }
            ],
            quickRevision: "Heap = dynamic memory for objects & arrays. Managed by garbage collector. Accessed via references.",
            practicePrompt: "Create a diagram showing stack and heap memory for: String s = \"test\"; int[] arr = new int[3]; Object o = new Object();",
            quickCheck: {
              question: "Which of the following is stored on the heap in Java?",
              options: [
                "int primitive variable",
                "boolean primitive variable",
                "String object",
                "method return address"
              ],
              answer: 2,
              explanation: "Objects (including String objects) are stored on heap memory. Primitive variables and method call information are stored on the stack."
            }
          }
        },
        {
          id: "pf-memory-execution-4",
          slug: "garbage-collection",
          title: "Garbage Collection",
          description: "How Java automatically manages memory through garbage collection.",
          estimatedMinutes: 15,
          content: {
            definition: "Garbage Collection (GC) in Java is the automatic process of identifying and reclaiming memory occupied by objects that are no longer reachable by the application.",
            whyItMatters: "Understanding garbage collection helps you write memory-efficient code, diagnose memory-related issues, and understand JVM performance characteristics.",
            coreConcept: "The garbage collector runs periodically to find objects that cannot be reached from any live thread (called 'garbage') and reclaims their memory. This happens automatically without programmer intervention.",
            syntax: "// Conceptual - no explicit GC call\n// System.gc() is a hint, not a guarantee",
            javaExample: "// Objects become eligible for GC when unreferenced\nString s = new String(\"hello\");\ns = null; // Now eligible for GC\n// or\nString s = new String(\"hello\");\n{ String s2 = new String(\"world\"); } // s2 eligible after block",
            howItWorks: "1. Object Allocation: Memory allocated on heap\n2. Reference Tracking: JVM tracks references from roots\n3. Reachability Analysis: Find unreachable objects\n4. Memory Reclamation: Free memory from dead objects\n5. Optional Compaction: Defragment heap memory",
            realWorldUse: "Garbage collection enables Java's automatic memory management, reducing bugs and simplifying development compared to manual memory management languages.",
            commonMistakes: [
              "Believing you should call System.gc() frequently",
              "Thinking garbage collection happens immediately when objects become unreferenced",
              "Not understanding that GC pauses can affect application performance",
              "Confusing garbage collection with destructors or finalizers"
            ],
            interviewQuestions: [
              { question: "Can you force garbage collection to run in Java?", answer: "You can suggest garbage collection with System.gc(), but you cannot force it to run immediately. The JVM decides when to run GC based on heap usage and other factors." },
              { question: "What is the difference between garbage collection and finalization?", answer: "Garbage collection reclaims memory from unreachable objects. Finalization (via finalize() method) is a deprecated mechanism for running cleanup code before an object is garbage collected." }
            ],
            quickRevision: "GC = automatic memory reclamation for unreachable objects. Runs periodically, not on demand.",
            practicePrompt: "Explain why calling System.gc() in a loop is generally a bad idea for performance.",
            quickCheck: {
              question: "When does an object become eligible for garbage collection in Java?",
              options: [
                "When its finalize() method is called",
                "When the program exits",
                "When no references to it exist from any live thread",
                "When you call System.gc()"
              ],
              answer: 2,
              explanation: "An object becomes eligible for garbage collection when it is no longer reachable from any live thread in the application, meaning no references to it exist."
            }
          }
        },
        {
          id: "pf-memory-execution-5",
          slug: "jit-compilation",
          title: "JIT Compilation",
          description: "How the JVM improves performance through Just-In-Time compilation.",
          estimatedMinutes: 15,
          content: {
            definition: "Just-In-Time (JIT) compilation is a feature of the JVM that compiles frequently executed bytecode sequences into native machine code at runtime, improving performance over pure interpretation.",
            whyItMatters: "Understanding JIT compilation helps explain why Java applications often speed up over time and how the JVM achieves performance close to native languages.",
            coreConcept: "The JVM starts by interpreting bytecode. As it identifies 'hot spots' (frequently executed code), it compiles them to native machine code for faster subsequent execution.",
            syntax: "// Conceptual - bytecode to native compilation",
            javaExample: "// Conceptual - no specific syntax, happens transparently",
            howItWorks: "1. Interpretation: Initial execution via bytecode interpreter\n2. Profiling: JVM identifies frequently executed code paths\n3. Compilation: Hot spots compiled to native machine code\n4. Execution: Native code runs directly on CPU\n5. Optimization: Recompilation with optimizations based on runtime data",
            realWorldUse: "JIT compilation is why long-running Java applications (like servers) often perform better after a warm-up period, approaching or matching native C/C++ performance in many scenarios.",
            commonMistakes: [
              "Believing JIT compilation happens before program execution",
              "Thinking all Java code gets compiled to native code immediately",
              "Not understanding that JIT compilation is adaptive and based on actual usage",
              "Confusing JIT with ahead-of-time compilation"
            ],
            interviewQuestions: [
              { question: "What is the difference between interpretation and JIT compilation in the JVM?", answer: "Interpretation executes bytecode directly (slower but immediate). JIT compilation translates bytecode to native machine code (faster after warm-up) for frequently executed code." },
              { question: "Why does a Java application often run faster after it has been running for a while?", answer: "Due to JIT compilation: the JVM identifies frequently executed code ('hot spots') and compiles them to optimized native machine code for better performance." }
            ],
            quickRevision: "JIT = runtime compilation of bytecode to native code for performance. Adaptive based on actual usage.",
            practicePrompt: "Explain why a Java web server might handle requests faster after serving traffic for several minutes compared to when it first started.",
            quickCheck: {
              question: "What does the JVM compile to native machine code in JIT compilation?",
              options: [
                "Java source code (.java files)",
                "Bytecode (.class files)",
                "Memory addresses",
                "Operating system calls"
              ],
              answer: 1,
              explanation: "The JVM's JIT compiler compiles bytecode (from .class files) to native machine code for frequently executed code paths."
            }
          }
        },
        {
          id: "pf-memory-execution-6",
          slug: "execution-engine",
          title: "Execution Engine",
          description: "How the JVM executes Java bytecode through interpreter and JIT compiler.",
          estimatedMinutes: 15,
          content: {
            definition: "The Execution Engine in the JVM is responsible for executing Java bytecode. It includes the interpreter for initial execution and the JIT compiler for performance optimization of frequently used code.",
            whyItMatters: "Understanding the execution engine helps you grasp how Java achieves platform independence while maintaining good performance through adaptive optimization.",
            coreConcept: "The execution engine combines interpretation (for portability and quick startup) with JIT compilation (for long-term performance). It adapts based on how code is actually used during execution.",
            syntax: "// Conceptual - JVM execution engine components",
            javaExample: "// Conceptual - no specific code, describes JVM internals",
            howItWorks: "1. Bytecode Loading: Load .class files into memory\n2. Interpretation: Execute bytecode via interpreter (initial execution)\n3. Profiling: Track method invocation and loop back-edge counts\n4. Compilation: JIT compile hot spots to native code\n5. Execution: Run native code or interpreted code\n6. Deoptimization: Rarely, revert optimizations if assumptions violated",
            realWorldUse: "Every Java application relies on the JVM's execution engine to run bytecode consistently across different hardware and operating systems.",
            commonMistakes: [
              "Thinking the JVM only interprets or only compiles",
              "Believing Java execution speed is constant over time",
              "Not understanding that the execution engine adapts to actual usage patterns",
              "Confusing the execution engine with the garbage collector"
            ],
            interviewQuestions: [
              { question: "What are the two main components of the JVM's execution engine?", answer: "The two main components are the interpreter (for executing bytecode) and the JIT compiler (for compiling frequently executed bytecode to native machine code)." },
              { question: "Why does Java use both interpretation and JIT compilation instead of just one approach?", answer: "Java uses both to get the benefits of each: interpretation provides immediate execution and portability, while JIT compilation provides improved performance for frequently executed code after warm-up." }
            ],
            quickRevision: "Execution Engine = Interpreter + JIT Compiler. Balances startup speed with long-term performance.",
            practicePrompt: "Draw a diagram showing how the JVM execution engine handles a method that gets called repeatedly over time.",
            quickCheck: {
              question: "What happens the first time a method is called in the JVM?",
              options: [
                "It is immediately compiled to native code",
                "It is interpreted bytecode",
                "It is compiled to machine code and cached",
                "It is skipped until called multiple times"
              ],
              answer: 1,
              explanation: "The first time a method is called, the JVM executes it by interpreting its bytecode. Only if it becomes frequently executed (a 'hot spot') will the JIT compiler compile it to native code for better performance."
            }
          }
        }
      ]
    },
    {
      id: "pf-mod-10",
      slug: "problem-solving",
      title: "Problem Solving",
      description: "Apply your knowledge to solve classic programming challenges.",
      difficulty: "Advanced",
      estimatedMinutes: 135,
      lessons: recursionLessons.map(lesson => ({
        id: `pf-${lesson.slug}`,
        slug: lesson.slug,
        title: lesson.title,
        description: lesson.content.definition || '',
        estimatedMinutes: 15,
        content: lesson.content
      }))
    }
  ]
};