import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const ALLOWED_ROLES = [
  'student',
  'industry',
  'institution',
  'academician',
] as const;

type UserRole = (typeof ALLOWED_ROLES)[number];

function isValidRole(role: string | null): role is UserRole {
  return !!role && ALLOWED_ROLES.includes(role as UserRole);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const requestedRole = url.searchParams.get('role');

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=oauth_failed', url.origin));
  }

  const cookieStore = await cookies();

  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseUrl = rawUrl.startsWith('http://') || rawUrl.startsWith('https://')
    ? rawUrl
    : `https://${rawUrl}.supabase.co`;

  const supabase = createServerClient(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/login?error=oauth_failed', url.origin)
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(
      new URL('/login?error=oauth_user_missing', url.origin)
    );
  }

  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  let role: UserRole | null = null;

  if (existingProfile?.role && isValidRole(existingProfile.role)) {
    role = existingProfile.role;
  } else if (isValidRole(requestedRole)) {
    role = requestedRole;
  }

  /*
   * Existing Google user:
   * use the role already stored in profiles.
   *
   * New Google user:
   * use the role selected on the signup page.
   */
  if (!existingProfile && role) {
    const name =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split('@')[0] ||
      'SkillBridge User';

    const { error: profileError } = await supabase.from('profiles').insert({
      user_id: user.id,
      role,
      name,
      email: user.email || '',
      avatar_url: user.user_metadata?.avatar_url || null,
    });

    if (profileError) {
      console.error('Google profile creation error:', profileError);
    }
  }

  if (!role) {
    return NextResponse.redirect(
      new URL('/role?type=signup', url.origin)
    );
  }

  /*
   * Google already verifies the user's email,
   * so we skip the normal email verification page.
   */
  const destination =
    role === 'student'
      ? '/student/dashboard'
      : role === 'industry'
        ? '/industry/dashboard'
        : role === 'institution'
          ? '/institution/dashboard'
          : '/academician/dashboard';

  const response = NextResponse.redirect(
    new URL(destination, url.origin)
  );

  // Remove old demo/local auth cookie so it cannot override
  // the real Supabase authenticated session.
  response.cookies.delete('sb-demo-session');

  return response;
}