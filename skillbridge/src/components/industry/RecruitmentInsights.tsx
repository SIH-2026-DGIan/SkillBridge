'use client';

import { Sparkles, TrendingUp, Award, CheckCircle2, Clock } from 'lucide-react';

interface RecruitmentInsightsProps {
  topSkill?: string;
  topOpportunity?: string;
  verifiedRatio?: number;
  avgTime?: string;
}

export function RecruitmentInsights({
  topSkill,
  topOpportunity,
  verifiedRatio,
  avgTime,
}: RecruitmentInsightsProps) {
  const insights = [
    {
      title: 'Top Skill in Demand',
      value: topSkill || '—',
      description: topSkill
        ? `Most frequently required skill across active roles`
        : 'Post opportunities to compute in-demand skills',
      icon: TrendingUp,
      color: 'blue',
    },
    {
      title: 'Top Performing Role',
      value: topOpportunity || '—',
      description: topOpportunity
        ? 'Active role receiving applicant engagement'
        : 'No active job opportunities posted yet',
      icon: Award,
      color: 'indigo',
    },
    {
      title: 'Verified Competency Ratio',
      value: verifiedRatio !== undefined && verifiedRatio > 0 ? `${verifiedRatio}%` : '—',
      description: verifiedRatio !== undefined && verifiedRatio > 0
        ? 'Proportion of applicants with verified skills'
        : 'Awaiting candidate evaluations to benchmark',
      icon: CheckCircle2,
      color: 'emerald',
    },
    {
      title: 'AI Time-to-Shortlist',
      value: avgTime || '—',
      description: avgTime
        ? 'Deterministic matching turnaround'
        : 'Instant evaluation once applications are submitted',
      icon: Clock,
      color: 'violet',
    },
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div>
          <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Recruitment Insights
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Key telemetry across your candidate talent pool and active hiring funnels
          </p>
        </div>
        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2.5 py-1 rounded-full">
          Live Analytics
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((item) => (
          <div
            key={item.title}
            className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/60 flex flex-col justify-between hover:bg-slate-50 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {item.title}
                </span>
                <item.icon className="w-4 h-4 text-slate-400" />
              </div>

              <div className="text-lg font-black text-slate-900 tracking-tight">
                {item.value}
              </div>
            </div>

            <p className="text-[11px] text-slate-500 font-medium mt-2 leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
