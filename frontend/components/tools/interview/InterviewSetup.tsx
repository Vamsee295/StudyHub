import React, { useState } from 'react';
import { Settings, Play, Target, ListOrdered } from 'lucide-react';
import { ToolCard } from '@/components/tools/shared/ToolCard';

interface InterviewSetupProps {
  onStart: (config: { domain: string; count: number; company: string }) => void;
}

export function InterviewSetup({ onStart }: InterviewSetupProps) {
  const [domain, setDomain] = useState('All');
  const [count, setCount] = useState(3);
  const [company, setCompany] = useState('Any');

  const domains = ['All', 'Java', 'SQL', 'DSA', 'System Design', 'HR'];
  const companies = ['Any', 'TCS', 'Infosys', 'Deloitte', 'Google', 'Amazon'];

  return (
    <ToolCard className="max-w-2xl mx-auto p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-accent-soft rounded-xl flex items-center justify-center">
          <Settings className="w-6 h-6 text-accent-ink" />
        </div>
        <div>
          <h2 className="label-cond text-[22px]">Set up your interview</h2>
          <p className="text-mute text-sm">Customize your mock interview session</p>
        </div>
      </div>

      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-body mb-2 flex items-center gap-2">
            <Target className="w-4 h-4 text-mute" /> Domain / Topic
          </label>
          <div className="flex flex-wrap gap-2">
            {domains.map(d => (
              <button
                key={d}
                onClick={() => setDomain(d)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  domain === d 
                    ? 'bg-accent-soft border-accent-line text-accent-ink' 
                    : 'bg-card border-hair text-body hover:bg-card-2'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-body mb-2 flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-mute" /> Number of Questions
          </label>
          <div className="flex items-center gap-4">
            <input 
              type="range" 
              min="1" max="10" 
              value={count} 
              onChange={(e) => setCount(Number(e.target.value))}
              className="flex-1 h-2 bg-ink/10 rounded-lg appearance-none cursor-pointer accent-accent-ink"
            />
            <span className="w-12 text-center font-bold text-ink bg-card-2 py-1 rounded-md">{count}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-body mb-2 flex items-center gap-2">
            <Target className="w-4 h-4 text-mute" /> Target Company Style (Optional)
          </label>
          <select 
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full bg-card border-[1.5px] border-hair text-body rounded-lg px-4 py-2.5 outline-none focus:border-accent transition-colors"
          >
            {companies.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={() => onStart({ domain, count, company })}
        className="w-full bg-accent text-paper rounded-xl py-3.5 font-bold hover:bg-accent transition-all flex items-center justify-center gap-2 hover:shadow-[4px_5px_0_var(--hard)]"
      >
        <Play className="w-5 h-5 fill-current" />
        Start Interview Session
      </button>
    </ToolCard>
  );
}
