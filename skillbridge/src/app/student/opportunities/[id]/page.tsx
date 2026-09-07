'use client';

import { useMemo, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin, Clock, DollarSign, Calendar, CheckCircle, AlertTriangle, ArrowLeft, Zap, Building2, Send, ShieldCheck,
} from 'lucide-react';
import { DEMO_OPPORTUNITIES, DEMO_STUDENT_SKILLS } from '@/lib/demo-data';
import { calculateMatch } from '@/lib/ai/matching-engine';
import { SKILL_MAP } from '@/lib/skills-taxonomy';
import { scoreBgColor, formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

const USER_PROFILE = {
  skills: Object.entries(DEMO_STUDENT_SKILLS).map(([skillId, proficiency]) => ({ skillId, proficiency })),
  targetRoles: ['Machine Learning Engineer', 'Data Analyst'],
  education: { degree: 'B.Tech', branch: 'Computer Science', graduationYear: 2026 },
  projects: [
    { technologies: ['python', 'tensorflow', 'machine_learning', 'deep_learning'] },
    { technologies: ['python', 'machine_learning', 'sql', 'data_analysis'] },
  ],
  cgpa: 8.4,
};

function ScoreBar({ label, weight, score, color }: { label: string; weight: string; score: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-gray-700 font-medium">
          {label} <span className="text-xs text-gray-400 font-normal">({weight})</span>
        </span>
        <span className="text-sm font-bold text-gray-900">{score}%</span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default function OpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const opp = DEMO_OPPORTUNITIES.find((o) => o.id === id);

  const match = useMemo(() => {
    if (!opp) return null;
    return calculateMatch(USER_PROFILE, opp);
  }, [opp]);

  if (!opp || !match) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64">
        <Building2 className="w-12 h-12 text-gray-300 mb-3" />
        <h2 className="font-semibold text-gray-700">Opportunity not found</h2>
        <Link href="/student/opportunities" className="mt-3 text-blue-600 text-sm font-semibold">
          ← Back to Opportunities
        </Link>
      </div>
    );
  }

  const handleApply = async () => {
    if (applied) return;
    setApplying(true);

    try {
      // Try saving to Supabase
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase.from('applications').insert({
          opportunity_id: opp.id,
          student_id: user.id,
          status: 'applied',
          match_score: match.score,
        });

        if (error?.code === '23505') {
          toast.info('You have already applied to this opportunity');
        } else if (error) {
          throw error;
        } else {
          toast.success('Application submitted successfully!');
        }
      } else {
        // Demo mode
        await new Promise((r) => setTimeout(r, 600));
        toast.success('Application submitted! (Demo Mode: Added to tracker)');
      }

      setApplied(true);
    } catch {
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  const scoreClass =
    match.score >= 80 ? 'bg-green-50 border-green-300 text-green-700' :
    match.score >= 60 ? 'bg-yellow-50 border-yellow-300 text-yellow-700' :
    'bg-red-50 border-red-300 text-red-600';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back link */}
      <Link href="/student/opportunities" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Opportunities
      </Link>

      {/* Hero card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl flex-shrink-0">
              {opp.company[0]}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">{opp.title}</h1>
              <div className="text-gray-600 font-medium mt-0.5">{opp.company}</div>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {opp.location}
                </span>
                <span className="flex items-center gap-1 capitalize">
                  <Building2 className="w-3.5 h-3.5" /> {opp.workMode}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {opp.duration}
                </span>
                {opp.stipend > 0 && (
                  <span className="flex items-center gap-1 font-semibold text-gray-700">
                    <DollarSign className="w-3.5 h-3.5" /> {formatCurrency(opp.stipend)}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Deadline: {formatDate(opp.deadline)}
                </span>
              </div>
            </div>
          </div>

          {/* Match score display */}
          <div className={`flex flex-col items-center justify-center w-24 h-24 rounded-2xl border-2 flex-shrink-0 ${scoreClass}`}>
            <span className="text-3xl font-extrabold leading-none">{match.score}%</span>
            <span className="text-xs font-semibold mt-1 uppercase tracking-wide">Match</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left column — details */}
        <div className="lg:col-span-3 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-3">About This Role</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{opp.description}</p>
          </div>

          {/* Required Skills vs Student Skills */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-4">Required Skills &amp; Proficiency</h2>
            <div className="space-y-4">
              {opp.requiredSkills.map(({ skillId, requiredLevel }) => {
                const userLevel = DEMO_STUDENT_SKILLS[skillId] ?? 0;
                const met = userLevel >= requiredLevel * 0.70;
                const skillName = SKILL_MAP[skillId]?.name ?? skillId;
                return (
                  <div key={skillId}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        {met ? (
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                        )}
                        <span className="text-sm font-semibold text-gray-900">
                          {skillName}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Your Level: <b className={met ? 'text-green-600' : 'text-yellow-600'}>{userLevel}%</b>
                        {' '} · Required: {requiredLevel}%
                      </div>
                    </div>
                    <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-gray-400 z-10"
                        style={{ left: `${requiredLevel}%` }}
                      />
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${met ? 'bg-green-500' : 'bg-yellow-400'}`}
                        style={{ width: `${userLevel}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Eligibility Check (Hard Filter) */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h2 className="font-bold text-gray-900">Eligibility Verification</h2>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                match.eligibility.isEligible ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {match.eligibility.isEligible ? '✓ Eligible for Selection' : '⚠ Review Criteria'}
              </span>
            </div>
            
            <div className="space-y-2.5 text-sm">
              {match.eligibility.criteria.length > 0 ? (
                match.eligibility.criteria.map((c, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2">
                      {c.met ? (
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      )}
                      <span className="text-gray-700 font-medium">{c.label}</span>
                    </div>
                    {c.details && <span className="text-xs text-gray-500 font-mono">{c.details}</span>}
                  </div>
                ))
              ) : (
                <div className="text-xs text-gray-500">Open to all registered engineering &amp; computer science students.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right column — AI match analysis (Showpiece) */}
        <div className="lg:col-span-2 space-y-4">
          {/* AI Match Breakdown Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <h2 className="font-bold text-gray-900">AI Match Engine</h2>
              </div>
              <span className="text-xs font-semibold text-gray-500">Deterministic AI Engine</span>
            </div>

            <div className="space-y-3.5 mb-4">
              <ScoreBar label="Skill Compatibility" weight="60%" score={match.breakdown.skillCompatibility} color="bg-blue-500" />
              <ScoreBar label="Interest Alignment" weight="20%" score={match.breakdown.interestAlignment} color="bg-purple-500" />
              <ScoreBar label="Project Relevance" weight="20%" score={match.breakdown.projectRelevance} color="bg-teal-500" />
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <span className="font-bold text-gray-900">Overall Match</span>
              <span className={`text-2xl font-extrabold ${match.score >= 80 ? 'text-green-600' : match.score >= 60 ? 'text-yellow-600' : 'text-red-500'}`}>
                {match.score}%
              </span>
            </div>
          </div>

          {/* Matched Skills */}
          {match.matchedSkills.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-500" /> Why You Match
              </h3>
              <div className="flex flex-wrap gap-2">
                {match.matchedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missing Skills / Skill Gaps */}
          {match.missingSkills.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-yellow-500" /> Skill Gaps to Improve
              </h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {match.missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-50 text-yellow-800 text-xs font-semibold rounded-full border border-yellow-200"
                  >
                    ⚠ {skill}
                  </span>
                ))}
              </div>
              <Link
                href="/student/skill-gaps"
                className="text-xs text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1"
              >
                View learning resources to close gap →
              </Link>
            </div>
          )}

          {/* AI Recommendation Box */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-blue-900">AI Recommendation</h3>
            </div>
            <p className="text-sm text-blue-800 leading-relaxed">{match.reason}</p>
          </div>

          {/* Apply Now CTA */}
          <button
            onClick={handleApply}
            disabled={applying || applied}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-base transition-all ${
              applied
                ? 'bg-green-600 text-white cursor-default shadow-sm'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:opacity-60'
            }`}
          >
            {applying ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : applied ? (
              <><CheckCircle className="w-5 h-5" /> Application Submitted!</>
            ) : (
              <><Send className="w-5 h-5" /> Apply Now</>
            )}
          </button>

          {applied && (
            <Link
              href="/student/applications"
              className="flex items-center justify-center gap-1.5 text-sm text-blue-600 font-semibold pt-1"
            >
              Track in Application Pipeline →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
