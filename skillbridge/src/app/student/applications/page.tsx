'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Clock, XCircle, ArrowRight, Briefcase, Calendar } from 'lucide-react';
import { DEMO_APPLICATIONS, DEMO_OPPORTUNITIES } from '@/lib/demo-data';
import { formatDate } from '@/lib/utils';

type AppStatus = 'applied' | 'shortlisted' | 'interview' | 'selected' | 'rejected';

const STATUS_CONFIG: Record<AppStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  applied: { label: 'Applied', color: 'text-blue-600', bg: 'bg-blue-500', icon: Clock },
  shortlisted: { label: 'Shortlisted', color: 'text-purple-600', bg: 'bg-purple-500', icon: CheckCircle },
  interview: { label: 'Interview', color: 'text-orange-600', bg: 'bg-orange-500', icon: Clock },
  selected: { label: 'Selected', color: 'text-green-600', bg: 'bg-green-500', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'text-red-600', bg: 'bg-red-500', icon: XCircle },
};

const PIPELINE: AppStatus[] = ['applied', 'shortlisted', 'interview', 'selected'];

function StatusTimeline({ currentStatus }: { currentStatus: AppStatus }) {
  if (currentStatus === 'rejected') {
    return (
      <div className="flex items-center gap-2 mt-3">
        <span className="px-2.5 py-1 text-xs font-semibold bg-red-50 text-red-600 rounded-full border border-red-200">
          ✗ Not Selected
        </span>
      </div>
    );
  }

  const currentIdx = PIPELINE.indexOf(currentStatus);

  return (
    <div className="flex items-center gap-1 mt-3 flex-wrap">
      {PIPELINE.map((status, idx) => {
        const isCompleted = idx <= currentIdx;
        const isCurrent = idx === currentIdx;
        const config = STATUS_CONFIG[status];

        return (
          <div key={status} className="flex items-center gap-1">
            <div className="flex items-center gap-1.5">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  isCompleted ? config.bg : 'bg-gray-200'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                )}
              </div>
              <span
                className={`text-xs font-semibold ${
                  isCurrent ? config.color : isCompleted ? 'text-gray-600' : 'text-gray-400'
                }`}
              >
                {config.label}
              </span>
            </div>
            {idx < PIPELINE.length - 1 && (
              <ArrowRight className={`w-3 h-3 mx-0.5 ${isCompleted && idx < currentIdx ? 'text-gray-500' : 'text-gray-300'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

const ALL_STATUSES: (AppStatus | 'all')[] = ['all', 'applied', 'shortlisted', 'interview', 'selected', 'rejected'];

export default function ApplicationsPage() {
  const [filter, setFilter] = useState<AppStatus | 'all'>('all');

  const applications = DEMO_APPLICATIONS.map((app) => ({
    ...app,
    status: app.status as AppStatus,
    opportunity: DEMO_OPPORTUNITIES.find((o) => o.id === app.opportunityId),
  }));

  const filtered = filter === 'all' ? applications : applications.filter((a) => a.status === filter);

  const counts: Record<string, number> = {};
  for (const app of applications) {
    counts[app.status] = (counts[app.status] ?? 0) + 1;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">My Applications</h1>
        <p className="text-gray-500 text-sm mt-0.5">Track all your applications in one place</p>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {PIPELINE.map((status) => {
          const config = STATUS_CONFIG[status];
          const count = counts[status] ?? 0;
          return (
            <div
              key={status}
              className={`rounded-xl border p-3 text-center cursor-pointer transition-all ${
                filter === status ? 'border-blue-300 bg-blue-50' : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
              onClick={() => setFilter(filter === status ? 'all' : status)}
            >
              <div className={`text-2xl font-extrabold ${config.color}`}>{count}</div>
              <div className="text-xs text-gray-500 mt-0.5">{config.label}</div>
            </div>
          );
        })}
        <div
          className={`rounded-xl border p-3 text-center cursor-pointer transition-all ${
            filter === 'rejected' ? 'border-red-200 bg-red-50' : 'border-gray-100 bg-white hover:border-gray-200'
          }`}
          onClick={() => setFilter(filter === 'rejected' ? 'all' : 'rejected')}
        >
          <div className="text-2xl font-extrabold text-red-500">{counts['rejected'] ?? 0}</div>
          <div className="text-xs text-gray-500 mt-0.5">Rejected</div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {ALL_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
              filter === s
                ? 'bg-gray-900 text-white border-gray-900'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            {s === 'all' ? `All (${applications.length})` : `${STATUS_CONFIG[s].label} (${counts[s] ?? 0})`}
          </button>
        ))}
      </div>

      {/* Applications list */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-700">No applications {filter !== 'all' ? `with status "${filter}"` : 'yet'}</h3>
          {filter === 'all' && (
            <Link href="/student/opportunities" className="mt-3 inline-flex items-center gap-1 text-blue-600 text-sm font-semibold">
              Browse Opportunities <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => {
            const statusConfig = STATUS_CONFIG[app.status as AppStatus];
            return (
              <div key={app.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Company logo */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {app.company[0]}
                    </div>

                    <div className="flex-1">
                      <h2 className="font-bold text-gray-900">{app.title}</h2>
                      <div className="text-sm text-gray-600">{app.company}</div>

                      {/* Timeline */}
                      <StatusTimeline currentStatus={app.status as AppStatus} />

                      <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Applied {formatDate(app.appliedAt)}
                        </span>
                        {app.updatedAt !== app.appliedAt && (
                          <span>
                            · Updated {formatDate(app.updatedAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      app.status === 'selected' ? 'bg-green-100 text-green-700' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-600' :
                      app.status === 'interview' ? 'bg-orange-100 text-orange-700' :
                      app.status === 'shortlisted' ? 'bg-purple-100 text-purple-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {statusConfig?.label ?? app.status}
                    </span>
                    <Link
                      href={`/student/opportunities/${app.opportunityId}`}
                      className="text-xs text-blue-600 font-semibold hover:text-blue-700"
                    >
                      View Opportunity →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CTA if no applications */}
      {applications.length === 0 && (
        <div className="text-center py-8">
          <Link
            href="/student/opportunities"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Briefcase className="w-4 h-4" /> Find Opportunities
          </Link>
        </div>
      )}
    </div>
  );
}
