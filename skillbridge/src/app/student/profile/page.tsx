'use client';

import { useState, useEffect } from 'react';
import { getSession, getStudentSkills, getStudentResume, type UserSession, type ParsedResume } from '@/lib/user-session';
import Link from 'next/link';

export default function ProfilePage() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [skills, setSkills] = useState<Record<string, number>>({});
  const [resume, setResume] = useState<ParsedResume | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setUser(getSession());
    setSkills(getStudentSkills());
    setResume(getStudentResume());

    const sync = () => {
      setUser(getSession());
      setSkills(getStudentSkills());
      setResume(getStudentResume());
    };
    
    window.addEventListener('sb_session_updated', sync);
    window.addEventListener('sb_skills_updated', sync);
    return () => {
      window.removeEventListener('sb_session_updated', sync);
      window.removeEventListener('sb_skills_updated', sync);
    }
  }, []);

  if (!isMounted || !user) return null;

  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'ST';
  const hasAcademic = !!(user.college || user.degree || user.branch);
  const hasSkills = Object.keys(skills).length > 0;

  const calculateProfileHealth = () => {
    let score = 0;
    const fields: (keyof UserSession)[] = ['name', 'email', 'phone', 'college', 'degree', 'branch', 'graduationYear', 'cgpa', 'targetRole', 'experienceLevel'];
    fields.forEach(f => {
      if (user[f] && user[f]?.toString().trim() !== '') score += 5;
    });
    if (resume) score += 20;
    if (hasSkills) score += 30;

    let text = 'Profile Started';
    let subText = 'Action Required';
    if (score >= 90) { text = 'Profile Ready'; subText = 'Excellent'; }
    else if (score >= 65) { text = 'Profile Developing'; subText = 'Keep Going'; }
    else if (score >= 40) { text = 'Profile Building'; subText = 'Needs More Info'; }
    else if (score === 0) { text = 'Not Started'; subText = 'Action Required'; }

    return { percentage: score, text, subText };
  };

  const health = calculateProfileHealth();

  // SVG dash array calculation: circle length is 2 * PI * 19 ≈ 119.38
  const dashOffset = 119.38 - (119.38 * (health.percentage / 100));

  return (
    <div className="flex flex-col w-full pb-20">
      <div className="w-full max-w-[1360px] mx-auto px-space-base md:px-space-xl py-space-xl space-y-space-xl">
        
        {/* Title Area & Dossier Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">My Profile</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-space-2xs">
              Complete your profile to help SkillBridge understand your goals, skills and experience.
            </p>
          </div>
          {/* Quick Action Secondary Row */}
          <div className="flex items-center gap-space-sm self-start md:self-auto">
            <button className="inline-flex items-center gap-space-xs px-space-md py-space-xs bg-surface-container-low text-on-surface font-title-sm text-title-sm rounded-lg hover:bg-surface-container transition-colors shadow-sm" type="button">
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Export Dossier (PDF)</span>
            </button>
            <button className="inline-flex items-center gap-space-xs px-space-md py-space-xs bg-primary-container text-on-primary font-title-sm text-title-sm rounded-lg hover:bg-primary transition-colors shadow-sm" type="button">
              <span className="material-symbols-outlined text-[18px]">visibility</span>
              <span>Preview Public Portfolio</span>
            </button>
          </div>
        </div>

        {/* Master Profile Header Summary Card */}
        <div className="bg-surface-container-lowest rounded-xl shadow-md p-space-lg md:p-space-xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-lg">
            {/* Avatar Stack with Status */}
            <div className="relative group">
              {user.profilePictureUrl ? (
                <img src={user.profilePictureUrl} alt="Profile" className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shadow-md" />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-headline-display text-headline-display font-semibold shadow-md overflow-hidden">
                  <span>{initials}</span>
                </div>
              )}
              <label className="absolute -bottom-2 -right-2 p-space-xs bg-surface-container-lowest text-on-surface hover:text-primary rounded-lg shadow-md transition-colors flex items-center justify-center cursor-pointer" title="Change profile photo">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const base64String = reader.result as string;
                    import('@/lib/user-session').then(({ setSession }) => setSession({ profilePictureUrl: base64String }));
                  };
                  reader.readAsDataURL(file);
                }} />
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              </label>
            </div>
            {/* Identity & Institutional Hierarchy */}
            <div className="flex flex-col gap-space-2xs">
              <div className="flex items-center gap-space-sm flex-wrap">
                <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">{user.name || 'New Student'}</h2>
              </div>
              {hasAcademic ? (
                <p className="font-title-md text-title-md text-on-surface-variant font-medium">
                  {user.degree} {user.branch && `in ${user.branch}`} {user.graduationYear && `(${user.graduationYear})`}
                </p>
              ) : (
                <p className="font-title-md text-title-md text-on-surface-variant font-medium">
                  Institution details not added yet
                </p>
              )}
              <div className="flex items-center gap-space-sm text-on-surface-variant font-body-md text-body-md flex-wrap mt-space-2xs">
                {user.college && (
                  <>
                    <span className="inline-flex items-center gap-space-2xs">
                      <span className="material-symbols-outlined text-[18px] text-primary">account_balance</span>
                      {user.college}
                    </span>
                    <span className="text-outline-variant font-body-sm">•</span>
                  </>
                )}
                <span className="inline-flex items-center gap-space-2xs">
                  <span className="material-symbols-outlined text-[18px] text-tertiary">flag</span>
                  Goal: <strong className="text-on-surface font-semibold">{user.targetRole || 'Choose a career goal'}</strong>
                </span>
              </div>
            </div>
          </div>
          {/* Completeness Ring and Edit Action Panel */}
          <div className="flex items-center justify-between sm:justify-end gap-space-xl pt-space-md lg:pt-0">
            <div className="flex items-center gap-space-md bg-surface-container-low p-space-sm rounded-xl">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 48 48">
                  <circle className="text-surface-container-highest" cx="24" cy="24" fill="transparent" r="19" stroke="currentColor" strokeWidth="4"></circle>
                  <circle className="text-secondary" cx="24" cy="24" fill="transparent" r="19" stroke="currentColor" strokeDasharray="119.38" strokeDashoffset={dashOffset} strokeLinecap="round" strokeWidth="4"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-title-sm text-title-sm font-bold text-on-surface">{health.percentage}%</span>
                </div>
              </div>
              <div className="flex flex-col pr-space-xs">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">Profile completion</span>
                <span className="font-title-sm text-title-sm text-secondary font-bold">{health.text}</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">{health.subText}</span>
              </div>
            </div>
            <div className="flex flex-col gap-space-xs">
              <Link href="/student/onboarding" className="inline-flex items-center justify-center gap-space-xs px-space-lg py-space-sm bg-primary-container text-on-primary font-title-sm text-title-sm rounded-lg hover:bg-primary transition-all shadow-sm">
                <span className="material-symbols-outlined text-[18px]">edit</span>
                <span>Edit Profile</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Asymmetric 2-Column Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
          
          {/* Left Major Column (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-space-xl">
            {/* 1. PERSONAL INFORMATION */}
            <section className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-space-xs">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[20px]">person</span>
                  <h3 className="font-title-lg text-title-lg text-on-surface font-semibold">Personal Information</h3>
                </div>
                <Link href="/student/onboarding" className="inline-flex items-center gap-space-2xs text-primary font-title-sm text-title-sm hover:underline">
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  <span>Edit</span>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-space-2xs">Legal Full Name</span>
                  <span className={`font-title-md text-title-md font-semibold ${user.name ? 'text-on-surface' : 'text-on-surface-variant italic'}`}>
                    {user.name || 'Not added yet'}
                  </span>
                </div>
                <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-space-2xs">Email Address</span>
                  <span className={`font-title-md text-title-md font-semibold truncate ${user.email ? 'text-on-surface' : 'text-on-surface-variant italic'}`}>
                    {user.email || 'Not added yet'}
                  </span>
                </div>
                <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-space-2xs">Mobile Phone</span>
                  <span className={`font-title-md text-title-md font-semibold tabular-nums ${user.phone ? 'text-on-surface' : 'text-on-surface-variant italic'}`}>
                    {user.phone || 'Not added yet'}
                  </span>
                </div>
                <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mb-space-2xs">Location</span>
                  <span className="font-title-md text-title-md text-on-surface-variant font-semibold italic">Not added yet</span>
                </div>
              </div>
            </section>

            {/* 2. EDUCATION SECTION */}
            <section className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-space-xs">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[20px]">school</span>
                  <h3 className="font-title-lg text-title-lg text-on-surface font-semibold">Academic Credentials</h3>
                </div>
                <Link href="/student/onboarding" className="inline-flex items-center gap-space-2xs text-primary font-title-sm text-title-sm hover:underline">
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  <span>Edit Education</span>
                </Link>
              </div>
              {!hasAcademic ? (
                <div className="p-space-lg bg-surface-container-low rounded-xl text-center text-on-surface-variant font-body-md text-body-md">
                  Not added yet. <Link href="/student/onboarding" className="text-primary hover:underline">Update your education details</Link>.
                </div>
              ) : (
                <div className="p-space-lg bg-surface-container-low rounded-xl flex flex-col gap-space-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
                    <div>
                      <h4 className="font-title-lg text-title-lg text-on-surface font-bold">{user.college || 'Institution not added'}</h4>
                      <p className="font-body-md text-body-md text-on-surface-variant">{user.degree || 'Degree not added'} {user.branch && `in ${user.branch}`}</p>
                    </div>
                    {user.cgpa && (
                      <div className="flex items-center gap-space-xs self-start sm:self-auto bg-surface-container-lowest px-space-sm py-space-xs rounded-lg shadow-sm">
                        <span className="material-symbols-outlined text-tertiary text-[20px]">workspace_premium</span>
                        <div className="text-right">
                          <div className="font-title-lg text-title-lg text-on-surface font-bold tabular-nums">{user.cgpa} <span className="font-body-sm text-body-sm text-on-surface-variant">/ 10.0</span></div>
                          <div className="font-label-sm text-label-sm text-on-surface-variant uppercase">Cumulative CGPA</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-space-sm">
                    <div className="bg-surface-container-lowest p-space-sm rounded-lg">
                      <span className="font-label-sm text-label-sm uppercase text-on-surface-variant block">Graduation Year</span>
                      <span className="font-title-sm text-title-sm text-on-surface font-bold">{user.graduationYear || 'Not added'}</span>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* 6. SKILLS BREAKDOWN */}
            <section className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs pb-space-xs">
                <div>
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-[20px]">psychology_alt</span>
                    <h3 className="font-title-lg text-title-lg text-on-surface font-semibold">Skills Inventory</h3>
                  </div>
                </div>
              </div>

              {!hasSkills ? (
                <div className="p-space-lg bg-surface-container-low rounded-xl text-center flex flex-col items-center justify-center gap-space-sm text-on-surface-variant font-body-md text-body-md">
                  <p>No skills added yet. Complete your skill assessment or upload your resume to start building your skill profile.</p>
                  <div className="flex gap-space-sm mt-space-xs">
                    <Link href="/student/check-your-skills" className="px-space-md py-space-xs bg-primary text-on-primary font-title-sm text-title-sm rounded-lg hover:bg-primary-container transition-colors shadow-sm">
                      Check Your Skills
                    </Link>
                    <Link href="/student/onboarding" className="px-space-md py-space-xs bg-surface-container-high text-on-surface font-title-sm text-title-sm rounded-lg hover:bg-surface-container transition-colors shadow-sm">
                      Upload Resume
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-space-sm">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-space-xs font-label-md text-label-md text-primary font-bold tracking-wide uppercase">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                      RESUME DERIVED
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-space-xs">
                    {Object.entries(skills).map(([skillId, score]) => (
                      <span key={skillId} className="inline-flex items-center gap-space-xs px-space-md py-space-xs bg-primary-fixed text-on-primary-fixed rounded-lg font-title-sm text-title-sm font-semibold capitalize">
                        <span className="material-symbols-outlined text-[16px]">description</span> {skillId.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Right Column (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-space-xl">
            {/* 4. RESUME MANAGEMENT */}
            <section className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-space-xs">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[20px]">picture_as_pdf</span>
                  <h3 className="font-title-lg text-title-lg text-on-surface font-semibold">Resume Management</h3>
                </div>
              </div>
              
              {!resume ? (
                <div className="p-space-md bg-surface-container-low rounded-xl text-center text-on-surface-variant font-body-md text-body-md">
                  <p>No resume uploaded yet. Upload your resume to automatically build your profile and identify relevant skills.</p>
                  <Link href="/student/onboarding" className="inline-flex items-center justify-center gap-space-xs px-space-md py-space-xs mt-space-sm bg-primary text-on-primary font-title-sm text-title-sm rounded-lg hover:bg-primary-container transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">upload</span>
                    <span>Upload Resume</span>
                  </Link>
                </div>
              ) : (
                <div className="p-space-md bg-surface-container-low rounded-xl flex flex-col gap-space-sm">
                  <div className="flex items-start gap-space-sm">
                    <div className="p-space-xs bg-primary-container text-on-primary rounded-lg">
                      <span className="material-symbols-outlined text-[28px]">description</span>
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-title-sm text-title-sm text-on-surface font-semibold truncate">{resume.fileName}</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Extracted Profile Data</span>
                    </div>
                  </div>
                  {/* Auto Parser Insight */}
                  <div className="bg-surface-container-lowest p-space-sm rounded-lg flex items-center justify-between mt-space-2xs">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-secondary text-[18px]">auto_awesome</span>
                      <span className="font-label-md text-label-md text-on-surface">Extracted Skills Mapped</span>
                    </div>
                    <span className="font-title-sm text-title-sm text-primary font-bold">{Object.keys(resume.extractedSkills || {}).length} Skills</span>
                  </div>
                  {/* Action buttons */}
                  <div className="flex items-center gap-space-sm pt-space-xs">
                    <Link href="/student/onboarding" className="flex-1 inline-flex items-center justify-center gap-space-xs px-space-md py-space-xs bg-surface-container text-on-surface font-title-sm text-title-sm rounded-lg hover:bg-surface-container-high transition-colors shadow-sm border border-outline-variant">
                      <span className="material-symbols-outlined text-[18px]">upload</span>
                      <span>Replace Resume</span>
                    </Link>
                    <button className="flex-1 inline-flex items-center justify-center gap-space-xs px-space-md py-space-xs bg-surface-container text-on-surface font-title-sm text-title-sm rounded-lg hover:bg-surface-container-high transition-colors shadow-sm border border-outline-variant">
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                      <span>View Resume</span>
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* 3. CAREER PREFERENCES */}
            <section className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
              <div className="flex items-center justify-between pb-space-xs">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
                  <h3 className="font-title-lg text-title-lg text-on-surface font-semibold">Career Preferences</h3>
                </div>
                <Link href="/student/onboarding" className="text-primary hover:underline font-title-sm text-title-sm">
                  Edit
                </Link>
              </div>
              <div className="flex flex-col gap-space-md">
                <div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant block mb-space-2xs">Primary Target Role</span>
                  {user.targetRole ? (
                    <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs bg-primary-fixed text-on-primary-fixed rounded-lg font-title-sm text-title-sm font-bold">
                      <span className="material-symbols-outlined text-[18px]">target</span>
                      <span>{user.targetRole}</span>
                    </div>
                  ) : (
                    <span className="text-on-surface-variant font-body-sm text-body-sm italic">Choose a career goal</span>
                  )}
                </div>
                <div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant block mb-space-2xs">Experience Level</span>
                  {user.experienceLevel ? (
                    <span className="px-space-sm py-space-2xs bg-surface-container-low text-on-surface rounded font-body-sm text-body-sm font-medium">
                      {user.experienceLevel}
                    </span>
                  ) : (
                    <span className="text-on-surface-variant font-body-sm text-body-sm italic">Not specified</span>
                  )}
                </div>
              </div>
            </section>

            {/* 7. PROJECTS & CERTIFICATIONS & INTERNSHIPS PREVIEW CARDS */}
            <div className="flex flex-col gap-space-md">
              <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-[20px]">terminal</span>
                    <h4 className="font-title-lg text-title-lg text-on-surface font-semibold">Featured Projects (0)</h4>
                  </div>
                  <button className="text-primary hover:underline font-title-sm text-title-sm">Add Project</button>
                </div>
                <div className="p-space-md bg-surface-container-low rounded-lg text-center font-body-md text-body-md text-on-surface-variant">
                  No projects added yet.
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
                    <h4 className="font-title-lg text-title-lg text-on-surface font-semibold">Active Certifications (0)</h4>
                  </div>
                  <button className="text-primary hover:underline font-title-sm text-title-sm">Add Certification</button>
                </div>
                <div className="p-space-md bg-surface-container-low rounded-lg text-center font-body-md text-body-md text-on-surface-variant">
                  No certifications added yet.
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-[20px]">work</span>
                    <h4 className="font-title-lg text-title-lg text-on-surface font-semibold">Internships (0)</h4>
                  </div>
                  <Link href="/student/opportunities" className="text-primary hover:underline font-title-sm text-title-sm">Explore Opportunities</Link>
                </div>
                <div className="p-space-md bg-surface-container-low rounded-lg text-center font-body-md text-body-md text-on-surface-variant">
                  No internships added yet.
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
