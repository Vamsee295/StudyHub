import React from 'react';
import { ResumeAnalysisResult } from '@/lib/services/tools/resumeService';
import { ToolCard } from '@/components/tools/shared/ToolCard';
import { Briefcase, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResumeJobMatchProps {
  jobMatch: ResumeAnalysisResult['jobMatch'];
}

export function ResumeJobMatch({ jobMatch }: ResumeJobMatchProps) {
  return (
    <ToolCard className="h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-fuchsia-500" />
          <h3 className="font-semibold text-gray-900">Job Description Match</h3>
        </div>
        <div className="flex items-center gap-2 bg-fuchsia-50 px-3 py-1 rounded-full border border-fuchsia-100">
          <span className="text-xs font-bold text-fuchsia-700 uppercase">Match Score</span>
          <span className="text-sm font-black text-fuchsia-700">{jobMatch.matchPercentage}%</span>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-4">
          Compared against standard SDE roles (Frontend/Backend/Fullstack). Add specific keywords to increase visibility for these roles.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Matched Keywords */}
        <div className="bg-green-50/50 rounded-xl p-4 border border-green-100">
          <div className="flex items-center gap-1.5 mb-3">
            <Check className="w-4 h-4 text-green-600" />
            <h4 className="text-sm font-semibold text-green-800">Matched Keywords</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {jobMatch.matchedKeywords.map(kw => (
              <span key={kw} className="inline-flex items-center px-2 py-1 rounded bg-white border border-green-200 text-xs font-medium text-green-700 shadow-sm">
                {kw}
              </span>
            ))}
          </div>
        </div>
        
        {/* Missing Keywords */}
        <div className="bg-red-50/50 rounded-xl p-4 border border-red-100">
          <div className="flex items-center gap-1.5 mb-3">
            <X className="w-4 h-4 text-red-500" />
            <h4 className="text-sm font-semibold text-red-800">Missing Keywords</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {jobMatch.missingKeywords.map(kw => (
              <span key={kw} className="inline-flex items-center px-2 py-1 rounded bg-white border border-red-200 text-xs font-medium text-red-700 shadow-sm opacity-80">
                {kw}
              </span>
            ))}
          </div>
        </div>
      </div>
    </ToolCard>
  );
}
