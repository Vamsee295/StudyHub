import { Course } from './types';
import { generateLessons } from './utils';

export const sqlCourse: Course = {
  id: "course-sql",
  slug: "sql",
  title: "SQL & Relational Databases",
  description: "From basic queries to complex joins and subqueries. Learn the standard language for relational database management systems.",
  category: "Technical",
  icon: "Database",
  displayOrder: 3,
  modules: [
    {
      id: "sql-mod-1",
      slug: "database-basics",
      title: "Database Basics",
      description: "Introduction to RDBMS, tables, and fundamental database concepts.",
      difficulty: "Beginner",
      estimatedMinutes: 120,
      lessons: generateLessons("database-basics", 8)
    },
    {
      id: "sql-mod-2",
      slug: "sql-basics",
      title: "SQL Basics",
      description: "Write your first SELECT, INSERT, UPDATE, and DELETE statements.",
      difficulty: "Beginner",
      estimatedMinutes: 105,
      lessons: generateLessons("sql-basics", 7)
    },
    {
      id: "sql-mod-3",
      slug: "filtering",
      title: "Filtering",
      description: "Filter data efficiently using WHERE, LIKE, IN, and BETWEEN.",
      difficulty: "Beginner",
      estimatedMinutes: 120,
      lessons: generateLessons("filtering", 8)
    },
    {
      id: "sql-mod-4",
      slug: "sql-functions",
      title: "SQL Functions",
      description: "Transform data with built-in string, math, and date functions.",
      difficulty: "Intermediate",
      estimatedMinutes: 120,
      lessons: generateLessons("sql-functions", 8)
    },
    {
      id: "sql-mod-5",
      slug: "grouping",
      title: "Grouping",
      description: "Aggregate data using GROUP BY and HAVING clauses.",
      difficulty: "Intermediate",
      estimatedMinutes: 45,
      lessons: generateLessons("grouping", 3)
    },
    {
      id: "sql-mod-6",
      slug: "joins",
      title: "Joins",
      description: "Combine data from multiple tables using INNER, LEFT, RIGHT, and FULL joins.",
      difficulty: "Intermediate",
      estimatedMinutes: 90,
      lessons: generateLessons("joins", 6)
    },
    {
      id: "sql-mod-7",
      slug: "subqueries",
      title: "Subqueries",
      description: "Write nested queries to solve complex data retrieval problems.",
      difficulty: "Advanced",
      estimatedMinutes: 60,
      lessons: generateLessons("subqueries", 4)
    },
    {
      id: "sql-mod-8",
      slug: "database-design",
      title: "Database Design",
      description: "Understand normalization, primary keys, and foreign keys.",
      difficulty: "Advanced",
      estimatedMinutes: 105,
      lessons: generateLessons("database-design", 7)
    },
    {
      id: "sql-mod-9",
      slug: "advanced-sql",
      title: "Advanced SQL",
      description: "Learn Window Functions, CTEs, and advanced analytical queries.",
      difficulty: "Advanced",
      estimatedMinutes: 105,
      lessons: generateLessons("advanced-sql", 7)
    },
    {
      id: "sql-mod-10",
      slug: "placement-sql",
      title: "Placement SQL",
      description: "Practice the most frequently asked SQL interview queries.",
      difficulty: "Advanced",
      estimatedMinutes: 135,
      lessons: generateLessons("placement-sql", 9)
    }
  ]
};
