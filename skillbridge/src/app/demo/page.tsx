'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Building2, Users, BookOpen, Zap, ArrowRight, Info, Sparkles, ShieldCheck, Star, Layers } from 'lucide-react';
import Link from 'next/link';

const DEMO_ROLES = [
  {
    role: 'student',
    icon: GraduationCap,
    label: 'Student Portal',
    name: 'Tanushri Sharma',
    avatar: 'TS',
    meta: 'IIT Bombay · B.Tech CSE · 2026',
    desc: 'Adaptive skill assessments, career target gap heatmaps, AI job matching with match scores, and verified digital portfolio.',
    gradient: 'from-indigo-600 to-purple-600',
    iconBg: 'bg-indigo-100 text-indigo-700',
    accentBorder: 'border-indigo-200 hover:border-indigo-500',
    badge: '⭐ Most Popular',
    badgeColor: 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900',
    perks: ['AI Match Scores', 'Skill Gap Heatmaps', 'Quiz Assessment', 'Public Portfolio'],
  },
  {
    role: 'industry',
    icon: Building2,
    label: 'Industry & Recruiter',
    name: 'Rohan Mehta',
    avatar: 'RM',
    meta: 'Talent Acquisition Lead · TechNova',
    desc: 'Post tech jobs, view AI-ranked student talent pipelines with 4-factor compatibility scores, and trigger instant shortlists.',
    gradient: 'from-rose-500 to-pink-600',
    iconBg: 'bg-rose-100 text-rose-700',
    accentBorder: 'border-rose-200 hover:border-rose-500',
    badge: '🏢 Recruiter Command',
    badgeColor: 'bg-rose-100 text-rose-800',
    perks: ['Deterministic AI Ranking', 'Candidate Funnel', '1-Click Shortlisting', 'Stack Matchers'],
  },
  {
    role: 'institution',
    icon: Layers,
    label: 'Institution & TPO',
    name: 'Dr. Priya Nair',
    avatar: 'PN',
    meta: 'Head of Placement Cell · NIT Kozhikode',
    desc: 'Real-time student batch skill readiness analytics, branch-wise placement benchmarking, and curriculum deficit alerts.',
    gradient: 'from-emerald-500 to-teal-600',
    iconBg: 'bg-emerald-100 text-emerald-700',
    accentBorder: 'border-emerald-200 hover:border-emerald-500',
    badge: '🏛️ Dean Analytics',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    perks: ['Batch Skill Heatmaps', 'Branch Readiness', 'Hiring Analytics', 'Curriculum Gaps'],
  },
  {
    role: 'academician',
    icon: Users,
    label: 'Academician & Faculty',
    name: 'Prof. Amit Gupta',
    avatar: 'AG',
    meta: 'Professor of AI · IIT Delhi',
    desc: 'Discover faculty development programs (FDP), joint industry research consultancies, and student research mentorship.',
    gradient: 'from-amber-500 to-orange-600',
    iconBg: 'bg-amber-100 text-amber-700',
    accentBorder: 'border-amber-200 hover:border-amber-500',
    badge: '🧑‍🏫 Faculty Hub',
    badgeColor: 'bg-amber-100 text-amber-800',
    perks: ['Research Grants', 'Industry Consultancies', 'FDP Workshops', 'Mentorship'],
  },
];

export default function DemoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleDemoLogin = async (role: string, name: string) => {
    setLoading(role);

    // Store demo session in cookie
    const session = {
      role,
      name,
      isDemo: true,
      id: `demo-${role}-1`,
    };

    document.cookie = `sb-demo-session=${JSON.stringify(session)}; path=/; max-age=86400; SameSite=Lax`;

    // Quick smooth delay for UX
    await new Promise((r) => setTimeout(r, 450));

    router.push(`/${role}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-mesh-playful flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-black shadow-md shadow-indigo-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-slate-900 text-lg tracking-tight">
                Skill<span className="gradient-text-playful">Bridge</span>
              </span>
              <span className="text-[10px] block font-bold text-indigo-600 uppercase tracking-widest -mt-1">
                Demo Lounge
              </span>
            </div>
          </Link>

          <Link
            href="/login"
            className="text-xs font-extrabold text-slate-700 hover:text-indigo-600 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm transition-colors"
          >
            Sign In with Account →
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-10 w-full flex flex-col justify-center">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-amber-800 text-xs font-black mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Instant Sandbox Environment
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Choose a Role to Explore
          </h1>
          <p className="text-slate-600 text-sm font-medium mt-1">
            Pick any persona to enter a fully populated dashboard with live matching, analytics, and simulated data.
          </p>
        </div>

        {/* 4 Role Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {DEMO_ROLES.map((demo) => (
            <div
              key={demo.role}
              onClick={() => handleDemoLogin(demo.role, demo.name)}
              className={`glass-card rounded-3xl p-6 sm:p-7 border-2 ${demo.accentBorder} shadow-lg card-hover-playful cursor-pointer flex flex-col justify-between transition-all relative overflow-hidden group`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-950 flex items-center justify-center text-white font-black text-lg shadow-md ring-2 ring-white">
                      {demo.avatar}
                    </div>
                    <div>
                      <h2 className="font-extrabold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">
                        {demo.label}
                      </h2>
                      <div className="text-xs font-bold text-slate-700">{demo.name}</div>
                      <div className="text-[11px] font-semibold text-slate-400 mt-0.5">{demo.meta}</div>
                    </div>
                  </div>

                  <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full shadow-sm ${demo.badgeColor}`}>
                    {demo.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                  {demo.desc}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {demo.perks.map((p) => (
                    <span key={p} className="text-[11px] px-2.5 py-0.5 bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-200">
                      ✓ {p}
                    </span>
                  ))}
                </div>
              </div>

              <button
                disabled={loading !== null}
                className={`w-full py-3 px-4 rounded-2xl font-extrabold text-xs text-white bg-gradient-to-r ${demo.gradient} flex items-center justify-center gap-2 shadow-md group-hover:shadow-lg transition-all`}
              >
                {loading === demo.role ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Enter {demo.label} Sandbox <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500 font-semibold">
            All data in demo mode is illustrative and safely isolated. No persistent account changes are made.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 py-6 bg-white text-center text-xs text-slate-500 font-semibold">
        SkillBridge · AI Skill Intelligence Platform
      </footer>
    </div>
  );
}
