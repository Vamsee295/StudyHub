"use client";

import Link from "next/link";
import { FormEvent, useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { BrandPanel } from "@/components/auth/BrandPanel";
import { AuthRightPanel } from "@/components/auth/AuthRightPanel";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { TextField } from "@/components/auth/TextField";
import { PasswordField } from "@/components/auth/PasswordField";
import { GoogleButton, AuthDivider } from "@/components/auth/AuthShared";
import { StudyHubLogo } from "@/components/ui/StudyHubLogo";
import { supabase } from "@/lib/supabase/client";

function AuthTabs({ active, onChange }: { active: "login" | "signup", onChange: (mode: "login" | "signup") => void }) {
  return (
    <div className="mb-8 flex w-full max-w-[440px] items-center justify-between">
      <div className="inline-flex rounded-xl border-2 border-line bg-paper p-1">
        <button 
          type="button" 
          onClick={() => onChange("login")}
          className={`label-cond cursor-pointer rounded-lg px-5 py-1.5 text-[15px] transition-colors ${
            active === "login" 
              ? "bg-ink text-paper"
              : "text-body hover:text-ink"
          }`}
        >
          Sign in
        </button>
        <button 
          type="button" 
          onClick={() => onChange("signup")}
          className={`label-cond cursor-pointer rounded-lg px-5 py-1.5 text-[15px] transition-colors ${
            active === "signup" 
              ? "bg-ink text-paper"
              : "text-body hover:text-ink"
          }`}
        >
          Sign up
        </button>
      </div>
      
    </div>
  );
}

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<"login" | "signup">("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string; confirm?: string }>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [existingUser, setExistingUser] = useState<any>(null);

  useEffect(() => {
    if (searchParams.get("mode") === "signup") {
      setMode("signup");
    }
  }, [searchParams]);

  // Check if user is already authenticated
  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setExistingUser(session.user);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    }
    checkAuth();
  }, []);


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
          }

          // Fetch profile to check onboarding status
          try {
            const profileRes = await fetch('/api/profile', {
              headers: {
                'Authorization': `Bearer ${data.session.access_token}`
              }
            });
            const profileData = await profileRes.json();

            // Route based on onboarding completion
            if (profileData.profile_completed) {
              const targetUrl = searchParams.get("redirect") || "/dashboard";
              window.location.href = targetUrl;
            } else {
              window.location.href = "/onboarding";
            }
          } catch (profileError) {
            console.error("Error fetching profile:", profileError);
            // Fallback to dashboard if profile fetch fails
            const targetUrl = searchParams.get("redirect") || "/dashboard";
            window.location.href = targetUrl;
          }
          return;
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
          // New users always go to onboarding
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

  async function handleLogout() {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      if (typeof document !== "undefined") {
        document.cookie = "auth-session=; path=/; max-age=0; SameSite=Lax";
      }
      setExistingUser(null);
      setMessage("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  }

  // If user is already authenticated, show authenticated state UI
  if (!isCheckingAuth && existingUser) {
    return (
      <main className="w-full min-h-screen flex flex-col lg:flex-row flex-1">
        <BrandPanel />
        <AuthRightPanel>
          <div className="mb-6 flex w-full items-center justify-between border-b-[1.5px] border-hair pb-3 lg:hidden">
            <StudyHubLogo href="/" size="sm" />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider text-mute hover:text-ink"
            >
              <ArrowLeft size={13} />
              Home
            </Link>
          </div>

          <div className="w-full max-w-[440px] flex flex-col items-center gap-6 text-center">
            <div className="grid size-16 place-items-center rounded-full border-[2.4px] border-line bg-accent">
              <div className="display text-[28px] text-paper">
                {existingUser.email?.[0].toUpperCase() || "U"}
              </div>
            </div>

            <div>
              <h2 className="display mb-2 text-[40px]">You&apos;re signed in</h2>
              <p className="text-[15px] text-body">
                Signed in as <span className="font-semibold text-ink">{existingUser.email}</span>
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full">
              <Link
                href="/dashboard"
                className="btn-primary auth-btn flex items-center justify-center gap-2"
              >
                Continue to Dashboard <ArrowRight size={15} />
              </Link>

              <button
                onClick={handleLogout}
                disabled={loading}
                className="btn-secondary auth-btn"
              >
                {loading ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Switch Account / Logout"}
              </button>
            </div>
          </div>
        </AuthRightPanel>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen flex flex-col lg:flex-row flex-1">
      <BrandPanel />
      <AuthRightPanel>
        {/* Mobile Header (Brand Logo & Back to Home) */}
        <div className="mb-6 flex w-full items-center justify-between border-b-[1.5px] border-hair pb-3 lg:hidden">
          <StudyHubLogo href="/" size="sm" />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-wider text-mute hover:text-ink"
          >
            <ArrowLeft size={13} />
            Home
          </Link>
        </div>

        <AuthTabs active={mode} onChange={setMode} />
        
        {mode === "login" ? (
          <AuthHeading title="Welcome back." subtitle="Continue your placement preparation path." />
        ) : (
          <AuthHeading title="Start preparing." subtitle="Create your account and build your preparation path." />
        )}

        <motion.div>
          <GoogleButton />
        </motion.div>

        <motion.div>
          <AuthDivider label={mode === "login" ? "or email" : "or register email"} />
        </motion.div>

        {message && (
          <motion.div className="mb-4 rounded-xl border-[1.5px] border-accent-line bg-accent-soft p-3 text-center text-[14px] font-medium text-accent-ink">
            {message}
          </motion.div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {mode === "signup" && (
            <motion.div>
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
          
          <motion.div>
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

          <motion.div>
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
            <motion.div>
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
            <motion.div className="flex items-center gap-2 pt-0.5">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="size-4 accent-ink"
              />
              <label htmlFor="remember" className="select-none text-[14px] text-body">
                Remember this device for 30 days
              </label>
            </motion.div>
          ) : null}

          <motion.div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary auth-btn mt-2"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  {mode === "login" ? "Sign in" : "Create account"} <ArrowRight size={16} className="arrow" />
                </>
              )}
            </button>
          </motion.div>
        </form>

        <motion.p className="mt-6 text-center text-[14px] text-body">
          {mode === "login" ? (
            <>
              Don&rsquo;t have an account?{" "}
              <button onClick={() => setMode("signup")} type="button" className="font-semibold text-accent-ink hover:underline">
                Create account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button onClick={() => setMode("login")} type="button" className="font-semibold text-accent-ink hover:underline">
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
        <Loader2 className="size-8 animate-spin text-accent" />
      </div>
    }>
      <AuthForm />
    </Suspense>
  );
}
