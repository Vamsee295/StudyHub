// Long-form theory for Programming Fundamentals module 5 (part 2): loops and loop patterns. Original writing.
import { LessonTheory } from './utils';

const FOR = { title: "The Java Tutorials: The for Statement", url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/for.html" };
const WHILE = { title: "The Java Tutorials: The while and do-while Statements", url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/while.html" };
const BRANCHING = { title: "The Java Tutorials: Branching Statements", url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/branch.html" };
const JLS_STATEMENTS = { title: "JLS Chapter 14: Blocks, Statements, and Patterns", url: "https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html" };
const STREAMS = { title: "The Java Tutorials: Aggregate Operations (Streams)", url: "https://docs.oracle.com/javase/tutorial/collections/streams/index.html" };
const CP_ALGO = { title: "cp-algorithms: Algorithms for Competitive Programming", url: "https://cp-algorithms.com/" };
const CS50 = { title: "Harvard CS50: Introduction to Computer Science (free course)", url: "https://cs50.harvard.edu/x/" };

export const pfLoopsTheory: Record<string, LessonTheory> = {
  "why-loops": {
    theory: `Loops let a program repeat work without repeating code. Printing a times table, summing a list of prices, reading every line of a file and checking every user in a database all follow the same idea: do something for each item, or keep doing something until a condition changes. Computers excel at repetition, and loops are how you harness that. This lesson explains why loops exist, the parts every loop has, the kinds of loops Java offers, and how to think about loop correctness and cost.

## The problem without loops

Printing the numbers 1 to 5 without a loop takes five statements:

~~~java
System.out.println(1);
System.out.println(2);
System.out.println(3);
System.out.println(4);
System.out.println(5);
~~~

Printing 1 to 1,000 this way is absurd, and printing 1 to n, where n comes from user input, is impossible: you can't know at writing time how many statements to write. A loop handles any count with the same few lines:

~~~java
for (int i = 1; i <= n; i++) {
    System.out.println(i);
}
~~~

## The parts of every loop

Whatever the syntax, a loop has four parts:

1. **Initialization**: set up the starting state, such as \`int i = 1\`
2. **Condition**: a boolean test checked before (or after) each repetition; the loop continues while it's true
3. **Body**: the statements that repeat
4. **Update**: change the state so the condition eventually becomes false, such as \`i++\`

If the update never brings the condition to false, the loop runs forever: an **infinite loop**.

## Java's loops

| Loop | Best for | Condition checked |
|---|---|---|
| \`for\` | A known number of repetitions, counting | Before each iteration |
| enhanced \`for\` (for-each) | Visiting every element of an array or collection | Implicitly, per element |
| \`while\` | Repeating until something happens, count unknown | Before each iteration |
| \`do-while\` | Running at least once, such as menus | After each iteration |

All loops are interchangeable in principle; choosing the one that matches the situation makes code easier to read.

## Iterations and tracing

Each pass through the body is an **iteration**. Tracing a loop means tracking variables across iterations:

~~~java
int sum = 0;
for (int i = 1; i <= 4; i++) {
    sum += i;
}
~~~

| Iteration | i | sum after |
|---|---|---|
| 1 | 1 | 1 |
| 2 | 2 | 3 |
| 3 | 3 | 6 |
| 4 | 4 | 10 |

After the fourth iteration, \`i\` becomes 5, the condition \`5 <= 4\` fails, and the loop ends. Trace tables like this solve most loop output questions.

## Loop invariants

A **loop invariant** is a statement that's true before and after every iteration. For the sum loop: "sum equals 1 + 2 + ... + (i - 1)". If the invariant holds at the start, each iteration preserves it, and the loop ends, then the result is correct. Thinking in invariants is the most reliable way to write loops that work the first time, and it's how binary search and sorting algorithms are proven correct.

## Off-by-one errors

The most common loop bug is running one time too many or too few:

- \`i <= n\` versus \`i < n\`
- starting at 0 versus 1
- array indices run from 0 to length - 1

Always check the first and last iterations explicitly: what is i on the first pass, and on the last?

## Infinite loops

~~~java
int i = 0;
while (i < 10) {
    System.out.println(i);   // forgot i++: prints 0 forever
}
~~~

Sometimes infinite loops are intentional, such as a server waiting for requests or a game loop, written as \`while (true)\` with a break or return inside. Unintentional ones freeze the program; in a terminal, Ctrl+C stops it.

## The cost of loops

Loops are where programs spend their time. A loop over n items does work proportional to n, written O(n). A loop inside a loop over the same items does about n × n work, O(n²). For n = 100,000, that's ten billion steps, far too slow. Recognizing loop structures and estimating their cost is the foundation of algorithm analysis and of passing time limits in coding rounds.

## Alternatives to explicit loops

Java offers higher-level tools that loop internally:

~~~java
int total = Arrays.stream(prices).sum();
list.forEach(System.out::println);
~~~

Streams and library methods such as \`Arrays.fill\` and \`Collections.max\` express intent concisely. Recursion is another way to repeat, covered in the problem-solving module. Understanding plain loops first makes these tools easier to understand.

## Choosing the right loop

- know the count in advance: \`for\`
- visiting every element without needing the index: for-each
- waiting for a condition, such as valid input or the end of a file: \`while\`
- the body must run at least once: \`do-while\`

## How interviewers test this

Expect "Why do we need loops?", "Difference between while and do-while?", trace-the-output questions, and spotting infinite loops or off-by-one errors. Name the four loop parts, explain when each loop type fits, trace with a table, and estimate cost for nested loops.`,
    sources: [FOR, CS50],
  },

  "for-loop": {
    theory: `The \`for\` loop packs initialization, condition and update into a single line, making it the natural choice when the number of iterations is known or can be computed: counting from 1 to n, visiting every array index, or stepping through a range. Java also has an enhanced for loop for visiting each element of an array or collection directly. This lesson covers the classic for loop's anatomy and execution order, counting patterns, scope of the loop variable, the enhanced for loop, and common mistakes.

## Anatomy

~~~java
for (initialization; condition; update) {
    body
}
~~~

~~~java
for (int i = 1; i <= 5; i++) {
    System.out.println("Line " + i);
}
~~~

## Execution order

1. **Initialization** runs once: \`int i = 1\`
2. **Condition** is checked; if false, the loop ends immediately
3. **Body** runs
4. **Update** runs: \`i++\`
5. Back to step 2

The condition is checked before every iteration, including the first. If it's false from the start, as in \`for (int i = 10; i < 5; i++)\`, the body never runs.

## Counting patterns

~~~java
for (int i = 0; i < n; i++)        // 0 to n-1: n iterations, array indices
for (int i = 1; i <= n; i++)       // 1 to n: n iterations, human counting
for (int i = n; i >= 1; i--)       // n down to 1
for (int i = 0; i < n; i += 2)     // 0, 2, 4, ...: even indices
for (int i = 1; i <= n; i *= 2)    // 1, 2, 4, 8, ...: about log2(n) iterations
~~~

The last pattern doubles each time, so it runs about log₂(n) times. Recognizing it matters for estimating complexity.

## Scope of the loop variable

A variable declared in the initialization exists only inside the loop:

~~~java
for (int i = 0; i < 5; i++) { ... }
System.out.println(i);   // compile error: i isn't in scope
~~~

If you need the final value after the loop, declare the variable before it:

~~~java
int i;
for (i = 0; i < arr.length && arr[i] != target; i++) { }
// i is now the index of target, or arr.length if not found
~~~

## Multiple variables

The initialization and update can hold several comma-separated parts, useful for two-pointer techniques:

~~~java
for (int left = 0, right = arr.length - 1; left < right; left++, right--) {
    int tmp = arr[left];
    arr[left] = arr[right];
    arr[right] = tmp;
}
~~~

This reverses an array in place by swapping from both ends toward the middle.

## Optional parts

All three parts are optional. \`for (;;)\` is an infinite loop, equivalent to \`while (true)\`. Omitting parts usually signals that a while loop would be clearer.

## The enhanced for loop

The for-each loop visits every element of an array or any \`Iterable\` collection:

~~~java
int[] scores = {78, 92, 85};
int total = 0;
for (int s : scores) {
    total += s;
}

List<String> names = List.of("Asha", "Ravi", "Meera");
for (String name : names) {
    System.out.println(name);
}
~~~

Read it as "for each \`s\` in \`scores\`". It removes index bookkeeping and off-by-one errors.

## Limits of for-each

The enhanced for loop gives you each element's **value**, not its position. Use a classic for loop when you need to:

- know the index, such as printing "Item 3"
- modify array elements: assigning to the loop variable changes only the local copy
- traverse backwards or skip elements
- compare adjacent elements (\`arr[i]\` and \`arr[i + 1]\`)
- iterate over two arrays in parallel

~~~java
for (int s : scores) {
    s = s + 5;            // changes the local copy only; the array is unchanged
}
for (int i = 0; i < scores.length; i++) {
    scores[i] += 5;       // changes the array
}
~~~

Removing items from a collection inside a for-each loop throws \`ConcurrentModificationException\`; use an Iterator's \`remove\` method or \`list.removeIf(...)\` instead.

## Common mistakes

**Off by one**: \`for (int i = 0; i <= arr.length; i++)\` reads \`arr[arr.length]\` and throws ArrayIndexOutOfBoundsException.

**Stray semicolon**:

~~~java
for (int i = 0; i < 5; i++);   // empty body runs 5 times
{
    System.out.println("Hi");  // prints once
}
~~~

**Modifying the loop variable in the body**: changing \`i\` inside the body as well as in the update makes the iteration count hard to reason about.

**Floating-point counters**: \`for (double x = 0; x != 1.0; x += 0.1)\` may never end, because 0.1 added ten times isn't exactly 1.0. Use integer counters and compute the double from them.

**Recomputing expensive conditions**: \`for (int i = 0; i < list.size(); i++)\` is fine for ArrayList, but calling an expensive method in the condition on every iteration can waste time; compute it once before the loop when it doesn't change.

## for versus while

Any for loop can be written as a while loop and vice versa. Prefer for when initialization, condition and update all concern one counter; prefer while when the loop waits for a condition unrelated to counting.

## How interviewers test this

Expect output questions tracing for loops with different updates, off-by-one bugs, the stray semicolon trap, and "when can't you use for-each?" Explain the execution order, scope of the loop variable, counting patterns including doubling, and the value-copy limitation of the enhanced for loop.`,
    sources: [FOR, JLS_STATEMENTS],
  },

  "while-loop": {
    theory: `The \`while\` loop repeats its body as long as a condition stays true, checking the condition before each iteration. It's the right tool when you don't know in advance how many iterations you'll need: reading until the input ends, retrying until success, or processing digits until a number becomes zero. This lesson covers syntax and execution, the patterns where while loops shine, sentinel values, avoiding infinite loops, and how while compares with for.

## Syntax and execution

~~~java
while (condition) {
    body
}
~~~

1. Evaluate the condition
2. If false, skip the loop and continue after it
3. If true, run the body, then go back to step 1

Because the condition is checked first, the body may run zero times:

~~~java
int n = 0;
while (n > 0) {
    System.out.println(n);   // never runs
}
~~~

## Something must change

The body (or the condition itself) must eventually make the condition false. Every while loop needs an update somewhere:

~~~java
int countdown = 5;
while (countdown > 0) {
    System.out.println(countdown);
    countdown--;              // without this, the loop never ends
}
System.out.println("Liftoff!");
~~~

When writing a while loop, ask: which variable in the condition changes inside the body, and does it move toward making the condition false?

## Pattern: processing digits

Digit problems are the classic while loop use, because the number of digits isn't known in advance:

~~~java
int n = 4729;
int sum = 0;
while (n > 0) {
    sum += n % 10;    // take the last digit
    n /= 10;          // remove the last digit
}
System.out.println(sum);   // 22
~~~

The same skeleton counts digits, reverses a number, checks palindromes and finds Armstrong numbers. Handle zero and negative inputs separately: for n = 0, the loop doesn't run at all.

## Pattern: reading until input ends

~~~java
Scanner sc = new Scanner(System.in);
int total = 0;
while (sc.hasNextInt()) {
    total += sc.nextInt();
}
System.out.println(total);
~~~

The loop continues while more integers are available.

## Pattern: sentinel values

A **sentinel** is a special value that signals the end of input:

~~~java
int sum = 0;
int value = sc.nextInt();
while (value != -1) {        // -1 means "stop"
    sum += value;
    value = sc.nextInt();
}
~~~

The sentinel must be a value that can't appear as real data. Notice the structure: one read before the loop, another at the end of the body. A do-while loop or a \`while (true)\` with break avoids the duplicated read.

## Pattern: waiting for a condition

~~~java
int attempts = 0;
boolean connected = false;
while (!connected && attempts < 3) {
    connected = tryConnect();
    attempts++;
}
~~~

Combining the goal with a maximum attempt count prevents waiting forever.

## Pattern: convergence

Some algorithms repeat until a value stops changing significantly:

~~~java
double guess = x / 2;
while (Math.abs(guess * guess - x) > 1e-9) {
    guess = (guess + x / guess) / 2;    // Newton's method for square roots
}
~~~

## while (true) with break

When the exit condition is discovered in the middle of the body, an infinite loop with a break is often cleanest:

~~~java
while (true) {
    String line = sc.nextLine();
    if (line.equals("quit")) break;
    process(line);
}
~~~

Make sure every path eventually reaches the break or a return.

## Infinite loop causes

- forgetting the update
- updating the wrong variable
- an update that moves away from the exit condition, such as \`i--\` when the condition is \`i < 10\`
- \`continue\` that skips the update
- floating-point conditions that never become exactly equal
- integer overflow wrapping a counter back around

## while versus for

These are equivalent:

~~~java
for (int i = 0; i < n; i++) { body(i); }

int i = 0;
while (i < n) { body(i); i++; }
~~~

The for version keeps the counter's lifecycle on one line and limits its scope. Use while when the loop isn't driven by a counter: digits, input, retries, convergence or searching.

## Pattern: two pointers

~~~java
int left = 0, right = arr.length - 1;
while (left < right) {
    if (arr[left] + arr[right] == target) break;
    if (arr[left] + arr[right] < target) left++;
    else right--;
}
~~~

In a sorted array, this finds a pair with a given sum in O(n). The pointers move based on comparisons, not a fixed step, which suits a while loop.

## How interviewers test this

Expect digit problems (sum, reverse, palindrome, Armstrong), infinite loop spotting, "while vs do-while" and "while vs for" questions. Show the \`% 10\` and \`/ 10\` skeleton, explain that the body may run zero times, identify the update that guarantees termination, and use sentinels or hasNext for unknown-length input.`,
    sources: [WHILE, JLS_STATEMENTS],
  },

  "do-while-loop": {
    theory: `The \`do-while\` loop runs its body first and checks the condition afterwards, so the body always executes at least once. That guarantee fits situations where you must do something before you can decide whether to repeat it: showing a menu, asking for input until it's valid, or rolling dice until a target appears. This lesson covers syntax and execution order, how it differs from while, the patterns where it's the natural choice, and its traps.

## Syntax

~~~java
do {
    body
} while (condition);
~~~

Note the semicolon after the condition; leaving it out is a compile error, unlike in a while loop, where adding one causes a bug.

## Execution order

1. Run the body
2. Evaluate the condition
3. If true, go back to step 1; if false, continue after the loop

~~~java
int n = 10;
do {
    System.out.println(n);   // prints 10 once
    n++;
} while (n < 5);
~~~

The condition is false from the start, yet the body runs once. The equivalent while loop would print nothing.

## while versus do-while

| | while | do-while |
|---|---|---|
| Condition checked | Before each iteration | After each iteration |
| Minimum executions | 0 | 1 |
| Typical use | Loop may not need to run | Body must run once before testing |
| Syntax ending | \`}\` | \`} while (condition);\` |

## Pattern: input validation

The body reads input, and the condition checks whether it's acceptable:

~~~java
Scanner sc = new Scanner(System.in);
int age;
do {
    System.out.print("Enter age (1-120): ");
    age = sc.nextInt();
} while (age < 1 || age > 120);
~~~

With a while loop, you'd need to read once before the loop and again inside it, or initialize \`age\` to an invalid value to force the first iteration. The do-while expresses "ask, then check" directly.

To show an error message on invalid input, add a check inside:

~~~java
do {
    System.out.print("Enter age (1-120): ");
    age = sc.nextInt();
    if (age < 1 || age > 120) System.out.println("Out of range, try again.");
} while (age < 1 || age > 120);
~~~

The repeated condition is a small cost; extracting \`isValidAge(age)\` keeps it in one place.

## Pattern: menus

~~~java
int choice;
do {
    System.out.println("1. Add  2. View  3. Exit");
    choice = sc.nextInt();
    switch (choice) {
        case 1 -> addItem();
        case 2 -> viewItems();
        case 3 -> System.out.println("Goodbye");
        default -> System.out.println("Invalid option");
    }
} while (choice != 3);
~~~

The menu must appear at least once, which is exactly what do-while guarantees.

## Pattern: digit processing that handles zero

Counting digits with a while loop gives 0 for the number 0, because the loop never runs. A do-while counts it correctly:

~~~java
int n = 0, digits = 0;
do {
    digits++;
    n /= 10;
} while (n != 0);
System.out.println(digits);   // 1
~~~

## Pattern: simulations

~~~java
Random rng = new Random();
int rolls = 0, face;
do {
    face = rng.nextInt(6) + 1;
    rolls++;
} while (face != 6);
System.out.println("Rolled a six after " + rolls + " rolls");
~~~

You can't check for a six until you've rolled at least once.

## Scope trap

Variables declared inside the do block aren't visible in the condition:

~~~java
do {
    int value = sc.nextInt();
} while (value < 0);      // compile error: value isn't in scope here
~~~

Declare the variable before the loop.

## continue in do-while

\`continue\` jumps to the condition check at the bottom, not to the top of the body. If the update happens after the continue in the body, it's skipped, which can cause an infinite loop, the same trap as with while.

## How often it's used

do-while is the least common of Java's loops; many codebases use \`while (true)\` with break for the same purposes. It remains the clearest choice when the body must run once and the exit test naturally comes after it, and it appears regularly in interview questions.

## Converting between loops

Any do-while can be written as a while loop by duplicating the body before the loop, or by forcing the first iteration with a flag:

~~~java
boolean first = true;
while (first || condition) {
    first = false;
    body();
}
~~~

The do-while version is clearer, which is the reason it exists.

## How interviewers test this

Expect "Difference between while and do-while?", output questions where the condition is false initially, and menu or input-validation programs. Explain that the body runs at least once because the condition is checked afterwards, remember the trailing semicolon, and show the validation and menu patterns.`,
    sources: [WHILE, JLS_STATEMENTS],
  },

  "nested-loops": {
    theory: `A nested loop is a loop inside another loop. For every iteration of the outer loop, the inner loop runs completely. Nested loops are how programs work with two-dimensional structures, such as grids, tables, matrices and patterns, and how they compare every pair of items. They're also the most common source of slow code, because the work multiplies. This lesson covers how nested loops execute, how to count iterations, typical uses, dependent inner bounds, and how to avoid quadratic slowdowns.

## How nested loops execute

~~~java
for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= 2; j++) {
        System.out.println("i=" + i + " j=" + j);
    }
}
~~~

Output:

~~~
i=1 j=1
i=1 j=2
i=2 j=1
i=2 j=2
i=3 j=1
i=3 j=2
~~~

The inner loop restarts from \`j = 1\` on every outer iteration. Think of a clock: the minute hand (inner loop) completes a full cycle for each step of the hour hand (outer loop).

## Counting iterations

With an outer loop of n iterations and an inner loop of m iterations, the inner body runs n × m times. Three nested loops over n items run n³ times.

When the inner bound depends on the outer variable, count the sum:

~~~java
for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
        // runs (n-1) + (n-2) + ... + 0 = n(n-1)/2 times
    }
}
~~~

This loop visits every **unordered pair** exactly once and is still O(n²), about half the work of the full n × n version.

## Typical uses

**Tables**:

~~~java
for (int row = 1; row <= 10; row++) {
    for (int col = 1; col <= 10; col++) {
        System.out.printf("%4d", row * col);
    }
    System.out.println();
}
~~~

**2D arrays**:

~~~java
int[][] grid = {{1, 2, 3}, {4, 5, 6}};
int sum = 0;
for (int r = 0; r < grid.length; r++) {
    for (int c = 0; c < grid[r].length; c++) {
        sum += grid[r][c];
    }
}
~~~

Use \`grid[r].length\` for the inner bound so jagged arrays, where rows have different lengths, work correctly.

**Comparing all pairs**:

~~~java
boolean hasDuplicate = false;
for (int i = 0; i < arr.length; i++) {
    for (int j = i + 1; j < arr.length; j++) {
        if (arr[i] == arr[j]) hasDuplicate = true;
    }
}
~~~

**Patterns**: printing triangles and pyramids of stars, covered in the pattern problems lesson.

## Naming loop variables

\`i\` and \`j\` are conventional, but in grid code, \`row\` and \`col\` (or \`r\` and \`c\`) prevent mixing up dimensions. Swapping \`i\` and \`j\` in \`grid[i][j]\` is a classic bug, especially with non-square grids, where it causes index out of bounds errors.

## Exiting nested loops

A \`break\` inside the inner loop exits only the inner loop. To stop both loops when a result is found:

- use a labeled break: \`outer: for (...) { for (...) { if (found) break outer; } }\`
- or move the loops into a method and \`return\`

## Performance

Nested loops multiply work:

| n | O(n) steps | O(n²) steps |
|---|---|---|
| 1,000 | 1,000 | 1,000,000 |
| 100,000 | 100,000 | 10,000,000,000 |

A typical judge allows around 10⁸ basic operations per second. An O(n²) solution with n = 100,000 times out, while an O(n) solution finishes instantly. When you write a nested loop over the same data, ask whether a better approach exists:

- duplicate detection: a \`HashSet\` makes it O(n)
- pair with a given sum: a HashSet of seen values, or sorting with two pointers
- prefix sums replace repeated inner summing loops

Nested loops are fine when the data is small or the problem genuinely requires every pair.

## Tracing nested loops

For output questions, track both variables carefully and remember the inner variable resets each outer iteration. A two-column trace table (i, j) with the output written beside each row prevents mistakes.

## Variable reset bugs

Accumulators that belong to each outer iteration must be reset inside the outer loop:

~~~java
for (int r = 0; r < grid.length; r++) {
    int rowSum = 0;                 // reset per row
    for (int c = 0; c < grid[r].length; c++) rowSum += grid[r][c];
    System.out.println("Row " + r + ": " + rowSum);
}
~~~

Declaring \`rowSum\` before the outer loop would carry totals across rows.

## How interviewers test this

Expect "how many times does this line run?", output tracing, 2D array traversal, and "can you do better than O(n²)?" Count iterations including dependent bounds, explain that the inner loop restarts each time, handle jagged arrays, reset per-row accumulators, and suggest hashing or two pointers to remove a nested loop.`,
    sources: [FOR, CP_ALGO],
  },

  "break-continue-loops": {
    theory: `\`break\` and \`continue\` change the normal flow of a loop. \`break\` ends the loop immediately; \`continue\` skips the rest of the current iteration and moves to the next. Used well, they make loops shorter and clearer: stop searching once you've found the answer, skip items you don't care about. Used carelessly, they hide exits and cause infinite loops. This lesson compares the two side by side, shows how each behaves in every loop type, covers labeled versions, and gives guidelines for readable loops.

## Side by side

~~~java
for (int i = 1; i <= 6; i++) {
    if (i == 4) break;
    System.out.print(i + " ");
}
// 1 2 3

for (int i = 1; i <= 6; i++) {
    if (i == 4) continue;
    System.out.print(i + " ");
}
// 1 2 3 5 6
~~~

| | break | continue |
|---|---|---|
| Effect | Leaves the loop entirely | Ends this iteration only |
| Next step | Statement after the loop | Next iteration (update and condition) |
| Typical use | Found the answer; exit condition reached | Skip invalid or irrelevant items |
| Works in switch | Yes, ends the case | No meaning on its own |

## Where control goes in each loop type

| Loop | After break | After continue |
|---|---|---|
| \`for\` | After the loop | Runs the update, then checks the condition |
| enhanced \`for\` | After the loop | Next element |
| \`while\` | After the loop | Checks the condition directly |
| \`do-while\` | After the loop | Checks the condition at the bottom |

The key difference: in a for loop, continue still runs the update, while in while and do-while loops, it skips any update written later in the body.

## Pattern: early exit with break

~~~java
boolean isPrime = n > 1;
for (int d = 2; d * d <= n; d++) {
    if (n % d == 0) {
        isPrime = false;
        break;              // one divisor is enough
    }
}
~~~

Checking divisors only up to √n and stopping at the first one makes primality testing fast.

## Pattern: filtering with continue

~~~java
int sumOfPositives = 0;
for (int x : nums) {
    if (x <= 0) continue;
    sumOfPositives += x;
}
~~~

## Both in one loop

~~~java
// Sum numbers until a 0 appears, ignoring negatives
int sum = 0;
for (int x : nums) {
    if (x == 0) break;
    if (x < 0) continue;
    sum += x;
}
~~~

Tracing \`{3, -2, 5, 0, 7}\`: add 3, skip -2, add 5, stop at 0. The sum is 8, and 7 is never reached.

## Nested loops and labels

Both statements affect only the innermost loop unless labeled:

~~~java
outer:
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        if (j == 1) continue outer;   // skip to the next i
        if (i == 2) break outer;      // leave both loops
        System.out.println(i + "," + j);
    }
}
// 0,0
// 1,0
~~~

Labels are legal but rare in production code. Extracting the inner loop into a method that returns usually reads better.

## The infinite loop trap

~~~java
int i = 0;
while (i < 5) {
    if (i == 2) continue;   // i stays 2 forever
    System.out.println(i);
    i++;
}
~~~

Fix by incrementing before the continue, or use a for loop, whose update runs automatically.

## Readable loop guidelines

- **one clear purpose per exit**: a break should mean "done", a continue should mean "skip this one"
- **put skip conditions at the top** of the body, like guard clauses
- **avoid many exits** in long loops; if a loop has several breaks and continues spread across 40 lines, split it into methods
- **prefer return** when the loop's purpose is to compute a result in a method: \`return i;\` exits the loop and the method together
- **consider the condition**: sometimes the break condition belongs in the loop header, \`while (i < n && arr[i] != target)\`

## Alternatives in modern Java

Streams express filtering and early termination declaratively:

~~~java
int firstNegative = Arrays.stream(nums).filter(x -> x < 0).findFirst().orElse(0);
~~~

\`filter\` plays the role of continue, and \`findFirst\` stops processing once a match is found, like break.

## How interviewers test this

Expect output questions mixing break and continue in nested loops, the while-loop continue trap, and "what's the difference between break and continue?" Use the comparison tables, explain that continue still runs a for loop's update but skips a while loop's later update, show labeled forms, and recommend return for exiting from searches inside methods.`,
    sources: [BRANCHING, JLS_STATEMENTS],
  },

  "counting-accumulation-patterns": {
    theory: `Most loops you'll write follow a handful of recurring patterns: counting how many items match, accumulating a sum or product, tracking a minimum or maximum, building a result string, or searching for a match. Recognizing these patterns lets you solve new problems by combining known pieces instead of starting from scratch. This lesson covers each pattern with its correct initialization, the edge cases that break naive versions, and how patterns combine.

## The accumulator idea

An **accumulator** is a variable that collects a result across iterations. Every accumulation pattern has three parts:

1. **Initialize** before the loop to the identity value: 0 for sums, 1 for products, an empty string for text
2. **Update** inside the loop for each relevant item
3. **Use** the result after the loop

Getting the initialization wrong is the most common error.

## Counting

~~~java
int evens = 0;
for (int x : nums) {
    if (x % 2 == 0) evens++;
}
~~~

Counting answers "how many?": how many vowels in a word, how many students passed, how many divisors a number has.

## Summing

~~~java
int sum = 0;
for (int x : nums) sum += x;
double average = nums.length > 0 ? (double) sum / nums.length : 0;
~~~

Two traps: integer division when computing the average (cast first), and overflow when summing many large values (use \`long\`). Also guard against dividing by zero for an empty array.

## Product

~~~java
long factorial = 1;            // not 0: anything times 0 is 0
for (int i = 2; i <= n; i++) factorial *= i;
~~~

Factorials overflow quickly: 13! exceeds int, and 21! exceeds long. Use \`BigInteger\` for larger values.

## Minimum and maximum

~~~java
int max = nums[0];
for (int i = 1; i < nums.length; i++) {
    if (nums[i] > max) max = nums[i];
}
~~~

Initialize with the **first element**, not 0. Starting at 0 gives the wrong answer when every number is negative. Alternatively, start with \`Integer.MIN_VALUE\` for a max or \`Integer.MAX_VALUE\` for a min. Track the index instead of the value when you need the position.

## Tracking two extremes: second largest

~~~java
int first = Integer.MIN_VALUE, second = Integer.MIN_VALUE;
for (int x : nums) {
    if (x > first) {
        second = first;
        first = x;
    } else if (x > second && x != first) {
        second = x;
    }
}
~~~

The order of updates matters: the old largest becomes the second largest before the new value replaces it. Decide how duplicates should be treated; here, equal values don't count as a distinct second.

## Searching with a flag

~~~java
boolean found = false;
for (int x : nums) {
    if (x == target) {
        found = true;
        break;
    }
}
~~~

## All and any

"Does **any** element satisfy X?" starts false and becomes true on the first match. "Do **all** elements satisfy X?" starts true and becomes false on the first failure:

~~~java
boolean allPositive = true;
for (int x : nums) {
    if (x <= 0) {
        allPositive = false;
        break;
    }
}
~~~

Deciding after the first element, in either direction, is a classic bug.

## Frequency counting

Counting occurrences of each value uses an array or a map as many accumulators at once:

~~~java
int[] freq = new int[26];
for (char c : word.toCharArray()) {
    if (Character.isLetter(c)) freq[Character.toLowerCase(c) - 'a']++;
}
~~~

For arbitrary values, use \`Map<Integer, Integer>\` with \`map.merge(x, 1, Integer::sum)\`. Frequency counting solves anagram checks, finding the most common element and detecting duplicates.

## Building strings

~~~java
StringBuilder sb = new StringBuilder();
for (int i = 1; i <= 5; i++) {
    if (i > 1) sb.append(", ");
    sb.append(i);
}
System.out.println(sb);   // 1, 2, 3, 4, 5
~~~

Use \`StringBuilder\` rather than \`+=\` on a String in loops, because each \`+=\` creates a new String object.

## Running values

Some problems need the accumulated value at every step, not only at the end:

~~~java
int[] prefix = new int[nums.length + 1];
for (int i = 0; i < nums.length; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
}
// sum of nums[l..r] = prefix[r + 1] - prefix[l]
~~~

**Prefix sums** answer range-sum queries in constant time after one pass, a technique that turns many O(n²) solutions into O(n).

## Combining patterns

Real problems combine patterns in one loop: count passing students, sum their marks and track the top scorer at the same time. Each accumulator gets its own initialization and update; one pass over the data is enough.

## How interviewers test this

Expect tasks such as counting vowels, summing digits, finding max and min, second largest, factorial and frequency counts. State the correct initialization for each accumulator, handle empty input, negative numbers and overflow, and show how several patterns share one loop.`,
    sources: [CS50, STREAMS],
  },

  "basic-pattern-problems": {
    theory: `Pattern problems ask you to print shapes, such as triangles, pyramids, diamonds and number grids, using nested loops. They look like puzzles, but they're excellent practice for the core skill of loop design: relating the row number to how many spaces, stars or numbers that row needs. They're common in campus placement tests and first interview rounds. This lesson gives a systematic method for any pattern and works through the classic shapes.

## The systematic method

1. **Count rows**: the outer loop runs once per row, usually \`for (int row = 1; row <= n; row++)\`
2. **Analyse each row**: write down, for rows 1, 2, 3, how many spaces and how many symbols appear, and what values are printed
3. **Find formulas** in terms of \`row\` and \`n\`: for example, row r has r stars, or n - r spaces
4. **One inner loop per segment**: spaces first, then symbols
5. **End each row** with \`System.out.println()\`

Writing a small table before coding turns a visual puzzle into arithmetic.

## Right triangle

~~~
*
* *
* * *
* * * *
~~~

Row r has r stars.

~~~java
for (int row = 1; row <= n; row++) {
    for (int s = 1; s <= row; s++) {
        System.out.print("* ");
    }
    System.out.println();
}
~~~

## Inverted triangle

Row r has n - r + 1 stars, or count rows downward:

~~~java
for (int row = n; row >= 1; row--) {
    for (int s = 1; s <= row; s++) System.out.print("* ");
    System.out.println();
}
~~~

## Right-aligned triangle

~~~
      *
    * *
  * * *
* * * *
~~~

| Row | Spaces (units) | Stars |
|---|---|---|
| 1 | 3 | 1 |
| 2 | 2 | 2 |
| r | n - r | r |

~~~java
for (int row = 1; row <= n; row++) {
    for (int sp = 1; sp <= n - row; sp++) System.out.print("  ");
    for (int s = 1; s <= row; s++) System.out.print("* ");
    System.out.println();
}
~~~

Each star is printed as two characters ("* "), so each space unit is also two characters to keep alignment.

## Pyramid

~~~
   *
  ***
 *****
*******
~~~

Row r has n - r spaces and 2r - 1 stars.

~~~java
for (int row = 1; row <= n; row++) {
    for (int sp = 1; sp <= n - row; sp++) System.out.print(" ");
    for (int s = 1; s <= 2 * row - 1; s++) System.out.print("*");
    System.out.println();
}
~~~

## Diamond

A diamond is a pyramid followed by an inverted pyramid without repeating the middle row: run the pyramid for rows 1 to n, then the same formulas for rows n - 1 down to 1.

## Number patterns

~~~
1
1 2
1 2 3
~~~

Print the inner loop variable: \`System.out.print(col + " ");\`

~~~
1
2 2
3 3 3
~~~

Print the row number instead: \`System.out.print(row + " ");\`

~~~
1
2 3
4 5 6
~~~

Floyd's triangle uses a counter that keeps increasing across rows:

~~~java
int num = 1;
for (int row = 1; row <= n; row++) {
    for (int col = 1; col <= row; col++) {
        System.out.print(num++ + " ");
    }
    System.out.println();
}
~~~

The counter is declared outside both loops so it doesn't reset each row.

## Alternating and conditional patterns

Patterns such as a 0-1 triangle or a hollow square use conditions inside the inner loop:

~~~java
// Hollow square: stars on the border only
for (int r = 1; r <= n; r++) {
    for (int c = 1; c <= n; c++) {
        boolean border = r == 1 || r == n || c == 1 || c == n;
        System.out.print(border ? "* " : "  ");
    }
    System.out.println();
}
~~~

\`(row + col) % 2\` produces alternating 0s and 1s for checkerboard patterns.

## Character patterns

~~~
A
A B
A B C
~~~

Use char arithmetic: \`System.out.print((char) ('A' + col - 1) + " ");\`

## Debugging patterns

- check the first row, the last row and one middle row against your formulas
- print row numbers temporarily to see where a shape goes wrong
- confirm whether the expected output uses "* " or "*", since spacing changes alignment
- watch for println inside the inner loop, which prints one symbol per line

## Why these problems matter

Pattern problems train the same thinking used in matrix traversal, dynamic programming tables and image processing: mapping coordinates (row, column) to values by formula. They also test attention to detail, because one wrong space breaks the expected output.

## How interviewers test this

Expect pyramids, inverted triangles, diamonds, Floyd's triangle and hollow shapes, usually for a given n. Show the row table before coding, derive space and symbol counts as formulas of row and n, use one inner loop per segment, and explain where counters must be declared so they don't reset.`,
    sources: [FOR, CS50],
  },
};
