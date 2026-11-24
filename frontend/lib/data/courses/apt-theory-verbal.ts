// Long-form theory for Verbal Ability: grammar and comprehension. Original writing.
import { LessonTheory } from './utils';

const OWL_GRAMMAR = { title: "Purdue OWL: Grammar", url: "https://owl.purdue.edu/owl/general_writing/grammar/index.html" };
const OWL_SVA = { title: "Purdue OWL: Subject-Verb Agreement", url: "https://owl.purdue.edu/owl/general_writing/grammar/subject_verb_agreement.html" };
const OWL_TENSES = { title: "Purdue OWL: Verb Tenses", url: "https://owl.purdue.edu/owl/general_writing/grammar/verb_tenses/index.html" };
const CAMBRIDGE_GRAMMAR = { title: "Cambridge Dictionary: English Grammar Today (free)", url: "https://dictionary.cambridge.org/grammar/british-grammar/" };
const BRITISH_COUNCIL = { title: "British Council LearnEnglish: Grammar (free)", url: "https://learnenglish.britishcouncil.org/grammar" };
const OWL_READING = { title: "Purdue OWL: Reading and comprehension strategies", url: "https://owl.purdue.edu/owl/general_writing/academic_writing/index.html" };
const KHAN_READING = { title: "Khan Academy: Reading and vocabulary (free)", url: "https://www.khanacademy.org/ela" };
const WIKI_COHESION = { title: "Wikipedia: Cohesion (linguistics)", url: "https://en.wikipedia.org/wiki/Cohesion_(linguistics)" };

export const aptVerbalTheory: Record<string, LessonTheory> = {
  "parts-of-speech": {
    theory: `Every word in a sentence plays a role: naming something, describing it, expressing action, connecting ideas. These roles are the **parts of speech**, and knowing them is the foundation for spotting grammatical errors, choosing correct words in fill-in-the-blank questions and writing clearly in interviews and emails. This lesson covers the eight traditional parts of speech, how one word can change roles, and the errors each category commonly produces in tests.

## The eight parts of speech

| Part of speech | Role | Examples |
|---|---|---|
| Noun | Names a person, place, thing or idea | engineer, Mumbai, laptop, honesty |
| Pronoun | Replaces a noun | he, she, it, they, who, this |
| Verb | Expresses action or state | write, is, become, seem |
| Adjective | Describes a noun | efficient, blue, three |
| Adverb | Describes a verb, adjective or adverb | quickly, extremely, often |
| Preposition | Shows relationships of place, time or direction | in, on, at, between, during |
| Conjunction | Joins words or clauses | and, but, because, although |
| Interjection | Expresses emotion | oh, wow, alas |

Articles (a, an, the) are often grouped with adjectives as **determiners**.

## Nouns

- **common** (city) and **proper** (Delhi, capitalized)
- **countable** (book, books) and **uncountable** (information, advice, furniture, equipment)
- **collective** (team, committee, jury)

Uncountable nouns take no plural and no "a": "many informations" and "an advice" are errors; write "much information" and "a piece of advice".

## Pronouns

Pronouns must agree with the noun they replace (their **antecedent**) in number and gender, and take the right case:

| Case | Forms | Use |
|---|---|---|
| Subject | I, he, she, we, they, who | Before the verb |
| Object | me, him, her, us, them, whom | After verbs and prepositions |
| Possessive | my/mine, his, her/hers, our/ours, their/theirs, whose | Ownership |

Common errors:

- "Between you and **I**" → "between you and **me**" (object after a preposition)
- "**Me and him** went" → "**He and I** went"
- "Each student must bring **their** book" is widely accepted today, though formal tests may expect "his or her"

## Verbs

Verbs carry tense, and they must agree with their subjects; separate lessons cover agreement and tenses. Also note:

- **linking verbs** (is, seem, become) connect the subject to a description: "She seems **happy**" (adjective, not "happily")
- **transitive** verbs take an object ("She wrote a report"); **intransitive** verbs don't ("He slept")

## Adjectives and adverbs

Adjectives modify nouns; adverbs modify verbs, adjectives and other adverbs.

- "She sings **beautiful**" → "She sings **beautifully**" (describing the verb)
- "I feel **badly**" → "I feel **bad**" (linking verb takes an adjective)

Comparatives and superlatives: tall, taller, tallest; good, better, best. Don't double them: "more better" is wrong. Use the comparative for two items and the superlative for three or more.

## Prepositions

Prepositions are idiomatic and frequently tested:

- **time**: at 5 p.m., on Monday, in March, in 2024
- **place**: at the station, on the table, in the room
- **fixed combinations**: interested **in**, good **at**, depend **on**, comply **with**, prefer A **to** B, different **from**, capable **of**

There's no rule that predicts every combination; learn common ones through reading and practice.

## Conjunctions

- **coordinating** (for, and, nor, but, or, yet, so) join equal parts
- **subordinating** (because, although, if, when, unless, while) introduce dependent clauses
- **correlative pairs** must match: either...or, neither...nor, not only...but also, both...and

"Although he worked hard, **but** he failed" uses two conjunctions for one link; drop "but".

## One word, many roles

A word's part of speech depends on its use:

- "**Light** the lamp" (verb), "a **light** bag" (adjective), "the **light** is bright" (noun)
- "She ran **fast**" (adverb), "a **fast** car" (adjective)

Identify the role in the sentence, not the word in isolation.

## Articles

- "a" before consonant sounds, "an" before vowel sounds: **an** hour, **a** university, **an** MBA
- "the" for specific or unique things: **the** sun, **the** report you sent
- no article for general plural or uncountable nouns: "Engineers solve problems"

## How interviewers test this

Expect error-spotting and sentence-correction questions built on pronoun case, adjective-versus-adverb choices, uncountable nouns, prepositions, double comparatives, correlative conjunctions and articles. Identify each word's role in the sentence, then apply the rule for that part of speech.`,
    sources: [OWL_GRAMMAR, CAMBRIDGE_GRAMMAR],
  },

  "subject-verb-agreement": {
    theory: `A verb must agree with its subject in number: singular subjects take singular verbs, plural subjects take plural verbs. "The report **is** ready", "The reports **are** ready". The rule is short, but tests exploit the cases where the true subject is hidden, separated from its verb, or ambiguous in number. Subject-verb agreement is the single most tested grammar rule in placement error-spotting. This lesson covers the core rule and every common tricky case.

## The core rule

In the present tense, a third-person singular subject takes a verb ending in -s:

- he **works**, she **writes**, the system **runs**
- they **work**, engineers **write**, the systems **run**

With "be": I am, he/she/it is, we/you/they are; was for singular past, were for plural past.

## Find the real subject

Words between the subject and verb don't change the agreement:

- "The **list** of items **is** on the desk" (list is the subject, not items)
- "The **quality** of the products **has** improved"
- "One of my friends **is** a pilot" (one is the subject)

Mentally remove the prepositional phrase to find the subject.

## Phrases that don't add subjects

"Along with", "as well as", "together with", "in addition to" and "accompanied by" don't make the subject plural:

- "The manager, along with her team, **is** attending"
- "The CEO as well as the directors **was** present"

## Compound subjects

- joined by **and**: plural. "Ravi and Asha **are** here"
- exception: when the two nouns name one thing or person: "Bread and butter **is** my breakfast"; "The secretary and treasurer **has** resigned" (one person holding both roles)
- joined by **or**, **either...or**, **neither...nor**: the verb agrees with the **nearer** subject: "Neither the students nor the teacher **was** informed"; "Either the teacher or the students **are** responsible"

## Indefinite pronouns

| Always singular | Always plural | Depends on the noun that follows |
|---|---|---|
| each, every, everyone, someone, anyone, nobody, either, neither, everything | both, few, many, several | some, all, most, none, any, half |

- "Each of the candidates **has** a laptop"
- "Several of the candidates **have** laptops"
- "Some of the water **is** contaminated" / "Some of the bottles **are** broken"

"None" is traditionally singular in formal writing ("None of them **is** ready"), though plural usage is common; tests usually accept singular.

## Collective nouns

Team, committee, jury, family, government and audience usually take a singular verb when acting as a unit, and plural when the members act individually:

- "The committee **has** approved the plan" (as a unit)
- "The committee **are** divided in their opinions" (individuals, more common in British English)

## Nouns that look plural

- singular despite the -s: news, mathematics, physics, economics (as a subject), measles: "The news **is** good"
- always plural: scissors, trousers, spectacles, goods, thanks: "The scissors **are** sharp"; but "a pair of scissors **is**"

## Amounts and quantities

Sums of money, distances and time periods treated as a single amount are singular:

- "Five thousand rupees **is** a fair price"
- "Ten kilometres **is** a long walk"

## "The number" versus "a number"

- "**The number** of applicants **is** rising" (singular)
- "**A number** of applicants **are** waiting" (plural, meaning "many")

## Inverted sentences

When the subject follows the verb, find it before choosing:

- "There **are** many reasons" / "There **is** one reason"
- "Here **comes** the bus" / "Here **come** the buses"
- "On the table **lie** the files"

## Relative clauses

In "who/which/that" clauses, the verb agrees with the antecedent:

- "She is one of the engineers who **work** late" (who refers to engineers)
- "She is the only one of the engineers who **works** late" (who refers to one)

## Titles and clauses as subjects

Titles of works and clauses are singular: "*Great Expectations* **is** a novel"; "What we need **is** more time".

## A worked set

~~~
"The box of chocolates are on the table."       → is (subject: box)
"Neither of the answers are correct."          → is (neither is singular)
"Mathematics are my favourite subject."        → is (singular despite -s)
"There is several options available."          → are (subject: options)
~~~

In every case, the error comes from agreeing with a nearby word instead of the true subject.

## How interviewers test this

Expect error-spotting sentences with separated subjects, "as well as" phrases, either-or constructions, indefinite pronouns, collective nouns, deceptive plurals, "the number" versus "a number" and inverted order. Strip away modifiers to find the true subject, then apply the specific rule for its type.`,
    sources: [OWL_SVA, BRITISH_COUNCIL],
  },

  "tenses": {
    theory: `Tense tells when an action happens: past, present or future. English combines three times with four aspects (simple, continuous, perfect, perfect continuous) to form twelve tenses. Placement tests check whether you use the right tense for the time and duration described, keep tenses consistent, and handle conditionals and time clauses correctly. This lesson covers the twelve tenses, when to use each, consistency and sequence of tenses, conditionals, and the most tested errors.

## The tense table

| | Simple | Continuous | Perfect | Perfect continuous |
|---|---|---|---|---|
| Present | I write | I am writing | I have written | I have been writing |
| Past | I wrote | I was writing | I had written | I had been writing |
| Future | I will write | I will be writing | I will have written | I will have been writing |

## Present tenses

- **present simple**: habits, facts, schedules. "Water **boils** at 100 °C." "The train **leaves** at 6."
- **present continuous**: actions happening now or temporary situations. "She **is preparing** for interviews this month."
- **present perfect**: past actions connected to the present, with no specific past time. "I **have completed** the course." "She **has lived** here since 2019."
- **present perfect continuous**: actions that started in the past and continue, emphasizing duration. "They **have been working** on the project for three months."

## Past tenses

- **past simple**: completed actions at a specific past time. "I **joined** the company in 2022."
- **past continuous**: an action in progress at a past moment, often interrupted. "I **was studying** when the power went out."
- **past perfect**: an action completed before another past action. "The train **had left** before we reached the station."
- **past perfect continuous**: duration before a past point. "She **had been waiting** for an hour when the bus arrived."

## Future tenses

- **future simple**: predictions, promises, decisions made now. "I **will send** the file tonight."
- **future continuous**: an action in progress at a future time. "At 10 a.m. tomorrow, I **will be taking** the test."
- **future perfect**: completed before a future time. "By June, she **will have finished** her degree."
- **future perfect continuous**: duration up to a future point. "By December, he **will have been working** here for five years."

"Going to" also expresses plans and predictions based on evidence: "Look at the clouds; it's **going to** rain."

## Key time markers

| Marker | Usual tense |
|---|---|
| yesterday, last year, in 2020, ago | Past simple |
| since, for (with present relevance), already, yet, recently, ever, never | Present perfect |
| now, at the moment, currently | Present continuous |
| by the time (past), before (two past actions) | Past perfect |
| by next year, by the time (future) | Future perfect |

The present perfect can't take a specific past time: "I **have finished** it yesterday" is wrong; write "I **finished** it yesterday."

## Since and for

- **since** marks a starting point: since Monday, since 2020
- **for** marks a duration: for three days, for two years

"I have been here **since** two hours" is wrong; write "**for** two hours".

## Time and conditional clauses

After time words (when, as soon as, before, after, until) and "if" referring to the future, English uses the **present** tense, not "will":

- "I will call you when I **reach**" (not "when I will reach")
- "If it **rains**, the match will be postponed"

## Conditionals

| Type | Use | Form |
|---|---|---|
| Zero | General truths | If + present, present: "If you heat ice, it melts." |
| First | Likely future | If + present, will + verb: "If you study, you will pass." |
| Second | Unlikely or hypothetical present | If + past, would + verb: "If I were rich, I would travel." |
| Third | Hypothetical past | If + past perfect, would have + past participle: "If she had left earlier, she would have caught the train." |

"If I **would have** known" is a common error; write "If I **had known**". In the second conditional, "were" is standard for all persons in formal English: "If he **were** here".

## Consistency and sequence of tenses

Don't shift tenses without a reason within a passage. In reported speech, a past reporting verb usually moves the reported verb back:

- "She said that she **was** tired" (not "is", unless the fact remains true now)
- universal truths stay in the present: "The teacher said that the earth **revolves** around the sun"

## Stative verbs

Verbs of state (know, believe, like, own, understand, seem) rarely take continuous forms: "I **am knowing** the answer" → "I **know** the answer".

## How interviewers test this

Expect error-spotting and fill-in-the-blank questions on present perfect with past time markers, since versus for, "will" in time and if-clauses, conditional forms, past perfect sequencing, stative verbs and reported speech. Read the time markers first, decide the time and aspect, then check consistency across the sentence.`,
    sources: [OWL_TENSES, BRITISH_COUNCIL],
  },

  "sentence-correction": {
    theory: `Sentence correction and error-spotting questions present a sentence, often divided into parts, and ask which part contains an error or which option corrects it. They combine every grammar topic: agreement, tenses, pronouns, modifiers, parallel structure, prepositions, articles and word choice. A systematic checklist turns these from guesswork into a routine. This lesson covers the question formats, a checking order, the high-frequency error types and how to choose between grammatically correct options.

## Question formats

- **error spotting**: the sentence is split into parts (A), (B), (C), (D); choose the part with an error, or "no error"
- **sentence improvement**: a part of the sentence is underlined; choose the replacement that fixes it, or "no improvement"
- **choose the correct sentence**: pick the one grammatically correct option among several

## A checking order

Run through these in order; most errors appear in the first few:

1. **subject-verb agreement**: find the true subject and check the verb
2. **tense**: check time markers and consistency
3. **pronouns**: case, agreement with antecedent, clear reference
4. **modifiers**: is each descriptive phrase next to the word it describes?
5. **parallel structure**: are listed or compared items in the same grammatical form?
6. **prepositions and idioms**: correct fixed combinations
7. **articles and determiners**: a, an, the, much, many, few, less
8. **word choice and redundancy**: confused words, repeated meanings

## Misplaced and dangling modifiers

A modifier must sit next to what it describes:

- "Walking to the office, **the rain** started" → the rain wasn't walking. "Walking to the office, **I** got caught in the rain."
- "She **only** eats vegetables on Mondays" versus "She eats vegetables **only** on Mondays": placement changes meaning

## Parallel structure

Items in a list or comparison must share the same form:

- "She likes reading, writing and **to swim**" → "reading, writing and **swimming**"
- "The job requires **not only** skill **but also** being patient" → "not only skill but also patience"
- comparisons must compare like things: "The salary of an engineer is higher than **a teacher**" → "than **that of** a teacher"

## Redundancy

Remove words that repeat meaning:

- "return **back**", "repeat **again**", "**free** gift", "**past** history", "**each and every**", "the reason is **because**" → "the reason is **that**"

## Commonly confused words

| Pair | Distinction |
|---|---|
| affect / effect | affect is usually a verb, effect usually a noun |
| fewer / less | fewer for countable nouns, less for uncountable |
| between / among | between for two (or distinct items), among for groups |
| lie / lay | lie needs no object (lie down); lay takes one (lay the book) |
| its / it's | its is possessive; it's means "it is" |
| principal / principle | principal means main or head; principle means rule |
| stationary / stationery | stationary means not moving; stationery means paper supplies |
| compliment / complement | praise versus something that completes |

## Comparisons and degree

- no double comparatives: "more better" → "better"
- "superior **to**", "senior **to**", "prefer **to**" (not "than")
- "one of the **best** students", not "one of the better students" when three or more are compared

## Other frequent errors

- "**Hardly** had he arrived **than**" → "**when**"; "**No sooner** had he arrived **when**" → "**than**"
- "**Lest** he **should** fail" (lest takes "should" or the base form, never "not")
- "**Unless** you **don't** study" → "Unless you study" (unless already means "if not")
- "**Scarcely** ... **when**", "**not only** ... **but also**" correlative pairs
- "**Each** of the boys **have**" → "has"
- "**Despite of**" → "despite" or "in spite of"
- "**discuss about**" → "discuss"; "**cope up with**" → "cope with"

## Choosing between correct options

Sometimes several options are grammatical. Prefer the one that is:

- **clear**: no ambiguous pronouns
- **concise**: no redundant words
- **faithful**: keeps the original meaning
- **idiomatic**: sounds natural in standard English

## Strategy

- read the whole sentence first to understand its meaning
- check the high-frequency error types before subtle ones
- don't choose "no error" until you've checked every part against the list
- in improvement questions, eliminate options that introduce new errors

## How interviewers test this

Expect error-spotting sentences in four parts, underlined-portion improvements and "choose the correct sentence" questions, mixing agreement, tense, modifiers, parallelism, idioms, confused words and redundancy. Work through the checking order, fix the first definite error, and among correct options prefer the clearest and most concise.`,
    sources: [OWL_GRAMMAR, CAMBRIDGE_GRAMMAR],
  },

  "reading-comprehension": {
    theory: `Reading comprehension (RC) presents a passage, usually 300 to 600 words on business, science, society or culture, followed by questions about its meaning, structure and implications. RC tests whether you can understand an argument quickly, locate information and distinguish what the passage says from what you already believe. It carries significant weight in most verbal sections. This lesson covers reading strategy, question types and how to eliminate tempting wrong answers.

## How to read the passage

1. **read actively for structure**: what's the main point, and how does each paragraph support or qualify it?
2. **note the author's tone**: supportive, critical, neutral, sceptical, optimistic
3. **mark transitions**: "however", "therefore", "in contrast", "for example" signal how ideas connect
4. **don't memorize details**: you can return to the passage for specifics

A useful habit is writing a few words summarizing each paragraph on rough paper: "P1 problem, P2 cause, P3 proposed solution, P4 limits".

## Read the passage first or the questions first?

Reading the questions first helps when the passage is long and questions are mostly detail-based. Reading the passage first works better for main-idea and inference questions. A common compromise: skim the question stems (not the options), then read the passage with those in mind.

## Question types

| Type | Asks | Approach |
|---|---|---|
| Main idea | The central point or best title | Choose the option covering the whole passage, not one paragraph |
| Detail | A specific fact stated in the passage | Locate the sentence and match carefully |
| Inference | What the passage implies but doesn't state | Choose what must be true based on the text |
| Vocabulary in context | A word's meaning as used | Predict from context, then compare |
| Tone or attitude | The author's stance | Look at word choices and qualifications |
| Purpose or structure | Why a paragraph or example is included | Ask how it supports the main argument |
| Application | Which situation fits the passage's principle | Match the logic, not the topic |

## Main idea questions

The correct answer is broad enough to cover the passage but not broader than it:

- **too narrow**: describes one paragraph or example
- **too broad**: claims more than the passage discusses
- **distorted**: uses passage words but changes the meaning

## Inference questions

An inference must be **strongly supported** by the passage. Avoid answers that are plausible in reality but not grounded in the text, and answers with extreme language ("always", "never", "completely") unless the passage is equally absolute.

~~~
Passage: "Although remote work raised productivity for many teams, firms reported more difficulty onboarding new employees."
Valid inference: Remote work has drawbacks for some aspects of team building.
Invalid: Remote work lowers productivity for new employees. (not stated)
Invalid: All firms should return to office work. (beyond the passage)
~~~

## Tone questions

Tone words appear in options: objective, critical, appreciative, ambivalent, sarcastic, cautious. Most academic and editorial passages have moderate tones; extreme tones such as "furious" or "euphoric" are rarely correct. Words like "however", "arguably" and "may" signal a qualified, balanced stance.

## Eliminating wrong answers

Common wrong-answer patterns:

- **out of scope**: introduces ideas the passage doesn't discuss
- **opposite**: reverses the passage's claim
- **half right**: the first part matches, the second doesn't
- **extreme**: overstates the passage's position
- **true but irrelevant**: accurate but doesn't answer the question

Eliminating these usually leaves one option.

## Managing time

- spend about 3 to 4 minutes reading a medium passage
- answer detail questions by locating the relevant sentence rather than relying on memory
- don't let one difficult question consume the time for others in the set

## Building RC skill

Daily reading of editorials, science magazines and long-form journalism builds speed and comfort with complex arguments. After reading, summarize the argument in two sentences and identify the author's tone; this practises exactly what RC questions test.

## How interviewers test this

Expect one or two passages with four to six questions each, covering main idea, detail, inference, vocabulary, tone and purpose. Read for structure and tone, return to the text for details, choose inferences firmly grounded in the passage, and eliminate out-of-scope, extreme and half-right options.`,
    sources: [KHAN_READING, OWL_READING],
  },

  "para-jumbles": {
    theory: `Para-jumble questions give four to six sentences from a paragraph in scrambled order and ask you to arrange them into a coherent paragraph. Some variants ask for the odd sentence that doesn't belong, or for the sentence that best completes a paragraph. Para-jumbles test your understanding of how writers connect ideas: introductions, pronoun references, transitions, chronology and logical progression. This lesson covers the clues that link sentences, a step-by-step method and strategies for the variants.

## What makes a paragraph coherent

Sentences in a well-written paragraph are linked by **cohesive devices**:

- **pronouns** that refer back to earlier nouns ("he", "this", "these", "such")
- **transition words** showing relationships ("however", "therefore", "for example", "finally")
- **repeated or related keywords**
- **logical or time order** (cause before effect, general before specific, earlier before later)

Finding these links is the core of solving para-jumbles.

## Identify the opening sentence

The first sentence usually:

- introduces the topic or a general statement
- names people or things in full (later sentences use pronouns or shorter references)
- doesn't start with a pronoun, a transition like "however" or "therefore", or "this" or "such" referring back

~~~
A. This shift has changed how companies hire.
B. Over the last decade, remote work has grown rapidly.
C. Moreover, it has widened the talent pool beyond major cities.
D. Firms now interview candidates from across the country.
~~~

B introduces the topic; A refers back with "This shift", so it follows B.

## Find mandatory pairs

Pairs of sentences that must be adjacent narrow the options quickly:

- a sentence with a pronoun follows the sentence introducing its noun
- "for example" follows the general claim it illustrates
- "however" follows the statement it contrasts
- an answer follows its question; an effect follows its cause

In the example, A ("This shift has changed how companies hire") pairs with D ("Firms now interview candidates from across the country"), and C ("Moreover, it has widened...") adds another effect. Order: B, A, D, C.

## Identify the closing sentence

The last sentence often concludes, summarizes, gives a consequence or uses words like "thus", "therefore", "in short" or "finally". It rarely introduces a new term without explanation.

## Using the options

In multiple-choice para-jumbles, the options help:

1. decide the opening sentence and eliminate options that start differently
2. find one mandatory pair and eliminate options that split it
3. check the remaining options for the ending

Often two steps leave a single option.

## Chronology

Dates, sequence words (first, then, later, eventually) and the natural order of a process provide strong ordering clues. "Initially" belongs early; "eventually" late.

## General to specific

Many paragraphs move from a general claim to supporting details and examples, or from a problem to its causes to a solution. Recognize the pattern and arrange sentences to fit it.

## The odd sentence out

In this variant, four sentences form a paragraph and one doesn't fit:

- the odd sentence may share keywords with the paragraph but discuss a different aspect or tone
- check which sentence breaks the logical chain when included
- form the coherent paragraph from the others; the leftover is the answer

## Paragraph completion

Some questions give a paragraph with a missing final or middle sentence. Choose the option that continues the argument consistently in topic, tone and logic, without introducing a new idea or contradicting earlier points.

## Common mistakes

- choosing an opener that starts with a pronoun or transition
- arranging by topic similarity rather than logical links
- ignoring what pronouns refer to
- forcing a sentence into the middle when it's clearly a conclusion

## Practice tip

When reading editorials or articles, notice how each sentence connects to the previous one. Underlining pronouns and transitions in a paragraph you've read trains your eye for the links para-jumbles depend on.

## A worked set

~~~
P. As a result, many cities now run cycle-sharing schemes.
Q. Cycling has become popular as a cheap and clean way to commute.
R. However, safe cycle lanes remain scarce in most of them.
S. Governments have encouraged this trend to cut traffic and pollution.
~~~

Q introduces the topic. S refers to "this trend", so it follows Q. P gives a result of government encouragement, and R contrasts with P using "However" and "them" (the cities). Order: Q, S, P, R.

## How interviewers test this

Expect arranging four to six sentences, finding the odd sentence out and choosing a paragraph's completion. Find the opening sentence (no back-references), lock in mandatory pairs through pronouns, transitions and cause-effect links, identify the conclusion, and use options to eliminate quickly.`,
    sources: [WIKI_COHESION, OWL_READING],
  },

  "fill-in-the-blanks": {
    theory: `Fill-in-the-blank questions present a sentence or short passage with one or more gaps and ask you to choose words that complete it correctly. They test vocabulary, grammar and understanding of how ideas relate within a sentence. Strong performance comes from reading the whole sentence for meaning first, using signal words, and checking both grammar and meaning before choosing. This lesson covers the question types, the clues to use, double-blank strategies and the grammar checks that eliminate options quickly.

## Question types

- **single blank**: choose one word or phrase
- **double blank**: choose a pair that fits both gaps
- **grammar-based**: the correct option depends on a preposition, article, tense or form
- **vocabulary-based**: the options are grammatically similar, and meaning decides
- **cloze passage**: a paragraph with several blanks, each answered separately but connected by context

## Read the whole sentence first

Meaning depends on the full sentence. Predict the type of word needed before looking at options:

~~~
"Despite the team's ______ preparation, the presentation went poorly."
"Despite" signals contrast → preparation was good → thorough, careful, meticulous
~~~

## Signal words

| Signal | Relationship | Examples |
|---|---|---|
| Contrast | The blank opposes another idea | but, although, despite, however, yet, while, unlike |
| Continuation | The blank agrees with another idea | and, also, moreover, furthermore, similarly |
| Cause and effect | The blank is a cause or result | because, since, therefore, consequently, so |
| Example | The blank is illustrated | for example, such as, including |
| Definition | The blank is explained | that is, in other words, which means |

~~~
"The scientist was known for her ______; she never published a result without checking it three times."
The semicolon introduces an explanation → rigour, thoroughness
~~~

## Grammar checks

Eliminate options that don't fit grammatically:

- **part of speech**: an article before the blank needs a noun or adjective-noun; "extremely ______" needs an adjective or adverb
- **article agreement**: "an ______" needs a word starting with a vowel sound
- **singular or plural**: "one of the ______" needs a plural noun
- **verb form**: "has ______" needs a past participle
- **prepositions**: the blank may need a word that pairs with a following preposition: "adept **at**", "averse **to**", "consistent **with**"

~~~
"She was ______ to accept the offer without reading the contract."
Options: reluctance, reluctant, reluctantly, reluct
"was ______ to" needs an adjective → reluctant
~~~

## Double blanks

1. choose the blank with the stronger clue and solve it first
2. eliminate options whose word for that blank doesn't fit
3. test the remaining options on the second blank
4. read the complete sentence with your choice to confirm the meaning flows

~~~
"The new policy was ______ by employees but ______ by management, which saw it as costly."
Second blank: "which saw it as costly" → criticized, opposed
First blank: "but" signals contrast → welcomed, praised
Answer pair: welcomed, opposed
~~~

## Tone and intensity

Match the strength of the word to the sentence. "The results were ______ disappointing" might take "somewhat" or "deeply" depending on surrounding context. A sentence describing a minor setback shouldn't use "catastrophic".

## Collocations

English has natural word pairings, or collocations, that sound right to fluent readers: "make a decision" (not "do a decision"), "heavy rain" (not "strong rain"), "take responsibility", "pay attention", "commit a crime". When several options mean similar things, the collocation often decides.

## Cloze passages

- read the whole passage once before filling any blank
- use the passage's topic and tone to guide every choice
- check that each filled sentence connects logically to the next

## Common mistakes

- choosing a word after reading only half the sentence
- missing a contrast signal and picking the opposite meaning
- ignoring grammar fit when the meaning seems right
- choosing words that are too extreme for the context

## Practice tip

When reading, pay attention to how writers use contrast and cause words, and note natural collocations. Keeping a small list of collocations and preposition pairings you encounter makes these questions noticeably faster.

## How interviewers test this

Expect single and double blanks, grammar-based gaps (prepositions, forms, articles), vocabulary gaps decided by signal words, collocation questions and cloze passages. Read the full sentence, predict the needed meaning from signal words, eliminate options that fail grammar checks, and confirm by reading the completed sentence.`,
    sources: [BRITISH_COUNCIL, CAMBRIDGE_GRAMMAR],
  },
};
