import type { LessonQuestions } from './index';

export const sqlQuestions: LessonQuestions = {
  "what-is-a-database": [
    { q: "What makes SQL a declarative language?", o: ["You describe the result you want and the optimizer decides how to get it", "You write loops over rows", "It runs only on one CPU", "It compiles to machine code"], a: 0, e: "The DBMS chooses indexes, join order and algorithms." },
    { q: "Which database type stores data as JSON-like documents?", o: ["Document database such as MongoDB", "Relational database such as PostgreSQL", "Key-value store such as Redis", "Graph database such as Neo4j"], a: 0, e: "Document stores suit flexible, nested records." },
    { q: "Which problem does a DBMS solve that separate spreadsheets don't?", o: ["Concurrent edits overwriting each other", "Displaying charts", "Printing reports", "Spell checking"], a: 0, e: "Transactions and concurrency control keep simultaneous changes consistent." },
  ],
  "relational-model-and-rdbms": [
    { q: "Who proposed the relational model?", o: ["Edgar F. Codd", "Donald Knuth", "Alan Turing", "Dennis Ritchie"], a: 0, e: "Codd published it at IBM in 1970." },
    { q: "Which relational algebra operation corresponds to SQL's WHERE?", o: ["Selection (σ)", "Projection (π)", "Union (∪)", "Rename (ρ)"], a: 0, e: "Selection filters rows; projection picks columns." },
    { q: "Why can subqueries be used anywhere a table is expected?", o: ["Closure: every relational operation returns a relation", "SQL caches all results", "Indexes make it possible", "Subqueries are views"], a: 0, e: "Outputs are relations, so they can feed other operations." },
  ],
  "tables-rows-and-columns": [
    { q: "Why shouldn't money be stored as FLOAT?", o: ["Floating point can't represent many decimals exactly, causing rounding errors", "FLOAT can't be negative", "FLOAT uses too much space", "FLOAT can't be summed"], a: 0, e: "Use NUMERIC/DECIMAL or integer paise for exact arithmetic." },
    { q: "Which SQL engine stores any type in any column by default, using type affinity?", o: ["SQLite", "PostgreSQL", "SQL Server", "Oracle"], a: 0, e: "SQLite treats declared types as preferences unless the table is STRICT." },
    { q: "Without ORDER BY, in what order are rows returned?", o: ["No guaranteed order", "Insertion order always", "Primary key order always", "Alphabetical order"], a: 0, e: "Tables are unordered sets; the plan decides the order." },
  ],
  "keys-primary-foreign-candidate": [
    { q: "Which key can contain NULL values?", o: ["A foreign key (unless declared NOT NULL)", "A primary key", "Any key in BCNF", "A surrogate primary key"], a: 0, e: "A NULL foreign key means 'no related row yet'." },
    { q: "Why do many schemas prefer surrogate primary keys?", o: ["They never change and are compact", "They have business meaning", "They prevent all duplicates by themselves", "They're required by SQL"], a: 0, e: "Natural values such as emails change; enforce them with UNIQUE instead." },
    { q: "A table enrollments(student_id, course_id) uses both columns as its primary key. What is this called?", o: ["Composite key", "Foreign key", "Alternate key", "Surrogate key"], a: 0, e: "Neither column is unique alone, but the pair is." },
  ],
  "null-values-and-three-valued-logic": [
    { q: "What does NULL = NULL evaluate to?", o: ["UNKNOWN (NULL)", "TRUE", "FALSE", "An error"], a: 0, e: "Use IS NULL or IS NOT DISTINCT FROM to compare NULLs." },
    { q: "What is TRUE OR UNKNOWN?", o: ["TRUE", "UNKNOWN", "FALSE", "NULL error"], a: 0, e: "OR is true if either side is true, whatever the other side is." },
    { q: "Bonuses are 1000, 3000 and NULL. What does AVG(bonus) return?", o: ["2000", "1333.33", "NULL", "4000"], a: 0, e: "AVG ignores NULLs: 4000 / 2." },
  ],
  "database-constraints": [
    { q: "Does CHECK (salary > 0) reject a NULL salary?", o: ["No; the check is UNKNOWN, which passes", "Yes, always", "Only in MySQL", "Only with an index"], a: 0, e: "Add NOT NULL to require a value." },
    { q: "Which database ignores foreign keys unless enabled per connection?", o: ["SQLite (PRAGMA foreign_keys = ON)", "PostgreSQL", "SQL Server", "Oracle"], a: 0, e: "Foreign key enforcement is off by default in SQLite." },
    { q: "Why enforce rules with constraints rather than only in application code?", o: ["Every writer, including scripts and other apps, is checked", "Constraints are faster to write", "Applications can't validate", "Constraints replace backups"], a: 0, e: "Only the database sees every write path." },
  ],
  "sql-dialects-and-standards": [
    { q: "How do you return the first 10 rows in SQL Server?", o: ["SELECT TOP 10 ...", "LIMIT 10", "ROWNUM <= 10 only", "FIRST 10"], a: 0, e: "SQL Server also supports OFFSET ... FETCH NEXT 10 ROWS ONLY." },
    { q: "In MySQL by default, what does || mean?", o: ["Logical OR", "String concatenation", "Bitwise XOR", "Comment"], a: 0, e: "Use CONCAT() for concatenation in MySQL." },
    { q: "Which database treats an empty string as NULL?", o: ["Oracle", "PostgreSQL", "MySQL", "SQLite"], a: 0, e: "This Oracle quirk breaks code written for other databases." },
  ],
  "acid-properties-overview": [
    { q: "Which mechanism provides durability in most databases?", o: ["Write-ahead logging flushed to disk at commit", "Indexes", "Views", "Triggers"], a: 0, e: "Committed changes can be replayed from the log after a crash." },
    { q: "What does autocommit mode mean?", o: ["Each statement is its own committed transaction", "Transactions commit every minute", "Nothing commits", "Only DDL commits"], a: 0, e: "Group related statements explicitly with BEGIN and COMMIT." },
    { q: "Which systems commonly trade strict ACID for availability and scale?", o: ["Many NoSQL databases offering eventual consistency (BASE)", "PostgreSQL", "SQLite", "Oracle"], a: 0, e: "BASE: basically available, soft state, eventually consistent." },
  ],
  "sql-command-categories": [
    { q: "Which category does GRANT belong to?", o: ["DCL", "DDL", "DML", "TCL"], a: 0, e: "Data Control Language manages permissions." },
    { q: "In MySQL, what happens if you run ALTER TABLE in the middle of a transaction?", o: ["It implicitly commits the transaction", "It's rolled back with the transaction", "It's queued", "It fails"], a: 0, e: "PostgreSQL and SQLite support transactional DDL instead." },
    { q: "Which is a TCL command?", o: ["SAVEPOINT", "SELECT", "CREATE", "INSERT"], a: 0, e: "Transaction Control Language: BEGIN, COMMIT, ROLLBACK, SAVEPOINT." },
  ],
  "select-statement-and-column-aliasing": [
    { q: "Why does WHERE annual > 100 fail when annual is a SELECT alias?", o: ["WHERE runs before SELECT creates the alias", "Aliases can't be numbers", "WHERE needs parentheses", "It doesn't fail anywhere"], a: 0, e: "Repeat the expression or filter in an outer query." },
    { q: "What does SELECT name salary FROM employees return (note the missing comma)?", o: ["Names in a column labelled salary", "An error always", "Both columns", "Salaries only"], a: 0, e: "salary becomes an alias for name, a silent bug." },
    { q: "Why avoid SELECT * in application queries?", o: ["It reads unneeded columns and breaks when columns change", "It's not valid SQL", "It returns duplicates", "It locks the table"], a: 0, e: "List the columns you need." },
  ],
  "distinct-keyword": [
    { q: "SELECT DISTINCT dept_id, job_title deduplicates on what?", o: ["The combination of both columns", "dept_id only", "job_title only", "The first column only"], a: 0, e: "DISTINCT applies to the whole output row." },
    { q: "How does DISTINCT treat multiple NULLs?", o: ["As one value", "As distinct values", "It removes them", "It errors"], a: 0, e: "NULLs collapse into a single row, like GROUP BY." },
    { q: "Adding DISTINCT to hide duplicates from a join usually signals what?", o: ["A join that multiplies rows and should be fixed", "Good practice", "Faster queries", "A missing index only"], a: 0, e: "Use EXISTS or pre-aggregate instead of hiding fan-out." },
  ],
  "insert-into-syntax": [
    { q: "Why always list columns in an INSERT?", o: ["It survives schema changes and avoids values landing in the wrong column", "It's faster", "It's required by SQL", "It skips constraints"], a: 0, e: "Positional inserts break when columns are added or reordered." },
    { q: "Which PostgreSQL clause returns the generated id from an INSERT?", o: ["RETURNING id", "OUTPUT id", "SELECT LAST_ID", "GET id"], a: 0, e: "MySQL uses LAST_INSERT_ID(); SQL Server uses OUTPUT." },
    { q: "Why is SELECT MAX(id) + 1 a bad way to generate IDs?", o: ["Concurrent inserts can read the same max and collide", "It's slow only", "MAX ignores NULLs", "It works fine"], a: 0, e: "Use identity columns or sequences." },
  ],
  "update-statement-and-safeguards": [
    { q: "What happens with UPDATE employees SET salary = 0; (no WHERE)?", o: ["Every row is updated", "Nothing happens", "Only the first row changes", "It errors"], a: 0, e: "Preview with SELECT and run inside a transaction." },
    { q: "In a CASE inside UPDATE ... SET, what happens to unmatched rows without ELSE?", o: ["They get NULL", "They keep their value", "They're deleted", "The query fails"], a: 0, e: "Add ELSE salary to leave other rows unchanged." },
    { q: "Why is SET qty = qty − 1 safe under concurrency?", o: ["The database reads and writes the current value atomically", "It uses no locks", "It runs in autocommit", "It's not safe"], a: 0, e: "Read-modify-write in application code risks lost updates." },
  ],
  "delete-vs-truncate-vs-drop": [
    { q: "Which command removes the table's structure too?", o: ["DROP", "TRUNCATE", "DELETE", "ALTER"], a: 0, e: "DROP removes data, structure, indexes and constraints." },
    { q: "Which command fires row-level DELETE triggers?", o: ["DELETE", "TRUNCATE", "DROP", "None"], a: 0, e: "TRUNCATE deallocates storage without visiting rows." },
    { q: "Can TRUNCATE be rolled back in PostgreSQL inside a transaction?", o: ["Yes", "No", "Only with CASCADE", "Only in autocommit"], a: 0, e: "PostgreSQL has transactional DDL; MySQL and Oracle commit implicitly." },
  ],
  "sql-query-execution-order": [
    { q: "Which clause is logically evaluated first?", o: ["FROM", "SELECT", "WHERE", "ORDER BY"], a: 0, e: "FROM and JOIN build the rows the rest of the query works on." },
    { q: "Why can ORDER BY use a SELECT alias?", o: ["ORDER BY runs after SELECT", "ORDER BY runs first", "Aliases are global", "It can't"], a: 0, e: "Only DISTINCT, ORDER BY and LIMIT come after SELECT." },
    { q: "Why can't WHERE filter on ROW_NUMBER()?", o: ["Window functions are computed in the SELECT step, after WHERE", "ROW_NUMBER is not a function", "WHERE doesn't allow numbers", "It can"], a: 0, e: "Wrap the query in a CTE and filter outside." },
  ],
  "where-and-comparison-operators": [
    { q: "Which condition can use an index on salary?", o: ["salary > 50000", "salary * 12 > 600000", "salary + bonus > 60000", "ABS(salary) > 50000"], a: 0, e: "Keep the indexed column bare on one side." },
    { q: "How do you match all rows on 15 March 2024 in a timestamp column?", o: ["created_at >= '2024-03-15' AND created_at < '2024-03-16'", "created_at = '2024-03-15'", "created_at <= '2024-03-15'", "DATE(created_at) LIKE '15%'"], a: 0, e: "Half-open ranges cover the whole day at any precision." },
    { q: "How do you write the name O'Brien as a SQL string literal?", o: ["'O''Brien'", "\"O'Brien\"", "'O\\'Brien' in every database", "O'Brien"], a: 0, e: "Doubling the single quote is standard SQL." },
  ],
  "logical-operators-in-between": [
    { q: "Is BETWEEN 50000 AND 80000 inclusive?", o: ["Yes, both ends included", "No, both excluded", "Only the lower end", "Only the upper end"], a: 0, e: "It equals >= 50000 AND <= 80000." },
    { q: "What does WHERE dept_id = 10 OR dept_id = 20 AND salary > 70000 mean?", o: ["dept 10, or (dept 20 with salary > 70000)", "(dept 10 or 20) with salary > 70000", "Nothing; it errors", "Only dept 20"], a: 0, e: "AND binds tighter than OR; use parentheses." },
    { q: "Which condition is true for every non-NULL dept_id?", o: ["dept_id <> 10 OR dept_id <> 20", "dept_id <> 10 AND dept_id <> 20", "dept_id IN (10, 20)", "dept_id = 10"], a: 0, e: "No value equals both 10 and 20, so one inequality always holds." },
  ],
  "like-pattern-matching": [
    { q: "Which pattern matches names whose second letter is 'a'?", o: ["'_a%'", "'%a_'", "'a%'", "'%a%'"], a: 0, e: "_ matches exactly one character." },
    { q: "Which pattern can use a normal B-tree index?", o: ["'Pro%'", "'%pro'", "'%pro%'", "'_ro%' only"], a: 0, e: "Only a fixed prefix gives a range to scan." },
    { q: "Which PostgreSQL operator does case-insensitive LIKE?", o: ["ILIKE", "LIKEI", "SIMILAR", "~~*"], a: 0, e: "~~* is ILIKE's operator form, but ILIKE is the readable keyword." },
  ],
  "null-handling": [
    { q: "What does COALESCE(mobile, office_phone, 'none') return?", o: ["The first non-NULL argument", "The last argument", "NULL if any is NULL", "All three joined"], a: 0, e: "COALESCE is the standard way to supply defaults." },
    { q: "How do you avoid division by zero in total / count?", o: ["total / NULLIF(count, 0)", "total / COALESCE(count, 0)", "total / ABS(count)", "total / count + 0"], a: 0, e: "NULLIF turns 0 into NULL, making the result NULL instead of an error." },
    { q: "What does SUM(amount) return when no rows match?", o: ["NULL", "0", "An error", "-1"], a: 0, e: "Wrap in COALESCE(SUM(amount), 0) for reports." },
  ],
  "order-by-limit-distinct": [
    { q: "Why add a unique column such as id as the last ORDER BY key?", o: ["To make ordering deterministic when values tie", "It's faster", "It's required with LIMIT", "To remove duplicates"], a: 0, e: "Ties otherwise come back in arbitrary order, breaking pagination." },
    { q: "Why is OFFSET 100000 slow?", o: ["The database must produce and discard all skipped rows", "OFFSET disables indexes", "LIMIT is ignored", "It sorts twice"], a: 0, e: "Keyset pagination continues from the last row seen instead." },
    { q: "What does LIMIT 20, 10 mean in MySQL?", o: ["Skip 20 rows, return 10", "Skip 10, return 20", "Rows 20 to 30 inclusive by id", "An error"], a: 0, e: "MySQL's two-argument form is offset, then count." },
  ],
  "string-functions": [
    { q: "In MySQL, which function counts characters rather than bytes?", o: ["CHAR_LENGTH", "LENGTH", "LEN", "SIZE"], a: 0, e: "LENGTH returns bytes in MySQL, which differs for UTF-8 text." },
    { q: "SQL string positions start at what?", o: ["1", "0", "-1", "It depends on the column"], a: 0, e: "SUBSTRING('abc', 1, 1) returns 'a'." },
    { q: "Which function joins values from many rows into one string in PostgreSQL?", o: ["STRING_AGG", "GROUP_CONCAT", "CONCAT_WS", "LISTAGG only"], a: 0, e: "MySQL and SQLite use GROUP_CONCAT." },
  ],
  "numeric-functions": [
    { q: "What does SELECT 7 / 2 return in PostgreSQL?", o: ["3", "3.5", "4", "An error"], a: 0, e: "Integer division truncates; write 7 / 2.0 or 7 * 1.0 / 2." },
    { q: "What is CEIL(-2.5)?", o: ["-2", "-3", "-2.5", "3"], a: 0, e: "CEIL returns the smallest integer greater than or equal to the value." },
    { q: "What is ROUND(1234, -2)?", o: ["1200", "1234", "1230", "1300"], a: 0, e: "A negative precision rounds to the left of the decimal point." },
  ],
  "date-functions": [
    { q: "Which filter on order_date can use an index?", o: ["order_date >= '2024-01-01' AND order_date < '2025-01-01'", "EXTRACT(YEAR FROM order_date) = 2024", "YEAR(order_date) = 2024", "CAST(order_date AS TEXT) LIKE '2024%'"], a: 0, e: "Functions on the column hide it from the index." },
    { q: "Which PostgreSQL function truncates a timestamp to the start of its month?", o: ["DATE_TRUNC('month', ts)", "TRUNC_MONTH(ts)", "MONTH(ts)", "EXTRACT(MONTH FROM ts)"], a: 0, e: "EXTRACT returns the month number, not a timestamp." },
    { q: "Why store event times as TIMESTAMPTZ / UTC?", o: ["They represent absolute instants regardless of the viewer's time zone", "They use less space", "They sort faster", "They can't be NULL"], a: 0, e: "Convert to local time only for display." },
  ],
  "case-coalesce-nullif": [
    { q: "CASE checks WHEN salary >= 60000 before WHEN salary >= 100000. What happens to a 120,000 salary?", o: ["It matches the first branch", "It matches the second branch", "It matches both", "It gets NULL"], a: 0, e: "The first true condition wins; order specific to general." },
    { q: "What does a CASE with no matching WHEN and no ELSE return?", o: ["NULL", "0", "An error", "The first branch"], a: 0, e: "Include ELSE unless NULL is intended." },
    { q: "How do you count high earners per department in one query?", o: ["SUM(CASE WHEN salary >= 100000 THEN 1 ELSE 0 END)", "COUNT(salary >= 100000) always", "WHERE salary >= 100000 with GROUP BY only", "MAX(CASE ...)"], a: 0, e: "Conditional aggregation counts matching rows in a single pass." },
  ],
  "aggregate-functions": [
    { q: "Which form counts rows where email isn't NULL?", o: ["COUNT(email)", "COUNT(*)", "COUNT(1)", "COUNT(DISTINCT *)"], a: 0, e: "COUNT(*) and COUNT(1) count all rows." },
    { q: "Why is SELECT name, MAX(salary) FROM employees rejected in PostgreSQL?", o: ["name is neither grouped nor aggregated", "MAX needs GROUP BY always", "name is reserved", "It isn't rejected"], a: 0, e: "Use a subquery or window function to find who earns the most." },
    { q: "Which is more resistant to outliers?", o: ["The median", "The average", "The sum", "The maximum"], a: 0, e: "One very large salary lifts the average but barely moves the median." },
  ],
  "group-by": [
    { q: "How do you get a zero count for customers without orders?", o: ["LEFT JOIN orders and COUNT(o.id)", "INNER JOIN and COUNT(*)", "LEFT JOIN and COUNT(*)", "WHERE o.id IS NULL"], a: 0, e: "COUNT(*) counts the NULL-padded row as 1." },
    { q: "How does GROUP BY treat NULLs in the grouping column?", o: ["All NULLs form one group", "Each NULL is its own group", "NULL rows are dropped", "It errors"], a: 0, e: "Label it with COALESCE in reports." },
    { q: "What does GROUP BY ROLLUP(dept_id, job_title) add?", o: ["Subtotals per department and a grand total", "Only a grand total", "Sorted output only", "Nothing"], a: 0, e: "ROLLUP produces hierarchical subtotals." },
  ],
  "having-and-query-order": [
    { q: "Which clause can filter on COUNT(*)?", o: ["HAVING", "WHERE", "FROM", "ON"], a: 0, e: "Aggregates exist only after grouping." },
    { q: "Why put a condition on a grouping column in WHERE instead of HAVING?", o: ["Rows are discarded before the expensive grouping", "HAVING can't use columns", "WHERE allows aggregates", "There's no difference in any case"], a: 0, e: "Results match, but filtering early saves work." },
    { q: "How do you find duplicate emails?", o: ["GROUP BY email HAVING COUNT(*) > 1", "WHERE COUNT(email) > 1", "SELECT DISTINCT email", "ORDER BY email"], a: 0, e: "Groups with more than one row are duplicates." },
  ],
  "inner-join-lesson": [
    { q: "What happens to employees with a NULL dept_id in an inner join with departments?", o: ["They're dropped", "They appear with NULL department", "They match every department", "The query fails"], a: 0, e: "NULL never equals anything, so they have no match." },
    { q: "Why avoid NATURAL JOIN?", o: ["Adding same-named columns later silently changes the join condition", "It's slower", "It's not standard", "It can't join two tables"], a: 0, e: "Write explicit ON conditions." },
    { q: "Departments with 10 employees and 3 projects, joined to both tables. How many rows per department?", o: ["30", "13", "10", "3"], a: 0, e: "Joining two one-to-many tables multiplies rows: fan-out." },
  ],
  "joins-lesson-2": [
    { q: "How do you list customers who never ordered with a LEFT JOIN?", o: ["LEFT JOIN orders o ... WHERE o.id IS NULL", "INNER JOIN ... WHERE o.id IS NULL", "LEFT JOIN ... WHERE o.id IS NOT NULL", "RIGHT JOIN only"], a: 0, e: "Test a column that can't be NULL in a real match." },
    { q: "Putting WHERE o.order_date >= '2024-01-01' after a LEFT JOIN does what?", o: ["Turns it into an inner join by dropping customers without matches", "Keeps all customers", "Errors", "Filters customers by date"], a: 0, e: "Move right-table conditions into ON." },
    { q: "How many rows does a LEFT JOIN return at minimum?", o: ["The number of rows in the left table", "Zero", "The number of rows in the right table", "One"], a: 0, e: "Every left row appears at least once." },
  ],
  "joins-lesson-3": [
    { q: "How do you rewrite A RIGHT JOIN B as a left join?", o: ["B LEFT JOIN A", "A LEFT JOIN B", "A INNER JOIN B", "B FULL JOIN A"], a: 0, e: "Swap the table order; the results match." },
    { q: "Which SQLite version added RIGHT and FULL joins?", o: ["3.39", "3.0", "3.8", "They're unsupported"], a: 0, e: "SQLite added them in 2022." },
    { q: "Why do many teams avoid RIGHT JOIN?", o: ["Left joins read more naturally and mixing directions confuses readers", "RIGHT JOIN is slower", "It's not standard", "It returns wrong results"], a: 0, e: "Every right join has an equivalent left join." },
  ],
  "joins-lesson-4": [
    { q: "How do you emulate FULL JOIN in MySQL?", o: ["LEFT JOIN UNION ALL the unmatched rows of a RIGHT JOIN", "Use CROSS JOIN", "Use NATURAL JOIN", "It's impossible"], a: 0, e: "Filter the right join with IS NULL to avoid duplicating matches." },
    { q: "In a full join reconciliation, why use COALESCE(a.id, b.id)?", o: ["The key may be NULL on either side", "To sort faster", "To remove duplicates", "To force an index"], a: 0, e: "It produces one reliable key column." },
    { q: "Three sizes CROSS JOIN four colours returns how many rows?", o: ["12", "7", "4", "3"], a: 0, e: "A cross join returns every combination." },
  ],
  "joins-lesson-5": [
    { q: "Which join algorithm needs an equality condition?", o: ["Hash join", "Nested loop", "Merge join on ranges", "Cross join"], a: 0, e: "Hash tables match on equal keys only." },
    { q: "Which columns are NOT indexed automatically in PostgreSQL?", o: ["Foreign key columns", "Primary keys", "UNIQUE columns", "Columns covered by an existing index"], a: 0, e: "Index foreign keys used in joins and parent deletes." },
    { q: "In EXPLAIN ANALYZE, a big gap between estimated and actual rows suggests what?", o: ["Stale statistics; run ANALYZE", "A syntax error", "Too many indexes", "A deadlock"], a: 0, e: "Bad estimates lead the optimizer to bad plans." },
  ],
  "joins-lesson-6": [
    { q: "In a self-join finding pairs of colleagues, why use a.id < b.id?", o: ["To skip self-pairs and list each pair once", "To sort the output", "To speed up the join", "It's required syntax"], a: 0, e: "<> would keep both (A, B) and (B, A)." },
    { q: "Which join assigns grades from a bands table by score range?", o: ["A non-equi join with BETWEEN", "A natural join", "A cross join only", "A semi-join"], a: 0, e: "Join ON score BETWEEN min_score AND max_score." },
    { q: "Running totals via a self-join on b.day <= a.day cost what?", o: ["O(n²) pairs", "O(n)", "O(log n)", "O(1)"], a: 0, e: "A window function computes the same in one pass." },
  ],
  "scalar-and-in-subqueries": [
    { q: "What happens when a scalar subquery returns two rows?", o: ["The query fails", "The first row is used", "Both are averaged", "NULL is returned"], a: 0, e: "Use IN when several rows are possible." },
    { q: "WHERE id NOT IN (SELECT manager_id FROM employees) returns nothing. Why?", o: ["The subquery contains a NULL", "NOT IN is invalid", "manager_id is indexed", "The table is empty"], a: 0, e: "x <> NULL is unknown, so NOT IN is never true. Use NOT EXISTS." },
    { q: "salary > ALL (subquery) is equivalent to what?", o: ["salary > (SELECT MAX(...))", "salary > (SELECT MIN(...))", "salary IN (...)", "salary > ANY (...)"], a: 0, e: "Note: if the subquery has no rows, > ALL is true for every row." },
  ],
  "correlated-subqueries": [
    { q: "What makes a subquery correlated?", o: ["It references a column from the outer query", "It uses GROUP BY", "It returns one row", "It's in the SELECT list"], a: 0, e: "Its result depends on the current outer row." },
    { q: "Why must columns be qualified in a correlated subquery on the same table?", o: ["Unqualified names resolve to the inner table and silently change the logic", "SQL requires it always", "For speed", "To avoid NULLs"], a: 0, e: "WHERE dept_id = dept_id inside compares the inner table with itself." },
    { q: "Which rewrite computes each department's average once?", o: ["A join to a GROUP BY derived table", "Another correlated subquery", "A CROSS JOIN", "A UNION"], a: 0, e: "Window functions with PARTITION BY are another single-pass option." },
  ],
  "exists-and-not-exists": [
    { q: "Why can EXISTS stop early?", o: ["It only needs one matching row", "It sorts first", "It caches all rows", "It doesn't stop early"], a: 0, e: "With an index on the correlated column, each check is fast." },
    { q: "Does SELECT 1 versus SELECT * inside EXISTS change the result?", o: ["No; the select list is ignored", "Yes; SELECT * is slower and different", "SELECT 1 returns only one row", "SELECT * errors"], a: 0, e: "EXISTS only checks whether rows exist." },
    { q: "How does SQL express 'students who took every required course'?", o: ["Double NOT EXISTS, or a HAVING COUNT comparison", "A single EXISTS", "UNION ALL", "A CROSS JOIN only"], a: 0, e: "This is relational division." },
  ],
  "subqueries-in-from-and-select": [
    { q: "What do PostgreSQL (before 16), MySQL and SQL Server require for a derived table?", o: ["An alias", "An index", "A primary key", "ORDER BY"], a: 0, e: "FROM (SELECT ...) AS t." },
    { q: "Why use a derived table to compute AVG of COUNT per department?", o: ["Aggregates can't be nested directly", "COUNT is slow", "AVG needs a join", "GROUP BY can't count"], a: 0, e: "Compute counts first, then average them outside." },
    { q: "What happens to an ORDER BY inside a derived table?", o: ["It doesn't guarantee the outer result's order", "It sorts the final output", "It errors always", "It speeds up joins"], a: 0, e: "Sort in the outer query." },
  ],
  "schema-design-from-requirements": [
    { q: "In a one-to-many relationship, where does the foreign key go?", o: ["On the many side", "On the one side", "In a junction table always", "Nowhere"], a: 0, e: "Each child row references one parent." },
    { q: "Where do attributes of a many-to-many relationship, such as enrolled_at, belong?", o: ["In the junction table", "In the student table", "In the course table", "In a view"], a: 0, e: "They describe the pairing, not either entity alone." },
    { q: "Columns phone1, phone2 and phone3 indicate which design problem?", o: ["A repeating group that belongs in a child table", "Good normalization", "Missing indexes", "Too many tables"], a: 0, e: "A phones table removes the fixed limit and awkward queries." },
  ],
  "constraints-and-ddl": [
    { q: "How do you add a NOT NULL column to a large populated table safely?", o: ["Add it nullable, backfill, then SET NOT NULL", "Add NOT NULL with no default", "Drop and recreate the table", "It's impossible"], a: 0, e: "Or add it with a constant default, which is instant in PostgreSQL 11+." },
    { q: "Which PostgreSQL command builds an index without blocking writes?", o: ["CREATE INDEX CONCURRENTLY", "CREATE INDEX LOCKFREE", "REINDEX FAST", "ALTER INDEX ONLINE"], a: 0, e: "It takes longer but keeps the table writable." },
    { q: "What does the expand-and-contract migration pattern achieve?", o: ["Schema changes without breaking the running application", "Faster queries", "Smaller tables", "Automatic backups"], a: 0, e: "Add new structure, migrate code, then remove the old structure." },
  ],
  "normalization-in-practice": [
    { q: "A non-key column depending on another non-key column violates which form?", o: ["3NF", "1NF", "2NF", "4NF"], a: 0, e: "That's a transitive dependency." },
    { q: "Which anomaly prevents adding a course until a student enrolls?", o: ["Insert anomaly", "Update anomaly", "Delete anomaly", "Phantom read"], a: 0, e: "Facts about different entities share one table." },
    { q: "When is denormalization justified?", o: ["For measured read performance needs, keeping copies in sync deliberately", "Always", "Never", "To fix data quality"], a: 0, e: "Normalize first, then denormalize only where it measurably helps." },
  ],
  "indexes-and-views": [
    { q: "An index on (dept_id, salary) can serve which query?", o: ["WHERE dept_id = 10 AND salary > 50000", "WHERE salary > 50000 only", "WHERE name = 'Asha'", "WHERE salary + 1 > 0"], a: 0, e: "The leftmost prefix rule: the first column must be constrained." },
    { q: "What is the main cost of adding indexes?", o: ["Slower writes and extra storage", "Slower reads", "Lost data", "Broken foreign keys"], a: 0, e: "Every insert and update must maintain every index." },
    { q: "How does a materialized view differ from a regular view?", o: ["It stores its result and must be refreshed", "It can't be queried", "It updates instantly", "It has no columns"], a: 0, e: "It trades freshness for speed." },
  ],
  "transactions-in-sql": [
    { q: "What does SELECT ... FOR UPDATE do?", o: ["Locks the selected rows until the transaction ends", "Updates the rows", "Creates a view", "Commits immediately"], a: 0, e: "It prevents lost updates in read-modify-write logic." },
    { q: "How do you prevent deadlocks between transfers?", o: ["Acquire locks in a consistent order, such as lower account id first", "Use autocommit", "Disable indexes", "Use DISTINCT"], a: 0, e: "A global order removes circular waits." },
    { q: "What does ROLLBACK TO SAVEPOINT sp do?", o: ["Undoes changes after sp while keeping the transaction open", "Ends the transaction", "Commits up to sp", "Deletes the savepoint only"], a: 0, e: "Savepoints allow partial retries." },
  ],
  "common-table-expressions": [
    { q: "How long does a CTE exist?", o: ["For the single statement it belongs to", "For the session", "Until dropped", "Forever"], a: 0, e: "Use a view or temporary table for reuse across statements." },
    { q: "Since PostgreSQL 12, a CTE referenced once without side effects is usually what?", o: ["Inlined into the main query", "Always materialized", "Ignored", "Cached across sessions"], a: 0, e: "AS MATERIALIZED forces the old behaviour." },
    { q: "Which MySQL version added CTEs?", o: ["8.0", "5.7", "5.5", "They're unsupported"], a: 0, e: "Older MySQL needs derived tables." },
  ],
  "recursive-ctes": [
    { q: "What stops a recursive CTE?", o: ["The recursive part producing no new rows", "A LIMIT inside the anchor", "An index", "ORDER BY"], a: 0, e: "Always include a termination condition." },
    { q: "In the recursive part, what does the CTE's name refer to?", o: ["The rows produced by the previous iteration", "The entire final result", "The base table", "Nothing"], a: 0, e: "Evaluation is iterative, one level per step." },
    { q: "What is MySQL's default recursion depth limit?", o: ["1,000 (cte_max_recursion_depth)", "100", "Unlimited", "10"], a: 0, e: "SQL Server's default is 100, set with MAXRECURSION." },
  ],
  "window-functions-ranking": [
    { q: "For salaries 90, 80, 80, 70, what does DENSE_RANK give the 70?", o: ["3", "4", "2", "1"], a: 0, e: "Dense ranks have no gaps; RANK would give 4." },
    { q: "Which function returns exactly one row per group when filtering rn = 1?", o: ["ROW_NUMBER", "RANK", "DENSE_RANK", "NTILE"], a: 0, e: "Add a tiebreaker for deterministic results." },
    { q: "NTILE(4) over 10 rows gives bucket sizes of what?", o: ["3, 3, 2, 2", "2, 2, 3, 3", "3, 3, 3, 1", "4, 4, 2, 0"], a: 0, e: "Earlier buckets get the extra rows." },
  ],
  "window-functions-analytics": [
    { q: "What is the default frame when a window has ORDER BY?", o: ["RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW", "ROWS BETWEEN 1 PRECEDING AND CURRENT ROW", "The whole partition", "Only the current row"], a: 0, e: "RANGE includes ties as peers, which surprises people in running totals." },
    { q: "Why does LAST_VALUE often return the current row's value?", o: ["The default frame ends at the current row", "It's a bug in SQL", "It ignores ORDER BY", "It needs DISTINCT"], a: 0, e: "Extend the frame to UNBOUNDED FOLLOWING." },
    { q: "What does LAG(revenue) return for the first row?", o: ["NULL, unless a default is given", "0", "The current value", "An error"], a: 0, e: "LAG(revenue, 1, 0) supplies 0 instead." },
  ],
  "set-operations": [
    { q: "How are columns matched in UNION?", o: ["By position", "By name", "By type only", "By alias in the last query"], a: 0, e: "Swapped columns combine silently if types are compatible." },
    { q: "Which query finds customers who bought in 2023 but not 2024?", o: ["2023 buyers EXCEPT 2024 buyers", "2023 UNION 2024", "2023 INTERSECT 2024", "2024 EXCEPT 2023"], a: 0, e: "Order matters for EXCEPT." },
    { q: "How do set operations treat NULLs when comparing rows?", o: ["As equal to each other", "As never equal", "They drop NULL rows", "They error"], a: 0, e: "That makes EXCEPT reliable for comparing rows with NULLs." },
  ],
  "nth-highest-salary": [
    { q: "Why is DENSE_RANK correct for the Nth highest distinct salary?", o: ["Tied salaries share a rank with no gaps", "It's fastest", "RANK doesn't exist", "ROW_NUMBER skips ties"], a: 0, e: "RANK leaves gaps and ROW_NUMBER splits ties." },
    { q: "How do you return NULL when there's no second highest salary?", o: ["Wrap the LIMIT/OFFSET query in a scalar subquery", "Use COUNT", "Use DISTINCT only", "Add ORDER BY ASC"], a: 0, e: "A scalar subquery with no rows yields NULL." },
    { q: "With salaries 100, 90, 90, 80, what is the third highest distinct salary?", o: ["80", "90", "100", "NULL"], a: 0, e: "Distinct values are 100, 90, 80." },
  ],
  "duplicates-find-and-delete": [
    { q: "Which window function marks which duplicate copy to keep?", o: ["ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at, id)", "RANK() OVER ()", "COUNT(*) OVER ()", "LAG(email)"], a: 0, e: "Delete rows with rn > 1." },
    { q: "In MySQL, how do you delete duplicates keeping the lowest id?", o: ["DELETE u1 FROM users u1 JOIN users u2 ON u1.email = u2.email AND u1.id > u2.id", "DELETE DISTINCT FROM users", "TRUNCATE users", "DELETE FROM users WHERE COUNT(*) > 1"], a: 0, e: "The self-join removes any row with a smaller-id twin." },
    { q: "How do you stop duplicates returning after cleanup?", o: ["Add a UNIQUE constraint and use upserts", "Run the cleanup daily", "Use DISTINCT in every query", "Add more indexes only"], a: 0, e: "The database then rejects or merges duplicates at write time." },
  ],
  "top-n-per-group": [
    { q: "Why can't GROUP BY alone return the highest earner's name per department?", o: ["A group has many names, so name has no single value", "MAX can't be grouped", "Names are text", "It can"], a: 0, e: "Rank within groups with a window function instead." },
    { q: "Which ranking function returns all employees tied for the top salary?", o: ["RANK or DENSE_RANK", "ROW_NUMBER", "NTILE", "LAG"], a: 0, e: "ROW_NUMBER picks exactly one." },
    { q: "Which PostgreSQL-only syntax gives top-1 per group concisely?", o: ["DISTINCT ON", "TOP 1 PER", "FIRST BY", "QUALIFY"], a: 0, e: "QUALIFY exists in Snowflake and others, not PostgreSQL." },
  ],
  "self-join-manager-questions": [
    { q: "Which join condition pairs each employee with their manager?", o: ["e.manager_id = m.id", "e.id = m.manager_id", "e.id = m.id", "e.manager_id = m.manager_id"], a: 0, e: "Reversing it pairs employees with their direct reports." },
    { q: "How do you include the CEO, who has no manager, in the list?", o: ["LEFT JOIN the manager copy", "INNER JOIN", "CROSS JOIN", "WHERE manager_id = 0"], a: 0, e: "The CEO's manager columns come back NULL." },
    { q: "How do you find everyone under a VP at any depth?", o: ["A recursive CTE", "One self-join", "GROUP BY manager_id", "A UNION of two queries"], a: 0, e: "Each iteration adds the next level of reports." },
  ],
  "consecutive-streaks-gaps": [
    { q: "Why does date − ROW_NUMBER() group consecutive days?", o: ["Within a run both increase by one, so the difference stays constant", "ROW_NUMBER sorts dates", "It removes duplicates", "It counts gaps"], a: 0, e: "A gap changes the difference, starting a new island." },
    { q: "What must you do before computing login streaks?", o: ["Reduce to one row per user per day", "Sort by user name", "Delete old logins", "Convert dates to text"], a: 0, e: "Duplicate dates break the difference trick." },
    { q: "Which function finds gaps in invoice numbers directly?", o: ["LEAD", "RANK", "NTILE", "SUM"], a: 0, e: "Rows where the next number jumps by more than one mark gaps." },
  ],
  "reporting-queries": [
    { q: "Why write 100.0 * part / total instead of 100 * part / total?", o: ["To avoid integer division", "For speed", "To round", "It's the same"], a: 0, e: "Integer division truncates small fractions to 0." },
    { q: "What does SUM(SUM(amount)) OVER () compute in a grouped query?", o: ["The grand total across all groups", "A syntax error", "The group's sum twice", "A running total"], a: 0, e: "The inner SUM is per group; the window sums those." },
    { q: "Why can LAG(revenue, 12) give wrong year-over-year results?", o: ["Missing months shift the offset", "LAG can't go back 12", "It needs DISTINCT", "It ignores ORDER BY"], a: 0, e: "Fill missing periods with a generated date series first." },
  ],
  "sql-interview-theory": [
    { q: "Which index determines the physical order of rows in MySQL InnoDB?", o: ["The clustered primary key index", "Any secondary index", "A hash index", "None"], a: 0, e: "A table has at most one clustered index." },
    { q: "Which system type runs large aggregate queries over historical data?", o: ["OLAP", "OLTP", "CRM", "DNS"], a: 0, e: "OLTP handles many small transactions." },
    { q: "What prevents SQL injection?", o: ["Parameterized queries", "Stored passwords", "HTTPS only", "Longer table names"], a: 0, e: "Parameters keep input as data, never code." },
  ],
};
