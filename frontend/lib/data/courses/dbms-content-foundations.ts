// DBMS Modules 1-3: Architecture, ER Modeling, Relational Model
import { CourseLesson } from './types';

export const dbmsArchitectureLessons: CourseLesson[] = [
  {
    id: "what-is-a-dbms",
    slug: "what-is-a-dbms",
    title: "What is a DBMS? (and why not just use files)",
    description: "The problems with file-based storage and how a DBMS solves them.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "text",
          title: "Definition",
          content: "A Database Management System (DBMS) is software that stores data, lets many users read and change it at the same time, and keeps it correct and safe even when programs crash or users make mistakes.\n\nThe database is the data itself. The DBMS is the program that manages it (MySQL, PostgreSQL, Oracle, SQL Server, SQLite, MongoDB)."
        },
        {
          type: "text",
          title: "Mental Model",
          content: "Imagine a college keeping student records in spreadsheets: the exam cell has one file, the hostel office another, the library a third. A student's phone number changes — now it's correct in one file and wrong in two. Two clerks edit the same file at once and one clerk's change silently disappears. The laptop dies halfway through saving and the file is corrupted.\n\nA DBMS is the single, shared, guarded record room that fixes all of these problems at once."
        },
        {
          type: "table",
          title: "File System vs DBMS",
          headers: ["Problem with plain files", "How a DBMS handles it"],
          rows: [
            ["Data redundancy & inconsistency (same data copied in many files)", "One shared copy, normalized design, constraints"],
            ["Difficult access (a new report needs a new program)", "Declarative query language (SQL)"],
            ["Integrity rules buried in application code", "Constraints declared once: `NOT NULL`, `CHECK`, `FOREIGN KEY`"],
            ["Partial updates after a crash", "Atomic transactions + recovery logs"],
            ["Concurrent edits overwrite each other", "Concurrency control (locks, MVCC)"],
            ["All-or-nothing security", "Fine-grained permissions (`GRANT`, `REVOKE`, views)"]
          ]
        },
        {
          type: "list",
          title: "Who Uses a DBMS",
          items: [
            "**End users** use it indirectly through apps (booking a ticket, checking a bank balance).",
            "**Application developers** write SQL or use an ORM to talk to it.",
            "**Database Administrators (DBAs)** manage schema, users, backups, performance and security.",
            "**Database designers** decide what tables, keys and relationships exist."
          ]
        },
        {
          type: "warning",
          title: "Common Mistakes",
          items: [
            "Calling MySQL a 'database'. MySQL is a DBMS; the data it manages is the database.",
            "Thinking a DBMS is always relational. Document, key-value and graph stores are DBMSs too.",
            "Saying a DBMS removes all redundancy. It controls redundancy; some is added on purpose (indexes, replicas, caches)."
          ]
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "What are the advantages of a DBMS over a file system?",
              trap: "Listing only 'it stores data' or 'it is faster'.",
              solution: "Name the concrete problems: redundancy and inconsistency, data isolation, integrity, atomicity, concurrent access anomalies, and security. Give one example per point."
            },
            {
              question: "When would you NOT use a DBMS?",
              trap: "Saying 'never'.",
              solution: "Small single-user data, simple config or log files, or embedded devices with tight resources, where the DBMS overhead isn't worth it. Even then, SQLite is often a good middle ground."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "Two bank tellers update the same account at the same instant and one update is lost. Which DBMS feature prevents this?",
          options: ["Data independence", "Concurrency control", "Normalization", "Indexing"],
          answer: 1,
          explanation: "Concurrency control (locking or MVCC) coordinates simultaneous transactions so that one update cannot silently overwrite another (the 'lost update' problem)."
        },
        {
          type: "takeaways",
          items: [
            "Database = the data. DBMS = the software that manages it.",
            "A DBMS solves redundancy, inconsistency, integrity, atomicity, concurrency and security problems of plain files.",
            "Interviewers expect the file-system-vs-DBMS comparison with examples."
          ]
        }
      ]
    }
  },
  {
    id: "dbms-tier-architecture",
    slug: "dbms-tier-architecture",
    title: "1-Tier, 2-Tier and 3-Tier Architecture",
    description: "How applications, servers and databases are arranged, and why most web apps are 3-tier.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "text",
          title: "Core Idea",
          content: "Tier architecture describes where the user interface, the business logic and the database physically run, and who talks to whom."
        },
        {
          type: "table",
          title: "The Three Architectures",
          headers: ["Architecture", "How it works", "Example", "Trade-off"],
          rows: [
            ["1-Tier", "UI, logic and database on the same machine", "SQLite inside a desktop app; a developer running MySQL locally", "Simple, but no sharing between users"],
            ["2-Tier (client-server)", "Client app talks directly to the database server", "A college's desktop billing app connecting straight to Oracle", "Fast to build, but every client needs DB credentials; hard to scale and secure"],
            ["3-Tier", "Client → application server → database server", "Browser → Spring/Django/FastAPI backend → PostgreSQL", "Clients never touch the DB; logic is centralized; each tier scales independently"]
          ]
        },
        {
          type: "code",
          title: "A 3-Tier Request, Step by Step",
          language: "text",
          code: "[Presentation tier]   Browser / mobile app\n        |  HTTPS: POST /api/orders\n        v\n[Application tier]    Backend server (business rules, auth, validation)\n        |  SQL: INSERT INTO orders ...\n        v\n[Data tier]           DBMS (PostgreSQL / MySQL)",
          explanation: "The browser never sees SQL or database credentials. The backend validates the request, then sends SQL to the database."
        },
        {
          type: "think",
          question: "Why is a 2-tier design risky for a public mobile app?",
          answerReveal: "Every installed copy of the app would need database credentials and a direct network path to the database. Anyone who decompiles the app can extract those credentials and run arbitrary queries. A 3-tier design keeps credentials on the server and exposes only a controlled API."
        },
        {
          type: "warning",
          title: "Common Mistakes",
          items: [
            "Confusing tiers (physical machines / processes) with layers (logical code organization). A 3-layer codebase can still be deployed as 1 tier.",
            "Thinking 3-tier means exactly three servers. Each tier can be many machines behind a load balancer."
          ]
        },
        {
          type: "quickCheck",
          question: "A React frontend calls a Node.js API, which queries MongoDB. Which architecture is this?",
          options: ["1-tier", "2-tier", "3-tier", "Distributed 1-tier"],
          answer: 2,
          explanation: "Presentation (React), application (Node.js API) and data (MongoDB) are separate tiers, and the client never talks to the database directly."
        },
        {
          type: "takeaways",
          items: [
            "1-tier: everything on one machine. 2-tier: client talks to DB directly. 3-tier: client → app server → DB.",
            "Modern web apps are 3-tier because it is more secure and scales better."
          ]
        }
      ]
    }
  },
  {
    id: "schemas-and-data-independence",
    slug: "schemas-and-data-independence",
    title: "Three-Schema Architecture & Data Independence",
    description: "External, conceptual and internal levels; schema vs instance; logical and physical data independence.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "text",
          title: "Schema vs Instance",
          content: "A schema is the design of the database: table names, columns, types and constraints. It changes rarely.\n\nAn instance (or state) is the actual data stored at one moment. It changes with every INSERT, UPDATE and DELETE.\n\nAnalogy: the schema is the blank form; the instance is the stack of filled-in forms."
        },
        {
          type: "table",
          title: "The Three Levels (ANSI/SPARC)",
          headers: ["Level", "What it describes", "Who sees it", "Example"],
          rows: [
            ["External (view) level", "The part of the data a particular user or app needs", "End users, applications", "A `student_marks_view` that hides fees and phone numbers"],
            ["Conceptual (logical) level", "All entities, attributes, relationships and constraints", "Designers, DBAs", "Tables `student`, `course`, `enrollment` with their keys"],
            ["Internal (physical) level", "How data is stored on disk", "DBMS, DBA", "B+ tree index on `roll_no`, 8 KB pages, compression"]
          ]
        },
        {
          type: "text",
          title: "Data Independence",
          content: "Data independence is the ability to change the schema at one level without having to change the level above it.\n\nPhysical data independence: change the internal level (add an index, move to SSD, change file organization) without changing the conceptual schema or applications. This is easy to achieve and very common.\n\nLogical data independence: change the conceptual schema (add a column, split a table) without breaking external views and applications. This is harder, because applications often depend on the exact table structure. Views help: the view keeps showing the old shape."
        },
        {
          type: "code",
          title: "Logical Data Independence Using a View",
          language: "sql",
          code: "-- Originally the app queried: SELECT name, email FROM student;\n-- We split contact details into a separate table:\nCREATE TABLE student_contact (\n  roll_no INT PRIMARY KEY REFERENCES student(roll_no),\n  email   VARCHAR(100)\n);\n\n-- Recreate the old shape so existing app code keeps working\nCREATE VIEW student_v AS\nSELECT s.roll_no, s.name, c.email\nFROM student s JOIN student_contact c ON c.roll_no = s.roll_no;",
          explanation: "Applications switch to `student_v` (or the view takes the old name), and the conceptual change stays invisible to them."
        },
        {
          type: "table",
          title: "SQL Language Categories",
          headers: ["Category", "Purpose", "Commands"],
          rows: [
            ["DDL (Data Definition)", "Define or change the schema", "`CREATE`, `ALTER`, `DROP`, `TRUNCATE`, `RENAME`"],
            ["DML (Data Manipulation)", "Read and change data", "`SELECT`, `INSERT`, `UPDATE`, `DELETE`"],
            ["DCL (Data Control)", "Permissions", "`GRANT`, `REVOKE`"],
            ["TCL (Transaction Control)", "Manage transactions", "`COMMIT`, `ROLLBACK`, `SAVEPOINT`"]
          ]
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "Is TRUNCATE DDL or DML? How is it different from DELETE?",
              trap: "Saying they are the same because both remove rows.",
              solution: "TRUNCATE is DDL: it deallocates the table's data pages, cannot have a WHERE clause, doesn't fire row triggers, resets identity counters in most DBMSs, and is usually not rollback-able in MySQL (it is in PostgreSQL). DELETE is DML: row by row, supports WHERE, fires triggers, fully logged and rollback-able."
            },
            {
              question: "Which data independence is harder to achieve and why?",
              trap: "Answering physical.",
              solution: "Logical data independence is harder, because applications are written against the logical structure (table and column names). Physical changes are hidden by the DBMS automatically."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "Adding a B+ tree index on a column without changing any queries is an example of:",
          options: ["Logical data independence", "Physical data independence", "External schema change", "Normalization"],
          answer: 1,
          explanation: "An index is a change at the internal (physical) level. Queries and the conceptual schema stay the same."
        },
        {
          type: "takeaways",
          items: [
            "Schema = structure (rarely changes); instance = data at a moment (changes constantly).",
            "Three levels: external (views), conceptual (logical design), internal (storage).",
            "Physical independence is easy and common; logical independence is harder and relies on views.",
            "Know DDL / DML / DCL / TCL with examples, and DELETE vs TRUNCATE vs DROP."
          ]
        }
      ]
    }
  },
  {
    id: "data-models-oltp-olap",
    slug: "data-models-oltp-olap",
    title: "Data Models, OLTP vs OLAP",
    description: "Relational, document, key-value and graph models, and the difference between transactional and analytical systems.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "text",
          title: "What is a Data Model?",
          content: "A data model is the set of concepts used to describe data, relationships and constraints. It decides how you think about and query your data."
        },
        {
          type: "table",
          title: "Common Data Models",
          headers: ["Model", "Data looks like", "Good for", "Examples"],
          rows: [
            ["Relational", "Tables of rows and columns linked by keys", "Structured data, strong consistency, complex queries and joins", "PostgreSQL, MySQL, Oracle"],
            ["Document", "JSON-like documents with nested fields", "Flexible or evolving schemas, data read as a whole object", "MongoDB, Couchbase"],
            ["Key-value", "A key mapped to an opaque value", "Caching, sessions, very fast lookups by key", "Redis, DynamoDB"],
            ["Wide-column", "Rows with dynamic column families", "Huge write-heavy datasets (time series, events)", "Cassandra, HBase"],
            ["Graph", "Nodes and edges with properties", "Highly connected data: social networks, recommendations, fraud rings", "Neo4j"],
            ["Hierarchical / Network (historical)", "Trees / general graphs of records", "Legacy mainframe systems", "IBM IMS, IDMS"]
          ]
        },
        {
          type: "table",
          title: "OLTP vs OLAP",
          headers: ["", "OLTP (Online Transaction Processing)", "OLAP (Online Analytical Processing)"],
          rows: [
            ["Purpose", "Run the business: orders, payments, bookings", "Analyze the business: trends, reports, dashboards"],
            ["Typical query", "Read/update a few rows by key", "Scan and aggregate millions of rows"],
            ["Schema design", "Highly normalized", "Denormalized (star / snowflake schema)"],
            ["Users", "Thousands of concurrent app users", "Analysts, BI tools"],
            ["Storage", "Usually row-oriented", "Usually column-oriented"],
            ["Examples", "MySQL behind an e-commerce site", "Snowflake, BigQuery, Redshift data warehouses"]
          ]
        },
        {
          type: "think",
          question: "Why do companies copy data from their OLTP database into a separate warehouse instead of running reports directly on it?",
          answerReveal: "Large analytical scans compete with live transactions for CPU, memory and locks, slowing the app for customers. A warehouse is also designed differently (denormalized, columnar) so aggregations run much faster. Data is moved there by ETL/ELT pipelines."
        },
        {
          type: "quickCheck",
          question: "A dashboard computes total monthly revenue by region over 5 years of sales. This workload is:",
          options: ["OLTP", "OLAP", "Key-value", "Hierarchical"],
          answer: 1,
          explanation: "It aggregates a huge amount of historical data for analysis, which is the definition of OLAP."
        },
        {
          type: "takeaways",
          items: [
            "Pick the data model from the access pattern, not from fashion.",
            "OLTP = many small transactions on normalized data; OLAP = big aggregations on denormalized, columnar data."
          ]
        }
      ]
    }
  }
];

export const erModelingLessons: CourseLesson[] = [
  {
    id: "entities-and-attributes",
    slug: "entities-and-attributes",
    title: "Entities, Entity Sets and Attribute Types",
    description: "The building blocks of an ER diagram and the six kinds of attributes.",
    estimatedMinutes: 15,
    content: {
      sections: [
        {
          type: "text",
          title: "Core Concepts",
          content: "The Entity-Relationship (ER) model is a way to design a database on paper before writing any SQL.\n\nEntity: a real-world object you store data about (a particular student, Ravi).\nEntity set: all entities of the same type (all students). Drawn as a rectangle.\nAttribute: a property of an entity (name, roll number). Drawn as an oval."
        },
        {
          type: "table",
          title: "Attribute Types",
          headers: ["Type", "Meaning", "Example", "ER notation"],
          rows: [
            ["Simple", "Cannot be divided further", "`roll_no`", "Plain oval"],
            ["Composite", "Made of smaller parts", "`name` = first + middle + last", "Oval with child ovals"],
            ["Single-valued", "One value per entity", "`date_of_birth`", "Plain oval"],
            ["Multivalued", "Several values per entity", "`phone_numbers`", "Double oval"],
            ["Derived", "Computed from another attribute", "`age` from `date_of_birth`", "Dashed oval"],
            ["Key", "Uniquely identifies the entity", "`roll_no`", "Underlined name"]
          ]
        },
        {
          type: "think",
          question: "Why is storing `age` as a column usually a bad idea?",
          answerReveal: "Age changes every year, so the stored value goes stale unless something updates it. Store `date_of_birth` and compute age when you query it. That makes age a derived attribute."
        },
        {
          type: "text",
          title: "How Multivalued Attributes Become Tables",
          content: "A relational column holds one value, so a multivalued attribute such as phone_numbers moves into its own table: student_phone(roll_no, phone), with primary key (roll_no, phone). Putting 'phone1, phone2, phone3' columns or a comma-separated string in one column breaks first normal form."
        },
        {
          type: "quickCheck",
          question: "In an ER diagram, a double oval represents:",
          options: ["A key attribute", "A derived attribute", "A multivalued attribute", "A weak entity"],
          answer: 2,
          explanation: "Double oval = multivalued. Dashed oval = derived, underline = key, double rectangle = weak entity."
        },
        {
          type: "takeaways",
          items: [
            "Entity = a thing; entity set = all things of that type; attribute = a property.",
            "Know all six attribute types and their notation.",
            "Multivalued attributes become separate tables; derived attributes are usually not stored."
          ]
        }
      ]
    }
  },
  {
    id: "relationships-and-cardinality",
    slug: "relationships-and-cardinality",
    title: "Relationships, Cardinality and Participation",
    description: "Degree of a relationship, 1:1 / 1:N / M:N cardinality, and total vs partial participation.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "text",
          title: "Relationship Sets",
          content: "A relationship is an association between entities (Ravi ENROLLS IN DBMS). A relationship set groups relationships of the same type and is drawn as a diamond. Relationships can have their own attributes, for example enrolls(grade, semester)."
        },
        {
          type: "table",
          title: "Degree of a Relationship",
          headers: ["Degree", "Entity sets involved", "Example"],
          rows: [
            ["Unary (recursive)", "1 (the same set twice, in different roles)", "Employee MANAGES Employee"],
            ["Binary", "2", "Student ENROLLS_IN Course"],
            ["Ternary", "3", "Doctor PRESCRIBES Medicine TO Patient"]
          ]
        },
        {
          type: "table",
          title: "Cardinality Ratios",
          headers: ["Ratio", "Meaning", "Example"],
          rows: [
            ["1 : 1", "Each A relates to at most one B, and vice versa", "Person HAS Passport"],
            ["1 : N", "One A relates to many B; each B to at most one A", "Department HAS Employees"],
            ["M : N", "Many A to many B", "Student ENROLLS_IN Course"]
          ]
        },
        {
          type: "text",
          title: "Participation Constraints",
          content: "Total participation: every entity in the set must take part in the relationship. Drawn as a double line. Example: every Employee must WORK_IN some Department.\n\nPartial participation: some entities may not take part. Drawn as a single line. Example: not every Employee MANAGES a department.\n\nMin-max notation (min, max) on each side expresses both ideas at once, e.g. Employee (1,1) WORKS_IN (0,N) Department."
        },
        {
          type: "think",
          question: "A college says: 'Each course is taught by exactly one professor, and a professor can teach many courses, or none.' What is the cardinality and participation?",
          answerReveal: "1 : N from Professor to Course. Course has total participation (every course must have a professor). Professor has partial participation (a professor may teach zero courses)."
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "How do you store an M:N relationship in tables?",
              trap: "Adding a foreign key column on one side.",
              solution: "Create a separate junction (bridge) table holding both foreign keys, e.g. enrollment(roll_no, course_id, grade) with primary key (roll_no, course_id)."
            },
            {
              question: "Can a ternary relationship always be replaced by three binary ones?",
              trap: "Saying yes.",
              solution: "No. Three binary relationships can lose information. 'Doctor D prescribed medicine M to patient P' is not recoverable from separate Doctor-Patient, Doctor-Medicine and Patient-Medicine pairs."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "Every loan must belong to a customer, but a customer may have no loans. Loan's participation in BORROWS is:",
          options: ["Partial", "Total", "Recursive", "Derived"],
          answer: 1,
          explanation: "Every loan must take part, so Loan has total participation (double line). Customer's participation is partial."
        },
        {
          type: "takeaways",
          items: [
            "Degree = how many entity sets; cardinality = how many of each can relate; participation = whether taking part is mandatory.",
            "M:N relationships always become a junction table."
          ]
        }
      ]
    }
  },
  {
    id: "weak-entities-and-extended-er",
    slug: "weak-entities-and-extended-er",
    title: "Weak Entities, Generalization, Specialization & Aggregation",
    description: "Entities without their own key, and the Extended ER (EER) features used for inheritance.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "text",
          title: "Weak Entities",
          content: "A weak entity cannot be identified by its own attributes alone. It depends on an owner (strong) entity through an identifying relationship.\n\nExample: a Dependent (an employee's child) is identified by the employee's ID plus the dependent's name. Two employees can each have a child named 'Asha'.\n\nThe weak entity's partial key (discriminator) is drawn with a dashed underline. The weak entity is a double rectangle, the identifying relationship a double diamond, and the weak entity always has total participation."
        },
        {
          type: "code",
          title: "Mapping a Weak Entity to SQL",
          language: "sql",
          code: "CREATE TABLE dependent (\n  emp_id        INT          NOT NULL,\n  dependent_name VARCHAR(50)  NOT NULL,\n  relation      VARCHAR(20),\n  PRIMARY KEY (emp_id, dependent_name),\n  FOREIGN KEY (emp_id) REFERENCES employee(emp_id) ON DELETE CASCADE\n);",
          explanation: "Primary key = owner's key + partial key. ON DELETE CASCADE reflects existence dependency: if the employee goes, so do the dependents."
        },
        {
          type: "table",
          title: "Extended ER Features",
          headers: ["Feature", "Direction", "Example"],
          rows: [
            ["Specialization", "Top-down: split a general entity into sub-types", "Employee → Engineer, Manager, Intern"],
            ["Generalization", "Bottom-up: combine similar entities into a super-type", "Car + Truck → Vehicle"],
            ["Inheritance", "Sub-types inherit the super-type's attributes and relationships", "Engineer inherits `emp_id`, `name`"],
            ["Aggregation", "Treat a relationship as an entity so it can join another relationship", "(Employee WORKS_ON Project) is MONITORED_BY Manager"]
          ]
        },
        {
          type: "list",
          title: "Specialization Constraints",
          items: [
            "**Disjoint (d)**: an entity belongs to at most one sub-type (a Vehicle is either a Car or a Truck).",
            "**Overlapping (o)**: an entity may belong to several sub-types (a Person can be both a Student and an Employee).",
            "**Total**: every super-type entity must be in some sub-type.",
            "**Partial**: a super-type entity may belong to no sub-type."
          ]
        },
        {
          type: "quickCheck",
          question: "What is the primary key of a weak entity set's table?",
          options: ["Its partial key alone", "The owner's primary key alone", "Owner's primary key + its partial key", "A generated surrogate key only"],
          answer: 2,
          explanation: "A weak entity is identified by combining the owner's key with its own discriminator (partial key)."
        },
        {
          type: "takeaways",
          items: [
            "Weak entity = double rectangle, identifying relationship = double diamond, partial key = dashed underline.",
            "Specialization is top-down, generalization is bottom-up; aggregation lets a relationship take part in another relationship."
          ]
        }
      ]
    }
  },
  {
    id: "er-to-relational-mapping",
    slug: "er-to-relational-mapping",
    title: "Converting an ER Diagram to Tables",
    description: "The standard mapping rules, with a complete worked example and minimum-table questions.",
    estimatedMinutes: 25,
    content: {
      sections: [
        {
          type: "table",
          title: "Mapping Rules",
          headers: ["ER construct", "Becomes"],
          rows: [
            ["Strong entity", "A table; key attribute becomes the primary key"],
            ["Composite attribute", "Only its simple parts become columns (`first_name`, `last_name`)"],
            ["Multivalued attribute", "A new table: (owner key, value), PK = both"],
            ["Derived attribute", "Usually not stored"],
            ["Weak entity", "A table with PK = owner key + partial key, FK to owner"],
            ["1:1 relationship", "FK on either side, preferably the side with total participation (or merge the tables)"],
            ["1:N relationship", "FK on the N side"],
            ["M:N relationship", "A new junction table with both FKs as the composite PK, plus relationship attributes"],
            ["n-ary relationship", "A new table with FKs to all participating entities"],
            ["Specialization", "One table per sub-type referencing the super-type, or one table for all, or one per concrete sub-type"]
          ]
        },
        {
          type: "code",
          title: "Worked Example: A College Database",
          language: "sql",
          code: "-- Entities: Department, Professor, Student, Course\n-- Professor WORKS_IN Department (N:1)\n-- Course OFFERED_BY Department (N:1)\n-- Student ENROLLS_IN Course (M:N, attribute grade)\n\nCREATE TABLE department (\n  dept_id   INT PRIMARY KEY,\n  dept_name VARCHAR(50) NOT NULL UNIQUE\n);\n\nCREATE TABLE professor (\n  prof_id INT PRIMARY KEY,\n  name    VARCHAR(50) NOT NULL,\n  dept_id INT NOT NULL REFERENCES department(dept_id)  -- 1:N -> FK on N side\n);\n\nCREATE TABLE course (\n  course_id VARCHAR(10) PRIMARY KEY,\n  title     VARCHAR(100) NOT NULL,\n  dept_id   INT NOT NULL REFERENCES department(dept_id)\n);\n\nCREATE TABLE student (\n  roll_no INT PRIMARY KEY,\n  name    VARCHAR(50) NOT NULL\n);\n\nCREATE TABLE enrollment (                         -- M:N -> junction table\n  roll_no   INT         REFERENCES student(roll_no),\n  course_id VARCHAR(10) REFERENCES course(course_id),\n  grade     CHAR(2),\n  PRIMARY KEY (roll_no, course_id)\n);",
          explanation: "`NOT NULL` on the FK columns encodes total participation: every professor must belong to a department."
        },
        {
          type: "think",
          question: "Minimum number of tables: entities A and B, both strong, with a 1:N relationship R (no attributes on R). How many tables?",
          answerReveal: "2. Table A, and table B with A's key as a foreign key (the relationship is absorbed into the N side). For M:N the answer would be 3, because a junction table is required."
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "For a 1:1 relationship with total participation on one side, where should the foreign key go?",
              trap: "Putting it on the partial side, creating many NULLs.",
              solution: "Put it on the side with total participation. That column is then always filled, so it can be NOT NULL and UNIQUE (to keep the relationship 1:1)."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "Student and Course with an M:N ENROLLS relationship that has the attribute 'grade'. Minimum tables needed?",
          options: ["1", "2", "3", "4"],
          answer: 2,
          explanation: "Student, Course, and a junction table Enrollment(roll_no, course_id, grade)."
        },
        {
          type: "takeaways",
          items: [
            "1:N → FK on the N side. M:N → junction table. Multivalued attribute → separate table.",
            "Use NOT NULL on foreign keys to enforce total participation, and UNIQUE to enforce a 1:1 relationship.",
            "'Minimum number of tables' questions are common in GATE and placement tests."
          ]
        }
      ]
    }
  }
];

export const relationalModelLessons: CourseLesson[] = [
  {
    id: "relations-tuples-domains",
    slug: "relations-tuples-domains",
    title: "Relations, Tuples, Attributes and Domains",
    description: "The vocabulary of the relational model and the properties every relation has.",
    estimatedMinutes: 12,
    content: {
      sections: [
        {
          type: "table",
          title: "Relational Vocabulary",
          headers: ["Formal term", "Everyday term", "Example"],
          rows: [
            ["Relation", "Table", "`student`"],
            ["Tuple", "Row / record", "(101, 'Ravi', 'CSE')"],
            ["Attribute", "Column / field", "`name`"],
            ["Domain", "Set of allowed values for a column", "`branch` ∈ {CSE, ECE, ME}"],
            ["Degree (arity)", "Number of columns", "3"],
            ["Cardinality", "Number of rows", "Changes as data changes"],
            ["Relation schema", "Table definition", "STUDENT(roll_no, name, branch)"]
          ]
        },
        {
          type: "list",
          title: "Properties of a Relation",
          items: [
            "Each cell holds a single, **atomic** value (this is 1NF).",
            "No two tuples are identical (a relation is a **set**).",
            "Order of rows does not matter.",
            "Order of columns does not matter (columns are referenced by name).",
            "All values in a column come from the same domain."
          ]
        },
        {
          type: "warning",
          title: "Where SQL Differs from Pure Theory",
          items: [
            "SQL tables are multisets: duplicate rows are allowed unless you add a key or use `DISTINCT`.",
            "SQL allows `NULL`, which pure relational theory doesn't define, and NULL has its own three-valued logic.",
            "Without `ORDER BY`, SQL row order is not guaranteed, even if it looks stable."
          ]
        },
        {
          type: "quickCheck",
          question: "A table has 5 columns and 1000 rows. Its degree and cardinality are:",
          options: ["Degree 1000, cardinality 5", "Degree 5, cardinality 1000", "Both 5", "Both 1000"],
          answer: 1,
          explanation: "Degree counts attributes (columns); cardinality counts tuples (rows)."
        },
        {
          type: "takeaways",
          items: ["Relation = table, tuple = row, attribute = column, domain = allowed values.", "Degree = columns, cardinality = rows."]
        }
      ]
    }
  },
  {
    id: "keys-in-dbms",
    slug: "keys-in-dbms",
    title: "Keys: Super, Candidate, Primary, Alternate, Foreign",
    description: "Every type of key, how they relate, and how to count super keys.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "text",
          title: "Running Example",
          content: "STUDENT(roll_no, email, aadhaar, name, branch)\nroll_no, email and aadhaar are each unique for every student. name and branch are not."
        },
        {
          type: "table",
          title: "Key Types",
          headers: ["Key", "Definition", "Example from STUDENT"],
          rows: [
            ["Super key", "Any set of attributes that uniquely identifies a tuple", "{roll_no}, {roll_no, name}, {email, branch}, ..."],
            ["Candidate key", "A minimal super key: remove any attribute and it stops being unique", "{roll_no}, {email}, {aadhaar}"],
            ["Primary key", "The candidate key chosen to identify rows. Unique and NOT NULL", "{roll_no}"],
            ["Alternate key", "Candidate keys that were not chosen as primary", "{email}, {aadhaar}"],
            ["Composite key", "A key made of two or more attributes", "{roll_no, course_id} in ENROLLMENT"],
            ["Foreign key", "Attribute(s) that refer to the primary key (or a unique key) of another table", "`enrollment.roll_no` → `student.roll_no`"],
            ["Surrogate key", "Artificial key with no business meaning", "Auto-increment `id`, UUID"]
          ]
        },
        {
          type: "text",
          title: "Relationship Between Keys",
          content: "Every candidate key is a super key, but not every super key is a candidate key.\nThe primary key is one of the candidate keys.\nAlternate keys = candidate keys minus the primary key.\n\nPrimary key vs UNIQUE: a table has only one primary key and it can never be NULL. A table can have many UNIQUE constraints, and in most DBMSs a UNIQUE column may contain NULLs."
        },
        {
          type: "dryRun",
          title: "Counting Super Keys",
          iterations: [
            { step: 1, variables: { "R": "R(A, B, C, D)", "Candidate key": "{A}" }, description: "Any superset of {A} is a super key. A must be included; each of B, C, D can be in or out." },
            { step: 2, variables: { "Count": "2^3 = 8" }, description: "So there are 8 super keys when the only candidate key is a single attribute and there are 3 other attributes." },
            { step: 3, variables: { "Candidate keys": "{A}, {B}" }, description: "With two candidate keys, use inclusion-exclusion: |supersets of A| + |supersets of B| - |supersets of AB|." },
            { step: 4, variables: { "Count": "2^3 + 2^3 - 2^2 = 12" }, description: "8 + 8 - 4 = 12 super keys." }
          ]
        },
        {
          type: "interviewTraps",
          traps: [
            {
              question: "Can a primary key be NULL? Can a foreign key be NULL?",
              trap: "Saying no to both.",
              solution: "A primary key can never be NULL (entity integrity). A foreign key can be NULL unless declared NOT NULL; NULL means 'no related row', for example an employee not yet assigned to a department."
            },
            {
              question: "Should you use a natural key (email) or a surrogate key (auto id) as the primary key?",
              trap: "Saying natural keys are always better because they're meaningful.",
              solution: "Natural keys can change (people change emails) and are often long. Surrogate keys are stable and compact; keep the natural key as a UNIQUE alternate key. Mention the trade-off rather than one absolute answer."
            }
          ]
        },
        {
          type: "quickCheck",
          question: "R(A, B, C, D, E) has the single candidate key {A, B}. How many super keys does R have?",
          options: ["4", "8", "16", "32"],
          answer: 1,
          explanation: "A and B must both be present; each of C, D, E can be in or out: 2^3 = 8."
        },
        {
          type: "takeaways",
          items: [
            "Super key ⊇ candidate key; primary key is one chosen candidate key; the rest are alternate keys.",
            "Primary key: unique + NOT NULL, one per table. UNIQUE: many per table, NULLs usually allowed.",
            "Super-key counting: 2^(number of non-key attributes) for a single candidate key."
          ]
        }
      ]
    }
  },
  {
    id: "integrity-constraints",
    slug: "integrity-constraints",
    title: "Integrity Constraints and Referential Actions",
    description: "Domain, entity and referential integrity, and what ON DELETE CASCADE / SET NULL / RESTRICT do.",
    estimatedMinutes: 20,
    content: {
      sections: [
        {
          type: "table",
          title: "The Integrity Constraints",
          headers: ["Constraint", "Rule", "SQL"],
          rows: [
            ["Domain constraint", "Values must come from the attribute's domain", "Data types, `CHECK (marks BETWEEN 0 AND 100)`"],
            ["Key constraint", "Key values must be unique", "`PRIMARY KEY`, `UNIQUE`"],
            ["Entity integrity", "Primary key values can't be NULL", "Implied by `PRIMARY KEY`"],
            ["Referential integrity", "A foreign key must match an existing referenced key, or be NULL", "`FOREIGN KEY ... REFERENCES ...`"],
            ["NOT NULL", "Column must have a value", "`NOT NULL`"]
          ]
        },
        {
          type: "code",
          title: "Constraints in Practice",
          language: "sql",
          code: "CREATE TABLE employee (\n  emp_id  INT PRIMARY KEY,\n  email   VARCHAR(100) UNIQUE NOT NULL,\n  salary  DECIMAL(10,2) CHECK (salary > 0),\n  dept_id INT,\n  FOREIGN KEY (dept_id) REFERENCES department(dept_id)\n    ON DELETE SET NULL\n    ON UPDATE CASCADE\n);",
          explanation: "If a department is deleted, its employees stay but their `dept_id` becomes NULL. If a department's ID changes, the change is copied to its employees."
        },
        {
          type: "table",
          title: "Referential Actions (what happens to child rows)",
          headers: ["Action", "When the parent row is deleted/updated", "Use when"],
          rows: [
            ["`RESTRICT` / `NO ACTION`", "The parent change is rejected while children exist (default)", "Children must never be orphaned and must be handled explicitly"],
            ["`CASCADE`", "Children are deleted / updated too", "Children can't exist without the parent (order items of an order)"],
            ["`SET NULL`", "Child FK becomes NULL", "The relationship is optional (employee's department)"],
            ["`SET DEFAULT`", "Child FK becomes its default value", "There is a sensible fallback parent"]
          ]
        },
        {
          type: "think",
          question: "Which operations on which table can violate referential integrity for employee.dept_id → department.dept_id?",
          answerReveal: "On the child (employee): INSERT or UPDATE with a dept_id that doesn't exist in department. On the parent (department): DELETE or UPDATE of a dept_id that employees still reference. Inserting into the parent or deleting from the child can never violate it."
        },
        {
          type: "warning",
          title: "Common Mistakes",
          items: [
            "Using `ON DELETE CASCADE` everywhere. One accidental delete can wipe large parts of the database.",
            "Forgetting that MySQL's MyISAM engine ignores foreign keys entirely. Use InnoDB.",
            "Relying only on application code for integrity. Other apps, scripts and admins bypass it; the database should enforce it."
          ]
        },
        {
          type: "quickCheck",
          question: "Order items should disappear automatically when their order is deleted. Which action fits?",
          options: ["ON DELETE RESTRICT", "ON DELETE SET NULL", "ON DELETE CASCADE", "No foreign key"],
          answer: 2,
          explanation: "Order items have no meaning without their order, so cascading the delete is correct."
        },
        {
          type: "takeaways",
          items: [
            "Entity integrity: PK is never NULL. Referential integrity: FK matches a real parent key or is NULL.",
            "Child INSERT/UPDATE and parent DELETE/UPDATE are the operations that can break referential integrity.",
            "Choose CASCADE, SET NULL or RESTRICT based on whether the child can exist without its parent."
          ]
        }
      ]
    }
  }
];
