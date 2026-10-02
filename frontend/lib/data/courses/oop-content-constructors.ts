// Module 3 - Constructors (5 lessons)
import { CourseLessonContent } from './types';

export const constructorsLessons: Array<{
  slug: string;
  title: string;
  content: CourseLessonContent
}> = [
  {
    slug: "what-is-a-constructor",
    title: "What is a Constructor? Object Initialization",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `classes-and-objects`, `fields-and-methods`, and the `new` keyword."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of a Constructor as a **Quality-Control Assembly Inspector at a Car Factory**:\n• When a new car rolls off the welding robots (`new Car()`), it cannot be driven onto public roads until the commissioning inspector:\n  1. Installs the steering wheel and odometer (`field initialization`).\n  2. Fills the engine with oil and brake fluid (`mandatory invariant setup`).\n  3. Validates the VIN number (`parameter validation`).\n• The constructor is the mandatory gateway code that runs automatically every time an object is born, guaranteeing it starts in a valid, usable state."
        },
        {
          type: "callout",
          title: "The 3 Inviolable Rules of Java Constructors",
          content: "1. **Exact Name Match**: A constructor MUST have the exact same identifier name as its enclosing class (case-sensitive).\n2. **NO Return Type**: A constructor must NOT declare any return type—not even `void`!\n3. **Invoked via `new`**: A constructor cannot be called like a standard method; it is executed automatically by the JVM during object instantiation."
        },
        {
          type: "code",
          title: "Constructor Anatomy vs Regular Method",
          code: "public class ConstructorBasicsDemo {\n    static class BankCustomer {\n        String name;\n        int creditScore;\n        boolean isVerified;\n\n        // 1. CONSTRUCTOR: Name matches class, NO return type\n        public BankCustomer(String customerName, int initialCredit) {\n            System.out.println(\"--> Constructor Executing: Initializing \" + customerName);\n            this.name = customerName;\n            this.creditScore = initialCredit;\n            this.isVerified = initialCredit >= 650; // Invariant calculation\n        }\n\n        // 2. REGULAR METHOD: Declares a return type (void)\n        public void displayStatus() {\n            System.out.println(name + \" | Credit: \" + creditScore + \" | Verified: \" + isVerified);\n        }\n    }\n\n    public static void main(String[] args) {\n        // 'new' allocates heap memory and automatically invokes the constructor\n        BankCustomer c1 = new BankCustomer(\"Alice\", 720);\n        c1.displayStatus(); // Alice | Credit: 720 | Verified: true\n    }\n}",
          language: "java",
          explanation: "The constructor BankCustomer(String, int) sets fields and computes isVerified upon creation, ensuring c1 is ready for immediate use."
        },
        {
          type: "table",
          title: "Constructor vs Regular Method: Comparison",
          headers: ["Feature", "Constructor", "Regular Method"],
          rows: [
            ["Purpose", "Initialize state and invariants of a new object.", "Perform operations, business logic, or transformations."],
            ["Name", "MUST match class name exactly.", "Can be any valid identifier (camelCase)."],
            ["Return Type", "NONE (not even `void`).", "MUST declare a return type (`void`, `int`, `String`, etc.)."],
            ["Invocation", "Invoked implicitly by JVM via `new` operator.", "Invoked explicitly using dot operator (`obj.method()`)."],
            ["Inheritance", "Constructors are NOT inherited by subclasses.", "Methods are inherited by subclasses (unless private)."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: The Phantom Method Trap",
          code: "class TrapDemo {\n    int x = 10;\n    // ACCIDENTAL VOID: This is a regular method, NOT a constructor!\n    void TrapDemo() {\n        x = 99;\n    }\n    public static void main(String[] args) {\n        TrapDemo obj = new TrapDemo();\n        System.out.println(\"x = \" + obj.x);\n    }\n}",
          expectedOutput: "x = 10",
          explanation: "Adding 'void' turned TrapDemo() into a regular method. When 'new TrapDemo()' ran, it executed the default constructor, leaving x = 10."
        },
        {
          type: "dryRun",
          title: "Object Creation & Constructor Execution Lifecycle",
          iterations: [
            { step: 1, variables: { "Tool": "new BankCustomer(...)", "Location": "Heap" }, description: "JVM allocates contiguous memory for object header + fields on Heap." },
            { step: 2, variables: { "Field Zeroing": "name=null, creditScore=0, isVerified=false" }, description: "JVM sets all instance fields to default zero/null values." },
            { step: 3, variables: { "Super Call": "super() (java.lang.Object)" }, description: "Executes Object superclass constructor." },
            { step: 4, variables: { "Constructor Body": "this.name = 'Alice', this.creditScore = 720" }, description: "Executes constructor body statements." },
            { step: 5, variables: { "Return": "Heap address 0x51A2 returned to caller" }, description: "Assigns completed object pointer to stack reference variable." }
          ]
        },
        {
          type: "warning",
          title: "Common Constructor Traps",
          items: [
            "**Declaring `void` on Constructor**: Writing `public void Car() {}` does NOT produce a compiler error; it secretly creates a regular method that is never called during `new Car()`!",
            "**Overriding Constructors**: Constructors cannot be overridden because they belong strictly to the enclosing class and are not inherited.",
            "**Throwing Exceptions Without Cleanup**: Throwing exceptions inside constructors aborts object creation; partially initialized state is discarded for garbage collection."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Can a Constructor be Marked `private`?",
          traps: [
            {
              question: "Can a constructor be declared with the `private` access modifier? What is the practical architectural use case?",
              trap: "Thinking private constructors are useless because no objects could ever be created.",
              solution: "YES, **private constructors are widely used in professional architecture**:\n1. **Singleton Pattern**: Restricts instantiation so only one global instance can be created internally (e.g. `DatabaseConnection.getInstance()`).\n2. **Utility / Helper Classes**: Prevents instantiating purely static classes (e.g. `java.lang.Math`, `java.util.Collections`).\n3. **Factory Method Pattern**: Forces callers to use named static factory methods (e.g. `ComplexNumber.fromCartesian(x, y)`)."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "What happens if you write `public void Point(int x, int y)` in a class named `Point`?",
          options: [
            "Compilation error: constructors cannot have parameters",
            "It defines a valid constructor that returns void",
            "It defines a regular member method named Point; it is NOT a constructor",
            "Throws a RuntimeException upon class loading"
          ],
          answer: 2,
          explanation: "Declaring a return type (like `void`) causes the Java compiler to treat it as a regular instance method, not a constructor."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Constructors initialize state and enforce invariants during object instantiation.",
            "Must match the class name exactly and cannot declare any return type.",
            "Executed automatically during the `new` lifecycle.",
            "Private constructors are used in Singletons, utility classes, and static factories."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Default vs Parameterized Constructors, analyzing the compiler's automatic default constructor and why it disappears when custom constructors are declared."
        }
      ]
    }
  },
  {
    slug: "default-vs-parameterized-constructors",
    title: "Default vs Parameterized Constructors",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `what-is-a-constructor`, field initializations, and method signatures."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of Constructor Types as **Ordering Furniture (Standard Catalog vs Custom-Built)**:\n• **The Default Constructor (Standard Catalog)**: You order \"Table #101\" with zero custom options (`new Table()`). The factory builds it using standard factory defaults (Plain wood, 4 standard legs).\n• **The Parameterized Constructor (Custom Commission)**: You order \"Table #101\" with explicit dimensions and finishes (`new Table(\"Mahogany\", 6, true)`). You specify the exact state at the moment of creation."
        },
        {
          type: "callout",
          title: "The Law of the Disappearing Default Constructor",
          content: "⚠️ **CRITICAL JAVA RULE**: If you write **ZERO** constructors in your class, the Java compiler automatically synthesizes an empty, no-argument **Default Constructor** for you.\n• HOWEVER, the instant you define even **ONE** custom parameterized constructor, the compiler **immediately revokes and deletes the automatic default constructor**!"
        },
        {
          type: "code",
          title: "The Disappearing Default Constructor in Action",
          code: "public class ConstructorTypesDemo {\n    // Case 1: No constructor written -> Compiler provides invisible default Product()\n    static class DefaultProduct {\n        String title = \"Generic\";\n        double price = 0.0;\n    }\n\n    // Case 2: Custom parameterized constructor written\n    static class CustomProduct {\n        String title;\n        double price;\n\n        // Parameterized Constructor\n        public CustomProduct(String title, double price) {\n            this.title = title;\n            this.price = price;\n        }\n\n        // Explicit No-Arg Constructor (Must be manually added if needed!)\n        public CustomProduct() {\n            this.title = \"Default Title\";\n            this.price = 9.99;\n        }\n    }\n\n    public static void main(String[] args) {\n        // Uses compiler-synthesized default constructor\n        DefaultProduct p1 = new DefaultProduct();\n        System.out.println(\"P1: \" + p1.title); // Generic\n\n        // Uses parameterized constructor\n        CustomProduct p2 = new CustomProduct(\"Mechanical Keyboard\", 89.99);\n        System.out.println(\"P2: \" + p2.title + \" - $\" + p2.price);\n\n        // Uses explicit no-arg constructor\n        CustomProduct p3 = new CustomProduct();\n        System.out.println(\"P3: \" + p3.title + \" - $\" + p3.price);\n    }\n}",
          language: "java",
          explanation: "In CustomProduct, if we did not manually write 'public CustomProduct()', calling 'new CustomProduct()' would fail with a compile error."
        },
        {
          type: "table",
          title: "Default Constructor vs Explicit No-Arg vs Parameterized",
          headers: ["Constructor Type", "Created By", "Parameters", "When Does It Exist?"],
          rows: [
            ["Implicit Default Constructor", "Java Compiler (`javac`)", "None (`()` )", "ONLY when NO other constructors exist in source code."],
            ["Explicit No-Arg Constructor", "Programmer", "None (`()` )", "Whenever programmer explicitly writes `public MyClass() {}`."],
            ["Parameterized Constructor", "Programmer", "1 or more (`(int a, String b)`)", "Whenever programmer explicitly defines parameters."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Predict Missing Constructor Error",
          code: "class Item {\n    String name;\n    Item(String n) { name = n; }\n}\n\nclass StoreTest {\n    public static void main(String[] args) {\n        // Item item = new Item(); // Would cause: constructor Item in class Item cannot be applied to given types\n        Item item = new Item(\"Coffee\");\n        System.out.println(\"Item created: \" + item.name);\n    }\n}",
          expectedOutput: "Item created: Coffee",
          explanation: "Because Item defined a parameterized constructor, the default no-arg constructor ceased to exist. Only 'new Item(\"Coffee\")' compiles."
        },
        {
          type: "dryRun",
          title: "Compiler Constructor Synthesis Decision Tree",
          iterations: [
            { step: 1, variables: { "Source Code": "class A { int x; }" }, description: "Zero constructors written -> Compiler injects 'public A() { super(); }'." },
            { step: 2, variables: { "Source Code": "class B { B(int x) {} }" }, description: "One parameterized constructor written -> Compiler generates NOTHING extra. B has only B(int)." },
            { step: 3, variables: { "Source Code": "class C { C() {} C(int x) {} }" }, description: "Both written explicitly -> C has both no-arg and parameterized constructors available." }
          ]
        },
        {
          type: "warning",
          title: "Enterprise Framework Reflection Warning",
          items: [
            "**Framework Crash (Spring / Hibernate / Jackson)**: ORM and JSON serialization libraries use Java Reflection to instantiate objects using the no-arg constructor (`Class.getDeclaredConstructor().newInstance()`). If you create a parameterized constructor and forget to write an explicit no-arg constructor, serialization will crash with `NoSuchMethodException`.",
            "**Subclass Invariant Failure**: Subclass constructors implicitly call `super()`. If the parent class loses its no-arg constructor, all child classes will fail to compile unless they explicitly call `super(args)`."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Does the JVM Provide a Default Constructor?",
          traps: [
            {
              question: "Does the JVM at runtime provide a default constructor if none is present in the `.class` bytecode file?",
              trap: "Confusing the JVM runtime with the javac compiler.",
              solution: "NO! The **JVM does not generate constructors**. It is the **Java Compiler (`javac`)** at compile time that inserts the default constructor into the `.class` bytecode file. If the compiler does not insert it (because another constructor was written), the bytecode contains no default constructor, and attempting to call one throws a compile error."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "When does the Java compiler automatically generate a default no-argument constructor for a class?",
          options: [
            "Always, for every class",
            "Only when the class is marked public",
            "Only when the programmer has not declared ANY constructor in the class",
            "Only when the class implements an interface"
          ],
          answer: 2,
          explanation: "The compiler provides a default no-argument constructor if and only if the class contains zero explicitly written constructors."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "The compiler synthesizes a no-arg constructor only when no constructors are written.",
            "Declaring any custom constructor deletes the automatic default constructor.",
            "Always include an explicit no-arg constructor in classes used with frameworks (Spring, JPA, Jackson).",
            "Parameterized constructors guarantee mandatory state is supplied at creation time."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Constructor Overloading, mastering multiple initialization pathways, parameter differentiation, and the master constructor pattern."
        }
      ]
    }
  },
  {
    slug: "constructor-overloading",
    title: "Constructor Overloading & Multiple Initialization Paths",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `default-vs-parameterized-constructors`, `the-this-keyword`, and method overloading basics."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of Constructor Overloading as **Multiple Ticket Options for an Airline Flight**:\n• **Economy Ticket**: `new FlightBooking(\"Alice\")` &rarr; Provides name; seat and meals are assigned standard defaults.\n• **Business Ticket**: `new FlightBooking(\"Bob\", \"Seat 2A\")` &rarr; Specifies name and seat.\n• **First-Class Ticket**: `new FlightBooking(\"Charlie\", \"Seat 1A\", \"Vegan\", true)` &rarr; Specifies full custom configuration.\n• All ticket tiers ultimately create a valid `FlightBooking` object on the same plane, but each offers a tailored initialization pathway."
        },
        {
          type: "callout",
          title: "Constructor Overloading Rules",
          content: "A class can have multiple constructors as long as their **parameter lists differ in**:\n1. **Number of parameters** (e.g. 1 param vs 3 params).\n2. **Data types of parameters** (e.g. `int` vs `String`).\n3. **Order of parameter types** (e.g. `(int, String)` vs `(String, int)`).\n*Note: Constructors do not have return types, so return type is never a factor.*"
        },
        {
          type: "code",
          title: "Overloaded Constructors with Master Canonical Delegation",
          code: "public class ConstructorOverloadingDemo {\n    static class Book {\n        private String title;\n        private String author;\n        private double price;\n        private int pages;\n\n        // Constructor 1: Minimum required info\n        public Book(String title) {\n            this(title, \"Anonymous\", 0.0, 100); // Delegate to Master Constructor\n        }\n\n        // Constructor 2: Standard info\n        public Book(String title, String author) {\n            this(title, author, 19.99, 250); // Delegate to Master Constructor\n        }\n\n        // Constructor 3: Master Canonical Constructor (Handles all fields & validation)\n        public Book(String title, String author, double price, int pages) {\n            this.title = (title != null) ? title : \"Untitled\";\n            this.author = (author != null) ? author : \"Unknown\";\n            this.price = Math.max(0.0, price);\n            this.pages = Math.max(1, pages);\n        }\n\n        public void printSummary() {\n            System.out.println(\"'\" + title + \"' by \" + author + \" ($ \" + price + \", \" + pages + \"p)\");\n        }\n    }\n\n    public static void main(String[] args) {\n        Book b1 = new Book(\"Java Mastery\");\n        Book b2 = new Book(\"Clean Architecture\", \"Robert Martin\");\n        Book b3 = new Book(\"Effective Java\", \"Joshua Bloch\", 45.0, 412);\n\n        b1.printSummary(); // 'Java Mastery' by Anonymous ($ 0.0, 100p)\n        b2.printSummary(); // 'Clean Architecture' by Robert Martin ($ 19.99, 250p)\n        b3.printSummary(); // 'Effective Java' by Joshua Bloch ($ 45.0, 412p)\n    }\n}",
          language: "java",
          explanation: "The Master Constructor Pattern centralizes all validation logic in one place. Overloaded constructors delegate defaults using this(...) without duplicating code."
        },
        {
          type: "table",
          title: "Constructor Overloading Valid vs Invalid Signatures",
          headers: ["Candidate Signature", "Comparison with `Book(String, int)`", "Compiler Valid?"],
          rows: [
            ["`Book(String title)`", "Fewer parameters (1 vs 2).", "✅ VALID"],
            ["`Book(String title, String author)`", "Different type at index 1 (`String` vs `int`).", "✅ VALID"],
            ["`Book(int pages, String title)`", "Swapped parameter order (`int, String` vs `String, int`).", "✅ VALID"],
            ["`Book(String name, int count)`", "Identical parameter types `(String, int)` (only variable names changed).", "❌ COMPILE ERROR (Duplicate)"]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Predict Constructor Resolution",
          code: "class OverloadTest {\n    OverloadTest(int x) { System.out.print(\"INT \"); }\n    OverloadTest(double d) { System.out.print(\"DOUBLE \"); }\n    OverloadTest(String s) { System.out.print(\"STRING \"); }\n\n    public static void main(String[] args) {\n        new OverloadTest(10);\n        new OverloadTest(5.5);\n        new OverloadTest(\"Hello\");\n    }\n}",
          expectedOutput: "INT DOUBLE STRING ",
          explanation: "The compiler matches constructor signatures based on exact parameter types: int -> DOUBLE -> STRING."
        },
        {
          type: "dryRun",
          title: "Delegation Trace for `new Book(\"Java Mastery\")`",
          iterations: [
            { step: 1, variables: { "Call": "new Book(\"Java Mastery\")" }, description: "Enters 1-arg constructor Book(String)." },
            { step: 2, variables: { "Instruction": "this(title, \"Anonymous\", 0.0, 100)" }, description: "Delegates immediately to 4-arg master constructor." },
            { step: 3, variables: { "Master Execution": "title='Java Mastery', author='Anonymous', price=0.0, pages=100" }, description: "Runs centralized validation and initializes all 4 fields." },
            { step: 4, variables: { "Completion": "Returns to 1-arg constructor -> Returns to caller" }, description: "Object fully initialized and delivered to main()." }
          ]
        },
        {
          type: "warning",
          title: "Constructor Overloading Traps",
          items: [
            "**Duplicating Validation Code**: Writing validation logic inside every constructor creates maintenance bugs; always delegate to a single master constructor using `this(...)`.",
            "**Ambiguous Overloading with `null`**: If you have `User(String s)` and `User(Integer i)`, calling `new User(null)` causes a compile error: *reference to User is ambiguous*.",
            "**Telescoping Constructor Anti-Pattern**: Having 8 overloaded constructors with dozens of optional parameters becomes unreadable. Use the **Builder Pattern** for complex objects."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Can Constructors Be Overridden?",
          traps: [
            {
              question: "Can a constructor be overloaded in Java? Can a constructor be overridden?",
              trap: "Saying yes to both.",
              solution: "• **Overloaded**: **YES!** A class can have many constructors with different parameter signatures.\n• **Overridden**: **NO!** Method overriding applies strictly to inherited methods. Because constructors are NOT inherited by subclasses and have names matching their specific class, a subclass can never override a parent constructor."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Can two constructors in the same class have the signatures `MyClass(int a, String b)` and `MyClass(int count, String name)`?",
          options: [
            "Yes, because the parameter names are different",
            "No, because the parameter type sequence (int, String) is identical, causing a duplicate constructor error",
            "Yes, if one is public and the other is private",
            "Yes, if they have different annotations"
          ],
          answer: 1,
          explanation: "Java differentiates overloaded methods and constructors strictly by parameter types, order, and count—parameter variable names are completely ignored."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Constructor overloading provides multiple initialization options for callers.",
            "Overloads must differ in parameter type, count, or sequence.",
            "Use the Master Canonical Constructor pattern with `this(...)` to avoid duplicate validation logic.",
            "Constructors can be overloaded but NEVER overridden."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Constructor Chaining: `this()` and `super()`, tracing execution flow across inheritance hierarchies and understanding the first-statement rule."
        }
      ]
    }
  },
  {
    slug: "constructor-chaining-this-and-super",
    title: "Constructor Chaining: `this()` and `super()`",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `the-this-keyword`, `constructor-overloading`, and basic class inheritance (`extends`)."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of Constructor Chaining as **Constructing a Skyscraper Floor by Floor**:\n• You cannot build the 10th floor penthouse (**Subclass**) until the ground foundation and structural columns (**Superclass**) are completely poured and set.\n• When a child constructor runs, its very first action is to call up to its parent (`super()`), which calls its grandparent, all the way up to `java.lang.Object`.\n• The foundations initialize top-down ($Object \\to Parent \\to Child$), ensuring the child inherits a rock-solid, fully initialized base."
        },
        {
          type: "callout",
          title: "The Inviolable First-Statement Rule",
          content: "In Java, a constructor's first statement MUST be either:\n1. `this(...)`: To call another constructor in the **same class**.\n2. `super(...)`: To call a constructor in the **direct superclass**.\n• If you do not explicitly write either, the Java compiler automatically inserts `super();` as the first statement for you!"
        },
        {
          type: "code",
          title: "Constructor Chaining in an Inheritance Hierarchy",
          code: "public class ConstructorChainingDemo {\n    // Base Grandparent Class\n    static class Device {\n        String brand;\n        Device(String brand) {\n            System.out.println(\"1. Device Super-Constructor: Brand = \" + brand);\n            this.brand = brand;\n        }\n    }\n\n    // Intermediate Parent Class\n    static class Computer extends Device {\n        int ramGB;\n        Computer(String brand, int ram) {\n            super(brand); // Calls Device(brand)\n            System.out.println(\"2. Computer Constructor: RAM = \" + ram + \"GB\");\n            this.ramGB = ram;\n        }\n    }\n\n    // Leaf Child Class\n    static class GamingLaptop extends Computer {\n        String gpuModel;\n\n        // Overloaded Constructor 1 (Intra-class chaining via this())\n        GamingLaptop(String brand) {\n            this(brand, 16, \"RTX 4060\"); // Delegates to Constructor 2\n        }\n\n        // Overloaded Constructor 2 (Super-class chaining via super())\n        GamingLaptop(String brand, int ram, String gpu) {\n            super(brand, ram); // Calls Computer(brand, ram)\n            System.out.println(\"3. GamingLaptop Constructor: GPU = \" + gpu);\n            this.gpuModel = gpu;\n        }\n    }\n\n    public static void main(String[] args) {\n        System.out.println(\"=== Instantiating GamingLaptop ===\");\n        GamingLaptop laptop = new GamingLaptop(\"Asus\");\n    }\n}",
          language: "java",
          explanation: "Calling new GamingLaptop(\"Asus\") delegates via this() to GamingLaptop(3-args) -> calls super() to Computer -> calls super() to Device -> outputs 1, 2, 3 in hierarchical order."
        },
        {
          type: "table",
          title: "`this()` vs `super()` Constructor Invocations",
          headers: ["Attribute", "`this(...)`", "`super(...)`"],
          rows: [
            ["Target", "Calls another constructor in the SAME class.", "Calls a constructor in the DIRECT SUPERCLASS."],
            ["Position Constraint", "MUST be the 1st statement in constructor.", "MUST be the 1st statement in constructor."],
            ["Can Coexist?", "NO (Cannot have both `this()` and `super()` on line 1).", "NO (Cannot have both `this()` and `super()` on line 1)."],
            ["Compiler Default", "Never inserted automatically.", "Compiler inserts `super();` automatically if neither is present."],
            ["Recursive Prohibition", "Recursive chaining (`A -> B -> A`) is a compile error.", "Must terminate at `java.lang.Object`."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Predict Chaining Order",
          code: "class Base {\n    Base() { System.out.print(\"A \"); }\n}\nclass Derived extends Base {\n    Derived() {\n        this(5);\n        System.out.print(\"B \");\n    }\n    Derived(int x) {\n        // super() is implicitly called here!\n        System.out.print(\"C \");\n    }\n}\nclass TestChain {\n    public static void main(String[] args) {\n        new Derived();\n    }\n}",
          expectedOutput: "A C B ",
          explanation: "new Derived() calls this(5) -> Derived(5) calls implicit super() -> Base() prints 'A ' -> Derived(5) prints 'C ' -> Derived() prints 'B '."
        },
        {
          type: "dryRun",
          title: "Stack & Initialization Trace for `new GamingLaptop(\"Asus\")`",
          iterations: [
            { step: 1, variables: { "Call": "GamingLaptop(\"Asus\")" }, description: "Invokes 1-arg constructor. Executes this(\"Asus\", 16, \"RTX 4060\")." },
            { step: 2, variables: { "Call": "GamingLaptop(3-args)" }, description: "Executes super(\"Asus\", 16) calling Computer constructor." },
            { step: 3, variables: { "Call": "Computer(2-args)" }, description: "Executes super(\"Asus\") calling Device constructor." },
            { step: 4, variables: { "Call": "Device(\"Asus\")" }, description: "Calls Object() -> Sets brand=\"Asus\" -> Prints '1. Device'." },
            { step: 5, variables: { "Unwind 1": "Computer body resumes" }, description: "Sets ramGB=16 -> Prints '2. Computer'." },
            { step: 6, variables: { "Unwind 2": "GamingLaptop body resumes" }, description: "Sets gpuModel=\"RTX 4060\" -> Prints '3. GamingLaptop'." }
          ]
        },
        {
          type: "warning",
          title: "Common Constructor Chaining Traps",
          items: [
            "**Writing Both `this()` and `super()`**: Putting both `this(\"default\");` and `super();` in the same constructor is a compile error because both demand to be the first statement.",
            "**Parent Missing No-Arg Constructor**: If a superclass defines `Parent(int x)` without a no-arg constructor, child classes with default constructors will fail to compile because the compiler's implicit `super();` call finds no match.",
            "**Accessing Instance Members Inside `this()` / `super()` arguments**: You cannot pass instance fields or call instance methods as arguments to `this(field)` or `super(method())` because the object has not finished being constructed."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Implicit `super()` and Compilation Failures",
          traps: [
            {
              question: "Why does the following code fail to compile?\n```java\nclass Vehicle { Vehicle(String type) {} }\nclass Truck extends Vehicle { Truck() {} }\n```",
              trap: "Thinking Truck has a syntax error in its constructor.",
              solution: "Because `Truck()` does not explicitly call `super(...)`, the compiler automatically inserts `super();` on line 1. However, `Vehicle` has ONLY a parameterized constructor `Vehicle(String)` and NO no-arg constructor `Vehicle()`. The implicit `super();` fails to find a matching constructor in `Vehicle`, producing a compile error: *constructor Vehicle in class Vehicle cannot be applied to given types*. Fix: Write `Truck() { super(\"Heavy\"); }` or add `Vehicle() {}`."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "What statement does the Java compiler automatically insert on line 1 of a constructor if you write neither `this(...)` nor `super(...)`?",
          options: [
            "`this();`",
            "`super();`",
            "`return;`",
            "`Object.init();`"
          ],
          answer: 1,
          explanation: "The compiler automatically inserts an explicit zero-argument `super();` call to invoke the parent class's no-argument constructor."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "`this(...)` delegates to another constructor in the same class; `super(...)` invokes the parent constructor.",
            "Either `this(...)` or `super(...)` must be the absolute first statement in any constructor body.",
            "Constructors initialize hierarchical state top-down from `Object` down to the leaf subclass.",
            "If a parent class has no zero-arg constructor, child constructors MUST explicitly call `super(args)`."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Copy Constructors & Object Cloning, analyzing shallow vs deep copying, defensive duplication, and why Joshua Bloch recommends copy constructors over `clone()`."
        }
      ]
    }
  },
  {
    slug: "copy-constructors-and-cloning",
    title: "Copy Constructors & Object Cloning",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `stack-vs-heap-objects`, `getters-and-setters-best-practices`, and `constructor-overloading`."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of Copying Objects as **Cloning an Experimental Laboratory Drone**:\n• **Shallow Copy (Shared Remote Control)**: You assemble a second drone frame, but you wire both drones to the exact same shared lithium battery pack (**Shared Heap Object**). If Drone 1 discharges the battery, Drone 2 immediately loses power and crashes.\n• **Deep Copy (Complete Independent Replica)**: You manufacture an entirely new drone frame AND build a brand-new, isolated lithium battery pack for it. Drone 1 and Drone 2 can fly, charge, and crash independently without affecting each other."
        },
        {
          type: "callout",
          title: "What is a Copy Constructor?",
          content: "A **Copy Constructor** is a specialized constructor that creates a new object as an exact, independent duplicate of an existing object of the same class:\n```java\npublic Student(Student other) {\n    this.id = other.id;\n    this.name = other.name;\n    this.courses = new ArrayList<>(other.courses); // Deep copy of mutable list!\n}\n```"
        },
        {
          type: "code",
          title: "Shallow Copy Vulnerability vs Deep Copy Constructor",
          code: "import java.util.ArrayList;\nimport java.util.List;\n\npublic class CopyConstructorDemo {\n    static class Address {\n        String city;\n        Address(String city) { this.city = city; }\n        // Copy constructor for nested object\n        Address(Address other) { this.city = other.city; }\n    }\n\n    static class Employee {\n        String name;\n        Address address;\n        List<String> projects;\n\n        // Standard Constructor\n        public Employee(String name, Address address, List<String> projects) {\n            this.name = name;\n            this.address = address;\n            this.projects = projects;\n        }\n\n        // === DEEP COPY CONSTRUCTOR ===\n        public Employee(Employee other) {\n            this.name = other.name; // Immutable String is safe to share\n            // Deep copy nested mutable Address\n            this.address = (other.address != null) ? new Address(other.address) : null;\n            // Deep copy mutable List\n            this.projects = (other.projects != null) ? new ArrayList<>(other.projects) : new ArrayList<>();\n        }\n    }\n\n    public static void main(String[] args) {\n        Address addr = new Address(\"New York\");\n        List<String> projs = new ArrayList<>(List.of(\"Alpha\", \"Beta\"));\n        \n        Employee emp1 = new Employee(\"Alice\", addr, projs);\n        Employee emp2 = new Employee(emp1); // Deep Copy\n\n        // Mutate emp2's address and projects\n        emp2.address.city = \"London\";\n        emp2.projects.add(\"Gamma\");\n\n        System.out.println(\"Emp1 City: \" + emp1.address.city + \" | Projs: \" + emp1.projects); // New York | [Alpha, Beta]\n        System.out.println(\"Emp2 City: \" + emp2.address.city + \" | Projs: \" + emp2.projects); // London | [Alpha, Beta, Gamma]\n    }\n}",
          language: "java",
          explanation: "Because Employee(Employee other) deep-copied both address and projects, changing emp2 does not corrupt emp1."
        },
        {
          type: "table",
          title: "Copy Constructors vs `Object.clone()`",
          headers: ["Dimension", "Copy Constructor Pattern", "`Object.clone()` Method"],
          rows: [
            ["Creation Style", "Explicit constructor: `new Employee(other)`", "Magic method: `(Employee) other.clone()`"],
            ["Constructor Execution", "✅ Normal constructor execution and validation.", "❌ Bypasses constructors completely via native JVM magic."],
            ["Exception Handling", "✅ Clean (No checked exceptions).", "❌ Throws checked `CloneNotSupportedException`."],
            ["Return Type Safety", "✅ Exact type returned (No casting needed).", "❌ Returns `Object` (Requires explicit downcasting)."],
            ["Final Fields Support", "✅ Easily initializes `final` fields.", "❌ Cannot assign `final` fields in `clone()` overrides."],
            ["Industry Recommendation", "⭐ Strongly Recommended (Effective Java / Joshua Bloch).", "⚠️ Deprecated / Avoid due to architectural flaws."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Predict Shallow vs Deep Copy Output",
          code: "import java.util.*;\nclass DeepCopyQuiz {\n    static class Team {\n        List<String> members = new ArrayList<>();\n        Team(Team other) {\n            // Shallow copy: this.members = other.members;\n            // Deep copy:\n            this.members = new ArrayList<>(other.members);\n        }\n        Team() {}\n    }\n    public static void main(String[] args) {\n        Team t1 = new Team();\n        t1.members.add(\"Dev1\");\n        Team t2 = new Team(t1);\n        t2.members.add(\"Dev2\");\n        System.out.println(t1.members.size() + \" \" + t2.members.size());\n    }\n}",
          expectedOutput: "1 2",
          explanation: "Because t2 performed a deep copy of the members list, adding 'Dev2' to t2 leaves t1 with size 1 and t2 with size 2."
        },
        {
          type: "dryRun",
          title: "Memory Trace: Deep Copy Constructor Allocation",
          iterations: [
            { step: 1, variables: { "emp1": "Heap 0x1000", "emp1.address": "Heap 0x2000 (New York)", "emp1.projects": "Heap 0x3000 [Alpha]" }, description: "Original employee graph in memory." },
            { step: 2, variables: { "Call": "new Employee(emp1)", "emp2": "Heap 0x5000" }, description: "Allocates brand-new Employee container at 0x5000." },
            { step: 3, variables: { "Deep Copy Address": "emp2.address = new Address(0x2000)", "Address": "Heap 0x6000 (New York)" }, description: "Allocates brand-new Address object at 0x6000." },
            { step: 4, variables: { "Deep Copy Projects": "emp2.projects = new ArrayList<>(0x3000)", "List": "Heap 0x7000 [Alpha]" }, description: "Allocates brand-new ArrayList object at 0x7000." },
            { step: 5, variables: { "Isolation Verification": "0x5000 has zero shared mutable pointers with 0x1000" }, description: "Full independent isolation achieved." }
          ]
        },
        {
          type: "warning",
          title: "Common Copying Mistakes",
          items: [
            "**Shallow Copying Collections**: Doing `this.list = other.list;` copies the reference pointer, meaning both objects share the exact same list on the Heap.",
            "**Using `Object.clone()` in New Code**: `Object.clone()` has numerous design flaws (bypasses constructors, requires Cloneable interface, shallow by default). Prefer Copy Constructors or Static Factory Methods (`User.copyOf(other)`).",
            "**Circular References in Deep Copying**: If Object A points to Object B and Object B points to Object A, a naive deep copy constructor will enter infinite recursion and throw `StackOverflowError`."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Why is `Object.clone()` Considered Broken in Java?",
          traps: [
            {
              question: "Why do senior Java architects and authors like Joshua Bloch advise against implementing `Cloneable` and using `Object.clone()`?",
              trap: "Only stating that it creates shallow copies.",
              solution: "1. **Bypasses Constructors**: `clone()` creates objects without invoking any constructor, violating language consistency and invariant checks.\n2. **Incompatible with `final` Fields**: `clone()` cannot assign new copies to `final` fields because `final` fields can only be initialized in constructors or declarations.\n3. **Checked Exception Overhead**: Declares checked `CloneNotSupportedException`.\n4. **Unsafe Interface Design**: `Cloneable` is a marker interface that does not even declare the `clone()` method (it remains protected in `Object`)."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "What is the primary difference between a shallow copy and a deep copy of an object?",
          options: [
            "Shallow copy copies primitives; deep copy does not",
            "Shallow copy duplicates nested objects; deep copy shares references",
            "Shallow copy copies reference pointers (sharing nested objects); deep copy recursively duplicates nested objects into new memory",
            "Deep copy only works with String objects"
          ],
          answer: 2,
          explanation: "A shallow copy shares nested heap references, whereas a deep copy creates distinct, independent copies of all nested mutable objects."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Copy Constructors create a new instance initialized from an existing instance.",
            "Deep copies recursively allocate new objects for all mutable nested fields to prevent reference leaking.",
            "Immutable fields (`String`, primitives) are safe to copy directly by reference/value.",
            "Copy Constructors and Static Factory Methods are preferred over Java's legacy `Cloneable` / `clone()`."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Module",
          content: "Next, we enter Module 4: Inheritance, mastering class hierarchies, the `extends` keyword, method overriding, `super`, and the `instanceof` operator."
        }
      ]
    }
  }
];
