export interface ResumeAnalysisResult {
  overallScore: number;
  atsCompatibility: number;
  keywordCoverage: number;
  skillsMatch: number;
  formatting: number;
  projectStrength: number;
  experienceDepth: number;
  detectedSections: {
    contact: boolean;
    summary: boolean;
    education: boolean;
    skills: boolean;
    projects: boolean;
    experience: boolean;
    certifications: boolean;
  };
  detectedSkills: {
    programming: string[];
    frameworks: string[];
    databases: string[];
    cloud: string[];
    tools: string[];
  };
  suggestions: { id: string; type: 'critical' | 'warning' | 'info'; message: string; action: string }[];
  jobMatch: {
    matchPercentage: number;
    matchedKeywords: string[];
    missingKeywords: string[];
  };
}

// Very basic mock engine
export const analyzeResumeMock = async (file: File | null, jobDescription?: string): Promise<ResumeAnalysisResult> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500));

  // If a real file was uploaded, we'd extract text. For demo, we just return a randomized but realistic good score
  // If it's our sample resume, we'll return a static strong score.

  const isSample = !file; // We pass null to simulate the sample resume
  
  return {
    overallScore: isSample ? 86 : Math.floor(Math.random() * 40) + 50, // 50-90
    atsCompatibility: isSample ? 92 : Math.floor(Math.random() * 30) + 60,
    keywordCoverage: isSample ? 85 : Math.floor(Math.random() * 40) + 40,
    skillsMatch: isSample ? 88 : Math.floor(Math.random() * 40) + 50,
    formatting: isSample ? 95 : Math.floor(Math.random() * 20) + 70,
    projectStrength: isSample ? 82 : Math.floor(Math.random() * 50) + 40,
    experienceDepth: isSample ? 78 : Math.floor(Math.random() * 60) + 30,
    
    detectedSections: {
      contact: true,
      summary: isSample ? true : Math.random() > 0.5,
      education: true,
      skills: true,
      projects: true,
      experience: isSample ? true : Math.random() > 0.3,
      certifications: isSample ? false : Math.random() > 0.7,
    },
    
    detectedSkills: {
      programming: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++'],
      frameworks: ['React', 'Next.js', 'Node.js', 'Express', 'Spring Boot'],
      databases: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL'],
      cloud: ['AWS (S3, EC2)', 'Docker', 'Vercel'],
      tools: ['Git', 'GitHub', 'Jira', 'Figma', 'Postman']
    },
    
    suggestions: [
      {
        id: '1',
        type: 'critical',
        message: 'Bullet points lack quantifiable metrics (e.g., "Improved performance by X%").',
        action: 'Rewrite project bullets using the Action-Result-Metric format.'
      },
      {
        id: '2',
        type: 'warning',
        message: 'Missing a dedicated Summary section.',
        action: 'Add a 2-3 line professional summary highlighting your core strengths and career goals.'
      },
      {
        id: '3',
        type: 'info',
        message: 'Some keywords from the standard job description are missing.',
        action: 'Consider adding "Agile", "CI/CD", and "Testing" to your skills.'
      }
    ],
    
    jobMatch: {
      matchPercentage: isSample ? 78 : Math.floor(Math.random() * 50) + 30,
      matchedKeywords: ['React', 'Node.js', 'JavaScript', 'REST APIs', 'PostgreSQL'],
      missingKeywords: ['Docker', 'Kubernetes', 'GraphQL', 'AWS', 'CI/CD']
    }
  };
};
