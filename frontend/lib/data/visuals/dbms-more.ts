import type { VisualMap } from "./types";

const c = "dbms";

export const dbmsMoreVisuals: VisualMap = {
  [`${c}/data-models-oltp-olap`]: {
    plain:
      "OLTP is the shop's billing counter: lots of small, fast transactions all day. OLAP is the manager's monthly report: few, huge queries that scan history to find trends. They're tuned so differently that companies usually keep separate systems.",
    diagram: `flowchart LR
  O["OLTP<br/>many small writes<br/>current data, normalised"] -->|"nightly ETL"| W[("Data warehouse")] --> A["OLAP<br/>big read-only scans<br/>history, aggregates"]`,
    caption: "Operational data flows into an analytical store.",
  },
  [`${c}/relations-tuples-domains`]: {
    plain:
      "In formal terms a table is a relation, each row is a tuple, each column is an attribute, and the set of allowed values for a column is its domain. Degree is the number of columns; cardinality is the number of rows.",
    diagram: `flowchart TB
  R["Relation STUDENT<br/>degree 3, cardinality 2"] --> H["attributes: roll · name · age"]
  R --> T1["tuple: 1 · Asha · 20"]
  R --> T2["tuple: 2 · Ravi · 21"]
  H --> D["domain of age: integers 16–60"]`,
    caption: "The vocabulary of the relational model.",
  },
  [`${c}/integrity-constraints`]: {
    plain:
      "Referential actions decide what happens to child rows when a parent row is deleted: CASCADE deletes them too, SET NULL clears their link, RESTRICT refuses the delete while children exist.",
    diagram: `flowchart TB
  D["DELETE department 2"] --> C["ON DELETE CASCADE<br/>its employees deleted"]
  D --> N["ON DELETE SET NULL<br/>employees.dept_id = NULL"]
  D --> R["ON DELETE RESTRICT<br/>delete refused"]`,
    caption: "Three ways to keep foreign keys valid.",
  },
  [`${c}/joins-and-division`]: {
    plain:
      "Division answers 'for all' questions, like 'students who took every course'. Think of it as: the students for whom no required course is missing from their list.",
    diagram: `flowchart LR
  E["ENROLLED(student, course)"] -->|"÷ COURSES(course)"| R["students enrolled in ALL courses"]`,
    caption: "Relational division for 'for all' queries.",
  },
  [`${c}/relational-calculus`]: {
    plain:
      "Relational algebra says how to get the answer (step by step); relational calculus only says what the answer must satisfy, like describing the result instead of the recipe. SQL is closer to calculus: you describe the rows you want.",
    diagram: `flowchart LR
  A["Algebra: procedural<br/>π name(σ salary>50000(EMP))"] --- C["Calculus: declarative<br/>{ t.name | t ∈ EMP ∧ t.salary > 50000 }"]`,
    caption: "How versus what.",
  },
  [`${c}/bcnf-and-decomposition`]: {
    plain:
      "When you split a table, the split must be lossless: joining the pieces back must give exactly the original rows, no extra fake ones. It's lossless if the common column is a key of at least one of the pieces.",
    diagram: `flowchart TB
  R["R(roll, course, teacher)"] --> A["R1(roll, teacher)"]
  R --> B["R2(teacher, course)<br/>teacher → course: teacher is a key here"]
  A --> J["R1 ⋈ R2 = R exactly"]
  B --> J`,
    caption: "A lossless BCNF decomposition.",
  },
  [`${c}/recoverable-schedules`]: {
    plain:
      "If T2 reads data T1 wrote and then T1 aborts, T2 used data that never really existed. A recoverable schedule makes T2 wait to commit until T1 commits; a cascadeless one doesn't let T2 read uncommitted data at all.",
    diagram: `sequenceDiagram
  participant T1
  participant T2
  T1->>T1: write A
  T2->>T2: read A (uncommitted)
  T1->>T1: abort
  Note over T2: T2 must abort too: cascading rollback`,
    caption: "Why reading uncommitted data causes cascading aborts.",
  },
  [`${c}/failures-and-logging`]: {
    plain:
      "Write-ahead logging means: write the note in the logbook before changing the data on disk. If the power fails halfway, the log says exactly what was in progress, so recovery can finish or undo it.",
    diagram: `flowchart LR
  U["UPDATE balance"] --> L["1 append log record<br/>(old value, new value)"] --> F["2 flush log to disk"] --> D["3 then write the data page"]`,
    caption: "Log first, data second.",
  },
  [`${c}/file-organization-and-indexes`]: {
    plain:
      "A primary (clustered) index matches the order the data is physically stored in, like a dictionary sorted by word. A secondary index is an extra lookup list in a different order, like an index of words by topic at the back.",
    diagram: `flowchart LR
  P["Primary index on roll<br/>data stored in roll order"] --> F[("Data file")]
  S["Secondary index on name<br/>separate sorted list → row pointers"] --> F`,
    caption: "One table, a clustered index and a secondary index.",
  },
  [`${c}/hashing-and-index-choice`]: {
    plain:
      "A hash index jumps straight to rows with an exact key, great for WHERE id = 42, but useless for ranges because hashing scatters neighbouring values. B+ trees keep keys in order, so they handle both equality and ranges.",
    diagram: `flowchart TB
  Q{"query type?"} -->|"exact match only"| H["Hash index · O(1)"]
  Q -->|"ranges, ORDER BY, prefixes"| B["B+ tree index · O(log n)"]`,
    caption: "Pick the index to match how you query.",
  },
};
