'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { Session, User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { fetchUserProfile } from '@/lib/supabase/profile';
import { getSession as getLocalSession, setSession as setLocalSession, type UserRole, type UserSession } from '@/lib/user-session';
import type { Profile } from '@/database/types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: UserRole;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  role: 'student',
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState(true);

  // Helper to load profile and update role
  const loadProfileForUser = useCallback(async (activeUser: User) => {
    try {
      const userProfile = await fetchUserProfile(activeUser.id);
      if (userProfile) {
        setProfile(userProfile);
        const resolvedRole = (userProfile.role as UserRole) || (activeUser.user_metadata?.role as UserRole) || 'student';
        setRole(resolvedRole);
      } else {
        const metadataRole = (activeUser.user_metadata?.role as UserRole) || 'student';
        setRole(metadataRole);
      }
    } catch (e) {
      console.warn('Could not load user profile in AuthProvider:', e);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await loadProfileForUser(user);
    }
  }, [user, loadProfileForUser]);

  const signOut = useCallback(async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase sign out error:', e);
    } finally {
      // Clear client session and local cookies
      setSession(null);
      setUser(null);
      setProfile(null);
      setRole('student');

      if (typeof window !== 'undefined') {
        localStorage.removeItem('sb_user_session');
        document.cookie = 'sb-demo-session=; path=/; max-age=0; SameSite=Lax';
        window.dispatchEvent(new Event('sb_session_updated'));
      }

      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    // 1. Check initial active Supabase session
    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      if (!isMounted) return;

      if (initialSession?.user) {
        setSession(initialSession);
        setUser(initialSession.user);
        await loadProfileForUser(initialSession.user);
      } else {
        // Fallback: check if local session exists
        const local = getLocalSession();
        if (local?.id && local.email) {
          setRole(local.role || 'student');
        }
      }

      if (isMounted) setLoading(false);
    }).catch(() => {
      if (isMounted) setLoading(false);
    });

    // 2. Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!isMounted) return;

      if (currentSession?.user) {
        setSession(currentSession);
        setUser(currentSession.user);
        await loadProfileForUser(currentSession.user);
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfileForUser]);

  // 3. Auto-redirect logged-in users away from /login or /signup
  useEffect(() => {
    if (!loading && (user || session)) {
      if (pathname === '/login' || pathname === '/signup') {
        const targetDashboard = role ? `/${role}/dashboard` : '/dashboard';
        router.replace(targetDashboard);
      }
    }
  }, [loading, user, session, role, pathname, router]);

  const value = useMemo(
    () => ({
      user,
      session,
      profile,
      role,
      loading,
      signOut,
      refreshProfile,
    }),
    [user, session, profile, role, loading, signOut, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}
