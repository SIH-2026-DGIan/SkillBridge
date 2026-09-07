'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from '@/frontend/components/ui/Logo';

import {
  LayoutDashboard,
  Target,
  BarChart2,
  TrendingUp,
  BookOpen,
  Briefcase,
  FileText,
  FolderOpen,
  ClipboardCheck,
  User,
  LogOut,
  Menu,
  X,
  Bell,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  // Zap removed — brand now uses Logo component
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSession, type UserSession } from '@/lib/user-session';

interface NavGroup {
  group: string;
  items: {
    href: string;
    label: string;
    icon: React.ElementType;
    badge?: string | null;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    group: 'HOME',
    items: [{ href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    group: 'MY CAREER',
    items: [
      { href: '/student/skills', label: 'Skill Profile', icon: Target },
      { href: '/student/assessment', label: 'Skill Assessment', icon: ClipboardCheck },
      { href: '/student/skill-gaps', label: 'Skill Gaps & Goals', icon: TrendingUp },
      { href: '/student/learning', label: 'Learning Path', icon: BookOpen },
    ],
  },
  {
    group: 'OPPORTUNITIES',
    items: [
      { href: '/student/opportunities', label: 'Recommended', icon: Briefcase },
      { href: '/student/applications', label: 'Applications', icon: FileText },
    ],
  },
  {
    group: 'MY PROFILE',
    items: [
      { href: '/student/resume', label: 'Resume / CV', icon: FileText },
      { href: '/student/portfolio', label: 'Digital Portfolio', icon: FolderOpen },
    ],
  },
];

function Sidebar({ user, onClose }: { user: UserSession; onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

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

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/80">
      {/* Brand Header */}
      <div className="flex items-center justify-between p-5 border-b border-slate-100">
        <Link href="/">
          <Logo size={32} />
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 md:hidden rounded-xl bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Student Profile Snapshot */}
      <div className="p-4 border-b border-slate-100">
        <div className="glass-card rounded-2xl p-3.5 border border-indigo-100/80 bg-gradient-to-br from-indigo-50/40 to-purple-50/30">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-md ring-2 ring-white flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-sm truncate">{user.name}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              </div>
              <div className="text-[11px] font-bold text-indigo-700 truncate">
                {user.targetRole || 'Target Role'}
              </div>
              <div className="text-[10px] font-semibold text-slate-400 truncate">
                {user.college || 'Engineering College'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grouped Navigation */}
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.group} className="space-y-1">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-1">
              {group.group}
            </div>
            {group.items.map((item) => {
              const active = pathname === item.href || (item.href !== '/student/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'nav-pill group',
                    active && 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25'
                  )}
                >
                  <item.icon
                    className={cn(
                      'w-4 h-4 flex-shrink-0 transition-colors',
                      active ? 'text-white' : 'text-slate-500 group-hover:text-indigo-600'
                    )}
                  />
                  <span className="flex-1">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Account / Sign Out */}
      <div className="p-3 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="nav-pill w-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 font-bold"
        >
          <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-600" />
          <span>Switch Persona / Sign Out</span>
        </button>
      </div>
    </div>
  );
}

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserSession>(getSession());

  useEffect(() => {
    const sync = () => {
      setUser(getSession());
    };
    sync();
    window.addEventListener('sb_session_updated', sync);
    return () => window.removeEventListener('sb_session_updated', sync);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 flex-shrink-0">
        <Sidebar user={user} />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 z-50">
            <Sidebar user={user} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 py-3.5 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-slate-600 hover:text-slate-900 md:hidden rounded-xl bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="badge-pill badge-pill-purple">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> {user.college || 'Engineering College'}
              </span>
              <span className="badge-pill badge-pill-emerald hidden sm:inline-flex">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Target: {user.targetRole || 'Software Engineer'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/student/portfolio"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-100 transition-colors"
            >
              Digital Portfolio ↗
            </Link>
            <button className="relative p-2 text-slate-500 hover:text-indigo-600 rounded-xl hover:bg-slate-100 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-mesh-playful">
          {children}
        </main>
      </div>
    </div>
  );
}
