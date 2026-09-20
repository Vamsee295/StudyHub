import Link from "next/link";
import { ArrowLeft, Play, Layout, Terminal, Code2, Database } from "lucide-react";
import { quickSprints, recommendedDiagnostics, placementSimulations } from "@/lib/data/practiceData";

// Generate static params for existing practice IDs if desired
export function generateStaticParams() {
  const sprintIds = quickSprints.map(s => ({ id: s.id }));
  const diagIds = recommendedDiagnostics.map(d => ({ id: d.id }));
  const simIds = placementSimulations.map(s => ({ id: s.id }));
  
  return [...sprintIds, ...diagIds, ...simIds];
}

export default async function PracticeSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  // Try to find what they clicked
  const sprint = quickSprints.find(s => s.id === id);
  const diag = recommendedDiagnostics.find(d => d.id === id);
  const sim = placementSimulations.find(s => s.id === id);
  
  const title = sprint?.title || diag?.title || sim?.title || "Practice Session";
  const desc = sprint?.tag || diag?.badge || sim?.companyTag || "Interactive Workspace";

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
          <button className="flex items-center gap-1.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-4 py-1.5 rounded-md text-[12px] font-semibold transition-colors">
            <Play className="w-3.5 h-3.5" />
            Run Code
          </button>
        </div>
      </header>
      
      {/* Workspace Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Problem Statement */}
        <div className="w-full md:w-[40%] bg-[var(--surface)] border-r border-[var(--border)] flex flex-col overflow-y-auto">
          <div className="p-6">
            <h1 className="text-xl font-bold text-[var(--ink)] mb-4">{title}</h1>
            
            <div className="prose prose-sm max-w-none text-[var(--ink)] prose-headings:font-bold prose-headings:text-[var(--ink)] prose-a:text-[var(--accent)]">
              <p className="text-[14px] leading-relaxed mb-6">
                Welcome to the interactive session for <strong>{title}</strong>. This is a placeholder workspace designed to demonstrate the routing structure.
              </p>
              
              <div className="bg-[var(--surface-subdued)] border border-[var(--border)] rounded-lg p-4 mb-6">
                <h3 className="text-[13px] font-semibold mb-2 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4" /> Example Input
                </h3>
                <pre className="text-[12px] font-mono bg-[var(--canvas)] border border-[var(--border)] rounded p-2 text-[var(--ink-secondary)]">
                  {`Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].`}
                </pre>
              </div>
            </div>
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
            {id.includes('sql') && (
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
