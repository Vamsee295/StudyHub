"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  HelpCircle, 
  MessageSquare, 
  Check, 
  ExternalLink, 
  ChevronRight,
  BookOpen
} from "lucide-react";

interface HelpFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpFeedbackModal({ isOpen, onClose }: HelpFeedbackModalProps) {
  const [feedbackCategory, setFeedbackCategory] = useState("Bug Report");
  const [feedbackText, setFeedbackText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFeedbackText("");
      onClose();
    }, 2000);
  };

  const faqs = [
    { q: "How is Placement Readiness (68%) calculated?", a: "It's a weighted composite score of your topic coverage across DSA, Core CS, System Design, and verified mock problem submissions." },
    { q: "How do Target Company blueprints stay updated?", a: "Questions and round patterns are verified from recent campus placement drives and updated continuously for the 2026 hiring cycle." },
    { q: "Can I re-calibrate my learning roadmap?", a: "Yes! Open 'Profile & Preferences' from your profile menu and click 'Re-calibrate' to re-run the 4-step onboarding matrix." },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-10 flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-[#fafaf8] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Help &amp; Feedback</h2>
                  <p className="text-xs text-slate-500">Frequently asked questions and direct support desk.</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
              {/* FAQs */}
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-2.5">
                  {faqs.map((faq, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 text-xs">
                      <span className="font-bold text-slate-800 block mb-1">{faq.q}</span>
                      <span className="text-slate-500 leading-relaxed block">{faq.a}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback Form */}
              <div className="pt-2 border-t border-slate-100">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Send Direct Feedback or Report an Issue
                </h3>

                {submitted ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center text-xs text-emerald-800 flex items-center justify-center gap-2 animate-in fade-in">
                    <Check className="w-4 h-4 text-emerald-600" />
                    Thank you! Your feedback has been transmitted to the StudyHub Engine team.
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="flex gap-2">
                      {["Bug Report", "Feature Suggestion", "Content Question"].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setFeedbackCategory(cat)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                            feedbackCategory === cat
                              ? "bg-blue-50 border-blue-400 text-blue-700 font-semibold"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    <textarea
                      rows={3}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Describe what happened, or share an idea to improve StudyHub..."
                      required
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs cursor-pointer transition-colors"
                      >
                        Submit Feedback
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
