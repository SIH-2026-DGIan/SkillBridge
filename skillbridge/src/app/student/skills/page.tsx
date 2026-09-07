'use client';

import { useState, useEffect } from 'react';
import { DEMO_STUDENT_SKILLS } from '@/lib/demo-data';
import { SKILL_MAP, SKILLS } from '@/lib/skills-taxonomy';
import { scoreBarColor, scoreColor } from '@/lib/utils';
import { Target, TrendingUp, Sparkles, Zap, Search, ShieldCheck } from 'lucide-react';
import { getStudentSkills } from '@/lib/user-session';
import Link from 'next/link';

export default function SkillsPage() {
  const [filter, setFilter] = useState<'all' | 'technical' | 'soft' | 'tools'>('all');
  const [search, setSearch] = useState('');
  const [skills, setSkills] = useState<Record<string, number>>(DEMO_STUDENT_SKILLS);

  useEffect(() => {
    const sync = () => setSkills(getStudentSkills());
    sync();
    window.addEventListener('sb_skills_updated', sync);
    return () => window.removeEventListener('sb_skills_updated', sync);
  }, []);

  const allSkills = Object.entries(skills).map(([id, score]) => ({
    id,
    score,
    skill: SKILL_MAP[id] ?? { id, name: id, category: 'technical' },
  }));

  const filteredSkills = allSkills
    .filter(({ id, skill }) => {
      const matchesSearch = skill.name.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;
      if (filter === 'all') return true;
      if (filter === 'technical') return skill.category === 'technical';
      if (filter === 'soft') return skill.category === 'soft';
      if (filter === 'tools') return id === 'git' || id === 'docker' || id === 'aws';
      return true;
    })
    .sort((a, b) => b.score - a.score);

  const avgScore = Math.round(
    Object.values(skills).reduce((a, b) => a + b, 0) / (Object.values(skills).length || 1)
  );
  const strongCount = Object.values(skills).filter((s) => s >= 70).length;
  const growthCount = Object.values(skills).filter((s) => s < 50).length;

  return (
    <div className="page-content">

      {/* ── Hero Banner ── */}
      <div className="page-hero">
        <div className="absolute -top-10 -right-10 w-56 h-56 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-300 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              {Object.keys(skills).length} Tracked Skills
            </div>
            <h2 className="text-2xl font-bold text-white">Verified Skill Taxonomy</h2>
            <p className="text-indigo-300 text-sm mt-1 max-w-lg">
              Your competency vector evaluated through deterministic skill tests and peer benchmarking.
            </p>
          </div>
          <Link
            href="/student/assessment"
            className="self-start sm:self-center inline-flex items-center gap-2 px-4 py-2.5 bg-white text-indigo-700 font-semibold text-sm rounded-xl hover:bg-indigo-50 transition-colors bouncy-hover"
          >
            <Zap className="w-4 h-4" /> Retake Diagnostic
          </Link>
        </div>
      </div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: 'Average Mastery',
            value: `${avgScore}%`,
            sub: 'Advanced Tier · Top 8%',
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
          },
          {
            label: 'Mastered Skills',
            value: strongCount.toString(),
            sub: '≥ 70% proficiency',
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
          },
          {
            label: 'Growth Areas',
            value: growthCount.toString(),
            sub: '< 50% proficiency',
            color: 'text-amber-600',
            bg: 'bg-amber-50',
          },
        ].map((stat) => (
          <div key={stat.label} className="clean-card flex flex-col gap-1">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-sm font-semibold text-slate-700">{stat.label}</div>
            <div className="text-xs text-slate-400">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Filter & Search ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Filter tabs */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
          {[
            { id: 'all', label: 'All' },
            { id: 'technical', label: 'Technical' },
            { id: 'soft', label: 'Soft Skills' },
            { id: 'tools', label: 'Tools' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === t.id
                  ? 'bg-white text-indigo-600 shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 sm:max-w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search skills…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
          />
        </div>
      </div>

      {/* ── Skills Grid ── */}
      <div>
        {filteredSkills.length === 0 ? (
          <div className="clean-card text-center py-12">
            <p className="text-slate-400 font-medium">No skills match your search.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredSkills.map(({ id, score, skill }) => {
              const isAdvanced = score >= 75;
              const isProficient = score >= 55 && score < 75;
              const isIntermediate = score >= 40 && score < 55;

              return (
                <div
                  key={id}
                  className="clean-card hover:border-indigo-200 transition-colors card-hover-playful"
                >
                  {/* Top row: name + level badge */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <h4 className="font-semibold text-slate-900">{skill.name}</h4>
                      <span className="text-xs text-slate-400 capitalize">{skill.category}</span>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex-shrink-0 ${
                        isAdvanced
                          ? 'bg-emerald-50 text-emerald-700'
                          : isProficient
                          ? 'bg-indigo-50 text-indigo-700'
                          : isIntermediate
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {isAdvanced ? '⭐ Advanced' : isProficient ? '✓ Proficient' : isIntermediate ? '▲ Intermediate' : '• Foundation'}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-slate-400">Proficiency</span>
                      <span className={`font-bold ${scoreColor(score)}`}>{score}%</span>
                    </div>
                    <div className="xp-bar-container">
                      <div
                        className={`h-full rounded-full ${scoreBarColor(score)} transition-all duration-700`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      Assessment Verified
                    </span>
                    <Link
                      href="/student/learning"
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      Improve →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
