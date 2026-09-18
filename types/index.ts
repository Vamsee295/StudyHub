export interface LearningPath {
  slug: string;
  name: string;
  weeks: string;
  resourceCount: string;
  description: string;
  tags: string[];
  ctaLabel: string;
}

export interface RoadmapStage {
  id: string;
  title: string;
  phase: string;
  description: string;
  topics: string[];
  testedBy: string[];
  resourceHighlight: { title: string; detail: string };
  sampleQuestion: string;
}

export interface Resource {
  title: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  time: string;
  detail: string;
  description: string;
}

export interface Company {
  name: string;
  roleTag: string;
  segment: "Product MNC" | "High-Volume IT" | "FinTech & Consulting";
  description: string;
  focus: string[];
}

export interface PracticeCategory {
  name: string;
  questions: number;
  progress: number;
}

export interface Lab {
  name: string;
  description: string;
  icon: string;
}

export interface Concept {
  key: string;
  title: string;
  simple: string;
  analogy: string;
  interview: string;
  mistake: string;
  related: string[];
}

export interface Template {
  category: string;
  name: string;
  description: string;
  ctaLabel: string;
  isResume?: boolean;
}

export interface KMapNode {
  id: string;
  label: string;
  x: number;
  y: number;
  depth: 0 | 1 | 2;
}

export type KMapLink = [string, string];

export interface DashboardSkill {
  name: string;
  value: number;
}
