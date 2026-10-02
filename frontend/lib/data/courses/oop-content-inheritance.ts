// Module 4 - Inheritance (6 lessons)
import { CourseLessonContent } from './types';

export const inheritanceLessons: Array<{
  slug: string;
  title: string;
  content: CourseLessonContent
}> = [
  {
    slug: "what-is-inheritance",
    title: "What is Inheritance? The 'Is-A' Relationship",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `classes-and-objects`, `access-modifiers-deep-dive`, and constructors."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of Inheritance as **Biological Genetics & Smartphone Lineage**:\n• **The Parent Class (Generic Smartphone)**: Defines fundamental genetic traits: touch screen, cellular radio, battery management, and an operating system kernel.\n• **The Child Class (iPhone 15 Pro)**: Inherits all base smartphone traits automatically without re-inventing the wheel, while adding specialized features: titanium frame, satellite SOS, and an action button.\n• An iPhone 15 Pro **\"Is-A\"** Smartphone. Any code designed to work with a Smartphone will seamlessly accept an iPhone 15 Pro."
        },
        {
          type: "callout",
          title: "The 'Is-A' Relationship vs 'Has-A' Composition",
          content: "• **Inheritance ('Is-A')**: A Dog *is-a* Mammal; a Car *is-a* Vehicle (`class Car extends Vehicle`). Use when the child is a true specialized subtype of the parent.\n• **Composition ('Has-A')**: A Car *has-an* Engine (`class Car { private Engine engine; }`). Use when an object contains another object as a component part.\n⭐ **Industry Best Practice**: *Favor Composition over Inheritance* unless a genuine, immutable 'Is-A' taxonomic relationship exists."
        },
        {
          type: "code",
          title: "Inheritance in Action: Vehicle & ElectricCar Hierarchy",
          code: "public class InheritanceBasicsDemo {\n    // SUPERCLASS (Parent)\n    static class Vehicle {\n        protected String brand;\n        protected int maxSpeed;\n\n        public Vehicle(String brand, int maxSpeed) {\n            this.brand = brand;\n            this.maxSpeed = maxSpeed;\n        }\n\n        public void startEngine() {\n            System.out.println(brand + \" engine started.\");\n        }\n\n        public void displaySpecs() {\n            System.out.println(brand + \" | Top Speed: \" + maxSpeed + \" km/h\");\n        }\n    }\n\n    // SUBCLASS (Child inherits from Vehicle via 'extends')\n    static class ElectricCar extends Vehicle {\n        private int batteryKWh;\n\n        public ElectricCar(String brand, int maxSpeed, int batteryKWh) {\n            super(brand, maxSpeed); // Pass base traits to parent constructor\n            this.batteryKWh = batteryKWh;\n        }\n\n        // Specialized subclass method\n        public void chargeBattery() {\n            System.out.println(brand + \" charging \" + batteryKWh + \" kWh battery pack.\");\n        }\n    }\n\n    public static void main(String[] args) {\n        ElectricCar tesla = new ElectricCar(\"Tesla Model S\", 250, 100);\n        \n        // Inherited methods from Vehicle superclass\n        tesla.startEngine();  // Tesla Model S engine started.\n        tesla.displaySpecs(); // Tesla Model S | Top Speed: 250 km/h\n        \n        // Specialized subclass method\n        tesla.chargeBattery(); // Tesla Model S charging 100 kWh battery pack.\n    }\n}",
          language: "java",
          explanation: "ElectricCar extends Vehicle, instantly inheriting brand, maxSpeed, startEngine(), and displaySpecs() without writing duplicate code."
        },
        {
          type: "table",
          title: "Inheritance ('Is-A') vs Composition ('Has-A')",
          headers: ["Dimension", "Inheritance (`extends`)", "Composition (Field Injection)"],
          rows: [
            ["Relationship", "'Is-A' (e.g. Dog is an Animal)", "'Has-A' (e.g. Car has an Engine)"],
            ["Coupling", "Tight coupling (Child depends on parent implementation)", "Loose coupling (Components can be swapped at runtime)"],
            ["Code Reuse", "Inherits all non-private fields and methods automatically", "Reuses code by delegating method calls to internal objects"],
            ["Flexibility", "Rigid (Cannot change parent at runtime)", "High (Can inject different interface implementations)"],
            ["Design Rule", "Use when child satisfies Liskov Substitution Principle", "Preferred standard for 90% of software engineering design"]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Predict Inherited Method Output",
          code: "class Animal {\n    void speak() { System.out.print(\"Sound \"); }\n}\nclass Dog extends Animal {\n    void bark() { System.out.print(\"Woof! \"); }\n}\nclass TestInherit {\n    public static void main(String[] args) {\n        Dog d = new Dog();\n        d.speak();\n        d.bark();\n    }\n}",
          expectedOutput: "Sound Woof! ",
          explanation: "Dog inherits speak() from Animal and defines bark(). Calling both outputs 'Sound Woof! '."
        },
        {
          type: "dryRun",
          title: "Inheritance Memory & Method Dispatch Trace",
          iterations: [
            { step: 1, variables: { "Object on Heap": "ElectricCar instance (0x44AA)" }, description: "Allocates single contiguous heap object containing both Vehicle fields (brand, maxSpeed) and ElectricCar fields (batteryKWh)." },
            { step: 2, variables: { "Call": "tesla.displaySpecs()" }, description: "JVM checks ElectricCar class for displaySpecs(); not found, traverses up to Vehicle superclass." },
            { step: 3, variables: { "Execution": "Vehicle.displaySpecs() executed" }, description: "Runs inherited method using the current object's fields." },
            { step: 4, variables: { "Call": "tesla.chargeBattery()" }, description: "JVM finds method directly on ElectricCar subclass and executes immediately." }
          ]
        },
        {
          type: "warning",
          title: "Inheritance Traps to Avoid",
          items: [
            "**Inheriting for Code Reuse Without 'Is-A'**: Extending a class just to grab a couple of helper methods (e.g. `Stack extends Vector` in legacy Java) is an architectural flaw; use Composition instead.",
            "**Assuming Private Fields are Inaccessible in Memory**: Private superclass fields ARE present in the heap object payload, but child class code cannot access them directly by name (must use inherited getters/setters).",
            "**Circular Inheritance**: Class A extending Class B while Class B extends Class A causes a compile error: *cyclic inheritance involving A*."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Are Constructors and Private Members Inherited?",
          traps: [
            {
              question: "Are constructors, private fields, and private methods of a superclass inherited by its subclass in Java?",
              trap: "Saying yes to all, or saying private fields don't exist in the child object.",
              solution: "• **Constructors**: **NEVER inherited**. A child class must define its own constructors (which invoke parent constructors via `super()`).\n• **Private Members**: **NOT inherited in scope**. The child class cannot access `private` fields/methods directly by name. However, the private fields **DO exist in memory inside the child object's heap footprint**, accessible indirectly through inherited public/protected methods."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Which keyword is used in Java to establish class inheritance?",
          options: [
            "`implements`",
            "`extends`",
            "`inherits`",
            "`super`"
          ],
          answer: 1,
          explanation: "In Java, the `extends` keyword is used to inherit from a superclass (e.g. `class Dog extends Animal`). `implements` is used for interfaces."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Inheritance models an 'Is-A' hierarchy using the `extends` keyword.",
            "Subclasses inherit all public and protected fields and methods from the superclass.",
            "Constructors and private members are not inherited.",
            "Favor Composition ('Has-A') over Inheritance ('Is-A') for flexible, loosely coupled architecture."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Types of Inheritance & The Diamond Problem, learning why Java supports single and multilevel inheritance but forbids multiple class inheritance."
        }
      ]
    }
  },
  {
    slug: "types-of-inheritance",
    title: "Types of Inheritance & The Diamond Problem",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `what-is-inheritance`, class definitions, and method dispatch."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of Inheritance Topologies as **Organizational Hierarchy Trees vs The Deadly Two-Boss Dilemma**:\n• **Single Inheritance (One Direct Manager)**: You report to one lead engineer. Instructions are 100% clear.\n• **Multilevel Inheritance (Chain of Command)**: Junior Dev &rarr; Senior Dev &rarr; Tech Lead &rarr; CTO. Orders flow cleanly down the chain.\n• **Multiple Inheritance with Classes (The Two-Boss Disaster / The Diamond Problem)**: You report simultaneously to Manager A and Manager B. Manager A tells you to \"Delete the database (`reset()`); Manager B tells you to \"Keep the database (`reset()`). When you are told `reset()`, **WHICH manager's code should you execute?** Java bans multiple class inheritance to prevent this exact chaos."
        },
        {
          type: "callout",
          title: "The 5 Inheritance Topologies",
          content: "1. **Single Inheritance**: Class B extends Class A (✅ Supported in Java).\n2. **Multilevel Inheritance**: Class C extends Class B, which extends Class A (✅ Supported in Java).\n3. **Hierarchical Inheritance**: Class B and Class C both extend Class A (✅ Supported in Java).\n4. **Multiple Inheritance**: Class C extends Class A and Class B (❌ Forbidden with Classes in Java; ✅ Allowed via Interfaces).\n5. **Hybrid Inheritance**: Combination of multiple types (❌ Forbidden with Classes; ✅ Allowed via Interfaces)."
        },
        {
          type: "code",
          title: "Single, Multilevel & Hierarchical Inheritance in Java",
          code: "public class InheritanceTypesDemo {\n    // === 1. BASE CLASS ===\n    static class Animal {\n        void eat() { System.out.println(\"Animal eats food.\"); }\n    }\n\n    // === 2. SINGLE INHERITANCE (Mammal extends Animal) ===\n    static class Mammal extends Animal {\n        void breatheAir() { System.out.println(\"Mammal breathes oxygen.\"); }\n    }\n\n    // === 3. MULTILEVEL INHERITANCE (Dog extends Mammal extends Animal) ===\n    static class Dog extends Mammal {\n        void bark() { System.out.println(\"Dog barks: Woof!\"); }\n    }\n\n    // === 4. HIERARCHICAL INHERITANCE (Cat extends Mammal alongside Dog) ===\n    static class Cat extends Mammal {\n        void meow() { System.out.println(\"Cat meows: Purr!\"); }\n    }\n\n    public static void main(String[] args) {\n        Dog d = new Dog();\n        d.eat();        // Inherited from Animal (Grandparent)\n        d.breatheAir(); // Inherited from Mammal (Parent)\n        d.bark();       // Defined in Dog (Self)\n\n        Cat c = new Cat();\n        c.eat();        // Inherited from Animal\n        c.meow();       // Defined in Cat\n    }\n}",
          language: "java",
          explanation: "Dog demonstrates multilevel inheritance by accessing methods from Animal, Mammal, and Dog. Cat and Dog together demonstrate hierarchical inheritance from Mammal."
        },
        {
          type: "table",
          title: "Inheritance Support Matrix in Java",
          headers: ["Inheritance Topology", "Supported with Classes?", "Supported with Interfaces?", "Java Syntax Example"],
          rows: [
            ["Single", "✅ YES", "✅ YES", "`class B extends A`"],
            ["Multilevel", "✅ YES", "✅ YES", "`class C extends B` (where `B extends A`)"],
            ["Hierarchical", "✅ YES", "✅ YES", "`class B extends A` and `class C extends A`"],
            ["Multiple", "❌ NO (Diamond Problem)", "✅ YES", "`class C implements InterfaceA, InterfaceB`"],
            ["Hybrid", "❌ NO (With Classes)", "✅ YES (With Interfaces)", "`class D extends B implements InterfaceX, InterfaceY`"]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Multilevel Method Resolution",
          code: "class Grandparent { void step1() { System.out.print(\"1 \"); } }\nclass ParentClass extends Grandparent { void step2() { System.out.print(\"2 \"); } }\nclass ChildClass extends ParentClass { void step3() { System.out.print(\"3 \"); } }\n\nclass TestMultilevel {\n    public static void main(String[] args) {\n        ChildClass c = new ChildClass();\n        c.step1();\n        c.step2();\n        c.step3();\n    }\n}",
          expectedOutput: "1 2 3 ",
          explanation: "ChildClass has access to all ancestors' public methods: Grandparent (step1), ParentClass (step2), and its own (step3)."
        },
        {
          type: "dryRun",
          title: "The Deadly Diamond of Death: Why Java Forbids Multiple Class Inheritance",
          iterations: [
            { step: 1, variables: { "Class A": "Grandparent defining 'void display() { print(\"A\"); }'" }, description: "Base class A has display() method." },
            { step: 2, variables: { "Class B & C": "Both extend A; B overrides display() to print 'B'; C overrides display() to print 'C'" }, description: "Two intermediate branches implement conflicting behaviors." },
            { step: 3, variables: { "Illegal Class D": "class D extends B, C" }, description: "Class D attempts multiple inheritance." },
            { step: 4, variables: { "Call": "d.display()", "Conflict": "Does D run B.display() or C.display()?" }, description: "Ambiguity! The compiler cannot guess which version to execute without complex virtual method dispatch tables." }
          ]
        },
        {
          type: "warning",
          title: "Inheritance Depth & Fragile Base Class Pitfall",
          items: [
            "**Fragile Base Class Problem**: Creating deep multilevel chains (e.g. 6 tiers: `A -> B -> C -> D -> E -> F`) means modifying a single line in Class A can unexpectedly break subtle invariants in Class F.",
            "**Attempting `class C extends A, B`**: Causes compile error: *'{' expected* (Java syntax does not allow comma-separated superclasses)."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Why Does Java Allow Multiple Interface Inheritance but Not Multiple Class Inheritance?",
          traps: [
            {
              question: "Why does Java forbid multiple inheritance with classes, but allows a class to implement multiple interfaces (`implements A, B`)?",
              trap: "Saying interfaces cannot have conflicting methods.",
              solution: "1. **State Ambiguity (Instance Variables)**: Classes have instance state (fields). If Class B and Class C both inherit a field `int count` from Class A, and Class D extends B and C, Class D would have two conflicting copies of `count` in its heap layout.\n2. **Pure Interface Contracts**: Interfaces historically contained no state and no method bodies, meaning if Interface A and Interface B both declared `void run()`, the implementing Class C supplied the single concrete body, eliminating all ambiguity.\n3. **Interface Default Methods (Java 8+)**: If Interface A and Interface B both define identical `default void run()`, Java forces the programmer to explicitly resolve the conflict via `InterfaceA.super.run()` or override it, preventing silent ambiguity."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "What is the primary reason Java disallows multiple inheritance with classes?",
          options: [
            "To prevent the compiler from taking more than 5 seconds",
            "To avoid the Diamond Problem and state/method ambiguity",
            "Because Java does not have interfaces",
            "To enforce garbage collection"
          ],
          answer: 1,
          explanation: "Multiple inheritance with classes introduces the Diamond Problem, where method resolution and instance state become ambiguous between duplicate parent branches."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Java supports Single, Multilevel, and Hierarchical class inheritance.",
            "Java disallows Multiple and Hybrid inheritance with classes to eliminate the Diamond Problem.",
            "Multiple inheritance is achieved safely in Java through Interfaces (`implements A, B`).",
            "Keep class hierarchies shallow (2-3 levels) to avoid the Fragile Base Class problem."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore The 'super' Keyword: Parent Access, mastering how child classes invoke parent methods, access shadowed fields, and chain constructors."
        }
      ]
    }
  },
  {
    slug: "super-keyword",
    title: "The 'super' Keyword: Parent Access",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `what-is-inheritance`, `the-this-keyword`, and method overriding concepts."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of `super` as a **Secure Direct Phone Line to Corporate Headquarters**:\n• In your local branch office (**Subclass**), you have local procedures (`this.processOrder()`).\n• However, when an international order arrives, you need to execute standard global protocol from headquarters before adding your local shipping surcharge.\n• `super.processOrder()` dials directly to the parent class implementation, executing headquarters' master logic from within your child class."
        },
        {
          type: "callout",
          title: "The 3 Core Use Cases of `super` in Java",
          content: "1. **Invoking Superclass Methods**: Calling a parent method that was overridden in the child class (`super.displayDetails()`).\n2. **Accessing Shadowed Superclass Fields**: Referencing a parent field when the child class declares a field with the exact same identifier (`super.maxSpeed`).\n3. **Invoking Superclass Constructors**: Delegating initialization to the parent constructor (`super(name, age)`), which must be line 1 of the child constructor."
        },
        {
          type: "code",
          title: "All 3 Uses of `super` in a Professional Employee Hierarchy",
          code: "public class SuperKeywordDemo {\n    // Superclass\n    static class Employee {\n        String title = \"Staff Employee\"; // Shadowed field\n        double baseSalary;\n\n        // USE CASE 3: Parent Constructor\n        public Employee(double salary) {\n            this.baseSalary = salary;\n        }\n\n        public double calculatePay() {\n            return baseSalary;\n        }\n\n        public void printRole() {\n            System.out.println(\"Employee Base Pay: $\" + calculatePay());\n        }\n    }\n\n    // Subclass\n    static class Manager extends Employee {\n        String title = \"Department Manager\"; // Shadows Employee.title\n        double bonus;\n\n        public Manager(double salary, double bonus) {\n            super(salary); // USE CASE 3: Calls Employee(salary)\n            this.bonus = bonus;\n        }\n\n        // Overriding calculatePay()\n        @Override\n        public double calculatePay() {\n            // USE CASE 1: Calling parent overridden method\n            return super.calculatePay() + this.bonus;\n        }\n\n        public void displayTitles() {\n            // USE CASE 2: Accessing shadowed parent field\n            System.out.println(\"Child Title: \" + this.title);\n            System.out.println(\"Parent Title via super: \" + super.title);\n        }\n    }\n\n    public static void main(String[] args) {\n        Manager mgr = new Manager(80000.0, 15000.0);\n        System.out.println(\"Total Manager Pay: $\" + mgr.calculatePay()); // $95000.0\n        mgr.displayTitles();\n    }\n}",
          language: "java",
          explanation: "super.calculatePay() reuses base salary logic and adds bonus. super.title retrieves the shadowed parent field value."
        },
        {
          type: "table",
          title: "`this` vs `super` Comprehensive Comparison",
          headers: ["Dimension", "`this`", "`super`"],
          rows: [
            ["What It References", "The current executing object instance.", "The immediate parent class portion of current object."],
            ["Field Access", "Accesses fields of current class (or inherited).", "Accesses shadowed fields of direct parent class."],
            ["Method Access", "Calls current class methods (including overrides).", "Calls parent class overridden implementations."],
            ["Constructor Delegation", "`this(...)` calls sibling constructor in same class.", "`super(...)` calls parent class constructor."],
            ["Static Context", "❌ Cannot be used in static methods.", "❌ Cannot be used in static methods."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Predict Shadowed Field Output",
          code: "class A {\n    int num = 10;\n}\nclass B extends A {\n    int num = 20;\n    void show() {\n        System.out.println(num + \" \" + super.num);\n    }\n}\nclass TestSuper {\n    public static void main(String[] args) {\n        new B().show();\n    }\n}",
          expectedOutput: "20 10",
          explanation: "'num' resolves to B's local field (20), while 'super.num' resolves to A's parent field (10)."
        },
        {
          type: "dryRun",
          title: "Execution Trace: `mgr.calculatePay()`",
          iterations: [
            { step: 1, variables: { "Call": "mgr.calculatePay()", "Context": "Manager.class" }, description: "Enters Manager's overridden calculatePay() method." },
            { step: 2, variables: { "Instruction": "super.calculatePay()", "Target": "Employee.class" }, description: "Dispatches explicitly to Employee's calculatePay() method." },
            { step: 3, variables: { "Parent Execution": "return baseSalary (80000.0)" }, description: "Superclass evaluates base salary and returns 80000.0." },
            { step: 4, variables: { "Combination": "80000.0 + bonus (15000.0) = 95000.0" }, description: "Manager adds bonus to base salary and returns final compensation." }
          ]
        },
        {
          type: "warning",
          title: "Common `super` Traps",
          items: [
            "**Attempting `super.super.method()`**: You CANNOT chain `super.super`. Java strictly enforces that a subclass can only see its direct immediate parent to preserve encapsulation boundaries.",
            "**Using `super` in a `static` Method**: `super` relies on the current heap object instance; calling `super.print()` inside `public static void main` causes a compile error: *non-static variable super cannot be referenced from a static context*.",
            "**Field Shadowing Anti-Pattern**: Re-declaring a field with the exact same name in a child class creates confusing bugs; prefer giving fields unique names or keeping them private."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Can You Access Grandparent Methods via `super.super`?",
          traps: [
            {
              question: "Is `super.super.method()` valid syntax in Java to bypass an immediate parent's overridden method and call the grandparent's version?",
              trap: "Assuming Java allows multi-level super navigation like C++ scope resolution.",
              solution: "NO! **`super.super` is a compile-time syntax error in Java**. The language designers intentionally banned `super.super` to prevent child classes from violating the encapsulation invariants established by the immediate parent class."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "How can a subclass method invoke its parent's version of an overridden method named `calculate()`?",
          options: [
            "`this.calculate()`",
            "`super.calculate()`",
            "`Parent.calculate()`",
            "`super.super.calculate()`"
          ],
          answer: 1,
          explanation: "`super.calculate()` explicitly directs the JVM to invoke the parent class implementation of `calculate()`, bypassing the child's override."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "`super` references the immediate superclass part of the current object.",
            "Used to call overridden parent methods: `super.method()`.",
            "Used to access shadowed parent fields: `super.field`.",
            "Used in constructor chaining: `super(args)` on line 1.",
            "`super.super` is illegal in Java."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Method Overriding & Runtime Polymorphism, mastering overriding rules, covariant returns, and the `@Override` annotation."
        }
      ]
    }
  },
  {
    slug: "method-overriding-basics",
    title: "Method Overriding & Runtime Polymorphism",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `what-is-inheritance`, `super-keyword`, and method signatures."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of Method Overriding as **Upgrading a Smartphone App with a Specialized Driver**:\n• The base operating system defines a universal button: **\"Navigate to Work\"** (`mapApp.navigate()`).\n• If you are driving a gasoline car, the navigation app calculates standard highway routes.\n• If you are driving an Electric Car (**Subclass**), the app **overrides** the navigation algorithm to automatically route through Tesla Superchargers (**Specialized Child Behavior**).\n• The user presses the exact same button (`navigate()`), but the system executes the specific child implementation tailored to the runtime object."
        },
        {
          type: "callout",
          title: "The 5 Inviolable Rules of Method Overriding",
          content: "1. **Exact Signature Match**: Method name, parameter count, and parameter types MUST be identical.\n2. **Covariant Return Type**: The return type can be identical OR a subtype of the parent's return type.\n3. **Access Visibility Rule**: The child method CANNOT reduce visibility (can widen: `protected` &rarr; `public`; cannot narrow: `public` &rarr; `private`).\n4. **Exception Handling Rule**: The child method cannot throw broader or new checked exceptions than the parent.\n5. **Forbidden Overrides**: `private`, `static`, and `final` methods CANNOT be overridden."
        },
        {
          type: "code",
          title: "Method Overriding & Runtime Dynamic Dispatch in Action",
          code: "public class MethodOverridingDemo {\n    // Base Superclass\n    static class Shape {\n        public double getArea() {\n            return 0.0; // Default generic shape\n        }\n\n        public void render() {\n            System.out.println(\"Rendering generic shape with area: \" + getArea());\n        }\n    }\n\n    // Subclass 1\n    static class Circle extends Shape {\n        private double radius;\n        public Circle(double r) { this.radius = r; }\n\n        @Override\n        public double getArea() {\n            return Math.PI * radius * radius;\n        }\n    }\n\n    // Subclass 2\n    static class Rectangle extends Shape {\n        private double width, height;\n        public Rectangle(double w, double h) { this.width = w; this.height = h; }\n\n        @Override\n        public double getArea() {\n            return width * height;\n        }\n    }\n\n    public static void main(String[] args) {\n        // Polymorphic reference: Parent type holding Child instances\n        Shape s1 = new Circle(5.0);\n        Shape s2 = new Rectangle(4.0, 6.0);\n\n        // Dynamic Method Dispatch at runtime\n        s1.render(); // Rendering generic shape with area: 78.5398...\n        s2.render(); // Rendering generic shape with area: 24.0\n    }\n}",
          language: "java",
          explanation: "Even though s1 and s2 are declared as type Shape, the JVM inspects the actual heap object at runtime (Circle vs Rectangle) and dispatches getArea() to the child's overridden method."
        },
        {
          type: "table",
          title: "Method Overloading vs Method Overriding",
          headers: ["Dimension", "Method Overloading", "Method Overriding"],
          rows: [
            ["Location", "Within the same class (or inherited).", "Between Superclass and Subclass."],
            ["Method Name", "MUST be identical.", "MUST be identical."],
            ["Parameters", "MUST differ (type, count, or order).", "MUST be identical."],
            ["Return Type", "Can be anything (not a factor).", "Must be identical or covariant subtype."],
            ["Binding Time", "Compile-time (Static binding).", "Runtime (Dynamic dispatch via vtable)."],
            ["Private / Final", "Can overload private/final methods.", "CANNOT override private/final methods."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Predict Polymorphic Output",
          code: "class SuperA {\n    void print() { System.out.print(\"Super \"); }\n}\nclass SubB extends SuperA {\n    void print() { System.out.print(\"Sub \"); }\n}\nclass OverrideQuiz {\n    public static void main(String[] args) {\n        SuperA obj = new SubB();\n        obj.print();\n    }\n}",
          expectedOutput: "Sub ",
          explanation: "Because obj points to an instance of SubB on the heap, runtime dynamic dispatch executes SubB's overridden print() method."
        },
        {
          type: "dryRun",
          title: "JVM Virtual Method Table (vtable) Dynamic Dispatch Trace",
          iterations: [
            { step: 1, variables: { "Code": "Shape s1 = new Circle(5.0); s1.getArea();" }, description: "Bytecode issues 'invokevirtual Shape.getArea()'." },
            { step: 2, variables: { "Stack Inspection": "Pops receiver reference s1" }, description: "Inspects actual heap object class tag -> discovers Circle.class." },
            { step: 3, variables: { "VTable Lookup": "Circle's Virtual Method Table" }, description: "Finds Circle.getArea() address in slot matching Shape.getArea()." },
            { step: 4, variables: { "Execution": "Circle.getArea() runs" }, description: "Calculates Pi * r^2 and pushes 78.5398... onto Operand Stack." }
          ]
        },
        {
          type: "warning",
          title: "Method Overriding Traps",
          items: [
            "**Omitting `@Override`**: If you misspell the method name (e.g. `public double getarea()`) without `@Override`, the compiler treats it as a brand-new method instead of an override, and polymorphism will fail silently.",
            "**Static Method Hiding (Not Overriding)**: Re-declaring a static method in a subclass hides the parent method; it is bound at compile-time by reference type, NOT dynamically at runtime.",
            "**Narrowing Access Modifier**: Changing `public void move()` in parent to `protected void move()` in child causes compile error: *cannot reduce visibility of inherited method*."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Can You Override `static` Methods in Java?",
          traps: [
            {
              question: "Can a `static` method be overridden in Java? What happens if a subclass defines a static method with the exact same signature as the parent?",
              trap: "Thinking static methods participate in runtime polymorphism.",
              solution: "NO! **Static methods cannot be overridden; they can only be HIDDEN (Method Hiding)**.\n• Method overriding relies on dynamic runtime dispatch based on the **actual heap object** (`invokevirtual`).\n• Static methods belong to the class and are resolved at compile-time based on the **reference variable's declared type** (`invokestatic`).\n• If `Parent p = new Child(); p.staticMethod();` executes, it will run `Parent.staticMethod()`, NOT `Child.staticMethod()`!"
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "If a superclass defines `protected Object getItem()`, which return type is legally allowed for a subclass overriding this method?",
          options: [
            "`void`",
            "`String` (because String is a subtype of Object - Covariant Return Type)",
            "`int` (primitive)",
            "None; the return type must strictly be `Object`"
          ],
          answer: 1,
          explanation: "Java allows Covariant Return Types: an overriding method can declare a return type that is a subtype (like `String`) of the parent method's return type (`Object`)."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Method Overriding enables runtime polymorphism (dynamic method dispatch).",
            "Always annotate overriding methods with `@Override` for compiler validation.",
            "Signatures must match; return types can be covariant subtypes.",
            "Access visibility can be widened but never narrowed.",
            "`static`, `private`, and `final` methods cannot be overridden."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Preventing Inheritance: The 'final' Keyword, understanding how final classes, methods, and variables lock down architecture and enable JIT optimizations."
        }
      ]
    }
  },
  {
    slug: "preventing-inheritance-final",
    title: "Preventing Inheritance: The 'final' Keyword",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `what-is-inheritance`, `method-overriding-basics`, and constants."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of the `final` Keyword as a **Security Tamper-Proof Seal on a Certified Legal Contract**:\n• **`final` Variable (Immutable Stamped Value)**: Once written with ink, the number cannot be crossed out or altered (`final int MAX = 100`).\n• **`final` Method (Non-Negotiable Core Procedure)**: The security protocol for bank vault authentication is sealed. Subclasses may customize their lobby decor, but they are strictly forbidden from overriding the authentication security algorithm.\n• **`final` Class (Sealed Standard Specification)**: The class is 100% complete and sealed (`final class String`). Nobody can subclass it to inject spyware or modify its behavior."
        },
        {
          type: "callout",
          title: "The 3 Scopes of `final` in Java",
          content: "1. **`final` Variable**: Cannot be reassigned after its initial assignment (constant value / pointer).\n2. **`final` Method**: Cannot be overridden by any subclass (locks core algorithm).\n3. **`final` Class**: Cannot be extended / subclassed by any class (locks entire hierarchy)."
        },
        {
          type: "code",
          title: "The `final` Keyword Across Variables, Methods & Classes",
          code: "public class FinalKeywordDemo {\n    // 1. FINAL CLASS: Cannot be extended by any class\n    public static final class SecurityToken {\n        private final String tokenString; // FINAL FIELD\n\n        public SecurityToken(String token) {\n            this.tokenString = token;\n        }\n\n        public String getToken() {\n            return tokenString;\n        }\n    }\n\n    // 2. CLASS WITH FINAL METHOD\n    static class SecureBankAccount {\n        private double balance;\n\n        public SecureBankAccount(double b) { this.balance = b; }\n\n        // FINAL METHOD: Subclasses CANNOT override this sensitive audit logic\n        public final void auditTransaction(String type, double amount) {\n            System.out.println(\"[IMMUTABLE AUDIT LOG] \" + type + \": $\" + amount);\n        }\n\n        // Regular method: Subclasses CAN override\n        public void printSummary() {\n            System.out.println(\"Account Balance: $\" + balance);\n        }\n    }\n\n    public static void main(String[] args) {\n        SecurityToken token = new SecurityToken(\"AUTH_9988_XYZ\");\n        System.out.println(\"Token: \" + token.getToken());\n\n        SecureBankAccount acc = new SecureBankAccount(5000.0);\n        acc.auditTransaction(\"DEPOSIT\", 1000.0);\n    }\n}",
          language: "java",
          explanation: "SecurityToken cannot be extended. SecureBankAccount allows subclasses to override printSummary(), but forbids overriding auditTransaction()."
        },
        {
          type: "table",
          title: "Summary of `final` Keyword Behaviors",
          headers: ["Context", "Syntax Example", "Effect / Compiler Invariant", "Primary Purpose"],
          rows: [
            ["Variable / Field", "`final int x = 10;`", "Cannot be reassigned after initialization.", "Create constants; ensure reference immutability."],
            ["Method", "`public final void verify()`", "Cannot be overridden in any subclass.", "Protect critical algorithms; enable JIT inlining."],
            ["Class", "`public final class System`", "Cannot be extended via `extends`.", "Guarantee complete security; prevent subclass tampering."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Predict Final Reference Mutation",
          code: "class StringBuilderFinal {\n    public static void main(String[] args) {\n        final StringBuilder sb = new StringBuilder(\"Hello\");\n        sb.append(\" World\"); // Mutates internal object payload\n        // sb = new StringBuilder(\"New\"); // Would cause compile error: cannot assign value to final variable sb\n        System.out.println(sb.toString());\n    }\n}",
          expectedOutput: "Hello World",
          explanation: "'final' prevents reassigning the 'sb' reference pointer, but the underlying StringBuilder object on the heap remains 100% mutable."
        },
        {
          type: "dryRun",
          title: "Compiler Enforcement Trace on `final class`",
          iterations: [
            { step: 1, variables: { "Code": "final class Vault { ... }" }, description: "Compiler marks Vault class header with ACC_FINAL bytecode flag." },
            { step: 2, variables: { "Attempt": "class HackVault extends Vault { ... }" }, description: "Compiler inspects superclass header -> detects ACC_FINAL flag." },
            { step: 3, variables: { "Result": "COMPILATION ERROR: cannot inherit from final Vault" }, description: "Compilation aborted immediately; zero bytecode emitted." }
          ]
        },
        {
          type: "warning",
          title: "Common `final` Misconceptions",
          items: [
            "**Confusing `final` Reference with Object Immutability**: Declaring `final int[] arr = {1, 2, 3};` prevents `arr = new int[5]`, but `arr[0] = 999;` is 100% valid! `final` locks the pointer, not the heap object payload.",
            "**Final Variables Must Be Initialized**: A `final` instance variable must be initialized either at declaration or inside every constructor; otherwise, the compiler throws *variable might not have been initialized*.",
            "**Overusing `final` Classes in Extensible Frameworks**: Marking every class `final` prevents users of your library from mocking or extending classes in unit tests."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Why is `java.lang.String` Declared `final`?",
          traps: [
            {
              question: "What catastrophic security and architectural bugs would occur if `java.lang.String` were NOT declared `final` in Java?",
              trap: "Only citing performance optimizations.",
              solution: "If `String` were not `final`, an attacker could create a malicious subclass `MutableString extends String`:\n1. **Security Bypass**: If a security manager checks `if (str.equals(\"/safe/path\")) openFile(str);`, the attacker could override `toString()` or mutate internal state between the check and file opening, gaining unauthorized root file access.\n2. **String Constant Pool Corruption**: Subclasses could mutate pooled literals, corrupting strings across unrelated application threads.\n3. **HashMap & HashSet Key Invalidation**: Changing hash values after insertion would corrupt hash table lookup trees."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "What happens if a subclass attempts to override a method declared `public final void save()` in its superclass?",
          options: [
            "The method overrides successfully with a warning",
            "Compilation error: cannot override final method from superclass",
            "Throws a RuntimeException upon method invocation",
            "The method is automatically converted to static"
          ],
          answer: 1,
          explanation: "The `final` keyword explicitly forbids subclasses from overriding the method, producing a compile-time error."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "`final` variables cannot be reassigned after initialization.",
            "`final` methods cannot be overridden, protecting business invariants.",
            "`final` classes cannot be extended, locking down security and immutability.",
            "`final` on reference variables locks the memory pointer, NOT the object payload.",
            "Core Java classes (`String`, `Integer`, `Math`) are `final` for security and stability."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore The 'Object' Class: Root of the Java Hierarchy, mastering `toString()`, `equals()`, and the critical `hashCode()` contract."
        }
      ]
    }
  },
  {
    slug: "the-object-class",
    title: "The 'Object' Class: Root of the Java Hierarchy",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `what-is-inheritance`, `method-overriding-basics`, and reference equality (`==`)."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of `java.lang.Object` as the **Universal Cellular DNA of Java**:\n• In biology, every living animal cell shares foundational DNA for cellular respiration and division, whether it's an eagle or a blue whale.\n• In Java, **EVERY SINGLE CLASS** (whether written by Oracle, Spring, or you) directly or indirectly extends `java.lang.Object`.\n• This guarantees that every object in Java inherently possesses universal abilities: printing its identity (`toString()`), checking value equality (`equals()`), generating hash buckets (`hashCode()`), and thread synchronization (`wait()`/`notify()`)."
        },
        {
          type: "callout",
          title: "The Inviolable Contract Between `equals()` and `hashCode()`",
          content: "1. **Consistency**: If `a.equals(b)` is `true`, then `a.hashCode()` and `b.hashCode()` **MUST return the exact same integer**!\n2. **Inequality**: If `a.equals(b)` is `false`, their `hashCode()` values are NOT required to be distinct (though distinct hash codes improve `HashMap` performance).\n⭐ **Rule of Thumb**: *If you override `equals()`, you MUST ALWAYS override `hashCode()`!*"
        },
        {
          type: "code",
          title: "Overriding `toString()`, `equals()`, and `hashCode()` Correctly",
          code: "import java.util.Objects;\nimport java.util.HashSet;\nimport java.util.Set;\n\npublic class ObjectClassDemo {\n    static class User {\n        private final int id;\n        private final String email;\n\n        public User(int id, String email) {\n            this.id = id;\n            this.email = email;\n        }\n\n        // 1. OVERRIDING toString() for human-readable debugging\n        @Override\n        public String toString() {\n            return \"User[id=\" + id + \", email='\" + email + \"']\";\n        }\n\n        // 2. OVERRIDING equals(Object o) for logical value comparison\n        @Override\n        public boolean equals(Object o) {\n            if (this == o) return true; // Exact same reference\n            if (o == null || getClass() != o.getClass()) return false; // Null or different type\n            User user = (User) o; // Safe downcast\n            return id == user.id && Objects.equals(email, user.email);\n        }\n\n        // 3. OVERRIDING hashCode() matching equals() fields\n        @Override\n        public int hashCode() {\n            return Objects.hash(id, email);\n        }\n    }\n\n    public static void main(String[] args) {\n        User u1 = new User(101, \"alice@domain.com\");\n        User u2 = new User(101, \"alice@domain.com\");\n\n        System.out.println(u1); // User[id=101, email='alice@domain.com']\n        System.out.println(\"== Identity Check: \" + (u1 == u2)); // false (different heap memory)\n        System.out.println(\"equals() Value Check: \" + u1.equals(u2)); // true!\n\n        // HashSet relies on hashCode() and equals() to prevent duplicates\n        Set<User> set = new HashSet<>();\n        set.add(u1);\n        set.add(u2); // Duplicate recognized and rejected!\n        System.out.println(\"Set Size: \" + set.size()); // Exactly 1!\n    }\n}",
          language: "java",
          explanation: "u1 and u2 have different heap addresses (u1 == u2 is false), but logical value equality u1.equals(u2) is true. HashSet correctly deduplicates them to size 1."
        },
        {
          type: "table",
          title: "The 3 Equality Checks in Java",
          headers: ["Equality Mechanism", "What It Compares", "Default `Object` Behavior", "Typical Custom Behavior"],
          rows: [
            ["`==` Operator", "Reference addresses (Are both pointing to exact same heap address?)", "Pointer comparison", "Always pointer comparison (cannot be overridden)."],
            ["`equals(Object o)`", "Logical value equivalence", "`return (this == o);` (Reference identity)", "Compares meaningful business fields (`id`, `email`)."],
            ["`hashCode()`", "Integer hash bucket identifier", "Internal memory-derived pseudo-random integer", "Generates hash code using same fields as `equals()`."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: The Broken HashSet Bug",
          code: "import java.util.*;\nclass BrokenUser {\n    int id;\n    BrokenUser(int id) { this.id = id; }\n    // Overrides equals but FORGETS hashCode!\n    public boolean equals(Object o) {\n        return (o instanceof BrokenUser) && ((BrokenUser) o).id == this.id;\n    }\n}\nclass BrokenHashQuiz {\n    public static void main(String[] args) {\n        Set<BrokenUser> set = new HashSet<>();\n        set.add(new BrokenUser(1));\n        set.add(new BrokenUser(1));\n        System.out.println(\"Set Size: \" + set.size());\n    }\n}",
          expectedOutput: "Set Size: 2",
          explanation: "Because hashCode() was NOT overridden, the two equal objects produced different random hash codes, landing in different buckets. HashSet failed to detect the duplicate and inserted both (Size = 2)!"
        },
        {
          type: "dryRun",
          title: "Why `HashMap.get(key)` Fails When `hashCode()` is Missing",
          iterations: [
            { step: 1, variables: { "Put Key": "new User(101)", "Action": "Calls default Object.hashCode() -> Hash Code = 981247" }, description: "Calculates bucket index = 981247 % 16 = Bucket #7. Stores value in Bucket #7." },
            { step: 2, variables: { "Get Key": "new User(101)", "Action": "Calls default Object.hashCode() -> Hash Code = 442199" }, description: "Calculates bucket index = 442199 % 16 = Bucket #3. Looks in Bucket #3." },
            { step: 3, variables: { "Inspection": "Bucket #3 is empty!", "Result": "Returns null" }, description: "HashMap returns null even though an equal User(101) exists in Bucket #7! Object lost." }
          ]
        },
        {
          type: "warning",
          title: "Common `Object` Method Traps",
          items: [
            "**Overloading `equals` Instead of Overriding**: Declaring `public boolean equals(User other)` creates an overload. When passed to a `HashSet`, it calls `equals(Object o)` and bypasses your method! Always write `@Override public boolean equals(Object o)`.",
            "**Using Mutable Fields in `hashCode()`**: If you change an object's field after inserting it into a `HashSet`, its hash code changes, making it permanently unfindable and impossible to remove from the set (Memory Leak!).",
            "**Comparing Floating Point with `==` in `equals`**: Use `Double.compare(d1, d2) == 0` to properly handle `NaN` and `-0.0` vs `+0.0`."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: The `equals()` & `hashCode()` Contract",
          traps: [
            {
              question: "What happens if two objects return `true` for `a.equals(b)`, but return DIFFERENT values for `a.hashCode()` and `b.hashCode()`?",
              trap: "Saying Java throws an Exception.",
              solution: "No exception is thrown, but it causes **catastrophic silent data corruption in Hash Collections (`HashMap`, `HashSet`, `Hashtable`)**:\n• `HashSet` uses `hashCode()` to find the array bucket first, and only checks `equals()` if the bucket has items.\n• Because their hash codes differ, equal objects will be placed into different buckets.\n• `set.contains(new User(101))` will return `false`, `set.add()` will insert duplicate keys, and `map.get()` will return `null`!"
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "If `a.equals(b)` is `true`, what MUST be true according to the Java specification?",
          options: [
            "`a == b` must be true",
            "`a.hashCode() == b.hashCode()` must be true",
            "`a.toString().equals(b.toString())` must be true",
            "`a.getClass() == Object.class` must be true"
          ],
          answer: 1,
          explanation: "The `equals`-`hashCode` contract strictly mandates that two equal objects must produce the exact same integer hash code."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "`java.lang.Object` is the universal superclass of all classes in Java.",
            "Override `toString()` for human-readable diagnostic logging.",
            "Override `equals(Object o)` for logical value equality.",
            "Always override `hashCode()` whenever you override `equals()` to prevent hash collection corruption.",
            "Never use mutable fields in `hashCode()` calculations."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Module",
          content: "Next, we enter Module 5: Polymorphism, mastering dynamic method dispatch, runtime vs compile-time polymorphism, covariant returns, and instanceof pattern matching."
        }
      ]
    }
  }
];
