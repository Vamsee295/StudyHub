import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DsaProblem, dsaCatalog } from '@/lib/data/dsaCatalog';
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  X,
  HelpCircle,
  XCircle,
  ChevronRight,
  PenLine,
  Target,
  BookOpen,
} from 'lucide-react';

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

  // Another problem (or freshly saved notes): hide the hint and show the saved note. Before any early return.
  const [shown, setShown] = useState({ problem, notes: progress?.notes });
  if (shown.problem !== problem || shown.notes !== progress?.notes) {
    setShown({ problem, notes: progress?.notes });
    if (problem) {
      setShowHint(false);
      setNote(progress?.notes || "");
    }
  }

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
    easy: 'text-note bg-success-soft border-success-line',
    medium: 'text-warning bg-warning-soft border-warning-line',
    hard: 'text-danger bg-danger-soft border-danger-line'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-card shadow-2xl z-50 flex flex-col border-l border-hair"
          >
            {/* Header / Problem Identity */}
            <div className="flex items-start justify-between p-6 pb-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`px-2 py-0.5 text-[11px] font-bold rounded border uppercase tracking-wider ${difficultyColors[problem.difficulty]}`}>
                    {problem.difficulty}
                  </div>
                  <span className="text-sm font-mono text-mute">#{problem.id}</span>
                </div>
                <h2 className="text-2xl font-bold text-ink mb-1">{problem.title}</h2>
                <div className="text-sm text-mute mb-4 font-medium">
                  {problem.primaryTopic} {problem.tags.length > 1 ? `· ${problem.tags.find(t => t !== problem.primaryTopic) || ''}` : ''}
                </div>
                <a 
                  href={problem.leetcodeUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-accent-ink hover:text-accent-ink font-semibold text-sm transition-colors"
                >
                  Open on LeetCode <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-mute hover:text-body hover:bg-card-2 rounded-full transition-colors -mr-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <hr className="border-hair mx-6" />

            {/* Content Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-10">
              
              {/* Why this problem matters */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-mute uppercase tracking-wider flex items-center gap-2">
                  <Target className="w-4 h-4" /> Why this problem?
                </h3>
                <p className="text-body leading-relaxed text-sm">
                  {problem.whyThisProblem}
                </p>
              </div>

              {/* What you'll practice (Mocked standard skills for now) */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-mute uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> What you’ll practice
                </h3>
                <div className="flex flex-wrap gap-2">
                  {problem.skills.map((skill, idx) => (
                    <div key={idx} className="text-sm text-body font-medium p-2 bg-paper-2 rounded border border-hair">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>

              {/* Algorithmic Context */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-mute uppercase tracking-wider">Algorithmic Context</h3>
                <div className="grid grid-cols-2 gap-0 border border-hair rounded-xl overflow-hidden divide-x divide-hair">
                  <div className="p-4 bg-card flex flex-col items-center justify-center">
                    <span className="text-[10px] font-bold text-mute uppercase tracking-widest mb-1">Time</span>
                    <span className="font-mono text-base font-semibold text-ink">{problem.timeComplexity}</span>
                  </div>
                  <div className="p-4 bg-card flex flex-col items-center justify-center">
                    <span className="text-[10px] font-bold text-mute uppercase tracking-widest mb-1">Space</span>
                    <span className="font-mono text-base font-semibold text-ink">{problem.spaceComplexity}</span>
                  </div>
                </div>
              </div>

              {/* Pattern Hint */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-mute uppercase tracking-wider">Pattern Hint</h3>
                {showHint ? (
                  <div className="p-4 bg-accent-soft/50 rounded-xl border border-accent-line">
                    <p className="text-sm text-body leading-relaxed font-medium">{problem.patternHint}</p>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowHint(true)}
                    className="w-full p-4 border border-dashed border-ink/25 rounded-xl text-sm font-medium text-mute hover:text-accent-ink hover:border-accent-line hover:bg-accent-soft/30 transition-all text-center flex items-center justify-center gap-2"
                  >
                    <HelpCircle className="w-4 h-4" /> Show Pattern Hint
                  </button>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-mute uppercase tracking-wider">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {problem.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-card-2 text-body text-[11px] font-bold uppercase tracking-wide rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Your Progress */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-mute uppercase tracking-wider">Your Progress</h3>
                <div className="border border-hair rounded-xl overflow-hidden bg-card">
                  <div 
                    onClick={() => handleStatusUpdate('not_started')}
                    className="flex items-center gap-3 p-3 border-b border-hair cursor-pointer hover:bg-paper-2 transition-colors"
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${status === 'not_started' ? 'border-ink/25' : 'border-hair'}`}>
                      {status === 'not_started' && <div className="w-2 h-2 bg-ink/40 rounded-full" />}
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-sm font-medium ${status === 'not_started' ? 'text-ink' : 'text-mute'}`}>Not Started</span>
                    </div>
                  </div>
                  <div 
                    onClick={() => handleStatusUpdate('attempted')}
                    className="flex items-center gap-3 p-3 border-b border-hair cursor-pointer hover:bg-paper-2 transition-colors"
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${status === 'attempted' ? 'border-gold' : 'border-hair'}`}>
                      {status === 'attempted' && <div className="w-2 h-2 bg-gold rounded-full" />}
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-sm font-medium ${status === 'attempted' ? 'text-ink' : 'text-mute'}`}>Attempted</span>
                      {progress?.attempts && progress.attempts > 0 ? (
                        <span className="text-[11px] text-mute font-medium mt-0.5">{progress.attempts} {progress.attempts === 1 ? 'attempt' : 'attempts'}</span>
                      ) : null}
                    </div>
                  </div>
                  <div 
                    onClick={() => handleStatusUpdate('solved')}
                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-paper-2 transition-colors"
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${status === 'solved' ? 'border-note' : 'border-hair'}`}>
                      {status === 'solved' && <div className="w-2 h-2 bg-note rounded-full" />}
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-sm font-medium ${status === 'solved' ? 'text-ink' : 'text-mute'}`}>Solved</span>
                      {progress?.solved_at && (
                        <span className="text-[11px] text-mute font-medium mt-0.5">
                          {new Date(progress.solved_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* My Notes */}
              <div className="space-y-3 pb-2">
                <h3 className="text-xs font-bold text-mute uppercase tracking-wider flex items-center gap-2">
                  <PenLine className="w-4 h-4" /> My Notes
                </h3>
                <textarea 
                  value={note}
                  onChange={(e) => handleNoteChange(e.target.value)}
                  onBlur={handleNoteBlur}
                  placeholder="Add your notes... (e.g. 'Used nested loops initially. Need to remember complement = target - nums[i]')"
                  className="w-full p-4 border border-hair rounded-xl text-sm text-body min-h-[120px] resize-y focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder:text-mute"
                />
              </div>

              {/* Next Practice (Related Problems in same stage) */}
              <div className="space-y-3 pb-8">
                <h3 className="text-xs font-bold text-mute uppercase tracking-wider">Next Practice</h3>
                <div className="flex flex-col gap-1">
                  {problem.nextProblemIds.length > 0 ? (
                    problem.nextProblemIds.slice(0, 4).map(nextId => {
                      const related = dsaCatalog.find(p => p.id === nextId);
                      if (!related) return null;
                      return (
                        <div 
                          key={related.id} 
                          onClick={() => onProblemSelect?.(related.id)}
                          className="flex items-center gap-2 text-sm text-body hover:text-accent-ink cursor-pointer group py-1"
                        >
                          <ChevronRight className="w-3 h-3 text-ink/30 group-hover:text-accent transition-colors" />
                          <span className="font-mono text-xs text-mute">#{related.id}</span>
                          <span className="font-medium">{related.title}</span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-sm text-mute italic px-1 py-2">
                      End of {problem.primaryTopic} stage. Great job!
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-hair bg-card">
              <div className="grid grid-cols-1 gap-3">
                {status !== 'solved' && (
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusUpdate('solved')}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-accent hover:bg-accent text-paper font-medium rounded-xl transition-all shadow-accent-line disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Mark as Solved
                  </button>
                )}
                
                {status !== 'attempted' && (
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusUpdate('attempted')}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-card border-2 border-hair hover:border-ink/25 hover:bg-paper-2 text-body font-medium rounded-xl transition-all disabled:opacity-50"
                  >
                    <Clock className="w-5 h-5 text-mute" />
                    Mark as Attempted
                  </button>
                )}

                {status !== 'not_started' && (
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusUpdate('not_started')}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-card border border-hair hover:border-danger-line hover:bg-danger-soft hover:text-danger text-body font-medium rounded-xl transition-all disabled:opacity-50"
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
