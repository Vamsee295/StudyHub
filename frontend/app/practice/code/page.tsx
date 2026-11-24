"use client";

import "@/components/playground/WebIDE.css";
import CodeIDE from "@/components/playground/CodeIDE";

export default function CodePlaygroundPage() {
  return (
    <div className="h-full w-full overflow-hidden">
      <CodeIDE />
    </div>
  );
}

