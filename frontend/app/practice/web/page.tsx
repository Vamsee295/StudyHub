"use client";

import "@/components/playground/WebIDE.css";
import dynamic from "next/dynamic";

const WebIDE = dynamic(
  () => import("@/components/playground/WebIDE"),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#1e1e1e",
          color: "#888",
          fontFamily: "system-ui, sans-serif",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            border: "3px solid #333",
            borderTopColor: "#3b82f6",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <p>Loading Web IDE...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    ),
  }
);

export default function WebPlaygroundPage() {
  return <WebIDE />;
}
