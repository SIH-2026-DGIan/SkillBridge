/**
 * GET /api/applications/[id]/history
 * Get application status history (timeline)
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
// Rate limit application history requests per authenticated user
const rateLimit = checkRateLimit(
  `application-history:${user.id}`,
  RATE_LIMITS.general
);

if (!rateLimit.allowed) {
  return rateLimitResponse(
    rateLimit,
    'Application history request limit exceeded. Please try again later.'
  );
}
    // Check permissions - user must be the student or the industry contact for the opportunity
    const { data: application } = await supabase
      .from('applications')
      .select(
        `
        id,
        student_id,
        opportunities:opportunity_id (
          posted_by
        )
      `
      )
      .eq('id', id)
      .single();

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    if (
      application.student_id !== user.id &&
      application.opportunities?.[0]?.posted_by !== user.id
    ) {
      return NextResponse.json(
        { error: 'You do not have permission to view this application history' },
        { status: 403 }
      );
    }

    const history = await ApplicationService.getApplicationHistory(id);

    return NextResponse.json(history);
  } catch (error: any) {
    console.error('Error fetching application history:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch application history' },
      { status: 400 }
    );
  }
}
