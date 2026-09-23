import React from 'react';
import { ResumeAnalysisResult } from '@/lib/services/tools/resumeService';
import { ToolCard } from '@/components/tools/shared/ToolCard';
import { LayoutTemplate, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResumeStructureAuditProps {
  sections: ResumeAnalysisResult['detectedSections'];
}

export function ResumeStructureAudit({ sections }: ResumeStructureAuditProps) {
  const allSections = [
    { key: 'contact', label: 'Contact Info', required: true },
    { key: 'summary', label: 'Professional Summary', required: false },
    { key: 'education', label: 'Education', required: true },
    { key: 'skills', label: 'Skills', required: true },
    { key: 'projects', label: 'Projects', required: true },
    { key: 'experience', label: 'Work Experience', required: false },
    { key: 'certifications', label: 'Certifications', required: false },
  ] as const;

  return (
    <ToolCard className="h-full">
      <div className="flex items-center gap-2 mb-6">
        <LayoutTemplate className="w-5 h-5 text-indigo-500" />
        <h3 className="font-semibold text-gray-900">Structure Audit</h3>
      </div>
      
      <div className="space-y-3">
        {allSections.map(({ key, label, required }) => {
          const isDetected = sections[key];
          
          return (
            <div 
              key={key} 
              className={cn(
                "flex items-center justify-between p-3 rounded-xl border",
                isDetected ? "bg-gray-50 border-gray-100" : "bg-red-50/50 border-red-100/50"
              )}
            >
              <div className="flex items-center gap-3">
                {isDetected ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                <div>
                  <p className={cn(
                    "font-medium text-sm",
                    isDetected ? "text-gray-900" : "text-gray-700"
                  )}>
                    {label}
                  </p>
                  {!isDetected && required && (
                    <p className="text-xs text-red-600 mt-0.5">Missing Required Section</p>
                  )}
                  {!isDetected && !required && (
                    <p className="text-xs text-amber-600 mt-0.5">Recommended Section</p>
                  )}
                </div>
              </div>
              
              {isDetected && (
                <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded uppercase tracking-wider">
                  Detected
                </span>
              )}
            </div>
          );
        })}
      </div>
    </ToolCard>
  );
}
