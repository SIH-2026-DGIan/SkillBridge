'use client';

import { useState, useEffect } from 'react';
import {
  BookOpen,
  Microscope,
  Users,
  Award,
  ExternalLink,
  MapPin,
  Calendar,
  Sparkles,
  Zap,
} from 'lucide-react';
import { getSession, UserSession } from '@/lib/user-session';

const ACADEMICIAN_JOURNEY = [
  { step: '1. Collaborate', active: false, done: true },
  { step: '2. Train (FDP)', active: true, done: false },
  { step: '3. Research', active: false, done: false },
  { step: '4. Mentor', active: false, done: false },
];

const FACULTY_OPPS = [
  {
    category: 'FDP',
    title: 'Faculty Development Program — Advanced AI/ML & LLMs',
    org: 'IIT Madras · AICTE Sponsored',
    location: 'Chennai · Hybrid',
    date: 'Oct 14–18, 2026',
    desc: '5-day intensive program covering Deep Learning, NLP transformers, and ML production deployment for university educators.',
    icon: BookOpen,
    grant: 'Fully Funded',
    badgeBg: 'bg-orange-50 text-orange-700 border-orange-200',
  },
  {
    category: 'Research Grant',
    title: 'Indo-German Bilateral Research — Explainable AI in Medicine',
    org: 'DAAD + DST India',
    location: 'Remote & Munich',
    date: 'Applications Close: Aug 31, 2026',
    desc: 'Bilateral grant for Explainable AI models in clinical diagnostics. Open to principal investigators and faculty at IITs and NITs.',
    icon: Microscope,
    grant: '₹45,00,000 Grant',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    category: 'Corporate Consultancy',
    title: 'AI Strategy & Algorithm Advisory — FinTech System',
    org: 'FinEdge Technologies',
    location: 'Mumbai · Hybrid',
    date: '3 Months Engagement',
    desc: 'Senior faculty advisory to design graph neural network fraud detection architecture for high-throughput payment rails.',
    icon: Award,
    grant: '₹95,000 / mo Retainer',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    category: 'Faculty Internship',
    title: 'Industry Sabbatical — Cloud Robotics Architecture',
    org: 'RoboTech Labs',
    location: 'Bengaluru · Onsite',
    date: 'Summer 2026 (2 Months)',
    desc: 'Immersive industry residency working alongside robotics engineers on autonomous warehouse navigation algorithms.',
    icon: Users,
    grant: 'Stipend + Housing',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
  },
];

const PLACEHOLDER: UserSession = {
  id: '',
  name: 'Faculty',
  email: '',
  role: 'academician',
  department: 'Computer Science',
  institutionName: 'IIT Delhi',
};

export default function AcademicianDashboard() {
  const [user, setUser] = useState<UserSession>(PLACEHOLDER);

  useEffect(() => {
    setUser(getSession());
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Academician Workflow Journey */}
      <div className="glass-card rounded-3xl p-5 border border-white shadow-lg bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#4F46E5]" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Academician Engagement Journey
            </h2>
          </div>
          <span className="text-xs font-extrabold text-[#4F46E5] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Active: Research Grants &amp; Faculty Development Programs
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {ACADEMICIAN_JOURNEY.map((j, idx) => (
            <div
              key={j.step}
              className={`p-2.5 rounded-2xl text-center text-xs font-extrabold transition-all ${
                j.active
                  ? 'bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-500/20'
                  : j.done
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-slate-50 text-slate-400 border border-slate-200/80'
              }`}
            >
              <div className="text-[10px] opacity-75">{j.done ? '✓' : idx + 1}</div>
              <div className="truncate">{j.step}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Top Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white shadow-xl bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#0F172A] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-black tracking-wider text-cyan-300 uppercase">
            👨‍🏫 Faculty &amp; Research Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-0.5">
            {user.name} · Research Hub
          </h1>
          <p className="text-indigo-200 text-xs sm:text-sm font-medium mt-1">
            {user.department || 'Computer Science'} · {user.institutionName || 'IIT Delhi'}
          </p>
        </div>

        <button className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-indigo-500/30 bouncy-hover transition-all flex-shrink-0">
          <Microscope className="w-4 h-4" /> Submit Research RFP
        </button>
      </div>

      {/* 3. Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Available FDPs', value: '3', sub: 'AICTE / DST Funded', color: 'from-indigo-600 to-violet-600' },
          { label: 'Research Grants', value: '2', sub: '₹75L Total Funding', color: 'from-blue-600 to-indigo-600' },
          { label: 'Corporate Consultancies', value: '2', sub: 'Active Industry RFPs', color: 'from-violet-600 to-purple-600' },
          { label: 'Student Mentorships', value: '4', sub: 'Capstone Teams', color: 'from-emerald-500 to-teal-600' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-3xl p-5 border border-white shadow-md bg-white">
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${stat.color} flex items-center justify-center text-white font-black shadow-md mb-3`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</div>
            <div className="text-xs font-extrabold text-slate-700 mt-0.5">{stat.label}</div>
            <div className="text-[11px] font-semibold text-slate-400 mt-0.5">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* 4. Curated Opportunities List */}
      <div className="glass-card rounded-3xl p-6 border border-white shadow-lg bg-white space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-black text-slate-900 text-base">Curated Faculty Opportunities &amp; Grants</h3>
            <p className="text-xs text-slate-500 font-medium">Bilateral research, FDPs, and corporate advisory</p>
          </div>
        </div>

        <div className="space-y-3">
          {FACULTY_OPPS.map((opp) => (
            <div
              key={opp.title}
              className="p-5 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-amber-300 hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black flex-shrink-0 shadow-sm">
                  <opp.icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className="font-black text-slate-900 text-sm">{opp.title}</h4>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${opp.badgeBg}`}>
                      {opp.category}
                    </span>
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {opp.grant}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-600 mb-1">{opp.org}</div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{opp.desc}</p>
                </div>
              </div>

              <button className="flex-shrink-0 px-4 py-2.5 bg-slate-900 hover:bg-amber-600 text-white text-xs font-extrabold rounded-xl transition-colors shadow-sm self-end sm:self-center">
                Express Interest →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
