import type { VisualMap } from "./types";

const c = "sql";

export const sqlMoreVisuals: VisualMap = {
  [`${c}/database-constraints`]: {
    plain:
      "Constraints are security guards on a table. NOT NULL refuses empty values, UNIQUE refuses duplicates, CHECK refuses values that break a rule (salary > 0), and FOREIGN KEY refuses links to rows that don't exist. Bad data is stopped at the door.",
    diagram: `flowchart LR
  I["INSERT salary = -5"] --> G{"CHECK (salary > 0)"}
  G -->|"fails"| R["rejected with an error"]
  G -->|"passes"| T["stored in the table"]`,
    caption: "Constraints reject invalid rows before they're saved.",
  },
  [`${c}/sql-dialects-and-standards`]: {
    plain:
      "SQL is a standard language, but each database speaks its own dialect, like English in India, the UK and the US. SELECT, WHERE and JOIN work everywhere; things like LIMIT vs TOP or date functions differ.",
    diagram: `flowchart TB
  A["ANSI SQL standard"] --> M["MySQL<br/>LIMIT 5"]
  A --> P["PostgreSQL<br/>LIMIT 5"]
  A --> S["SQL Server<br/>TOP 5"]
  A --> O["Oracle<br/>FETCH FIRST 5 ROWS"]`,
    caption: "Same core language, small dialect differences.",
  },
  [`${c}/select-statement-and-column-aliasing`]: {
    plain:
      "SELECT picks which columns you want to see, like choosing columns to print from a spreadsheet. AS gives a column a friendlier name in the result without changing the table.",
    diagram: `flowchart LR
  T["employees<br/>id · name · salary · dept_id"] -->|"SELECT name, salary * 12 AS annual"| R["result<br/>name · annual"]`,
    caption: "Choose and rename the columns you see.",
  },
  [`${c}/distinct-keyword`]: {
    plain:
      "DISTINCT removes repeated rows from the result, like turning a list of every city each employee lives in into the list of unique cities.",
    diagram: `flowchart LR
  A["Pune · Delhi · Pune · Chennai · Delhi"] -->|"SELECT DISTINCT city"| B["Pune · Delhi · Chennai"]`,
    caption: "Duplicates collapse to one row each.",
  },
  [`${c}/insert-into-syntax`]: {
    plain:
      "INSERT adds new rows. Name the columns, then give values in the same order. You can add many rows in one statement, which is much faster than one at a time.",
    diagram: `flowchart LR
  I["INSERT INTO employees (name, salary)<br/>VALUES ('Asha', 52000), ('Ravi', 48000)"] --> T["2 new rows in employees"]`,
    caption: "Column list and values must line up.",
  },
  [`${c}/update-statement-and-safeguards`]: {
    plain:
      "UPDATE changes existing rows, and the WHERE clause decides which. Forget WHERE and you change every single row. A good habit: run the same WHERE with SELECT first to see exactly which rows will change.",
    diagram: `flowchart TB
  U["UPDATE employees SET salary = salary * 1.1"] --> Q{"has WHERE?"}
  Q -->|"WHERE dept_id = 2"| S["only dept 2 rows change ✓"]
  Q -->|"no WHERE"| A["EVERY row changes ✗"]`,
    caption: "Always check the WHERE before running an UPDATE.",
  },
  [`${c}/logical-operators-in-between`]: {
    plain:
      "AND needs both conditions, OR needs either, NOT flips one. IN is a shortcut for many ORs (dept IN (1, 2, 3)) and BETWEEN for a range, including both ends (salary BETWEEN 40000 AND 60000).",
    diagram: `flowchart TB
  W["WHERE dept_id IN (1, 2) AND salary BETWEEN 40000 AND 60000"] --> A["dept 1 or 2"]
  W --> B["40000 ≤ salary ≤ 60000"]
  A --> R["rows matching both"]
  B --> R`,
    caption: "Combine conditions with AND / OR / IN / BETWEEN.",
  },
  [`${c}/null-handling`]: {
    plain:
      "NULL is 'no value known'. Most operations with NULL give NULL (100 + NULL is NULL), aggregates like SUM and AVG skip NULLs, and COALESCE(x, 0) swaps a NULL for a default you choose.",
    diagram: `flowchart LR
  A["bonus = NULL"] --> B["salary + bonus = NULL"]
  A --> C["COALESCE(bonus, 0) = 0"]
  C --> D["salary + 0 = salary ✓"]`,
    caption: "Replace NULL before doing arithmetic with it.",
  },
  [`${c}/order-by-limit-distinct`]: {
    plain:
      "ORDER BY sorts the result (ASC smallest first, DESC largest first). LIMIT keeps only the first few rows, and OFFSET skips some first, which is how pages of results work.",
    diagram: `flowchart LR
  A["all rows"] -->|"ORDER BY salary DESC"| B["sorted high → low"] -->|"LIMIT 3"| C["top 3 earners"]`,
    caption: "Sort, then cut.",
  },
  [`${c}/string-functions`]: {
    plain:
      "String functions reshape text in the result: UPPER and LOWER change case, LENGTH counts characters, SUBSTR cuts a piece out, TRIM removes spaces, and || joins strings together.",
    diagram: `flowchart LR
  N["'  asha rao '"] -->|"TRIM"| T["'asha rao'"] -->|"UPPER"| U["'ASHA RAO'"] -->|"SUBSTR(…, 1, 4)"| S["'ASHA'"]`,
    caption: "Functions can be chained.",
  },
  [`${c}/numeric-functions`]: {
    plain:
      "In SQLite, dividing two integers gives an integer: 7 / 2 is 3. Multiply by 1.0 first (7 * 1.0 / 2 = 3.5) when you want decimals. ROUND, ABS and modulo % do what you'd expect.",
    diagram: `flowchart LR
  A["7 / 2"] --> B["3 (integer division)"]
  C["7 * 1.0 / 2"] --> D["3.5"]
  D -->|"ROUND(…, 0)"| E["4.0"]`,
    caption: "Watch out for integer division.",
  },
  [`${c}/date-functions`]: {
    plain:
      "Dates are stored as text like '2026-11-26' in SQLite, and date functions do the maths: date('now'), date(hire_date, '+30 days'), and strftime to pull out the year or month.",
    diagram: `flowchart LR
  H["hire_date = '2026-01-15'"] -->|"date(…, '+30 days')"| P["'2026-02-14'"]
  H -->|"strftime('%Y', …)"| Y["'2026'"]`,
    caption: "Shift and extract parts of dates.",
  },
  [`${c}/case-coalesce-nullif`]: {
    plain:
      "CASE is an if/else inside a query: it labels each row based on conditions. CASE WHEN salary > 60000 THEN 'High' WHEN salary > 40000 THEN 'Mid' ELSE 'Low' END adds a band to every employee.",
    diagram: `flowchart TB
  S["salary"] --> A{"> 60000?"}
  A -->|"yes"| H["'High'"]
  A -->|"no"| B{"> 40000?"}
  B -->|"yes"| M["'Mid'"]
  B -->|"no"| L["'Low'"]`,
    caption: "CASE checks conditions top to bottom.",
  },
  [`${c}/joins-lesson-5`]: {
    plain:
      "Joining two big tables without an index is like matching guest names by reading the whole list for every guest. An index on the join column lets the database jump straight to matching rows. Filter early and select only the columns you need.",
    diagram: `flowchart LR
  E["employees.dept_id"] -->|"index lookup"| I["index on departments.id"] --> D["matching department row"]
  E -.->|"no index: scan every row each time"| S["full scan"]`,
    caption: "Index the columns you join on.",
  },
  [`${c}/scalar-and-in-subqueries`]: {
    plain:
      "A subquery is a question inside a question. A scalar subquery returns one value you can compare with (salary > (SELECT AVG(salary) ...)). An IN subquery returns a list (dept_id IN (SELECT id FROM departments WHERE ...)).",
    diagram: `flowchart LR
  I["SELECT AVG(salary) FROM employees"] --> V["53000"]
  V --> O["outer: WHERE salary > 53000"]`,
    caption: "The inner query runs first and feeds the outer one.",
  },
  [`${c}/exists-and-not-exists`]: {
    plain:
      "EXISTS asks 'is there at least one matching row?' and stops at the first one. NOT EXISTS is the cleanest way to find things with no match, like departments with no employees, and it behaves sensibly with NULLs.",
    diagram: `flowchart TB
  D["each department"] --> Q{"EXISTS an employee in it?"}
  Q -->|"yes"| K["has staff"]
  Q -->|"no (NOT EXISTS)"| E["empty department"]`,
    caption: "EXISTS checks for at least one match.",
  },
  [`${c}/subqueries-in-from-and-select`]: {
    plain:
      "A subquery in FROM builds a temporary table you can query again, like doing your rough work on a separate sheet first. You must give it a name (an alias) so the outer query can refer to it.",
    diagram: `flowchart LR
  I["(SELECT dept_id, AVG(salary) AS avg_sal FROM employees GROUP BY dept_id) AS d"] --> O["SELECT * FROM d WHERE avg_sal > 50000"]`,
    caption: "A derived table is queried like a normal table.",
  },
  [`${c}/schema-design-from-requirements`]: {
    plain:
      "To design a schema, underline the nouns in the requirements (they become tables), the facts about them (columns), and the verbs between them (relationships). 'Students enrol in courses' gives Students, Courses and an Enrolments table.",
    diagram: `erDiagram
  STUDENTS ||--o{ ENROLMENTS : makes
  COURSES ||--o{ ENROLMENTS : has
  STUDENTS {
    int id PK
    string name
  }
  COURSES {
    int id PK
    string title
  }
  ENROLMENTS {
    int student_id FK
    int course_id FK
    date enrolled_on
  }`,
    caption: "Nouns become tables; many-to-many becomes a junction table.",
  },
  [`${c}/constraints-and-ddl`]: {
    plain:
      "DDL commands change the structure, not the data: CREATE TABLE builds a table with its columns and rules, ALTER TABLE changes it later, DROP TABLE removes it entirely.",
    diagram: `flowchart LR
  C["CREATE TABLE"] --> T["table exists"]
  T -->|"ALTER TABLE … ADD COLUMN"| T2["new column added"]
  T2 -->|"DROP TABLE"| X["table gone"]`,
    caption: "The life of a table's structure.",
  },
  [`${c}/normalization-in-practice`]: {
    plain:
      "If a column repeats the same information in many rows, it probably belongs in its own table. Moving department names out of the employees table means renaming a department touches one row instead of hundreds.",
    diagram: `flowchart LR
  B["employees<br/>name · dept_name · dept_location<br/>(repeated per employee)"] ==> E["employees(name, dept_id)"]
  B ==> D["departments(id, name, location)"]`,
    caption: "Split repeated facts into their own table.",
  },
  [`${c}/recursive-ctes`]: {
    plain:
      "A recursive CTE starts with a seed row, then keeps adding rows built from the previous ones until nothing new appears, like climbing an org chart from the CEO down one level at a time.",
    diagram: `flowchart TB
  S["anchor: the CEO"] --> L1["step 1: people reporting to the CEO"]
  L1 --> L2["step 2: people reporting to them"]
  L2 --> L3["… until no new rows"]`,
    caption: "Anchor query, then a recursive step repeated until empty.",
  },
  [`${c}/window-functions-analytics`]: {
    plain:
      "Analytic window functions look at neighbouring rows without collapsing them. SUM(...) OVER (ORDER BY day) gives a running total; LAG gives the previous row's value, perfect for 'change since yesterday'.",
    diagram: `flowchart LR
  D1["day 1: 10 · running 10 · lag —"] --> D2["day 2: 15 · running 25 · lag 10"] --> D3["day 3: 5 · running 30 · lag 15"]`,
    caption: "Running total and previous value, row by row.",
  },
  [`${c}/set-operations`]: {
    plain:
      "Set operations combine whole result sets stacked on top of each other. UNION merges and removes duplicates, UNION ALL keeps duplicates, INTERSECT keeps rows in both, EXCEPT keeps rows in the first but not the second.",
    diagram: `flowchart TB
  A["query A: {1, 2, 3}"] --> U["UNION: {1, 2, 3, 4}"]
  B["query B: {2, 3, 4}"] --> U
  A --> I["INTERSECT: {2, 3}"]
  B --> I
  A --> E["A EXCEPT B: {1}"]
  B --> E`,
    caption: "Combining two result sets.",
  },
  [`${c}/nth-highest-salary`]: {
    plain:
      "To find the Nth highest salary, list distinct salaries from high to low and skip N − 1 of them. DENSE_RANK does the same while handling ties, so two people sharing the top salary are both rank 1.",
    diagram: `flowchart LR
  A["distinct salaries DESC<br/>90 · 80 · 70 · 60"] -->|"LIMIT 1 OFFSET 2"| B["3rd highest = 70"]`,
    caption: "Skip N − 1 distinct values, take the next.",
  },
  [`${c}/duplicates-find-and-delete`]: {
    plain:
      "To find duplicates, group by the columns that should be unique and keep groups with COUNT(*) > 1. To delete them, keep one row per group (say the smallest id) and delete the rest.",
    diagram: `flowchart TB
  G["GROUP BY email HAVING COUNT(*) > 1"] --> F["duplicate emails"]
  F --> K["keep MIN(id) per email"]
  K --> D["DELETE the other ids"]`,
    caption: "Find with GROUP BY, delete all but one.",
  },
  [`${c}/top-n-per-group`]: {
    plain:
      "'Highest earner in each department' needs ranking inside each group: ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC), then keep rank 1 (or rank ≤ N for top N).",
    diagram: `flowchart TB
  P["PARTITION BY dept ORDER BY salary DESC"] --> E["Engineering: Meera 1 · Asha 2 · Kiran 3"]
  P --> S["Sales: Ravi 1 · Dev 2"]
  E --> R["keep rn = 1 → Meera, Ravi"]
  S --> R`,
    caption: "Rank within each group, then filter.",
  },
  [`${c}/self-join-manager-questions`]: {
    plain:
      "For 'employees who earn more than their manager', join employees to itself: one copy plays the employee, the other the manager, matched on e.manager_id = m.id, then compare salaries.",
    diagram: `flowchart LR
  E["e: Ravi · salary 70k · manager_id 5"] -->|"e.manager_id = m.id"| M["m: Meera · id 5 · salary 60k"]
  M --> R["e.salary > m.salary → Ravi ✓"]`,
    caption: "Same table in two roles.",
  },
  [`${c}/consecutive-streaks-gaps`]: {
    plain:
      "Gaps-and-islands trick: number the rows in date order, and subtract that number from the date. Consecutive days give the same result, so grouping by it collects each streak into one group.",
    diagram: `flowchart TB
  A["Jan 1 − 1 = Dec 31"] --> I1["island A"]
  B["Jan 2 − 2 = Dec 31"] --> I1
  C["Jan 3 − 3 = Dec 31"] --> I1
  D["Jan 7 − 4 = Jan 3"] --> I2["island B"]
  E["Jan 8 − 5 = Jan 3"] --> I2`,
    caption: "date − row_number is constant within a streak.",
  },
  [`${c}/reporting-queries`]: {
    plain:
      "Report queries turn rows into summaries people read: totals per category, percentages of the whole, and pivots that turn categories into columns using SUM(CASE WHEN ... THEN 1 ELSE 0 END).",
    diagram: `flowchart LR
  R["rows: dept, gender"] -->|"SUM(CASE WHEN gender='F' THEN 1 ELSE 0 END)"| P["dept · female · male · total"]`,
    caption: "Pivot categories into columns with conditional sums.",
  },
  [`${c}/sql-interview-theory`]: {
    plain:
      "SQL theory questions keep coming back to a few comparisons: WHERE vs HAVING, DELETE vs TRUNCATE vs DROP, UNION vs UNION ALL, primary vs unique key, clustered vs non-clustered index. Learn each as a pair.",
    diagram: `flowchart TB
  Q["Most asked"] --> A["WHERE vs HAVING"]
  Q --> B["DELETE vs TRUNCATE vs DROP"]
  Q --> C["UNION vs UNION ALL"]
  Q --> D["PRIMARY vs UNIQUE key"]
  Q --> E["Clustered vs non-clustered index"]`,
    caption: "The comparisons interviewers ask most.",
  },
};
