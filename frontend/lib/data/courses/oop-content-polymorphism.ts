// Module 5 - Polymorphism (5 lessons)
import { CourseLessonContent } from './types';

export const polymorphismLessons: Array<{
  slug: string;
  title: string;
  content: CourseLessonContent
}> = [
  {
    slug: "what-is-polymorphism",
    title: "What is Polymorphism? Compile-Time vs Runtime",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `what-is-inheritance`, `method-overriding-basics`, and `the-this-keyword`."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of Polymorphism as a **Universal Power Button on Electronic Devices**:\n• You press the universal power button (**Single Uniform Interface**) on a Smartphone, a Laptop, or an Air Conditioner.\n• The Smartphone turns on its OLED screen, the Laptop spins its CPU cooling fans, and the Air Conditioner starts its refrigerant compressor (**Many Diverse Forms of Behavior**).\n• You do not need 3 different remote controls with 3 different button names; you issue a single instruction, and each object executes its own specialized behavior."
        },
        {
          type: "callout",
          title: "The 2 Branches of Polymorphism in Java",
          content: "1. **Compile-Time Polymorphism (Static Binding / Early Binding)**: Resolved at compile time by the Java compiler. Achieved via **Method Overloading**.\n2. **Runtime Polymorphism (Dynamic Binding / Late Binding)**: Resolved at runtime by the JVM based on the actual heap object. Achieved via **Method Overriding** and **Upcasting**."
        },
        {
          type: "code",
          title: "Compile-Time vs Runtime Polymorphism in Action",
          code: "public class PolymorphismOverviewDemo {\n    // === 1. COMPILE-TIME POLYMORPHISM (Method Overloading) ===\n    static class Calculator {\n        int add(int a, int b) { return a + b; }\n        double add(double a, double b) { return a + b; }\n        int add(int a, int b, int c) { return a + b + c; }\n    }\n\n    // === 2. RUNTIME POLYMORPHISM (Method Overriding & Upcasting) ===\n    static class AudioPlayer {\n        void playMedia() { System.out.println(\"Playing generic audio.\"); }\n    }\n\n    static class SpotifyPlayer extends AudioPlayer {\n        @Override\n        void playMedia() { System.out.println(\"Streaming lossless FLAC audio via Spotify API.\"); }\n    }\n\n    static class PodcastPlayer extends AudioPlayer {\n        @Override\n        void playMedia() { System.out.println(\"Playing podcast with 1.5x vocal speed boost.\"); }\n    }\n\n    public static void main(String[] args) {\n        // Compile-time resolution: Compiler matches signature at build time\n        Calculator calc = new Calculator();\n        System.out.println(\"Sum: \" + calc.add(10, 20));       // Matches add(int, int)\n        System.out.println(\"Sum: \" + calc.add(2.5, 3.5));     // Matches add(double, double)\n\n        // Runtime polymorphic dispatch: Reference type is AudioPlayer, but heap objects differ\n        AudioPlayer p1 = new SpotifyPlayer();\n        AudioPlayer p2 = new PodcastPlayer();\n        \n        p1.playMedia(); // Streaming lossless FLAC audio via Spotify API.\n        p2.playMedia(); // Playing podcast with 1.5x vocal speed boost.\n    }\n}",
          language: "java",
          explanation: "calc.add() is resolved at compile time based on parameter types. p1.playMedia() is resolved at runtime based on the actual object (SpotifyPlayer) on the Heap."
        },
        {
          type: "table",
          title: "Compile-Time vs Runtime Polymorphism",
          headers: ["Attribute", "Compile-Time Polymorphism", "Runtime Polymorphism"],
          rows: [
            ["Mechanism", "Method Overloading (and Operator Overloading for `+`)", "Method Overriding with Upcasting"],
            ["Binding Time", "Compile Time (Static / Early Binding)", "Runtime (Dynamic / Late Binding)"],
            ["JVM Opcode", "`invokestatic` / `invokespecial`", "`invokevirtual` / `invokeinterface`"],
            ["Flexibility", "Moderate (Static signature matching)", "Maximum (Dynamic extensibility, plug-in architecture)"],
            ["Performance", "Zero runtime overhead (Resolved by compiler)", "Negligible vtable pointer lookup (~1 CPU cycle)"]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: The Non-Polymorphic Field Trap",
          code: "class Parent {\n    String name = \"ParentName\";\n}\nclass Child extends Parent {\n    String name = \"ChildName\"; // Field shadowing\n}\nclass FieldPolyQuiz {\n    public static void main(String[] args) {\n        Parent p = new Child();\n        System.out.println(p.name); // Which name prints?\n    }\n}",
          expectedOutput: "ParentName",
          explanation: "In Java, variables and fields are NEVER polymorphic! Field access is resolved at compile-time based on the reference type (Parent), printing 'ParentName'."
        },
        {
          type: "dryRun",
          title: "Polymorphic Call Trace: `AudioPlayer p1 = new SpotifyPlayer(); p1.playMedia();`",
          iterations: [
            { step: 1, variables: { "Compile-Time Check": "AudioPlayer has playMedia()?", "Result": "YES" }, description: "Compiler verifies that reference type AudioPlayer declares playMedia()." },
            { step: 2, variables: { "Runtime Memory": "p1 points to SpotifyPlayer on Heap (0x9911)" }, description: "JVM inspects receiver object's runtime class." },
            { step: 3, variables: { "VTable Dispatch": "SpotifyPlayer.playMedia()" }, description: "Dynamic dispatch invokes SpotifyPlayer's overridden implementation." }
          ]
        },
        {
          type: "warning",
          title: "Polymorphism Pitfalls",
          items: [
            "**Believing Fields are Polymorphic**: Instance variables in Java do NOT participate in runtime polymorphism. Only non-static, non-private methods are polymorphic.",
            "**Static Methods are Not Polymorphic**: Static methods belong to classes and use Method Hiding (resolved by reference type), not dynamic dispatch.",
            "**Calling Subclass-Specific Methods via Parent Reference**: If `Animal a = new Dog();` and `Dog` has a new method `fetch()`, calling `a.fetch()` fails compilation (must downcast `((Dog) a).fetch()`)."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Are Variables Polymorphic in Java?",
          traps: [
            {
              question: "If Class B extends Class A, and both define `int x = 10` and `int x = 20` respectively, what does `A obj = new B(); System.out.println(obj.x);` print?",
              trap: "Answering 20, assuming fields are polymorphic like methods.",
              solution: "It prints **10**! In Java, **variables (fields) are NOT polymorphic**. Field access is resolved strictly at compile time based on the **declared type of the reference variable** (`A obj`), NOT the actual runtime object (`new B()`). Runtime polymorphism applies exclusively to instance methods."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Which of the following participates in dynamic runtime polymorphism in Java?",
          options: [
            "Instance variables / fields",
            "Static methods",
            "Private methods",
            "Public and protected non-static instance methods"
          ],
          answer: 3,
          explanation: "Only non-static, non-private instance methods participate in runtime polymorphism via dynamic virtual method dispatch."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Polymorphism allows one interface to control multiple underlying implementations.",
            "Compile-time polymorphism is achieved via method overloading (static binding).",
            "Runtime polymorphism is achieved via method overriding and upcasting (dynamic binding).",
            "Instance fields and static methods are never polymorphic."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Method Overloading & Resolution Hierarchy, mastering the 4-tier compiler resolution priority: exact match, widening, autoboxing, and varargs."
        }
      ]
    }
  },
  {
    slug: "method-overloading",
    title: "Method Overloading & Resolution Hierarchy",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `what-is-polymorphism`, primitive widening, wrapper classes, and varargs."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of Overload Resolution as a **Smart Power Brick Charger Negotiating with Devices**:\n• A device plugs into the charger requesting electricity.\n• The charger tests protocols in strict priority order:\n  1. **Exact Protocol Match**: Is it a native 20V USB-C Laptop? (Exact Type Match).\n  2. **Widening**: Can we safely step up voltage without data loss? (`int` &rarr; `long` &rarr; `double`).\n  3. **Packaging**: Can we wrap it into a smart packet? (`int` &rarr; `Integer` Autoboxing).\n  4. **Universal Fallback**: Can we deliver variable low-power pulses? (Varargs `int...`).\n• The compiler always picks the **most specific, least costly conversion** available."
        },
        {
          type: "callout",
          title: "The 4-Tier Compiler Overload Priority Ladder",
          content: "When resolving an overloaded method call, `javac` checks candidates in this exact order:\n$$\\text{1. Exact Match} \\longrightarrow \\text{2. Primitive Widening} \\longrightarrow \\text{3. Autoboxing/Unboxing} \\longrightarrow \\text{4. Varargs}$$"
        },
        {
          type: "code",
          title: "Tracing the Overload Resolution Priority Ladder",
          code: "public class OverloadResolutionDemo {\n    // Tier 1: Exact Match for int\n    static void process(int x) { System.out.println(\"1. Exact Match (int): \" + x); }\n\n    // Tier 2: Primitive Widening (int -> long)\n    static void process(long x) { System.out.println(\"2. Primitive Widening (long): \" + x); }\n\n    // Tier 3: Autoboxing (int -> Integer)\n    static void process(Integer x) { System.out.println(\"3. Autoboxing (Integer): \" + x); }\n\n    // Tier 4: Varargs (int...)\n    static void process(int... x) { System.out.println(\"4. Varargs (int...): \" + x[0]); }\n\n    public static void main(String[] args) {\n        int val = 42;\n        process(val); // Executes Tier 1: Exact Match (int)\n    }\n}",
          language: "java",
          explanation: "If process(int) is commented out, process(long) executes (Widening). If process(long) is commented out, process(Integer) executes (Autoboxing). Finally, process(int...) is the last resort."
        },
        {
          type: "table",
          title: "The 4 Overload Resolution Tiers",
          headers: ["Priority Tier", "Conversion Type", "Example Conversion", "Cost / Precedence"],
          rows: [
            ["Tier 1", "Exact Match", "`int` &rarr; `int`, `String` &rarr; `String`", "Zero conversion overhead (Highest Priority)."],
            ["Tier 2", "Primitive Widening", "`byte` &rarr; `short` &rarr; `int` &rarr; `long` &rarr; `float` &rarr; `double`", "Safe numeric widening without loss of magnitude."],
            ["Tier 3", "Autoboxing / Unboxing", "`int` &rarr; `Integer` or `Double` &rarr; `double`", "Heap object allocation / extraction."],
            ["Tier 4", "Varargs (`...`)", "`int` &rarr; `int[]` array container", "Lowest priority; fallback mechanism."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Predict Widening vs Autoboxing",
          code: "class PriorityQuiz {\n    static void test(long x) { System.out.print(\"LONG \"); }\n    static void test(Integer x) { System.out.print(\"INTEGER \"); }\n    public static void main(String[] args) {\n        int n = 10;\n        test(n); // Does widening (long) or autoboxing (Integer) win?\n    }\n}",
          expectedOutput: "LONG ",
          explanation: "Primitive widening (Tier 2: int -> long) takes precedence over Autoboxing (Tier 3: int -> Integer), printing 'LONG '."
        },
        {
          type: "dryRun",
          title: "Overload Resolution Trace for `test(10)`",
          iterations: [
            { step: 1, variables: { "Search": "Tier 1: Exact match for int", "Found": "No test(int)" }, description: "Proceeds to Tier 2." },
            { step: 2, variables: { "Search": "Tier 2: Widening (int -> long)", "Found": "test(long)" }, description: "Match found! Halts search immediately." },
            { step: 3, variables: { "Execution": "test(long) emitted in bytecode" }, description: "Compile-time binding locked to test(long)." }
          ]
        },
        {
          type: "warning",
          title: "Overloading Ambiguity Traps",
          items: [
            "**Widening + Autoboxing Incompatibility**: Java can do `int -> long` (widening) OR `int -> Integer` (boxing), but it will NEVER do `int -> Long` (autoboxing + widening combined in a single step is illegal!).",
            "**Ambiguity on Two-Parameter Conversions**: Having `void add(int a, double b)` and `void add(double a, int b)` called with `add(5, 5)` causes compile error: *reference to add is ambiguous*.",
            "**Passing `null` to Sibling Types**: If a class has `print(String s)` and `print(Integer i)`, calling `print(null)` fails compilation because neither is more specific than the other."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Why Does Widening Beat Autoboxing?",
          traps: [
            {
              question: "Why does Java prioritize primitive widening (`int -> long`) over autoboxing (`int -> Integer`) during method overload resolution?",
              trap: "Assuming autoboxing is newer so it should take precedence.",
              solution: "For **Strict Backward Compatibility**! Widening was part of the original Java 1.0 language specification in 1995. Autoboxing was introduced later in Java 5.0 (2004). If autoboxing took precedence, existing legacy code written for Java 1.4 would suddenly change method execution targets and break production systems upon upgrading."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Given `void show(long a)` and `void show(Integer a)`, which method executes when calling `show(5)` with an `int` literal?",
          options: [
            "`show(Integer a)` because Integer is an object",
            "`show(long a)` because primitive widening takes precedence over autoboxing",
            "Compile-time error: ambiguous method call",
            "Throws a RuntimeException"
          ],
          answer: 1,
          explanation: "Primitive widening (`int -> long`) is Tier 2, which takes priority over autoboxing (`int -> Integer`, Tier 3)."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Method Overloading resolution follows the 4-tier priority ladder: Exact Match &rarr; Widening &rarr; Autoboxing &rarr; Varargs.",
            "Widening always takes precedence over autoboxing for backward compatibility.",
            "Java cannot widen and autobox simultaneously (`int` cannot become `Long`).",
            "Overloaded calls with `null` can cause ambiguity if multiple sibling references exist."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Runtime Polymorphism & Virtual Method Tables (vtable), uncovering how the JVM dispatches overridden methods dynamically in O(1) time."
        }
      ]
    }
  },
  {
    slug: "method-overriding-polymorphism",
    title: "Runtime Polymorphism & Virtual Method Tables (vtable)",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `what-is-polymorphism`, `method-overriding-basics`, and JVM execution engine architecture."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of Runtime Polymorphism as an **International Credit Card Terminal at a Store**:\n• The cash register checkout system only knows the abstract concept: **\"Process Payment\"** (`PaymentProcessor.pay(amount)`).\n• A customer swipes a **Visa**, an **Amex**, or an **Apple Pay device** (**Dynamic Concrete Subclasses**).\n• The cash register does NOT have a giant 50-line `if/else` block hardcoded for every bank in the world.\n• Instead, it sends the `pay()` message to whichever card is swiped, and the card's internal chip executes its own payment protocol (**Dynamic Virtual Method Dispatch**)."
        },
        {
          type: "callout",
          title: "How the JVM Executes Dynamic Dispatch: The Virtual Method Table (vtable)",
          content: "When a class is loaded into Metaspace, the JVM constructs a **Virtual Method Table (vtable)**:\n• A vtable is an array of direct memory pointers to the executable machine code of each method.\n• Subclasses inherit parent vtable slot indices. If the subclass overrides a method, it overwrites that slot with the pointer to its own child method code.\n• At runtime, `invokevirtual` jumps to `vtable[slot_index]` in **$O(1)$ constant time**, achieving polymorphic flexibility with virtually zero CPU overhead!"
        },
        {
          type: "code",
          title: "Polymorphic Payment Processing Architecture",
          code: "public class PaymentProcessingDemo {\n    // Base Superclass / Abstract Protocol\n    static abstract class PaymentGateway {\n        abstract boolean processPayment(double amount);\n    }\n\n    // Concrete Subclass 1\n    static class CreditCardGateway extends PaymentGateway {\n        @Override\n        boolean processPayment(double amount) {\n            System.out.println(\"Validating CVV & charging $\" + amount + \" via Visa/MasterCard network.\");\n            return true;\n        }\n    }\n\n    // Concrete Subclass 2\n    static class CryptoGateway extends PaymentGateway {\n        @Override\n        boolean processPayment(double amount) {\n            System.out.println(\"Generating blockchain wallet address & awaiting 3 block confirmations for $\" + amount);\n            return true;\n        }\n    }\n\n    // High-Level Business Orchestrator (Zero knowledge of concrete payment providers!)\n    static class CheckoutService {\n        public static void completeOrder(PaymentGateway gateway, double amount) {\n            System.out.println(\"--- Initiating Checkout ---\");\n            boolean success = gateway.processPayment(amount); // DYNAMIC RUNTIME DISPATCH\n            if (success) System.out.println(\"Order fulfilled successfully!\\n\");\n        }\n    }\n\n    public static void main(String[] args) {\n        // Swapping gateways at runtime with zero changes to CheckoutService\n        PaymentGateway card = new CreditCardGateway();\n        PaymentGateway crypto = new CryptoGateway();\n\n        CheckoutService.completeOrder(card, 150.0);\n        CheckoutService.completeOrder(crypto, 850.0);\n    }\n}",
          language: "java",
          explanation: "CheckoutService.completeOrder() accepts any PaymentGateway. When new payment methods (e.g. PayPalGateway) are created, CheckoutService requires zero code modifications (Open/Closed Principle)."
        },
        {
          type: "table",
          title: "Procedural Switch vs Polymorphic Dynamic Dispatch",
          headers: ["Attribute", "Procedural `switch(type)` Approach", "Polymorphic Dynamic Dispatch (`vtable`)"],
          rows: [
            ["Adding New Type", "Must find and modify 10+ `switch` statements across the codebase.", "Just create a new subclass `class X extends Base`; zero existing code modified."],
            ["Coupling", "High coupling (Master function knows all concrete types).", "Loose coupling (Master function knows only base interface)."],
            ["Risk of Bugs", "High (Easy to forget a `case` branch in one switch).", "Zero (Compiler enforces implementation of abstract methods)."],
            ["Dispatch Speed", "Linear $O(N)$ branch checks (or $O(\\log N)$ lookup).", "$O(1)$ constant time table index jump."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Polymorphic Array Processing",
          code: "class Vehicle { void drive() { System.out.print(\"Drive \"); } }\nclass Car extends Vehicle { void drive() { System.out.print(\"Car \"); } }\nclass Bike extends Vehicle { void drive() { System.out.print(\"Bike \"); } }\n\nclass FleetTest {\n    public static void main(String[] args) {\n        Vehicle[] fleet = { new Car(), new Bike(), new Vehicle() };\n        for (Vehicle v : fleet) {\n            v.drive();\n        }\n    }\n}",
          expectedOutput: "Car Bike Drive ",
          explanation: "Iterating through the polymorphic array invokes the correct overridden drive() method on each concrete instance: Car -> Bike -> Drive."
        },
        {
          type: "dryRun",
          title: "JVM `invokevirtual` Dispatch Trace for `card.processPayment(150.0)`",
          iterations: [
            { step: 1, variables: { "Bytecode": "invokevirtual #12", "Slot Index": "vtable Slot #4 (processPayment)" }, description: "Instruction targets method slot 4." },
            { step: 2, variables: { "Object Lookup": "Pops 'card' from stack", "Actual Type": "CreditCardGateway.class" }, description: "Inspects receiver object's runtime class definition in Metaspace." },
            { step: 3, variables: { "VTable Resolution": "CreditCardGateway.vtable[4]" }, description: "Retrieves machine code pointer for CreditCardGateway.processPayment()." },
            { step: 4, variables: { "Execution": "Jumps to machine code", "Time Complexity": "O(1) direct pointer jump" }, description: "Executes credit card verification logic." }
          ]
        },
        {
          type: "warning",
          title: "Runtime Polymorphism Mistakes",
          items: [
            "**Overriding Private Methods**: Subclasses cannot override `private` methods. If a child declares a method with the same name, it is a completely unrelated method, and polymorphism will not work.",
            "**Constructors Calling Overridden Methods**: Calling an overridable method inside a superclass constructor executes the child's overridden method BEFORE the child's fields have been initialized, causing `NullPointerException`!",
            "**ClassCastException on Unsafe Downcasting**: Assuming a parent reference is always a specific child without checking `instanceof`."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Why You Should Never Call Overridable Methods in Constructors",
          traps: [
            {
              question: "What is dangerous about calling an overridden method inside a Superclass constructor?",
              trap: "Assuming the superclass version executes.",
              solution: "Because **dynamic dispatch executes the Child's overridden method before the Child constructor has initialized its fields**!\n• Trace: `Parent()` constructor runs &rarr; calls `init()` &rarr; JVM dynamically dispatches to `Child.init()` &rarr; `Child.init()` tries to read `this.databaseUrl` &rarr; `this.databaseUrl` is still `null` because `Child()` constructor hasn't executed yet! &rarr; Crashes with `NullPointerException`."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "How does the JVM achieve O(1) constant time method resolution for dynamic polymorphism?",
          options: [
            "By searching all source code files sequentially",
            "Using Virtual Method Tables (vtables) containing direct pointers to executable bytecode for each slot",
            "By converting all classes to static methods",
            "Using garbage collection markers"
          ],
          answer: 1,
          explanation: "The JVM uses Virtual Method Tables (vtables) in Metaspace, allowing `invokevirtual` to jump directly to the target method address in O(1) time."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Runtime polymorphism decouples high-level orchestrators from concrete low-level implementations.",
            "Dynamic dispatch is executed by the JVM in $O(1)$ time using vtables.",
            "Eliminates fragile `switch` statements and adheres to the Open/Closed Principle.",
            "Never call overridable methods inside constructors to prevent uninitialized field access."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Casting Objects & Pattern Matching for instanceof, mastering upcasting, safe downcasting, and Java 14+ pattern matching syntax."
        }
      ]
    }
  },
  {
    slug: "downcasting-and-instanceof",
    title: "Casting Objects & Pattern Matching for instanceof",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `what-is-polymorphism`, `method-overriding-polymorphism`, and reference type hierarchy."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of Object Casting as **Military Rank & ID Badge Verification**:\n• **Upcasting (Promotion / General View)**: A Navy SEAL is also a Soldier (`Soldier s = new NavySEAL()`). Upcasting is implicit and 100% safe because every SEAL is guaranteed to be a Soldier.\n• **Downcasting (Demotion / Specialized Mission)**: You have a generic Soldier reference `s` and want them to pilot a submarine (`pilotSubmarine()`). Only a Navy SEAL can pilot a submarine!\n• **The Security Check (`instanceof`)**: Before ordering them into the submarine, you inspect their security badge (`if (s instanceof NavySEAL)`). If you blindly downcast an Army Cook to a Navy SEAL, the system crashes in flames (`ClassCastException`)."
        },
        {
          type: "callout",
          title: "Upcasting vs Downcasting Rules",
          content: "• **Upcasting (Child &rarr; Parent)**: Implicit, automatic, and 100% safe (`Animal a = new Dog()`).\n• **Downcasting (Parent &rarr; Child)**: Explicit and risky (`Dog d = (Dog) a`). MUST always be guarded with `instanceof` to prevent runtime `ClassCastException`."
        },
        {
          type: "code",
          title: "Classic `instanceof` vs Modern Java Pattern Matching (Java 14+)",
          code: "public class DowncastingPatternDemo {\n    static class Employee { String name = \"Alice\"; }\n    static class Developer extends Employee {\n        void writeJavaCode() { System.out.println(name + \" is writing high-performance backend code.\"); }\n    }\n    static class Designer extends Employee {\n        void createMockup() { System.out.println(name + \" is creating Figma UI designs.\"); }\n    }\n\n    // 1. CLASSIC APPROACH (Pre-Java 14: Verbose instanceof + Manual Downcast)\n    public static void processEmployeeClassic(Employee emp) {\n        if (emp instanceof Developer) {\n            Developer dev = (Developer) emp; // Redundant manual cast!\n            dev.writeJavaCode();\n        } else if (emp instanceof Designer) {\n            Designer des = (Designer) emp;\n            des.createMockup();\n        }\n    }\n\n    // 2. MODERN APPROACH (Java 14+ Pattern Matching for instanceof)\n    // Automatically tests AND casts in a single clean expression!\n    public static void processEmployeeModern(Employee emp) {\n        if (emp instanceof Developer dev) {\n            dev.writeJavaCode(); // 'dev' is in scope and already cast!\n        } else if (emp instanceof Designer des) {\n            des.createMockup();\n        }\n    }\n\n    public static void main(String[] args) {\n        Employee emp1 = new Developer();\n        Employee emp2 = new Designer();\n\n        processEmployeeModern(emp1); // Alice is writing high-performance backend code.\n        processEmployeeModern(emp2); // Alice is creating Figma UI designs.\n    }\n}",
          language: "java",
          explanation: "Java 14+ Pattern Matching eliminates the redundant manual cast '(Developer) emp', binding the typed variable 'dev' directly in the if-block."
        },
        {
          type: "table",
          title: "Upcasting vs Downcasting Comparison",
          headers: ["Dimension", "Upcasting", "Downcasting"],
          rows: [
            ["Direction", "Subclass &rarr; Superclass (`Parent p = new Child()`)", "Superclass &rarr; Subclass (`Child c = (Child) p`)"],
            ["Syntax", "Implicit (No casting operator needed)", "Explicit (Requires `(ChildType)` cast operator)"],
            ["Safety", "100% Safe (Guaranteed by compiler)", "Risky (Can throw `ClassCastException` at runtime)"],
            ["Purpose", "Treat diverse objects uniformly through base interface", "Access specialized child methods not present in parent"],
            ["Guard Needed", "None", "MUST check with `instanceof` before casting"]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Predict Pattern Matching Scope",
          code: "class PatternScopeQuiz {\n    public static void main(String[] args) {\n        Object obj = \"StudyHub\";\n        if (obj instanceof String s && s.length() > 5) {\n            System.out.println(\"Matched: \" + s.toUpperCase());\n        } else {\n            System.out.println(\"No Match\");\n        }\n    }\n}",
          expectedOutput: "Matched: STUDYHUB",
          explanation: "Pattern variable 's' is immediately available in the right-hand condition (s.length() > 5) and inside the if-block."
        },
        {
          type: "dryRun",
          title: "Execution Trace: `processEmployeeModern(emp1)`",
          iterations: [
            { step: 1, variables: { "emp1": "Points to Developer object on Heap" }, description: "Passes Employee reference into method." },
            { step: 2, variables: { "Condition": "emp1 instanceof Developer dev", "Check": "Is 0x7FA8 an instance of Developer.class?" }, description: "JVM validates heap type -> evaluates to TRUE." },
            { step: 3, variables: { "Pattern Binding": "dev = (Developer) emp1", "Scope": "Inside if-block" }, description: "Binds strongly typed variable 'dev'." },
            { step: 4, variables: { "Execution": "dev.writeJavaCode()" }, description: "Executes developer-specific method safely with zero exceptions." }
          ]
        },
        {
          type: "warning",
          title: "Casting Traps",
          items: [
            "**Unchecked Downcasting**: Writing `Developer dev = (Developer) emp;` without `instanceof` will crash in production with `ClassCastException` the moment an unexpected subtype is passed.",
            "**Downcasting Unrelated Types**: Attempting `String s = (String) new Integer(5);` is rejected by the compiler because String and Integer have no hierarchical relationship.",
            "**Using Pattern Variables Outside Scope**: Pattern variable `dev` in `if (emp instanceof Developer dev)` is NOT in scope inside the `else` block."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: What Does `null instanceof AnyClass` Return?",
          traps: [
            {
              question: "What is the result of `null instanceof String` and `null instanceof Object` in Java? Does it throw a `NullPointerException`?",
              trap: "Thinking it throws NPE or returns true for Object.",
              solution: "It evaluates to **`false` in all cases without throwing any exception**! The Java Language Specification explicitly guarantees that `null instanceof AnyType` always returns `false`. This makes `if (obj instanceof String)` completely safe against null pointers."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "What happens if you execute `String s = (String) (Object) Integer.valueOf(42);` at runtime?",
          options: [
            "Converts the integer 42 into the string \"42\"",
            "Throws a ClassCastException at runtime",
            "Compiles and returns null",
            "Throws an ArithmeticException"
          ],
          answer: 1,
          explanation: "At runtime, the heap object is an Integer. Attempting to cast an Integer to String throws a `ClassCastException`."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Upcasting is implicit and safe; Downcasting is explicit and risky.",
            "Always guard downcasts with `instanceof` to prevent `ClassCastException`.",
            "Java 14+ Pattern Matching for `instanceof` combines type checking and casting in a single clean expression.",
            "`null instanceof Type` safely evaluates to `false` without throwing NPE."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Polymorphism in System Design: The Strategy Pattern, learning how real-world architectures use polymorphism to implement the Open/Closed Principle."
        }
      ]
    }
  },
  {
    slug: "polymorphism-in-system-design",
    title: "Polymorphism in System Design: The Strategy Pattern",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `method-overriding-polymorphism`, `downcasting-and-instanceof`, and interfaces."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of the Strategy Pattern as an **Interchangeable Camera Lens Mount System**:\n• The high-end DSLR camera body (**Context / Orchestrator**) contains the sensor, shutter, and battery.\n• The camera body does NOT hardcode physical glass optics inside its metal casing.\n• Instead, it exposes a universal bayonet mount (**Strategy Interface**).\n• The photographer can hot-swap a **Wide-Angle Lens**, a **Macro Lens**, or a **Telephoto Lens** (**Polymorphic Concrete Strategies**) at runtime depending on whether they are shooting landscapes or distant wildlife."
        },
        {
          type: "callout",
          title: "The Open/Closed Principle (OCP)",
          content: "The **Open/Closed Principle** (the 'O' in SOLID) states:\n$$\\text{Software entities should be OPEN for extension, but CLOSED for modification.}$$\nPolymorphism is the primary mechanism to achieve OCP: You add new system capabilities by creating a *new subclass or interface implementor* without altering a single line of existing, battle-tested production code."
        },
        {
          type: "code",
          title: "Strategy Design Pattern: Multi-Channel Notification Dispatcher",
          code: "public class StrategyPatternDemo {\n    // 1. THE STRATEGY INTERFACE\n    interface NotificationStrategy {\n        void sendAlert(String recipient, String message);\n    }\n\n    // 2. CONCRETE STRATEGY A: Email\n    static class EmailStrategy implements NotificationStrategy {\n        @Override\n        public void sendAlert(String recipient, String message) {\n            System.out.println(\"[EMAIL SMTP -> \" + recipient + \"]: \" + message);\n        }\n    }\n\n    // 3. CONCRETE STRATEGY B: SMS (Twilio)\n    static class SMSStrategy implements NotificationStrategy {\n        @Override\n        public void sendAlert(String recipient, String message) {\n            System.out.println(\"[SMS GATEWAY -> \" + recipient + \"]: \" + message);\n        }\n    }\n\n    // 4. CONCRETE STRATEGY C: Push Notification (Firebase FCM)\n    static class PushStrategy implements NotificationStrategy {\n        @Override\n        public void sendAlert(String recipient, String message) {\n            System.out.println(\"[PUSH NOTIFICATION -> Device Token \" + recipient + \"]: \" + message);\n        }\n    }\n\n    // 5. THE CONTEXT (Orchestrator holding polymorphic strategy reference)\n    static class AlertService {\n        private NotificationStrategy strategy;\n\n        public AlertService(NotificationStrategy initialStrategy) {\n            this.strategy = initialStrategy;\n        }\n\n        // Dynamic Strategy Switcher at runtime\n        public void setStrategy(NotificationStrategy newStrategy) {\n            this.strategy = newStrategy;\n        }\n\n        public void triggerSecurityAlert(String user, String alertText) {\n            // Polymorphic delegation\n            strategy.sendAlert(user, alertText);\n        }\n    }\n\n    public static void main(String[] args) {\n        AlertService service = new AlertService(new EmailStrategy());\n        service.triggerSecurityAlert(\"alice@corp.com\", \"Suspicious login detected from IP 192.168.1.1\");\n\n        // Swapping strategy dynamically to SMS for critical urgent alert\n        service.setStrategy(new SMSStrategy());\n        service.triggerSecurityAlert(\"+1-555-0199\", \"URGENT: Password reset code is 884920\");\n    }\n}",
          language: "java",
          explanation: "AlertService delegates sending to NotificationStrategy. To add Discord or Slack notifications, you create a new class implementing NotificationStrategy with ZERO edits to AlertService."
        },
        {
          type: "table",
          title: "Monolithic Code vs Strategy Pattern Architecture",
          headers: ["Dimension", "Monolithic Procedural Design", "Strategy Pattern (Polymorphic Design)"],
          rows: [
            ["Coupling", "High (Class contains 500 lines of SMS, Email, and Push logic).", "Loose (Each strategy is isolated in its own testable class)."],
            ["Adding New Channel", "Must edit existing class and add `else if (type == DISCORD)`.", "Create `DiscordStrategy implements NotificationStrategy`."],
            ["Unit Testing", "Hard (Must mock all 10 APIs simultaneously).", "Easy (Unit test each strategy class in isolation)."],
            ["Runtime Flexibility", "Fixed logic paths.", "Strategies can be swapped dynamically on the fly."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Predict Strategy Swap Output",
          code: "interface DiscountStrategy { double apply(double price); }\nclass RegularDiscount implements DiscountStrategy { public double apply(double p) { return p * 0.9; } }\nclass VIPDiscount implements DiscountStrategy { public double apply(double p) { return p * 0.7; } }\n\nclass StoreQuiz {\n    public static void main(String[] args) {\n        DiscountStrategy strat = new RegularDiscount();\n        System.out.print(strat.apply(100.0) + \" \");\n        strat = new VIPDiscount();\n        System.out.print(strat.apply(100.0));\n    }\n}",
          expectedOutput: "90.0 70.0",
          explanation: "Swapping the strat reference from RegularDiscount to VIPDiscount changes the calculation dynamically from 10% off to 30% off."
        },
        {
          type: "dryRun",
          title: "Strategy Pattern Execution Trace: `service.triggerSecurityAlert(...)`",
          iterations: [
            { step: 1, variables: { "Context": "AlertService", "Held Strategy": "EmailStrategy instance" }, description: "Invokes triggerSecurityAlert()." },
            { step: 2, variables: { "Delegation": "strategy.sendAlert(...)" }, description: "Dispatches dynamically to EmailStrategy.sendAlert(). Outputs email log." },
            { step: 3, variables: { "Mutation": "service.setStrategy(new SMSStrategy())", "New Held Strategy": "SMSStrategy instance" }, description: "Replaces strategy pointer on context." },
            { step: 4, variables: { "Delegation": "strategy.sendAlert(...)" }, description: "Dispatches dynamically to SMSStrategy.sendAlert(). Outputs SMS log." }
          ]
        },
        {
          type: "warning",
          title: "System Design Polymorphism Traps",
          items: [
            "**Over-Engineering Simple Logic**: Do not create 10 strategy classes for simple boolean toggles; use the Strategy Pattern when behaviors vary independently and have meaningful complexity.",
            "**Leaking Concrete Types in Client Code**: If your client code constantly casts strategies back to concrete types (`((SMSStrategy) strategy).getTwilioSid()`), your interface abstraction is flawed.",
            "**Stateless Strategy Sharing**: If a Strategy class holds no mutable state, share a single instance (Singleton) across threads rather than allocating `new Strategy()` on every request."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: How Does Polymorphism Enable Dependency Inversion (DIP)?",
          traps: [
            {
              question: "How does Polymorphism enable the Dependency Inversion Principle (the 'D' in SOLID)?",
              trap: "Confusing Dependency Inversion with Dependency Injection.",
              solution: "• **Without Polymorphism (Direct Dependency)**: High-level business logic (`OrderService`) directly instantiates and depends on low-level database classes (`MySQLDatabase`). If database changes, business logic breaks.\n• **With Polymorphism (Inverted Dependency)**: High-level business logic depends on an **Abstract Interface** (`DatabaseRepository`). Both `OrderService` and `MySQLDatabase` depend on the interface. The direction of dependency is inverted, decoupling business logic from infrastructure."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Which SOLID design principle states that software should be open for extension but closed for modification?",
          options: [
            "Single Responsibility Principle (SRP)",
            "Open/Closed Principle (OCP)",
            "Liskov Substitution Principle (LSP)",
            "Interface Segregation Principle (ISP)"
          ],
          answer: 1,
          explanation: "The Open/Closed Principle (OCP) states that classes should allow new behavior to be added via extension (polymorphism) without modifying existing source code."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "The Strategy Pattern encapsulates interchangeable algorithms behind a common interface.",
            "Polymorphism enables the Open/Closed Principle (OCP) and Dependency Inversion Principle (DIP).",
            "Allows runtime swapping of behaviors without modifying orchestrator classes.",
            "Decouples high-level business workflows from low-level third-party integrations."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Module",
          content: "Next, we enter Module 6: Abstraction, mastering abstract classes, pure interfaces, default and static interface methods, and interface vs abstract class trade-offs."
        }
      ]
    }
  }
];
