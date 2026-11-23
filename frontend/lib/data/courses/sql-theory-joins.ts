// Long-form theory for SQL joins and subqueries modules. Original writing.
import { LessonTheory } from './utils';
import { PG_QUERIES, PG_PERF, SQLITE_LANG, SQLITE_QP, UTL, MODERN_SQL } from './sql-theory-sources';

export const sqlJoinsTheory: Record<string, LessonTheory> = {
  "inner-join-lesson": {
    theory: `A join combines rows from two tables based on a related column. Normalized databases split data across tables, such as employees in one and departments in another, and joins put it back together for queries. The inner join, the most common kind, returns only rows that have a match in both tables. This lesson explains how inner joins work, the ON clause, joining several tables, how joins multiply rows, and the older comma syntax you'll still meet.

## Why joins exist

Storing each department's name once, in a departments table, and referencing it by ID from employees avoids repeating the name on every employee row. That's normalization. The cost is that answering "which department does each employee work in?" requires combining the tables at query time. Joins do that.

## The INNER JOIN syntax

~~~sql
SELECT e.name, d.name AS department
FROM employees e
INNER JOIN departments d ON e.dept_id = d.id;
~~~

\`ON\` states the matching condition. For each employee, the database finds department rows where \`d.id\` equals the employee's \`dept_id\`, and outputs one combined row per match. The keyword \`INNER\` is optional; \`JOIN\` alone means an inner join.

## What gets dropped

An inner join keeps only matched pairs. Two kinds of rows disappear:

- employees with a \`dept_id\` that's NULL, or that doesn't exist in departments
- departments with no employees

If the employees table has 100 rows and five employees have no department, the join returns 95 rows. This silent loss is the most important thing to understand about inner joins: when a report seems to be missing data, an inner join that should have been an outer join is a common cause.

## A mental model

Conceptually, a join forms every pairing of rows from the two tables, the Cartesian product, then keeps pairs satisfying the \`ON\` condition. For 100 employees and 10 departments, that's 1,000 pairs, of which about 100 match. The database doesn't actually build all pairs; it uses indexes and smarter algorithms, covered in the join performance lesson. But the model correctly predicts the result.

## Table aliases and ambiguous columns

When both tables have a column with the same name, such as \`name\` or \`id\`, you must say which one you mean. Table aliases keep this short:

~~~sql
SELECT e.id, e.name, d.name AS department
FROM employees e
JOIN departments d ON e.dept_id = d.id;
~~~

Selecting \`name\` without a prefix fails with an "ambiguous column" error. Prefixing every column in a join query, even unambiguous ones, makes queries easier to read and keeps them working if someone later adds a same-named column to the other table.

## USING and NATURAL JOIN

When the join columns have the same name in both tables, \`USING\` shortens the condition:

~~~sql
SELECT name, dept_name
FROM employees
JOIN departments USING (dept_id);
~~~

\`NATURAL JOIN\` goes further and joins on every column name the tables share. Avoid it: if someone adds a \`created_at\` or \`name\` column to both tables, the join condition silently changes and the query returns wrong results.

## Joining several tables

Joins chain. Each join adds a table, matched against tables already in the query:

~~~sql
SELECT e.name, d.name AS department, l.city
FROM employees e
JOIN departments d ON e.dept_id = d.id
JOIN locations l ON d.location_id = l.id;
~~~

With inner joins, the order you write them doesn't change the result; the optimizer chooses the actual order. Read multi-table joins as a path through the schema: employee to department to location.

## Joins multiply rows

Each row of the result is one matching pair. In a one-to-many relationship, the "one" side repeats. Joining departments to employees produces one row per employee, with the department's columns repeated on each. That's expected.

Problems arise when joining two one-to-many relationships from the same parent:

~~~sql
SELECT d.name, COUNT(e.id), COUNT(p.id)
FROM departments d
JOIN employees e ON e.dept_id = d.id
JOIN projects p ON p.dept_id = d.id
GROUP BY d.name;
~~~

A department with 10 employees and 3 projects produces 30 rows, so both counts report 30. This "fan-out" silently corrupts aggregates. Fix it by aggregating each child table in a subquery before joining, or by using \`COUNT(DISTINCT ...)\`, which fixes counts but not sums.

## Filtering in ON versus WHERE

For inner joins, a filter condition can go in \`ON\` or \`WHERE\` with the same result:

~~~sql
SELECT e.name FROM employees e
JOIN departments d ON e.dept_id = d.id AND d.name = 'Engineering';

SELECT e.name FROM employees e
JOIN departments d ON e.dept_id = d.id
WHERE d.name = 'Engineering';
~~~

The convention is to put the relationship in \`ON\` and filters in \`WHERE\`. For outer joins, the placement changes the result, as the next lesson explains.

## The old comma syntax

Before SQL-92, joins were written by listing tables with commas and putting the condition in \`WHERE\`:

~~~sql
SELECT e.name, d.name
FROM employees e, departments d
WHERE e.dept_id = d.id;
~~~

It produces the same result as an inner join, but forgetting the condition creates a full Cartesian product, possibly millions of rows, with no error. Explicit \`JOIN ... ON\` keeps the relationship next to the table and makes a missing condition obvious. Use explicit joins in new code.

## Joining on non-key columns

Joins don't have to use keys. You can join on any comparable columns, such as matching orders to promotions by date range, covered in the advanced joins lesson. But joins on keys, backed by foreign key constraints and indexes, are fastest and least likely to produce surprising duplicates.

## How interviewers test this

Expect queries joining two or three tables, and questions such as "What does an inner join return?" and "Why does my count look too high?" Explain that unmatched rows are dropped, use aliases, describe fan-out when joining multiple one-to-many tables, and prefer explicit JOIN syntax over commas.`,
    sources: [PG_QUERIES, SQLITE_LANG, MODERN_SQL]
  },

  "joins-lesson-2": {
    theory: `A left join returns every row from the left table, whether or not it has a match in the right table. Where there's no match, the right table's columns are filled with NULL. Left joins answer questions inner joins can't: which customers have never ordered, how many orders each customer has including zero, and which records are missing related data. This lesson explains how left joins work, the anti-join pattern, the ON versus WHERE trap, and counting with left joins.

## How LEFT JOIN works

~~~sql
SELECT c.name, o.id AS order_id, o.amount
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id;
~~~

For each customer:

- if they have matching orders, the result has one row per order, as with an inner join
- if they have none, the result still has one row for them, with \`order_id\` and \`amount\` set to NULL

The left table is the one written before \`LEFT JOIN\`. Every one of its rows appears at least once. \`LEFT OUTER JOIN\` is the same thing; \`OUTER\` is optional.

## Inner versus left

| Customer | Orders | Inner join rows | Left join rows |
|---|---|---|---|
| Asha | 3 | 3 | 3 |
| Rahul | 0 | 0 | 1 (with NULL order columns) |
| Meera | 1 | 1 | 1 |

The left join's result always has at least as many rows as the left table.

## Finding rows with no match

The **anti-join** pattern finds left rows that have no match:

~~~sql
SELECT c.id, c.name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;
~~~

The left join keeps every customer, and \`WHERE o.id IS NULL\` keeps only those whose order columns are NULL: customers who've never ordered. Test a column that can't be NULL in a real match, such as the right table's primary key. Testing a nullable column, such as \`o.discount_code\`, would also return customers whose orders happen to have no discount code.

\`NOT EXISTS\` expresses the same thing, often more clearly:

~~~sql
SELECT c.id, c.name FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);
~~~

Modern optimizers usually produce the same plan for both.

## The ON versus WHERE trap

For outer joins, where you put a condition changes the result. Suppose you want all customers, with their 2024 orders if any:

~~~sql
-- Wrong: turns the left join into an inner join
SELECT c.name, o.id
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.order_date >= '2024-01-01';
~~~

The left join produces customers with NULL order columns, and then \`WHERE\` drops them, because \`NULL >= '2024-01-01'\` is unknown. Customers without 2024 orders vanish. Put conditions on the right table in \`ON\`:

~~~sql
-- Right: filters which orders match, keeps every customer
SELECT c.name, o.id
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id AND o.order_date >= '2024-01-01';
~~~

The rule:

- conditions on the **right** table that decide which rows match go in \`ON\`
- conditions on the **left** table that decide which rows appear go in \`WHERE\`

A condition on the left table placed in \`ON\` doesn't filter the left table at all: every left row still appears, and the condition only affects which ones get matches.

## Counting with left joins

To count orders per customer, including zeros:

~~~sql
SELECT c.name, COUNT(o.id) AS order_count
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id, c.name;
~~~

\`COUNT(o.id)\` counts only non-NULL values, so customers without orders get 0. \`COUNT(*)\` counts rows, and each unmatched customer has one row, so it would wrongly report 1. Likewise, \`SUM(o.amount)\` returns NULL for customers without orders; wrap it as \`COALESCE(SUM(o.amount), 0)\`.

## Chaining left joins

When chaining joins, an inner join after a left join can undo it:

~~~sql
SELECT c.name, o.id, p.name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
JOIN products p ON p.id = o.product_id;    -- drops customers without orders
~~~

Customers without orders have NULL \`o.product_id\`, which matches no product, so the inner join drops them. Once a table is left-joined, later joins to it usually need to be left joins too.

## Left join as a lookup

Left joins also attach optional information without losing rows: adding a department name where some employees have none, or a latest-login date where some users have never logged in. Use an inner join only when a missing match should exclude the row.

## Duplicates from left joins

Like inner joins, left joins return one row per match. If a customer has five orders, they appear five times. To attach a single value per customer, such as their most recent order, aggregate or rank the right table first, then join the result.

## How interviewers test this

Expect "customers who never placed an order", "departments with no employees", "count of orders per customer including zero" and "LEFT JOIN versus INNER JOIN". Use the anti-join with a non-nullable column or \`NOT EXISTS\`, put right-table filters in ON, and use \`COUNT(right.id)\` rather than \`COUNT(*)\`.`,
    sources: [PG_QUERIES, SQLITE_LANG, MODERN_SQL]
  },

  "joins-lesson-3": {
    theory: `A right join is the mirror image of a left join: it keeps every row from the right table and fills the left table's columns with NULL where there's no match. Anything a right join does can be written as a left join with the tables swapped, which is why many teams avoid right joins entirely. This lesson explains how right joins work, how to convert them to left joins, when they appear in practice, and how they behave in multi-table queries.

## How RIGHT JOIN works

~~~sql
SELECT e.name, d.name AS department
FROM employees e
RIGHT JOIN departments d ON e.dept_id = d.id;
~~~

Every department appears in the result. Departments with employees produce one row per employee. Departments with no employees produce a single row with \`e.name\` set to NULL. Employees without a valid department are dropped, since they're on the left side.

## The equivalent left join

Swapping the table order turns any right join into a left join:

~~~sql
SELECT e.name, d.name AS department
FROM departments d
LEFT JOIN employees e ON e.dept_id = d.id;
~~~

Both queries return the same rows. The only possible difference is column order in \`SELECT *\` results, which you avoid by listing columns explicitly.

## Why most people prefer LEFT JOIN

Teams often adopt a convention of using only left joins:

- **Reading order**: queries are read top to bottom, so it's natural for the table whose rows are all kept to come first, in \`FROM\`
- **Mixing directions is confusing**: a query with both left and right joins forces readers to track which table is preserved at every step
- **Consistency**: one form is easier to review and maintain than two

The SQL standard includes right joins for symmetry, and they're fully supported in PostgreSQL, MySQL, SQL Server and Oracle. SQLite added \`RIGHT JOIN\` and \`FULL JOIN\` only in version 3.39, released in 2022, so older SQLite versions reject them.

## Finding unmatched rows

The anti-join works with right joins too. Departments with no employees:

~~~sql
SELECT d.name
FROM employees e
RIGHT JOIN departments d ON e.dept_id = d.id
WHERE e.id IS NULL;
~~~

The equivalent left join, \`FROM departments d LEFT JOIN employees e ... WHERE e.id IS NULL\`, reads more naturally. \`NOT EXISTS\` is clearer still.

## ON versus WHERE, mirrored

The placement rule mirrors the left join rule:

- conditions on the **left** table, the optional side, go in \`ON\` to control matching
- conditions on the **right** table, the preserved side, go in \`WHERE\` to control which rows appear

Putting a left-table condition in \`WHERE\`, such as \`WHERE e.salary > 50000\`, removes departments without employees, since their \`e.salary\` is NULL. The right join silently becomes an inner join.

## Right joins in multi-table queries

Right joins occasionally appear when a query has been built by adding tables to an existing chain, and the author wants to preserve all rows of a newly added table:

~~~sql
SELECT e.name, d.name AS department, p.title
FROM employees e
JOIN departments d ON e.dept_id = d.id
RIGHT JOIN projects p ON p.dept_id = d.id;
~~~

This keeps every project, even those whose department has no employees. Reasoning about it requires knowing that joins are evaluated left to right: the result of the employees-departments inner join is the left side, and projects is preserved. Rewriting with projects first, followed by left joins, is clearer:

~~~sql
SELECT e.name, d.name AS department, p.title
FROM projects p
LEFT JOIN departments d ON p.dept_id = d.id
LEFT JOIN employees e ON e.dept_id = d.id;
~~~

Notice the rewrite isn't mechanical: the original inner join between employees and departments had to become a left join, or projects whose department has no employees would be dropped again. When converting multi-table right joins, check what each join preserves.

## Generated SQL

Right joins also show up in SQL generated by reporting tools and object-relational mappers (ORMs), and in queries written by people used to them. You should be able to read them fluently even if you write left joins yourself.

## Visualizing outer joins

Venn diagrams are often used to explain joins: an inner join is the overlap, a left join is the whole left circle, and a right join is the whole right circle. The picture helps with which rows are kept, but it's imperfect: joins match rows by a condition and can produce multiple rows per match, which Venn diagrams don't show. Think in terms of "every row from this side appears at least once".

## Joins compared

| Join | Keeps unmatched rows from |
|---|---|
| INNER | Neither table |
| LEFT | The left table |
| RIGHT | The right table |
| FULL | Both tables |
| CROSS | Not applicable: every pair, no condition |

## How interviewers test this

Expect "What's a right join, and how does it differ from a left join?" and "Rewrite this right join as a left join." Explain that every right join can become a left join by swapping table order, why teams prefer left joins for readability, and how the ON versus WHERE rule mirrors. Mention SQLite's late support for right joins as a portability note.`,
    sources: [PG_QUERIES, SQLITE_LANG, MODERN_SQL]
  },

  "joins-lesson-4": {
    theory: `A full outer join keeps every row from both tables. Matched rows are combined, unmatched rows from either side appear with NULLs for the other side's columns. It's the tool for reconciling two datasets: comparing two systems' records, finding what exists in one list but not the other, and merging sources that each have gaps. This lesson explains full joins, the reconciliation pattern, NULL handling with \`COALESCE\`, emulating full joins in MySQL, and cross joins.

## How FULL JOIN works

~~~sql
SELECT e.name, d.name AS department
FROM employees e
FULL JOIN departments d ON e.dept_id = d.id;
~~~

The result contains three kinds of rows:

- employees matched with their department
- employees with no valid department, with department columns NULL
- departments with no employees, with employee columns NULL

\`FULL OUTER JOIN\` is the same; \`OUTER\` is optional. In terms of row counts, a full join returns the inner join's rows plus the left join's extra rows plus the right join's extra rows.

## Reconciling two datasets

Full joins are best known for comparing two sources that should match. Suppose an e-commerce system and a payment gateway each record transactions:

~~~sql
SELECT COALESCE(s.txn_id, g.txn_id) AS txn_id,
       s.amount AS store_amount,
       g.amount AS gateway_amount,
       CASE
           WHEN s.txn_id IS NULL THEN 'missing in store'
           WHEN g.txn_id IS NULL THEN 'missing at gateway'
           WHEN s.amount <> g.amount THEN 'amount mismatch'
           ELSE 'ok'
       END AS status
FROM store_txns s
FULL JOIN gateway_txns g ON s.txn_id = g.txn_id;
~~~

One query classifies every transaction: present in both and matching, present in both with different amounts, or present in only one system. Finance teams run reconciliations like this daily.

## Merging keys with COALESCE

In a full join, the join key can be NULL on either side, depending on which table the row came from. \`COALESCE(s.txn_id, g.txn_id)\` picks whichever is present, giving one reliable key column. Without it, sorting or grouping by \`s.txn_id\` would lump all gateway-only rows into one NULL group.

The same idea merges other columns from two sources: \`COALESCE(new.email, old.email)\` prefers the newer value and falls back to the older one.

## Finding differences only

To list only mismatched keys, filter out matched rows:

~~~sql
SELECT COALESCE(a.id, b.id) AS id
FROM list_a a
FULL JOIN list_b b ON a.id = b.id
WHERE a.id IS NULL OR b.id IS NULL;
~~~

This returns the **symmetric difference**: keys in exactly one of the two tables. For comparing whole rows, rather than keys, set operations such as \`EXCEPT\` are an alternative.

## Filtering full joins

Filters in \`WHERE\` apply after the join and can remove the unmatched rows you wanted to keep. \`WHERE s.amount > 100\` drops every gateway-only row, since its \`s.amount\` is NULL. Filter each source in a subquery before joining, or include \`IS NULL\` alternatives in the condition, so the filter applies only where it makes sense.

## Emulating FULL JOIN in MySQL

MySQL doesn't support \`FULL JOIN\`. Combine a left join with the unmatched rows of a right join:

~~~sql
SELECT e.name, d.name AS department
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.id
UNION ALL
SELECT e.name, d.name
FROM employees e
RIGHT JOIN departments d ON e.dept_id = d.id
WHERE e.id IS NULL;
~~~

The first query returns all employees, matched or not. The second adds only departments without employees. Using \`UNION ALL\` with the \`IS NULL\` filter avoids duplicating matched rows. Plain \`UNION\` with an unfiltered right join also works, but it removes duplicates by comparing every row, which is slower and wrongly merges rows that are genuinely identical.

## Performance

Full joins are generally more expensive than inner or left joins. PostgreSQL implements them with merge or hash joins only, and they offer the optimizer fewer opportunities for reordering. They're common in reporting and data pipelines, and rare in latency-sensitive application queries.

## Cross joins

A \`CROSS JOIN\` returns every combination of rows from two tables, with no condition. Three sizes and four colours produce twelve rows:

~~~sql
SELECT s.size, c.colour
FROM sizes s
CROSS JOIN colours c;
~~~

Cross joins are useful for generating combinations: every product variant, every date paired with every store for a sales report that must show zeros, or a grid of time slots. They're dangerous by accident: two 10,000-row tables produce 100 million rows. An inner join with a missing condition, or the comma syntax without a \`WHERE\`, silently becomes a cross join.

## Filling gaps with cross joins

A common reporting pattern: show sales for every store on every day, with zero where nothing sold. Cross join stores with a list of dates to build the full grid, then left join the sales data:

~~~sql
SELECT s.id, d.day, COALESCE(SUM(x.amount), 0) AS sales
FROM stores s
CROSS JOIN calendar d
LEFT JOIN sales x ON x.store_id = s.id AND x.sale_date = d.day
GROUP BY s.id, d.day;
~~~

## Choosing the right join

| Question | Join |
|---|---|
| Only rows related in both tables | INNER |
| Everything from one table, related data if any | LEFT |
| Everything from both, showing gaps on either side | FULL |
| Every combination | CROSS |

## How interviewers test this

Expect "What does a FULL OUTER JOIN return?", "How do you find records in one table but not the other, in both directions?" and "How do you do a full join in MySQL?" Explain the three kinds of output rows, use COALESCE for keys, show the UNION ALL emulation, and know what a cross join does and how one happens by accident.`,
    sources: [PG_QUERIES, SQLITE_LANG, MODERN_SQL]
  },

  "joins-lesson-5": {
    theory: `A join that takes milliseconds on a development laptop can take minutes on production data. Join performance depends on indexes, on which algorithm the database chooses, and on how many rows flow between steps. This lesson explains the three join algorithms, how indexes affect them, how to read a query plan with \`EXPLAIN\`, why join order matters, and practical rules for writing joins that scale.

## The three join algorithms

Databases execute joins with one of three main algorithms:

| Algorithm | How it works | Best when |
|---|---|---|
| Nested loop | For each row of the outer table, look up matches in the inner table | The outer side is small and the inner join column is indexed |
| Hash join | Build a hash table on the smaller input's join key, then probe it with each row of the larger input | Large, unsorted inputs joined on equality |
| Merge join | Sort both inputs by the join key, then walk them together | Inputs already sorted, often from indexes, or the largest inputs |

The optimizer chooses based on table sizes, available indexes and statistics. MySQL historically used only nested loops and added hash joins in version 8.0.18. SQLite uses nested loops, relying heavily on indexes.

## Nested loops and indexes

A nested loop without an index is the worst case: for each of n outer rows, scan all m inner rows, costing O(n · m). Joining 10,000 orders to 100,000 customers this way means a billion comparisons. With an index on the inner table's join column, each lookup is a quick index search, and the cost drops to about O(n log m). This is why indexing join columns matters so much.

## Index foreign keys

Primary keys are indexed automatically, so joining to a table on its primary key is fast. Foreign key columns are **not** indexed automatically in PostgreSQL or SQL Server, though MySQL's InnoDB does create them. A join from departments to employees on \`employees.dept_id\` scans the whole employees table for each department unless \`dept_id\` is indexed:

~~~sql
CREATE INDEX idx_employees_dept_id ON employees (dept_id);
~~~

Indexing foreign keys also speeds up deletes on the parent table, which must check for referencing rows.

## Hash joins

A hash join reads the smaller input once to build a hash table keyed on the join column, then streams the larger input, probing the hash table for each row. Its cost is about O(n + m), so it handles large tables without indexes well. It works only for equality conditions, and if the hash table doesn't fit in memory, it spills to disk in batches, which is slower. PostgreSQL's \`work_mem\` setting controls how much memory each hash or sort operation may use.

## Reading EXPLAIN

\`EXPLAIN\` shows the plan the optimizer chose; \`EXPLAIN ANALYZE\` in PostgreSQL runs the query and reports actual times and row counts:

~~~sql
EXPLAIN ANALYZE
SELECT e.name, d.name
FROM employees e
JOIN departments d ON e.dept_id = d.id
WHERE d.name = 'Engineering';
~~~

Things to look for:

- **Seq Scan** on a large table where you expected an index scan suggests a missing index or a non-sargable condition
- **Estimated versus actual rows**: large differences mean stale statistics, which lead to bad plans; run \`ANALYZE\` to refresh them
- **The join algorithm** chosen at each step, and which input is the outer or build side
- **Where time is spent**: the most expensive node is where to focus

\`EXPLAIN\` without \`ANALYZE\` doesn't run the query, so it's safe for slow or data-changing statements. In MySQL, \`EXPLAIN\` shows a table per joined table, with the \`type\` column revealing full scans (\`ALL\`) versus index lookups (\`ref\`, \`eq_ref\`). SQLite offers \`EXPLAIN QUERY PLAN\`.

## Join order

For inner joins, the result doesn't depend on the order you write tables, but the cost does. Joining a large table to a small one first can produce a huge intermediate result. The optimizer considers many orders and picks the cheapest it estimates. With many tables, the number of possible orders grows factorially, so optimizers switch to heuristics: PostgreSQL uses a genetic algorithm beyond 12 tables by default. Good statistics and selective filters help it choose well.

## Filter early, join less

Every row that survives a filter has to be joined, so reducing rows early is the most effective optimization:

- apply selective \`WHERE\` conditions that can use indexes on each table
- aggregate a large child table before joining it, rather than joining first and grouping millions of combined rows
- select only needed columns, so the database moves less data and can sometimes answer from an index alone

The optimizer pushes filters down automatically in many cases, but writing the query to make selectivity obvious helps, especially across subqueries and views.

## Common performance problems

| Symptom | Likely cause | Fix |
|---|---|---|
| Join slows down as data grows | Missing index on a join column | Index foreign keys |
| Results larger than expected | Fan-out from joining multiple one-to-many tables | Aggregate children before joining |
| Index ignored | Function or type conversion on the join column | Compare matching types; avoid functions on join keys |
| Query was fast, now slow | Stale statistics changed the plan | Run \`ANALYZE\`; check estimates |
| Huge intermediate results | Missing join condition, or wrong join order | Check every join has a proper condition |

## Type mismatches

Joining columns of different types, such as an integer \`customer_id\` with a text \`customer_id\` from an import, forces a conversion on every row and usually prevents index use. Keep join columns the same type in both tables, and fix mismatches in the schema rather than casting in every query.

## Denormalization as a last resort

When a join is still too slow for a critical, high-traffic query, teams sometimes **denormalize**: copy a frequently needed column, such as a department name, into the employees table, or maintain a precomputed summary table or materialized view. This trades write complexity and storage for read speed, and requires keeping the copies in sync. Try indexes and query fixes first.

## How interviewers test this

Expect "How would you speed up a slow join?" and "What join algorithms do databases use?" Describe nested loop, hash and merge joins with when each fits, stress indexing foreign keys, explain how to read EXPLAIN and compare estimated with actual rows, and mention filtering and aggregating before joining.`,
    sources: [PG_PERF, UTL, SQLITE_QP]
  },

  "joins-lesson-6": {
    theory: `Most joins match rows on equal keys, but joins can use any condition. Self-joins compare rows within one table, non-equi joins match on ranges and inequalities, and lateral joins let each row run its own subquery. These techniques solve problems such as finding employees who earn more than their managers, assigning grades from score ranges, and fetching the latest order per customer. This lesson explains each technique with its typical uses and performance considerations.

## Self-joins

A self-join joins a table to itself, using two aliases so each copy can be referenced separately. The classic example pairs employees with their managers, where \`manager_id\` references \`employees.id\`:

~~~sql
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;
~~~

The left join keeps employees without a manager, such as the CEO. Comparing columns across the two copies answers relational questions:

~~~sql
-- employees who earn more than their manager
SELECT e.name, e.salary, m.name AS manager, m.salary AS manager_salary
FROM employees e
JOIN employees m ON e.manager_id = m.id
WHERE e.salary > m.salary;
~~~

Self-joins reach one level of a hierarchy per join. For arbitrary depth, such as everyone under a given executive, use a recursive CTE.

## Pairs within a table

Self-joins also generate pairs, such as employees in the same department:

~~~sql
SELECT a.name, b.name, a.dept_id
FROM employees a
JOIN employees b ON a.dept_id = b.dept_id AND a.id < b.id;
~~~

The condition \`a.id < b.id\` serves two purposes: it excludes pairing an employee with themselves, and it lists each pair once instead of twice, as (Asha, Rahul) and (Rahul, Asha). Using \`<>\` instead of \`<\` would keep both orders.

## Non-equi joins

A non-equi join uses a condition other than equality, such as a range. Assigning grade bands from a lookup table:

~~~sql
SELECT s.name, s.score, g.grade
FROM students s
JOIN grade_bands g ON s.score BETWEEN g.min_score AND g.max_score;
~~~

Keeping bands in a table means they can change without editing queries. The bands must not overlap or leave gaps, or students will match twice or not at all.

Other range-based joins:

- matching orders to the promotion active on the order date: \`ON o.order_date >= p.start_date AND o.order_date < p.end_date\`
- matching events to the shift during which they happened
- assigning prices that changed over time, using the price valid at each transaction's timestamp

## Inequality joins and running comparisons

Joins on \`<\` or \`>\` can compute comparisons against all earlier rows:

~~~sql
-- for each day, the total of all earlier days (a running total, the old way)
SELECT a.day, SUM(b.amount) AS running_total
FROM daily_sales a
JOIN daily_sales b ON b.day <= a.day
GROUP BY a.day;
~~~

This works, but each row joins to every earlier row, so the cost grows quadratically: 10,000 days produce about 50 million pairs. Window functions, \`SUM(amount) OVER (ORDER BY day)\`, compute the same result in one pass and are the modern solution. Recognizing when a self-join on an inequality should be a window function is a valuable skill.

## Performance of non-equi joins

Hash joins need equality, so range conditions usually run as nested loops. An index on the range column helps the inner lookup. PostgreSQL supports range types and GiST indexes, which can make overlap queries such as \`ON o.period && p.period\` efficient. For large datasets, check the plan, because a non-equi join without a useful index can be extremely slow.

## Lateral joins

A lateral join lets a subquery in the \`FROM\` clause reference columns from tables earlier in the same \`FROM\`. In effect, it runs the subquery once per outer row. The standard use is "top N per row":

~~~sql
-- PostgreSQL: each customer's three most recent orders
SELECT c.name, recent.id, recent.order_date
FROM customers c
CROSS JOIN LATERAL (
    SELECT o.id, o.order_date
    FROM orders o
    WHERE o.customer_id = c.id
    ORDER BY o.order_date DESC
    LIMIT 3
) AS recent;
~~~

Use \`LEFT JOIN LATERAL (...) ON TRUE\` to keep customers with no orders. With an index on \`orders (customer_id, order_date)\`, each lateral subquery is a fast index lookup. PostgreSQL and MySQL 8.0.14+ support \`LATERAL\`; SQL Server and Oracle offer the equivalent \`CROSS APPLY\` and \`OUTER APPLY\`. Window functions solve the same problem portably, as the placement module shows.

## Semi-joins

A **semi-join** returns left rows that have at least one match, without duplicating them per match. SQL expresses it with \`EXISTS\` or \`IN\`, not with \`JOIN\`:

~~~sql
SELECT d.name FROM departments d
WHERE EXISTS (SELECT 1 FROM employees e WHERE e.dept_id = d.id);
~~~

A regular join would return one row per employee and need \`DISTINCT\`. The **anti-join**, \`NOT EXISTS\`, returns rows with no match. Databases recognize both patterns and execute them efficiently, stopping at the first match.

## Joining to aggregated results

Joining a table to an aggregate of itself compares each row with a group statistic:

~~~sql
-- employees earning above their department's average
SELECT e.name, e.salary, a.avg_salary
FROM employees e
JOIN (SELECT dept_id, AVG(salary) AS avg_salary
      FROM employees GROUP BY dept_id) a
  ON e.dept_id = a.dept_id
WHERE e.salary > a.avg_salary;
~~~

A window function, \`AVG(salary) OVER (PARTITION BY dept_id)\`, gives the same result without the join.

## How interviewers test this

Expect "employees who earn more than their manager", "pairs of employees in the same department", "assign grades from a ranges table" and "latest order per customer". Use aliases for self-joins, \`a.id < b.id\` to avoid duplicate pairs, BETWEEN for range joins, and mention LATERAL or window functions for top-N per row. Point out when an inequality self-join should become a window function.`,
    sources: [PG_QUERIES, UTL, MODERN_SQL]
  },

  "scalar-and-in-subqueries": {
    theory: `A subquery is a query nested inside another query. It lets you use the result of one question as part of another: employees earning above the company average, or customers in cities where a store exists. This lesson explains scalar subqueries, which return one value, and \`IN\` subqueries, which return a list, along with the errors and NULL traps each can cause and how they compare with joins.

## What a subquery is

A subquery is a complete \`SELECT\` statement in parentheses, used where a value, a list or a table is expected. The outer query is called the **outer** or **main** query. Subqueries can appear in \`WHERE\`, \`HAVING\`, \`SELECT\` and \`FROM\`. This lesson covers the first two; derived tables in \`FROM\` come later in the module.

## Scalar subqueries

A **scalar subquery** returns exactly one row with one column, so it can be used anywhere a single value can:

~~~sql
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
~~~

The database computes the average once, then compares each employee's salary against it. You can't write \`WHERE salary > AVG(salary)\` directly, because aggregates aren't allowed in \`WHERE\`, so the subquery is the natural solution.

Scalar subqueries also work in the select list:

~~~sql
SELECT name, salary,
       salary - (SELECT AVG(salary) FROM employees) AS diff_from_avg
FROM employees;
~~~

## When a scalar subquery returns the wrong number of rows

If a scalar subquery returns more than one row, the query fails with an error such as "more than one row returned by a subquery used as an expression". This happens when the subquery's filter isn't as unique as assumed:

~~~sql
SELECT name FROM employees
WHERE dept_id = (SELECT id FROM departments WHERE location = 'Bengaluru');
~~~

If two departments are in Bengaluru, this fails. Use \`IN\` when more than one row is possible. If a scalar subquery returns **no** rows, its value is NULL, and comparisons against it are unknown, so the outer query returns nothing, silently.

## IN subqueries

An \`IN\` subquery returns a single column of any number of rows, and the outer condition checks membership:

~~~sql
SELECT name FROM employees
WHERE dept_id IN (SELECT id FROM departments WHERE location = 'Bengaluru');
~~~

This returns employees in any Bengaluru department, whether there are zero, one or many. The subquery must return exactly one column; returning \`SELECT *\` from a multi-column table fails.

Some databases support row-value \`IN\`, comparing several columns at once: \`WHERE (dept_id, job_title) IN (SELECT dept_id, job_title FROM openings)\`. PostgreSQL, MySQL and SQLite support this.

## NOT IN and NULL

\`NOT IN\` with a subquery is dangerous when the subquery can return NULL:

~~~sql
SELECT name FROM employees
WHERE id NOT IN (SELECT manager_id FROM employees);   -- returns no rows
~~~

The intent is "employees who aren't anyone's manager". But the CEO's \`manager_id\` is NULL, so the subquery's result contains NULL. \`x NOT IN (..., NULL)\` is never true, because \`x <> NULL\` is unknown, so the query returns nothing at all. Fix it by excluding NULLs or switching to \`NOT EXISTS\`:

~~~sql
WHERE id NOT IN (SELECT manager_id FROM employees WHERE manager_id IS NOT NULL);
-- or
WHERE NOT EXISTS (SELECT 1 FROM employees m WHERE m.manager_id = e.id);
~~~

This trap is one of the most frequently asked SQL interview questions, because the bug produces no error, only a silently empty result.

## ANY and ALL

\`ANY\` and \`ALL\` compare a value against every row of a subquery:

~~~sql
-- earns more than everyone in department 20
SELECT name FROM employees
WHERE salary > ALL (SELECT salary FROM employees WHERE dept_id = 20);

-- earns more than at least one person in department 20
SELECT name FROM employees
WHERE salary > ANY (SELECT salary FROM employees WHERE dept_id = 20);
~~~

\`= ANY\` is equivalent to \`IN\`. \`> ALL\` equals \`> (SELECT MAX(...))\`, and the \`MAX\` version is usually clearer. Watch NULLs again: if the subquery contains a NULL, \`> ALL\` can never be true. And if the subquery returns no rows, \`> ALL\` is true for every row, since there's nothing to fail against. SQLite doesn't support \`ANY\` or \`ALL\`.

## Subqueries in HAVING

Subqueries can compare group aggregates against other values:

~~~sql
SELECT dept_id, AVG(salary) AS avg_salary
FROM employees
GROUP BY dept_id
HAVING AVG(salary) > (SELECT AVG(salary) FROM employees);
~~~

This finds departments whose average salary exceeds the company-wide average.

## Subqueries versus joins

Many \`IN\` subqueries can be written as joins:

~~~sql
SELECT DISTINCT e.name
FROM employees e
JOIN departments d ON e.dept_id = d.id
WHERE d.location = 'Bengaluru';
~~~

The join version needs \`DISTINCT\` if the join could produce duplicates, while \`IN\` never duplicates outer rows, since it only tests membership. Modern optimizers often transform \`IN\` subqueries into semi-joins internally, so performance is usually similar. Choose the form that states the question most clearly: use a subquery when you're filtering by membership, and a join when you need columns from both tables.

## Nesting

Subqueries can nest inside subqueries, but more than two levels quickly becomes hard to read. Common table expressions, covered in the advanced module, name each step and make deep logic readable.

## How interviewers test this

Expect "employees earning more than the average", "employees in departments located in a city", "the second highest salary" and the NOT IN with NULL trap. Know that scalar subqueries must return one row, use IN for lists, explain why NOT IN fails with NULLs and fix it with NOT EXISTS, and compare subqueries with joins.`,
    sources: [PG_QUERIES, SQLITE_LANG, MODERN_SQL]
  },

  "correlated-subqueries": {
    theory: `A correlated subquery refers to columns of the outer query, so its result depends on the current outer row. Conceptually, it runs once per outer row, answering row-specific questions such as "does this employee earn more than their own department's average?" This lesson explains how correlated subqueries differ from regular ones, their logical evaluation, common uses, their performance characteristics, and how to rewrite them with joins or window functions.

## Correlated versus uncorrelated

An **uncorrelated** subquery stands alone: \`(SELECT AVG(salary) FROM employees)\` computes one value, independent of the outer query, and the database can evaluate it once.

A **correlated** subquery references the outer query:

~~~sql
SELECT e.name, e.dept_id, e.salary
FROM employees e
WHERE e.salary > (
    SELECT AVG(e2.salary)
    FROM employees e2
    WHERE e2.dept_id = e.dept_id      -- refers to the outer row
);
~~~

The inner query's \`e.dept_id\` comes from the outer row currently being tested. For an engineer, it computes the engineering average; for a salesperson, the sales average. Each employee is compared with their own department.

## Aliases are essential

When the inner and outer queries use the same table, aliases distinguish them. Without them, \`WHERE dept_id = dept_id\` inside the subquery refers to the inner table on both sides, which is always true for non-NULL values, and the query silently computes the company-wide average instead. SQL resolves an unqualified column name to the nearest enclosing query that has it, so always qualify columns in correlated subqueries.

## Logical evaluation

Conceptually, the database:

1. takes an outer row
2. substitutes its values into the subquery
3. runs the subquery
4. uses the result to evaluate the outer condition
5. moves to the next outer row

This model is correct for understanding results. Physically, optimizers often do better: they may cache results for repeated values (all employees in department 10 need the same average), or transform the whole query into a join.

## Common uses

Correlated subqueries answer per-row comparisons naturally:

- **Above group average**: employees earning more than their department's average
- **Latest record per group**: each customer's most recent order, \`WHERE o.order_date = (SELECT MAX(o2.order_date) FROM orders o2 WHERE o2.customer_id = o.customer_id)\`
- **Existence checks**: customers who have placed an order, with \`EXISTS\`
- **Counts per row**: in the select list, \`(SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id) AS order_count\`
- **Ranking without window functions**: the number of employees earning more than this one, used for finding the Nth highest salary in older databases

## In the select list

A correlated subquery in \`SELECT\` adds a computed value per row:

~~~sql
SELECT c.name,
       (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id) AS order_count,
       (SELECT MAX(o.order_date) FROM orders o WHERE o.customer_id = c.id) AS last_order
FROM customers c;
~~~

It must return a single value per outer row. It returns NULL when no rows match, except \`COUNT\`, which returns 0. Each such subquery may scan the orders table again, so several of them can add up. A single join with \`GROUP BY\` often computes all the values in one pass.

## Performance

A naive execution runs the subquery once per outer row: 100,000 employees means 100,000 executions. Whether that's a problem depends on:

- **Indexes**: with an index on \`employees (dept_id)\`, each execution is a fast lookup. Without one, each is a full scan, and the total cost becomes O(n²)
- **Optimizer rewrites**: PostgreSQL, SQL Server and Oracle often transform correlated subqueries, especially \`EXISTS\` and \`IN\`, into joins. MySQL improved substantially in version 8, though older versions were known for slow correlated subqueries
- **Repetition**: subqueries that depend only on a column with few distinct values benefit from caching

Use \`EXPLAIN\` to see what the database actually does.

## Rewriting with a join

The department average example can be rewritten as a join to a derived table, computing each department's average once:

~~~sql
SELECT e.name, e.dept_id, e.salary
FROM employees e
JOIN (
    SELECT dept_id, AVG(salary) AS avg_salary
    FROM employees
    GROUP BY dept_id
) d ON d.dept_id = e.dept_id
WHERE e.salary > d.avg_salary;
~~~

This computes one average per department, then joins, which is predictable and efficient.

## Rewriting with window functions

Window functions compute group statistics alongside each row without a join:

~~~sql
SELECT name, dept_id, salary
FROM (
    SELECT name, dept_id, salary,
           AVG(salary) OVER (PARTITION BY dept_id) AS dept_avg
    FROM employees
) t
WHERE salary > dept_avg;
~~~

This reads the table once. For "latest record per group", \`ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC)\` is the modern approach, and it handles ties more explicitly than \`= MAX(...)\`, which returns every row tied for the latest date.

## Correlated subqueries in UPDATE and DELETE

Correlated subqueries also drive data changes:

~~~sql
UPDATE employees e
SET salary = salary * 1.05
WHERE salary < (SELECT AVG(salary) FROM employees e2 WHERE e2.dept_id = e.dept_id);
~~~

The SQL standard specifies that the subquery sees the table as it was before the update began, so raises don't affect the averages used for later rows. MySQL doesn't allow a subquery to select from the same table being updated; wrap the subquery in a derived table to work around it.

## Choosing an approach

| Approach | Strength |
|---|---|
| Correlated subquery | Reads naturally for per-row questions; excellent with \`EXISTS\` |
| Join to an aggregated derived table | Computes each group once; predictable performance |
| Window function | Single pass; best for rankings and group comparisons |

## How interviewers test this

Expect "employees earning above their department's average", "latest order per customer" and "What's a correlated subquery?" Explain the per-row evaluation model, qualify columns with aliases, discuss the performance risk without indexes, and offer join or window function rewrites.`,
    sources: [PG_QUERIES, SQLITE_QP, MODERN_SQL]
  },

  "exists-and-not-exists": {
    theory: `\`EXISTS\` tests whether a subquery returns at least one row. It answers yes-or-no questions about related data: does this customer have any orders, does this department have any employees? \`NOT EXISTS\` tests for the absence of rows, and it's the safest way to find unmatched records. This lesson explains how \`EXISTS\` evaluates, why it stops early, how it compares with \`IN\` and joins, why \`NOT EXISTS\` handles NULL correctly, and how to express "for all" questions.

## How EXISTS works

~~~sql
SELECT c.id, c.name
FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o WHERE o.customer_id = c.id
);
~~~

For each customer, the subquery looks for orders with that customer's ID. \`EXISTS\` is true if it finds at least one row, false if none. The result is every customer who has ordered, each listed once, however many orders they have.

\`EXISTS\` subqueries are almost always correlated, referencing the outer row. An uncorrelated \`EXISTS\` is either true for every outer row or false for every one, which is rarely useful.

## What goes in the select list

\`EXISTS\` only cares whether rows exist, not what they contain. \`SELECT 1\`, \`SELECT *\` and \`SELECT o.id\` behave identically; databases ignore the select list. \`SELECT 1\` is a common convention that signals "existence only" to readers.

## Stopping early

Because \`EXISTS\` needs only one row, the database stops searching as soon as it finds a match. For a customer with 5,000 orders, it reads one. This makes \`EXISTS\` efficient for existence questions, especially with an index on the correlated column, here \`orders (customer_id)\`.

Compare with counting: \`WHERE (SELECT COUNT(*) FROM orders o WHERE o.customer_id = c.id) > 0\` must count every order before comparing. Use \`EXISTS\` when you only need to know whether something exists.

## EXISTS versus a join

A join answers a similar question but produces one row per match:

~~~sql
SELECT DISTINCT c.id, c.name
FROM customers c
JOIN orders o ON o.customer_id = c.id;
~~~

The join needs \`DISTINCT\` to remove duplicates, which costs a sort or hash and hides the intent. \`EXISTS\` expresses the question directly, never duplicates outer rows, and is executed by the database as a **semi-join**. Use a join when you need columns from the related table; use \`EXISTS\` when you only need to filter.

## NOT EXISTS for unmatched rows

\`NOT EXISTS\` finds rows with no related rows:

~~~sql
SELECT c.id, c.name
FROM customers c
WHERE NOT EXISTS (
    SELECT 1 FROM orders o WHERE o.customer_id = c.id
);
~~~

This lists customers who have never ordered. The database executes it as an **anti-join**. The equivalent \`LEFT JOIN ... WHERE o.id IS NULL\` returns the same rows, and modern optimizers often produce identical plans; \`NOT EXISTS\` usually reads more clearly.

## Why NOT EXISTS beats NOT IN

\`NOT IN\` breaks when its subquery returns a NULL:

~~~sql
-- intended: employees who manage nobody; actual: returns no rows if any manager_id is NULL
SELECT name FROM employees
WHERE id NOT IN (SELECT manager_id FROM employees);
~~~

\`NOT EXISTS\` doesn't have this problem:

~~~sql
SELECT e.name FROM employees e
WHERE NOT EXISTS (
    SELECT 1 FROM employees r WHERE r.manager_id = e.id
);
~~~

\`EXISTS\` returns only true or false, never unknown. A NULL \`manager_id\` doesn't match \`= e.id\`, so it can't poison the result. This is why many style guides recommend \`NOT EXISTS\` over \`NOT IN\` for subqueries.

## EXISTS versus IN

\`IN\` with a subquery and \`EXISTS\` with a correlated subquery often express the same filter:

~~~sql
WHERE c.id IN (SELECT customer_id FROM orders)
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id)
~~~

Older advice claimed one was always faster. Modern optimizers in PostgreSQL, SQL Server, Oracle and MySQL 8 usually convert both to the same semi-join plan. The real differences:

| | IN | EXISTS |
|---|---|---|
| NULL in the subquery | Fine for \`IN\`, breaks \`NOT IN\` | Safe in both forms |
| Multi-column conditions | Needs row-value syntax | Any condition in \`WHERE\` |
| Readability | Natural for short value lists | Natural for "has related rows" |

## Complex conditions inside EXISTS

The subquery's \`WHERE\` can contain any condition, which makes \`EXISTS\` flexible:

~~~sql
-- customers with a high-value order in 2024
SELECT c.name FROM customers c
WHERE EXISTS (
    SELECT 1 FROM orders o
    WHERE o.customer_id = c.id
      AND o.amount > 10000
      AND o.order_date >= '2024-01-01'
);
~~~

Combining \`EXISTS\` and \`NOT EXISTS\` answers questions like "customers who bought a laptop but never bought a warranty".

## For-all questions with double negation

SQL has no "for all" operator, but double negation expresses it. "Students who have taken every required course" becomes "students for whom no required course exists that they haven't taken":

~~~sql
SELECT s.name FROM students s
WHERE NOT EXISTS (
    SELECT 1 FROM required_courses r
    WHERE NOT EXISTS (
        SELECT 1 FROM enrollments e
        WHERE e.student_id = s.id AND e.course_id = r.course_id
    )
);
~~~

This implements **relational division**. A more readable alternative counts: group enrollments in required courses by student and keep students whose count equals the number of required courses, using \`HAVING COUNT(DISTINCT course_id) = (SELECT COUNT(*) FROM required_courses)\`.

## How interviewers test this

Expect "customers with no orders", "departments that have at least one employee", "EXISTS versus IN" and "Why is NOT EXISTS safer than NOT IN?" Explain early stopping, semi-joins and anti-joins, the NULL behaviour difference, and show double negation or counting for "for all" questions.`,
    sources: [PG_QUERIES, SQLITE_QP, MODERN_SQL]
  },

  "subqueries-in-from-and-select": {
    theory: `A subquery in the \`FROM\` clause produces a temporary result table, called a derived table, that the outer query uses like any other table. Derived tables let you build a query in stages: aggregate first, then filter or join the aggregates; rank first, then pick the top rows. This lesson explains derived tables, the rules for using them, scalar subqueries in the select list, how derived tables compare with CTEs and views, and their performance.

## Derived tables

~~~sql
SELECT dept_id, avg_salary
FROM (
    SELECT dept_id, AVG(salary) AS avg_salary
    FROM employees
    GROUP BY dept_id
) AS dept_stats
WHERE avg_salary > 70000;
~~~

The inner query computes one row per department; the outer query filters those rows. This achieves the same result as \`HAVING AVG(salary) > 70000\`, but the pattern generalizes: once results are in a derived table, you can filter, join, sort and aggregate them again.

## Rules for derived tables

A few rules apply:

- **An alias is required** in PostgreSQL (before version 16), MySQL and SQL Server: \`FROM (SELECT ...) AS t\`. Forgetting it is a common syntax error
- **Computed columns need names**: \`AVG(salary)\` must be aliased, such as \`AS avg_salary\`, so the outer query can refer to it
- **Columns are only what the subquery selects**: the outer query can't reach columns of the underlying table that the derived table didn't include
- **Ordering inside doesn't carry out**: an \`ORDER BY\` inside a derived table doesn't guarantee the outer result's order; sort in the outer query

## Building queries in stages

Derived tables shine when a computation must finish before another begins. Aggregating an aggregate:

~~~sql
-- average number of employees per department
SELECT AVG(headcount) AS avg_headcount
FROM (
    SELECT dept_id, COUNT(*) AS headcount
    FROM employees
    GROUP BY dept_id
) AS counts;
~~~

You can't nest aggregates directly, as in \`AVG(COUNT(*))\`, so the derived table computes the inner aggregate first.

## Filtering on window functions

Window functions run after \`WHERE\`, so filtering on their results needs a derived table or CTE:

~~~sql
SELECT name, dept_id, salary
FROM (
    SELECT name, dept_id, salary,
           ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rn
    FROM employees
) AS ranked
WHERE rn = 1;
~~~

This returns the top earner in each department, one of the most common interview patterns.

## Avoiding fan-out

Joining a parent to two child tables multiplies rows and inflates aggregates. Pre-aggregating each child in a derived table fixes it:

~~~sql
SELECT d.name, COALESCE(e.headcount, 0) AS headcount, COALESCE(p.projects, 0) AS projects
FROM departments d
LEFT JOIN (SELECT dept_id, COUNT(*) AS headcount FROM employees GROUP BY dept_id) e
       ON e.dept_id = d.id
LEFT JOIN (SELECT dept_id, COUNT(*) AS projects FROM projects GROUP BY dept_id) p
       ON p.dept_id = d.id;
~~~

Each derived table has one row per department, so the joins can't multiply rows.

## Scalar subqueries in SELECT

A subquery in the select list must return one value per outer row:

~~~sql
SELECT e.name, e.salary,
       (SELECT AVG(salary) FROM employees) AS company_avg,
       (SELECT d.name FROM departments d WHERE d.id = e.dept_id) AS department
FROM employees e;
~~~

The first is uncorrelated and computed once. The second is correlated, looking up each employee's department, and returns NULL when there's no match, behaving like a left join. If it could return more than one row, the query fails.

For many rows, a join is usually clearer and faster than several correlated select-list subqueries, each of which may probe another table per row. Select-list subqueries suit single lookups and small result sets.

## Derived tables, CTEs and views

Three tools name an intermediate result:

| Tool | Scope | Strength |
|---|---|---|
| Derived table | Inside one query, at the point of use | Quick, self-contained |
| CTE (\`WITH\`) | One query, defined at the top | Readable, can be referenced several times, supports recursion |
| View | Stored in the database | Reusable across queries and users |

The derived-table query above becomes clearer as a CTE:

~~~sql
WITH dept_stats AS (
    SELECT dept_id, AVG(salary) AS avg_salary
    FROM employees
    GROUP BY dept_id
)
SELECT dept_id, avg_salary FROM dept_stats WHERE avg_salary > 70000;
~~~

Reading top to bottom, each step is named before it's used. When a query nests derived tables three levels deep, rewriting with CTEs usually improves readability a lot.

## Performance

Optimizers usually **merge** a derived table into the outer query, as if you'd written one flat query, then optimize the whole thing. Filters in the outer query can be pushed down into the derived table. Some constructs prevent merging, such as aggregates, \`DISTINCT\`, \`LIMIT\` and window functions inside the derived table; the database then computes the derived table fully, a step called **materialization**, before the outer query uses it.

Materialization is fine for small intermediate results, such as one row per department. It's costly when the derived table is large and the outer query only needs a few rows. If an outer filter could reduce the work, try placing it inside the derived table yourself.

## MySQL's same-table rule

MySQL rejects \`UPDATE\` or \`DELETE\` statements that select from the same table in a subquery. Wrapping the subquery in a derived table works around it, because MySQL materializes the derived table first:

~~~sql
DELETE FROM employees
WHERE id IN (SELECT id FROM (SELECT id FROM employees WHERE salary < 0) AS t);
~~~

## How interviewers test this

Expect "average employees per department", "top earner per department", "departments whose average salary exceeds the company average" and "When would you use a derived table versus a CTE?" Alias derived tables and computed columns, use them for multi-stage logic and window function filtering, pre-aggregate to avoid fan-out, and mention materialization as a performance consideration.`,
    sources: [PG_QUERIES, SQLITE_QP, MODERN_SQL]
  }
};
