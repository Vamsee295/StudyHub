export type SectionType = 
  | 'text' 
  | 'code' 
  | 'list' 
  | 'table' 
  | 'warning' 
  | 'takeaways' 
  | 'quickCheck' 
  | 'think' 
  | 'tryIt' 
  | 'dryRun' 
  | 'interviewTraps' 
  | 'practice' 
  | 'prerequisites'
  | 'callout';

export interface CourseLessonContent {
  // Legacy fields (kept for backward compatibility during transition)
  definition?: string;
  whyItMatters?: string;
  coreConcept?: string;
  syntax?: string;
  javaExample?: string;
  howItWorks?: string;
  realWorldUse?: string;
  commonMistakes?: string[];
  interviewQuestions?: {
    question: string;
    answer: string;
  }[];
  quickRevision?: string;
  practicePrompt?: string;
  quickCheck?: {
    question: string;
    options: string[];
    answer: number;
    explanation: string;
  };
  
  // The new structured content sections
  sections?: Array<{
    type: SectionType;
    title?: string;
    // For text, warning, callout
    content?: string;
    // For code, tryIt
    code?: string;
    language?: string;
    explanation?: string;
    // For list, takeaways, warning (legacy)
    items?: string[];
    // For table
    headers?: string[];
    rows?: string[][];
    // For quickCheck
    question?: string;
    options?: string[];
    answer?: number | string; // index or string
    // For think
    answerReveal?: string;
    // For tryIt
    expectedOutput?: string;
    // For dryRun
    iterations?: Array<{
      step: number | string;
      variables: Record<string, string>;
      description: string;
    }>;
    // For interviewTraps
    traps?: Array<{
      question: string;
      trap: string;
      solution: string;
    }>;
    // For practice
    problems?: Array<{
      id: string;
      title: string;
      difficulty: 'Easy' | 'Medium' | 'Hard';
    }>;
    // For prerequisites
    links?: Array<{
      title: string;
      slug: string;
    }>;
    [key: string]: any;
  }>;
}

export interface CourseLesson {
  id: string;
  slug: string;
  legacySlug?: string;
  legacyId?: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  content: CourseLessonContent;
  relatedTools?: { title: string; url: string }[];
  relatedResources?: { title: string; url: string }[];
  relatedPracticeTrack?: string;
}


export interface CourseModule {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedMinutes: number;
  lessons: CourseLesson[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: "Technical" | "Placement" | "Core CS" | "Aptitude";
  icon: string;
  displayOrder: number;
  modules: CourseModule[];
}

export interface CourseProgress {
  completedLessons: string[];
  totalLessons: number;
  percentage: number;
  lastAccessedLessonSlug?: string;
}
