'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Zap, Clock, Sparkles, Award, ShieldCheck, Flame } from 'lucide-react';
import { ASSESSMENT_QUESTIONS, calculateSkillScores } from '@/lib/assessment-questions';
import { SKILL_MAP } from '@/lib/skills-taxonomy';
import { toast } from 'sonner';

type Phase = 'intro' | 'quiz' | 'results';

export default function AssessmentPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [skillScores, setSkillScores] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);

  const question = ASSESSMENT_QUESTIONS[currentQ];
  const totalQuestions = ASSESSMENT_QUESTIONS.length;
  const progress = ((currentQ + 1) / totalQuestions) * 100;

  const handleSelect = (optionIndex: number) => {
    if (revealed) return;
    setSelectedOption(optionIndex);
    setRevealed(true);
  };

  const handleNext = useCallback(() => {
    if (selectedOption === null) return;

    const newAnswers = { ...answers, [question.id]: selectedOption };
    setAnswers(newAnswers);
    setSelectedOption(null);
    setRevealed(false);

    if (currentQ < totalQuestions - 1) {
      setCurrentQ((q) => q + 1);
    } else {
      const scores = calculateSkillScores(newAnswers);
      setSkillScores(scores);
      setPhase('results');
      toast.success('🎉 +100 XP Earned! Skill Profile Calculated!');
    }
  }, [selectedOption, answers, question.id, currentQ, totalQuestions]);

  const handleRetake = () => {
    setPhase('intro');
    setCurrentQ(0);
    setAnswers({});
    setSelectedOption(null);
    setRevealed(false);
    setSkillScores({});
  };

  // ─── INTRO ───────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-amber-500/30">
            <Zap className="w-8 h-8 text-slate-900" />
          </div>

          <span className="badge-pill badge-pill-amber mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> +100 XP Reward Available
          </span>
          <h1 className="text-3xl font-black tracking-tight mb-2">AI Skill Diagnostic Quiz</h1>
          <p className="text-indigo-200 text-sm max-w-md mx-auto font-medium">
            15 rapid-fire questions across Python, SQL, ML, React, and soft skills to calibrate your match engine.
          </p>

          <div className="grid grid-cols-3 gap-3 my-8 max-w-lg mx-auto">
            {[
              { label: '15 Questions', sub: '~8 Minutes', icon: '⚡' },
              { label: '6 Domains', sub: 'Adaptive Logic', icon: '🎯' },
              { label: 'Real-time Vector', sub: 'Verified Badges', icon: '🛡️' },
            ].map((item) => (
              <div key={item.label} className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-center">
                <div className="text-xl mb-1">{item.icon}</div>
                <div className="font-black text-white text-xs">{item.label}</div>
                <div className="text-[10px] text-indigo-200 font-semibold">{item.sub}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setPhase('quiz')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-black text-sm rounded-2xl shadow-lg hover:shadow-amber-500/40 bouncy-hover transition-all"
          >
            Begin Diagnostic Quiz <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ─── RESULTS ─────────────────────────────────────────
  if (phase === 'results') {
    const chartData = Object.entries(skillScores)
      .sort(([, a], [, b]) => b - a)
      .map(([skillId, score]) => ({
        name: SKILL_MAP[skillId]?.name ?? skillId,
        score,
        color: score >= 75 ? '#10b981' : score >= 55 ? '#6366f1' : score >= 40 ? '#f59e0b' : '#f43f5e',
      }));

    const avgScore = Math.round(Object.values(skillScores).reduce((a, b) => a + b, 0) / (Object.values(skillScores).length || 1));

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-emerald-300 text-xs font-black mb-2 border border-white/10">
              <CheckCircle2 className="w-3.5 h-3.5" /> Assessment Completed · Level Up!
            </div>
            <h1 className="text-3xl font-black tracking-tight">Your Recalibrated Skill Vector</h1>
            <p className="text-indigo-200 text-sm mt-1">
              Your overall proficiency score is now calibrated across 6 domains.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10 flex-shrink-0">
            <div>
              <div className="text-4xl font-black text-emerald-300">{avgScore}%</div>
              <div className="text-[11px] font-bold text-indigo-200 uppercase">Composite Index</div>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="glass-card rounded-3xl p-6 border border-white shadow-lg">
          <h2 className="font-extrabold text-slate-900 text-base mb-4">Competency Breakdown</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11, fontWeight: 700, fill: '#334155' }} />
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Proficiency']}
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12, fontWeight: 700 }}
                />
                <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRetake}
            className="flex items-center gap-2 px-5 py-3 border border-slate-200 bg-white text-slate-700 font-extrabold text-xs rounded-2xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RotateCcw className="w-4 h-4" /> Retake Diagnostic
          </button>
          <button
            onClick={() => router.push('/student/skill-gaps')}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-extrabold text-xs rounded-2xl hover:bg-indigo-700 transition-colors shadow-md bouncy-hover"
          >
            View Career Gaps <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => router.push('/student/opportunities')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900 font-extrabold text-xs rounded-2xl hover:shadow-amber-500/30 transition-all bouncy-hover"
          >
            Explore AI Job Matches <Zap className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ─── QUIZ IN PROGRESS ─────────────────────────────────
  const isCorrect = selectedOption === question.correctAnswer;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress */}
      <div className="glass-card rounded-3xl p-4 border border-white shadow-sm">
        <div className="flex items-center justify-between mb-2 text-xs font-black">
          <span className="text-slate-800">
            Question {currentQ + 1} of {totalQuestions}
          </span>
          <span className="text-indigo-600 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> +100 XP upon completion
          </span>
        </div>
        <div className="xp-bar-container">
          <div className="xp-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl">
        <div className="mb-4">
          <span className="badge-pill badge-pill-purple">
            #{SKILL_MAP[question.skillId]?.name ?? question.skillId} · {question.difficulty?.toUpperCase()}
          </span>
        </div>

        <h2 className="text-base sm:text-lg font-black text-slate-900 mb-6 leading-relaxed">
          {question.question}
        </h2>

        <div className="space-y-3">
          {question.options.map((option, index) => {
            let style = 'border-2 border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/50';
            if (revealed) {
              if (index === question.correctAnswer) {
                style = 'border-2 border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-400/20';
              } else if (index === selectedOption) {
                style = 'border-2 border-rose-400 bg-rose-50 text-rose-900';
              } else {
                style = 'border-2 border-slate-100 bg-slate-50 text-slate-400';
              }
            } else if (index === selectedOption) {
              style = 'border-2 border-indigo-600 bg-indigo-50 text-indigo-900';
            }

            return (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={revealed}
                className={`w-full text-left px-5 py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center gap-3.5 ${style}`}
              >
                <span className="w-6 h-6 rounded-xl border border-current flex items-center justify-center text-xs font-black flex-shrink-0">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{option}</span>
                {revealed && index === question.correctAnswer && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 ml-auto flex-shrink-0" />
                )}
                {revealed && index === selectedOption && index !== question.correctAnswer && (
                  <XCircle className="w-5 h-5 text-rose-500 ml-auto flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {revealed && (
          <div
            className={`mt-5 p-4 rounded-2xl flex items-start gap-2.5 text-xs font-bold ${
              isCorrect ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /> Correct answer! Knowledge calibrated.
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" /> Incorrect answer. The correct option is highlighted in green.
              </>
            )}
          </div>
        )}
      </div>

      {/* Next Action Button */}
      <button
        onClick={handleNext}
        disabled={!revealed}
        className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-sm rounded-2xl shadow-lg hover:shadow-indigo-500/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed bouncy-hover"
      >
        {currentQ === totalQuestions - 1 ? (
          <>Compute Final Skill Vector <Zap className="w-4 h-4 text-amber-300" /></>
        ) : (
          <>Next Question <ArrowRight className="w-4 h-4" /></>
        )}
      </button>
    </div>
  );
}
