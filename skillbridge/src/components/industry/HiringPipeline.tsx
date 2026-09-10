'use client';

import Link from 'next/link';
import { ArrowRight, ChevronRight, FileText, CheckCircle2, Award, Briefcase, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HiringPipelineProps {
  applicantsCount?: number;
  shortlistedCount?: number;
  interviewsCount?: number;
  offersCount?: number;
  hiredCount?: number;
}

export function HiringPipeline({
  applicantsCount = 0,
  shortlistedCount = 0,
  interviewsCount = 0,
  offersCount = 0,
  hiredCount = 0,
}: HiringPipelineProps) {
  const stages = [
    { label: 'Applicants', count: applicantsCount, icon: FileText, color: 'blue' },
    { label: 'AI Shortlisted', count: shortlistedCount, icon: CheckCircle2, color: 'indigo' },
    { label: 'Interviews', count: interviewsCount, icon: Award, color: 'violet' },
    { label: 'Offers', count: offersCount, icon: Briefcase, color: 'purple' },
    { label: 'Hired', count: hiredCount, icon: CheckCircle2, color: 'emerald' },
  ];

  const hasActivity = applicantsCount > 0 || shortlistedCount > 0;
  const shortlistRatio = applicantsCount > 0 ? Math.round((shortlistedCount / applicantsCount) * 100) : 0;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Hiring Pipeline
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Live progression funnel from initial applicant intake to confirmed hires.
            </p>
          </div>
          {hasActivity && (
            <Link
              href="/industry/applications"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 shrink-0"
            >
              <span>Manage Funnel</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {/* Connected Funnel Stages */}
        <div className="py-5">
          {!hasActivity ? (
            <div className="text-center py-6 px-4 space-y-2.5">
              <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">No pipeline activity yet</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                Post an opportunity to start building your hiring funnel and sourcing verified talent.
              </p>
              <div className="pt-2">
                <Link
                  href="/industry/opportunities/new"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Post Opportunity</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-2">
              {stages.map((stage, idx) => (
                <div key={stage.label} className="relative flex flex-col items-center">
                  <div className="w-full rounded-xl bg-slate-50/80 border border-slate-200/60 p-3.5 text-center flex flex-col items-center hover:bg-slate-50 transition-colors">
                    <span
                      className={cn(
                        'w-7 h-7 rounded-lg flex items-center justify-center mb-2',
                        stage.color === 'blue' && 'bg-blue-50 text-blue-600',
                        stage.color === 'indigo' && 'bg-indigo-50 text-indigo-600',
                        stage.color === 'violet' && 'bg-purple-50 text-purple-600',
                        stage.color === 'purple' && 'bg-violet-50 text-violet-600',
                        stage.color === 'emerald' && 'bg-emerald-50 text-emerald-600'
                      )}
                    >
                      <stage.icon className="w-3.5 h-3.5" />
                    </span>

                    <span className="text-2xl font-black text-slate-900 tracking-tight">
                      {stage.count}
                    </span>

                    <span className="text-xs font-bold text-slate-600 mt-1">
                      {stage.label}
                    </span>
                  </div>

                  {/* Connecting Arrow for Desktop */}
                  {idx < stages.length - 1 && (
                    <div className="hidden sm:flex absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {hasActivity && (
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Conversion: <strong>{shortlistRatio}%</strong> applicant to AI shortlist ratio</span>
          <Link href="/industry/applications" className="font-bold text-blue-600 hover:text-blue-700">
            Open full applicant tracking board →
          </Link>
        </div>
      )}
    </div>
  );
}
