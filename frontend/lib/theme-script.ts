// Server-safe half of lib/theme.ts (no React), so app/layout.tsx can inline the script.
export const THEME_KEY = "sh-theme";
export const MOTION_KEY = "sh-reduce-motion";

// Runs before first paint, so a dark start never flashes paper. Static string, no user input.
export const THEME_SCRIPT = `try{var t=localStorage.getItem("${THEME_KEY}")||"paper",h=document.documentElement;if(t==="system")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"paper";h.dataset.theme=t;if(t==="dark")h.classList.replace("theme-paper","theme-dark");if(localStorage.getItem("${MOTION_KEY}")==="1")h.classList.add("reduce-motion")}catch(e){}`;
