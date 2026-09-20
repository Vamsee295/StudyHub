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
  const isAuthenticated = request.cookies.has('auth-session');
  const isOnboardingComplete = request.cookies.has('onboarding-complete');

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
    const targetUrl = isOnboardingComplete ? '/dashboard' : '/onboarding';
    return NextResponse.redirect(new URL(targetUrl, request.url));
  }

  // 4. If authenticated but onboarding is NOT completed, and user tries to access protected app routes -> redirect to /onboarding
  if (isAuthenticated && !isOnboardingComplete && isProtectedRoute && !isOnboardingRoute) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  // 5. If authenticated and onboarding IS completed, and user visits /onboarding -> redirect to /dashboard
  if (isAuthenticated && isOnboardingComplete && isOnboardingRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

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
