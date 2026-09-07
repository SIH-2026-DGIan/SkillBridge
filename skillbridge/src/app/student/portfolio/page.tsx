'use client';

import { useState, useEffect } from 'react';
import { FolderOpen, Award, Share2, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
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
  const completionPct = Math.round(
    (completionItems.filter((i) => i.done).length / completionItems.length) * 100
  );

  const slug = (user.name || 'candidate').toLowerCase().replace(/\s+/g, '-');

  const handleShare = () => {
    const url = `${window.location.origin}/portfolio/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Public portfolio link copied! 🚀');
  };

  const topSkills = Object.entries(skills)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  return (
    <div className="page-content">

      {/* ── Header ── */}
      <div className="page-hero">
        <div className="absolute -top-10 -right-10 w-56 h-56 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-300 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Verified Student Portfolio
            </div>
            <h2 className="text-2xl font-bold text-white">Showcase Your Capabilities</h2>
            <p className="text-indigo-300 text-sm mt-1 max-w-lg">
              Live credentials, verified assessments, and AI-benchmarked projects — shareable with recruiters.
            </p>
          </div>
          <button
            onClick={handleShare}
            className="self-start sm:self-center inline-flex items-center gap-2 px-4 py-2.5 bg-white text-indigo-700 font-semibold text-sm rounded-xl hover:bg-indigo-50 transition-colors bouncy-hover"
          >
            <Share2 className="w-4 h-4" /> Share Portfolio
          </button>
        </div>
      </div>

      {/* ── Profile Overview ── */}
      <div className="clean-card">
        {/* Profile row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
              {(user.name || 'Candidate').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{user.name}</h3>
                <span className="badge-pill badge-pill-emerald text-xs py-0.5">✓ Verified</span>
              </div>
              <p className="text-sm text-indigo-600 font-medium mt-0.5">{user.targetRole || 'Software Engineer'}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {user.college || 'Engineering College'} · Class of {user.graduationYear || 2026}
              </p>
            </div>
          </div>

          {/* Portfolio strength */}
          <div className="sm:text-right">
            <p className="text-xs text-slate-400 mb-1">Portfolio Strength</p>
            <div className="text-3xl font-bold text-indigo-600">{completionPct}%</div>
            <div className="mt-2 w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden ml-auto">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Completion checklist */}
        <div className="pt-4">
          <p className="section-label">Completion Checklist</p>
          <div className="flex flex-wrap gap-3">
            {completionItems.map((item) => (
              <div
                key={item.label}
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg ${
                  item.done
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    : 'bg-slate-50 text-slate-400 border border-slate-100'
                }`}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${item.done ? 'text-emerald-500' : 'text-slate-300'}`} />
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Skills grid */}
        {topSkills.length > 0 && (
          <div className="pt-5 mt-4 border-t border-slate-100">
            <p className="section-label">Verified Skill Competencies ({topSkills.length})</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {topSkills.map(([skillId, score]) => (
                <div key={skillId} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="font-medium text-slate-700 truncate pr-1">{SKILL_MAP[skillId]?.name ?? skillId}</span>
                    <span className={`font-bold flex-shrink-0 ${scoreColor(score)}`}>{score}%</span>
                  </div>
                  <div className="xp-bar-container" style={{ height: '0.375rem' }}>
                    <div className={`h-full rounded-full ${scoreBarColor(score)}`} style={{ width: `${score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Projects & Certifications ── */}
      <div className="clean-card space-y-5">
        {/* Tab switcher */}
        <div className="flex items-center gap-1 border-b border-slate-100 pb-4">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'projects'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            Featured Projects ({DEMO_PROJECTS.length})
          </button>
          <button
            onClick={() => setActiveTab('certifications')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'certifications'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            Certifications ({DEMO_CERTIFICATIONS.length})
          </button>
        </div>

        {/* Projects tab */}
        {activeTab === 'projects' && (
          <div className="grid md:grid-cols-2 gap-4">
            {DEMO_PROJECTS.map((project) => (
              <div key={project.id} className="p-5 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                <div>
                  <h4 className="font-semibold text-slate-900">{project.title}</h4>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">{project.description}</p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((t) => (
                    <span key={t} className="tag-chip">
                      {SKILL_MAP[t]?.name ?? t}
                    </span>
                  ))}
                </div>

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    <GithubIcon className="w-4 h-4" /> View Source →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Certifications tab */}
        {activeTab === 'certifications' && (
          <div className="space-y-3">
            {DEMO_CERTIFICATIONS.map((cert) => (
              <div key={cert.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{cert.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{cert.issuer} · {cert.issueDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg flex-shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
