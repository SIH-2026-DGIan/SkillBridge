'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, TrendingUp, Users, BarChart2, Zap, LogOut, Menu, X, Bell, Sparkles, Layers, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/institution/dashboard', label: 'TPO Analytics', icon: LayoutDashboard },
  { href: '/institution/analytics', label: 'Skill Heatmap', icon: BarChart2 },
  { href: '/institution/students', label: 'Batch Directory', icon: Users },
  { href: '/institution/placements', label: 'Placement Drives', icon: TrendingUp },
];

function Sidebar({ userName, isDemo, onClose }: { userName: string; isDemo: boolean; onClose?: () => void }) {
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
    <div className="flex flex-col h-full bg-white border-r border-slate-200/80">
      {/* Brand */}
      <div className="flex items-center justify-between p-5 border-b border-slate-100">
        <Link href="/">
          <Image src="/image.png" alt="SkillBridge" width={170} height={46} className="h-11 w-auto object-contain" />
        </Link>
        {onClose && (
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 md:hidden rounded-xl bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div className="p-4 border-b border-slate-100">
        <div className="glass-card rounded-2xl p-3.5 border border-indigo-100/80 bg-gradient-to-br from-indigo-50/50 to-purple-50/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white font-black text-sm shadow-md ring-2 ring-white flex-shrink-0">
              {initials || 'PN'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-sm truncate">{userName}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-[#4F46E5] flex-shrink-0" />
              </div>
              <div className="text-[11px] font-bold text-indigo-700">Head of Training &amp; Placement</div>
              <div className="text-[10px] font-semibold text-slate-400">NIT Kozhikode · 1,200 Students</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== '/institution/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'nav-pill group',
                active && 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-md shadow-indigo-500/25'
              )}
            >
              <item.icon className={cn('w-4 h-4 flex-shrink-0 transition-colors', active ? 'text-white' : 'text-slate-500 group-hover:text-[#4F46E5]')} />
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-100">
        <button onClick={handleLogout} className="nav-pill w-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 font-bold">
          <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-600" />
          <span>{isDemo ? 'Switch Persona / Exit' : 'Sign Out'}</span>
        </button>
      </div>
    </div>
  );
}

export default function InstitutionLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState('Dr. Priya Nair');
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
        setUserName(s.name ?? 'Dr. Priya Nair');
        setIsDemo(true);
      } catch {
        setIsDemo(true);
      }
    }
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      <div className="hidden md:flex md:flex-col md:w-64 flex-shrink-0">
        <Sidebar userName={userName} isDemo={isDemo} />
      </div>
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 z-50">
            <Sidebar userName={userName} isDemo={isDemo} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {isDemo && (
          <div className="demo-banner-playful flex-shrink-0 flex items-center justify-center gap-2 bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#06B6D4]">
            <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse" />
            <span>INSTITUTION TPO SANDBOX — Campus Skill Heatmap, NAAC/NIRF Analytics &amp; Placement Readiness</span>
          </div>
        )}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 py-3.5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600 md:hidden rounded-xl bg-slate-100">
              <Menu className="w-5 h-5" />
            </button>
            <span className="badge-pill badge-pill-purple">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4F46E5]" /> NIT Kozhikode TPO Cell
            </span>
          </div>
          <button className="p-2 text-slate-500 hover:text-[#4F46E5] rounded-xl hover:bg-slate-100 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-mesh-playful">{children}</main>
      </div>
    </div>
  );
}
