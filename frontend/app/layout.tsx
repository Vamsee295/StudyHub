import type { Metadata, Viewport } from "next";
import { Anton, Barlow_Condensed, Caveat, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ProfileProvider } from "@/components/providers/ProfileProvider";
import { OnboardingGuard } from "@/components/providers/OnboardingGuard";
import { SyncManager } from "@/components/providers/SyncManager";
import { THEME_SCRIPT } from "@/lib/theme-script";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const anton = Anton({ variable: "--font-anton", subsets: ["latin"], weight: "400", display: "swap" });
const barlow = Barlow_Condensed({ variable: "--font-barlow", subsets: ["latin"], weight: ["600", "700"], display: "swap" });
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--font-mono-jb", subsets: ["latin"], display: "swap" });
const fonts = [inter, anton, barlow, caveat, mono].map((f) => f.variable).join(" ");

export const metadata: Metadata = {
  title: "StudyHub — Everything you need to prepare for your tech career",
  description:
    "Structured roadmaps, technical resources, company preparation, practice and career tools for engineering students — mapped into one unified learning system.",
  icons: {
    icon: "/logo-mark.svg",
    shortcut: "/logo-mark.svg",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f5efe6",
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: THEME_SCRIPT sets the theme class before React hydrates
    <html lang="en" className={`${fonts} theme-paper`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <ProfileProvider>
            <SyncManager />
            <OnboardingGuard>{children}</OnboardingGuard>
          </ProfileProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
