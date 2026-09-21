import React, { useEffect, useState } from 'react';
import { UserProfile } from '@/types';
import { Cpu, CheckCircle2, Rocket, Edit3 } from 'lucide-react';

interface StepCompletionOverlayProps {
  profile: UserProfile;
  onComplete: () => void;
  onEdit: () => void;
}

export default function StepCompletionOverlay({ profile, onComplete, onEdit }: StepCompletionOverlayProps) {
  const [generating, setGenerating] = useState(true);

  useEffect(() => {
    // Brief calibration animation
    const timer = setTimeout(() => {
      setGenerating(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-6 text-center gap-6">
      
      {/* Icon / Loader */}
      <div className="w-20 h-20 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center relative shadow-xs">
        {generating ? (
          <>
            <div className="absolute inset-0 border-3 border-blue-600/20 rounded-full"></div>
            <div className="absolute inset-0 border-3 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            <Cpu className="w-8 h-8 text-blue-600" />
          </>
        ) : (
          <CheckCircle2 className="w-10 h-10 text-emerald-600 animate-in zoom-in-75 duration-300" />
        )}
      </div>

      <div className="flex flex-col gap-1.5 max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          {generating ? 'Calibrating Roadmap Matrix...' : 'Profile Matrix Initialized'}
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          {generating 
            ? 'StudyHub Engine is mapping your skills against current industry benchmarks and structuring your personalized learning syllabus.'
            : 'Your roadmap has been successfully generated based on your academic baseline and target company archetypes.'}
        </p>
      </div>

      {/* Summary Box */}
      {!generating && (
        <div className="w-full bg-slate-50/80 border border-slate-200 rounded-xl p-5 flex flex-col gap-3.5 text-left animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <span className="text-xs font-mono font-semibold text-slate-600 uppercase tracking-wider">Calibration Summary</span>
            <button onClick={onEdit} className="text-blue-600 text-xs font-mono font-semibold uppercase tracking-wider hover:underline flex items-center gap-1">
              <Edit3 className="w-3 h-3" />
              Edit Parameters
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs">
            <div className="flex flex-col gap-0.5">
              <span className="font-mono text-slate-400 uppercase tracking-wider">Target Track</span>
              <span className="text-slate-900 font-medium">{profile.careerTracks[0] || 'Software Engineer'}</span>
            </div>
            
            <div className="flex flex-col gap-0.5">
              <span className="font-mono text-slate-400 uppercase tracking-wider">Drive Cycle</span>
              <span className="text-slate-900 font-medium">{profile.identity?.driveCycle}</span>
            </div>
            
            <div className="flex flex-col gap-0.5 sm:col-span-2">
              <span className="font-mono text-slate-400 uppercase tracking-wider">Target Archetypes</span>
              <span className="text-slate-900 font-medium">
                {profile.targets?.companies && profile.targets.companies.length > 0 ? profile.targets.companies.join(', ') : 'General Preparation'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="mt-2 w-full sm:w-auto">
        <button 
          onClick={onComplete}
          disabled={generating}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all ${
            generating
              ? 'bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md active:bg-blue-800 cursor-pointer'
          }`}
        >
          {generating ? 'Processing...' : 'Enter Dashboard'}
          {!generating && <Rocket className="w-4 h-4" />}
        </button>
      </div>
      
    </div>
  );
}
