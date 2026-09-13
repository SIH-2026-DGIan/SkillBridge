'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { getSession } from '@/lib/user-session';

interface GetStartedButtonProps {
  className?: string;
  variant?: 'navbar' | 'hero' | 'cta';
  children?: React.ReactNode;
}

export function GetStartedButton({ className, variant = 'hero', children }: GetStartedButtonProps) {
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    const session = getSession();
    const hasActiveSession = Boolean(user || (session?.id && session.email));

    // 1. Unauthenticated users -> Navigate to role selection or signup (NOT onboarding)
    if (!hasActiveSession) {
      router.push('/signup?role=student');
      return;
    }

    // 2. Authenticated users
    const isComplete = Boolean(
      session?.isProfileComplete ||
      profile?.college ||
      profile?.company ||
      profile?.institution
    );

    const role = profile?.role || session?.role || 'student';

    if (!isComplete) {
      // Incomplete profile -> Step 04 Onboarding
      router.push(`/onboarding?role=${role}`);
    } else {
      // Complete profile -> Role dashboard
      router.push(`/dashboard/${role}`);
    }
  };

  if (variant === 'navbar') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={
          className ||
          'inline-flex items-center gap-1.5 text-[14px] font-semibold text-white px-6 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1d4ed8] transition-all cursor-pointer'
        }
      >
        {children || (
          <>
            Get Started <span className="material-symbols-outlined text-base leading-none">arrow_forward</span>
          </>
        )}
      </button>
    );
  }

  if (variant === 'cta') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={
          className ||
          'inline-flex items-center gap-2 text-white text-[15px] font-semibold px-8 py-3.5 rounded-lg bg-[#2563EB] hover:bg-[#1d4ed8] transition-all cursor-pointer'
        }
      >
        {children || (
          <>
            Get Started Now <span className="material-symbols-outlined text-base">arrow_forward</span>
          </>
        )}
      </button>
    );
  }

  // Default 'hero' variant
  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        className ||
        'inline-flex items-center gap-2.5 text-white text-[15px] font-medium px-7 py-3.5 rounded-lg bg-[#2563EB] hover:bg-[#1d4ed8] transition-all cursor-pointer'
      }
    >
      {children || (
        <>
          Get Started <span className="material-symbols-outlined text-base">arrow_forward</span>
        </>
      )}
    </button>
  );
}
