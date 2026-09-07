'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSession, type UserSession } from '@/lib/user-session';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    group: 'Home',
    items: [{ href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    group: 'My Career',
    items: [
      { href: '/student/skills', label: 'Skill Profile', icon: Target },
      { href: '/student/assessment', label: 'Assessment', icon: ClipboardCheck },
      { href: '/student/skill-gaps', label: 'Skill Gaps & Goals', icon: TrendingUp },
      { href: '/student/learning', label: 'Learning Path', icon: BookOpen },
    ],
  },
  {
    group: 'Opportunities',
    items: [
      { href: '/student/opportunities', label: 'Recommended', icon: Briefcase },
      { href: '/student/applications', label: 'Applications', icon: FileText },
    ],
  },
  {
    group: 'Profile',
    items: [
      { href: '/student/resume', label: 'Resume / CV', icon: FileText },
      { href: '/student/portfolio', label: 'Digital Portfolio', icon: FolderOpen },
    ],
  },
];

/** Map each pathname prefix to a human-readable page title */
const PAGE_TITLES: { prefix: string; title: string }[] = [
  { prefix: '/student/dashboard', title: 'Dashboard' },
  { prefix: '/student/skills', title: 'Skill Profile' },
  { prefix: '/student/assessment', title: 'Assessment' },
  { prefix: '/student/skill-gaps', title: 'Skill Gaps & Goals' },
  { prefix: '/student/learning', title: 'Learning Path' },
  { prefix: '/student/opportunities', title: 'Opportunities' },
  { prefix: '/student/applications', title: 'Applications' },
  { prefix: '/student/resume', title: 'Resume / CV' },
  { prefix: '/student/portfolio', title: 'Digital Portfolio' },
];

function getPageTitle(pathname: string): string {
  const match = PAGE_TITLES.find((p) => pathname.startsWith(p.prefix));
  return match?.title ?? 'Student Hub';
}

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
    <div className="flex flex-col h-full bg-white border-r border-slate-100">
      {/* Brand */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 flex-shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <span className="font-black text-slate-900 text-base tracking-tight">
            Skill<span className="gradient-text-playful">Bridge</span>
          </span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 md:hidden rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Grouped Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {NAV_GROUPS.map((group) => (
          <div key={group.group}>
            <div className="text-[11px] font-semibold text-slate-400 px-3 mb-1">
              {group.group}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== '/student/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'nav-pill group',
                      active
                        ? 'bg-indigo-50 text-indigo-700 font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'w-4 h-4 flex-shrink-0',
                        active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                      )}
                    />
                    <span>{item.label}</span>
                    {active && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User + Sign Out */}
      <div className="px-3 py-4 border-t border-slate-100 space-y-2">
        {/* Compact user row */}
        <div className="flex items-center gap-2.5 px-3 py-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-slate-800 truncate">{user.name}</div>
            <div className="text-[11px] text-slate-400 truncate">{user.targetRole || 'Student'}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="nav-pill w-full text-slate-500 hover:text-rose-600 hover:bg-rose-50"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<UserSession>(getSession());
  const pathname = usePathname();

  useEffect(() => {
    const sync = () => setUser(getSession());
    sync();
    window.addEventListener('sb_session_updated', sync);
    return () => window.removeEventListener('sb_session_updated', sync);
  }, []);

  const pageTitle = getPageTitle(pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      {/* Desktop Sidebar — narrower for more content room */}
      <div className="hidden md:flex md:flex-col md:w-60 flex-shrink-0">
        <Sidebar user={user} />
      </div>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-60 z-50 shadow-xl">
            <Sidebar user={user} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header — clean, minimal */}
        <header className="bg-white border-b border-slate-100 px-5 md:px-8 h-14 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 text-slate-500 hover:text-slate-900 md:hidden rounded-lg hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base font-bold text-slate-800">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/student/portfolio"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-100 transition-colors"
            >
              Portfolio ↗
            </Link>
            <button className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors relative">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-7 lg:p-8 bg-[#f8fafc]">
          {children}
        </main>
      </div>
    </div>
  );
}
