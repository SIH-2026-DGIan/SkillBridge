'use client';

import { useMemo, useState, use } from 'react';
import Link from 'next/link';
import {
  MapPin, Clock, DollarSign, Calendar, CheckCircle, AlertTriangle, ArrowLeft, Building2, Send, ShieldCheck, Bookmark, BookmarkCheck, Users, Briefcase
} from 'lucide-react';
import { DEMO_OPPORTUNITIES, DEMO_STUDENT_SKILLS } from '@/lib/demo-data';
import { calculateMatch } from '@/lib/ai/matching-engine';
import { SKILL_MAP } from '@/lib/skills-taxonomy';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

const USER_PROFILE = {
  skills: Object.entries(DEMO_STUDENT_SKILLS).map(([skillId, proficiency]) => ({ skillId, proficiency })),
  targetRoles: ['Software Developer', 'Machine Learning Engineer', 'Data Analyst'],
  education: { degree: 'B.Tech', branch: 'Computer Science', graduationYear: 2026 },
  projects: [
    { technologies: ['python', 'tensorflow', 'machine_learning', 'deep_learning'] },
    { technologies: ['python', 'machine_learning', 'sql', 'data_analysis'] },
  ],
  cgpa: 8.4,
};

export default function OpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(id === 'opp-2'); // Demo mock

  const opp = DEMO_OPPORTUNITIES.find((o) => o.id === id);

  const match = useMemo(() => {
    if (!opp) return null;
    return calculateMatch(USER_PROFILE, opp);
  }, [opp]);

  if (!opp || !match) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl border border-slate-200 mt-6 max-w-4xl mx-auto">
        <Building2 className="w-12 h-12 text-slate-300 mb-4" />
        <h2 className="text-lg font-black text-slate-900 mb-1">Opportunity not found</h2>
        <p className="text-sm text-slate-500 mb-6">This opportunity may have been removed or expired.</p>
        <Link href="/student/opportunities" className="px-5 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-lg hover:bg-blue-700 transition-colors">
          Browse Opportunities
        </Link>
      </div>
    );
  }

  const handleApply = async () => {
    if (applied) return;
    setApplying(true);

    try {
      await new Promise((r) => setTimeout(r, 800));
      toast.success('Application submitted successfully!');
      setApplied(true);
    } catch {
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Removed from saved opportunities' : 'Opportunity saved for later');
  };

  const matchScore = match.score;
  const matchColor = matchScore >= 90 ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : matchScore >= 75 ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-amber-700 bg-amber-50 border-amber-200';

  return (
    <div className="w-full relative pb-16">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-[1100px] mx-auto w-full px-4 sm:px-6 py-4">
          <Link href="/student/opportunities" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Discover
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">{opp.title}</h1>
                <span className={`hidden sm:inline-block px-2.5 py-1 text-xs font-bold rounded-md border ${matchColor}`}>
                  {matchScore}% Match
                </span>
              </div>
              <div className="text-base font-semibold text-slate-600 flex items-center gap-2">
                <Building2 className="w-4 h-4" /> {opp.company}
              </div>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={toggleSave}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-lg border transition-colors ${
                  isSaved ? 'bg-slate-100 border-slate-200 text-slate-900' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {isSaved ? <BookmarkCheck className="w-4 h-4 text-blue-600" /> : <Bookmark className="w-4 h-4" />}
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
                  <><CheckCircle className="w-4 h-4" /> Applied</>
                ) : (
                  <><Send className="w-4 h-4" /> Apply Now</>
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
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Type</div>
                  <div className="text-sm font-bold text-slate-900 capitalize">{opp.type.replace('_', ' ')}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Location</div>
                  <div className="text-sm font-bold text-slate-900 capitalize">{opp.location} · {opp.workMode}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Duration</div>
                  <div className="text-sm font-bold text-slate-900">{opp.duration}</div>
                </div>
              </div>
              {opp.stipend > 0 && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Stipend</div>
                    <div className="text-sm font-bold text-emerald-600">{formatCurrency(opp.stipend)} / mo</div>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="prose prose-slate max-w-none">
              <h2 className="text-lg font-black text-slate-900 mb-3">Overview</h2>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{opp.description}</p>
            </div>

            {/* What you'll work on */}
            <div>
              <h2 className="text-lg font-black text-slate-900 mb-4">What you'll work on</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700 leading-relaxed">Develop and maintain scalable software solutions using modern tech stacks.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700 leading-relaxed">Collaborate with cross-functional teams to define, design, and ship new features.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700 leading-relaxed">Write clean, testable, and efficient code while following industry best practices.</span>
                </li>
              </ul>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
              {/* Required Skills */}
              <div>
                <h2 className="text-lg font-black text-slate-900 mb-4">Required Skills</h2>
                <div className="flex flex-col gap-3">
                  {opp.requiredSkills.map(({ skillId }) => (
                    <div key={skillId} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                      <span className="text-sm font-semibold text-slate-800">{SKILL_MAP[skillId]?.name ?? skillId}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preferred Skills */}
              <div>
                <h2 className="text-lg font-black text-slate-900 mb-4">Preferred Skills</h2>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                    <span className="text-sm font-semibold text-slate-600">Agile/Scrum Experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                    <span className="text-sm font-semibold text-slate-600">Cloud Infrastructure (AWS/GCP)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Eligibility */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-slate-700" />
                <h2 className="text-lg font-black text-slate-900">Eligibility</h2>
              </div>
              <ul className="space-y-3">
                {match.eligibility.criteria.length > 0 ? (
                  match.eligibility.criteria.map((c, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2"></div>
                      <div>
                        <span className="text-sm font-semibold text-slate-800 block">{c.label}</span>
                        {c.details && <span className="text-xs text-slate-500">{c.details}</span>}
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-slate-700">Open to all registered engineering &amp; computer science students.</li>
                )}
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN - STICKY PANEL */}
          <div className="flex flex-col gap-5">
            
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm sticky top-[104px] overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-3 h-3 rounded-full ${matchScore >= 75 ? 'bg-emerald-500' : matchScore >= 60 ? 'bg-blue-500' : 'bg-amber-500'}`}></div>
                  <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Match Analysis</h2>
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-black text-slate-900 leading-none">{matchScore}%</span>
                </div>
                <p className="text-xs font-semibold text-slate-600">
                  {matchScore >= 75 ? 'Strong match' : matchScore >= 60 ? 'Good match' : 'Fair match'} for your {USER_PROFILE.targetRoles[0]} career goal.
                </p>
              </div>

              <div className="p-6">
                {match.matchedSkills.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Matching Skills</h3>
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
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Skills to Strengthen</h3>
                    <div className="flex flex-col gap-2">
                      {match.missingSkills.map((skill) => (
                        <div key={skill} className="flex items-center gap-2 text-sm text-slate-700">
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                          <span className="font-semibold">{skill}</span>
                        </div>
                      ))}
                    </div>
                    <Link href="/student/learning" className="inline-block mt-3 text-xs font-bold text-blue-600 hover:underline">
                      Add to Learning Plan →
                    </Link>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Eligibility Status</h3>
                  <div className="flex items-center gap-2 text-sm">
                    {match.eligibility.isEligible ? (
                      <><CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /><span className="font-semibold text-slate-900">Eligible</span></>
                    ) : (
                      <><AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" /><span className="font-semibold text-slate-900">Review Criteria</span></>
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
                      <><CheckCircle className="w-4 h-4" /> Applied</>
                    ) : (
                      'Apply Now'
                    )}
                  </button>
                  <button
                    onClick={toggleSave}
                    className={`w-full py-3 text-sm font-bold rounded-lg border transition-colors ${
                      isSaved ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
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
