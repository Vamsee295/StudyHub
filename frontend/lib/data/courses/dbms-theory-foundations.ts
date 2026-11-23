// Long-form theory for DBMS modules 1-3. Original writing; sources list further reading.
import { LessonTheory } from './utils';

const CMU_445 = { title: "CMU 15-445/645 Database Systems (free lectures and notes)", url: "https://15445.courses.cs.cmu.edu/" };
const PG_DOCS = { title: "PostgreSQL documentation", url: "https://www.postgresql.org/docs/current/", license: "PostgreSQL License" };
const SILBERSCHATZ = { title: "Database System Concepts (Silberschatz, Korth, Sudarshan) companion site", url: "https://www.db-book.com/" };

export const dbmsFoundationsTheory: Record<string, LessonTheory> = {
  "what-is-a-dbms": {
    theory: `A database management system (DBMS) is the program that sits between your application and the data on disk. It decides how data is stored, who may read or change it, and what happens when two people change it at once or the power fails halfway through a write. This lesson explains the problems a DBMS exists to solve, so the rest of the course has a reason behind every feature.

## Start with a world without a DBMS

Picture a college that stores everything in files. The exam cell keeps \`marks.csv\`, the hostel office keeps \`rooms.xlsx\`, and the library keeps \`members.txt\`. Each office writes its own small program to read and update its file. This works on day one, and it breaks in predictable ways as the college grows.

The first problem is **redundancy**. A student's phone number now lives in three files. When the student changes their number, one office updates its copy and the other two don't, so the files disagree. Disagreeing copies are called **inconsistency**, and they're worse than missing data because nobody knows which copy is right.

The second problem is **access**. The principal asks for "all final-year students with a backlog who live in Block C". The answer needs data from two files in two formats, so someone writes a new program for one question. Every new question costs a new program.

The third problem is **integrity**. Rules such as "marks are between 0 and 100" or "every hostel room belongs to an existing block" live inside each office's code. A new script that forgets the rule writes bad data, and nothing stops it.

## Failures and concurrent users

Files also behave badly when things go wrong. Suppose a fee-payment program subtracts money from a wallet file and then crashes before it records the receipt. The student has lost money and the college has no record. A DBMS groups both writes into a **transaction** that either completes fully or leaves no trace.

Concurrency causes the quietest bugs. Two clerks open the same seat-allocation file, each sees one free seat, and each assigns it to a different student. Both saves succeed, and the second one silently overwrites the first. A DBMS coordinates simultaneous users so that this "lost update" can't happen.

## What a DBMS gives you instead

A DBMS replaces all those per-office programs with one shared system. The main services are:

- **A single shared copy of the data**: one place to update a phone number, so copies can't drift apart
- **A query language**: SQL lets you ask a new question without writing a new program
- **Declared constraints**: rules such as \`CHECK (marks BETWEEN 0 AND 100)\` are enforced for every program, including ones written next year
- **Transactions**: groups of changes that succeed or fail as a unit, even across crashes
- **Concurrency control**: many users read and write at once without corrupting each other's work
- **Security**: permissions per table, per column, or per view, instead of "whoever has the file"
- **Recovery**: logs and backups that rebuild the data after a crash or disk failure

## Database, DBMS and database system

These three terms get mixed up in interviews. The **database** is the organized data itself. The **DBMS** is the software that manages it, such as PostgreSQL, MySQL, Oracle, SQL Server, SQLite or MongoDB. A **database system** means the two together, plus the applications and people that use them.

## When a DBMS is the wrong tool

A DBMS has costs: installation, memory, a learning curve, and a small overhead on every operation. A single-user tool that stores its settings in a small JSON file doesn't need one. Embedded devices with a few kilobytes of memory often can't run one. In between, SQLite is a common compromise: it's a full SQL database stored in a single file, with no server process.

## A short history

Early business systems in the 1960s stored records in files and in hierarchical databases such as IBM's IMS, where programs navigated fixed parent-child paths. E. F. Codd's 1970 relational model separated what data means from how it's stored, and SQL databases built on it became the default by the 1980s. NoSQL systems appeared in the 2000s for web-scale workloads, and most of them still borrow ideas such as transactions and query languages from relational systems.

## How interviewers test this

Expect "What are the advantages of a DBMS over a file system?" A strong answer names the specific problems (redundancy and inconsistency, difficult access, integrity, atomicity, concurrency, security) and gives a one-line example of each. Listing benefits without saying what goes wrong without them sounds memorized.`,
    sources: [SILBERSCHATZ, CMU_445]
  },

  "dbms-tier-architecture": {
    theory: `Tier architecture describes where each part of an application runs: the screen the user sees, the business rules, and the database. The number of tiers decides who can talk to the database directly, which shapes security, scaling and how hard the system is to change. This lesson walks through 1-tier, 2-tier and 3-tier designs using one example, a college fee-payment app.

## The three jobs in every application

Every data-driven application does three jobs:

- **Presentation**: draw screens and collect input (a web page, a mobile app)
- **Application logic**: apply the rules ("a student can't pay twice", "late fees start after the 10th")
- **Data management**: store and retrieve data reliably (the DBMS)

A tier is a separate process, usually on a separate machine, that runs one or more of these jobs. Tiers are about deployment. Layers, by contrast, are about how code is organized inside a program, and a well-layered program can still run as a single tier.

## 1-tier: everything in one place

In a 1-tier system, the interface, the logic and the database run on the same machine, often in the same process. A developer running MySQL on their laptop with a local script is 1-tier, and so is a desktop app that stores data in an embedded SQLite file.

The advantage is simplicity: nothing to deploy, no network in between. The limit is sharing. Only the person at that machine can use the data, so 1-tier suits personal tools and development, not a college with thousands of students.

## 2-tier: clients talk to the database

In a 2-tier (client-server) system, each user runs a client application that connects straight to a central database server. Many older campus billing and payroll systems work this way: a desktop app on each clerk's PC opens a connection to Oracle and runs SQL.

This design is quick to build, because the client contains both the screens and the SQL. The problems appear as the system grows:

- **Security**: every installed client needs database credentials, so anyone who copies the app can extract them
- **Change**: a rule change means updating every client installation
- **Scale**: each client holds its own database connection, and databases handle a limited number of connections well

## 3-tier: put a server in the middle

A 3-tier system adds an application server between the client and the database. The browser or mobile app (presentation tier) sends requests such as \`POST /api/payments\` to the backend (application tier). The backend checks the rules, then runs SQL against the database (data tier). The client never sees SQL or database credentials.

This is how almost every modern web app is built, and the reasons follow directly from the 2-tier problems:

- **Security**: credentials stay on the server, and clients can only call the operations the API allows
- **One place for rules**: change the fee logic once on the server and every client gets it
- **Independent scaling**: add more application servers behind a load balancer during admission week without touching the database
- **Connection pooling**: a few application servers share a pool of database connections instead of thousands of clients each holding one

## Walking one request through the tiers

When a student taps **Pay fees** in the app, the request follows this path:

1. The mobile app sends an HTTPS request with the student's login token to the backend
2. The backend verifies the token, loads the fee record, and checks that it isn't already paid
3. The backend starts a transaction, inserts the payment, marks the fee as paid, and commits
4. The backend returns a receipt, and the app displays it

Only step 3 touches the database. Every rule lives in step 2, on a machine the student can't tamper with.

## N-tier and beyond

Large systems add more tiers: a CDN in front, a cache such as Redis beside the database, separate services for payments and notifications. The principle stays the same: each tier has one responsibility and talks only to its neighbours.

## How interviewers test this

A common question is "Why is 3-tier preferred for web applications?" Answer with the concrete 2-tier failures: exposed credentials, updates to every client, and connection limits. Mention that tiers are physical deployment units, while layers are logical code structure, because interviewers like to check that distinction.`,
    sources: [SILBERSCHATZ, CMU_445]
  },

  "schemas-and-data-independence": {
    theory: `A schema describes how data is organized, and the three-schema architecture splits that description into three levels: what each user sees, what the whole database contains, and how it's physically stored. The point of the split is data independence, the ability to change one level without rewriting everything above it. This lesson explains each level and why one kind of independence is much harder to achieve than the other.

## Schema versus instance

The **schema** is the design: table names, columns, types, keys and constraints. It changes rarely, usually through a planned migration. The **instance** (also called the state) is the data in the database at one moment, and it changes with every insert, update and delete.

An analogy helps: the schema is a blank admission form, and the instance is the pile of filled-in forms in the office today. Adding a student changes the instance. Adding a new field to the form changes the schema.

## The three levels

The ANSI/SPARC three-schema architecture describes the database at three levels of abstraction:

- **External level (views)**: what one user group or application sees. The library app might see only a student's name and roll number, while the exam app sees marks. There can be many external schemas
- **Conceptual level (logical schema)**: the complete description of all data for the whole organization: every table, relationship and constraint. There is exactly one, and database designers own it
- **Internal level (physical schema)**: how the data is stored on disk: file layout, page size, indexes, compression. The DBMS and the database administrator care about this level

Mappings connect the levels. The DBMS translates a query against a view into a query against the conceptual schema, then into page reads at the internal level.

## Physical data independence

Physical data independence means you can change the internal level without changing the conceptual schema or any application. Typical examples:

- Add an index on \`student.email\` so lookups get faster
- Move the database files to a faster SSD
- Change the storage engine, compression or page size

Applications keep running unchanged, because they only ever named tables and columns, never files or indexes. Every mainstream DBMS gives you this kind of independence almost automatically, which is why adding an index is a routine operation.

## Logical data independence

Logical data independence means you can change the conceptual schema without breaking the external views and the applications built on them. Examples include splitting a table, adding a column, or merging two tables.

This is much harder, and the reason is coupling. Applications are written against specific table and column names. If you split \`student\` into \`student\` and \`student_contact\`, every query that read \`student.email\` breaks.

Views are the main tool for keeping logical independence. After the split, you create a view named like the old table that joins the two new tables back together. Old queries read the view and keep working, while new code uses the new tables directly.

~~~sql
CREATE VIEW student_v AS
SELECT s.roll_no, s.name, c.email
FROM student s
JOIN student_contact c ON c.roll_no = s.roll_no;
~~~

The view above gives old code the original shape (roll number, name, email) even though the data now lives in two tables.

## The SQL language families

The levels also explain why SQL has separate command groups:

| Group | Purpose | Commands |
|---|---|---|
| DDL (data definition) | Change the schema | \`CREATE\`, \`ALTER\`, \`DROP\`, \`TRUNCATE\` |
| DML (data manipulation) | Change or read the instance | \`SELECT\`, \`INSERT\`, \`UPDATE\`, \`DELETE\` |
| DCL (data control) | Grant or remove permissions | \`GRANT\`, \`REVOKE\` |
| TCL (transaction control) | Group changes into units | \`COMMIT\`, \`ROLLBACK\`, \`SAVEPOINT\` |

DDL changes the form, DML changes the filled-in forms, DCL decides who may see which forms, and TCL decides when a batch of changes becomes official.

## How interviewers test this

Two questions come up repeatedly. First, "Which data independence is harder, and why?": logical, because applications depend on table and column names, while physical details are hidden by the DBMS. Second, "Is \`TRUNCATE\` DDL or DML?": it's DDL, because it deallocates the table's storage instead of deleting rows one by one, so it can't take a \`WHERE\` clause and doesn't fire row triggers.`,
    sources: [SILBERSCHATZ, PG_DOCS]
  },

  "data-models-oltp-olap": {
    theory: `A data model is the set of ideas you use to describe data: tables and rows, documents, key-value pairs, or nodes and edges. The model you choose decides which questions are cheap to ask and which are expensive. This lesson compares the main data models, then explains the split between transactional (OLTP) and analytical (OLAP) systems that shapes how companies store data.

## Why the model matters

The same college data can be described in several ways. As tables: \`student\`, \`course\` and \`enrollment\` linked by keys. As documents: one JSON document per student with their courses nested inside. As a graph: student and course nodes with "enrolled in" edges. Each shape makes some operations cheap and others expensive.

## The relational model

The relational model stores data in tables of rows and columns and links tables with keys. Its strengths are flexible questions and strong guarantees. You can join any tables in ways the original designer never planned, and the DBMS enforces keys, constraints and transactions.

The cost is that you must define the schema up front and change it through migrations. Data that is naturally nested, such as a product with a varying set of attributes, can need several tables. PostgreSQL, MySQL, Oracle, SQL Server and SQLite are relational.

## Document, key-value, wide-column and graph models

The non-relational (NoSQL) models each optimize for a particular access pattern:

- **Document stores** (MongoDB): store JSON-like documents, so data that's read together is stored together. They suit records with varying fields, such as product catalogs
- **Key-value stores** (Redis, DynamoDB): map a key to a value and look it up in roughly constant time. They suit caches, sessions and counters
- **Wide-column stores** (Cassandra, HBase): store rows with flexible column families spread across many machines. They suit write-heavy data such as event logs and time series
- **Graph databases** (Neo4j): store nodes and edges and follow relationships efficiently. They suit social networks, recommendations and fraud detection

The historical hierarchical (tree-shaped) and network (graph-shaped) models came before the relational model and still run inside some banking mainframes.

## Choosing a model from the access pattern

Pick the model from the questions your application asks most:

| Main question | Good fit |
|---|---|
| Arbitrary filters and joins with strong consistency | Relational |
| Fetch or store one whole record by ID | Document or key-value |
| Absorb millions of writes per second across machines | Wide-column |
| "Friends of friends who like X" | Graph |

Many companies use several stores at once, a practice called polyglot persistence. An e-commerce site might keep orders in PostgreSQL, sessions in Redis and search data in Elasticsearch.

## OLTP: running the business

Online transaction processing (OLTP) systems handle the day-to-day operations: fee payments, enrollments, library issues. Their workload has a clear shape:

- many small transactions, each touching a few rows by key
- thousands of concurrent users
- normalized schemas, so each fact is stored once and updates stay correct
- fast responses measured in milliseconds

The database behind your college's student portal is an OLTP system.

## OLAP: understanding the business

Online analytical processing (OLAP) systems answer questions about large amounts of history: "average marks per department for the last ten years" or "which courses have falling enrollment". The workload is the opposite of OLTP:

- few users (analysts, dashboards) running large queries
- each query scans and aggregates millions of rows
- denormalized schemas, such as star schemas with a central fact table, to avoid expensive joins
- column-oriented storage, so a query reading three columns doesn't load the other forty

Snowflake, BigQuery, Redshift and ClickHouse are built for OLAP.

## Why the two are kept apart

Running a ten-year aggregate on the live student portal would compete with students paying fees for CPU, memory and locks, and the portal would slow down. So companies copy data from OLTP databases into a separate warehouse on a schedule, using ETL (extract, transform, load) or ELT pipelines. The warehouse is reorganized for analysis, and the operational database stays fast.

## How interviewers test this

Expect "OLTP vs OLAP" with a request for examples. Describe the workload of each (small keyed transactions versus large scans and aggregations), the schema style (normalized versus denormalized) and the storage layout (row versus column). For "SQL or NoSQL?", avoid picking a winner: name the access pattern first, then the model that fits it.`,
    sources: [CMU_445, SILBERSCHATZ]
  },

  "entities-and-attributes": {
    theory: `The entity-relationship (ER) model is a way to design a database on paper before writing any SQL. You identify the things the organization cares about (entities), the facts about them (attributes), and how they connect (relationships). This lesson covers entities and the six kinds of attributes, and shows how each kind turns into tables later.

## Why design before you create tables

Jumping straight to \`CREATE TABLE\` tends to produce tables shaped around the first screen someone built. ER modeling forces you to ask what the data means first. The diagram also gives everyone (developers, the registrar's office, examiners) one picture to check before anything is built.

## Entities and entity sets

An **entity** is one real-world thing you store data about: the student Ravi, the course DBMS, the hostel Block C. An **entity set** is the collection of all entities of the same type, such as all students. In an ER diagram an entity set is drawn as a rectangle.

An entity can be physical (a student, a book) or conceptual (an enrollment, a payment). The test is whether the organization needs to remember facts about it individually.

## Attributes and their domains

An **attribute** is a property of an entity, drawn as an oval connected to the rectangle. Each attribute has a **domain**, the set of values it may take: \`semester\` is an integer from 1 to 8, \`branch\` is one of a fixed list of department codes.

Attributes come in six kinds, and each kind changes how you build tables later.

## Simple and composite attributes

A **simple** attribute can't be split into meaningful parts: \`roll_no\`, \`cgpa\`. A **composite** attribute is made of smaller attributes. \`name\` can be split into first, middle and last name, and \`address\` into street, city and PIN code.

Composite attributes are drawn as an oval with child ovals. When you create tables, only the leaf parts become columns, so \`address\` becomes \`street\`, \`city\` and \`pin_code\`. Splitting it is useful when you need to filter by city; if you never will, a single column is fine.

## Single-valued and multivalued attributes

A **single-valued** attribute has one value per entity, such as \`date_of_birth\`. A **multivalued** attribute can have several, such as \`phone_numbers\` or \`email_ids\`. Multivalued attributes are drawn as a double oval.

A relational column holds one value, so a multivalued attribute becomes its own table, \`student_phone(roll_no, phone)\`, with one row per number. Storing "98400 11111, 97100 22222" in one column, or adding \`phone1\`, \`phone2\` and \`phone3\` columns, breaks first normal form and makes searching by phone number unreliable.

## Stored and derived attributes

A **derived** attribute can be computed from other data, so it usually isn't stored. \`age\` derives from \`date_of_birth\`, and \`total_credits\` derives from the student's enrollments. Derived attributes are drawn as a dashed oval.

Storing a derived value creates a copy that can go stale. A stored \`age\` is wrong a year later unless something updates it. Store the source value and compute the derived one when you query, unless the computation is too expensive. In that case, store it deliberately and keep it updated with a trigger or a scheduled job.

## Key attributes

A **key attribute** uniquely identifies each entity in the set, and it's shown underlined. For students it might be \`roll_no\` or \`email\`. A key can also be composite: a classroom might be identified by \`(building, room_number)\` together.

Choosing keys early matters, because keys become primary and foreign keys, which every relationship depends on. The relational model lesson covers the different kinds of keys in detail.

## Notation summary

| Kind | Example | ER notation | Becomes in tables |
|---|---|---|---|
| Simple | \`roll_no\` | Oval | One column |
| Composite | \`address\` | Oval with child ovals | One column per part |
| Multivalued | \`phone_numbers\` | Double oval | A separate table |
| Derived | \`age\` | Dashed oval | Usually not stored |
| Key | \`roll_no\` | Underlined name | Primary key |

## How interviewers test this

Questions usually ask you to classify attributes ("Is \`age\` derived or stored?") or to explain how a multivalued attribute is stored. The strongest answers connect the ER notation to the resulting tables, because that's the skill the ER model exists to build.`,
    sources: [SILBERSCHATZ, CMU_445]
  },

  "relationships-and-cardinality": {
    theory: `Relationships connect entities: a student enrolls in a course, a professor teaches a course, a department employs professors. Three properties describe each relationship: its degree (how many entity sets take part), its cardinality (how many of each can be linked), and participation (whether taking part is mandatory). This lesson explains each one with the college example, because getting them right decides where foreign keys go.

## Relationships and relationship sets

A **relationship** is an association between specific entities: Ravi enrolls in DBMS. A **relationship set** is all relationships of the same kind, drawn as a diamond connecting the entity rectangles.

Relationships can have their own attributes. Enrollment has a \`grade\` and a \`semester\`, and neither belongs to the student alone nor to the course alone. They describe the pairing, which matters later when you decide which table stores them.

## Degree

The degree is the number of entity sets involved:

- **Unary (recursive)**: one entity set in two roles. A professor mentors another professor; an employee manages other employees
- **Binary**: two entity sets. Student enrolls in course. Most relationships are binary
- **Ternary**: three entity sets. A professor teaches a course in a classroom; a doctor prescribes a medicine to a patient

A ternary relationship isn't the same as three binary ones. Knowing which professors taught which courses, which courses ran in which rooms, and which professors used which rooms doesn't tell you which professor taught which course in which room.

## Cardinality ratios

Cardinality says how many entities on one side can be linked to an entity on the other side:

- **One-to-one (1:1)**: each student has at most one library card, and each card belongs to at most one student
- **One-to-many (1:N)**: a department has many professors, but each professor belongs to one department
- **Many-to-many (M:N)**: a student takes many courses, and a course has many students

Cardinality comes from the organization's rules, not from today's data. If the rules allow a professor to belong to two departments, the relationship is M:N even if nobody does that yet.

## Participation

Participation says whether every entity must take part:

- **Total participation**: every entity in the set appears in at least one relationship. Every professor must belong to some department. Drawn as a double line
- **Partial participation**: some entities may not take part. Not every professor heads a department. Drawn as a single line

Participation and cardinality are independent. Department-professor is 1:N, with total participation on the professor side and partial participation on the department side (a newly created department might have no professors yet).

## Min-max notation

Many textbooks and tools combine both ideas into (min, max) pairs on each side. \`Professor (1,1) WORKS_IN (0,N) Department\` reads as: each professor works in at least 1 and at most 1 department, and each department has between 0 and many professors. The minimum captures participation, and the maximum captures cardinality.

## How these choices become tables

Cardinality decides the table design, and participation decides the constraints:

| Relationship | Table design |
|---|---|
| 1:N | Foreign key on the N side: \`professor.dept_id\` |
| 1:1 | Foreign key on either side, preferably the total-participation side, marked \`UNIQUE\` |
| M:N | A separate junction table: \`enrollment(roll_no, course_id, grade)\` |

Total participation becomes \`NOT NULL\` on the foreign key. If every professor must belong to a department, \`dept_id\` can't be empty. Relationship attributes, such as \`grade\`, go in the junction table for M:N relationships, or on the N side for 1:N relationships.

## Reading requirements carefully

Most modeling mistakes come from skimming the requirements. "Each course is taught by one professor" sets one side of the cardinality. "A professor may teach several courses or none" sets the other side and the participation. Underline phrases such as "each", "at least one", "exactly one" and "may" when you read a problem statement, because each one maps to a symbol on the diagram.

## A worked example

The rules say: "Each student has exactly one mentor from the faculty. A faculty member mentors up to ten students, and new faculty may mentor none." The relationship is binary between Student and Faculty, with cardinality N:1 (many students, one mentor). Student has total participation because every student has a mentor, and Faculty has partial participation. In tables, \`student.mentor_id\` is a \`NOT NULL\` foreign key. The limit of ten is a rule SQL can't express with a foreign key alone, so you enforce it with a trigger or in the transaction that assigns mentors.

## How interviewers test this

You'll be given a short scenario and asked for cardinality and participation, or asked how to store an M:N relationship. Always mention the junction table for M:N, and justify each choice by quoting the rule from the scenario.`,
    sources: [SILBERSCHATZ, CMU_445]
  },

  "weak-entities-and-extended-er": {
    theory: `Some entities can't be identified on their own, and some entity sets share most of their attributes with others. The ER model handles the first case with weak entities and the second with the extended ER (EER) features: specialization, generalization and aggregation. This lesson explains when to use each one and how it turns into tables.

## Strong and weak entities

A **strong entity** has its own key: a student has a roll number. A **weak entity** has no attribute set that is unique on its own, so it depends on another entity, its **owner**, for identification.

The classic example is an employee's dependents. Two employees can each have a child named Asha, so "Asha" doesn't identify a dependent. "Asha, dependent of employee 1042" does. In a college, the rooms of a hostel block work the same way: room 101 exists in Block A and in Block B, so a room is identified by its block plus its number.

## The pieces of a weak entity

A weak entity has three parts in an ER diagram:

- **Partial key (discriminator)**: the attribute that's unique within one owner, such as \`room_number\`. It's drawn with a dashed underline
- **Identifying relationship**: the link to the owner, drawn as a double diamond
- **Total participation**: every weak entity must belong to an owner, so the line is doubled

A weak entity also has existence dependency: if the owner is deleted, its weak entities lose their meaning and are deleted too.

## Weak entities as tables

The primary key of a weak entity's table is the owner's primary key plus the partial key, and the owner's key is also a foreign key:

~~~sql
CREATE TABLE room (
  block_id    INT NOT NULL REFERENCES hostel_block(block_id)
              ON DELETE CASCADE,
  room_number INT NOT NULL,
  capacity    INT,
  PRIMARY KEY (block_id, room_number)
);
~~~

The composite key stops two rooms in the same block from sharing a number, and \`ON DELETE CASCADE\` expresses existence dependency: removing a block removes its rooms.

## Specialization: top-down

Specialization splits a general entity set into more specific subtypes. Start with \`Person\`, then notice that students have a CGPA and semester while staff have a salary and designation. You create subtypes \`Student\` and \`Staff\` that inherit everything a person has (name, phone, address) and add their own attributes and relationships.

Specialization is worth doing when subtypes have different attributes or take part in different relationships. If the only difference is a label, a \`type\` column is enough.

## Generalization: bottom-up

Generalization runs the other way. You begin with \`Car\` and \`Truck\`, notice that both have a registration number, an owner and a model, and pull the shared attributes into a supertype \`Vehicle\`. The result looks the same as specialization; only the design process differs.

## Constraints on subtypes

Two independent questions describe how entities fall into subtypes:

- **Disjoint or overlapping**: can one entity belong to several subtypes? A vehicle is a car or a truck (disjoint). A person can be both a student and a staff member, such as a teaching assistant (overlapping)
- **Total or partial**: must every supertype entity belong to some subtype? Every vehicle must be a car or a truck (total), but some people are neither students nor staff, such as visiting parents (partial)

## Turning hierarchies into tables

There are three common table designs, each with trade-offs:

| Design | Tables | Good when | Cost |
|---|---|---|---|
| Table per type | \`person\`, plus \`student\` and \`staff\` referencing it | Subtypes differ a lot; overlap allowed | Joins to read a full record |
| Single table | One \`person\` table with nullable subtype columns and a \`type\` column | Few subtype attributes | Many NULLs, weaker constraints |
| Table per concrete class | Separate \`student\` and \`staff\`, each with all person columns | Disjoint, total hierarchies | Shared attributes duplicated; hard to query "all persons" |

## Aggregation

Aggregation treats a relationship as an entity so it can take part in another relationship. Suppose a student works on a project, and a faculty member monitors each student-project pairing, not the student alone or the project alone. You draw a box around the \`Student WORKS_ON Project\` relationship and connect \`MONITORS\` to the box. In tables, the monitoring relationship references the primary key of the \`works_on\` table.

## How interviewers test this

Common questions are "What is a weak entity?" (give the dependents or rooms example and the composite key) and "Specialization vs generalization" (top-down versus bottom-up, with the same result). For the table-design question, mention at least two of the three options and one trade-off of each.`,
    sources: [SILBERSCHATZ, CMU_445]
  },

  "er-to-relational-mapping": {
    theory: `An ER diagram is a design; tables are what the DBMS stores. ER-to-relational mapping is the step-by-step procedure that converts one into the other without losing information. This lesson walks through the rules in the order you apply them and finishes with the "minimum number of tables" questions common in placement tests.

## Step 1: strong entities

Each strong entity set becomes a table. Simple attributes become columns, the key attribute becomes the primary key, and composite attributes contribute only their leaf parts. Derived attributes are left out.

For the college example, \`Department\`, \`Professor\`, \`Student\` and \`Course\` each become a table.

## Step 2: weak entities

Each weak entity set becomes a table containing its own attributes plus the primary key of its owner. The primary key is the owner's key plus the partial key, and the owner's key is also a foreign key, usually with \`ON DELETE CASCADE\`.

## Step 3: binary 1:1 relationships

Add a foreign key on one side and mark it \`UNIQUE\` so the relationship stays one-to-one. Choose the side with total participation, because that column is then always filled and can be \`NOT NULL\`. If both sides have total participation and no other relationships, you can merge the two entities into one table.

## Step 4: binary 1:N relationships

Add the primary key of the "one" side as a foreign key on the "many" side. Each professor belongs to one department, so \`professor\` gets a \`dept_id\` column. Attributes of the relationship, such as \`joined_on\`, go on the same side as the foreign key.

## Step 5: M:N relationships

Create a new junction table holding the primary keys of both sides as foreign keys. Together, they form the junction table's primary key. Relationship attributes become columns of the junction table.

~~~sql
CREATE TABLE enrollment (
  roll_no   INT REFERENCES student(roll_no),
  course_id VARCHAR(10) REFERENCES course(course_id),
  grade     CHAR(2),
  PRIMARY KEY (roll_no, course_id)
);
~~~

The composite primary key stops a student from enrolling in the same course twice. If repeats are allowed (retaking a course in a later semester), add \`semester\` to the key.

## Step 6: multivalued attributes

Each multivalued attribute becomes a table with the owner's key and the value, and both columns form the primary key. A student's phone numbers become \`student_phone(roll_no, phone)\`.

## Step 7: n-ary relationships

A ternary (or higher) relationship becomes a table with a foreign key to each participating entity. The primary key is usually all of those foreign keys together, unless a cardinality constraint makes a subset sufficient.

## Step 8: specialization

Choose one of the three hierarchy designs from the previous lesson: a table per type, a single table with a type column, or a table per concrete subtype.

## Encoding participation and cardinality as constraints

Mapping isn't finished until the schema enforces the rules as well as representing them:

| ER rule | SQL constraint |
|---|---|
| Total participation | \`NOT NULL\` on the foreign key |
| 1:1 | \`UNIQUE\` on the foreign key |
| Existence dependency (weak entity) | \`ON DELETE CASCADE\` |
| Optional relationship | Nullable foreign key, often \`ON DELETE SET NULL\` |

A schema without these constraints stores the same shape of data but lets invalid rows in, such as a professor with no department when the rules forbid it.

## Minimum number of tables questions

Placement tests often give a small diagram and ask for the fewest tables needed. Apply the rules and merge wherever a relationship can be absorbed:

- Two strong entities with a 1:N relationship: **2 tables** (the relationship becomes a foreign key on the N side)
- Two strong entities with an M:N relationship: **3 tables** (a junction table is unavoidable)
- Two strong entities with a 1:1 relationship and total participation on both sides: **1 table** (merge them)
- Each multivalued attribute adds **1 table**

Work through the relationships one at a time and say which rule absorbed each one. The reasoning matters as much as the number.

## A full example

A college diagram has Department, Professor, Student and Course. Professor works in Department (N:1, total on professor), Course is offered by Department (N:1, total on course), and Student enrolls in Course (M:N, with grade). Applying the rules gives five tables: \`department\`, \`professor\` (with \`dept_id NOT NULL\`), \`course\` (with \`dept_id NOT NULL\`), \`student\`, and \`enrollment(roll_no, course_id, grade)\`.

## How interviewers test this

Expect either a minimum-tables question or "Where does the foreign key go in a 1:1 relationship?" State the rule, then the reason. For 1:1: put it on the total-participation side, so it's never NULL and can be \`NOT NULL UNIQUE\`.`,
    sources: [SILBERSCHATZ, CMU_445]
  },

  "relations-tuples-domains": {
    theory: `The relational model, proposed by E. F. Codd in 1970, describes all data as relations, which you know as tables. Its vocabulary sounds formal, but each term maps to something familiar, and a few precise properties explain why SQL behaves the way it does. This lesson defines the terms and shows where real SQL databases differ from the theory.

## Relations, tuples and attributes

A **relation** is a table, such as \`student\`. A **tuple** is one row: \`(101, 'Ravi', 'CSE', 8.4)\`. An **attribute** is one column: \`name\`. The **relation schema** is the table's definition, written as \`STUDENT(roll_no, name, branch, cgpa)\`.

Two sizes describe a relation. The **degree** (or arity) is the number of attributes, 4 here. The **cardinality** is the number of tuples, and it changes as students join and leave.

## Domains

A **domain** is the set of values an attribute may hold. The domain of \`branch\` is the list of department codes, and the domain of \`cgpa\` is decimals from 0 to 10. In SQL you express domains through data types and constraints:

~~~sql
cgpa   DECIMAL(4,2) CHECK (cgpa BETWEEN 0 AND 10),
branch VARCHAR(5) CHECK (branch IN ('CSE','ECE','ME','CE'))
~~~

Domains make comparisons meaningful. Comparing a roll number with a CGPA is legal arithmetic, but it's meaningless because the two come from different domains.

## The properties of a relation

Because a relation is defined as a mathematical set, it has these properties:

- **Atomic values**: each cell holds a single, indivisible value. This is first normal form
- **No duplicate tuples**: a set can't contain the same element twice
- **No row order**: the first row isn't special; any order is the same relation
- **No column order**: columns are identified by name, not position
- **One domain per column**: every value in a column comes from that column's domain

These properties are why the relational model can describe queries mathematically, which is what lets the DBMS rewrite and optimize your SQL safely.

## Where SQL departs from the theory

Real SQL databases relax three of these rules, and each difference causes common bugs:

- **Duplicates are allowed.** A SQL table without a primary key can hold identical rows, so SQL tables are multisets (bags), not sets. That's why \`SELECT\` keeps duplicates unless you write \`DISTINCT\`, and why every table should have a primary key
- **NULL exists.** The pure model has no "missing value". SQL adds \`NULL\` with three-valued logic, where comparisons can be true, false or unknown. \`NULL = NULL\` is unknown, not true
- **Order looks stable but isn't.** Rows often come back in insertion order, so developers assume it. The SQL standard guarantees no order without \`ORDER BY\`, and the order changes after updates, index changes or parallel query plans

## Why atomicity matters

Atomic values decide how searchable your data is. If \`subjects\` holds "DBMS, OS, CN" in one cell, finding every student who takes OS needs string matching that breaks on spacing and spelling. If each subject is its own row in \`enrollment\`, the question becomes an indexed equality lookup.

Atomicity is judged relative to how you query. A full name stored in one column is atomic if you never search by surname, and not atomic if you do.

## Relation instances change, schemas mostly don't

The relation schema is fixed by design, while the instance (the set of tuples) changes constantly. Constraints are written against the schema and must hold for every instance. A primary key isn't "unique in today's data"; it's unique in any data the database will ever be allowed to hold.

## Relational algebra and SQL build on these ideas

Every relational operation takes relations as input and produces a relation as output. Filtering rows, picking columns and joining tables all return new tables, which is why you can nest queries inside queries. The relational algebra lessons in this course formalize those operations, and the DBMS uses them internally to plan and rewrite your SQL.

## How interviewers test this

You'll get definition questions (degree versus cardinality, tuple versus attribute) and conceptual ones such as "Why can SQL tables have duplicate rows?" The strong answer explains that SQL uses bag semantics, while the relational model uses set semantics, and that primary keys restore set behaviour.`,
    sources: [SILBERSCHATZ, CMU_445, PG_DOCS]
  },

  "keys-in-dbms": {
    theory: `Keys are how a database tells rows apart and links tables together. Interviewers ask about keys more than almost any other DBMS topic, because getting them wrong causes duplicates, broken links and slow queries. This lesson defines every type of key, shows how they relate to each other, and explains how to choose a good primary key.

## The problem keys solve

Without a way to identify a row, you can't update "Ravi's CGPA" safely, because there might be two Ravis. Without a way to reference a row from another table, you can't record that Ravi enrolled in DBMS. Keys solve both problems: identification and reference.

## Super keys

A **super key** is any set of attributes whose values are unique for every row. In \`STUDENT(roll_no, email, aadhaar, name, branch)\`, \`{roll_no}\` is a super key, and so are \`{roll_no, name}\` and \`{email, branch}\`, because adding attributes to a unique set keeps it unique. Super keys are usually too big to be useful directly.

## Candidate keys

A **candidate key** is a minimal super key: remove any attribute and it stops being unique. Here \`{roll_no}\`, \`{email}\` and \`{aadhaar}\` are candidate keys. \`{roll_no, name}\` isn't, because \`roll_no\` alone already works. A relation can have several candidate keys, and each is a valid way to identify a row.

## Primary and alternate keys

The **primary key** is the candidate key you choose as the main identifier. It must be unique and can never be NULL. That rule is called entity integrity, because a row with no identity can't be referenced reliably. The candidate keys you didn't choose are **alternate keys**, and you should still enforce their uniqueness with \`UNIQUE\` constraints.

~~~sql
CREATE TABLE student (
  roll_no INT PRIMARY KEY,
  email   VARCHAR(100) NOT NULL UNIQUE,
  aadhaar CHAR(12) UNIQUE,
  name    VARCHAR(60) NOT NULL
);
~~~

The table above has one primary key and two alternate keys.

## Composite keys

A **composite key** uses two or more attributes together. In \`ENROLLMENT(roll_no, course_id, grade)\`, neither column is unique alone, since a student takes many courses and a course has many students. The pair is unique, so \`(roll_no, course_id)\` is the key.

## Foreign keys

A **foreign key** is a column (or set of columns) that refers to the primary key or a unique key of another table. \`enrollment.roll_no\` refers to \`student.roll_no\`. The DBMS then enforces referential integrity: you can't enroll a roll number that doesn't exist, and you can't delete a student who still has enrollments unless you choose a cascading action.

A foreign key may be NULL unless you forbid it. NULL means "no related row", such as a professor not yet assigned to a department.

## Natural versus surrogate keys

A **natural key** has business meaning, such as an email address or Aadhaar number. A **surrogate key** is an artificial value with no meaning, such as an auto-increment integer or a UUID.

| | Natural key | Surrogate key |
|---|---|---|
| Stability | Can change (people change emails) | Never changes |
| Size | Often long strings | Small integer or 16-byte UUID |
| Meaning | Readable in data | Opaque |
| Uniqueness risk | Real-world duplicates and data-entry errors | None |

The common practice is a surrogate primary key plus \`UNIQUE\` constraints on the natural keys. You get stable, compact references and still prevent duplicate emails.

## Counting super keys

Placement tests ask how many super keys a relation has. If the only candidate key is a single attribute A in a relation with n attributes, every super key must contain A, and each of the other n − 1 attributes can be in or out, giving 2^(n−1) super keys.

With two single-attribute candidate keys A and B, use inclusion-exclusion: super keys containing A, plus those containing B, minus those containing both. For R(A, B, C, D) that's 8 + 8 − 4 = 12.

## Primary key versus unique

A table has exactly one primary key, and its columns can't be NULL. It can have many \`UNIQUE\` constraints, and in most databases a unique column may hold NULLs, because NULL isn't equal to anything, including another NULL. Many databases also build the table's physical order (the clustered index) around the primary key, which affects performance.

## How interviewers test this

Expect "Difference between primary key and unique key", "Can a foreign key be NULL?" and "Super key vs candidate key". Answer each with a one-line definition and a concrete example from a student table. For the super-key counting question, show the 2^(n−1) reasoning instead of only the number.`,
    sources: [SILBERSCHATZ, PG_DOCS, CMU_445]
  },

  "integrity-constraints": {
    theory: `Integrity constraints are rules the database enforces on every change, no matter which program makes it. They're the last line of defence against bad data: a bug in one app, a careless script or a manual fix at midnight can't store a negative fee or an enrollment for a student who doesn't exist. This lesson covers each constraint type and the referential actions that decide what happens to related rows.

## Why the database should enforce rules

You could check every rule in application code, and you should still validate input there for good error messages. The database is the right final enforcer for one reason: it's the only component every write passes through. A college might have a web portal, a mobile app, an import script and an admin console, and only the database sees all of them.

## Domain constraints

Domain constraints restrict the values a column can hold. Data types are the basic form: a \`DATE\` column rejects "tomorrow-ish". \`CHECK\` constraints add custom rules:

~~~sql
marks    INT CHECK (marks BETWEEN 0 AND 100),
semester INT CHECK (semester BETWEEN 1 AND 8),
fee_paid DECIMAL(10,2) CHECK (fee_paid >= 0)
~~~

A \`CHECK\` can also compare columns in the same row, such as \`CHECK (end_date >= start_date)\`.

## NOT NULL and key constraints

\`NOT NULL\` says a value is required. Key constraints say values must be unique: \`PRIMARY KEY\` for the main identifier and \`UNIQUE\` for alternate keys such as email. Entity integrity is the rule that primary key columns are never NULL, and \`PRIMARY KEY\` enforces it automatically.

## Referential integrity

Referential integrity says every foreign key value must match an existing key in the referenced table, or be NULL. If \`enrollment.roll_no = 205\`, a student with roll number 205 must exist.

Four operations can break this rule:

- **Insert into the child** with a foreign key that doesn't exist
- **Update the child's** foreign key to a value that doesn't exist
- **Delete a parent row** that children still reference
- **Update a parent's key** that children still reference

Inserting a parent or deleting a child can never break it. The DBMS rejects the first two operations outright. For the last two, you choose the behaviour with a referential action.

## Referential actions

You declare the action on the foreign key:

~~~sql
FOREIGN KEY (dept_id) REFERENCES department(dept_id)
  ON DELETE SET NULL
  ON UPDATE CASCADE
~~~

The four main actions are:

| Action | Effect on child rows | Use when |
|---|---|---|
| \`RESTRICT\` / \`NO ACTION\` (default) | The parent change is rejected | Children must be handled explicitly first |
| \`CASCADE\` | Children are deleted or updated with the parent | Children can't exist alone (order items of an order) |
| \`SET NULL\` | The foreign key becomes NULL | The link is optional (a professor's department) |
| \`SET DEFAULT\` | The foreign key becomes its default | A sensible fallback parent exists |

The difference between \`RESTRICT\` and \`NO ACTION\` is timing: \`NO ACTION\` checks at the end of the statement (or transaction, if deferred), while \`RESTRICT\` checks immediately. Most of the time they behave the same.

## Choosing actions carefully

\`CASCADE\` is convenient and dangerous. Deleting one department could delete its courses, then their enrollments, then the grades students need for transcripts. Use it only where the child truly has no meaning without the parent, such as a weak entity. Use \`RESTRICT\` where losing children would be a serious mistake, and \`SET NULL\` where the relationship is optional.

## Assertions and triggers

Some rules span multiple rows or tables, such as "a student can enroll in at most 30 credits per semester". The SQL standard defines \`CREATE ASSERTION\` for these, but almost no database implements it. In practice, you enforce such rules with triggers (code that runs on insert or update), or in a transaction that checks the total before inserting.

## Deferred constraints

Sometimes a valid change briefly violates a constraint, such as inserting two rows that reference each other. PostgreSQL and Oracle let you mark a constraint \`DEFERRABLE INITIALLY DEFERRED\`, so it's checked at commit instead of after each statement.

## How interviewers test this

Typical questions: "Which operations can violate referential integrity?" (child insert or update, parent delete or update), and "When would you use \`ON DELETE CASCADE\`?" (when children can't exist without the parent, such as order items). Mention that MySQL's old MyISAM engine ignores foreign keys entirely, which shows you've seen this in practice.`,
    sources: [PG_DOCS, SILBERSCHATZ]
  }
};
