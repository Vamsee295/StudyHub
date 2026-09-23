export type CompanyType =
  | "product"
  | "high_volume"
  | "fintech_consulting"
  | "startup"
  | "mass_hiring"
  | "other";

export type CompanyTypeSelection = CompanyType | "";

export type ResumeSourceType = "pdf" | "text";
export type AnalysisStatus = "pending" | "processing" | "completed" | "failed";
export type StageStatus = "pending" | "processing" | "completed" | "failed";
export type SkillMatchStatus = "matched" | "partial" | "missing";
export type KeywordStatus = "present" | "partial" | "missing";
export type AlignmentStatus = "aligned" | "partial" | "gap" | "not_assessed";
export type IssueSeverity = "low" | "medium" | "high";
export type Priority = "high" | "medium" | "low";

export interface ResumeAnalysisTarget {
  company: string;
  companyType: CompanyTypeSelection;
  role: string;
  customRole?: string;
  jobDescription?: string;
}

export interface ResumeAnalysisRequest {
  source: ResumeSourceType;
  fileName?: string;
  fileSize?: number;
  fileMimeType?: string;
  resumeText?: string;
  target: ResumeAnalysisTarget;
}

export interface AnalysisStage {
  id: string;
  label: string;
  status: StageStatus;
  message?: string;
  startedAt?: string;
  completedAt?: string;
  failedAt?: string;
}

export interface AnalysisError {
  code: string;
  message: string;
}

export interface ResumeAnalysisSummary {
  id: string;
  status: AnalysisStatus;
  currentStage?: string;
  stages: AnalysisStage[];
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
  failedAt?: string;
  error?: AnalysisError;
}

export interface AtsCheck {
  id: string;
  label: string;
  status: "pass" | "warning" | "fail" | "not_assessed";
  detail: string;
  evidence?: string[];
}

export interface AtsCompatibility {
  score: number;
  checks: AtsCheck[];
  summary: string;
}

export interface SkillMatch {
  name: string;
  status: SkillMatchStatus;
  evidence: string[];
  recommendation?: string;
}

export interface SkillMatching {
  matched: SkillMatch[];
  partial: SkillMatch[];
  missing: SkillMatch[];
  summary: string;
}

export interface KeywordAnalysisItem {
  keyword: string;
  status: KeywordStatus;
  count: number;
  context?: string;
}

export interface ExperienceEntry {
  role: string;
  company: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  summary?: string;
  achievements: string[];
}

export interface ExperienceAnalysis {
  yearsOfExperience?: number;
  roles: ExperienceEntry[];
  findings: string[];
  evidence: string[];
}

export interface ProjectEntry {
  name: string;
  description?: string;
  technologies: string[];
  outcomes: string[];
  relevance: "high" | "medium" | "low" | "not_assessed";
  evidence: string[];
}

export interface ProjectAnalysis {
  projects: ProjectEntry[];
  relevanceSummary: string;
  gaps: string[];
}

export interface EducationEntry {
  institution: string;
  degree?: string;
  fieldOfStudy?: string;
  graduationDate?: string;
  details?: string;
}

export interface EducationCertifications {
  education: EducationEntry[];
  certifications: string[];
  findings: string[];
}

export interface ResumeIssue {
  severity: IssueSeverity;
  issue: string;
  evidence: string[];
  recommendation: string;
}

export interface CompanyAlignmentFactor {
  factor: string;
  status: AlignmentStatus;
  assessment: string;
  evidence: string[];
}

export interface ActionItem {
  priority: Priority;
  category: string;
  action: string;
  rationale: string;
  evidence: string[];
}

export interface ScoreBreakdownItem {
  label: string;
  value: number;
  maxValue: number;
  evidence: string[];
}

export interface CandidateProfile {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  headline?: string;
  summary?: string;
  currentRole?: string;
  yearsOfExperience?: number;
}

export interface ResumeAnalysisReport {
  analysisId: string;
  status: "completed";
  generatedAt: string;
  target: ResumeAnalysisTarget;
  candidate: CandidateProfile;
  overallScore: number;
  scoreBreakdown: ScoreBreakdownItem[];
  atsCompatibility: AtsCompatibility;
  skillMatching: SkillMatching;
  keywordAnalysis: KeywordAnalysisItem[];
  experience: ExperienceAnalysis;
  projects: ProjectAnalysis;
  educationCertifications: EducationCertifications;
  issues: ResumeIssue[];
  companyAlignment: CompanyAlignmentFactor[];
  actionPlan: ActionItem[];
}

export interface ResumeStreamStageEvent {
  type: "stage";
  stage: AnalysisStage;
}

export interface ResumeStreamCompleteEvent {
  type: "complete";
  analysis: ResumeAnalysisSummary;
  report: ResumeAnalysisReport;
}

export interface ResumeStreamErrorEvent {
  type: "error";
  error: AnalysisError;
}

export type ResumeStreamEvent =
  | ResumeStreamStageEvent
  | ResumeStreamCompleteEvent
  | ResumeStreamErrorEvent;

export interface CreateAnalysisResponse {
  analysis: ResumeAnalysisSummary;
}

export interface GetAnalysisResponse {
  analysis: ResumeAnalysisSummary;
  report?: ResumeAnalysisReport;
}
