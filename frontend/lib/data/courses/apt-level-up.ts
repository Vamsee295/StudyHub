import { LEVEL_UP_2 } from "./apt-level-up-2";
// "Level up" sections for the newer aptitude lessons: harder, exam-style worked problems placed right before
// each lesson's practice set, taking a learner from the basics to test level. Original writing.

export const LEVEL_UP: Record<string, string> = {
  // ── Pseudocode ──
  "how-to-read-pseudocode": `## Level up: exam-style traces

**Problem 1.** Three variables that keep feeding each other:

~~~
Integer a = 3, b = 4, c = 5
a = b + c
b = a - b
c = a - b
a = a - c
Print a, b, c
~~~

a = 9, then b = 9 − 4 = 5, then c = 9 − 5 = 4, then a = 9 − 4 = 5. Output: **5 5 4**. Every line used the newest values, which is exactly why a table beats memory.

**Problem 2.** A line that looks pointless:

~~~
Integer x = 17
x = x / 5 * 5 + x % 5
Print x
~~~

17 / 5 = 3, × 5 = 15, plus 17 % 5 = 2 gives **17**. For positive Integers, (x / k) × k + x % k always rebuilds x. Spotting identities like this saves time.

**Problem 3.** Order matters:

~~~
Integer x = 2, y
y = x * 3
x = y - x
Print x * y
~~~

y = 6, then x = 6 − 2 = 4, so the output is **24**.`,

  "operators-and-precedence": `## Level up: exam-style expressions

**Problem 1.** 10 + 20 / 3 * 3. Division first: 20 / 3 = 6, then 6 × 3 = 18, then 10 + 18 = **28**. Anyone who cancels "/ 3 * 3" in their head writes 30 and loses the mark.

**Problem 2.** −17 / 5 and −17 % 5 in C-style Integers. Division truncates toward zero: **−3**. The remainder keeps the sign of the left side: **−2**. Check: 5 × (−3) + (−2) = −17.

**Problem 3.** Chained compound assignment:

~~~
Integer a = 2, b = 3
a += b *= 2
Print a, b
~~~

Assignments run right to left: b *= 2 makes b = 6, then a += 6 makes a = 8. Output: **8 6**.

**Problem 4.** A comparison chain: Print 7 > 3 > 1. It runs left to right: 7 > 3 is 1 (true), then 1 > 1 is 0. Output: **0**. Comparisons don't chain the way they do in maths.

**Problem 5.** Pre-decrement inside an expression:

~~~
Integer x = 4, y
y = --x * 2
Print x, y
~~~

x drops to 3 first, so y = 6. Output: **3 6**.`,

  "conditions-and-branches": `## Level up: exam-style branches

**Problem 1.** The dangling else:

~~~
Integer a = 5, b = 0
if (a > 3)
if (b > 0) Print "X"
else Print "Y"
~~~

The else belongs to the nearest if, the one testing b. a > 3 is true, b > 0 is false, so the output is **Y**. With a = 2 nothing prints at all, because the outer if fails and has no else of its own.

**Problem 2.** Increments inside a condition:

~~~
Integer x = 3, y = 4
if (x++ > 3 && y++ > 3) Print "in"
Print x, y
~~~

x++ > 3 compares the old value 3, which is false, and x becomes 4. The && stops there, so y++ never runs. Output: **4 4** (and "in" isn't printed).

**Problem 3.** Assignment in place of comparison:

~~~
Integer x = 7
if (x = 0) Print "A" else Print "B"
Print x
~~~

x = 0 stores 0 and the condition is 0, which is false. Output: **B**, then **0**: the variable itself changed.

**Problem 4.** Nested conditional expressions: with a = 4, b = 9, c = 7, Print (a > b) ? a : ((b > c) ? b : c). a > b is false, so evaluate the inner part: b > c is true, giving **9**.`,

  "loops-and-tracing": `## Level up: exam-style loops

**Problem 1.** break and continue together:

~~~
Integer s = 0
for (i = 1; i <= 20; i++)
    if (i % 5 == 0) break
    if (i % 2 == 0) continue
    s = s + i
Print s
~~~

i = 1 adds 1; i = 2 is skipped; i = 3 adds 3; i = 4 is skipped; at i = 5 the loop breaks. Output: **4**.

**Problem 2.** Counting digits with while:

~~~
Integer n = 90210, c = 0
while (n > 0)
    c = c + 1
    n = n / 10
Print c
~~~

Output **5**. Trap: for n = 0 the loop never runs and prints 0, although 0 has one digit. Questions sometimes test exactly this edge.

**Problem 3.** The update before the use:

~~~
Integer i = 0, c = 0
while (i < 10)
    i = i + 2
    c = c + i
Print c
~~~

i becomes 2, 4, 6, 8, 10 and each value is added: c = **30**. When i reaches 10 the check fails and the loop ends.

**Problem 4.** Palindrome check: reversing 12321 with r = r × 10 + n % 10 gives 12321 again, so the number is a palindrome. Comparing the reversed value with a saved copy of the original is the standard test.`,

  "nested-loops-and-counting": `## Level up: exam-style counting

**Problem 1.** A doubling loop inside a counting loop:

~~~
Integer c = 0
for (i = 1; i <= 8; i++)
    for (j = 1; j <= 8; j = j * 2)
        c = c + 1
Print c
~~~

The inner loop runs for j = 1, 2, 4, 8: four passes. Outer runs 8 times. Output: **32**.

**Problem 2.** break that depends on the outer variable:

~~~
for (i = 1; i <= 5; i++)
    for (j = 1; j <= 5; j++)
        if (j > i) break
        c = c + 1
~~~

For each i the inner loop counts j = 1 to i: 1 + 2 + 3 + 4 + 5 = **15**.

**Problem 3.** A condition on both variables: for i and j from 1 to 4, count pairs where (i + j) is even. Half of the 16 pairs have an even sum: **8**.

**Problem 4.** A while loop inside a for loop:

~~~
for (i = 1; i <= 3; i++)
    j = i
    while (j > 0)
        c = c + 1
        j = j - 1
~~~

The inner loop runs i times, so c = 1 + 2 + 3 = **6**.`,

  "functions-and-parameters": `## Level up: exam-style functions

**Problem 1.** The same call twice:

~~~
Function m(Integer x)
    x = x * 2
    return x + 1
End function
Integer a = 3
a = m(a) + m(a)
Print a
~~~

Both calls receive 3 (a only changes after the whole right side is computed), and each returns 7. Output: **14**.

**Problem 2.** A function that changes a global variable:

~~~
Integer g = 2
Function h()
    g = g * 3
    return g
End function
Integer r = h()
Print r, g
~~~

h writes to the global g (it didn't declare its own), so r = 6 and g = 6. Output: **6 6**.

**Problem 3.** By reference, the swap works:

~~~
Function sw(reference Integer a, reference Integer b)
    Integer t = a
    a = b
    b = t
End function
Integer x = 1, y = 2
sw(x, y)
Print x, y
~~~

Output: **2 1**. Compare this with the by-value version, where nothing changes.

**Problem 4.** An early return:

~~~
Function k(Integer n)
    if (n > 5) return 1
    n = n + 10
    return n
End function
Print k(7) + k(3)
~~~

k(7) returns 1 at the first line; k(3) returns 13. Output: **14**.`,

  "recursion-tracing": `## Level up: exam-style recursion

**Problem 1.** Two kinds of recursive step:

~~~
Function f(Integer n)
    if (n == 0) return 0
    if (n % 2 == 0) return f(n / 2) + 1
    return f(n - 1) + 1
End function
Print f(10)
~~~

10 → 5 → 4 → 2 → 1 → 0, adding 1 at every step: **5**. (It counts the steps to reach 0 by halving even numbers and subtracting 1 from odd ones.)

**Problem 2.** Printing on the way down and on the way up:

~~~
Function p(Integer n)
    if (n <= 0) return
    Print n
    p(n - 2)
    Print n
End function
p(4)
~~~

p(4) prints 4, calls p(2), which prints 2, calls p(0) (returns), prints 2 again, returns; then p(4) prints 4. Output: **4 2 2 4**. Code before the call runs going down; code after it runs coming back up.

**Problem 3.** Depth matters: a function f(n) that calls f(n − 1) until n = 0 makes n + 1 calls, all waiting on the stack at once. With extremely deep inputs a real program crashes with a stack overflow; some tests offer that as the correct option.

**Problem 4.** Recursion over an array: s(arr, n) = arr[n − 1] + s(arr, n − 1) with s(arr, 0) = 0 adds the first n elements, starting from the last.`,

  "arrays-and-strings": `## Level up: exam-style arrays

**Problem 1.** Rotate left by one:

~~~
Integer a[5] = {1, 2, 3, 4, 5}
Integer t = a[0]
for (i = 0; i < 4; i++) a[i] = a[i + 1]
a[4] = t
~~~

Result: **{2, 3, 4, 5, 1}**. Saving a[0] first is essential; without it the 1 would be lost.

**Problem 2.** Counting rises:

~~~
Integer a[5] = {2, 7, 3, 7, 5}, c = 0
for (i = 1; i < 5; i++)
    if (a[i] > a[i - 1]) c = c + 1
Print c
~~~

7 > 2 yes, 3 > 7 no, 7 > 3 yes, 5 > 7 no: **2**.

**Problem 3.** Diagonals of a 3 × 3 grid filled with 1 to 9 row by row:

~~~
1 2 3
4 5 6
7 8 9
~~~

Main diagonal (i == j): 1 + 5 + 9 = **15**. Anti-diagonal (i + j == 2): 3 + 5 + 7 = **15**.

**Problem 4.** Building a reversed string by putting each character in front: starting from "abcde", t becomes "a", "ba", "cba", "dcba", "edcba". Output: **edcba**.`,

  "bitwise-operations": `## Level up: exam-style bit tricks

**Problem 1.** Stripping factors of 2:

~~~
Integer n = 40
while ((n & 1) == 0) n = n >> 1
Print n
~~~

40 → 20 → 10 → 5, and 5 is odd. Output: **5**: the loop removes every factor of 2.

**Problem 2.** OR and AND-NOT: 13 or 7 = 1101 or 0111 = 1111 = **15**. 13 & ~7: ~7 clears the last three bits, so 1101 & ...1000 = 1000 = **8**.

**Problem 3.** Power-of-two test: 64 & 63 = 1000000 & 0111111 = 0, so 64 **is** a power of two. 96 & 95 = 1100000 & 1011111 = 1000000 = 64, not 0, so 96 **isn't**.

**Problem 4.** XOR swap traced with a = 5, b = 9:

~~~
a = a ^ b    // 0101 ^ 1001 = 1100 = 12
b = a ^ b    // 1100 ^ 1001 = 0101 = 5
a = a ^ b    // 1100 ^ 0101 = 1001 = 9
~~~

Output a = 9, b = 5. It works because XORing the same value twice cancels out.`,

  "data-types-and-overflow": `## Level up: exam-style type questions

**Problem 1.** Integer a = 2147483647; a = a + 1. Under the wrap-around that tests assume, a becomes **−2147483648**: the largest int rolls to the smallest.

**Problem 2.** Character arithmetic: char c = 'A' + 25 is 'Z' (65 + 25 = 90). Then c + 1 is 91, which is the character '[' and not a letter: alphabets don't wrap automatically.

**Problem 3.** Where the Float appears matters: Float f = 5 / 2 * 2.0. Left to right: 5 / 2 = 2 in Integers, then 2 × 2.0 = **4.0**. Writing 5 / 2.0 * 2 would give 5.0.

**Problem 4.** Storing a Float result in an Integer: Integer x = 10 / 4 + 10 % 4 * 1.5. 10 / 4 = 2, 10 % 4 = 2, 2 × 1.5 = 3.0, so the expression is 5.0, stored as **5**.

**Problem 5.** Unsigned subtraction below zero: unsigned int u = 3 − 5 wraps to 2³² − 2 = **4,294,967,294**. A loop counting down with an unsigned variable "while (u >= 0)" never ends, because an unsigned value is never negative.`,

  "recognising-algorithms": `## Level up: exam-style recognition

**Problem 1.** Insertion sort on {3, 1, 2}: 1 shifts past 3, then 2 shifts past 3. Shifts equal inversions: **2**, the same count bubble sort would swap.

**Problem 2.** Linear search on 50 items: worst case **50** comparisons (the key is last or missing); on average about (50 + 1) / 2 = 25.5 when the key is present and equally likely anywhere.

**Problem 3.** Name the code:

~~~
s = 0
for (i = 1; i <= n; i++)
    if (n % i == 0) s = s + i
if (s == 2 * n) Print "yes"
~~~

It adds every divisor of n, including n itself. s = 2n means the proper divisors add up to n: a **perfect number** test. For 6: 1 + 2 + 3 + 6 = 12 = 2 × 6, so it prints yes.

**Problem 4.** Trace binary search for 23 in {2, 5, 8, 12, 16, 23, 38, 56, 72, 91} (indexes 0 to 9):

| Step | low | high | mid | a[mid] | Action |
|---|---|---|---|---|---|
| 1 | 0 | 9 | 4 | 16 | 16 < 23, low = 5 |
| 2 | 5 | 9 | 7 | 56 | 56 > 23, high = 6 |
| 3 | 5 | 6 | 5 | 23 | found |

**3** comparisons. Note mid = (5 + 6) / 2 = 5 with Integer division.`,

  "pseudocode-exam-strategy": `## Level up: a timed set at test difficulty

Give yourself five minutes for all five.

1. Integer s = 0; for (i = 1; i <= 4; i++) for (j = i; j <= 4; j++) s = s + j; Print s
2. Function f(Integer n) { if (n < 2) return n; return f(n − 1) + f(n − 2) }. Print f(7)
3. Print (10 & 6) or (10 ^ 6), where "or" is the bitwise OR
4. unsigned char c = 0; for (i = 0; i < 300; i++) c = c + 1; Print c
5. Integer x = 5; if (x > 2 || x++ > 3) x = x * 2; Print x

**Answers:**

1. i = 1 adds 1 + 2 + 3 + 4 = 10; i = 2 adds 9; i = 3 adds 7; i = 4 adds 4. Total **30**
2. Fibonacci: 0, 1, 1, 2, 3, 5, 8, 13, so f(7) = **13**
3. 10 & 6 = 1010 & 0110 = 0010 = 2; 10 ^ 6 = 1100 = 12; 2 or 12 = 1110 = **14**
4. 300 increments on a one-byte counter: 300 mod 256 = **44**
5. x > 2 is true, so x++ is skipped; x = 10. Output **10**

Scoring 4 or 5 in five minutes means you're at test pace. Fewer? Redo the lessons behind the ones you missed, then try another timed set tomorrow.`,

  // ── Quantitative aptitude ──
  "simplification-and-approximation": `## Level up: exam-style problems

**Problem 1.** [(48 ÷ 6 + 2) × 5 − 20] ÷ 5. Innermost first: 48 ÷ 6 = 8, + 2 = 10, × 5 = 50, − 20 = 30, ÷ 5 = **6**.

**Problem 2.** 0.25 × 0.4 ÷ 0.05. 0.25 × 0.4 = 0.1, and 0.1 ÷ 0.05 = **2**. With decimals, counting decimal places is faster than long division: 0.1 ÷ 0.05 = 10 ÷ 5.

**Problem 3.** Mixed fractions: 2½ + 3⅓ − 1⅙. Convert to sixths: 15/6 + 20/6 − 7/6 = 28/6 = **4⅔**.

**Problem 4.** Approximation with a square and a root: 7.99² + √624.8 ≈ 8² + √625 = 64 + 25 = **89**.

**Problem 5.** A product near a power of 10: 999 × 999 = (1000 − 1)² = 1,000,000 − 2,000 + 1 = **998,001**.

**Problem 6.** Find the missing number: 35% of 420 + ? = 200. 35% of 420 = 147, so ? = **53**.

## A routine for speed

Spend ten minutes a day on twenty quick calculations from these patterns. Speed in simplification comes from recall, not cleverness: once squares, fractions and the multiplication tricks are automatic, every other aptitude topic gets faster too.`,

  "surds-indices-and-logarithms": `## Level up: exam-style problems

**Problem 1.** √50 + √18 − √8 = 5√2 + 3√2 − 2√2 = **6√2**. Always pull out the largest square factor first.

**Problem 2.** With log 5 = 0.6990, log 125 = log 5³ = 3 × 0.6990 = **2.097**.

**Problem 3.** (√7 + √3)(√7 − √3) = 7 − 3 = **4**: the conjugate pair always removes the roots.

**Problem 4.** Solve log_x 81 = 4. This means x⁴ = 81, so x = **3**.

**Problem 5.** Solve 5^(x − 2) = 1. Any non-zero number to the power 0 is 1, so x − 2 = 0 and x = **2**.

**Problem 6.** Which is larger, 2³⁰ or 3²⁰? Write both with exponent 10: 2³⁰ = (2³)¹⁰ = 8¹⁰ and 3²⁰ = (3²)¹⁰ = 9¹⁰. So **3²⁰** is larger. Matching the exponents (or the bases) is the standard comparison trick.

**Problem 7.** Simplify (27)^(2/3) × (16)^(−1/4). 27^(2/3) = 3² = 9 and 16^(−1/4) = 1/2, giving **4.5**.`,

  "problems-on-ages": `## Level up: exam-style problems

**Problem 1.** A father and son's ages add up to 60. Six years ago the father was five times as old as the son.

~~~
f + s = 60
f − 6 = 5(s − 6)  →  f = 5s − 24
5s − 24 + s = 60  →  s = 14, f = 46
~~~

Check: six years ago, 40 = 5 × 8.

**Problem 2.** Ten years ago A was half as old as B. Now their ages are in the ratio 3 : 4.

~~~
A = 3k, B = 4k
3k − 10 = (4k − 10) / 2  →  6k − 20 = 4k − 10  →  k = 5
~~~

A = **15**, B = **20**. Check: ten years ago 5 and 10.

**Problem 3.** Ratios at two different times. In 4 years A : B will be 5 : 4; 4 years ago it was 3 : 2. Let the ages in 4 years be 5k and 4k, so 4 years ago they were 5k − 8 and 4k − 8:

~~~
(5k − 8) / (4k − 8) = 3 / 2  →  10k − 16 = 12k − 24  →  k = 4
~~~

In 4 years they'll be 20 and 16, so now A = **16** and B = **12**. Check: 4 years ago 12 : 8 = 3 : 2.

**Problem 4.** A family of four has an average age of 25, and the youngest is 5. Five years ago the youngest wasn't born, and the other three had a total of 100 − 5 − 3 × 5 = 80, an average of about **26.7**. Remember to subtract the years from each person who existed then.`,

  "mixtures-and-alligation": `## Level up: exam-style problems

**Problem 1.** Two vessels hold milk and water in the ratios 3 : 1 and 5 : 3. Equal amounts are mixed. Milk fractions are 3/4 = 6/8 and 5/8; the average is 11/16. So milk : water = **11 : 5**.

**Problem 2.** A 30% and a 60% solution are mixed to get 50%. Alligation: (60 − 50) : (50 − 30) = 10 : 20, so 30% : 60% = **1 : 2**.

**Problem 3.** Alligation with profit. Sugar at ₹30 and ₹40 per kg is mixed and sold at ₹42 for a 20% profit. Cost price of the mixture = 42 / 1.2 = ₹35, so the ratio is (40 − 35) : (35 − 30) = **1 : 1**. Convert the selling price to cost price before alligating.

**Problem 4.** Working backwards from replacement. 64 litres of milk; x litres are replaced with water twice, leaving 49 litres of milk:

~~~
64 × (1 − x/64)² = 49  →  (1 − x/64)² = 49/64  →  1 − x/64 = 7/8  →  x = 8
~~~

**Problem 5.** Mixing three items: tea at ₹20, ₹30 and ₹45 is mixed to make ₹35. Pair each cheaper item with the dearer one: 20 with 45 and 30 with 45. Each pairing gives a valid ratio, so these questions usually have several answers; pick the option that matches one of them.`,

  "partnership": `## Level up: exam-style problems

**Problem 1.** Three partners. A invests ₹5,000 for 12 months, B ₹7,000 for 8 months and C ₹8,000 for 6 months. Profit ₹8,200.

~~~
A : B : C = 60,000 : 56,000 : 48,000 = 15 : 14 : 12
41 parts = 8,200, so one part = 200
A = 3,000, B = 2,800, C = 2,400
~~~

**Problem 2.** Partners joining in turn. A starts with ₹30,000; B joins after 4 months with ₹40,000; C joins after 6 months with ₹60,000. Year's profit ₹52,000.

~~~
A = 30,000 × 12 = 3,60,000
B = 40,000 × 8  = 3,20,000
C = 60,000 × 6  = 3,60,000
ratio 9 : 8 : 9, 26 parts = 52,000, one part = 2,000
A = 18,000, B = 16,000, C = 18,000
~~~

**Problem 3.** Finding the time ratio. Capitals are in the ratio 3 : 4 and profits 9 : 16. Since profit = capital × time, time = profit / capital: (9/3) : (16/4) = **3 : 4**. If A invested for 6 months, B invested for 8.

**Problem 4.** A working partner. A manages the business and takes 20% of the profit first; the rest is shared in the capital ratio A : B = 1 : 2. Profit ₹30,000: A takes 6,000, the remaining 24,000 splits 8,000 : 16,000. A gets **₹14,000**, B **₹16,000**.

**Problem 5.** A partner who leaves. A, B and C start equal; C leaves after 6 months. Shares are 12 : 12 : 6 = 2 : 2 : 1, because C's money worked for half the year.

## Quick reference

| Situation | What to multiply |
|---|---|
| everyone invests for the whole period | capitals only |
| a partner joins after m months of 12 | capital × (12 − m) |
| a partner leaves after m months | capital × m |
| capital changes mid-year | add capital × months for each period |
| a manager's salary or commission | take it out first, then share the rest |
| profit and capital ratios known | time ratio = profit ratio ÷ capital ratio |

Most questions mix two or three of these rows. Write each partner's capital × months on its own line before simplifying the ratio, and check that the shares add up to the total profit.`,

  "remainders-and-unit-digits": `## Level up: exam-style problems

**Problem 1.** Unit digit of 2²⁰²⁴ + 3²⁰²⁴. 2024 mod 4 = 0, so each takes the last value of its cycle: 6 and 1. Sum's unit digit: **7**.

**Problem 2.** Remainder of 5¹⁰⁰ ÷ 6. 5 leaves −1 when divided by 6, so 5¹⁰⁰ leaves (−1)¹⁰⁰ = **1**.

**Problem 3.** Remainder of 1,234,567 ÷ 9. A number leaves the same remainder as its digit sum when divided by 9: 1 + 2 + 3 + 4 + 5 + 6 + 7 = 28, and 28 leaves **1**.

**Problem 4.** Remainder of 2¹⁰⁰ ÷ 101. 101 is prime, so by Fermat 2¹⁰⁰ leaves **1**.

**Problem 5.** Unit digit of 1! + 2! + … + 50!. From 5! onwards every factorial ends in 0, so only 1 + 2 + 6 + 24 = 33 counts: **3**.

**Problem 6.** Trailing zeros of 50!. Each zero needs a factor 10 = 2 × 5, and 5s are scarcer: 50/5 + 50/25 = 10 + 2 = **12**.

**Problem 7.** Unit digit of 7²⁷ × 3⁴¹ × 9¹⁹. 7²⁷: 27 mod 4 = 3 → 3. 3⁴¹: 41 mod 4 = 1 → 3. 9¹⁹: odd power → 9. Product of unit digits 3 × 3 × 9 = 81: **1**.`,

  // ── Logical reasoning ──
  "puzzles": `## Level up: a scheduling puzzle

Five lectures P, Q, R, S and T are held from Monday to Friday, one per day.
- R is on Wednesday
- P is on the day immediately after Q
- S is on neither Monday nor Friday
- T is on a day before R

**Frame:** Mon, Tue, Wed, Thu, Fri. Place R on Wednesday.

**Cases for Q and P** (consecutive, Q first): Mon–Tue or Thu–Fri (Tue–Wed and Wed–Thu would clash with R).

- Case 1, Q = Mon and P = Tue: T must be before Wednesday, but Monday and Tuesday are taken. **Contradiction.**
- Case 2, Q = Thu and P = Fri: S can't be Monday or Friday and Thursday is taken, so S = Tue. T takes the only day left, Monday, which is before Wednesday as required.

| Mon | Tue | Wed | Thu | Fri |
|---|---|---|---|---|
| T | S | R | Q | P |

Questions now take seconds: the lecture on Tuesday is **S**; two lectures (S and R) fall between T and Q.

**What made it fast:** the anchored clue (R on Wednesday) cut the cases for the pair clue to two, and one of those broke immediately. Look for the clue that limits the most other clues and use it first.`,

  "cubes-and-dice": `## Level up: exam-style problems

**Problem 1.** A 4 × 4 × 4 cube is painted only on its top and bottom faces, then cut into 64 unit cubes. The top layer and bottom layer have paint: 2 × 16 = **32** painted; **32** unpainted.

**Problem 2.** A 6 × 6 × 6 painted cube: cubes with exactly two painted faces = 12 × (6 − 2) = **48**.

**Problem 3.** A painted cube cut into 27: cubes with at least one painted face = 27 − (3 − 2)³ = **26**. "At least one" is easiest as total minus none.

**Problem 4.** A painted cuboid 4 × 3 × 2 cut into 24 unit cubes. Unpainted = (4 − 2)(3 − 2)(2 − 2) = **0**: with a dimension of 2, every cube touches the outside. Corners still number 8.

**Problem 5.** A standard die shows 4 on top. What's at the bottom? Opposite faces add to 7: **3**.

**Problem 6.** Three views of one die show (1, 2, 3), (1, 3, 5) and (1, 5, 4) on visible faces. 1 appears with 2, 3, 4 and 5, so **6** is opposite 1. Then 3 has been seen with 1, 2 and 5, so 3's opposite is 4 or 6; 6 is taken by 1, so **4** is opposite 3, leaving 2 opposite 5.`,

  "venn-diagrams": `## Level up: exam-style problems

**Problem 1.** In a survey of 200 people, 120 read Hindi papers, 90 read English papers and 30 read neither. How many read both?

~~~
read at least one = 200 − 30 = 170
both = 120 + 90 − 170 = 40
~~~

**Problem 2.** "Exactly" questions with three sets. Using the regions from the worked example (only A 28, only B 20, only C 13, A∩B only 10, B∩C only 5, A∩C only 7, all three 5):
- exactly one = 28 + 20 + 13 = **61**
- exactly two = 10 + 5 + 7 = **22**
- all three = **5**, and 61 + 22 + 5 = 88 matches the union

**Problem 3.** Smallest and largest overlap. 70% of people like tea and 60% like coffee. The overlap is at least 70 + 60 − 100 = **30%** (everyone likes something), and at most **60%** (the smaller group entirely inside the larger).

**Problem 4.** Classification. Engineers, Indians and women: some engineers are Indian, some Indians are women, some women are engineers, and some people are all three. The right picture is **three mutually overlapping circles**.

**Problem 5.** Classification with inclusion. Vegetables, potatoes and tomatoes: potatoes are vegetables, while tomatoes are botanically fruits, though often eaten as vegetables. Tests take the everyday sense unless told otherwise, so pick **two separate circles inside one bigger circle**, and read the options for hints about which sense is intended.`,

  "inequalities": `## Level up: coded inequalities

Some tests replace the symbols with codes. Suppose:

| Code | Means |
|---|---|
| P @ Q | P > Q |
| P # Q | P < Q |
| P $ Q | P = Q |
| P % Q | P ≥ Q |
| P & Q | P ≤ Q |

**Problem 1.** Statements: A % B, B @ C, C $ D. Decode: A ≥ B > C = D. Conclusions: I. A @ D (A > D): ≥, > and = point the same way with one strict sign, so **true**. II. B % D (B ≥ D): B > D, which makes B ≥ D **true** too. **Both follow.**

**Problem 2.** Statements: M & N, N $ O, O # P. Decode: M ≤ N = O < P. I. M # P (M < P): same direction with a strict sign, **true**. II. P @ N (P > N): N = O < P, so **true**. **Both follow.**

**Problem 3.** Statements: K & L, L $ M. Decode: K ≤ L = M, so K ≤ M. I. K # M (K < M), II. K $ M (K = M). Neither is certain alone, but together they cover K ≤ M: **either I or II**.

**Problem 4.** Statements: X % Y, Z @ Y. Decode: X ≥ Y < Z. Between X and Z the signs point opposite ways: **no relation**, so a conclusion like X @ Z doesn't follow.

Decode every statement into ordinary symbols on paper before reading the conclusions. Most errors in coded questions come from decoding, not from the logic.`,

  "input-output": `## Level up: two moves per step

Harder machines move a word and a number in the same step.

**Input:** 42 pen 17 cap 89 ant

**Rule:** in each step, the alphabetically first remaining word moves to the left end (after any words already placed), and the largest remaining number moves to the right end (before any numbers already placed).

~~~
Input:   42 pen 17 cap 89 ant
Step 1:  ant 42 pen 17 cap 89
Step 2:  ant cap pen 17 42 89
~~~

Step 1 moves "ant" to the front; 89 is already at the right end. Step 2 moves "cap" next to "ant" and 42 next to 89, which leaves "pen" and 17 in their final places. The arrangement is final after **2 steps**: words in alphabetical order on the left, numbers in ascending order on the right.

**Questions you can now answer:**
- What is the third element from the left in step 2? **pen**
- Which element is exactly between "cap" and "42" in step 2? Between them sit pen and 17, so ask carefully whether the question wants one element or the count (**2**)

**How to spot a two-move rule:** if step 1 changed both ends of the line, look for one rule for words and one for numbers. Write each step under the previous one so the moving elements stand out.`,

  "statements-and-assumptions": `## Level up: inferences and stronger arguments

**Inference questions** give a passage and ask whether a statement is definitely true, probably true, data inadequate, probably false or definitely false.

Passage: "City X's metro carried 2 lakh riders a day by the end of its first month, up from 1.2 lakh in its opening week. Several new stations open next quarter."

| Statement | Verdict | Why |
|---|---|---|
| Ridership rose during the first month | Definitely true | stated directly |
| More stations will open soon | Definitely true | stated directly |
| Ridership will rise further next quarter | Probably true | likely with new stations, but not stated |
| The metro is profitable | Data inadequate | nothing about money |
| Ridership fell during the first month | Definitely false | contradicts the passage |

**Assumption with a trap word.** Statement: "Hire our tutors to clear the exam." Assumption: "Only students with tutors clear the exam." The word **only** goes beyond what the advert needs, so it isn't implicit. "Tutors can help students clear the exam" is.

**Strengthening with data.** Argument: "Our new canteen menu made students healthier, because clinic visits fell this term." Strong strengtheners rule out other causes: "Clinic visits stayed the same at a nearby college with the old menu." It shows the drop wasn't a general trend.

**Cause and effect pair.** A: "Fuel prices rose sharply." B: "Bus fares were increased." A is the likely **cause** of B. If both had been effects of something else (a new tax on transport, say), the answer would be "both are effects of a common cause".`,

  // ── Verbal ability ──
  "articles-and-prepositions": `## Level up: error spotting at test level

Find and correct the error in each sentence.

1. "He gave me an advice about the interview."
2. "I will meet you in Monday at the station."
3. "The gold is a precious metal."
4. "She is good in mathematics but poor at history."
5. "He has been living here since five years."
6. "We reached the airport on time to catch the flight."

**Answers:**

1. Advice is uncountable: "**some advice**" or "**a piece of advice**"
2. Days take on: "**on Monday**"
3. Gold in general takes no article: "**Gold** is a precious metal"
4. "**good at** mathematics" (and "poor at" is already correct)
5. since needs a point in time; a length of time needs for: "**for five years**"
6. "**in time** to catch the flight": in time means early enough for something; on time means at the scheduled time

## Tricky pairs worth a second look

| Pair | Difference |
|---|---|
| in time / on time | early enough / punctual |
| beside / besides | next to / in addition to |
| between / among | two things / more than two |
| in the end / at the end | finally / at the final point of something |
| agree with / agree to | a person or opinion / a proposal |`,

  "active-passive-voice": `## Level up: tricky conversions

**Intransitive verbs have no passive.** "He slept for ten hours" has no object, so it can't be made passive. An option that tries ("Ten hours were slept by him") is wrong.

**Let sentences:** "Let him do the work" → "**Let the work be done by him.**"

**Infinitive phrases:** "It is time to start the work" → "**It is time for the work to be started.**"

**Modal perfect:** "You should have told me" → "**I should have been told by you.**" Modal + have been + past participle.

**Reporting verbs (say, believe, think, know):** "People say that he is rich" has two passives: "**It is said that he is rich**" and "**He is said to be rich.**"

**Phrasal verbs keep their particle:** "They called off the match" → "**The match was called off.**" Dropping "off" changes the meaning.

**Negative questions:** "Didn't they invite you?" → "**Weren't you invited by them?**"

## Test-style practice

1. "Someone has stolen my bag."
2. "Do not disturb the patient."
3. "They believe that the bridge is safe."

**Answers:** 1) "My bag **has been stolen**" (by someone is dropped, the doer is unknown). 2) "**Let the patient not be disturbed**" or "You are requested not to disturb the patient." 3) "**It is believed** that the bridge is safe" or "The bridge **is believed to be** safe."`,

  "direct-indirect-speech": `## Level up: tricky conversions

**Perfect continuous:** He said, "I have been working since morning" → He said that he **had been working** since morning.

**Suggestions with let's:** She said, "Let's go out" → She **suggested that they should go out** (or "suggested going out").

**Wishes and prayers:** He said, "May God bless you" → He **prayed that God might bless** me.

**Said to + question:** "said to me" becomes **asked me** for questions, **told me** for statements, and **ordered / requested / advised me** for commands, depending on the tone.

**Mixed sentences:** She said, "I'm tired. Can we stop here?" → She said that she was tired **and asked if they could stop there**. Each part gets its own reporting verb.

**Must:** "You must submit it today" → he said that I **had to** submit it that day (an obligation), but "must" stays for a deduction: "He must be home" → she said he **must** be home.

## Test-style practice

1. The teacher said, "Don't talk in class, boys."
2. He said to her, "Will you marry me?"
3. Ravi said, "I saw this film yesterday."

**Answers:** 1) The teacher **told the boys not to talk** in class. 2) He **asked her if she would** marry him. 3) Ravi said that he **had seen that film the previous day**.`,

  "idioms-and-phrases": `## Level up: ten more for test day

| Idiom | Meaning |
|---|---|
| smell a rat | suspect that something is wrong |
| throw in the towel | give up |
| sit on the fence | avoid taking sides |
| a wild goose chase | a hopeless search |
| steal someone's thunder | take the credit someone else expected |
| take with a pinch of salt | doubt that something is fully true |
| go the extra mile | make more effort than expected |
| the last straw | the final problem that makes something unbearable |
| face the music | accept the consequences of your actions |
| rest on one's laurels | stop trying because of past success |

## Test-style practice

1. "After failing three times, he refused to **throw in the towel**."
2. "The minister chose to **sit on the fence** during the debate."
3. "Take his promises **with a pinch of salt**."

**Answers:** 1) **give up**. 2) **avoid taking sides**. 3) **doubt them**.`,

  "cloze-test": `## Level up: a second passage at test level

> Many students believe that intelligence is fixed. Research, (1) ___, suggests that the brain grows stronger with effort. Students who (2) ___ this tend to persist longer when problems get hard. (3) ___ they see mistakes as information, they (4) ___ more from them. Teachers can encourage this mindset by praising effort (5) ___ than talent.

Options:
1. (a) therefore (b) however (c) moreover (d) because
2. (a) understands (b) understanding (c) understand (d) understood by
3. (a) Although (b) Unless (c) Because (d) Despite
4. (a) learn (b) learns (c) learning (d) have learn
5. (a) more (b) rather (c) other (d) better

**Answers and reasons:**
1. **however**: the research contradicts the common belief
2. **understand**: the subject "students who" is plural, present tense
3. **Because**: seeing mistakes as information is the reason they learn more
4. **learn**: plural subject "they", present tense
5. **rather**: the fixed phrase is "rather than"

Notice how blank 1 needed the sentence before it, and blank 3 needed the clause after it. That's why reading the whole passage first pays off.`,
};

/** Insert a lesson's level-up section right before its practice set (or at the end). */
export function withLevelUp(slug: string, theory: string): string {
  const extra = LEVEL_UP[slug] ?? LEVEL_UP_2[slug];
  if (!extra) return theory;
  const at = theory.search(/\n## (Mixed )?[Pp]ractice/);
  return at < 0 ? `${theory}\n\n${extra}` : `${theory.slice(0, at)}\n\n${extra}\n${theory.slice(at)}`;
}
