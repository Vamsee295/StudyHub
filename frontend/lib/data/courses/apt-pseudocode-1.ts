// Pseudocode & output prediction, part 1: reading pseudocode, operators, conditions, loops, nested loops, functions.
// Original writing. Conventions follow the C-style pseudocode used in campus tests (TCS NQT, Accenture, Capgemini…).
import type { FullLesson } from './apt-extra-types';

const WIKI_PSEUDO = { title: "Wikipedia: Pseudocode", url: "https://en.wikipedia.org/wiki/Pseudocode" };
const CPP_PRECEDENCE = { title: "cppreference: C operator precedence", url: "https://en.cppreference.com/w/c/language/operator_precedence" };
const WIKI_SHORT = { title: "Wikipedia: Short-circuit evaluation", url: "https://en.wikipedia.org/wiki/Short-circuit_evaluation" };
const WIKI_LOOP = { title: "Wikipedia: For loop", url: "https://en.wikipedia.org/wiki/For_loop" };
const WIKI_EVAL = { title: "Wikipedia: Evaluation strategy (call by value / reference)", url: "https://en.wikipedia.org/wiki/Evaluation_strategy" };
const CS50 = { title: "Harvard CS50 (free): Week 1, C and loops", url: "https://cs50.harvard.edu/x/" };

export const pseudocodePart1: FullLesson[] = [
  {
    slug: "how-to-read-pseudocode",
    title: "How to Read Pseudocode",
    description: "What pseudocode is, the conventions tests use, and tracing a program line by line.",
    minutes: 20,
    theory: `Pseudocode is a program written in plain, language-neutral steps. Campus tests use it so that a Java student and a Python student face the same question: "what does this print?" You don't need to know any language to answer. You need one skill: **tracing**, which means running the code in your head (or on paper) one line at a time and writing down every variable's value.

## Start here: what you'll see

Test pseudocode looks like a simplified C. These conventions cover almost every question:

| You see | It means |
|---|---|
| Integer a, b | Create whole-number variables a and b |
| Set a = 5 or a = 5 | Store 5 in a (the old value is gone) |
| a = a + 1 | Read a, add 1, store the result back in a |
| if (cond) … else … end if | Run one branch depending on cond |
| for (i = 1 to 5) or for (i = 1; i <= 5; i++) | Repeat with i = 1, 2, 3, 4, 5 |
| while (cond) … end while | Repeat while cond is true |
| Print a | Output the current value of a |
| a mod b, a % b | Remainder of a ÷ b |
| a / b with Integers | Whole-number division: 7 / 2 = 3 |

A single equals sign stores a value. A double equals sign (==) compares two values.

## The tracing method

1. Draw a table with one column per variable, plus a column for output
2. Go line by line. Each time a variable changes, write its new value in a new row
3. Never trust what the code "looks like it does". Trust the table

## Worked example 1: assignments

~~~
Integer a, b, c
Set a = 4, b = 7
c = a + b
a = c - a
b = c - b
Print a, b
~~~

| Line | a | b | c |
|---|---|---|---|
| Set | 4 | 7 | – |
| c = a + b | 4 | 7 | 11 |
| a = c - a | 7 | 7 | 11 |
| b = c - b | 7 | 4 | 11 |

Output: **7 4**. The values were swapped without a temporary variable. Spotting what code does ("it swaps") is a speed skill that grows with practice.

## Worked example 2: the order of lines matters

~~~
Integer x = 3, y = 5
x = y
y = x
Print x, y
~~~

A beginner expects a swap. Trace it: x becomes 5, then y = x = 5. Output: **5 5**. The first assignment destroyed the old value of x.

## Worked example 3: a variable used before and after it changes

~~~
Integer p = 2, q = 10
p = p * q      // p = 20
q = q - p      // q = 10 - 20 = -10
p = p + q      // p = 20 + (-10) = 10
Print p + q    // 10 + (-10) = 0
~~~

Output: **0**.

## Traps in this topic

- reading a = a + 1 as an equation (it isn't; it's an instruction)
- using the old value of a variable after it changed
- forgetting that Integer division throws away the fraction
- confusing = (store) with == (compare)

## In placement tests

Pseudocode questions are usually multiple choice, ask for the output or the final value of a variable, and give about a minute each. Trace on paper: it's faster and far more accurate than holding values in your head.

## Practice

1. Integer x = 10, y = 3; x = x - y; y = x * 2; Print x + y
2. Integer a = 6, b = 4; a = a + b; b = a - b; a = a - b; Print a, b
3. Integer n = 9; n = n / 2; n = n * 2; Print n

**Answers:** 1) x = 7, y = 14, so **21**. 2) a = 10, b = 6, a = 4, so **4 6** (another swap). 3) 9 / 2 = 4 in integers, then 8, so **8**.`,
    sources: [WIKI_PSEUDO, CS50],
    remember: [
      "Trace with a table: one column per variable, a new row whenever a value changes",
      "= stores a value; == compares",
      "An assignment destroys the old value; later lines see only the new one",
      "Integer division drops the fraction: 7 / 2 = 3",
    ],
    quick: {
      question: "Integer a = 4, b = 7, c. c = a + b; a = c - a; b = c - b. Print a, b. What is printed?",
      options: ["7 4", "4 7", "11 7", "7 7"],
      answer: 0,
      explanation: "c = 11, then a = 11 − 4 = 7, then b = 11 − 7 = 4. The values are swapped.",
    },
    questions: [
      { q: "Integer x = 3, y = 5. x = y; y = x. Print x, y", o: ["5 5", "5 3", "3 5", "3 3"], a: 0, e: "x becomes 5 first, so y = x copies 5. The old value of x is lost." },
      { q: "Integer n = 9. n = n / 2; n = n * 2. Print n (Integer arithmetic)", o: ["8", "9", "9.0", "10"], a: 0, e: "9 / 2 = 4 with Integers, then 4 × 2 = 8." },
      { q: "Integer p = 2, q = 10. p = p * q; q = q - p; p = p + q. Print p + q", o: ["0", "20", "10", "-10"], a: 0, e: "p = 20, q = −10, p = 10, so p + q = 0." },
      { q: "In test pseudocode, what does a = a + 1 do?", o: ["Reads a, adds 1, stores the result back in a", "Checks whether a equals a + 1", "Always causes an error", "Creates a second variable a"], a: 0, e: "A single = is an instruction to store, not an equation." },
    ],
    visual: {
      plain: "Tracing is like keeping a scoreboard. Every time a line changes a variable, you rub out the old score and write the new one. At the end, you read the answer off the board.",
      diagram: `flowchart LR
  L1["a = 4, b = 7"] --> L2["c = a + b<br/>c = 11"] --> L3["a = c − a<br/>a = 7"] --> L4["b = c − b<br/>b = 4"] --> O["Print a, b<br/>7 4"]`,
      caption: "One step per line, values updated as you go.",
    },
  },
  {
    slug: "operators-and-precedence",
    title: "Operators and Precedence",
    description: "Integer division, modulus, increment, and the order operators run in.",
    minutes: 25,
    theory: `Many output questions come down to one thing: **in what order does the expression run?** If you know the precedence table and the behaviour of integer division and modulus, these become free marks.

## Start here: the arithmetic operators

| Operator | Meaning | Example (Integers) |
|---|---|---|
| + − * | add, subtract, multiply | 7 * 3 = 21 |
| / | divide; with Integers the fraction is dropped | 7 / 2 = 3 |
| % or mod | remainder | 7 % 2 = 1 |

With negative numbers, C-style integer division truncates toward zero: −7 / 2 = −3, and the remainder takes the sign of the left operand: −7 % 2 = −1. If either operand is a Float, the division keeps the fraction: 7 / 2.0 = 3.5.

## Precedence: who goes first

Higher rows run first. Operators on the same row run **left to right**.

| Level | Operators |
|---|---|
| 1 | ( ) brackets |
| 2 | ! (not), unary −, ++, −− |
| 3 | * / % |
| 4 | + − |
| 5 | << >> (shifts) |
| 6 | < <= > >= |
| 7 | == != |
| 8 | & (bitwise AND) |
| 9 | ^ (bitwise XOR) |
| 10 | (bitwise OR) |
| 11 | && (logical AND) |
| 12 | (logical OR) |
| 13 | = += −= … (assignment, right to left) |

Rows 10 and 12 are the single bar and the double bar.

## Worked examples, from warm-up to tricky

~~~
2 + 3 * 4        = 2 + 12        = 14
(2 + 3) * 4      = 5 * 4         = 20
10 - 4 - 3       = (10 - 4) - 3  = 3      left to right
20 / 4 * 2       = (20 / 4) * 2  = 10     left to right, not 20 / 8
7 / 2 * 2        = 3 * 2         = 6      integer division first
17 % 5 * 2       = 2 * 2         = 4
5 + 7 % 3        = 5 + 1         = 6
8 + 12 / 4 * 3 - 2 = 8 + 9 - 2   = 15
~~~

## Increment and decrement

- **x++** (post-increment): use the old value in the expression, then add 1
- **++x** (pre-increment): add 1 first, then use the new value

~~~
Integer x = 5, y
y = x++ + 1     // uses 5, so y = 6; then x becomes 6
y = ++x + 1     // x becomes 7 first, so y = 8
Print x, y      // 7 8
~~~

Expressions that change the same variable twice, like x++ + x++, have no defined result in C. Good tests avoid them; if you meet one, look for an option like "undefined" or "depends on the compiler".

## Compound assignment

a += b means a = a + b. The right side is evaluated first: a *= 2 + 3 means a = a * (2 + 3), not (a * 2) + 3.

## Relational results are numbers

In C-style pseudocode a comparison produces 1 (true) or 0 (false), so Print (5 > 3) + 1 prints 2.

## Traps in this topic

- forgetting left-to-right on the same level (20 / 4 * 2)
- doing real division with Integers (7 / 2 is 3, not 3.5)
- reading a *= 2 + 3 as (a * 2) + 3
- mixing up x++ and ++x

## Practice

1. 25 % 7 + 3 * 2
2. 9 / 2 + 9 % 2
3. Integer a = 4; a *= 3 + 1; Print a
4. Integer x = 3, y; y = x++ * 2; Print x, y

**Answers:** 1) 4 + 6 = **10**. 2) 4 + 1 = **5**. 3) a = 4 × 4 = **16**. 4) y uses 3, so y = 6, then x = 4: **4 6**.`,
    sources: [CPP_PRECEDENCE, WIKI_PSEUDO],
    remember: [
      "* / % run before + −; equal levels run left to right",
      "Integer division drops the fraction; % gives the remainder",
      "x++ uses the old value then adds 1; ++x adds 1 first",
      "a op= b evaluates the whole right side first",
      "Comparisons give 1 (true) or 0 (false)",
    ],
    quick: {
      question: "What is 20 / 4 * 2 with Integer arithmetic?",
      options: ["10", "2", "2.5", "40"],
      answer: 0,
      explanation: "/ and * share a level and run left to right: (20 / 4) * 2 = 10.",
    },
    questions: [
      { q: "Evaluate 8 + 12 / 4 * 3 - 2 (Integers)", o: ["15", "5", "12", "28"], a: 0, e: "12 / 4 = 3, × 3 = 9, then 8 + 9 − 2 = 15." },
      { q: "Integer x = 5, y. y = x++ + 1. Print x, y", o: ["6 6", "5 6", "6 7", "5 7"], a: 0, e: "y uses the old x (5), so y = 6; then x becomes 6." },
      { q: "Integer a = 4. a *= 3 + 1. Print a", o: ["16", "13", "7", "12"], a: 0, e: "a *= 3 + 1 means a = a × (3 + 1) = 16." },
      { q: "What is 7 / 2 * 2 with Integer arithmetic?", o: ["6", "7", "1", "3.5"], a: 0, e: "7 / 2 = 3 (fraction dropped), then 3 × 2 = 6." },
    ],
    visual: {
      plain: "Think of precedence as a queue at a counter: brackets go first, then multiply, divide and remainder, then add and subtract. People with the same priority are served in the order they arrived, left to right.",
      diagram: `flowchart LR
  E["8 + 12 / 4 * 3 − 2"] --> A["12 / 4 = 3"] --> B["3 * 3 = 9"] --> C["8 + 9 = 17"] --> D["17 − 2 = 15"]`,
      caption: "Multiplication and division first, left to right; then addition and subtraction.",
    },
  },
  {
    slug: "conditions-and-branches",
    title: "Conditions and Branches",
    description: "if, else if, nested conditions, short-circuit && and ||, and truthy values.",
    minutes: 25,
    theory: `Conditions decide which lines run. Output questions with branches test whether you evaluate the condition exactly, follow only one branch, and notice parts of a condition that never run.

## Start here

~~~
if (condition)
    lines run when condition is true
else if (other condition)
    lines run when the first is false and this is true
else
    lines run when every condition above is false
end if
~~~

Exactly **one** branch of an if / else if / else chain runs, the first whose condition is true. Later conditions aren't even checked.

## Truth values

- comparisons give true or false (1 or 0 in C-style pseudocode)
- in C-style tests, **any non-zero number counts as true** and 0 counts as false: if (5) runs; if (0) doesn't
- ! flips true and false: !0 is 1, !7 is 0

## Combining conditions: && and ||

| a | b | a && b | a or b |
|---|---|---|---|
| T | T | T | T |
| T | F | F | T |
| F | T | F | T |
| F | F | F | F |

## Short-circuit evaluation: the favourite trap

- with **&&**, if the left side is false the right side is **not evaluated**
- with **or**, if the left side is true the right side is **not evaluated**

This matters when the right side changes a variable:

~~~
Integer x = 5
if (x > 3 or ++x > 10)
    Print x
end if
~~~

x > 3 is true, so ++x never runs. Output: **5**, not 6.

~~~
Integer a = 0, b = 0
if (a > 0 && ++b > 0)
    a = 1
end if
Print a, b
~~~

a > 0 is false, so ++b never runs. Output: **0 0**.

## Worked example: picking the largest

~~~
Integer a = 15, b = 10, c = 20
if (a > b && a > c) Print a
else if (b > c)     Print b
else                Print c
~~~

15 > 20 is false, so the first branch fails; 10 > 20 is false; the else runs. Output: **20**.

## Worked example: nested conditions

~~~
Integer m = 72
if (m >= 40)
    if (m >= 75) Print "Distinction"
    else Print "Pass"
else
    Print "Fail"
~~~

72 ≥ 40, then 72 ≥ 75 is false, so the inner else runs: **Pass**. An else belongs to the nearest unmatched if; indentation in the question can mislead, so match them yourself.

## Worked example: leap year

A year is a leap year when (y % 4 == 0 && y % 100 != 0) or y % 400 == 0.

- 2024: divisible by 4, not by 100 → leap
- 1900: divisible by 100 and not by 400 → **not** leap
- 2000: divisible by 400 → leap

## Traps in this topic

- if (a = 5) assigns 5 (which is true) instead of comparing; in C it always runs
- checking a later else-if after an earlier branch already ran
- evaluating the right side of && or || when short-circuit skips it
- attaching an else to the wrong if

## Practice

1. Integer n = 0; if (n) Print "A" else Print "B"
2. Integer x = 2, y = 9; if (x > 5 or y > 5) Print x + y else Print x - y
3. Integer k = 1; if (k == 0 && ++k) Print k else Print k + 10

**Answers:** 1) 0 is false: **B**. 2) y > 5 is true: **11**. 3) k == 0 is false so ++k is skipped; the else prints **11**.`,
    sources: [WIKI_SHORT, CPP_PRECEDENCE],
    remember: [
      "Only the first true branch of an if / else-if chain runs",
      "Non-zero is true and 0 is false in C-style pseudocode",
      "&& skips its right side when the left is false; or skips it when the left is true",
      "An else belongs to the nearest unmatched if, whatever the indentation",
    ],
    quick: {
      question: "Integer x = 5. if (x > 3 or ++x > 10) Print x. What is printed?",
      options: ["5", "6", "Nothing", "11"],
      answer: 0,
      explanation: "x > 3 is already true, so ++x is never evaluated (short-circuit). x stays 5.",
    },
    questions: [
      { q: "Integer a = 0, b = 0. if (a > 0 && ++b > 0) a = 1. Print a, b", o: ["0 0", "1 1", "0 1", "1 0"], a: 0, e: "a > 0 is false, so ++b is skipped and a = 1 never runs." },
      { q: "Integer a = 15, b = 10, c = 20. if (a > b && a > c) Print a; else if (b > c) Print b; else Print c", o: ["20", "15", "10", "Nothing"], a: 0, e: "Both conditions are false, so the else prints c = 20." },
      { q: "Which year is NOT a leap year?", o: ["1900", "2000", "2024", "1600"], a: 0, e: "1900 is divisible by 100 but not by 400." },
      { q: "Integer n = 0. if (n) Print \"A\" else Print \"B\". What is printed?", o: ["B", "A", "AB", "Error"], a: 0, e: "0 counts as false, so the else branch runs." },
    ],
    visual: {
      plain: "A branch is a fork in the road with signposts. You read the signs in order and take the first road whose sign matches. With && and ||, you stop reading a sign as soon as you know the answer.",
      diagram: `flowchart TB
  S["x = 5"] --> C{"x > 3 ?"}
  C -->|"true: stop, or is already true"| P["Print x → 5"]
  C -->|"false"| D{"++x > 10 ?"}`,
      caption: "Short-circuit: the right side of || runs only if the left side is false.",
    },
  },
  {
    slug: "loops-and-tracing",
    title: "Loops and Tracing",
    description: "for, while and do-while loops, counting iterations, and tracing loop tables.",
    minutes: 30,
    theory: `Loops repeat lines. Most output questions are loops, and most wrong answers come from being off by one iteration. The cure is the same tracing table, one row per pass.

## Start here: three loops

~~~
for (i = 1; i <= 5; i++)      // start; keep going while true; after each pass
    body
end for

while (condition)             // checks before every pass; may run 0 times
    body
end while

do                            // runs the body first, checks after; runs at least once
    body
while (condition)
~~~

## Counting iterations without tracing

For i from a up to b in steps of s (with b ≥ a): number of passes = floor((b − a) / s) + 1.

- i = 1 to 10 step 1 → 10 passes
- i = 1 to 10 step 3 → 1, 4, 7, 10 → floor(9 / 3) + 1 = 4 passes
- i = 0; i < 10; i += 2 → 0, 2, 4, 6, 8 → 5 passes (careful: < not <=)

## Worked example 1: sum of digits

~~~
Integer n = 4728, s = 0
while (n > 0)
    s = s + n % 10
    n = n / 10
end while
Print s
~~~

| Pass | n % 10 | s | n after |
|---|---|---|---|
| 1 | 8 | 8 | 472 |
| 2 | 2 | 10 | 47 |
| 3 | 7 | 17 | 4 |
| 4 | 4 | 21 | 0 |

The loop stops when n is 0. Output: **21**. The pattern n % 10 (last digit) and n / 10 (drop the last digit) appears constantly.

## Worked example 2: reversing a number

~~~
Integer n = 1234, r = 0
while (n > 0)
    r = r * 10 + n % 10
    n = n / 10
end while
Print r      // 4321
~~~

## Worked example 3: a loop with steps of 3

~~~
Integer x = 0, i = 10
while (i > 0)
    x = x + i
    i = i - 3
end while
Print x
~~~

i takes 10, 7, 4, 1, then −2 stops the loop. x = 10 + 7 + 4 + 1 = **22**.

## Worked example 4: do-while runs once even when the condition is false

~~~
Integer i = 10
do
    Print i
    i = i + 1
while (i < 5)
~~~

Prints **10** once, because the check comes after the body.

## Break and continue

- **break** leaves the loop immediately
- **continue** skips the rest of this pass and moves to the next one

~~~
for (i = 1; i <= 6; i++)
    if (i % 2 == 0) continue
    if (i == 5) break
    Print i
end for
~~~

Prints **1 3**. i = 2 and 4 are skipped; at 5 the loop ends.

## Traps in this topic

- < versus <=: one extra or missing pass
- the value of the loop variable after the loop (for i = 1; i <= 5 leaves i = 6)
- a while loop whose condition is false at the start never runs
- forgetting that the update (i++) happens after the body

## Practice

1. Integer a = 1; for (i = 1; i <= 5; i++) a = a * 2; Print a
2. Integer c = 0; for (i = 3; i < 20; i += 4) c++; Print c
3. Integer n = 507, p = 1; while (n > 0) { p = p * (n % 10 + 1); n = n / 10 }; Print p
4. Integer i; for (i = 0; i < 4; i++) { }; Print i

**Answers:** 1) **32**. 2) i = 3, 7, 11, 15, 19: **5**. 3) digits 7, 0, 5 give 8 × 1 × 6 = **48**. 4) the loop ends when i reaches 4: **4**.`,
    sources: [WIKI_LOOP, CS50],
    remember: [
      "Passes for a to b in steps of s: floor((b − a) / s) + 1",
      "n % 10 is the last digit; n / 10 drops it",
      "while may run zero times; do-while always runs at least once",
      "After for (i = 1; i <= 5; i++), i is 6",
      "break leaves the loop; continue skips to the next pass",
    ],
    quick: {
      question: "Integer n = 4728, s = 0. while (n > 0) { s = s + n % 10; n = n / 10 }. Print s",
      options: ["21", "4728", "8274", "18"],
      answer: 0,
      explanation: "It adds the digits: 8 + 2 + 7 + 4 = 21.",
    },
    questions: [
      { q: "Integer x = 0, i = 10. while (i > 0) { x = x + i; i = i - 3 }. Print x", o: ["22", "21", "18", "10"], a: 0, e: "i takes 10, 7, 4, 1, so x = 22." },
      { q: "How many times does for (i = 1; i <= 10; i = i + 3) run?", o: ["4", "3", "10", "5"], a: 0, e: "i takes the values 1, 4, 7 and 10, then 13 fails the test: 4 passes." },
      { q: "Integer i = 10. do { Print i; i = i + 1 } while (i < 5). How many numbers are printed?", o: ["1", "0", "5", "Infinitely many"], a: 0, e: "do-while runs the body once before checking." },
      { q: "for (i = 1; i <= 6; i++) { if (i % 2 == 0) continue; if (i == 5) break; Print i }. Output?", o: ["1 3", "1 3 5", "2 4 6", "1 2 3 4"], a: 0, e: "Even i are skipped; the loop breaks at 5 before printing it." },
    ],
    visual: {
      plain: "A loop is a lap around a track. Before each lap (or after, for do-while) a marshal checks the condition. Your tracing table is the lap counter: one row per lap, with every value at the end of that lap.",
      diagram: `flowchart LR
  I["i = 1"] --> C{"i <= 5 ?"}
  C -->|"yes"| B["body"] --> U["i++"] --> C
  C -->|"no"| E["after the loop<br/>i = 6"]`,
      caption: "The update runs after the body, and the loop variable ends one step past the limit.",
    },
  },
  {
    slug: "nested-loops-and-counting",
    title: "Nested Loops and Counting",
    description: "Loops inside loops: counting total iterations, triangle patterns, break in nested loops.",
    minutes: 25,
    theory: `A nested loop is a loop inside another loop. For every single pass of the outer loop, the inner loop runs **completely**. Questions ask for the output, the final value of a counter, or how many times a line runs.

## Start here

~~~
for (i = 1; i <= 3; i++)
    for (j = 1; j <= 2; j++)
        Print i, j
~~~

Prints (1,1) (1,2) (2,1) (2,2) (3,1) (3,2): 3 × 2 = 6 lines. Think of a clock: the inner loop is the minute hand, which goes all the way round for every tick of the hour hand.

## Counting iterations: the formulas that matter

| Inner loop | Total passes for i = 1..n |
|---|---|
| j = 1 to m (fixed) | n × m |
| j = 1 to i | 1 + 2 + … + n = n(n + 1) / 2 |
| j = i to n | n + (n − 1) + … + 1 = n(n + 1) / 2 |
| j = i + 1 to n | (n − 1) + … + 0 = n(n − 1) / 2 |
| j = 1; j < n; j = j * 2 | n × (number of doublings) |

## Worked example 1: a triangle count

~~~
Integer count = 0
for (i = 1; i <= 4; i++)
    for (j = i; j <= 4; j++)
        count = count + 1
Print count
~~~

i = 1 gives 4 passes, i = 2 gives 3, i = 3 gives 2, i = 4 gives 1: **10** = 4 × 5 / 2.

## Worked example 2: a weighted sum

~~~
Integer s = 0
for (i = 1; i <= 3; i++)
    for (j = 1; j <= i; j++)
        s = s + i * j
Print s
~~~

i = 1: 1. i = 2: 2 + 4 = 6. i = 3: 3 + 6 + 9 = 18. Total **25**.

## Worked example 3: break leaves only the inner loop

~~~
for (i = 1; i <= 3; i++)
    for (j = 1; j <= 3; j++)
        if (j == 2) break
        Print i, j
~~~

The break exits the inner loop each time j reaches 2; the outer loop carries on. Output: (1,1) (2,1) (3,1).

## Worked example 4: a doubling loop

~~~
Integer c = 0, i
for (i = 1; i < 100; i = i * 2)
    c = c + 1
Print c
~~~

i = 1, 2, 4, 8, 16, 32, 64 (128 stops it): **7** passes. A loop that doubles or halves runs about log₂(n) times.

## Star patterns

Pattern questions are nested loops in disguise. For row i, the inner loop decides how many stars (and spaces) to print:

~~~
for (i = 1; i <= 4; i++)
    for (j = 1; j <= i; j++) Print "*"
    Print newline
~~~

Rows of 1, 2, 3, 4 stars: a right triangle with 10 stars in total.

## Traps in this topic

- resetting: the inner loop variable starts again from its initial value every outer pass
- a break inside the inner loop does **not** stop the outer loop
- inner bounds that depend on i (j = i, j < i) change the count every pass

## Practice

1. Integer c = 0; for (i = 1; i <= 5; i++) for (j = i + 1; j <= 5; j++) c++; Print c
2. Integer c = 0; for (i = 1; i <= 4; i++) for (j = 1; j <= 4; j++) if (i == j) c++; Print c
3. Integer t = 0; for (i = 1; i <= 3; i++) for (j = 1; j <= 3; j++) t = t + 1; Print t

**Answers:** 1) 5 × 4 / 2 = **10**. 2) only the diagonal: **4**. 3) 3 × 3 = **9**.`,
    sources: [WIKI_LOOP, CS50],
    remember: [
      "The inner loop runs completely for every pass of the outer loop",
      "Fixed bounds: n × m passes; j = 1 to i or j = i to n: n(n + 1) / 2",
      "j = i + 1 to n: n(n − 1) / 2 (every pair once)",
      "break inside the inner loop stops only the inner loop",
      "Doubling or halving loops run about log₂ n times",
    ],
    quick: {
      question: "count = 0; for (i = 1; i <= 4; i++) for (j = i; j <= 4; j++) count++. Print count",
      options: ["10", "16", "4", "6"],
      answer: 0,
      explanation: "4 + 3 + 2 + 1 = 10, which is n(n + 1) / 2 for n = 4.",
    },
    questions: [
      { q: "s = 0; for (i = 1; i <= 3; i++) for (j = 1; j <= i; j++) s = s + i * j. Print s", o: ["25", "18", "36", "14"], a: 0, e: "1 + (2 + 4) + (3 + 6 + 9) = 25." },
      { q: "c = 0; for (i = 1; i < 100; i = i * 2) c++. Print c", o: ["7", "6", "100", "50"], a: 0, e: "i = 1, 2, 4, 8, 16, 32, 64: seven passes." },
      { q: "c = 0; for (i = 1; i <= 5; i++) for (j = i + 1; j <= 5; j++) c++. Print c", o: ["10", "15", "25", "20"], a: 0, e: "Every pair once: 5 × 4 / 2 = 10." },
      { q: "A break inside an inner loop of a nested loop…", o: ["Ends only the inner loop", "Ends both loops", "Ends the program", "Skips one inner pass only"], a: 0, e: "break exits the innermost loop it's in; the outer loop continues." },
    ],
    visual: {
      plain: "A nested loop is a clock. The inner loop is the minute hand: it goes all the way round for every single tick of the hour hand, the outer loop. Total ticks of the minute hand = hours × minutes.",
      diagram: `flowchart TB
  O["outer: i = 1, 2, 3"] --> I1["i = 1: j = 1, 2"]
  O --> I2["i = 2: j = 1, 2"]
  O --> I3["i = 3: j = 1, 2"]
  I1 & I2 & I3 --> T["3 × 2 = 6 passes"]`,
      caption: "For every outer pass, the inner loop starts over and runs to the end.",
    },
  },
  {
    slug: "functions-and-parameters",
    title: "Functions and Parameters",
    description: "Calling functions, return values, local and global scope, pass by value and by reference.",
    minutes: 25,
    theory: `A function is a named block of steps you can run (call) from elsewhere, optionally passing values in and getting a value back. Output questions test what the function returns, and **whether the caller's variables change**.

## Start here

~~~
Function square(Integer x)
    return x * x
End function

Integer a = square(4) + 1    // square(4) returns 16, so a = 17
~~~

When a function is called: the arguments are evaluated, copied into the parameters, the body runs, and return sends one value back to where the call was.

## Pass by value (the default in test pseudocode)

The function gets a **copy**. Changing the parameter doesn't change the caller's variable.

~~~
Function change(Integer x)
    x = x + 10
    return x
End function

Integer a = 5
Integer b = change(a)
Print a, b      // 5 15
~~~

## Pass by reference

If the question says the parameter is passed by reference (or uses a pointer or &), the function works on the caller's variable itself:

~~~
Function change(reference Integer x)
    x = x + 10
End function

Integer a = 5
change(a)
Print a         // 15
~~~

A classic: a swap function that receives its arguments by value swaps only its copies, so the caller sees no change.

## Scope: local versus global

A variable declared inside a function is **local**: it exists only during that call and hides any global variable with the same name.

~~~
Integer g = 1          // global
Function f()
    Integer g = 5      // a new local g, hides the global one
    return g + 1
End function

Print f() + g          // 6 + 1 = 7
~~~

If f had written g = 5 without declaring it, it would have changed the global g.

## Calls inside calls

Work from the innermost call outwards:

~~~
Function f(Integer x)
    return 2 * x + 1
End function

Print f(f(2))      // f(2) = 5, then f(5) = 11
~~~

## Static (remembered) variables

Some questions declare a variable static inside a function: it keeps its value between calls.

~~~
Function counter()
    static Integer c = 0
    c = c + 1
    return c
End function

Print counter(), counter(), counter()    // 1 2 3
~~~

## Traps in this topic

- assuming a by-value parameter changes the caller's variable
- forgetting that code after return in the same branch never runs
- confusing a local variable with a global of the same name
- evaluating nested calls in the wrong order

## Practice

1. Function f(Integer n) return n % 3 + n / 3. Print f(10)
2. Function g(Integer a, Integer b) { a = a + b; return a * 2 }. Integer x = 2, y = 3; Print g(x, y), x
3. Function h(Integer n) return n * n. Print h(h(2) + 1)

**Answers:** 1) 1 + 3 = **4**. 2) the copy a becomes 5 and the function returns 10; x is still 2: **10 2**. 3) h(2) = 4, h(5) = **25**.`,
    sources: [WIKI_EVAL, CS50],
    remember: [
      "Arguments are evaluated, copied into parameters, and return sends one value back",
      "By value: the function changes only its copy",
      "By reference: the function changes the caller's variable",
      "A local variable hides a global one with the same name",
      "Evaluate nested calls from the innermost outwards",
    ],
    quick: {
      question: "Function change(Integer x) { x = x + 10; return x }. Integer a = 5; Integer b = change(a). Print a, b",
      options: ["5 15", "15 15", "5 5", "15 5"],
      answer: 0,
      explanation: "Passed by value: the function changes its copy and returns 15; a stays 5.",
    },
    questions: [
      { q: "Function f(Integer x) return 2 * x + 1. Print f(f(2))", o: ["11", "5", "9", "13"], a: 0, e: "f(2) = 5, then f(5) = 11." },
      { q: "Integer g = 1. Function f() { Integer g = 5; return g + 1 }. Print f() + g", o: ["7", "12", "2", "11"], a: 0, e: "f uses its local g (5) and returns 6; the global g is still 1." },
      { q: "A swap(a, b) function whose parameters are passed by value is called on x = 1, y = 2. Afterwards…", o: ["x = 1, y = 2", "x = 2, y = 1", "x = 2, y = 2", "It can't compile"], a: 0, e: "Only the copies inside the function are swapped." },
      { q: "A function has static Integer c = 0; c = c + 1; return c. It's called three times. What does the third call return?", o: ["3", "1", "0", "2"], a: 0, e: "A static variable keeps its value between calls: 1, 2, 3." },
    ],
    visual: {
      plain: "Passing by value is handing someone a photocopy: they can scribble on it and your original is untouched. Passing by reference is handing them the original document.",
      diagram: `flowchart LR
  A["caller: a = 5"] -->|"copy of 5"| F["change(x)<br/>x = x + 10 → 15"]
  F -->|"return 15"| B["b = 15"]
  A -.->|"still 5"| P["Print a, b → 5 15"]`,
      caption: "By value, the function only ever sees a copy of a.",
    },
  },
];
