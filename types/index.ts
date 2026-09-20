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

export interface LearnModule {
  id: string;
  title: string;
  description: string;
  type: "video" | "reading" | "exercise";
  duration: string;
  completed: boolean;
}

export interface LearnSubject {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: "Technical" | "Placement" | "Core CS" | "Aptitude";
  progress: number;
  totalModules: number;
  completedModules: number;
  modules: LearnModule[];
}

export interface LearnPath {
  id: string;
  title: string;
  description: string;
  subjects: string[]; // array of subject slugs
}

export interface QuickPracticeSprint {
  id: string;
  tag: string;
  title: string;
  questionsCount: number;
  estimatedMinutes: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Core SDE";
  topics: string[];
  avgTime: string;
  targetAccuracy: string;
  engineNote: string;
  track: "dsa" | "sql" | "java" | "cs" | "aptitude";
}

export interface RecommendedDiagnostic {
  id: string;
  badge: string;
  accentColor: "red" | "blue" | "slate";
  title: string;
  description: string;
  metricLabel: string;
  metricValueText: string;
  metricPercent: number;
  questionCount: number;
  estimatedMinutes: number;
  difficulty: string;
  ctaText: string;
  track: "dsa" | "sql" | "java" | "cs" | "aptitude";
}

export interface PracticeCurriculumBank {
  id: string;
  bankCode: string;
  title: string;
  problemCount: number;
  categoriesCount: number;
  iconName: string;
  topics: string[];
  track: "dsa" | "sql" | "java" | "cs" | "aptitude";
}

export interface PlacementSimulation {
  id: string;
  companyTag: string;
  cycleBadge: string;
  title: string;
  description: string;
  questionsCount: number;
  timeMinutes: number;
  difficulty: "Intermediate" | "Medium-Hard" | "Hard" | "Mixed Difficulty";
  components?: { name: string; detail: string }[];
  isFeaturedSpan?: boolean;
}

export interface PracticeAttemptLedger {
  id: string;
  title: string;
  sessionType: string;
  totalQuestions: number;
  correctQuestions: number;
  accuracyPercent: number;
  timeElapsed: string;
  completedAt: string;
  track: "dsa" | "sql" | "java" | "cs" | "aptitude";
}

// ----------------------------------------------------
// COMPANIES & RECRUITER INTELLIGENCE MODULE TYPES
// ----------------------------------------------------

export interface CompanyTarget {
  id: string;
  name: string;
  monogram: string;
  segment: "Product MNC" | "High-Volume IT" | "FinTech & Consulting" | "High-Growth Startup" | "Mass Hiring / NQT";
  tier: string;
  roles: string[];
  readiness: number;
  recruiterHighlight: { title: string; detail: string };
}

export interface HiringStage {
  stageNumber: number;
  title: string;
  status: "Cleared" | "In-Flight" | "Scheduled" | "Upcoming" | "Final Bar";
  description: string;
  duration: string;
  tags: string[];
}

export interface CompanyCompetency {
  name: string;
  score: number;
  isGap?: boolean;
}

export interface QuestionWeight {
  topic: string;
  frequency: number;
  label: "Very High" | "Asked" | "Queries";
}

export interface InterviewProblem {
  id: string;
  title: string;
  domain: string;
  difficulty: "Easy" | "Easy-Medium" | "Medium" | "Medium-Hard" | "Hard";
  recurrenceRate: string;
  askedDate: string;
  description: string;
}

export interface CompanyWorkspaceDetail {
  id: string;
  name: string;
  monogram: string;
  category: string;
  locations: string[];
  targetRole: string;
  recruitmentWindow: string;
  competenciesVerified: number;
  totalCompetencies: number;
  readinessScore: number;
  readinessPhase: string;
  hiringStages: HiringStage[];
  competencies: CompanyCompetency[];
  questionWeights: QuestionWeight[];
  recentQuestions: InterviewProblem[];
}

export interface DirectoryCompany {
  id: string;
  name: string;
  monogram: string;
  segment: string;
  location: string;
  salaryRange: string;
  roles: string[];
  processSummary: string;
  difficulty: string;
  readinessScore: number;
  segmentFilter: string;
}

export interface CompanyRecommendation {
  id: string;
  name: string;
  matchPercentage: number;
  rationale: string;
  roadmapsCount: number;
  practiceSetsCount: number;
}

export interface RecentCompanyLog {
  id: string;
  name: string;
  targetRole: string;
  lastInteraction: string;
  cohortStatus: string;
  readinessScore: number;
  sprintAction: string;
}
