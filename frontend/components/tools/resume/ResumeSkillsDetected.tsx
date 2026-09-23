import React from 'react';
import { ResumeAnalysisResult } from '@/lib/services/tools/resumeService';
import { ToolCard } from '@/components/tools/shared/ToolCard';
import { Cpu } from 'lucide-react';

interface ResumeSkillsDetectedProps {
  skills: ResumeAnalysisResult['detectedSkills'];
}

export function ResumeSkillsDetected({ skills }: ResumeSkillsDetectedProps) {
  const categories = [
    { key: 'programming', label: 'Languages', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { key: 'frameworks', label: 'Frameworks & Libs', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { key: 'databases', label: 'Databases', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { key: 'cloud', label: 'Cloud & DevOps', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { key: 'tools', label: 'Tools', color: 'bg-gray-50 text-gray-700 border-gray-200' },
  ] as const;

  return (
    <ToolCard className="h-full">
      <div className="flex items-center gap-2 mb-6">
        <Cpu className="w-5 h-5 text-teal-500" />
        <h3 className="font-semibold text-gray-900">Extracted Skills</h3>
      </div>
      
      <div className="space-y-5">
        {categories.map(({ key, label, color }) => {
          const categorySkills = skills[key];
          if (!categorySkills || categorySkills.length === 0) return null;
          
          return (
            <div key={key}>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{label}</h4>
              <div className="flex flex-wrap gap-2">
                {categorySkills.map(skill => (
                  <span 
                    key={skill}
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${color}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </ToolCard>
  );
}
