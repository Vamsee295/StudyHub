// More quantitative aptitude, from scratch to exam level: simplification, surds/indices/logs, ages, mixtures,
// partnership, remainders and unit digits. Original writing.
import type { FullLesson } from './apt-extra-types';

const WIKI_ORDER = { title: "Wikipedia: Order of operations", url: "https://en.wikipedia.org/wiki/Order_of_operations" };
const KHAN_ARITH = { title: "Khan Academy: Arithmetic (free)", url: "https://www.khanacademy.org/math/arithmetic" };
const WIKI_EXP = { title: "Wikipedia: Exponentiation", url: "https://en.wikipedia.org/wiki/Exponentiation" };
const WIKI_LOG = { title: "Wikipedia: Logarithm", url: "https://en.wikipedia.org/wiki/Logarithm" };
const KHAN_ALGEBRA = { title: "Khan Academy: Algebra 1 (free)", url: "https://www.khanacademy.org/math/algebra" };
const WIKI_ALLIGATION = { title: "Wikipedia: Alligation", url: "https://en.wikipedia.org/wiki/Alligation" };
const WIKI_WAVG = { title: "Wikipedia: Weighted arithmetic mean", url: "https://en.wikipedia.org/wiki/Weighted_arithmetic_mean" };
const WIKI_PARTNER = { title: "Wikipedia: Partnership", url: "https://en.wikipedia.org/wiki/Partnership" };
const WIKI_MOD = { title: "Wikipedia: Modular arithmetic", url: "https://en.wikipedia.org/wiki/Modular_arithmetic" };
const WIKI_FERMAT = { title: "Wikipedia: Fermat's little theorem", url: "https://en.wikipedia.org/wiki/Fermat%27s_little_theorem" };

export const moreQuant: FullLesson[] = [
  {
    slug: "simplification-and-approximation",
    title: "Simplification and Approximation",
    description: "BODMAS, fractions, fast multiplication tricks and approximating ugly numbers.",
    minutes: 25,
    theory: `Simplification questions give a long expression and five close options. Approximation questions give ugly decimals and ask for the nearest value. Both reward two skills: doing operations in the right order, and calculating fast without a calculator.

## Start here: the order of operations (BODMAS)

1. **B**rackets: innermost first, ( ) then { } then [ ]
2. **O**rders: powers and roots
3. **D**ivision and **M**ultiplication, left to right
4. **A**ddition and **S**ubtraction, left to right

~~~
18 + 24 ÷ 6 × 2 − 5
= 18 + 4 × 2 − 5      (÷ first, it comes first from the left)
= 18 + 8 − 5 = 21
~~~

"Of" means multiply and is done before division in older textbooks: 3/4 of 2/3 of 960 = 960 × 2/3 × 3/4 = **480**.

## Tables to know cold

- squares 1 to 30 and cubes 1 to 15
- fractions as percentages: 1/2 = 50%, 1/3 = 33.33%, 1/4 = 25%, 1/5 = 20%, 1/6 = 16.67%, 1/7 = 14.28%, 1/8 = 12.5%, 1/9 = 11.11%, 1/11 = 9.09%, 1/12 = 8.33%
- square roots of perfect squares from their last digit and size: √1764: 40² = 1600 and 45² = 2025, last digit 4 means the root ends in 2 or 8, so 42 (42² = 1764)

## Fast multiplication

| Trick | Example |
|---|---|
| × 5 = × 10 ÷ 2 | 68 × 5 = 680 ÷ 2 = 340 |
| × 25 = × 100 ÷ 4 | 48 × 25 = 4800 ÷ 4 = 1200 |
| × 11: write the digits with their sum between | 43 × 11 = 4(4+3)3 = 473 |
| near a round number | 998 × 23 = 23000 − 46 = 22954 |
| squares near 50: (25 ± d) then d² | 47² = (25 − 3) 09 = 2209; 53² = (25 + 3) 09 = 2809 |
| (a + b)(a − b) = a² − b² | 102 × 98 = 10000 − 4 = 9996 |

## Approximation: round, then calculate

Round each number to something round and friendly, keeping the error small, then compute:

~~~
39.97% of 600.12 + 14.98 × 7.03
≈ 40% of 600 + 15 × 7
= 240 + 105 = 345
~~~

When rounding a product, round one number up and the other down to cancel errors. When options are far apart, rough rounding is enough; when they're close, keep one decimal.

## Check with digit sums

Replace each number by its digit sum (repeat until one digit); the same operations on digit sums must match the answer's digit sum. 123 × 45: digit sums 6 × 9 = 54 → 9. The true answer 5535 → 5 + 5 + 3 + 5 = 18 → 9. It matches, so 5535 is plausible; an option with a different digit sum is wrong.

## Traps in this topic

- doing multiplication before an earlier division (they share a level: go left to right)
- dropping a negative sign inside brackets
- rounding every number the same way, which compounds the error

## Practice

1. 64 ÷ 8 × 2 + 3² − 4
2. 15% of 480 + 25% of 360
3. 998 × 23
4. 1999.8 ÷ 39.9 ≈ ?

**Answers:** 1) 8 × 2 + 9 − 4 = **21**. 2) 72 + 90 = **162**. 3) **22954**. 4) 2000 ÷ 40 = **50**.`,
    sources: [WIKI_ORDER, KHAN_ARITH],
    remember: [
      "Brackets, powers, then ÷ and × left to right, then + and − left to right",
      "Know squares to 30, cubes to 15 and the fraction–percentage table",
      "× 25 = × 100 ÷ 4; × 11 puts the digit sum in the middle",
      "Approximate by rounding to round numbers; round one factor up and the other down",
      "Digit sums catch wrong options quickly",
    ],
    quick: {
      question: "Simplify 18 + 24 ÷ 6 × 2 − 5",
      options: ["21", "9", "13", "25"],
      answer: 0,
      explanation: "24 ÷ 6 = 4, × 2 = 8, then 18 + 8 − 5 = 21.",
    },
    questions: [
      { q: "What is 3/4 of 2/3 of 960?", o: ["480", "640", "720", "360"], a: 0, e: "960 × 2/3 = 640, × 3/4 = 480." },
      { q: "Approximately, 39.97% of 600.12 + 14.98 × 7.03 = ?", o: ["345", "300", "390", "255"], a: 0, e: "≈ 40% of 600 + 15 × 7 = 240 + 105 = 345." },
      { q: "What is 47²?", o: ["2209", "2109", "2409", "2249"], a: 0, e: "47 = 50 − 3: (25 − 3) = 22 followed by 3² = 09, so 2209." },
      { q: "What is √1764?", o: ["42", "38", "44", "48"], a: 0, e: "It lies between 40 and 45 and ends in 2 or 8; 42² = 1764." },
    ],
    visual: {
      plain: "BODMAS is a queue at a ticket counter. Brackets have VIP passes, powers come next, then division and multiplication take turns in the order they arrived, and addition and subtraction go last.",
      diagram: `flowchart LR
  B["Brackets"] --> O["Orders<br/>powers, roots"] --> DM["divide and multiply<br/>left to right"] --> AS["add and subtract<br/>left to right"]`,
      caption: "Operations on the same level go strictly left to right.",
    },
  },
  {
    slug: "surds-indices-and-logarithms",
    title: "Surds, Indices and Logarithms",
    description: "Laws of exponents, simplifying and rationalising surds, and logarithm rules.",
    minutes: 30,
    theory: `Indices (powers), surds (roots that don't come out exactly) and logarithms are three views of the same idea. A handful of laws solves nearly every test question.

## Start here: indices

aⁿ means a multiplied by itself n times. The laws:

| Law | Example |
|---|---|
| aᵐ × aⁿ = aᵐ⁺ⁿ | 2³ × 2⁴ = 2⁷ = 128 |
| aᵐ ÷ aⁿ = aᵐ⁻ⁿ | 5⁶ ÷ 5⁴ = 5² = 25 |
| (aᵐ)ⁿ = aᵐⁿ | (3²)³ = 3⁶ = 729 |
| (ab)ⁿ = aⁿbⁿ | (2 × 5)³ = 1000 |
| a⁰ = 1 (a ≠ 0) | 7⁰ = 1 |
| a⁻ⁿ = 1 / aⁿ | 2⁻³ = 1/8 |
| a^(1/n) = the n-th root of a | 8^(1/3) = 2 |
| a^(m/n) = (n-th root of a)ᵐ | 16^(3/4) = 2³ = 8 |

## Solving exponential equations: make the bases equal

~~~
2^(x + 1) = 32 = 2⁵      →  x + 1 = 5  →  x = 4
9^x = 27  →  3^(2x) = 3³  →  x = 3/2
(0.25)^(−1/2) = (1/4)^(−1/2) = 4^(1/2) = 2
~~~

## Surds

- √a × √b = √(ab): √2 × √8 = √16 = 4
- √(a²b) = a√b: √72 = √(36 × 2) = 6√2
- like surds add: 3√5 + 2√5 = 5√5 (but √2 + √3 is not √5)

**Rationalising** removes a root from the denominator by multiplying by the conjugate:

~~~
1 / (√3 + √2) = (√3 − √2) / (3 − 2) = √3 − √2
1 / (√5 − 2) = (√5 + 2) / (5 − 4) = √5 + 2
~~~

**Comparing surds:** square both sides. √5 + √3 versus √6 + √2: squares are 8 + 2√15 and 8 + 2√12, and √15 > √12, so √5 + √3 is larger.

## Logarithms

log_b(x) = y means bʸ = x: the log is the power. log₂ 64 = 6 because 2⁶ = 64; log₁₀ 0.001 = −3.

| Rule | Example |
|---|---|
| log(ab) = log a + log b | log 25 + log 4 = log 100 = 2 |
| log(a/b) = log a − log b | log 50 − log 5 = log 10 = 1 |
| log(aⁿ) = n log a | log 8 = 3 log 2 |
| log_b b = 1, log 1 = 0 | log₇ 7 = 1 |
| change of base: log_b a = log a / log b | log₄ 8 = log 8 / log 4 = 3/2 |

Here log means log₁₀. With log 2 ≈ 0.3010 and log 3 ≈ 0.4771 you can find many others: log 8 = 0.9030, log 6 = 0.7781, log 5 = 1 − 0.3010 = 0.6990.

## Number of digits

A positive number N has floor(log N) + 1 digits. 2³⁰: 30 × 0.30103 = 9.03, so **10** digits (2³⁰ = 1,073,741,824).

## Traps in this topic

- adding exponents when the bases differ (2³ × 3² isn't 6⁵)
- √(a + b) is not √a + √b
- log(a + b) is not log a + log b
- forgetting that a negative exponent means a reciprocal, not a negative number

## Practice

1. 16^(3/4)
2. log₃ 81
3. log 25 + log 4
4. Rationalise 1 / (√5 − 2)

**Answers:** 1) **8**. 2) 3⁴ = 81, so **4**. 3) log 100 = **2**. 4) **√5 + 2**.`,
    sources: [WIKI_EXP, WIKI_LOG, KHAN_ALGEBRA],
    remember: [
      "Same base: multiply → add exponents, divide → subtract, power of power → multiply",
      "a⁰ = 1, a⁻ⁿ = 1/aⁿ, a^(m/n) = (n-th root of a)ᵐ",
      "Rationalise with the conjugate: (√a + √b)(√a − √b) = a − b",
      "log(ab) = log a + log b; log(aⁿ) = n log a; log_b a = log a / log b",
      "Digits of N = floor(log N) + 1",
    ],
    quick: {
      question: "If 2^(x + 1) = 32, what is x?",
      options: ["4", "5", "16", "3"],
      answer: 0,
      explanation: "32 = 2⁵, so x + 1 = 5 and x = 4.",
    },
    questions: [
      { q: "What is 16^(3/4)?", o: ["8", "12", "4", "64"], a: 0, e: "The fourth root of 16 is 2, and 2³ = 8." },
      { q: "What is log 25 + log 4 (base 10)?", o: ["2", "29", "1", "log 29"], a: 0, e: "log 25 + log 4 = log 100 = 2." },
      { q: "1 / (√3 + √2) equals…", o: ["√3 − √2", "√3 + √2", "1/√5", "√6"], a: 0, e: "Multiply by the conjugate: (√3 − √2) / (3 − 2)." },
      { q: "How many digits does 2³⁰ have? (log 2 ≈ 0.30103)", o: ["10", "9", "30", "11"], a: 0, e: "30 × 0.30103 = 9.03; floor(9.03) + 1 = 10." },
    ],
    visual: {
      plain: "A power, a root and a log are three questions about the same fact, 2⁶ = 64. Power asks 2 to the 6 is what; root asks what number to the 6 is 64; log asks what power of 2 gives 64.",
      diagram: `flowchart LR
  F["2⁶ = 64"] --> P["power: 2⁶ = ?<br/>64"]
  F --> R["root: ⁶√64 = ?<br/>2"]
  F --> L["log: log₂ 64 = ?<br/>6"]`,
      caption: "One fact, three ways of asking about it.",
    },
  },
  {
    slug: "problems-on-ages",
    title: "Problems on Ages",
    description: "Present, past and future ages, ratios, and the constant age gap.",
    minutes: 20,
    theory: `Age problems are linear equations in disguise. The one fact that unlocks them: **the difference between two people's ages never changes**. Everyone gets older at the same rate.

## Start here: translate the words

| Phrase | Write |
|---|---|
| present age | x |
| n years ago | x − n |
| after n years, n years hence | x + n |
| A is twice as old as B | A = 2B |
| ratio of ages is 5 : 3 | A = 5k, B = 3k |

Choose variables for **present** ages, then express every other time in terms of them.

## Worked example 1: twice and thrice

A father is three times as old as his son. In 10 years he'll be twice as old. Present ages?

~~~
son = s, father = 3s
3s + 10 = 2(s + 10)
3s + 10 = 2s + 20  →  s = 10
~~~

Son **10**, father **30**. Check: in 10 years, 40 = 2 × 20.

## Worked example 2: ratios

The ratio of A's age to B's is 5 : 3. Four years ago it was 3 : 1.

~~~
A = 5k, B = 3k
(5k − 4) / (3k − 4) = 3 / 1
5k − 4 = 9k − 12  →  k = 2
~~~

A = **10**, B = **6**. Check: four years ago 6 : 2 = 3 : 1.

## Worked example 3: children born at equal gaps

Five children born 3 years apart have ages summing to 50. The youngest is x:

~~~
x + (x + 3) + (x + 6) + (x + 9) + (x + 12) = 50
5x + 30 = 50  →  x = 4
~~~

## Worked example 4: averages with a new person

Ten students average 15 years. With the teacher included, the average is 16. Teacher's age = 16 × 11 − 15 × 10 = 176 − 150 = **26**.

## Shortcut: use the options

With answer options, plug each into the conditions. It's often faster than setting up equations, especially for ratio questions.

## Traps in this topic

- writing the condition at the wrong time (present versus "after n years")
- adding n years to only one person
- in ratio questions, applying the ratio to the years added

## Practice

1. A is 6 years older than B. In 4 years their ages will add up to 40. Find A's age now
2. Ages are in the ratio 4 : 5. After 6 years the ratio is 6 : 7. Find the present ages
3. A mother is four times her daughter's age. In 16 years she'll be twice her daughter's age. Find the daughter's age

**Answers:** 1) A + B = 32 and A − B = 6, so A = **19**. 2) (4k + 6)/(5k + 6) = 6/7 gives k = 3: **12 and 15**. 3) 4d + 16 = 2(d + 16) gives d = **8**.`,
    sources: [KHAN_ALGEBRA],
    remember: [
      "The age difference between two people never changes",
      "Use variables for present ages; n years ago is x − n, after n years x + n",
      "Ratio a : b → ages ak and bk",
      "Add the years to everyone in the question",
      "With options, plugging in is often fastest",
    ],
    quick: {
      question: "A father is 3 times his son's age; in 10 years he'll be twice the son's age. How old is the son now?",
      options: ["10", "15", "20", "5"],
      answer: 0,
      explanation: "3s + 10 = 2(s + 10) gives s = 10.",
    },
    questions: [
      { q: "A : B = 5 : 3 now; 4 years ago it was 3 : 1. What is A's age now?", o: ["10", "15", "20", "12"], a: 0, e: "(5k − 4)/(3k − 4) = 3 gives k = 2, so A = 10." },
      { q: "Five children born 3 years apart have ages summing to 50. The youngest is…", o: ["4", "5", "6", "2"], a: 0, e: "5x + 30 = 50 gives x = 4." },
      { q: "10 students average 15 years; with the teacher the average is 16. Teacher's age?", o: ["26", "16", "31", "25"], a: 0, e: "16 × 11 − 15 × 10 = 26." },
      { q: "A is 6 years older than B. In 4 years their ages sum to 40. A's present age?", o: ["19", "13", "23", "17"], a: 0, e: "A + B = 32 and A − B = 6, so A = 19." },
    ],
    visual: {
      plain: "Two people's ages are two cars on a road driving at exactly the same speed: the gap between them stays fixed forever. Only the ratio changes as both cars move on.",
      diagram: `flowchart LR
  N["now: son 10, father 30<br/>gap 20, ratio 1 : 3"] -->|"+10 years"| L["later: 20 and 40<br/>gap 20, ratio 1 : 2"]`,
      caption: "The gap stays 20; the ratio moves toward 1.",
    },
  },
  {
    slug: "mixtures-and-alligation",
    title: "Mixtures and Alligation",
    description: "Mixing at a mean price, changing concentrations, and repeated replacement.",
    minutes: 25,
    theory: `Mixture questions combine two things of different price or strength (rice at two prices, milk and water, acid solutions). The tool that solves most of them in seconds is **alligation**, a shortcut for weighted averages.

## Start here: the weighted average

Mixing 2 kg at ₹40 with 3 kg at ₹60 gives (2 × 40 + 3 × 60) / 5 = ₹52 per kg. The mixture's price always lies between the two prices, closer to the one there's more of.

## The alligation rule

To get a mean price m from a cheaper item (price c) and a dearer item (price d):

~~~
cheaper quantity : dearer quantity = (d − m) : (m − c)
~~~

Draw it as a cross:

~~~
  c = 40        d = 60
        m = 52
  60 − 52 = 8   52 − 40 = 12
  ratio 8 : 12 = 2 : 3 (cheaper : dearer)
~~~

The same rule works for concentrations, speeds, or any average.

## Worked example 1: changing a ratio by adding water

60 litres of milk and water are in the ratio 2 : 1. How much water must be added to make it 1 : 2?

~~~
milk = 40, water = 20
milk stays 40; we need water = 2 × 40 = 80
add 80 − 20 = 60 litres
~~~

Keep the quantity that **doesn't change** fixed and work from it.

## Worked example 2: strengthening a solution

20 litres of 30% acid. How much pure acid makes it 50%?

~~~
acid now = 6 litres
(6 + x) / (20 + x) = 0.5  →  12 + 2x = 20 + x  →  x = 8 litres
~~~

## Worked example 3: repeated replacement

A vessel holds 40 litres of pure milk. 4 litres are taken out and replaced with water, three times. Milk left:

~~~
milk = 40 × (1 − 4/40)³ = 40 × 0.9³ = 40 × 0.729 = 29.16 litres
~~~

General rule: after n replacements of r litres from a vessel of V litres, the original liquid left is V × (1 − r/V)ⁿ.

## Worked example 4: the dishonest milkman

A milkman sells a mixture at the cost price of milk and gains 25%. Water is free, so he sells 1.25 litres for the price of 1 litre of milk: water : milk = 0.25 : 1 = **1 : 4**.

## Traps in this topic

- putting the alligation ratio the wrong way round: (d − m) goes with the **cheaper** item
- changing both quantities when only one changes
- using (1 − r/V) × n instead of (1 − r/V)ⁿ for repeated replacement

## Practice

1. Tea at ₹30 and ₹45 per kg is mixed to sell at ₹40 (cost). In what ratio?
2. 20 litres of 30% acid: how much pure acid makes it 50%?
3. 80 litres of wine; 8 litres replaced with water, twice. Wine left?

**Answers:** 1) (45 − 40) : (40 − 30) = **1 : 2**. 2) **8 litres**. 3) 80 × 0.9² = **64.8 litres**.`,
    sources: [WIKI_ALLIGATION, WIKI_WAVG],
    remember: [
      "A mixture's value lies between its parts, nearer the larger quantity",
      "Alligation: cheaper : dearer = (dearer − mean) : (mean − cheaper)",
      "Fix the quantity that doesn't change and work from it",
      "Repeated replacement: left = V × (1 − r/V)ⁿ",
    ],
    quick: {
      question: "Rice at ₹40/kg and ₹60/kg is mixed to make ₹52/kg. In what ratio (cheaper : dearer)?",
      options: ["2 : 3", "3 : 2", "1 : 2", "2 : 1"],
      answer: 0,
      explanation: "(60 − 52) : (52 − 40) = 8 : 12 = 2 : 3.",
    },
    questions: [
      { q: "60 L of milk and water in ratio 2 : 1. How much water must be added to make it 1 : 2?", o: ["60 L", "40 L", "20 L", "80 L"], a: 0, e: "Milk stays 40, so water must be 80: add 60." },
      { q: "40 L of pure milk; 4 L replaced with water three times. Milk left?", o: ["29.16 L", "28 L", "30 L", "32.4 L"], a: 0, e: "Each replacement keeps 9/10 of the milk: 40 × (0.9)³ = 29.16 L." },
      { q: "A milkman sells mixture at the cost price of milk and gains 25%. Water : milk?", o: ["1 : 4", "1 : 5", "1 : 3", "4 : 1"], a: 0, e: "He sells 1.25 L for the price of 1 L of milk: 0.25 : 1." },
      { q: "20 L of 30% acid. How much pure acid makes it 50%?", o: ["8 L", "10 L", "4 L", "6 L"], a: 0, e: "(6 + x)/(20 + x) = 0.5 gives x = 8." },
    ],
    visual: {
      plain: "Alligation is a see-saw. The mean price sits at the pivot; each price's distance from the pivot tells you how much of the other item you need to balance it.",
      diagram: `flowchart TB
  C["cheaper ₹40"] --> M["mean ₹52"]
  D["dearer ₹60"] --> M
  M --> R["cheaper : dearer<br/>(60 − 52) : (52 − 40) = 2 : 3"]`,
      caption: "The difference on one side gives the quantity of the other.",
    },
  },
  {
    slug: "partnership",
    title: "Partnership",
    description: "Sharing profit by capital × time, partners joining late, and changing investments.",
    minutes: 20,
    theory: `When people invest in a business together, profit is shared in proportion to **how much each invested and for how long**. That single rule, capital × time, solves almost every partnership question.

## Start here

~~~
share ratio = (capital₁ × time₁) : (capital₂ × time₂) : …
~~~

If everyone invests for the same time, the ratio is the ratio of capitals.

## Worked example 1: different capital, different time

A invests ₹10,000 for the whole year. B joins after 3 months with ₹12,000. The year's profit is ₹19,000.

~~~
A = 10,000 × 12 = 1,20,000
B = 12,000 × 9  = 1,08,000
ratio 120 : 108 = 10 : 9
A gets 19,000 × 10/19 = ₹10,000; B gets ₹9,000
~~~

## Worked example 2: capital that changes

A starts with ₹20,000 and withdraws ₹5,000 after 6 months. Her capital × time for the year:

~~~
20,000 × 6 + 15,000 × 6 = 1,20,000 + 90,000 = 2,10,000
~~~

Split the year into periods where capital is constant, then add.

## Worked example 3: working partner

A runs the business and first takes 10% of the profit as a salary; the rest is shared by capital. With ₹50,000 profit and capitals equal: A gets 5,000 + 22,500 = **₹27,500**, B gets ₹22,500. Always take the salary or commission out before sharing.

## Worked example 4: finding a missing time

A invests ₹6,000 for 12 months; B invests ₹8,000 and the profit is shared 9 : 8. For how long did B invest?

~~~
6,000 × 12 : 8,000 × t = 9 : 8
72,000 × 8 = 9 × 8,000 × t  →  t = 8 months
~~~

## Traps in this topic

- forgetting to multiply by time when partners join at different months
- counting months from the start of the year when someone joins "after 3 months" (they invest for 9)
- sharing the whole profit when part of it is a salary

## Practice

1. Capitals in the ratio 2 : 3 : 5 for the same time; profit ₹50,000. C's share?
2. A invests ₹8,000 for 9 months, B ₹6,000 for 12 months. Ratio of profits?
3. A puts in 3x for 4 months, B 2x for 9 months. Profit ₹25,000. A's share?

**Answers:** 1) 5/10 × 50,000 = **₹25,000**. 2) 72,000 : 72,000 = **1 : 1**. 3) 12x : 18x = 2 : 3, so A gets **₹10,000**.`,
    sources: [WIKI_PARTNER],
    remember: [
      "Profit ratio = capital × time for each partner",
      "Joining after m months of a 12-month year means 12 − m months invested",
      "Split changing capital into constant periods and add",
      "Remove salaries or commissions before sharing the rest",
    ],
    quick: {
      question: "A invests ₹10,000 for 12 months; B ₹12,000 for 9 months. Profit ₹19,000. A's share?",
      options: ["₹10,000", "₹9,000", "₹9,500", "₹12,000"],
      answer: 0,
      explanation: "1,20,000 : 1,08,000 = 10 : 9, so A gets 10/19 of 19,000.",
    },
    questions: [
      { q: "A starts with ₹20,000 and withdraws ₹5,000 after 6 months. Capital × months for the year?", o: ["2,10,000", "2,40,000", "1,80,000", "1,50,000"], a: 0, e: "20,000 × 6 + 15,000 × 6." },
      { q: "A: ₹6,000 for 12 months; B: ₹8,000; profits 9 : 8. For how many months did B invest?", o: ["8", "9", "6", "12"], a: 0, e: "72,000 : 8,000t = 9 : 8 gives t = 8." },
      { q: "Capitals 2 : 3 : 5, same time, profit ₹50,000. C's share?", o: ["₹25,000", "₹15,000", "₹10,000", "₹20,000"], a: 0, e: "C's share is 5 parts out of 2 + 3 + 5 = 10: 5/10 of 50,000." },
      { q: "A puts in 3x for 4 months and B 2x for 9 months. Profit ₹25,000. A's share?", o: ["₹10,000", "₹15,000", "₹12,500", "₹7,500"], a: 0, e: "Capital × time: 12x : 18x = 2 : 3, so A gets 2/5 of 25,000." },
    ],
    visual: {
      plain: "Think of each partner's money as a lamp left burning: what counts is how bright it is (capital) times how long it burns (months). Profit is shared by the total light each one gave.",
      diagram: `flowchart LR
  A["A: ₹10,000 × 12 months<br/>= 1,20,000"] --> R["ratio 10 : 9"]
  B["B: ₹12,000 × 9 months<br/>= 1,08,000"] --> R
  R --> P["profit ₹19,000<br/>A ₹10,000 · B ₹9,000"]`,
      caption: "Capital × time decides each share.",
    },
  },
  {
    slug: "remainders-and-unit-digits",
    title: "Remainders and Unit Digits",
    description: "Cyclicity of last digits, remainders of large powers, and Fermat's little theorem.",
    minutes: 30,
    theory: `"Find the last digit of 7⁹⁵" or "the remainder when 2⁵⁰ is divided by 7" look impossible by hand. They aren't: last digits and remainders repeat in short cycles, and you only need the cycle.

## Start here: last digits repeat

Only the last digit of the base affects the last digit of a power:

| Last digit | Cycle of last digits | Cycle length |
|---|---|---|
| 0, 1, 5, 6 | always itself | 1 |
| 4 | 4, 6 | 2 |
| 9 | 9, 1 | 2 |
| 2 | 2, 4, 8, 6 | 4 |
| 3 | 3, 9, 7, 1 | 4 |
| 7 | 7, 9, 3, 1 | 4 |
| 8 | 8, 4, 2, 6 | 4 |

Method: divide the exponent by the cycle length (use 4 for everything; it works for all digits); the remainder picks the position, and a remainder of 0 means the **last** position.

~~~
3⁴⁷: 47 mod 4 = 3  →  third in 3, 9, 7, 1  →  7
2¹⁰⁰: 100 mod 4 = 0  →  last in 2, 4, 8, 6  →  6
123⁴⁵ × 47¹²: 3⁴⁵ → 45 mod 4 = 1 → 3;  7¹² → 0 → 1;  3 × 1 = 3
~~~

## Remainders: work with remainders, not numbers

The remainder of a sum or product equals the remainder of the sum or product of the remainders:

~~~
(17 × 23) mod 5 = (2 × 3) mod 5 = 6 mod 5 = 1
~~~

## Remainders of powers: find a power that leaves 1

~~~
2⁵⁰ mod 7:  2³ = 8 = 7 + 1, so 2³ leaves 1
2⁵⁰ = (2³)¹⁶ × 2²  →  1 × 4 = 4
~~~

A remainder of −1 helps too: 2⁹⁹ mod 9: 2³ = 8 leaves −1, so 2⁹⁹ = (2³)³³ leaves (−1)³³ = −1, which is 9 − 1 = **8**.

## Fermat's little theorem

If p is prime and doesn't divide a, then a^(p − 1) leaves remainder 1 when divided by p.

~~~
7¹⁰⁰ mod 13:  7¹² leaves 1;  100 = 12 × 8 + 4
remainder = 7⁴ mod 13 = 2401 mod 13 = 9   (13 × 184 = 2392)
~~~

## Classic patterns

- 1! + 2! + … + 100! divided by 5: from 5! on every term is a multiple of 5, so only 1 + 2 + 6 + 24 = 33 matters: remainder **3**
- the smallest number leaving remainder 2 when divided by 3, 4 and 5 is LCM(3, 4, 5) + 2 = **62**
- a number leaving remainders r when divided by several divisors is LCM × k + r

## Traps in this topic

- using the whole base instead of its last digit
- a remainder of 0 from exponent mod 4 means the 4th (last) value of the cycle, not the first
- negative remainders must be converted: −1 mod 9 is 8

## Practice

1. Unit digit of 7³⁵
2. Remainder of 3²⁰ ÷ 8
3. Remainder of (1! + 2! + … + 100!) ÷ 5
4. Unit digit of 4⁹⁹

**Answers:** 1) 35 mod 4 = 3 → **3**. 2) 3² = 9 leaves 1, so **1**. 3) **3**. 4) odd power of 4 → **4**.`,
    sources: [WIKI_MOD, WIKI_FERMAT],
    remember: [
      "Only the last digit of the base matters for the unit digit",
      "Cycles: 2 → 2486, 3 → 3971, 7 → 7931, 8 → 8426; 4 and 9 alternate; 0, 1, 5, 6 stay",
      "Exponent mod 4 picks the position; 0 means the last one",
      "Work with remainders: (a × b) mod n = (a mod n × b mod n) mod n",
      "Find a power leaving 1 (or −1); Fermat: a^(p−1) leaves 1 mod a prime p",
    ],
    quick: {
      question: "What is the unit digit of 3⁴⁷?",
      options: ["7", "3", "9", "1"],
      answer: 0,
      explanation: "Powers of 3 end in 3, 9, 7, 1. 47 mod 4 = 3, so the third: 7.",
    },
    questions: [
      { q: "Remainder when 2⁵⁰ is divided by 7?", o: ["4", "1", "2", "6"], a: 0, e: "2³ leaves 1; 2⁵⁰ = (2³)¹⁶ × 2², so 4." },
      { q: "Unit digit of 123⁴⁵ × 47¹²?", o: ["3", "1", "9", "7"], a: 0, e: "3⁴⁵ ends in 3, 7¹² ends in 1; 3 × 1 = 3." },
      { q: "Remainder of 1! + 2! + … + 100! divided by 5?", o: ["3", "0", "1", "4"], a: 0, e: "Only 1 + 2 + 6 + 24 = 33 matters." },
      { q: "Smallest number leaving remainder 2 when divided by 3, 4 and 5?", o: ["62", "60", "122", "32"], a: 0, e: "LCM(3, 4, 5) = 60, plus 2." },
    ],
    visual: {
      plain: "Last digits of powers move like a clock with only a few positions. For 7 the clock reads 7, 9, 3, 1 and then starts again, so a huge power only tells you how far round the clock to go.",
      diagram: `flowchart LR
  A["7¹ → 7"] --> B["7² → 9"] --> C["7³ → 3"] --> D["7⁴ → 1"] --> A`,
      caption: "Unit digits of powers of 7 repeat every 4.",
    },
  },
];
