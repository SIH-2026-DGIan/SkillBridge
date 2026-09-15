'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Dimension {
  label: string;
  score: number | null;
  weight?: string;
}

interface CareerReadinessCardProps {
  overallScore: number | null;
  isAssessed: boolean;
  dimensions: Dimension[];
  aiInsight: string;
  targetRole?: string;
  gapsCount?: number;
  lastAssessedDate?: string;
}

export function CareerReadinessCard({
  overallScore,
  isAssessed,
  dimensions,
  aiInsight,
  targetRole,
  gapsCount = 0,
  lastAssessedDate,
}: CareerReadinessCardProps) {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    overallScore !== null ? circumference - (overallScore / 100) * circumference : circumference;

  const scoreColor =
    overallScore !== null
      ? overallScore >= 75
        ? 'text-emerald-500'
        : overallScore >= 50
        ? 'text-blue-600'
        : 'text-amber-500'
      : 'text-slate-300';

  const scoreLabel =
    overallScore !== null
      ? overallScore >= 75
        ? 'Placement Ready'
        : overallScore >= 50
        ? 'Developing'
        : 'Foundational'
      : '';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between h-full overflow-hidden">
      {/* Accent top bar */}
      <div className={cn('h-1 w-full', isAssessed ? 'bg-emerald-500' : 'bg-amber-400')} aria-hidden="true" />

      <div className="p-6 sm:p-7 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" aria-hidden="true" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Career Readiness
            </h2>
          </div>
          {isAssessed ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <ShieldCheck className="w-3 h-3" aria-hidden="true" />
              Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
              <AlertTriangle className="w-3 h-3" aria-hidden="true" />
              Pending
            </span>
          )}
        </div>

        {/* ── PENDING STATE ───────────────────────────────────────────── */}
        {!isAssessed ? (
          <div className="flex flex-col items-center text-center py-4 flex-1">
            {/* Intentional dashed placeholder ring */}
            <div className="relative w-32 h-32 mb-5 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140" aria-hidden="true">
                <circle
                  cx="70" cy="70" r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="9"
                  strokeDasharray="8 6"
                  className="text-slate-200"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-amber-400 mb-1" aria-hidden="true" />
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wide leading-tight text-center px-2">
                  Not<br />Assessed
                </span>
              </div>
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-1">Assessment Pending</h3>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs mb-5">
              Complete your SkillBridge assessment to calculate your verified career readiness score
              {targetRole ? ` for ${targetRole}` : ''}.
            </p>
            <Link
              href="/student/assessment"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Start Skill Assessment
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          /* ── ASSESSED STATE ──────────────────────────────────────────── */
          <>
            {/* Score + metadata row */}
            <div className="flex items-center gap-5 mb-5 pb-5 border-b border-slate-100">
              {/* Circular score */}
              <div className="relative w-28 h-28 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140" aria-hidden="true">
                  <circle cx="70" cy="70" r={radius} fill="none" stroke="#F1F5F9" strokeWidth="10" />
                  <circle
                    cx="70" cy="70" r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className={cn('transition-all duration-1000 ease-out', scoreColor)}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-slate-900 leading-none" aria-label={`${overallScore} percent`}>
                    {overallScore}%
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                    {scoreLabel}
                  </span>
                </div>
              </div>

              {/* Meta */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  Evaluated for{' '}
                  <span className="font-semibold text-slate-700">{targetRole || 'your target role'}</span>{' '}
                  based on assessed technical skills, role benchmarks, and competency profile.
                </p>
                {gapsCount > 0 && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200/60 text-amber-700 text-xs font-bold">
                    <AlertTriangle className="w-3 h-3" aria-hidden="true" />
                    {gapsCount} skill gap{gapsCount !== 1 ? 's' : ''} identified
                  </div>
                )}
                {gapsCount === 0 && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-bold">
                    <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                    All benchmarks met
                  </div>
                )}
                {lastAssessedDate && (
                  <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3" aria-hidden="true" />
                    Last assessed: {lastAssessedDate}
                  </div>
                )}
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="space-y-3 flex-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Score Breakdown
              </div>

              {dimensions.map((dim) => (
                <div key={dim.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{dim.label}</span>
                    {dim.score !== null ? (
                      <span
                        className={cn(
                          'font-bold tabular-nums',
                          dim.score >= 75
                            ? 'text-emerald-600'
                            : dim.score >= 50
                            ? 'text-blue-600'
                            : 'text-amber-600'
                        )}
                      >
                        {dim.score}%
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">–</span>
                    )}
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden" role="progressbar" aria-valuenow={dim.score ?? 0} aria-valuemin={0} aria-valuemax={100} aria-label={dim.label}>
                    {dim.score !== null ? (
                      <div
                        className={cn(
                          'h-full rounded-full transition-all duration-700',
                          dim.score >= 75
                            ? 'bg-emerald-500'
                            : dim.score >= 50
                            ? 'bg-blue-600'
                            : 'bg-amber-400'
                        )}
                        style={{ width: `${dim.score}%` }}
                      />
                    ) : (
                      <div className="h-full bg-slate-200/60 w-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* AI Insight — shown in both states */}
        {aiInsight && (
          <div className="mt-5 p-3 rounded-xl bg-blue-50/60 border border-blue-100/80">
            <div className="flex items-center gap-1.5 mb-1 text-blue-700 text-[11px] font-bold">
              <Sparkles className="w-3 h-3" aria-hidden="true" />
              <span>AI Insight</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{aiInsight}</p>
          </div>
        )}
      </div>
    </div>
  );
}
