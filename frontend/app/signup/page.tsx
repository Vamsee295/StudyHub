"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { BrandPanel } from "@/components/auth/BrandPanel";
import { AuthRightPanel } from "@/components/auth/AuthRightPanel";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { TextField } from "@/components/auth/TextField";
import { PasswordField } from "@/components/auth/PasswordField";
import { GoogleButton, AuthDivider } from "@/components/auth/AuthShared";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
}

export default function SignupPage() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const fade = (delay: number) =>
    reduced ? {} : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay } };

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next: FormErrors = {};
    if (name.trim().length < 2) next.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (password.length < 8) next.password = "Use at least 8 characters.";
    if (confirm !== password) next.confirm = "Passwords don't match.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    setTimeout(() => {
      // Clear previous onboarding state and set new auth session
      document.cookie = "onboarding-complete=; path=/; max-age=0";
      document.cookie = "auth-session=true; path=/; max-age=2592000"; // 30 days
      setLoading(false);
      router.push("/onboarding");
    }, 900);
  }

  return (
    <main className="w-full min-h-screen flex flex-col lg:flex-row flex-1">
      <BrandPanel />
      <AuthRightPanel>
        <AuthTabs active="signup" />
        <AuthHeading title="Start preparing." subtitle="Create your account and build your preparation path." />

        <motion.div {...fade(0.12)}>
          <GoogleButton />
        </motion.div>

        <motion.div {...fade(0.16)}>
          <AuthDivider label="or register email" />
        </motion.div>

        <form className="space-y-3.5" onSubmit={handleSubmit} noValidate>
          <motion.div {...fade(0.2)}>
            <TextField
              id="signup-name"
              label="Full name"
              type="text"
              placeholder="Priya Nair"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              autoComplete="name"
            />
          </motion.div>

          <motion.div {...fade(0.24)}>
            <TextField
              id="signup-email"
              label="Email address"
              type="email"
              placeholder="priya.nair@campus.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
            />
          </motion.div>

          <motion.div {...fade(0.28)}>
            <PasswordField
              id="signup-password"
              label="Password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              autoComplete="new-password"
            />
          </motion.div>

          <motion.div {...fade(0.32)}>
            <PasswordField
              id="signup-confirm"
              label="Confirm password"
              placeholder="Re-enter password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              error={errors.confirm}
              autoComplete="new-password"
            />
          </motion.div>

          <motion.p {...fade(0.36)} className="text-[11px] text-ink-tertiary leading-tight pt-1">
            By creating an account, you agree to Pathward&rsquo;s{" "}
            <a href="#" className="underline hover:text-ink">
              Terms of Study
            </a>{" "}
            and <a href="#" className="underline hover:text-ink">Honor Code</a>.
          </motion.p>

          <motion.div {...fade(0.4)}>
            <button type="submit" disabled={loading} className="btn-primary auth-btn mt-2 text-[14.5px]">
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  Create account <ArrowRight size={15} className="arrow" />
                </>
              )}
            </button>
          </motion.div>
        </form>

        <motion.p {...fade(0.46)} className="mt-6 text-center text-xs text-ink-secondary">
          Already have an account?{" "}
          <a href="/login" className="text-accent hover:text-accent-hover font-semibold transition-colors">
            Sign in
          </a>
        </motion.p>
      </AuthRightPanel>
    </main>
  );
}
