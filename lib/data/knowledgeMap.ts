import { KMapLink, KMapNode } from "@/types";

export const kmapNodes: KMapNode[] = [
  { id: "root", label: "PLACEMENT PREP", x: 460, y: 190, depth: 0 },
  { id: "prog", label: "PROGRAMMING", x: 180, y: 70, depth: 1 },
  { id: "dsa", label: "DSA", x: 180, y: 190, depth: 1 },
  { id: "core", label: "CORE CS", x: 180, y: 310, depth: 1 },
  { id: "proj", label: "PROJECTS", x: 460, y: 60, depth: 1 },
  { id: "resume", label: "RESUME", x: 740, y: 70, depth: 1 },
  { id: "interview", label: "INTERVIEW", x: 740, y: 190, depth: 1 },
  { id: "career", label: "CAREER", x: 740, y: 310, depth: 1 },
  { id: "java", label: "Java", x: 20, y: 20, depth: 2 },
  { id: "python", label: "Python", x: 20, y: 60, depth: 2 },
  { id: "cpp", label: "C++", x: 20, y: 100, depth: 2 },
  { id: "js", label: "JavaScript", x: 20, y: 140, depth: 2 },
  { id: "dbms", label: "DBMS", x: 20, y: 250, depth: 2 },
  { id: "os", label: "OS", x: 20, y: 290, depth: 2 },
  { id: "cn", label: "CN", x: 20, y: 330, depth: 2 },
  { id: "oop", label: "OOP", x: 20, y: 370, depth: 2 },
  { id: "tech", label: "Technical", x: 640, y: 250, depth: 2 },
  { id: "hr", label: "HR", x: 840, y: 250, depth: 2 },
];

export const kmapLinks: KMapLink[] = [
  ["root", "prog"], ["root", "dsa"], ["root", "core"], ["root", "proj"],
  ["root", "resume"], ["root", "interview"], ["root", "career"],
  ["prog", "java"], ["prog", "python"], ["prog", "cpp"], ["prog", "js"],
  ["core", "dbms"], ["core", "os"], ["core", "cn"], ["core", "oop"],
  ["interview", "tech"], ["interview", "hr"],
];

export function childrenOf(id: string): string[] {
  const byId = Object.fromEntries(kmapNodes.map((n) => [n.id, n]));
  return kmapLinks.filter(([a]) => a === id).map(([, b]) => byId[b]?.label ?? b);
}
