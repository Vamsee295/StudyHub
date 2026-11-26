import type { VisualMap } from "./types";

export const aptitudeVisuals: VisualMap = {
  // ── Quantitative ──
  "quantitative-aptitude/types-of-numbers": {
    plain:
      "Numbers live in nested families, like Russian dolls. Every natural number is a whole number, every whole number is an integer, every integer is rational, and rationals plus irrationals (like √2 and π) make up the real numbers.",
    diagram: `flowchart LR
  N["Natural<br/>1, 2, 3…"] --> W["Whole<br/>0, 1, 2…"] --> I["Integers<br/>…−1, 0, 1…"] --> Q["Rational<br/>p/q"] --> R["Real"]
  IR["Irrational<br/>√2, π"] --> R`,
    caption: "Each family contains the one before it.",
  },
  "quantitative-aptitude/lcm-hcf": {
    plain:
      "HCF is the biggest tile that fits both lengths exactly; LCM is the first length both rulers reach together. Break each number into primes: HCF takes the common primes with the smallest powers, LCM takes every prime with the largest power.",
    diagram: `flowchart TB
  A["12 = 2² × 3"] --> H["HCF: smallest powers<br/>2¹ × 3¹ = 6"]
  B["18 = 2 × 3²"] --> H
  A --> L["LCM = 2² × 3² = 36"]
  B --> L`,
    caption: "For 12 and 18: HCF 6, LCM 36, and HCF × LCM = 12 × 18.",
  },
  "quantitative-aptitude/percentages": {
    plain:
      "A percentage is 'out of 100'. A quick trick for successive changes: +20% then −20% isn't zero, it's −4%, because the second change works on the new, bigger amount. Use x + y + xy/100 for two successive changes.",
    diagram: `flowchart LR
  A["₹100"] -->|"+20%"| B["₹120"] -->|"−20% of 120"| C["₹96"]`,
    caption: "Net change: 20 − 20 + (20 × −20)/100 = −4%.",
  },
  "quantitative-aptitude/profit-and-loss": {
    plain:
      "Profit and loss are always measured against the cost price, the amount the seller paid. Marked price is the label, discount comes off the marked price, and what's left is the selling price.",
    diagram: `flowchart LR
  CP["Cost price ₹400"] --> MP["Marked price ₹600"] -->|"discount 10%"| SP["Selling price ₹540"]
  SP --> P["Profit = 540 − 400 = ₹140<br/>= 35% of CP"]`,
    caption: "Profit % is on cost price; discount % is on marked price.",
  },
  "quantitative-aptitude/time-and-work": {
    plain:
      "Turn days into work per day. If A finishes in 10 days, A does 1/10 of the job daily; B in 15 days does 1/15. Together they do 1/10 + 1/15 = 1/6 a day, so 6 days. Easier still: take the job as LCM(10, 15) = 30 units.",
    diagram: `flowchart LR
  A["A: 10 days → 3 units/day"] --> T["together 5 units/day"]
  B["B: 15 days → 2 units/day"] --> T
  T --> R["30 units ÷ 5 = 6 days"]`,
    caption: "The LCM-units method.",
  },
  "quantitative-aptitude/time-speed-distance": {
    plain:
      "Distance = speed × time, the one formula behind trains, boats and races. Average speed for equal distances at two speeds isn't the simple average: it's 2ab/(a + b), because you spend longer at the slower speed.",
    diagram: `flowchart LR
  D["Distance"] --- S["Speed"] --- T["Time"]
  F["D = S × T<br/>S = D ÷ T<br/>T = D ÷ S"]`,
    caption: "Going 60 km/h and returning 40 km/h averages 48 km/h, not 50.",
  },
  "quantitative-aptitude/boats-and-streams": {
    plain:
      "Downstream the current helps you, upstream it fights you. Boat speed in still water is the average of the two speeds; the stream speed is half their difference.",
    diagram: `flowchart LR
  D["Downstream = b + s"] --> B["boat b = (down + up) / 2"]
  U["Upstream = b − s"] --> S["stream s = (down − up) / 2"]`,
    caption: "Two speeds in, boat and stream speeds out.",
  },
  "quantitative-aptitude/permutations": {
    plain:
      "Permutations count arrangements where order matters, like seating people in a row: 5 people fill the first seat 5 ways, the next 4 ways, and so on: 5! = 120. Combinations ignore order, like choosing a team.",
    diagram: `flowchart LR
  S1["seat 1<br/>5 choices"] --> S2["seat 2<br/>4"] --> S3["seat 3<br/>3"] --> S4["seat 4<br/>2"] --> S5["seat 5<br/>1"] --> R["5 × 4 × 3 × 2 × 1 = 120"]`,
    caption: "The multiplication principle behind n!.",
  },
  "quantitative-aptitude/probability": {
    plain:
      "Probability is favourable outcomes divided by all equally likely outcomes. Rolling two dice gives 36 outcomes; 6 of them sum to 7, so P(sum = 7) = 6/36 = 1/6. A tree diagram helps when events happen one after another.",
    diagram: `flowchart LR
  S["Toss 2 coins"] --> H["H"]
  S --> T["T"]
  H --> HH["HH · ¼"]
  H --> HT["HT · ¼"]
  T --> TH["TH · ¼"]
  T --> TT["TT · ¼"]`,
    caption: "P(at least one head) = 3/4.",
  },

  // ── Logical reasoning ──
  "logical-reasoning/blood-relations": {
    plain:
      "Blood relation questions become easy once you draw the family tree. Put generations on levels, mark males and females, and read the relationship off the picture instead of juggling it in your head.",
    diagram: `flowchart TB
  G["Grandfather"] --> F["Father"]
  G --> U["Uncle"]
  F --> Me["Me"]
  F --> S["Sister"]
  U --> C["Cousin"]`,
    caption: "Uncle's child is my cousin: same generation, different parents.",
  },
  "logical-reasoning/direction-sense": {
    plain:
      "Draw every move on paper, starting with North up. Right and left depend on which way the person is facing, so update the facing direction after every turn. The final distance is usually Pythagoras on the net north–south and east–west moves.",
    diagram: `flowchart LR
  S["Start"] -->|"5 km North"| A["A"]
  A -->|"turn right, 12 km East"| B["End"]
  S -.->|"straight-line distance √(5² + 12²) = 13 km"| B`,
    caption: "Track position and facing direction after each move.",
  },
  "logical-reasoning/syllogisms": {
    plain:
      "Syllogisms are solved with circles. 'All cats are animals' puts the cat circle inside the animal circle. A conclusion is true only if it holds in every possible way of drawing the circles, not just one.",
    diagram: `flowchart TB
  subgraph Animals
    subgraph Cats
      c["every cat"]
    end
    o["other animals"]
  end`,
    caption: "All cats are animals ✓; all animals are cats ✗.",
  },
  "logical-reasoning/seating-arrangement": {
    plain:
      "Seating puzzles are solved by placing the surest clues first. Fix one person, write the definite facts around them, and keep possible cases side by side until a later clue rules one out.",
    diagram: `flowchart LR
  A["A"] --- B["B"] --- C["C"] --- D["D"] --- E["E"]`,
    caption: "Draw the row (or circle) and fill in fixed clues before the 'either/or' ones.",
  },
  "logical-reasoning/clocks-calendars": {
    plain:
      "The minute hand moves 6° per minute and the hour hand 0.5° per minute, so the gap between them changes by 5.5° per minute. Angle at h:m = |30h − 5.5m|.",
    diagram: `flowchart LR
  T["3:20"] --> H["hour hand: 30 × 3 + 0.5 × 20 = 100°"]
  T --> M["minute hand: 6 × 20 = 120°"]
  H --> A["angle = 20°"]
  M --> A`,
    caption: "Angle between the hands at 3:20.",
  },

  // ── Verbal ──
  "verbal-ability/parts-of-speech": {
    plain:
      "Every word in a sentence has a job. Nouns name things, verbs show action, adjectives describe nouns, adverbs describe verbs, and prepositions show position. Spot the jobs and most grammar questions answer themselves.",
    diagram: `flowchart LR
  T["The"] --> Q["quick<br/>adjective"] --> F["fox<br/>noun"] --> J["jumps<br/>verb"] --> O["over<br/>preposition"] --> D["the lazy dog"]`,
    caption: "Each word labelled with its job.",
  },
  "verbal-ability/para-jumbles": {
    plain:
      "Para jumbles are a story with shuffled sentences. Find the opener (it introduces the topic and doesn't depend on anything before it), then link pairs using pronouns, connectors like 'however' and time order.",
    diagram: `flowchart LR
  O["Opener<br/>introduces topic"] --> P["pronoun links<br/>'it', 'they'"] --> C["connectors<br/>'however', 'therefore'"] --> E["conclusion"]`,
    caption: "Opener first, then follow the links.",
  },

  // ── Data interpretation ──
  "data-interpretation/bar-graphs": {
    plain:
      "Before calculating anything, read the axes, the units and the scale. Most mistakes in DI come from misreading 'in thousands' or comparing the wrong bars, not from the arithmetic.",
    diagram: `xychart-beta
  title "Sales (₹ lakh)"
  x-axis [2021, 2022, 2023, 2024]
  y-axis "₹ lakh" 0 --> 100
  bar [40, 55, 70, 90]`,
    caption: "Growth 2023 → 2024 = (90 − 70) / 70 ≈ 28.6%.",
  },
  "data-interpretation/line-graphs": {
    plain:
      "A line graph shows change over time. The steepest segment is the biggest change; a flat segment means no change. Questions often ask for the largest percentage change, which isn't always the steepest absolute jump.",
    diagram: `xychart-beta
  title "Students placed"
  x-axis [Jan, Feb, Mar, Apr, May]
  y-axis "students" 0 --> 120
  line [20, 35, 60, 65, 110]`,
    caption: "The steepest rise is April → May.",
  },
  "data-interpretation/pie-charts": {
    plain:
      "A pie chart shows shares of a whole. A full circle is 360° or 100%, so each 1% is 3.6°. Convert to actual values only at the end by multiplying the share by the total.",
    diagram: `pie title Monthly budget
  "Rent" : 40
  "Food" : 25
  "Travel" : 15
  "Savings" : 20`,
    caption: "Rent at 40% is 144° of the circle.",
  },
};
