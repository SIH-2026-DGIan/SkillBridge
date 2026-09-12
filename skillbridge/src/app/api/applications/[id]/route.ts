/**
 * GET /api/applications/[id]
 * Get a single application
 *
 * PUT /api/applications/[id]/status
 * Update application status (industry only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ApplicationService } from '@/backend/services/application.service';
import {
  checkRateLimit,
  rateLimitResponse,
  RATE_LIMITS,
} from '@/lib/rate-limit';
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const application = await ApplicationService.getApplication(id);

    // Check permissions
    if (
      application.student_id !== user.id &&
      application.opportunity?.posted_by !== user.id
    ) {
      return NextResponse.json(
        { error: 'You do not have permission to view this application' },
        { status: 403 }
      );
    }

    return NextResponse.json(application);
  } catch (error: any) {
    console.error('Error fetching application:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch application' },
      { status: 400 }
    );
  }
}

/**
 * PUT /api/applications/[id]/status
 * Update application status
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Verify user is from industry
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profile?.role !== 'industry') {
      return NextResponse.json(
        { error: 'Only industry users can update application status' },
        { status: 403 }
      );
    }
// Rate limit application status updates per authenticated industry user
const rateLimit = checkRateLimit(
  `application-status:${user.id}`,
  RATE_LIMITS.general
);

if (!rateLimit.allowed) {
  return rateLimitResponse(
    rateLimit,
    'Application status update limit exceeded. Please try again later.'
  );
}
    const body = await req.json();
    const { status, rejectionReason } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'status is required' },
        { status: 400 }
      );
    }

    const application = await ApplicationService.updateApplicationStatus(
      id,
      status,
      user.id,
      rejectionReason
    );

    return NextResponse.json(application);
  } catch (error: any) {
    console.error('Error updating application status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update application' },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/applications/[id]
 * Withdraw an application (student only)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Verify user is a student
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profile?.role !== 'student') {
      return NextResponse.json(
        { error: 'Only students can withdraw applications' },
        { status: 403 }
      );
    }

    // Rate limit application withdrawals
    const rateLimit = checkRateLimit(
      `application-withdraw:${user.id}`,
      RATE_LIMITS.general
    );

    if (!rateLimit.allowed) {
      return rateLimitResponse(
        rateLimit,
        'Application withdrawal limit exceeded. Please try again later.'
      );
    }

    await ApplicationService.withdrawApplication(id, user.id);

    return NextResponse.json({ success: true, message: 'Application withdrawn successfully' });
  } catch (error: any) {
    console.error('Error withdrawing application:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to withdraw application' },
      { status: 400 }
    );
  }
}
