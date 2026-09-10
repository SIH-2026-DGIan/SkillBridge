'use client';

import { Briefcase, Users, Zap, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IndustryKpisProps {
  activeJobsCount?: number;
  totalApplicantsCount?: number;
  shortlistedCount?: number;
  interviewsCount?: number;
}

export function IndustryKpis({
  activeJobsCount = 0,
  totalApplicantsCount = 0,
  shortlistedCount = 0,
  interviewsCount = 0,
}: IndustryKpisProps) {
  const kpis = [
    {
      label: 'Active Opportunities',
      metric: activeJobsCount,
      supportingText: activeJobsCount > 0
        ? `${activeJobsCount} live role${activeJobsCount > 1 ? 's' : ''}`
        : 'No active postings',
      icon: Briefcase,
      color: 'blue',
      badge: activeJobsCount > 0 ? 'Live' : '—',
    },
    {
      label: 'Total Applicants',
      metric: totalApplicantsCount,
      supportingText: totalApplicantsCount > 0
        ? `${totalApplicantsCount} candidate application${totalApplicantsCount > 1 ? 's' : ''}`
        : 'No applicants yet',
      icon: Users,
      color: 'indigo',
      badge: totalApplicantsCount > 0 ? 'Verified' : '—',
    },
    {
      label: 'AI Shortlisted',
      metric: shortlistedCount,
      supportingText: shortlistedCount > 0
        ? `${shortlistedCount} candidate${shortlistedCount > 1 ? 's' : ''} qualified`
        : 'No candidates shortlisted',
      icon: Zap,
      color: 'violet',
      badge: shortlistedCount > 0 ? 'Qualified' : '—',
    },
    {
      label: 'Interviews Scheduled',
      metric: interviewsCount,
      supportingText: interviewsCount > 0
        ? `${interviewsCount} technical evaluation${interviewsCount > 1 ? 's' : ''}`
        : 'No interviews scheduled',
      icon: Award,
      color: 'emerald',
      badge: interviewsCount > 0 ? 'In Progress' : '—',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {kpi.label}
              </span>
              <span
                className={cn(
                  'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105',
                  kpi.color === 'blue' && 'bg-blue-50 text-blue-600 border border-blue-200/50',
                  kpi.color === 'indigo' && 'bg-indigo-50 text-indigo-600 border border-indigo-200/50',
                  kpi.color === 'violet' && 'bg-purple-50 text-purple-600 border border-purple-200/50',
                  kpi.color === 'emerald' && 'bg-emerald-50 text-emerald-600 border border-emerald-200/50'
                )}
              >
                <kpi.icon className="w-4 h-4" />
              </span>
            </div>

            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {kpi.metric}
            </div>

            <p className="text-[11px] text-slate-500 font-medium mt-1">
              {kpi.supportingText}
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold">
            <span className="text-slate-400">Status</span>
            <span
              className={cn(
                'px-2 py-0.5 rounded-md',
                kpi.color === 'blue' && 'bg-blue-50 text-blue-700',
                kpi.color === 'indigo' && 'bg-indigo-50 text-indigo-700',
                kpi.color === 'violet' && 'bg-purple-50 text-purple-700',
                kpi.color === 'emerald' && 'bg-emerald-50 text-emerald-700'
              )}
            >
              {kpi.badge}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
