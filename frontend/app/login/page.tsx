"use client";

import { FormEvent, useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { BrandPanel } from "@/components/auth/BrandPanel";
import { AuthRightPanel } from "@/components/auth/AuthRightPanel";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { TextField } from "@/components/auth/TextField";
import { PasswordField } from "@/components/auth/PasswordField";
import { GoogleButton, AuthDivider } from "@/components/auth/AuthShared";
import { supabase } from "@/lib/supabase/client";

function AuthTabs({ active, onChange }: { active: "login" | "signup", onChange: (mode: "login" | "signup") => void }) {
  return (
    <div className="w-full max-w-[440px] mb-8 flex items-center justify-between relative z-10">
      <div className="inline-flex p-1 bg-surface-subdued rounded-lg border border-border">
        <button 
          type="button" 
          onClick={() => onChange("login")}
          className={`auth-tab ${active === "login" ? "active" : ""}`}
        >
          Sign in
        </button>
        <button 
          type="button" 
          onClick={() => onChange("signup")}
          className={`auth-tab ${active === "signup" ? "active" : ""}`}
        >
          Sign up
        </button>
      </div>
      <span className="text-[11px] tag-mono text-ink-tertiary tracking-wider uppercase">Pathward ID</span>
    </div>
  );
}

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reduced = useReducedMotion();
  
  const [mode, setMode] = useState<"login" | "signup">("login");
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string; confirm?: string }>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (searchParams.get("mode") === "signup") {
      setMode("signup");
    }
  }, [searchParams]);

  const fade = (delay: number) =>
    reduced ? {} : { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35, delay } };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors({});
    setMessage("");
    
    const next: typeof errors = {};
    
    if (mode === "signup") {
      if (name.trim().length < 2) next.name = "Enter your full name.";
      if (password.length < 8) next.password = "Password must be at least 8 characters.";
      if (confirm !== password) next.confirm = "Passwords do not match.";
    } else {
      if (password.length < 6) next.password = "Password must be at least 6 characters.";
    }
    
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    try {
      if (mode === "login") {
        setMessage("Signing in...");
        const { error, data } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        if (data.session) {
          if (typeof document !== "undefined") {
            document.cookie = "auth-session=true; path=/; max-age=2592000; SameSite=Lax";
            const isOnboardingComplete = document.cookie.includes("onboarding-complete=true");
            const targetUrl = searchParams.get("redirect") || (isOnboardingComplete ? "/dashboard" : "/onboarding");
            window.location.href = targetUrl;
            return;
          }
        }
      } else {
        setMessage("Creating your account...");
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            }
          }
        });
        if (error) throw error;
        
        if (data.session) {
          if (typeof document !== "undefined") {
            document.cookie = "auth-session=true; path=/; max-age=2592000; SameSite=Lax";
          }
          setMessage("Account created! Redirecting to setup...");
          window.location.href = "/onboarding";
          return;
        } else if (data.user) {
          setMessage("Account created! Please check your email to confirm your account, then sign in.");
          setMode("login");
        }
      }
    } catch (err: any) {
      setMessage("");
      const errMsg = err.message || "";
      if (errMsg === "Invalid login credentials" || errMsg.toLowerCase().includes("invalid login")) {
        setErrors({ email: "Email or password is incorrect. If you haven't created an account yet, click 'Sign up' above." });
      } else if (errMsg.toLowerCase().includes("already registered")) {
        setErrors({ email: "This email is already registered. Try signing in." });
      } else if (errMsg.toLowerCase().includes("weak_password") || errMsg.toLowerCase().includes("password should be")) {
        setErrors({ password: "Password must meet the minimum security requirements." });
      } else if (errMsg.toLowerCase().includes("email not confirmed")) {
        setErrors({ email: "Please confirm your email address before signing in." });
      } else {
        setErrors({ email: errMsg || "An error occurred during authentication." });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="w-full min-h-screen flex flex-col lg:flex-row flex-1">
      <BrandPanel />
      <AuthRightPanel>
        <AuthTabs active={mode} onChange={setMode} />
        
        {mode === "login" ? (
          <AuthHeading title="Welcome back." subtitle="Continue your placement preparation path." />
        ) : (
          <AuthHeading title="Start preparing." subtitle="Create your account and build your preparation path." />
        )}

        <motion.div {...fade(0.12)}>
          <GoogleButton />
        </motion.div>

        <motion.div {...fade(0.16)}>
          <AuthDivider label={mode === "login" ? "or email" : "or register email"} />
        </motion.div>

        {message && (
          <motion.div {...fade(0.18)} className="p-3 mb-4 text-[13px] text-accent bg-accent-soft border border-accent-soft-border rounded-lg text-center font-medium">
            {message}
          </motion.div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {mode === "signup" && (
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
          )}
          
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
              forgotHref={mode === "login" ? "/forgot-password" : undefined}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </motion.div>

          {mode === "signup" && (
            <motion.div {...fade(0.28)}>
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
          )}

          {mode === "login" ? (
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
          ) : (
            <motion.p {...fade(0.36)} className="text-[11px] text-ink-tertiary leading-tight pt-1">
              By creating an account, you agree to Pathward&rsquo;s{" "}
              <a href="#" className="underline hover:text-ink">
                Terms of Study
              </a>{" "}
              and <a href="#" className="underline hover:text-ink">Honor Code</a>.
            </motion.p>
          )}

          <motion.div {...fade(mode === "login" ? 0.34 : 0.4)}>
            <button type="submit" disabled={loading} className="btn-primary auth-btn mt-2 text-[14.5px]">
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  {mode === "login" ? "Sign in" : "Create account"} <ArrowRight size={15} className="arrow" />
                </>
              )}
            </button>
          </motion.div>
        </form>

        <motion.p {...fade(0.4)} className="mt-6 text-center text-xs text-ink-secondary">
          {mode === "login" ? (
            <>
              Don&rsquo;t have an account?{" "}
              <button onClick={() => setMode("signup")} type="button" className="text-accent hover:text-accent-hover font-semibold transition-colors">
                Create account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button onClick={() => setMode("login")} type="button" className="text-accent hover:text-accent-hover font-semibold transition-colors">
                Sign in
              </button>
            </>
          )}
        </motion.p>
      </AuthRightPanel>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
      </div>
    }>
      <AuthForm />
    </Suspense>
  );
}
