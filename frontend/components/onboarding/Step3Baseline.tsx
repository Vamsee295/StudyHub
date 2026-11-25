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
        <h2 className="display text-[32px] md:text-[38px]">Your skills</h2>
        <p className="text-sm text-mute leading-relaxed">
          Rate where you are today. A rough guess is fine.
        </p>
      </div>

      <div className="flex flex-col border-[1.5px] border-hair rounded-xl overflow-hidden bg-card shadow-2xs">
        {/* Header row */}
        <div className="hidden md:grid grid-cols-12 gap-4 bg-paper-2/80 px-4 py-3 border-b border-hair text-xs font-mono font-semibold uppercase tracking-wider text-mute">
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
              index !== SKILLS.length - 1 ? 'border-b border-hair' : ''
            } hover:bg-paper-2/50 transition-colors`}
          >
            <div className="col-span-1 md:col-span-5 flex flex-col">
              <span className="text-sm font-semibold text-ink">{skill.title}</span>
              <span className="text-xs text-mute">{skill.desc}</span>
            </div>
            
            <div className="col-span-1 md:col-span-7 flex justify-between items-center bg-card-2/90 rounded-lg p-1 gap-1">
              {LEVELS.map(level => {
                const isSelected = data[skill.key] === level;
                return (
                  <button
                    key={level}
                    onClick={() => update({ [skill.key]: level })}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                      isSelected 
                        ? 'bg-accent text-paper font-semibold shadow-xs' 
                        : 'text-body hover:text-ink hover:bg-card/60'
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
      
      <div className="bg-accent-soft/70 border border-accent-line/80 rounded-xl p-4 flex gap-3 items-start">
        <Info className="w-4 h-4 text-accent-ink shrink-0 mt-0.5" />
        <p className="text-xs text-body leading-relaxed">
          <strong className="text-ink">Don&apos;t overthink it.</strong> You can change these any time from your profile.
        </p>
      </div>
    </div>
  );
}
