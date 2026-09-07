'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Building2,
  BookOpen,
  Users,
  Target,
  Brain,
  CheckCircle2,
  Zap,
  Sparkles,
  Layers,
  ArrowRight,
  Briefcase,
  ShieldCheck,
  Award,
} from 'lucide-react';

const STAKEHOLDERS = [
  {
    id: 'student',
    role: 'Student & Graduate',
    icon: GraduationCap,
    tagline: 'Discover verified skill gaps & unlock AI-matched career opportunities',
    color: 'from-indigo-600 to-violet-600',
    border: 'border-indigo-100',
    steps: [
      'Adaptive Diagnostic Skill Assessment',
      'Target Role Gap Benchmark Heatmap',
      'Curated Modular Learning Roadmaps',
      'Deterministic AI Opportunity Matching',
      'Shareable Verified Digital Portfolio',
    ],
    link: '/signup',
    cta: 'Start as Student',
  },
  {
    id: 'industry',
    role: 'Industry & Recruiter',
    icon: Building2,
    tagline: 'Hire talent ranked by proven competency, not just inflated resumes',
    color: 'from-blue-600 to-indigo-600',
    border: 'border-blue-100',
    steps: [
      'Post Internships, Jobs & Capstone RFPs',
      'Deterministic Multi-Factor Compatibility Engine',
      'Rank-Ordered Candidate Leaderboards',
      '1-Click Shortlist to Interview Pipeline',
      'Campus-Wide Placement Drive Coordination',
    ],
    link: '/signup',
    cta: 'Hire as Industry',
  },
  {
    id: 'institution',
    role: 'Institution & Dean / TPO',
    icon: Layers,
    tagline: 'Measure batch placement readiness & deploy curriculum interventions',
    color: 'from-cyan-600 to-blue-600',
    border: 'border-cyan-100',
    steps: [
      'Real-Time Campus Skill Penetration Heatmaps',
      'Batch Placement Readiness Tier Segmentation',
      'Curriculum Deficit & Remediation Analytics',
      'Accreditation & NIRF Placement Insights',
      'Strategic Corporate Partner Outreach',
    ],
    link: '/signup',
    cta: 'Monitor as Institution',
  },
  {
    id: 'academician',
    role: 'Academician & Faculty',
    icon: Users,
    tagline: 'Connect with funded research grants, FDPs & corporate consultancies',
    color: 'from-violet-600 to-indigo-600',
    border: 'border-violet-100',
    steps: [
      'AICTE & DST Sponsored Faculty Development (FDP)',
      'Bilateral Industry Research Grants & Proposals',
      'Corporate Technical Advisory & Retainers',
      'Industry Sabbaticals & Student Mentorship',
      'Guest Masterclasses & Capstone Reviews',
    ],
    link: '/signup',
    cta: 'Collaborate as Faculty',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 overflow-hidden font-sans">
      {/* 1. Clean White Navbar */}
      <header className="border-b border-slate-200/90 bg-white/95 backdrop-blur-md sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-black text-slate-900 text-2xl tracking-tight flex items-center gap-1">
                Skill<span className="bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">Bridge</span>
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm font-extrabold text-slate-700 hover:text-[#4F46E5] transition-colors">
              How It Works
            </a>
            <a href="#roles" className="text-sm font-extrabold text-slate-700 hover:text-[#4F46E5] transition-colors">
              The 4 Stakeholders
            </a>
            <a href="#journey" className="text-sm font-extrabold text-slate-700 hover:text-[#4F46E5] transition-colors">
              Student Journey
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-extrabold text-slate-700 hover:text-[#4F46E5] px-4 py-2.5 rounded-xl transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white text-sm font-black rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 bouncy-hover transition-all"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section (#F8FAFC -> #EEF2FF with subtle blue-violet gradient) */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden bg-gradient-to-b from-[#F8FAFC] via-[#EEF2FF] to-[#F8FAFC]">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Main Heading: Connecting Talent (Solid Navy) + Academia & Industry (Indigo -> Violet -> Cyan) */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#0F172A] tracking-tight leading-[1.12]">
            Connecting Talent, <br />
            <span className="bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">
              Academia &amp; Industry
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-8 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto font-semibold leading-relaxed">
            Assess verified competencies. Identify exact career gaps. Build industry capabilities. Connect candidates with the right opportunities dynamically.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white text-base font-black rounded-2xl shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/45 bouncy-hover transition-all"
            >
              Get Started — Choose Your Role <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4.5 bg-white hover:bg-slate-50 text-slate-900 text-base font-extrabold rounded-2xl border border-slate-300 shadow-sm transition-all"
            >
              Sign In to Existing Account
            </Link>
          </div>
        </div>
      </section>

      {/* 3. The 4 Stakeholders Section (Clean White Cards, Blue/Violet subtle borders) */}
      <section id="roles" className="py-24 bg-white border-t border-slate-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-black uppercase tracking-widest text-[#4F46E5] block mb-2.5">
              Role-Aware Architecture
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-[#0F172A] tracking-tight">
              Built for Everyone in the Ecosystem
            </h2>
            <p className="text-slate-600 text-base sm:text-lg font-medium mt-3">
              SkillBridge dynamically adapts workflows, intelligence, and dashboards based on who you are.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STAKEHOLDERS.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-3xl p-7 border border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${s.color} flex items-center justify-center text-white font-black shadow-md mb-5`}>
                    <s.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-black text-[#0F172A]">{s.role}</h3>
                  <p className="text-sm font-semibold text-slate-500 mt-1.5 leading-snug">{s.tagline}</p>

                  <div className="mt-5 pt-5 border-t border-slate-100 space-y-2.5">
                    {s.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-sm font-bold text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href="/signup"
                  className="mt-7 flex items-center justify-center gap-2 w-full py-3.5 bg-slate-900 hover:bg-[#4F46E5] text-white text-sm font-black rounded-xl transition-colors shadow-sm"
                >
                  {s.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How SkillBridge Works Section */}
      <section id="how-it-works" className="py-24 bg-gradient-to-b from-[#F8FAFC] to-[#EEF2FF] border-t border-slate-200/90">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-sm font-black uppercase tracking-widest text-[#4F46E5] block mb-2.5">
              End-to-End Problem Solution
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-[#0F172A] tracking-tight">
              How SkillBridge Works
            </h2>
            <p className="text-slate-600 text-base sm:text-lg font-medium mt-3">
              From diagnostic assessment to verified placement — a deterministic, closed-loop career workflow.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-md">
            <div className="grid md:grid-cols-4 gap-6 text-center relative">
              {[
                { step: '01', title: 'Diagnostic Assessment', desc: 'Students take a 10-min adaptive skill test or upload their CV for instant AI skill vector extraction.', icon: Brain },
                { step: '02', title: 'Target Gap Heatmap', desc: 'AI benchmarks student scores against real-time industry job thresholds to pinpoint exact deficits.', icon: Target },
                { step: '03', title: 'Curated Pathways', desc: 'Personalized course modules, video tracks, and project recommendations close deficits rapidly.', icon: BookOpen },
                { step: '04', title: 'Deterministic Match', desc: 'Recruiters and institutions access candidate vectors rank-ordered by verified competencies.', icon: Briefcase },
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] text-white font-black text-sm flex items-center justify-center mb-4 shadow-md">
                    {item.step}
                  </div>
                  <h4 className="font-black text-[#0F172A] text-base mb-1.5">{item.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Clean Footer */}
      <footer className="border-t border-slate-200 py-10 bg-white text-center text-sm text-slate-500 font-semibold">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#4F46E5] flex items-center justify-center text-white font-bold text-sm shadow-sm">
              ⚡
            </div>
            <span className="font-black text-slate-900 text-base">SkillBridge</span>
            <span className="text-slate-400">· AI Skill Intelligence Platform</span>
          </div>
          <div className="text-slate-600 font-bold">Connecting Talent, Academia &amp; Industry</div>
        </div>
      </footer>
    </div>
  );
}
