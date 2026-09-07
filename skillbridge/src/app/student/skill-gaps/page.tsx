'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend,
} from 'recharts';
import { Target, BookOpen, ArrowRight, TrendingUp, AlertTriangle, CheckCircle, Sparkles, Zap, ShieldCheck, ChevronRight, ExternalLink } from 'lucide-react';
import { ROLE_REQUIRED_SKILLS, TARGET_ROLES, SKILL_MAP } from '@/lib/skills-taxonomy';
import { DEMO_STUDENT_SKILLS, DEMO_LEARNING_RESOURCES } from '@/lib/demo-data';
import { getStudentSkills, getStudentResume } from '@/lib/user-session';

export default function SkillGapsPage() {
  const [selectedRole, setSelectedRole] = useState('Machine Learning Engineer');
  const [skills, setSkills] = useState<Record<string, number>>(DEMO_STUDENT_SKILLS);

  useEffect(() => {
    const sync = () => {
      setSkills(getStudentSkills());
      const resume = getStudentResume();
      if (resume?.targetRole && TARGET_ROLES.includes(resume.targetRole as any)) {
        setSelectedRole(resume.targetRole);
      }
    };
    sync();
    window.addEventListener('sb_skills_updated', sync);
    window.addEventListener('sb_resume_updated', sync);
    return () => {
      window.removeEventListener('sb_skills_updated', sync);
      window.removeEventListener('sb_resume_updated', sync);
    };
  }, []);

  const gapData = useMemo(() => {
    const required = ROLE_REQUIRED_SKILLS[selectedRole] ?? [];
    return required.map(({ skillId, required: req }) => {
      const current = skills[skillId] ?? 0;
      const gap = Math.max(0, req - current);
      return {
        name: SKILL_MAP[skillId]?.name ?? skillId,
        skillId,
        current,
        required: req,
        gap,
        status: current >= req ? 'met' : gap <= 15 ? 'close' : 'gap',
      };
    });
  }, [selectedRole, skills]);

  const matchPercent = useMemo(() => {
    if (gapData.length === 0) return 0;
    const total = gapData.reduce((sum, { current, required }) => {
      return sum + Math.min(current / required, 1);
    }, 0);
    return Math.round((total / gapData.length) * 100);
  }, [gapData]);

  const skillsToImprove = gapData.filter((d) => d.status !== 'met');
  const relevantResources = DEMO_LEARNING_RESOURCES.filter((r) =>
    skillsToImprove.some((s) => s.skillId === r.skillId)
  ).slice(0, 4);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-amber-300 text-xs font-black mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" /> Target Career Analyzer
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">AI Skill Gap Diagnostics</h1>
          <p className="text-indigo-200 text-sm mt-1 max-w-xl font-medium">
            Benchmark your current profile against exact requirements of top hiring tracks.
          </p>
        </div>

        <div className="relative z-10">
          <Link
            href="/student/opportunities"
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 text-sm font-extrabold rounded-2xl shadow-lg hover:shadow-amber-500/30 bouncy-hover transition-all"
          >
            <Target className="w-4 h-4" /> Match Target Jobs
          </Link>
        </div>
      </div>

      {/* Target Role Selector Pills */}
      <div className="glass-card rounded-3xl p-6 border border-white shadow-md">
        <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-3">
          1. Select Your Target Career Trajectory
        </label>
        <div className="flex flex-wrap gap-2.5">
          {TARGET_ROLES.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all border-2 ${
                selectedRole === role
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-md scale-100'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Match Score Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-xl bg-gradient-to-br from-indigo-50/60 via-purple-50/40 to-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-xs font-black text-indigo-600 uppercase tracking-wider mb-1">
              Compatibility for Selected Track
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{selectedRole}</div>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              {gapData.filter((d) => d.status === 'met').length} of {gapData.length} core competencies fully satisfied
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-4xl sm:text-5xl font-black gradient-text-playful">{matchPercent}%</div>
              <div className="text-xs font-bold text-slate-400 mt-0.5">Overall Fit</div>
            </div>
          </div>
        </div>

        <div className="mt-5 xp-bar-container">
          <div
            className="xp-bar-fill"
            style={{ width: `${matchPercent}%` }}
          />
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="glass-card rounded-3xl p-6 border border-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-extrabold text-slate-900 text-base">Current vs. Required Proficiency</h2>
            <p className="text-xs text-slate-500 font-medium">Your tested score vs benchmark standard</p>
          </div>
          <span className="badge-pill badge-pill-purple">Recharts Vector</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gapData} layout="vertical" margin={{ left: 10, right: 20, top: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11, fontWeight: 700, fill: '#334155' }} />
              <Tooltip
                formatter={(value, name) => [`${value}%`, name === 'current' ? 'Your Score' : 'Required Level']}
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12, fontWeight: 700 }}
              />
              <Legend
                formatter={(value) => (value === 'current' ? 'Your Verified Score' : 'Industry Required Threshold')}
                wrapperStyle={{ fontSize: 12, fontWeight: 700, paddingTop: 10 }}
              />
              <Bar dataKey="required" fill="#cbd5e1" radius={[0, 6, 6, 0]} name="required" />
              <Bar dataKey="current" radius={[0, 6, 6, 0]} name="current">
                {gapData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.status === 'met' ? '#10b981' : entry.status === 'close' ? '#f59e0b' : '#6366f1'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Skill Breakdown Heat-bars */}
      <div className="glass-card rounded-3xl p-6 border border-white shadow-lg">
        <h2 className="font-extrabold text-slate-900 text-base mb-4">Competency Gap Heatmap</h2>
        <div className="space-y-4">
          {gapData.map((skill) => (
            <div key={skill.name} className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {skill.status === 'met' ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                      ✓
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
                      !
                    </div>
                  )}
                  <span className="text-sm font-extrabold text-slate-900">{skill.name}</span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="font-bold text-slate-500">
                    Current: <strong>{skill.current}%</strong> / Goal: <strong>{skill.required}%</strong>
                  </span>
                  {skill.gap > 0 ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-extrabold text-[11px]">
                      Deficit: -{skill.gap}%
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold text-[11px]">
                      Mastered ✓
                    </span>
                  )}
                </div>
              </div>

              <div className="relative h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    skill.status === 'met' ? 'bg-emerald-500' : skill.status === 'close' ? 'bg-amber-500' : 'bg-indigo-600'
                  }`}
                  style={{ width: `${skill.current}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Curated Learning Resources */}
      {relevantResources.length > 0 && (
        <div className="glass-card rounded-3xl p-6 border border-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-extrabold text-slate-900 text-base">Recommended Micro-Roadmaps</h2>
              <p className="text-xs text-slate-500 font-medium">Bite-sized curated courses to close these exact gaps</p>
            </div>
            <Link href="/student/learning" className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800">
              View All Paths →
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {relevantResources.map((resource) => (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-slate-50/80 hover:bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all flex items-start gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-extrabold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors truncate">
                    {resource.title}
                  </div>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">
                    {resource.provider} · {resource.duration} · <span className="text-indigo-600 font-bold uppercase">{resource.level}</span>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
