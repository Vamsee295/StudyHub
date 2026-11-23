// Long-form theory for SQL database basics and SQL basics modules. Original writing.
import { LessonTheory } from './utils';
import { PG_DOCS, PG_QUERIES, PG_DDL, PG_MVCC, PG_COMPARISON, SQLITE_LANG, SQLITE_QP, CODD_1970, MODERN_SQL } from './sql-theory-sources';

export const sqlBasicsTheory: Record<string, LessonTheory> = {
  "what-is-a-database": {
    theory: `A database is an organized collection of data, and a database management system (DBMS) is the software that stores it, retrieves it and keeps it correct while many users work at once. Before databases, applications kept data in their own files, which led to duplication, inconsistency and lost updates. This lesson explains what goes wrong with flat files, what a DBMS adds, the main kinds of databases in use today, and where SQL fits.

## The flat-file approach

Imagine a college keeping student records in spreadsheets: one file for admissions, another for the library, another for fees. Each office maintains its own copy of each student's name, phone number and address. Problems follow quickly:

- **Redundancy**: the same facts are stored many times, wasting space
- **Inconsistency**: when a student changes their phone number, one office updates it and others don't, so the files disagree
- **Hard queries**: answering "which students with unpaid fees borrowed library books?" means writing a custom program to cross-reference files
- **No concurrency control**: two clerks editing the same file at once can overwrite each other's changes
- **Weak security**: file permissions are all-or-nothing, so you can't let the library see names without also seeing fee records
- **No recovery**: a crash in the middle of saving can leave a file half-written

## What a DBMS provides

A DBMS solves these problems by putting all access to the data through one system:

| Problem with files | What the DBMS does |
|---|---|
| Redundancy and inconsistency | Stores each fact once, with constraints that reject invalid data |
| Hard queries | Offers a query language, SQL, that answers new questions without new programs |
| Concurrent edits | Uses transactions and locking so simultaneous users don't corrupt data |
| Security | Grants permissions per table, column or action |
| Crashes | Logs changes so it can recover to a consistent state |

## Data independence

A key benefit is **data independence**: applications describe what data they want, not how it's stored. The DBMS can add an index, move data to a faster disk or change file formats without any application changing. This separation, between the logical view of data and its physical storage, is one of the main reasons databases replaced hand-written file code.

## The three-schema architecture

Databases separate three levels of description:

- **External level**: the views different users see, such as a library view that shows names and borrowed books only
- **Conceptual level**: the full logical structure, meaning all tables, columns and relationships
- **Internal level**: how data is physically stored, including files, pages and indexes

Changes at one level shouldn't force changes at the levels above it.

## Kinds of databases

Relational databases dominate, but other models serve particular needs:

| Type | Data model | Examples | Typical use |
|---|---|---|---|
| Relational | Tables with rows and columns | PostgreSQL, MySQL, SQLite, Oracle, SQL Server | Business data, transactions, most applications |
| Document | JSON-like documents | MongoDB, Couchbase | Flexible or nested records |
| Key-value | Keys mapped to values | Redis, DynamoDB | Caching, sessions, fast lookups |
| Wide-column | Rows with flexible column families | Cassandra, HBase | Massive write-heavy workloads |
| Graph | Nodes and edges | Neo4j | Social networks, recommendations |

Non-relational systems are often grouped as **NoSQL**. Many trade some of the guarantees relational databases give, such as strict consistency or joins, for easier horizontal scaling or a more flexible schema. In practice, most companies use a relational database as their main system of record, and add others for specific jobs.

## Where SQL fits

SQL, the Structured Query Language, is the standard language for relational databases. It's **declarative**: you describe the result you want, and the DBMS's query optimizer decides how to compute it, such as which index to use or in which order to join tables. Compare writing a loop that scans files and merges records with writing one line:

~~~sql
SELECT name FROM students WHERE fees_due > 0;
~~~

SQL was developed at IBM in the 1970s and became an ANSI standard in 1986. It remains one of the most widely used programming languages, and nearly every backend, data or analyst role expects it.

## Database, DBMS and database system

These terms are often mixed up:

- **Database**: the data itself
- **DBMS**: the software managing it, such as PostgreSQL
- **Database system**: the DBMS together with its databases and the applications using them

## How interviewers test this

Expect "What is a DBMS and why use one instead of files?" and "SQL versus NoSQL?" List the file-system problems (redundancy, inconsistency, concurrency, security, recovery), explain data independence, and compare relational and non-relational databases by data model and scaling trade-offs rather than declaring one better.`,
    sources: [PG_DOCS, SQLITE_LANG, CODD_1970]
  },

  "relational-model-and-rdbms": {
    theory: `The relational model, proposed by Edgar F. Codd at IBM in 1970, represents all data as relations: tables of rows and columns, connected by values rather than by pointers. Its mathematical foundation, set theory and logic, is what makes SQL possible and why relational databases still dominate more than fifty years later. This lesson explains relations, tuples and attributes, the properties that make a table a relation, relational algebra, and Codd's idea of a fully relational system.

## Before the relational model

Earlier databases used hierarchical and network models, where records were linked by physical pointers. To find data, programs navigated those links step by step. If the structure changed, programs broke. Codd's insight was that data should be accessed by its values alone, with the system handling how to find it. That separation of logical structure from physical storage is the relational model's core contribution.

## Relations, tuples and attributes

The model uses mathematical terms that map onto familiar ones:

| Formal term | Common term | Meaning |
|---|---|---|
| Relation | Table | A set of tuples sharing the same attributes |
| Tuple | Row | One record |
| Attribute | Column | A named property of each tuple |
| Domain | Data type | The set of allowed values for an attribute |
| Degree | Number of columns | How many attributes a relation has |
| Cardinality | Number of rows | How many tuples a relation has |

A relation's **schema** names it and lists its attributes and domains, such as \`employees(id, name, dept_id, salary)\`.

## Properties of a relation

A true relation has properties that follow from being a set:

- **No duplicate tuples**: a set can't contain the same element twice, so every row must be distinguishable, which is why every relation has a key
- **No inherent row order**: sets are unordered, so a query without \`ORDER BY\` can return rows in any order
- **No inherent column order**: attributes are identified by name, not position
- **Atomic values**: each cell holds a single value from its domain, not a list or nested table, which is first normal form

SQL tables relax some of these. A table without a primary key can contain duplicate rows, and \`SELECT\` returns duplicates unless you add \`DISTINCT\`. Knowing where SQL departs from the pure model explains several behaviours that surprise beginners.

## Relationships through values

Relations connect through shared values, not stored links. An employee row stores \`dept_id = 10\`, and the department with \`id = 10\` is found by matching values. A **foreign key** constraint guarantees the referenced value exists. Because connections are values, any relationship can be queried in any direction, including ones the original designers never planned.

## Relational algebra

Relational algebra is the set of operations on relations that underlies SQL. Each operation takes relations as input and produces a relation as output, so operations combine freely:

| Operation | Symbol | Effect | SQL equivalent |
|---|---|---|---|
| Selection | σ | Keep rows meeting a condition | \`WHERE\` |
| Projection | π | Keep chosen columns | The \`SELECT\` list |
| Union | ∪ | Rows in either relation | \`UNION\` |
| Difference | − | Rows in the first but not the second | \`EXCEPT\` |
| Cartesian product | × | Every pairing of rows | \`CROSS JOIN\` |
| Rename | ρ | Rename a relation or attribute | \`AS\` |
| Join | ⋈ | Product filtered by a matching condition | \`JOIN ... ON\` |

The query optimizer works in these terms. It rewrites your SQL into an algebra expression, then rearranges it into an equivalent but cheaper form, for example by filtering rows before joining instead of after. This rearrangement is safe because algebraic laws guarantee the result doesn't change.

## Closure

Because every operation returns a relation, the output of one query can be the input of another. This property, called **closure**, is why SQL supports subqueries, views and common table expressions: each is a relation that other queries can use as if it were a table.

## Codd's rules

In 1985, Codd published twelve rules (numbered 0 to 12) defining what a fully relational DBMS must do, partly to call out products that added a SQL layer over non-relational storage. Among them:

- **Information rule**: all data is represented as values in tables
- **Guaranteed access**: every value is reachable by table name, primary key and column name
- **Systematic treatment of nulls**: missing information is represented uniformly, independent of data type
- **Physical and logical data independence**: storage changes and many schema changes don't break applications

No commercial product satisfies every rule, but they remain a useful description of what "relational" means.

## RDBMS products

A relational database management system (RDBMS) implements the model. PostgreSQL, MySQL, Oracle Database, Microsoft SQL Server and SQLite are the most widely used. They share the core model and SQL, and differ in features, performance characteristics, licensing and dialect details.

## How interviewers test this

Expect "What is the relational model?", "What's the difference between a relation and a table?" and "What is relational algebra?" Define relations, tuples and attributes, explain why relations have no duplicate rows or ordering, list the core algebra operations with their SQL equivalents, and mention closure as the reason queries compose.`,
    sources: [CODD_1970, PG_DOCS, MODERN_SQL]
  },

  "tables-rows-and-columns": {
    theory: `Tables are where relational data lives. Each table has a structure that changes rarely, the schema, and contents that change constantly, the instance. Designing tables well means choosing columns, data types and constraints that describe the data accurately. This lesson explains schema versus instance, how columns and data types work, how to create and inspect tables, and the design choices that matter most.

## Schema versus instance

A table's **schema** is its definition: the table name, each column's name and data type, and its constraints. The **instance**, or state, is the set of rows it holds at a particular moment.

~~~sql
CREATE TABLE employees (
    id         INTEGER PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    dept_id    INTEGER REFERENCES departments(id),
    salary     NUMERIC(10, 2) CHECK (salary > 0),
    hire_date  DATE NOT NULL
);
~~~

This statement defines the schema. Each \`INSERT\`, \`UPDATE\` and \`DELETE\` changes the instance. Schemas change through \`ALTER TABLE\`, usually as deliberate, versioned migrations, while instances change every second in a busy application. The analogy: the schema is a form's blank template, and the instance is the stack of filled-in forms.

## Rows and columns

A **row** represents one entity or event, such as one employee or one order. A **column** represents one property of every row, such as salary. Every row has a value, possibly \`NULL\`, for every column. Rows have no guaranteed order: a database may return them in insertion order today and a different order after an update or a vacuum, so always use \`ORDER BY\` when order matters.

## Data types

Every column has a data type, which restricts the values it accepts and decides how they're stored and compared. The main families:

| Family | Common types | Notes |
|---|---|---|
| Integers | \`SMALLINT\`, \`INTEGER\`, \`BIGINT\` | Use \`BIGINT\` for IDs that may exceed about 2.1 billion |
| Exact decimals | \`NUMERIC(p, s)\`, \`DECIMAL(p, s)\` | Required for money; p is total digits and s is digits after the point |
| Floating point | \`REAL\`, \`DOUBLE PRECISION\` | Approximate; 0.1 + 0.2 isn't exactly 0.3 |
| Text | \`CHAR(n)\`, \`VARCHAR(n)\`, \`TEXT\` | \`CHAR\` pads with spaces; \`VARCHAR\` enforces a maximum length |
| Date and time | \`DATE\`, \`TIME\`, \`TIMESTAMP\`, \`TIMESTAMPTZ\` | Store times with a time zone when users span zones |
| Boolean | \`BOOLEAN\` | MySQL stores it as a tiny integer |
| Others | \`UUID\`, \`JSON\`, \`JSONB\`, arrays | Vary by database |

Choosing the right type prevents whole classes of bugs. Storing dates as text allows values such as \`'2024-02-30'\` and sorts \`'10/01/2024'\` before \`'9/01/2024'\`. Storing money as floating point causes rounding errors in totals. Storing phone numbers as integers drops leading zeros and breaks on \`+91\`.

## Type systems differ

PostgreSQL enforces types strictly: inserting \`'abc'\` into an \`INTEGER\` column fails. SQLite uses **type affinity**: a column's declared type is a preference, and by default it can store a value of any type in any column. MySQL, depending on its SQL mode, may silently convert or truncate invalid values. Knowing your database's behaviour matters when moving data between systems.

## Inspecting tables

Each database has commands to see a table's structure. PostgreSQL's \`psql\` uses \`\\d employees\`, MySQL uses \`DESCRIBE employees\`, and SQLite uses \`PRAGMA table_info(employees)\`. The SQL standard way, supported by PostgreSQL and MySQL, queries the catalog:

~~~sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'employees';
~~~

## Naming conventions

Consistent naming makes schemas readable. Common conventions: lowercase \`snake_case\` names, which avoid quoting since PostgreSQL folds unquoted identifiers to lowercase; one consistent choice of plural or singular table names; an \`id\` primary key; and foreign keys named after the referenced table, such as \`dept_id\`. Avoid reserved words such as \`order\`, \`user\` or \`group\` as table names, because they need quoting everywhere.

## Design choices

A few habits produce better tables:

- **One table per entity type**: employees and departments are separate tables, not columns in one wide table
- **Atomic columns**: store first and last names separately if you'll sort or search by either; don't store comma-separated lists in a column
- **Constraints as documentation**: \`NOT NULL\`, \`UNIQUE\`, \`CHECK\` and foreign keys state the rules of the data where every application must follow them
- **Narrow over wide**: a table with dozens of mostly empty columns usually hides several entities that belong in separate tables

## Degree and cardinality

The **degree** of a table is its number of columns, and the **cardinality** is its number of rows. The employees table above has degree 5. Its cardinality changes with every insert and delete. The term "cardinality" also describes relationships, such as one-to-many, and the number of distinct values in a column, which affects index usefulness, so use it with context.

## How interviewers test this

Expect "What's the difference between a schema and an instance?" and data type questions such as "CHAR versus VARCHAR?" and "Why not store money as FLOAT?" Explain schema as structure and instance as current data, justify type choices with concrete failure examples, and mention that SQL databases differ in how strictly they enforce types.`,
    sources: [PG_DDL, SQLITE_LANG, PG_DOCS]
  },

  "keys-primary-foreign-candidate": {
    theory: `Keys identify rows and connect tables. A primary key gives every row a unique identity, a foreign key links a row to a row in another table, and candidate keys are all the column sets that could serve as an identity. Getting keys right prevents duplicate records and orphaned references. This lesson defines every kind of key, explains how foreign keys enforce referential integrity, and compares natural and surrogate keys.

## Superkeys

A **superkey** is any set of columns whose values are unique across all rows. In an employees table, \`{id}\` is a superkey, and so is \`{id, name}\`, because adding columns to a unique set keeps it unique. Superkeys can contain unnecessary columns.

## Candidate keys

A **candidate key** is a minimal superkey: no column can be removed without losing uniqueness. If both \`id\` and \`email\` are unique for every employee, then \`{id}\` and \`{email}\` are both candidate keys. \`{id, name}\` isn't, because \`name\` can be removed. A table can have several candidate keys, and each could serve as the primary key.

## Primary keys

The **primary key** is the candidate key chosen as the main identifier. It must be unique and can never be \`NULL\`. Each table has at most one primary key, though it can span several columns:

~~~sql
CREATE TABLE enrollments (
    student_id INTEGER,
    course_id  INTEGER,
    grade      CHAR(2),
    PRIMARY KEY (student_id, course_id)
);
~~~

Here neither column alone is unique, since a student takes many courses and a course has many students, but the pair is. A multi-column key like this is a **composite key**. Most databases automatically create an index on the primary key, which makes lookups by key fast.

## Alternate keys

Candidate keys not chosen as the primary key are **alternate keys**. Enforce them with \`UNIQUE\` constraints. If \`id\` is the primary key, declaring \`email VARCHAR(100) UNIQUE NOT NULL\` keeps emails unique too. Without that constraint, two employees could end up with the same email, and nothing would stop it.

A \`UNIQUE\` column allows \`NULL\` unless also declared \`NOT NULL\`. In PostgreSQL, MySQL and SQLite, multiple \`NULL\` values are allowed in a unique column, because \`NULL\` isn't equal to \`NULL\`. SQL Server allows only one. PostgreSQL 15 added \`UNIQUE NULLS NOT DISTINCT\` to change this behaviour.

## Foreign keys

A **foreign key** is a column, or set of columns, whose values must match a key in another table, called the referenced or parent table:

~~~sql
CREATE TABLE employees (
    id      INTEGER PRIMARY KEY,
    name    VARCHAR(100) NOT NULL,
    dept_id INTEGER REFERENCES departments(id)
);
~~~

Every non-null \`dept_id\` must exist in \`departments.id\`. Inserting an employee with \`dept_id = 99\` when no department 99 exists fails. This guarantee is **referential integrity**: no row references something that doesn't exist. A foreign key can be \`NULL\`, which means "no department yet", unless you declare it \`NOT NULL\`.

The referenced columns must be a primary key or have a unique constraint, so each reference points to exactly one row.

## Referential actions

Foreign keys also decide what happens when a referenced row is deleted or its key is updated:

| Action | On deleting the parent row |
|---|---|
| \`RESTRICT\` / \`NO ACTION\` | Reject the delete while child rows exist (the default) |
| \`CASCADE\` | Delete the child rows too |
| \`SET NULL\` | Set the child's foreign key to \`NULL\` |
| \`SET DEFAULT\` | Set the child's foreign key to its default value |

\`ON DELETE CASCADE\` suits parts that can't exist alone, such as order items when an order is deleted. It's dangerous elsewhere: cascading from departments would silently delete every employee in a deleted department. The same options exist for \`ON UPDATE\`.

## Self-referencing keys

A foreign key can reference its own table. An employees table with a \`manager_id\` column referencing \`employees.id\` models a reporting hierarchy. The top manager has \`manager_id = NULL\`. Self-joins and recursive queries, covered later, query such hierarchies.

## Natural versus surrogate keys

A **natural key** is a real-world attribute that's unique, such as an email address, a national ID or an ISBN. A **surrogate key** is an artificial value with no meaning, such as an auto-incrementing integer or a UUID.

| | Natural key | Surrogate key |
|---|---|---|
| Meaning | Has business meaning | Meaningless |
| Stability | Can change (emails change) | Never changes |
| Size | Often long strings | Compact integer or UUID |
| Uniqueness | May fail in edge cases | Guaranteed by the database |

Most schemas use surrogate primary keys for stability and compact foreign keys, and enforce natural keys with \`UNIQUE\` constraints. Changing a natural primary key means updating every foreign key that references it.

Generate surrogate keys with \`GENERATED ALWAYS AS IDENTITY\` in PostgreSQL (the older \`SERIAL\` also works), \`AUTO_INCREMENT\` in MySQL, or \`INTEGER PRIMARY KEY\` in SQLite. UUIDs suit distributed systems where several servers create rows without coordinating.

## How interviewers test this

Expect "Primary key versus unique key?", "What is a candidate key?", "What is referential integrity?" and "Natural versus surrogate keys?" Build up from superkey to candidate key to primary key, explain foreign keys with a failing insert, describe the referential actions and the danger of cascading deletes, and recommend surrogate primary keys with unique natural keys.`,
    sources: [PG_DDL, SQLITE_LANG, CODD_1970]
  },

  "null-values-and-three-valued-logic": {
    theory: `\`NULL\` represents a missing or unknown value. It isn't zero, and it isn't an empty string. It's the absence of a value, and SQL handles it with three-valued logic, where conditions can be true, false or unknown. NULL causes more SQL bugs than any other feature, because comparisons involving it don't behave like normal values. This lesson explains what NULL means, how three-valued logic works, how NULL affects filters, aggregates and joins, and how to handle it safely.

## What NULL means

NULL can mean several things: the value is unknown (a customer's birthdate wasn't collected), doesn't apply (a manager field for the CEO), or hasn't been set yet (an order's ship date before shipping). SQL uses one marker for all of them. The key rule: NULL isn't a value, so it isn't equal to anything, not even another NULL.

## Comparisons with NULL

Any comparison with NULL produces **UNKNOWN**, not true or false:

~~~sql
SELECT NULL = NULL;    -- NULL (unknown), not TRUE
SELECT NULL <> 5;      -- NULL
SELECT NULL + 10;      -- NULL: arithmetic with NULL gives NULL
~~~

This is why \`WHERE manager_id = NULL\` returns no rows, even when many rows have a NULL manager. The condition is unknown for every row, and \`WHERE\` keeps only rows where the condition is true. To test for NULL, use \`IS NULL\` and \`IS NOT NULL\`:

~~~sql
SELECT name FROM employees WHERE manager_id IS NULL;
~~~

## Three-valued logic

With three truth values, the logical operators follow these rules:

| A | B | A AND B | A OR B |
|---|---|---|---|
| TRUE | UNKNOWN | UNKNOWN | TRUE |
| FALSE | UNKNOWN | FALSE | UNKNOWN |
| UNKNOWN | UNKNOWN | UNKNOWN | UNKNOWN |

\`NOT UNKNOWN\` is \`UNKNOWN\`. The intuition: treat UNKNOWN as "could be either". \`FALSE AND anything\` is false regardless, so \`FALSE AND UNKNOWN\` is false. \`TRUE OR anything\` is true, so \`TRUE OR UNKNOWN\` is true. Otherwise the result stays unknown.

## Filters drop unknown rows

\`WHERE\` and \`HAVING\` keep rows only when the condition is TRUE. Rows where it's FALSE or UNKNOWN are dropped. So these two queries don't partition the table:

~~~sql
SELECT COUNT(*) FROM employees WHERE bonus > 1000;
SELECT COUNT(*) FROM employees WHERE NOT (bonus > 1000);
~~~

Employees with a NULL bonus appear in neither result. To include them, add \`OR bonus IS NULL\` to the second query.

## The NOT IN trap

\`NOT IN\` with a list or subquery containing NULL returns no rows at all:

~~~sql
SELECT name FROM employees
WHERE dept_id NOT IN (SELECT dept_id FROM closed_departments);
~~~

If any \`dept_id\` in \`closed_departments\` is NULL, then \`x NOT IN (1, 2, NULL)\` expands to \`x <> 1 AND x <> 2 AND x <> NULL\`. The last comparison is unknown, so the whole condition is never true. Use \`NOT EXISTS\`, which handles NULL correctly, or filter NULLs out of the subquery. This trap appears in interviews because it's subtle and causes silently wrong results.

## NULL in aggregates

Aggregate functions skip NULL values, except \`COUNT(*)\`:

| Expression | Behaviour |
|---|---|
| \`COUNT(*)\` | Counts all rows, including those with NULLs |
| \`COUNT(column)\` | Counts rows where the column isn't NULL |
| \`SUM\`, \`AVG\`, \`MIN\`, \`MAX\` | Ignore NULLs |
| Any aggregate over only NULLs, or no rows | Returns NULL, except \`COUNT\`, which returns 0 |

So \`AVG(bonus)\` averages only employees who have a bonus. If missing bonuses should count as zero, write \`AVG(COALESCE(bonus, 0))\`. The two give different answers, and choosing deliberately matters.

## NULL in other clauses

NULL has special rules elsewhere:

- **GROUP BY** treats all NULLs as one group, even though NULL doesn't equal NULL
- **DISTINCT** treats NULLs as duplicates of each other
- **ORDER BY** places NULLs first or last depending on the database: PostgreSQL and Oracle sort them as larger than any value, while MySQL, SQLite and SQL Server sort them as smaller. Use \`NULLS FIRST\` or \`NULLS LAST\` where supported to be explicit
- **Joins** never match NULL keys: a row with a NULL foreign key doesn't join to anything in an inner join
- **UNIQUE constraints** usually allow many NULLs, since they aren't equal to each other

## Handling NULL

SQL offers tools to work with NULL explicitly:

- \`COALESCE(a, b, c)\` returns the first non-NULL argument; \`COALESCE(phone, 'not provided')\` substitutes a default
- \`NULLIF(a, b)\` returns NULL if a equals b; \`total / NULLIF(count, 0)\` avoids division by zero
- \`IS DISTINCT FROM\` compares values while treating two NULLs as equal, supported in PostgreSQL and the SQL standard

## Avoiding NULL problems

Declare columns \`NOT NULL\` unless missing values are genuinely possible. Fewer nullable columns mean fewer three-valued surprises. When a column must allow NULL, think through every query's behaviour for those rows, especially \`NOT IN\`, \`AVG\` and negated conditions.

## How interviewers test this

Expect "What does NULL = NULL return?", "COUNT(*) versus COUNT(column)?" and the NOT IN trap. Explain three-valued logic, show why \`= NULL\` returns no rows, describe how aggregates skip NULLs, and recommend \`NOT EXISTS\` over \`NOT IN\` when NULLs might appear.`,
    sources: [PG_COMPARISON, PG_QUERIES, MODERN_SQL]
  },

  "database-constraints": {
    theory: `Constraints are rules the database enforces on every insert, update and delete. They guarantee that invalid data never gets stored, no matter which application, script or person changes the data. Application code can validate input too, but only the database sees every write. This lesson covers the six main constraint types, how to add and name them, when they're checked, and why enforcing rules in the database matters.

## Why constraints belong in the database

A typical company has a web app, a mobile backend, admin scripts, data imports and people running ad-hoc SQL, all writing to the same database. If the rule "salary must be positive" lives only in the web app's code, every other path can break it. A constraint in the database is checked on every write from every source. Constraints also document the data's rules in one place and help the query optimizer: knowing a column is unique or not null can enable faster plans.

## NOT NULL

\`NOT NULL\` requires a value in every row:

~~~sql
name VARCHAR(100) NOT NULL
~~~

It's the most common constraint and the cheapest to check. Make columns \`NOT NULL\` by default, and allow NULL only when a missing value is meaningful.

## UNIQUE

\`UNIQUE\` prevents duplicate values in a column or combination of columns:

~~~sql
email VARCHAR(100) UNIQUE,
UNIQUE (dept_id, name)      -- no two employees with the same name in one department
~~~

Databases enforce uniqueness with an index, so it also speeds up lookups on those columns. Most databases allow multiple NULLs in a unique column.

## PRIMARY KEY

A primary key combines \`UNIQUE\` and \`NOT NULL\`, and marks the table's main identifier. There can be only one per table, possibly spanning several columns. It's typically the target of foreign keys from other tables.

## FOREIGN KEY

A foreign key requires each value to exist in a referenced table's key, enforcing referential integrity:

~~~sql
dept_id INTEGER REFERENCES departments(id) ON DELETE RESTRICT
~~~

It blocks inserting an employee into a nonexistent department and, with \`RESTRICT\`, blocks deleting a department that still has employees. SQLite doesn't enforce foreign keys unless you run \`PRAGMA foreign_keys = ON\` on each connection, a common surprise.

Foreign key columns aren't indexed automatically in PostgreSQL or SQL Server. Without an index, deleting a parent row forces a scan of the child table to check for references, so index foreign keys that see deletes or joins.

## CHECK

\`CHECK\` enforces any condition that can be evaluated on a single row:

~~~sql
salary NUMERIC(10, 2) CHECK (salary > 0),
status VARCHAR(20) CHECK (status IN ('active', 'on_leave', 'terminated')),
CHECK (end_date IS NULL OR end_date >= start_date)
~~~

A check passes when the condition is TRUE or UNKNOWN. So \`CHECK (salary > 0)\` allows a NULL salary, because \`NULL > 0\` is unknown. Combine with \`NOT NULL\` to require a value. MySQL ignored \`CHECK\` constraints entirely before version 8.0.16, parsing them without enforcing them.

Checks can't reference other rows or tables. Rules such as "a department can have at most 50 employees" need triggers or application logic.

## DEFAULT

\`DEFAULT\` isn't strictly a constraint, but it's declared alongside them. It supplies a value when an insert omits the column:

~~~sql
created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
is_active  BOOLEAN NOT NULL DEFAULT TRUE
~~~

Explicitly inserting NULL bypasses the default; the default applies only when the column is left out of the insert.

## Naming constraints

Constraints get generated names unless you name them. Named constraints produce clearer error messages and are easier to drop or modify:

~~~sql
CONSTRAINT chk_salary_positive CHECK (salary > 0),
CONSTRAINT fk_employee_department FOREIGN KEY (dept_id) REFERENCES departments(id)
~~~

An error mentioning \`chk_salary_positive\` tells you what went wrong immediately, while \`employees_check1\` doesn't.

## Adding constraints later

\`ALTER TABLE\` adds constraints to existing tables:

~~~sql
ALTER TABLE employees ADD CONSTRAINT uq_employee_email UNIQUE (email);
~~~

The database checks existing rows first, and the statement fails if any violate the rule, so clean the data before adding the constraint. On large tables, adding a constraint can lock the table while it validates. PostgreSQL's \`NOT VALID\` option adds a check or foreign key for new rows only, then \`VALIDATE CONSTRAINT\` checks old rows later without blocking writes.

## When constraints are checked

By default, constraints are checked after each statement. Some databases, including PostgreSQL, support **deferrable** constraints that are checked at commit instead. That helps when two rows reference each other, or when swapping unique values between rows within one transaction.

## Constraint types at a glance

| Constraint | Guarantees | Scope |
|---|---|---|
| NOT NULL | A value is present | One column |
| UNIQUE | No duplicates | Column or column set |
| PRIMARY KEY | Unique, not null identifier | Column or column set, one per table |
| FOREIGN KEY | The referenced row exists | Across tables |
| CHECK | A row-level condition holds | One row |
| DEFAULT | A value when omitted | One column |

## How interviewers test this

Expect "What constraints does SQL support?", "Primary key versus unique?", "Why enforce rules in the database and not only in the application?" and "Does CHECK allow NULL?" List the six types with examples, explain the multiple-writers argument, and mention details such as CHECK passing on UNKNOWN and SQLite's foreign key pragma.`,
    sources: [PG_DDL, SQLITE_LANG, PG_DOCS]
  },

  "sql-dialects-and-standards": {
    theory: `SQL is an international standard, but no database implements it exactly. PostgreSQL, MySQL, SQLite, Oracle and SQL Server each support most of the standard, leave out parts of it, and add their own extensions. Knowing where they differ saves hours of confusion when switching databases or reading examples online. This lesson explains the standard's history, the most common dialect differences, and how to write SQL that travels well.

## The standard's history

SQL began at IBM in the early 1970s as SEQUEL, a language for the System R research project, and was renamed SQL. Oracle shipped the first commercial SQL database in 1979. The American National Standards Institute (ANSI) standardized SQL in 1986, and the International Organization for Standardization (ISO) adopted it in 1987. Major revisions followed:

| Version | Notable additions |
|---|---|
| SQL-92 | Explicit \`JOIN\` syntax, \`CASE\`, more data types; the baseline most databases share |
| SQL:1999 | Recursive queries, triggers, Boolean type |
| SQL:2003 | Window functions, \`MERGE\`, identity columns |
| SQL:2008 | \`FETCH FIRST\` for limiting rows, \`TRUNCATE\` |
| SQL:2011 | Temporal tables for tracking history |
| SQL:2016 | JSON functions, row pattern matching |
| SQL:2023 | Property graph queries, more JSON features |

The core of SELECT, INSERT, UPDATE, DELETE, joins, grouping and subqueries works almost everywhere. Differences appear in the details.

## Limiting rows

Returning the first n rows is the most visible difference:

| Database | Syntax |
|---|---|
| PostgreSQL, MySQL, SQLite | \`LIMIT 10 OFFSET 20\` |
| SQL Server | \`SELECT TOP 10 ...\`, or \`OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY\` |
| Oracle (12c and later) and the standard | \`OFFSET 20 ROWS FETCH FIRST 10 ROWS ONLY\` |

PostgreSQL also accepts the standard \`FETCH FIRST\` form.

## Auto-generated IDs

Each database generates surrogate keys differently: PostgreSQL uses \`GENERATED ALWAYS AS IDENTITY\` or the older \`SERIAL\`, MySQL uses \`AUTO_INCREMENT\`, SQLite uses \`INTEGER PRIMARY KEY\` (with the optional \`AUTOINCREMENT\` keyword), SQL Server uses \`IDENTITY(1,1)\`, and Oracle uses identity columns or sequences.

## String handling

Strings show several differences:

- **Concatenation**: the standard \`||\` operator works in PostgreSQL, SQLite and Oracle. MySQL treats \`||\` as logical OR by default and uses \`CONCAT()\`; SQL Server uses \`+\` or \`CONCAT()\`
- **Quoting**: single quotes mark strings everywhere. Double quotes mark identifiers in the standard, PostgreSQL, SQLite and Oracle; MySQL uses backticks for identifiers, and SQL Server uses square brackets
- **Case sensitivity**: MySQL and SQL Server compare strings case-insensitively by default, depending on collation, while PostgreSQL compares them case-sensitively. \`WHERE name = 'alice'\` matches \`'Alice'\` in MySQL but not PostgreSQL. PostgreSQL offers \`ILIKE\` for case-insensitive pattern matching
- **Empty strings**: Oracle treats an empty string as NULL, unlike every other major database

## Dates and functions

Date functions vary more than anything else. The current date is \`CURRENT_DATE\` in most databases, \`GETDATE()\` in SQL Server and \`SYSDATE\` in Oracle. Extracting parts, adding intervals and formatting dates use different function names in nearly every system. SQLite has no date type at all; it stores dates as text, real or integer values and provides functions such as \`date()\` and \`strftime()\`.

## Upserts

Inserting a row or updating it if it exists is also non-standard in practice:

| Database | Syntax |
|---|---|
| PostgreSQL, SQLite | \`INSERT ... ON CONFLICT (key) DO UPDATE SET ...\` |
| MySQL | \`INSERT ... ON DUPLICATE KEY UPDATE ...\` |
| SQL Server, Oracle, standard | \`MERGE INTO ... USING ... WHEN MATCHED ... WHEN NOT MATCHED ...\` |

PostgreSQL 15 added \`MERGE\` as well.

## Feature support

Some features arrived late or remain missing in certain systems. MySQL gained window functions and common table expressions only in version 8.0 (2018). MySQL doesn't support \`FULL OUTER JOIN\`; you emulate it with a \`UNION\` of left and right joins. SQLite added \`RIGHT JOIN\` and \`FULL JOIN\` only in version 3.39 (2022). Before writing an answer that uses an advanced feature, know which database it targets.

## Procedural extensions

Each major database has its own procedural language for stored procedures and functions: PL/pgSQL for PostgreSQL, T-SQL for SQL Server, PL/SQL for Oracle, and MySQL's stored procedure syntax. These differ more than plain SQL does, and code written in one rarely runs on another without rewriting.

## Writing portable SQL

To keep SQL portable:

- prefer standard syntax such as \`CASE\`, \`COALESCE\`, explicit \`JOIN ... ON\` and \`CURRENT_DATE\`
- use single quotes for strings and avoid quoted identifiers by using lowercase names without spaces
- isolate dialect-specific pieces, such as date math and upserts, in a few places
- test on the database you'll deploy to; SQLite in tests and PostgreSQL in production can hide real differences

## How interviewers test this

Expect "Which SQL dialect are you most familiar with?" and questions about differences such as LIMIT versus TOP, or string concatenation. Know the standard's milestones, name a few concrete differences between at least two databases, and state your assumed dialect at the start of any SQL interview answer.`,
    sources: [MODERN_SQL, PG_DOCS, SQLITE_LANG]
  },

  "acid-properties-overview": {
    theory: `ACID names four guarantees that relational databases give transactions: atomicity, consistency, isolation and durability. Together they mean a group of changes either happens completely and permanently, or not at all, even when many users work at once and machines crash. This lesson explains each property with a bank transfer example, shows how databases implement them with logs and locks, and introduces the trade-offs that distributed systems make.

## Transactions

A **transaction** is a sequence of operations treated as one unit of work. A bank transfer of ₹500 from account A to account B is two updates:

~~~sql
BEGIN;
UPDATE accounts SET balance = balance - 500 WHERE id = 'A';
UPDATE accounts SET balance = balance + 500 WHERE id = 'B';
COMMIT;
~~~

If the system crashes between the two updates, A has lost money that B never received. ACID guarantees prevent this and other failures.

## Atomicity

**Atomicity** means all or nothing. Either every operation in the transaction takes effect, or none does. If anything fails before \`COMMIT\`, whether an error, a constraint violation, a crash or an explicit \`ROLLBACK\`, the database undoes every change the transaction made.

Databases implement atomicity with a log. Before changing data, the database records enough information to undo the change. On a failure or rollback, it uses the log to reverse partial work.

## Consistency

**Consistency** means a transaction moves the database from one valid state to another. Every constraint, such as primary keys, foreign keys, checks and not-null rules, must hold when the transaction commits. If the transfer would make A's balance negative and a \`CHECK (balance >= 0)\` constraint exists, the transaction fails and rolls back.

Consistency is partly the database's job and partly the application's. The database enforces declared constraints, but it can't know business rules nobody declared, such as "total money across all accounts stays the same". Writing correct transactions is the developer's responsibility. Note that the C in ACID is different from the C in the CAP theorem, which refers to all replicas showing the same data.

## Isolation

**Isolation** means concurrent transactions don't interfere with each other. Ideally, the result is the same as if transactions ran one after another, in some order. Without isolation, problems appear:

| Anomaly | What happens |
|---|---|
| Dirty read | Reading another transaction's uncommitted changes, which may be rolled back |
| Non-repeatable read | Reading the same row twice in one transaction and getting different values |
| Phantom read | Re-running a query and finding new rows that another transaction inserted |
| Lost update | Two transactions read a value, both update it, and one update overwrites the other |

Full isolation, called **serializability**, costs performance, so databases offer weaker **isolation levels**: read uncommitted, read committed, repeatable read and serializable. Each prevents more anomalies at a higher cost. PostgreSQL defaults to read committed; MySQL's InnoDB defaults to repeatable read. The transactions lesson in the database design module covers these levels in detail.

Databases implement isolation with locks, which make conflicting transactions wait, or with **multi-version concurrency control** (MVCC), which keeps several versions of each row so readers see a consistent snapshot without blocking writers. PostgreSQL, MySQL's InnoDB and Oracle all use MVCC.

## Durability

**Durability** means once a transaction commits, its changes survive crashes and power failures. When \`COMMIT\` returns successfully, the data is safe, even if the server loses power a millisecond later.

Databases achieve this with **write-ahead logging** (WAL): before confirming a commit, the database writes the change to a log on durable storage and forces it to disk. The data files themselves can be updated later. After a crash, the database replays the log to restore committed changes and discards uncommitted ones. Durability also depends on hardware honouring flush requests, and in replicated setups, on copying the log to other servers.

## How the properties fit together

| Property | Guarantee | Main mechanism |
|---|---|---|
| Atomicity | All or nothing | Undo information in the log |
| Consistency | Constraints always hold | Constraint checks, correct transactions |
| Isolation | Concurrent transactions don't interfere | Locks or MVCC |
| Durability | Committed data survives crashes | Write-ahead log flushed to disk |

## Autocommit

Most databases run in **autocommit** mode by default: each statement is its own transaction, committed immediately. To group statements, start a transaction explicitly with \`BEGIN\` or \`START TRANSACTION\`. Forgetting this is a common bug: a script that runs two related updates in autocommit mode isn't atomic.

## ACID and distributed systems

Keeping ACID guarantees across many servers is expensive, because servers must coordinate on every commit. Many NoSQL databases relax some guarantees for scalability and availability, offering **BASE** (basically available, soft state, eventually consistent) behaviour instead, where replicas may briefly disagree. Others, such as Google Spanner and CockroachDB, provide distributed ACID transactions at the cost of extra coordination. Choosing between them depends on whether the application can tolerate temporary inconsistency, which a bank balance usually can't and a social media like counter usually can.

## How interviewers test this

Expect "Explain ACID with an example" in nearly every database interview. Use the bank transfer, define each property in one sentence, name the mechanism behind it (log, constraints, MVCC or locks, write-ahead log), and mention isolation levels and the ACID versus BASE trade-off for extra depth.`,
    sources: [PG_MVCC, PG_DOCS, SQLITE_LANG]
  },

  "sql-command-categories": {
    theory: `SQL statements fall into five categories according to what they do: defining structure, changing data, querying data, controlling access and managing transactions. The categories matter for practical reasons: they behave differently in transactions, need different permissions, and carry different risks. This lesson explains DDL, DML, DQL, DCL and TCL, with the main commands in each and the behaviours that set them apart.

## The five categories

| Category | Full name | Purpose | Main commands |
|---|---|---|---|
| DDL | Data Definition Language | Define and change structure | \`CREATE\`, \`ALTER\`, \`DROP\`, \`TRUNCATE\`, \`RENAME\` |
| DML | Data Manipulation Language | Change rows | \`INSERT\`, \`UPDATE\`, \`DELETE\`, \`MERGE\` |
| DQL | Data Query Language | Read rows | \`SELECT\` |
| DCL | Data Control Language | Manage permissions | \`GRANT\`, \`REVOKE\` |
| TCL | Transaction Control Language | Manage transactions | \`BEGIN\`, \`COMMIT\`, \`ROLLBACK\`, \`SAVEPOINT\` |

Some textbooks fold \`SELECT\` into DML, giving four categories. Both conventions are common, so state which you're using.

## DDL: defining structure

DDL statements create and change database objects: tables, indexes, views, schemas and constraints.

~~~sql
CREATE TABLE departments (id INTEGER PRIMARY KEY, name VARCHAR(50) NOT NULL);
ALTER TABLE departments ADD COLUMN budget NUMERIC(12, 2);
DROP TABLE departments;
~~~

DDL changes the schema, so it affects every query and application that uses the object. In production, schema changes are written as versioned **migration** scripts, reviewed and applied in order, using tools such as Flyway, Liquibase or Alembic.

## DDL and transactions

Databases differ in how DDL interacts with transactions. In MySQL and Oracle, most DDL statements cause an **implicit commit**: running \`ALTER TABLE\` in the middle of a transaction commits everything before it, and the DDL itself can't be rolled back. PostgreSQL and SQLite support **transactional DDL**: you can create tables, alter them and roll back as a unit. This makes migrations safer in PostgreSQL, since a failed migration leaves no half-applied changes.

## DML: changing data

DML statements add, modify and remove rows:

~~~sql
INSERT INTO departments (id, name) VALUES (1, 'Engineering');
UPDATE departments SET name = 'Platform Engineering' WHERE id = 1;
DELETE FROM departments WHERE id = 1;
~~~

DML is fully transactional everywhere: changes can be committed or rolled back. \`UPDATE\` and \`DELETE\` without a \`WHERE\` clause affect every row, the most common destructive mistake in SQL.

## DQL: querying data

\`SELECT\` reads data without changing it. It's the most used and most complex statement, with clauses for filtering, joining, grouping, sorting and limiting. Most of this course is about \`SELECT\`. A plain \`SELECT\` takes no write locks in MVCC databases, so it doesn't block writers.

## DCL: controlling access

DCL manages who can do what:

~~~sql
GRANT SELECT, INSERT ON employees TO analyst_role;
REVOKE INSERT ON employees FROM analyst_role;
~~~

Permissions can apply to whole databases, schemas, tables, columns or specific actions. The **principle of least privilege** says each user and application should have only the permissions it needs: a reporting tool gets \`SELECT\`, and the web app's database user shouldn't be able to drop tables. Granting permissions to roles, then assigning roles to users, keeps management manageable. SQLite has no users or permissions; access control is whatever the file system allows.

## TCL: managing transactions

TCL groups statements into atomic units:

~~~sql
BEGIN;
UPDATE accounts SET balance = balance - 500 WHERE id = 'A';
SAVEPOINT after_debit;
UPDATE accounts SET balance = balance + 500 WHERE id = 'B';
COMMIT;
~~~

\`COMMIT\` makes changes permanent, \`ROLLBACK\` undoes them, and \`SAVEPOINT\` marks a point you can roll back to without abandoning the whole transaction, using \`ROLLBACK TO SAVEPOINT after_debit\`.

## Permissions by category

The categories map naturally onto roles. Application users typically get DML and DQL on specific tables. Analysts get DQL only. Only administrators and migration tools get DDL. DCL is reserved for database administrators. Keeping DDL away from application accounts limits the damage from SQL injection or bugs: an injected \`DROP TABLE\` fails if the account lacks the permission.

## Risk by category

| Category | Undo possible? | Risk |
|---|---|---|
| DQL | Nothing to undo | Low, though heavy queries can slow a server |
| DML | Yes, before commit | Medium: a missing \`WHERE\` can change every row |
| DDL | Sometimes (database-dependent) | High: dropping a table destroys data and structure |
| DCL | Yes, by reversing the grant | Medium: excess privileges create security holes |

## How interviewers test this

Expect "What are DDL, DML, DCL and TCL? Give examples" and "Is TRUNCATE DDL or DML?" Give each category's purpose and commands, explain that TRUNCATE is classified as DDL, and mention implicit commits in MySQL and Oracle versus transactional DDL in PostgreSQL.`,
    sources: [PG_DOCS, PG_DDL, SQLITE_LANG]
  },

  "select-statement-and-column-aliasing": {
    theory: `\`SELECT\` retrieves data, and it's the statement you'll write most often. A basic \`SELECT\` names the columns to return and the table to read from, but the select list can also compute new values, rename columns with aliases and call functions. This lesson explains the parts of a \`SELECT\`, why \`SELECT *\` is risky in application code, how expressions and aliases work, and where aliases can and can't be used.

## The basic form

~~~sql
SELECT name, salary
FROM employees;
~~~

\`SELECT\` lists the columns, called the **select list** or projection, and \`FROM\` names the source table. The result is itself a table, with the listed columns and one row per source row. Without \`ORDER BY\`, the rows come back in no guaranteed order.

SQL keywords aren't case-sensitive, so \`select\` and \`SELECT\` are the same. Writing keywords in uppercase and identifiers in lowercase is a common convention that makes queries easier to scan.

## SELECT *

\`SELECT *\` returns every column. It's convenient for exploring a table interactively, but it causes problems in application code:

- **Wasted work**: the database reads and sends columns you don't use, including large text or JSON columns
- **Lost index-only scans**: a query needing only indexed columns can be answered from the index alone, but \`*\` forces reading the table
- **Fragile code**: adding, removing or reordering columns changes the result, which can break code that reads columns by position
- **Unclear intent**: readers can't tell which columns the query needs

List columns explicitly in code that other people or programs depend on.

## Expressions in the select list

The select list can compute values from columns:

~~~sql
SELECT name,
       salary * 12 AS annual_salary,
       UPPER(name) AS name_upper,
       salary * 1.10 AS salary_after_raise
FROM employees;
~~~

Arithmetic, string functions, date functions, \`CASE\` expressions and constants are all allowed. The computation happens per row, and the stored data doesn't change. A \`SELECT\` without \`FROM\` evaluates expressions directly in PostgreSQL, MySQL and SQLite, for example \`SELECT 2 + 3;\`, while Oracle requires \`FROM dual\`.

## Column aliases

An alias renames a column in the result, using \`AS\`:

~~~sql
SELECT name AS employee_name, salary * 12 AS annual_salary
FROM employees;
~~~

Without an alias, computed columns get generated names such as \`?column?\` in PostgreSQL or the expression text in MySQL, which are awkward for applications to read. The \`AS\` keyword is optional for columns (\`salary * 12 annual_salary\` also works), but including it makes queries clearer and avoids mistakes where a missing comma turns a column into an alias: \`SELECT name salary FROM employees\` returns the names in a column called \`salary\`.

Aliases containing spaces or uppercase letters need quoting: \`AS "Annual Salary"\` in standard SQL and PostgreSQL. Quoted aliases preserve case; unquoted names are folded to lowercase in PostgreSQL.

## Table aliases

Tables can be aliased too, which shortens queries and becomes essential with joins:

~~~sql
SELECT e.name, d.name AS department
FROM employees AS e
JOIN departments AS d ON e.dept_id = d.id;
~~~

When two tables share a column name, such as \`name\`, the alias prefix says which one you mean. Self-joins, where a table joins to itself, are impossible without table aliases. Oracle doesn't accept \`AS\` before table aliases, so \`FROM employees e\` is the portable form.

## Where aliases can be used

Column aliases are defined in the \`SELECT\` clause, which the database evaluates **after** \`FROM\`, \`WHERE\`, \`GROUP BY\` and \`HAVING\`. So an alias isn't visible in those earlier clauses:

~~~sql
-- Fails in standard SQL: annual_salary doesn't exist yet when WHERE runs
SELECT name, salary * 12 AS annual_salary
FROM employees
WHERE annual_salary > 1000000;
~~~

Repeat the expression in \`WHERE\`, or wrap the query in a subquery or common table expression and filter outside it. \`ORDER BY\` runs after \`SELECT\`, so it can use aliases. Some databases relax these rules: MySQL and SQLite allow aliases in \`GROUP BY\` and \`HAVING\`, and PostgreSQL allows them in \`GROUP BY\`. Relying on these extensions makes queries less portable.

## Literal values and constants

The select list can include constants, which appear in every row:

~~~sql
SELECT name, 'active' AS status, 1 AS version FROM employees;
~~~

This helps when combining results with \`UNION\`, where you may need to label which branch each row came from.

## Reading a SELECT

Queries are read most easily in the order the database evaluates them: start with \`FROM\` to see the source, then \`WHERE\` for the filter, then the select list for the output. The query execution order lesson covers this pipeline in detail.

## How interviewers test this

Expect "Why avoid SELECT * in production?" and "Can you use a column alias in WHERE?" Give the performance and fragility reasons against \`SELECT *\`, explain that aliases are created in the \`SELECT\` step and so aren't visible to \`WHERE\`, and show the subquery workaround.`,
    sources: [PG_QUERIES, SQLITE_LANG, MODERN_SQL]
  },

  "distinct-keyword": {
    theory: `\`DISTINCT\` removes duplicate rows from a query's result. It's the SQL tool for questions such as "which departments have employees?" or "which cities do our customers live in?" But it's also overused as a patch for queries that produce unexpected duplicates. This lesson explains how \`DISTINCT\` works on single and multiple columns, how it treats NULL, its performance cost, how it combines with aggregates, and when duplicates signal a bug instead.

## Removing duplicate rows

Without \`DISTINCT\`, a query returns one result row per source row, duplicates included:

~~~sql
SELECT dept_id FROM employees;            -- one row per employee
SELECT DISTINCT dept_id FROM employees;   -- one row per department
~~~

The first query might return \`10, 10, 20, 10, 30\`; the second returns \`10, 20, 30\` in some order. \`DISTINCT\` applies to the result after the select list is computed.

## Multiple columns

With several columns, \`DISTINCT\` removes rows where **every** listed column matches:

~~~sql
SELECT DISTINCT dept_id, job_title FROM employees;
~~~

This returns each unique pair of department and job title. Two engineers in department 10 collapse into one row, but an engineer and a manager in department 10 stay as two rows. \`DISTINCT\` isn't a function and doesn't apply to one column only: \`SELECT DISTINCT(dept_id), name\` still deduplicates on both columns, because the parentheses only group \`dept_id\`.

## DISTINCT and NULL

\`DISTINCT\` treats NULL values as duplicates of each other, even though \`NULL = NULL\` isn't true. If ten employees have no department, \`SELECT DISTINCT dept_id\` returns one NULL row. This matches how \`GROUP BY\` treats NULLs.

## How DISTINCT works internally

To find duplicates, the database must compare rows. It does this in one of two ways:

- **Sorting**: sort the result, then drop rows equal to the previous one
- **Hashing**: insert each row into a hash table and keep only new ones

Both cost extra time and memory, roughly O(n log n) for sorting or O(n) with significant memory for hashing. On large results, they may spill to disk. An index on the selected columns can help the database avoid sorting. \`DISTINCT\` on a column already guaranteed unique, such as a primary key, does pointless work, though some optimizers skip it.

## DISTINCT versus GROUP BY

These two queries return the same rows:

~~~sql
SELECT DISTINCT dept_id FROM employees;
SELECT dept_id FROM employees GROUP BY dept_id;
~~~

Modern optimizers usually produce the same plan for both. Use \`DISTINCT\` when you only want unique values, and \`GROUP BY\` when you also compute aggregates per group, such as a count. The intent is clearer either way.

## DISTINCT inside aggregates

\`DISTINCT\` also works inside aggregate functions, where it deduplicates values before aggregating:

~~~sql
SELECT COUNT(*) AS employees,
       COUNT(DISTINCT dept_id) AS departments_with_staff
FROM employees;
~~~

\`COUNT(DISTINCT column)\` counts unique non-NULL values, a frequent reporting need. \`SUM(DISTINCT salary)\` sums unique salary values, which is rarely what you want: two employees earning the same salary would be counted once.

## DISTINCT ON

PostgreSQL offers \`DISTINCT ON (columns)\`, which keeps the first row for each unique value of the listed columns, according to \`ORDER BY\`:

~~~sql
SELECT DISTINCT ON (dept_id) dept_id, name, salary
FROM employees
ORDER BY dept_id, salary DESC;
~~~

This returns the highest-paid employee in each department. The \`ORDER BY\` must start with the \`DISTINCT ON\` columns. It's a concise PostgreSQL-only solution to the top-1-per-group problem; the portable alternative uses window functions.

## Duplicates as a symptom

If a query returns unexpected duplicates, \`DISTINCT\` hides the symptom without fixing the cause. The usual cause is a join that multiplies rows. Joining employees to a projects table returns one row per employee per project, so an employee on three projects appears three times. Adding \`DISTINCT\` removes the visible duplicates, but:

- it wastes work generating and then discarding rows
- it breaks aggregates computed before deduplication, such as sums that counted each employee three times
- it can hide a wrong join condition that matches far more rows than intended

Fix the query instead: use \`EXISTS\` to check for a related row without multiplying, aggregate the related table before joining, or correct the join condition. Treat \`DISTINCT\` added to "fix duplicates" as a warning sign in code review.

## ORDER BY with DISTINCT

With \`SELECT DISTINCT\`, PostgreSQL requires \`ORDER BY\` expressions to appear in the select list. Sorting by a column you didn't select would be ambiguous, since each output row may correspond to several source rows with different values in that column.

## How interviewers test this

Expect "How does DISTINCT work on multiple columns?", "DISTINCT versus GROUP BY?" and "How would you count unique values?" Explain that it compares whole rows, that NULLs collapse into one, that it costs a sort or hash, and that \`COUNT(DISTINCT x)\` counts unique values. Mention that duplicates from joins should be fixed, not hidden.`,
    sources: [PG_QUERIES, SQLITE_LANG, MODERN_SQL]
  },

  "insert-into-syntax": {
    theory: `\`INSERT\` adds rows to a table. It can insert a single row, many rows in one statement, or the results of a query, and modern databases can resolve conflicts with existing rows in the same statement, called an upsert. This lesson explains each form of \`INSERT\`, why you should always list columns, how defaults and generated keys work, how to insert efficiently in bulk, and how upserts handle duplicates safely.

## Single-row insert

~~~sql
INSERT INTO employees (id, name, dept_id, salary, hire_date)
VALUES (101, 'Ananya Iyer', 10, 85000, '2024-07-01');
~~~

The column list names the columns being filled, and \`VALUES\` supplies values in the same order. Values must match each column's type and satisfy its constraints, or the whole statement fails.

## Always list the columns

You can omit the column list and supply a value for every column in table order:

~~~sql
INSERT INTO employees VALUES (101, 'Ananya Iyer', 10, 85000, '2024-07-01');
~~~

This breaks as soon as someone adds, removes or reorders a column. Worse, if two columns of the same type swap order, values land in the wrong columns without any error. Listing columns makes inserts survive schema changes and documents which value goes where.

## Defaults and omitted columns

Columns left out of the column list get their \`DEFAULT\` value, or NULL if no default exists. If such a column is \`NOT NULL\` without a default, the insert fails. You can also write \`DEFAULT\` explicitly in the \`VALUES\` list. Explicitly inserting NULL doesn't trigger the default: it stores NULL, or fails on a \`NOT NULL\` column.

## Generated keys

With an auto-generated primary key, omit the key column and let the database assign it. Applications usually need the new key immediately, for example to insert child rows:

~~~sql
INSERT INTO departments (name) VALUES ('Research') RETURNING id;
~~~

\`RETURNING\` works in PostgreSQL and SQLite (since 3.35). MySQL provides \`LAST_INSERT_ID()\`, and SQL Server uses an \`OUTPUT\` clause or \`SCOPE_IDENTITY()\`. Never compute the next ID yourself with \`SELECT MAX(id) + 1\`: two concurrent inserts can read the same maximum and collide.

## Multi-row insert

One statement can insert many rows:

~~~sql
INSERT INTO departments (name)
VALUES ('Sales'), ('Marketing'), ('Finance');
~~~

This is far faster than separate statements, because it avoids repeated network round trips, statement parsing and, in autocommit mode, a separate commit for each row. Each commit forces a disk flush, so inserting 10,000 rows one per transaction can be a hundred times slower than inserting them in one transaction.

## Bulk loading

For the largest loads, databases provide dedicated tools that bypass much of the per-statement overhead: \`COPY\` in PostgreSQL, \`LOAD DATA INFILE\` in MySQL, and \`.import\` in the SQLite shell. They read files directly and can load millions of rows per minute. For bulk loads into a new table, it's often faster to load first and create indexes afterwards, since maintaining indexes row by row is expensive.

## INSERT ... SELECT

An insert can take its rows from a query:

~~~sql
INSERT INTO employees_archive (id, name, dept_id, salary)
SELECT id, name, dept_id, salary
FROM employees
WHERE hire_date < '2015-01-01';
~~~

The query's columns must match the target columns in number and compatible types. This is the standard way to copy, archive or transform data between tables within the database, without moving it through an application.

## Upserts

A common need is "insert this row, or update it if it already exists". Doing this with a separate \`SELECT\` then \`INSERT\` or \`UPDATE\` has a race condition: two sessions can both see no row and both insert. Databases provide atomic upserts instead. In PostgreSQL and SQLite:

~~~sql
INSERT INTO inventory (product_id, quantity)
VALUES (42, 5)
ON CONFLICT (product_id)
DO UPDATE SET quantity = inventory.quantity + EXCLUDED.quantity;
~~~

\`EXCLUDED\` refers to the row that failed to insert. \`ON CONFLICT DO NOTHING\` skips duplicates silently. The conflict target must be backed by a unique index or constraint. MySQL uses \`ON DUPLICATE KEY UPDATE\`, and SQL Server and Oracle use \`MERGE\`.

## Insert failures

An \`INSERT\` fails, and inserts nothing, when it violates a constraint: a duplicate primary or unique key, a NULL in a \`NOT NULL\` column, a \`CHECK\` failure, a missing foreign key target, or a type mismatch. In a multi-row insert, one bad row fails the whole statement. Within an explicit transaction in PostgreSQL, an error aborts the transaction, and later statements fail until you roll back, or roll back to a savepoint.

## Preventing SQL injection

Never build an \`INSERT\` by concatenating user input into a string. Input such as \`'); DROP TABLE employees; --\` can run attacker-controlled SQL. Use **parameterized queries**, where the SQL and values are sent separately:

~~~java
PreparedStatement ps = conn.prepareStatement(
    "INSERT INTO employees (name, salary) VALUES (?, ?)");
ps.setString(1, name);
ps.setBigDecimal(2, salary);
ps.executeUpdate();
~~~

The database treats parameters strictly as values, never as SQL code.

## How interviewers test this

Expect to write inserts, and questions such as "How do you insert many rows efficiently?", "How do you get the generated ID?" and "How do you insert or update in one statement?" List columns explicitly, batch rows in one statement and transaction, use \`RETURNING\` or the dialect's equivalent, and describe upserts as the race-free alternative to select-then-insert.`,
    sources: [PG_DOCS, SQLITE_LANG, MODERN_SQL]
  },

  "update-statement-and-safeguards": {
    theory: `\`UPDATE\` changes values in existing rows. It's one of the most dangerous statements in SQL, because a missing or wrong \`WHERE\` clause silently changes every row in a table. This lesson explains the syntax, updating from expressions and other tables, how updates interact with constraints and concurrency, and the safeguards that prevent disasters, including transactions, previews and safe update modes.

## The basic form

~~~sql
UPDATE employees
SET salary = 95000
WHERE id = 101;
~~~

\`SET\` lists columns and their new values; \`WHERE\` selects which rows change. The database reports how many rows were affected. Checking that number is a quick sanity test: an update meant for one employee that reports 4,000 rows changed signals a problem.

## The missing WHERE disaster

Without \`WHERE\`, every row changes:

~~~sql
UPDATE employees SET salary = 95000;   -- every employee now earns 95,000
~~~

This is one of the most common and costly SQL mistakes. Running a statement with only part of it selected in a SQL editor, so the \`WHERE\` line isn't included, produces the same result.

## Expressions and multiple columns

\`SET\` can use expressions, including the column's current value, and can change several columns at once:

~~~sql
UPDATE employees
SET salary = salary * 1.10,
    last_raise_date = CURRENT_DATE
WHERE dept_id = 10;
~~~

All expressions on the right are evaluated using the row's values **before** the update. So \`SET a = b, b = a\` swaps the two columns in PostgreSQL, SQLite and the SQL standard. MySQL evaluates assignments left to right, using already-updated values, so the same statement sets both columns to the original b. That's a subtle dialect difference worth knowing.

## Conditional updates with CASE

Different rows can receive different values in one statement:

~~~sql
UPDATE employees
SET salary = CASE
    WHEN performance = 'excellent' THEN salary * 1.15
    WHEN performance = 'good' THEN salary * 1.08
    ELSE salary
END
WHERE dept_id = 10;
~~~

The \`ELSE salary\` keeps other rows unchanged. Without it, \`CASE\` returns NULL for unmatched rows, wiping their salaries.

## Updating from another table

Often new values come from a related table. PostgreSQL uses \`UPDATE ... FROM\`:

~~~sql
UPDATE employees e
SET salary = e.salary + b.amount
FROM bonuses b
WHERE b.employee_id = e.id;
~~~

MySQL writes it as \`UPDATE employees e JOIN bonuses b ON ... SET ...\`. A correlated subquery works everywhere:

~~~sql
UPDATE employees
SET dept_name = (SELECT d.name FROM departments d WHERE d.id = employees.dept_id);
~~~

With the subquery form, rows that find no match get NULL, which may not be what you want; add a \`WHERE EXISTS\` condition to limit the update to rows that have a match. With a join form, if the source table has several matching rows for one target row, the result is unpredictable, so make sure the join is one-to-one.

## Safeguard 1: preview with SELECT

Before running an update, run a \`SELECT\` with the same \`WHERE\` clause and check the rows and their count:

~~~sql
SELECT id, name, salary FROM employees WHERE dept_id = 10;
~~~

If the result looks right, change \`SELECT ... FROM\` to \`UPDATE ... SET\`, keeping the \`WHERE\` clause identical.

## Safeguard 2: use a transaction

Wrap manual updates in a transaction, check the result, then commit or roll back:

~~~sql
BEGIN;
UPDATE employees SET salary = salary * 1.10 WHERE dept_id = 10;
SELECT COUNT(*) FROM employees WHERE dept_id = 10;   -- verify
COMMIT;   -- or ROLLBACK if something looks wrong
~~~

Until \`COMMIT\`, other sessions don't see the change, and \`ROLLBACK\` restores everything. Keep these transactions short, because the updated rows stay locked against other writers until you finish.

## Safeguard 3: safe update modes and RETURNING

MySQL's \`sql_safe_updates\` setting, enabled by default in MySQL Workbench, rejects \`UPDATE\` and \`DELETE\` statements without a key-based \`WHERE\` or \`LIMIT\`. PostgreSQL and SQLite support \`RETURNING\`, which shows the changed rows:

~~~sql
UPDATE employees SET salary = salary * 1.10 WHERE dept_id = 10
RETURNING id, name, salary;
~~~

## Safeguard 4: backups and permissions

Mistakes still happen, so production databases need tested backups and, ideally, point-in-time recovery. Restrict who can run ad-hoc updates in production, and route routine changes through reviewed scripts or application code.

## Updates and constraints

An update must leave every row satisfying every constraint. Changing a salary to a negative value fails a \`CHECK\`, and changing an employee's \`dept_id\` to a nonexistent department fails the foreign key. Updating a referenced primary key either fails or cascades to child rows, depending on the foreign key's \`ON UPDATE\` action. If any row violates a constraint, the entire statement fails and no rows change.

## Updates and concurrency

An update locks each row it changes until the transaction ends, so concurrent updates to the same row wait. The pattern \`SET quantity = quantity - 1\` is safe under concurrency, because the database reads and writes the current value atomically. Reading the value into an application, subtracting there and writing it back risks lost updates when two sessions do it at once. Use atomic expressions, \`SELECT ... FOR UPDATE\` to lock rows before reading, or a version column for optimistic locking.

## How interviewers test this

Expect to write updates with conditions and joins, and questions such as "How do you update a table from another table?" and "How do you protect against accidental mass updates?" Preview with SELECT, use transactions, mention safe update mode and \`RETURNING\`, and explain atomic increments versus read-modify-write.`,
    sources: [PG_DOCS, PG_MVCC, SQLITE_LANG]
  },

  "delete-vs-truncate-vs-drop": {
    theory: `\`DELETE\`, \`TRUNCATE\` and \`DROP\` all remove data, but they work at different levels and behave in distinct ways. \`DELETE\` removes chosen rows, \`TRUNCATE\` empties a whole table quickly, and \`DROP\` removes the table itself. Choosing the wrong one can cost hours of recovery. This lesson explains each statement, compares their speed, logging, rollback, triggers and identity behaviour, and covers soft deletes as an alternative.

## DELETE: remove chosen rows

~~~sql
DELETE FROM employees WHERE id = 101;
~~~

\`DELETE\` removes rows matching the \`WHERE\` clause, or every row if there's no \`WHERE\`. It's DML: it processes rows one by one, fires row-level \`DELETE\` triggers, checks foreign keys for each row and can be rolled back inside a transaction.

Deleting many rows is slow on large tables, because every row deletion is logged and every index is updated. In MVCC databases such as PostgreSQL, deleted rows aren't removed physically right away; they're marked dead and cleaned up later by \`VACUUM\`, so a mass delete doesn't immediately shrink the table on disk. Large deletes are often done in batches, such as 10,000 rows at a time, to keep transactions short and avoid long locks.

## TRUNCATE: empty a table

~~~sql
TRUNCATE TABLE logs;
~~~

\`TRUNCATE\` removes all rows at once. Instead of deleting rows individually, it releases the table's storage and starts fresh, so it takes about the same time for a hundred rows or a hundred million. It's classified as DDL. Key behaviours:

- no \`WHERE\` clause: it's all rows or nothing
- row-level \`DELETE\` triggers don't fire
- it resets auto-increment counters in MySQL and SQL Server; PostgreSQL resets them only with \`TRUNCATE ... RESTART IDENTITY\`
- it fails if another table references this one through a foreign key, unless you use \`CASCADE\` in PostgreSQL, which also truncates the referencing tables
- it needs a stronger lock than \`DELETE\`, blocking all other access to the table while it runs

## Can TRUNCATE be rolled back?

It depends on the database. In PostgreSQL and SQL Server, \`TRUNCATE\` inside a transaction can be rolled back. In MySQL and Oracle, it causes an implicit commit and can't be undone. SQLite has no \`TRUNCATE\` statement; a \`DELETE\` without \`WHERE\` is optimized into a fast table clear when no triggers are involved. This variation is a common interview follow-up.

## DROP: remove the table

~~~sql
DROP TABLE employees;
~~~

\`DROP\` removes the table entirely: its data, structure, indexes, constraints, triggers and permissions. Queries referencing it fail afterwards. It's DDL, and only PostgreSQL and SQLite, with transactional DDL, can roll it back within a transaction. \`DROP TABLE IF EXISTS\` avoids an error when the table doesn't exist, which is useful in setup scripts. If other objects depend on the table, such as views or foreign keys, the drop fails unless you add \`CASCADE\`, which removes the dependents too.

## Comparing the three

| | DELETE | TRUNCATE | DROP |
|---|---|---|---|
| Removes | Chosen rows | All rows | The whole table |
| Category | DML | DDL | DDL |
| WHERE clause | Yes | No | No |
| Speed on large tables | Slow, row by row | Fast | Fast |
| Row triggers fire | Yes | No | No |
| Structure kept | Yes | Yes | No |
| Identity reset | No | Usually (database-dependent) | Table is gone |
| Rollback | Yes | Database-dependent | Database-dependent |
| Space reclaimed | Later (vacuum or reuse) | Immediately | Immediately |

## Choosing between them

- To remove specific rows, use \`DELETE\` with \`WHERE\`
- To empty a staging or log table quickly while keeping its structure, use \`TRUNCATE\`
- To remove a table that's no longer needed, use \`DROP\`

## Soft deletes

Many applications never physically delete business records. Instead, they mark rows as deleted:

~~~sql
UPDATE customers SET deleted_at = CURRENT_TIMESTAMP WHERE id = 42;
~~~

Queries then filter with \`WHERE deleted_at IS NULL\`. Soft deletes allow recovery from mistakes, keep history for audits, and preserve foreign key references from old orders. The costs: every query must remember the filter, unique constraints need adjusting so a deleted email can be reused (a partial unique index in PostgreSQL handles this), and the table keeps growing. Some systems use a separate archive table instead.

Privacy law can require real deletion. Under rules such as the EU's General Data Protection Regulation (GDPR) and India's Digital Personal Data Protection Act, users can request erasure of personal data, so soft-deleted personal data may still need to be purged or anonymized.

## Recovering from mistakes

After an accidental \`DELETE\` without \`WHERE\`, rollback only helps if you were inside an uncommitted transaction. Otherwise, recovery depends on backups. Point-in-time recovery, available in PostgreSQL through archived write-ahead logs and in MySQL through binary logs, can restore the database to the moment before the mistake. Test restores regularly: a backup that's never been restored isn't a reliable backup.

## How interviewers test this

"DELETE versus TRUNCATE versus DROP" is one of the most frequently asked SQL questions. Use the comparison table: scope, category, speed, triggers, identity reset and rollback behaviour, noting that rollback for TRUNCATE varies by database. Mention soft deletes to show you think about recoverability.`,
    sources: [PG_DOCS, PG_DDL, SQLITE_LANG]
  },

  "sql-query-execution-order": {
    theory: `SQL is written in one order and evaluated in another. You write \`SELECT\` first, but the database logically processes \`FROM\` first and \`SELECT\` near the end. Understanding this logical order explains rules that otherwise seem arbitrary: why aliases don't work in \`WHERE\`, why aggregates can't appear in \`WHERE\`, and why \`HAVING\` exists. This lesson walks through each step of the pipeline, explains the rules that follow, and separates logical order from how the database physically executes a query.

## Written order versus logical order

A full query is written like this:

~~~sql
SELECT dept_id, AVG(salary) AS avg_salary
FROM employees
WHERE hire_date >= '2020-01-01'
GROUP BY dept_id
HAVING AVG(salary) > 60000
ORDER BY avg_salary DESC
LIMIT 5;
~~~

But it's logically evaluated in this order:

| Step | Clause | What it does |
|---|---|---|
| 1 | \`FROM\` and \`JOIN\` | Build the source rows, combining tables |
| 2 | \`WHERE\` | Filter individual rows |
| 3 | \`GROUP BY\` | Group rows sharing values |
| 4 | \`HAVING\` | Filter groups |
| 5 | \`SELECT\` | Compute output columns and aliases; window functions run here |
| 6 | \`DISTINCT\` | Remove duplicate output rows |
| 7 | \`ORDER BY\` | Sort the result |
| 8 | \`LIMIT\` / \`OFFSET\` | Keep a slice of the sorted rows |

Each step takes the output of the previous one as its input.

## Step 1: FROM and JOIN

The database first assembles the rows to work with. For a single table, that's every row. With joins, it's the combined rows that satisfy the join conditions. Subqueries in \`FROM\` and common table expressions are evaluated here too, producing tables the rest of the query uses.

## Step 2: WHERE

\`WHERE\` keeps individual rows where the condition is true. It sees only the columns from step 1. Since grouping hasn't happened, aggregate functions don't exist yet, so this fails:

~~~sql
SELECT dept_id FROM employees WHERE AVG(salary) > 60000;   -- error
~~~

Filtering early is also efficient: every row removed here is one row fewer to group, sort and return.

## Step 3: GROUP BY

\`GROUP BY\` collapses rows into groups sharing the same values in the grouping columns. After this step, the query works with groups, not rows. Every later step can reference only the grouping columns and aggregates computed over each group, which is why selecting a column that's neither grouped nor aggregated is an error in standard SQL.

## Step 4: HAVING

\`HAVING\` filters groups, and it can use aggregates because groups now exist:

~~~sql
HAVING AVG(salary) > 60000
~~~

The rule of thumb: conditions on individual rows go in \`WHERE\`; conditions on aggregates go in \`HAVING\`. Putting a row condition in \`HAVING\` works but wastes effort, since rows that could have been discarded early get grouped first.

## Step 5: SELECT

Only now does the database compute the select list: expressions, function calls and aliases. Window functions such as \`ROW_NUMBER()\` are computed here, after \`WHERE\`, \`GROUP BY\` and \`HAVING\`. That's why you can't filter on a window function's result in \`WHERE\`; you wrap the query in a subquery or CTE and filter outside.

## Why aliases aren't visible earlier

An alias defined in \`SELECT\` doesn't exist during steps 1 to 4, so \`WHERE annual_salary > 1000000\` fails when \`annual_salary\` is an alias. \`ORDER BY\` comes after \`SELECT\`, so it can use aliases:

~~~sql
SELECT name, salary * 12 AS annual_salary
FROM employees
ORDER BY annual_salary DESC;   -- works
~~~

Some databases relax the rule: MySQL and SQLite allow aliases in \`GROUP BY\` and \`HAVING\`, and PostgreSQL allows them in \`GROUP BY\`. The portable approach repeats the expression or uses a subquery.

## Steps 6 to 8: DISTINCT, ORDER BY and LIMIT

\`DISTINCT\` removes duplicate output rows. \`ORDER BY\` sorts, and it's the only step that guarantees an order. \`LIMIT\` and \`OFFSET\` come last, so \`LIMIT 5\` returns the top five rows **after** sorting. Without \`ORDER BY\`, \`LIMIT\` returns an arbitrary five rows, which may differ between runs.

## Logical order versus physical execution

The logical order defines what result a query must produce. The database doesn't have to execute it that way. The optimizer is free to rearrange work as long as the result is the same. It might apply a \`WHERE\` condition while reading an index, push filters below joins, use an index that's already sorted to skip the \`ORDER BY\` step, or stop early once \`LIMIT\` rows are found. Use \`EXPLAIN\` to see the physical plan the database chose.

## Using the order to debug

When a query misbehaves, build it up in logical order. Start with \`SELECT * FROM ...\` plus joins and check the rows. Add \`WHERE\` and check again. Add grouping and aggregates. This isolates which step introduces the problem, such as a join that multiplies rows before an aggregate inflates the totals.

## How interviewers test this

Expect "What is the order of execution of a SQL query?" and follow-ups such as "Why can't you use an alias in WHERE?" and "WHERE versus HAVING?" Recite the eight steps, then derive the rules from them: aggregates need groups, so they belong in HAVING; aliases are created in SELECT, so only ORDER BY sees them. Mention that the optimizer may physically reorder work.`,
    sources: [PG_QUERIES, SQLITE_QP, MODERN_SQL]
  }
};

