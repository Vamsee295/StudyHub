export interface InterviewQuestion {
  id: string;
  domain: string;
  text: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface InterviewRubricFeedback {
  understanding: { score: number; notes: string };
  technicalAccuracy: { score: number; notes: string };
  clarity: { score: number; notes: string };
  completeness: { score: number; notes: string };
  strengths: string[];
  improvements: string[];
  expectedAnswer: string;
  keyPoints: string[];
}

export interface InterviewEvaluation {
  questionId: string;
  userAnswer: string;
  feedback: InterviewRubricFeedback;
}

export const MOCK_INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  { id: 'q1', domain: 'Java', text: 'Explain the difference between HashMap and ConcurrentHashMap in Java.', difficulty: 'Medium' },
  { id: 'q2', domain: 'Java', text: 'How does garbage collection work in Java?', difficulty: 'Medium' },
  { id: 'q3', domain: 'SQL', text: 'What is the difference between INNER JOIN and LEFT JOIN?', difficulty: 'Easy' },
  { id: 'q4', domain: 'SQL', text: 'Explain the concept of ACID properties in database transactions.', difficulty: 'Medium' },
  { id: 'q5', domain: 'DSA', text: 'How would you detect a cycle in a linked list?', difficulty: 'Medium' },
  { id: 'q6', domain: 'System Design', text: 'How would you design a URL shortener service like bit.ly?', difficulty: 'Hard' },
  { id: 'q7', domain: 'HR', text: 'Tell me about a time you faced a significant technical challenge and how you overcame it.', difficulty: 'Medium' }
];

// Mock evaluation engine
export const evaluateAnswerMock = async (questionId: string, answer: string): Promise<InterviewRubricFeedback> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const wordCount = answer.trim().split(/\s+/).length;
  const isShort = wordCount < 20;

  // Generate semi-random but realistic feedback based on answer length
  const scoreBase = isShort ? 2 : 4;
  
  return {
    understanding: { 
      score: Math.min(5, scoreBase + (Math.random() > 0.5 ? 1 : 0)), 
      notes: isShort ? "Answer lacks depth indicating partial understanding." : "Demonstrates good comprehension of the core concepts."
    },
    technicalAccuracy: { 
      score: Math.min(5, scoreBase + (Math.random() > 0.5 ? 1 : -1)), 
      notes: "Most technical terms were used correctly, though some edge cases were missed." 
    },
    clarity: { 
      score: Math.min(5, scoreBase + (Math.random() > 0.5 ? 1 : 0)), 
      notes: "The explanation was reasonably structured." 
    },
    completeness: { 
      score: isShort ? 2 : Math.min(5, scoreBase + (Math.random() > 0.5 ? 1 : -1)), 
      notes: isShort ? "Did not cover all aspects of the question." : "Covered the main points, but could have elaborated on trade-offs." 
    },
    strengths: isShort ? ["Got straight to the point"] : ["Good use of technical vocabulary", "Structured approach"],
    improvements: isShort ? ["Provide more details and examples", "Expand on edge cases"] : ["Mention performance implications", "Compare with alternatives"],
    expectedAnswer: "A complete answer should define the concepts clearly, compare them using real-world scenarios, and discuss time/space complexities or trade-offs.",
    keyPoints: ["Definitions", "Differences/Trade-offs", "Use cases", "Complexity/Performance"]
  };
};

export const generateInterviewSession = (domain: string, count: number): InterviewQuestion[] => {
  const filtered = domain === 'All' 
    ? MOCK_INTERVIEW_QUESTIONS 
    : MOCK_INTERVIEW_QUESTIONS.filter(q => q.domain === domain);
  
  // Shuffle and pick
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
