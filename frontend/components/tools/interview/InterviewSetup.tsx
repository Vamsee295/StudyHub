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
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <Settings className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Configure Interview</h2>
          <p className="text-gray-500 text-sm">Customize your mock interview session</p>
        </div>
      </div>

      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Target className="w-4 h-4 text-gray-400" /> Domain / Topic
          </label>
          <div className="flex flex-wrap gap-2">
            {domains.map(d => (
              <button
                key={d}
                onClick={() => setDomain(d)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  domain === d 
                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-gray-400" /> Number of Questions
          </label>
          <div className="flex items-center gap-4">
            <input 
              type="range" 
              min="1" max="10" 
              value={count} 
              onChange={(e) => setCount(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="w-12 text-center font-bold text-gray-900 bg-gray-100 py-1 rounded-md">{count}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Target className="w-4 h-4 text-gray-400" /> Target Company Style (Optional)
          </label>
          <select 
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full bg-white border border-gray-200 text-gray-700 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 transition-colors"
          >
            {companies.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={() => onStart({ domain, count, company })}
        className="w-full bg-blue-600 text-white rounded-xl py-3.5 font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
      >
        <Play className="w-5 h-5 fill-current" />
        Start Interview Session
      </button>
    </ToolCard>
  );
}
