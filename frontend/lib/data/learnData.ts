import { LearnSubject, LearnPath } from "@/types";

export const learnSubjects: LearnSubject[] = [
  {
    id: "subj-01",
    slug: "data-structures",
    title: "Data Structures",
    description: "Master arrays, linked lists, trees, and graphs for technical interviews.",
    category: "Core CS",
    progress: 35,
    totalModules: 12,
    completedModules: 4,
    modules: [
      { id: "mod-01", title: "Arrays & Strings", description: "Fundamentals of array manipulation and string algorithms.", type: "video", duration: "45m", completed: true },
      { id: "mod-02", title: "Linked Lists", description: "Singly and doubly linked lists, reversal techniques.", type: "reading", duration: "30m", completed: true },
      { id: "mod-03", title: "Stacks & Queues", description: "LIFO and FIFO data structures.", type: "exercise", duration: "60m", completed: true },
      { id: "mod-04", title: "Trees & BST", description: "Hierarchical data structures, traversals.", type: "video", duration: "1h 15m", completed: true },
      { id: "mod-05", title: "Graphs", description: "BFS, DFS, shortest path algorithms.", type: "video", duration: "2h", completed: false },
      { id: "mod-06", title: "Dynamic Programming", description: "Memoization and tabulation techniques.", type: "exercise", duration: "2h", completed: false }
    ]
  },
  {
    id: "subj-02",
    slug: "system-design",
    title: "System Design",
    description: "Learn to design scalable, distributed, and highly available systems.",
    category: "Technical",
    progress: 10,
    totalModules: 8,
    completedModules: 1,
    modules: [
      { id: "mod-01", title: "Introduction to Scalability", description: "Vertical vs Horizontal scaling, load balancers.", type: "reading", duration: "20m", completed: true },
      { id: "mod-02", title: "Database Sharding", description: "Partitioning data across multiple machines.", type: "video", duration: "40m", completed: false },
      { id: "mod-03", title: "Caching Strategies", description: "Memcached, Redis, LRU cache.", type: "reading", duration: "30m", completed: false },
    ]
  },
  {
    id: "subj-03",
    slug: "quantitative-aptitude",
    title: "Quantitative Aptitude",
    description: "Improve problem-solving speed for preliminary screening rounds.",
    category: "Aptitude",
    progress: 80,
    totalModules: 5,
    completedModules: 4,
    modules: [
      { id: "mod-01", title: "Number Systems", description: "LCM, HCF, remainders.", type: "video", duration: "30m", completed: true },
      { id: "mod-02", title: "Time & Work", description: "Efficiency and man-days concepts.", type: "exercise", duration: "45m", completed: true },
      { id: "mod-03", title: "Probability", description: "Permutations, combinations, probability distributions.", type: "reading", duration: "30m", completed: true },
      { id: "mod-04", title: "Data Interpretation", description: "Reading charts and graphs quickly.", type: "exercise", duration: "40m", completed: true },
      { id: "mod-05", title: "Speed, Distance, Time", description: "Trains, boats, streams.", type: "video", duration: "35m", completed: false }
    ]
  },
  {
    id: "subj-04",
    slug: "react-js",
    title: "React.js Framework",
    description: "Build modern web interfaces using React, Hooks, and Next.js.",
    category: "Technical",
    progress: 0,
    totalModules: 6,
    completedModules: 0,
    modules: [
      { id: "mod-01", title: "Components & Props", description: "Building blocks of React applications.", type: "video", duration: "40m", completed: false },
      { id: "mod-02", title: "State & Lifecycle", description: "Managing data within components.", type: "reading", duration: "25m", completed: false },
    ]
  },
  {
    id: "subj-05",
    slug: "dbms",
    title: "Database Management Systems (DBMS)",
    description: "Master database concepts from fundamentals to advanced topics including transactions, concurrency control, indexing, and distributed systems for technical interviews.",
    category: "Core CS",
    progress: 0,
    totalModules: 14,
    completedModules: 0,
    modules: [
      { id: "dbms-mod-01", title: "Database Fundamentals", description: "What is a Database? File System vs DBMS, DBMS Architecture, Database Users, Schema vs Instance, Data Models, Three-Schema Architecture, Data Independence.", type: "reading", duration: "60m", completed: false },
      { id: "dbms-mod-02", title: "Relational Model", description: "Relational Model, Tables, Rows & Columns, Tuples and Attributes, Domains, Cardinality, Degree, Relations, Relational Algebra Basics.", type: "video", duration: "45m", completed: false },
      { id: "dbms-mod-03", title: "Keys & Constraints", description: "Super Key, Candidate Key, Primary Key, Alternate Key, Foreign Key, Composite Key, UNIQUE, NOT NULL, CHECK, DEFAULT, Referential Integrity.", type: "reading", duration: "50m", completed: false },
      { id: "dbms-mod-04", title: "ER Model", description: "Entity, Attribute, Relationship, Entity Sets, Weak Entries, Strong Entities, Cardinality, Participation Constraints, ER Diagrams, ER to Relational Mapping.", type: "video", duration: "55m", completed: false },
      { id: "dbms-mod-05", title: "Functional Dependencies", description: "Functional Dependency, Trivial FD, Non-Trivial FD, Closure of Attributes, Armstrong's Axioms, Candidate Key from FD, Minimal Cover.", type: "reading", duration: "50m", completed: false },
      { id: "dbms-mod-06", title: "Normalization", description: "Database Anomalies, 1NF, 2NF, 3NF, BCNF, 4NF, 5NF, Lossless Decomposition, Dependency Preservation.", type: "video", duration: "65m", completed: false },
      { id: "dbms-mod-07", title: "Transactions", description: "Transaction, Transaction States, ACID Properties, Atomicity, Consistency, Isolation, Durability, COMMIT, ROLLBACK, SAVEPOINT.", type: "reading", duration: "40m", completed: false },
      { id: "dbms-mod-08", title: "Concurrency Control", description: "Concurrent Transactions, Lost Update, Dirty Read, Non-Repeatable Read, Phantom Read, Serial Schedule, Non-Serial Schedule, Conflict Serializability, View Serializability, Precedence Graph.", type: "video", duration: "60m", completed: false },
      { id: "dbms-mod-09", title: "Locking", description: "Shared Lock, Exclusive Lock, Lock Compatibility, Two-Phase Locking, Strict 2PL, Rigorous 2PL, Deadlocks, Deadlock Prevention, Deadlock Detection.", type: "reading", duration: "50m", completed: false },
      { id: "dbms-mod-10", title: "Isolation Levels", description: "Read Uncommitted, Read Committed, Repeatable Read, Serializable, Dirty Reads, Non-Repeatable Reads, Phantom Reads, MVCC.", type: "video", duration: "55m", completed: false },
      { id: "dbms-mod-11", title: "Storage & Indexing", description: "Database Storage, Pages, Blocks, Records, Heap Files, Indexes, Primary Index, Secondary Index, Clustered Index, Non-Clustered Index, Dense Index, Sparse Index, B-Tree, B+ Tree, Hash Index.", type: "reading", duration: "70m", completed: false },
      { id: "dbms-mod-12", title: "Query Processing", description: "Query Processing, Parsing, Validation, Query Optimization, Execution Plans, Full Table Scan, Index Scan, Join Algorithms, Cost-Based Optimization, EXPLAIN.", type: "video", duration: "65m", completed: false },
      { id: "dbms-mod-13", title: "Recovery", description: "Failure Types, Crash Recovery, Write-Ahead Logging, Log Records, Checkpoints, Undo, Redo, Undo/Redo, Shadow Paging.", type: "reading", duration: "60m", completed: false },
      { id: "dbms-mod-14", title: "Advanced DBMS", description: "Replication, Partitioning, Sharding, Distributed Databases, CAP Theorem, Consistency Models, Distributed Transactions, Two-Phase Commit.", type: "video", duration: "75m", completed: false }
    ]
  }
];

export const learnPaths: LearnPath[] = [
  {
    id: "path-01",
    title: "SDE Role Preparation",
    description: "The complete journey to becoming a Software Development Engineer at top tech companies.",
    subjects: ["data-structures", "system-design", "react-js"]
  },
  {
    id: "path-02",
    title: "Campus Placements",
    description: "Structured preparation for university placements, focusing on aptitude and core CS concepts.",
    subjects: ["quantitative-aptitude", "data-structures"]
  }
];

export const aptitudeLearningPaths: LearnPath[] = [
  {
    id: "apt-path-01",
    title: "General Placement Aptitude",
    description: "Structured preparation for campus placement aptitude screening tests.",
    subjects: ["quantitative-aptitude"]
  },
  {
    id: "apt-path-02",
    title: "Numerical Problem Solving",
    description: "Focus on arithmetic, percentages, speed-distance-time, and data interpretation.",
    subjects: ["quantitative-aptitude"]
  }
];

export const continueLearningSubjects = [
  "data-structures",
  "system-design"
];

export const recommendedSubjects = [
  "react-js"
];

export const recentlyViewedSubjects = [
  "quantitative-aptitude",
  "system-design"
];