'use client';

import Link from 'next/link';
import { Users, ArrowRight, Zap, Briefcase } from 'lucide-react';
import { DEMO_OPPORTUNITIES } from '@/lib/demo-data';

export default function CandidatesHubPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Candidate Pipeline</h1>
        <p className="text-gray-500 text-sm mt-0.5">Select an opportunity to view AI-ranked talent</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {DEMO_OPPORTUNITIES.map((opp) => (
          <Link
            key={opp.id}
            href={`/industry/opportunities/${opp.id}/candidates`}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-purple-200 transition-all block group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-colors">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-base">{opp.title}</h2>
                  <p className="text-xs text-gray-500">{opp.company} · {opp.location}</p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                <Zap className="w-3 h-3" /> Ranked
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500">5+ Evaluated Candidates</span>
              <span className="font-semibold text-purple-600 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                View Ranked List <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
