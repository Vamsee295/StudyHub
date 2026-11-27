// Pseudocode & output prediction, part 2: recursion, arrays and strings, bitwise operations, data types and
// overflow, recognising algorithms, and exam strategy. Original writing.
import type { FullLesson } from './apt-extra-types';

const WIKI_RECURSION = { title: "Wikipedia: Recursion (computer science)", url: "https://en.wikipedia.org/wiki/Recursion_(computer_science)" };
const WIKI_ARRAY = { title: "Wikipedia: Array (data structure)", url: "https://en.wikipedia.org/wiki/Array_(data_structure)" };
const WIKI_ASCII = { title: "Wikipedia: ASCII", url: "https://en.wikipedia.org/wiki/ASCII" };
const WIKI_BITWISE = { title: "Wikipedia: Bitwise operation", url: "https://en.wikipedia.org/wiki/Bitwise_operation" };
const WIKI_TWOS = { title: "Wikipedia: Two's complement", url: "https://en.wikipedia.org/wiki/Two%27s_complement" };
const WIKI_OVERFLOW = { title: "Wikipedia: Integer overflow", url: "https://en.wikipedia.org/wiki/Integer_overflow" };
const WIKI_SORT = { title: "Wikipedia: Sorting algorithm", url: "https://en.wikipedia.org/wiki/Sorting_algorithm" };
const WIKI_BIGO = { title: "Wikipedia: Big O notation", url: "https://en.wikipedia.org/wiki/Big_O_notation" };
const TUTOR = { title: "Python Tutor: step through C, Java or Python code visually (free)", url: "https://pythontutor.com/c.html" };

export const pseudocodePart2: FullLesson[] = [
  {
    slug: "recursion-tracing",
    title: "Recursion Tracing",
    description: "Base cases, the call stack, printing before or after the recursive call, and counting calls.",
    minutes: 30,
    theory: `A recursive function calls itself on a smaller version of the problem until it reaches a **base case** it can answer directly. Recursion questions look scary but follow a fixed method: expand the calls downwards, then collect the answers upwards.

## Start here: factorial

~~~
Function fact(Integer n)
    if (n <= 1) return 1          // base case
    return n * fact(n - 1)        // recursive case
End function
~~~

fact(4):

~~~
fact(4) = 4 * fact(3)
        = 4 * 3 * fact(2)
        = 4 * 3 * 2 * fact(1)
        = 4 * 3 * 2 * 1 = 24
~~~

Each call waits on a **stack** until the call below it returns. The deepest call returns first.

## The method for any recursion question

1. Write the first call
2. Expand it into the call(s) it makes, until every branch reaches a base case
3. Replace each base case with its value and collect upwards
4. For printing questions, note exactly where the Print sits: before or after the recursive call

## Worked example 1: sum of digits

~~~
Function f(Integer n)
    if (n == 0) return 0
    return n % 10 + f(n / 10)
End function
Print f(352)
~~~

f(352) = 2 + f(35) = 2 + 5 + f(3) = 2 + 5 + 3 + f(0) = **10**.

## Worked example 2: print before versus after

~~~
Function p(Integer n)
    if (n == 0) return
    Print n
    p(n - 1)
End function
~~~

p(3) prints **3 2 1**: each call prints, then goes deeper. Move the Print after the recursive call and p(3) prints **1 2 3**, because each call prints only after everything below it has finished. This one swap is behind a large share of recursion questions.

## Worked example 3: Euclid's GCD

~~~
Function g(Integer a, Integer b)
    if (b == 0) return a
    return g(b, a % b)
End function
Print g(48, 18)
~~~

g(48, 18) → g(18, 12) → g(12, 6) → g(6, 0) → **6**. Recognising "this is GCD" saves the trace next time.

## Worked example 4: two calls per step (a call tree)

~~~
Function fib(Integer n)
    if (n <= 1) return n
    return fib(n - 1) + fib(n - 2)
End function
~~~

fib(5) = 5. How many calls does fib(5) make? Let C(n) be the calls for fib(n): C(0) = C(1) = 1 and C(n) = C(n − 1) + C(n − 2) + 1. So C(2) = 3, C(3) = 5, C(4) = 9, C(5) = **15**. Functions with two recursive calls grow exponentially.

## Worked example 5: fast power

~~~
Function pw(Integer x, Integer n)
    if (n == 0) return 1
    Integer h = pw(x, n / 2)
    if (n % 2 == 0) return h * h
    return h * h * x
End function
~~~

pw(2, 10): n = 10 → 5 → 2 → 1 → 0, only five calls, and the result is 1024. Halving n each call gives about log₂ n calls.

## Traps in this topic

- no base case, or a base case that's never reached (n decreases by 2 from an odd number to below 0)
- forgetting the pending work after a call returns (the "n *" in factorial)
- the position of Print relative to the recursive call
- counting calls: the base-case calls count too

## Practice

1. Function f(Integer n) { if (n <= 0) return 0; return n + f(n - 2) }. Print f(7)
2. Function q(Integer n) { if (n == 0) return; q(n / 2); Print n % 2 }. q(6)
3. Function r(Integer n) { if (n < 10) return n; return r(n / 10) }. Print r(5832)

**Answers:** 1) 7 + 5 + 3 + 1 + 0 = **16**. 2) it prints the binary form of 6: **1 1 0**. 3) it keeps dropping the last digit and returns the first: **5**.`,
    sources: [WIKI_RECURSION, TUTOR],
    remember: [
      "Every recursion needs a base case it's guaranteed to reach",
      "Expand calls downwards, then collect answers upwards",
      "Print before the recursive call: descending order; after: ascending order",
      "g(a, b) = g(b, a % b) with g(a, 0) = a is Euclid's GCD",
      "Two recursive calls per step grow exponentially; halving gives about log n calls",
    ],
    quick: {
      question: "Function p(n) { if (n == 0) return; p(n - 1); Print n }. What does p(3) print?",
      options: ["1 2 3", "3 2 1", "3", "0 1 2 3"],
      answer: 0,
      explanation: "Each call prints only after the call below it has finished, so the deepest (1) prints first.",
    },
    questions: [
      { q: "Function f(n) { if (n == 0) return 0; return n % 10 + f(n / 10) }. Print f(352)", o: ["10", "352", "253", "9"], a: 0, e: "It adds the digits: 2 + 5 + 3 = 10." },
      { q: "Function g(a, b) { if (b == 0) return a; return g(b, a % b) }. Print g(48, 18)", o: ["6", "18", "3", "144"], a: 0, e: "48,18 → 18,12 → 12,6 → 6,0: the GCD, 6." },
      { q: "How many calls in total does fib(4) make, with fib(n) = fib(n−1) + fib(n−2) and fib(0), fib(1) as base cases?", o: ["9", "5", "4", "8"], a: 0, e: "C(2) = 3, C(3) = 5, C(4) = C(3) + C(2) + 1 = 9." },
      { q: "Function f(n) { if (n <= 0) return 0; return n + f(n - 2) }. Print f(7)", o: ["16", "28", "12", "15"], a: 0, e: "7 + 5 + 3 + 1 + f(−1) = 16." },
    ],
    visual: {
      plain: "Recursion is a stack of plates. Each call puts a plate on the pile and waits. When the base case is reached, plates come off from the top, each one finishing its own sum and handing the result down.",
      diagram: `flowchart TB
  A["fact(4) = 4 × fact(3)"] --> B["fact(3) = 3 × fact(2)"] --> C["fact(2) = 2 × fact(1)"] --> D["fact(1) = 1 (base case)"]
  D -.->|"returns 1"| C
  C -.->|"returns 2"| B
  B -.->|"returns 6"| A
  A -.-> R["24"]`,
      caption: "Calls go down to the base case; answers come back up.",
    },
  },
  {
    slug: "arrays-and-strings",
    title: "Arrays and Strings",
    description: "Indexing, traversal, in-place updates, reversing, character codes and common traps.",
    minutes: 25,
    theory: `An array is a row of boxes holding values of one type, each found by its position (index). A string is an array of characters. Output questions test indexing, loops over arrays, and updates that change later steps.

## Start here

~~~
Integer arr[5] = {3, 8, 1, 9, 4}
// index:          0  1  2  3  4
Print arr[0], arr[4]      // 3 4
~~~

- indexes usually start at **0**, so the last index is size − 1. Some tests start at 1: read the question
- reading arr[5] in a 5-element array is out of bounds: an error, or garbage in C

## Worked example 1: the maximum

~~~
Integer m = arr[0]
for (i = 1; i < 5; i++)
    if (arr[i] > m) m = arr[i]
Print m       // 9
~~~

## Worked example 2: updates that feed later steps

~~~
Integer arr[5] = {3, 8, 1, 9, 4}
for (i = 1; i < 5; i++)
    arr[i] = arr[i - 1] + arr[i]
Print arr[4]
~~~

Each step uses the **already updated** previous element: 3, 11, 12, 21, 25. Output: **25** (these are running totals, called prefix sums). Tracing the whole array row by row avoids mistakes.

## Worked example 3: reverse in place

~~~
Integer a[5] = {1, 2, 3, 4, 5}, n = 5, t
for (i = 0; i < n / 2; i++)
    t = a[i]; a[i] = a[n - 1 - i]; a[n - 1 - i] = t
~~~

i = 0 swaps 1 and 5, i = 1 swaps 2 and 4; the middle stays. Result {5, 4, 3, 2, 1}. If the loop ran to n instead of n / 2, every pair would be swapped twice and the array would end up unchanged, a common trap.

## Characters are numbers

Characters are stored as codes (ASCII):

| Character | Code |
|---|---|
| '0' to '9' | 48 to 57 |
| 'A' to 'Z' | 65 to 90 |
| 'a' to 'z' | 97 to 122 |

So 'C' + 2 is 69, which prints as 69 if stored in an Integer, or as 'E' if stored in a Character. Lowercase = uppercase + 32, and a digit character minus '0' gives its value: '7' − '0' = 7.

## Worked example 4: counting vowels

~~~
String s = "placement"
Integer c = 0
for (i = 0; i < length(s); i++)
    if (s[i] is one of a, e, i, o, u) c = c + 1
Print c      // a, e, e: 3
~~~

## 2D arrays

A 2D array m[r][c] is a grid. m[i][j] is row i, column j. The main diagonal is where i == j; the other diagonal is where i + j == n − 1.

## Traps in this topic

- off-by-one: < n versus <= n, and starting at index 1 versus 0
- updating an array while reading it: later steps see the new values
- reversing by looping all the way to n
- printing a character code instead of the character, or the other way round

## Practice

1. Integer a[4] = {2, 4, 6, 8}, s = 0; for (i = 0; i < 4; i += 2) s += a[i]; Print s
2. Integer a[5] = {5, 1, 4, 2, 3}; for (i = 0; i < 4; i++) if (a[i] > a[i + 1]) swap a[i], a[i + 1]; Print a[4]
3. Character c = 'a'; c = c + 3; Print c

**Answers:** 1) 2 + 6 = **8**. 2) the largest value bubbles to the end: **5**. 3) **d**.`,
    sources: [WIKI_ARRAY, WIKI_ASCII],
    remember: [
      "Indexes start at 0 unless the question says otherwise; the last is size − 1",
      "In-place updates feed later steps: trace the whole array each pass",
      "Reverse by swapping i with n − 1 − i up to n / 2 only",
      "'0' = 48, 'A' = 65, 'a' = 97; lowercase = uppercase + 32",
    ],
    quick: {
      question: "arr = {3, 8, 1, 9, 4}. for (i = 1; i < 5; i++) arr[i] = arr[i − 1] + arr[i]. Print arr[4]",
      options: ["25", "13", "4", "21"],
      answer: 0,
      explanation: "Running totals: 3, 11, 12, 21, 25. Each step uses the updated previous value.",
    },
    questions: [
      { q: "a = {1, 2, 3, 4, 5}, n = 5. for (i = 0; i < n; i++) swap a[i] and a[n − 1 − i]. Final array?", o: ["{1, 2, 3, 4, 5}", "{5, 4, 3, 2, 1}", "{5, 2, 3, 4, 1}", "{1, 4, 3, 2, 5}"], a: 0, e: "Looping to n swaps every pair twice, putting everything back. Stop at n / 2 to reverse." },
      { q: "What is the ASCII code of 'C' + 2 stored in an Integer?", o: ["69", "67", "E", "70"], a: 0, e: "'C' is 67, so 67 + 2 = 69." },
      { q: "How many vowels does the loop count in \"placement\"?", o: ["3", "2", "4", "9"], a: 0, e: "The vowels in placement are a, e and e: three." },
      { q: "In an n × n matrix, which cells are on the secondary (anti) diagonal?", o: ["i + j == n − 1", "i == j", "i == 0", "j == n"], a: 0, e: "With 0-based indexes, row i meets the anti-diagonal at column n − 1 − i." },
    ],
    visual: {
      plain: "An array is a row of numbered lockers. The index is the locker number, starting from 0, and a loop is you walking along the row opening one locker at a time.",
      diagram: `flowchart LR
  A0["[0] 3"] --> A1["[1] 3+8 = 11"] --> A2["[2] 11+1 = 12"] --> A3["[3] 12+9 = 21"] --> A4["[4] 21+4 = 25"]`,
      caption: "arr[i] = arr[i − 1] + arr[i] uses the already updated value on the left.",
    },
  },
  {
    slug: "bitwise-operations",
    title: "Bitwise Operations",
    description: "Binary, AND, OR, XOR, NOT and shifts, plus the tricks tests love.",
    minutes: 30,
    theory: `Bitwise operators work on the individual binary digits (bits) of whole numbers. Placement pseudocode uses them heavily, and the symbol ^ in these tests means **XOR**, not power.

## Start here: binary in two minutes

Each binary digit is a power of 2, from the right: 1, 2, 4, 8, 16…

~~~
13 = 8 + 4 + 1 = 1101
10 = 8 + 2     = 1010
~~~

To convert a number to binary, keep dividing by 2 and read the remainders from bottom to top.

## The operators

| Operator | Rule per bit | 12 op 10 (1100, 1010) |
|---|---|---|
| & AND | 1 only if both are 1 | 1000 = 8 |
| OR (single bar) | 1 if either is 1 | 1110 = 14 |
| ^ XOR | 1 if the bits differ | 0110 = 6 |
| ~ NOT | flips every bit | ~12 = −13 |
| << k | shift left by k | 5 << 2 = 20 |
| >> k | shift right by k | 37 >> 2 = 9 |

## Shifts are multiplication and division by powers of 2

- x << k = x × 2ᵏ (5 << 2 = 5 × 4 = 20)
- x >> k = x ÷ 2ᵏ, dropping the remainder, for non-negative x (37 >> 2 = 9)

## NOT and two's complement

Integers store negatives in two's complement, which makes ~x = −(x + 1): ~5 = −6, ~0 = −1, ~(−1) = 0.

## Tricks worth memorising

| Expression | Meaning |
|---|---|
| x & 1 | 1 if x is odd, 0 if even |
| x & (x − 1) | x with its lowest 1-bit cleared; 0 exactly when x is a power of 2 (x > 0) |
| x ^ x | 0 |
| x ^ 0 | x |
| a ^ b ^ a | b (pairs cancel) |
| x & −x | the lowest 1-bit on its own |

XOR can swap two variables without a temporary: a = a ^ b; b = a ^ b; a = a ^ b.

## Worked example 1: counting 1-bits

~~~
Integer n = 29, c = 0        // 29 = 11101
while (n > 0)
    c = c + (n & 1)
    n = n >> 1
end while
Print c
~~~

The loop reads the last bit and shifts it away: 1, 0, 1, 1, 1, so c = **4**.

## Worked example 2: the unpaired number

~~~
Integer a[5] = {4, 7, 2, 4, 2}, x = 0
for (i = 0; i < 5; i++) x = x ^ a[i]
Print x
~~~

Pairs cancel: 4 ^ 4 = 0 and 2 ^ 2 = 0, leaving **7**.

## Worked example 3: mixing with arithmetic

~~~
Integer a = 6, b = 3
Print (a & b) + (a ^ b)     // 2 + 5 = 7
Print a + b                 // 9
~~~

Mind precedence: & ^ and the single bar sit **below** comparisons and arithmetic, so x & 1 == 0 means x & (1 == 0), not (x & 1) == 0. Good questions use brackets; if they don't, apply the table.

## Traps in this topic

- reading ^ as power (2 ^ 3 is 1 in XOR, not 8)
- confusing & (bitwise) with && (logical): 6 & 3 = 2, but 6 && 3 = 1
- shifting a negative number right (the result depends on the language)
- precedence of & below ==

## Practice

1. 25 & 15
2. 6 ^ 3
3. 24 & 23
4. Integer x = 1; for (i = 0; i < 4; i++) x = x << 1; Print x

**Answers:** 1) 11001 & 01111 = 01001 = **9**. 2) 110 ^ 011 = 101 = **5**. 3) 11000 & 10111 = 10000 = **16**. 4) 1 shifted left 4 times = **16**.`,
    sources: [WIKI_BITWISE, WIKI_TWOS],
    remember: [
      "In test pseudocode ^ is XOR, not power",
      "x << k multiplies by 2ᵏ; x >> k divides by 2ᵏ (non-negative x)",
      "~x = −(x + 1) in two's complement",
      "x & 1 tests odd; x & (x − 1) clears the lowest set bit",
      "a ^ a = 0, so XOR of a list leaves the unpaired value",
    ],
    quick: {
      question: "What is 12 ^ 10 in test pseudocode?",
      options: ["6", "1000000000000", "14", "8"],
      answer: 0,
      explanation: "^ is XOR: 1100 ^ 1010 = 0110 = 6.",
    },
    questions: [
      { q: "What is 37 >> 2?", o: ["9", "148", "9.25", "35"], a: 0, e: "Shifting right by 2 divides by 4 and drops the remainder: 9." },
      { q: "What is ~5 for a two's complement Integer?", o: ["-6", "-5", "2", "250"], a: 0, e: "In two's complement ~x = −(x + 1), so ~5 = −6." },
      { q: "n = 29, c = 0. while (n > 0) { c = c + (n & 1); n = n >> 1 }. Print c", o: ["4", "5", "3", "29"], a: 0, e: "29 is 11101, which has four 1-bits." },
      { q: "x = 0; XOR x with every element of {4, 7, 2, 4, 2}. Print x", o: ["7", "19", "0", "4"], a: 0, e: "Equal values cancel in XOR, leaving the unpaired 7." },
    ],
    visual: {
      plain: "Write both numbers in binary, one above the other, and compare column by column. AND keeps a 1 only where both columns have 1, OR where either does, XOR where they differ.",
      diagram: `flowchart LR
  A["12 = 1100"] --> X{"compare<br/>bit by bit"}
  B["10 = 1010"] --> X
  X --> AN["AND: 1000 = 8"]
  X --> OR["OR: 1110 = 14"]
  X --> XO["XOR: 0110 = 6"]`,
      caption: "Same two numbers, three operators, three answers.",
    },
  },
  {
    slug: "data-types-and-overflow",
    title: "Data Types and Overflow",
    description: "Integer and character ranges, overflow wrap-around, integer versus float division, and casting.",
    minutes: 25,
    theory: `Every variable has a type that fixes what values it can hold. Questions in this topic check what happens at the edges: a value too large for its type, a division between Integers, or a Float turned back into an Integer.

## Start here: common types and ranges

| Type | Size | Range |
|---|---|---|
| signed char | 1 byte | −128 to 127 |
| unsigned char | 1 byte | 0 to 255 |
| short | 2 bytes | −32,768 to 32,767 |
| int (32-bit) | 4 bytes | −2,147,483,648 to 2,147,483,647 |
| long long | 8 bytes | about ±9.2 × 10¹⁸ |
| float / double | 4 / 8 bytes | decimals, with limited precision |

An n-bit unsigned type holds 0 to 2ⁿ − 1; signed holds −2ⁿ⁻¹ to 2ⁿ⁻¹ − 1.

## Overflow wraps around

When a value goes past the top of its range, tests expect it to wrap round to the bottom, like a car's odometer:

~~~
unsigned char x = 250
x = x + 10          // 260 doesn't fit: 260 − 256 = 4
Print x             // 4

signed char y = 127
y = y + 1           // wraps to −128
~~~

For unsigned types the rule is result mod 2ⁿ. (Strictly, signed overflow is undefined in C, but placement questions assume the two's complement wrap shown above.)

## Integer versus Float division

The division happens in the type of its operands, **before** the result is stored:

~~~
Integer a = 7, b = 2
Float c = a / b      // 7 / 2 = 3 in Integers, then stored as 3.0
Float d = a / 2.0    // one Float operand: 3.5
Float e = (Float)a / b   // cast first: 3.5
~~~

## Casting truncates toward zero

~~~
(Integer) 7.9   = 7
(Integer) -7.9  = -7
(Integer) 'A'   = 65
~~~

Casting never rounds. Rounding to the nearest needs (Integer)(x + 0.5) for positive x.

## Mixed expressions promote

In an expression with an Integer and a Float, the Integer is converted to Float first. With a Character and an Integer, the character's code is used.

## Floating-point is approximate

0.1 + 0.2 is stored as 0.30000000000000004, so comparing Floats with == can surprise you. Tests occasionally ask whether a loop like "for (f = 0.0; f != 1.0; f += 0.1)" ends: it may never hit exactly 1.0.

## Traps in this topic

- expecting 3.5 from 7 / 2 because the result variable is a Float
- expecting rounding from a cast
- forgetting the range of char when a loop counts up in a char variable
- assuming Floats compare exactly

## Practice

1. unsigned char u = 200; u = u + 100; Print u
2. Integer a = 9, b = 4; Float f = a / b; Print f
3. Print (Integer)(5.99) + (Integer)(-2.5)
4. A loop "for (unsigned char c = 0; c < 300; c++)": how many times does it run?

**Answers:** 1) 300 − 256 = **44**. 2) 9 / 4 = 2 in Integers: **2.0**. 3) 5 + (−2) = **3**. 4) c can never reach 300, so it wraps from 255 to 0 and the loop **never ends**.`,
    sources: [WIKI_OVERFLOW, WIKI_TWOS],
    remember: [
      "unsigned n-bit: 0 to 2ⁿ − 1; signed: −2ⁿ⁻¹ to 2ⁿ⁻¹ − 1",
      "Overflow wraps: unsigned results are taken mod 2ⁿ",
      "Integer / Integer drops the fraction before the result is stored",
      "Casting truncates toward zero; it never rounds",
      "Don't compare Floats with ==",
    ],
    quick: {
      question: "unsigned char x = 250; x = x + 10. Print x",
      options: ["4", "260", "255", "-6"],
      answer: 0,
      explanation: "An unsigned char holds 0–255, so 260 wraps to 260 − 256 = 4.",
    },
    questions: [
      { q: "Integer a = 7, b = 2. Float c = a / b. Print c", o: ["3.0", "3.5", "4.0", "3.49"], a: 0, e: "The division happens in Integers (7 / 2 = 3) before the result is stored." },
      { q: "What is (Integer)(-7.9)?", o: ["-7", "-8", "7", "8"], a: 0, e: "Casting truncates toward zero." },
      { q: "signed char y = 127; y = y + 1. Under the two's complement wrap tests assume, y is…", o: ["-128", "128", "0", "127"], a: 0, e: "127 is the top of the signed char range; adding 1 wraps to the bottom, −128." },
      { q: "What is the largest value of a 16-bit unsigned integer?", o: ["65,535", "32,767", "65,536", "255"], a: 0, e: "An n-bit unsigned value tops out at 2ⁿ − 1: 2¹⁶ − 1 = 65,535." },
    ],
    visual: {
      plain: "A data type is an odometer with a fixed number of digits. Drive past the largest reading and it rolls back to the smallest. That roll-over is overflow.",
      diagram: `flowchart LR
  A["unsigned char<br/>250"] -->|"add 10"| B["260 doesn't fit<br/>(max 255)"] --> C["wraps: 260 − 256<br/>= 4"]`,
      caption: "Unsigned results are taken mod 2ⁿ (256 for one byte).",
    },
  },
  {
    slug: "recognising-algorithms",
    title: "Recognising Algorithms",
    description: "Spot linear and binary search, bubble, selection and insertion sort, primes and palindromes, and their complexity.",
    minutes: 30,
    theory: `Many pseudocode questions are a well-known algorithm with the name removed. If you can recognise it, you know the output without tracing every step, and you can answer "what does this code do?" and "how many times does this run?" questions in seconds.

## Start here: shapes to recognise

| You see | It is |
|---|---|
| one loop comparing each element to a key | linear search |
| low, high, mid = (low + high) / 2, halving the range | binary search (needs sorted data) |
| nested loops swapping arr[j] and arr[j + 1] | bubble sort |
| inner loop finds the smallest, one swap per outer pass | selection sort |
| shifting larger elements right, inserting a key | insertion sort |
| g(b, a % b) | GCD (Euclid) |
| loop from 2 to √n checking n % i == 0 | prime test |
| comparing s[i] with s[n − 1 − i] | palindrome check |
| r = r * 10 + n % 10 | reversing a number |
| sum of each digit cubed equals the number | Armstrong number (153 = 1 + 125 + 27) |

## Worked example 1: bubble sort, one pass

~~~
Integer a[5] = {5, 1, 4, 2, 8}
for (j = 0; j < 4; j++)
    if (a[j] > a[j + 1]) swap a[j], a[j + 1]
~~~

5 > 1 swap → {1, 5, 4, 2, 8}; 5 > 4 swap → {1, 4, 5, 2, 8}; 5 > 2 swap → {1, 4, 2, 5, 8}; 5 < 8 no swap. After one pass: **{1, 4, 2, 5, 8}**. Each pass carries the largest remaining value to the end.

Facts tests ask about bubble sort:
- comparisons without an early stop: n(n − 1) / 2 (6 for n = 4)
- number of swaps = number of inversions (pairs out of order); {4, 3, 2, 1} has **6**
- with an "already sorted, stop early" flag, a sorted input needs only one pass

## Worked example 2: selection sort

~~~
for (i = 0; i < n - 1; i++)
    min = i
    for (j = i + 1; j < n; j++)
        if (a[j] < a[min]) min = j
    swap a[i], a[min]
~~~

At most n − 1 swaps in total, but always n(n − 1) / 2 comparisons.

## Worked example 3: binary search steps

Each step halves the range, so searching n sorted items takes at most about log₂ n + 1 comparisons: 1,000 items → at most **10** (2¹⁰ = 1,024).

## Time complexity in one table

| Code shape | Complexity |
|---|---|
| a fixed number of steps | O(1) |
| range halves each step | O(log n) |
| one loop over n | O(n) |
| a loop over n with a halving loop inside | O(n log n) |
| two nested loops over n | O(n²) |
| two recursive calls, each on n − 1 | O(2ⁿ) |

Questions often ask for the complexity of the code shown: identify the shape, ignore constants.

## Traps in this topic

- assuming binary search works on unsorted data
- counting comparisons and swaps as the same thing
- mid = (low + high) / 2 uses integer division: (0 + 9) / 2 = 4
- O(n) + O(n) is still O(n); constants don't count

## Practice

1. How many swaps does bubble sort make on {3, 1, 2}?
2. What is the complexity of: for (i = 1; i < n; i = i * 2) for (j = 0; j < n; j++) …?
3. A loop checks n % i == 0 for i from 2 while i * i <= n. What does it test?

**Answers:** 1) inversions (3,1) and (3,2): **2**. 2) log n outer passes × n inner: **O(n log n)**. 3) whether n is **prime**.`,
    sources: [WIKI_SORT, WIKI_BIGO],
    remember: [
      "low, high, mid halving = binary search, sorted input only, about log₂ n steps",
      "Bubble sort: largest value moves to the end each pass; swaps = inversions",
      "Selection sort: n(n − 1) / 2 comparisons, at most n − 1 swaps",
      "Halving O(log n); one loop O(n); two nested O(n²); loop with halving inside O(n log n)",
    ],
    quick: {
      question: "After one pass of bubble sort, what is {5, 1, 4, 2, 8}?",
      options: ["{1, 4, 2, 5, 8}", "{1, 2, 4, 5, 8}", "{1, 5, 4, 2, 8}", "{5, 1, 4, 2, 8}"],
      answer: 0,
      explanation: "The pass swaps 5 rightwards past 1, 4 and 2, stopping before 8.",
    },
    questions: [
      { q: "How many swaps does bubble sort make on {4, 3, 2, 1}?", o: ["6", "4", "3", "12"], a: 0, e: "Swaps equal inversions; every one of the 4 × 3 / 2 pairs is out of order." },
      { q: "At most how many comparisons does binary search need on 1,000 sorted items?", o: ["10", "100", "500", "1000"], a: 0, e: "2¹⁰ = 1,024 ≥ 1,000, so about 10 halvings." },
      { q: "What is the time complexity of two nested loops, each running n times?", o: ["O(n²)", "O(n)", "O(log n)", "O(2n)"], a: 0, e: "n passes of a loop that runs n times." },
      { q: "Code checks whether the sum of the cubes of a 3-digit number's digits equals the number. What is it testing?", o: ["Armstrong number", "Palindrome", "Perfect number", "Prime"], a: 0, e: "153 = 1³ + 5³ + 3³ is the classic Armstrong number." },
    ],
    visual: {
      plain: "Bubble sort is like bubbles in water: in every pass the biggest remaining value rises to the top (the end of the array), one swap at a time.",
      diagram: `flowchart LR
  P0["5 1 4 2 8"] -->|"swap 5,1"| P1["1 5 4 2 8"] -->|"swap 5,4"| P2["1 4 5 2 8"] -->|"swap 5,2"| P3["1 4 2 5 8"] -->|"8 is bigger: no swap"| P4["pass done"]`,
      caption: "One pass of bubble sort: the largest value moves to the end.",
    },
  },
  {
    slug: "pseudocode-exam-strategy",
    title: "Pseudocode Exam Strategy",
    description: "How campus pseudocode sections work, a timing plan, the traps checklist, and a mixed practice set.",
    minutes: 25,
    theory: `You now know every building block. This lesson turns it into marks: how pseudocode sections are typically set, how to spend your minutes, and the checklist that catches the traps examiners plant.

## How these sections usually look

Pseudocode or "programming logic" sections appear in the online tests of many mass recruiters (TCS NQT, Accenture, Capgemini, Cognizant and others). Patterns change every year, so check the official page for your drive, but you can expect:

- multiple-choice questions showing a short program and asking for the output or a variable's final value
- C-style syntax, with ^ meaning XOR and Integer division dropping fractions
- around a minute per question, with no compiler
- topics in this course: operators, conditions, loops, nested loops, functions, recursion, arrays, bitwise operations, data types and algorithm recognition

## A timing plan

1. **First pass:** answer every question you can trace in under a minute
2. **Mark and skip** long recursions and nested loops on the first pass
3. **Second pass:** come back to the marked ones with the time saved
4. Never leave a question blank if there's no negative marking: eliminate options and guess

## The traps checklist

Before choosing an option, ask:

| Check | Example trap |
|---|---|
| Integer division? | 7 / 2 = 3, even if stored in a Float |
| ^ means XOR? | 2 ^ 3 = 1 |
| < or <=? | one pass too many or too few |
| short-circuit? | the right side of && or || may never run |
| pass by value? | the caller's variable doesn't change |
| x++ or ++x? | old value or new value used |
| overflow? | unsigned char 250 + 10 = 4 |
| else attached where? | the nearest unmatched if |
| Print before or after recursion? | descending or ascending output |

## Use the options

- if options differ by one, recheck the loop boundaries
- if two options are a value and that value plus 1, recheck increments
- substitute a small input (n = 1 or 2) to test what a function computes
- "Error" or "infinite loop" options are right more often when a loop variable never reaches its limit or an index goes out of bounds

## From scratch to pro: a four-week plan

| Week | Focus | Daily |
|---|---|---|
| 1 | reading, operators, conditions | 15 short traces |
| 2 | loops and nested loops | 15 traces, counting passes without tracing |
| 3 | functions, recursion, arrays | 10 traces, drawing call trees |
| 4 | bitwise, data types, algorithms, timed sets | 2 timed sets of 10 |

## Mixed practice (one minute each)

1. Integer a = 5, b = 2; Print a / b * b + a % b
2. Integer x = 0; for (i = 1; i <= 10; i++) if (i % 3 == 0) x = x + i; Print x
3. Integer n = 10; while (n > 1) { if (n % 2 == 0) n = n / 2 else n = 3 * n + 1; Print n }
4. Print 5 ^ 3 + 1 (use C precedence)
5. Function f(Integer n) { if (n == 1) return 0; return 1 + f(n / 2) }. Print f(16)

**Answers:** 1) 2 × 2 + 1 = **5** (a / b * b + a % b always gives back a). 2) 3 + 6 + 9 = **18**. 3) **5 16 8 4 2 1**. 4) + runs before ^, so 5 ^ 4 = 101 ^ 100 = **1**. 5) it counts halvings: 16 → 8 → 4 → 2 → 1 gives **4**.`,
    sources: [TUTOR, WIKI_BIGO],
    remember: [
      "First pass: quick traces only; mark long recursions for the second pass",
      "Run the traps checklist: integer division, ^ is XOR, < vs <=, short-circuit, by value, x++ vs ++x, overflow",
      "Options that differ by one point at a loop boundary or increment",
      "Test a function with a tiny input to see what it computes",
    ],
    quick: {
      question: "With C precedence, what is 5 ^ 3 + 1?",
      options: ["1", "7", "126", "9"],
      answer: 0,
      explanation: "+ binds tighter than ^, so it's 5 ^ 4 = 101 ^ 100 = 001 = 1.",
    },
    questions: [
      { q: "Integer a = 5, b = 2. Print a / b * b + a % b", o: ["5", "4", "6", "5.5"], a: 0, e: "2 × 2 + 1 = 5. Integer division and modulus together give back a." },
      { q: "x = 0; for (i = 1; i <= 10; i++) if (i % 3 == 0) x = x + i. Print x", o: ["18", "30", "9", "12"], a: 0, e: "Only the multiples of 3 are added: 3 + 6 + 9 = 18." },
      { q: "Function f(n) { if (n == 1) return 0; return 1 + f(n / 2) }. Print f(16)", o: ["4", "16", "8", "5"], a: 0, e: "It counts halvings from 16 down to 1: four." },
      { q: "Two answer options differ by exactly one. What should you recheck first?", o: ["Loop boundaries (< versus <=)", "The variable names", "Comments in the code", "Nothing; pick either"], a: 0, e: "Off-by-one errors usually come from loop limits or increments." },
    ],
    visual: {
      plain: "Treat the section like a supermarket run with a list: grab everything you can reach quickly on the first lap, then go back for the items on the top shelf.",
      diagram: `flowchart LR
  S["Start the section"] --> P1["Pass 1: quick traces<br/>under a minute each"]
  P1 --> M["Mark long ones"]
  M --> P2["Pass 2: marked questions"]
  P2 --> C["Traps checklist<br/>before every answer"]`,
      caption: "Two passes plus a checklist beats tracing in order.",
    },
  },
];
