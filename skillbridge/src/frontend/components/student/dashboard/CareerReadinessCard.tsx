'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, AlertCircle, ShieldAlert, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Dimension {
  label: string;
  score: number | null; // null means assessment pending
  weight?: string;
}

interface CareerReadinessCardProps {
  overallScore: number | null; // null if not assessed
  isAssessed: boolean;
  dimensions: Dimension[];
  aiInsight: string;
  targetRole?: string;
}

export function CareerReadinessCard({
  overallScore,
  isAssessed,
  dimensions,
  aiInsight,
  targetRole,
}: CareerReadinessCardProps) {
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = overallScore !== null 
    ? circumference - (overallScore / 100) * circumference 
    : circumference;

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Career Readiness Index
            </h2>
          </div>
          {isAssessed ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              Verified Profile
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
              Assessment Pending
            </span>
          )}
        </div>

        {/* Circular Metric and Overall Stat */}
        <div className="flex flex-col sm:flex-row items-center gap-6 py-6 border-b border-slate-100">
          <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 148 148">
              {/* Background circle */}
              <circle
                cx="74"
                cy="74"
                r={radius}
                className="stroke-slate-100"
                strokeWidth="11"
                fill="transparent"
              />
              {/* Animated Progress circle */}
              {overallScore !== null && (
                <circle
                  cx="74"
                  cy="74"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="11"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className={cn(
                    "transition-all duration-1000 ease-out",
                    overallScore >= 75 ? "text-emerald-500" : overallScore >= 50 ? "text-blue-600" : "text-amber-500"
                  )}
                />
              )}
            </svg>

            {/* Metric Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              {overallScore !== null ? (
                <>
                  <span className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                    {overallScore}%
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                    {overallScore >= 75 ? 'Placement Ready' : overallScore >= 50 ? 'Developing' : 'Foundational'}
                  </span>
                </>
              ) : (
                <div className="flex flex-col items-center px-2">
                  <ShieldAlert className="w-6 h-6 text-amber-500 mb-0.5" />
                  <span className="text-[11px] font-bold text-slate-500 leading-tight">
                    Assessment
                  </span>
                  <span className="text-[10px] font-bold text-amber-600 uppercase">
                    Pending
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg font-black text-slate-900">
              Overall Career Readiness
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {isAssessed
                ? `Evaluation for ${targetRole || 'selected target role'} based on verified skill tests, technical proficiency, and role benchmarks.`
                : 'Take the SkillBridge assessment to evaluate your technical competencies and unlock AI-powered opportunity matching.'}
            </p>

            {!isAssessed && (
              <div className="mt-3">
                <Link
                  href="/student/assessment"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  <span>Start Skill Assessment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Readiness Dimensions */}
        <div className="py-5 space-y-3.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Readiness Dimensions
          </div>

          {dimensions.map((dim) => (
            <div key={dim.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">{dim.label}</span>
                {dim.score !== null ? (
                  <span className="font-bold text-slate-900">{dim.score}%</span>
                ) : (
                  <span className="text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
                    Assessment pending
                  </span>
                )}
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                {dim.score !== null ? (
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700",
                      dim.score >= 75 ? "bg-emerald-500" : dim.score >= 50 ? "bg-blue-600" : "bg-amber-500"
                    )}
                    style={{ width: `${dim.score}%` }}
                  />
                ) : (
                  <div className="h-full bg-slate-200/70 w-0" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insight Box */}
      <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-br from-indigo-50/70 to-blue-50/60 border border-indigo-100/80">
        <div className="flex items-center gap-1.5 mb-1 text-indigo-700 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>AI Insight</span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed font-medium">
          {aiInsight}
        </p>
      </div>
    </div>
  );
}
