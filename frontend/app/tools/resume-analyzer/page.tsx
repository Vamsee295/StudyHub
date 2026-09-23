"use client";

import React, { useState } from 'react';
import { FileSearch, RotateCcw } from 'lucide-react';
import { ToolWorkspaceHeader } from '@/components/tools/shared/ToolWorkspaceHeader';
import { ResumeDropzone } from '@/components/tools/resume/ResumeDropzone';
import { ResumeScoreSummary } from '@/components/tools/resume/ResumeScoreSummary';
import { ResumeStructureAudit } from '@/components/tools/resume/ResumeStructureAudit';
import { ResumeSkillsDetected } from '@/components/tools/resume/ResumeSkillsDetected';
import { ResumeSuggestionsList } from '@/components/tools/resume/ResumeSuggestionsList';
import { ResumeJobMatch } from '@/components/tools/resume/ResumeJobMatch';
import { analyzeResumeMock, ResumeAnalysisResult } from '@/lib/services/tools/resumeService';

export default function ResumeAnalyzerPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ResumeAnalysisResult | null>(null);

  const handleAnalyze = async (file: File | null) => {
    setIsAnalyzing(true);
    const analysisResult = await analyzeResumeMock(file);
    setResult(analysisResult);
    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto h-full flex flex-col">
        <ToolWorkspaceHeader
          title="Resume Analyzer"
          description="Instantly evaluate your resume against typical ATS (Applicant Tracking Systems) to optimize your chances of getting shortlisted."
          badge="ATS Scanner"
          icon={<FileSearch className="w-5 h-5" />}
          actions={
            result && (
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Analyze Another
              </button>
            )
          }
        />

        {!result ? (
          <div className="flex-1 flex items-center justify-center min-h-[500px]">
            <div className="w-full max-w-2xl">
              <ResumeDropzone onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            <ResumeScoreSummary result={result} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResumeStructureAudit sections={result.detectedSections} />
              <ResumeSkillsDetected skills={result.detectedSkills} />
            </div>
            
            <ResumeSuggestionsList suggestions={result.suggestions} />
            <ResumeJobMatch jobMatch={result.jobMatch} />
          </div>
        )}
      </div>
    </div>
  );
}
