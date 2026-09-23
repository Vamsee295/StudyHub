"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { StudyHubLogo } from "@/components/ui/StudyHubLogo";

const navLinks = [
  { href: "#learn", label: "Learn" },
  { href: "#roadmap", label: "Roadmaps" },
  { href: "#practice", label: "Practice" },
  { href: "#companies", label: "Companies" },
  { href: "#resources", label: "Resources" },
  { href: "#templates", label: "Templates" },
  { href: "/tools", label: "Tools" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur border-b border-border shadow-[0_1px_0_rgba(15,23,42,0.02)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container-max px-5 md:px-8 h-16 flex items-center justify-between gap-4">
        <StudyHubLogo href="#top" size="md" showBadge={false} />

        <nav className="hidden lg:flex items-center gap-7 text-[14px]">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="text-ink-secondary hover:text-ink transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => document.getElementById("hero-search")?.focus()}
            className="hidden sm:flex items-center gap-2 text-[13.5px] text-ink-secondary border border-border rounded-md px-3 py-1.5 hover:border-accent transition-colors"
          >
            <Search size={14} />
            Search
          </button>
          <Link
            href="/login"
            className="hidden sm:block text-[14px] text-ink-secondary hover:text-ink px-2"
          >
            Sign in
          </Link>
          <Link href="/login" className="btn-primary">
            Get Started
          </Link>
          <button className="lg:hidden text-ink-secondary" onClick={() => setOpen((v) => !v)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t border-border px-5 py-3 flex flex-col gap-3 text-[14.5px]">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-ink-secondary">
              {l.label}
            </a>
          ))}
          <div className="pt-2 mt-1 border-t border-border flex items-center gap-3">
            <Link href="/login" onClick={() => setOpen(false)} className="text-ink-secondary">
              Sign in
            </Link>
            <Link href="/login" onClick={() => setOpen(false)} className="btn-primary text-[13.5px] h-9 px-4">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
