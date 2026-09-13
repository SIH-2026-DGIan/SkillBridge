'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { fetchUserProfile } from '@/lib/supabase/profile';
import { getSession, type UserRole, type UserSession } from '@/lib/user-session';
import type { Profile } from '@/database/types';

export interface UseDashboardProfileResult {
  profile: Profile | null;
  session: UserSession;
  role: UserRole;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDashboardProfile(): UseDashboardProfileResult {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSessionState] = useState<UserSession>(() => getSession());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const fetched = await fetchUserProfile(user.id);
        if (fetched) {
          setProfile(fetched);
          setSessionState(getSession());
          setLoading(false);
          return;
        }
      }

      // If user not in Supabase or Supabase not reachable, fallback to cached local session
      setSessionState(getSession());
    } catch (err: any) {
      console.warn('Could not load profile from Supabase:', err);
      setError(err?.message || 'Failed to load profile');
      setSessionState(getSession());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();

    const handleSessionUpdate = () => {
      setSessionState(getSession());
    };

    window.addEventListener('sb_session_updated', handleSessionUpdate);
    return () => {
      window.removeEventListener('sb_session_updated', handleSessionUpdate);
    };
  }, [loadProfile]);

  const role = (profile?.role || session.role || 'student') as UserRole;

  return {
    profile,
    session,
    role,
    loading,
    error,
    refetch: loadProfile,
  };
}
