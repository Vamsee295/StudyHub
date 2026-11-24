"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { BrandPanel } from "@/components/auth/BrandPanel";
import { AuthRightPanel } from "@/components/auth/AuthRightPanel";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { PasswordField } from "@/components/auth/PasswordField";

export default function ResetPasswordPage() {
  const reduced = useReducedMotion();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);


  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (password.length < 8) next.password = "Use at least 8 characters.";
    if (confirm !== password) next.confirm = "Passwords don't match.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 900);
  }

  return (
    <main className="w-full min-h-screen flex flex-col lg:flex-row flex-1">
      <BrandPanel />
      <AuthRightPanel>
        <AnimatePresence initial={false} mode="wait">
          {!done ? (
            <motion.div
              key="form"
              initial={reduced ? undefined : { opacity: 0 }}
              animate={reduced ? undefined : { opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <AuthHeading
                title="Create a new password."
                subtitle="Choose a new password for your StudyHub account."
              />

              <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                <motion.div>
                  <PasswordField
                    id="reset-password"
                    label="New password"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                    autoComplete="new-password"
                  />
                </motion.div>

                <motion.div>
                  <PasswordField
                    id="reset-confirm"
                    label="Confirm password"
                    placeholder="Re-enter new password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    error={errors.confirm}
                    autoComplete="new-password"
                  />
                </motion.div>

                <motion.div>
                  <button type="submit" disabled={loading} className="btn-primary auth-btn mt-2 text-[14.5px]">
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        Reset password <ArrowRight size={15} className="arrow" />
                      </>
                    )}
                  </button>
                </motion.div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="done"
              initial={reduced ? undefined : { opacity: 0, y: 8 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="text-center"
            >
              <div className="mx-auto mb-5 grid size-14 place-items-center rounded-full border-[2.4px] border-line bg-note text-paper">
                <CheckCircle2 size={22} aria-hidden />
              </div>
              <h2 className="display mb-2 text-[40px]">
                Password updated.
              </h2>
              <p className="mx-auto mb-7 max-w-sm text-[15px] leading-relaxed text-body">
                Your password has been changed successfully.
              </p>
              <a href="/login" className="btn-primary auth-btn max-w-[220px] mx-auto text-[14px]">
                Continue to sign in
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </AuthRightPanel>
    </main>
  );
}
