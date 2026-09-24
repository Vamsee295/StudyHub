export interface CourseLessonContent {
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
  sections?: Array<{
    type: string;
    title: string;
    [key: string]: any;
  }>;
}

export interface CourseLesson {
  id: string;
  slug: string;
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
