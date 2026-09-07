'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Briefcase, MapPin, Clock, DollarSign, Filter, Search, Zap, Calendar, Sparkles, Building2, ChevronRight, Award } from 'lucide-react';
import { DEMO_OPPORTUNITIES, DEMO_STUDENT_SKILLS } from '@/lib/demo-data';
import { calculateMatch } from '@/lib/ai/matching-engine';
import { SKILL_MAP } from '@/lib/skills-taxonomy';
import { scoreBgColor, formatCurrency, formatDate } from '@/lib/utils';
import { getStudentSkills, getStudentResume } from '@/lib/user-session';

const WORK_MODES = ['all', 'remote', 'hybrid', 'onsite'] as const;
const OPP_TYPES = ['all', 'internship', 'job', 'live_project'] as const;
const SORT_OPTIONS = ['best_match', 'latest', 'deadline', 'stipend'] as const;

type WorkMode = typeof WORK_MODES[number];
type OppType = typeof OPP_TYPES[number];
type SortOption = typeof SORT_OPTIONS[number];

function MatchBadge({ score }: { score: number }) {
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-black shadow-sm ${scoreBgColor(score)}`}>
      <Zap className="w-3.5 h-3.5" />
      {score}% AI Match
    </div>
  );
}

export default function OpportunitiesPage() {
  const [search, setSearch] = useState('');
  const [skills, setSkills] = useState<Record<string, number>>(DEMO_STUDENT_SKILLS);

  useEffect(() => {
    const sync = () => setSkills(getStudentSkills());
    sync();
    window.addEventListener('sb_skills_updated', sync);
    window.addEventListener('sb_resume_updated', sync);
    return () => {
      window.removeEventListener('sb_skills_updated', sync);
      window.removeEventListener('sb_resume_updated', sync);
    };
  }, []);

  const dynamicUserProfile = useMemo(() => ({
    skills: Object.entries(skills).map(([skillId, proficiency]) => ({ skillId, proficiency })),
    targetRoles: ['Machine Learning Engineer', 'Full Stack Engineer', 'Data Analyst'],
    education: { degree: 'B.Tech', branch: 'Computer Science', graduationYear: 2026 },
    projects: [
      { technologies: Object.keys(skills).slice(0, 4) },
      { technologies: Object.keys(skills).slice(2, 6) },
    ],
    cgpa: 8.4,
  }), [skills]);
  const [workMode, setWorkMode] = useState<WorkMode>('all');
  const [oppType, setOppType] = useState<OppType>('all');
  const [sortBy, setSortBy] = useState<SortOption>('best_match');

  // Calculate matches for all opportunities
  const oppsWithMatch = useMemo(() => {
    return DEMO_OPPORTUNITIES.map((opp) => ({
      ...opp,
      match: calculateMatch(dynamicUserProfile, opp),
    }));
  }, [dynamicUserProfile]);

  // Apply filters
  const filtered = useMemo(() => {
    let result = oppsWithMatch;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.company.toLowerCase().includes(q) ||
          o.location.toLowerCase().includes(q)
      );
    }

    if (workMode !== 'all') {
      result = result.filter((o) => o.workMode === workMode);
    }

    if (oppType !== 'all') {
      result = result.filter((o) => o.type === oppType);
    }

    // Sort
    switch (sortBy) {
      case 'best_match':
        result = [...result].sort((a, b) => b.match.score - a.match.score);
        break;
      case 'latest':
        result = [...result].sort((a, b) => a.id.localeCompare(b.id) * -1);
        break;
      case 'deadline':
        result = [...result].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
        break;
      case 'stipend':
        result = [...result].sort((a, b) => b.stipend - a.stipend);
        break;
    }

    return result;
  }, [oppsWithMatch, search, workMode, oppType, sortBy]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-amber-300 text-xs font-black mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" /> 4-Factor Deterministic Match
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">AI-Ranked Opportunities</h1>
          <p className="text-indigo-200 text-sm mt-1 max-w-xl font-medium">
            Explore verified internships, jobs, and live industry capstones matching your skill vector.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card rounded-3xl p-5 border border-white shadow-md space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by role title, company name, or tech stack..."
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex p-1 bg-slate-100 rounded-2xl gap-1">
              {OPP_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setOppType(t)}
                  className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all ${
                    oppType === t
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t === 'all' ? 'All Types' : t === 'live_project' ? 'Live Project' : t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex p-1 bg-slate-100 rounded-2xl gap-1">
              {WORK_MODES.map((m) => (
                <button
                  key={m}
                  onClick={() => setWorkMode(m)}
                  className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all ${
                    workMode === m
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {m === 'all' ? 'All Modes' : m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-xs font-extrabold border border-slate-200 bg-white rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            >
              <option value="best_match">⚡ Best AI Match</option>
              <option value="stipend">💰 Highest Stipend</option>
              <option value="deadline">⏳ Closest Deadline</option>
              <option value="latest">🆕 Latest Added</option>
            </select>
          </div>
        </div>
      </div>

      {/* Opportunity Cards List */}
      {filtered.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-white">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-extrabold text-slate-800 text-base">No matching opportunities</h3>
          <p className="text-xs text-slate-500 mt-1">Try clearing your filters or search keywords</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((opp) => (
            <Link
              key={opp.id}
              href={`/student/opportunities/${opp.id}`}
              className="block glass-card rounded-3xl p-6 border border-slate-200/80 hover:border-indigo-300 card-hover-playful transition-all"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-md flex-shrink-0">
                    {opp.company.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h2 className="font-extrabold text-slate-900 text-base">{opp.title}</h2>
                      <span className="badge-pill badge-pill-purple uppercase">{opp.type.replace('_', ' ')}</span>
                    </div>

                    <div className="text-xs font-bold text-slate-600 mb-2.5 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                      {opp.company}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-3">
                      <span className="flex items-center gap-1 font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" /> {opp.location} ({opp.workMode})
                      </span>
                      <span className="flex items-center gap-1 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {opp.duration}
                      </span>
                      {opp.stipend > 0 && (
                        <span className="flex items-center gap-1 font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {formatCurrency(opp.stipend)} / mo
                        </span>
                      )}
                      <span className="flex items-center gap-1 font-semibold text-slate-400">
                        <Calendar className="w-3.5 h-3.5" /> Due {formatDate(opp.deadline)}
                      </span>
                    </div>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {opp.requiredSkills.slice(0, 5).map((rs) => (
                        <span
                          key={rs.skillId}
                          className="text-[11px] px-2.5 py-0.5 bg-indigo-50/70 text-indigo-700 font-extrabold rounded-lg border border-indigo-100"
                        >
                          #{SKILL_MAP[rs.skillId]?.name ?? rs.skillId}
                        </span>
                      ))}
                      {opp.requiredSkills.length > 5 && (
                        <span className="text-[11px] px-2.5 py-0.5 bg-slate-100 text-slate-500 font-bold rounded-lg">
                          +{opp.requiredSkills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0 self-end sm:self-center">
                  <MatchBadge score={opp.match.score} />
                  <span className="text-xs font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                    Inspect Match Breakdown <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
