'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
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

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
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

    getInitialSession();

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

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

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
