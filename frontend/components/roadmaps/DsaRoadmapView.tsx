'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle2, Circle, Clock, Search } from 'lucide-react';
import { dsaCatalog, DSA_STAGES, DsaProblem } from '@/lib/data/dsaCatalog';
import { roadmapApi, DsaProblemProgress } from '@/lib/api/roadmaps';
import { DsaProblemDetailModal } from './DsaProblemDetailModal';

export const DsaRoadmapView = () => {
  const [progress, setProgress] = useState<Record<number, DsaProblemProgress>>({});
  const [loading, setLoading] = useState(true);
  const [selectedProblem, setSelectedProblem] = useState<DsaProblem | null>(null);
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set([DSA_STAGES[0]]));
  
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    roadmapApi
      .getDsaProgress()
      .then((data) => setProgress(data.progress || {}))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (problemId: number, newStatus?: string, newNotes?: string) => {
    // Optimistic update
    setProgress(prev => {
      const existing = prev[problemId] || { status: 'not_started', notes: null, attempts: 0, solved_at: null, attempted_at: null };
      return {
        ...prev,
        [problemId]: {
          ...existing,
          ...(newStatus !== undefined ? { status: newStatus } : {}),
          ...(newNotes !== undefined ? { notes: newNotes } : {})
        }
      };
    });
    
    // API call happens in the modal, but if we need a sync here we can.
    // Wait, the modal already calls `roadmapApi.updateDsaProblemProgress`. 
    // We can just rely on the data returned if we want.
    // Let's ensure the backend returns the updated progress object.
  };

  const toggleStage = (stage: string) => {
    setExpandedStages(prev => {
      const next = new Set(prev);
      if (next.has(stage)) next.delete(stage);
      else next.add(stage);
      return next;
    });
  };

  // Unique problems for overall progress
  const uniqueProblems = useMemo(() => {
    const map = new Map<number, DsaProblem>();
    dsaCatalog.forEach(p => map.set(p.id, p));
    return Array.from(map.values());
  }, []);

  const totalProblems = uniqueProblems.length;
  const solvedCount = Object.values(progress).filter(p => p.status === 'solved').length;
  
  const diffStats = useMemo(() => {
    const stats = { easy: { total: 0, solved: 0 }, medium: { total: 0, solved: 0 }, hard: { total: 0, solved: 0 } };
    uniqueProblems.forEach(p => {
      stats[p.difficulty].total++;
      if (progress[p.id]?.status === 'solved') stats[p.difficulty].solved++;
    });
    return stats;
  }, [progress, uniqueProblems]);

  const toggleQuickSolve = async (e: React.MouseEvent, problemId: number, currentStatus: string) => {
    e.stopPropagation();
    const newStatus = currentStatus === 'solved' ? 'not_started' : 'solved';
    
    const previousProgress = progress[problemId];
    
    setProgress(prev => ({ 
      ...prev, 
      [problemId]: { 
        ...(prev[problemId] || { notes: null, attempts: 0, solved_at: null, attempted_at: null }), 
        status: newStatus 
      } 
    })); // optimistic
    
    try {
      const res = await roadmapApi.updateDsaProblemProgress(problemId, newStatus);
      if (res.progress) {
        setProgress(prev => ({ ...prev, [problemId]: res.progress }));
      }
    } catch {
      if (previousProgress) {
        setProgress(prev => ({ ...prev, [problemId]: previousProgress })); // rollback
      } else {
        setProgress(prev => {
          const next = { ...prev };
          delete next[problemId];
          return next;
        });
      }
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-mute font-medium">Loading roadmap...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header section */}
      <div className="bg-card rounded-2xl border border-hair p-8">
        <div className="max-w-3xl">
          <p className="eyebrow mb-3">Roadmap · DSA</p>
          <h1 className="display mb-4 text-[36px] md:text-[44px]">Data structures &amp; algorithms</h1>
          <p className="text-body leading-relaxed text-lg mb-8">
            The data structures and problem patterns that technical interviews ask about most.
          </p>

          {/* Progress Card */}
          <div className="bg-paper-2 rounded-xl p-6 border border-hair">
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="text-sm font-medium text-mute mb-1">Overall Progress</div>
                <div className="text-3xl font-bold text-ink">{solvedCount} <span className="text-mute text-xl font-medium">/ {totalProblems}</span></div>
              </div>
              <div className="text-sm font-semibold text-accent-ink">
                {Math.round((solvedCount / totalProblems) * 100 || 0)}% Completed
              </div>
            </div>
            
            <div className="h-3 w-full bg-ink/10 rounded-full overflow-hidden mb-6">
              <motion.div 
                className="h-full bg-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(solvedCount / totalProblems) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <DifficultyStat label="Easy" solved={diffStats.easy.solved} total={diffStats.easy.total} color="bg-note" />
              <DifficultyStat label="Medium" solved={diffStats.medium.solved} total={diffStats.medium.total} color="bg-gold" />
              <DifficultyStat label="Hard" solved={diffStats.hard.solved} total={diffStats.hard.total} color="bg-danger" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mute" />
          <input 
            type="text"
            placeholder="Search problems or patterns..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-card border border-hair rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
          />
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <select 
            value={difficultyFilter} 
            onChange={e => setDifficultyFilter(e.target.value)}
            className="px-4 py-3 bg-card border border-hair rounded-xl text-sm font-medium text-body outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-card border border-hair rounded-xl text-sm font-medium text-body outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">All Status</option>
            <option value="solved">Solved</option>
            <option value="attempted">Attempted</option>
            <option value="unsolved">Unsolved</option>
          </select>
        </div>
      </div>

      {/* Stages List */}
      <div className="space-y-4">
        {DSA_STAGES.map((stage, idx) => {
          const stageProblems = dsaCatalog.filter(p => p.primaryTopic === stage);
          
          // Apply filters
          const filteredProblems = stageProblems.filter(p => {
            const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesDiff = difficultyFilter === 'all' || p.difficulty === difficultyFilter;
            const s = progress[p.id]?.status || 'not_started';
            const matchesStatus = statusFilter === 'all' || 
              (statusFilter === 'solved' && s === 'solved') ||
              (statusFilter === 'attempted' && s === 'attempted') ||
              (statusFilter === 'unsolved' && s === 'not_started');
            
            return matchesSearch && matchesDiff && matchesStatus;
          });

          if (filteredProblems.length === 0 && (searchQuery || difficultyFilter !== 'all' || statusFilter !== 'all')) {
            return null;
          }

          const stageSolved = stageProblems.filter(p => progress[p.id]?.status === 'solved').length;
          const isExpanded = expandedStages.has(stage) || searchQuery.length > 0;

          return (
            <div key={stage} className="bg-card border border-hair rounded-2xl overflow-hidden transition-all hover:border-ink/25">
              <button 
                onClick={() => toggleStage(stage)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left bg-card hover:bg-paper-2 transition-colors"
              >
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-card-2 border border-hair flex items-center justify-center text-mute font-bold font-mono">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-ink">{stage}</h3>
                    <div className="text-sm text-mute mt-1 flex items-center gap-3">
                      <span>{stageProblems.length} Problems</span>
                      <span className="w-1 h-1 rounded-full bg-ink/20"></span>
                      <span className={stageSolved === stageProblems.length ? "text-note font-medium" : ""}>
                        {stageSolved} Solved
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:block text-sm font-medium text-accent-ink">
                    {isExpanded ? 'Hide Problems' : 'View Problems'}
                  </div>
                  <ChevronDown className={`w-5 h-5 text-mute transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-hair bg-paper-2/50"
                  >
                    <div className="p-4 sm:p-6 space-y-3">
                      {filteredProblems.map(problem => {
                        const s = progress[problem.id]?.status || 'not_started';
                        return (
                          <div 
                            key={problem.id}
                            onClick={() => setSelectedProblem(problem)}
                            className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-card border border-hair rounded-xl hover:border-accent-line hover:shadow-sm transition-all cursor-pointer gap-4"
                          >
                            <div className="flex items-start sm:items-center gap-4">
                              <button 
                                onClick={(e) => toggleQuickSolve(e, problem.id, s)}
                                className="mt-1 sm:mt-0 flex-shrink-0 relative focus:outline-none group/btn"
                              >
                                {s === 'solved' ? (
                                  <CheckCircle2 className="w-6 h-6 text-note transition-transform group-hover/btn:scale-110" />
                                ) : s === 'attempted' ? (
                                  <Clock className="w-6 h-6 text-gold transition-transform group-hover/btn:scale-110" />
                                ) : (
                                  <Circle className="w-6 h-6 text-ink/30 group-hover/btn:text-accent transition-colors" />
                                )}
                              </button>
                              
                              <div>
                                <div className="flex items-center gap-3 mb-1">
                                  <span className="text-sm font-mono text-mute">#{problem.id}</span>
                                  <h4 className="font-semibold text-ink group-hover:text-accent-ink transition-colors">{problem.title}</h4>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <DifficultyBadge difficulty={problem.difficulty} />
                                  <span className="hidden sm:inline-flex px-2 py-0.5 bg-card-2 text-body text-xs font-medium rounded">
                                    {problem.timeComplexity}
                                  </span>
                                  {problem.tags.slice(0, 2).map(t => (
                                    <span key={t} className="text-xs text-mute">{t}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-accent-ink opacity-0 group-hover:opacity-100 transition-opacity">
                              View Details &rarr;
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      <DsaProblemDetailModal 
        isOpen={!!selectedProblem}
        onClose={() => setSelectedProblem(null)}
        problem={selectedProblem}
        progress={selectedProblem ? (progress[selectedProblem.id] || null) : null}
        onUpdate={async (problemId, status, notes) => {
          handleStatusUpdate(problemId, status, notes);
          try {
            const res = await roadmapApi.updateDsaProblemProgress(problemId, status, notes);
            if (res.progress) {
              setProgress(prev => ({ ...prev, [problemId]: res.progress }));
            }
          } catch (error) {
            console.error('Failed API call in modal update', error);
          }
        }}
        onProblemSelect={(id) => setSelectedProblem(dsaCatalog.find(p => p.id === id) || null)}
      />
    </div>
  );
};

const DifficultyStat = ({ label, solved, total, color }: { label: string, solved: number, total: number, color: string }) => (
  <div className="flex items-center gap-3 bg-card p-3 rounded-lg border border-hair">
    <div className={`w-2 h-2 rounded-full ${color}`} />
    <div className="flex-1">
      <div className="text-xs font-medium text-mute uppercase">{label}</div>
      <div className="text-sm font-bold text-ink">{solved} <span className="text-mute font-normal">/ {total}</span></div>
    </div>
  </div>
);

const DifficultyBadge = ({ difficulty }: { difficulty: string }) => {
  const colors = {
    easy: 'text-note bg-success-soft border-success-line',
    medium: 'text-warning bg-warning-soft border-warning-line',
    hard: 'text-danger bg-danger-soft border-danger-line'
  };
  return (
    <span className={`px-2 py-0.5 text-[11px] font-bold uppercase rounded border ${colors[difficulty as keyof typeof colors]}`}>
      {difficulty}
    </span>
  );
};
