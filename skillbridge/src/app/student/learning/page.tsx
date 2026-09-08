'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, BookOpen, Clock, 
  CheckCircle2, Target, Briefcase, Plus, Award, 
  ChevronRight, CircleDashed, BarChart2, Activity, PlayCircle
} from 'lucide-react';
import { ROLE_REQUIRED_SKILLS, SKILL_MAP } from '@/lib/skills-taxonomy';
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
  git: 'Git is commonly expected for collaborative software development.'
};

export default function LearningPage() {
  const [user, setUser] = useState<any>(null);
  const [skills, setSkills] = useState<Record<string, number>>(DEMO_STUDENT_SKILLS);

  useEffect(() => {
    setUser(getSession());
    const sync = () => setSkills(getStudentSkills());
    sync();
    window.addEventListener('sb_skills_updated', sync);
    return () => window.removeEventListener('sb_skills_updated', sync);
  }, []);

  const targetRole = user?.targetRole || null;

  const gapData = useMemo(() => {
    if (!targetRole) return [];
    const required = ROLE_REQUIRED_SKILLS[targetRole] ?? [];
    return required.map(({ skillId, required: req }) => {
      const current = skills[skillId] ?? 0;
      const gap = Math.max(0, req - current);
      return {
        name: SKILL_MAP[skillId]?.name ?? skillId,
        skillId,
        current,
        required: req,
        gap,
      };
    }).sort((a, b) => b.gap - a.gap);
  }, [targetRole, skills]);

  const matchPercent = useMemo(() => {
    if (gapData.length === 0) return 0;
    const total = gapData.reduce((sum, { current, required }) => sum + Math.min(current / required, 1), 0);
    return Math.round((total / gapData.length) * 100);
  }, [gapData]);

  const skillsToImprove = gapData.filter((d) => d.gap > 0);
  const skillsMetCount = gapData.length - skillsToImprove.length;
  
  const relevantResources = useMemo(() => {
    return skillsToImprove.map(skill => {
      const resource = DEMO_LEARNING_RESOURCES.find(r => r.skillId === skill.skillId);
      return { skill, resource };
    });
  }, [skillsToImprove]);

  const totalSkillsCount = Object.keys(skills).length;

  if (!user) return null;

  // 14. EMPTY STATES
  if (totalSkillsCount === 0 || (!targetRole)) {
    return (
      <div className="w-full relative">
        <div className="max-w-[1100px] mx-auto w-full flex flex-col gap-10 pb-16 px-4 sm:px-6 py-6 md:py-8">
          <div className="text-center py-24 bg-white rounded-xl border border-slate-200 shadow-sm max-w-2xl mx-auto w-full">
            <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3">Your learning plan will appear here</h3>
            <p className="text-sm text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
              Complete your profile and skill assessment first. SkillBridge will use your results to identify skill gaps and recommend what to learn.
            </p>
            <Link href="/student/assessment" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm inline-flex items-center gap-2">
              Check Your Skills <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (skillsToImprove.length === 0) {
    return (
      <div className="w-full relative">
        <div className="max-w-[1100px] mx-auto w-full flex flex-col gap-10 pb-16 px-4 sm:px-6 py-6 md:py-8">
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm max-w-2xl mx-auto w-full">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl font-black text-slate-900 mb-3">You're currently meeting the requirements for your target role.</h3>
            <p className="text-sm text-slate-600 mb-8 max-w-md mx-auto">
              Keep building evidence through projects, certifications and practical experience.
            </p>
            <Link href="/student/opportunities" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm inline-flex items-center gap-2">
              Explore Opportunities <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const topFocus = relevantResources[0];

  return (
    <div className="w-full relative">
      <div className="max-w-[1100px] mx-auto w-full flex flex-col gap-6 pb-16 px-4 sm:px-6 py-6 md:py-8">
        
        {/* 1. HEADER */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex flex-col max-w-2xl">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Learning Plan</h1>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Build the skills you need for your career goal through a focused, step-by-step learning path.
            </p>
          </div>
          
          <div className="flex bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden shrink-0">
            <div className="px-5 py-4 border-r border-slate-100 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Target Role</span>
              <span className="text-sm font-bold text-slate-900">{targetRole}</span>
            </div>
            <div className="px-5 py-4 flex flex-col justify-center bg-slate-50">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Readiness</span>
              <span className="text-xl font-black text-blue-600 leading-none">{matchPercent}%</span>
            </div>
          </div>
        </div>

        {/* 2. READINESS OVERVIEW HORIZONTAL DASHBOARD */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-slate-500 font-bold text-[10px] uppercase tracking-wider">
            <Activity className="w-4 h-4 text-slate-400" /> Career Readiness
          </div>
          <div className="flex items-center gap-8 md:gap-16">
            <div className="text-center">
              <div className="text-2xl font-black text-slate-900 mb-1">{matchPercent}%</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Readiness</div>
            </div>
            <div className="w-px h-10 bg-slate-200"></div>
            <div className="text-center">
              <div className="text-2xl font-black text-emerald-600 mb-1">{skillsMetCount} / {gapData.length}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Skills meeting target</div>
            </div>
            <div className="w-px h-10 bg-slate-200"></div>
            <div className="text-center">
              <div className="text-2xl font-black text-amber-600 mb-1">{skillsToImprove.length}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Skills to strengthen</div>
            </div>
          </div>
        </div>

        {/* 3. MAIN CONTENT — TWO COLUMN */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 mt-2">
          
          {/* LEFT COLUMN 70% */}
          <div className="flex flex-col gap-8">
            
            {/* 4. LEFT — YOUR NEXT BEST STEP */}
            {topFocus && (
              <div className="bg-white border-2 border-amber-100 rounded-xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-amber-500"></div>
                <div className="p-6 md:p-8">
                  <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md uppercase tracking-wider mb-4 inline-block">
                    Your Next Best Step
                  </span>
                  
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-8 border-b border-slate-100">
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 mb-3">{topFocus.skill.name}</h2>
                      <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <span>Current level <span className="text-slate-900">{topFocus.skill.current}%</span></span>
                        <div className="w-px h-3 bg-slate-300"></div>
                        <span>Target <span className="text-slate-900">{topFocus.skill.required}%</span></span>
                        <div className="w-px h-3 bg-slate-300"></div>
                        <span className="text-amber-600">Gap {topFocus.skill.gap}%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">Recommended action:</h3>
                    {topFocus.resource ? (
                      <>
                        <div className="text-base font-bold text-blue-600 mb-2">{topFocus.resource.title}</div>
                        <p className="text-sm text-slate-600 leading-relaxed max-w-xl mb-4">{topFocus.resource.description}</p>
                        <div className="text-xs font-semibold text-slate-500 mb-6 flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-slate-400" /> Estimated effort: {topFocus.resource.duration}
                        </div>
                        <a href={topFocus.resource.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-lg transition-colors shadow-sm">
                          Start Learning →
                        </a>
                      </>
                    ) : (
                      <>
                        <div className="text-base font-bold text-slate-900 mb-2">Practice {topFocus.skill.name} through a real project</div>
                        <p className="text-sm text-slate-600 leading-relaxed max-w-xl mb-6">Build a small project to demonstrate practical {topFocus.skill.name} usage.</p>
                        <Link href="/student/opportunities" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-lg transition-colors shadow-sm">
                          Find Practice Projects →
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 5. LEFT — LEARNING ROADMAP */}
            <div>
              <h2 className="text-lg font-black text-slate-900 mb-6">Your Learning Roadmap</h2>
              
              <div className="relative">
                {/* Vertical Timeline Line */}
                <div className="absolute left-[19px] top-4 bottom-4 w-px bg-slate-200"></div>
                
                <div className="space-y-0">
                  {relevantResources.map(({ skill, resource }, index) => {
                    const progressPercent = Math.min(100, Math.max(0, (skill.current / skill.required) * 100));
                    
                    return (
                      <div key={skill.skillId} className="relative flex items-stretch py-4">
                        {/* Node Indicator */}
                        <div className="w-10 flex-shrink-0 flex justify-center z-10 pt-1 relative">
                          <div className={`w-10 h-10 bg-white flex items-center justify-center`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black border-2
                              ${index === 0 ? 'bg-blue-600 border-blue-600 text-white shadow-sm ring-4 ring-blue-50' : 'bg-white border-slate-200 text-slate-400'}
                            `}>
                              {(index + 1).toString().padStart(2, '0')}
                            </div>
                          </div>
                        </div>

                        {/* Roadmap Card Content */}
                        <div className="flex-1 ml-4 bg-white border border-slate-200 hover:border-slate-300 transition-colors rounded-xl p-4 shadow-sm group">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                            <div className="flex items-center gap-3">
                              <h3 className="text-sm font-black text-slate-900">{skill.name}</h3>
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">Gap {skill.gap}%</span>
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider hidden sm:inline-block">Priority: {index < 2 ? 'High' : 'Medium'}</span>
                            </div>
                            
                            {resource ? (
                              <a href={resource.url} target="_blank" rel="noopener noreferrer" className={`text-xs font-bold px-4 py-1.5 rounded-lg border transition-colors whitespace-nowrap
                                ${index === 0 ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}
                              `}>
                                {index === 0 ? 'Start →' : 'View →'}
                              </a>
                            ) : (
                              <Link href="/student/opportunities" className="text-xs font-bold px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors whitespace-nowrap">
                                {index === 0 ? 'Start →' : 'View →'}
                              </Link>
                            )}
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-slate-700 mb-1 line-clamp-1">
                                {resource ? resource.title : 'Practice projects recommended'}
                              </p>
                              {resource && (
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{resource.duration}</p>
                              )}
                            </div>

                            {/* 6. SKILL GAP VISUALIZATION */}
                            <div className="w-full sm:w-48 shrink-0">
                              <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                <span>Current {skill.current}%</span>
                                <span>Target {skill.required}%</span>
                              </div>
                              <div className="flex h-1.5 bg-amber-100 rounded-full overflow-hidden w-full relative">
                                <div className="absolute left-0 top-0 bottom-0 bg-blue-600 rounded-full z-10" style={{ width: `${progressPercent}%` }}></div>
                                <div className="absolute top-0 bottom-0 bg-amber-400 z-0" style={{ left: `${progressPercent}%`, right: 0 }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN 30% */}
          <div className="flex flex-col gap-5">
            
            {/* 7. CAREER READINESS STICKY CARD */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm sticky top-6">
              <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-5">Career Readiness</h2>
              
              <div className="flex items-center gap-5 mb-5">
                <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    <path className="text-blue-600" strokeDasharray={`${matchPercent}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                  </svg>
                  <span className="absolute text-sm font-black text-slate-900">{matchPercent}%</span>
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900">{targetRole}</div>
                </div>
              </div>

              <div className="text-xs font-semibold text-slate-600 mb-4 pb-4 border-b border-slate-100">
                <div><span className="font-bold text-slate-900">{gapData.length}</span> skills mapped</div>
                <div className="mt-1"><span className="font-bold text-emerald-600">{skillsMetCount}</span> meeting target</div>
                <div className="mt-1"><span className="font-bold text-amber-600">{skillsToImprove.length}</span> to strengthen</div>
              </div>

              <Link href="/student/skill-gaps" className="block text-center px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors shadow-sm w-full">
                View Skill Gaps →
              </Link>
            </div>

            {/* 8. CURRENT FOCUS */}
            {topFocus && (
              <div className="bg-white border border-slate-200 border-t-4 border-t-amber-500 rounded-xl p-5 shadow-sm">
                <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Current Focus</h2>
                
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-black text-slate-900">{topFocus.skill.name}</h3>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                    {topFocus.skill.gap}% gap
                  </span>
                </div>

                <div className="mb-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Why this matters</span>
                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{WHY_MATTERS[topFocus.skill.skillId] || 'Improves your core competency for your target role.'}"
                  </p>
                </div>

                {topFocus.resource ? (
                  <a href={topFocus.resource.url} target="_blank" rel="noopener noreferrer" className="block text-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors shadow-sm w-full">
                    Start Learning →
                  </a>
                ) : (
                  <Link href="/student/opportunities" className="block text-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors shadow-sm w-full">
                    Find Practice →
                  </Link>
                )}
              </div>
            )}

            {/* 9. LEARNING PROGRESS */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-4">Learning Progress</h2>
              
              <div className="flex justify-between items-end mb-2">
                <span className="text-2xl font-black text-slate-900 leading-none">0%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mb-2 overflow-hidden">
                 <div className="h-full bg-blue-600 rounded-full w-0"></div>
              </div>
              <div className="text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">0 / {relevantResources.length} completed</div>

              <div className="space-y-2 text-xs font-semibold">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Not started</span>
                  <span className="font-bold text-slate-900">{relevantResources.length}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>In progress</span>
                  <span className="font-bold text-slate-900">0</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Completed</span>
                  <span className="font-bold text-slate-900">0</span>
                </div>
              </div>
            </div>

            {/* 10. QUICK ACTIONS */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Actions</h2>
              <div className="flex flex-col gap-2">
                <Link href="/student/assessment" className="px-3 py-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center transition-colors">
                  Check Your Skills →
                </Link>
                <Link href="/student/portfolio" className="px-3 py-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center transition-colors">
                  Add Project →
                </Link>
                <Link href="/student/portfolio" className="px-3 py-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-center transition-colors">
                  Add Certification →
                </Link>
              </div>
            </div>
            
          </div>
        </div>

        {/* 12. WHAT HAPPENS NEXT (Removed large workflow) */}
        <div className="mt-8 border-t border-slate-200 pt-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 w-full sm:w-1/4">
              <div className="w-8 h-8 rounded bg-slate-50 border border-slate-200 text-slate-500 flex items-center justify-center font-black text-[10px] shrink-0">01</div>
              <div>
                <div className="text-xs font-bold text-slate-900 mb-0.5">Learn</div>
                <div className="text-[10px] text-slate-500 font-semibold leading-tight">Complete recommended resources</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 hidden sm:block shrink-0" />
            
            <div className="flex items-center gap-4 w-full sm:w-1/4">
              <div className="w-8 h-8 rounded bg-slate-50 border border-slate-200 text-slate-500 flex items-center justify-center font-black text-[10px] shrink-0">02</div>
              <div>
                <div className="text-xs font-bold text-slate-900 mb-0.5">Practice</div>
                <div className="text-[10px] text-slate-500 font-semibold leading-tight">Apply the skill in a project</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 hidden sm:block shrink-0" />
            
            <div className="flex items-center gap-4 w-full sm:w-1/4">
              <div className="w-8 h-8 rounded bg-slate-50 border border-slate-200 text-slate-500 flex items-center justify-center font-black text-[10px] shrink-0">03</div>
              <div>
                <div className="text-xs font-bold text-slate-900 mb-0.5">Add Evidence</div>
                <div className="text-[10px] text-slate-500 font-semibold leading-tight">Add projects or certifications</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 hidden sm:block shrink-0" />
            
            <div className="flex items-center gap-4 w-full sm:w-1/4">
              <div className="w-8 h-8 rounded bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-black text-[10px] shrink-0">04</div>
              <div>
                <div className="text-xs font-bold text-blue-600 mb-0.5">Reassess</div>
                <div className="text-[10px] text-blue-600/70 font-semibold leading-tight">Update your skill profile</div>
              </div>
            </div>
          </div>
          <div className="text-center mt-6">
            <span className="text-[10px] text-slate-400 italic">Your learning recommendations are based on your target role and identified skill gaps.</span>
          </div>
        </div>

        {/* 13. OPPORTUNITY CONNECTION */}
        <div className="mt-4 bg-slate-900 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-lg font-black text-white mb-2 tracking-tight">Ready to put your skills to work?</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              As your skill profile improves, SkillBridge can connect you with relevant internships, projects and entry-level opportunities.
            </p>
          </div>
          <Link href="/student/opportunities" className="shrink-0 px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 text-sm font-bold rounded-xl transition-colors shadow-sm inline-flex items-center gap-2">
            Explore Opportunities <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
