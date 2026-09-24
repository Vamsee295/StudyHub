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
      definition: "A method is a reusable block of code that performs a specific task. Methods organize code, enable reusability, and make programs easier to understand and maintain.",
      whyItMatters: "Methods are fundamental to structured programming. They eliminate code duplication, improve readability, and enable modular design.",
      coreConcept: "Methods have a name, parameters (inputs), a return type (output), and a body (code). They are defined once and called multiple times. Methods encapsulate functionality.",
      syntax: "returnType methodName(parameters) {\n    // method body\n    return value; // if not void\n}",
      javaExample: "// Method definition\npublic static int add(int a, int b) {\n    int sum = a + b;\n    return sum;\n}\n\n// Method call\nint result = add(5, 3);\nSystem.out.println(result);  // 8\n\n// Another example\npublic static void greet(String name) {\n    System.out.println(\"Hello, \" + name + \"!\");\n}\n\ngreet(\"Alice\");  // Hello, Alice!",
      howItWorks: "When called, execution jumps to method. Parameters receive values. Method executes its body. Return sends value back. Execution continues after the call.",
      realWorldUse: "Calculations, validations, data transformations, user interactions, utility functions, business logic separation.",
      commonMistakes: [
        "Forgetting return statement in non-void methods",
        "Not calling the method (defining but never using)",
        "Mismatching parameter types and arguments",
        "Returning value from void method"
      ],
      interviewQuestions: [
        { question: "What are the components of a method?", answer: "Return type, method name, parameter list (type and name pairs), method body, and optionally a return statement." },
        { question: "Why use methods instead of writing all code in main?", answer: "Methods enable code reuse, improve readability, make debugging easier, allow modular design, and separate concerns." }
      ],
      quickRevision: "Method = reusable code block. Has name, parameters, return type, body. Define once, call multiple times.",
      practicePrompt: "Write a method that takes a name and prints a personalized greeting. Call it twice with different names.",
      quickCheck: {
        question: "What is the purpose of a method in Java?",
        options: [
          "To store data",
          "To define a reusable block of code",
          "To create objects",
          "To import libraries"
        ],
        answer: 1,
        explanation: "Methods are reusable blocks of code that perform specific tasks, enabling code organization and reuse."
      }
    }
  },
  {
    slug: "why-use-methods",
    title: "Why Use Methods?",
    content: {
      definition: "Methods provide code reusability, modularity, abstraction, and better organization. They follow the DRY principle (Don't Repeat Yourself) and enable easier maintenance.",
      whyItMatters: "Well-designed methods make code easier to write, read, test, debug, and maintain. They are essential for any non-trivial program.",
      coreConcept: "Benefits: 1) Reusability (write once, use many times), 2) Modularity (divide problem into smaller parts), 3) Abstraction (hide complexity), 4) Readability (meaningful names), 5) Maintainability (change in one place).",
      syntax: "// Bad: Repeated code\nSystem.out.println(\"Processing...\");\n// ... code ...\nSystem.out.println(\"Processing...\");\n// ... code ...\n\n// Good: Reusable method\nvoid showProgress() {\n    System.out.println(\"Processing...\");\n}\nshowProgress();",
      javaExample: "// Problem: Calculate area of rectangles multiple times\n// Without method (bad)\nint length1 = 5, width1 = 3;\nint area1 = length1 * width1;\nSystem.out.println(\"Area: \" + area1);\n\nint length2 = 7, width2 = 4;\nint area2 = length2 * width2;\nSystem.out.println(\"Area: \" + area2);\n\n// With method (good)\npublic static int calculateArea(int length, int width) {\n    return length * width;\n}\n\nSystem.out.println(\"Area: \" + calculateArea(5, 3));\nSystem.out.println(\"Area: \" + calculateArea(7, 4));",
      howItWorks: "Instead of duplicating logic, define once in a method. Call with different inputs. Changes apply everywhere. Logic is tested once.",
      realWorldUse: "Validation functions, calculations, formatting, data processing, API calls, database operations, utility functions.",
      commonMistakes: [
        "Methods that do too many things (should be focused)",
        "Copying code instead of creating reusable methods",
        "Poor method names that don't describe functionality",
        "Not breaking down complex problems into smaller methods"
      ],
      interviewQuestions: [
        { question: "What is the DRY principle?", answer: "Don't Repeat Yourself. Avoid duplicating code. Extract common logic into reusable methods." },
        { question: "How do methods improve code maintainability?", answer: "Changes are made in one place. Testing is focused. Side effects are contained. Code is easier to understand and modify." }
      ],
      quickRevision: "Methods = reusability, modularity, abstraction, readability, maintainability. Follow DRY principle.",
      practicePrompt: "Identify repeated code in your programs and extract it into a reusable method.",
      quickCheck: {
        question: "Which is NOT a benefit of using methods?",
        options: [
          "Code reusability",
          "Better modularity",
          "Faster execution",
          "Easier maintenance"
        ],
        answer: 2,
        explanation: "Methods may have slight overhead but the benefits (reusability, modularity, maintainability) far outweigh any minor performance differences."
      }
    }
  },
  {
    slug: "method-syntax",
    title: "Method Syntax",
    content: {
      definition: "Method syntax defines the structure: access modifier, static (optional), return type, method name, parameters in parentheses, and body in braces. Every part serves a purpose.",
      whyItMatters: "Correct syntax is essential for defining methods. Understanding each component helps you design effective methods.",
      coreConcept: "Components: 1) Access modifier (public, private, etc.), 2) static (class method) or not, 3) Return type (void, int, String, etc.), 4) Method name (camelCase), 5) Parameters (type name pairs), 6) Method body in { }.",
      syntax: "accessModifier static returnType methodName(type1 param1, type2 param2) {\n    // method body\n    return value; // if not void\n}",
      javaExample: "// Complete method syntax\npublic static int multiply(int a, int b) {\n    return a * b;\n}\n\n// Method without parameters\npublic static void sayHello() {\n    System.out.println(\"Hello!\");\n}\n\n// Method with no return (void)\npublic static void printSum(int a, int b) {\n    System.out.println(a + b);\n}\n\n// Method returning object\npublic static String createGreeting(String name) {\n    return \"Hello, \" + name + \"!\";\n}",
      howItWorks: "Access modifier controls visibility. static makes it belong to class (no object needed). Return type specifies what method returns. Name identifies the method. Parameters pass data in. Body contains the logic.",
      realWorldUse: "All Java programs use methods. main() is the starting point. Your own methods organize program logic.",
      commonMistakes: [
        "Forgetting return type (must always specify, even void)",
        "Using wrong naming convention (methods should be camelCase)",
        "Missing parentheses even when no parameters",
        "Placing parameters inside braces instead of parentheses"
      ],
      interviewQuestions: [
        { question: "What does 'void' mean as a return type?", answer: "void means the method does not return any value. It performs an action but doesn't produce a result to use." },
        { question: "Why do we use camelCase for method names?", answer: "Java convention. Methods start with lowercase letter, each subsequent word capitalized. Examples: calculateArea, getUserName, isValid." }
      ],
      quickRevision: "Syntax: modifier static returnType name(params) { body }. void = no return. camelCase for names.",
      practicePrompt: "Write a method signature for: public, static, returns double, named 'calculateAverage', takes two int parameters.",
      quickCheck: {
        question: "What is wrong with: int add(int a, b) { return a + b; }",
        options: [
          "Missing return type",
          "Parameter b needs a type",
          "Missing parentheses",
          "Missing braces"
        ],
        answer: 1,
        explanation: "Each parameter must have its own type. Correct: int add(int a, int b) { return a + b; }"
      }
    }
  },
  {
    slug: "method-parameters",
    title: "Method Parameters",
    content: {
      definition: "Parameters are variables declared in the method signature that receive values when the method is called. They allow methods to work with different data each time.",
      whyItMatters: "Parameters make methods flexible and reusable. Different inputs produce different outputs without changing the method code.",
      coreConcept: "Parameters are declared in method signature. Each parameter has a type and name. Arguments are the actual values passed when calling. Java uses pass-by-value (copies are passed).",
      syntax: "returnType methodName(type1 param1, type2 param2) {\n    // use param1, param2\n}\n\n// Call with arguments\nmethodName(value1, value2);",
      javaExample: "// Multiple parameters\npublic static int add(int a, int b) {\n    return a + b;\n}\n\nint sum = add(5, 3);  // a=5, b=3\n\n// String parameter\npublic static void greet(String name, int age) {\n    System.out.println(name + \" is \" + age + \" years old\");\n}\n\ngreet(\"Alice\", 25);  // Alice is 25 years old\n\n// Pass-by-value demonstration\npublic static void tryChange(int x) {\n    x = 100;  // Only changes local copy\n}\n\nint num = 5;\ntryChange(num);\nSystem.out.println(num);  // Still 5",
      howItWorks: "When called, arguments are copied to parameters (pass-by-value). Method works with copies. Changes to primitive parameters don't affect original. Reference parameters still point to same object.",
      realWorldUse: "Calculator functions, data processing, validation methods, formatting functions, any method that needs input data.",
      commonMistakes: [
        "Thinking parameters modify original primitive values",
        "Mismatching parameter types and argument types",
        "Wrong number of arguments",
        "Confusing parameter names with variables outside method"
      ],
      interviewQuestions: [
        { question: "What is the difference between parameter and argument?", answer: "Parameter is the variable in the method declaration. Argument is the actual value passed when calling the method." },
        { question: "Does Java pass parameters by reference or by value?", answer: "Java always passes by value. Primitive values are copied. References are copied (not the object), so the reference points to the same object." }
      ],
      quickRevision: "Parameters = method inputs. Declared with type and name. Arguments = actual values passed. Java = pass-by-value.",
      practicePrompt: "Write a method that takes a String and an int, then prints the String int times.",
      quickCheck: {
        question: "How many parameters does this method have?\nvoid process(int a, String b, double c)",
        options: ["1", "2", "3", "4"],
        answer: 2,
        explanation: "Three parameters: int a, String b, double c. Each type-name pair is one parameter."
      }
    }
  },
  {
    slug: "return-values",
    title: "Return Values",
    content: {
      definition: "The return statement sends a value back to the caller. The return type in the method signature declares what type of value will be returned.",
      whyItMatters: "Return values allow methods to produce results that can be used by the calling code. This enables calculations, data retrieval, and result passing.",
      coreConcept: "Non-void methods must return a value matching the return type. return exits the method immediately. A method can have multiple return statements (but only one executes). void methods can use return; to exit early.",
      syntax: "returnType methodName(params) {\n    // ... code ...\n    return value;  // type must match returnType\n}",
      javaExample: "// Return a value\npublic static int square(int n) {\n    return n * n;\n}\n\nint result = square(5);  // result = 25\n\n// Multiple return statements\npublic static int max(int a, int b) {\n    if (a > b) {\n        return a;\n    }\n    return b;\n}\n\n// Early return for validation\npublic static double divide(double a, double b) {\n    if (b == 0) {\n        System.out.println(\"Cannot divide by zero\");\n        return 0;  // Early exit\n    }\n    return a / b;\n}\n\n// Return object\npublic static String formatName(String first, String last) {\n    return first + \" \" + last;\n}",
      howItWorks: "return statement immediately exits the method and sends the value back to the caller. The returned value can be stored, printed, or used in expressions.",
      realWorldUse: "Calculations, data retrieval, validation results, status codes, transforming data, factory methods.",
      commonMistakes: [
        "Forgetting return statement in non-void method",
        "Returning wrong type than declared",
        "Code after return statement (unreachable)",
        "Not storing or using the returned value"
      ],
      interviewQuestions: [
        { question: "What happens when a return statement executes?", answer: "The method immediately exits and control returns to the caller. Any code after return in the method is not executed (unreachable)." },
        { question: "Can a void method have a return statement?", answer: "Yes, but only 'return;' with no value. This is used to exit the method early based on some condition." }
      ],
      quickRevision: "return sends value back. Must match declared type. Method exits immediately. Non-void methods must have return.",
      practicePrompt: "Write a method that returns the larger of two numbers. Call it and print the result.",
      quickCheck: {
        question: "What is wrong with this method?\nint getValue() {\n    System.out.println(\"Getting value\");\n}",
        options: [
          "Missing static keyword",
          "Missing return statement",
          "Wrong return type",
          "No parameters"
        ],
        answer: 1,
        explanation: "Non-void method must return a value. Add: return value; before the closing brace."
      }
    }
  },
  {
    slug: "void-methods",
    title: "void Methods",
    content: {
      definition: "void methods perform actions but do not return a value. They are used for operations like printing, modifying data, writing to files, or any task that doesn't need to produce a result.",
      whyItMatters: "Not every method needs to return a value. void methods are appropriate for actions, output, and side-effect operations.",
      coreConcept: "void means 'no return type'. Method performs action but doesn't produce a value. Cannot assign void method call to a variable. Can use return; to exit early (without value).",
      syntax: "void methodName(parameters) {\n    // perform action\n    // no return statement needed (or just return;)\n}",
      javaExample: "// void method - prints output\npublic static void printSum(int a, int b) {\n    System.out.println(\"Sum: \" + (a + b));\n}\n\nprintSum(5, 3);  // Sum: 8\n\n// void method with early exit\npublic static void printPositive(int n) {\n    if (n < 0) {\n        System.out.println(\"Negative number\");\n        return;  // Exit early\n    }\n    System.out.println(\"Positive: \" + n);\n}\n\n// Cannot do this:\n// int result = printSum(5, 3);  // ERROR!\n\n// void method that modifies array\npublic static void doubleAll(int[] arr) {\n    for (int i = 0; i < arr.length; i++) {\n        arr[i] *= 2;\n    }\n}",
      howItWorks: "void methods execute their code and finish. No value is sent back to caller. Called for their side effects (printing, modifying, writing, etc.).",
      realWorldUse: "Printing output, logging, modifying objects, writing to files, updating databases, user interface updates.",
      commonMistakes: [
        "Trying to assign void method result to variable",
        "Returning a value from void method",
        "Using void when a return value would be useful",
        "Forgetting that void methods still need parentheses when called"
      ],
      interviewQuestions: [
        { question: "When should you use void vs a return type?", answer: "Use void when the method performs an action and doesn't need to send back a result. Use a return type when the method calculates or retrieves a value that the caller needs." },
        { question: "Can void methods have return statements?", answer: "Yes, but only 'return;' without a value. This exits the method early. It's optional at the end of the method." }
      ],
      quickRevision: "void = no return value. Used for actions/output. Cannot assign to variable. Can use return; to exit early.",
      practicePrompt: "Write a void method that prints a countdown from n to 1.",
      quickCheck: {
        question: "What happens if you try: int x = printHello(); where printHello is void?",
        options: [
          "x gets value 0",
          "x gets value null",
          "Compile error",
          "Runtime error"
        ],
        answer: 2,
        explanation: "Compile error. void methods don't return a value, so you cannot assign the result to a variable."
      }
    }
  },
  {
    slug: "method-overloading-basics",
    title: "Method Overloading Basics",
    content: {
      definition: "Method overloading allows multiple methods with the same name but different parameter lists. The compiler determines which version to call based on the arguments.",
      whyItMatters: "Overloading provides flexibility and cleaner APIs. Same operation can work with different input types or numbers of parameters.",
      coreConcept: "Same method name, different parameter list (number, type, or order of parameters). Return type alone cannot distinguish overloaded methods. Compiler chooses the best match.",
      syntax: "// Overloaded methods\nreturnType methodName(type1 param) { }\nreturnType methodName(type1 param1, type2 param2) { }\nreturnType methodName(type2 param) { }",
      javaExample: "// Overloaded add methods\npublic static int add(int a, int b) {\n    return a + b;\n}\n\npublic static int add(int a, int b, int c) {\n    return a + b + c;\n}\n\npublic static double add(double a, double b) {\n    return a + b;\n}\n\n// Calls\nSystem.out.println(add(5, 3));        // int version\nSystem.out.println(add(5, 3, 2));      // 3-param version\nSystem.out.println(add(5.5, 3.2));     // double version\n\n// Overloaded print\npublic static void display(int n) {\n    System.out.println(\"Integer: \" + n);\n}\n\npublic static void display(String s) {\n    System.out.println(\"String: \" + s);\n}\n\ndisplay(42);      // Integer: 42\ndisplay(\"Hello\"); // String: Hello",
      howItWorks: "Compiler looks at method name and parameter types (signature). Finds the best match. If no exact match, tries widening conversion. Error if ambiguous or no match.",
      realWorldUse: "Utility methods that work with multiple types, constructors with different initializations, flexible APIs, default parameter alternatives.",
      commonMistakes: [
        "Thinking return type differentiates overloaded methods (it doesn't)",
        "Creating ambiguous overloads where compiler can't decide",
        "Overloading when different names would be clearer",
        "Not considering autoboxing/unboxing in overload resolution"
      ],
      interviewQuestions: [
        { question: "What makes two methods overloaded?", answer: "Same name but different parameter lists (different number of parameters, different types, or different order of types)." },
        { question: "Can you overload methods by just changing the return type?", answer: "No. Return type is not part of the method signature for overloading. Parameter list must differ." }
      ],
      quickRevision: "Overloading = same name, different parameters. Return type doesn't count. Compiler picks best match.",
      practicePrompt: "Create two overloaded methods named 'multiply' - one that takes two ints and one that takes three ints.",
      quickCheck: {
        question: "Which pair is valid method overloading?",
        options: [
          "int calc(int a) and void calc(int a)",
          "int calc(int a) and int calc(double a)",
          "int calc(int a) and int calc(int b)",
          "void calc(int a) and void process(int a)"
        ],
        answer: 1,
        explanation: "Different parameter types (int vs double) make it valid overloading. Option 1 differs only by return type (invalid). Option 2 has same signature. Option 3 has different names (not overloading)."
      }
    }
  },
  {
    slug: "scope-and-tracing",
    title: "Scope & Tracing",
    content: {
      definition: "Scope defines where a variable is accessible. Method scope means variables declared inside a method exist only within that method. Tracing is following execution through method calls.",
      whyItMatters: "Understanding scope prevents bugs related to variable access. Tracing helps debug complex method interactions.",
      coreConcept: "Variables declared in method are local to that method. Cannot access outside. Parameters are also local variables. Each method call creates new scope. Tracing uses stack frames to track calls.",
      syntax: "public static void method1() {\n    int x = 10;  // local to method1\n    // x accessible here\n}\n\npublic static void method2() {\n    // x not accessible here - different scope\n    int y = 20;  // local to method2\n}",
      javaExample: "public class ScopeExample {\n    static int global = 100;  // class-level scope\n    \n    public static void method1() {\n        int local1 = 10;  // method1 scope\n        System.out.println(local1);  // OK\n        System.out.println(global);  // OK\n    }\n    \n    public static void method2() {\n        int local2 = 20;  // method2 scope\n        // local1 not accessible here - ERROR\n        System.out.println(local2);  // OK\n        System.out.println(global);  // OK\n    }\n    \n    public static void main(String[] args) {\n        int x = 5;\n        method1();\n        method2();\n        // local1, local2 not accessible here\n    }\n}\n\n// Tracing example\npublic static void methodA() {\n    System.out.println(\"A start\");\n    methodB();\n    System.out.println(\"A end\");\n}\n\npublic static void methodB() {\n    System.out.println(\"B start\");\n    System.out.println(\"B end\");\n}\n\n// Call: methodA();\n// Output: A start, B start, B end, A end",
      howItWorks: "Each method call creates a stack frame with its local variables. When method finishes, frame is removed. Tracing follows the call stack: who called whom, in what order.",
      realWorldUse: "Debugging, understanding program flow, preventing variable naming conflicts, managing memory efficiently.",
      commonMistakes: [
        "Trying to access local variables from other methods",
        "Naming local variables same as class variables (shadowing)",
        "Not understanding that parameters are local variables",
        "Confusing scope with lifetime (scope is about access, lifetime is about existence)"
      ],
      interviewQuestions: [
        { question: "What is the scope of a method parameter?", answer: "The entire method body. Parameters are local variables initialized with the argument values." },
        { question: "What is shadowing?", answer: "When a local variable has the same name as a class-level variable. The local variable 'shadows' the class variable within its scope." }
      ],
      quickRevision: "Local variables exist only in their method. Parameters are local too. Tracing follows the call stack.",
      practicePrompt: "Trace the output of three methods calling each other: main → methodA → methodB.",
      quickCheck: {
        question: "Where can you access a variable declared inside a method?",
        options: [
          "Anywhere in the class",
          "Only within that method",
          "In all methods called after it",
          "In the main method only"
        ],
        answer: 1,
        explanation: "Variables declared inside a method have local scope and can only be accessed within that method."
      }
    }
  }
];
