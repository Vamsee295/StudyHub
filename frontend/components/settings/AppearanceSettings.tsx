"use client";

import { clsx } from "clsx";
import { Check } from "lucide-react";
import { useTheme, type Theme } from "@/lib/theme";
import { READING_SCALE, useReadingSize, type ReadingSize } from "@/lib/prefs";

const options: { id: Theme; label: string; hint: string; swatch: [string, string, string] }[] = [
  { id: "paper", label: "Paper", hint: "Cream paper, ink type", swatch: ["#f5efe6", "#191614", "#c8603a"] },
  { id: "dark", label: "Dark", hint: "Ink paper for late nights", swatch: ["#121110", "#f5efe6", "#c8603a"] },
  { id: "system", label: "System", hint: "Follows your device", swatch: ["#f5efe6", "#121110", "#c8603a"] },
];

const sizes: { id: ReadingSize; label: string }[] = [
  { id: "sm", label: "Small" },
  { id: "md", label: "Default" },
  { id: "lg", label: "Large" },
  { id: "xl", label: "Extra large" },
];

/** Theme, reading size + motion. Saved on this device (localStorage), applied before first paint by THEME_SCRIPT. */
export function AppearanceSettings() {
  const { theme, setTheme, reduceMotion, setReduceMotion } = useTheme();
  const [readingSize, setReadingSize] = useReadingSize();
  return (
    <div className="space-y-8">
      <div>
        <h2 className="display text-[32px]">Appearance</h2>
        <p className="mt-1 text-sm text-body">Saved on this device.</p>
      </div>

      <fieldset>
        <legend className="eyebrow mb-3">Theme</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          {options.map((o) => {
            const on = theme === o.id;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => setTheme(o.id)}
                aria-pressed={on}
                className={clsx(
                  "no-press rounded-2xl border-[2.4px] bg-card p-3 text-left transition-[transform,box-shadow] duration-150",
                  on ? "border-line shadow-[4px_5px_0_var(--hard)]" : "border-hair hover:border-line"
                )}
              >
                <span
                  aria-hidden
                  className="mb-3 flex h-16 items-end gap-1.5 rounded-xl border-2 border-line p-2"
                  style={{ background: o.swatch[0] }}
                >
                  <span className="h-6 w-10 rounded-md" style={{ background: o.swatch[1] }} />
                  <span className="h-4 w-6 rounded-md" style={{ background: o.swatch[2] }} />
                </span>
                <span className="flex items-center justify-between">
                  <span className="label-cond text-[17px]">{o.label}</span>
                  {on && <Check className="size-4 text-accent-ink" />}
                </span>
                <span className="block text-[13px] text-mute">{o.hint}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="border-t-[1.5px] border-hair pt-6">
        <legend className="sr-only">Lesson text size</legend>
        <p className="font-semibold">Lesson text size</p>
        <p className="mb-3 text-[13px] text-mute">Scales lesson text, code and diagrams while you read.</p>
        <div role="radiogroup" aria-label="Lesson text size" className="inline-flex flex-wrap gap-1 rounded-xl border-[1.5px] border-hair p-1">
          {sizes.map((s) => (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={readingSize === s.id}
              onClick={() => setReadingSize(s.id)}
              className={clsx(
                "label-cond rounded-lg px-3 py-1.5 text-[15px] transition-colors",
                readingSize === s.id ? "bg-ink text-paper" : "text-ink/70 hover:bg-ink/[0.06] hover:text-ink"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p className="mt-3 rounded-xl bg-paper-2 px-4 py-3 text-[16px] leading-relaxed" style={{ zoom: READING_SCALE[readingSize] }}>
          A variable is a named storage location that holds a value your program can read and change.
        </p>
      </fieldset>

      <label className="flex cursor-pointer items-center justify-between gap-4 border-t-[1.5px] border-hair pt-6">
        <span>
          <span className="block font-semibold">Reduce motion</span>
          <span className="block text-[13px] text-mute">Turns off page slides and animations.</span>
        </span>
        <input
          type="checkbox"
          checked={reduceMotion}
          onChange={(e) => setReduceMotion(e.target.checked)}
          className="size-5 shrink-0 cursor-pointer accent-ink"
        />
      </label>
    </div>
  );
}
