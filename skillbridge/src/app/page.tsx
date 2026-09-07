'use client';

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
  TrendingUp,
  AlertTriangle,
  BarChart2,
  Map,
} from 'lucide-react';

const STAKEHOLDERS = [
  {
    id: 'student',
    role: 'Student & Graduate',
    icon: GraduationCap,
    color: 'from-indigo-600 to-violet-600',
    tagline: 'Know exactly where you stand — and what to fix.',
    steps: [
      'Take a 10-min adaptive skill diagnostic',
      'See your gap vs. your target job role',
      'Follow a personalized learning roadmap',
      'Get AI-matched to internships & jobs',
      'Share a verified digital portfolio with recruiters',
    ],
    link: '/signup',
    cta: 'Start as Student',
  },
  {
    id: 'industry',
    role: 'Industry & Recruiter',
    icon: Building2,
    color: 'from-blue-600 to-indigo-600',
    tagline: 'Hire by verified competency, not just a resume.',
    steps: [
      'Post internships, jobs & capstone projects',
      'AI ranks candidates by proven skill fit',
      'View rank-ordered shortlists instantly',
      '1-click pipeline to interview scheduling',
      'Run campus-wide placement drives',
    ],
    link: '/signup',
    cta: 'Hire as Industry',
  },
  {
    id: 'institution',
    role: 'Institution & TPO / Dean',
    icon: Layers,
    color: 'from-cyan-600 to-blue-600',
    tagline: "See your entire batch's placement readiness at a glance.",
    steps: [
      'Real-time skill heatmaps across your campus',
      'Batch segmentation by placement readiness tier',
      'Identify curriculum gaps before exam season',
      'NIRF & accreditation placement analytics',
      'Coordinate corporate partner outreach',
    ],
    link: '/signup',
    cta: 'Monitor as Institution',
  },
  {
    id: 'academician',
    role: 'Academician & Faculty',
    icon: Users,
    color: 'from-violet-600 to-indigo-600',
    tagline: 'Connect your research & expertise with industry.',
    steps: [
      'Access AICTE & DST sponsored FDP programs',
      'Apply for industry research grants',
      'Offer corporate technical advisory',
      'Mentor students on career roadmaps',
      'Conduct guest masterclasses & capstone reviews',
    ],
    link: '/signup',
    cta: 'Collaborate as Faculty',
  },
];

const STATS = [
  { value: '51.25%', label: 'of Indian engineering graduates are employable', source: 'India Skills Report 2024' },
  { value: '45%', label: 'of employers struggle to find job-ready candidates', source: 'NASSCOM' },
  { value: '93 lakh+', label: 'engineering seats filled annually across India', source: 'AICTE' },
  { value: '0', label: 'standardized platforms bridging this gap end-to-end', source: 'The gap we solve' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">

      {/* ── Navbar ── */}
      <header className="border-b border-slate-200/90 bg-white/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-slate-900 text-xl tracking-tight">
              Skill<span className="bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent">Bridge</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            <a href="#problem" className="text-sm font-semibold text-slate-600 hover:text-[#4F46E5] transition-colors">The Problem</a>
            <a href="#how-it-works" className="text-sm font-semibold text-slate-600 hover:text-[#4F46E5] transition-colors">How It Works</a>
            <a href="#roles" className="text-sm font-semibold text-slate-600 hover:text-[#4F46E5] transition-colors">Who It's For</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-[#4F46E5] px-4 py-2 rounded-xl transition-colors">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 bouncy-hover transition-all"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative pt-20 pb-24 lg:pt-28 lg:pb-32 overflow-hidden bg-gradient-to-b from-[#F8FAFC] via-[#EEF2FF] to-[#F8FAFC]">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-200/25 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Context badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-full text-sm font-semibold text-indigo-700 mb-8">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            Smart India Hackathon 2026 · AI-Powered Career Platform
          </div>

          {/* Main headline — crystal clear */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-tight leading-[1.1] mb-6">
            India's skill gap is real.{' '}
            <span className="bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#06B6D4] bg-clip-text text-transparent block sm:inline">
              SkillBridge fixes it.
            </span>
          </h1>

          {/* Clear value proposition — what does this actually do? */}
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-4">
            An end-to-end AI platform that <strong className="text-slate-800">assesses student skill gaps</strong>,
            builds <strong className="text-slate-800">personalized learning paths</strong>, and{' '}
            <strong className="text-slate-800">matches candidates to verified industry opportunities</strong> — all in one place.
          </p>
          <p className="text-sm text-slate-500 mb-10">
            For students, recruiters, institutions & faculty. Built for India's 93-lakh-seat engineering ecosystem.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white text-base font-bold rounded-2xl shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/45 bouncy-hover transition-all"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 bg-white text-slate-800 text-base font-semibold rounded-2xl border border-slate-300 shadow-sm hover:bg-slate-50 transition-all"
            >
              View Live Demo →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Problem Section ── */}
      <section id="problem" className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-rose-500 block mb-3">The Problem We Solve</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
              India's Engineering Talent Pipeline is Broken
            </h2>
            <p className="text-slate-500 text-base mt-3 max-w-2xl mx-auto">
              Millions of graduates. A fraction job-ready. No standardized system to close the gap.
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
            {STATS.map((stat) => (
              <div key={stat.label} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <div className="text-3xl font-black text-[#4F46E5] mb-2">{stat.value}</div>
                <div className="text-sm font-semibold text-slate-700 leading-snug mb-1">{stat.label}</div>
                <div className="text-xs text-slate-400 font-medium">{stat.source}</div>
              </div>
            ))}
          </div>

          {/* Problem → Solution bridge */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-7 rounded-2xl bg-rose-50 border border-rose-200">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <span className="font-bold text-rose-700 text-sm uppercase tracking-wide">Without SkillBridge</span>
              </div>
              <ul className="space-y-3">
                {[
                  'Students guess which skills to improve with no data',
                  'Recruiters filter 500 CVs manually with no skill verification',
                  'TPOs have no real-time view of batch placement readiness',
                  'Faculty remain disconnected from industry needs',
                  'Everyone operates in silos — no shared intelligence',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-rose-800 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-7 rounded-2xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-emerald-700 text-sm uppercase tracking-wide">With SkillBridge</span>
              </div>
              <ul className="space-y-3">
                {[
                  'Students get a precise gap heatmap vs. their target role',
                  'Recruiters get AI-ranked candidates by verified competency scores',
                  'TPOs see real-time skill penetration across their entire batch',
                  'Faculty connect with industry FDPs, grants & mentorship programs',
                  'One closed-loop platform — from assessment to placement',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-emerald-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-[#F8FAFC] to-[#EEF2FF] border-t border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4F46E5] block mb-3">End-to-End Workflow</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
              How SkillBridge Works
            </h2>
            <p className="text-slate-500 text-base mt-3 max-w-xl mx-auto">
              A deterministic, closed-loop system — from first assessment to verified placement.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-5">
            {[
              {
                step: '01',
                title: 'Skill Diagnostic',
                desc: 'Student takes a 10-min adaptive test or uploads their CV. AI extracts a verified skill vector instantly.',
                icon: Brain,
                color: 'from-indigo-500 to-violet-600',
              },
              {
                step: '02',
                title: 'Gap Heatmap',
                desc: 'Their scores are benchmarked against real industry job requirements to show exact skill deficits.',
                icon: Target,
                color: 'from-violet-500 to-purple-600',
              },
              {
                step: '03',
                title: 'Learning Roadmap',
                desc: 'Personalized course tracks, videos, and mini-projects are curated to close those specific gaps.',
                icon: BookOpen,
                color: 'from-purple-500 to-pink-500',
              },
              {
                step: '04',
                title: 'AI Job Match',
                desc: 'Candidates are ranked and matched to verified industry postings based on their competency profile.',
                icon: Briefcase,
                color: 'from-pink-500 to-rose-500',
              },
            ].map((item, idx) => (
              <div key={idx} className="relative bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all">
                {/* Connector line (not on last) */}
                {idx < 3 && (
                  <div className="hidden md:block absolute top-10 -right-2.5 w-5 h-0.5 bg-slate-200 z-10" />
                )}
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white font-black text-sm mb-4 shadow-md`}>
                  {item.step}
                </div>
                <h4 className="font-bold text-[#0F172A] text-base mb-2">{item.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who It's For ── */}
      <section id="roles" className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#4F46E5] block mb-3">Role-Aware Platform</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
              Built for the Entire Ecosystem
            </h2>
            <p className="text-slate-500 text-base mt-3 max-w-xl mx-auto">
              SkillBridge serves four stakeholders — each with a dedicated, purpose-built experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {STAKEHOLDERS.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all flex flex-col"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${s.color} flex items-center justify-center text-white shadow-md mb-4`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] mb-1">{s.role}</h3>
                <p className="text-sm text-slate-500 mb-4 leading-snug">{s.tagline}</p>

                <ul className="space-y-2 flex-1">
                  {s.steps?.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={s.link}
                  className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-slate-900 hover:bg-[#4F46E5] text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  {s.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20 bg-gradient-to-r from-[#1e1b4b] via-[#312e81] to-[#1e1b4b]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm font-semibold text-indigo-200 mb-6">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Smart India Hackathon 2026 — Problem Statement SIH 1653
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            Ready to close India's skill gap?
          </h2>
          <p className="text-indigo-300 text-lg mb-8">
            Join students, recruiters, institutions, and faculty already using SkillBridge.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-indigo-800 text-base font-bold rounded-2xl shadow-xl hover:bg-indigo-50 bouncy-hover transition-all"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 bg-white/10 hover:bg-white/20 text-white text-base font-semibold rounded-2xl border border-white/20 transition-all"
            >
              Sign In to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#4F46E5] flex items-center justify-center text-white font-bold shadow-sm">
              <Zap className="w-4 h-4" />
            </div>
            <span className="font-black text-slate-900">SkillBridge</span>
            <span className="text-slate-400">· AI Skill Intelligence Platform</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500 font-medium">
            <span className="text-orange-500">🇮🇳</span>
            Built for India · Smart India Hackathon 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
