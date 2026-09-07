'use client';

import { TrendingUp, Award, Building2, CheckCircle } from 'lucide-react';
import { DEMO_COMPANIES } from '@/lib/demo-data';

export default function InstitutionPlacementsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Placement &amp; Internship Records</h1>
        <p className="text-gray-500 text-sm mt-0.5">Corporate partner hiring outcomes and stipend metrics</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Avg. Internship Stipend', value: '₹24,500/mo' },
          { label: 'Highest Package', value: '₹18.5 LPA' },
          { label: 'Partner Companies', value: '8 active' },
          { label: 'Conversion Rate', value: '68%' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="text-xl font-extrabold text-teal-700">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-4">Active Corporate Hiring Partners</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {DEMO_COMPANIES.map((c) => (
            <div key={c.id} className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-gray-900">{c.name}</h3>
                <p className="text-xs text-gray-500">{c.sector} · {c.location}</p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                Active Partner
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
