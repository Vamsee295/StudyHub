"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, MailCheck } from "lucide-react";
import { BrandPanel } from "@/components/auth/BrandPanel";
import { AuthRightPanel } from "@/components/auth/AuthRightPanel";

export default function VerifyEmailPage() {
  const reduced = useReducedMotion();
  const [resent, setResent] = useState(false);

  const fade = (delay: number) =>
    reduced ? {} : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay } };

  return (
    <main className="w-full min-h-screen flex flex-col lg:flex-row flex-1">
      <BrandPanel />
      <AuthRightPanel>
        <div className="text-center">
          <motion.div
            {...fade(0)}
            className="w-12 h-12 rounded-full bg-accent-soft border border-accent-soft-border flex items-center justify-center mx-auto mb-5"
          >
            <MailCheck size={20} className="text-accent" />
          </motion.div>
          <motion.h2 {...fade(0.06)} className="font-display text-[30px] tracking-tight text-ink leading-[1.15] mb-2">
            Verify your email
          </motion.h2>
          <motion.p {...fade(0.12)} className="text-[14.5px] text-ink-secondary max-w-sm mx-auto leading-relaxed mb-7">
            We&rsquo;ve sent a verification link to your inbox. Click it to activate your Pathward
            account and start your preparation track.
          </motion.p>

          <motion.button
            {...fade(0.18)}
            onClick={() => setResent(true)}
            className="btn-secondary auth-btn max-w-[260px] mx-auto text-[14px]"
          >
            {resent ? "Verification email sent" : "Resend verification email"}
          </motion.button>

          <motion.div {...fade(0.24)} className="mt-6">
            <a
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-ink-secondary hover:text-ink transition-colors"
            >
              <ArrowLeft size={13} /> Back to sign in
            </a>
          </motion.div>
        </div>
      </AuthRightPanel>
    </main>
  );
}
