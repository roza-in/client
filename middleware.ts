import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/hospital', '/doctor', '/admin', '/settings'];

// Routes that should redirect to dashboard if authenticated
const authRoutes = ['/login', '/register', '/auth/signup', '/auth/verify-otp'];

// Public routes
const publicRoutes = ['/', '/about', '/contact', '/book', '/hospitals', '/doctors'];

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Check if route is public (explicitly allow these routes)
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'));

  // Only check protected routes if not a public route
  const isProtectedRoute = !isPublicRoute && protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !user) {
    // Allow if our app session cookie exists (we'll validate tokens on API requests)
    const appToken = request.cookies.get('rozx_access')?.value;
    if (appToken) {
      return supabaseResponse;
    }

    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect to dashboard if accessing auth route while authenticated
  if (isAuthRoute && user) {
    // If Supabase session exists but no app profile, allow auth pages (e.g., user logged out of app but Supabase cookie remains)
    const { data: profile, error } = await supabase
      .from('users')
      .select('role')
      .eq('auth_id', user.id)
      .single();

    if (error || !profile) {
      return supabaseResponse;
    }

    const url = request.nextUrl.clone();
    const role = profile.role || user.user_metadata?.role || 'patient';

    switch (role) {
      case 'admin':
        url.pathname = '/admin';
        break;
      case 'hospital_admin':
        url.pathname = '/hospital';
        break;
      case 'doctor':
        url.pathname = '/doctor';
        break;
      case 'patient':
        url.pathname = '/patient';
        break;
      default:
        url.pathname = '/';
    }

    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
