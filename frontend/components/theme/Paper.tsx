import { paperFontVars } from "@/lib/fonts";
import "@/app/paper.css";

// Warm-paper theme (landing + auth): fonts, dotted paper, grain, and scoped colour tokens.
export function Paper({ children }: { children: React.ReactNode }) {
  return <div className={`x ${paperFontVars}`}>{children}</div>;
}
