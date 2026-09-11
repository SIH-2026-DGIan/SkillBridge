import Link from 'next/link';
import { Target, Building, Calendar, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import type { UserSession } from '@/lib/user-session';
import { cn } from '@/lib/utils';

interface CareerHeroProps {
  user: UserSession;
  status: 'placement_ready' | 'in_progress' | 'needs_attention';
  primaryCta: {
    label: string;
    href: string;
  };
  aiInsight?: string;
}

export function CareerHero({ user, status, primaryCta, aiInsight }: CareerHeroProps) {
  const fullName = user.name || 'Candidate';

  const academicYearLabel = user.academicYear 
    ? user.academicYear 
    : user.graduationYear 
      ? `Class of ${user.graduationYear}` 
      : user.year 
        ? `${user.year} Year` 
        : null;

  const institutionLabel = user.college || user.institutionName || null;

  const defaultInsight = user.isAssessed
    ? `Your verified assessment score is ${user.assessmentScore || 80}%. Continue closing key skill gaps to maximize placement alignment.`
    : "Complete your skill assessment to unlock personalized career recommendations and identify your strongest skills and skill gaps.";

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Greeting and Subtitle */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Welcome back, {fullName} 👋
            </h1>
          </div>
          <p className="text-slate-500 text-sm font-medium">
            Your personalized career journey starts here.
          </p>

          {/* Compact Career Snapshot Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5">
            {/* Target Role */}
            <div className="bg-slate-50/80 border border-slate-200/60 rounded-xl p-3 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Target className="w-3 h-3 text-blue-600" />
                Target Role
              </span>
              <span className={cn(
                "text-xs font-bold mt-1 truncate",
                user.targetRole ? "text-slate-900" : "text-slate-400 italic"
              )}>
                {user.targetRole || 'Not selected'}
              </span>
            </div>

            {/* Institution */}
            <div className="bg-slate-50/80 border border-slate-200/60 rounded-xl p-3 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Building className="w-3 h-3 text-indigo-600" />
                Institution
              </span>
              <span className={cn(
                "text-xs font-bold mt-1 truncate",
                institutionLabel ? "text-slate-900" : "text-slate-400 italic"
              )} title={institutionLabel || undefined}>
                {institutionLabel || 'Institution not set'}
              </span>
            </div>

            {/* Academic Year */}
            <div className="bg-slate-50/80 border border-slate-200/60 rounded-xl p-3 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-emerald-600" />
                Academic Year
              </span>
              <span className={cn(
                "text-xs font-bold mt-1 truncate",
                academicYearLabel ? "text-slate-900" : "text-slate-400 italic"
              )}>
                {academicYearLabel || 'Not specified'}
              </span>
            </div>

            {/* Profile Status */}
            <div className="bg-slate-50/80 border border-slate-200/60 rounded-xl p-3 flex flex-col justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-purple-600" />
                Profile Status
              </span>
              <div className="mt-1 flex items-center gap-1.5">
                <span className={cn(
                  "w-2 h-2 rounded-full shrink-0",
                  status === 'placement_ready' && "bg-emerald-500 ring-2 ring-emerald-100",
                  status === 'in_progress' && "bg-blue-500 ring-2 ring-blue-100",
                  status === 'needs_attention' && "bg-amber-500 ring-2 ring-amber-100"
                )} />
                <span className={cn(
                  "text-xs font-bold capitalize truncate",
                  status === 'placement_ready' && "text-emerald-700",
                  status === 'in_progress' && "text-blue-700",
                  status === 'needs_attention' && "text-amber-700"
                )}>
                  {status === 'placement_ready' ? 'Placement Ready' : status === 'in_progress' ? 'In Progress' : 'Needs Attention'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Primary Contextual CTA */}
        <div className="shrink-0 flex flex-col items-start lg:items-end justify-center">
          <Link
            href={primaryCta.href}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs hover:shadow-sm transition-all group"
          >
            <span>{primaryCta.label}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <span className="text-[11px] text-slate-400 mt-2 font-medium">
            Real-time status synced with verified profile
          </span>
        </div>
      </div>

      {/* AI Career Insight Box */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-start gap-3 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-slate-50/50 p-3.5 rounded-xl border border-blue-100/60">
        <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <div className="text-xs">
          <span className="font-bold text-slate-900 mr-2">AI Career Insight:</span>
          <span className="text-slate-600 leading-relaxed font-medium">
            {aiInsight || defaultInsight}
          </span>
        </div>
      </div>
    </div>
  );
}
