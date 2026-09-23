import React from 'react';
import { ResumeAnalysisResult } from '@/lib/services/tools/resumeService';
import { ToolCard } from '@/components/tools/shared/ToolCard';
import { Lightbulb, AlertTriangle, Info as InfoIcon, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResumeSuggestionsListProps {
  suggestions: ResumeAnalysisResult['suggestions'];
}

export function ResumeSuggestionsList({ suggestions }: ResumeSuggestionsListProps) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <ToolCard className="h-full">
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="w-5 h-5 text-amber-500" />
        <h3 className="font-semibold text-gray-900">Actionable Feedback</h3>
      </div>
      
      <div className="space-y-4">
        {suggestions.map((suggestion) => {
          let icon = <InfoIcon className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />;
          let containerClass = "bg-blue-50/50 border-blue-100";
          let badgeClass = "bg-blue-100 text-blue-700";
          let badgeText = "Suggestion";

          if (suggestion.type === 'critical') {
            icon = <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />;
            containerClass = "bg-red-50/50 border-red-100";
            badgeClass = "bg-red-100 text-red-700";
            badgeText = "Critical";
          } else if (suggestion.type === 'warning') {
            icon = <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />;
            containerClass = "bg-amber-50/50 border-amber-100";
            badgeClass = "bg-amber-100 text-amber-700";
            badgeText = "Impactful";
          }

          return (
            <div key={suggestion.id} className={cn("p-4 rounded-xl border flex gap-3", containerClass)}>
              {icon}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded", badgeClass)}>
                    {badgeText}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1.5">{suggestion.message}</p>
                <div className="text-sm text-gray-600 bg-white/60 p-2.5 rounded-lg border border-gray-100 italic">
                  <span className="font-semibold not-italic mr-1 text-gray-700">Action:</span> 
                  {suggestion.action}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ToolCard>
  );
}
