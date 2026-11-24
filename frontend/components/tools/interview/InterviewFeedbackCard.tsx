import React from 'react';
import { InterviewRubricFeedback, InterviewQuestion } from '@/lib/services/tools/interviewService';
import { ToolCard } from '@/components/tools/shared/ToolCard';
import { Target, CheckCircle2, AlertCircle, ArrowRight, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InterviewFeedbackCardProps {
  question: InterviewQuestion;
  userAnswer: string;
  feedback: InterviewRubricFeedback;
  onNext: () => void;
  isLastQuestion: boolean;
}

export function InterviewFeedbackCard({ question, userAnswer, feedback, onNext, isLastQuestion }: InterviewFeedbackCardProps) {
  
  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-note bg-success-soft border-success-line';
    if (score === 3) return 'text-warning bg-warning-soft border-warning-line';
    return 'text-danger bg-danger-soft border-danger-line';
  };

  const getScoreBarWidth = (score: number) => `${(score / 5) * 100}%`;

  const MetricRow = ({ label, metric }: { label: string, metric: { score: number, notes: string } }) => (
    <div className="py-4 border-b border-hair last:border-0">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-body text-sm">{label}</span>
        <div className="flex items-center gap-2">
          <span className={cn("text-xs font-bold px-2 py-0.5 rounded", getScoreColor(metric.score))}>
            {metric.score}/5
          </span>
        </div>
      </div>
      <div className="w-full h-1.5 bg-card-2 rounded-full mb-3 overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-1000", 
            metric.score >= 4 ? "bg-note" : metric.score === 3 ? "bg-gold" : "bg-danger"
          )}
          style={{ width: getScoreBarWidth(metric.score) }}
        ></div>
      </div>
      <p className="text-sm text-body">{metric.notes}</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-ink flex items-center gap-2">
          <Target className="w-6 h-6 text-accent-ink" /> Evaluation Results
        </h2>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-2.5 bg-accent text-paper rounded-lg font-medium hover:bg-accent transition-colors"
        >
          {isLastQuestion ? 'View Final Report' : 'Next Question'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Original Q&A and Rubric */}
        <div className="flex flex-col gap-6">
          <ToolCard className="border-hair">
            <h3 className="text-xs font-bold text-mute uppercase tracking-wider mb-2">Question</h3>
            <p className="font-medium text-ink mb-6">{question.text}</p>
            
            <h3 className="text-xs font-bold text-mute uppercase tracking-wider mb-2">Your Answer</h3>
            <div className="bg-paper-2 p-4 rounded-xl border border-hair text-sm text-body whitespace-pre-wrap font-medium">
              {userAnswer}
            </div>
          </ToolCard>

          <ToolCard>
            <h3 className="text-sm font-bold text-ink mb-2">Rubric Breakdown</h3>
            <MetricRow label="Understanding" metric={feedback.understanding} />
            <MetricRow label="Technical Accuracy" metric={feedback.technicalAccuracy} />
            <MetricRow label="Clarity & Communication" metric={feedback.clarity} />
            <MetricRow label="Completeness" metric={feedback.completeness} />
          </ToolCard>
        </div>

        {/* Right Column - Feedback & Expected */}
        <div className="flex flex-col gap-6">
          <ToolCard className="bg-success-soft border-success-line">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-note" />
              <h3 className="font-bold text-note">What you did well</h3>
            </div>
            <ul className="space-y-2">
              {feedback.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-note">
                  <span className="w-1.5 h-1.5 rounded-full bg-note mt-1.5 shrink-0"></span>
                  {s}
                </li>
              ))}
            </ul>
          </ToolCard>

          <ToolCard className="bg-warning-soft border-warning-line">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-warning" />
              <h3 className="font-bold text-warning">Areas for improvement</h3>
            </div>
            <ul className="space-y-2">
              {feedback.improvements.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-warning">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0"></span>
                  {s}
                </li>
              ))}
            </ul>
          </ToolCard>

          <ToolCard className="flex-1 border-accent-line bg-accent-soft/10">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-accent-ink" />
              <h3 className="font-bold text-ink">Ideal Benchmark Answer</h3>
            </div>
            <div className="bg-card p-4 rounded-xl border border-accent-line text-sm text-body leading-relaxed mb-4">
              {feedback.expectedAnswer}
            </div>
            
            <h4 className="text-xs font-bold text-mute uppercase tracking-wider mb-2 mt-6">Key Points to Cover</h4>
            <div className="flex flex-wrap gap-2">
              {feedback.keyPoints.map((point, i) => (
                <span key={i} className="px-2.5 py-1 bg-card-2 text-body text-xs font-medium rounded border border-hair">
                  {point}
                </span>
              ))}
            </div>
          </ToolCard>
        </div>
      </div>
    </div>
  );
}
