'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getSession, type UserSession } from '@/lib/user-session';
import { fetchMyOpportunities } from '@/backend/services/opportunities.service';

import { EmployerJourney } from '@/components/industry/EmployerJourney';
import { RecruiterHero } from '@/components/industry/RecruiterHero';
import { IndustryKpis } from '@/components/industry/IndustryKpis';
import { AITalentIntelligence, type CandidateItem } from '@/components/industry/AITalentIntelligence';
import { HiringPipeline } from '@/components/industry/HiringPipeline';
import { HiringSkillDemand } from '@/components/industry/HiringSkillDemand';
import { RecruitmentInsights } from '@/components/industry/RecruitmentInsights';
import { QuickActions } from '@/components/industry/QuickActions';
import { Loader2 } from 'lucide-react';

export default function IndustryDashboard() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<CandidateItem[]>([]);
  const [skillDemands, setSkillDemands] = useState<{ skill: string; percentage: number }[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    setUser(getSession());

    const sync = () => setUser(getSession());
    window.addEventListener('sb_session_updated', sync);

    async function loadDashboardData() {
      try {
        setIsLoading(true);
        setError(null);
        
        const [oppsResult, appsResult] = await Promise.allSettled([
          fetchMyOpportunities(),
          fetch('/api/applications').then((res) => {
            if (!res.ok) throw new Error('Failed to fetch applications');
            return res.json();
          }),
        ]);

        if (oppsResult.status === 'rejected') {
            console.error('Failed to load opportunities:', oppsResult.reason);
        }
        if (appsResult.status === 'rejected') {
            console.error('Failed to load applications:', appsResult.reason);
        }

        // Even if one fails, we can display the other, or show a global error if both fail
        if (oppsResult.status === 'rejected' && appsResult.status === 'rejected') {
            throw new Error('Failed to load dashboard data from servers.');
        }

        const loadedOpps = oppsResult.status === 'fulfilled' && Array.isArray(oppsResult.value)
          ? oppsResult.value
          : [];
        setOpportunities(loadedOpps);

        const loadedApps = appsResult.status === 'fulfilled' && Array.isArray(appsResult.value)
          ? appsResult.value
          : [];
        setApplications(loadedApps);

        // Convert real applications into candidate view items
        if (loadedApps.length > 0) {
          const mapped: CandidateItem[] = loadedApps.map((app: any) => ({
            id: app.id,
            name: app.student?.full_name || app.student?.name || 'Applicant',
            college: app.student?.college || 'College',
            branch: app.student?.branch || 'Engineering',
            graduationYear: app.student?.graduationYear,
            cgpa: app.student?.cgpa,
            score: app.match_score || app.matchScore || 0,
            skills: app.student?.skills, // The backend now provides skills here
          }));
          setCandidates(mapped);
        } else {
          setCandidates([]);
        }

        // Compute skill demands from real opportunity requirements
        const skillCounts: Record<string, number> = {};
        let totalSkillEntries = 0;
        loadedOpps.forEach((opp: any) => {
          // opportunity_skills is returned for fetched opportunities if they have them
          // note: fetchMyOpportunities doesn't join opportunity_skills by default in opportunity.service.ts
          // Wait, let's check fetchMyOpportunities. It selects 'id, title, type, status, location, work_mode, deadline, created_at'.
          // It doesn't select opportunity_skills. So this will be empty currently.
          // But we will leave the logic in case we update fetchMyOpportunities in the future.
          if (Array.isArray(opp.opportunity_skills)) {
            opp.opportunity_skills.forEach((s: any) => {
              const name = s.skills?.name || s.skill_id;
              if (name) {
                skillCounts[name] = (skillCounts[name] || 0) + 1;
                totalSkillEntries += 1;
              }
            });
          }
        });

        if (totalSkillEntries > 0) {
          const demands = Object.entries(skillCounts)
            .map(([skill, count]) => ({
              skill,
              percentage: Math.round((count / loadedOpps.length) * 100),
            }))
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 5);
          setSkillDemands(demands);
        } else {
          setSkillDemands([]);
        }
      } catch (err: any) {
        console.error('Error loading recruiter dashboard data:', err);
        setError(err.message || 'An error occurred while loading your dashboard.');
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();

    return () => window.removeEventListener('sb_session_updated', sync);
  }, []);

  const handleShortlist = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'shortlisted' }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      
      toast.success(`🎉 ${name} moved to Interview Pipeline!`, {
        description: 'Candidate status updated.',
      });
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'shortlisted' } : a))
      );
    } catch {
      toast.error(`Failed to shortlist ${name}. Please try again later.`);
    }
  };

  if (!isMounted) return null;

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-[60vh] items-center justify-center bg-[#FAFAF8]">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Loading command center...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-[60vh] items-center justify-center bg-[#FAFAF8] px-4 text-center">
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl border border-red-100 max-w-md w-full">
          <h2 className="font-bold mb-2">Error Loading Dashboard</h2>
          <p className="text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const companyName = user?.company || 'Your Company';
  const recruiterName = user?.name || 'Recruiter';

  const activeJobs = opportunities.filter((o) => o.status === 'active');
  const activeJobsCount = activeJobs.length;
  const totalApplicantsCount = applications.length;
  const shortlistedCount = applications.filter((a) => a.status === 'shortlisted').length;
  const interviewsCount = applications.filter((a) => a.status === 'interview').length;
  const offersCount = applications.filter((a) => a.status === 'offered' || a.status === 'accepted').length;
  const hiredCount = applications.filter((a) => a.status === 'hired' || a.status === 'accepted').length;

  const topOpportunity = activeJobs[0]?.title || undefined;
  const topSkill = skillDemands[0]?.skill || undefined;

  return (
    <div className="space-y-6 max-w-[1500px] mx-auto pb-12">
      {/* 1. Employer Recruitment Lifecycle */}
      <EmployerJourney />

      {/* 2. Command Center Hero */}
      <RecruiterHero companyName={companyName} userName={recruiterName} />

      {/* 3. Real KPI Analytics Widgets */}
      <IndustryKpis
        activeJobsCount={activeJobsCount}
        totalApplicantsCount={totalApplicantsCount}
        shortlistedCount={shortlistedCount}
        interviewsCount={interviewsCount}
      />

      {/* 4. AI Talent Intelligence — Hero Feature */}
      <AITalentIntelligence
        candidates={candidates}
        roleTitle={topOpportunity || 'Active Openings'}
        onShortlist={handleShortlist}
      />

      {/* 5. Connected Hiring Funnel */}
      <HiringPipeline
        applicantsCount={totalApplicantsCount}
        shortlistedCount={shortlistedCount}
        interviewsCount={interviewsCount}
        offersCount={offersCount}
        hiredCount={hiredCount}
      />

      {/* 6. Skills Demand & Quick Action Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 flex flex-col">
          <HiringSkillDemand skillDemands={skillDemands} />
        </div>

        <div className="lg:col-span-4 flex flex-col">
          <QuickActions />
        </div>
      </div>


      {/* 7. Recruitment Insights */}
      <RecruitmentInsights
        topSkill={topSkill}
        topOpportunity={topOpportunity}
        verifiedRatio={totalApplicantsCount > 0 ? Math.round((shortlistedCount / totalApplicantsCount) * 100) : undefined}
      />
    </div>
  );
}
