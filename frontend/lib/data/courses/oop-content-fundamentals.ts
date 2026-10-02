// Module 1 - OOP Fundamentals (5 lessons)
import { CourseLessonContent } from './types';

export const oopFundamentalsLessons: Array<{
  slug: string;
  title: string;
  content: CourseLessonContent
}> = [
  {
    slug: "what-is-oop",
    title: "What is Object-Oriented Programming (OOP)?",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand basic programming constructs: variables, primitive data types, control flow, loops, and methods."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of Object-Oriented Programming as **Modeling the Real World with Autonomous Lego Modules**:\n• **Procedural Programming (The Recipe Scroll)**: A giant list of global functions executing step-by-step over detached, passive data arrays. If one global variable changes, 50 unrelated functions break.\n• **Object-Oriented Programming (The Smart Factory)**: The system is composed of self-contained entities (**Objects**) that bundle their own internal state (data) with their own specialized abilities (methods). You do not manually rewire an engine to accelerate a car; you press the gas pedal (`car.accelerate()`), and the engine handles its own internal mechanics."
        },
        {
          type: "callout",
          title: "The 4 Pillars of Object-Oriented Programming",
          content: "1. **Encapsulation**: Bundling state and behavior together while hiding internal details and guarding data integrity.\n2. **Abstraction**: Exposing clean, essential interfaces while hiding complex internal mechanics.\n3. **Inheritance**: Establishing 'is-a' relationships to share, extend, and reuse code across hierarchical types.\n4. **Polymorphism**: Allowing different underlying classes to be manipulated through a unified common interface."
        },
        {
          type: "code",
          title: "Procedural vs Object-Oriented Architecture",
          code: "public class OOPParadigmComparison {\n    // === 1. PROCEDURAL APPROACH (Separated Data & Functions) ===\n    // Vulnerable to data corruption: anyone can set balance to -999999\n    static String[] accountHolders = {\"Alice\", \"Bob\"};\n    static double[] accountBalances = {1500.0, 3200.0};\n\n    public static void proceduralWithdraw(int accountIndex, double amount) {\n        if (accountBalances[accountIndex] >= amount) {\n            accountBalances[accountIndex] -= amount;\n        }\n    }\n\n    // === 2. OBJECT-ORIENTED APPROACH (Encapsulated Entity) ===\n    // State and behavior are tightly unified; business rules are guaranteed.\n    static class BankAccount {\n        private String owner;\n        private double balance;\n\n        public BankAccount(String owner, double initialBalance) {\n            this.owner = owner;\n            this.balance = Math.max(0, initialBalance);\n        }\n\n        public boolean withdraw(double amount) {\n            if (amount > 0 && amount <= this.balance) {\n                this.balance -= amount;\n                return true;\n            }\n            return false;\n        }\n\n        public double getBalance() {\n            return this.balance;\n        }\n    }\n\n    public static void main(String[] args) {\n        BankAccount aliceAccount = new BankAccount(\"Alice\", 1500.0);\n        aliceAccount.withdraw(500.0);\n        System.out.println(\"Alice Remaining: $\" + aliceAccount.getBalance()); // $1000.0\n    }\n}",
          language: "java",
          explanation: "In OOP, BankAccount manages its own balance. No external code can directly modify or corrupt the balance field without passing through withdraw() validation rules."
        },
        {
          type: "table",
          title: "Procedural vs Object-Oriented Programming",
          headers: ["Dimension", "Procedural Paradigm (C, Pascal)", "Object-Oriented Paradigm (Java, C++)"],
          rows: [
            ["Primary Focus", "Functions and algorithm steps (Verbs).", "Objects and entities (Nouns)."],
            ["Data Security", "Global/passive data accessible by all functions.", "Data is encapsulated inside private object fields."],
            ["Code Reuse", "Limited to calling common functions.", "Achieved via Inheritance, Composition, and Interfaces."],
            ["Maintenance", "High coupling; changing a data struct breaks many functions.", "Low coupling; internal class refactors do not affect callers."],
            ["Real-World Fit", "Linear computational algorithms and drivers.", "Large enterprise systems, simulations, and UI frameworks."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Predict Object State Self-Containment",
          code: "class Counter {\n    int count = 0;\n    void increment() { count++; }\n}\n\nclass OOPTest {\n    public static void main(String[] args) {\n        Counter c1 = new Counter();\n        Counter c2 = new Counter();\n        c1.increment();\n        c1.increment();\n        c2.increment();\n        System.out.println(c1.count + \" \" + c2.count);\n    }\n}",
          expectedOutput: "2 1",
          explanation: "c1 and c2 are completely independent instances on the Heap. Incrementing c1 does not affect c2's count."
        },
        {
          type: "dryRun",
          title: "State Encapsulation Trace: `aliceAccount.withdraw(500.0)`",
          iterations: [
            { step: 1, variables: { "Object": "aliceAccount", "balance": "1500.0", "Call": "withdraw(500.0)" }, description: "Invokes member method on aliceAccount instance." },
            { step: 2, variables: { "Validation": "amount > 0 && amount <= balance", "Result": "500.0 <= 1500.0 (TRUE)" }, description: "Internal validation rule passes." },
            { step: 3, variables: { "balance": "1500.0 - 500.0 = 1000.0", "Return": "true" }, description: "Instance state mutated safely. Delivers confirmation back to caller." }
          ]
        },
        {
          type: "warning",
          title: "Common OOP Anti-Patterns to Avoid",
          items: [
            "**The Anemic Domain Model**: Creating classes with only public fields or getters/setters without any business methods, reverting OOP back to procedural programming.",
            "**The God Class**: Putting 5,000 lines and 50 responsibilities into a single class instead of modularizing into smaller, focused collaborating classes.",
            "**Over-Abstraction**: Creating abstract classes, interfaces, and design patterns for trivial tasks that require simple, direct code."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Is Java a 100% Pure Object-Oriented Language?",
          traps: [
            {
              question: "Is Java considered a 'Pure Object-Oriented Programming Language' like Smalltalk? Why or why not?",
              trap: "Answering yes, because 'everything in Java is inside a class'.",
              solution: "Java is **NOT a 100% Pure Object-Oriented Language** for 3 reasons:\n1. **8 Primitive Data Types** (`int`, `boolean`, `double`, etc.) are not objects; they do not inherit from `java.lang.Object` and have no methods.\n2. **`static` Methods & Fields** can be called without creating any object instance (procedural style).\n3. **Primitive Wrappers and Autoboxing** bridge the gap, but underlying primitives remain non-objects for raw CPU performance."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Which of the following is NOT one of the four fundamental pillars of Object-Oriented Programming?",
          options: [
            "Encapsulation",
            "Compilation",
            "Inheritance",
            "Polymorphism"
          ],
          answer: 1,
          explanation: "Compilation is a translation process from source to bytecode/machine code, not an OOP pillar. The 4 pillars are Encapsulation, Abstraction, Inheritance, and Polymorphism."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "OOP organizes software around self-contained entities (Objects) bundling State and Behavior.",
            "The 4 Pillars are Encapsulation, Abstraction, Inheritance, and Polymorphism.",
            "OOP solves procedural spaghetti code by ensuring data cannot be mutated arbitrarily from outside.",
            "Java is hybrid OOP due to its high-performance primitive data types and static methods."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Classes and Objects, understanding blueprints vs concrete heap instances, object lifecycles, and the `new` keyword."
        }
      ]
    }
  },
  {
    slug: "classes-and-objects",
    title: "Classes and Objects: Blueprints vs Reality",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `what-is-oop`, basic variable declarations, and method structure."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of the relationship between a Class and an Object as **An Architectural Blueprint vs a Physical Skyscraper**:\n• **The Class (The Blueprint)**: A paper schematic drawn by an architect. It consumes no physical land, weighs 200 grams, and defines where walls, doors, and electrical wiring should go.\n• **The Object (The Physical Building)**: Constructed using the blueprint. It occupies real physical ground (**Heap Memory**), has its own distinct address (**Reference Address**), and can be painted red or blue independently of other buildings made from the exact same blueprint."
        },
        {
          type: "callout",
          title: "Key Definitions",
          content: "• **Class**: A user-defined template or blueprint that defines the structure (fields) and capabilities (methods) for a type.\n• **Object (Instance)**: A concrete, tangible runtime entity allocated in Heap memory with its own unique state.\n• **Instantiation**: The act of allocating and initializing an object in memory using the `new` operator."
        },
        {
          type: "code",
          title: "Defining a Class and Instantiating Multiple Objects",
          code: "public class CarShowroom {\n    // THE BLUEPRINT (Class)\n    static class Car {\n        // State (Instance Fields)\n        String model;\n        String color;\n        int speed;\n\n        // Behavior (Instance Methods)\n        void accelerate(int increase) {\n            speed += increase;\n            System.out.println(model + \" accelerated to \" + speed + \" km/h\");\n        }\n\n        void displayStatus() {\n            System.out.println(color + \" \" + model + \" running at \" + speed + \" km/h\");\n        }\n    }\n\n    public static void main(String[] args) {\n        // Instantiating Object 1 on Heap\n        Car car1 = new Car();\n        car1.model = \"Tesla Model 3\";\n        car1.color = \"Red\";\n        car1.speed = 0;\n\n        // Instantiating Object 2 on Heap\n        Car car2 = new Car();\n        car2.model = \"BMW M4\";\n        car2.color = \"Black\";\n        car2.speed = 40;\n\n        car1.accelerate(60); // Mutates only car1's speed\n        car2.displayStatus(); // BMW remains at 40 km/h\n    }\n}",
          language: "java",
          explanation: "car1 and car2 are distinct objects created from the Car blueprint. Calling car1.accelerate(60) changes only car1's speed to 60, leaving car2 unaffected at 40."
        },
        {
          type: "table",
          title: "Class vs Object: Comprehensive Comparison",
          headers: ["Dimension", "Class (Blueprint)", "Object (Instance)"],
          rows: [
            ["Definition", "Template/contract defining fields & methods.", "Concrete runtime instance of a class."],
            ["Memory Allocation", "Loaded once into Metaspace/Method Area.", "Allocated dynamically on the Heap on every `new`."],
            ["Existence", "Compile-time concept (written in `.java` / `.class`).", "Runtime entity (exists in RAM while program runs)."],
            ["Multiplicity", "Declared only ONCE in source code.", "Can create unlimited instances ($1, 100, 10^6$) from one class."],
            ["Keyword", "Declared with `class`.", "Created with `new` operator (or reflection)."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Predict State Isolation",
          code: "class Laptop {\n    int ramGB = 8;\n}\n\nclass Store {\n    public static void main(String[] args) {\n        Laptop lap1 = new Laptop();\n        Laptop lap2 = new Laptop();\n        lap1.ramGB = 16;\n        System.out.println(lap1.ramGB + \" and \" + lap2.ramGB);\n    }\n}",
          expectedOutput: "16 and 8",
          explanation: "lap1.ramGB is modified to 16, while lap2.ramGB retains its default initial value of 8."
        },
        {
          type: "dryRun",
          title: "Object Instantiation Memory Trace: `Car car1 = new Car();`",
          iterations: [
            { step: 1, variables: { "Reference": "Car car1", "Location": "Stack Frame (Slot 1)" }, description: "Allocates 64-bit reference variable on current thread's Stack Frame (initially null)." },
            { step: 2, variables: { "Operator": "new Car()", "Location": "Heap Memory" }, description: "Carves out memory on the Heap for Car object header + fields (model, color, speed)." },
            { step: 3, variables: { "Field Init": "model=null, color=null, speed=0" }, description: "Zeroes/initializes all instance fields to their default values." },
            { step: 4, variables: { "Constructor": "Car() executed" }, description: "Runs default constructor to initialize object invariants." },
            { step: 5, variables: { "Assignment": "car1 = 0x7FA8", "Pointer": "Stack -> Heap (0x7FA8)" }, description: "Returns heap memory address (0x7FA8) and assigns it into stack reference variable car1." }
          ]
        },
        {
          type: "warning",
          title: "Common Class & Object Mistakes",
          items: [
            "**Using Class Name Instead of Object Reference**: Calling `Car.speed = 100;` on an instance field produces a compile error: *non-static variable speed cannot be referenced from a static context*.",
            "**Forgetting the `new` Keyword**: Writing `Car car1; car1.speed = 50;` causes compile error *variable car1 might not have been initialized*.",
            "**Assuming Objects Share Instance Fields**: Modifying an instance field on `obj1` never modifies `obj2` unless the field is explicitly marked `static`."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: `Car c;` vs `Car c = new Car();`",
          traps: [
            {
              question: "What is the precise difference in memory allocation between `Car c;` and `Car c = new Car();`?",
              trap: "Assuming `Car c;` creates an empty object on the Heap.",
              solution: "`Car c;` only declares a **Reference Variable on the JVM Stack** (allocating 4 or 8 bytes to hold a memory pointer). No object is created on the Heap, and accessing `c.model` results in a compile error (or `NullPointerException` if it's an instance field initialized to `null`). Only `new Car()` actually allocates heap memory, runs the constructor, and returns the heap address to `c`."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Where are objects allocated in JVM memory when created using the `new` keyword?",
          options: [
            "JVM Stack",
            "Heap Memory",
            "Metaspace",
            "CPU Cache"
          ],
          answer: 1,
          explanation: "All objects and arrays created via the `new` keyword are dynamically allocated in Heap memory. The reference variable pointing to the object lives on the Stack."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "A Class is a blueprint in Metaspace; an Object is a concrete instance in Heap memory.",
            "The `new` keyword allocates heap memory, zeroes fields, invokes constructors, and returns an address pointer.",
            "Each object maintains its own independent copy of instance variables.",
            "Stack reference variables hold the memory address of the heap object payload."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Fields and Methods, diving into state vs behavior, default initializations, and member method invocation."
        }
      ]
    }
  },
  {
    slug: "fields-and-methods",
    title: "Fields and Methods: State and Behavior",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `classes-and-objects`, data types, and method declaration syntax."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of an Object as a **Modern Smartphone**:\n• **Fields (State / Attributes)**: The internal sensors and status meters (Battery: 84%, Storage: 128GB, Screen: ON, Wi-Fi: Connected).\n• **Methods (Behavior / Actions)**: The software apps and triggers (Press Power Button, Take Photo, Connect Bluetooth, Charge Battery).\n• Invoking a method (`phone.takePhoto()`) reads the current state (is storage full? is battery > 0?), updates state (storage decreases by 5MB), and produces an output."
        },
        {
          type: "callout",
          title: "Instance Fields vs Local Variables",
          content: "• **Instance Fields**: Declared inside the class body but outside any method. They belong to the object, live in Heap memory, and receive **automatic default values** (0, 0.0, false, null).\n• **Local Variables**: Declared inside a method or block. They live on the Stack Frame and **NEVER receive default values** (must be explicitly initialized before reading)."
        },
        {
          type: "code",
          title: "State and Behavior in Action: Smartphone Simulator",
          code: "public class SmartphoneDemo {\n    static class Smartphone {\n        // 1. Instance Fields (State)\n        String brand;\n        int batteryLevel = 100; // Explicit default\n        boolean isScreenOn = false;\n\n        // 2. Instance Methods (Behavior)\n        void pressPowerButton() {\n            isScreenOn = !isScreenOn;\n            System.out.println(brand + \" screen is now: \" + (isScreenOn ? \"ON\" : \"OFF\"));\n        }\n\n        boolean launchApp(String appName, int batteryCost) {\n            if (!isScreenOn) {\n                System.out.println(\"Cannot launch \" + appName + \": Screen is OFF!\");\n                return false;\n            }\n            if (batteryLevel < batteryCost) {\n                System.out.println(\"Battery too low to launch \" + appName);\n                return false;\n            }\n            batteryLevel -= batteryCost;\n            System.out.println(\"Launched \" + appName + \". Battery now: \" + batteryLevel + \"%\");\n            return true;\n        }\n\n        void charge() {\n            batteryLevel = 100;\n            System.out.println(brand + \" fully recharged to 100%.\");\n        }\n    }\n\n    public static void main(String[] args) {\n        Smartphone phone = new Smartphone();\n        phone.brand = \"Pixel 8\";\n        \n        phone.launchApp(\"Maps\", 15);      // Fails: Screen is OFF\n        phone.pressPowerButton();         // Screen turns ON\n        phone.launchApp(\"Maps\", 15);      // Success: Battery drops to 85%\n    }\n}",
          language: "java",
          explanation: "Methods enforce business invariants: launchApp() verifies that the screen is ON and sufficient battery exists before draining power."
        },
        {
          type: "table",
          title: "Automatic Default Values for Uninitialized Instance Fields",
          headers: ["Data Type", "Default Heap Initial Value", "Bit Representation"],
          rows: [
            ["`byte`, `short`, `int`, `char`", "`0` (`'\\u0000'` for char)", "All 0 bits"],
            ["`long`", "`0L`", "64 zero bits"],
            ["`float`", "`0.0f`", "32-bit IEEE zero"],
            ["`double`", "`0.0d`", "64-bit IEEE zero"],
            ["`boolean`", "`false`", "`0` (zero byte)"],
            ["`Reference Types` (`String`, `Object`, `int[]`)", "`null`", "Null memory pointer address"]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Default Field Values vs Local Variables",
          code: "class DefaultTest {\n    int uninitInt;       // Instance field -> default 0\n    String uninitString; // Instance field -> default null\n    boolean uninitBool;  // Instance field -> default false\n\n    public static void main(String[] args) {\n        DefaultTest obj = new DefaultTest();\n        System.out.println(obj.uninitInt + \" \" + obj.uninitString + \" \" + obj.uninitBool);\n    }\n}",
          expectedOutput: "0 null false",
          explanation: "Instance fields automatically receive zero/null/false defaults during heap object allocation."
        },
        {
          type: "dryRun",
          title: "Execution Trace: `phone.launchApp(\"Maps\", 15)`",
          iterations: [
            { step: 1, variables: { "Method": "launchApp()", "brand": "\"Pixel 8\"", "batteryLevel": "100", "isScreenOn": "false" }, description: "Invokes method with appName=\"Maps\", batteryCost=15." },
            { step: 2, variables: { "Check 1": "!isScreenOn (true)", "Action": "Prints 'Screen is OFF!'" }, description: "Guard clause fails because screen is false. Returns false immediately." },
            { step: 3, variables: { "Next Call": "pressPowerButton()", "isScreenOn": "true" }, description: "Toggles isScreenOn from false to true." },
            { step: 4, variables: { "Retry": "launchApp(\"Maps\", 15)", "batteryLevel": "100 -> 85", "Return": "true" }, description: "Screen is now ON. Subtracts 15 from batteryLevel and returns true." }
          ]
        },
        {
          type: "warning",
          title: "Common Field & Method Traps",
          items: [
            "**Variable Shadowing Pitfall**: Declaring a method parameter with the same name as a field (e.g. `void setAge(int age) { age = age; }`) assigns the local parameter to itself and leaves the instance field untouched! (Fix: use `this.age = age;`).",
            "**Calling Non-Static Methods from Static Context**: Calling `display();` directly inside `public static void main` produces a compile error because static methods have no `this` receiver.",
            "**Assuming Default Values Apply to Stack Locals**: Reading an uninitialized local variable `int x; System.out.println(x);` will not compile."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Why Do Instance Fields Get Default Values While Local Variables Do Not?",
          traps: [
            {
              question: "Why does the JVM automatically initialize instance fields to default values (0, null) on the Heap, but refuses to initialize local variables on the Stack, forcing a compile error?",
              trap: "Saying it's just an arbitrary Java design choice.",
              solution: "1. **Security & Zeroing**: When heap memory is allocated for a new object, the OS/JVM zeroes out that entire block of memory to prevent old sensitive data (passwords, encryption keys) from leaking between applications.\n2. **Performance & Compiler Definite Assignment**: Stack frames are created and destroyed thousands of times per second. Zeroing every local variable slot in every stack frame would severely degrade CPU performance. Instead, Java relies on the compiler's **Definite Assignment Analysis** to guarantee you never read uninitialized stack memory."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "What is the default value of an uninitialized instance field of type `boolean` in Java?",
          options: [
            "`true`",
            "`false`",
            "`null`",
            "Produces a compile-time error"
          ],
          answer: 1,
          explanation: "All boolean instance fields on the Heap default to `false` (zero byte) upon object creation."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Instance fields represent object State; methods represent object Behavior.",
            "Instance fields on the Heap are automatically zero-initialized (0, 0.0, false, null).",
            "Local variables on the Stack are NOT auto-initialized and require definite assignment before reading.",
            "Methods should contain guard clauses to validate preconditions before mutating state."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore The 'this' Keyword, mastering self-reference pointers, variable shadowing resolution, and constructor chaining."
        }
      ]
    }
  },
  {
    slug: "the-this-keyword",
    title: "The 'this' Keyword & Self-Reference",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `fields-and-methods`, `classes-and-objects`, and method parameter passing."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of the `this` keyword as an **Identity Badge & Personal Mirror (\"Me, Myself, and I\")**:\n• When a method executes, it needs to know *which* specific physical object on the heap called it.\n• If Alice calls `alice.display()`, inside that method, `this` is Alice's identity badge.\n• If Bob calls `bob.display()`, inside that method, `this` is Bob's identity badge.\n• `this` provides a direct, unambiguous pointer back to the currently executing object instance."
        },
        {
          type: "callout",
          title: "The 4 Core Use Cases of `this` in Java",
          content: "1. **Disambiguating Variable Shadowing**: Distinguishing instance fields from method parameters with identical names (`this.age = age`).\n2. **Constructor Chaining (`this(...)`)**: Calling another constructor in the same class to eliminate duplicate initialization code (MUST be the 1st line).\n3. **Method Chaining (Fluent Interface)**: Returning `this` from setter methods (`return this;`) to allow chained calls (`user.setName(\"A\").setAge(25)`).\n4. **Passing Current Object as Parameter**: Passing self-reference to external methods (`eventListener.register(this)`)."
        },
        {
          type: "code",
          title: "Comprehensive `this` Usage: Shadowing, Chaining & Fluent APIs",
          code: "public class ThisKeywordDemo {\n    static class UserProfile {\n        private String username;\n        private String email;\n        private int age;\n\n        // USE CASE 2: Constructor Chaining using this(...)\n        public UserProfile(String username) {\n            this(username, \"unknown@domain.com\", 18); // Delegates to master constructor\n        }\n\n        // Master Constructor\n        public UserProfile(String username, String email, int age) {\n            // USE CASE 1: Resolving Variable Shadowing\n            this.username = username;\n            this.email = email;\n            this.age = age;\n        }\n\n        // USE CASE 3: Method Chaining (Fluent Builder Pattern)\n        public UserProfile setEmail(String email) {\n            this.email = email;\n            return this; // Returns reference to current object\n        }\n\n        public UserProfile setAge(int age) {\n            this.age = age;\n            return this;\n        }\n\n        public void printInfo() {\n            System.out.println(this.username + \" (\" + this.age + \") - \" + this.email);\n        }\n    }\n\n    public static void main(String[] args) {\n        // Fluent chained method calls\n        UserProfile user = new UserProfile(\"vamsee\")\n                .setEmail(\"vamsee@studyhub.dev\")\n                .setAge(24);\n\n        user.printInfo(); // vamsee (24) - vamsee@studyhub.dev\n    }\n}",
          language: "java",
          explanation: "this(username, ...) reuses constructor logic. setEmail() returns 'this', enabling elegant fluent dot-chaining."
        },
        {
          type: "table",
          title: "The 4 Usages of `this` in Java",
          headers: ["Usage Pattern", "Syntax Example", "Key Rule / Constraint"],
          rows: [
            ["Field Disambiguation", "`this.fieldName = fieldName;`", "Essential when parameter and field share identical identifiers."],
            ["Constructor Delegation", "`this(arg1, arg2);`", "MUST be the absolute first statement in the constructor body."],
            ["Fluent Method Chaining", "`return this;`", "Method return type must match the class type."],
            ["Self-Argument Passing", "`notifier.send(this);`", "Passes current object reference to an outside service or callback."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Predict Shadowing Bug Output",
          code: "class ShadowingBug {\n    int val = 10;\n    void setVal(int val) {\n        val = val; // Parameter assigned to itself! 'this.val' untouched\n    }\n    public static void main(String[] args) {\n        ShadowingBug obj = new ShadowingBug();\n        obj.setVal(99);\n        System.out.println(obj.val);\n    }\n}",
          expectedOutput: "10",
          explanation: "Because 'val = val' assigns the local parameter to itself without 'this.', the instance field obj.val remains 10."
        },
        {
          type: "dryRun",
          title: "Stack Frame Trace: `this` in Slot 0 during `user.setEmail(\"...\")`",
          iterations: [
            { step: 1, variables: { "Object on Heap": "0x4A2F (UserProfile)", "Stack Slot 0 (this)": "0x4A2F", "Stack Slot 1 (email)": "\"vamsee@studyhub.dev\"" }, description: "JVM automatically places invoking object pointer (0x4A2F) into Stack Frame Slot 0 as 'this'." },
            { step: 2, variables: { "Instruction": "this.email = email", "Target Address": "0x4A2F.email" }, description: "Dereferences 0x4A2F and assigns the email pointer." },
            { step: 3, variables: { "Instruction": "return this;", "Returned Value": "0x4A2F" }, description: "Pushes pointer 0x4A2F back onto Operand Stack for the next chained method call." }
          ]
        },
        {
          type: "warning",
          title: "Common `this` Compiler Errors",
          items: [
            "**Using `this` Inside Static Methods**: Writing `this.name` inside `public static void main` throws compile error: *non-static variable this cannot be referenced from a static context* (static methods belong to the class, not any instance).",
            "**Placing `this()` After Other Statements**: Calling `this(\"default\");` on line 2 of a constructor throws compile error: *constructor call must be the first statement in a constructor*.",
            "**Recursive Constructor Invocation**: Constructor A calling `this()` which calls Constructor A causes compile error: *recursive constructor invocation*."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Can You Reassign `this`?",
          traps: [
            {
              question: "Can you reassign `this` to point to a different object inside an instance method, like `this = new MyClass();`?",
              trap: "Thinking it replaces the current object.",
              solution: "NO, **`this` is an immutable `final` reference value managed exclusively by the JVM**. Writing `this = ...` produces a compile-time error: *cannot assign a value to final variable this*. You can mutate fields of `this` (`this.age = 20`), but you cannot change the address `this` points to."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Where must constructor chaining `this(...)` be placed inside a constructor body?",
          options: [
            "Anywhere before the return statement",
            "Inside a try-catch block",
            "As the absolute first statement in the constructor",
            "At the very end of the constructor"
          ],
          answer: 2,
          explanation: "Java language specification strictly requires `this(...)` (or `super(...)`) to be the very first statement in a constructor."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "`this` is an immutable reference pointing to the current executing object instance.",
            "Stored automatically in Slot 0 of non-static instance method Stack Frames.",
            "Used to resolve variable shadowing: `this.field = param`.",
            "Used for constructor chaining: `this(args)` must be the first line.",
            "Cannot be used in `static` contexts because static methods have no instance receiver."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Stack vs Heap Memory for Objects, understanding object reference aliasing, pass-by-value mechanics, and NullPointerExceptions."
        }
      ]
    }
  },
  {
    slug: "stack-vs-heap-objects",
    title: "Object Memory Model: Stack vs Heap Deep Dive",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `the-this-keyword`, `stack-memory`, `heap-memory`, and reference variables."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of Object References as **TV Remote Controls and Television Sets**:\n• **The Heap Object (The Physical 65-inch TV)**: Mounted on the wall in the living room (**Heap**). It has state (Channel 7, Volume 25, Power ON).\n• **The Stack Reference (The Remote Control)**: Held in your hand at your desk (**Stack Frame**). The remote is not the TV; it merely holds the frequency code (**Memory Pointer**) to control the TV.\n• **Aliasing (Multiple Remotes)**: If you buy a second remote control (`Remote r2 = r1;`), you do NOT get a second TV! Both remotes control the exact same physical television on the wall. Changing the channel with Remote 2 changes what you see with Remote 1."
        },
        {
          type: "callout",
          title: "The Invariant of Reference Copying (Aliasing)",
          content: "In Java, assigning one object variable to another (`Car b = a;`) **NEVER copies the object payload**. It strictly copies the 64-bit reference address pointer. Both `a` and `b` now point to the exact same object in Heap memory."
        },
        {
          type: "code",
          title: "Object Aliasing & Method Parameter Mutation in Action",
          code: "public class ObjectMemoryModelDemo {\n    static class Box {\n        int width;\n        Box(int w) { this.width = w; }\n    }\n\n    // 1. Mutates object payload through copied reference\n    public static void modifyPayload(Box b) {\n        b.width = 99; // Mutates original Heap object\n    }\n\n    // 2. Reassigns local pointer copy (Does NOT affect caller!)\n    public static void reassignReference(Box b) {\n        b = new Box(500); // Only changes local stack parameter 'b'\n    }\n\n    public static void main(String[] args) {\n        // Step 1: Allocate Box on Heap\n        Box box1 = new Box(10);\n        \n        // Step 2: Aliasing\n        Box box2 = box1; // Both box1 and box2 point to 0x1A2B\n        box2.width = 20;\n        System.out.println(\"box1.width after box2 change: \" + box1.width); // 20!\n\n        // Step 3: Method mutation\n        modifyPayload(box1);\n        System.out.println(\"box1.width after modifyPayload: \" + box1.width); // 99!\n\n        // Step 4: Method reassignment\n        reassignReference(box1);\n        System.out.println(\"box1.width after reassignReference: \" + box1.width); // Still 99!\n    }\n}",
          language: "java",
          explanation: "reassignReference() changes its own local parameter 'b' to point to a new Box(500). The caller's box1 pointer on the main() stack remains completely unchanged pointing to the original Box(99)."
        },
        {
          type: "table",
          title: "Primitive Variables vs Reference Variables in Memory",
          headers: ["Attribute", "Primitive Variable (`int x = 5`)", "Reference Variable (`Box b = new Box(5)`)"],
          rows: [
            ["What is stored in Stack slot?", "The actual raw binary value (`5`).", "A 64-bit heap memory address pointer (`0x7FA8`)."],
            ["Where does payload live?", "Directly inside Stack Frame (or inside enclosing object).", "Dynamically allocated on the Heap."],
            ["Assignment (`y = x`)", "Copies the raw value; completely independent.", "Copies the pointer address; both point to same object."],
            ["Equality (`==`)", "Compares binary values (`5 == 5`).", "Compares memory address pointers (`ref1 == ref2`)."],
            ["Can it hold `null`?", "NO (compile error).", "YES (indicates pointer to nothing)."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Predict Aliasing and Mutation Result",
          code: "class Node {\n    int val;\n    Node(int v) { val = v; }\n}\nclass AliasingQuiz {\n    public static void main(String[] args) {\n        Node n1 = new Node(1);\n        Node n2 = n1;\n        Node n3 = new Node(1);\n        n2.val = 5;\n        System.out.println(n1.val + \" \" + n3.val + \" \" + (n1 == n2) + \" \" + (n1 == n3));\n    }\n}",
          expectedOutput: "5 1 true false",
          explanation: "n1 and n2 point to the same object (val=5, n1==n2 is true). n3 is a separate heap object (val=1, n1==n3 is false)."
        },
        {
          type: "dryRun",
          title: "Step-by-Step Memory Map Trace: `Box box1 = new Box(10); Box box2 = box1;`",
          iterations: [
            { step: 1, variables: { "Stack: box1": "0x88AA", "Heap (0x88AA)": "Box { width: 10 }" }, description: "new Box(10) allocates heap object at 0x88AA; box1 stack slot stores pointer 0x88AA." },
            { step: 2, variables: { "Stack: box2": "0x88AA", "Heap (0x88AA)": "Box { width: 10 }" }, description: "box2 = box1 copies the pointer 0x88AA into box2 stack slot (Aliasing)." },
            { step: 3, variables: { "Action": "box2.width = 20", "Heap (0x88AA)": "Box { width: 20 }" }, description: "Dereferences 0x88AA and updates width to 20. box1 observes this change immediately." },
            { step: 4, variables: { "Action": "box1 = null", "Stack: box1": "null", "Stack: box2": "0x88AA" }, description: "box1 reference severed; object at 0x88AA remains alive because box2 still points to it." }
          ]
        },
        {
          type: "warning",
          title: "Common Memory Model Traps",
          items: [
            "**The NullPointerException (NPE)**: Attempting to access fields or methods on a reference holding `null` (`box = null; box.width = 10;`) crashes at runtime with `NullPointerException`.",
            "**Assuming `a = b` Duplicates an Object**: Modifying `b` unexpectedly mutates `a` because both reference the same heap memory.",
            "**Unintentional Object Retention**: Keeping static references to objects prevents the Garbage Collector from freeing their heap memory."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Is Java Pass-By-Value or Pass-By-Reference?",
          traps: [
            {
              question: "Does Java pass objects to methods by reference or by value?",
              trap: "Claiming Java passes primitives by value and objects by reference.",
              solution: "Java is **100% STRICTLY PASS-BY-VALUE, ALWAYS!**\n• When you pass an `int`, a copy of the primitive value is passed.\n• When you pass an `Object`, a **copy of the 64-bit reference pointer (memory address)** is passed by value.\n• Because the method receives a copy of the address, you can mutate the object's fields (`b.width = 99`), but if you reassign the parameter (`b = new Box(500)`), the caller's reference outside the method remains completely unchanged!"
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "If `Box a = new Box(10); Box b = a;`, what happens if you execute `a = null;`?",
          options: [
            "The Box object is immediately garbage collected",
            "`b` becomes null as well",
            "The Box object remains alive in Heap memory because `b` still references it",
            "Throws a NullPointerException"
          ],
          answer: 2,
          explanation: "Setting `a = null` only clears the `a` pointer on the stack. `b` still holds the heap address 0x88AA, keeping the object alive and reachable from GC Roots."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Reference variables on the Stack store memory addresses pointing to Object payloads on the Heap.",
            "Assigning reference variables (`b = a`) aliases the object without copying the underlying heap data.",
            "Java is strictly 100% Pass-by-Value; passing an object copies the reference pointer.",
            "An object is eligible for Garbage Collection only when zero live GC Roots hold its reference address."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Module",
          content: "Next, we enter Module 2: Encapsulation, mastering data hiding, access modifiers (private, protected, public), and defensive getter/setter architecture."
        }
      ]
    }
  }
];
