/**
 * Authentication Helper Utilities
 * Provides server and client-side authentication checks using Supabase and local session.
 */

import { createClient as createBrowserSupabase } from '@/lib/supabase/client';

export async function getCurrentUser() {
  const supabase = createBrowserSupabase();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return null;
  }
  return user;
}

export async function signOutUser() {
  const supabase = createBrowserSupabase();
  await supabase.auth.signOut();
  if (typeof window !== 'undefined') {
    localStorage.removeItem('sb_user_session');
    document.cookie = 'sb-demo-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}
