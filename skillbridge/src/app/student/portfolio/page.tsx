'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  FolderOpen, Award, CheckCircle2, ShieldCheck, GitBranch, 
  ExternalLink, Plus, MapPin, Map, Navigation,
  LayoutGrid, GraduationCap, Briefcase, ChevronRight, AlertCircle, Clock
} from 'lucide-react';
import { DEMO_PROJECTS, DEMO_CERTIFICATIONS, DEMO_STUDENT_SKILLS } from '@/lib/demo-data';
import { SKILL_MAP } from '@/lib/skills-taxonomy';
import { toast } from 'sonner';
import { getSession, getStudentSkills } from '@/lib/user-session';

type Tab = 'portfolio' | 'certifications' | 'projects' | 'experience';

function PortfolioContent() {
  const searchParams = useSearchParams();
  const currentTab = (searchParams.get('tab') as Tab) || 'portfolio';
  
  const [user, setUser] = useState(getSession());
  const [skills, setSkills] = useState<Record<string, number>>({});

  useEffect(() => {
    setUser(getSession());
    setSkills(getStudentSkills());
  }, []);

  const completionPct = 82; // Example static
  const topSkills = Object.entries(skills).sort(([, a], [, b]) => b - a).slice(0, 6);

  const renderTabs = () => (
    <div className="flex items-center gap-1 border-b border-slate-200 mb-6 overflow-x-auto pb-px">
      {[
        { id: 'portfolio', label: 'Portfolio' },
        { id: 'certifications', label: 'Certifications' },
        { id: 'projects', label: 'Projects' },
        { id: 'experience', label: 'Experience' }
      ].map(tab => (
        <Link
          key={tab.id}
          href={`/student/portfolio${tab.id === 'portfolio' ? '' : `?tab=${tab.id}`}`}
          className={`px-4 py-2 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
            currentTab === tab.id 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );

  // ==========================================
  // VIEW: DEFAULT PORTFOLIO
  // ==========================================
  if (currentTab === 'portfolio') {
    return (
      <div className="w-full relative pb-16">
        <div className="max-w-[1100px] mx-auto w-full px-4 sm:px-6 py-6 md:py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Your Portfolio</h1>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Build a professional profile that showcases your verified skills, projects, certifications and experience.
            </p>
          </div>

          {renderTabs()}

          <div className="flex flex-col gap-8">
            {/* Professional Preview Header */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-slate-800 to-slate-900 z-0"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
                <div className="w-24 h-24 rounded-xl bg-white p-1 shadow-sm shrink-0">
                  <div className="w-full h-full rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-3xl">
                    {(user?.name || 'C').charAt(0).toUpperCase()}
                  </div>
                </div>

                <div className="flex-1 min-w-0 pt-2 md:pt-14">
                  <h2 className="text-2xl font-black text-slate-900 truncate">{user?.name || 'Candidate Name'}</h2>
                  <div className="text-sm font-bold text-slate-700 mt-1">{user?.degree || 'B.Tech'} {user?.branch ? `· ${user.branch}` : ''}</div>
                  <div className="text-sm font-semibold text-slate-500 mt-1 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> {user?.targetRole || 'Software Developer'}
                    <span className="text-slate-300">|</span>
                    <MapPin className="w-4 h-4" /> India
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Strong Skills:</span>
                    {topSkills.slice(0,4).map(([skillId]) => (
                      <span key={skillId} className="text-[11px] font-semibold bg-slate-50 border border-slate-200 text-slate-700 px-2 py-0.5 rounded">
                        {SKILL_MAP[skillId]?.name ?? skillId}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="w-full md:w-64 shrink-0 bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col justify-center">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-slate-600">Profile completeness</span>
                    <span className="text-lg font-black text-blue-600 leading-none">{completionPct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${completionPct}%` }}></div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button className="w-full px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors">
                      Edit Profile
                    </button>
                    <button className="w-full px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors">
                      Preview Public Portfolio
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Featured Verified Skills</h3>
                  <Link href="/student/skills" className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center">
                    View All <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {topSkills.map(([skillId]) => (
                    <div key={skillId} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 border border-emerald-100 rounded-md">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-xs font-bold text-emerald-800">{SKILL_MAP[skillId]?.name ?? skillId}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Featured Projects</h3>
                  <Link href="/student/portfolio?tab=projects" className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center">
                    View All <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="flex flex-col gap-3">
                  {DEMO_PROJECTS.slice(0,2).map(p => (
                    <div key={p.id} className="border border-slate-100 rounded-lg p-3 bg-slate-50">
                      <div className="font-bold text-sm text-slate-900">{p.title}</div>
                      <div className="text-xs text-slate-500 mt-1 line-clamp-1">{p.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Verified Credentials</h3>
                  <Link href="/student/portfolio?tab=certifications" className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center">
                    View All <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="flex flex-col gap-3">
                  {DEMO_CERTIFICATIONS.slice(0,2).map(c => (
                    <div key={c.id} className="border border-slate-100 rounded-lg p-3 bg-slate-50 flex items-center gap-3">
                      <Award className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <div className="font-bold text-sm text-slate-900">{c.name}</div>
                        <div className="text-[10px] text-slate-500 font-semibold">{c.issuer}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Experience</h3>
                  <button className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center">
                    View All <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="text-center p-6 border border-dashed border-slate-200 rounded-lg">
                  <Briefcase className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-slate-600">No experience added yet</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: CERTIFICATIONS
  // ==========================================
  if (currentTab === 'certifications') {
    return (
      <div className="w-full relative pb-16">
        <div className="max-w-[1100px] mx-auto w-full px-4 sm:px-6 py-6 md:py-8">
          <div className="mb-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex flex-col max-w-2xl">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Certifications</h1>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Credentials that support your SkillBridge skill profile.
              </p>
            </div>
            
            <div className="flex bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden shrink-0">
              <div className="px-5 py-3 border-r border-slate-100 flex flex-col justify-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total</span>
                <span className="text-xl font-black text-slate-900">{DEMO_CERTIFICATIONS.length}</span>
              </div>
              <div className="px-5 py-3 border-r border-slate-100 flex flex-col justify-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Verified</span>
                <span className="text-xl font-black text-emerald-600">{DEMO_CERTIFICATIONS.length - 1}</span>
              </div>
              <div className="px-5 py-3 flex flex-col justify-center bg-slate-50">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Pending</span>
                <span className="text-xl font-black text-amber-600">1</span>
              </div>
            </div>
          </div>

          {renderTabs()}

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Your Credentials</h2>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" /> Add Certification
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {DEMO_CERTIFICATIONS.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
                <Award className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 text-base">Add certifications to strengthen your profile</h3>
                <p className="text-sm text-slate-500 mt-1 mb-4">You haven't uploaded any credentials yet.</p>
              </div>
            ) : (
              DEMO_CERTIFICATIONS.map((cert, i) => {
                const isPending = i === DEMO_CERTIFICATIONS.length - 1; // Demo mock pending state
                return (
                  <div key={cert.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-black text-slate-900">{cert.name}</h3>
                        {isPending ? (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 rounded uppercase tracking-wider flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Pending Verification
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded uppercase tracking-wider flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Verified
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm font-semibold text-slate-600 mb-4">
                        {cert.issuer} · Issued: {cert.issueDate}
                      </div>

                      <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 inline-block mb-2">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Credential ID</div>
                        <div className="text-xs font-mono text-slate-700">{cert.credentialId || 'N/A'}</div>
                      </div>

                      <div className="mt-3">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Skills Demonstrated</div>
                        <div className="flex flex-wrap gap-1.5">
                          {cert.skills?.map(s => (
                            <span key={s} className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md border border-slate-200">
                              {SKILL_MAP[s]?.name || s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors">
                        View Credential
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: PROJECTS
  // ==========================================
  if (currentTab === 'projects') {
    return (
      <div className="w-full relative pb-16">
        <div className="max-w-[1100px] mx-auto w-full px-4 sm:px-6 py-6 md:py-8">
          <div className="mb-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex flex-col max-w-2xl">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Projects</h1>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Show employers what you can build and the skills you can demonstrate.
              </p>
            </div>
            
            <div className="flex bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden shrink-0">
              <div className="px-5 py-3 border-r border-slate-100 flex flex-col justify-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Projects</span>
                <span className="text-xl font-black text-slate-900">{DEMO_PROJECTS.length}</span>
              </div>
              <div className="px-5 py-3 border-r border-slate-100 flex flex-col justify-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Featured</span>
                <span className="text-xl font-black text-blue-600">{Math.min(DEMO_PROJECTS.length, 2)}</span>
              </div>
              <div className="px-5 py-3 flex flex-col justify-center bg-slate-50">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Skills Demo'd</span>
                <span className="text-xl font-black text-emerald-600">
                  {new Set(DEMO_PROJECTS.flatMap(p => p.technologies)).size}
                </span>
              </div>
            </div>
          </div>

          {renderTabs()}

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Your Projects</h2>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" /> Add Project
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {DEMO_PROJECTS.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
                <LayoutGrid className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 text-base">Show employers what you can build</h3>
                <p className="text-sm text-slate-500 mt-1 mb-4">You haven't added any projects yet.</p>
              </div>
            ) : (
              DEMO_PROJECTS.map((proj) => (
                <div key={proj.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row">
                  <div className="p-6 flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-black text-slate-900">{proj.title}</h3>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-600 rounded uppercase tracking-wider">
                        Self-Added
                      </span>
                    </div>
                    
                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                      {proj.description}
                    </p>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Technology</div>
                        <div className="flex flex-wrap gap-1.5">
                          {proj.technologies.slice(0, 3).map(t => (
                            <span key={t} className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                              {SKILL_MAP[t]?.name || t}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-blue-500" /> Connects to Skill Profile
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {proj.technologies.map(t => (
                            <span key={t} className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                              {SKILL_MAP[t]?.name || t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border-t md:border-t-0 md:border-l border-slate-200 p-6 flex flex-row md:flex-col items-center justify-center gap-4 md:w-48 shrink-0">
                    <div className="flex-1 md:flex-none flex flex-col gap-3 w-full">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center hidden md:block mb-1">Evidence</div>
                      {proj.githubUrl ? (
                        <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors w-full">
                          <GitBranch className="w-4 h-4" /> Source Code
                        </a>
                      ) : (
                        <div className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 text-slate-400 text-xs font-bold rounded-lg w-full">
                          <GitBranch className="w-4 h-4" /> No Repository
                        </div>
                      )}
                      
                      <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors w-full">
                        View Project
                      </button>
                      <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors w-full">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function PortfolioPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500 font-medium">Loading portfolio...</div>}>
      <PortfolioContent />
    </Suspense>
  );
}
