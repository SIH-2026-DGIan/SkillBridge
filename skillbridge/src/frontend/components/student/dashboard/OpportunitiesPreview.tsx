'use client';

import Link from 'next/link';
import { Briefcase, Building2, MapPin, Zap, ArrowRight, Calendar, Clock, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export interface MatchedOpportunity {
  opp: {
    id: string;
    title: string;
    company: string;
    location: string;
    type?: string;
    employmentType?: string;
    deadline?: string;
    requiredSkills?: { skillId: string; requiredLevel: number }[];
  };
  match: {
    score: number;
    matchedSkills: string[];
    missingSkills: string[];
  };
}

interface OpportunitiesPreviewProps {
  opportunities: MatchedOpportunity[];
}

export function OpportunitiesPreview({ opportunities }: OpportunitiesPreviewProps) {
  const topMatches = opportunities.slice(0, 3);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header with explanation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              Opportunities Matched For You
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Opportunities ranked using your profile, skills and career goals.
            </p>
          </div>
          {opportunities.length > 0 && (
            <Link
              href="/student/opportunities"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 shrink-0"
            >
              <span>View All ({opportunities.length})</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {/* Opportunity Cards List */}
        <div className="py-4">
          {topMatches.length === 0 ? (
            <div className="text-center py-8 px-4 space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto text-blue-600">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                No matched opportunities yet
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                Complete your profile and skill assessment to unlock personalized opportunities matched to your career goals.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
                <Link
                  href="/student/profile"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  <span>Complete Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/student/assessment"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
                >
                  <span>Check Your Skills</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topMatches.map(({ opp, match }) => {
                const initial = (opp.company || 'C').charAt(0).toUpperCase();
                const employmentType = opp.type || opp.employmentType || 'Internship';

                return (
                  <div
                    key={opp.id}
                    className="border border-slate-200/80 hover:border-blue-300 rounded-xl p-4 transition-all hover:shadow-sm bg-slate-50/40 hover:bg-white flex flex-col justify-between group"
                  >
                    <div>
                      {/* Top: Monogram + Match Score Badge */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/60 flex items-center justify-center font-black text-sm shrink-0">
                          {initial}
                        </div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60 font-black text-[11px]">
                          <Zap className="w-3 h-3 text-purple-600" />
                          {match.score}% Match
                        </span>
                      </div>

                      {/* Title and Company */}
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {opp.title}
                      </h3>
                      <p className="text-xs font-semibold text-slate-600 mt-0.5 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{opp.company}</span>
                      </p>

                      {/* Meta: Location and Type */}
                      <div className="flex items-center gap-2.5 mt-2 text-[11px] text-slate-500 font-medium">
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {opp.location || 'Remote'}
                        </span>
                        <span>•</span>
                        <span className="capitalize">{employmentType}</span>
                      </div>

                      {/* Required Skills Badges */}
                      <div className="mt-3 flex flex-wrap gap-1">
                        {match.matchedSkills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-[10px] font-semibold"
                          >
                            ✓ {skill}
                          </span>
                        ))}
                        {match.missingSkills.slice(0, 1).map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom: Deadline & CTA */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{opp.deadline ? `Deadline: ${formatDate(opp.deadline)}` : 'Apply early'}</span>
                      </div>
                      <Link
                        href={`/student/opportunities/${opp.id}`}
                        className="text-xs font-bold text-blue-600 group-hover:text-blue-700 inline-flex items-center gap-1"
                      >
                        <span>View Opportunity</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {topMatches.length > 0 && (
        <div className="pt-2 flex items-center justify-end">
          <Link
            href="/student/opportunities"
            className="text-xs font-bold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1.5"
          >
            <span>Explore all matched opportunities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
