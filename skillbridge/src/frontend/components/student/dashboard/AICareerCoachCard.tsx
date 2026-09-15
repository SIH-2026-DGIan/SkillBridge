'use client';

import Link from 'next/link';
import { ArrowRight, FileCheck, Search, Video, Bot } from 'lucide-react';

interface InterviewHistory {
  id: string;
  role: string;
  type: string;
  score: number;
  date: string;
}

interface AICareerCoachCardProps {
  lastInterview?: InterviewHistory;
  targetRole?: string;
  gapsCount: number;
  hasResume: boolean;
}

export function AICareerCoachCard({
  lastInterview,
  targetRole,
  gapsCount,
  hasResume,
}: AICareerCoachCardProps) {
  const chips = [
    {
      label: 'Improve my Resume',
      href: '/student/profile',
      icon: FileCheck,
      note: hasResume ? 'Optimise for ATS' : 'Upload resume first',
    },
    {
      label: 'Find my Skill Gaps',
      href: '/student/skill-gaps',
      icon: Search,
      note:
        gapsCount > 0
          ? `${gapsCount} gap${gapsCount !== 1 ? 's' : ''} detected for ${targetRole || 'your role'}`
          : 'Run skill diagnostic',
    },
    {
      label: 'Prepare for Interviews',
      href: '/student/interview',
      icon: Video,
      note: lastInterview
        ? `Last score: ${lastInterview.score}% — ${lastInterview.role}`
        : 'Practice voice mock interview',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col overflow-hidden">
      {/* Subtle indigo accent strip */}
      <div className="h-1 w-full bg-indigo-500" aria-hidden="true" />

      <div className="p-5 sm:p-6 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600"
              aria-hidden="true"
            >
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">AI Career Coach</h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Your personalised placement assistant
              </p>
            </div>
          </div>
        </div>

        {/* Action chips */}
        <div className="flex flex-col gap-2" role="list" aria-label="AI Career Coach actions">
          {chips.map((chip) => (
            <Link
              key={chip.label}
              href={chip.href}
              className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/40 transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              role="listitem"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center text-slate-500 group-hover:text-indigo-600 transition-colors shrink-0"
                  aria-hidden="true"
                >
                  <chip.icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-800 transition-colors">
                    {chip.label}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">{chip.note}</div>
                </div>
              </div>
              <ArrowRight
                className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all shrink-0"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>

        {/* Primary CTA */}
        <Link
          href="/student/interview"
          className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          Ask AI Career Coach
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
