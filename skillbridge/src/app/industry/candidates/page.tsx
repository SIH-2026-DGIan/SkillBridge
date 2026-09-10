'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, ArrowRight, Zap, Briefcase, Plus, Loader2 } from 'lucide-react';
import { fetchMyOpportunities } from '@/backend/services/opportunities.service';

type Opportunity = {
  id: string;
  title: string;
  type: string;
  status: 'active' | 'closed' | 'draft';
  location: string;
  work_mode: string;
  deadline?: string;
  created_at?: string;
};

export default function CandidatesHubPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applicationCounts, setApplicationCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [opps, appsRes] = await Promise.allSettled([
          fetchMyOpportunities(),
          fetch('/api/applications').then((r) => (r.ok ? r.json() : [])),
        ]);

        const loadedOpps = opps.status === 'fulfilled' && opps.value ? opps.value : [];
        setOpportunities(loadedOpps);

        if (appsRes.status === 'fulfilled' && Array.isArray(appsRes.value)) {
          const counts: Record<string, number> = {};
          for (const app of appsRes.value) {
            const oppId = app.opportunity_id || app.opportunityId;
            if (oppId) {
              counts[oppId] = (counts[oppId] || 0) + 1;
            }
          }
          setApplicationCounts(counts);
        }
      } catch (err) {
        console.error('Failed to load candidate opportunities:', err);
        setOpportunities([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Candidate Pipeline</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Select an opportunity to view applicants and AI-ranked talent
          </p>
        </div>
        <Link
          href="/industry/opportunities/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all w-fit"
        >
          <Plus className="w-4 h-4" /> Post New Opportunity
        </Link>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-600">Loading candidate pipelines...</p>
        </div>
      ) : opportunities.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <Briefcase className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900">No Opportunities Created Yet</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
            You have not posted any active opportunities yet. Once you publish an internship or job posting, candidates who apply will be automatically ranked by skill compatibility.
          </p>
          <div className="mt-6">
            <Link
              href="/industry/opportunities/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" /> Create Your First Opportunity
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {opportunities.map((opp) => {
            const candidateCount = applicationCounts[opp.id] || 0;
            return (
              <Link
                key={opp.id}
                href={`/industry/opportunities/${opp.id}/candidates`}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-sm hover:border-blue-300 transition-all block group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-bold text-slate-900 text-sm truncate">{opp.title}</h2>
                      <p className="text-xs text-slate-500 truncate">
                        {opp.work_mode ? `${opp.work_mode} · ` : ''}{opp.location || 'Remote'}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 ${
                    opp.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {opp.status}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    {candidateCount > 0 ? `${candidateCount} Evaluated Candidate${candidateCount > 1 ? 's' : ''}` : '0 Applicants'}
                  </span>
                  <span className="font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                    View Pipeline <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
