"use client";

import { Keyboard } from "lucide-react";
import { useEffect, useState } from "react";
import { clsx } from "clsx";

export function PracticeShortcutsBar() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <div className="bg-[var(--navy)]/95 backdrop-blur-md border border-white/10 shadow-2xl rounded-full px-5 py-2.5 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-white/50" />
          <span className="text-[12px] font-semibold text-white/90">Interactive Mode</span>
        </div>
        
        <div className="h-4 w-px bg-white/20"></div>
        
        <div className="flex items-center gap-4 text-[12px] text-white/70">
          <div className="flex items-center gap-1.5">
            <kbd className="bg-white/10 border border-white/20 rounded px-1.5 py-0.5 font-mono text-[10px]">⌘P</kbd>
            <span>Search</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="bg-white/10 border border-white/20 rounded px-1.5 py-0.5 font-mono text-[10px]">↵</kbd>
            <span>Launch Active</span>
          </div>
        </div>

        <div className="h-4 w-px bg-white/20"></div>

        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--success)]"></span>
          </span>
          <span className="text-[11px] font-mono font-medium text-[var(--success)]">Session Ready</span>
        </div>
      </div>
    </div>
  );
}
