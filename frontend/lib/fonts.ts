import { Anton, Caveat, Inter, JetBrains_Mono } from "next/font/google";

// Named --font-poster so it only reaches .x-display hero lines, not the font-display utility.
const display = Anton({ weight: "400", subsets: ["latin"], variable: "--font-poster" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const hand = Caveat({ subsets: ["latin"], variable: "--font-hand" });

// CSS variables for the paper theme's four fonts, applied on the .x wrapper.
export const paperFontVars = `${display.variable} ${inter.variable} ${mono.variable} ${hand.variable}`;
