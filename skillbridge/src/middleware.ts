import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for Supabase session
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isRealSupabase =
    Boolean(supabaseUrl) &&
    supabaseUrl !== 'your_supabase_project_url' &&
    !supabaseUrl?.includes('your-project.supabase.co');

  // Public routes — always accessible
  const publicRoutes = ['/', '/login', '/signup', '/verify', '/role', '/dashboard', '/api', '/auth/callback', '/onboarding'];
  const isPublic = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );

  if (isPublic) {
    return NextResponse.next();
  }

  // Portfolio is public
  if (pathname.startsWith('/portfolio/')) {
    return NextResponse.next();
  }

  // Demo session verification (supports local & SIH demo auth)
  const demoCookie = request.cookies.get('sb-demo-session')?.value;
  if (demoCookie) {
    try {
      const parsed = JSON.parse(decodeURIComponent(demoCookie));
      if (parsed?.id || parsed?.role) {
        return NextResponse.next();
      }
    } catch {
      // Invalid demo cookie, proceed to check Supabase
    }
  }

  // Real Supabase session verification
  if (isRealSupabase) {
    const { createServerClient } = await import('@supabase/ssr');
    const response = NextResponse.next();

    const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const validSupabaseUrl = rawUrl.startsWith('http://') || rawUrl.startsWith('https://')
      ? rawUrl
      : `https://${rawUrl}.supabase.co`;

    const supabase = createServerClient(
      validSupabaseUrl,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return response;
  }

  // No active session found — redirect to login
  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm|m4v)$).*)',
  ],
};
