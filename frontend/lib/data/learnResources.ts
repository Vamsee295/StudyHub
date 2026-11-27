// Free, well-known resources to go deeper on each course, and the beginner → pro path across courses.
// Every link was checked live (HTTP 200) on 2026-11-26. Prefer free, maintained, openly available material.

export interface FreeResource {
  title: string;
  url: string;
  kind: "Course" | "Book" | "Tool" | "GitHub" | "Practice" | "Guide";
  why: string;
}

export const COURSE_RESOURCES: Record<string, FreeResource[]> = {
  "programming-fundamentals": [
    { title: "CS50x: Introduction to Computer Science (Harvard)", url: "https://cs50.harvard.edu/x/", kind: "Course", why: "The best free first course in programming, from zero." },
    { title: "Java Programming MOOC (University of Helsinki)", url: "https://java-programming.mooc.fi/", kind: "Course", why: "Hundreds of small graded Java exercises, beginner friendly." },
    { title: "Think Java, 2nd edition", url: "https://greenteapress.com/wp/think-java-2e/", kind: "Book", why: "Free book that teaches Java and thinking like a programmer." },
    { title: "Learn Java (dev.java, by Oracle)", url: "https://dev.java/learn/", kind: "Guide", why: "Official, up-to-date Java tutorials." },
    { title: "Java developer roadmap", url: "https://roadmap.sh/java", kind: "Guide", why: "What to learn next after the basics, in order." },
  ],
  oop: [
    { title: "Oracle Java Tutorials: Object-Oriented Concepts", url: "https://docs.oracle.com/javase/tutorial/java/concepts/", kind: "Guide", why: "The official explanation of classes, inheritance and interfaces." },
    { title: "Refactoring.Guru: Design Patterns", url: "https://refactoring.guru/design-patterns", kind: "Guide", why: "Illustrated design patterns with Java examples." },
    { title: "java-design-patterns", url: "https://github.com/iluwatar/java-design-patterns", kind: "GitHub", why: "Runnable examples of 100+ patterns in Java." },
  ],
  sql: [
    { title: "SQLBolt", url: "https://sqlbolt.com/", kind: "Practice", why: "Interactive lessons, type queries in the browser." },
    { title: "SQLZoo", url: "https://sqlzoo.net/", kind: "Practice", why: "Classic graded SQL exercises." },
    { title: "CS50's Introduction to Databases with SQL", url: "https://cs50.harvard.edu/sql/", kind: "Course", why: "A full free course from design to optimisation." },
    { title: "Use The Index, Luke", url: "https://use-the-index-luke.com/", kind: "Book", why: "How indexes really work, for fast queries." },
    { title: "SQLite Tutorial", url: "https://www.sqlitetutorial.net/", kind: "Guide", why: "Matches the SQLite engine behind our SQL Lab." },
  ],
  dsa: [
    { title: "VisuAlgo", url: "https://visualgo.net/en", kind: "Tool", why: "Animations of sorting, trees, graphs and more." },
    { title: "Data Structure Visualizations (USFCA)", url: "https://www.cs.usfca.edu/~galles/visualization/Algorithms.html", kind: "Tool", why: "Step through inserts and searches on real structures." },
    { title: "MIT 6.006 Introduction to Algorithms", url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/", kind: "Course", why: "Full lectures and notes, free on MIT OpenCourseWare." },
    { title: "NeetCode roadmap", url: "https://neetcode.io/roadmap", kind: "Practice", why: "Interview problems grouped by pattern, in learning order." },
    { title: "TheAlgorithms/Java", url: "https://github.com/TheAlgorithms/Java", kind: "GitHub", why: "Readable Java implementations of hundreds of algorithms." },
    { title: "Coding Interview University", url: "https://github.com/jwasham/coding-interview-university", kind: "GitHub", why: "A complete study plan for software engineering interviews." },
  ],
  dbms: [
    { title: "CMU 15-445: Database Systems", url: "https://15445.courses.cs.cmu.edu/", kind: "Course", why: "How databases are built, lectures free on YouTube." },
    { title: "Database System Concepts (Silberschatz) resources", url: "https://www.db-book.com/", kind: "Book", why: "Slides and material for the standard DBMS textbook." },
    { title: "Use The Index, Luke", url: "https://use-the-index-luke.com/", kind: "Book", why: "B-tree indexes explained for developers." },
  ],
  os: [
    { title: "Operating Systems: Three Easy Pieces (OSTEP)", url: "https://pages.cs.wisc.edu/~remzi/OSTEP/", kind: "Book", why: "The most readable OS book, free chapter by chapter." },
    { title: "xv6: a simple Unix teaching OS (MIT)", url: "https://pdos.csail.mit.edu/6.828/2023/xv6.html", kind: "Course", why: "Read a real, small kernel's source once the theory clicks." },
  ],
  "computer-networks": [
    { title: "Kurose & Ross online lectures", url: "https://gaia.cs.umass.edu/kurose_ross/online_lectures.htm", kind: "Course", why: "Video lectures from the authors of the classic networking book." },
    { title: "Explained from First Principles: the Internet", url: "https://explained-from-first-principles.com/internet/", kind: "Guide", why: "A long, illustrated walk through how the internet works." },
    { title: "Beej's Guide to Network Programming", url: "https://beej.us/guide/bgnet/", kind: "Book", why: "Sockets in practice: see TCP and UDP from code." },
  ],
  "system-design": [
    { title: "The System Design Primer", url: "https://github.com/donnemartin/system-design-primer", kind: "GitHub", why: "The most popular free system design guide." },
    { title: "System Design 101 (ByteByteGo)", url: "https://github.com/ByteByteGoHq/system-design-101", kind: "GitHub", why: "Visual one-page explanations of common concepts." },
    { title: "System design roadmap", url: "https://roadmap.sh/system-design", kind: "Guide", why: "Every topic to cover, in a sensible order." },
  ],
  "quantitative-aptitude": [
    { title: "IndiaBix aptitude", url: "https://www.indiabix.com/", kind: "Practice", why: "Large bank of placement-style aptitude questions." },
    { title: "Khan Academy maths", url: "https://www.khanacademy.org/math", kind: "Course", why: "Rebuild any shaky maths basics, free and step by step." },
  ],
  "logical-reasoning": [{ title: "IndiaBix logical reasoning", url: "https://www.indiabix.com/", kind: "Practice", why: "Topic-wise reasoning questions with answers." }],
  "verbal-ability": [
    { title: "IndiaBix verbal ability", url: "https://www.indiabix.com/", kind: "Practice", why: "Grammar, vocabulary and comprehension practice." },
    { title: "Purdue OWL grammar", url: "https://owl.purdue.edu/owl/general_writing/grammar/index.html", kind: "Guide", why: "Clear, free explanations of every grammar rule tests check." },
  ],
  "data-interpretation": [{ title: "IndiaBix data interpretation", url: "https://www.indiabix.com/", kind: "Practice", why: "Table, bar, line and pie chart sets." }],
  pseudocode: [
    { title: "Python Tutor", url: "https://pythontutor.com/c.html", kind: "Practice", why: "Paste any C, Java or Python snippet and watch every variable change, line by line." },
    { title: "Harvard CS50", url: "https://cs50.harvard.edu/x/", kind: "Course", why: "Free intro course; weeks 1–3 build the exact tracing skills these tests check." },
  ],
  "placement-aptitude": [{ title: "Tech Interview Handbook", url: "https://www.techinterviewhandbook.org/", kind: "Guide", why: "Free guide to the whole interview process." }],
};

/** The order to learn in when starting from nothing, grouped into stages from beginner to pro. */
export const BEGINNER_PATH: { stage: string; goal: string; courses: string[] }[] = [
  { stage: "1 · Foundation", goal: "Write small programs with confidence.", courses: ["programming-fundamentals", "quantitative-aptitude"] },
  { stage: "2 · Core", goal: "Model problems with objects and data, and reason through tests.", courses: ["oop", "sql", "pseudocode", "logical-reasoning", "verbal-ability"] },
  { stage: "3 · Interview-ready", goal: "Solve problems the way interviews ask.", courses: ["dsa", "dbms", "os", "computer-networks"] },
  { stage: "4 · Pro", goal: "Design systems and ace the full process.", courses: ["system-design", "data-interpretation", "placement-aptitude"] },
];
