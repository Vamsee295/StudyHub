// Theme + motion preferences. Stored per device in localStorage (a display choice, not account data).
import { useSyncExternalStore } from "react";

export type Theme = "paper" | "dark" | "system";
import { THEME_KEY, MOTION_KEY } from "./theme-script";

const listeners = new Set<() => void>();
const read = (k: string) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const write = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v);
  } catch {}
  listeners.forEach((l) => l());
};
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

/** Applies the resolved theme to <html>; call after changing the stored choice or when the OS flips. */
export function applyTheme() {
  const choice = (read(THEME_KEY) as Theme) || "paper";
  const dark = choice === "dark" || (choice === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  const h = document.documentElement;
  h.dataset.theme = dark ? "dark" : "paper";
  h.classList.toggle("theme-dark", dark);
  h.classList.toggle("theme-paper", !dark);
  h.classList.toggle("reduce-motion", read(MOTION_KEY) === "1");
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#121110" : "#f5efe6");
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, () => (read(THEME_KEY) as Theme) || "paper", () => "paper" as Theme);
  const reduceMotion = useSyncExternalStore(subscribe, () => read(MOTION_KEY) === "1", () => false);
  return {
    theme,
    reduceMotion,
    setTheme: (t: Theme) => (write(THEME_KEY, t), applyTheme()),
    setReduceMotion: (on: boolean) => (write(MOTION_KEY, on ? "1" : "0"), applyTheme()),
  };
}
