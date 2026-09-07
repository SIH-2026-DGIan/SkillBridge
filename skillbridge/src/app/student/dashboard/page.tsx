'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Briefcase,
  ClipboardCheck,
  BookOpen,
  Target,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Zap,
  ShieldCheck,
  FileText,
  Award,
} from 'lucide-react';
import { DEMO_OPPORTUNITIES, DEMO_APPLICATIONS } from '@/lib/demo-data';
import { calculateMatch } from '@/lib/ai/matching-engine';
import { ROLE_REQUIRED_SKILLS, SKILL_MAP } from '@/lib/skills-taxonomy';
import { getStudentSkills, getStudentResume, getSession, type UserSession, type ParsedResume } from '@/lib/user-session';
import { scoreBgColor, scoreColor } from '@/lib/utils';

const JOURNEY_STEPS = [
  { id: 'profile', label: 'Profile', href: '/onboarding/student' },
  { id: 'assess', label: 'Assessment', href: '/student/assessment' },
  { id: 'skills', label: 'Skill Profile', href: '/student/skills' },
  { id: 'gaps', label: 'Skill Gaps', href: '/student/skill-gaps' },
  { id: 'learn', label: 'Learning', href: '/student/learning' },
  { id: 'match', label: 'AI Match', href: '/student/opportunities' },
  { id: 'apply', label: 'Apply', href: '/student/opportunities' },
  { id: 'track', label: 'Track', href: '/student/applications' },
];

export default function StudentDashboard() {
  const [user, setUser] = useState<UserSession>(getSession());
  const [skills, setSkills] = useState<Record<string, number>>({});
  const [resume, setResume] = useState<ParsedResume | null>(null);

  useEffect(() => {
    const sync = () => {
      setUser(getSession());
      setSkills(getStudentSkills());
      setResume(getStudentResume());
    };
    sync();

    window.addEventListener('sb_session_updated', sync);
    window.addEventListener('sb_skills_updated', sync);
    window.addEventListener('sb_resume_updated', sync);

    return () => {
      window.removeEventListener('sb_session_updated', sync);
      window.removeEventListener('sb_skills_updated', sync);
      window.removeEventListener('sb_resume_updated', sync);
    };
  }, []);

  const targetRole = user.targetRole || 'Machine Learning Engineer';
  const requiredSkills = ROLE_REQUIRED_SKILLS[targetRole] ?? ROLE_REQUIRED_SKILLS['Machine Learning Engineer'] ?? [];

  const gapAnalysis = useMemo(() => {
    return requiredSkills.map(({ skillId, required }) => {
      const current = skills[skillId] ?? 0;
      const gap = Math.max(0, required - current);
      return { skillId, name: SKILL_MAP[skillId]?.name ?? skillId, current, required, gap, isGap: current < required };
    });
  }, [requiredSkills, skills]);

  const skillGaps = useMemo(() => gapAnalysis.filter((g) => g.isGap).sort((a, b) => b.gap - a.gap), [gapAnalysis]);

  const readinessScore = useMemo(() => {
    if (requiredSkills.length === 0) return 60;
    const totalCurrent = requiredSkills.reduce((sum, { skillId, required }) => {
      return sum + Math.min(100, ((skills[skillId] ?? 0) / required) * 100);
    }, 0);
    return Math.round(totalCurrent / requiredSkills.length);
  }, [requiredSkills, skills]);

  const roleFitScore = Math.min(96, Math.max(50, Math.round(readinessScore * 0.95 + (resume ? 10 : 0))));

  const dynamicUserProfile = useMemo(() => ({
    skills: Object.entries(skills).map(([skillId, proficiency]) => ({ skillId, proficiency })),
    targetRoles: [targetRole],
    education: { degree: user.degree || 'B.Tech', branch: user.branch || 'Computer Science', graduationYear: user.graduationYear || 2026 },
    projects: [
      { technologies: Object.keys(skills).slice(0, 4) },
      { technologies: Object.keys(skills).slice(2, 6) },
    ],
    cgpa: 8.4,
  }), [skills, targetRole, user]);

  const recommendedOpps = useMemo(() => {
    return DEMO_OPPORTUNITIES
      .map((opp) => ({
        opp,
        match: calculateMatch(dynamicUserProfile, {
          id: opp.id, title: opp.title, company: opp.company, type: opp.type,
          category: opp.category, requiredSkills: opp.requiredSkills, eligibility: opp.eligibility,
        }),
      }))
      .sort((a, b) => b.match.score - a.match.score);
  }, [dynamicUserProfile]);

  const topMatch = recommendedOpps[0];

  // Journey progress — first 4 steps are "done" in demo
  const completedSteps = 4;
  const currentStepLabel = JOURNEY_STEPS[completedSteps]?.label ?? 'Complete';

  return (
    <div className="page-content">

      {/* ── 1. Welcome Hero ── */}
      <div className="page-hero">
        {/* Decorative glow */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Top row: greeting + target role */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
            <div>
              <p className="text-indigo-300 text-sm font-medium mb-1">Welcome back</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {user.name} 👋
              </h2>
            </div>
            <div className="sm:text-right">
              <p className="text-indigo-400 text-xs font-medium mb-0.5">Target Role</p>
              <p className="text-white font-semibold text-sm">{targetRole}</p>
            </div>
          </div>

          {/* Readiness summary line */}
          <p className="text-indigo-200 text-sm leading-relaxed mb-5 max-w-2xl">
            Your profile shows a{' '}
            <span className="text-white font-bold">{readinessScore}% readiness score</span> for{' '}
            <span className="text-white font-semibold">{targetRole}</span>.{' '}
            {skillGaps.length > 0
              ? `Closing your top ${Math.min(3, skillGaps.length)} skill gap${skillGaps.length > 1 ? 's' : ''} will boost your match to 90%+.`
              : 'You\'re well-matched for this role!'}
          </p>

          {/* Skill gap pills (max 3) */}
          {skillGaps.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {skillGaps.slice(0, 3).map((g) => (
                <span
                  key={g.skillId}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 border border-white/15 text-white"
                >
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  {g.name}
                  <span className="text-amber-300 font-semibold">−{g.gap}%</span>
                </span>
              ))}
            </div>
          )}

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/student/skill-gaps"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-700 font-bold text-sm rounded-xl shadow hover:bg-indigo-50 transition-colors bouncy-hover"
            >
              View Skill Gaps <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/student/learning"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-xl border border-white/20 transition-colors"
            >
              Start Learning
            </Link>
          </div>
        </div>
      </div>

      {/* ── 2. Compact Journey Progress ── */}
      <div className="clean-card">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-slate-700">Your Journey</p>
          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            Next: {currentStepLabel}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {JOURNEY_STEPS.map((step, idx) => {
            const done = idx < completedSteps;
            const current = idx === completedSteps;
            return (
              <Link
                key={step.id}
                href={step.href}
                title={step.label}
                className={`flex-1 group flex flex-col items-center gap-1.5 text-center`}
              >
                <div
                  className={`w-full h-1.5 rounded-full transition-colors ${
                    done ? 'bg-indigo-500' : current ? 'bg-indigo-300' : 'bg-slate-200'
                  }`}
                />
                <span
                  className={`text-[10px] font-medium hidden sm:block ${
                    current ? 'text-indigo-600 font-bold' : done ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </Link>
            );
          })}
        </div>
        <p className="text-xs text-slate-400 mt-2">
          {completedSteps} of {JOURNEY_STEPS.length} steps completed
        </p>
      </div>

      {/* ── 3. Stat Strip ── */}
      <div>
        <p className="section-label">Career Snapshot</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Readiness', value: `${readinessScore}%`, sub: 'vs role benchmark', icon: TrendingUp, color: 'text-indigo-600', iconBg: 'bg-indigo-100' },
            { label: 'Role Fit', value: `${roleFitScore}%`, sub: targetRole, icon: Target, color: 'text-purple-600', iconBg: 'bg-purple-100' },
            { label: 'Verified Skills', value: `${Object.keys(skills).length || 8}`, sub: 'calibrated', icon: ShieldCheck, color: 'text-emerald-600', iconBg: 'bg-emerald-100' },
            { label: 'AI Matches', value: `${recommendedOpps.length}`, sub: 'live postings', icon: Briefcase, color: 'text-amber-600', iconBg: 'bg-amber-100' },
          ].map((stat) => (
            <div key={stat.label} className="clean-card flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center flex-shrink-0`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs font-semibold text-slate-700 leading-tight">{stat.label}</div>
                <div className="text-[11px] text-slate-400 truncate">{stat.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. Opportunities ── */}
      <div className="grid lg:grid-cols-12 gap-5">
        {/* Top Match Card */}
        {topMatch && (
          <div className="lg:col-span-7 clean-card space-y-4">
            <div>
              <p className="section-label" style={{ marginBottom: '0.25rem' }}>Top Recommended</p>
              <h3 className="text-lg font-bold text-slate-900">{topMatch.opp.title}</h3>
              <p className="text-sm text-slate-500 mt-0.5">
                {topMatch.opp.company} · {topMatch.opp.location}
                {topMatch.opp.stipend && (
                  <> · <span className="text-indigo-600 font-medium">₹{topMatch.opp.stipend.toLocaleString()}/mo</span></>
                )}
              </p>
            </div>

            {/* Match score */}
            <div className="flex items-center gap-3">
              <span className={`text-sm font-bold px-3 py-1.5 rounded-lg ${scoreBgColor(topMatch.match.score)}`}>
                {topMatch.match.score}% Match
              </span>
              <span className="text-xs text-slate-400">AI-calculated compatibility</span>
            </div>

            {/* Why this match */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Why this match?</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-[11px] font-semibold text-emerald-600 mb-1.5">Strengths</p>
                  <div className="space-y-1">
                    {topMatch.match.matchedSkills.slice(0, 3).map((s) => (
                      <div key={s} className="flex items-center gap-1.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        {SKILL_MAP[s]?.name ?? s}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-amber-600 mb-1.5">Gaps to close</p>
                  <div className="space-y-1">
                    {topMatch.match.missingSkills.length > 0 ? (
                      topMatch.match.missingSkills.slice(0, 2).map((s) => (
                        <div key={s} className="flex items-center gap-1.5 text-xs text-slate-700">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                          {SKILL_MAP[s]?.name ?? s}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-emerald-600 font-medium">No critical gaps!</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <Link
                href={`/student/opportunities/${topMatch.opp.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-colors bouncy-hover"
              >
                Apply Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/student/opportunities" className="text-sm text-indigo-600 hover:underline font-medium">
                See all {recommendedOpps.length} →
              </Link>
            </div>
          </div>
        )}

        {/* Right column */}
        <div className="lg:col-span-5 space-y-4">
          {/* More Matches */}
          <div className="clean-card space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">More Matches</p>
              <Link href="/student/opportunities" className="text-xs text-indigo-600 font-medium hover:underline">
                See All
              </Link>
            </div>
            <div className="space-y-2">
              {recommendedOpps.slice(1, 4).map(({ opp, match }) => (
                <Link
                  key={opp.id}
                  href={`/student/opportunities/${opp.id}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all group"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <p className="text-sm font-medium text-slate-800 truncate group-hover:text-indigo-700 transition-colors">
                      {opp.title}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{opp.company} · {opp.location}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg flex-shrink-0 ${scoreBgColor(match.score)}`}>
                    {match.score}%
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* CV Quick Link */}
          <div className="clean-card flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {resume ? resume.fileName : 'Upload Your CV'}
                </p>
                <p className="text-xs text-slate-400">
                  {resume ? `${Object.keys(skills).length} skills synced` : 'Sync skills automatically'}
                </p>
              </div>
            </div>
            <Link
              href="/student/resume"
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg transition-colors flex-shrink-0"
            >
              Manage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
