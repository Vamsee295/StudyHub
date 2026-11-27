// More logical reasoning, from scratch to exam level: puzzles, cubes and dice, Venn diagrams, inequalities,
// input-output and statements & assumptions. Original writing.
import type { FullLesson } from './apt-extra-types';

const WIKI_LOGIC_PUZZLE = { title: "Wikipedia: Logic puzzle", url: "https://en.wikipedia.org/wiki/Logic_puzzle" };
const WIKI_DICE = { title: "Wikipedia: Dice", url: "https://en.wikipedia.org/wiki/Dice" };
const WIKI_CUBE_NET = { title: "Wikipedia: Net (polyhedron)", url: "https://en.wikipedia.org/wiki/Net_(polyhedron)" };
const WIKI_VENN = { title: "Wikipedia: Venn diagram", url: "https://en.wikipedia.org/wiki/Venn_diagram" };
const WIKI_INCL_EXCL = { title: "Wikipedia: Inclusion–exclusion principle", url: "https://en.wikipedia.org/wiki/Inclusion%E2%80%93exclusion_principle" };
const WIKI_INEQ = { title: "Wikipedia: Inequality (mathematics)", url: "https://en.wikipedia.org/wiki/Inequality_(mathematics)" };
const WIKI_ALGO = { title: "Wikipedia: Algorithm", url: "https://en.wikipedia.org/wiki/Algorithm" };
const WIKI_ASSUMPTION = { title: "Wikipedia: Presupposition", url: "https://en.wikipedia.org/wiki/Presupposition" };
const KHAN_LSAT = { title: "Khan Academy: LSAT logical reasoning (free)", url: "https://www.khanacademy.org/prep/lsat" };

export const moreLogical: FullLesson[] = [
  {
    slug: "puzzles",
    title: "Puzzles",
    description: "Floor, comparison and grid puzzles: fixed clues first, a table, and case splitting.",
    minutes: 30,
    theory: `Puzzles give a set of clues about people, places or things and ask several questions about the arrangement. They're the most time-consuming reasoning questions and also the most rewarding, because one solved arrangement answers four or five questions.

## Start here: the method

1. **Draw the frame** before reading clues: floors 1 to 5, a row of seats, a grid of people × attributes
2. **Place definite clues first**: "T lives on the top floor", "B likes cherry"
3. **Use negative clues** to cross out cells: "A doesn't like apple"
4. **Combine clues** that share a person or position
5. When stuck, **split into cases** (R on floor 2 or 4) and follow each until one contradicts a clue
6. **Check every clue** against the final arrangement before answering

## Worked example 1: a floor puzzle

Five friends P, Q, R, S and T live on floors 1 (bottom) to 5 (top), one per floor.
- R lives on an even-numbered floor
- Q lives directly above R
- T lives on the top floor
- P lives below S

T = 5. R is on 2 or 4. If R = 4, Q would be on 5, which is T's: impossible. So R = 2 and Q = 3. P and S share floors 1 and 4 with P below S: P = 1, S = 4.

| Floor | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Person | P | R | Q | S | T |

Questions like "who lives on floor 4?" (S) or "how many people live between P and T?" (3) are now instant.

## Worked example 2: a grid puzzle

A, B, C and D each like a different fruit: apple, banana, cherry, date.
- A likes neither apple nor banana
- B likes cherry
- C doesn't like apple

Make a grid and cross out: B = cherry, so nobody else has cherry. A can't have apple, banana or cherry: A = date. C can't have apple, cherry or date: C = banana. D = apple.

## Worked example 3: comparison puzzles

"A is taller than B, C is shorter than B, D is taller than A." Write a chain: D > A > B > C. Tallest D, shortest C. When a clue doesn't fit the chain directly, keep two chains and merge them when a shared person appears.

## Types you'll meet

- floors, flats or buildings (vertical order)
- boxes stacked one above another
- days of the week or months (scheduling)
- people × several attributes (city, colour, job): use one grid per pair or a combined table
- linear and circular seating (see the seating arrangement lesson)

## Speed tips

- give 6 to 8 minutes to a 5-question puzzle; if a frame isn't forming after 3 minutes, move on and return
- write short codes, not words
- when a clue says "directly above" or "immediately", it's usually the anchor; use it early

## Traps in this topic

- reading "above" as "directly above"
- forgetting that the floors are numbered from the bottom
- answering before checking the last unused clue

## Practice

Six boxes U, V, W, X, Y, Z are stacked one above another, 1 at the bottom.
- Z is on top. U is directly below Z
- W is at the bottom
- V is above X, and Y is directly above W

1. Which box is in position 3?
2. How many boxes are between W and U?

**Answers:** Z = 6, U = 5, W = 1, Y = 2; V and X take 3 and 4 with V above X: X = 3, V = 4. 1) **X**. 2) Y, X and V: **3**.`,
    sources: [WIKI_LOGIC_PUZZLE],
    remember: [
      "Draw the frame first, then place definite clues, then use negatives",
      "Split into cases when stuck; a case that breaks any clue is out",
      "Floors and stacks count from the bottom unless told otherwise",
      "'Directly above' means adjacent; 'above' means anywhere higher",
      "Check every clue before answering",
    ],
    quick: {
      question: "P, Q, R, S, T on floors 1–5. R is on an even floor, Q directly above R, T on top, P below S. Who is on floor 4?",
      options: ["S", "R", "Q", "P"],
      answer: 0,
      explanation: "T = 5, so R = 2 and Q = 3; P and S take 1 and 4 with P below S.",
    },
    questions: [
      { q: "A, B, C, D like apple, banana, cherry, date (one each). A likes neither apple nor banana; B likes cherry; C doesn't like apple. Who likes apple?", o: ["D", "C", "A", "B"], a: 0, e: "B = cherry, A = date, C = banana, so D = apple." },
      { q: "A is taller than B, C is shorter than B, D is taller than A. Who is shortest?", o: ["C", "B", "A", "D"], a: 0, e: "Joining the clues gives the chain D > A > B > C, so C is shortest." },
      { q: "Boxes stacked 1 (bottom) to 6: Z on top, U directly below Z, W at the bottom, Y directly above W, V above X. Which box is in position 3?", o: ["X", "V", "Y", "U"], a: 0, e: "Z6, U5, W1, Y2; V above X gives X3, V4." },
      { q: "In a puzzle, which clue should usually be placed first?", o: ["A definite clue that fixes a position", "A negative clue", "The longest clue", "The last clue"], a: 0, e: "Definite placements anchor the frame; negatives then narrow the rest." },
    ],
    visual: {
      plain: "Solving a puzzle is filling a seating chart at a wedding. Seat the people whose places are fixed, rule out the seats others refuse, and the remaining guests have only one place left.",
      diagram: `flowchart LR
  F["Draw the frame"] --> D["Place definite clues"] --> N["Cross out with<br/>negative clues"] --> C["Split into cases<br/>if stuck"] --> V["Check every clue"]`,
      caption: "The same five steps solve floor, box, grid and seating puzzles.",
    },
  },
  {
    slug: "cubes-and-dice",
    title: "Cubes and Dice",
    description: "Painted cubes cut into pieces, opposite faces of dice, and cube nets.",
    minutes: 25,
    theory: `Cube and dice questions test spatial reasoning, but most of them reduce to a few formulas and rules you can apply without visualising anything.

## Start here: the painted cube

A cube painted on all six faces is cut into n × n × n small cubes. Count the small cubes by how many painted faces they have:

| Painted faces | Where they are | How many |
|---|---|---|
| 3 | corners | 8 |
| 2 | edges, without corners | 12 × (n − 2) |
| 1 | faces, without edges | 6 × (n − 2)² |
| 0 | inside | (n − 2)³ |

For n = 4: 8 + 24 + 24 + 8 = 64 = 4³. The four counts always add up to n³, a useful check.

If only some faces are painted, count directly: picture which small cubes touch a painted face.

## Dice: opposite faces

A die has six faces; each face has one opposite face and four adjacent ones.

- **Standard die:** opposite faces add up to 7 (1–6, 2–5, 3–4)
- **Rule of the four neighbours:** if one number appears next to four different numbers across the views, the sixth number is opposite it. Views showing 6 with 2 and 3, with 3 and 5, and with 5 and 4 put 6 next to 2, 3, 4 and 5, so **1** is opposite 6
- **Two numbers seen together** in one view are adjacent, never opposite

## Dice: two views sharing a face

When two views of the same die share exactly one visible number, place that number in the same spot in both views and read clockwise round it. The numbers in matching clockwise positions are opposite each other. Draw the two views side by side and turn one until the shared face lines up.

## Cube nets

A net is a cube unfolded flat. Rules for finding opposite faces:

- in a straight row of three faces, the **first and third** are opposite
- two faces that touch along an edge in the net are adjacent
- a valid net has exactly 6 squares and no 2 × 2 block

## Worked example: a 5 × 5 × 5 cube

Painted on all faces and cut into 125 small cubes: 3 faces = 8; 2 faces = 12 × 3 = 36; 1 face = 6 × 9 = 54; 0 faces = 27. Check: 8 + 36 + 54 + 27 = 125.

## Traps in this topic

- using n instead of n − 2 in the formulas
- assuming every die is standard (only use "sum 7" when told it's a standard die)
- calling two numbers opposite when they appeared together in some view

## Practice

1. A 3 × 3 × 3 painted cube: how many small cubes have exactly one painted face?
2. A 6 × 6 × 6 painted cube: how many small cubes have no paint?
3. In a net, faces A, B, C are in a straight row. Which face is opposite A?

**Answers:** 1) 6 × 1² = **6**. 2) 4³ = **64**. 3) **C**.`,
    sources: [WIKI_DICE, WIKI_CUBE_NET],
    remember: [
      "Painted n-cube: 8 corners (3 faces), 12(n−2) with 2, 6(n−2)² with 1, (n−2)³ with none",
      "The four counts add up to n³",
      "Standard die: opposite faces sum to 7",
      "A number seen next to four different numbers is opposite the sixth",
      "In a net, the 1st and 3rd faces of a straight row are opposite",
    ],
    quick: {
      question: "A 4 × 4 × 4 cube painted on all faces is cut into unit cubes. How many have exactly two painted faces?",
      options: ["24", "8", "12", "32"],
      answer: 0,
      explanation: "12 × (n − 2) = 12 × 2 = 24.",
    },
    questions: [
      { q: "A 5 × 5 × 5 painted cube is cut into unit cubes. How many have no paint?", o: ["27", "125", "64", "8"], a: 0, e: "Only the inner cubes are unpainted: (5 − 2)³ = 27." },
      { q: "Across views, 6 appears next to 2, 3, 4 and 5. Which number is opposite 6?", o: ["1", "2", "5", "It can't be determined"], a: 0, e: "6 has four different neighbours, so the sixth number, 1, is opposite." },
      { q: "On a standard die, which face is opposite 2?", o: ["5", "4", "6", "3"], a: 0, e: "Opposite faces of a standard die add up to 7." },
      { q: "A 3 × 3 × 3 painted cube: how many unit cubes have exactly one painted face?", o: ["6", "12", "8", "1"], a: 0, e: "6 × (3 − 2)² = 6: the centre of each face." },
    ],
    visual: {
      plain: "Think of a Rubik's cube that's been painted: the 8 corner pieces show 3 colours, the edge pieces 2, the face centres 1, and the one hidden in the middle shows none.",
      diagram: `flowchart TB
  C["n × n × n painted cube"] --> T["3 faces: 8 corners"]
  C --> E["2 faces: 12(n − 2) edges"]
  C --> F["1 face: 6(n − 2)²"]
  C --> I["0 faces: (n − 2)³ inside"]`,
      caption: "For n = 3: 8, 12, 6 and 1 = 27 small cubes.",
    },
  },
  {
    slug: "venn-diagrams",
    title: "Venn Diagrams",
    description: "Counting with two and three overlapping sets, 'only' regions, and classifying words with circles.",
    minutes: 25,
    theory: `Venn diagrams show groups as overlapping circles. Tests use them two ways: **counting** (how many like both, neither, only one) and **classification** (which diagram best shows the relationship between doctors, women and mothers).

## Start here: two sets

~~~
n(A or B) = n(A) + n(B) − n(A and B)
neither = total − n(A or B)
only A = n(A) − n(A and B)
~~~

Out of 100 students, 60 like tea, 50 like coffee and 20 like both:
- tea or coffee = 60 + 50 − 20 = 90
- neither = 100 − 90 = **10**
- only tea = 60 − 20 = 40; only coffee = 30

The overlap is subtracted once because it was counted in both circles.

## Three sets

~~~
n(A or B or C) = A + B + C − (A∩B) − (B∩C) − (A∩C) + (A∩B∩C)
~~~

Total 100; A = 50, B = 40, C = 30; A∩B = 15, B∩C = 10, A∩C = 12; all three = 5.
Union = 50 + 40 + 30 − 15 − 10 − 12 + 5 = **88**, so 12 belong to none.

## Fill the diagram from the inside out

For "only" questions, start with the centre (all three), then the pairwise regions **minus** the centre, then each circle's "only" region:

~~~
A∩B only = 15 − 5 = 10      B∩C only = 10 − 5 = 5      A∩C only = 12 − 5 = 7
only A = 50 − (10 + 7 + 5) = 28
only B = 40 − (10 + 5 + 5) = 20
only C = 30 − (7 + 5 + 5) = 13
~~~

Adding every region (28 + 20 + 13 + 10 + 5 + 7 + 5 = 88) matches the union: a built-in check.

## Classification Venn diagrams

Decide how each pair of groups relates:

| Relationship | Picture | Example |
|---|---|---|
| one inside another | circle in circle | cats, animals |
| overlapping | two crossing circles | doctors, women |
| separate | two apart | cats, dogs |

Doctors, women and mothers: mothers are all women (inside); some women and some mothers are doctors (overlap). Pick the diagram with a circle inside another and a third crossing both.

## Traps in this topic

- forgetting to subtract the overlap
- reporting "A∩B" when the question asks for "only A and B" (which excludes the centre)
- with three sets, adding back the centre is often forgotten

## Practice

1. In a class of 40, 25 play cricket, 20 football, 10 both. How many play neither?
2. In the same class, how many play only football?
3. Which relationship fits "fruits, apples, mangoes"?

**Answers:** 1) 40 − (25 + 20 − 10) = **5**. 2) 20 − 10 = **10**. 3) Apples and mangoes are separate circles, both inside fruits.`,
    sources: [WIKI_VENN, WIKI_INCL_EXCL],
    remember: [
      "n(A or B) = n(A) + n(B) − n(both); neither = total − union",
      "Three sets: add the three, subtract the three pairs, add back the centre",
      "Fill from the centre outwards for 'only' questions",
      "All regions together must equal the union",
      "Classification: inside, overlapping or separate",
    ],
    quick: {
      question: "Of 100 students, 60 like tea, 50 coffee and 20 both. How many like neither?",
      options: ["10", "20", "30", "0"],
      answer: 0,
      explanation: "Either = 60 + 50 − 20 = 90, so neither = 10.",
    },
    questions: [
      { q: "A = 50, B = 40, C = 30, A∩B = 15, B∩C = 10, A∩C = 12, all three = 5, total 100. How many are in none?", o: ["12", "5", "20", "0"], a: 0, e: "Union = 120 − 37 + 5 = 88; 100 − 88 = 12." },
      { q: "Class of 40: 25 play cricket, 20 football, 10 both. How many play only football?", o: ["10", "20", "15", "5"], a: 0, e: "Only football = football players minus those who play both: 20 − 10 = 10." },
      { q: "Which pair is best shown as one circle inside another?", o: ["Cats, animals", "Doctors, women", "Cats, dogs", "Teachers, singers"], a: 0, e: "Every cat is an animal." },
      { q: "In three-set questions, 'only A and B' means…", o: ["A∩B minus those in all three", "A∩B including all three", "A plus B", "Only A"], a: 0, e: "'Only A and B' excludes the centre region." },
    ],
    visual: {
      plain: "A Venn diagram is a guest list for two parties drawn as two circles. Guests invited to both stand in the overlap, so if you count each party's list, you've counted them twice.",
      diagram: `flowchart LR
  T["tea only<br/>40"] --- B["both<br/>20"] --- C["coffee only<br/>30"]
  N["neither: 100 − 90 = 10"]`,
      caption: "60 tea + 50 coffee − 20 both = 90 like at least one.",
    },
  },
  {
    slug: "inequalities",
    title: "Inequalities",
    description: "Chains of >, ≥, = and <, definite and either-or conclusions, and coded inequalities.",
    minutes: 25,
    theory: `Inequality questions give a chain of comparisons like P > Q ≥ R = S and ask which conclusions **definitely** follow. They're among the fastest marks in reasoning once you know three rules.

## Start here: reading a chain

Two items are related only through the symbols between them on the chain.

1. **All symbols point the same way** → a definite relation. If any symbol in between is strict (> or <), the result is strict
2. **Symbols point opposite ways** (like > then <) → **no definite relation**
3. **= never changes** the direction; it only copies

~~~
P > Q ≥ R = S
P vs S: >, ≥, = all point the same way, one is strict  →  P > S  ✔
Q vs S: ≥, =  →  Q ≥ S  ✔
R vs P: R < P is true, so "R > P" is false
~~~

~~~
A < B > C
A vs C: < then >, opposite directions  →  no definite relation
~~~

## Either-or conclusions

When two conclusions are each uncertain, but **together** cover every possibility, the answer is "either I or II follows".

~~~
X ≥ Y = Z
I: X > Z     II: X = Z
~~~

From the chain, X ≥ Z. Neither I nor II is certain alone, but one must be true: **either I or II**. The pair must be about the same two items, with one being > and the other =, or one ≥ and the other <.

## Combining two statements

Write them as one chain through the shared item:

~~~
M ≥ N > O    and    O ≤ P
chain: M ≥ N > O ≤ P
I: M > O → ≥ and > point the same way → true
II: P > N → between P and N: ≤ and > point opposite ways → no relation → false
~~~

Only I follows.

## Coded inequalities

Some tests use symbols for relations: "A @ B means A > B, A # B means A ≥ B, A % B means A = B…". Decode each statement into ordinary symbols first, then apply the same rules.

## Traps in this topic

- treating "≥" as ">" (≥ allows equality, so "X > Y" isn't definite)
- relating two items across opposite-pointing symbols
- missing an either-or pair because each conclusion looked false

## Practice

1. Statement: A > B ≥ C < D. Conclusions: I. A > C  II. D > B
2. Statement: J = K ≥ L > M. Conclusions: I. J > M  II. K ≥ M
3. Statement: R ≤ S = T. Conclusions: I. T > R  II. T = R

**Answers:** 1) only **I** (B and D are across opposite symbols). 2) both: J > M, and K > M implies K ≥ M, so **both** follow. 3) T ≥ R, so **either I or II**.`,
    sources: [WIKI_INEQ],
    remember: [
      "Same direction all the way → definite; any strict sign makes it strict",
      "Opposite directions between two items → no definite relation",
      "= copies the relation and never reverses it",
      "Either-or: the same two items, conclusions that together cover ≥ (or ≤)",
      "Decode coded symbols before applying the rules",
    ],
    quick: {
      question: "Statement: P > Q ≥ R = S. Which conclusion definitely follows?",
      options: ["P > S", "S > Q", "R > P", "Q = P"],
      answer: 0,
      explanation: ">, ≥ and = all point the same way between P and S, and one is strict.",
    },
    questions: [
      { q: "Statement: A < B > C. What is the relation between A and C?", o: ["No definite relation", "A < C", "A > C", "A = C"], a: 0, e: "The symbols between A and C point in opposite directions." },
      { q: "Statement: X ≥ Y = Z. Conclusions: I. X > Z  II. X = Z", o: ["Either I or II follows", "Only I follows", "Only II follows", "Neither follows"], a: 0, e: "X ≥ Z, so exactly one of the two must be true." },
      { q: "Statements: M ≥ N > O, O ≤ P. Conclusions: I. M > O  II. P > N", o: ["Only I follows", "Only II follows", "Both follow", "Neither follows"], a: 0, e: "M ≥ N > O gives M > O; between N and P the signs point opposite ways." },
      { q: "Statement: J = K ≥ L > M. Conclusions: I. J > M  II. K ≥ M", o: ["Both follow", "Only I follows", "Only II follows", "Neither follows"], a: 0, e: "K > M, which also makes K ≥ M true." },
    ],
    visual: {
      plain: "Read a chain like a one-way street. If every sign between two people points the same way, you can drive from one to the other and you know who's ahead. If the signs point both ways, there's no through road.",
      diagram: `flowchart LR
  P["P"] -->|"greater than"| Q["Q"] -->|"at least"| R["R"] -->|"equal to"| S["S"]
  P -.->|"so P is definitely greater than S"| S`,
      caption: "All signs point the same way between P and S, so P > S.",
    },
  },
  {
    slug: "input-output",
    title: "Input-Output (Machine Rearrangement)",
    description: "Find the rule a machine applies step by step, then predict any step.",
    minutes: 25,
    theory: `An input-output question shows a "machine" that rearranges a line of words or numbers in steps. You see the input and a few steps, and must find the rule, then answer questions like "what is step 4?" or "how many steps are needed?".

## Start here: the method

1. Compare the **input with step 1**: what moved, and where did it go?
2. Confirm with **step 1 → step 2**: the same kind of move should repeat
3. Name the rule in a few words: "smallest number moves to the front", "words in alphabetical order, one per step, from the left"
4. Apply it to any new input; count the steps until nothing more changes

## Common rules

- one element per step moves to the left end (or right end) in increasing or decreasing order
- words arranged alphabetically, numbers arranged by size, one per step
- words by length, or numbers by sum of digits
- two moves per step: one word from the left side, one number from the right
- arithmetic machines: each number is changed by a rule (+5, × 2, digits swapped)

## Worked example: numbers sorted one per step

~~~
Input:   67 52 93 18 41
Step 1:  18 67 52 93 41
Step 2:  18 41 67 52 93
Step 3:  18 41 52 67 93
~~~

From input to step 1, 18 (the smallest) moved to the front and the others kept their order. Step 2 moved 41, the next smallest, into second place. Rule: **in each step, the smallest remaining number moves to the left, right after the numbers already placed.** After step 3 the line is sorted, so **3 steps** are needed.

Notice: a step can move a number that's already in place without changing the line; the step count ends when the arrangement is final, not after one move per element.

## Worked example: words, alphabetical

~~~
Input:   sun bat cat and fox
Step 1:  and sun bat cat fox
Step 2:  and bat sun cat fox
Step 3:  and bat cat sun fox
Step 4:  and bat cat fox sun
~~~

Rule: the alphabetically earliest remaining word moves to the front of the unsorted part. **4 steps**.

## Answering "what was the input?"

Work backwards by undoing one move at a time. This only works when each step has one clear move, so check the rule on two steps first.

## Traps in this topic

- forgetting that the unmoved items keep their relative order
- stopping one step early or late
- assuming one step per element when some are already in place

## Practice

Input: 34 75 12 58 26. In each step the largest remaining number moves to the left end, after the numbers already moved.

1. What is step 1?
2. What is step 2?
3. How many steps until the line is final?

**Answers:** 1) **75 34 12 58 26**. 2) **75 58 34 12 26**. 3) step 3 gives 75 58 34 12 26 again with 34 placed, step 4 moves 26 before 12: 75 58 34 26 12, so **4** steps.`,
    sources: [WIKI_ALGO],
    remember: [
      "Compare input with step 1, then step 1 with step 2, to find the rule",
      "Items that don't move keep their relative order",
      "Count steps until the arrangement stops changing",
      "Work backwards only after the rule is confirmed on two steps",
    ],
    quick: {
      question: "Input: sun bat cat and fox. Each step moves the earliest remaining word (alphabetically) to the front of the unsorted part. How many steps?",
      options: ["4", "5", "3", "2"],
      answer: 0,
      explanation: "and, bat, cat and fox are moved in turn; after step 4 the line is sorted.",
    },
    questions: [
      { q: "Input: 67 52 93 18 41. Each step moves the smallest remaining number to the left (after those placed). What is step 2?", o: ["18 41 67 52 93", "18 67 52 93 41", "18 41 52 67 93", "41 18 67 52 93"], a: 0, e: "Step 1 moves 18, step 2 moves 41; the rest keep their order." },
      { q: "In input-output questions, the items not moved in a step…", o: ["Keep their relative order", "Are reversed", "Are sorted", "Move one place right"], a: 0, e: "Only the moved item changes position; the others shift but stay in order." },
      { q: "Input: 34 75 12 58 26. Largest remaining moves to the left each step. Step 1?", o: ["75 34 12 58 26", "12 34 75 58 26", "75 58 34 12 26", "34 12 58 26 75"], a: 0, e: "75 is the largest, so it moves to the front." },
      { q: "How do you find the rule of a machine?", o: ["Compare the input with step 1, and confirm on step 2", "Look only at the last step", "Count the words", "Guess from the options"], a: 0, e: "Two consecutive transitions confirm the rule." },
    ],
    visual: {
      plain: "The machine is a librarian tidying a shelf. Each step she pulls out one book, the next in order, and slides it in after the books she has already tidied; everything else shuffles along.",
      diagram: `flowchart TB
  I["Input: 67 52 93 18 41"] --> S1["Step 1: 18 · 67 52 93 41"] --> S2["Step 2: 18 41 · 67 52 93"] --> S3["Step 3: 18 41 52 · 67 93<br/>sorted"]`,
      caption: "One number placed per step; the unplaced ones keep their order.",
    },
  },
  {
    slug: "statements-and-assumptions",
    title: "Statements, Assumptions and Arguments",
    description: "Implicit assumptions, courses of action, and strengthening or weakening an argument.",
    minutes: 30,
    theory: `Critical reasoning questions give a short statement or argument and ask what it takes for granted (an **assumption**), what should be done (a **course of action**), or what would make it more or less convincing (**strengthen / weaken**). Unlike puzzles, there's no calculation: the skill is reading precisely and not adding your own opinions.

## Start here: what an assumption is

An assumption is something the speaker **must believe but didn't say**. Test a candidate with the negation test: if the assumption were false, would the statement stop making sense? If yes, it's implicit.

**Statement:** "Use our toothpaste for whiter teeth."
- I. People want whiter teeth → negate: "nobody wants whiter teeth" makes the advert pointless → **implicit**
- II. Other toothpastes don't whiten teeth → the advert doesn't need this → **not implicit**

## Rules for assumptions

- extreme words (all, only, always, never, best) usually make an option **not** implicit
- an assumption is a premise the statement depends on, not a conclusion it leads to
- ignore whether the assumption is true in real life; judge only what the statement needs

## Courses of action

A course of action follows if it is **practical, addresses the stated problem, and doesn't create a bigger problem**.

**Statement:** "Many children in the village fell ill after drinking well water."
- I. Test the well water and supply safe drinking water meanwhile → practical and solves the problem → **follows**
- II. Close the village school → doesn't address the cause → **doesn't follow**

## Strengthen and weaken

An argument has evidence and a conclusion. Find the **gap** between them; a strengthener closes the gap, a weakener widens it or offers another explanation.

**Argument:** "Sales rose after our advertising campaign, so the campaign worked."
- Weakener: "A major competitor shut down the same month" → another cause for the rise
- Strengthener: "Sales rose only in the cities where the ads ran" → links cause and effect

## Cause and effect

Given two events, decide whether one causes the other, both are effects of a common cause, or they're independent. "Heavy rain flooded the roads" (cause) and "schools were closed" (effect) is a typical pair.

## Traps in this topic

- choosing an option because it's true in real life rather than because the statement needs it
- picking extreme courses of action ("ban all…", "punish everyone…")
- confusing the conclusion with an assumption

## Practice

1. Statement: "The company will hire 500 freshers this year to handle new projects." Is "the company expects new projects" implicit?
2. Statement: "Traffic accidents rose sharply on the highway after the speed limit was raised." Course of action: "Review the speed limit." Does it follow?
3. Argument: "Students who use our app score higher, so the app improves scores." Which weakens it: (a) app users already had higher scores before using it, or (b) the app is free?

**Answers:** 1) **Yes**: hiring "to handle new projects" depends on expecting them. 2) **Yes**: practical and targets the likely cause. 3) **(a)**: it offers another explanation for the higher scores.`,
    sources: [WIKI_ASSUMPTION, KHAN_LSAT],
    remember: [
      "An assumption is unstated but necessary: use the negation test",
      "Extreme words (all, only, never, best) usually mark an option that isn't implicit",
      "A course of action must be practical and address the stated problem",
      "Weakeners offer another cause or break the evidence–conclusion link",
      "Judge by the statement, not by what's true in real life",
    ],
    quick: {
      question: "\"Use our toothpaste for whiter teeth.\" Which is an implicit assumption?",
      options: ["People want whiter teeth", "Other toothpastes don't whiten teeth", "This toothpaste is the cheapest", "Everyone uses toothpaste"],
      answer: 0,
      explanation: "If nobody wanted whiter teeth, the advert would make no sense.",
    },
    questions: [
      { q: "\"Many children fell ill after drinking well water.\" Which course of action follows?", o: ["Test the water and supply safe water meanwhile", "Close the village school", "Ban drinking water", "Move the village"], a: 0, e: "It's practical and addresses the cause." },
      { q: "\"Sales rose after our ad campaign, so the campaign worked.\" Which weakens this?", o: ["A major competitor shut down that month", "The ads were colourful", "Sales are counted monthly", "The campaign cost a lot"], a: 0, e: "It offers another explanation for the rise." },
      { q: "Which option type is usually NOT an implicit assumption?", o: ["One with words like 'only' or 'always'", "One the statement depends on", "One that passes the negation test", "One about the speaker's goal"], a: 0, e: "Extreme words usually go beyond what the statement needs." },
      { q: "The negation test says an assumption is implicit if…", o: ["The statement stops making sense when the assumption is false", "The assumption is true in real life", "The assumption is long", "It repeats the statement"], a: 0, e: "A necessary premise, once negated, breaks the statement." },
    ],
    visual: {
      plain: "An argument is a bridge from evidence to conclusion. The assumption is the hidden pillar holding it up. A weakener knocks a pillar out; a strengthener adds another.",
      diagram: `flowchart LR
  E["Evidence<br/>sales rose after the ads"] -->|"assumes nothing else<br/>caused the rise"| C["Conclusion<br/>the ads worked"]
  W["Weakener: a competitor<br/>closed that month"] -.->|"attacks the assumption"| C`,
      caption: "Find the gap between evidence and conclusion; that's where assumptions and weakeners live.",
    },
  },
];
