// Long-form theory for Quantitative Aptitude: time-based problems and algebra. Original writing.
import { LessonTheory } from './utils';

const KHAN_ALG1 = { title: "Khan Academy: Algebra 1", url: "https://www.khanacademy.org/math/algebra" };
const KHAN_RATES = { title: "Khan Academy: Rates and proportional relationships", url: "https://www.khanacademy.org/math/cc-seventh-grade-math/cc-7th-ratio-proportion" };
const OPENSTAX_ELEM_ALG = { title: "OpenStax: Elementary Algebra 2e (free textbook)", url: "https://openstax.org/details/books/elementary-algebra-2e" };
const OPENSTAX_COLLEGE_ALG = { title: "OpenStax: College Algebra 2e (free textbook)", url: "https://openstax.org/details/books/college-algebra-2e" };
const OPENSTAX_PREALG = { title: "OpenStax: Prealgebra 2e (free textbook)", url: "https://openstax.org/details/books/prealgebra-2e" };
const WIKI_QUADRATIC = { title: "Wikipedia: Quadratic equation", url: "https://en.wikipedia.org/wiki/Quadratic_equation" };
const WIKI_AP = { title: "Wikipedia: Arithmetic progression", url: "https://en.wikipedia.org/wiki/Arithmetic_progression" };
const WIKI_GP = { title: "Wikipedia: Geometric progression", url: "https://en.wikipedia.org/wiki/Geometric_progression" };

export const aptQuantTimeAlgebraTheory: Record<string, LessonTheory> = {
  "time-and-work": {
    theory: `Time and work problems ask how long people or machines take to finish a job, alone or together. The key insight is to think in terms of **work per unit time** (rate) rather than time: rates add when people work together, while times don't. With the LCM method, most problems become a few lines of whole-number arithmetic. This lesson covers rates, working together, the LCM method, efficiency comparisons, people joining or leaving, and wages.

## Work as a rate

If A finishes a job in 10 days, A does 1/10 of the job per day. Rates add:

~~~
A alone: 10 days → 1/10 per day
B alone: 15 days → 1/15 per day
Together: 1/10 + 1/15 = 5/30 = 1/6 per day → 6 days
~~~

Shortcut for two people: together time = (a × b) ÷ (a + b) = 150 ÷ 25 = 6 days.

## The LCM method

Assume the total work equals the LCM of the individual times, so every rate is a whole number:

~~~
A: 12 days, B: 18 days, C: 36 days. Total work = LCM = 36 units
Rates: A = 3, B = 2, C = 1 units/day → together 6 units/day → 6 days
~~~

This avoids fractions entirely and is the fastest method in tests.

## Efficiency

Efficiency is inversely proportional to time. If A is twice as efficient as B, A takes half as long.

~~~
A is 50% more efficient than B. B alone takes 30 days. A and B together?
Efficiency ratio A : B = 3 : 2 → time ratio 2 : 3 → A takes 20 days
Total work = 60 units; A = 3, B = 2 per day → 12 days
~~~

## Working for part of the time

~~~
A (20 days) and B (30 days) start together. A leaves after 5 days. When is the work finished?
Total = 60 units; A = 3, B = 2 per day
5 days together: 25 units; remaining 35 units by B alone: 17.5 days
Total time: 22.5 days
~~~

Work out the units completed in each phase, then divide the remainder by the remaining rate.

## Leaving before completion

~~~
A (10 days) and B (15 days) work together, but A leaves 2 days before the end. Total time?
Total = 30 units; A = 3, B = 2. B works the full t days, A works t − 2 days.
3(t − 2) + 2t = 30 → 5t = 36 → t = 7.2 days
~~~

## Negative work

Some agents undo work (a leak in a tank, a person who damages output). Treat their rate as negative, as in the pipes and cisterns lesson.

## Men, days and hours

Total work is proportional to people × days × hours per day (assuming equal efficiency):

~~~
M₁ × D₁ × H₁ ÷ W₁ = M₂ × D₂ × H₂ ÷ W₂
~~~

~~~
12 men working 8 hours a day finish a job in 10 days. How many days for 16 men working 6 hours a day?
12 × 10 × 8 = 16 × D × 6 → D = 10 days
~~~

When the amount of work changes (W₁ ≠ W₂), include it in the ratio.

## Men and women or different worker types

~~~
3 men or 5 women can finish a job in 20 days. How long for 6 men and 5 women?
3 men = 5 women → 1 man = 5/3 women → 6 men + 5 women = 10 + 5 = 15 women
5 women take 20 days → 15 women take 20 × 5/15 = 6.67 days
~~~

Convert everyone to one unit, then apply inverse proportion.

## Wages

Wages are shared in proportion to **work done**, which equals rate × time. If A and B work the same number of days, wages split in the ratio of efficiencies:

~~~
A (6 days) and B (8 days) finish a job together for 2,800. Shares?
Rates 1/6 : 1/8 = 4 : 3 → A gets 1,600, B gets 1,200
~~~

If a third person C helps for part of the time, compute C's share of the work first.

## Alternate days

~~~
A (10 days) and B (15 days) work on alternate days, A starting. Time?
Total 30 units; A = 3, B = 2 → every 2-day cycle does 5 units
6 cycles (12 days) do 30 units → 12 days
~~~

If the work doesn't divide evenly, finish the final partial day carefully, checking whose turn it is.

## Common mistakes

- adding times instead of rates
- forgetting that efficiency and time are inversely related
- dividing remaining work by the wrong rate after someone leaves
- splitting wages by days instead of work done

## How interviewers test this

Expect two- or three-person combined work, efficiency comparisons, people leaving or joining, men-days-hours scaling, mixed worker types, alternate-day schedules and wage splits. Use the LCM method, track units of work per phase, and convert efficiencies to time inversely.`,
    sources: [KHAN_RATES, OPENSTAX_PREALG],
  },

  "pipes-and-cisterns": {
    theory: `Pipes and cisterns problems are time and work problems with water: inlet pipes fill a tank, outlet pipes or leaks empty it. Filling counts as positive work and emptying as negative work. With the same LCM method used in time and work, these become quick calculations. This lesson covers combined pipes, leaks, pipes opened or closed at different times, and the classic patterns.

## Inlets and outlets

- an **inlet** fills the tank: positive rate
- an **outlet** or **leak** empties it: negative rate

If an inlet fills a tank in 6 hours, its rate is +1/6 tank per hour. If an outlet empties it in 9 hours, its rate is −1/9.

## Combined rates with the LCM method

~~~
Pipe A fills in 6 h, pipe B fills in 8 h, pipe C empties in 12 h. All open: time to fill?
Tank = LCM(6, 8, 12) = 24 units
A = +4, B = +3, C = −2 per hour → net +5 per hour → 24/5 = 4.8 hours
~~~

## Two pipes, one filling and one emptying

Shortcut: time to fill = (a × b) ÷ (b − a), where the filler takes a hours, the emptier b hours, and b > a.

~~~
Fill in 4 h, empty in 6 h: (4 × 6) ÷ (6 − 4) = 12 hours
~~~

If b < a, the tank never fills; it empties instead.

## Leaks

~~~
A pipe normally fills a tank in 5 hours. With a leak, it takes 6 hours. How long would the leak take to empty a full tank?
Tank = 30 units; pipe = 6 units/h; with leak = 5 units/h → leak = 1 unit/h → 30 hours
~~~

Leak problems work by comparing the rate with and without the leak.

## Pipes opened at different times

~~~
A fills in 12 h, B in 15 h. Both open; after 3 hours, A is closed. Total time?
Tank = 60 units; A = 5, B = 4
3 hours together: 27 units; remaining 33 units by B: 8.25 hours
Total: 11.25 hours
~~~

## Closing a pipe before completion

~~~
A (20 min) and B (30 min) are opened together, but B is turned off x minutes before the tank is full, which takes 18 minutes in total. Find x.
Tank = 60 units; A = 3/min, B = 2/min
A works 18 min: 54 units; B supplies 6 units → B works 3 min → x = 15
~~~

## Alternating pipes

~~~
A (4 h) and B (6 h) are opened alternately for an hour each, starting with A. Time to fill?
Tank = 12 units; A = 3, B = 2 → each 2-hour cycle adds 5
2 cycles (4 h) add 10 → remaining 2 units by A (rate 3) in 2/3 h → 4 h 40 min
~~~

Always check whether the tank fills partway through a cycle; that's the usual trap. For problems where a filling pipe and an emptying pipe alternate, the tank may overflow before the end of a cycle's emptying phase, so check the level after each filling phase.

## Capacity questions

~~~
Two pipes fill a tank in 10 and 15 minutes. A leak drains 4 litres per minute, and with all three, the tank fills in 8 minutes. Capacity?
Let capacity = C. C/10 + C/15 − 4 = C/8
Multiply by 120: 12C + 8C − 480 = 15C → 5C = 480 → C = 96 litres
~~~

When a quantity in litres appears, set up an equation with the capacity as the unknown.

## Same idea as time and work

| Time and work | Pipes and cisterns |
|---|---|
| Worker | Pipe |
| Job | Tank |
| Damaging worker | Leak or outlet |
| Days | Hours or minutes |

Every technique from time and work, including the LCM method and phase-by-phase tracking, transfers directly.

## Common mistakes

- adding the emptying pipe's rate instead of subtracting it
- forgetting the tank may fill partway through an alternating cycle
- confusing "time to fill" with "time to empty" in leak questions
- mixing units such as hours and minutes

## How interviewers test this

Expect combined inlets and outlets, leaks discovered by slower filling, pipes closed after some time, alternating pipes and capacity equations. Assign the tank LCM units, give outlets negative rates, track units filled in each phase, and watch for the tank filling midway through a cycle.`,
    sources: [KHAN_RATES, OPENSTAX_PREALG],
  },

  "time-speed-distance": {
    theory: `Time, speed and distance (TSD) problems are built on one relationship: distance = speed × time. From it come average speed, relative speed, meeting and overtaking, delays and early arrivals. TSD also underpins trains, boats and races, so mastering it pays off across several topics. This lesson covers the core formula, unit conversion, average speed, relative speed, proportionality shortcuts and common problem types.

## The core relationship

~~~
Distance = Speed × Time
Speed = Distance ÷ Time
Time = Distance ÷ Speed
~~~

Keep units consistent: kilometres with hours, metres with seconds.

## Unit conversion

- km/h to m/s: multiply by 5/18 (72 km/h = 20 m/s)
- m/s to km/h: multiply by 18/5 (15 m/s = 54 km/h)

The factor comes from 1 km/h = 1000 m ÷ 3600 s = 5/18 m/s.

## Proportionality

- at **constant speed**, distance is proportional to time
- for a **fixed distance**, speed and time are inversely proportional: if speeds are in the ratio a : b, times are in the ratio b : a

~~~
Walking at 3/4 of usual speed, a man is 20 minutes late. Usual time?
New time = 4/3 of usual → extra 1/3 of usual = 20 min → usual = 60 min
~~~

## Average speed

Average speed = total distance ÷ total time, never the plain average of speeds unless equal times are spent at each speed.

For equal distances at speeds a and b:

~~~
Average speed = 2ab ÷ (a + b)
~~~

~~~
A car goes 60 km at 30 km/h and returns at 60 km/h.
Average = 2 × 30 × 60 ÷ 90 = 40 km/h
~~~

## Relative speed

When two objects move:

- **opposite directions** (towards or away from each other): relative speed = a + b
- **same direction**: relative speed = |a − b|

~~~
Two cyclists 90 km apart ride towards each other at 20 and 25 km/h. When do they meet?
90 ÷ 45 = 2 hours
~~~

~~~
A thief runs at 8 km/h; a policeman starts 10 minutes later at 10 km/h. When is the thief caught?
Lead = 8 × 1/6 = 4/3 km; gap closes at 2 km/h → 2/3 h = 40 minutes after the policeman starts
~~~

## Meeting problems with different start times

~~~
A leaves P for Q (300 km apart) at 8 a.m. at 60 km/h. B leaves Q for P at 9 a.m. at 90 km/h. When do they meet?
By 9 a.m., A has covered 60 km → gap 240 km at 150 km/h → 1.6 h after 9 a.m. → 10:36 a.m.
~~~

Handle the head start first, then apply relative speed.

## After meeting

If two people start towards each other and after meeting take t₁ and t₂ hours to reach the other's starting points, their speeds satisfy:

~~~
Speed of A : Speed of B = √t₂ : √t₁
~~~

~~~
After meeting, A takes 9 h and B takes 4 h to finish. Speed ratio A : B = √4 : √9 = 2 : 3
~~~

## Late and early arrivals

~~~
At 40 km/h a man is 15 min late; at 50 km/h he is 9 min early. Distance?
Time difference = 24 min = 0.4 h
d/40 − d/50 = 0.4 → d(5 − 4)/200 = 0.4 → d = 80 km
~~~

## Races

In a race of length L, if A beats B by x metres, then when A covers L, B covers L − x. Speed ratio A : B = L : (L − x).

~~~
In a 100 m race, A beats B by 10 m, and B beats C by 10 m. By how much does A beat C?
A : B = 100 : 90, B : C = 100 : 90 → when A runs 100, B runs 90, C runs 81 → A beats C by 19 m
~~~

## Circular tracks

Two runners on a circular track of length L:

- opposite directions: they meet every L ÷ (a + b)
- same direction: the faster laps the slower every L ÷ (a − b)
- they meet at the starting point for the first time after the LCM of their individual lap times

## Common mistakes

- mixing km/h and m/s
- averaging speeds directly for equal distances
- ignoring head starts in meeting or chase problems
- adding speeds when objects move in the same direction

## How interviewers test this

Expect unit conversions, average speed over equal distances, meeting and chasing problems, late or early arrival equations, speed-ratio reasoning, races and circular tracks. Convert units first, use the harmonic mean for equal distances, apply relative speed, and use inverse proportion between speed and time for fixed distances.`,
    sources: [KHAN_RATES, OPENSTAX_ELEM_ALG],
  },

  "boats-and-streams": {
    theory: `Boats and streams problems apply relative speed to a boat moving in flowing water. The current helps the boat downstream and hinders it upstream, so the boat's effective speed changes with direction. Two formulas solve nearly every question. This lesson covers downstream and upstream speeds, finding boat and stream speeds, round trips, average speed and the variations tests use.

## Key terms

- **still water speed** (b): the boat's speed with no current
- **stream speed** (s): the speed of the current
- **downstream**: moving with the current, speed = b + s
- **upstream**: moving against the current, speed = b − s

These assume b > s; otherwise the boat couldn't move upstream at all.

## Recovering b and s

Given downstream speed D and upstream speed U:

~~~
b = (D + U) ÷ 2
s = (D − U) ÷ 2
~~~

~~~
A boat goes 24 km downstream in 2 h and 24 km upstream in 3 h.
D = 12 km/h, U = 8 km/h → b = 10 km/h, s = 2 km/h
~~~

## Round trips

~~~
A boat's still-water speed is 15 km/h and the stream is 3 km/h. Time for a 36 km round trip (36 km each way)?
Downstream 18 km/h: 2 h. Upstream 12 km/h: 3 h. Total 5 h
~~~

Average speed for the round trip:

~~~
(b + s)(b − s) ÷ b = (b² − s²) ÷ b
~~~

For the example: (225 − 9)/15 = 14.4 km/h. Total distance 72 km ÷ 5 h confirms 14.4. The average is always less than the still-water speed, because more time is spent going upstream.

## Finding distance from round-trip time

~~~
A man rows at 6 km/h in still water; the current is 2 km/h. He takes 3 h to row to a place and back. Distance?
d/8 + d/4 = 3 → 3d/8 = 3 → d = 8 km
~~~

## Using time ratios

~~~
A man takes twice as long to row upstream as downstream for the same distance. Ratio of b to s?
Upstream speed is half downstream: b − s = (b + s)/2 → b = 3s → ratio 3 : 1
~~~

In general, if upstream takes k times as long, b : s = (k + 1) : (k − 1).

## Floating objects

An object floating in the stream moves at speed s. A useful result: if a boat drops an object, travels for some time and then turns back, it reaches the object after the same amount of time it travelled away, because relative to the water, the boat's speed is b in both directions.

~~~
A boat drops a hat, continues upstream for 15 minutes, then turns back. When does it reach the hat?
15 minutes after turning back, regardless of the stream speed
~~~

Reasoning relative to the water removes the current entirely.

## Two boats

Two boats moving towards each other in the same river: relative speed = (b₁ + s) + (b₂ − s) = b₁ + b₂, since the current helps one and hinders the other equally. Moving in the same direction, the current cancels too: relative speed = |b₁ − b₂|.

## Swimmers and escalators

The same model applies to a swimmer in a river, a person walking on a moving walkway, or an escalator:

~~~
Walking up a moving escalator takes 30 s; walking down the same escalator (against its motion) takes 90 s at the same walking speed. Time standing still on it?
Let length = 90 units. With: 3 units/s; against: 1 unit/s
walk + esc = 3, walk − esc = 1 → esc = 1 unit/s → 90 s
~~~

## Problem-solving checklist

1. write D = b + s and U = b − s
2. convert given distances and times into D and U
3. solve for the requested quantity
4. check that b > s

## Common mistakes

- adding the stream speed upstream
- averaging downstream and upstream speeds directly for round-trip average speed
- forgetting the floating object moves with the stream
- mixing up b and s when recovering them

## How interviewers test this

Expect finding still-water and stream speeds, round-trip times and distances, average speed, time-ratio problems, floating objects and escalator variations. Use D = b + s and U = b − s, halve their sum and difference, and reason relative to the water when an object drifts.`,
    sources: [KHAN_RATES, OPENSTAX_ELEM_ALG],
  },

  "trains": {
    theory: `Train problems are time, speed and distance problems where the moving object has length. When a train passes something, the distance covered includes the train's own length, plus the length of whatever it crosses if that has length too. Combined with relative speed, this handful of ideas covers every train question in placement tests. This lesson covers crossing poles and platforms, two trains, relative speed in both directions, and unit handling.

## The length rule

| Train crosses | Distance covered |
|---|---|
| A pole, signal, standing person or tree | Length of the train |
| A platform, bridge or tunnel | Train length + platform length |
| Another train | Sum of both train lengths |

The front of the train must travel until the back clears the object.

## Units

Speeds usually come in km/h and lengths in metres, so convert speed to m/s by multiplying by 5/18.

~~~
A 240 m train moving at 72 km/h passes a pole. Time?
72 km/h = 20 m/s → 240 ÷ 20 = 12 s
~~~

## Platforms and bridges

~~~
A 150 m train at 54 km/h crosses a 300 m bridge. Time?
54 km/h = 15 m/s; distance = 450 m → 30 s
~~~

~~~
A train crosses a 200 m platform in 20 s and a pole in 10 s. Find its length and speed.
Pole: L = 10v. Platform: L + 200 = 20v → 10v = 200 → v = 20 m/s, L = 200 m
~~~

The difference between the two times is the time to cover the platform's length alone.

## Two trains, opposite directions

Relative speed = sum of speeds; distance = sum of lengths.

~~~
Trains of 120 m and 180 m run towards each other at 50 and 40 km/h. Time to cross?
Relative speed = 90 km/h = 25 m/s; distance = 300 m → 12 s
~~~

## Two trains, same direction

Relative speed = difference of speeds.

~~~
A 200 m train at 60 km/h overtakes a 160 m train at 42 km/h. Time?
Relative speed = 18 km/h = 5 m/s; distance = 360 m → 72 s
~~~

## Train and a moving person

A person has negligible length, so the distance is only the train's length, with relative speed:

~~~
A 110 m train at 60 km/h passes a man walking at 6 km/h in the opposite direction. Time?
Relative speed = 66 km/h = 55/3 m/s → 110 ÷ (55/3) = 6 s
~~~

## A person in a train

A passenger in one train watching another train pass sees only the other train's length go by:

~~~
A man in a train at 45 km/h sees a train going the opposite way at 63 km/h pass him in 6 s. Length of the other train?
Relative speed = 108 km/h = 30 m/s → length = 180 m
~~~

## Two trains meeting from opposite stations

~~~
Two trains leave stations A and B, 360 km apart, at the same time, towards each other at 70 and 50 km/h. When and where do they meet?
360 ÷ 120 = 3 h; meeting point is 210 km from A
~~~

Train lengths don't matter when distances are much larger than the trains, as in station-to-station problems.

## Speed ratio after crossing

If two trains start towards each other and take t₁ and t₂ hours after meeting to reach their destinations, speed ratio = √t₂ : √t₁, the same result as in general TSD.

## Finding speed from two crossings

~~~
A train passes a man walking at 3 km/h in the same direction in 10 s, and another man walking at 5 km/h in the same direction in 11 s. Find the train's speed.
Length = (v − 3) × 10/3.6 = (v − 5) × 11/3.6 → 10v − 30 = 11v − 55 → v = 25 km/h
~~~

Set the train's length equal in both situations.

## Common mistakes

- forgetting to add the platform's or other train's length
- leaving speeds in km/h while lengths are in metres
- adding speeds for same-direction trains
- adding a person's length

## How interviewers test this

Expect pole and platform crossings, finding length and speed from two crossings, two trains in either direction, trains passing people and passengers timing other trains. Decide what the front must travel to clear the object, choose the right relative speed, and convert km/h to m/s with 5/18.`,
    sources: [KHAN_RATES, OPENSTAX_PREALG],
  },

  "basic-algebra": {
    theory: `Algebra uses letters to represent unknown or varying quantities, letting you state relationships once and solve for whatever's missing. In aptitude tests, algebra turns word problems into equations, simplifies expressions quickly, and lets you test answer options by substitution. This lesson covers variables and expressions, simplifying, exponents, translating words into algebra, and the habits that keep algebra error-free under time pressure.

## Variables, constants and expressions

- a **variable** stands for a number that can change or is unknown: x, y
- a **constant** is a fixed number: 7
- a **term** is a product of numbers and variables: 3x², −5xy
- an **expression** combines terms with + and −: 3x² − 5x + 2
- **coefficients** are the numbers multiplying variables: in 3x², the coefficient is 3

## Like terms

Like terms have the same variables raised to the same powers, and only like terms can be combined:

~~~
4x + 3y − 2x + 5y = 2x + 8y
3x² + 2x − x² = 2x² + 2x
~~~

## Order of operations

Evaluate in the order: brackets, exponents (orders), division and multiplication from left to right, then addition and subtraction from left to right (BODMAS or PEMDAS).

~~~
8 + 2 × (6 − 3)² ÷ 6 = 8 + 2 × 9 ÷ 6 = 8 + 3 = 11
~~~

Simplification questions test this order directly.

## Expanding and factoring

Expanding uses the distributive law, a(b + c) = ab + ac:

~~~
3(2x − 5) = 6x − 15
(x + 3)(x − 2) = x² + x − 6
~~~

Factoring reverses it:

~~~
6x² + 9x = 3x(2x + 3)
x² − 9 = (x + 3)(x − 3)
~~~

The algebraic identities lesson covers standard patterns that speed this up.

## Laws of exponents

| Law | Example |
|---|---|
| aᵐ × aⁿ = aᵐ⁺ⁿ | 2³ × 2⁴ = 2⁷ |
| aᵐ ÷ aⁿ = aᵐ⁻ⁿ | 5⁶ ÷ 5² = 5⁴ |
| (aᵐ)ⁿ = aᵐⁿ | (3²)³ = 3⁶ |
| (ab)ⁿ = aⁿbⁿ | (2x)³ = 8x³ |
| a⁰ = 1 (a ≠ 0) | 7⁰ = 1 |
| a⁻ⁿ = 1/aⁿ | 2⁻³ = 1/8 |
| a^(1/n) = ⁿ√a | 27^(1/3) = 3 |

~~~
Solve 2^(x + 1) = 32. 32 = 2⁵ → x + 1 = 5 → x = 4
~~~

Rewriting both sides with the same base is the standard method for exponential equations.

## Surds

Square roots that aren't whole numbers are **surds**: √2, √3. Simplify by extracting perfect squares: √72 = √(36 × 2) = 6√2. Rationalize denominators by multiplying by the conjugate:

~~~
1/(√5 − √3) = (√5 + √3)/(5 − 3) = (√5 + √3)/2
~~~

## Translating words into algebra

| Words | Algebra |
|---|---|
| 5 more than x | x + 5 |
| 3 less than twice a number | 2n − 3 |
| the product of two consecutive integers | n(n + 1) |
| a number exceeds another by 7 | a = b + 7 |
| the sum of a number and its reciprocal | x + 1/x |
| x is 20% more than y | x = 1.2y |

Defining the unknown clearly ("let x be the number of pens") prevents most errors in word problems.

## Substitution to check options

Many multiple-choice algebra questions can be answered by substituting each option back into the original condition. When asked for an expression's value under a condition, choosing convenient numbers that satisfy the condition (for example x = 1 or y = 0) often reveals the answer in seconds. Check the result with a second set of numbers to avoid coincidences.

## Inequalities

Inequalities behave like equations, except that multiplying or dividing by a negative number reverses the sign:

~~~
−3x > 12 → x < −4
~~~

## Absolute value

|x| is the distance of x from zero: |−5| = 5. |x − 3| < 2 means 1 < x < 5.

## Common mistakes

- combining unlike terms (3x + 2x² isn't 5x³)
- sign errors when expanding a negative: −(x − 4) = −x + 4
- adding exponents when multiplying different bases
- forgetting to flip an inequality when multiplying by a negative

## How interviewers test this

Expect simplification using order of operations, exponent equations, surd simplification, translating word problems and quick value-finding using substitution. Combine only like terms, rewrite exponents to a common base, rationalize with conjugates, and test options by substitution when it's faster.`,
    sources: [OPENSTAX_ELEM_ALG, KHAN_ALG1],
  },

  "linear-equations": {
    theory: `A linear equation involves variables raised only to the first power, such as 3x + 5 = 20 or 2x + 3y = 12. Most aptitude word problems, from ages to coins to mixtures, reduce to one or two linear equations. Solving them quickly and setting them up correctly from words are the core skills. This lesson covers one-variable equations, systems of two equations, elimination and substitution, consistency conditions and classic word problems.

## One variable

Isolate the variable by doing the same operation to both sides:

~~~
5x − 7 = 3x + 9
5x − 3x = 9 + 7
2x = 16 → x = 8
~~~

With fractions, multiply through by the LCM of the denominators:

~~~
x/3 + x/4 = 14 → 4x + 3x = 168 → x = 24
~~~

## Two variables: substitution

Solve one equation for a variable and substitute into the other:

~~~
x + y = 20, x − y = 6
From the first: x = 20 − y → 20 − y − y = 6 → y = 7, x = 13
~~~

## Two variables: elimination

Add or subtract equations to remove a variable:

~~~
3x + 2y = 16
5x − 2y = 8
Add: 8x = 24 → x = 3 → y = 3.5
~~~

Multiply equations first if needed so a variable's coefficients match:

~~~
2x + 3y = 13
3x + 2y = 12
Multiply the first by 3, the second by 2: 6x + 9y = 39, 6x + 4y = 24
Subtract: 5y = 15 → y = 3, x = 2
~~~

Shortcut for symmetric systems: adding gives 5x + 5y = 25, so x + y = 5; subtracting gives −x + y = 1. Then x = 2 and y = 3 immediately.

## Number of solutions

For a₁x + b₁y = c₁ and a₂x + b₂y = c₂:

| Condition | Solutions | Lines |
|---|---|---|
| a₁/a₂ ≠ b₁/b₂ | Exactly one | Intersecting |
| a₁/a₂ = b₁/b₂ ≠ c₁/c₂ | None | Parallel |
| a₁/a₂ = b₁/b₂ = c₁/c₂ | Infinitely many | Same line |

~~~
For what k does 2x + 3y = 5 and 4x + ky = 10 have infinitely many solutions?
2/4 = 3/k = 5/10 → k = 6
~~~

## Graphical meaning

A linear equation in two variables is a straight line. y = mx + c has slope m and y-intercept c. The solution of a system is where the lines meet. Questions sometimes ask for the slope through two points: m = (y₂ − y₁)/(x₂ − x₁).

## Word problems: ages

~~~
A father is 4 times as old as his son. In 20 years, he will be twice as old. Present ages?
Son = x, father = 4x → 4x + 20 = 2(x + 20) → 2x = 20 → x = 10
Son 10, father 40
~~~

The age difference never changes, a useful check: 30 years now and in 20 years.

## Word problems: numbers and digits

~~~
The sum of a two-digit number's digits is 9. Reversing the digits increases the number by 27. Find it.
Number = 10a + b, a + b = 9, (10b + a) − (10a + b) = 27 → b − a = 3
a = 3, b = 6 → 36
~~~

A two-digit number with tens digit a and units digit b is 10a + b, not ab.

## Word problems: coins and tickets

~~~
A purse has 50 coins of 2 and 5 rupees worth 160 rupees. How many of each?
x + y = 50, 2x + 5y = 160 → 2x + 5(50 − x) = 160 → 3x = 90 → x = 30 two-rupee coins, 20 five-rupee coins
~~~

## Word problems: fractions

~~~
If 1 is added to the numerator of a fraction it becomes 1/2; if 1 is subtracted from the denominator it becomes 1/3. Find the fraction.
(x + 1)/y = 1/2 → 2x + 2 = y; x/(y − 1) = 1/3 → 3x = y − 1
2x + 2 = 3x + 1 → x = 1, y = 4 → 1/4
~~~

## Three variables

Eliminate one variable using two pairs of equations, reducing to a two-variable system. Aptitude tests often design such systems so that adding all equations gives x + y + z directly.

## Setting up equations well

1. define each unknown precisely, with units
2. write one equation per independent fact
3. check that the number of equations equals the number of unknowns
4. verify the answer against the original words, not your equations

## How interviewers test this

Expect one-variable equations with fractions, two-variable systems, consistency conditions, and age, digit, coin and fraction word problems. Use elimination for symmetric coefficients, substitution when one variable is isolated, the ratio test for the number of solutions, and always verify against the original statement.`,
    sources: [OPENSTAX_ELEM_ALG, KHAN_ALG1],
  },

  "quadratic-equations": {
    theory: `A quadratic equation has the form ax² + bx + c = 0 with a ≠ 0. Quadratics model areas, projectile heights, products of consecutive numbers and many "find two numbers" problems. Aptitude tests ask you to solve them, compare their roots, use sums and products of roots, and judge the nature of roots from the discriminant. This lesson covers factoring, the quadratic formula, the discriminant, root relationships and root-comparison questions.

## Factoring

Find two numbers whose product is ac and sum is b, then split the middle term:

~~~
x² − 5x + 6 = 0 → numbers −2 and −3 → (x − 2)(x − 3) = 0 → x = 2 or 3
~~~

~~~
2x² + 7x + 3 = 0 → ac = 6, numbers 6 and 1
2x² + 6x + x + 3 = 2x(x + 3) + 1(x + 3) = (2x + 1)(x + 3) → x = −1/2 or −3
~~~

## The quadratic formula

When factoring isn't obvious:

~~~
x = (−b ± √(b² − 4ac)) ÷ 2a
~~~

~~~
x² − 4x − 1 = 0 → x = (4 ± √20)/2 = 2 ± √5
~~~

## The discriminant

D = b² − 4ac decides the nature of the roots:

| D | Roots |
|---|---|
| D > 0, a perfect square (with rational coefficients) | Two distinct rational roots |
| D > 0, not a perfect square | Two distinct irrational roots |
| D = 0 | Two equal real roots, x = −b/2a |
| D < 0 | No real roots (complex roots) |

~~~
For what k does x² + kx + 9 = 0 have equal roots?
k² − 36 = 0 → k = ±6
~~~

## Sum and product of roots

For roots α and β of ax² + bx + c = 0:

~~~
α + β = −b/a
αβ = c/a
~~~

These give many results without finding the roots:

- α² + β² = (α + β)² − 2αβ
- 1/α + 1/β = (α + β)/αβ
- (α − β)² = (α + β)² − 4αβ

~~~
For x² − 7x + 10 = 0: α + β = 7, αβ = 10
α² + β² = 49 − 20 = 29
~~~

## Forming an equation from roots

If the roots are p and q, the equation is x² − (p + q)x + pq = 0. With roots 3 and −5: x² + 2x − 15 = 0.

## Signs of roots

- if c/a < 0, the roots have opposite signs
- if c/a > 0 and −b/a > 0, both roots are positive
- if c/a > 0 and −b/a < 0, both roots are negative

These let you judge roots from coefficients alone.

## Comparing roots of two equations

Bank and placement tests often give two quadratics in x and y and ask for the relationship (x > y, x ≥ y, x < y, x ≤ y, or no relationship).

~~~
I. x² − 7x + 12 = 0 → x = 3, 4
II. y² − 3y + 2 = 0 → y = 1, 2
Every x exceeds every y → x > y
~~~

Method:

1. solve both equations
2. compare every x with every y
3. if all comparisons agree, state the relation; if equality occurs, use ≥ or ≤; if they conflict, there's no definite relationship

Sign shortcut for factorable quadratics: in x² + bx + c with integer roots, the signs of b and c predict root signs, which speeds up comparison.

## Word problems

~~~
The product of two consecutive positive integers is 132. Find them.
n(n + 1) = 132 → n² + n − 132 = 0 → (n + 12)(n − 11) = 0 → n = 11 → 11 and 12
~~~

~~~
A rectangle's length is 3 m more than its width, and its area is 70 m². Dimensions?
w(w + 3) = 70 → w² + 3w − 70 = 0 → (w + 10)(w − 7) = 0 → w = 7, length 10
~~~

Reject negative solutions when the quantity must be positive, such as lengths, ages and counts.

## Equations reducible to quadratics

- **x⁴ − 13x² + 36 = 0**: substitute u = x² → u² − 13u + 36 = 0 → u = 4, 9 → x = ±2, ±3
- **x + 1/x = 5/2**: multiply by x → 2x² − 5x + 2 = 0 → x = 2 or 1/2

## Maximum and minimum

The graph of y = ax² + bx + c is a parabola with its vertex at x = −b/2a. If a > 0, the vertex is a minimum; if a < 0, a maximum. A quick result: for a fixed sum, the product of two numbers is largest when they're equal.

## Common mistakes

- forgetting the ± in the formula
- sign errors with −b, especially when b is negative
- dividing both sides by x and losing the root x = 0
- keeping negative roots for physical quantities

## How interviewers test this

Expect solving by factoring or formula, discriminant conditions, sum and product identities, forming equations from roots, comparing roots of two quadratics, and area or consecutive-number word problems. Factor first, use −b/a and c/a to avoid solving, and compare every root pair in comparison questions.`,
    sources: [WIKI_QUADRATIC, OPENSTAX_COLLEGE_ALG],
  },

  "algebraic-identities": {
    theory: `Algebraic identities are equations that hold for every value of their variables, such as (a + b)² = a² + 2ab + b². They let you expand, factor and evaluate expressions far faster than brute-force multiplication, which matters when a test gives you 40 seconds per question. This lesson covers the essential square and cube identities, factoring patterns, the identities for a³ + b³ + c³, and the evaluation tricks built on them.

## Square identities

| Identity | Example |
|---|---|
| (a + b)² = a² + 2ab + b² | 103² = 10,000 + 600 + 9 = 10,609 |
| (a − b)² = a² − 2ab + b² | 98² = 10,000 − 400 + 4 = 9,604 |
| a² − b² = (a + b)(a − b) | 47 × 53 = 50² − 3² = 2,491 |
| (a + b)² + (a − b)² = 2(a² + b²) | |
| (a + b)² − (a − b)² = 4ab | |

The first three make mental multiplication of numbers near round values fast.

## Cube identities

~~~
(a + b)³ = a³ + b³ + 3ab(a + b)
(a − b)³ = a³ − b³ − 3ab(a − b)
a³ + b³ = (a + b)(a² − ab + b²)
a³ − b³ = (a − b)(a² + ab + b²)
~~~

~~~
Simplify (0.7³ + 0.3³) ÷ (0.7² − 0.7 × 0.3 + 0.3²)
Using a³ + b³ = (a + b)(a² − ab + b²): answer = 0.7 + 0.3 = 1
~~~

Spotting the pattern turns an ugly calculation into one step.

## Three-variable identities

~~~
(a + b + c)² = a² + b² + c² + 2(ab + bc + ca)
a³ + b³ + c³ − 3abc = (a + b + c)(a² + b² + c² − ab − bc − ca)
~~~

A key consequence: **if a + b + c = 0, then a³ + b³ + c³ = 3abc**.

~~~
Find (x − y)³ + (y − z)³ + (z − x)³.
The three terms sum to 0 → the expression = 3(x − y)(y − z)(z − x)
~~~

## Using x + 1/x

A frequent question family gives x + 1/x and asks for powers:

~~~
If x + 1/x = 4:
x² + 1/x² = (x + 1/x)² − 2 = 14
x³ + 1/x³ = (x + 1/x)³ − 3(x + 1/x) = 64 − 12 = 52
x⁴ + 1/x⁴ = (x² + 1/x²)² − 2 = 194
~~~

Similarly, if x − 1/x = k, then x² + 1/x² = k² + 2.

## Evaluating with sum and product

If a + b and ab are known, many expressions follow:

~~~
a + b = 7, ab = 10
a² + b² = 49 − 20 = 29
(a − b)² = 49 − 40 = 9 → a − b = ±3
a³ + b³ = 343 − 3 × 10 × 7 = 133
~~~

## Factoring patterns

- common factor: 6x²y − 9xy² = 3xy(2x − 3y)
- difference of squares: 16x² − 25 = (4x − 5)(4x + 5)
- perfect square trinomial: x² + 10x + 25 = (x + 5)²
- grouping: ax + ay + bx + by = (a + b)(x + y)
- sum or difference of cubes: 8x³ − 27 = (2x − 3)(4x² + 6x + 9)

## Numerical tricks

- squares ending in 5: 85² = 8 × 9 followed by 25 = 7,225
- products symmetric about a round number: 104 × 96 = 100² − 4² = 9,984
- 999² = (1000 − 1)² = 998,001

## Simplification questions

Tests often present expressions like:

~~~
(a² − b²)/(a + b) + (a³ + b³)/(a² − ab + b²) = (a − b) + (a + b) = 2a
~~~

Recognizing each fraction as an identity cancels everything quickly. When stuck, substituting small numbers (a = 2, b = 1) and checking options is a reliable fallback.

## Proving an identity versus solving an equation

An **equation** like x² = 9 is true only for some values (x = ±3). An **identity** like (x + 1)² = x² + 2x + 1 is true for all values. To test a claimed identity quickly, substitute two or three different values; one failure disproves it.

## Common mistakes

- writing (a + b)² as a² + b²
- missing the middle term sign in (a − b)²
- confusing a³ + b³ with (a + b)³
- forgetting the ± when taking the square root of (a − b)²

## How interviewers test this

Expect fast squaring and multiplication, cube-sum simplifications, x + 1/x power problems, a + b + c = 0 tricks and fraction simplifications that collapse via identities. Memorize the square and cube identities, look for structure before calculating, and verify by substituting small numbers.`,
    sources: [OPENSTAX_ELEM_ALG, KHAN_ALG1],
  },

  "progressions": {
    theory: `A progression is a sequence of numbers following a fixed rule. The two main types are **arithmetic progressions** (AP), which add a constant each step, and **geometric progressions** (GP), which multiply by a constant. Progressions appear directly in aptitude tests and inside problems about savings, salaries, seating, depreciation and number series. This lesson covers nth terms, sums, means, infinite geometric series and recognizing which type a problem uses.

## Arithmetic progression

Each term differs from the previous by a constant **common difference** d: 3, 7, 11, 15, ... (d = 4).

~~~
nth term: aₙ = a + (n − 1)d
Sum of n terms: Sₙ = n/2 × [2a + (n − 1)d] = n/2 × (first + last)
~~~

~~~
20th term of 3, 7, 11, ...: 3 + 19 × 4 = 79
Sum of the first 20 terms: 20/2 × (3 + 79) = 820
~~~

## Useful AP results

- number of terms from a to l with difference d: (l − a)/d + 1
- sum of the first n natural numbers: n(n + 1)/2
- sum of the first n odd numbers: n²
- sum of the first n even numbers: n(n + 1)
- three numbers in AP can be written a − d, a, a + d, which simplifies many problems

~~~
How many three-digit numbers are divisible by 7?
First 105, last 994 → (994 − 105)/7 + 1 = 128
~~~

~~~
Three numbers in AP sum to 27 and their product is 504. Find them.
a − d + a + a + d = 27 → a = 9; (9 − d)(9)(9 + d) = 504 → 81 − d² = 56 → d = 5
Numbers: 4, 9, 14
~~~

## Arithmetic mean

The arithmetic mean of a and b is (a + b)/2. Inserting n arithmetic means between a and b gives an AP with n + 2 terms and d = (b − a)/(n + 1).

## Geometric progression

Each term is the previous times a constant **common ratio** r: 2, 6, 18, 54, ... (r = 3).

~~~
nth term: aₙ = a × r^(n − 1)
Sum of n terms: Sₙ = a(rⁿ − 1)/(r − 1) for r ≠ 1
~~~

~~~
8th term of 2, 6, 18, ...: 2 × 3⁷ = 4,374
Sum of the first 6 terms: 2(3⁶ − 1)/2 = 728
~~~

## Infinite geometric series

When |r| < 1, terms shrink towards zero and the infinite sum converges:

~~~
S∞ = a/(1 − r)
~~~

~~~
1 + 1/2 + 1/4 + 1/8 + ... = 1/(1 − 1/2) = 2
~~~

A classic application: a ball dropped from 10 m rebounds to 3/5 of its height each time. Total distance = 10 + 2 × (6 + 3.6 + ...) = 10 + 2 × 6/(1 − 3/5) = 10 + 30 = 40 m.

## Geometric mean

The geometric mean of a and b is √(ab). For positive numbers, AM ≥ GM, with equality only when a = b. This inequality explains why, for a fixed sum, the product of two numbers is largest when they're equal.

## Harmonic progression

A sequence is a **harmonic progression** (HP) if the reciprocals form an AP: 1, 1/2, 1/3, 1/4, ... The harmonic mean of a and b is 2ab/(a + b), which is exactly the formula for average speed over equal distances. For positive a and b: AM ≥ GM ≥ HM.

## Recognizing the type

| Clue | Progression |
|---|---|
| Constant amount added (salary rises by a fixed sum) | AP |
| Constant percentage growth or decay (compound interest, depreciation) | GP |
| Constant difference between differences | Second-order series (see number series) |

~~~
A salary starts at 30,000 and increases by 2,000 each year. Total earnings over 10 years?
AP: S = 10/2 × [60,000 + 9 × 2,000] = 5 × 78,000 = 3,90,000
~~~

## Common mistakes

- using n instead of n − 1 in the nth term formula
- forgetting the +1 when counting terms
- applying S∞ when |r| ≥ 1, where the series doesn't converge
- treating percentage growth as an AP

## How interviewers test this

Expect nth terms and sums of APs and GPs, counting terms in a range, three-numbers-in-AP problems, infinite series such as bouncing balls, means, and word problems on salaries or savings. Identify the type from the rule, use the n − 1 exponent or multiplier, and check convergence before using S∞.`,
    sources: [WIKI_AP, WIKI_GP],
  },
};
