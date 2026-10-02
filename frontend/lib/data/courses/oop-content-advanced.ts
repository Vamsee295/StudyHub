// Module 7 - Advanced OOP (8 lessons)
import { CourseLessonContent } from './types';

export const advancedOopLessons: Array<{
  slug: string;
  title: string;
  content: CourseLessonContent
}> = [
  {
    slug: "nested-and-inner-classes",
    title: "Nested & Inner Classes: Member vs Static Nested",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `classes-and-objects`, `access-modifiers-deep-dive`, and `the-this-keyword`."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of Nested Classes as **Car Components (Engine vs Spare Tire)**:\n• **Non-Static Member Inner Class (The Engine)**: Tightly bound to a specific car chassis (`Outer.this`). An engine cannot exist or operate without being mounted inside a physical car instance.\n• **Static Nested Class (The Spare Tire in the Trunk)**: Packaged inside the car's compartment for organizational convenience, but it does NOT depend on the car's engine or battery. You can take the spare tire and use it anywhere without needing the original car running."
        },
        {
          type: "callout",
          title: "The 4 Types of Nested Classes in Java",
          content: "1. **Static Nested Class**: Declared `static` inside an outer class (no outer instance reference).\n2. **Non-Static Member Inner Class**: Declared inside an outer class (holds implicit reference to enclosing outer instance `Outer.this`).\n3. **Local Inner Class**: Declared inside a method or block.\n4. **Anonymous Inner Class**: Inline class declaration and instantiation without an identifier name."
        },
        {
          type: "code",
          title: "Static Nested Class vs Non-Static Member Inner Class",
          code: "public class NestedClassDemo {\n    private String bankName = \"GlobalTrust\";\n    private static double interestRate = 4.5;\n\n    // 1. NON-STATIC MEMBER INNER CLASS (Bound to outer instance)\n    public class Account {\n        private String accountId;\n        public Account(String id) { this.accountId = id; }\n\n        public void printSummary() {\n            // Can access outer instance fields directly!\n            System.out.println(\"Account \" + accountId + \" at \" + NestedClassDemo.this.bankName);\n        }\n    }\n\n    // 2. STATIC NESTED CLASS (Independent of outer instance)\n    public static class InterestCalculator {\n        public static double calculateInterest(double principal) {\n            // Can access static outer fields, but CANNOT access bankName instance field!\n            return principal * (interestRate / 100.0);\n        }\n    }\n\n    public static void main(String[] args) {\n        // Instantiating Static Nested Class (No outer instance needed!)\n        double interest = NestedClassDemo.InterestCalculator.calculateInterest(10000.0);\n        System.out.println(\"Annual Interest: $\" + interest); // $450.0\n\n        // Instantiating Non-Static Inner Class (REQUIRES outer instance!)\n        NestedClassDemo bank = new NestedClassDemo();\n        NestedClassDemo.Account acc = bank.new Account(\"ACC-101\");\n        acc.printSummary(); // Account ACC-101 at GlobalTrust\n    }\n}",
          language: "java",
          explanation: "Static nested classes are instantiated with 'new Outer.StaticNested()'. Non-static inner classes require an enclosing outer object: 'outerInstance.new Inner()'."
        },
        {
          type: "table",
          title: "Non-Static Member Inner Class vs Static Nested Class",
          headers: ["Dimension", "Non-Static Member Inner Class", "Static Nested Class"],
          rows: [
            ["`static` Keyword", "NO (`class Inner`)", "YES (`static class Nested`)"],
            ["Outer Instance Reference", "Holds hidden reference pointer to `Outer.this`.", "No reference to outer instance (Clean decoupling)."],
            ["Access to Outer State", "Can access all outer instance fields and private members.", "Can access ONLY outer `static` fields and methods."],
            ["Instantiation Syntax", "`outerObj.new InnerClass()`", "`new OuterClass.NestedClass()`"],
            ["Memory Leak Risk", "High (Can prevent outer instance from being garbage collected).", "Zero memory leak risk."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Predict Inner Class State Output",
          code: "class Outer {\n    int val = 10;\n    class Inner {\n        int val = 20;\n        void show() {\n            System.out.println(val + \" \" + Outer.this.val);\n        }\n    }\n}\nclass TestNested {\n    public static void main(String[] args) {\n        Outer out = new Outer();\n        Outer.Inner in = out.new Inner();\n        in.show();\n    }\n}",
          expectedOutput: "20 10",
          explanation: "'val' resolves to Inner's local field (20), while 'Outer.this.val' resolves to the enclosing outer instance's field (10)."
        },
        {
          type: "dryRun",
          title: "Memory Trace: Non-Static Inner Class Allocation",
          iterations: [
            { step: 1, variables: { "new Outer()": "Heap 0x1000", "bankName": "\"GlobalTrust\"" }, description: "Allocates enclosing outer instance." },
            { step: 2, variables: { "bank.new Account()": "Heap 0x2000", "Hidden Pointer": "this$0 = 0x1000" }, description: "JVM compiler injects hidden 'this$0' pointer inside Account pointing back to outer 0x1000." },
            { step: 3, variables: { "Garbage Collection": "bank = null", "Status": "0x1000 STILL ALIVE" }, description: "Even though bank is null, outer object at 0x1000 cannot be GC'd because Account at 0x2000 retains its hidden this$0 pointer!" }
          ]
        },
        {
          type: "warning",
          title: "Inner Class Memory Leak Traps",
          items: [
            "**Asynchronous Memory Leaks (Android / Handlers)**: Passing a non-static inner class (like a `Runnable` or `Handler`) to a background thread prevents the entire outer UI Activity / Service from being garbage collected until the thread finishes.",
            "**Prefer `static` Nested Classes by Default**: Unless an inner class strictly needs access to the outer instance's non-static fields, always declare nested classes `static` (Effective Java Item 24)."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Why Does the Compiler Inject `this$0`?",
          traps: [
            {
              question: "How does a non-static inner class access private fields of its enclosing outer class? What is `this$0`?",
              trap: "Thinking the JVM has special syntax permissions.",
              solution: "The Java compiler synthesizes a hidden synthetic field named **`final Outer this$0;`** inside the non-static inner class and passes the outer instance reference to the inner constructor during `outer.new Inner()`. It also creates synthetic package-private accessor methods in the outer class to allow the inner class to read outer private fields."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "How do you instantiate a static nested class named `Builder` declared inside `Database`?",
          options: [
            "`Database db = new Database(); db.new Builder();`",
            "`Database.Builder b = new Database.Builder();`",
            "`new Database().Builder();`",
            "`Database::Builder.init();`"
          ],
          answer: 1,
          explanation: "Static nested classes do not require an outer instance; they are instantiated directly via `new Outer.StaticNested()`."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Member inner classes hold an implicit reference `Outer.this` to their enclosing outer instance.",
            "Static nested classes do not hold an outer reference and are decoupled.",
            "Always prefer static nested classes by default to eliminate memory leak risks.",
            "Use `Outer.this.field` to disambiguate outer fields from inner shadowed fields."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Local & Anonymous Inner Classes, understanding method-local scoping, inline instantiation, and why captured variables must be effectively final."
        }
      ]
    }
  },
  {
    slug: "local-and-anonymous-inner-classes",
    title: "Local & Anonymous Inner Classes",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `nested-and-inner-classes`, `interfaces-in-java`, and variable scope."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of Anonymous Inner Classes as **Hiring a One-Day Specialized Freelance Consultant**:\n• You have a one-time event (A button was clicked, or a background worker needs to run for 5 seconds).\n• You do NOT want to file corporate incorporation paperwork to create a permanent company (`class PermanentButtonHandler implements ActionListener`).\n• Instead, you hire a temporary contractor on the spot (`new ActionListener() { ... }`), write their custom instructions inline, execute the task, and dismiss them."
        },
        {
          type: "callout",
          title: "The Law of Effectively Final Captured Variables",
          content: "Any local variable declared inside a method that is accessed by a Local or Anonymous Inner Class **MUST be `final` or effectively final** (its value is never modified after initialization).\n• *Why?* Because when the method finishes executing, its stack frame is popped. The inner class (living on the Heap) makes a **copy** of the local variable. If the local variable could change, the stack and heap values would fall out of sync!"
        },
        {
          type: "code",
          title: "Anonymous Inner Class vs Modern Lambda Expression",
          code: "public class AnonymousClassDemo {\n    interface TaskExecutor {\n        void execute(String taskName);\n    }\n\n    public static void runProcess(String task) {\n        String prefix = \"[AUDIT-LOG]\"; // Effectively final variable\n\n        // 1. ANONYMOUS INNER CLASS (Pre-Java 8 style)\n        TaskExecutor classicExecutor = new TaskExecutor() {\n            @Override\n            public void execute(String t) {\n                System.out.println(prefix + \" Classic Anonymous: Processing \" + t);\n            }\n        };\n        classicExecutor.execute(task);\n\n        // 2. LAMBDA EXPRESSION (Modern Java 8+ style: concise equivalent)\n        TaskExecutor modernExecutor = t -> System.out.println(prefix + \" Modern Lambda: Processing \" + t);\n        modernExecutor.execute(task);\n    }\n\n    public static void main(String[] args) {\n        runProcess(\"DataSynchronization\");\n    }\n}",
          language: "java",
          explanation: "Both patterns capture the effectively final variable 'prefix' and implement TaskExecutor inline without declaring a separate named class file."
        },
        {
          type: "table",
          title: "Anonymous Inner Class vs Lambda Expression",
          headers: ["Feature", "Anonymous Inner Class", "Lambda Expression (Java 8+)"],
          rows: [
            ["Target", "Can extend abstract/concrete classes OR implement interfaces.", "Can ONLY implement Functional Interfaces (Single Abstract Method)."],
            ["`this` Keyword", "`this` refers to the anonymous inner class instance.", "`this` refers to the enclosing outer class instance (Lexical Scope)."],
            ["Bytecode Generation", "Emits a separate `.class` file (e.g. `Outer$1.class`).", "Uses `invokedynamic` (Zero class file bloat)."],
            ["Instance Variables", "Can declare its own instance fields and multiple methods.", "Cannot declare instance fields."],
            ["Syntax Verbosity", "Verbose boilerplate (`new Interface() { ... }`).", "Ultra-concise (`param -> body`)."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: The Non-Final Mutation Trap",
          code: "class ClosureQuiz {\n    interface Greeting { void greet(); }\n    public static void main(String[] args) {\n        String name = \"Alice\";\n        Greeting g = new Greeting() {\n            public void greet() { System.out.println(\"Hello, \" + name); }\n        };\n        // name = \"Bob\"; // Would cause: local variables referenced from an inner class must be final or effectively final\n        g.greet();\n    }\n}",
          expectedOutput: "Hello, Alice",
          explanation: "Because 'name' is not mutated after initialization, it is effectively final and safely accessible inside the anonymous inner class."
        },
        {
          type: "dryRun",
          title: "Variable Capture Memory Trace",
          iterations: [
            { step: 1, variables: { "Method Stack": "prefix = \"[AUDIT-LOG]\"" }, description: "Local variable allocated in method stack frame." },
            { step: 2, variables: { "Anonymous Class": "new TaskExecutor()", "Heap Location": "0x55FF" }, description: "Compiler injects synthetic field inside 0x55FF holding a copy of 'prefix'." },
            { step: 3, variables: { "Method Return": "Stack frame popped" }, description: "Method finishes; stack variable destroyed. Heap object at 0x55FF retains its captured copy intact." }
          ]
        },
        {
          type: "warning",
          title: "Anonymous Inner Class Traps",
          items: [
            "**Attempting to Mutate Captured Variables**: Writing `count++;` inside an anonymous inner class on a method local variable will not compile; use an `AtomicInteger` or 1-element array `int[] count = {0}` if mutation is needed.",
            "**Constructors are Impossible in Anonymous Classes**: Anonymous classes have no name, so you cannot write a constructor (must use instance initialization blocks `{ ... }` instead).",
            "**Class File Proliferation**: Anonymous inner classes generate separate `.class` files on disk; use Lambdas where possible."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: What Does `this` Refer to Inside an Anonymous Class vs a Lambda?",
          traps: [
            {
              question: "What does the `this` keyword point to inside an Anonymous Inner Class compared to inside a Lambda Expression?",
              trap: "Assuming `this` behaves identically in both.",
              solution: "• **Inside an Anonymous Inner Class**: `this` refers to the **Anonymous Inner Class instance itself**.\n• **Inside a Lambda Expression**: `this` refers to the **Enclosing Outer Class instance** (Lambdas use **Lexical Scoping** and do not create a new scope for `this`)."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Why must a local variable accessed by an anonymous inner class be final or effectively final?",
          options: [
            "To prevent the variable from consuming CPU cache",
            "Because Java copies the variable value to the heap object, and changing it on the stack would cause desynchronization",
            "Because anonymous classes only accept numbers",
            "To enable JIT compilation"
          ],
          answer: 1,
          explanation: "Local stack variables are destroyed when methods return. The inner class captures a copy on the heap, requiring immutability to prevent desynchronization."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Anonymous Inner Classes declare and instantiate one-off classes inline without a name.",
            "Captured local variables must be `final` or effectively final.",
            "In anonymous classes, `this` refers to the anonymous instance; in lambdas, `this` refers to the outer class.",
            "Use modern Lambda expressions when implementing Functional Interfaces."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Lambda Expressions & Functional Interfaces, mastering the SAM contract, Predicate, Function, Consumer, Supplier, and method references."
        }
      ]
    }
  },
  {
    slug: "lambda-expressions-and-functional-interfaces",
    title: "Lambda Expressions & Functional Interfaces",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `local-and-anonymous-inner-classes`, `interfaces-in-java`, and method signatures."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of Lambda Expressions as **Passing a Pure Action Verb Instead of a Heavy Physical Appliance**:\n• **Pre-Java 8 (The Heavy Box)**: To tell a worker to filter apples, you manufactured a physical wooden box (`new AppleFilter() { boolean test(Apple a) { ... } }`), placed the rule inside, and carried the box across the room.\n• **Modern Java (The Laser Pointer)**: You pass the raw action formula directly: `apple -> apple.getWeight() > 150`.\n• Lambdas treat code as data, passing concise executable behaviors as function parameters."
        },
        {
          type: "callout",
          title: "What is a Functional Interface?",
          content: "A **Functional Interface** is an interface that contains **EXACTLY ONE Single Abstract Method (SAM)**.\n• Annotated with `@FunctionalInterface` (compiler enforces the single abstract method rule).\n• It can contain any number of `default` or `static` methods, but only ONE abstract method."
        },
        {
          type: "code",
          title: "The 4 Core Built-In Functional Interfaces (`java.util.function`)",
          code: "import java.util.function.Predicate;\nimport java.util.function.Function;\nimport java.util.function.Consumer;\nimport java.util.function.Supplier;\n\npublic class FunctionalInterfacesDemo {\n    public static void main(String[] args) {\n        // 1. PREDICATE<T>: Takes T -> returns boolean (Condition testing)\n        Predicate<String> isValidEmail = email -> email != null && email.contains(\"@\");\n        System.out.println(\"Is valid: \" + isValidEmail.test(\"alice@studyhub.dev\")); // true\n\n        // 2. FUNCTION<T, R>: Takes T -> returns R (Transformation)\n        Function<String, Integer> stringLength = String::length; // Method reference\n        System.out.println(\"Length: \" + stringLength.apply(\"Antigravity\")); // 11\n\n        // 3. CONSUMER<T>: Takes T -> returns void (Side effect)\n        Consumer<String> logger = msg -> System.out.println(\"[LOG] \" + msg);\n        logger.accept(\"Database connection established.\");\n\n        // 4. SUPPLIER<T>: Takes nothing -> returns T (Factory / Generator)\n        Supplier<Double> randomScore = () -> Math.random() * 100.0;\n        System.out.println(\"Generated: \" + randomScore.get());\n    }\n}",
          language: "java",
          explanation: "The 4 pillars of java.util.function: Predicate (boolean test), Function (transformation), Consumer (accepts input with no return), Supplier (produces output without input)."
        },
        {
          type: "table",
          title: "The 4 Core Standard Functional Interfaces",
          headers: ["Interface", "SAM Method Signature", "Purpose", "Example Lambda Expression"],
          rows: [
            ["`Predicate<T>`", "`boolean test(T t)`", "Filter / Validate conditions", "`x -> x > 0`"],
            ["`Function<T, R>`", "`R apply(T t)`", "Transform input T to output R", "`s -> s.toUpperCase()`"],
            ["`Consumer<T>`", "`void accept(T t)`", "Execute action / print / store", "`item -> System.out.println(item)`"],
            ["`Supplier<T>`", "`T get()`", "Generate / Lazy initialization", "`() -> new ArrayList<>()`"]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Method References",
          code: "import java.util.function.*;\nclass MethodRefQuiz {\n    public static void main(String[] args) {\n        Function<String, String> f = String::toLowerCase;\n        Consumer<String> c = System.out::print;\n        c.accept(f.apply(\"JAVA \"));\n    }\n}",
          expectedOutput: "java ",
          explanation: "f converts 'JAVA ' to 'java ', and consumer c prints it to the console."
        },
        {
          type: "dryRun",
          title: "Lambda Invocation Trace via `invokedynamic`",
          iterations: [
            { step: 1, variables: { "Instruction": "invokedynamic #2" }, description: "JVM invokes bootstrap method LambdaMetafactory." },
            { step: 2, variables: { "CallSite Linkage": "Generates lightweight SAM wrapper in memory" }, description: "Dynamically links lambda expression to target method." },
            { step: 3, variables: { "Execution": "isValidEmail.test(\"alice@studyhub.dev\")" }, description: "Executes boolean check directly with zero class-file generation overhead." }
          ]
        },
        {
          type: "warning",
          title: "Lambda Pitfalls",
          items: [
            "**Adding Multiple Abstract Methods to `@FunctionalInterface`**: Causes compile error: *Unexpected @FunctionalInterface annotation: interface is not a functional interface*.",
            "**Overusing Multi-Line Lambdas**: If a lambda exceeds 3-4 lines of code, extract it into a dedicated helper method and use a Method Reference (`this::helperMethod`) to maintain readability.",
            "**Confusing Method Reference Forms**: `String::length` (instance method on arbitrary object) vs `System.out::println` (instance method on specific object) vs `Math::max` (static method)."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Can a Functional Interface Have Multiple Methods?",
          traps: [
            {
              question: "Can an interface annotated with `@FunctionalInterface` have 10 methods?",
              trap: "Answering no, thinking it can only have one method total.",
              solution: "YES, **it can have 10 methods**, provided that **EXACTLY ONE is abstract** and the other 9 are `default` or `static` methods (or abstract methods that override public methods from `java.lang.Object` like `equals()`)."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Which functional interface should be used to test whether a number is prime (taking an `Integer` and returning a `boolean`)?",
          options: [
            "`Consumer<Integer>`",
            "`Supplier<Boolean>`",
            "`Predicate<Integer>`",
            "`Function<Boolean, Integer>`"
          ],
          answer: 2,
          explanation: "`Predicate<T>` accepts an input of type `T` and returns a `boolean` (via `boolean test(T t)`)."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "A Functional Interface has exactly one abstract method (SAM).",
            "The 4 core interfaces are `Predicate` (test), `Function` (transform), `Consumer` (accept), and `Supplier` (produce).",
            "Method References (`Class::method`) provide concise shorthand for lambdas that simply call existing methods.",
            "Lambdas use `invokedynamic` for lightweight runtime linkage."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore The 'static' Keyword: Deep Dive, analyzing static fields in Metaspace, static methods, static initialization blocks, and complete class loading execution orders."
        }
      ]
    }
  },
  {
    slug: "static-keyword-deep-dive",
    title: "The 'static' Keyword: Deep Dive",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `memory-execution-overview`, `fields-and-methods`, and `constructors`."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of `static` Members as the **Classroom Whiteboard vs Students' Personal Notebooks**:\n• **Instance Fields (Personal Notebooks)**: Each of the 30 students in the class has their own notebook on their desk. Student A writing in their notebook does not affect Student B's notebook.\n• **Static Fields (The Classroom Whiteboard)**: There is only ONE whiteboard mounted at the front of the room. It belongs to the **Classroom (The Class in Metaspace)**, not any individual student. If any student writes on the whiteboard, every single person in the room immediately sees the change."
        },
        {
          type: "callout",
          title: "The 4 Applications of `static` in Java",
          content: "1. **Static Fields**: Shared class-level variables living in Metaspace (only 1 copy exists across all instances).\n2. **Static Methods**: Utility functions called via `ClassName.method()` without creating an object.\n3. **Static Blocks (`static { ... }`)**: Initialization code executed ONCE when the class is first loaded into memory.\n4. **Static Nested Classes**: Nested classes decoupled from outer instance references."
        },
        {
          type: "code",
          title: "Complete JVM Execution Order: Static vs Instance vs Constructor",
          code: "public class StaticDeepDiveDemo {\n    // 1. Static Field (Metaspace)\n    public static String staticVar = \"[1. Static Field Initialized]\";\n\n    // 2. Static Initialization Block (Runs ONCE when class is loaded)\n    static {\n        System.out.println(staticVar);\n        System.out.println(\"[2. Static Block Executed]\");\n    }\n\n    // 3. Instance Field (Heap)\n    public String instanceVar = \"[3. Instance Field Initialized]\";\n\n    // 4. Instance Initialization Block (Runs on every 'new', before constructor)\n    {\n        System.out.println(instanceVar);\n        System.out.println(\"[4. Instance Block Executed]\");\n    }\n\n    // 5. Constructor (Runs on every 'new')\n    public StaticDeepDiveDemo() {\n        System.out.println(\"[5. Constructor Executed]\\n\");\n    }\n\n    public static void main(String[] args) {\n        System.out.println(\"--- Creating First Instance ---\");\n        new StaticDeepDiveDemo();\n\n        System.out.println(\"--- Creating Second Instance ---\");\n        new StaticDeepDiveDemo();\n    }\n}",
          language: "java",
          explanation: "Static blocks execute ONCE on class loading. Instance blocks and constructors execute on every 'new' instantiation."
        },
        {
          type: "table",
          title: "The 4-Step JVM Initialization Order",
          headers: ["Order", "Phase", "Trigger", "Frequency"],
          rows: [
            ["Step 1", "Static Variable Initializers & Static Blocks", "Class is first referenced / loaded by JVM", "Executed ONCE per class loading."],
            ["Step 2", "Superclass Constructor Hierarchy", "`new SubClass()` invocation", "Executed on every `new`."],
            ["Step 3", "Instance Field Initializers & Instance Blocks", "After `super()` completes", "Executed on every `new`."],
            ["Step 4", "Constructor Body Statements", "After instance block completes", "Executed on every `new`."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Predict Static Execution Order",
          code: "class StaticTest {\n    static int count = 0;\n    static { count += 10; }\n    { count += 5; }\n    StaticTest() { count += 1; }\n    public static void main(String[] args) {\n        new StaticTest();\n        new StaticTest();\n        System.out.println(\"Final Count: \" + count);\n    }\n}",
          expectedOutput: "Final Count: 22",
          explanation: "Static block runs once (+10). Instance 1 adds instance block (+5) and constructor (+1) = 16. Instance 2 adds instance block (+5) and constructor (+1) = 22."
        },
        {
          type: "dryRun",
          title: "Class Loading & Static Block Memory Trace",
          iterations: [
            { step: 1, variables: { "Trigger": "main() method called", "ClassLoader": "Loads StaticDeepDiveDemo.class into Metaspace" }, description: "Allocates static memory in Metaspace." },
            { step: 2, variables: { "Execution": "staticVar initialized -> static block runs" }, description: "Prints Step 1 and Step 2 logs." },
            { step: 3, variables: { "Instantiation 1": "new StaticDeepDiveDemo()" }, description: "Instance block runs -> Constructor runs (Prints Step 3, 4, 5)." },
            { step: 4, variables: { "Instantiation 2": "new StaticDeepDiveDemo()" }, description: "Static block is SKIPPED. Instance block -> Constructor runs again." }
          ]
        },
        {
          type: "warning",
          title: "Static Traps",
          items: [
            "**Accessing `this` or `super` in Static Methods**: Static methods have no instance receiver, so calling `this.name` or `super.toString()` causes a compile error.",
            "**Static Memory Leaks**: Holding object references inside a `static List` or `static Map` prevents them from ever being garbage collected, causing `OutOfMemoryError`.",
            "**Non-Thread-Safe Static State**: Modifying a static variable from multiple concurrent threads causes race conditions without proper synchronization."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Can a `static` Method Be Synchronized?",
          traps: [
            {
              question: "Can you declare a `static` method with the `synchronized` keyword? What lock does it acquire?",
              trap: "Thinking synchronization only works on instances (`this`).",
              solution: "YES! **A static method can be synchronized**. While an instance synchronized method locks on the current object instance (`this`), a **synchronized static method locks on the `Class` object in Metaspace (`ClassName.class`)**, serializing execution across all threads application-wide."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "When is a `static` initialization block executed in Java?",
          options: [
            "Every time `new` is called",
            "Exactly once when the class is first loaded into memory by the ClassLoader",
            "Every time a static method is invoked",
            "When the Garbage Collector runs"
          ],
          answer: 1,
          explanation: "Static blocks execute exactly once when the class is initially loaded into memory by the JVM ClassLoader."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Static members belong to the Class in Metaspace, shared across all instances.",
            "Static blocks run exactly once on class load; instance blocks run on every `new`.",
            "Static methods cannot access `this`, `super`, or non-static instance fields.",
            "Beware of memory leaks when storing objects in static collections."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Advanced 'final' Keyword: Blank Finals & Concurrency, examining blank finals, final parameters, and the Java Memory Model final field freeze."
        }
      ]
    }
  },
  {
    slug: "final-keyword-advanced",
    title: "Advanced 'final' Keyword: Blank Finals & Concurrency",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `preventing-inheritance-final`, `constructors`, and `static-keyword-deep-dive`."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of Blank Finals and Final Fields in Concurrency as an **Engraved Official Notary Seal on a Certificate**:\n• **Blank Final (Unsigned Certificate)**: A certificate is printed with a blank signature line. It is invalid until the certified notary fills it in during the commissioning ceremony (**Constructor Body**). Once signed, it can never be rewritten.\n• **The Final Field Freeze (Concurrency Safety)**: When you mail the sealed certificate to another city (**Another Thread**), the notary guarantees the ink is completely dry and immutable before the envelope leaves the building, preventing other threads from seeing half-written or corrupted data."
        },
        {
          type: "callout",
          title: "The Java Memory Model (JMM) Final Field Freeze Guarantee",
          content: "Under the Java Memory Model:\n• When an object is constructed with `final` fields, the JVM enforces a **StoreStore memory barrier** at the end of the constructor.\n• This guarantees that all other threads reading the object reference are **100% guaranteed to see the fully initialized, correct values of all `final` fields** without needing `volatile` or `synchronized` locks!"
        },
        {
          type: "code",
          title: "Blank Final Fields & Constructor Definite Assignment",
          code: "public class BlankFinalDemo {\n    // 1. Direct initialized final\n    public final String appName = \"StudyHub\";\n\n    // 2. BLANK FINAL (Uninitialized at declaration; MUST be assigned in EVERY constructor!)\n    public final int maxConnections;\n    public final String serverRegion;\n\n    // 3. STATIC BLANK FINAL (MUST be assigned in static block!)\n    public static final String ENVIRONMENT;\n    static {\n        ENVIRONMENT = \"PRODUCTION\";\n    }\n\n    // Constructor 1\n    public BlankFinalDemo(int maxConn) {\n        this(maxConn, \"us-east-1\"); // Delegates\n    }\n\n    // Constructor 2 (Master)\n    public BlankFinalDemo(int maxConn, String region) {\n        this.maxConnections = maxConn; // Definite assignment to blank final\n        this.serverRegion = region;    // Definite assignment to blank final\n    }\n\n    public void display() {\n        System.out.println(appName + \" [\" + ENVIRONMENT + \"] -> Region: \" + serverRegion + \", MaxConn: \" + maxConnections);\n    }\n\n    public static void main(String[] args) {\n        BlankFinalDemo config = new BlankFinalDemo(500, \"eu-west-1\");\n        config.display();\n    }\n}",
          language: "java",
          explanation: "Blank final fields allow runtime parameterization while guaranteeing immutability after constructor completion."
        },
        {
          type: "table",
          title: "Final Field Types and Initialization Requirements",
          headers: ["Final Field Type", "Where It Can Be Initialized", "Compiler Invariant"],
          rows: [
            ["Standard Final Field", "At declaration (`final int x = 10;`)", "Constant value fixed at compile/declaration time."],
            ["Blank Final Field", "Inside every constructor body (`this.x = val;`)", "Must be assigned exactly ONCE in every constructor path."],
            ["Static Blank Final", "Inside a `static { ... }` block", "Must be assigned exactly ONCE during class loading."],
            ["Final Method Parameter", "At method call site (`void log(final String msg)`)", "Parameter cannot be reassigned inside method body."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Predict Blank Final Compilation",
          code: "class BlankFinalQuiz {\n    final int x;\n    BlankFinalQuiz(int val) {\n        if (val > 0) {\n            x = val;\n        } else {\n            x = 0; // Ensures definite assignment in all branches!\n        }\n    }\n    public static void main(String[] args) {\n        System.out.println(new BlankFinalQuiz(-5).x);\n    }\n}",
          expectedOutput: "0",
          explanation: "Because 'x' is definitely assigned in both if and else branches, the blank final compiles cleanly and sets x to 0."
        },
        {
          type: "dryRun",
          title: "Compiler Definite Assignment Check on Blank Finals",
          iterations: [
            { step: 1, variables: { "Code": "final int x; Constructor(int v) { if (v > 0) x = v; }" }, description: "Compiler analyzes control flow graph." },
            { step: 2, variables: { "Analysis": "What if v <= 0?" }, description: "Discovers path where 'x' remains unassigned." },
            { step: 3, variables: { "Result": "COMPILATION ERROR" }, description: "Rejects code: *variable x might not have been initialized*." }
          ]
        },
        {
          type: "warning",
          title: "Blank Final Traps",
          items: [
            "**Missing Branch in Constructor**: If any `if/else` or `switch` branch fails to initialize a blank final, compilation fails.",
            "**Reassigning Final Parameters**: Writing `final int count` in a method header and executing `count++` causes compile error: *cannot assign a value to final variable count*."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: The Final Field Freeze in Multi-Threading",
          traps: [
            {
              question: "Why is a class with `final` fields thread-safe to publish across threads without synchronization, while a class with non-final fields can suffer from visibility bugs?",
              trap: "Thinking all object reads are equal.",
              solution: "Under the **Java Memory Model (JMM)**, non-final fields can suffer from CPU instruction reordering, where Thread B sees the new object reference before Thread A's constructor has finished writing field values (observing default zeros/nulls). **Final fields enforce a memory freeze barrier**, guaranteeing that any thread seeing the object reference is guaranteed to see the fully written final field values."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Where can a non-static blank final instance field be initialized in Java?",
          options: [
            "In any regular instance method",
            "At declaration or inside constructor bodies",
            "Inside static blocks only",
            "Inside the finalize() method"
          ],
          answer: 1,
          explanation: "Blank finals must be initialized either at their declaration point or inside constructors via definite assignment."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Blank finals allow instance-specific immutability initialized via constructors.",
            "The compiler enforces Definite Assignment across all constructor branches.",
            "Final method parameters prevent accidental variable reassignment.",
            "The JMM Final Field Freeze guarantees thread-safe visibility without locks."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Enums: Custom Fields, Methods & Singleton Pattern, discovering why Java enums are full-fledged classes and the gold standard for Singletons."
        }
      ]
    }
  },
  {
    slug: "enum-types-and-custom-enums",
    title: "Enums: Custom Fields, Methods & Singleton Pattern",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `classes-and-objects`, `constructors`, and `the-this-keyword`."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of a Java Enum as a **Certified Fixed Menu of Elite Specialized Objects**:\n• In C/C++, enums are just primitive integers in disguise (`0, 1, 2`).\n• In Java, **an Enum is a full-fledged Object-Oriented Class**!\n• Each enum constant (`PENDING`, `SHIPPED`, `DELIVERED`) is a `public static final` instance of the enum class living on the Heap, complete with its own private fields, constructors, and custom methods."
        },
        {
          type: "callout",
          title: "Core Invariants of Java Enums",
          content: "• Every enum implicitly extends `java.lang.Enum` (cannot extend another class, but CAN implement interfaces).\n• Enum constructors are **implicitly `private`** (cannot be called with `new`).\n• Enums are type-safe and evaluated at compile time.\n• Optimized with specialized collections: **`EnumSet`** (bit-vector $O(1)$ operations) and **`EnumMap`**."
        },
        {
          type: "code",
          title: "Custom Enum with Fields, Methods & Abstract Calculations",
          code: "public class EnumAdvancedDemo {\n    // 1. ENUM WITH CUSTOM FIELDS & BEHAVIOR\n    public enum OrderStatus {\n        PENDING(100, \"Order placed, awaiting payment\"),\n        PROCESSING(200, \"Payment confirmed, packing goods\"),\n        SHIPPED(300, \"In transit with courier\"),\n        DELIVERED(400, \"Delivered to customer\");\n\n        private final int statusCode;\n        private final String description;\n\n        // Enum Constructor (implicitly private!)\n        OrderStatus(int code, String desc) {\n            this.statusCode = code;\n            this.description = desc;\n        }\n\n        public int getStatusCode() { return statusCode; }\n        public String getDescription() { return description; }\n    }\n\n    // 2. ENUM SINGLETON (Joshua Bloch Best Practice)\n    public enum DatabaseConnectionPool {\n        INSTANCE;\n\n        private String connectionUrl = \"jdbc:postgresql://localhost:5432/studyhub\";\n\n        public void executeQuery(String sql) {\n            System.out.println(\"Executing on \" + connectionUrl + \": \" + sql);\n        }\n    }\n\n    public static void main(String[] args) {\n        OrderStatus status = OrderStatus.SHIPPED;\n        System.out.println(status + \" [Code: \" + status.getStatusCode() + \"] - \" + status.getDescription());\n\n        // Using Enum Singleton\n        DatabaseConnectionPool.INSTANCE.executeQuery(\"SELECT * FROM users;\");\n    }\n}",
          language: "java",
          explanation: "OrderStatus encapsulates custom status codes and descriptions. DatabaseConnectionPool implements a 100% thread-safe Singleton with zero boilerplate."
        },
        {
          type: "table",
          title: "Legacy `public static final int` vs Java `enum`",
          headers: ["Dimension", "Legacy `int` Constants", "Java `enum` Types"],
          rows: [
            ["Type Safety", "❌ NO (Can pass any random integer like `999999`).", "✅ 100% Type-Safe (Compiler enforces valid enum constant)."],
            ["Debugging / Printing", "Prints raw numbers (`1`, `2`).", "Prints readable name (`SHIPPED`, `PROCESSING`)."],
            ["Fields & Methods", "Cannot attach fields or methods to ints.", "Full class support (Fields, constructors, methods)."],
            ["Namespace", "Pollutes global namespace.", "Cleanly scoped to `EnumName.CONSTANT`."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Enum Values & Ordinal",
          code: "enum Priority { LOW, MEDIUM, HIGH }\nclass EnumQuiz {\n    public static void main(String[] args) {\n        Priority p = Priority.HIGH;\n        System.out.println(p.name() + \" at index \" + p.ordinal());\n    }\n}",
          expectedOutput: "HIGH at index 2",
          explanation: "name() returns 'HIGH', and ordinal() returns its 0-indexed declaration position (2)."
        },
        {
          type: "dryRun",
          title: "Enum Class Loading & Instantiation Trace",
          iterations: [
            { step: 1, variables: { "Trigger": "OrderStatus referenced" }, description: "ClassLoader loads OrderStatus into Metaspace." },
            { step: 2, variables: { "JVM Action": "Instantiates PENDING, PROCESSING, SHIPPED, DELIVERED" }, description: "Runs private constructor for each declared constant." },
            { step: 3, variables: { "Result": "4 static final instances cached on Heap" }, description: "Zero additional instances can ever be created." }
          ]
        },
        {
          type: "warning",
          title: "Enum Traps",
          items: [
            "**Relying on `ordinal()` in Business Logic**: `ordinal()` returns the declaration position index. If someone reorders constants, ordinal values change, breaking persisted database data! Always use explicit custom field codes (`statusCode`).",
            "**Attempting to Subclass Enums**: Enums implicitly extend `java.lang.Enum` and cannot be extended via `extends`.",
            "**Calling Enum Constructors with `new`**: `new OrderStatus(100, \"...\")` produces a compile error: *enum types may not be instantiated*."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Why is Enum the Best Singleton Implementation?",
          traps: [
            {
              question: "Why does Joshua Bloch state in Effective Java that a single-element enum is the best way to implement a Singleton in Java?",
              trap: "Only citing simplicity.",
              solution: "Because **Enums provide 3 ironclad guarantees automatically**:\n1. **Free Thread-Safety**: The JVM guarantees thread-safe class loading and instantiation.\n2. **Reflection Attack Immune**: `Constructor.newInstance()` explicitly throws `IllegalArgumentException: Cannot reflectively create enum objects`.\n3. **Free Serialization Safety**: Standard serialization creates duplicate objects; the JVM handles enum serialization specially, guaranteeing zero duplicate instances upon deserialization."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Can an enum in Java implement an interface?",
          options: [
            "No, enums cannot use interfaces",
            "Yes, an enum can implement one or more interfaces",
            "Only if all methods are static",
            "Only in Java 17+"
          ],
          answer: 1,
          explanation: "While enums cannot extend other classes (they already extend `java.lang.Enum`), they can implement multiple interfaces."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Java enums are type-safe classes extending `java.lang.Enum`.",
            "Enum constants can have custom fields, constructors, and methods.",
            "Never rely on `ordinal()` for database persistence; use explicit code fields.",
            "A single-element enum is the gold standard for implementing Singletons in Java."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Java Records: Modern Immutable Data Carriers, mastering compact constructors, component accessors, and boilerplate-free data modeling."
        }
      ]
    }
  },
  {
    slug: "java-records",
    title: "Java Records: Modern Immutable Data Carriers",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `encapsulation-in-practice`, `the-object-class`, and immutability."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of a Java Record as a **Machine-Stamped Official Identification Card**:\n• In legacy Java, creating a simple data transfer object (DTO) required writing 80 lines of boilerplate: private final fields, constructors, getters, `equals()`, `hashCode()`, and `toString()`.\n• With **Java Records (Java 14+)**, you write a 1-line blueprint specification (`record Point(int x, int y) {}`).\n• The Java compiler automatically manufactures a 100% immutable, thread-safe data carrier with all standard methods pre-built."
        },
        {
          type: "callout",
          title: "What the Java Compiler Generates for a Record",
          content: "Given `public record User(int id, String name) {}`, the compiler automatically generates:\n1. `private final int id;` and `private final String name;`.\n2. Public Canonical Constructor `public User(int id, String name)`.\n3. Component Accessors `id()` and `name()` (Note: NO 'get' prefix!).\n4. Value-based `equals()`, `hashCode()`, and `toString()`.\n5. Implicit `extends java.lang.Record` and `final` class modifier."
        },
        {
          type: "code",
          title: "Java Record with Compact Constructor & Custom Validation",
          code: "public class RecordDeepDiveDemo {\n    // RECORD DECLARATION\n    public record OrderTransaction(String orderId, double amount, String currency) {\n        // COMPACT CONSTRUCTOR: Custom validation without repeating field assignments!\n        public OrderTransaction {\n            if (orderId == null || orderId.isBlank()) {\n                throw new IllegalArgumentException(\"Order ID cannot be blank.\");\n            }\n            if (amount <= 0.0) {\n                throw new IllegalArgumentException(\"Amount must be positive.\");\n            }\n            // Normalization: Field assignments (this.orderId = orderId) happen AUTOMATICALLY!\n            currency = (currency != null) ? currency.toUpperCase() : \"USD\";\n        }\n\n        // Custom instance method\n        public boolean isHighValue() {\n            return this.amount >= 1000.0;\n        }\n    }\n\n    public static void main(String[] args) {\n        OrderTransaction tx1 = new OrderTransaction(\"TX-9901\", 1500.0, \"eur\");\n        OrderTransaction tx2 = new OrderTransaction(\"TX-9901\", 1500.0, \"EUR\");\n\n        // Component accessors (no 'get' prefix)\n        System.out.println(\"ID: \" + tx1.orderId() + \" | Currency: \" + tx1.currency()); // TX-9901 | EUR\n        System.out.println(\"Is High Value: \" + tx1.isHighValue()); // true\n        \n        // Value-based equality\n        System.out.println(\"tx1.equals(tx2): \" + tx1.equals(tx2)); // true!\n        System.out.println(\"toString(): \" + tx1); // OrderTransaction[orderId=TX-9901, amount=1500.0, currency=EUR]\n    }\n}",
          language: "java",
          explanation: "Compact constructors allow clean validation and normalization without duplicate 'this.field = field' boilerplate."
        },
        {
          type: "table",
          title: "Java Record Rules & Invariants",
          headers: ["Dimension", "Record Rule", "Reason / Constraint"],
          rows: [
            ["Inheritance", "Cannot extend any class (Implicitly extends `java.lang.Record`).", "Records are final and sealed in hierarchy."],
            ["Interfaces", "CAN implement multiple interfaces (`implements A, B`).", "Enables polymorphic behavior."],
            ["Instance Fields", "CANNOT declare extra instance fields outside header.", "All instance state must be declared in component header."],
            ["Static Fields", "CAN declare `static` fields and static methods.", "Useful for constants, factories, and loggers."],
            ["Accessors", "Named after components (`id()`, `name()`).", "Clean modern syntax; not JavaBeans getter style."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Predict Record Accessor Output",
          code: "record Point(int x, int y) {}\nclass RecordQuiz {\n    public static void main(String[] args) {\n        Point p = new Point(3, 4);\n        System.out.println(p.x() + \",\" + p.y());\n    }\n}",
          expectedOutput: "3,4",
          explanation: "Record component accessors are invoked using p.x() and p.y()."
        },
        {
          type: "dryRun",
          title: "Record Creation & Compact Constructor Execution Trace",
          iterations: [
            { step: 1, variables: { "Input": "orderId=\"TX-1\", amount=1500.0, currency=\"eur\"" }, description: "Enters compact constructor." },
            { step: 2, variables: { "Validation": "orderId not blank, amount > 0.0" }, description: "Validation guards pass." },
            { step: 3, variables: { "Normalization": "currency = \"EUR\"" }, description: "Normalizes currency parameter." },
            { step: 4, variables: { "Auto Assignment": "this.orderId=\"TX-1\", this.amount=1500.0, this.currency=\"EUR\"" }, description: "Compiler automatically assigns final fields and seals object." }
          ]
        },
        {
          type: "warning",
          title: "Java Record Mistakes",
          items: [
            "**Attempting to Declare Instance Fields**: Writing `private int extraCount;` inside a record body causes compile error: *instance field is not allowed in record*.",
            "**Calling Getters with 'get' Prefix**: Calling `tx.getOrderId()` fails compilation; records use `tx.orderId()`.",
            "**Mutable Components Leak Immutability**: If a record holds an `ArrayList`, external callers can still mutate list contents unless you use defensive copying (`List.copyOf(items)`)."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Can Records Be Subclassed?",
          traps: [
            {
              question: "Can a Java Record be extended by another class using `class MyClass extends MyRecord`?",
              trap: "Assuming records behave like normal classes.",
              solution: "NO! **All Java Records are implicitly `final` and cannot be extended** (compile error). Additionally, records implicitly extend `java.lang.Record` and cannot extend any other superclass. They are designed strictly as transparent immutable data carriers."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "How are component accessor methods named in a Java record `record User(String username)`?",
          options: [
            "`user.getUsername()`",
            "`user.username()`",
            "`user.get_username()`",
            "`user.readUsername()`"
          ],
          answer: 1,
          explanation: "Record accessors match the exact component identifier name without any 'get' prefix (e.g. `user.username()`)."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Records provide concise immutable data carriers with zero boilerplate.",
            "Auto-generates private final fields, canonical constructor, accessors, `equals`, `hashCode`, and `toString`.",
            "Use Compact Constructors for clean validation and normalization.",
            "Records are implicitly `final` and extend `java.lang.Record`."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Java Generics Basics: Type Safety & Erasure, mastering parameterized types, bounded type parameters, and bytecode type erasure."
        }
      ]
    }
  },
  {
    slug: "java-generics-basics",
    title: "Java Generics Basics: Type Safety & Erasure",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `the-object-class`, `downcasting-and-instanceof`, and compile-time type checking."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of Java Generics as **Precision-Labeled Shipping Containers**:\n• **Pre-Generics (Raw Unlabeled Crates)**: You pack objects into a generic wooden crate (`ArrayList list = new ArrayList()`). The crate accepts anything: apples, books, and live dynamite. When unpacking (`(Apple) list.get(0)`), if someone packed dynamite, your code explodes at runtime (`ClassCastException`).\n• **Generics (Precision Label `<Apple>`)**: The crate has an electronic scanner at the door (`List<Apple>`). It forbids anything other than Apples from entering at compile time, guaranteeing 100% unpacking safety with zero manual type casts."
        },
        {
          type: "callout",
          title: "What is Type Erasure?",
          content: "Java Generics are a **Compile-Time Safety Feature**:\n• The compiler validates all generic types at build time.\n• Once compilation succeeds, the compiler performs **Type Erasure**, removing all generic type parameters (`<T>`) and replacing them with raw `Object` (or the bounding superclass) in the `.class` bytecode.\n• This guarantees 100% backward compatibility with pre-Java 5 legacy bytecode."
        },
        {
          type: "code",
          title: "Generic Classes, Generic Methods & Bounded Type Parameters",
          code: "public class GenericsBasicsDemo {\n    // 1. GENERIC CLASS with 2 type parameters <K, V>\n    static class KeyValuePair<K, V> {\n        private K key;\n        private V value;\n\n        public KeyValuePair(K k, V v) {\n            this.key = k;\n            this.value = v;\n        }\n\n        public K getKey() { return key; }\n        public V getValue() { return value; }\n    }\n\n    // 2. BOUNDED GENERIC METHOD (<T extends Number>): Only accepts numeric types!\n    public static <T extends Number> double calculateSum(T num1, T num2) {\n        // Can safely call Number methods like doubleValue()!\n        return num1.doubleValue() + num2.doubleValue();\n    }\n\n    public static void main(String[] args) {\n        // Type-safe generic pair\n        KeyValuePair<String, Integer> studentRank = new KeyValuePair<>(\"Alice\", 1);\n        System.out.println(studentRank.getKey() + \": Rank #\" + studentRank.getValue());\n\n        // Bounded generic method\n        double sumInt = calculateSum(10, 25);\n        double sumDouble = calculateSum(4.5, 9.2);\n        System.out.println(\"Sum Ints: \" + sumInt + \" | Sum Doubles: \" + sumDouble);\n    }\n}",
          language: "java",
          explanation: "KeyValuePair<K, V> provides compile-time type safety. calculateSum(<T extends Number>) restricts arguments to subclasses of java.lang.Number."
        },
        {
          type: "table",
          title: "Standard Generic Type Parameter Naming Conventions",
          headers: ["Type Parameter", "Standard Meaning", "Common Use Case"],
          rows: [
            ["`T`", "Type", "General generic type parameter (`List<T>`, `Box<T>`)."],
            ["`E`", "Element", "Collections framework elements (`ArrayList<E>`, `Set<E>`)."],
            ["`K`, `V`", "Key, Value", "Key-value mapping data structures (`Map<K, V>`)."],
            ["`N`", "Number", "Numerical algorithms."],
            ["`R`", "Return / Result", "Function return types (`Function<T, R>`)."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Predict Bounded Type Safety",
          code: "class Box<T> {\n    T item;\n    Box(T i) { item = i; }\n    T getItem() { return item; }\n}\nclass TestBox {\n    public static void main(String[] args) {\n        Box<String> b = new Box<>(\"StudyHub\");\n        String val = b.getItem(); // No manual cast needed!\n        System.out.println(\"Length: \" + val.length());\n    }\n}",
          expectedOutput: "Length: 8",
          explanation: "Generics eliminate manual downcasting: b.getItem() returns String directly."
        },
        {
          type: "dryRun",
          title: "Type Erasure Compilation Trace",
          iterations: [
            { step: 1, variables: { "Source Code": "class Box<T extends Number> { T val; }" }, description: "Programmer writes bounded generic class." },
            { step: 2, variables: { "Compile-Time Check": "new Box<String>()" }, description: "Compiler rejects: String does not extend Number!" },
            { step: 3, variables: { "Type Erasure": "Emits bytecode for Box" }, description: "Replaces 'T' with bounding type 'Number': 'class Box { Number val; }'." },
            { step: 4, variables: { "Bridge Casts": "Emits synthetic checkcasts at call sites" }, description: "Ensures type safety in bytecode without modifying JVM runtime architecture." }
          ]
        },
        {
          type: "warning",
          title: "Common Generics Traps",
          items: [
            "**Cannot Use Primitives with Generics**: `List<int>` is illegal; you must use wrapper classes `List<Integer>`.",
            "**Cannot Instantiate Generic Types with `new`**: `new T()` or `new T[10]` is illegal because `T` is erased to `Object` at runtime.",
            "**Cannot Check `instanceof` on Parameterized Types**: `if (obj instanceof List<String>)` is illegal due to type erasure (use `if (obj instanceof List<?>)`)."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Why Can't You Create Generic Arrays (`new T[10]`)?",
          traps: [
            {
              question: "Why does Java forbid creating generic arrays, such as `T[] arr = new T[10];`?",
              trap: "Thinking it's just missing syntax.",
              solution: "Because **Java Arrays are Reified (retain type at runtime), while Generics are Erased (type removed at compile time)**!\n• Arrays enforce type safety at runtime by checking every store (`arr[0] = item`).\n• Because `T` is erased to `Object`, `new T[10]` would create an `Object[]` array in memory, breaking array runtime type safety guarantees."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "What does the Java compiler do to generic type parameters during compilation (Type Erasure)?",
          options: [
            "Creates a separate .class file for every type parameter",
            "Erases type parameters and replaces them with their bounding type (or Object) in bytecode",
            "Converts all objects to C++ pointers",
            "Throws an exception at runtime"
          ],
          answer: 1,
          explanation: "Type Erasure strips generic type information at compile time, replacing `<T>` with its bound (e.g. `Number` or `Object`) for JVM backward compatibility."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Generics provide compile-time type safety and eliminate manual type casts.",
            "Bounded type parameters (`<T extends Number>`) restrict allowed types to specific hierarchies.",
            "Type Erasure removes generic type parameters in bytecode for backward compatibility.",
            "Cannot use primitive types (`List<int>` is illegal; use `List<Integer>`)."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Module",
          content: "Next, we enter Module 8: SOLID Principles & Design Patterns, mastering professional architecture standards and top interview system design challenges."
        }
      ]
    }
  }
];
