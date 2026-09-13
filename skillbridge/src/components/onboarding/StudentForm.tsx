'use client';

import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, User, Building2, Target, Briefcase, Zap, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { parseResumeText } from '@/lib/ai/resume-parser';
import { TARGET_ROLES } from '@/lib/skills-taxonomy';
import type { StudentOnboardingData } from '@/types/onboarding';

interface StudentFormProps {
  initialData: Partial<StudentOnboardingData>;
  onSubmit: (data: StudentOnboardingData) => Promise<void>;
  loading: boolean;
}

export function StudentForm({ initialData, onSubmit, loading }: StudentFormProps) {
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState<StudentOnboardingData>({
    fullName: initialData.fullName || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    profilePictureUrl: initialData.profilePictureUrl || '',
    college: initialData.college || '',
    degree: initialData.degree || 'B.Tech',
    branch: initialData.branch || 'Computer Science & Engineering',
    graduationYear: initialData.graduationYear || currentYear + 1,
    cgpa: initialData.cgpa || '',
    targetRole: initialData.targetRole || 'Full Stack Engineer',
    experienceLevel: initialData.experienceLevel || 'Entry Level / Fresher',
    skills: initialData.skills || {},
    resumeText: initialData.resumeText || '',
    resumeFileName: initialData.resumeFileName || '',
  });

  const [isParsing, setIsParsing] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, profilePictureUrl: reader.result as string }));
      toast.success('Profile picture updated!');
    };
    reader.readAsDataURL(file);
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    setFormData((prev) => ({ ...prev, resumeFileName: file.name }));

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = (event.target?.result as string) || '';
        const parsed = await parseResumeText(text, file.name);

        setFormData((prev) => ({
          ...prev,
          fullName: prev.fullName || (parsed.candidateName !== 'Candidate' ? parsed.candidateName : ''),
          targetRole: parsed.targetRole || prev.targetRole,
          experienceLevel: parsed.experienceLevel || prev.experienceLevel,
          skills: { ...prev.skills, ...parsed.extractedSkills },
          resumeText: text,
        }));
        toast.success(`Resume parsed! Discovered ${Object.keys(parsed.extractedSkills).length} verified skills.`);
      } catch (err) {
        toast.error('Could not parse resume text automatically. You can fill details manually.');
      } finally {
        setIsParsing(false);
      }
    };
    reader.readAsText(file);
  };

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      const s = skillInput.trim();
      setFormData((prev) => ({
        ...prev,
        skills: { ...prev.skills, [s]: 80 },
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillName: string) => {
    setFormData((prev) => {
      const nextSkills = { ...prev.skills };
      delete nextSkills[skillName];
      return { ...prev, skills: nextSkills };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!formData.college.trim()) {
      toast.error('Please specify your college or institution');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ── 1. Personal Details ────────────────────────────────────── */}
      <section className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <User size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Personal Details</h2>
            <p className="text-xs text-slate-500">Your basic contact information and profile avatar.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {/* Avatar upload */}
          <div className="flex flex-col items-center justify-center p-4 border border-dashed border-slate-200 rounded-lg text-center bg-slate-50/50">
            {formData.profilePictureUrl ? (
              <img
                src={formData.profilePictureUrl}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-blue-500 shadow-sm mb-3"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold mb-3">
                {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : 'S'}
              </div>
            )}
            <label className="cursor-pointer text-xs font-semibold text-blue-600 hover:text-blue-700 bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-2xs">
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
                placeholder="e.g. Arav Gupta"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@college.edu"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Academic Background ─────────────────────────────────── */}
      <section className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Building2 size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Academic Background</h2>
            <p className="text-xs text-slate-500">Your college, degree, and current education status.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">College / University Name *</label>
            <input
              type="text"
              name="college"
              required
              value={formData.college}
              onChange={handleChange}
              placeholder="e.g. Dronacharya Group of Institutions"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Degree Program</label>
            <select
              name="degree"
              value={formData.degree}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option>B.Tech / B.E.</option>
              <option>BCA / MCA</option>
              <option>B.Sc / M.Sc</option>
              <option>M.Tech</option>
              <option>MBA</option>
              <option>Diploma</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Branch / Major</label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              placeholder="e.g. Computer Science, IT, ECE"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Graduation Year</label>
            <select
              name="graduationYear"
              value={formData.graduationYear}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              {[currentYear, currentYear + 1, currentYear + 2, currentYear + 3, currentYear - 1, currentYear - 2].map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Current CGPA / Percentage</label>
            <input
              type="text"
              name="cgpa"
              value={formData.cgpa}
              onChange={handleChange}
              placeholder="e.g. 8.5 or 85%"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>
        </div>
      </section>

      {/* ── 3. Career & Skills Assets ───────────────────────────────── */}
      <section className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Target size={18} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">Career Goals & Skills Telemetry</h2>
            <p className="text-xs text-slate-500">Upload your resume for AI auto-extraction, or customize your top skills.</p>
          </div>
        </div>

        {/* Resume upload banner */}
        <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-950">AI Resume Auto-Extraction</p>
              <p className="text-[11px] text-emerald-700">
                {formData.resumeFileName
                  ? `Uploaded: ${formData.resumeFileName}`
                  : 'Upload resume (PDF/TXT) to instantly auto-populate your skills and target role.'}
              </p>
            </div>
          </div>
          <label className="cursor-pointer shrink-0 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors">
            <UploadCloud size={16} />
            {isParsing ? 'Parsing Resume…' : formData.resumeFileName ? 'Change Resume' : 'Upload Resume'}
            <input type="file" accept=".pdf,.txt,.doc,.docx" onChange={handleResumeUpload} className="hidden" disabled={isParsing} />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Target Career Role *</label>
            <select
              name="targetRole"
              value={formData.targetRole}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              {TARGET_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Experience Level</label>
            <select
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option>Entry Level / Fresher</option>
              <option>Intern / Final Year</option>
              <option>1-2 Years Experience</option>
            </select>
          </div>
        </div>

        {/* Skills Tag Cloud */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Top Verified Skills</label>
          <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg min-h-[52px]">
            {Object.keys(formData.skills).length > 0 ? (
              Object.entries(formData.skills).map(([skill, prof]) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-800 shadow-2xs"
                >
                  <Zap size={12} className="text-amber-500" />
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-red-500 text-xs ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 self-center">No skills added yet. Add below or parse from resume.</span>
            )}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
              placeholder="Type a skill and press Enter (e.g. React, Python, SQL)"
              className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              type="button"
              onClick={() => {
                if (skillInput.trim()) {
                  setFormData((prev) => ({ ...prev, skills: { ...prev.skills, [skillInput.trim()]: 80 } }));
                  setSkillInput('');
                }
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md border border-slate-200"
            >
              Add
            </button>
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
              <span>Saving Student Profile…</span>
            </>
          ) : (
            <>
              <span>Complete Setup & Enter Dashboard</span>
              <span aria-hidden="true">→</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
