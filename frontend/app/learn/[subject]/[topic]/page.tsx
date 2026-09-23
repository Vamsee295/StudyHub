"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  CheckCircle2, 
  BookOpen, 
  Clock,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Lightbulb,
  AlertTriangle,
  Code,
  Save,
  Check
} from "lucide-react";
import { clsx } from "clsx";
import { learnService, SubjectDetails, TopicContent } from "@/lib/services/learnService";
import { notificationService } from "@/lib/services/notificationService";
import { useAuth } from "@/components/providers/AuthProvider";

function SectionRenderer({ section, selectedOption, handleQuickCheck, showExplanation }: any) {
  const renderInlineCode = (text: string) => {
    if (!text) return null;
    return text.split(/`([^`]+)`/g).map((part, i) => {
      if (i % 2 === 1) return <code key={i} className="bg-[var(--surface-subdued)] px-1.5 py-0.5 rounded text-[13px] text-[var(--ink)] font-mono">{part}</code>;
      return part;
    });
  };

  switch (section.type) {
    case 'text':
      let Icon = BookOpen;
      if (section.title.toLowerCase().includes('why')) Icon = Lightbulb;
      else if (section.title.toLowerCase().includes('concept')) Icon = BookOpen;
      else if (section.title.toLowerCase().includes('how')) Icon = Code;
      
      return (
        <section className={section.title.toLowerCase().includes('why') ? "bg-[var(--accent-soft)]/30 border border-[var(--accent-soft-border)] rounded-xl p-6" : ""}>
          <h2 className={clsx("text-[12px] font-bold uppercase tracking-wider mb-3 flex items-center gap-2", 
            section.title.toLowerCase().includes('why') ? "text-[var(--accent)]" : "text-[var(--ink)]"
          )}>
            <Icon className={clsx("w-4 h-4", section.title.toLowerCase().includes('why') ? "" : "text-[var(--accent)]")} /> 
            {section.title}
          </h2>
          <div className="prose prose-sm sm:prose-base max-w-none text-[var(--ink-secondary)] whitespace-pre-wrap leading-relaxed overflow-x-auto">
            {section.content}
          </div>
        </section>
      );
    case 'code':
      return (
        <section>
          <h2 className="text-[12px] font-bold text-[var(--ink)] uppercase tracking-wider mb-3 flex items-center gap-2">
            <Code className="w-4 h-4 text-[var(--accent)]" /> {section.title}
          </h2>
          <div className="bg-[#1E1E1E] rounded-xl p-5 overflow-x-auto shadow-inner mb-3">
            <pre className="text-[13px] text-gray-300 font-mono">
              <code>{section.code}</code>
            </pre>
          </div>
          {section.explanation && (
            <p className="text-[14px] text-[var(--ink-secondary)] leading-relaxed italic">
              {renderInlineCode(section.explanation)}
            </p>
          )}
        </section>
      );
    case 'list':
      return (
        <section className="bg-[var(--surface-subdued)]/50 border border-[var(--border)] rounded-xl p-6">
          <h2 className="text-[12px] font-bold text-[var(--ink)] uppercase tracking-wider mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" /> {section.title}
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-[14px] text-[var(--ink)] leading-relaxed">
            {section.items.map((item: string, idx: number) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            ))}
          </ul>
        </section>
      );
    case 'table':
      return (
        <section>
          <h2 className="text-[12px] font-bold text-[var(--ink)] uppercase tracking-wider mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[var(--accent)]" /> {section.title}
          </h2>
          <div className="overflow-x-auto border border-[var(--border)] rounded-xl">
            <table className="w-full text-left text-[14px]">
              <thead className="bg-[#FAFAFA] border-b border-[var(--border)]">
                <tr>
                  {section.headers.map((h: string, i: number) => (
                    <th key={i} className="px-5 py-3 font-semibold text-[var(--ink)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {section.rows.map((row: string[], i: number) => (
                  <tr key={i} className="bg-white">
                    {row.map((cell: string, j: number) => (
                      <td key={j} className="px-5 py-3 text-[var(--ink-secondary)]">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      );
    case 'warning':
      return (
        <section className="bg-[var(--error-soft)]/30 border border-[var(--error-soft-border)] rounded-xl p-6">
          <h2 className="text-[12px] font-bold text-[var(--error)] uppercase tracking-wider mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> {section.title}
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-[14px] text-[var(--ink)]">
            {section.items.map((mistake: string, idx: number) => (
              <li key={idx}>{renderInlineCode(mistake)}</li>
            ))}
          </ul>
        </section>
      );
    case 'takeaways':
      return (
        <section className="bg-[var(--accent-soft)]/20 border border-[var(--accent-soft-border)] rounded-xl p-6">
          <h2 className="text-[12px] font-bold text-[var(--accent)] uppercase tracking-wider mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {section.title}
          </h2>
          <ul className="list-none space-y-2 text-[14.5px] font-medium text-[var(--ink)]">
            {section.items.map((item: string, idx: number) => (
              <li key={idx} className="flex gap-2">
                <span className="text-[var(--accent)] font-bold mt-0.5">•</span>
                <span>{renderInlineCode(item)}</span>
              </li>
            ))}
          </ul>
        </section>
      );
    case 'quickCheck':
      return (
        <section className="bg-white border border-[var(--border)] rounded-xl overflow-hidden shadow-sm">
          <div className="bg-[#FAFAFA] border-b border-[var(--border)] px-6 py-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" />
            <h2 className="text-[12px] font-bold text-[var(--ink)] uppercase tracking-wider">Quick Check</h2>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <p className="text-[15px] font-medium text-[var(--ink)]">
              {section.question}
            </p>
            <div className="flex flex-col gap-2">
              {section.options.map((opt: string, idx: number) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === section.answer;
                const showStatus = selectedOption !== null;
                
                return (
                  <button
                    key={idx}
                    onClick={() => handleQuickCheck(idx)}
                    disabled={showStatus}
                    className={clsx(
                      "text-left px-4 py-3 rounded-lg border text-[14px] font-medium transition-all",
                      !showStatus && "hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]/30 border-[var(--border)] bg-white",
                      showStatus && isCorrect && "bg-[var(--success-soft)] border-[var(--success-soft-border)] text-[var(--success)]",
                      showStatus && isSelected && !isCorrect && "bg-[var(--error-soft)] border-[var(--error-soft-border)] text-[var(--error)]",
                      showStatus && !isSelected && !isCorrect && "border-[var(--border)] bg-[#FAFAFA] opacity-50"
                    )}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {showExplanation && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                className="mt-2 text-[14px] text-[var(--ink-secondary)] p-4 bg-[#FAFAFA] rounded-lg border border-[var(--border)]"
              >
                <span className="font-bold text-[var(--ink)]">Explanation:</span> {section.explanation}
              </motion.div>
            )}
          </div>
        </section>
      );
    default:
      return null;
  }
}

export default function TopicPage() {
  const params = useParams();
  const subjectSlug = params.subject as string;
  const topicSlug = params.topic as string;
  const { user } = useAuth();

  const [subject, setSubject] = useState<SubjectDetails | null>(null);
  const [topic, setTopic] = useState<TopicContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  
  // Quick Check state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Notes state
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);
  const notesTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const lessonScrollRef = useRef<HTMLDivElement>(null);

  // When active topic changes or finishes loading, reset scroll to top of lesson container
  useEffect(() => {
    if (!loading && lessonScrollRef.current) {
      lessonScrollRef.current.scrollTop = 0;
    }
  }, [topicSlug, loading]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [subjectData, topicData] = await Promise.all([
          learnService.getSubjectDetails(subjectSlug),
          learnService.getTopicContent(subjectSlug, topicSlug)
        ]);
        setSubject(subjectData);
        setTopic(topicData);
        if (topicData.notes) {
          setNotes(topicData.notes);
        }
      } catch (err: any) {
        console.error("Failed to load topic details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [subjectSlug, topicSlug]);

  const { currentModule, nextTopic, prevTopic, allTopicsList } = useMemo(() => {
    if (!subject || !topic) return { currentModule: null, nextTopic: null, prevTopic: null, allTopicsList: [] };
    
    let currentModule = null;
    let allTopics = [];
    
    for (const m of subject.modules) {
      for (const t of m.topics) {
        allTopics.push({ ...t, moduleId: m.id, moduleTitle: m.title });
        if (t.id === topic.id || t.slug === topic.slug) {
          currentModule = m;
        }
      }
    }
    
    const currentIndex = allTopics.findIndex(t => t.id === topic.id || t.slug === topic.slug);
    const prevTopic = currentIndex > 0 ? allTopics[currentIndex - 1] : null;
    const nextTopic = currentIndex < allTopics.length - 1 ? allTopics[currentIndex + 1] : null;

    return { currentModule, nextTopic, prevTopic, allTopicsList: allTopics };
  }, [subject, topic]);

  const parsedContent = useMemo(() => {
    if (!topic || !topic.content) return null;
    try {
      if (typeof topic.content === 'string') {
        return JSON.parse(topic.content);
      }
      return topic.content;
    } catch (e) {
      return { concept: String(topic.content) };
    }
  }, [topic]);

  if (loading) {
    return (
      <div className="flex flex-col h-full w-full items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 text-[var(--accent)] animate-spin mb-4" />
        <p className="text-[var(--ink-secondary)] text-[13px] font-mono">Loading learning environment...</p>
      </div>
    );
  }

  if (error || !topic || !subject || !currentModule) {
    return (
      <div className="flex flex-col h-full w-full items-center justify-center bg-white p-6">
        <div className="p-6 bg-[var(--error-soft)] text-[var(--error)] rounded-xl border border-[var(--error)]/20 max-w-md text-center shadow-sm">
          <h3 className="font-bold mb-2 text-[16px]">Topic not found</h3>
          <p className="text-[14px]">The topic you are looking for does not exist or an error occurred.</p>
          <Link href={`/learn/${subjectSlug}`} className="inline-block mt-4 text-[13px] font-bold hover:underline">
            ← Back to Subject
          </Link>
        </div>
      </div>
    );
  }

  const isCompleted = topic.status === 'completed';

  const toggleComplete = async () => {
    try {
      setUpdating(true);
      const newStatus = isCompleted ? 'in_progress' : 'completed';
      await learnService.updateTopicProgress(topic.id, newStatus);
      
      if (newStatus === 'completed' && user?.id) {
        notificationService.createNotification({
          userId: user.id,
          title: "Lesson Completed",
          message: `You completed "${topic.title}".`,
          type: "LESSON_COMPLETED",
          link: `/learn/${subjectSlug}/${topicSlug}`
        });
      }
      
      setTopic({ ...topic, status: newStatus });
      
      const updatedSubject = { ...subject };
      for (const m of updatedSubject.modules) {
        for (const t of m.topics) {
          if (t.id === topic.id) {
            t.status = newStatus;
          }
        }
      }
      setSubject(updatedSubject);
    } catch (err) {
      console.error("Failed to update progress:", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNotes(val);
    
    if (notesTimeoutRef.current) {
      clearTimeout(notesTimeoutRef.current);
    }
    
    setNotesSaved(false);
    setSavingNotes(true);
    
    notesTimeoutRef.current = setTimeout(async () => {
      try {
        await learnService.updateTopicProgress(topic.id, topic.status as any, val);
        setNotesSaved(true);
        setTimeout(() => setNotesSaved(false), 2000);
      } catch (err) {
        console.error("Failed to save notes", err);
      } finally {
        setSavingNotes(false);
      }
    }, 1000);
  };

  const handleQuickCheck = (index: number) => {
    if (selectedOption !== null) return; // already answered
    setSelectedOption(index);
    setShowExplanation(true);
  };

  return (
    <div className="flex w-full h-full min-w-0 overflow-hidden bg-white">
      
      {/* LEFT SIDEBAR: CURRICULUM NAVIGATION */}
      <aside className="w-80 shrink-0 border-r border-[var(--border)] flex flex-col h-full bg-[#FAFAFA] hidden md:flex min-w-0">
        <div className="p-5 border-b border-[var(--border)] shrink-0 bg-white">
          <Link 
            href={`/learn/${subject.slug}`} 
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--ink-secondary)] hover:text-[var(--accent)] transition-colors mb-3"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to {subject.name}
          </Link>
          <h2 className="font-bold text-[16px] text-[var(--ink)] leading-tight">{subject.name}</h2>
          <div className="mt-2 w-full bg-[var(--border)] h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-[var(--accent)]" style={{ width: `${subject.progress_percentage || 0}%` }}></div>
          </div>
          <p className="text-[11px] font-mono text-[var(--ink-tertiary)] mt-1.5">
            {subject.progress_percentage || 0}% Complete
          </p>
        </div>
        
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
          {subject.modules.map((m, mIdx) => (
            <div key={m.id} className="border-b border-[var(--border)]/40 last:border-b-0">
              <div className="px-5 py-3.5 bg-white/50 text-[11px] font-bold text-[var(--ink-secondary)] uppercase tracking-wider sticky top-0 backdrop-blur-sm z-10">
                Module {mIdx + 1}: {m.title}
              </div>
              <div className="flex flex-col">
                {m.topics.map((t, tIdx) => {
                  const isActive = t.id === topic.id;
                  const isDone = t.status === 'completed';
                  return (
                    <Link 
                      key={t.id}
                      href={`/learn/${subject.slug}/${t.slug}`}
                      className={clsx(
                        "px-5 py-3 border-l-2 flex items-start gap-3 transition-colors",
                        isActive 
                          ? "bg-[var(--accent-soft)]/40 border-[var(--accent)]" 
                          : "border-transparent hover:bg-black/[0.02]"
                      )}
                    >
                      <div className={clsx(
                        "w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                        isDone 
                          ? "text-[var(--success)]" 
                          : isActive ? "text-[var(--accent)] border-2 border-[var(--accent)]" : "border-2 border-[var(--border-strong)]"
                      )}>
                        {isDone && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className={clsx(
                          "text-[13px] leading-snug truncate",
                          isActive ? "font-bold text-[var(--accent)]" : "font-medium text-[var(--ink)]"
                        )}>
                          {t.title}
                        </span>
                        <span className="text-[11px] font-mono text-[var(--ink-tertiary)] mt-0.5">
                          {t.estimated_minutes}m
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white relative min-w-0">
        {/* TOP HEADER */}
        <header className="shrink-0 min-h-[4rem] py-3 border-b border-[var(--border)] px-6 md:px-10 flex flex-wrap items-center justify-between bg-white z-10 gap-4 w-full min-w-0 box-border">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-[11px] font-mono text-[var(--ink-tertiary)] uppercase tracking-wider font-semibold border border-[var(--border)] px-2 py-0.5 rounded truncate">
              {currentModule.title}
            </span>
          </div>
          
          <button 
            onClick={toggleComplete}
            disabled={updating || isCompleted}
            className={clsx(
              "shrink-0 text-[12px] font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-2 border shadow-sm",
              isCompleted 
                ? "bg-[var(--success-soft)] text-[var(--success)] border-[var(--success-soft-border)] cursor-default"
                : "bg-[var(--accent)] text-white border-[var(--accent)] hover:bg-[var(--accent-hover)]",
              updating && "opacity-50 cursor-not-allowed"
            )}
          >
            {updating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isCompleted ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            {isCompleted ? "Completed" : "Mark as Complete"}
          </button>
        </header>

        {/* ONE CLEAR SCROLLABLE CONTENT REGION */}
        <div ref={lessonScrollRef} className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
          <article className="w-full max-w-[900px] mx-auto px-6 md:px-10 py-10 flex flex-col gap-10 box-border min-w-0">
            
            {/* TITLE & META */}
            <div className="flex flex-col gap-4">
              <h1 className="font-newsreader text-4xl sm:text-5xl text-[var(--ink)] font-normal tracking-tight">
                {topic.title}
              </h1>
              <p className="text-[16px] text-[var(--ink-secondary)] leading-relaxed">
                {topic.description}
              </p>
            </div>

            {/* DYNAMIC CONTENT RENDERING */}
            {parsedContent ? (
              <div className="flex flex-col gap-10">
                
                {parsedContent.sections ? (
                  parsedContent.sections.map((section: any, idx: number) => (
                    <SectionRenderer 
                      key={idx} 
                      section={section} 
                      selectedOption={selectedOption} 
                      handleQuickCheck={handleQuickCheck} 
                      showExplanation={showExplanation} 
                    />
                  ))
                ) : (
                  <>
                    {/* BACKWARD COMPATIBILITY: OLD HARDCODED JSON STRUCTURE */}
                    {parsedContent.concept && (
                      <section>
                        <h2 className="text-[12px] font-bold text-[var(--ink)] uppercase tracking-wider mb-3 flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-[var(--accent)]" /> Concept
                        </h2>
                        <div className="prose prose-sm sm:prose-base max-w-none text-[var(--ink-secondary)]">
                          <p>{parsedContent.concept}</p>
                        </div>
                      </section>
                    )}

                    {parsedContent.whyItMatters && (
                      <section className="bg-[var(--accent-soft)]/30 border border-[var(--accent-soft-border)] rounded-xl p-6">
                        <h2 className="text-[12px] font-bold text-[var(--accent)] uppercase tracking-wider mb-2 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4" /> Why It Matters
                        </h2>
                        <p className="text-[14px] text-[var(--ink)] leading-relaxed">
                          {parsedContent.whyItMatters}
                        </p>
                      </section>
                    )}

                    {parsedContent.howItWorks && (
                      <section>
                        <h2 className="text-[12px] font-bold text-[var(--ink)] uppercase tracking-wider mb-3">
                          How It Works
                        </h2>
                        <div className="prose prose-sm sm:prose-base max-w-none text-[var(--ink-secondary)] whitespace-pre-wrap">
                          <p>{parsedContent.howItWorks}</p>
                        </div>
                      </section>
                    )}

                    {parsedContent.javaExample && (
                      <section>
                        <h2 className="text-[12px] font-bold text-[var(--ink)] uppercase tracking-wider mb-3 flex items-center gap-2">
                          <Code className="w-4 h-4 text-[var(--accent)]" /> Code Example
                        </h2>
                        <div className="bg-[#1E1E1E] rounded-xl p-5 overflow-x-auto shadow-inner">
                          <pre className="text-[13px] text-gray-300 font-mono">
                            <code>{parsedContent.javaExample}</code>
                          </pre>
                        </div>
                      </section>
                    )}

                    {parsedContent.commonMistakes && parsedContent.commonMistakes.length > 0 && (
                      <section className="bg-[var(--error-soft)]/30 border border-[var(--error-soft-border)] rounded-xl p-6">
                        <h2 className="text-[12px] font-bold text-[var(--error)] uppercase tracking-wider mb-3 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4" /> Common Mistakes
                        </h2>
                        <ul className="list-disc pl-5 space-y-1 text-[14px] text-[var(--ink)]">
                          {parsedContent.commonMistakes.map((mistake: string, idx: number) => (
                            <li key={idx}>{mistake}</li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {parsedContent.quickCheck && (
                      <section className="bg-white border border-[var(--border)] rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-[#FAFAFA] border-b border-[var(--border)] px-6 py-4 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" />
                          <h2 className="text-[12px] font-bold text-[var(--ink)] uppercase tracking-wider">Quick Check</h2>
                        </div>
                        <div className="p-6 flex flex-col gap-4">
                          <p className="text-[15px] font-medium text-[var(--ink)]">
                            {parsedContent.quickCheck.question}
                          </p>
                          <div className="flex flex-col gap-2">
                            {parsedContent.quickCheck.options.map((opt: string, idx: number) => {
                              const isSelected = selectedOption === idx;
                              const isCorrect = idx === parsedContent.quickCheck.answer;
                              const showStatus = selectedOption !== null;
                              
                              return (
                                <button
                                  key={idx}
                                  onClick={() => handleQuickCheck(idx)}
                                  disabled={showStatus}
                                  className={clsx(
                                    "text-left px-4 py-3 rounded-lg border text-[14px] font-medium transition-all",
                                    !showStatus && "hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]/30 border-[var(--border)] bg-white",
                                    showStatus && isCorrect && "bg-[var(--success-soft)] border-[var(--success-soft-border)] text-[var(--success)]",
                                    showStatus && isSelected && !isCorrect && "bg-[var(--error-soft)] border-[var(--error-soft-border)] text-[var(--error)]",
                                    showStatus && !isSelected && !isCorrect && "border-[var(--border)] bg-[#FAFAFA] opacity-50"
                                  )}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                          {showExplanation && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }} 
                              animate={{ opacity: 1, height: 'auto' }} 
                              className="mt-2 text-[14px] text-[var(--ink-secondary)] p-4 bg-[#FAFAFA] rounded-lg border border-[var(--border)]"
                            >
                              <span className="font-bold text-[var(--ink)]">Explanation:</span> {parsedContent.quickCheck.explanation}
                            </motion.div>
                          )}
                        </div>
                      </section>
                    )}
                  </>
                )}

              </div>
            ) : (
              <div className="text-[var(--ink-secondary)]">No content available.</div>
            )}

            {/* MY NOTES SECTION */}
            <section className="mt-4 border-t border-[var(--border)] pt-10">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[14px] font-bold text-[var(--ink)] uppercase tracking-wider">
                  My Notes
                </h2>
                <div className="text-[11px] font-mono text-[var(--ink-tertiary)] flex items-center gap-1.5">
                  {savingNotes && <Loader2 className="w-3 h-3 animate-spin" />}
                  {notesSaved && <Check className="w-3 h-3 text-[var(--success)]" />}
                  {savingNotes ? "Saving..." : notesSaved ? "Saved" : "Auto-saves"}
                </div>
              </div>
              <textarea
                value={notes}
                onChange={handleNotesChange}
                placeholder="Jot down important takeaways, code snippets, or ideas here..."
                className="w-full min-h-[160px] bg-[#FAFAFA] border border-[var(--border)] rounded-xl p-4 text-[14px] text-[var(--ink)] placeholder-[var(--ink-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent resize-y transition-all"
              />
            </section>

            {/* LESSON IN-FLOW NAVIGATION */}
            <div className="pt-8 border-t border-[var(--border)] flex items-center justify-between gap-4 mt-2">
              <div className="flex-1 flex justify-start min-w-0">
                {prevTopic && (
                  <Link 
                    href={`/learn/${subject.slug}/${prevTopic.slug}`}
                    className="inline-flex items-center gap-2 text-[13.5px] font-bold text-[var(--ink-secondary)] hover:text-[var(--ink)] transition-colors truncate group"
                  >
                    <ChevronLeft className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />
                    <span className="truncate">Previous: {prevTopic.title}</span>
                  </Link>
                )}
              </div>

              <div className="flex-1 flex justify-end min-w-0 text-right">
                {nextTopic ? (
                  <Link 
                    href={`/learn/${subject.slug}/${nextTopic.slug}`}
                    className="inline-flex items-center gap-2 text-[13.5px] font-bold text-[var(--ink)] hover:text-[var(--accent)] transition-colors truncate ml-auto group"
                  >
                    <span className="truncate">Next: {nextTopic.title}</span>
                    <ChevronRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ) : (
                  <Link 
                    href={`/learn/${subject.slug}`}
                    className="inline-flex items-center gap-2 text-[13.5px] font-bold text-[var(--accent)] hover:underline transition-colors truncate ml-auto"
                  >
                    <span className="truncate">Course Completed</span>
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  </Link>
                )}
              </div>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
