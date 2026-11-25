"use client";

import { AuthProvider } from "./AuthProvider";
import { ProfileProvider } from "./ProfileProvider";
import { OnboardingGuard } from "./OnboardingGuard";
import { SyncManager } from "./SyncManager";

/** Everything the signed-in app needs: session, profile, onboarding redirect, cross-device sync. */
export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProfileProvider>
        <SyncManager />
        <OnboardingGuard>{children}</OnboardingGuard>
      </ProfileProvider>
    </AuthProvider>
  );
}
