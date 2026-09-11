/**
 * POST /api/applications
 * Student applies to an opportunity
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApplicationService } from '@/backend/services/application.service';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get student profile to verify role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profile?.role !== 'student') {
      return NextResponse.json(
        { error: 'Only students can apply to opportunities' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { opportunityId, matchScore } = body;

    if (!opportunityId) {
      return NextResponse.json(
        { error: 'opportunityId is required' },
        { status: 400 }
      );
    }

    const application = await ApplicationService.createApplication(
      opportunityId,
      user.id,
      matchScore
    );

    return NextResponse.json(application, { status: 201 });
  } catch (error: any) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create application' },
      { status: 400 }
    );
  }
}

/**
 * GET /api/applications
 * List applications (for current user based on role)
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    // If no Supabase user, check for demo session cookie
    if (userError || !user) {
      const demoCookie = req.cookies.get('sb-demo-session');
      if (demoCookie?.value) {
        try {
          const session = JSON.parse(decodeURIComponent(demoCookie.value));
          const role = session.role;
          const sessionId = session.id || 'demo-user-id';

          if (role === 'industry') {
            try {
              const applications = await ApplicationService.getIndustryApplications(sessionId);
              return NextResponse.json(applications || []);
            } catch {
              return NextResponse.json([]);
            }
          } else if (role === 'student') {
            try {
              const applications = await ApplicationService.getStudentApplications(sessionId);
              return NextResponse.json(applications || []);
            } catch {
              return NextResponse.json([]);
            }
          }
        } catch {
          return NextResponse.json([]);
        }
      }

      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user profile to determine role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    let applications = [];
    if (profile?.role === 'student') {
      applications = await ApplicationService.getStudentApplications(user.id);
    } else if (profile?.role === 'industry') {
      applications = await ApplicationService.getIndustryApplications(user.id);
    } else {
      return NextResponse.json(
        { error: 'User role is not eligible to view applications' },
        { status: 403 }
      );
    }

    return NextResponse.json(applications || []);
  } catch (error: any) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch applications' },
      { status: 400 }
    );
  }
}
