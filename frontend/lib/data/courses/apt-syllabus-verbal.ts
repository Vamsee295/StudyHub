// Verbal formats that complete the placement syllabus: spotting errors, sentence improvement, spellings,
// ordering of words, verbal analogies, completing statements. Original writing.
import type { FullLesson } from './apt-extra-types';

const OWL = { title: "Purdue OWL: Grammar (free)", url: "https://owl.purdue.edu/owl/general_writing/grammar/index.html" };
const WIKI_SPELL = { title: "Wikipedia: Commonly misspelled English words", url: "https://en.wikipedia.org/wiki/Commonly_misspelled_English_words" };
const WIKI_SYNTAX = { title: "Wikipedia: English clause syntax", url: "https://en.wikipedia.org/wiki/English_clause_syntax" };
const WIKI_ANALOGY = { title: "Wikipedia: Analogy", url: "https://en.wikipedia.org/wiki/Analogy" };
const WIKI_CONJ = { title: "Wikipedia: Conjunction (grammar)", url: "https://en.wikipedia.org/wiki/Conjunction_(grammar)" };

export const syllabusVerbal: FullLesson[] = [
  {
    slug: "spotting-errors",
    title: "Spotting Errors",
    description: "Finding the one part of a sentence with a grammar mistake, using a fixed checklist.",
    minutes: 25,
    theory: `A spotting-errors question splits a sentence into parts labelled (a), (b), (c), with (d) for "no error". You choose the part that contains a grammar mistake. A short checklist, used in the same order every time, finds most errors in seconds.

## Start here: read for meaning, then check

Read the whole sentence once for its meaning. Then run the checklist below on each part. Most errors in tests come from the same ten rules.

## The checklist

| Check | Wrong | Right |
|---|---|---|
| subject–verb agreement | Each of the boys **have** | Each of the boys **has** |
| tense | I **have seen** him yesterday | I **saw** him yesterday |
| since / for | living here **since** five years | living here **for** five years |
| articles | **an** useful book | **a** useful book |
| prepositions | senior **than** me | senior **to** me |
| pronouns | between you and **I** | between you and **me** |
| uncountable nouns | the **informations** | the **information** |
| comparisons | **more taller** | **taller** |
| unnecessary words | discuss **about** | discuss |
| word pairs | not only … **and** | not only … **but also** |

## Worked examples

**Example 1 (warm-up).** (a) Each of the students / (b) have submitted / (c) their project / (d) no error

"Each" is singular, so (b) should be "has submitted". Answer: **(b)**.

**Example 2.** (a) She has been working / (b) in this company / (c) since three years / (d) no error

A length of time takes "for": "for three years". Answer: **(c)**.

**Example 3.** (a) The furnitures / (b) in the new office / (c) are modern / (d) no error

"Furniture" is uncountable: "The furniture … is modern". Answer: **(a)** (and (c) changes with it, but the source of the error is (a)).

**Example 4 (test level).** (a) Hardly had we reached / (b) the station / (c) than the train left / (d) no error

"Hardly" pairs with "when", not "than": "when the train left". Answer: **(c)**.

**Example 5 (no error).** (a) The team / (b) is practising hard / (c) for the final / (d) no error

The team acts as one unit, so "is" is correct. Answer: **(d)**. Choose "no error" only after checking every part against the list.

## How to choose between two suspicious parts

The error is the word that breaks a rule, not a word that merely changes along with it. In Example 3, "furnitures" causes the problem; "are" is only wrong because of it.

## Traps in this topic

- choosing "no error" too quickly (it's correct only now and then)
- marking a part that's awkward but grammatical
- missing an error that depends on a word in another part (subject in (a), verb in (b))

## Practice

1. (a) My friend and myself / (b) went to the market / (c) yesterday evening / (d) no error
2. (a) The number of applicants / (b) have increased / (c) this year / (d) no error
3. (a) He prefers walking / (b) than driving / (c) to the office / (d) no error

**Answers:** 1) **(a)**: "My friend and I". 2) **(b)**: "the number of" is singular, "has increased". 3) **(b)**: "prefer X to Y", so "to driving".`,
    sources: [OWL],
    remember: [
      "Read for meaning, then run the checklist on every part",
      "Common errors: agreement, tense, since/for, articles, prepositions, pronouns",
      "The error is the word that breaks a rule, not the words that follow from it",
      "Pick 'no error' only after checking every part",
    ],
    quick: { question: "(a) Each of the students / (b) have submitted / (c) their project / (d) no error", options: ["(b)", "(a)", "(c)", "(d)"], answer: 0, explanation: "'Each' is singular: 'has submitted'." },
    questions: [
      { q: "(a) She has been working / (b) in this company / (c) since three years / (d) no error", o: ["(c)", "(a)", "(b)", "(d)"], a: 0, e: "A length of time takes 'for'." },
      { q: "(a) Hardly had we reached / (b) the station / (c) than the train left / (d) no error", o: ["(c)", "(a)", "(b)", "(d)"], a: 0, e: "'Hardly' pairs with 'when'." },
      { q: "(a) The team / (b) is practising hard / (c) for the final / (d) no error", o: ["(d)", "(a)", "(b)", "(c)"], a: 0, e: "The team acts as one unit; the sentence is correct." },
      { q: "(a) He prefers walking / (b) than driving / (c) to the office / (d) no error", o: ["(b)", "(a)", "(c)", "(d)"], a: 0, e: "The pattern is 'prefer X to Y'." },
    ],
    visual: {
      plain: "Spotting errors is like a security check at an airport: every part of the sentence goes through the same scanner (your checklist), and the part that beeps is the error.",
      diagram: `flowchart LR
  R["Read for meaning"] --> A["agreement"] --> T["tense"] --> P["prepositions"] --> AR["articles"] --> PR["pronouns"] --> N["no error only if all pass"]`,
      caption: "Same checklist, same order, every time.",
    },
  },
  {
    slug: "sentence-improvement",
    title: "Sentence Improvement",
    description: "Replacing a highlighted part with the best correction, or choosing 'no improvement'.",
    minutes: 20,
    theory: `In sentence improvement, part of a sentence is underlined or in capitals. You choose the option that improves it, or "no improvement" if it's already correct. It's spotting errors with the fix already offered.

## Start here: the three-step method

1. Read the sentence and decide whether the highlighted part is wrong
2. If it's wrong, name the rule it breaks (agreement, tense, preposition, word form)
3. Pick the option that fixes that rule **and** keeps the meaning; substitute it to check

## Common fixes

| Highlighted (wrong) | Improved | Rule |
|---|---|---|
| insisted on to go | insisted on going | insist on + -ing |
| more better | better | no double comparatives |
| did not came | did not come | base verb after did |
| enough of time | enough time | enough + noun |
| The police has arrested | The police have arrested | 'police' is plural |
| used to wake (meaning habit now) | used to waking | be used to + -ing |
| the most tallest | the tallest | no double superlative |
| discuss about | discuss | no 'about' |

## Worked examples

**Example 1 (warm-up).** "He insisted ON TO GO alone."
Options: (a) to go (b) on going (c) for going (d) No improvement
"Insist on" takes an -ing form: **(b) on going**.

**Example 2.** "I WOULD HAVE HELPED you if you had asked."
This is a correct third conditional (if + had + past participle, would have + past participle). Answer: **No improvement**.

**Example 3.** "She is used TO WORK late." (meaning it's normal for her)
"Be used to" means accustomed to and takes -ing: **to working**. Compare "She used to work late" (a past habit), which is also correct but means something different. The option must keep the meaning.

**Example 4 (test level).** "Scarcely HAD HE LEFT THAN it began to rain."
"Scarcely" pairs with "when": **had he left when**.

## Choosing "no improvement"

It's the right answer in a real share of questions. Check the highlighted part against the rules first; don't assume there must be an error.

## Traps in this topic

- choosing an option that's grammatical but changes the meaning
- fixing one error and introducing another
- avoiding "no improvement" when the sentence is fine

## Practice

1. "He did not CAME to school yesterday."
2. "We have got ENOUGH OF TIME to finish."
3. "She is THE MOST CLEVEREST student in class."

**Answers:** 1) **did not come**. 2) **enough time**. 3) **the cleverest** (or "the most clever").`,
    sources: [OWL],
    remember: [
      "Decide if the highlighted part is wrong and name the rule",
      "The best option fixes the rule and keeps the meaning",
      "insist on / be used to / look forward to + -ing",
      "'No improvement' is often correct; check before dismissing it",
    ],
    quick: { question: "Improve: 'He insisted ON TO GO alone.'", options: ["on going", "to go", "for going", "No improvement"], answer: 0, explanation: "'Insist on' takes an -ing form." },
    questions: [
      { q: "Improve: 'I WOULD HAVE HELPED you if you had asked.'", o: ["No improvement", "will help", "would help", "had helped"], a: 0, e: "It's already a correct third conditional." },
      { q: "Improve: 'Scarcely HAD HE LEFT THAN it began to rain.'", o: ["had he left when", "he had left than", "he left when", "No improvement"], a: 0, e: "'Scarcely' pairs with 'when'." },
      { q: "Improve: 'The police HAS ARRESTED the thief.'", o: ["have arrested", "is arresting", "had arrest", "No improvement"], a: 0, e: "'Police' takes a plural verb." },
      { q: "Improve: 'We have got ENOUGH OF TIME.'", o: ["enough time", "time enough of", "enough the time", "No improvement"], a: 0, e: "'Enough' goes directly before the noun." },
    ],
    visual: {
      plain: "You're an editor with a red pen and a list of ready-made corrections. First decide whether the underlined words need the pen at all; if they do, pick the correction that fixes the mistake without changing what the writer meant.",
      diagram: `flowchart LR
  H["Highlighted part"] --> Q{"wrong?"}
  Q -->|"no"| N["No improvement"]
  Q -->|"yes"| R["name the rule"] --> F["option that fixes it<br/>and keeps the meaning"]`,
      caption: "Fix the rule, keep the meaning.",
    },
  },
  {
    slug: "spellings",
    title: "Spellings",
    description: "The rules and word families behind the spellings tests use most.",
    minutes: 20,
    theory: `Spelling questions give four versions of a word and ask for the correct one, or ask which word in a list is misspelt. A few rules plus a list of commonly confused words covers most of them.

## Start here: rules that cover many words

| Rule | Examples |
|---|---|
| i before e, except after c (when it sounds like "ee") | believe, achieve; receive, ceiling |
| double the final consonant before -ing/-ed when a short vowel and one consonant end a stressed syllable | begin → beginning, occur → occurred |
| drop the silent e before a vowel suffix | make → making, hope → hoping |
| keep the silent e before a consonant suffix | hope → hopeful, care → careful |
| y after a consonant becomes i before most suffixes | happy → happiness, carry → carried |
| -able usually follows a complete word; -ible often doesn't | readable, washable; visible, possible |

Rules have exceptions (weird, seize), so the word list below matters too.

## Words tests love (correct spelling)

| | | | |
|---|---|---|---|
| accommodate | embarrass | necessary | separate |
| definitely | occasion | occurrence | privilege |
| recommend | committee | conscience | guarantee |
| maintenance | millennium | questionnaire | rhythm |
| acquaintance | bureaucracy | entrepreneur | exaggerate |
| harass | liaison | perseverance | pronunciation |
| receive | believe | environment | government |

## Memory tricks

- **accommodate** has room for two c's and two m's
- **separate**: there's "a rat" in separate
- **necessary**: one collar (c), two sleeves (ss)
- **definitely** contains "finite"
- **embarrass**: two r's and two s's (two r's, two s's: double trouble)

## Method for spelling questions

1. Say the word slowly in syllables: ac-com-mo-date
2. Check the doubled letters: most errors are a missing or extra double letter
3. Check ie/ei and the ending (-ance/-ence, -able/-ible)
4. Eliminate the clearly wrong options first

## Worked examples

**Example 1.** Choose the correct spelling: recieve, receive, receeve, receve. After c, use "ei": **receive**.

**Example 2.** Choose the correct spelling: begining, beginning, beggining, beginnig. "Begin" ends in a stressed short vowel + n, so double the n: **beginning**.

**Example 3.** Which word is misspelt? separate, necessary, occassion, privilege. "Occasion" has two c's and one s: **occassion** is wrong.

**Example 4 (test level).** Choose the correct spelling: pronounciation, pronunciation, pronunsiation, pronunciaton. The verb is "pronounce", but the noun drops the o: **pronunciation**.

## Traps in this topic

- pronunciation tricks: words aren't spelt as they sound (rhythm, queue)
- related words that change spelling (pronounce → pronunciation, maintain → maintenance)
- British and American spellings: tests in India use British (colour, centre, programme)

## Practice

1. Choose: accomodate, accommodate, acommodate, acomodate
2. Which is misspelt? rhythm, millennium, embarass, guarantee
3. Choose: maintainance, maintenance, maintenence, maintanance

**Answers:** 1) **accommodate**. 2) **embarass** (embarrass). 3) **maintenance**.`,
    sources: [WIKI_SPELL],
    remember: [
      "i before e except after c (receive, ceiling)",
      "Double the consonant after a short stressed vowel: beginning, occurred",
      "Most errors are a missing or extra double letter: check them first",
      "Related words can change spelling: pronounce → pronunciation",
    ],
    quick: { question: "Choose the correctly spelt word.", options: ["receive", "recieve", "receeve", "receve"], answer: 0, explanation: "After c, use 'ei'." },
    questions: [
      { q: "Choose the correctly spelt word.", o: ["beginning", "begining", "beggining", "beginnig"], a: 0, e: "Double the n after the stressed short vowel." },
      { q: "Which word is misspelt?", o: ["occassion", "separate", "necessary", "privilege"], a: 0, e: "It's 'occasion': two c's, one s." },
      { q: "Choose the correctly spelt word.", o: ["pronunciation", "pronounciation", "pronunsiation", "pronunciaton"], a: 0, e: "The noun drops the 'o' of 'pronounce'." },
      { q: "Choose the correctly spelt word.", o: ["accommodate", "accomodate", "acommodate", "acomodate"], a: 0, e: "Accommodate has two c's and two m's." },
    ],
    visual: {
      plain: "Spelling errors usually hide in three places: doubled letters, ie or ei, and the ending. Check those three spots in every option and the wrong ones stand out.",
      diagram: `flowchart LR
  W["word options"] --> D["doubled letters?"] --> I["ie or ei?"] --> E["ending: -ance / -ence,<br/>-able / -ible?"] --> A["correct spelling"]`,
      caption: "Three places to check.",
    },
  },
  {
    slug: "ordering-of-words",
    title: "Ordering of Words (Sentence Formation)",
    description: "Rearranging jumbled parts P, Q, R, S into a correct sentence.",
    minutes: 20,
    theory: `These questions break a sentence into parts labelled P, Q, R and S, jumbled. You choose the order that makes a correct, sensible sentence. The structure of English sentences gives you strong clues.

## Start here: the shape of an English sentence

Most sentences follow this order:

~~~
Subject → Verb → Object → Place → Time
"The students" "completed" "the project" "in the lab" "yesterday"
~~~

Linking words also give clues:
- a part starting with a capital letter or a name is often first
- "who", "which", "that" follow the noun they describe
- "because", "although", "but" start a second clause
- a part ending in a full stop or a time phrase ("last year") is often last

## Method step by step

1. Find the **subject** (who or what the sentence is about); it usually comes first
2. Find the **verb** that goes with it
3. Attach objects and phrases that complete the verb's meaning
4. Put place and time phrases near the end
5. Read your order aloud; check it against the options and eliminate any that break a pair you're sure of

## Worked examples

**Example 1 (warm-up).**
P. completed the project
Q. The students
R. despite the rain
S. before the deadline

Subject first (Q), then the verb phrase (P), then time (S), then the extra condition (R): **QPSR** = "The students completed the project before the deadline despite the rain."

**Example 2.**
P. the cool breeze
Q. She opened the window
R. of the evening
S. to let in

Q has the subject and verb; "to let in" (S) needs an object: "the cool breeze" (P) "of the evening" (R). Order: **QSPR**.

**Example 3 (fixed pairs).**
P. by the engineers
Q. was repaired
R. The old bridge
S. last summer

Passive sentence: subject (R), verb (Q), doer with "by" (P), time (S): **RQPS**.

## Using pairs to eliminate

If you're sure Q must come right before P, cross out every option where Q P doesn't appear together. Two sure pairs usually leave one option.

## Traps in this topic

- starting with a part that begins with a lower-case linking word
- separating a verb from its object
- putting a time phrase in the middle where it sounds odd

## Practice

1. P. improves your speed  Q. Regular practice  R. in aptitude tests  S. more than anything else
2. P. to the exam hall  Q. He forgot  R. his admit card  S. to bring
3. P. the final over  Q. Our team  R. in the  S. won the match

**Answers:** 1) **QPRS**. 2) **QSRP** ("He forgot to bring his admit card to the exam hall"). 3) **QSRP** ("Our team won the match in the final over").`,
    sources: [WIKI_SYNTAX],
    remember: [
      "Typical order: subject → verb → object → place → time",
      "The subject (often capitalised) usually comes first",
      "Keep verbs with their objects and 'who/which' with their nouns",
      "Use sure pairs to eliminate options",
    ],
    quick: { question: "P. completed the project  Q. The students  R. despite the rain  S. before the deadline", options: ["QPSR", "QSPR", "PQSR", "QPRS"], answer: 0, explanation: "Subject (Q), verb (P), time (S), condition (R)." },
    questions: [
      { q: "P. the cool breeze  Q. She opened the window  R. of the evening  S. to let in", o: ["QSPR", "QPSR", "SQPR", "QRSP"], a: 0, e: "She opened the window to let in the cool breeze of the evening." },
      { q: "P. by the engineers  Q. was repaired  R. The old bridge  S. last summer", o: ["RQPS", "RPQS", "QRPS", "RQSP"], a: 0, e: "The old bridge was repaired by the engineers last summer." },
      { q: "P. to the exam hall  Q. He forgot  R. his admit card  S. to bring", o: ["QSRP", "QRSP", "SQRP", "QSPR"], a: 0, e: "He forgot to bring his admit card to the exam hall." },
      { q: "Which part usually comes first in a jumbled sentence?", o: ["The subject", "The time phrase", "The object", "A linking word like 'because'"], a: 0, e: "English sentences usually start with the subject." },
    ],
    visual: {
      plain: "Rebuilding a sentence is like building a train: the engine (subject) goes first, then the main carriage (verb and object), and the small wagons (place and time) at the back.",
      diagram: `flowchart LR
  S["Subject<br/>The students"] --> V["Verb + object<br/>completed the project"] --> T["Time<br/>before the deadline"] --> C["Extra<br/>despite the rain"]`,
      caption: "Subject → verb → object → place and time.",
    },
  },
  {
    slug: "verbal-analogies",
    title: "Verbal Analogies",
    description: "Finding the relationship in a word pair and applying it to a second pair.",
    minutes: 20,
    theory: `A verbal analogy gives a pair of words and asks you to complete a second pair with the same relationship: "Bird : Nest :: Bee : ?" The answer is Hive, because a nest is where a bird lives and a hive is where a bee lives.

## Start here: say the relationship as a sentence

Turn the first pair into a short sentence, then test each option in the same sentence.

"A **nest** is the home of a **bird**." → "A ___ is the home of a **bee**." → **hive**.

If more than one option fits, make the sentence more specific.

## Relationship types to know

| Type | Example |
|---|---|
| object and use | Pen : Write :: Knife : Cut |
| worker and workplace | Doctor : Hospital :: Teacher : School |
| worker and product | Tailor : Clothes :: Mason : Wall |
| opposites | Hot : Cold :: Tall : Short |
| synonyms | Big : Large :: Quick : Fast |
| young and adult | Puppy : Dog :: Kitten : Cat |
| part and whole | Wheel : Car :: Wing : Aeroplane |
| instrument and what it measures | Thermometer : Temperature :: Barometer : Pressure |
| animal and sound | Lion : Roar :: Dog : Bark |
| group and member | Flock : Sheep :: Pack : Wolves |
| country and currency | India : Rupee :: Japan : Yen |
| cause and effect | Fire : Smoke :: Rain : Flood |

## Method step by step

1. Make a sentence linking the first pair
2. Check that the relationship goes in the same **direction** for the second pair
3. Test each option in your sentence
4. If two options fit, tighten the sentence ("a young cat" rather than "related to a cat")

## Worked examples

**Example 1 (warm-up).** Pen : Write :: Knife : ? A pen is used to write; a knife is used to **cut**.

**Example 2.** Thermometer : Temperature :: Barometer : ? A thermometer measures temperature; a barometer measures **pressure** (not "weather", which is too broad).

**Example 3 (direction).** Calf : Cow :: Foal : ? The first word is the young one: a foal is a young **horse**. "Mare" is a female horse, not the adult form named in the pattern.

**Example 4 (test level).** Author : Book :: Composer : ? An author creates a book; a composer creates a **symphony** (or song). "Piano" is a tool, not the creation.

## Traps in this topic

- reversing the direction (Cow : Calf instead of Calf : Cow)
- choosing a word that's related but in a different way (Piano for Composer)
- picking a broad word when a precise one exists (Weather for Barometer)

## Practice

1. Eye : See :: Ear : ?
2. Flock : Sheep :: Swarm : ?
3. Microscope : Small :: Telescope : ?

**Answers:** 1) **Hear**. 2) **Bees**. 3) **Distant** (things far away).`,
    sources: [WIKI_ANALOGY],
    remember: [
      "Say the first pair's relationship as a sentence",
      "Keep the direction the same for the second pair",
      "Tighten the sentence when two options seem to fit",
      "Common types: use, workplace, opposite, young-adult, part-whole, measures",
    ],
    quick: { question: "Bird : Nest :: Bee : ?", options: ["Hive", "Honey", "Flower", "Wing"], answer: 0, explanation: "A nest is a bird's home; a hive is a bee's home." },
    questions: [
      { q: "Thermometer : Temperature :: Barometer : ?", o: ["Pressure", "Weather", "Rain", "Height"], a: 0, e: "A barometer measures air pressure." },
      { q: "Calf : Cow :: Foal : ?", o: ["Horse", "Mare", "Pony", "Stable"], a: 0, e: "A foal is a young horse." },
      { q: "Author : Book :: Composer : ?", o: ["Symphony", "Piano", "Orchestra", "Song lyrics"], a: 0, e: "Creator and creation." },
      { q: "Flock : Sheep :: Swarm : ?", o: ["Bees", "Cattle", "Fish", "Wolves"], a: 0, e: "A swarm is a group of bees." },
    ],
    visual: {
      plain: "An analogy is a bridge built twice. Find the beam that joins the first two words, then build the same beam from the third word to find the fourth.",
      diagram: `flowchart LR
  A["Bird"] -->|"lives in"| B["Nest"]
  C["Bee"] -->|"lives in"| D["Hive"]`,
      caption: "Same relationship, same direction.",
    },
  },
  {
    slug: "completing-statements",
    title: "Completing Statements",
    description: "Choosing the ending that fits a sentence's logic, using its linking words.",
    minutes: 20,
    theory: `Completing-statement questions give the start of a sentence and four possible endings. The right ending fits the sentence's grammar **and** its logic. The linking word in the first half usually tells you which way the sentence must go.

## Start here: linking words set the direction

| Linking word | The ending must… | Example |
|---|---|---|
| although, though, even though | contrast with the first part | Although he studied hard, he failed. |
| because, since, as | give a result of the reason | Because it rained, the match was cancelled. |
| unless | show what happens if the condition isn't met | Unless you hurry, you'll miss the bus. |
| so … that | give a result of the degree | He was so tired that he fell asleep. |
| not only … | continue with "but also" | Not only did she win, but she also set a record. |
| no sooner … | continue with "than" | No sooner had he left than it rained. |
| the more … | continue with "the more / the better" | The more you read, the better you write. |
| if (past form) | use "would" | If I had time, I would help. |

## Method step by step

1. Find the linking word and decide the direction: contrast, cause-result, condition, or fixed pair
2. Eliminate endings that go the wrong way
3. Check the grammar of what's left (tense, fixed pairs like "not only … but also")
4. Read the whole sentence aloud with your choice

## Worked examples

**Example 1 (warm-up).** "Although he studied hard, …"
(a) he cleared the exam easily (b) he could not clear the exam (c) therefore he passed (d) because he was clever
"Although" needs a contrast: **(b)**.

**Example 2.** "Unless you leave now, …"
(a) you will miss the train (b) you will catch the train early (c) you missed the train (d) because the train is late
"Unless" means "if not": if you don't leave now, you'll miss the train: **(a)**.

**Example 3 (fixed pair).** "No sooner had the bell rung …"
(a) when the students rushed out (b) than the students rushed out (c) then the students rushed out (d) the students rushed out
"No sooner" pairs with "than": **(b)**.

**Example 4 (test level).** "Since the shop was closed, …"
(a) we went home (b) we bought everything we needed (c) it was open (d) although we shopped
"Since" here means "because": the result of a closed shop is going home: **(a)**.

## When two endings both seem fine

Check tense agreement with the first half and whether a fixed pair is required. Usually only one ending is fully correct on both meaning and grammar.

## Traps in this topic

- picking an ending that's true in real life but doesn't follow the linking word
- missing a fixed pair (no sooner … than, not only … but also)
- tense mismatch: "If I had time, I will help" is wrong

## Practice

1. "The more you practise, …"
2. "He was so tired that …"
3. "Because it was raining heavily, …"

**Answers:** 1) **the better you become**. 2) **he fell asleep at once**. 3) **the match was postponed** (any result of heavy rain).`,
    sources: [WIKI_CONJ, OWL],
    remember: [
      "The linking word sets the direction: contrast, cause-result, condition",
      "Although → contrast; because/since → result; unless → 'if not'",
      "Fixed pairs: no sooner … than; not only … but also; the more … the better",
      "Check tense agreement with the first half",
    ],
    quick: { question: "\"Although he studied hard, …\"", options: ["he could not clear the exam", "he cleared the exam easily", "therefore he passed", "because he was clever"], answer: 0, explanation: "'Although' needs a contrast." },
    questions: [
      { q: "\"Unless you leave now, …\"", o: ["you will miss the train", "you will catch the train early", "you missed the train", "because the train is late"], a: 0, e: "'Unless' means 'if not'." },
      { q: "\"No sooner had the bell rung …\"", o: ["than the students rushed out", "when the students rushed out", "then the students rushed out", "the students rushed out"], a: 0, e: "'No sooner' pairs with 'than'." },
      { q: "\"Since the shop was closed, …\"", o: ["we went home", "we bought everything we needed", "it was open", "although we shopped"], a: 0, e: "'Since' means 'because' here; going home is the result." },
      { q: "\"The more you practise, …\"", o: ["the better you become", "the worse you become", "you become better", "and better"], a: 0, e: "'The more …, the better …' is a fixed pattern." },
    ],
    visual: {
      plain: "The linking word is a road sign. 'Although' says turn the other way; 'because' says keep going in the same direction; 'unless' says what happens if you don't take the turn.",
      diagram: `flowchart LR
  L{"linking word"} -->|"although"| C["contrast"]
  L -->|"because / since"| R["result"]
  L -->|"unless"| N["if not …"]
  L -->|"no sooner"| T["… than …"]`,
      caption: "Read the sign, then pick the ending that follows it.",
    },
  },
];
