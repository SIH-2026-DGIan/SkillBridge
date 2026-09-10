'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell, Search, ChevronDown, User, LogOut, FileText, CheckCircle2, Building, ShieldCheck, Menu } from 'lucide-react';
import LangSelector, { useLang } from '@/components/LangSelector';
import type { UserSession } from '@/lib/user-session';
import { setSession } from '@/lib/user-session';
import { TARGET_ROLES } from '@/lib/skills-taxonomy';

interface StudentHeaderProps {
  user: UserSession;
  onOpenSidebar: () => void;
}

export function StudentHeader({ user, onOpenSidebar }: StudentHeaderProps) {
  const router = useRouter();
  const [lang, setLang] = useLang();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSession({ targetRole: e.target.value });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/student/opportunities?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    document.cookie = 'sb-demo-session=; path=/; max-age=0';
    localStorage.removeItem('sb_user_session');
    router.push('/signup');
  };

  const initials = (user.name || 'Candidate')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const institutionLabel = user.college || user.institutionName || 'SkillBridge Member';

  return (
    <header className="bg-white border-b border-[#E2E8F0] px-4 lg:px-8 py-2.5 sticky top-0 z-30 flex items-center justify-between shadow-xs gap-4">
      {/* LEFT: Mobile Menu Button + SkillBridge Brand */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenSidebar}
          className="p-1.5 text-slate-600 hover:text-slate-900 lg:hidden rounded-lg bg-slate-100 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex items-center gap-2 text-xs">
          <span className="font-extrabold text-[#111827] tracking-tight text-sm">SkillBridge</span>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md text-[11px]">Student Workspace</span>
        </div>
      </div>

      {/* CENTER: Global Search */}
      <div className="flex-1 max-w-lg hidden md:block">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search opportunities, companies, skills..."
            className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-900 placeholder:text-slate-400 text-xs pl-10 pr-12 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none">
            <kbd className="text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">⌘K</kbd>
          </div>
        </form>
      </div>

      {/* RIGHT: Role selector, Notifications, Profile, Lang */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Career Goal Selector */}
        <div className="hidden xl:flex items-center mr-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Target Career</span>
            <div className="relative inline-flex items-center cursor-pointer group">
              <select
                id="target-role-select"
                value={user.targetRole || ''}
                onChange={handleRoleChange}
                className="text-sm font-black text-slate-900 bg-transparent border-0 p-0 pr-4 focus:ring-0 cursor-pointer appearance-none outline-none max-w-[180px] truncate group-hover:text-blue-600 transition-colors"
              >
                <option value="" disabled>Select target role</option>
                {TARGET_ROLES.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-0 pointer-events-none group-hover:text-blue-600" />
            </div>
          </div>
        </div>

        {/* Language Selector */}
        <div className="hidden sm:flex items-center text-xs font-medium text-slate-600 px-2 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
          <LangSelector lang={lang} setLang={setLang} />
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            title="Notifications"
            type="button"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
                <span className="text-[10px] font-semibold text-blue-600 hover:underline cursor-pointer">Mark all as read</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                <div className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        {user.isAssessed ? 'Skill Assessment Verified' : 'Complete your Skill Assessment'}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {user.isAssessed
                          ? 'Your technical profile is verified for recruiter matches.'
                          : 'Take a quick 10-minute assessment to unlock AI match scores.'}
                      </p>
                    </div>
                  </div>
                </div>
                {user.targetRole && (
                  <div className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="flex items-start gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">Target Role Selected</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Tracking readiness for <span className="font-semibold text-slate-700">{user.targetRole}</span>.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-5 w-px bg-[#E2E8F0] hidden sm:block"></div>

        {/* Student Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100/80 transition-colors text-left"
            aria-label="Student profile menu"
          >
            {user.profilePictureUrl ? (
              <img src={user.profilePictureUrl} alt="Profile" className="w-8 h-8 rounded-lg object-cover shadow-xs ring-1 ring-slate-200" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-700 to-blue-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {initials}
              </div>
            )}
            <div className="hidden md:flex flex-col text-left leading-tight">
              <span className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                {user.name || 'Candidate'}
              </span>
              <span className="text-[10px] text-slate-500 truncate max-w-[120px]">
                {institutionLabel}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3.5 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900 truncate">{user.name || 'Candidate'}</p>
                <p className="text-[11px] text-slate-500 truncate">{user.email || 'student@skillbridge.in'}</p>
                <div className="mt-1 flex items-center gap-1.5 text-[10px] font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                  <Building className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{institutionLabel}</span>
                </div>
              </div>

              <div className="py-1">
                <Link
                  href="/student/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  My Profile
                </Link>
                <Link
                  href="/student/assessment"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  Check Your Skills
                </Link>
                <Link
                  href="/student/applications"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Your Applications
                </Link>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 w-full text-left transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
