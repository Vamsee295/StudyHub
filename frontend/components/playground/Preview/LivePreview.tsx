"use client";

import React, { useEffect, useRef } from "react";
import type { ConsoleMessage } from "@/types/playground";

interface LivePreviewProps {
  blobUrl: string | null;
  onConsoleMessage: (msg: Omit<ConsoleMessage, "id" | "timestamp">) => void;
}

export default function LivePreview({ blobUrl, onConsoleMessage }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const onMessageRef = useRef(onConsoleMessage);
  onMessageRef.current = onConsoleMessage;

  // Listen for postMessage from sandboxed iframe
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (!event.data || event.data.type !== "console") return;
      onMessageRef.current({
        level: event.data.level,
        message: event.data.message,
        sourceFile: event.data.sourceFile,
        lineNumber: event.data.lineNumber,
      });
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  if (!blobUrl) {
    return (
      <div className="ide-preview-placeholder">
        <div className="ide-preview-placeholder-inner">
          <div className="ide-preview-icon">▶</div>
          <p>Click <strong>Run Code</strong> to see the preview</p>
        </div>
      </div>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      src={blobUrl}
      className="ide-preview-iframe"
      sandbox="allow-scripts allow-modals allow-forms allow-popups"
      title="Live Preview"
    />
  );
}
