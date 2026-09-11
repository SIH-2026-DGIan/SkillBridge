'use client';

import Link from 'next/link';
import { Microscope } from 'lucide-react';

const RESEARCH_PROJECTS = [
  {
    title: 'AI for Sustainable Agriculture',
    description: 'Collaborative project with industry partners focusing on edge AI for precision farming.',
    funding: '₹20L',
  },
  {
    title: 'Privacy-Preserving Machine Learning',
    description: 'Govt. funded research on federated learning for healthcare data.',
    funding: '₹25L',
  },
];

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <header className="mb-8 flex items-center gap-3">
        <Microscope className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold">Joint Research</h1>
      </header>
      <p className="mb-6 text-lg text-slate-700">
        Explore ongoing research collaborations, industry grants, and funding opportunities tailored to your interests.
      </p>
      <div className="grid gap-6 md:grid-cols-2">
        {RESEARCH_PROJECTS.map((proj, idx) => (
          <div key={idx} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="mb-2 text-xl font-semibold text-slate-800">{proj.title}</h2>
            <p className="mb-4 text-slate-600">{proj.description}</p>
            <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">Funding: {proj.funding}</span>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <Link href="/academician/dashboard" className="text-blue-600 hover:underline">
          ← Back to Faculty Hub
        </Link>
      </div>
    </div>
  );
}
