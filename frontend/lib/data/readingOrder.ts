// Reading-order lists: for each course, its modules in study order with free external resources
// placed where they help most. Every resource is free to read or watch; each has a "why" note.

export type ResourceFormat = "Book" | "Course" | "Video" | "Docs" | "Practice" | "Visualizer" | "Guide";
export interface ExternalResource { title: string; url: string; by: string; format: ResourceFormat; why: string }
export type ReadingStep = { module: string } | { resource: ExternalResource };
export interface ReadingOrder { course: string; intro: string; steps: ReadingStep[] }

const m = (module: string): ReadingStep => ({ module });
const r = (resource: ExternalResource): ReadingStep => ({ resource });

export const READING_ORDERS: ReadingOrder[] = [
  {
    course: "programming-fundamentals",
    intro: "Start here if you're new to programming. Work through each module, then use the free courses for extra practice in the same order.",
    steps: [
      m("programming-basics"),
      r({ title: "CS50x: Introduction to Computer Science", url: "https://cs50.harvard.edu/x/", by: "Harvard University", format: "Course", why: "The best-known free intro course. Watch the first two lectures alongside the basics for a second explanation of how programs run." }),
      m("variables-and-data-types"), m("operators"), m("input-and-output"),
      m("control-flow"),
      r({ title: "Java Programming MOOC", url: "https://java-programming.mooc.fi/", by: "University of Helsinki", format: "Course", why: "Hundreds of small graded Java exercises. Do parts 1 to 3 once control flow clicks; repetition is what makes loops automatic." }),
      m("arrays"), m("strings"), m("methods"),
      m("memory-and-execution"),
      r({ title: "The Java Tutorials: Language Basics", url: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/index.html", by: "Oracle", format: "Docs", why: "The official reference for every syntax rule covered so far. Look things up here rather than memorizing." }),
      m("problem-solving"),
    ],
  },
  {
    course: "oop",
    intro: "Take this after Programming Fundamentals. The design patterns guide at the end connects OOP to real interview design questions.",
    steps: [
      m("oop-fundamentals"),
      r({ title: "The Java Tutorials: Object-Oriented Programming Concepts", url: "https://docs.oracle.com/javase/tutorial/java/concepts/index.html", by: "Oracle", format: "Docs", why: "A short official overview of objects, classes, inheritance and interfaces to read before the deep dives." }),
      m("encapsulation"), m("constructors"), m("inheritance"), m("polymorphism"), m("abstraction"), m("advanced-oop"),
      m("solid-and-interview"),
      r({ title: "Refactoring.Guru: Design Patterns", url: "https://refactoring.guru/design-patterns", by: "Alexander Shvets", format: "Guide", why: "Clear illustrated explanations of Strategy, Factory, Observer and the rest, with Java examples. Read after SOLID." }),
    ],
  },
  {
    course: "dsa",
    intro: "The core of coding interviews. Learn each module, visualize it, then practise; the external resources go deeper on theory and proofs.",
    steps: [
      m("dsa-fundamentals"),
      r({ title: "Tech Interview Handbook: Study cheatsheets", url: "https://www.techinterviewhandbook.org/algorithms/study-cheatsheet/", by: "Yangshun Tay", format: "Guide", why: "One-page summaries of each topic's patterns and corner cases. Skim the relevant page before each module." }),
      m("arrays"), m("strings"), m("linked-list"), m("stack"), m("queue"),
      r({ title: "VisuAlgo", url: "https://visualgo.net/en", by: "National University of Singapore", format: "Visualizer", why: "Animations of sorting, linked lists, heaps, trees and graphs. Watch an algorithm run before you code it." }),
      m("hashing"), m("trees"), m("heaps"),
      r({ title: "Open Data Structures", url: "https://opendatastructures.org/", by: "Pat Morin", format: "Book", why: "A free textbook with full analysis of lists, hash tables, trees and heaps. Use it when you want the proofs behind the complexities." }),
      m("graphs"),
      r({ title: "cp-algorithms: Graph algorithms", url: "https://cp-algorithms.com/", by: "cp-algorithms contributors", format: "Guide", why: "Precise write-ups of Dijkstra, union-find, topological sort and more, with proofs and edge cases." }),
      m("recursion-and-backtracking"), m("dynamic-programming"),
      r({ title: "MIT 6.006 Introduction to Algorithms", url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/", by: "MIT OpenCourseWare", format: "Course", why: "Full university lectures and problem sets. Work through it after finishing the course to consolidate the theory." }),
      r({ title: "NeetCode roadmap", url: "https://neetcode.io/roadmap", by: "NeetCode", format: "Practice", why: "A problem list ordered by pattern, matching this course's sequence. Use it for extra practice once the patterns are familiar." }),
    ],
  },
  {
    course: "sql",
    intro: "Learn SQL by writing it. Run every example in the SQL Lab, and use the interactive sites for more drills.",
    steps: [
      m("database-basics"), m("sql-basics"),
      r({ title: "SQLBolt", url: "https://sqlbolt.com/", by: "SQLBolt", format: "Practice", why: "Short interactive lessons that run in the browser. Do them alongside the basics and filtering modules." }),
      m("filtering"), m("sql-functions"), m("grouping"), m("joins"), m("subqueries"),
      r({ title: "Select Star SQL", url: "https://selectstarsql.com/", by: "Zi Chong Kao", format: "Practice", why: "A free interactive book built on one real dataset. Good practice for joins, grouping and subqueries together." }),
      m("database-design"),
      r({ title: "Use The Index, Luke", url: "https://use-the-index-luke.com/", by: "Markus Winand", format: "Book", why: "Explains how indexes really work and why queries are slow. Read after the indexes and views lesson." }),
      m("advanced-sql"),
      r({ title: "PostgreSQL Tutorial: Window Functions", url: "https://www.postgresql.org/docs/current/tutorial-window.html", by: "PostgreSQL Global Development Group", format: "Docs", why: "The official introduction to window functions, short and precise. Read with the advanced SQL module." }),
      m("placement-sql"),
    ],
  },
  {
    course: "dbms",
    intro: "DBMS theory for GATE and interviews. Take SQL first if you can; the CMU lectures show how real database engines are built.",
    steps: [
      m("dbms-architecture"), m("er-modeling"), m("relational-model"), m("relational-algebra"),
      r({ title: "Database System Concepts: slides", url: "https://www.db-book.com/slides-dir/index.html", by: "Silberschatz, Korth and Sudarshan", format: "Guide", why: "Free official slides from the standard DBMS textbook. Useful as a second explanation of ER diagrams and relational algebra." }),
      m("normalization"), m("transactions"), m("concurrency-control"), m("recovery"),
      m("indexing"),
      r({ title: "CMU 15-445/645: Database Systems", url: "https://15445.courses.cs.cmu.edu/", by: "Carnegie Mellon University", format: "Course", why: "Free lectures on storage, B+ trees, concurrency control and recovery from the inside. Watch after the indexing module." }),
      m("nosql-and-scaling"),
    ],
  },
  {
    course: "os",
    intro: "Operating systems for GATE and interviews. OSTEP is free, readable and matches this course's order closely.",
    steps: [
      m("os-introduction"),
      r({ title: "Operating Systems: Three Easy Pieces (OSTEP)", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/", by: "Remzi and Andrea Arpaci-Dusseau", format: "Book", why: "The best free OS textbook. Read the matching chapter after each module: processes, scheduling, memory, concurrency, files." }),
      m("processes"), m("threads"), m("cpu-scheduling"), m("synchronization"), m("deadlocks"), m("memory-management"), m("virtual-memory"), m("file-systems"),
      r({ title: "MIT 6.1810: Operating System Engineering", url: "https://pdos.csail.mit.edu/6.1810/", by: "MIT", format: "Course", why: "Labs on the small xv6 teaching kernel. Optional, for anyone who wants to see system calls and page tables in real code." }),
    ],
  },
  {
    course: "computer-networks",
    intro: "Networking from cables to HTTPS. The free Systems Approach book is the main companion reading.",
    steps: [
      m("network-basics"),
      r({ title: "Computer Networks: A Systems Approach", url: "https://book.systemsapproach.org/", by: "Larry Peterson and Bruce Davie", format: "Book", why: "A free, openly licensed textbook. Read its chapter on each layer after the matching module." }),
      m("osi-model"), m("physical-data-link"), m("network-layer"), m("subnetting"), m("transport-layer"),
      r({ title: "Stanford CS144: Introduction to Computer Networking", url: "https://cs144.github.io/", by: "Stanford University", format: "Course", why: "Build parts of a TCP implementation yourself. Optional, for a hands-on understanding of the transport layer." }),
      m("application-layer"),
      r({ title: "High Performance Browser Networking", url: "https://hpbn.co/", by: "Ilya Grigorik", format: "Book", why: "How TCP, TLS, HTTP/2 and HTTP/3 affect real web performance. Read with the application layer and security modules." }),
      m("network-security"),
    ],
  },
  {
    course: "system-design",
    intro: "Take DSA, DBMS and Networks first if you can. Learn the building blocks, then work through the designs, then read how real companies run systems.",
    steps: [
      m("sd-foundations"),
      r({ title: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer", by: "Donne Martin", format: "Guide", why: "The most popular free system design resource, and the backbone of this course. Use it to review each building block." }),
      m("sd-networking"), m("sd-data"), m("sd-async-reliability"),
      r({ title: "Site Reliability Engineering", url: "https://sre.google/sre-book/table-of-contents/", by: "Google", format: "Book", why: "Free book on how Google runs production: SLOs, monitoring and handling overload. Read the chapters on SLOs and cascading failures." }),
      m("sd-walkthroughs"), m("sd-more-walkthroughs"),
      r({ title: "Amazon Builders' Library", url: "https://aws.amazon.com/builders-library/", by: "Amazon", format: "Guide", why: "Articles by Amazon engineers on timeouts, retries, caching and deployments. Great reading once the walkthroughs make sense." }),
    ],
  },
  {
    course: "quantitative-aptitude",
    intro: "Most service-company tests start here. Learn each method, then drill until it's fast.",
    steps: [
      m("number-fundamentals"), m("arithmetic"), m("time-based-problems"), m("algebra"), m("advanced-aptitude"),
      r({ title: "IndiaBix: Aptitude questions", url: "https://www.indiabix.com/aptitude/questions-and-answers/", by: "IndiaBix", format: "Practice", why: "Thousands of free practice questions grouped by topic. Use them for speed drills after each module." }),
    ],
  },
  {
    course: "logical-reasoning",
    intro: "Patterns first, then puzzles. Speed comes from recognizing the question type quickly.",
    steps: [
      m("patterns"), m("basic-reasoning"), m("advanced-reasoning"),
      r({ title: "IndiaBix: Logical reasoning", url: "https://www.indiabix.com/logical-reasoning/questions-and-answers/", by: "IndiaBix", format: "Practice", why: "Free practice sets for series, coding-decoding, blood relations and seating arrangements." }),
    ],
  },
  {
    course: "verbal-ability",
    intro: "Vocabulary and grammar build up over weeks. Read a little every day alongside the modules.",
    steps: [
      m("vocabulary"), m("grammar"), m("comprehension"),
      r({ title: "IndiaBix: Verbal ability", url: "https://www.indiabix.com/verbal-ability/questions-and-answers/", by: "IndiaBix", format: "Practice", why: "Free sets for synonyms, sentence correction and reading comprehension." }),
    ],
  },
  {
    course: "data-interpretation",
    intro: "Take Quantitative Aptitude's arithmetic module first; DI is mostly percentages and ratios applied quickly.",
    steps: [
      m("basic-di"), m("graphs"), m("advanced-di"),
      r({ title: "IndiaBix: Data interpretation", url: "https://www.indiabix.com/data-interpretation/questions-and-answers/", by: "IndiaBix", format: "Practice", why: "Free table, bar, line and pie chart sets for timed practice." }),
    ],
  },
  {
    course: "placement-aptitude",
    intro: "Take this last, after the quantitative, reasoning and verbal courses. It's about strategy under time pressure.",
    steps: [m("company-specific"), m("test-strategies")],
  },
];

export const readingOrderFor = (course: string) => READING_ORDERS.find((o) => o.course === course);
