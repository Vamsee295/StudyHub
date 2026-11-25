import React, { useState, useEffect } from 'react';
import { InterviewQuestion } from '@/lib/services/tools/interviewService';
import { ToolCard } from '@/components/tools/shared/ToolCard';
import { Timer, MessageSquare, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InterviewSessionProps {
  question: InterviewQuestion;
  currentIndex: number;
  totalQuestions: number;
  onSubmit: (answer: string) => void;
  isEvaluating: boolean;
}

export function InterviewSession({ question, currentIndex, totalQuestions, onSubmit, isEvaluating }: InterviewSessionProps) {
  const [answer, setAnswer] = useState('');
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  // A new question starts with an empty answer and a fresh clock
  const [askedId, setAskedId] = useState(question.id);
  if (askedId !== question.id) {
    setAskedId(question.id);
    setAnswer('');
    setSecondsElapsed(0);
  }

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isEvaluating) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isEvaluating]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-mute uppercase tracking-wider">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-ink/20"></span>
          <span className="text-xs font-semibold text-accent-ink bg-accent-soft px-2 py-0.5 rounded">
            {question.domain}
          </span>
          <span className={cn(
            "text-xs font-semibold px-2 py-0.5 rounded",
            question.difficulty === 'Easy' ? "text-note bg-success-soft" :
            question.difficulty === 'Medium' ? "text-warning bg-warning-soft" :
            "text-danger bg-danger-soft"
          )}>
            {question.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-mute font-mono text-sm bg-card px-3 py-1 rounded-lg border-[1.5px] border-hair">
          <Timer className="w-4 h-4 text-mute" />
          {formatTime(secondsElapsed)}
        </div>
      </div>

      {/* Question Card */}
      <ToolCard className="border-accent-line bg-accent-soft/30">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-accent text-paper flex items-center justify-center font-bold text-lg shrink-0 mt-1">
            Q
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-ink leading-relaxed">
              {question.text}
            </h3>
          </div>
        </div>
      </ToolCard>

      {/* Answer Area */}
      <ToolCard className="flex-1 flex flex-col p-0 overflow-hidden relative">
        <div className="p-4 border-b border-hair bg-paper-2/50 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-mute" />
          <h4 className="font-semibold text-sm text-body">Your Answer</h4>
        </div>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={isEvaluating}
          placeholder="Type your detailed answer here... (minimum 30 words recommended)"
          className="flex-1 w-full p-4 md:p-6 text-body resize-none focus:outline-none focus:bg-accent-soft/10 transition-colors"
        />
        <div className="p-4 border-t border-hair bg-paper-2/50 flex items-center justify-between">
          <div className="text-sm text-mute font-medium">
            {wordCount} words
          </div>
          <button
            onClick={() => onSubmit(answer)}
            disabled={!answer.trim() || isEvaluating}
            className="flex items-center gap-2 px-6 py-2.5 bg-ink text-paper rounded-lg font-medium hover:bg-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isEvaluating ? (
              <>
                <div className="w-4 h-4 border-2 border-card/30 border-t-white rounded-full animate-spin"></div>
                Evaluating...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Answer
              </>
            )}
          </button>
        </div>
        
        {/* Evaluating overlay */}
        {isEvaluating && (
          <div className="absolute inset-0 bg-card/60 backdrop-blur-[1px] flex items-center justify-center z-10">
            <div className="bg-card p-6 rounded-2xl shadow-xl border-[1.5px] border-hair flex flex-col items-center max-w-sm text-center">
              <div className="w-12 h-12 border-4 border-accent-line border-t-accent rounded-full animate-spin mb-4"></div>
              <h3 className="font-bold text-ink mb-1">Analyzing your response</h3>
              <p className="text-sm text-mute">Evaluating understanding, accuracy, and clarity against standard rubric...</p>
            </div>
          </div>
        )}
      </ToolCard>
    </div>
  );
}
