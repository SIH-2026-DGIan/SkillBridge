'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Users, CheckCircle, Clock, Award, ArrowRight } from 'lucide-react';
import { DEMO_OPPORTUNITIES } from '@/lib/demo-data';

export default function IndustryApplicationsPage() {
  const [filter, setFilter] = useState<'all' | 'applied' | 'shortlisted'>('all');

  const incomingApps = [
    {
      id: 'app-101',
      studentName: 'Tanushri Sharma',
      role: 'Machine Learning Intern',
      college: 'IIT Bombay',
      branch: 'Computer Science',
      matchScore: 92,
      appliedAt: '2026-08-01',
      status: 'shortlisted',
    },
    {
      id: 'app-102',
      studentName: 'Arjun Patel',
      role: 'Machine Learning Intern',
      college: 'BITS Pilani',
      branch: 'Computer Science',
      matchScore: 84,
      appliedAt: '2026-08-03',
      status: 'applied',
    },
    {
      id: 'app-103',
      studentName: 'Priya Krishnan',
      role: 'Data Analyst Intern',
      college: 'NIT Trichy',
      branch: 'Information Technology',
      matchScore: 81,
      appliedAt: '2026-08-05',
      status: 'applied',
    },
    {
      id: 'app-104',
      studentName: 'Sneha Reddy',
      role: 'Machine Learning Intern',
      college: 'IIIT Hyderabad',
      branch: 'Computer Science',
      matchScore: 95,
      appliedAt: '2026-08-06',
      status: 'shortlisted',
    },
  ];

  const filtered = filter === 'all' ? incomingApps : incomingApps.filter((a) => a.status === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Received Applications</h1>
        <p className="text-gray-500 text-sm mt-0.5">Review and manage student applications for TechNova</p>
      </div>

      <div className="flex gap-2">
        {(['all', 'applied', 'shortlisted'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all ${
              filter === tab
                ? 'bg-purple-600 text-white border-purple-600'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            {tab === 'all' ? `All Applications (${incomingApps.length})` : tab === 'applied' ? 'Pending Review (2)' : 'Shortlisted (2)'}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((app) => (
          <div
            key={app.id}
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center justify-between gap-4 flex-wrap"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                {app.studentName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900 text-base">{app.studentName}</h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    app.status === 'shortlisted' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {app.status === 'shortlisted' ? '✓ Shortlisted' : 'Under Review'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Applied for: <span className="font-semibold text-gray-700">{app.role}</span> · {app.college} ({app.branch})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-lg font-extrabold text-green-600">{app.matchScore}%</div>
                <div className="text-xs text-gray-400">Match Score</div>
              </div>
              <Link
                href={`/industry/opportunities/opp-1/candidates`}
                className="px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg border border-purple-200 hover:bg-purple-100"
              >
                View Profile →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
