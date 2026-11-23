// Long-form theory for the SQL placement (interview problems) module. Original writing.
import { LessonTheory } from './utils';
import { PG_QUERIES, PG_WINDOW, PG_MVCC, PG_PERF, SQLITE_LANG, UTL, MODERN_SQL } from './sql-theory-sources';

export const sqlPlacementTheory: Record<string, LessonTheory> = {
  "nth-highest-salary": {
    theory: `"Find the Nth highest salary" is the most frequently asked SQL interview question. It looks small, but it tests whether you handle duplicates, missing answers and different database features correctly. There are at least four valid approaches, and interviewers often ask for more than one. This lesson works through each approach, explains how they differ on ties and empty results, and covers the per-department variant.

## The problem

Given an employees table with a salary column, return the Nth highest distinct salary. With salaries 100, 90, 90 and 80, the second highest salary is 90 and the third highest is 80. Duplicates count once. If N exceeds the number of distinct salaries, return NULL rather than no row.

Clarify both points at the start of an interview: whether duplicates count once, and what to return when there's no answer. They decide which approach is correct.

## Approach 1: LIMIT and OFFSET

Sort distinct salaries in descending order and skip N − 1 of them:

~~~sql
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1;     -- N = 2
~~~

\`DISTINCT\` is essential: without it, the two 90 values occupy positions 2 and 3, and \`OFFSET 2\` would return 90 as the third highest instead of 80.

If fewer than N distinct salaries exist, this returns no rows. To return NULL instead, wrap it in a scalar subquery, which yields NULL when the inner query has no rows:

~~~sql
SELECT (
    SELECT DISTINCT salary FROM employees
    ORDER BY salary DESC LIMIT 1 OFFSET 1
) AS second_highest;
~~~

In SQL Server, use \`OFFSET 1 ROWS FETCH NEXT 1 ROWS ONLY\`.

## Approach 2: DENSE_RANK

The window function approach names the rule for ties directly:

~~~sql
WITH ranked AS (
    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
    FROM employees
)
SELECT DISTINCT salary FROM ranked WHERE rnk = 2;
~~~

\`DENSE_RANK\` gives equal salaries the same rank with no gaps, so ranks map exactly to distinct salary positions. Using \`RANK\` would fail: the 80 salary would get rank 4, not 3, because two rows share rank 2. Using \`ROW_NUMBER\` would also fail, since it numbers the duplicate 90s as 2 and 3. Explaining why \`DENSE_RANK\` is the right choice among the three is often the main point the interviewer wants.

\`DISTINCT\` in the outer query prevents returning the same salary once per employee who earns it.

## Approach 3: subquery with MAX

For the second highest specifically, a classic answer uses \`MAX\` twice:

~~~sql
SELECT MAX(salary) AS second_highest
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);
~~~

The subquery finds the highest salary; the outer query finds the largest salary below it. This handles duplicates naturally and returns NULL automatically when there's no second salary, since \`MAX\` of no rows is NULL. It works in every database, including old versions. It doesn't generalize well beyond N = 2 or 3.

## Approach 4: correlated subquery

The general method without window functions counts how many distinct salaries are higher:

~~~sql
SELECT DISTINCT e1.salary
FROM employees e1
WHERE (
    SELECT COUNT(DISTINCT e2.salary)
    FROM employees e2
    WHERE e2.salary > e1.salary
) = 1;     -- N - 1 higher salaries means e1.salary is the Nth highest
~~~

A salary is the Nth highest when exactly N − 1 distinct salaries are greater. This works everywhere but runs the subquery per row, costing O(n²) without an index, so it suits small tables or databases without window functions.

## Comparing the approaches

| Approach | Handles ties | Returns NULL if missing | Generalizes to N | Portability |
|---|---|---|---|---|
| LIMIT/OFFSET with DISTINCT | Yes | Only when wrapped in a scalar subquery | Yes | Syntax varies |
| DENSE_RANK | Yes | No row by default; wrap to get NULL | Yes | Needs window functions |
| MAX below MAX | Yes | Yes | Awkward beyond 2 | Universal |
| Correlated COUNT | Yes | No row by default | Yes | Universal, slow |

## As a reusable function

Some interview platforms ask for a function that takes N. In PostgreSQL:

~~~sql
CREATE FUNCTION nth_highest_salary(n INTEGER) RETURNS NUMERIC AS $f$
    SELECT (
        SELECT DISTINCT salary FROM employees
        ORDER BY salary DESC
        LIMIT 1 OFFSET n - 1
    );
$f$ LANGUAGE sql;
~~~

\`OFFSET\` can't be negative, so guard against N less than 1. In MySQL, functions can't use expressions in \`LIMIT\` directly; you compute \`n - 1\` into a variable first.

## Nth highest per department

The variant "find the second highest salary in each department" needs \`PARTITION BY\`:

~~~sql
WITH ranked AS (
    SELECT dept_id, salary,
           DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rnk
    FROM employees
)
SELECT DISTINCT dept_id, salary
FROM ranked
WHERE rnk = 2;
~~~

Departments with only one distinct salary don't appear. If they should appear with NULL, left join the departments table to this result.

## Testing your answer

Before declaring a solution finished, test mentally with: duplicate top salaries, fewer than N distinct salaries, all salaries equal, NULL salaries (which \`ORDER BY\` sorts first or last depending on the database, and \`DENSE_RANK\` ranks), and an empty table. Many submissions fail on exactly these cases.

## How interviewers test this

Expect the second or Nth highest salary, often followed by "Can you do it another way?" and "What if there are duplicates?" Present DENSE_RANK or LIMIT/OFFSET with DISTINCT, explain why RANK and ROW_NUMBER fail with ties, return NULL when no answer exists, and extend to per-department with PARTITION BY.`,
    sources: [PG_WINDOW, PG_QUERIES, SQLITE_LANG]
  },

  "duplicates-find-and-delete": {
    theory: `Duplicate rows creep into tables through repeated imports, retried requests and missing unique constraints. Finding them, removing the extras while keeping one copy, and preventing them from returning are common interview tasks and common real-world chores. This lesson covers defining duplicates, finding them with \`GROUP BY\` and \`HAVING\`, viewing the full duplicate rows, deleting extras safely in several dialects, and adding constraints so they can't come back.

## Defining a duplicate

First decide what makes two rows duplicates. Rows are rarely identical in every column: each usually has its own \`id\` and perhaps a different \`created_at\`. Duplicates are usually rows matching on a **business key**, such as the same email, or the same customer, product and order date. Stating this definition aloud is the first step in an interview answer.

## Finding duplicate values

\`GROUP BY\` the defining columns and keep groups with more than one row:

~~~sql
SELECT email, COUNT(*) AS copies
FROM users
GROUP BY email
HAVING COUNT(*) > 1
ORDER BY copies DESC;
~~~

This lists each duplicated email and how many times it appears. For multi-column duplicates, group by all the columns: \`GROUP BY customer_id, product_id, order_date\`.

Case and spacing can hide duplicates: \`'Asha@Mail.com'\` and \`'asha@mail.com '\` are different strings. Group by a normalized form, \`LOWER(TRIM(email))\`, to catch them.

## Seeing the full rows

To inspect every duplicated row, not only the values, join back to the duplicate list or use a window count:

~~~sql
SELECT *
FROM (
    SELECT u.*, COUNT(*) OVER (PARTITION BY email) AS copies
    FROM users u
) t
WHERE copies > 1
ORDER BY email, created_at;
~~~

Reviewing the rows helps decide which copy to keep: perhaps the oldest, the most recently updated, or the one with the most complete data.

## Marking which copy to keep

\`ROW_NUMBER\` numbers rows within each duplicate group, in the order of your keep rule:

~~~sql
SELECT id, email, created_at,
       ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at, id) AS rn
FROM users;
~~~

The row with \`rn = 1\` is the keeper, here the earliest; rows with \`rn > 1\` are extras. Adding \`id\` to the \`ORDER BY\` breaks ties when two copies share a timestamp, making the choice deterministic.

## Deleting duplicates

Delete the rows whose \`rn\` is greater than 1:

~~~sql
WITH ranked AS (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at, id) AS rn
    FROM users
)
DELETE FROM users
WHERE id IN (SELECT id FROM ranked WHERE rn > 1);
~~~

This works in PostgreSQL, SQLite and SQL Server. In MySQL, which doesn't allow selecting from the table being deleted from, wrap the subquery in a derived table, or use a self-join delete:

~~~sql
-- MySQL: keep the lowest id for each email
DELETE u1 FROM users u1
JOIN users u2 ON u1.email = u2.email AND u1.id > u2.id;
~~~

The self-join deletes every row that has another row with the same email and a smaller id, leaving the smallest id in each group.

## Deleting without a unique ID

If rows are fully identical with no distinguishing column, you can't target individual copies by ID. Options:

- PostgreSQL's hidden \`ctid\` column identifies each row's physical location: \`DELETE FROM t a USING t b WHERE a.ctid > b.ctid AND a.col1 = b.col1 AND ...\`
- SQLite's \`rowid\` works the same way
- Copy distinct rows to a new table, then swap: \`CREATE TABLE t_clean AS SELECT DISTINCT * FROM t;\`, then drop the original and rename

## Doing it safely

Deleting data is risky, so follow the safeguards:

1. Count first: run the \`SELECT\` version and check how many rows will be removed
2. Run inside a transaction, verify, then commit
3. Back up the affected rows, for example \`CREATE TABLE users_dupes_backup AS SELECT ...\` of the rows to be deleted
4. Check foreign keys: other tables may reference the duplicate rows, such as orders placed under a duplicate account. Repoint them to the keeper with an \`UPDATE\` before deleting, or the delete fails or cascades

For large tables, delete in batches to avoid long locks.

## Preventing duplicates

Cleanup is pointless if duplicates return. Add a unique constraint after cleaning:

~~~sql
ALTER TABLE users ADD CONSTRAINT uq_users_email UNIQUE (email);
~~~

For case-insensitive uniqueness, create a unique index on \`LOWER(email)\`. Then make inserts handle conflicts deliberately with \`INSERT ... ON CONFLICT DO NOTHING\` or an upsert, instead of failing or relying on the application to check first, which is subject to race conditions. For APIs, idempotency keys stop retried requests from creating duplicate records.

## Counting distinct versus total

A related interview question asks how many duplicate rows exist: \`SELECT COUNT(*) - COUNT(DISTINCT email) FROM users\` gives the number of extra rows beyond one per email. Note that \`COUNT(DISTINCT email)\` ignores NULL emails.

## How interviewers test this

Expect "find duplicate emails", "delete duplicates keeping the first", "find duplicate rows across multiple columns" and "how would you prevent duplicates?" Define the business key, use GROUP BY with HAVING to find, ROW_NUMBER with a deterministic keep rule to delete, mention the MySQL self-join form, handle foreign keys, and finish with a unique constraint.`,
    sources: [PG_WINDOW, PG_QUERIES, SQLITE_LANG]
  },

  "top-n-per-group": {
    theory: `Top-N-per-group problems ask for the best rows within each group: the highest earner in each department, the three best-selling products per category, each customer's most recent order. They appear constantly in interviews and reports. Plain \`GROUP BY\` can't solve them, because it collapses each group into one row of aggregates and loses the other columns. This lesson explains why, then covers the window function solution, its tie-handling choices, and the alternatives using joins, correlated subqueries and lateral joins.

## Why GROUP BY isn't enough

This finds the highest salary per department:

~~~sql
SELECT dept_id, MAX(salary) FROM employees GROUP BY dept_id;
~~~

But it can't tell you **who** earns it. Adding \`name\` to the select list is an error in standard SQL, because a department has many names. In MySQL without strict grouping, or SQLite, it may run and return a name from an arbitrary row, which is a silent bug. The problem needs a way to keep whole rows while comparing within groups.

## The window function solution

Rank rows within each group, then filter:

~~~sql
WITH ranked AS (
    SELECT e.*,
           ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC, id) AS rn
    FROM employees e
)
SELECT dept_id, name, salary
FROM ranked
WHERE rn = 1;
~~~

\`PARTITION BY dept_id\` restarts numbering in each department, \`ORDER BY salary DESC\` puts the highest first, and \`WHERE rn = 1\` keeps the top row of each. Change it to \`rn <= 3\` for the top three. The CTE is necessary because window functions are computed after \`WHERE\`.

## Choosing how ties behave

The ranking function decides what happens when salaries tie:

| Function | Two employees tied for highest | Use when |
|---|---|---|
| \`ROW_NUMBER\` | Exactly one returned | You need exactly N rows per group |
| \`RANK\` | Both returned as rank 1; next is rank 3 | Ties should share a position, gaps allowed |
| \`DENSE_RANK\` | Both returned; next distinct salary is rank 2 | "Top N distinct values" per group |

For "the highest earner in each department", ask whether ties should all be shown. If yes, use \`RANK\` or \`DENSE_RANK\`. With \`ROW_NUMBER\`, add a tiebreaker such as \`id\` so the same row is chosen every time.

## Each customer's latest order

The same pattern finds the most recent row per entity:

~~~sql
WITH latest AS (
    SELECT o.*,
           ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC, id DESC) AS rn
    FROM orders o
)
SELECT customer_id, id AS order_id, order_date, amount
FROM latest
WHERE rn = 1;
~~~

This is one of the most common patterns in production analytics: latest status per ticket, latest price per product, latest login per user.

## Alternative: join to the group maximum

Before window functions, the standard approach joined to an aggregated derived table:

~~~sql
SELECT e.dept_id, e.name, e.salary
FROM employees e
JOIN (
    SELECT dept_id, MAX(salary) AS max_salary
    FROM employees
    GROUP BY dept_id
) m ON m.dept_id = e.dept_id AND m.max_salary = e.salary;
~~~

It returns all employees tied for the maximum, like \`RANK\`. It works in every database, but it only handles the top 1, not the top N.

## Alternative: correlated subquery

A correlated subquery expresses "salary equals the maximum of my department":

~~~sql
SELECT dept_id, name, salary
FROM employees e
WHERE salary = (SELECT MAX(salary) FROM employees e2 WHERE e2.dept_id = e.dept_id);
~~~

For the top N, count how many colleagues earn more:

~~~sql
SELECT dept_id, name, salary
FROM employees e
WHERE (SELECT COUNT(DISTINCT e2.salary) FROM employees e2
       WHERE e2.dept_id = e.dept_id AND e2.salary > e.salary) < 3;
~~~

This returns employees with fewer than three distinct higher salaries in their department, the top three distinct salaries, like \`DENSE_RANK <= 3\`. It's portable but O(n²) without indexes.

## Alternative: lateral join

When groups come from a separate table and N is small, a lateral join with an index can be fastest:

~~~sql
SELECT d.name AS department, t.name, t.salary
FROM departments d
CROSS JOIN LATERAL (
    SELECT name, salary FROM employees e
    WHERE e.dept_id = d.id
    ORDER BY salary DESC
    LIMIT 3
) t;
~~~

With an index on \`employees (dept_id, salary DESC)\`, each department needs only a short index read. PostgreSQL and MySQL 8.0.14+ support \`LATERAL\`; SQL Server uses \`CROSS APPLY\`.

## PostgreSQL's DISTINCT ON

PostgreSQL offers a concise top-1-per-group:

~~~sql
SELECT DISTINCT ON (dept_id) dept_id, name, salary
FROM employees
ORDER BY dept_id, salary DESC, id;
~~~

It keeps the first row per \`dept_id\` in the given order. It's PostgreSQL-only and handles only the top 1.

## Choosing an approach

| Approach | Top N | Ties | Portability |
|---|---|---|---|
| Window function in a CTE | Any N | Your choice of function | Modern databases |
| Join to group MAX | Top 1 only | Returns all tied | Universal |
| Correlated COUNT | Any N | Distinct-value semantics | Universal, slow |
| Lateral join | Any N | One per row unless extended | PostgreSQL, MySQL 8, SQL Server |
| DISTINCT ON | Top 1 only | One per group | PostgreSQL only |

In interviews, lead with the window function approach, then mention one alternative.

## How interviewers test this

Expect "highest paid employee per department", "top 3 products per category by revenue" and "latest order for each customer". Explain why GROUP BY alone fails, use ROW_NUMBER or DENSE_RANK in a CTE, discuss ties explicitly, and offer the join-to-MAX approach for databases without window functions.`,
    sources: [PG_WINDOW, UTL, MODERN_SQL]
  },

  "self-join-manager-questions": {
    theory: `Many interview questions involve an employees table where each row's \`manager_id\` points to another employee in the same table. Answering them requires joining the table to itself, treating one copy as employees and another as managers. This lesson covers the self-join technique and the classic questions: listing each employee's manager, employees who earn more than their managers, managers with the most reports, employees without managers, and walking the full chain of command.

## The self-referencing table

~~~sql
CREATE TABLE employees (
    id          INTEGER PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    salary      NUMERIC(10, 2),
    dept_id     INTEGER,
    manager_id  INTEGER REFERENCES employees(id)
);
~~~

\`manager_id\` is a foreign key referencing the same table. The top of the hierarchy, such as the CEO, has \`manager_id\` NULL. This structure, called an **adjacency list**, is the most common way to store a hierarchy in SQL.

## The self-join technique

To compare an employee with their manager, the query needs two copies of the table, each with its own alias:

~~~sql
SELECT e.name AS employee, m.name AS manager
FROM employees e
JOIN employees m ON e.manager_id = m.id;
~~~

Read \`e\` as "the employee" and \`m\` as "the manager". The join condition says the employee's \`manager_id\` matches the manager's \`id\`. Getting this direction backwards, writing \`e.id = m.manager_id\`, swaps the roles and returns each employee paired with their direct reports instead.

## Including employees without a manager

The inner join above drops the CEO, whose \`manager_id\` is NULL. To list everyone:

~~~sql
SELECT e.name AS employee, COALESCE(m.name, 'No manager') AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;
~~~

## Employees who earn more than their manager

Once both copies are in one row, compare their columns:

~~~sql
SELECT e.name, e.salary, m.name AS manager, m.salary AS manager_salary
FROM employees e
JOIN employees m ON e.manager_id = m.id
WHERE e.salary > m.salary;
~~~

An inner join is right here: employees without managers can't earn more than a manager they don't have.

## Employees in a different department from their manager

The same shape answers other comparisons:

~~~sql
SELECT e.name, e.dept_id, m.name AS manager, m.dept_id AS manager_dept
FROM employees e
JOIN employees m ON e.manager_id = m.id
WHERE e.dept_id <> m.dept_id;
~~~

## Counting direct reports

To find how many people report to each manager:

~~~sql
SELECT m.id, m.name, COUNT(e.id) AS direct_reports
FROM employees m
JOIN employees e ON e.manager_id = m.id
GROUP BY m.id, m.name
ORDER BY direct_reports DESC;
~~~

Here \`m\` drives the query and \`e\` supplies the reports. To include employees with zero reports, use \`LEFT JOIN\` and keep \`COUNT(e.id)\`, which counts only matched rows. Grouping by the manager's \`id\`, not only their name, prevents two managers with the same name being merged.

Managers with at least five reports add a \`HAVING\` clause: \`HAVING COUNT(e.id) >= 5\`.

## Employees who manage nobody

Find employees whose ID never appears as anyone's \`manager_id\`:

~~~sql
SELECT e.name
FROM employees e
WHERE NOT EXISTS (SELECT 1 FROM employees r WHERE r.manager_id = e.id);
~~~

Avoid \`WHERE e.id NOT IN (SELECT manager_id FROM employees)\`: the CEO's NULL \`manager_id\` is in that list, so \`NOT IN\` returns no rows at all. This exact trap is a favourite interview follow-up.

## Two levels up

Chaining another self-join reaches the manager's manager:

~~~sql
SELECT e.name AS employee, m.name AS manager, gm.name AS grand_manager
FROM employees e
LEFT JOIN employees m  ON e.manager_id = m.id
LEFT JOIN employees gm ON m.manager_id = gm.id;
~~~

Each additional level needs one more join, which works for a known, small depth.

## The full chain with a recursive CTE

For arbitrary depth, such as everyone under a given VP, use a recursive CTE:

~~~sql
WITH RECURSIVE org AS (
    SELECT id, name, manager_id, 0 AS level
    FROM employees WHERE id = 3            -- the VP
    UNION ALL
    SELECT e.id, e.name, e.manager_id, o.level + 1
    FROM employees e
    JOIN org o ON e.manager_id = o.id
)
SELECT name, level FROM org ORDER BY level, name;
~~~

The anchor selects the starting person, and each iteration adds the next level of reports. Counting the size of each manager's whole organization, or finding the depth of the hierarchy, builds on this.

## Pairs of colleagues

Self-joins also pair employees sharing a manager:

~~~sql
SELECT a.name, b.name, a.manager_id
FROM employees a
JOIN employees b ON a.manager_id = b.manager_id AND a.id < b.id;
~~~

\`a.id < b.id\` prevents pairing someone with themselves and lists each pair once.

## Indexes and integrity

Index \`manager_id\`, since every self-join and recursive step joins on it. The foreign key prevents pointing to a nonexistent manager, but not cycles, such as A managing B while B manages A. A cycle makes recursive queries loop until a depth limit stops them, so applications should validate new manager assignments.

## How interviewers test this

Expect "list employees with their manager's name", "employees earning more than their manager", "managers with the most reports", "employees who aren't managers" and "all subordinates of a manager". Alias the two copies clearly, get the join direction right, use LEFT JOIN when everyone must appear, use NOT EXISTS instead of NOT IN, and switch to a recursive CTE for unlimited depth.`,
    sources: [PG_QUERIES, SQLITE_LANG, MODERN_SQL]
  },

  "consecutive-streaks-gaps": {
    theory: `Gaps-and-islands problems ask about runs of consecutive values: users who logged in on three consecutive days, the longest winning streak, periods when a machine was offline, or missing invoice numbers. An **island** is an unbroken run; a **gap** is a break between runs. These problems look hard but yield to a few window function techniques. This lesson explains the row-number difference trick, \`LAG\` for detecting breaks, finding gaps, and the edge cases that trip people up.

## The classic question

Given a \`logins (user_id, login_date)\` table, find users who logged in on at least three consecutive days. A self-join can check fixed patterns, such as "today, yesterday and the day before", but it doesn't extend to "the longest streak" or "every streak with its start and end". Window functions solve the general problem.

## Clean the data first

Users can log in several times a day. Duplicate dates break streak logic, because the same date would be counted twice. Reduce to one row per user per day first:

~~~sql
SELECT DISTINCT user_id, CAST(login_time AS DATE) AS login_date
FROM logins;
~~~

Forgetting this step is the most common bug in streak queries.

## The difference trick

Number each user's login dates in order, then subtract that number from the date:

| login_date | rn | login_date − rn days |
|---|---|---|
| 2024-03-01 | 1 | 2024-02-29 |
| 2024-03-02 | 2 | 2024-02-29 |
| 2024-03-03 | 3 | 2024-02-29 |
| 2024-03-07 | 4 | 2024-03-03 |
| 2024-03-08 | 5 | 2024-03-03 |

Within a run of consecutive dates, the date and the row number both increase by 1 per row, so their difference stays constant. When a gap occurs, the date jumps by more than the row number, and the difference changes. That constant difference identifies each island:

~~~sql
WITH days AS (
    SELECT DISTINCT user_id, CAST(login_time AS DATE) AS d FROM logins
),
grouped AS (
    SELECT user_id, d,
           d - CAST(ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY d) AS INTEGER) AS grp
    FROM days
)
SELECT user_id, MIN(d) AS streak_start, MAX(d) AS streak_end, COUNT(*) AS streak_days
FROM grouped
GROUP BY user_id, grp
HAVING COUNT(*) >= 3;
~~~

In PostgreSQL, subtracting an integer from a date gives a date. In MySQL, use \`DATE_SUB(d, INTERVAL rn DAY)\`; in SQLite, \`date(d, '-' || rn || ' days')\`.

## Longest streak per user

Wrap the island query and take the maximum length:

~~~sql
SELECT user_id, MAX(streak_days) AS longest_streak
FROM ( /* the island query, without HAVING */ ) s
GROUP BY user_id;
~~~

## The same trick on integer sequences

The technique works for any sequence that should increase by a fixed step: consecutive IDs, seat numbers or invoice numbers. For integers, \`value - ROW_NUMBER()\` groups consecutive runs. For example, finding three or more consecutive available seats in a cinema row:

~~~sql
WITH free AS (
    SELECT seat_no, seat_no - ROW_NUMBER() OVER (ORDER BY seat_no) AS grp
    FROM seats WHERE is_free
)
SELECT MIN(seat_no) AS from_seat, MAX(seat_no) AS to_seat
FROM free
GROUP BY grp
HAVING COUNT(*) >= 3;
~~~

## Streaks defined by a status

When islands are defined by a repeated value rather than consecutive dates, such as a winning streak in a list of game results, use two row numbers: one over all rows, and one within each result value. Their difference is constant while the value stays the same:

~~~sql
WITH numbered AS (
    SELECT player_id, game_date, result,
           ROW_NUMBER() OVER (PARTITION BY player_id ORDER BY game_date)
         - ROW_NUMBER() OVER (PARTITION BY player_id, result ORDER BY game_date) AS grp
    FROM games
)
SELECT player_id, COUNT(*) AS streak
FROM numbered
WHERE result = 'W'
GROUP BY player_id, grp
ORDER BY streak DESC;
~~~

## Detecting breaks with LAG

Another approach marks where each island starts, then numbers islands with a running sum:

~~~sql
WITH flagged AS (
    SELECT user_id, d,
           CASE WHEN d - LAG(d) OVER (PARTITION BY user_id ORDER BY d) = 1
                THEN 0 ELSE 1 END AS new_island
    FROM days
),
islands AS (
    SELECT user_id, d,
           SUM(new_island) OVER (PARTITION BY user_id ORDER BY d) AS island_id
    FROM flagged
)
SELECT user_id, island_id, MIN(d), MAX(d), COUNT(*)
FROM islands
GROUP BY user_id, island_id;
~~~

The first row of each user has a NULL \`LAG\`, which the \`ELSE 1\` treats as a new island. This form is more flexible: you can define a break any way you like, such as a gap of more than 30 minutes between events, which splits activity into sessions.

## Finding gaps

Gaps are the spaces between islands. \`LEAD\` finds them directly:

~~~sql
SELECT invoice_no + 1 AS gap_start, next_no - 1 AS gap_end
FROM (
    SELECT invoice_no, LEAD(invoice_no) OVER (ORDER BY invoice_no) AS next_no
    FROM invoices
) t
WHERE next_no - invoice_no > 1;
~~~

Each row where the next number jumps by more than one marks a gap. For date gaps, such as days with no sales, generate the full range of dates with \`generate_series\` or a recursive CTE, left join the data, and keep dates with no match.

## Edge cases

Test streak queries against:

- duplicate rows on the same date, which must be removed first
- single-day islands, which should count as streaks of length 1
- streaks spanning month or year boundaries, which date arithmetic handles but string-based logic doesn't
- time zones, if dates come from timestamps, since a login at 23:30 in India is a different UTC date

## How interviewers test this

Expect "users who logged in three consecutive days", "longest streak per user", "find missing IDs" and "group events into sessions". Remove duplicates first, explain the date minus row number trick and why it groups consecutive rows, offer the LAG and running-sum method for custom break rules, and use LEAD to find gaps.`,
    sources: [PG_WINDOW, MODERN_SQL, SQLITE_LANG]
  },

  "reporting-queries": {
    theory: `Reporting queries turn raw transactions into the summaries people read: revenue by month, each region's share of sales, cumulative signups, a pivot table of categories by quarter. Interview tasks in this area test whether you can combine grouping, conditional aggregation and window functions into one correct query. This lesson covers pivoting rows into columns, percentages and shares, cumulative totals, period-over-period comparisons, and filling missing periods with zeros.

## Pivoting rows into columns

A pivot turns values in a column into separate columns. Sales by region per year, with regions as columns:

~~~sql
SELECT EXTRACT(YEAR FROM order_date) AS yr,
       SUM(CASE WHEN region = 'North' THEN amount ELSE 0 END) AS north,
       SUM(CASE WHEN region = 'South' THEN amount ELSE 0 END) AS south,
       SUM(CASE WHEN region = 'East'  THEN amount ELSE 0 END) AS east,
       SUM(CASE WHEN region = 'West'  THEN amount ELSE 0 END) AS west
FROM orders
GROUP BY EXTRACT(YEAR FROM order_date)
ORDER BY yr;
~~~

Each \`CASE\` passes through amounts for one region and zero otherwise, so the \`SUM\` totals only that region. This **conditional aggregation** works in every database. PostgreSQL and SQLite also support \`SUM(amount) FILTER (WHERE region = 'North')\`, which reads more clearly. SQL Server and Oracle have a \`PIVOT\` operator, but it's dialect-specific.

The columns must be known when writing the query. If new regions appear, the query needs updating, or the application must build the query dynamically.

## Unpivoting

The reverse turns columns into rows, for example converting a wide table of monthly columns into one row per month. \`UNION ALL\` works everywhere:

~~~sql
SELECT product_id, 'jan' AS month, jan_sales AS sales FROM product_sales
UNION ALL
SELECT product_id, 'feb', feb_sales FROM product_sales;
~~~

PostgreSQL can also unpivot with \`CROSS JOIN LATERAL (VALUES ...)\`.

## Percentages

Percentage calculations have two classic bugs: integer division and division by zero. A completion rate:

~~~sql
SELECT course_id,
       COUNT(*) AS enrolled,
       SUM(CASE WHEN completed THEN 1 ELSE 0 END) AS completed,
       ROUND(100.0 * SUM(CASE WHEN completed THEN 1 ELSE 0 END)
             / NULLIF(COUNT(*), 0), 1) AS completion_pct
FROM enrollments
GROUP BY course_id;
~~~

\`100.0\` forces decimal arithmetic; without it, PostgreSQL and SQLite would truncate the division to 0. \`NULLIF(COUNT(*), 0)\` turns a zero denominator into NULL instead of an error. Rounding comes last.

In PostgreSQL, \`AVG(CASE WHEN completed THEN 1.0 ELSE 0 END) * 100\` gives the same rate more compactly, since an average of 1s and 0s is a proportion.

## Share of total

To show each region's share of all sales, divide by a window total:

~~~sql
SELECT region,
       SUM(amount) AS revenue,
       ROUND(100.0 * SUM(amount) / SUM(SUM(amount)) OVER (), 2) AS pct_of_total
FROM orders
GROUP BY region
ORDER BY revenue DESC;
~~~

\`SUM(SUM(amount)) OVER ()\` looks odd but is correct: the inner \`SUM\` is the grouped aggregate, and the outer \`SUM ... OVER ()\` totals those group sums across all groups. Adding \`PARTITION BY\` gives shares within a larger group, such as each product's share of its category.

## Cumulative totals

Cumulative signups by month combine grouping with a running window:

~~~sql
SELECT DATE_TRUNC('month', created_at) AS month,
       COUNT(*) AS new_users,
       SUM(COUNT(*)) OVER (ORDER BY DATE_TRUNC('month', created_at)) AS total_users
FROM users
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month;
~~~

Cumulative percentages, as in Pareto analysis, divide the running total by the grand total: \`SUM(revenue) OVER (ORDER BY revenue DESC) / SUM(revenue) OVER ()\`.

## Period-over-period comparisons

\`LAG\` compares each period with the previous one:

~~~sql
WITH monthly AS (
    SELECT DATE_TRUNC('month', order_date) AS month, SUM(amount) AS revenue
    FROM orders
    GROUP BY 1
)
SELECT month, revenue,
       LAG(revenue) OVER (ORDER BY month) AS prev_month,
       ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))
             / NULLIF(LAG(revenue) OVER (ORDER BY month), 0), 1) AS mom_growth_pct
FROM monthly
ORDER BY month;
~~~

For year-over-year comparison of monthly data, use \`LAG(revenue, 12)\`, but only if every month is present. A missing month shifts the offset and compares the wrong periods, which leads to the next technique.

## Filling missing periods

Grouping by month only produces months that have data. A month with no orders disappears instead of showing zero, which breaks charts and \`LAG\` offsets. Generate the full list of periods, then left join:

~~~sql
WITH months AS (
    SELECT generate_series(DATE '2024-01-01', DATE '2024-12-01', INTERVAL '1 month') AS month
)
SELECT m.month, COALESCE(SUM(o.amount), 0) AS revenue
FROM months m
LEFT JOIN orders o ON DATE_TRUNC('month', o.order_date) = m.month
GROUP BY m.month
ORDER BY m.month;
~~~

\`generate_series\` is PostgreSQL; use a recursive CTE in MySQL and SQLite. Many data warehouses keep a permanent **calendar table** with one row per date and columns for week, month, quarter and holidays, which makes these joins routine.

## Subtotals and grand totals

\`GROUP BY ROLLUP (region, product)\` adds subtotal rows per region and a grand total row, with NULL in the rolled-up columns. Use \`GROUPING(region)\` to label those rows as "All regions". MySQL writes it as \`GROUP BY region, product WITH ROLLUP\`.

## Checking a report

Before trusting a report query, sanity-check it: do the category totals add up to the overall total? Did a join multiply rows and inflate sums? Are NULLs excluded where they should be counted? Comparing a report's grand total with a plain \`SUM\` over the source table catches most mistakes.

## How interviewers test this

Expect "monthly revenue with month-over-month growth", "each category's percentage of total sales", "cumulative users by month", "pivot sales by region" and "show months with zero sales". Use conditional aggregation for pivots, 100.0 and NULLIF for percentages, window functions for shares and running totals, and a generated date series for missing periods.`,
    sources: [PG_WINDOW, PG_QUERIES, MODERN_SQL]
  },

  "sql-interview-theory": {
    theory: `Alongside writing queries, SQL interviews include conceptual questions that come up in almost every round. They test whether you understand how databases work, not only how to write syntax. This lesson collects the most frequent questions with concise, accurate answers, each pointing back to the lesson that covers it in depth. Use it for revision before an interview.

## WHERE versus HAVING

\`WHERE\` filters individual rows before grouping and can't use aggregates. \`HAVING\` filters groups after \`GROUP BY\` and can use aggregates. Put row conditions in \`WHERE\`, because filtering early is faster.

## DELETE, TRUNCATE and DROP

\`DELETE\` removes chosen rows, row by row, fires triggers, and can be rolled back. \`TRUNCATE\` removes all rows quickly by deallocating storage, doesn't fire row triggers, usually resets identity counters, and its rollback behaviour depends on the database. \`DROP\` removes the table entirely, including its structure.

## Primary key versus unique key

Both enforce uniqueness. A primary key can't contain NULL and a table has only one; a unique key usually allows NULLs, and a table can have many. The primary key is the main identifier and the usual target of foreign keys.

## Types of joins

| Join | Returns |
|---|---|
| INNER | Only matching rows from both tables |
| LEFT | All left rows, with matches or NULLs |
| RIGHT | All right rows, with matches or NULLs |
| FULL | All rows from both, with NULLs where unmatched |
| CROSS | Every combination of rows |
| SELF | A table joined to itself, using aliases |

## UNION versus UNION ALL

\`UNION\` removes duplicate rows, which costs a sort or hash. \`UNION ALL\` keeps all rows and is faster. Use \`UNION ALL\` unless you need deduplication.

## The logical order of a query

\`FROM\` and joins, \`WHERE\`, \`GROUP BY\`, \`HAVING\`, \`SELECT\` (with window functions), \`DISTINCT\`, \`ORDER BY\`, then \`LIMIT\`. This order explains why \`SELECT\` aliases aren't available in \`WHERE\` and why aggregates can't appear in \`WHERE\`.

## RANK, DENSE_RANK and ROW_NUMBER

All number rows within a window. \`ROW_NUMBER\` gives unique numbers even for ties. \`RANK\` gives ties the same rank and then skips (1, 2, 2, 4). \`DENSE_RANK\` gives ties the same rank without gaps (1, 2, 2, 3).

## COUNT(*), COUNT(column) and COUNT(DISTINCT column)

\`COUNT(*)\` counts all rows. \`COUNT(column)\` counts rows where the column isn't NULL. \`COUNT(DISTINCT column)\` counts distinct non-NULL values. \`COUNT(1)\` is identical to \`COUNT(*)\`.

## NULL behaviour

NULL means unknown. Any comparison with NULL, including \`NULL = NULL\`, gives UNKNOWN, so use \`IS NULL\`. Aggregates other than \`COUNT(*)\` ignore NULLs. \`NOT IN\` with a NULL in its list returns no rows; \`NOT EXISTS\` is safe.

## ACID

**Atomicity**: a transaction completes fully or not at all. **Consistency**: it moves the database between valid states that satisfy all constraints. **Isolation**: concurrent transactions don't interfere. **Durability**: committed changes survive crashes, through write-ahead logging.

## Isolation levels

Read uncommitted allows dirty reads. Read committed prevents dirty reads but allows non-repeatable reads. Repeatable read prevents non-repeatable reads, and in the standard allows phantoms. Serializable prevents all anomalies. PostgreSQL defaults to read committed; MySQL InnoDB defaults to repeatable read.

## Normalization

Normalization organizes tables to remove redundancy and update, insert and delete anomalies. **1NF**: atomic values, no repeating groups. **2NF**: no non-key column depends on part of a composite key. **3NF**: no non-key column depends on another non-key column. Denormalization adds redundancy back deliberately for read performance.

## Indexes

An index, usually a B-tree, lets the database find rows in O(log n) instead of scanning the table. Indexes speed up reads on filtered, joined and sorted columns, but slow down writes and use storage. A composite index follows the leftmost prefix rule. Functions on indexed columns in \`WHERE\` usually prevent index use.

## Clustered versus non-clustered indexes

A **clustered** index determines the physical order of table rows, so a table has only one; in MySQL InnoDB and SQL Server, the primary key is typically clustered. A **non-clustered**, or secondary, index is a separate structure pointing to rows; a table can have many. PostgreSQL tables are heaps, with all indexes secondary.

## Views versus materialized views

A view is a stored query, run each time it's used, holding no data. A materialized view stores its result and must be refreshed, trading freshness for speed.

## Subquery versus join versus CTE

A join combines columns from related tables. A subquery nests one query inside another, for filtering or computing values. A CTE names a subquery with \`WITH\` for readability and reuse within one statement, and supports recursion. Optimizers often execute equivalent forms the same way, so choose the clearest.

## Correlated subqueries

A correlated subquery references the outer query and logically runs once per outer row, such as comparing each employee with their own department's average. It can be slow without indexes; joins or window functions are common rewrites.

## SQL injection

SQL injection happens when user input is concatenated into SQL, letting attackers run their own SQL. Prevent it with parameterized queries or prepared statements, which send SQL and values separately, plus least-privilege database accounts.

## OLTP versus OLAP

**OLTP** (online transaction processing) systems handle many small, concurrent reads and writes, such as orders and payments, using normalized schemas. **OLAP** (online analytical processing) systems run large aggregate queries over historical data, often using denormalized star schemas and columnar storage, such as BigQuery, Snowflake or Redshift.

## Stored procedures, functions and triggers

A **stored procedure** is saved SQL logic that can perform actions and manage transactions. A **function** returns a value and can be used inside queries. A **trigger** runs automatically on events such as \`INSERT\`, \`UPDATE\` or \`DELETE\`, for auditing or enforcing complex rules. Heavy use of triggers can make behaviour hard to follow.

## How to answer conceptual questions

Lead with a one-sentence definition, add the key difference or mechanism, then give a short example or a practical implication. For "X versus Y" questions, a comparison of three or four properties is clearer than paragraphs. Where databases differ, such as default isolation levels or TRUNCATE rollback, say so; it shows real-world experience.

## How interviewers test this

These questions come as quick-fire rounds or as follow-ups to your queries. Practise answering each in under a minute, aloud, and connect concepts to queries you've written: explain why your query used \`LEFT JOIN\` instead of \`INNER JOIN\`, or \`DENSE_RANK\` instead of \`RANK\`.`,
    sources: [PG_MVCC, PG_PERF, UTL, MODERN_SQL]
  }
};
