"use client";

import "@/components/playground/WebIDE.css";
import CodeIDE from "@/components/playground/CodeIDE";

export default function CodePlaygroundPage() {
  return (
    <div className="h-full w-full overflow-hidden">
      <h1 className="sr-only">Code playground</h1>
      <CodeIDE />
    </div>
  );
}

