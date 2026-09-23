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
    if (score >= 4) return 'text-green-600 bg-green-50 border-green-200';
    if (score === 3) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreBarWidth = (score: number) => `${(score / 5) * 100}%`;

  const MetricRow = ({ label, metric }: { label: string, metric: { score: number, notes: string } }) => (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-700 text-sm">{label}</span>
        <div className="flex items-center gap-2">
          <span className={cn("text-xs font-bold px-2 py-0.5 rounded", getScoreColor(metric.score))}>
            {metric.score}/5
          </span>
        </div>
      </div>
      <div className="w-full h-1.5 bg-gray-100 rounded-full mb-3 overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-1000", 
            metric.score >= 4 ? "bg-green-500" : metric.score === 3 ? "bg-amber-500" : "bg-red-500"
          )}
          style={{ width: getScoreBarWidth(metric.score) }}
        ></div>
      </div>
      <p className="text-sm text-gray-600">{metric.notes}</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-600" /> Evaluation Results
        </h2>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          {isLastQuestion ? 'View Final Report' : 'Next Question'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Original Q&A and Rubric */}
        <div className="flex flex-col gap-6">
          <ToolCard className="border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Question</h3>
            <p className="font-medium text-gray-900 mb-6">{question.text}</p>
            
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Your Answer</h3>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-700 whitespace-pre-wrap font-medium">
              {userAnswer}
            </div>
          </ToolCard>

          <ToolCard>
            <h3 className="text-sm font-bold text-gray-900 mb-2">Rubric Breakdown</h3>
            <MetricRow label="Understanding" metric={feedback.understanding} />
            <MetricRow label="Technical Accuracy" metric={feedback.technicalAccuracy} />
            <MetricRow label="Clarity & Communication" metric={feedback.clarity} />
            <MetricRow label="Completeness" metric={feedback.completeness} />
          </ToolCard>
        </div>

        {/* Right Column - Feedback & Expected */}
        <div className="flex flex-col gap-6">
          <ToolCard className="bg-gradient-to-br from-green-50 to-emerald-50/20 border-green-100">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <h3 className="font-bold text-green-900">What you did well</h3>
            </div>
            <ul className="space-y-2">
              {feedback.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-green-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0"></span>
                  {s}
                </li>
              ))}
            </ul>
          </ToolCard>

          <ToolCard className="bg-gradient-to-br from-amber-50 to-orange-50/20 border-amber-100">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-amber-900">Areas for improvement</h3>
            </div>
            <ul className="space-y-2">
              {feedback.improvements.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                  {s}
                </li>
              ))}
            </ul>
          </ToolCard>

          <ToolCard className="flex-1 border-blue-100 bg-blue-50/10">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-900">Ideal Benchmark Answer</h3>
            </div>
            <div className="bg-white p-4 rounded-xl border border-blue-100 text-sm text-gray-700 leading-relaxed mb-4 shadow-sm">
              {feedback.expectedAnswer}
            </div>
            
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-6">Key Points to Cover</h4>
            <div className="flex flex-wrap gap-2">
              {feedback.keyPoints.map((point, i) => (
                <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded border border-gray-200">
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
