"use client";

import Link from "next/link";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Play, Layout, Terminal, Code2, Database, Check } from "lucide-react";
import { practiceApi, PracticeSet, PracticeQuestion } from "@/lib/api/practice";
import { AITutorChat } from "@/components/practice/AITutorChat";
import { MessageSquare } from "lucide-react";

export default function PracticeSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [practiceSet, setPracticeSet] = useState<PracticeSet | null>(null);
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"problem" | "tutor">("problem");
  
  useEffect(() => {
    async function loadSet() {
      try {
        const data = await practiceApi.getPracticeSet(id);
        if (data.set) setPracticeSet(data.set);
        if (data.questions) setQuestions(data.questions);
      } catch (err) {
        console.error("Failed to load practice set", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSet();
  }, [id]);

  const handleSubmit = async () => {
    if (!practiceSet) return;
    setIsSubmitting(true);
    try {
      // Mock score: assume they got all questions right for now
      await practiceApi.createAttempt(practiceSet.id, questions.length, questions.length, 300);
      router.push("/practice");
    } catch (err) {
      console.error("Failed to submit attempt", err);
      setIsSubmitting(false);
    }
  };

  const title = practiceSet?.title || "Practice Session";
  const desc = practiceSet ? `${practiceSet.domain.toUpperCase()} · ${practiceSet.difficulty.toUpperCase()}` : "Interactive Workspace";

  return (
    <div className="min-h-[80vh] flex flex-col bg-[var(--canvas)] -mt-8 -mx-6 rounded-t-xl overflow-hidden border-t border-[var(--border)]">
      {/* Session Topbar */}
      <header className="h-14 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/practice" className="text-[var(--ink-secondary)] hover:text-[var(--ink)] transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="h-4 w-px bg-[var(--border)]"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-[var(--ink-tertiary)] uppercase tracking-wider">{desc}</span>
            <span className="text-[13px] font-semibold text-[var(--ink)]">{title}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--ink-secondary)] hover:text-[var(--ink)] px-3 py-1.5 rounded-md hover:bg-[var(--surface-subdued)] transition-colors">
            <Layout className="w-3.5 h-3.5" />
            Workspace Layout
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting || isLoading}
            className="flex items-center gap-1.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-4 py-1.5 rounded-md text-[12px] font-semibold transition-colors disabled:opacity-50"
          >
            {isSubmitting ? <span className="animate-pulse">Submitting...</span> : (
              <>
                <Check className="w-3.5 h-3.5" />
                Submit Attempt
              </>
            )}
          </button>
        </div>
      </header>
      
      {/* Workspace Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Problem Statement & Tutor */}
        <div className="w-full md:w-[40%] bg-[var(--surface)] border-r border-[var(--border)] flex flex-col h-full overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-[var(--border)] bg-[var(--surface-subdued)]">
            <button
              onClick={() => setActiveTab("problem")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[12px] font-semibold transition-colors ${
                activeTab === "problem" 
                  ? "text-[var(--ink)] bg-[var(--surface)] border-b-2 border-b-[var(--accent)]" 
                  : "text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface-hover)]"
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              Problem
            </button>
            <button
              onClick={() => setActiveTab("tutor")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[12px] font-semibold transition-colors ${
                activeTab === "tutor" 
                  ? "text-[var(--accent)] bg-[var(--surface)] border-b-2 border-b-[var(--accent)]" 
                  : "text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface-hover)]"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              AI Tutor
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === "problem" ? (
              <div className="p-6">
                <h1 className="text-xl font-bold text-[var(--ink)] mb-4">{title}</h1>
                
                {isLoading ? (
                  <div className="text-[var(--ink-tertiary)]">Loading problem statements...</div>
                ) : (
                  <div className="prose prose-sm max-w-none text-[var(--ink)] prose-headings:font-bold prose-headings:text-[var(--ink)] prose-a:text-[var(--accent)] flex flex-col gap-8">
                    {questions.map((q, i) => (
                      <div key={q.id} className="border-b border-[var(--border)] pb-6 last:border-0">
                        <h3 className="text-[16px] font-bold mb-2">Question {i + 1}: {q.title}</h3>
                        <p className="text-[14px] leading-relaxed mb-4">{q.problem_statement}</p>
                        <div className="text-[12px] text-[var(--ink-secondary)] font-mono bg-[var(--surface-subdued)] p-2 rounded">
                          <span className="font-semibold">Hint:</span> {q.explanation}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              questions.length > 0 && <AITutorChat questionId={questions[0].id} />
            )}
          </div>
        </div>
        
        {/* Right: Code Editor & Terminal */}
        <div className="w-full md:w-[60%] flex flex-col bg-[#1e1e1e]">
          {/* Editor Header */}
          <div className="h-10 bg-[#252526] border-b border-[#333] flex items-center px-4">
            <div className="flex items-center gap-2 text-[#cccccc] text-[12px] font-medium bg-[#1e1e1e] border-t border-l border-r border-[#333] h-full px-3 pt-1 border-t-[var(--accent)] border-t-2">
              <Code2 className="w-3.5 h-3.5" />
              Solution.java
            </div>
            {typeof id === 'string' && id.includes('sql') && (
              <div className="flex items-center gap-2 text-[#cccccc]/50 text-[12px] font-medium hover:bg-[#1e1e1e] hover:text-[#cccccc] h-full px-3 cursor-pointer transition-colors">
                <Database className="w-3.5 h-3.5" />
                query.sql
              </div>
            )}
          </div>
          
          {/* Editor Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            <pre className="text-[13px] font-mono text-[#d4d4d4] leading-relaxed">
{`class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Implement your solution here
        
    }
}`}
            </pre>
          </div>
          
          {/* Terminal / Test Cases */}
          <div className="h-48 border-t border-[#333] bg-[#1e1e1e] flex flex-col">
            <div className="h-8 bg-[#252526] flex items-center px-4 text-[#cccccc] text-[11px] font-semibold uppercase tracking-wider gap-4">
              <span className="text-[var(--accent-soft-border)]">Test Cases</span>
              <span className="text-[#cccccc]/50 hover:text-[#cccccc] cursor-pointer transition-colors">Test Result</span>
            </div>
            <div className="p-4">
              <div className="flex gap-2 mb-3">
                <button className="bg-[#2d2d2d] hover:bg-[#3d3d3d] text-[#cccccc] text-[12px] px-3 py-1.5 rounded transition-colors">Case 1</button>
                <button className="bg-[#2d2d2d] hover:bg-[#3d3d3d] text-[#cccccc]/50 text-[12px] px-3 py-1.5 rounded transition-colors">Case 2</button>
                <button className="bg-[#2d2d2d] hover:bg-[#3d3d3d] text-[#cccccc]/50 text-[12px] px-3 py-1.5 rounded transition-colors">Case 3</button>
              </div>
              
              <div className="text-[#cccccc] text-[12px] font-mono flex flex-col gap-2">
                <div><span className="text-[#cccccc]/50">nums =</span> [2,7,11,15]</div>
                <div><span className="text-[#cccccc]/50">target =</span> 9</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
