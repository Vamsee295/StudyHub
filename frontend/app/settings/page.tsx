"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, Code2, Database, Download, Keyboard, Lock, LogOut, MonitorSmartphone, Sun, User } from "lucide-react";
import { clsx } from "clsx";
import { useAuth } from "@/components/providers/AuthProvider";
import { useProfile } from "@/components/providers/ProfileProvider";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { PageHeader } from "@/components/ui/Page";
import { buttonClass } from "@/components/ui/Button";
import { askConfirm } from "@/components/ui/AskDialog";
import { DeleteAccount, PasswordForm } from "@/components/settings/AccountSecurity";
import { CodingSettings, ShortcutsSettings, StudySettings } from "@/components/settings/LearningSettings";

type TabType = "account" | "appearance" | "learning" | "coding" | "shortcuts" | "password" | "data";

const tabs: { id: TabType; name: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "account", name: "Account", icon: User },
  { id: "appearance", name: "Appearance", icon: Sun },
  { id: "learning", name: "Learning", icon: BookOpenCheck },
  { id: "coding", name: "Coding", icon: Code2 },
  { id: "shortcuts", name: "Shortcuts", icon: Keyboard },
  { id: "password", name: "Password", icon: Lock },
  { id: "data", name: "Your data", icon: Database },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const { draftProfile: profile } = useProfile();
  const [activeTab, setActiveTab] = useState<TabType>("account");

  // Profile plus everything StudyHub keeps on this device (progress, notes, bookmarks, review queue,
  // preferences). Sign-in tokens are left out so the file is safe to keep or share.
  const exportData = () => {
    const device: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)!;
      if (/^sb-.*-auth-token/.test(k) || /token|session/i.test(k)) continue;
      const v = localStorage.getItem(k);
      try {
        device[k] = JSON.parse(v ?? "null");
      } catch {
        device[k] = v;
      }
    }
    const payload = { exportedAt: new Date().toISOString(), profile, device };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `studyhub_export_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
  };

  // Signs out and wipes this browser's StudyHub data. It does not delete the account on the server.
  const signOutAndClear = async () => {
    const ok = await askConfirm("Sign out and clear this device?", {
      body: "Your local progress, notes and settings on this browser are removed. Your account itself is not deleted.",
      ok: "Sign out and clear",
      danger: true,
    });
    if (!ok) return;
    try {
      const { supabase } = await import("@/lib/supabase/client");
      await supabase.auth.signOut();
    } catch {}
    document.cookie = "auth-session=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "onboarding-complete=; path=/; max-age=0; SameSite=Lax";
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace("/login");
  };

  // Ends the session on every browser and phone, e.g. after signing in on a shared computer.
  const signOutEverywhere = async () => {
    const ok = await askConfirm("Sign out of all devices?", {
      body: "You'll be signed out here and on every other browser or phone. Progress saved to your account stays.",
      ok: "Sign out everywhere",
      danger: true,
    });
    if (!ok) return;
    try {
      const { supabase } = await import("@/lib/supabase/client");
      await supabase.auth.signOut({ scope: "global" });
    } catch {}
    document.cookie = "auth-session=; path=/; max-age=0; SameSite=Lax";
    window.location.replace("/login");
  };

  const providers = (user?.app_metadata?.providers as string[] | undefined) ?? (user?.app_metadata?.provider ? [user.app_metadata.provider as string] : []);
  const signInMethod = providers.length
    ? providers.map((p) => (p === "email" ? "Email and password" : p.charAt(0).toUpperCase() + p.slice(1))).join(", ")
    : "Not available";
  const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "Not available";

  const details = [
    ["Name", profile.identity?.fullName || "Not set"],
    ["Email", profile.identity?.email || user?.email || "Not set"],
    ["College", profile.identity?.college || "Not set"],
    ["Degree", profile.identity?.degree || "Not set"],
    ["Graduating", profile.identity?.graduationYear || "Not set"],
    ["Signs in with", signInMethod],
    ["Member since", memberSince],
  ];

  return (
    <div className="w-full min-w-0">
      <PageHeader eyebrow="Settings" title="Your" hl="settings" />

      <div className="grid items-start gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="Settings sections" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:px-0">
          {tabs.map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              aria-current={activeTab === id ? "page" : undefined}
              className={clsx(
                "label-cond flex h-10 shrink-0 items-center gap-2.5 rounded-xl px-3 text-[16px] transition-colors",
                activeTab === id ? "bg-ink text-paper" : "text-ink/70 hover:bg-ink/[0.06] hover:text-ink"
              )}
            >
              <Icon className="size-[18px]" />
              {name}
            </button>
          ))}
        </nav>

        <section className="min-w-0 rounded-2xl border-[1.5px] border-hair bg-card p-6 sm:p-8">
          {activeTab === "account" && (
            <div className="space-y-6">
              <h2 className="display text-[32px]">Account</h2>
              <dl className="border-t-[1.5px] border-hair">
                {details.map(([k, v]) => (
                  <div key={k} className="flex flex-wrap items-baseline justify-between gap-2 border-b-[1.5px] border-hair py-3">
                    <dt className="font-mono text-[11px] uppercase tracking-wider text-mute">{k}</dt>
                    <dd className="text-[15px] font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
              <Link href="/profile/preferences" className={buttonClass("secondary", "sm")}>
                Edit in your profile <ArrowRight className="size-4" />
              </Link>
              <div className="flex flex-col justify-between gap-3 border-t-[1.5px] border-hair pt-5 sm:flex-row sm:items-center">
                <div>
                  <h3 className="flex items-center gap-2 font-semibold"><MonitorSmartphone className="size-4" /> Sessions</h3>
                  <p className="max-w-prose text-[14px] text-body">Signed in on a shared or lost device? End every session at once.</p>
                </div>
                <button onClick={signOutEverywhere} className={buttonClass("secondary", "sm")}>
                  <LogOut className="size-4" /> Sign out of all devices
                </button>
              </div>
            </div>
          )}

          {activeTab === "appearance" && <AppearanceSettings />}
          {activeTab === "learning" && <StudySettings />}
          {activeTab === "coding" && <CodingSettings />}
          {activeTab === "shortcuts" && <ShortcutsSettings />}

          {activeTab === "password" && (
            <div className="space-y-6">
              <h2 className="display text-[32px]">Password</h2>
              <PasswordForm email={user?.email} />
            </div>
          )}

          {activeTab === "data" && (
            <div className="space-y-8">
              <h2 className="display text-[32px]">Your data</h2>
              <div className="flex flex-col justify-between gap-3 border-t-[1.5px] border-hair pt-5 sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-semibold">Download your data</h3>
                  <p className="max-w-prose text-[14px] text-body">Your profile plus the progress, notes, bookmarks, review queue and settings stored on this device, as one JSON file. Sign-in tokens are not included.</p>
                </div>
                <button onClick={exportData} className={buttonClass("secondary", "sm")}>
                  <Download className="size-4" /> Export JSON
                </button>
              </div>
              <div className="flex flex-col justify-between gap-3 border-t-[1.5px] border-hair pt-5 sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-semibold">Sign out and clear this device</h3>
                  <p className="max-w-prose text-[14px] text-body">Removes StudyHub&apos;s local data from this browser. Your account stays.</p>
                </div>
                <button onClick={signOutAndClear} className={buttonClass("danger", "sm")}>
                  <LogOut className="size-4" /> Sign out and clear
                </button>
              </div>
              <DeleteAccount email={user?.email} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
