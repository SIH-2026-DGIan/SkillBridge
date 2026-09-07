'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Users, TrendingUp, GraduationCap, Briefcase, Sparkles, Layers, ShieldCheck, ArrowUpRight, AlertTriangle } from 'lucide-react';
import { getSession } from '@/lib/user-session';

const INSTITUTION_JOURNEY = [
  { step: '1. Monitor', active: false, done: true },
  { step: '2. Identify Gaps', active: true, done: false },
  { step: '3. Upskill', active: false, done: false },
  { step: '4. Track Placement', active: false, done: false },
];

const SKILL_DISTRIBUTION = [
  { skill: 'Python', percentage: 88 },
  { skill: 'SQL', percentage: 76 },
  { skill: 'Java / C++', percentage: 72 },
  { skill: 'AI / ML', percentage: 58 },
  { skill: 'Cloud / DevOps', percentage: 42 },
];

const TOP_DEFICITS = [
  { skill: 'Cloud Computing & Docker', gap: 58 },
  { skill: 'Distributed Data Structures', gap: 46 },
  { skill: 'Machine Learning Deployment', gap: 42 },
  { skill: 'Technical Communication', gap: 32 },
];

export default function InstitutionDashboard() {
  const user = getSession();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* 1. Institution Workflow Journey */}
      <div className="glass-card rounded-3xl p-5 border border-white shadow-lg bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#4F46E5]" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
              Institution Intelligence Workflow
            </h2>
          </div>
          <span className="text-xs font-extrabold text-[#4F46E5] bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Active: Batch Deficit Mapping &amp; Curriculum Intervention
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {INSTITUTION_JOURNEY.map((j, idx) => (
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

      {/* 2. Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white shadow-xl bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#0F172A] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-black tracking-wider text-cyan-300 uppercase">
            🏫 Placement &amp; Dean Intelligence Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-0.5">
            {user.institutionName || 'NIT Kozhikode'} Campus Analytics
          </h1>
          <p className="text-indigo-200 text-xs sm:text-sm font-medium mt-1">
            Head of TPO: <strong>{user.name}</strong> · Real-time batch competency metrics &amp; NIRF placement analytics.
          </p>
        </div>

        <div className="glass-card-dark rounded-2xl px-5 py-3 text-center border border-white/10 flex-shrink-0">
          <div className="text-xs font-bold text-cyan-300">Placement Rate</div>
          <div className="text-2xl font-black text-white">88.4%</div>
        </div>
      </div>

      {/* 3. Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tracked Students', value: '2,450', sub: 'Across 6 Engineering Branches', icon: Users, color: 'from-indigo-600 to-violet-600' },
          { label: 'Placement Ready', value: '68%', sub: '1,666 Students Tier-1 Ready', icon: GraduationCap, color: 'from-blue-600 to-indigo-600' },
          { label: 'Needs Upskilling', value: '32%', sub: '784 Students in Intervention', icon: AlertTriangle, color: 'from-violet-600 to-purple-600' },
          { label: 'Internship Participation', value: '74%', sub: 'Active Pre-Placement Drives', icon: Briefcase, color: 'from-emerald-500 to-teal-600' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-3xl p-5 border border-white shadow-md bg-white">
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${stat.color} flex items-center justify-center text-white font-black shadow-md mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</div>
            <div className="text-xs font-extrabold text-slate-700 mt-0.5">{stat.label}</div>
            <div className="text-[11px] font-semibold text-slate-400 mt-0.5">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* 4. Skill Distribution & Top Skill Deficits */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skill Distribution Across Batch */}
        <div className="glass-card rounded-3xl p-6 border border-white shadow-lg bg-white space-y-4">
          <div>
            <h3 className="font-black text-slate-900 text-base">Batch Skill Penetration</h3>
            <p className="text-xs text-slate-500 font-medium">% of students demonstrating ≥ 60% tested proficiency</p>
          </div>

          <div className="space-y-3 pt-2">
            {SKILL_DISTRIBUTION.map((item) => (
              <div key={item.skill} className="space-y-1">
                <div className="flex justify-between text-xs font-extrabold">
                  <span className="text-slate-800">{item.skill}</span>
                  <span className="text-[#4F46E5] font-black">{item.percentage}%</span>
                </div>
                <div className="xp-bar-container">
                  <div className="h-full bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#06B6D4] rounded-full" style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Skill Deficits (Curriculum Interventions) */}
        <div className="glass-card rounded-3xl p-6 border border-white shadow-lg bg-white space-y-4">
          <div>
            <h3 className="font-black text-slate-900 text-base">Critical Campus Deficits</h3>
            <p className="text-xs text-slate-500 font-medium">Gap between batch scores and hiring threshold</p>
          </div>

          <div className="space-y-3 pt-2">
            {TOP_DEFICITS.map((item) => (
              <div key={item.skill} className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-extrabold text-slate-900">{item.skill}</div>
                  <div className="text-[11px] text-indigo-700 font-semibold mt-0.5">Intervention Recommended</div>
                </div>
                <span className="text-xs font-black text-[#4F46E5] bg-white px-2.5 py-1 rounded-full border border-indigo-200 shadow-sm">
                  {item.gap}% Deficit
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
