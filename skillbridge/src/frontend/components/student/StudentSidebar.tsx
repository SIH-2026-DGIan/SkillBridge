'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from '@/frontend/components/ui/Logo';
import LangSelector, { useLang } from '@/components/LangSelector';
import {
  LayoutDashboard,
  User,
  ClipboardCheck,
  Target,
  TrendingUp,
  BookOpen,
  Briefcase,
  FileText,
  Bookmark,
  FolderOpen,
  Award,
  LayoutGrid,
  LogOut,
  X
} from 'lucide-react';
import type { UserSession } from '@/lib/user-session';

interface StudentSidebarProps {
  user: UserSession;
  gapsCount: number;
  activeAppsCount: number;
  onClose?: () => void;
}

export function StudentSidebar({ user, gapsCount, activeAppsCount, onClose }: StudentSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [lang, setLang] = useLang();

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

  const NAV_GROUPS: Array<{
    group: string;
    items: Array<{
      href: string;
      label: string;
      icon: any;
      badge?: number | null;
      badgeStyle?: 'slate' | 'amber';
    }>;
  }> = [
    {
      group: 'My SkillBridge',
      items: [
        { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/student/profile', label: 'My Profile', icon: User },
        { href: '/student/assessment', label: 'Check Your Skills', icon: ClipboardCheck },
        { href: '/student/skills', label: 'Your Skills', icon: Target },
        { href: '/student/skill-gaps', label: 'Skills to Improve', icon: TrendingUp, badge: gapsCount > 0 ? gapsCount : null },
        { href: '/student/learning', label: 'Your Learning Plan', icon: BookOpen },
      ],
    },
    {
      group: 'Opportunities',
      items: [
        { href: '/student/opportunities', label: 'Opportunities for You', icon: Briefcase },
        { href: '/student/applications', label: 'Your Applications', icon: FileText, badge: activeAppsCount > 0 ? activeAppsCount : null, badgeStyle: 'slate' },
        { href: '/student/opportunities?saved=true', label: 'Saved Opportunities', icon: Bookmark },
      ],
    },
    {
      group: 'Portfolio',
      items: [
        { href: '/student/portfolio', label: 'Your Portfolio', icon: FolderOpen },
        { href: '/student/portfolio?tab=certifications', label: 'Certifications', icon: Award },
        { href: '/student/portfolio?tab=projects', label: 'Projects', icon: LayoutGrid },
      ],
    },
  ];

  return (
    <aside className="w-[280px] bg-white border-r border-[#E2E8F0] shrink-0 flex flex-col h-full">
      {/* Logo Header (Anchored) */}
      <div className="h-[76px] px-6 border-b border-[#E2E8F0] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Link href="/" onClick={onClose}><Logo size={32} /></Link>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 lg:hidden rounded-lg bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Scrollable Middle Content */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {/* Student Profile Card */}
        <div className="p-3 mx-4 mb-4 rounded-xl border border-[#E2E8F0] bg-slate-50/70 flex items-center gap-3 shrink-0">
          {user.profilePictureUrl ? (
            <img src={user.profilePictureUrl} alt="Profile" className="w-10 h-10 rounded-lg object-cover shrink-0 shadow-xs" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-700 to-blue-500 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              {initials}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-[#111827] truncate">{user.name || 'Candidate'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="Active"></span>
            </div>
            <span className="text-xs text-[#64748B] truncate">{user.degree || 'Student'} {user.branch ? `· ${user.branch}` : ''}</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="px-4 flex flex-col gap-5 text-sm font-medium pb-2">
          {NAV_GROUPS.map((group) => (
            <div key={group.group}>
              <span className="px-3 block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                {group.group}
              </span>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/student/dashboard' && pathname.startsWith(item.href.split('?')[0]));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center justify-between px-3 h-[42px] rounded-lg transition-colors ${
                        isActive
                          ? 'bg-[#EFF6FF] text-[#2563EB] font-semibold border-l-[3px] border-[#2563EB] pl-[9px]' // Adjust padding for border
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-[#2563EB]' : 'text-slate-500'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded font-mono shrink-0 ml-2 ${
                          item.badgeStyle === 'slate'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Controls (Anchored) */}
      <div className="p-4 border-t border-[#E2E8F0] flex flex-col gap-2.5 bg-slate-50/60 shrink-0">
        <div className="flex items-center justify-between text-sm text-slate-700 px-3 py-2 rounded-lg border border-slate-200 bg-white">
          <LangSelector lang={lang} setLang={setLang} />
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center justify-between text-sm text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-lg border border-transparent hover:border-rose-200 transition-colors text-left"
          type="button"
        >
          <span className="flex items-center gap-2.5 font-medium">
            <LogOut className="w-[18px] h-[18px]" />
            Sign Out
          </span>
          <span className="text-xs text-slate-400 font-mono">{user.name?.split(' ')[0] || 'User'}</span>
        </button>
      </div>
    </aside>
  );
}
