"use client";

import { motion, useReducedMotion } from "framer-motion";

export function AuthHeading({ title, subtitle }: { title: string; subtitle: string }) {
  const reduced = useReducedMotion();
  return (
    <div className="mb-6">
      <motion.h2
        initial={reduced ? undefined : { opacity: 0, y: 10 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-display text-[34px] sm:text-[36px] tracking-tight text-ink leading-[1.15]"
      >
        {title}
      </motion.h2>
      <motion.p
        initial={reduced ? undefined : { opacity: 0, y: 10 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.06 }}
        className="text-[15px] text-ink-secondary mt-1.5"
      >
        {subtitle}
      </motion.p>
    </div>
  );
}
