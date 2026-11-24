"use client";

import dynamic from "next/dynamic";
import { Database } from "lucide-react";

// Dynamically import the SQL Lab to prevent SSR issues with SQLite WASM and IndexedDB
const SQLLab = dynamic(() => import("@/components/sql/SQLLab"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full flex-col bg-paper-2 items-center justify-center text-body gap-4">
      <Database className="w-8 h-8 animate-pulse text-accent" />
      <div className="text-sm">Initializing SQL Engine...</div>
    </div>
  )
});

export default function SQLLabPage() {
  return <SQLLab />;
}

