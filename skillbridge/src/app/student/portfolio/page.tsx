'use client';

import { useState, useEffect } from 'react';
import { FolderOpen, ExternalLink, Plus, Award, Trash2, Sparkles, CheckCircle2, Share2, ShieldCheck, Code, Globe, User } from 'lucide-react';
import { DEMO_PROJECTS, DEMO_CERTIFICATIONS } from '@/lib/demo-data';
import { SKILL_MAP } from '@/lib/skills-taxonomy';
import { GithubIcon } from '@/components/icons';
import { toast } from 'sonner';
import { getSession, getStudentSkills, type UserSession } from '@/lib/user-session';
import { scoreBarColor, scoreColor } from '@/lib/utils';

type Tab = 'projects' | 'certifications';

export default function PortfolioPage() {
  const [activeTab, setActiveTab] = useState<Tab>('projects');
  const [user, setUser] = useState<UserSession>(getSession());
  const [skills, setSkills] = useState<Record<string, number>>({});

  useEffect(() => {
    setUser(getSession());
    setSkills(getStudentSkills());
  }, []);

  const completionItems = [
    { label: 'Assessment verified', done: true },
    { label: 'Core skills calibrated', done: Object.keys(skills).length > 0 },
    { label: 'Featured projects attached', done: DEMO_PROJECTS.length > 0 },
    { label: 'Industry certifications linked', done: DEMO_CERTIFICATIONS.length > 0 },
    { label: 'Career objective filled', done: true },
  ];
  const completionPct = Math.round((completionItems.filter((i) => i.done).length / completionItems.length) * 100);

  const slug = (user.name || 'candidate').toLowerCase().replace(/\s+/g, '-');

  const handleShare = () => {
    const url = `${window.location.origin}/portfolio/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success(`Public portfolio link copied to clipboard! 🚀`);
  };

  const topSkills = Object.entries(skills)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-indigo-200 text-xs font-bold mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Verified Student Portfolio
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Showcase Your Verified Capabilities</h1>
          <p className="text-indigo-200 text-sm mt-1 max-w-xl font-medium">
            Live digital credentials, verified skill assessments, and AI-benchmarked project vectors shareable with recruiters.
          </p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 text-xs font-extrabold rounded-2xl shadow-lg shadow-amber-500/20 bouncy-hover transition-all"
          >
            <Share2 className="w-4 h-4" /> Share Public Portfolio Link
          </button>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="glass-card rounded-3xl p-6 border border-white shadow-lg bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-md">
              {(user.name || 'Candidate').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900">{user.name}</h2>
                <span className="badge-pill badge-pill-emerald text-[11px]">✓ Verified</span>
              </div>
              <p className="text-xs font-bold text-indigo-600 mt-0.5">{user.targetRole || 'Software Engineer'}</p>
              <p className="text-xs text-slate-500 mt-0.5">{user.college || 'Engineering College'} · Class of {user.graduationYear || 2026}</p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs font-bold text-slate-500">Portfolio Strength</div>
            <div className="text-2xl font-black text-indigo-600">{completionPct}%</div>
          </div>
        </div>

        {/* Verified Skills Grid */}
        <div className="pt-4 space-y-2">
          <div className="text-xs font-black text-slate-700 uppercase tracking-wider">
            Verified Skill Competencies ({topSkills.length})
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {topSkills.map(([skillId, score]) => (
              <div key={skillId} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex justify-between font-bold mb-1">
                  <span className="text-slate-800">{SKILL_MAP[skillId]?.name ?? skillId}</span>
                  <span className={`font-black ${scoreColor(score)}`}>{score}%</span>
                </div>
                <div className="xp-bar-container">
                  <div className={`h-full rounded-full ${scoreBarColor(score)}`} style={{ width: `${score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs: Projects vs Certifications */}
      <div className="glass-card rounded-3xl p-6 border border-white shadow-lg bg-white space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-colors ${
              activeTab === 'projects' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Featured Projects ({DEMO_PROJECTS.length})
          </button>
          <button
            onClick={() => setActiveTab('certifications')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-colors ${
              activeTab === 'certifications' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Verified Certifications ({DEMO_CERTIFICATIONS.length})
          </button>
        </div>

        {activeTab === 'projects' && (
          <div className="grid md:grid-cols-2 gap-4">
            {DEMO_PROJECTS.map((project) => (
              <div key={project.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm">{project.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{project.description}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.technologies.map((t) => (
                    <span key={t} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                      {SKILL_MAP[t]?.name ?? t}
                    </span>
                  ))}
                </div>

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline pt-1"
                  >
                    <GithubIcon className="w-3.5 h-3.5" /> View Source Repository →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'certifications' && (
          <div className="space-y-3">
            {DEMO_CERTIFICATIONS.map((cert) => (
              <div key={cert.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 text-xs">{cert.name}</div>
                    <div className="text-[11px] text-slate-500">{cert.issuer} · Issued {cert.issueDate}</div>
                  </div>
                </div>
                <span className="badge-pill badge-pill-emerald text-[11px]">✓ Verified Credential</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
