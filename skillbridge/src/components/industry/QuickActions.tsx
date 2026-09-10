'use client';

import Link from 'next/link';
import { Plus, Users, FileText, Building2, ArrowRight } from 'lucide-react';

export function QuickActions() {
  const actions = [
    {
      label: 'Post New Opportunity',
      description: 'Create internship, job or project opening',
      href: '/industry/opportunities/new',
      icon: Plus,
      primary: true,
    },
    {
      label: 'View Candidates',
      description: 'Browse AI-ranked talent pool',
      href: '/industry/candidates',
      icon: Users,
      primary: false,
    },
    {
      label: 'Open Hiring Pipeline',
      description: 'Review applicants & schedule technical rounds',
      href: '/industry/applications',
      icon: FileText,
      primary: false,
    },
    {
      label: 'Company Profile',
      description: 'Manage branding & recruiting team',
      href: '/industry/profile',
      icon: Building2,
      primary: false,
    },
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-3.5">
          <h3 className="text-sm font-black text-slate-900 tracking-tight">
            Quick Actions
          </h3>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Shortcuts
          </span>
        </div>

        <div className="space-y-2.5">
          {actions.map((act) => (
            <Link
              key={act.label}
              href={act.href}
              className={
                act.primary
                  ? 'flex items-center justify-between p-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs hover:shadow-sm transition-all group'
                  : 'flex items-center justify-between p-3 rounded-xl bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200/60 text-slate-800 text-xs font-semibold transition-all group'
              }
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <act.icon
                  className={
                    act.primary
                      ? 'w-4 h-4 text-white shrink-0'
                      : 'w-4 h-4 text-slate-500 group-hover:text-blue-600 shrink-0 transition-colors'
                  }
                />
                <div className="min-w-0">
                  <div className="truncate font-bold">{act.label}</div>
                  <div
                    className={
                      act.primary
                        ? 'text-[10px] text-blue-100 truncate font-normal'
                        : 'text-[10px] text-slate-400 truncate font-normal'
                    }
                  >
                    {act.description}
                  </div>
                </div>
              </div>
              <ArrowRight
                className={
                  act.primary
                    ? 'w-3.5 h-3.5 text-blue-200 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2'
                    : 'w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2'
                }
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
