// Long-form theory for Programming Fundamentals modules 1-2: programming basics, variables and data types. Original writing.
import { LessonTheory } from './utils';

const JAVA_GETTING_STARTED = { title: "The Java Tutorials: Getting Started", url: "https://docs.oracle.com/javase/tutorial/getStarted/index.html" };
const NUTS = { title: "The Java Tutorials: Language Basics", url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/index.html" };
const VARIABLES = { title: "The Java Tutorials: Variables", url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/variables.html" };
const PRIMITIVES = { title: "The Java Tutorials: Primitive Data Types", url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html" };
const BOXING = { title: "The Java Tutorials: Autoboxing and Unboxing", url: "https://docs.oracle.com/javase/tutorial/java/data/autoboxing.html" };
const JLS = { title: "The Java Language Specification", url: "https://docs.oracle.com/javase/specs/" };
const JLS_CONVERSIONS = { title: "JLS Chapter 5: Conversions and Contexts", url: "https://docs.oracle.com/javase/specs/jls/se21/html/jls-5.html" };
const JVM_SPEC = { title: "The Java Virtual Machine Specification", url: "https://docs.oracle.com/javase/specs/jvms/se21/html/index.html" };
const WIKI_PL = { title: "Wikipedia: Programming language", url: "https://en.wikipedia.org/wiki/Programming_language" };
const WIKI_COMPILER = { title: "Wikipedia: Compiler", url: "https://en.wikipedia.org/wiki/Compiler" };
const CS50 = { title: "Harvard CS50: Introduction to Computer Science (free course)", url: "https://cs50.harvard.edu/x/" };

export const pfBasicsTheory: Record<string, LessonTheory> = {
  "what-is-programming": {
    theory: `Programming is the act of writing precise instructions that a computer can carry out. A computer has no judgement or intuition: it executes exactly what it's told, step by step, billions of times per second. The skill of programming is turning a fuzzy human goal, such as "find the cheapest flight", into an unambiguous sequence of steps. This lesson explains what a program is, how computers execute instructions, what programmers do day to day, and how to start thinking like a programmer.

## What a program is

A **program** is a set of instructions, written in a programming language, that tells a computer how to transform inputs into outputs. A calculator app reads two numbers and an operation, computes, and shows a result. A web browser reads HTML from the network and draws a page. Every program, however large, follows this pattern:

1. **Input**: data comes in from a keyboard, a file, a network, a sensor
2. **Processing**: the program computes, decides and repeats
3. **Output**: results go to the screen, a file, the network, a motor

## Algorithms come first

An **algorithm** is a finite, well-defined sequence of steps that solves a problem. It exists independently of any programming language. A recipe is an everyday algorithm. "Find the largest number in a list" has a clear algorithm:

1. Assume the first number is the largest so far
2. Look at each remaining number
3. If it's larger than the largest so far, remember it instead
4. After checking all numbers, the remembered one is the largest

A program is an algorithm written in a language a computer can execute. Most of the hard thinking in programming is designing the algorithm; typing the code comes after.

## Properties of a good algorithm

- **Finite**: it must finish after a limited number of steps
- **Definite**: each step is precise, with no room for interpretation
- **Input and output**: it takes zero or more inputs and produces at least one output
- **Effective**: each step is basic enough to be carried out
- **Correct**: it gives the right answer for every valid input, including edge cases such as an empty list

## How a computer runs a program

At the hardware level, the **CPU** repeats a cycle: fetch the next instruction from memory, decode what it means, execute it, and move on. Instructions are tiny: add two numbers, copy a value, compare, jump to another instruction. **Memory (RAM)** holds the program and its data while it runs; **storage** such as an SSD keeps them when the power is off. Everything a program does, from rendering video to training AI models, is built from these small steps.

## A first Java program

~~~java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, world!");
    }
}
~~~

Even this short program shows structure: a class named Hello, a \`main\` method where execution starts, and one statement that prints text. You'll learn what each word means over the next modules.

## What programmers do

Writing new code is only part of the job. Programmers:

- **understand requirements**: work out which problem needs solving, by asking questions
- **design**: choose data structures and algorithms
- **implement**: write the code
- **test**: check behaviour against expected results, including unusual inputs
- **debug**: find and fix the cause when behaviour is wrong
- **read and maintain** existing code, which takes more time than writing new code in most jobs

## Thinking like a programmer

The core habits are:

- **decomposition**: break a big problem into smaller ones you can solve one at a time
- **pattern recognition**: notice when a problem resembles one you've solved before
- **abstraction**: ignore details that don't matter for the current step
- **precision**: computers punish ambiguity, so define exactly what each step does

A useful practice is writing the steps in plain language, called **pseudocode**, before writing real code. If you can't explain the steps in words, the code won't work either.

## Bugs are normal

A **bug** is a mistake that makes a program behave incorrectly. Every programmer writes bugs. Errors come in three broad kinds: **syntax errors** (the code breaks the language's grammar), **runtime errors** (the program crashes while running, such as dividing by zero) and **logic errors** (the program runs but gives wrong answers). Learning to read error messages and trace code calmly is a core skill, not a sign of failure.

## How interviewers test this

Expect "What is an algorithm?", "What's the difference between an algorithm and a program?" and warm-up problems where you must explain steps before coding. Define algorithms by their properties, describe input, processing and output, and show the habit of writing steps in plain language and checking edge cases.`,
    sources: [CS50, JAVA_GETTING_STARTED],
  },

  "programming-languages": {
    theory: `A programming language is a formal language for writing instructions that can be translated into something a computer executes. Hundreds exist, each designed with different goals: speed, safety, ease of learning, or fitness for a particular domain. Knowing how languages differ helps you choose tools and pick up new languages quickly. This lesson covers what defines a language, the major paradigms, typing disciplines, and where popular languages are used.

## What defines a language

Every programming language specifies:

- **syntax**: the rules for how valid code looks, such as where semicolons and braces go
- **semantics**: what each valid construct means when it runs
- **a type system**: how values are classified and which operations are allowed on them
- **a standard library**: ready-made code for common tasks such as collections, files and networking
- **an implementation**: a compiler, interpreter or virtual machine that makes code run

## Why so many languages exist

Different problems reward different trade-offs:

| Goal | Typical choice | Why |
|---|---|---|
| Operating systems, games, embedded devices | C, C++, Rust | Direct control of memory and hardware, high speed |
| Large business systems, Android | Java, Kotlin, C# | Safety, large ecosystems, strong tooling |
| Data science, scripting, AI | Python | Readable syntax, huge scientific libraries |
| Web front ends | JavaScript, TypeScript | They run natively in every browser |
| Databases | SQL | Declarative queries over tables |
| iOS and macOS apps | Swift | Apple's platform language |

No language is best at everything. Professional developers commonly use three or four regularly.

## Paradigms

A **paradigm** is a style of organizing programs:

- **Imperative / procedural**: a sequence of statements that change program state, organized into procedures. C is the classic example
- **Object-oriented**: programs are built from objects that bundle data and behaviour. Java and C# are designed around this
- **Functional**: programs are compositions of functions without changing state, favouring immutable data. Haskell is pure functional; Java, Python and JavaScript borrow functional features such as lambdas
- **Declarative**: you describe what result you want, not how to compute it. SQL and HTML are declarative

Most modern languages are **multi-paradigm**. Java is primarily object-oriented but supports functional style with lambdas and streams.

## Static versus dynamic typing

- **Statically typed** languages check types at compile time. In Java, \`int count = "hello";\` is rejected before the program runs. Java, C, C++, Rust, Go and TypeScript are static
- **Dynamically typed** languages check types while running. In Python, a variable can hold a number and later a string, and type errors appear only when that line runs. Python, JavaScript and Ruby are dynamic

Static typing catches many mistakes early and helps tools offer accurate autocomplete. Dynamic typing allows quicker experimentation with less ceremony. Large codebases increasingly favour static types, which is one reason TypeScript and Python type hints became popular.

## Strong versus weak typing

Separately from static and dynamic, languages differ in how strictly they treat type mismatches. Java won't silently treat a string as a number. JavaScript will: \`"5" * 2\` evaluates to 10, and \`"5" + 2\` evaluates to "52". These implicit conversions are convenient but cause surprising bugs.

## Memory management

Languages handle memory in different ways:

- **manual**: C and C++ programmers allocate and free memory themselves, which is fast but error-prone
- **garbage collected**: Java, Python, C# and Go reclaim unused memory automatically
- **ownership-based**: Rust checks memory safety at compile time without a garbage collector

## Why this course uses Java

Java is widely used in placement interviews and enterprise development. It's statically typed, so the compiler explains many mistakes early; it's object-oriented, which prepares you for design interviews; and its runtime, the JVM, teaches concepts such as compilation to bytecode and garbage collection that transfer to other languages.

## Learning your next language

Once you know one language well, others come faster, because concepts transfer: variables, conditions, loops, functions, collections and recursion exist everywhere. When learning a new language, focus on what's different: its type system, memory model, error handling and idioms.

## How interviewers test this

Expect "What's the difference between statically and dynamically typed languages?", "Name some paradigms" and "Why is Java platform independent?" Give examples for each typing discipline, describe paradigms with a language for each, and explain that languages trade off control, safety and convenience.`,
    sources: [WIKI_PL, JAVA_GETTING_STARTED],
  },

  "high-level-vs-low-level-languages": {
    theory: `Programming languages sit on a spectrum from low level, close to the hardware, to high level, close to human thinking. Low-level languages give precise control and speed at the cost of effort and safety; high-level languages trade some control for productivity and portability. Understanding this spectrum explains why some software is written in C or assembly while most business software uses Java or Python. This lesson walks through each level and the trade-offs between them.

## Machine code

At the bottom is **machine code**: binary instructions the CPU executes directly, such as \`10110000 01100001\`. Each CPU family (x86-64, ARM) has its own instruction set, so machine code for one won't run on another. Nobody writes it by hand today, but every program eventually becomes machine code before the CPU runs it.

## Assembly language

**Assembly** replaces binary with readable mnemonics, one instruction per line:

~~~
mov eax, 5      ; put 5 in register eax
add eax, 3      ; add 3 to it
~~~

An **assembler** translates it into machine code almost one-to-one. Assembly gives complete control over registers and memory, but it's tied to one CPU architecture, and even small tasks take many lines. It's used today in small parts of operating systems, device drivers, performance-critical routines and reverse engineering.

## Middle-level languages

**C** is often called middle level. It has high-level constructs such as functions, loops and structures, but also exposes memory directly through pointers:

~~~c
int *p = malloc(sizeof(int));
*p = 42;
free(p);
~~~

C compiles to efficient machine code and is portable across CPUs with recompilation. Operating systems (Linux, Windows kernels), databases and embedded firmware rely heavily on C and C++.

## High-level languages

**High-level languages** such as Java, Python and JavaScript hide hardware details:

~~~java
List<Integer> numbers = new ArrayList<>();
numbers.add(42);
~~~

You don't manage registers or free memory; the language runtime does. Features like objects, collections, exceptions and garbage collection let you think about the problem instead of the machine.

## Comparing the levels

| | Low level (assembly, C) | High level (Java, Python) |
|---|---|---|
| Closeness to hardware | High: registers, memory addresses | Low: abstractions hide hardware |
| Execution speed | Fastest, with careful code | Fast to moderate; runtimes optimize heavily |
| Development speed | Slow, verbose | Fast, concise |
| Portability | Assembly: none; C: recompile per platform | High: Java bytecode runs on any JVM |
| Memory safety | Programmer's responsibility; bugs cause crashes and security holes | Managed by the runtime; whole classes of bugs eliminated |
| Typical uses | OS kernels, drivers, embedded, game engines | Business apps, web, data science, Android |

## The cost of control

Low-level control brings risk. Buffer overflows, use-after-free and memory leaks in C and C++ have caused a large share of serious security vulnerabilities in widely used software. That's why newer systems languages such as Rust aim for C-like speed with compile-time memory safety, and why high-level languages dominate application development.

## The performance gap has narrowed

High-level doesn't automatically mean slow. Java's JIT compiler turns frequently executed bytecode into optimized machine code at runtime, sometimes using information a static compiler doesn't have. For most applications, the bottleneck is network calls, databases or algorithm choice, not the language. Choosing an O(n log n) algorithm over an O(n²) one matters far more than switching languages.

## Abstraction layers

Each level builds on the one below: Java code runs on the JVM, which is written largely in C++, which compiles to machine code that runs on the CPU. This layering is a form of abstraction: you can work productively at a high level while lower layers handle the details, and drop down a level when you need more control or must debug something unusual.

## Choosing a level

- need direct hardware access, tiny memory footprint or real-time guarantees: C, C++ or Rust
- building applications quickly with large teams: Java, C#, Kotlin, Go
- prototyping, scripting, data analysis: Python
- in a browser: JavaScript or TypeScript

## How interviewers test this

Expect "Difference between high-level and low-level languages?", "Is C high level or low level?" and "Why is Java slower or faster than C?" Describe the spectrum from machine code to Java, place C in the middle with pointers as the reason, compare speed, safety and portability, and mention the JIT as the reason the gap is smaller than people assume.`,
    sources: [WIKI_PL, CS50],
  },

  "compiler-vs-interpreter": {
    theory: `Source code written by humans must be translated before a CPU can run it. Two broad strategies exist: a **compiler** translates the whole program ahead of time into another form, and an **interpreter** reads and executes the program statement by statement. Modern languages often mix both, and Java is the classic hybrid. This lesson explains how each approach works, their trade-offs, and exactly where Java fits.

## Compilers

A compiler reads the entire source program, checks it, and produces output, usually machine code or an intermediate form, before anything runs:

1. **Lexical analysis**: break the text into tokens such as keywords, names, numbers and symbols
2. **Parsing**: check the tokens against the grammar and build a syntax tree
3. **Semantic analysis**: check meaning, such as types and declared variables
4. **Optimization**: improve the code, for example by removing unused computations
5. **Code generation**: emit machine code or bytecode

C and C++ compilers such as GCC produce native executables. Once compiled, the program runs without the compiler.

## Interpreters

An interpreter executes source code directly, translating and running each statement in turn. Classic examples include early BASIC and shell scripts. Python's standard implementation compiles to internal bytecode first, then interprets that bytecode, but from a user's perspective it runs source files directly.

## The trade-offs

| | Compiler | Interpreter |
|---|---|---|
| When translation happens | Before running, once | While running, repeatedly |
| Error detection | Many errors reported before running | Errors appear when that line executes |
| Execution speed | Usually faster | Usually slower, due to translation overhead |
| Startup and feedback | Compile step before each run | Run immediately; good for experimenting |
| Distribution | Ship a binary, often platform specific | Ship source; needs the interpreter installed |
| Examples | C, C++, Rust, Go | Python, Ruby, JavaScript (originally), shell |

## Java: compiled and interpreted

Java uses both strategies in sequence:

1. **javac** compiles \`.java\` source files into \`.class\` files containing **bytecode**, instructions for an abstract machine rather than any real CPU
2. The **JVM** loads the bytecode and starts executing it with an **interpreter**
3. The JVM watches which methods run often ("hot" code), and its **JIT compiler**, which compiles code at the moment it becomes worth compiling, translates those into optimized native machine code
4. Later calls to hot methods run the native code directly

~~~
Hello.java --javac--> Hello.class (bytecode) --JVM--> interpreted + JIT-compiled machine code
~~~

This design gives Java two benefits at once: **platform independence**, since the same bytecode runs on any operating system with a JVM ("write once, run anywhere"), and **good performance**, because hot code ends up as optimized machine code.

## Why the JIT can beat static compilation

A JIT compiles while the program runs, so it can use runtime information a static compiler lacks: which branches are taken most, which concrete classes appear at a call site, which methods are hot. It can inline aggressively and even undo optimizations if assumptions change. The cost is warm-up time: a Java program runs slower for its first moments until hot code is compiled.

## Ahead-of-time compilation for Java

Tools such as GraalVM Native Image compile Java ahead of time into native executables. They start in milliseconds and use less memory, useful for command-line tools and serverless functions, at the cost of some dynamic features and peak optimization.

## Other hybrids

- **JavaScript** engines such as V8 interpret and JIT-compile, much like the JVM
- **C#** compiles to an intermediate language run by the .NET runtime with a JIT
- **Python** compiles to bytecode interpreted by CPython; PyPy adds a JIT

The old "compiled versus interpreted" split describes implementations, not languages. Python could be compiled, and C could be interpreted; what matters is how a particular implementation runs code.

## Compile-time and runtime errors in Java

Because Java has a compile step, many mistakes are caught by javac: misspelled names, type mismatches, missing semicolons. Others only appear at runtime: dividing by zero, accessing an array out of bounds, a null reference. Learning which errors the compiler catches is part of learning the language.

## How interviewers test this

Expect "Compiler vs interpreter?", "Is Java compiled or interpreted?" and "What is bytecode?" Give the comparison table, explain javac producing bytecode and the JVM interpreting then JIT-compiling hot code, and connect bytecode to platform independence.`,
    sources: [WIKI_COMPILER, JVM_SPEC],
  },

  "source-code-compilation-execution": {
    theory: `Between typing a Java program and seeing its output, several distinct stages happen: writing source code, compiling it to bytecode, loading classes into the JVM, verifying them, and executing them through the interpreter and JIT compiler. Knowing each stage tells you which tool produced an error and why, and it's a common interview topic. This lesson follows a program from source file to running process.

## Stage 1: source code

You write a \`.java\` file in a text editor or IDE:

~~~java
// File: Greeter.java
public class Greeter {
    public static void main(String[] args) {
        String name = "Asha";
        System.out.println("Hello, " + name);
    }
}
~~~

Rules at this stage: a public class must live in a file with the same name, here \`Greeter.java\`. Java is case-sensitive, so \`greeter.java\` would fail.

## Stage 2: compilation with javac

~~~
javac Greeter.java
~~~

The compiler parses the file, checks syntax and types, and writes \`Greeter.class\`, containing **bytecode**. If there are errors, javac reports them with file names and line numbers, and no class file is produced. One .java file can produce several .class files, one per class, including nested classes such as \`Outer$Inner.class\`.

You can view bytecode with \`javap -c Greeter\`. It shows instructions such as \`ldc\` (load a constant), \`invokevirtual\` (call a method) and \`return\`.

## Stage 3: launching the JVM

~~~
java Greeter
~~~

This starts a JVM process and names the class whose \`main\` method should run. Since Java 11, \`java Greeter.java\` can compile and run a single file in one step, convenient for small programs.

## Stage 4: class loading

The JVM's **class loaders** find and load .class files on demand:

- the **bootstrap** loader loads core classes such as \`java.lang.String\`
- the **platform** loader loads other JDK modules
- the **application** loader loads your classes from the classpath

Classes load lazily, when first needed, not all at startup.

## Stage 5: linking

Loaded classes are prepared for execution:

1. **Verification**: the bytecode verifier checks that the code is well formed and type-safe, for example that it doesn't jump into the middle of an instruction or misuse the operand stack. This protects the JVM from corrupted or malicious class files
2. **Preparation**: memory for static fields is allocated with default values
3. **Resolution**: symbolic references, such as the name of another class, are turned into direct references, often lazily

## Stage 6: initialization

Static initializers and static field assignments run, in the order written. For Greeter there are none.

## Stage 7: execution

The JVM calls \`main\`. The **execution engine** runs bytecode:

- the **interpreter** executes instructions one by one at first
- the **JIT compiler** compiles frequently called methods into native machine code
- the **garbage collector** reclaims objects that are no longer reachable

Each method call creates a **stack frame** on the thread's stack holding its local variables, here \`name\` (a reference) pointing to a String object on the **heap**.

## JDK, JRE and JVM

| Term | What it contains | Who needs it |
|---|---|---|
| JVM | The virtual machine that runs bytecode | Built into the JRE |
| JRE | JVM plus core libraries | Historically, anyone running Java apps |
| JDK | JRE plus development tools: javac, javap, jar, jshell, debugger | Developers |

Since Java 11, Oracle ships only the JDK; applications can bundle a trimmed runtime built with \`jlink\`.

## Where errors come from

- **compile-time errors** come from javac: syntax errors, unknown symbols, type mismatches, missing returns
- **class loading errors** come from the JVM: \`ClassNotFoundException\` or \`NoClassDefFoundError\` when a class isn't on the classpath, and \`UnsupportedClassVersionError\` when bytecode was compiled for a newer Java than the JVM running it
- **runtime exceptions** come from executing code: \`NullPointerException\`, \`ArithmeticException\`, \`ArrayIndexOutOfBoundsException\`
- **logic errors** produce no message at all; only testing reveals them

Knowing the stage tells you where to look.

## Packaging

Real applications bundle many class files into a **JAR** (Java ARchive), a zip file with a manifest that can name the main class: \`java -jar app.jar\`. Build tools such as Maven and Gradle compile, test and package automatically.

## How interviewers test this

Expect "Explain how a Java program is executed", "JDK vs JRE vs JVM?" and "What does the bytecode verifier do?" Walk through source, javac, bytecode, class loading, verification, initialization and execution with the interpreter and JIT, then classify errors by the stage that produces them.`,
    sources: [JAVA_GETTING_STARTED, JVM_SPEC],
  },

  "syntax-vs-semantics": {
    theory: `Every programming language has two layers of rules. **Syntax** defines what valid code looks like: the spelling, punctuation and structure. **Semantics** defines what valid code means: what happens when it runs. A program can be syntactically perfect and still semantically wrong. Distinguishing the two helps you understand error messages and debug faster. This lesson explains both layers, the kinds of errors each produces, and how to find and fix them.

## Syntax: the grammar

Syntax rules decide whether text is a valid program at all, much like grammar decides whether words form a valid sentence. In Java:

- statements end with semicolons
- blocks are wrapped in braces \`{ }\`
- keywords such as \`class\`, \`int\` and \`if\` are reserved and spelled exactly
- parentheses, brackets and quotes must be balanced
- identifiers can't start with a digit

~~~java
int count = 10      // syntax error: missing semicolon
if (count > 5 {     // syntax error: missing closing parenthesis
~~~

The compiler rejects syntax errors before the program runs. Messages such as "';' expected" or "illegal start of expression" point at or near the problem line.

## Semantics: the meaning

Semantics decides what a syntactically valid program does. Some semantic rules are checked by the compiler, called **static semantics**:

~~~java
int total = "hello";    // type error: String can't be assigned to int
System.out.println(x);  // x was never declared
~~~

Both lines follow Java's grammar, yet both are rejected because their meaning is invalid. Other semantic problems appear only at runtime, called **dynamic semantics**:

~~~java
int[] scores = new int[3];
scores[3] = 90;         // runtime: ArrayIndexOutOfBoundsException
int avg = 10 / 0;       // runtime: ArithmeticException
~~~

## Logic errors

The hardest errors have valid syntax and valid semantics, run without crashing, and produce the wrong answer:

~~~java
// Intended: average of a and b
double avg = a + b / 2;     // computes a + (b / 2) due to precedence
~~~

The program does exactly what the code says, not what you meant. No tool reports logic errors; tests and careful reasoning find them.

## Comparing error types

| Error type | Detected by | When | Example |
|---|---|---|---|
| Syntax error | Compiler | Before running | Missing semicolon or brace |
| Static semantic error | Compiler | Before running | Type mismatch, undeclared variable |
| Runtime error | JVM | While running | Division by zero, null reference |
| Logic error | You, through tests | After running | Wrong formula, off-by-one loop |

## An analogy with English

"Colorless green ideas sleep furiously" is grammatically correct but meaningless: valid syntax, invalid semantics. "Me want food" conveys meaning with broken grammar; humans understand it, but compilers don't accept broken grammar. Computers are strict about both.

## Reading compiler errors

- read the **first** error first; later errors are often caused by the first one confusing the parser
- check the line mentioned **and the line before it**: a missing semicolon is reported where the parser noticed the problem, often on the next line
- read the message literally: "cannot find symbol" means a name is misspelled, undeclared, or out of scope
- recompile after each fix

## Debugging semantic and logic errors

- **read stack traces**: a runtime exception shows the exception type and the line where it happened
- **trace by hand**: write down variable values step by step for a small input
- **print values**: temporary \`System.out.println\` calls show what the program actually computes
- **use a debugger**: step through lines and inspect variables in an IDE
- **test edge cases**: zero, negative numbers, empty input, the largest values

## Style isn't syntax

Indentation and blank lines don't affect Java's meaning; the compiler ignores them. Python is different, since indentation is part of its syntax. In Java, consistent formatting still matters enormously for humans reading the code, and teams enforce it with formatters.

## How interviewers test this

Expect "Difference between syntax and semantics?", "Give examples of syntax, runtime and logic errors" and code snippets asking whether they compile. Classify each error by who detects it and when, explain that valid syntax doesn't guarantee correct meaning, and show the precedence bug as a classic logic error.`,
    sources: [JLS, NUTS],
  },

  "variables": {
    theory: `A variable is a named storage location that holds a value your program can read and change. Variables are how programs remember things: a running total, a user's name, the current position in a list. In Java, every variable has a name, a type and a value, and the type is fixed when the variable is declared. This lesson covers declaration and initialization, naming rules, the kinds of variables, scope, and local variable type inference.

## Declaring and initializing

~~~java
int age;            // declaration: name and type
age = 21;           // assignment
int score = 95;     // declaration with initialization
age = age + 1;      // reading and updating
~~~

A declaration reserves space for a value of the given type. Assignment stores a value with \`=\`, which means "store", not "equals" in the mathematical sense. \`age = age + 1\` reads the current value, adds one and stores the result back.

You can declare several variables of the same type at once, \`int x = 1, y = 2;\`, though one per line is clearer.

## Naming rules

Java identifiers must:

- start with a letter, \`$\` or \`_\`, not a digit
- contain only letters, digits, \`$\` and \`_\`
- not be a reserved keyword such as \`class\`, \`int\` or \`new\`
- match exactly, because Java is case-sensitive: \`total\` and \`Total\` are different variables

## Naming conventions

Rules decide what compiles; conventions decide what's readable:

- variables use **camelCase**: \`studentCount\`, \`maxScore\`
- names should describe the content: \`daysUntilExam\` beats \`d\` or \`temp2\`
- booleans read as questions: \`isActive\`, \`hasPaid\`
- single letters are acceptable for short loop counters such as \`i\`

Good names are the cheapest documentation you'll ever write.

## Kinds of variables

| Kind | Declared | Lifetime | Default value |
|---|---|---|---|
| Local variable | Inside a method or block | Until the block ends | None: must be assigned before use |
| Parameter | In a method's signature | During the method call | Set by the caller |
| Instance field | In a class, without \`static\` | As long as its object exists | 0, false or null |
| Static field | In a class, with \`static\` | While the class is loaded | 0, false or null |

## Local variables must be initialized

~~~java
int total;
System.out.println(total);   // compile error: variable might not have been initialized
~~~

Java's compiler tracks whether every path assigns a local variable before reading it. This **definite assignment** rule prevents reading garbage values, a common bug in C.

## Scope

A variable's **scope** is the region of code where its name is visible. For local variables, scope runs from the declaration to the end of the enclosing block:

~~~java
if (marks > 40) {
    String grade = "Pass";
    System.out.println(grade);
}
System.out.println(grade);   // compile error: grade is out of scope
~~~

Java doesn't allow declaring a local variable with the same name as another local still in scope. Declaring variables in the smallest scope that works keeps code easier to follow.

## Memory picture

A local variable of primitive type, such as \`int age\`, stores its value directly in the method's **stack frame**. A variable of a reference type, such as \`String name\`, stores a reference to an object on the **heap**. The memory module covers this in depth.

## Local variable type inference with var

Since Java 10, \`var\` lets the compiler infer a local variable's type from its initializer:

~~~java
var count = 10;                       // int
var names = new ArrayList<String>();  // ArrayList<String>
~~~

\`var\` doesn't make Java dynamically typed: the type is fixed at compile time and can't change. It works only for local variables with an initializer, not for fields or parameters. Use it when the type is obvious from the right-hand side; avoid it when it hides useful information.

## Common mistakes

- using a variable before assigning it
- confusing \`=\` (assignment) with \`==\` (comparison)
- reusing one variable for unrelated purposes, which makes code hard to follow
- declaring variables far from where they're used

## How interviewers test this

Expect "What are the types of variables in Java?", "Do local variables have default values?" and scope questions with code that doesn't compile. Distinguish local, parameter, instance and static variables with their lifetimes, explain definite assignment, and describe block scope.`,
    sources: [VARIABLES, JLS],
  },

  "constants": {
    theory: `A constant is a value that doesn't change while the program runs, such as the number of days in a week or a maximum login attempt limit. Java has no \`const\` keyword in use; it creates constants with \`final\`, usually combined with \`static\` for class-wide values. Constants replace unexplained numbers in code, prevent accidental changes and make programs easier to update. This lesson covers final variables, static final constants, naming, compile-time constants, and enums.

## final variables

The \`final\` keyword means a variable can be assigned only once:

~~~java
final int maxAttempts = 3;
maxAttempts = 5;    // compile error: cannot assign a value to final variable
~~~

A final local variable can be assigned later, as long as it's assigned exactly once on every path:

~~~java
final String category;
if (age < 18) category = "Minor";
else category = "Adult";
~~~

## Class-level constants: static final

Values shared across a whole program are declared as \`static final\` fields:

~~~java
public class Exam {
    public static final int PASS_MARK = 40;
    public static final double GST_RATE = 0.18;
    public static final String APP_NAME = "StudyHub";
}
~~~

\`static\` means one copy belongs to the class rather than one per object; \`final\` means it never changes. Other code reads it as \`Exam.PASS_MARK\`. The JDK has many: \`Math.PI\`, \`Integer.MAX_VALUE\`.

## Naming convention

Constants use **UPPER_SNAKE_CASE**: all capitals with underscores between words. This makes them instantly recognizable in code. Final local variables in a method usually keep normal camelCase, because they're local details rather than program-wide constants.

## Magic numbers

A **magic number** is an unexplained literal in code:

~~~java
if (attempts > 3) lockAccount();          // why 3?
double total = price * 1.18;              // what is 1.18?
~~~

Named constants explain intent and centralize change:

~~~java
if (attempts > MAX_LOGIN_ATTEMPTS) lockAccount();
double total = price * (1 + GST_RATE);
~~~

If the tax rate changes, you edit one line instead of hunting for every 1.18 in the codebase, and you won't accidentally change an unrelated 1.18. Obvious values such as 0, 1 or 2 in basic arithmetic usually don't need names.

## Compile-time constants

A \`static final\` field of primitive or String type initialized with a constant expression is a **compile-time constant**:

~~~java
static final int SECONDS_PER_DAY = 24 * 60 * 60;   // computed by the compiler
~~~

The compiler replaces uses of compile-time constants with their values. One consequence: if a library changes such a constant, code compiled against the old version keeps the old value until it's recompiled. Compile-time constants can also be used as \`case\` labels in switch statements.

## final doesn't freeze objects

For reference types, \`final\` fixes the reference, not the object:

~~~java
final int[] scores = {90, 80};
scores[0] = 100;              // allowed: the array's contents change
scores = new int[5];          // compile error: the reference can't change
~~~

For a truly unchangeable collection, use \`List.of(...)\`, which creates an immutable list.

## Enums for related constants

When constants form a fixed set of options, an **enum** is safer than separate integers:

~~~java
enum Level { BEGINNER, INTERMEDIATE, ADVANCED }
Level lv = Level.INTERMEDIATE;
~~~

A method taking a \`Level\` can't receive an invalid value such as 7, which an \`int\` parameter would accept. The OOP course covers enums in depth.

## Where to put constants

- constants used by one class: \`private static final\` inside it
- constants shared by a feature: a related class, such as \`Exam.PASS_MARK\`
- avoid one giant "Constants" class holding unrelated values, which becomes hard to navigate
- configuration that differs between environments, such as database URLs, belongs in configuration files or environment variables, not constants

## A quick summary

Use \`final\` for any variable that shouldn't change after it gets its value, and \`static final\` with UPPER_SNAKE_CASE names for program-wide constants. Replace magic numbers with named constants so intent is visible and changes happen in one place. Remember that \`final\` locks the reference, not the object, and reach for enums when the constants form a fixed set of choices.

## How interviewers test this

Expect "How do you create a constant in Java?", "Why use static final?" and "Can you change the contents of a final array?" Explain final as assign-once, static as class-level, show the magic number refactoring, and point out that final freezes references, not objects.`,
    sources: [VARIABLES, JLS],
  },

  "primitive-data-types": {
    theory: `Java has eight primitive data types, built into the language, that hold basic values directly: whole numbers, decimal numbers, single characters and true or false. Every other type, including String and arrays, is a reference type. Knowing each primitive's size, range and behaviour at its limits prevents overflow bugs, precision errors and confusing comparisons. This lesson covers all eight types, literals, default values, overflow and floating-point precision.

## The eight primitives

| Type | Size | Range or values | Example literal |
|---|---|---|---|
| \`byte\` | 8 bits | -128 to 127 | \`(byte) 10\` |
| \`short\` | 16 bits | -32,768 to 32,767 | \`(short) 1000\` |
| \`int\` | 32 bits | about -2.1 billion to 2.1 billion | \`42\` |
| \`long\` | 64 bits | about ±9.2 × 10^18 | \`42L\` |
| \`float\` | 32 bits | about 6-7 significant decimal digits | \`3.14f\` |
| \`double\` | 64 bits | about 15-16 significant decimal digits | \`3.14\` |
| \`char\` | 16 bits | Unicode code units, 0 to 65,535 | \`'A'\` |
| \`boolean\` | JVM-dependent | \`true\` or \`false\` | \`true\` |

Sizes are fixed by the Java specification on every platform, unlike C, where \`int\` size varies. This is part of Java's portability.

## Choosing a type

- \`int\` is the default for whole numbers: counts, indices, ages
- \`long\` for values that may exceed about 2.1 billion: timestamps in milliseconds, population totals, large sums
- \`double\` is the default for decimals: measurements, averages
- \`boolean\` for yes or no states
- \`char\` for single characters
- \`byte\` and \`short\` mostly for large arrays where memory matters, or binary data

## Literals

- integer literals are \`int\` by default; add \`L\` for long: \`10_000_000_000L\`
- decimal literals are \`double\` by default; add \`f\` for float: \`2.5f\`
- underscores improve readability: \`1_000_000\`
- hexadecimal \`0xFF\`, binary \`0b1010\`, and octal with a leading zero: \`017\` is 15, a classic trap
- char literals use single quotes, \`'A'\`; strings use double quotes, \`"A"\`

## Integer overflow

Integers wrap around silently when they exceed their range:

~~~java
int big = Integer.MAX_VALUE;   // 2147483647
big = big + 1;                 // -2147483648: no error, wrong answer
~~~

Overflow bugs are common in sums, products and average calculations. \`(low + high) / 2\` can overflow for large indices; \`low + (high - low) / 2\` avoids it. Use \`long\` for large values, or \`Math.addExact\`, which throws an exception on overflow instead of wrapping.

## Integer division

Dividing two integers discards the fractional part:

~~~java
int a = 7 / 2;          // 3
double b = 7 / 2;       // 3.0: division happened in int first
double c = 7 / 2.0;     // 3.5
~~~

## Floating-point precision

\`float\` and \`double\` use binary fractions, which can't represent many decimal values exactly:

~~~java
System.out.println(0.1 + 0.2);          // 0.30000000000000004
System.out.println(0.1 + 0.2 == 0.3);   // false
~~~

Consequences:

- don't compare doubles with \`==\`; check whether the difference is smaller than a tolerance: \`Math.abs(a - b) < 1e-9\`
- don't use double for money; use \`long\` paise or cents, or \`BigDecimal\`
- dividing by zero with doubles gives \`Infinity\` or \`NaN\`, not an exception, while integer division by zero throws ArithmeticException

## char is a number

A \`char\` holds a 16-bit Unicode code unit, so it behaves like a small unsigned integer in arithmetic:

~~~java
char c = 'A';
System.out.println(c + 1);          // 66
System.out.println((char) (c + 1)); // B
~~~

This is handy for problems such as counting letter frequencies with \`counts[c - 'a']++\`.

## boolean is separate

Unlike C, Java's \`boolean\` isn't a number. \`if (1)\` doesn't compile, and you can't cast between boolean and int.

## Default values

Fields get default values: 0 for numeric types, \`'\\u0000'\` for char, false for boolean. Local variables get no default and must be assigned before use.

## Primitives versus references

Primitives store the value itself and can't be null. Reference types store a reference to an object. Each primitive has a **wrapper class**, such as \`Integer\` for \`int\`, used when an object is required, for example in collections. The wrapper classes lesson covers this.

## How interviewers test this

Expect "List the primitive types with sizes", "What happens on integer overflow?", "Why is 0.1 + 0.2 not 0.3?" and "Why not use double for money?" Recite the table, demonstrate silent wraparound, explain binary fractions, and recommend long or BigDecimal for currency.`,
    sources: [PRIMITIVES, JLS],
  },

  "type-casting": {
    theory: `Type casting converts a value from one type to another. Java converts automatically when the conversion is safe, such as int to long, and requires an explicit cast when information might be lost, such as double to int. Casting rules explain many surprising results: truncated decimals, wrapped numbers, and integer division in expressions. This lesson covers widening and narrowing conversions, numeric promotion in expressions, casting with char, and converting between strings and numbers.

## Widening conversion: automatic

Converting to a type that can hold every value of the original type happens automatically:

~~~java
int count = 100;
long big = count;       // int to long
double d = count;       // int to double: 100.0
~~~

The widening order for numeric primitives is:

~~~
byte -> short -> int -> long -> float -> double
           char -> int
~~~

Widening is always allowed without a cast. One subtlety: converting a large \`int\` or \`long\` to \`float\`, or a large \`long\` to \`double\`, can lose precision in the low digits, though the magnitude is preserved.

## Narrowing conversion: explicit

Converting to a smaller type requires a cast, because values may not fit:

~~~java
double price = 99.99;
int rupees = (int) price;        // 99: fractional part truncated, not rounded

long big = 3_000_000_000L;
int wrapped = (int) big;         // -1294967296: high bits discarded
~~~

The cast tells the compiler "I accept possible loss". For decimals to integers, Java truncates toward zero: \`(int) -2.7\` is -2. To round, use \`Math.round(price)\`, which returns a long for double input.

## How narrowing integers works

Narrowing between integer types keeps only the low-order bits:

~~~java
int x = 130;
byte b = (byte) x;      // -126
~~~

130 is \`10000010\` in binary; as a signed byte, that bit pattern means -126. Out-of-range values don't throw exceptions; they silently become different numbers.

## Numeric promotion in expressions

In arithmetic, Java promotes operands before computing:

1. \`byte\`, \`short\` and \`char\` are promoted to \`int\`
2. if either operand is \`long\`, the other becomes long; else if either is \`float\`, float; else if either is \`double\`, double

~~~java
byte a = 10, b = 20;
byte c = a + b;          // compile error: a + b is an int
byte d = (byte) (a + b); // OK
~~~

Compound assignments include an implicit cast, so \`a += b;\` compiles even though \`a = a + b;\` doesn't. This is a well-known interview trap.

## Mixed arithmetic

~~~java
int total = 7, count = 2;
double avg1 = total / count;            // 3.0: int division, then widened
double avg2 = (double) total / count;   // 3.5: total cast first
double avg3 = (double) (total / count); // 3.0: cast applied after int division
~~~

The cast applies to what immediately follows it, so placement matters.

## Casting with char

~~~java
char letter = 'a';
int code = letter;                  // 97: widening
char next = (char) (letter + 1);    // 'b': narrowing from int
int digit = '7' - '0';              // 7: converts a digit character to its value
~~~

## Strings and numbers

Casting doesn't convert between strings and numbers; \`(int) "42"\` doesn't compile. Use parsing methods and string conversion instead:

~~~java
int n = Integer.parseInt("42");
double d = Double.parseDouble("3.5");
String s = String.valueOf(42);       // or Integer.toString(42), or "" + 42
~~~

\`Integer.parseInt("4a")\` throws \`NumberFormatException\`, so input from users should be validated or the exception handled.

## boolean can't be cast

Java doesn't convert between boolean and numeric types in either direction. Write \`flag ? 1 : 0\` or \`n != 0\` instead.

## Reference type casting

Objects can be cast too, up and down an inheritance hierarchy. Upcasting is automatic; downcasting requires a cast and can throw \`ClassCastException\` if the object isn't of the target type. The OOP course covers this, along with the safe \`instanceof\` check.

## Casting traps to remember

- \`(int) 3.99\` is 3, not 4
- \`(int) 'A'\` is 65
- \`(byte) 200\` is -56
- \`1 / 2 * 4.0\` is 0.0, because \`1 / 2\` is integer division evaluated first
- \`Math.round(2.5)\` is 3, but \`Math.round(-2.5)\` is -2, because it rounds half up toward positive infinity

## How interviewers test this

Expect "Widening vs narrowing?", output puzzles like \`(byte) 130\` or \`(int) -2.7\`, and "Why does \`byte c = a + b\` fail but \`a += b\` compile?" Explain the widening order, truncation and bit discarding in narrowing, int promotion in expressions, and the implicit cast in compound assignment.`,
    sources: [JLS_CONVERSIONS, PRIMITIVES],
  },

  "wrapper-classes": {
    theory: `Every Java primitive type has a matching **wrapper class** that represents the value as an object: \`Integer\` for int, \`Double\` for double, \`Character\` for char, and so on. Wrappers exist because collections, generics and many APIs work only with objects. Java converts between primitives and wrappers automatically through autoboxing and unboxing, which is convenient but hides traps around null, caching and \`==\`. This lesson covers the wrapper classes, conversions, utility methods, and the classic pitfalls.

## The wrapper classes

| Primitive | Wrapper |
|---|---|
| \`byte\` | \`Byte\` |
| \`short\` | \`Short\` |
| \`int\` | \`Integer\` |
| \`long\` | \`Long\` |
| \`float\` | \`Float\` |
| \`double\` | \`Double\` |
| \`char\` | \`Character\` |
| \`boolean\` | \`Boolean\` |

All are in \`java.lang\`, immutable and final. The numeric ones extend the abstract class \`Number\`.

## Why wrappers are needed

Generic collections hold only objects:

~~~java
List<int> nums;          // compile error: type argument can't be primitive
List<Integer> nums = new ArrayList<>();   // OK
~~~

Wrappers also allow a "no value" state with \`null\`, for example an optional score not yet entered, or a database column that can be empty.

## Autoboxing and unboxing

Since Java 5, the compiler converts automatically:

~~~java
Integer boxed = 42;          // autoboxing: Integer.valueOf(42)
int raw = boxed;             // unboxing: boxed.intValue()
nums.add(7);                 // autoboxing into the list
int first = nums.get(0);     // unboxing out of the list
~~~

The conversions are real method calls inserted by the compiler, not free.

## Trap 1: unboxing null

~~~java
Integer score = null;
int s = score;               // NullPointerException
~~~

Unboxing calls \`intValue()\` on null. This often hides in code such as \`int count = map.get(key);\` when the key is missing, since \`get\` returns null.

## Trap 2: == compares references

\`==\` on wrapper objects compares identity, not values:

~~~java
Integer a = 127, b = 127;
System.out.println(a == b);      // true
Integer c = 128, d = 128;
System.out.println(c == d);      // false (with default settings)
System.out.println(c.equals(d)); // true
~~~

\`Integer.valueOf\` caches objects for values from -128 to 127, so small values share objects and large ones don't. Always compare wrapper values with \`equals\`, or unbox to primitives first. This is among the most asked Java output questions.

## Trap 3: performance in loops

~~~java
Long sum = 0L;
for (long i = 0; i < 1_000_000; i++) {
    sum += i;      // unbox, add, box a new Long each iteration
}
~~~

Using \`long sum\` instead avoids a million object allocations. Prefer primitives for local arithmetic, and wrappers only where objects are required.

## Trap 4: overloads and remove

\`List<Integer>.remove(1)\` removes the element at index 1, choosing \`remove(int index)\` over \`remove(Object)\`. To remove the value 1, write \`list.remove(Integer.valueOf(1))\`.

## Creating wrapper objects

Use \`valueOf\` or autoboxing. The constructors such as \`new Integer(5)\` are deprecated, because they always create new objects and bypass the cache.

## Useful static methods

~~~java
Integer.parseInt("123");          // String to int
Integer.valueOf("123");           // String to Integer
Integer.toString(255, 2);         // "11111111": convert to another base
Integer.MAX_VALUE;                // 2147483647
Integer.compare(a, b);            // safe comparison, no overflow
Character.isDigit('7');           // true
Character.isLetter('x');          // true
Character.toUpperCase('q');       // 'Q'
Double.isNaN(value);
Boolean.parseBoolean("TRUE");     // true, case-insensitive
~~~

\`Character\` methods are especially useful in string problems such as checking palindromes or counting vowels.

## Comparing with Integer.compare

Writing a comparator as \`a - b\` can overflow for large values of opposite signs. \`Integer.compare(a, b)\` is always correct, which matters when sorting.

## Immutability

Wrapper objects never change. \`count++\` on an \`Integer\` variable creates a new Integer object and reassigns the variable; it doesn't modify the old object. This is why a method can't change a caller's Integer argument.

## A quick summary

Use primitives for arithmetic and local variables, and wrappers only where an object is required: collections, generics and values that may be absent. Compare wrapper values with \`equals\`, guard against unboxing null, and lean on the static helpers such as \`Integer.parseInt\` and \`Character.isDigit\` in everyday problems.

## How interviewers test this

Expect "What are wrapper classes and why do we need them?", "Explain autoboxing", "Why is Integer 127 == 127 true but 128 == 128 false?" and "What happens when you unbox null?" Explain collections and null as the reasons, describe the -128 to 127 cache, recommend equals for comparison, and show the NullPointerException from unboxing.`,
    sources: [BOXING, JLS],
  },
};
