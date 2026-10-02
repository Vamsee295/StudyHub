"use client";

import "@/components/playground/WebIDE.css";
import CodeIDE from "@/components/playground/CodeIDE";

export default function CodePlaygroundPage() {
  return (
    <div style={{ height: "calc(100vh - 64px)", width: "100%", overflow: "hidden" }}>
      <CodeIDE />
    </div>
  );
}

