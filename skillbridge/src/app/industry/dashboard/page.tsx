'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Briefcase,
  Users,
  CheckCircle2,
  TrendingUp,
  Award,
  ArrowRight,
  Plus,
  Zap,
  Search,
  Filter,
  Eye,
  Sparkles,
} from 'lucide-react';
import { DEMO_OPPORTUNITIES, DEMO_OTHER_STUDENTS } from '@/lib/demo-data';
import { getSession } from '@/lib/user-session';
import { toast } from 'sonner';

const INDUSTRY_JOURNEY = [
  { step: '1. Post Job', active: false, done: true },
  { step: '2. AI Match', active: false, done: true },
  { step: '3. Shortlist', active: true, done: false },
  { step: '4. Interview', active: false, done: false },
  { step: '5. Hire', active: false, done: false },
];

const SKILL_DEMANDS = [
  { skill: 'Python', percentage: 92 },
  { skill: 'React / Next.js', percentage: 84 },
  { skill: 'SQL / Databases', percentage: 78 },
  { skill: 'Docker / Cloud', percentage: 65 },
  { skill: 'FastAPI / Node.js', percentage: 60 },
];

interface RankedCandidate {
  id: string;
  name: string;
  college: string;
  branch: string;
  graduationYear: number;
  cgpa: number;
  score: number;
}

export default function IndustryDashboard() {
  const [candidates, setCandidates] = useState<RankedCandidate[]>(
    DEMO_OTHER_STUDENTS.map((s, idx: number) => ({
      ...s,
      score: [92, 87, 84, 81][idx] ?? 78,
    }))
  );
  const user = getSession();

  const handleShortlist = (id: string, name: string) => {
    toast.success(`🎉 ${name} moved to Interview Pipeline!`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Industry Workflow Bar */}
      <div className="glass-card rounded-3xl p-5 border border-white shadow-lg bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#4F46E5]" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Employer Hiring Journey
            </h2>
          </div>
          <span className="text-xs font-extrabold text-[#4F46E5] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Active: Candidate Shortlisting &amp; Technical Interviews
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {INDUSTRY_JOURNEY.map((j, idx) => (
            <div
              key={j.step}
              className={`p-2.5 rounded-2xl text-center text-xs font-extrabold transition-all ${
                j.active
                  ? 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-500/20'
                  : j.done
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-slate-50 text-slate-400 border border-slate-200/80'
              }`}
            >
              <div className="text-[10px] opacity-75">{j.done ? '✓' : idx + 1}</div>
              <div className="truncate">{j.step}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Top Header with Actions */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white shadow-xl bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#0F172A] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-black tracking-wider text-cyan-300 uppercase">
            🏢 Employer Command Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-0.5">
            {user.company || 'TechNova Solutions'} Talent Hub
          </h1>
          <div className="flex flex-wrap gap-2 mt-3">
  {user.industryType && (
    <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-cyan-200">
      {user.industryType}
    </span>
  )}

  {user.location && (
    <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-indigo-200">
      📍 {user.location}
    </span>
  )}

  {user.companySize && (
    <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-indigo-200">
      {user.companySize}
    </span>
  )}
</div>
          <p className="text-indigo-200 text-xs sm:text-sm font-medium mt-1">
            Recruiter: <strong>{user.name}</strong> · AI Candidate ranking by verified competence.
          </p>
        </div>

        <Link
          href="/industry/opportunities/new"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-indigo-500/30 bouncy-hover transition-all flex-shrink-0"
        >
          <Plus className="w-4 h-4" /> Post New Opportunity
        </Link>
      </div>

      {/* 3. Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Opportunities', value: '8', sub: 'Hiring Across 4 Roles', icon: Briefcase, color: 'from-indigo-600 to-violet-600' },
          { label: 'Total Applicants', value: '342', sub: 'From 24 Accredited Colleges', icon: Users, color: 'from-blue-600 to-indigo-600' },
          { label: 'AI Shortlisted', value: '47', sub: '≥ 85% Verified Fit', icon: Zap, color: 'from-violet-600 to-purple-600' },
          { label: 'Interviews Scheduled', value: '12', sub: 'Round 2 Technicals', icon: Award, color: 'from-emerald-500 to-teal-600' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-3xl p-5 border border-white shadow-md bg-white">
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${stat.color} flex items-center justify-center text-white font-black shadow-md mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</div>
            <div className="text-xs font-extrabold text-slate-700 mt-0.5">{stat.label}</div>
            <div className="text-[11px] font-semibold text-slate-400 mt-0.5">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* 4. AI Ranked Candidates & Industry Skill Demand */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Candidates Leaderboard (8 cols) */}
        <div className="lg:col-span-8 glass-card rounded-3xl p-6 border border-white shadow-lg bg-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-black text-slate-900 text-base">Top AI-Ranked Candidates</h3>
              <p className="text-xs text-slate-500 font-medium">Position: Machine Learning Engineer Intern</p>
            </div>
            <span className="badge-pill badge-pill-purple text-[11px]">
              <Sparkles className="w-3 h-3 text-[#4F46E5]" /> Deterministic Ranking
            </span>
          </div>

          <div className="space-y-3">
            {candidates.slice(0, 4).map((cand: RankedCandidate, idx: number) => (
              <div
                key={cand.id}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-xs ${
                    idx === 0 ? 'bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED]' : idx === 1 ? 'bg-slate-700' : 'bg-slate-500'
                  }`}>
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 text-sm">{cand.name}</div>
                    <div className="text-xs font-semibold text-slate-500">
                      {cand.college} · CGPA {cand.cgpa}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <span className="text-xs font-black text-[#4F46E5] bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                      {cand.score}% Fit
                    </span>
                  </div>
                  <button
                    onClick={() => handleShortlist(cand.id, cand.name)}
                    className="px-3.5 py-2 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white font-extrabold text-xs rounded-xl transition-all shadow-md shadow-indigo-500/20"
                  >
                    Shortlist →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Industry Skill Demand Heatmap (4 cols) */}
        <div className="lg:col-span-4 glass-card rounded-3xl p-6 border border-white shadow-lg bg-white space-y-4">
          <div>
            <h3 className="font-black text-slate-900 text-base">Hiring Skill Demand</h3>
            <p className="text-xs text-slate-500 font-medium">Most requested across active openings</p>
          </div>

          <div className="space-y-3 pt-2">
            {SKILL_DEMANDS.map((item) => (
              <div key={item.skill} className="space-y-1">
                <div className="flex justify-between text-xs font-extrabold">
                  <span className="text-slate-800">{item.skill}</span>
                  <span className="text-[#4F46E5] font-black">{item.percentage}%</span>
                </div>
                <div className="xp-bar-container">
                  <div className="h-full bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#06B6D4] rounded-full" style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
