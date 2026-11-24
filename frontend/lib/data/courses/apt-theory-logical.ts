// Long-form theory for Logical Reasoning: series, analogies, classification and basic reasoning. Original writing.
import { LessonTheory } from './utils';

const WIKI_SEQUENCE = { title: "Wikipedia: Integer sequence", url: "https://en.wikipedia.org/wiki/Integer_sequence" };
const OEIS = { title: "OEIS: The On-Line Encyclopedia of Integer Sequences", url: "https://oeis.org/" };
const WIKI_ANALOGY = { title: "Wikipedia: Analogy", url: "https://en.wikipedia.org/wiki/Analogy" };
const WIKI_CIPHER = { title: "Wikipedia: Caesar cipher", url: "https://en.wikipedia.org/wiki/Caesar_cipher" };
const WIKI_KINSHIP = { title: "Wikipedia: Kinship terminology", url: "https://en.wikipedia.org/wiki/Kinship_terminology" };
const WIKI_COMPASS = { title: "Wikipedia: Cardinal direction", url: "https://en.wikipedia.org/wiki/Cardinal_direction" };
const WIKI_DOOMSDAY = { title: "Wikipedia: Determination of the day of the week", url: "https://en.wikipedia.org/wiki/Determination_of_the_day_of_the_week" };
const WIKI_CLOCK = { title: "Wikipedia: Clock angle problem", url: "https://en.wikipedia.org/wiki/Clock_angle_problem" };
const KHAN_LOGIC = { title: "Khan Academy: Logical reasoning (LSAT prep, free)", url: "https://www.khanacademy.org/prep/lsat" };

export const aptLogicalTheory: Record<string, LessonTheory> = {
  "number-series": {
    theory: `Number series questions show a sequence and ask for the next term, a missing term, or the term that doesn't fit. They test pattern recognition under time pressure. Most series in placement tests follow a small set of patterns: constant differences, changing differences, multiplication, squares and cubes, primes, alternating series and combinations of these. This lesson gives a systematic checklist for identifying the pattern quickly, with examples of each type.

## A systematic approach

1. **look at the overall trend**: increasing slowly suggests addition; increasing fast suggests multiplication or powers; up and down suggests alternation
2. **compute the differences** between consecutive terms
3. if the differences don't form a pattern, compute **second differences** or **ratios**
4. check for **squares, cubes and primes** near the terms
5. check **alternate terms** as two separate series
6. verify the rule on **every** given term before answering

## Constant difference (arithmetic)

~~~
7, 12, 17, 22, ?  → difference 5 → 27
~~~

## Changing differences

~~~
3, 5, 9, 15, 23, ?
Differences: 2, 4, 6, 8 → next difference 10 → 33
~~~

When first differences don't settle the pattern, take the differences of the differences:

~~~
2, 5, 11, 22, 40, ?
Differences: 3, 6, 11, 18 → second differences: 3, 5, 7 → next 9 → next difference 27 → 67
~~~

## Multiplication (geometric)

~~~
3, 6, 12, 24, ?  → × 2 → 48
~~~

Mixed operations are common:

~~~
2, 5, 11, 23, 47, ?  → × 2 + 1 → 95
5, 9, 17, 33, ?  → × 2 − 1 → 65
1, 2, 6, 24, 120, ?  → × 2, × 3, × 4, × 5 → × 6 → 720 (factorials)
~~~

## Squares and cubes

Memorizing squares to 30 and cubes to 15 makes these instant:

~~~
4, 9, 16, 25, ?  → 2², 3², 4², 5² → 36
2, 10, 30, 68, ?  → n³ + n: 1+1, 8+2, 27+3, 64+4 → 125 + 5 = 130
0, 3, 8, 15, 24, ?  → n² − 1 → 35
~~~

Terms one more or one less than squares or cubes (n² ± 1, n³ ± 1) appear often.

## Primes

~~~
2, 3, 5, 7, 11, ?  → 13
4, 6, 10, 14, 22, ?  → primes × 2 → 26
~~~

## Alternating series

When terms jump up and down, or the pattern seems inconsistent, split odd and even positions:

~~~
1, 10, 3, 20, 5, 30, ?
Odd positions: 1, 3, 5 → 7. Even positions: 10, 20, 30
Next term (position 7): 7
~~~

## Fibonacci-type series

Each term is the sum of the previous two (or three):

~~~
1, 1, 2, 3, 5, 8, ?  → 13
2, 3, 5, 8, 13, ?  → 21
~~~

## Wrong-term questions

Find the rule that most terms follow, then find the term that breaks it:

~~~
Find the wrong term: 3, 7, 15, 31, 64, 127
Rule: × 2 + 1 → 3, 7, 15, 31, 63, 127 → 64 is wrong
~~~

## Digit-based patterns

Occasionally the next term depends on digits: sums of digits, reversed numbers, or concatenations. Consider these when arithmetic patterns fail.

## Speed tips

- check differences first; most series in placement tests are difference-based
- if numbers grow by roughly a constant factor, check multiplication
- use the answer options: substituting each option into a candidate rule often confirms the pattern faster
- don't spend more than a minute on one series; mark it and return

## Patterns at a glance

| Signal | Likely pattern |
|---|---|
| Steady increase, small gaps | Constant or increasing differences |
| Rapid growth | Multiplication, powers or factorials |
| Values near perfect squares or cubes | n², n³ with an offset |
| Up-down movement | Two interleaved series |
| Each term near sum of previous two | Fibonacci-type |

## Practice routine

Build speed by solving ten series a day with a timer, and for each one write the rule in a few words, such as "× 2 + 1" or "n³ + n". Over a few weeks, the common rules become familiar enough that you recognize them within seconds.

## How interviewers test this

Expect next-term, missing-term and wrong-term questions mixing these patterns, usually with four or five answer options. Work through the checklist in order, verify the rule on all terms, and use options to confirm quickly.`,
    sources: [OEIS, WIKI_SEQUENCE],
  },

  "alphabet-series": {
    theory: `Alphabet series questions present letters in a pattern and ask for the next letter group or a missing term. They're number series in disguise: each letter corresponds to its position in the alphabet, and the patterns are skips, reversals, alternations and groupings. Knowing letter positions instantly is the key skill. This lesson covers position values, reverse positions, the common patterns and the techniques for letter-group series.

## Position values

Memorize letter positions; the EJOTY trick helps:

| E | J | O | T | Y |
|---|---|---|---|---|
| 5 | 10 | 15 | 20 | 25 |

From these anchors, any position is a step or two away: M is 13 (O minus 2), R is 18 (T minus 2).

## Reverse positions

The reverse position (Z = 1, Y = 2, and so on) of a letter at position n is 27 − n. So the reverse position of D (4) is 23, which is the position of W. Pairs adding to 27 are **opposite letters**: A-Z, B-Y, C-X, D-W, E-V, F-U, G-T, H-S, I-R, J-Q, K-P, L-O, M-N.

## Constant skip

~~~
A, D, G, J, ?  → +3 → M
Z, W, T, Q, ?  → −3 → N
~~~

When counting past Z, wrap around to A: Y + 3 = B.

## Increasing skips

~~~
B, C, E, H, L, ?
Skips: +1, +2, +3, +4 → +5 → Q
~~~

## Alternating series

~~~
A, Z, C, X, E, V, ?
Odd positions: A, C, E (+2) → G
Even positions: Z, X, V (−2)
Next (position 7): G
~~~

## Letter groups

Many questions use groups of two or three letters. Track each position in the group separately:

~~~
AZ, BY, CX, DW, ?
First letters: A, B, C, D (+1) → E
Second letters: Z, Y, X, W (−1) → V
Answer: EV
~~~

~~~
BDF, HJL, NPR, ?
Within each group: +2, +2. Between groups: B → H → N (+6) → T
Answer: TVX
~~~

## Mixed letter and number patterns

~~~
A1, C3, E5, G7, ?  → I9
~~~

The number often equals the letter's position, or follows its own series.

## Missing letters in repeating patterns

A different question type shows a pattern with blanks:

~~~
a_bc_ab_ca_bc
~~~

Look for the repeating block (here "abc") and fill the blanks to continue it. Try the options against the pattern rather than solving from scratch.

## Positions in the alphabet questions

- "Which letter is the 7th to the right of the 15th letter from the left?" → 15 + 7 = 22 → V
- "Which letter is the 5th to the left of the 10th letter from the right?" → 10th from the right is Q (position 17); 5 to the left → 12 → L

Convert everything to left-hand positions first, then add or subtract.

## Word formation and letter rearrangement

Some questions ask how many meaningful words can be formed from given letters, or which letter appears in the middle when letters are rearranged alphabetically. Sort letters by position and count carefully.

## Speed tips

- write positions above letters for the first few terms
- check skips, then alternation, then groups
- use opposite letter pairs for reversal patterns
- remember wrap-around after Z

## A worked set

Try these with the method above:

~~~
C, F, I, L, ?            → +3 each → O
Y, V, S, P, ?            → −3 each → M
AB, DE, GH, JK, ?        → pairs of consecutive letters, skipping one → MN
KP, LO, MN, ?            → first letter +1, second −1 → NM
A, C, F, J, O, ?         → skips +2, +3, +4, +5 → +6 → U
~~~

In the fourth example, each pair is a set of opposite letters (K-P, L-O, M-N), so the next pair is N-M. Spotting opposite pairs often confirms a rule faster than counting positions.

## Practice routine

Spend a few minutes a day reciting letter positions in random order until you can name any position without counting from A. That single habit removes most of the time spent on these questions.

## How interviewers test this

Expect next-term questions with skips and alternations, letter-group series, letter-number combinations, position counting from left and right, and repeating-pattern blanks. Know positions instantly using EJOTY, use 27 − n for reverse positions, and track each position in a letter group separately.`,
    sources: [WIKI_SEQUENCE, OEIS],
  },

  "alphanumeric-series": {
    theory: `Alphanumeric series combine letters, numbers and symbols, either as patterned terms (A2, C4, E6) or as a long jumbled sequence with questions about positions and neighbours. The second type tests careful counting and following conditions precisely. This lesson covers patterned alphanumeric terms, position-based questions in mixed sequences, condition-based counting and techniques to avoid miscounting.

## Patterned alphanumeric terms

Each term mixes a letter and a number, each following its own rule:

~~~
B2, D4, F8, H16, ?
Letters: +2 → J. Numbers: × 2 → 32. Answer: J32
~~~

~~~
Z1, X4, V9, T16, ?
Letters: −2 → R. Numbers: squares → 25. Answer: R25
~~~

Sometimes the number is the letter's position, its reverse position, or a function of it:

~~~
C9, E25, G49, ?  → number = (position)²: C = 3 → 9, E = 5 → 25 → I81
~~~

## Mixed-sequence questions

A typical set gives a long arrangement and asks several questions:

~~~
R 4 # T M 7 % A 2 J @ K 9 E $ B 3 W
~~~

Common question types:

- **position from an end**: "Which element is 7th from the left?" Count carefully: R(1), 4(2), #(3), T(4), M(5), 7(6), %(7) → %
- **relative position**: "Which element is 4th to the right of the 10th from the left?" 10th is J → 4 to the right → 9
- **midpoint**: "Which element is midway between T and K?" T is 4th, K is 12th → 8th → A

Convert every reference to positions from the left before computing.

## Condition-based counting

~~~
How many numbers in the sequence are immediately preceded by a letter and immediately followed by a symbol?
~~~

Scan the sequence once, checking each number's neighbours:

- 4: preceded by R (letter), followed by # (symbol) → yes
- 7: preceded by M (letter), followed by % (symbol) → yes
- 2: preceded by A (letter), followed by J (letter) → no
- 9: preceded by K (letter), followed by E (letter) → no
- 3: preceded by B (letter), followed by W (letter) → no

Answer: 2. Read the condition carefully: "preceded by" means the element immediately before; "followed by" means immediately after.

## Removing elements

~~~
If all symbols are removed, which element is 5th from the right?
~~~

Rewrite the sequence without the removed elements before counting. Trying to skip elements mentally while counting is where most mistakes happen.

## Pattern among triplets

~~~
R4#, M7%, A2J, ...  "Which group doesn't belong?"
~~~

Look at the types (letter-number-symbol) of each triplet. Groups following the same type pattern belong together; the odd one breaks it.

## Reversal and rearrangement

Questions may say: "If the sequence is reversed, which element is 6th from the left?" The 6th from the left of the reversed sequence is the 6th from the right of the original, so no rewriting is needed.

Position identity: for a sequence of length N, position p from the left is position N − p + 1 from the right.

## Avoiding counting errors

- number the positions in pencil above the sequence on rough paper
- count from the left for everything, converting right-based references with N − p + 1
- rewrite the sequence when elements are removed or rearranged
- re-check the boundary elements (first and last) for neighbour conditions; they have only one neighbour

## Coding-style alphanumeric patterns

Some questions map letters to numbers via a rule (A = 1, B = 2) and ask for the code of a word. These overlap with coding-decoding; treat them the same way.

## Practice routine

When practising, time yourself on full sets of five questions about one sequence, since that's how tests present them. Rewriting the sequence with position numbers before answering costs about 20 seconds and prevents the counting slips that cause most wrong answers in this topic. Check your final answer by counting again from the opposite end.

## How interviewers test this

Expect patterned alphanumeric next terms, position questions from either end, midpoints, neighbour-condition counting, and questions after removing a category. Convert to left positions, use N − p + 1 for right-based positions, check neighbour conditions one element at a time, and rewrite the sequence when it changes.`,
    sources: [WIKI_SEQUENCE, KHAN_LOGIC],
  },

  "analogies": {
    theory: `An analogy question gives a pair of related items and asks you to find another pair with the same relationship: "Doctor : Hospital :: Teacher : ?" The answer is School, because a doctor works in a hospital as a teacher works in a school. Analogies test whether you can identify a relationship precisely and apply it consistently. They appear with words, numbers and letters. This lesson covers the common relationship types, number and letter analogies, and a method for choosing between close options.

## The method

1. **state the relationship** in the first pair as a precise sentence: "a doctor works in a hospital"
2. **apply the sentence** to the second pair: "a teacher works in a ___"
3. if several options fit, **make the sentence more specific** until only one works
4. check the **direction**: Puppy : Dog is young to adult, not adult to young

## Common word relationships

| Relationship | Example |
|---|---|
| Worker and workplace | Chef : Kitchen |
| Worker and tool | Carpenter : Saw |
| Worker and product | Author : Book |
| Part and whole | Petal : Flower |
| Young and adult | Calf : Cow |
| Male and female | Lion : Lioness |
| Synonyms | Brave : Courageous |
| Antonyms | Ancient : Modern |
| Cause and effect | Virus : Disease |
| Instrument and measure | Thermometer : Temperature |
| Individual and group | Wolf : Pack |
| Country and capital | Japan : Tokyo |
| Degree or intensity | Warm : Hot |
| Animal and home | Bee : Hive |
| Function | Pen : Write |

## Choosing between close options

~~~
Book : Library :: Painting : ?
Options: Artist, Gallery, Canvas, Frame
"Books are kept and displayed in a library" → paintings are kept and displayed in a gallery
~~~

Artist is the creator (a different relationship), Canvas is the material, Frame is a part. A precise sentence eliminates them.

## Number analogies

The relationship is an arithmetic rule:

~~~
3 : 27 :: 5 : ?  → cube → 125
7 : 50 :: 9 : ?  → n² + 1 → 82
12 : 36 :: 15 : ?  → × 3 → 45
~~~

Check squares, cubes, n² ± 1, multiplication and digit operations. Sometimes the second number is formed from the first's digits: 23 : 6 (2 × 3) :: 45 : 20 (4 × 5).

Verify the rule doesn't fit a second interpretation: 4 : 16 could be "square" or "× 4"; the second pair decides.

## Letter analogies

Track the shift between letters:

~~~
ACE : BDF :: GIK : ?  → each letter +1 → HJL
AZ : BY :: CX : ?  → first +1, second −1 → DW
~~~

Letter positions and opposite pairs (A-Z, B-Y) from the alphabet series lesson make these quick.

## Double analogies

Some questions have blanks in both pairs:

~~~
? : Fish :: Aviary : ?
Options: (Aquarium, Birds), (Water, Air), (Pond, Nest)
"An aquarium houses fish; an aviary houses birds" → (Aquarium, Birds)
~~~

## Choosing a pair with the same relationship

~~~
Find the pair with the same relationship as Eye : See
Options: Ear : Sound, Nose : Smell, Hand : Glove, Leg : Knee
"The eye is the organ used to see" → nose is the organ used to smell
~~~

Ear : Sound fails because "sound" is what's heard, not the action.

## Grammatical consistency

Parts of speech should match: Run : Ran (present to past) pairs with Write : Wrote, not Write : Writer.

## Common traps

- choosing a word associated with the second term rather than one with the same relationship
- reversing the direction
- accepting the first option that seems related without checking others
- ignoring part of speech or tense

## How interviewers test this

Expect word analogies across the relationship types above, number analogies based on powers and arithmetic, letter-shift analogies and "choose the matching pair" questions. State the relationship as a precise sentence, check direction and part of speech, and refine the sentence when options compete.`,
    sources: [WIKI_ANALOGY, KHAN_LOGIC],
  },

  "odd-one-out": {
    theory: `Odd-one-out (classification) questions give four or five items and ask which doesn't belong. Every item except one shares a property, and your job is to find that property. The items may be words, numbers, letter groups or figures. The challenge is that several properties may seem plausible; the correct one makes exactly one item the odd one out. This lesson covers the common properties for each item type, a method for testing candidates and the traps to avoid.

## The method

1. find a property shared by **most** items
2. check that exactly **one** item lacks it
3. if two items lack it, or none do, try another property
4. prefer the most specific, objective property over vague associations

## Word classification

Common grouping properties:

| Property | Example set (odd one in brackets) |
|---|---|
| Category | Rose, Lily, Lotus, (Mango) → flowers vs fruit |
| Living vs non-living | Dog, Cat, Parrot, (Car) |
| Function | Pen, Pencil, Marker, (Eraser) → writes vs erases |
| Habitat | Shark, Whale, Octopus, (Camel) → sea creatures |
| Part of speech | Run, Jump, Swim, (Happy) → verbs vs adjective |
| Synonym group | Big, Large, Huge, (Tiny) |
| Profession and tool | Hammer, Saw, Chisel, (Stethoscope) → carpentry tools |

~~~
Odd one out: Mercury, Venus, Earth, Moon, Mars
All except Moon are planets → Moon
~~~

## Number classification

Check these properties:

- **even or odd**: 12, 18, 24, (27), 30
- **prime or composite**: 13, 17, (21), 23, 29
- **perfect squares or cubes**: 16, 36, 49, (54), 81
- **divisibility**: 15, 25, 35, (42), 55 → multiples of 5
- **digit sum**: 123, 312, 231, (124) → digit sum 6
- **pattern within the number**: 2-4-8 relationships, reversed digits

~~~
Odd one out: 21, 35, 49, 63, 74
All except 74 are multiples of 7 → 74
~~~

When several properties seem to work, the intended one makes exactly one number different. For 9, 16, 25, 30, 36: all except 30 are perfect squares, which is cleaner than "all except 25 and 9 are even", which doesn't isolate one number.

## Number pairs

~~~
Odd one out: (3, 9), (4, 16), (5, 25), (6, 30)
First three: second = first squared → (6, 30)
~~~

## Letter group classification

Check positions, skips and vowels:

~~~
ACE, GIK, MOQ, (RTX), SUW
Pattern: skip one letter each (+2, +2). RTX: R → T is +2, T → X is +4 → odd one
~~~

Other letter properties: vowel count, alphabetical order, symmetrical opposite pairs, or position sums.

## Figure classification

Look for counts (sides, lines, dots), symmetry, rotation direction, shading and whether shapes are open or closed. Count methodically rather than judging at a glance.

## Choosing the strongest property

Sometimes two different items could each be odd under different properties:

~~~
Apple, Banana, Carrot, Mango
Carrot is a vegetable; the rest are fruits → Carrot
(Banana is the only yellow one, but colour is a weaker, less objective property)
~~~

Prefer scientific or definitional categories over incidental ones like colour or spelling, unless the set clearly points to a spelling-based rule.

## Speed tips

- for numbers, check divisibility and squares first; they're the most common rules
- for words, check category, function and part of speech
- for letters, write positions and check skips
- if stuck, test each option as the odd one and see whether the remaining items share a clear property

## Common traps

- picking an item that differs in a trivial way while missing the intended category
- accepting a property that leaves two items different
- overthinking: tests usually use straightforward categories

## A worked set

~~~
27, 64, 125, 144, 216    → all except 144 are perfect cubes → 144
BDF, HJL, NPR, TVY       → +2, +2 in all except TVY (+2, +3) → TVY
Violin, Guitar, Sitar, Flute → string instruments vs a wind instrument → Flute
~~~

In each case, the chosen property leaves exactly one item out, which confirms it's the intended rule.

## How interviewers test this

Expect word, number, number-pair, letter-group and figure classification. Find a property shared by all but one, confirm it isolates exactly one item, and prefer definitional categories over incidental features.`,
    sources: [WIKI_ANALOGY, KHAN_LOGIC],
  },

  "coding-decoding": {
    theory: `Coding-decoding questions encrypt words or numbers using a hidden rule and ask you to find the rule and apply it to a new word. They're small cipher puzzles, the same idea as the Caesar cipher used by Julius Caesar, where every letter shifts by a fixed amount. Placement tests use letter shifts, reversals, position-based numeric codes, symbol substitution and sentence-based codes. This lesson covers each type with a method for cracking the rule quickly.

## Letter shifting

Each letter moves forward or backward by a fixed or patterned amount:

~~~
If CAT is coded as DBU, how is DOG coded?
C → D, A → B, T → U: each +1 → DOG → EPH
~~~

The shift may change by position:

~~~
If BOOK is coded as CQRO:
B +1 = C, O +2 = Q, O +3 = R, K +4 = O → shifts +1, +2, +3, +4
~~~

Always compare letter by letter and write the shift for each position.

## Reversal

The word may be reversed, with or without a shift:

~~~
If PAPER is coded as REPAP, then PENCIL is LICNEP
~~~

~~~
If MANGO is coded as PDQJR, check: M +3 = P, A +3 = D, N +3 = Q, G +3 = J, O +3 = R → shift +3, no reversal
~~~

Check both possibilities when the coded letters look rearranged.

## Opposite letters

Each letter may be replaced by its opposite (A-Z, B-Y, ...), so the position becomes 27 − n:

~~~
If GOD is coded as TLW: G (7) → T (20), O (15) → L (12), D (4) → W (23) → opposites
~~~

## Numeric codes

Letters become numbers using positions:

~~~
If CAB = 312, then BAD = 214 (each letter's position)
~~~

Variations:

- **sum of positions**: CAT = 3 + 1 + 20 = 24
- **reverse positions**: A = 26, B = 25
- **position × constant** or **position + constant**
- **product of positions**: rare but seen

~~~
D = 4, E = 5, A = 1, F = 6 → DEAF = 4516, so FACE = 6135
~~~

## Symbol substitution

Each letter or digit maps to a symbol through a table given in the question. Apply the table carefully, character by character, and check any special conditions (for example, "if the first letter is a vowel, swap the first and last codes").

## Sentence (word-to-word) codes

~~~
"sky is blue" is coded as "ta ne ri"
"blue is nice" is coded as "ri ta mo"
"sky looks nice" is coded as "ne mo pa"
What is the code for "looks"?
~~~

Compare sentences sharing words:

- sentences 1 and 2 share "is" and "blue" and the codes "ta" and "ri"
- sentences 1 and 3 share "sky" and the code "ne" → sky = ne
- sentences 2 and 3 share "nice" and the code "mo" → nice = mo
- in sentence 3, "looks" must be the remaining code: pa

The position of a word in a sentence usually doesn't match its code's position, so match by common words, not by order.

## Conditional coding

Some questions give a letter-to-code table plus conditions:

- if the first element is a vowel and the last a consonant, their codes swap
- if both the first and last are consonants, both are coded as a specific symbol

Apply conditions in the order given, and check which condition applies before coding.

## Method summary

1. write the original and coded forms in aligned columns
2. compute the shift or mapping for each position
3. look for a pattern: constant, increasing, alternating, reversed or opposite
4. verify against every given example
5. apply the rule to the target word

## Speed tips

- know letter positions instantly (EJOTY) and opposite pairs
- check reversal when the first coded letter relates to the last original letter
- in sentence codes, start with the pair of sentences sharing exactly one word

## How interviewers test this

Expect letter shifts (constant and patterned), reversals, opposite-letter codes, numeric position codes, symbol tables with conditions and sentence-based codes. Align letters, compute shifts per position, verify on all examples and, for sentence codes, isolate words through overlaps.`,
    sources: [WIKI_CIPHER, KHAN_LOGIC],
  },

  "blood-relations": {
    theory: `Blood relation questions describe family relationships in words and ask how two people are related: "Pointing to a man, Asha says, 'He is the son of my grandfather's only son.' How is the man related to Asha?" The answer here is brother. These questions test careful reading and the ability to build a family tree mentally or on paper. This lesson covers relationship vocabulary, a family-tree notation, coded relations and the common traps around gender and generations.

## Relationship vocabulary

| Relation | Meaning |
|---|---|
| Father's or mother's father | Grandfather |
| Father's or mother's brother | Uncle |
| Father's or mother's sister | Aunt |
| Uncle's or aunt's child | Cousin |
| Brother's or sister's son | Nephew |
| Brother's or sister's daughter | Niece |
| Husband's or wife's father | Father-in-law |
| Husband's or wife's brother | Brother-in-law |
| Sister's husband | Brother-in-law |
| Son's wife | Daughter-in-law |
| Grandson's or granddaughter's child | Great-grandchild |

## Family-tree notation

Draw a quick diagram:

- **+** for male, **−** for female (or squares and circles)
- a horizontal line for siblings
- a vertical line for parent-child
- a double line or = for married couples
- keep each generation on its own level

## Solving step by step

Break long statements from the end, the person closest to the speaker:

~~~
"He is the son of my grandfather's only son."
My grandfather's only son → my father (the speaker's father is the only son)
Son of my father → my brother (or me, if the speaker were male; here it's a man and the speaker is Asha, female)
Answer: brother
~~~

~~~
Introducing a woman, Ravi says, "Her mother is the only daughter of my mother."
Only daughter of Ravi's mother → Ravi's sister
The woman's mother is Ravi's sister → the woman is Ravi's niece
~~~

## Pointing and introducing questions

Identify who is speaking, who is pointed at, and work from the speaker's side. Phrases like "my father's only son" usually mean the speaker himself (if male), a common trick.

## Coded relations

Some questions define symbols:

~~~
A + B means A is the father of B
A − B means A is the wife of B
A × B means A is the brother of B
A ÷ B means A is the daughter of B
What does P + Q × R mean?
P is the father of Q, and Q is the brother of R → P is the father of R
~~~

Translate each symbol into a link on the tree, then read off the final relationship. If the question asks which expression means "M is the uncle of N", test each option by drawing it.

## Gender can be unknown

A frequent trap: a statement may not reveal someone's gender.

~~~
A is the sibling of B. B is the son of C. How is A related to C?
A is C's child, but A's gender is unknown → A could be son or daughter → "cannot be determined" if both options appear
~~~

Read options carefully; "child" may be correct where "son" isn't determinable.

## Generation counting

Count generation differences: grandparent (two up), parent (one up), sibling and cousin (same), child (one down), grandchild (two down). Many errors come from collapsing two generations into one.

## Puzzle-type questions

Larger sets describe a family of 6 to 8 members with professions or ages:

1. start with definite relationships (married couples, parent-child)
2. place people on generation levels
3. add genders as they're revealed
4. answer each question from the completed tree

## Common traps

- confusing "my mother's brother's son" (cousin) with "my brother's son" (nephew)
- assuming gender from a name
- forgetting in-law relationships go through a spouse
- misreading "only son" or "only daughter"

## Practice routine

For every practice question, draw the tree even when the answer seems obvious. The habit pays off on longer chains, where mental tracking breaks down, and the drawings show exactly where a misread phrase led you astray.

## How interviewers test this

Expect pointing and introducing statements, chains like "my father's sister's son", coded relation symbols and family puzzles with several members. Draw a tree with gender and generation levels, work from the speaker outward, and choose "cannot be determined" when gender isn't fixed.`,
    sources: [WIKI_KINSHIP, KHAN_LOGIC],
  },

  "direction-sense": {
    theory: `Direction sense questions describe a person moving through a series of turns and distances and ask where they end up, which direction they face, or how far they are from the start. They test spatial reasoning and careful tracking. With a quick sketch and the Pythagorean theorem, nearly all of them are routine. This lesson covers the compass, left and right turns, tracking net displacement, shadows, and the common question patterns.

## The compass

- four main directions: North (up), South (down), East (right), West (left)
- four intermediate directions: North-East, North-West, South-East, South-West, each 45° between two main directions

Always draw North at the top of your sketch.

## Turning left and right

A turn depends on the direction you're facing:

| Facing | Right turn faces | Left turn faces |
|---|---|---|
| North | East | West |
| East | South | North |
| South | West | East |
| West | North | South |

A right turn is 90° clockwise; a left turn is 90° anticlockwise. Two right turns reverse your direction. Questions sometimes use degrees: turning 135° clockwise from North faces South-East.

## Tracking movement

~~~
A man walks 5 km North, turns right and walks 3 km, turns right and walks 9 km. How far and in which direction is he from the start?
North 5 → (0, 5); right turn faces East, 3 km → (3, 5); right turn faces South, 9 km → (3, −4)
Distance = √(3² + 4²) = 5 km; direction: South-East
~~~

Using coordinates (x for East-West, y for North-South) makes tracking reliable: add East and North, subtract West and South.

## Net displacement

Distance travelled differs from displacement. In the example, the man travelled 17 km but ended 5 km from the start. Questions ask for the **shortest distance** from the start, which is the straight-line displacement.

## Direction of the final position

- positive x and positive y: North-East
- positive x and negative y: South-East
- negative x and positive y: North-West
- negative x and negative y: South-West
- one coordinate zero: a main direction

## Facing direction versus position

Two different questions can be asked:

- "In which direction is he from the starting point?" → position relative to start
- "In which direction is he facing now?" → direction of the last movement or turn

Read the question carefully; mixing these up is a classic error.

## Shadows

The sun rises in the East and sets in the West:

- in the **morning**, the sun is in the East, so shadows point **West**
- in the **evening**, the sun is in the West, so shadows point **East**
- at **noon**, there's essentially no horizontal shadow (in most placement questions)

~~~
One morning, Riya stood facing a pole. The pole's shadow fell exactly to her right. Which direction was she facing?
Morning shadow points West → West is on her right → she faces South
~~~

If West is on your right, you face South; if West is on your left, you face North.

## Pythagorean triples help

Distances are usually chosen to form triples: (3, 4, 5), (5, 12, 13), (6, 8, 10), (8, 15, 17). Recognizing them avoids square roots.

## Multi-person questions

When two people start from the same point and walk in different directions, compute each final position, then the distance between them:

~~~
A walks 6 km East; B walks 8 km North. Distance between them? √(36 + 64) = 10 km
~~~

## Rotated directions

Some questions rename directions ("if North becomes East, what does South-West become?"). Find the rotation (here 90° clockwise) and apply it to every direction: South-West becomes North-West.

## Common mistakes

- turning relative to the page instead of the person's facing direction
- confusing position from start with facing direction
- forgetting to subtract opposite movements
- reversing shadow directions

## Practice routine

Sketch every question, however short, with North at the top and the start marked clearly. Labelling each segment with its distance and direction takes seconds and makes final positions, distances and facing directions straightforward to read off.

## How interviewers test this

Expect multi-turn walks asking for distance and direction from the start, facing direction after turns, shadow questions and rotated-direction questions. Sketch with North up, track coordinates, use Pythagorean triples for distance, and read whether the question asks about position or facing.`,
    sources: [WIKI_COMPASS, KHAN_LOGIC],
  },

  "ranking-and-ordering": {
    theory: `Ranking and ordering questions involve positions in a row or queue, ranks in a class, or comparisons of height, weight and marks. Two families appear: **positional ranking** (positions from the left or right, top or bottom) and **comparison ordering** (arranging people from statements like "A is taller than B but shorter than C"). This lesson covers the position formulas, interchanging positions, comparison chains and how to handle uncertain information.

## Position from both ends

For a single row of N people, a person at position L from the left and R from the right satisfies:

~~~
N = L + R − 1
~~~

The person is counted twice when adding both positions, so subtract 1.

~~~
Ravi is 12th from the left and 18th from the right. How many people are in the row?
12 + 18 − 1 = 29
~~~

The same formula applies to ranks from the top and bottom of a class.

## People between two others

If A is at position a and B at position b (both from the same end), the number of people between them is |a − b| − 1.

~~~
In a row of 40, A is 10th from the left and B is 15th from the right. How many people are between them?
B from the left = 40 − 15 + 1 = 26 → between = 26 − 10 − 1 = 15
~~~

Convert both positions to the same end before comparing. If the positions overlap (A's position from the left is beyond B's), the counting changes: the people "between" are counted differently, so draw the row.

## Interchanging positions

~~~
In a row, A is 8th from the left and B is 12th from the right. They swap places, and A becomes 15th from the left. How many people are in the row?
A's new position is B's old position: 15th from the left and 12th from the right → N = 15 + 12 − 1 = 26
~~~

After a swap, combine the new position from one end with the old position from the other end for the same spot.

## Minimum number of people

~~~
In a queue, A is 10th from the front and B is 8th from the back. What's the minimum number of people?
A needs at least 10 people. With exactly 10, B (8th from the back) stands 3rd from the front, a different spot from A, so both fit.
Minimum: 10. (If B had to stand behind A, the minimum would be 10 + 8 = 18.)
~~~

Minimum questions depend on whether the two positions can overlap or must be on opposite sides of each other, so draw the queue for each case.

## Comparison ordering

Statements compare people on one attribute:

~~~
A is taller than B. C is shorter than B. D is taller than A. Who is the shortest?
Build a chain: D > A > B > C → C is the shortest
~~~

Method:

1. write each comparison as an inequality
2. combine them into a single chain where possible
3. if someone's position isn't fixed, note the possible range

## Uncertain positions

~~~
P scored more than Q. R scored less than P but more than S. Who scored the least?
P > Q, P > R > S → Q and S are both below P, but Q's relation to R and S is unknown
The least scorer could be Q or S → cannot be determined
~~~

Only answer definitively when the chain fixes the position; otherwise, choose "cannot be determined".

## Ranks with ties and additions

- if two students share a rank, the next rank is skipped (two students tied at 3rd means the next is 5th)
- when students join or leave a class, recompute positions from the end affected

~~~
In a class of 30, Meera ranks 7th from the top. Five students below her leave. Her rank from the bottom?
New class size 25; from the top she is still 7th → from the bottom: 25 − 7 + 1 = 19
~~~

## Multiple rows and grids

For people in a grid, the row formula applies separately to each direction: a person 4th from the left and 3rd from the right in a row of a grid means each row has 6 people; combine with column positions to find the total.

## Common mistakes

- forgetting to subtract 1 in N = L + R − 1
- comparing positions measured from different ends
- assuming a chain fixes everyone when some relations are unknown
- miscounting people between two positions

## How interviewers test this

Expect total-people questions from both-end positions, people between two positions, swaps, ranks after students leave, comparison chains and "cannot be determined" cases. Use N = L + R − 1, convert to one end before comparing, draw rows for overlaps, and build inequality chains for comparisons.`,
    sources: [KHAN_LOGIC, WIKI_SEQUENCE],
  },

  "clocks-calendars": {
    theory: `Clocks and calendars questions ask for the angle between clock hands, when the hands overlap or are opposite, how much a fast or slow clock gains, and what day of the week a given date falls on. Both topics rely on a few formulas and on careful counting. This lesson covers hand speeds and angle formulas, overlap and straight-line times, faulty clocks, odd days, leap years and calendar repetition.

## Clock hand speeds

- the minute hand moves 360° in 60 minutes: **6° per minute**
- the hour hand moves 30° per hour: **0.5° per minute**
- the minute hand gains **5.5° per minute** on the hour hand

## Angle between the hands

At H hours and M minutes:

~~~
Angle = |30H − 5.5M|
~~~

If the result exceeds 180°, subtract it from 360° to get the smaller angle.

~~~
Angle at 3:40:
|30 × 3 − 5.5 × 40| = |90 − 220| = 130°
~~~

~~~
Angle at 9:15:
|270 − 82.5| = 187.5° → smaller angle 172.5°
~~~

## When hands overlap

The hands overlap 11 times in 12 hours (22 times in a day), not 12, because the overlap near 12 o'clock happens only once. Between H and H + 1 o'clock, they overlap at:

~~~
M = 60H/11 minutes past H
~~~

~~~
Between 4 and 5: 240/11 = 21 9/11 minutes past 4
~~~

## Hands opposite (180°) and at right angles

- **opposite**: solve 30H − 5.5M = ±180
- **right angle (90°)**: solve 30H − 5.5M = ±90; this happens 22 times in 12 hours (44 in a day)
- **straight line** (overlapping or opposite): 22 times in 12 hours

~~~
When between 2 and 3 are the hands at right angles?
60 − 5.5M = −90 → M = 27 3/11 minutes past 2 (the other solution, 60 − 5.5M = 90, gives a negative M, so only one time falls in this hour)
~~~

## Faulty clocks

The hands of a correct clock overlap every 720/11 = 65 5/11 minutes. If they overlap every 64 minutes instead, the clock runs fast:

~~~
Gain per 64 minutes of the faulty clock = 65 5/11 − 64 = 16/11 minutes
In 24 hours (1,440 minutes): 1,440/64 × 16/11 = 32 8/11 minutes gained
~~~

For a clock that gains or loses a fixed amount per hour, compute the total gain over the interval and add or subtract it.

## Mirror images of clocks

The time seen in a mirror equals 11:60 minus the actual time (for times between 1:00 and 11:00). A clock showing 3:20 appears as 8:40 in a mirror.

## Calendars: odd days

**Odd days** are the days left over after complete weeks. A date's day of the week shifts by the number of odd days.

- an ordinary year has 365 days = 52 weeks + 1 odd day
- a leap year has 366 days = 52 weeks + 2 odd days
- 100 years contain 5 odd days, 200 years 3, 300 years 1, and 400 years 0

## Leap years

A year is a leap year if it's divisible by 4, except century years, which must be divisible by 400. So 2000 was a leap year, 1900 wasn't, and 2024 is.

## Finding the day for a date

~~~
If 1 January 2023 was a Sunday, what day was 1 January 2024?
2023 is ordinary → 1 odd day → Monday
~~~

~~~
If 15 August 2022 was a Monday, what day is 15 August 2023?
From 15 Aug 2022 to 15 Aug 2023 includes February 2023 (not leap) → 1 odd day → Tuesday
~~~

For dates within a year, count days between them and take the remainder modulo 7. Month odd days: 31-day months give 3, 30-day months give 2, February gives 0 (or 1 in a leap year).

## Repeating calendars

A year's calendar repeats when the total odd days in between is a multiple of 7 and the leap-year status matches. Ordinary years usually repeat after 6 or 11 years; a leap year's calendar repeats after 28 years.

~~~
The calendar of 2021 repeats in 2027 (odd days: 2021 to 2026 sum to 7, and 2027 is ordinary)
~~~

## Common mistakes

- forgetting the hour hand moves during the minutes
- assuming 12 overlaps in 12 hours
- treating century years as leap years automatically
- miscounting odd days by including or excluding the start date inconsistently

## How interviewers test this

Expect clock angles, overlap and right-angle times, faulty clock gains, mirror times, day-of-week calculations using odd days, leap-year checks and repeating calendars. Use |30H − 5.5M|, 60H/11 for overlaps, the leap-year rule with the century exception, and odd days modulo 7.`,
    sources: [WIKI_CLOCK, WIKI_DOOMSDAY],
  },
};
