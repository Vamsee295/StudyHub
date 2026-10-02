// Module 7 - Arrays (8 lessons)
import { CourseLessonContent } from './types';

export const arraysLessons: Array<{
  slug: string;
  title: string;
  content: CourseLessonContent
}> = [
  {
    slug: "what-is-an-array",
    title: "What is an Array?",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand primitive variables, data types, stack vs heap memory models, and reference variables."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "An array is a Contiguous Apartment Complex on the Heap. Instead of creating 100 separate detached houses (individual variables scattered randomly across memory), an array builds a single continuous block of identical units lined up side-by-side. The array variable `arr` on your Call Stack is simply the street address (reference pointer) pointing to the front door of Apartment 0."
        },
        {
          type: "callout",
          title: "The 3 Invariants of Java Arrays",
          content: "1. **Homogeneous Data**: All elements inside an array must be of the EXACT same data type (e.g. all `int`, all `double`, or all `String`).\n2. **Fixed Capacity**: Once allocated in heap memory with `new dataType[size]`, an array's length is strictly **immutable** and cannot grow or shrink.\n3. **Contiguous Memory**: Elements occupy consecutive, unbroken byte addresses in RAM, enabling $O(1)$ instantaneous random access."
        },
        {
          type: "code",
          title: "Array Instantiation, Default Values & Length Property",
          code: "// 1. HEAP ALLOCATION WITH DEFAULT VALUES\n// Allocates contiguous memory on heap for 5 integers (all initialized to 0)\nint[] scores = new int[5];\n\nSystem.out.println(\"Array length: \" + scores.length); // 5 (.length is a field, not a method!)\nSystem.out.println(\"Default at index 0: \" + scores[0]); // 0\nSystem.out.println(\"Default at index 4: \" + scores[4]); // 0\n\n// 2. ASSIGNING AND ACCESSING ELEMENTS\nscores[0] = 88;\nscores[1] = 95;\nscores[2] = 72;\nscores[3] = 91;\nscores[4] = 84;\n\nSystem.out.println(\"First element: \" + scores[0]); // 88\nSystem.out.println(\"Last element: \" + scores[scores.length - 1]); // 84",
          language: "java",
          explanation: "In Java, arrays are real heap objects. When instantiated, the JVM automatically wipes the memory block and fills it with type-safe default values."
        },
        {
          type: "text",
          title: "Automatic Default Initialization Values on the Heap",
          content: "When you allocate an array with `new`, Java automatically initializes every cell to its standard zero-equivalent:\n\n| Element Data Type | Default Initial Value |\n| :--- | :--- |\n| `byte`, `short`, `int`, `long` | `0` / `0L` |\n| `float`, `double` | `0.0f` / `0.0d` |\n| `boolean` | `false` |\n| `char` | `'\\u0000'` (null character) |\n| Object References (`String`, `Object`, custom classes) | `null` |"
        },
        {
          type: "tryIt",
          title: "Try It: Inspecting Default Values",
          code: "boolean[] flags = new boolean[3];\nString[] names = new String[2];\nSystem.out.println(\"flags[0]: \" + flags[0]);\nSystem.out.println(\"names[0]: \" + names[0]);",
          expectedOutput: "flags[0]: false\nnames[0]: null",
          explanation: "Primitive boolean arrays default to false; object reference arrays (like String) default to null."
        },
        {
          type: "dryRun",
          title: "O(1) Direct Memory Address Calculation",
          iterations: [
            { step: 1, variables: { "Base Address (scores)": "0x1000", "Element Type": "int (4 bytes)" }, description: "Array allocated at memory address 0x1000." },
            { step: 2, variables: { "scores[0] Address": "0x1000 + (0 * 4) = 0x1000" }, description: "Index 0 requires 0 bytes offset. Direct access in O(1)." },
            { step: 3, variables: { "scores[3] Address": "0x1000 + (3 * 4) = 0x100C" }, description: "Index 3 computed instantly via simple arithmetic: Base + (Index * 4)." }
          ]
        },
        {
          type: "warning",
          title: "Common Array Pitfalls",
          items: [
            "**`length` vs `length()`**: Array size is an immutable property field (`arr.length`), whereas String size is a method call (`str.length()`).",
            "**Assuming Dynamic Resizing**: Arrays cannot expand. If you need dynamic resizing, use `ArrayList<T>` or create a new larger array and copy elements.",
            "**Printing Array Directly**: `System.out.println(arr)` prints the object type hash code (e.g. `[I@1b6d3586`) instead of contents (use `Arrays.toString(arr)`)."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Array Type Hierarchy & Object Identity",
          traps: [
            {
              question: "Is an array a primitive or an Object in Java? Does `int[]` inherit from `Object`?",
              trap: "Thinking primitive arrays are primitives because they hold primitives.",
              solution: "In Java, EVERY array (even primitive arrays like `int[]` or `boolean[]`) is a first-class **Object** residing on the Heap. It inherits directly from `java.lang.Object`, implements `Cloneable` and `java.io.Serializable`, and has an object header with class metadata (e.g. `[I` for `int[]`)."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "What is the time complexity of accessing any arbitrary element in an array by its index `arr[i]`?",
          options: [
            "O(N) linear time",
            "O(log N) logarithmic time",
            "O(1) constant time",
            "O(N^2) quadratic time"
          ],
          answer: 2,
          explanation: "Because memory is contiguous, the CPU calculates the target byte address via a single arithmetic operation `Base + (i * size)`, achieving O(1) constant time access."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Arrays are fixed-size, homogeneous collections stored in contiguous heap memory.",
            "Instantaneous O(1) random access via arithmetic index offsets.",
            "Allocated arrays are automatically filled with type-safe default values.",
            "Size is accessible via the immutable `arr.length` field."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Array Declaration & Initialization, comparing dynamic allocation, array literals, and anonymous inline arrays."
        }
      ]
    }
  },
  {
    slug: "array-declaration-initialization",
    title: "Array Declaration & Initialization",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `what-is-an-array`, reference variables, and heap allocation."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of the creation steps as Blueprint vs Construction vs Furnished Move-In:\n• **Declaration (`int[] arr;`)**: Registering the architectural blueprint on the stack (currently pointing to `null`).\n• **Dynamic Allocation (`arr = new int[5];`)**: Constructing the physical building on the heap (unfurnished, filled with default 0s).\n• **Array Literal (`int[] arr = { 10, 20, 30 };`)**: Constructing, sizing, and moving into a fully furnished building in a single concise line."
        },
        {
          type: "callout",
          title: "The 4 Array Creation Paradigms",
          content: "1. **Declare then Allocate**: `int[] arr; arr = new int[5];`\n2. **Declare and Allocate in One Step**: `int[] arr = new int[5];`\n3. **Array Initializer Literal**: `int[] arr = { 10, 20, 30 };` (size inferred automatically as 3)\n4. **Anonymous Array Instantiation**: `new int[] { 10, 20, 30 }` (used when passing arrays inline to methods without naming a variable)"
        },
        {
          type: "code",
          title: "All 4 Initialization Syntaxes in Action",
          code: "// Paradigm 1: Declare then allocate\nint[] numbers;\nnumbers = new int[3];\nnumbers[0] = 100;\n\n// Paradigm 2: Declare and allocate with size\ndouble[] temperatures = new double[4]; // [0.0, 0.0, 0.0, 0.0]\n\n// Paradigm 3: Array literal (Concise, compiler infers length)\nString[] days = { \"Mon\", \"Tue\", \"Wed\", \"Thu\", \"Fri\" }; // length = 5\n\n// Paradigm 4: Anonymous array (Passing directly to a method)\nprintSummary(new int[] { 5, 10, 15, 20 });\n\n// Helper method definition\npublic static void printSummary(int[] data) {\n    System.out.println(\"Processing array of size: \" + data.length);\n}",
          language: "java",
          explanation: "Array literals can only be used on the line of declaration. To reassign an existing array variable or pass inline to a method, use the anonymous array syntax 'new int[] { ... }'."
        },
        {
          type: "text",
          title: "Bracket Placement: Java Style vs C-Style",
          content: "Java permits two syntactic styles for declaring array references:\n\n```java\nint[] a, b; // PREFERRED JAVA STYLE: Both 'a' and 'b' are integer arrays (int[])\nint a[], b; // C-STYLE LEGACY: 'a' is an integer array (int[]), but 'b' is a single int!\n```\n\nAlways place brackets directly after the type (`int[] arr`) to ensure clarity and avoid subtle multi-variable declaration bugs."
        },
        {
          type: "tryIt",
          title: "Try It: Array Literal vs Anonymous Array",
          code: "int[] primes = { 2, 3, 5, 7, 11 };\nSystem.out.println(\"Primes length: \" + primes.length);\nSystem.out.println(\"Third prime: \" + primes[2]);",
          expectedOutput: "Primes length: 5\nThird prime: 5",
          explanation: "primes is initialized with 5 elements. primes[2] accesses the 3rd element (index 2 = 5)."
        },
        {
          type: "dryRun",
          title: "Array Declaration & Heap Instantiation Trace",
          iterations: [
            { step: 1, variables: { "Stack (arr)": "null" }, description: "Declaration: 'int[] arr;' creates reference on stack holding null." },
            { step: 2, variables: { "Heap Allocation": "new int[3] (0x2000)", "Values": "[0, 0, 0]" }, description: "Allocates 12 bytes on heap. Initializes elements to default 0." },
            { step: 3, variables: { "Stack (arr)": "0x2000 (Pointer to Heap)" }, description: "Assigns heap memory address to arr reference variable." }
          ]
        },
        {
          type: "warning",
          title: "Common Initialization Mistakes",
          items: [
            "**Illegal Size Specification with Literals**: `int[] arr = new int[3]{1, 2, 3};` is a COMPILE ERROR (do not specify size when providing literal values).",
            "**Reassigning with Literal Syntax**: `int[] arr; arr = {1, 2, 3};` is a COMPILE ERROR (must use `arr = new int[]{1, 2, 3};` when separating assignment from declaration).",
            "**Negative Array Size**: `int[] arr = new int[-5];` compiles, but throws `NegativeArraySizeException` at runtime."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Array Declaration Multi-Variable Trap",
          traps: [
            {
              question: "In `int[] a, b[];`, what are the data types of variable `a` and variable `b`?",
              trap: "Thinking both are 1D arrays.",
              solution: "`a` is a 1-Dimensional array (`int[]`), but `b` is a 2-Dimensional array (`int[][]`)! The base type `int[]` applies to both, and the trailing `[]` on `b` adds a second dimension."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Which of the following creates and initializes a valid 3-element integer array?",
          options: [
            "int[] arr = new int[3]{ 10, 20, 30 };",
            "int[] arr = { 10, 20, 30 };",
            "int arr = [10, 20, 30];",
            "array<int> arr = new array(3);"
          ],
          answer: 1,
          explanation: "`int[] arr = { 10, 20, 30 };` is valid array literal syntax. Specifying `[3]` alongside `{ ... }` produces a compile-time error in Java."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Use `int[] arr = { ... }` for known static data on declaration.",
            "Use `new int[size]` when allocating blank arrays of known dynamic capacity.",
            "Use anonymous syntax `new int[]{ ... }` when reassigning or passing inline to methods.",
            "Prefer `dataType[] arr` over legacy C-style `dataType arr[]`."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we examine Array Indexing, mastering zero-based offset mechanics, bounds safety, and in-place element mutations."
        }
      ]
    }
  },
  {
    slug: "array-indexing",
    title: "Array Indexing",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand array allocation, the `.length` property, and memory references."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Array indexing is Distance / Offset from the Starting Gate. An index is not an arbitrary label; it represents how many element-sized steps forward the CPU must travel from the array's base memory address:\n• Index `0`: $0$ steps forward (you are standing right at the front door).\n• Index `1`: $1$ step forward (the 2nd element).\n• Index $N-1$: $N-1$ steps forward (the last element)."
        },
        {
          type: "callout",
          title: "Valid Index Boundaries & Runtime Safety",
          content: "For an array of size $N$ (`arr.length == N`):\n• **First Valid Index**: `0`\n• **Last Valid Index**: `arr.length - 1`\n\n⚠️ If you attempt to access an index $< 0$ or $\\ge N$, the JVM halts execution and throws `ArrayIndexOutOfBoundsException` immediately."
        },
        {
          type: "code",
          title: "Reading, Writing, Dynamic End Access, and In-Place Swapping",
          code: "int[] nums = { 15, 28, 42, 73, 99 };\n\n// 1. Reading elements\nint first = nums[0]; // 15\nint third = nums[2]; // 42\nint last = nums[nums.length - 1]; // 99 (Dynamic last element)\n\n// 2. Modifying elements\nnums[1] = 30; // Changes 28 -> 30\n\n// 3. In-place element swap (Swap index 0 and index 4)\nint temp = nums[0];\nnums[0] = nums[4];\nnums[4] = temp;\n\nSystem.out.println(\"New first: \" + nums[0]); // 99\nSystem.out.println(\"New last: \" + nums[4]);  // 15",
          language: "java",
          explanation: "Element swapping requires a temporary storage variable 'temp' to prevent overwriting values before they can be copied."
        },
        {
          type: "text",
          title: "The Mechanics of In-Place Swapping",
          content: "Swapping elements at index `i` and `j` is a cornerstone of sorting and array reversal algorithms:\n\n```java\n// Step 1: Stash value of arr[i] in temp\nint temp = arr[i];\n// Step 2: Overwrite arr[i] with arr[j]\narr[i] = arr[j];\n// Step 3: Write stashed temp value into arr[j]\narr[j] = temp;\n```"
        },
        {
          type: "tryIt",
          title: "Try It: Array In-Place Swap",
          code: "int[] pair = { 10, 20 };\nint t = pair[0];\npair[0] = pair[1];\npair[1] = t;\nSystem.out.println(pair[0] + \" \" + pair[1]);",
          expectedOutput: "20 10",
          explanation: "Values 10 and 20 are swapped in-place."
        },
        {
          type: "dryRun",
          title: "Array Modification State Trace",
          iterations: [
            { step: 1, variables: { "nums": "[15, 28, 42, 73, 99]" }, description: "Initial array state." },
            { step: 2, variables: { "nums[1] = 30": "nums[1] updated" }, description: "Array becomes [15, 30, 42, 73, 99]." },
            { step: 3, variables: { "temp": "15", "nums[0]": "99", "nums[4]": "15" }, description: "In-place swap: Array becomes [99, 30, 42, 73, 15]." }
          ]
        },
        {
          type: "warning",
          title: "Common Indexing Pitfalls",
          items: [
            "**Accessing `arr[arr.length]`**: The last valid index is `arr.length - 1`. `arr[arr.length]` always throws `ArrayIndexOutOfBoundsException`.",
            "**Negative Indexing**: Unlike Python or JavaScript, Java does NOT support negative indexing (e.g. `arr[-1]` throws an exception).",
            "**1-Based Indexing Confusion**: Assuming the 3rd element is at index 3 (the 3rd element is at index 2)."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Bounds Checking Overhead & Hardware Optimization",
          traps: [
            {
              question: "Does the JVM perform bounds checking on every single array access? Can it be optimized?",
              trap: "Thinking bounds checking makes Java arrays significantly slower than C++ arrays.",
              solution: "Yes, the Java runtime checks bounds to prevent buffer overflow vulnerabilities. However, modern JIT (Just-In-Time) compilers perform **Bounds Check Elimination (BCE)**: when a standard `for (int i = 0; i < arr.length; i++)` loop is analyzed, the JIT proves that `i` cannot exceed array bounds and completely removes the runtime checks, matching raw C-speed."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "For an array `int[] arr = new int[8];`, what is the last accessible valid index?",
          options: [
            "8",
            "7",
            "9",
            "0"
          ],
          answer: 1,
          explanation: "For an array of length 8, valid indices run from 0 to 7 (length - 1)."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Array indices are 0-based memory offsets running from 0 to `length - 1`.",
            "Always access the last element dynamically using `arr[arr.length - 1]`.",
            "In-place swapping requires a 3-step temporary variable handshake.",
            "Invalid indices immediately trigger `ArrayIndexOutOfBoundsException`."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Traversing Arrays, comparing traditional indexed for loops against enhanced for-each loops and reverse traversals."
        }
      ]
    }
  },
  {
    slug: "traversing-arrays",
    title: "Traversing Arrays",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand array indexing, `for` loops, and the `.length` property."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Traversing an array is like an Inspector on an Assembly Line. The inspector walks down the conveyor belt systematically visiting every single box from index $0$ to $N-1$ to examine, log, update, or aggregate its contents."
        },
        {
          type: "callout",
          title: "Traditional for vs Enhanced for-each Loop",
          content: "• **Traditional Indexed `for` Loop**: `for (int i = 0; i < arr.length; i++)`\n  - Full control: Access to index position `i`, allows modifying array elements in-place, supports reverse and custom-step traversals.\n• **Enhanced `for-each` Loop**: `for (int val : arr)`\n  - Clean, idiomatic, read-only iteration: Eliminates off-by-one errors and bounds risks. Cannot mutate array elements or access index numbers."
        },
        {
          type: "code",
          title: "Array Traversals: Inspection, Mutation, and Reverse Iteration",
          code: "int[] numbers = { 10, 20, 30, 40, 50 };\n\n// 1. ENHANCED FOR-EACH (Clean read-only aggregation)\nint total = 0;\nfor (int num : numbers) {\n    total += num;\n}\nSystem.out.println(\"Total sum: \" + total); // 150\n\n// 2. TRADITIONAL FOR LOOP (Required for in-place element modification)\nfor (int i = 0; i < numbers.length; i++) {\n    numbers[i] = numbers[i] * 2; // Doubles each element in-place\n}\n// numbers is now: [20, 40, 60, 80, 100]\n\n// 3. REVERSE TRAVERSAL (From last element down to index 0)\nSystem.out.print(\"Reversed: \");\nfor (int i = numbers.length - 1; i >= 0; i--) {\n    System.out.print(numbers[i] + \" \"); // 100 80 60 40 20\n}\nSystem.out.println();",
          language: "java",
          explanation: "Enhanced for-each loops are ideal for reading data; traditional for loops are required whenever you need to write/mutate array elements or iterate in reverse."
        },
        {
          type: "text",
          title: "Why for-each Cannot Modify Array Elements",
          content: "In an enhanced `for (int val : arr)` loop, the variable `val` is a local **copy** of the array element's value. Mutating `val = 999;` only changes the local copy on the stack; the original heap array remains completely unchanged:\n\n```java\nint[] arr = { 1, 2, 3 };\nfor (int val : arr) {\n    val = 0; // DOES NOT MODIFY THE ARRAY!\n}\nSystem.out.println(arr[0]); // Still 1!\n```"
        },
        {
          type: "tryIt",
          title: "Try It: Count Elements Above Threshold",
          code: "int[] values = { 12, 45, 68, 23, 89, 5 };\nint count = 0;\nfor (int v : values) {\n    if (v >= 50) count++;\n}\nSystem.out.println(\"Count >= 50: \" + count);",
          expectedOutput: "Count >= 50: 2",
          explanation: "68 and 89 are >= 50, so count is 2."
        },
        {
          type: "dryRun",
          title: "Reverse Traversal Step-by-Step Trace",
          iterations: [
            { step: 1, variables: { "i": "2 (arr.length-1)", "arr[2]": "30" }, description: "Starts at last index. Prints 30. Decrements i." },
            { step: 2, variables: { "i": "1", "arr[1]": "20" }, description: "Prints 20. Decrements i." },
            { step: 3, variables: { "i": "0", "arr[0]": "10" }, description: "Prints 10. Decrements i to -1." },
            { step: 4, variables: { "i >= 0": "-1 >= 0 (FALSE)" }, description: "Condition fails. Reverse loop terminates cleanly." }
          ]
        },
        {
          type: "warning",
          title: "Common Traversal Pitfalls",
          items: [
            "**Using `<=` in Forward Loop**: `for (int i = 0; i <= arr.length; i++)` crashes at the last step (use `< arr.length`).",
            "**Wrong Initialization in Reverse Loop**: `for (int i = arr.length; ...)` crashes immediately with `ArrayIndexOutOfBoundsException` (must start at `arr.length - 1`).",
            "**Attempting In-Place Mutation via for-each**: Trying to initialize or modify array contents inside an enhanced for-each loop."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Modifying Objects vs Primitives in for-each",
          traps: [
            {
              question: "Can an enhanced for-each loop modify the state of objects inside an object array (`Person[]`)?",
              trap: "Assuming for-each can never mutate anything because it can't mutate primitives.",
              solution: "Yes, for object reference arrays! While `person = new Person()` only reassigns the local reference copy, calling a setter method `person.setName(\"Alice\")` mutates the actual heap object referenced by the array."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Which loop construct should you use to multiply every element in an integer array by 2 in-place?",
          options: [
            "Enhanced for-each loop `for(int num : arr)`",
            "Traditional indexed for loop `for(int i=0; i<arr.length; i++)`",
            "do-while loop with random indices",
            "for-each loop with break"
          ],
          answer: 1,
          explanation: "In-place modification requires write access by index `arr[i] = ...`, which is only provided by traditional indexed loops."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Use enhanced `for-each` for clean, safe read-only operations.",
            "Use traditional `for` when you need index positions, mutations, or reverse stepping.",
            "Forward loops run `i = 0; i < arr.length; i++`.",
            "Reverse loops run `i = arr.length - 1; i >= 0; i--`."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Taking Array Input, learning how to dynamically dimension arrays and populate them via Scanner streams."
        }
      ]
    }
  },
  {
    slug: "taking-array-input",
    title: "Taking Array Input",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand `Scanner` input, dynamic memory allocation `new dataType[N]`, and standard `for` loops."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of taking array input as Sizing the Container before Filling. Because arrays in Java cannot resize once created, you must first ask the user/stream 'How many items are coming?' ($N$), construct an empty container of exact size $N$ on the Heap, and then run a loop $N$ times to fill each slot sequentially from index $0$ to $N-1$."
        },
        {
          type: "callout",
          title: "The 3-Step Array Input Pipeline",
          content: "1. **Read Capacity**: Read the total element count $N$ from input (`int n = sc.nextInt();`).\n2. **Instantiate on Heap**: Allocate memory of size $N$ (`int[] arr = new int[n];`).\n3. **Populate via Loop**: Iterate from index `0` to `n - 1`, reading each token into `arr[i]`."
        },
        {
          type: "code",
          title: "Dynamic Array Input: Numeric Data & String Buffer Clearance",
          code: "import java.util.Scanner;\n\npublic class ArrayInputDemo {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n\n        // 1. NUMERIC ARRAY INPUT\n        System.out.print(\"Enter number of scores: \");\n        int n = sc.nextInt();\n\n        int[] scores = new int[n]; // Heap allocation of size n\n        System.out.println(\"Enter \" + n + \" integer scores:\");\n        for (int i = 0; i < scores.length; i++) {\n            scores[i] = sc.nextInt();\n        }\n\n        // 2. STRING ARRAY INPUT (Clearing the phantom newline!)\n        System.out.print(\"Enter number of student names: \");\n        int nameCount = sc.nextInt();\n        sc.nextLine(); // CRITICAL: Consume the lingering newline character!\n\n        String[] names = new String[nameCount];\n        System.out.println(\"Enter \" + nameCount + \" names:\");\n        for (int i = 0; i < names.length; i++) {\n            names[i] = sc.nextLine();\n        }\n    }\n}",
          language: "java",
          explanation: "When reading Strings after numeric inputs, always call 'sc.nextLine()' to clear the leftover newline character in the input buffer before reading String tokens."
        },
        {
          type: "text",
          title: "Defensive Validation of Array Capacity",
          content: "In production systems, never allocate an array blindly without validating the input size:\n\n```java\nif (n < 0) {\n    throw new IllegalArgumentException(\"Array size cannot be negative: \" + n);\n}\nif (n > 10_000_000) {\n    throw new IllegalArgumentException(\"Requested size exceeds memory allocation limits.\");\n}\n```"
        },
        {
          type: "tryIt",
          title: "Try It: Array Population Logic",
          code: "int n = 3;\nint[] arr = new int[n];\n// Simulating reading values: 10, 20, 30\nfor (int i = 0; i < n; i++) {\n    arr[i] = (i + 1) * 10;\n}\nfor (int val : arr) {\n    System.out.print(val + \" \");\n}",
          expectedOutput: "10 20 30 ",
          explanation: "Array is sized to 3 and populated sequentially with 10, 20, 30."
        },
        {
          type: "dryRun",
          title: "Array Input Buffer Trace: Reading 3 Integers [45, 88, 92]",
          iterations: [
            { step: 1, variables: { "n": "3", "scores": "[0, 0, 0]" }, description: "Allocates 3-element integer array." },
            { step: 2, variables: { "i": "0", "scores[0]": "45" }, description: "First token read into scores[0]." },
            { step: 3, variables: { "i": "1", "scores[1]": "88" }, description: "Second token read into scores[1]." },
            { step: 4, variables: { "i": "2", "scores[2]": "92" }, description: "Third token read into scores[2]. Loop terminates." }
          ]
        },
        {
          type: "warning",
          title: "Common Input Mistakes",
          items: [
            "**Attempting to Allocate before Reading Size**: Writing `int[] arr = new int[n];` before initializing `n` with `sc.nextInt()`.",
            "**The Phantom Newline Bug**: Forgetting `sc.nextLine()` between `sc.nextInt()` and `sc.nextLine()` causes the first String to be read as an empty string `\"\"`.",
            "**Not Handling Non-Numeric Input**: Throws `InputMismatchException` if a user enters text when an integer is expected."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Time & Space Complexity of Array Reading",
          traps: [
            {
              question: "What is the time and space complexity of reading an array of size N from standard input?",
              trap: "Thinking reading input has no algorithmic complexity.",
              solution: "Reading $N$ elements requires $O(N)$ Time Complexity (must process $N$ tokens) and $O(N)$ Auxiliary Space Complexity (allocates a contiguous heap buffer of size $N$)."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Why must array size N be read before instantiating an array in Java?",
          options: [
            "Java syntax requires all arrays to be constant size",
            "Arrays have immutable capacity that must be allocated on the heap during instantiation",
            "Scanner cannot operate without array size",
            "To prevent stack overflow"
          ],
          answer: 1,
          explanation: "Because Java arrays have fixed heap capacity, the JVM requires the exact size at creation time to allocate the contiguous memory block."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Array input workflow: 1. Read size N -> 2. Allocate `new int[N]` -> 3. Loop `0` to `N-1`.",
            "Clear leftover newlines with `sc.nextLine()` when switching from numeric to String input.",
            "Validate that $N \\ge 0$ to prevent `NegativeArraySizeException`.",
            "Array input has O(N) time and O(N) space complexity."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Searching Arrays, mastering the Linear Search algorithm, sentinel return values, and equality traps."
        }
      ]
    }
  },
  {
    slug: "searching-arrays",
    title: "Searching Arrays",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand array traversal, boolean equality operators, and the `break` keyword."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Searching an array is like Finding a Key in a Row of Lockers. You start at Locker 0, open it, and compare its contents with your target key. If it matches, you record the locker index and stop searching immediately. If you inspect every locker to the very end ($N-1$) without finding a match, you report failure by returning the standard sentinel `-1`."
        },
        {
          type: "callout",
          title: "The Sentinel -1 Convention",
          content: "Valid array indices are strictly non-negative integers ($0, 1, 2, \\dots, N-1$).\n\nTherefore, returning `-1` is the universally accepted standard in computer science to signal: **Target Element Not Found** (e.g. `String.indexOf()`, `List.indexOf()`)."
        },
        {
          type: "code",
          title: "Linear Search Algorithm for Primitives & Objects",
          code: "// --- 1. PRIMITIVE LINEAR SEARCH (Find index of target) ---\npublic static int linearSearch(int[] arr, int target) {\n    for (int i = 0; i < arr.length; i++) {\n        if (arr[i] == target) {\n            return i; // Target found at index i (immediate early exit!)\n        }\n    }\n    return -1; // Exhausted entire array, target not present\n}\n\n// --- 2. OBJECT / STRING SEARCH (Must use .equals()!) ---\npublic static int searchName(String[] names, String targetName) {\n    if (targetName == null) return -1;\n    \n    for (int i = 0; i < names.length; i++) {\n        // NEVER use '==' for Strings! Use .equals() for content comparison\n        if (targetName.equals(names[i])) {\n            return i;\n        }\n    }\n    return -1;\n}\n\n// --- Usage ---\nint[] scores = { 45, 88, 92, 73, 61 };\nint foundAt = linearSearch(scores, 92);\nSystem.out.println(\"Found 92 at index: \" + foundAt); // Index 2",
          language: "java",
          explanation: "Linear search inspects elements sequentially from left to right. Returning immediately upon finding a match minimizes CPU time."
        },
        {
          type: "text",
          title: "Linear Search Complexity Analysis",
          content: "• **Best Case ($O(1)$)**: Target is located at index `0` (terminates on the very first check).\n• **Worst Case ($O(N)$)**: Target is at the last index $N-1$, or does not exist in the array (must inspect all $N$ elements).\n• **Average Case ($O(N)$)**: On average, inspects $\\approx \\frac{N}{2}$ elements.\n• **Auxiliary Space ($O(1)$)**: Uses constant additional memory."
        },
        {
          type: "tryIt",
          title: "Try It: Search for Target",
          code: "int[] nums = { 10, 20, 30, 40, 50 };\nint target = 35;\nint idx = -1;\nfor (int i = 0; i < nums.length; i++) {\n    if (nums[i] == target) {\n        idx = i;\n        break;\n    }\n}\nSystem.out.println(\"Result: \" + idx);",
          expectedOutput: "Result: -1",
          explanation: "35 does not exist in nums, so idx remains -1."
        },
        {
          type: "dryRun",
          title: "Linear Search Trace: Searching for 73 in [45, 88, 73, 99]",
          iterations: [
            { step: 1, variables: { "i": "0", "arr[0]": "45", "45 == 73": "false" }, description: "No match. Advances to index 1." },
            { step: 2, variables: { "i": "1", "arr[1]": "88", "88 == 73": "false" }, description: "No match. Advances to index 2." },
            { step: 3, variables: { "i": "2", "arr[2]": "73", "73 == 73": "TRUE" }, description: "Match found! Returns index 2 immediately. Remaining elements skipped." }
          ]
        },
        {
          type: "warning",
          title: "Common Search Mistakes",
          items: [
            "**Returning 0 for 'Not Found'**: Index 0 represents the first valid element! Returning 0 creates severe false-positive bugs (always return -1).",
            "**Using `==` for String Search**: Comparing strings with `==` checks reference addresses, causing searches to fail even when text contents are identical (always use `.equals()`).",
            "**Forgetting to `break` or `return`**: Continuing to iterate through the entire array after finding the element, wasting CPU time."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Linear Search vs Binary Search",
          traps: [
            {
              question: "When is Linear Search preferred over Binary Search?",
              trap: "Assuming Binary Search ($O(\\log N)$) is always superior.",
              solution: "Binary Search REQUIRES the dataset to be strictly sorted. Sorting an unsorted array takes $O(N \\log N)$ time. Therefore, if you only need to perform a single search on an unsorted dataset, Linear Search ($O(N)$) is significantly faster than sorting first."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Why is -1 returned when a target is not found in an array?",
          options: [
            "It is the only negative integer supported by Java",
            "Valid array indices start at 0, making -1 an unambiguous indicator of absence",
            "It indicates an empty array",
            "It resets the array pointer"
          ],
          answer: 1,
          explanation: "Because all valid array indices are non-negative (0 to N-1), -1 unambiguously signals that the element was not found."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Linear search inspects elements sequentially in O(N) time.",
            "Returns the matching index on success, or `-1` on failure.",
            "Exit immediately via `return` or `break` upon finding a match.",
            "Always use `.equals()` when searching String or object arrays."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Min, Max & Sum, mastering single-pass aggregation algorithms and numerical overflow prevention."
        }
      ]
    }
  },
  {
    slug: "min-max-sum",
    title: "Min, Max & Sum",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand array traversal, accumulator patterns, and primitive numeric types."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Think of this algorithm as the Scorekeeper & The Scale. As data elements arrive one-by-one from the array, the scorekeeper keeps track of three statistics simultaneously: the smallest value seen so far (`min`), the largest value seen so far (`max`), and the running cumulative weight (`sum`)."
        },
        {
          type: "callout",
          title: "The First-Element Initialization Rule",
          content: "⚠️ **CRITICAL BUG TRAP**: NEVER initialize `max = 0` or `min = 0`!\n• If an array contains only negative numbers (e.g. `[-15, -8, -22]`), an initial `max = 0` will incorrectly return `0` instead of `-8`.\n• **Rule**: Always initialize both `min` and `max` to the first element `arr[0]` (or `Integer.MAX_VALUE` / `Integer.MIN_VALUE`)."
        },
        {
          type: "code",
          title: "Single-Pass O(N) Min, Max, Sum & Average Calculation",
          code: "public class ArrayStats {\n    public static void printStats(int[] arr) {\n        // Defensive guard clause for empty arrays\n        if (arr == null || arr.length == 0) {\n            System.out.println(\"Cannot calculate stats for empty array.\");\n            return;\n        }\n\n        // 1. Initialize min and max with first element\n        int min = arr[0];\n        int max = arr[0];\n        long sum = 0L; // Use long to prevent integer overflow on large datasets\n\n        // 2. Single-pass traversal (O(N) time complexity)\n        for (int i = 0; i < arr.length; i++) {\n            if (arr[i] < min) min = arr[i];\n            if (arr[i] > max) max = arr[i];\n            sum += arr[i];\n        }\n\n        // 3. Compute average with explicit floating-point promotion\n        double average = (double) sum / arr.length;\n\n        System.out.println(\"Min:     \" + min);\n        System.out.println(\"Max:     \" + max);\n        System.out.println(\"Sum:     \" + sum);\n        System.out.printf(\"Average: %.2f%n\", average);\n    }\n}",
          language: "java",
          explanation: "Computing min, max, sum, and average in a single unified loop traversal avoids scanning memory multiple times, maximizing CPU cache efficiency."
        },
        {
          type: "text",
          title: "Preventing Integer Overflow & Truncation",
          content: "• **Integer Overflow**: In Java, adding two large positive `int`s that exceed $2,147,483,647$ wraps around into negative numbers. Accumulate sums into `long sum = 0L;`.\n• **Decimal Truncation**: Writing `double avg = sum / arr.length;` performs integer division before assignment (e.g. `7 / 2 = 3.0`). Always cast one operand: `(double) sum / arr.length`."
        },
        {
          type: "tryIt",
          title: "Try It: Min and Max with Negative Numbers",
          code: "int[] scores = { -15, -42, -8, -99, -3 };\nint max = scores[0];\nfor (int s : scores) {\n    if (s > max) max = s;\n}\nSystem.out.println(\"Maximum: \" + max);",
          expectedOutput: "Maximum: -3",
          explanation: "Because max was initialized to scores[0] (-15), it correctly identifies -3 as the highest score."
        },
        {
          type: "dryRun",
          title: "Single-Pass State Trace: [20, -5, 40]",
          iterations: [
            { step: 1, variables: { "Init": "min=20, max=20, sum=0" }, description: "Initialized state." },
            { step: 2, variables: { "i=0 (20)": "min=20, max=20, sum=20" }, description: "Process 20: sum becomes 20." },
            { step: 3, variables: { "i=1 (-5)": "min=-5, max=20, sum=15" }, description: "Process -5: min updated to -5, sum becomes 15." },
            { step: 4, variables: { "i=2 (40)": "min=-5, max=40, sum=55" }, description: "Process 40: max updated to 40, sum becomes 55." }
          ]
        },
        {
          type: "warning",
          title: "Common Min/Max/Sum Mistakes",
          items: [
            "**Initializing `max = 0`**: Fails completely when all numbers in the array are negative.",
            "**Missing Empty Array Guard**: Accessing `arr[0]` on an empty array (`new int[0]`) immediately throws `ArrayIndexOutOfBoundsException`.",
            "**Integer Division Bug**: Forgetting to cast `(double)` when calculating averages."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Minimum Number of Comparisons for Min & Max",
          traps: [
            {
              question: "What is the theoretical minimum number of comparisons needed to find both min and max in an array of size N?",
              trap: "Thinking it requires 2N comparisons.",
              solution: "Standard independent checks take $2N - 2$ comparisons. However, by processing elements in **pairs** (compare pairs first, then compare the larger with `max` and smaller with `min`), the total comparisons drop to $\\approx 3N/2$ (1.5N comparisons), a common algorithmic optimization interview question."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "Why should min and max be initialized with `arr[0]` instead of 0?",
          options: [
            "Because index 0 runs faster in the JVM",
            "To ensure correct results when arrays contain all negative or all non-zero numbers",
            "To prevent NullPointerException",
            "Because Java forbids initializing min to 0"
          ],
          answer: 1,
          explanation: "Initializing max to 0 fails if all elements are negative (e.g. max would stay 0 instead of -3). Initializing to arr[0] guarantees correctness across all numeric ranges."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "Always initialize min and max with `arr[0]` to safely handle all-negative arrays.",
            "Use `long` for sum accumulators to defend against integer overflow.",
            "Cast `(double)` before division to prevent integer truncation in averages.",
            "Compute min, max, and sum in a single O(N) pass."
          ]
        },
        {
          type: "text",
          title: "Connection to Next Lesson",
          content: "Next, we explore Two-Dimensional Arrays, mastering matrix grids, heap pointer architecture, and jagged arrays."
        }
      ]
    }
  },
  {
    slug: "two-dimensional-arrays",
    title: "Two-Dimensional Arrays",
    content: {
      sections: [
        {
          type: "text",
          title: "Prerequisites",
          content: "You should understand 1D arrays, nested loops, heap memory models, and reference variables."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "In Java, a 2D array is an **Array of Arrays** (Master Reference Array). It is NOT a single flat contiguous grid like in C/C++. Instead, it is a master array on the Heap whose elements are reference pointers, each pointing to an independent 1D array representing a single row."
        },
        {
          type: "callout",
          title: "Matrix Dimension Properties",
          content: "For a 2D array `int[][] matrix = new int[3][4];`:\n• **Number of Rows**: `matrix.length` (gives 3)\n• **Number of Columns in Row `r`**: `matrix[r].length` (gives 4)\n• **Element Access**: `matrix[row][col]`"
        },
        {
          type: "code",
          title: "2D Rectangular Matrix & Dynamic Jagged Arrays in Action",
          code: "// --- 1. RECTANGULAR MATRIX DECLARATION & TRAVERSAL ---\nint[][] matrix = {\n    { 10, 20, 30 },\n    { 40, 50, 60 }\n};\n\nSystem.out.println(\"Rows: \" + matrix.length); // 2\nSystem.out.println(\"Cols in row 0: \" + matrix[0].length); // 3\n\n// Row-major nested traversal\nfor (int r = 0; r < matrix.length; r++) {\n    for (int c = 0; c < matrix[r].length; c++) {\n        System.out.print(matrix[r][c] + \" \");\n    }\n    System.out.println();\n}\n\n// --- 2. JAGGED (RAGGED) ARRAYS (Rows of varying lengths) ---\n// Allocate master array with 3 rows, but leave column sizes unallocated\nint[][] jagged = new int[3][];\njagged[0] = new int[2]; // Row 0 has 2 columns\njagged[1] = new int[4]; // Row 1 has 4 columns\njagged[2] = new int[1]; // Row 2 has 1 column\n\nSystem.out.println(\"Jagged row 1 length: \" + jagged[1].length); // 4",
          language: "java",
          explanation: "Because each row is an independent heap array, Java supports jagged arrays where individual rows have completely different lengths."
        },
        {
          type: "text",
          title: "Memory Architecture: Array of References",
          content: "```\nStack (matrix) ---> Heap Master Array (Pointers)\n                     [0] ---> [ 10 | 20 | 30 ] (Row 0 Heap Array)\n                     [1] ---> [ 40 | 50 | 60 ] (Row 1 Heap Array)\n```\nBecause rows can reside in completely separate regions of Heap RAM, accessing `matrix[r][c]` performs two pointer dereferences: first to locate Row `r`, then to locate Column `c`."
        },
        {
          type: "tryIt",
          title: "Try It: Sum Elements of a 2D Matrix",
          code: "int[][] grid = {\n    { 1, 2 },\n    { 3, 4 }\n};\nint sum = 0;\nfor (int r = 0; r < grid.length; r++) {\n    for (int c = 0; c < grid[r].length; c++) {\n        sum += grid[r][c];\n    }\n}\nSystem.out.println(\"Matrix total: \" + sum);",
          expectedOutput: "Matrix total: 10",
          explanation: "Sums 1 + 2 + 3 + 4 = 10."
        },
        {
          type: "dryRun",
          title: "2D Matrix Traversal State Trace: 2x2 Grid",
          iterations: [
            { step: 1, variables: { "r": "0", "c": "0", "val": "grid[0][0]=1" }, description: "Reads row 0, col 0." },
            { step: 2, variables: { "r": "0", "c": "1", "val": "grid[0][1]=2" }, description: "Reads row 0, col 1. Row 0 complete." },
            { step: 3, variables: { "r": "1", "c": "0", "val": "grid[1][0]=3" }, description: "Reads row 1, col 0." },
            { step: 4, variables: { "r": "1", "c": "1", "val": "grid[1][1]=4" }, description: "Reads row 1, col 1. Traversal complete." }
          ]
        },
        {
          type: "warning",
          title: "Common 2D Array Pitfalls",
          items: [
            "**Confusing `matrix.length` with Columns**: `matrix.length` gives total ROWS. To get columns of row 0, use `matrix[0].length`.",
            "**Inverted Index Order**: Writing `matrix[c][r]` instead of `matrix[r][c]` causes out-of-bounds exceptions or data corruption.",
            "**Assuming Fixed Column Widths**: Forgetting that jagged arrays have variable `matrix[r].length` per row.",
            "**Accessing Unallocated Jagged Rows**: Calling `jagged[0][0]` before allocating `jagged[0] = new int[...]` throws `NullPointerException`."
          ]
        },
        {
          type: "interviewTraps",
          title: "Interview Traps: Cache Locality in Row-Major vs Column-Major Traversal",
          traps: [
            {
              question: "Why is row-major traversal (`matrix[r][c]`) faster than column-major traversal (`matrix[c][r]`) in hardware?",
              trap: "Thinking iteration order has identical speed.",
              solution: "Modern CPUs load contiguous memory into high-speed CPU L1/L2 caches in blocks called Cache Lines. Traversing elements in row order reads consecutive memory slots (Cache Hit). Traversing down columns jumps across different row arrays in heap memory on every step, causing frequent **Cache Misses** that degrade performance."
            }
          ]
        },
        {
          type: "quickCheck",
          title: "Quick Check",
          question: "How do you determine the number of columns in row index 2 of a 2D array?",
          options: [
            "matrix.length",
            "matrix[2].length",
            "matrix.columns(2)",
            "matrix[0].length"
          ],
          answer: 1,
          explanation: "`matrix[2].length` returns the exact number of column elements in row 2, which is safe for both rectangular and jagged arrays."
        },
        {
          type: "takeaways",
          title: "Key Takeaways",
          items: [
            "2D arrays in Java are arrays of 1D array reference pointers on the heap.",
            "`matrix.length` = number of rows; `matrix[r].length` = number of columns in row r.",
            "Supports jagged/ragged arrays with variable row lengths.",
            "Row-major traversal `matrix[r][c]` provides superior CPU cache performance."
          ]
        },
        {
          type: "text",
          title: "Module 7 Complete",
          content: "Congratulations! You have mastered Arrays, Heap Allocation, Bounds Safety, Linear Searches, Single-Pass Statistics, and 2D Matrices. In Module 8, we dive deep into Strings, String Immutability, String Pool, and StringBuilder."
        }
      ]
    }
  }
];

