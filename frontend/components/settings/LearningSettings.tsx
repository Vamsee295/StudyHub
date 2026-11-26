"use client";

import { useSyncExternalStore } from "react";
import { clsx } from "clsx";
import { EDITOR_DEFAULTS, useEditorPrefs, useStudyPrefs, type EditorPrefs } from "@/lib/prefs";
import { clearReviewQueues } from "@/lib/learn/study";
import { askConfirm } from "@/components/ui/AskDialog";
import { buttonClass } from "@/components/ui/Button";

const languages: { id: EditorPrefs["language"]; label: string }[] = [
  { id: "java", label: "Java" },
  { id: "python", label: "Python" },
  { id: "cpp", label: "C++" },
];

function Segmented<T extends string | number>({ label, value, options, onChange }: {
  label: string;
  value: T;
  options: { id: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-xl border-[1.5px] border-hair p-1">
      {options.map((o) => (
        <button
          key={String(o.id)}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={clsx(
            "label-cond rounded-lg px-3 py-1.5 text-[15px] transition-colors",
            value === o.id ? "bg-ink text-paper" : "text-ink/70 hover:bg-ink/[0.06] hover:text-ink"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Row({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-between gap-3 border-t-[1.5px] border-hair pt-5 sm:flex-row sm:items-center">
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-[13px] text-mute">{hint}</p>
      </div>
      {children}
    </div>
  );
}

/** Code editor defaults for the problem set. Saved on this device. */
export function CodingSettings() {
  const [prefs, setPrefs] = useEditorPrefs();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="display text-[32px]">Coding</h2>
        <p className="mt-1 text-sm text-body">Defaults for the problem editor. Saved on this device.</p>
      </div>

      <Row title="Default language" hint="New problems open in this language. You can still switch per problem.">
        <Segmented label="Default language" value={prefs.language} options={languages} onChange={(language) => setPrefs({ language })} />
      </Row>

      <Row title="Editor font size" hint={`${prefs.fontSize}px`}>
        <input
          type="range"
          min={11}
          max={20}
          value={prefs.fontSize}
          onChange={(e) => setPrefs({ fontSize: Number(e.target.value) })}
          aria-label="Editor font size"
          aria-valuetext={`${prefs.fontSize} pixels`}
          className="w-48 accent-[var(--accent)]"
        />
      </Row>

      <Row title="Tab size" hint="Spaces inserted for one indent.">
        <Segmented label="Tab size" value={prefs.tabSize} options={[{ id: 2, label: "2" }, { id: 4, label: "4" }]} onChange={(tabSize) => setPrefs({ tabSize })} />
      </Row>

      <label className="flex cursor-pointer items-center justify-between gap-4 border-t-[1.5px] border-hair pt-5">
        <span>
          <span className="block font-semibold">Wrap long lines</span>
          <span className="block text-[13px] text-mute">Long lines wrap instead of scrolling sideways.</span>
        </span>
        <input type="checkbox" checked={prefs.wordWrap} onChange={(e) => setPrefs({ wordWrap: e.target.checked })} className="size-5 shrink-0 cursor-pointer accent-ink" />
      </label>

      <label className="flex cursor-pointer items-center justify-between gap-4 border-t-[1.5px] border-hair pt-5">
        <span>
          <span className="block font-semibold">Show minimap</span>
          <span className="block text-[13px] text-mute">A small overview of the file at the editor&apos;s right edge.</span>
        </span>
        <input type="checkbox" checked={prefs.minimap} onChange={(e) => setPrefs({ minimap: e.target.checked })} className="size-5 shrink-0 cursor-pointer accent-ink" />
      </label>

      <div className="border-t-[1.5px] border-hair pt-5">
        <pre
          aria-label="Preview"
          className="overflow-x-auto rounded-xl bg-night p-4 font-mono text-[#f5efe6]"
          style={{ fontSize: prefs.fontSize, lineHeight: 1.7, tabSize: prefs.tabSize, whiteSpace: prefs.wordWrap ? "pre-wrap" : "pre" }}
        >
          {`for (int i = 0; i < n; i++) {\n\tif (nums[i] == target) return i;  // a long comment to show how wrapping behaves in the editor\n}`}
        </pre>
        <button type="button" onClick={() => setPrefs(EDITOR_DEFAULTS)} className="mt-3 text-[13px] font-semibold text-accent-ink hover:underline">
          Reset to defaults
        </button>
      </div>
    </div>
  );
}

const noop = () => () => {};
const detectMac = () => /Mac|iPhone|iPad/.test(navigator.platform);

const shortcuts: { area: string; items: [string[], string][] }[] = [
  { area: "Anywhere", items: [[["Mod", "K"], "Search lessons and notes"], [["Mod", "B"], "Collapse or expand the sidebar"], [["Esc"], "Close a dialog or menu"]] },
  { area: "Problem editor", items: [[["Mod", "Enter"], "Run against the example tests"], [["Mod", "Shift", "Enter"], "Submit against all tests"]] },
  { area: "Search", items: [[["↑", "↓"], "Move through results"], [["Enter"], "Open the selected lesson"]] },
  { area: "Companies", items: [[["Mod", "F"], "Search companies"]] },
];

export function ShortcutsSettings() {
  const isMac = useSyncExternalStore(noop, detectMac, () => false);
  const mod = isMac ? "⌘" : "Ctrl";
  return (
    <div className="space-y-8">
      <div>
        <h2 className="display text-[32px]">Keyboard shortcuts</h2>
        <p className="mt-1 text-sm text-body">{isMac ? "⌘ is the Command key." : "On a Mac, use ⌘ instead of Ctrl."}</p>
      </div>
      {shortcuts.map((g) => (
        <section key={g.area}>
          <h3 className="eyebrow mb-2">{g.area}</h3>
          <dl className="border-t-[1.5px] border-hair">
            {g.items.map(([keys, what]) => (
              <div key={what} className="flex items-center justify-between gap-4 border-b-[1.5px] border-hair py-3">
                <dt className="text-[15px]">{what}</dt>
                <dd className="flex shrink-0 gap-1">
                  {keys.map((k) => (
                    <kbd key={k} className="rounded-md border-[1.5px] border-line bg-paper px-2 py-0.5 font-mono text-[12px] shadow-[0_2px_0_var(--hard)]">
                      {k === "Mod" ? mod : k}
                    </kbd>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}

const notificationTypes: { id: string; label: string; hint: string }[] = [
  { id: "LESSON_COMPLETED", label: "Lesson completed", hint: "Each time you finish a lesson." },
  { id: "COURSE_MILESTONE", label: "Course milestones", hint: "Halfway, finished, and similar." },
  { id: "DSA_PROBLEM_SOLVED", label: "Problem solved", hint: "Each accepted submission." },
  { id: "DSA_MILESTONE", label: "Problem milestones", hint: "Solved counts like 10, 50, 100." },
  { id: "NEW_RESOURCE", label: "New resources", hint: "Notes and guides added to the library." },
  { id: "PLACEMENT_UPDATE", label: "Placement updates", hint: "Company and hiring news." },
  { id: "POST_LIKED", label: "Likes on your posts", hint: "Someone upvotes what you posted in Community." },
  { id: "POST_REPLY", label: "Replies to your posts", hint: "Someone replies to what you posted in Community." },
  { id: "MENTION", label: "Mentions", hint: "Someone @-mentions you in a Community reply." },
];

const batches = [
  { id: 0, label: "All due" },
  { id: 10, label: "10" },
  { id: 20, label: "20" },
  { id: 50, label: "50" },
];

/** Study behaviour and notification choices. Saved on this device. */
export function StudySettings() {
  const [prefs, setPrefs] = useStudyPrefs();
  const muted = new Set(prefs.mutedNotifications);
  const toggleType = (id: string, on: boolean) => {
    const next = new Set(muted);
    if (on) next.delete(id);
    else next.add(id);
    setPrefs({ mutedNotifications: [...next] });
  };
  const resetReview = async () => {
    const ok = await askConfirm("Reset all review queues?", {
      body: "Every question waiting for review in every course is removed. Your lesson progress and test history stay.",
      ok: "Reset queues",
      danger: true,
    });
    if (ok) clearReviewQueues();
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="display text-[32px]">Learning</h2>
        <p className="mt-1 text-sm text-body">How lessons, reviews and notifications behave. Saved on this device.</p>
      </div>

      <section className="space-y-5">
        <h3 className="eyebrow">Lessons</h3>
        <label className="flex cursor-pointer items-center justify-between gap-4 border-t-[1.5px] border-hair pt-5">
          <span>
            <span className="block font-semibold">Mark complete when I reach the end</span>
            <span className="block text-[13px] text-mute">Skips the Mark complete button once you&apos;ve scrolled to the end of a lesson.</span>
          </span>
          <input type="checkbox" checked={prefs.autoComplete} onChange={(e) => setPrefs({ autoComplete: e.target.checked })} className="size-5 shrink-0 cursor-pointer accent-ink" />
        </label>
      </section>

      <section className="space-y-5">
        <h3 className="eyebrow">Review queue</h3>
        <Row title="Questions per review session" hint="The rest stay due for your next session.">
          <Segmented label="Questions per review session" value={prefs.reviewBatch} options={batches} onChange={(reviewBatch) => setPrefs({ reviewBatch })} />
        </Row>
        <Row title="Reset review queues" hint="Start spaced review from scratch in every course.">
          <button type="button" onClick={resetReview} className={buttonClass("secondary", "sm")}>Reset queues</button>
        </Row>
      </section>

      <section>
        <h3 className="eyebrow mb-1">Notifications</h3>
        <p className="mb-2 text-[13px] text-mute">Choose what appears in the bell. Important account and system notices always show.</p>
        <div className="border-t-[1.5px] border-hair">
          {notificationTypes.map((t) => (
            <label key={t.id} className="flex cursor-pointer items-center justify-between gap-4 border-b-[1.5px] border-hair py-3">
              <span>
                <span className="block font-semibold">{t.label}</span>
                <span className="block text-[13px] text-mute">{t.hint}</span>
              </span>
              <input type="checkbox" checked={!muted.has(t.id)} onChange={(e) => toggleType(t.id, e.target.checked)} className="size-5 shrink-0 cursor-pointer accent-ink" />
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}
