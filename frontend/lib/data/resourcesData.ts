import {
  LibraryResource,
  ContinueReadingItem,
  ResourceCategoryItem,
  RecommendedResourceItem,
  SavedResourceRecord,
  RecentlyViewedRecord,
  ResourceDetailContent
} from "@/types";

export const resourceTelemetry = {
  saved: 12,
  recent: 8,
  completed: 34
};

export const filterCategories = [
  { name: "All", count: 245 },
  { name: "DSA", count: 84 },
  { name: "Java", count: 42 },
  { name: "SQL", count: 36 },
  { name: "Core CS", count: 28 },
  { name: "Aptitude", count: 18 },
  { name: "AI / ML", count: 12 },
  { name: "System Design", count: 15 },
  { name: "Interview", count: 22 },
  { name: "Career", count: 10 }
];

export const continueReadingList: ContinueReadingItem[] = [
  {
    id: "java-oop-cheat-sheet",
    title: "Java OOP Complete Engineering Notes",
    track: "Java · Unit 2",
    unitProgress: "Page 4 of 12",
    percentage: 33,
    timeEstimate: "Est. 12m remaining",
    typeBadge: "Cheat Sheet",
    href: "/resources/java-oop-cheat-sheet"
  },
  {
    id: "sql-window-functions",
    title: "SQL Window Functions Deep Dive",
    track: "SQL · Unit 4",
    unitProgress: "Page 8 of 10",
    percentage: 80,
    timeEstimate: "Est. 5m remaining",
    typeBadge: "Handbook",
    href: "/resources/sql-window-functions"
  },
  {
    id: "dsa-two-pointers",
    title: "Two Pointers Pattern Recognition",
    track: "DSA · Arrays",
    unitProgress: "Page 1 of 5",
    percentage: 20,
    timeEstimate: "Est. 25m remaining",
    typeBadge: "Study Guide",
    href: "/resources/dsa-two-pointers"
  }
];

export const libraryCategories: ResourceCategoryItem[] = [
  {
    id: "dsa",
    title: "DSA & Algorithms",
    description: "Pattern recognition, complexity analysis, and optimal data structures.",
    icon: "code_blocks",
    resourcesCount: 84,
    guidesCount: 12,
    colorScheme: "bg-blue-50 text-blue-700",
    filterKey: "DSA"
  },
  {
    id: "java",
    title: "Java & Modern Programming",
    description: "Core concepts, collections, concurrency, and JVM internals.",
    icon: "terminal",
    resourcesCount: 42,
    guidesCount: 8,
    colorScheme: "bg-orange-50 text-orange-700",
    filterKey: "Java"
  },
  {
    id: "sql",
    title: "SQL & Query Engineering",
    description: "Complex joins, window functions, and database normalization.",
    icon: "database",
    resourcesCount: 36,
    guidesCount: 5,
    colorScheme: "bg-emerald-50 text-emerald-700",
    filterKey: "SQL"
  },
  {
    id: "core-cs",
    title: "Core Computer Science",
    description: "Operating systems, computer networks, and DBMS architecture.",
    icon: "memory",
    resourcesCount: 28,
    guidesCount: 6,
    colorScheme: "bg-purple-50 text-purple-700",
    filterKey: "Core CS"
  },
  {
    id: "ai-ml",
    title: "AI & Applied ML",
    description: "Foundational machine learning, deep learning, and NLP basics.",
    icon: "psychology",
    resourcesCount: 12,
    guidesCount: 3,
    colorScheme: "bg-pink-50 text-pink-700",
    filterKey: "AI / ML"
  },
  {
    id: "aptitude",
    title: "Placement Aptitude & Verbal",
    description: "Quantitative aptitude, logical reasoning, and verbal ability.",
    icon: "calculate",
    resourcesCount: 18,
    guidesCount: 4,
    colorScheme: "bg-amber-50 text-amber-700",
    filterKey: "Aptitude"
  }
];

export const curatedPlacementResources: LibraryResource[] = [
  {
    id: "java-collections-handbook",
    title: "The Ultimate Java Collections Framework Handbook",
    category: "Java",
    track: "Java",
    difficulty: "Intermediate",
    readTime: "45 min read",
    rating: 4.9,
    reviewsCount: 1240,
    isVerified: true,
    author: "StudyHub Engine",
    description: "Deep dive into internal workings of HashMap, ConcurrentHashMap, ArrayList vs LinkedList, and tree-based collections.",
    tags: ["Java", "Collections", "Data Structures", "Interviews"],
    slug: "java-collections-handbook"
  },
  {
    id: "dsa-sliding-window",
    title: "Sliding Window Pattern: From Easy to Hard",
    category: "DSA",
    track: "DSA",
    difficulty: "Advanced",
    readTime: "1h 15m read",
    rating: 4.8,
    reviewsCount: 890,
    isVerified: true,
    author: "StudyHub Engine",
    description: "Master the sliding window technique. Fixed vs dynamic windows, optimized string manipulation, and classic interview problems.",
    tags: ["DSA", "Arrays", "Strings", "Algorithms"],
    slug: "dsa-sliding-window"
  },
  {
    id: "sql-window-functions",
    title: "SQL Window Functions Deep Dive",
    category: "SQL",
    track: "SQL",
    difficulty: "Intermediate",
    readTime: "55 min read",
    rating: 4.9,
    reviewsCount: 2100,
    isVerified: true,
    author: "StudyHub Engine",
    description: "Understanding ROW_NUMBER, RANK, DENSE_RANK, LEAD, LAG, and advanced analytical queries for product MNC interviews.",
    tags: ["SQL", "Analytics", "Database", "Queries"],
    slug: "sql-window-functions"
  },
  {
    id: "os-virtual-memory",
    title: "Operating Systems: Virtual Memory & Paging",
    category: "Core CS",
    track: "Core CS",
    difficulty: "Core SDE",
    readTime: "40 min read",
    rating: 4.7,
    reviewsCount: 560,
    isVerified: true,
    author: "StudyHub Engine",
    description: "TLB cache, page faults, page replacement algorithms (LRU, FIFO), and memory segmentation explained visually.",
    tags: ["OS", "Memory", "Architecture"],
    slug: "os-virtual-memory"
  },
  {
    id: "system-design-patterns",
    title: "System Design: Scalability Patterns Primer",
    category: "System Design",
    track: "System Design",
    difficulty: "Advanced",
    readTime: "1h 30m read",
    rating: 4.9,
    reviewsCount: 3400,
    isVerified: true,
    author: "StudyHub Engine",
    description: "Load balancing, consistent hashing, database sharding, CAP theorem, and designing rate limiters.",
    tags: ["System Design", "Architecture", "Scalability"],
    slug: "system-design-patterns"
  },
  {
    id: "cn-tcp-ip",
    title: "Computer Networks: The TCP/IP Stack Explained",
    category: "Core CS",
    track: "Core CS",
    difficulty: "Intermediate",
    readTime: "50 min read",
    rating: 4.8,
    reviewsCount: 920,
    isVerified: true,
    author: "StudyHub Engine",
    description: "From physical layer to application layer. Detailed breakdown of TCP 3-way handshake, congestion control, and UDP differences.",
    tags: ["Networks", "Protocols", "TCP/IP"],
    slug: "cn-tcp-ip"
  }
];

export const pathRecommendations: RecommendedResourceItem[] = [
  {
    id: "dsa-graphs-intro",
    title: "Introduction to Graph Algorithms",
    rationale: "Recommended because you are starting the Graphs module in your DSA roadmap next week.",
    badgeType: "Curriculum Alignment",
    description: "Understand graph representations (Adjacency List vs Matrix), BFS, and DFS traversals.",
    readTime: "35 min read",
    href: "/resources/dsa-graphs-intro"
  },
  {
    id: "java-multithreading",
    title: "Java Concurrency & Multithreading",
    rationale: "Recommended because you struggled with Concurrency in your last mock interview.",
    badgeType: "Diagnostic Remediation",
    description: "Thread lifecycle, synchronization, volatile keyword, and the Executor framework.",
    readTime: "1h 10m read",
    href: "/resources/java-multithreading"
  },
  {
    id: "dbms-normalization",
    title: "Database Normalization (1NF to BCNF)",
    rationale: "Recommended because you need to clear the Core CS milestone before your upcoming assessments.",
    badgeType: "Stage Milestone Target",
    description: "Anomalies, functional dependencies, and practical examples of normalizing database schemas.",
    readTime: "45 min read",
    href: "/resources/dbms-normalization"
  }
];

export const initialSavedResources: SavedResourceRecord[] = [
  {
    id: "java-oop-cheat-sheet",
    title: "Java OOP Complete Engineering Notes",
    topic: "Java",
    type: "Cheat Sheet",
    savedAt: "Oct 12, 2023",
    iconName: "terminal",
    href: "/resources/java-oop-cheat-sheet"
  },
  {
    id: "sql-window-functions",
    title: "SQL Window Functions Deep Dive",
    topic: "SQL",
    type: "Handbook",
    savedAt: "Oct 10, 2023",
    iconName: "database",
    href: "/resources/sql-window-functions"
  },
  {
    id: "dsa-two-pointers",
    title: "Two Pointers Pattern Recognition",
    topic: "DSA",
    type: "Study Guide",
    savedAt: "Oct 05, 2023",
    iconName: "code_blocks",
    href: "/resources/dsa-two-pointers"
  },
  {
    id: "system-design-patterns",
    title: "System Design: Scalability Patterns Primer",
    topic: "System Design",
    type: "Handbook",
    savedAt: "Sep 28, 2023",
    iconName: "architecture",
    href: "/resources/system-design-patterns"
  }
];

export const initialRecentResources: RecentlyViewedRecord[] = [
  {
    id: "java-collections-handbook",
    title: "The Ultimate Java Collections Framework Handbook",
    topic: "Java",
    type: "Handbook",
    viewedAt: "2 hours ago",
    href: "/resources/java-collections-handbook"
  },
  {
    id: "os-virtual-memory",
    title: "Operating Systems: Virtual Memory & Paging",
    topic: "Core CS",
    type: "Study Guide",
    viewedAt: "Yesterday",
    href: "/resources/os-virtual-memory"
  },
  {
    id: "dsa-sliding-window",
    title: "Sliding Window Pattern: From Easy to Hard",
    topic: "DSA",
    type: "Cheat Sheet",
    viewedAt: "3 days ago",
    href: "/resources/dsa-sliding-window"
  }
];

export const resourceDetailsMap: Record<string, ResourceDetailContent> = {
  "java-collections-handbook": {
    id: "java-collections-handbook",
    title: "The Ultimate Java Collections Framework Handbook",
    timeEstimate: "45 min read",
    difficulty: "Intermediate",
    topic: "Java",
    summary: "A comprehensive guide to understanding the internal workings, performance characteristics, and best use cases for Java's core collections.",
    keyTakeaways: [
      "ArrayList is backed by an array and resizes by 50% when full.",
      "HashMap uses an array of linked lists, converting to balanced trees when buckets get too large (Java 8+).",
      "ConcurrentHashMap provides thread safety with higher concurrency than synchronized wrappers."
    ],
    sections: [
      {
        heading: "List Interface: ArrayList vs LinkedList",
        content: "ArrayList is almost always preferred due to better cache locality. LinkedList is only beneficial for O(1) insertions/deletions at the ends if you already have the iterator node.",
        codeSnippet: `List<String> arrayList = new ArrayList<>(); // Default capacity: 10\nList<String> linkedList = new LinkedList<>();`,
        codeLanguage: "java"
      },
      {
        heading: "Map Interface: HashMap Internals",
        content: "HashMap computes a hash of the key and maps it to an index in an internal array. Collisions are handled using chaining. In Java 8, if a chain exceeds 8 elements (and capacity >= 64), it transforms into a Red-Black tree for O(log n) access."
      }
    ],
    interviewTraps: [
      "Failing to override hashCode() when overriding equals() for custom objects used as HashMap keys.",
      "Assuming LinkedList is faster for middle insertions without considering traversal time (O(n))."
    ],
    relatedResources: [
      { title: "Java OOP Complete Engineering Notes", href: "/resources/java-oop-cheat-sheet" },
      { title: "Java Concurrency & Multithreading", href: "/resources/java-multithreading" }
    ]
  }
};
