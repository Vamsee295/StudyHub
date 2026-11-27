// Quant topics that complete the placement syllabus: decimals, roots, chain rule, numbers, races,
// heights and distances, stocks and shares, discounts. Plain-language notes with formula tables. Original writing.
import type { FullLesson } from './apt-extra-types';

const KHAN_DEC = { title: "Khan Academy: Decimals (free)", url: "https://www.khanacademy.org/math/arithmetic/arith-decimals" };
const WIKI_REC = { title: "Wikipedia: Repeating decimal", url: "https://en.wikipedia.org/wiki/Repeating_decimal" };
const WIKI_SQRT = { title: "Wikipedia: Square root", url: "https://en.wikipedia.org/wiki/Square_root" };
const WIKI_CUBE = { title: "Wikipedia: Cube root", url: "https://en.wikipedia.org/wiki/Cube_root" };
const WIKI_PROP = { title: "Wikipedia: Proportionality (mathematics)", url: "https://en.wikipedia.org/wiki/Proportionality_(mathematics)" };
const KHAN_ALG = { title: "Khan Academy: Algebra 1 (free)", url: "https://www.khanacademy.org/math/algebra" };
const WIKI_TRIG = { title: "Wikipedia: Trigonometric functions", url: "https://en.wikipedia.org/wiki/Trigonometric_functions" };
const KHAN_TRIG = { title: "Khan Academy: Trigonometry (free)", url: "https://www.khanacademy.org/math/trigonometry" };
const WIKI_DIV = { title: "Wikipedia: Dividend", url: "https://en.wikipedia.org/wiki/Dividend" };
const WIKI_PV = { title: "Wikipedia: Present value", url: "https://en.wikipedia.org/wiki/Present_value" };
const WIKI_SPEED = { title: "Wikipedia: Speed", url: "https://en.wikipedia.org/wiki/Speed" };

export const syllabusQuant: FullLesson[] = [
  {
    slug: "decimal-fractions",
    title: "Decimal Fractions",
    description: "Reading, converting and calculating with decimals, including recurring decimals.",
    minutes: 25,
    theory: `A decimal is another way to write a fraction whose bottom number is 10, 100, 1000 and so on. 0.7 means 7 tenths, 0.25 means 25 hundredths. Every test uses decimals somewhere, so being quick and accurate with them saves time across the whole paper.

## Start here: place value

| Number | Means |
|---|---|
| 0.5 | 5/10 |
| 0.05 | 5/100 |
| 0.005 | 5/1000 |
| 2.375 | 2 + 3/10 + 7/100 + 5/1000 |

Each step to the right of the point makes a digit ten times smaller.

## Converting

**Fraction to decimal:** divide the top by the bottom. 3/8 = 3 ÷ 8 = 0.375.

**Decimal to fraction:** write the digits over 10, 100 or 1000, then simplify. 0.375 = 375/1000 = 3/8.

**Fractions worth memorising**

| Fraction | Decimal |
|---|---|
| 1/2 | 0.5 |
| 1/4 | 0.25 |
| 3/4 | 0.75 |
| 1/5 | 0.2 |
| 1/8 | 0.125 |
| 1/3 | 0.333… |
| 2/3 | 0.666… |
| 1/6 | 0.1666… |
| 1/9 | 0.111… |

## Recurring decimals

Some fractions never end: 1/3 = 0.333… with the 3 repeating forever. A bar over the repeating part shows this.

| Recurring decimal | Fraction | Rule |
|---|---|---|
| 0.aaa… | a/9 | one digit repeats: put it over 9 |
| 0.ababab… | ab/99 | two digits repeat: over 99 |
| 0.abcabc… | abc/999 | three digits repeat: over 999 |

So 0.777… = 7/9 and 0.454545… = 45/99 = 5/11.

## Adding and subtracting

Line up the decimal points, then add or subtract as usual. Fill gaps with zeros: 3.5 + 0.25 = 3.50 + 0.25 = 3.75.

## Multiplying

Multiply as if there were no decimal points, then count the **total** decimal places in both numbers and put that many in the answer.

~~~
0.3 × 0.02
3 × 2 = 6
decimal places: 1 + 2 = 3
answer: 0.006
~~~

## Dividing

Make the divisor a whole number by moving both decimal points the same number of places to the right.

~~~
0.144 ÷ 0.12
move both points 2 places: 14.4 ÷ 12 = 1.2
~~~

## Worked examples

**Example 1 (warm-up).** Write 7/20 as a decimal. 7 ÷ 20 = 0.35.

**Example 2.** Simplify 0.25 × 0.4 ÷ 0.05. First 0.25 × 0.4 = 0.1. Then 0.1 ÷ 0.05 = 10 ÷ 5 = **2**.

**Example 3.** Write 0.363636… as a fraction. Two digits repeat: 36/99 = **4/11**.

**Example 4 (test level).** Which is largest: 0.7, 0.07, 0.77, 0.707? Give them the same number of decimal places: 0.700, 0.070, 0.770, 0.707. The largest is **0.77**.

## Traps in this topic

- miscounting decimal places when multiplying
- moving the decimal point in only one number when dividing
- thinking 0.5 is smaller than 0.25 because 5 is smaller than 25; compare with equal places

## Practice

1. Write 3/25 as a decimal
2. 1.2 × 0.03
3. Write 0.888… as a fraction
4. Arrange in ascending order: 0.6, 0.06, 0.66, 0.606

**Answers:** 1) **0.12**. 2) 12 × 3 = 36 with 3 decimal places: **0.036**. 3) **8/9**. 4) **0.06, 0.6, 0.606, 0.66**.`,
    sources: [KHAN_DEC, WIKI_REC],
    remember: [
      "Fraction to decimal: divide top by bottom",
      "Recurring: 0.aaa… = a/9, 0.abab… = ab/99",
      "Multiplying: total the decimal places of both numbers",
      "Dividing: move both decimal points until the divisor is whole",
      "Compare decimals by giving them the same number of places",
    ],
    quick: { question: "What is 0.3 × 0.02?", options: ["0.006", "0.06", "0.6", "0.0006"], answer: 0, explanation: "3 × 2 = 6 with 1 + 2 = 3 decimal places: 0.006." },
    questions: [
      { q: "Write 0.777… as a fraction.", o: ["7/9", "7/10", "77/100", "7/99"], a: 0, e: "One repeating digit over 9: 7/9." },
      { q: "What is 0.144 ÷ 0.12?", o: ["1.2", "0.12", "12", "1.02"], a: 0, e: "Move both points two places: 14.4 ÷ 12 = 1.2." },
      { q: "Which is the largest: 0.7, 0.07, 0.77, 0.707?", o: ["0.77", "0.707", "0.7", "0.07"], a: 0, e: "As 0.700, 0.070, 0.770, 0.707, the largest is 0.770." },
      { q: "Write 3/8 as a decimal.", o: ["0.375", "0.38", "0.83", "0.0375"], a: 0, e: "Divide the top by the bottom: 3 ÷ 8 = 0.375." },
    ],
    visual: {
      plain: "Decimals are money. ₹2.75 is 2 rupees and 75 paise: each place to the right of the point is ten times smaller, like moving from rupees to ten-paise to one-paise coins.",
      diagram: `flowchart LR
  A["2"] --> B["point"] --> C["7 tenths<br/>0.7"] --> D["5 hundredths<br/>0.05"]
  C & D --> E["2.75 = 2 + 0.7 + 0.05"]`,
      caption: "Each place to the right is ten times smaller.",
    },
  },
  {
    slug: "square-and-cube-roots",
    title: "Square Roots and Cube Roots",
    description: "Finding roots of perfect squares and cubes fast, roots of decimals, and estimating.",
    minutes: 25,
    theory: `The square root of a number is the value that, multiplied by itself, gives the number: √49 = 7 because 7 × 7 = 49. The cube root is the value that, used three times, gives the number: ∛27 = 3 because 3 × 3 × 3 = 27. Tests ask for roots directly and inside longer expressions, so recognising them instantly is a real time saver.

## Start here: tables to learn

**Squares 11 to 30**

| n | n² | n | n² |
|---|---|---|---|
| 11 | 121 | 21 | 441 |
| 12 | 144 | 22 | 484 |
| 13 | 169 | 23 | 529 |
| 14 | 196 | 24 | 576 |
| 15 | 225 | 25 | 625 |
| 16 | 256 | 26 | 676 |
| 17 | 289 | 27 | 729 |
| 18 | 324 | 28 | 784 |
| 19 | 361 | 29 | 841 |
| 20 | 400 | 30 | 900 |

**Cubes 1 to 15:** 1, 8, 27, 64, 125, 216, 343, 512, 729, 1000, 1331, 1728, 2197, 2744, 3375.

## Square roots of perfect squares, fast

1. Look at the **last digit** of the number to find the possible last digits of the root

| Number ends in | Root ends in |
|---|---|
| 1 | 1 or 9 |
| 4 | 2 or 8 |
| 5 | 5 |
| 6 | 4 or 6 |
| 9 | 3 or 7 |
| 0 (an even number of zeros) | 0 |

2. Find the two tens the root lies between
3. Choose the one that fits

**Example:** √1764. Ends in 4, so the root ends in 2 or 8. 40² = 1600 and 50² = 2500, so the root is in the 40s and nearer 40: **42** (42² = 1764).

## Cube roots of perfect cubes, fast

Every last digit of a cube points to exactly one last digit of the root:

| Cube ends in | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|---|
| Root ends in | 0 | 1 | 8 | 7 | 4 | 5 | 6 | 3 | 2 | 9 |

**Example:** ∛12167. Ends in 7, so the root ends in 3. Drop the last three digits: 12 lies between 8 (2³) and 27 (3³), so the tens digit is 2. Root = **23**.

## Roots of decimals and fractions

- √0.0049 = √(49/10000) = 7/100 = 0.07
- √(16/25) = 4/5
- the number of decimal places must be even for an exact square root, and the root has half as many: 0.0049 has 4, so the root has 2

## Estimating roots

√50 lies between √49 = 7 and √64 = 8, close to 7: about 7.07. For estimates, √2 ≈ 1.414 and √3 ≈ 1.732 are worth knowing.

## Worked examples

**Example 1.** √625 = **25** (from the table).

**Example 2.** √(0.81) = √(81/100) = 9/10 = **0.9**.

**Example 3.** ∛3375 = **15** (ends in 5 → root ends in 5; 3 lies between 1 and 8 → tens digit 1).

**Example 4 (test level).** √144 + ∛216 − √81 = 12 + 6 − 9 = **9**.

## Traps in this topic

- √(a + b) is not √a + √b: √(9 + 16) = 5, not 7
- forgetting that a decimal needs an even number of places for an exact root
- confusing 2 and 8 as last digits of cube roots (they swap)

## Practice

1. √2209
2. ∛4913
3. √0.0144
4. √196 + ∛343

**Answers:** 1) ends in 9, root ends in 3 or 7, between 40 and 50, nearer 50: **47**. 2) ends in 3, root ends in 7; 4 lies between 1 and 8: **17**. 3) **0.12**. 4) 14 + 7 = **21**.`,
    sources: [WIKI_SQRT, WIKI_CUBE],
    remember: [
      "Learn squares to 30 and cubes to 15",
      "Square roots: last digit narrows the options; the tens bracket picks one",
      "Cube roots: each last digit gives one root digit (2 ↔ 8, 3 ↔ 7 swap)",
      "√ of a decimal: even number of places, the root has half as many",
      "√(a + b) ≠ √a + √b",
    ],
    quick: { question: "What is √1764?", options: ["42", "38", "48", "44"], answer: 0, explanation: "Ends in 4 → root ends in 2 or 8; between 40 and 50, nearer 40: 42." },
    questions: [
      { q: "What is ∛12167?", o: ["23", "27", "33", "17"], a: 0, e: "Ends in 7 → root ends in 3; 12 is between 2³ and 3³, so 23." },
      { q: "What is √0.0049?", o: ["0.07", "0.7", "0.007", "0.49"], a: 0, e: "0.0049 = 49/10000, so the root is 7/100 = 0.07." },
      { q: "What is √144 + ∛216 − √81?", o: ["9", "15", "21", "3"], a: 0, e: "√144 = 12, ∛216 = 6, √81 = 9, so 12 + 6 − 9 = 9." },
      { q: "√(9 + 16) equals…", o: ["5", "7", "25", "12"], a: 0, e: "Add first: √25 = 5. Roots don't split over addition." },
    ],
    visual: {
      plain: "A square root asks: what side length makes a square of this area? A square of 49 tiles has sides of 7 tiles. A cube root asks the same about a cube built from blocks.",
      diagram: `flowchart LR
  A["area 49"] --> B["side √49 = 7"]
  C["volume 27"] --> D["edge ∛27 = 3"]`,
      caption: "Roots undo squaring and cubing.",
    },
  },
  {
    slug: "chain-rule-and-variation",
    title: "Chain Rule (Direct and Inverse Variation)",
    description: "When quantities rise together or work against each other: men, days, hours and work.",
    minutes: 25,
    theory: `"Chain rule" questions link several quantities: workers, days, hours per day, amount of work, cost. The whole topic rests on one question you ask about each pair: **if one goes up, does the other go up or down?**

## Start here: two kinds of variation

| Kind | Meaning | Example |
|---|---|---|
| Direct | both rise or fall together | more pens → more cost |
| Inverse | one rises, the other falls | more workers → fewer days |

**Direct:** if 5 pens cost ₹40, 1 pen costs ₹8, so 12 pens cost ₹96.

**Inverse:** if 6 workers finish a job in 10 days, the total work is 6 × 10 = 60 worker-days. 12 workers need 60 / 12 = 5 days.

## The master formula

For work problems with several factors:

~~~
(M₁ × D₁ × H₁) / W₁ = (M₂ × D₂ × H₂) / W₂
~~~

M = number of workers, D = days, H = hours per day, W = amount of work. Workers, days and hours are on top because more of each means more work done; work is underneath.

## Method step by step

1. List the quantities in two rows: first situation, second situation
2. Mark the unknown
3. Put the known values into the master formula, or reason pair by pair (direct or inverse)
4. Solve for the unknown

## Worked examples

**Example 1 (direct).** 8 metres of cloth cost ₹480. What do 15 metres cost? One metre = ₹60, so 15 metres = **₹900**.

**Example 2 (inverse).** 15 workers build a wall in 12 days. How many days for 20 workers? Total = 15 × 12 = 180 worker-days; 180 / 20 = **9 days**.

**Example 3 (two factors).** 10 workers working 8 hours a day finish a job in 12 days. How many days will 16 workers working 6 hours a day take?

~~~
10 × 12 × 8 = 16 × D × 6
960 = 96 D  →  D = 10 days
~~~

**Example 4 (different amounts of work).** 6 painters paint 3 houses in 10 days. How many painters paint 5 houses in 15 days?

~~~
(6 × 10) / 3 = (M × 15) / 5
20 = 3M  →  M = 20/3, so 7 painters (round up: you can't hire part of a person)
~~~

Read what the question asks: "at least how many painters" means round up.

**Example 5 (food lasting).** Food for 200 people lasts 30 days. After 5 days, 50 people leave. How long does the remaining food last? Food left = 200 × 25 = 5,000 person-days; 150 people eat it in 5,000 / 150 = 33⅓ days.

## Pair-by-pair reasoning (no formula)

Start from the known answer and adjust for each change: 12 days × (10/16 because more workers means fewer days) × (8/6 because fewer hours means more days) = 12 × 0.625 × 1.333 = **10 days**. Same answer as Example 3.

## Traps in this topic

- treating an inverse pair as direct (more workers, more days is wrong)
- forgetting the hours per day when it changes
- in "food lasts" questions, forgetting the days already used

## Practice

1. 12 pencils cost ₹60. What do 20 cost?
2. 8 taps fill a tank in 27 minutes. How long do 12 taps take?
3. 5 workers earn ₹2,500 in 4 days. What do 8 workers earn in 5 days?

**Answers:** 1) ₹5 each: **₹100**. 2) 8 × 27 / 12 = **18 minutes**. 3) ₹2,500 / 20 worker-days = ₹125 each; 8 × 5 × 125 = **₹5,000**.`,
    sources: [WIKI_PROP, KHAN_ALG],
    remember: [
      "Direct: both rise together; inverse: one rises, the other falls",
      "M₁D₁H₁/W₁ = M₂D₂H₂/W₂ for workers, days, hours and work",
      "Inverse pairs keep their product fixed: workers × days stays the same",
      "Food problems: subtract the days already used before redistributing",
      "Round up when the answer counts people or machines",
    ],
    quick: { question: "15 workers build a wall in 12 days. How many days do 20 workers take?", options: ["9", "16", "8", "10"], answer: 0, explanation: "15 × 12 = 180 worker-days; 180 / 20 = 9." },
    questions: [
      { q: "10 workers, 8 hours a day, 12 days. How many days for 16 workers at 6 hours a day?", o: ["10", "12", "8", "15"], a: 0, e: "10 × 12 × 8 = 16 × D × 6 gives D = 10." },
      { q: "8 m of cloth cost ₹480. What do 15 m cost?", o: ["₹900", "₹800", "₹960", "₹750"], a: 0, e: "₹60 a metre × 15 = ₹900." },
      { q: "8 taps fill a tank in 27 minutes. How long do 12 taps take?", o: ["18 minutes", "40.5 minutes", "20 minutes", "24 minutes"], a: 0, e: "Inverse: 8 × 27 / 12 = 18." },
      { q: "More workers on a job means…", o: ["fewer days (inverse variation)", "more days (direct variation)", "the same days", "it depends on the cost"], a: 0, e: "Workers and days are inversely related." },
    ],
    visual: {
      plain: "Think of a pizza. More friends sharing it means smaller slices each (inverse). More pizzas ordered means a bigger bill (direct). Every chain-rule question is a mix of these two.",
      diagram: `flowchart LR
  W["more workers"] -->|"inverse"| D["fewer days"]
  P["more pens"] -->|"direct"| C["more cost"]`,
      caption: "Decide direct or inverse for each pair, then solve.",
    },
  },
  {
    slug: "problems-on-numbers",
    title: "Problems on Numbers",
    description: "Turning word statements about numbers into equations: sums, differences, digits and fractions.",
    minutes: 25,
    theory: `Problems on numbers describe an unknown number in words: "a number, when increased by 15, becomes four times itself". The skill is translating the sentence into an equation. Once you can do that, the maths is short.

## Start here: translating words

| Words | Write |
|---|---|
| a number | x |
| increased by 5, 5 more than | x + 5 |
| decreased by 5, 5 less than | x − 5 |
| twice, double | 2x |
| half of | x/2 |
| the square of | x² |
| the sum of two numbers | x + y |
| the difference | x − y |
| the product | xy |
| consecutive numbers | x, x + 1, x + 2 |
| consecutive even (or odd) numbers | x, x + 2, x + 4 |

## Two numbers from their sum and difference

~~~
larger = (sum + difference) / 2
smaller = (sum − difference) / 2
~~~

Sum 50, difference 14: larger = 32, smaller = 18.

## Two-digit numbers

A two-digit number with tens digit a and units digit b is **10a + b**. Reversing the digits gives 10b + a.

- the difference between a number and its reverse is 9 × (difference of the digits)
- the sum of a number and its reverse is 11 × (sum of the digits)

## Worked examples

**Example 1 (warm-up).** A number increased by 15 is four times itself. Find it.

~~~
x + 15 = 4x  →  3x = 15  →  x = 5
~~~

**Example 2 (consecutive numbers).** The sum of three consecutive numbers is 72. Let them be x, x + 1, x + 2: 3x + 3 = 72, so x = 23. The numbers are **23, 24, 25**. Shortcut: the middle number is the sum divided by 3.

**Example 3 (fractions).** One-third of a number is 12 more than one-fifth of it.

~~~
x/3 − x/5 = 12  →  2x/15 = 12  →  x = 90
~~~

**Example 4 (digits).** The digits of a two-digit number add to 9. Reversing the digits increases the number by 27. Find the number.

~~~
digits a, b with a + b = 9
reversed − original = 9(b − a) = 27  →  b − a = 3
a = 3, b = 6  →  number 36
~~~

Check: 63 − 36 = 27.

**Example 5 (product and sum).** Two numbers have sum 15 and product 56. They are the roots of t² − 15t + 56 = 0, which factors as (t − 7)(t − 8). The numbers are **7 and 8**.

## Use the options

When the question gives options, test each one in the conditions. For digit questions this is often the fastest route.

## Traps in this topic

- writing "5 less than x" as 5 − x (it's x − 5)
- forgetting that consecutive **even** numbers step by 2
- for digit questions, using ab instead of 10a + b

## Practice

1. The sum of two numbers is 40 and their difference is 8. Find the smaller
2. The sum of four consecutive even numbers is 60. Find the largest
3. A number's half exceeds its quarter by 7. Find the number

**Answers:** 1) (40 − 8)/2 = **16**. 2) x + (x+2) + (x+4) + (x+6) = 60 gives x = 12, so the largest is **18**. 3) x/2 − x/4 = 7 gives x = **28**.`,
    sources: [KHAN_ALG],
    remember: [
      "Translate words into an equation first: 'less than' reverses the order",
      "Larger = (sum + difference)/2; smaller = (sum − difference)/2",
      "Two-digit number = 10a + b; number minus its reverse = 9 × (digit difference)",
      "Consecutive even or odd numbers step by 2",
      "Sum and product known: the numbers are roots of t² − (sum)t + product = 0",
    ],
    quick: { question: "A number increased by 15 is four times itself. What is the number?", options: ["5", "3", "15", "60"], answer: 0, explanation: "x + 15 = 4x gives x = 5." },
    questions: [
      { q: "The sum of three consecutive numbers is 72. What is the largest?", o: ["25", "24", "23", "26"], a: 0, e: "Middle = 72/3 = 24, so 23, 24, 25." },
      { q: "One-third of a number exceeds one-fifth of it by 12. Find the number.", o: ["90", "60", "45", "180"], a: 0, e: "x/3 − x/5 = 2x/15 = 12, so x = 90." },
      { q: "A two-digit number's digits add to 9; reversing increases it by 27. Find it.", o: ["36", "63", "45", "27"], a: 0, e: "9(b − a) = 27 gives b − a = 3 with a + b = 9: 36." },
      { q: "Two numbers have sum 15 and product 56. Which are they?", o: ["7 and 8", "6 and 9", "5 and 10", "4 and 11"], a: 0, e: "7 + 8 = 15 and 7 × 8 = 56." },
    ],
    visual: {
      plain: "A number problem is a riddle in disguise. Replace 'a number' with a box, write down each clue as a line of maths, and the box's value drops out.",
      diagram: `flowchart LR
  W["a number increased by 15<br/>is four times itself"] --> E["x + 15 = 4x"] --> S["3x = 15"] --> A["x = 5"]`,
      caption: "Words → equation → answer.",
    },
  },
  {
    slug: "races-and-games",
    title: "Races and Games",
    description: "Head starts, beating by distance or time, and comparing three runners.",
    minutes: 25,
    theory: `Race questions are speed-distance-time questions with a story: one runner beats another by some metres or seconds, or gets a head start. Once you translate the story into "when A covers this much, B covers that much", they become ratio questions.

## Start here: the language of races

| Phrase | Meaning |
|---|---|
| A beats B by 20 m in a 100 m race | when A finishes 100 m, B has run 80 m |
| A beats B by 5 seconds | B finishes 5 seconds after A |
| A gives B a start of 10 m | B starts 10 m ahead (runs only 90 m of 100) |
| a dead heat | both finish at the same moment |

The key fact: in the same time, distances are in the ratio of speeds.

## Beating by distance

"A beats B by 20 m in a 100 m race" means speed of A : speed of B = 100 : 80 = 5 : 4.

## Beating by time

If A runs 100 m in 20 s and beats B by 5 s, B takes 25 s. In those last 5 s, B covers 5 × (100/25) = 20 m, so A also beats B by **20 m**. Distance margin = B's speed × time margin.

## Head starts

If A runs 1000 m while B runs 900 m in the same time, then for a dead heat in a 1000 m race A must give B a start of 100 m.

## Three runners

"A beats B by 10 m and B beats C by 10 m in 100 m races." By how much does A beat C?

~~~
when A runs 100, B runs 90
when B runs 100, C runs 90, so when B runs 90, C runs 90 × 90/100 = 81
A beats C by 100 − 81 = 19 m (not 20)
~~~

The margins multiply as ratios; they don't add.

## Worked examples

**Example 1 (warm-up).** In a 200 m race A beats B by 40 m. When A finishes, how far has B run? **160 m**.

**Example 2.** A runs 1 km in 4 minutes and B in 5 minutes. By how many metres does A beat B? In 4 minutes B runs 4/5 of a km = 800 m. A wins by **200 m**.

**Example 3.** A can run 100 m in 18 s and B in 20 s. What start should A give B so they finish together? In 18 s B covers 100 × 18/20 = 90 m, so A gives a start of **10 m**.

**Example 4 (test level).** In a 500 m race the ratio of speeds of A and B is 3 : 4. A has a start of 140 m. Who wins and by how much?

~~~
A runs 360 m (500 − 140). Time for A = 360/3k = 120/k
In that time B runs 4k × 120/k = 480 m
B is 20 m short, so A wins by 20 m
~~~

## Games of points

"In a game of 100 points, A can give B 20 points" means when A scores 100, B scores 80. Treat points like metres.

## Traps in this topic

- adding margins for three runners instead of multiplying the ratios
- forgetting that a head start shortens the distance the receiver runs
- mixing up "beats by time" and "beats by distance"

## Practice

1. In a 100 m race, A beats B by 25 m. Ratio of speeds A : B?
2. A beats B by 6 s in a 120 m race, B taking 30 s. By how many metres does A win?
3. In 100 m races A beats B by 20 m and B beats C by 25 m. By how much does A beat C?

**Answers:** 1) 100 : 75 = **4 : 3**. 2) B's speed 4 m/s; 4 × 6 = **24 m**. 3) when A runs 100, B runs 80, C runs 80 × 0.75 = 60, so **40 m**.`,
    sources: [WIKI_SPEED],
    remember: [
      "In equal time, distances are in the ratio of speeds",
      "'Beats by x m in a d m race': when A runs d, B runs d − x",
      "Margin in metres = slower runner's speed × margin in seconds",
      "Three runners: multiply the ratios, don't add the margins",
      "A head start shortens the receiver's race",
    ],
    quick: { question: "In 100 m races A beats B by 10 m and B beats C by 10 m. By how much does A beat C?", options: ["19 m", "20 m", "10 m", "18 m"], answer: 0, explanation: "When A runs 100, B runs 90 and C runs 90 × 0.9 = 81." },
    questions: [
      { q: "A runs 1 km in 4 min and B in 5 min. By how many metres does A beat B?", o: ["200 m", "250 m", "100 m", "800 m"], a: 0, e: "In 4 minutes B runs 800 m." },
      { q: "A runs 100 m in 18 s and B in 20 s. What start should A give B for a dead heat?", o: ["10 m", "20 m", "2 m", "18 m"], a: 0, e: "In 18 s B covers 90 m." },
      { q: "In a 100 m race A beats B by 25 m. Speed ratio A : B?", o: ["4 : 3", "3 : 4", "5 : 4", "4 : 1"], a: 0, e: "When A runs 100 m, B runs 75 m: 100 : 75 = 4 : 3." },
      { q: "A beats B by 6 s in a 120 m race; B takes 30 s. Margin in metres?", o: ["24 m", "20 m", "30 m", "6 m"], a: 0, e: "B's speed is 4 m/s; 4 × 6 = 24 m." },
    ],
    visual: {
      plain: "Freeze the race at the moment the winner crosses the line, and look where everyone else is. That snapshot is all a race question needs.",
      diagram: `flowchart LR
  A["A finishes: 100 m"] --> S["snapshot"]
  S --> B["B at 90 m"]
  S --> C["C at 81 m"]`,
      caption: "Margins multiply: 90% of 90% is 81%.",
    },
  },
  {
    slug: "heights-and-distances",
    title: "Heights and Distances",
    description: "Angles of elevation and depression with tan 30°, 45° and 60°.",
    minutes: 25,
    theory: `Height and distance questions describe someone looking up at a tower or down from a cliff, and ask for a height or a distance. Nearly all of them are solved with one ratio, **tan**, and three angle values.

## Start here: the right triangle

Picture a tower standing straight up, the ground running flat to the observer, and the line of sight from the observer to the top. Those three lines form a right triangle.

| Side | In the picture |
|---|---|
| opposite | the tower's height |
| adjacent | the distance along the ground |
| hypotenuse | the line of sight |

~~~
tan(angle) = opposite / adjacent = height / distance
~~~

## Angles of elevation and depression

- **Angle of elevation:** looking **up** from the horizontal to the top of an object
- **Angle of depression:** looking **down** from the horizontal to an object below
- The angle of depression from the top equals the angle of elevation from the bottom (alternate angles)

## The three values to memorise

| Angle | tan | sin | cos |
|---|---|---|---|
| 30° | 1/√3 ≈ 0.577 | 1/2 | √3/2 |
| 45° | 1 | 1/√2 | 1/√2 |
| 60° | √3 ≈ 1.732 | √3/2 | 1/2 |

At 45°, height and distance are equal. At 60° the height is √3 times the distance; at 30° it's the distance divided by √3.

## Method step by step

1. Draw the picture and mark the right angle
2. Label the known side and the side you want
3. Write tan(angle) = height / distance and solve

## Worked examples

**Example 1 (warm-up).** From 40 m away, the angle of elevation of a tower's top is 45°. Height = 40 × tan 45° = **40 m**.

**Example 2.** A tower is 30 m tall. The angle of elevation from a point is 60°. Distance = 30 / √3 = **10√3 m ≈ 17.3 m**.

**Example 3 (depression).** From the top of a 50 m cliff, the angle of depression of a boat is 30°. tan 30° = 50 / d, so d = 50√3 ≈ **86.6 m**.

**Example 4 (two observations).** The angle of elevation of a tower's top changes from 30° to 60° as you walk 40 m towards it. Find the height.

~~~
from the near point: h = d√3
from the far point:  h = (d + 40)/√3
d√3 = (d + 40)/√3  →  3d = d + 40  →  d = 20
h = 20√3 ≈ 34.6 m
~~~

Two observations of the same top give two equations; set the heights equal.

## Shadows and ladders

- A pole's shadow is a ground distance: tan(sun's elevation) = pole / shadow
- A ladder leaning on a wall is the hypotenuse; use sin or cos when the ladder's length is given: height reached = ladder × sin(angle)

## Traps in this topic

- using the line of sight (hypotenuse) where the ground distance belongs
- mixing up tan 30° and tan 60°
- forgetting to rationalise: 30/√3 = 10√3

## Practice

1. A 20 m pole casts a 20 m shadow. What's the sun's elevation?
2. A 10 m ladder makes 60° with the ground. How high up the wall does it reach?
3. From 30 m away the elevation of a building's top is 30°. Height?

**Answers:** 1) tan = 1, so **45°**. 2) 10 × sin 60° = **5√3 ≈ 8.66 m**. 3) 30/√3 = **10√3 ≈ 17.3 m**.`,
    sources: [WIKI_TRIG, KHAN_TRIG],
    remember: [
      "tan(angle) = height / ground distance",
      "tan 30° = 1/√3, tan 45° = 1, tan 60° = √3",
      "At 45°, height equals distance",
      "Depression from the top = elevation from the bottom",
      "Two observations: write h twice and set them equal",
    ],
    quick: { question: "From 40 m away, the elevation of a tower's top is 45°. How tall is the tower?", options: ["40 m", "40√3 m", "20 m", "80 m"], answer: 0, explanation: "tan 45° = 1, so height = distance." },
    questions: [
      { q: "A 30 m tower; elevation 60°. Distance from the base?", o: ["10√3 m", "30√3 m", "15 m", "60 m"], a: 0, e: "tan 60° = √3 = 30/d, so d = 30/√3 = 10√3 m." },
      { q: "From a 50 m cliff, depression to a boat is 30°. Distance?", o: ["50√3 m", "50/√3 m", "25 m", "100 m"], a: 0, e: "tan 30° = 50/d, so d = 50√3." },
      { q: "A 10 m ladder makes 60° with the ground. Height reached?", o: ["5√3 m", "5 m", "10√3 m", "10 m"], a: 0, e: "The ladder is the hypotenuse: 10 × sin 60° = 5√3 m." },
      { q: "What is tan 60°?", o: ["√3", "1/√3", "1", "1/2"], a: 0, e: "tan 60° = √3 ≈ 1.732." },
    ],
    visual: {
      plain: "Stand back from a tower and look up at its top: the ground, the tower and your line of sight make a right triangle. tan of your looking-up angle is the tower's height divided by how far away you stand.",
      diagram: `flowchart LR
  O["observer"] -->|"ground distance d"| B["base of tower"]
  B -->|"height h"| T["top"]
  O -.->|"line of sight, angle θ"| T
  T --> F["tan θ = h / d"]`,
      caption: "One right triangle, one ratio.",
    },
  },
  {
    slug: "stocks-and-shares",
    title: "Stocks and Shares",
    description: "Face value, market value, dividends, income and rate of return.",
    minutes: 25,
    theory: `When a company needs money, it divides its ownership into small units called shares and sells them. Owners of shares receive a part of the profit called a **dividend**. Test questions ask how much income an investment gives, or what return it earns.

## Start here: the words

| Term | Meaning |
|---|---|
| face value (FV), par value | the printed value of a share, often ₹10 or ₹100 |
| market value (MV) | the price at which the share is bought or sold today |
| at par | MV = FV |
| at a premium (above par) | MV > FV |
| at a discount (below par) | MV < FV |
| dividend | profit paid per share, always a percentage of **face value** |
| brokerage | a fee for buying or selling, usually a % of market value |

"A 10% stock at 120" means: dividend is 10% of face value ₹100 = ₹10 per share, and each share costs ₹120.

## The formulas

~~~
dividend per share = dividend% × face value
number of shares   = money invested ÷ market value (cost per share)
annual income      = number of shares × dividend per share
rate of return     = dividend per share ÷ market value × 100
~~~

With brokerage: buying cost per share = MV + brokerage; selling price per share = MV − brokerage.

## Worked examples

**Example 1 (warm-up).** You own 50 shares of face value ₹100 paying 8%. Income = 50 × ₹8 = **₹400**.

**Example 2.** ₹9,600 is invested in a 10% stock at 120. Shares = 9,600 / 120 = 80. Income = 80 × ₹10 = **₹800**.

**Example 3 (return).** A 9% stock is bought at ₹75. Return = 9/75 × 100 = **12%**. Buying below face value raises your return above the dividend rate.

**Example 4 (comparing investments).** Which is better: a 6% stock at 75 or an 8% stock at 120? Returns: 6/75 = 8% and 8/120 ≈ 6.67%. The **6% stock at 75** gives a better return.

**Example 5 (brokerage).** A share with market value ₹96 is bought with 1% brokerage. Cost per share = 96 + 0.96 = **₹96.96**.

## Thinking like an investor

The dividend percentage alone doesn't tell you how good an investment is; what matters is dividend **per rupee you paid**. That's why the rate of return divides by market value, not face value.

## Traps in this topic

- taking the dividend as a percentage of market value (it's always of face value)
- dividing the investment by face value to count shares (use the price paid)
- forgetting brokerage is added when buying and subtracted when selling

## Practice

1. Income from 120 shares (FV ₹10) at a 15% dividend?
2. ₹4,500 invested in a 5% stock at 90. Annual income?
3. Rate of return on a 12% stock bought at ₹150?

**Answers:** 1) ₹1.50 × 120 = **₹180**. 2) 50 shares × ₹5 = **₹250**. 3) 12/150 × 100 = **8%**.`,
    sources: [WIKI_DIV],
    remember: [
      "Dividend is a percentage of face value, never market value",
      "Shares bought = investment ÷ market price",
      "Income = shares × dividend per share",
      "Return % = dividend per share ÷ market price × 100",
      "Brokerage: add when buying, subtract when selling",
    ],
    quick: { question: "₹9,600 is invested in a 10% stock at 120. What is the annual income?", options: ["₹800", "₹960", "₹1,152", "₹1,200"], answer: 0, explanation: "80 shares × ₹10 dividend = ₹800." },
    questions: [
      { q: "A 9% stock is bought at ₹75. What is the rate of return?", o: ["12%", "9%", "6.75%", "15%"], a: 0, e: "Return = dividend ÷ price paid: 9/75 × 100 = 12%." },
      { q: "Which gives the better return: 6% stock at 75 or 8% stock at 120?", o: ["6% stock at 75", "8% stock at 120", "Both equal", "Can't be compared"], a: 0, e: "Returns are 8% and about 6.67%." },
      { q: "A dividend is calculated on…", o: ["face value", "market value", "brokerage", "the investment"], a: 0, e: "Dividends are always a percentage of face value." },
      { q: "50 shares of FV ₹100 at an 8% dividend give an income of…", o: ["₹400", "₹800", "₹4,000", "₹40"], a: 0, e: "Dividend 8% of ₹100 = ₹8 per share; × 50 shares = ₹400." },
    ],
    visual: {
      plain: "Think of a share as a slice of a shop. The printed price on the slice is its face value; what people pay for it today is its market value. Your yearly share of the profit is a fixed percentage of the printed price.",
      diagram: `flowchart LR
  I["money invested ₹9,600"] -->|"÷ market price ₹120"| S["80 shares"]
  S -->|"× dividend ₹10<br/>(10% of face value)"| Y["income ₹800"]`,
      caption: "Shares from the market price, income from the face value.",
    },
  },
  {
    slug: "true-and-bankers-discount",
    title: "True Discount and Banker's Discount",
    description: "Present worth of money due later, true discount, banker's discount and banker's gain.",
    minutes: 25,
    theory: `These questions are about money that's due in the future. ₹1,100 due in a year is worth less than ₹1,100 today, because ₹1,000 today could grow to ₹1,100 with interest. The two kinds of "discount" measure that difference in two different ways.

## Start here: the words

| Term | Meaning |
|---|---|
| amount (A), face value of a bill | the money due on a future date |
| present worth (PW) | the money that, invested today, grows to A by that date |
| true discount (TD) | A − PW, the interest on the present worth |
| banker's discount (BD) | simple interest on the amount A itself |
| banker's gain (BG) | BD − TD |

## The formulas (simple interest, rate R% a year, T years)

~~~
PW = (100 × A) / (100 + R × T)
TD = A − PW = (PW × R × T) / 100
BD = (A × R × T) / 100
BG = BD − TD = (TD × R × T) / 100
~~~

The banker's discount is always larger than the true discount, because it charges interest on the whole amount instead of on the present worth.

## Worked examples

**Example 1 (warm-up).** Find the present worth of ₹1,100 due in 1 year at 10%.

~~~
PW = 100 × 1,100 / (100 + 10) = 1,000
TD = 1,100 − 1,000 = 100
~~~

Check: ₹1,000 at 10% for a year earns ₹100 and becomes ₹1,100.

**Example 2.** Find the banker's discount on a bill of ₹1,100 due in 1 year at 10%. BD = 1,100 × 10 × 1 / 100 = **₹110**.

**Example 3 (banker's gain).** For the same bill, BG = BD − TD = 110 − 100 = **₹10**. Using the formula: TD × R × T / 100 = 100 × 10 / 100 = 10. ✔

**Example 4 (working backwards).** The true discount on a bill due in 2 years at 5% is ₹50. Find the present worth and the amount.

~~~
TD = PW × R × T / 100  →  50 = PW × 5 × 2 / 100  →  PW = 500
A = PW + TD = 550
~~~

**Example 5 (months).** Find the true discount on ₹2,040 due in 6 months at 8% a year. T = 1/2, so R × T = 4.

~~~
PW = 100 × 2,040 / 104 = 1,961.54…
~~~

When the numbers don't divide cleanly, check the question: options are usually rounded, so estimate and pick the nearest.

## Where this shows up

These topics appear in some bank and government tests and in older company papers; most campus tests skip them. Learn the four formulas and the idea that BD is interest on the amount while TD is interest on the present worth, and you can handle any question.

## Traps in this topic

- calculating true discount as interest on the amount (that's the banker's discount)
- forgetting to convert months to years in T
- mixing up which is larger: BD is always greater than TD

## Practice

1. Present worth of ₹2,200 due in 2 years at 5%?
2. Banker's discount on ₹2,200 due in 2 years at 5%?
3. Banker's gain for that bill?

**Answers:** 1) 100 × 2,200 / 110 = **₹2,000** (TD ₹200). 2) 2,200 × 5 × 2 / 100 = **₹220**. 3) 220 − 200 = **₹20**.`,
    sources: [WIKI_PV],
    remember: [
      "Present worth grows into the amount by the due date",
      "PW = 100A / (100 + RT); TD = A − PW",
      "Banker's discount = simple interest on the amount",
      "Banker's gain = BD − TD = interest on the true discount",
      "BD is always more than TD",
    ],
    quick: { question: "What is the present worth of ₹1,100 due in 1 year at 10%?", options: ["₹1,000", "₹990", "₹1,010", "₹1,100"], answer: 0, explanation: "100 × 1,100 / 110 = 1,000." },
    questions: [
      { q: "Banker's discount on ₹1,100 due in 1 year at 10%?", o: ["₹110", "₹100", "₹10", "₹1,000"], a: 0, e: "Simple interest on the amount: 1,100 × 10 / 100." },
      { q: "True discount ₹100 and banker's discount ₹110. Banker's gain?", o: ["₹10", "₹210", "₹110", "₹100"], a: 0, e: "Banker's gain = BD − TD = 110 − 100 = ₹10." },
      { q: "True discount on a bill due in 2 years at 5% is ₹50. Present worth?", o: ["₹500", "₹550", "₹450", "₹1,000"], a: 0, e: "50 = PW × 10 / 100 gives PW = 500." },
      { q: "Which is always larger?", o: ["Banker's discount", "True discount", "They're always equal", "It depends on the bank"], a: 0, e: "BD charges interest on the whole amount, so it exceeds TD." },
    ],
    visual: {
      plain: "₹1,100 due next year is like a seed that will grow into a tree. Its present worth is the size of the seed today. The true discount is how much it grows; the banker's discount is the interest a bank charges on the full-grown tree.",
      diagram: `flowchart LR
  PW["present worth ₹1,000<br/>today"] -->|"10% for 1 year<br/>true discount ₹100"| A["amount ₹1,100<br/>due next year"]
  A -->|"banker's discount<br/>10% of ₹1,100 = ₹110"| BD["banker's gain ₹10"]`,
      caption: "TD is interest on the present worth; BD is interest on the amount.",
    },
  },
];
