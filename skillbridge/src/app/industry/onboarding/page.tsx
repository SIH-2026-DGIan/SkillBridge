'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, setSession } from '@/lib/user-session';

const SECTORS = [
  'IT / Software',
  'Finance & Banking',
  'Manufacturing',
  'Healthcare',
  'E-commerce',
  'EdTech',
  'Consulting',
  'Other',
];

const SIZES = ['1-10', '11-50', '51-200', '201-1000', '1000+'];

export default function IndustryOnboardingPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const existing = getSession();

  const [form, setForm] = useState({
    company: existing.company || '',
    industryType: existing.industryType || SECTORS[0],
    companySize: existing.companySize || SIZES[0],
    location: existing.location || '',
  });

  const update = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setError('');
  };

  const handleSubmit = () => {
    if (!form.company.trim()) {
      setError('Company name is required');
      return;
    }

    setSaving(true);

    setSession({
      company: form.company.trim(),
      industryType: form.industryType,
      companySize: form.companySize,
      location: form.location.trim(),
      isProfileComplete: true,
    });

    router.push('/industry/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-xl space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Tell us about your company
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            This helps students and institutions know who you are before you
            post opportunities.
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4">

          {/* Company Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Company Name *
            </label>

            <input
              value={form.company}
              onChange={(e) => update('company', e.target.value)}
              placeholder="e.g. TechNova Solutions"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Industry + Company Size */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Industry Sector
              </label>

              <select
                value={form.industryType}
                onChange={(e) => update('industryType', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {SECTORS.map((sector) => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Company Size
              </label>

              <select
                value={form.companySize}
                onChange={(e) => update('companySize', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size} employees
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Location */}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Location
            </label>

            <input
              value={form.location}
              onChange={(e) => update('location', e.target.value)}
              placeholder="e.g. Bengaluru, India"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Continue to Dashboard'}
        </button>

      </div>
    </div>
  );
}
