"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  HelpCircle, 
  Search, 
  MessageSquare, 
  AlertCircle, 
  Check, 
  Mail, 
  FileQuestion, 
  BookOpen, 
  Compass, 
  Building2, 
  User, 
  ChevronDown,
  ExternalLink,
  Send
} from "lucide-react";

type FAQCategory = "all" | "getting-started" | "learning" | "practice" | "companies" | "account";

interface FAQItem {
  id: string;
  category: FAQCategory;
  q: string;
  a: string;
}

const faqs: FAQItem[] = [
  {
    id: "readiness-calc",
    category: "getting-started",
    q: "How is Placement Readiness (e.g. 68%) calculated?",
    a: "Readiness is a weighted composite index evaluating: (1) Core Computer Science coverage across DSA, DBMS, OS, and Networks, (2) Problem-solving accuracy in diagnostic drills, (3) Mock assessment scores mapped to your targeted recruitment cycle (e.g., Tier-1 Product vs. High-Volume IT), and (4) Verified practice consistency."
  },
  {
    id: "roadmap-recal",
    category: "getting-started",
    q: "Can I re-calibrate my learning roadmap if my target changes?",
    a: "Yes! You can update your career tracks, graduation year, or target companies anytime from Profile & Preferences or by re-running the 4-step onboarding matrix. The system automatically recalculates prerequisite modules and milestone cut-offs."
  },
  {
    id: "module-lock",
    category: "learning",
    q: "Why are some modules locked or marked with prerequisites?",
    a: "Curriculum modules are sequenced hierarchically to prevent conceptual gaps. For example, Tree Traversals and Graphs require recursion fundamentals, and System Design requires Database and Network fundamentals. Completing the prerequisite topic unlocks subsequent modules immediately."
  },
  {
    id: "offline-notes",
    category: "learning",
    q: "Are study guides and technical cheatsheets downloadable?",
    a: "Yes. All topic notes, SQL syntax handbooks, and algorithmic cheatsheets in the Resources section are available in print-friendly technical editorial format and can be exported as PDF or markdown."
  },
  {
    id: "oa-simulation",
    category: "practice",
    q: "How closely do practice questions mirror real campus OA rounds?",
    a: "All practice drills and timed problem sets are sourced and verified from recent (2025–2026) campus hiring drives for companies like Google, Microsoft, Amazon, TCS Digital, and Infosys. Tests include edge-case constraints and platform-specific time limits."
  },
  {
    id: "company-blueprints",
    category: "companies",
    q: "How frequently are company hiring patterns updated?",
    a: "Our placement data team verifies hiring rubrics at the start of each campus drive cycle. When a recruiter changes round structures (e.g., adding a system design round or adjusting CGPA cut-offs), the company workspace updates automatically."
  },
  {
    id: "email-sync",
    category: "account",
    q: "Can I link both my college email and personal email?",
    a: "Your university email serves as your verified campus credential. You can receive notification digests and placement drive alerts at your personal address by configuring notification preferences in Settings."
  }
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory>("all");
  const [openFaqId, setOpenFaqId] = useState<string | null>("readiness-calc");

  // Feedback form state
  const [feedbackType, setFeedbackType] = useState("Bug Report");
  const [feedbackText, setFeedbackText] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const filteredFaqs = faqs.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = 
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFeedbackText("");
      setTimeout(() => setSubmitted(false), 4000);
    }, 600);
  };

  const categories: { id: FAQCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "all", label: "All Topics", icon: FileQuestion },
    { id: "getting-started", label: "Getting Started", icon: Compass },
    { id: "learning", label: "Learning & Modules", icon: BookOpen },
    { id: "practice", label: "Practice & Drills", icon: BookOpen },
    { id: "companies", label: "Company Preparation", icon: Building2 },
    { id: "account", label: "Account & Access", icon: User },
  ];

  return (
    <div className="w-full min-w-0 pb-16">
      {/* PAGE TITLE BANNER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[var(--border)] mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-[var(--surface-subdued)] text-[var(--ink-secondary)] font-semibold tracking-wider border border-[var(--border)]">
              Support &amp; Assistance Desk
            </span>
          </div>
          <h1 className="font-newsreader text-3xl sm:text-4xl text-[var(--ink)] font-normal tracking-tight">
            Help &amp; Feedback
          </h1>
          <p className="text-[var(--ink-secondary)] text-[15px] mt-1.5 font-normal">
            Find answers to common preparation questions, report technical issues, or contact placement coordinators.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[var(--ink-secondary)] shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Support Desk Operational</span>
        </div>
      </div>

      {/* SEARCH BANNER */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 shadow-xs mb-8">
        <div className="max-w-2xl">
          <h2 className="text-lg font-bold text-[var(--ink)] mb-1">How can we help your placement preparation?</h2>
          <p className="text-xs text-[var(--ink-secondary)] mb-4">
            Search our knowledge base for questions on roadmaps, target companies, test formats, or system features.
          </p>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search help by keyword (e.g. readiness, prerequisites, companies, reset)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="field w-full pl-10 text-xs sm:text-sm h-11"
            />
          </div>
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? "bg-[var(--accent)] text-white font-semibold shadow-xs"
                  : "bg-[var(--surface)] text-[var(--ink-secondary)] border border-[var(--border)] hover:text-[var(--ink)] hover:bg-[var(--surface-subdued)]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* MAIN TWO-COLUMN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: FAQ LIST (8 columns) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-[var(--ink)] tracking-tight">
              Frequently Asked Questions
            </h2>
            <span className="text-xs font-mono text-[var(--ink-secondary)]">
              {filteredFaqs.length} questions
            </span>
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-10 text-center shadow-xs">
              <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-[var(--ink)]">No matching questions found</h3>
              <p className="text-xs text-[var(--ink-secondary)] mt-1 mb-4">
                Try searching with different terms or submit a direct inquiry below.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="btn-secondary text-xs h-8 px-3"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-strong)] rounded-2xl overflow-hidden shadow-xs transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                      className="w-full flex items-center justify-between p-5 text-left cursor-pointer gap-4 group"
                    >
                      <span className="text-sm font-bold text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-[var(--accent)]" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-[13px] text-[var(--ink-secondary)] leading-relaxed border-t border-[var(--border)]/60 bg-[var(--surface-subdued)]/30">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: REPORT A PROBLEM / SEND FEEDBACK (4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          {/* FEEDBACK & PROBLEM REPORT FORM */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-[var(--accent)]" />
              <h3 className="text-sm font-bold text-[var(--ink)] uppercase font-mono tracking-wider">
                Send Feedback
              </h3>
            </div>
            <p className="text-xs text-[var(--ink-secondary)] mb-4">
              Encountered a glitch or have suggestions to improve the preparation experience?
            </p>

            {submitted && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 mb-4">
                <Check className="w-4 h-4 shrink-0" />
                <span>Thank you! Your feedback has been logged to our developer desk.</span>
              </div>
            )}

            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono font-semibold text-[var(--ink-secondary)] uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value)}
                  className="field w-full text-xs cursor-pointer"
                >
                  <option value="Bug Report">Technical Glitch / Bug Report</option>
                  <option value="Question Error">Question / Test Case Correction</option>
                  <option value="Feature Suggestion">Feature Suggestion</option>
                  <option value="Company Pattern">Company Pattern Update Request</option>
                  <option value="Other">General Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-semibold text-[var(--ink-secondary)] uppercase tracking-wider mb-1.5">
                  Your University Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="name@university.edu"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="field w-full text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-semibold text-[var(--ink-secondary)] uppercase tracking-wider mb-1.5">
                  Details &amp; Reproduction Steps
                </label>
                <textarea
                  rows={4}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Describe the issue or improvement in detail..."
                  className="w-full rounded-lg border border-[var(--border)] p-3 text-xs focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] bg-white resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary text-xs h-9 w-full justify-center flex items-center gap-1.5 cursor-pointer font-semibold"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? "Submitting..." : "Transmit to Engineering"}
              </button>
            </form>
          </div>

          {/* CAMPUS COORDINATOR HOTLINE */}
          <div className="bg-[var(--surface-subdued)] border border-[var(--border)] rounded-2xl p-5 shadow-xs text-xs space-y-2">
            <h4 className="font-bold text-[var(--ink)] flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-500" /> Direct Campus Support
            </h4>
            <p className="text-slate-600 leading-relaxed">
              For urgent queries regarding upcoming campus drive schedules or college slot approvals, reach out to your faculty placement officer or email:
            </p>
            <div className="pt-1">
              <span className="font-mono text-slate-800 font-semibold block">support@pathward.edu</span>
              <span className="text-[11px] text-slate-400">Response time within 4 campus working hours.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
