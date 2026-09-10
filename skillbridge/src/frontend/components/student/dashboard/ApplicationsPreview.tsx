'use client';

import Link from 'next/link';
import { FileText, Building2, MapPin, ArrowRight, CheckCircle2, Clock, Calendar, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

export interface ApplicationItem {
  id: string;
  company: string;
  role: string;
  location: string;
  status: string;
  appliedDate: string;
}

interface ApplicationsPreviewProps {
  applications: ApplicationItem[];
}

export function ApplicationsPreview({ applications }: ApplicationsPreviewProps) {
  // Real status counts
  const appliedCount = applications.filter((a) => a.status === 'applied').length;
  const shortlistedCount = applications.filter(
    (a) => a.status === 'shortlisted' || a.status === 'under_review' || a.status === 'in-review'
  ).length;
  const interviewCount = applications.filter((a) => a.status === 'interview').length;
  const offerCount = applications.filter((a) => a.status === 'offer' || a.status === 'accepted').length;
  const placedCount = applications.filter((a) => a.status === 'placed').length;

  const PIPELINE_STAGES = [
    { key: 'applied', label: 'Applied', count: appliedCount },
    { key: 'shortlisted', label: 'Shortlisted', count: shortlistedCount },
    { key: 'interview', label: 'Interview', count: interviewCount },
    { key: 'offer', label: 'Offer', count: offerCount },
    { key: 'placed', label: 'Placed', count: placedCount },
  ];

  const recentApps = applications.slice(0, 3);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Application Pipeline
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Live tracking of your recruitment cycles from submission to offer.
            </p>
          </div>
          {applications.length > 0 && (
            <Link
              href="/student/applications"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 shrink-0"
            >
              <span>Track All ({applications.length})</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {/* Pipeline Stepper / Stages */}
        <div className="py-5 border-b border-slate-100">
          <div className="grid grid-cols-5 gap-2 text-center">
            {PIPELINE_STAGES.map((stage, idx) => {
              const hasItems = stage.count > 0;
              return (
                <div key={stage.key} className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs transition-colors mb-1.5",
                      hasItems
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-400 border border-slate-200/60"
                    )}
                  >
                    {stage.count}
                  </div>
                  <span
                    className={cn(
                      "text-[11px] font-bold tracking-tight",
                      hasItems ? "text-slate-900" : "text-slate-400"
                    )}
                  >
                    {stage.label}
                  </span>
                  {idx < PIPELINE_STAGES.length - 1 && (
                    <div className="hidden" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Applications List or Empty State */}
        <div className="pt-4">
          {applications.length === 0 ? (
            <div className="text-center py-6 px-4 space-y-2.5">
              <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto text-blue-600">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">No applications yet</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                Explore matched opportunities and submit your profile to initiate your placement journey.
              </p>
              <div className="pt-2">
                <Link
                  href="/student/opportunities"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
                >
                  <span>Explore Opportunities</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Recent Submissions
              </div>
              {recentApps.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-200/60 hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0 pr-3">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{app.role}</h4>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 font-medium truncate">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        {app.company}
                      </span>
                      <span>•</span>
                      <span>{app.appliedDate ? formatDate(app.appliedDate) : 'Recently applied'}</span>
                    </div>
                  </div>

                  <span
                    className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0",
                      app.status === 'accepted' || app.status === 'placed'
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : app.status === 'interview'
                        ? "bg-purple-50 text-purple-700 border border-purple-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    )}
                  >
                    {app.status.replace(/[-_]/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
