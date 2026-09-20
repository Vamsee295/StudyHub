import React from 'react';
import { UserTargets } from '@/types';
import { Check, AlertCircle } from 'lucide-react';

interface Step4TargetsProps {
  data: UserTargets;
  update: (updates: Partial<UserTargets>) => void;
}

export default function Step4Targets({ data, update }: Step4TargetsProps) {
  const OBJECTIVES = [
    'Campus Placements',
    'Off-Campus Recruitment',
    'Internship Hunting',
    'Upskilling / Learning',
    'Switching Career Domain'
  ];

  const POPULAR_COMPANIES = [
    'TCS / Infosys (Mass)',
    'Cognizant / Wipro (Mass)',
    'Accenture (Mass)',
    'Amazon (Product)',
    'Microsoft (Product)',
    'Google (Product)',
    'Atlassian (Product)',
    'JPMorgan (FinTech)',
    'Goldman Sachs (FinTech)',
    'Startups (Series A/B)'
  ];

  const toggleObjective = (obj: string) => {
    if (data.objectives.includes(obj)) {
      update({ objectives: data.objectives.filter(o => o !== obj) });
    } else {
      update({ objectives: [...data.objectives, obj] });
    }
  };

  const toggleCompany = (company: string) => {
    if (data.companies.includes(company)) {
      update({ companies: data.companies.filter(c => c !== company) });
    } else {
      update({ companies: [...data.companies, company] });
    }
  };

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Target Placement Matrix</h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          What are your immediate goals and target employers? We'll tailor the interview practice modules based on this.
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-600">
          Primary Objectives <span className="text-blue-600">*</span> (Select all that apply)
        </label>
        <div className="flex flex-wrap gap-2.5">
          {OBJECTIVES.map(obj => {
            const isSelected = data.objectives.includes(obj);
            return (
              <button
                key={obj}
                onClick={() => toggleObjective(obj)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  isSelected 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
                type="button"
              >
                {obj}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <div>
          <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-600">
            Target Company Archetypes
          </label>
          <p className="text-xs text-slate-400 mt-0.5">
            Select archetypes to sync specific interview patterns into your workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 mt-1">
          {POPULAR_COMPANIES.map(company => {
            const isSelected = data.companies.includes(company);
            return (
              <button
                key={company}
                onClick={() => toggleCompany(company)}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                  isSelected 
                    ? 'bg-blue-50/70 border-blue-400 text-blue-900 font-medium shadow-2xs' 
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/60'
                }`}
                type="button"
              >
                <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 transition-colors ${
                  isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                }`}>
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span className="text-xs leading-snug truncate">{company}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      {data.objectives.length === 0 && (
        <p className="text-red-600 text-xs font-mono flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          Please select at least one primary objective.
        </p>
      )}
    </div>
  );
}
