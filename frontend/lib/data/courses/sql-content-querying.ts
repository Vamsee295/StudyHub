// SQL Modules 3-5: Filtering, SQL Functions, Grouping
// Every query runs as-is in the StudyHub SQL Lab (SQLite), which ships with the
// `employees` and `departments` tables used below. Results were captured from SQLite.
import { CourseLesson } from './types';

const LAB_NOTE = {
  type: "callout" as const,
  title: "Run It Yourself",
  content: "Open Practice → SQL Lab. It comes preloaded with two tables: employees(id, name, department, salary, hire_date) with 8 rows, and departments(id, name, budget) with 4 rows. Every query in this lesson runs there exactly as written."
};

export const filteringLessons: CourseLesson[] = [
  {
    id: "where-and-comparison-operators",
    slug: "where-and-comparison-operators",
    title: "WHERE and Comparison Operators",
    description: "Filter rows with =, <>, <, >, <=, >= and understand how WHERE is evaluated row by row.",
    estimatedMinutes: 15,
    content: {
      sections: [
        LAB_NOTE,
        {
          type: "text",
          title: "How WHERE Works",
          content: "WHERE tests a condition against each row. Rows where the condition is TRUE are kept; rows where it is FALSE or UNKNOWN (because of NULL) are discarded. WHERE runs before SELECT, so it can't use column aliases defined in the SELECT list."
        },
        {
          type: "table",
          title: "Comparison Operators",
          headers: ["Operator", "Meaning", "Example"],
          rows: [
            ["=", "Equal", "`department = 'Sales'`"],
            ["<> or !=", "Not equal", "`department <> 'HR'`"],
            ["< , >", "Less than / greater than", "`salary > 75000`"],
            ["<= , >=", "At most / at least", "`hire_date >= '2023-01-01'`"]
          ]
        },
        {
          type: "code",
          title: "Example",
          language: "sql",
          code: "SELECT name, salary\nFROM employees\nWHERE salary > 75000;",
          explanation: "Returns Alice (85000), Bob (78000) and Fiona (92000)."
        },
        {
          type: "tryIt",
          title: "Predict the Output",
          code: "SELECT name FROM employees\nWHERE hire_date >= '2023-01-01' AND department <> 'Engineering';",
          expectedOutput: "Charlie, Evan, George",
          explanation: "Hired in 2023 or later: Alice, Charlie, Evan, George. Removing Engineering drops Alice. ISO dates (YYYY-MM-DD) stored as text compare correctly as strings."
        },
        {
          type: "warning",
          title: "Common Mistakes",
          items: [
            "Using double quotes for text: `\"Sales\"` is an identifier (a column name) in standard SQL. Use single quotes: `'Sales'`.",
            "Comparing numbers stored as text: '9' > '10' is TRUE as strings. Store numbers in numeric columns.",
            "Referencing a SELECT alias in WHERE: `SELECT salary*12 AS annual ... WHERE annual > 900000` fails. Repeat the expression or use a subquery."
          ]
        },
        {
          type: "quickCheck",
          question: "How many employees have a salary of at least 72000?",
          options: ["3", "4", "5", "6"],
          answer: 1,
          explanation: "Fiona 92000, Alice 85000, Bob 78000, Diana 72000. That's 4 (>= includes 72000)."
        },
        {
          type: "takeaways",
          items: ["WHERE filters rows before SELECT runs.", "Text uses single quotes; ISO dates compare correctly as text.", "You can't use SELECT aliases inside WHERE."]
        }
      ]
    }
  },
  {
    id: "logical-operators-in-between",
    slug: "logical-operators-in-between",
    title: "AND, OR, NOT, IN and BETWEEN",
    description: "Combine conditions correctly, avoid precedence bugs, and use IN and BETWEEN for cleaner filters.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "text",
          title: "Precedence",
          content: "NOT is evaluated first, then AND, then OR, just like × before + in arithmetic. When you mix AND and OR, always add parentheses to make your intent explicit."
        },
        {
          type: "code",
          title: "The Classic Precedence Bug",
          language: "sql",
          code: "-- Intended: Sales or HR employees earning at least 60000\n-- BUG: AND binds tighter, so this means\n--   department = 'Sales' OR (department = 'HR' AND salary >= 60000)\nSELECT name FROM employees\nWHERE department = 'Sales' OR department = 'HR' AND salary >= 60000;\n-- returns Charlie, Diana, George   (George earns 58000!)\n\n-- Correct\nSELECT name FROM employees\nWHERE (department = 'Sales' OR department = 'HR') AND salary >= 60000;\n-- returns Charlie, Diana\n\n-- Cleaner with IN\nSELECT name FROM employees\nWHERE department IN ('Sales', 'HR') AND salary >= 60000;",
          explanation: "IN (a, b, c) is shorthand for = a OR = b OR = c, and it avoids the precedence trap."
        },
        {
          type: "code",
          title: "BETWEEN (inclusive on both ends)",
          language: "sql",
          code: "SELECT name, salary FROM employees\nWHERE salary BETWEEN 65000 AND 72000;",
          explanation: "Returns Charlie 65000, Diana 72000, Evan 68000, Hannah 71000. Both 65000 and 72000 are included."
        },
        {
          type: "warning",
          title: "Common Mistakes",
          items: [
            "Writing `BETWEEN 72000 AND 65000` (high value first) returns nothing; the lower bound must come first.",
            "For timestamps, `BETWEEN '2024-01-01' AND '2024-01-31'` misses times later on Jan 31. Prefer `>= '2024-01-01' AND < '2024-02-01'`.",
            "`NOT IN` with a list containing NULL returns no rows at all (see the NULL lesson)."
          ]
        },
        {
          type: "quickCheck",
          question: "Which query returns employees NOT in Engineering or Sales?",
          options: [
            "WHERE department NOT IN ('Engineering', 'Sales')",
            "WHERE department <> 'Engineering' OR department <> 'Sales'",
            "WHERE NOT department = 'Engineering' OR 'Sales'",
            "WHERE department NOT BETWEEN 'Engineering' AND 'Sales'"
          ],
          answer: 0,
          explanation: "Option B is always true (every value differs from at least one of the two). NOT IN expresses 'neither' correctly."
        },
        {
          type: "takeaways",
          items: ["Precedence: NOT > AND > OR. Use parentheses whenever you mix them.", "IN is a clean multi-value equality; BETWEEN is inclusive."]
        }
      ]
    }
  },
  {
    id: "like-pattern-matching",
    slug: "like-pattern-matching",
    title: "LIKE and Pattern Matching",
    description: "Use % and _ wildcards, understand case sensitivity, and know when LIKE can't use an index.",
    estimatedMinutes: 12,
    content: {
      sections: [
        {
          type: "table",
          title: "Wildcards",
          headers: ["Pattern", "Matches", "Result on employees.name"],
          rows: [
            ["`'A%'`", "Starts with A", "Alice"],
            ["`'%a'`", "Ends with a", "Diana, Fiona"],
            ["`'_i%'`", "Second letter is i", "Diana, Fiona"],
            ["`'%an%'`", "Contains 'an'", "Diana, Evan, Hannah"],
            ["`'_____'`", "Exactly 5 characters", "Alice, Diana, Fiona"]
          ]
        },
        {
          type: "code",
          title: "Filtering Dates Stored as Text",
          language: "sql",
          code: "SELECT name, hire_date FROM employees\nWHERE hire_date LIKE '2023%';\n-- Alice 2023-01-15, Evan 2023-05-12, George 2023-09-01",
          explanation: "This works because ISO dates are text in SQLite. A range (`>= '2023-01-01' AND < '2024-01-01'`) is usually better, because it can use an index on hire_date."
        },
        {
          type: "warning",
          title: "Database Differences",
          items: [
            "SQLite and MySQL (with default collations) compare LIKE case-insensitively for ASCII letters; PostgreSQL's LIKE is case-sensitive (use `ILIKE` there).",
            "A leading wildcard (`'%son'`) can't use a B+ tree index, so the database scans every row.",
            "To match a literal % or _, use an escape character: `LIKE '50\\%%' ESCAPE '\\'`."
          ]
        },
        {
          type: "quickCheck",
          question: "Which pattern finds names that contain the letter 'o' anywhere?",
          options: ["'o%'", "'%o'", "'%o%'", "'_o_'"],
          answer: 2,
          explanation: "% on both sides allows any characters before and after: Bob, Fiona and George match."
        },
        {
          type: "takeaways",
          items: ["% = any number of characters; _ = exactly one.", "Case sensitivity depends on the database.", "Leading wildcards can't use indexes."]
        }
      ]
    }
  },
  {
    id: "null-handling",
    slug: "null-handling",
    title: "Working With NULL",
    description: "Three-valued logic, IS NULL, COALESCE, NULLs in aggregates, and the NOT IN trap.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "text",
          title: "What NULL Means",
          content: "NULL means 'unknown' or 'missing'. It isn't zero and it isn't an empty string. Any comparison with NULL (=, <>, <, >) gives UNKNOWN, not TRUE or FALSE, and WHERE keeps only rows where the condition is TRUE.\n\nTo follow along, add a bonus column in the SQL Lab:\nALTER TABLE employees ADD COLUMN bonus INTEGER;\nUPDATE employees SET bonus = 5000 WHERE department = 'Engineering';\nNow only Alice, Bob and Fiona have a bonus; everyone else has NULL."
        },
        {
          type: "code",
          title: "= NULL Never Works",
          language: "sql",
          code: "SELECT name FROM employees WHERE bonus = NULL;    -- 0 rows (always UNKNOWN)\nSELECT name FROM employees WHERE bonus IS NULL;   -- Charlie, Diana, Evan, George, Hannah\nSELECT name FROM employees WHERE bonus <> 5000;   -- 0 rows! NULL <> 5000 is UNKNOWN too",
          explanation: "To include rows with a NULL bonus in that last query, write `bonus <> 5000 OR bonus IS NULL`."
        },
        {
          type: "code",
          title: "Replacing NULLs With COALESCE",
          language: "sql",
          code: "SELECT name, salary + COALESCE(bonus, 0) AS total\nFROM employees\nORDER BY total DESC\nLIMIT 3;\n-- Fiona 97000, Alice 90000, Bob 83000",
          explanation: "Without COALESCE, `salary + bonus` would be NULL for everyone without a bonus: arithmetic with NULL gives NULL."
        },
        {
          type: "table",
          title: "NULLs and Aggregates (bonus column)",
          headers: ["Expression", "Result", "Why"],
          rows: [
            ["`COUNT(*)`", "8", "Counts rows"],
            ["`COUNT(bonus)`", "3", "Counts non-NULL values only"],
            ["`SUM(bonus)`", "15000", "NULLs are ignored"],
            ["`AVG(bonus)`", "5000.0", "15000 / 3, not 15000 / 8"]
          ]
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "Why does `WHERE x NOT IN (SELECT y FROM t)` sometimes return nothing?",
              trap: "Blaming the data or the join.",
              solution: "If the subquery returns even one NULL, then `x NOT IN (..., NULL)` means `x <> ... AND x <> NULL`, which is never TRUE. Use NOT EXISTS, or filter out NULLs with `WHERE y IS NOT NULL` inside the subquery."
            },
            {
              question: "Is AVG(bonus) the same as SUM(bonus) / COUNT(*)?",
              trap: "Saying yes.",
              solution: "No. AVG divides by the count of non-NULL values. To treat missing values as 0, use AVG(COALESCE(bonus, 0))."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "What does `SELECT NULL = NULL` return?",
          options: ["TRUE (1)", "FALSE (0)", "NULL (unknown)", "An error"],
          answer: 2,
          explanation: "Two unknown values can't be known to be equal, so the result is unknown. Use IS NULL (or IS NOT DISTINCT FROM where supported)."
        },
        {
          type: "takeaways",
          items: [
            "Test for NULL with IS NULL / IS NOT NULL, never with = or <>.",
            "Aggregates (except COUNT(*)) skip NULLs.",
            "COALESCE(x, default) replaces NULL; NOT IN with NULLs is a trap, so prefer NOT EXISTS."
          ]
        }
      ]
    }
  },
  {
    id: "order-by-limit-distinct",
    slug: "order-by-limit-distinct",
    title: "ORDER BY, LIMIT / OFFSET and DISTINCT",
    description: "Sort by several columns, paginate results, and remove duplicate rows.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "code",
          title: "Multi-Column Sorting",
          language: "sql",
          code: "SELECT name, department, salary\nFROM employees\nORDER BY department ASC, salary DESC;",
          explanation: "Sorts by department first; within each department, the highest salary comes first."
        },
        {
          type: "table",
          title: "Result",
          headers: ["name", "department", "salary"],
          rows: [
            ["Fiona", "Engineering", "92000"], ["Alice", "Engineering", "85000"], ["Bob", "Engineering", "78000"],
            ["Diana", "HR", "72000"], ["Hannah", "Marketing", "71000"], ["Evan", "Marketing", "68000"],
            ["Charlie", "Sales", "65000"], ["George", "Sales", "58000"]
          ]
        },
        {
          type: "code",
          title: "Top-N and Pagination",
          language: "sql",
          code: "-- Top 3 earners\nSELECT name, salary FROM employees ORDER BY salary DESC LIMIT 3;\n-- Fiona 92000, Alice 85000, Bob 78000\n\n-- 'Page 2' with 2 rows per page: skip 2, take 2\nSELECT name, salary FROM employees ORDER BY salary DESC LIMIT 2 OFFSET 2;\n-- Bob 78000, Diana 72000\n\n-- Unique departments\nSELECT DISTINCT department FROM employees ORDER BY department;\n-- Engineering, HR, Marketing, Sales",
          explanation: "SQL Server uses `TOP n` or `OFFSET ... FETCH NEXT`; Oracle uses `FETCH FIRST n ROWS ONLY`. The idea is the same."
        },
        {
          type: "warning",
          title: "Common Mistakes",
          items: [
            "LIMIT without ORDER BY returns an arbitrary set of rows, which may change between runs.",
            "Large OFFSETs are slow, because the database still reads and discards the skipped rows. For deep pagination use keyset pagination: `WHERE salary < :last_seen ORDER BY salary DESC LIMIT 20`.",
            "`DISTINCT` applies to the whole selected row, not just the first column: `SELECT DISTINCT department, name` returns 8 rows."
          ]
        },
        {
          type: "quickCheck",
          question: "SELECT name FROM employees ORDER BY salary ASC LIMIT 1 returns:",
          options: ["Fiona", "George", "Charlie", "Alice"],
          answer: 1,
          explanation: "Ascending order puts the lowest salary first: George with 58000."
        },
        {
          type: "takeaways",
          items: ["Always ORDER BY when you use LIMIT.", "OFFSET pagination gets slow on deep pages; keyset pagination scales.", "DISTINCT de-duplicates whole rows."]
        }
      ]
    }
  }
];

export const sqlFunctionLessons: CourseLesson[] = [
  {
    id: "string-functions",
    slug: "string-functions",
    title: "String Functions",
    description: "UPPER, LOWER, LENGTH, SUBSTR, concatenation, REPLACE, TRIM and INSTR, with dialect differences.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "code",
          title: "Common String Functions (SQLite)",
          language: "sql",
          code: "SELECT UPPER(name), LOWER(department), LENGTH(name), SUBSTR(name, 1, 3)\nFROM employees WHERE id <= 3;\n-- ALICE  engineering  5  Ali\n-- BOB    engineering  3  Bob\n-- CHARLIE sales       7  Cha\n\nSELECT name || ' (' || department || ')' AS label\nFROM employees WHERE id IN (1, 4);\n-- Alice (Engineering)\n-- Diana (HR)",
          explanation: "SUBSTR is 1-indexed: SUBSTR(name, 1, 3) means 3 characters starting at position 1."
        },
        {
          type: "table",
          title: "Function Reference Across Databases",
          headers: ["Task", "SQLite / PostgreSQL", "MySQL", "SQL Server"],
          rows: [
            ["Concatenate", "`a || b`", "`CONCAT(a, b)`", "`a + b` or `CONCAT(a, b)`"],
            ["Length", "`LENGTH(s)`", "`CHAR_LENGTH(s)`", "`LEN(s)`"],
            ["Substring", "`SUBSTR(s, start, len)`", "`SUBSTRING(s, start, len)`", "`SUBSTRING(s, start, len)`"],
            ["Find position", "`INSTR(s, sub)` / `POSITION(sub IN s)`", "`INSTR(s, sub)`", "`CHARINDEX(sub, s)`"],
            ["Replace", "`REPLACE(s, from, to)`", "Same", "Same"],
            ["Trim spaces", "`TRIM(s)`", "Same", "Same (2017+)"]
          ]
        },
        {
          type: "tryIt",
          title: "Predict the Output",
          code: "SELECT INSTR(name, 'a') FROM employees WHERE name = 'Hannah';",
          expectedOutput: "2",
          explanation: "INSTR returns the 1-based position of the first match: H-a-n-n-a-h, so 'a' is first found at position 2. It returns 0 if there is no match."
        },
        {
          type: "quickCheck",
          question: "SUBSTR('Engineering', 3, 4) returns:",
          options: ["'Engi'", "'gine'", "'ngin'", "'gin'"],
          answer: 1,
          explanation: "Start at position 3 ('g') and take 4 characters: g-i-n-e."
        },
        {
          type: "takeaways",
          items: ["String positions are 1-based in SQL.", "Concatenation syntax differs: || in SQLite/PostgreSQL, CONCAT in MySQL.", "Wrapping a column in a function inside WHERE usually prevents index use."]
        }
      ]
    }
  },
  {
    id: "numeric-functions",
    slug: "numeric-functions",
    title: "Numeric Functions and Integer Division",
    description: "ROUND, ABS, modulo, CAST, and the integer-division trap.",
    estimatedMinutes: 12,
    content: {
      sections: [
        {
          type: "code",
          title: "Arithmetic on Salaries",
          language: "sql",
          code: "SELECT name, salary,\n       ROUND(salary * 1.075)      AS raised,       -- 91375.0\n       salary / 12                AS monthly_int,  -- 7083  (integer division!)\n       ROUND(salary / 12.0, 2)    AS monthly       -- 7083.33\nFROM employees WHERE id = 1;",
          explanation: "When both operands are integers, SQLite, PostgreSQL and SQL Server do integer division and drop the fraction. Make one operand decimal (12.0) or CAST it."
        },
        {
          type: "table",
          title: "Quick Reference",
          headers: ["Expression", "Result"],
          rows: [
            ["`ABS(-5)`", "5"], ["`17 % 5`", "2 (remainder)"], ["`ROUND(2.567, 1)`", "2.6"],
            ["`7 / 2`", "3 (integer division)"], ["`7 / 2.0`", "3.5"], ["`CAST(7 / 2 AS INTEGER)`", "3"]
          ]
        },
        {
          type: "warning",
          title: "Common Mistakes",
          items: [
            "Calculating percentages as `count / total * 100` with integers gives 0. Write `100.0 * count / total`.",
            "MySQL's `/` always returns a decimal; use `DIV` there for integer division. Know which database the interviewer means.",
            "Storing money as FLOAT causes rounding errors. Use DECIMAL(12, 2), or integer paise or cents."
          ]
        },
        {
          type: "quickCheck",
          question: "In SQLite, what does SELECT 5 / 2 * 2 return?",
          options: ["5", "4", "5.0", "4.0"],
          answer: 1,
          explanation: "5 / 2 = 2 (integer division), then 2 × 2 = 4."
        },
        {
          type: "takeaways",
          items: ["Integer / integer = integer in most databases; multiply by 1.0 or 100.0 first.", "Use DECIMAL for money."]
        }
      ]
    }
  },
  {
    id: "date-functions",
    slug: "date-functions",
    title: "Date and Time Functions",
    description: "Extracting parts, date arithmetic, computing tenure, and how dialects differ.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "code",
          title: "SQLite Date Functions",
          language: "sql",
          code: "-- Extract year and month\nSELECT name, strftime('%Y', hire_date) AS yr, strftime('%m', hire_date) AS mon\nFROM employees WHERE id IN (1, 6);\n-- Alice 2023 01\n-- Fiona 2020 03\n\n-- Whole years of service as of 2025-01-01\nSELECT name,\n       CAST((julianday('2025-01-01') - julianday(hire_date)) / 365.25 AS INTEGER) AS years\nFROM employees ORDER BY years DESC LIMIT 3;\n-- Fiona 4, Diana 3, Bob 2\n\n-- Date arithmetic\nSELECT date('2024-03-15', '-10 days'),        -- 2024-03-05\n       date('2024-02-10', 'start of month');  -- 2024-02-01",
          explanation: "SQLite has no DATE type: dates are stored as ISO text and handled by date(), strftime() and julianday()."
        },
        {
          type: "table",
          title: "The Same Tasks in Other Databases",
          headers: ["Task", "MySQL", "PostgreSQL"],
          rows: [
            ["Current date", "`CURDATE()`", "`CURRENT_DATE`"],
            ["Year of a date", "`YEAR(d)`", "`EXTRACT(YEAR FROM d)`"],
            ["Add 30 days", "`DATE_ADD(d, INTERVAL 30 DAY)`", "`d + INTERVAL '30 days'`"],
            ["Days between", "`DATEDIFF(d2, d1)`", "`d2 - d1`"],
            ["Format", "`DATE_FORMAT(d, '%Y-%m')`", "`TO_CHAR(d, 'YYYY-MM')`"]
          ]
        },
        {
          type: "tryIt",
          title: "Predict the Output (an edge case)",
          code: "SELECT date('2024-01-31', '+1 month');",
          expectedOutput: "2024-03-02",
          explanation: "SQLite adds one to the month (giving 2024-02-31), then normalizes the invalid date by overflowing into March. PostgreSQL would return 2024-02-29. Month arithmetic near the end of a month differs between databases, so test it."
        },
        {
          type: "quickCheck",
          question: "Which SQLite expression returns the hire month as text like '05'?",
          options: ["MONTH(hire_date)", "strftime('%m', hire_date)", "EXTRACT(MONTH FROM hire_date)", "SUBSTR(hire_date, 1, 2)"],
          answer: 1,
          explanation: "strftime('%m', ...) gives a zero-padded month. SUBSTR(hire_date, 6, 2) would also work; SUBSTR(..., 1, 2) gives the century digits."
        },
        {
          type: "takeaways",
          items: ["Store dates in ISO format (YYYY-MM-DD).", "Date functions differ most across databases; learn your target database's set.", "Watch end-of-month arithmetic."]
        }
      ]
    }
  },
  {
    id: "case-coalesce-nullif",
    slug: "case-coalesce-nullif",
    title: "CASE Expressions, COALESCE and NULLIF",
    description: "Conditional logic inside queries: categorizing rows, conditional counts, and safe division.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "code",
          title: "Categorizing With CASE",
          language: "sql",
          code: "SELECT name, salary,\n       CASE\n         WHEN salary >= 80000 THEN 'High'\n         WHEN salary >= 65000 THEN 'Medium'\n         ELSE 'Entry'\n       END AS band\nFROM employees\nORDER BY salary DESC;",
          explanation: "Conditions are checked top to bottom and the first match wins, which is why the bounds only need one side each. Without ELSE, unmatched rows get NULL."
        },
        {
          type: "table",
          title: "Result",
          headers: ["name", "salary", "band"],
          rows: [
            ["Fiona", "92000", "High"], ["Alice", "85000", "High"], ["Bob", "78000", "Medium"], ["Diana", "72000", "Medium"],
            ["Hannah", "71000", "Medium"], ["Evan", "68000", "Medium"], ["Charlie", "65000", "Medium"], ["George", "58000", "Entry"]
          ]
        },
        {
          type: "code",
          title: "Conditional Aggregation (pivot-style counts)",
          language: "sql",
          code: "SELECT\n  SUM(CASE WHEN department = 'Engineering' THEN 1 ELSE 0 END) AS eng,\n  SUM(CASE WHEN department <> 'Engineering' THEN 1 ELSE 0 END) AS others\nFROM employees;\n-- eng = 3, others = 5",
          explanation: "This pattern turns rows into columns, and it comes up in interviews constantly."
        },
        {
          type: "code",
          title: "NULLIF for Safe Division",
          language: "sql",
          code: "SELECT NULLIF(10, 10), NULLIF(10, 5), COALESCE(NULL, NULL, 'x');\n-- NULL, 10, 'x'\n\n-- Avoid divide-by-zero: if total is 0, NULLIF makes it NULL, so the result is NULL instead of an error\nSELECT 100.0 * passed / NULLIF(total, 0) AS pass_pct FROM results;",
          explanation: "NULLIF(a, b) returns NULL when a = b, otherwise a. COALESCE returns its first non-NULL argument."
        },
        {
          type: "quickCheck",
          question: "With the bands above, which band does a salary of exactly 80000 get?",
          options: ["High", "Medium", "Entry", "NULL"],
          answer: 0,
          explanation: "The first condition, salary >= 80000, is true, and the first match wins."
        },
        {
          type: "takeaways",
          items: ["CASE: the first true WHEN wins; add ELSE to avoid NULLs.", "SUM(CASE WHEN ... THEN 1 ELSE 0 END) = conditional count.", "NULLIF(x, 0) prevents divide-by-zero."]
        }
      ]
    }
  }
];

export const groupingLessons: CourseLesson[] = [
  {
    id: "aggregate-functions",
    slug: "aggregate-functions",
    title: "Aggregate Functions: COUNT, SUM, AVG, MIN, MAX",
    description: "Collapse many rows into one summary value, and the difference between COUNT(*), COUNT(col) and COUNT(DISTINCT col).",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "code",
          title: "Summarizing the Whole Table",
          language: "sql",
          code: "SELECT COUNT(*)      AS n,\n       SUM(salary)   AS total,\n       AVG(salary)   AS avg_sal,\n       MIN(salary)   AS lowest,\n       MAX(salary)   AS highest\nFROM employees;\n-- 8 | 589000 | 73625.0 | 58000 | 92000\n\nSELECT COUNT(DISTINCT department) FROM employees;  -- 4",
          explanation: "Without GROUP BY, an aggregate treats the whole table as one group and returns exactly one row."
        },
        {
          type: "table",
          title: "The COUNT Variants",
          headers: ["Expression", "Counts"],
          rows: [
            ["`COUNT(*)`", "All rows, including rows full of NULLs"],
            ["`COUNT(column)`", "Rows where that column isn't NULL"],
            ["`COUNT(DISTINCT column)`", "Distinct non-NULL values"]
          ]
        },
        {
          type: "warning",
          title: "Common Mistakes",
          items: [
            "Mixing aggregates with plain columns without GROUP BY: `SELECT name, MAX(salary) FROM employees`. Standard SQL rejects it; SQLite and old MySQL quietly return an arbitrary name.",
            "Using an aggregate in WHERE (`WHERE salary > AVG(salary)`) is invalid. Use a subquery or HAVING."
          ]
        },
        {
          type: "quickCheck",
          question: "How many rows does SELECT COUNT(*) FROM employees WHERE salary > 100000 return?",
          options: ["0 rows", "1 row containing 0", "1 row containing NULL", "An error"],
          answer: 1,
          explanation: "An aggregate with no GROUP BY always returns one row. COUNT of an empty set is 0 (SUM, AVG, MIN and MAX of an empty set are NULL)."
        },
        {
          type: "takeaways",
          items: ["COUNT(*) counts rows; COUNT(col) skips NULLs; COUNT(DISTINCT col) counts unique values.", "Aggregates can't appear in WHERE."]
        }
      ]
    }
  },
  {
    id: "group-by",
    slug: "group-by",
    title: "GROUP BY: One Summary Row per Group",
    description: "Group rows by one or more columns, and the rule for which columns may appear in SELECT.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "code",
          title: "Headcount and Average Salary by Department",
          language: "sql",
          code: "SELECT department,\n       COUNT(*)    AS headcount,\n       AVG(salary) AS avg_salary\nFROM employees\nGROUP BY department\nORDER BY avg_salary DESC;",
          explanation: "GROUP BY splits the rows into buckets (one per department), then each aggregate runs separately inside each bucket."
        },
        {
          type: "table",
          title: "Result",
          headers: ["department", "headcount", "avg_salary"],
          rows: [["Engineering", "3", "85000.0"], ["HR", "1", "72000.0"], ["Marketing", "2", "69500.0"], ["Sales", "2", "61500.0"]]
        },
        {
          type: "text",
          title: "The Golden Rule",
          content: "Every column in SELECT must either appear in GROUP BY or sit inside an aggregate function. Each group becomes one output row, so a plain column that isn't grouped has many possible values for that row, and the database can't pick one."
        },
        {
          type: "code",
          title: "Grouping by an Expression",
          language: "sql",
          code: "SELECT strftime('%Y', hire_date) AS yr, COUNT(*) AS hires\nFROM employees\nGROUP BY yr\nORDER BY yr;\n-- 2020 1 | 2021 1 | 2022 2 | 2023 3 | 2024 1",
          explanation: "SQLite and MySQL allow the alias (yr) in GROUP BY; PostgreSQL does too. SQL Server requires repeating the expression."
        },
        {
          type: "quickCheck",
          question: "Which query is valid in standard SQL?",
          options: [
            "SELECT department, name, COUNT(*) FROM employees GROUP BY department",
            "SELECT department, COUNT(*) FROM employees GROUP BY department",
            "SELECT name, COUNT(*) FROM employees GROUP BY department",
            "SELECT * FROM employees GROUP BY department"
          ],
          answer: 1,
          explanation: "Only option B selects nothing but grouped columns and aggregates."
        },
        {
          type: "takeaways",
          items: ["GROUP BY makes one output row per distinct group value.", "SELECT only grouped columns and aggregates."]
        }
      ]
    }
  },
  {
    id: "having-and-query-order",
    slug: "having-and-query-order",
    title: "HAVING vs WHERE and the Logical Order of a Query",
    description: "Filter groups with HAVING, filter rows with WHERE, and know the order SQL actually evaluates clauses in.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "table",
          title: "Logical Processing Order",
          headers: ["Step", "Clause", "What it does"],
          rows: [
            ["1", "FROM / JOIN", "Build the working set of rows"],
            ["2", "WHERE", "Filter individual rows"],
            ["3", "GROUP BY", "Form groups"],
            ["4", "HAVING", "Filter whole groups"],
            ["5", "SELECT", "Compute output columns and aliases (window functions run here)"],
            ["6", "DISTINCT", "Remove duplicate rows"],
            ["7", "ORDER BY", "Sort (aliases are allowed here)"],
            ["8", "LIMIT / OFFSET", "Trim the result"]
          ]
        },
        {
          type: "code",
          title: "WHERE and HAVING Together",
          language: "sql",
          code: "-- Among employees hired since 2022, which departments have a top salary above 70000?\nSELECT department, MAX(salary) AS top\nFROM employees\nWHERE hire_date >= '2022-01-01'      -- row filter (before grouping)\nGROUP BY department\nHAVING MAX(salary) > 70000           -- group filter (after grouping)\nORDER BY top DESC;\n-- Engineering 85000   (Fiona, hired 2020, is excluded by WHERE)\n-- Marketing   71000",
          explanation: "WHERE removed Fiona and Diana before grouping, which is why Engineering's top value is 85000 and HR disappears entirely."
        },
        {
          type: "code",
          title: "Departments With At Least Two People",
          language: "sql",
          code: "SELECT department, COUNT(*) AS headcount\nFROM employees\nGROUP BY department\nHAVING COUNT(*) >= 2\nORDER BY department;\n-- Engineering 3, Marketing 2, Sales 2",
          explanation: "HR (headcount 1) is filtered out after grouping."
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "WHERE vs HAVING?",
              trap: "Saying 'HAVING is for aggregates' and stopping there.",
              solution: "WHERE filters rows before grouping and can't use aggregates. HAVING filters groups after aggregation. Put every row-level condition in WHERE: it shrinks the data before the expensive grouping step."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "Why can ORDER BY use a SELECT alias but WHERE can't?",
          options: ["Database bug", "ORDER BY runs after SELECT; WHERE runs before it", "WHERE only accepts numbers", "Aliases only work with LIMIT"],
          answer: 1,
          explanation: "In the logical order, aliases exist only from the SELECT step onwards."
        },
        {
          type: "takeaways",
          items: [
            "Order: FROM → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT.",
            "WHERE filters rows; HAVING filters groups.",
            "Push row conditions into WHERE for speed."
          ]
        }
      ]
    }
  }
];
