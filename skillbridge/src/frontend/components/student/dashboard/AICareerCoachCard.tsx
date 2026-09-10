'use client';

import Link from 'next/link';
import { Sparkles, Video, ArrowRight, FileCheck, Search, Activity, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const suggestions = [
    {
      title: 'Improve my resume',
      description: hasResume ? 'Fine-tune bullet points for ATS matching' : 'Upload resume to extract skills',
      href: '/student/profile',
      icon: FileCheck,
      badge: hasResume ? 'Resume uploaded' : 'Pending',
    },
    {
      title: 'Find my skill gaps',
      description: gapsCount > 0 ? `${gapsCount} gaps identified for ${targetRole || 'your role'}` : 'Run skill diagnostic test',
      href: '/student/skill-gaps',
      icon: Search,
      badge: gapsCount > 0 ? `${gapsCount} gaps` : 'Optimized',
    },
    {
      title: 'Prepare for interviews',
      description: lastInterview ? `Last score: ${lastInterview.score}% on ${lastInterview.role}` : 'Practice real-time voice interview with Gemini Live',
      href: '/student/interview',
      icon: Video,
      badge: lastInterview ? `${lastInterview.score}%` : 'Practice now',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-sm relative overflow-hidden flex flex-col justify-between h-full">
      {/* Subtle AI Glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-indigo-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white tracking-tight flex items-center gap-2">
                AI Career Coach
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded border border-indigo-400/20">
                  Gemini Live
                </span>
              </h3>
              <p className="text-[11px] text-indigo-200/80 font-medium">Your personal placement assistant</p>
            </div>
          </div>
        </div>

        {/* 3 Actionable Suggestions */}
        <div className="py-4 space-y-2.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-300/70">
            Actionable AI Assistance
          </div>

          {suggestions.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-300 shrink-0">
                  <item.icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white group-hover:text-indigo-200 transition-colors truncate">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-indigo-200/70 truncate">
                    {item.description}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-indigo-200 border border-white/10">
                  {item.badge}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-300 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Primary CTA */}
      <div className="relative z-10 pt-3 border-t border-indigo-800/60">
        <Link
          href="/student/interview"
          className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all group"
        >
          <span>Ask AI Career Coach</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
