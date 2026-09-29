export interface ResourceBundleItem {
  id: string;
  unit: string;
  title: string;
  description: string;
  filename: string;
  fileUrl: string;
  pageCount: number;
  readTimeEstimate: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: "DSA" | "Java" | "JavaScript" | "Network Protocols" | "SQL" | "DBMS" | "Python" | "Core CS" | "OOP" | "Web Dev" | "Other" | (string & {});
  type: "PDF" | "PACK";
  isPack?: boolean;
  packItems?: ResourceBundleItem[];
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
  // Advance Algorithms and Data Structures Pack (Bundling all 4 Units)
  {
    id: "aads-pack",
    title: "Advance Algorithms & Data Structures Pack",
    description: "Complete 4-unit curriculum pack spanning algorithm analysis, balanced search trees, network flow & graph algorithms, and NP-completeness.",
    category: "DSA",
    type: "PACK",
    isPack: true,
    filename: "AADS_CO1.pdf",
    fileUrl: "/api/materials/AADS_CO1.pdf",
    tags: ["DSA", "AADS", "Algorithm Pack", "Complete Syllabus", "4 Units", "Advanced"],
    difficulty: "Advanced",
    author: "StudyHub Academic Faculty",
    pageCount: 1326,
    readTimeEstimate: "13h total study",
    featured: true,
    packItems: [
      {
        id: "aads-unit-1-co1",
        unit: "Unit 1 · CO1",
        title: "Advance Algorithms & Data Structures — Unit 1 (CO1)",
        description: "Algorithm analysis, asymptotic notations, divide-and-conquer paradigms, and complex data structures.",
        filename: "AADS_CO1.pdf",
        fileUrl: "/api/materials/AADS_CO1.pdf",
        pageCount: 343,
        readTimeEstimate: "3h 30m read",
        difficulty: "Advanced",
        tags: ["DSA", "AADS", "Algorithm Analysis", "Divide & Conquer", "Unit 1"]
      },
      {
        id: "aads-unit-2-co2",
        unit: "Unit 2 · CO2",
        title: "Advance Algorithms & Data Structures — Unit 2 (CO2)",
        description: "Balanced search trees, B-Trees, AVL Trees, Red-Black Trees, and spatial multidimensional data structures.",
        filename: "AADS_CO2.pdf",
        fileUrl: "/api/materials/AADS_CO2.pdf",
        pageCount: 332,
        readTimeEstimate: "3h 15m read",
        difficulty: "Advanced",
        tags: ["DSA", "AADS", "Balanced Trees", "B-Trees", "Red-Black Trees", "Unit 2"]
      },
      {
        id: "aads-unit-3-co3",
        unit: "Unit 3 · CO3",
        title: "Advance Algorithms & Data Structures — Unit 3 (CO3)",
        description: "Advanced graph theory, shortest path variations, maximum network flow algorithms, and dynamic programming.",
        filename: "AADS_CO-3.pdf",
        fileUrl: "/api/materials/AADS_CO-3.pdf",
        pageCount: 195,
        readTimeEstimate: "2h 30m read",
        difficulty: "Advanced",
        tags: ["DSA", "AADS", "Graph Algorithms", "Network Flow", "Dynamic Programming", "Unit 3"]
      },
      {
        id: "aads-unit-4-co4",
        unit: "Unit 4 · CO4",
        title: "Advance Algorithms & Data Structures — Unit 4 (CO4)",
        description: "NP-Completeness, polynomial reductions, Cook's theorem, approximation algorithms, and randomized computational techniques.",
        filename: "AADS_CO-4.pdf",
        fileUrl: "/api/materials/AADS_CO-4.pdf",
        pageCount: 456,
        readTimeEstimate: "4h read",
        difficulty: "Advanced",
        tags: ["DSA", "AADS", "NP-Completeness", "Approximation Algorithms", "Unit 4"]
      }
    ]
  },
  {
    id: "ds-notes-zeelan-basha",
    title: "Data Structures Placement Notes by Zeelan Basha Sir",
    description: "Classroom handwritten notes and problem walkthroughs by Zeelan Basha sir covering arrays, linked lists, stacks, queues, trees, and hashing.",
    category: "DSA",
    type: "PDF",
    filename: "DataStructures Notes by Zeelan Basha sir.pdf",
    fileUrl: "/api/materials/DataStructures Notes by Zeelan Basha sir.pdf",
    tags: ["DSA", "Zeelan Basha", "Placement Prep", "Data Structures", "Handwritten"],
    difficulty: "Intermediate",
    author: "Zeelan Basha Sir",
    pageCount: 164,
    readTimeEstimate: "2h read",
    featured: true
  },
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
    id: "java-interview-prep-guide",
    title: "Java Placement & Technical Interview Prep Handbook",
    description: "Targeted interview preparation handbook answering frequently asked Java conceptual questions, coding snippets, and architectural fundamentals.",
    category: "Java",
    type: "PDF",
    filename: "Java prep.pdf",
    fileUrl: "/api/materials/Java prep.pdf",
    tags: ["Java", "Interview Prep", "Core Java", "OOP", "Placement Guide"],
    difficulty: "Intermediate",
    author: "StudyHub Placement Team",
    pageCount: 61,
    readTimeEstimate: "50m read",
    featured: true
  },
  {
    id: "java-enterprise-jdbc-servlets-jsp",
    title: "Java Enterprise Backend: JDBC, Servlets & JSP",
    description: "Complete engineering guide to Java web development: JDBC database connectivity, HTTP Servlet lifecycle, request-response handling, and JSP templating.",
    category: "Java",
    type: "PDF",
    filename: "JDBC&Servlets&JSP.pdf",
    fileUrl: "/api/materials/JDBC&Servlets&JSP.pdf",
    tags: ["Java", "JDBC", "Servlets", "JSP", "Web Architecture", "Backend"],
    difficulty: "Intermediate",
    author: "StudyHub Backend Engineering",
    pageCount: 57,
    readTimeEstimate: "45m read",
    featured: false
  },
  {
    id: "multithreading-concurrency-java",
    title: "Multithreading & Concurrency in Java",
    description: "In-depth breakdown of Java threads, thread lifecycle, synchronization locks, deadlock prevention, volatile variables, and executor frameworks.",
    category: "Java",
    type: "PDF",
    filename: "Multithreading in Java.pdf",
    fileUrl: "/api/materials/Multithreading in Java.pdf",
    tags: ["Java", "Multithreading", "Concurrency", "Synchronization", "Threads"],
    difficulty: "Advanced",
    author: "StudyHub Engineering",
    pageCount: 39,
    readTimeEstimate: "35m read",
    featured: false
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
    category: "Java",
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
  {
    id: "recursion-backtracking-animated",
    title: "Recursion & Backtracking Visualized Notes",
    description: "Illustrated guide breaking down call stacks, recursion trees, decision branching, subset generation, and pruning strategies.",
    category: "Java",
    type: "PDF",
    filename: "Recusrion & Backtracking Notes Animated.pdf",
    fileUrl: "/api/materials/Recusrion & Backtracking Notes Animated.pdf",
    tags: ["Java", "DSA", "Recursion", "Backtracking", "Visual Notes"],
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
    category: "Java",
    type: "PDF",
    filename: "Stacks & Queues Notes Animated.pdf",
    fileUrl: "/api/materials/Stacks & Queues Notes Animated.pdf",
    tags: ["Java", "DSA", "Stacks", "Queues", "Visual Notes"],
    difficulty: "Intermediate",
    author: "StudyHub Visual Learning",
    pageCount: 38,
    readTimeEstimate: "35m read",
    featured: false
  },

  // --- JAVASCRIPT ---
  {
    id: "html-handbook-notes",
    title: "HTML5 Semantic & Structure Notes",
    description: "Comprehensive guide to semantic HTML elements, accessibility (ARIA), forms, document structure, and modern web APIs.",
    category: "JavaScript",
    type: "PDF",
    filename: "HTML - Notes.pdf",
    fileUrl: "/api/materials/HTML - Notes.pdf",
    tags: ["HTML", "HTML5", "JavaScript", "Frontend", "Web", "Semantic HTML", "Accessibility"],
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
    category: "JavaScript",
    type: "PDF",
    filename: "CSS - Notes.pdf",
    fileUrl: "/api/materials/CSS - Notes.pdf",
    tags: ["CSS", "CSS3", "JavaScript", "Flexbox", "Grid", "Responsive", "Frontend"],
    difficulty: "Beginner",
    author: "StudyHub Web Dev Track",
    pageCount: 42,
    readTimeEstimate: "35m read",
    featured: false
  },
  {
    id: "javascript-core-notes",
    title: "JavaScript Core Reference Notes",
    description: "Essential JavaScript syntax, arrays, objects, functions, scope, prototypical inheritance, and browser APIs.",
    category: "JavaScript",
    type: "PDF",
    filename: "JavaScript - Notes.pdf",
    fileUrl: "/api/materials/JavaScript - Notes.pdf",
    tags: ["JavaScript", "JS", "Frontend", "Web", "Syntax", "Core"],
    difficulty: "Beginner",
    author: "StudyHub Web Dev Track",
    pageCount: 45,
    readTimeEstimate: "40m read",
    featured: false
  },
  {
    id: "javascript-complete-handwritten-notes",
    title: "JavaScript Complete Handwritten Notes",
    description: "Deep dive into JS runtime, execution context, closures, event loop, promises, async/await, DOM, and modern ES6+ features.",
    category: "JavaScript",
    type: "PDF",
    filename: "Javascript complete Handwritten notes.pdf",
    fileUrl: "/api/materials/Javascript complete Handwritten notes.pdf",
    tags: ["JavaScript", "JS", "ES6", "Async", "Frontend", "Handwritten"],
    difficulty: "Intermediate",
    author: "StudyHub Web Dev Track",
    pageCount: 60,
    readTimeEstimate: "55m read",
    featured: false
  },
  {
    id: "react-engineering-notes",
    title: "React Complete Architecture Notes",
    description: "Component lifecycle, state management, hooks (useState, useEffect, useMemo, useCallback), Context API, and performance optimization.",
    category: "JavaScript",
    type: "PDF",
    filename: "React Notes.pdf",
    fileUrl: "/api/materials/React Notes.pdf",
    tags: ["React", "JavaScript", "Frontend", "Hooks", "Components"],
    difficulty: "Intermediate",
    author: "StudyHub Web Dev Track",
    pageCount: 52,
    readTimeEstimate: "50m read",
    featured: true
  },

  // --- NETWORK PROTOCOLS & SECURITY ---
  {
    id: "nps-network-protocols-co1-2",
    title: "Network Protocols & Security — Units 1 & 2 (CO1, CO2)",
    description: "Fundamental networking notes covering OSI vs TCP/IP layered architecture, packet framing, routing protocols, flow control, and transport layers.",
    category: "Network Protocols",
    type: "PDF",
    filename: "NPS Notes CO-1,2.pdf",
    fileUrl: "/api/materials/NPS Notes CO-1,2.pdf",
    tags: ["Network Protocols", "Networks", "Security", "OSI Model", "TCP/IP", "Protocols", "Core CS"],
    difficulty: "Intermediate",
    author: "StudyHub Systems Faculty",
    pageCount: 37,
    readTimeEstimate: "35m read",
    featured: true
  },
  {
    id: "nps-network-protocols-co3-4",
    title: "Network Protocols & Security — Units 3 & 4 (CO3, CO4)",
    description: "Security protocols and cryptography manual: symmetric and asymmetric encryption, public key infrastructure, hashing, SSL/TLS handshakes, and firewalls.",
    category: "Network Protocols",
    type: "PDF",
    filename: "NPS CO-3,4 NOTES.pdf",
    fileUrl: "/api/materials/NPS CO-3,4 NOTES.pdf",
    tags: ["Network Protocols", "Cryptography", "Network Security", "Firewalls", "SSL/TLS", "Ciphers", "Core CS"],
    difficulty: "Advanced",
    author: "StudyHub Security Faculty",
    pageCount: 34,
    readTimeEstimate: "30m read",
    featured: false
  },

  // --- DBMS ---
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
  }
];

// Active dynamic catalog in memory, seeded with curated RESOURCE_CATALOG
let activeCatalog: Resource[] = [...RESOURCE_CATALOG];

export const resourceService = {
  /**
   * Set or update dynamic catalog from API or scanner
   */
  setDynamicCatalog(items: Resource[]): void {
    if (!items || items.length === 0) return;
    const map = new Map<string, Resource>();
    for (const r of items) {
      map.set(r.id, r);
    }
    // Always preserve our curated RESOURCE_CATALOG definitions (such as packs)
    for (const r of RESOURCE_CATALOG) {
      map.set(r.id, r);
    }
    activeCatalog = Array.from(map.values());
  },

  getAll(): Resource[] {
    return activeCatalog;
  },

  getById(id: string): Resource | undefined {
    const cleanId = id.toLowerCase().trim();
    // 1. Direct top-level match
    const direct = activeCatalog.find(
      (r) =>
        r.id.toLowerCase() === cleanId ||
        r.filename.toLowerCase() === cleanId ||
        encodeURIComponent(r.filename).toLowerCase() === cleanId
    );
    if (direct) return direct;

    // 2. Search inside packs (e.g. searching for aads-unit-1-co1 or AADS_CO1.pdf)
    for (const res of activeCatalog) {
      if (res.packItems && res.packItems.length > 0) {
        const item = res.packItems.find(
          (p) =>
            p.id.toLowerCase() === cleanId ||
            p.filename.toLowerCase() === cleanId ||
            encodeURIComponent(p.filename).toLowerCase() === cleanId
        );
        if (item) {
          return {
            id: item.id,
            title: item.title,
            description: item.description,
            category: res.category,
            type: "PDF",
            filename: item.filename,
            fileUrl: item.fileUrl,
            tags: item.tags || res.tags,
            difficulty: item.difficulty || res.difficulty,
            author: res.author,
            pageCount: item.pageCount,
            readTimeEstimate: item.readTimeEstimate,
            featured: res.featured
          };
        }
      }
    }

    return undefined;
  },

  getByCategory(category: string): Resource[] {
    if (category === "All") return activeCatalog;
    return activeCatalog.filter(
      (r) => r.category.toLowerCase() === category.toLowerCase()
    );
  },

  getCategoriesWithCounts(): { name: string; count: number }[] {
    const counts: Record<string, number> = {
      All: activeCatalog.length
    };

    for (const res of activeCatalog) {
      counts[res.category] = (counts[res.category] || 0) + 1;
    }

    const preferredOrder = [
      "All", 
      "DSA", 
      "Java", 
      "JavaScript", 
      "Network Protocols", 
      "DBMS", 
      "SQL", 
      "Python"
    ];
    const dynamicKeys = Object.keys(counts).filter(
      (cat) => cat !== "All" && !preferredOrder.includes(cat)
    );

    const orderedKeys = [
      ...preferredOrder.filter((cat) => counts[cat] !== undefined),
      ...dynamicKeys.sort()
    ];

    return orderedKeys.map((cat) => ({
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

    let list = activeCatalog.filter((item) => {
      const matchesCategory =
        category === "All" || item.category.toLowerCase() === category.toLowerCase();
      if (!matchesCategory) return false;

      if (!cleanQuery) return true;

      const titleMatch = item.title.toLowerCase().includes(cleanQuery);
      const descMatch = item.description.toLowerCase().includes(cleanQuery);
      const tagMatch = item.tags.some((t) => t.toLowerCase().includes(cleanQuery));
      const categoryMatch = item.category.toLowerCase().includes(cleanQuery);
      const filenameMatch = item.filename.toLowerCase().includes(cleanQuery);
      const packMatch = item.packItems?.some(
        (p) =>
          p.title.toLowerCase().includes(cleanQuery) ||
          p.description.toLowerCase().includes(cleanQuery) ||
          p.filename.toLowerCase().includes(cleanQuery) ||
          p.tags?.some((t) => t.toLowerCase().includes(cleanQuery))
      );

      return titleMatch || descMatch || tagMatch || categoryMatch || filenameMatch || Boolean(packMatch);
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
