'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  Target, BookOpen, ArrowRight, 
  CheckCircle2, TrendingUp, AlertTriangle, Briefcase 
} from 'lucide-react';
import { ROLE_REQUIRED_SKILLS, TARGET_ROLES, SKILL_MAP } from '@/lib/skills-taxonomy';
import { DEMO_STUDENT_SKILLS, DEMO_LEARNING_RESOURCES } from '@/lib/demo-data';
import { getStudentSkills, getSession } from '@/lib/user-session';

const WHY_MATTERS: Record<string, string> = {
  python: 'Critical for data science workflows and backend systems.',
  javascript: 'Essential for modern web application interactivity.',
  typescript: 'Prevents runtime errors and improves code maintainability.',
  react: 'The standard for building scalable user interfaces.',
  sql: 'Required for effective database querying and management.',
  machine_learning: 'Strengthens your fit for ML-focused roles.',
  data_analysis: 'Improves your ability to work with real-world datasets.',
  deep_learning: 'Needed for advanced AI and computer vision tasks.',
  html_css: 'Important for building production-ready web interfaces.',
  aws: 'Essential for deploying and scaling applications in the cloud.',
  docker: 'Required for modern containerized development and CI/CD.',
  git: 'Fundamental for version control and team collaboration.'
};

export default function SkillGapsPage() {
  const [user, setUser] = useState<any>(null);
  const [skills, setSkills] = useState<Record<string, number>>(DEMO_STUDENT_SKILLS);

  useEffect(() => {
    setUser(getSession());
    const sync = () => {
      setSkills(getStudentSkills());
    };
    sync();
    window.addEventListener('sb_skills_updated', sync);
    return () => {
      window.removeEventListener('sb_skills_updated', sync);
    };
  }, []);

  const targetRole = user?.targetRole || 'Software Developer';

  const gapData = useMemo(() => {
    const required = ROLE_REQUIRED_SKILLS[targetRole] ?? ROLE_REQUIRED_SKILLS['Software Developer'];
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
    }).sort((a, b) => b.gap - a.gap);
  }, [targetRole, skills]);

  const matchPercent = useMemo(() => {
    if (gapData.length === 0) return 0;
    const total = gapData.reduce((sum, { current, required }) => {
      return sum + Math.min(current / required, 1);
    }, 0);
    return Math.round((total / gapData.length) * 100);
  }, [gapData]);

  const skillsToImprove = gapData.filter((d) => d.gap > 0);
  const skillsMet = gapData.filter((d) => d.gap === 0);
  const biggestGaps = skillsToImprove.slice(0, 3);

  const relevantResources = DEMO_LEARNING_RESOURCES.filter((r) =>
    skillsToImprove.some((s) => s.skillId === r.skillId)
  ).slice(0, 4);

  if (!user) return null;

  return (
    <div className="w-full relative">
      <div className="max-w-[1100px] mx-auto w-full flex flex-col gap-10 pb-16 px-4 sm:px-6 py-6 md:py-8">
        
        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="flex flex-col max-w-2xl">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Skills to Improve</h1>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
              See which skills are holding you back from your career goal and what you can do to strengthen them.
            </p>
          </div>
          
          <div className="flex items-center gap-6 md:justify-end shrink-0">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Target Role</span>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{targetRole}</div>
            </div>
            <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Overall Readiness</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black text-blue-600 leading-none">{matchPercent}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2 — CAREER READINESS */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-900 mb-5">Your Career Readiness</h2>
          
          <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-6">
            <div className="flex items-center gap-8">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Target Role</span>
                <span className="text-sm font-bold text-slate-900">{targetRole}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Overall Fit</span>
                <span className="text-sm font-bold text-slate-900">{matchPercent}%</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Skills Meeting Target</span>
                <span className="text-sm font-bold text-emerald-600">{skillsMet.length} / {gapData.length}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Skills to Strengthen</span>
                <span className="text-sm font-bold text-amber-600">{skillsToImprove.length}</span>
              </div>
            </div>
          </div>

          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-5">
            <div 
              className="h-full bg-blue-600 transition-all duration-700 rounded-full" 
              style={{ width: `${matchPercent}%` }}
            ></div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
              You are strongest in <strong className="text-slate-800">{skillsMet.slice(0, 3).map(s => s.name).join(', ')}</strong>. 
              {skillsToImprove.length > 0 && (
                <> Improving <strong className="text-slate-800">{biggestGaps.map(s => s.name).join(', ')}</strong> will increase your readiness for your target role.</>
              )}
            </p>
            <Link href="/student/skills" className="shrink-0 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
              View Full Skill Analysis →
            </Link>
          </div>
        </div>

        {/* SECTION 1 — YOUR BIGGEST SKILL GAPS */}
        {biggestGaps.length > 0 && (
          <div>
            <div className="mb-5">
              <h2 className="text-lg font-black text-slate-900">Your Biggest Skill Gaps</h2>
              <p className="text-sm text-slate-600 mt-0.5">Focus on the skills that will have the greatest impact on your target role.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {biggestGaps.map((skill) => (
                <div key={skill.skillId} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-4">{skill.name}</h3>
                    
                    <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider mb-2">
                      <span className="text-slate-500">Current: {skill.current}%</span>
                      <span className="text-slate-500">Target: {skill.required}%</span>
                    </div>
                    
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden relative mb-1.5">
                      <div className="absolute left-0 top-0 bottom-0 bg-blue-600" style={{ width: `${skill.current}%` }}></div>
                    </div>
                    
                    <div className="text-right mb-5">
                      <span className="text-[11px] font-bold text-amber-600">Gap: {skill.gap}%</span>
                    </div>

                    <div className="mb-6">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Why it matters</span>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {WHY_MATTERS[skill.skillId] || 'Improves your core competency for your target role.'}
                      </p>
                    </div>
                  </div>

                  <Link href="/student/learning" className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
                    View Learning Path <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3 — WHAT TO IMPROVE FIRST */}
        {skillsToImprove.length > 0 && (
          <div>
            <h2 className="text-lg font-black text-slate-900 mb-5">Recommended Priority</h2>
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              {skillsToImprove.map((skill, index) => (
                <div key={skill.skillId} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 hover:bg-slate-50 transition-colors ${index !== skillsToImprove.length - 1 ? 'border-b border-slate-100' : ''}`}>
                  <div className="flex items-center gap-4 min-w-[200px]">
                    <span className="text-xs font-black text-slate-400 w-5">{(index + 1).toString().padStart(2, '0')}</span>
                    <span className="text-sm font-bold text-slate-900">{skill.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-6 sm:gap-10 flex-1 sm:justify-end">
                    <div className="flex flex-col min-w-[80px]">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Level</span>
                      <span className="text-sm font-semibold text-slate-700">{skill.current}% / {skill.required}%</span>
                    </div>
                    
                    <div className="flex flex-col min-w-[80px]">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Gap</span>
                      <span className="text-sm font-bold text-amber-600">{skill.gap}%</span>
                    </div>

                    <div className="flex flex-col min-w-[80px]">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Priority</span>
                      <span className={`text-sm font-bold ${index < 2 ? 'text-rose-600' : 'text-slate-700'}`}>
                        {index < 2 ? 'High' : 'Medium'}
                      </span>
                    </div>
                    
                    <div className="hidden md:block">
                      <Link href="/student/learning" className="px-4 py-2 bg-white border border-slate-200 hover:border-blue-600 hover:text-blue-600 text-slate-700 text-xs font-bold rounded-lg transition-colors shadow-sm">
                        Start Learning →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4 — PERSONALIZED LEARNING PATH */}
        {relevantResources.length > 0 && (
          <div>
            <div className="mb-5">
              <h2 className="text-lg font-black text-slate-900">Your Recommended Learning Path</h2>
              <p className="text-sm text-slate-600 mt-0.5">Learning recommendations based on your skill gaps and career goal.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {relevantResources.map((resource) => (
                <div key={resource.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">{resource.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                      {resource.description}
                    </p>
                    
                    <div className="space-y-2 mb-6">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Skill Addressed</span>
                        <span className="text-xs font-semibold text-slate-800">{SKILL_MAP[resource.skillId]?.name || resource.skillId}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">Estimated Effort</span>
                        <span className="text-xs font-semibold text-slate-800">{resource.duration}</span>
                      </div>
                    </div>
                  </div>
                  
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg text-center transition-colors shadow-sm">
                    View Course →
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 5 — PROGRESS */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-900 mb-5">Your Improvement Progress</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative">
            {/* Connecting Line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -z-10 -translate-y-1/2"></div>
            
            <div className="flex flex-col items-center text-center bg-white p-2">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-2 border border-blue-100">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-900">{gapData.length} skills identified</span>
            </div>
            
            <div className="hidden md:block text-slate-300 bg-white px-2">→</div>
            
            <div className="flex flex-col items-center text-center bg-white p-2">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-2 border border-amber-100">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-900">0 skills currently improving</span>
            </div>
            
            <div className="hidden md:block text-slate-300 bg-white px-2">→</div>
            
            <div className="flex flex-col items-center text-center bg-white p-2">
              <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center font-bold mb-2 border border-slate-200">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-900">{skillsToImprove.length} skills remaining</span>
            </div>
            
            <div className="hidden md:block text-slate-300 bg-white px-2">→</div>
            
            <div className="flex flex-col items-center text-center bg-white p-2">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-2 border border-emerald-100">
                <Target className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-900">Target readiness: 85%</span>
            </div>
          </div>
        </div>

        {/* SECTION 6 — OPPORTUNITY IMPACT */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                Improve Your Skills <ArrowRight className="w-5 h-5 text-slate-400" /> Unlock More Opportunities
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Strengthening your priority skills can improve your match with internships, projects and entry-level opportunities.
              </p>
            </div>
            <Link href="/student/opportunities" className="shrink-0 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm">
              Explore Opportunities →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <Briefcase className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Software Developer Intern</span>
              </div>
              <div className="space-y-3 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-600">Current Match</span>
                  <span className="text-xs font-bold text-slate-900">{matchPercent}%</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-900">Potential Match</span>
                  <span className="text-xs font-black text-emerald-600">82%</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <Briefcase className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Frontend Developer Intern</span>
              </div>
              <div className="space-y-3 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-600">Current Match</span>
                  <span className="text-xs font-bold text-slate-900">{Math.min(100, matchPercent + 3)}%</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-900">Potential Match</span>
                  <span className="text-xs font-black text-emerald-600">86%</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500 mb-2">
                <Briefcase className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Junior Software Developer</span>
              </div>
              <div className="space-y-3 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-600">Current Match</span>
                  <span className="text-xs font-bold text-slate-900">{Math.max(0, matchPercent - 8)}%</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-900">Potential Match</span>
                  <span className="text-xs font-black text-emerald-600">78%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
