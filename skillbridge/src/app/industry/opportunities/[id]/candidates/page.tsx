'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Zap,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Users,
  Loader2,
} from 'lucide-react';
import { fetchOpportunityById } from '@/backend/services/opportunities.service';
import { toast } from 'sonner';

interface OpportunityData {
  id: string;
  title: string;
  company: string;
  type: string;
  location: string;
  opportunity_skills?: Array<{
    skill_id: string;
    required_level: number;
    skills?: { id: string; name: string };
  }>;
}

interface ApplicationData {
  id: string;
  status: string;
  match_score?: number;
  matchScore?: number;
  created_at: string;
  student?: {
    id: string;
    full_name?: string;
    name?: string;
    college?: string;
    branch?: string;
    cgpa?: number;
    skills?: Array<{ name: string; level: number }>;
  };
}

export default function CandidatesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [opportunity, setOpportunity] = useState<OpportunityData | null>(null);
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [shortlisted, setShortlisted] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [oppData, appsRes] = await Promise.allSettled([
          fetchOpportunityById(id),
          fetch('/api/applications').then((r) => (r.ok ? r.json() : [])),
        ]);

        if (oppData.status === 'fulfilled' && oppData.value) {
          setOpportunity(oppData.value);
        }

        if (appsRes.status === 'fulfilled' && Array.isArray(appsRes.value)) {
          const relevant = appsRes.value.filter(
            (app: any) => (app.opportunity_id || app.opportunityId) === id
          );
          setApplications(relevant);
          
          const initialShortlisted = new Set<string>();
          relevant.forEach((app: any) => {
            if (app.status === 'shortlisted' || app.status === 'interview') {
              initialShortlisted.add(app.id);
            }
          });
          setShortlisted(initialShortlisted);
        }
      } catch (err) {
        console.error('Failed to load candidate evaluations:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const handleShortlistToggle = async (appId: string, candidateName: string) => {
    const isCurrentlyShortlisted = shortlisted.has(appId);
    const newStatus = isCurrentlyShortlisted ? 'applied' : 'shortlisted';

    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update candidate status');

      setShortlisted((prev) => {
        const next = new Set(prev);
        if (isCurrentlyShortlisted) {
          next.delete(appId);
          toast.info(`${candidateName} removed from shortlisted pool`);
        } else {
          next.add(appId);
          toast.success(`🎉 ${candidateName} shortlisted for Technical Interview!`);
        }
        return next;
      });
    } catch (e) {
      toast.error('Unable to update shortlist status');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-16 text-center max-w-4xl mx-auto my-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
        <p className="text-xs font-bold text-slate-600">Loading opportunity and applicants...</p>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 max-w-xl mx-auto my-12">
        <p className="text-sm font-bold text-slate-700">Opportunity not found</p>
        <p className="text-xs text-slate-400 mt-1">This opportunity may have been removed or is inaccessible.</p>
        <Link
          href="/industry/dashboard"
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
        >
          ← Back to Recruiter Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Link
        href="/industry/candidates"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 font-bold bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Candidate Pipeline
      </Link>

      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-blue-300 text-xs font-bold mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> AI Candidate Evaluation
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{opportunity.title}</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl font-medium">
            {opportunity.company || 'TechNova Solutions'} · {applications.length} candidate application{applications.length === 1 ? '' : 's'} received
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <span className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl">
            {shortlisted.size} Candidates Shortlisted
          </span>
        </div>
      </div>

      {/* Applicants List */}
      {applications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-xl mx-auto">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h2 className="text-sm font-bold text-slate-900">No Applications Received Yet</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
            There are no student applicants for this opportunity yet. Once students submit applications, their verified skill profiles and AI match scores will appear here.
          </p>
          <div className="mt-5">
            <Link
              href="/industry/opportunities"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
            >
              Manage Opportunities
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app, index) => {
            const studentName = app.student?.full_name || app.student?.name || `Candidate #${index + 1}`;
            const isCandidateShortlisted = shortlisted.has(app.id);
            const score = app.match_score || app.matchScore || 0;

            return (
              <div
                key={app.id}
                className={`bg-white rounded-2xl p-5 border transition-all ${
                  isCandidateShortlisted
                    ? 'border-emerald-300 ring-2 ring-emerald-500/10'
                    : 'border-slate-200/80 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                      {studentName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{studentName}</span>
                        {isCandidateShortlisted && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Shortlisted
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {app.student?.college ? `${app.student.college} · ` : ''}Applied {new Date(app.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    {score > 0 && (
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                        {score}% Fit
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleShortlistToggle(app.id, studentName)}
                      className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                        isCandidateShortlisted
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {isCandidateShortlisted ? '✓ Shortlisted' : 'Shortlist'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
