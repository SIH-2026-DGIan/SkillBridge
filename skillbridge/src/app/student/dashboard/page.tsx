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
  Sparkles,
  ShieldCheck,
  UploadCloud,
  FileText,
  ChevronRight,
  Award,
} from 'lucide-react';
import { DEMO_OPPORTUNITIES, DEMO_APPLICATIONS } from '@/lib/demo-data';
import { calculateMatch } from '@/lib/ai/matching-engine';
import { ROLE_REQUIRED_SKILLS, SKILL_MAP } from '@/lib/skills-taxonomy';
import { getStudentSkills, getStudentResume, getSession, type UserSession, type ParsedResume } from '@/lib/user-session';
import { scoreBgColor, scoreColor } from '@/lib/utils';

const JOURNEY_STEPS = [
  { id: 'profile', label: '1. Profile', href: '/onboarding/student' },
  { id: 'assess', label: '2. Assessment', href: '/student/assessment' },
  { id: 'skills', label: '3. Skill Profile', href: '/student/skills' },
  { id: 'gaps', label: '4. Skill Gaps', href: '/student/skill-gaps' },
  { id: 'learn', label: '5. Learning', href: '/student/learning' },
  { id: 'match', label: '6. AI Match', href: '/student/opportunities' },
  { id: 'apply', label: '7. Apply', href: '/student/opportunities' },
  { id: 'track', label: '8. Track', href: '/student/applications' },
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

  // Calculate Readiness Score & Gaps
  const requiredSkills = ROLE_REQUIRED_SKILLS[targetRole] ?? ROLE_REQUIRED_SKILLS['Machine Learning Engineer'] ?? [];

  const gapAnalysis = useMemo(() => {
    return requiredSkills.map(({ skillId, required }) => {
      const current = skills[skillId] ?? 0;
      const gap = Math.max(0, required - current);
      return {
        skillId,
        name: SKILL_MAP[skillId]?.name ?? skillId,
        current,
        required,
        gap,
        isGap: current < required,
      };
    });
  }, [requiredSkills, skills]);

  const skillGaps = useMemo(() => {
    return gapAnalysis.filter((g) => g.isGap).sort((a, b) => b.gap - a.gap);
  }, [gapAnalysis]);

  const readinessScore = useMemo(() => {
    if (requiredSkills.length === 0) return 60;
    const totalCurrent = requiredSkills.reduce((sum, { skillId, required }) => {
      const current = skills[skillId] ?? 0;
      return sum + Math.min(100, (current / required) * 100);
    }, 0);
    return Math.round(totalCurrent / requiredSkills.length);
  }, [requiredSkills, skills]);

  const roleFitScore = Math.min(96, Math.max(50, Math.round(readinessScore * 0.95 + (resume ? 10 : 0))));

  // Dynamic user profile for matching
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

  // Recommended Opportunities
  const recommendedOpps = useMemo(() => {
    const oppProfiles = DEMO_OPPORTUNITIES.map((opp) => ({
      id: opp.id,
      title: opp.title,
      company: opp.company,
      type: opp.type,
      category: opp.category,
      requiredSkills: opp.requiredSkills,
      eligibility: opp.eligibility,
    }));

    return oppProfiles
      .map((opp) => ({
        opp: DEMO_OPPORTUNITIES.find((o) => o.id === opp.id)!,
        match: calculateMatch(dynamicUserProfile, opp),
      }))
      .sort((a, b) => b.match.score - a.match.score);
  }, [dynamicUserProfile]);

  const topMatch = recommendedOpps[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. YOUR SKILLBRIDGE JOURNEY STEPPER */}
      <div className="glass-card rounded-3xl p-5 sm:p-6 border border-white shadow-lg bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Your SkillBridge Journey
            </h2>
          </div>
          <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Active Stage: Gap Remediation &amp; Matching
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {JOURNEY_STEPS.map((step, idx) => {
            const isCompleted = idx < 4;
            const isCurrent = idx === 4 || idx === 5;
            return (
              <Link
                key={step.id}
                href={step.href}
                className={`p-2.5 rounded-2xl text-center text-xs font-extrabold transition-all ${
                  isCurrent
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-500/20'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-slate-50 text-slate-400 border border-slate-200/80 hover:text-slate-600'
                }`}
              >
                <div className="text-[10px] opacity-75">{isCompleted ? '✓' : idx + 1}</div>
                <div className="truncate">{step.label.split('. ')[1]}</div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 2. "YOUR NEXT STEP" CONTEXTUAL ACTION HERO */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white shadow-xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <span className="text-[11px] font-black tracking-wider text-amber-300 uppercase">
                ⚡ Guided Career Action
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-0.5">
                Welcome back, {user.name}!
              </h1>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-300">Target Career Goal</span>
              <div className="text-base font-black text-white">{targetRole}</div>
            </div>
          </div>

          <div className="grid md:grid-cols-12 gap-6 items-center pt-2">
            <div className="md:col-span-8 space-y-3">
              <div className="text-xs text-indigo-200 font-medium leading-relaxed">
                Your verified assessment &amp; CV indicate a <strong>{readinessScore}% readiness score</strong> for{' '}
                <strong>{targetRole}</strong>. Closing your top 3 skill gaps will boost your placement match to 90%+.
              </div>

              {skillGaps.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                    Critical Skills to Improve for {targetRole}:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skillGaps.slice(0, 3).map((g) => (
                      <span
                        key={g.skillId}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-xl text-xs font-bold border border-white/15 text-white"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        {g.name} ({g.gap}% gap)
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-2.5">
              <Link
                href="/student/skill-gaps"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 bouncy-hover transition-all text-center"
              >
                View Skill Gaps &amp; Roadmap <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/student/learning"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs rounded-2xl border border-white/20 transition-all text-center"
              >
                Start Learning Modules
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. YOUR CAREER SNAPSHOT METRIC BAR */}
      <div>
        <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3 px-1">
          Your Career Snapshot
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Readiness Score', value: `${readinessScore}%`, sub: 'Target Role Benchmark', icon: TrendingUp, color: 'text-indigo-600', bg: 'from-indigo-500 to-purple-600' },
            { label: 'Target Role Fit', value: `${roleFitScore}%`, sub: targetRole, icon: Target, color: 'text-purple-600', bg: 'from-purple-500 to-pink-600' },
            { label: 'Verified Skills', value: `${Object.keys(skills).length || 8}`, sub: 'Competencies Calibrated', icon: ShieldCheck, color: 'text-emerald-600', bg: 'from-emerald-500 to-teal-600' },
            { label: 'AI Job Matches', value: `${recommendedOpps.length}`, sub: 'Verified Postings', icon: Briefcase, color: 'text-amber-600', bg: 'from-amber-500 to-orange-600' },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-3xl p-5 border border-white shadow-md bg-white flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${stat.bg} flex items-center justify-center text-white font-black shadow-md`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</div>
                <div className="text-xs font-extrabold text-slate-700 mt-0.5">{stat.label}</div>
                <div className="text-[11px] font-semibold text-slate-400 mt-0.5 truncate">{stat.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. AI RECOMMENDED OPPORTUNITIES WITH "WHY THIS MATCH?" */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Top Highlight Opportunity & Factor Breakdown (7 cols) */}
        {topMatch && (
          <div className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-7 border border-white shadow-lg bg-white space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-indigo-600">
                  Top Recommended Opportunity
                </div>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">{topMatch.opp.title}</h3>
                <div className="text-xs font-bold text-slate-500">
                  {topMatch.opp.company} · {topMatch.opp.location} · <span className="text-indigo-600">{topMatch.opp.stipend ? `₹${topMatch.opp.stipend.toLocaleString()}/mo` : 'Competitive'}</span>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-sm font-black px-3.5 py-1.5 rounded-full shadow-sm ${scoreBgColor(topMatch.match.score)}`}>
                  {topMatch.match.score}% Match
                </span>
              </div>
            </div>

            {/* WHY THIS MATCH? Explicit Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
              <div className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" /> Why This Match?
              </div>
              <div className="grid sm:grid-cols-2 gap-2 text-xs">
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-emerald-700">Verified Strengths:</div>
                  {topMatch.match.matchedSkills.slice(0, 3).map((s) => (
                    <div key={s} className="flex items-center gap-1.5 font-bold text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span>{SKILL_MAP[s]?.name ?? s}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-amber-700">Competency Gaps:</div>
                  {topMatch.match.missingSkills.length > 0 ? (
                    topMatch.match.missingSkills.slice(0, 2).map((s) => (
                      <div key={s} className="flex items-center gap-1.5 font-bold text-slate-700">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                        <span>{SKILL_MAP[s]?.name ?? s}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-emerald-600 font-bold">Zero critical skill gaps!</div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link
                href={`/student/opportunities/${topMatch.opp.id}`}
                className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all bouncy-hover"
              >
                Apply for Opportunity <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/student/opportunities"
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                View all {recommendedOpps.length} matches →
              </Link>
            </div>
          </div>
        )}

        {/* Other Matches & CV Quick Update (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card rounded-3xl p-6 border border-white shadow-lg bg-white space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-extrabold text-slate-900 text-sm">More AI Matches</h3>
              <Link href="/student/opportunities" className="text-xs font-bold text-indigo-600">
                See All
              </Link>
            </div>

            <div className="space-y-2.5">
              {recommendedOpps.slice(1, 3).map(({ opp, match }) => (
                <Link
                  key={opp.id}
                  href={`/student/opportunities/${opp.id}`}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-100 hover:border-indigo-200 transition-all group"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="font-extrabold text-slate-900 text-xs truncate group-hover:text-indigo-600 transition-colors">
                      {opp.title}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 mt-0.5 truncate">
                      {opp.company} · {opp.location}
                    </div>
                  </div>
                  <span className={`text-xs font-black px-2.5 py-1 rounded-full ${scoreBgColor(match.score)} flex-shrink-0`}>
                    {match.score}%
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Resume Re-sync Box */}
          <div className="glass-card rounded-3xl p-5 border border-indigo-100 shadow-md bg-gradient-to-br from-indigo-50/60 to-purple-50/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black text-slate-900 truncate">
                  {resume ? `Active CV: ${resume.fileName}` : 'Upload Latest CV'}
                </div>
                <div className="text-[11px] text-slate-500 font-semibold truncate">
                  {resume ? `${Object.keys(skills).length} skills verified` : 'Sync skills automatically'}
                </div>
              </div>
            </div>
            <Link
              href="/student/resume"
              className="px-3.5 py-2 bg-white text-indigo-600 font-extrabold text-xs rounded-xl border border-indigo-200 shadow-sm hover:bg-indigo-50 transition-colors flex-shrink-0"
            >
              Manage CV
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
