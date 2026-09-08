'use client';

import { useState, useEffect, useMemo } from 'react';
import { DEMO_STUDENT_SKILLS } from '@/lib/demo-data';
import { SKILL_MAP, ROLE_REQUIRED_SKILLS } from '@/lib/skills-taxonomy';
import { getStudentSkills, getSession } from '@/lib/user-session';
import Link from 'next/link';
import { 
  Search, ArrowRight, FileText, 
  HelpCircle, CheckCircle2,
  X, Target, Award,
  Terminal, TrendingUp
} from 'lucide-react';

type SkillStatus = 'Verified' | 'From Resume' | 'From Project' | 'Self Reported' | 'Needs Verification';
type DeclaredLevel = 'Beginner' | 'Intermediate' | 'Advanced' | null;

interface SkillData {
  id: string;
  score: number;
  skill: { id: string; name: string; category: string };
  declaredLevel: DeclaredLevel;
  status: SkillStatus;
  evidence: string[];
  isVerified: boolean;
  isImprove: boolean;
  target: number;
  mismatch: boolean;
}

export default function SkillsPage() {
  const [user, setUser] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'verified' | 'to-improve'>('all');
  const [search, setSearch] = useState('');
  const [skills, setSkills] = useState<Record<string, number>>(DEMO_STUDENT_SKILLS);
  const [declaredLevels, setDeclaredLevels] = useState<Record<string, DeclaredLevel>>({});
  
  const [selectedSkill, setSelectedSkill] = useState<SkillData | null>(null);
  const [editingSkill, setEditingSkill] = useState<{ id: string; name: string } | null>(null);
  const [tempLevel, setTempLevel] = useState<DeclaredLevel>(null);

  useEffect(() => {
    setUser(getSession());
    const sync = () => setSkills(getStudentSkills());
    sync();
    
    const storedLevels = localStorage.getItem('sb_declared_levels');
    if (storedLevels) {
      try {
        setDeclaredLevels(JSON.parse(storedLevels));
      } catch (e) {}
    }
    
    window.addEventListener('sb_skills_updated', sync);
    return () => window.removeEventListener('sb_skills_updated', sync);
  }, []);

  const handleSetLevel = (skillId: string, level: DeclaredLevel) => {
    const next = { ...declaredLevels, [skillId]: level };
    setDeclaredLevels(next);
    localStorage.setItem('sb_declared_levels', JSON.stringify(next));
    setEditingSkill(null);
  };

  const allSkills = useMemo(() => {
    const roleReqs = user?.targetRole ? ROLE_REQUIRED_SKILLS[user.targetRole] || [] : [];
    const reqMap = new Map(roleReqs.map(r => [r.skillId, r.required]));

    return Object.entries(skills).map(([id, score]) => {
      const skill = SKILL_MAP[id] ?? { id, name: id, category: 'technical' };
      const declaredLevel = declaredLevels[id] || null;
      
      let status: SkillStatus = 'Self Reported';
      let evidence: string[] = [];
      let isVerified = false;
      
      // Verification logic based on evidence
      if (score >= 65) {
        status = 'Verified';
        evidence = ['Assessment', 'Projects'];
        isVerified = true;
      } else if (score >= 50) {
        status = 'From Resume';
        evidence = ['Resume'];
      } else if (score >= 40) {
        status = 'From Project';
        evidence = ['Projects'];
      } else if (declaredLevel) {
        status = 'Self Reported';
        evidence = [];
      } else {
        status = 'Needs Verification';
        evidence = [];
      }

      const target = reqMap.get(id) || 75; 
      const isImprove = score < target;

      // Check for mismatch between declared level and assessment score
      let expectedScoreForLevel = 0;
      if (declaredLevel === 'Beginner') expectedScoreForLevel = 30;
      else if (declaredLevel === 'Intermediate') expectedScoreForLevel = 60;
      else if (declaredLevel === 'Advanced') expectedScoreForLevel = 80;

      const mismatch = !!(declaredLevel && expectedScoreForLevel - score > 20);

      return {
        id,
        score,
        skill,
        declaredLevel,
        status,
        evidence,
        isVerified,
        isImprove,
        target,
        mismatch
      };
    });
  }, [skills, declaredLevels, user?.targetRole]);

  const filteredSkills = useMemo(() => {
    const filtered = allSkills.filter((s) => {
      const matchesSearch = s.skill.name.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;
      
      if (filter === 'all') return true;
      if (filter === 'verified') return s.isVerified;
      if (filter === 'to-improve') return s.isImprove;
      return true;
    });

    return filtered.sort((a, b) => {
      if (a.isImprove && !b.isImprove) return -1;
      if (!a.isImprove && b.isImprove) return 1;
      
      if (a.isImprove && b.isImprove) {
        const gapA = Math.max(0, a.target - a.score);
        const gapB = Math.max(0, b.target - b.score);
        return gapB - gapA;
      }
      
      return b.score - a.score;
    });
  }, [allSkills, search, filter]);

  const totalCount = allSkills.length;
  const verifiedCount = allSkills.filter(s => s.status === 'Verified').length;
  const strongCount = allSkills.filter(s => s.score >= s.target).length;
  const improveCount = allSkills.filter(s => s.score < s.target).length;

  const topImprovementSkills = allSkills
    .filter(s => s.isImprove)
    .sort((a, b) => (b.target - b.score) - (a.target - a.score));
  
  const strongSkillsList = allSkills
    .filter(s => s.score >= s.target)
    .sort((a, b) => b.score - a.score);

  const resumeCount = allSkills.filter(s => s.evidence.includes('Resume')).length;
  const assessmentCount = allSkills.filter(s => s.evidence.includes('Assessment')).length;
  const projectsCount = allSkills.filter(s => s.evidence.includes('Projects')).length;
  const certCount = allSkills.filter(s => s.evidence.includes('Certifications')).length;

  if (!user) return null;

  return (
    <div className="w-full relative">
      <div className="max-w-[1100px] mx-auto w-full flex flex-col gap-10 pb-16 px-4 sm:px-6 py-6 md:py-8">
        
        {/* 1. PAGE HEADER & METRICS */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="flex flex-col max-w-xl">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Skills</h1>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
              See your current strengths, the evidence behind them, and the skills you can strengthen for your career goal.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-x-6 gap-y-3 lg:justify-end">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-black text-slate-900 leading-none">{totalCount}</span>
                <span className="text-xs font-semibold text-slate-500">Skills</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Verified</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-black text-emerald-600 leading-none">{verifiedCount}</span>
                <span className="text-xs font-semibold text-emerald-700">Skills</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Strong</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-black text-blue-600 leading-none">{strongCount}</span>
                <span className="text-xs font-semibold text-blue-700">Skills</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">To Improve</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-black text-amber-600 leading-none">{improveCount}</span>
                <span className="text-xs font-semibold text-amber-700">Skills</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. SEARCH & FILTER CONTROLS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-[40%]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Search skills..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all shadow-sm" 
            />
          </div>
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
            <button 
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all whitespace-nowrap ${filter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('verified')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all whitespace-nowrap ${filter === 'verified' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Verified
            </button>
            <button 
              onClick={() => setFilter('to-improve')}
              className={`px-3 py-1 rounded text-xs font-bold transition-all whitespace-nowrap ${filter === 'to-improve' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              To Improve
            </button>
          </div>
        </div>

        {/* 3. YOUR SKILL PROFILE GRID */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Your Skill Profile</h2>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Showing {filteredSkills.length} skills</span>
          </div>
          
          {allSkills.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 shadow-sm">
              <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">No skills yet.</h3>
              <p className="text-sm text-slate-500 mt-1 mb-5">Complete your skill assessment or add evidence to start building your skill profile.</p>
              <Link href="/student/assessment" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm inline-flex items-center gap-2">
                Check Your Skills <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : filteredSkills.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start content-start auto-rows-max">
              {filteredSkills.map((s) => {
                const gap = Math.max(0, s.target - s.score);
                const meetsTarget = s.score >= s.target;
                
                return (
                  <div key={s.id} className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden">
                    <div className="p-4 flex flex-col flex-grow">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">{s.skill.name}</h3>
                          <div className="text-[11px] text-slate-500 font-medium mt-1 flex items-center gap-1.5">
                            <span>Level: <strong className="text-slate-700">{s.declaredLevel || 'Not specified'}</strong></span>
                            <button 
                              onClick={() => {
                                setEditingSkill(s.skill);
                                setTempLevel(s.declaredLevel);
                              }}
                              className="text-blue-600 font-bold hover:underline"
                            >
                              {s.declaredLevel ? '[Edit Level]' : 'Set Level →'}
                            </button>
                          </div>
                        </div>
                        
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase ${
                          s.status === 'Verified' ? 'bg-emerald-50 text-emerald-700' 
                          : s.status === 'From Resume' ? 'bg-blue-50 text-blue-700'
                          : s.status === 'From Project' ? 'bg-indigo-50 text-indigo-700'
                          : s.status === 'Self Reported' ? 'bg-slate-100 text-slate-700'
                          : 'bg-slate-100 text-slate-700'
                        }`}>
                          {s.status}
                        </span>
                      </div>

                      <div className="my-2 flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                          <span className="text-slate-500">Current {s.score}%</span>
                          <span className="text-slate-500">Target {s.target}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
                          <div className={`absolute left-0 top-0 bottom-0 transition-all duration-500 ${meetsTarget ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${s.score}%` }}></div>
                        </div>
                        <div className="text-right mt-0.5">
                          <span className={`text-[10px] font-bold ${meetsTarget ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {meetsTarget ? 'Target met' : `${gap}% gap`}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 text-[11px] text-slate-500 font-medium truncate">
                        Evidence: {s.evidence.length > 0 ? s.evidence.join(' · ') : 'None'}
                      </div>
                    </div>

                    <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
                      <button onClick={() => setSelectedSkill(s)} className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
                        View Skill Details <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-xl border border-slate-200 shadow-sm">
              <Search className="w-6 h-6 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-900">No skills found</h3>
              <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>

        {/* 4. SKILL EVIDENCE COMPACT ROW */}
        {allSkills.length > 0 && (
          <div className="pt-6 border-t border-slate-200">
            <div className="mb-4">
              <h3 className="text-lg font-black text-slate-900">Skill Evidence</h3>
              <p className="text-sm text-slate-600 mt-0.5">Your skill profile can be supported by multiple sources.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="flex items-center gap-3 py-2.5 px-3 border border-slate-200 rounded-lg bg-white shadow-sm">
                <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900">Resume</span>
                  <span className="text-xs text-slate-500">
                    {resumeCount > 0 ? `${resumeCount} skills identified` : 'No evidence added yet'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 py-2.5 px-3 border border-slate-200 rounded-lg bg-white shadow-sm">
                <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900">Assessment</span>
                  <span className="text-xs text-slate-500">
                    {assessmentCount > 0 ? `${assessmentCount} skills assessed` : 'No evidence added yet'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 py-2.5 px-3 border border-slate-200 rounded-lg bg-white shadow-sm">
                <Terminal className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900">Projects</span>
                  <span className="text-xs text-slate-500">
                    {projectsCount > 0 ? `${projectsCount} skills linked` : 'No evidence added yet'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 py-2.5 px-3 border border-slate-200 rounded-lg bg-white shadow-sm">
                <Award className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900">Certifications</span>
                  <span className="text-xs text-slate-500">
                    {certCount > 0 ? `${certCount} added` : 'No evidence added yet'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. SKILLS FOR YOUR CAREER GOAL */}
        <div className="pt-6 border-t border-slate-200">
          <div className="border border-slate-200 rounded-xl bg-white shadow-sm p-6">
            <div className="mb-6">
              <h3 className="text-lg font-black text-slate-900">Skills for your career goal</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Career Goal:</span>
                {user.targetRole ? (
                  <span className="text-sm font-bold text-slate-900">{user.targetRole}</span>
                ) : (
                  <span className="text-sm font-medium text-slate-500 italic">Not Selected</span>
                )}
              </div>
            </div>

            {user.targetRole ? (
              <div className="flex flex-col md:flex-row gap-8 pb-6 mb-6 border-b border-slate-100">
                <div className="flex-1">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Strong Skills</h4>
                  <ul className="flex flex-col gap-2">
                    {strongSkillsList.length > 0 ? strongSkillsList.map(s => (
                      <li key={s.id} className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> {s.skill.name}
                      </li>
                    )) : (
                      <li className="text-sm text-slate-500 italic">No strong skills yet</li>
                    )}
                  </ul>
                </div>
                
                <div className="flex-1">
                  <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Skills to Strengthen</h4>
                  <ul className="flex flex-col gap-2">
                    {topImprovementSkills.length > 0 ? topImprovementSkills.map(s => (
                      <li key={s.id} className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-amber-500 shrink-0" /> {s.skill.name}
                      </li>
                    )) : (
                      <li className="text-sm text-slate-500 italic">No critical gaps identified</li>
                    )}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="pb-6 mb-6 border-b border-slate-100">
                <p className="text-sm text-slate-600">Choose a career goal to see which skills matter for your target role.</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xs text-slate-600 max-w-md">
                Strengthening these skills can improve the relevance of your learning and opportunity recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
                <Link href="/student/learning" className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-md transition-colors text-center">
                  View Learning Plan →
                </Link>
                <Link href="/student/opportunities" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md transition-colors shadow-sm text-center">
                  Explore Opportunities →
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* EDIT SKILL LEVEL MODAL */}
      {editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setEditingSkill(null)}></div>
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-start">
              <div>
                <h3 className="text-lg font-black text-slate-900">{editingSkill.name}</h3>
                <p className="text-xs text-slate-500 mt-1">How would you rate your current proficiency?</p>
              </div>
              <button onClick={() => setEditingSkill(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-md transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5 flex flex-col gap-3 overflow-y-auto max-h-[60vh]">
              {(['Beginner', 'Intermediate', 'Advanced'] as const).map(lvl => {
                const isSelected = tempLevel === lvl;
                return (
                  <button 
                    key={lvl} 
                    onClick={() => setTempLevel(lvl)} 
                    className={`text-left p-4 rounded-xl border-2 transition-all ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`text-sm font-bold ${isSelected ? 'text-blue-700' : 'text-slate-900'}`}>{lvl.toUpperCase()}</h4>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                        {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                      </div>
                    </div>
                    <p className={`text-xs ${isSelected ? 'text-blue-600 font-medium' : 'text-slate-500'}`}>
                      {lvl === 'Beginner' && "I understand the fundamentals and can complete simple tasks with guidance."}
                      {lvl === 'Intermediate' && "I can build projects independently and solve common problems."}
                      {lvl === 'Advanced' && "I can design complex solutions and work confidently with advanced concepts."}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50">
              <button onClick={() => setEditingSkill(null)} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 rounded-lg transition-colors">
                Cancel
              </button>
              <button onClick={() => handleSetLevel(editingSkill.id, tempLevel)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors" disabled={!tempLevel}>
                Save Level
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SKILL DETAILS MODAL */}
      {selectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedSkill(null)}></div>
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 leading-none">{selectedSkill.skill.name}</h3>
              <button onClick={() => setSelectedSkill(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-md transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5 space-y-6 flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Your Level</h4>
                  <div className="text-xs font-bold text-slate-900">{selectedSkill.declaredLevel || 'Not specified'}</div>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Assessment</h4>
                  <div className="text-xs font-bold text-slate-900">{selectedSkill.score > 0 ? `${selectedSkill.score}%` : 'Not assessed'}</div>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Target</h4>
                  <div className="text-xs font-bold text-slate-900">{selectedSkill.target}%</div>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status</h4>
                  <div className="text-xs font-bold text-slate-900">{selectedSkill.status} · {selectedSkill.score >= selectedSkill.target ? 'Target met' : `${Math.max(0, selectedSkill.target - selectedSkill.score)}% gap`}</div>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Evidence Sources</h4>
                <ul className="space-y-1.5">
                  {selectedSkill.evidence.map((ev, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-800 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {ev}
                    </li>
                  ))}
                  {selectedSkill.evidence.length === 0 && (
                    <li className="text-xs text-slate-500 italic">No evidence added yet.</li>
                  )}
                </ul>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {selectedSkill.mismatch && <strong className="text-amber-700 block mb-1">Assessment suggests additional practice may help.</strong>}
                  {selectedSkill.isImprove 
                    ? `Your current proficiency is below the recommended level for your selected career goal (${selectedSkill.target}% target). Consider taking some courses to improve.`
                    : 'Your current proficiency is strong for your selected career goal.'}
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50">
              <button onClick={() => setSelectedSkill(null)} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 rounded-md transition-colors">
                Close
              </button>
              {selectedSkill.status === 'Needs Verification' ? (
                <Link href="/student/assessment" className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md transition-colors shadow-sm">
                  Take Assessment →
                </Link>
              ) : (
                <Link href="/student/learning" className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md transition-colors shadow-sm">
                  View Learning Path →
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
