'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Check,
  ArrowLeft,
  User,
  Building2,
  Briefcase,
  GraduationCap,
  UploadCloud,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { getSession, setSession, setStudentSkills } from '@/lib/user-session';
import { parseResumeText } from '@/lib/ai/resume-parser';
import { TARGET_ROLES } from '@/lib/skills-taxonomy';
import { toInternalUserRole, type OnboardingRole } from '@/types/onboarding';

const ROLE_HEADER_TITLES: Record<string, string> = {
  student: 'Complete Your Student Profile',
  tpo: 'Complete Institution & TPO Cell Profile',
  institution: 'Complete Institution & TPO Cell Profile',
  recruiter: 'Complete Industry & Recruiter Profile',
  industry: 'Complete Industry & Recruiter Profile',
  faculty: 'Complete Academician & Faculty Profile',
  academician: 'Complete Academician & Faculty Profile',
};

const ROLE_HEADER_SUBTITLES: Record<string, string> = {
  student: 'Provide your academic background, target roles, and upload your resume for AI skill telemetry.',
  tpo: 'Register your university/college placement cell, batch size, and institutional verification.',
  institution: 'Register your university/college placement cell, batch size, and institutional verification.',
  recruiter: 'Define your corporate profile, industry domain, and candidate roles you are hiring for.',
  industry: 'Define your corporate profile, industry domain, and candidate roles you are hiring for.',
  faculty: 'Connect your academic appointment, department, research domains, and mentorship profile.',
  academician: 'Connect your academic appointment, department, research domains, and mentorship profile.',
};

const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Delhi NCR', 'Gujarat', 'Haryana',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Punjab',
  'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal', 'Other',
];

const DOMAINS = [
  'Information Technology & Software',
  'Fintech & Banking',
  'EdTech & E-Learning',
  'Healthcare & HealthTech',
  'E-Commerce & Retail',
  'AI & Data Solutions',
  'Core Engineering & Manufacturing',
  'Consulting & Professional Services',
  'Other',
];

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication Engineering',
  'Artificial Intelligence & Data Science',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Management & Business Administration',
  'Applied Sciences & Humanities',
  'Other',
];

const COMMON_HIRING_ROLES = [
  'Full Stack Developer',
  'Frontend Engineer',
  'Backend Engineer',
  'AI / ML Specialist',
  'DevOps & Cloud Engineer',
  'Data Analyst',
  'UI/UX Designer',
  'QA / Software Tester',
  'Product Manager',
  'Business Development',
];

/* ──────────────────────────────────────────────────────────────────────────
   1. STUDENT SUB-FORM
   Render: Personal Details + Academic Background (College, Degree, Branch, CGPA)
           + Resume & Skills upload.
   ────────────────────────────────────────────────────────────────────────── */
interface StudentSubFormProps {
  fullName: string;
  setFullName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  avatarUrl: string;
  handleAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  college: string;
  setCollege: (v: string) => void;
  degree: string;
  setDegree: (v: string) => void;
  branch: string;
  setBranch: (v: string) => void;
  graduationYear: number;
  setGraduationYear: (v: number) => void;
  cgpa: string;
  setCgpa: (v: string) => void;
  resumeFileName: string;
  handleResumeUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isParsingResume: boolean;
  targetRole: string;
  setTargetRole: (v: string) => void;
  studentSkills: Record<string, number>;
  setStudentSkillsState: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  skillInput: string;
  setSkillInput: (v: string) => void;
  currentYear: number;
}

function StudentSubForm({
  fullName, setFullName,
  email, setEmail,
  phone, setPhone,
  avatarUrl, handleAvatarUpload,
  college, setCollege,
  degree, setDegree,
  branch, setBranch,
  graduationYear, setGraduationYear,
  cgpa, setCgpa,
  resumeFileName, handleResumeUpload,
  isParsingResume,
  targetRole, setTargetRole,
  studentSkills, setStudentSkillsState,
  skillInput, setSkillInput,
  currentYear,
}: StudentSubFormProps) {
  return (
    <div className="space-y-6">
      {/* ── Personal Details ── */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <User size={16} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Personal Details</h2>
            <p className="text-xs text-slate-500">Your contact information and identification.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="flex flex-col items-center justify-center p-3 border border-dashed border-slate-200 rounded-lg text-center bg-slate-50/50">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow-sm mb-2"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-lg font-bold mb-2">
                {fullName ? fullName.charAt(0).toUpperCase() : 'S'}
              </div>
            )}
            <label className="cursor-pointer text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-white px-2.5 py-1 rounded border border-slate-200 shadow-2xs">
              Upload Photo
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@domain.com"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Phone / Mobile</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Academic Background (College, Degree, Branch, CGPA) ── */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Building2 size={16} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Academic Background</h2>
            <p className="text-xs text-slate-500">College enrollment, degree, branch, and performance score.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">College / Institution Name *</label>
            <input
              type="text"
              required
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              placeholder="e.g. Dronacharya Group of Institutions"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Degree Program</label>
            <select
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
            <label className="block text-xs font-medium text-slate-700 mb-1">Branch / Specialization</label>
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="e.g. Computer Science, Information Technology"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Graduation Year</label>
            <select
              value={graduationYear}
              onChange={(e) => setGraduationYear(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {[currentYear, currentYear + 1, currentYear + 2, currentYear + 3, currentYear - 1].map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">CGPA / Percentage</label>
            <input
              type="text"
              value={cgpa}
              onChange={(e) => setCgpa(e.target.value)}
              placeholder="e.g. 8.4"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>

      {/* ── Resume & Skills Upload ── */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Sparkles size={16} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Resume & Skills Telemetry</h2>
            <p className="text-xs text-slate-500">AI auto-extracts your skills and matches verified opportunities.</p>
          </div>
        </div>

        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-emerald-950">Resume Upload & AI Parsing</p>
            <p className="text-[11px] text-emerald-700">
              {resumeFileName ? `Uploaded: ${resumeFileName}` : 'Upload PDF/TXT to auto-populate target role and top skills.'}
            </p>
          </div>
          <label className="cursor-pointer text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 rounded-lg flex items-center gap-1.5 shrink-0 transition-colors">
            <UploadCloud size={15} />
            {isParsingResume ? 'Parsing…' : resumeFileName ? 'Change Resume' : 'Upload Resume'}
            <input type="file" accept=".pdf,.txt" onChange={handleResumeUpload} className="hidden" disabled={isParsingResume} />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">Target Role</label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {TARGET_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Skills Cloud */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Top Verified Skills</label>
          <div className="flex flex-wrap gap-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-lg min-h-[48px]">
            {Object.keys(studentSkills).map((s) => (
              <span key={s} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-800 shadow-2xs">
                <Zap size={11} className="text-amber-500" />
                {s}
                <button
                  type="button"
                  onClick={() => {
                    const copy = { ...studentSkills };
                    delete copy[s];
                    setStudentSkillsState(copy);
                  }}
                  className="text-slate-400 hover:text-red-500 ml-1 text-xs"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && skillInput.trim()) {
                  e.preventDefault();
                  setStudentSkillsState((prev) => ({ ...prev, [skillInput.trim()]: 80 }));
                  setSkillInput('');
                }
              }}
              placeholder="Type a skill and press Enter (e.g. Next.js, Docker, SQL)"
              className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              type="button"
              onClick={() => {
                if (skillInput.trim()) {
                  setStudentSkillsState((prev) => ({ ...prev, [skillInput.trim()]: 80 }));
                  setSkillInput('');
                }
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md border border-slate-200 cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   2. TPO / INSTITUTION SUB-FORM
   Replaces "Academic Background" with:
     - Institution Name (College / University Name)
     - AISHE Code / College Affiliation Code
     - Placement Officer Designation (e.g. Head TPO, Placement Director)
     - Total Enrolled Students (Batch size)
     - Official Placement Cell Website / Domain
   Removes Student Resume; replaces with Institution Verification Document.
   ────────────────────────────────────────────────────────────────────────── */
interface TpoSubFormProps {
  fullName: string;
  setFullName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  institutionName: string;
  setInstitutionName: (v: string) => void;
  institutionCode: string;
  setInstitutionCode: (v: string) => void;
  tpoDesignation: string;
  setTpoDesignation: (v: string) => void;
  totalBatchSize: number;
  setTotalBatchSize: (v: number) => void;
  institutionWebsite: string;
  setInstitutionWebsite: (v: string) => void;
  tpoCity: string;
  setTpoCity: (v: string) => void;
  tpoState: string;
  setTpoState: (v: string) => void;
  verificationDocName: string;
  setVerificationDocName: (v: string) => void;
}

function TpoSubForm({
  fullName, setFullName,
  email, setEmail,
  phone, setPhone,
  institutionName, setInstitutionName,
  institutionCode, setInstitutionCode,
  tpoDesignation, setTpoDesignation,
  totalBatchSize, setTotalBatchSize,
  institutionWebsite, setInstitutionWebsite,
  tpoCity, setTpoCity,
  tpoState, setTpoState,
  verificationDocName, setVerificationDocName,
}: TpoSubFormProps) {
  return (
    <div className="space-y-6">
      {/* Placement Officer Details */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <User size={16} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Placement Officer / Coordinator Details</h2>
            <p className="text-xs text-slate-500">Official representative and liaison for the campus placement cell.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Dr. Priya Nair"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Official Placement Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="placements@institution.ac.in"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Phone / Mobile</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
            />
          </div>
        </div>
      </div>

      {/* Institution Details (Replacing Academic Background) */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Building2 size={16} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Institution & College Details</h2>
            <p className="text-xs text-slate-500">Accredited institution credentials, codes, and location.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">Institution Name (College / University Name) *</label>
            <input
              type="text"
              required
              value={institutionName}
              onChange={(e) => setInstitutionName(e.target.value)}
              placeholder="e.g. Dronacharya Group of Institutions"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">AISHE Code / College Affiliation Code *</label>
            <input
              type="text"
              required
              value={institutionCode}
              onChange={(e) => setInstitutionCode(e.target.value)}
              placeholder="e.g. C-45210 or 230"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Placement Officer Designation *</label>
            <input
              type="text"
              required
              value={tpoDesignation}
              onChange={(e) => setTpoDesignation(e.target.value)}
              placeholder="e.g. Head TPO, Placement Director"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Total Enrolled Students (Batch size)</label>
            <input
              type="number"
              value={totalBatchSize}
              onChange={(e) => setTotalBatchSize(Number(e.target.value) || 0)}
              placeholder="e.g. 450"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Official Placement Cell Website / Domain</label>
            <input
              type="url"
              value={institutionWebsite}
              onChange={(e) => setInstitutionWebsite(e.target.value)}
              placeholder="https://placements.institution.ac.in"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">City</label>
            <input
              type="text"
              value={tpoCity}
              onChange={(e) => setTpoCity(e.target.value)}
              placeholder="e.g. Greater Noida"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">State</label>
            <select
              value={tpoState}
              onChange={(e) => setTpoState(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Institution Verification Document (NO Student Resume) */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <ShieldCheck size={16} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Institution Verification Document</h2>
            <p className="text-xs text-slate-500">Official college authorization letter or AICTE/NAAC affiliation certificate.</p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-slate-900">Authorization Letter / Certificate</p>
            <p className="text-[11px] text-slate-500">
              {verificationDocName ? `Attached: ${verificationDocName}` : 'Upload TPO authorization letter on institutional letterhead (PDF/PNG).'}
            </p>
          </div>
          <label className="cursor-pointer text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 px-3.5 py-2 rounded-lg border border-slate-200 shadow-2xs flex items-center gap-1.5 shrink-0 transition-colors">
            <UploadCloud size={15} />
            {verificationDocName ? 'Change File' : 'Upload Verification Doc'}
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  setVerificationDocName(f.name);
                  toast.success('Verification document attached!');
                }
              }}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   3. RECRUITER SUB-FORM
   Replaces "Academic Background" with:
     - Company / Organization Name
     - Work / Corporate Domain (e.g., IT, Core Engineering, Finance)
     - HR / Recruiter Designation
     - Company Website & Headquarters
     - Target Hiring Positions (Roles to recruit for)
   Removes Student Resume upload.
   ────────────────────────────────────────────────────────────────────────── */
interface RecruiterSubFormProps {
  fullName: string;
  setFullName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  companyName: string;
  setCompanyName: (v: string) => void;
  recruiterDesignation: string;
  setRecruiterDesignation: (v: string) => void;
  industryDomain: string;
  setIndustryDomain: (v: string) => void;
  companyWebsite: string;
  setCompanyWebsite: (v: string) => void;
  companyHeadquarters: string;
  setCompanyHeadquarters: (v: string) => void;
  typicalRoles: string[];
  toggleRecruiterRole: (roleName: string) => void;
}

function RecruiterSubForm({
  fullName, setFullName,
  email, setEmail,
  phone, setPhone,
  companyName, setCompanyName,
  recruiterDesignation, setRecruiterDesignation,
  industryDomain, setIndustryDomain,
  companyWebsite, setCompanyWebsite,
  companyHeadquarters, setCompanyHeadquarters,
  typicalRoles, toggleRecruiterRole,
}: RecruiterSubFormProps) {
  return (
    <div className="space-y-6">
      {/* Recruiter Details */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <User size={16} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Recruiter Details</h2>
            <p className="text-xs text-slate-500">Corporate recruiter / talent acquisition partner profile.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Rajesh Kumar"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Corporate Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="recruiter@company.com"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Phone / Mobile</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>
        </div>
      </div>

      {/* Company Profile (Replacing Academic Background) */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Briefcase size={16} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Company Profile & Hiring Mandate</h2>
            <p className="text-xs text-slate-500">Corporate entity details, website, domain, and target roles.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Company / Organization Name *</label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Razorpay, Infosys, Zomato"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">HR / Recruiter Designation *</label>
            <input
              type="text"
              required
              value={recruiterDesignation}
              onChange={(e) => setRecruiterDesignation(e.target.value)}
              placeholder="e.g. Talent Acquisition Lead / HR Director"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Work / Corporate Domain</label>
            <select
              value={industryDomain}
              onChange={(e) => setIndustryDomain(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {DOMAINS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Company Website</label>
            <input
              type="url"
              value={companyWebsite}
              onChange={(e) => setCompanyWebsite(e.target.value)}
              placeholder="https://company.com"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">Company Website & Headquarters Location</label>
            <input
              type="text"
              value={companyHeadquarters}
              onChange={(e) => setCompanyHeadquarters(e.target.value)}
              placeholder="e.g. Bengaluru, Karnataka or Gurugram, Haryana"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Target Hiring Positions */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-2">Target Hiring Positions (Roles to recruit for)</label>
            <div className="flex flex-wrap gap-2">
              {COMMON_HIRING_ROLES.map((r) => {
                const sel = typicalRoles.includes(r);
                return (
                  <button
                    type="button"
                    key={r}
                    onClick={() => toggleRecruiterRole(r)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      sel
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {sel ? '✓ ' : '+ '}
                    {r}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   4. FACULTY SUB-FORM
   Replaces "Academic Background" with:
     - University / College Name
     - Department / Discipline (e.g. Computer Science, Mechanical)
     - Faculty Designation (Assistant Professor, Associate Professor, HOD)
     - Research Domains / Specialization
     - Google Scholar / ORCID Link (Optional)
   Removes Student Resume upload.
   ────────────────────────────────────────────────────────────────────────── */
interface FacultySubFormProps {
  fullName: string;
  setFullName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  avatarUrl: string;
  handleAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  facultyInstitution: string;
  setFacultyInstitution: (v: string) => void;
  facultyDepartment: string;
  setFacultyDepartment: (v: string) => void;
  facultyDesignation: string;
  setFacultyDesignation: (v: string) => void;
  yearsOfExperience: number;
  setYearsOfExperience: (v: number) => void;
  scholarUrl: string;
  setScholarUrl: (v: string) => void;
  researchAreas: string[];
  setResearchAreas: React.Dispatch<React.SetStateAction<string[]>>;
  researchInput: string;
  setResearchInput: (v: string) => void;
}

function FacultySubForm({
  fullName, setFullName,
  email, setEmail,
  phone, setPhone,
  avatarUrl, handleAvatarUpload,
  facultyInstitution, setFacultyInstitution,
  facultyDepartment, setFacultyDepartment,
  facultyDesignation, setFacultyDesignation,
  yearsOfExperience, setYearsOfExperience,
  scholarUrl, setScholarUrl,
  researchAreas, setResearchAreas,
  researchInput, setResearchInput,
}: FacultySubFormProps) {
  return (
    <div className="space-y-6">
      {/* Faculty Contact Details */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <User size={16} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Faculty Contact Details</h2>
            <p className="text-xs text-slate-500">Academician credentials and contact coordinates.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          <div className="flex flex-col items-center justify-center p-3 border border-dashed border-slate-200 rounded-lg text-center bg-slate-50/50">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover border-2 border-purple-500 shadow-sm mb-2"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-lg font-bold mb-2">
                {fullName ? fullName.charAt(0).toUpperCase() : 'F'}
              </div>
            )}
            <label className="cursor-pointer text-[11px] font-semibold text-purple-600 hover:text-purple-700 bg-white px-2.5 py-1 rounded border border-slate-200 shadow-2xs">
              Upload Photo
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Prof. Ananya Sharma"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Institutional Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="professor@university.edu"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Phone / Mobile</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Academic Details (Replacing Academic Background) */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <GraduationCap size={16} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Academic & Research Specialization</h2>
            <p className="text-xs text-slate-500">University appointment, department, and research domains.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">University / College Name *</label>
            <input
              type="text"
              required
              value={facultyInstitution}
              onChange={(e) => setFacultyInstitution(e.target.value)}
              placeholder="e.g. Dronacharya Group of Institutions / IIT Delhi"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Department / Discipline</label>
            <select
              value={facultyDepartment}
              onChange={(e) => setFacultyDepartment(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Faculty Designation</label>
            <select
              value={facultyDesignation}
              onChange={(e) => setFacultyDesignation(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            >
              <option>Assistant Professor</option>
              <option>Associate Professor</option>
              <option>Professor</option>
              <option>Head of Department (HOD)</option>
              <option>Research Scientist / Mentor</option>
              <option>Dean / Director</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Years of Teaching / Research Experience</label>
            <input
              type="number"
              min={0}
              max={50}
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Google Scholar / ORCID Link (Optional)</label>
            <div className="relative">
              <input
                type="url"
                value={scholarUrl}
                onChange={(e) => setScholarUrl(e.target.value)}
                placeholder="https://scholar.google.com/citations?user=..."
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 pr-8"
              />
              <ExternalLink size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Research Domains */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-700 mb-1">Research Domains / Specializations</label>
            <div className="flex flex-wrap gap-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-lg min-h-[44px]">
              {researchAreas.map((area) => (
                <span key={area} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-purple-900 shadow-2xs">
                  <Zap size={11} className="text-purple-500" />
                  {area}
                  <button
                    type="button"
                    onClick={() => setResearchAreas((prev) => prev.filter((a) => a !== area))}
                    className="text-slate-400 hover:text-red-500 ml-1 text-xs cursor-pointer"
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && researchInput.trim()) {
                    e.preventDefault();
                    if (!researchAreas.includes(researchInput.trim())) {
                      setResearchAreas((prev) => [...prev, researchInput.trim()]);
                    }
                    setResearchInput('');
                  }
                }}
                placeholder="Type research domain and press Enter"
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
              <button
                type="button"
                onClick={() => {
                  if (researchInput.trim() && !researchAreas.includes(researchInput.trim())) {
                    setResearchAreas((prev) => [...prev, researchInput.trim()]);
                    setResearchInput('');
                  }
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md border border-slate-200 cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   MAIN ONBOARDING COMPONENT
   ────────────────────────────────────────────────────────────────────────── */
function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile } = useAuth();
  const currentYear = new Date().getFullYear();

  // 1. State Connection: active state initialized from searchParams, fallback to 'student'
  const [selectedRole, setSelectedRole] = useState<string>(searchParams.get('role') || 'student');
  const [submitting, setSubmitting] = useState(false);

  // Sync state if searchParams.get('role') changes
  useEffect(() => {
    const roleInQuery = searchParams.get('role');
    if (roleInQuery && roleInQuery !== selectedRole) {
      setSelectedRole(roleInQuery);
    }
  }, [searchParams]);

  // ── Form States for Each Distinct Role ──────────────────────────────
  // Common details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // 1. Student Specific
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('B.Tech');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [graduationYear, setGraduationYear] = useState(currentYear + 1);
  const [cgpa, setCgpa] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack Engineer');
  const [studentSkills, setStudentSkillsState] = useState<Record<string, number>>({ React: 80, JavaScript: 85, Python: 75 });
  const [skillInput, setSkillInput] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [isParsingResume, setIsParsingResume] = useState(false);

  // 2. TPO Specific
  const [tpoDesignation, setTpoDesignation] = useState('Head - Training & Placement');
  const [institutionName, setInstitutionName] = useState('');
  const [institutionCode, setInstitutionCode] = useState('');
  const [tpoCity, setTpoCity] = useState('');
  const [tpoState, setTpoState] = useState('Delhi NCR');
  const [institutionWebsite, setInstitutionWebsite] = useState('');
  const [totalBatchSize, setTotalBatchSize] = useState(450);
  const [placementSeasonYear, setPlacementSeasonYear] = useState(`${currentYear}-${String(currentYear + 1).slice(2)}`);
  const [verificationDocName, setVerificationDocName] = useState('');

  // 3. Recruiter Specific
  const [recruiterDesignation, setRecruiterDesignation] = useState('Talent Acquisition Lead');
  const [companyName, setCompanyName] = useState('');
  const [industryDomain, setIndustryDomain] = useState('Information Technology & Software');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyHeadquarters, setCompanyHeadquarters] = useState('Bengaluru, Karnataka');
  const [typicalRoles, setTypicalRoles] = useState<string[]>(['Full Stack Developer', 'Frontend Engineer']);

  // 4. Faculty Specific
  const [facultyInstitution, setFacultyInstitution] = useState('');
  const [facultyDepartment, setFacultyDepartment] = useState('Computer Science & Engineering');
  const [facultyDesignation, setFacultyDesignation] = useState('Associate Professor');
  const [researchAreas, setResearchAreas] = useState<string[]>(['Distributed Systems', 'Machine Learning']);
  const [researchInput, setResearchInput] = useState('');
  const [scholarUrl, setScholarUrl] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState(7);

  // Sync initial user details when session / auth loads
  useEffect(() => {
    const s = getSession();
    const initialName = user?.user_metadata?.full_name || user?.user_metadata?.name || profile?.name || s.name || '';
    const initialEmail = user?.email || profile?.email || s.email || '';
    const initialPhone = s.phone || '';
    const initialAvatar = user?.user_metadata?.avatar_url || profile?.avatar_url || s.profilePictureUrl || '';

    if (initialName && !fullName) setFullName(initialName);
    if (initialEmail && !email) setEmail(initialEmail);
    if (initialPhone && !phone) setPhone(initialPhone);
    if (initialAvatar && !avatarUrl) setAvatarUrl(initialAvatar);

    if (s.college && !college) setCollege(s.college);
    if (s.company && !companyName) setCompanyName(s.company);
    if (s.institutionName) {
      if (!institutionName) setInstitutionName(s.institutionName);
      if (!facultyInstitution) setFacultyInstitution(s.institutionName);
    }
  }, [user, profile]);

  // Role Tab Switching Handler
  const handleRoleChange = (roleId: string) => {
    setSelectedRole(roleId);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `/onboarding?role=${roleId}`);
    }
  };

  // Avatar upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarUrl(reader.result as string);
      toast.success('Photo updated!');
    };
    reader.readAsDataURL(file);
  };

  // Resume upload
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingResume(true);
    setResumeFileName(file.name);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = (event.target?.result as string) || '';
        const parsed = await parseResumeText(text, file.name);

        if (parsed.candidateName && parsed.candidateName !== 'Candidate' && !fullName) {
          setFullName(parsed.candidateName);
        }
        if (parsed.targetRole) setTargetRole(parsed.targetRole);
        if (parsed.extractedSkills && Object.keys(parsed.extractedSkills).length > 0) {
          setStudentSkillsState((prev) => ({ ...prev, ...parsed.extractedSkills }));
        }
        toast.success(`Resume parsed! Added ${Object.keys(parsed.extractedSkills).length} verified skills.`);
      } catch (err) {
        toast.error('Could not auto-parse resume. You can input your details manually.');
      } finally {
        setIsParsingResume(false);
      }
    };
    reader.readAsText(file);
  };

  // Recruiter hiring roles toggle
  const toggleRecruiterRole = (rName: string) => {
    setTypicalRoles((prev) =>
      prev.includes(rName) ? prev.filter((r) => r !== rName) : [...prev, rName]
    );
  };

  // Header title & subtitle
  const headerTitle = ROLE_HEADER_TITLES[selectedRole] || 'Complete Your Student Profile';
  const headerSubtitle = ROLE_HEADER_SUBTITLES[selectedRole] || 'Provide your profile details and setup your account.';

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error('Please enter your full name.');
      return;
    }

    setSubmitting(true);
    try {
      const supabase = createClient();
      const currentSess = getSession();
      const userId = user?.id || currentSess.id || `user-${Date.now()}`;
      const canonicalRole: OnboardingRole =
        selectedRole === 'tpo' || selectedRole === 'institution'
          ? 'tpo'
          : selectedRole === 'recruiter' || selectedRole === 'industry'
            ? 'recruiter'
            : selectedRole === 'faculty' || selectedRole === 'academician'
              ? 'faculty'
              : 'student';

      const internalRole = toInternalUserRole(canonicalRole);

      // Base payload for profiles table
      const profilePayload: Record<string, any> = {
        id: userId,
        user_id: userId,
        name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        role: internalRole,
        avatar_url: avatarUrl || null,
        updated_at: new Date().toISOString(),
      };

      if (canonicalRole === 'student') {
        profilePayload.college = college.trim();
        profilePayload.degree = degree;
        profilePayload.branch = branch.trim();
        profilePayload.graduation_year = graduationYear;
        profilePayload.cgpa = cgpa ? Number(cgpa) || null : null;
        profilePayload.target_roles = [targetRole];

        setSession({
          name: fullName,
          email,
          phone,
          college,
          degree,
          branch,
          graduationYear,
          cgpa: cgpa ? Number(cgpa) : undefined,
          targetRole,
          profilePictureUrl: avatarUrl,
          role: 'student',
          isProfileComplete: true,
          onboardingStep: 4,
        });

        setStudentSkills(studentSkills);
      } else if (canonicalRole === 'tpo') {
        profilePayload.institution = institutionName.trim();
        profilePayload.location = tpoCity ? `${tpoCity}, ${tpoState}` : tpoState;
        profilePayload.website = institutionWebsite.trim();

        setSession({
          name: fullName,
          email,
          phone,
          institutionName,
          institutionCode,
          city: tpoCity,
          state: tpoState,
          website: institutionWebsite,
          totalBatchSize,
          academicYear: placementSeasonYear,
          role: 'institution',
          isProfileComplete: true,
          onboardingStep: 4,
        });
      } else if (canonicalRole === 'recruiter') {
        profilePayload.company = companyName.trim();
        profilePayload.location = companyHeadquarters.trim();
        profilePayload.website = companyWebsite.trim();

        setSession({
          name: fullName,
          email,
          phone,
          company: companyName,
          industryType: industryDomain,
          website: companyWebsite,
          role: 'industry',
          isProfileComplete: true,
          onboardingStep: 4,
        });
      } else if (canonicalRole === 'faculty') {
        profilePayload.institution = facultyInstitution.trim();
        profilePayload.bio = `${facultyDesignation}, ${facultyDepartment}`;
        profilePayload.target_roles = researchAreas;

        setSession({
          name: fullName,
          email,
          phone,
          institutionName: facultyInstitution,
          department: facultyDepartment,
          profilePictureUrl: avatarUrl,
          role: 'academician',
          isProfileComplete: true,
          onboardingStep: 4,
        });
      }

      // Upsert to profiles table in Supabase
      try {
        const { error } = await supabase.from('profiles').upsert(profilePayload, { onConflict: 'user_id' });
        if (error) {
          const { id: _, ...fallbackPayload } = profilePayload;
          await supabase.from('profiles').upsert(fallbackPayload, { onConflict: 'user_id' });
        }
      } catch (dbErr) {
        console.warn('Database upsert warning (stored in local session):', dbErr);
      }

      toast.success('Profile completed successfully! Opening dashboard…');

      const redirectUrl = `/dashboard/${canonicalRole}`;
      router.replace(redirectUrl);
    } catch (err: any) {
      console.error('Submission error:', err);
      const fallbackCanonical = selectedRole === 'institution' ? 'tpo' : selectedRole === 'industry' ? 'recruiter' : selectedRole === 'academician' ? 'faculty' : selectedRole;
      router.replace(`/dashboard/${fallbackCanonical}`);
    } finally {
      setSubmitting(false);
    }
  };

  const ROLE_BUTTONS = [
    { id: 'student', label: 'Student', icon: <User size={13} /> },
    { id: 'tpo', label: 'TPO / Institution', icon: <Building2 size={13} /> },
    { id: 'recruiter', label: 'Recruiter', icon: <Briefcase size={13} /> },
    { id: 'faculty', label: 'Faculty', icon: <GraduationCap size={13} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans antialiased">
      {/* ── Top Navigation Bar ───────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 px-6 h-16 flex items-center justify-between shadow-2xs">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/image.png" alt="SkillBridge" width={150} height={38} priority className="h-8 w-auto object-contain" />
        </Link>

        {/* Stepper Progress */}
        <nav aria-label="Onboarding Steps" className="hidden md:flex items-center gap-2 text-xs font-semibold">
          {[
            { num: '01', label: 'Role', done: true },
            { num: '02', label: 'Account', done: true },
            { num: '03', label: 'Verify', done: true },
            { num: '04', label: 'Profile Setup', active: true },
          ].map((s, idx) => (
            <React.Fragment key={s.num}>
              {idx > 0 && <span className="w-6 h-[1px] bg-slate-200" />}
              <div className={`flex items-center gap-1.5 ${s.active ? 'text-blue-600' : s.done ? 'text-emerald-600' : 'text-slate-400'}`}>
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    s.active
                      ? 'bg-blue-600 text-white'
                      : s.done
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'border border-slate-300 text-slate-400'
                  }`}
                >
                  {s.done ? <Check size={11} /> : s.num}
                </span>
                <span>{s.label}</span>
              </div>
            </React.Fragment>
          ))}
        </nav>

        <Link
          href="/"
          className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1"
        >
          <ArrowLeft size={14} /> Back to SkillBridge
        </Link>
      </header>

      {/* ── Main Container ───────────────────────────────────────────── */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-10">
        {/* Dynamic Header Titles Based on selectedRole */}
        <div className="mb-6 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
            <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-blue-100/80 text-blue-700">
              Step 04 / Profile Setup
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border bg-slate-100 text-slate-700 border-slate-300 uppercase">
              {selectedRole}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {headerTitle}
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            {headerSubtitle}
          </p>

          {/* Interactive Role Switcher Buttons */}
          <div className="mt-5 flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-slate-500 mr-1">Switch Role Setup:</span>
            {ROLE_BUTTONS.map((btn) => {
              const isActive =
                selectedRole === btn.id ||
                (btn.id === 'tpo' && selectedRole === 'institution') ||
                (btn.id === 'recruiter' && selectedRole === 'industry') ||
                (btn.id === 'faculty' && selectedRole === 'academician');

              return (
                <button
                  type="button"
                  key={btn.id}
                  onClick={() => handleRoleChange(btn.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {btn.icon}
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Form Body: Strict Switch / Conditional Block Rendering Sub-Forms ── */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {(() => {
            switch (selectedRole) {
              case 'tpo':
              case 'institution':
                return (
                  <TpoSubForm
                    fullName={fullName}
                    setFullName={setFullName}
                    email={email}
                    setEmail={setEmail}
                    phone={phone}
                    setPhone={setPhone}
                    institutionName={institutionName}
                    setInstitutionName={setInstitutionName}
                    institutionCode={institutionCode}
                    setInstitutionCode={setInstitutionCode}
                    tpoDesignation={tpoDesignation}
                    setTpoDesignation={setTpoDesignation}
                    totalBatchSize={totalBatchSize}
                    setTotalBatchSize={setTotalBatchSize}
                    institutionWebsite={institutionWebsite}
                    setInstitutionWebsite={setInstitutionWebsite}
                    tpoCity={tpoCity}
                    setTpoCity={setTpoCity}
                    tpoState={tpoState}
                    setTpoState={setTpoState}
                    verificationDocName={verificationDocName}
                    setVerificationDocName={setVerificationDocName}
                  />
                );

              case 'recruiter':
              case 'industry':
                return (
                  <RecruiterSubForm
                    fullName={fullName}
                    setFullName={setFullName}
                    email={email}
                    setEmail={setEmail}
                    phone={phone}
                    setPhone={setPhone}
                    companyName={companyName}
                    setCompanyName={setCompanyName}
                    recruiterDesignation={recruiterDesignation}
                    setRecruiterDesignation={setRecruiterDesignation}
                    industryDomain={industryDomain}
                    setIndustryDomain={setIndustryDomain}
                    companyWebsite={companyWebsite}
                    setCompanyWebsite={setCompanyWebsite}
                    companyHeadquarters={companyHeadquarters}
                    setCompanyHeadquarters={setCompanyHeadquarters}
                    typicalRoles={typicalRoles}
                    toggleRecruiterRole={toggleRecruiterRole}
                  />
                );

              case 'faculty':
              case 'academician':
                return (
                  <FacultySubForm
                    fullName={fullName}
                    setFullName={setFullName}
                    email={email}
                    setEmail={setEmail}
                    phone={phone}
                    setPhone={setPhone}
                    avatarUrl={avatarUrl}
                    handleAvatarUpload={handleAvatarUpload}
                    facultyInstitution={facultyInstitution}
                    setFacultyInstitution={setFacultyInstitution}
                    facultyDepartment={facultyDepartment}
                    setFacultyDepartment={setFacultyDepartment}
                    facultyDesignation={facultyDesignation}
                    setFacultyDesignation={setFacultyDesignation}
                    yearsOfExperience={yearsOfExperience}
                    setYearsOfExperience={setYearsOfExperience}
                    scholarUrl={scholarUrl}
                    setScholarUrl={setScholarUrl}
                    researchAreas={researchAreas}
                    setResearchAreas={setResearchAreas}
                    researchInput={researchInput}
                    setResearchInput={setResearchInput}
                  />
                );

              case 'student':
              default:
                return (
                  <StudentSubForm
                    fullName={fullName}
                    setFullName={setFullName}
                    email={email}
                    setEmail={setEmail}
                    phone={phone}
                    setPhone={setPhone}
                    avatarUrl={avatarUrl}
                    handleAvatarUpload={handleAvatarUpload}
                    college={college}
                    setCollege={setCollege}
                    degree={degree}
                    setDegree={setDegree}
                    branch={branch}
                    setBranch={setBranch}
                    graduationYear={graduationYear}
                    setGraduationYear={setGraduationYear}
                    cgpa={cgpa}
                    setCgpa={setCgpa}
                    resumeFileName={resumeFileName}
                    handleResumeUpload={handleResumeUpload}
                    isParsingResume={isParsingResume}
                    targetRole={targetRole}
                    setTargetRole={setTargetRole}
                    studentSkills={studentSkills}
                    setStudentSkillsState={setStudentSkillsState}
                    skillInput={skillInput}
                    setSkillInput={setSkillInput}
                    currentYear={currentYear}
                  />
                );
            }
          })()}

          {/* ── SUBMIT BUTTON ── */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold rounded-xl text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Saving {selectedRole.toUpperCase()} Profile…</span>
                </>
              ) : (
                <>
                  <span>
                    Complete Setup & Enter{' '}
                    {selectedRole === 'tpo' || selectedRole === 'institution'
                      ? 'TPO'
                      : selectedRole === 'recruiter' || selectedRole === 'industry'
                        ? 'Recruiter'
                        : selectedRole === 'faculty' || selectedRole === 'academician'
                          ? 'Faculty'
                          : 'Student'}{' '}
                    Dashboard
                  </span>
                  <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-slate-200/80 py-4 px-6 text-center text-xs text-slate-400 mt-12">
        <span>© 2026 SkillBridge — National Education & Career Telemetry Platform</span>
      </footer>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-slate-500 font-sans">Loading profile setup…</div>}>
      <OnboardingContent />
    </Suspense>
  );
}
