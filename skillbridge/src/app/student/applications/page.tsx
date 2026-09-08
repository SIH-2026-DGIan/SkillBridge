'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Clock, XCircle, ArrowRight, Briefcase, ChevronRight } from 'lucide-react';
import { DEMO_APPLICATIONS, DEMO_OPPORTUNITIES } from '@/lib/demo-data';
import { formatDate } from '@/lib/utils';

type AppStatus = 'applied' | 'under_review' | 'shortlisted' | 'interview' | 'selected' | 'rejected';

const PIPELINE: AppStatus[] = ['applied', 'under_review', 'shortlisted', 'interview', 'selected'];

export default function ApplicationsPage() {
  const [filter, setFilter] = useState<AppStatus | 'all'>('all');

  const applications = DEMO_APPLICATIONS.map((app) => ({
    ...app,
    // normalize demo data status if needed
    status: ((app.status as string) === 'under_review' || (app.status as string) === 'applied' || (app.status as string) === 'shortlisted' || (app.status as string) === 'interview' || (app.status as string) === 'selected' || (app.status as string) === 'rejected') 
      ? app.status as AppStatus 
      : 'applied' as AppStatus,
    opportunity: DEMO_OPPORTUNITIES.find((o) => o.id === app.opportunityId),
  }));

  const filtered = filter === 'all' ? applications : applications.filter((a) => a.status === filter);

  const counts: Record<string, number> = {
    applied: 0, under_review: 0, shortlisted: 0, interview: 0, selected: 0, rejected: 0
  };
  
  for (const app of applications) {
    counts[app.status] = (counts[app.status] || 0) + 1;
  }

  const formatStatus = (s: string) => s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="w-full relative pb-16">
      <div className="max-w-[1100px] mx-auto w-full flex flex-col gap-8 px-4 sm:px-6 py-6 md:py-8">
        
        {/* Header & Metrics */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex flex-col max-w-2xl">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Your Applications</h1>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Track your applications from submission to outcome.
            </p>
          </div>
          
          <div className="flex bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden shrink-0">
            {['applied', 'under_review', 'shortlisted', 'interview', 'selected'].map((stat, idx) => (
              <div key={stat} className={`px-4 py-3 flex flex-col justify-center ${idx !== 4 ? 'border-r border-slate-100' : ''}`}>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{formatStatus(stat)}</span>
                <span className="text-xl font-black text-slate-900">{counts[stat]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Horizontal Pipeline */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm overflow-x-auto">
          <div className="min-w-[700px] flex items-center justify-between relative">
            <div className="absolute left-6 right-6 top-4 h-0.5 bg-slate-100 z-0"></div>
            {PIPELINE.map((step, idx) => (
              <div key={step} className="flex flex-col items-center gap-3 relative z-10 w-32">
                <div className="w-8 h-8 rounded-full bg-slate-50 border-2 border-slate-200 flex items-center justify-center font-bold text-slate-400 text-xs">
                  {idx + 1}
                </div>
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider text-center">{formatStatus(step)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* List / Table section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            {['all', ...PIPELINE, 'rejected'].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s as AppStatus | 'all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
                  filter === s ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {s === 'all' ? `All (${applications.length})` : `${formatStatus(s)} (${counts[s]})`}
              </button>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            {filtered.length === 0 ? (
              <div className="p-12 text-center">
                <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 text-base">You haven't applied to any opportunities yet.</h3>
                {filter === 'all' && (
                  <Link href="/student/opportunities" className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors">
                    Find Opportunities <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Opportunity</th>
                      <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Organization</th>
                      <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Applied On</th>
                      <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current Status</th>
                      <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Next Step</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="text-sm font-bold text-slate-900">{app.title || app.opportunity?.title}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="text-sm text-slate-600">{app.company || app.opportunity?.company}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="text-sm text-slate-600">{formatDate(app.appliedAt)}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-block px-2.5 py-1 text-[10px] font-bold rounded border uppercase tracking-wider ${
                            app.status === 'selected' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            app.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                            app.status === 'interview' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            app.status === 'shortlisted' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            app.status === 'under_review' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            {formatStatus(app.status)}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <Link href={`/student/opportunities/${app.opportunityId}`} className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                            {app.status === 'interview' ? 'Interview Details →' : 'View Application →'}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
