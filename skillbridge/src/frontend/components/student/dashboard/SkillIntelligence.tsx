'use client';

import Link from 'next/link';
import {
  Sparkles,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Compass,
  AlertTriangle,
  BookOpen,
} from 'lucide-react';
import { SKILL_MAP } from '@/lib/skills-taxonomy';
import { cn } from '@/lib/utils';

export interface SkillGapItem {
  skillId: string;
  name: string;
  gap: number;
  required?: number;
  current?: number;
}

interface SkillIntelligenceProps {
  skills: Record<string, number>;
  skillGaps: SkillGapItem[];
  isAssessed: boolean;
  targetRole?: string;
}

function PriorityLabel({ gap }: { gap: number }) {
  if (gap >= 40) {
    return (
      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-50 text-red-600 border border-red-200/60 uppercase tracking-wide">
        High Priority
      </span>
    );
  }
  if (gap >= 20) {
    return (
      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200/60 uppercase tracking-wide">
        Medium Priority
      </span>
    );
  }
  return (
    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200/60 uppercase tracking-wide">
      Low Priority
    </span>
  );
}

export function SkillIntelligence({
  skills,
  skillGaps,
  isAssessed,
  targetRole,
}: SkillIntelligenceProps) {
  const skillEntries = Object.entries(skills);
  const topStrengths = [...skillEntries].sort(([, a], [, b]) => b - a).slice(0, 4);
  const topGaps = skillGaps.slice(0, 4);
  const hasData = isAssessed || skillEntries.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Accent top bar */}
      <div
        className={cn('h-1 w-full', hasData ? 'bg-indigo-500' : 'bg-slate-200')}
        aria-hidden="true"
      />

      <div className="p-6 sm:p-7 flex flex-col flex-1">
        {/* Card Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"
              aria-hidden="true"
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">Skill Intelligence</h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Gap detection for{' '}
                <span className="font-semibold text-slate-600">{targetRole || 'your target role'}</span>
              </p>
            </div>
          </div>
          {hasData && skillEntries.length > 0 && (
            <Link
              href="/student/skills"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label={`View all ${skillEntries.length} skills`}
            >
              All ({skillEntries.length})
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
            </Link>
          )}
        </div>

        {/* ── NO DATA: Assessment pending ──────────────────────────── */}
        {!hasData ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8 px-4 space-y-3">
            <div
              className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 mx-auto"
              aria-hidden="true"
            >
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Skills Not Yet Assessed</h3>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Complete your skill assessment to identify your highest-impact gaps and get
              personalized learning recommendations.
            </p>
            <Link
              href="/student/assessment"
              className="mt-1 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Start Assessment
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-5 flex-1">
            {/* ── STRENGTHS ──────────────────────────────────────────── */}
            {topStrengths.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
                    Your Strengths
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                    {topStrengths.length} verified
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {topStrengths.map(([skillId, score]) => {
                    const skillName = SKILL_MAP[skillId]?.name || skillId.replace(/_/g, ' ');
                    return (
                      <div
                        key={skillId}
                        className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100/80 flex items-center justify-between gap-1"
                      >
                        <span className="text-xs font-semibold text-slate-700 truncate" title={skillName}>
                          {skillName}
                        </span>
                        <span className="text-xs font-black text-emerald-600 shrink-0 tabular-nums">
                          {score}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── SKILL GAPS ────────────────────────────────────────── */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
                  Skill Gaps
                </span>
                {topGaps.length > 0 && (
                  <Link
                    href="/student/skill-gaps"
                    className="text-[10px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded border border-amber-200/60 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400"
                  >
                    {topGaps.length} gaps →
                  </Link>
                )}
              </div>

              {topGaps.length === 0 ? (
                <div
                  className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-800 font-medium flex items-center gap-2"
                  role="status"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                  <span>All benchmarks for {targetRole || 'your target role'} are met!</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {topGaps.map((gap) => {
                    const current = gap.current ?? 0;
                    const required = gap.required ?? Math.min(100, current + gap.gap);
                    const currentPct = Math.min(100, current);
                    const requiredPct = Math.min(100, required);

                    return (
                      <div key={gap.skillId} className="space-y-1.5">
                        {/* Label row */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">{gap.name}</span>
                          <PriorityLabel gap={gap.gap} />
                        </div>

                        {/* Current level bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-500 font-medium">Current</span>
                            <span className="text-slate-700 font-bold tabular-nums">{currentPct}%</span>
                          </div>
                          <div
                            className="relative w-full h-2 bg-slate-100 rounded-full overflow-visible"
                            role="progressbar"
                            aria-valuenow={currentPct}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`${gap.name} current level: ${currentPct}%`}
                          >
                            {/* Current fill */}
                            <div
                              className="absolute left-0 top-0 h-full rounded-full bg-amber-400 transition-all duration-700"
                              style={{ width: `${currentPct}%` }}
                            />
                            {/* Required marker */}
                            <div
                              className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-blue-600 rounded-full"
                              style={{ left: `${requiredPct}%` }}
                              title={`Required: ${requiredPct}%`}
                              aria-label={`Required level: ${requiredPct}%`}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-400">Required</span>
                            <span className="text-blue-600 font-bold tabular-nums">{requiredPct}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Learning path CTA */}
                  <Link
                    href="/student/learning"
                    className="inline-flex items-center gap-1.5 mt-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    aria-label="View personalized learning path to close skill gaps"
                  >
                    <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                    View Learning Path
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
