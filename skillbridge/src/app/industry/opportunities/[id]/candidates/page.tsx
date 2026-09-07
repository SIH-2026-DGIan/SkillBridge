'use client';

import { useMemo, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Zap, CheckCircle2, AlertTriangle, GraduationCap, ShieldCheck, Sparkles, UserCheck, Star, Award } from 'lucide-react';
import { DEMO_OPPORTUNITIES, DEMO_OTHER_STUDENTS, DEMO_STUDENT_SKILLS } from '@/lib/demo-data';
import { rankCandidates, type UserProfile } from '@/lib/ai/matching-engine';
import { SKILL_MAP } from '@/lib/skills-taxonomy';
import { scoreBgColor } from '@/lib/utils';
import { toast } from 'sonner';

// Build profiles for demo candidates (Tanushri as #1 candidate)
const DEMO_CANDIDATES = [
  {
    id: 'demo-student-1',
    name: 'Tanushri Sharma',
    college: 'IIT Bombay',
    branch: 'Computer Science',
    graduationYear: 2026,
    cgpa: 8.4,
    profile: {
      skills: Object.entries(DEMO_STUDENT_SKILLS).map(([skillId, proficiency]) => ({ skillId, proficiency })),
      targetRoles: ['Machine Learning Engineer', 'Data Analyst'],
      education: { degree: 'B.Tech', branch: 'Computer Science', graduationYear: 2026 },
      projects: [
        { technologies: ['python', 'tensorflow', 'machine_learning', 'deep_learning'] },
        { technologies: ['python', 'machine_learning', 'sql', 'data_analysis'] },
      ],
      cgpa: 8.4,
    } as UserProfile,
  },
  ...DEMO_OTHER_STUDENTS.map((s) => ({
    id: s.id,
    name: s.name,
    college: s.college,
    branch: s.branch,
    graduationYear: s.graduationYear,
    cgpa: s.cgpa ?? 7.5,
    profile: {
      skills: Object.entries(s.skills).map(([skillId, proficiency]) => ({ skillId, proficiency })),
      targetRoles: s.targetRoles,
      education: { degree: 'B.Tech', branch: s.branch, graduationYear: s.graduationYear },
      projects: s.projects as { technologies: string[] }[],
      cgpa: s.cgpa,
    } as UserProfile,
  })),
];

export default function CandidatesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [shortlisted, setShortlisted] = useState<Set<string>>(new Set(['demo-student-1']));

  const opp = DEMO_OPPORTUNITIES.find((o) => o.id === id);

  const rankedCandidates = useMemo(() => {
    if (!opp) return [];
    return rankCandidates(
      {
        id: opp.id,
        title: opp.title,
        company: opp.company,
        type: opp.type,
        category: opp.category,
        requiredSkills: opp.requiredSkills,
        eligibility: opp.eligibility,
      },
      DEMO_CANDIDATES
    );
  }, [opp]);

  const handleShortlist = (candidateId: string, candidateName: string) => {
    setShortlisted((prev) => {
      const next = new Set(prev);
      if (next.has(candidateId)) {
        next.delete(candidateId);
        toast.info(`${candidateName} removed from shortlisted pool`);
      } else {
        next.add(candidateId);
        toast.success(`🎉 ${candidateName} shortlisted for Technical Interview!`);
      }
      return next;
    });
  };

  if (!opp) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500">Opportunity not found</p>
        <Link href="/industry/dashboard" className="mt-3 text-rose-600 font-bold text-xs">
          ← Back to Recruiter Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Link
        href="/industry/dashboard"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-600 font-bold bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Recruiter Command
      </Link>

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-rose-950 to-indigo-950 p-6 md:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-rose-300 text-xs font-black mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" /> AI Candidate Shortlist Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{opp.title}</h1>
          <p className="text-slate-300 text-sm mt-1 max-w-xl font-medium">
            {opp.company} · {rankedCandidates.length} evaluated applicants ranked by deterministic 4-factor formula.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <span className="px-4 py-2 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold rounded-2xl">
            {shortlisted.size} Candidates Shortlisted
          </span>
        </div>
      </div>

      {/* Legend Card */}
      <div className="glass-card rounded-2xl p-4 border border-rose-100 bg-rose-50/40 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-black text-rose-900">
          <Zap className="w-4 h-4 text-rose-600" /> Multi-Factor Calibration Formula:
        </div>
        <div className="flex flex-wrap gap-4 font-bold text-slate-700">
          <span>🎯 Skill Vector (60%)</span>
          <span>💡 Interest Match (20%)</span>
          <span>📁 Project Portfolio (20%)</span>
          <span>🛡️ Gated Eligibility (100%)</span>
        </div>
      </div>

      {/* Candidate Cards List */}
      <div className="space-y-4">
        {rankedCandidates.map(({ id: candId, name, match }, index) => {
          const candidate = DEMO_CANDIDATES.find((c) => c.id === candId);
          const isShortlisted = shortlisted.has(candId);
          const rank = index + 1;

          return (
            <div
              key={candId}
              className={`glass-card rounded-3xl p-6 border-2 transition-all ${
                isShortlisted
                  ? 'border-emerald-300 bg-emerald-50/30 ring-2 ring-emerald-400/10'
                  : 'border-slate-200/80 hover:border-rose-300 card-hover-playful'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  {/* Rank Badge */}
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shadow-sm ${
                        rank === 1
                          ? 'bg-amber-400 text-slate-900 ring-2 ring-amber-200'
                          : rank === 2
                          ? 'bg-slate-300 text-slate-900'
                          : rank === 3
                          ? 'bg-orange-300 text-slate-900'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-xs shadow-sm">
                      {name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h2 className="font-extrabold text-slate-900 text-base">{name}</h2>
                      {isShortlisted && (
                        <span className="badge-pill badge-pill-emerald text-[11px]">
                          ✓ Shortlisted for Interview
                        </span>
                      )}
                      {match.eligibility.isEligible ? (
                        <span className="badge-pill badge-pill-blue text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Fully Eligible (CGPA: {candidate?.cgpa})
                        </span>
                      ) : (
                        <span className="badge-pill badge-pill-amber text-[11px]">
                          ⚠ Verification Pending
                        </span>
                      )}
                    </div>

                    {candidate && (
                      <div className="text-xs font-semibold text-slate-500 mb-3 flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                        {candidate.college} · {candidate.branch} · Batch {candidate.graduationYear}
                      </div>
                    )}

                    {/* Breakdown bars */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3">
                      {[
                        { label: 'Skill Match (60%)', score: match.breakdown.skillCompatibility, color: 'bg-blue-500' },
                        { label: 'Role Alignment (20%)', score: match.breakdown.interestAlignment, color: 'bg-purple-500' },
                        { label: 'Project Depth (20%)', score: match.breakdown.projectRelevance, color: 'bg-teal-500' },
                      ].map((dim) => (
                        <div key={dim.label} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex justify-between text-[11px] font-bold mb-1">
                            <span className="text-slate-500">{dim.label}</span>
                            <span className="text-slate-900">{dim.score}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${dim.color}`} style={{ width: `${dim.score}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Skills Chips */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {match.matchedSkills.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded-lg border border-emerald-200"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {s}
                        </span>
                      ))}
                      {match.missingSkills.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 bg-amber-50 text-amber-800 font-bold rounded-lg border border-amber-200"
                        >
                          <AlertTriangle className="w-3 h-3 text-amber-600" /> Deficit: {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Score & Action */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 flex-shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl border-2 ${scoreBgColor(match.score)} shadow-sm`}>
                    <span className="text-2xl font-black">{match.score}%</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Fit</span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href="/portfolio/tanushri-sharma"
                      target="_blank"
                      className="px-3.5 py-2 text-xs font-extrabold border border-slate-200 bg-white rounded-xl hover:bg-slate-50 text-slate-700 transition-colors shadow-sm"
                    >
                      Portfolio ↗
                    </Link>
                    <button
                      onClick={() => handleShortlist(candId, name)}
                      className={`px-4 py-2 text-xs font-black rounded-xl transition-all shadow-md ${
                        isShortlisted
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-gradient-to-r from-rose-500 to-purple-600 text-white hover:shadow-rose-500/30'
                      }`}
                    >
                      {isShortlisted ? '✓ Shortlisted' : 'Shortlist'}
                    </button>
                  </div>
                </div>
              </div>

              {/* AI Explanation Reason */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2 text-xs">
                <span className="font-black text-rose-600">AI Assessment Note:</span>
                <p className="text-slate-600 font-medium leading-relaxed">{match.reason}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
