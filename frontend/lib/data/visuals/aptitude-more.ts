import type { VisualMap } from "./types";

export const aptitudeMoreVisuals: VisualMap = {
  // ── Quantitative aptitude ──
  "quantitative-aptitude/number-system": {
    plain:
      "Our decimal system has place values that grow by 10 each step to the left. Other bases work the same way with a different multiplier: binary uses powers of 2, so 1011 in binary is 8 + 0 + 2 + 1 = 11.",
    diagram: `flowchart LR
  A["1 × 8"] --> S["8 + 0 + 2 + 1 = 11"]
  B["0 × 4"] --> S
  C["1 × 2"] --> S
  D["1 × 1"] --> S`,
    caption: "Binary 1011 = decimal 11.",
  },
  "quantitative-aptitude/divisibility-rules": {
    plain:
      "Divisibility rules let you check without dividing. By 3 or 9: add the digits. By 4: look at the last two digits. By 8: the last three. By 11: alternate-sum the digits and check if it's 0 or a multiple of 11.",
    diagram: `flowchart TB
  N["n = 7392"] --> T["digit sum 21 → divisible by 3 ✓, not 9"]
  N --> F["last two 92 → divisible by 4 ✓"]
  N --> E["last three 392 → divisible by 8 ✓"]`,
    caption: "Quick checks on 7392.",
  },
  "quantitative-aptitude/factors-multiples": {
    plain:
      "Break a number into primes and everything follows. 72 = 2³ × 3², so its number of factors is (3 + 1)(2 + 1) = 12: add one to each power and multiply.",
    diagram: `flowchart TB
  A["72"] --> B["2 × 36"]
  B --> C["2 × 18"]
  C --> D["2 × 9"]
  D --> E["3 × 3"]
  E --> F["72 = 2³ × 3²<br/>factors = (3+1)(2+1) = 12"]`,
    caption: "Prime factorisation tree of 72.",
  },
  "quantitative-aptitude/ratio-proportion": {
    plain:
      "A ratio is a recipe: 2 : 3 means for every 2 cups of one thing, 3 of the other. To split ₹500 in 2 : 3, there are 5 equal parts of ₹100: one share gets 2 parts (₹200), the other 3 parts (₹300).",
    diagram: `flowchart LR
  T["₹500 ÷ (2 + 3) parts = ₹100 per part"] --> A["A: 2 parts = ₹200"]
  T --> B["B: 3 parts = ₹300"]`,
    caption: "Divide by the total parts, then multiply.",
  },
  "quantitative-aptitude/averages": {
    plain:
      "An average is the value everyone would have if the total were shared out equally. If a new student raises a class of 10's average from 70 to 72, the newcomer scored the old average plus 2 for each of the 11 students now in the class: 70 + 22 = 92.",
    diagram: `flowchart LR
  A["sum = average × count"] --> B["new value = new sum − old sum"]`,
    caption: "Most average questions come back to sum = average × count.",
  },
  "quantitative-aptitude/simple-interest": {
    plain:
      "Simple interest grows by the same amount every year, like a fixed bonus: SI = P × R × T / 100. ₹10,000 at 10% for 3 years earns ₹1,000 each year, ₹3,000 in total.",
    diagram: `flowchart LR
  Y0["₹10,000"] -->|"+1,000"| Y1["₹11,000"] -->|"+1,000"| Y2["₹12,000"] -->|"+1,000"| Y3["₹13,000"]`,
    caption: "The same interest every year.",
  },
  "quantitative-aptitude/compound-interest": {
    plain:
      "Compound interest earns interest on interest, like a snowball rolling downhill. A = P(1 + R/100)^T. ₹10,000 at 10% grows to 11,000, then 12,100, then 13,310 after 3 years: ₹310 more than simple interest.",
    diagram: `flowchart LR
  Y0["₹10,000"] -->|"+1,000"| Y1["₹11,000"] -->|"+1,100"| Y2["₹12,100"] -->|"+1,210"| Y3["₹13,310"]`,
    caption: "Each year's interest is bigger than the last.",
  },
  "quantitative-aptitude/pipes-and-cisterns": {
    plain:
      "Pipes and cisterns is time and work with a twist: filling pipes add work, draining pipes subtract it. Use the tank capacity as LCM units, add the rates of filling pipes and subtract the leaks.",
    diagram: `flowchart LR
  A["Pipe A fills in 10 h → +6 units/h"] --> T["net 6 + 4 − 3 = 7 units/h"]
  B["Pipe B fills in 15 h → +4 units/h"] --> T
  C["Leak empties in 20 h → −3 units/h"] --> T
  T --> R["60 units ÷ 7 ≈ 8.6 h"]`,
    caption: "Tank of 60 units (LCM of 10, 15, 20).",
  },
  "quantitative-aptitude/trains": {
    plain:
      "A train has length, so to pass a pole it covers its own length, and to cross a platform it covers its length plus the platform's. Two trains passing each other add their speeds if moving towards each other, subtract if in the same direction.",
    diagram: `flowchart TB
  P["cross a pole: distance = train length"] --> F["time = length ÷ speed"]
  L["cross a platform: train + platform length"] --> F
  O["opposite directions: speeds add"] --> R["relative speed"]
  S["same direction: speeds subtract"] --> R`,
    caption: "What distance to use, and which speed.",
  },
  "quantitative-aptitude/basic-algebra": {
    plain:
      "Algebra uses letters for unknown numbers so you can reason about them. 'A number tripled, plus 5, is 20' becomes 3x + 5 = 20; undo each step in reverse to find x = 5.",
    diagram: `flowchart LR
  A["3x + 5 = 20"] -->|"− 5"| B["3x = 15"] -->|"÷ 3"| C["x = 5"]`,
    caption: "Undo operations in reverse order.",
  },
  "quantitative-aptitude/linear-equations": {
    plain:
      "Two equations with two unknowns are two lines; the answer is where they cross. Solve by elimination: add or subtract the equations so one letter cancels.",
    diagram: `flowchart TB
  E1["x + y = 10"] --> A["add them: 2x = 14"]
  E2["x − y = 4"] --> A
  A --> X["x = 7"] --> Y["y = 3"]`,
    caption: "Elimination cancels one variable.",
  },
  "quantitative-aptitude/quadratic-equations": {
    plain:
      "Solve x² − 5x + 6 = 0 by finding two numbers that multiply to 6 and add to −5: −2 and −3. So (x − 2)(x − 3) = 0 and x is 2 or 3. When factoring is hard, the formula x = (−b ± √(b² − 4ac)) / 2a always works.",
    diagram: `flowchart LR
  Q["x² − 5x + 6 = 0"] --> F["(x − 2)(x − 3) = 0"] --> R["x = 2 or x = 3"]`,
    caption: "Factorising a quadratic.",
  },
  "quantitative-aptitude/algebraic-identities": {
    plain:
      "(a + b)² = a² + 2ab + b² is just the area of a square with side a + b: one a × a square, one b × b square and two a × b rectangles. Identities like this turn big calculations into quick mental maths: 103² = 100² + 2·100·3 + 3² = 10609.",
    diagram: `flowchart TB
  S["(a + b)²"] --> A["a²"]
  S --> B["ab"]
  S --> C["ab"]
  S --> D["b²"]`,
    caption: "The square splits into a², 2ab and b².",
  },
  "quantitative-aptitude/progressions": {
    plain:
      "An arithmetic progression adds the same amount each step (3, 7, 11, 15: +4). A geometric progression multiplies by the same amount (3, 6, 12, 24: ×2). nth term of an AP: a + (n − 1)d.",
    diagram: `flowchart TB
  subgraph AP["AP: +4"]
    a1["3"] --> a2["7"] --> a3["11"] --> a4["15"]
  end
  subgraph GP["GP: ×2"]
    g1["3"] --> g2["6"] --> g3["12"] --> g4["24"]
  end`,
    caption: "Adding versus multiplying each step.",
  },
  "quantitative-aptitude/combinations": {
    plain:
      "Combinations count choices where order doesn't matter, like picking a 3-person team from 5. There are 5 × 4 × 3 = 60 ordered picks, but each team appears 3! = 6 times in different orders, so 60 ÷ 6 = 10 teams: 5C3.",
    diagram: `flowchart LR
  P["ordered picks 5 × 4 × 3 = 60"] -->|"÷ 3! orderings"| C["5C3 = 10 teams"]`,
    caption: "nCr = nPr ÷ r!.",
  },
  "quantitative-aptitude/geometry": {
    plain:
      "Many geometry questions come down to a few facts: angles in a triangle add to 180°, Pythagoras for right triangles (a² + b² = c²), and similar triangles having proportional sides. The 3-4-5 triangle is worth remembering.",
    diagram: `flowchart LR
  A["side a = 3"] --> R["right triangle"]
  B["side b = 4"] --> R
  R --> C["hypotenuse c = √(9 + 16) = 5"]`,
    caption: "Pythagoras with the 3-4-5 triangle.",
  },
  "quantitative-aptitude/mensuration": {
    plain:
      "Mensuration is measuring shapes: area for flat shapes (how much paint), volume for solids (how much water fits). A cylinder is just a circle stacked up: volume = πr² × height.",
    diagram: `flowchart TB
  F["2D: area"] --> R["rectangle l × b"]
  F --> C["circle πr²"]
  F --> T["triangle ½ × base × height"]
  S["3D: volume"] --> CU["cube a³"]
  S --> CY["cylinder πr²h"]
  S --> SP["sphere 4⁄3 πr³"]`,
    caption: "The formulas you'll use most.",
  },
  "quantitative-aptitude/data-interpretation": {
    plain:
      "Data interpretation is reading numbers from tables and charts under time pressure. Read the title, units and scale first, approximate before calculating, and compute only what the question asks.",
    diagram: `flowchart LR
  R["read title, units, scale"] --> Q["read the question"] --> A["approximate"] --> C["calculate exactly only if options are close"]`,
    caption: "A fast, accurate DI routine.",
  },

  // ── Logical reasoning ──
  "logical-reasoning/number-series": {
    plain:
      "To crack a number series, write the differences between neighbours. If they're constant, it's arithmetic; if the differences themselves form a pattern (+2, +4, +6), go one level deeper; if it's ratios, it's geometric.",
    diagram: `flowchart LR
  A["2"] -->|"+2"| B["4"] -->|"+4"| C["8"] -->|"+6"| D["14"] -->|"+8"| E["22"]`,
    caption: "Differences 2, 4, 6, 8: next is 22 + 10 = 32.",
  },
  "logical-reasoning/alphabet-series": {
    plain:
      "Turn letters into their positions (A = 1 … Z = 26) and alphabet series become number series. Remember EJOTY (5, 10, 15, 20, 25) to find positions quickly.",
    diagram: `flowchart LR
  A["C (3)"] -->|"+3"| B["F (6)"] -->|"+3"| C["I (9)"] -->|"+3"| D["L (12)"] -->|"+3"| E["O (15)"]`,
    caption: "C, F, I, L, … : next is O.",
  },
  "logical-reasoning/alphanumeric-series": {
    plain:
      "Alphanumeric series hide two patterns at once, one for the letters and one for the numbers. Split them into separate series and solve each on its own.",
    diagram: `flowchart LR
  A["A2"] --> B["C4"] --> C["E6"] --> D["G8"] --> E["I10"]
  L["letters: +2 positions"] -.-> A
  N["numbers: +2"] -.-> A`,
    caption: "Letters and numbers follow separate rules.",
  },
  "logical-reasoning/analogies": {
    plain:
      "An analogy keeps a relationship the same: Doctor : Hospital :: Teacher : ? The first pair is 'person : where they work', so the answer is School. Name the relationship first, then look for it in the options.",
    diagram: `flowchart LR
  D["Doctor"] -->|"works in"| H["Hospital"]
  T["Teacher"] -->|"works in"| S["School"]`,
    caption: "Find the relationship, then apply it.",
  },
  "logical-reasoning/odd-one-out": {
    plain:
      "Odd one out: find what most items share, and the one that doesn't share it is the answer. 2, 3, 5, 9, 11: all prime except 9.",
    diagram: `flowchart LR
  A["2 prime"] --- B["3 prime"] --- C["5 prime"] --- D["9 ✗ not prime"] --- E["11 prime"]`,
    caption: "The item that breaks the shared property.",
  },
  "logical-reasoning/coding-decoding": {
    plain:
      "In coding-decoding, compare a word with its code letter by letter to find the rule, often a fixed shift. If CAT is written DBU, every letter moves +1, so DOG becomes EPH.",
    diagram: `flowchart LR
  C["C → D"] --- A["A → B"] --- T["T → U"]
  R["rule: +1"] --> X["DOG → EPH"]`,
    caption: "Decode the shift, then apply it.",
  },
  "logical-reasoning/ranking-and-ordering": {
    plain:
      "If someone is 7th from the top and 12th from the bottom, there are 7 + 12 − 1 = 18 people: the person is counted in both directions, so subtract one.",
    diagram: `flowchart LR
  T["7th from top"] --> F["total = 7 + 12 − 1 = 18"]
  B["12th from bottom"] --> F`,
    caption: "Don't count the person twice.",
  },
  "logical-reasoning/statements-conclusions": {
    plain:
      "A conclusion follows only if it must be true from the statements, not if it's merely likely or true in real life. Use only what's written; outside knowledge is a trap.",
    diagram: `flowchart TB
  S["Statement: All exams need a hall ticket."] --> C1["Ravi has no hall ticket → Ravi can't take the exam ✓ follows"]
  S --> C2["Hall tickets are free ✗ doesn't follow"]`,
    caption: "Must be true from the statement, nothing more.",
  },
  "logical-reasoning/data-sufficiency": {
    plain:
      "Data sufficiency asks whether you could answer, not what the answer is. Test statement 1 alone, then 2 alone, then both together, and pick the option that matches.",
    diagram: `flowchart TB
  Q["question"] --> A{"1 alone enough?"}
  A --> B{"2 alone enough?"}
  B --> C{"both together enough?"}
  C --> R["choose: 1 only / 2 only / either / both / neither"]`,
    caption: "Check each statement alone before combining.",
  },

  // ── Verbal ability ──
  "verbal-ability/synonyms": {
    plain:
      "A synonym has nearly the same meaning in the same context. Put each option into a sentence with the word; the one that keeps the meaning unchanged is the answer.",
    diagram: `flowchart LR
  W["abundant"] --> P["plentiful ✓"]
  W --> S["scarce ✗ (antonym)"]
  W --> R["rapid ✗ (unrelated)"]`,
    caption: "Same meaning, same context.",
  },
  "verbal-ability/antonyms": {
    plain:
      "An antonym is the opposite meaning. Watch for traps: options that are related but not opposite, or opposites of a different meaning of the word.",
    diagram: `flowchart LR
  W["transparent"] --> O["opaque ✓"]
  W --> C["clear ✗ (synonym)"]`,
    caption: "Opposite meaning, same part of speech.",
  },
  "verbal-ability/one-word-substitution": {
    plain:
      "One-word substitution replaces a phrase with a single precise word, like 'a person who loves books' → bibliophile. Learning common roots (bio = life, phil = love, graph = write) helps you guess unfamiliar ones.",
    diagram: `flowchart LR
  P["one who loves books"] --> B["biblio (book) + phile (lover)"] --> W["bibliophile"]`,
    caption: "Roots and suffixes unlock many words.",
  },
  "verbal-ability/vocabulary-in-context": {
    plain:
      "When you don't know a word, the sentence around it usually gives clues: contrast words (but, although) signal an opposite, and examples or explanations signal a similar meaning.",
    diagram: `flowchart LR
  S["'Unlike his gregarious brother, Ravi was shy.'"] --> C["'unlike' signals contrast with shy"] --> M["gregarious = sociable"]`,
    caption: "Use contrast and example clues.",
  },
  "verbal-ability/subject-verb-agreement": {
    plain:
      "The verb must agree with its real subject, which may be hidden behind a phrase. In 'The list of items is on the desk', the subject is 'list' (singular), not 'items', so the verb is 'is'.",
    diagram: `flowchart LR
  S["The list"] -.- O["of items"] -.- V["is ✓ / are ✗"]
  S --> V`,
    caption: "Find the true subject, ignore the phrase in between.",
  },
  "verbal-ability/tenses": {
    plain:
      "Tenses place actions on a timeline. Past perfect (had done) is for the earlier of two past actions; present perfect (has done) links the past to now; future perfect (will have done) is completed before a future point.",
    diagram: `flowchart LR
  PP["had left<br/>past perfect"] --> P["left<br/>past"] --> PR["has left / leaves<br/>present"] --> F["will leave<br/>future"] --> FP["will have left<br/>future perfect"]`,
    caption: "Tenses along the timeline.",
  },
  "verbal-ability/sentence-correction": {
    plain:
      "For sentence correction, check the usual suspects in order: subject-verb agreement, tense consistency, pronoun reference, parallel structure, and modifier placement. Most errors fall into one of these.",
    diagram: `flowchart LR
  A["agreement"] --> B["tense"] --> C["pronouns"] --> D["parallelism"] --> E["modifiers"]`,
    caption: "A checklist for spotting errors.",
  },
  "verbal-ability/reading-comprehension": {
    plain:
      "In reading comprehension, read the questions first so you know what to look for, skim the passage for its main idea and structure, then go back to the exact lines for each detail question.",
    diagram: `flowchart LR
  Q["skim the questions"] --> P["read for the main idea"] --> L["locate lines for each question"] --> A["answer from the text only"]`,
    caption: "A reliable RC routine.",
  },
  "verbal-ability/fill-in-the-blanks": {
    plain:
      "For fill in the blanks, predict the kind of word before looking at options: is it positive or negative, a noun or verb? Then check grammar fit and any fixed phrases (prepositions that go with certain words).",
    diagram: `flowchart LR
  B["sentence with a blank"] --> T["predict tone and part of speech"] --> E["eliminate options that don't fit"] --> C["check fixed phrases"]`,
    caption: "Predict, eliminate, confirm.",
  },

  // ── Data interpretation ──
  "data-interpretation/reading-tables": {
    plain:
      "Tables pack many numbers into rows and columns. Read the headings and units first, find the exact row and column the question needs, and note whether values are totals, percentages or in thousands.",
    diagram: `flowchart LR
  H["headings + units"] --> R["find the row"] --> C["find the column"] --> V["read the cell"]`,
    caption: "Locate before you calculate.",
  },
  "data-interpretation/data-comparison": {
    plain:
      "Comparing data usually means growth or share. Percentage change = (new − old) ÷ old × 100. Compare percentages, not raw differences, when the bases are different.",
    diagram: `flowchart LR
  O["old = 80"] --> P["(100 − 80) ÷ 80 × 100 = 25%"]
  N["new = 100"] --> P`,
    caption: "Percentage change uses the old value as the base.",
  },
  "data-interpretation/mixed-graphs": {
    plain:
      "Mixed graphs combine two charts, like a bar for totals and a pie for how one total splits. Combine them carefully: take the total from one, the share from the other, then multiply.",
    diagram: `flowchart LR
  B["bar: total sales 2024 = ₹500 cr"] --> R["product A = 500 × 30% = ₹150 cr"]
  P["pie: product A share = 30%"] --> R`,
    caption: "Total from one chart, share from the other.",
  },
  "data-interpretation/caselet-di": {
    plain:
      "A caselet gives data in a paragraph instead of a chart. Turn it into a small table first; with the numbers organised, the questions become simple lookups.",
    diagram: `flowchart LR
  T["paragraph of facts"] --> G["build a table: rows × columns"] --> Q["answer from the table"]`,
    caption: "Convert the text into a grid.",
  },
  "data-interpretation/di-data-sufficiency": {
    plain:
      "DI data sufficiency asks if the given data is enough to answer, not for the answer itself. Stop calculating as soon as you know a unique answer is possible.",
    diagram: `flowchart LR
  Q["question"] --> S{"can a unique answer be found?"}
  S -->|"yes"| E["sufficient: stop"]
  S -->|"no"| N["not sufficient"]`,
    caption: "Decide sufficiency, skip the final arithmetic.",
  },

  // ── Placement aptitude ──
  "placement-aptitude/tcs-ninja-patterns": {
    plain:
      "Company tests have predictable sections and timing. Knowing the structure in advance lets you plan time per section and focus practice on the question types that actually appear.",
    diagram: `flowchart LR
  A["Numerical ability"] --> B["Verbal ability"] --> C["Reasoning"] --> D["Programming logic / coding"]`,
    caption: "A typical sequence of sections; check the current year's pattern.",
  },
  "placement-aptitude/infosys-logical": {
    plain:
      "Infosys-style logical sections lean on puzzles, arrangements and data sufficiency. Draw a diagram for every arrangement question and fix certain clues first before trying cases.",
    diagram: `flowchart LR
  R["read all clues"] --> F["place the definite ones"] --> C["branch on 'either/or' clues"] --> E["eliminate contradictions"]`,
    caption: "A method for arrangement puzzles.",
  },
  "placement-aptitude/elimination-techniques": {
    plain:
      "In multiple choice you don't always need to solve fully: check units, parity (odd/even), last digits or rough size to knock out impossible options, then verify only the survivors.",
    diagram: `flowchart LR
  O["4 options"] -->|"wrong units"| A["3"] -->|"wrong last digit"| B["2"] -->|"rough estimate"| C["1 ✓"]`,
    caption: "Narrow the options before calculating.",
  },
  "placement-aptitude/skimming-questions": {
    plain:
      "Skim the whole section first and sort questions into easy, medium and skip. Do all the easy ones, then the medium, and come back to the hard ones only if time remains: every question is worth the same marks.",
    diagram: `flowchart LR
  S["skim all questions"] --> E["1st pass: easy"] --> M["2nd pass: medium"] --> H["3rd pass: hard, if time"]`,
    caption: "Answer in passes, easiest first.",
  },
};
