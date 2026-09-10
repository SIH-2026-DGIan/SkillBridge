'use client';

import { Activity, CheckCircle2, Video, FileText, Upload, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

export interface ActivityEvent {
  id: string;
  title: string;
  description?: string;
  timestamp?: string;
  type: 'assessment' | 'interview' | 'resume' | 'application' | 'profile';
}

interface RecentActivityCardProps {
  events: ActivityEvent[];
}

export function RecentActivityCard({ events }: RecentActivityCardProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
              <p className="text-[11px] text-slate-500">Live timeline of verified milestones</p>
            </div>
          </div>
          {events.length > 0 && (
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              {events.length} Events
            </span>
          )}
        </div>

        {/* Timeline Events or Empty State */}
        <div className="py-4">
          {events.length === 0 ? (
            <div className="text-center py-6 px-4 space-y-2">
              <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Activity className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-slate-800">No recent activity</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs mx-auto">
                Actions like completing skill assessments, practicing interviews, and submitting applications will appear here.
              </p>
            </div>
          ) : (
            <div className="relative pl-4 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
              {events.map((event) => {
                const isInterview = event.type === 'interview';
                const isAssess = event.type === 'assessment';
                const isApp = event.type === 'application';
                const isResume = event.type === 'resume';

                return (
                  <div key={event.id} className="relative flex items-start gap-3 text-xs">
                    {/* Timeline bullet icon */}
                    <span
                      className={cn(
                        "absolute -left-4 w-4 h-4 rounded-full flex items-center justify-center ring-4 ring-white shrink-0 text-white",
                        isAssess && "bg-blue-600",
                        isInterview && "bg-purple-600",
                        isApp && "bg-emerald-600",
                        isResume && "bg-amber-500",
                        !isAssess && !isInterview && !isApp && !isResume && "bg-slate-400"
                      )}
                    >
                      {isAssess && <CheckCircle2 className="w-2.5 h-2.5" />}
                      {isInterview && <Video className="w-2.5 h-2.5" />}
                      {isApp && <FileText className="w-2.5 h-2.5" />}
                      {isResume && <Upload className="w-2.5 h-2.5" />}
                    </span>

                    <div className="min-w-0 flex-1 ml-1.5">
                      <p className="font-bold text-slate-900 leading-snug truncate">
                        {event.title}
                      </p>
                      {event.description && (
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-tight truncate">
                          {event.description}
                        </p>
                      )}
                      <span className="text-[10px] text-slate-400 font-medium block mt-1">
                        {event.timestamp ? formatDate(event.timestamp) : 'Recent action'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
