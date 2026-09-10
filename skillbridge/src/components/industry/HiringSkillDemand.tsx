'use client';

import { TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface SkillDemandItem {
  skill: string;
  percentage: number;
}

interface HiringSkillDemandProps {
  skillDemands?: SkillDemandItem[];
}

export function HiringSkillDemand({
  skillDemands = [],
}: HiringSkillDemandProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Hiring Skill Demand
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Top requested across active job descriptions
            </p>
          </div>
          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
            Market Index
          </span>
        </div>

        {/* Horizontal Progress Bars */}
        <div className="py-4 space-y-3.5">
          {skillDemands.length === 0 ? (
            <div className="text-center py-6 px-2 space-y-2">
              <p className="text-xs text-slate-500 leading-relaxed">
                Post job listings with required skills to generate your recruitment demand index.
              </p>
            </div>
          ) : (
            skillDemands.map((item) => (
              <div key={item.skill} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-800">{item.skill}</span>
                  <span className="font-black text-indigo-700">{item.percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 transition-all duration-700"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
        <span className="text-slate-400 font-medium">Mapped to SkillBridge taxonomy</span>
        <Link href="/industry/opportunities" className="font-bold text-blue-600 hover:text-blue-700">
          Manage roles →
        </Link>
      </div>
    </div>
  );
}
