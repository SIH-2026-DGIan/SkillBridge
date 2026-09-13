'use client';

import React, { useState } from 'react';
import { User, BookOpen, GraduationCap, Award, ExternalLink, Zap, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import type { FacultyOnboardingData } from '@/types/onboarding';

interface FacultyFormProps {
  initialData: Partial<FacultyOnboardingData>;
  onSubmit: (data: FacultyOnboardingData) => Promise<void>;
  loading: boolean;
}

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Artificial Intelligence & Data Science',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Management & Business Studies',
  'Applied Sciences & Humanities',
  'Other',
];

const DESIGNATIONS = [
  'Assistant Professor',
  'Associate Professor',
  'Professor',
  'Head of Department (HOD)',
  'Dean / Director',
  'Research Scholar / Mentor',
  'Adjunct Faculty',
];

export function FacultyForm({ initialData, onSubmit, loading }: FacultyFormProps) {
  const [formData, setFormData] = useState<FacultyOnboardingData>({
    fullName: initialData.fullName || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    profilePictureUrl: initialData.profilePictureUrl || '',
    institutionName: initialData.institutionName || '',
    department: initialData.department || 'Computer Science & Engineering',
    designation: initialData.designation || 'Associate Professor',
    researchAreas: initialData.researchAreas || ['Machine Learning', 'Data Mining'],
    scholarUrl: initialData.scholarUrl || '',
    yearsOfExperience: initialData.yearsOfExperience || 6,
  });

  const [researchInput, setResearchInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'yearsOfExperience' ? Number(value) || 0 : value,
    }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, profilePictureUrl: reader.result as string }));
      toast.success('Faculty profile picture updated!');
    };
    reader.readAsDataURL(file);
  };

  const handleAddResearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && researchInput.trim()) {
      e.preventDefault();
      const area = researchInput.trim();
      if (!formData.researchAreas.includes(area)) {
        setFormData((prev) => ({ ...prev, researchAreas: [...prev.researchAreas, area] }));
      }
      setResearchInput('');
    }
  };

  const handleRemoveResearch = (area: string) => {
    setFormData((prev) => ({
      ...prev,
      researchAreas: prev.researchAreas.filter((a) => a !== area),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      toast.error('Please enter your full faculty name');
      return;
    }
    if (!formData.institutionName.trim()) {
      toast.error('Please specify your institution or university name');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Please enter your institutional email');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ── 1. Faculty Profile Details ────────────────────────────── */}
      <section className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <User size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Profile Details</h2>
            <p className="text-xs text-slate-500">Your personal details and institutional contact information.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-200 rounded-lg text-center bg-slate-50/50">
            {formData.profilePictureUrl ? (
              <img
                src={formData.profilePictureUrl}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500 shadow-sm mb-3"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-bold mb-3">
                {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : 'F'}
              </div>
            )}
            <label className="cursor-pointer text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-2xs">
              Upload Photo
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
            <span className="text-[10px] text-slate-400 mt-1.5">PNG, JPG up to 2MB</span>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Prof. Ananya Roy, Ph.D."
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Institutional Email *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="prof.ananya@university.edu"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Direct Contact Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 94000 00000"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Academic Details ─────────────────────────────────────── */}
      <section className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <GraduationCap size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Academic Appointment</h2>
            <p className="text-xs text-slate-500">Department, designation, and university affiliation.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">Institution / University Name *</label>
            <input
              type="text"
              name="institutionName"
              required
              value={formData.institutionName}
              onChange={handleChange}
              placeholder="e.g. Indian Institute of Technology / Dronacharya Group"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Department / Discipline</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Designation</label>
            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              {DESIGNATIONS.map((des) => (
                <option key={des} value={des}>
                  {des}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Years of Teaching / Research Experience</label>
            <input
              type="number"
              name="yearsOfExperience"
              min={0}
              max={50}
              value={formData.yearsOfExperience}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>
        </div>
      </section>

      {/* ── 3. Research & Specialization Domain ──────────────────────── */}
      <section className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <BookOpen size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Research & Mentorship Domain</h2>
            <p className="text-xs text-slate-500">Research areas, publications profile, and thesis domains.</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Research Areas / Specializations</label>
          <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg min-h-[52px]">
            {formData.researchAreas.map((area) => (
              <span
                key={area}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-purple-900 shadow-2xs"
              >
                <Zap size={12} className="text-purple-500" />
                {area}
                <button
                  type="button"
                  onClick={() => handleRemoveResearch(area)}
                  className="text-slate-400 hover:text-red-500 text-xs ml-0.5"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={researchInput}
              onChange={(e) => setResearchInput(e.target.value)}
              onKeyDown={handleAddResearch}
              placeholder="Type research domain and press Enter (e.g. Distributed Computing, Computer Vision)"
              className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
            <button
              type="button"
              onClick={() => {
                if (researchInput.trim() && !formData.researchAreas.includes(researchInput.trim())) {
                  setFormData((prev) => ({ ...prev, researchAreas: [...prev.researchAreas, researchInput.trim()] }));
                  setResearchInput('');
                }
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md border border-slate-200"
            >
              Add
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Google Scholar / ORCID Profile URL (Optional)
          </label>
          <div className="relative">
            <input
              type="url"
              name="scholarUrl"
              value={formData.scholarUrl}
              onChange={handleChange}
              placeholder="https://scholar.google.com/citations?user=... or https://orcid.org/..."
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 pr-9"
            />
            <ExternalLink size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ── Submit Button ──────────────────────────────────────────── */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-purple-600 hover:bg-purple-700 active:scale-[0.99] text-white font-semibold rounded-xl text-sm shadow-md shadow-purple-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>Saving Faculty Profile…</span>
            </>
          ) : (
            <>
              <span>Complete Faculty Profile & Access Mentor Hub</span>
              <span aria-hidden="true">→</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
