import React from 'react';
import { 
  Code2, 
  Sparkles, 
  Cloud, 
  Shield, 
  Kanban, 
  BarChart3, 
  AlertCircle,
  Check
} from 'lucide-react';

interface Step2CareerProps {
  data: string[];
  update: (tracks: string[]) => void;
}

export default function Step2Career({ data, update }: Step2CareerProps) {
  const CAREER_TRACKS = [
    {
      id: 'Software Engineer',
      title: 'Software Engineer',
      desc: 'Full-stack, frontend, backend, or generalist SDE roles.',
      icon: Code2,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      id: 'Data Scientist',
      title: 'Data Scientist / ML Engineer',
      desc: 'Machine learning, predictive models, data pipelines.',
      icon: Sparkles,
      color: 'text-violet-600 bg-violet-50'
    },
    {
      id: 'Cloud & DevOps',
      title: 'Cloud & DevOps Engineer',
      desc: 'AWS/Azure, CI/CD, Kubernetes, Infrastructure.',
      icon: Cloud,
      color: 'text-sky-600 bg-sky-50'
    },
    {
      id: 'Cybersecurity',
      title: 'Cybersecurity Analyst',
      desc: 'Network security, ethical hacking, SOC analysis.',
      icon: Shield,
      color: 'text-emerald-600 bg-emerald-50'
    },
    {
      id: 'Product Manager',
      title: 'Product Manager',
      desc: 'Strategy, user research, wireframing, agile delivery.',
      icon: Kanban,
      color: 'text-amber-600 bg-amber-50'
    },
    {
      id: 'Data Analyst',
      title: 'Data Analyst',
      desc: 'SQL, Tableau/PowerBI, reporting, business intelligence.',
      icon: BarChart3,
      color: 'text-indigo-600 bg-indigo-50'
    }
  ];

  const toggleTrack = (trackId: string) => {
    if (data.includes(trackId)) {
      update(data.filter(t => t !== trackId));
    } else {
      // Limit to 2 primary tracks for focus
      if (data.length < 2) {
        update([...data, trackId]);
      } else {
        update([data[1], trackId]); // keep last 2
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Select Target Career Tracks</h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          Select up to 2 primary tracks. We'll prioritize these skills in your learning roadmap and practice modules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-1">
        {CAREER_TRACKS.map(track => {
          const isSelected = data.includes(track.id);
          const IconComponent = track.icon;
          
          return (
            <button
              key={track.id}
              onClick={() => toggleTrack(track.id)}
              className={`flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all relative ${
                isSelected 
                  ? 'bg-blue-50/60 border-blue-500 ring-1 ring-blue-500/20 shadow-xs' 
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
              }`}
              type="button"
            >
              <div className={`p-2.5 rounded-lg shrink-0 ${track.color}`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="flex flex-col pr-6">
                <span className={`text-sm font-semibold ${isSelected ? 'text-blue-900 font-bold' : 'text-slate-900'}`}>
                  {track.title}
                </span>
                <span className="text-xs text-slate-500 mt-1 leading-normal">
                  {track.desc}
                </span>
              </div>
              
              {/* Checked Indicator */}
              <div className={`absolute top-4 right-4 w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 bg-slate-50'
              }`}>
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>
      
      {data.length === 0 && (
        <p className="text-red-600 text-xs font-mono flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          Please select at least one track to proceed.
        </p>
      )}
    </div>
  );
}
