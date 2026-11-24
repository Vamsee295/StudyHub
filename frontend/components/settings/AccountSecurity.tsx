"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Loader2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { buttonClass } from "@/components/ui/Button";
import { apiClient } from "@/lib/api/client";

async function sb() {
  return (await import("@/lib/supabase/client")).supabase;
}

/** Change password: re-checks the current one with Supabase, then sets the new one. */
export function PasswordForm({ email }: { email?: string | null }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setDone(false);
    if (next.length < 8) return setError("Use at least 8 characters for the new password.");
    if (next !== confirm) return setError("The new passwords don't match.");
    if (next === current) return setError("The new password is the same as the current one.");
    if (!email) return setError("We couldn't find the email on your account. Sign in again and retry.");
    setBusy(true);
    try {
      const supabase = await sb();
      const check = await supabase.auth.signInWithPassword({ email, password: current });
      if (check.error) throw new Error("Your current password is wrong.");
      const { error: upd } = await supabase.auth.updateUser({ password: next });
      if (upd) throw upd;
      setCurrent("");
      setNext("");
      setConfirm("");
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't change the password. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-md space-y-4" noValidate>
      {[
        ["Current password", current, setCurrent, "current-password"],
        ["New password", next, setNext, "new-password"],
        ["Confirm new password", confirm, setConfirm, "new-password"],
      ].map(([label, value, set, auto]) => (
        <label key={label as string} className="block">
          <span className="mb-1.5 block text-[14px] font-semibold">{label as string}</span>
          <Input
            type="password"
            value={value as string}
            onChange={(e) => (set as (v: string) => void)(e.target.value)}
            autoComplete={auto as string}
            required
            error={!!error}
          />
        </label>
      ))}
      <p className="text-[13px] text-mute">At least 8 characters.</p>
      {error && (
        <p role="alert" className="text-[14px] font-medium text-danger">
          {error}
        </p>
      )}
      {done && (
        <p role="status" className="flex items-center gap-1.5 text-[14px] font-medium text-note">
          <Check className="size-4" /> Password changed.
        </p>
      )}
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={busy || !current || !next || !confirm} className={buttonClass("primary", "sm")}>
          {busy && <Loader2 className="size-4 animate-spin" />} Change password
        </button>
        <Link href="/forgot-password" className="text-[14px] font-medium text-accent-ink hover:underline">
          Forgot it? Email me a reset link
        </Link>
      </div>
    </form>
  );
}

/** Permanently deletes the account: the backend removes the user's data and their Supabase login. */
export function DeleteAccount({ email }: { email?: string | null }) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const word = "DELETE";

  const remove = async () => {
    setBusy(true);
    setError("");
    try {
      await apiClient.delete("/profile");
    } catch (err) {
      setBusy(false);
      return setError(err instanceof Error ? err.message : "Couldn't delete the account. Nothing was removed; try again.");
    }
    try {
      await (await sb()).auth.signOut();
    } catch {} // the login no longer exists; the local session just needs clearing
    document.cookie = "auth-session=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "onboarding-complete=; path=/; max-age=0; SameSite=Lax";
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace("/"); // full reload: middleware re-reads the (now cleared) auth cookies
  };

  return (
    <div className="rounded-xl border-2 border-danger-line bg-danger-soft p-5">
      <h3 className="font-semibold text-danger">Delete your account</h3>
      <p className="mt-1 max-w-prose text-[14px] text-body">
        Permanently removes your login{email ? ` (${email})` : ""}, lesson progress, notes, practice history, study logs, ideas and
        votes. This can&apos;t be undone. Export your profile first if you want a copy.
      </p>
      {!open ? (
        <button onClick={() => setOpen(true)} className={`${buttonClass("danger", "sm")} mt-4`}>
          <Trash2 className="size-4" /> Delete account
        </button>
      ) : (
        <div className="mt-4 max-w-sm space-y-3">
          <label className="block">
            <span className="mb-1.5 block text-[14px] font-semibold">
              Type <span className="font-mono">{word}</span> to confirm
            </span>
            <Input value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" spellCheck={false} />
          </label>
          {error && (
            <p role="alert" className="text-[14px] font-medium text-danger">
              {error}
            </p>
          )}
          <div className="flex gap-3">
            <button onClick={remove} disabled={busy || typed !== word} className={buttonClass("danger", "sm")}>
              {busy && <Loader2 className="size-4 animate-spin" />} Delete forever
            </button>
            <button
              onClick={() => {
                setOpen(false);
                setTyped("");
                setError("");
              }}
              disabled={busy}
              className={buttonClass("ghost", "sm")}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
