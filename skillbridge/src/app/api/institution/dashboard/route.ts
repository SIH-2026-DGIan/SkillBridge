import { NextRequest, NextResponse } from 'next/server';
import {
  checkRateLimit,
  rateLimitResponse,
  RATE_LIMITS,
} from '@/lib/rate-limit';
export async function GET(request: NextRequest) {
  const clientId =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  const rateLimit = checkRateLimit(
    `institution-dashboard:${clientId}`,
    RATE_LIMITS.general
  );

  if (!rateLimit.allowed) {
    return rateLimitResponse(
      rateLimit,
      'Dashboard request limit exceeded. Please try again later.'
    );
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const collegeParam = searchParams.get('college') || searchParams.get('institution') || '';

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const hasSupabase =
      supabaseUrl &&
      supabaseKey &&
      supabaseUrl !== 'your_supabase_project_url' &&
      supabaseKey !== 'your_supabase_anon_key';

    let studentList: Array<any> = [];
    let opportunityList: Array<any> = [];
    let appList: Array<any> = [];
    let assessList: Array<any> = [];

    if (hasSupabase) {
      try {
        const { createClient } = await import('@/lib/supabase/server');
        const supabase = await createClient();

        // 1. Fetch Students
        let studentQuery = supabase
          .from('profiles')
          .select('user_id, name, branch, college, created_at')
          .eq('role', 'student');

        if (collegeParam) {
          studentQuery = studentQuery.ilike('college', `%${collegeParam}%`);
        }

        const { data: students } = await studentQuery;
        if (students) studentList = students;

        // 2. Fetch Opportunities
        const { data: opps } = await supabase
          .from('opportunities')
          .select('id, title, company, type, location, created_at, deadline, status');
        if (opps) opportunityList = opps;

        // 3. Fetch Applications
        const { data: apps } = await supabase
          .from('applications')
          .select('id, student_id, status, applied_at, opportunity_id');
        if (apps) appList = apps;

        // 4. Fetch Assessments
        const { data: assessments } = await supabase
          .from('assessments')
          .select('user_id, score, skill_scores, completed_at');
        if (assessments) assessList = assessments;
      } catch (dbErr) {
        console.warn('Supabase DB connection skipped or failed:', dbErr);
      }
    }

    const totalStudents = studentList.length;
    const activeOpps = opportunityList.filter(
      (o) => !o.status || o.status === 'active' || o.status === 'open'
    );
    const activeOpportunitiesCount = activeOpps.length;
    const uniqueCompanies = [...new Set(opportunityList.map((o) => o.company).filter(Boolean))];
    const partnerCompaniesCount = uniqueCompanies.length;

    const pipeline = {
      applied: appList.length,
      shortlisted: appList.filter(
        (a) => a.status === 'shortlisted' || a.status === 'interview' || a.status === 'selected'
      ).length,
      interviewed: appList.filter(
        (a) => a.status === 'interview' || a.status === 'selected'
      ).length,
      offers: appList.filter((a) => a.status === 'selected').length,
      placed: appList.filter((a) => a.status === 'selected').length,
    };

    const placementRate =
      totalStudents > 0 && pipeline.placed > 0
        ? Math.round((pipeline.placed / totalStudents) * 100)
        : null;

    let readiness: {
      overall: number | null;
      technical: number | null;
      communication: number | null;
      problemSolving: number | null;
      domain: number | null;
    } = {
      overall: null,
      technical: null,
      communication: null,
      problemSolving: null,
      domain: null,
    };

    if (assessList.length > 0) {
      const avgScore = Math.round(
        assessList.reduce((acc, curr) => acc + (curr.score || 0), 0) / assessList.length
      );
      readiness.overall = avgScore;

      let techSum = 0, techCount = 0;
      let commSum = 0, commCount = 0;
      let probSum = 0, probCount = 0;
      let domSum = 0, domCount = 0;

      assessList.forEach((a) => {
        const ss = a.skill_scores || {};
        if (ss.technical || ss.coding || ss.Tech) {
          techSum += ss.technical || ss.coding || ss.Tech;
          techCount++;
        }
        if (ss.communication || ss.soft_skills) {
          commSum += ss.communication || ss.soft_skills;
          commCount++;
        }
        if (ss.problem_solving || ss.aptitude) {
          probSum += ss.problem_solving || ss.aptitude;
          probCount++;
        }
        if (ss.domain || ss.core) {
          domSum += ss.domain || ss.core;
          domCount++;
        }
      });

      if (techCount > 0) readiness.technical = Math.round(techSum / techCount);
      if (commCount > 0) readiness.communication = Math.round(commSum / commCount);
      if (probCount > 0) readiness.problemSolving = Math.round(probSum / probCount);
      if (domCount > 0) readiness.domain = Math.round(domSum / domCount);
    }

    const branches = [
      { name: 'Computer Science & Engineering', code: 'CSE' },
      { name: 'Information Technology', code: 'IT' },
      { name: 'Electronics & Communication', code: 'ECE' },
      { name: 'Electrical Engineering', code: 'EE' },
      { name: 'Mechanical Engineering', code: 'ME' },
      { name: 'Civil Engineering', code: 'CE' },
    ];

    const departmentStats = branches.map((b) => {
      const branchStudents = studentList.filter(
        (s) =>
          s.branch &&
          (s.branch.toLowerCase().includes(b.code.toLowerCase()) ||
            s.branch.toLowerCase().includes(b.name.toLowerCase()))
      );
      const count = branchStudents.length;

      return {
        name: b.name,
        code: b.code,
        studentCount: count > 0 ? count : null,
        placedCount: null,
        percent: null,
      };
    });

    const recentOpportunities = activeOpps.slice(0, 5).map((o) => ({
      id: o.id,
      company: o.company || 'Partner Company',
      role: o.title || 'Opportunity',
      type: o.type || 'Full Time',
      deadline: o.deadline || 'Open',
    }));

    const ecosystemStatus = {
      studentData: totalStudents > 0 ? 'Connected' : 'Not Configured',
      opportunities: activeOpportunitiesCount > 0 ? 'Synced' : 'Not Configured',
      assessments: assessList.length > 0 ? 'Active' : 'Pending',
      placementDrives: activeOpportunitiesCount > 0 ? 'Active' : 'Not Configured',
      analytics: 'Ready',
    };

    return NextResponse.json({
      success: true,
      metrics: {
        totalStudents: totalStudents > 0 ? totalStudents : null,
        activeOpportunities: activeOpportunitiesCount > 0 ? activeOpportunitiesCount : null,
        partnerCompanies: partnerCompaniesCount > 0 ? partnerCompaniesCount : null,
        placementRate,
      },
      pipeline: {
        hasData: appList.length > 0,
        applied: appList.length > 0 ? pipeline.applied : null,
        shortlisted: appList.length > 0 ? pipeline.shortlisted : null,
        interviewed: appList.length > 0 ? pipeline.interviewed : null,
        offers: appList.length > 0 ? pipeline.offers : null,
        placed: appList.length > 0 ? pipeline.placed : null,
      },
      readiness,
      departmentStats,
      recentOpportunities,
      ecosystemStatus,
      topHiringCompanies: uniqueCompanies.slice(0, 5),
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error in /api/institution/dashboard:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

