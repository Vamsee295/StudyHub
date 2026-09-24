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
      definition: "An array is a collection of elements of the same type stored in contiguous memory locations. Each element can be accessed using an index.",
      whyItMatters: "Arrays are fundamental data structures used to store multiple values in a single variable, making it easy to work with collections of data.",
      coreConcept: "Arrays have fixed size (once created, cannot change). Elements are accessed by index starting at 0. Arrays store primitives or object references. The length property gives the size.",
      syntax: "dataType[] arrayName = new dataType[size];",
      javaExample: "// Declare and create array\nint[] numbers = new int[5];\n\n// Declare with values\nint[] scores = {85, 90, 78, 92, 88};\n\n// Access elements\nSystem.out.println(scores[0]);  // 85\nSystem.out.println(scores.length);  // 5",
      howItWorks: "1. Declaration: int[] arr; creates reference\n2. Allocation: arr = new int[5]; allocates memory\n3. Default values: 0 for int, false for boolean, null for objects\n4. Access: arr[index] reads or writes element\n5. Bounds: 0 to length-1",
      realWorldUse: "Storing lists of numbers, strings, objects. Processing collections. Game grids. Statistical data. Buffers. Lookup tables.",
      commonMistakes: [
        "Accessing index >= length (ArrayIndexOutOfBoundsException)",
        "Array index starts at 0, not 1",
        "Arrays have fixed size after creation",
        "Confusing length (property) with length() (String method)"
      ],
      interviewQuestions: [
        { question: "What is the default value of elements in an int array?", answer: "0. Primitive arrays initialize to default values: 0 for numeric, false for boolean, '\\u0000' for char, null for objects." },
        { question: "Can you change the size of an array after creation?", answer: "No. Arrays have fixed size. Use ArrayList for dynamic size, or create a new larger array and copy elements." }
      ],
      quickRevision: "Array = fixed-size collection. Index 0 to length-1. Use [] for access. length property (not method).",
      practicePrompt: "Create an array to store 5 student names and print the first one.",
      quickCheck: {
        question: "What is the valid index range for an array of length 5?",
        options: ["1 to 5", "0 to 4", "0 to 5", "-1 to 4"],
        answer: 1,
        explanation: "Array indices start at 0. For length 5, valid indices are 0, 1, 2, 3, 4. Accessing index 5 throws ArrayIndexOutOfBoundsException."
      }
    }
  },
  {
    slug: "array-declaration-initialization",
    title: "Array Declaration & Initialization",
    content: {
      definition: "Array declaration creates a reference variable. Initialization allocates memory and optionally assigns values. Arrays can be declared and initialized in multiple ways.",
      whyItMatters: "Understanding different ways to create arrays helps you choose the appropriate method for each situation.",
      coreConcept: "Three approaches: 1) Declare then allocate: int[] arr; arr = new int[5]; 2) Declare and allocate: int[] arr = new int[5]; 3) Declare with values: int[] arr = {1, 2, 3};",
      syntax: "// Method 1: Declare then allocate\nint[] arr;\narr = new int[5];\n\n// Method 2: Declare and allocate\nint[] arr = new int[5];\n\n// Method 3: Array literal\nint[] arr = {1, 2, 3, 4, 5};",
      javaExample: "// Different ways to create arrays\n\n// Method 1\nint[] numbers;\nnumbers = new int[3];\nnumbers[0] = 10;\nnumbers[1] = 20;\nnumbers[2] = 30;\n\n// Method 2\nString[] names = new String[3];\nnames[0] = \"Alice\";\nnames[1] = \"Bob\";\nnames[2] = \"Charlie\";\n\n// Method 3\ndouble[] prices = {19.99, 29.99, 39.99};",
      howItWorks: "new int[5] allocates memory for 5 integers, initializes to 0. Array literal {1, 2, 3} allocates and initializes in one step. Size is inferred from values.",
      realWorldUse: "Creating fixed-size collections, initializing configuration arrays, storing test data, defining lookup tables.",
      commonMistakes: [
        "Specifying size with array literal: int[] arr = new int[3]{1,2,3}; // ERROR",
        "Not allocating memory after declaration",
        "Using wrong syntax: int arr[] vs int[] arr (both work, but be consistent)",
        "Forgetting that array literal creates anonymous array"
      ],
      interviewQuestions: [
        { question: "What is the difference between int[] arr and int arr[]?", answer: "Both declare an array of integers. int[] arr is preferred (keeps type together). int arr[] is C-style, allowed but less readable." },
        { question: "How do you create an array without specifying values?", answer: "Use new: int[] arr = new int[5]; This creates array of 5 integers initialized to 0." }
      ],
      quickRevision: "Declaration: int[] arr; Allocation: arr = new int[5]; Literal: int[] arr = {1,2,3}; Don't mix literal with new[size].",
      practicePrompt: "Create an array of 5 integers using array literal with values 10, 20, 30, 40, 50.",
      quickCheck: {
        question: "Which is correct array initialization?",
        options: [
          "int arr = {1, 2, 3};",
          "int[] arr = {1, 2, 3};",
          "int[] arr = new int{1, 2, 3};",
          "array int[] arr = [1, 2, 3];"
        ],
        answer: 1,
        explanation: "int[] arr = {1, 2, 3}; is the correct syntax for array literal initialization. No 'new' keyword or size needed with literals."
      }
    }
  },
  {
    slug: "array-indexing",
    title: "Array Indexing",
    content: {
      definition: "Array indexing is accessing individual elements using their position number (index). Java arrays use zero-based indexing, meaning the first element is at index 0.",
      whyItMatters: "Understanding indexing is essential for reading, modifying, and processing array elements correctly.",
      coreConcept: "Index ranges from 0 to length-1. Accessing invalid index throws ArrayIndexOutOfBoundsException. Use [] operator with index to read or write.",
      syntax: "arrayName[index]  // Read\narrayName[index] = value;  // Write",
      javaExample: "int[] scores = {85, 90, 78, 92, 88};\n\n// Read elements\nint first = scores[0];   // 85\nint last = scores[4];    // 88\nint last2 = scores[scores.length - 1];  // 88 (dynamic)\n\n// Modify elements\nscores[2] = 80;  // Change 78 to 80\n\n// Invalid: scores[5] throws ArrayIndexOutOfBoundsException",
      howItWorks: "Index 0 → first element. Index 1 → second element. Index length-1 → last element. The JVM checks bounds at runtime and throws exception if invalid.",
      realWorldUse: "Accessing specific elements, iterating through arrays, swapping elements, processing based on position.",
      commonMistakes: [
        "Using 1-based indexing (first element at index 1)",
        "Accessing index = length instead of length-1",
        "Not handling ArrayIndexOutOfBoundsException",
        "Off-by-one errors in loops"
      ],
      interviewQuestions: [
        { question: "What exception occurs when accessing invalid array index?", answer: "ArrayIndexOutOfBoundsException. This is a runtime exception indicating the index is negative or >= array length." },
        { question: "How do you access the last element of an array?", answer: "array[array.length - 1]. Never hardcode the index; use length-1 for flexibility." }
      ],
      quickRevision: "Index 0 to length-1. Access: arr[i]. Last element: arr[arr.length-1]. Invalid index = exception.",
      practicePrompt: "Create an array of 5 numbers and print the first and last elements.",
      quickCheck: {
        question: "What is the index of the 3rd element in an array?",
        options: ["3", "2", "1", "4"],
        answer: 1,
        explanation: "Arrays use zero-based indexing. 1st element = index 0, 2nd = index 1, 3rd = index 2."
      }
    }
  },
  {
    slug: "traversing-arrays",
    title: "Traversing Arrays",
    content: {
      definition: "Traversing means visiting each element of an array. This is typically done with loops to read, process, or modify every element.",
      whyItMatters: "Array traversal is fundamental to almost every array operation: searching, summing, printing, transforming data.",
      coreConcept: "Two common approaches: 1) Traditional for loop with index: for (int i = 0; i < arr.length; i++) 2) Enhanced for loop (for-each): for (int item : arr). Choose based on whether you need the index.",
      syntax: "// Traditional for loop\nfor (int i = 0; i < array.length; i++) {\n    System.out.println(array[i]);\n}\n\n// Enhanced for loop\nfor (int element : array) {\n    System.out.println(element);\n}",
      javaExample: "int[] numbers = {10, 20, 30, 40, 50};\n\n// Traditional for - use when you need index\nfor (int i = 0; i < numbers.length; i++) {\n    System.out.println(\"Index \" + i + \": \" + numbers[i]);\n}\n\n// Enhanced for - use when you only need values\nfor (int num : numbers) {\n    System.out.println(num);\n}\n\n// Modify elements (must use traditional for)\nfor (int i = 0; i < numbers.length; i++) {\n    numbers[i] *= 2;  // Double each element\n}",
      howItWorks: "Traditional for: Start at 0, continue while i < length, increment i, access arr[i]. Enhanced for: Iterates over each element, assigns to loop variable. Enhanced for cannot modify original array.",
      realWorldUse: "Printing array contents, summing values, searching, copying, transforming data, validation.",
      commonMistakes: [
        "Using <= instead of < in loop condition",
        "Trying to modify array with enhanced for loop",
        "Starting at index 1 instead of 0",
        "Not using .length (hardcoding size)"
      ],
      interviewQuestions: [
        { question: "When should you use enhanced for loop vs traditional for loop?", answer: "Use enhanced for when you only need to read values. Use traditional for when you need the index, want to modify elements, or iterate backwards." },
        { question: "Can you modify array elements using enhanced for loop?", answer: "No. The loop variable is a copy, not a reference. Modifying it doesn't affect the original array." }
      ],
      quickRevision: "for (i=0; i<arr.length; i++) - use index. for (item : arr) - read-only. Don't use <= in condition.",
      practicePrompt: "Traverse an array and print all even numbers using both loop types.",
      quickCheck: {
        question: "What is wrong with: for (int i = 0; i <= arr.length; i++)",
        options: [
          "Nothing wrong",
          "Should use < instead of <=",
          "Should start at 1",
          "Missing i++"
        ],
        answer: 1,
        explanation: "Using <= causes ArrayIndexOutOfBoundsException when i equals arr.length. Use < to stop at last valid index."
      }
    }
  },
  {
    slug: "taking-array-input",
    title: "Taking Array Input",
    content: {
      definition: "Taking array input means reading values from the user (or file) and storing them in an array. This requires knowing the size first, then reading each element.",
      whyItMatters: "Interactive programs often need to process user-provided data. Learning to populate arrays from input is essential.",
      coreConcept: "First read the size, then create the array, then loop to read each element. Use Scanner methods appropriate for the data type.",
      syntax: "Scanner sc = new Scanner(System.in);\nSystem.out.print(\"Enter size: \");\nint n = sc.nextInt();\nint[] arr = new int[n];\n\nfor (int i = 0; i < n; i++) {\n    arr[i] = sc.nextInt();\n}",
      javaExample: "Scanner sc = new Scanner(System.in);\n\n// Read array size\nSystem.out.print(\"Enter number of elements: \");\nint n = sc.nextInt();\n\n// Create array\nint[] numbers = new int[n];\n\n// Read elements\nSystem.out.println(\"Enter \" + n + \" numbers:\");\nfor (int i = 0; i < n; i++) {\n    numbers[i] = sc.nextInt();\n}\n\n// Print the array\nSystem.out.println(\"You entered:\");\nfor (int num : numbers) {\n    System.out.print(num + \" \");\n}",
      howItWorks: "1. Read size from user\n2. Allocate array with that size\n3. Loop from 0 to size-1\n4. Read each element and store at index i\n5. Close Scanner",
      realWorldUse: "Processing user datasets, input validation, collecting scores, reading configuration, batch input.",
      commonMistakes: [
        "Creating array before reading size",
        "Reading values into wrong index",
        "Not handling invalid input (non-numeric)",
        "Forgetting to close Scanner"
      ],
      interviewQuestions: [
        { question: "Why do we need to know the array size before creating it?", answer: "Arrays have fixed size. We must specify size at creation time. Alternatively, use ArrayList for dynamic sizing." },
        { question: "How would you handle invalid input when reading array elements?", answer: "Use try-catch for InputMismatchException, or validate input before storing: while (!sc.hasNextInt()) { sc.next(); }" }
      ],
      quickRevision: "Read size → create array → loop to read elements. Use appropriate Scanner method for type.",
      practicePrompt: "Write a program that reads 5 names into a String array and prints them.",
      quickCheck: {
        question: "What comes first when taking array input?",
        options: [
          "Read elements",
          "Create array",
          "Read size",
          "Print array"
        ],
        answer: 2,
        explanation: "You must read the size first because arrays require size at creation time. Size determines how many elements to allocate."
      }
    }
  },
  {
    slug: "searching-arrays",
    title: "Searching Arrays",
    content: {
      definition: "Searching means finding whether a value exists in an array and optionally finding its position (index). Linear search is the simplest approach.",
      whyItMatters: "Searching is fundamental to many operations: validation, finding duplicates, checking existence, locating specific data.",
      coreConcept: "Linear search: iterate through array, compare each element with target. If found, return index. If not found after all elements, return -1 (convention).",
      syntax: "int index = -1;\nfor (int i = 0; i < arr.length; i++) {\n    if (arr[i] == target) {\n        index = i;\n        break;\n    }\n}",
      javaExample: "// Linear search\nint[] numbers = {15, 8, 22, 45, 9};\nint target = 22;\nint foundIndex = -1;\n\nfor (int i = 0; i < numbers.length; i++) {\n    if (numbers[i] == target) {\n        foundIndex = i;\n        break;\n    }\n}\n\nif (foundIndex != -1) {\n    System.out.println(\"Found at index: \" + foundIndex);\n} else {\n    System.out.println(\"Not found\");\n}\n\n// Check if exists\nboolean exists = false;\nfor (int num : numbers) {\n    if (num == target) {\n        exists = true;\n        break;\n    }\n}",
      howItWorks: "Start at index 0. Compare each element with target. If match, record index and stop. If loop completes without finding, element doesn't exist.",
      realWorldUse: "Finding user in list, checking if value exists, locating item by ID, validating input, finding duplicates.",
      commonMistakes: [
        "Continuing search after finding element (wasteful)",
        "Not handling not-found case",
        "Using == for String comparison (use .equals())",
        "Returning 0 for not found (confuses with first element)"
      ],
      interviewQuestions: [
        { question: "What value is conventionally returned when search fails?", answer: "-1. Since valid indices are 0 to length-1, -1 clearly indicates not found." },
        { question: "How do you search for a String in a String array?", answer: "Use .equals() instead of ==: if (arr[i].equals(target)). == compares references, .equals() compares content." }
      ],
      quickRevision: "Linear search: check each element. Return index if found, -1 if not. Use break to stop early. Use .equals() for Strings.",
      practicePrompt: "Write a method that searches for a number and returns its index, or -1 if not found.",
      quickCheck: {
        question: "Why return -1 when element is not found?",
        options: [
          "It's the only negative number",
          "It's not a valid array index",
          "It means empty array",
          "It's the first element"
        ],
        answer: 1,
        explanation: "Valid array indices are 0 to length-1. -1 is clearly invalid, making it unambiguous that the element wasn't found."
      }
    }
  },
  {
    slug: "min-max-sum",
    title: "Min, Max & Sum",
    content: {
      definition: "Finding minimum, maximum, and sum are common array operations that involve traversing the array and tracking or accumulating values.",
      whyItMatters: "These operations are fundamental to data analysis, statistics, scoring systems, and many algorithms.",
      coreConcept: "Initialize min and max with first element (or extreme values). Initialize sum with 0. Traverse array, updating min/max/sum at each element.",
      syntax: "int min = arr[0];\nint max = arr[0];\nint sum = 0;\n\nfor (int num : arr) {\n    if (num < min) min = num;\n    if (num > max) max = num;\n    sum += num;\n}",
      javaExample: "int[] numbers = {45, 23, 89, 12, 67};\n\n// Find minimum\nint min = numbers[0];\nfor (int i = 1; i < numbers.length; i++) {\n    if (numbers[i] < min) {\n        min = numbers[i];\n    }\n}\nSystem.out.println(\"Min: \" + min);  // 12\n\n// Find maximum\nint max = numbers[0];\nfor (int num : numbers) {\n    if (num > max) {\n        max = num;\n    }\n}\nSystem.out.println(\"Max: \" + max);  // 89\n\n// Find sum\nint sum = 0;\nfor (int num : numbers) {\n    sum += num;\n}\nSystem.out.println(\"Sum: \" + sum);  // 236\n\n// Calculate average\ndouble avg = (double) sum / numbers.length;\nSystem.out.println(\"Average: \" + avg);  // 47.2",
      howItWorks: "Min: Assume first is minimum, update when smaller found. Max: Assume first is maximum, update when larger found. Sum: Start at 0, add each element.",
      realWorldUse: "Statistical analysis, grading (highest/lowest score), price ranges, totals, averages, data normalization.",
      commonMistakes: [
        "Initializing min with 0 or max with 0 (might be wrong)",
        "Not handling empty arrays",
        "Integer overflow for large sums (use long)",
        "Starting loop at index 0 when initialized with arr[0]"
      ],
      interviewQuestions: [
        { question: "Why initialize min and max with the first element instead of 0?", answer: "If all elements are negative, initializing min to 0 gives wrong result. Using first element ensures correctness regardless of actual values." },
        { question: "How do you handle potential integer overflow when summing?", answer: "Use long instead of int: long sum = 0; This can handle sums up to 9 quintillion." }
      ],
      quickRevision: "Initialize min/max with first element. Sum starts at 0. Single traversal can find all three. Use long for large sums.",
      practicePrompt: "Find and print the min, max, and average of an integer array.",
      quickCheck: {
        question: "What is wrong with: int max = 0; for finding max?",
        options: [
          "Nothing wrong",
          "Won't work if all elements are negative",
          "Should use min = 0",
          "Index should start at 1"
        ],
        answer: 1,
        explanation: "If all elements are negative (e.g., -5, -3, -8), max stays 0 which is wrong. Correct max should be -3 (the largest, though still negative)."
      }
    }
  },
  {
    slug: "two-dimensional-arrays",
    title: "Two-Dimensional Arrays",
    content: {
      definition: "A 2D array is an array of arrays, forming a matrix or grid structure. Elements are accessed using two indices: row and column.",
      whyItMatters: "2D arrays represent grids, matrices, game boards, spreadsheets, and any data that naturally fits in rows and columns.",
      coreConcept: "Declaration: int[][] matrix = new int[rows][cols]; Access: matrix[row][col]; Nested loops for traversal: outer for rows, inner for columns.",
      syntax: "int[][] matrix = new int[3][4];  // 3 rows, 4 columns\n\nmatrix[0][0] = 1;  // first row, first column\nmatrix[2][3] = 5;  // last row, last column",
      javaExample: "// Declare and initialize\nint[][] matrix = {\n    {1, 2, 3},\n    {4, 5, 6},\n    {7, 8, 9}\n};\n\n// Access element\nSystem.out.println(matrix[1][2]);  // 6 (row 1, col 2)\n\n// Traverse with nested loops\nfor (int i = 0; i < matrix.length; i++) {  // rows\n    for (int j = 0; j < matrix[i].length; j++) {  // columns\n        System.out.print(matrix[i][j] + \" \");\n    }\n    System.out.println();\n}\n\n// Jagged array (different row lengths)\nint[][] jagged = new int[3][];\njagged[0] = new int[2];\njagged[1] = new int[5];\njagged[2] = new int[3];",
      howItWorks: "2D array is array of references to 1D arrays. matrix.length gives number of rows. matrix[i].length gives columns in row i. Each row can have different length (jagged).",
      realWorldUse: "Game boards (chess, tic-tac-toe), spreadsheets, image pixels, matrices in math, seating arrangements, maps.",
      commonMistakes: [
        "Using matrix.length for columns (it's rows)",
        "Forgetting that matrix[i].length varies for jagged arrays",
        "Accessing matrix[row][col] in wrong order",
        "Not initializing inner arrays for jagged arrays"
      ],
      interviewQuestions: [
        { question: "What does matrix.length and matrix[0].length represent?", answer: "matrix.length = number of rows. matrix[0].length = number of columns in first row (use matrix[i].length for variable columns)." },
        { question: "Can different rows in a 2D array have different lengths?", answer: "Yes, this is called a jagged array. Each row is a separate array and can have different sizes." }
      ],
      quickRevision: "int[][] matrix = new int[rows][cols]; matrix[row][col]. Nested loops for traversal. matrix.length = rows.",
      practicePrompt: "Create a 3x3 matrix with values 1-9 and print it row by row.",
      quickCheck: {
        question: "How do you get the number of columns in a 2D array?",
        options: [
          "matrix.length",
          "matrix[0].length",
          "matrix.length[0]",
          "matrix.size()"
        ],
        answer: 1,
        explanation: "matrix.length gives rows. matrix[0].length gives columns in row 0. For rectangular arrays, this works. For jagged, use matrix[i].length for each row."
      }
    }
  }
];
