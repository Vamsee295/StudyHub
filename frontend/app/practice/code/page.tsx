"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Code2, Play, RotateCcw, Settings, Terminal, Download, Maximize2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";

type Language = "python" | "java" | "c" | "cpp";

const STARTER_CODE: Record<Language, string> = {
  python: `def binary_search(arr, target):
    low = 0
    high = len(arr) - 1

    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
            
    return -1

# Test the function
arr = [10, 20, 30, 40, 50]
target = 30
result = binary_search(arr, target)
print(f"Element found at index: {result}")`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello StudyHub Developer!");
    }
}`,
  c: `#include <stdio.h>

int main() {
    printf("Hello StudyHub Developer!\\n");
    return 0;
}`,
  cpp: `#include <iostream>

int main() {
    std::cout << "Hello StudyHub Developer!\\n";
    return 0;
}`
};

export default function CodePlaygroundPage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState<Language>("python");
  const [code, setCode] = useState(STARTER_CODE.python);
  
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<{stdout: string, stderr: string, status: string, time: string, memory: string} | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setCode(STARTER_CODE[lang]);
    setOutput(null);
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput({ stdout: "", stderr: "", status: "Running...", time: "--", memory: "--" });
    
    // Abstracted execution service call (Mocked for now as per instructions to avoid unsafe server execution)
    // In the future, this calls: await executionService.run({ language, code }) -> StudyHub API -> Judge0
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network latency
      
      let mockStdout = "";
      if (language === "python" && code.includes("binary_search")) {
        mockStdout = "Element found at index: 2\\n";
      } else {
        mockStdout = "Hello StudyHub Developer!\\n";
      }

      setOutput({
        stdout: mockStdout,
        stderr: "",
        status: "Accepted",
        time: "0.02s",
        memory: "8.4 MB"
      });
    } catch (err) {
      setOutput({
        stdout: "",
        stderr: "Failed to reach execution service.",
        status: "Execution Error",
        time: "--",
        memory: "--"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(STARTER_CODE[language]);
    setOutput(null);
  };

  if (!mounted) return <div className="p-8 text-[var(--ink-secondary)]">Loading Code Playground...</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full bg-[#1e1e1e]">
      {/* Toolbar */}
      <div className="h-14 border-b border-white/10 bg-[#252526] flex items-center justify-between px-4 shrink-0 text-white">
        <div className="flex items-center gap-3">
          <Link href="/practice" className="text-gray-400 hover:text-white font-medium text-sm flex items-center gap-2">
            Practice
          </Link>
          <span className="text-gray-600">/</span>
          <div className="flex items-center gap-2 font-bold text-sm">
            <Code2 className="w-4 h-4 text-blue-400" /> Code Playground
          </div>
        </div>

        <div className="flex items-center gap-4">
          <select 
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value as Language)}
            className="bg-[#3c3c3c] border-none text-white text-xs rounded px-3 py-1.5 outline-none cursor-pointer hover:bg-[#4d4d4d]"
          >
            <option value="python">Python 3</option>
            <option value="java">Java 21</option>
            <option value="cpp">C++ (GCC)</option>
            <option value="c">C (GCC)</option>
          </select>

          <div className="w-px h-6 bg-white/10"></div>

          <button onClick={resetCode} className="text-gray-400 hover:text-white text-xs flex items-center gap-1.5 cursor-pointer">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
          <button 
            onClick={runCode} 
            disabled={isRunning} 
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs h-8 px-4 rounded flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
          >
            {isRunning ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            Run Code
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Editor Area */}
        <div className="flex-1 border-r border-white/10 flex flex-col relative min-w-0">
          <div className="flex-1">
            <Editor
              height="100%"
              language={language === "cpp" || language === "c" ? "cpp" : language}
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || "")}
              options={{ 
                minimap: { enabled: false }, 
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                padding: { top: 20 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth"
              }}
            />
          </div>
        </div>

        {/* Output Panel (Right side on desktop, bottom on mobile) */}
        <div className="w-full lg:w-[400px] xl:w-[450px] bg-[#1e1e1e] flex flex-col shrink-0 border-t lg:border-t-0 border-white/10">
          <div className="h-10 bg-[#252526] border-b border-white/10 flex items-center px-4">
            <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5" /> Output
            </span>
          </div>
          
          <div className="flex-1 overflow-auto p-4 text-gray-300 font-mono text-sm flex flex-col">
            {output ? (
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                  <span className={`text-xs font-semibold px-2 py-1 rounded \${
                    output.status === "Accepted" ? "bg-emerald-500/20 text-emerald-400" : 
                    output.status === "Running..." ? "bg-blue-500/20 text-blue-400" : 
                    "bg-red-500/20 text-red-400"
                  }`}>
                    {output.status}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>Time: {output.time}</span>
                    <span>Mem: {output.memory}</span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-4">
                  {output.stdout && (
                    <div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Standard Output</div>
                      <pre className="whitespace-pre-wrap break-all text-gray-300">{output.stdout}</pre>
                    </div>
                  )}
                  {output.stderr && (
                    <div>
                      <div className="text-[10px] text-red-500/70 uppercase tracking-wider mb-1">Standard Error</div>
                      <pre className="whitespace-pre-wrap break-all text-red-400">{output.stderr}</pre>
                    </div>
                  )}
                  {!output.stdout && !output.stderr && output.status !== "Running..." && (
                    <div className="text-gray-500 italic">No output produced.</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-600">
                <Play className="w-8 h-8 mb-2 opacity-20" />
                <span className="text-sm">Click Run Code to see output</span>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
