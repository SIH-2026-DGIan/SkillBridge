'use client';

import Link from 'next/link';
import { Sparkles, CheckCircle2, TrendingUp, ArrowRight, ShieldCheck, Target, Compass } from 'lucide-react';
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

  // Recommended Next Step based on actual backend results
  const recommendedStep = !hasData
    ? {
        action: 'Take Skill Assessment',
        reason: 'Validate core competencies and establish verified benchmarks.',
        href: '/student/assessment',
      }
    : topGaps.length > 0
    ? {
        action: `Bridge gap in ${topGaps[0].name}`,
        reason: `Your profile is ${topGaps[0].gap}% below the industry benchmark for ${targetRole || 'your target role'}.`,
        href: '/student/learning',
      }
    : {
        action: 'Explore Matched Roles',
        reason: `All target competencies for ${targetRole || 'your target role'} are fulfilled. Submit your applications.`,
        href: '/student/opportunities',
      };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col justify-between h-full">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                AI Skill Intelligence
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Real-time gap detection & role alignment for {targetRole || 'selected role'}
              </p>
            </div>
          </div>
          {hasData && (
            <Link
              href="/student/skills"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              <span>View All ({skillEntries.length})</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {/* Content Body */}
        {!hasData ? (
          <div className="py-12 px-4 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto text-indigo-600">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Skill Intelligence Pending
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              Complete your skill assessment to unlock AI-powered skill analysis.
            </p>
            <div className="pt-2">
              <Link
                href="/student/assessment"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              >
                <span>Check Your Skills</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-5">
            {/* 1. Your Strengths */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Your Strengths
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {topStrengths.length} Verified
                </span>
              </div>

              {topStrengths.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-1">No verified skills recorded yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {topStrengths.map(([skillId, score]) => {
                    const skillName = SKILL_MAP[skillId]?.name || skillId;
                    return (
                      <div
                        key={skillId}
                        className="p-2.5 rounded-xl bg-slate-50/70 flex items-center justify-between"
                      >
                        <div className="min-w-0 pr-2">
                          <span className="text-xs font-bold text-slate-800 truncate block">
                            {skillName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            Demonstrated proficiency
                          </span>
                        </div>
                        <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded shrink-0">
                          {score}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. Skills to Improve */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                  Skills to Improve
                </span>
                <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  {topGaps.length} Target Gaps
                </span>
              </div>

              {topGaps.length === 0 ? (
                <div className="p-3 rounded-xl bg-emerald-50/60 text-xs text-emerald-800 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>All core benchmarks for {targetRole || 'your target role'} are satisfied!</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {topGaps.map((gap) => (
                    <div key={gap.skillId} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">{gap.name}</span>
                        <span className="font-bold text-amber-600 text-[11px]">
                          Gap: {gap.gap}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-amber-400 transition-all duration-500"
                          style={{ width: `${Math.min(100, gap.gap)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Recommended Next Step */}
            <div className="pt-2">
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-50/80 to-indigo-50/60 border border-blue-100/80 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block mb-0.5">
                    Recommended Next Step
                  </span>
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {recommendedStep.action}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {recommendedStep.reason}
                  </p>
                </div>
                <Link
                  href={recommendedStep.href}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shrink-0 shadow-xs"
                >
                  <span>Go</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
