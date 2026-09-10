'use client';

import { User, Target, TrendingUp, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardStatsProps {
  profileCompletion: number;
  skillsCount: number;
  gapsCount: number;
  appsCount: number;
  isAssessed: boolean;
}

export function DashboardStats({
  profileCompletion,
  skillsCount,
  gapsCount,
  appsCount,
  isAssessed,
}: DashboardStatsProps) {
  const isProfileStarted = profileCompletion > 0;

  const stats = [
    {
      label: 'Profile Completion',
      value: isProfileStarted ? `${profileCompletion}%` : '0%',
      subtitle: isProfileStarted ? 'Profile in progress' : 'Not started',
      icon: User,
      color: 'blue',
      progress: profileCompletion,
    },
    {
      label: 'Skills Identified',
      value: skillsCount > 0 ? skillsCount : '0',
      subtitle: skillsCount > 0 ? 'Verified & extracted' : 'No skills detected',
      icon: Target,
      color: 'emerald',
      progress: null,
    },
    {
      label: 'Skills to Improve',
      value: isAssessed ? gapsCount : '—',
      subtitle: isAssessed 
        ? gapsCount > 0 ? 'Gaps to benchmark' : 'Benchmark satisfied'
        : 'Assessment pending',
      icon: TrendingUp,
      color: 'amber',
      progress: null,
    },
    {
      label: 'Applications',
      value: appsCount,
      subtitle: appsCount > 0 ? 'Active recruitment cycles' : 'No applications submitted',
      icon: FileText,
      color: 'indigo',
      progress: null,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:shadow-sm hover:border-slate-300 transition-all group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {stat.label}
              </span>
              <span
                className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
                  stat.color === 'blue' && "bg-blue-50 text-blue-600 border border-blue-200/50",
                  stat.color === 'emerald' && "bg-emerald-50 text-emerald-600 border border-emerald-200/50",
                  stat.color === 'amber' && "bg-amber-50 text-amber-600 border border-amber-200/50",
                  stat.color === 'indigo' && "bg-indigo-50 text-indigo-600 border border-indigo-200/50"
                )}
              >
                <stat.icon className="w-4 h-4" />
              </span>
            </div>

            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {stat.value}
            </div>

            <p className="text-[11px] text-slate-500 font-medium mt-1">
              {stat.subtitle}
            </p>
          </div>

          {stat.progress !== null && (
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-700",
                  stat.progress >= 80 ? "bg-emerald-500" : stat.progress >= 40 ? "bg-blue-600" : "bg-amber-500"
                )}
                style={{ width: `${stat.progress}%` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
