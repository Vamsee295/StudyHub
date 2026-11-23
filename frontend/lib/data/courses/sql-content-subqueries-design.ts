// SQL Modules 7-8: Subqueries, Database Design
// Queries run in the StudyHub SQL Lab (SQLite) against the preloaded employees/departments tables.
import { CourseLesson } from './types';

export const subqueryLessons: CourseLesson[] = [
  {
    id: "scalar-and-in-subqueries",
    slug: "scalar-and-in-subqueries",
    title: "Scalar Subqueries and IN Subqueries",
    description: "Queries inside queries: comparing against a single computed value or a list of values.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "text",
          title: "What is a Subquery?",
          content: "A subquery is a SELECT nested inside another statement, written in parentheses. The inner query answers a question the outer query needs, such as 'what is the average salary?' before you can ask 'who earns more than it?'."
        },
        {
          type: "code",
          title: "Scalar Subquery (returns one value)",
          language: "sql",
          code: "SELECT name, salary\nFROM employees\nWHERE salary > (SELECT AVG(salary) FROM employees)\nORDER BY salary DESC;\n-- average is 73625 -> Fiona 92000, Alice 85000, Bob 78000",
          explanation: "The inner query runs once and produces a single number, which the outer WHERE then compares against."
        },
        {
          type: "code",
          title: "IN Subquery (returns a list)",
          language: "sql",
          code: "-- Employees in departments with a budget of at least 300000\nSELECT name\nFROM employees\nWHERE department IN (SELECT name FROM departments WHERE budget >= 300000);\n-- Engineering and Sales qualify -> Alice, Bob, Charlie, Fiona, George",
          explanation: "The subquery returns ('Engineering', 'Sales'), and IN checks each employee's department against that list."
        },
        {
          type: "warning",
          title: "Common Mistakes",
          items: [
            "Using `=` with a subquery that returns several rows raises an error in most databases. Use IN, or make sure it returns exactly one row.",
            "A scalar subquery that returns no rows gives NULL, so the comparison becomes UNKNOWN and filters out every row.",
            "`NOT IN (subquery)` returns nothing if the subquery yields any NULL. Prefer NOT EXISTS."
          ]
        },
        {
          type: "quickCheck",
          question: "What does WHERE salary = (SELECT MAX(salary) FROM employees) return?",
          options: ["Every employee", "Fiona", "Fiona and Alice", "An error"],
          answer: 1,
          explanation: "MAX returns a single value, 92000, and only Fiona earns it."
        },
        {
          type: "takeaways",
          items: ["Scalar subquery → one value, used with = > < etc.", "List subquery → use IN / NOT IN (beware NULLs).", "The inner query of a non-correlated subquery runs once."]
        }
      ]
    }
  },
  {
    id: "correlated-subqueries",
    slug: "correlated-subqueries",
    title: "Correlated Subqueries",
    description: "Subqueries that refer to the outer row and run once per row, and how to rewrite them.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "text",
          title: "Definition",
          content: "A correlated subquery refers to a column of the outer query, so its result is different for every outer row. Conceptually it re-runs for each row (optimizers often rewrite it into a join)."
        },
        {
          type: "code",
          title: "Employees Earning Above Their Own Department's Average",
          language: "sql",
          code: "SELECT e.name, e.department, e.salary\nFROM employees e\nWHERE e.salary > (\n  SELECT AVG(x.salary)\n  FROM employees x\n  WHERE x.department = e.department   -- correlation: depends on the outer row\n)\nORDER BY e.department;",
          explanation: "For Fiona the inner query computes the Engineering average (85000); for Hannah, the Marketing average (69500); and so on."
        },
        {
          type: "table",
          title: "Result",
          headers: ["name", "department", "salary", "department average"],
          rows: [["Fiona", "Engineering", "92000", "85000"], ["Hannah", "Marketing", "71000", "69500"], ["Charlie", "Sales", "65000", "61500"]]
        },
        {
          type: "code",
          title: "The Same Answer With a Derived Table (often faster)",
          language: "sql",
          code: "SELECT e.name, e.department, e.salary\nFROM employees e\nJOIN (SELECT department, AVG(salary) AS avg_sal\n      FROM employees GROUP BY department) d\n  ON d.department = e.department\nWHERE e.salary > d.avg_sal;",
          explanation: "The averages are computed once per department instead of once per employee."
        },
        {
          type: "think",
          question: "HR has only Diana. Why isn't she in the result?",
          answerReveal: "Her department's average is her own salary (72000), and 72000 > 72000 is false. A one-person department never has anyone strictly above its average."
        },
        {
          type: "quickCheck",
          question: "What makes a subquery 'correlated'?",
          options: ["It uses GROUP BY", "It references a column from the outer query", "It returns multiple columns", "It appears in FROM"],
          answer: 1,
          explanation: "Referring to the outer row ties the subquery's result to each individual outer row."
        },
        {
          type: "takeaways",
          items: ["Correlated subqueries reference the outer row and run per row (logically).", "Derived tables, CTEs and window functions are common faster rewrites."]
        }
      ]
    }
  },
  {
    id: "exists-and-not-exists",
    slug: "exists-and-not-exists",
    title: "EXISTS and NOT EXISTS",
    description: "Test whether matching rows exist, the safe alternative to NOT IN, and anti-joins.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "code",
          title: "EXISTS",
          language: "sql",
          code: "-- Departments that hired someone in 2024 or later\nSELECT d.name\nFROM departments d\nWHERE EXISTS (\n  SELECT 1 FROM employees e\n  WHERE e.department = d.name AND e.hire_date >= '2024-01-01'\n);\n-- Sales  (Charlie, hired 2024-02-01)",
          explanation: "EXISTS is true as soon as one matching row is found, and the database can stop searching. The SELECT list inside doesn't matter, so SELECT 1 is the convention."
        },
        {
          type: "code",
          title: "NOT EXISTS",
          language: "sql",
          code: "-- Departments where nobody earns more than 80000\nSELECT d.name\nFROM departments d\nWHERE NOT EXISTS (\n  SELECT 1 FROM employees e\n  WHERE e.department = d.name AND e.salary > 80000\n);\n-- Sales, HR, Marketing",
          explanation: "NOT EXISTS handles NULLs correctly, unlike NOT IN."
        },
        {
          type: "code",
          title: "The Same Anti-Join With LEFT JOIN",
          language: "sql",
          code: "SELECT d.name\nFROM departments d\nLEFT JOIN employees e\n  ON e.department = d.name AND e.salary > 80000\nWHERE e.id IS NULL;",
          explanation: "Keep every department, attach high earners if any exist, then keep only the departments where nothing matched."
        },
        {
          type: "table",
          title: "IN vs EXISTS",
          headers: ["", "IN (subquery)", "EXISTS (subquery)"],
          rows: [
            ["Checks", "Value membership in a list", "Whether any row matches"],
            ["NULL safety (negated)", "NOT IN breaks if the list contains NULL", "NOT EXISTS is safe"],
            ["Typical use", "Small, static lists", "Correlated existence checks"],
            ["Performance", "Modern optimizers often produce the same plan", "Same"]
          ]
        },
        {
          type: "quickCheck",
          question: "Which is the safest way to find customers with no orders when orders.customer_id can be NULL?",
          options: ["NOT IN (SELECT customer_id FROM orders)", "NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id)", "<> ALL (SELECT customer_id FROM orders)", "IN (SELECT NULL)"],
          answer: 1,
          explanation: "NOT IN and <> ALL return nothing as soon as the subquery contains a NULL. NOT EXISTS isn't affected."
        },
        {
          type: "takeaways",
          items: ["EXISTS = does any matching row exist? It stops at the first match.", "Use NOT EXISTS (or LEFT JOIN ... IS NULL) for 'has no ...' questions."]
        }
      ]
    }
  },
  {
    id: "subqueries-in-from-and-select",
    slug: "subqueries-in-from-and-select",
    title: "Subqueries in FROM and SELECT (Derived Tables)",
    description: "Use a query result as a temporary table, or compute a per-row value inline.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "code",
          title: "Derived Table in FROM",
          language: "sql",
          code: "-- Departments whose average salary is above 70000\nSELECT dept, avg_sal\nFROM (\n  SELECT department AS dept, AVG(salary) AS avg_sal\n  FROM employees\n  GROUP BY department\n) t\nWHERE avg_sal > 70000\nORDER BY avg_sal DESC;\n-- Engineering 85000.0, HR 72000.0",
          explanation: "The inner query becomes a temporary table t. Here the same answer could be written with HAVING; derived tables shine when you need several steps."
        },
        {
          type: "code",
          title: "Scalar Subquery in SELECT",
          language: "sql",
          code: "-- Payroll per department compared with its budget\nSELECT d.name, d.budget,\n       (SELECT SUM(salary) FROM employees e WHERE e.department = d.name) AS payroll\nFROM departments d\nORDER BY d.id;\n-- Engineering 500000 255000\n-- Sales       300000 123000\n-- HR          200000  72000\n-- Marketing   250000 139000",
          explanation: "A subquery in SELECT must return one value per row. If it returns no rows, the value is NULL."
        },
        {
          type: "warning",
          title: "Common Mistakes",
          items: [
            "Forgetting the alias for a derived table: most databases (MySQL, PostgreSQL) require `( ... ) AS t`.",
            "Nesting four or five levels deep. Switch to CTEs (WITH) for readability."
          ]
        },
        {
          type: "quickCheck",
          question: "Which department has the largest gap between its budget and its payroll?",
          options: ["Engineering", "Sales", "HR", "Marketing"],
          answer: 0,
          explanation: "Engineering: 500000 − 255000 = 245000, which beats Sales (177000), HR (128000) and Marketing (111000)."
        },
        {
          type: "takeaways",
          items: ["A FROM subquery = a derived table (give it an alias).", "A SELECT subquery = a per-row scalar value.", "Prefer CTEs once queries nest deeply."]
        }
      ]
    }
  }
];

export const databaseDesignLessons: CourseLesson[] = [
  {
    id: "schema-design-from-requirements",
    slug: "schema-design-from-requirements",
    title: "Designing a Schema From Requirements",
    description: "Turn a problem statement into tables, keys and relationships, step by step.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "text",
          title: "The Process",
          content: "1. List the nouns in the requirements; they're candidate entities (tables).\n2. List the facts about each noun; they're attributes (columns).\n3. Find the relationships and their cardinality (1:1, 1:N, M:N).\n4. Choose primary keys; add foreign keys for 1:N relationships and junction tables for M:N.\n5. Normalize to 3NF, then denormalize only for proven performance needs.\n6. Add constraints (NOT NULL, UNIQUE, CHECK) and the indexes that real queries need."
        },
        {
          type: "text",
          title: "Requirements: A Course Platform",
          content: "Students sign up with a unique email. Courses have a title and a price. A student can enroll in many courses and a course has many students; each enrollment records its date and progress percentage. Each course belongs to exactly one category."
        },
        {
          type: "code",
          title: "The Resulting Schema",
          language: "sql",
          code: "CREATE TABLE category (\n  id   INTEGER PRIMARY KEY,\n  name TEXT NOT NULL UNIQUE\n);\n\nCREATE TABLE course (\n  id          INTEGER PRIMARY KEY,\n  title       TEXT NOT NULL,\n  price       INTEGER NOT NULL CHECK (price >= 0),        -- store paise/cents\n  category_id INTEGER NOT NULL REFERENCES category(id)     -- 1:N\n);\n\nCREATE TABLE student (\n  id    INTEGER PRIMARY KEY,\n  name  TEXT NOT NULL,\n  email TEXT NOT NULL UNIQUE\n);\n\nCREATE TABLE enrollment (                                  -- M:N junction\n  student_id  INTEGER NOT NULL REFERENCES student(id) ON DELETE CASCADE,\n  course_id   INTEGER NOT NULL REFERENCES course(id),\n  enrolled_on TEXT NOT NULL DEFAULT (date('now')),\n  progress    INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),\n  PRIMARY KEY (student_id, course_id)\n);",
          explanation: "The composite primary key stops a student enrolling twice in the same course. Run this in the SQL Lab and try inserting a duplicate enrollment."
        },
        {
          type: "think",
          question: "Where should the enrollment date and progress live? On student, on course, or somewhere else?",
          answerReveal: "On enrollment. They describe the relationship between one student and one course, not either entity alone. Attributes of an M:N relationship always belong in the junction table."
        },
        {
          type: "quickCheck",
          question: "A course belongs to exactly one category; a category has many courses. Where does the foreign key go?",
          options: ["category.course_id", "course.category_id", "A junction table", "Both tables"],
          answer: 1,
          explanation: "In a 1:N relationship the foreign key goes on the 'many' side: each course points to its one category."
        },
        {
          type: "takeaways",
          items: ["Nouns → tables, facts → columns, relationships → foreign keys or junction tables.", "Relationship attributes belong in the junction table.", "Encode the rules as constraints, not just in application code."]
        }
      ]
    }
  },
  {
    id: "constraints-and-ddl",
    slug: "constraints-and-ddl",
    title: "Constraints and DDL: CREATE, ALTER, DROP",
    description: "Declare and change tables safely, and let the database enforce your rules.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "table",
          title: "Constraint Cheat Sheet",
          headers: ["Constraint", "Guarantees", "Example"],
          rows: [
            ["PRIMARY KEY", "Unique + not null; identifies a row", "`id INTEGER PRIMARY KEY`"],
            ["FOREIGN KEY", "Value exists in the parent table", "`REFERENCES department(id)`"],
            ["UNIQUE", "No duplicate values (NULLs usually allowed)", "`email TEXT UNIQUE`"],
            ["NOT NULL", "A value is required", "`name TEXT NOT NULL`"],
            ["CHECK", "A custom rule", "`CHECK (salary > 0)`"],
            ["DEFAULT", "Value used when none is given", "`DEFAULT 0`"]
          ]
        },
        {
          type: "code",
          title: "Changing a Table",
          language: "sql",
          code: "-- Add a column (works in every database)\nALTER TABLE employees ADD COLUMN email TEXT;\n\n-- Rename a column (SQLite 3.25+, PostgreSQL, MySQL 8)\nALTER TABLE employees RENAME COLUMN email TO work_email;\n\n-- Remove things\nDROP TABLE IF EXISTS temp_import;\nDELETE FROM logs WHERE created_at < '2024-01-01';  -- removes rows (DML, can be rolled back)\n-- TRUNCATE TABLE logs;  -- empties the whole table fast (DDL; not available in SQLite)",
          explanation: "SQLite's ALTER TABLE is limited: to change a column's type or add a constraint, you create a new table, copy the data, and swap the names."
        },
        {
          type: "table",
          title: "DELETE vs TRUNCATE vs DROP",
          headers: ["", "DELETE", "TRUNCATE", "DROP"],
          rows: [
            ["Removes", "Selected rows (WHERE)", "All rows", "The table itself (structure + data)"],
            ["Category", "DML", "DDL", "DDL"],
            ["Row triggers", "Fire", "Don't fire", "N/A"],
            ["Rollback", "Yes", "Depends on the database (yes in PostgreSQL, no in MySQL)", "Depends on the database"],
            ["Speed on a big table", "Slow (row by row, logged)", "Fast", "Fast"]
          ]
        },
        {
          type: "quickCheck",
          question: "Which statement removes all rows but keeps the table structure, and can filter with WHERE?",
          options: ["TRUNCATE", "DROP", "DELETE", "ALTER"],
          answer: 2,
          explanation: "Only DELETE supports WHERE. TRUNCATE always removes every row; DROP removes the table itself."
        },
        {
          type: "takeaways",
          items: ["Constraints make the database reject bad data from every client, not just your app.", "Know DELETE vs TRUNCATE vs DROP; it's asked in almost every SQL interview."]
        }
      ]
    }
  },
  {
    id: "normalization-in-practice",
    slug: "normalization-in-practice",
    title: "Normalization in Practice",
    description: "Spot redundancy in a real table, split it to 3NF, and decide when denormalizing is justified.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "text",
          title: "A Flat 'orders' Spreadsheet",
          content: "orders_flat(order_id, order_date, customer_email, customer_name, customer_city, product_sku, product_name, unit_price, qty)\n\nProblems:\n- customer_name and customer_city repeat on every order (update anomaly);\n- a product can't exist until someone orders it (insertion anomaly);\n- deleting a customer's only order loses the customer (deletion anomaly);\n- one order with three products takes three rows that repeat order_date."
        },
        {
          type: "code",
          title: "Decomposed to 3NF",
          language: "sql",
          code: "CREATE TABLE customer (\n  id INTEGER PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT, city TEXT\n);\nCREATE TABLE product (\n  sku TEXT PRIMARY KEY, name TEXT NOT NULL, unit_price INTEGER NOT NULL\n);\nCREATE TABLE orders (\n  id INTEGER PRIMARY KEY,\n  customer_id INTEGER NOT NULL REFERENCES customer(id),\n  order_date TEXT NOT NULL\n);\nCREATE TABLE order_item (\n  order_id   INTEGER REFERENCES orders(id),\n  sku        TEXT REFERENCES product(sku),\n  qty        INTEGER NOT NULL CHECK (qty > 0),\n  unit_price INTEGER NOT NULL,          -- price AT THE TIME of the order (intentional copy)\n  PRIMARY KEY (order_id, sku)\n);",
          explanation: "Copying unit_price into order_item isn't a normalization mistake: it records a historical fact. If the product's price changes tomorrow, old invoices must still show what the customer actually paid."
        },
        {
          type: "list",
          title: "When to Denormalize (deliberately)",
          items: [
            "**Read-heavy aggregates**: a `comments_count` column on posts instead of counting on every page view.",
            "**Reporting / warehouses**: star schemas with wide fact tables.",
            "**Historical snapshots**: prices, addresses and tax rates at the time of a transaction.",
            "Always keep the copy consistent (triggers, jobs or transactional updates) and write down why it exists."
          ]
        },
        {
          type: "quickCheck",
          question: "Why does order_item store unit_price even though product already has a price?",
          options: ["A mistake; it should be removed", "To record the price at purchase time", "Because SQL requires it", "To speed up joins"],
          answer: 1,
          explanation: "Product prices change; orders must keep the price that was actually charged."
        },
        {
          type: "takeaways",
          items: ["Split by subject: customers, products, orders, order lines.", "Historical values are facts of the transaction, not redundancy.", "For the theory (FDs, 2NF/3NF/BCNF), see the DBMS course's Normalization module."]
        }
      ]
    }
  },
  {
    id: "indexes-and-views",
    slug: "indexes-and-views",
    title: "Indexes, EXPLAIN and Views",
    description: "Speed up queries with the right index, check the plan, and package queries as views.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "code",
          title: "Creating and Checking an Index",
          language: "sql",
          code: "-- Without an index, this scans every row\nEXPLAIN QUERY PLAN\nSELECT * FROM employees WHERE department = 'Sales';\n-- SCAN employees\n\nCREATE INDEX idx_emp_department ON employees(department);\n\nEXPLAIN QUERY PLAN\nSELECT * FROM employees WHERE department = 'Sales';\n-- SEARCH employees USING INDEX idx_emp_department (department=?)",
          explanation: "SQLite uses EXPLAIN QUERY PLAN; MySQL and PostgreSQL use EXPLAIN (and EXPLAIN ANALYZE to actually run the query and time it)."
        },
        {
          type: "list",
          title: "What to Index",
          items: [
            "Columns in **WHERE**, **JOIN ... ON** and **ORDER BY** of frequent queries.",
            "**Foreign keys**: joins and cascading deletes use them (PostgreSQL doesn't index them automatically).",
            "**Composite indexes** for multi-column filters: equality columns first, the range column last.",
            "Avoid indexing low-selectivity columns or tables that are write-heavy and rarely read."
          ]
        },
        {
          type: "code",
          title: "Views",
          language: "sql",
          code: "CREATE VIEW dept_summary AS\nSELECT department, COUNT(*) AS headcount, AVG(salary) AS avg_salary\nFROM employees\nGROUP BY department;\n\nSELECT * FROM dept_summary WHERE headcount >= 2;",
          explanation: "A view is a saved query, not a copy of the data: it runs fresh every time. Use views to simplify repeated logic and to expose only safe columns (security). Materialized views (PostgreSQL, Oracle) store the result and must be refreshed."
        },
        {
          type: "quickCheck",
          question: "After creating idx_emp_department, which query can NOT use it efficiently?",
          options: ["WHERE department = 'HR'", "WHERE department IN ('HR', 'Sales')", "WHERE LOWER(department) = 'hr'", "ORDER BY department"],
          answer: 2,
          explanation: "Wrapping the column in a function hides it from a normal index. You'd need an expression index on LOWER(department)."
        },
        {
          type: "takeaways",
          items: ["Index columns used in filters, joins and sorts; check the plan with EXPLAIN.", "Functions on indexed columns defeat the index.", "A view is a stored query; a materialized view stores its results."]
        }
      ]
    }
  },
  {
    id: "transactions-in-sql",
    slug: "transactions-in-sql",
    title: "Transactions in SQL: BEGIN, COMMIT, ROLLBACK",
    description: "Group statements into all-or-nothing units and see a rollback in action.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "code",
          title: "Try a Rollback in the SQL Lab",
          language: "sql",
          code: "BEGIN TRANSACTION;\nUPDATE employees SET salary = salary * 2 WHERE department = 'Sales';\nSELECT name, salary FROM employees WHERE department = 'Sales';\n-- Charlie 130000, George 116000   (visible inside the transaction)\nROLLBACK;\n\nSELECT name, salary FROM employees WHERE department = 'Sales';\n-- Charlie 65000, George 58000     (changes undone)",
          explanation: "Replace ROLLBACK with COMMIT to make the change permanent."
        },
        {
          type: "code",
          title: "A Safe Money Transfer",
          language: "sql",
          code: "BEGIN;\nUPDATE account SET balance = balance - 500 WHERE id = 1 AND balance >= 500;\n-- application checks that exactly 1 row was updated; if not -> ROLLBACK\nUPDATE account SET balance = balance + 500 WHERE id = 2;\nCOMMIT;",
          explanation: "The `balance >= 500` condition, plus checking the affected-row count, prevents overdrafts even when two transfers run at the same moment."
        },
        {
          type: "list",
          title: "Rules of Thumb",
          items: [
            "Keep transactions **short**: locks are held until COMMIT.",
            "Never wait for user input inside an open transaction.",
            "Catch errors and ROLLBACK; on deadlock or serialization errors, **retry** the whole transaction.",
            "For the theory (ACID, isolation levels, locking), see the DBMS course's Transactions and Concurrency modules."
          ]
        },
        {
          type: "quickCheck",
          question: "A transaction updates 3 rows, then the app crashes before COMMIT. What happens to the 3 updates?",
          options: ["They're saved", "They're rolled back", "Only the first is saved", "It depends on the row order"],
          answer: 1,
          explanation: "Uncommitted work is undone. That's atomicity."
        },
        {
          type: "takeaways",
          items: ["BEGIN ... COMMIT makes a group of statements atomic; ROLLBACK undoes them.", "Keep transactions short and retry on deadlocks."]
        }
      ]
    }
  }
];
