import { clsx } from "clsx";

/** Multiple-choice answer row, shared by the daily question, review queue, mock test and lesson quick checks.
 *  Before answering: outlined. After: the right answer turns teal, a wrong pick red, the rest fade. */
export const optionClass = (answered: boolean, isAnswer: boolean, isPick: boolean) =>
  clsx(
    "no-press flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-[15px] font-medium transition-colors",
    !answered && "border-hair hover:border-line",
    answered && isAnswer && "border-note bg-[var(--success-soft)] text-note",
    answered && isPick && !isAnswer && "border-danger bg-[var(--error-soft)] text-danger",
    answered && !isPick && !isAnswer && "border-hair opacity-50"
  );
