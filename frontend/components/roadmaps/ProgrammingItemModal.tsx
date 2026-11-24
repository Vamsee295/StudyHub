import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PfItem, PfLesson, PfExercise } from '@/lib/data/programmingFundamentalsCatalog';
import { PfItemProgress } from '@/lib/api/roadmaps';
import { X, CheckCircle2, Circle, Clock, Lightbulb, Code, BookOpen, ChevronRight, PenLine } from 'lucide-react';
import clsx from 'clsx';

interface ProgrammingItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: PfItem | null;
  progress: PfItemProgress | null;
  onUpdate: (itemId: string, status?: string, notes?: string) => Promise<void>;
  onItemSelect?: (itemId: string) => void;
}

export const ProgrammingItemModal: React.FC<ProgrammingItemModalProps> = ({
  isOpen, onClose, item, progress, onUpdate, onItemSelect
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [note, setNote] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (item) {
      setShowHint(false);
      setNote(progress?.notes || "");
    }
  }, [item, progress?.notes]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!item) return null;

  const handleStatusUpdate = async (newStatus: string) => {
    if (!item || isUpdating) return;
    try {
      setIsUpdating(true);
      await onUpdate(item.id, newStatus, undefined);
    } catch (error) {
      console.error('Failed to update status', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNoteChange = (newNote: string) => {
    setNote(newNote);
    if (saveTimeout) clearTimeout(saveTimeout);
    const timeout = setTimeout(async () => {
      if (!item) return;
      try {
        await onUpdate(item.id, undefined, newNote);
      } catch (error) {
        console.error('Failed to auto-save note', error);
      }
    }, 1000);
    setSaveTimeout(timeout);
  };

  const handleNoteBlur = async () => {
    if (saveTimeout) clearTimeout(saveTimeout);
    if (!item || note === (progress?.notes || "")) return;
    try {
      await onUpdate(item.id, undefined, note);
    } catch (error) {
      console.error('Failed to save note on blur', error);
    }
  };

  const status = progress?.status || "not_started";
  const isLesson = item.type === "lesson";
  const lessonItem = item as PfLesson;
  const exerciseItem = item as PfExercise;

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
            {/* HEADER */}
            <div className="flex items-start justify-between p-6 pb-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  {isLesson ? (
                    <div className="px-2 py-0.5 text-[11px] font-bold rounded border uppercase tracking-wider text-accent-ink bg-accent-soft border-accent-line flex items-center gap-1.5">
                      <BookOpen className="w-3 h-3" /> LESSON
                    </div>
                  ) : (
                    <div className={`px-2 py-0.5 text-[11px] font-bold rounded border uppercase tracking-wider ${difficultyColors[exerciseItem.difficulty]}`}>
                      {exerciseItem.difficulty}
                    </div>
                  )}
                  <span className="text-sm font-mono text-mute">#{item.order}</span>
                </div>
                <h2 className="text-2xl font-bold text-ink mb-1">{item.title}</h2>
                <div className="text-sm text-mute font-medium">
                  {item.category}
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-card-2 rounded-full text-mute hover:text-body transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 pt-2 pb-24">
              
              {/* Common: Why this matters / Why this problem */}
              <div className="mb-6">
                <h3 className="text-[13px] font-bold uppercase tracking-wider text-ink mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-gold" />
                  {isLesson ? "Why this matters" : "Why this problem"}
                </h3>
                <p className="text-sm text-body leading-relaxed bg-paper-2 p-4 rounded-xl border border-hair">
                  {isLesson ? lessonItem.whyItMatters : exerciseItem.whyThisProblem}
                </p>
              </div>

              {/* Lesson Specific: What you'll learn */}
              {isLesson && (
                <div className="mb-6">
                  <h3 className="text-[13px] font-bold uppercase tracking-wider text-ink mb-2">
                    What you'll learn
                  </h3>
                  <ul className="space-y-2">
                    {lessonItem.learningPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-body">
                        <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Exercise Specific: What you'll practice */}
              {!isLesson && (
                <div className="mb-6">
                  <h3 className="text-[13px] font-bold uppercase tracking-wider text-ink mb-2">
                    What you'll practice
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {exerciseItem.practiceSkills.map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 bg-card-2 text-body text-xs font-medium rounded-md border border-hair">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Lesson Specific: Java Concept */}
              {isLesson && lessonItem.javaConcept && (
                <div className="mb-6">
                  <h3 className="text-[13px] font-bold uppercase tracking-wider text-ink mb-2 flex items-center gap-2">
                    <Code className="w-4 h-4 text-mute" />
                    Java Concept
                  </h3>
                  <div className="bg-night rounded-xl p-4 overflow-x-auto">
                    <pre className="text-sm font-mono text-[#f0a07e] leading-relaxed">
                      {lessonItem.javaConcept}
                    </pre>
                  </div>
                </div>
              )}

              {/* Complexity */}
              {item.complexity && (
                <div className="mb-6 bg-accent-soft/50 rounded-xl p-4 border border-accent-line">
                  <h3 className="text-[13px] font-bold uppercase tracking-wider text-ink mb-3">
                    Complexity
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[11px] font-semibold text-mute uppercase tracking-wider mb-1">Time</div>
                      <div className="font-mono text-sm font-medium text-ink">{item.complexity.time}</div>
                    </div>
                    <div>
                      <div className="text-[11px] font-semibold text-mute uppercase tracking-wider mb-1">Space</div>
                      <div className="font-mono text-sm font-medium text-ink">{item.complexity.space}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Lesson Specific: Common Mistakes */}
              {isLesson && lessonItem.commonMistakes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-[13px] font-bold uppercase tracking-wider text-danger mb-2">
                    Common Mistakes
                  </h3>
                  <ul className="space-y-2 bg-danger-soft/50 p-4 rounded-xl border border-danger-line">
                    {lessonItem.commonMistakes.map((mistake, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-danger">
                        <span className="w-1.5 h-1.5 rounded-full bg-danger mt-1.5 shrink-0" />
                        <span>{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Exercise Specific: Hint */}
              {!isLesson && (
                <div className="mb-6">
                  <button 
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center justify-between w-full p-4 rounded-xl border border-warning-line bg-warning-soft/50 text-warning hover:bg-warning-soft transition-colors"
                  >
                    <span className="font-semibold text-sm">Need a hint?</span>
                    <ChevronRight className={clsx("w-4 h-4 transition-transform", showHint && "rotate-90")} />
                  </button>
                  <AnimatePresence>
                    {showHint && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 mt-2 bg-card border border-warning-line rounded-xl text-sm text-warning leading-relaxed">
                          {exerciseItem.hint}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Exercise Specific: Notes */}
              {!isLesson && (
                <div className="mb-6">
                  <h3 className="text-[13px] font-bold uppercase tracking-wider text-ink mb-2 flex items-center gap-2">
                    <PenLine className="w-4 h-4 text-mute" />
                    My Notes
                  </h3>
                  <textarea 
                    value={note}
                    onChange={(e) => handleNoteChange(e.target.value)}
                    onBlur={handleNoteBlur}
                    placeholder="Write down edge cases, approaches, or things to review..."
                    className="w-full h-32 p-4 rounded-xl border border-hair bg-paper-2 focus:bg-card text-sm text-body resize-none focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all placeholder:text-mute"
                  />
                  <div className="flex justify-end mt-2">
                    <span className="text-[11px] text-mute font-medium">
                      {saveTimeout ? 'Saving...' : 'Saved'}
                    </span>
                  </div>
                </div>
              )}

            </div>

            {/* FOOTER ACTIONS */}
            <div className="p-6 border-t border-hair bg-card">
              <div className="grid grid-cols-1 gap-3">
                
                {/* For Lessons */}
                {isLesson ? (
                  <>
                    {(status === 'not_started' || status === 'attempted') && (
                      <button 
                        onClick={() => handleStatusUpdate('completed')}
                        disabled={isUpdating}
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-paper bg-accent hover:bg-accent transition-colors disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        Mark as Completed
                      </button>
                    )}
                    {status === 'completed' && (
                      <button 
                        onClick={() => handleStatusUpdate('not_started')}
                        disabled={isUpdating}
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-body bg-card-2 hover:bg-ink/10 transition-colors"
                      >
                        <Circle className="w-5 h-5" />
                        Mark as Unread
                      </button>
                    )}
                  </>
                ) : (
                  /* For Exercises */
                  <>
                    {status !== 'solved' && (
                      <button 
                        onClick={() => handleStatusUpdate('solved')}
                        disabled={isUpdating}
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-paper bg-accent hover:bg-accent transition-colors disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        Mark as Solved
                      </button>
                    )}
                    {status === 'not_started' && (
                      <button 
                        onClick={() => handleStatusUpdate('attempted')}
                        disabled={isUpdating}
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-body bg-card-2 hover:bg-ink/10 transition-colors disabled:opacity-50"
                      >
                        <Clock className="w-5 h-5 text-gold" />
                        Mark as Attempted
                      </button>
                    )}
                    {(status === 'solved' || status === 'attempted') && (
                      <button 
                        onClick={() => handleStatusUpdate('not_started')}
                        disabled={isUpdating}
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-body bg-card-2 hover:bg-ink/10 transition-colors disabled:opacity-50"
                      >
                        <Circle className="w-5 h-5" />
                        Reset Progress
                      </button>
                    )}
                  </>
                )}

              </div>
            </div>
            
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
