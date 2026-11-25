'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { Session, User } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';

type AuthState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
};

const AuthContext = createContext<AuthState>({
  user: null,
  session: null,
  loading: true,
});

const PROTECTED_ROUTES = [
  '/dashboard',
  '/learn',
  '/roadmaps',
  '/practice',
  '/companies',
  '/resources',
  '/templates',
  '/tools',
  '/profile',
  '/settings',
];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // The landing page needs no auth, so it doesn't download the Supabase client (~55 KB gzipped);
  // the session starts as soon as the visitor moves to any other page.
  const onLanding = pathname === '/';

  useEffect(() => {
    if (onLanding) return;
    let mounted = true;
    let unsubscribe = () => {};

    async function getInitialSession(supabase: SupabaseClient) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
          if (typeof document !== 'undefined') {
            if (session) {
              document.cookie = "auth-session=true; path=/; max-age=2592000; SameSite=Lax";
            } else {
              document.cookie = "auth-session=; path=/; max-age=0; SameSite=Lax";
            }
          }
        }
      } catch (error) {
        console.error("Error getting session:", error);
        if (mounted) setLoading(false);
      }
    }

    import('@/lib/supabase/client').then(({ supabase }) => {
    if (!mounted) return;
    getInitialSession(supabase);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);

          if (typeof document !== 'undefined') {
            if (session) {
              document.cookie = "auth-session=true; path=/; max-age=2592000; SameSite=Lax";
            } else {
              document.cookie = "auth-session=; path=/; max-age=0; SameSite=Lax";
            }
          }
        }
      }
    );
    unsubscribe = () => subscription.unsubscribe();
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [onLanding]);

  // Route protection effect - DO NOT redirect authenticated users away from /login
  useEffect(() => {
    if (loading) return; // Don't redirect while loading

    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname?.startsWith(route));
    const isOnboardingRoute = pathname === '/onboarding';

    // Unauthenticated users trying to access protected routes → redirect to login
    if (!user && (isProtectedRoute || isOnboardingRoute)) {
      if (typeof document !== 'undefined') {
        document.cookie = "auth-session=; path=/; max-age=0; SameSite=Lax";
      }

      const loginUrl = `/login${pathname !== '/dashboard' && pathname !== '/onboarding' ? `?redirect=${encodeURIComponent(pathname)}` : ''}`;
      router.replace(loginUrl);
      return;
    }

    // REMOVED: The automatic redirect from /login to /dashboard
    // Authenticated users CAN access /login page
    // The login page itself will handle showing appropriate UI for authenticated users

  }, [user, loading, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
