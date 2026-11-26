import type { VisualMap } from "./types";

const c = "dbms";

export const dbmsVisuals: VisualMap = {
  [`${c}/what-is-a-dbms`]: {
    plain:
      "A DBMS is the librarian between you and the shelves. You ask for 'all books by this author'; the librarian knows where everything is, stops two people writing on the same card at once, checks you're allowed in, and keeps a backup if the building floods.",
    diagram: `flowchart LR
  U["Users and apps"] -->|"SQL queries"| D["DBMS<br/>query processor · transactions<br/>security · recovery"]
  D --> F[("Data files on disk")]`,
    caption: "Programs never touch the files directly; the DBMS does it safely for them.",
  },
  [`${c}/dbms-tier-architecture`]: {
    plain:
      "In a 3-tier app, the browser shows things, an application server holds the business rules, and the database stores data. Users never talk to the database directly, which keeps it safe and lets each tier scale on its own.",
    diagram: `flowchart LR
  P["Presentation<br/>browser / app"] --> A["Application server<br/>business logic"] --> D[("Database server")]`,
    caption: "Three tiers: UI, logic, data.",
  },
  [`${c}/schemas-and-data-independence`]: {
    plain:
      "The three-schema architecture is like a building: the external view is what each tenant sees, the conceptual schema is the floor plan, and the internal schema is the plumbing and wiring. You can redo the plumbing without changing anyone's floor plan.",
    diagram: `flowchart TB
  E1["External view: students"] --> C["Conceptual schema<br/>all tables and relationships"]
  E2["External view: accounts"] --> C
  C --> I["Internal schema<br/>files, indexes, storage"]`,
    caption: "Changes at one level needn't disturb the level above.",
  },
  [`${c}/entities-and-attributes`]: {
    plain:
      "An entity is a thing you want to store facts about (a Student); attributes are those facts (roll number, name, phone numbers). The key attribute uniquely identifies each one, like a roll number.",
    diagram: `erDiagram
  STUDENT {
    int roll_no PK
    string name
    date dob
    string city
  }`,
    caption: "An entity with its attributes; roll_no is the key.",
  },
  [`${c}/relationships-and-cardinality`]: {
    plain:
      "Cardinality says how many of one thing relate to another. One department has many employees (1:N); a student takes many courses and a course has many students (M:N); a person has one passport (1:1).",
    diagram: `erDiagram
  DEPARTMENT ||--o{ EMPLOYEE : employs
  STUDENT }o--o{ COURSE : enrolls
  PERSON ||--|| PASSPORT : holds`,
    caption: "1:N, M:N and 1:1 relationships.",
  },
  [`${c}/weak-entities-and-extended-er`]: {
    plain:
      "A weak entity can't be identified on its own, like a seat number in a cinema: 'seat 12' only means something together with 'screen 3'. Its key is its partial key plus the key of the strong entity it depends on.",
    diagram: `erDiagram
  SCREEN ||--|{ SEAT : contains
  SCREEN {
    int screen_no PK
  }
  SEAT {
    int seat_no "partial key"
    int screen_no FK
  }`,
    caption: "A seat is identified by (screen_no, seat_no).",
  },
  [`${c}/er-to-relational-mapping`]: {
    plain:
      "Turning an ER diagram into tables follows simple rules: each entity becomes a table, a 1:N relationship becomes a foreign key on the 'many' side, and an M:N relationship becomes its own table holding both keys.",
    diagram: `flowchart LR
  S["STUDENT(roll_no)"] --> E["ENROLLMENT(roll_no, course_id)<br/>new table for M:N"]
  C["COURSE(course_id)"] --> E`,
    caption: "M:N becomes a junction table.",
  },
  [`${c}/keys-in-dbms`]: {
    plain:
      "A super key is any set of columns that can tell rows apart. A candidate key is a minimal one: remove any column and it stops working. The primary key is the candidate you choose; the others are alternate keys.",
    diagram: `flowchart TB
  SK["Super keys<br/>{roll}, {roll, name}, {email}, {email, phone}…"] --> CK["Candidate keys (minimal)<br/>{roll}, {email}"]
  CK --> PK["Primary key: roll"]
  CK --> AK["Alternate key: email"]`,
    caption: "Every candidate key is a super key, but not the other way round.",
  },
  [`${c}/basic-relational-algebra`]: {
    plain:
      "Relational algebra is the maths behind SQL. σ (select) keeps rows that match a condition, π (project) keeps chosen columns, ⋈ (join) combines tables. A query is a pipeline of these operations.",
    diagram: `flowchart LR
  T["EMPLOYEE"] -->|"σ salary > 50000"| R["matching rows"] -->|"π name"| O["names only"]`,
    caption: "π name (σ salary > 50000 (EMPLOYEE)).",
  },
  [`${c}/anomalies-and-redundancy`]: {
    plain:
      "Storing the same fact in many rows causes trouble. Change a department's phone number and you must change it in every employee row (update anomaly); delete the last employee and the department's info vanishes (delete anomaly). Normalization splits tables to fix this.",
    diagram: `flowchart LR
  B["One big table<br/>emp, dept, dept_phone (repeated)"] ==> E["EMPLOYEE(emp, dept_id)"]
  B ==> D["DEPARTMENT(dept_id, dept_phone)"]`,
    caption: "Each fact stored once, in one place.",
  },
  [`${c}/functional-dependencies`]: {
    plain:
      "A functional dependency X → Y means 'if you know X, you know Y'. Knowing a roll number tells you the student's name, so roll_no → name. Normal forms are rules about which dependencies a table may have.",
    diagram: `flowchart LR
  R["roll_no"] --> N["name"]
  R --> D["dept"]
  D --> H["dept_head"]`,
    caption: "roll_no → dept → dept_head is a transitive dependency (a 3NF problem).",
  },
  [`${c}/normal-forms-1nf-2nf-3nf`]: {
    plain:
      "Each normal form removes one kind of mess. 1NF: one value per cell. 2NF: no column depends on just part of a composite key. 3NF: no column depends on another non-key column. Higher forms mean less duplication.",
    diagram: `flowchart LR
  U["Unnormalized"] -->|"atomic values"| N1["1NF"]
  N1 -->|"remove partial dependencies"| N2["2NF"]
  N2 -->|"remove transitive dependencies"| N3["3NF"]
  N3 -->|"every determinant is a key"| BC["BCNF"]`,
    caption: "Each step removes one kind of redundancy.",
  },
  [`${c}/what-is-a-transaction`]: {
    plain:
      "A transaction is a group of database steps treated as one unit, like an ATM withdrawal: check balance, deduct money, dispense cash. It moves through states and ends either committed (everything saved) or aborted (everything undone).",
    diagram: `stateDiagram-v2
  [*] --> Active
  Active --> PartiallyCommitted: last statement done
  PartiallyCommitted --> Committed: changes made durable
  Active --> Failed: error
  PartiallyCommitted --> Failed: write fails
  Failed --> Aborted: rollback
  Committed --> [*]
  Aborted --> [*]`,
    caption: "The transaction state diagram.",
  },
  [`${c}/acid-properties`]: {
    plain:
      "ACID is a bank's promise for every transfer. Atomicity: the debit and credit both happen or neither does. Consistency: total money stays correct. Isolation: two transfers at once behave as if done one after another. Durability: after 'success', a crash can't undo it.",
    diagram: `flowchart TB
  T["Transfer ₹500 A → B"] --> A["Atomicity<br/>debit + credit together"]
  T --> C["Consistency<br/>A + B unchanged"]
  T --> I["Isolation<br/>no half-done reads"]
  T --> D["Durability<br/>logged before 'done'"]`,
    caption: "What each ACID property protects in a transfer.",
  },
  [`${c}/isolation-levels`]: {
    plain:
      "Isolation levels trade safety for speed. Read Uncommitted lets you see others' unsaved work (dirty reads). Read Committed stops that. Repeatable Read also keeps rows you read stable. Serializable acts as if transactions ran one at a time.",
    diagram: `flowchart LR
  RU["Read Uncommitted<br/>dirty reads possible"] --> RC["Read Committed<br/>no dirty reads"] --> RR["Repeatable Read<br/>no non-repeatable reads"] --> S["Serializable<br/>no phantoms"]`,
    caption: "Left to right: more isolation, less concurrency.",
  },
  [`${c}/schedules-and-serializability`]: {
    plain:
      "When transactions interleave, the order of their reads and writes is a schedule. It's serializable if the result is the same as running them one after another. A precedence graph checks this: no cycle means conflict-serializable.",
    diagram: `flowchart LR
  T1((T1)) -->|"W(A) before R(A)"| T2((T2))
  T2 -->|"W(B) before W(B)"| T3((T3))`,
    caption: "No cycle in the precedence graph, so the schedule is conflict-serializable.",
  },
  [`${c}/locking-and-2pl`]: {
    plain:
      "Two-phase locking: a transaction first only gathers locks (growing phase), and once it releases any lock it may only release (shrinking phase). Like collecting all the keys you need before starting, and never picking up a new key after handing one back.",
    diagram: `flowchart LR
  G["Growing phase<br/>acquire locks only"] --> L["Lock point"] --> S["Shrinking phase<br/>release locks only"]`,
    caption: "2PL guarantees conflict-serializable schedules.",
  },
  [`${c}/deadlocks-and-timestamps`]: {
    plain:
      "A deadlock is two people each holding a door the other needs, both waiting forever. In a wait-for graph, a cycle means deadlock; the DBMS breaks it by aborting one transaction.",
    diagram: `flowchart LR
  T1((T1)) -->|"waits for lock on B"| T2((T2))
  T2 -->|"waits for lock on A"| T1`,
    caption: "A cycle in the wait-for graph is a deadlock.",
  },
  [`${c}/undo-redo-checkpoints`]: {
    plain:
      "The database writes every change to a log before changing data. After a crash it replays the log: redo work from committed transactions that might not have reached disk, undo work from transactions that never committed. Checkpoints mean it only has to read the recent part of the log.",
    diagram: `flowchart LR
  CP["checkpoint"] --> T1["T1 commits → REDO"]
  CP --> T2["T2 still running at crash → UNDO"]
  T2 --> X["💥 crash"]`,
    caption: "After a crash: redo committed work, undo unfinished work.",
  },
  [`${c}/b-trees-and-b-plus-trees`]: {
    plain:
      "A B+ tree is a very wide, shallow tree. Internal nodes are signposts holding only keys; all the real records sit in the leaves, which are linked left to right. Finding any key takes just a few disk reads, and range scans walk along the leaves.",
    diagram: `flowchart TB
  R["[ 30 | 60 ]"] --> A["[ 10 | 20 ]"]
  R --> B["[ 40 | 50 ]"]
  R --> C["[ 70 | 80 ]"]
  A --> L1["leaf 10 20"]
  B --> L2["leaf 40 50"]
  C --> L3["leaf 70 80"]
  L1 -.-> L2 -.-> L3`,
    caption: "Signposts above, data in linked leaves below.",
  },
  [`${c}/sql-vs-nosql-and-cap`]: {
    plain:
      "CAP says that when the network splits, a distributed database must choose: keep answering (Availability) or keep every copy identical (Consistency). Partition tolerance isn't optional across machines, so real systems pick CP or AP for that moment.",
    diagram: `flowchart TB
  C["Consistency"] --- A["Availability"]
  A --- P["Partition tolerance"]
  P --- C
  CP["CP: e.g. HBase, MongoDB (default)"] -.-> C
  AP["AP: e.g. Cassandra, DynamoDB"] -.-> A`,
    caption: "During a partition you keep C or A, not both.",
  },
  [`${c}/replication-sharding-partitioning`]: {
    plain:
      "Replication makes copies of the same data on several servers (for safety and more reads). Sharding splits the data across servers, each holding a slice (for more storage and writes). Most big systems do both.",
    diagram: `flowchart TB
  subgraph Replication
    P[("Primary")] --> R1[("Replica 1")]
    P --> R2[("Replica 2")]
  end
  subgraph Sharding
    S1[("Shard A: users A–M")]
    S2[("Shard B: users N–Z")]
  end`,
    caption: "Copies of all the data versus slices of the data.",
  },
};
