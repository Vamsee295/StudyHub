'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { useProfile } from './ProfileProvider';
import { Loader2 } from 'lucide-react';

/**
 * OnboardingGuard - Enforces onboarding completion for authenticated users
 *
 * Three-state routing logic:
 * 1. Unauthenticated → handled by AuthProvider (redirects to /login)
 * 2. Authenticated + onboarding incomplete → redirect to /onboarding
 * 3. Authenticated + onboarding complete → allow access
 */
export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { draftProfile, isLoading: profileLoading } = useProfile();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  // Routes that don't require onboarding completion
  const ONBOARDING_EXEMPT_ROUTES = [
    '/',
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/onboarding',
  ];

  useEffect(() => {
    // Wait for both auth and profile to load
    if (authLoading || profileLoading) {
      return;
    }

    setIsChecking(false);

    // Only authenticated users need onboarding checks
    if (!user) {
      return;
    }

    // Exempt routes don't need onboarding
    const isExempt = ONBOARDING_EXEMPT_ROUTES.some(route => pathname === route || pathname?.startsWith(route + '/'));
    if (isExempt) {
      return;
    }

    // Check onboarding status from authoritative database profile
    const isOnboardingComplete = draftProfile?.profileCompleted === true;

    // If onboarding is not complete, redirect to /onboarding
    if (!isOnboardingComplete && pathname !== '/onboarding') {
      console.log('[ONBOARDING GUARD] Onboarding incomplete, redirecting to /onboarding');
      router.replace('/onboarding');
      return;
    }

    // If onboarding is complete but user is on /onboarding, redirect to dashboard
    if (isOnboardingComplete && pathname === '/onboarding') {
      console.log('[ONBOARDING GUARD] Onboarding already complete, redirecting to /dashboard');
      router.replace('/dashboard');
      return;
    }

  }, [user, authLoading, profileLoading, draftProfile?.profileCompleted, pathname, router]);

  // Show loading state while checking
  if ((authLoading || profileLoading || isChecking) && user) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
