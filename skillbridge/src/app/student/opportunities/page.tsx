'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Briefcase, MapPin, Clock, DollarSign, Search, Calendar, Building2, ChevronRight, Bookmark, BookmarkCheck, AlertCircle } from 'lucide-react';
import { DEMO_OPPORTUNITIES, DEMO_STUDENT_SKILLS, DEMO_APPLICATIONS } from '@/lib/demo-data';
import { calculateMatch } from '@/lib/ai/matching-engine';
import { SKILL_MAP } from '@/lib/skills-taxonomy';
import { formatCurrency, formatDate } from '@/lib/utils';
import { getStudentSkills, getSession } from '@/lib/user-session';
import { toast } from 'sonner';

const WORK_MODES = ['all', 'remote', 'hybrid', 'onsite'] as const;
const OPP_TYPES = ['all', 'internship', 'job', 'project', 'apprenticeship', 'learning'] as const;
const SORT_OPTIONS = ['best_match', 'latest', 'deadline'] as const;

function OpportunitiesContent() {
  const searchParams = useSearchParams();
  const isSavedView = searchParams.get('saved') === 'true';

  const [search, setSearch] = useState('');
  const [skills, setSkills] = useState<Record<string, number>>(DEMO_STUDENT_SKILLS);
  const [user, setUser] = useState(getSession());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(['opp-2'])); // Demo default saved

  useEffect(() => {
    setUser(getSession());
    const sync = () => setSkills(getStudentSkills());
    sync();
    window.addEventListener('sb_skills_updated', sync);
    return () => window.removeEventListener('sb_skills_updated', sync);
  }, []);

  const dynamicUserProfile = useMemo(() => ({
    skills: Object.entries(skills).map(([skillId, proficiency]) => ({ skillId, proficiency })),
    targetRoles: [user?.targetRole || 'Software Developer'],
    education: { degree: user?.degree || 'B.Tech', branch: user?.branch || 'Computer Science', graduationYear: user?.graduationYear || 2026 },
    projects: [
      { technologies: Object.keys(skills).slice(0, 4) },
      { technologies: Object.keys(skills).slice(2, 6) },
    ],
    cgpa: 8.4,
  }), [skills, user]);

  const [workMode, setWorkMode] = useState<typeof WORK_MODES[number]>('all');
  const [oppType, setOppType] = useState<typeof OPP_TYPES[number]>('all');
  const [sortBy, setSortBy] = useState<typeof SORT_OPTIONS[number]>('best_match');

  const oppsWithMatch = useMemo(() => {
    return DEMO_OPPORTUNITIES.map((opp) => ({
      ...opp,
      match: calculateMatch(dynamicUserProfile, opp),
    }));
  }, [dynamicUserProfile]);

  const filtered = useMemo(() => {
    let result = oppsWithMatch;

    if (isSavedView) {
      result = result.filter(o => savedIds.has(o.id));
    }

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
      if (oppType === 'learning') {
        result = result.filter((o) => o.type !== 'job' && o.type !== 'internship');
      } else {
        result = result.filter((o) => o.type === oppType);
      }
    }

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
    }

    return result;
  }, [oppsWithMatch, search, workMode, oppType, sortBy, isSavedView, savedIds]);

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast.success('Opportunity removed from saved list');
      } else {
        next.add(id);
        toast.success('Opportunity saved');
      }
      return next;
    });
  };

  const activeAppsCount = DEMO_APPLICATIONS.length;
  const avgMatch = oppsWithMatch.length > 0 ? Math.round(oppsWithMatch.reduce((acc, curr) => acc + curr.match.score, 0) / oppsWithMatch.length) : 0;
  
  const deadlinesSoonCount = Array.from(savedIds).filter(id => {
    const opp = DEMO_OPPORTUNITIES.find(o => o.id === id);
    if (!opp) return false;
    const daysUntil = (new Date(opp.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
    return daysUntil <= 14 && daysUntil >= 0;
  }).length;

  return (
    <div className="w-full relative">
      <div className="max-w-[1100px] mx-auto w-full flex flex-col gap-6 pb-16 px-4 sm:px-6 py-6 md:py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex flex-col max-w-2xl">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
              {isSavedView ? 'Saved Opportunities' : 'Opportunities'}
            </h1>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              {isSavedView 
                ? "Keep opportunities you're interested in and come back to them when you're ready to apply."
                : "Find internships, jobs, projects and learning opportunities that match your skills and career goal."}
            </p>
          </div>
          
          {/* Top Metrics Strip */}
          <div className="flex bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden shrink-0">
            {isSavedView ? (
              <>
                <div className="px-5 py-3 border-r border-slate-100 flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Saved</span>
                  <span className="text-xl font-black text-slate-900">{savedIds.size}</span>
                </div>
                <div className="px-5 py-3 flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Deadlines Soon</span>
                  <span className="text-xl font-black text-amber-600">{deadlinesSoonCount}</span>
                </div>
              </>
            ) : (
              <>
                <div className="px-5 py-3 border-r border-slate-100 flex flex-col justify-center hidden sm:flex">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Target Role</span>
                  <span className="text-sm font-bold text-slate-900">{user?.targetRole || 'Software Developer'}</span>
                </div>
                <div className="px-5 py-3 border-r border-slate-100 flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Profile Match</span>
                  <span className="text-xl font-black text-blue-600">{avgMatch}%</span>
                </div>
                <div className="px-5 py-3 border-r border-slate-100 flex flex-col justify-center hidden md:flex">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Recommended</span>
                  <span className="text-xl font-black text-emerald-600">{oppsWithMatch.filter(o => o.match.score >= 75).length}</span>
                </div>
                <div className="px-5 py-3 flex flex-col justify-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => window.location.href='/student/applications'}>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Applications</span>
                  <span className="text-xl font-black text-slate-900">{activeAppsCount}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col gap-6">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
            {isSavedView ? 'Your Saved List' : 'Recommended For You'}
          </h2>

          {/* Filters (Only in discovery view) */}
          {!isSavedView && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search opportunities..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Type</span>
                  <div className="flex flex-wrap gap-1">
                    {OPP_TYPES.map((t) => (
                      <button
                        key={t}
                        onClick={() => setOppType(t)}
                        className={`px-3 py-1 text-xs font-semibold rounded-md border transition-colors ${
                          oppType === t ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mode</span>
                  <div className="flex flex-wrap gap-1">
                    {WORK_MODES.map((m) => (
                      <button
                        key={m}
                        onClick={() => setWorkMode(m)}
                        className={`px-3 py-1 text-xs font-semibold rounded-md border transition-colors ${
                          workMode === m ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {m === 'all' ? 'All' : m.charAt(0).toUpperCase() + m.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 ml-auto">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sort</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof SORT_OPTIONS[number])}
                    className="text-xs font-semibold border border-slate-200 bg-white rounded-md px-3 py-1 h-7 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
                  >
                    <option value="best_match">Best Match</option>
                    <option value="deadline">Deadline</option>
                    <option value="latest">Latest</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* List View */}
          <div className="flex flex-col gap-3">
            {filtered.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
                <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 text-base">
                  {isSavedView ? 'No saved opportunities yet' : 'No matching opportunities'}
                </h3>
                <p className="text-sm text-slate-500 mt-1 mb-4">
                  {isSavedView 
                    ? "Save opportunities you're interested in and they'll appear here."
                    : "Try adjusting your filters or search keywords."}
                </p>
                {isSavedView && (
                  <Link href="/student/opportunities" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors">
                    Explore Opportunities <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            ) : (
              filtered.map((opp) => {
                const matchScore = opp.match.score;
                const matchLabel = matchScore >= 90 ? 'Excellent match' : matchScore >= 75 ? 'Strong match' : 'Good match';
                const matchColor = matchScore >= 90 ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : matchScore >= 75 ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-amber-700 bg-amber-50 border-amber-200';
                const isSaved = savedIds.has(opp.id);
                
                const daysUntilDeadline = (new Date(opp.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24);
                const showDeadlineWarning = isSavedView && daysUntilDeadline <= 7 && daysUntilDeadline >= 0;

                return (
                  <Link
                    key={opp.id}
                    href={`/student/opportunities/${opp.id}`}
                    className="group flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 shadow-sm transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
                        <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">{opp.title}</h3>
                        <span className="hidden sm:block w-1 h-1 bg-slate-300 rounded-full"></span>
                        <div className="text-sm font-semibold text-slate-600 flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-slate-400" />
                          {opp.company}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 mb-3">
                        <span className="font-semibold uppercase tracking-wider text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          {opp.type.replace('_', ' ')}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" /> {opp.location} · {opp.workMode}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {opp.duration}
                        </span>
                        {showDeadlineWarning ? (
                          <span className="flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                            <AlertCircle className="w-3.5 h-3.5" /> Deadline in {Math.ceil(daysUntilDeadline)} days
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> Due {formatDate(opp.deadline)}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1.5 items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Skills:</span>
                        {opp.requiredSkills.slice(0, 4).map((rs) => (
                          <span key={rs.skillId} className="text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                            {SKILL_MAP[rs.skillId]?.name ?? rs.skillId}
                          </span>
                        ))}
                        {opp.requiredSkills.length > 4 && (
                          <span className="text-[11px] font-semibold text-slate-500 px-1">+{opp.requiredSkills.length - 4}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 md:w-48 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                      <div className="text-left md:text-right">
                        <div className={`inline-block px-2.5 py-1 text-xs font-bold rounded-md border mb-1 ${matchColor}`}>
                          {matchScore}% {matchLabel}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium">
                          {opp.match.matchedSkills.length} of {opp.requiredSkills.length} required skills match
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => toggleSave(opp.id, e)}
                          className={`p-2 rounded-lg border transition-colors ${
                            isSaved 
                              ? 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100' 
                              : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                          }`}
                          title={isSaved ? "Remove from saved" : "Save opportunity"}
                        >
                          {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        </button>
                        <div className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg group-hover:bg-blue-600 transition-colors">
                          View
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OpportunitiesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500 font-medium">Loading opportunities...</div>}>
      <OpportunitiesContent />
    </Suspense>
  );
}
