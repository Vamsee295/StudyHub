"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MailCheck } from "lucide-react";
import { BrandPanel } from "@/components/auth/BrandPanel";
import { AuthRightPanel } from "@/components/auth/AuthRightPanel";

export default function VerifyEmailPage() {
  const [resent, setResent] = useState(false);


  return (
    <main className="w-full min-h-screen flex flex-col lg:flex-row flex-1">
      <BrandPanel />
      <AuthRightPanel>
        <div className="text-center">
          <motion.div
           
            className="mx-auto mb-5 grid size-14 place-items-center rounded-full border-[2.4px] border-line bg-accent text-paper"
          >
            <MailCheck size={22} aria-hidden />
          </motion.div>
          <motion.h2 className="display mb-2 text-[40px]">
            Verify your email
          </motion.h2>
          <motion.p className="mx-auto mb-7 max-w-sm text-[15px] leading-relaxed text-body">
            We&rsquo;ve sent a verification link to your inbox. Click it to activate your StudyHub
            account and begin your placement journey.
          </motion.p>

          <motion.button
           
            onClick={() => setResent(true)}
            className="btn-secondary auth-btn max-w-[260px] mx-auto text-[14px]"
          >
            {resent ? "Verification email sent" : "Resend verification email"}
          </motion.button>

          <motion.div className="mt-6">
            <a
              href="/login"
              className="inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider text-mute hover:text-ink"
            >
              <ArrowLeft size={13} /> Back to sign in
            </a>
          </motion.div>
        </div>
      </AuthRightPanel>
    </main>
  );
}
