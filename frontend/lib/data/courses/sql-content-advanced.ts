// SQL Modules 9-10: Advanced SQL, Placement SQL
// Queries run in the StudyHub SQL Lab (SQLite) against the preloaded employees/departments tables.
// Lessons that need extra data include their own setup script. Results were captured from SQLite.
import { CourseLesson } from './types';

const MANAGER_SETUP = "-- Run once in the SQL Lab to add a reporting line\nALTER TABLE employees ADD COLUMN manager_id INTEGER;\nUPDATE employees SET manager_id = 6 WHERE id IN (1, 2);        -- Alice, Bob report to Fiona\nUPDATE employees SET manager_id = 4 WHERE id IN (3, 5, 6, 8);  -- Charlie, Evan, Fiona, Hannah report to Diana\nUPDATE employees SET manager_id = 3 WHERE id = 7;              -- George reports to Charlie\n-- Diana has no manager (NULL)";

export const advancedSqlLessons: CourseLesson[] = [
  {
    id: "common-table-expressions",
    slug: "common-table-expressions",
    title: "Common Table Expressions (WITH)",
    description: "Name intermediate results to make multi-step queries readable, and chain several CTEs.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "text",
          title: "Why CTEs?",
          content: "A CTE is a named, temporary result defined with WITH at the top of a query. It turns deeply nested subqueries into a readable top-to-bottom pipeline: step 1, step 2, final answer. It exists only for that one statement."
        },
        {
          type: "code",
          title: "Above-Average Earners per Department",
          language: "sql",
          code: "WITH dept_avg AS (\n  SELECT department, AVG(salary) AS avg_sal\n  FROM employees\n  GROUP BY department\n)\nSELECT e.name, e.department, e.salary, d.avg_sal\nFROM employees e\nJOIN dept_avg d ON d.department = e.department\nWHERE e.salary > d.avg_sal\nORDER BY e.department;",
          explanation: "The same result as the correlated-subquery version, but every step is named and can be read in order."
        },
        {
          type: "table",
          title: "Result",
          headers: ["name", "department", "salary", "avg_sal"],
          rows: [["Fiona", "Engineering", "92000", "85000.0"], ["Hannah", "Marketing", "71000", "69500.0"], ["Charlie", "Sales", "65000", "61500.0"]]
        },
        {
          type: "code",
          title: "Chaining CTEs",
          language: "sql",
          code: "WITH payroll AS (\n  SELECT department, SUM(salary) AS total FROM employees GROUP BY department\n),\nwith_budget AS (\n  SELECT p.department, p.total, d.budget,\n         ROUND(100.0 * p.total / d.budget, 1) AS pct_used\n  FROM payroll p JOIN departments d ON d.name = p.department\n)\nSELECT * FROM with_budget ORDER BY pct_used DESC;\n-- Marketing 139000 250000 55.6\n-- Engineering 255000 500000 51.0\n-- Sales 123000 300000 41.0\n-- HR 72000 200000 36.0",
          explanation: "Later CTEs can refer to earlier ones. Separate them with commas and use WITH only once."
        },
        {
          type: "quickCheck",
          question: "How long does a CTE's result exist?",
          options: ["Until the session ends", "Only for the single statement it is defined in", "Until COMMIT", "Permanently, like a view"],
          answer: 1,
          explanation: "A CTE is scoped to one statement. For reuse across statements, create a view or a temporary table."
        },
        {
          type: "takeaways",
          items: ["WITH name AS (...) names a step; chain steps with commas.", "CTEs improve readability; performance is usually the same as the equivalent subquery."]
        }
      ]
    }
  },
  {
    id: "recursive-ctes",
    slug: "recursive-ctes",
    title: "Recursive CTEs: Sequences and Hierarchies",
    description: "Generate series and walk org charts or category trees with WITH RECURSIVE.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "code",
          title: "Anatomy: Generate 1 to 5",
          language: "sql",
          code: "WITH RECURSIVE nums(n) AS (\n  SELECT 1                 -- anchor: the starting row(s)\n  UNION ALL\n  SELECT n + 1 FROM nums   -- recursive step: built from the previous rows\n  WHERE n < 5              -- stop condition\n)\nSELECT n FROM nums;\n-- 1, 2, 3, 4, 5",
          explanation: "The anchor runs once. The recursive part runs repeatedly on the rows produced by the previous round until it produces no new rows."
        },
        {
          type: "code",
          title: "Setup: Add Managers",
          language: "sql",
          code: MANAGER_SETUP,
          explanation: "Run this once in the SQL Lab. The data persists in your browser."
        },
        {
          type: "code",
          title: "Walk the Org Chart",
          language: "sql",
          code: "WITH RECURSIVE chain AS (\n  SELECT id, name, manager_id, 0 AS level\n  FROM employees WHERE manager_id IS NULL           -- start at the top (Diana)\n  UNION ALL\n  SELECT e.id, e.name, e.manager_id, c.level + 1\n  FROM employees e JOIN chain c ON e.manager_id = c.id\n)\nSELECT name, level FROM chain ORDER BY level, name;",
          explanation: "Each round finds the direct reports of the people found in the previous round."
        },
        {
          type: "table",
          title: "Result",
          headers: ["name", "level"],
          rows: [["Diana", "0"], ["Charlie", "1"], ["Evan", "1"], ["Fiona", "1"], ["Hannah", "1"], ["Alice", "2"], ["Bob", "2"], ["George", "2"]]
        },
        {
          type: "warning",
          title: "Common Mistakes",
          items: [
            "Forgetting the stop condition or having a cycle in the data (A manages B, B manages A) loops forever. Add a depth limit such as `WHERE level < 20`.",
            "Using UNION instead of UNION ALL: UNION de-duplicates every round, which is slower (though it can help stop cycles).",
            "SQL Server writes just `WITH` (no RECURSIVE keyword); PostgreSQL, MySQL 8 and SQLite need `WITH RECURSIVE`."
          ]
        },
        {
          type: "quickCheck",
          question: "In a recursive CTE, which part runs exactly once?",
          options: ["The recursive member", "The anchor member", "The final SELECT runs once per level", "None of them"],
          answer: 1,
          explanation: "The anchor seeds the recursion; the recursive member repeats until it returns no rows."
        },
        {
          type: "takeaways",
          items: ["Recursive CTE = anchor UNION ALL recursive step, with a stop condition.", "Use it for hierarchies (org charts, categories, comment threads) and generated series."]
        }
      ]
    }
  },
  {
    id: "window-functions-ranking",
    slug: "window-functions-ranking",
    title: "Window Functions: ROW_NUMBER, RANK, DENSE_RANK, NTILE",
    description: "Rank rows without collapsing them, how ties are handled, and PARTITION BY.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "text",
          title: "Window vs GROUP BY",
          content: "GROUP BY collapses rows: one output row per group. A window function computes over a set of related rows (the window) but keeps every row. The OVER(...) clause defines the window:\nPARTITION BY splits it into groups (like GROUP BY, but nothing is collapsed);\nORDER BY orders rows inside each partition."
        },
        {
          type: "code",
          title: "Ranking With a Tie",
          language: "sql",
          code: "-- Make a tie first: give Bob the same salary as Alice\nUPDATE employees SET salary = 85000 WHERE id = 2;\n\nSELECT name, salary,\n       ROW_NUMBER() OVER (ORDER BY salary DESC) AS rn,\n       RANK()       OVER (ORDER BY salary DESC) AS rnk,\n       DENSE_RANK() OVER (ORDER BY salary DESC) AS drnk\nFROM employees\nORDER BY salary DESC\nLIMIT 5;",
          explanation: "Undo the change afterwards with: UPDATE employees SET salary = 78000 WHERE id = 2;"
        },
        {
          type: "table",
          title: "Result",
          headers: ["name", "salary", "ROW_NUMBER", "RANK", "DENSE_RANK"],
          rows: [
            ["Fiona", "92000", "1", "1", "1"],
            ["Alice", "85000", "2", "2", "2"],
            ["Bob", "85000", "3", "2", "2"],
            ["Diana", "72000", "4", "4", "3"],
            ["Hannah", "71000", "5", "5", "4"]
          ]
        },
        {
          type: "table",
          title: "How They Differ",
          headers: ["Function", "Ties", "Sequence"],
          rows: [
            ["ROW_NUMBER()", "Tied rows get different numbers (in an arbitrary order)", "1, 2, 3, 4"],
            ["RANK()", "Same rank, then a gap", "1, 2, 2, 4"],
            ["DENSE_RANK()", "Same rank, no gap", "1, 2, 2, 3"],
            ["NTILE(n)", "Splits the rows into n nearly equal buckets", "1, 1, 2, 2, ..."]
          ]
        },
        {
          type: "code",
          title: "Rank Within Each Department",
          language: "sql",
          code: "SELECT name, department, salary,\n       RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank\nFROM employees\nORDER BY department, dept_rank;\n-- Fiona Engineering 1 | Alice 2 | Bob 3 | Diana HR 1 | Hannah Marketing 1 | Evan 2 | Charlie Sales 1 | George 2",
          explanation: "Numbering restarts at 1 in each partition."
        },
        {
          type: "warning",
          title: "Common Mistakes",
          items: [
            "Filtering on a window function in WHERE (`WHERE dept_rank = 1`) is invalid, because windows are computed after WHERE. Wrap the query in a subquery or CTE and filter outside.",
            "Using ROW_NUMBER for 'top earners' when ties should be included. Use DENSE_RANK or RANK."
          ]
        },
        {
          type: "quickCheck",
          question: "Salaries 100, 90, 90, 80. What DENSE_RANK (descending) does 80 get?",
          options: ["3", "4", "2", "5"],
          answer: 0,
          explanation: "DENSE_RANK: 100 → 1, both 90s → 2, 80 → 3 (no gap). RANK would give 4."
        },
        {
          type: "takeaways",
          items: [
            "Window functions keep every row; OVER(PARTITION BY ... ORDER BY ...) defines the window.",
            "ROW_NUMBER = unique, RANK = gaps after ties, DENSE_RANK = no gaps.",
            "To filter on a window result, wrap the query and filter outside."
          ]
        }
      ]
    }
  },
  {
    id: "window-functions-analytics",
    slug: "window-functions-analytics",
    title: "Analytic Windows: Running Totals, LAG / LEAD, Percent of Total",
    description: "SUM/AVG over windows, comparing a row with the previous one, and per-group comparisons.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "code",
          title: "Running Total of Payroll by Hire Date",
          language: "sql",
          code: "SELECT name, hire_date, salary,\n       SUM(salary) OVER (ORDER BY hire_date) AS running_payroll\nFROM employees\nORDER BY hire_date;",
          explanation: "With ORDER BY inside OVER, the default frame is 'from the first row up to the current row', so SUM becomes a running total."
        },
        {
          type: "table",
          title: "Result",
          headers: ["name", "hire_date", "salary", "running_payroll"],
          rows: [
            ["Fiona", "2020-03-10", "92000", "92000"], ["Diana", "2021-11-20", "72000", "164000"],
            ["Hannah", "2022-01-18", "71000", "235000"], ["Bob", "2022-07-10", "78000", "313000"],
            ["Alice", "2023-01-15", "85000", "398000"], ["Evan", "2023-05-12", "68000", "466000"],
            ["George", "2023-09-01", "58000", "524000"], ["Charlie", "2024-02-01", "65000", "589000"]
          ]
        },
        {
          type: "code",
          title: "LAG and LEAD: Look at Neighbouring Rows",
          language: "sql",
          code: "SELECT name, hire_date,\n       LAG(name)       OVER (ORDER BY hire_date) AS hired_before,\n       LEAD(hire_date) OVER (ORDER BY hire_date) AS next_hire\nFROM employees\nORDER BY hire_date;\n-- Fiona   2020-03-10  NULL     2021-11-20\n-- Diana   2021-11-20  Fiona    2022-01-18\n-- ...\n-- Charlie 2024-02-01  George   NULL",
          explanation: "LAG reads the previous row and LEAD the next one; the first and last rows get NULL (or a default: LAG(x, 1, 0)). This is the standard tool for month-over-month growth: value − LAG(value)."
        },
        {
          type: "code",
          title: "Compare Each Row With Its Group, and With the Total",
          language: "sql",
          code: "SELECT name, department, salary,\n       AVG(salary) OVER (PARTITION BY department)          AS dept_avg,\n       salary - AVG(salary) OVER (PARTITION BY department) AS diff\nFROM employees\nORDER BY department, salary DESC;\n-- Fiona Engineering 92000 85000 7000 ... George Sales 58000 61500 -3500\n\nSELECT name, salary,\n       ROUND(100.0 * salary / SUM(salary) OVER (), 1) AS pct_of_total\nFROM employees ORDER BY salary DESC LIMIT 3;\n-- Fiona 15.6, Alice 14.4, Bob 13.2",
          explanation: "An empty OVER () means the window is the whole result set."
        },
        {
          type: "text",
          title: "Frames (Advanced)",
          content: "You can set the frame explicitly:\nROWS BETWEEN 2 PRECEDING AND CURRENT ROW gives a 3-row moving average.\nROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING covers the whole partition.\nRANGE (the default) treats rows with the same ORDER BY value as peers and includes them together; ROWS counts physical rows."
        },
        {
          type: "quickCheck",
          question: "Which function gives you the previous month's revenue on the same row as this month's?",
          options: ["LEAD(revenue)", "LAG(revenue)", "FIRST_VALUE(revenue)", "NTILE(2)"],
          answer: 1,
          explanation: "LAG looks back one row in the window order; LEAD looks forward."
        },
        {
          type: "takeaways",
          items: [
            "SUM(...) OVER (ORDER BY ...) = running total; OVER () = the whole result set.",
            "LAG/LEAD compare a row with its neighbours: growth, gaps, streaks.",
            "PARTITION BY lets each row see its own group's statistics."
          ]
        }
      ]
    }
  },
  {
    id: "set-operations",
    slug: "set-operations",
    title: "Set Operations: UNION, UNION ALL, INTERSECT, EXCEPT",
    description: "Combine the results of several queries vertically, and why UNION ALL is usually what you want.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "table",
          title: "Set Operators",
          headers: ["Operator", "Returns", "Example result here"],
          rows: [
            ["UNION", "Rows from either query, duplicates removed", "Engineering, HR, Marketing, Sales"],
            ["UNION ALL", "Rows from either query, duplicates kept", "12 rows (8 + 4)"],
            ["INTERSECT", "Rows present in both", "Departments with someone hired before 2022: Engineering, HR"],
            ["EXCEPT (MINUS in Oracle)", "Rows in the first query but not the second", "Departments with nobody under 70000: Engineering, HR"]
          ]
        },
        {
          type: "code",
          title: "Examples",
          language: "sql",
          code: "SELECT department FROM employees\nUNION\nSELECT name FROM departments;           -- 4 distinct names\n\nSELECT name FROM departments\nINTERSECT\nSELECT department FROM employees WHERE hire_date < '2022-01-01';\n-- Engineering, HR\n\nSELECT name FROM departments\nEXCEPT\nSELECT department FROM employees WHERE salary < 70000;\n-- Engineering, HR",
          explanation: "Both queries must return the same number of columns with compatible types. Column names come from the first query."
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "UNION vs UNION ALL?",
              trap: "Saying they're the same, or always using UNION.",
              solution: "UNION removes duplicates, which needs a sort or hash step. UNION ALL just appends the rows. Use UNION ALL unless you specifically need de-duplication: it's faster and doesn't silently drop rows that are legitimately identical."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "Query A returns 5 rows and query B returns 3 rows; 2 rows appear in both. How many rows does A UNION ALL B return?",
          options: ["6", "8", "5", "3"],
          answer: 1,
          explanation: "UNION ALL keeps everything: 5 + 3 = 8. UNION would return 6 (if each query has no internal duplicates)."
        },
        {
          type: "takeaways",
          items: ["UNION de-duplicates; UNION ALL keeps every row and is faster.", "INTERSECT = in both; EXCEPT/MINUS = in the first but not the second."]
        }
      ]
    }
  }
];

export const placementSqlLessons: CourseLesson[] = [
  {
    id: "nth-highest-salary",
    slug: "nth-highest-salary",
    title: "Nth Highest Salary (the most asked SQL question)",
    description: "Four ways to find the 2nd or Nth highest salary, and how each one handles ties.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "code",
          title: "Approach 1: MAX Below MAX (2nd highest only)",
          language: "sql",
          code: "SELECT MAX(salary) AS second_highest\nFROM employees\nWHERE salary < (SELECT MAX(salary) FROM employees);\n-- 85000",
          explanation: "Simple and handles ties correctly, but it only works for N = 2."
        },
        {
          type: "code",
          title: "Approach 2: DISTINCT + LIMIT / OFFSET",
          language: "sql",
          code: "-- Nth highest: OFFSET N - 1 (3rd highest here)\nSELECT DISTINCT salary\nFROM employees\nORDER BY salary DESC\nLIMIT 1 OFFSET 2;\n-- 78000",
          explanation: "DISTINCT is essential. Without it, two people sharing the top salary would make the '2nd highest' equal to the 1st."
        },
        {
          type: "code",
          title: "Approach 3: DENSE_RANK (the most robust)",
          language: "sql",
          code: "SELECT DISTINCT salary\nFROM (\n  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS r\n  FROM employees\n) t\nWHERE r = 3;\n-- 78000",
          explanation: "Works for any N, handles ties, and extends easily to 'Nth highest per department' by adding PARTITION BY department."
        },
        {
          type: "code",
          title: "Approach 4: Correlated COUNT (no window functions needed)",
          language: "sql",
          code: "-- Employees in the top 2 distinct salaries\nSELECT name, salary\nFROM employees e\nWHERE 2 > (SELECT COUNT(DISTINCT salary)\n           FROM employees x\n           WHERE x.salary > e.salary)\nORDER BY salary DESC;\n-- Fiona 92000, Alice 85000",
          explanation: "A salary is in the top N if fewer than N distinct salaries are greater than it. This is O(n²), but it works in very old databases."
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "What should the query return when there is no Nth salary?",
              trap: "Returning an empty result when the interviewer expects NULL.",
              solution: "Wrap it so an aggregate always returns one row: `SELECT (SELECT DISTINCT salary FROM employees ORDER BY salary DESC LIMIT 1 OFFSET N-1) AS nth`. Ask which behaviour is expected (LeetCode's version expects NULL)."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "If Alice and Bob both earn 85000 and Fiona earns 92000, what is the 2nd highest DISTINCT salary?",
          options: ["92000", "85000", "72000", "78000"],
          answer: 1,
          explanation: "The distinct salaries in descending order are 92000, 85000, 72000, ..., so the second one is 85000."
        },
        {
          type: "takeaways",
          items: ["Use DISTINCT or DENSE_RANK so ties don't break the answer.", "DENSE_RANK generalizes to any N and to per-group questions.", "Clarify the empty-result behaviour with the interviewer."]
        }
      ]
    }
  },
  {
    id: "duplicates-find-and-delete",
    slug: "duplicates-find-and-delete",
    title: "Find and Delete Duplicate Rows",
    description: "Detect duplicates with GROUP BY / HAVING, list the extra copies, and delete them while keeping one.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "code",
          title: "Setup",
          language: "sql",
          code: "CREATE TABLE emails (id INTEGER PRIMARY KEY, email TEXT);\nINSERT INTO emails VALUES\n (1,'a@x.com'), (2,'b@x.com'), (3,'a@x.com'),\n (4,'c@x.com'), (5,'b@x.com'), (6,'a@x.com');",
          explanation: "Run this in the SQL Lab."
        },
        {
          type: "code",
          title: "1. Which Values Are Duplicated?",
          language: "sql",
          code: "SELECT email, COUNT(*) AS times\nFROM emails\nGROUP BY email\nHAVING COUNT(*) > 1;\n-- a@x.com 3\n-- b@x.com 2",
          explanation: "GROUP BY the column(s) that define 'duplicate', then keep groups with more than one row."
        },
        {
          type: "code",
          title: "2. Which Rows Are the Extra Copies?",
          language: "sql",
          code: "SELECT id, email\nFROM (\n  SELECT id, email,\n         ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) AS rn\n  FROM emails\n) t\nWHERE rn > 1;\n-- 3 a@x.com, 5 b@x.com, 6 a@x.com",
          explanation: "rn = 1 is the copy we keep (the lowest id); everything with rn > 1 is an extra."
        },
        {
          type: "code",
          title: "3. Delete the Extras, Keep One",
          language: "sql",
          code: "DELETE FROM emails\nWHERE id NOT IN (\n  SELECT MIN(id) FROM emails GROUP BY email\n);\n\nSELECT * FROM emails;\n-- 1 a@x.com, 2 b@x.com, 4 c@x.com\n\n-- Prevent it from happening again\nCREATE UNIQUE INDEX ux_emails_email ON emails(email);",
          explanation: "The NOT IN here is safe because MIN(id) is never NULL. MySQL doesn't allow selecting from the table you're deleting from, so there you wrap the subquery in a derived table or use a self-join DELETE."
        },
        {
          type: "quickCheck",
          question: "After deleting duplicates, what stops new duplicates from being inserted?",
          options: ["An index on id", "A UNIQUE constraint or index on email", "ORDER BY email", "A view"],
          answer: 1,
          explanation: "Only a UNIQUE constraint makes the database reject duplicate values."
        },
        {
          type: "takeaways",
          items: ["Find: GROUP BY ... HAVING COUNT(*) > 1.", "Identify the extras: ROW_NUMBER() OVER (PARTITION BY key ORDER BY id) > 1.", "Delete, then add a UNIQUE constraint."]
        }
      ]
    }
  },
  {
    id: "top-n-per-group",
    slug: "top-n-per-group",
    title: "Top-N per Group and Highest Earner per Department",
    description: "The 'top 2 salaries in each department' pattern with window functions and a correlated alternative.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "code",
          title: "Highest Earner in Each Department",
          language: "sql",
          code: "SELECT e.department, e.name, e.salary\nFROM employees e\nWHERE e.salary = (SELECT MAX(salary) FROM employees x\n                  WHERE x.department = e.department)\nORDER BY e.department;\n-- Engineering Fiona 92000 | HR Diana 72000 | Marketing Hannah 71000 | Sales Charlie 65000",
          explanation: "Ties are included automatically: if two people share the maximum, both are returned."
        },
        {
          type: "code",
          title: "Top 2 per Department",
          language: "sql",
          code: "SELECT department, name, salary\nFROM (\n  SELECT department, name, salary,\n         DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS r\n  FROM employees\n) t\nWHERE r <= 2\nORDER BY department, salary DESC;",
          explanation: "Change 2 to any N. Swap DENSE_RANK for ROW_NUMBER if you need exactly N rows even when there are ties."
        },
        {
          type: "table",
          title: "Result",
          headers: ["department", "name", "salary"],
          rows: [
            ["Engineering", "Fiona", "92000"], ["Engineering", "Alice", "85000"], ["HR", "Diana", "72000"],
            ["Marketing", "Hannah", "71000"], ["Marketing", "Evan", "68000"], ["Sales", "Charlie", "65000"], ["Sales", "George", "58000"]
          ]
        },
        {
          type: "warning",
          title: "Common Mistakes",
          items: [
            "`SELECT department, name, MAX(salary) ... GROUP BY department`: SQLite and old MySQL return some name, but not necessarily the one that earns the maximum. Standard SQL rejects it.",
            "Forgetting PARTITION BY ranks across the whole company instead of within each department."
          ]
        },
        {
          type: "quickCheck",
          question: "To return exactly 2 rows per department even when salaries tie, use:",
          options: ["RANK()", "DENSE_RANK()", "ROW_NUMBER()", "NTILE(2)"],
          answer: 2,
          explanation: "ROW_NUMBER assigns unique numbers, so rn <= 2 always gives at most 2 rows per partition."
        },
        {
          type: "takeaways",
          items: ["Top-N per group = rank inside PARTITION BY, then filter in an outer query.", "Choose ROW_NUMBER vs DENSE_RANK based on how ties should be handled."]
        }
      ]
    }
  },
  {
    id: "self-join-manager-questions",
    slug: "self-join-manager-questions",
    title: "Self-Joins: Employees and Their Managers",
    description: "Join a table to itself to answer 'earns more than their manager' and 'list each employee's manager'.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "code",
          title: "Setup",
          language: "sql",
          code: MANAGER_SETUP,
          explanation: "Skip this if you already ran it in the Recursive CTE lesson."
        },
        {
          type: "code",
          title: "Employees Who Earn More Than Their Manager",
          language: "sql",
          code: "SELECT e.name AS employee, m.name AS manager\nFROM employees e\nJOIN employees m ON e.manager_id = m.id\nWHERE e.salary > m.salary;\n-- Fiona (92000) earns more than Diana (72000)",
          explanation: "Two aliases of the same table: e plays the employee role and m the manager role."
        },
        {
          type: "code",
          title: "Every Employee With Their Manager (including the top boss)",
          language: "sql",
          code: "SELECT e.name AS employee, COALESCE(m.name, '(none)') AS manager\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.id\nORDER BY e.id;\n-- Alice Fiona | Bob Fiona | Charlie Diana | Diana (none) | Evan Diana | Fiona Diana | George Charlie | Hannah Diana",
          explanation: "A LEFT JOIN keeps Diana, who has no manager. An INNER JOIN would drop her."
        },
        {
          type: "think",
          question: "How would you count each manager's direct reports?",
          answerReveal: "SELECT m.name, COUNT(*) AS reports FROM employees e JOIN employees m ON e.manager_id = m.id GROUP BY m.id, m.name ORDER BY reports DESC; gives Diana 4, Fiona 2, Charlie 1."
        },
        {
          type: "quickCheck",
          question: "Why does listing all employees with their manager need a LEFT JOIN?",
          options: ["Self-joins require it", "To keep employees whose manager_id is NULL", "It's faster", "To remove duplicates"],
          answer: 1,
          explanation: "With an inner join, the top-level employee (no manager) has no match and disappears."
        },
        {
          type: "takeaways",
          items: ["Self-join = the same table under two aliases with different roles.", "Use a LEFT JOIN when the related row may be missing."]
        }
      ]
    }
  },
  {
    id: "consecutive-streaks-gaps",
    slug: "consecutive-streaks-gaps",
    title: "Consecutive Days, Streaks and Gaps (Gaps-and-Islands)",
    description: "Find login streaks with the 'date minus row number' trick.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "code",
          title: "Setup",
          language: "sql",
          code: "CREATE TABLE logins (user_id INTEGER, login_date TEXT);\nINSERT INTO logins VALUES\n (1,'2025-01-01'), (1,'2025-01-02'), (1,'2025-01-03'), (1,'2025-01-05'),\n (2,'2025-01-01'), (2,'2025-01-03'), (2,'2025-01-04');",
          explanation: "Run this in the SQL Lab."
        },
        {
          type: "dryRun",
          title: "The Trick: Consecutive Dates Minus Row Numbers Give the Same Value",
          iterations: [
            { step: "2025-01-01", variables: { "row_number": "1", "date − rn": "2024-12-31" }, description: "User 1" },
            { step: "2025-01-02", variables: { "row_number": "2", "date − rn": "2024-12-31" }, description: "Same group: consecutive" },
            { step: "2025-01-03", variables: { "row_number": "3", "date − rn": "2024-12-31" }, description: "Same group" },
            { step: "2025-01-05", variables: { "row_number": "4", "date − rn": "2025-01-01" }, description: "New group: there was a gap on Jan 4" }
          ]
        },
        {
          type: "code",
          title: "Streaks of 2 or More Days",
          language: "sql",
          code: "SELECT user_id,\n       MIN(login_date) AS streak_start,\n       MAX(login_date) AS streak_end,\n       COUNT(*)        AS days\nFROM (\n  SELECT user_id, login_date,\n         julianday(login_date)\n           - ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) AS grp\n  FROM logins\n) t\nGROUP BY user_id, grp\nHAVING COUNT(*) >= 2\nORDER BY user_id, streak_start;\n-- 1  2025-01-01  2025-01-03  3\n-- 2  2025-01-03  2025-01-04  2",
          explanation: "Each 'island' of consecutive days shares the same grp value, so GROUP BY grp collapses each streak into one row. In PostgreSQL write `login_date - ROW_NUMBER() ... * INTERVAL '1 day'`; in MySQL use DATE_SUB."
        },
        {
          type: "warning",
          title: "Edge Cases",
          items: [
            "Duplicate logins on the same day break the trick. De-duplicate first with SELECT DISTINCT user_id, login_date.",
            "For 'consecutive numbers' problems (e.g. 3 identical values in a row), LAG/LEAD comparisons are often simpler."
          ]
        },
        {
          type: "quickCheck",
          question: "Why does date − ROW_NUMBER stay constant across consecutive days?",
          options: ["Dates are stored as text", "Both increase by exactly 1 per row, so their difference doesn't change", "ROW_NUMBER resets every day", "julianday rounds the values"],
          answer: 1,
          explanation: "While days are consecutive, the date and the row number both go up by 1, so the difference stays the same. A gap makes the date jump by more than 1, which changes the difference."
        },
        {
          type: "takeaways",
          items: ["Gaps-and-islands: group by (date − ROW_NUMBER()) to collapse consecutive runs.", "De-duplicate first; adapt the date arithmetic to your database."]
        }
      ]
    }
  },
  {
    id: "reporting-queries",
    slug: "reporting-queries",
    title: "Reporting Queries: Pivots, Percentages and Cumulative Counts",
    description: "Typical business questions: budget use, high/low pivots, departments with no recent hires, cumulative hires.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "code",
          title: "Budget Utilization per Department",
          language: "sql",
          code: "SELECT d.name AS department, d.budget,\n       SUM(e.salary) AS payroll,\n       ROUND(100.0 * SUM(e.salary) / d.budget, 1) AS pct_used\nFROM departments d\nJOIN employees e ON e.department = d.name\nGROUP BY d.id, d.name, d.budget\nORDER BY pct_used DESC;\n-- Marketing 55.6 | Engineering 51.0 | Sales 41.0 | HR 36.0",
          explanation: "100.0 forces decimal division, so the percentages aren't truncated to integers."
        },
        {
          type: "code",
          title: "Pivot: High vs Low Earners per Department",
          language: "sql",
          code: "SELECT department,\n       SUM(CASE WHEN salary >= 70000 THEN 1 ELSE 0 END) AS high,\n       SUM(CASE WHEN salary <  70000 THEN 1 ELSE 0 END) AS low\nFROM employees\nGROUP BY department\nORDER BY department;\n-- Engineering 3 0 | HR 1 0 | Marketing 1 1 | Sales 0 2",
          explanation: "Conditional aggregation turns category values into columns, without needing a PIVOT keyword."
        },
        {
          type: "code",
          title: "Departments With No Hires Since 2024",
          language: "sql",
          code: "SELECT d.name\nFROM departments d\nLEFT JOIN employees e\n  ON e.department = d.name AND e.hire_date >= '2024-01-01'\nWHERE e.id IS NULL\nORDER BY d.id;\n-- Engineering, HR, Marketing",
          explanation: "The date condition must go in ON, not WHERE. Putting it in WHERE would throw away the NULL rows the anti-join needs."
        },
        {
          type: "code",
          title: "Hires per Year With a Cumulative Total",
          language: "sql",
          code: "SELECT strftime('%Y', hire_date) AS yr,\n       COUNT(*) AS hires,\n       SUM(COUNT(*)) OVER (ORDER BY strftime('%Y', hire_date)) AS cumulative\nFROM employees\nGROUP BY yr\nORDER BY yr;\n-- 2020 1 1 | 2021 1 2 | 2022 2 4 | 2023 3 7 | 2024 1 8",
          explanation: "A window function can wrap an aggregate: GROUP BY runs first, then the window runs over the grouped rows."
        },
        {
          type: "quickCheck",
          question: "In the 'no hires since 2024' query, what happens if `e.hire_date >= '2024-01-01'` moves into the WHERE clause?",
          options: ["Same result", "No rows are returned", "All departments are returned", "Syntax error"],
          answer: 1,
          explanation: "WHERE would keep only rows where hire_date >= 2024 AND e.id IS NULL. Those can't both be true (a NULL row has a NULL hire_date), so nothing comes back."
        },
        {
          type: "takeaways",
          items: [
            "Percentages: multiply by 100.0 before dividing.",
            "Pivot with SUM(CASE WHEN ...).",
            "Anti-join filters belong in ON, not WHERE.",
            "Window over aggregate = cumulative totals per group."
          ]
        }
      ]
    }
  },
  {
    id: "sql-interview-theory",
    slug: "sql-interview-theory",
    title: "SQL Interview Theory: The Questions Asked Every Time",
    description: "Rapid-fire conceptual questions with crisp answers: keys, joins, WHERE vs HAVING, DELETE vs TRUNCATE, and more.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "table",
          title: "Rapid-Fire Answers",
          headers: ["Question", "Crisp answer"],
          rows: [
            ["Primary key vs unique key", "PK: one per table, never NULL. UNIQUE: many per table, usually allows NULL."],
            ["WHERE vs HAVING", "WHERE filters rows before grouping; HAVING filters groups after aggregation."],
            ["DELETE vs TRUNCATE vs DROP", "DELETE: rows, WHERE allowed, logged. TRUNCATE: all rows, fast DDL. DROP: removes the table."],
            ["UNION vs UNION ALL", "UNION de-duplicates (slower); UNION ALL keeps every row."],
            ["INNER vs LEFT JOIN", "INNER: only matches. LEFT: all left rows, with NULLs where there's no match."],
            ["RANK vs DENSE_RANK vs ROW_NUMBER", "Gaps after ties / no gaps / always unique."],
            ["Clustered vs non-clustered index", "Clustered: rows physically ordered by it (one per table). Non-clustered: a separate structure pointing to the rows."],
            ["View vs table", "A view is a stored query (no data); a table stores data."],
            ["CHAR vs VARCHAR", "CHAR(n) is fixed length and padded; VARCHAR(n) is variable length."],
            ["Correlated vs normal subquery", "Correlated references the outer row and runs per row; a normal one runs once."],
            ["COUNT(*) vs COUNT(col)", "COUNT(*) counts rows; COUNT(col) skips NULLs."],
            ["Normalization", "Splitting tables so each fact is stored once, removing update/insert/delete anomalies (1NF → 2NF → 3NF → BCNF)."],
            ["ACID", "Atomicity, Consistency, Isolation, Durability; the guarantees of a transaction."],
            ["SQL injection", "Untrusted input changing a query's meaning; prevented with parameterized queries."]
          ]
        },
        {
          type: "list",
          title: "How to Approach a Live SQL Question",
          items: [
            "**Clarify**: what counts as a duplicate? How should ties and NULLs be handled? What should an empty result return?",
            "**Say the plan out loud**: 'Group by department, rank within it, then filter the top 2.'",
            "**Write it step by step**, using CTEs for readability.",
            "**Test it mentally** against edge cases: ties, NULLs, empty groups, a single row.",
            "**Mention performance**: which index would help, and that window functions avoid repeated subqueries."
          ]
        },
        {
          type: "quickCheck",
          question: "Which statement about TRUNCATE is generally true?",
          options: ["It accepts a WHERE clause", "It fires row-level DELETE triggers", "It removes all rows faster than DELETE", "It removes the table definition"],
          answer: 2,
          explanation: "TRUNCATE deallocates data pages instead of deleting row by row, so it's much faster, but it can't filter and doesn't fire row triggers."
        },
        {
          type: "takeaways",
          items: ["Memorize the comparison table; these come up in nearly every placement SQL round.", "Always clarify ties, NULLs and empty results before writing the query."]
        }
      ]
    }
  }
];
