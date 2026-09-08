import { User, Target, TrendingUp, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardStatsProps {
  profileCompletion: number;
  skillsCount: number;
  gapsCount: number;
  appsCount: number;
}

export function DashboardStats({ profileCompletion, skillsCount, gapsCount, appsCount }: DashboardStatsProps) {
  const isNew = profileCompletion === 0 && skillsCount === 0;

  const stats = [
    {
      label: 'Profile Completion',
      value: isNew ? 'Not started' : `${profileCompletion}%`,
      icon: User,
      color: 'blue',
      empty: false
    },
    {
      label: 'Your Skills',
      value: skillsCount,
      icon: Target,
      color: 'emerald',
      empty: false
    },
    {
      label: 'Skills to Improve',
      value: isNew ? '—' : gapsCount,
      icon: TrendingUp,
      color: 'amber',
      empty: false
    },
    {
      label: 'Your Applications',
      value: appsCount,
      icon: FileText,
      color: 'purple',
      empty: false
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white border border-[#E2E8F0] rounded-xl p-4 flex flex-col gap-3 shadow-xs transition-shadow hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</span>
            <span className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
              stat.color === 'blue' ? "bg-blue-50 text-blue-600" :
              stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
              stat.color === 'amber' ? "bg-amber-50 text-amber-600" :
              "bg-purple-50 text-purple-600"
            )}>
              <stat.icon className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight">
              {stat.value}
            </div>
            {stat.label === 'Profile Completion' && !isNew && (
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                <div 
                  className={cn("h-1.5 rounded-full", profileCompletion >= 80 ? "bg-emerald-500" : profileCompletion >= 50 ? "bg-amber-500" : "bg-rose-500")}
                  style={{ width: `${profileCompletion}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
