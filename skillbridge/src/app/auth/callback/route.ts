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
  const next = url.searchParams.get('next');

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=oauth_failed', url.origin));
  }

  const cookieStore = await cookies();
  const cookiesToApply: { name: string; value: string; options: any }[] = [];

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
            cookiesToApply.push({ name, value, options });
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

  // 1. Check if profile already exists in profiles (or users) table
  let { data: existingProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!existingProfile) {
    const { data: profileById } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    existingProfile = profileById;
  }

  if (!existingProfile) {
    try {
      const { data: userRow } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      if (userRow) {
        existingProfile = userRow;
      }
    } catch {
      // ignore
    }
  }

  let role: UserRole = 'student';

  if (existingProfile?.role && isValidRole(existingProfile.role)) {
    role = existingProfile.role;
  } else if (isValidRole(requestedRole)) {
    role = requestedRole;
  } else if (user.user_metadata?.role && isValidRole(user.user_metadata.role)) {
    role = user.user_metadata.role;
  }

  const fullName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split('@')[0] ||
    'SkillBridge User';

  const avatarUrl =
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    null;

  const now = new Date().toISOString();

  if (existingProfile) {
    // Existing user: Do not overwrite customized fields, update last_login_at / updated_at
    try {
      await supabase
        .from('profiles')
        .update({
          last_login_at: now,
          updated_at: now,
        })
        .eq('user_id', user.id);
    } catch {
      try {
        await supabase
          .from('profiles')
          .update({
            updated_at: now,
          })
          .eq('user_id', user.id);
      } catch (e) {
        console.warn('Could not update profile last_login_at:', e);
      }
    }
  } else {
    // New user: Auto User Profile Creation with all required metadata
    const profilePayload: Record<string, any> = {
      id: user.id,
      user_id: user.id,
      email: user.email || '',
      name: fullName,
      avatar_url: avatarUrl,
      role,
      created_at: now,
      updated_at: now,
      last_login_at: now,
    };

    let { error: profileError } = await supabase
      .from('profiles')
      .insert(profilePayload);

    if (profileError) {
      console.warn('Initial profile insert error, retrying with standard schema:', profileError.message);
      // Fallback: without last_login_at / id if schema requires default uuid or lacks last_login_at
      const fallbackPayload = {
        user_id: user.id,
        email: user.email || '',
        name: fullName,
        avatar_url: avatarUrl,
        role,
        created_at: now,
        updated_at: now,
      };

      const { error: fallbackError } = await supabase
        .from('profiles')
        .insert(fallbackPayload);

      if (fallbackError) {
        console.error('Failed to create profile in profiles table:', fallbackError.message);
      }
    }
  }

  // Synchronize role and name in user auth metadata
  if (user.user_metadata?.role !== role || !user.user_metadata?.full_name) {
    try {
      await supabase.auth.updateUser({
        data: { role, full_name: fullName },
      });
    } catch (e) {
      console.warn('Could not update user metadata role:', e);
    }
  }

  /*
   * Calculate intended destination:
   * If `next` was provided and is safe (internal relative path),
   * map generic `/dashboard` to the role-specific dashboard,
   * or redirect directly to the specific `next` target.
   */
  const roleDefaultDashboard =
    role === 'student'
      ? '/student/dashboard'
      : role === 'industry'
        ? '/industry/dashboard'
        : role === 'institution'
          ? '/institution/dashboard'
          : '/academician/dashboard';

  let destination = roleDefaultDashboard;
  if (next && next.startsWith('/') && !next.startsWith('//')) {
    if (next === '/dashboard') {
      destination = roleDefaultDashboard;
    } else {
      destination = next;
    }
  }

  const response = NextResponse.redirect(
    new URL(destination, url.origin)
  );

  // Ensure cookies set during exchangeCodeForSession are explicitly attached to redirect response
  cookiesToApply.forEach(({ name: cName, value, options }) => {
    response.cookies.set(cName, value, options);
  });

  // Synchronize demo session cookie so frontend getSession() & middleware have immediate access
  response.cookies.set(
    'sb-demo-session',
    JSON.stringify({
      id: user.id,
      name: fullName,
      email: user.email || '',
      role,
    }),
    { path: '/', maxAge: 86400, sameSite: 'lax' }
  );

  return response;
}