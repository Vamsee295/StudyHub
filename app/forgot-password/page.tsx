"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, MailCheck } from "lucide-react";
import { BrandPanel } from "@/components/auth/BrandPanel";
import { AuthRightPanel } from "@/components/auth/AuthRightPanel";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { TextField } from "@/components/auth/TextField";

export default function ForgotPasswordPage() {
  const reduced = useReducedMotion();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const fade = (delay: number) =>
    reduced ? {} : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay } };

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError(undefined);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 900);
  }

  return (
    <main className="w-full min-h-screen flex flex-col lg:flex-row flex-1">
      <BrandPanel />
      <AuthRightPanel>
        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div
              key="form"
              initial={reduced ? undefined : { opacity: 0 }}
              animate={reduced ? undefined : { opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <AuthHeading
                title="Forgot your password?"
                subtitle="Enter your email and we'll send you a link to reset your password."
              />

              <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                <motion.div {...fade(0.1)}>
                  <TextField
                    id="forgot-email"
                    label="Email address"
                    type="email"
                    placeholder="you@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={error}
                    autoComplete="email"
                  />
                </motion.div>

                <motion.div {...fade(0.16)}>
                  <button type="submit" disabled={loading} className="btn-primary auth-btn mt-2 text-[14.5px]">
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        Send reset link <ArrowRight size={15} className="arrow" />
                      </>
                    )}
                  </button>
                </motion.div>
              </form>

              <motion.div {...fade(0.22)} className="mt-6 text-center">
                <a
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-ink-secondary hover:text-ink transition-colors"
                >
                  <ArrowLeft size={13} /> Back to sign in
                </a>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="sent"
              initial={reduced ? undefined : { opacity: 0, y: 8 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="text-center"
            >
              <div className="w-12 h-12 rounded-full bg-accent-soft border border-accent-soft-border flex items-center justify-center mx-auto mb-5">
                <MailCheck size={20} className="text-accent" />
              </div>
              <h2 className="font-display text-[30px] tracking-tight text-ink leading-[1.15] mb-2">
                Check your email
              </h2>
              <p className="text-[14.5px] text-ink-secondary max-w-sm mx-auto leading-relaxed mb-7">
                If an account exists for <span className="text-ink font-medium">{email}</span>, we&rsquo;ve
                sent a password reset link.
              </p>
              <a href="/login" className="btn-secondary auth-btn max-w-[220px] mx-auto text-[14px]">
                Back to sign in
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </AuthRightPanel>
    </main>
  );
}
