"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { flush, pull, setSyncEnabled } from "@/lib/sync/userSync";

const REFOCUS_PULL_MS = 60_000;

/** Keeps this browser's study data in sync with the signed-in account. Renders nothing. */
export function SyncManager() {
  const { user, loading } = useAuth();
  const userId = user?.id ?? null;

  useEffect(() => {
    if (loading) return;
    // another account's data was swapped out: reload so nothing already read into memory leaks across
    if (setSyncEnabled(userId)) {
      window.location.reload();
      return;
    }
    if (!userId) return;

    let lastPull = Date.now();
    void pull();

    // Pull again when the tab regains focus (another device may have changed things),
    // and push pending changes when it's hidden.
    const onVisibility = () => {
      if (document.visibilityState === "hidden") { void flush(); return; }
      if (Date.now() - lastPull > REFOCUS_PULL_MS) { lastPull = Date.now(); void pull(); }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      void flush();
    };
  }, [userId, loading]);

  return null;
}
