'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle2, Circle, Clock, Search, BookOpen, PenLine } from 'lucide-react';
import { pfModules, PfItem } from '@/lib/data/programmingFundamentalsCatalog';
import { roadmapApi, PfItemProgress } from '@/lib/api/roadmaps';
import { ProgrammingItemModal } from './ProgrammingItemModal';

export const ProgrammingRoadmapView = () => {
  const [progress, setProgress] = useState<Record<string, PfItemProgress>>({});
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<PfItem | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set([pfModules[0].id]));
  
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const data = await roadmapApi.getProgrammingProgress();
      setProgress(data.progress || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  // Flatten items for stats
  const allItems = useMemo(() => pfModules.flatMap(m => m.items), []);
  const allExercises = useMemo(() => allItems.filter(i => i.type === 'exercise'), [allItems]);
  
  const totalExercises = allExercises.length;
  const solvedExercises = allExercises.filter(e => progress[e.id]?.status === 'solved' || progress[e.id]?.status === 'completed').length;
  
  const diffStats = useMemo(() => {
    const stats = { easy: { total: 0, solved: 0 }, medium: { total: 0, solved: 0 }, hard: { total: 0, solved: 0 } };
    allExercises.forEach(e => {
      if (e.type === 'exercise') {
        stats[e.difficulty].total++;
        if (progress[e.id]?.status === 'solved' || progress[e.id]?.status === 'completed') {
          stats[e.difficulty].solved++;
        }
      }
    });
    return stats;
  }, [progress, allExercises]);

  const toggleQuickStatus = async (e: React.MouseEvent, itemId: string, currentStatus: string, type: 'lesson' | 'exercise') => {
    e.stopPropagation();
    const solvedVal = type === 'lesson' ? 'completed' : 'solved';
    const newStatus = (currentStatus === 'solved' || currentStatus === 'completed') ? 'not_started' : solvedVal;
    
    const previousProgress = progress[itemId];
    
    setProgress(prev => ({ 
      ...prev, 
      [itemId]: { 
        ...(prev[itemId] || { notes: null, attempts: 0, solved_at: null, attempted_at: null }), 
        status: newStatus 
      } 
    })); // optimistic
    
    try {
      const res = await roadmapApi.updateProgrammingItemProgress(itemId, newStatus);
      if (res.progress) {
        setProgress(prev => ({ ...prev, [itemId]: res.progress }));
      }
    } catch (err) {
      console.error("Failed to update status", err);
      if (previousProgress) {
        setProgress(prev => ({ ...prev, [itemId]: previousProgress })); // rollback
      } else {
        setProgress(prev => {
          const next = { ...prev };
          delete next[itemId];
          return next;
        });
      }
    }
  };

  const handleModalUpdate = async (itemId: string, status?: string, notes?: string) => {
    const previousProgress = progress[itemId];
    
    // optimistic update
    setProgress(prev => {
      const existing = prev[itemId] || { status: 'not_started', notes: null, attempts: 0, solved_at: null, attempted_at: null };
      return {
        ...prev,
        [itemId]: {
          ...existing,
          ...(status !== undefined ? { status } : {}),
          ...(notes !== undefined ? { notes } : {})
        }
      };
    });
    
    try {
      const res = await roadmapApi.updateProgrammingItemProgress(itemId, status, notes);
      if (res.progress) {
        setProgress(prev => ({ ...prev, [itemId]: res.progress }));
      }
    } catch (err) {
      console.error(err);
      if (previousProgress) {
        setProgress(prev => ({ ...prev, [itemId]: previousProgress }));
      }
    }
  };

  const DifficultyStat = ({ label, solved, total, color }: { label: string, solved: number, total: number, color: string }) => (
    <div className="bg-white rounded-lg p-3 border border-slate-100 shadow-sm">
      <div className="flex items-center gap-2 mb-1.5">
        <div className={`w-2 h-2 rounded-full ${color}`}></div>
        <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{label}</div>
      </div>
      <div className="text-lg font-bold text-slate-900">{solved} <span className="text-sm font-medium text-slate-400">/ {total}</span></div>
    </div>
  );

  if (loading) {
    return <div className="p-12 text-center text-slate-500 font-medium">Loading roadmap...</div>;
  }

  const overallProgressPct = totalExercises > 0 ? Math.round((solvedExercises / totalExercises) * 100) : 0;
  const remainingExercises = totalExercises - solvedExercises;
  const estimatedDays = remainingExercises > 0 ? Math.ceil(remainingExercises / 5) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 border border-blue-100 text-blue-600 text-[11px] font-mono font-bold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              STAGE 01 OF 12 · FOUNDATION
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-500 text-xs font-mono">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Verified Placement Standard
            </span>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Programming Fundamentals</h1>
          <p className="text-slate-600 leading-relaxed text-[17px] mb-8">
            Master underlying memory models, basic syntax, pointers, data representations, and standard I/O semantics essential for building reliable code.
          </p>

          {/* Progress Card */}
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 shadow-sm flex flex-col gap-5">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[12px] font-bold text-slate-900 uppercase tracking-wider font-mono mb-1">Overall Stage Progress</div>
                <div className="text-[14px] font-medium text-slate-500 font-mono">
                  <span className="text-blue-600 font-semibold">{overallProgressPct}% Complete</span> ({solvedExercises} / {totalExercises} exercises completed)
                </div>
              </div>
              <div className="text-right">
                <div className="text-[12px] font-bold text-slate-900 uppercase tracking-wider font-mono mb-1">Target Velocity</div>
                <div className="text-[13px] font-medium text-slate-500 font-mono">5 exercises/day</div>
              </div>
            </div>
            
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-blue-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${overallProgressPct}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            
            <div className="flex justify-between items-center pt-2 border-t border-slate-200/60">
              <span className="text-[12px] font-bold text-slate-900 uppercase tracking-wider font-mono">
                Estimated Clearance
              </span>
              <span className="text-[13px] font-semibold text-amber-600 font-mono">
                {estimatedDays > 0 ? `${estimatedDays} Days Remaining` : "Foundation Mastered 🎉"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Practice & Labs Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm md:col-span-1 flex flex-col justify-center">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Practice Exercises</div>
          <div className="text-3xl font-bold text-slate-900">{totalExercises}</div>
        </div>
        <div className="md:col-span-3 grid grid-cols-3 gap-4">
          <DifficultyStat label="Easy" solved={diffStats.easy.solved} total={diffStats.easy.total} color="bg-green-500" />
          <DifficultyStat label="Medium" solved={diffStats.medium.solved} total={diffStats.medium.total} color="bg-amber-500" />
          <DifficultyStat label="Hard" solved={diffStats.hard.solved} total={diffStats.hard.total} color="bg-red-500" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center pt-2">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search concepts or exercises..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <select 
            value={difficultyFilter} 
            onChange={e => setDifficultyFilter(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            <option value="all">All Status</option>
            <option value="solved">Completed / Solved</option>
            <option value="attempted">Attempted</option>
            <option value="unsolved">Not Started</option>
          </select>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        {pfModules.map((module) => {
          
          // Apply filters
          const filteredItems = module.items.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  item.category.toLowerCase().includes(searchQuery.toLowerCase());
            
            let matchesDiff = true;
            if (difficultyFilter !== 'all') {
              if (item.type === 'lesson') matchesDiff = false;
              else matchesDiff = item.difficulty === difficultyFilter;
            }

            const s = progress[item.id]?.status || 'not_started';
            const matchesStatus = statusFilter === 'all' || 
              (statusFilter === 'solved' && (s === 'solved' || s === 'completed')) ||
              (statusFilter === 'attempted' && s === 'attempted') ||
              (statusFilter === 'unsolved' && s === 'not_started');
            
            return matchesSearch && matchesDiff && matchesStatus;
          });

          if (filteredItems.length === 0 && (searchQuery || difficultyFilter !== 'all' || statusFilter !== 'all')) {
            return null;
          }

          const moduleSolved = module.items.filter(i => {
            const s = progress[i.id]?.status;
            return s === 'solved' || s === 'completed';
          }).length;
          
          const isModuleCompleted = moduleSolved === module.items.length && module.items.length > 0;
          const isExpanded = expandedModules.has(module.id) || searchQuery.length > 0;

          return (
            <div key={module.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-slate-300 shadow-sm">
              <button 
                onClick={() => toggleModule(module.id)}
                className="w-full flex items-center justify-between p-5 sm:p-6 text-left bg-white hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold font-mono">
                    {module.numberStr}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">{module.title}</h3>
                    <div className="text-sm text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span>{module.items.length} Items</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span className={isModuleCompleted ? "text-green-600 font-medium" : ""}>
                        {moduleSolved} Completed
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {isModuleCompleted ? (
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider border border-green-200">
                      Completed
                    </span>
                  ) : moduleSolved > 0 ? (
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-200">
                      In Progress
                    </span>
                  ) : (
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider border border-slate-200">
                      Not Started
                    </span>
                  )}
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-slate-100">
                      <div className="grid grid-cols-1 divide-y divide-slate-100">
                        {filteredItems.map(item => {
                          const s = progress[item.id]?.status || 'not_started';
                          const isSolved = s === 'solved' || s === 'completed';
                          const isAttempted = s === 'attempted';
                          
                          return (
                            <div 
                              key={item.id}
                              onClick={() => setSelectedItem(item)}
                              className="group flex items-center justify-between p-4 sm:px-6 sm:py-5 hover:bg-slate-50/80 transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-4">
                                <button 
                                  onClick={(e) => toggleQuickStatus(e, item.id, s, item.type)}
                                  className="mt-0.5 text-slate-300 hover:scale-110 transition-transform flex-shrink-0"
                                >
                                  {isSolved ? (
                                    <CheckCircle2 className="w-6 h-6 text-green-500 fill-green-50" />
                                  ) : isAttempted ? (
                                    <Clock className="w-6 h-6 text-amber-500 fill-amber-50" />
                                  ) : (
                                    <Circle className="w-6 h-6 hover:text-blue-400" />
                                  )}
                                </button>
                                
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    {item.type === 'lesson' ? (
                                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded flex items-center gap-1">
                                        <BookOpen className="w-3 h-3" /> Lesson
                                      </span>
                                    ) : (
                                      <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                                        item.difficulty === 'easy' ? 'text-green-700 bg-green-50 border-green-200' : 
                                        item.difficulty === 'medium' ? 'text-amber-700 bg-amber-50 border-amber-200' : 
                                        'text-red-700 bg-red-50 border-red-200'
                                      }`}>
                                        {item.difficulty}
                                      </span>
                                    )}
                                    <span className="text-xs font-mono text-slate-400">#{item.order}</span>
                                  </div>
                                  <h4 className={`text-sm sm:text-base font-semibold transition-colors ${isSolved ? 'text-slate-600' : 'text-slate-900 group-hover:text-blue-600'}`}>
                                    {item.title}
                                  </h4>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Detail Modal Drawer */}
      <ProgrammingItemModal 
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        item={selectedItem}
        progress={selectedItem ? (progress[selectedItem.id] || null) : null}
        onUpdate={handleModalUpdate}
        onItemSelect={(id) => {
          const found = allItems.find(i => i.id === id);
          if (found) setSelectedItem(found);
        }}
      />
    </div>
  );
};
