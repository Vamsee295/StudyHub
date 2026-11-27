// Reasoning topics that complete the placement syllabus: logical sequence of words, essential part, artificial
// language, verification of truth, arithmetic reasoning, mathematical operations, making judgments. Original writing.
import type { FullLesson } from './apt-extra-types';

const WIKI_LOGIC = { title: "Wikipedia: Logical reasoning", url: "https://en.wikipedia.org/wiki/Logical_reasoning" };
const WIKI_NEC = { title: "Wikipedia: Necessity and sufficiency", url: "https://en.wikipedia.org/wiki/Necessity_and_sufficiency" };
const WIKI_CIPHER = { title: "Wikipedia: Substitution cipher", url: "https://en.wikipedia.org/wiki/Substitution_cipher" };
const WIKI_WORD = { title: "Wikipedia: Word problem (mathematics education)", url: "https://en.wikipedia.org/wiki/Word_problem_(mathematics_education)" };
const WIKI_ORDER = { title: "Wikipedia: Order of operations", url: "https://en.wikipedia.org/wiki/Order_of_operations" };
const WIKI_DEF = { title: "Wikipedia: Definition", url: "https://en.wikipedia.org/wiki/Definition" };
const KHAN_LSAT = { title: "Khan Academy: LSAT logical reasoning (free)", url: "https://www.khanacademy.org/prep/lsat" };

export const syllabusLogical: FullLesson[] = [
  {
    slug: "logical-sequence-of-words",
    title: "Logical Sequence of Words",
    description: "Arranging words in the order things happen, grow, or get bigger.",
    minutes: 20,
    theory: `In these questions you get four or five words and must put them in a sensible order: the order things happen, grow, or increase in size. The options show different orders as numbers, like 3, 1, 4, 2.

## Start here: what kind of order?

Ask which story the words tell. Almost every question uses one of these:

| Type of order | Example |
|---|---|
| life cycle or growth | seed → plant → tree → fruit |
| time of day or life | morning → noon → evening → night |
| process or steps | apply → interview → offer → join |
| small to big (size or area) | village → district → state → country |
| part to whole | letter → word → sentence → paragraph |
| cause to effect | cloud → rain → flood → relief |
| dictionary (alphabetical) order | when the question asks for it |

## Method step by step

1. Read all the words and decide which kind of order they form
2. Find the **first** item (the start of the process, the smallest thing)
3. Find the **last** item
4. Fit the middle ones between them
5. Check the options: often you can eliminate three as soon as you know the first and last word

## Worked examples

**Example 1 (warm-up).** 1. Tree 2. Seed 3. Fruit 4. Plant

Growth order: Seed, Plant, Tree, Fruit = **2, 4, 1, 3**.

**Example 2.** 1. Country 2. Village 3. State 4. District

Smallest to largest area: Village, District, State, Country = **2, 4, 3, 1**.

**Example 3.** 1. Exam 2. Admission 3. Result 4. Study

What a student goes through: Admission, Study, Exam, Result = **2, 4, 1, 3**.

**Example 4 (test level).** 1. Pupa 2. Egg 3. Butterfly 4. Larva

A butterfly's life cycle: Egg, Larva, Pupa, Butterfly = **2, 4, 1, 3**. This one needs a little science; questions like it test general knowledge as well as logic.

**Example 5 (dictionary order).** Arrange as in a dictionary: 1. Plate 2. Plain 3. Plant 4. Plane

Compare letter by letter. All start with "pla". Fourth letters: plai(n), plan(e), plan(t), plat(e). "i" comes first, then "n", then "t": Plain, then Plane and Plant (both "plan"; fifth letters e before t), then Plate = **2, 4, 3, 1**.

## Elimination saves time

If you're sure the first word is item 2, cross out every option that doesn't start with 2. Usually one or two remain, and checking the last word settles it.

## Traps in this topic

- mixing two kinds of order (size and time) in one answer
- in dictionary order, stopping at the first different letter too early or too late
- picking a familiar phrase order instead of the logical one

## Practice

1. 1. Infant 2. Adult 3. Child 4. Teenager
2. 1. Minute 2. Day 3. Second 4. Hour
3. 1. Chapter 2. Page 3. Library 4. Book

**Answers:** 1) Infant, Child, Teenager, Adult = **1, 3, 4, 2**. 2) Second, Minute, Hour, Day = **3, 1, 4, 2**. 3) Page, Chapter, Book, Library = **2, 1, 4, 3**.`,
    sources: [WIKI_LOGIC],
    remember: [
      "First decide the kind of order: growth, time, steps, size, part-to-whole or cause-effect",
      "Fix the first and last items, then fill the middle",
      "Eliminate options by their first number",
      "Dictionary order: compare letter by letter until they differ",
    ],
    quick: { question: "Arrange: 1. Tree 2. Seed 3. Fruit 4. Plant", options: ["2, 4, 1, 3", "2, 1, 4, 3", "4, 2, 1, 3", "1, 2, 3, 4"], answer: 0, explanation: "Seed → Plant → Tree → Fruit." },
    questions: [
      { q: "Arrange: 1. Country 2. Village 3. State 4. District", o: ["2, 4, 3, 1", "2, 3, 4, 1", "1, 3, 4, 2", "4, 2, 3, 1"], a: 0, e: "Village → District → State → Country." },
      { q: "Arrange: 1. Pupa 2. Egg 3. Butterfly 4. Larva", o: ["2, 4, 1, 3", "2, 1, 4, 3", "4, 2, 1, 3", "2, 4, 3, 1"], a: 0, e: "Egg → Larva → Pupa → Butterfly." },
      { q: "Arrange as in a dictionary: 1. Plate 2. Plain 3. Plant 4. Plane", o: ["2, 4, 3, 1", "2, 3, 4, 1", "4, 2, 3, 1", "1, 2, 3, 4"], a: 0, e: "Plain, Plane, Plant, Plate." },
      { q: "Arrange: 1. Minute 2. Day 3. Second 4. Hour", o: ["3, 1, 4, 2", "1, 3, 4, 2", "3, 4, 1, 2", "2, 4, 1, 3"], a: 0, e: "Second → Minute → Hour → Day." },
    ],
    visual: {
      plain: "Line the words up like photos in an album: the first photo is where the story starts, the last is where it ends, and the rest fall into place between them.",
      diagram: `flowchart LR
  S["Seed"] --> P["Plant"] --> T["Tree"] --> F["Fruit"]`,
      caption: "Find the start and the end first.",
    },
  },
  {
    slug: "essential-part",
    title: "Essential Part",
    description: "Picking the one thing something can't exist without.",
    minutes: 20,
    theory: `"Essential part" questions name a thing and give four options. You must choose the one the thing **cannot exist without**. Everything else might often go with it, but isn't required.

## Start here: necessary versus common

| Thing | Essential | Common but not essential |
|---|---|---|
| book | pages | pictures, index, hard cover |
| school | students | uniform, bus, canteen |
| fire | oxygen | smoke, wood, matches |
| river | water | fish, boats, bridges |
| game | rules | referee, trophy, spectators |

The test fits in one line: **imagine the thing without the option**. If it can still be that thing, the option isn't essential.

## Method step by step

1. Read the thing in the question and all four options
2. For each option ask: "Can this thing exist without it?"
3. Cross out every option that passes ("yes, it can")
4. The one left is the essential part

## Worked examples

**Example 1 (warm-up).** Which is essential to a book? Pictures, Pages, Index, Cover art.

A book can have no pictures, no index and plain covers, but no book has zero pages. Answer: **Pages**.

**Example 2.** Which is essential to an election? Posters, Voters, Speeches, Rallies.

Elections happen without posters or rallies, but never without voters. Answer: **Voters**.

**Example 3.** Which is essential to a computer? Printer, Processor, Mouse, Speaker.

A computer can run without any of the add-ons, but not without a processor. Answer: **Processor**.

**Example 4 (test level).** Which is essential to a desert? Camels, Sand dunes, Low rainfall, Oases.

Many deserts have no camels or oases, and some (like cold deserts) have little sand. What makes a place a desert is **low rainfall**.

**Example 5.** Which is essential to a song? Guitar, Singer, Melody, Album.

Instrumental songs have no singer; songs can be played without a guitar or released without an album. Answer: **Melody**.

## The idea underneath

Logicians call an essential part a **necessary condition**: if it's missing, the thing can't exist. Verification-of-truth questions ("a tree always has…") use exactly the same thinking.

## Traps in this topic

- picking the option most strongly associated with the thing (camels and deserts) instead of the one it needs
- choosing a feature that's true of most examples but not all
- forgetting unusual cases: cold deserts, instrumental music, e-books

## Practice

1. Which is essential to a shoe? Laces, Sole, Buckle, Polish
2. Which is essential to a hospital? Parking, Patients, Garden, Canteen
3. Which is essential to a race? Spectators, Trophy, Competitors, Referee

**Answers:** 1) **Sole** (slip-ons have no laces). 2) **Patients**. 3) **Competitors** (a race needs at least two).`,
    sources: [WIKI_NEC],
    remember: [
      "Essential means the thing can't exist without it",
      "Test each option: imagine the thing without it",
      "Don't pick the strongest association; pick the necessity",
      "Think of unusual examples: cold deserts, instrumental songs",
    ],
    quick: { question: "Which is essential to a book?", options: ["Pages", "Pictures", "Index", "Cover art"], answer: 0, explanation: "A book can lack the others, but not pages." },
    questions: [
      { q: "Which is essential to an election?", o: ["Voters", "Posters", "Speeches", "Rallies"], a: 0, e: "No voters, no election." },
      { q: "Which is essential to a desert?", o: ["Low rainfall", "Camels", "Sand dunes", "Oases"], a: 0, e: "Low rainfall defines a desert; cold deserts may have little sand." },
      { q: "Which is essential to a song?", o: ["Melody", "Singer", "Guitar", "Album"], a: 0, e: "Instrumental songs have no singer, but every song has a melody." },
      { q: "Which is essential to fire?", o: ["Oxygen", "Smoke", "Wood", "Matches"], a: 0, e: "Burning needs oxygen; the others aren't required." },
    ],
    visual: {
      plain: "Take away each option, one at a time. If the thing is still that thing, the option was optional. The one whose removal breaks the thing is the essential part.",
      diagram: `flowchart LR
  B["Book"] --> X1["without pictures: still a book"]
  B --> X2["without an index: still a book"]
  B --> X3["without pages: not a book"]
  X3 --> A["Pages are essential"]`,
      caption: "Remove each option and see what survives.",
    },
  },
  {
    slug: "artificial-language",
    title: "Artificial Language",
    description: "Decoding made-up languages by comparing sentences that share words.",
    minutes: 25,
    theory: `Artificial (or coded) language questions give a few sentences in a made-up language with their English meanings, then ask what one word means. The trick is that the made-up words may come in any order, so you can't match by position. You match by **what's common**.

## Start here: the common-word rule

If a word appears in two English sentences, its code is the code that appears in **both** coded sentences.

~~~
'pa ki lo'  means  'red big ball'
'lo mu'     means  'ball game'
~~~

"ball" is in both English sentences; "lo" is in both coded ones. So **ball = lo**.

Then: 'pa ki' means 'red big' (in some order), and 'mu' means 'game'.

## Method step by step

1. Write each sentence pair on its own line
2. Find an English word that appears in two sentences
3. Find the code shared by the same two coded sentences: that's its code
4. Remove decoded words from the sentences and repeat with what's left
5. If a word appears in only one sentence and shares it with another unknown word, the answer may be "can't be determined"

## Worked examples

**Example 1 (warm-up).**

~~~
'ta ri' = 'good morning'
'ri zo' = 'morning tea'
~~~

morning is shared, ri is shared: **morning = ri**. So good = ta, tea = zo.

**Example 2.**

~~~
'mo na si' = 'sky is blue'
'si to na' = 'blue is deep'
'to pe'    = 'deep sea'
~~~

Sentences 1 and 2 share "is" and "blue", and the codes "na" and "si". Sentences 2 and 3 share "deep" and code "to": **deep = to**. Then sentence 3 gives **sea = pe**. Sentence 1's leftover word "sky" matches its leftover code: **sky = mo**. "is" and "blue" are na and si in some order, and no sentence tells them apart: that pair **can't be determined**.

**Example 3 (letters instead of words).** Some questions code letters: "if PEN is QFO, what is INK?" That's a letter shift (+1): **JOL**. The coding-decoding lesson covers these.

## When the answer is "can't be determined"

Two English words that always appear together, in exactly the same sentences, can never be separated. The answer is then "cannot be determined" or "either of two codes". Tests include this option on purpose.

## Traps in this topic

- matching by position ("the first English word is the first code")
- forgetting to use leftovers once other words are decoded
- forcing an answer when two words always travel together

## Practice

~~~
'kal tip mor' = 'eat fresh fruit'
'mor zan'     = 'fruit juice'
'tip lu zan'  = 'fresh orange juice'
~~~

1. What is the code for "fruit"?
2. What is the code for "juice"?
3. What is the code for "orange"?

**Answers:** 1) shared by sentences 1 and 2: **mor**. 2) shared by sentences 2 and 3: **zan**. 3) "fresh" is in sentences 1 and 3, shared code **tip**; the leftover in sentence 3 is **lu** = orange.`,
    sources: [WIKI_CIPHER],
    remember: [
      "Codes may be in any order: never match by position",
      "A word in two sentences has the code shared by both coded sentences",
      "Use leftovers once other words are decoded",
      "Words that always appear together can't be separated: 'can't be determined'",
    ],
    quick: { question: "'pa ki lo' = 'red big ball', 'lo mu' = 'ball game'. Code for 'ball'?", options: ["lo", "pa", "ki", "mu"], answer: 0, explanation: "'ball' is in both sentences and 'lo' is the only shared code." },
    questions: [
      { q: "'ta ri' = 'good morning', 'ri zo' = 'morning tea'. Code for 'good'?", o: ["ta", "ri", "zo", "Can't be determined"], a: 0, e: "morning = ri, so good = ta." },
      { q: "'mo na si' = 'sky is blue', 'si to na' = 'blue is deep', 'to pe' = 'deep sea'. Code for 'sky'?", o: ["mo", "na", "si", "to"], a: 0, e: "is and blue take na and si; deep = to; the leftover in sentence 1 is mo." },
      { q: "In the same language, what is the code for 'blue'?", o: ["Can't be determined", "na", "si", "mo"], a: 0, e: "'is' and 'blue' always appear together, so na and si can't be told apart." },
      { q: "Why can't you match coded words by position?", o: ["The codes may be in any order", "Codes are always reversed", "Every code is a letter shift", "English has no order"], a: 0, e: "These questions shuffle the code order on purpose." },
    ],
    visual: {
      plain: "It's like spotting a friend in two group photos: the only face in both photos is your friend. The only code in both coded sentences belongs to the only word in both English sentences.",
      diagram: `flowchart LR
  S1["pa ki lo = red big ball"] --> C{"shared"}
  S2["lo mu = ball game"] --> C
  C --> A["ball = lo"]`,
      caption: "Match what's common, not what's in the same position.",
    },
  },
  {
    slug: "verification-of-truth",
    title: "Verification of Truth",
    description: "What's always true of something, and truth-teller and liar puzzles.",
    minutes: 25,
    theory: `This topic has two kinds of question. The first asks what something **always** has ("a tree always has…"). The second gives statements from people who either always tell the truth or always lie, and asks you to work out who is who. Both test careful reading of "always", "never" and "some".

## Part 1: what's always true

Choose the option that holds for **every** example of the thing, not most of them.

| Statement | Always true | Often true, not always |
|---|---|---|
| A tree always has… | roots | fruits, flowers |
| A circle always has… | a centre | a diagonal (never, in fact) |
| A shadow always needs… | light | the sun |
| A language always has… | words | a script |

This is the same thinking as the essential-part lesson: test each option against unusual examples.

## Part 2: truth-tellers and liars

**Rules:**
- a truth-teller's statements are all true
- a liar's statements are all false
- some puzzles add an alternator, who switches between true and false

**Method: assume and test**

1. Assume one person is a truth-teller
2. Work out what that makes everyone else, using their statements
3. If you reach a contradiction, the assumption was wrong; try the other case
4. The case with no contradiction is the answer

## Worked example 1 (always true)

A desert always has… camels, sand, little rain, oases. Cold deserts have no camels or sand dunes; most deserts have no oases. Only **little rain** is true of every desert.

## Worked example 2 (two people)

A says: "B is a liar." B says: "We are both truth-tellers."

- Suppose A tells the truth. Then B is a liar, and B's statement "we are both truth-tellers" is false, which fits. No contradiction
- Suppose A lies. Then B is a truth-teller, so B's statement "we are both truth-tellers" must be true, which would make A a truth-teller too. Contradiction

So **A tells the truth and B lies**.

## Worked example 3 (three people)

Exactly one of P, Q and R is lying.
- P: "Q is lying."
- Q: "R is lying."
- R: "I am telling the truth."

Try each person as the single liar:
- P is the liar: then Q tells the truth, so R is lying. That makes two liars. Contradiction
- Q is the liar: then P is truthful ("Q is lying" ✔), R is truthful, and Q's "R is lying" is false ✔. Works
- R is the liar: then Q's "R is lying" is true and P's "Q is lying" must be true, making Q a liar too. Contradiction

**Q is the liar.**

## Traps in this topic

- choosing what's usually true instead of always true
- testing only one case in liar puzzles and stopping
- forgetting that a liar's every statement is false, including statements about themselves

## Practice

1. A book always has… pictures, pages, an index, a hard cover
2. X says "Y tells the truth." Y says "X is a liar." Who lies?
3. A says "I am a liar." Can A be either a truth-teller or a liar?

**Answers:** 1) **pages**. 2) If X is truthful, Y is truthful, but then Y's "X is a liar" is false: contradiction. So X lies, and then Y's statement is true: **X lies, Y tells the truth**. 3) **Neither works**: a truth-teller can't say it, and a liar saying it would be telling the truth. Such a statement can't come from either type.`,
    sources: [KHAN_LSAT, WIKI_LOGIC],
    remember: [
      "'Always' means every case, including unusual ones",
      "Truth-tellers' statements are all true; liars' are all false",
      "Assume a case, follow it through, reject it on any contradiction",
      "Test every case before answering",
    ],
    quick: { question: "A tree always has…", options: ["roots", "fruits", "flowers", "birds"], answer: 0, explanation: "Not every tree bears fruit or flowers, but every tree has roots." },
    questions: [
      { q: "A says 'B is a liar.' B says 'We are both truth-tellers.' Who is truthful?", o: ["A only", "B only", "Both", "Neither"], a: 0, e: "If A lied, B would be truthful and so would A: a contradiction." },
      { q: "Exactly one of P, Q, R lies. P: 'Q lies.' Q: 'R lies.' R: 'I tell the truth.' Who lies?", o: ["Q", "P", "R", "Can't be determined"], a: 0, e: "Only Q as the single liar avoids a contradiction." },
      { q: "A shadow always needs…", o: ["light", "the sun", "a wall", "night"], a: 0, e: "Any light source can cast a shadow." },
      { q: "X says 'Y tells the truth.' Y says 'X is a liar.' Who lies?", o: ["X", "Y", "Both", "Neither"], a: 0, e: "If X were truthful, Y would be too, yet Y calls X a liar." },
    ],
    visual: {
      plain: "Liar puzzles are like testing keys in a lock. Try one assumption; if it jams (a contradiction), it's the wrong key. The assumption that turns smoothly is the answer.",
      diagram: `flowchart TB
  A["Assume A is truthful"] --> C1{"contradiction?"}
  C1 -->|"no"| OK["keep it"]
  C1 -->|"yes"| B["Assume A lies"] --> C2{"contradiction?"}
  C2 -->|"no"| OK2["keep it"]`,
      caption: "Assume, follow through, keep the case that never contradicts itself.",
    },
  },
  {
    slug: "arithmetic-reasoning",
    title: "Arithmetic Reasoning",
    description: "Everyday word puzzles: heads and legs, trees in a row, shares and counting.",
    minutes: 25,
    theory: `Arithmetic reasoning questions are short stories with numbers: animals with heads and legs, trees along a road, money shared out, people in a queue. They need only school arithmetic, but you must model the story correctly.

## Start here: the classic patterns

| Pattern | Key idea |
|---|---|
| heads and legs | assume all are one kind, then fix the difference |
| trees or poles in a row | with one at each end, items = gaps + 1 |
| items around a circle | items = gaps |
| sharing in a ratio | find one part, multiply |
| clocks striking | add 1 + 2 + … + 12 |
| handshakes | n people shaking hands once each: n(n − 1)/2 |
| pages and digits | count digits by ranges (1–9, 10–99, 100–999) |

## Heads and legs, step by step

A farm has hens and cows: 30 heads and 84 legs. How many cows?

~~~
if all 30 were hens: 60 legs
extra legs: 84 − 60 = 24
each cow adds 2 extra legs: 24 / 2 = 12 cows (and 18 hens)
~~~

Check: 12 × 4 + 18 × 2 = 48 + 36 = 84.

## Trees in a row

A 100 m road has trees every 10 m, including both ends: gaps = 100 / 10 = 10, trees = **11**. Around a circular park of 100 m with trees every 10 m: **10** trees (the start and end are the same spot).

## Worked examples

**Example 1 (warm-up).** ₹600 is shared between A and B in the ratio 2 : 3. B gets 3/5 × 600 = **₹360**.

**Example 2 (handshakes).** 10 people each shake hands once with everyone else: 10 × 9 / 2 = **45**.

**Example 3 (pages and digits).** How many digits are needed to number the pages of a 150-page book?

~~~
pages 1–9:     9 × 1 = 9
pages 10–99:   90 × 2 = 180
pages 100–150: 51 × 3 = 153
total = 342
~~~

**Example 4 (queues).** In a queue, Ravi is 8th from the front and 13th from the back. People in the queue = 8 + 13 − 1 = **20**.

**Example 5 (money and counting, test level).** A man has ₹500 in ₹10 and ₹20 notes, 35 notes in all. How many ₹20 notes?

~~~
all ₹10 notes would be ₹350
extra ₹150 comes ₹10 per ₹20 note: 15 notes of ₹20 (and 20 of ₹10)
~~~

It's the heads-and-legs method again.

## Thinking tip

When a story gives a total and two kinds of items, try the "assume all are one kind" method first. It turns many puzzles into one subtraction and one division.

## Traps in this topic

- counting gaps instead of trees (or the reverse)
- forgetting that the circular case has no extra item
- counting a handshake twice

## Practice

1. 40 heads and 110 legs of hens and goats. How many goats?
2. Poles every 5 m along a 60 m fence, one at each end. How many poles?
3. 8 teams each play every other team once. How many matches?

**Answers:** 1) all hens: 80 legs; 30 extra / 2 = **15 goats**. 2) 60/5 + 1 = **13**. 3) 8 × 7 / 2 = **28**.`,
    sources: [WIKI_WORD],
    remember: [
      "Two kinds and a total: assume all are one kind, then fix the difference",
      "Items in a row with both ends: gaps + 1; around a circle: gaps",
      "Handshakes or matches among n: n(n − 1)/2",
      "Position from front + from back − 1 = total",
    ],
    quick: { question: "30 heads and 84 legs of hens and cows. How many cows?", options: ["12", "18", "15", "24"], answer: 0, explanation: "All hens would give 60 legs; 24 extra / 2 = 12 cows." },
    questions: [
      { q: "10 people shake hands once with each other. How many handshakes?", o: ["45", "90", "100", "50"], a: 0, e: "Each pair shakes once: n(n − 1)/2 = 10 × 9 / 2 = 45." },
      { q: "Trees every 10 m along a 100 m road, one at each end. How many trees?", o: ["11", "10", "9", "12"], a: 0, e: "100 / 10 = 10 gaps; with a tree at each end, trees = gaps + 1 = 11." },
      { q: "How many digits number the pages of a 150-page book?", o: ["342", "450", "300", "351"], a: 0, e: "Pages 1–9 use 9 digits, 10–99 use 180, 100–150 use 153: total 342." },
      { q: "₹500 in ₹10 and ₹20 notes, 35 notes in all. How many ₹20 notes?", o: ["15", "20", "25", "10"], a: 0, e: "All ₹10 notes would be ₹350; ₹150 extra / ₹10 = 15." },
    ],
    visual: {
      plain: "Heads and legs: pretend every animal is a hen. The legs you're short of must belong to the cows, two extra legs each.",
      diagram: `flowchart LR
  A["30 heads, 84 legs"] --> B["all hens: 60 legs"] --> C["24 extra legs"] --> D["÷ 2 per cow<br/>12 cows"]`,
      caption: "Assume all are one kind, then fix the difference.",
    },
  },
  {
    slug: "mathematical-operations",
    title: "Mathematical Operations",
    description: "Swapped symbols and made-up operators: substitute first, then apply BODMAS.",
    minutes: 20,
    theory: `These questions change what the symbols mean ("+ means ×") or invent new ones ("a ★ b = a² − b"), then ask you to evaluate an expression. The only skills are careful substitution and the usual order of operations.

## Start here: two kinds of question

| Kind | Example |
|---|---|
| swapped symbols | if + means ×, × means −, − means ÷ and ÷ means +, find 8 + 3 × 12 − 4 ÷ 2 |
| defined operators | if a ★ b = 2a + b, find 3 ★ 4 |

## Swapped symbols, step by step

1. **Rewrite** the whole expression with the real symbols. Do this on paper before calculating
2. Apply BODMAS to the rewritten expression: brackets, then ÷ and × left to right, then + and − left to right
3. Check your rewritten version once more against the code list

**Example:** + means ×, × means −, − means ÷, ÷ means +. Find 8 + 3 × 12 − 4 ÷ 2.

~~~
rewrite:  8 × 3 − 12 ÷ 4 + 2
BODMAS:   24 − 3 + 2 = 23
~~~

## Defined operators

Replace the letters in the definition with the given numbers, in the same positions.

~~~
a ★ b = 2a + b
3 ★ 4 = 2 × 3 + 4 = 10
4 ★ 3 = 2 × 4 + 3 = 11   (order matters)
~~~

For nested operators, work from the inside out: (2 ★ 3) ★ 1 = (7) ★ 1 = 15.

## Worked examples

**Example 1 (warm-up).** If + means × and × means +, find 6 + 4 × 3. Rewrite: 6 × 4 + 3 = **27**.

**Example 2.** If P means +, Q means −, R means ×, S means ÷, find 18 S 3 R 4 P 6 Q 2.

~~~
rewrite: 18 ÷ 3 × 4 + 6 − 2
= 6 × 4 + 6 − 2 = 24 + 6 − 2 = 28
~~~

**Example 3 (defined operator).** a # b = a² − b². Find 5 # 3 = 25 − 9 = **16**.

**Example 4 (choosing the swap, test level).** Which swap makes 5 + 3 × 2 = 11 true? Try "+ and × interchanged": 5 × 3 + 2 = 17 ✗. Try no swap: 5 + 6 = 11 ✔. Some questions ask which interchange makes an equation correct; test each option.

**Example 5 (equation check).** Which interchange makes 16 ÷ 4 − 2 = 6 correct: (a) ÷ and − (b) − and +? Option (a): 16 − 4 ÷ 2 = 16 − 2 = 14 ✗. Option (b): 16 ÷ 4 + 2 = 4 + 2 = 6 ✔. Test every option; don't stop at the first one that looks likely.

## Traps in this topic

- calculating while substituting, and mixing old and new symbols
- applying the operations left to right instead of BODMAS
- swapping the order of a and b in a defined operator

## Practice

1. If × means +, + means ×, find 7 × 2 + 5
2. a ▲ b = a × b − a. Find 4 ▲ 6
3. If − means ×, ÷ means −, × means ÷, + means +, find 20 × 4 − 3 ÷ 5 + 2

**Answers:** 1) 7 + 2 × 5 = **17**. 2) 24 − 4 = **20**. 3) 20 ÷ 4 × 3 − 5 + 2 = 15 − 5 + 2 = **12**.`,
    sources: [WIKI_ORDER],
    remember: [
      "Rewrite the whole expression with real symbols before calculating",
      "Then apply BODMAS: ÷ and × before + and −, left to right",
      "Defined operators: substitute in the same positions; order matters",
      "Nested operators: inside out",
    ],
    quick: { question: "If + means × and × means +, find 6 + 4 × 3.", options: ["27", "18", "30", "13"], answer: 0, explanation: "Rewrite as 6 × 4 + 3 = 27." },
    questions: [
      { q: "+ means ×, × means −, − means ÷, ÷ means +. Find 8 + 3 × 12 − 4 ÷ 2.", o: ["23", "20", "26", "17"], a: 0, e: "8 × 3 − 12 ÷ 4 + 2 = 24 − 3 + 2 = 23." },
      { q: "a ★ b = 2a + b. Find 4 ★ 3.", o: ["11", "10", "14", "7"], a: 0, e: "Put a = 4 and b = 3 into 2a + b: 2 × 4 + 3 = 11." },
      { q: "a # b = a² − b². Find 5 # 3.", o: ["16", "4", "34", "8"], a: 0, e: "a² − b² with a = 5, b = 3: 25 − 9 = 16." },
      { q: "P = +, Q = −, R = ×, S = ÷. Find 18 S 3 R 4 P 6 Q 2.", o: ["28", "32", "20", "26"], a: 0, e: "18 ÷ 3 × 4 + 6 − 2 = 28." },
    ],
    visual: {
      plain: "It's a translation job: first translate the coded expression into normal maths, word for word, and only then do the sums.",
      diagram: `flowchart LR
  C["8 + 3 × 12 − 4 ÷ 2<br/>(coded)"] --> R["8 × 3 − 12 ÷ 4 + 2<br/>(real symbols)"] --> B["BODMAS<br/>24 − 3 + 2"] --> A["23"]`,
      caption: "Translate first, calculate second.",
    },
  },
  {
    slug: "making-judgments",
    title: "Making Judgments and Matching Definitions",
    description: "Applying a given definition or rule to situations, and choosing the best example.",
    minutes: 20,
    theory: `These questions give a definition or a rule and ask which situation fits it best. They test whether you apply the definition **exactly as written**, without adding your own opinions. Companies like them because real work is full of rules you must apply carefully.

## Start here: the method

1. Read the definition and underline every condition it sets
2. For each option, check every condition: yes or no
3. The right option meets **all** conditions; reject any that miss even one
4. Ignore what you personally think is fair or likely

## Breaking a definition into conditions

Definition: "**Plagiarism** is presenting someone else's work or ideas as your own, without credit."

Conditions:
- someone else's work or ideas
- presented as your own
- without credit

Options:
- Submitting a copied essay under your name: all three ✔ → **plagiarism**
- Quoting a book with the author's name: credit given ✗
- Writing your own essay: not someone else's work ✗

## Worked examples

**Example 1 (warm-up).** Definition: "**Procrastination** is delaying a task without a good reason."

Which is an example?
- Watching videos instead of starting an assignment due tomorrow ✔
- Postponing a trip because of a storm (a good reason) ✗
- Resting after finishing work (no task delayed) ✗

**Example 2.** Definition: "A **conflict of interest** exists when a person's private interest could influence their professional decision."

Which is a conflict of interest?
- A judge hearing a case involving a company she owns shares in ✔ (private interest + professional decision)
- A judge reading law books at home ✗

**Example 3 (rules).** Rule: "A student gets a scholarship if their family income is below ₹3 lakh **and** they score above 80%." Asha scores 85% with family income ₹4 lakh. Does she qualify? **No**: the income condition fails. "And" means both conditions are needed; "or" would need only one.

**Example 4 (test level).** Definition: "**Constructive criticism** points out a problem **and** suggests how to improve."

- "Your report is clear; adding a summary would help." ✔ names an issue and a fix
- "This report is useless." ✗ no suggestion
- "Great work, no changes needed." ✗ no problem pointed out

## Matching definitions

Some questions reverse it: given a situation, choose which term (from several definitions) fits. Use the same method: check each definition's conditions against the situation.

## Traps in this topic

- picking an option that meets most but not all conditions
- letting your opinion of what's "fair" decide
- confusing "and" (all conditions) with "or" (any one)

## Practice

Definition: "**Empathy** is understanding and sharing another person's feelings."

1. Which is an example? (a) Comforting a friend who failed an exam (b) Laughing at a friend's mistake
2. Rule: entry is free for children under 5 or adults over 65. Is a 70-year-old charged?
3. Definition: "**Inflation** is a general rise in prices over time." Is one shop's sale an example?

**Answers:** 1) **(a)**. 2) **No**: "or" needs only one condition, and over 65 is met. 3) **No**: a single shop's price cut isn't a general rise.`,
    sources: [WIKI_DEF, KHAN_LSAT],
    remember: [
      "Break the definition into conditions and check each one",
      "The answer meets every condition; reject any option that misses one",
      "'And' needs all conditions; 'or' needs any one",
      "Apply the definition as written, not your opinion",
    ],
    quick: { question: "Plagiarism is presenting someone else's work as your own. Which is an example?", options: ["Submitting a copied essay under your name", "Quoting a book with credit", "Writing your own essay", "Reading a book for ideas"], answer: 0, explanation: "Only the first passes off another's work as yours." },
    questions: [
      { q: "Procrastination is delaying a task without good reason. Which is an example?", o: ["Watching videos instead of starting work due tomorrow", "Postponing a trip because of a storm", "Resting after finishing work", "Planning a timetable"], a: 0, e: "Only the first delays without a good reason." },
      { q: "Scholarship rule: income below ₹3 lakh AND score above 80%. Asha: 85%, income ₹4 lakh. Does she qualify?", o: ["No", "Yes", "Only partly", "Can't be determined"], a: 0, e: "'And' needs both conditions; the income one fails." },
      { q: "Constructive criticism points out a problem and suggests an improvement. Which fits?", o: ["\"Clear report; a summary would help.\"", "\"This is useless.\"", "\"Perfect, no changes.\"", "\"I don't like it.\""], a: 0, e: "It names an issue and a fix." },
      { q: "Entry is free for children under 5 OR adults over 65. A 70-year-old pays…", o: ["nothing", "full price", "half price", "it can't be determined"], a: 0, e: "'Or' needs only one condition, and over 65 is met." },
    ],
    visual: {
      plain: "A definition is a checklist. An option fits only if it ticks every box; one empty box and it's out.",
      diagram: `flowchart LR
  D["Definition"] --> C1["condition 1 ✔"]
  D --> C2["condition 2 ✔"]
  D --> C3["condition 3 ✔"]
  C1 & C2 & C3 --> A["fits only if every box is ticked"]`,
      caption: "Check every condition; 'and' needs all of them.",
    },
  },
];
