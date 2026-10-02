"use client";

import dynamic from "next/dynamic";
import { Database } from "lucide-react";

// Dynamically import the SQL Lab to prevent SSR issues with SQLite WASM and IndexedDB
const SQLLab = dynamic(() => import("@/components/sql/SQLLab"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full bg-[var(--surface-subdued)] items-center justify-center text-[var(--ink-secondary)] gap-4">
      <Database className="w-8 h-8 animate-pulse text-emerald-500 opacity-50" />
      <div className="text-sm">Initializing SQL Engine...</div>
    </div>
  )
});

export default function SQLLabPage() {
  return <SQLLab />;
}

