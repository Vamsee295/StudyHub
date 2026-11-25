"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// Loaded as its own chunk, so the landing page (which uses none of it) ships without the auth client,
// profile, sync and onboarding code. Every other route renders it on the server as before.
const AppProviders = dynamic(() => import("./AppProviders"));

export function Providers({ children }: { children: React.ReactNode }) {
  return usePathname() === "/" ? <>{children}</> : <AppProviders>{children}</AppProviders>;
}
