export interface Resource {
  id: string;
  title: string;
  description: string;
  category: "DSA" | "Java" | "SQL" | "DBMS" | "Python" | "OOP" | "Web Dev" | "Other";
  type: "PDF";
  filename: string;
  fileUrl: string;
  tags: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  author?: string;
  pageCount?: number;
  readTimeEstimate?: string;
  featured?: boolean;
}

export const RESOURCE_CATALOG: Resource[] = [
  // --- DSA ---
  {
    id: "dsa-complete-handwritten-notes",
    title: "DSA Complete Handwritten Notes",
    description: "Comprehensive handwritten compilation spanning arrays, strings, linked lists, trees, graphs, and dynamic programming.",
    category: "DSA",
    type: "PDF",
    filename: "DSA Complete-Handwritten-Notes.pdf",
    fileUrl: "/api/materials/DSA Complete-Handwritten-Notes.pdf",
    tags: ["DSA", "Data Structures", "Algorithms", "Handwritten", "Interviews"],
    difficulty: "Intermediate",
    author: "StudyHub Placement Team",
    pageCount: 140,
    readTimeEstimate: "1h 30m read",
    featured: true
  },
  {
    id: "entire-dsa-master-guide",
    title: "Data Structures & Algorithms — Complete Placement Master",
    description: "Exhaustive reference handbook covering foundational concepts, pattern recognition, and optimal interview approaches.",
    category: "DSA",
    type: "PDF",
    filename: "Data Structures and Algorithms - (ENTIRE DSA).pdf",
    fileUrl: "/api/materials/Data Structures and Algorithms - (ENTIRE DSA).pdf",
    tags: ["DSA", "Master Guide", "Algorithms", "Problem Patterns"],
    difficulty: "Intermediate",
    author: "StudyHub Engineering",
    pageCount: 220,
    readTimeEstimate: "2h read",
    featured: true
  },
  {
    id: "dsa-python-kent-lee",
    title: "Data Structures and Algorithms in Python (Kent Lee)",
    description: "In-depth textbook on algorithmic implementation, asymptotic complexity analysis, and object-oriented data structures in Python.",
    category: "DSA",
    type: "PDF",
    filename: "DSA Python Kent Lee.pdf",
    fileUrl: "/api/materials/DSA Python Kent Lee.pdf",
    tags: ["Python", "DSA", "Algorithms", "Textbook"],
    difficulty: "Advanced",
    author: "Kent D. Lee",
    pageCount: 360,
    readTimeEstimate: "3h read",
    featured: false
  },
  {
    id: "recursion-backtracking-animated",
    title: "Recursion & Backtracking Visualized Notes",
    description: "Illustrated guide breaking down call stacks, recursion trees, decision branching, subset generation, and pruning strategies.",
    category: "DSA",
    type: "PDF",
    filename: "Recusrion & Backtracking Notes Animated.pdf",
    fileUrl: "/api/materials/Recusrion & Backtracking Notes Animated.pdf",
    tags: ["DSA", "Recursion", "Backtracking", "Visual Notes"],
    difficulty: "Advanced",
    author: "StudyHub Visual Learning",
    pageCount: 45,
    readTimeEstimate: "45m read",
    featured: false
  },
  {
    id: "stacks-queues-animated",
    title: "Stacks & Queues Visual Engineering Notes",
    description: "Visual breakdowns of LIFO/FIFO operations, monotonic stacks, circular queues, priority queues, and bracket validation problems.",
    category: "DSA",
    type: "PDF",
    filename: "Stacks & Queues Notes Animated.pdf",
    fileUrl: "/api/materials/Stacks & Queues Notes Animated.pdf",
    tags: ["DSA", "Stacks", "Queues", "Visual Notes"],
    difficulty: "Intermediate",
    author: "StudyHub Visual Learning",
    pageCount: 38,
    readTimeEstimate: "35m read",
    featured: false
  },

  // --- JAVA ---
  {
    id: "java-detailed-placement-notes",
    title: "Java Detailed Placement Master Notes",
    description: "Deep dive into core Java syntax, OOP architecture, JVM internals, garbage collection, memory model, and concurrency.",
    category: "Java",
    type: "PDF",
    filename: "java Detailed Notes.pdf",
    fileUrl: "/api/materials/java Detailed Notes.pdf",
    tags: ["Java", "Core Java", "JVM", "Placement Notes"],
    difficulty: "Intermediate",
    author: "StudyHub Java Track",
    pageCount: 110,
    readTimeEstimate: "1h 15m read",
    featured: true
  },
  {
    id: "java-handwritten-notes",
    title: "Java Handwritten Placement Notes",
    description: "Concise handwritten summary of Java fundamentals, collections framework, exception handling, and interview questions.",
    category: "Java",
    type: "PDF",
    filename: "Java Handwritten Notes.pdf",
    fileUrl: "/api/materials/Java Handwritten Notes.pdf",
    tags: ["Java", "Handwritten", "Collections", "Interviews"],
    difficulty: "Intermediate",
    author: "StudyHub Placement Team",
    pageCount: 65,
    readTimeEstimate: "50m read",
    featured: false
  },
  {
    id: "java-data-types-variables",
    title: "Data Types & Variables in Java",
    description: "Foundational breakdown of primitive data types, reference types, type casting, wrapper classes, and memory footprint.",
    category: "Java",
    type: "PDF",
    filename: "Data Types & Variables in Java.pdf",
    fileUrl: "/api/materials/Data Types & Variables in Java.pdf",
    tags: ["Java", "Variables", "Primitives", "Basics"],
    difficulty: "Beginner",
    author: "StudyHub Java Track",
    pageCount: 28,
    readTimeEstimate: "25m read",
    featured: false
  },
  {
    id: "java-inheritance-polymorphism",
    title: "Inheritance & Polymorphism in Java",
    description: "Detailed walkthrough of single, multilevel, hierarchical inheritance, method overriding vs overloading, and dynamic dispatch.",
    category: "Java",
    type: "PDF",
    filename: "Inheritance in Java.pdf",
    fileUrl: "/api/materials/Inheritance in Java.pdf",
    tags: ["Java", "OOP", "Inheritance", "Polymorphism"],
    difficulty: "Beginner",
    author: "StudyHub Java Track",
    pageCount: 32,
    readTimeEstimate: "30m read",
    featured: false
  },
  {
    id: "oop-concepts-in-java",
    title: "Object-Oriented Programming (OOP) in Java",
    description: "Master the 4 pillars of OOP — Encapsulation, Abstraction, Inheritance, Polymorphism — with real-world design examples.",
    category: "OOP",
    type: "PDF",
    filename: "OOP concepts in java .pdf",
    fileUrl: "/api/materials/OOP concepts in java .pdf",
    tags: ["OOP", "Java", "Abstraction", "Encapsulation", "Design"],
    difficulty: "Beginner",
    author: "StudyHub Java Track",
    pageCount: 42,
    readTimeEstimate: "40m read",
    featured: true
  },

  // --- SQL ---
  {
    id: "sql-handwritten-notes-70-pages",
    title: "SQL Comprehensive 70-Page Master Notes",
    description: "70 pages of complete SQL mastery: complex joins, nested subqueries, grouping, window functions, indexing, and transactions.",
    category: "SQL",
    type: "PDF",
    filename: "SQL Handwritten Notes 70 PAGES.pdf",
    fileUrl: "/api/materials/SQL Handwritten Notes 70 PAGES.pdf",
    tags: ["SQL", "Database", "Queries", "Joins", "Handwritten"],
    difficulty: "Intermediate",
    author: "StudyHub Database Track",
    pageCount: 70,
    readTimeEstimate: "1h 10m read",
    featured: true
  },
  {
    id: "sql-handwritten-notes",
    title: "SQL Handwritten Quick Notes",
    description: "Clean, concise handwritten notes covering standard SQL commands, DDL/DML, aggregate queries, and table constraints.",
    category: "SQL",
    type: "PDF",
    filename: "SQL Handwritten Notes.pdf",
    fileUrl: "/api/materials/SQL Handwritten Notes.pdf",
    tags: ["SQL", "Database", "Quick Notes", "Queries"],
    difficulty: "Beginner",
    author: "StudyHub Database Track",
    pageCount: 40,
    readTimeEstimate: "35m read",
    featured: false
  },
  {
    id: "sql-handwritten-notes-short",
    title: "SQL Fast-Track Revision Notes",
    description: "Compact cheat-sheet format designed for rapid interview brush-ups and last-minute syntax recall.",
    category: "SQL",
    type: "PDF",
    filename: "SQL_Handwritten_Notes short.pdf",
    fileUrl: "/api/materials/SQL_Handwritten_Notes short.pdf",
    tags: ["SQL", "Cheat Sheet", "Fast Track", "Revision"],
    difficulty: "Beginner",
    author: "StudyHub Database Track",
    pageCount: 15,
    readTimeEstimate: "15m read",
    featured: false
  },

  // --- DBMS & Core CS ---
  {
    id: "complete-dbms-handwritten-notes",
    title: "Complete DBMS Handwritten Notes",
    description: "Complete relational database theory: ER models, relational algebra, SQL mappings, functional dependencies, and normal forms.",
    category: "DBMS",
    type: "PDF",
    filename: "Complete DBMS Handwritten Notes...!.pdf",
    fileUrl: "/api/materials/Complete DBMS Handwritten Notes...!.pdf",
    tags: ["DBMS", "Database", "Core CS", "Normalization", "Handwritten"],
    difficulty: "Intermediate",
    author: "StudyHub Core CS Track",
    pageCount: 88,
    readTimeEstimate: "1h 20m read",
    featured: true
  },
  {
    id: "dbms-full-notes-interview-questions",
    title: "DBMS Full Notes & Interview Questions",
    description: "Core database concepts coupled with top placement interview questions, ACID properties, indexing tradeoffs, and concurrency.",
    category: "DBMS",
    type: "PDF",
    filename: "DBMS Full Notes along Interview Questions.pdf",
    fileUrl: "/api/materials/DBMS Full Notes along Interview Questions.pdf",
    tags: ["DBMS", "Interviews", "Questions", "ACID", "Transactions"],
    difficulty: "Intermediate",
    author: "StudyHub Core CS Track",
    pageCount: 55,
    readTimeEstimate: "50m read",
    featured: false
  },
  {
    id: "dbms-notes-gate-smasher",
    title: "DBMS Engineering Notes (Gate Smasher Edition)",
    description: "High-yield engineering exam and interview notes covering storage architecture, B/B+ trees, hashing, and recovery techniques.",
    category: "DBMS",
    type: "PDF",
    filename: "DBMS Notes by Gate Smasher.pdf",
    fileUrl: "/api/materials/DBMS Notes by Gate Smasher.pdf",
    tags: ["DBMS", "Gate Smasher", "Core CS", "Indexing", "B+ Trees"],
    difficulty: "Intermediate",
    author: "Gate Smashers / StudyHub Curation",
    pageCount: 120,
    readTimeEstimate: "1h 45m read",
    featured: false
  },

  // --- PYTHON ---
  {
    id: "python-core-notes",
    title: "Python Core Engineering Notes",
    description: "Comprehensive manual for Python: data structures, list comprehensions, lambda functions, OOP, decorators, and file I/O.",
    category: "Python",
    type: "PDF",
    filename: "PYTHON NOTES.pdf",
    fileUrl: "/api/materials/PYTHON NOTES.pdf",
    tags: ["Python", "Core", "Syntax", "Standard Library"],
    difficulty: "Beginner",
    author: "StudyHub Python Track",
    pageCount: 75,
    readTimeEstimate: "1h read",
    featured: false
  },
  {
    id: "python-handwritten-quick-notes",
    title: "Python Handwritten Quick Revision",
    description: "Compact handwritten formula and syntax sheets for fast revision before technical screening and coding rounds.",
    category: "Python",
    type: "PDF",
    filename: "Python-Hnadwritten-Notes.pdf",
    fileUrl: "/api/materials/Python-Hnadwritten-Notes.pdf",
    tags: ["Python", "Handwritten", "Quick Revision", "Syntax"],
    difficulty: "Beginner",
    author: "StudyHub Python Track",
    pageCount: 35,
    readTimeEstimate: "30m read",
    featured: false
  },

  // --- WEB DEV ---
  {
    id: "javascript-complete-handwritten-notes",
    title: "JavaScript Complete Handwritten Notes",
    description: "Deep dive into JS runtime, execution context, closures, event loop, promises, async/await, DOM, and modern ES6+ features.",
    category: "Web Dev",
    type: "PDF",
    filename: "Javascript complete Handwritten notes.pdf",
    fileUrl: "/api/materials/Javascript complete Handwritten notes.pdf",
    tags: ["JavaScript", "Web Dev", "ES6", "Async", "Frontend"],
    difficulty: "Intermediate",
    author: "StudyHub Web Dev Track",
    pageCount: 60,
    readTimeEstimate: "55m read",
    featured: false
  },
  {
    id: "javascript-core-notes",
    title: "JavaScript Core Reference Notes",
    description: "Essential JavaScript syntax, arrays, objects, functions, scope, prototypical inheritance, and browser APIs.",
    category: "Web Dev",
    type: "PDF",
    filename: "JavaScript - Notes.pdf",
    fileUrl: "/api/materials/JavaScript - Notes.pdf",
    tags: ["JavaScript", "Frontend", "Web Dev", "Syntax"],
    difficulty: "Beginner",
    author: "StudyHub Web Dev Track",
    pageCount: 45,
    readTimeEstimate: "40m read",
    featured: false
  },
  {
    id: "react-engineering-notes",
    title: "React Complete Architecture Notes",
    description: "Component lifecycle, state management, hooks (useState, useEffect, useMemo, useCallback), Context API, and performance optimization.",
    category: "Web Dev",
    type: "PDF",
    filename: "React Notes.pdf",
    fileUrl: "/api/materials/React Notes.pdf",
    tags: ["React", "Frontend", "Hooks", "Components", "Web Dev"],
    difficulty: "Intermediate",
    author: "StudyHub Web Dev Track",
    pageCount: 52,
    readTimeEstimate: "50m read",
    featured: true
  },
  {
    id: "html-handbook-notes",
    title: "HTML5 Semantic & Structure Notes",
    description: "Comprehensive guide to semantic HTML elements, accessibility (ARIA), forms, document structure, and modern web APIs.",
    category: "Web Dev",
    type: "PDF",
    filename: "HTML - Notes.pdf",
    fileUrl: "/api/materials/HTML - Notes.pdf",
    tags: ["HTML", "Web Dev", "Semantic HTML", "Accessibility"],
    difficulty: "Beginner",
    author: "StudyHub Web Dev Track",
    pageCount: 30,
    readTimeEstimate: "25m read",
    featured: false
  },
  {
    id: "css-mastery-notes",
    title: "CSS3 Styling & Layout Notes",
    description: "Modern CSS layout techniques: Flexbox, Grid, Box Model, positioning, responsive media queries, transitions, and animations.",
    category: "Web Dev",
    type: "PDF",
    filename: "CSS - Notes.pdf",
    fileUrl: "/api/materials/CSS - Notes.pdf",
    tags: ["CSS", "Web Dev", "Flexbox", "Grid", "Responsive"],
    difficulty: "Beginner",
    author: "StudyHub Web Dev Track",
    pageCount: 42,
    readTimeEstimate: "35m read",
    featured: false
  }
];

export const resourceService = {
  getAll(): Resource[] {
    return RESOURCE_CATALOG;
  },

  getById(id: string): Resource | undefined {
    return RESOURCE_CATALOG.find((r) => r.id === id || r.filename === id);
  },

  getByCategory(category: string): Resource[] {
    if (category === "All") return RESOURCE_CATALOG;
    return RESOURCE_CATALOG.filter((r) => r.category === category);
  },

  getCategoriesWithCounts(): { name: string; count: number }[] {
    const counts: Record<string, number> = {
      All: RESOURCE_CATALOG.length
    };

    for (const res of RESOURCE_CATALOG) {
      counts[res.category] = (counts[res.category] || 0) + 1;
    }

    const order = ["All", "DSA", "Java", "SQL", "DBMS", "Python", "OOP", "Web Dev"];
    return order
      .filter((cat) => counts[cat] !== undefined)
      .map((cat) => ({
        name: cat,
        count: counts[cat] || 0
      }));
  },

  searchAndFilter(params: {
    query?: string;
    category?: string;
    sortBy?: "Relevant" | "A-Z" | "Category" | "Difficulty";
  }): Resource[] {
    const { query = "", category = "All", sortBy = "Relevant" } = params;
    const cleanQuery = query.toLowerCase().trim();

    let list = RESOURCE_CATALOG.filter((item) => {
      const matchesCategory =
        category === "All" || item.category.toLowerCase() === category.toLowerCase();
      if (!matchesCategory) return false;

      if (!cleanQuery) return true;

      const titleMatch = item.title.toLowerCase().includes(cleanQuery);
      const descMatch = item.description.toLowerCase().includes(cleanQuery);
      const tagMatch = item.tags.some((t) => t.toLowerCase().includes(cleanQuery));
      const categoryMatch = item.category.toLowerCase().includes(cleanQuery);

      return titleMatch || descMatch || tagMatch || categoryMatch;
    });

    if (sortBy === "A-Z") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "Category") {
      list = [...list].sort((a, b) => a.category.localeCompare(b.category));
    } else if (sortBy === "Difficulty") {
      const difficultyOrder: Record<string, number> = { Beginner: 1, Intermediate: 2, Advanced: 3 };
      list = [...list].sort(
        (a, b) => (difficultyOrder[a.difficulty] || 0) - (difficultyOrder[b.difficulty] || 0)
      );
    }

    return list;
  }
};
