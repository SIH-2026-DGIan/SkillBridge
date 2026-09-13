'use client';

import React, { useState } from 'react';
import { Building2, User, FileText, CheckCircle2, UploadCloud, ShieldCheck, MapPin, Globe } from 'lucide-react';
import { toast } from 'sonner';
import type { TpoOnboardingData } from '@/types/onboarding';

interface TpoFormProps {
  initialData: Partial<TpoOnboardingData>;
  onSubmit: (data: TpoOnboardingData) => Promise<void>;
  loading: boolean;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Delhi NCR', 'Gujarat', 'Haryana',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Punjab',
  'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal', 'Other'
];

export function TpoForm({ initialData, onSubmit, loading }: TpoFormProps) {
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState<TpoOnboardingData>({
    fullName: initialData.fullName || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    designation: initialData.designation || 'Head - Training & Placement',
    institutionName: initialData.institutionName || '',
    institutionCode: initialData.institutionCode || '',
    city: initialData.city || '',
    state: initialData.state || 'Delhi NCR',
    website: initialData.website || '',
    totalBatchSize: initialData.totalBatchSize || 450,
    placementSeasonYear: initialData.placementSeasonYear || `${currentYear}-${String(currentYear + 1).slice(2)}`,
    verificationDocName: initialData.verificationDocName || '',
    verificationDocUrl: initialData.verificationDocUrl || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'totalBatchSize' ? Number(value) || 0 : value,
    }));
  };

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      verificationDocName: file.name,
      verificationDocUrl: URL.createObjectURL(file),
    }));
    toast.success('Verification authorization letter attached!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      toast.error('Please enter official coordinator name');
      return;
    }
    if (!formData.institutionName.trim()) {
      toast.error('Please enter your institution name');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Please enter official placement email');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ── 1. Official Coordinator Details ───────────────────────── */}
      <section className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <User size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Personal & Official Details</h2>
            <p className="text-xs text-slate-500">Contact information of the primary Placement Officer / TPO Head.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Full Name (TPO / Coordinator) *</label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Dr. Rajesh Sharma"
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
              placeholder="e.g. Head - TPO / Placement Director"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Official Placement Email *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="tpo@institution.ac.in"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Official Mobile / Direct Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98110 00000"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>
        </div>
      </section>

      {/* ── 2. Institution Details ─────────────────────────────────── */}
      <section className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Building2 size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Institution & College Details</h2>
            <p className="text-xs text-slate-500">Accreditation and institutional identification information.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">Institution Name *</label>
            <input
              type="text"
              name="institutionName"
              required
              value={formData.institutionName}
              onChange={handleChange}
              placeholder="e.g. Dronacharya Group of Institutions"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Institution Code / AISHE Code</label>
            <input
              type="text"
              name="institutionCode"
              value={formData.institutionCode}
              onChange={handleChange}
              placeholder="e.g. C-45210 or 230"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Official Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://www.institution.ac.in"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">City / Location</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. Greater Noida"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">State / Province</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* ── 3. Placement Cell Info ─────────────────────────────────── */}
      <section className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <FileText size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Placement Cell & Batch Information</h2>
            <p className="text-xs text-slate-500">Information about eligible cohorts and institutional verification letter.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Total Enrolled Eligible Students (Batch Size)</label>
            <input
              type="number"
              name="totalBatchSize"
              value={formData.totalBatchSize}
              onChange={handleChange}
              placeholder="e.g. 450"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Current Placement Season Year</label>
            <select
              name="placementSeasonYear"
              value={formData.placementSeasonYear}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              {[`${currentYear}-${String(currentYear + 1).slice(2)}`, `${currentYear + 1}-${String(currentYear + 2).slice(2)}`, `${currentYear - 1}-${String(currentYear).slice(2)}`].map((yr) => (
                <option key={yr} value={yr}>
                  Academic Year {yr}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Verification letter upload */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">Official Verification Authorization Letter (Optional)</p>
              <p className="text-[11px] text-slate-500">
                {formData.verificationDocName
                  ? `Uploaded: ${formData.verificationDocName}`
                  : 'Attach college letterhead authorization or AICTE accreditation letter for fast-track badge.'}
              </p>
            </div>
          </div>
          <label className="cursor-pointer shrink-0 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 px-3.5 py-2 rounded-lg border border-slate-200 shadow-2xs flex items-center gap-1.5 transition-colors">
            <UploadCloud size={16} />
            {formData.verificationDocName ? 'Change Document' : 'Upload Document'}
            <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleDocUpload} className="hidden" />
          </label>
        </div>
      </section>

      {/* ── Submit Button ──────────────────────────────────────────── */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>Saving TPO Profile…</span>
            </>
          ) : (
            <>
              <span>Complete Institution Setup & Open Portal</span>
              <span aria-hidden="true">→</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
