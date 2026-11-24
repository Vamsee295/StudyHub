// Long-form theory for Data Interpretation and Placement Aptitude courses. Original writing.
import { LessonTheory } from './utils';

const OPENSTAX_STATS = { title: "OpenStax: Introductory Statistics 2e (free textbook)", url: "https://openstax.org/details/books/introductory-statistics-2e" };
const KHAN_DATA = { title: "Khan Academy: Statistics and probability, displaying data", url: "https://www.khanacademy.org/math/statistics-probability" };
const WIKI_BAR = { title: "Wikipedia: Bar chart", url: "https://en.wikipedia.org/wiki/Bar_chart" };
const WIKI_LINE = { title: "Wikipedia: Line chart", url: "https://en.wikipedia.org/wiki/Line_chart" };
const WIKI_PIE = { title: "Wikipedia: Pie chart", url: "https://en.wikipedia.org/wiki/Pie_chart" };
const WIKI_DS = { title: "Wikipedia: Data sufficiency", url: "https://en.wikipedia.org/wiki/Data_sufficiency" };
const TCS_NQT = { title: "TCS iON: National Qualifier Test (official)", url: "https://www.tcsion.com/hub/national-qualifier-test/" };
const INFOSYS_CAREERS = { title: "Infosys Careers (official)", url: "https://www.infosys.com/careers/" };
const POLYA = { title: "Wikipedia: How to Solve It (George Pólya)", url: "https://en.wikipedia.org/wiki/How_to_Solve_It" };
const KHAN_LOGIC = { title: "Khan Academy: Logical reasoning (LSAT prep, free)", url: "https://www.khanacademy.org/prep/lsat" };

export const aptDiPlacementTheory: Record<string, LessonTheory> = {
  "reading-tables": {
    theory: `Tables are the most common data interpretation format. They present exact values in rows and columns, and questions ask for totals, differences, percentages, ratios and averages drawn from them. Because the values are exact, table questions reward accurate reading and efficient calculation rather than estimation from a picture. This lesson covers how to read a table systematically, the calculations tables demand, row and column totals, and techniques for working fast without errors.

## Anatomy of a table

- **title**: what the data describes and often the units
- **row headings**: categories, such as companies or products
- **column headings**: another dimension, such as years or regions
- **units**: thousands, lakhs, crores, percentages, tonnes; often in the title or a note
- **notes and footnotes**: definitions or exceptions that change interpretation

Spend the first 30 seconds on these before reading any question.

## Example table

| Company | 2021 | 2022 | 2023 |
|---|---|---|---|
| A | 240 | 300 | 360 |
| B | 180 | 216 | 270 |
| C | 300 | 270 | 330 |

(Revenue in crore rupees)

## Common calculations

**Total**: add a row or column. Total revenue in 2023 = 360 + 270 + 330 = 960.

**Percentage change**: (new − old) ÷ old × 100.

~~~
Growth of B from 2021 to 2023: (270 − 180)/180 × 100 = 50%
~~~

**Percentage share**: part ÷ total × 100.

~~~
A's share of 2023 revenue: 360/960 × 100 = 37.5%
~~~

**Ratio**: simplify by common factors. Ratio of A to C in 2022 = 300 : 270 = 10 : 9.

**Average**: sum ÷ count. Average revenue of C over three years = 900/3 = 300.

## Year-on-year comparisons

"Which company had the highest percentage growth from 2022 to 2023?"

- A: 60/300 = 20%
- B: 54/216 = 25%
- C: 60/270 ≈ 22.2%

B grew most in percentage terms even though A and C grew more in absolute terms. Questions deliberately separate absolute and percentage change.

## Compute shared values once

Several questions in a set often need the same totals. Write row and column totals beside the table at the start; it saves repeated addition and reduces errors.

## Approximation for speed

When options are well separated, approximate:

~~~
B's share of total 2022 revenue: 216/786 ≈ 216/800 = 27% (actual ≈ 27.5%)
~~~

When options are close, calculate exactly. Fraction equivalents (1/8 = 12.5%, 1/6 ≈ 16.67%, 1/12 ≈ 8.33%) speed up both.

## Comparing fractions without dividing

To check which is larger, 54/216 or 60/270, cross-multiply: 54 × 270 = 14,580 versus 60 × 216 = 12,960. The first is larger, so B's growth rate exceeds C's. Cross-multiplication avoids decimals.

## Missing values

Some tables have blanks that must be found from totals or given relationships. Use row or column totals and stated percentages to recover them before answering other questions.

## Reading carefully

Most DI mistakes are reading mistakes:

- using the wrong row or column, especially in large tables; use a ruler or finger to track
- mixing units across tables
- answering "percentage of" when the question asks "percentage increase"
- misreading "approximately" questions as needing exact values

## Multi-table sets

When two tables are linked (for example, production in one and sales in another), confirm that categories and years match before combining them, and note any differences in units.

## A worked set

Using the company table above:

~~~
Q1. Total revenue of all three companies in 2022?     300 + 216 + 270 = 786
Q2. Average annual revenue of A over three years?     (240 + 300 + 360)/3 = 300
Q3. In which year did C's revenue fall?               2022 (300 → 270, a 10% drop)
Q4. Ratio of B's 2023 revenue to A's 2021 revenue?    270 : 240 = 9 : 8
Q5. A's share of the three-year total for all firms?  900/2,466 ≈ 36.5%
~~~

Notice how row totals (A: 900, B: 666, C: 900) and column totals (786 for 2022, 960 for 2023) computed once serve several questions. Writing them beside the table at the start of the set is the single habit that most improves speed on table questions.

## How interviewers test this

Expect table-based sets of four or five questions on totals, growth rates, shares, ratios and averages, often with tight time limits. Read the title, headings and units first, write shared totals, distinguish absolute from percentage change, approximate when options allow and cross-multiply to compare fractions.`,
    sources: [OPENSTAX_STATS, KHAN_DATA],
  },

  "data-comparison": {
    theory: `Data comparison questions ask which category is largest, which grew fastest, which ratio is highest, or how two series relate. They appear with every DI format and are often the quickest marks in a set, provided you compare the right quantity in the right way. The core skills are choosing between absolute and relative comparison, comparing fractions efficiently and ranking values without full calculation. This lesson covers each, with techniques that avoid unnecessary arithmetic.

## Absolute versus relative comparison

| Question asks | Compare |
|---|---|
| Which increased by the most? | Absolute change (new − old) |
| Which increased by the highest percentage? | Relative change ((new − old) ÷ old) |
| Which has the largest share? | Part ÷ total |
| Which has the highest ratio of X to Y? | X ÷ Y |

~~~
Product P rose from 50 to 80 (+30, +60%). Product Q rose from 200 to 260 (+60, +30%).
Largest absolute increase: Q. Largest percentage increase: P.
~~~

Reading the question precisely determines which comparison to make.

## Comparing fractions quickly

**Cross-multiplication**: to compare a/b and c/d, compare a × d with b × c.

~~~
Which is larger, 37/53 or 41/59?
37 × 59 = 2,183; 41 × 53 = 2,173 → 37/53 is larger
~~~

**Benchmarks**: compare each fraction to a convenient reference such as 1/2, 2/3 or 3/4.

~~~
Which is largest: 47/92, 31/65, 58/111?
47/92 > 46/92 → above half
31/65 < 32.5/65 → below half
58/111 > 55.5/111 → above half
Then compare 47/92 and 58/111 by cross-multiplication: 47 × 111 = 5,217 vs 58 × 92 = 5,336 → 58/111 is larger
~~~

**Numerator and denominator changes**: if one fraction has a larger numerator and smaller denominator than another, it's larger without any calculation.

## Percentage growth comparisons

For growth from a to b, compare b/a rather than computing each percentage:

~~~
Company X: 120 → 150 (ratio 1.25)
Company Y: 80 → 104 (ratio 1.30)
Y grew faster
~~~

## Ranking several values

When asked to rank many categories, eliminate clearly small or large ones first, then compare only the close candidates precisely. Full calculation for every value wastes time.

## Comparing growth over several periods

For multi-year growth, compare the final-to-initial ratio, or compute the compound annual growth rate when the number of years differs. Average annual growth by plain division (total percentage ÷ years) ignores compounding and can mislead when growth is large.

## Comparing across different bases

Two percentages from different bases can't be compared or added directly:

~~~
40% of men and 60% of women in a survey prefer product A. What percentage of all respondents prefer A?
Not 50% unless men and women are equal in number. If there are 300 men and 200 women: (120 + 120)/500 = 48%
~~~

This weighted-average reasoning is a frequent trap.

## Percentage points versus percent

If market share moves from 20% to 25%, it rose by 5 **percentage points**, which is a 25% **relative** increase. Questions may ask for either; read carefully.

## Number of categories above or below a threshold

"How many years did sales exceed the average?" First compute the average once, then count. "In how many years did profit increase over the previous year?" Compare consecutive values; no percentages are needed.

## Common mistakes

- comparing absolute values when the question asks about percentages
- averaging percentages from groups of different sizes
- computing every value exactly when a benchmark or elimination would settle it
- confusing percentage points with percent

## A worked set

~~~
Region   2022   2023
North     80     100
South    150     180
East      40      56
~~~

- largest absolute increase: South (+30)
- largest percentage increase: East (16/40 = 40%), ahead of North (25%) and South (20%)
- highest 2023 share: South, 180/336 ≈ 53.6%

The region with the biggest absolute gain had the smallest percentage gain, which is exactly the contrast these questions are built to test. Before calculating, underline whether the question says "by how much" or "by what percentage".

## How interviewers test this

Expect "which is highest or lowest", "which grew fastest", ranking, threshold counts and weighted-percentage questions across tables and charts. Identify whether the question is absolute or relative, use cross-multiplication and benchmarks for fractions, compare growth ratios directly, and weight percentages by group sizes.`,
    sources: [OPENSTAX_STATS, KHAN_DATA],
  },

  "bar-graphs": {
    theory: `A bar graph represents values as bars whose lengths are proportional to the quantities they show. Bar graphs make comparisons between categories visible at a glance, which is why they're common in reports and DI sections. Questions require reading values from a scale, comparing bars, computing differences and percentages, and handling grouped and stacked variants. This lesson covers reading bar graphs accurately, the variants, typical calculations and the visual traps to avoid.

## Reading a bar graph

1. read the **title** and **axis labels**: what's being measured, and in what units?
2. check the **scale**: where does the axis start, and what's each gridline worth?
3. read the **legend** for grouped or stacked bars
4. read values by following each bar's top to the axis; estimate between gridlines carefully

## Scale traps

If the vertical axis doesn't start at zero, bars exaggerate differences visually: a bar twice as tall may represent only a slightly larger value. Always compute from the numbers, not the bar lengths. Note also whether values are written on the bars; if so, use them instead of estimating.

## Single-series bar graphs

One bar per category, such as the number of students enrolled in five courses. Typical questions:

- which category is highest or lowest?
- what's the difference between two categories?
- what percentage of the total is one category?
- what's the average across categories?

## Grouped (clustered) bar graphs

Two or more bars per category, side by side, such as sales of two products across five years. Questions often compare series within a category ("In which year did product A outsell product B by the largest margin?") or track one series over time.

~~~
Year: 2020, 2021, 2022
Product A: 40, 55, 60
Product B: 35, 50, 70
Largest margin of A over B: 2020 and 2021 (5 each); B exceeds A in 2022
~~~

## Stacked bar graphs

Each bar is divided into segments that add up to a total, such as revenue split by region. Reading a segment requires subtracting the boundaries:

~~~
A bar's segments end at 30, 70 and 100 (cumulative).
Segment values: 30, 40 and 30
~~~

Only the bottom segment can be read directly from the axis; others are differences. **100% stacked bars** show percentage composition, with every bar reaching 100; they show shares, not absolute sizes, so two bars of equal height can represent different totals.

## Horizontal bar graphs

Bars run left to right with categories on the vertical axis. The same reading rules apply; the scale is on the horizontal axis.

## Typical calculations

~~~
Enrolments: Python 120, Java 90, SQL 60, C++ 30
Total = 300
Python's share = 120/300 = 40%
Java exceeds C++ by (90 − 30)/30 × 100 = 200%
Average = 75; categories above average: Python, Java
~~~

"Exceeds by what percentage" uses the smaller value as the base.

## Growth across bars

For time-series bars, percentage growth between consecutive bars uses the earlier bar as base. The year with the largest absolute increase may differ from the year with the largest percentage increase, especially when early values are small.

## Combining with other data

Some sets pair a bar graph with a table or a second graph, such as production (bars) and price per unit (table). Multiply corresponding values to get revenue, matching categories carefully.

## Estimation discipline

When values must be estimated between gridlines, estimate consistently and check whether the answer options are close enough for estimation errors to matter. If they are, look for exact labels or recompute with more care.

## Common mistakes

- reading stacked segments from the axis instead of subtracting
- trusting visual bar heights when the axis doesn't start at zero
- using the wrong base for "exceeds by" percentages
- mixing up series in grouped bars because of the legend

## Practice routine

For every bar graph you practise with, write down the scale step and starting value before reading any bar. That small habit prevents the most common error in this format, misreading values between gridlines.

## How interviewers test this

Expect single-series, grouped and stacked bar graph sets asking for maximum and minimum, differences, shares, growth and averages. Read the scale and legend first, subtract to read stacked segments, use the smaller value as base for "exceeds by", and compute from values rather than bar heights.`,
    sources: [WIKI_BAR, KHAN_DATA],
  },

  "line-graphs": {
    theory: `A line graph plots values over a continuous dimension, usually time, and connects them with lines. Line graphs show trends, rates of change and turning points more clearly than any other format. DI questions ask about growth between periods, the steepest rise or fall, the period of maximum change, and comparisons between multiple lines. This lesson covers reading line graphs, interpreting slope, multiple-line graphs, percentage versus absolute change and the traps specific to this format.

## Reading a line graph

1. read the title and axes: the horizontal axis is usually time; the vertical axis shows the quantity and units
2. check the scale and whether the vertical axis starts at zero
3. identify each line from the legend
4. read the value at each point, ideally from data labels

## Slope shows the rate of change

The steeper the line between two points, the faster the change:

- upward slope: increase
- downward slope: decrease
- flat line: no change
- steepest segment: largest **absolute** change between consecutive periods

~~~
Sales: 2019: 50, 2020: 65, 2021: 70, 2022: 95, 2023: 90
Largest absolute increase: 2021 to 2022 (+25)
Largest decrease: 2022 to 2023 (−5)
~~~

## Absolute versus percentage change

The steepest segment shows the largest **absolute** change, not necessarily the largest **percentage** change:

~~~
2019 to 2020: +15 on 50 = 30%
2021 to 2022: +25 on 70 ≈ 35.7%
~~~

Here the steepest segment also has the largest percentage change, but that isn't guaranteed. A rise from 10 to 20 (100%) looks less steep than a rise from 100 to 150 (50%). Compute percentages when the question asks for them.

## Multiple-line graphs

Two or more lines on the same axes allow comparisons:

- **where lines cross**: the two quantities are equal at that point
- **gap between lines**: the difference between the series
- **diverging lines**: the gap is growing; converging lines mean it's shrinking

~~~
Revenue and expenses over five years: profit in each year is the vertical gap between the lines.
The year with maximum profit is where revenue exceeds expenses by the widest gap.
~~~

## Percentage-based line graphs

Some line graphs plot **percentage growth** rather than values. A line that falls from 20% to 10% still shows growth, only slower growth; the underlying quantity is still increasing. This is a classic trap: a declining growth-rate line doesn't mean a declining value.

~~~
Growth rates: 2021: 10%, 2022: 5%. If 2020 value = 200:
2021 = 220, 2022 = 231 → still increasing
~~~

## Average over a period

Average value = sum of values ÷ number of periods. Average annual growth over several years should use compounding (CAGR) for precision; plain averaging of yearly percentages is an approximation that tests sometimes accept with "approximately".

## Interpolation

Values between plotted points aren't given; a line graph implies a smooth or straight-line transition, but questions should only use plotted points unless they explicitly ask for an estimate.

## Dual-axis graphs

Some graphs use two vertical axes with different scales for different lines. Read each line against its own axis; crossing points on a dual-axis graph don't mean equal values.

## Typical question patterns

- in which year was the increase the highest (absolute or percentage)?
- in how many years did the value decrease compared with the previous year?
- what's the average over the period?
- by what percentage did the value change between two years?
- in which year was the difference between two series the largest?

## Common mistakes

- equating steepness with percentage growth
- reading a falling growth-rate line as a falling value
- reading dual-axis lines against the wrong axis
- miscounting periods when computing averages

## A worked set

~~~
Users (lakh): 2019: 20, 2020: 30, 2021: 36, 2022: 45, 2023: 54
~~~

- largest absolute rise: 2022 to 2023 and 2021 to 2022 (+9 each)
- largest percentage rise: 2019 to 2020 (+10 on 20 = 50%)
- 2021 to 2022: 9/36 = 25%; 2022 to 2023: 9/45 = 20%

The steepest-looking segments in later years show smaller percentage growth because their base is larger, the key distinction this format tests.

## How interviewers test this

Expect single and multiple-line graphs with questions on maximum change, percentage growth, decreases, averages, gaps between series and growth-rate lines. Distinguish absolute from percentage change, read gaps between lines as differences, and remember that falling growth rates can still mean rising values.`,
    sources: [WIKI_LINE, OPENSTAX_STATS],
  },

  "pie-charts": {
    theory: `A pie chart shows how a whole divides into parts, with each slice's angle proportional to its share. Pie charts are ideal for composition questions such as a budget's allocation or market shares. DI questions convert between percentages, angles and absolute values, compare slices, and combine two pie charts. This lesson covers the conversions, working with totals, comparing pies with different totals and the limits of pie charts.

## The two forms

- **percentage pie**: slices are labelled with percentages summing to 100%
- **degree pie**: slices are labelled with central angles summing to 360°

## Conversions

~~~
Angle = Percentage × 3.6
Percentage = Angle ÷ 3.6
Value = (Percentage ÷ 100) × Total = (Angle ÷ 360) × Total
~~~

~~~
A slice of 72° in a budget of 50 lakh:
Percentage = 72/3.6 = 20% → value = 10 lakh
~~~

Useful equivalents: 10% = 36°, 25% = 90°, 50% = 180°, 5% = 18°.

## Example

A household spends 60,000 per month:

| Category | Percentage |
|---|---|
| Rent | 30% |
| Food | 25% |
| Transport | 10% |
| Education | 15% |
| Savings | 20% |

- food expense = 0.25 × 60,000 = 15,000
- angle for education = 15 × 3.6 = 54°
- rent exceeds transport by 20 percentage points, which is 12,000
- savings as a percentage of rent = 20/30 × 100 ≈ 66.7%

## Comparing slices within one pie

Comparing slices within the same pie needs only percentages; the total cancels. "By what percent is rent more than food?" = (30 − 25)/25 × 100 = 20%. No absolute values are needed.

## Comparing two pie charts

When two pies represent different totals (for example, company spending in two years), percentages alone can't compare absolute amounts:

~~~
2022 total 400 crore, R&D 15% → 60 crore
2023 total 500 crore, R&D 13% → 65 crore
R&D's share fell, but R&D spending rose
~~~

This is the most common pie chart trap: a smaller slice in a larger pie can represent a larger amount. Always multiply by each pie's total before comparing across pies.

## Combined pies and tables

Many sets pair a pie chart (percentage distribution) with a table or bar graph (totals or further breakdowns). For example, a pie gives the share of employees per department, and a table gives the male-to-female ratio in each. Compute department sizes from the pie first, then apply the ratios.

~~~
Total employees 2,000; Engineering is 35% → 700; male : female = 4 : 3 → 400 men, 300 women
~~~

## Questions on angles

~~~
If Food's slice is 90° and Transport's is 36°, the ratio of food to transport spending is 90 : 36 = 5 : 2
~~~

Angles compare directly, the same way percentages do.

## Limits of pie charts

Pie charts are poor at showing small differences between similar slices or changes over time. Researchers in data visualization generally recommend bar charts for precise comparisons, because people judge lengths more accurately than angles. In DI questions, rely on the labelled numbers rather than visual impressions.

## Common mistakes

- comparing slices across pies with different totals using percentages alone
- forgetting the 3.6 factor when converting angles
- treating percentage-point differences as percent differences
- estimating slice sizes visually when labels are given

## A worked set

A company's 2023 expenses of 80 crore split as: salaries 40%, operations 25%, marketing 15%, R&D 12%, others 8%.

~~~
Q1. Salaries in crore?                         0.40 × 80 = 32
Q2. Central angle for marketing?               15 × 3.6 = 54°
Q3. By what percent do salaries exceed R&D?    (40 − 12)/12 × 100 ≈ 233%
Q4. If 2024 expenses rise to 100 crore with R&D at 10%, did R&D spending rise?
    2023: 9.6 crore, 2024: 10 crore → yes, despite the smaller share
~~~

Q4 shows the cross-pie trap in action: the slice shrank while the amount grew. Write the total beside each pie before answering questions that span two charts.

## How interviewers test this

Expect percentage and degree pies, conversions between angles, percentages and values, within-pie comparisons, cross-pie comparisons with different totals, and combined pie-and-table sets. Convert with 3.6, compare within a pie using percentages, and multiply by totals before comparing across pies.`,
    sources: [WIKI_PIE, KHAN_DATA],
  },

  "mixed-graphs": {
    theory: `Mixed-graph DI sets combine two or more formats, such as a bar graph with a pie chart, a table with a line graph, or two different charts sharing categories. They're common in later sections of placement tests because they test whether you can link information across sources. The challenge isn't harder arithmetic but organization: knowing which figure provides which piece and combining them correctly. This lesson covers how to map information across charts, common pairings and a step-by-step approach.

## Why mixed sets are harder

Each chart alone may be straightforward, but questions require multi-step reasoning:

1. find a total in one chart
2. find a share or rate in another
3. combine them
4. compare or compute a final percentage

Errors creep in when values are taken from the wrong figure or units differ between figures.

## Map the data first

Before answering, note on rough paper:

- what each figure shows and its units
- which categories or years appear in each
- how they connect: does the pie split the total shown in the bar graph? Does the table give rates to apply to the line graph's quantities?

A 30-second map prevents most mistakes.

## Common pairings

| Pairing | Typical link |
|---|---|
| Bar graph (totals) + pie chart (distribution) | Pie percentage × bar total = category value |
| Table (quantities) + line graph (prices or rates) | Quantity × price = revenue |
| Pie (share of employees) + table (ratios within each department) | Department size × ratio = subgroups |
| Two bar graphs (production, sales) | Production − sales = inventory |
| Line graph (growth rate) + table (base value) | Base × (1 + rate) = next value |

## Worked example

A bar graph shows total sales of a company: 2022: 800 units, 2023: 1,000 units. A pie chart shows 2023 sales by region: North 30%, South 25%, East 20%, West 25%. A table shows the average price per unit in 2023 by region: North 500, South 450, East 600, West 400.

- North's 2023 units = 0.30 × 1,000 = 300; revenue = 300 × 500 = 1,50,000
- East's revenue = 200 × 600 = 1,20,000
- region with the highest revenue: North (1,50,000), South (250 × 450 = 1,12,500), West (250 × 400 = 1,00,000)
- percentage growth in total units = (1,000 − 800)/800 × 100 = 25%

Each answer combines at least two figures.

## Consistency checks

- do the units match across figures (units versus thousands of units)?
- do the categories match exactly (a region missing from one chart)?
- do the years align (the pie may cover only one year)?
- do percentages refer to the same total?

## Using intermediate results

Mixed sets usually reuse values. Compute and write down category values (like regional units above) once, then answer all questions from them.

## Approximation

As with other DI, approximate when options are well separated. In multi-step calculations, rounding errors can accumulate, so round only at the final step or keep one extra significant figure in intermediate values.

## When information is insufficient

Some questions can't be answered from the given figures, for instance asking for 2022 regional revenue when only 2023 regional data is given. Recognizing this saves time and earns the "cannot be determined" mark when it's an option.

## Time management

Mixed sets take longer per question. Start with questions that need one figure, then tackle multi-step ones. If a set looks heavy, compare it with other sets in the section and prioritize the one with more single-step questions.

## Common mistakes

- applying a percentage from one year to a total from another
- mixing units across figures
- recomputing intermediate values for every question
- missing that a question needs data that isn't provided

## Practice routine

When practising mixed sets, write a one-line map of each figure before reading questions, such as "bars: total units by year; pie: 2023 regional shares; table: 2023 price per unit". This habit takes seconds and makes linking figures automatic.

## How interviewers test this

Expect sets combining bar graphs, pie charts, tables and line graphs, with questions requiring two or three linked steps. Map what each figure provides, check units and categories, compute shared intermediate values once, and identify questions the data can't answer.`,
    sources: [OPENSTAX_STATS, KHAN_DATA],
  },

  "caselet-di": {
    theory: `A caselet presents data as a paragraph of text instead of a chart or table. The numbers are all there, but scattered through sentences, often with percentages of percentages and overlapping groups. The key skill is converting the paragraph into a clean table or diagram before answering any question. Caselets are increasingly common in placement tests because they test reading and organization together. This lesson covers how to extract data, structure it as a table or Venn diagram, and handle overlaps and missing values.

## Why caselets are tricky

- data appears in prose, so a number is quickly missed or misread
- values are often given relative to others ("40% of the remaining")
- groups overlap (people who like both A and B)
- some values must be derived before questions can be answered

## Step 1: read once fully

Read the whole caselet before writing anything, to understand the structure: what's being counted, the main categories and the time frame.

## Step 2: build a table

Convert the data into rows and columns:

~~~
A college has 1,200 students. 45% study engineering, 30% study commerce and the rest study arts.
Among engineering students, 60% are male. Among commerce students, 50% are male. Among arts students, 40% are male.
~~~

| Stream | Students | Male | Female |
|---|---|---|---|
| Engineering | 540 | 324 | 216 |
| Commerce | 360 | 180 | 180 |
| Arts | 300 | 120 | 180 |
| Total | 1,200 | 624 | 576 |

Every question about this caselet now becomes a table lookup.

## Step 3: watch relative statements

Phrases change the base:

- "40% of the **remaining**" refers to what's left after previous groups
- "**of these**" refers to the subgroup mentioned immediately before
- "20% **more than** B" uses B as the base

~~~
Of 500 employees, 40% work in sales. Of the remaining, 50% work in operations and the rest in technology.
Sales: 200. Remaining: 300 → operations: 150, technology: 150
~~~

## Step 4: use Venn diagrams for overlaps

When a caselet describes groups that overlap, draw circles:

~~~
In a survey of 200 people, 120 use app A, 90 use app B, and 40 use both.
Only A: 80. Only B: 50. Both: 40. Neither: 200 − (80 + 50 + 40) = 30
~~~

The formula for two sets: |A ∪ B| = |A| + |B| − |A ∩ B|. For three sets:

~~~
|A ∪ B ∪ C| = |A| + |B| + |C| − |A ∩ B| − |B ∩ C| − |A ∩ C| + |A ∩ B ∩ C|
~~~

Fill a three-circle Venn diagram from the centre (all three) outward, subtracting as you go.

## Step 5: derive missing values

Some cells must be computed from totals:

~~~
If total males are 624 and engineering plus commerce males are 504, arts males = 120
~~~

Fill all derivable cells before answering questions; many questions then become immediate.

## Time-based caselets

When the caselet describes changes over years, build a table with years as columns and track each change carefully, noting whether a percentage applies to the previous year or to a base year.

## Checking your table

- do rows and columns add up to stated totals?
- does every number in the caselet appear somewhere in your table?
- are all derived values consistent with every statement?

A quick consistency check catches transcription errors before they cost several questions.

## Common mistakes

- starting questions before structuring the data
- applying a percentage to the wrong base
- double-counting overlapping groups
- skipping a sentence that contains a key number

## A worked set

Using the college table above:

~~~
Q1. What percentage of all students are female?       576/1,200 = 48%
Q2. Ratio of male engineering to male arts students?   324 : 120 = 27 : 10
Q3. Females in commerce as a share of all females?    180/576 = 31.25%
~~~

Once the table exists, each answer takes seconds. Without it, every question means rereading the paragraph and recomputing.

## How interviewers test this

Expect paragraph-based data on students, employees, survey responses or sales, with overlapping groups and chained percentages, followed by four or five questions. Read fully, build a table or Venn diagram, track the base of each percentage, derive missing values, and verify totals before answering.`,
    sources: [OPENSTAX_STATS, KHAN_DATA],
  },

  "di-data-sufficiency": {
    theory: `DI data sufficiency combines data interpretation with the data sufficiency format: you're given a question about data, sometimes with a chart or partial information, plus two or more statements, and must decide which statements are needed to answer it. As with general data sufficiency, you don't compute the final answer; you judge whether it can be computed. This lesson covers the standard options, the method, common DI-specific patterns, and traps involving ratios, percentages and missing totals.

## The standard options

| Option | Meaning |
|---|---|
| A | Statement I alone is sufficient |
| B | Statement II alone is sufficient |
| C | Either statement alone is sufficient |
| D | Both together are needed |
| E | Both together aren't sufficient |

Lettering varies between tests; read the options each time.

## The method

1. identify exactly what must be determined (a value, a comparison or a yes/no fact)
2. note what information the question itself provides
3. test statement I alone, ignoring statement II
4. test statement II alone, ignoring statement I
5. if neither suffices alone, test them together

## Percentages need a base

A recurring DI pattern: percentages or ratios alone can't give absolute values.

~~~
What was the profit of Company X in 2023?
I. Revenue in 2023 was 500 crore.
II. Profit margin in 2023 was 12%.
~~~

- I alone: revenue without margin → insufficient
- II alone: margin without revenue → insufficient
- together: 0.12 × 500 = 60 crore → sufficient → D

## Comparisons may not need absolute values

~~~
Did Company A's profit exceed Company B's in 2023?
I. A's revenue was double B's.
II. A's profit margin was 10%, B's was 25%.
~~~

- I alone: no information about margins → insufficient
- II alone: no information about revenue → insufficient
- together: A's profit = 0.10 × 2R = 0.2R; B's = 0.25R → B's is higher → a definite "no" → sufficient → D

A definite "no" counts as sufficient.

## Growth problems

~~~
What were sales in 2023?
I. Sales in 2022 were 200 units.
II. Sales grew by 15% from 2022 to 2023.
~~~

Together: 230 units → D. Either alone fails.

## Shares and totals

~~~
How many employees work in the marketing department?
I. Marketing has 18% of all employees.
II. The company has 2,500 employees, 450 of whom work in marketing.
~~~

- II alone gives the answer directly → sufficient
- I alone gives a share but no total → insufficient
- answer B

Read statements fully; one may contain the answer outright.

## Charts as context

When a chart accompanies the question, it may already provide half the needed information. For example, if a pie chart shows each department's share, a statement giving the total headcount alone becomes sufficient. Always note what the given chart contributes before evaluating statements.

## Traps

- **assuming a total** that isn't given
- **leaking information** from statement II while testing statement I
- **ignoring definite "no" answers** as sufficient
- **missing that a ratio question needs no absolute values**: "What's the ratio of A's revenue to B's?" can be answered from relative information alone
- **forgetting averages need counts**: an average with no count can't give a total

## Speed tips

- for each statement, ask "what's still unknown?" rather than starting calculations
- stop as soon as sufficiency is clear
- remember that two statements giving the same information (in different forms) don't add up to more

## A worked set

~~~
Q. What is the average salary of the 40 employees in Department X?
I. The total monthly salary bill of Department X is 24 lakh.
II. The highest salary in Department X is 1.2 lakh.
~~~

Statement I alone gives the average: 24 lakh ÷ 40 = 60,000. Statement II alone doesn't, since one salary says nothing about the others. Answer: A.

~~~
Q. Is Product P's market share higher in 2023 than in 2022?
I. P's sales grew 10% from 2022 to 2023.
II. The total market grew 15% from 2022 to 2023.
~~~

Neither alone suffices. Together: P's share changes by a factor of 1.10/1.15 < 1, so it fell, giving a definite "no". Answer: D. The question needed only relative growth, not any absolute sales figure.

## How interviewers test this

Expect DI-flavoured sufficiency questions on profits, shares, growth, averages and comparisons, sometimes with a chart providing partial data. Determine what's being asked, account for information already given, test each statement alone and then together, and remember that percentages need bases while ratios and comparisons may not.`,
    sources: [WIKI_DS, OPENSTAX_STATS],
  },

  "tcs-ninja-patterns": {
    theory: `Tata Consultancy Services (TCS) hires large numbers of freshers each year, mainly through its National Qualifier Test (NQT), administered through TCS iON. Candidates are considered for different hiring tracks, with the Ninja track being the entry-level profile and higher tracks such as Digital and Prime requiring stronger performance, typically including advanced sections. Exact section names, question counts, timings and cut-offs change from year to year, so the official notification is the only reliable source for the current pattern. This lesson covers how to prepare for an aptitude-heavy fresher test like the NQT, using what's generally known about its structure.

## Always confirm the current pattern

Before preparing, read the latest official notification for:

- eligibility criteria (degree, graduation year, academic thresholds, backlog rules)
- sections, number of questions and time per section
- whether negative marking applies
- whether sections are individually timed (you may not be able to return to earlier sections)
- the role tracks and how scores map to them

Pattern details shared online, including in forums and older preparation material, are often outdated. Treat them as hints, not facts.

## Sections commonly seen in fresher aptitude tests

Fresher tests of this kind typically assess some combination of:

| Area | Topics to prepare |
|---|---|
| Numerical ability | Percentages, ratios, averages, time and work, speed and distance, profit and loss, number system, data interpretation |
| Verbal ability | Reading comprehension, sentence completion, error spotting, para-jumbles, vocabulary |
| Reasoning ability | Series, coding-decoding, blood relations, seating arrangements, syllogisms, data sufficiency |
| Advanced sections (higher tracks) | Harder quantitative and reasoning problems, and coding problems |
| Coding | Programming problems solved in a supported language |

All of these map to courses on this platform: Quantitative Aptitude, Logical Reasoning, Verbal Ability, Data Interpretation and the DSA and Programming Fundamentals courses for coding.

## Sectional timing changes strategy

When each section has its own timer and you can't move between sections freely:

- you can't save time in one section to spend in another
- unanswered questions in a section are lost when its time ends
- pace yourself per section: divide the section time by the number of questions to get a target time per question

## Accuracy versus attempts

If there's no negative marking, attempt every question, using elimination and educated guesses for the rest. If there is negative marking, guess only when you can eliminate at least two options. Check the current rules; this single detail changes the optimal strategy.

## Preparation plan

1. **diagnose**: take a timed mock test in the current pattern to find weak areas
2. **cover fundamentals**: work through the topic lessons for your weakest areas first
3. **practise by topic**: solve 20 to 30 questions per topic until accuracy is consistently high
4. **take timed mocks**: simulate sectional timing, ideally on a computer-based interface similar to the real test
5. **review mistakes**: for every error, note whether it was a concept gap, a calculation slip or a time-pressure guess, and fix the cause

## High-value topics

Across most fresher aptitude tests, a few topics carry consistent weight: percentages and their applications (profit, interest), ratios, time and work, speed and distance, number system, data interpretation, series, coding-decoding, arrangements and reading comprehension. Mastering these gives the best return on preparation time.

## Coding preparation

For tracks with coding rounds, practise implementing standard problems quickly and correctly: array and string manipulation, searching and sorting, recursion basics and basic data structures. Practise in the language you'll use in the test, handling input and output in the format online judges expect.

## Test-day practicalities

- check system requirements and the test platform in advance if the test is remote
- keep identification documents ready
- read every instruction screen; navigation rules differ between sections
- use rough paper systematically for calculations

## Beyond the test

Shortlisted candidates typically face interviews covering technical fundamentals, projects and communication. Preparing your resume projects and core subjects (OOP, DBMS, OS, networks) alongside aptitude improves your chances at the next stage.

## How interviewers test this

The NQT itself is the test; afterwards, interviewers often ask about projects, core CS subjects and problem-solving. Confirm the current pattern from the official notification, prepare the high-value aptitude topics and coding basics, practise under sectional timing, and review mistakes by cause.`,
    sources: [TCS_NQT, POLYA],
  },

  "infosys-logical": {
    theory: `Infosys recruits freshers through online assessments that commonly emphasize logical reasoning, quantitative ability and verbal ability, with additional coding-focused assessments for some specialist roles. Candidates and preparation communities generally describe its reasoning questions as puzzle-heavy: arrangements, data sufficiency, syllogisms and analytical puzzles that reward structured thinking over memorized formulas. Exact sections, question counts and timings change between hiring cycles and roles, so always check the current official information. This lesson focuses on preparing for reasoning-heavy assessments of this style.

## Check the current process

Confirm from official Infosys career communications and your college placement cell:

- which role you're applying for (different roles have different assessments)
- sections, timings and whether negative marking applies
- whether coding rounds are included
- eligibility rules

Older pattern descriptions circulating online may not match the current process.

## Why reasoning-heavy tests are different

Puzzle-based reasoning questions are often long, with several conditions to combine. They test:

- reading carefully and extracting every constraint
- organizing information into diagrams or tables
- deducing systematically rather than guessing

Speed comes from method, not shortcuts.

## Core reasoning topics to master

| Topic | Key method | Lesson on this platform |
|---|---|---|
| Seating and arrangement puzzles | Place definite clues first, branch into cases | Seating Arrangement |
| Syllogisms | Minimal Venn diagrams, try to break each conclusion | Syllogisms |
| Data sufficiency | Test each statement alone, then together | Data Sufficiency |
| Statements and conclusions | Stay within the statement's scope | Statements and Conclusions |
| Coding-decoding | Align letters, find per-position shifts | Coding-Decoding |
| Blood relations | Family tree with gender and generations | Blood Relations |
| Series and patterns | Differences, ratios, alternation | Number Series |

## A method for analytical puzzles

1. **read all conditions once** before drawing anything
2. **choose a structure**: a grid for multi-attribute puzzles (people × professions × cities), a line or circle for arrangements
3. **record definite facts** first
4. **record negative facts** as crosses in the grid ("P is not the doctor")
5. **apply elimination**: if only one option remains in a row or column, fill it in
6. **branch** into cases only when stuck, and drop cases that contradict a condition
7. **verify** the final solution against every condition

## Grid example

~~~
Three friends, A, B and C, are a doctor, an engineer and a lawyer (one each).
A isn't the doctor. B is the lawyer.
→ B = lawyer. A isn't the doctor and isn't the lawyer → A = engineer. C = doctor.
~~~

Real puzzles have more people and attributes, but the same grid and elimination method scales.

## Quantitative and verbal sections

Prepare the high-value topics: percentages, ratios, time and work, speed and distance, probability, permutations and combinations, and data interpretation for quantitative; reading comprehension, sentence correction, para-jumbles and vocabulary for verbal. The corresponding courses on this platform cover each with worked examples.

## Practice approach

- solve puzzles daily, timing each one, and note which step slowed you down
- for every wrong answer, find the specific condition you misread or misapplied
- build fluency with diagrams: neat, consistent notation makes complex puzzles manageable
- take full timed mocks to practise switching between puzzle types under pressure

## Time management

Long puzzles can consume disproportionate time. Read all questions in a puzzle set before solving; sometimes a question can be answered from partial deductions. If a puzzle isn't resolving after a few minutes, move on and return later if time allows.

## Coding assessments

For roles with coding rounds, practise standard problems in arrays, strings, recursion, sorting and basic data structures, with attention to correctness on edge cases and clean input and output handling.

## After the assessment

Interviews for freshers commonly cover programming basics, projects, core CS subjects and communication. Being able to explain your reasoning clearly, a skill puzzle practice builds, helps here too.

## How interviewers test this

The assessment itself tests structured reasoning under time limits; interviews then probe fundamentals and projects. Confirm the current pattern officially, master arrangement, syllogism and sufficiency methods, use grids and elimination for puzzles, and practise with timed mixed sets.`,
    sources: [INFOSYS_CAREERS, KHAN_LOGIC],
  },

  "elimination-techniques": {
    theory: `In multiple-choice aptitude tests, you don't always need to solve a question fully to answer it. Eliminating impossible or unlikely options can identify the answer faster, or at least improve the odds of a guess. Elimination is a legitimate and powerful technique that strong test-takers use constantly. This lesson covers elimination by properties, estimation, substitution, extreme values and units, verbal elimination patterns, and when guessing pays off.

## Why elimination works

Test-makers design wrong options (distractors) around predictable mistakes, but distractors often violate basic properties that the correct answer must have. Checking those properties is usually faster than full calculation.

## Elimination by number properties

- **units digit**: the product 37 × 43 ends in 1 (7 × 3 = 21), so options ending in other digits are wrong
- **parity**: the sum of two odd numbers is even
- **divisibility**: if the answer must be a multiple of 9, check digit sums
- **perfect squares**: squares never end in 2, 3, 7 or 8
- **sign and size**: an answer that must be positive, or less than a known total, rules out options outside that range

~~~
What is 47 × 53?  Options: 2,491  2,493  2,481  2,511
Units digit: 7 × 3 = 21 → ends in 1 → 2,491, 2,481 or 2,511
Estimate: about 50 × 50 = 2,500, slightly less → 2,491 (exact: 2,500 − 9)
~~~

## Estimation

Round the numbers and compute approximately. If the options are well separated, the closest one is the answer:

~~~
What is 19.8% of 4,012?  Options: 600, 794, 900, 1,000
20% of 4,000 = 800 → 794
~~~

## Substitution (back-solving)

Plug options into the question's conditions:

~~~
A number added to its square gives 72. The number is:  Options: 6, 7, 8, 9
8 + 64 = 72 → 8
~~~

Start with a middle option when options are in order; whether it's too big or too small tells you which direction to go, halving the remaining choices.

## Choosing convenient values

For questions with variables or percentages, substitute convenient numbers:

~~~
If a price rises 20% and then falls 20%, the net change is:  Options: 0%, −4%, +4%, −2%
Take 100 → 120 → 96 → −4%
~~~

Using 100 for percentages, or small integers like 2 and 3 for algebraic expressions, often reveals the answer in seconds. Check with a second set of values if two options agree on the first.

## Limiting cases

Test extreme values to eliminate options: if a formula is claimed to give the time for two pipes together, check what happens when one pipe is extremely slow; the answer should approach the other pipe's time.

## Units and dimensions

An area must be in square units, a speed in distance per time. If a calculation's options mix units, eliminate those that can't be dimensionally right.

## Verbal elimination patterns

- **reading comprehension**: eliminate options that are out of scope, too extreme, opposite to the passage, or true but irrelevant
- **sentence correction**: eliminate options with a definite grammatical error, then compare the rest for clarity and concision
- **synonyms and antonyms**: eliminate options of the wrong part of speech and planted synonyms in antonym questions
- **para-jumbles**: eliminate options starting with a sentence that refers back (pronouns, "however")

## Reasoning elimination

In arrangements and puzzles, each condition eliminates options. Applying conditions to the options themselves is sometimes faster than solving the whole puzzle, especially when a question asks "which of the following is possible?"

## When to guess

- **no negative marking**: never leave a question blank; eliminate what you can and guess among the rest
- **with negative marking**: guess when elimination improves the odds enough. With four options and a penalty of one-third of a mark, a random guess has zero expected value; eliminating even one option makes guessing worthwhile on average

## Common pitfalls

- eliminating the correct option through a careless property check
- over-relying on estimation when options are close
- choosing a substitution value that makes multiple options look correct (like 0 or 1 in algebra)

## How interviewers test this

Elimination isn't tested directly but decides scores in timed tests. Use units digits, parity and divisibility for numerical options, estimate when options are spread out, back-solve from options, substitute convenient values, eliminate verbal distractors by pattern, and guess strategically based on the marking scheme.`,
    sources: [POLYA, KHAN_LOGIC],
  },

  "skimming-questions": {
    theory: `In a timed aptitude test, the order in which you attempt questions affects your score as much as your knowledge. Skimming, scanning a section quickly to classify questions by difficulty and time cost before committing to any, lets you collect easier marks first and avoid getting stuck. This lesson covers how to skim a section, a triage system for questions, time budgeting, handling long sets like DI and reading passages, and adapting to tests with sectional timing or restricted navigation.

## Why order matters

Every question usually carries the same marks, but questions differ enormously in time cost. A candidate who spends four minutes on one hard question may lose three quick ones at the end of the section. Attempting quick, confident questions first maximizes the marks earned per minute.

## Skimming a section

If the test allows free navigation within a section:

1. spend the first minute or two scanning all questions without solving
2. classify each one quickly (see the triage system below)
3. attempt the fastest category first, then the next

Skimming should be fast: read only enough of each question to identify its topic and approximate effort.

## A triage system

| Category | Description | Action |
|---|---|---|
| Quick | Familiar topic, short, method obvious | Solve immediately |
| Medium | Familiar topic, several steps | Solve after quick questions |
| Long or unfamiliar | Heavy calculation, long puzzle, uncertain method | Attempt last or guess strategically |

Many test interfaces let you **mark questions for review**. Use it to flag medium and long questions, so you can find them quickly later.

## Time budgeting

Compute a target time per question: section time divided by question count. With 30 minutes for 25 questions, that's about 72 seconds each. Use it as a guide:

- quick questions should take well under the target, banking time
- if a question exceeds about twice the target without clear progress, mark it and move on
- leave a few minutes at the end to answer or guess remaining questions

## Long sets: DI, puzzles and reading passages

Sets with several questions on one dataset have a fixed setup cost (reading the chart or passage). Once you've paid it, the questions are often quick. Choose sets wisely:

- skim the data or passage and its questions together
- prefer sets with familiar formats and straightforward questions
- if a set's first question is unusually hard, try its others before abandoning it; they may be independent

## Recognizing time traps

Some questions look short but hide heavy computation or a tricky twist: large-number arithmetic with no apparent shortcut, puzzles with many conditions, or questions whose options are extremely close. Mark these early.

## Restricted navigation and sectional timing

Some tests don't allow returning to earlier questions, or time each section separately. Adapt:

- with **no going back**, decide on each question as you meet it: solve, or guess and move on within a time limit you set
- with **sectional timers**, time saved in one section can't be used in another, so pace each section separately
- read the instructions screen carefully; it states the navigation rules

## Guessing and marking scheme

Before skipping, know the marking scheme. Without negative marking, every unanswered question should be guessed before time runs out. With negative marking, guess only when elimination has improved your odds.

## Building the habit

- practise full-length mock tests with the same rules as the real test
- after each mock, review which questions consumed the most time and whether skipping them would have helped
- track your accuracy by category; it shows which topics are truly "quick" for you
- over time, your triage becomes faster and more accurate

## Staying calm

Hitting a hard question early can cause panic. Remember that the test is designed so that few candidates answer everything. Moving on from a difficult question is a strategic choice, not a failure.

## How interviewers test this

Test strategy isn't asked about directly, but it determines aptitude scores in placement tests. Skim to classify questions, attempt quick ones first, mark and revisit long ones, budget time per question, choose DI and reading sets wisely, adapt to navigation rules, and guess according to the marking scheme.`,
    sources: [POLYA, KHAN_DATA],
  },
};
