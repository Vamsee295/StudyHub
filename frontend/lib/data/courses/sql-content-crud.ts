// Module 2 - SQL Basics & CRUD Lifecycle (7 lessons)
import { CourseLessonContent } from './types';

export const sqlCrudLessons: Array<{
  slug: string;
  title: string;
  content: CourseLessonContent
}> = [
  {
    slug: "sql-command-categories",
    title: "SQL Command Taxonomy: DDL, DML, DQL, DCL, & TCL",
    content: {
      sections: [
        {
          type: "text",
          title: "Mental Model: The 5 Departments of Database Governance",
          content: "Think of SQL commands as **Five Administrative Departments in a Corporation**:\n• **DDL (Data Definition Language - The Architects)**: Draw blueprints and construct buildings (`CREATE`, `ALTER`, `DROP`, `TRUNCATE`). Operates on schema structures; often issues implicit commits.\n• **DML (Data Manipulation Language - The Warehouse Workers)**: Move physical goods into and out of storage (`INSERT`, `UPDATE`, `DELETE`). Operates on data rows; transactional and rollable back.\n• **DQL (Data Query Language - The Analysts)**: Read inventory reports without modifying stock (`SELECT`). Pure read-only projections.\n• **DCL (Data Control Language - The Security Guards)**: Issue and revoke security badges and permissions (`GRANT`, `REVOKE`).\n• **TCL (Transaction Control Language - The Legal Notaries)**: Seal official contracts and sign off on atomic batches (`COMMIT`, `ROLLBACK`, `SAVEPOINT`)."
        },
        {
          type: "callout",
          title: "The 5 Sub-Languages of SQL",
          content: "1. **DDL**: `CREATE`, `ALTER`, `DROP`, `TRUNCATE`, `RENAME` (Schema level)\n2. **DML**: `INSERT`, `UPDATE`, `DELETE`, `MERGE` (Instance record level)\n3. **DQL**: `SELECT` (Data retrieval)\n4. **DCL**: `GRANT`, `REVOKE` (Access authorization)\n5. **TCL**: `COMMIT`, `ROLLBACK`, `SAVEPOINT`, `SET TRANSACTION` (ACID management)"
        },
        {
          type: "table",
          title: "Complete Comparison of SQL Command Categories",
          headers: ["Category", "Core Keywords", "Scope / Target", "Can Be Rolled Back? (TCL)", "Implicit Auto-Commit?"],
          rows: [
            ["DDL (Data Definition)", "`CREATE`, `ALTER`, `DROP`, `TRUNCATE`", "Schema & Table structures", "No in MySQL/Oracle (Yes in PostgreSQL)", "Yes (in MySQL/Oracle)"],
            ["DML (Data Manipulation)", "`INSERT`, `UPDATE`, `DELETE`, `MERGE`", "Table rows / records", "YES (within active transaction)", "No (explicit COMMIT needed)"],
            ["DQL (Data Query)", "`SELECT`", "Result set projection", "N/A (Read-only)", "No state mutation"],
            ["DCL (Data Control)", "`GRANT`, `REVOKE`", "User roles & privileges", "Engine dependent", "Often auto-commits"],
            ["TCL (Transaction Control)", "`COMMIT`, `ROLLBACK`, `SAVEPOINT`", "Transaction lifecycle", "Acts as the rollback mechanism", "N/A"]
          ]
        },
        {
          type: "code",
          title: "Executing Commands Across All 5 Categories",
          code: "-- 1. DDL: Create table structure\nCREATE TABLE employee_salaries (\n    emp_id INT PRIMARY KEY,\n    base_pay DECIMAL(10, 2) NOT NULL\n);\n\n-- 2. DCL: Grant read permissions to reporting user\nGRANT SELECT ON employee_salaries TO reporting_role;\n\n-- 3. TCL & DML: Atomic transaction execution\nBEGIN TRANSACTION;\n\n-- DML Statements\nINSERT INTO employee_salaries VALUES (101, 85000.00);\nUPDATE employee_salaries SET base_pay = 92000.00 WHERE emp_id = 101;\n\n-- TCL: Seal the transaction permanently\nCOMMIT;\n\n-- 4. DQL: Query final result\nSELECT * FROM employee_salaries WHERE emp_id = 101;",
          language: "sql",
          explanation: "Each command family operates at a distinct layer of the database engine stack, from user authentication (DCL) to schema storage (DDL) and transactional record mutation (DML/TCL)."
        },
        {
          type: "dryRun",
          title: "DDL Implicit Commit Trap in MySQL / Oracle",
          code: "-- Scenario in MySQL / MariaDB / Oracle:\nBEGIN;\nINSERT INTO accounts VALUES (1, 1000.00); -- Uncommitted DML\nCREATE TABLE temp_log (id INT);           -- DDL command executed mid-transaction!\nROLLBACK;                                 -- Attempting to abort the insert!",
          steps: [
            { step: 1, explanation: "DML `INSERT` is executed inside an active transaction block." },
            { step: 2, explanation: "`CREATE TABLE` (DDL) is encountered. In MySQL and Oracle, DDL triggers an automatic, unskippable `COMMIT` behind the scenes!" },
            { step: 3, explanation: "The uncommitted insert is permanently saved to disk at step 2." },
            { step: 4, explanation: "The subsequent `ROLLBACK` does NOTHING to the insert because the transaction was already committed by the DDL statement." }
          ]
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "Why is TRUNCATE classified as DDL while DELETE is classified as DML?",
              trap: "Saying 'they both delete rows so both are DML'.",
              solution: "DELETE is DML: it scans rows, checks triggers, logs row-by-row deletions in undo logs, and is fully rollable back. TRUNCATE is DDL: it deallocates the underlying data pages directly in the database data dictionary at the schema level without firing row-level triggers."
            },
            {
              question: "Is `SELECT` classified as DML or DQL?",
              trap: "Calling SELECT a DML command in strict technical interviews.",
              solution: "While some casual documentation groups SELECT under DML, formal ANSI SQL categorizes `SELECT` as **DQL (Data Query Language)** because it does not manipulate or mutate stored data."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "Which of the following commands belongs to the DDL (Data Definition Language) category?",
          options: [
            "`UPDATE`",
            "`REVOKE`",
            "`ALTER`",
            "`SAVEPOINT`"
          ],
          correctIndex: 2,
          explanation: "`ALTER` modifies schema structures (adding/dropping columns or constraints), which is the defining role of DDL."
        },
        {
          type: "takeaways",
          items: [
            "SQL commands are partitioned into 5 functional families: DDL, DML, DQL, DCL, and TCL.",
            "DDL alters table structures and metadata; DML mutates individual rows; DQL retrieves data.",
            "TCL (`COMMIT`, `ROLLBACK`, `SAVEPOINT`) controls transactional atomicity.",
            "Beware of DDL implicit commits in MySQL and Oracle that prevent rolling back preceding DML operations."
          ]
        }
      ]
    }
  },
  {
    slug: "select-statement-and-column-aliasing",
    title: "The SELECT Statement & Column Aliasing",
    content: {
      sections: [
        {
          type: "text",
          title: "Mental Model: The Projection Lens and Custom Label Maker",
          content: "Think of `SELECT` as **A Movie Projector with Adjustable Filters**:\n• A table on disk might have 60 columns and 500 million bytes of data (The physical film roll).\n• The `SELECT` clause acts as the **Projection Lens**: you specify only the exact 3 columns you want displayed on the screen (`SELECT first_name, email, balance`). This eliminates network congestion and RAM waste (The cardinal rule: Avoid `SELECT *` in production).\n• **Column Aliasing (`AS`)**: Functions as a label maker, converting raw computer expressions (`unit_price * (1.0 - discount_rate)`) into clean, business-friendly titles (`discounted_price`)."
        },
        {
          type: "callout",
          title: "The Danger of `SELECT *` in Production Systems",
          content: "1. **Network I/O Saturation**: Pulling 50 columns over the network when you only need 2 wastes bandwidth.\n2. **Defeats Index-Only Scans (Covering Indexes)**: If a query requests only indexed columns, the DB reads data 100x faster directly from RAM index blocks. `SELECT *` forces expensive random disk reads to fetch table pages.\n3. **Fragility in Microservices**: Adding a new column to a table alters the positional array mapping of callers using `SELECT *`."
        },
        {
          type: "code",
          title: "Calculated Columns, String Expressions, and Aliasing in SQL",
          code: "-- Querying customer orders with calculated fields and aliases\nSELECT \n    order_id,\n    customer_id,\n    -- Mathematical Expression with Alias\n    quantity * unit_price AS gross_amount,\n    -- Conditional Discount Calculation\n    (quantity * unit_price) * (1.0 - (discount_pct / 100.0)) AS net_amount,\n    -- String Concatenation and Formatting\n    'Order #' || CAST(order_id AS VARCHAR) || ' (' || status || ')' AS order_summary,\n    -- Current Timestamp Function\n    CURRENT_DATE AS query_date\nFROM sales_orders\nWHERE status = 'COMPLETED';",
          language: "sql",
          explanation: "Calculated expressions are evaluated on the fly per row. The 'AS' keyword assigns clean header names to derived columns."
        },
        {
          type: "table",
          title: "Column Aliasing Rules & Conventions",
          headers: ["Syntax Pattern", "Example", "Standard Compliant?", "Recommendation"],
          rows: [
            ["Explicit `AS` (Standard)", "`SELECT salary * 12 AS annual_salary`", "YES (Universal)", "RECOMMENDED: Explicit and highly readable."],
            ["Implicit (No `AS`)", "`SELECT salary * 12 annual_salary`", "YES", "AVOID: A missing comma can accidentally alias the previous column!"],
            ["Quoted Identifiers", "`SELECT balance AS \"Current Account Balance\"`", "YES (Preserves spaces & case)", "Use sparingly; forces case-sensitivity in queries."],
            ["Positional Expressions", "`SELECT 100 + 50;`", "YES (Scalar evaluation)", "Useful for quick testing without a `FROM` clause."]
          ]
        },
        {
          type: "dryRun",
          title: "The 'Missing Comma' Silent Alias Trap",
          code: "-- Developer intended to select TWO columns: 'first_name' and 'last_name'\n-- But accidentally omitted the comma between them:\nSELECT first_name last_name FROM employees;",
          steps: [
            { step: 1, explanation: "SQL parser reads `first_name` followed immediately by identifier `last_name` without a comma." },
            { step: 2, explanation: "Instead of throwing a syntax error, SQL interprets `last_name` as an ALIAS for `first_name`!" },
            { step: 3, explanation: "The query executes successfully but returns only ONE column: the first names displayed under the header 'last_name'." },
            { step: 4, explanation: "The frontend application receives corrupted data without any SQL error being raised." }
          ]
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "Can you use a column alias defined in SELECT inside the WHERE clause of the same query?",
              trap: "Writing `SELECT salary * 12 AS annual_salary FROM emp WHERE annual_salary > 100000;`",
              solution: "NO! Due to SQL Query Execution Order, the `WHERE` clause executes BEFORE the `SELECT` clause projects aliases. The engine does not yet know what `annual_salary` means during WHERE filtering. (Use the raw expression or a CTE/Subquery)."
            },
            {
              question: "Can you use a column alias in the ORDER BY clause?",
              trap: "Assuming ORDER BY fails like WHERE.",
              solution: "YES! `ORDER BY` executes AFTER `SELECT`, so column aliases ARE fully recognized and valid in `ORDER BY annual_salary DESC`."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "Why does the query `SELECT salary * 1.10 AS revised_salary FROM employees WHERE revised_salary > 50000;` throw an error?",
          options: [
            "Mathematical multiplication is forbidden inside a SELECT clause.",
            "The `WHERE` clause is evaluated before the `SELECT` clause, so `revised_salary` is not yet defined.",
            "The `AS` keyword is deprecated in ANSI SQL.",
            "`revised_salary` must be declared as a database variable first."
          ],
          correctIndex: 1,
          explanation: "In the SQL execution pipeline, WHERE runs before SELECT, meaning column aliases created in SELECT do not exist yet when WHERE is evaluated."
        },
        {
          type: "takeaways",
          items: [
            "SELECT performs vertical projection; avoid `SELECT *` in production to maximize performance and enable covering index scans.",
            "Use explicit `AS` keywords for column aliases to prevent missing-comma accidental aliasing bugs.",
            "Aliases defined in SELECT cannot be used in WHERE (because WHERE runs before SELECT).",
            "Aliases CAN be safely used in ORDER BY (because ORDER BY runs after SELECT)."
          ]
        }
      ]
    }
  },
  {
    slug: "distinct-keyword",
    title: "The DISTINCT Keyword: Deduplication Mechanics",
    content: {
      sections: [
        {
          type: "text",
          title: "Mental Model: The Bouncer with the Guest Registry",
          content: "Imagine a conference hall where 5,000 attendees enter. Many work for the same companies or live in the same cities.\n• `SELECT city FROM attendees;` prints 5,000 lines (e.g. 'New York', 'New York', 'Chicago', 'New York'...). Multi-set repetition.\n• `SELECT DISTINCT city FROM attendees;` puts a bouncer at the door with a hash set. The first time 'New York' appears, it passes. Every subsequent 'New York' is discarded. The final output is an exact mathematical set of unique cities."
        },
        {
          type: "callout",
          title: "Core Invariant of DISTINCT",
          content: "`DISTINCT` operates on the **entire combination of columns** specified in the SELECT list, NOT just the first column immediately following the keyword!"
        },
        {
          type: "code",
          title: "Single-Column vs Multi-Column DISTINCT in SQL",
          code: "-- 1. Single Column Deduplication\n-- Returns unique departments across the company (e.g., 5 rows)\nSELECT DISTINCT department FROM employees;\n\n-- 2. Multi-Column Deduplication\n-- Returns unique PAIRS of (department, job_title)\n-- Example: ('Sales', 'Manager') and ('Sales', 'Rep') are BOTH kept because the COMBINATION is distinct!\nSELECT DISTINCT department, job_title FROM employees;\n\n-- 3. DISTINCT inside Aggregate Functions\n-- Count total employees vs count UNIQUE departments\nSELECT \n    COUNT(*) AS total_employees,\n    COUNT(DISTINCT department) AS unique_departments,\n    COUNT(DISTINCT country) AS unique_countries\nFROM employees;",
          language: "sql",
          explanation: "In multi-column DISTINCT, rows are only discarded if ALL selected columns match an already seen row."
        },
        {
          type: "table",
          title: "Engine Mechanics & Performance Cost of DISTINCT",
          headers: ["Method Used by Engine", "When It Is Triggered", "Computational Cost", "Memory Utilization"],
          rows: [
            ["Index Unique Scan", "Queried column(s) already have a B+ Tree index.", "Fast ($O(K)$ where $K$ is unique count).", "Minimal (reads directly from index pages)."],
            ["Hash Aggregate", "Unindexed columns on modern engines (PostgreSQL / MySQL 8).", "$O(N)$ CPU hash table construction.", "High RAM usage in DB buffer pool; spills to temporary disk files if RAM exceeded."],
            ["Sort Aggregate", "Large unindexed datasets or explicit sorting required.", "$O(N \\log N)$ sort phase.", "High disk I/O if work_mem is exceeded."]
          ]
        },
        {
          type: "dryRun",
          title: "How DISTINCT Handles NULL Values",
          code: "-- Table 'customers' with country column containing: ('USA', 'Canada', NULL, 'USA', NULL)\nSELECT DISTINCT country FROM customers;",
          steps: [
            { step: 1, explanation: "Engine encounters 'USA' -> Adds 'USA' to unique result set." },
            { step: 2, explanation: "Engine encounters 'Canada' -> Adds 'Canada' to unique result set." },
            { step: 3, explanation: "Engine encounters first `NULL` -> Adds `NULL` to unique result set." },
            { step: 4, explanation: "Engine encounters second 'USA' -> Discards (duplicate)." },
            { step: 5, explanation: "Engine encounters second `NULL` -> Discards! (For the purpose of DISTINCT, all NULLs are treated as duplicates of each other)." },
            { step: 6, explanation: "Final output: `{'USA', 'Canada', NULL}` (Exactly 3 rows)." }
          ]
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "Can you write `SELECT DISTINCT(col1), col2 FROM table;` to apply DISTINCT to only col1?",
              trap: "Thinking the parentheses make DISTINCT behave like a single-column function.",
              solution: "NO! `DISTINCT` is a SQL keyword, not a function. The parentheses around `col1` are just regular expression grouping parentheses. The query evaluates as `SELECT DISTINCT col1, col2` across the full tuple."
            },
            {
              question: "Why should you avoid slapping `DISTINCT` on queries just to hide duplicate rows caused by bad JOINs?",
              trap: "Using DISTINCT as a lazy band-aid for duplicate rows generated by 1:N Cartesian joins.",
              solution: "Slapping DISTINCT masks structural join bugs (e.g. missing join predicate) and forces the database engine to perform expensive $O(N \\log N)$ sorting or hashing over millions of redundant rows."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "If a table contains 10 rows where `category` has values: 4 rows of 'Tech', 3 rows of 'Health', and 3 rows of `NULL`, how many rows are returned by `SELECT DISTINCT category FROM table;`?",
          options: [
            "2 rows ('Tech', 'Health')",
            "3 rows ('Tech', 'Health', NULL)",
            "5 rows ('Tech', 'Health', NULL, NULL, NULL)",
            "10 rows"
          ],
          correctIndex: 1,
          explanation: "DISTINCT collapses all duplicate values, and treats all NULLs as a single unique group, returning exactly 3 rows: 'Tech', 'Health', and NULL."
        },
        {
          type: "takeaways",
          items: [
            "DISTINCT eliminates duplicate rows across the entire combination of selected columns.",
            "All NULL values are grouped into a single unique instance by DISTINCT.",
            "DISTINCT can be used inside aggregate functions like `COUNT(DISTINCT column)`.",
            "DISTINCT requires sorting or hashing ($O(N \\log N)$); do not use it as a substitute for correct JOIN conditions."
          ]
        }
      ]
    }
  },
  {
    slug: "insert-into-syntax",
    title: "The INSERT Statement: Single, Batch & Upsert",
    content: {
      sections: [
        {
          type: "text",
          title: "Mental Model: Filing New Account Contracts into the Vault",
          content: "The `INSERT` statement is how new physical records enter relational storage:\n• **Explicit Column Insertion (The Safe Standard)**: You declare both the target column list and the matching values (`INSERT INTO users (name, email) VALUES (...)`). If a teammate adds a new column next month, your code continues working flawlessly.\n• **Positional Implicit Insertion (The Fragile Anti-Pattern)**: Leaving out the column list (`INSERT INTO users VALUES (...)`). If schema order changes or columns are added, all insertions crash immediately with type mismatch errors.\n• **Batch Multi-Row Insertion**: Inserting 1,000 rows in a single network round-trip instead of opening 1,000 individual SQL connections."
        },
        {
          type: "callout",
          title: "The Performance Multiplier of Batch Inserts",
          content: "Executing 10,000 individual single-row `INSERT` statements takes ~35 seconds due to network latency, parsing, and transaction commit locks. Bundling them into batch inserts of 500 rows reduces execution time to **<300 milliseconds** (a 100x speedup)!"
        },
        {
          type: "code",
          title: "Single, Multi-Row Batch, and RETURNING / UPSERT in SQL",
          code: "-- 1. Single-Row Insert with Explicit Column List\nINSERT INTO customers (first_name, last_name, email, loyalty_points)\nVALUES ('Pooja', 'Iyer', 'pooja.iyer@tech.in', 100);\n\n-- 2. High-Performance Multi-Row Batch Insert\nINSERT INTO customers (first_name, last_name, email, loyalty_points) VALUES\n('Aarav', 'Sharma', 'aarav.sharma@tech.in', 50),\n('Meera', 'Nair', 'meera.nair@tech.in', 150),\n('Vikram', 'Singh', 'vikram.singh@tech.in', 200);\n\n-- 3. INSERT with RETURNING clause (PostgreSQL / SQLite 3.35+ / Oracle)\n-- Retrieves the auto-generated primary key without needing a separate SELECT query!\nINSERT INTO customers (first_name, last_name, email)\nVALUES ('Rohan', 'Gupta', 'rohan.gupta@tech.in')\nRETURNING customer_id, created_at;\n\n-- 4. UPSERT: Insert or Update on Conflict (PostgreSQL / SQLite syntax)\nINSERT INTO user_settings (user_id, dark_mode, notifications_enabled)\nVALUES (101, TRUE, TRUE)\nON CONFLICT (user_id) \nDO UPDATE SET dark_mode = EXCLUDED.dark_mode, updated_at = CURRENT_TIMESTAMP;",
          language: "sql",
          explanation: "The RETURNING clause eliminates race conditions when retrieving newly generated IDs, and ON CONFLICT (UPSERT) handles idempotent updates atomically."
        },
        {
          type: "table",
          title: "UPSERT (Insert or Update) Syntax Across SQL Dialects",
          headers: ["SQL Dialect", "UPSERT Syntax / Keyword", "Handling Mechanism"],
          rows: [
            ["PostgreSQL / SQLite", "`ON CONFLICT (target_col) DO UPDATE SET ...`", "Atomic lock on conflicting unique index, mutates existing row."],
            ["MySQL / MariaDB", "`ON DUPLICATE KEY UPDATE col = VALUES(col)...`", "Detects duplicate PRIMARY KEY or UNIQUE constraint and performs inline update."],
            ["Oracle / MS SQL Server", "`MERGE INTO target USING source ON (...) WHEN MATCHED...`", "ANSI SQL standard MERGE statement comparing source to target."]
          ]
        },
        {
          type: "dryRun",
          title: "Step-by-Step Anatomy of an INSERT Failure & Rollback",
          code: "-- Attempting to insert a batch where the 3rd row violates a UNIQUE email constraint:\nINSERT INTO users (id, email) VALUES\n(1, 'u1@co.com'),\n(2, 'u2@co.com'),\n(3, 'u1@co.com'); -- Duplicate email!",
          steps: [
            { step: 1, explanation: "Engine opens transaction and verifies syntax." },
            { step: 2, explanation: "Row 1 and Row 2 pass validation and are written to the memory buffer." },
            { step: 3, explanation: "Row 3 hits unique index check on `email` and detects conflict with Row 1." },
            { step: 4, explanation: "Engine throws `ERROR: duplicate key value violates unique constraint`." },
            { step: 5, explanation: "Atomicity guarantee: The ENTIRE batch statement is rolled back. Zero rows remain inserted." }
          ]
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "Why should you NEVER write `INSERT INTO table VALUES (val1, val2);` without column names in production code?",
              trap: "Thinking it saves typing and has no side effects.",
              solution: "If an `ALTER TABLE ADD COLUMN` migration runs, any positional INSERT without explicit column lists will fail immediately with column count mismatch errors."
            },
            {
              question: "How do you retrieve the auto-generated ID after an INSERT in MySQL vs PostgreSQL?",
              trap: "Relying on a subsequent `SELECT MAX(id)` query (which creates race conditions in concurrent traffic!).",
              solution: "In PostgreSQL, use `INSERT ... RETURNING id;`. In MySQL, use `LAST_INSERT_ID()` or JDBC `getGeneratedKeys()` which retrieves the connection-isolated auto-increment value safely."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "Which of the following is the most efficient way to insert 500 records into a relational database?",
          options: [
            "Execute 500 individual `INSERT INTO table (cols) VALUES (...)` queries in a loop.",
            "Execute a single multi-row `INSERT INTO table (cols) VALUES (...), (...), ...;` batch query.",
            "Use 500 separate transactions with individual commits.",
            "Drop the table and recreate it with the 500 records."
          ],
          correctIndex: 1,
          explanation: "Multi-row batch insertion reduces network overhead, statement parsing time, and transaction lock contention from 500 round-trips to just 1."
        },
        {
          type: "takeaways",
          items: [
            "Always specify explicit column lists in INSERT statements for schema resilience.",
            "Batch multi-row inserts provide massive 100x performance gains over single-row loops.",
            "Use the `RETURNING` clause (or `LAST_INSERT_ID()`) to safely capture auto-generated keys.",
            "Use UPSERT (`ON CONFLICT` / `ON DUPLICATE KEY UPDATE`) for atomic, idempotent data syncs."
          ]
        }
      ]
    }
  },
  {
    slug: "update-statement-and-safeguards",
    title: "The UPDATE Statement: In-Place Mutations & Safeguards",
    content: {
      sections: [
        {
          type: "text",
          title: "Mental Model: The Targeted Modification vs The Catastrophic Flood",
          content: "Think of `UPDATE` as **A Precision Surgical Tool**:\n• `UPDATE employees SET salary = salary * 1.10 WHERE emp_id = 104;` surgically targets a single employee's file and applies a 10% raise.\n• If you forget the `WHERE` clause: `UPDATE employees SET salary = salary * 1.10;` (The dreaded catastrophe!). The surgical tool becomes a flood: EVERY single employee in the entire company—from interns to the CEO—gets their salary modified in one sweep.\n• In production database engineering, senior engineers always verify the row count with `SELECT` before executing an `UPDATE`, or use database **Safe Update Mode** (`--safe-updates`)."
        },
        {
          type: "callout",
          title: "Golden Rule of Production Database Modification",
          content: "Always wrap manual DML updates in an explicit transaction block:\n```sql\nBEGIN;\nUPDATE accounts SET status = 'ACTIVE' WHERE user_id = 502;\n-- Verify affected row count (must be exactly 1)!\nSELECT * FROM accounts WHERE user_id = 502;\n-- If correct: COMMIT;  If wrong: ROLLBACK;\n```"
        },
        {
          type: "code",
          title: "Atomic Increments, Multi-Column Updates, and Safe Transactions",
          code: "-- 1. Atomic In-Place Counter Increment (Prevents Race Conditions!)\n-- Never do: balance = [read_val] + 50. Always do balance = balance + 50 directly in SQL!\nUPDATE bank_accounts \nSET balance = balance + 250.00, \n    last_transaction_at = CURRENT_TIMESTAMP\nWHERE account_id = 101 AND is_frozen = FALSE;\n\n-- 2. Multi-Column Update with Subquery\nUPDATE employees\nSET salary = salary * 1.05,\n    title = 'Senior Software Engineer'\nWHERE department_id = (SELECT dept_id FROM departments WHERE dept_name = 'Cloud Engineering')\n  AND hire_date < '2022-01-01';\n\n-- 3. UPDATE with RETURNING (Inspect mutated state instantly)\nUPDATE inventory\nSET stock_qty = stock_qty - 1\nWHERE product_id = 409 AND stock_qty > 0\nRETURNING product_id, stock_qty AS remaining_stock;",
          language: "sql",
          explanation: "Performing calculations directly inside the SET clause (balance = balance + 250) is atomic at the row lock level, preventing lost updates in concurrent environments."
        },
        {
          type: "table",
          title: "Safe vs Unsafe UPDATE Practices",
          headers: ["Practice", "Safe Pattern", "Unsafe Anti-Pattern", "Risk"],
          rows: [
            ["Filtering", "Always filter on Primary Key or Indexed Unique column.", "Unindexed text column (`WHERE name LIKE '%Smith%'`).", "Accidentally updates multiple unintended records."],
            ["Concurrency", "`SET stock = stock - 1 WHERE stock > 0` (Atomic predicate).", "Read in Node.js/Java &rarr; `SET stock = 4`.", "Race condition causes negative inventory (Overselling)."],
            ["Manual Execution", "Execute inside `BEGIN; ... ROLLBACK/COMMIT;`.", "Directly running bare UPDATE on production console.", "Accidental execution without WHERE wipes entire column."],
            ["Verification", "Run `SELECT COUNT(*) WHERE [condition]` first.", "Executing UPDATE blind.", "Affects 50,000 rows instead of expected 5."]
          ]
        },
        {
          type: "dryRun",
          title: "Why Atomic SQL Updates Prevent Lost Updates",
          code: "-- Two concurrent requests try to decrement stock for item with stock = 1\n-- Tx1: UPDATE items SET stock = stock - 1 WHERE item_id = 5 AND stock > 0;\n-- Tx2: UPDATE items SET stock = stock - 1 WHERE item_id = 5 AND stock > 0;",
          steps: [
            { step: 1, explanation: "Tx1 acquires exclusive row lock on `item_id = 5`. Evaluates `stock > 0` (1 > 0 = TRUE)." },
            { step: 2, explanation: "Tx1 sets `stock = 1 - 1 = 0` and commits. Lock releases." },
            { step: 3, explanation: "Tx2 acquires row lock. Evaluates predicate `stock > 0` on the authoritative new state (0 > 0 = FALSE)." },
            { step: 4, explanation: "Tx2 updates 0 rows and returns affected count = 0. The inventory is never oversold into negative numbers!" }
          ]
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "What is the return value of an UPDATE statement if no rows match the WHERE condition?",
              trap: "Thinking it throws an error or exception.",
              solution: "An UPDATE statement that matches 0 rows is completely valid syntax; it simply returns `UPDATE 0` (Affected rows: 0). Application code should inspect the affected row count to verify success."
            },
            {
              question: "What is MySQL 'Safe Updates Mode' (SQL_SAFE_UPDATES)?",
              trap: "Not knowing how database engines protect against unconstrained updates.",
              solution: "When `SET sql_safe_updates = 1;` is enabled, MySQL rejects any `UPDATE` or `DELETE` that does not include a `WHERE` clause with a key/indexed column or a `LIMIT` clause."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "An engineer writes: `UPDATE products SET price = 99.99;`. What is the result of executing this statement?",
          options: [
            "Only the first product is updated to 99.99.",
            "The database throws a syntax error because WHERE is mandatory.",
            "EVERY single product in the table has its price changed to 99.99.",
            "The table is dropped."
          ],
          correctIndex: 2,
          explanation: "In SQL, omitting the WHERE clause applies the UPDATE to every row in the table unconditionally."
        },
        {
          type: "takeaways",
          items: [
            "Never execute an unconstrained UPDATE without a WHERE clause unless you intentionally wish to modify all rows.",
            "Use atomic in-place increments (`SET count = count + 1`) to eliminate concurrency race conditions.",
            "Always wrap manual production updates in transaction blocks with verification queries before committing.",
            "Inspect affected row count in application backend code to detect missing target records."
          ]
        }
      ]
    }
  },
  {
    slug: "delete-vs-truncate-vs-drop",
    title: "DELETE vs TRUNCATE vs DROP: Destruction Deep Dive",
    content: {
      sections: [
        {
          type: "text",
          title: "Mental Model: Eraser vs Shredder vs Demolition Wrecking Ball",
          content: "To understand data removal in relational databases, compare the **3 Levels of Destruction**:\n• **DELETE (The Pencil Eraser)**: You open the ledger, flip through pages one by one, locate specific lines with your eraser, rub them out, write an audit log entry for every erased line, and leave the page numbering intact. Can be rolled back. Slow for huge tables.\n• **TRUNCATE (The Office Paper Shredder)**: You take the entire stack of papers inside the binder, dump them straight into the shredder, and place a brand new empty notepad inside the binder. Fast; resets auto-increment counters; bypasses row-level audit triggers.\n• **DROP (The Demolition Wrecking Ball)**: You demolish the entire filing cabinet, melt the metal, and erase the office address from the city map. The table data AND its schema definition cease to exist entirely."
        },
        {
          type: "callout",
          title: "The Ultimate Placement Comparison: DELETE vs TRUNCATE vs DROP",
          content: "This is one of the **top 3 most frequently asked SQL interview questions** across all technical rounds. Interviewers expect you to know: 1. Command Category (DML vs DDL), 2. Rollback Capability, 3. Trigger Execution, 4. Performance Mechanisms (Row log vs Page deallocation), and 5. Identity Reset behavior."
        },
        {
          type: "table",
          title: "Detailed Comparison Matrix: DELETE vs TRUNCATE vs DROP",
          headers: ["Feature / Dimension", "DELETE", "TRUNCATE", "DROP"],
          rows: [
            ["Command Category", "DML (Data Manipulation)", "DDL (Data Definition)", "DDL (Data Definition)"],
            ["WHERE Clause Support", "YES (Targeted row deletion: `WHERE id = 5`)", "NO (Deletes ALL rows unconditionally)", "NO (Removes entire table object)"],
            ["Speed / Performance", "Slow for large tables ($O(N)$ row-by-row logging)", "Blazing Fast ($O(1)$ page deallocation)", "Instant ($O(1)$ schema catalog drop)"],
            ["Transaction Rollback", "Fully Rollable Back (Logged in Undo/WAL)", "Rollable back in PostgreSQL; No in MySQL/Oracle", "Cannot be rolled back in MySQL/Oracle"],
            ["Fires Row Triggers?", "YES (`ON DELETE` triggers fire for every row)", "NO (Bypasses all row triggers)", "NO (Triggers are dropped alongside table)"],
            ["Auto-Increment Counter", "Retains current high-water mark sequence", "RESETS counter back to 1 / Seed value", "Completely destroyed"],
            ["Schema Preserved?", "YES (Table structure remains intact)", "YES (Empty table structure remains)", "NO (Table structure and schema erased)"]
          ]
        },
        {
          type: "code",
          title: "Demonstrating DELETE, TRUNCATE, and DROP in SQL",
          code: "-- 1. Targeted DML Deletion (Slow, Transactional, Trigger-enabled)\nBEGIN;\nDELETE FROM audit_logs \nWHERE created_at < '2023-01-01' AND severity = 'INFO';\n-- Check affected rows and commit:\nCOMMIT;\n\n-- 2. Fast DDL Truncation (Empties table and resets auto-increment to 1)\n-- Note: In PostgreSQL, TRUNCATE can be rolled back inside a transaction!\nTRUNCATE TABLE staging_events RESTART IDENTITY;\n\n-- 3. Total Object Removal (Destroys data, schema, indexes, and triggers)\nDROP TABLE IF EXISTS legacy_backup_2021 CASCADE;",
          language: "sql",
          explanation: "Use DELETE for targeted row cleanup with business triggers. Use TRUNCATE to reset staging/test tables. Use DROP to decommission schema objects."
        },
        {
          type: "dryRun",
          title: "Why TRUNCATE is 1,000x Faster Than DELETE on a 10-Million Row Table",
          code: "-- Execution Comparison on 10,000,000 rows:\n-- Query A: DELETE FROM transactions;\n-- Query B: TRUNCATE TABLE transactions;",
          steps: [
            { step: 1, explanation: "DELETE: Scans 10,000,000 rows. For EVERY single row, it writes a detailed undo log entry to WAL, marks row header as dead, updates 4 separate indexes, and checks foreign key constraints. Total Time: ~45 seconds." },
            { step: 2, explanation: "TRUNCATE: Modifies the database data dictionary pointers. It marks the storage allocation extents/data pages as free and points the table root to a new empty page. Total Time: ~12 milliseconds." }
          ]
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "Can TRUNCATE be rolled back?",
              trap: "Giving a flat 'No, TRUNCATE can never be rolled back' without qualifying the engine.",
              solution: "In MySQL and Oracle, TRUNCATE is DDL that auto-commits, so it CANNOT be rolled back. In **PostgreSQL and Microsoft SQL Server**, TRUNCATE is fully transaction-safe and CAN be rolled back if executed inside `BEGIN ... ROLLBACK;`!"
            },
            {
              question: "What happens if you try to TRUNCATE a table that is referenced by an active Foreign Key?",
              trap: "Thinking TRUNCATE cascades automatically like DELETE.",
              solution: "The database will REJECT the TRUNCATE statement with a foreign key constraint violation, even if the referencing child table is empty (unless `CASCADE` is explicitly specified in PostgreSQL or the FK is disabled)."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "You need to empty all 5,000,000 rows from a temporary staging table, reset its auto-increment ID counter back to 1, and ensure the operation finishes in milliseconds. Which command should you choose?",
          options: [
            "`DELETE FROM staging_table;`",
            "`DROP TABLE staging_table;`",
            "`TRUNCATE TABLE staging_table;`",
            "`UPDATE staging_table SET id = NULL;`"
          ],
          correctIndex: 2,
          explanation: "`TRUNCATE TABLE` empties all rows via page deallocation, resets the auto-increment identity seed, preserves table schema, and executes in milliseconds."
        },
        {
          type: "takeaways",
          items: [
            "DELETE is DML: Row-by-row removal, supports WHERE, fires triggers, keeps auto-increment counter.",
            "TRUNCATE is DDL: Fast page deallocation, deletes all rows, resets auto-increment seed, bypasses row triggers.",
            "DROP is DDL: Completely eradicates data, table structure, indexes, and schema definitions.",
            "TRUNCATE is transaction-safe in PostgreSQL/SQL Server, but auto-commits in MySQL/Oracle."
          ]
        }
      ]
    }
  },
  {
    slug: "sql-query-execution-order",
    title: "SQL Query Execution Order: The Logical Pipeline",
    content: {
      sections: [
        {
          type: "text",
          title: "Mental Model: Writing Code vs How the Engine Actually Compiles It",
          content: "In English or Java, you read code from top to bottom. In SQL, **the order in which you WRITE a query is completely different from the order in which the database ENGINE EXECUTES it**:\n• You write `SELECT` first at the top of your query text.\n• But the database engine executes `SELECT` **almost last (at Step 6 of 8)**!\n\nUnderstanding this 8-stage logical pipeline is the single most important conceptual superpower for writing bug-free SQL, mastering aliases, filtering aggregations, and optimizing query performance."
        },
        {
          type: "callout",
          title: "The 8-Stage Logical Query Execution Pipeline",
          content: "1. **FROM & JOIN**: Gather source tables and build Cartesian / joined row streams.\n2. **WHERE**: Filter individual base rows before grouping.\n3. **GROUP BY**: Bucket remaining rows into aggregate groups.\n4. **HAVING**: Filter aggregated groups.\n5. **SELECT**: Evaluate expressions, window functions, and project final column list.\n6. **DISTINCT**: Deduplicate projected rows.\n7. **ORDER BY**: Sort the final result set.\n8. **LIMIT / OFFSET**: Paginate and slice the output window."
        },
        {
          type: "table",
          title: "Written Order vs Logical Execution Order",
          headers: ["Stage #", "Written Order (Lexical)", "Logical Execution Order (Actual Engine Pipeline)", "Why It Happens at This Stage"],
          rows: [
            ["1", "`SELECT` (Written 1st)", "`FROM` & `JOIN` (Runs 1st)", "Engine must identify and combine source tables before it can read any data."],
            ["2", "`FROM` & `JOIN` (Written 2nd)", "`WHERE` (Runs 2nd)", "Eliminate unqualified individual rows early before doing expensive groupings."],
            ["3", "`WHERE` (Written 3rd)", "`GROUP BY` (Runs 3rd)", "Group surviving rows into summary buckets."],
            ["4", "`GROUP BY` (Written 4th)", "`HAVING` (Runs 4th)", "Filter summary groups (e.g. `COUNT(*) > 5`)."],
            ["5", "`HAVING` (Written 5th)", "`SELECT` (Runs 5th)", "Compute expressions, assign column aliases, and evaluate window functions."],
            ["6", "`SELECT` (Written 6th)", "`DISTINCT` (Runs 6th)", "Remove duplicate rows from the projected columns."],
            ["7", "`ORDER BY` (Written 7th)", "`ORDER BY` (Runs 7th)", "Sort the projected rows (can now reference column aliases!)."],
            ["8", "`LIMIT / OFFSET` (Written 8th)", "`LIMIT / OFFSET` (Runs 8th)", "Discard rows outside the requested pagination window."]
          ]
        },
        {
          type: "code",
          title: "Traced SQL Query Demonstrating the Complete Execution Pipeline",
          code: "-- A complex analytical query\nSELECT \n    department_id,\n    COUNT(*) AS employee_count,\n    AVG(salary) AS avg_dept_salary\nFROM employees\nWHERE hire_date >= '2020-01-01'        -- Step 2: Filter base rows\nGROUP BY department_id                  -- Step 3: Bucket into departments\nHAVING COUNT(*) >= 3                   -- Step 4: Keep only depts with >= 3 hires\nORDER BY avg_dept_salary DESC          -- Step 7: Sort by alias (Valid because SELECT already ran!)\nLIMIT 5;                               -- Step 8: Return top 5",
          language: "sql",
          explanation: "Trace how each clause executes in sequence: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT."
        },
        {
          type: "dryRun",
          title: "Step-by-Step Resolution of Common Aliasing & Filtering Errors",
          code: "-- Question: Why does Query A fail but Query B succeed?\n-- Query A (FAILS): SELECT dept_id, AVG(salary) AS avg_sal FROM emp WHERE avg_sal > 50000 GROUP BY dept_id;\n-- Query B (WORKS): SELECT dept_id, AVG(salary) AS avg_sal FROM emp GROUP BY dept_id HAVING AVG(salary) > 50000;",
          steps: [
            { step: 1, explanation: "In Query A, the engine attempts to evaluate `WHERE avg_sal > 50000` at Step 2." },
            { step: 2, explanation: "Failure 1: `avg_sal` alias is created in `SELECT` at Step 5. The engine has not reached Step 5 yet!" },
            { step: 3, explanation: "Failure 2: `AVG(salary)` is an aggregate function. Aggregates cannot be computed before `GROUP BY` (Step 3)." },
            { step: 4, explanation: "In Query B, `HAVING AVG(salary) > 50000` runs at Step 4 (after GROUP BY), which is mathematically and syntactically valid." }
          ]
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "Why can't you use aggregate functions (like `SUM()` or `COUNT()`) in a `WHERE` clause?",
              trap: "Saying 'it's just a syntax rule'.",
              solution: "Because the `WHERE` clause executes at Step 2 on individual base rows, BEFORE rows are grouped into buckets at Step 3 (`GROUP BY`). Aggregates only exist after grouping, which is why group filtering must be placed in `HAVING` (Step 4)."
            },
            {
              question: "Why does `ORDER BY` allow using column aliases defined in `SELECT`?",
              trap: "Thinking ORDER BY runs first or in parallel.",
              solution: "Because `SELECT` executes at Step 5, assigning all column aliases. `ORDER BY` executes at Step 7, so all aliases created in Step 5 are fully in scope and accessible."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "Which of the following represents the correct logical execution order of clauses in a SQL query?",
          options: [
            "SELECT &rarr; FROM &rarr; WHERE &rarr; GROUP BY &rarr; HAVING &rarr; ORDER BY",
            "FROM &rarr; WHERE &rarr; GROUP BY &rarr; HAVING &rarr; SELECT &rarr; ORDER BY",
            "FROM &rarr; SELECT &rarr; WHERE &rarr; GROUP BY &rarr; HAVING &rarr; ORDER BY",
            "WHERE &rarr; FROM &rarr; GROUP BY &rarr; HAVING &rarr; SELECT &rarr; LIMIT"
          ],
          correctIndex: 1,
          explanation: "The engine first reads source tables (FROM), filters rows (WHERE), groups them (GROUP BY), filters groups (HAVING), calculates projection and aliases (SELECT), and finally sorts (ORDER BY)."
        },
        {
          type: "takeaways",
          items: [
            "SQL is written in lexical order (SELECT ... FROM), but executed in logical order (FROM ... WHERE ... GROUP BY ... HAVING ... SELECT ... ORDER BY ... LIMIT).",
            "WHERE filters raw individual rows before grouping; HAVING filters aggregated groups after grouping.",
            "Column aliases created in SELECT are invisible to WHERE and HAVING, but are fully accessible in ORDER BY.",
            "Window functions and DISTINCT are evaluated during/after the SELECT stage."
          ]
        }
      ]
    }
  }
];
