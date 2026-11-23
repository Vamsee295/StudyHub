// Long-form theory for SQL database design and advanced SQL modules. Original writing.
import { LessonTheory } from './utils';
import { PG_DDL, PG_PERF, PG_MVCC, PG_QUERIES, PG_WINDOW, SQLITE_LANG, SQLITE_QP, UTL, MODERN_SQL } from './sql-theory-sources';

export const sqlAdvancedTheory: Record<string, LessonTheory> = {
  "schema-design-from-requirements": {
    theory: `Schema design turns a description of a business into tables, columns, keys and relationships. A good schema makes queries natural, prevents invalid data and adapts as requirements grow; a poor one causes duplicated data, awkward queries and painful migrations for years. This lesson walks through a repeatable process: finding entities and attributes, identifying relationships and their cardinality, modelling many-to-many relationships with junction tables, and checking the design against real queries.

## Start from requirements

Design begins with what the system must do, not with tables. Take a requirement for a course platform:

> Students enrol in courses. Each course has one instructor and many lessons. Students can enrol in many courses, and the platform records each student's enrolment date and progress.

Read it for nouns and verbs. Nouns usually become entities or attributes; verbs usually become relationships.

## Step 1: identify entities

An **entity** is a thing the system stores information about, with its own identity and several attributes. From the requirement: student, course, instructor and lesson. Each becomes a table.

A useful test: if something has its own attributes and you'd look it up independently, it's an entity. "Enrolment date" has no attributes of its own, so it's an attribute, not an entity.

## Step 2: identify attributes

List what you need to know about each entity, guided by the queries the system must answer:

| Entity | Attributes |
|---|---|
| students | id, name, email, joined_at |
| instructors | id, name, email, bio |
| courses | id, title, description, instructor_id, published_at |
| lessons | id, course_id, title, position, duration_minutes |

Choose types and constraints as you go: \`email\` is unique and not null, \`position\` is a positive integer, and \`duration_minutes\` has a \`CHECK (duration_minutes > 0)\`.

## Step 3: identify relationships and cardinality

**Cardinality** describes how many rows on each side can relate:

| Relationship | Type | Implementation |
|---|---|---|
| Instructor teaches courses | One-to-many: one instructor, many courses | \`instructor_id\` foreign key in courses |
| Course contains lessons | One-to-many | \`course_id\` foreign key in lessons |
| Student enrols in courses | Many-to-many | Junction table \`enrollments\` |

The rule for one-to-many: put the foreign key on the "many" side. Each lesson belongs to one course, so \`lessons.course_id\` references \`courses.id\`. Putting lesson IDs in the course table would need a list in one column, which breaks first normal form.

## Step 4: model many-to-many with a junction table

A student takes many courses and a course has many students. Neither table can hold the other's foreign key, so a **junction table**, also called an associative or bridge table, holds one row per pairing:

~~~sql
CREATE TABLE enrollments (
    student_id  INTEGER NOT NULL REFERENCES students(id),
    course_id   INTEGER NOT NULL REFERENCES courses(id),
    enrolled_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    progress    NUMERIC(5, 2) NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
    PRIMARY KEY (student_id, course_id)
);
~~~

Junction tables often carry attributes of the relationship itself: the enrolment date and progress belong to neither the student nor the course alone, but to the pairing. The composite primary key prevents enrolling the same student in the same course twice.

## One-to-one relationships

A one-to-one relationship, such as a user and their profile settings, can be one table or two. Split them when one side is optional, rarely accessed, large or has different security needs. Implement it with a foreign key that's also unique, often the primary key itself: \`profiles.user_id\` as both primary key and foreign key.

## Optional versus mandatory

Cardinality also includes whether participation is required. Must every course have an instructor? Then \`instructor_id\` is \`NOT NULL\`. Can a course exist before it's assigned? Then allow NULL. These decisions encode business rules, so confirm them with whoever owns the requirements.

## Entity-relationship diagrams

An **ER diagram** draws entities as boxes and relationships as lines, with notation such as crow's feet marking the "many" end. Sketching one before writing DDL makes gaps visible: a relationship with no foreign key, or an entity nobody can reach. Tools such as dbdiagram.io generate DDL from text descriptions.

## Step 5: check against queries

A schema exists to answer questions. Write the important queries against the draft:

- list a student's courses with progress: \`students\` join \`enrollments\` join \`courses\`
- list a course's lessons in order: \`lessons WHERE course_id = ? ORDER BY position\`
- count students per instructor: \`instructors\` join \`courses\` join \`enrollments\`, grouped

If a query is awkward or impossible, the schema is missing something. If lesson completion must be tracked per lesson, not only overall progress, you need another junction table, \`lesson_completions (student_id, lesson_id, completed_at)\`.

## Common design mistakes

| Mistake | Problem | Fix |
|---|---|---|
| Comma-separated lists in a column | Can't index, join or constrain the values | A child or junction table |
| Repeating columns: \`phone1\`, \`phone2\`, \`phone3\` | Fixed limit, awkward queries | A \`phones\` table |
| Storing derived values, such as an age | Goes stale | Store the birthdate; compute age |
| One giant table for everything | Many NULLs, update anomalies | Split into entities |
| Generic "entity-attribute-value" tables | Loses types and constraints; hard queries | Real columns, or a JSON column for truly variable data |

## Naming and conventions

Pick conventions and apply them everywhere: plural or singular table names, \`snake_case\`, an \`id\` primary key and \`<table>_id\` foreign keys, \`created_at\` and \`updated_at\` timestamps. Consistency makes a schema with a hundred tables navigable.

## Designing for change

Requirements change. A schema that's normalized, with clear keys and constraints, absorbs change through additive migrations: a new table or a new nullable column. Planning every future feature in advance usually adds complexity that's never used; model what you know well and keep the structure clean.

## How interviewers test this

Expect "Design a schema for a library, an e-commerce store or a course platform." Walk through entities, attributes, relationships with cardinality, foreign keys on the many side and junction tables for many-to-many, then test the design with two or three key queries. Mention constraints and indexes for the main access paths.`,
    sources: [PG_DDL, SQLITE_LANG, MODERN_SQL]
  },

  "constraints-and-ddl": {
    theory: `Data Definition Language (DDL) creates, changes and removes database objects: tables, columns, constraints, indexes and views. Writing DDL well means choosing types and constraints that encode the rules of the data, and changing schemas safely once real data and real users depend on them. This lesson covers \`CREATE TABLE\` in depth, \`ALTER TABLE\` operations, dropping objects, and the practices that keep schema changes safe in production.

## CREATE TABLE

A complete table definition specifies columns, types, defaults and constraints:

~~~sql
CREATE TABLE orders (
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    customer_id   BIGINT NOT NULL REFERENCES customers(id),
    status        VARCHAR(20) NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'paid', 'shipped', 'cancelled')),
    total         NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    shipped_at    TIMESTAMPTZ,
    CONSTRAINT chk_shipped_after_created CHECK (shipped_at IS NULL OR shipped_at >= created_at)
);
~~~

Constraints can be written inline with a column or as separate table constraints. Multi-column constraints, such as composite keys or checks comparing two columns, must be table constraints. Naming constraints, as with \`chk_shipped_after_created\`, produces clearer error messages and easier maintenance.

## Useful CREATE variants

- \`CREATE TABLE IF NOT EXISTS\` skips creation if the table exists, which is useful in setup scripts
- \`CREATE TABLE new_table AS SELECT ...\` creates a table from a query's result; it copies data and column types but not constraints, indexes or defaults
- \`CREATE TEMPORARY TABLE\` creates a table visible only to the current session and dropped when it ends

## ALTER TABLE

\`ALTER TABLE\` changes an existing table:

~~~sql
ALTER TABLE orders ADD COLUMN coupon_code VARCHAR(30);
ALTER TABLE orders DROP COLUMN coupon_code;
ALTER TABLE orders RENAME COLUMN total TO total_amount;
ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'paid';
ALTER TABLE orders ALTER COLUMN total_amount TYPE NUMERIC(14, 2);
ALTER TABLE orders ADD CONSTRAINT uq_orders_ref UNIQUE (external_ref);
ALTER TABLE orders DROP CONSTRAINT uq_orders_ref;
~~~

Syntax varies: MySQL uses \`MODIFY COLUMN\` to change a type, and SQLite supports only a few operations directly (adding, renaming and dropping columns, and renaming tables). For other changes in SQLite, you create a new table, copy the data and swap the tables.

## Adding NOT NULL columns to populated tables

Adding a \`NOT NULL\` column to a table with existing rows fails unless you supply a default, since existing rows would have no value. Two approaches:

- add it with a default: \`ADD COLUMN region VARCHAR(20) NOT NULL DEFAULT 'unknown'\`
- add it as nullable, backfill values with \`UPDATE\`, then \`ALTER COLUMN region SET NOT NULL\`

The second approach lets you compute real values rather than a placeholder. In PostgreSQL 11 and later, adding a column with a constant default is instant, since the default is stored once in the catalog instead of written to every row.

## Changing column types

Changing a type can require rewriting every row and fails if existing values can't be converted. PostgreSQL's \`USING\` clause specifies the conversion: \`ALTER COLUMN price TYPE NUMERIC USING price::numeric\`. Narrowing a type, such as shortening a \`VARCHAR\`, fails if any value is too long. Check the data first.

## Dropping objects

\`DROP TABLE\`, \`DROP INDEX\` and \`DROP VIEW\` remove objects permanently. \`IF EXISTS\` avoids an error when the object is missing. If other objects depend on the one being dropped, such as views or foreign keys referencing a table, the drop fails unless you add \`CASCADE\`, which also drops the dependents. Read what \`CASCADE\` will remove before using it in production.

## Locking during DDL

DDL usually takes strong locks. In PostgreSQL, most \`ALTER TABLE\` forms take an exclusive lock that blocks all reads and writes for the duration. A type change that rewrites a 50-million-row table can block the application for minutes. Even a fast \`ALTER\` can cause an outage if it waits behind a long-running query while holding its place in the lock queue, blocking every query that arrives after it. Setting \`lock_timeout\` makes the statement fail quickly instead of stalling everything.

## Safer production changes

Teams use patterns that avoid long locks:

| Change | Safer approach |
|---|---|
| Add an index | \`CREATE INDEX CONCURRENTLY\` in PostgreSQL, which builds without blocking writes |
| Add a foreign key or check | Add with \`NOT VALID\`, then \`VALIDATE CONSTRAINT\` separately |
| Rename a column | Add the new column, write to both, migrate readers, then drop the old one |
| Change a type on a big table | Add a new column, backfill in batches, swap, drop the old column |

The **expand and contract** pattern behind the last two rows keeps the application working at every step: first expand the schema to support both old and new code, deploy code that uses the new structure, then contract by removing what's no longer used.

## Migrations

Production schemas change through **migrations**: versioned scripts applied in order and recorded in a table so each runs once. Tools such as Flyway, Liquibase, Alembic and Prisma Migrate manage them. Good migration practice:

- one logical change per migration, reviewed like code
- never edit a migration that has already run in production; write a new one
- make migrations backward compatible with the currently deployed code
- test migrations against a copy of production-sized data to spot slow operations

## Transactional DDL

PostgreSQL and SQLite run DDL inside transactions, so a failed multi-step migration rolls back completely. MySQL and Oracle commit implicitly on most DDL, so a migration that fails halfway leaves the schema partly changed and needs manual repair. This is a real operational difference to consider when choosing a database.

## How interviewers test this

Expect to write a \`CREATE TABLE\` with appropriate types and constraints, and questions such as "How do you add a NOT NULL column to a large table?" and "How do you change a schema without downtime?" Show constraints with names, describe the backfill approach, and explain locking, concurrent index builds and expand-and-contract migrations.`,
    sources: [PG_DDL, SQLITE_LANG, MODERN_SQL]
  },

  "normalization-in-practice": {
    theory: `Normalization organizes tables so each fact is stored once, eliminating the redundancy that causes update, insert and delete anomalies. It's defined by a series of normal forms, each removing a specific kind of redundancy. This lesson explains the anomalies normalization prevents, works through first, second and third normal form and Boyce-Codd normal form on a concrete example, and explains when deliberate denormalization makes sense.

## The problem: redundancy and anomalies

Consider one wide table for course enrolments:

| student_id | student_name | course_id | course_title | instructor | instructor_email | grade |
|---|---|---|---|---|---|---|
| 1 | Asha | C1 | Databases | Rao | rao@uni.edu | A |
| 1 | Asha | C2 | Networks | Iyer | iyer@uni.edu | B |
| 2 | Rahul | C1 | Databases | Rao | rao@uni.edu | A |

The instructor's email appears in every row for that course. This redundancy causes three **anomalies**:

- **Update anomaly**: changing Rao's email requires updating every row for course C1. Miss one, and the table contradicts itself
- **Insert anomaly**: you can't record a new course until a student enrols in it, because each row needs a student
- **Delete anomaly**: if Rahul is the last student in a course and drops out, deleting his row also deletes the only record of the course and its instructor

Normalization removes these by splitting the table so each fact lives in one place.

## Functional dependencies

Normal forms are defined using **functional dependencies**. A → B means "A determines B": knowing A tells you B exactly. In the table above:

- \`student_id → student_name\`
- \`course_id → course_title, instructor\`
- \`instructor → instructor_email\`
- \`(student_id, course_id) → grade\`

The key of the wide table is \`(student_id, course_id)\`. Normalization asks which non-key columns depend on the whole key, on part of it, or on other non-key columns.

## First normal form (1NF)

A table is in 1NF when every column holds atomic values, with no lists, arrays or repeating groups, and each row is unique. A \`courses\` column containing \`'C1, C2'\` violates 1NF: you can't index the individual values, join on them or enforce foreign keys. The fix is one row per value, or a separate table. The example table above is already in 1NF.

## Second normal form (2NF)

A table is in 2NF when it's in 1NF and every non-key column depends on the **whole** primary key, not only part of it. This only matters for composite keys.

In the example, \`student_name\` depends only on \`student_id\`, and \`course_title\` depends only on \`course_id\`. These **partial dependencies** violate 2NF. Fix them by moving each into a table keyed by the part it depends on:

- \`students (student_id, student_name)\`
- \`courses (course_id, course_title, instructor, instructor_email)\`
- \`enrollments (student_id, course_id, grade)\`

Now \`grade\`, which depends on both student and course, stays with the composite key.

## Third normal form (3NF)

A table is in 3NF when it's in 2NF and no non-key column depends on another non-key column. Such chains are called **transitive dependencies**.

In the new courses table, \`course_id → instructor\` and \`instructor → instructor_email\`, so the email depends on the key only through the instructor. If an instructor teaches five courses, their email is stored five times. Move it into its own table:

- \`instructors (instructor_id, name, email)\`
- \`courses (course_id, course_title, instructor_id)\`

A common summary of 3NF: every non-key column depends on "the key, the whole key, and nothing but the key".

## Boyce-Codd normal form (BCNF)

BCNF tightens 3NF: for every functional dependency A → B, A must be a superkey. Tables in 3NF but not BCNF are uncommon and arise with overlapping candidate keys. For example, if each instructor teaches only one subject, and a student takes each subject from one instructor, then in \`(student, subject, instructor)\` the dependency \`instructor → subject\` has a non-superkey on the left. Decomposing into \`(student, instructor)\` and \`(instructor, subject)\` reaches BCNF. For most practical schemas, reaching 3NF also reaches BCNF.

## Higher normal forms

Fourth and fifth normal forms deal with multi-valued and join dependencies, such as storing independent lists of an employee's skills and languages in one table, which creates every combination. They matter less often in practice, but the 4NF case is a recognizable design smell: two independent many-valued facts in one table.

## Normal forms at a glance

| Form | Rule | Removes |
|---|---|---|
| 1NF | Atomic values, unique rows | Repeating groups and lists |
| 2NF | No partial dependency on a composite key | Facts about part of the key |
| 3NF | No transitive dependency | Facts about non-key columns |
| BCNF | Every determinant is a superkey | Remaining dependency anomalies |

## The cost of normalization

Normalized schemas need joins to reassemble data. The example's original wide table now takes a four-table join. With indexed keys, joins are fast, and modern databases handle them well. But for some read-heavy workloads, such as analytics dashboards scanning billions of rows, joins become a bottleneck.

## Deliberate denormalization

**Denormalization** reintroduces redundancy on purpose for performance:

- copying a customer's name onto each order for fast display
- storing a precomputed \`order_count\` on the customers table
- using materialized views or summary tables for reports
- data warehouses using **star schemas**, with wide fact tables surrounded by dimension tables, optimized for analytical queries

Denormalize only after normalizing, and only for measured performance needs. Every copy must be kept in sync, through triggers, application code or scheduled refreshes, and that's where bugs creep in. Some redundancy is also semantically correct: an order should store the price paid at purchase time, not reference the product's current price.

## How interviewers test this

Expect "What is normalization and why do it?", "Explain 1NF, 2NF and 3NF with an example", and "When would you denormalize?" Use a wide table with anomalies, decompose it step by step naming each dependency removed, and discuss denormalization as a measured trade-off.`,
    sources: [PG_DDL, MODERN_SQL, SQLITE_LANG]
  },

  "indexes-and-views": {
    theory: `An index is a separate data structure that lets the database find rows without scanning a whole table, like the index at the back of a book. Indexes turn slow queries into fast ones, but they cost storage and slow down writes, so choosing them well is a core skill. Views are named queries that simplify access to complex data. This lesson explains how B-tree indexes work, composite and covering indexes, when indexes help or don't, reading \`EXPLAIN\`, and regular and materialized views.

## Why indexes matter

Without an index, finding employees with a given email means a **full table scan**: reading every row. For a million rows, that's a million comparisons. An index on \`email\` finds the row in a handful of steps. The difference grows with table size: scans are O(n), while index lookups are O(log n).

## B-tree indexes

The default index type in every major database is the **B-tree**, a balanced tree kept in sorted order. Each node holds many keys, so the tree is shallow: three or four levels can index millions of rows. A lookup walks from the root to a leaf, then follows a pointer to the table row.

Because B-trees are sorted, they support more than equality:

| Query | B-tree helps? |
|---|---|
| \`WHERE email = ?\` | Yes |
| \`WHERE salary BETWEEN 50000 AND 80000\` | Yes, a range scan |
| \`WHERE name LIKE 'Ash%'\` | Yes, a prefix range (collation permitting) |
| \`ORDER BY created_at\` | Yes, rows can be read in index order |
| \`WHERE name LIKE '%sha'\` | No |
| \`WHERE LOWER(email) = ?\` | No, unless the index is on \`LOWER(email)\` |

Other index types exist for special cases: hash indexes for equality only, GIN for full-text search and JSON in PostgreSQL, GiST for geometric and range data, and BRIN for huge tables with naturally ordered data such as timestamps.

## Creating indexes

~~~sql
CREATE INDEX idx_employees_dept ON employees (dept_id);
CREATE UNIQUE INDEX idx_employees_email ON employees (email);
~~~

Primary keys and unique constraints create indexes automatically. Foreign keys don't in PostgreSQL and SQL Server, so index foreign key columns used in joins.

## Composite indexes

An index on several columns is sorted by the first column, then the second within it, like a phone book sorted by last name then first name:

~~~sql
CREATE INDEX idx_emp_dept_salary ON employees (dept_id, salary);
~~~

This index serves:

- \`WHERE dept_id = 10\`
- \`WHERE dept_id = 10 AND salary > 50000\`
- \`WHERE dept_id = 10 ORDER BY salary\`

But not \`WHERE salary > 50000\` alone, because salaries are only sorted within each department. This is the **leftmost prefix rule**. Order columns with equality conditions first and range conditions last.

## Covering indexes

If an index contains every column a query needs, the database can answer from the index alone without visiting the table, an **index-only scan**:

~~~sql
CREATE INDEX idx_emp_dept_cover ON employees (dept_id) INCLUDE (name, salary);
SELECT name, salary FROM employees WHERE dept_id = 10;
~~~

PostgreSQL and SQL Server support \`INCLUDE\` for extra non-key columns. Covering indexes are one reason to avoid \`SELECT *\`.

## The cost of indexes

Indexes aren't free:

- **Writes slow down**: every insert, update of an indexed column and delete must update every index on the table
- **Storage**: indexes can rival the table in size
- **Planning**: more indexes mean more options for the optimizer to evaluate

Index columns that appear in frequent \`WHERE\`, \`JOIN\` and \`ORDER BY\` clauses. Don't index every column, and periodically remove unused indexes; PostgreSQL's \`pg_stat_user_indexes\` shows how often each is used.

## When indexes don't help

The optimizer may ignore an index when:

- the query returns a large fraction of the table; reading most pages through an index costs more than one sequential scan
- the column has few distinct values, such as a boolean, unless the query targets a rare value
- the condition wraps the column in a function or forces a type conversion
- statistics are stale, so estimates are wrong; run \`ANALYZE\`

PostgreSQL's **partial indexes** cover only some rows, such as \`CREATE INDEX ON orders (created_at) WHERE status = 'pending'\`, which stays small and fast for queries on that subset.

## Reading EXPLAIN

\`EXPLAIN\` shows the plan the optimizer chose, and \`EXPLAIN ANALYZE\` runs the query and shows actual timings:

~~~sql
EXPLAIN ANALYZE SELECT * FROM employees WHERE email = 'asha@example.com';
~~~

Look for "Index Scan" or "Index Only Scan" versus "Seq Scan", compare estimated with actual row counts, and find the most expensive step. MySQL's \`EXPLAIN\` shows an access \`type\` column, where \`ALL\` means a full scan; SQLite uses \`EXPLAIN QUERY PLAN\`.

## Views

A **view** is a stored query that behaves like a table:

~~~sql
CREATE VIEW employee_directory AS
SELECT e.id, e.name, d.name AS department, e.email
FROM employees e
LEFT JOIN departments d ON e.dept_id = d.id;

SELECT * FROM employee_directory WHERE department = 'Engineering';
~~~

A regular view stores no data. Each query against it runs the underlying query, and the optimizer usually merges the view into the outer query. Views:

- **simplify** complex joins into a name others can query
- **secure** data by exposing only certain columns or rows; grant access to the view, not the base tables
- **stabilize interfaces**: the underlying tables can change while the view keeps the same shape

Views over a single table without joins or aggregates can be updatable; views with joins, aggregates or \`DISTINCT\` generally aren't, without triggers.

## Materialized views

A **materialized view** stores its result physically, like a cached table:

~~~sql
CREATE MATERIALIZED VIEW monthly_sales AS
SELECT DATE_TRUNC('month', order_date) AS month, SUM(amount) AS revenue
FROM orders GROUP BY 1;

REFRESH MATERIALIZED VIEW monthly_sales;
~~~

Queries against it are fast, but the data is only as fresh as the last refresh. They suit dashboards and reports over large data where slight staleness is acceptable. PostgreSQL and Oracle support them natively; MySQL and SQLite don't, so teams emulate them with summary tables updated on a schedule.

## How interviewers test this

Expect "How does an index work?", "Why isn't my index used?", "What's a composite index and the leftmost prefix rule?" and "View versus materialized view?" Explain B-trees and O(log n) lookups, the write cost of indexes, the leftmost prefix rule, covering indexes, and the freshness trade-off of materialized views.`,
    sources: [PG_PERF, UTL, SQLITE_QP]
  },

  "transactions-in-sql": {
    theory: `A transaction groups SQL statements into one unit that either succeeds completely or has no effect. Transactions keep data correct when operations involve several steps, when errors occur partway through, and when many users change data at once. This lesson explains \`BEGIN\`, \`COMMIT\` and \`ROLLBACK\`, savepoints, the four isolation levels and the anomalies each prevents, locking for read-modify-write operations, and deadlocks.

## The basic commands

~~~sql
BEGIN;
UPDATE accounts SET balance = balance - 500 WHERE id = 1;
UPDATE accounts SET balance = balance + 500 WHERE id = 2;
COMMIT;
~~~

\`BEGIN\` (or \`START TRANSACTION\`) opens a transaction. \`COMMIT\` makes all its changes permanent and visible to others. \`ROLLBACK\` discards all changes since \`BEGIN\`. If the connection drops or the server crashes before \`COMMIT\`, the database rolls back automatically.

## Autocommit

By default, most databases and drivers run in **autocommit** mode: each statement is its own transaction, committed immediately. Without an explicit \`BEGIN\`, the two updates above are separate transactions, and a crash between them loses money. Application frameworks usually provide a transaction wrapper, such as Spring's \`@Transactional\` or Django's \`atomic()\`, which issues \`BEGIN\` and \`COMMIT\` for you.

## Errors inside transactions

In PostgreSQL, any error inside a transaction puts it into an aborted state: every later statement fails until you \`ROLLBACK\`. MySQL rolls back only the failing statement and lets the transaction continue, so the application must decide whether to roll back. Code that ignores errors and commits anyway can save half-finished work in MySQL.

## Savepoints

A savepoint marks a point inside a transaction that you can roll back to without abandoning everything:

~~~sql
BEGIN;
INSERT INTO orders (id, customer_id) VALUES (1001, 7);
SAVEPOINT before_items;
INSERT INTO order_items (order_id, product_id, qty) VALUES (1001, 55, 2);
-- suppose this fails a stock check
ROLLBACK TO SAVEPOINT before_items;
INSERT INTO order_items (order_id, product_id, qty) VALUES (1001, 56, 2);
COMMIT;
~~~

Savepoints let you retry part of a transaction, and they're how frameworks implement nested transactions.

## Concurrency anomalies

When transactions run at the same time, several anomalies can occur:

| Anomaly | Example |
|---|---|
| Dirty read | T2 reads a balance T1 changed but hasn't committed; T1 rolls back, so T2 used a value that never existed |
| Non-repeatable read | T1 reads a row, T2 updates and commits it, T1 reads again and gets a different value |
| Phantom read | T1 counts orders over ₹1,000, T2 inserts a new one, T1 counts again and gets a different number |
| Lost update | T1 and T2 both read stock = 10, both subtract 1 and write 9; one sale is lost |
| Write skew | Two doctors each check that another doctor is on call, then both go off call, leaving nobody |

## Isolation levels

The SQL standard defines four isolation levels, each preventing more anomalies:

| Level | Dirty read | Non-repeatable read | Phantom read |
|---|---|---|---|
| Read uncommitted | Possible | Possible | Possible |
| Read committed | Prevented | Possible | Possible |
| Repeatable read | Prevented | Prevented | Possible (in the standard) |
| Serializable | Prevented | Prevented | Prevented |

Set the level per transaction:

~~~sql
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
~~~

Real databases differ from the standard table. PostgreSQL defaults to read committed, never allows dirty reads even at read uncommitted, and its repeatable read also prevents phantoms. MySQL's InnoDB defaults to repeatable read. PostgreSQL's serializable level detects conflicts and aborts one transaction with a serialization failure, which the application must retry. SQLite serializes writes with a database-level lock.

## How MVCC provides isolation

PostgreSQL, MySQL's InnoDB and Oracle use **multi-version concurrency control** (MVCC). Updates create new row versions instead of overwriting, and each transaction reads from a snapshot. Under read committed, each statement gets a fresh snapshot; under repeatable read, the whole transaction uses the snapshot taken at its first query. Readers never block writers, and writers never block readers. Old versions are cleaned up later, by \`VACUUM\` in PostgreSQL.

## Preventing lost updates

The read-modify-write pattern is dangerous at read committed:

~~~sql
SELECT stock FROM products WHERE id = 5;      -- application reads 10
UPDATE products SET stock = 9 WHERE id = 5;   -- writes 10 - 1
~~~

Two concurrent sessions can both read 10 and both write 9. Fixes:

- **Atomic updates**: \`UPDATE products SET stock = stock - 1 WHERE id = 5 AND stock > 0\`, which reads and writes in one statement
- **Pessimistic locking**: \`SELECT stock FROM products WHERE id = 5 FOR UPDATE\` locks the row until the transaction ends, so the second session waits
- **Optimistic locking**: store a \`version\` column, and update with \`WHERE id = 5 AND version = 3\`; if zero rows change, someone else updated first, so reload and retry
- **Higher isolation**: repeatable read in PostgreSQL detects the conflict and aborts one transaction

## Deadlocks

A **deadlock** occurs when two transactions each hold a lock the other needs. T1 locks account 1 and waits for account 2, while T2 locks account 2 and waits for account 1. Neither can proceed. Databases detect deadlocks and abort one transaction with an error. Prevent them by acquiring locks in a consistent order, such as always locking the lower account ID first, and keeping transactions short.

## Keep transactions short

Long transactions hold locks that block other writers, keep old row versions alive so MVCC cleanup can't remove them, and increase deadlock risk. Never wait for user input or call slow external services, such as payment gateways or email providers, while a transaction is open. Do that work outside the transaction, then open a short transaction to record the result.

## How interviewers test this

Expect "What is a transaction?", "Explain isolation levels and the anomalies they prevent", "How do you prevent lost updates?" and "What's a deadlock?" Use a bank transfer for atomicity, the anomaly table for isolation, describe atomic updates, SELECT FOR UPDATE and optimistic locking, and give the consistent lock ordering fix for deadlocks.`,
    sources: [PG_MVCC, SQLITE_LANG, MODERN_SQL]
  },

  "common-table-expressions": {
    theory: `A common table expression (CTE) names a subquery at the start of a statement using \`WITH\`, so the main query can refer to it like a table. CTEs turn deeply nested queries into a readable sequence of named steps, and they can be referenced several times in one query. This lesson explains CTE syntax, chaining multiple CTEs, how CTEs compare with subqueries and temporary tables, how databases execute them, and data-modifying CTEs.

## Basic syntax

~~~sql
WITH dept_avg AS (
    SELECT dept_id, AVG(salary) AS avg_salary
    FROM employees
    GROUP BY dept_id
)
SELECT e.name, e.salary, d.avg_salary
FROM employees e
JOIN dept_avg d ON d.dept_id = e.dept_id
WHERE e.salary > d.avg_salary;
~~~

\`WITH name AS (query)\` defines the CTE; the main statement follows. The CTE exists only for that one statement. You can also name its columns explicitly: \`WITH dept_avg (dept_id, avg_salary) AS (...)\`.

## Why use CTEs

The same logic as a nested subquery:

~~~sql
SELECT e.name, e.salary, d.avg_salary
FROM employees e
JOIN (SELECT dept_id, AVG(salary) AS avg_salary FROM employees GROUP BY dept_id) d
  ON d.dept_id = e.dept_id
WHERE e.salary > d.avg_salary;
~~~

For one level, either is fine. As logic grows, nested subqueries force readers to start in the middle and work outwards. CTEs read top to bottom: each step is named, defined, then used. Names such as \`active_customers\` or \`monthly_revenue\` document intent.

## Chaining CTEs

Several CTEs are separated by commas, and later ones can reference earlier ones:

~~~sql
WITH monthly AS (
    SELECT DATE_TRUNC('month', order_date) AS month, SUM(amount) AS revenue
    FROM orders
    GROUP BY 1
),
with_growth AS (
    SELECT month, revenue,
           revenue - LAG(revenue) OVER (ORDER BY month) AS change
    FROM monthly
)
SELECT month, revenue, change
FROM with_growth
WHERE change < 0
ORDER BY month;
~~~

This builds a pipeline: aggregate by month, compute month-over-month change, then filter to months with declining revenue. Each step can be tested alone by selecting from it, which makes debugging much easier.

## Referencing a CTE more than once

A CTE can be used several times in the main query, which a derived table can't do without repeating it:

~~~sql
WITH dept_stats AS (
    SELECT dept_id, COUNT(*) AS headcount FROM employees GROUP BY dept_id
)
SELECT a.dept_id, a.headcount
FROM dept_stats a
WHERE a.headcount > (SELECT AVG(headcount) FROM dept_stats);
~~~

## How databases execute CTEs

A CTE can be executed in two ways:

- **Inlined**: merged into the main query like a subquery, so the optimizer can push filters into it and use indexes
- **Materialized**: computed once and stored temporarily, then read by the main query

Before version 12, PostgreSQL always materialized CTEs, acting as an **optimization fence**: an outer \`WHERE\` filter couldn't be pushed inside, so a CTE over a big table could be computed in full even when the outer query needed one row. Since PostgreSQL 12, CTEs referenced once with no side effects are inlined automatically. You can control it explicitly:

~~~sql
WITH big AS MATERIALIZED (SELECT ...) SELECT ...;
WITH big AS NOT MATERIALIZED (SELECT ...) SELECT ...;
~~~

Materializing helps when a CTE is expensive and referenced several times. MySQL 8 and SQLite also decide between merging and materializing. When performance matters, check the plan with \`EXPLAIN\`.

## Support across databases

CTEs are part of SQL:1999. PostgreSQL, SQL Server, Oracle and SQLite (since 3.8.3) have long supported them; MySQL added them in version 8.0. Code targeting MySQL 5.7 must use derived tables instead.

## CTEs, subqueries, views and temporary tables

| Tool | Lifetime | Reusable across statements | Notes |
|---|---|---|---|
| Subquery | One place in one query | No | Fine for short logic |
| CTE | One statement | No, but reusable within the statement | Readable pipelines; recursion |
| View | Permanent | Yes | Shared logic for many queries and users |
| Temporary table | Session | Yes, within the session | Can be indexed; good for multi-statement processing |

For a multi-step data job running several statements, a temporary table with an index may outperform repeating a CTE in each statement.

## Data-modifying CTEs

PostgreSQL allows \`INSERT\`, \`UPDATE\` and \`DELETE\` inside a \`WITH\` clause, combined with \`RETURNING\`, which enables atomic multi-step operations:

~~~sql
WITH archived AS (
    DELETE FROM orders
    WHERE order_date < '2020-01-01'
    RETURNING *
)
INSERT INTO orders_archive
SELECT * FROM archived;
~~~

This moves old orders to an archive table in one statement: the deleted rows flow directly into the insert. All sub-statements see the same snapshot of the data, so a data-modifying CTE doesn't see changes made by its sibling CTEs. MySQL and SQLite don't support data-modifying CTEs.

## CTEs and readability in interviews

In interviews, CTEs make multi-step answers clear: "first I'll compute each customer's total, then rank customers within each city, then keep the top three". Writing each step as a named CTE shows structured thinking and lets you check each step as you go.

## How interviewers test this

Expect multi-step problems where CTEs help, such as "employees earning above their department average" or "months where revenue declined", plus "CTE versus subquery?" Use CTEs to name steps, explain that they exist for one statement only, and mention materialization and the PostgreSQL 12 change for depth.`,
    sources: [PG_QUERIES, SQLITE_LANG, MODERN_SQL]
  },

  "recursive-ctes": {
    theory: `A recursive CTE refers to itself, letting SQL walk hierarchies and generate sequences of any length: an organization chart, a category tree, a bill of materials, or every date in a range. It works by repeatedly applying a step to the previous step's results until no new rows appear. This lesson explains the anchor and recursive parts, how evaluation proceeds, hierarchy traversal with depth and paths, generating sequences, and preventing infinite loops.

## The structure

A recursive CTE has two parts joined by \`UNION ALL\`:

~~~sql
WITH RECURSIVE numbers AS (
    SELECT 1 AS n                 -- anchor: the starting rows
    UNION ALL
    SELECT n + 1 FROM numbers     -- recursive part: builds on previous rows
    WHERE n < 10                  -- termination condition
)
SELECT n FROM numbers;
~~~

This returns the numbers 1 to 10. PostgreSQL, MySQL and SQLite require the \`RECURSIVE\` keyword; SQL Server and Oracle omit it.

## How evaluation works

Despite the name, evaluation is iterative:

1. Run the anchor query. Its rows form the first working set and go into the result
2. Run the recursive part, where the CTE's name refers only to the **previous** working set, not the whole result
3. Add the new rows to the result; they become the next working set
4. Repeat until the recursive part produces no rows

In the example, the working set goes \`{1}\`, \`{2}\`, ..., \`{10}\`. When n is 10, the condition \`n < 10\` produces nothing, and evaluation stops.

## Walking a hierarchy

The most common use is an employee hierarchy, where \`manager_id\` references \`employees.id\`. To find everyone who reports, directly or indirectly, to employee 1:

~~~sql
WITH RECURSIVE reports AS (
    SELECT id, name, manager_id, 1 AS depth
    FROM employees
    WHERE manager_id = 1                       -- direct reports
    UNION ALL
    SELECT e.id, e.name, e.manager_id, r.depth + 1
    FROM employees e
    JOIN reports r ON e.manager_id = r.id      -- reports of reports
)
SELECT id, name, depth FROM reports ORDER BY depth, name;
~~~

The anchor finds direct reports. Each iteration joins employees to the previous level, finding the next level down. The \`depth\` column counts levels. A self-join can only reach a fixed number of levels; the recursive CTE handles any depth.

## Walking upward

Reversing the join climbs from an employee to the top of the chain:

~~~sql
WITH RECURSIVE chain AS (
    SELECT id, name, manager_id FROM employees WHERE id = 42
    UNION ALL
    SELECT e.id, e.name, e.manager_id
    FROM employees e
    JOIN chain c ON e.id = c.manager_id
)
SELECT name FROM chain;
~~~

This lists employee 42, their manager, their manager's manager, and so on up to the CEO, whose NULL \`manager_id\` matches nothing and ends the recursion.

## Building paths

Carrying a path string through the recursion shows each row's position in the tree and gives a natural sort order:

~~~sql
WITH RECURSIVE tree AS (
    SELECT id, name, CAST(name AS VARCHAR(1000)) AS path
    FROM categories WHERE parent_id IS NULL
    UNION ALL
    SELECT c.id, c.name, CAST(t.path || ' > ' || c.name AS VARCHAR(1000))
    FROM categories c
    JOIN tree t ON c.parent_id = t.id
)
SELECT path FROM tree ORDER BY path;
~~~

Output looks like \`Electronics > Computers > Laptops\`. The \`CAST\` matters: column types are fixed by the anchor, so without widening the anchor's type, longer paths can be truncated or fail. MySQL needs \`CONCAT\` instead of \`||\`.

## Generating sequences

Recursive CTEs generate rows that don't exist in any table, such as every date in a month, for reports that must show zero for days without sales:

~~~sql
WITH RECURSIVE days AS (
    SELECT DATE '2024-03-01' AS d
    UNION ALL
    SELECT d + 1 FROM days WHERE d < DATE '2024-03-31'
)
SELECT days.d, COALESCE(SUM(o.amount), 0) AS revenue
FROM days
LEFT JOIN orders o ON o.order_date = days.d
GROUP BY days.d
ORDER BY days.d;
~~~

PostgreSQL's \`generate_series\` function does the same more concisely, but the recursive CTE works in MySQL 8 and SQLite too. Date arithmetic syntax varies: \`d + INTERVAL 1 DAY\` in MySQL, \`date(d, '+1 day')\` in SQLite.

## Preventing infinite loops

If the recursive part keeps producing rows, the query never ends. Causes include a missing termination condition and cycles in the data, such as employee A managing B while B manages A. Defences:

- always include a condition that eventually produces no rows, such as \`WHERE depth < 20\`
- track visited IDs and stop on repeats: in PostgreSQL, keep an array of visited IDs and add \`WHERE NOT e.id = ANY(r.visited)\`
- use built-in protection: MySQL stops after \`cte_max_recursion_depth\` iterations (1,000 by default), and SQL Server's default limit is 100, adjustable with \`OPTION (MAXRECURSION n)\`
- PostgreSQL 14 added a standard \`CYCLE\` clause that detects cycles automatically

## UNION versus UNION ALL

\`UNION ALL\` keeps every row and is the usual choice. \`UNION\` removes duplicates at each step, which can stop recursion over cyclic graphs when the same rows recur, but it costs a duplicate check on every iteration and doesn't help when rows differ only in a depth or path column.

## Performance

Each iteration runs a join between the table and the previous level. An index on the join column, such as \`employees (manager_id)\`, keeps each step fast. Deep or wide hierarchies produce many rows, so filter what you need early. For hierarchies queried constantly, alternative models such as materialized paths or closure tables store ancestry directly, trading write complexity for faster reads.

## How interviewers test this

Expect "find all subordinates of a manager", "list the chain of command above an employee", "generate dates for a month" and "What stops a recursive CTE?" Describe the anchor and recursive parts and the iteration model, track depth, explain termination, and mention cycle protection.`,
    sources: [PG_QUERIES, SQLITE_LANG, MODERN_SQL]
  },

  "window-functions-ranking": {
    theory: `Window functions compute a value for each row using a set of related rows, called the window, without collapsing rows the way \`GROUP BY\` does. Ranking functions are the most used: they number rows, rank them with or without gaps, and split them into buckets. This lesson explains the \`OVER\` clause with \`PARTITION BY\` and \`ORDER BY\`, the differences between \`ROW_NUMBER\`, \`RANK\` and \`DENSE_RANK\`, \`NTILE\` and percentile ranks, and the top-N-per-group pattern.

## Window functions versus GROUP BY

\`GROUP BY\` returns one row per group. A window function keeps every row and adds a computed column:

~~~sql
SELECT name, dept_id, salary,
       AVG(salary) OVER (PARTITION BY dept_id) AS dept_avg
FROM employees;
~~~

Every employee row remains, now showing their department's average beside their own salary. That's impossible with \`GROUP BY\` alone, which would lose the individual rows.

## The OVER clause

\`OVER\` defines the window:

- **PARTITION BY** splits rows into independent groups; the function restarts in each partition. Without it, the whole result is one partition
- **ORDER BY** orders rows within each partition, which ranking functions need to decide positions

\`ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC)\` numbers employees within each department, from highest salary to lowest.

## ROW_NUMBER, RANK and DENSE_RANK

The three ranking functions differ only in how they handle ties. For salaries 90,000, 80,000, 80,000 and 70,000:

| salary | ROW_NUMBER | RANK | DENSE_RANK |
|---|---|---|---|
| 90,000 | 1 | 1 | 1 |
| 80,000 | 2 | 2 | 2 |
| 80,000 | 3 | 2 | 2 |
| 70,000 | 4 | 4 | 3 |

- **ROW_NUMBER** gives every row a unique number. Tied rows get different numbers in an arbitrary order unless the \`ORDER BY\` breaks the tie
- **RANK** gives tied rows the same rank, then skips: after two rows at rank 2 comes rank 4, as in sports standings
- **DENSE_RANK** gives tied rows the same rank without gaps: after two rows at rank 2 comes rank 3

## Choosing the right one

The choice depends on the question:

- "Exactly one row per group, such as one latest order per customer": \`ROW_NUMBER\`, with a tiebreaker such as \`id\` for determinism
- "The third highest distinct salary": \`DENSE_RANK\`, since tied salaries count as one value
- "Competition-style ranks, where two people tied for second push the next person to fourth": \`RANK\`

Many interview mistakes come from using \`ROW_NUMBER\` where ties should share a rank, or \`RANK\` where the question asks about distinct values.

## Top N per group

The most important window function pattern returns the top rows in each group:

~~~sql
WITH ranked AS (
    SELECT name, dept_id, salary,
           DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rnk
    FROM employees
)
SELECT name, dept_id, salary
FROM ranked
WHERE rnk <= 3;
~~~

Window functions are computed after \`WHERE\`, so you can't filter on them directly; the CTE computes the ranks first. With \`DENSE_RANK\`, ties at third place all appear. With \`ROW_NUMBER\`, you get exactly three rows per department.

## Deduplication with ROW_NUMBER

\`ROW_NUMBER\` also removes duplicates while keeping one chosen copy:

~~~sql
WITH numbered AS (
    SELECT id, email,
           ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at) AS rn
    FROM users
)
DELETE FROM users WHERE id IN (SELECT id FROM numbered WHERE rn > 1);
~~~

This keeps the earliest account for each email and deletes the rest.

## NTILE

\`NTILE(n)\` divides each partition's ordered rows into n buckets of nearly equal size, numbered 1 to n:

~~~sql
SELECT name, salary,
       NTILE(4) OVER (ORDER BY salary DESC) AS quartile
FROM employees;
~~~

Quartile 1 holds the top 25% of earners. When rows don't divide evenly, earlier buckets get one extra row: ten rows into four buckets gives sizes 3, 3, 2 and 2. Ties may be split across buckets, since \`NTILE\` only counts rows.

## Percentile ranks

\`PERCENT_RANK()\` returns a row's relative position from 0 to 1, computed as (rank − 1) / (rows − 1). \`CUME_DIST()\` returns the fraction of rows with values at or below the current row. They answer questions such as "what percentile is this student's score in?"

## Ordering inside and outside the window

The \`ORDER BY\` inside \`OVER\` only controls how the window is computed. It doesn't sort the final result. Add an outer \`ORDER BY\` to sort the output. Different window functions in one query can use different partitions and orders.

## Named windows

When several functions share a window, define it once:

~~~sql
SELECT name, salary,
       ROW_NUMBER() OVER w AS rn,
       RANK() OVER w AS rnk
FROM employees
WINDOW w AS (PARTITION BY dept_id ORDER BY salary DESC);
~~~

PostgreSQL, MySQL 8 and SQLite support the \`WINDOW\` clause.

## Support and performance

Window functions arrived in SQL:2003. PostgreSQL, SQL Server and Oracle have supported them for years; MySQL added them in 8.0 and SQLite in 3.25. Computing a window requires sorting rows by the partition and order columns, so an index matching \`(dept_id, salary)\` can avoid a separate sort.

## How interviewers test this

Expect "ROW_NUMBER versus RANK versus DENSE_RANK", "top 3 salaries per department", "Nth highest salary" and "remove duplicate rows keeping one". Show the tie table, pick the function that matches the question's treatment of ties, filter through a CTE, and add a tiebreaker for deterministic ROW_NUMBER results.`,
    sources: [PG_WINDOW, SQLITE_LANG, MODERN_SQL]
  },

  "window-functions-analytics": {
    theory: `Analytic window functions compute running totals, moving averages, comparisons with previous rows and shares of a total, all while keeping every row. They replace slow self-joins and correlated subqueries with a single pass over the data. This lesson explains aggregate window functions, frames with \`ROWS\` and \`RANGE\`, \`LAG\` and \`LEAD\`, \`FIRST_VALUE\` and \`LAST_VALUE\`, and percent-of-total calculations.

## Aggregates as window functions

Any aggregate becomes a window function when followed by \`OVER\`:

~~~sql
SELECT name, dept_id, salary,
       SUM(salary) OVER (PARTITION BY dept_id) AS dept_payroll,
       COUNT(*)    OVER (PARTITION BY dept_id) AS dept_size
FROM employees;
~~~

Without \`ORDER BY\` in the window, the aggregate covers the whole partition, so every row in a department shows the same payroll.

## Running totals

Adding \`ORDER BY\` changes the meaning: the aggregate covers rows from the start of the partition up to the current row:

~~~sql
SELECT order_date, amount,
       SUM(amount) OVER (ORDER BY order_date) AS running_total
FROM daily_sales;
~~~

Each row shows the cumulative total up to that date. With \`PARTITION BY region\`, the running total restarts for each region. The older alternative, a self-join on \`b.order_date <= a.order_date\`, costs O(n²); the window version is a single sorted pass.

## Frames

The **frame** specifies exactly which rows around the current row the function uses:

~~~sql
AVG(amount) OVER (ORDER BY order_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)
~~~

This is a 7-day moving average: the current row plus the six before it. Frame boundaries include:

| Boundary | Meaning |
|---|---|
| \`UNBOUNDED PRECEDING\` | The first row of the partition |
| \`n PRECEDING\` | n rows (or values) before the current row |
| \`CURRENT ROW\` | The current row |
| \`n FOLLOWING\` | n rows after |
| \`UNBOUNDED FOLLOWING\` | The last row of the partition |

## ROWS versus RANGE

Frames come in two main types:

- **ROWS** counts physical rows: \`ROWS BETWEEN 2 PRECEDING AND CURRENT ROW\` means exactly three rows
- **RANGE** uses values of the \`ORDER BY\` column: rows with equal values are treated as peers and included together

The default frame, when \`ORDER BY\` is present, is \`RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\`. This surprises people: if two orders share the same date, both rows show the running total including **both** orders, because they're peers. For a strictly row-by-row running total, specify \`ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW\`, or add a tiebreaker column to the \`ORDER BY\`.

\`ROWS\` frames over gaps in data can also mislead: "6 preceding rows" covers more than a week if some days have no rows. PostgreSQL 11+ supports value-based ranges such as \`RANGE BETWEEN INTERVAL '6 days' PRECEDING AND CURRENT ROW\`, which respects calendar time.

## LAG and LEAD

\`LAG\` reads a value from a previous row, and \`LEAD\` from a following row, in the window's order:

~~~sql
SELECT month, revenue,
       LAG(revenue) OVER (ORDER BY month) AS prev_revenue,
       revenue - LAG(revenue) OVER (ORDER BY month) AS change,
       ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))
             / NULLIF(LAG(revenue) OVER (ORDER BY month), 0), 1) AS pct_change
FROM monthly_revenue;
~~~

The first row has no previous row, so \`LAG\` returns NULL. Optional arguments set the offset and a default: \`LAG(revenue, 12, 0)\` reads the value from 12 rows back, such as the same month last year, using 0 when none exists. \`LAG\` and \`LEAD\` ignore frames; they always count rows within the partition.

Common uses:

- month-over-month or year-over-year growth
- time between consecutive events: \`login_time - LAG(login_time) OVER (PARTITION BY user_id ORDER BY login_time)\`
- detecting changes: rows where \`status <> LAG(status)\`

## FIRST_VALUE, LAST_VALUE and NTH_VALUE

These return a value from a specific position in the frame:

~~~sql
SELECT name, dept_id, salary,
       FIRST_VALUE(name) OVER (PARTITION BY dept_id ORDER BY salary DESC) AS top_earner
FROM employees;
~~~

\`LAST_VALUE\` has a well-known trap. With the default frame ending at the current row, the "last" value is the current row itself. To get the true last value in the partition, extend the frame:

~~~sql
LAST_VALUE(name) OVER (
    PARTITION BY dept_id ORDER BY salary DESC
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
)
~~~

\`NTH_VALUE(name, 2)\` returns the second value in the frame, with the same caveat.

## Percent of total

Dividing a row's value by a window total gives its share:

~~~sql
SELECT dept_id, name, salary,
       ROUND(100.0 * salary / SUM(salary) OVER (PARTITION BY dept_id), 2) AS pct_of_dept
FROM employees;
~~~

The same pattern computes market share, a product's share of category revenue, and cumulative percentages for Pareto analysis: \`SUM(revenue) OVER (ORDER BY revenue DESC) / SUM(revenue) OVER ()\` shows how quickly the top products add up to 80% of sales. An empty \`OVER ()\` means the whole result.

## Combining windows with grouping

Window functions run after \`GROUP BY\`, so they can operate on aggregated results:

~~~sql
SELECT dept_id, SUM(salary) AS payroll,
       RANK() OVER (ORDER BY SUM(salary) DESC) AS payroll_rank
FROM employees
GROUP BY dept_id;
~~~

This ranks departments by total payroll in one query.

## Performance

Each distinct window specification may need its own sort. Queries with several different \`PARTITION BY\` and \`ORDER BY\` combinations sort the data several times. Reusing the same window, through a \`WINDOW\` clause, lets the database share the work, and an index matching the window's columns can avoid sorting altogether.

## How interviewers test this

Expect running totals, 7-day moving averages, month-over-month growth with LAG, percent of total, and "time since previous event". Know the default RANGE frame and its effect with ties, the LAST_VALUE frame trap, how LAG handles the first row, and why windows replace self-joins for these problems.`,
    sources: [PG_WINDOW, SQLITE_LANG, MODERN_SQL]
  },

  "set-operations": {
    theory: `Set operations combine the results of two or more queries vertically: stacking rows from one result on top of another, or comparing them. \`UNION\` combines, \`INTERSECT\` finds common rows, and \`EXCEPT\` finds rows in one result but not another. They're the SQL version of set union, intersection and difference from mathematics. This lesson explains each operation, the rules for compatible queries, \`UNION\` versus \`UNION ALL\`, duplicate and NULL handling, and how set operations compare with joins.

## Joins versus set operations

Joins combine tables **horizontally**: they add columns by matching rows. Set operations combine results **vertically**: they add or compare rows with the same columns. Use a join when you need data from related tables side by side; use a set operation when you have similar rows from different sources.

## UNION and UNION ALL

\`UNION ALL\` stacks two results, keeping every row:

~~~sql
SELECT name, email, 'employee' AS source FROM employees
UNION ALL
SELECT name, email, 'contractor' FROM contractors;
~~~

\`UNION\` does the same but removes duplicate rows from the combined result.

| | UNION | UNION ALL |
|---|---|---|
| Duplicates | Removed | Kept |
| Cost | Extra sort or hash to deduplicate | No extra work |
| Use when | Duplicates must be eliminated | Sources don't overlap, or duplicates are meaningful |

Default to \`UNION ALL\`. Deduplication costs time on large results, and when sources can't overlap, such as different years of orders, it's pure waste. Use \`UNION\` only when you need unique rows. Adding a constant column, like \`source\` above, labels each row's origin, and also means rows from different sources never count as duplicates.

## Compatibility rules

Queries combined with set operations must be compatible:

- **the same number of columns**
- **compatible types** in each position: you can't combine a number column with a date column without casting
- **column names come from the first query**; aliases in later queries are ignored

Columns are matched by position, not name. If the first query selects \`name, email\` and the second selects \`email, name\`, the values are combined into the wrong columns without any error, as long as the types are compatible. List columns explicitly and in the same order.

## Sorting combined results

\`ORDER BY\` applies to the whole combined result and goes at the end, after the last query:

~~~sql
SELECT name, hire_date FROM employees
UNION ALL
SELECT name, start_date FROM contractors
ORDER BY hire_date DESC;
~~~

It refers to column names from the first query, or positions. To sort or limit an individual branch, wrap it in parentheses or a subquery.

## INTERSECT

\`INTERSECT\` returns rows present in both results:

~~~sql
-- customers who bought in both 2023 and 2024
SELECT customer_id FROM orders WHERE EXTRACT(YEAR FROM order_date) = 2023
INTERSECT
SELECT customer_id FROM orders WHERE EXTRACT(YEAR FROM order_date) = 2024;
~~~

It removes duplicates by default. \`INTERSECT ALL\` keeps duplicates up to the smaller count, supported in PostgreSQL. The same question can be answered with \`EXISTS\` or a join with \`DISTINCT\`; \`INTERSECT\` often states it most directly. MySQL added \`INTERSECT\` and \`EXCEPT\` in version 8.0.31, so older MySQL versions need the \`EXISTS\` form.

## EXCEPT

\`EXCEPT\` returns rows in the first result that aren't in the second:

~~~sql
-- customers who bought in 2023 but not in 2024 (churned)
SELECT customer_id FROM orders WHERE EXTRACT(YEAR FROM order_date) = 2023
EXCEPT
SELECT customer_id FROM orders WHERE EXTRACT(YEAR FROM order_date) = 2024;
~~~

Oracle calls it \`MINUS\`. Order matters: \`A EXCEPT B\` differs from \`B EXCEPT A\`. Like \`UNION\` and \`INTERSECT\`, it removes duplicates unless written \`EXCEPT ALL\`.

## NULL in set operations

Set operations treat NULLs as equal to each other when comparing rows, unlike \`=\` in a \`WHERE\` clause. Two rows \`(1, NULL)\` are duplicates for \`UNION\`, match for \`INTERSECT\`, and cancel out in \`EXCEPT\`. This makes \`EXCEPT\` a reliable way to compare whole rows that contain NULLs, where \`NOT IN\` would fail.

## Comparing two tables

\`EXCEPT\` in both directions finds every difference between two tables with the same structure, which is useful for verifying data migrations or test results:

~~~sql
(SELECT * FROM expected_results EXCEPT SELECT * FROM actual_results)
UNION ALL
(SELECT * FROM actual_results EXCEPT SELECT * FROM expected_results);
~~~

An empty result means the tables contain the same rows, ignoring duplicate counts.

## Precedence

\`INTERSECT\` binds more tightly than \`UNION\` and \`EXCEPT\`, which are evaluated left to right. \`A UNION B INTERSECT C\` means \`A UNION (B INTERSECT C)\`. Use parentheses whenever you mix operations.

## Practical uses

| Task | Operation |
|---|---|
| Combine current and archived records | \`UNION ALL\` |
| Merge contact lists, removing duplicates | \`UNION\` |
| Customers active in both periods | \`INTERSECT\` |
| Churned customers, missing records | \`EXCEPT\` |
| Emulate a full outer join in MySQL | \`UNION ALL\` of a left join and unmatched right rows |
| Build rows from constants | \`SELECT 'A' UNION ALL SELECT 'B'\` |

## Performance

\`UNION ALL\` is cheap: it streams one result after another. \`UNION\`, \`INTERSECT\` and \`EXCEPT\` must compare rows, using a sort or hash, which costs memory and time on large results. When equivalent \`EXISTS\` or \`NOT EXISTS\` queries can use indexes on the comparison columns, they may be faster. Check plans for large datasets.

## How interviewers test this

Expect "UNION versus UNION ALL", "customers who ordered in one year but not the next", "customers active in both months" and "join versus union". Explain duplicate removal and its cost, the column count and type rules, positional matching, and the NULL behaviour that makes EXCEPT useful for comparing tables.`,
    sources: [PG_QUERIES, SQLITE_LANG, MODERN_SQL]
  }
};
