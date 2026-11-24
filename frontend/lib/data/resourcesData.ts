import { ResourceCategoryItem } from "@/types";

/** Topic cards on /resources. Counts come from the live catalog, not from here. */
export const libraryCategories: ResourceCategoryItem[] = [
  {
    id: "dsa",
    title: "DSA & Algorithms",
    description: "Pattern recognition, complexity analysis, and optimal data structures.",
    icon: "code_blocks",
    filterKey: "DSA"
  },
  {
    id: "java",
    title: "Java & Modern Programming",
    description: "Core concepts, collections, concurrency, OOP, and JVM internals.",
    icon: "terminal",
    filterKey: "Java"
  },
  {
    id: "javascript",
    title: "JavaScript & Modern Web",
    description: "HTML5, CSS3, JavaScript core & advanced, and React architecture.",
    icon: "code_blocks",
    filterKey: "JavaScript"
  },
  {
    id: "network-protocols",
    title: "Network Protocols & Security",
    description: "OSI & TCP/IP stack, routing protocols, cryptography, and network security.",
    icon: "memory",
    filterKey: "Network Protocols"
  },
  {
    id: "dbms",
    title: "DBMS & Database Systems",
    description: "Relational database theory, storage, ACID, indexing, and recovery.",
    icon: "database",
    filterKey: "DBMS"
  },
  {
    id: "sql",
    title: "SQL & Query Engineering",
    description: "Complex joins, window functions, and database normalization.",
    icon: "database",
    filterKey: "SQL"
  },
  {
    id: "python",
    title: "Python Engineering",
    description: "Python data structures, object-oriented concepts, and fast revision notes.",
    icon: "calculate",
    filterKey: "Python"
  }
];
