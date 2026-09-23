import { Course } from './types';
import { generateLessons } from './utils';

export const dbmsCourse: Course = {
  id: "course-dbms",
  slug: "dbms",
  title: "DBMS Internals",
  description: "Go beyond SQL to understand how databases actually work under the hood. Covers ACID, transactions, and indexing.",
  category: "Core CS",
  icon: "Server",
  displayOrder: 5,
  modules: [
    {
      id: "dbms-mod-1",
      slug: "dbms-architecture",
      title: "DBMS Architecture",
      description: "Understanding 1-tier, 2-tier, and 3-tier architectures and database schemas.",
      difficulty: "Beginner",
      estimatedMinutes: 60,
      lessons: generateLessons("dbms-architecture", 4)
    },
    {
      id: "dbms-mod-2",
      slug: "er-modeling",
      title: "ER Modeling",
      description: "Entity-Relationship diagrams, entities, attributes, and cardinality.",
      difficulty: "Beginner",
      estimatedMinutes: 75,
      lessons: generateLessons("er-modeling", 5)
    },
    {
      id: "dbms-mod-3",
      slug: "relational-model",
      title: "Relational Model",
      description: "Relational constraints, keys (Primary, Foreign, Candidate, Super), and schemas.",
      difficulty: "Intermediate",
      estimatedMinutes: 60,
      lessons: generateLessons("relational-model", 4)
    },
    {
      id: "dbms-mod-4",
      slug: "relational-algebra",
      title: "Relational Algebra",
      description: "Selection, projection, Cartesian product, and set operations.",
      difficulty: "Intermediate",
      estimatedMinutes: 60,
      lessons: generateLessons("relational-algebra", 4)
    },
    {
      id: "dbms-mod-5",
      slug: "normalization",
      title: "Normalization",
      description: "Anomalies, Functional Dependencies, 1NF, 2NF, 3NF, and BCNF.",
      difficulty: "Intermediate",
      estimatedMinutes: 75,
      lessons: generateLessons("normalization", 5)
    },
    {
      id: "dbms-mod-6",
      slug: "transactions",
      title: "Transactions & ACID",
      description: "Understanding Atomicity, Consistency, Isolation, and Durability.",
      difficulty: "Advanced",
      estimatedMinutes: 60,
      lessons: generateLessons("transactions", 4)
    },
    {
      id: "dbms-mod-7",
      slug: "concurrency-control",
      title: "Concurrency Control",
      description: "Schedules, serializability, locks, and 2-Phase Locking (2PL).",
      difficulty: "Advanced",
      estimatedMinutes: 60,
      lessons: generateLessons("concurrency-control", 4)
    },
    {
      id: "dbms-mod-8",
      slug: "recovery",
      title: "Recovery Systems",
      description: "Write-Ahead Logging (WAL), undo/redo logs, and checkpoints.",
      difficulty: "Advanced",
      estimatedMinutes: 60,
      lessons: generateLessons("recovery", 4)
    },
    {
      id: "dbms-mod-9",
      slug: "indexing",
      title: "Indexing & B+ Trees",
      description: "How databases retrieve data quickly using Hash indices and B+ Trees.",
      difficulty: "Advanced",
      estimatedMinutes: 60,
      lessons: generateLessons("indexing", 4)
    }
  ]
};
