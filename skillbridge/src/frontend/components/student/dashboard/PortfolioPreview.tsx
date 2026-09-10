'use client';

import Link from 'next/link';
import { FolderOpen, CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PortfolioChecklistStatus {
  hasResume: boolean;
  skillsCount: number;
  hasProjects: boolean;
  hasCertifications: boolean;
  hasInternships: boolean;
}

interface PortfolioPreviewProps {
  status: PortfolioChecklistStatus;
}

export function PortfolioPreview({ status }: PortfolioPreviewProps) {
  const checklist = [
    { label: 'Resume Uploaded', completed: status.hasResume },
    { label: 'Skills Extracted & Verified', completed: status.skillsCount > 0 },
    { label: 'Featured Projects', completed: status.hasProjects },
    { label: 'Industry Certifications', completed: status.hasCertifications },
    { label: 'Internships & Experience', completed: status.hasInternships },
  ];

  const completedCount = checklist.filter((i) => i.completed).length;
  const totalCount = checklist.length;
  const percentage = Math.round((completedCount / totalCount) * 100);
  const isStarted = completedCount > 0;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Portfolio Readiness</h3>
              <p className="text-[11px] text-slate-500">Recruiter artifact verification</p>
            </div>
          </div>
          {isStarted ? (
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">
              {percentage}%
            </span>
          ) : (
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
              Not Started
            </span>
          )}
        </div>

        {/* Readiness Meter or Empty State */}
        <div className="py-4 space-y-3.5">
          {isStarted ? (
            <>
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-600">Portfolio Completeness</span>
                  <span className="font-bold text-slate-900">{completedCount} of {totalCount} completed</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700",
                      percentage >= 80 ? "bg-emerald-500" : percentage >= 40 ? "bg-blue-600" : "bg-amber-500"
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Checklist items */}
              <div className="space-y-2 pt-1">
                {checklist.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-2">
                      {item.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                      )}
                      <span className={cn(
                        "font-medium",
                        item.completed ? "text-slate-800" : "text-slate-400"
                      )}>
                        {item.label}
                      </span>
                    </div>
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-wider",
                      item.completed ? "text-emerald-700" : "text-slate-400"
                    )}>
                      {item.completed ? 'Verified' : 'Missing'}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-4 px-2 space-y-2">
              <p className="text-xs text-slate-500 leading-relaxed">
                Complete your profile to measure portfolio readiness.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="pt-3 border-t border-slate-100">
        <Link
          href="/student/portfolio"
          className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
        >
          <span>Build My Portfolio</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
