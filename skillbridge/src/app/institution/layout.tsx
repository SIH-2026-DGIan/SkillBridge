'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Building2,
  BarChart2,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  GraduationCap,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/institution/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/institution/students', label: 'Students', icon: Users },
  { href: '/institution/placements', label: 'Opportunities', icon: Briefcase },
  { href: '/institution/companies', label: 'Companies', icon: Building2 },
  { href: '/institution/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/institution/reports', label: 'Reports', icon: FileText },
  { href: '/institution/settings', label: 'Settings', icon: Settings },
];

function Sidebar({ userName, institutionName, isDemo, onClose }: { userName: string; institutionName: string; isDemo: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = 'sb-demo-session=; path=/; max-age=0';
    router.push('/demo');
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/80 justify-between select-none">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/image.png"
              alt="SkillBridge"
              width={160}
              height={42}
              className="h-9 w-auto object-contain transition-transform group-hover:scale-102"
              priority
            />
          </Link>
          {onClose && (
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 md:hidden rounded-xl bg-slate-100">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || (item.href !== '/institution/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 relative group',
                  active
                    ? 'bg-gradient-to-r from-indigo-50/90 to-purple-50/80 text-indigo-700 font-extrabold shadow-2xs'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                )}
              >
                {active && <span className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-600 rounded-r-full" />}
                <item.icon className={cn('w-4 h-4 flex-shrink-0 transition-colors', active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-600')} />
                <span className="flex-1">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Promo Card & Persona Switch / Exit */}
      <div className="p-4 space-y-3">
        {/* Promo Glass Card */}
        <div className="rounded-2xl p-4 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-blue-500/10 border border-indigo-100/90 relative overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-3 shadow-md shadow-indigo-500/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-black text-slate-900 leading-snug">Better Placements Stronger Futures</h4>
          <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">
            Empowering institutions with the right tools for student success.
          </p>
          <div className="mt-3 flex items-center justify-end">
            <div className="w-7 h-7 rounded-full bg-white shadow-2xs flex items-center justify-center text-indigo-600 hover:bg-indigo-50 transition-colors">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Persona Exit Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50/80 rounded-xl transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-slate-400" />
          <span>{isDemo ? 'Switch Persona / Exit' : 'Sign Out'}</span>
        </button>
      </div>
    </div>
  );
}

export default function InstitutionLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('Placement Cell');
  const [institutionName, setInstitutionName] = useState('Placement Cell');
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split(';').reduce((acc, c) => {
      const [k, v] = c.trim().split('=');
      acc[k] = v;
      return acc;
    }, {} as Record<string, string>);
    const d = cookies['sb-demo-session'];
    if (d) {
      try {
        const s = JSON.parse(decodeURIComponent(d));
        setUserName(s.name ?? 'Placement Cell');
        setInstitutionName(s.institutionName || s.college || 'Placement Cell');
        setIsDemo(true);
      } catch {
        setIsDemo(true);
      }
    }
  }, []);

  // The /institution/details page is an auth onboarding page, not a dashboard page.
  // Render it without the sidebar layout.
  if (pathname === '/institution/details') {
    return <>{children}</>;
  }


  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'PC';

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      {/* Sidebar Desktop */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 flex-shrink-0">
        <Sidebar userName={userName} institutionName={institutionName} isDemo={isDemo} />
      </div>

      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 z-50">
            <Sidebar userName={userName} institutionName={institutionName} isDemo={isDemo} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Bar */}
        <header className="bg-white border-b border-slate-200/80 px-4 md:px-8 py-3 flex items-center justify-between flex-shrink-0 z-20 shadow-2xs">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600 lg:hidden rounded-xl bg-slate-100">
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search Bar */}
            <div className="relative flex-1 hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search opportunities, students, companies..."
                className="w-full h-10 pl-10 pr-16 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-bold text-slate-400 bg-white border border-slate-200 rounded-md shadow-2xs">
                Ctrl + K
              </span>
            </div>
          </div>

          {/* User Profile & Notifications */}
          <div className="flex items-center gap-3">
            {/* Notification Icon */}
            <button
              aria-label="Notifications"
              className="relative p-2.5 text-slate-500 hover:text-indigo-600 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <Bell className="w-5 h-5" />
            </button>

            <div className="h-6 w-px bg-slate-200/80" />

            {/* User Pill */}
            <div className="flex items-center gap-2.5 pl-1 cursor-pointer group">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center shadow-2xs ring-2 ring-slate-100">
                {initials}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-black text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                  {userName}
                </span>
                <span className="text-[10px] font-bold text-slate-400 leading-none mt-0.5">
                  {institutionName}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 bg-[#f8fafc]">{children}</main>
      </div>
    </div>
  );
}
