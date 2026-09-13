'use client';

import { useState, useMemo, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Briefcase, MapPin, Clock, Search, Calendar, Building2, ChevronRight, Bookmark, BookmarkCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { calculateMatch, UserProfile, OpportunityProfile } from '@/lib/ai/matching-engine';
import { SKILL_MAP } from '@/lib/skills-taxonomy';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';

const WORK_MODES = ['all', 'remote', 'hybrid', 'onsite'] as const;
const OPP_TYPES = ['all', 'internship', 'job', 'project', 'apprenticeship', 'learning'] as const;
const SORT_OPTIONS = ['best_match', 'latest', 'deadline'] as const;

interface NormalizedOpp {
  id: string;
  title: string;
  company: string;
  type: string;
  workMode: string;
  location: string;
  duration: string;
  deadline: string;
  requiredSkills: { skillId: string; requiredLevel: number }[];
  match: {
    score: number;
    matchedSkills: string[];
    missingSkills: string[];
    eligibility: { isEligible: boolean; status: string; criteria: any[] };
  };
}

function OpportunitiesContent() {
  const searchParams = useSearchParams();
  const isSavedView = searchParams.get('saved') === 'true';

  const [search, setSearch] = useState('');
  const [workMode, setWorkMode] = useState<typeof WORK_MODES[number]>('all');
  const [oppType, setOppType] = useState<typeof OPP_TYPES[number]>('all');
  const [sortBy, setSortBy] = useState<typeof SORT_OPTIONS[number]>('best_match');

  const [rawOpportunities, setRawOpportunities] = useState<any[]>([]);
  const [activeAppsCount, setActiveAppsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    skills: [],
    targetRoles: ['Software Developer'],
    education: { degree: 'B.Tech', branch: 'Computer Science', graduationYear: 2026 },
    projects: [],
    cgpa: 8.0,
  });

  // Saved opportunity IDs tracked in localStorage
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sb_saved_opportunities');
      if (stored) {
        setSavedIds(new Set(JSON.parse(stored)));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveIdsToStorage = (newSet: Set<string>) => {
    setSavedIds(newSet);
    try {
      localStorage.setItem('sb_saved_opportunities', JSON.stringify(Array.from(newSet)));
    } catch {
      // ignore
    }
  };

  // Fetch student profile & active applications
  useEffect(() => {
    async function loadUserData() {
      try {
        const [profileRes, appsRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/applications'),
        ]);

        if (profileRes.ok) {
          const pJson = await profileRes.json();
          const p = pJson.data || pJson;
          if (p) {
            const rawSkills = p.skills || p.user_skills || [];
            const formattedSkills = Array.isArray(rawSkills)
              ? rawSkills.map((s: any) =>
                  typeof s === 'string'
                    ? { skillId: s, proficiency: 3 }
                    : { skillId: s.skillId || s.skill_id, proficiency: s.proficiency || 3 }
                )
              : Object.entries(rawSkills).map(([skillId, proficiency]) => ({
                  skillId,
                  proficiency: Number(proficiency) || 3,
                }));

            setUserProfile({
              skills: formattedSkills,
              targetRoles: Array.isArray(p.target_roles)
                ? p.target_roles
                : p.target_role
                ? [p.target_role]
                : ['Software Developer'],
              education: {
                degree: p.degree || 'B.Tech',
                branch: p.branch || 'Computer Science',
                graduationYear: Number(p.graduation_year) || 2026,
              },
              projects: Array.isArray(p.projects) ? p.projects : [],
              cgpa: Number(p.cgpa) || 8.0,
            });
          }
        }

        if (appsRes.ok) {
          const aJson = await appsRes.json();
          const appsList = aJson.data || aJson;
          if (Array.isArray(appsList)) {
            setActiveAppsCount(appsList.length);
          }
        }
      } catch (err) {
        console.warn('Unable to fetch live student profile/applications:', err);
      }
    }

    loadUserData();
  }, []);

  // Fetch opportunities from API
  const fetchOpportunities = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (workMode !== 'all') params.append('work_mode', workMode);
      if (oppType !== 'all') params.append('type', oppType);

      const res = await fetch(`/api/opportunities?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        const list = json.data || json || [];
        setRawOpportunities(Array.isArray(list) ? list : []);
      } else {
        setRawOpportunities([]);
      }
    } catch (err) {
      console.error('Error fetching opportunities:', err);
      setRawOpportunities([]);
    } finally {
      setLoading(false);
    }
  }, [search, workMode, oppType]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  // Compute matches and apply sorting / saved filter
  const oppsWithMatch: NormalizedOpp[] = useMemo(() => {
    return rawOpportunities.map((opp) => {
      const reqSkills: { skillId: string; requiredLevel: number }[] = Array.isArray(opp.opportunity_skills)
        ? opp.opportunity_skills.map((s: any) => ({
            skillId: s.skill_id || s.skillId,
            requiredLevel: s.required_level || s.requiredLevel || 3,
          }))
        : Array.isArray(opp.required_skills)
        ? opp.required_skills.map((s: string) => ({ skillId: s, requiredLevel: 3 }))
        : [];

      const oppProfile: OpportunityProfile = {
        id: opp.id,
        title: opp.title,
        company: opp.company || 'SkillBridge Partner',
        type: (opp.type === 'job' || opp.type === 'internship' ? opp.type : 'live_project'),
        requiredSkills: reqSkills,
      };

      const match = calculateMatch(userProfile, oppProfile);

      return {
        id: opp.id,
        title: opp.title,
        company: opp.company || 'SkillBridge Partner',
        type: opp.type || 'job',
        workMode: opp.work_mode || opp.workMode || 'remote',
        location: opp.location || 'Remote',
        duration: opp.duration || 'Flexible',
        deadline: opp.deadline || new Date(Date.now() + 14 * 86400000).toISOString(),
        requiredSkills: reqSkills,
        match: {
          score: match.score,
          matchedSkills: match.matchedSkills,
          missingSkills: match.missingSkills,
          eligibility: match.eligibility,
        },
      };
    });
  }, [rawOpportunities, userProfile]);

  const filtered = useMemo(() => {
    let result = oppsWithMatch;

    if (isSavedView) {
      result = result.filter((o) => savedIds.has(o.id));
    }

    switch (sortBy) {
      case 'best_match':
        result = [...result].sort((a, b) => b.match.score - a.match.score);
        break;
      case 'latest':
        result = [...result].sort((a, b) => String(b.id).localeCompare(String(a.id)));
        break;
      case 'deadline':
        result = [...result].sort(
          (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        );
        break;
    }

    return result;
  }, [oppsWithMatch, isSavedView, savedIds, sortBy]);

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = new Set(savedIds);
    if (next.has(id)) {
      next.delete(id);
      saveIdsToStorage(next);
      toast.success('Opportunity removed from saved list');
    } else {
      next.add(id);
      saveIdsToStorage(next);
      toast.success('Opportunity saved');
    }
  };

  const avgMatch =
    oppsWithMatch.length > 0
      ? Math.round(
          oppsWithMatch.reduce((acc, curr) => acc + curr.match.score, 0) / oppsWithMatch.length
        )
      : 0;

  const deadlinesSoonCount = Array.from(savedIds).filter((id) => {
    const opp = oppsWithMatch.find((o) => o.id === id);
    if (!opp) return false;
    const daysUntil = (new Date(opp.deadline).getTime() - Date.now()) / (1000 * 3600 * 24);
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
                : 'Find internships, jobs, projects and learning opportunities that match your skills and career goal.'}
            </p>
          </div>

          {/* Top Metrics Strip */}
          <div className="flex bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden shrink-0">
            {isSavedView ? (
              <>
                <div className="px-5 py-3 border-r border-slate-100 flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Saved
                  </span>
                  <span className="text-xl font-black text-slate-900">{savedIds.size}</span>
                </div>
                <div className="px-5 py-3 flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Deadlines Soon
                  </span>
                  <span className="text-xl font-black text-amber-600">{deadlinesSoonCount}</span>
                </div>
              </>
            ) : (
              <>
                <div className="px-5 py-3 border-r border-slate-100 flex flex-col justify-center hidden sm:flex">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Target Role
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {userProfile.targetRoles[0] || 'Software Developer'}
                  </span>
                </div>
                <div className="px-5 py-3 border-r border-slate-100 flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Profile Match
                  </span>
                  <span className="text-xl font-black text-blue-600">{avgMatch}%</span>
                </div>
                <div className="px-5 py-3 border-r border-slate-100 flex flex-col justify-center hidden md:flex">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Recommended
                  </span>
                  <span className="text-xl font-black text-emerald-600">
                    {oppsWithMatch.filter((o) => o.match.score >= 75).length}
                  </span>
                </div>
                <div
                  className="px-5 py-3 flex flex-col justify-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => (window.location.href = '/student/applications')}
                >
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Applications
                  </span>
                  <span className="text-xl font-black text-slate-900">{activeAppsCount}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              {isSavedView ? 'Your Saved List' : 'Recommended For You'}
            </h2>
            <button
              onClick={fetchOpportunities}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-medium transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>

          {/* Filters (Only in discovery view) */}
          {!isSavedView && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search opportunities by title, company, or skills..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Type
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {OPP_TYPES.map((t) => (
                      <button
                        key={t}
                        onClick={() => setOppType(t)}
                        className={`px-3 py-1 text-xs font-semibold rounded-md border transition-colors ${
                          oppType === t
                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Mode
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {WORK_MODES.map((m) => (
                      <button
                        key={m}
                        onClick={() => setWorkMode(m)}
                        className={`px-3 py-1 text-xs font-semibold rounded-md border transition-colors ${
                          workMode === m
                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {m === 'all' ? 'All' : m.charAt(0).toUpperCase() + m.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 ml-auto">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Sort
                  </span>
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
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm animate-pulse flex flex-col md:flex-row justify-between gap-4"
                  >
                    <div className="space-y-3 flex-1">
                      <div className="h-5 bg-slate-200 rounded w-1/3"></div>
                      <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                      <div className="flex gap-2">
                        <div className="h-4 bg-slate-100 rounded w-16"></div>
                        <div className="h-4 bg-slate-100 rounded w-24"></div>
                      </div>
                    </div>
                    <div className="h-10 bg-slate-100 rounded w-28 shrink-0"></div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
                <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 text-base">
                  {isSavedView ? 'No saved opportunities yet' : 'No matching opportunities found'}
                </h3>
                <p className="text-sm text-slate-500 mt-1 mb-4">
                  {isSavedView
                    ? "Save opportunities you're interested in and they'll appear here."
                    : 'Check back soon for new postings or adjust your search filters.'}
                </p>
                {isSavedView && (
                  <Link
                    href="/student/opportunities"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors"
                  >
                    Explore Opportunities <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            ) : (
              filtered.map((opp) => {
                const matchScore = opp.match.score;
                const matchLabel =
                  matchScore >= 90
                    ? 'Excellent match'
                    : matchScore >= 75
                    ? 'Strong match'
                    : 'Good match';
                const matchColor =
                  matchScore >= 90
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    : matchScore >= 75
                    ? 'text-blue-700 bg-blue-50 border-blue-200'
                    : 'text-amber-700 bg-amber-50 border-amber-200';
                const isSaved = savedIds.has(opp.id);

                const daysUntilDeadline =
                  (new Date(opp.deadline).getTime() - Date.now()) / (1000 * 3600 * 24);
                const showDeadlineWarning =
                  isSavedView && daysUntilDeadline <= 7 && daysUntilDeadline >= 0;

                return (
                  <Link
                    key={opp.id}
                    href={`/student/opportunities/${opp.id}`}
                    className="group flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 shadow-sm transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
                        <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {opp.title}
                        </h3>
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
                            <AlertCircle className="w-3.5 h-3.5" /> Deadline in{' '}
                            {Math.ceil(daysUntilDeadline)} days
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> Due {formatDate(opp.deadline)}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1.5 items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                          Skills:
                        </span>
                        {opp.requiredSkills.slice(0, 4).map((rs) => (
                          <span
                            key={rs.skillId}
                            className="text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md"
                          >
                            {SKILL_MAP[rs.skillId]?.name ?? rs.skillId}
                          </span>
                        ))}
                        {opp.requiredSkills.length > 4 && (
                          <span className="text-[11px] font-semibold text-slate-500 px-1">
                            +{opp.requiredSkills.length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 md:w-48 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                      <div className="text-left md:text-right">
                        <div
                          className={`inline-block px-2.5 py-1 text-xs font-bold rounded-md border mb-1 ${matchColor}`}
                        >
                          {matchScore}% {matchLabel}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium">
                          {opp.match.matchedSkills.length} of {opp.requiredSkills.length} required
                          skills match
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
                          title={isSaved ? 'Remove from saved' : 'Save opportunity'}
                        >
                          {isSaved ? (
                            <BookmarkCheck className="w-4 h-4" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
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
    <Suspense
      fallback={
        <div className="p-8 text-center text-sm text-slate-500 font-medium">
          Loading opportunities...
        </div>
      }
    >
      <OpportunitiesContent />
    </Suspense>
  );
}
