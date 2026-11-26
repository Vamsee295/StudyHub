import Link from "next/link";
import type { ReactNode } from "react";
import { StudyHubLogo } from "@/components/ui/StudyHubLogo";

// Who to write to about privacy or these terms. Empty = point people at the Help page instead.
export const LEGAL_CONTACT_EMAIL = "kvamsee692@gmail.com";
export const LEGAL_UPDATED = "26 November 2026";

export function ContactLine() {
  return LEGAL_CONTACT_EMAIL ? (
    <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>
  ) : (
    <>
      the <Link href="/help">Help page</Link>
    </>
  );
}

/** Public, readable shell for the Privacy Policy and Terms (no sign-in needed). */
export function LegalPage({ title, intro, children }: { title: string; intro: ReactNode; children: ReactNode }) {
  return (
    <div className="min-h-dvh text-ink">
      <header className="border-b-[2.4px] border-line">
        <div className="mx-auto flex h-16 w-full max-w-[860px] items-center justify-between px-4 md:px-8">
          <StudyHubLogo href="/" size="sm" />
          <nav aria-label="Legal" className="flex gap-5 font-mono text-[12px] uppercase tracking-wider text-mute">
            <Link href="/privacy" className="hover:text-ink">Privacy</Link>
            <Link href="/terms" className="hover:text-ink">Terms</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[860px] px-4 py-12 md:px-8 md:py-16">
        <p className="eyebrow">Legal</p>
        <h1 className="display mt-2 text-[44px] leading-none md:text-[64px]">{title}</h1>
        <p className="mt-3 font-mono text-[12px] uppercase tracking-wider text-mute">Last updated {LEGAL_UPDATED}</p>
        <div className="mt-6 max-w-[68ch] text-[17px] leading-relaxed text-body">{intro}</div>

        <div className="mt-10 max-w-[68ch] border-t-[2.4px] border-line text-[16px] leading-relaxed text-body [&_a]:font-semibold [&_a]:text-accent-ink [&_a:hover]:underline [&_h2]:mt-10 [&_h2]:text-[22px] [&_h2]:font-semibold [&_h2]:text-ink [&_li]:mt-1.5 [&_p]:mt-3 [&_strong]:text-ink [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </div>
      </main>

      <footer className="border-t-[1.5px] border-hair">
        <div className="mx-auto flex w-full max-w-[860px] flex-wrap justify-between gap-4 px-4 py-6 font-mono text-[12px] uppercase tracking-wider text-mute md:px-8">
          <span>© {new Date().getFullYear()} StudyHub</span>
          <Link href="/" className="hover:text-ink">Back to StudyHub</Link>
        </div>
      </footer>
    </div>
  );
}
