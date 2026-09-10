'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  PlusCircle,
  Briefcase,
  Users,
  FileText,
  User,
  LogOut,
  Menu,
  X,
  Bell,
  Building2,
  ShieldCheck,
  Search,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: any;
  badge?: string | null;
}

const NAV_GROUPS: { group: string; items: NavItem[] }[] = [
  {
    group: 'COMMAND',
    items: [
      { href: '/industry/dashboard', label: 'Command Center', icon: LayoutDashboard },
    ],
  },
  {
    group: 'RECRUITMENT',
    items: [
      { href: '/industry/opportunities/new', label: 'Post Job', icon: PlusCircle, badge: 'New' },
      { href: '/industry/opportunities', label: 'Active Jobs', icon: Briefcase },
      { href: '/industry/candidates', label: 'AI Talent Matcher', icon: Users },
      { href: '/industry/applications', label: 'Pipeline Funnel', icon: FileText },
    ],
  },
  {
    group: 'ORGANIZATION',
    items: [
      { href: '/industry/profile', label: 'Company Profile', icon: User },
    ],
  },
];

function Sidebar({
  userName,
  companyName,
  isDemo,
  onClose,
}: {
  userName: string;
  companyName: string;
  isDemo: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = 'sb-demo-session=; path=/; max-age=0';
    router.push('/demo');
  };

  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/80 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/image.png"
            alt="SkillBridge"
            width={160}
            height={42}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 md:hidden rounded-lg bg-slate-100 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Recruiter Profile Card */}
      <div className="p-4 border-b border-slate-100">
        <div className="rounded-2xl p-3.5 border border-slate-200/80 bg-slate-50/70 hover:bg-slate-50 transition-colors shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white font-black text-xs shadow-xs ring-2 ring-white shrink-0">
              {initials || 'RM'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-xs truncate">{userName}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="Active"></span>
              </div>
              <div className="text-[11px] font-bold text-indigo-700 truncate">Talent Acquisition Lead</div>
              <div className="text-[10px] font-semibold text-slate-400 truncate">{companyName} · Bengaluru</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3.5 space-y-4 overflow-y-auto scrollbar-thin">
        {NAV_GROUPS.map((group) => (
          <div key={group.group}>
            <span className="px-3 block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              {group.group}
            </span>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== '/industry/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center justify-between px-3 h-10 rounded-xl text-xs font-semibold transition-all',
                      active
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <item.icon
                        className={cn(
                          'w-4 h-4 shrink-0 transition-colors',
                          active ? 'text-white' : 'text-slate-500'
                        )}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={cn(
                          'text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0',
                          active ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                        )}
                      >
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

      {/* Logout / Switch Persona */}
      <div className="p-3.5 border-t border-slate-100 bg-slate-50/50">
        <button
          onClick={handleLogout}
          className="flex items-center justify-between w-full text-slate-600 hover:text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-xl text-xs font-bold transition-colors"
          type="button"
        >
          <span className="flex items-center gap-2">
            <LogOut className="w-4 h-4 text-slate-400" />
            <span>{isDemo ? 'Switch Persona / Exit' : 'Sign Out'}</span>
          </span>
          <span className="text-[10px] text-slate-400 font-mono">Demo</span>
        </button>
      </div>
    </div>
  );
}

export default function IndustryLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('Rohan Mehta');
  const [companyName, setCompanyName] = useState('TechNova Solutions');
  const [isDemo, setIsDemo] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, val] = cookie.trim().split('=');
      acc[key] = val;
      return acc;
    }, {} as Record<string, string>);

    const demoSession = cookies['sb-demo-session'];
    if (demoSession) {
      try {
        const session = JSON.parse(decodeURIComponent(demoSession));
        setUserName(session.name ?? 'Rohan Mehta');
        if (session.company) setCompanyName(session.company);
        setIsDemo(true);
      } catch {
        setIsDemo(true);
      }
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/industry/opportunities?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] text-[#0F172A] font-sans antialiased">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 flex-shrink-0">
        <Sidebar userName={userName} companyName={companyName} isDemo={isDemo} />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-64 z-50 bg-white">
            <Sidebar
              userName={userName}
              companyName={companyName}
              isDemo={isDemo}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 py-2.5 flex items-center justify-between gap-4 flex-shrink-0 sticky top-0 z-30 shadow-2xs">
          {/* Left: Mobile trigger & Company Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 text-slate-600 hover:text-slate-900 md:hidden rounded-lg bg-slate-100"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60 shadow-2xs">
                <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>{companyName}</span>
                <span className="text-[10px] text-indigo-400 font-semibold">• Verified Employer</span>
              </span>
            </div>
          </div>

          {/* Center: Global Search */}
          <div className="flex-1 max-w-md hidden sm:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidates, skills, college cohorts..."
                className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-900 placeholder:text-slate-400 text-xs pl-10 pr-12 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none">
                <kbd className="text-[10px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">⌘K</kbd>
              </div>
            </form>
          </div>

          {/* Right: Notifications & Recruiter Meta */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Recruitment Alerts</span>
                  </div>
                  <div className="py-8 px-4 text-center">
                    <Bell className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-700">No new alerts</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Candidate match alerts and pipeline updates will appear here.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="h-5 w-px bg-slate-200 hidden sm:block" />

            {/* Recruiter Quick Identity */}
            <div className="hidden sm:flex items-center gap-2 pl-1">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                {userName.charAt(0)}
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-xs font-bold text-slate-900 truncate max-w-[130px]">{userName}</span>
                <span className="text-[10px] text-slate-500 font-medium">Recruiter</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F8FAFC]">
          {children}
        </main>
      </div>
    </div>
  );
}
