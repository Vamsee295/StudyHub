import React, { useState } from "react";
import { UserProfile } from "@/types";
import { ArrowRight, CheckCircle2, Edit3, Loader2 } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";

interface StepCompletionOverlayProps {
  profile: UserProfile;
  onComplete: () => void | Promise<void>;
  onEdit: () => void;
}

/** Last onboarding step: a summary of the choices, then save. (No fake "calibrating" delay: saving is the only work.) */
export default function StepCompletionOverlay({ profile, onComplete, onEdit }: StepCompletionOverlayProps) {
  const [saving, setSaving] = useState(false);
  const summary = [
    ["Track", profile.careerTracks[0] || "Software Engineer"],
    ["Placement season", profile.identity?.driveCycle || "Not set"],
    ["Target companies", profile.targets?.companies?.length ? profile.targets.companies.join(", ") : "None yet"],
  ];

  return (
    <div className="flex flex-col items-center gap-6 py-4 text-center">
      <span className="grid size-16 place-items-center rounded-full border-[2.4px] border-line bg-note text-paper">
        <CheckCircle2 className="size-8" aria-hidden />
      </span>
      <div className="max-w-lg">
        <h2 className="display text-[36px] md:text-[44px]">You&apos;re set</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-body">Here&apos;s what you picked. You can change any of it later in your profile.</p>
      </div>

      <dl className="w-full rounded-2xl border-[1.5px] border-hair bg-paper-2 p-5 text-left">
        {summary.map(([k, v]) => (
          <div key={k} className="flex flex-wrap items-baseline justify-between gap-2 border-b-[1.5px] border-hair py-2.5 last:border-0">
            <dt className="font-mono text-[11px] uppercase tracking-wider text-mute">{k}</dt>
            <dd className="text-[15px] font-medium">{v}</dd>
          </div>
        ))}
        <button onClick={onEdit} className="mt-3 inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider text-accent-ink hover:underline">
          <Edit3 className="size-3.5" /> Change something
        </button>
      </dl>

      <button
        onClick={async () => {
          setSaving(true);
          await onComplete();
        }}
        disabled={saving}
        className={buttonClass("accent", "lg")}
      >
        {saving ? <Loader2 className="size-5 animate-spin" /> : null}
        {saving ? "Saving" : "Go to my dashboard"}
        {!saving && <ArrowRight className="size-5" />}
      </button>
    </div>
  );
}
