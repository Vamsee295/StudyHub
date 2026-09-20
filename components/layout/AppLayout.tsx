"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, ChevronDown, Menu, X } from "lucide-react";
import { clsx } from "clsx";

const navLinks = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Learn", href: "/learn" },
  { name: "Roadmaps", href: "/roadmaps" },
  { name: "Practice", href: "/practice" },
  { name: "Companies", href: "/companies" },
  { name: "Resources", href: "/resources" },
  { name: "Templates", href: "/templates" },
  { name: "Tools", href: "/tools" },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--canvas)] grid-texture selection:bg-[var(--accent-soft)] selection:text-[var(--accent-hover)] text-[var(--ink)] font-sans relative">
      {/* TOP APP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 w-full bg-[var(--surface)]/90 backdrop-blur-md border-b border-[var(--border)]/80 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
          {/* Brand & Primary Nav */}
          <div className="flex items-center gap-8 shrink-0">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white font-newsreader font-bold text-lg shadow-sm shadow-[var(--accent)]/30 transition-transform group-hover:scale-105">
                P
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-sans font-bold text-[var(--ink)] tracking-tight text-[17px]">
                  PATHWARD
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[var(--surface-subdued)] text-[var(--ink-secondary)] font-semibold tracking-wider">
                  Engine
                </span>
              </div>
            </Link>

            {/* Nav Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={clsx(
                      "px-3 py-1.5 rounded-md text-[13.5px] transition-all flex items-center gap-1.5",
                      isActive
                        ? "font-semibold text-[var(--accent)] bg-[var(--accent-soft)] ring-1 ring-[var(--accent-soft-border)]"
                        : "font-medium text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface-subdued)]/70"
                    )}
                  >
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>}
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Utility Actions */}
          <div className="flex items-center gap-4">
            {/* Quick Search */}
            <div className="hidden md:flex items-center gap-2 bg-[#f8fafc] border border-[var(--border)] hover:border-[var(--border-strong)] px-3 py-1.5 rounded-lg text-[var(--ink-tertiary)] hover:text-[var(--ink-secondary)] transition-all cursor-pointer w-56 lg:w-64 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
              <Search className="w-[18px] h-[18px]" />
              <span className="text-[13px] font-normal flex-1">Quick search...</span>
              <kbd className="font-mono text-[11px] bg-[var(--surface)] border border-[var(--border)] text-[var(--ink-secondary)] px-1.5 py-0.5 rounded shadow-[0_1px_1px_0_rgba(0,0,0,0.02)] font-medium">
                ⌘K
              </kbd>
            </div>

            {/* Notifications */}
            <button
              className="relative p-2 text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface-subdued)] rounded-lg transition-colors"
              type="button"
              aria-label="Notifications"
            >
              <Bell className="w-[20px] h-[20px]" />
              <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-[var(--accent)] ring-2 ring-[var(--surface)]"></span>
            </button>
            <div className="h-5 w-px bg-[var(--border)] hidden sm:block"></div>

            {/* Profile Chip */}
            <div 
              onClick={() => {
                document.cookie = "auth-session=; path=/; max-age=0";
                window.location.href = "/";
              }}
              title="Sign out"
              className="flex items-center gap-2.5 pl-1 py-1 pr-2 rounded-full hover:bg-[var(--surface-subdued)]/70 transition-colors cursor-pointer border border-transparent hover:border-[var(--border)]"
            >
              <img
                alt="Aditya"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[var(--border)]"
                src="https://api.dicebear.com/9.x/avataaars/svg?seed=Felix"
              />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[13px] font-semibold text-[var(--ink)] leading-tight">
                  Aditya
                </span>
                <span className="text-[11px] font-medium text-[var(--ink-secondary)]">
                  SDE Candidate
                </span>
              </div>
              <ChevronDown className="w-[18px] h-[18px] text-[var(--ink-tertiary)]" />
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface-subdued)] rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[var(--surface)] border-t border-[var(--border)] px-6 py-4 flex flex-col gap-2 shadow-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    "px-3 py-2 rounded-md text-[14px] transition-all flex items-center justify-between",
                    isActive
                      ? "font-semibold text-[var(--accent)] bg-[var(--accent-soft)]"
                      : "font-medium text-[var(--ink-secondary)] hover:text-[var(--ink)] hover:bg-[var(--surface-subdued)]"
                  )}
                >
                  <span>{link.name}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[var(--accent)]"></span>}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* MAIN PAGE CONTAINER */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>

      {/* MINIMAL FOOTER */}
      <footer className="w-full bg-[var(--surface)] border-t border-[var(--border)]/80 py-6 mt-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--ink-secondary)] font-normal">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--success)]"></span>
            <span>PATHWARD · Mapped Learning &amp; Placement Engine · Verified Cycle 2026</span>
          </div>
          <div className="flex items-center gap-4 text-[var(--ink-tertiary)]">
            <a className="hover:text-[var(--ink-secondary)] transition-colors" href="#">Privacy</a>
            <a className="hover:text-[var(--ink-secondary)] transition-colors" href="#">Terms of Verification</a>
            <a className="hover:text-[var(--ink-secondary)] transition-colors" href="#">Campus Network</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
