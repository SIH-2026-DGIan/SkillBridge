'use client';

import { BookOpen, Microscope, Users, ExternalLink, Calendar, MapPin } from 'lucide-react';

export default function AcademicianOpportunitiesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Faculty Opportunities</h1>
        <p className="text-gray-500 text-sm mt-0.5">Faculty Development Programs, consultancies, and workshops</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-3">AI &amp; Advanced Computing FDP Series</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          Government and industry-sponsored faculty upskilling cohorts with hands-on lab infrastructure and research grants.
        </p>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Next Batch: October 2026</span>
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> IIT Madras / Hybrid</span>
        </div>
      </div>
    </div>
  );
}
