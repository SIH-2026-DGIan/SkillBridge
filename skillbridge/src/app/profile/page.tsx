'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { getSession } from '@/lib/user-session';

export default function ProfileRedirectPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      const session = getSession();
      const hasAuth = Boolean(user || (session?.id && session.email));

      if (!hasAuth) {
        router.replace('/signup?error=auth_required');
        return;
      }

      const role = profile?.role || session?.role || 'student';
      if (!session?.isProfileComplete) {
        router.replace(`/onboarding?role=${role}`);
      } else {
        router.replace(`/dashboard/${role}`);
      }
    }
  }, [loading, user, profile, router]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-slate-500 font-sans text-sm">
      Loading profile…
    </div>
  );
}
