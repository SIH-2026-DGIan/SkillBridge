'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentOnboardingRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/onboarding?role=student');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-slate-500 font-sans text-sm">
      Opening student profile setup…
    </div>
  );
}
