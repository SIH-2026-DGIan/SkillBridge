'use client';

import { useState, useEffect } from 'react';
import { getSession, getStudentSkills, type UserSession } from '@/lib/user-session';
import { StudentSidebar } from '@/frontend/components/student/StudentSidebar';
import { StudentHeader } from '@/frontend/components/student/StudentHeader';
import { DEMO_APPLICATIONS } from '@/lib/demo-data';
import { ROLE_REQUIRED_SKILLS } from '@/lib/skills-taxonomy';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserSession>(getSession());
  const [skills, setSkills] = useState<Record<string, number>>({});

  useEffect(() => {
    const sync = () => {
      setUser(getSession());
      setSkills(getStudentSkills());
    };
    sync();
    window.addEventListener('sb_session_updated', sync);
    window.addEventListener('sb_skills_updated', sync);
    return () => {
      window.removeEventListener('sb_session_updated', sync);
      window.removeEventListener('sb_skills_updated', sync);
    }
  }, []);

  const requiredSkills = ROLE_REQUIRED_SKILLS[user.targetRole || 'Machine Learning Engineer'] || [];
  const gapsCount = requiredSkills.filter(req => (skills[req.skillId] || 0) < req.required).length;
  const activeAppsCount = DEMO_APPLICATIONS.filter(a => (a.status as string) !== 'accepted' && (a.status as string) !== 'rejected').length;

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFAF8] text-[#111827] font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-64 flex-shrink-0 z-40">
        <StudentSidebar user={user} gapsCount={gapsCount} activeAppsCount={activeAppsCount} />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 z-50 bg-white">
            <StudentSidebar user={user} gapsCount={gapsCount} activeAppsCount={activeAppsCount} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <StudentHeader user={user} onOpenSidebar={() => setSidebarOpen(true)} />

        {/* Page Body */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
