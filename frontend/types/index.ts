export interface LearningPath {
  slug: string;
  name: string;
  /** true when the track has a roadmap and courses behind it; the rest are planned, not offered yet. */
  available: boolean;
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
  courses: string[]; // Learn courses behind the stage
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

// ----------------------------------------------------
// TOOLS MODULE TYPES
// ----------------------------------------------------

export interface ContinueToolItem {
  id: string;
  title: string;
  description: string;
  badge: string;
  timeAgo: string;
  meta: string;
  href: string;
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
}

export interface HiringStage {
  stageNumber: number;
  title: string;
  description: string;
  duration: string;
  tags: string[];
}

export interface QuestionWeight {
  topic: string;
}

export interface InterviewProblem {
  id: string;
  title: string;
  domain: string;
  difficulty: "Easy" | "Easy-Medium" | "Medium" | "Medium-Hard" | "Hard";
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
  hiringStages: HiringStage[];
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
  segmentFilter: string;
}

export interface RecentCompanyLog {
  id: string;
  name: string;
  targetRole: string;
  viewedAt: number; // ms timestamp
}

// ----------------------------------------------------
// RESOURCES LIBRARY MODULE TYPES
// ----------------------------------------------------

export interface ResourceCategoryItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  filterKey: string;
}

// ----------------------------------------------------
// TEMPLATES MODULE TYPES
// ----------------------------------------------------






// ----------------------------------------------------
// ONBOARDING & USER PROFILE TYPES
// ----------------------------------------------------

export interface UserIdentity {
  fullName: string;
  email?: string;
  college: string;
  degree: string;
  branch?: string;
  graduationYear: string;
  currentSemester?: string;
  driveCycle: string;
  targetRole?: string;
  preferredJobType?: string;
  locationPreference?: string;
  avatarUrl?: string;
}

export interface SkillBaseline {
  programming: "Beginner" | "Intermediate" | "Advanced";
  dsa: "Beginner" | "Intermediate" | "Advanced";
  sql: "Beginner" | "Intermediate" | "Advanced";
  coreCS: "Beginner" | "Intermediate" | "Advanced";
  aptitude: "Beginner" | "Intermediate" | "Advanced";
}

export interface UserTargets {
  objectives: string[];
  companies: string[]; // Company names or IDs
}

export interface UserProfile {
  userId?: string;
  identity: UserIdentity;
  careerTracks: string[];
  skillBaseline: SkillBaseline;
  targets: UserTargets;
  profileCompleted: boolean;
  completionPercentage?: number;
  onboardingCompletedAt?: string;
  updatedAt?: string;
}

export interface RoadmapGenerationResult {
  stages: {
    id: string;
    title: string;
    description: string;
    status: 'queued' | 'active' | 'completed';
  }[];
  primaryTrack: string;
  modulesQueued: number;
  targetRubric: string;
}
