// Long-form theory for Quantitative Aptitude: counting, probability, geometry, mensuration and data interpretation basics. Original writing.
import { LessonTheory } from './utils';

const OPENSTAX_CONTEMP = { title: "OpenStax: Contemporary Mathematics (free textbook, counting and probability chapters)", url: "https://openstax.org/details/books/contemporary-mathematics" };
const KHAN_PROB = { title: "Khan Academy: Statistics and probability", url: "https://www.khanacademy.org/math/statistics-probability" };
const KHAN_COUNTING = { title: "Khan Academy: Counting, permutations, and combinations", url: "https://www.khanacademy.org/math/statistics-probability/counting-permutations-and-combinations" };
const OPENSTAX_STATS = { title: "OpenStax: Introductory Statistics 2e (free textbook)", url: "https://openstax.org/details/books/introductory-statistics-2e" };
const KHAN_GEOMETRY = { title: "Khan Academy: Geometry", url: "https://www.khanacademy.org/math/geometry" };
const OPENSTAX_PREALG = { title: "OpenStax: Prealgebra 2e (free textbook, geometry chapter)", url: "https://openstax.org/details/books/prealgebra-2e" };
const WIKI_PERM = { title: "Wikipedia: Permutation", url: "https://en.wikipedia.org/wiki/Permutation" };
const WIKI_AREA = { title: "Wikipedia: Area (list of formulas)", url: "https://en.wikipedia.org/wiki/Area" };

export const aptQuantAdvancedTheory: Record<string, LessonTheory> = {
  "permutations": {
    theory: `A permutation is an arrangement of objects where **order matters**. Counting arrangements, of people in a row, letters in a word, digits in a number or runners in the top three, is a staple of aptitude tests. The skill is translating a situation into the right counting rule and handling restrictions such as "together", "never together" and repeated letters. This lesson covers the counting principle, factorials, nPr, repetitions, circular arrangements and restricted arrangements.

## The fundamental counting principle

If one choice can be made in m ways and a second, independent choice in n ways, the pair can be made in m × n ways.

~~~
Outfits from 4 shirts and 3 trousers: 4 × 3 = 12
~~~

This **multiplication rule** applies to sequences of choices. When choices are alternatives (one or the other), use the **addition rule**: m + n.

## Factorials

n! = n × (n − 1) × ... × 2 × 1, with 0! = 1. The number of ways to arrange n distinct objects in a row is n!.

~~~
Ways to arrange 5 books on a shelf: 5! = 120
~~~

## Arranging r out of n: nPr

~~~
nPr = n! ÷ (n − r)!
~~~

~~~
Gold, silver and bronze among 8 runners: 8P3 = 8 × 7 × 6 = 336
~~~

Think of filling slots: 8 choices for first, 7 for second, 6 for third.

## Repeated objects

When some objects are identical, divide by the factorial of each repetition count:

~~~
Arrangements of the letters of BANANA: 6! ÷ (3! × 2!) = 720 ÷ 12 = 60
(three As and two Ns)
~~~

## Repetition allowed

If each of r positions can use any of n objects, with repetition, there are n^r arrangements.

~~~
4-digit PINs using digits 0 to 9: 10⁴ = 10,000
~~~

## Forming numbers

~~~
How many 3-digit numbers can be formed from 0, 1, 2, 3, 4 without repetition?
Hundreds place can't be 0: 4 choices; tens: 4; units: 3 → 48
~~~

Always fill the most restricted position first. For even numbers, fix the units digit first and split into cases when 0 is involved.

~~~
3-digit even numbers from 0, 1, 2, 3, 4 without repetition:
Units = 0: 4 × 3 = 12. Units = 2 or 4: hundreds has 3 choices (not 0, not the units digit), tens 3 → 2 × 9 = 18. Total 30
~~~

## Objects always together

Treat the group as a single unit, arrange the units, then arrange inside the group:

~~~
Arrange 6 people in a row with A and B together:
5 units → 5! = 120; A and B swap → × 2 = 240
~~~

## Objects never together

Subtract the "together" count from the total:

~~~
6 people, A and B never together: 720 − 240 = 480
~~~

For several objects that must all be apart, use the **gap method**: arrange the others first, then place the restricted objects in the gaps.

~~~
Arrange the letters of LEADING so that no two vowels are adjacent:
Consonants L, D, N, G: 4! = 24 ways, creating 5 gaps
Choose and arrange 3 vowels (E, A, I) in 5 gaps: 5P3 = 60
Total: 24 × 60 = 1,440
~~~

Note the difference: "vowels never all together" (subtract the together case) differs from "no two vowels adjacent" (gap method).

## Circular arrangements

In a circle, rotations are the same arrangement, so n distinct objects can be arranged in (n − 1)! ways.

~~~
7 people around a round table: 6! = 720
~~~

If clockwise and anticlockwise are the same (beads on a necklace, keys on a ring), divide by 2: (n − 1)!/2.

## Words and dictionary rank

~~~
Rank of the word CAT among arrangements of its letters in dictionary order:
Letters sorted: A, C, T. Words starting with A: 2! = 2
Then C: CAT is the first word starting with CA → rank 3
~~~

For longer words, count words beginning with each smaller letter at each position, then add 1.

## Common mistakes

- using permutations when order doesn't matter (use combinations)
- forgetting to divide by repetitions of identical objects
- placing 0 in the leading position of a number
- forgetting the internal arrangement of a grouped unit
- using n! instead of (n − 1)! for circles

## How interviewers test this

Expect arranging people or letters, numbers formed from digits, repeated letters, together and never-together conditions, circular seating and dictionary ranks. Decide whether order matters, fill restricted positions first, divide out repetitions, use grouping or gaps for adjacency rules, and use (n − 1)! for circles.`,
    sources: [KHAN_COUNTING, WIKI_PERM],
  },

  "combinations": {
    theory: `A combination is a selection of objects where **order doesn't matter**. Choosing a committee, a team, a hand of cards or a set of questions to answer are combination problems. The difference from permutations is the single most important decision in counting questions. This lesson covers nCr, its properties, selections with conditions, "at least" problems, grouping and distributing, and geometric counting.

## nCr

~~~
nCr = n! ÷ (r! × (n − r)!)
~~~

~~~
Choose 3 students from 10 for a committee: 10C3 = 120
~~~

The relationship with permutations: nPr = nCr × r!, because each selection of r objects can be ordered in r! ways.

## Order matters or not?

| Situation | Order matters? | Use |
|---|---|---|
| President, secretary, treasurer from 10 | Yes, roles differ | 10P3 = 720 |
| A 3-member committee from 10 | No | 10C3 = 120 |
| Arranging books on a shelf | Yes | Permutation |
| Choosing books to take on holiday | No | Combination |
| Handshakes among n people | No | nC2 |

Ask: if I swap two chosen items, is it a different outcome? If yes, permutation; if no, combination.

## Properties

- nC0 = nCn = 1
- nCr = nC(n − r): choosing r to include is the same as choosing n − r to exclude, so 20C18 = 20C2 = 190
- nCr + nC(r − 1) = (n + 1)Cr
- nC0 + nC1 + ... + nCn = 2ⁿ: the total number of subsets

## Selections with conditions

~~~
Choose 5 from 6 men and 4 women with exactly 2 women:
4C2 × 6C3 = 6 × 20 = 120
~~~

Multiply the ways for each group when the selection is split into parts.

## "At least" and "at most"

Either add the valid cases or subtract the invalid ones from the total:

~~~
A committee of 4 from 5 men and 3 women with at least 1 woman:
Total 8C4 = 70; no women 5C4 = 5 → 65
~~~

The complement method is usually faster for "at least one".

## Particular objects included or excluded

- a particular object always included: choose the remaining r − 1 from n − 1: (n − 1)C(r − 1)
- a particular object always excluded: (n − 1)Cr

~~~
Choose 5 players from 12 so that the captain is always included: 11C4 = 330
~~~

## Handshakes, lines and polygons

- handshakes among n people: nC2
- lines through n points, no three collinear: nC2
- triangles from n points, no three collinear: nC3
- diagonals of an n-sided polygon: nC2 − n = n(n − 3)/2

~~~
Diagonals of a decagon: 10 × 7 ÷ 2 = 35
~~~

If some points are collinear, subtract the selections that fall on a straight line: with 10 points of which 4 are collinear, triangles = 10C3 − 4C3 = 120 − 4 = 116.

## Selecting at least one from n

The number of non-empty selections from n distinct objects is 2ⁿ − 1, since each object is either chosen or not.

~~~
A person has 5 friends. In how many ways can they invite one or more of them to dinner? 2⁵ − 1 = 31
~~~

## Dividing into groups

~~~
Divide 6 people into 2 groups of 3:
6C3 ÷ 2! = 20 ÷ 2 = 10
~~~

Divide by the factorial of the number of equal-sized groups, because swapping identical-sized groups doesn't create a new division. If groups are labelled (team A, team B), don't divide.

## Distributing identical objects

The number of ways to distribute n identical objects among r people is (n + r − 1)C(r − 1), the **stars and bars** method. If each person must get at least one: (n − 1)C(r − 1).

~~~
Distribute 10 identical chocolates among 3 children, each getting at least one:
9C2 = 36
~~~

## Selection then arrangement

Some problems select then arrange:

~~~
Form 4-letter words using 2 vowels from 5 and 2 consonants from 6, all distinct:
5C2 × 6C2 × 4! = 10 × 15 × 24 = 3,600
~~~

## Common mistakes

- using permutations for committees
- not dividing by group symmetry when groups are unlabelled
- adding instead of multiplying when selecting from two groups
- forgetting collinear points when counting triangles

## How interviewers test this

Expect committee selections with gender or member conditions, "at least" problems, handshakes and diagonals, triangles from points, group divisions and distributions. Decide whether order matters, multiply across independent groups, use complements for "at least one", and divide by symmetry for identical groups.`,
    sources: [KHAN_COUNTING, OPENSTAX_CONTEMP],
  },

  "probability": {
    theory: `Probability measures how likely an event is, on a scale from 0 (impossible) to 1 (certain). Aptitude tests ask probability questions about coins, dice, cards, balls drawn from bags and people selected from groups. Almost all of them reduce to counting favourable outcomes and total outcomes, using the counting tools from the previous lessons. This lesson covers the definition, complements, addition and multiplication rules, independent and dependent events, and the standard experiments.

## The classical definition

When all outcomes are equally likely:

~~~
P(event) = Number of favourable outcomes ÷ Total number of outcomes
~~~

~~~
Probability of rolling a number greater than 4 on a die: 2/6 = 1/3
~~~

The set of all outcomes is the **sample space**.

## Standard sample spaces

| Experiment | Outcomes |
|---|---|
| One coin | 2 |
| n coins | 2ⁿ |
| One die | 6 |
| Two dice | 36 |
| A standard deck | 52 cards: 4 suits of 13; 26 red, 26 black; 12 face cards (J, Q, K) |

## Complement rule

~~~
P(not A) = 1 − P(A)
~~~

"At least one" problems are almost always fastest through the complement:

~~~
Probability of at least one head in 3 coin tosses:
1 − P(no heads) = 1 − 1/8 = 7/8
~~~

## Addition rule

For events A or B:

~~~
P(A or B) = P(A) + P(B) − P(A and B)
~~~

~~~
A card is drawn. Probability it's a king or a heart:
4/52 + 13/52 − 1/52 = 16/52 = 4/13
~~~

For **mutually exclusive** events (can't both happen), P(A and B) = 0, so probabilities add directly.

## Multiplication rule

For **independent** events (one doesn't affect the other):

~~~
P(A and B) = P(A) × P(B)
~~~

~~~
Probability of two sixes when rolling two dice: 1/6 × 1/6 = 1/36
~~~

For **dependent** events, multiply by the conditional probability:

~~~
Two cards drawn without replacement, both aces:
4/52 × 3/51 = 1/221
~~~

## With and without replacement

~~~
A bag has 5 red and 3 blue balls. Two are drawn.
With replacement, both red: 5/8 × 5/8 = 25/64
Without replacement, both red: 5/8 × 4/7 = 20/56 = 5/14
Or with combinations: 5C2 ÷ 8C2 = 10/28 = 5/14
~~~

Combinations are often the cleanest method for drawing several items at once.

## Two dice

Know the sums: there are 6 ways to make 7 (the most likely sum), 5 ways each for 6 and 8, down to 1 way each for 2 and 12.

~~~
Probability the sum of two dice is 8: 5/36
Probability of a doublet: 6/36 = 1/6
~~~

## Cards

~~~
Probability a card is a face card or red:
12/52 + 26/52 − 6/52 = 32/52 = 8/13
~~~

The overlap (red face cards) is 6. Many card mistakes come from forgetting overlaps.

## Odds

Odds in favour of A = P(A) : P(not A). If odds in favour are 3 : 5, then P(A) = 3/8.

## Conditional probability

~~~
P(A given B) = P(A and B) ÷ P(B)
~~~

~~~
Two dice are rolled and the sum is 8. Probability one die shows 3?
Sum 8 outcomes: (2,6), (3,5), (4,4), (5,3), (6,2) → 2 contain a 3 → 2/5
~~~

The condition shrinks the sample space to the outcomes where B happened.

## Independent trials

The probability of exactly k successes in n independent trials, each with success probability p:

~~~
nCk × p^k × (1 − p)^(n − k)
~~~

~~~
Exactly 2 heads in 4 tosses: 4C2 × (1/2)⁴ = 6/16 = 3/8
~~~

## Problems with people or letters

Combine counting with probability:

~~~
5 people sit randomly in a row. Probability two particular people sit together?
Together: 4! × 2 = 48; total 5! = 120 → 2/5
~~~

## Common mistakes

- treating dependent draws as independent
- forgetting the overlap in "or" problems
- confusing "at least one" with "exactly one"
- assuming outcomes are equally likely when they aren't (sums of two dice)

## How interviewers test this

Expect coins, dice, cards, balls from bags, at-least-one problems, conditional probability and seating arrangements. Define the sample space, count favourable outcomes with combinations, use complements for "at least", and subtract overlaps for "or".`,
    sources: [KHAN_PROB, OPENSTAX_STATS],
  },

  "geometry": {
    theory: `Geometry in aptitude tests focuses on lines, angles, triangles, quadrilaterals and circles: their properties, angle relationships, similarity and the Pythagorean theorem. Questions reward knowing the right property rather than long calculation. This lesson covers angle rules, triangle properties and centres, congruence and similarity, Pythagorean triples, quadrilaterals, polygons and circle theorems.

## Lines and angles

- angles on a straight line sum to 180°
- angles around a point sum to 360°
- vertically opposite angles are equal
- complementary angles sum to 90°; supplementary angles sum to 180°

With a transversal crossing two **parallel lines**:

- corresponding angles are equal
- alternate interior angles are equal
- co-interior (same-side interior) angles sum to 180°

## Triangles

- angles sum to 180°
- an exterior angle equals the sum of the two opposite interior angles
- the sum of any two sides exceeds the third (**triangle inequality**)
- the largest angle is opposite the longest side

~~~
Can sides 3, 4 and 8 form a triangle? 3 + 4 = 7 < 8 → no
~~~

Types by sides: equilateral (all equal, all angles 60°), isosceles (two equal sides, equal base angles), scalene. Types by angles: acute, right, obtuse.

## Pythagorean theorem

In a right triangle with hypotenuse c: a² + b² = c².

Common **Pythagorean triples**: (3, 4, 5), (5, 12, 13), (8, 15, 17), (7, 24, 25), and their multiples such as (6, 8, 10). Recognizing triples saves calculation.

Tests on angle type from sides: if c² < a² + b², the triangle is acute; if c² > a² + b², obtuse (c the longest side).

## Special right triangles

- 45°-45°-90°: sides in the ratio 1 : 1 : √2
- 30°-60°-90°: sides in the ratio 1 : √3 : 2

## Triangle centres

| Centre | Meeting point of | Property |
|---|---|---|
| Centroid | Medians | Divides each median 2 : 1 from the vertex |
| Incentre | Angle bisectors | Centre of the inscribed circle |
| Circumcentre | Perpendicular bisectors | Centre of the circumscribed circle; at the hypotenuse's midpoint in a right triangle |
| Orthocentre | Altitudes | At the right-angle vertex in a right triangle |

In an equilateral triangle, all four coincide.

## Congruence and similarity

**Congruent** triangles are identical in shape and size (tests: SSS, SAS, ASA, RHS). **Similar** triangles have equal angles and proportional sides (tests: AA, SAS similarity, SSS similarity).

For similar triangles with side ratio k:

- corresponding heights, medians and perimeters are in ratio k
- areas are in ratio k²

~~~
Two similar triangles have areas 81 and 49. Ratio of corresponding sides? √81 : √49 = 9 : 7
~~~

The **basic proportionality theorem**: a line parallel to one side of a triangle divides the other two sides proportionally.

## Quadrilaterals

- interior angles sum to 360°
- **parallelogram**: opposite sides equal and parallel, opposite angles equal, diagonals bisect each other
- **rectangle**: a parallelogram with right angles; diagonals equal
- **rhombus**: all sides equal; diagonals bisect each other at right angles
- **square**: rectangle and rhombus together
- **trapezium**: one pair of parallel sides

## Polygons

For a polygon with n sides:

- sum of interior angles = (n − 2) × 180°
- each interior angle of a regular polygon = (n − 2) × 180° ÷ n
- sum of exterior angles = 360°, so each exterior angle of a regular polygon = 360°/n

~~~
Each interior angle of a regular polygon is 140°. Number of sides?
Exterior angle = 40° → n = 360/40 = 9
~~~

## Circles

- the angle at the centre is twice the angle at the circumference on the same arc
- angles in the same segment are equal
- the angle in a semicircle is 90°
- opposite angles of a cyclic quadrilateral sum to 180°
- a tangent is perpendicular to the radius at the point of contact
- two tangents from an external point are equal in length
- a perpendicular from the centre bisects a chord

~~~
A chord of length 16 cm is 6 cm from the centre. Radius?
Half chord 8 and distance 6 form a right triangle → r = 10 cm
~~~

## Coordinate geometry basics

- distance between (x₁, y₁) and (x₂, y₂): √((x₂ − x₁)² + (y₂ − y₁)²)
- midpoint: ((x₁ + x₂)/2, (y₁ + y₂)/2)
- slope: (y₂ − y₁)/(x₂ − x₁)

## How interviewers test this

Expect angle chasing with parallel lines, triangle inequality, Pythagorean triples, similar-triangle ratios, polygon angle counts and circle theorems such as chord distances and tangents. Draw a quick sketch, mark known angles, and reach for the property that connects the given and the unknown.`,
    sources: [KHAN_GEOMETRY, OPENSTAX_PREALG],
  },

  "mensuration": {
    theory: `Mensuration is the measurement of lengths, areas and volumes of geometric shapes. Aptitude questions ask for the area of a field, the cost of painting walls, the volume of water in a tank, the number of small cubes cut from a big one, or the effect on area when dimensions change. Memorizing formulas is necessary but not enough; problems often combine shapes or change dimensions by percentages. This lesson covers 2D areas and perimeters, 3D surface areas and volumes, unit conversions and scaling.

## Two-dimensional shapes

| Shape | Area | Perimeter |
|---|---|---|
| Rectangle (l × b) | l × b | 2(l + b) |
| Square (side a) | a² | 4a |
| Triangle | ½ × base × height | Sum of sides |
| Equilateral triangle (side a) | (√3/4) a² | 3a |
| Parallelogram | base × height | 2(a + b) |
| Rhombus (diagonals d₁, d₂) | ½ × d₁ × d₂ | 4a |
| Trapezium | ½ × (sum of parallel sides) × height | Sum of sides |
| Circle (radius r) | πr² | 2πr |
| Sector (angle θ) | (θ/360) × πr² | 2r + (θ/360) × 2πr |

Diagonal of a rectangle: √(l² + b²); of a square: a√2.

## Heron's formula

For a triangle with sides a, b, c and semi-perimeter s = (a + b + c)/2:

~~~
Area = √(s(s − a)(s − b)(s − c))
~~~

~~~
Sides 13, 14, 15: s = 21 → √(21 × 8 × 7 × 6) = √7056 = 84
~~~

## Paths and borders

~~~
A garden 40 m × 30 m has a 2 m wide path around it, outside. Area of the path?
Outer: 44 × 34 = 1,496; inner: 1,200 → path = 296 m²
~~~

For a path inside the garden, subtract 2 × width from each dimension instead. For two crossing paths through the middle, add both path areas and subtract the overlapping square once.

## Three-dimensional shapes

| Solid | Volume | Curved / lateral surface area | Total surface area |
|---|---|---|---|
| Cuboid (l, b, h) | lbh | 2h(l + b) | 2(lb + bh + hl) |
| Cube (a) | a³ | 4a² | 6a² |
| Cylinder (r, h) | πr²h | 2πrh | 2πr(r + h) |
| Cone (r, h, slant l) | ⅓πr²h | πrl | πr(r + l) |
| Sphere (r) | ⁴⁄₃πr³ | 4πr² | 4πr² |
| Hemisphere (r) | ⅔πr³ | 2πr² | 3πr² |

For a cone, slant height l = √(r² + h²). Diagonal of a cuboid: √(l² + b² + h²).

## Unit conversions

- 1 m = 100 cm, so 1 m² = 10,000 cm² and 1 m³ = 1,000,000 cm³
- 1 litre = 1,000 cm³; 1 m³ = 1,000 litres
- 1 hectare = 10,000 m²

Converting area and volume units by the linear factor alone (100 instead of 10,000) is a common mistake.

## Melting and recasting

When a solid is melted and recast, volume is conserved:

~~~
A sphere of radius 6 cm is melted into a cylinder of radius 4 cm. Height?
⁴⁄₃π × 216 = π × 16 × h → 288 = 16h → h = 18 cm
~~~

~~~
How many spheres of radius 1 cm can be made from a sphere of radius 3 cm? (3/1)³ = 27
~~~

## Scaling and percentage changes

If every length is multiplied by k:

- perimeters multiply by k
- areas multiply by k²
- volumes multiply by k³

~~~
The radius of a circle increases by 10%. Area increase?
1.1² = 1.21 → 21%
~~~

For a rectangle whose length rises by a% and breadth by b%, the area changes by a + b + ab/100 percent, the successive-percentage formula.

## Cost problems

Painting, flooring and fencing problems multiply the relevant measure by a rate:

- painting walls: lateral surface area 2h(l + b), minus doors and windows
- carpeting: floor area
- fencing: perimeter

~~~
Cost of fencing a circular field of area 154 m² at 10 per metre (π = 22/7):
πr² = 154 → r = 7 → circumference 44 m → cost 440
~~~

## Cubes cut into smaller cubes

A cube of side n painted on all faces and cut into n³ unit cubes:

- 3 faces painted: 8 (corners)
- 2 faces painted: 12(n − 2) (edges)
- 1 face painted: 6(n − 2)² (face centres)
- no faces painted: (n − 2)³ (interior)

## How interviewers test this

Expect area and perimeter of combined shapes, paths around gardens, surface area and volume of solids, melting and recasting, scaling effects and painted-cube counts. Draw the figure, choose formulas carefully, keep units consistent (squared and cubed factors), and use volume conservation for recasting.`,
    sources: [WIKI_AREA, KHAN_GEOMETRY],
  },

  "data-interpretation": {
    theory: `Data interpretation (DI) presents information in a table or chart and asks questions that require reading values accurately and computing percentages, ratios, averages and growth rates. It tests calculation speed and careful reading more than advanced mathematics. This lesson, the bridge between quantitative aptitude and the dedicated DI course, covers the common DI formats, the calculations they demand, approximation techniques and an efficient approach to a DI set.

## Formats

| Format | Best at showing | Typical questions |
|---|---|---|
| Table | Exact values across categories | Totals, differences, ratios |
| Bar chart | Comparisons between categories | Highest, lowest, percentage difference |
| Line graph | Change over time | Growth rate, trend, largest increase |
| Pie chart | Parts of a whole | Share of total, central angles |
| Caselet | Data in paragraph form | Organizing data, then calculating |

The data interpretation course covers each format in depth.

## Core calculations

~~~
Percentage share = Part ÷ Total × 100
Percentage change = (New − Old) ÷ Old × 100
Ratio = A : B, simplified
Average = Sum ÷ Count
~~~

Percentage change always divides by the **earlier** value. A rise from 40 to 50 is 25%; a fall from 50 to 40 is 20%.

## Growth rates and CAGR

Year-on-year growth compares each year with the previous one. For growth over several years, the **compound annual growth rate** satisfies:

~~~
End value = Start value × (1 + r)^n
~~~

~~~
Sales grew from 100 to 121 in 2 years: (1 + r)² = 1.21 → r = 10% per year
~~~

## Pie chart conversions

A full circle is 360°, so:

~~~
Central angle = Percentage × 3.6
Percentage = Central angle ÷ 3.6
~~~

A 25% share corresponds to 90°; a 72° sector is 20%.

## Approximation

Answer options are often far enough apart that approximation is safe:

- round to two or three significant figures: 4,873 ÷ 61 ≈ 4,900 ÷ 60 ≈ 82
- use fraction equivalents: 16.67% = 1/6, 14.28% = 1/7, 11.11% = 1/9
- compare fractions by cross-multiplication rather than dividing: 37/52 versus 41/57 → 37 × 57 = 2,109 and 41 × 52 = 2,132, so 41/57 is larger

Calculate precisely only when the options are close together.

## Reading the question

Most DI errors are reading errors, not arithmetic errors:

- check units (thousands, lakhs, crores, percentages)
- check which years, categories or series the question refers to
- distinguish "percentage of" from "percentage increase"
- distinguish "percentage points" from "percent" when comparing percentages
- notice whether a chart shows absolute values or percentages

## An efficient approach to a DI set

1. **skim the data first** (30 seconds): titles, units, what each row, column or axis represents
2. **read all the questions** and note which require the same intermediate values, such as yearly totals
3. **compute shared values once** and write them beside the data
4. **approximate first**, refining only when options are close
5. **skip** a question that requires heavy calculation if others in the set are quicker

## Worked example

| Year | Revenue (crore) | Expenses (crore) |
|---|---|---|
| 2021 | 120 | 90 |
| 2022 | 150 | 105 |
| 2023 | 180 | 117 |

- profit in 2023: 180 − 117 = 63
- percentage growth in revenue, 2021 to 2023: (180 − 120)/120 × 100 = 50%
- profit margin in 2022: 45/150 × 100 = 30%
- year with the highest expense-to-revenue ratio: 2021 (90/120 = 75%, versus 70% in 2022 and 65% in 2023)

## Averages and totals across categories

When asked for an average across years or categories, sum first, then divide. When asked which category grew fastest, compare percentage growth, not absolute growth: rising from 10 to 20 (100%) beats rising from 100 to 150 (50%), even though the second is a larger absolute increase.

## Common mistakes

- dividing by the new value in percentage change
- misreading units or scale
- confusing absolute and relative change
- spending too long on one difficult question in a set

## How interviewers test this

Placement tests include DI sets of 4 to 5 questions on one table or chart, often under tight time limits. Skim the data, compute shared values once, approximate using fraction equivalents, check units and bases carefully, and compare growth in relative terms.`,
    sources: [OPENSTAX_STATS, KHAN_PROB],
  },
};
