import React from 'react';
import { SkillBaseline } from '@/types';
import { Info } from 'lucide-react';

interface Step3BaselineProps {
  data: SkillBaseline;
  update: (updates: Partial<SkillBaseline>) => void;
}

export default function Step3Baseline({ data, update }: Step3BaselineProps) {
  const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
  
  const SKILLS: { key: keyof SkillBaseline, title: string, desc: string }[] = [
    { key: 'programming', title: 'Programming & OOP', desc: 'Syntax, classes, memory, debugging.' },
    { key: 'dsa', title: 'Data Structures & Algorithms', desc: 'Arrays, Trees, Graphs, DP.' },
    { key: 'sql', title: 'SQL & Databases', desc: 'Queries, joins, normalization.' },
    { key: 'coreCS', title: 'Core CS Subjects', desc: 'OS, DBMS, Computer Networks.' },
    { key: 'aptitude', title: 'Quantitative Aptitude', desc: 'Math, reasoning, verbal logic.' }
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Skill Baseline Diagnostics</h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          Rate your current proficiency truthfully. We use this to bypass redundant introductory content.
        </p>
      </div>

      <div className="flex flex-col border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
        {/* Header row */}
        <div className="hidden md:grid grid-cols-12 gap-4 bg-slate-50/80 px-4 py-3 border-b border-slate-200 text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">
          <div className="col-span-5">Competency Domain</div>
          <div className="col-span-7 flex justify-between px-3 text-center">
            <span className="w-1/3">Beginner</span>
            <span className="w-1/3">Intermediate</span>
            <span className="w-1/3">Advanced</span>
          </div>
        </div>

        {/* Rows */}
        {SKILLS.map((skill, index) => (
          <div 
            key={skill.key} 
            className={`grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center ${
              index !== SKILLS.length - 1 ? 'border-b border-slate-100' : ''
            } hover:bg-slate-50/50 transition-colors`}
          >
            <div className="col-span-1 md:col-span-5 flex flex-col">
              <span className="text-sm font-semibold text-slate-900">{skill.title}</span>
              <span className="text-xs text-slate-500">{skill.desc}</span>
            </div>
            
            <div className="col-span-1 md:col-span-7 flex justify-between items-center bg-slate-100/90 rounded-lg p-1 gap-1">
              {LEVELS.map(level => {
                const isSelected = data[skill.key] === level;
                return (
                  <button
                    key={level}
                    onClick={() => update({ [skill.key]: level })}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                      isSelected 
                        ? 'bg-blue-600 text-white font-semibold shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                    type="button"
                  >
                    <span>{level}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4 flex gap-3 items-start">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 leading-relaxed">
          <strong className="text-slate-800">Don't worry about being perfect here.</strong> As you complete practice problems, Pathward Engine will continuously re-calibrate your actual proficiency level.
        </p>
      </div>
    </div>
  );
}
