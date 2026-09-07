import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for demo session
  const demoSession = request.cookies.get('sb-demo-session');

  // Check for Supabase session
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasSupabase = supabaseUrl && supabaseUrl !== 'your_supabase_project_url';

  // Public routes — always accessible
  const publicRoutes = ['/', '/demo', '/login', '/signup', '/api'];
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

  // If we have a demo session, allow access to matching dashboard
  if (demoSession?.value) {
    try {
      const session = JSON.parse(demoSession.value);
      const role = session.role as string;

      // Ensure they're on the right dashboard
      if (pathname.startsWith('/student') && role !== 'student') {
        return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
      }
      if (pathname.startsWith('/industry') && role !== 'industry') {
        return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
      }
      if (pathname.startsWith('/institution') && role !== 'institution') {
        return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
      }
      if (pathname.startsWith('/academician') && role !== 'academician') {
        return NextResponse.redirect(new URL(`/${role}/dashboard`, request.url));
      }

      return NextResponse.next();
    } catch {
      // Invalid demo session — clear it and redirect
      const response = NextResponse.redirect(new URL('/demo', request.url));
      response.cookies.delete('sb-demo-session');
      return response;
    }
  }

  // If Supabase is configured, check for a real auth session
  if (hasSupabase) {
    const { createServerClient } = await import('@supabase/ssr');
    const response = NextResponse.next();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
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

  // No session at all — redirect to demo page
  return NextResponse.redirect(new URL('/demo', request.url));
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
