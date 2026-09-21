import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DsaProblem, dsaCatalog } from '@/lib/data/dsaCatalog';
import { roadmapApi } from '@/lib/api/roadmaps';
import { CheckCircle2, Clock, ExternalLink, X, HelpCircle, Code, Server, XCircle, ChevronRight, PenLine, Target, BookOpen } from 'lucide-react';

import { DsaProblemProgress } from '@/lib/api/roadmaps';

interface DsaProblemDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  problem: DsaProblem | null;
  progress: DsaProblemProgress | null;
  onUpdate: (problemId: number, status?: string, notes?: string) => Promise<void>;
  onProblemSelect?: (problemId: number) => void;
}

export const DsaProblemDetailModal: React.FC<DsaProblemDetailModalProps> = ({
  isOpen, onClose, problem, progress, onUpdate, onProblemSelect
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [note, setNote] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  // Reset local state when problem changes (must be before any early return)
  React.useEffect(() => {
    if (problem) {
      setShowHint(false);
      setNote(progress?.notes || "");
    }
  }, [problem, progress?.notes]);

  if (!problem) return null;

  const handleStatusUpdate = async (newStatus: string) => {
    if (!problem || isUpdating) return;
    try {
      setIsUpdating(true);
      await onUpdate(problem.id, newStatus, undefined);
    } catch (error) {
      console.error('Failed to update status', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNoteChange = (newNote: string) => {
    setNote(newNote);
    if (saveTimeout) clearTimeout(saveTimeout);
    
    // Debounce save
    const timeout = setTimeout(async () => {
      if (!problem) return;
      try {
        await onUpdate(problem.id, undefined, newNote);
      } catch (error) {
        console.error('Failed to auto-save note', error);
      }
    }, 1000);
    setSaveTimeout(timeout);
  };

  const handleNoteBlur = async () => {
    if (saveTimeout) clearTimeout(saveTimeout);
    if (!problem || note === (progress?.notes || "")) return;
    try {
      await onUpdate(problem.id, undefined, note);
    } catch (error) {
      console.error('Failed to save note on blur', error);
    }
  };

  const status = progress?.status || "not_started";

  const difficultyColors = {
    easy: 'text-green-600 bg-green-50 border-green-200',
    medium: 'text-amber-600 bg-amber-50 border-amber-200',
    hard: 'text-red-600 bg-red-50 border-red-200'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200"
          >
            {/* Header / Problem Identity */}
            <div className="flex items-start justify-between p-6 pb-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`px-2 py-0.5 text-[11px] font-bold rounded border uppercase tracking-wider ${difficultyColors[problem.difficulty]}`}>
                    {problem.difficulty}
                  </div>
                  <span className="text-sm font-mono text-slate-500">#{problem.id}</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">{problem.title}</h2>
                <div className="text-sm text-slate-500 mb-4 font-medium">
                  {problem.primaryTopic} {problem.tags.length > 1 ? `· ${problem.tags.find(t => t !== problem.primaryTopic) || ''}` : ''}
                </div>
                <a 
                  href={problem.leetcodeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors"
                >
                  Open on LeetCode <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors -mr-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <hr className="border-slate-100 mx-6" />

            {/* Content Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-10">
              
              {/* Why this problem matters */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Target className="w-4 h-4" /> Why this problem?
                </h3>
                <p className="text-slate-700 leading-relaxed text-sm">
                  {problem.whyThisProblem}
                </p>
              </div>

              {/* What you'll practice (Mocked standard skills for now) */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> What you'll practice
                </h3>
                <div className="flex flex-wrap gap-2">
                  {problem.skills.map((skill, idx) => (
                    <div key={idx} className="text-sm text-slate-600 font-medium p-2 bg-slate-50 rounded border border-slate-100">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>

              {/* Algorithmic Context */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Algorithmic Context</h3>
                <div className="grid grid-cols-2 gap-0 border border-slate-200 rounded-xl overflow-hidden divide-x divide-slate-200">
                  <div className="p-4 bg-white flex flex-col items-center justify-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Time</span>
                    <span className="font-mono text-base font-semibold text-slate-800">{problem.timeComplexity}</span>
                  </div>
                  <div className="p-4 bg-white flex flex-col items-center justify-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Space</span>
                    <span className="font-mono text-base font-semibold text-slate-800">{problem.spaceComplexity}</span>
                  </div>
                </div>
              </div>

              {/* Pattern Hint */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pattern Hint</h3>
                {showHint ? (
                  <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">{problem.patternHint}</p>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowHint(true)}
                    className="w-full p-4 border border-dashed border-slate-300 rounded-xl text-sm font-medium text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/30 transition-all text-center flex items-center justify-center gap-2"
                  >
                    <HelpCircle className="w-4 h-4" /> Show Pattern Hint
                  </button>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {problem.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold uppercase tracking-wide rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Your Progress */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Progress</h3>
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <div 
                    onClick={() => handleStatusUpdate('not_started')}
                    className="flex items-center gap-3 p-3 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${status === 'not_started' ? 'border-slate-300' : 'border-slate-200'}`}>
                      {status === 'not_started' && <div className="w-2 h-2 bg-slate-400 rounded-full" />}
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-sm font-medium ${status === 'not_started' ? 'text-slate-900' : 'text-slate-500'}`}>Not Started</span>
                    </div>
                  </div>
                  <div 
                    onClick={() => handleStatusUpdate('attempted')}
                    className="flex items-center gap-3 p-3 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${status === 'attempted' ? 'border-amber-500' : 'border-slate-200'}`}>
                      {status === 'attempted' && <div className="w-2 h-2 bg-amber-500 rounded-full" />}
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-sm font-medium ${status === 'attempted' ? 'text-slate-900' : 'text-slate-500'}`}>Attempted</span>
                      {progress?.attempts && progress.attempts > 0 ? (
                        <span className="text-[11px] text-slate-400 font-medium mt-0.5">{progress.attempts} {progress.attempts === 1 ? 'attempt' : 'attempts'}</span>
                      ) : null}
                    </div>
                  </div>
                  <div 
                    onClick={() => handleStatusUpdate('solved')}
                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${status === 'solved' ? 'border-green-500' : 'border-slate-200'}`}>
                      {status === 'solved' && <div className="w-2 h-2 bg-green-500 rounded-full" />}
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-sm font-medium ${status === 'solved' ? 'text-slate-900' : 'text-slate-500'}`}>Solved</span>
                      {progress?.solved_at && (
                        <span className="text-[11px] text-slate-400 font-medium mt-0.5">
                          {new Date(progress.solved_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* My Notes */}
              <div className="space-y-3 pb-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <PenLine className="w-4 h-4" /> My Notes
                </h3>
                <textarea 
                  value={note}
                  onChange={(e) => handleNoteChange(e.target.value)}
                  onBlur={handleNoteBlur}
                  placeholder="Add your notes... (e.g. 'Used nested loops initially. Need to remember complement = target - nums[i]')"
                  className="w-full p-4 border border-slate-200 rounded-xl text-sm text-slate-700 min-h-[120px] resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
                />
              </div>

              {/* Next Practice (Related Problems in same stage) */}
              <div className="space-y-3 pb-8">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Next Practice</h3>
                <div className="flex flex-col gap-1">
                  {problem.nextProblemIds.length > 0 ? (
                    problem.nextProblemIds.slice(0, 4).map(nextId => {
                      const related = dsaCatalog.find(p => p.id === nextId);
                      if (!related) return null;
                      return (
                        <div 
                          key={related.id} 
                          onClick={() => onProblemSelect?.(related.id)}
                          className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 cursor-pointer group py-1"
                        >
                          <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-blue-500 transition-colors" />
                          <span className="font-mono text-xs text-slate-400">#{related.id}</span>
                          <span className="font-medium">{related.title}</span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-sm text-slate-500 italic px-1 py-2">
                      End of {problem.primaryTopic} stage. Great job!
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-slate-100 bg-white">
              <div className="grid grid-cols-1 gap-3">
                {status !== 'solved' && (
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusUpdate('solved')}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-sm shadow-blue-200 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Mark as Solved
                  </button>
                )}
                
                {status !== 'attempted' && (
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusUpdate('attempted')}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded-xl transition-all disabled:opacity-50"
                  >
                    <Clock className="w-5 h-5 text-slate-400" />
                    Mark as Attempted
                  </button>
                )}

                {status !== 'not_started' && (
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusUpdate('not_started')}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white border border-slate-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 text-slate-600 font-medium rounded-xl transition-all disabled:opacity-50"
                  >
                    <XCircle className="w-5 h-5" />
                    Reset Progress
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
