'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, ExternalLink, CheckCircle, Clock, Sparkles, Zap, Award, Flame, PlayCircle, CheckCircle2 } from 'lucide-react';
import { DEMO_LEARNING_RESOURCES, DEMO_STUDENT_SKILLS } from '@/lib/demo-data';
import { ROLE_REQUIRED_SKILLS, SKILL_MAP } from '@/lib/skills-taxonomy';
import { toast } from 'sonner';

const SELECTED_ROLE = 'Machine Learning Engineer';

export default function LearningPage() {
  const [completed, setCompleted] = useState<Set<string>>(new Set(['lr-1']));

  // Find skill gaps for the target role
  const gaps = (ROLE_REQUIRED_SKILLS[SELECTED_ROLE] ?? [])
    .filter(({ skillId, required }) => (DEMO_STUDENT_SKILLS[skillId] ?? 0) < required)
    .sort((a, b) => {
      const gapA = a.required - (DEMO_STUDENT_SKILLS[a.skillId] ?? 0);
      const gapB = b.required - (DEMO_STUDENT_SKILLS[b.skillId] ?? 0);
      return gapB - gapA;
    });

  const gapSkillIds = new Set(gaps.map((g) => g.skillId));

  // Get resources for skill gaps first, then all others
  const gapResources = DEMO_LEARNING_RESOURCES.filter((r) => r.skillId && gapSkillIds.has(r.skillId));
  const otherResources = DEMO_LEARNING_RESOURCES.filter((r) => !r.skillId || !gapSkillIds.has(r.skillId));

  const toggleComplete = (id: string, title: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast.info(`Lesson reset: ${title}`);
      } else {
        next.add(id);
        toast.success(`🎉 +50 XP Earned! Completed: ${title}`);
      }
      return next;
    });
  };

  const completedCount = completed.size;
  const totalCount = DEMO_LEARNING_RESOURCES.length;
  const xpEarned = completedCount * 50;

  function ResourceCard({ resource, isPriority }: { resource: typeof DEMO_LEARNING_RESOURCES[0]; isPriority?: boolean }) {
    const isDone = completed.has(resource.id);
    return (
      <div
        className={`glass-card rounded-3xl p-5 border transition-all ${
          isDone
            ? 'border-emerald-200/80 bg-emerald-50/40 opacity-90'
            : 'border-slate-200/80 hover:border-indigo-300 card-hover-playful'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold ${
                isDone
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : isPriority
                  ? 'bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-md'
                  : 'bg-indigo-100 text-indigo-700'
              }`}
            >
              {isDone ? <CheckCircle2 className="w-6 h-6" /> : <PlayCircle className="w-6 h-6" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className={`font-extrabold text-sm sm:text-base ${isDone ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                  {resource.title}
                </h3>
                {isPriority && !isDone && (
                  <span className="badge-pill badge-pill-rose">
                    🔥 Gap Priority
                  </span>
                )}
                <span className="text-[11px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  +50 XP
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">{resource.description}</p>

              <div className="flex items-center gap-3 mt-3 flex-wrap text-xs">
                <span className="font-bold text-slate-700">{resource.provider}</span>
                <span className="flex items-center gap-1 text-slate-400 font-medium">
                  <Clock className="w-3.5 h-3.5" /> {resource.duration}
                </span>
                {resource.skillId && (
                  <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-extrabold rounded-lg text-[11px]">
                    #{SKILL_MAP[resource.skillId]?.name ?? resource.skillId}
                  </span>
                )}
                <span
                  className={`px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold ${
                    resource.level === 'beginner'
                      ? 'bg-emerald-50 text-emerald-700'
                      : resource.level === 'intermediate'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'bg-purple-50 text-purple-700'
                  }`}
                >
                  {resource.level?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-extrabold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Open
            </a>
            <button
              onClick={() => toggleComplete(resource.id, resource.title)}
              className={`text-xs px-4 py-2 rounded-xl font-black transition-all ${
                isDone
                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  : 'bg-slate-900 hover:bg-indigo-600 text-white shadow-md'
              }`}
            >
              {isDone ? '✓ Completed' : 'Complete (+50XP)'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-amber-300 text-xs font-black mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5" /> Gamified Learning Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Curated Learning Pathways</h1>
          <p className="text-indigo-200 text-sm mt-1 max-w-xl font-medium">
            Complete high-yield courses to directly close your skill gaps for <strong>{SELECTED_ROLE}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <div className="glass-card-dark rounded-2xl px-4 py-2.5 text-center border border-white/10">
            <div className="text-xs font-bold text-amber-300">XP Earned</div>
            <div className="text-xl font-black text-white">+{xpEarned} XP</div>
          </div>
        </div>
      </div>

      {/* Track Progress Card */}
      <div className="glass-card rounded-3xl p-6 border border-white shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs font-black text-indigo-600 uppercase tracking-wider">Current Pathway</div>
            <h2 className="text-lg font-black text-slate-900">{SELECTED_ROLE} Readiness Path</h2>
          </div>
          <div className="text-right">
            <span className="text-sm font-black text-slate-900">{completedCount} of {totalCount} Completed</span>
          </div>
        </div>

        <div className="xp-bar-container">
          <div
            className="xp-bar-fill"
            style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Priority Skill Gap Resources */}
      {gapResources.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" /> Priority Gap Closers
            </h2>
            <span className="badge-pill badge-pill-rose">High Impact</span>
          </div>
          <div className="space-y-3">
            {gapResources.map((r) => (
              <ResourceCard key={r.id} resource={r} isPriority />
            ))}
          </div>
        </div>
      )}

      {/* Other General Resources */}
      {otherResources.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" /> Core Skill Broadeners
          </h2>
          <div className="space-y-3">
            {otherResources.map((r) => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
