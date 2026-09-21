import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = [
  '/dashboard',
  '/learn',
  '/roadmaps',
  '/practice',
  '/companies',
  '/resources',
  '/templates',
  '/tools',
  '/progress',
  '/profile',
  '/settings',
  '/help'
];

const authRoutes = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const hasAuthCookie = request.cookies.has('auth-session');
  const hasSupabaseCookie = request.cookies.getAll().some(
    (c) => (c.name.startsWith('sb-') && c.name.includes('-auth-token')) || c.name === 'supabase-auth-token'
  );
  const isAuthenticated = hasAuthCookie || hasSupabaseCookie;

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  const isOnboardingRoute = pathname === '/onboarding';

  // 1. If trying to access onboarding without being logged in -> redirect to /login
  if (isOnboardingRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', '/onboarding');
    return NextResponse.redirect(loginUrl);
  }

  // 2. If trying to access protected routes without being logged in -> redirect to /login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. If authenticated user visits auth routes (/login, /signup)
  if (isAuthRoute && isAuthenticated) {
    // We redirect to dashboard. If they haven't onboarded, the client-side AppLayout guard will redirect them to /onboarding.
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // NOTE: Onboarding completion state is no longer checked in middleware because it depends on the authoritative database profile.
  // The AppLayout and OnboardingPage components will enforce strict routing based on the database response.

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
