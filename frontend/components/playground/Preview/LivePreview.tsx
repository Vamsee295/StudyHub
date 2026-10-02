"use client";

import React, { useEffect, useRef, useState } from "react";
import type { ConsoleMessage, PreviewViewport } from "@/types/playground";

interface LivePreviewProps {
  blobUrl: string | null;
  onConsoleMessage: (msg: Omit<ConsoleMessage, "id" | "timestamp">) => void;
  onRefresh?: () => void;
}

export default function LivePreview({
  blobUrl,
  onConsoleMessage,
  onRefresh,
}: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const onMessageRef = useRef(onConsoleMessage);
  onMessageRef.current = onConsoleMessage;

  const [viewport, setViewport] = useState<PreviewViewport>("desktop");

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

  const handleOpenInNewTab = () => {
    if (blobUrl) {
      window.open(blobUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="ide-preview-wrapper">
      {/* Viewport & controls toolbar */}
      <div className="ide-preview-controls-bar">
        <div className="ide-preview-viewport-group">
          <button
            type="button"
            className={`ide-preview-vp-btn ${viewport === "desktop" ? "active" : ""}`}
            onClick={() => setViewport("desktop")}
            title="Desktop view (100%)"
          >
            🖥️ Full
          </button>
          <button
            type="button"
            className={`ide-preview-vp-btn ${viewport === "tablet" ? "active" : ""}`}
            onClick={() => setViewport("tablet")}
            title="Tablet view (768px)"
          >
            📱 Tablet
          </button>
          <button
            type="button"
            className={`ide-preview-vp-btn ${viewport === "mobile" ? "active" : ""}`}
            onClick={() => setViewport("mobile")}
            title="Mobile view (375px)"
          >
            📲 Mobile
          </button>
        </div>

        <div className="ide-preview-action-group">
          {blobUrl && (
            <button
              type="button"
              className="ide-preview-header-btn"
              onClick={handleOpenInNewTab}
              title="Open preview in new tab"
            >
              ↗ Popout
            </button>
          )}
          {onRefresh && (
            <button
              type="button"
              className="ide-preview-header-btn"
              onClick={onRefresh}
              title="Reload preview"
            >
              ↻ Refresh
            </button>
          )}
        </div>
      </div>

      {/* Frame Container */}
      <div className={`ide-preview-viewport-container viewport-${viewport}`}>
        {!blobUrl ? (
          <div className="ide-preview-placeholder">
            <div className="ide-preview-placeholder-inner">
              <div className="ide-preview-icon">▶</div>
              <p>
                Click <strong>Run Code</strong> (Ctrl+Enter) to see live preview
              </p>
            </div>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={blobUrl}
            className="ide-preview-iframe"
            sandbox="allow-scripts allow-modals allow-forms allow-popups"
            title="Live Preview"
          />
        )}
      </div>
    </div>
  );
}
