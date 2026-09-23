import { Course } from './types';
import { createAptitudeLesson } from './aptitude-factory';

export const aptitudeDataCourse: Course = {
  id: "course-data-interpretation",
  slug: "data-interpretation",
  title: "Data Interpretation",
  description: "Learn to analyze tables, charts, graphs, and numerical datasets under time pressure.",
  category: "Aptitude",
  icon: "PieChart",
  displayOrder: 11,
  modules: [
    {
      id: "di-mod-1",
      slug: "basic-di",
      title: "Basic DI",
      description: "Foundations of reading and comparing tabular data.",
      difficulty: "Beginner",
      estimatedMinutes: 45,
      lessons: [
        createAptitudeLesson(
          "reading-tables",
          "Reading Tables",
          "Extracting data from rows and columns.",
          "Tabular DI involves data presented in a grid format with rows and columns.",
          "Tables are the most common and data-dense format in DI.",
          "Identify the headers, units (thousands, percentages), and any footnotes before reading the numbers.",
          "Use approximation for large numbers (e.g., 4987/10012 is approximately 5000/10000 = 50%).",
          "Table shows Sales: 2018 (450), 2019 (600). Growth = (150/450)*100 = 33.33%.",
          "Learn fraction to percentage values to calculate growth rates mentally.",
          ["Calculating exact values when options are widely spaced."],
          "Always scan the options first. If they are far apart (e.g., 10%, 25%, 50%), use heavy approximation.",
          {
            question: "If revenue increases from 200 to 250, what is the percentage increase?",
            options: ["20%", "25%", "50%", "30%"],
            answer: 1,
            explanation: "Increase = 50. % = (50/200) * 100 = 25%."
          }
        ),
        createAptitudeLesson(
          "data-comparison",
          "Data Comparison",
          "Comparing quantities quickly.",
          "Comparing fractions or ratios derived from a table without fully calculating them.",
          "Saves massive amounts of time during calculations.",
          "Cross-multiply fractions to compare them: a/b vs c/d -> compare ad vs bc.",
          "Use the cross-multiplication trick or convert to rough percentages.",
          "Compare 4/9 and 5/11. 4*11=44, 9*5=45. So 5/11 is greater.",
          "If the numerator increases and the denominator decreases, the fraction value strictly increases.",
          ["Doing long division to compare fractions."],
          "Look at the percentage growth of the numerator vs denominator to compare ratios.",
          {
            question: "Which fraction is larger: 7/15 or 8/17?",
            options: ["7/15", "8/17", "Both are equal"],
            answer: 1,
            explanation: "7*17 = 119. 15*8 = 120. Since 120 > 119, 8/17 is larger."
          }
        )
      ]
    },
    {
      id: "di-mod-2",
      slug: "graphs",
      title: "Graphs",
      description: "Visual data interpretation.",
      difficulty: "Intermediate",
      estimatedMinutes: 75,
      lessons: [
        createAptitudeLesson(
          "bar-graphs",
          "Bar Graphs",
          "Comparing heights.",
          "Data represented using rectangular bars where height is proportional to value.",
          "Very common for comparing multiple companies or years.",
          "Read the scale carefully (e.g., each line represents 10 units).",
          "Use visual approximation before doing math. You can often see which year had highest growth just by looking.",
          "Bar A is height 40, Bar B is 50. B is 25% larger than A.",
          "Use the edge of your rough paper or an on-screen straight line to compare heights if numbers aren't explicitly written.",
          ["Misreading the scale (e.g., reading 45 as 40)."],
          "Pay attention to whether the bars are stacked or clustered.",
          {
            question: "If a bar graph scale has 0 at the bottom and 100 at the top with 4 lines in between, what does each line represent?",
            options: ["10", "20", "25", "50"],
            answer: 1,
            explanation: "5 intervals (0 to 100). 100 / 5 = 20 per line."
          }
        ),
        createAptitudeLesson(
          "line-graphs",
          "Line Graphs",
          "Tracking trends over time.",
          "Data points connected by straight line segments, usually showing change over time.",
          "Excellent for showing percentage growth or decline.",
          "The steepness of the line indicates the rate of change.",
          "Focus on the 'nodes' (data points). Calculate the difference between nodes.",
          "Line goes from (2018, 100) to (2019, 150). Growth = 50%.",
          "A horizontal line means 0% growth (constant value).",
          ["Confusing a steep line with high absolute value (it only means high growth rate)."],
          "When two lines cross, their values are equal at that specific point in time.",
          {
            question: "A line graph goes from 50 in Jan to 50 in Feb. What is the growth rate?",
            options: ["0%", "50%", "100%", "Cannot be determined"],
            answer: 0,
            explanation: "Value remained the same, so growth is 0%."
          }
        ),
        createAptitudeLesson(
          "pie-charts",
          "Pie Charts",
          "Parts of a whole.",
          "A circular chart divided into sectors, illustrating numerical proportion.",
          "Used heavily to show market share or budget allocation.",
          "Total circle = 360 degrees or 100%.",
          "1% = 3.6 degrees. To convert % to degrees, multiply by 3.6.",
          "Sector is 20%. Angle = 20 * 3.6 = 72 degrees.",
          "If the total value is a multiple of 100 (e.g., 5000), 1% is 50. Just multiply percentages by 50.",
          ["Calculating the exact value for each sector when asked for a ratio between two sectors."],
          "If asked for the ratio of two slices, just take the ratio of their percentages/angles. Do not calculate absolute values.",
          {
            question: "If a slice is 90 degrees, what fraction of the total does it represent?",
            options: ["1/2", "1/3", "1/4", "1/5"],
            answer: 2,
            explanation: "90 / 360 = 1/4."
          }
        )
      ]
    },
    {
      id: "di-mod-3",
      slug: "advanced-di",
      title: "Advanced DI",
      description: "Complex and mixed data.",
      difficulty: "Advanced",
      estimatedMinutes: 90,
      lessons: [
        createAptitudeLesson(
          "mixed-graphs",
          "Mixed Graphs",
          "Combining multiple data sources.",
          "Problems featuring a combination of a pie chart and a table, or a bar and line graph.",
          "Tests your ability to cross-reference data under pressure.",
          "Understand how the two graphs are linked (e.g., Pie chart shows Total Students, Table shows Male:Female ratio).",
          "Derive the base value from the first graph, then apply the second graph's metric.",
          "Total = 1000 (from pie chart slice of 10%). Male:Female = 3:2 (from table). Males = (3/5)*1000 = 600.",
          "Create a master table on your scratchpad for the values you calculate, as they are often reused in subsequent questions.",
          ["Reading data from the wrong graph or applying a ratio to the total instead of the slice."],
          "Link the datasets in your mind before answering the first question.",
          {
            question: "Graph A says total cars = 100. Graph B says 40% are red. How many red cars?",
            options: ["10", "40", "60", "100"],
            answer: 1,
            explanation: "40% of 100 = 40."
          }
        ),
        createAptitudeLesson(
          "caselet-di",
          "Caselet DI",
          "Paragraph-based data.",
          "Data provided in the form of a paragraph rather than a visual chart.",
          "Requires you to construct your own table or Venn diagram.",
          "Read the passage carefully and draw a table or a Venn diagram (if sets/intersections are involved).",
          "Fill in the explicit data first. Use variables (x, y) for unknown data and solve using given totals.",
          "'Out of 100 people, 60 like tea, 50 like coffee. 20 like both.' -> Venn diagram setup.",
          "Once your table/Venn diagram is complete, you can solve all 5 questions in 1 minute.",
          ["Trying to answer questions without drawing a table first."],
          "Spend 3-4 minutes constructing the table. It is an investment that pays off instantly.",
          {
            question: "In a class of 50, 30 play cricket, 25 play football, 10 play both. How many play neither?",
            options: ["0", "5", "10", "15"],
            answer: 1,
            explanation: "Total playing = n(C) + n(F) - n(C and F) = 30 + 25 - 10 = 45. Neither = 50 - 45 = 5."
          }
        ),
        createAptitudeLesson(
          "di-data-sufficiency",
          "Data Sufficiency (DI)",
          "Checking if a graph is complete.",
          "Determining if the provided data/graphs are enough to answer the question.",
          "Often a trap where percentages are given but no absolute values.",
          "You cannot find an absolute value if only ratios or percentages are provided.",
          "Check if a base value is provided in ANY of the statements.",
          "S1: A's salary is 20% more than B's. S2: B's salary increased by 10%. Question: What is A's salary? -> Neither is sufficient (no base value).",
          "Look out for missing variables. If a pie chart gives percentages but no total, absolute questions cannot be answered.",
          ["Assuming a total (like 100 or 1000) when it's not given."],
          "In DI Data Sufficiency, 90% of the time, the trap is a missing base value.",
          {
            question: "Is the data sufficient to find the number of boys? \nI: Ratio of boys to girls is 3:2. \nII: There are 20 more boys than girls.",
            options: ["I alone", "II alone", "Both together", "Neither"],
            answer: 2,
            explanation: "I gives ratio. II gives difference (3x - 2x = x = 20). Together we find boys = 3(20) = 60."
          }
        )
      ]
    }
  ]
};
