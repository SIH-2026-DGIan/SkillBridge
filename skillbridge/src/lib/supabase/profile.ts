import { createClient } from './client';
import { setSession, type UserRole, type UserSession } from '../user-session';
import type { Profile } from '@/database/types';

/**
 * Fetch a user's full profile from Supabase and cache it in the client session.
 */
export async function fetchUserProfile(userId: string): Promise<Profile | null> {
  if (!userId) return null;

  try {
    const supabase = createClient();

    // Query profiles table by user_id first, then fallback to id
    let { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!profile && !error) {
      const { data: profileById } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      profile = profileById;
    }

    // Fallback: check users table if profiles table is empty or missing
    if (!profile) {
      try {
        const { data: userRow } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        if (userRow) {
          profile = {
            id: userRow.id,
            user_id: userRow.id,
            name: userRow.full_name || userRow.name || '',
            email: userRow.email || '',
            role: userRow.role || 'student',
            avatar_url: userRow.avatar_url || null,
            created_at: userRow.created_at,
            updated_at: userRow.updated_at,
          } as Profile;
        }
      } catch {
        // 'users' table might not exist or be accessible
      }
    }

    if (!profile) return null;

    // Synchronize into local UserSession cache
    const role = (profile.role as UserRole) || 'student';
    const cachedSession: Partial<UserSession> = {
      id: profile.user_id || profile.id || userId,
      name: profile.name || (profile as any).full_name || '',
      email: profile.email || '',
      role,
      profilePictureUrl: profile.avatar_url || undefined,
      phone: profile.phone || undefined,
      college: profile.college || undefined,
      degree: profile.degree || undefined,
      branch: profile.branch || undefined,
      graduationYear: profile.graduation_year || undefined,
      cgpa: profile.cgpa || undefined,
      company: profile.company || undefined,
      institutionName: profile.institution || (profile as any).institution_name || undefined,
      targetRole: profile.target_roles?.[0] || undefined,
      isProfileComplete: Boolean(profile.name && profile.email && (profile.college || profile.company || profile.institution)),
    };

    setSession(cachedSession);
    return profile as Profile;
  } catch (err) {
    console.error('Error fetching user profile:', err);
    return null;
  }
}

/**
 * Update custom profile fields in Supabase and sync the client session cache.
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<Profile>
): Promise<{ success: boolean; error?: string }> {
  if (!userId) return { success: false, error: 'User ID is required' };

  try {
    const supabase = createClient();
    const payload = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating profile in Supabase:', error.message);
      return { success: false, error: error.message };
    }

    // Refresh cached session with updated attributes
    await fetchUserProfile(userId);
    return { success: true };
  } catch (err: any) {
    console.error('Exception updating profile:', err);
    return { success: false, error: err?.message || 'Failed to update profile' };
  }
}
