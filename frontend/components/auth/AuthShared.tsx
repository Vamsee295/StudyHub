"use client";

import { useRouter } from "next/navigation";

export function GoogleButton({ label = "Continue with Google" }: { label?: string }) {
  const router = useRouter();

  const handleGoogleSignIn = () => {
    // Set simple auth session cookie
    document.cookie = "auth-session=true; path=/; max-age=2592000"; // 30 days
    const isOnboardingComplete = document.cookie.includes("onboarding-complete=true");
    router.push(isOnboardingComplete ? "/dashboard" : "/onboarding");
  };

  return (
    <button type="button" onClick={handleGoogleSignIn} className="btn-secondary auth-btn text-[13.5px]">
      <svg width="16" height="16" viewBox="0 0 24 24" className="shrink-0">
        <path d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.9 5 12 5z" fill="#EA4335" />
        <path d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z" fill="#4285F4" />
        <path d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7 0-1.1.1-1.9.4-2.7L1.6 6.4C.6 8.3 0 10.1 0 12s.6 3.7 1.6 5.6l3.7-2.9z" fill="#FBBC05" />
        <path d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.4-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z" fill="#34A853" />
      </svg>
      {label}
    </button>
  );
}

export function AuthDivider({ label }: { label: string }) {
  return (
    <div className="my-5 flex items-center gap-3">
      <div className="h-px flex-1 bg-border" />
      <span className="text-[11px] tag-mono uppercase tracking-wider text-ink-tertiary">{label}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}
