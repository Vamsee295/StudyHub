export type PfItemType = "lesson" | "exercise";
export type PfDifficulty = "easy" | "medium" | "hard";

export interface PfLesson {
  id: string;
  moduleId: string;
  moduleNum: string;
  order: number;
  type: "lesson";
  title: string;
  category: string;
  whyItMatters: string;
  learningPoints: string[];
  javaConcept: string;
  complexity: { time: string; space: string } | null;
  commonMistakes: string[];
  relatedExerciseIds: string[];
}

export interface PfExercise {
  id: string;
  moduleId: string;
  moduleNum: string;
  order: number;
  type: "exercise";
  title: string;
  category: string;
  difficulty: PfDifficulty;
  whyThisProblem: string;
  practiceSkills: string[];
  complexity: { time: string; space: string };
  hint: string;
  tags: string[];
}

export type PfItem = PfLesson | PfExercise;

export interface PfModule {
  id: string;
  numberStr: string;
  title: string;
  description: string;
  items: PfItem[];
}

export const pfModules: PfModule[] = [
  {
    id: "pf-01",
    numberStr: "01",
    title: "Programming Basics",
    description: "Understand the foundational concepts of programming languages, compilation, and basic data storage.",
    items: [
      {
        id: "pf-l-01-01",
        moduleId: "pf-01",
        moduleNum: "01",
        order: 1,
        type: "lesson",
        title: "What is Programming?",
        category: "PROGRAMMING BASICS",
        whyItMatters: "Before writing code, you need to understand how we communicate with computers.",
        learningPoints: ["Instructions as code", "High-level vs Low-level languages", "Syntax vs Semantics"],
        javaConcept: "// Java code is a set of instructions\nSystem.out.println(\"Hello\");",
        complexity: null,
        commonMistakes: ["Confusing syntax errors with logic errors"],
        relatedExerciseIds: []
      },
      {
        id: "pf-l-01-02",
        moduleId: "pf-01",
        moduleNum: "01",
        order: 2,
        type: "lesson",
        title: "Compiler vs Interpreter",
        category: "PROGRAMMING BASICS",
        whyItMatters: "Java uses both a compiler (javac) and an interpreter (JVM), which makes it platform-independent.",
        learningPoints: ["Source code compilation", "Bytecode", "JVM execution"],
        javaConcept: "Source Code (.java) -> Compiler -> Bytecode (.class) -> JVM -> Machine Code",
        complexity: null,
        commonMistakes: ["Thinking Java compiles directly to machine code like C++"],
        relatedExerciseIds: []
      },
      {
        id: "pf-l-01-03",
        moduleId: "pf-01",
        moduleNum: "01",
        order: 3,
        type: "lesson",
        title: "Variables and Data Types",
        category: "PROGRAMMING BASICS",
        whyItMatters: "Variables are how we store and track data in our programs.",
        learningPoints: ["Declaration vs Initialization", "Primitive types (int, double, char, boolean)", "Strong typing"],
        javaConcept: "int age = 21;\ndouble price = 19.99;\nchar grade = 'A';\nboolean isPassed = true;",
        complexity: null,
        commonMistakes: ["Forgetting to initialize a variable before using it", "Assigning the wrong type to a variable"],
        relatedExerciseIds: ["pf-e-01-01"]
      },
      {
        id: "pf-e-01-01",
        moduleId: "pf-01",
        moduleNum: "01",
        order: 4,
        type: "exercise",
        title: "Hello World & Variables",
        category: "JAVA · BASICS",
        difficulty: "easy",
        whyThisProblem: "Tests basic syntax, variable declaration, and printing to the console.",
        practiceSkills: ["Variable Declaration", "Basic Output", "Syntax formatting"],
        complexity: { time: "O(1)", space: "O(1)" },
        hint: "Use System.out.println() to print and declare an int variable for a number.",
        tags: ["Basics"]
      }
    ]
  },
  {
    id: "pf-02",
    numberStr: "02",
    title: "Input / Output",
    description: "Learn how to read data from the user and format output effectively.",
    items: [
      {
        id: "pf-l-02-01",
        moduleId: "pf-02",
        moduleNum: "02",
        order: 1,
        type: "lesson",
        title: "Standard Input (Scanner)",
        category: "INPUT / OUTPUT",
        whyItMatters: "Reading user input is fundamental for dynamic programs and coding assessments.",
        learningPoints: ["Importing Scanner", "Reading integers, doubles, and strings", "Closing the scanner"],
        javaConcept: "Scanner sc = new Scanner(System.in);\nint num = sc.nextInt();",
        complexity: null,
        commonMistakes: ["Leaving the newline character in the buffer when mixing nextInt() and nextLine()"],
        relatedExerciseIds: ["pf-e-02-01"]
      },
      {
        id: "pf-e-02-01",
        moduleId: "pf-02",
        moduleNum: "02",
        order: 2,
        type: "exercise",
        title: "Sum of Two Numbers",
        category: "JAVA · I/O",
        difficulty: "easy",
        whyThisProblem: "Tests basic input, arithmetic operations, and output.",
        practiceSkills: ["Input handling", "Variables", "Arithmetic operators", "Output formatting"],
        complexity: { time: "O(1)", space: "O(1)" },
        hint: "Read two integers using Scanner, add them, and print the result.",
        tags: ["I/O", "Math"]
      }
    ]
  },
  {
    id: "pf-03",
    numberStr: "03",
    title: "Control Flow",
    description: "Master conditional statements and loops to control program execution.",
    items: [
      {
        id: "pf-l-03-01",
        moduleId: "pf-03",
        moduleNum: "03",
        order: 1,
        type: "lesson",
        title: "If-Else Conditions",
        category: "CONTROL FLOW",
        whyItMatters: "Conditionals allow your code to make decisions based on dynamic values.",
        learningPoints: ["Boolean expressions", "if, else if, else", "Logical operators (&&, ||, !)"],
        javaConcept: "if (age >= 18) {\n  print(\"Adult\");\n} else {\n  print(\"Minor\");\n}",
        complexity: null,
        commonMistakes: ["Using = instead of == for comparison", "Missing curly braces causing unexpected grouping"],
        relatedExerciseIds: ["pf-e-03-01"]
      },
      {
        id: "pf-e-03-01",
        moduleId: "pf-03",
        moduleNum: "03",
        order: 2,
        type: "exercise",
        title: "Even or Odd",
        category: "JAVA · CONTROL FLOW",
        difficulty: "easy",
        whyThisProblem: "A classic application of the modulo operator combined with branching logic.",
        practiceSkills: ["Modulo Operator", "If-Else", "Conditionals"],
        complexity: { time: "O(1)", space: "O(1)" },
        hint: "Use n % 2 == 0 to check if a number is even.",
        tags: ["Conditionals", "Math"]
      },
      {
        id: "pf-l-03-02",
        moduleId: "pf-03",
        moduleNum: "03",
        order: 3,
        type: "lesson",
        title: "For & While Loops",
        category: "CONTROL FLOW",
        whyItMatters: "Loops are essential for executing repetitive tasks efficiently.",
        learningPoints: ["for loop syntax", "while loop syntax", "Loop condition evaluation", "break and continue"],
        javaConcept: "for (int i = 0; i < 5; i++) {\n  print(i);\n}\n\nwhile (x > 0) {\n  x--;\n}",
        complexity: null,
        commonMistakes: ["Infinite loops due to missing update statements", "Off-by-one errors (using <= instead of <)"],
        relatedExerciseIds: ["pf-e-03-02"]
      },
      {
        id: "pf-e-03-02",
        moduleId: "pf-03",
        moduleNum: "03",
        order: 4,
        type: "exercise",
        title: "Multiplication Table",
        category: "JAVA · LOOPS",
        difficulty: "easy",
        whyThisProblem: "Builds fluency in writing basic loops and formatting iterative output.",
        practiceSkills: ["For Loop", "Iteration", "String formatting"],
        complexity: { time: "O(N)", space: "O(1)" },
        hint: "Use a loop from 1 to 10 and multiply the input number by the loop counter.",
        tags: ["Loops"]
      }
    ]
  },
  {
    id: "pf-04",
    numberStr: "04",
    title: "Functions & Methods",
    description: "Learn to write reusable, modular code blocks with parameters and return values.",
    items: [
      {
        id: "pf-l-04-01",
        moduleId: "pf-04",
        moduleNum: "04",
        order: 1,
        type: "lesson",
        title: "Method Declaration & Scope",
        category: "FUNCTIONS",
        whyItMatters: "Methods organize code into reusable pieces, reducing duplication and improving readability.",
        learningPoints: ["Method signatures", "Return types", "Parameters vs Arguments", "Variable scope"],
        javaConcept: "public static int add(int a, int b) {\n  return a + b;\n}",
        complexity: null,
        commonMistakes: ["Forgetting to return a value in non-void methods", "Accessing local variables outside their scope"],
        relatedExerciseIds: ["pf-e-04-01"]
      },
      {
        id: "pf-e-04-01",
        moduleId: "pf-04",
        moduleNum: "04",
        order: 2,
        type: "exercise",
        title: "Factorial Method",
        category: "JAVA · FUNCTIONS",
        difficulty: "easy",
        whyThisProblem: "Requires encapsulating logic inside a method with a specific return type.",
        practiceSkills: ["Method writing", "Returning values", "Iterative accumulation"],
        complexity: { time: "O(N)", space: "O(1)" },
        hint: "Initialize a product variable to 1, then loop from 1 to N, multiplying the product.",
        tags: ["Functions", "Math"]
      }
    ]
  },
  {
    id: "pf-05",
    numberStr: "05",
    title: "Arrays & Strings",
    description: "Store and manipulate collections of data and text.",
    items: [
      {
        id: "pf-l-05-01",
        moduleId: "pf-05",
        moduleNum: "05",
        order: 1,
        type: "lesson",
        title: "Array Declaration & Traversal",
        category: "ARRAYS",
        whyItMatters: "Arrays are the most fundamental data structure for storing continuous collections.",
        learningPoints: ["Zero-based indexing", "Fixed size", "Iteration with loops", "Enhanced for loop"],
        javaConcept: "int[] arr = new int[5];\narr[0] = 10;\nfor (int num : arr) {\n  print(num);\n}",
        complexity: { time: "O(N)", space: "O(N)" },
        commonMistakes: ["ArrayIndexOutOfBoundsException", "Assuming arrays resize automatically"],
        relatedExerciseIds: ["pf-e-05-01", "pf-e-05-02"]
      },
      {
        id: "pf-e-05-01",
        moduleId: "pf-05",
        moduleNum: "05",
        order: 2,
        type: "exercise",
        title: "Array Sum",
        category: "JAVA · ARRAYS",
        difficulty: "easy",
        whyThisProblem: "The most basic pattern of accumulating values from a collection.",
        practiceSkills: ["Array Traversal", "Accumulation"],
        complexity: { time: "O(N)", space: "O(1)" },
        hint: "Create a sum variable set to 0. Loop through the array and add each element.",
        tags: ["Arrays"]
      },
      {
        id: "pf-l-05-02",
        moduleId: "pf-05",
        moduleNum: "05",
        order: 3,
        type: "lesson",
        title: "String Operations",
        category: "STRINGS",
        whyItMatters: "Text processing is required in almost every software application.",
        learningPoints: ["Immutability", "Length and charAt", "Substring", "String comparison"],
        javaConcept: "String s = \"Hello\";\nchar c = s.charAt(0);\nboolean eq = s.equals(\"World\");",
        complexity: null,
        commonMistakes: ["Using == to compare string contents instead of .equals()"],
        relatedExerciseIds: ["pf-e-05-03"]
      },
      {
        id: "pf-e-05-03",
        moduleId: "pf-05",
        moduleNum: "05",
        order: 4,
        type: "exercise",
        title: "Reverse a String",
        category: "JAVA · STRINGS",
        difficulty: "easy",
        whyThisProblem: "Teaches string traversal in reverse and character accumulation.",
        practiceSkills: ["String Traversal", "Concatenation"],
        complexity: { time: "O(N)", space: "O(N)" },
        hint: "Loop backwards from s.length() - 1 down to 0, appending characters to a new string.",
        tags: ["Strings"]
      }
    ]
  },
  {
    id: "pf-06",
    numberStr: "06",
    title: "Algorithmic Thinking",
    description: "Learn to break down problems, trace variables, and analyze efficiency.",
    items: [
      {
        id: "pf-l-06-01",
        moduleId: "pf-06",
        moduleNum: "06",
        order: 1,
        type: "lesson",
        title: "Time & Space Complexity",
        category: "ALGORITHMIC THINKING",
        whyItMatters: "Understanding efficiency is the core of coding interviews and scalable software.",
        learningPoints: ["Big-O notation", "Time Complexity", "Space Complexity", "Constant vs Linear vs Quadratic"],
        javaConcept: "O(1) - Constant\nO(N) - Linear\nO(N^2) - Quadratic\nO(log N) - Logarithmic",
        complexity: null,
        commonMistakes: ["Confusing Space complexity with the input size", "Ignoring nested loop complexity"],
        relatedExerciseIds: []
      },
      {
        id: "pf-l-06-02",
        moduleId: "pf-06",
        moduleNum: "06",
        order: 2,
        type: "lesson",
        title: "Dry Runs & Tracing",
        category: "ALGORITHMIC THINKING",
        whyItMatters: "Dry running code manually is essential for debugging and predicting output without a compiler.",
        learningPoints: ["Variable tracking", "State tables", "Edge case identification"],
        javaConcept: "Use paper or comments to track: i=0, sum=0 -> i=1, sum=1 -> i=2, sum=3",
        complexity: null,
        commonMistakes: ["Skipping steps during manual tracing and making assumptions"],
        relatedExerciseIds: ["pf-e-06-01"]
      },
      {
        id: "pf-e-06-01",
        moduleId: "pf-06",
        moduleNum: "06",
        order: 3,
        type: "exercise",
        title: "Reverse a Number",
        category: "NUMBER LOGIC",
        difficulty: "easy",
        whyThisProblem: "Builds understanding of digit extraction, integer division, modulo operations, and iterative reasoning.",
        practiceSkills: ["Modulo", "Integer Division", "Loops", "Edge Cases"],
        complexity: { time: "O(log N)", space: "O(1)" },
        hint: "Think about how % 10 can extract the last digit, and / 10 removes it.",
        tags: ["Math", "Loops"]
      }
    ]
  },
  {
    id: "pf-07",
    numberStr: "07",
    title: "Error Handling & Debugging",
    description: "Learn to handle exceptions gracefully and find bugs systematically.",
    items: [
      {
        id: "pf-l-07-01",
        moduleId: "pf-07",
        moduleNum: "07",
        order: 1,
        type: "lesson",
        title: "Exceptions & Try-Catch",
        category: "ERROR HANDLING",
        whyItMatters: "Programs shouldn't crash when they encounter unexpected input. Graceful degradation is a professional standard.",
        learningPoints: ["Checked vs Unchecked Exceptions", "try-catch blocks", "finally block", "Throwing exceptions"],
        javaConcept: "try {\n  int x = 10 / 0;\n} catch (ArithmeticException e) {\n  print(\"Cannot divide by zero\");\n} finally {\n  print(\"Done\");\n}",
        complexity: null,
        commonMistakes: ["Catching generic Exception instead of specific ones", "Empty catch blocks (swallowing exceptions)"],
        relatedExerciseIds: ["pf-e-07-01"]
      },
      {
        id: "pf-e-07-01",
        moduleId: "pf-07",
        moduleNum: "07",
        order: 2,
        type: "exercise",
        title: "Safe Integer Parsing",
        category: "JAVA · EXCEPTIONS",
        difficulty: "easy",
        whyThisProblem: "Tests ability to use try-catch to handle invalid string inputs.",
        practiceSkills: ["Try-Catch", "Integer.parseInt", "Error recovery"],
        complexity: { time: "O(N)", space: "O(1)" },
        hint: "Wrap Integer.parseInt() in a try block and catch NumberFormatException.",
        tags: ["Exceptions", "Strings"]
      }
    ]
  },
  {
    id: "pf-08",
    numberStr: "08",
    title: "Files & Program Design",
    description: "Read from and write to files, and learn modular programming principles.",
    items: [
      {
        id: "pf-l-08-01",
        moduleId: "pf-08",
        moduleNum: "08",
        order: 1,
        type: "lesson",
        title: "File Reading",
        category: "FILES",
        whyItMatters: "Most real-world data lives in files or databases, not hardcoded in the source.",
        learningPoints: ["File object", "Scanner for files", "BufferedReader", "Handling IOExceptions"],
        javaConcept: "File f = new File(\"data.txt\");\nScanner sc = new Scanner(f);\nwhile (sc.hasNextLine()) {\n  print(sc.nextLine());\n}",
        complexity: null,
        commonMistakes: ["Forgetting to close the file/stream, leading to memory leaks"],
        relatedExerciseIds: []
      }
    ]
  },
  {
    id: "pf-09",
    numberStr: "09",
    title: "Memory & References",
    description: "Understand how Java manages memory and variables under the hood.",
    items: [
      {
        id: "pf-l-09-01",
        moduleId: "pf-09",
        moduleNum: "09",
        order: 1,
        type: "lesson",
        title: "Stack vs Heap",
        category: "MEMORY",
        whyItMatters: "Understanding memory prevents NullPointerExceptions and helps optimize object creation.",
        learningPoints: ["Stack (Primitives & references)", "Heap (Objects & Arrays)", "Pass by Value (Reference semantics)"],
        javaConcept: "int x = 5; // Stack\nint[] arr = new int[5]; // arr reference on Stack, array on Heap",
        complexity: null,
        commonMistakes: ["Thinking Java passes objects by reference (it passes references by value)"],
        relatedExerciseIds: []
      }
    ]
  },
  {
    id: "pf-10",
    numberStr: "10",
    title: "Coding Practice",
    description: "Apply your foundational knowledge to solve classic programming challenges.",
    items: [
      {
        id: "pf-e-10-01",
        moduleId: "pf-10",
        moduleNum: "10",
        order: 1,
        type: "exercise",
        title: "Fibonacci Sequence",
        category: "JAVA · PRACTICE",
        difficulty: "medium",
        whyThisProblem: "A classic pattern that teaches sequence generation and multiple state variables.",
        practiceSkills: ["Loops", "Variable swapping", "Sequence logic"],
        complexity: { time: "O(N)", space: "O(1)" },
        hint: "Keep track of the previous two numbers, sum them to get the current number, then shift the variables.",
        tags: ["Math", "Loops"]
      },
      {
        id: "pf-e-10-02",
        moduleId: "pf-10",
        moduleNum: "10",
        order: 2,
        type: "exercise",
        title: "Prime Number Check",
        category: "JAVA · PRACTICE",
        difficulty: "medium",
        whyThisProblem: "Introduces algorithmic optimization (checking up to sqrt(N)) and early returns.",
        practiceSkills: ["Loops", "Modulo", "Optimization"],
        complexity: { time: "O(sqrt(N))", space: "O(1)" },
        hint: "You only need to loop from 2 to the square root of N. If N % i == 0, it's not prime.",
        tags: ["Math"]
      }
    ]
  },
  {
    id: "pf-11",
    numberStr: "11",
    title: "Java Programming Fundamentals",
    description: "Deepen your understanding of Java-specific features and syntax.",
    items: [
      {
        id: "pf-l-11-01",
        moduleId: "pf-11",
        moduleNum: "11",
        order: 1,
        type: "lesson",
        title: "Classes & Objects",
        category: "JAVA FUNDAMENTALS",
        whyItMatters: "Java is an Object-Oriented language; understanding classes is a prerequisite for advanced Java.",
        learningPoints: ["Class definitions", "Object instantiation", "Instance variables", "Constructors"],
        javaConcept: "class Dog {\n  String name;\n  Dog(String n) { name = n; }\n}\nDog d = new Dog(\"Buddy\");",
        complexity: null,
        commonMistakes: ["Forgetting the 'new' keyword", "Confusing classes with objects"],
        relatedExerciseIds: []
      }
    ]
  },
  {
    id: "pf-12",
    numberStr: "12",
    title: "Programming Assessment",
    description: "Test your readiness for the technical placement rounds.",
    items: [
      {
        id: "pf-e-12-01",
        moduleId: "pf-12",
        moduleNum: "12",
        order: 1,
        type: "exercise",
        title: "Matrix Transpose",
        category: "ASSESSMENT",
        difficulty: "hard",
        whyThisProblem: "Tests strong command of nested loops and 2D array indexing.",
        practiceSkills: ["2D Arrays", "Nested Loops", "Index swapping"],
        complexity: { time: "O(N * M)", space: "O(N * M)" },
        hint: "Create a new matrix of size [columns][rows]. result[j][i] = original[i][j].",
        tags: ["Arrays", "Nested Loops"]
      }
    ]
  }
];
