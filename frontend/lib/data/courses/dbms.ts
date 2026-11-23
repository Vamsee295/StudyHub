import { Course, CourseLesson, CourseModule } from './types';
import { withTheory } from './utils';
import { dbmsFoundationsTheory } from './dbms-theory-foundations';
import { dbmsDesignTheory } from './dbms-theory-design';
import { dbmsTransactionsTheory } from './dbms-theory-transactions';
import { dbmsStorageTheory } from './dbms-theory-storage';
import { dbmsArchitectureLessons, erModelingLessons, relationalModelLessons } from './dbms-content-foundations';
import { relationalAlgebraLessons, normalizationLessons } from './dbms-content-design';
import { transactionLessons, concurrencyControlLessons, recoveryLessons } from './dbms-content-transactions';
import { indexingLessons, nosqlScalingLessons } from './dbms-content-storage';

const dbmsTheory = { ...dbmsFoundationsTheory, ...dbmsDesignTheory, ...dbmsTransactionsTheory, ...dbmsStorageTheory };

const minutes = (lessons: CourseLesson[]) => lessons.reduce((sum, l) => sum + l.estimatedMinutes, 0);

function dbmsModule(
  id: string,
  slug: string,
  title: string,
  description: string,
  difficulty: CourseModule["difficulty"],
  lessons: CourseLesson[]
): CourseModule {
  const withNotes = withTheory(lessons, dbmsTheory);
  return { id, slug, title, description, difficulty, estimatedMinutes: minutes(withNotes), lessons: withNotes };
}

export const dbmsCourse: Course = {
  id: "course-dbms",
  slug: "dbms",
  title: "DBMS Internals",
  description: "How databases really work: ER design, keys, relational algebra, normalization, transactions and ACID, concurrency control, recovery, indexing with B+ trees, and how databases scale. Aligned with the GATE CS syllabus and placement interview questions.",
  category: "Core CS",
  icon: "Server",
  displayOrder: 5,
  modules: [
    dbmsModule("dbms-mod-1", "dbms-architecture", "DBMS Architecture",
      "Why a DBMS beats plain files, tier architectures, the three-schema architecture, data independence, and data models.",
      "Beginner", dbmsArchitectureLessons),
    dbmsModule("dbms-mod-2", "er-modeling", "ER Modeling",
      "Entities, attribute types, relationships, cardinality and participation, weak entities, EER, and mapping ER diagrams to tables.",
      "Beginner", erModelingLessons),
    dbmsModule("dbms-mod-3", "relational-model", "Relational Model",
      "Relations and domains, every type of key, and integrity constraints with referential actions.",
      "Beginner", relationalModelLessons),
    dbmsModule("dbms-mod-4", "relational-algebra", "Relational Algebra & Calculus",
      "Selection, projection, set operations, joins, division, and tuple / domain relational calculus.",
      "Intermediate", relationalAlgebraLessons),
    dbmsModule("dbms-mod-5", "normalization", "Normalization",
      "Anomalies, functional dependencies, closures and candidate keys, 1NF to BCNF, 4NF, lossless join and dependency preservation.",
      "Intermediate", normalizationLessons),
    dbmsModule("dbms-mod-6", "transactions", "Transactions & ACID",
      "Transaction states, the ACID properties, read phenomena and SQL isolation levels.",
      "Intermediate", transactionLessons),
    dbmsModule("dbms-mod-7", "concurrency-control", "Concurrency Control",
      "Serializability, recoverable schedules, locking and 2PL, deadlocks, timestamp ordering and MVCC.",
      "Advanced", concurrencyControlLessons),
    dbmsModule("dbms-mod-8", "recovery", "Recovery Systems",
      "Failure types, write-ahead logging, undo/redo recovery, checkpoints and ARIES.",
      "Advanced", recoveryLessons),
    dbmsModule("dbms-mod-9", "indexing", "Indexing & B+ Trees",
      "File organization, primary / clustered / secondary indexes, B and B+ trees, hashing, and index design.",
      "Advanced", indexingLessons),
    dbmsModule("dbms-mod-10", "nosql-and-scaling", "NoSQL, CAP & Scaling",
      "SQL vs NoSQL, the CAP theorem and BASE, replication, partitioning and sharding.",
      "Advanced", nosqlScalingLessons),
  ]
};
