'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap, MapPin, Mail, ExternalLink, Award, FolderOpen, Zap, ArrowLeft, ShieldCheck, Sparkles, CheckCircle2, Star, Code,
} from 'lucide-react';
import { DEMO_PROJECTS, DEMO_CERTIFICATIONS } from '@/lib/demo-data';
import { SKILL_MAP } from '@/lib/skills-taxonomy';
import { scoreBarColor, scoreColor } from '@/lib/utils';
import { GithubIcon } from '@/components/icons';
import { getSession, getStudentSkills, type UserSession } from '@/lib/user-session';

export default function PublicPortfolioPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const [user, setUser] = useState<UserSession>(getSession());
  const [skills, setSkills] = useState<Record<string, number>>({});

  useEffect(() => {
    setUser(getSession());
    setSkills(getStudentSkills());
  }, []);

  const displayName = user.name || username.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  const verifiedSkills = Object.entries(skills)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  const student = {
    name: displayName,
    handle: username,
    headline: `${user.degree || 'B.Tech'} ${user.branch || 'CSE'} @ ${user.college || 'Engineering College'} · ${user.targetRole || 'Software Engineer'}`,
    bio: `Verified candidate profile on SkillBridge. Assessed across core algorithmic competencies, system design, and domain technologies with verified project repositories.`,
    location: 'India',
    email: user.email || `${username}@student.edu`,
    college: user.college || 'Engineering College',
  };

  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-mesh-playful py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-200/80 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to SkillBridge
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-full shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> SkillBridge Verified Credentials
          </div>
        </div>

        {/* Hero Header */}
        <div className="glass-card rounded-3xl p-8 border border-white/80 shadow-xl relative overflow-hidden bg-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-indigo-500/25 ring-4 ring-white flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{student.name}</h1>
                <span className="badge-pill badge-pill-emerald text-xs">
                  ✓ Verified by SkillBridge
                </span>
              </div>
              <p className="text-sm font-extrabold text-indigo-600 mt-1">{student.headline}</p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed max-w-2xl">{student.bio}</p>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500 font-semibold">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-500" /> {student.college}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-slate-400" /> {student.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Verified Skills Grid */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 shadow-xl bg-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-extrabold text-slate-900">Verified Technical Competencies</h2>
            </div>
            <span className="text-xs text-slate-400 font-semibold">Deterministic Assessment &amp; Resume Vector</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {verifiedSkills.map(([skillId, score]) => (
              <div key={skillId} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex justify-between font-bold mb-1.5">
                  <span className="text-slate-800 font-extrabold">{SKILL_MAP[skillId]?.name ?? skillId}</span>
                  <span className={`font-black ${scoreColor(score)}`}>{score}%</span>
                </div>
                <div className="xp-bar-container">
                  <div className={`h-full rounded-full ${scoreBarColor(score)}`} style={{ width: `${score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Projects */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/80 shadow-xl bg-white space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <FolderOpen className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-extrabold text-slate-900">Featured Projects</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {DEMO_PROJECTS.map((project) => (
              <div key={project.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <h3 className="font-extrabold text-slate-900 text-sm">{project.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{project.description}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {project.technologies.map((t) => (
                    <span key={t} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                      {SKILL_MAP[t]?.name ?? t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
