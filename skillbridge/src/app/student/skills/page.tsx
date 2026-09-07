'use client';

import { useState, useEffect } from 'react';
import { DEMO_STUDENT_SKILLS } from '@/lib/demo-data';
import { SKILL_MAP, SKILLS } from '@/lib/skills-taxonomy';
import { scoreBarColor, scoreColor } from '@/lib/utils';
import { Target, TrendingUp, Sparkles, Plus, Award, CheckCircle2, ShieldCheck, Zap, Filter, Search, UploadCloud } from 'lucide-react';
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

  const filteredSkills = allSkills.filter(({ id, skill }) => {
    const matchesSearch = skill.name.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'all') return true;
    if (filter === 'technical') return skill.category === 'technical';
    if (filter === 'soft') return skill.category === 'soft';
    if (filter === 'tools') return id === 'git' || id === 'docker' || id === 'aws';
    return true;
  }).sort((a, b) => b.score - a.score);

  const avgScore = Math.round(
    Object.values(skills).reduce((a, b) => a + b, 0) /
    (Object.values(skills).length || 1)
  );

  const strongCount = Object.values(skills).filter((s) => s >= 70).length;
  const growthCount = Object.values(skills).filter((s) => s < 50).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-amber-300 text-xs font-black mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" /> 15 Tracked Skills
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Verified Skill Taxonomy</h1>
          <p className="text-indigo-200 text-sm mt-1 max-w-xl font-medium">
            Your competency vector evaluated through deterministic skill tests and peer benchmarking.
          </p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <Link
            href="/student/assessment"
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 text-sm font-extrabold rounded-2xl shadow-lg hover:shadow-amber-500/30 bouncy-hover transition-all"
          >
            <Zap className="w-4 h-4" /> Retake Diagnostic
          </Link>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-3xl p-5 border border-white shadow-md flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-md">
            {avgScore}%
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Mastery</div>
            <div className="text-lg font-black text-slate-900">Advanced Tier</div>
            <div className="text-[11px] font-semibold text-emerald-600">Top 8% percentile</div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-white shadow-md flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-white font-black text-xl shadow-md">
            {strongCount}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mastered Competencies</div>
            <div className="text-lg font-black text-slate-900">≥ 70% Proficiency</div>
            <div className="text-[11px] font-semibold text-slate-500">Ready for job matching</div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-5 border border-white shadow-md flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white font-black text-xl shadow-md">
            {growthCount}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Growth Areas</div>
            <div className="text-lg font-black text-slate-900">&lt; 50% Proficiency</div>
            <Link href="/student/learning" className="text-[11px] font-bold text-indigo-600 hover:underline">
              View learning paths →
            </Link>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card rounded-3xl p-4 border border-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex p-1 bg-slate-100 rounded-2xl gap-1 w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Skills' },
            { id: 'technical', label: 'Technical' },
            { id: 'soft', label: 'Soft Skills' },
            { id: 'tools', label: 'Tools & DevOps' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === t.id
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredSkills.map(({ id, score, skill }) => {
          const isAdvanced = score >= 75;
          const isProficient = score >= 55 && score < 75;
          const isIntermediate = score >= 40 && score < 55;

          return (
            <div
              key={id}
              className="glass-card rounded-3xl p-5 border border-slate-200/80 hover:border-indigo-200 shadow-sm card-hover-playful flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs">
                      {skill.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">{skill.name}</h3>
                      <span className="text-[10px] uppercase font-bold text-slate-400">{skill.category}</span>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-black px-2.5 py-0.5 rounded-full ${
                      isAdvanced
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : isProficient
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : isIntermediate
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {isAdvanced ? '⭐ Advanced' : isProficient ? '✓ Proficient' : isIntermediate ? '▲ Intermediate' : '• Foundation'}
                  </span>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-xs font-black mb-1">
                    <span className="text-slate-500 font-semibold">Proficiency Score</span>
                    <span className={scoreColor(score)}>{score}%</span>
                  </div>
                  <div className="xp-bar-container">
                    <div
                      className={`h-full rounded-full ${scoreBarColor(score)} transition-all duration-700`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Assessment Verified
                </span>
                <Link
                  href="/student/learning"
                  className="font-bold text-indigo-600 hover:text-indigo-800"
                >
                  Improve Skill →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
