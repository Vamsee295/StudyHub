// Module 9 - Memory & Execution (6 lessons)
import { CourseLessonContent } from './types';

export const memoryExecutionLessons: Array<{
  slug: string;
  title: string;
  content: CourseLessonContent
}> = [
  {
    slug: "memory-execution-overview",
    title: "Memory & Execution Overview",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `what-is-programming`, variables, primitive vs reference types, methods, and call stack behavior."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of the Java Virtual Machine (JVM) as a **High-Tech Autonomous Manufacturing Campus**:\n• **Blueprint Archive (Metaspace / Method Area)**: Stores class definitions, method bytecodes, and static field constants.\n• **Worker Assembly Desks (JVM Stack)**: Each executing thread has its own private desk. Every method call places a temporary tray (**Stack Frame**) holding local parameters and scratch notes.\n• **The Central Warehouse (Heap)**: A massive shared floor where all bulky products (**Objects and Arrays**) are constructed and stored.\n• **Power Turbines & Robots (Execution Engine)**: Reads assembly instructions (Bytecode), translates them into raw electrical pulses (Native CPU machine code), and dispatches automated street sweepers (**Garbage Collector**) to shred discarded parts."
        },
        {
          type: "callout",
          title: "The Write Once, Run Anywhere (WORA) Architecture",
          content: "Java achieves platform independence through a 2-stage lifecycle:\n1. **Compile Time (`javac`)**: Translates human-readable `.java` source code into platform-neutral **Bytecode** (`.class` files).\n2. **Runtime (`java` / JVM)**: The JVM loads bytecode, validates security invariants via the Bytecode Verifier, and executes it on the target operating system (Windows, Linux, macOS, ARM/x86)."
        },
        {
          type: "code",
          title: "Anatomy of JVM Memory: Tracing Code to Memory Regions",
          code: "public class MemoryMapDemo {\n    // 1. METASPACE: Class metadata, bytecode, and static variables\n    public static final String APP_NAME = \"StudyHubEngine\";\n    private static int totalInstances = 0;\n\n    // 2. HEAP: Instance fields stored inside the object payload\n    private int userId;\n    private String username;\n\n    public MemoryMapDemo(int id, String name) {\n        this.userId = id;\n        this.username = name; // Reference to String on Heap\n        totalInstances++;\n    }\n\n    // 3. JVM STACK: Local variables allocated inside method stack frame\n    public static void main(String[] args) {\n        int localCounter = 42; // Primitive: stored directly in Stack Frame\n        \n        // 'userRef' pointer lives in Stack Frame; 'new MemoryMapDemo' payload lives in Heap\n        MemoryMapDemo userRef = new MemoryMapDemo(101, \"Alice\");\n\n        System.out.println(APP_NAME + \" | User: \" + userRef.username);\n    }\n}",
          language: "java",
          explanation: "Static fields live in Metaspace/Method Area. Local variables ('localCounter', 'userRef') live on the thread's Stack Frame. The MemoryMapDemo instance and the String 'Alice' live on the Heap."
        },
        {
          type: "table",
          title: "JVM Runtime Data Areas: Architectural Breakdown",
          headers: ["Memory Region", "Thread Scope", "Contents Stored", "Error Thrown on Depletion"],
          rows: [
            ["JVM Stack", "Thread-Private", "Stack frames (Local variables, operand stack, return addresses)", "`StackOverflowError`"],
            ["Heap Memory", "Shared by All Threads", "All class instances (Objects), arrays, and String pool objects", "`OutOfMemoryError: Java heap space`"],
            ["Metaspace (Method Area)", "Shared by All Threads", "Class metadata, bytecode definitions, runtime constant pool, static fields", "`OutOfMemoryError: Metaspace`"],
            ["PC Register (Program Counter)", "Thread-Private", "Memory address of the currently executing bytecode instruction", "None (Fixed hardware-level size)"],
            ["Native Method Stack", "Thread-Private", "State for C/C++ native system calls (via JNI)", "`StackOverflowError` / `OutOfMemoryError`"]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Identify Stack vs Heap Variables",
          code: "class MemoryTest {\n    int instanceNum = 10; // Heap\n    static int globalCount = 99; // Metaspace\n\n    public static void compute(int param) { // Stack\n        int localVar = 50; // Stack\n        MemoryTest obj = new MemoryTest(); // obj reference: Stack, instance: Heap\n        System.out.println(localVar + obj.instanceNum + param);\n    }\n\n    public static void main(String[] args) {\n        compute(5);\n    }\n}",
          expectedOutput: "65",
          explanation: "localVar (50) + obj.instanceNum (10) + param (5) = 65."
        },
        {
          type: "dryRun",
          title: "Lifecycle Trace: From Source Code to Execution",
          iterations: [
            { step: 1, variables: { "Phase": "Compilation", "Tool": "javac App.java" }, description: "Emits platform-independent App.class containing Java bytecode." },
            { step: 2, variables: { "Phase": "Class Loading", "Subsystems": "Loading -> Linking -> Initialization" }, description: "Loads .class binary, verifies bytecode safety, allocates static fields in Metaspace." },
            { step: 3, variables: { "Phase": "Thread Startup", "Action": "Allocates main() Thread Stack & PC Register" }, description: "Pushes main() frame onto JVM Stack and starts Bytecode Interpreter." },
            { step: 4, variables: { "Phase": "Dynamic Allocation", "Action": "Heap allocation on 'new'" }, description: "Allocates object on Heap, initializes fields, returns heap memory pointer to stack reference." },
            { step: 5, variables: { "Phase": "Hot Spot Compilation", "Engine": "JIT Compiler (C1/C2)" }, description: "Compiles frequently called methods to native machine instructions for zero-overhead execution." }
          ]
        },
        {
          type: "warning",
          title: "Common Memory Architecture Misconceptions",
          items: [
            "**Believing Primitives Always Live on Stack**: If an `int` is an instance field of a class (e.g. `private int age;`), it lives on the **Heap** inside the object payload, not on the Stack.",
            "**Assuming Java Memory is Manually Freed**: Java does not have `free()` or `delete`. The Garbage Collector automatically manages Heap memory.",
            "**Confusing StackOverflowError with OutOfMemoryError**: `StackOverflowError` occurs when method call frames exceed stack memory limits. `OutOfMemoryError` occurs when heap/metaspace cannot allocate new objects."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Metaspace vs Legacy PermGen",
          traps: [
            {
              question: "What replaced PermGen (Permanent Generation) in Java 8, where does it reside, and why was this architectural change made?",
              trap: "Claiming PermGen was moved to the Java Heap.",
              solution: "In Java 8, **PermGen was completely removed and replaced by Metaspace**. Key differences:\n• **Location**: PermGen was part of the contiguous JVM Heap with a fixed default maximum size (`-XX:MaxPermSize`), frequently triggering `java.lang.OutOfMemoryError: PermGen space`.\n• **Metaspace**: Resides in **Native OS Memory (off-heap)** and auto-expands by default up to available host RAM (controllable via `-XX:MaxMetaspaceSize`), eliminating premature class metadata OOM crashes during heavy reflection and dynamic proxy loading."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Where are reference variables (the pointer itself) declared inside a method stored in JVM memory?",
          options: [
            "Heap Memory",
            "JVM Stack Memory",
            "Metaspace",
            "Native Method Stack"
          ],
          answer: 1,
          explanation: "Local reference variables inside a method live in the JVM Stack Frame. The actual object they point to lives on the Heap."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "JVM memory is split into Stack (thread-private method frames) and Heap (shared objects/arrays).",
            "Metaspace lives in native OS memory to store class definitions, bytecode, and static fields.",
            "StackOverflowError = Call stack depth exhausted; OutOfMemoryError = Heap/Metaspace capacity exhausted.",
            "Instance variables of primitives live inside their parent object on the Heap."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we dive deep into Stack Memory, examining stack frame anatomy, local variable arrays, operand stacks, and stack overflow prevention."
        }
      ]
    }
  },
  {
    slug: "stack-memory",
    title: "Stack Memory & Call Frames",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `memory-execution-overview`, `methods`, scope, and recursion mechanics."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of Stack Memory as a **LIFO Spring-Loaded Cafeteria Tray Cart**:\n• When a method is called, a new tray (**Stack Frame**) is pushed onto the top of the stack.\n• The tray has dedicated compartments for: **Local Variables**, an **Operand Scratchpad** for math, and a **Return Address Ticket**.\n• The CPU can only access the topmost active tray. When the method finishes (`return`), the tray is popped off in $O(1)$ time, and memory is instantly recycled."
        },
        {
          type: "callout",
          title: "Anatomy of a Stack Frame",
          content: "Every JVM Stack Frame consists of 3 distinct internal sections:\n1. **Local Variable Array (LVA)**: 0-indexed table storing method parameters and local variables (`this` reference occupies slot 0 in instance methods).\n2. **Operand Stack**: Push-down LIFO work area used to evaluate arithmetic expressions and pass arguments to child methods.\n3. **Frame Data**: Holds references to the Runtime Constant Pool, method return addresses, and exception dispatch tables."
        },
        {
          type: "code",
          title: "Stack Frame Push & Pop Lifecycle in Action",
          code: "public class StackTraceDemo {\n    public static int multiply(int x, int y) {\n        // Frame 3: multiply(x=6, y=7)\n        int product = x * y; // Pushes x and y to Operand Stack, executes 'imul', stores in product\n        return product;\n    }\n\n    public static int calculateSquare(int val) {\n        // Frame 2: calculateSquare(val=6)\n        int result = multiply(val, 7); // Pauses Frame 2; pushes Frame 3\n        return result;\n    }\n\n    public static void main(String[] args) {\n        // Frame 1: main(args)\n        int num = 6;\n        int answer = calculateSquare(num); // Pauses Frame 1; pushes Frame 2\n        System.out.println(\"Answer: \" + answer); // 42\n    }\n}",
          language: "java",
          explanation: "main() pushes Frame 1 -> calls calculateSquare() pushing Frame 2 -> calls multiply() pushing Frame 3. When multiply() returns 42, Frame 3 is popped, resuming Frame 2, which completes and resumes main()."
        },
        {
          type: "table",
          title: "Local Variable Array (LVA) Slot Allocation Rules",
          headers: ["Data Type", "Slot Width Required", "Slot 0 in Instance Method", "Slot 0 in Static Method"],
          rows: [
            ["`int`, `float`, `boolean`, `char`, `short`, `byte`", "1 Slot (4 Bytes)", "`this` reference", "First Method Parameter"],
            ["`reference` (`Object`, `String`, `int[]`)", "1 Slot (4/8 Bytes pointer)", "`this` reference", "First Method Parameter"],
            ["`long`, `double`", "2 Consecutive Slots (8 Bytes)", "`this` reference", "First Method Parameter"]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Predict Stack Frame Resolution Order",
          code: "class StackOrder {\n    public static int stepA() { return 10; }\n    public static int stepB() { return stepA() + 5; }\n    public static void main(String[] args) {\n        System.out.println(stepB());\n    }\n}",
          expectedOutput: "15",
          explanation: "main pushes stepB -> stepB pushes stepA -> stepA returns 10 (popped) -> stepB computes 10+5=15 (popped) -> main prints 15."
        },
        {
          type: "dryRun",
          title: "Stack Frame State Trace for `multiply(6, 7)`",
          iterations: [
            { step: 1, variables: { "Stack Top": "multiply()", "LVA": "[slot0: 6 (x), slot1: 7 (y), slot2: uninit]" }, description: "Frame pushed. Parameters mapped into Local Variable Array." },
            { step: 2, variables: { "Operand Stack": "[6, 7]", "Instruction": "iload_0; iload_1" }, description: "Pushes x and y onto Operand Stack for execution." },
            { step: 3, variables: { "Operand Stack": "[42]", "Instruction": "imul" }, description: "Pops 6 and 7, multiplies on CPU ALU, pushes 42 onto Operand Stack." },
            { step: 4, variables: { "LVA": "[slot0: 6, slot1: 7, slot2: 42 (product)]", "Instruction": "istore_2" }, description: "Pops 42 from Operand Stack into LVA slot 2 (product)." },
            { step: 5, variables: { "Action": "ireturn -> Frame Popped", "Returned": "42" }, description: "Delivers 42 back to calculateSquare() caller; Frame memory instantly deallocated." }
          ]
        },
        {
          type: "warning",
          title: "Common Stack Traps & Pitfalls",
          items: [
            "**Attempting to Share Stack Variables Between Threads**: Stacks are 100% thread-private. Thread A cannot read or modify Thread B's stack frame local variables.",
            "**Tuning `-Xss` Carelessly**: Setting the thread stack size too low (e.g. `-Xss128k`) causes premature `StackOverflowError` in deep frameworks (Spring/Hibernate), while setting it too high wastes virtual memory when running thousands of threads.",
            "**Assuming Stacks are Garbage Collected**: Stack frames are popped deterministically at method exit; they require ZERO garbage collection overhead."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Is Stack Memory Garbage Collected?",
          traps: [
            {
              question: "Does the Java Garbage Collector clean up unused stack frames and local variables?",
              trap: "Answering yes, believing the GC cleans all JVM memory.",
              solution: "NO. **The Garbage Collector NEVER touches the JVM Stack**. Stack memory is managed purely by the CPU Program Counter and method invocation lifecycle. When a method returns, its stack frame pointer decrements ($O(1)$ pop), instantly invalidating that memory with zero GC scanning overhead."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "In a non-static instance method, what occupies Slot 0 of the Local Variable Array?",
          options: [
            "The first parameter passed to the method",
            "The return value placeholder",
            "The `this` reference pointing to the invoking object",
            "The method name String"
          ],
          answer: 2,
          explanation: "In instance methods, the JVM automatically places the `this` reference to the current object in LVA Slot 0, allowing instance fields and methods to be accessed."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Stack memory is thread-isolated and organized in LIFO Stack Frames.",
            "Each stack frame contains Local Variable Array, Operand Stack, and Frame Data.",
            "Stack memory is deallocated deterministically in $O(1)$ time upon method return with zero GC involvement.",
            "Configured per-thread via the `-Xss` JVM flag (default 1MB on 64-bit platforms)."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Heap Memory & Object Allocation, learning how the JVM manages dynamic objects, object headers, and generational heap structures."
        }
      ]
    }
  },
  {
    slug: "heap-memory",
    title: "Heap Memory & Object Allocation",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `stack-memory`, object creation using `new`, references, and arrays."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of Heap Memory as a **Sprawling Amazon Fulfillment Warehouse Floor**:\n• While stack frames are tiny personal desks, the **Heap** is a massive, globally shared space where all bulky items (**Objects & Arrays**) live.\n• When you call `new Order()`, a forklift carves out contiguous memory blocks on the warehouse floor and gives you a barcode ticket (**Reference Address**) to hold at your desk.\n• If multiple workers (threads) hold copies of that barcode ticket, they all look at and modify the exact same physical package on the heap."
        },
        {
          type: "callout",
          title: "Generational Heap Architecture",
          content: "Modern JVM heaps are divided into generations based on the **Weak Generational Hypothesis** (most objects die within milliseconds of creation):\n1. **Young Generation**:\n   • **Eden Space**: Where 99% of brand-new objects are born.\n   • **Survivor Spaces ($S_0$ and $S_1$)**: Two alternating buffers where surviving objects bounce during Minor GC cycles.\n2. **Old (Tenured) Generation**: Holds long-lived objects that survived multiple GC aging thresholds (default: 15 cycles) or large objects."
        },
        {
          type: "code",
          title: "Heap Object Structure & Reference Binding",
          code: "public class HeapStructureDemo {\n    // Object payload lives on the HEAP\n    static class Student {\n        int id;             // 4 bytes primitive\n        String name;        // 4/8 bytes reference pointer to String object\n        double gpa;         // 8 bytes primitive\n\n        Student(int id, String name, double gpa) {\n            this.id = id;\n            this.name = name;\n            this.gpa = gpa;\n        }\n    }\n\n    public static void main(String[] args) {\n        // s1 pointer lives on Stack; Student object lives on Heap\n        Student s1 = new Student(101, \"Bob\", 3.85);\n        \n        // s2 gets a COPY of the pointer; points to the EXACT SAME Heap object\n        Student s2 = s1;\n        s2.gpa = 4.0;\n\n        System.out.println(\"s1 GPA: \" + s1.gpa); // 4.0 (Mutated via s2!)\n    }\n}",
          language: "java",
          explanation: "Both s1 and s2 stack references point to the single Student object on the Heap. Modifying s2.gpa updates the shared heap memory."
        },
        {
          type: "table",
          title: "Stack Memory vs Heap Memory: Structural Comparison",
          headers: ["Attribute", "JVM Stack", "Heap Memory"],
          rows: [
            ["Access Model", "Thread-Private (Isolated per thread)", "Globally Shared across all threads"],
            ["Lifecycle", "Deterministic (destroyed on method return)", "Dynamic (managed by Garbage Collector)"],
            ["Allocation Speed", "Extremely fast ($O(1)$ pointer push)", "Fast via TLABs, requires GC compaction"],
            ["Data Stored", "Stack frames, primitive locals, reference pointers", "Objects, arrays, boxed wrappers, String objects"],
            ["Size Limits", "Typically 1MB per thread (`-Xss`)", "Gigabytes to Terabytes (`-Xms`, `-Xmx`)"],
            ["Fragmentation", "No fragmentation (LIFO stack)", "Subject to memory fragmentation (repaired by GC compaction)"]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Number of Heap Objects Created",
          code: "class ObjectCounter {\n    public static void main(String[] args) {\n        String a = new String(\"Hello\"); // Heap object\n        String b = new String(\"World\"); // Heap object\n        int[] arr = new int[5];          // Heap array object\n        int x = 100;                     // Stack primitive\n        System.out.println(\"Allocated successfully!\");\n    }\n}",
          expectedOutput: "Allocated successfully!",
          explanation: "3 separate heap objects are allocated: 2 distinct String objects and 1 integer array object. 'x' is a stack primitive."
        },
        {
          type: "dryRun",
          title: "Object Aging & Promotion Trace (Eden -> Survivor -> Old Gen)",
          iterations: [
            { step: 1, variables: { "Object State": "new User()", "Location": "Eden Space (Young Gen)" }, description: "Object is created in Eden space during normal application execution." },
            { step: 2, variables: { "Trigger": "Eden fills up", "Action": "Minor GC runs" }, description: "Live User object survives Minor GC; copied to Survivor Space S0 with age header set to 1." },
            { step: 3, variables: { "Trigger": "Next Minor GC", "Action": "Copied S0 -> S1" }, description: "User object survives again; copied from S0 to S1 with age incremented to 2." },
            { step: 4, variables: { "Trigger": "Reaches Tenuring Threshold (e.g. 15)", "Action": "Promotion" }, description: "Object is promoted to Old (Tenured) Generation for long-term residency." }
          ]
        },
        {
          type: "warning",
          title: "Heap Memory Pitfalls",
          items: [
            "**Memory Leaks via Static Collections**: Adding objects to `static List` or `static Map` prevents them from ever being garbage collected, causing `OutOfMemoryError: Java heap space`.",
            "**Creating Giant Temporary Arrays**: Allocating huge arrays (e.g. `new int[100_000_000]`) can fail instantly if contiguous heap space is unavailable.",
            "**Unnecessary Object Instantiation Inside Loops**: Calling `new String()` or `new Object()` inside loops with millions of iterations stresses Eden space and triggers frequent GC pauses."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Escape Analysis & Scalar Replacement",
          traps: [
            {
              question: "Do ALL Java objects allocated with the `new` keyword strictly reside on the Heap?",
              trap: "Answering yes, assuming 'new' ALWAYS allocates heap memory.",
              solution: "In modern HotSpot JVMs, **NO!** Through **Escape Analysis**, the JIT compiler analyzes if an object never escapes the method scope where it was created. If it does not escape, the JIT optimizes it via **Scalar Replacement**, breaking the object into its primitive fields and allocating them directly on the **JVM Stack** or CPU registers, completely bypassing heap allocation and GC overhead!"
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Where are brand-new objects initially allocated in the JVM Heap by default?",
          options: [
            "Old (Tenured) Generation",
            "Survivor Space S1",
            "Eden Space in Young Generation",
            "Metaspace"
          ],
          answer: 2,
          explanation: "Newly created objects are allocated in the Eden space of the Young Generation. Only if they survive multiple GC cycles are they promoted to Survivor spaces and eventually the Old Generation."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Heap memory is shared by all threads and holds all objects, arrays, and class instances.",
            "Structured into Generational spaces: Young Gen (Eden, S0, S1) and Old/Tenured Gen.",
            "Configured via `-Xms` (initial heap) and `-Xmx` (maximum heap) JVM options.",
            "Escape Analysis allows the JIT compiler to allocate non-escaping objects on the stack instead of the heap."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Garbage Collection, understanding GC roots, reachability graphs, mark-sweep-compact cycles, and modern collector algorithms."
        }
      ]
    }
  },
  {
    slug: "garbage-collection",
    title: "Garbage Collection & Lifecycle",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `heap-memory`, object references, null assignment, and scope termination."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of Garbage Collection as an **Automated City Sanitation Drone Fleet**:\n• Residents (threads) place furniture (objects) in communal courtyards (Heap).\n• As long as an item is tied with a visible rope (**Reference Chain**) to a public power pole (**GC Root**), the drone leaves it alone.\n• The moment all ropes are severed or tied in an isolated disconnected circle, the sanitation drones tag the furniture as garbage, shred it, and compact the open courtyard space for new residents."
        },
        {
          type: "callout",
          title: "What Qualifies as a GC Root?",
          content: "An object is **Reachable (Alive)** if a direct reference path exists from at least one **GC Root**:\n1. **Local Variables in active Stack Frames** (current executing methods).\n2. **Active Thread Objects** running in the JVM.\n3. **Static Variables** loaded in Metaspace.\n4. **JNI (Java Native Interface)** global/local C references."
        },
        {
          type: "code",
          title: "How Objects Become Eligible for Garbage Collection",
          code: "public class GCDemo {\n    static class Node {\n        String name;\n        Node next;\n        Node(String name) { this.name = name; }\n    }\n\n    public static void main(String[] args) {\n        // Case 1: Nulling Reference\n        Node a = new Node(\"Alpha\");\n        a = null; // \"Alpha\" is now disconnected from GC Roots -> ELIGIBLE FOR GC\n\n        // Case 2: Reassigning Reference\n        Node b = new Node(\"Beta\");\n        b = new Node(\"Gamma\"); // \"Beta\" has no references left -> ELIGIBLE FOR GC\n\n        // Case 3: Circular Island of Isolation\n        Node x = new Node(\"X\");\n        Node y = new Node(\"Y\");\n        x.next = y; // x points to y\n        y.next = x; // y points to x\n        x = null;   // Sever root to x\n        y = null;   // Sever root to y\n        // Both x and y point to each other, but NEITHER is reachable from a GC Root!\n        // -> BOTH ARE ELIGIBLE FOR GC!\n    }\n}",
          language: "java",
          explanation: "Java does NOT use reference counting; it uses Reachability Analysis (Tracing). The circular reference between x and y does not prevent GC because neither is reachable from any live GC Root."
        },
        {
          type: "table",
          title: "Modern JVM Garbage Collectors Comparison",
          headers: ["Collector", "Architecture", "Target Use Case", "Pause Time Characteristics"],
          rows: [
            ["Serial GC (`-XX:+UseSerialGC`)", "Single-threaded, Stop-The-World (STW)", "Small single-core apps, CLI utilities", "Long STW pauses on large heaps"],
            ["Parallel GC (`-XX:+UseParallelGC`)", "Multi-threaded throughput-focused", "Batch processing, background scientific computing", "Medium STW pauses, high CPU utilization"],
            ["G1 GC (`-XX:+UseG1GC`)", "Regionized heap, concurrent marking", "Default server collector (Java 9+), large heaps (4GB-64GB)", "Predictable, low pause times (target ~200ms)"],
            ["ZGC / Shenandoah (`-XX:+UseZGC`)", "Ultra-low latency, concurrent compaction", "High-frequency trading, real-time gaming, massive heaps (>100GB)", "Sub-millisecond max pauses (<1ms) regardless of heap size"]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Identify GC Eligibility",
          code: "class GCTest {\n    public static void main(String[] args) {\n        String s1 = new String(\"Data1\");\n        String s2 = new String(\"Data2\");\n        s1 = s2;\n        // How many objects are eligible for GC here?\n        System.out.println(s1 + \" \" + s2);\n    }\n}",
          expectedOutput: "Data2 Data2",
          explanation: "The original \"Data1\" object lost its only reference when s1 was reassigned to s2. Exactly 1 object (\"Data1\") became eligible for GC."
        },
        {
          type: "dryRun",
          title: "Garbage Collection 3-Phase Lifecycle Trace",
          iterations: [
            { step: 1, variables: { "Phase": "1. Mark", "Action": "Traverse from GC Roots" }, description: "Scans all active thread stacks and static references, tagging all live reachable objects." },
            { step: 2, variables: { "Phase": "2. Sweep", "Action": "Reclaim dead object memory" }, description: "Identifies untagged memory slots on the heap and adds their addresses to free memory lists." },
            { step: 3, variables: { "Phase": "3. Compact", "Action": "Defragment contiguous heap" }, description: "Slides surviving objects together to one end of the heap, eliminating holes and enabling fast pointer-bump allocations." }
          ]
        },
        {
          type: "warning",
          title: "Common Garbage Collection Misconceptions",
          items: [
            "**Relying on `System.gc()`**: `System.gc()` is only an advisory suggestion to the JVM. The JVM is free to ignore it, and calling it in production triggers unnecessary Full GC Stop-the-World pauses.",
            "**Using `finalize()` for Resource Cleanup**: `Object.finalize()` is deprecated and dangerous because there is no guarantee when or if it will ever run. Use `try-with-resources` (`AutoCloseable`) instead.",
            "**Believing Memory Leaks are Impossible in Java**: Unintentional references in static maps, thread locals, or unclosed listeners cause real, severe memory leaks."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Circular References and GC Reachability",
          traps: [
            {
              question: "If Object A points to Object B, and Object B points to Object A, but no other reference points to them, will they be garbage collected in Java?",
              trap: "Answering no, confusing Java with legacy C++ reference counting algorithms.",
              solution: "YES, **they will be garbage collected**. Java uses **Root Tracing Reachability Analysis**, not reference counting. Because neither Object A nor Object B can be reached by traversing pointer chains from any live GC Root (active thread stack, static variable, or JNI pointer), the entire 'Island of Isolation' is marked unreachable and reclaimed."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Which of the following is NOT a valid GC Root in Java?",
          options: [
            "Local variables in an active thread's stack frame",
            "Static variables in loaded class metadata",
            "An unreferenced instance variable inside an isolated heap object",
            "Active running Thread objects"
          ],
          answer: 2,
          explanation: "An instance variable inside an unreferenced heap object is part of the dead graph, not an external root anchor."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Garbage Collection reclaims heap memory occupied by unreachable objects.",
            "Reachability is determined by tracing reference chains from GC Roots (stack locals, statics, active threads).",
            "Circular references do not prevent GC if the entire group is disconnected from GC Roots.",
            "Never rely on `System.gc()` or deprecated `finalize()` methods."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore JIT Compilation & Optimization, discovering how the JVM transforms interpreted bytecode into blistering-fast native machine code."
        }
      ]
    }
  },
  {
    slug: "jit-compilation",
    title: "JIT Compilation & Optimization",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `memory-execution-overview`, compilation vs interpretation, and method invocation."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of JIT Compilation as a **Simultaneous Interpreter vs Specialized Stenographer Team**:\n• **Phase 1 (The Interpreter)**: When your app starts, the interpreter immediately translates bytecode line-by-line. Startup is instantaneous, but execution speed is moderate.\n• **Phase 2 (Profiling)**: As code runs, the JVM counts how many times methods and loops execute. It identifies **Hot Spots** (the 5% of code doing 95% of the work).\n• **Phase 3 (JIT Turbocharger)**: The JIT compiler compiles those hot spots directly into **Native x86/ARM Machine Instructions**, applying extreme optimizations like inlining and vectorization."
        },
        {
          type: "callout",
          title: "Tiered Compilation in HotSpot JVM",
          content: "Modern JVMs use **Tiered Compilation** combining multiple execution engines:\n• **Tier 0 (Interpreter)**: Executes immediately with zero compilation pause.\n• **Tier 1–3 (C1 / Client Compiler)**: Fast native compilation with varying levels of profiling telemetry.\n• **Tier 4 (C2 / Server Compiler)**: Heavyweight optimizing compiler that produces highly tuned, deeply inlined native machine code based on runtime profile data."
        },
        {
          type: "code",
          title: "JIT Optimization in Action: Method Inlining & Dead Code Elimination",
          code: "public class JITOptimizationDemo {\n    // Small helper method (prime candidate for JIT Inlining)\n    public static int add(int a, int b) {\n        return a + b;\n    }\n\n    public static void main(String[] args) {\n        long total = 0;\n        \n        // JVM Warm-up: This loop runs 10,000,000 times (HOT SPOT!)\n        for (int i = 0; i < 10_000_000; i++) {\n            // BEFORE JIT: Pushes stack frame for add(total, i), executes, pops stack frame\n            // AFTER JIT (Inlining): Replaces method call with raw CPU addition: total += i\n            total = add((int) total, i);\n        }\n\n        System.out.println(\"Total: \" + total);\n    }\n}",
          language: "java",
          explanation: "Method Inlining eliminates the function call stack frame overhead completely by embedding the method body directly into the caller."
        },
        {
          type: "table",
          title: "Major JIT Optimization Techniques",
          headers: ["Optimization Technique", "How It Works", "Performance Benefit"],
          rows: [
            ["Method Inlining", "Replaces method call instructions with the actual method body code.", "Eliminates call stack frame creation, parameter passing, and return jump overhead."],
            ["Loop Unrolling", "Duplicates loop body statements to reduce the number of loop counter condition checks.", "Increases CPU instruction pipelining and branch prediction accuracy."],
            ["Dead Code Elimination", "Removes unreachable branches or computations whose results are never read.", "Reduces binary size and saves CPU cycles."],
            ["Escape Analysis & Scalar Replacement", "Detects objects that never leave method scope and replaces them with stack primitives.", "Eliminates heap allocation and garbage collection overhead."],
            ["SIMD Vectorization", "Utilizes CPU vector registers (AVX/NEON) to process multiple array values in a single cycle.", "Massive 4x-8x speedups for numerical array loops."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Predict JIT Dead Code Elimination",
          code: "class DeadCodeTest {\n    public static void main(String[] args) {\n        boolean debug = false;\n        int x = 10;\n        if (debug) {\n            x = 999; // Never executes\n        }\n        System.out.println(\"x = \" + x);\n    }\n}",
          expectedOutput: "x = 10",
          explanation: "Because 'debug' is statically false, the JIT compiler completely deletes the if-block during native compilation."
        },
        {
          type: "dryRun",
          title: "JIT Compilation Lifecycle: From Cold to Turbo",
          iterations: [
            { step: 1, variables: { "Execution Mode": "Interpreter", "Invocation Count": "1 to 1,000" }, description: "Interprets bytecode line-by-line; gathers profiling statistics." },
            { step: 2, variables: { "Threshold Crossed": "Invocation Counter > 2,000", "Compiler": "C1 (Tier 3)" }, description: "Hot spot detected. Background thread compiles method to basic native machine code." },
            { step: 3, variables: { "Threshold Crossed": "Invocation Counter > 10,000", "Compiler": "C2 (Tier 4)" }, description: "Compiles to aggressively optimized native code with inlining and loop unrolling." },
            { step: 4, variables: { "Steady State": "Peak Performance", "Speedup": "10x to 50x faster than pure interpretation" }, description: "CPU executes machine code directly from CodeCache with zero interpreter overhead." }
          ]
        },
        {
          type: "warning",
          title: "Common JIT Misconceptions",
          items: [
            "**Benchmarking Without JVM Warm-Up**: Timing a Java method on its first iteration measures slow interpreter speed, not actual JIT-compiled peak performance. Always use JMH (Java Microbenchmark Harness).",
            "**Making Methods Huge**: JIT compilers will refuse to inline methods exceeding a certain bytecode size limit (default: 325 bytes). Keep methods small!",
            "**Assuming JIT Replaces AOT (Ahead-of-Time)**: JIT has startup latency during the warm-up phase. For instant serverless startup (AWS Lambda), GraalVM Native Image AOT compilation is preferred."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Can Java Ever Be Faster Than C++?",
          traps: [
            {
              question: "Why can long-running JIT-compiled Java code sometimes match or exceed the performance of statically compiled C++ code?",
              trap: "Saying Java is always slower because of bytecode.",
              solution: "Because **JIT compiles with dynamic runtime telemetry**. While C++ compilers must generate static code at compile time without knowing exact runtime data distributions, the JVM JIT compiler observes actual branching probabilities, CPU architecture extensions, and memory layout at runtime, enabling speculative optimizations and targeted inlining tailored to live workloads."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "What is 'Method Inlining' in JIT compilation?",
          options: [
            "Writing all code in a single file",
            "Replacing a method call with the method's actual body code to eliminate call stack overhead",
            "Translating Java into JavaScript",
            "Converting recursion into iteration"
          ],
          answer: 1,
          explanation: "Method Inlining copies the body of small, frequently called methods directly into the caller, eliminating the CPU overhead of pushing and popping stack frames."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "JIT translates frequently executed bytecode hot spots into native machine code at runtime.",
            "Tiered compilation balances instant startup (Interpreter) with maximum long-term speed (C2).",
            "Key optimizations include Method Inlining, Loop Unrolling, and Escape Analysis.",
            "Benchmarking Java code requires warm-up iterations to measure JIT-compiled performance."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we examine the Execution Engine & Bytecode, understanding bytecode opcodes, instruction dispatching, and Java Native Interface (JNI) architecture."
        }
      ]
    }
  },
  {
    slug: "execution-engine",
    title: "The JVM Execution Engine",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `jit-compilation`, `stack-memory`, `garbage-collection`, and JVM memory structure."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of the Execution Engine as the **Central Propulsion Unit & Translation Brain of a Starship**:\n• The **Bytecode Verifier** inspects all incoming instruction scrolls for sabotage or illegal memory access.\n• The **Interpreter** immediately engages standard thrusters to get moving without delay.\n• The **JIT Compilers (C1 & C2)** fire up hyperdrive accelerators for sustained high-speed cruising.\n• The **Garbage Collector** continuously purges exhaust particles.\n• The **Java Native Interface (JNI)** opens secure airlocks to communicate with native OS device drivers (C/C++)."
        },
        {
          type: "callout",
          title: "The 4 Core Components of the Execution Engine",
          content: "1. **Bytecode Interpreter**: Reads and executes `.class` bytecode instructions sequentially.\n2. **JIT Compiler**: Translates hot spots into native machine code and caches them in the **CodeCache**.\n3. **Garbage Collector**: Reclaims unreachable heap memory automatically.\n4. **Java Native Interface (JNI) & Native Method Libraries**: Bridges Java code to native C/C++ libraries and OS system calls."
        },
        {
          type: "code",
          title: "Java Bytecode Disassembly: What the Execution Engine Actually Runs",
          code: "// Java Source Code:\n// public static int compute(int a, int b) {\n//     int c = a + b;\n//     return c * 2;\n// }\n\n// Disassembled Java Bytecode (javap -c):\n// 0: iload_0        // Push parameter 'a' (slot 0) onto Operand Stack\n// 1: iload_1        // Push parameter 'b' (slot 1) onto Operand Stack\n// 2: iadd           // Pop both, add on CPU ALU, push sum (a+b)\n// 3: istore_2       // Pop sum into local variable 'c' (slot 2)\n// 4: iload_2        // Push 'c' onto Operand Stack\n// 5: iconst_2       // Push constant integer 2 onto Operand Stack\n// 6: imul           // Pop c and 2, multiply, push product\n// 7: ireturn        // Return top of stack (int product)",
          language: "java",
          explanation: "Java bytecode is a stack-based instruction set. The Execution Engine manipulates the thread's Operand Stack to evaluate instructions step-by-step."
        },
        {
          type: "table",
          title: "The 5 Method Invocation Bytecode Instructions",
          headers: ["Bytecode Opcode", "Target Method Type", "Binding Type", "Example Use Case"],
          rows: [
            ["`invokestatic`", "Static methods", "Static (Compile-time)", "`Math.max(a, b)`"],
            ["`invokespecial`", "Private methods, constructors, `super` calls", "Static (Compile-time)", "`super.toString()`, `new Object()`"],
            ["`invokevirtual`", "Standard non-interface instance methods", "Dynamic (Polymorphic vtable)", "`obj.toString()`, `user.getName()`"],
            ["`invokeinterface`", "Interface methods", "Dynamic (Interface table itable)", "`list.add(item)` where list is `List`"],
            ["`invokedynamic` (Indy)", "Dynamic call sites (Lambdas, String concat)", "Runtime bootstrap linkage", "`() -> System.out.println()`, `\"a\" + \"b\"`"]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Trace Bytecode Stack Operations",
          code: "class BytecodeTrace {\n    public static int calc() {\n        int x = 5;\n        int y = 3;\n        return (x + y) * 2;\n    }\n    public static void main(String[] args) {\n        System.out.println(calc());\n    }\n}",
          expectedOutput: "16",
          explanation: "(5 + 3) * 2 = 16. The bytecode pushes 5 and 3, adds to get 8, pushes 2, multiplies to get 16, and returns."
        },
        {
          type: "dryRun",
          title: "Execution Engine Dispatch Trace for `invokevirtual`",
          iterations: [
            { step: 1, variables: { "Instruction": "invokevirtual #4", "Method": "Animal.speak()" }, description: "Execution Engine encounters polymorphic method call." },
            { step: 2, variables: { "Stack Inspection": "Pops object reference from Operand Stack", "Actual Class": "Dog.class" }, description: "Inspects receiver object's runtime class tag in memory." },
            { step: 3, variables: { "VTable Lookup": "Dog's Virtual Method Table", "Target Address": "Dog.speak() machine code" }, description: "Dispatches call dynamically to overridden Dog.speak() method." },
            { step: 4, variables: { "Execution": "Dog.speak() executed", "Output": "\"Woof!\"" }, description: "Correct polymorphic method executes with zero type errors." }
          ]
        },
        {
          type: "warning",
          title: "Execution Engine Traps",
          items: [
            "**JNI Performance Overhead**: Calling C/C++ native methods via JNI incurs marshalling overhead and prevents JIT inlining across the language barrier.",
            "**Assuming Bytecode is Directly Executed by Physical CPU**: The physical CPU only understands x86/ARM binary; the Execution Engine is the intermediary translation bridge.",
            "**Modifying Bytecode at Runtime Incorrectly**: Dynamic bytecode manipulation (ByteBuddy/ASM) without proper class-loader isolation can corrupt Metaspace."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: What is `invokedynamic`?",
          traps: [
            {
              question: "Why was `invokedynamic` added to the JVM in Java 7, and how does it power Java 8 Lambdas?",
              trap: "Thinking it was just a performance patch for `invokevirtual`.",
              solution: "`invokedynamic` allows dynamic method linkage at runtime rather than static compile-time binding. For Java 8 Lambdas, instead of generating a separate `.class` anonymous inner class file for every lambda expression (which bloats memory), the compiler emits an `invokedynamic` opcode that uses `LambdaMetafactory` to generate and link a lightweight call site on demand with minimal memory footprint."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Which bytecode instruction is used to invoke a `static` method in Java?",
          options: [
            "invokevirtual",
            "invokestatic",
            "invokespecial",
            "invokedynamic"
          ],
          answer: 1,
          explanation: "`invokestatic` is used to invoke static methods because binding is resolved statically at compile time without needing a receiver object reference."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "The Execution Engine combines Interpreter, JIT Compiler, Garbage Collector, and JNI.",
            "Java bytecode is a stack-based instruction set executed via the thread's Operand Stack.",
            "Polymorphic methods are dispatched dynamically at runtime via `invokevirtual` and `invokeinterface`.",
            "`invokedynamic` enables dynamic language features and lightweight lambda compilation."
          ]
        },
        {
          type: "text",
          title: "Course Completion",
          content: "Congratulations! You have completed all 10 foundational modules of Programming Fundamentals. You are now fully prepared to master Object-Oriented Programming (OOP)."
        }
      ]
    }
  }
];
