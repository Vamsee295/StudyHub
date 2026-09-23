import React from 'react';
import { InterviewEvaluation } from '@/lib/services/tools/interviewService';
import { ToolCard } from '@/components/tools/shared/ToolCard';
import { Trophy, ArrowLeft, BarChart, Target } from 'lucide-react';

interface InterviewSummaryReportProps {
  evaluations: InterviewEvaluation[];
  onRestart: () => void;
}

export function InterviewSummaryReport({ evaluations, onRestart }: InterviewSummaryReportProps) {
  // Calculate average scores
  let totalUnd = 0, totalAcc = 0, totalCla = 0, totalCom = 0;
  
  evaluations.forEach(ev => {
    totalUnd += ev.feedback.understanding.score;
    totalAcc += ev.feedback.technicalAccuracy.score;
    totalCla += ev.feedback.clarity.score;
    totalCom += ev.feedback.completeness.score;
  });

  const n = evaluations.length || 1;
  const avgScore = (totalUnd + totalAcc + totalCla + totalCom) / (n * 4);
  const outOf100 = Math.round((avgScore / 5) * 100);

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart className="w-6 h-6 text-blue-600" /> Session Complete
        </h2>
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 font-medium hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Start New Session
        </button>
      </div>

      <ToolCard className="text-center p-8 bg-gradient-to-br from-blue-600 to-indigo-700 border-none text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Trophy className="w-48 h-48" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center">
          <p className="text-blue-100 font-medium uppercase tracking-widest text-sm mb-4">Final Score</p>
          <div className="text-7xl font-black mb-2">{outOf100}<span className="text-3xl text-blue-300 ml-1">/100</span></div>
          <p className="text-blue-100 text-lg max-w-lg mt-4">
            {outOf100 >= 80 ? 'Excellent performance! You are well prepared.' : 
             outOf100 >= 60 ? 'Good effort. Review the rubric feedback to close the final gaps.' : 
             'Keep practicing! Focus on completeness and technical accuracy.'}
          </p>
        </div>
      </ToolCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ToolCard>
          <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-500" /> Average Metrics
          </h3>
          <div className="space-y-4">
            <MetricBar label="Understanding" value={totalUnd / n} />
            <MetricBar label="Technical Accuracy" value={totalAcc / n} />
            <MetricBar label="Clarity" value={totalCla / n} />
            <MetricBar label="Completeness" value={totalCom / n} />
          </div>
        </ToolCard>

        <ToolCard>
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" /> Question Summary
          </h3>
          <div className="space-y-2">
            {evaluations.map((ev, i) => {
              const qScore = (ev.feedback.understanding.score + ev.feedback.technicalAccuracy.score + ev.feedback.clarity.score + ev.feedback.completeness.score) / 4;
              return (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-sm font-medium text-gray-700">Question {i + 1}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(qScore / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-gray-500 w-8 text-right">{qScore.toFixed(1)}/5</span>
                  </div>
                </div>
              );
            })}
          </div>
        </ToolCard>
      </div>
    </div>
  );
}

function MetricBar({ label, value }: { label: string, value: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="font-bold text-gray-900">{value.toFixed(1)} <span className="text-gray-400 font-normal">/ 5</span></span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-indigo-500 rounded-full" 
          style={{ width: `${(value / 5) * 100}%` }}
        ></div>
      </div>
    </div>
  );
}
