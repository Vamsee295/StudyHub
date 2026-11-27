// "Level up" sections for the syllabus-completion lessons: test-level worked problems. Original writing.

export const LEVEL_UP_2: Record<string, string> = {
  "decimal-fractions": `## Level up: test-level problems

**Problem 1.** Simplify 3.6 × 0.25 + 1.44 ÷ 1.2.

~~~
3.6 × 0.25 = 0.9      (36 × 25 = 900, three decimal places)
1.44 ÷ 1.2 = 14.4 ÷ 12 = 1.2
total = 0.9 + 1.2 = 2.1
~~~

**Problem 2.** Write 0.1666… (only the 6 repeats) as a fraction. Write it as 0.1 + 0.0666… = 1/10 + (6/9)/10 = 1/10 + 1/15 = 3/30 + 2/30 = **1/6**. When only part of the decimal repeats, split it into the non-repeating and repeating pieces.

**Problem 3.** Which fraction is largest: 3/7, 5/11, 4/9? As decimals: 3/7 ≈ 0.4286, 5/11 ≈ 0.4545, 4/9 ≈ 0.4444. Largest: **5/11**. Converting to decimals is often faster than finding a common denominator.

**Problem 4.** 0.04 × 0.5 ÷ 0.002 = 0.02 ÷ 0.002 = 20 ÷ 2 = **10**.

**Problem 5.** If 1.5x = 0.04y, find (y − x)/(y + x). From 1.5x = 0.04y, y/x = 1.5/0.04 = 37.5. So (y − x)/(y + x) = (37.5 − 1)/(37.5 + 1) = 36.5/38.5 = **73/77**. Divide everything by x to work with the ratio.

**Problem 6.** Convert 2.375 to a fraction. 2.375 = 2375/1000 = 19/8 (divide by 125).

## A two-minute drill

Write the decimals of the fractions 1/2 to 1/12 from memory, then check against the table at the top of this lesson. Repeat daily for a week and these conversions become instant.`,

  "square-and-cube-roots": `## Level up: test-level problems

**Problem 1.** √(0.0016) + √(0.09) = 0.04 + 0.3 = **0.34**.

**Problem 2.** Find the smallest number by which 1176 must be multiplied to make it a perfect square. 1176 = 2³ × 3 × 7². Each prime needs an even power: multiply by 2 × 3 = **6** (1176 × 6 = 7056 = 84²).

**Problem 3.** √(x) = 1.5 × √(1.44). Then √x = 1.5 × 1.2 = 1.8, so x = **3.24**.

**Problem 4.** If √2 ≈ 1.414, find √8 + √18. √8 = 2√2, √18 = 3√2, total 5√2 ≈ **7.07**.

**Problem 5.** Find ∛(0.000343). 343 = 7³ and 0.000343 = 343/1,000,000, so the root is 7/100 = **0.07**.

Making a number a perfect square or cube by multiplying or dividing always comes down to prime factors: make every power even (squares) or a multiple of 3 (cubes).`,

  "chain-rule-and-variation": `## Level up: test-level problems

**Problem 1.** 12 workers can dig a 40 m trench in 10 days working 8 hours a day. How many workers dig a 60 m trench in 8 days working 6 hours a day?

~~~
(12 × 10 × 8) / 40 = (M × 8 × 6) / 60
24 = 48M / 60  →  M = 30 workers
~~~

**Problem 2.** A car uses 8 litres of petrol for 120 km. How much for 330 km? Direct variation: 8 × 330 / 120 = **22 litres**.

**Problem 3.** 20 workers start a job planned for 30 days. After 10 days, 5 more workers join. How many days does the rest take?

~~~
total work = 20 × 30 = 600 worker-days
done in 10 days = 200; left = 400
now 25 workers: 400 / 25 = 16 more days
~~~

**Problem 4.** If 15 machines make 300 parts in 4 hours, how many parts do 12 machines make in 5 hours? Parts per machine-hour = 300 / 60 = 5. So 12 × 5 × 5 = **300 parts**.

The "per one" method (find the rate for one worker, one machine or one hour) solves every chain question when the master formula feels confusing.`,

  "problems-on-numbers": `## Level up: test-level problems

**Problem 1.** The sum of a number and its reciprocal is 10/3. Find the number. x + 1/x = 10/3 → 3x² − 10x + 3 = 0 → (3x − 1)(x − 3) = 0, so x = **3** or 1/3.

**Problem 2.** A number exceeds 20% of itself by 40. Find it. x − 0.2x = 40 → 0.8x = 40 → x = **50**.

**Problem 3.** The product of two consecutive odd numbers is 143. Let them be n and n + 2: n² + 2n − 143 = 0 → (n − 11)(n + 13) = 0, so **11 and 13**.

**Problem 4.** A two-digit number is 4 times the sum of its digits, and its units digit is 2 more than its tens digit. Find the number.

~~~
digits a (tens) and b (units): 10a + b = 4(a + b)  →  6a = 3b  →  b = 2a
b = a + 2  →  2a = a + 2  →  a = 2, b = 4
number = 24   (check: 2 + 4 = 6 and 4 × 6 = 24 ✔)
~~~

Always check that the digits you find are whole numbers from 0 to 9.

**Problem 5.** Three numbers are in the ratio 2 : 3 : 5 and their sum is 150. One part = 150 / 10 = 15; the numbers are **30, 45, 75**.`,

  "races-and-games": `## Level up: test-level problems

**Problem 1.** In a 1 km race, A beats B by 40 m or 8 seconds. Find A's time.

~~~
B runs 40 m in 8 s, so B's speed = 5 m/s
B's time for 1000 m = 200 s; A finishes 8 s earlier: 192 s
~~~

**Problem 2.** In a game of 100 points, A can give B 20 points and C 28 points. How many can B give C in a game of 100?

~~~
A : B = 100 : 80 and A : C = 100 : 72
B : C = 80 : 72 = 100 : 90
B gives C 10 points
~~~

**Problem 3.** A runs 5/3 times as fast as B. How much start must A give B in a 200 m race for a dead heat? When A runs 200, B runs 200 × 3/5 = 120. Start = **80 m**.`,

  "heights-and-distances": `## Level up: test-level problems

**Problem 1.** The shadow of a tower is 30 m longer when the sun's elevation is 30° than when it's 60°. Find the height.

~~~
at 60°: shadow = h/√3
at 30°: shadow = h√3
h√3 − h/√3 = 30  →  h(3 − 1)/√3 = 30  →  h = 15√3 ≈ 25.98 m
~~~

**Problem 2.** From the top of a 60 m building, the angles of depression of the top and bottom of a tower are 30° and 60°. Find the tower's height.

~~~
distance between them d: tan 60° = 60/d  →  d = 20√3
from the top, the drop to the tower's top: tan 30° = drop/d  →  drop = 20√3 × 1/√3 = 20
tower = 60 − 20 = 40 m
~~~

**Problem 3.** A kite's string is 100 m long and makes 60° with the ground. Height of the kite = 100 × sin 60° = **50√3 ≈ 86.6 m**. When the hypotenuse is given, use sin (for height) or cos (for ground distance).

Draw every question. Two labelled triangles sharing a side solve almost any two-angle problem.`,

  "stocks-and-shares": `## Level up: test-level problems

**Problem 1.** A man invests ₹26,000 in a 12% stock at 130 and later sells when the price is 135. What does he gain on the sale?

~~~
shares = 26,000 / 130 = 200
sale value = 200 × 135 = 27,000
gain = 27,000 − 26,000 = ₹1,000
~~~

**Problem 2.** Which gives more income on ₹12,000: a 10% stock at 120, or an 8% stock at 96?

~~~
10% at 120: 100 shares × ₹10 = ₹1,000
8% at 96:   125 shares × ₹8  = ₹1,000
equal income
~~~

Both return 10/120 = 8/96 ≈ 8.33%, which is why the incomes match.

**Problem 3.** How much must be invested in a 9% stock at 90 to earn ₹1,800 a year? Income per share = ₹9, so shares needed = 200, and the investment = 200 × 90 = **₹18,000**.

**Problem 4.** A ₹10 share is quoted at ₹25 and pays a 30% dividend. Return = (30% of 10) / 25 = 3/25 = **12%**.

**Problem 5.** A 6% stock yields 8%. What is its market price? Return = dividend / price, so 8 = 6/price × 100, giving price = **₹75**.

## Quick reference

| Want | Formula |
|---|---|
| shares bought | investment ÷ market price |
| income | shares × (dividend% × face value) |
| return % | dividend per share ÷ market price × 100 |
| price for a target return | dividend per share ÷ target return × 100 |`,

  "true-and-bankers-discount": `## Level up: test-level problems

**Problem 1.** The present worth of a sum due in 2 years at 10% simple interest is ₹2,500. Find the true discount and the amount.

~~~
TD = 2,500 × 10 × 2 / 100 = 500
amount = 2,500 + 500 = 3,000
~~~

**Problem 2.** The true discount on a bill is ₹60 and the banker's discount is ₹66 for the same time and rate. Find the amount.

~~~
BG = 66 − 60 = 6
amount = BD × TD / BG = 66 × 60 / 6 = 660
~~~

The formula A = BD × TD / (BD − TD) comes straight from the definitions; it saves solving for rate and time.

**Problem 3.** A shopkeeper buys goods worth ₹5,500 payable in 1 year. If money is worth 10% a year, how much should he pay now to settle it? That's the present worth: 100 × 5,500 / 110 = **₹5,000**.

**Problem 4.** The banker's gain on a bill due in 1 year at 5% is ₹1. Find the true discount. BG = TD × R × T / 100, so 1 = TD × 5 / 100, giving TD = **₹20**, and the amount is TD × 100 / (R × T) + TD = 400 + 20 = **₹420**.

## Summary table

| Quantity | Interest on | Formula |
|---|---|---|
| true discount | present worth | PW × R × T / 100 |
| banker's discount | amount | A × R × T / 100 |
| banker's gain | true discount | TD × R × T / 100 |`,

  "logical-sequence-of-words": `## Level up: test-level problems

**Problem 1.** Arrange: 1. Wall 2. Clay 3. House 4. Room 5. Bricks

Clay is made into bricks, bricks build walls, walls make rooms, rooms make a house: **2, 5, 1, 4, 3**.

**Problem 2.** Arrange: 1. Ocean 2. Rivulet 3. Sea 4. River 5. Stream

By size of water body: Rivulet, Stream, River, Sea, Ocean = **2, 5, 4, 3, 1**.

**Problem 3.** Arrange: 1. Diagnosis 2. Recovery 3. Treatment 4. Illness 5. Doctor

What happens: Illness, Doctor, Diagnosis, Treatment, Recovery = **4, 5, 1, 3, 2**.

**Problem 4.** Arrange as in a dictionary: 1. Expedite 2. Expedient 3. Expedition 4. Expend

Common start "exped" for 1, 2, 3; "expen" for 4. After "exped": expedi-e(nt), expedi-t(e), expedi-t(ion). "e" before "t": Expedient first. Expedite and Expedition share "expedit"; next letters "e" and "i": Expedite, then Expedition. "d" (exped) comes before "n" (expen), so Expend is last: **2, 1, 3, 4**.

**Problem 5.** Arrange: 1. Key 2. Door 3. Lock 4. Room 5. Switch on

Take the key, open the lock, open the door, enter the room, switch on the light: **1, 3, 2, 4, 5**.

## How to handle five-word questions

With five words the options get longer, but the method doesn't change: fix the first and the last words, cross out options, then check the middle three in order. Questions with processes (illness to recovery, key to room) reward picturing yourself doing each step.`,

  "essential-part": `## Level up: test-level problems

**Problem 1.** Which is essential to a newspaper? Advertisements, Photographs, News, Crossword.

A newspaper without ads, photos or a crossword is still a newspaper; without news it isn't. Answer: **News**.

**Problem 2.** Which is essential to a cloud? Rain, Water vapour, Sky, Lightning.

Many clouds never rain or make lightning. "Sky" is where clouds are, not part of them. What a cloud is made of is **water vapour** (condensed water droplets).

**Problem 3.** Which is essential to a dictionary? Pictures, Meanings, Maps, Stories.

A dictionary lists words with their **meanings**; pictures and maps are optional extras.

**Problem 4.** Which is essential to a bank? Building, Money, Guard, Queue.

Online banks have no buildings or queues, and guards are optional. A bank deals in **money**.

**Problem 5.** Which is essential to a language? Grammar book, Teacher, Words, Alphabet chart.

Many languages are spoken without a written alphabet or a grammar book, and people learn them without teachers. Every language has **words**.

## The pattern behind the questions

Look at the four options in Problem 4: building, guard and queue are things you'd **see** at a typical bank, which makes them tempting. Question setters choose options like that on purpose. Ask "what is this thing **for** or **made of**?" and the essential part usually stands out: a bank is for money, a cloud is made of water vapour, a dictionary is for meanings.

## Practice

1. Which is essential to a garden? Fountain, Plants, Fence, Bench
2. Which is essential to a lecture? Projector, Speaker, Notes, Microphone
3. Which is essential to a vehicle? Radio, Wheels, Mirror, Seat cover

**Answers:** 1) **Plants**. 2) **Speaker** (someone giving the lecture). 3) **Wheels** in the usual test sense (boats and planes aside, tests mean road vehicles).`,

  "artificial-language": `## Level up: test-level problems

**Problem 1.**

~~~
'dar mi ko' = 'take the book'
'ko lin'    = 'book shelf'
'mi sat'    = 'the table'
~~~

- book = ko (shared by sentences 1 and 2)
- the = mi (shared by sentences 1 and 3)
- so take = dar, shelf = lin, table = sat

What is the code for "take the shelf"? **dar mi lin** (in any order).

**Problem 2.** A four-sentence version:

~~~
'pi lo ma'  = 'eat green apples'
'ma ru'     = 'apples taste'
'ru ke lo'  = 'taste green leaves'
'ke na'     = 'leaves fall'
~~~

- apples = ma (1 and 2)
- taste = ru (2 and 3)
- green = lo (1 and 3)
- leaves = ke (3 and 4)
- eat = pi, fall = na

Code for "green leaves fall": **lo ke na**.

**Problem 3 (can't be determined).**

~~~
'tu ve'    = 'hot tea'
'tu ve so' = 'hot tea please'
~~~

please = so, because it's the only new word and the only new code. But "hot" and "tea" appear together in both sentences, and so do "tu" and "ve": their codes **can't be separated**. One more sentence containing only one of them (say 've ka' = 'tea cup') would settle it: tea = ve, hot = tu.

## Speed tip

Write each sentence on its own line with English above and code below. Circle the word you're asked about and look only for sentences containing it; often two sentences are enough and the rest is noise.`,

  "verification-of-truth": `## Level up: test-level problems

**Problem 1 (always true).** A newspaper always has… advertisements, photographs, news, an editorial.
Some papers carry no ads or photos; editorials are common but not universal. **News** is the one constant.

**Problem 2 (three people, two truth-tellers).** Exactly two of A, B and C tell the truth.
- A: "C is a liar."
- B: "A is telling the truth."
- C: "B is a liar."

Try each person as the single liar:
- A lies: then C is truthful, B's "A is telling the truth" is false, so B lies too. Two liars ✗
- B lies: then A is truthful, so C is a liar. Two liars ✗
- C lies: A's "C is a liar" is true ✔; B's "A is telling the truth" is true ✔; C's "B is a liar" is false ✔ (B is truthful). One liar ✔

**C is the liar.**

**Problem 3 (island puzzle).** On an island, knights always tell the truth and knaves always lie. P says: "At least one of us is a knave." Q says nothing. What are they?

- If P were a knave, "at least one of us is a knave" would be true, but knaves can't say true things. So P is a knight
- P's statement is then true: at least one is a knave, and it isn't P, so **Q is a knave**

## Thinking pattern

Every liar puzzle uses the same loop: assume, follow every statement, look for a contradiction. Write each case as a small table (person: truth or lie) and fill it in; contradictions jump out on paper.`,

  "arithmetic-reasoning": `## Level up: test-level problems

**Problem 1.** In a class, the number of boys is 5 more than twice the number of girls. There are 41 students. How many girls?

~~~
girls g, boys 2g + 5
3g + 5 = 41  →  g = 12 (boys 29)
~~~

**Problem 2.** A clock strikes once at 1 o'clock, twice at 2, and so on, plus once at every half hour. How many strikes in 24 hours?

~~~
hourly strikes in 12 hours: 1 + 2 + … + 12 = 78; in 24 hours: 156
half-hour strikes: 24
total = 180
~~~

**Problem 3.** In a tournament, every team plays every other team twice (home and away). With 6 teams, how many matches? Pairs = 6 × 5 / 2 = 15, each played twice: **30**.

**Problem 4.** A frog climbs a 20 m well: 5 m up each day, 3 m down each night. On which day does it get out?

~~~
net 2 m per full day; on the day it starts within 5 m of the top it escapes
after 7 days it's at 14 m; on day 8 it climbs from 14 to 19 m: not yet out
after 8 days (night): 16 m; on day 9 it climbs 16 → 21: out on day 9
~~~

Careful: the last climb doesn't slip back. Count until the frog is within one day's climb of the top.

**Problem 5.** A shop sells pens at 3 for ₹10 and buys them at 4 for ₹10. How many pens must it sell to make ₹100 profit? Profit per pen = 10/3 − 10/4 = 10/12 = ₹5/6. Pens = 100 ÷ 5/6 = **120**.`,

  "mathematical-operations": `## Level up: test-level problems

**Problem 1.** If "×" means "÷", "−" means "×", "÷" means "+" and "+" means "−", find 16 × 4 − 3 ÷ 2 + 5.

~~~
rewrite: 16 ÷ 4 × 3 + 2 − 5
= 4 × 3 + 2 − 5 = 12 + 2 − 5 = 9
~~~

**Problem 2.** a ◇ b = (a + b)/(a − b). Find (5 ◇ 3) ◇ 2.

~~~
5 ◇ 3 = 8/2 = 4
4 ◇ 2 = 6/2 = 3
~~~

**Problem 3.** Which two signs must be interchanged to make 12 ÷ 2 − 4 × 3 + 1 = 4 correct?
- swap ÷ and ×: 12 × 2 − 4 ÷ 3 + 1 = 24 − 1.33 + 1 ✗
- swap − and +: 12 ÷ 2 + 4 × 3 − 1 = 6 + 12 − 1 = 17 ✗
- swap × and +: 12 ÷ 2 − 4 + 3 × 1 = 6 − 4 + 3 = 5 ✗
- swap ÷ and −: 12 − 2 ÷ 4 × 3 + 1 = 12 − 1.5 + 1 = 11.5 ✗
- swap − and ×: 12 ÷ 2 × 4 − 3 + 1 = 24 − 3 + 1 = 22 ✗

None works, so the answer is "none of these". Questions like this exist to check you tried every option.

**Problem 4.** If 5 # 3 = 34 and 4 # 2 = 20, find 6 # 1. Pattern: a² + b² (25 + 9 = 34, 16 + 4 = 20), so 6 # 1 = **37**. When the rule isn't given, find it from the examples and confirm it on all of them.`,

  "making-judgments": `## Level up: test-level problems

**Problem 1.** Definition: "**Negligence** is failing to take reasonable care, causing harm to someone."
Which is negligence?
- (a) A shop leaves a wet floor without a warning sign and a customer slips ✔ (no reasonable care, harm caused)
- (b) A customer slips on a dry floor while running ✗ (the shop took care)
- (c) A shop mops the floor and puts up a warning sign ✗ (care was taken)

**Problem 2.** Rule: "Employees may work from home if they have worked here more than a year **and** their manager approves, **or** if they have a medical certificate."
- Ravi: 2 years, manager approved → **yes** (first branch)
- Neha: 6 months, medical certificate → **yes** (second branch)
- Arjun: 3 years, manager not asked, no certificate → **no**

Draw the rule as branches: (A and B) or C. Check each person against each branch.

**Problem 3 (matching definitions).** Which term fits "A company sells a product below cost to drive a rival out of the market, planning to raise prices later"?
- Monopoly: one seller controls a market (an outcome, not this tactic)
- **Predatory pricing**: pricing below cost to eliminate competitors ✔
- Inflation: a general rise in prices ✗

**Problem 4.** Definition: "**Delegation** is assigning a task to someone else while keeping responsibility for the outcome."
A manager asks a team member to prepare a report, then reviews it before sending it to the client. Is that delegation? **Yes**: the task was assigned and the manager kept responsibility by reviewing it. If the manager had said "it's entirely your problem now", responsibility would have been handed over, which the definition excludes.

## Why companies use these questions

They mirror real work: applying policies, rules and definitions to messy situations. The skill is reading precisely, splitting rules into conditions, and not filling gaps with assumptions.`,

  "spotting-errors": `## Level up: test-level problems

1. (a) Not only he is clever / (b) but also hard-working / (c) in every way / (d) no error
2. (a) The boy, as well as his parents, / (b) were present / (c) at the function / (d) no error
3. (a) Neither the manager / (b) nor his assistants / (c) was available / (d) no error
4. (a) One of the most / (b) famous poet / (c) of India / (d) no error
5. (a) I look forward / (b) to meet you / (c) next week / (d) no error

**Answers:**

1. **(a)**: "Not only" at the start inverts the verb: "Not only is he clever"
2. **(b)**: "as well as" doesn't add to the subject; "the boy … was present"
3. **(c)**: with neither … nor, the verb agrees with the nearer subject, "assistants": "were available"
4. **(b)**: "one of the most famous **poets**" (plural after "one of")
5. **(b)**: "look forward to" takes -ing: "to meeting you"

## Rules these questions test

| Rule | Example |
|---|---|
| inversion after negative openers | Not only is he…; Hardly had I… |
| 'as well as', 'along with', 'together with' don't change the subject | The boy, as well as his parents, was… |
| neither/either … nor/or: verb agrees with the nearer subject | Neither he nor they were… |
| one of + plural noun + singular verb | One of the poets is… |
| look forward to / object to / be used to + -ing | look forward to meeting |

Add these to the checklist at the top of the lesson and you'll catch nearly every error tests use.`,

  "sentence-improvement": `## Level up: test-level problems

1. "Each of the players HAVE BEEN given a kit."
   (a) has been (b) were (c) are being (d) No improvement
2. "She has been working here SINCE TEN YEARS."
   (a) for ten years (b) from ten years (c) ten years before (d) No improvement
3. "Had I known about the traffic, I WOULD HAVE LEFT earlier."
   (a) will leave (b) would leave (c) had left (d) No improvement
4. "The committee ARE DIVIDED in their opinions."
   (a) is divided (b) were dividing (c) has divided (d) No improvement
5. "He is one of those people who ALWAYS SPEAKS the truth."
   (a) always speak (b) speaks always (c) is always speaking (d) No improvement

**Answers:**

1. **(a) has been**: "each" is singular
2. **(a) for ten years**: a length of time takes "for"
3. **(d) No improvement**: a correct third conditional (inverted "had I known")
4. **(d) No improvement**: when members disagree, the collective noun acts as individuals and takes a plural verb ("their opinions" confirms it)
5. **(a) always speak**: "who" refers to "people" (plural), so the verb is plural

## Notice the pattern

Two of the five answers were "No improvement". Tests include them regularly to catch students who assume something must be wrong. Decide on the rule first, then look at the options, not the other way round.

## The rules behind these questions

| Rule | Example |
|---|---|
| 'each', 'every', 'either', 'neither' are singular | Each of them has… |
| 'for' with a length of time, 'since' with a starting point | for ten years / since 2015 |
| inverted conditionals drop 'if' | Had I known… (= If I had known) |
| collective nouns: singular as one unit, plural as individuals | The team is…; The jury were divided… |
| 'one of those people who' takes a plural verb | …who always speak |
| insist on, be used to, look forward to + -ing | insisted on going |

## How to practise

Take any paragraph you've written and underline every verb. Check each one's subject and tense against the table above. Ten minutes of this a day trains the same eye that sentence-improvement questions test.`,

  "spellings": `## Level up: test-level problems

**Problem 1.** Which word is spelt correctly? (a) Conscience (b) Concience (c) Conscence (d) Consience. **(a)**: "science" sits inside con-science.

**Problem 2.** Which is misspelt? (a) Questionnaire (b) Liaison (c) Persuade (d) Millenium. **(d)**: millennium has two l's and two n's (mille + annum).

**Problem 3.** Choose the correct spelling: (a) Entrepeneur (b) Entrepreneur (c) Enterpreneur (d) Entrepreneure. **(b)**: entre-pre-neur.

**Problem 4.** Which is misspelt? (a) Bureaucracy (b) Exaggerate (c) Harrass (d) Perseverance. **(c)**: harass has one r and two s's.

**Problem 5.** Choose the correct spelling: (a) Supercede (b) Supersede (c) Superseed (d) Supersed. **(b)**: it's the only common English word ending in -sede.

## Word families that help

| Root | Words |
|---|---|
| -cede / -ceed / -sede | precede, concede (most); proceed, succeed, exceed (three); supersede (one) |
| -ance / -ence | maintenance, appearance; existence, independence |
| -able / -ible | acceptable, noticeable; responsible, possible |
| -ise (British) / -ize | organise, recognise (both accepted; be consistent) |

## Commonly confused pairs

| Pair | Meaning |
|---|---|
| affect / effect | verb (to influence) / noun (a result) |
| principal / principle | head of a school, main / a rule or belief |
| stationary / stationery | not moving / paper and pens |
| complement / compliment | completes something / praise |
| advice / advise | noun / verb |
| lose / loose | misplace / not tight |

## A weekly habit

Pick ten words from the lists in this lesson each week. Write each one three times, then use it in a sentence. Most spelling errors come from a small set of words, so a few minutes on the same lists every week goes a long way.`,

  "ordering-of-words": `## Level up: test-level problems

**Problem 1.**
P. which was built in 1890
Q. is now a museum
R. The old palace
S. on the hill

Subject with its description: "The old palace (R) on the hill (S) which was built in 1890 (P) is now a museum (Q)": **RSPQ**. A "which" clause sits right after the noun it describes.

**Problem 2.**
P. because the roads were flooded
Q. the school
R. declared a holiday
S. on Monday

Subject, verb, time, reason: "The school declared a holiday on Monday because the roads were flooded": **QRSP**. Clauses starting with "because" usually come at the end (or at the beginning, followed by a comma).

**Problem 3.**
P. to finish the report
Q. asked his team
R. The manager
S. by Friday

Subject, verb with object, infinitive, deadline: **RQPS**.

**Problem 4.**
P. not only reduces stress
Q. Regular exercise
R. but also improves sleep
S. and concentration

The "not only … but also" pair fixes the order of P and R: **QPRS**.

## Clues that fix pairs

| Clue | Goes with |
|---|---|
| who, which, that | right after its noun |
| not only | before 'but also' |
| either / neither | before 'or' / 'nor' |
| because, although | starts a clause (at the end of the sentence, or at its start) |
| by + day, at + time | near the end |

## Practice drill

Take a long sentence from a newspaper, cut it into four parts, shuffle them and rebuild it the next day. The structures you'll notice (subject first, "which" after its noun, time at the end) are exactly what these questions test.`,

  "verbal-analogies": `## Level up: test-level problems

**Problem 1.** Biography : Life :: Map : ? A biography describes a life; a map describes a **region** (or terrain).

**Problem 2.** Carpenter : Saw :: Surgeon : ? Worker and main tool: a surgeon uses a **scalpel**. "Hospital" is a workplace, a different relationship.

**Problem 3.** Drought : Famine :: Flood : ? Cause and effect: drought can cause famine; floods can cause **destruction** (or displacement). Check that the option is an effect, not another cause.

**Problem 4.** Odometer : Distance :: Ammeter : ? Instrument and what it measures: an ammeter measures **electric current**.

**Problem 5.** Pious : Religion :: Patriotic : ? A pious person is devoted to religion; a patriotic person is devoted to their **country**.

**Problem 6.** Ignite : Extinguish :: Assemble : ? Opposites: assemble (put together) and **dismantle** (take apart).

## The two-pass method for hard analogies

1. **First pass:** make a broad sentence ("X is related to Y") and keep every option that fits
2. **Second pass:** make the sentence precise ("X is the main tool used by Y") and keep only the option that still fits

Most hard analogies have two options that pass the first test; the second pass separates them.

## Practice

1. Petal : Flower :: Feather : ?
2. Shy : Bold :: Generous : ?
3. Hammer : Nail :: Screwdriver : ?

**Answers:** 1) **Bird** (part and whole). 2) **Stingy** (opposites). 3) **Screw** (tool and what it drives).`,

  "completing-statements": `## Level up: test-level problems

1. "Not only did the team win the trophy, …"
   (a) and they lost the final (b) but they also broke the record (c) so they won (d) or they gave up
2. "Had the bridge been inspected earlier, …"
   (a) the accident could have been avoided (b) the accident is avoided (c) the accident will be avoided (d) because the accident happened
3. "Despite repeated warnings, …"
   (a) the residents refused to leave (b) the residents left at once (c) because the residents were safe (d) so the warnings stopped
4. "The faster you drive, …"
   (a) the greater the risk (b) the risk is greater (c) and greater risk (d) risk becomes great
5. "So well did she perform that …"
   (a) she received a standing ovation (b) she was booed (c) because she performed (d) although she performed

**Answers:**

1. **(b)**: "not only" pairs with "but also"
2. **(a)**: an inverted third conditional ("had the bridge been…" = "if the bridge had been…") takes "could/would have"
3. **(a)**: "despite" introduces a contrast; ignoring warnings is the contrasting result
4. **(a)**: "the faster …, the greater …" is a fixed pattern
5. **(a)**: "so well … that" gives a result of how well she performed

## Patterns worth memorising

| Opening | Ending pattern |
|---|---|
| Not only … | but also … |
| No sooner … | than … |
| Hardly / Scarcely … | when … |
| Had + subject + past participle … | would/could have … |
| The + comparative … | the + comparative … |
| So + adjective/adverb … | that … |
| Despite / In spite of + noun | a contrasting result |`,
};
