// Long-form theory for Programming Fundamentals module 6: arrays. Original writing.
import { LessonTheory } from './utils';

const ARRAYS_TUT = { title: "The Java Tutorials: Arrays", url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html" };
const ARRAYS_API = { title: "Java SE API: java.util.Arrays", url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Arrays.html" };
const JLS_ARRAYS = { title: "JLS Chapter 10: Arrays", url: "https://docs.oracle.com/javase/specs/jls/se21/html/jls-10.html" };
const SCANNER = { title: "Java SE API: Scanner", url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Scanner.html" };
const CP_ALGO_BS = { title: "cp-algorithms: Binary Search", url: "https://cp-algorithms.com/num_methods/binary_search.html" };
const WIKI_BS = { title: "Wikipedia: Binary search algorithm", url: "https://en.wikipedia.org/wiki/Binary_search_algorithm" };
const CS50 = { title: "Harvard CS50: Introduction to Computer Science (free course)", url: "https://cs50.harvard.edu/x/" };

export const pfArraysTheory: Record<string, LessonTheory> = {
  "what-is-an-array": {
    theory: `An array is a fixed-size, ordered collection of values of the same type, stored in one contiguous block of memory and accessed by numeric index. Arrays let one variable hold a hundred test scores or a million pixels, and they're the foundation that lists, strings, matrices, heaps and hash tables are built on. This lesson explains what arrays are, why contiguous storage makes index access fast, their fixed-size limitation, how they live in memory in Java, and when to choose a list instead.

## Why arrays exist

Without arrays, storing the marks of five students needs five variables:

~~~java
int m1 = 78, m2 = 92, m3 = 85, m4 = 64, m5 = 71;
~~~

Computing the average means writing every name, and handling 500 students or a number chosen at runtime is impossible. An array stores them all under one name:

~~~java
int[] marks = {78, 92, 85, 64, 71};
int sum = 0;
for (int m : marks) sum += m;
~~~

The same loop works for 5 students or 5 million.

## Key properties

- **Same type**: every element has the declared type, such as \`int\` or \`String\`
- **Fixed size**: the length is set when the array is created and never changes
- **Indexed from 0**: the first element is \`marks[0]\`, the last is \`marks[marks.length - 1]\`
- **Contiguous**: elements sit next to each other in memory
- **Ordered**: elements keep their positions until you change them

## Why index access is fast

Because elements are contiguous and equally sized, the computer finds any element with arithmetic:

~~~
address of marks[i] = start address + i × element size
~~~

Reading \`marks[0]\` or \`marks[999999]\` takes the same time: **O(1)**, constant time. This **random access** is arrays' defining strength. Contiguity also helps CPU caches, which load neighbouring memory together, so looping through an array is extremely fast in practice.

## The cost of fixed size

An array can't grow or shrink. To add an element to a full array, you must create a bigger array and copy everything over, which is O(n). Inserting or deleting in the middle requires shifting later elements, also O(n).

| Operation | Array |
|---|---|
| Read or write by index | O(1) |
| Search unsorted array | O(n) |
| Search sorted array (binary search) | O(log n) |
| Insert or delete in the middle | O(n), shifting elements |
| Grow beyond capacity | O(n), copy to a new array |

## Arrays are objects in Java

In Java, an array is an object on the heap. The variable holds a reference to it:

~~~java
int[] a = {1, 2, 3};
int[] b = a;          // b refers to the same array
b[0] = 99;
System.out.println(a[0]);   // 99
~~~

Assigning an array variable copies the reference, not the elements. Passing an array to a method lets the method modify the caller's elements. Every array also carries its length in a field, \`a.length\` (no parentheses; it's a field, not a method).

## Bounds checking

Java checks every index access. Reading \`marks[5]\` on a five-element array throws \`ArrayIndexOutOfBoundsException\`, as does a negative index. In C, the same mistake silently reads or overwrites neighbouring memory, a major source of security vulnerabilities. Java's check costs a little time but prevents that class of bug.

## Default values

A new array's elements are initialized automatically: 0 for numeric types, false for boolean, \`'\\u0000'\` for char, and null for object types such as String. An array of Strings created with \`new String[3]\` holds three nulls, not three empty strings, so calling a method on an element throws NullPointerException until you assign it.

## Arrays of objects

An array of objects holds **references**, each pointing to a separate object elsewhere on the heap:

~~~java
String[] names = {"Asha", "Ravi"};
~~~

The array stores two references; the String objects live separately.

## Arrays versus ArrayList

| | Array | ArrayList |
|---|---|---|
| Size | Fixed at creation | Grows automatically |
| Element types | Primitives or objects | Objects only (Integer, not int) |
| Syntax | \`arr[i]\`, \`arr.length\` | \`list.get(i)\`, \`list.size()\` |
| Performance | Slightly faster, less memory for primitives | Boxing overhead for numbers |
| Utilities | \`Arrays\` class | Many built-in methods |

Use arrays when the size is known and fixed, for primitive data where performance matters, and in algorithm problems; use ArrayList when the number of elements changes. ArrayList is itself built on an array that it replaces with a larger one when full.

## Where arrays appear

Arrays underpin strings (an array of characters internally), images (arrays of pixels), matrices, buffers for files and networks, and data structures such as stacks, queues, heaps and hash tables. Most algorithm interview questions start with "given an array".

## How interviewers test this

Expect "What is an array and why is access O(1)?", "Array vs ArrayList?", "What are default values in a new array?" and aliasing output questions. Explain contiguous storage and address arithmetic, fixed size and O(n) insertion, references and \`length\`, and bounds checking.`,
    sources: [ARRAYS_TUT, JLS_ARRAYS],
  },

  "array-declaration-initialization": {
    theory: `Before using an array, you declare a variable to hold it and create the array object, either with a size or with initial values. Java offers several syntaxes for this, and the differences matter: some create default-filled arrays, some fill values directly, and some only work at declaration. This lesson covers declaration styles, creating arrays with \`new\`, array literals, default values, filling and copying arrays, and common errors.

## Declaring an array variable

~~~java
int[] scores;        // preferred style: the type is "int array"
int scores2[];       // also legal, inherited from C; avoid it
~~~

A declaration creates only a reference variable, initially with no array. Using it before assigning an array is a compile error for local variables, or a NullPointerException for fields left null.

## Creating an array with new

~~~java
int[] scores = new int[5];          // five ints, all 0
String[] names = new String[3];     // three nulls
boolean[] seen = new boolean[100];  // 100 falses
~~~

The size can be any int expression evaluated at runtime:

~~~java
int n = sc.nextInt();
int[] data = new int[n];
~~~

A negative size throws \`NegativeArraySizeException\`. A size of zero is legal and creates an empty array, useful as a return value meaning "no results" instead of null.

## Default values

| Element type | Default |
|---|---|
| \`int\`, \`long\`, \`short\`, \`byte\` | 0 |
| \`double\`, \`float\` | 0.0 |
| \`char\` | \`'\\u0000'\` |
| \`boolean\` | false |
| Any object type | null |

## Array literals

When you know the values, list them in braces:

~~~java
int[] primes = {2, 3, 5, 7, 11};
String[] days = {"Mon", "Tue", "Wed"};
~~~

The length is inferred from the number of values. This short form works only in a declaration. To assign a new array to an existing variable, include the type:

~~~java
primes = {13, 17};                 // compile error
primes = new int[]{13, 17};        // correct
~~~

The \`new int[]{...}\` form also works for passing an array directly to a method: \`printAll(new int[]{1, 2, 3});\`. You can't give both a size and values: \`new int[3]{1, 2, 3}\` is an error.

## Filling an array

~~~java
int[] dist = new int[n];
Arrays.fill(dist, Integer.MAX_VALUE);   // every element set to the same value

int[] squares = new int[10];
for (int i = 0; i < squares.length; i++) {
    squares[i] = i * i;                 // computed values
}
~~~

\`Arrays.setAll(squares, i -> i * i)\` does the computed version in one line.

## Copying arrays

Assignment copies only the reference:

~~~java
int[] a = {1, 2, 3};
int[] b = a;              // same array
~~~

To copy the elements, use one of these:

~~~java
int[] c = a.clone();                       // full copy
int[] d = Arrays.copyOf(a, a.length);      // full copy
int[] e = Arrays.copyOf(a, 5);             // copy and pad with zeros: {1, 2, 3, 0, 0}
int[] f = Arrays.copyOfRange(a, 1, 3);     // {2, 3}: from index 1 up to, not including, 3
System.arraycopy(a, 0, target, 0, a.length);   // copy into an existing array
~~~

For arrays of objects, these copies are **shallow**: the new array holds the same object references.

## Comparing arrays

\`a == b\` checks whether two variables refer to the same array. \`a.equals(b)\` does the same, because arrays don't override equals. To compare contents, use \`Arrays.equals(a, b)\`, or \`Arrays.deepEquals\` for nested arrays.

## Printing arrays

\`System.out.println(arr)\` prints something like \`[I@1b6d3586\`. Use \`Arrays.toString(arr)\` to see \`[1, 2, 3]\`.

## Arrays of objects need two steps

~~~java
Student[] students = new Student[3];   // three null references
students[0] = new Student("Asha");     // each element needs its own object
~~~

Forgetting the second step leads to NullPointerException when calling methods on elements.

## var with arrays

\`var nums = new int[]{1, 2, 3};\` works, but \`var nums = {1, 2, 3};\` doesn't, because an array literal alone has no type to infer.

## Choosing a size

When the count isn't known up front, either read it first (\`n\`, then the elements), over-allocate with a maximum and track how many slots are used, or use an ArrayList and convert at the end with \`list.stream().mapToInt(Integer::intValue).toArray()\`.

## How interviewers test this

Expect "What are the ways to initialize an array?", "What are default values?", "How do you copy an array?" and "Why does \`arr1 == arr2\` return false for equal contents?" Show new with size, literals and \`new int[]{...}\`, list defaults, contrast reference assignment with clone and Arrays.copyOf, and use Arrays.equals and Arrays.toString.`,
    sources: [ARRAYS_TUT, ARRAYS_API],
  },

  "array-indexing": {
    theory: `Every element of an array has an index: its position, counting from zero. Indexing is how you read and write individual elements, and getting indices right is the difference between a working program and an \`ArrayIndexOutOfBoundsException\`. This lesson explains zero-based indexing and why it exists, valid index ranges, reading and writing elements, index arithmetic for neighbours and the middle, using values as indices, and the classic off-by-one mistakes.

## Zero-based indexing

~~~java
String[] colors = {"red", "green", "blue"};
System.out.println(colors[0]);   // red
System.out.println(colors[2]);   // blue
~~~

For an array of length n, valid indices are **0 to n - 1**. The last element is always \`arr[arr.length - 1]\`.

Why start at zero? The index is an **offset** from the array's start: the first element is zero steps from the beginning. The address calculation, start + index × size, needs no adjustment. Most mainstream languages, including C, Java, Python and JavaScript, use zero-based indexing.

## Reading and writing

~~~java
int[] scores = new int[4];
scores[0] = 85;              // write
scores[3] = scores[0] + 5;   // read, then write: 90
scores[1]++;                 // increment in place
~~~

An indexed element behaves like an ordinary variable: it can be assigned, incremented, passed to methods or used in expressions.

## Out of bounds

~~~java
int[] a = new int[3];
a[3] = 10;     // ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3
a[-1] = 10;    // also out of bounds
~~~

Java checks every access at runtime. The exception message names the bad index and the length, which tells you exactly what went wrong. These checks can't be turned off, and they prevent the memory corruption that out-of-bounds writes cause in C.

## Index arithmetic

Many algorithms compute indices:

~~~java
int first = arr[0];
int last = arr[arr.length - 1];
int mid = arr[arr.length / 2];         // middle (upper middle for even lengths)
int prev = arr[i - 1];                 // valid only when i >= 1
int next = arr[i + 1];                 // valid only when i <= length - 2
int mirror = arr[arr.length - 1 - i];  // element at the same distance from the end
~~~

Before using \`i - 1\` or \`i + 1\`, check that the result stays within 0 to length - 1. Loops comparing neighbours usually run \`i\` from 1, or stop at \`length - 1\`:

~~~java
for (int i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) System.out.println("Drop at index " + i);
}
~~~

## Circular indexing

The remainder operator wraps indices around, treating the array as a ring:

~~~java
int nextIndex = (i + 1) % arr.length;                    // after the last comes the first
int prevIndex = (i - 1 + arr.length) % arr.length;       // before the first comes the last
~~~

Adding \`arr.length\` before taking the remainder avoids a negative result, since Java's \`%\` keeps the sign of the left operand. Circular indexing is used in rotating arrays, ring buffers and round-robin scheduling.

## Using values as indices

When values fall in a small known range, they can serve as indices into a counting array:

~~~java
int[] count = new int[101];          // marks from 0 to 100
for (int m : marks) count[m]++;      // count[m] = how many students scored m

int[] letters = new int[26];
for (char c : word.toCharArray()) letters[c - 'a']++;   // 'a' maps to 0
~~~

This technique, the basis of **counting sort** and frequency tables, gives O(1) lookups without a map. Validate values first, since an unexpected value becomes an out-of-bounds index.

## Index versus value

A frequent bug mixes up the position and the content:

~~~java
int[] nums = {10, 20, 30};
for (int i = 0; i < nums.length; i++) {
    System.out.println(i);         // prints 0, 1, 2: indices
    System.out.println(nums[i]);   // prints 10, 20, 30: values
}
~~~

When a problem asks to "return the index of the maximum", track the index, not the value.

## Off-by-one errors

- \`for (int i = 0; i <= arr.length; i++)\`: one iteration too many
- \`for (int i = 1; i < arr.length; i++)\`: skips index 0 by accident
- \`arr[arr.length]\` instead of \`arr[arr.length - 1]\` for the last element
- computing a range \`[start, end]\` but looping with \`< end\`, which skips the last element

Check the first and last index of every loop explicitly. Many APIs use **half-open ranges**, where the start is included and the end excluded, such as \`Arrays.copyOfRange(a, 1, 3)\` and \`substring(1, 3)\`. With half-open ranges, the length is \`end - start\`, and adjacent ranges such as [0, 3) and [3, 6) don't overlap.

## Index of the middle

For a range from \`low\` to \`high\`, the middle index \`(low + high) / 2\` can overflow for large values; \`low + (high - low) / 2\` is the safe form used in binary search.

## How interviewers test this

Expect "Why do arrays start at 0?", out-of-bounds output questions, neighbour comparisons, circular rotation, and frequency counting with an array. Explain indices as offsets, the valid range 0 to n - 1, boundary checks before \`i - 1\` and \`i + 1\`, the circular formula with \`%\`, and half-open ranges.`,
    sources: [ARRAYS_TUT, JLS_ARRAYS],
  },

  "traversing-arrays": {
    theory: `Traversing an array means visiting its elements one by one, usually with a loop, to read, print, update or analyse them. Almost every array problem starts with a traversal: summing values, finding a maximum, counting matches or transforming elements. Java offers several ways to traverse, and choosing the right one depends on whether you need indices, direction or modification. This lesson covers forward and backward traversal, the for-each loop, modifying elements, partial and two-pointer traversals, and stream-based alternatives.

## Forward traversal with an index

~~~java
int[] nums = {4, 7, 1, 9};
for (int i = 0; i < nums.length; i++) {
    System.out.println("Index " + i + ": " + nums[i]);
}
~~~

The condition \`i < nums.length\` visits indices 0 to length - 1. Using \`nums.length\` instead of a hard-coded number keeps the loop correct when the array size changes.

## The for-each loop

When you need each value but not its position:

~~~java
int sum = 0;
for (int x : nums) {
    sum += x;
}
~~~

for-each avoids index errors and reads naturally. Its limits: no index, no backward traversal, no skipping, and assigning to the loop variable doesn't change the array.

## Backward traversal

~~~java
for (int i = nums.length - 1; i >= 0; i--) {
    System.out.print(nums[i] + " ");
}
~~~

Start at the last valid index, \`length - 1\`, and continue while \`i >= 0\`. Backward traversal is useful for printing in reverse, processing from the right (such as finding the next greater element), and removing items from a list by index without skipping elements.

## Modifying elements

Modification requires the index:

~~~java
for (int i = 0; i < nums.length; i++) {
    nums[i] *= 2;          // doubles every element in place
}

for (int x : nums) {
    x *= 2;                // changes only the local copy: the array is unchanged
}
~~~

This difference is a common interview question.

## Partial traversal

Traverse a sub-range by adjusting the start and end:

~~~java
for (int i = 2; i < 5; i++) { ... }          // indices 2, 3, 4
for (int i = 0; i < nums.length; i += 2) { ... }   // even indices
for (int i = 1; i < nums.length; i++) {      // compare each element with the previous one
    if (nums[i] > nums[i - 1]) increases++;
}
~~~

## Early termination

Stop as soon as the answer is known:

~~~java
int index = -1;
for (int i = 0; i < nums.length; i++) {
    if (nums[i] == target) {
        index = i;
        break;
    }
}
~~~

## Two-pointer traversal

Two indices moving toward each other solve many problems in one pass:

~~~java
// Reverse an array in place
int left = 0, right = nums.length - 1;
while (left < right) {
    int tmp = nums[left];
    nums[left] = nums[right];
    nums[right] = tmp;
    left++;
    right--;
}
~~~

The same technique checks palindromes and finds pairs with a given sum in sorted arrays. Another variant uses a slow and a fast pointer moving in the same direction, for example to remove duplicates from a sorted array in place.

## Traversing parallel arrays

When related data lives in separate arrays of the same length, one index walks both:

~~~java
String[] names = {"Asha", "Ravi"};
int[] marks = {92, 78};
for (int i = 0; i < names.length; i++) {
    System.out.println(names[i] + ": " + marks[i]);
}
~~~

In larger programs, an array of objects (a \`Student\` class with name and marks) is usually clearer than parallel arrays.

## Printing arrays

\`Arrays.toString(nums)\` prints \`[4, 7, 1, 9]\` in one call. For custom formats, traverse and print with separators, taking care not to leave a trailing comma or space.

## Streams

Java streams perform common traversals declaratively:

~~~java
int sum = Arrays.stream(nums).sum();
int max = Arrays.stream(nums).max().getAsInt();
long evens = Arrays.stream(nums).filter(x -> x % 2 == 0).count();
int[] doubled = Arrays.stream(nums).map(x -> x * 2).toArray();
~~~

Streams are concise for straightforward pipelines. Explicit loops remain clearer for traversals with complex conditions, early exits or index arithmetic, and they're expected in most coding interviews.

## Complexity

A single traversal visits each element once: O(n) time. Nested traversals over the same array are O(n²). Many interview optimizations replace nested traversals with one traversal plus extra memory, such as a HashSet or a prefix-sum array.

## Choosing a traversal

| Need | Traversal |
|---|---|
| Read every value | for-each |
| Need the index, or to modify | Indexed for loop |
| Reverse order | Backward indexed loop |
| Compare neighbours | Indexed loop starting at 1 |
| Work from both ends | Two pointers with while |
| Stop at a match | Loop with break or return |

## How interviewers test this

Expect array reversal in place, printing in reverse, "why doesn't modifying the for-each variable change the array?" and two-pointer problems. Show forward, backward and two-pointer traversals, explain the for-each copy behaviour, and state the O(n) cost of a single pass.`,
    sources: [ARRAYS_TUT, CS50],
  },

  "taking-array-input": {
    theory: `Many programs, and nearly every coding-round problem, start by reading a list of values into an array. Input usually arrives as a count followed by the values, on one line or several. Reading it correctly, efficiently and without off-by-one or newline mistakes is a practical skill that saves time in every contest and interview. This lesson covers the standard input formats, reading with Scanner, reading space-separated lines, 2D input, fast input with BufferedReader, and common pitfalls.

## The standard format

~~~
5
10 20 30 40 50
~~~

The first line gives n, the number of elements; the second gives the values.

~~~java
Scanner sc = new Scanner(System.in);
int n = sc.nextInt();
int[] arr = new int[n];
for (int i = 0; i < n; i++) {
    arr[i] = sc.nextInt();
}
~~~

Because \`nextInt()\` reads tokens separated by any whitespace, this code works whether the values are on one line, several lines, or one per line.

## Prompting the user

In interactive programs, prompt before reading:

~~~java
System.out.print("How many numbers? ");
int n = sc.nextInt();
int[] arr = new int[n];
for (int i = 0; i < n; i++) {
    System.out.print("Enter number " + (i + 1) + ": ");
    arr[i] = sc.nextInt();
}
~~~

Show positions starting at 1 for humans while storing at index i. On online judges, **don't print prompts**: the judge compares all output, and prompts make the answer wrong.

## Reading other types

~~~java
double[] prices = new double[n];
for (int i = 0; i < n; i++) prices[i] = sc.nextDouble();

String[] words = new String[n];
for (int i = 0; i < n; i++) words[i] = sc.next();   // single words

char[] chars = sc.next().toCharArray();            // a whole word as characters
~~~

For full lines that contain spaces, use \`nextLine()\`, remembering to consume the leftover newline after a preceding \`nextInt()\`.

## Reading one line of values

When values arrive on a single line and the count isn't given:

~~~java
String line = sc.nextLine().trim();
String[] parts = line.split("\\\\s+");          // split on one or more spaces
int[] arr = new int[parts.length];
for (int i = 0; i < parts.length; i++) {
    arr[i] = Integer.parseInt(parts[i]);
}
~~~

A stream-based alternative: \`int[] arr = Arrays.stream(line.split("\\\\s+")).mapToInt(Integer::parseInt).toArray();\`. Splitting on \`"\\\\s+"\` instead of \`" "\` handles multiple spaces between values; the \`trim()\` removes leading spaces that would create an empty first token.

## Reading until input ends

When no count is given and values continue to the end of input:

~~~java
List<Integer> list = new ArrayList<>();
while (sc.hasNextInt()) {
    list.add(sc.nextInt());
}
~~~

An ArrayList grows as needed, since the final size isn't known in advance.

## Two-dimensional input

~~~
3 4
1 2 3 4
5 6 7 8
9 10 11 12
~~~

~~~java
int rows = sc.nextInt(), cols = sc.nextInt();
int[][] grid = new int[rows][cols];
for (int r = 0; r < rows; r++) {
    for (int c = 0; c < cols; c++) {
        grid[r][c] = sc.nextInt();
    }
}
~~~

Grids of characters, such as maze problems, are often read row by row as strings: \`char[] row = sc.next().toCharArray();\`.

## Multiple test cases

Contest problems often begin with the number of test cases:

~~~java
int t = sc.nextInt();
while (t-- > 0) {
    int n = sc.nextInt();
    int[] arr = new int[n];
    for (int i = 0; i < n; i++) arr[i] = sc.nextInt();
    System.out.println(solve(arr));
}
~~~

Create the array inside the loop so each test case starts fresh. Reusing state from a previous test case, such as a counter not reset, is a frequent cause of wrong answers.

## Fast input

Scanner is slow for large inputs, because it parses with regular expressions. For hundreds of thousands of numbers, use \`BufferedReader\`:

~~~java
BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
int n = Integer.parseInt(br.readLine().trim());
StringTokenizer st = new StringTokenizer(br.readLine());
int[] arr = new int[n];
for (int i = 0; i < n; i++) {
    arr[i] = Integer.parseInt(st.nextToken());
}
~~~

\`readLine()\` throws a checked IOException, so \`main\` needs \`throws IOException\`. The speed difference can be ten times or more on large inputs, enough to decide whether a solution passes the time limit.

## Pitfalls

- allocating the array before reading n, or with the wrong size
- reading with \`i <= n\`, which reads one value too many
- prompts printed on online judges
- \`nextLine()\` returning an empty string after \`nextInt()\`
- values larger than int range: read with \`nextLong()\` into a \`long[]\`
- forgetting to reset per-test-case state

## How interviewers test this

Expect to write input-reading code under time pressure, questions about Scanner versus BufferedReader, and handling multiple test cases. Show the count-then-values loop, splitting a line with \`"\\\\s+"\`, 2D input with nested loops, and BufferedReader with StringTokenizer for speed.`,
    sources: [SCANNER, ARRAYS_TUT],
  },

  "searching-arrays": {
    theory: `Searching means finding whether a value exists in an array and where. The two fundamental algorithms are **linear search**, which checks elements one by one and works on any array, and **binary search**, which repeatedly halves a sorted array and is dramatically faster for large data. Choosing between them, and implementing binary search without bugs, is one of the most tested skills in programming interviews. This lesson covers both algorithms, their complexity, common variants and pitfalls.

## Linear search

~~~java
static int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) {
            return i;          // found: return the index
        }
    }
    return -1;                 // not found
}
~~~

Returning -1 for "not found" is a widespread convention, because -1 can never be a valid index.

**Complexity**: in the worst case (target last or absent), it checks all n elements: **O(n)**. On average, about n/2 checks for a present element. It uses O(1) extra memory.

**Strengths**: works on unsorted data, on any type with equality, and on linked structures; for small arrays it's often the fastest choice because of its low overhead.

## Variants of linear search

- **last occurrence**: traverse backward, or keep updating the index without breaking
- **count occurrences**: don't stop at the first match; count every match
- **search by condition**: find the first even number, the first negative, and so on
- **objects**: compare with \`equals\`, not \`==\`: \`if (names[i].equals(target))\`

## Binary search

Binary search requires a **sorted** array. It compares the target with the middle element and discards the half that can't contain it:

~~~java
static int binarySearch(int[] arr, int target) {
    int low = 0, high = arr.length - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            low = mid + 1;       // target is in the right half
        } else {
            high = mid - 1;      // target is in the left half
        }
    }
    return -1;
}
~~~

Searching for 23 in \`{2, 5, 8, 12, 16, 23, 38, 56, 72, 91}\`: mid is index 4 (16), go right; mid is index 7 (56), go left; mid is index 5 (23), found. Three comparisons instead of six.

## Why binary search is fast

Each step halves the remaining range, so at most about log₂(n) + 1 steps are needed:

| n | Linear search (worst) | Binary search (worst) |
|---|---|---|
| 1,000 | 1,000 | 10 |
| 1,000,000 | 1,000,000 | 20 |
| 1,000,000,000 | 1,000,000,000 | 30 |

This is **O(log n)**: doubling the data adds only one more step.

## Getting binary search right

Binary search is famously prone to subtle mistakes. The details:

- **loop condition**: \`low <= high\` with \`high = length - 1\`; using \`<\` misses a single remaining element
- **updates**: \`low = mid + 1\` and \`high = mid - 1\`; using \`low = mid\` can loop forever when two elements remain
- **midpoint**: \`low + (high - low) / 2\` avoids the integer overflow that \`(low + high) / 2\` causes for large indices, a bug that existed for years in Java's own library before being fixed in 2006
- **sortedness**: on an unsorted array, binary search returns wrong answers silently

## Variants of binary search

Many problems need a boundary rather than any match:

~~~java
// First index where arr[i] >= target (lower bound)
int low = 0, high = arr.length;          // note: high = length
while (low < high) {
    int mid = low + (high - low) / 2;
    if (arr[mid] < target) low = mid + 1;
    else high = mid;
}
// low is the first index with arr[low] >= target, or arr.length if none
~~~

Lower bound finds the first occurrence of a duplicated value, the insertion point for a new value, and counts of elements below a threshold. The same halving idea extends to "binary search on the answer", such as finding the minimum capacity that satisfies a condition.

## Library methods

\`Arrays.binarySearch(arr, target)\` returns the index if found; otherwise it returns \`-(insertionPoint) - 1\`, a negative number encoding where the value would go. With duplicates, it may return any matching index. \`Collections.binarySearch\` does the same for sorted lists.

## Should you sort first?

Sorting costs O(n log n). For a single search, linear search (O(n)) is cheaper than sorting plus binary search. For many searches on the same data, sorting once and then binary searching repeatedly wins. For frequent lookups by value, a \`HashSet\` or \`HashMap\` gives O(1) average time without sorting.

## How interviewers test this

Expect "implement binary search", "what's the precondition?", "why use low + (high - low) / 2?", "find the first and last occurrence" and complexity comparisons. Write both searches, explain O(n) versus O(log n) with the halving argument, list the boundary details, and show the lower-bound variant.`,
    sources: [WIKI_BS, CP_ALGO_BS],
  },

  "min-max-sum": {
    theory: `Finding the minimum, maximum, sum and average of an array are the most common single-pass computations in programming. They appear on their own in early interview rounds and as building blocks inside harder problems: tracking the best price so far, normalizing data, or computing statistics. The logic looks short, but correct initialization, empty arrays, negative numbers and overflow all trip people up. This lesson covers each computation, combining them in one pass, second-largest and range problems, and library shortcuts.

## Sum

~~~java
int[] nums = {12, -4, 7, 19, 3};
long sum = 0;
for (int x : nums) {
    sum += x;
}
~~~

Start at 0, the identity for addition. Use a \`long\` accumulator when many large ints could exceed about 2.1 billion; overflow wraps silently and produces a wrong, possibly negative, total.

## Average

~~~java
double avg = nums.length == 0 ? 0 : (double) sum / nums.length;
~~~

Two traps: integer division (\`sum / nums.length\` with ints truncates the result) and division by zero for an empty array. Decide what an empty array should produce, such as 0, NaN or an exception, and handle it explicitly.

## Maximum and minimum

~~~java
int max = nums[0], min = nums[0];
for (int i = 1; i < nums.length; i++) {
    if (nums[i] > max) max = nums[i];
    if (nums[i] < min) min = nums[i];
}
~~~

Initialize with the **first element**. Initializing max to 0 fails for arrays of all negative numbers: the answer would be 0, which isn't even in the array. Alternatively, initialize max to \`Integer.MIN_VALUE\` and min to \`Integer.MAX_VALUE\`, which also works for empty input (returning those sentinels). \`Math.max(max, nums[i])\` is a concise alternative to the if statement.

Using the first element assumes the array isn't empty; guard against that first, for example by throwing \`IllegalArgumentException\`.

## Index of the maximum

When the position matters, track the index:

~~~java
int maxIdx = 0;
for (int i = 1; i < nums.length; i++) {
    if (nums[i] > nums[maxIdx]) maxIdx = i;
}
~~~

With \`>\`, ties keep the first occurrence; with \`>=\`, the last.

## All statistics in one pass

~~~java
int min = Integer.MAX_VALUE, max = Integer.MIN_VALUE;
long sum = 0;
for (int x : nums) {
    min = Math.min(min, x);
    max = Math.max(max, x);
    sum += x;
}
double avg = (double) sum / nums.length;
int range = max - min;
~~~

One traversal computes everything: O(n) time, O(1) extra memory. Separate loops for each statistic are also O(n), but a single pass is tidier and faster in practice.

## Second largest

~~~java
int first = Integer.MIN_VALUE, second = Integer.MIN_VALUE;
for (int x : nums) {
    if (x > first) {
        second = first;
        first = x;
    } else if (x > second && x < first) {
        second = x;
    }
}
~~~

The order of assignments matters: demote the old largest before storing the new one. The \`x < first\` check excludes duplicates of the maximum, so \`{5, 5, 3}\` gives 3 as the distinct second largest. If no second distinct value exists, \`second\` stays at \`Integer.MIN_VALUE\`; clarify with the interviewer what to return. Sorting and picking from the end also works but costs O(n log n) instead of O(n).

## Running maximum

Some problems need the best value seen so far at each step:

~~~java
// Best profit from one buy and one later sell
int minPrice = Integer.MAX_VALUE, bestProfit = 0;
for (int price : prices) {
    minPrice = Math.min(minPrice, price);
    bestProfit = Math.max(bestProfit, price - minPrice);
}
~~~

Tracking a running minimum turns an O(n²) "try every pair" solution into O(n). This stock-price problem is a classic interview question built entirely from min and max tracking.

## Product

A product starts at 1. Watch for overflow, which happens much faster than with sums, and for zeros, which make the whole product zero.

## Library shortcuts

~~~java
int sum = Arrays.stream(nums).sum();
int max = Arrays.stream(nums).max().getAsInt();
double avg = Arrays.stream(nums).average().orElse(0);
IntSummaryStatistics stats = Arrays.stream(nums).summaryStatistics();
// stats.getMin(), getMax(), getSum(), getAverage(), getCount()
~~~

\`max()\` returns an \`OptionalInt\` because an empty array has no maximum; calling \`getAsInt()\` on it throws. Library methods are concise, but interviewers usually want the loop to see your reasoning.

## Floating-point sums

Summing many doubles accumulates rounding error. For most purposes this is negligible; for money, use integer paise or cents, or BigDecimal.

## How interviewers test this

Expect max, min, sum and average of an array, second largest, and the stock profit problem. Initialize max and min from the first element or the extreme sentinels, use long for sums, cast before dividing, handle empty arrays, demote the old max correctly for second largest, and explain the single-pass O(n) approach.`,
    sources: [ARRAYS_API, CS50],
  },

  "two-dimensional-arrays": {
    theory: `A two-dimensional array stores data in rows and columns, like a table, a chessboard, a spreadsheet or an image. In Java, a 2D array is an array of arrays: each row is a separate one-dimensional array, which allows rows of different lengths. Grid traversal, matrix operations and neighbour exploration are staples of coding interviews. This lesson covers declaring and creating 2D arrays, how they're stored, row and column traversal, jagged arrays, matrix operations and grid neighbours.

## Declaring and creating

~~~java
int[][] grid = new int[3][4];         // 3 rows, 4 columns, all zeros
int[][] matrix = {
    {1, 2, 3},
    {4, 5, 6}
};                                     // 2 rows, 3 columns
~~~

Access an element with two indices, row first: \`matrix[1][2]\` is 6 (row 1, column 2). Row indices run from 0 to \`matrix.length - 1\`; column indices in row r run from 0 to \`matrix[r].length - 1\`.

## An array of arrays

\`matrix\` is an array whose elements are references to row arrays:

~~~
matrix ──> [ ref0 , ref1 ]
             │       │
             v       v
          [1,2,3] [4,5,6]
~~~

Consequences:

- \`matrix.length\` is the number of rows
- \`matrix[0].length\` is the number of columns in row 0
- \`matrix[1]\` is itself an \`int[]\` and can be passed to methods that take 1D arrays
- rows aren't necessarily stored next to each other in memory

## Traversal: row by row

~~~java
for (int r = 0; r < matrix.length; r++) {
    for (int c = 0; c < matrix[r].length; c++) {
        System.out.print(matrix[r][c] + " ");
    }
    System.out.println();
}
~~~

Using \`matrix[r].length\` for the inner bound keeps the code correct for jagged arrays. For-each works too:

~~~java
for (int[] row : matrix) {
    for (int value : row) {
        sum += value;
    }
}
~~~

Row-by-row traversal is also the fastest, because each row's elements are contiguous and cache-friendly.

## Column by column

~~~java
for (int c = 0; c < matrix[0].length; c++) {
    int colSum = 0;
    for (int r = 0; r < matrix.length; r++) {
        colSum += matrix[r][c];
    }
    System.out.println("Column " + c + " sum: " + colSum);
}
~~~

Swapping the loops changes the traversal order. This assumes a rectangular array.

## Jagged arrays

Rows can have different lengths:

~~~java
int[][] triangle = new int[4][];
for (int r = 0; r < 4; r++) {
    triangle[r] = new int[r + 1];      // row r has r + 1 elements
}
~~~

This suits data such as Pascal's triangle, where row r has r + 1 entries, saving memory compared with a full square. Code that assumes every row has \`matrix[0].length\` columns breaks on jagged arrays.

## Common matrix operations

**Transpose** (rows become columns):

~~~java
int[][] t = new int[cols][rows];
for (int r = 0; r < rows; r++)
    for (int c = 0; c < cols; c++)
        t[c][r] = matrix[r][c];
~~~

**Diagonals** of a square n × n matrix: the main diagonal has \`r == c\`; the anti-diagonal has \`r + c == n - 1\`.

**Matrix multiplication**: for A (n × m) and B (m × p), \`C[i][j]\` is the sum over k of \`A[i][k] * B[k][j]\`, three nested loops and O(n·m·p) time.

**Rotate 90° clockwise** (square matrix): transpose, then reverse each row. This in-place trick is a popular interview question.

## Grid neighbours

Many problems explore a grid cell's neighbours: mazes, islands, flood fill, game boards. Direction arrays avoid writing four nearly identical blocks:

~~~java
int[] dr = {-1, 1, 0, 0};
int[] dc = {0, 0, -1, 1};
for (int d = 0; d < 4; d++) {
    int nr = r + dr[d], nc = c + dc[d];
    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        // (nr, nc) is a valid neighbour
    }
}
~~~

The bounds check prevents ArrayIndexOutOfBoundsException at the edges. Adding the four diagonal directions gives eight neighbours.

## Printing and copying

\`Arrays.deepToString(matrix)\` prints \`[[1, 2, 3], [4, 5, 6]]\`. \`matrix.clone()\` copies only the outer array, so rows are still shared; copy each row with \`row.clone()\` for an independent copy.

## Memory and size

An r × c int array uses about r × c × 4 bytes plus per-row overhead. A 10,000 × 10,000 int grid needs around 400 MB, which can exceed memory limits; check constraints before allocating.

## Beyond two dimensions

Java supports any number of dimensions: \`int[][][] cube = new int[3][4][5];\`. Three-dimensional arrays appear in some dynamic programming problems.

## How interviewers test this

Expect matrix traversal, row and column sums, transpose, spiral order, rotation, diagonal sums and grid neighbour problems. Explain the array-of-arrays model, use \`matrix[r].length\` for jagged safety, show direction arrays with bounds checks, and mention that clone on a 2D array is shallow.`,
    sources: [ARRAYS_TUT, JLS_ARRAYS],
  },
};
