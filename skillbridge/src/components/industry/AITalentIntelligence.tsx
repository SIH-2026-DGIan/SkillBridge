'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, ArrowRight, Check, Zap, Users, Building, ExternalLink } from 'lucide-react';
import { SKILL_MAP } from '@/lib/skills-taxonomy';
import { cn } from '@/lib/utils';

export interface CandidateItem {
  id: string;
  name: string;
  college: string;
  branch: string;
  graduationYear?: number;
  cgpa?: number;
  score: number;
  skills?: Record<string, number>;
}

interface AITalentIntelligenceProps {
  candidates: CandidateItem[];
  roleTitle?: string;
  onShortlist: (id: string, name: string) => void;
}

export function AITalentIntelligence({
  candidates,
  roleTitle = 'Active Openings',
  onShortlist,
}: AITalentIntelligenceProps) {
  const [shortlistedIds, setShortlistedIds] = useState<Set<string>>(new Set());

  const handleShortlistClick = (id: string, name: string) => {
    setShortlistedIds((prev) => new Set([...prev, id]));
    onShortlist(id, name);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-7 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                AI Talent Intelligence
              </h2>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-full">
                AI Ranked
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Find the strongest candidates based on verified skills, role requirements and competency evidence.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Role:</span>
            <span className="text-xs font-bold text-slate-800 bg-slate-100/80 px-2.5 py-1 rounded-lg border border-slate-200/60 truncate max-w-[200px]">
              {roleTitle}
            </span>
            <Link
              href="/industry/candidates"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 shrink-0"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Candidates List / UX */}
        <div className="py-4 space-y-3">
          {candidates.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">No candidates evaluated yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Once students apply to your opportunities, AI-powered candidate matching and ranking will appear here.
              </p>
              <div className="pt-2">
                <Link
                  href="/industry/opportunities/new"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  <span>Post Opportunity</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            candidates.slice(0, 5).map((candidate, idx) => {
              const isShortlisted = shortlistedIds.has(candidate.id);
              const initial = candidate.name.charAt(0).toUpperCase();

              // Extract top 3-4 skills for display
              const skillList = candidate.skills
                ? Object.keys(candidate.skills).slice(0, 4)
                : [];

              return (
                <div
                  key={candidate.id}
                  className="p-4 rounded-xl bg-slate-50/50 hover:bg-white border border-slate-200/70 hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  {/* Left: Rank, Avatar, Identity */}
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <span
                      className={cn(
                        'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 transition-colors',
                        idx === 0
                          ? 'bg-blue-600 text-white shadow-xs'
                          : idx === 1
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      )}
                    >
                      #{idx + 1}
                    </span>

                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {initial}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                          {candidate.name}
                        </span>
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/50 shrink-0">
                          <ShieldCheck className="w-2.5 h-2.5" /> Verified Skill Match
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                        {candidate.college} · {candidate.branch} {candidate.cgpa ? `· CGPA ${candidate.cgpa}` : ''}
                      </p>

                      {/* Skills Chips */}
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-0.5">
                          Skills:
                        </span>
                        {skillList.map((s) => {
                          const skillName = SKILL_MAP[s]?.name || s;
                          return (
                            <span
                              key={s}
                              className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 text-[10px] font-semibold tracking-wide"
                            >
                              {skillName}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right: Match Score & Action */}
                  <div className="flex items-center justify-between md:justify-end gap-5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-left md:text-right min-w-[110px]">
                      <div className="flex items-center md:justify-end gap-1 text-xs font-black text-indigo-700">
                        <Zap className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{candidate.score}% Match</span>
                      </div>
                      <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
                          style={{ width: `${candidate.score}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleShortlistClick(candidate.id, candidate.name)}
                      disabled={isShortlisted}
                      className={cn(
                        'px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-xs shrink-0 inline-flex items-center gap-1.5',
                        isShortlisted
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 cursor-default'
                          : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-sm active:scale-95'
                      )}
                    >
                      {isShortlisted ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Shortlisted</span>
                        </>
                      ) : (
                        <>
                          <span>Shortlist</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {candidates.length > 0 && (
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">
            AI-driven deterministic candidate ranking based on verified skill taxonomy
          </span>
          <Link
            href="/industry/candidates"
            className="font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
          >
            <span>Explore all candidate rankings</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
