// Module 1 - Database Basics (8 lessons)
import { CourseLessonContent } from './types';

export const sqlBasicsLessons: Array<{
  slug: string;
  title: string;
  content: CourseLessonContent
}> = [
  {
    slug: "what-is-a-database",
    title: "What is a Database: Flat Files vs DBMS",
    content: {
      sections: [
        {
          type: "text",
          title: "Mental Model: The Ledger Spreadsheet vs The Vault Filing System",
          content: "Imagine tracking millions of bank transactions using a single shared **Excel spreadsheet (Flat File System)**:\n• **Data Redundancy & Anomaly**: Customer addresses are copy-pasted across 10,000 rows. When a customer moves, updating 9,999 rows leaves 1 row stale (Update Anomaly).\n• **Concurrency Collisions**: Two bank tellers open the Excel file at 9:00:00 AM. Teller A deposits $100; Teller B withdraws $50. Whoever clicks 'Save' last overwrites the other's work entirely (Lost Update Problem).\n• **Security & Integrity Violations**: Anyone with file access can accidentally type 'FREE MONEY' into a balance cell because text files lack strict mathematical constraint validation.\n\nA **Database Management System (DBMS)** is an ACID-compliant engine that acts as a secure, high-throughput financial vault: it guarantees atomic operations, enforces strict schema types, handles 50,000 concurrent read/write queries per second with multi-version concurrency control (MVCC), and ensures catastrophic crash recovery."
        },
        {
          type: "callout",
          title: "Formal Definition of DBMS",
          content: "A **Database Management System (DBMS)** is specialized system software designed to define, create, query, update, administer, and protect structured data. It abstracts low-level operating system disk block allocations and buffer pool caching behind declarative query interfaces (like SQL)."
        },
        {
          type: "table",
          title: "Flat File System vs Database Management System (DBMS)",
          headers: ["Dimension", "Flat File System (CSV / JSON / Text)", "Relational DBMS (PostgreSQL / MySQL)"],
          rows: [
            ["Data Redundancy", "High. Duplicated data leads to update, insertion, and deletion anomalies.", "Minimized through relational normalization (1NF–3NF)."],
            ["Concurrency Control", "Primitive file-level locks. Simultaneous writes corrupt or overwrite data.", "Granular row-level locks and Multi-Version Concurrency Control (MVCC)."],
            ["Crash Recovery", "System crash during file write causes file corruption or half-written records.", "Write-Ahead Logging (WAL) and redo/undo logs guarantee crash resilience."],
            ["Data Integrity", "No automatic type safety (e.g. string allowed in numeric price column).", "Enforced via strict constraints: PRIMARY KEY, FOREIGN KEY, CHECK, NOT NULL."],
            ["Query Performance", "O(N) full linear scans through entire files.", "O(log N) B+ Tree index lookups, query planners, and buffer cache pools."]
          ]
        },
        {
          type: "code",
          title: "Demonstrating Data Integrity Enforcement in SQL",
          code: "-- Creating a structured table with strict domain constraints\nCREATE TABLE bank_accounts (\n    account_id INT PRIMARY KEY,\n    account_holder VARCHAR(100) NOT NULL,\n    balance DECIMAL(12, 2) NOT NULL CHECK (balance >= 0.00),\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\n-- 1. Valid insertion\nINSERT INTO bank_accounts (account_id, account_holder, balance)\nVALUES (101, 'Alice Smith', 1500.50);\n\n-- 2. INVALID INSERTION: Negative balance triggers CHECK constraint rejection!\n-- Result: ERROR: new row for relation \"bank_accounts\" violates check constraint \"bank_accounts_balance_check\"\nINSERT INTO bank_accounts (account_id, account_holder, balance)\nVALUES (102, 'Bob Jones', -250.00);",
          language: "sql",
          explanation: "Unlike flat files where bad data silently corrupts systems, an RDBMS actively rejects illegal states at the engine level before data hits disk."
        },
        {
          type: "dryRun",
          title: "Execution Trace: The Lost Update Problem in Flat Files vs DBMS Isolation",
          code: "-- Scenario: Initial account balance = $1000\n-- Teller 1 deposits $200. Teller 2 withdraws $300 at the exact same millisecond.",
          steps: [
            { step: 1, explanation: "Flat File: Teller 1 and Teller 2 both read balance = $1000 into local memory buffers simultaneously." },
            { step: 2, explanation: "Flat File: Teller 1 computes $1000 + $200 = $1200 and writes to disk at t=10ms. Teller 2 computes $1000 - $300 = $700 and writes to disk at t=12ms. Final file balance = $700 (The $200 deposit was completely erased!)." },
            { step: 3, explanation: "DBMS (Transactions): Teller 1 begins transaction and acquires row lock. Teller 2 is queued." },
            { step: 4, explanation: "DBMS: Teller 1 updates balance to $1200 and commits. Row lock releases. Teller 2 reads authoritative new balance $1200, subtracts $300, and commits balance = $900. Total integrity preserved." }
          ]
        },
        {
          type: "warning",
          title: "Common Novice Assumption: A Database is NOT Just a Place to Dump JSON",
          content: "Beginners often ask: 'Why not just use MongoDB or JSON files for everything?' Relational databases provide mathematical guarantees of referential integrity and joins that document stores cannot enforce natively across collections. Use relational DBMS for financial, transactional, and relational domain models."
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "What are the 3 major anomalies caused by data redundancy in flat file storage?",
              trap: "Listing generic bugs like 'slow performance' or 'file size too big'.",
              solution: "The formal database anomalies are: 1. Insertion Anomaly (cannot record an entity without creating a dummy parent), 2. Deletion Anomaly (deleting one piece of info inadvertently wipes out unrelated historical data), 3. Update Anomaly (modifying data in one row leaves inconsistent copies elsewhere)."
            },
            {
              question: "Why can't operating system file locks replace a DBMS transaction manager?",
              trap: "Thinking OS file locks provide ACID properties.",
              solution: "OS locks are coarse-grained (entire file or byte-range), lack atomic multi-file coordination, have no undo/redo write-ahead logs for crash rollback, and do not provide SQL isolation levels (Read Committed, Serializable)."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "Which of the following scenarios describes an Update Anomaly in a poorly structured database or flat file system?",
          options: [
            "A query runs out of memory while computing an average.",
            "A customer's phone number is updated in the orders table, but remains outdated in the shipping table because the data was duplicated.",
            "Two users attempt to insert records with the same primary key.",
            "A hard drive failure wipes uncommitted transaction logs."
          ],
          correctIndex: 1,
          explanation: "An update anomaly occurs when data redundancy causes inconsistent data copies across different records after a partial modification."
        },
        {
          type: "takeaways",
          items: [
            "DBMS solves the 4 critical flaws of flat files: redundancy anomalies, concurrency collisions, lack of integrity constraints, and crash vulnerability.",
            "Relational databases enforce strict mathematical schemas with declarative SQL interfaces.",
            "Concurrency control mechanisms (like MVCC and locking) prevent lost updates and race conditions during high-volume operations.",
            "Write-Ahead Logging (WAL) ensures full durability and recovery even during power outages."
          ]
        }
      ]
    }
  },
  {
    slug: "relational-model-and-rdbms",
    title: "The Relational Model & Codd's Foundations",
    content: {
      sections: [
        {
          type: "text",
          title: "Mental Model: Mathematical Sets and Cartesian Grids",
          content: "In 1970, Dr. Edgar F. Codd revolutionized computing with a radical proposal: **separate how data is physically stored on magnetic tape/disk from how humans logically view and query it**.\n• In the Relational Model, data is represented as **Relations (Tables)**.\n• A relation is mathematically a **set of tuples (unordered rows)** where every element in a tuple corresponds to an **attribute (column)** belonging to a specific domain (data type).\n• Because a relation is a mathematical set: **row order does NOT matter, duplicate rows are forbidden by definition, and column order is irrelevant**."
        },
        {
          type: "callout",
          title: "Codd's Relational Terminology vs Everyday SQL Terms",
          content: "• **Relation** $\\leftrightarrow$ **Table**\n• **Tuple** $\\leftrightarrow$ **Row / Record**\n• **Attribute** $\\leftrightarrow$ **Column / Field**\n• **Domain** $\\leftrightarrow$ **Data Type / Set of Permitted Values**\n• **Cardinality** $\\leftrightarrow$ **Total Number of Rows ($N$)**\n• **Degree (Arity)** $\\leftrightarrow$ **Total Number of Columns ($K$)**"
        },
        {
          type: "table",
          title: "Relational Theory vs SQL Implementation Nuances",
          headers: ["Relational Model (Pure Math)", "SQL Standard (Practical Engineering)", "Why the Difference Exists"],
          rows: [
            ["Relations are pure sets (no duplicate tuples allowed).", "Tables are multisets/bags (duplicates allowed unless PRIMARY KEY or UNIQUE constraint is defined).", "Eliminating duplicates on every query has high performance overhead ($O(N \\log N)$ sort/hash)."],
            ["Tuple order is strictly undefined.", "Row order is undefined unless explicit `ORDER BY` is specified.", "Query engines return rows according to disk storage layout or parallel execution threads."],
            ["Attributes are atomic (1NF indivisible values).", "Columns have primitive datatypes (INT, VARCHAR, DATE), with modern extensions for JSONB/Arrays.", "Guarantees predictable joins and relational algebra operations."],
            ["Data Access via Relational Calculus / Algebra.", "Declarative Structured Query Language (SQL).", "Allows query optimizer to rewrite queries into optimal execution plans."]
          ]
        },
        {
          type: "code",
          title: "Cardinality and Degree in Action",
          code: "-- Creating a relation 'students'\n-- Degree (Arity) = 4 (student_id, full_name, email, gpa)\nCREATE TABLE students (\n    student_id INT PRIMARY KEY,\n    full_name VARCHAR(50) NOT NULL,\n    email VARCHAR(100) UNIQUE NOT NULL,\n    gpa DECIMAL(3, 2) CHECK (gpa >= 0.0 AND gpa <= 4.0)\n);\n\n-- Inserting 3 tuples -> Cardinality = 3\nINSERT INTO students (student_id, full_name, email, gpa) VALUES\n(1, 'Aditi Sharma', 'aditi@univ.edu', 3.85),\n(2, 'Rahul Verma', 'rahul@univ.edu', 3.60),\n(3, 'Sneha Patel', 'sneha@univ.edu', 3.92);\n\n-- Querying metadata in PostgreSQL to verify Degree and Cardinality\nSELECT COUNT(*) AS cardinality FROM students; -- Result: 3\nSELECT COUNT(*) AS degree FROM information_schema.columns WHERE table_name = 'students'; -- Result: 4",
          language: "sql",
          explanation: "Degree is the static column count (4). Cardinality is the dynamic row count (3) which changes as records are inserted or deleted."
        },
        {
          type: "dryRun",
          title: "Step-by-Step Relational Set Operations",
          code: "-- Set Union of Two Relations A and B\n-- Relation A: { (1, 'Alice'), (2, 'Bob') }\n-- Relation B: { (2, 'Bob'), (3, 'Charlie') }\n-- Query: SELECT * FROM A UNION SELECT * FROM B;",
          steps: [
            { step: 1, explanation: "Engine scans relation A and emits `(1, 'Alice')` and `(2, 'Bob')` into temporary hash set." },
            { step: 2, explanation: "Engine scans relation B and evaluates `(2, 'Bob')`. Since it already exists in the set, it is deduplicated." },
            { step: 3, explanation: "Engine evaluates `(3, 'Charlie')` and adds it to the hash set." },
            { step: 4, explanation: "Final result set contains 3 unique tuples: `{(1, 'Alice'), (2, 'Bob'), (3, 'Charlie')}`." }
          ]
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "What is the difference between Cardinality and Degree of a table?",
              trap: "Swapping the two terms or confusing degree with relationship cardinality (1:N).",
              solution: "Degree (or Arity) is the number of **columns/attributes** in a relation. Cardinality is the number of **rows/tuples** currently stored in the relation."
            },
            {
              question: "Does SQL guarantee that `SELECT * FROM table;` will return rows in insertion order?",
              trap: "Saying 'Yes, it always returns rows in the order they were inserted'.",
              solution: "NO! In the relational model and SQL standard, table rows are an unordered set. Without an explicit `ORDER BY` clause, row return order is non-deterministic (dependent on vacuuming, index scans, or parallel worker execution)."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "If a database table `employees` has 5 columns and 1,200 rows, what is its Degree and Cardinality?",
          options: [
            "Degree = 1200, Cardinality = 5",
            "Degree = 5, Cardinality = 1200",
            "Degree = 6000, Cardinality = 1",
            "Degree = 5, Cardinality = 5"
          ],
          correctIndex: 1,
          explanation: "Degree is the number of columns (5) and Cardinality is the number of tuples/rows (1200)."
        },
        {
          type: "takeaways",
          items: [
            "The Relational Model separates logical data structures from physical disk storage.",
            "A Relation is a set of Tuples; SQL Tables are multisets that permit duplicate rows unless constrained.",
            "Degree = Number of columns (attributes); Cardinality = Number of rows (tuples).",
            "Without an explicit ORDER BY clause, SQL query result order is fundamentally non-deterministic."
          ]
        }
      ]
    }
  },
  {
    slug: "tables-rows-and-columns",
    title: "Tables, Rows & Columns: Schema vs Instance",
    content: {
      sections: [
        {
          type: "text",
          title: "Mental Model: The Architectural Blueprint vs The Occupied Building",
          content: "To understand relational database architecture, distinguish between **Schema** and **Instance**:\n• **Database Schema (Intension / Blueprint)**: The structural skeleton defined at design time. It dictates table names, column data types, field lengths, default values, and foreign key relationships. Schemas change rarely via DDL (`ALTER TABLE`).\n• **Database Instance (Extension / State)**: The actual snapshot of data inhabiting the database at an exact point in time (e.g. at 14:02:15 UTC on Sept 30). Instances change thousands of times a second via DML (`INSERT`, `UPDATE`, `DELETE`)."
        },
        {
          type: "callout",
          title: "Three-Schema Architecture (ANSI/SPARC Framework)",
          content: "1. **External Schema (View Level)**: Tailored views for specific end-users (e.g., HR sees employee salaries; Team Lead sees employee projects but salaries are hidden).\n2. **Conceptual Schema (Logical Level)**: The complete relational design of all tables, columns, and constraints (Entity-Relationship design).\n3. **Internal Schema (Physical Level)**: How bytes are stored on disk (B+ Tree page files, block sizes, compression, heap files)."
        },
        {
          type: "table",
          title: "Common SQL Data Types Matrix",
          headers: ["Category", "SQL Data Type", "Storage / Range", "Best Use Case"],
          rows: [
            ["Integer", "INT / INTEGER", "4 bytes ($-2^{31}$ to $2^{31}-1$)", "Standard surrogate IDs, counts, quantities."],
            ["Integer", "BIGINT", "8 bytes ($-2^{63}$ to $2^{63}-1$)", "High-volume transactional event logs, globally unique IDs."],
            ["Exact Decimal", "DECIMAL(p, s) / NUMERIC", "Exact precision (p=total digits, s=scale/decimals)", "Financial balances, prices, currency (NO floating-point rounding errors)."],
            ["String (Fixed)", "CHAR(n)", "Fixed length $n$ bytes (space-padded)", "Fixed-length codes: ISO country codes (`CHAR(2)`), currency codes (`CHAR(3)`)."],
            ["String (Variable)", "VARCHAR(n)", "Variable length up to $n$ characters", "Names, emails, descriptions, addresses."],
            ["Temporal", "TIMESTAMP WITH TIME ZONE", "8 bytes (Date + Time + UTC offset)", "Audit logs (`created_at`), event scheduling across global zones."]
          ]
        },
        {
          type: "code",
          title: "Defining Schemas and Querying Schema Metadata",
          code: "-- 1. Defining the Schema (Logical Structure)\nCREATE TABLE products (\n    product_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n    sku CHAR(8) NOT NULL UNIQUE,          -- E.g. 'PROD1092'\n    product_name VARCHAR(150) NOT NULL,\n    unit_price DECIMAL(10, 2) NOT NULL,   -- Up to $99,999,999.99 exact\n    is_active BOOLEAN DEFAULT TRUE,\n    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP\n);\n\n-- 2. Creating an Instance (Populating with dynamic data)\nINSERT INTO products (sku, product_name, unit_price) \nVALUES ('TECH4091', 'Noise-Cancelling Headphones', 199.99);\n\n-- 3. Schema Evolution (Altering structure)\nALTER TABLE products ADD COLUMN stock_quantity INT DEFAULT 0 CHECK (stock_quantity >= 0);",
          language: "sql",
          explanation: "Notice the strict precision of DECIMAL(10,2) for financial math and CHAR(8) for fixed-length SKUs to optimize disk alignment and indexing."
        },
        {
          type: "dryRun",
          title: "Why Float/Double Must NEVER Be Used for Currency in SQL",
          code: "-- Testing IEEE 754 Floating Point in SQL vs Exact DECIMAL\nSELECT CAST(0.1 AS FLOAT) + CAST(0.2 AS FLOAT) AS float_sum,\n       CAST(0.1 AS DECIMAL(4,2)) + CAST(0.2 AS DECIMAL(4,2)) AS decimal_sum;",
          steps: [
            { step: 1, explanation: "Float utilizes binary fractional approximation ($1/2 + 1/4 + 1/8...$). 0.1 cannot be represented precisely in binary base-2." },
            { step: 2, explanation: "`float_sum` evaluates to `0.30000000000000004`." },
            { step: 3, explanation: "`decimal_sum` uses base-10 packed decimal arithmetic and evaluates to exact `0.30`." },
            { step: 4, explanation: "In banking, accumulating millions of float rounding errors results in financial reconciliation failure." }
          ]
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "When should you use CHAR(N) instead of VARCHAR(N)?",
              trap: "Using VARCHAR for everything or using CHAR(255) for variable names.",
              solution: "Use CHAR(N) ONLY when values have a strictly fixed length across all rows (e.g. SHA-256 hash `CHAR(64)`, US State Code `CHAR(2)`, UUID without dashes `CHAR(32)`). For varying lengths, VARCHAR avoids space-padding wasted bytes."
            },
            {
              question: "What is the difference between Schema Independence (Physical vs Logical)?",
              trap: "Confusing physical disk storage changes with view alterations.",
              solution: "Physical Data Independence: Changing physical storage (creating indexes, changing file paths) does not affect conceptual schema or application SQL queries. Logical Data Independence: Changing the conceptual schema (adding columns/tables) does not break external views."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "Which data type should always be chosen for storing monetary transactions and account balances in a production database?",
          options: [
            "FLOAT",
            "DOUBLE PRECISION",
            "DECIMAL(p, s) / NUMERIC",
            "BIGINT (multiplied by 1000 without decimal type)"
          ],
          correctIndex: 2,
          explanation: "DECIMAL/NUMERIC stores exact fixed-point numbers with exact decimal precision, preventing floating-point rounding errors."
        },
        {
          type: "takeaways",
          items: [
            "Schema is the structural blueprint (static design); Instance is the database state at a specific point in time (dynamic data).",
            "The 3-schema architecture provides Physical and Logical Data Independence.",
            "Always use DECIMAL/NUMERIC for monetary values; never use FLOAT/DOUBLE for financial transactions.",
            "Use CHAR for strictly fixed-length codes and VARCHAR for variable-length text."
          ]
        }
      ]
    }
  },
  {
    slug: "keys-primary-foreign-candidate",
    title: "Keys in Relational Databases: Primary, Foreign & Candidate",
    content: {
      sections: [
        {
          type: "text",
          title: "Mental Model: Government Identification & Passport Linkage",
          content: "Think of relational keys as **National Identity & Family Registry**:\n• **Super Key (Any set of identifiers that uniquely identifies a citizen)**: `{SSN}`, `{SSN, Favorite Color}`, `{SSN, Hair Color, Full Name}`. All can uniquely find a person, but many contain useless clutter.\n• **Candidate Key (A minimal Super Key)**: Stripped of all redundant attributes. Examples: `{SSN}` or `{Passport_Number}` or `{Driver_License_No}`.\n• **Primary Key (The chosen representative)**: The database architect picks ONE candidate key (e.g., `{SSN}` or auto-incrementing `user_id`) as the official unique row identifier.\n• **Alternate Key**: The remaining candidate keys that were not chosen as Primary Key (e.g. `{Passport_Number}`). They are enforced with `UNIQUE NOT NULL`.\n• **Foreign Key (The Parent Reference)**: A child's birth certificate lists `{Mother_SSN}`. The child's record cannot reference a mother who does not exist in the citizen database (Referential Integrity)."
        },
        {
          type: "callout",
          title: "The Mathematical Key Hierarchy",
          content: "$$\\text{Primary Key} \\subseteq \\text{Candidate Keys} \\subseteq \\text{Super Keys}$$\n• Every Candidate Key is a Super Key.\n• Not every Super Key is a Candidate Key (because Super Keys may contain non-essential columns).\n• The Primary Key is chosen from the set of Candidate Keys and automatically enforces `UNIQUE` and `NOT NULL` invariants."
        },
        {
          type: "table",
          title: "Relational Key Classifications",
          headers: ["Key Type", "Uniqueness", "NULL Allowed?", "Count Per Table", "Primary Purpose"],
          rows: [
            ["Primary Key (PK)", "Must be 100% Unique", "NO (Never NULL)", "Exactly 1 per table", "Authoritative unique row identifier; automatically creates clustered/primary index."],
            ["Candidate Key", "Must be 100% Unique", "NO", "1 or more", "Eligible minimal super keys capable of serving as Primary Key."],
            ["Alternate Key", "Must be 100% Unique", "NO / YES (if nullable)", "0 or more", "Candidate keys not chosen as the Primary Key (enforced with UNIQUE constraint)."],
            ["Foreign Key (FK)", "Non-unique (1:N) or Unique (1:1)", "YES (unless specified NOT NULL)", "0 or more", "Enforces Referential Integrity by referencing a Primary/Unique Key in a parent table."],
            ["Composite Key", "Combination of columns is Unique", "NO (for PK components)", "Part of PK/Unique", "A key composed of 2 or more columns (e.g. `order_id + item_id`)."]
          ]
        },
        {
          type: "code",
          title: "Primary Key, Foreign Key & Referential Actions in SQL",
          code: "-- 1. Parent Table (Departments)\nCREATE TABLE departments (\n    dept_id INT PRIMARY KEY,\n    dept_name VARCHAR(50) NOT NULL UNIQUE\n);\n\n-- 2. Child Table (Employees) with Foreign Key\nCREATE TABLE employees (\n    emp_id INT PRIMARY KEY,\n    full_name VARCHAR(100) NOT NULL,\n    email VARCHAR(100) UNIQUE NOT NULL, -- Alternate Candidate Key\n    dept_id INT NOT NULL,\n    \n    -- Enforcing Referential Integrity with CASCADE delete rule\n    CONSTRAINT fk_employee_department\n        FOREIGN KEY (dept_id)\n        REFERENCES departments(dept_id)\n        ON DELETE RESTRICT      -- Blocks deleting department if employees exist!\n        ON UPDATE CASCADE       -- Updates child dept_id if parent dept_id changes\n);\n\n-- Inserting valid parent and child\nINSERT INTO departments VALUES (10, 'Engineering');\nINSERT INTO employees VALUES (101, 'Kavita Rao', 'kavita@co.com', 10);\n\n-- ILLEGAL: Attempting to insert employee for non-existent Department 99\n-- Result: ERROR: insert or update on table \"employees\" violates foreign key constraint\n-- INSERT INTO employees VALUES (102, 'Dev Patel', 'dev@co.com', 99);",
          language: "sql",
          explanation: "Foreign key constraints make it physically impossible for orphaned records to exist in the child table."
        },
        {
          type: "table",
          title: "ON DELETE / ON UPDATE Referential Actions",
          headers: ["Referential Action", "Behavior When Parent Row Is Deleted / Updated", "Best Use Case"],
          rows: [
            ["ON DELETE RESTRICT / NO ACTION", "Rejects the parent deletion and throws foreign key constraint error.", "Protecting critical parents (cannot delete Department if employees still assigned)."],
            ["ON DELETE CASCADE", "Automatically deletes all child rows referencing the deleted parent row.", "Parent-Child composition: Deleting an `Order` automatically deletes all `OrderItems`."],
            ["ON DELETE SET NULL", "Sets child foreign key column to `NULL` (FK column must be nullable).", "Non-mandatory references: Deleting a `Manager` sets employee's `manager_id` to NULL."],
            ["ON DELETE SET DEFAULT", "Sets child foreign key column to its defined column default.", "Fallback associations."]
          ]
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "Can a Primary Key consist of multiple columns (Composite Primary Key)?",
              trap: "Thinking a table can have multiple Primary Keys.",
              solution: "A table can only have ONE Primary Key, but that single Primary Key can be composed of multiple columns (e.g. `PRIMARY KEY (student_id, course_id)`). This is a Composite Primary Key."
            },
            {
              question: "Can a Foreign Key reference a column that is NOT a Primary Key in the parent table?",
              trap: "Answering 'No, foreign keys must always reference the primary key'.",
              solution: "A Foreign Key can reference ANY column in the parent table, provided that column has a `UNIQUE` constraint or is a `PRIMARY KEY` (referential target must be guaranteed unique)."
            },
            {
              question: "What is the difference between Surrogate Key and Natural Key?",
              trap: "Confusing artificial IDs with business domain identifiers.",
              solution: "A Natural Key is a real-world attribute with business meaning (e.g. SSN, ISBN, VIN). A Surrogate Key is an artificial, system-generated integer/UUID (e.g. `id BIGSERIAL`) that has zero business meaning and never changes."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "Given a relation with candidate keys {A, B} and {A, C}. Which statement is TRUE regarding Super Keys?",
          options: [
            "{A, B, D} is a Super Key.",
            "{A} is a Candidate Key.",
            "{B, C} is guaranteed to be a Candidate Key.",
            "The table cannot have a Primary Key."
          ],
          correctIndex: 0,
          explanation: "Since {A, B} is a candidate key (minimal super key), any superset containing {A, B} (such as {A, B, D}) is by definition a Super Key."
        },
        {
          type: "takeaways",
          items: [
            "Super Key = Any set of attributes uniquely identifying a tuple.",
            "Candidate Key = Minimal Super Key with zero redundant attributes.",
            "Primary Key = The chosen candidate key (enforces Unique + Not Null); exactly 1 per table.",
            "Foreign Key enforces Referential Integrity between tables, preventing orphaned child rows.",
            "Referential actions (CASCADE, RESTRICT, SET NULL) define child behavior when parent records change."
          ]
        }
      ]
    }
  },
  {
    slug: "null-values-and-three-valued-logic",
    title: "NULL Values & Three-Valued Logic (3VL)",
    content: {
      sections: [
        {
          type: "text",
          title: "Mental Model: The Sealed Secret Box",
          content: "Think of `NULL` in SQL as a **Sealed Black Box with Unknown Contents**:\n• `NULL` is **NOT equal to zero (`0`)** (Zero is a known integer quantity).\n• `NULL` is **NOT equal to an empty string (`''`)** (An empty string is a known string of length 0).\n• `NULL` means **\"Unknown\", \"Missing\", or \"Not Applicable\"**.\n\nIf you place two sealed black boxes on a table and ask: *\"Are the secret contents inside Box A identical to Box B?\"*, the only truthful answer is **\"I DO NOT KNOW\" (`UNKNOWN`)**! Therefore, in SQL: `NULL = NULL` does NOT evaluate to `TRUE`—it evaluates to `UNKNOWN`!"
        },
        {
          type: "callout",
          title: "Three-Valued Logic (3VL) Truth Values",
          content: "In classical Boolean logic, expressions evaluate to `TRUE` or `FALSE`. In SQL, comparisons involving `NULL` evaluate to a third logical state: **`UNKNOWN`**.\n\nIn a `WHERE` clause, a row is returned **ONLY if the condition evaluates to `TRUE`**. Conditions that evaluate to `FALSE` or `UNKNOWN` are excluded!"
        },
        {
          type: "table",
          title: "SQL Three-Valued Logic (3VL) Truth Tables",
          headers: ["Operand A", "Operator", "Operand B", "Result"],
          rows: [
            ["TRUE", "AND", "UNKNOWN", "UNKNOWN"],
            ["FALSE", "AND", "UNKNOWN", "FALSE (Short-circuits: False and anything is False)"],
            ["TRUE", "OR", "UNKNOWN", "TRUE (Short-circuits: True or anything is True)"],
            ["FALSE", "OR", "UNKNOWN", "UNKNOWN"],
            ["NOT", "UNKNOWN", "-", "UNKNOWN"],
            ["5", "=", "NULL", "UNKNOWN"],
            ["NULL", "=", "NULL", "UNKNOWN (Never True!)"],
            ["NULL", "IS NULL", "-", "TRUE"],
            ["5", "IS NOT NULL", "-", "TRUE"]
          ]
        },
        {
          type: "code",
          title: "The Classic NULL Comparison Bug in SQL Queries",
          code: "-- Creating a customer table with optional referral codes\nCREATE TABLE customers (\n    customer_id INT PRIMARY KEY,\n    name VARCHAR(50) NOT NULL,\n    referral_code VARCHAR(20) -- Contains NULL if signed up directly\n);\n\nINSERT INTO customers VALUES\n(1, 'Alice', 'FRIEND50'),\n(2, 'Bob', NULL),\n(3, 'Charlie', 'VIP100');\n\n-- ❌ FATAL BUG: Attempting to find customers who DO NOT have referral code 'FRIEND50'\n-- You expect Bob and Charlie (2 rows). BUT IT ONLY RETURNS CHARLIE!\nSELECT * FROM customers WHERE referral_code <> 'FRIEND50';\n-- Why? For Bob, NULL <> 'FRIEND50' evaluates to UNKNOWN! WHERE excludes UNKNOWN.\n\n-- ✅ CORRECT QUERY: Explicitly handling NULL with 'IS NULL'\nSELECT * FROM customers \nWHERE referral_code <> 'FRIEND50' OR referral_code IS NULL;\n\n-- ✅ ALTERNATIVE: Using COALESCE\nSELECT * FROM customers \nWHERE COALESCE(referral_code, '') <> 'FRIEND50';",
          language: "sql",
          explanation: "In SQL, standard inequality operators (<>, !=) drop NULL rows because NULL compared to any value produces UNKNOWN."
        },
        {
          type: "dryRun",
          title: "Step-by-Step Evaluation of NOT IN with NULL Subqueries",
          code: "-- Query: Find departments that have NO employees assigned\n-- Scenario: employee.dept_id contains values (10, 20, NULL)\nSELECT * FROM departments WHERE dept_id NOT IN (SELECT dept_id FROM employees);",
          steps: [
            { step: 1, explanation: "SQL expands `NOT IN (10, 20, NULL)` into: `dept_id <> 10 AND dept_id <> 20 AND dept_id <> NULL`." },
            { step: 2, explanation: "For Department 30: `30 <> 10` is TRUE. `30 <> 20` is TRUE. But `30 <> NULL` is UNKNOWN." },
            { step: 3, explanation: "Expression simplifies to: `TRUE AND TRUE AND UNKNOWN` &rarr; `UNKNOWN`." },
            { step: 4, explanation: "Because the final result is UNKNOWN for EVERY department, the query returns ZERO rows! (Always use `NOT EXISTS` instead of `NOT IN` with nullable subqueries)." }
          ]
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "Why does writing `WHERE column = NULL` cause queries to silently return 0 rows?",
              trap: "Writing `WHERE column = NULL` instead of `WHERE column IS NULL` causes the equality check to evaluate to UNKNOWN for every row.",
              solution: "Always use `IS NULL` or `IS NOT NULL` for NULL predicates. Standard equality `= NULL` always evaluates to UNKNOWN."
            },
            {
              question: "Why is using `NOT IN` dangerous when subqueries contain NULL values?",
              trap: "Using `NOT IN` on a subquery that returns a single NULL evaluates the entire outer query to UNKNOWN and returns empty results.",
              solution: "Use `NOT EXISTS (SELECT 1 FROM child WHERE child.fk = parent.pk)` or filter `WHERE fk IS NOT NULL` inside the `IN` subquery."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "What is the result of the SQL expression: `SELECT 1 WHERE NULL = NULL;`?",
          options: [
            "Returns 1 row containing `1`.",
            "Returns 0 rows (Empty Result).",
            "Throws a syntax error.",
            "Returns `NULL`."
          ],
          correctIndex: 1,
          explanation: "`NULL = NULL` evaluates to `UNKNOWN`. In a `WHERE` clause, only `TRUE` passes the filter, so 0 rows are returned."
        },
        {
          type: "takeaways",
          items: [
            "NULL represents unknown/missing data; it is not 0, false, or empty string.",
            "Comparisons with NULL yield UNKNOWN in Three-Valued Logic (3VL).",
            "WHERE clauses strictly require TRUE; UNKNOWN conditions are discarded.",
            "Always use `IS NULL` / `IS NOT NULL` instead of `= NULL`.",
            "Beware of the `NOT IN` trap when subqueries contain NULLs—prefer `NOT EXISTS`."
          ]
        }
      ]
    }
  },
  {
    slug: "database-constraints",
    title: "Database Constraints: Integrity Guards",
    content: {
      sections: [
        {
          type: "text",
          title: "Mental Model: Border Security Checks at the Gate",
          content: "Think of Database Constraints as **Automated Airport Security Checkpoints**:\n• **NOT NULL (Mandatory Passport)**: You cannot board without presenting identification.\n• **UNIQUE (Biometric Fingerprint)**: No two passengers can share the exact same fingerprint in the flight manifest.\n• **CHECK (Luggage Weight Limit)**: Baggage weight must be $\\le 23\\text{ kg}$ and $> 0$. Bags exceeding the limit are rejected at check-in.\n• **PRIMARY KEY (Boarding Pass Barcode)**: Combines passport verification (`NOT NULL`) and seat uniqueness (`UNIQUE`).\n• **FOREIGN KEY (Flight Number Reference)**: Passenger's ticket must reference an existing scheduled flight in the departures master table.\n• **DEFAULT (Default Meal Option)**: If you don't specify a dietary preference, you automatically receive 'Standard Meal'."
        },
        {
          type: "callout",
          title: "Why Enforce Constraints in the Database vs Application Code?",
          content: "Application code bugs, multiple microservices connecting to the same DB, direct admin scripts, and race conditions can bypass backend validation. Database constraints are the **ultimate authoritative source of truth**—they cannot be bypassed regardless of which client or language executes the query."
        },
        {
          type: "table",
          title: "The 6 Core SQL Constraints",
          headers: ["Constraint", "Enforcement Level", "Allows NULL?", "Typical Application"],
          rows: [
            ["NOT NULL", "Column Level", "NO", "Mandatory fields: `email`, `created_at`, `user_id`."],
            ["UNIQUE", "Column / Table Level", "YES (Multiple NULLs allowed in most SQL engines)", "Alternative keys: `phone_number`, `ssn`, `slug`."],
            ["PRIMARY KEY", "Column / Table Level", "NO (Implicit NOT NULL)", "Unique row identification: `account_id`."],
            ["FOREIGN KEY", "Column / Table Level", "YES (unless marked NOT NULL)", "Relational integrity: `order.customer_id -> customer.id`."],
            ["CHECK", "Column / Table Level", "YES (Evaluates to True if NULL!)", "Domain rules: `age >= 18`, `discount BETWEEN 0 AND 100`."],
            ["DEFAULT", "Column Level", "-", "Fallback values: `status DEFAULT 'PENDING'`, `is_active DEFAULT TRUE`."]
          ]
        },
        {
          type: "code",
          title: "Comprehensive Table Creation with Named Constraints",
          code: "CREATE TABLE user_subscriptions (\n    subscription_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,\n    user_id INT NOT NULL,\n    plan_name VARCHAR(20) NOT NULL,\n    monthly_fee DECIMAL(8, 2) NOT NULL,\n    discount_percent INT DEFAULT 0,\n    start_date DATE NOT NULL,\n    end_date DATE,\n    status VARCHAR(15) DEFAULT 'ACTIVE',\n\n    -- NAMED CONSTRAINTS (Crucial for clear debugging in production logs!)\n    CONSTRAINT chk_plan_name CHECK (plan_name IN ('FREE', 'PRO', 'ENTERPRISE')),\n    CONSTRAINT chk_discount_range CHECK (discount_percent BETWEEN 0 AND 100),\n    CONSTRAINT chk_positive_fee CHECK (monthly_fee >= 0.00),\n    CONSTRAINT chk_date_order CHECK (end_date IS NULL OR end_date >= start_date),\n    CONSTRAINT uq_user_active_plan UNIQUE (user_id, plan_name)\n);\n\n-- Adding constraint to existing table with validation\nALTER TABLE user_subscriptions \nADD CONSTRAINT chk_valid_status CHECK (status IN ('ACTIVE', 'PAUSED', 'CANCELLED'));",
          language: "sql",
          explanation: "Always name your constraints explicitly (e.g. `chk_plan_name`). If a constraint is violated, production logs will print the exact constraint name instead of an obscure cryptic system error."
        },
        {
          type: "dryRun",
          title: "Execution Trace: CHECK Constraints and NULL Values",
          code: "-- Evaluating: CHECK (age >= 18)\n-- Row 1: age = 21 -> (21 >= 18) = TRUE -> PASSES ✓\n-- Row 2: age = 15 -> (15 >= 18) = FALSE -> REJECTED ✗\n-- Row 3: age = NULL -> (NULL >= 18) = UNKNOWN -> PASSES! (Surprise!)",
          steps: [
            { step: 1, explanation: "In SQL CHECK constraints, a row is REJECTED only if the condition evaluates to `FALSE`." },
            { step: 2, explanation: "If a condition evaluates to `UNKNOWN` (e.g., when a column is `NULL`), the CHECK constraint PERMITS the row!" },
            { step: 3, explanation: "If you want to forbid NULL values alongside the range check, you MUST combine `CHECK (age >= 18)` with `NOT NULL`." }
          ]
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "Does a UNIQUE constraint in SQL permit multiple NULL rows?",
              trap: "Saying 'No, UNIQUE means only one NULL is allowed'.",
              solution: "Under the ANSI SQL standard and most engines (PostgreSQL, MySQL, Oracle, SQLite), multiple NULLs ARE permitted in a UNIQUE column because `NULL <> NULL`. (Exception: Microsoft SQL Server treats NULL as a single unique value unless filtered index is used)."
            },
            {
              question: "Why should you always name constraints explicitly instead of using inline anonymous constraints?",
              trap: "Thinking naming is just aesthetic preference.",
              solution: "Anonymous constraints receive auto-generated names like `SYS_C007192`. In production errors, migrations, or `ALTER TABLE DROP CONSTRAINT`, cryptic names make maintenance and debugging difficult."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "A column has constraint `CHECK (salary > 50000)`. What happens when an `INSERT` statement leaves `salary` as `NULL` (assuming the column does NOT have a `NOT NULL` constraint)?",
          options: [
            "The insert fails with a check constraint violation.",
            "The insert succeeds because `salary > 50000` evaluates to UNKNOWN, and CHECK constraints only reject FALSE.",
            "The database replaces NULL with 50001.",
            "The table enters a read-only lock state."
          ],
          correctIndex: 1,
          explanation: "CHECK constraints only fail on FALSE. Comparisons with NULL yield UNKNOWN, which passes CHECK constraints unless NOT NULL is also specified."
        },
        {
          type: "takeaways",
          items: [
            "Constraints enforce domain, entity, and referential integrity directly inside the database engine.",
            "Always name constraints explicitly (`chk_...`, `fk_...`, `uq_...`) for production observability.",
            "CHECK constraints allow NULL values unless the column is also explicitly declared NOT NULL.",
            "In ANSI SQL, UNIQUE constraints allow multiple NULL values because NULL is never equal to another NULL."
          ]
        }
      ]
    }
  },
  {
    slug: "sql-dialects-and-standards",
    title: "SQL Dialects & ANSI Standards",
    content: {
      sections: [
        {
          type: "text",
          title: "Mental Model: English Dialects (American vs British vs Australian)",
          content: "Think of SQL dialects like **Regional Dialects of English**:\n• **ANSI SQL Standard**: The official dictionary and grammar specification (ANSI/ISO SQL:1992, SQL:1999, SQL:2016, SQL:2023). Core statements (`SELECT`, `FROM`, `WHERE`, `GROUP BY`, `INNER JOIN`) are understood identically across all engines.\n• **Dialects (PostgreSQL, MySQL, Oracle, SQL Server, SQLite)**: Each vendor adds proprietary vocabulary, optimized execution engines, custom string/date functions, and dialect-specific syntax (e.g., PostgreSQL uses `LIMIT 10 OFFSET 5`, Oracle historically used `ROWNUM <= 10`, SQL Server uses `TOP 10`)."
        },
        {
          type: "callout",
          title: "The Major Relational Engines in Production",
          content: "1. **PostgreSQL**: The gold standard for feature completeness, strict ANSI compliance, advanced JSONB, GIS extensions (PostGIS), and concurrency.\n2. **MySQL**: Widely adopted web scale engine (InnoDB engine, default for WordPress, Meta, Uber).\n3. **Oracle Database**: Enterprise banking and high-scale enterprise ERP systems.\n4. **Microsoft SQL Server (T-SQL)**: Enterprise Microsoft ecosystem (.NET/Azure).\n5. **SQLite**: Ultra-lightweight embedded serverless database running inside mobile apps and browsers."
        },
        {
          type: "table",
          title: "Key Syntax Differences Across Major SQL Dialects",
          headers: ["Feature", "PostgreSQL", "MySQL", "Oracle SQL", "MS SQL Server"],
          rows: [
            ["Limit Results", "`LIMIT n OFFSET m`", "`LIMIT m, n` or `LIMIT n OFFSET m`", "`FETCH FIRST n ROWS ONLY`", "`SELECT TOP n` or `OFFSET m FETCH NEXT n`"],
            ["Auto Increment PK", "`GENERATED ALWAYS AS IDENTITY` or `BIGSERIAL`", "`AUTO_INCREMENT`", "`GENERATED ALWAYS AS IDENTITY`", "`IDENTITY(1,1)`"],
            ["String Concatenation", "`'Hello' || ' ' || 'World'`", "`CONCAT('Hello', ' ', 'World')`", "`'Hello' || ' ' || 'World'`", "`'Hello' + ' ' + 'World'` or `CONCAT()`"],
            ["Date Arithmetic", "`NOW() - INTERVAL '7 days'`", "`DATE_SUB(NOW(), INTERVAL 7 DAY)`", "`SYSDATE - 7`", "`DATEADD(day, -7, GETDATE())`"],
            ["JSON Support", "`JSONB` (binary indexed JSON with GIN indexes)", "`JSON` (validated document storage)", "`JSON` datatype", "`JSON_VALUE` / `JSON_QUERY`"],
            ["Full Outer Join", "Supported (`FULL OUTER JOIN`)", "NOT supported natively (Requires UNION)", "Supported", "Supported"]
          ]
        },
        {
          type: "code",
          title: "Writing Dialect-Independent ANSI SQL vs Dialect-Specific Code",
          code: "-- 1. ANSI-Compliant Query (Works identically on PostgreSQL, Oracle, SQLite, MySQL 8+, SQL Server)\nSELECT \n    department_id,\n    COUNT(*) AS total_employees,\n    AVG(salary) AS average_salary\nFROM employees\nWHERE hire_date >= '2020-01-01'\nGROUP BY department_id\nHAVING COUNT(*) >= 5\nORDER BY average_salary DESC;\n\n-- 2. Dialect-Specific Pagination Comparison\n-- PostgreSQL / SQLite:\n-- SELECT * FROM products ORDER BY id LIMIT 10 OFFSET 20;\n\n-- MS SQL Server (T-SQL):\n-- SELECT * FROM products ORDER BY id OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY;",
          language: "sql",
          explanation: "Mastering core ANSI SQL guarantees your foundational knowledge transfers seamlessly across any database backend you encounter in interviews or production."
        },
        {
          type: "dryRun",
          title: "How SQL Engines Translate Declarative Code to Physical Execution",
          code: "-- Declarative Query (WHAT data you want, not HOW to get it)\nSELECT name FROM users WHERE age > 21;",
          steps: [
            { step: 1, explanation: "Parser & Lexer: Validates SQL syntax and ensures keywords and identifiers exist." },
            { step: 2, explanation: "Catalog Lookup: Checks permissions and validates table and column types." },
            { step: 3, explanation: "Query Optimizer: Computes cost estimates for different physical plans (Sequential Scan vs Index Scan on `age`)." },
            { step: 4, explanation: "Execution Engine: Reads data blocks from disk/buffer pool, filters rows, and returns tuple stream to client." }
          ]
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "Does MySQL support FULL OUTER JOIN natively?",
              trap: "Writing `SELECT * FROM a FULL JOIN b ON a.id = b.id;` in a MySQL interview.",
              solution: "MySQL does NOT support `FULL OUTER JOIN` natively. In MySQL, you emulate it by combining a `LEFT JOIN` and a `RIGHT JOIN` with a `UNION` clause."
            },
            {
              question: "What is the difference between DDL, DML, and DQL?",
              trap: "Blurring DDL (Data Definition: CREATE, ALTER) with DML (Data Manipulation: INSERT, UPDATE, DELETE).",
              solution: "DDL defines schema structure. DML mutates instance records. DQL (`SELECT`) queries data. DCL (`GRANT`, `REVOKE`) manages security permissions. TCL (`COMMIT`, `ROLLBACK`) manages transactions."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "Which of the following database engines does NOT have native support for the `FULL OUTER JOIN` keyword?",
          options: [
            "PostgreSQL",
            "MySQL",
            "Oracle Database",
            "Microsoft SQL Server"
          ],
          correctIndex: 1,
          explanation: "MySQL does not support FULL OUTER JOIN syntax directly; it requires emulating via LEFT JOIN UNION RIGHT JOIN."
        },
        {
          type: "takeaways",
          items: [
            "ANSI SQL defines the universal standard, while specific database engines implement custom dialects and optimizations.",
            "PostgreSQL is renowned for strict ANSI adherence, advanced indexing, and JSONB performance.",
            "SQL is declarative: you tell the database WHAT data you need, and the Query Optimizer decides HOW to retrieve it efficiently.",
            "Be prepared for dialect differences in pagination, date math, auto-increment keys, and string concatenation."
          ]
        }
      ]
    }
  },
  {
    slug: "acid-properties-overview",
    title: "ACID Properties: The Pillars of Reliability",
    content: {
      sections: [
        {
          type: "text",
          title: "Mental Model: The $500 Bank Transfer",
          content: "Imagine Alice transferring **$500** to Bob:\n1. Subtract $500 from Alice's account.\n2. Add $500 to Bob's account.\n\nWhat happens if the server loses power or crashes **between Step 1 and Step 2**?\n• Without ACID: $500 vanished into thin air! Alice lost money, Bob never got it.\n• With **ACID Properties**:\n  - **Atomicity (All or Nothing)**: If Step 2 fails, Step 1 is automatically undone (rolled back) completely.\n  - **Consistency (No Illegal States)**: Account balances cannot drop below $0; total money in the system remains conserved.\n  - **Isolation (Invisible Intermediates)**: A third party querying balances at the exact mid-point never sees Alice with -$500 before Bob receives it.\n  - **Durability (Survives Disasters)**: Once the transaction commits, the record is permanently flushed to Write-Ahead Log (WAL) on non-volatile disk."
        },
        {
          type: "callout",
          title: "ACID Breakdown Matrix",
          content: "• **A - Atomicity**: Transaction is an indivisible unit of work (Undo Logs).\n• **C - Consistency**: Database transitions from one valid state to another valid state, preserving all invariants and foreign keys.\n• **I - Isolation**: Concurrent transactions execute without interfering with one another (Locks / MVCC).\n• **D - Durability**: Committed data is never lost, even if power is severed the next millisecond (Redo Logs / WAL)."
        },
        {
          type: "table",
          title: "The 4 ACID Pillars and Their Underlying Engine Mechanisms",
          headers: ["Property", "Core Guarantee", "Failure Scenario Prevented", "Underlying Database Mechanism"],
          rows: [
            ["Atomicity", "All operations succeed or all are rolled back.", "Partial execution after power outage or network timeout.", "Undo Logs / Transaction Rollback Segment."],
            ["Consistency", "All schema constraints, types, and invariants are preserved.", "Corrupt negative balances or dangling foreign keys.", "Constraint validation engines and application business rules."],
            ["Isolation", "Concurrent transactions produce results as if executed serially.", "Dirty reads, non-repeatable reads, phantom reads.", "2-Phase Locking (2PL) and Multi-Version Concurrency Control (MVCC)."],
            ["Durability", "Committed data is permanently written to non-volatile storage.", "Memory loss during unexpected database server reboot.", "Write-Ahead Logging (WAL) and battery-backed disk sync (`fsync`)."]
          ]
        },
        {
          type: "code",
          title: "Managing ACID Transactions in SQL",
          code: "-- Beginning an explicit atomic transaction block\nBEGIN TRANSACTION;\n\n-- Step 1: Debit Alice's account\nUPDATE accounts \nSET balance = balance - 500.00 \nWHERE account_id = 101 AND balance >= 500.00;\n\n-- Step 2: Credit Bob's account\nUPDATE accounts \nSET balance = balance + 500.00 \nWHERE account_id = 202;\n\n-- Guard check: If any statement failed or row count != 1, ROLLBACK\n-- Otherwise, permanently commit to disk:\nCOMMIT;\n\n-- If an unexpected error occurred before COMMIT:\n-- ROLLBACK; -- Restores database state to exact moment before BEGIN TRANSACTION"
        },
        {
          type: "dryRun",
          title: "Step-by-Step Crash Recovery via Write-Ahead Log (WAL)",
          code: "-- Timeline of a Crash Event\n-- t=1: Transaction Tx1 updates balance to $1500 (written to memory buffer and WAL).\n-- t=2: Tx1 executes COMMIT (WAL flushed to physical disk).\n-- t=3: Catastrophic Power Failure! (Data pages in RAM were NOT yet written to data tables on disk!).",
          steps: [
            { step: 1, explanation: "Server powers back on and boots PostgreSQL / MySQL engine." },
            { step: 2, explanation: "Recovery manager inspects the Write-Ahead Log (WAL) on non-volatile disk." },
            { step: 3, explanation: "Redo Phase: Engine sees Tx1 was committed in WAL. It replays the transaction, applying the changes to the disk data files (Durability preserved!)." },
            { step: 4, explanation: "Undo Phase: Engine identifies uncommitted transactions (Tx2) that were interrupted mid-flight and rolls back their changes (Atomicity preserved!)." }
          ]
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "What is the difference between Atomicity and Consistency in ACID?",
              trap: "Confusing the two terms or saying 'they both mean data is correct'.",
              solution: "Atomicity is about execution completeness (all operations finish or none do). Consistency is about correctness and invariant preservation (no database constraints, triggers, or business rules are violated)."
            },
            {
              question: "How does Write-Ahead Logging (WAL) guarantee Durability without slowing down every query?",
              trap: "Claiming the database writes entire tables to disk on every single transaction.",
              solution: "Writing random table pages to disk is slow (random I/O). Instead, the database appends a lightweight sequential log entry to the WAL file (fast sequential I/O) and calls `fsync`. The actual data pages are lazily flushed in the background."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "If a database transaction crashes halfway through updating 5 tables, which ACID property guarantees that the partial changes made to the first 2 tables are completely undone?",
          options: [
            "Consistency",
            "Atomicity",
            "Isolation",
            "Durability"
          ],
          correctIndex: 1,
          explanation: "Atomicity ensures the 'all-or-nothing' guarantee, rolling back any partial modifications if a transaction fails before completion."
        },
        {
          type: "takeaways",
          items: [
            "ACID is the gold standard for transactional data integrity in relational database systems.",
            "Atomicity = All or nothing; Consistency = Preserves invariants and constraints; Isolation = Concurrency control; Durability = Survives power loss.",
            "Write-Ahead Logging (WAL) is the core storage mechanism enabling both fast sequential writes and bulletproof crash recovery.",
            "Transactions are initiated with `BEGIN`, finalized with `COMMIT`, and aborted with `ROLLBACK`."
          ]
        }
      ]
    }
  }
];
