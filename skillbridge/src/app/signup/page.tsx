'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  GraduationCap,
  Building2,
  Layers,
  Users,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { setSession, type UserRole } from '@/lib/user-session';

const ROLES: {
  value: UserRole;
  label: string;
  badge: string;
  icon: React.ElementType;
  tagline: string;
  desc: string;
  gradient: string;
  selectedBorder: string;
  bgLight: string;
}[] = [
  {
    value: 'student',
    label: 'Student / Graduate',
    badge: '🎓 Candidate',
    icon: GraduationCap,
    tagline: 'Build verified skills & match with career opportunities',
    desc: 'Take adaptive diagnostic skill assessments, analyze target role deficits, and connect with top internship & placement drives.',
    gradient: 'from-[#4F46E5] to-[#7C3AED]',
    selectedBorder: 'border-[#4F46E5] bg-indigo-50/70 ring-2 ring-indigo-500/30',
    bgLight: 'bg-indigo-50 text-indigo-800 border border-indigo-200',
  },
  {
    value: 'industry',
    label: 'Industry / Recruiter',
    badge: '🏢 Employer',
    icon: Building2,
    tagline: 'Hire top talent ranked by proven competency',
    desc: 'Post job requirements, receive AI-ranked candidate compatibility breakdowns, and shortlist pre-screened campus talent.',
    gradient: 'from-blue-600 to-indigo-600',
    selectedBorder: 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/30',
    bgLight: 'bg-blue-50 text-blue-800 border border-blue-200',
  },
  {
    value: 'institution',
    label: 'College Dean / TPO Cell',
    badge: '🏫 Institution',
    icon: Layers,
    tagline: 'Track batch readiness & drive placement analytics',
    desc: 'Campus-wide skill heatmaps, NIRF placement metrics, and targeted curriculum intervention insights for leadership.',
    gradient: 'from-cyan-600 to-blue-600',
    selectedBorder: 'border-cyan-600 bg-cyan-50/70 ring-2 ring-cyan-500/30',
    bgLight: 'bg-cyan-50 text-cyan-800 border border-cyan-200',
  },
  {
    value: 'academician',
    label: 'Academician / Faculty',
    badge: '👨‍🏫 Educator',
    icon: Users,
    tagline: 'Find funded research grants & FDP programs',
    desc: 'Access Faculty Development Programs (FDPs), industry consultancies, and student mentorship projects seamlessly.',
    gradient: 'from-violet-600 to-indigo-600',
    selectedBorder: 'border-violet-600 bg-violet-50/70 ring-2 ring-violet-500/30',
    bgLight: 'bg-violet-50 text-violet-800 border border-violet-200',
  },
];

export default function RoleSelectionPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  const handleContinue = () => {
    setSession({ role: selectedRole, onboardingStep: 1 });
    router.push(`/onboarding/${selectedRole}`);
  };

  const activeRoleObj = ROLES.find((r) => r.value === selectedRole)!;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] via-[#EEF2FF] to-[#F8FAFC] flex flex-col justify-between font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-200/90 bg-white/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white font-black shadow-md shadow-indigo-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-slate-900 text-xl tracking-tight">
                Skill<span className="bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">Bridge</span>
              </span>
              <span className="text-[10px] block font-black text-[#4F46E5] uppercase tracking-widest -mt-1">
                AI Career Intelligence
              </span>
            </div>
          </Link>

          <Link
            href="/login"
            className="text-sm font-extrabold text-slate-700 hover:text-[#4F46E5] px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm transition-colors"
          >
            Already have an account? Sign In →
          </Link>
        </div>
      </header>

      {/* Main Role Selector Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-indigo-200 rounded-full text-indigo-900 text-xs font-black mb-4 shadow-sm">
              <Sparkles className="w-4 h-4 text-cyan-600" /> One Unified Platform
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-[#0F172A] tracking-tight">
              Welcome to SkillBridge
            </h1>
            <p className="text-slate-600 text-base sm:text-lg mt-3 max-w-2xl mx-auto font-medium">
              One platform connecting academia, students and industry. <br />
              <strong className="text-[#0F172A] font-extrabold">Who are you?</strong>
            </p>
          </div>

          {/* 4 Role Selection Cards */}
          <div className="grid sm:grid-cols-2 gap-5 mb-10">
            {ROLES.map((role) => {
              const isSelected = selectedRole === role.value;
              return (
                <div
                  key={role.value}
                  onClick={() => setSelectedRole(role.value)}
                  className={`bg-white rounded-3xl p-7 border-2 transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between ${
                    isSelected
                      ? role.selectedBorder
                      : 'border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${role.gradient} flex items-center justify-center text-white font-black shadow-md`}
                      >
                        <role.icon className="w-7 h-7" />
                      </div>
                      <span className={`text-xs font-black px-3 py-1 rounded-full ${role.bgLight}`}>
                        {role.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-[#0F172A]">{role.label}</h3>
                    <p className="text-sm font-extrabold text-[#4F46E5] mt-1">{role.tagline}</p>
                    <p className="text-sm text-slate-600 font-medium mt-2.5 leading-relaxed">{role.desc}</p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">
                      {isSelected ? '✓ Selected Role' : 'Click to Select'}
                    </span>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? 'border-[#4F46E5] bg-[#4F46E5] text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue CTA Button */}
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={handleContinue}
              className="w-full sm:w-auto min-w-[320px] py-4.5 px-9 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white font-black text-base rounded-2xl shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 bouncy-hover transition-all flex items-center justify-center gap-3"
            >
              Continue as {activeRoleObj.label.split(' / ')[0]} <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-xs font-semibold text-slate-400 text-center">
              Personalized onboarding tailored for {activeRoleObj.label}
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 py-4 bg-white text-center text-xs text-slate-500 font-semibold">
        SkillBridge · AI Skill Intelligence Platform
      </footer>
    </div>
  );
}
