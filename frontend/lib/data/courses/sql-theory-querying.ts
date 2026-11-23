// Long-form theory for SQL filtering, functions and grouping modules. Original writing.
import { LessonTheory } from './utils';
import { PG_QUERIES, PG_FUNCS, PG_COMPARISON, PG_PERF, SQLITE_LANG, UTL, MODERN_SQL } from './sql-theory-sources';

export const sqlQueryingTheory: Record<string, LessonTheory> = {
  "where-and-comparison-operators": {
    theory: `The \`WHERE\` clause filters rows, keeping only those that satisfy a condition. It's how a query narrows a million-row table down to the handful of rows you care about. This lesson explains how \`WHERE\` evaluates conditions, the comparison operators, how comparisons behave for numbers, text and dates, and how to write filters that can use indexes.

## How WHERE works

\`WHERE\` evaluates its condition once for each row produced by \`FROM\`. Rows where the condition is TRUE stay; rows where it's FALSE or UNKNOWN are dropped.

~~~sql
SELECT name, salary
FROM employees
WHERE salary > 80000;
~~~

The condition can reference any column of the source tables, including columns not in the select list. It can't reference column aliases from \`SELECT\` or aggregate functions, because both are computed later in the query's logical order.

## Comparison operators

| Operator | Meaning | Example |
|---|---|---|
| \`=\` | Equal | \`dept_id = 10\` |
| \`<>\` or \`!=\` | Not equal | \`status <> 'terminated'\` |
| \`<\`, \`>\` | Less than, greater than | \`salary > 50000\` |
| \`<=\`, \`>=\` | At most, at least | \`hire_date >= '2023-01-01'\` |

\`<>\` is the SQL standard; \`!=\` is accepted by all major databases. SQL uses a single \`=\` for comparison, not \`==\` as in many programming languages.

## Comparing numbers

Numeric comparisons behave as expected, with two cautions. Floating-point columns store approximations, so \`WHERE price = 0.3\` can miss a value computed as 0.1 + 0.2. Use exact \`NUMERIC\` types for values you'll compare for equality, such as money. And comparisons between an integer column and a decimal literal convert types; \`WHERE quantity > 2.5\` works, but understand that the database converts one side.

## Comparing text

Text comparisons follow the column's **collation**, the rules for ordering and equality. In a typical collation, \`'apple' < 'banana'\` because comparison goes character by character. Two details catch people out:

- **Case**: PostgreSQL compares case-sensitively, so \`'Alice' = 'alice'\` is false. MySQL and SQL Server usually use case-insensitive collations, so it's true there. For portable case-insensitive matching, compare \`LOWER(name) = 'alice'\`
- **Trailing spaces**: values in \`CHAR(n)\` columns are padded with spaces, and comparisons with \`CHAR\` usually ignore trailing spaces, while \`VARCHAR\` comparisons may not, depending on the database

Text literals use single quotes. Double quotes mean an identifier in standard SQL, so \`WHERE name = "Alice"\` looks for a column named \`Alice\` in PostgreSQL. A single quote inside a string is escaped by doubling it: \`'O''Brien'\`.

## Comparing dates

Date literals in ISO format, \`'2024-03-15'\`, work in every major database. Because ISO dates sort as text in date order, comparisons such as \`hire_date >= '2024-01-01'\` are reliable even in SQLite, which stores dates as text.

Timestamps need care with ranges. To find everything on 15 March 2024, this misses most of the day:

~~~sql
WHERE created_at <= '2024-03-15'          -- means up to 00:00:00 on the 15th
~~~

Use a half-open range instead, including the start and excluding the next day:

~~~sql
WHERE created_at >= '2024-03-15' AND created_at < '2024-03-16'
~~~

Half-open ranges work for any precision of timestamp and never overlap or leave gaps between consecutive periods.

## NULL in comparisons

Every comparison with NULL is UNKNOWN, so \`WHERE manager_id = NULL\` and \`WHERE manager_id <> NULL\` both return no rows. Use \`IS NULL\` and \`IS NOT NULL\`. Remember also that \`WHERE salary <> 50000\` excludes rows where salary is NULL, which surprises people expecting "everything except 50,000".

## Filters and indexes

An index on a column lets the database find matching rows without scanning the whole table, but only when the condition is written so the index can be used. The rule: keep the indexed column alone on one side of the comparison.

| Can use an index on \`salary\` | Can't use it |
|---|---|
| \`salary > 50000\` | \`salary * 12 > 600000\` |
| \`salary BETWEEN 40000 AND 60000\` | \`salary + bonus > 60000\` |

The same applies to functions: \`WHERE YEAR(hire_date) = 2024\` or \`WHERE LOWER(email) = 'x'\` hides the column inside a function, so a plain index on it can't help. Rewrite as a range, \`hire_date >= '2024-01-01' AND hire_date < '2025-01-01'\`, or create an index on the expression itself, which PostgreSQL, SQLite and MySQL 8 support. Conditions that can use an index are sometimes called **sargable**, short for "search argument able".

## Implicit type conversion

Comparing a column with a value of a different type forces a conversion. In MySQL, comparing a text column holding phone numbers with a number, \`WHERE phone = 9876543210\`, converts every row's text to a number, which prevents index use and can match unexpected values. Always compare with a literal of the column's own type.

## Parameterized filters

In application code, filter values come from users. Never concatenate them into SQL strings; use parameters, \`WHERE email = ?\`, so the database treats input strictly as data. This prevents SQL injection and lets the database reuse the query plan.

## How interviewers test this

Expect filtering queries with numeric, text and date conditions, and questions such as "Why does WHERE x = NULL return nothing?" and "Why isn't my index used?" Use \`IS NULL\`, half-open date ranges and sargable conditions that keep indexed columns bare, and mention collation when comparing text.`,
    sources: [PG_QUERIES, PG_COMPARISON, UTL]
  },

  "logical-operators-in-between": {
    theory: `Real filters combine several conditions: employees in engineering **and** hired this year, orders that are pending **or** on hold, products **not** discontinued. SQL's logical operators combine conditions, and \`IN\` and \`BETWEEN\` express common combinations more compactly. This lesson explains \`AND\`, \`OR\` and \`NOT\`, operator precedence and why parentheses matter, \`IN\` and \`BETWEEN\` with their edge cases, and how NULL changes the results.

## AND, OR and NOT

\`AND\` requires both conditions to be true; \`OR\` requires at least one; \`NOT\` inverts a condition:

~~~sql
SELECT name FROM employees
WHERE dept_id = 10 AND salary > 70000;

SELECT name FROM employees
WHERE status = 'on_leave' OR status = 'suspended';

SELECT name FROM employees
WHERE NOT (dept_id = 10);
~~~

## Precedence and parentheses

\`NOT\` binds tightest, then \`AND\`, then \`OR\`. So this query doesn't mean what it appears to:

~~~sql
SELECT name FROM employees
WHERE dept_id = 10 OR dept_id = 20 AND salary > 70000;
~~~

Because \`AND\` binds first, it means \`dept_id = 10 OR (dept_id = 20 AND salary > 70000)\`: everyone in department 10, plus well-paid people in department 20. If you meant well-paid people in either department, write:

~~~sql
WHERE (dept_id = 10 OR dept_id = 20) AND salary > 70000;
~~~

Use parentheses whenever a condition mixes \`AND\` and \`OR\`, even when precedence happens to give the right answer. They make intent clear to readers and prevent bugs when someone edits the query later.

## De Morgan's laws

Negating a combined condition flips the operator:

- \`NOT (A AND B)\` equals \`NOT A OR NOT B\`
- \`NOT (A OR B)\` equals \`NOT A AND NOT B\`

So "not in department 10 or 20" is \`NOT (dept_id = 10 OR dept_id = 20)\`, which equals \`dept_id <> 10 AND dept_id <> 20\`. A common mistake is writing \`dept_id <> 10 OR dept_id <> 20\`, which is true for every row, since no value equals both 10 and 20.

## IN

\`IN\` tests membership in a list:

~~~sql
SELECT name FROM employees
WHERE dept_id IN (10, 20, 30);
~~~

It's shorthand for \`dept_id = 10 OR dept_id = 20 OR dept_id = 30\`, shorter and easier to read. The list can also be a subquery: \`WHERE dept_id IN (SELECT id FROM departments WHERE location = 'Bengaluru')\`.

## NOT IN and NULL

\`NOT IN\` is shorthand for a chain of \`<>\` comparisons joined by \`AND\`. If the list contains NULL, one comparison is always UNKNOWN, so the whole condition is never TRUE:

~~~sql
WHERE dept_id NOT IN (10, NULL)   -- returns no rows, ever
~~~

With literal lists, this is rare. With subqueries, it's a real danger: if the subquery can return a NULL, \`NOT IN\` silently returns nothing. Use \`NOT EXISTS\`, or add \`WHERE column IS NOT NULL\` inside the subquery. Also, rows where the tested column itself is NULL are never returned by \`IN\` or \`NOT IN\`.

## BETWEEN

\`BETWEEN\` tests whether a value falls in a range, **inclusive** of both ends:

~~~sql
SELECT name FROM employees
WHERE salary BETWEEN 50000 AND 80000;   -- 50,000 and 80,000 both included
~~~

It's equivalent to \`salary >= 50000 AND salary <= 80000\`. The lower bound must come first: \`BETWEEN 80000 AND 50000\` matches nothing in standard SQL. \`NOT BETWEEN\` matches values outside the range.

## BETWEEN with timestamps

Because \`BETWEEN\` is inclusive, it's risky with timestamps:

~~~sql
WHERE created_at BETWEEN '2024-03-01' AND '2024-03-31'
~~~

The upper bound means midnight at the start of 31 March, so almost all of that day is excluded. Changing it to \`'2024-03-31 23:59:59'\` misses fractional seconds. The reliable form is a half-open range: \`created_at >= '2024-03-01' AND created_at < '2024-04-01'\`. Use \`BETWEEN\` for integers and dates without times, and half-open ranges for timestamps.

## Short-circuit evaluation

Programming languages usually evaluate \`A AND B\` left to right and skip B when A is false. SQL doesn't promise any evaluation order: the optimizer may evaluate conditions in whatever order it estimates is cheapest. Don't rely on order for safety. This can fail if the optimizer evaluates the division first:

~~~sql
WHERE quantity <> 0 AND total / quantity > 10
~~~

Write \`total / NULLIF(quantity, 0) > 10\` instead, or use a \`CASE\` expression, which does guarantee evaluation order in most databases.

## Logical operators and NULL

Three-valued logic applies: \`TRUE AND UNKNOWN\` is UNKNOWN, \`FALSE AND UNKNOWN\` is FALSE, \`TRUE OR UNKNOWN\` is TRUE, and \`NOT UNKNOWN\` is UNKNOWN. In practice, a condition like \`WHERE bonus > 1000 OR dept_id = 10\` returns department 10 employees even if their bonus is NULL, because the OR's second branch is TRUE.

## OR and performance

Conditions joined by \`OR\` on different columns, such as \`WHERE email = ? OR phone = ?\`, can be harder to optimize than \`AND\`. Some databases combine two index scans; others fall back to a full table scan. Rewriting as a \`UNION\` of two indexed queries sometimes helps on large tables. Check with \`EXPLAIN\`.

## How interviewers test this

Expect filters mixing \`AND\` and \`OR\`, and questions such as "Is BETWEEN inclusive?" and "Why does NOT IN return nothing?" Use parentheses, apply De Morgan's laws correctly, prefer half-open ranges for timestamps, and recommend \`NOT EXISTS\` when NULLs might appear in a subquery.`,
    sources: [PG_COMPARISON, PG_QUERIES, MODERN_SQL]
  },

  "like-pattern-matching": {
    theory: `\`LIKE\` matches text against a pattern with wildcards, answering questions such as "which customers have a Gmail address?" or "which products start with 'Pro'?" It's flexible but has performance traps, since some patterns can't use an index. This lesson explains the two wildcards, escaping, case sensitivity across databases, how patterns interact with indexes, and the alternatives for more powerful matching: regular expressions and full-text search.

## The two wildcards

\`LIKE\` supports two wildcards:

| Wildcard | Matches | Example | Matches |
|---|---|---|---|
| \`%\` | Any sequence of characters, including none | \`'A%'\` | Anything starting with A |
| \`_\` | Exactly one character | \`'_at'\` | \`'cat'\`, \`'bat'\`, not \`'at'\` |

~~~sql
SELECT name FROM customers WHERE email LIKE '%@gmail.com';
SELECT name FROM products WHERE code LIKE 'PRD-____';   -- PRD- plus four characters
~~~

The pattern must match the **whole** value. \`LIKE 'son'\` matches only the exact string \`'son'\`, not \`'Johnson'\`. For "contains", wrap the text in percent signs: \`LIKE '%son%'\`.

## Common patterns

| Goal | Pattern |
|---|---|
| Starts with "Pro" | \`LIKE 'Pro%'\` |
| Ends with ".pdf" | \`LIKE '%.pdf'\` |
| Contains "data" | \`LIKE '%data%'\` |
| Exactly five characters | \`LIKE '_____'\` |
| Second character is "a" | \`LIKE '_a%'\` |

\`NOT LIKE\` returns rows that don't match. Like other comparisons, \`LIKE\` with a NULL value returns UNKNOWN, so rows with NULL in the column are excluded by both \`LIKE\` and \`NOT LIKE\`.

## Escaping wildcards

To match a literal \`%\` or \`_\`, escape it. The \`ESCAPE\` clause names an escape character:

~~~sql
SELECT code FROM discounts WHERE code LIKE '%50!%%' ESCAPE '!';   -- contains "50%"
~~~

Here \`!%\` means a literal percent sign. PostgreSQL and MySQL also treat backslash as the default escape character. Escaping matters with user input: a search box that passes \`_\` or \`%\` straight into a pattern lets users run broader matches than intended, and patterns starting with \`%\` can force expensive scans.

## Case sensitivity

Whether \`LIKE\` ignores case depends on the database:

| Database | Default \`LIKE\` behaviour |
|---|---|
| PostgreSQL | Case-sensitive; use \`ILIKE\` for case-insensitive matching |
| MySQL | Follows the collation, usually case-insensitive |
| SQL Server | Follows the collation, usually case-insensitive |
| SQLite | Case-insensitive for ASCII letters only |

The portable approach is \`LOWER(name) LIKE LOWER('%alice%')\`, though wrapping the column in a function prevents a plain index from helping.

## LIKE and indexes

A B-tree index stores values in sorted order, like a dictionary. It can find all words starting with "Pro" quickly by jumping to that section, but it can't find all words containing "pro" somewhere, any more than a dictionary helps you find words with "pro" in the middle.

| Pattern | Can use a B-tree index? |
|---|---|
| \`'Pro%'\` (prefix) | Yes, as a range scan |
| \`'%pro'\` (suffix) | No |
| \`'%pro%'\` (contains) | No, full scan |

In PostgreSQL, prefix matching with an index needs the \`C\` collation or a \`text_pattern_ops\` index. For suffix searches, a trick is to index the reversed string and search for the reversed pattern as a prefix. For "contains" searches on large tables, PostgreSQL's \`pg_trgm\` extension builds trigram indexes that make \`LIKE '%pro%'\` and \`ILIKE\` fast.

## Regular expressions

When wildcards aren't enough, databases offer regular expressions:

~~~sql
-- PostgreSQL: phone numbers of exactly 10 digits
SELECT phone FROM customers WHERE phone ~ '^[0-9]{10}$';

-- MySQL 8 equivalent
SELECT phone FROM customers WHERE phone REGEXP '^[0-9]{10}$';
~~~

PostgreSQL uses \`~\` for case-sensitive and \`~*\` for case-insensitive matching; MySQL uses \`REGEXP\` or \`REGEXP_LIKE()\`. SQLite defines the \`REGEXP\` operator but needs an extension to supply its implementation. Regular expressions are powerful but generally can't use ordinary indexes, so they suit validation and smaller tables.

## SIMILAR TO

The SQL standard's \`SIMILAR TO\` operator mixes \`LIKE\` wildcards with some regular expression syntax. PostgreSQL supports it, but it's rarely used; most people choose \`LIKE\` for basic patterns and full regular expressions for complex ones.

## Full-text search

Searching documents for words is a different problem from pattern matching. Searching for "running" should also find "run", rank better matches higher, and handle large text quickly. \`LIKE '%run%'\` does none of that and also matches "prune". Full-text search tokenizes text into words, reduces them to their stems and builds a specialized index:

~~~sql
-- PostgreSQL
SELECT title FROM articles
WHERE to_tsvector('english', body) @@ to_tsquery('english', 'database & index');
~~~

MySQL offers \`FULLTEXT\` indexes with \`MATCH ... AGAINST\`, and SQLite offers the FTS5 extension. Large search features often use dedicated engines such as Elasticsearch or OpenSearch.

## How interviewers test this

Expect queries such as "names starting with A", "emails from a domain" and "names whose second letter is a". Know \`%\` versus \`_\`, that patterns must match the whole value, how to escape wildcards, and why a leading \`%\` prevents index use. Mention \`ILIKE\`, regular expressions and full-text search as the next tools.`,
    sources: [PG_FUNCS, SQLITE_LANG, UTL]
  },

  "null-handling": {
    theory: `NULL represents a missing value, and it behaves differently from every other value in SQL. Comparisons with it are unknown, arithmetic with it produces NULL, and aggregates skip it. Writing correct queries means handling NULL deliberately in filters, calculations, sorting and joins. This lesson is a practical guide: how to test for NULL, replace it, compare values that might be NULL, and avoid the most common NULL bugs.

## Testing for NULL

Only \`IS NULL\` and \`IS NOT NULL\` test for NULL correctly:

~~~sql
SELECT name FROM employees WHERE manager_id IS NULL;       -- top-level managers
SELECT name FROM employees WHERE phone IS NOT NULL;        -- has a phone number
~~~

\`= NULL\` and \`<> NULL\` always produce UNKNOWN and return no rows. Some tools, such as SQL Server with a legacy setting, once allowed \`= NULL\`, which spread a bad habit; never rely on it.

## NULL in arithmetic and strings

Any arithmetic with NULL gives NULL: \`salary + bonus\` is NULL for every employee without a bonus. String concatenation with the standard \`||\` operator also gives NULL: \`first_name || ' ' || middle_name\` is NULL when \`middle_name\` is NULL. MySQL's \`CONCAT()\` likewise returns NULL if any argument is NULL, while \`CONCAT_WS()\` skips NULL arguments. PostgreSQL's \`CONCAT()\` treats NULL as an empty string. Oracle treats empty strings as NULL, the opposite surprise.

## COALESCE

\`COALESCE\` returns its first non-NULL argument, making it the main tool for substituting defaults:

~~~sql
SELECT name,
       salary + COALESCE(bonus, 0) AS total_pay,
       COALESCE(mobile, office_phone, 'no contact') AS contact
FROM employees;
~~~

It's standard and works in every major database. Older, dialect-specific functions do similar jobs: \`IFNULL(a, b)\` in MySQL and SQLite, \`ISNULL(a, b)\` in SQL Server, \`NVL(a, b)\` in Oracle. Prefer \`COALESCE\` for portability, and note it accepts any number of arguments.

## NULLIF

\`NULLIF(a, b)\` returns NULL when a equals b, and a otherwise. Its main use is preventing division by zero:

~~~sql
SELECT region, revenue / NULLIF(orders, 0) AS revenue_per_order
FROM sales;
~~~

When \`orders\` is 0, the division becomes \`revenue / NULL\`, which is NULL instead of an error. Wrap it in \`COALESCE(..., 0)\` if you'd rather show zero. \`NULLIF\` also converts placeholder values into real NULLs, such as \`NULLIF(phone, '')\` for empty strings left by an old form.

## Comparing values that might be NULL

To check whether two nullable columns hold the same value, \`a = b\` fails when both are NULL. The standard solution is \`IS NOT DISTINCT FROM\`, which treats two NULLs as equal:

~~~sql
SELECT * FROM staging s JOIN employees e
ON s.middle_name IS NOT DISTINCT FROM e.middle_name;
~~~

PostgreSQL and SQLite (as \`IS\`) support it; MySQL uses the null-safe operator \`<=>\`. Without these, write \`(a = b OR (a IS NULL AND b IS NULL))\`.

## NULL in negated filters

\`WHERE status <> 'active'\` excludes rows where status is NULL, because \`NULL <> 'active'\` is unknown. If those rows should be included, say so explicitly:

~~~sql
WHERE status <> 'active' OR status IS NULL
-- or, in PostgreSQL:
WHERE status IS DISTINCT FROM 'active'
~~~

Similarly, \`NOT IN\` with a NULL in its list returns no rows. Prefer \`NOT EXISTS\` for subqueries.

## NULL in aggregates

Aggregates skip NULLs, and the results can mislead:

| Expression | With bonuses 1000, 3000 and NULL |
|---|---|
| \`COUNT(*)\` | 3 |
| \`COUNT(bonus)\` | 2 |
| \`SUM(bonus)\` | 4000 |
| \`AVG(bonus)\` | 2000 (sum over 2 non-NULL rows) |
| \`AVG(COALESCE(bonus, 0))\` | 1333.33 (sum over all 3 rows) |

Decide whether a missing value means "unknown, leave it out" or "zero", and write the query to match. \`SUM\` over no rows, or only NULLs, returns NULL rather than 0, so report totals as \`COALESCE(SUM(amount), 0)\`.

## NULL in sorting

Databases disagree on where NULLs sort. PostgreSQL and Oracle treat NULL as larger than any value, so NULLs come last in ascending order. MySQL, SQLite and SQL Server treat it as smaller, putting NULLs first. PostgreSQL, Oracle and SQLite (since 3.30) support explicit control:

~~~sql
SELECT name, last_login FROM users ORDER BY last_login DESC NULLS LAST;
~~~

In MySQL, emulate it with \`ORDER BY last_login IS NULL, last_login DESC\`, since the boolean expression sorts false before true.

## NULL in joins and grouping

Rows with NULL join keys never match in an inner join, because \`NULL = NULL\` isn't true. Outer joins produce NULLs in the columns of the unmatched side, which is how you find missing matches: \`LEFT JOIN ... WHERE right_table.id IS NULL\`. \`GROUP BY\` and \`DISTINCT\` treat all NULLs as one group.

## Designing to avoid NULL problems

Declare columns \`NOT NULL\` unless absence is meaningful, and use defaults where a sensible one exists. When NULL is allowed, document what it means. Avoid using placeholder values such as \`-1\`, \`'N/A'\` or \`'1900-01-01'\` to mean "missing": they corrupt averages, comparisons and sorts in ways that are harder to detect than NULL.

## How interviewers test this

Expect questions on \`IS NULL\`, \`COALESCE\` versus \`ISNULL\`/\`NVL\`, \`NULLIF\` for division by zero, and how NULL affects \`COUNT\` and \`AVG\`. Show the aggregate table, handle negated filters explicitly, and mention \`IS DISTINCT FROM\` for null-safe comparison.`,
    sources: [PG_COMPARISON, PG_FUNCS, MODERN_SQL]
  },

  "order-by-limit-distinct": {
    theory: `Without \`ORDER BY\`, a database returns rows in whatever order is convenient, which can change from one run to the next. \`ORDER BY\` sorts results, \`LIMIT\` and \`OFFSET\` return a slice, and together they power leaderboards, "top 10" lists and paginated screens. This lesson explains sorting rules, ties and determinism, \`LIMIT\` and \`OFFSET\` across dialects, why deep offsets are slow, and keyset pagination as the scalable alternative.

## ORDER BY basics

~~~sql
SELECT name, salary FROM employees
ORDER BY salary DESC;
~~~

\`ASC\` (ascending) is the default; \`DESC\` sorts descending. Multiple sort keys break ties in order:

~~~sql
ORDER BY dept_id ASC, salary DESC, name ASC
~~~

This sorts by department, then by highest salary within each department, then alphabetically among equal salaries. Each key has its own direction.

## What you can sort by

\`ORDER BY\` runs after \`SELECT\` in the logical order, so it can use column aliases and expressions:

~~~sql
SELECT name, salary * 12 AS annual FROM employees ORDER BY annual DESC;
SELECT name FROM employees ORDER BY LENGTH(name), name;
~~~

You can also sort by column position, \`ORDER BY 2 DESC\`, meaning the second column in the select list. It's handy interactively but fragile in code, since adding a column shifts positions. You can sort by columns not in the select list, except with \`SELECT DISTINCT\`, where most databases require the sort keys to be selected.

## No ORDER BY, no order

Relational tables are unordered sets. A query without \`ORDER BY\` might return rows in insertion order today and a different order tomorrow, after an update, a vacuum, a parallel scan or a new index. Any code that depends on row order must specify \`ORDER BY\`. This includes \`LIMIT\`: \`SELECT * FROM employees LIMIT 5\` returns an arbitrary five rows.

## Ties and deterministic order

If several rows share the same sort value, their relative order is undefined. For a "top 3 salaries" list where the third and fourth employees earn the same, either might appear, and the choice can change between runs. That causes bugs in pagination, where a row can appear on two pages or none. Make ordering **deterministic** by adding a unique column as the last tiebreaker:

~~~sql
ORDER BY salary DESC, id
~~~

## Sorting text and NULLs

Text sorts according to the column's collation, which decides whether uppercase sorts before lowercase and how accented characters compare. Numbers stored as text sort as text, so \`'10'\` comes before \`'9'\`; store numbers in numeric columns, or cast when sorting. NULL placement varies: last in ascending order in PostgreSQL and Oracle, first in MySQL, SQLite and SQL Server. Use \`NULLS FIRST\` or \`NULLS LAST\` where supported.

## LIMIT and OFFSET

\`LIMIT\` restricts the number of rows returned, and \`OFFSET\` skips rows first:

~~~sql
SELECT name, salary FROM employees
ORDER BY salary DESC, id
LIMIT 10 OFFSET 20;     -- rows 21 to 30
~~~

Syntax varies by database:

| Database | First 10 rows |
|---|---|
| PostgreSQL, MySQL, SQLite | \`LIMIT 10\` |
| SQL Server | \`SELECT TOP 10 ...\` or \`OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY\` |
| Standard SQL, Oracle 12c+, PostgreSQL | \`FETCH FIRST 10 ROWS ONLY\` |

MySQL also accepts \`LIMIT 20, 10\`, meaning offset 20 and count 10, an order that people often confuse.

## Page numbers

For page number p, counting from 1, with s rows per page, the offset is (p − 1) × s. Page 3 with 10 rows per page uses \`LIMIT 10 OFFSET 20\`.

## Why deep offsets are slow

\`OFFSET\` doesn't jump to a position. The database must produce and discard every skipped row. \`OFFSET 100000\` reads 100,010 rows to return 10. Pages near the end of a large result get progressively slower, and a crawler walking through every page can overload a server.

Offsets also shift when data changes. If a new row is inserted at the top while a user moves from page 1 to page 2, the last row of page 1 is pushed onto page 2 and appears twice.

## Keyset pagination

Keyset pagination, also called the seek method, remembers where the previous page ended and continues from there:

~~~sql
-- first page
SELECT id, name, salary FROM employees
ORDER BY salary DESC, id
LIMIT 10;

-- next page: continue after the last row seen (salary 72000, id 418)
SELECT id, name, salary FROM employees
WHERE (salary, id) < (72000, 418)
ORDER BY salary DESC, id
LIMIT 10;
~~~

With an index on \`(salary, id)\`, each page costs about the same regardless of depth, and inserted rows don't cause duplicates. The trade-off is that you can't jump directly to page 50; you can only move forward or backward. That fits infinite scrolling and "load more" buttons, which is why large sites use it. The row-value comparison \`(salary, id) < (...)\` works in PostgreSQL, MySQL and SQLite; in other databases, expand it into \`salary < 72000 OR (salary = 72000 AND id < 418)\`.

## Sorting cost

Sorting n rows costs O(n log n) and may spill to disk when results exceed the database's sort memory. An index whose order matches the \`ORDER BY\` lets the database read rows already sorted and stop after \`LIMIT\` rows, turning a full sort into a quick index walk. For "top N" queries, many databases use a partial sort that keeps only the best N rows in memory.

## DISTINCT with ORDER BY and LIMIT

The logical order is \`SELECT\`, then \`DISTINCT\`, then \`ORDER BY\`, then \`LIMIT\`. So \`SELECT DISTINCT dept_id FROM employees ORDER BY dept_id LIMIT 3\` deduplicates first, then returns the three smallest department IDs.

## How interviewers test this

Expect top-N queries, pagination and "Why is my pagination slow?" Always pair \`LIMIT\` with \`ORDER BY\`, add a unique tiebreaker, know the dialect differences, explain why large offsets scan skipped rows, and describe keyset pagination with its trade-off.`,
    sources: [PG_QUERIES, UTL, SQLITE_LANG]
  },

  "string-functions": {
    theory: `String functions clean, transform and extract text: trimming stray spaces, standardizing case, pulling a domain out of an email, or formatting names for a report. Function names vary more across databases than most of SQL, so knowing the standard forms and the common dialect differences matters. This lesson covers length and case, concatenation, trimming, extracting substrings, searching and replacing, padding, and the performance cost of functions in filters.

## Length and case

~~~sql
SELECT name,
       LENGTH(name)  AS chars,
       UPPER(name)   AS upper_name,
       LOWER(email)  AS normalized_email
FROM employees;
~~~

\`LENGTH\` counts characters in PostgreSQL and SQLite, but bytes in MySQL, where \`CHAR_LENGTH\` counts characters. The difference matters for non-ASCII text: \`'नमस्ते'\` has 6 characters but 18 bytes in UTF-8. SQL Server uses \`LEN\`, which ignores trailing spaces. \`UPPER\` and \`LOWER\` are standard everywhere. PostgreSQL adds \`INITCAP\` for title case.

## Concatenation

Joining strings uses different syntax across databases. The SQL standard, PostgreSQL, SQLite and Oracle use the double-pipe operator:

~~~sql
SELECT first_name || ' ' || last_name AS full_name FROM employees;
~~~

MySQL treats \`||\` as logical OR by default and uses \`CONCAT(first_name, ' ', last_name)\` instead. SQL Server uses \`+\` or \`CONCAT\`.

\`CONCAT\` is available in PostgreSQL, MySQL and SQL Server, making it the most portable choice. NULL handling differs: \`||\` returns NULL if any part is NULL, MySQL's \`CONCAT\` returns NULL if any argument is NULL, and PostgreSQL's \`CONCAT\` skips NULLs. \`CONCAT_WS(separator, ...)\`, in PostgreSQL and MySQL, joins values with a separator and skips NULLs, which suits building addresses from optional parts.

## Trimming

\`TRIM\` removes leading and trailing spaces, or other characters:

~~~sql
SELECT TRIM('  Asha  ');                 -- 'Asha'
SELECT LTRIM('  Asha'), RTRIM('Asha  ');  -- left only, right only
SELECT TRIM(BOTH '0' FROM '000123');      -- '123'
~~~

Stray spaces from imported data cause failed matches: \`'Asha '\` doesn't equal \`'Asha'\` in a \`VARCHAR\` comparison. Trimming during import, or with a \`CHECK\` constraint that rejects untrimmed values, prevents these bugs.

## Extracting substrings

\`SUBSTRING\` extracts part of a string by position, counting from 1:

~~~sql
SELECT SUBSTRING('StudyHub' FROM 1 FOR 5);   -- 'Study' (standard form)
SELECT SUBSTRING('StudyHub', 6, 3);          -- 'Hub' (common shorthand)
~~~

SQLite and Oracle use \`SUBSTR\`. \`LEFT(s, n)\` and \`RIGHT(s, n)\` take characters from either end in PostgreSQL, MySQL and SQL Server. SQL strings are 1-indexed, unlike most programming languages; using position 0 is a common bug.

## Searching

Finding the position of a substring is essential for extracting variable-length parts:

| Database | Function | Returns |
|---|---|---|
| PostgreSQL, MySQL, standard | \`POSITION('@' IN email)\` | Position, or 0 if absent |
| MySQL, SQLite, Oracle | \`INSTR(email, '@')\` | Position, or 0 |
| SQL Server | \`CHARINDEX('@', email)\` | Position, or 0 |

Extracting an email's domain combines search and substring:

~~~sql
SELECT SUBSTRING(email FROM POSITION('@' IN email) + 1) AS domain
FROM customers;
~~~

PostgreSQL also offers \`SPLIT_PART(email, '@', 2)\`, and MySQL offers \`SUBSTRING_INDEX(email, '@', -1)\`, both more readable for this task.

## Replacing and padding

\`REPLACE(s, from, to)\` replaces every occurrence of a substring:

~~~sql
SELECT REPLACE(phone, '-', '') FROM customers;   -- '98-765-43210' becomes '9876543210'
~~~

\`LPAD\` and \`RPAD\` pad a string to a length: \`LPAD('42', 5, '0')\` gives \`'00042'\`, useful for fixed-width codes. PostgreSQL and MySQL also offer \`REVERSE\` and \`REPEAT\`, and regular expression functions such as \`REGEXP_REPLACE\` for complex cleanup.

## Aggregating strings

Combining values from many rows into one string is a frequent reporting need, such as listing every employee in each department:

| Database | Function |
|---|---|
| PostgreSQL, SQL Server 2017+, standard | \`STRING_AGG(name, ', ')\` |
| MySQL | \`GROUP_CONCAT(name SEPARATOR ', ')\` |
| SQLite | \`GROUP_CONCAT(name, ', ')\` |

~~~sql
SELECT dept_id, STRING_AGG(name, ', ' ORDER BY name) AS team
FROM employees
GROUP BY dept_id;
~~~

MySQL truncates \`GROUP_CONCAT\` output at 1,024 bytes by default, controlled by the \`group_concat_max_len\` setting, a silent limit that surprises people.

## Converting between types

\`CAST(expr AS type)\` converts values: \`CAST(42 AS VARCHAR)\`, \`CAST('2024-03-15' AS DATE)\`. PostgreSQL also accepts \`'42'::INTEGER\`. Casting text that isn't a valid number raises an error in PostgreSQL but may silently produce 0 in MySQL, depending on its SQL mode.

## Functions in WHERE clauses

Applying a function to a column in \`WHERE\` usually prevents index use:

~~~sql
WHERE LOWER(email) = 'asha@example.com'   -- a plain index on email can't help
~~~

The database must compute \`LOWER(email)\` for every row. Solutions: store data normalized when it's written, such as lowercased emails; create an index on the expression, \`CREATE INDEX ON customers (LOWER(email))\`, supported in PostgreSQL, SQLite and MySQL 8; or use a case-insensitive collation or PostgreSQL's \`citext\` type.

## Cleaning data with string functions

Real datasets need cleanup before analysis: trimming spaces, normalizing case, removing punctuation from phone numbers, splitting full names. Doing it once with an \`UPDATE\` and adding constraints to keep data clean is better than repeating the cleanup in every query.

## How interviewers test this

Expect tasks such as "extract the domain from an email", "find names longer than 10 characters", "list employees per department as a comma-separated string" and "format names as Last, First". Use the right function for your dialect, remember 1-based positions, handle NULL in concatenation, and mention expression indexes when filtering on functions.`,
    sources: [PG_FUNCS, SQLITE_LANG, MODERN_SQL]
  },

  "numeric-functions": {
    theory: `Numeric functions round values, compute remainders, find absolute values and perform the arithmetic behind reports. They look straightforward, but integer division, rounding rules and floating-point precision cause wrong answers that are hard to spot. This lesson explains arithmetic operators and integer division, rounding functions and their differences, modulo, choosing numeric types, and the precision traps in money and percentages.

## Arithmetic operators

SQL supports \`+\`, \`-\`, \`*\`, \`/\` and modulo, written \`%\` in most databases or \`MOD(a, b)\` in the standard and Oracle. Standard precedence applies: multiplication and division before addition and subtraction, so use parentheses when combining them. Arithmetic with NULL produces NULL.

## Integer division

When both operands are integers, many databases perform **integer division**, discarding the remainder:

~~~sql
SELECT 7 / 2;      -- 3 in PostgreSQL, SQLite and SQL Server; 3.5000 in MySQL
SELECT 7 / 2.0;    -- 3.5 everywhere
~~~

This is the most common numeric bug in SQL. A query computing a percentage as \`completed / total * 100\` returns 0 for any fraction below 1 in PostgreSQL, because \`completed / total\` truncates to 0 before the multiplication. Force decimal division by making one operand decimal:

~~~sql
SELECT completed * 100.0 / total AS pct;
SELECT CAST(completed AS NUMERIC) / total * 100 AS pct;
~~~

Putting the multiplication first, \`completed * 100.0 / total\`, also preserves precision. MySQL's \`/\` always returns a decimal, and its \`DIV\` operator performs integer division.

## Rounding functions

| Function | Behaviour | 2.5 | -2.5 | 2.4 |
|---|---|---|---|---|
| \`ROUND(x)\` | Nearest integer, halves away from zero (for exact types) | 3 | -3 | 2 |
| \`CEIL(x)\` / \`CEILING(x)\` | Smallest integer ≥ x | 3 | -2 | 3 |
| \`FLOOR(x)\` | Largest integer ≤ x | 2 | -3 | 2 |
| \`TRUNC(x)\` | Drop the fractional part, toward zero | 2 | -2 | 2 |

\`ROUND(x, n)\` rounds to n decimal places: \`ROUND(3.14159, 2)\` gives 3.14. A negative n rounds to the left of the decimal point: \`ROUND(1234, -2)\` gives 1200. \`TRUNC\` is called \`TRUNCATE(x, n)\` in MySQL; SQL Server uses \`ROUND(x, n, 1)\`.

## Rounding rules differ

For exact \`NUMERIC\` values, PostgreSQL and MySQL round halves away from zero. For floating-point values, PostgreSQL's \`ROUND\` on \`double precision\` follows the platform, typically rounding halves to the nearest even number, so \`ROUND(2.5::float8)\` gives 2. Floating-point values such as 2.675 can't be represented exactly, so \`ROUND(2.675, 2)\` may give 2.67. When rounding must be predictable, as with money, use \`NUMERIC\`.

## CEIL and FLOOR in practice

\`CEIL\` answers "how many containers do I need?" questions. To find how many pages 47 items fill at 10 per page:

~~~sql
SELECT CEIL(47 / 10.0);   -- 5
~~~

With integer division, \`CEIL(47 / 10)\` gives 4, because \`47 / 10\` truncates to 4 before \`CEIL\` sees it. An integer-only alternative is \`(47 + 10 - 1) / 10\`. \`FLOOR\` groups values into buckets: \`FLOOR(salary / 10000) * 10000\` groups salaries into ranges of 10,000.

## Modulo

The remainder after division is useful for parity, cycles and bucketing:

~~~sql
SELECT id FROM employees WHERE id % 2 = 0;           -- even IDs
SELECT id, id % 4 AS shard FROM employees;           -- assign to 4 groups
~~~

For negative numbers, \`%\` in most databases takes the sign of the dividend: \`-7 % 3\` is -1, not 2. Normalize with \`((x % n) + n) % n\` when you need a non-negative remainder.

## Other useful functions

| Function | Purpose |
|---|---|
| \`ABS(x)\` | Absolute value; differences regardless of direction |
| \`POWER(x, y)\` | x raised to the power y |
| \`SQRT(x)\` | Square root |
| \`SIGN(x)\` | -1, 0 or 1 by sign |
| \`GREATEST(a, b, ...)\` / \`LEAST(...)\` | Largest or smallest of several values in a row |
| \`RANDOM()\` / \`RAND()\` | A random number (PostgreSQL and SQLite / MySQL) |

\`GREATEST\` and \`LEAST\` compare values across columns in one row, unlike \`MAX\` and \`MIN\`, which aggregate down a column. Their NULL handling differs: PostgreSQL ignores NULL arguments, while MySQL returns NULL if any argument is NULL. SQL Server added them only in 2022.

## Choosing numeric types

| Type | Exact? | Use for |
|---|---|---|
| \`INTEGER\`, \`BIGINT\` | Yes | Counts, IDs, quantities |
| \`NUMERIC(p, s)\` / \`DECIMAL(p, s)\` | Yes | Money, rates, anything compared for equality |
| \`REAL\`, \`DOUBLE PRECISION\` | No | Scientific measurements, where tiny errors are acceptable |

Floating-point types store binary approximations, so \`0.1 + 0.2 = 0.3\` is false in \`DOUBLE PRECISION\`. Summing millions of floating-point amounts accumulates visible errors. Store money as \`NUMERIC(12, 2)\`, or as an integer count of the smallest unit, such as paise.

## Overflow

Integer arithmetic can overflow. \`INTEGER\` holds values up to about 2.1 billion; summing large values or multiplying two big numbers can exceed it. PostgreSQL raises an error on overflow, which is safe but can break reports. \`SUM\` of an integer column returns a \`BIGINT\` or \`NUMERIC\` in PostgreSQL to reduce this risk. Cast to \`BIGINT\` before multiplying large integers.

## Percentages and averages

\`AVG\` of an integer column returns a decimal in PostgreSQL and MySQL but may truncate in SQL Server. A percentage of total combines aggregates and division: \`100.0 * SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) / COUNT(*)\`. Round only for display, at the end, because rounding intermediate values compounds errors.

## How interviewers test this

Expect percentage calculations, rounding questions and "Why does this division return 0?" Explain integer division and fix it with a decimal operand, know \`ROUND\`, \`CEIL\`, \`FLOOR\` and \`TRUNC\` with negative inputs, and recommend \`NUMERIC\` for money.`,
    sources: [PG_FUNCS, SQLITE_LANG, MODERN_SQL]
  },

  "date-functions": {
    theory: `Dates and times drive most business reporting: sales by month, users who signed up this week, orders older than 30 days. Date handling is also where SQL dialects differ most, and where time zones cause subtle bugs. This lesson covers the date and time types, getting the current date, extracting parts, date arithmetic, truncating to periods, formatting, time zones, and writing date filters that use indexes.

## Date and time types

| Type | Stores | Example |
|---|---|---|
| \`DATE\` | Calendar date | \`2024-03-15\` |
| \`TIME\` | Time of day | \`14:30:00\` |
| \`TIMESTAMP\` | Date and time, no time zone | \`2024-03-15 14:30:00\` |
| \`TIMESTAMPTZ\` (PostgreSQL) | An absolute instant, shown in the session's zone | \`2024-03-15 14:30:00+05:30\` |
| \`INTERVAL\` | A duration | \`3 days\`, \`2 hours\` |

MySQL has \`DATE\`, \`DATETIME\` and \`TIMESTAMP\`, where its \`TIMESTAMP\` converts to UTC for storage. SQLite has no date types; it stores dates as ISO-8601 text, Julian day numbers or Unix timestamps, and provides functions to work with them.

## The current date and time

~~~sql
SELECT CURRENT_DATE, CURRENT_TIMESTAMP;
~~~

These standard forms work in PostgreSQL, MySQL and SQLite. Alternatives include \`NOW()\` in PostgreSQL and MySQL, \`GETDATE()\` in SQL Server and \`SYSDATE\` in Oracle. In PostgreSQL, \`NOW()\` returns the transaction's start time, so it stays constant throughout a transaction; \`clock_timestamp()\` returns the actual current time.

## Extracting parts

The standard \`EXTRACT\` function pulls out a component:

~~~sql
SELECT EXTRACT(YEAR FROM hire_date) AS yr,
       EXTRACT(MONTH FROM hire_date) AS mon,
       EXTRACT(DOW FROM hire_date) AS weekday   -- PostgreSQL: 0 = Sunday
FROM employees;
~~~

MySQL also offers \`YEAR()\`, \`MONTH()\`, \`DAY()\` and \`DAYOFWEEK()\` (where 1 is Sunday). SQLite uses \`strftime('%Y', hire_date)\`, which returns text. Weekday numbering differs by database and function, so check before filtering on day-of-week values.

## Date arithmetic

Adding and subtracting time intervals varies most across dialects:

| Task | PostgreSQL | MySQL | SQLite |
|---|---|---|---|
| Add 30 days | \`d + INTERVAL '30 days'\` | \`DATE_ADD(d, INTERVAL 30 DAY)\` | \`date(d, '+30 days')\` |
| Subtract 1 month | \`d - INTERVAL '1 month'\` | \`DATE_SUB(d, INTERVAL 1 MONTH)\` | \`date(d, '-1 month')\` |
| Days between dates | \`d2 - d1\` (for DATE values) | \`DATEDIFF(d2, d1)\` | \`julianday(d2) - julianday(d1)\` |

SQL Server uses \`DATEADD(day, 30, d)\` and \`DATEDIFF(day, d1, d2)\`, with the argument order reversed compared with MySQL's \`DATEDIFF\`.

Month arithmetic has edge cases: adding one month to 31 January gives 29 February in a leap year in PostgreSQL and MySQL, clamping to the month's last day. Adding then subtracting a month doesn't always return the original date.

## Age and differences

PostgreSQL's \`AGE(d2, d1)\` returns a human-readable interval such as "3 years 2 mons 5 days". To compute tenure in whole years, \`EXTRACT(YEAR FROM AGE(CURRENT_DATE, hire_date))\` works in PostgreSQL, and \`TIMESTAMPDIFF(YEAR, hire_date, CURDATE())\` in MySQL. Subtracting years with \`EXTRACT(YEAR ...)\` values alone is wrong, because someone hired in December 2023 hasn't worked a year by January 2024.

## Truncating to periods

Grouping by month, week or quarter requires truncating timestamps to the start of the period:

~~~sql
-- PostgreSQL
SELECT DATE_TRUNC('month', order_date) AS month, SUM(amount)
FROM orders
GROUP BY 1
ORDER BY 1;
~~~

MySQL lacks \`DATE_TRUNC\`; use \`DATE_FORMAT(order_date, '%Y-%m-01')\`. SQLite uses \`strftime('%Y-%m', order_date)\` or \`date(order_date, 'start of month')\`. Months with no orders don't appear in the result. To show them with zero, join against a generated series of months, using \`generate_series\` in PostgreSQL or a recursive CTE elsewhere.

## Formatting dates

Formatting for display uses \`TO_CHAR(d, 'DD Mon YYYY')\` in PostgreSQL and Oracle, \`DATE_FORMAT(d, '%d %b %Y')\` in MySQL, and \`strftime\` in SQLite. Format at the presentation layer when possible, and keep dates as date types in queries, because formatted strings sort and compare as text.

## Time zones

Time zones cause many real-world bugs. Recommended practice:

- store absolute instants in UTC, using \`TIMESTAMPTZ\` in PostgreSQL, which stores UTC internally
- convert to the user's zone only for display: \`created_at AT TIME ZONE 'Asia/Kolkata'\`
- be careful when grouping by day: midnight in UTC is 5:30 AM in India, so "orders per day" depends on which zone defines the day

Plain \`TIMESTAMP\` without a time zone records wall-clock time with no zone attached. It's fine for things like a store's opening hours, but ambiguous for events, since nobody knows which zone 14:30 referred to.

## Filtering by date efficiently

Wrapping a date column in a function prevents index use:

~~~sql
WHERE EXTRACT(YEAR FROM order_date) = 2024        -- scans every row
WHERE order_date >= '2024-01-01' AND order_date < '2025-01-01'   -- uses an index
~~~

Half-open ranges, inclusive start and exclusive end, are also correct for timestamps at any precision. "The last 30 days" becomes \`order_date >= CURRENT_DATE - INTERVAL '30 days'\`.

## How interviewers test this

Expect "orders in the last 7 days", "monthly revenue", "employees hired in 2023" and "average days between signup and first order". Know your dialect's arithmetic and truncation functions, filter with half-open ranges instead of functions on columns, and mention time zones when grouping by day.`,
    sources: [PG_FUNCS, SQLITE_LANG, MODERN_SQL]
  },

  "case-coalesce-nullif": {
    theory: `\`CASE\` brings if-then-else logic into SQL. It returns different values depending on conditions, so you can label rows, bucket numbers, pivot data and count conditionally, all inside a query. \`COALESCE\` and \`NULLIF\` are compact shortcuts for common \`CASE\` patterns involving NULL. This lesson explains both forms of \`CASE\`, evaluation order, where \`CASE\` can appear, conditional aggregation, and how \`COALESCE\` and \`NULLIF\` relate to \`CASE\`.

## Searched CASE

The general form tests a series of conditions in order and returns the result of the first true one:

~~~sql
SELECT name, salary,
       CASE
           WHEN salary >= 100000 THEN 'senior band'
           WHEN salary >= 60000  THEN 'mid band'
           ELSE 'junior band'
       END AS band
FROM employees;
~~~

## Evaluation order matters

Conditions are checked top to bottom, and the first match wins. Ordering from most specific to least specific is essential. If \`salary >= 60000\` came first, everyone earning 100,000 or more would match it and be labelled "mid band", because they also satisfy the broader condition.

## ELSE and NULL

If no condition matches and there's no \`ELSE\`, \`CASE\` returns NULL. That's sometimes intended, but often a bug: in an \`UPDATE ... SET salary = CASE ... END\` without \`ELSE salary\`, every unmatched row gets a NULL salary. Include an explicit \`ELSE\` unless NULL is genuinely what you want.

## The short CASE form

When comparing one expression against several values, the shorter form applies:

~~~sql
SELECT name,
       CASE status
           WHEN 'A' THEN 'Active'
           WHEN 'L' THEN 'On leave'
           WHEN 'T' THEN 'Terminated'
           ELSE 'Unknown'
       END AS status_label
FROM employees;
~~~

This form compares with \`=\`, so \`WHEN NULL\` never matches; NULL status falls through to \`ELSE\`. To catch NULL, use the searched form with \`WHEN status IS NULL\`.

## Result types

All branches of a \`CASE\` should return compatible types. Mixing text and numbers, such as \`THEN 'none' ELSE salary\`, fails in PostgreSQL, which needs one result type. Convert explicitly with \`CAST\` when branches differ.

## Where CASE can appear

\`CASE\` is an expression, so it can appear almost anywhere a value can:

- **SELECT**: computing labels or derived values
- **WHERE**: conditional filters, though plain boolean logic is usually clearer
- **ORDER BY**: custom sort orders, such as putting high-priority tickets first
- **GROUP BY**: grouping by computed buckets
- **UPDATE ... SET**: different updates for different rows
- **Inside aggregates**: conditional counting and summing

A custom sort order:

~~~sql
SELECT id, priority FROM tickets
ORDER BY CASE priority WHEN 'critical' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 ELSE 4 END,
         created_at;
~~~

## Conditional aggregation

Putting \`CASE\` inside an aggregate counts or sums only matching rows, in a single pass:

~~~sql
SELECT dept_id,
       COUNT(*) AS total,
       SUM(CASE WHEN salary >= 100000 THEN 1 ELSE 0 END) AS high_earners,
       AVG(CASE WHEN gender = 'F' THEN salary END) AS avg_female_salary
FROM employees
GROUP BY dept_id;
~~~

In the \`AVG\` example, rows that don't match produce NULL, which \`AVG\` ignores, so the average covers matching rows only. Using \`ELSE 0\` there would wrongly count non-matching rows as zeros. PostgreSQL and SQLite also support the standard \`FILTER\` clause: \`COUNT(*) FILTER (WHERE salary >= 100000)\`, which reads more clearly.

## Pivoting with CASE

Conditional aggregation turns rows into columns, called pivoting:

~~~sql
SELECT EXTRACT(YEAR FROM order_date) AS yr,
       SUM(CASE WHEN region = 'North' THEN amount ELSE 0 END) AS north,
       SUM(CASE WHEN region = 'South' THEN amount ELSE 0 END) AS south
FROM orders
GROUP BY 1;
~~~

Each region becomes a column. This pattern works in every database, unlike dialect-specific \`PIVOT\` syntax in SQL Server and Oracle.

## Short-circuit behaviour

\`CASE\` evaluates conditions in order and stops at the first true one, so it can guard against errors:

~~~sql
SELECT CASE WHEN quantity = 0 THEN NULL ELSE total / quantity END FROM order_items;
~~~

Databases generally honour this order for row-level evaluation, though some optimizers may evaluate constant subexpressions early, and aggregates inside \`CASE\` branches may be computed regardless.

## COALESCE as a CASE shortcut

\`COALESCE(a, b, c)\` returns the first non-NULL argument. It's shorthand for:

~~~sql
CASE WHEN a IS NOT NULL THEN a
     WHEN b IS NOT NULL THEN b
     ELSE c END
~~~

Use it for defaults: \`COALESCE(nickname, first_name)\` for display names, \`COALESCE(SUM(amount), 0)\` for totals that might be NULL when no rows match.

## NULLIF as a CASE shortcut

\`NULLIF(a, b)\` returns NULL when a equals b, otherwise a. It's shorthand for \`CASE WHEN a = b THEN NULL ELSE a END\`. Its best-known use is avoiding division by zero, \`total / NULLIF(count, 0)\`, and it also converts sentinel values, such as empty strings, into NULL.

## Readability

Long \`CASE\` expressions repeated across queries suggest the logic belongs elsewhere: in a lookup table joined to the data, a view or a generated column. A lookup table of status codes and labels is easier to maintain than a \`CASE\` copied into twenty queries.

## How interviewers test this

Expect tasks such as categorizing salaries into bands, counting rows per category in one query, pivoting rows into columns and avoiding division by zero. Order conditions from specific to general, include \`ELSE\`, use conditional aggregation for counts, and explain \`COALESCE\` and \`NULLIF\` as \`CASE\` shortcuts.`,
    sources: [PG_FUNCS, PG_QUERIES, MODERN_SQL]
  },

  "aggregate-functions": {
    theory: `Aggregate functions summarize many rows into a single value: how many orders, the total revenue, the average salary, the earliest and latest dates. They're the foundation of reporting and analytics in SQL. This lesson explains the five core aggregates, how each treats NULL, the differences between the forms of \`COUNT\`, using \`DISTINCT\` inside aggregates, the rules for mixing aggregates with other columns, and statistical aggregates.

## The five core aggregates

~~~sql
SELECT COUNT(*)     AS employees,
       SUM(salary)  AS payroll,
       AVG(salary)  AS avg_salary,
       MIN(salary)  AS lowest,
       MAX(salary)  AS highest
FROM employees;
~~~

Without \`GROUP BY\`, an aggregate query treats the whole table, after \`WHERE\` filtering, as one group and returns one row. \`MIN\` and \`MAX\` work on any type with an ordering: numbers, text (alphabetical) and dates (earliest and latest). \`SUM\` and \`AVG\` need numbers.

## The forms of COUNT

| Form | Counts |
|---|---|
| \`COUNT(*)\` | All rows, including rows with NULLs |
| \`COUNT(column)\` | Rows where the column isn't NULL |
| \`COUNT(DISTINCT column)\` | Distinct non-NULL values |
| \`COUNT(1)\` | All rows; identical to \`COUNT(*)\` |

A persistent myth says \`COUNT(1)\` is faster than \`COUNT(*)\`. Modern databases treat them identically. \`COUNT(*)\` states the intent most clearly.

Counting all rows in a large PostgreSQL table can be slow, because MVCC means the database must check each row's visibility to your transaction. For an approximate count, PostgreSQL's statistics in \`pg_class.reltuples\` are instant.

## Aggregates and NULL

Every aggregate except \`COUNT(*)\` ignores NULL values:

- \`SUM\` adds only non-NULL values
- \`AVG\` divides the sum of non-NULL values by the count of non-NULL values
- \`MIN\` and \`MAX\` skip NULLs

Over an empty set, or a set of only NULLs, \`COUNT\` returns 0 and the others return NULL. So a total for a customer with no orders is NULL, not 0; write \`COALESCE(SUM(amount), 0)\` when a zero is expected.

The NULL rule changes results. If three employees earn 50,000, 70,000 and NULL, then \`AVG(salary)\` is 60,000, averaging two values. If missing salaries should count as zero, \`AVG(COALESCE(salary, 0))\` gives 40,000. Both are correct answers to different questions.

## DISTINCT inside aggregates

\`DISTINCT\` deduplicates values before aggregating:

~~~sql
SELECT COUNT(DISTINCT customer_id) AS unique_customers,
       COUNT(*) AS orders
FROM orders;
~~~

\`COUNT(DISTINCT ...)\` is common and useful. \`SUM(DISTINCT ...)\` and \`AVG(DISTINCT ...)\` are rarely what you want, since two different rows with equal amounts would be counted once.

## Mixing aggregates with other columns

An aggregate collapses many rows into one value. Selecting an ordinary column alongside it raises the question "which row's value?":

~~~sql
SELECT name, MAX(salary) FROM employees;   -- error in standard SQL
~~~

Standard SQL and PostgreSQL reject this: every selected column must be inside an aggregate or listed in \`GROUP BY\`. MySQL without its \`ONLY_FULL_GROUP_BY\` mode, and SQLite, accept it and return a value from an arbitrary row. SQLite has a special case: with a single \`MIN\` or \`MAX\`, other columns come from the row holding that extreme. Relying on these behaviours produces queries that silently return wrong data elsewhere.

To find who earns the most, use a subquery, ordering or a window function:

~~~sql
SELECT name, salary FROM employees
WHERE salary = (SELECT MAX(salary) FROM employees);
~~~

## Aggregates can't go in WHERE

\`WHERE\` filters individual rows before aggregation, so \`WHERE AVG(salary) > 50000\` is an error. Filter on aggregates with \`HAVING\` after \`GROUP BY\`, or compute the aggregate in a subquery.

## Arithmetic on aggregates

Aggregates combine in expressions:

~~~sql
SELECT SUM(amount) / COUNT(DISTINCT customer_id) AS revenue_per_customer,
       MAX(salary) - MIN(salary) AS salary_range,
       100.0 * SUM(CASE WHEN status = 'returned' THEN 1 ELSE 0 END) / COUNT(*) AS return_rate
FROM orders;
~~~

Watch for integer division in ratios, and for division by zero when a count could be 0; \`NULLIF(COUNT(*), 0)\` guards against it.

## AVG precision

\`AVG\` of integers returns a decimal in PostgreSQL and MySQL, but SQL Server returns an integer, truncating the result. Cast first when precision matters: \`AVG(CAST(rating AS DECIMAL(5, 2)))\`. Round only for display: \`ROUND(AVG(salary), 2)\`.

## Statistical and other aggregates

Databases provide more aggregates for analysis:

| Function | Purpose | Support |
|---|---|---|
| \`STDDEV\`, \`VARIANCE\` | Spread of values | PostgreSQL, MySQL |
| \`PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY x)\` | Median and percentiles | PostgreSQL, Oracle, SQL Server |
| \`STRING_AGG\` / \`GROUP_CONCAT\` | Join values into a string | Most databases, different names |
| \`BOOL_AND\`, \`BOOL_OR\` | All true, any true | PostgreSQL |
| \`ARRAY_AGG\`, \`JSON_AGG\` | Collect values into an array or JSON | PostgreSQL |

The median resists outliers better than the average: one executive's salary can lift the average far above what most employees earn, while the median barely moves. MySQL and SQLite lack a built-in median; it can be computed with window functions.

## Performance

An aggregate over a whole table reads every row unless an index covers it. \`MIN\` and \`MAX\` on an indexed column are fast, since the database reads one end of the index. \`COUNT(DISTINCT ...)\` on large tables needs sorting or hashing. For dashboards over huge tables, precomputed summary tables or materialized views avoid repeating heavy aggregation.

## How interviewers test this

Expect "COUNT(*) versus COUNT(column) versus COUNT(DISTINCT)", "How do aggregates handle NULL?" and "Why can't I select name with MAX(salary)?" Explain the NULL rules with an AVG example, wrap totals in COALESCE, and fix the mixed-column problem with a subquery or window function.`,
    sources: [PG_FUNCS, PG_QUERIES, SQLITE_LANG]
  },

  "group-by": {
    theory: `\`GROUP BY\` splits rows into groups that share values and computes aggregates for each group, producing one summary row per group. It answers questions such as "headcount per department", "revenue per month" and "orders per customer". This lesson explains how grouping works, the rule for which columns you can select, grouping by multiple columns and expressions, how NULL forms its own group, and advanced grouping with \`ROLLUP\` and \`CUBE\`.

## How GROUP BY works

~~~sql
SELECT dept_id, COUNT(*) AS headcount, AVG(salary) AS avg_salary
FROM employees
GROUP BY dept_id;
~~~

Conceptually, the database:

1. takes the rows remaining after \`WHERE\`
2. sorts or hashes them into groups with equal \`dept_id\`
3. computes \`COUNT(*)\` and \`AVG(salary)\` within each group
4. outputs one row per group

If there are four departments, the result has four rows, whatever the number of employees.

## The single-value rule

After grouping, each output row represents a whole group. So the select list may contain only:

- columns listed in \`GROUP BY\`, which have one value per group
- aggregates, which compute one value per group
- constants, and expressions built from the above

~~~sql
SELECT dept_id, name, COUNT(*)      -- error: which employee's name?
FROM employees
GROUP BY dept_id;
~~~

Each department contains many names, so \`name\` has no single value per group. PostgreSQL and standard SQL reject this. MySQL without \`ONLY_FULL_GROUP_BY\` and SQLite accept it and pick a name from an arbitrary row, a source of silently wrong reports.

One standard exception: if you group by a table's primary key, PostgreSQL lets you select other columns of that table, since they're functionally dependent on the key and have one value per group.

## Grouping by multiple columns

Listing several columns creates one group per unique combination:

~~~sql
SELECT dept_id, job_title, COUNT(*) AS n
FROM employees
GROUP BY dept_id, job_title
ORDER BY dept_id, job_title;
~~~

The order of columns in \`GROUP BY\` doesn't change the groups, only possibly the physical processing. Add \`ORDER BY\` to sort the output, since \`GROUP BY\` doesn't guarantee order. Older MySQL versions sorted grouped results implicitly, and code that relied on that broke in MySQL 8.

## Grouping by expressions

You can group by computed values:

~~~sql
SELECT EXTRACT(YEAR FROM hire_date) AS hire_year, COUNT(*)
FROM employees
GROUP BY EXTRACT(YEAR FROM hire_date)
ORDER BY hire_year;
~~~

Repeat the expression in \`GROUP BY\`, or use the alias where your database allows it (PostgreSQL, MySQL and SQLite do), or group by position, \`GROUP BY 1\`. Grouping by a \`CASE\` expression creates custom buckets, such as salary bands.

## WHERE before GROUP BY

\`WHERE\` filters rows before they're grouped. To count only employees hired since 2020 per department, put the condition in \`WHERE\`:

~~~sql
SELECT dept_id, COUNT(*) FROM employees
WHERE hire_date >= '2020-01-01'
GROUP BY dept_id;
~~~

Departments with no qualifying employees disappear from the result entirely, rather than showing zero. To show every department with a zero count, start from the departments table and \`LEFT JOIN\` employees, then \`COUNT(e.id)\`, which counts only matched rows.

## NULL forms a group

All rows with NULL in a grouping column fall into one group, even though \`NULL = NULL\` isn't true. Employees without a department appear as a single row with \`dept_id\` NULL. Label it with \`COALESCE(dept_id::text, 'unassigned')\` in reports, or exclude it with \`WHERE dept_id IS NOT NULL\`.

## Counting with joins

Grouping after a join is common and has a trap. Counting orders per customer:

~~~sql
SELECT c.id, c.name, COUNT(o.id) AS orders
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id, c.name;
~~~

\`COUNT(o.id)\` gives 0 for customers without orders, since the left join produces one row with NULL \`o.id\`. \`COUNT(*)\` would wrongly give 1. Joining two one-to-many tables before grouping multiplies rows: joining customers to both orders and support tickets produces orders × tickets rows per customer, inflating both counts. Aggregate each child table in a subquery first, then join the results.

## ROLLUP, CUBE and GROUPING SETS

Reports often need subtotals and grand totals alongside detail rows. \`ROLLUP\` adds them in one query:

~~~sql
SELECT dept_id, job_title, SUM(salary)
FROM employees
GROUP BY ROLLUP (dept_id, job_title);
~~~

This returns totals per department and job title, subtotals per department, and a grand total, with NULL marking the rolled-up columns. \`CUBE\` produces subtotals for every combination of columns, and \`GROUPING SETS\` lets you list exactly which groupings you want. The \`GROUPING()\` function distinguishes rollup NULLs from real NULL values. PostgreSQL, SQL Server and Oracle support all three; MySQL supports \`WITH ROLLUP\`.

## How the database groups

Databases group with either sorting, which orders rows by the grouping columns and scans for boundaries, or hashing, which builds a hash table keyed by group values. Hashing is usually faster for unsorted data with few groups; sorting helps when an index already provides the order or when the result must be sorted anyway. \`EXPLAIN\` shows "HashAggregate" or "GroupAggregate" in PostgreSQL.

## How interviewers test this

Expect "count employees per department", "total sales per month" and "departments with more than five employees". State the single-value rule clearly, use \`COUNT(column)\` with left joins to get zeros, avoid multiplying rows when joining several child tables, and mention \`ROLLUP\` for subtotals.`,
    sources: [PG_QUERIES, PG_FUNCS, MODERN_SQL]
  },

  "having-and-query-order": {
    theory: `\`HAVING\` filters groups after aggregation, the way \`WHERE\` filters rows before it. The distinction confuses many learners, but it follows directly from the order in which SQL evaluates a query. This lesson explains what \`HAVING\` does, how it differs from \`WHERE\`, when to use each for correctness and speed, and how the full logical query order determines what every clause can see.

## Filtering groups

To find departments with more than five employees:

~~~sql
SELECT dept_id, COUNT(*) AS headcount
FROM employees
GROUP BY dept_id
HAVING COUNT(*) > 5;
~~~

\`HAVING\` runs after \`GROUP BY\`, so it sees each group and its aggregates. Groups where the condition is true stay; others are dropped.

## WHERE versus HAVING

| | WHERE | HAVING |
|---|---|---|
| Filters | Individual rows | Groups |
| Runs | Before grouping | After grouping |
| Can use aggregates | No | Yes |
| Can use non-grouped columns | Yes | No, only grouping columns and aggregates |
| Works without GROUP BY | Yes | Yes, treating the whole result as one group |

The rule: conditions about individual rows go in \`WHERE\`; conditions about aggregates go in \`HAVING\`.

## Using both

Most real queries use both, each for its own job:

~~~sql
SELECT dept_id, AVG(salary) AS avg_salary
FROM employees
WHERE hire_date >= '2020-01-01'        -- rows: recent hires only
GROUP BY dept_id
HAVING AVG(salary) > 70000             -- groups: high-paying departments
ORDER BY avg_salary DESC;
~~~

This means "among employees hired since 2020, find departments whose average salary exceeds 70,000". Moving the date condition into \`HAVING\` would fail, because \`hire_date\` isn't a grouping column. Moving the average condition into \`WHERE\` would fail, because aggregates don't exist before grouping.

## Filter early for speed

A condition on a grouping column can technically go in either clause:

~~~sql
-- works, but groups every department before discarding most
SELECT dept_id, COUNT(*) FROM employees GROUP BY dept_id HAVING dept_id = 10;

-- better: discards rows before grouping
SELECT dept_id, COUNT(*) FROM employees WHERE dept_id = 10 GROUP BY dept_id;
~~~

Both return the same result, and many optimizers move such conditions automatically. Writing them in \`WHERE\` is still better practice: it states intent, and it guarantees the database filters before doing the expensive grouping work, which can also use an index.

## Aliases in HAVING

Standard SQL doesn't allow select-list aliases in \`HAVING\`, because \`SELECT\` runs after \`HAVING\`:

~~~sql
SELECT dept_id, COUNT(*) AS headcount FROM employees
GROUP BY dept_id
HAVING headcount > 5;     -- works in MySQL and SQLite, fails in PostgreSQL
~~~

Repeat the aggregate, \`HAVING COUNT(*) > 5\`, for portability. Repeating it doesn't compute it twice; the database recognizes the same expression.

## HAVING without GROUP BY

Without \`GROUP BY\`, \`HAVING\` treats the whole filtered result as one group:

~~~sql
SELECT COUNT(*) FROM orders HAVING COUNT(*) > 1000;
~~~

This returns the count if it exceeds 1,000, or no row at all otherwise. It's rarely needed but legal.

## The full logical order

Every clause's abilities follow from the logical evaluation order:

| Step | Clause | Can see |
|---|---|---|
| 1 | \`FROM\` / \`JOIN\` | Tables |
| 2 | \`WHERE\` | Columns of individual rows |
| 3 | \`GROUP BY\` | Columns of individual rows |
| 4 | \`HAVING\` | Grouping columns and aggregates |
| 5 | \`SELECT\` | Grouping columns and aggregates (or row columns without grouping); creates aliases; window functions run here |
| 6 | \`DISTINCT\` | Output rows |
| 7 | \`ORDER BY\` | Output columns and aliases |
| 8 | \`LIMIT\` / \`OFFSET\` | Sorted output |

Reading down the table answers most "why doesn't this work?" questions. Aliases are created at step 5, so only steps 6 to 8 can use them. Aggregates exist from step 3 onward, so \`WHERE\` at step 2 can't see them. Window functions are computed at step 5, so neither \`WHERE\` nor \`HAVING\` can filter on them.

## Filtering on window functions

Since window functions run after \`HAVING\`, filtering on their results needs a subquery or CTE:

~~~sql
WITH ranked AS (
    SELECT name, dept_id, salary,
           RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rnk
    FROM employees
)
SELECT * FROM ranked WHERE rnk <= 3;
~~~

Some databases, including Snowflake, BigQuery and DuckDB, add a \`QUALIFY\` clause for this, but PostgreSQL, MySQL and SQLite don't support it.

## Common HAVING patterns

\`HAVING\` appears in many interview questions:

- **Duplicates**: \`GROUP BY email HAVING COUNT(*) > 1\` finds repeated emails
- **Thresholds**: customers with total spending above a value, \`HAVING SUM(amount) > 10000\`
- **Completeness**: customers who bought every product, \`HAVING COUNT(DISTINCT product_id) = (SELECT COUNT(*) FROM products)\`
- **Conditional counts**: departments with at least two managers, \`HAVING SUM(CASE WHEN role = 'manager' THEN 1 ELSE 0 END) >= 2\`

## How interviewers test this

Expect "WHERE versus HAVING", "find duplicate emails" and "customers with more than three orders", plus "What's the order of execution?" Explain row versus group filtering, put row conditions in WHERE for correctness and speed, repeat aggregates in HAVING for portability, and derive each clause's limits from the logical order.`,
    sources: [PG_QUERIES, SQLITE_LANG, MODERN_SQL]
  }
};
