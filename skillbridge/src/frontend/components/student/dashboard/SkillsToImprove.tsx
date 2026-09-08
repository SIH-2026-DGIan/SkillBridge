import { ArrowRight, AlertTriangle, Target } from 'lucide-react';
import Link from 'next/link';

interface SkillGap {
  skillId: string;
  name: string;
  gap: number;
}

export function SkillsToImprove({ skillGaps }: { skillGaps: SkillGap[] }) {
  const topGaps = skillGaps.slice(0, 3);

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden h-full flex flex-col">
      <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-slate-50/50">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          Skills You Can Improve
        </h2>
        {skillGaps.length > 0 && (
          <Link href="/student/skill-gaps" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
            View Roadmap
          </Link>
        )}
      </div>
      
      <div className="p-5 flex-1 flex flex-col justify-center">
        {skillGaps.length === 0 ? (
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto border border-slate-100">
              <Target className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <div className="text-xs text-slate-500 mt-1">Complete your skill assessment to discover your strengths and areas you can improve.</div>
            </div>
            <Link href="/student/assessment" className="inline-flex items-center justify-center w-full px-4 py-2 mt-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">
              Check Your Skills &rarr;
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {topGaps.map((gap) => (
              <div key={gap.skillId} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{gap.name}</span>
                  <span className="font-medium text-amber-600">Gap: {gap.gap}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: `${Math.min(100, gap.gap)}%` }}></div>
                </div>
              </div>
            ))}
            
            <Link href="/student/learning" className="inline-flex items-center justify-center w-full gap-2 px-4 py-2 mt-4 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors">
              Start Learning Path <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
