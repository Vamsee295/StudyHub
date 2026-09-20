import Link from "next/link";

export function AuthTabs({ active }: { active: "login" | "signup" }) {
  return (
    <div className="w-full max-w-[440px] mb-8 flex items-center justify-between relative z-10">
      <div className="inline-flex p-1 bg-surface-subdued rounded-lg border border-border">
        <Link href="/login" className={`auth-tab ${active === "login" ? "active" : ""}`}>
          Sign in
        </Link>
        <Link href="/signup" className={`auth-tab ${active === "signup" ? "active" : ""}`}>
          Sign up
        </Link>
      </div>
      <span className="text-[11px] tag-mono text-ink-tertiary tracking-wider uppercase">Pathward ID</span>
    </div>
  );
}
