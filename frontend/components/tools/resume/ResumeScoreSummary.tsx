import React from 'react';
import { ResumeAnalysisResult } from '@/lib/services/tools/resumeService';
import { ToolCard } from '@/components/tools/shared/ToolCard';
import { Trophy, FileCheck2, Target, Type, Sparkles, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResumeScoreSummaryProps {
  result: ResumeAnalysisResult;
}

export function ResumeScoreSummary({ result }: ResumeScoreSummaryProps) {
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getStrokeColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (result.overallScore / 100) * circumference;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
      {/* Overall Score Circle */}
      <ToolCard className="md:col-span-4 flex flex-col items-center justify-center text-center p-8">
        <h3 className="font-semibold text-gray-700 mb-6 uppercase tracking-wider text-sm">Overall ATS Score</h3>
        
        <div className="relative w-40 h-40 flex items-center justify-center mb-4">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="stroke-gray-100 fill-none"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className={cn("fill-none transition-all duration-1000 ease-out", getStrokeColor(result.overallScore))}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-gray-900">{result.overallScore}</span>
            <span className="text-sm text-gray-500">/ 100</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 max-w-[200px]">
          {result.overallScore >= 80 ? 'Excellent! Your resume is highly ATS-friendly.' : 
           result.overallScore >= 60 ? 'Good, but needs some improvements to pass ATS.' : 
           'Needs significant work to get past automated filters.'}
        </p>
      </ToolCard>

      {/* Detail Metrics */}
      <ToolCard className="md:col-span-8 p-6">
        <h3 className="font-semibold text-gray-700 mb-6 uppercase tracking-wider text-sm">Score Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          
          <MetricCard 
            title="ATS Compatibility" 
            score={result.atsCompatibility} 
            icon={<FileCheck2 className="w-4 h-4" />}
            colorClass={getScoreColor(result.atsCompatibility)}
          />
          <MetricCard 
            title="Keyword Coverage" 
            score={result.keywordCoverage} 
            icon={<Target className="w-4 h-4" />}
            colorClass={getScoreColor(result.keywordCoverage)}
          />
          <MetricCard 
            title="Skills Match" 
            score={result.skillsMatch} 
            icon={<Trophy className="w-4 h-4" />}
            colorClass={getScoreColor(result.skillsMatch)}
          />
          <MetricCard 
            title="Formatting" 
            score={result.formatting} 
            icon={<Type className="w-4 h-4" />}
            colorClass={getScoreColor(result.formatting)}
          />
          <MetricCard 
            title="Project Strength" 
            score={result.projectStrength} 
            icon={<Sparkles className="w-4 h-4" />}
            colorClass={getScoreColor(result.projectStrength)}
          />
          <MetricCard 
            title="Experience Depth" 
            score={result.experienceDepth} 
            icon={<Briefcase className="w-4 h-4" />}
            colorClass={getScoreColor(result.experienceDepth)}
          />

        </div>
      </ToolCard>
    </div>
  );
}

function MetricCard({ title, score, icon, colorClass }: { title: string, score: number, icon: React.ReactNode, colorClass: string }) {
  return (
    <div className={cn("p-4 rounded-xl border flex flex-col items-start gap-3", colorClass.replace('text-', 'border-').replace('600', '200').replace('bg-', 'bg-opacity-50 bg-'))}>
      <div className="flex items-center gap-2">
        <div className={cn("p-1.5 rounded-md bg-white shadow-sm", colorClass.split(' ')[0])}>
          {icon}
        </div>
        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">{title}</span>
      </div>
      <div className="flex items-end gap-1">
        <span className={cn("text-2xl font-bold", colorClass.split(' ')[0])}>{score}</span>
        <span className="text-sm font-medium opacity-70 mb-1">/ 100</span>
      </div>
    </div>
  );
}
