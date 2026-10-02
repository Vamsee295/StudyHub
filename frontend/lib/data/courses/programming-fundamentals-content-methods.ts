// Module 9 - Methods & Functions (8 lessons)
import { CourseLessonContent } from './types';

export const methodsFunctionsLessons: Array<{
  slug: string;
  title: string;
  content: CourseLessonContent
}> = [
  {
    slug: "what-is-a-method",
    title: "What is a Method?",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `variables`, `primitive-data-types`, `control-flow`, and the basic lifecycle of program execution."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of a Method as a **Specialized Kitchen Appliance (e.g., a Digital Blender)**:\n• **Inputs (Parameters)**: You pour in raw ingredients (e.g., milk, fruit, ice).\n• **Execution (Method Body)**: You press the button. The internal motor spins, processes the ingredients, and blends them together without the caller needing to know how the gears operate.\n• **Output (Return Value)**: The appliance dispenses a finished smoothie (a computed result value) or sounds a completion beep (a `void` method)."
        },
        {
          type: "callout",
          title: "Formal Definition & Anatomy",
          content: "A **method** is a named, self-contained sub-routine within a class that encapsulates a specific set of instructions. It takes optional input parameters, performs computations or actions, and optionally returns a single result value back to the caller."
        },
        {
          type: "code",
          title: "Method Definition, Invocation & Program Flow",
          code: "public class MethodBasicsDemo {\n    // 1. Method Definition with Parameters and Return Value\n    public static int calculateRectangleArea(int length, int width) {\n        int area = length * width;\n        return area; // Sends result back to the caller\n    }\n\n    // 2. Void Method (Performs an action, no return value)\n    public static void displayReport(String title, int value) {\n        System.out.println(\"=== \" + title + \" ===\");\n        System.out.println(\"Calculated Value: \" + value);\n        System.out.println(\"========================\");\n    }\n\n    public static void main(String[] args) {\n        // Method Invocations (Calling the methods)\n        int room1 = calculateRectangleArea(12, 10); // 120\n        int room2 = calculateRectangleArea(15, 8);  // 120\n\n        displayReport(\"Living Room Area\", room1);\n        displayReport(\"Kitchen Area\", room2);\n    }\n}",
          language: "java",
          explanation: "When calculateRectangleArea(12, 10) is called, the CPU jumps from main() into calculateRectangleArea, executes its instructions, and substitutes the return value 120 back into room1."
        },
        {
          type: "table",
          title: "The 6 Core Components of a Java Method",
          headers: ["Component", "Example Syntax", "Purpose", "Mandatory?"],
          rows: [
            ["Access Modifier", "`public`, `private`", "Controls which other classes can invoke this method.", "Optional (defaults to package-private)"],
            ["Static Keyword", "`static`", "Declares that the method belongs to the Class rather than individual object instances.", "Optional (required for non-object utilities)"],
            ["Return Type", "`int`, `String`, `void`", "Declares the data type of the result returned. Use `void` if no value is returned.", "✅ Mandatory"],
            ["Method Name", "`calculateArea`", "Unique identifier following camelCase naming conventions.", "✅ Mandatory"],
            ["Parameter List", "`(int a, int b)`", "Comma-separated input variables enclosed in parentheses `()`.", "✅ Mandatory (can be empty `()`)"],
            ["Method Body", "`{ return a + b; }`", "The block of statements enclosed in curly braces `{}`.", "✅ Mandatory"]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Calculate Simple Interest",
          code: "class InterestCalculator {\n    public static double computeSimpleInterest(double principal, double rate, int years) {\n        return (principal * rate * years) / 100.0;\n    }\n    public static void main(String[] args) {\n        double interest = computeSimpleInterest(10000, 7.5, 3);\n        System.out.println(\"Interest: $\" + interest);\n    }\n}",
          expectedOutput: "Interest: $2250.0",
          explanation: "(10000 * 7.5 * 3) / 100 = 2250.0. The computed double value is returned and printed."
        },
        {
          type: "dryRun",
          title: "Call Stack Frame Lifecycle: `main()` calling `calculateArea(12, 10)`",
          iterations: [
            { step: 1, variables: { "Call Stack": "[main frame]", "PC": "main() line 17" }, description: "main() is currently executing on top of the JVM Call Stack." },
            { step: 2, variables: { "Call Stack": "[main frame] -> [calculateArea frame]", "length": "12", "width": "10" }, description: "Call invoked: A new Stack Frame for calculateArea is pushed. Local parameters length=12 and width=10 are allocated." },
            { step: 3, variables: { "area": "120", "return": "120" }, description: "area computed. return statement transfers 120 back to caller." },
            { step: 4, variables: { "Call Stack": "[main frame]", "room1": "120" }, description: "calculateArea stack frame is popped. Execution resumes in main() with room1 initialized to 120." }
          ]
        },
        {
          type: "warning",
          title: "Common Method Pitfalls",
          items: [
            "**Declaring Methods Inside Methods**: Java does NOT allow direct nested method declarations inside another method body.",
            "**Missing Return in Non-Void Methods**: If a method declares a return type like `int`, every reachable execution path MUST terminate with a `return <int_value>;`.",
            "**Defining but Never Calling**: Writing a method does nothing until it is explicitly invoked by an active execution thread.",
            "**Ignoring Return Values**: Calling `calculateArea(10, 20);` without assigning or printing the result causes the return value to be discarded."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Method Signature vs Method Header",
          traps: [
            {
              question: "What exact elements constitute a Java 'Method Signature', and does it include the return type?",
              trap: "Thinking access modifiers and return types are part of the method signature.",
              solution: "In Java, a **Method Signature** strictly consists of only two things:\n1. The **Method Name**\n2. The **Parameter List** (types, number, and order of parameters).\n\nModifiers, return types, and `throws` clauses belong to the **Method Header**, but are NOT part of the signature. This is why two methods differing only by return type cannot coexist in the same class."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Which of the following is NOT part of a Java method signature?",
          options: [
            "Method name",
            "Parameter types",
            "Return type",
            "Parameter order"
          ],
          answer: 2,
          explanation: "In Java, the method signature consists solely of the method name and parameter types/order. The return type is part of the method header, not the signature."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Methods encapsulate reusable, modular blocks of business logic.",
            "Invoking a method creates a new Stack Frame on the JVM Call Stack.",
            "Methods have a return type (`void` for no result, or a specific data type).",
            "Method signatures consist strictly of the Method Name and Parameter Types."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Why Use Methods?, diving into the DRY Principle, modular architecture, abstraction, and unit testing."
        }
      ]
    }
  },
  {
    slug: "why-use-methods",
    title: "Why Use Methods?",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `what-is-a-method`, loops, and basic procedural logic."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of software without methods as a **Monolithic Spaghetti Skyscraper** vs with methods as **Modular Interchangeable Lego Blocks**:\n• **Without Methods**: Writing 5,000 lines of code inside `main()` means if you find a bug in your email validation formula, you must hunt down and manually edit 40 duplicate copy-pasted sections, inevitably introducing inconsistencies.\n• **With Methods**: You write `isValidEmail()` once. 40 different caller classes invoke it. Fixing a bug in that single 5-line method instantly fixes the entire enterprise application."
        },
        {
          type: "callout",
          title: "The 5 Pillars of Method Design",
          content: "1. **DRY (Don't Repeat Yourself)**: Eliminate duplicate logic across the codebase.\n2. **Abstraction**: Callers use functionality by name without needing to understand underlying complexities.\n3. **Single Responsibility (SRP)**: Each method focuses on executing one specific task reliably.\n4. **Automated Testing**: Small, isolated methods are simple to test with unit tests.\n5. **Maintainability**: Code changes and optimizations are localized to one file and method."
        },
        {
          type: "code",
          title: "Refactoring: Repetitive Monolith vs Modular Methods",
          code: "public class WhyUseMethodsDemo {\n    // === BAD APPROACH: Monolithic Repetitive Code ===\n    public static void badProcess() {\n        // User 1\n        double salary1 = 50000; double bonus1 = 5000; double tax1 = (salary1 + bonus1) * 0.20;\n        System.out.println(\"User 1 Net: \" + (salary1 + bonus1 - tax1));\n\n        // User 2 (Duplicate formula copy-pasted!)\n        double salary2 = 80000; double bonus2 = 10000; double tax2 = (salary2 + bonus2) * 0.20;\n        System.out.println(\"User 2 Net: \" + (salary2 + bonus2 - tax2));\n    }\n\n    // === GOOD APPROACH: Modular Reusable Helper Method ===\n    public static double calculateNetIncome(double salary, double bonus, double taxRate) {\n        double totalEarnings = salary + bonus;\n        double taxDeduction = totalEarnings * taxRate;\n        return totalEarnings - taxDeduction;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(\"User 1 Net: \" + calculateNetIncome(50000, 5000, 0.20));\n        System.out.println(\"User 2 Net: \" + calculateNetIncome(80000, 10000, 0.20));\n        System.out.println(\"User 3 Net: \" + calculateNetIncome(120000, 25000, 0.25));\n    }\n}",
          language: "java",
          explanation: "Extracting the net income calculation into calculateNetIncome() makes the code self-documenting, eliminates copy-paste bugs, and allows instant updates if tax formulas change."
        },
        {
          type: "table",
          title: "Monolithic Code vs Modular Methods",
          headers: ["Attribute", "Monolithic Code (All in `main()`)", "Modular Code (Using Methods)"],
          rows: [
            ["Code Duplication", "High (copy-pasting formulas)", "Zero (DRY - single source of truth)"],
            ["Debugging Speed", "Slow (must search across thousands of lines)", "Fast (isolated stack traces pinpoint exact method)"],
            ["Readability", "Poor (walls of low-level variables)", "High (expressive verb method names like `validateOrder`)"],
            ["Unit Testing", "Impossible without running full application", "Effortless (isolated unit testing of inputs & outputs)"],
            ["Team Collaboration", "Frequent merge conflicts on monolithic files", "High (developers work on independent modular methods)"]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Modular Greeting Formatter",
          code: "class Formatter {\n    public static String formatGreeting(String role, String name) {\n        return \"[\" + role.toUpperCase() + \"] Welcome, \" + name.trim() + \"!\";\n    }\n    public static void main(String[] args) {\n        System.out.println(formatGreeting(\"admin\", \" Alice \"));\n        System.out.println(formatGreeting(\"guest\", \" Bob \"));\n    }\n}",
          expectedOutput: "[ADMIN] Welcome, Alice!\n[GUEST] Welcome, Bob!",
          explanation: "formatGreeting standardizes role casing and whitespace trimming across all user greetings."
        },
        {
          type: "dryRun",
          title: "Maintainability Trace: Updating Tax Formula from 20% to 22%",
          iterations: [
            { step: 1, variables: { "Monolithic System": "40 copy-pasted locations" }, description: "Developer must manually find, edit, and verify 40 separate lines. High risk of human error." },
            { step: 2, variables: { "Modular Method": "1 single method body" }, description: "Developer changes 1 line inside calculateNetIncome()." },
            { step: 3, variables: { "System Status": "100% synchronized" }, description: "Every caller across the application immediately reflects the updated 22% tax rate." }
          ]
        },
        {
          type: "warning",
          title: "Common Modularization Pitfalls",
          items: [
            "**God Methods**: Writing massive 200-line methods that perform database access, validation, calculation, and UI printing all at once.",
            "**Over-Abstraction**: Creating one-line methods for trivial operations that are used only once and obscure readability.",
            "**Vague Method Names**: Naming methods `doWork()`, `handle()`, or `processData()` rather than specific verbs like `calculateDiscount()`."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Does Calling Methods Slow Down Java?",
          traps: [
            {
              question: "Does splitting code into dozens of small methods reduce Java runtime performance compared to writing one giant loop?",
              trap: "Believing method invocation stack frame overhead will degrade CPU performance.",
              solution: "No. The JVM **HotSpot JIT (Just-In-Time) Compiler** identifies frequently executed 'hot' methods and performs **Method Inlining** at runtime. It replaces the method call with the method's raw bytecode instructions directly at the call site, completely eliminating stack frame allocation overhead while keeping the source code perfectly modular."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "What software engineering principle states that logic should have a single, unambiguous representation in a codebase?",
          options: [
            "KISS (Keep It Simple, Stupid)",
            "DRY (Don't Repeat Yourself)",
            "YAGNI (You Aren't Gonna Need It)",
            "SOLID"
          ],
          answer: 1,
          explanation: "DRY (Don't Repeat Yourself) is the core principle emphasizing the reduction of code repetition by extracting shared logic into reusable methods."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Methods promote DRY architecture and single responsibility.",
            "Methods provide abstraction by separating public interface contracts from internal algorithms.",
            "JIT compiler inlining ensures modular methods run at blazing bare-metal speeds.",
            "Always choose expressive, self-documenting method names."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we master Method Syntax, breaking down access modifiers, return types, parameter declarations, and method body grammar."
        }
      ]
    }
  },
  {
    slug: "method-syntax",
    title: "Method Syntax",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `what-is-a-method`, `why-use-methods`, primitive data types, and identifier rules."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of Method Syntax as an **Official Legal Contract Header**. Every keyword in the header establishes strict rules:\n• **Who can call it?** (Access Modifier: `public` vs `private`)\n• **Does it need an instance object?** (Modifier: `static` vs instance)\n• **What does it produce?** (Return Type: `int`, `String`, or `void`)\n• **What is its legal name?** (Identifier: `calculateTotal`)\n• **What inputs must the caller provide?** (Parameters: `(double subtotal, double tax)`)\n• **What happens inside?** (Body `{ ... }`)"
        },
        {
          type: "callout",
          title: "The Universal Java Method Header Pattern",
          content: "```java\n[access_modifier] [static] <return_type> <methodName>([type1 param1, type2 param2]) {\n    // Method Body\n    return <value>; // Mandatory if return_type != void\n}\n```"
        },
        {
          type: "code",
          title: "Diverse Method Syntax Configurations",
          code: "public class MethodSyntaxExamples {\n    // 1. Multiple parameters with return value\n    public static double calculateBMI(double weightKg, double heightM) {\n        return weightKg / (heightM * heightM);\n    }\n\n    // 2. Zero parameters with return value\n    public static String getServerTimestamp() {\n        return java.time.LocalDateTime.now().toString();\n    }\n\n    // 3. Void method with parameters (Side-effect / Output)\n    public static void logMessage(String level, String msg) {\n        System.out.println(\"[\" + level.toUpperCase() + \"] \" + msg);\n    }\n\n    // 4. Void method with zero parameters\n    public static void printDivider() {\n        System.out.println(\"----------------------------------------\");\n    }\n\n    public static void main(String[] args) {\n        printDivider();\n        logMessage(\"info\", \"Application booted successfully\");\n        double bmi = calculateBMI(70.0, 1.75);\n        System.out.println(\"BMI: \" + String.format(\"%.2f\", bmi));\n        printDivider();\n    }\n}",
          language: "java",
          explanation: "Notice how each method specifies its exact return type (double, String, or void) and matching parameter definitions."
        },
        {
          type: "table",
          title: "Common Java Access & Property Modifiers for Methods",
          headers: ["Keyword", "Category", "Meaning for Methods"],
          rows: [
            ["`public`", "Access Modifier", "Accessible from any class in any package across the entire application."],
            ["`private`", "Access Modifier", "Accessible ONLY within the declaring class (internal helper methods)."],
            ["`protected`", "Access Modifier", "Accessible within the same package and by derived subclasses."],
            ["*(default)*", "Access Modifier", "Package-private: accessible only within the declaring package."],
            ["`static`", "Non-Access Modifier", "Belongs to the class directly; callable without instantiating an object (`ClassName.method()`)."],
            ["`final`", "Non-Access Modifier", "Cannot be overridden by any child subclass."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Method Returning Maximum of Three Numbers",
          code: "class MathUtils {\n    public static int maxOfThree(int a, int b, int c) {\n        int max = a;\n        if (b > max) max = b;\n        if (c > max) max = c;\n        return max;\n    }\n    public static void main(String[] args) {\n        System.out.println(\"Max: \" + maxOfThree(45, 89, 12));\n    }\n}",
          expectedOutput: "Max: 89",
          explanation: "Takes three integers, compares them sequentially, and returns the highest integer."
        },
        {
          type: "dryRun",
          title: "Compiler Syntax Validation Trace",
          iterations: [
            { step: 1, variables: { "Code": "int add(int a, b)" }, description: "❌ COMPILE ERROR: Parameter 'b' lacks a data type. Each parameter must be individually typed: (int a, int b)." },
            { step: 2, variables: { "Code": "void print(); { ... }" }, description: "❌ COMPILE ERROR: Stray semicolon between parameter list and opening brace." },
            { step: 3, variables: { "Code": "public static int square(int x) { return x * x; }" }, description: "✅ VALID: Correct modifier, return type, name, typed parameter, and matching return statement." }
          ]
        },
        {
          type: "warning",
          title: "Common Syntax Traps",
          items: [
            "**Shorthand Parameter Type Omission**: Writing `(int x, y)` instead of `(int x, int y)` is a compilation error in Java.",
            "**Accidental Semicolon on Method Header**: Writing `public static void run(); { ... }` treats the header as an abstract method declaration and breaks the body block.",
            "**Omitting Parentheses on Zero-Parameter Methods**: Calling `printDivider;` instead of `printDivider();` fails to invoke the method."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Can a Method Return Multiple Values in Java?",
          traps: [
            {
              question: "How can a single Java method return multiple values simultaneously?",
              trap: "Attempting syntax like `return a, b;` or using output parameters like C# out/ref.",
              solution: "A Java method can return strictly **only one value or reference**. To return multiple values, you must bundle them into a container object: an array (`int[]`), a standard Java Collection (`List`), a custom `class`, or modern Java 14+ `record Pair(int min, int max)`."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Which of the following method declarations is syntactically INVALID in Java?",
          options: [
            "public static void doWork() {}",
            "int calculate(int x, y) { return x + y; }",
            "private double getRate() { return 4.5; }",
            "public static String[] getNames() { return new String[0]; }"
          ],
          answer: 1,
          explanation: "In Java, every formal parameter must explicitly state its type. `int calculate(int x, y)` fails because parameter `y` lacks a type declaration."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Every parameter must explicitly declare both its data type and variable name.",
            "Non-void methods must return a value compatible with the declared return type.",
            "Static methods can be invoked directly from class scope (`Class.method()`).",
            "Bundle multiple return values into classes, records, or arrays."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Method Parameters in depth, demystifying Java's 100% Pass-by-Value mechanism for primitives and heap references."
        }
      ]
    }
  },
  {
    slug: "method-parameters",
    title: "Method Parameters",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `method-syntax`, stack frames, primitive vs reference variables, and heap memory allocation."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of Java Method Parameter Passing as an **Office Photocopier (Pass-by-Value)**:\n• **Primitive Types (`int`, `double`, `boolean`)**: You write the number `50` on a notepad. You make a photocopy of the page and hand it to a coworker (the method). If your coworker scribbles over their photocopy with `999` and tears it up, your original notepad in your drawer remains strictly `50`.\n• **Reference Types (Arrays, Objects)**: Your notepad contains the street address of a warehouse (`0xHeap789`). You photocopy that address and hand it to your coworker. If your coworker drives to that warehouse address and repaints the interior walls (mutates array/object state), the changes persist in the actual warehouse. BUT if your coworker writes a new address on their photocopy, your original address note remains untouched."
        },
        {
          type: "callout",
          title: "The Immutable Java Rule: Strictly 100% Pass-by-Value",
          content: "⚠️ **CRITICAL INTERVIEW LAW**: Java is **ALWAYS pass-by-value**. There is NO pass-by-reference in Java.\n• When passing a primitive &rarr; the exact binary bits (value) are copied.\n• When passing an object/array &rarr; the **memory address reference bits (pointer value)** are copied."
        },
        {
          type: "code",
          title: "Primitive Pass-by-Value vs Object Mutation",
          code: "public class PassByValueDemo {\n    // 1. Primitive parameter: Local copy modified\n    public static void tryToModifyPrimitive(int x) {\n        x = 999; // Changes ONLY local parameter x\n    }\n\n    // 2. Reference parameter: Modifying object contents\n    public static void modifyArrayContent(int[] arr) {\n        arr[0] = 999; // Mutates heap array element directly!\n    }\n\n    // 3. Reference parameter: Reassigning reference variable\n    public static void tryToReassignReference(int[] arr) {\n        arr = new int[] { 500, 600, 700 }; // Reassigns local pointer ONLY\n    }\n\n    public static void main(String[] args) {\n        int num = 10;\n        tryToModifyPrimitive(num);\n        System.out.println(\"Primitive num after call: \" + num); // 10 (UNCHANGED!)\n\n        int[] numbers = { 1, 2, 3 };\n        modifyArrayContent(numbers);\n        System.out.println(\"Array[0] after content mod: \" + numbers[0]); // 999 (CHANGED!)\n\n        tryToReassignReference(numbers);\n        System.out.println(\"Array[0] after reassignment: \" + numbers[0]); // 999 (UNCHANGED!)\n    }\n}",
          language: "java",
          explanation: "Primitive modifications never escape the method. Array mutations modify the shared heap object. Reassigning the array pointer inside the method only changes the local copy of the reference."
        },
        {
          type: "table",
          title: "Parameter Terminology: Formal Parameters vs Actual Arguments",
          headers: ["Concept", "Definition", "Example in Code", "Where Located"],
          rows: [
            ["Formal Parameter", "The variable placeholder declared in the method signature.", "`public static void greet(String name)`", "Method definition header"],
            ["Actual Argument", "The concrete value, variable, or expression passed during invocation.", "`greet(\"Vamsee\");` or `greet(userInput);`", "Method call site"],
            ["Varargs (`...`)", "Variable-length argument list (syntactic sugar for an array).", "`public static void sum(int... values)`", "Method definition parameter"]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Variable-Arity (Varargs) Sum Method",
          code: "class VarargsDemo {\n    public static int sumAll(int... numbers) {\n        int total = 0;\n        for (int n : numbers) {\n            total += n;\n        }\n        return total;\n    }\n    public static void main(String[] args) {\n        System.out.println(\"Sum 1: \" + sumAll(10, 20));\n        System.out.println(\"Sum 2: \" + sumAll(5, 15, 25, 35));\n        System.out.println(\"Sum 3: \" + sumAll()); // 0\n    }\n}",
          expectedOutput: "Sum 1: 30\nSum 2: 80\nSum 3: 0",
          explanation: "Varargs (int... numbers) allows callers to pass zero, two, four, or any arbitrary count of arguments packed into an array."
        },
        {
          type: "dryRun",
          title: "Stack Frame Memory Trace: `modifyArrayContent(numbers)`",
          iterations: [
            { step: 1, variables: { "main frame": "numbers = 0xHeap44", "Heap 0xHeap44": "[1, 2, 3]" }, description: "main() allocates array at heap address 0xHeap44." },
            { step: 2, variables: { "modify frame": "arr = 0xHeap44 (copy of address)", "Heap 0xHeap44": "[1, 2, 3]" }, description: "Method is called. Parameter arr receives a copy of pointer 0xHeap44." },
            { step: 3, variables: { "modify frame": "arr[0] = 999", "Heap 0xHeap44": "[999, 2, 3]" }, description: "arr[0] accesses Heap object 0xHeap44 and updates element 0 to 999." },
            { step: 4, variables: { "main frame": "numbers = 0xHeap44", "Heap 0xHeap44": "[999, 2, 3]" }, description: "Method frame is popped. main() inspects numbers[0] and reads 999." }
          ]
        },
        {
          type: "warning",
          title: "Common Parameter Mistakes",
          items: [
            "**Attempting a C-style Swap**: Trying to write `swap(a, b)` for primitives in Java is impossible because arguments are copied by value.",
            "**Unintended Shared Mutation**: Passing a mutable array/object to a helper method that alters its contents unexpectedly (defensive copying is recommended when immutability is needed).",
            "**Misplacing Varargs**: In a parameter list, the varargs parameter (`type... name`) MUST be the last parameter (e.g. `(String prefix, int... nums)`)."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: The Classic Swap Method Trap",
          traps: [
            {
              question: "Why does the following swap method fail to swap variables x and y in main?\n`public static void swap(Integer a, Integer b) { Integer temp = a; a = b; b = temp; }`",
              trap: "Assuming that because Integer is an Object, it is passed by reference and will swap.",
              solution: "Java is strictly pass-by-value. Variables `a` and `b` in `swap()` receive copies of the memory pointers pointing to the Integer objects. Inside `swap()`, reassigning `a = b` merely updates the local parameter variable `a` to point to a different address. The original caller variables `x` and `y` in `main()` still point to their original objects."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "What is printed by:\nint x = 5;\nchange(x);\nSystem.out.println(x);\n// where: void change(int x) { x = 10; }",
          options: [
            "5",
            "10",
            "0",
            "Compile error"
          ],
          answer: 0,
          explanation: "Java passes primitives by value. The method `change` modifies its own local copy of parameter `x`, leaving the original `x` in the caller unchanged with value 5."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Java is strictly 100% pass-by-value for all types.",
            "Primitive arguments cannot be modified by the called method.",
            "Object/Array references are copied by value; mutating the underlying object state affects the shared heap instance.",
            "Varargs `Type... name` must always be the final parameter in the method signature."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we examine Return Values, mastering explicit return types, early exit guards, unreachable code errors, and returning objects."
        }
      ]
    }
  },
  {
    slug: "return-values",
    title: "Return Values",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `what-is-a-method`, `method-syntax`, and the JVM stack frame lifecycle."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of the `return` statement as an **Emergency Exit Hatch with a Certified Delivery Package**:\n• **The Payload**: The expression next to `return` is evaluated, bundled into the return slot of the current stack frame, and delivered directly to the caller's evaluation site.\n• **The Immediate Exit**: The moment the CPU encounters `return`, the current stack frame is instantly dismantled and popped off the stack. No subsequent statements in that method will ever execute."
        },
        {
          type: "callout",
          title: "Definite Return Requirement",
          content: "In Java, if a method declares a non-void return type (e.g. `int`, `String`), the Java compiler enforces **Definite Assignment & Definite Return**: every single reachable execution branch MUST end in a valid `return` statement or throw an exception. Leaving even one `if` path without a `return` triggers a compile-time error: *'missing return statement'*."
        },
        {
          type: "code",
          title: "Early Returns, Guard Clauses & Object Returns",
          code: "public class ReturnValuesDemo {\n    // 1. Guard Clause Pattern (Early Exit for clean code)\n    public static double calculateDiscount(double price, int customerYears, boolean isVip) {\n        // Guard clause: Invalid input\n        if (price <= 0) {\n            return 0.0; // Early exit\n        }\n        // Guard clause: VIP status\n        if (isVip) {\n            return price * 0.25;\n        }\n        // Standard tier calculation\n        if (customerYears >= 5) {\n            return price * 0.15;\n        }\n        return price * 0.05; // Base fallback discount\n    }\n\n    // 2. Returning an Array / Object\n    public static int[] getMinMax(int[] numbers) {\n        if (numbers == null || numbers.length == 0) {\n            return new int[] { 0, 0 };\n        }\n        int min = numbers[0];\n        int max = numbers[0];\n        for (int n : numbers) {\n            if (n < min) min = n;\n            if (n > max) max = n;\n        }\n        return new int[] { min, max }; // Bundled array return\n    }\n\n    public static void main(String[] args) {\n        double discount = calculateDiscount(200.0, 6, false); // 30.0\n        System.out.println(\"Discount: $\" + discount);\n\n        int[] stats = getMinMax(new int[] { 45, 12, 89, 3, 67 });\n        System.out.println(\"Min: \" + stats[0] + \", Max: \" + stats[1]); // Min: 3, Max: 89\n    }\n}",
          language: "java",
          explanation: "Guard clauses eliminate deeply nested if-else ladders by returning as soon as a condition is satisfied. getMinMax bundles multiple return metrics into a single heap array."
        },
        {
          type: "table",
          title: "Return Type Compatibility & Implicit Widening Rules",
          headers: ["Declared Return Type", "Returned Value Type", "Allowed by Compiler?", "Explanation"],
          rows: [
            ["`double`", "`int` (e.g. `return 5;`)", "✅ Allowed", "Implicit widening: `5` is promoted to `5.0` automatically."],
            ["`int`", "`double` (e.g. `return 5.5;`)", "❌ Compile Error", "Narrowing conversion: requires explicit cast `(int) 5.5`."],
            ["`Object`", "`String` (e.g. `return \"Hi\";`)", "✅ Allowed", "Upcasting: `String` is a subclass of `Object`."],
            ["`void`", "`return 10;`", "❌ Compile Error", "Void methods cannot return any expression."],
            ["`void`", "`return;`", "✅ Allowed", "Bare return statement safely exits the void method early."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Score-to-Grade Converter",
          code: "class Grader {\n    public static char getGrade(int score) {\n        if (score >= 90) return 'A';\n        if (score >= 80) return 'B';\n        if (score >= 70) return 'C';\n        if (score >= 60) return 'D';\n        return 'F';\n    }\n    public static void main(String[] args) {\n        System.out.println(\"Grade: \" + getGrade(85));\n    }\n}",
          expectedOutput: "Grade: B",
          explanation: "85 >= 80 evaluates to true, so 'B' is returned immediately and execution exits."
        },
        {
          type: "dryRun",
          title: "Early Exit Guard Trace: `calculateDiscount(0.0, 10, true)`",
          iterations: [
            { step: 1, variables: { "price": "0.0", "customerYears": "10", "isVip": "true" }, description: "Method called with invalid price 0.0." },
            { step: 2, variables: { "price <= 0": "true", "return": "0.0" }, description: "First guard clause matches! Method executes `return 0.0;` immediately." },
            { step: 3, variables: { "VIP check": "Skipped", "Years check": "Skipped" }, description: "Subsequent conditions are never evaluated. Frame is popped and 0.0 is delivered." }
          ]
        },
        {
          type: "warning",
          title: "Common Return Value Traps",
          items: [
            "**Unreachable Code Error**: Writing any statement immediately following an unconditional `return` statement triggers a compile-time error (*'unreachable statement'*).",
            "**Missing Else Return**: Writing `if (x > 0) return true;` without a fallback `return false;` outside the branch causes a compile failure.",
            "**Returning Local Array vs Mutating Caller**: If you return an internal private array reference directly, callers can mutate it, breaking encapsulation."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Return vs Finally Block Override",
          traps: [
            {
              question: "What value is returned by `testMethod()`?\n```java\npublic static int testMethod() {\n    try {\n        return 10;\n    } finally {\n        return 20;\n    }\n}\n```",
              trap: "Assuming 10 is returned because try returns first.",
              solution: "It returns **20**. In Java, the `finally` block is guaranteed to execute before the method exits. If the `finally` block contains its own `return` statement, it completely supersedes and discards the return value from the `try` block (a notorious anti-pattern to avoid in production)."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Why does this method fail to compile?\n```java\nint test(int x) {\n    if (x > 0) return 1;\n    if (x < 0) return -1;\n}\n```",
          options: [
            "Missing static modifier",
            "Parameter x cannot be checked twice",
            "Missing return statement if x == 0",
            "Cannot return negative numbers"
          ],
          answer: 2,
          explanation: "If x is 0, neither if-condition triggers, leaving no return statement on that execution path. The compiler rejects this with a 'missing return statement' error."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "The `return` statement halts method execution and delivers the result value to the caller.",
            "Every reachable execution branch in a non-void method must end in a valid return or throw statement.",
            "Use Guard Clauses to exit early and avoid deep nesting.",
            "Returned expressions can be implicitly widened to match the declared return type."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore void Methods, understanding how procedures operate via side-effects, I/O mutations, and early exit returns."
        }
      ]
    }
  },
  {
    slug: "void-methods",
    title: "void Methods",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `return-values`, `method-syntax`, and the distinction between expressions and statements."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of a `void` method as a **Factory Dispatcher / Workhorse Task**:\n• When you send a command to a physical assembly robot (e.g. `paintChassisRed()`), it performs an action in the real physical world (a side effect).\n• It does NOT hand you back a box of data. It simply completes its assigned labor, steps aside, and lets the next factory stage proceed."
        },
        {
          type: "callout",
          title: "The Purpose of void: Side Effects and Actions",
          content: "`void` is a Java keyword indicating that a method **does not produce a result value**. Void methods are invoked strictly for their **side effects**, such as:\n1. Printing to the console (`System.out.println()`)\n2. Mutating objects or arrays in Heap memory\n3. Writing data to a file, database, or network socket\n4. Triggering UI animations or hardware events"
        },
        {
          type: "code",
          title: "void Methods in Action: Printing, Mutation & Early Exit",
          code: "public class VoidMethodsDemo {\n    // 1. Action Method: Console output\n    public static void printBanner(String message) {\n        System.out.println(\"====================================\");\n        System.out.println(\"  NOTICE: \" + message.toUpperCase());\n        System.out.println(\"====================================\");\n    }\n\n    // 2. Early Exit in a Void Method using bare 'return;'\n    public static void processTransaction(double amount, double balance) {\n        if (amount <= 0) {\n            System.out.println(\"❌ Error: Transaction amount must be positive.\");\n            return; // Exit early! No further code runs.\n        }\n        if (amount > balance) {\n            System.out.println(\"❌ Error: Insufficient funds ($ \" + balance + \").\");\n            return; // Exit early!\n        }\n        System.out.println(\"✅ Approved: Transferred $\" + amount);\n    }\n\n    // 3. Mutation Method: Modifying array elements in-place\n    public static void squareArrayInPlace(int[] numbers) {\n        if (numbers == null) return;\n        for (int i = 0; i < numbers.length; i++) {\n            numbers[i] = numbers[i] * numbers[i]; // In-place Heap mutation\n        }\n    }\n\n    public static void main(String[] args) {\n        printBanner(\"System Maintenance\");\n        processTransaction(-50, 1000);  // Error: must be positive\n        processTransaction(250, 1000);  // Approved\n\n        int[] values = { 2, 4, 6 };\n        squareArrayInPlace(values);\n        System.out.println(\"Squared values[1]: \" + values[1]); // 16\n    }\n}",
          language: "java",
          explanation: "void methods perform their duties directly through console writes, validation gates, or heap object mutations. Notice how 'return;' is used without a value to terminate execution early."
        },
        {
          type: "table",
          title: "Value-Returning Methods vs void Methods",
          headers: ["Feature", "Value-Returning Method (`int`, `String`)", "void Method (`void`)"],
          rows: [
            ["Assignment to Variable", "✅ `int x = calculate();`", "❌ `int x = run();` &rarr; Compile Error"],
            ["Use in `System.out.println()`", "✅ `System.out.println(calc());`", "❌ `System.out.println(run());` &rarr; Compile Error"],
            ["Return Statement Syntax", "`return <expression>;` (Mandatory)", "`return;` (Optional bare return for early exit)"],
            ["Primary Purpose", "Compute and transform data without side-effects.", "Perform actions, write I/O, mutate existing objects."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: In-Place Reverse Array via Void Method",
          code: "class ArrayReverser {\n    public static void reverse(int[] arr) {\n        int i = 0, j = arr.length - 1;\n        while (i < j) {\n            int temp = arr[i];\n            arr[i] = arr[j];\n            arr[j] = temp;\n            i++; j--;\n        }\n    }\n    public static void main(String[] args) {\n        int[] data = { 1, 2, 3, 4, 5 };\n        reverse(data);\n        System.out.println(\"Reversed: \" + java.util.Arrays.toString(data));\n    }\n}",
          expectedOutput: "Reversed: [5, 4, 3, 2, 1]",
          explanation: "reverse() operates directly on the caller's array in Heap memory without returning any new object."
        },
        {
          type: "dryRun",
          title: "Early Return Trace: `processTransaction(-50, 1000)`",
          iterations: [
            { step: 1, variables: { "amount": "-50", "balance": "1000" }, description: "processTransaction stack frame initialized." },
            { step: 2, variables: { "amount <= 0": "true" }, description: "Error condition met. Prints error banner to console." },
            { step: 3, variables: { "return;": "Executed" }, description: "Bare return statement executed. Method stack frame instantly popped. Balance check and Approval logic are skipped." }
          ]
        },
        {
          type: "warning",
          title: "Common void Method Mistakes",
          items: [
            "**Attempting to Return a Value**: Writing `return 0;` inside a `void` method produces a compile-time error: *'cannot return a value from method with void result type'*.",
            "**Attempting Assignment**: `int res = printMessage();` fails to compile because `void` represents the absence of any type.",
            "**Passing Void Call to println**: `System.out.println(doSomething());` fails if `doSomething()` is void.",
            "**Neglecting Early Returns**: Forgetting `return;` inside validation blocks causes the method to continue executing invalid transaction logic."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: `void` keyword vs `java.lang.Void` Class",
          traps: [
            {
              question: "What is the difference between primitive `void` and `java.lang.Void` in Java?",
              trap: "Thinking they are interchangeable or that Void can be instantiated.",
              solution: "`void` is a primitive keyword denoting no return type. `java.lang.Void` is an uninstantiable placeholder reference class (`public final class Void`). It is used exclusively in Generic reflection and concurrency (e.g. `Callable<Void>` or `CompletableFuture<Void>`) when a generic type parameter requires an Object, where the only valid return value is `return null;`."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Which statement is valid inside a method declared as `public static void log()`?",
          options: [
            "return 0;",
            "return \"Done\";",
            "return;",
            "return false;"
          ],
          answer: 2,
          explanation: "In a void method, only a bare `return;` statement without any value expression is permitted."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "`void` indicates that a method returns no value and is executed for side-effects.",
            "Use bare `return;` to exit a void method early.",
            "Calls to void methods cannot be assigned to variables or passed to `System.out.println()`.",
            "Void methods are commonly used for in-place data structure mutation, file I/O, and printing."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Method Overloading Basics, understanding how the Java compiler resolves multiple methods sharing the same name through static compile-time binding."
        }
      ]
    }
  },
  {
    slug: "method-overloading-basics",
    title: "Method Overloading Basics",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `method-syntax`, `method-parameters`, primitive data types, and method signatures."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of Method Overloading as a **Universal Multi-Port Fast Charger**:\n• The charger has one single brand label: `charge()`.\n• If you plug in a phone (takes `PhoneDevice`), it delivers 20W.\n• If you plug in a laptop (takes `LaptopDevice`), it delivers 100W.\n• If you plug in two headphones at once (takes `Device d1, Device d2`), it splits power 50/50.\n• The user doesn't need 4 separate charger names (`chargePhone()`, `chargeLaptop()`, `chargeTwoDevices()`). The device connected determines the power profile automatically at compile time."
        },
        {
          type: "callout",
          title: "Compile-Time Polymorphism (Static Binding)",
          content: "**Method Overloading** occurs when two or more methods in the same class share the exact same method name but have **different parameter lists**.\n\nOverload resolution is performed strictly at **compile time** (Static Binding) by inspecting the types, count, and order of arguments passed at the call site."
        },
        {
          type: "code",
          title: "Overloading by Parameter Count, Type, and Order",
          code: "public class OverloadingDemo {\n    // 1. Base method: 2 integers\n    public static int add(int a, int b) {\n        System.out.print(\"[int, int] -> \");\n        return a + b;\n    }\n\n    // 2. Overload by Number of Parameters (3 integers)\n    public static int add(int a, int b, int c) {\n        System.out.print(\"[int, int, int] -> \");\n        return a + b + c;\n    }\n\n    // 3. Overload by Data Type (2 doubles)\n    public static double add(double a, double b) {\n        System.out.print(\"[double, double] -> \");\n        return a + b;\n    }\n\n    // 4. Overload by Parameter Ordering\n    public static void display(String label, int value) {\n        System.out.println(label + \": \" + value);\n    }\n    public static void display(int value, String label) {\n        System.out.println(value + \" -> \" + label);\n    }\n\n    public static void main(String[] args) {\n        System.out.println(add(10, 20));       // [int, int] -> 30\n        System.out.println(add(10, 20, 30));   // [int, int, int] -> 60\n        System.out.println(add(10.5, 20.3));   // [double, double] -> 30.8\n        \n        display(\"Rank\", 1);                   // Rank: 1\n        display(1, \"Rank\");                   // 1 -> Rank\n    }\n}",
          language: "java",
          explanation: "The compiler binds each add() call to the precise matching method implementation based on the argument count and types."
        },
        {
          type: "table",
          title: "Valid vs Invalid Overloading Scenarios",
          headers: ["Method Pair", "Valid Overload?", "Reason"],
          rows: [
            ["`int calc(int a)` and `int calc(double a)`", "✅ Valid", "Parameter data types differ (`int` vs `double`)."],
            ["`int calc(int a, int b)` and `int calc(int a)`", "✅ Valid", "Parameter count differs (2 vs 1)."],
            ["`void log(String s, int n)` and `void log(int n, String s)`", "✅ Valid", "Parameter order differs (`String, int` vs `int, String`)."],
            ["`int calc(int a)` and `double calc(int a)`", "❌ INVALID", "Compile Error: Differentiating only by return type is illegal."],
            ["`public int calc(int a)` and `private int calc(int a)`", "❌ INVALID", "Compile Error: Access modifiers do not differentiate overloads."],
            ["`static void run(int a)` and `void run(int a)`", "❌ INVALID", "Compile Error: static modifier does not differentiate overloads."]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Overloaded Area Calculator",
          code: "class AreaCalculator {\n    public static double area(double radius) {\n        return Math.PI * radius * radius; // Circle\n    }\n    public static double area(double length, double width) {\n        return length * width; // Rectangle\n    }\n    public static void main(String[] args) {\n        System.out.println(\"Circle: \" + String.format(\"%.2f\", area(5.0)));\n        System.out.println(\"Rectangle: \" + String.format(\"%.2f\", area(4.0, 6.0)));\n    }\n}",
          expectedOutput: "Circle: 78.54\nRectangle: 24.00",
          explanation: "area(5.0) calls the 1-parameter circle method, while area(4.0, 6.0) calls the 2-parameter rectangle method."
        },
        {
          type: "dryRun",
          title: "Compiler Resolution Priority Trace: `calculate(5)`",
          iterations: [
            { step: 1, variables: { "Candidate 1": "calculate(int x)", "Match Level": "Exact Match (Rank 1)" }, description: "Exact primitive type match found. Direct invocation." },
            { step: 2, variables: { "Candidate 2": "calculate(long x)", "Match Level": "Widening Conversion (Rank 2)" }, description: "Considered only if exact int match does not exist." },
            { step: 3, variables: { "Candidate 3": "calculate(Integer x)", "Match Level": "Autoboxing (Rank 3)" }, description: "Considered only if primitive widening does not exist." },
            { step: 4, variables: { "Candidate 4": "calculate(int... x)", "Match Level": "Varargs (Rank 4)" }, description: "Lowest priority fallback." }
          ]
        },
        {
          type: "warning",
          title: "Common Overloading Pitfalls",
          items: [
            "**Attempting to Overload by Return Type Only**: The compiler relies on the method signature at the call site. Because `calc(5);` does not specify an expected return type, the compiler cannot distinguish `int calc(int)` from `void calc(int)`.",
            "**Ambiguous Invocations**: Defining `void test(int a, double b)` and `void test(double a, int b)` causes a compile-time ambiguity error when calling `test(5, 5)`.",
            "**Confusing Overloading with Overriding**: Overloading is multiple methods in the *same* class with *different* parameters. Overriding is redefining an *inherited* method in a *subclass* with the *identical* signature."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: The Null Overload Ambiguity Trap",
          traps: [
            {
              question: "What happens when compiling and running this code?\n```java\npublic class OverloadTrap {\n    public static void print(String s) { System.out.println(\"String\"); }\n    public static void print(Object o) { System.out.println(\"Object\"); }\n    public static void main(String[] args) {\n        print(null);\n    }\n}\n```",
              trap: "Thinking it throws a NullPointerException or causes a compile ambiguity error.",
              solution: "It prints **\"String\"**. When resolving `null`, the compiler chooses the **most specific type** in the inheritance hierarchy. Since `String` is a child subclass of `Object`, `String` is strictly more specific than `Object`. (Note: If another overload `print(Integer i)` were added, it would fail to compile because neither `String` nor `Integer` is a subtype of the other, causing an ambiguous method call error)."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Which of the following method pairs demonstrates INVALID method overloading in Java?",
          options: [
            "int process(int a) and int process(int a, int b)",
            "void process(int a) and int process(double a)",
            "int process(int a) and double process(int a)",
            "void process(String s, int n) and void process(int n, String s)"
          ],
          answer: 2,
          explanation: "`int process(int a)` and `double process(int a)` share the exact same parameter list and differ only in return type, which is strictly prohibited in Java."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Method overloading is compile-time polymorphism (static binding).",
            "Overloaded methods must differ in parameter count, parameter types, or parameter order.",
            "Return type alone cannot differentiate overloaded methods.",
            "Compiler resolution order: Exact Match &rarr; Widening &rarr; Autoboxing &rarr; Varargs."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Scope & Tracing, analyzing block scope, method local variables, shadowing, call stack frame lifecycles, and recursion bounds."
        }
      ]
    }
  },
  {
    slug: "scope-and-tracing",
    title: "Scope & Tracing",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `what-is-a-method`, `method-parameters`, block declarations `{ ... }`, and stack memory."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of Variable Scope as **Nested Security Clearance Zones & A Call Stack Elevator**:\n• **Block Scope `{ ... }`**: Variables declared inside a secure room (e.g. inside an `if` or `for` block) can only be seen while you are physically inside that room. The moment you step outside the door `}`, those variables evaporate.\n• **Method Scope**: When an elevator ascends to the 3rd floor (`methodB()`), the 1st floor (`main()`) is frozen and invisible. The 3rd floor cannot touch the 1st floor's local variables.\n• **Class / Static Scope**: The building lobby billboard (`static` fields). Visible to all rooms on every floor at all times."
        },
        {
          type: "callout",
          title: "The 4 Levels of Scope in Java",
          content: "1. **Block Scope**: Inside `{ ... }` (loops, if-else, local blocks). Exists from declaration to enclosing `}`.\n2. **Method Local Scope**: Parameters and variables inside a method body. Exists only during that method call.\n3. **Instance Scope (Fields)**: Non-static class variables attached to a specific Heap object instance.\n4. **Class / Static Scope**: `static` fields attached to the Class definition in Metaspace, shared across all instances."
        },
        {
          type: "code",
          title: "Scope Demonstration, Variable Shadowing & Call Stack Tracing",
          code: "public class ScopeAndTracingDemo {\n    static int globalCounter = 100; // Class/Static Scope\n\n    public static void methodB(int val) {\n        int localB = val * 2; // Method Scope\n        System.out.println(\"--> Inside methodB: localB = \" + localB + \", global = \" + globalCounter);\n    }\n\n    public static void methodA(int count) {\n        int localA = 50;\n        System.out.println(\"-> Entering methodA: localA = \" + localA);\n\n        // Block Scope\n        if (count > 0) {\n            int blockVar = 999; // Exists ONLY inside this if-block\n            System.out.println(\"   Inside block: blockVar = \" + blockVar);\n        }\n        // blockVar is DEAD here! System.out.println(blockVar) would fail to compile.\n\n        methodB(localA);\n        System.out.println(\"<- Exiting methodA\");\n    }\n\n    public static void main(String[] args) {\n        System.out.println(\"Starting main\");\n        methodA(5);\n        System.out.println(\"Finished main\");\n    }\n}",
          language: "java",
          explanation: "Notice how local variables localA and localB cannot be accessed across methods, while globalCounter is accessible anywhere."
        },
        {
          type: "table",
          title: "Scope Hierarchy & Lifetimes",
          headers: ["Scope Level", "Where Declared", "Visibility / Accessibility", "Lifetime in Memory"],
          rows: [
            ["Block Scope", "Inside `{}` (loops, `if`, arbitrary blocks)", "From declaration line to closing `}` of block", "While CPU is executing statements in that block"],
            ["Method Local Scope", "Inside method body or parameter list", "Only within the declaring method body", "While method stack frame is active on Call Stack"],
            ["Instance Field Scope", "Inside class, outside methods (non-static)", "Any instance method of that object (`this.field`)", "As long as the parent Object remains alive in Heap"],
            ["Class / Static Scope", "Inside class with `static` keyword", "Everywhere in class (and public across app)", "From class loading until JVM shutdown"]
          ]
        },
        {
          type: "tryIt",
          title: "Try It: Variable Shadowing Resolution",
          code: "class ShadowDemo {\n    static int x = 10; // Class scope\n    public static void main(String[] args) {\n        int x = 50; // Shadows class variable x\n        System.out.println(\"Local x: \" + x);\n        System.out.println(\"Class x: \" + ShadowDemo.x);\n    }\n}",
          expectedOutput: "Local x: 50\nClass x: 10",
          explanation: "Local variable x shadows class variable x. To access the shadowed class variable, prefix with ClassName.x."
        },
        {
          type: "dryRun",
          title: "Call Stack Execution Trace: `main()` -> `methodA()` -> `methodB()`",
          iterations: [
            { step: 1, variables: { "Stack Top": "[main frame]", "PC": "main() line 26" }, description: "main() allocates stack frame. Prints 'Starting main'. Calls methodA(5)." },
            { step: 2, variables: { "Stack Top": "[methodA frame]", "Stack Depth": "2", "localA": "50", "count": "5" }, description: "methodA frame pushed. Executes block scope, prints messages. Calls methodB(50)." },
            { step: 3, variables: { "Stack Top": "[methodB frame]", "Stack Depth": "3", "localB": "100", "val": "50" }, description: "methodB frame pushed. Executes, prints output, hits end of method." },
            { step: 4, variables: { "Stack Top": "[methodA frame]", "Stack Depth": "2" }, description: "methodB frame popped. Execution resumes in methodA after call site. Prints 'Exiting methodA'." },
            { step: 5, variables: { "Stack Top": "[main frame]", "Stack Depth": "1" }, description: "methodA frame popped. main() resumes, prints 'Finished main'." }
          ]
        },
        {
          type: "warning",
          title: "Common Scope & Tracing Errors",
          items: [
            "**Accessing Loop Variables After Loop**: Declaring `for (int i = 0; ...)` makes `i` local to the loop. Accessing `i` after the closing `}` is a compilation error.",
            "**Variable Shadowing Confusion**: Declaring a method parameter with the same name as a class field (`int count`) hides the field unless `this.count` or `ClassName.count` is used.",
            "**Dangling Local Variable References**: Trying to return a pointer to a stack-allocated variable (not possible in Java due to garbage-collected Heap objects, but a common mental misconception from C/C++)."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: StackOverflowError vs OutOfMemoryError",
          traps: [
            {
              question: "What is the fundamental architectural difference between a `StackOverflowError` and an `OutOfMemoryError` in the JVM?",
              trap: "Assuming both are caused by too many object allocations in Heap memory.",
              solution: "`StackOverflowError` occurs when the **JVM Thread Call Stack** runs out of memory frames (typically caused by infinite recursion or deeply nested method chains exceeding the `-Xss` thread stack limit). In contrast, `OutOfMemoryError` (`java.lang.OutOfMemoryError: Java heap space`) occurs when the **Heap memory** is exhausted because new objects cannot be allocated despite garbage collection cycles."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "What is the output of the following code snippet?\n```java\nint x = 10;\n{\n    int x = 20;\n    System.out.print(x);\n}\nSystem.out.print(x);\n```",
          options: [
            "2010",
            "1020",
            "2020",
            "Compile error (duplicate local variable x)"
          ],
          answer: 3,
          explanation: "In Java, you cannot declare a local variable with the same name inside a nested block if it already exists in the enclosing method scope. The compiler rejects `int x = 20;` with 'variable x is already defined'."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Block scope is delimited strictly by `{ ... }`.",
            "Method local variables exist on the thread's Call Stack and are destroyed when the method returns.",
            "Static variables live in Metaspace and persist across all method calls.",
            "Tracing code requires tracking the push and pop operations of JVM Stack Frames."
          ]
        },
        {
          type: "text",
          title: "Module Completion Summary",
          content: "🎉 **Congratulations! You have completed Module 9: Methods & Functions.** You have mastered method definitions, modular DRY principles, legal syntax and headers, 100% pass-by-value mechanics, return values, void procedures, compile-time method overloading, and multi-frame call stack scope tracing."
        }
      ]
    }
  }
];

