'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getSession, getStudentSkills, getStudentApplications, type UserSession } from '@/lib/user-session';
import { StudentSidebar } from '@/frontend/components/student/StudentSidebar';
import { StudentHeader } from '@/frontend/components/student/StudentHeader';
import { ROLE_REQUIRED_SKILLS } from '@/lib/skills-taxonomy';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);
  const [skills, setSkills] = useState<Record<string, number>>({});
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setUser(getSession());
    setSkills(getStudentSkills());

    const sync = () => {
      setUser(getSession());
      setSkills(getStudentSkills());
    };
    
    window.addEventListener('sb_session_updated', sync);
    window.addEventListener('sb_skills_updated', sync);
    return () => {
      window.removeEventListener('sb_session_updated', sync);
      window.removeEventListener('sb_skills_updated', sync);
    }
  }, []);

  const requiredSkills = user?.targetRole ? ROLE_REQUIRED_SKILLS[user.targetRole] || [] : [];
  const gapsCount = Object.keys(skills).length > 0 && user?.targetRole
    ? requiredSkills.filter(req => (skills[req.skillId] || 0) < req.required).length
    : 0;
  
  const applications = getStudentApplications();
  const activeAppsCount = applications.filter(a => (a.status as string) !== 'accepted' && (a.status as string) !== 'rejected').length;

  if (!isMounted || !user) {
    return null; // Prevent hydration mismatch
  }

  // Strict Onboarding Guard
  const isOnboarding = pathname === '/student/onboarding';
  if (!user.isProfileComplete && !isOnboarding) {
    router.push('/student/onboarding');
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFAF8] text-[#111827] font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Desktop Sidebar */}
      {!isOnboarding && (
        <div className="hidden lg:flex lg:flex-shrink-0">
          <StudentSidebar user={user} gapsCount={gapsCount} activeAppsCount={activeAppsCount} />
        </div>
      )}

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 z-50 bg-white">
            <StudentSidebar user={user} gapsCount={gapsCount} activeAppsCount={activeAppsCount} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {!isOnboarding && <StudentHeader user={user} onOpenSidebar={() => setSidebarOpen(true)} />}

        {/* Page Body */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
