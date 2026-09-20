"use client";

import { FormEvent, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { BrandPanel } from "@/components/auth/BrandPanel";
import { AuthRightPanel } from "@/components/auth/AuthRightPanel";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { TextField } from "@/components/auth/TextField";
import { PasswordField } from "@/components/auth/PasswordField";
import { GoogleButton, AuthDivider } from "@/components/auth/AuthShared";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reduced = useReducedMotion();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const fade = (delay: number) =>
    reduced ? {} : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay } };

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (password.length < 6) next.password = "Password must be at least 6 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    setTimeout(() => {
      // Set simple auth session cookie
      document.cookie = "auth-session=true; path=/; max-age=2592000"; // 30 days
      setLoading(false);
      
      const isOnboardingComplete = document.cookie.includes("onboarding-complete=true");
      const redirect = searchParams.get('redirect');
      
      if (!isOnboardingComplete) {
        router.push("/onboarding");
      } else {
        router.push(redirect || "/dashboard");
      }
    }, 900);
  }

  return (
    <main className="w-full min-h-screen flex flex-col lg:flex-row flex-1">
      <BrandPanel />
      <AuthRightPanel>
        <AuthTabs active="login" />
        <AuthHeading title="Welcome back." subtitle="Continue your placement preparation path." />

        <motion.div {...fade(0.12)}>
          <GoogleButton />
        </motion.div>

        <motion.div {...fade(0.16)}>
          <AuthDivider label="or email" />
        </motion.div>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <motion.div {...fade(0.2)}>
            <TextField
              id="login-email"
              label="Email address"
              type="email"
              placeholder="you@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
            />
          </motion.div>

          <motion.div {...fade(0.26)}>
            <PasswordField
              id="login-password"
              label="Password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              forgotHref="/forgot-password"
              autoComplete="current-password"
            />
          </motion.div>

          <motion.div {...fade(0.3)} className="flex items-center gap-2 pt-0.5">
            <input
              id="remember"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 rounded border-border accent-accent"
            />
            <label htmlFor="remember" className="text-xs text-ink-secondary select-none">
              Remember this device for 30 days
            </label>
          </motion.div>

          <motion.div {...fade(0.34)}>
            <button type="submit" disabled={loading} className="btn-primary auth-btn mt-2 text-[14.5px]">
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  Sign in <ArrowRight size={15} className="arrow" />
                </>
              )}
            </button>
          </motion.div>
        </form>

        <motion.p {...fade(0.4)} className="mt-6 text-center text-xs text-ink-secondary">
          Don&rsquo;t have an account?{" "}
          <a href="/signup" className="text-accent hover:text-accent-hover font-semibold transition-colors">
            Create account
          </a>
        </motion.p>
      </AuthRightPanel>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
