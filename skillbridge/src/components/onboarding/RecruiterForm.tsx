'use client';

import React, { useState } from 'react';
import { Briefcase, Building2, User, Globe, Target, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import type { RecruiterOnboardingData } from '@/types/onboarding';

interface RecruiterFormProps {
  initialData: Partial<RecruiterOnboardingData>;
  onSubmit: (data: RecruiterOnboardingData) => Promise<void>;
  loading: boolean;
}

const DOMAINS = [
  'Information Technology & Software',
  'Fintech & Banking',
  'EdTech & E-Learning',
  'Healthcare & HealthTech',
  'E-Commerce & Retail',
  'AI & Data Solutions',
  'Consulting & Services',
  'Manufacturing & Core Engineering',
  'Other',
];

const COMPANY_SIZES = [
  'Startup (1 - 20 employees)',
  'Small (21 - 100 employees)',
  'Mid-Size (101 - 500 employees)',
  'Large Enterprise (500+ employees)',
];

const COMMON_ROLES = [
  'Full Stack Developer',
  'Frontend Engineer',
  'Backend Engineer',
  'AI / ML Specialist',
  'DevOps & Cloud Engineer',
  'Data Analyst',
  'UI/UX Designer',
  'Product Specialist',
  'QA / Test Engineer',
  'Business Development',
];

const WORK_MODES = ['In-Office / Onsite', 'Hybrid', 'Fully Remote'];

export function RecruiterForm({ initialData, onSubmit, loading }: RecruiterFormProps) {
  const [formData, setFormData] = useState<RecruiterOnboardingData>({
    fullName: initialData.fullName || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    designation: initialData.designation || 'Talent Acquisition Lead',
    companyName: initialData.companyName || '',
    industryDomain: initialData.industryDomain || 'Information Technology & Software',
    companyWebsite: initialData.companyWebsite || '',
    companySize: initialData.companySize || 'Mid-Size (101 - 500 employees)',
    typicalRoles: initialData.typicalRoles || ['Full Stack Developer', 'Frontend Engineer'],
    workModes: initialData.workModes || ['Hybrid'],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleRole = (roleName: string) => {
    setFormData((prev) => {
      const exists = prev.typicalRoles.includes(roleName);
      return {
        ...prev,
        typicalRoles: exists ? prev.typicalRoles.filter((r) => r !== roleName) : [...prev.typicalRoles, roleName],
      };
    });
  };

  const toggleWorkMode = (mode: string) => {
    setFormData((prev) => {
      const exists = prev.workModes.includes(mode);
      return {
        ...prev,
        workModes: exists ? prev.workModes.filter((m) => m !== mode) : [...prev.workModes, mode],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!formData.companyName.trim()) {
      toast.error('Please enter your company or organization name');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Please enter your corporate email address');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ── 1. Recruiter Professional Details ─────────────────────── */}
      <section className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <User size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Professional Details</h2>
            <p className="text-xs text-slate-500">Your corporate identity and talent acquisition credentials.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Priya Nair"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Designation *</label>
            <input
              type="text"
              name="designation"
              required
              value={formData.designation}
              onChange={handleChange}
              placeholder="e.g. Lead Technical Recruiter / HRBP"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Corporate Email Address *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="priya@company.com"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Work Phone / Mobile</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 99990 00000"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>
        </div>
      </section>

      {/* ── 2. Company Profile ─────────────────────────────────────── */}
      <section className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Building2 size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Company Profile</h2>
            <p className="text-xs text-slate-500">Organization domain, scale, and online headquarters.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Company / Organization Name *</label>
            <input
              type="text"
              name="companyName"
              required
              value={formData.companyName}
              onChange={handleChange}
              placeholder="e.g. Razorpay, Infosys, Zomato"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Industry Domain</label>
            <select
              name="industryDomain"
              value={formData.industryDomain}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              {DOMAINS.map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Company Website</label>
            <input
              type="url"
              name="companyWebsite"
              value={formData.companyWebsite}
              onChange={handleChange}
              placeholder="https://company.com"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Company Size</label>
            <select
              name="companySize"
              value={formData.companySize}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              {COMPANY_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* ── 3. Hiring Intent & Preferences ──────────────────────────── */}
      <section className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Target size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Hiring Intent & Open Roles</h2>
            <p className="text-xs text-slate-500">Candidate profiles and work modes your team hires for.</p>
          </div>
        </div>

        {/* Roles multi-select pills */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-2">Typical Roles You Hire For</label>
          <div className="flex flex-wrap gap-2">
            {COMMON_ROLES.map((role) => {
              const selected = formData.typicalRoles.includes(role);
              return (
                <button
                  type="button"
                  key={role}
                  onClick={() => toggleRole(role)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                    selected
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs font-semibold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {selected && <CheckCircle2 size={13} className="text-emerald-600" />}
                  {role}
                </button>
              );
            })}
          </div>
        </div>

        {/* Work mode options */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-2">Work Modes Supported</label>
          <div className="flex flex-wrap gap-2">
            {WORK_MODES.map((mode) => {
              const selected = formData.workModes.includes(mode);
              return (
                <button
                  type="button"
                  key={mode}
                  onClick={() => toggleWorkMode(mode)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                    selected
                      ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-2xs font-semibold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {selected && <CheckCircle2 size={13} className="text-blue-600" />}
                  {mode}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Submit Button ──────────────────────────────────────────── */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>Saving Recruiter Profile…</span>
            </>
          ) : (
            <>
              <span>Complete Company Onboarding & Start Hiring</span>
              <span aria-hidden="true">→</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
