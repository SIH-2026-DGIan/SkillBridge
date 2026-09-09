'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ASSESSMENT_QUESTIONS, calculateSkillScores } from '@/lib/assessment-questions';
import { SKILL_MAP } from '@/lib/skills-taxonomy';
import { getSession, type UserSession, setSession } from '@/lib/user-session';
import { toast } from 'sonner';
import { ArrowRight, CheckCircle2, Circle, XCircle, ChevronRight, Target, BookOpen, Search, Briefcase } from 'lucide-react';

type Phase = 'intro' | 'quiz' | 'results';

export default function AssessmentPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [phase, setPhase] = useState<Phase>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [skillScores, setSkillScores] = useState<Record<string, number>>({});

  useEffect(() => {
    const s = getSession();
    setUser(s);
    if (s.isAssessed) {
      setPhase('results');
    }
  }, []);

  const question = ASSESSMENT_QUESTIONS[currentQ];
  const totalQuestions = ASSESSMENT_QUESTIONS.length;
  const progress = ((currentQ + 1) / totalQuestions) * 100;

  const handleSelect = (optionIndex: number) => {
    if (revealed) return;
    setSelectedOption(optionIndex);
  };

  const handleConfirm = useCallback(() => {
    if (selectedOption === null) return;
    setRevealed(true);
  }, [selectedOption]);

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
      
      const overallScore = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / (Object.values(scores).length || 1));
      const assessmentDate = new Date().toISOString();
      
      setSession({ isAssessed: true, assessmentDate, assessmentScore: overallScore });
      setUser(getSession());
      
      setPhase('results');
      toast.success('Assessment complete!');
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

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      {/* Intro Phase */}
      {phase === 'intro' && (
        <div className="space-y-8 lg:space-y-10">
          {/* Header */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Build Your Skill Profile</span>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">See where your skills stand</h1>
            <p className="text-base text-slate-600 max-w-2xl leading-relaxed">
              Take a short assessment to understand what you already know, what you can improve, and which opportunities could be a good fit for you.
            </p>
          </div>

          {/* Why it matters (Lifecycle Journey) - Compact */}
          <div className="hidden md:flex items-center justify-between gap-1 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex flex-col items-center text-center gap-2 flex-1">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-900">Check your skills</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0 -mt-5" />
            <div className="flex flex-col items-center text-center gap-2 flex-1">
              <div className="w-8 h-8 rounded-full bg-white text-slate-400 flex items-center justify-center border-2 border-slate-100">
                <Target className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-500">Understand your strengths</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0 -mt-5" />
            <div className="flex flex-col items-center text-center gap-2 flex-1">
              <div className="w-8 h-8 rounded-full bg-white text-slate-400 flex items-center justify-center border-2 border-slate-100">
                <Search className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-500">Find skill gaps</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0 -mt-5" />
            <div className="flex flex-col items-center text-center gap-2 flex-1">
              <div className="w-8 h-8 rounded-full bg-white text-slate-400 flex items-center justify-center border-2 border-slate-100">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-500">Get learning recommendations</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0 -mt-5" />
            <div className="flex flex-col items-center text-center gap-2 flex-1">
              <div className="w-8 h-8 rounded-full bg-white text-slate-400 flex items-center justify-center border-2 border-slate-100">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-500">Discover relevant opportunities</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column: Assessment & Outcomes */}
            <div className="lg:col-span-2 space-y-6">
              {/* Main Assessment Card */}
              <div className="p-6 md:p-8 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-2">Ready to discover your skills?</h2>
                  <p className="text-slate-600">Take a short assessment to understand your strengths and identify areas that can help you move toward your career goal.</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 py-4 border-y border-slate-100 text-sm">
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="font-bold">~10–15 minutes</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="font-bold">15 questions</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block"></div>
                  <div className="flex items-center gap-2 text-slate-600 font-medium">
                    Technical skills • Problem solving • Core concepts
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <button onClick={() => setPhase('quiz')} className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm">
                    Start Skill Assessment <ArrowRight className="w-5 h-5" />
                  </button>
                  <button className="w-full sm:w-auto px-6 py-4 text-slate-600 font-bold hover:text-slate-900 transition-colors">
                    How it works
                  </button>
                </div>
              </div>

              {/* What you'll get */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                  <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-600" /> Your Strengths
                  </h4>
                  <p className="text-slate-600 text-xs">See the skills you're already confident in.</p>
                </div>
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                  <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Search className="w-4 h-4 text-orange-600" /> Skills to Improve
                  </h4>
                  <p className="text-slate-600 text-xs">Understand which areas need more practice.</p>
                </div>
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                  <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-600" /> Better Opportunities
                  </h4>
                  <p className="text-slate-600 text-xs">Get recommendations based on your skills and goals.</p>
                </div>
              </div>
            </div>

            {/* Right Column: Context & Guidelines */}
            <div className="space-y-6">
              {/* Career Goal Context */}
              <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl">
                {user.targetRole ? (
                  <>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Your Career Goal</h3>
                    <div className="text-lg font-black text-slate-900 mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-600" /> {user.targetRole}
                    </div>
                    <p className="text-slate-600 text-sm">We'll use your goal to help identify the skills that matter for your path.</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Your Career Goal</h3>
                    <div className="text-lg font-black text-slate-900 mb-2">Choose a career goal</div>
                    <p className="text-slate-600 text-sm mb-4">Selecting a goal helps us give you more relevant skill recommendations.</p>
                    <button onClick={() => router.push('/student/profile')} className="w-full px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm">
                      Choose Career Goal <ArrowRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Before you start */}
              <div className="p-5">
                <h3 className="font-bold text-slate-900 mb-4">Before you start</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600 text-sm leading-tight">Answer based on what you know</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600 text-sm leading-tight">No negative marking</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600 text-sm leading-tight">Take your time and answer honestly</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz Phase */}
      {phase === 'quiz' && (
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">SkillBridge Skill Assessment</h2>
            <button onClick={() => setPhase('intro')} className="text-slate-500 hover:text-slate-700 font-bold text-sm transition-colors">
              Exit
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
            {/* Progress */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm font-bold text-slate-500">
                <span>Question {currentQ + 1} of {totalQuestions}</span>
                <span>{Math.round(progress)}% completed</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
            </div>

            {/* Question */}
            <div>
              <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md mb-4 uppercase tracking-wider">
                {SKILL_MAP[question.skillId]?.name ?? question.skillId}
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 leading-snug">
                {question.question}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selectedOption === index;
                const isCorrect = question.correctAnswer === index;
                
                let bgStyle = 'bg-white hover:bg-slate-50 border-slate-200';
                let icon = <Circle className="w-5 h-5 text-slate-300" />;

                if (revealed) {
                  if (isCorrect) {
                    bgStyle = 'bg-emerald-50 border-emerald-200 ring-1 ring-emerald-500';
                    icon = <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
                  } else if (isSelected) {
                    bgStyle = 'bg-red-50 border-red-200 ring-1 ring-red-500';
                    icon = <XCircle className="w-5 h-5 text-red-500" />;
                  } else {
                    bgStyle = 'bg-slate-50 border-slate-200 opacity-60';
                  }
                } else if (isSelected) {
                  bgStyle = 'bg-blue-50 border-blue-200 ring-1 ring-blue-500';
                  icon = <CheckCircle2 className="w-5 h-5 text-blue-600" />;
                }

                return (
                  <label key={index} className={`flex items-start gap-4 p-5 rounded-xl border-2 transition-all cursor-pointer ${bgStyle}`}>
                    <input
                      type="radio"
                      name="answer"
                      className="sr-only"
                      checked={isSelected}
                      disabled={revealed}
                      onChange={() => handleSelect(index)}
                    />
                    <div className="mt-0.5 flex-shrink-0">{icon}</div>
                    <span className={`text-base font-medium ${isSelected && !revealed ? 'text-blue-900' : 'text-slate-700'}`}>{option}</span>
                  </label>
                );
              })}
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-end">
              {!revealed ? (
                <button 
                  onClick={handleConfirm}
                  disabled={selectedOption === null}
                  className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-sm"
                >
                  Confirm Answer
                </button>
              ) : (
                <button 
                  onClick={handleNext}
                  className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  {currentQ === totalQuestions - 1 ? 'Finish Assessment' : 'Next Question'} <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Results Phase */}
      {phase === 'results' && (
        <div className="space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Your Skill Profile</span>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Your latest assessment</h1>
          </div>

          <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-8 max-w-3xl">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-1">Skill Assessment</h2>
                <div className="text-slate-500 font-medium">
                  {user.assessmentDate ? new Date(user.assessmentDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recently completed'}
                </div>
              </div>
              <div className="px-5 py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl font-black text-xl">
                {user.assessmentScore || 0}% Score
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider text-sm">Skills Assessed</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-sm font-bold">Technical skills</span>
                <span className="px-3 py-1.5 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-sm font-bold">Problem solving</span>
                <span className="px-3 py-1.5 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-sm font-bold">Core concepts</span>
              </div>
            </div>

            <div className="pt-6 flex flex-wrap gap-4">
              <button onClick={() => router.push('/student/skills')} className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto">
                View My Skills <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => router.push('/student/skill-gaps')} className="px-6 py-3.5 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto">
                See What I Can Improve <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={handleRetake} className="px-6 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto">
                Retake Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
