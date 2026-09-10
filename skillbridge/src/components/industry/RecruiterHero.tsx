'use client';

import Link from 'next/link';
import { Plus, ArrowRight, Sparkles, Building2, ShieldCheck } from 'lucide-react';

interface RecruiterHeroProps {
  companyName: string;
  userName: string;
}

export function RecruiterHero({ companyName, userName }: RecruiterHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white p-6 sm:p-8 shadow-sm border border-slate-800">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-blue-300 text-[11px] font-bold uppercase tracking-wider mb-3 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>AI-Powered Talent Acquisition</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
            Recruiter Command Center
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
            Build stronger teams with verified talent. Source, evaluate, and hire benchmarked candidates across India's top partner institutions.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span suppressHydrationWarning>{companyName}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg" suppressHydrationWarning>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span suppressHydrationWarning>Recruiter: <strong className="text-white" suppressHydrationWarning>{userName}</strong> (Talent Acquisition Lead)</span>
            </div>
          </div>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Link
            href="/industry/applications"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/15 transition-all text-center"
          >
            <span>View Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/industry/opportunities/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-md hover:shadow-lg transition-all group text-center"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Opportunity</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
