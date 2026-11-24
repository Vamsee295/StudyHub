// Long-form theory for Logical Reasoning (advanced) and Verbal Ability (vocabulary). Original writing.
import { LessonTheory } from './utils';

const WIKI_SYLLOGISM = { title: "Wikipedia: Syllogism", url: "https://en.wikipedia.org/wiki/Syllogism" };
const WIKI_VENN = { title: "Wikipedia: Venn diagram", url: "https://en.wikipedia.org/wiki/Venn_diagram" };
const OPEN_LOGIC = { title: "forall x: Calgary, an open introduction to formal logic (free textbook)", url: "https://forallx.openlogicproject.org/" };
const KHAN_LOGIC = { title: "Khan Academy: Logical reasoning (LSAT prep, free)", url: "https://www.khanacademy.org/prep/lsat" };
const WIKI_DS = { title: "Wikipedia: Data sufficiency", url: "https://en.wikipedia.org/wiki/Data_sufficiency" };
const CAMBRIDGE = { title: "Cambridge Dictionary (free online)", url: "https://dictionary.cambridge.org/" };
const MERRIAM = { title: "Merriam-Webster Thesaurus (free online)", url: "https://www.merriam-webster.com/thesaurus" };
const PURDUE_OWL = { title: "Purdue OWL: Online Writing Lab", url: "https://owl.purdue.edu/owl/purdue_owl.html" };
const WIKI_ROOTS = { title: "Wikipedia: List of Greek and Latin roots in English", url: "https://en.wikipedia.org/wiki/List_of_Greek_and_Latin_roots_in_English" };

export const aptReasoningVocabTheory: Record<string, LessonTheory> = {
  "syllogisms": {
    theory: `A syllogism gives two or more statements (premises) and asks which conclusions follow from them **logically**, regardless of whether they're true in the real world. "All cats are animals. Some animals are pets. Conclusion: some cats are pets" doesn't follow, even though it's true in reality. Syllogisms test strict deductive reasoning, and Venn diagrams make them mechanical. This lesson covers the four statement types, the Venn diagram method, definite and possibility conclusions, and the either-or case.

## The four statement types

| Type | Form | Meaning |
|---|---|---|
| Universal affirmative | All A are B | Every A is inside B |
| Universal negative | No A is B | A and B don't overlap |
| Particular affirmative | Some A are B | At least one A is a B |
| Particular negative | Some A are not B | At least one A is outside B |

"Some" means **at least one**, possibly all. "Some A are B" doesn't rule out "All A are B".

## Treat the premises as true

Ignore real-world knowledge. If the premises say "All fish are birds", accept it for the question. Only the logical relationship matters.

## The Venn diagram method

1. draw circles for each term
2. draw the **minimum** overlap the premises require; don't add overlaps that aren't stated
3. test each conclusion: does it hold in **every** possible diagram consistent with the premises?

A conclusion **follows** only if it's true in all valid diagrams. If you can draw one valid diagram where it's false, it doesn't follow.

## Worked example

~~~
Premises: All pens are pencils. Some pencils are erasers.
Conclusions:
I. Some pens are erasers.
II. Some erasers are pencils.
~~~

Draw the pen circle inside the pencil circle. Erasers overlap pencils somewhere, but that overlap could lie entirely outside the pen circle.

- I doesn't follow (a diagram exists with no pen-eraser overlap)
- II follows ("some pencils are erasers" means "some erasers are pencils": particular affirmatives reverse)

## Conversion rules

- "All A are B" implies "Some B are A" (and "Some A are B"), but not "All B are A"
- "No A is B" implies "No B is A"
- "Some A are B" implies "Some B are A"
- "Some A are not B" can't be reversed

## Combining two premises

Common valid combinations:

| Premise 1 | Premise 2 | Definite conclusion |
|---|---|---|
| All A are B | All B are C | All A are C |
| All A are B | No B is C | No A is C |
| Some A are B | All B are C | Some A are C |
| Some A are B | No B is C | Some A are not C |
| All A are B | Some B are C | No definite conclusion between A and C |
| Some A are B | Some B are C | No definite conclusion between A and C |

Two particular premises never give a definite conclusion.

## Possibility conclusions

Modern tests ask whether something is **possible**:

~~~
Premises: All dogs are cats. Some cats are rats.
Conclusion: All rats being dogs is a possibility.
~~~

Draw a diagram where it's true while keeping the premises satisfied. Here, rats can sit inside the dog circle, which is inside cats, satisfying "some cats are rats". So the possibility holds.

A possibility fails only if it contradicts a premise: with "No A is B", "Some A being B is a possibility" is false.

## Either-or conclusions

When two conclusions individually don't follow but together cover all cases, the answer is "either I or II follows". This happens with a complementary pair about the same two terms:

- "Some A are B" and "No A is B"
- "All A are B" and "Some A are not B"

Exactly one of each pair must be true in any diagram, so "either I or II" follows when neither follows on its own.

## Three or more premises

Chain the premises, drawing circles one at a time. Keep overlaps minimal unless a premise forces them. Long syllogisms become manageable when you test each conclusion against the minimal diagram and then try to break it.

## Common mistakes

- using real-world knowledge
- treating "some" as "only some"
- reversing "All A are B" into "All B are A"
- drawing unnecessary overlaps, then accepting conclusions that don't always hold
- missing either-or pairs

## How interviewers test this

Expect two- and three-premise syllogisms with definite and possibility conclusions and either-or answers. Draw minimal Venn diagrams, test each conclusion by trying to break it, apply the conversion rules, and look for complementary pairs when neither conclusion follows alone.`,
    sources: [WIKI_SYLLOGISM, WIKI_VENN],
  },

  "statements-conclusions": {
    theory: `Statement and conclusion questions give a short passage and ask which conclusions logically follow from it. Related formats ask about assumptions (unstated premises), courses of action and strengthening or weakening arguments. They test whether you can separate what a statement actually establishes from what merely sounds plausible. This lesson covers conclusions, assumptions, courses of action and arguments, with the rules that distinguish valid answers.

## Conclusions

A conclusion follows if it's **directly supported** by the statement, using the statement's information and widely accepted general knowledge, without extra assumptions.

~~~
Statement: The government has decided to make helmets compulsory for two-wheeler riders.
Conclusion I: Helmets reduce the risk of serious injury.
Conclusion II: Most riders currently wear helmets.
~~~

- I follows: a safety rule implies the government believes helmets protect riders
- II doesn't follow: the statement says nothing about current behaviour (if anything, the rule suggests many don't)

## Rules for conclusions

- reject conclusions with **extreme words** ("all", "always", "only", "never") unless the statement uses equally strong language
- reject conclusions that introduce **new information** not in the statement
- reject conclusions based on **personal opinion** or speculation
- accept conclusions that **restate or directly imply** the statement's content

## Assumptions

An assumption is something the author must take for granted for the statement to make sense. It's unstated but necessary.

~~~
Statement: "Use our new app to file your taxes in ten minutes."
Assumption I: People want to file taxes quickly. (implicit)
Assumption II: The app is free. (not implicit)
~~~

The advertisement only makes sense if speed matters to people; nothing depends on the price.

**Negation test**: negate the assumption. If the statement then falls apart, it's a genuine assumption. "People don't want to file taxes quickly" undermines the ad, so I is implicit. "The app isn't free" doesn't undermine it, so II isn't.

## Courses of action

A course of action is a practical step that addresses a problem described in the statement. It should be:

- **relevant**: it tackles the stated problem
- **practical**: it can be carried out
- **proportionate**: it isn't extreme, such as banning an entire industry over a minor issue

~~~
Statement: Many students in a district fail mathematics in board exams.
Action I: Train mathematics teachers in the district.
Action II: Remove mathematics from the curriculum.
~~~

I follows (addresses the cause practically); II doesn't (extreme and impractical).

## Arguments: strong and weak

~~~
Should mobile phones be banned in schools?
Argument I: Yes, they distract students during classes.
Argument II: No, every student likes using phones.
~~~

A **strong** argument is directly related to the question, addresses its core, and gives a substantial reason. A **weak** argument is trivial, based on popularity or opinion, ambiguous, or only loosely related. Here I is strong, II is weak.

## Strengthening and weakening

These questions ask which option most strengthens or weakens a claim. Identify the claim and its evidence, then look for an option that:

- **strengthens**: supports the link between evidence and claim, or rules out alternative explanations
- **weakens**: breaks that link or offers an alternative explanation

~~~
Claim: The new fertilizer increased crop yields, because yields rose 20% the year it was introduced.
Weakener: Rainfall that year was the highest in a decade.
~~~

Higher rainfall offers an alternative explanation for the increase.

## Cause and effect

Some questions present two events and ask whether one causes the other, both result from a common cause, or they're independent. Look for a direct mechanism; correlation alone doesn't establish causation.

## Method summary

1. read the statement carefully and identify its exact scope
2. for each option, ask: is this directly supported, necessary, practical or relevant, depending on the question type?
3. watch for extreme words and new information
4. choose answers grounded in the statement, not in what seems true in general

## Common traps

- accepting conclusions that are true in reality but not implied by the statement
- treating desirable outcomes as assumptions
- choosing drastic courses of action
- judging arguments by agreement rather than logical strength

## How interviewers test this

Expect conclusion, assumption, course-of-action, strong-and-weak argument and strengthen-or-weaken questions. Stay within the statement's scope, use the negation test for assumptions, prefer practical and proportionate actions, and judge arguments by relevance and substance.`,
    sources: [KHAN_LOGIC, OPEN_LOGIC],
  },

  "data-sufficiency": {
    theory: `Data sufficiency questions don't ask you to solve a problem. They ask whether the given statements provide **enough information** to solve it. A typical question poses a problem and two statements, then offers standard options: statement I alone is sufficient, II alone is sufficient, both together are needed, either alone is sufficient, or even both together aren't enough. The skill is judging sufficiency without wasting time on full calculation. This lesson covers the standard answer options, a step-by-step method and the common traps.

## The standard options

| Option | Meaning |
|---|---|
| A | Statement I alone is sufficient, II alone isn't |
| B | Statement II alone is sufficient, I alone isn't |
| C | Each statement alone is sufficient |
| D | Both together are sufficient, neither alone is |
| E | Even both together aren't sufficient |

Different tests letter these differently, so read the option list for each test.

## The method

1. understand exactly what's asked: a specific value, or a yes/no answer?
2. evaluate statement I **alone**, forgetting statement II
3. evaluate statement II **alone**, forgetting statement I
4. if neither is sufficient alone, evaluate them **together**
5. choose the option matching the results

## Don't solve completely

You only need to know **whether** an answer can be found. If statement I gives two independent linear equations in two unknowns, it's sufficient, without solving them.

## Value questions

A value question is sufficient only if it leads to **one** value.

~~~
What is x?
I. x² = 25
II. x > 0
~~~

- I alone gives x = 5 or −5: not sufficient
- II alone gives no value: not sufficient
- together: x = 5 → sufficient → answer D

## Yes/no questions

A yes/no question is sufficient if it gives a **definite** yes or a definite no. A definite "no" counts as sufficient.

~~~
Is n even?
I. 3n is even.
II. n + 4 is odd.
~~~

- I: if 3n is even, n is even → definite yes → sufficient
- II: n + 4 odd means n is odd → definite no → sufficient
- answer C (each alone)

## Hidden constraints

Use information implied by the context:

- counts of people or objects are positive integers
- ages, lengths and prices are positive
- digits run from 0 to 9

~~~
How many pens did Asha buy?
I. Pens cost 7 each, notebooks 5 each, and she spent 31 in total buying both.
~~~

7p + 5n = 31 with positive integers: p = 3, n = 2 is the only solution. One equation with two unknowns can still be sufficient because of the integer constraint.

## Traps

- **the second statement leaking**: when evaluating statement I alone, don't use facts from statement II
- **counting equations blindly**: two equations may be the same equation in disguise (2x + 2y = 10 and x + y = 5), which isn't enough for two unknowns
- **unknown signs**: x² = 9 doesn't fix x's sign
- **assuming integers** when the question doesn't say so
- **solving fully** when only sufficiency matters

## Geometry and percentages

~~~
What is the area of the rectangle?
I. The perimeter is 30.
II. The diagonal is √113.
~~~

- I alone: l + b = 15, insufficient
- II alone: l² + b² = 113, insufficient
- together: (l + b)² = 225 → 2lb = 225 − 113 = 112 → area 56 → sufficient → D

Recognizing that the identity (l + b)² = l² + b² + 2lb gives the area directly, without solving for l and b, is exactly the kind of shortcut DS rewards.

## Ratios and percentages often need an absolute value

~~~
What is the salary of A?
I. A earns 20% more than B.
II. B earns 30,000.
~~~

A ratio alone can't give an absolute number; you need at least one actual value. Together they're sufficient: 36,000.

## Data sufficiency in logical reasoning

The same format appears with logical puzzles: "Who is the tallest of five people?" with statements giving partial orderings. Combine statements only when neither alone fixes the answer, and check whether the combined ordering identifies one person definitively.

## How interviewers test this

Expect value and yes/no questions in algebra, arithmetic, geometry and logical ordering, with the standard five options. Evaluate each statement in isolation, count only independent information, use implied constraints like positive integers, treat a definite "no" as sufficient, and stop calculating once sufficiency is clear.`,
    sources: [WIKI_DS, KHAN_LOGIC],
  },

  "seating-arrangement": {
    theory: `Seating arrangement puzzles describe people seated in a row, around a table or in a grid, through a set of clues, and ask questions about who sits where. They're among the most time-consuming reasoning questions, but a disciplined method turns them into a predictable process. This lesson covers linear and circular arrangements, facing directions, the order in which to process clues, handling multiple possibilities, and common clue phrasings.

## Types of arrangement

- **linear**: people in a row, facing north, south, or mixed directions
- **circular**: people around a table, facing the centre, outside, or mixed
- **square or rectangular tables**: people at corners and middles of sides
- **two parallel rows**: people in one row facing those in the other

## Left and right depend on facing direction

In a row facing north, a person's right is your right as you look at the diagram. In a row facing south, their right is your left. Circles are similar:

- **facing the centre**: a person's right is **anticlockwise** on the diagram
- **facing outside**: a person's right is **clockwise**

Getting this wrong ruins the whole puzzle, so decide the convention before placing anyone.

## Order of processing clues

1. **definite clues first**: "A sits at the extreme left end", "B sits third from the right end", "C sits opposite D"
2. **relative clues connected to placed people**: "E sits second to the right of A"
3. **negative clues** to eliminate options: "F doesn't sit next to G"
4. **remaining clues** to resolve cases

Don't place anyone based on an uncertain clue too early; keep it aside until another clue anchors it.

## Shorthand

Write clues compactly before drawing:

~~~
A _ _ B      (two seats between A and B)
C ≠ adj D    (C not adjacent to D)
E 2R A       (E second to the right of A)
~~~

## Handling multiple cases

When a clue allows two placements, draw both cases side by side and continue with each. Later clues usually eliminate one. Most puzzles resolve to a single arrangement; if two survive, questions are designed so that the answer is the same in both or so that "cannot be determined" is correct.

## Linear example

~~~
Six people A to F sit in a row facing north.
1. C sits at an extreme end.
2. A sits third to the right of C.
3. B sits between A and E.
4. D isn't at an extreme end.
~~~

From clue 1, C is at the left or right end. If C is at the right end, there's no room to its right for A, so C is at the left end (position 1), and A is at position 4. B sits between A and E, so either B is at 3 and E at 2, or B at 5 and E at 6. D isn't at an end, so D can't take position 6. In the first case, positions 5 and 6 remain for D and F, so D sits at 5 and F at 6. In the second case, positions 2 and 3 remain for D and F, and the clues allow either order. The questions in the set then usually supply or test a further clue to separate the cases.

## Circular example

"Exactly opposite" is only possible with an even number of seats: around a five-seat table, nobody sits directly across from anyone. Questions with odd seat counts use "second to the left" and similar instead.

~~~
Six people around a table facing the centre. A sits opposite D. B sits to the immediate right of A. E sits second to the left of B.
~~~

Place A at the top and D at the bottom. Facing the centre, A's immediate right is the next seat anticlockwise on the diagram, so B goes there. E sits second to the left of B: two seats clockwise from B, which lands on A's other side. Continue with the remaining clues.

## Common phrasings

| Phrase | Meaning |
|---|---|
| Immediate left/right | Adjacent seat |
| Second to the left | Skip one seat in that direction |
| Between A and B | Somewhere between them, not necessarily the middle seat, unless "exactly between" |
| Opposite | Directly across (even seat counts) |
| Neighbour | Adjacent on either side |
| As many people between X and Y as between Y and Z | Equal counts, often fixing a symmetrical layout |

## Speed tips

- draw the frame (row or circle) before reading clues in detail
- count seats explicitly rather than estimating
- verify the final arrangement against every clue before answering questions

## How interviewers test this

Expect linear rows with mixed facing directions, circular tables facing in or out, and multi-variable puzzles combining seats with professions or colours. Fix the left-right convention, place definite clues first, branch into cases when needed, and verify the final layout against every clue.`,
    sources: [KHAN_LOGIC, OPEN_LOGIC],
  },

  "synonyms": {
    theory: `A synonym is a word with the same or nearly the same meaning as another: "happy" and "joyful", "begin" and "commence". Synonym questions test vocabulary and precision: choosing the option whose meaning matches the given word most closely, often in a specific context. This lesson covers how to approach synonym questions, the role of connotation and context, word roots for unfamiliar words, and an effective routine for building vocabulary.

## Exact and near synonyms

Few words are perfect synonyms. "Big" and "large" are close; "big" and "enormous" differ in degree. Test questions ask for the **closest** meaning, so compare options against each other, not only against the given word.

## Connotation

Words with similar dictionary meanings can carry different feelings:

| Word | Neutral | Positive | Negative |
|---|---|---|---|
| Thin | Thin | Slender | Skinny |
| Firm | Determined | Resolute | Stubborn |
| Inquisitive | Curious | Interested | Nosy |

When the given word is positive, prefer a positive synonym. Choosing "stubborn" for "resolute" is a common mistake.

## Context matters

Many words have several meanings. In "the novel's **plot** was gripping", plot means storyline; in "a vegetable **plot**", it means a piece of land. When a question gives a sentence, choose the synonym that fits that sense.

~~~
"The manager will **address** the staff tomorrow."
Options: residence, speak to, solve, direct
Answer: speak to
~~~

## Working out unfamiliar words

Use word parts:

| Root or prefix | Meaning | Examples |
|---|---|---|
| bene- | good | benevolent, beneficial |
| mal- | bad | malicious, malfunction |
| -phil- | love | philanthropy, bibliophile |
| -chron- | time | chronological, synchronize |
| -dict- | say | predict, contradict |
| -spect- | look | inspect, retrospect |
| -vor- | eat | herbivore, voracious |
| -loqu- | speak | eloquent, loquacious |

"Loquacious" contains "loqu" (speak), suggesting talkative, which is correct.

## Eliminating options

- remove options with the opposite meaning (test-makers often include an antonym)
- remove options that are related but not equivalent (for "brave", "soldier" is related but not a synonym)
- remove options of a different part of speech: a synonym of an adjective should be an adjective

## Commonly tested pairs

| Word | Synonym |
|---|---|
| Abundant | Plentiful |
| Candid | Frank |
| Diligent | Hardworking |
| Ephemeral | Short-lived |
| Frugal | Thrifty |
| Gregarious | Sociable |
| Lucid | Clear |
| Meticulous | Careful, thorough |
| Obsolete | Outdated |
| Pragmatic | Practical |
| Prudent | Wise, cautious |
| Tenacious | Persistent |
| Ubiquitous | Everywhere, widespread |
| Vindicate | Clear of blame |
| Zealous | Enthusiastic |

## Building vocabulary effectively

Memorizing long word lists works poorly on its own. More effective habits:

- **read widely**: editorials, long-form journalism and non-fiction expose you to words in context
- **learn words in families**: learn "benevolent" with "benefactor" and "beneficiary"
- **use spaced repetition**: review new words after a day, a few days, a week and a month
- **write your own sentences**: using a word yourself fixes its meaning and connotation
- **look words up properly**: a learner's dictionary gives meanings, example sentences and usage notes

Ten new words a day, reviewed consistently, adds up to a large vocabulary over a placement season.

## Synonyms in other question types

Synonym knowledge also helps with sentence completion, reading comprehension (where questions ask what a word means "as used in the passage") and paraphrasing in interviews and emails.

## Common traps

- choosing a word associated with the given word rather than one with the same meaning
- ignoring connotation
- picking the familiar meaning of a multi-meaning word when the context demands another
- choosing a different part of speech

## A worked set

~~~
Obstinate   → options: flexible, stubborn, obvious, polite      → stubborn
Ameliorate  → options: worsen, improve, ignore, measure        → improve
Censure     → options: praise, count, criticize, hide          → criticize
~~~

In each set, one option is an antonym (flexible, worsen, praise) planted to catch hurried readers.

## How interviewers test this

Expect standalone synonym questions with four options, synonyms of words used in sentences, and vocabulary-in-context questions in reading comprehension. Compare options against each other, match connotation and part of speech, use context for multi-meaning words, and use roots to decode unfamiliar words.`,
    sources: [MERRIAM, WIKI_ROOTS],
  },

  "antonyms": {
    theory: `An antonym is a word with the opposite meaning: "generous" and "stingy", "expand" and "contract". Antonym questions test the same vocabulary as synonyms but in reverse, and they add their own traps: options that are synonyms, options that are only partly opposite, and words that are opposite in one sense but not another. This lesson covers types of antonyms, prefixes that create opposites, context and connotation, and a method for avoiding the classic traps.

## Types of antonyms

| Type | Description | Example |
|---|---|---|
| Gradable | Opposites on a scale, with degrees between | Hot / cold (warm, cool in between) |
| Complementary | One excludes the other, no middle ground | Alive / dead, true / false |
| Relational | Opposite roles in a relationship | Buy / sell, teacher / student |

Knowing the type helps judge the best option. For gradable words, the best antonym sits at a similar distance from the middle: the antonym of "scorching" is "freezing", not "cool".

## Opposites from prefixes

Many antonyms are formed with negative prefixes:

| Prefix | Example |
|---|---|
| un- | happy / unhappy |
| in-, im-, il-, ir- | possible / impossible, legal / illegal, regular / irregular |
| dis- | agree / disagree |
| non- | violent / non-violent |
| mis- | understand / misunderstand |
| anti- | social / antisocial |

Prefixes can mislead: "inflammable" means the same as "flammable" (it catches fire easily), and "invaluable" means extremely valuable, not worthless.

## The synonym trap

Test-makers often include a synonym of the given word among the options, because a hurried reader recognizes the relationship and picks it. For "candid", options might include "frank" (a synonym) and "evasive" (the antonym). Read the question instruction again before choosing.

## Context and multiple meanings

The opposite depends on the sense:

- "light" (not heavy) → heavy; "light" (not dark) → dark
- "fast" (quick) → slow; "fast" (firmly fixed, as in "hold fast") → loose
- "fair" (impartial) → biased; "fair" (light-coloured) → dark

When a sentence is given, identify the sense first.

~~~
"The judge's decision was **fair**."
Options: dark, biased, light, beautiful
Answer: biased
~~~

## Connotation

Choose an antonym with comparable intensity and tone. For "praise", "criticize" is a better antonym than "insult", which is stronger and more personal. For "frugal" (positive tone), "extravagant" is a better antonym than "generous", which is also positive but describes giving rather than spending habits.

## Method

1. confirm whether the question asks for a synonym or antonym
2. define the given word in a short phrase, using context if provided
3. state its opposite in your own words
4. pick the option closest to your phrase, checking intensity and part of speech
5. eliminate synonyms and related-but-not-opposite words

## Commonly tested pairs

| Word | Antonym |
|---|---|
| Abundant | Scarce |
| Benevolent | Malevolent |
| Concise | Verbose |
| Diligent | Lazy |
| Ephemeral | Permanent |
| Frugal | Extravagant |
| Humble | Arrogant |
| Lucid | Obscure |
| Optimistic | Pessimistic |
| Transparent | Opaque |
| Augment | Diminish |
| Conceal | Reveal |
| Ascend | Descend |
| Novice | Expert |
| Hostile | Friendly |

## Learning antonyms alongside synonyms

Studying a word with both its synonyms and antonyms builds a fuller picture: "verbose" sits with "wordy" and "long-winded" on one side and "concise" and "terse" on the other. Grouping words into such clusters makes recall faster in tests.

## Common traps

- choosing a synonym under time pressure
- choosing a related but not opposite word (for "doctor", "hospital" isn't an antonym)
- trusting misleading prefixes such as "inflammable"
- ignoring the sense used in a given sentence

## A worked set

~~~
Tranquil    → options: calm, agitated, quiet, gentle           → agitated
Magnify     → options: enlarge, reduce, praise, examine        → reduce
Frivolous   → options: playful, serious, silly, light          → serious
~~~

Notice that each set includes synonyms of the given word (calm, enlarge, playful); eliminating them first narrows the choice quickly.

## How interviewers test this

Expect standalone antonym questions, antonyms in sentence context and occasional mixed sets alternating synonyms and antonyms. Read the instruction carefully, define the word in its context, form the opposite in your own words, match intensity and part of speech, and watch for planted synonyms.`,
    sources: [MERRIAM, CAMBRIDGE],
  },

  "one-word-substitution": {
    theory: `One-word substitution questions give a phrase or description and ask for the single word that expresses it: "a person who can speak many languages" is a **polyglot**; "fear of heights" is **acrophobia**. These questions test precise vocabulary and reward knowing common word families. This lesson covers the main categories of substitutions, the roots that help decode them, and a study approach that makes them predictable rather than random.

## Why they matter

Using one precise word instead of a phrase makes writing concise and professional. In tests, one-word substitutions appear in verbal sections of most placement exams, and the same words show up in reading passages.

## People

| Description | Word |
|---|---|
| A person who loves books | Bibliophile |
| A person who speaks many languages | Polyglot |
| A person who believes in God's existence | Theist |
| A person who doesn't believe in God | Atheist |
| A person who isn't sure whether God exists | Agnostic |
| A person who looks on the bright side | Optimist |
| A person who works for the welfare of others | Philanthropist |
| A person who hates mankind | Misanthrope |
| A person new to a field | Novice |
| A person who walks in their sleep | Somnambulist |
| A person who eats only plant foods | Vegan |
| A person who leaves their country to settle elsewhere | Emigrant |
| A person who comes into a country to settle | Immigrant |
| A person who is unable to read or write | Illiterate |

## Fears (phobias)

| Fear of | Word |
|---|---|
| Heights | Acrophobia |
| Water | Hydrophobia |
| Closed spaces | Claustrophobia |
| Open or crowded spaces | Agoraphobia |
| Spiders | Arachnophobia |
| Foreigners or strangers | Xenophobia |

## Government and rule

| Description | Word |
|---|---|
| Rule by the people | Democracy |
| Rule by one person with absolute power | Autocracy |
| Rule by a few | Oligarchy |
| Rule by the wealthy | Plutocracy |
| Rule by religious leaders | Theocracy |
| Absence of government | Anarchy |
| Rule by officials | Bureaucracy |

The root **-cracy** (rule) links them all.

## Studies and sciences

| Study of | Word |
|---|---|
| Birds | Ornithology |
| Insects | Entomology |
| The mind | Psychology |
| Earthquakes | Seismology |
| Handwriting | Graphology |
| Ancient remains | Archaeology |
| Coins | Numismatics |
| Population statistics | Demography |

The suffix **-logy** (study of) covers most.

## Killing (-cide)

Homicide (a person), suicide (oneself), genocide (a group or people), regicide (a king), patricide (one's father), pesticide (pests), fratricide (one's brother).

## Other common substitutions

| Description | Word |
|---|---|
| That which can't be seen | Invisible |
| That which can't be read | Illegible |
| That which can't be corrected | Incorrigible |
| That which can't be avoided | Inevitable |
| A speech made without preparation | Extempore |
| A list of items to be discussed at a meeting | Agenda |
| Lasting for a short time | Ephemeral |
| Happening every two years | Biennial |
| Happening twice a year | Biannual |
| A government by the people's elected representatives | Republic |
| Words written on a tomb | Epitaph |
| A place where bees are kept | Apiary |
| A place where birds are kept | Aviary |
| A collection of poems | Anthology |
| Medicine to counteract poison | Antidote |

Note the biennial and biannual pair: a frequent trap.

## Using roots

Many substitutions decode from Greek and Latin parts:

- **omni-** (all): omnipresent (present everywhere), omniscient (all-knowing), omnipotent (all-powerful)
- **poly-** (many), **mono-** (one), **bi-** (two)
- **-vore** (eater): herbivore, carnivore, omnivore
- **-archy** (rule by): monarchy, matriarchy

## Study approach

- learn words in **families** grouped by root or theme, as in the tables above
- make flashcards with the description on one side and the word on the other
- review them with spaced repetition
- note confusable pairs such as emigrant and immigrant, biennial and biannual

## How interviewers test this

Expect descriptions of people, fears, governments, sciences and places, with four options often including near misses from the same family. Learn substitutions grouped by root, use roots to eliminate wrong family members, and watch for confusable pairs.`,
    sources: [CAMBRIDGE, WIKI_ROOTS],
  },

  "vocabulary-in-context": {
    theory: `Vocabulary-in-context questions ask what a word means as it's used in a particular sentence or passage. Unlike standalone synonym questions, they reward reading skills as much as vocabulary: the same word can carry different meanings in different contexts, and test-makers deliberately choose words whose most common meaning is wrong for the passage. This lesson covers the types of context clues, a method for working out meanings, and the traps that catch readers who rely on familiar definitions.

## Why context changes meaning

Common words often have several meanings:

- "The company will **launch** a product" (introduce) versus "they **launched** the boat" (set afloat)
- "a **sharp** decline in sales" (sudden and large) versus "a **sharp** knife" (able to cut)
- "she **entertained** the idea" (considered) versus "he **entertained** the guests" (amused)

Tests pick sentences where the less common meaning applies.

## Types of context clues

| Clue type | Signal | Example |
|---|---|---|
| Definition | is, means, refers to | "Photosynthesis, **the process by which plants make food**, requires sunlight" |
| Synonym | or, also, like | "The speech was **verbose**, or wordy" |
| Antonym or contrast | but, however, unlike, although | "Unlike his **gregarious** brother, Ravi preferred solitude" |
| Example | such as, for example, including | "**Arid** regions, such as the Thar desert, receive little rain" |
| Cause and effect | because, so, therefore | "Because the evidence was **tenuous**, the case was dismissed" |
| General sense | The overall meaning of the passage | Inferring tone and situation |

In the contrast example, "gregarious" must mean the opposite of preferring solitude: sociable.

## A method

1. **cover the options** and read the sentence with the word replaced by a blank
2. **predict** a word or phrase that fits the blank, using the clues
3. **compare** your prediction with the options
4. **substitute** the chosen option into the sentence to confirm it reads naturally and keeps the meaning

~~~
"The scientist's **qualified** support for the theory showed she still had doubts."
Prediction for the blank: limited, partial
Options: certified, limited, enthusiastic, skilled
Answer: limited
~~~

"Certified" and "skilled" match the familiar meaning of "qualified", but the clause "she still had doubts" requires "limited" or "conditional".

## Reading the wider passage

In reading comprehension, the sentence alone may not be enough. Read one or two sentences before and after the word. The paragraph's tone, whether critical, supportive or neutral, often decides between close options.

## Tone and connotation

Context reveals whether a word is positive or negative. "Her **calculated** response impressed the panel" suggests careful and deliberate (positive); "his **calculated** charm hid his intentions" suggests scheming (negative). Pick the option that matches the author's attitude.

## Figurative usage

Words may be used figuratively:

~~~
"The new policy was a **bombshell** for the industry."
Meaning: a shocking surprise, not an explosive device
~~~

Idioms and metaphors are common in editorial-style passages; interpret them by their effect in the sentence.

## Unfamiliar words

When the word is completely unfamiliar, combine context with word roots:

~~~
"The **pellucid** prose made the complex topic accessible to everyone."
Context: prose that makes a complex topic accessible is clear
"Pel-" and "lucid" (clear) both point the same way → pellucid means exceptionally clear
~~~

## Common traps

- choosing the most familiar meaning of the word
- choosing an option that fits the sentence grammatically but changes its meaning
- ignoring contrast signals such as "but" and "although"
- deciding from the word alone without reading the surrounding sentences

## Building the skill

Reading quality editorials and long-form articles regularly is the most effective preparation. When you meet an unfamiliar or oddly used word, guess its meaning from context first, then check a dictionary, noting which sense applied. This trains exactly the skill the questions test.

## A worked set

~~~
"The committee will **table** the proposal until next month." → postpone discussion of
"Her argument was **sound**, and the panel accepted it." → logically valid
"Prices remained **flat** throughout the quarter." → unchanged
~~~

In each sentence, the most familiar meaning of the bold word (a piece of furniture, a noise, level ground) is wrong, which is exactly the trap these questions set.

## How interviewers test this

Expect "as used in the passage" questions in reading comprehension and sentence-based meaning questions in verbal sections. Predict the meaning before looking at options, use definition, synonym, contrast, example and cause clues, check tone, and confirm by substituting your answer into the sentence.`,
    sources: [PURDUE_OWL, CAMBRIDGE],
  },
};
