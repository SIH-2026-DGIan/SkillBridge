'use client';

import { Users, Search, GraduationCap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function InstitutionStudentsPage() {
  const students = [
    { name: 'Tanushri Sharma', degree: 'B.Tech CSE', batch: 2026, score: 74, status: 'Placement Ready', target: 'Machine Learning Engineer' },
    { name: 'Arjun Patel', degree: 'B.Tech CSE', batch: 2026, score: 71, status: 'Placement Ready', target: 'Machine Learning Engineer' },
    { name: 'Priya Krishnan', degree: 'B.Tech IT', batch: 2026, score: 70, status: 'Placement Ready', target: 'Data Analyst' },
    { name: 'Rahul Singh', degree: 'B.Tech ECE', batch: 2026, score: 58, status: 'Needs Upskilling', target: 'Software Developer' },
    { name: 'Sneha Reddy', degree: 'B.Tech CSE', batch: 2025, score: 86, status: 'Highly Competitive', target: 'Machine Learning Engineer' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Student Directory &amp; Readiness</h1>
        <p className="text-gray-500 text-sm mt-0.5">Track individual student skill readiness and career targets</p>
      </div>

      <div className="space-y-3">
        {students.map((s) => (
          <div key={s.name} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center font-bold text-teal-700 text-sm">
                {s.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">{s.name}</h3>
                <p className="text-xs text-gray-500">{s.degree} · Class of {s.batch} · Target: {s.target}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-extrabold text-teal-700">{s.score}% Readiness</div>
                <div className="text-xs text-gray-400">{s.status}</div>
              </div>
              <Link href="/portfolio/tanushri-sharma" className="text-xs font-semibold text-teal-600 hover:underline">
                View Portfolio →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
