'use client';

import { useMemo, useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  MapPin, Clock, DollarSign, Calendar, CheckCircle, AlertTriangle, ArrowLeft, Building2, Send, ShieldCheck, Bookmark, BookmarkCheck, Briefcase, Loader2
} from 'lucide-react';
import { calculateMatch, UserProfile, OpportunityProfile } from '@/lib/ai/matching-engine';
import { SKILL_MAP } from '@/lib/skills-taxonomy';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

export default function OpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [opp, setOpp] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    skills: [],
    targetRoles: ['Software Developer'],
    education: { degree: 'B.Tech', branch: 'Computer Science', graduationYear: 2026 },
    projects: [],
    cgpa: 8.0,
  });

  // Load saved state from storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sb_saved_opportunities');
      if (stored) {
        const set: string[] = JSON.parse(stored);
        if (set.includes(id)) {
          setIsSaved(true);
        }
      }
    } catch {
      // ignore
    }
  }, [id]);

  // Fetch opportunity, profile & applications
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [oppRes, profileRes, appsRes] = await Promise.all([
          fetch(`/api/opportunities/${id}`),
          fetch('/api/profile'),
          fetch('/api/applications'),
        ]);

        if (oppRes.ok) {
          const oppJson = await oppRes.json();
          const raw = oppJson.data || oppJson;
          if (raw && (raw.id || raw.title)) {
            const reqSkills = Array.isArray(raw.opportunity_skills)
              ? raw.opportunity_skills.map((s: any) => ({
                  skillId: s.skill_id || s.skillId,
                  requiredLevel: s.required_level || s.requiredLevel || 3,
                }))
              : Array.isArray(raw.required_skills)
              ? raw.required_skills.map((s: string) => ({ skillId: s, requiredLevel: 3 }))
              : [];

            setOpp({
              id: raw.id,
              title: raw.title,
              company: raw.company || 'SkillBridge Partner',
              description: raw.description || '',
              type: raw.type || 'job',
              workMode: raw.work_mode || raw.workMode || 'remote',
              location: raw.location || 'Remote',
              duration: raw.duration || 'Flexible',
              deadline: raw.deadline || new Date(Date.now() + 14 * 86400000).toISOString(),
              stipend: raw.stipend || raw.stipend_min || 0,
              requiredSkills: reqSkills,
              eligibility: raw.eligibility || {},
            });
          }
        }

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
            const hasApplied = appsList.some(
              (a: any) => a.opportunity_id === id || a.opportunityId === id
            );
            if (hasApplied) {
              setApplied(true);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load opportunity detail:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const match = useMemo(() => {
    if (!opp) return null;
    const oppProfile: OpportunityProfile = {
      id: opp.id,
      title: opp.title,
      company: opp.company,
      type: opp.type === 'job' || opp.type === 'internship' ? opp.type : 'live_project',
      requiredSkills: opp.requiredSkills,
      eligibility: opp.eligibility,
    };
    return calculateMatch(userProfile, oppProfile);
  }, [opp, userProfile]);

  const handleApply = async () => {
    if (applied) return;
    setApplying(true);

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          opportunityId: id,
          matchScore: match?.score || 0,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error?.message || errJson.error || 'Failed to submit application');
      }

      toast.success('Application submitted successfully!');
      setApplied(true);
    } catch (error) {
      console.error('Error applying:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit application.');
    } finally {
      setApplying(false);
    }
  };

  const toggleSave = () => {
    try {
      const stored = localStorage.getItem('sb_saved_opportunities');
      const set = new Set<string>(stored ? JSON.parse(stored) : []);
      if (isSaved) {
        set.delete(id);
        setIsSaved(false);
        toast.success('Removed from saved opportunities');
      } else {
        set.add(id);
        setIsSaved(true);
        toast.success('Opportunity saved for later');
      }
      localStorage.setItem('sb_saved_opportunities', JSON.stringify(Array.from(set)));
    } catch {
      setIsSaved(!isSaved);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] max-w-4xl mx-auto py-16">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-600">Loading opportunity details...</p>
      </div>
    );
  }

  if (!opp || !match) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl border border-slate-200 mt-6 max-w-4xl mx-auto p-8 text-center shadow-sm">
        <Building2 className="w-12 h-12 text-slate-300 mb-4" />
        <h2 className="text-lg font-black text-slate-900 mb-1">Opportunity Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">
          This opportunity may have been removed, closed, or is no longer accepting applications.
        </p>
        <Link
          href="/student/opportunities"
          className="px-5 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          Browse Opportunities
        </Link>
      </div>
    );
  }

  const matchScore = match.score;
  const matchColor =
    matchScore >= 90
      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
      : matchScore >= 75
      ? 'text-blue-700 bg-blue-50 border-blue-200'
      : 'text-amber-700 bg-amber-50 border-amber-200';

  return (
    <div className="w-full relative pb-16">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
        <div className="max-w-[1100px] mx-auto w-full px-4 sm:px-6 py-4">
          <Link
            href="/student/opportunities"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Discover
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  {opp.title}
                </h1>
                <span
                  className={`hidden sm:inline-block px-2.5 py-1 text-xs font-bold rounded-md border ${matchColor}`}
                >
                  {matchScore}% Match
                </span>
              </div>
              <div className="text-base font-semibold text-slate-600 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400" /> {opp.company}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={toggleSave}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-lg border transition-colors ${
                  isSaved
                    ? 'bg-slate-100 border-slate-200 text-slate-900'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {isSaved ? (
                  <BookmarkCheck className="w-4 h-4 text-blue-600" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
                {isSaved ? 'Saved' : 'Save'}
              </button>
              <button
                onClick={handleApply}
                disabled={applying || applied}
                className={`flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold rounded-lg transition-colors min-w-[140px] ${
                  applied
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-60'
                }`}
              >
                {applying ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : applied ? (
                  <>
                    <CheckCircle className="w-4 h-4" /> Applied
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Apply Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto w-full px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          {/* LEFT COLUMN - CONTENT */}
          <div className="flex flex-col gap-8">
            {/* Overview Strip */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 py-4 border-y border-slate-200">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-400" />
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Type
                  </div>
                  <div className="text-sm font-bold text-slate-900 capitalize">
                    {opp.type.replace('_', ' ')}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Location
                  </div>
                  <div className="text-sm font-bold text-slate-900 capitalize">
                    {opp.location} · {opp.workMode}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Duration
                  </div>
                  <div className="text-sm font-bold text-slate-900">{opp.duration}</div>
                </div>
              </div>
              {opp.stipend > 0 && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Stipend
                    </div>
                    <div className="text-sm font-bold text-emerald-600">
                      {formatCurrency(opp.stipend)} / mo
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="prose prose-slate max-w-none">
              <h2 className="text-lg font-black text-slate-900 mb-3">Overview</h2>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {opp.description ||
                  'Join this opportunity to build real-world experience, expand your technical portfolio, and collaborate with industry mentors.'}
              </p>
            </div>

            {/* Required Skills */}
            <div>
              <h2 className="text-lg font-black text-slate-900 mb-4">Required Skills</h2>
              {opp.requiredSkills.length === 0 ? (
                <p className="text-sm text-slate-500">No specific prerequisite skills specified.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {opp.requiredSkills.map(({ skillId }: { skillId: string }) => (
                    <span
                      key={skillId}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                    >
                      {SKILL_MAP[skillId]?.name ?? skillId}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Eligibility */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-slate-700" />
                <h2 className="text-lg font-black text-slate-900">Eligibility Criteria</h2>
              </div>
              <ul className="space-y-3">
                {match.eligibility.criteria.length > 0 ? (
                  match.eligibility.criteria.map((c: any, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2"></div>
                      <div>
                        <span className="text-sm font-semibold text-slate-800 block">
                          {c.label}
                        </span>
                        {c.details && <span className="text-xs text-slate-500">{c.details}</span>}
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-slate-700">
                    Open to all registered SkillBridge students meeting base academic criteria.
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN - STICKY PANEL */}
          <div className="flex flex-col gap-5">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm sticky top-[104px] overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      matchScore >= 75
                        ? 'bg-emerald-500'
                        : matchScore >= 60
                        ? 'bg-blue-500'
                        : 'bg-amber-500'
                    }`}
                  ></div>
                  <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Match Analysis
                  </h2>
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-black text-slate-900 leading-none">
                    {matchScore}%
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-600">
                  {matchScore >= 75
                    ? 'Strong match'
                    : matchScore >= 60
                    ? 'Good match'
                    : 'Fair match'}{' '}
                  for your {userProfile.targetRoles[0]} profile.
                </p>
              </div>

              <div className="p-6">
                {match.matchedSkills.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                      Matching Skills
                    </h3>
                    <div className="flex flex-col gap-2">
                      {match.matchedSkills.map((skill) => (
                        <div key={skill} className="flex items-center gap-2 text-sm text-slate-700">
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="font-semibold">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {match.missingSkills.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                      Skills to Strengthen
                    </h3>
                    <div className="flex flex-col gap-2">
                      {match.missingSkills.map((skill) => (
                        <div key={skill} className="flex items-center gap-2 text-sm text-slate-700">
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                          <span className="font-semibold">{skill}</span>
                        </div>
                      ))}
                    </div>
                    <Link
                      href="/student/learning"
                      className="inline-block mt-3 text-xs font-bold text-blue-600 hover:underline"
                    >
                      Add to Learning Plan →
                    </Link>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Eligibility Status
                  </h3>
                  <div className="flex items-center gap-2 text-sm">
                    {match.eligibility.isEligible ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="font-semibold text-slate-900">Eligible</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                        <span className="font-semibold text-slate-900">Review Criteria</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleApply}
                    disabled={applying || applied}
                    className={`w-full py-3 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      applied
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm disabled:opacity-60'
                    }`}
                  >
                    {applying ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : applied ? (
                      <>
                        <CheckCircle className="w-4 h-4" /> Applied
                      </>
                    ) : (
                      'Apply Now'
                    )}
                  </button>
                  <button
                    onClick={toggleSave}
                    className={`w-full py-3 text-sm font-bold rounded-lg border transition-colors ${
                      isSaved
                        ? 'bg-slate-50 border-slate-300 text-slate-900'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {isSaved ? 'Saved to List' : 'Save Opportunity'}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex items-start gap-3">
              <Calendar className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-slate-900 mb-1">Application Deadline</h3>
                <p className="text-sm text-slate-600">{formatDate(opp.deadline)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
