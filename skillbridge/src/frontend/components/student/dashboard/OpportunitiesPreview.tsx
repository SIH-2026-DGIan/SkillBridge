import { Briefcase, ArrowRight, Zap, Building2, MapPin } from 'lucide-react';
import Link from 'next/link';

interface MatchOpportunity {
  opp: any; // We'll pass the whole object
  match: { score: number; matchedSkills: string[]; missingSkills: string[] };
}

export function OpportunitiesPreview({ opportunities }: { opportunities: MatchOpportunity[] }) {
  const topMatches = opportunities.slice(0, 2);

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden h-full flex flex-col">
      <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50/50">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-purple-500" />
          Opportunities for You
        </h2>
        {opportunities.length > 0 && (
          <Link href="/student/opportunities" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
            View All
          </Link>
        )}
      </div>
      
      <div className="p-5 flex-1 flex flex-col justify-center">
        {opportunities.length === 0 ? (
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto border border-slate-100">
              <Zap className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-700">No matches found yet</div>
              <div className="text-xs text-slate-500 mt-1">Complete your profile and skill assessment to receive opportunities matched to your skills and career goals.</div>
            </div>
            <Link href="/student/profile" className="inline-flex items-center justify-center w-full px-4 py-2 mt-2 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg border border-purple-100 hover:bg-purple-100 transition-colors">
              Complete Profile &rarr;
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {topMatches.map(({ opp, match }) => (
              <Link key={opp.id} href={`/student/opportunities/${opp.id}`} className="block group">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1 pr-4">
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors truncate">
                      {opp.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] font-medium text-slate-500">
                      <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {opp.company}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {opp.location}</span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <div className="px-2 py-1 rounded bg-purple-50 border border-purple-100 text-purple-700 font-bold text-[10px] flex items-center gap-1">
                      <Zap className="w-3 h-3" /> {match.score}% Match
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {match.matchedSkills.slice(0, 3).map((skill: string) => (
                    <span key={skill} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-semibold tracking-wide uppercase">
                      {skill}
                    </span>
                  ))}
                  {match.matchedSkills.length > 3 && (
                    <span className="px-2 py-0.5 bg-slate-50 text-slate-400 rounded text-[9px] font-semibold tracking-wide uppercase">
                      +{match.matchedSkills.length - 3}
                    </span>
                  )}
                </div>
              </Link>
            ))}
            
            <Link href="/student/opportunities" className="inline-flex items-center justify-center w-full gap-2 px-4 py-2 mt-2 bg-slate-50 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-100 border border-slate-200 transition-colors">
              Explore {opportunities.length} Matches <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
