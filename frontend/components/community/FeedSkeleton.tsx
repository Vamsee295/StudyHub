"use client";

import React from "react";

export function FeedSkeleton() {
  return (
    <div className="flex flex-col gap-4 py-6" aria-busy="true" aria-label="Loading feed">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-5 animate-pulse"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-gray-200" />
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="h-3 bg-gray-200 rounded-full w-32" />
              <div className="h-2.5 bg-gray-100 rounded-full w-20" />
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full w-12" />
          </div>
          {/* Badge */}
          <div className="h-5 bg-blue-50 rounded-full w-36 mb-3" />
          {/* Title */}
          <div className="h-3.5 bg-gray-200 rounded-full w-3/4 mb-2" />
          {/* Content */}
          <div className="flex flex-col gap-2 mb-4">
            <div className="h-3 bg-gray-100 rounded-full w-full" />
            <div className="h-3 bg-gray-100 rounded-full w-5/6" />
            <div className="h-3 bg-gray-100 rounded-full w-2/3" />
          </div>
          {/* Tags */}
          <div className="flex gap-2 mb-4">
            <div className="h-5 bg-gray-100 rounded-md w-14" />
            <div className="h-5 bg-gray-100 rounded-md w-10" />
            <div className="h-5 bg-gray-100 rounded-md w-16" />
          </div>
          {/* Action bar */}
          <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
            <div className="flex gap-4">
              <div className="h-4 bg-gray-100 rounded-full w-10" />
              <div className="h-4 bg-gray-100 rounded-full w-8" />
            </div>
            <div className="h-4 bg-gray-100 rounded-full w-28" />
          </div>
        </div>
      ))}
    </div>
  );
}
