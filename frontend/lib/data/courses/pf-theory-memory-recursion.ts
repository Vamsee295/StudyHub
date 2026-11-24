// Long-form theory for Programming Fundamentals modules 9-10: memory and execution, problem solving and recursion. Original writing.
import { LessonTheory } from './utils';

const JVM_DATA_AREAS = { title: "JVM Specification 2.5: Run-Time Data Areas", url: "https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-2.html#jvms-2.5" };
const JVM_FRAMES = { title: "JVM Specification 2.6: Frames", url: "https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-2.html#jvms-2.6" };
const GC_TUNING = { title: "Oracle: HotSpot Virtual Machine Garbage Collection Tuning Guide", url: "https://docs.oracle.com/en/java/javase/21/gctuning/introduction-garbage-collection-tuning.html" };
const JVM_SPEC = { title: "The Java Virtual Machine Specification", url: "https://docs.oracle.com/javase/specs/jvms/se21/html/index.html" };
const JIT_WIKI = { title: "Wikipedia: Just-in-time compilation", url: "https://en.wikipedia.org/wiki/Just-in-time_compilation" };
const POLYA = { title: "Wikipedia: How to Solve It (George Pólya)", url: "https://en.wikipedia.org/wiki/How_to_Solve_It" };
const CS50 = { title: "Harvard CS50: Introduction to Computer Science (free course)", url: "https://cs50.harvard.edu/x/" };
const RECURSION_WIKI = { title: "Wikipedia: Recursion (computer science)", url: "https://en.wikipedia.org/wiki/Recursion_(computer_science)" };
const MIT_6006 = { title: "MIT OpenCourseWare 6.006: Introduction to Algorithms", url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/" };

export const pfMemoryRecursionTheory: Record<string, LessonTheory> = {
  "memory-execution-overview": {
    theory: `When a Java program runs, the JVM organizes memory into separate areas, each with a specific job: the stack holds method calls and local variables, the heap holds objects, and other areas hold class information and compiled code. Meanwhile, the execution engine runs bytecode through an interpreter and a JIT compiler, and the garbage collector reclaims memory no longer in use. This lesson gives the big picture that the rest of the module fills in, so you can reason about performance, errors such as StackOverflowError, and what your code does at runtime.

## From source to running program

1. You write \`.java\` source files
2. \`javac\` compiles them into \`.class\` files containing bytecode
3. The \`java\` command starts a JVM process
4. **Class loaders** load classes as they're first needed
5. The **execution engine** runs bytecode, interpreting it at first and compiling hot code to native machine code
6. The **garbage collector** frees memory occupied by objects that can't be reached any more

## The JVM's memory areas

| Area | Shared by threads? | Holds |
|---|---|---|
| Stack (one per thread) | No | Frames for method calls: parameters, local variables, partial results |
| Heap | Yes | All objects and arrays |
| Method area (Metaspace in HotSpot) | Yes | Class metadata, method bytecode, the runtime constant pool |
| Program counter register (one per thread) | No | Address of the instruction the thread is executing |
| Native method stacks | No | State for native (non-Java) code |
| Code cache | Yes | Machine code produced by the JIT compiler |

## A quick example

~~~java
public class Demo {
    static int counter = 0;                  // static field: stored with class data

    public static void main(String[] args) {
        int n = 3;                           // local primitive: in main's stack frame
        int[] data = new int[n];             // reference on the stack; array on the heap
        String label = "scores";             // reference on the stack; String in the heap (string pool)
        fill(data);
    }

    static void fill(int[] arr) {            // new frame: arr is a copy of the reference
        for (int i = 0; i < arr.length; i++) arr[i] = i * i;
    }
}
~~~

When \`fill\` runs, a new frame sits on top of main's frame. Both frames hold references pointing to the same array on the heap. When \`fill\` returns, its frame disappears, but the array survives because main still references it.

## Stack versus heap at a glance

| | Stack | Heap |
|---|---|---|
| Contents | Frames, local primitives, references | Objects, arrays, instance fields |
| Allocation | Automatic on method call | \`new\` (and literals, autoboxing) |
| Freed | Automatically when the method returns | By the garbage collector when unreachable |
| Size | Small per thread, often around 512 KB to 1 MB | Large, configured with \`-Xmx\` |
| Speed | Fast push and pop | Fast allocation; collection has costs |
| Error when full | \`StackOverflowError\` | \`OutOfMemoryError: Java heap space\` |

The next lessons cover each area in detail.

## The execution engine

The engine turns bytecode into action:

- the **interpreter** executes bytecode instructions one at a time, starting immediately
- the **JIT compiler** watches for frequently executed methods and compiles them into optimized native code
- the **garbage collector** runs alongside, reclaiming unused heap memory

This mix gives Java fast startup (interpretation) and high peak speed (JIT compilation).

## Threads and memory

Each thread has its own stack and program counter, so local variables are naturally private to a thread. The heap is shared, so objects can be accessed by several threads at once, which is why concurrent programs need synchronization or immutable objects. Concurrency is an advanced topic, but knowing which memory is shared explains why it matters.

## Common runtime errors and where they come from

- **StackOverflowError**: too many nested calls, usually runaway recursion
- **OutOfMemoryError: Java heap space**: too many live objects, often a memory leak or loading too much data
- **OutOfMemoryError: Metaspace**: too many classes loaded, rare in ordinary programs
- **NullPointerException**: a reference variable on the stack holds null instead of pointing to a heap object

## Why this matters for programmers

Understanding memory explains:

- why changes made through an array parameter are visible to the caller but reassigning it isn't
- why deep recursion fails while an equivalent loop works
- why creating millions of temporary objects in a loop slows a program
- why holding references in a static list keeps objects alive forever
- why a Java program speeds up after it has been running for a while

## Inspecting a running JVM

JDK tools let you see this in action: \`jconsole\` and VisualVM show heap usage and threads, \`jstack\` prints every thread's stack, and \`jcmd\` reports GC and memory statistics. Running a program with \`-Xss\` changes stack size and \`-Xmx\` changes the maximum heap.

## How interviewers test this

Expect "Explain JVM memory areas", "Where are local variables and objects stored?" and "What's the difference between StackOverflowError and OutOfMemoryError?" Draw the stack frames pointing to heap objects, list the memory areas with what they hold, and describe the interpreter, JIT and garbage collector roles.`,
    sources: [JVM_DATA_AREAS, JVM_SPEC],
  },

  "stack-memory": {
    theory: `The stack is the memory area that tracks method calls. Every time a method is called, the JVM pushes a **frame** onto the current thread's stack holding that call's parameters, local variables and bookkeeping; when the method returns, the frame is popped. This last-in, first-out structure makes stack memory fast and automatic, and it explains recursion, local variable lifetime, stack traces and StackOverflowError. This lesson covers frames, what they contain, how calls push and pop them, stack size, and the stack's role in recursion and errors.

## Last in, first out

A stack works like a pile of plates: you add to the top and remove from the top. The method currently running is always the top frame. When it calls another method, the new frame goes on top; when that method finishes, its frame is removed, and the caller continues exactly where it left off.

## What a frame contains

Each frame holds:

- **local variables**: parameters and variables declared in the method, including \`this\` for instance methods
- **operand stack**: temporary space the bytecode uses while evaluating expressions
- **frame data**: the return address and a reference to the class's constant pool

Primitive locals store their values directly in the frame. Reference locals store a reference; the object they point to lives on the heap.

## Watching frames push and pop

~~~java
public static void main(String[] args) {
    int x = 4;
    int y = triple(x);
    System.out.println(y);
}

static int triple(int n) {
    int result = n * 3;
    return result;
}
~~~

1. main's frame: \`args\`, \`x = 4\`, \`y\` unset
2. calling \`triple(4)\` pushes a frame: \`n = 4\`, \`result\` unset
3. \`result = 12\`; the method returns 12, and its frame is popped
4. back in main: \`y = 12\`, printed

After step 3, \`n\` and \`result\` no longer exist anywhere. That's why local variables can't outlive their method, and why returning a value is the way to pass results out.

## Speed and automatic cleanup

Pushing and popping a frame is a matter of moving a pointer, so stack allocation is extremely fast. Cleanup is automatic and immediate: there's nothing for the garbage collector to do for locals. This is one reason primitives in local variables are cheap.

## Each thread has its own stack

Every thread has a private stack, so local variables are never shared between threads. Two threads running the same method each have separate copies of its locals. Objects on the heap, however, can be shared.

## Stack size and StackOverflowError

Each thread's stack has a fixed maximum size, commonly about 512 KB to 1 MB by default, configurable with the \`-Xss\` option. Each frame uses some of it. If calls nest too deeply, the stack runs out:

~~~java
static int countDown(int n) {
    return countDown(n - 1);      // no base case: calls itself forever
}
// Exception in thread "main" java.lang.StackOverflowError
~~~

The usual cause is recursion without a reachable base case. Even correct recursion can overflow when the depth reaches tens of thousands, for example recursing once per element of a large linked list. Converting deep recursion to a loop, or using an explicit stack data structure on the heap, avoids the limit.

## Stack traces

When an exception occurs, Java prints the stack at that moment, innermost frame first:

~~~
Exception in thread "main" java.lang.ArithmeticException: / by zero
    at Calc.divide(Calc.java:12)
    at Calc.average(Calc.java:7)
    at Calc.main(Calc.java:3)
~~~

Read it as: main called average at line 3, average called divide at line 7, and divide failed at line 12. The stack trace is a snapshot of the call stack, which makes it the most useful debugging aid in Java.

## Recursion and the stack

Each recursive call gets its own frame with its own copy of parameters and locals:

~~~java
static int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}
~~~

\`factorial(4)\` pushes frames for n = 4, 3, 2 and 1. The n = 1 frame returns 1, then each frame multiplies on the way back: 2, 6, 24. The stack is what lets each level remember its own \`n\` while waiting. The recursion lessons later in this course build on this picture. Java doesn't perform tail-call optimization, so even tail-recursive methods use one frame per call.

## Escape analysis

The JIT compiler can sometimes avoid heap allocation for objects that never leave a method, keeping their fields in registers or on the stack. This optimization is invisible to your code, but it explains why short-lived objects are cheaper than you might expect.

## Common misconceptions

- "Primitives always live on the stack": only **local** primitives do; primitive fields of objects live on the heap with their object
- "Objects are passed on the stack": only references are; the objects stay on the heap
- "The stack is cleaned by the garbage collector": frames are popped automatically when methods return

## How interviewers test this

Expect "What is stored on the stack?", "What causes StackOverflowError?", tracing frames through nested and recursive calls, and reading stack traces. Explain frames and their contents, LIFO push and pop, per-thread stacks, fixed size and deep recursion, and how a stack trace mirrors the call stack.`,
    sources: [JVM_FRAMES, JVM_DATA_AREAS],
  },

  "heap-memory": {
    theory: `The heap is the large, shared memory area where Java stores every object and array. Whenever you write \`new\`, create a string, or autobox a number, memory comes from the heap. Objects live there as long as something can reach them, after which the garbage collector reclaims the space. Understanding the heap explains references, aliasing, null, memory leaks and OutOfMemoryError. This lesson covers what lives on the heap, how references connect stack and heap, object lifetime, heap structure, sizing and common problems.

## What lives on the heap

- every object created with \`new\`: \`new Scanner(System.in)\`, \`new ArrayList<>()\`
- every array: \`new int[100]\`, and array literals such as \`{1, 2, 3}\`
- strings, including the string pool for literals
- boxed values such as \`Integer\` objects created by autoboxing
- instance fields, inside their objects, including primitive fields

Local variables don't live on the heap; they live in stack frames. A local reference variable sits on the stack and points to an object on the heap.

## References connect stack and heap

~~~java
int[] scores = new int[3];
~~~

- \`new int[3]\` allocates an array object on the heap, filled with zeros
- \`scores\` is a local variable on the stack holding a reference to that array

~~~java
int[] backup = scores;    // copies the reference: both point to one array
backup[0] = 90;
System.out.println(scores[0]);   // 90
~~~

Two variables, one object. This **aliasing** is a direct consequence of objects living on the heap while variables hold references.

## null

A reference variable can hold \`null\`, meaning it points to no object. Using it to access a field or call a method throws \`NullPointerException\`. Fields of reference type default to null, which is a frequent cause of this exception.

## Object lifetime

An object lives as long as it's **reachable**: some chain of references leads to it from a **GC root**, such as a local variable in an active frame, a static field, or an active thread. When nothing reaches it any more, it becomes garbage:

~~~java
static int[] makeData() {
    int[] temp = new int[1000];   // reachable through temp
    return temp;                  // the caller now holds the reference
}

void process() {
    int[] d = makeData();         // array still reachable through d
    d = null;                     // now unreachable: eligible for garbage collection
}
~~~

Objects outlive the method that created them if a reference to them escapes, for example by being returned or stored in a field.

## Heap structure

Most JVMs divide the heap by object age, because most objects die young:

| Region | Contents | Collected |
|---|---|---|
| Young generation (Eden plus survivor spaces) | Newly created objects | Often, quickly (minor GC) |
| Old generation | Objects that survived several young collections | Less often, more work (major GC) |

New objects are allocated in Eden by bumping a pointer, which is fast. Objects that survive a few collections are promoted to the old generation. The garbage collection lesson explains how collectors use this layout.

## Heap size

The heap's initial and maximum sizes are set with JVM options:

- \`-Xms512m\`: initial heap size
- \`-Xmx2g\`: maximum heap size

Without options, the JVM picks defaults based on available system memory. \`Runtime.getRuntime().maxMemory()\` reports the maximum.

## OutOfMemoryError

When the heap is full of reachable objects and the collector can't free enough space, the JVM throws \`OutOfMemoryError: Java heap space\`. Common causes:

- loading an entire large file or dataset into memory at once
- allocating huge arrays: a \`long[200_000_000]\` needs 1.6 GB
- **memory leaks**: objects that are no longer needed but still referenced

## Memory leaks in Java

Garbage collection doesn't prevent leaks; it only frees unreachable objects. Leaks happen when references linger:

- a static collection that keeps growing, such as a cache with no eviction
- listeners or callbacks registered and never removed
- objects stored in a map with keys that are never removed
- long-lived objects holding references to large short-lived ones

Profilers such as VisualVM and Eclipse MAT analyse heap dumps (\`jmap\` or \`-XX:+HeapDumpOnOutOfMemoryError\`) to find what's holding memory.

## Allocation costs

Allocation itself is cheap, but creating huge numbers of temporary objects increases garbage collection work. Typical improvements:

- use \`StringBuilder\` instead of string concatenation in loops
- prefer primitives over wrapper objects in arithmetic-heavy code (\`int\` over \`Integer\`)
- reuse arrays or buffers in hot loops when it keeps code clear

Don't contort code to avoid allocation without measuring; modern collectors handle short-lived objects efficiently.

## Object size

Each object carries a header of around 12 to 16 bytes in addition to its fields, and sizes are rounded up to multiples of 8 bytes. An \`Integer\` takes about 16 bytes, versus 4 bytes for an \`int\` in an array, which is why an \`ArrayList<Integer>\` of a million numbers uses several times more memory than an \`int[]\`.

## How interviewers test this

Expect "What is stored on the heap?", "When is an object eligible for garbage collection?", aliasing output questions, and "Can Java have memory leaks?" Explain references from stack to heap, reachability from GC roots, young and old generations, OutOfMemoryError causes, and leaks through lingering references.`,
    sources: [JVM_DATA_AREAS, GC_TUNING],
  },

  "garbage-collection": {
    theory: `Garbage collection (GC) is the JVM's automatic memory management: it finds objects that are no longer reachable and reclaims their memory, so programmers never free memory by hand. This removes whole classes of bugs common in C and C++, such as double frees and dangling pointers, at the cost of some CPU time and occasional pauses. This lesson explains how the JVM decides what's garbage, the mark-and-sweep idea, generational collection, the main collectors, what you can and can't control, and the myths around GC.

## The problem GC solves

In C, memory obtained with \`malloc\` must be released with \`free\`. Forgetting causes leaks; freeing too early leaves **dangling pointers** to reused memory; freeing twice corrupts the allocator. These bugs cause crashes and security vulnerabilities. Java's garbage collector removes the burden: you allocate with \`new\`, and memory is reclaimed automatically when objects are no longer used.

## Reachability

The collector doesn't know what you intend to use; it knows what you **can** use. An object is live if it can be reached by following references from a **GC root**:

- local variables and parameters in active stack frames
- static fields of loaded classes
- active threads
- references held by native code

Everything not reachable from a root is garbage, even if it still references other objects. Two objects that reference only each other form an unreachable cycle and are collected, unlike in basic reference-counting schemes.

## Making objects eligible

~~~java
Student s = new Student("Asha");
s = null;                      // the Student is now unreachable

Student a = new Student("Ravi");
a = new Student("Meera");      // Ravi's object is unreachable

void method() {
    Student temp = new Student("Kiran");
}                              // after return, temp's object is unreachable
~~~

Eligible doesn't mean collected immediately; the collector runs when it decides to.

## Mark and sweep

The classic algorithm works in phases:

1. **Mark**: starting from the roots, traverse all references and mark every reachable object
2. **Sweep**: reclaim the memory of every unmarked object
3. **Compact** (in many collectors): move live objects together to remove gaps, so new allocations stay fast

Copying collectors instead copy live objects from one region to another and treat the old region as empty, which compacts as a side effect.

## Generational collection

Observations of real programs show that most objects die young: temporary strings, iterators, intermediate results. The JVM exploits this **weak generational hypothesis**:

- new objects go into the **young generation**, which is collected often and quickly, because most of it is garbage
- objects that survive several young collections are **promoted** to the **old generation**, collected less frequently

A **minor GC** cleans the young generation and is usually fast. A **major** or **full GC** involves the old generation and takes longer.

## Stop-the-world pauses

Some GC phases pause all application threads so the collector can work on a consistent view of memory. Short pauses are unnoticeable in most applications; long pauses hurt latency-sensitive systems such as trading platforms or interactive services. Modern collectors do most of their work concurrently with the application to keep pauses short.

## The main HotSpot collectors

| Collector | Strength | Typical use |
|---|---|---|
| Serial | Low overhead, single-threaded | Small heaps, single-CPU containers |
| Parallel | High throughput using many threads | Batch jobs where pauses matter less |
| G1 (default since Java 9) | Balanced throughput and predictable pauses | General-purpose servers and apps |
| ZGC | Pauses of about a millisecond, even on huge heaps | Latency-sensitive services |
| Shenandoah | Low pauses through concurrent compaction | Latency-sensitive services |

Collectors are selected with flags such as \`-XX:+UseZGC\`. For most programs, the default G1 is a good choice.

## What you can and can't control

- **\`System.gc()\`** only suggests a collection; the JVM may ignore it. Calling it in application code is almost always a mistake
- **heap size** (\`-Xmx\`) and collector choice are the main tuning knobs
- **finalize()** was a hook that ran before collection, but it was unpredictable and slow; it's deprecated for removal. Use try-with-resources for files and connections, which closes them deterministically

## GC doesn't manage everything

Garbage collection reclaims memory, not other resources. Open files, network sockets and database connections must be closed explicitly, ideally with try-with-resources:

~~~java
try (BufferedReader br = Files.newBufferedReader(path)) {
    // use br
}   // closed automatically, even if an exception occurs
~~~

## Memory leaks still happen

Objects that are reachable but no longer needed, such as entries in an ever-growing static map, are never collected. GC prevents freeing too early, not holding too long.

## Myths

- "Setting variables to null speeds up GC": rarely needed for locals, which become unreachable when the method returns; it helps only for long-lived references to large objects
- "Java is slow because of GC": modern collectors add modest overhead, and allocation in Java is often faster than \`malloc\`
- "GC means memory problems can't happen": leaks and OutOfMemoryError are still possible

## How interviewers test this

Expect "What is garbage collection?", "When is an object eligible?", "Does System.gc() force collection?", "What are young and old generations?" and "Can Java leak memory?" Explain reachability from GC roots, mark-sweep-compact, generational collection, name G1 as the default collector, and note that GC doesn't close files or prevent leaks.`,
    sources: [GC_TUNING, JVM_DATA_AREAS],
  },

  "jit-compilation": {
    theory: `Java code starts out as bytecode, which the JVM can interpret instruction by instruction. Interpretation starts fast but runs slowly. The **JIT compiler**, which compiles code while the program runs, solves this by watching which methods run often and compiling them, while the program runs, into optimized native machine code. That's why Java programs speed up after a warm-up period and can approach the speed of C++. This lesson explains why JIT compilation exists, how HotSpot detects hot code, tiered compilation, key optimizations, deoptimization and warm-up effects.

## Interpretation versus compilation

- an **interpreter** reads each bytecode instruction and performs it, every time it runs: no startup cost, but slow for repeated code
- an **ahead-of-time compiler** translates everything to machine code before running: fast execution, but no knowledge of how the program actually behaves at runtime
- a **JIT compiler** combines both: start interpreting immediately, then compile the parts that matter, using what's been observed about them

## Finding hot code

The HotSpot JVM (named for this technique) keeps counters for each method's invocations and each loop's iterations. When a counter crosses a threshold, the method is queued for compilation on background threads. Most programs spend most of their time in a small fraction of their code, so compiling only hot methods gives most of the speed benefit at a fraction of the compilation cost.

## Tiered compilation

Modern HotSpot uses two JIT compilers in tiers:

| Tier | Compiler | Purpose |
|---|---|---|
| 0 | Interpreter | Run immediately, collect basic counts |
| 1 to 3 | C1 (client compiler) | Compile quickly with light optimization; tiers 2 and 3 also gather detailed profiles |
| 4 | C2 (server compiler) | Compile hot code with aggressive optimization based on profiles |

C1 makes code fast soon; C2 makes the hottest code as fast as possible. Compiled machine code is stored in the **code cache**.

## Profile-guided optimizations

Because the JIT runs while the program executes, it knows things a static compiler doesn't:

- **inlining**: replacing a method call with the method's body, removing call overhead and enabling further optimization. Small, frequently called methods such as getters are almost always inlined
- **branch prediction**: if a condition is almost always false, the common path is laid out for speed
- **devirtualization**: if a call site only ever sees one class, a polymorphic call becomes a direct call
- **loop optimizations**: unrolling loops, hoisting work that doesn't change out of loops, and removing array bounds checks that can be proven unnecessary
- **escape analysis**: objects that never leave a method may be eliminated, with their fields kept in registers
- **dead code elimination**: computations whose results are never used are removed

## Deoptimization

Optimizations rest on assumptions, such as "this call site only sees one class". If an assumption breaks, for example when a new subclass is loaded, the JVM **deoptimizes**: it discards the compiled code and returns to the interpreter for that method, then recompiles with updated information. This makes aggressive, speculative optimization safe.

## Warm-up

A freshly started Java program runs slower for its first seconds, while code is interpreted and compiled. Consequences:

- **benchmarks must warm up**: timing a loop once with \`System.nanoTime()\` mostly measures the interpreter. The JMH (Java Microbenchmark Harness) tool handles warm-up and other pitfalls correctly
- **short programs** may finish before the JIT has done much, so startup time matters more than peak speed for command-line tools
- **long-running servers** reach peak performance after warm-up and stay there

## Reducing startup time

For workloads where startup dominates, alternatives exist:

- **class data sharing** (CDS) stores preprocessed class metadata to load faster
- **GraalVM Native Image** compiles Java ahead of time into a standalone executable that starts in milliseconds, trading some peak performance and dynamic features
- Project Leyden in OpenJDK works on further startup improvements

## Why this matters when writing code

- write clear code: small methods are inlined, so splitting logic into methods costs nothing at runtime
- don't hand-optimize prematurely; the JIT does many low-level optimizations better than manual tricks
- algorithm choice still dominates: the JIT can make an O(n²) loop faster, but not O(n)
- be careful drawing conclusions from naive timing measurements

## Observing the JIT

\`-XX:+PrintCompilation\` prints methods as they're compiled, showing tier levels and deoptimizations. It's a useful way to see the JIT working on your own programs.

## How interviewers test this

Expect "What is the JIT compiler?", "Is Java interpreted or compiled?", "Why does Java get faster after running for a while?" and "Why are microbenchmarks tricky?" Explain bytecode interpretation, hot method detection, C1 and C2 tiers, inlining and other profile-based optimizations, deoptimization, and warm-up.`,
    sources: [JIT_WIKI, JVM_SPEC],
  },

  "execution-engine": {
    theory: `The execution engine is the part of the JVM that actually runs your program. It takes bytecode from loaded classes and executes it through the interpreter and JIT compilers, coordinates with the garbage collector, calls native code when needed, and manages threads. Understanding the engine ties together everything in this module: class loading, stack frames, the heap, GC and JIT compilation. This lesson walks through the JVM's architecture, bytecode execution, method invocation, native methods, and how the pieces cooperate.

## JVM architecture

The JVM has three major subsystems:

1. **Class loader subsystem**: finds, loads, verifies and initializes classes
2. **Runtime data areas**: the memory regions (stacks, heap, method area, program counters)
3. **Execution engine**: interpreter, JIT compilers, garbage collector, and the native interface

## Class loading feeds the engine

Before a method can run, its class must be loaded:

- **loading**: the bootstrap, platform and application class loaders find the \`.class\` file and read its bytes
- **linking**: the bytecode **verifier** checks the code is safe and well formed; memory for static fields is prepared; symbolic references are resolved, often lazily
- **initialization**: static initializers run, once, when the class is first used

Verification is why the engine can trust bytecode: malformed or malicious class files are rejected before execution.

## Bytecode: a stack machine

JVM bytecode is designed for a **stack machine**: instructions push values onto and pop them from the current frame's operand stack. For example, \`int c = a + b;\` compiles to roughly:

~~~
iload_1     // push local variable 1 (a)
iload_2     // push local variable 2 (b)
iadd        // pop two ints, push their sum
istore_3    // pop the sum into local variable 3 (c)
~~~

\`javap -c ClassName\` shows the bytecode for any class, which is a great way to see what the compiler produced. A stack-based design keeps bytecode compact and independent of any CPU's registers, supporting Java's portability.

## The interpreter

The interpreter executes bytecode one instruction at a time, using the thread's program counter to track the current instruction. It starts instantly and collects profiling information, such as invocation counts and which branches are taken, that the JIT compilers later use.

## The JIT compilers

Hot methods are compiled to native code by C1 and then C2, as the JIT lesson describes. The engine switches seamlessly between interpreted and compiled code; a method can even move from interpreted to compiled while running a long loop, a technique called on-stack replacement.

## Method invocation

Bytecode has several call instructions, reflecting Java's kinds of methods:

| Instruction | Used for |
|---|---|
| \`invokestatic\` | Static methods |
| \`invokevirtual\` | Ordinary instance methods, dispatched on the object's runtime class |
| \`invokeinterface\` | Methods called through an interface type |
| \`invokespecial\` | Constructors, private methods, and \`super\` calls |
| \`invokedynamic\` | Lambdas, string concatenation and other dynamically linked calls |

Each invocation pushes a new frame onto the thread's stack; each return pops it. \`invokevirtual\` is how polymorphism works at runtime: the engine finds the method implementation for the object's actual class.

## The garbage collector

The collector is part of the engine's runtime services. Allocation requests from \`new\` are served from the heap; when space runs low, the collector runs, sometimes pausing application threads briefly. The JIT cooperates by recording where references live in compiled code, so the collector can find every live object.

## Native methods and JNI

Some methods are implemented in C or C++ rather than Java, marked with the \`native\` keyword. The **Java Native Interface** (JNI) lets the engine call them, using native method stacks. Core library operations such as file I/O, networking and \`System.arraycopy\` rely on native code. The newer Foreign Function and Memory API (finalized in Java 22) offers a safer, more convenient way to call native libraries.

## Threads

The engine runs many threads at once, each with its own stack and program counter, sharing the heap and method area. Modern Java also supports **virtual threads** (Java 21), lightweight threads managed by the JVM rather than the operating system, which make it practical to run millions of concurrent tasks.

## Exceptions in the engine

When an exception is thrown, the engine searches the current method's exception table for a matching handler. If none is found, it pops the frame and searches the caller, repeating up the stack. If the exception escapes \`main\`, the thread ends and the stack trace is printed. This **stack unwinding** is why a stack trace shows the chain of calls.

## Putting it all together

Running \`java App\`:

1. The JVM starts and initializes the heap, GC and other runtime structures
2. The application class loader loads \`App\`, which is verified and initialized
3. The engine creates the main thread and invokes \`main\` with \`invokestatic\`
4. The interpreter runs main's bytecode, pushing frames for each call
5. Objects are allocated on the heap; the GC reclaims unreachable ones
6. Hot methods are compiled to native code and run faster
7. When main returns and no non-daemon threads remain, the JVM shuts down

## How interviewers test this

Expect "Explain the JVM architecture", "What does the execution engine contain?", "What is bytecode and why is it stack-based?" and "How does the JVM execute a method call?" Describe the three subsystems, class loading and verification, the interpreter and JIT, invoke instructions and frames, GC cooperation, and stack unwinding for exceptions.`,
    sources: [JVM_SPEC, JVM_FRAMES],
  },

  "problem-solving-approach": {
    theory: `Problem solving is the core skill of programming. Syntax can be looked up; working out how to turn a problem statement into a correct, efficient program can't. Good problem solvers follow a repeatable process: understand the problem, explore examples, plan an approach, implement it, and verify it. This lesson presents that process, adapted from George Pólya's classic method, with the habits interviewers look for and the mistakes that cost candidates offers.

## Step 1: understand the problem

Before writing any code, make sure you know exactly what's asked:

- **restate the problem** in your own words
- identify the **inputs**: their types, sizes and ranges
- identify the **output**: its type and format
- clarify **constraints**: can values be negative? can the array be empty? are there duplicates? how large can n be?
- ask about **edge cases** when they aren't specified

In interviews, asking clarifying questions is expected and counts in your favour. Solving the wrong problem perfectly still fails.

## Step 2: work through examples

Examples reveal the pattern and catch misunderstandings:

- solve a small example **by hand**, noting each step you take
- try an **edge case**: empty input, one element, all equal values, the largest values
- try a **tricky case** that could break a naive idea

For "find the second largest number", hand-solving \`{5, 1, 5, 3}\` raises the question of whether duplicates count, which you should then ask about.

## Step 3: plan an approach

Start with any correct approach, even a slow one:

- **brute force**: try every possibility. It's often O(n²) or worse, but it proves you understand the problem and gives a baseline
- **look for patterns**: does the problem resemble one you've solved? Searching, counting, two pointers, prefix sums, sorting first, recursion and hashing solve a huge range of problems
- **estimate complexity**: will the approach finish within limits for the largest input? With n = 10⁵, O(n²) is about 10¹⁰ operations, too slow; O(n log n) is fine
- **optimize**: identify repeated work in the brute force and remove it, often by remembering results in an array or HashMap

Write the plan as pseudocode or a short list of steps before coding. Explaining the plan out loud lets an interviewer correct course early.

## Step 4: implement

- write clean code with meaningful names
- break the solution into small methods where it helps
- handle edge cases explicitly, often with guard clauses at the start
- avoid clever tricks that make the code harder to verify

## Step 5: verify

- **trace** your code by hand on your examples, line by line, without assuming it works
- test edge cases: empty, single element, maximum values, negative numbers
- check for off-by-one errors in loops and index calculations
- check for overflow in sums and products
- state the time and space complexity

Many candidates lose points by declaring "done" without testing. Finding your own bug before the interviewer does is a strong positive signal.

## Step 6: reflect

After solving, ask: could this be simpler or faster? What technique made it work? Recording the pattern helps you recognize it next time. Deliberate review of solved problems builds skill much faster than solving many problems without reflection.

## A worked example

**Problem**: given an array of integers and a target, determine whether any two distinct elements sum to the target.

1. **Understand**: input array and target; output boolean; may contain negatives and duplicates; elements must be at different indices
2. **Examples**: \`{2, 7, 11, 15}\`, target 9 gives true (2 + 7); \`{3}\`, target 6 gives false (only one element)
3. **Brute force**: check every pair with two loops, O(n²)
4. **Optimize**: for each element x, we need to know whether \`target - x\` appeared earlier. A HashSet answers that in O(1):

~~~java
static boolean hasPairWithSum(int[] nums, int target) {
    Set<Integer> seen = new HashSet<>();
    for (int x : nums) {
        if (seen.contains(target - x)) return true;
        seen.add(x);
    }
    return false;
}
~~~

5. **Verify**: trace \`{2, 7, 11, 15}\` with target 9: seen = {2}, then 9 - 7 = 2 is in seen, return true. Single element: loop adds 3, returns false. Complexity: O(n) time, O(n) space

## When you're stuck

- solve a smaller or simpler version of the problem first
- draw the data: arrays as boxes, pointers as arrows
- work backwards from the desired output
- ask what information would make the problem trivial, then find a way to compute it
- explain your thinking aloud; interviewers often give hints when they see your reasoning

## How interviewers test this

Every coding interview tests this process more than any single answer. Clarify before coding, talk through examples, present a brute force then optimize, write clean code, test it yourself, and state complexity. Silence followed by code, even correct code, scores worse than a clearly reasoned solution.`,
    sources: [POLYA, CS50],
  },

  "breaking-problems-into-steps": {
    theory: `Large problems become manageable when broken into smaller ones, each small enough to solve directly. This skill, called **decomposition**, is how professional developers build systems with millions of lines and how strong candidates handle unfamiliar interview problems. This lesson covers top-down decomposition, writing steps as pseudocode, mapping steps to methods, identifying inputs and outputs for each step, and an extended example that goes from problem statement to working code.

## Decomposition

Decomposition means splitting a problem into sub-problems until each one is straightforward:

~~~
Generate a class report card
├── read student data
├── for each student
│   ├── compute total and average
│   ├── assign a grade
│   └── check pass or fail
├── find the class topper
└── print the report
~~~

Each leaf is a small, well-defined task. Solving them one at a time, and combining the results, solves the whole problem.

## Top-down design

Start from the goal and refine downwards:

1. write the main steps in plain language, ignoring details
2. take each step and break it down further if it isn't yet obvious how to code it
3. stop when every step maps to a few lines of code or one method

This keeps you focused on the overall structure first, avoiding the trap of writing detailed code for one part before knowing how the parts fit together.

## Pseudocode

Pseudocode describes steps in structured plain language, without worrying about syntax:

~~~
function isArmstrong(n):
    digits = count digits of n
    sum = 0
    for each digit d of n:
        sum = sum + d raised to the power digits
    return sum == n
~~~

Pseudocode helps you think about logic separately from language details, communicate a plan in interviews before coding, and spot missing steps or edge cases early. Each line usually becomes one to a few lines of code.

## Inputs and outputs for each step

For every sub-problem, decide:

- what it **needs** (inputs)
- what it **produces** (output)
- what it **assumes** (preconditions, such as "the array isn't empty")

Clear interfaces between steps let you test each step on its own and change one without breaking others. These become method signatures:

~~~java
static int countDigits(int n)
static int power(int base, int exp)
static boolean isArmstrong(int n)
~~~

## From steps to methods

Each well-defined step often becomes a method. Small methods with descriptive names make the main logic read like the plan:

~~~java
static boolean isArmstrong(int n) {
    int digits = countDigits(n);
    int sum = 0;
    for (int m = n; m > 0; m /= 10) {
        sum += power(m % 10, digits);
    }
    return sum == n;
}

static int countDigits(int n) {
    if (n == 0) return 1;
    int count = 0;
    for (; n > 0; n /= 10) count++;
    return count;
}

static int power(int base, int exp) {
    int result = 1;
    for (int i = 0; i < exp; i++) result *= base;
    return result;
}
~~~

Each helper is independently testable: \`countDigits(153)\` should be 3, and \`power(5, 3)\` should be 125.

## An extended example

**Problem**: read n student names and marks; print each student's grade (A for 90 and above, B for 75 and above, C for 40 and above, F below 40), the class average, and the topper.

**Step 1: high-level plan**

1. read the data
2. compute and print each grade
3. compute the average
4. find the topper
5. print the summary

**Step 2: define each step**

- \`readMarks\`: reads n, then n name and mark pairs; returns names and marks arrays
- \`gradeFor(int mark)\`: returns a char
- \`average(int[] marks)\`: returns a double
- \`indexOfMax(int[] marks)\`: returns the topper's index

**Step 3: implement and assemble**

~~~java
public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int n = sc.nextInt();
    String[] names = new String[n];
    int[] marks = new int[n];
    for (int i = 0; i < n; i++) {
        names[i] = sc.next();
        marks[i] = sc.nextInt();
    }
    for (int i = 0; i < n; i++) {
        System.out.println(names[i] + ": " + gradeFor(marks[i]));
    }
    System.out.printf("Average: %.2f%n", average(marks));
    System.out.println("Topper: " + names[indexOfMax(marks)]);
}

static char gradeFor(int mark) {
    if (mark >= 90) return 'A';
    if (mark >= 75) return 'B';
    if (mark >= 40) return 'C';
    return 'F';
}

static double average(int[] marks) {
    long sum = 0;
    for (int m : marks) sum += m;
    return marks.length == 0 ? 0 : (double) sum / marks.length;
}

static int indexOfMax(int[] marks) {
    int best = 0;
    for (int i = 1; i < marks.length; i++) if (marks[i] > marks[best]) best = i;
    return best;
}
~~~

**Step 4: test each piece**: \`gradeFor\` at 89, 90, 39 and 40; \`average\` of an empty array; \`indexOfMax\` with ties.

## Incremental development

Build and test one step at a time instead of writing everything and running it at the end. When a bug appears, it's almost certainly in the code you added most recently. Stubs, placeholder methods returning fixed values, let you run the program before every part is finished.

## Recognizing sub-problems you've solved before

Decomposition often reveals familiar pieces: counting, finding a maximum, searching, summing digits, checking primality. Recognizing them lets you reuse known solutions or library methods instead of inventing new ones.

## How interviewers test this

Interviewers watch how you structure solutions. Expect multi-part problems where decomposition matters, such as report generation, Armstrong or perfect numbers, or simulations. Outline steps in pseudocode first, define each helper's inputs and outputs, implement small testable methods, and test pieces individually.`,
    sources: [CS50, POLYA],
  },

  "what-is-recursion": {
    theory: `Recursion is a technique where a method solves a problem by calling itself on a smaller version of the same problem. Each call works on a simpler input until reaching a case small enough to answer directly, called the base case. Recursion is natural for problems with self-similar structure: factorials, tree traversals, nested folders, divide-and-conquer algorithms and backtracking searches. This lesson explains how recursion works, how the call stack supports it, the two required parts, comparisons with loops, and the costs to watch.

## A first example

The factorial of n, written n!, is n × (n − 1) × ... × 1. It's defined in terms of a smaller factorial: n! = n × (n − 1)!, with 1! = 1 (and 0! = 1).

~~~java
static long factorial(int n) {
    if (n <= 1) {
        return 1;                    // base case
    }
    return n * factorial(n - 1);     // recursive case
}
~~~

The code mirrors the mathematical definition directly.

## The two required parts

1. **Base case**: an input small enough to answer without recursion. It stops the recursion
2. **Recursive case**: the method calls itself with a **smaller** input, moving toward the base case, and combines the result

Without a base case, or with a recursive case that doesn't move toward it, the recursion never ends and the program crashes with StackOverflowError.

## How recursion executes

Each call gets its own stack frame with its own copy of \`n\`. Tracing \`factorial(4)\`:

~~~
factorial(4) = 4 * factorial(3)
                   factorial(3) = 3 * factorial(2)
                                      factorial(2) = 2 * factorial(1)
                                                         factorial(1) = 1     (base case)
                                      factorial(2) = 2 * 1 = 2
                   factorial(3) = 3 * 2 = 6
factorial(4) = 4 * 6 = 24
~~~

There are two phases:

- **winding**: calls go deeper, each frame waiting for the next to return
- **unwinding**: base case returns, and each frame completes its multiplication on the way back up

The stack is what lets each level remember its own \`n\` while the deeper calls run.

## Thinking recursively

The key mental step is **trusting the recursive call**. When writing \`factorial(n)\`, assume \`factorial(n - 1)\` already returns the correct answer; then ask only: how do I use it to answer for n? This is the same reasoning as mathematical induction. Trying to trace every level in your head while writing the code leads to confusion; tracing is for verifying afterwards.

## Recursion versus iteration

Factorial can also be written with a loop:

~~~java
static long factorialLoop(int n) {
    long result = 1;
    for (int i = 2; i <= n; i++) result *= i;
    return result;
}
~~~

| | Recursion | Iteration |
|---|---|---|
| Expresses | Self-similar structure directly | Step-by-step repetition |
| Memory | One stack frame per call: O(depth) | Usually O(1) extra |
| Risk | StackOverflowError on deep inputs | Infinite loops |
| Speed | Call overhead per level | Usually slightly faster |
| Best for | Trees, nested data, divide and conquer, backtracking | Linear repetition, counting |

Every recursive algorithm can be converted to an iterative one, sometimes using an explicit stack. For linear problems like factorial, loops are usually preferred in Java. For branching problems like tree traversal or generating permutations, recursion is often far clearer.

## Where recursion shines

- **trees and hierarchies**: file systems, organization charts, HTML documents, binary trees
- **divide and conquer**: merge sort, quick sort and binary search split the problem into halves
- **backtracking**: solving sudoku, generating subsets and permutations, N-Queens
- **mathematical definitions**: Fibonacci, power, greatest common divisor
- **nested structures**: evaluating expressions with parentheses, parsing JSON

## Costs to watch

**Stack depth**: Java's default stack handles thousands of frames, not millions. Recursing once per element of a 100,000-element list can overflow. Java doesn't optimize tail calls, so even tail-recursive methods use one frame per call.

**Repeated work**: naive recursion can recompute the same subproblems many times:

~~~java
static long fib(int n) {
    if (n < 2) return n;
    return fib(n - 1) + fib(n - 2);   // exponential time: fib(40) makes over 300 million calls
}
~~~

Storing results already computed (**memoization**) brings this down to O(n), a first step toward dynamic programming.

## Direct and indirect recursion

**Direct recursion**: a method calls itself. **Indirect** (mutual) recursion: method A calls B, which calls A, as in \`isEven(n)\` calling \`isOdd(n - 1)\` and vice versa. Both follow the same rules.

## How interviewers test this

Expect "What is recursion?", "What are the base case and recursive case?", "What happens without a base case?", "Recursion vs iteration?" and tracing questions. Explain both parts, trace winding and unwinding with stack frames, note StackOverflowError and the exponential Fibonacci trap, and say when recursion is the clearer choice.`,
    sources: [RECURSION_WIKI, MIT_6006],
  },

  "base-case": {
    theory: `The base case is the condition that stops recursion: an input small enough that the method returns an answer directly, without calling itself. Every correct recursive method needs at least one base case, it must be reachable from every valid input, and it must be checked before the recursive call. Most recursion bugs, including StackOverflowError and wrong answers for small inputs, come from missing, misplaced or incorrect base cases. This lesson explains how to choose base cases, common patterns, multiple base cases, and how to verify them.

## Why the base case matters

~~~java
static int sumTo(int n) {
    return n + sumTo(n - 1);          // no base case
}
~~~

\`sumTo(3)\` calls \`sumTo(2)\`, \`sumTo(1)\`, \`sumTo(0)\`, \`sumTo(-1)\`, and so on forever, until the stack fills and Java throws \`StackOverflowError\`. Adding a base case fixes it:

~~~java
static int sumTo(int n) {
    if (n == 0) return 0;             // base case
    return n + sumTo(n - 1);          // recursive case
}
~~~

## Choosing the base case

Ask: **what's the smallest input for which I know the answer immediately?**

| Problem | Natural base case |
|---|---|
| Factorial | n ≤ 1 returns 1 |
| Sum of 1 to n | n == 0 returns 0 |
| Power, base^exp | exp == 0 returns 1 |
| Fibonacci | n < 2 returns n |
| Count digits | n < 10 returns 1 |
| Reverse a string | length ≤ 1 returns the string itself |
| Sum of an array from index i | i == length returns 0 |
| Binary search | low > high returns -1 (not found) |
| GCD(a, b) | b == 0 returns a |

Often the base case is the **empty** or **smallest** version of the input: zero, an empty string, an empty range, a single element.

## The base case must be checked first

The check must come before any recursive call:

~~~java
static int factorial(int n) {
    int smaller = factorial(n - 1);   // recursion happens before the check
    if (n <= 1) return 1;             // never reached in time
    return n * smaller;
}
~~~

This overflows the stack, because the method recurses before it gets a chance to stop. Put base-case checks at the top of the method.

## The base case must be reachable

Every recursive call must move toward a base case. Common failures:

- **wrong direction**: \`sumTo(n + 1)\` moves away from 0
- **skipping over it**: with base case \`n == 0\` and a recursive call \`f(n - 2)\`, odd inputs go 3, 1, -1, -3 and never hit 0. Use \`n <= 0\` instead, or add a base case for 1
- **invalid inputs**: \`factorial(-5)\` with base case \`n == 1\` recurses forever; \`n <= 1\` handles it, or validate input and throw an exception

Using \`<=\` or \`<\` rather than \`==\` in base cases often guards against skipping and negative inputs.

## Multiple base cases

Some problems need more than one:

~~~java
static long fib(int n) {
    if (n == 0) return 0;
    if (n == 1) return 1;
    return fib(n - 1) + fib(n - 2);
}
~~~

Fibonacci's recursive case reaches back two steps, so both 0 and 1 must be base cases. Recursion over two inputs, such as comparing two strings, may need a base case for each running out:

~~~java
static boolean same(String a, String b, int i) {
    if (i == a.length() && i == b.length()) return true;   // both finished
    if (i == a.length() || i == b.length()) return false;  // one finished first
    if (a.charAt(i) != b.charAt(i)) return false;           // mismatch: stop early
    return same(a, b, i + 1);
}
~~~

The mismatch check is a base case too: it returns without recursing.

## Base cases that return early on success

Search problems often have a base case for finding the answer:

~~~java
static boolean contains(int[] arr, int i, int target) {
    if (i == arr.length) return false;       // searched everything: not found
    if (arr[i] == target) return true;       // found: stop
    return contains(arr, i + 1, target);
}
~~~

## Getting the base value right

The base case must return the correct value, not only stop the recursion. For products, the base returns 1; for sums, 0; for counts of empty input, 0; for "all elements satisfy" over an empty range, true. Returning 0 as the base of a product makes every result 0, a common bug.

## Verifying base cases

1. call the method directly with each base-case input and check the answer
2. call it with the smallest non-base input, such as n = 2 for factorial, and trace one level of recursion
3. try edge inputs: 0, negative numbers, empty strings and arrays
4. check that every recursive call strictly shrinks the input

If base cases are correct and every recursive step correctly uses smaller results, the method is correct for all inputs, the same logic as a proof by induction.

## How interviewers test this

Expect "What is a base case and why is it needed?", buggy recursive methods that overflow the stack, and problems where choosing the base case is the key insight. Choose the smallest input with a known answer, check it before recursing, use \`<=\` to guard against skipping, handle multiple base cases when the recursion reaches back several steps, and return the identity value for sums and products.`,
    sources: [RECURSION_WIKI, CS50],
  },

  "recursive-case": {
    theory: `The recursive case is where a recursive method does its real work: it breaks the problem into one or more smaller subproblems, calls itself on them, and combines their results into the answer. Designing it well means finding how the problem relates to smaller versions of itself, making sure every call moves toward a base case, and combining results correctly. This lesson covers the patterns for recursive cases (linear, divide and conquer, branching), the "trust the recursion" mindset, doing work before or after the call, and helper methods with extra parameters.

## The structure

~~~java
returnType solve(input) {
    if (input is a base case) return directAnswer;
    smallerResult = solve(smaller input);
    return combine(input, smallerResult);
}
~~~

Three decisions define a recursive case:

1. **how to shrink** the input
2. **how many** recursive calls to make
3. **how to combine** the results

## Trust the recursion

When designing \`solve(n)\`, assume \`solve(smaller)\` already works. Your only job is to answer: given the correct answer for the smaller input, how do I build the answer for this input?

For the sum of digits: assume \`digitSum(n / 10)\` correctly sums all digits except the last. Then the answer is that plus the last digit:

~~~java
static int digitSum(int n) {
    if (n < 10) return n;
    return digitSum(n / 10) + n % 10;
}
~~~

You never need to trace all levels to write the code; trace afterwards to check it.

## Pattern 1: linear recursion

One recursive call on an input smaller by one step:

~~~java
static int sum(int[] arr, int i) {
    if (i == arr.length) return 0;
    return arr[i] + sum(arr, i + 1);        // first element + sum of the rest
}

static String reverse(String s) {
    if (s.length() <= 1) return s;
    return reverse(s.substring(1)) + s.charAt(0);   // reverse of the rest, then the first char
}
~~~

Depth equals the input size, so these use O(n) stack space. In Java, loops are usually better for linear problems, but they're the best way to learn the pattern.

## Pattern 2: divide and conquer

Split the input into halves, solve each, and combine:

~~~java
static long power(long base, int exp) {
    if (exp == 0) return 1;
    long half = power(base, exp / 2);       // solve the half-size problem once
    return exp % 2 == 0 ? half * half : half * half * base;
}
~~~

Halving the exponent each time gives O(log n) calls instead of O(n). Binary search and merge sort follow the same idea. Note that \`half\` is computed once and reused; calling \`power(base, exp / 2)\` twice would throw away the speedup.

## Pattern 3: branching recursion

Several recursive calls per level, exploring choices:

~~~java
static void subsets(String s, int i, String current) {
    if (i == s.length()) {
        System.out.println("[" + current + "]");
        return;
    }
    subsets(s, i + 1, current + s.charAt(i));   // include character i
    subsets(s, i + 1, current);                  // exclude character i
}
// subsets("ab", 0, "") prints [ab], [a], [b], []
~~~

Each level makes two calls, so there are 2ⁿ results for n characters. Branching recursion powers backtracking problems: permutations, combinations, sudoku and path finding. Its cost grows quickly, so it suits small inputs or needs pruning.

## Work before or after the call

Where you do work relative to the recursive call changes the behaviour:

~~~java
static void countDown(int n) {
    if (n == 0) return;
    System.out.print(n + " ");     // before: prints on the way down
    countDown(n - 1);
}
// countDown(3): 3 2 1

static void countUp(int n) {
    if (n == 0) return;
    countUp(n - 1);
    System.out.print(n + " ");     // after: prints on the way back up
}
// countUp(3): 1 2 3
~~~

Work before the call happens during winding; work after happens during unwinding. This explains why printing a number's digits recursively comes out in the right order when you print after the call.

## Helper methods with extra parameters

The natural public signature often lacks the state recursion needs, such as a current index. A private helper carries it:

~~~java
public static boolean isPalindrome(String s) {
    return isPalindrome(s, 0, s.length() - 1);
}

private static boolean isPalindrome(String s, int left, int right) {
    if (left >= right) return true;
    if (s.charAt(left) != s.charAt(right)) return false;
    return isPalindrome(s, left + 1, right - 1);
}
~~~

Passing indices instead of creating substrings also avoids copying characters at every level.

## Making progress

Every recursive call must receive a strictly smaller input: a smaller number, a shorter range, fewer remaining choices. If any path can call with the same or larger input, recursion may never end.

## Combining results correctly

- sums combine with \`+\` and products with \`*\`
- "any" questions combine with \`||\`, short-circuiting when one call succeeds
- "all" questions combine with \`&&\`
- max and min combine with \`Math.max\` and \`Math.min\`
- counts of ways add the counts from each branch

## Complexity of recursive cases

Count calls and work per call: linear recursion is O(n) calls; halving is O(log n); two branches per level is O(2ⁿ) unless repeated subproblems are cached. Stack space equals the maximum depth.

## How interviewers test this

Expect writing recursive solutions for sum of digits, power, palindrome, reverse and subsets, plus output questions on printing before versus after the call. Show the trust-the-recursion reasoning, choose linear, halving or branching patterns, use helper methods with indices, and analyse calls and stack depth.`,
    sources: [RECURSION_WIKI, MIT_6006],
  },

  "basic-recursion-problems": {
    theory: `A core set of recursion problems appears constantly in placement tests and early interviews: factorial, Fibonacci, sum of digits, power, reversing strings, palindromes, GCD, printing sequences, array sums and binary search. Each one is small, but together they train every recursion skill: choosing base cases, shrinking the input, combining results and analysing cost. This lesson works through the classic problems with clean solutions, traces, complexity and the pitfalls interviewers probe.

## Factorial

~~~java
static long factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}
~~~

O(n) time and O(n) stack depth. Using \`long\` handles up to 20!; 21! overflows, so larger values need \`BigInteger\`. Negative inputs should be rejected with an exception.

## Fibonacci, naive and memoized

~~~java
static long fib(int n) {
    if (n < 2) return n;
    return fib(n - 1) + fib(n - 2);
}
~~~

Correct but exponential: each call branches into two, and the same values are recomputed many times. \`fib(5)\` computes \`fib(2)\` three times; \`fib(45)\` takes noticeable time. Memoization stores each result once:

~~~java
static long fibMemo(int n, long[] memo) {
    if (n < 2) return n;
    if (memo[n] != 0) return memo[n];
    return memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
}
// call with: fibMemo(n, new long[n + 1])
~~~

Now each value is computed once: O(n) time. This is the gateway to dynamic programming. An iterative version with two variables uses O(1) space.

## Sum of digits

~~~java
static int digitSum(int n) {
    if (n < 10) return n;
    return n % 10 + digitSum(n / 10);
}
~~~

\`digitSum(4729)\`: 9 + digitSum(472) = 9 + 2 + digitSum(47) = ... = 22. The number of calls equals the number of digits, O(log₁₀ n).

## Power with fast exponentiation

~~~java
static long power(long base, int exp) {
    if (exp == 0) return 1;
    long half = power(base, exp / 2);
    return (exp % 2 == 0) ? half * half : half * half * base;
}
~~~

O(log exp) calls instead of O(exp). Computing \`half\` once is essential; calling \`power(base, exp / 2)\` twice would bring back O(exp) time.

## Reverse a string

~~~java
static String reverse(String s) {
    if (s.length() <= 1) return s;
    return reverse(s.substring(1)) + s.charAt(0);
}
~~~

Clear, but each \`substring\` and concatenation copies characters, making it O(n²). An index-based version with a char array, swapping ends and recursing inward, is O(n). In practice, \`new StringBuilder(s).reverse()\` is the right tool; the recursive version tests understanding.

## Palindrome check

~~~java
static boolean isPalindrome(String s, int left, int right) {
    if (left >= right) return true;
    if (s.charAt(left) != s.charAt(right)) return false;
    return isPalindrome(s, left + 1, right - 1);
}
~~~

Two base cases: the pointers meet (success) or a mismatch (failure). O(n) time, O(n) stack depth.

## Greatest common divisor

Euclid's algorithm: gcd(a, b) = gcd(b, a mod b), and gcd(a, 0) = a.

~~~java
static int gcd(int a, int b) {
    if (b == 0) return a;
    return gcd(b, a % b);
}
~~~

\`gcd(48, 18)\` becomes gcd(18, 12), gcd(12, 6), gcd(6, 0) = 6. It runs in O(log min(a, b)) steps, one of the oldest and most efficient algorithms known. The least common multiple follows: \`lcm(a, b) = a / gcd(a, b) * b\`, dividing first to reduce overflow risk.

## Print 1 to n and n to 1

~~~java
static void printUp(int n) {
    if (n == 0) return;
    printUp(n - 1);
    System.out.print(n + " ");
}

static void printDown(int n) {
    if (n == 0) return;
    System.out.print(n + " ");
    printDown(n - 1);
}
~~~

The only difference is whether printing happens before or after the recursive call, a favourite output question.

## Sum and max of an array

~~~java
static int sum(int[] arr, int i) {
    if (i == arr.length) return 0;
    return arr[i] + sum(arr, i + 1);
}

static int max(int[] arr, int i) {
    if (i == arr.length - 1) return arr[i];
    return Math.max(arr[i], max(arr, i + 1));
}
~~~

Index parameters avoid copying the array. \`max\` assumes a non-empty array; its base case is the last element.

## Recursive binary search

~~~java
static int search(int[] arr, int target, int low, int high) {
    if (low > high) return -1;
    int mid = low + (high - low) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) return search(arr, target, mid + 1, high);
    return search(arr, target, low, mid - 1);
}
~~~

O(log n) calls, each halving the range. The iterative version avoids stack use, but the recursive one shows divide and conquer clearly.

## Tower of Hanoi

Move n disks from peg A to C using B: move n − 1 disks to B, move the largest to C, then move n − 1 from B to C.

~~~java
static void hanoi(int n, char from, char to, char via) {
    if (n == 0) return;
    hanoi(n - 1, from, via, to);
    System.out.println("Move disk " + n + " from " + from + " to " + to);
    hanoi(n - 1, via, to, from);
}
~~~

It makes 2ⁿ − 1 moves, a classic example of a problem that's natural recursively and awkward iteratively.

## Complexity summary

| Problem | Calls | Stack depth |
|---|---|---|
| Factorial, sum to n, array sum | O(n) | O(n) |
| Naive Fibonacci | O(2ⁿ) | O(n) |
| Memoized Fibonacci | O(n) | O(n) |
| Power (halving), binary search | O(log n) | O(log n) |
| GCD | O(log min(a, b)) | O(log min(a, b)) |
| Tower of Hanoi | O(2ⁿ) | O(n) |

## How interviewers test this

Expect to write several of these from scratch, trace one by hand, explain why naive Fibonacci is slow and fix it with memoization, and state time and stack complexity. Start every solution with the base case, keep the recursive step on a strictly smaller input, use index parameters instead of copying, and mention iterative alternatives where recursion depth could be a problem.`,
    sources: [RECURSION_WIKI, MIT_6006],
  },
};
