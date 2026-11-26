import type { VisualMap } from "./types";

const c = "sql";

export const sqlVisuals: VisualMap = {
  [`${c}/what-is-a-database`]: {
    plain:
      "A database is an organised, always-on filing cabinet that many people and programs can use at once without losing or mixing up papers. Your app asks questions in SQL, and the database finds the answer fast even among millions of rows.",
    diagram: `flowchart LR
  A["Mobile app"] --> D[("Database")]
  W["Website"] --> D
  R["Reports"] --> D
  D -->|"answers in rows"| A`,
    caption: "Many programs, one shared, organised store of data.",
  },
  [`${c}/relational-model-and-rdbms`]: {
    plain:
      "A relational database stores data in tables that point at each other. Instead of writing a department's name on every employee, each employee row just stores the department's id: one place to update, no contradictions.",
    diagram: `erDiagram
  DEPARTMENTS ||--o{ EMPLOYEES : "has"
  DEPARTMENTS {
    int id PK
    string name
  }
  EMPLOYEES {
    int id PK
    string name
    int salary
    int department_id FK
  }`,
    caption: "Each employee points to one department; a department has many employees.",
  },
  [`${c}/tables-rows-and-columns`]: {
    plain:
      "A table is a spreadsheet with strict rules. Columns are the fixed questions (name, salary), each with a type. Rows are the answers for one thing, one employee per row.",
    diagram: `flowchart TB
  T["employees table"] --> H["columns: id · name · salary · department_id"]
  T --> R1["row: 1 · Asha · 52000 · 2"]
  T --> R2["row: 2 · Ravi · 48000 · 1"]
  T --> R3["row: 3 · Meera · 61000 · 2"]`,
    caption: "Columns define the shape; each row is one record.",
  },
  [`${c}/keys-primary-foreign-candidate`]: {
    plain:
      "A primary key is a row's ID card: unique and never empty. A foreign key is a row writing down someone else's ID card number to say 'I belong to them'. The database refuses a foreign key that points at an ID that doesn't exist.",
    diagram: `flowchart LR
  E["employees<br/>id = 7 (PK)<br/>department_id = 2 (FK)"] -->|"references"| D["departments<br/>id = 2 (PK)<br/>name = Engineering"]`,
    caption: "The foreign key in employees must match a primary key in departments.",
  },
  [`${c}/null-values-and-three-valued-logic`]: {
    plain:
      "NULL means 'unknown', not zero and not empty. Is unknown equal to 5? Unknown. That's why WHERE bonus = NULL never matches anything: you must ask IS NULL. Comparisons with NULL give a third answer besides true and false.",
    diagram: `flowchart LR
  Q["bonus = NULL ?"] --> U["UNKNOWN<br/>row filtered out"]
  Q2["bonus IS NULL ?"] --> T["TRUE<br/>row kept"]`,
    caption: "Use IS NULL / IS NOT NULL, never = NULL.",
  },
  [`${c}/acid-properties-overview`]: {
    plain:
      "ACID is the promise a database makes about transactions, like a bank transfer. Atomic: all of it or none. Consistent: rules hold before and after. Isolated: two transfers don't trip over each other. Durable: once it says 'done', a power cut can't undo it.",
    diagram: `flowchart LR
  A["Atomicity<br/>all or nothing"] --- C["Consistency<br/>rules always hold"] --- I["Isolation<br/>no interference"] --- D["Durability<br/>survives crashes"]`,
    caption: "The four guarantees behind every reliable transaction.",
  },

  // ── SQL basics ──
  [`${c}/sql-command-categories`]: {
    plain:
      "SQL commands come in families. DDL builds the shelves (CREATE, ALTER, DROP). DML puts things on and takes them off (INSERT, UPDATE, DELETE). DQL asks questions (SELECT). DCL hands out keys (GRANT), and TCL saves or undoes work (COMMIT, ROLLBACK).",
    diagram: `flowchart TB
  S["SQL"] --> DDL["DDL<br/>CREATE · ALTER · DROP"]
  S --> DML["DML<br/>INSERT · UPDATE · DELETE"]
  S --> DQL["DQL<br/>SELECT"]
  S --> DCL["DCL<br/>GRANT · REVOKE"]
  S --> TCL["TCL<br/>COMMIT · ROLLBACK"]`,
    caption: "Five families of SQL commands.",
  },
  [`${c}/delete-vs-truncate-vs-drop`]: {
    plain:
      "DELETE removes chosen rows and can be undone in a transaction. TRUNCATE empties the whole table fast but keeps the table. DROP throws the table away entirely, structure and all.",
    diagram: `flowchart LR
  T["employees table"] --> D["DELETE … WHERE<br/>some rows gone<br/>table stays"]
  T --> Tr["TRUNCATE<br/>all rows gone<br/>table stays"]
  T --> Dr["DROP<br/>table itself gone"]`,
    caption: "From removing a few rows to removing the table.",
  },
  [`${c}/sql-query-execution-order`]: {
    plain:
      "You write SELECT first, but the database runs it almost last. It first picks the tables (FROM, JOIN), filters rows (WHERE), groups them (GROUP BY), filters groups (HAVING), and only then picks columns (SELECT), sorts (ORDER BY) and trims (LIMIT). This is why WHERE can't use a SELECT alias.",
    diagram: `flowchart LR
  F["1 FROM / JOIN"] --> W["2 WHERE"] --> G["3 GROUP BY"] --> H["4 HAVING"] --> S["5 SELECT"] --> O["6 ORDER BY"] --> L["7 LIMIT"]`,
    caption: "The logical order a query is evaluated in.",
  },

  // ── Filtering ──
  [`${c}/where-and-comparison-operators`]: {
    plain:
      "WHERE is a sieve: every row is tested against the condition, and only rows where it's true fall through to the result. WHERE salary > 50000 keeps the rows with high salaries and drops the rest.",
    diagram: `flowchart LR
  R["all rows"] --> W{"salary > 50000?"}
  W -->|"true"| K["kept"]
  W -->|"false / unknown"| X["dropped"]`,
    caption: "Each row passes or fails the WHERE condition.",
  },
  [`${c}/like-pattern-matching`]: {
    plain:
      "LIKE matches text against a pattern. % stands for 'any number of characters', _ for 'exactly one'. 'A%' finds names starting with A; '_a%' finds names whose second letter is a.",
    diagram: `flowchart LR
  P["name LIKE 'A%'"] --> Y1["Asha ✓"]
  P --> Y2["Arjun ✓"]
  P --> N1["Ravi ✗"]`,
    caption: "% matches any run of characters.",
  },

  // ── Grouping ──
  [`${c}/aggregate-functions`]: {
    plain:
      "Aggregate functions squash many rows into one number: COUNT counts them, SUM adds, AVG averages, MIN and MAX find the extremes. Like asking a class 'how many of you are there?' rather than reading out every name.",
    diagram: `flowchart LR
  R["52000 · 48000 · 61000"] --> C["COUNT = 3"]
  R --> S["SUM = 161000"]
  R --> A["AVG = 53666"]
  R --> M["MAX = 61000"]`,
    caption: "Many values in, one value out.",
  },
  [`${c}/group-by`]: {
    plain:
      "GROUP BY sorts rows into buckets by a column, then an aggregate runs inside each bucket. GROUP BY department_id with AVG(salary) gives one average per department, not one for the whole company.",
    diagram: `flowchart LR
  R["all employees"] --> B1["dept 1: 48000, 50000"]
  R --> B2["dept 2: 52000, 61000"]
  B1 --> A1["dept 1 → AVG 49000"]
  B2 --> A2["dept 2 → AVG 56500"]`,
    caption: "Rows go into buckets; each bucket becomes one result row.",
  },
  [`${c}/having-and-query-order`]: {
    plain:
      "WHERE filters rows before grouping; HAVING filters groups after. 'Departments whose average salary is above 55000' needs HAVING, because the average doesn't exist until the groups are made.",
    diagram: `flowchart LR
  R["rows"] -->|"WHERE<br/>filter rows"| G["groups"]
  G -->|"HAVING AVG(salary) > 55000<br/>filter groups"| O["result"]`,
    caption: "WHERE works on rows, HAVING on groups.",
  },

  // ── Joins ──
  [`${c}/inner-join-lesson`]: {
    plain:
      "An INNER JOIN glues two tables together wherever a row on the left has a matching row on the right, like matching students to the clubs they joined. Students in no club, and clubs with no students, are left out.",
    diagram: `flowchart LR
  subgraph employees
    e1["Asha · dept 2"]
    e2["Ravi · dept 1"]
    e3["Kiran · dept NULL"]
  end
  subgraph departments
    d1["1 · Sales"]
    d2["2 · Engineering"]
    d3["3 · HR"]
  end
  e1 --- d2
  e2 --- d1`,
    caption: "Only matched pairs appear: Kiran (no dept) and HR (no people) drop out.",
  },
  [`${c}/joins-lesson-2`]: {
    plain:
      "A LEFT JOIN keeps every row from the left table, matched or not. Where there's no match on the right, the right-hand columns are filled with NULL. Use it for questions like 'all employees, with their department if they have one'.",
    diagram: `flowchart LR
  e1["Asha"] --- d2["Engineering"]
  e2["Ravi"] --- d1["Sales"]
  e3["Kiran"] --- n["NULL"]`,
    caption: "Every left row appears; missing matches become NULL.",
  },
  [`${c}/joins-lesson-3`]: {
    plain:
      "A RIGHT JOIN is the mirror image: every row from the right table is kept. 'All departments, with their employees if any' shows HR with NULL employee columns. Most people rewrite it as a LEFT JOIN with the tables swapped.",
    diagram: `flowchart LR
  d1["Sales"] --- e2["Ravi"]
  d2["Engineering"] --- e1["Asha"]
  d3["HR"] --- n["NULL"]`,
    caption: "Every right row appears; missing matches become NULL.",
  },
  [`${c}/joins-lesson-4`]: {
    plain:
      "A FULL JOIN keeps everything from both sides: matched pairs, plus left rows with no match, plus right rows with no match. It's the union of a LEFT and a RIGHT join.",
    diagram: `flowchart LR
  e1["Asha"] --- d2["Engineering"]
  e2["Ravi"] --- d1["Sales"]
  e3["Kiran"] --- n1["NULL"]
  n2["NULL"] --- d3["HR"]`,
    caption: "Matches, plus the unmatched rows from both tables.",
  },
  [`${c}/joins-lesson-6`]: {
    plain:
      "A self join joins a table to itself, like matching each employee with their manager when managers are employees too. You give the table two nicknames (e and m) so you can tell the copies apart.",
    diagram: `flowchart LR
  E["e: Ravi · manager_id = 5"] -->|"e.manager_id = m.id"| M["m: Meera · id = 5"]`,
    caption: "Same table, two roles: employee and manager.",
  },

  // ── Subqueries, CTEs, windows ──
  [`${c}/correlated-subqueries`]: {
    plain:
      "A correlated subquery is a question asked once per row, using that row's values. 'Employees earning more than their own department's average' runs the inner average for each employee's department.",
    diagram: `flowchart TB
  O["outer row: Asha, dept 2"] --> I["inner: AVG(salary) WHERE dept = 2"]
  I --> C{"Asha's salary > that average?"}
  C -->|"yes"| K["keep Asha"]
  C -->|"no"| D["skip"]`,
    caption: "The inner query re-runs for every outer row.",
  },
  [`${c}/common-table-expressions`]: {
    plain:
      "A CTE (WITH ... AS) is a named scratchpad: you work out an intermediate table first, give it a name, then use it in the main query. It makes long queries read top to bottom like steps in a recipe.",
    diagram: `flowchart LR
  W["WITH dept_avg AS (…)"] --> M["main SELECT uses dept_avg"]
  M --> R["result"]`,
    caption: "Name a step, then build on it.",
  },
  [`${c}/window-functions-ranking`]: {
    plain:
      "A window function computes something across related rows without squashing them into one, like a teacher writing each student's rank next to their name while keeping everyone listed. PARTITION BY restarts the ranking for each group.",
    diagram: `flowchart TB
  P["PARTITION BY department<br/>ORDER BY salary DESC"] --> D1["Engineering: Meera 1 · Asha 2"]
  P --> D2["Sales: Ravi 1 · Kiran 2"]`,
    caption: "Ranks restart in each partition, and every row stays.",
  },
  [`${c}/indexes-and-views`]: {
    plain:
      "An index is the index at the back of a book: instead of reading every page to find 'B+ tree', you look it up and jump straight there. It makes reads fast but every insert or update must also update the index.",
    diagram: `flowchart LR
  Q["WHERE email = 'a@x.com'"] --> I["index on email<br/>(sorted tree)"]
  I -->|"points to"| R["row 48213"]
  Q -.->|"without index"| S["scan all rows"]`,
    caption: "An index jumps to matching rows instead of scanning the table.",
  },
  [`${c}/transactions-in-sql`]: {
    plain:
      "A transaction wraps several statements so they succeed or fail together. Move money: subtract from one account, add to the other, then COMMIT. If anything goes wrong in between, ROLLBACK puts both accounts back exactly as they were.",
    diagram: `stateDiagram-v2
  [*] --> Active: BEGIN
  Active --> Active: UPDATE / INSERT
  Active --> Committed: COMMIT
  Active --> RolledBack: ROLLBACK or error
  Committed --> [*]
  RolledBack --> [*]`,
    caption: "Either every change is committed, or none is.",
  },
};
