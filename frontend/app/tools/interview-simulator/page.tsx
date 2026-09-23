"use client";

import React, { useState } from 'react';
import { Mic2 } from 'lucide-react';
import { ToolWorkspaceHeader } from '@/components/tools/shared/ToolWorkspaceHeader';
import { InterviewSetup } from '@/components/tools/interview/InterviewSetup';
import { InterviewSession } from '@/components/tools/interview/InterviewSession';
import { InterviewFeedbackCard } from '@/components/tools/interview/InterviewFeedbackCard';
import { InterviewSummaryReport } from '@/components/tools/interview/InterviewSummaryReport';
import { 
  generateInterviewSession, 
  evaluateAnswerMock, 
  InterviewQuestion, 
  InterviewEvaluation 
} from '@/lib/services/tools/interviewService';

type InterviewState = 'setup' | 'session' | 'feedback' | 'summary';

export default function InterviewSimulatorPage() {
  const [currentState, setCurrentState] = useState<InterviewState>('setup');
  
  // Session data
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [evaluations, setEvaluations] = useState<InterviewEvaluation[]>([]);
  
  // Active question state
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentUserAnswer, setCurrentUserAnswer] = useState('');

  const handleStart = (config: { domain: string; count: number; company: string }) => {
    const sessionQuestions = generateInterviewSession(config.domain, config.count);
    setQuestions(sessionQuestions);
    setCurrentIndex(0);
    setEvaluations([]);
    setCurrentState('session');
  };

  const handleSubmitAnswer = async (answer: string) => {
    setIsEvaluating(true);
    setCurrentUserAnswer(answer);
    
    const activeQuestion = questions[currentIndex];
    const feedback = await evaluateAnswerMock(activeQuestion.id, answer);
    
    setEvaluations(prev => [
      ...prev,
      {
        questionId: activeQuestion.id,
        userAnswer: answer,
        feedback
      }
    ]);
    
    setIsEvaluating(false);
    setCurrentState('feedback');
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setCurrentState('session');
    } else {
      setCurrentState('summary');
    }
  };

  const handleRestart = () => {
    setCurrentState('setup');
    setQuestions([]);
    setEvaluations([]);
    setCurrentIndex(0);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto h-full flex flex-col">
        <ToolWorkspaceHeader
          title="Interview Simulator"
          description="Practice technical and HR interview questions with an AI-driven rubric that evaluates your accuracy, clarity, and completeness."
          badge="AI Evaluator"
          icon={<Mic2 className="w-5 h-5" />}
        />

        <div className="flex-1 mt-4">
          {currentState === 'setup' && (
            <InterviewSetup onStart={handleStart} />
          )}

          {currentState === 'session' && questions.length > 0 && (
            <div className="max-w-4xl mx-auto h-[600px]">
              <InterviewSession
                question={questions[currentIndex]}
                currentIndex={currentIndex}
                totalQuestions={questions.length}
                onSubmit={handleSubmitAnswer}
                isEvaluating={isEvaluating}
              />
            </div>
          )}

          {currentState === 'feedback' && evaluations.length > 0 && (
            <InterviewFeedbackCard
              question={questions[currentIndex]}
              userAnswer={currentUserAnswer}
              feedback={evaluations[currentIndex].feedback}
              onNext={handleNextQuestion}
              isLastQuestion={currentIndex === questions.length - 1}
            />
          )}

          {currentState === 'summary' && (
            <InterviewSummaryReport
              evaluations={evaluations}
              onRestart={handleRestart}
            />
          )}
        </div>
      </div>
    </div>
  );
}
