// Long-form theory for Quantitative Aptitude: number fundamentals and arithmetic. Original writing.
import { LessonTheory } from './utils';

const OPENSTAX_PREALG = { title: "OpenStax: Prealgebra 2e (free textbook)", url: "https://openstax.org/details/books/prealgebra-2e" };
const KHAN_ARITH = { title: "Khan Academy: Arithmetic", url: "https://www.khanacademy.org/math/arithmetic" };
const KHAN_PREALG = { title: "Khan Academy: Pre-algebra", url: "https://www.khanacademy.org/math/pre-algebra" };
const WIKI_DIVISIBILITY = { title: "Wikipedia: Divisibility rule", url: "https://en.wikipedia.org/wiki/Divisibility_rule" };
const WIKI_EUCLID = { title: "Wikipedia: Euclidean algorithm", url: "https://en.wikipedia.org/wiki/Euclidean_algorithm" };
const WIKI_NUMBER = { title: "Wikipedia: Number", url: "https://en.wikipedia.org/wiki/Number" };
const OPENSTAX_BUSINESS = { title: "OpenStax: Contemporary Mathematics (free textbook, money and finance chapters)", url: "https://openstax.org/details/books/contemporary-mathematics" };
const WIKI_COMPOUND = { title: "Wikipedia: Compound interest", url: "https://en.wikipedia.org/wiki/Compound_interest" };
const OPENSTAX_STATS = { title: "OpenStax: Introductory Statistics 2e (free textbook)", url: "https://openstax.org/details/books/introductory-statistics-2e" };

export const aptQuantNumbersTheory: Record<string, LessonTheory> = {
  "number-system": {
    theory: `The number system is the foundation of every quantitative aptitude topic. Percentages, ratios, time and work, and probability all reduce to operations on numbers, and placement tests reward candidates who can manipulate numbers quickly and spot their properties at a glance. This lesson covers the place-value system, the classification of numbers, unit digits, remainders, and the number facts worth memorizing for speed.

## Place value

Our decimal system is **positional**: a digit's value depends on its place. In 4,725, the 4 means 4 × 1000, the 7 means 7 × 100, the 2 means 2 × 10 and the 5 means 5 × 1. Two terms appear in tests:

- **face value**: the digit itself (the face value of 7 in 4,725 is 7)
- **place value**: the digit times its position's power of ten (the place value of 7 in 4,725 is 700)

The Indian system groups digits as thousands, lakhs and crores (1,00,00,000 is one crore), while the international system groups by threes (10,000,000 is ten million). Questions sometimes switch between them: 1 lakh = 100 thousand, 1 crore = 10 million.

## Classification of numbers

| Set | Members | Example |
|---|---|---|
| Natural numbers | 1, 2, 3, ... | 7 |
| Whole numbers | 0, 1, 2, 3, ... | 0 |
| Integers | ..., -2, -1, 0, 1, 2, ... | -15 |
| Rational numbers | p/q with integers p, q and q ≠ 0 | 3/4, -2, 0.333... |
| Irrational numbers | Not expressible as p/q | √2, π |
| Real numbers | Rational and irrational together | All of the above |

Every terminating or repeating decimal is rational; non-terminating, non-repeating decimals are irrational. The next lesson covers primes, composites, even and odd numbers in detail.

## Converting repeating decimals

A pure repeating decimal 0.ababab... equals ab/99; 0.aaa... equals a/9:

- 0.777... = 7/9
- 0.454545... = 45/99 = 5/11

For mixed decimals such as 0.1666..., subtract the non-repeating part: 0.1666... = (16 − 1)/90 = 15/90 = 1/6.

## Unit digits

Many questions ask for the last digit of a large power. Unit digits of powers repeat in cycles of at most four:

| Base ends in | Cycle of unit digits | Cycle length |
|---|---|---|
| 0, 1, 5, 6 | Always 0, 1, 5, 6 respectively | 1 |
| 4 | 4, 6 | 2 |
| 9 | 9, 1 | 2 |
| 2 | 2, 4, 8, 6 | 4 |
| 3 | 3, 9, 7, 1 | 4 |
| 7 | 7, 9, 3, 1 | 4 |
| 8 | 8, 4, 2, 6 | 4 |

Method: divide the exponent by the cycle length and use the remainder (a remainder of 0 means the last position in the cycle).

~~~
Unit digit of 7^83:
83 ÷ 4 leaves remainder 3 → third term of (7, 9, 3, 1) → 3
~~~

For products, multiply only the unit digits: the unit digit of 23 × 47 × 89 is the unit digit of 3 × 7 × 9 = 189, which is 9.

## Remainders

When a number N is divided by d, N = d × q + r, where 0 ≤ r < d. Useful properties:

- the remainder of a sum equals the remainder of the sum of remainders
- the remainder of a product equals the remainder of the product of remainders

~~~
Remainder of (47 × 53) ÷ 5:
47 leaves 2, 53 leaves 3 → 2 × 3 = 6 → 6 leaves 1. Answer: 1
~~~

A number leaving remainder r when divided by d can be written as dk + r, which turns many word problems into algebra.

## Counting numbers in a range

- multiples of k from 1 to N: ⌊N / k⌋
- integers from a to b inclusive: b − a + 1
- multiples of k between a and b: ⌊b/k⌋ − ⌊(a − 1)/k⌋

~~~
Multiples of 7 between 100 and 300:
⌊300/7⌋ − ⌊99/7⌋ = 42 − 14 = 28
~~~

Forgetting the "+1" when counting inclusive ranges is among the most common errors in aptitude tests.

## Facts worth memorizing

- squares up to 30 and cubes up to 15
- fraction to percentage equivalents: 1/8 = 12.5%, 1/6 = 16.67%, 1/12 = 8.33%
- primes up to 100 (there are 25)
- the sum of the first n natural numbers is n(n + 1)/2; of the first n odd numbers, n²

## Approach for test conditions

1. read what's asked: unit digit, remainder, count or value
2. look for a property that avoids full calculation, such as cyclicity or divisibility
3. use the answer options: eliminating impossible options often finishes the question

## How interviewers test this

Placement tests ask for unit digits of large powers, remainders of products, conversions of repeating decimals, and counts of multiples in a range. Know the cyclicity table, the remainder rules, the floor-division counting formula and the inclusive-range "+1", and check every answer against the options before moving on.`,
    sources: [OPENSTAX_PREALG, WIKI_NUMBER],
  },

  "types-of-numbers": {
    theory: `Classifying numbers quickly is a constant background skill in aptitude: is it prime, even, a perfect square, co-prime with another number? Most "trick" questions hinge on one of these properties. This lesson covers even and odd numbers, primes and composites, co-primes, perfect squares and cubes, and the properties of each that let you answer without heavy calculation.

## Even and odd numbers

An **even** number is divisible by 2; an **odd** number isn't. Rules for combining them:

| Operation | Result |
|---|---|
| Even ± Even | Even |
| Odd ± Odd | Even |
| Even ± Odd | Odd |
| Even × anything | Even |
| Odd × Odd | Odd |

These parity rules settle many questions instantly. For example, the sum of five odd numbers is odd, so it can't equal 100.

## Prime numbers

A **prime** has exactly two distinct factors: 1 and itself. 2 is the only even prime. 1 is neither prime nor composite, a classic trap.

Primes below 100: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97 (25 primes).

**Testing whether n is prime**: check divisibility by primes up to √n. To test 221, check primes up to 14 (since 15² = 225): 221 = 13 × 17, so it's composite. To test 211, check 2, 3, 5, 7, 11 and 13; none divide it, so 211 is prime.

Every prime greater than 3 has the form 6k ± 1, which helps eliminate candidates, though not every number of that form is prime (25 = 6 × 4 + 1).

## Composite numbers

A **composite** number has more than two factors. Every composite number has a unique **prime factorization**:

~~~
360 = 2³ × 3² × 5
~~~

Prime factorization unlocks factor counts, HCF, LCM and perfect-square tests, so it's worth practising until it's fast.

## Co-prime numbers

Two numbers are **co-prime** when their HCF is 1, even if neither is prime: 8 and 15 are co-prime. Facts:

- any two consecutive integers are co-prime
- any two distinct primes are co-prime
- if a number is divisible by two co-prime numbers, it's divisible by their product: divisible by 3 and 4 means divisible by 12. This doesn't hold for non-co-primes: divisible by 4 and 6 doesn't guarantee divisible by 24

## Perfect squares

A perfect square is an integer squared. Properties that help eliminate options:

- a perfect square never ends in 2, 3, 7 or 8
- it ends in an even number of zeros
- in its prime factorization, every exponent is even
- it has an **odd** number of factors (factors pair up, except the square root)

~~~
Smallest number to multiply 72 by to make a perfect square:
72 = 2³ × 3² → the exponent of 2 is odd → multiply by 2 → 144 = 12²
~~~

## Perfect cubes

In a perfect cube's prime factorization, every exponent is a multiple of 3. Cubes of 1 to 10 end in distinct digits (1, 8, 7, 4, 5, 6, 3, 2, 9, 0), so the unit digit of a perfect cube identifies the unit digit of its cube root. That allows quick cube roots of perfect cubes up to six digits: for 175,616, the last three digits 616 end in 6, so the root ends in 6; the remaining 175 lies between 5³ = 125 and 6³ = 216, so the root is 56.

## Other named types

- **rational and irrational**: covered in the number system lesson
- **twin primes**: primes differing by 2, such as 11 and 13
- **perfect numbers**: equal to the sum of their proper divisors, such as 6 = 1 + 2 + 3 and 28
- **factorials**: n! = n × (n − 1) × ... × 1; trailing zeros in n! equal ⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋ + ...

~~~
Trailing zeros in 100!:
⌊100/5⌋ + ⌊100/25⌋ = 20 + 4 = 24
~~~

Each trailing zero needs a factor of 10 = 2 × 5, and fives are scarcer than twos, so counting fives gives the answer.

## Using properties in multiple-choice questions

Options can often be eliminated by property alone. If a question asks for a perfect square and the options are 1,522, 1,764, 1,833 and 1,927, only 1,764 can be a square (the others end in 2, 3 and 7). It equals 42².

## How interviewers test this

Expect "is n prime?", parity reasoning, co-prime divisibility tests, the smallest multiplier for a perfect square, trailing zeros in factorials and quick cube roots. Know the primes to 100, the √n test, the even-exponent rule for squares and the count-of-fives method for trailing zeros.`,
    sources: [OPENSTAX_PREALG, KHAN_PREALG],
  },

  "divisibility-rules": {
    theory: `Divisibility rules let you decide whether one number divides another without performing the division. In timed aptitude tests, they speed up simplifying fractions, finding factors, checking answer options and solving "find the missing digit" questions. This lesson covers the rules for 2 through 13, how to combine rules for composite divisors, and the classic question types built on them.

## The core rules

| Divisor | Rule | Example |
|---|---|---|
| 2 | Last digit is even | 3,458 |
| 3 | Sum of digits divisible by 3 | 4,173 (sum 15) |
| 4 | Last two digits divisible by 4 | 7,316 (16) |
| 5 | Last digit is 0 or 5 | 9,875 |
| 6 | Divisible by both 2 and 3 | 5,412 |
| 8 | Last three digits divisible by 8 | 12,104 (104) |
| 9 | Sum of digits divisible by 9 | 6,543 (sum 18) |
| 10 | Last digit is 0 | 7,890 |
| 11 | Alternating sum of digits divisible by 11 | 9,284 |
| 25 | Last two digits 00, 25, 50 or 75 | 3,475 |

## Why the rules work

Powers of 10 behave predictably for each divisor:

- 10, 100, 1000 all leave remainder 1 when divided by 3 or 9, so a number leaves the same remainder as its digit sum
- 100 is divisible by 4 and 1000 by 8, so only the last two or three digits matter
- 10 leaves remainder −1 with 11, so digits alternate in sign

Knowing why helps you remember and adapt the rules.

## The rule for 11 in detail

Subtract the sum of digits in even positions from the sum in odd positions (counting from the right). If the difference is 0 or a multiple of 11, the number is divisible by 11.

~~~
Is 918,082 divisible by 11?
Digits from the right: 2, 8, 0, 8, 1, 9
Odd positions: 2 + 0 + 1 = 3
Even positions: 8 + 8 + 9 = 25
Difference: 25 − 3 = 22 → divisible by 11
~~~

## Rules for 7 and 13

These are less convenient:

- **7**: double the last digit and subtract it from the rest; repeat. 343 → 34 − 6 = 28, divisible by 7
- **7, 11, 13 together**: 1001 = 7 × 11 × 13. Split the number into groups of three digits from the right and take the alternating sum; if the result is divisible by 7, 11 or 13, so is the number

~~~
Is 3,546,861 divisible by 7?
Groups: 3 | 546 | 861 → 861 − 546 + 3 = 318
318 = 7 × 45 + 3 → not divisible by 7
~~~

In practice, direct division is often as fast for 7 with small numbers.

## Composite divisors

To test divisibility by a composite number, split it into **co-prime** factors and test each:

- 12 = 3 × 4
- 15 = 3 × 5
- 18 = 2 × 9
- 24 = 3 × 8
- 36 = 4 × 9
- 72 = 8 × 9

The factors must be co-prime. Testing 24 with 4 and 6 fails: 12 is divisible by both 4 and 6 but not by 24.

## Finding missing digits

A common question type:

~~~
If 64k8 is divisible by 9, find k.
Digit sum: 6 + 4 + k + 8 = 18 + k
For divisibility by 9: 18 + k ∈ {18, 27} → k = 0 or 9
~~~

When two answers fit, the options decide. With two conditions (for example divisible by 72, needing both 8 and 9), apply the more restrictive rule first: last three digits for 8, then the digit sum for 9.

~~~
Find the digit k so that 5k28 is divisible by 72.
Divisible by 8: last three digits k28 must be divisible by 8 → 128, 328, 528, 728, 928 work (k odd).
Divisible by 9: 5 + k + 2 + 8 = 15 + k must be 18 → k = 3, which is odd. ✓
Answer: k = 3, and 5,328 = 72 × 74
~~~

If no digit satisfies both rules, the answer is an option such as "none of these", or you've misread the question, so check carefully.

## Remainders using the rules

The rules for 3 and 9 also give remainders: a number leaves the same remainder as its digit sum. 7,654 has digit sum 22, which leaves remainder 4 when divided by 9, so 7,654 leaves remainder 4 too. For 4 and 8, the remainder equals that of the last two or three digits.

## Speed tips

- learn the multiples of 4 up to 100 and of 8 up to 1000 well enough to judge quickly
- when simplifying fractions, test 2, 3, 5 and 11 first; they're the fastest
- use rules to eliminate options before doing any arithmetic

## How interviewers test this

Expect missing-digit questions, checks against composite divisors such as 72 or 88, remainder questions using digit sums, and option elimination. Know the table, the rule for 11, the co-prime splitting method, and remember that both rules must hold for a composite divisor.`,
    sources: [WIKI_DIVISIBILITY, KHAN_ARITH],
  },

  "factors-multiples": {
    theory: `Factors and multiples describe how numbers divide one another. A **factor** of n divides n exactly; a **multiple** of n is n times an integer. These ideas underlie HCF and LCM, fraction simplification, scheduling problems and counting questions. This lesson covers finding factors efficiently, counting factors with prime factorization, the sum and product of factors, and multiples in ranges.

## Definitions

- 6 is a **factor** (divisor) of 18 because 18 ÷ 6 = 3 exactly
- 18 is a **multiple** of 6
- every number has 1 and itself as factors
- every number has infinitely many multiples

## Finding all factors

Factors come in pairs that multiply to n, so you only need to check up to √n:

~~~
Factors of 84 (√84 ≈ 9.2):
1 × 84, 2 × 42, 3 × 28, 4 × 21, 6 × 14, 7 × 12
Factors: 1, 2, 3, 4, 6, 7, 12, 14, 21, 28, 42, 84 (12 factors)
~~~

If n is a perfect square, its square root pairs with itself, giving an odd number of factors.

## Counting factors with prime factorization

If n = p^a × q^b × r^c (p, q, r prime), the number of factors is:

~~~
(a + 1)(b + 1)(c + 1)
~~~

Each factor picks an exponent of p from 0 to a, of q from 0 to b, and so on.

~~~
360 = 2³ × 3² × 5¹
Number of factors = (3 + 1)(2 + 1)(1 + 1) = 4 × 3 × 2 = 24
~~~

This formula answers many questions in seconds that would otherwise require listing.

## Even, odd and other restricted factors

- **odd factors**: ignore the power of 2. For 360, odd factors = (2 + 1)(1 + 1) = 6
- **even factors**: total minus odd = 24 − 6 = 18
- **factors that are multiples of k**: write n = k × m and count factors of m. Factors of 360 divisible by 12: 360 = 12 × 30, and 30 has 8 factors, so 8
- **perfect-square factors**: choose only even exponents. For 360: exponent of 2 from {0, 2}, of 3 from {0, 2}, of 5 from {0}: 2 × 2 × 1 = 4 (1, 4, 9, 36)

## Sum of factors

For n = p^a × q^b:

~~~
Sum = (1 + p + p² + ... + p^a)(1 + q + ... + q^b)
~~~

~~~
Sum of factors of 72 = 2³ × 3²:
(1 + 2 + 4 + 8)(1 + 3 + 9) = 15 × 13 = 195
~~~

## Product of factors

The product of all factors of n is n^(k/2), where k is the number of factors. For 36 (9 factors), the product is 36^4.5 = 6^9.

## Multiples

Multiples of 7 are 7, 14, 21, and so on. Useful counting facts:

- multiples of k up to N: ⌊N/k⌋
- multiples of k in [a, b]: ⌊b/k⌋ − ⌊(a − 1)/k⌋
- numbers up to N divisible by a **or** b: ⌊N/a⌋ + ⌊N/b⌋ − ⌊N/lcm(a, b)⌋

The last formula uses **inclusion-exclusion**: numbers divisible by both were counted twice, so subtract them once.

~~~
How many numbers from 1 to 500 are divisible by 4 or 6?
⌊500/4⌋ + ⌊500/6⌋ − ⌊500/12⌋ = 125 + 83 − 41 = 167
~~~

Note that the overlap uses the LCM (12), not the product (24).

## Common multiples and common factors

- common factors of two numbers are exactly the factors of their HCF
- common multiples are exactly the multiples of their LCM

These facts link this lesson to the next one.

## Number of ways to write n as a product

The number of ways to write n as a product of two factors (order not mattering) is k/2 for k factors, or (k + 1)/2 when n is a perfect square. 36 has 9 factors, so it can be written as a product of two factors in 5 ways: 1 × 36, 2 × 18, 3 × 12, 4 × 9 and 6 × 6.

## Common mistakes

- forgetting 1 and n itself when listing factors
- counting a perfect square's root twice
- using the product instead of the LCM in inclusion-exclusion
- miscounting exponents in the prime factorization; double-check by multiplying back

## How interviewers test this

Expect "how many factors does n have?", even, odd or square factor counts, the sum of factors, and inclusion-exclusion counts of multiples. Factorize first, apply the (a + 1)(b + 1) formula and its variations, and use the LCM for overlaps.`,
    sources: [OPENSTAX_PREALG, KHAN_PREALG],
  },

  "lcm-hcf": {
    theory: `The HCF (highest common factor, also called GCD) of two numbers is the largest number dividing both; the LCM (least common multiple) is the smallest number divisible by both. They appear directly in questions and hide inside word problems about bells ringing together, tiles fitting a floor, runners meeting, or dividing items into equal groups. This lesson covers computing HCF and LCM, their relationship, fractions, and how to recognize which one a word problem needs.

## Prime factorization method

Factor each number. The HCF takes each common prime to its **lowest** power; the LCM takes every prime to its **highest** power.

~~~
72 = 2³ × 3²
120 = 2³ × 3 × 5
HCF = 2³ × 3 = 24
LCM = 2³ × 3² × 5 = 360
~~~

## Euclid's division method

For large numbers, repeatedly replace the larger number with the remainder of dividing it by the smaller:

~~~
HCF(1071, 462):
1071 = 2 × 462 + 147
462 = 3 × 147 + 21
147 = 7 × 21 + 0
HCF = 21
~~~

Euclid's algorithm is fast even for large numbers and is the method computers use.

## The key relationship

For two numbers a and b:

~~~
a × b = HCF(a, b) × LCM(a, b)
~~~

So LCM = a × b ÷ HCF. Check: 72 × 120 = 8,640 = 24 × 360. This holds for **two** numbers only, not three or more.

Useful consequences:

- the HCF always divides the LCM
- if two numbers have HCF h, they can be written as hx and hy with x and y co-prime, and their LCM is hxy

~~~
Two numbers have HCF 12 and LCM 252. How many such pairs exist?
Numbers are 12x and 12y with xy = 252/12 = 21, x and y co-prime
Pairs (x, y): (1, 21), (3, 7) → 2 pairs: (12, 252) and (36, 84)
~~~

## HCF and LCM of fractions

~~~
HCF of fractions = HCF of numerators ÷ LCM of denominators
LCM of fractions = LCM of numerators ÷ HCF of denominators
~~~

~~~
LCM of 2/3, 4/9, 8/15 = LCM(2, 4, 8) ÷ HCF(3, 9, 15) = 8 ÷ 3 = 8/3
~~~

## Recognizing HCF problems

Use the HCF when dividing things into the **largest equal groups** or the **biggest equal size**:

- the largest tile that exactly covers a floor of 360 cm × 504 cm: HCF(360, 504) = 72 cm
- the greatest number dividing 125, 189 and 253 leaving the same remainder: HCF of their differences, HCF(64, 64, 128) = 64
- the greatest number dividing 70 and 125 leaving remainders 5 and 8: HCF(70 − 5, 125 − 8) = HCF(65, 117) = 13

## Recognizing LCM problems

Use the LCM when events **repeat and coincide** or you need the **smallest common amount**:

- bells tolling every 6, 8 and 12 minutes ring together again after LCM(6, 8, 12) = 24 minutes
- runners lapping in 30, 45 and 60 seconds meet at the start after LCM = 180 seconds
- the smallest number leaving remainder 3 when divided by 4, 6 and 9: LCM(4, 6, 9) + 3 = 36 + 3 = 39

## Remainder variations

| Condition | Answer form |
|---|---|
| Same remainder r for divisors a, b, c | k × LCM(a, b, c) + r |
| Different remainders, constant gap d = divisor − remainder | k × LCM − d |
| Largest divisor leaving same remainder for numbers x, y, z | HCF of pairwise differences |

~~~
Smallest number which, divided by 5, 6 and 8, leaves remainders 3, 4 and 6:
Each remainder is 2 less than the divisor → LCM(5, 6, 8) − 2 = 120 − 2 = 118
~~~

## Quick checks

- HCF ≤ smallest number; LCM ≥ largest number
- for co-prime numbers, HCF = 1 and LCM = product
- if one number divides the other, HCF is the smaller and LCM the larger

These checks eliminate impossible options quickly.

## Common mistakes

- using a × b = HCF × LCM for three numbers
- choosing LCM for a "largest size" problem or HCF for a "when together again" problem
- forgetting to add or subtract the remainder in remainder variations
- mixing the fraction formulas (numerators use HCF for HCF and LCM for LCM)

## How interviewers test this

Expect direct HCF and LCM calculations, the product relationship, pair-counting with given HCF and LCM, fraction HCF/LCM, and word problems about tiles, bells and remainders. Decide first whether the problem wants largest equal division (HCF) or earliest coincidence (LCM), then apply the matching formula.`,
    sources: [WIKI_EUCLID, OPENSTAX_PREALG],
  },

  "percentages": {
    theory: `A percentage expresses a quantity as parts per hundred. Percentages are the single most reused tool in quantitative aptitude: profit and loss, interest, data interpretation, population growth and discounts all depend on them. Fast percentage arithmetic, especially with fraction equivalents and successive changes, saves minutes in every test. This lesson covers conversions, percentage change, successive changes, comparisons and the classic traps.

## Basics

"x percent" means x/100. So 35% of 240 = 0.35 × 240 = 84.

Conversions:

- percentage to decimal: divide by 100 (12.5% = 0.125)
- fraction to percentage: multiply by 100 (3/8 = 37.5%)
- "what percent is a of b?": (a/b) × 100

## Fraction equivalents to memorize

| Fraction | Percent | Fraction | Percent |
|---|---|---|---|
| 1/2 | 50% | 1/7 | 14.29% |
| 1/3 | 33.33% | 1/8 | 12.5% |
| 1/4 | 25% | 1/9 | 11.11% |
| 1/5 | 20% | 1/11 | 9.09% |
| 1/6 | 16.67% | 1/12 | 8.33% |

These turn hard-looking calculations into quick ones: 16.67% of 474 is 474 ÷ 6 = 79, and 87.5% of 640 is 7/8 × 640 = 560.

## Percentage change

~~~
Percentage change = (New − Old) ÷ Old × 100
~~~

The base is always the **original** value. A price rising from 80 to 100 is a 25% increase; falling back from 100 to 80 is a 20% decrease. The same 20-unit change gives different percentages because the bases differ.

## Increasing and decreasing by a percentage

- increase by r%: multiply by (1 + r/100); a 15% increase multiplies by 1.15
- decrease by r%: multiply by (1 − r/100); a 15% decrease multiplies by 0.85

To reverse a change, divide: if a price after a 25% increase is 500, the original was 500 ÷ 1.25 = 400, not 500 × 0.75 = 375.

## Successive changes

Two successive changes of a% and b% give a net change of:

~~~
a + b + (a × b)/100
~~~

Use negative values for decreases.

- +20% then +10%: 20 + 10 + 2 = 32% increase
- +10% then −10%: 10 − 10 − 1 = 1% decrease
- −20% then +25%: −20 + 25 − 5 = 0 (back to the original)

The second example is a classic trap: equal percentage rise and fall always leave a net loss of (a²/100)%.

## Compensating changes

If a price rises by r%, consumption must fall by r/(100 + r) × 100% to keep spending unchanged.

~~~
Sugar price rises 25%. By how much must consumption fall to keep expenditure the same?
25/125 × 100 = 20%
~~~

Similarly, if a price falls by r%, consumption can rise by r/(100 − r) × 100%.

## Comparisons: more than and less than

If A is r% more than B, then B is less than A by r/(100 + r) × 100%.

~~~
A's salary is 25% more than B's. By what percent is B's salary less than A's?
25/125 × 100 = 20%
~~~

## Population and depreciation

Growth at r% per year for n years multiplies by (1 + r/100)^n; depreciation multiplies by (1 − r/100)^n. A machine worth 50,000 depreciating 10% a year is worth 50,000 × 0.9² = 40,500 after two years.

## Percentage points versus percent

If an interest rate moves from 8% to 10%, it rose by 2 **percentage points**, which is a 25% **relative** increase. Data interpretation questions sometimes test this distinction.

## Exam marks and elections

Typical structures:

- a student needs 40% to pass, scores 178 and fails by 22 marks: passing mark = 200, so maximum = 200 ÷ 0.4 = 500
- in a two-candidate election, the winner gets 58% and wins by 2,400 votes: the margin is 16% of valid votes, so valid votes = 2,400 ÷ 0.16 = 15,000

## Calculation tricks

- 10% is a shift of the decimal point; build other percentages from it: 15% = 10% + 5%
- a% of b equals b% of a: 8% of 50 = 50% of 8 = 4
- for 99% or 101%, subtract or add 1%

## How interviewers test this

Expect successive change, reverse percentage, compensation in consumption, "more than / less than" conversions, exam and election problems, and growth or depreciation. Always identify the base, use multiplying factors rather than repeated subtraction, and apply a + b + ab/100 for successive changes.`,
    sources: [KHAN_ARITH, OPENSTAX_PREALG],
  },

  "profit-and-loss": {
    theory: `Profit and loss problems model buying and selling: cost price, selling price, marked price, discounts and the profit or loss percentage that results. They're percentages applied to commerce, and nearly every placement test includes two or three. The key is always knowing which price is the base for each percentage. This lesson covers the core formulas, marked price and discount, successive discounts, false weights, and the classic multi-transaction problems.

## Core terms

- **Cost price (CP)**: what the seller paid
- **Selling price (SP)**: what the buyer pays
- **Profit** = SP − CP (when SP > CP)
- **Loss** = CP − SP (when CP > SP)
- **Profit %** = Profit ÷ CP × 100
- **Loss %** = Loss ÷ CP × 100

Profit and loss percentages are calculated on **cost price** unless the question says otherwise.

## Multiplying factors

- SP = CP × (1 + profit%/100)
- SP = CP × (1 − loss%/100)
- CP = SP ÷ (1 + profit%/100)

~~~
An article sold for 1,380 at a 15% profit. Find CP.
CP = 1,380 ÷ 1.15 = 1,200
~~~

## Marked price and discount

The **marked price (MP)**, or list price, is printed on the tag. A **discount** is given on the marked price:

- Discount = MP − SP
- Discount % = Discount ÷ MP × 100
- SP = MP × (1 − discount%/100)

The chain is CP → (markup) → MP → (discount) → SP.

~~~
A shopkeeper marks goods 40% above cost and gives a 20% discount. Profit %?
Take CP = 100 → MP = 140 → SP = 140 × 0.8 = 112 → profit 12%
~~~

Using CP = 100 is the fastest way to handle chains of percentages.

## Successive discounts

Discounts of a% and b% are equivalent to a single discount of:

~~~
a + b − (a × b)/100
~~~

Successive discounts of 20% and 10% equal 28%, not 30%. The order of the discounts doesn't matter.

## Selling two items at the same price

If two articles are each sold for the same price, one at x% profit and the other at x% loss, the overall result is always a **loss** of (x²/100)%.

~~~
Two phones sold at 9,900 each, one at 10% profit, one at 10% loss.
Overall loss % = 10²/100 = 1%
~~~

## False weights and dishonest dealers

A seller who claims to sell at cost but uses a false weight gains:

~~~
Gain % = (True weight − False weight) ÷ False weight × 100
~~~

~~~
A dealer uses 900 g instead of 1 kg and sells at cost price. Gain %?
(1000 − 900) ÷ 900 × 100 = 11.11%
~~~

When the dealer also adds a markup, combine the two effects using multiplying factors.

## Buying and selling in different quantities

~~~
If the cost price of 12 pens equals the selling price of 10 pens, find profit %.
Let CP of 1 pen = 1. CP of 12 = 12 = SP of 10 → SP of 1 = 1.2
Profit = 20%
~~~

General result: if CP of x items equals SP of y items, profit % = (x − y)/y × 100.

## Profit on selling price

Some questions state profit as a percentage of SP. Convert: a profit of 20% on SP means SP = 100, profit = 20, CP = 80, so profit on CP is 25%.

## Multi-step transactions

~~~
A sells to B at 20% profit, B sells to C at 10% profit, and C pays 2,640. What did A pay?
A's CP × 1.2 × 1.1 = 2,640 → A's CP = 2,640 ÷ 1.32 = 2,000
~~~

## Break-even and target profit

To find the selling price for a target profit, multiply CP by the factor. To find how many units must be sold to cover fixed costs: units = fixed cost ÷ (price per unit − variable cost per unit).

## Common mistakes

- calculating profit % on SP instead of CP
- adding successive discounts directly
- treating "sold at x% loss" as SP = CP − x without the CP base
- assuming the same-price, equal-percentage case breaks even

## How interviewers test this

Expect markup and discount chains, successive discounts, same-price profit and loss pairs, false weights, "CP of x equals SP of y" problems and multi-step chains. Use CP = 100 for percentage chains, multiplying factors for reverse calculations, and always check which price each percentage is based on.`,
    sources: [OPENSTAX_BUSINESS, KHAN_ARITH],
  },

  "ratio-proportion": {
    theory: `A ratio compares two quantities of the same kind; a proportion states that two ratios are equal. Ratios appear in partnerships, mixtures, ages, salaries, recipe scaling and map scales, and they make many word problems far quicker than algebra. This lesson covers ratio basics, combining ratios, proportion and its properties, dividing quantities, partnerships and the mixture technique called alligation.

## Ratios

The ratio of a to b, written a : b, is a/b. Ratios have no units, but both quantities must use the same units: 50 cm to 2 m is 50 : 200 = 1 : 4.

Properties:

- multiplying or dividing both terms by the same non-zero number doesn't change the ratio
- always simplify to lowest terms
- a ratio a : b with a > b is a **ratio of greater inequality**

## Dividing a quantity in a ratio

To divide N in the ratio a : b : c:

~~~
Shares = N × a/(a + b + c), N × b/(a + b + c), N × c/(a + b + c)
~~~

~~~
Divide 1,800 in the ratio 2 : 3 : 4.
Total parts = 9 → one part = 200 → shares 400, 600, 800
~~~

## Combining ratios

If A : B = 2 : 3 and B : C = 4 : 5, make B equal in both:

~~~
A : B = 8 : 12, B : C = 12 : 15 → A : B : C = 8 : 12 : 15
~~~

Multiply each ratio so the shared term matches its LCM (here 12).

## Compound, duplicate and inverse ratios

- **compound ratio** of a : b and c : d is ac : bd
- **duplicate ratio** of a : b is a² : b²; **sub-duplicate** is √a : √b
- **inverse ratio** of a : b is b : a, or 1/a : 1/b

Inverse ratios arise when quantities vary inversely: shares divided inversely as 2 : 3 : 6 means 1/2 : 1/3 : 1/6 = 3 : 2 : 1.

## Proportion

Four numbers a, b, c, d are in proportion when a : b = c : d, so ad = bc (product of extremes equals product of means).

- **fourth proportional** to a, b, c: d = bc/a
- **third proportional** to a and b: c = b²/a
- **mean proportional** between a and b: √(ab)

~~~
Mean proportional between 9 and 16 = √144 = 12
~~~

## Direct and inverse variation

- **direct**: one quantity doubles, the other doubles (cost and quantity). y = kx
- **inverse**: one doubles, the other halves (workers and time for a fixed job). xy = k

Identifying which kind is involved is the first step in unitary-method problems.

## Adding to a ratio

~~~
Two numbers are in the ratio 3 : 5. Adding 10 to each makes the ratio 5 : 7. Find the numbers.
(3x + 10)/(5x + 10) = 5/7 → 21x + 70 = 25x + 50 → x = 5 → numbers 15 and 25
~~~

Ages problems follow the same pattern: the difference between two people's ages never changes, a useful check.

## Partnerships

Profit is shared in the ratio of **capital × time**:

~~~
A invests 30,000 for 12 months; B invests 40,000 for 6 months. Profit 26,000.
Ratio = 30,000 × 12 : 40,000 × 6 = 360,000 : 240,000 = 3 : 2
A gets 15,600, B gets 10,400
~~~

If a partner also draws a salary for managing, deduct it from the profit before dividing.

## Mixtures and alligation

When two ingredients with values (price, concentration) c₁ and c₂ are mixed to get a mean value m, the quantities are in the ratio:

~~~
Quantity of cheaper : Quantity of dearer = (c₂ − m) : (m − c₁)
~~~

~~~
Rice at 40 and 60 per kg mixed to sell at 52 per kg. Ratio?
(60 − 52) : (52 − 40) = 8 : 12 = 2 : 3
~~~

Alligation also solves problems on average marks of mixed groups and concentrations of solutions.

## Repeated replacement

If a container holds x litres of liquid and y litres are replaced by water n times, the remaining original liquid is:

~~~
x × (1 − y/x)^n
~~~

## Common mistakes

- comparing quantities in different units
- adding ratios directly instead of making the common term equal
- forgetting time in partnership ratios
- placing values on the wrong sides in alligation

## How interviewers test this

Expect dividing amounts in ratios, combining chained ratios, mean and fourth proportionals, changing ratios after additions, partnerships with different durations, and alligation mixtures. Simplify units first, equalize common terms, use capital × time for partnerships, and use the alligation cross-difference for mixtures.`,
    sources: [KHAN_PREALG, OPENSTAX_PREALG],
  },

  "averages": {
    theory: `An average (arithmetic mean) summarizes a set of values as a single number: the total divided by the count. Average problems appear in nearly every placement test, often disguised: a batsman's new average, the age of a new member joining a group, a wrong value corrected, or the average speed of a journey. Working with totals instead of averages is the key technique. This lesson covers the definition, total-based reasoning, changes when items are added or removed, weighted averages, average speed and useful series results.

## Definition

~~~
Average = Sum of values ÷ Number of values
~~~

So Sum = Average × Number, the form used in most problems.

## Think in totals

~~~
The average of 5 numbers is 24. Four of them are 18, 22, 30 and 26. Find the fifth.
Total = 5 × 24 = 120; known sum = 96; fifth = 24
~~~

Converting averages to totals turns every problem into addition and subtraction.

## Adding or removing an item

~~~
The average age of 30 students is 15. Including the teacher, the average becomes 16. Teacher's age?
New total = 31 × 16 = 496; old total = 450; teacher = 46
~~~

Shortcut: the newcomer equals the old average plus (new count × increase): 15 + 31 × 1 = 46.

Similarly, when a person replaces another and the average rises by d for a group of n, the newcomer is n × d more than the person replaced.

~~~
A man of 60 kg in a group of 8 is replaced, and the average weight rises by 2.5 kg.
New man's weight = 60 + 8 × 2.5 = 80 kg
~~~

## Correcting wrong values

~~~
The average of 40 values was 35, but 72 was misread as 27. Correct average?
Error = 72 − 27 = 45 added to the total → correct average = 35 + 45/40 = 36.125
~~~

## Weighted average

When groups of different sizes are combined:

~~~
Combined average = (n₁a₁ + n₂a₂) ÷ (n₁ + n₂)
~~~

~~~
Section A: 30 students averaging 70. Section B: 20 students averaging 80.
Combined = (2,100 + 1,600) ÷ 50 = 74
~~~

The combined average always lies between the group averages, closer to the larger group's. Alligation, from the ratio lesson, solves the reverse problem of finding group sizes from averages.

## Average speed

For a journey with equal **distances** at speeds a and b, the average speed is the **harmonic mean**:

~~~
Average speed = 2ab ÷ (a + b)
~~~

~~~
Going at 40 km/h and returning at 60 km/h:
2 × 40 × 60 ÷ 100 = 48 km/h, not 50
~~~

The reason: you spend more time at the slower speed. For equal **times** at speeds a and b, the average is the ordinary mean (a + b)/2. In general, average speed = total distance ÷ total time.

## Averages of series

- average of the first n natural numbers: (n + 1)/2
- average of the first n even numbers: n + 1
- average of the first n odd numbers: n
- average of any arithmetic progression: (first + last)/2
- average of consecutive numbers: the middle number (or the mean of the two middle numbers)

~~~
Average of 7 consecutive numbers is 33. Largest?
Middle (4th) number is 33 → largest is 36
~~~

## Cricket averages

~~~
A batsman averaging 32 after 20 innings scores 74 in the 21st. New average?
New total = 640 + 74 = 714 → average = 34
~~~

Reverse: how much must he score to raise the average by 2? 32 + 21 × 2 = 74, using the same newcomer shortcut.

## Mean, median and mode

Data questions sometimes ask about other averages:

- **median**: the middle value of sorted data (mean of the two middle values for an even count)
- **mode**: the most frequent value

The mean is sensitive to extreme values; the median isn't. In a dataset of salaries with one huge value, the median better represents a typical salary.

## Deviation method

Pick an assumed average, add the deviations, and adjust:

~~~
Average of 47, 52, 49, 55, 51 with assumed mean 50:
Deviations: −3, +2, −1, +5, +1 → sum = 4 → average = 50 + 4/5 = 50.8
~~~

This speeds up mental arithmetic with clustered values.

## How interviewers test this

Expect missing-value, new-member, replacement, corrected-value, combined-group, cricket and average-speed problems. Convert to totals, use the newcomer shortcut, apply the harmonic mean for equal distances, and remember that the average of consecutive values is the middle one.`,
    sources: [OPENSTAX_STATS, KHAN_ARITH],
  },

  "simple-interest": {
    theory: `Simple interest is interest calculated only on the original amount borrowed or invested, the principal, at a fixed rate per period. It's the simplest model of lending and appears in placement tests alone and as a contrast with compound interest. The formula is short, but questions twist it: finding the rate, time or principal, comparing two investments, or tracking money that doubles. This lesson covers the formula, rearrangements, amounts, time conversions and common question patterns.

## The formula

~~~
SI = (P × R × T) ÷ 100
~~~

- **P**: principal, the original sum
- **R**: rate of interest per annum (percent)
- **T**: time in years
- **Amount** A = P + SI

~~~
Interest on 8,000 at 6% per annum for 3 years:
SI = 8,000 × 6 × 3 ÷ 100 = 1,440; Amount = 9,440
~~~

Simple interest grows **linearly**: the same interest is added every year, because it's always calculated on P.

## Rearranging the formula

- P = 100 × SI ÷ (R × T)
- R = 100 × SI ÷ (P × T)
- T = 100 × SI ÷ (P × R)

~~~
At what rate will 5,000 earn 1,200 in 4 years?
R = 100 × 1,200 ÷ (5,000 × 4) = 6%
~~~

## Converting time

- months: T = months/12 (9 months = 0.75 years)
- days: T = days/365 (73 days = 0.2 years)

Count days carefully: for a loan from 5 March to 16 May, count 26 days left in March (excluding the start day), 30 in April and 16 in May = 72 days. Conventions differ; follow the question's statement if it specifies one.

## Amount given, principal unknown

~~~
A sum amounts to 7,560 in 3 years at 8% simple interest. Find the sum.
A = P(1 + RT/100) → 7,560 = P × 1.24 → P = 6,097 (approximately)
~~~

## Two amounts at different times

When the amounts after two different times are given, the difference is the interest for the extra period:

~~~
A sum amounts to 6,200 in 2 years and 6,800 in 5 years.
3 years' interest = 600 → 1 year's interest = 200
P = 6,200 − 2 × 200 = 5,800; R = 200/5,800 × 100 ≈ 3.45%
~~~

## Doubling and multiplying

A sum becomes n times itself when the interest equals (n − 1) × P:

~~~
(n − 1) × 100 = R × T
~~~

- doubles (n = 2) when R × T = 100: at 10% in 10 years
- triples (n = 3) when R × T = 200

~~~
A sum doubles in 8 years at simple interest. When will it become 4 times?
Doubling: interest P in 8 years. Four times needs interest 3P → 24 years
~~~

## Interest rates that change

If the rate is R₁ for T₁ years and R₂ for T₂ years:

~~~
SI = P(R₁T₁ + R₂T₂) ÷ 100
~~~

## Dividing a sum to get equal amounts

~~~
Divide 2,379 into three parts so their amounts after 2, 3 and 4 years at 5% are equal.
Amount factors: 1.10, 1.15, 1.20 → parts ∝ 1/1.10 : 1/1.15 : 1/1.20
Multiplying by the LCM of the denominators simplifies to 276 : 264 : 253
Parts: 828, 792, 759
~~~

## Instalments

A loan repaid in equal annual instalments under simple interest is handled by equating the amount owed with the sum of each instalment plus its interest up to the end. Each instalment paid earlier earns interest for the remaining years.

## Simple interest versus compound interest

| | Simple interest | Compound interest |
|---|---|---|
| Interest calculated on | Original principal only | Principal plus accumulated interest |
| Growth | Linear | Exponential |
| Same P, R, T | Lower | Higher (for T > 1 year) |
| First year | Equal to CI (with annual compounding) | Equal to SI |

## Common mistakes

- forgetting to convert months or days into years
- using the amount as the principal
- treating "rate" as a fraction rather than a percentage in the formula
- applying the doubling idea from compound interest (rule of 72) to simple interest

## How interviewers test this

Expect direct SI calculations, finding R or T, two-amount problems, doubling or tripling times, changing rates and equal-amount divisions. Write down P, R and T explicitly, convert time to years, use the difference between amounts to isolate yearly interest, and remember R × T = 100(n − 1) for multiples.`,
    sources: [OPENSTAX_BUSINESS, KHAN_ARITH],
  },

  "compound-interest": {
    theory: `Compound interest is interest calculated on the principal plus all interest already earned: interest on interest. It's how savings accounts, loans, investments, inflation and population growth work in the real world. In aptitude tests, compound interest questions test the growth formula, compounding frequency, the difference between compound and simple interest, and reverse calculations. This lesson covers each, with shortcuts that avoid heavy arithmetic.

## The formula

~~~
A = P × (1 + R/100)^T
CI = A − P
~~~

~~~
10,000 at 10% per annum compounded annually for 3 years:
A = 10,000 × 1.1³ = 13,310; CI = 3,310
~~~

Year by year: 10,000 → 11,000 → 12,100 → 13,310. Each year's interest is 10% of the previous year's amount.

## Compounding more often

If interest is compounded k times a year, use rate R/k per period and kT periods:

~~~
A = P × (1 + R/(100k))^(kT)
~~~

- half-yearly: rate R/2, periods 2T
- quarterly: rate R/4, periods 4T

~~~
8,000 at 10% per annum compounded half-yearly for 1 year:
A = 8,000 × 1.05² = 8,820; CI = 820 (versus 800 annually)
~~~

More frequent compounding gives slightly more interest.

## Different rates in different years

~~~
A = P × (1 + R₁/100)(1 + R₂/100)(1 + R₃/100)
~~~

~~~
5,000 at 10% in year 1 and 20% in year 2:
5,000 × 1.1 × 1.2 = 6,600
~~~

## CI versus SI

For 2 years:

~~~
CI − SI = P × (R/100)²
~~~

For 3 years:

~~~
CI − SI = P × (R/100)² × (3 + R/100)
~~~

~~~
Difference between CI and SI on 5,000 at 8% for 2 years:
5,000 × 0.08² = 32
~~~

These formulas answer a frequent question type in seconds and work in reverse to find P.

## Successive-percentage method

Compound growth is successive percentage increase. For 2 years at R%, the effective two-year rate is R + R + R²/100:

- 10% for 2 years: 21%
- 20% for 2 years: 44%

For 3 years at 10%: 21 + 10 + 2.1 = 33.1%. This avoids computing powers.

## Reverse problems

~~~
A sum becomes 9,261 in 3 years at 5% compound interest. Find the sum.
P = 9,261 ÷ 1.05³ = 9,261 ÷ 1.157625 = 8,000
~~~

Recognizing powers helps: 1.05³ = 9,261/8,000 because 21³ = 9,261 and 20³ = 8,000.

## Finding time or rate

Exact answers usually come from recognizable powers. If a sum becomes 1.21 times in 2 years, the rate is 10% (1.1² = 1.21). If a sum doubles in n years at compound interest, it becomes 4 times in 2n years and 8 times in 3n years, because growth multiplies.

## Rule of 72

A quick estimate: money doubles in about 72 ÷ R years at R% compound interest. At 8%, about 9 years; at 12%, about 6 years. It's an approximation, useful for checking options, not for exact answers.

## Population and depreciation

The same formula models growth and decay:

- population growing at 4% per year: P × 1.04^n
- a car depreciating 15% per year: value × 0.85^n

~~~
A town of 50,000 grows 10% in year 1 and falls 10% in year 2.
50,000 × 1.1 × 0.9 = 49,500
~~~

## Instalments under compound interest

For a loan repaid in two equal annual instalments x at R%:

~~~
P = x/(1 + R/100) + x/(1 + R/100)²
~~~

Each instalment is discounted back to the present.

~~~
A loan at 10% is repaid in two equal annual instalments of 12,100. Find the loan.
12,100/1.1 + 12,100/1.21 = 11,000 + 10,000 = 21,000
~~~

## Effective annual rate

Nominal 12% compounded quarterly gives an effective annual rate of 1.03⁴ − 1 ≈ 12.55%. Comparing loans by effective rate, not nominal rate, is the correct method.

## A worked comparison

Take 20,000 for 3 years at 10%. Under simple interest, it earns 2,000 every year: 6,000 in total. Under annual compounding, it earns 2,000, then 2,200, then 2,420: 6,620 in total. The gap of 620 matches the 3-year formula: 20,000 × 0.01 × 3.1 = 620. The extra comes entirely from interest earned on earlier interest, and it widens every year the money stays invested.

## How interviewers test this

Expect CI calculations with annual, half-yearly and quarterly compounding, CI − SI differences, reverse principal problems, doubling-time reasoning, varying rates, depreciation and instalments. Use successive percentages for 2 or 3 years, the CI − SI formulas, recognizable powers for reverse problems, and the rule of 72 to sanity-check.`,
    sources: [WIKI_COMPOUND, OPENSTAX_BUSINESS],
  },
};
