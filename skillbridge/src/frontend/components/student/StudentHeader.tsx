'use client';

import { Bell } from 'lucide-react';
import LangSelector, { useLang } from '@/components/LangSelector';
import type { UserSession } from '@/lib/user-session';
import { setSession } from '@/lib/user-session';
import { TARGET_ROLES } from '@/lib/skills-taxonomy';
import { Menu } from 'lucide-react';

interface StudentHeaderProps {
  user: UserSession;
  onOpenSidebar: () => void;
}

export function StudentHeader({ user, onOpenSidebar }: StudentHeaderProps) {
  const [lang, setLang] = useLang();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSession({ targetRole: e.target.value });
  };

  const initials = (user.name || 'Candidate')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="bg-white border-b border-[#E2E8F0] px-6 lg:px-8 py-3 sticky top-0 z-30 flex items-center justify-between shadow-xs">
      {/* Mobile Menu Button + Brand breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-1.5 text-slate-600 hover:text-slate-900 lg:hidden rounded-lg bg-slate-100"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="font-bold text-[#111827] tracking-tight">SkillBridge</span>
          <span className="text-slate-300">/</span>
          <span className="font-medium text-slate-600">Student Workspace</span>
        </div>
      </div>

      {/* Middle Career Goal Selector */}
      <div className="flex items-center">
        <div className="relative inline-flex items-center">
          <label className="sr-only" htmlFor="target-role-select">Career Goal</label>
          <div className="flex items-center gap-2 bg-blue-50/80 border border-blue-200 px-3 py-1.5 rounded-lg hover:border-blue-300 transition-colors">
            <span className="text-xs font-medium text-slate-500 hidden sm:inline">Career Goal:</span>
            <select
              id="target-role-select"
              value={user.targetRole || ''}
              onChange={handleRoleChange}
              className="text-xs font-semibold text-blue-700 bg-transparent border-0 p-0 pr-5 focus:ring-0 cursor-pointer appearance-none outline-none"
            >
              <option value="" disabled>Choose your career goal</option>
              {TARGET_ROLES.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <span className="pointer-events-none text-blue-700 text-[10px] font-bold absolute right-3">▾</span>
          </div>
        </div>
      </div>

      {/* Right Header Controls */}
      <div className="flex items-center gap-3">
        {/* Language Selector */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
          <LangSelector lang={lang} setLang={setLang} />
        </div>

        {/* Notification Bell */}
        <button className="relative p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors" title="Notifications" type="button">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#2563EB] rounded-full"></span>
        </button>

        <div className="h-4 w-px bg-[#E2E8F0] hidden sm:block"></div>

        {/* Student Profile */}
        <div className="flex items-center gap-2 pl-1">
          {user.profilePictureUrl ? (
            <img src={user.profilePictureUrl} alt="Profile" className="w-8 h-8 rounded-lg object-cover shadow-xs" />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {initials}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
