// More verbal ability, from scratch to exam level: articles and prepositions, active and passive voice,
// direct and indirect speech, idioms and phrases, and cloze tests. Original writing.
import type { FullLesson } from './apt-extra-types';

const BC_GRAMMAR = { title: "Purdue OWL: Grammar (free)", url: "https://owl.purdue.edu/owl/general_writing/grammar/index.html" };
const WIKI_ARTICLE = { title: "Wikipedia: English articles", url: "https://en.wikipedia.org/wiki/English_articles" };
const WIKI_PREP = { title: "Wikipedia: English prepositions", url: "https://en.wikipedia.org/wiki/English_prepositions" };
const WIKI_PASSIVE = { title: "Wikipedia: English passive voice", url: "https://en.wikipedia.org/wiki/English_passive_voice" };
const WIKI_INDIRECT = { title: "Wikipedia: Indirect speech", url: "https://en.wikipedia.org/wiki/Indirect_speech" };
const WIKI_IDIOM = { title: "Wikipedia: English-language idioms", url: "https://en.wikipedia.org/wiki/English-language_idioms" };
const WIKI_PHRASAL = { title: "Wikipedia: Phrasal verb", url: "https://en.wikipedia.org/wiki/Phrasal_verb" };
const WIKI_CLOZE = { title: "Wikipedia: Cloze test", url: "https://en.wikipedia.org/wiki/Cloze_test" };

export const moreVerbal: FullLesson[] = [
  {
    slug: "articles-and-prepositions",
    title: "Articles and Prepositions",
    description: "a, an, the and no article; prepositions of time and place; fixed pairs for error spotting.",
    minutes: 25,
    theory: `Articles (a, an, the) and prepositions (in, on, at, of…) are tiny words that cause a large share of errors in "spot the error" and "fill in the blank" questions. A few rules plus a list of fixed pairs covers most of them.

## Start here: a or an goes by sound, not spelling

Use **an** before a vowel **sound**, **a** before a consonant sound:

| Word | Article | Why |
|---|---|---|
| hour, honest, heir | an | the h is silent |
| university, European, one-rupee coin | a | they start with a "y" or "w" sound |
| MBA, FIR, X-ray | an | the letter names start with a vowel sound: "em", "ef", "ex" |
| apple, umbrella | an | vowel sound |

## When to use the

- something already mentioned or known to both: "I bought a book. The book is long."
- unique things: the sun, the internet, the Prime Minister
- superlatives and ordinals: the best, the first, the only
- rivers, oceans, seas, mountain ranges, groups of islands: the Ganga, the Pacific, the Himalayas
- plural country names and those with "republic" or "kingdom": the USA, the UK
- musical instruments in general statements: she plays the violin

## No article

- general plurals and uncountable nouns: "Dogs are loyal", "Water is essential"
- most names of people, countries, cities, single mountains and lakes: Mount Everest, India
- meals, games and languages: "We had lunch", "He plays cricket", "She speaks French"
- institutions used for their purpose: go to school, in hospital (as a patient), to church

## Prepositions of time

| Use | For | Examples |
|---|---|---|
| at | clock times, festivals, night | at 5 pm, at Diwali, at night |
| on | days and dates | on Monday, on 15 August |
| in | months, years, seasons, parts of the day, long periods | in July, in 2024, in the morning |
| since | a starting point (with perfect tenses) | since 2019, since Monday |
| for | a length of time | for three years |

## Prepositions of place

- **at** a point: at the station, at the door
- **in** an enclosed space: in the room, in Delhi
- **on** a surface: on the table, on the wall

## Fixed pairs (learn these as single words)

| Correct | Wrong |
|---|---|
| good at | good in |
| interested in | interested on |
| depend on | depend upon is fine; depend of is wrong |
| different from | different than (avoid in tests) |
| married to | married with |
| afraid of | afraid from |
| capable of | capable to |
| prefer X to Y | prefer X than Y |
| senior / junior / superior to | senior than |
| discuss the issue | discuss about the issue |
| comprise X (or consist of X) | comprise of |
| enter the room | enter into the room |

## Traps in this topic

- choosing a or an by the first letter instead of the first sound
- adding "the" before general plurals: "The students should work hard" is wrong when talking about students in general
- "discuss about", "comprise of", "senior than": all wrong

## Practice

1. She waited for ___ hour. (a / an)
2. He is ___ European. (a / an)
3. I was born ___ 2004, ___ a Tuesday.
4. Correct the error: "He is senior than me and prefers tea than coffee."

**Answers:** 1) **an** hour. 2) **a** European. 3) **in** 2004, **on** a Tuesday. 4) "He is senior **to** me and prefers tea **to** coffee."`,
    sources: [BC_GRAMMAR, WIKI_ARTICLE, WIKI_PREP],
    remember: [
      "a / an depends on the first sound: an hour, a university, an MBA",
      "the for known, unique, superlative things and for rivers, oceans and mountain ranges",
      "No article for general plurals, uncountables, meals, games and languages",
      "at a time / point, on a day / surface, in a month / year / enclosed space",
      "Senior to, prefer X to Y, discuss (no 'about'), comprise (no 'of')",
    ],
    quick: {
      question: "Choose the correct option: \"She is ___ honest person and ___ university teacher.\"",
      options: ["an, a", "a, an", "an, an", "a, a"],
      answer: 0,
      explanation: "Silent h gives a vowel sound (an honest); university starts with a 'y' sound (a university).",
    },
    questions: [
      { q: "Which sentence is correct?", o: ["He is senior to me.", "He is senior than me.", "He is senior from me.", "He is senior over me."], a: 0, e: "Senior, junior, superior and inferior take 'to'." },
      { q: "Fill in: \"The meeting is ___ Monday ___ 10 am.\"", o: ["on, at", "in, at", "at, on", "on, in"], a: 0, e: "on for days, at for clock times." },
      { q: "Which needs 'the'?", o: ["___ Ganga flows through Varanasi.", "___ Mount Everest is high.", "___ India is large.", "___ Dogs are loyal."], a: 0, e: "Rivers take 'the'; single mountains, most countries and general plurals don't." },
      { q: "Spot the error: \"We will discuss about the plan tomorrow.\"", o: ["'discuss about' should be 'discuss'", "'will' should be 'shall'", "'tomorrow' should be 'on tomorrow'", "No error"], a: 0, e: "Discuss is followed directly by its object." },
    ],
    visual: {
      plain: "Prepositions of time zoom out like a camera: at a precise moment, on a day, in a longer stretch like a month or a year.",
      diagram: `flowchart LR
  A["at<br/>5 pm, night"] --> O["on<br/>Monday, 15 August"] --> I["in<br/>July, 2024, summer"]`,
      caption: "From the most precise (at) to the widest (in).",
    },
  },
  {
    slug: "active-passive-voice",
    title: "Active and Passive Voice",
    description: "Converting between voices in every tense, with questions, commands and modals.",
    minutes: 25,
    theory: `In the **active** voice the doer comes first: "Ravi wrote the letter." In the **passive** voice the thing acted upon comes first: "The letter was written by Ravi." Tests ask you to convert a sentence, and the options differ in tense, helper verbs and agreement.

## Start here: the three-step conversion

1. Move the **object** to the front as the new subject
2. Use the right form of **be** for the original tense, plus the **past participle** (written, done, taken)
3. Move the original subject to the end with **by** (or drop it if it's unknown or unimportant)

Pronouns change form: I → me, we → us, he → him, she → her, they → them.

## The tense table

| Tense | Active | Passive |
|---|---|---|
| Present simple | He writes a letter | A letter is written by him |
| Present continuous | He is writing a letter | A letter is being written by him |
| Present perfect | He has written a letter | A letter has been written by him |
| Past simple | He wrote a letter | A letter was written by him |
| Past continuous | He was writing a letter | A letter was being written by him |
| Past perfect | He had written a letter | A letter had been written by him |
| Future simple | He will write a letter | A letter will be written by him |
| Future perfect | He will have written a letter | A letter will have been written by him |
| Modal | He can / must / should write | A letter can / must / should be written |

Perfect continuous tenses (has been writing) and the future continuous are rarely made passive; if an option tries, it's usually wrong.

## Questions

~~~
Did he write the letter?        →  Was the letter written by him?
Is she cooking dinner?          →  Is dinner being cooked by her?
Who wrote this?                 →  By whom was this written?
Why did they cancel the trip?   →  Why was the trip cancelled by them?
~~~

## Commands and requests

~~~
Close the door.                 →  Let the door be closed.
Please help me.                 →  You are requested to help me.
Don't touch the wire.           →  Let the wire not be touched. / You are warned not to touch the wire.
~~~

## Two objects

"She gave me a book" has two passives: "I was given a book by her" (more natural) and "A book was given to me by her".

## Agreement

The helper verb agrees with the **new** subject: "The workers built the bridges" → "The bridges **were** built by the workers."

## Traps in this topic

- changing the tense while converting (wrote → has been written is wrong)
- forgetting "being" in continuous tenses
- singular / plural helper verb that matches the old subject instead of the new one

## Practice

1. They are painting the house.
2. Has she finished the report?
3. The police caught the thieves.
4. Switch off the lights.

**Answers:** 1) The house **is being painted** by them. 2) **Has the report been finished** by her? 3) The thieves **were caught** by the police. 4) **Let the lights be switched off.**`,
    sources: [BC_GRAMMAR, WIKI_PASSIVE],
    remember: [
      "Object to the front, form of 'be' + past participle, doer after 'by'",
      "Keep the tense: was writing → was being written; has written → has been written",
      "Questions: Did he write…? → Was … written by him?; Who…? → By whom…?",
      "Commands: Close the door → Let the door be closed",
      "The helper verb agrees with the new subject",
    ],
    quick: {
      question: "Change to passive: \"He is writing a letter.\"",
      options: ["A letter is being written by him.", "A letter is written by him.", "A letter was being written by him.", "A letter has been written by him."],
      answer: 0,
      explanation: "Present continuous takes is / are being + past participle.",
    },
    questions: [
      { q: "Passive of \"Who wrote this book?\"", o: ["By whom was this book written?", "Who was this book written?", "By whom is this book written?", "This book was written by who?"], a: 0, e: "Who → By whom, with the past simple 'was written'." },
      { q: "Passive of \"Close the door.\"", o: ["Let the door be closed.", "The door is closed.", "The door should close.", "Let close the door."], a: 0, e: "Commands become 'Let … be + past participle'." },
      { q: "Passive of \"The police caught the thieves.\"", o: ["The thieves were caught by the police.", "The thieves was caught by the police.", "The thieves have been caught by the police.", "The thieves are caught by the police."], a: 0, e: "Past simple → were + past participle, agreeing with 'thieves'." },
      { q: "Passive of \"Has she finished the report?\"", o: ["Has the report been finished by her?", "Is the report finished by her?", "Had the report been finished by her?", "Has the report finished by her?"], a: 0, e: "Present perfect → has / have been + past participle." },
    ],
    visual: {
      plain: "Turning a sentence passive is swapping who stands in the spotlight. In the active voice the doer is on stage; in the passive, the thing that was acted on steps forward and the doer moves to the back, introduced with 'by'.",
      diagram: `flowchart LR
  A["Ravi (doer) wrote the letter (object)"] --> S["object to the front"] --> B["was written<br/>be + past participle"] --> P["The letter was written by Ravi"]`,
      caption: "Same tense, new subject, 'be' + past participle.",
    },
  },
  {
    slug: "direct-indirect-speech",
    title: "Direct and Indirect Speech",
    description: "Reporting statements, questions and commands: tense backshift, pronouns and time words.",
    minutes: 25,
    theory: `Direct speech quotes the exact words: She said, "I am tired." Indirect (reported) speech retells them: She said that she was tired. Conversion questions check three changes: **tense**, **pronouns** and **time and place words**.

## Start here: when the tense changes

If the reporting verb is in the **present or future** (says, will say), the tense doesn't change: He says, "I am busy" → He says that he is busy.

If the reporting verb is in the **past** (said, told), shift each tense one step back:

| Direct | Indirect |
|---|---|
| am / is → | was |
| are → | were |
| do / does → | did |
| did / past simple → | had + past participle |
| has / have done → | had done |
| will → | would |
| can → | could |
| may → | might |
| shall → | should |
| must → | had to (or must) |

**Exception:** universal truths and habits keep their tense: The teacher said, "The earth goes round the sun" → The teacher said that the earth goes round the sun.

## Pronouns follow the people

Change first and second person to fit who is reporting: She said to me, "I like your car" → She told me that she liked my car.

## Time and place words

| Direct | Indirect |
|---|---|
| now | then |
| today / tonight | that day / that night |
| yesterday | the previous day / the day before |
| tomorrow | the next day / the following day |
| ago | before |
| this / these | that / those |
| here | there |
| last week | the previous week |

## Questions

Use **asked**, drop the question mark, and put the words in **statement order**:

~~~
He said to me, "Are you coming?"        →  He asked me if (whether) I was coming.
She said, "Where do you live?"          →  She asked where I lived.
~~~

Yes/no questions take if or whether; wh-questions keep the wh-word.

## Commands and requests

Use **told / ordered / requested / advised** + **to** (or **not to**):

~~~
The teacher said, "Sit down."            →  The teacher told us to sit down.
He said, "Please lend me your pen."      →  He requested me to lend him my pen.
She said, "Don't be late."               →  She told me not to be late.
~~~

## Exclamations and wishes

He said, "What a lovely day!" → He exclaimed that it was a lovely day. They said, "Good luck!" → They wished me good luck.

## Traps in this topic

- keeping question order: "He asked where did I live" is wrong
- forgetting to change time words (tomorrow → the next day)
- backshifting universal truths

## Practice

1. He said, "I will call you tomorrow."
2. She said to me, "Did you finish the work?"
3. Mother said, "Don't play in the rain."
4. He said, "Water boils at 100 °C."

**Answers:** 1) He said that he **would** call me **the next day**. 2) She asked me **if I had finished** the work. 3) Mother told me **not to play** in the rain. 4) He said that water **boils** at 100 °C (a universal truth).`,
    sources: [BC_GRAMMAR, WIKI_INDIRECT],
    remember: [
      "Past reporting verb → shift each tense back one step (is → was, will → would, did → had done)",
      "Present reporting verb or universal truth → no tense change",
      "Change pronouns to fit the speaker and listener; now → then, tomorrow → the next day",
      "Questions: asked + if / whether or the wh-word, then statement word order",
      "Commands: told / requested + to or not to",
    ],
    quick: {
      question: "Indirect form of: He said, \"I will call you tomorrow.\"",
      options: ["He said that he would call me the next day.", "He said that he will call me tomorrow.", "He said that I would call him the next day.", "He told that he would call me tomorrow."],
      answer: 0,
      explanation: "will → would, I → he, you → me, tomorrow → the next day.",
    },
    questions: [
      { q: "Indirect form of: She said to me, \"Where do you live?\"", o: ["She asked me where I lived.", "She asked me where did I live.", "She asked me where do I live.", "She said me where I lived."], a: 0, e: "Use statement order after the wh-word, and backshift the tense." },
      { q: "Indirect form of: Mother said, \"Don't play in the rain.\"", o: ["Mother told me not to play in the rain.", "Mother told me don't play in the rain.", "Mother said me to not play in the rain.", "Mother asked if I played in the rain."], a: 0, e: "Negative commands: told + not to + verb." },
      { q: "Indirect form of: He said, \"Water boils at 100 °C.\"", o: ["He said that water boils at 100 °C.", "He said that water boiled at 100 °C.", "He said that water had boiled at 100 °C.", "He said that water would boil at 100 °C."], a: 0, e: "Universal truths keep their tense." },
      { q: "In indirect speech, 'yesterday' usually becomes…", o: ["the previous day", "the next day", "today", "that day"], a: 0, e: "yesterday → the previous day / the day before." },
    ],
    visual: {
      plain: "Reporting speech is retelling a phone call later. Everything moves one step into the past, 'I' and 'you' change to fit who's telling the story, and 'tomorrow' becomes 'the next day' because it's no longer tomorrow.",
      diagram: `flowchart LR
  D["He said, I will call you tomorrow"] --> T["tense back one step<br/>will → would"] --> P["pronouns<br/>I → he, you → me"] --> W["time words<br/>tomorrow → the next day"] --> R["He said that he would call me the next day"]`,
      caption: "Tense, pronouns, time words: the three changes.",
    },
  },
  {
    slug: "idioms-and-phrases",
    title: "Idioms and Phrases",
    description: "The idioms and phrasal verbs placement tests use most, grouped by meaning, with a method for unknown ones.",
    minutes: 25,
    theory: `An idiom is a phrase whose meaning isn't the sum of its words: "break the ice" has nothing to do with ice. Tests ask for the meaning of an idiom, or which idiom fits a sentence. A list of common ones, learned in groups, covers most questions.

## Start here: a method for unknown idioms

1. Read the **whole sentence**: the context usually tells you whether the meaning is positive or negative
2. Eliminate **literal** options (an option about actual ice for "break the ice")
3. Pick the option that fits the sentence when substituted

## Common idioms by theme

**Starting, ending, effort**

| Idiom | Meaning |
|---|---|
| break the ice | start a conversation in an awkward situation |
| call it a day | stop working for now |
| burn the midnight oil | work late into the night |
| cut corners | do something badly or cheaply to save time |
| bite the bullet | face something unpleasant bravely |
| back to square one | back to the beginning after a failure |
| bite off more than you can chew | take on more than you can handle |

**Secrets and speech**

| Idiom | Meaning |
|---|---|
| let the cat out of the bag | reveal a secret by mistake |
| spill the beans | reveal secret information |
| beat around the bush | avoid saying something directly |
| hit the nail on the head | describe exactly what's right |
| keep it under wraps | keep it secret |

**Situations**

| Idiom | Meaning |
|---|---|
| a blessing in disguise | something good that first seemed bad |
| once in a blue moon | hardly ever |
| in hot water | in trouble |
| under the weather | slightly ill |
| the ball is in your court | it's your decision now |
| a piece of cake | no trouble at all |
| costs an arm and a leg | costs a lot |
| at the drop of a hat | immediately, without hesitation |

**Relationships and attitudes**

| Idiom | Meaning |
|---|---|
| see eye to eye | agree |
| turn a blind eye | deliberately ignore |
| keep at arm's length | avoid becoming close |
| add fuel to the fire | make a bad situation worse |
| cry over spilt milk | regret what can't be changed |

**Formal-sounding phrases tests love**

| Phrase | Meaning |
|---|---|
| red tape | excessive official rules and paperwork |
| white elephant | a costly possession that's useless |
| Achilles' heel | a weak point |
| by leaps and bounds | rapidly |
| a far cry from | nothing like |
| bone of contention | the subject of a dispute |
| in the nick of time | at the last possible moment |

## Phrasal verbs

A phrasal verb is a verb plus a small word whose meaning changes completely:

| Phrasal verb | Meaning |
|---|---|
| put off | postpone |
| call off | cancel |
| look into | investigate |
| turn down | reject |
| bring up | raise (a child or a topic) |
| carry out | perform, complete |
| make up for | compensate for |
| run out of | have none left |
| come across | find by chance |
| give in | surrender, yield |
| look down on | think you're better than |
| put up with | tolerate |

## Learning plan

Five idioms a day, each used in a sentence of your own, beats reading a list of 500 once. Revise with your review queue.

## Traps in this topic

- choosing the literal meaning
- confusing look into (investigate), look after (take care of) and look up to (respect)
- mixing up put off (postpone) and put out (extinguish)

## Practice

1. "The meeting was **called off** because of the rain."
2. "Learning to code is no longer **a piece of cake** for her; it's her job."
3. "The new flyover turned out to be a **white elephant**."

**Answers:** 1) **cancelled**. 2) **no trouble at all**. 3) **an expensive thing that's of no use**.`,
    sources: [WIKI_IDIOM, WIKI_PHRASAL],
    remember: [
      "Use the sentence's context and eliminate literal meanings",
      "Learn idioms in themed groups, a few a day, each in your own sentence",
      "put off = postpone, call off = cancel, turn down = reject, look into = investigate",
      "red tape = bureaucracy, white elephant = useless costly thing, Achilles' heel = weak point",
    ],
    quick: {
      question: "What does 'let the cat out of the bag' mean?",
      options: ["Reveal a secret by mistake", "Free a trapped animal", "Start an argument", "Leave in a hurry"],
      answer: 0,
      explanation: "It means accidentally revealing something meant to be secret.",
    },
    questions: [
      { q: "\"The match was called off due to rain.\" 'Called off' means…", o: ["cancelled", "postponed", "started", "watched"], a: 0, e: "call off = cancel; put off = postpone." },
      { q: "What is a 'white elephant'?", o: ["A costly possession that's of no use", "A rare animal", "A peaceful person", "A large gift that's useful"], a: 0, e: "Something expensive to keep that brings no benefit." },
      { q: "\"Once in a blue moon\" means…", o: ["hardly ever", "every month", "at night", "never"], a: 0, e: "It describes something that happens seldom." },
      { q: "Which phrasal verb means 'tolerate'?", o: ["put up with", "put off", "put out", "put down"], a: 0, e: "put up with = tolerate." },
    ],
    visual: {
      plain: "An idiom is a nickname for an idea. Nobody called 'Tiger' is actually a tiger; 'break the ice' is only the nickname for getting a conversation started.",
      diagram: `flowchart LR
  S["Read the whole sentence"] --> T["Positive or negative tone?"] --> E["Cross out literal options"] --> P["Substitute and check"]`,
      caption: "A method for idioms you haven't seen before.",
    },
  },
  {
    slug: "cloze-test",
    title: "Cloze Tests",
    description: "Passages with blanks: reading for tone and tense, grammar fit, collocations and connectors.",
    minutes: 25,
    theory: `A cloze test is a passage with words missing; you choose the best word for each blank. It combines everything in verbal ability: vocabulary, grammar and reading. A fixed order of checks makes it fast and accurate.

## Start here: read before you fill

Read the **whole passage once** without looking at the options. You need its topic, its tone (positive, critical, neutral) and its main tense. Many blanks can only be decided from a sentence that comes after them.

## Four checks for every blank

1. **Grammar fit:** does the word fit the sentence's structure? A blank after "the" needs a noun or adjective; after "has" a past participle; between two clauses often a connector
2. **Tense and agreement:** does it match the subject and the passage's time?
3. **Meaning and tone:** does it fit what the passage is saying, positive or negative?
4. **Collocation:** do the words naturally go together? We "make a decision", "do homework", "pay attention", "take a risk"

## Connectors decide direction

| Type | Words | Use when |
|---|---|---|
| contrast | however, although, but, yet, despite, whereas | the next idea goes against the previous one |
| addition | moreover, furthermore, also, in addition | adding a similar point |
| cause / result | because, since, therefore, thus, hence, so | one idea explains or follows from another |
| example | for instance, such as | an example follows |

"Despite" and "in spite of" take a noun (despite the rain); "although" takes a clause (although it rained).

## Worked example

Read first, then fill:

> Remote work has grown rapidly in recent years. (1) ___ it offers flexibility, many employees report feeling isolated. Companies are (2) ___ experimenting with hybrid models. These models (3) ___ teams to meet in person a few days a week, which (4) ___ to improve collaboration. (5) ___, the long-term effects are still unclear.

Options:
1. (a) Because (b) Although (c) Therefore (d) Unless
2. (a) therefore (b) never (c) yet (d) hardly
3. (a) allow (b) allows (c) allowing (d) allowed to
4. (a) seems (b) seem (c) seeming (d) is seeming
5. (a) Moreover (b) Because (c) However (d) Thus

**Answers and reasons:**
1. **Although**: flexibility (good) contrasts with isolation (bad)
2. **therefore**: companies react to the isolation problem; the others don't fit the meaning
3. **allow**: the subject "these models" is plural, and "allow someone to do" is the right pattern
4. **seems**: "which" refers to meeting in person (a single idea), singular verb
5. **However**: after a positive point, the passage turns to uncertainty

## Speed tips

- fill the obvious blanks first; they make the hard ones clearer
- when two options both look fine, test collocation and grammar again; usually only one is fully correct
- reread the completed passage once before submitting

## Traps in this topic

- choosing a word that fits its own sentence but contradicts the next one
- ignoring singular / plural agreement
- "despite" followed by a full clause

## Practice

1. The project failed, ___ the team worked hard. (because / although / therefore)
2. She paid close ___ to the instructions. (attention / interest / care)
3. Prices rose sharply; ___, sales fell. (moreover / consequently / although)

**Answers:** 1) **although**. 2) **attention** (the collocation is "pay attention"). 3) **consequently** (result).`,
    sources: [WIKI_CLOZE, BC_GRAMMAR],
    remember: [
      "Read the whole passage first for topic, tone and tense",
      "Check grammar fit, tense and agreement, meaning, then collocation",
      "Connectors set direction: however = contrast, therefore = result, moreover = addition",
      "despite + noun, although + clause",
      "Fill the obvious blanks first and reread at the end",
    ],
    quick: {
      question: "\"___ it offers flexibility, many employees feel isolated.\" Which fits?",
      options: ["Although", "Because", "Therefore", "Moreover"],
      answer: 0,
      explanation: "The two ideas contrast (a benefit and a drawback), so a contrast connector fits.",
    },
    questions: [
      { q: "\"Prices rose sharply; ___, sales fell.\"", o: ["consequently", "moreover", "although", "despite"], a: 0, e: "The fall in sales is a result of the price rise." },
      { q: "\"She paid close ___ to the instructions.\"", o: ["attention", "interest", "care", "notice"], a: 0, e: "The natural collocation is 'pay attention'." },
      { q: "Which is correct?", o: ["Despite the rain, we went out.", "Despite it rained, we went out.", "Although the rain, we went out.", "Despite of the rain, we went out."], a: 0, e: "despite takes a noun; although takes a clause; 'despite of' is wrong." },
      { q: "\"These models ___ teams to meet in person.\"", o: ["allow", "allows", "allowing", "allowed to"], a: 0, e: "'These models' is plural, and the pattern is 'allow someone to do'." },
    ],
    visual: {
      plain: "A cloze passage is a jigsaw with missing pieces. Look at the whole picture on the box first, then check each piece's shape (grammar) and colour (meaning) before pressing it in.",
      diagram: `flowchart LR
  R["Read the whole passage"] --> G["Grammar fit"] --> T["Tense and agreement"] --> M["Meaning and tone"] --> C["Collocation"] --> F["Reread the filled passage"]`,
      caption: "Four checks per blank, after one full read.",
    },
  },
];
