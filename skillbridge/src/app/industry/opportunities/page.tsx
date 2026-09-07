'use client';

import Link from 'next/link';
import { PlusCircle, Briefcase, MapPin, Users, Calendar, ArrowRight } from 'lucide-react';
import { DEMO_OPPORTUNITIES } from '@/lib/demo-data';
import { SKILL_MAP } from '@/lib/skills-taxonomy';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function MyOpportunitiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">My Opportunities</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage job &amp; internship postings for TechNova</p>
        </div>
        <Link
          href="/industry/opportunities/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 text-sm"
        >
          <PlusCircle className="w-4 h-4" /> Post Opportunity
        </Link>
      </div>

      <div className="space-y-4">
        {DEMO_OPPORTUNITIES.map((opp) => (
          <div
            key={opp.id}
            className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="font-bold text-gray-900 text-lg">{opp.title}</h2>
                  <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 text-xs font-bold rounded-full capitalize">
                    {opp.type.replace('_', ' ')}
                  </span>
                  <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
                    Active
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {opp.location} ({opp.workMode})
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Deadline: {formatDate(opp.deadline)}
                  </span>
                  <span className="font-semibold text-gray-700">
                    {opp.stipend > 0 ? formatCurrency(opp.stipend) : 'Unpaid'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {opp.requiredSkills.map((rs) => (
                    <span
                      key={rs.skillId}
                      className="text-xs px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-full font-medium"
                    >
                      {SKILL_MAP[rs.skillId]?.name ?? rs.skillId} ({rs.requiredLevel}%)
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                <Link
                  href={`/industry/opportunities/${opp.id}/candidates`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors"
                >
                  <Users className="w-3.5 h-3.5" /> AI Candidates →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
