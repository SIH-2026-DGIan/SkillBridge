'use client';

import { useState, useEffect, useMemo } from 'react';
import { getSession, getStudentSkills, getStudentResume, getStudentApplications, type UserSession, type ParsedResume } from '@/lib/user-session';
import { ROLE_REQUIRED_SKILLS, SKILL_MAP } from '@/lib/skills-taxonomy';
import { DEMO_OPPORTUNITIES } from '@/lib/demo-data';
import { calculateMatch } from '@/lib/ai/matching-engine';

import { JourneyTracker } from '@/frontend/components/student/dashboard/JourneyTracker';
import { NextBestAction } from '@/frontend/components/student/dashboard/NextBestAction';
import { DashboardStats } from '@/frontend/components/student/dashboard/DashboardStats';
import { SkillsToImprove } from '@/frontend/components/student/dashboard/SkillsToImprove';
import { LearningPreview } from '@/frontend/components/student/dashboard/LearningPreview';
import { OpportunitiesPreview } from '@/frontend/components/student/dashboard/OpportunitiesPreview';
import { ApplicationsPreview } from '@/frontend/components/student/dashboard/ApplicationsPreview';
import { PortfolioPreview } from '@/frontend/components/student/dashboard/PortfolioPreview';

export default function StudentDashboard() {
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
    window.addEventListener('sb_resume_updated', sync);

    return () => {
      window.removeEventListener('sb_session_updated', sync);
      window.removeEventListener('sb_skills_updated', sync);
      window.removeEventListener('sb_resume_updated', sync);
    };
  }, []);

  const targetRole = user?.targetRole;
  const requiredSkills = targetRole ? ROLE_REQUIRED_SKILLS[targetRole] || [] : [];

  // Computed data
  const gapAnalysis = useMemo(() => {
    if (!targetRole || Object.keys(skills).length === 0) return [];
    return requiredSkills.map(({ skillId, required }) => {
      const current = skills[skillId] ?? 0;
      const gap = Math.max(0, required - current);
      return {
        skillId,
        name: SKILL_MAP[skillId]?.name ?? skillId,
        gap,
        isGap: current < required,
      };
    });
  }, [requiredSkills, skills, targetRole]);

  const skillGaps = useMemo(() => {
    return gapAnalysis.filter((g) => g.isGap).sort((a, b) => b.gap - a.gap);
  }, [gapAnalysis]);

  const profileCompletion = useMemo(() => {
    if (!resume && Object.keys(skills).length === 0) return 0;
    let score = 20; // Base score for creating account
    if (resume) score += 20;
    if (user?.isAssessed) score += 20;
    if (Object.keys(skills).length > 0) score += 40;
    return score;
  }, [resume, user?.isAssessed, skills]);

  const dynamicUserProfile = useMemo(() => ({
    skills: Object.entries(skills).map(([skillId, proficiency]) => ({ skillId, proficiency })),
    targetRoles: targetRole ? [targetRole] : [],
    education: { degree: user?.degree || 'B.Tech', branch: user?.branch || 'Computer Science', graduationYear: user?.graduationYear || 2026 },
    projects: [],
    cgpa: 8.4,
  }), [skills, targetRole, user]);

  const recommendedOpps = useMemo(() => {
    if (Object.keys(skills).length === 0 || !targetRole) return [];
    
    return DEMO_OPPORTUNITIES
      .map((opp) => ({
        opp,
        match: calculateMatch(dynamicUserProfile, opp),
      }))
      .sort((a, b) => b.match.score - a.match.score);
  }, [dynamicUserProfile, skills]);

  const applications = getStudentApplications();
  const activeAppsCount = applications.filter(a => (a.status as string) !== 'accepted' && (a.status as string) !== 'rejected').length;
  const skillsCount = Object.keys(skills).length;

  // Determine State
  let activeStep = 0;
  let nextAction = {
    title: 'Your next step starts here',
    description: 'Upload your resume to start building your SkillBridge profile.',
    ctaText: 'Upload Resume',
    ctaHref: '/student/profile'
  };

  if (!user?.targetRole) {
    activeStep = 0;
    nextAction = { title: 'Choose Career Goal', description: 'Select a target career role to get personalized recommendations.', ctaText: 'Select Role', ctaHref: '/student/profile' };
  } else if (resume && !user?.isAssessed) {
    activeStep = 1;
    nextAction = { title: 'Check Your Skills', description: 'Take the assessment to verify your skills and discover your strengths.', ctaText: 'Take Assessment', ctaHref: '/student/assessment' };
  } else if (resume && user?.isAssessed && skillsCount === 0) {
    activeStep = 2;
    nextAction = { title: 'Review Profile', description: 'Review your extracted skills to finalize your profile.', ctaText: 'Review Profile', ctaHref: '/student/skills' };
  } else if (resume && user?.isAssessed && skillsCount > 0 && skillGaps.length > 0) {
    activeStep = 3;
    nextAction = { title: 'Improve This Skill', description: `Focus on improving ${skillGaps[0]?.name || 'your core skills'} to unlock more opportunities.`, ctaText: 'View Learning Path', ctaHref: '/student/learning' };
  } else if (resume && user?.isAssessed && skillsCount > 0 && skillGaps.length === 0) {
    if (activeAppsCount > 0) {
      activeStep = 6;
      nextAction = { title: 'Track Application', description: 'You have active applications. Keep an eye on their status.', ctaText: 'View Applications', ctaHref: '/student/applications' };
    } else {
      activeStep = 5;
      nextAction = { title: 'Explore Opportunities', description: 'You have AI-matched opportunities waiting for you.', ctaText: 'Explore Matches', ctaHref: '/student/opportunities' };
    }
  }

  if (!isMounted || !user) return null;

  return (
    <div className="flex flex-col min-h-full bg-[#FAFAF8] pb-12">
      <JourneyTracker activeStep={activeStep} />
      
      <main className="px-6 lg:px-8 py-8 w-full max-w-[1600px] mx-auto space-y-8">
        <NextBestAction action={nextAction} userName={user.name} />
        
        <DashboardStats 
          profileCompletion={profileCompletion} 
          skillsCount={skillsCount} 
          gapsCount={skillGaps.length} 
          appsCount={activeAppsCount} 
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <SkillsToImprove skillGaps={skillGaps} />
              <OpportunitiesPreview opportunities={recommendedOpps} />
            </div>
            
            <ApplicationsPreview applications={applications.map(a => ({
              id: a.id,
              company: a.company,
              role: a.title,
              location: 'Remote',
              status: a.status === 'shortlisted' ? 'in-review' : (a.status as any),
              appliedDate: a.appliedAt
            }))} />
          </div>
          
          <div className="lg:col-span-4 flex flex-col gap-6">
            <LearningPreview />
            <PortfolioPreview status={{ hasResume: !!resume, hasAssessment: !!user?.isAssessed, skillsCount }} />
          </div>
        </div>
      </main>
    </div>
  );
}
