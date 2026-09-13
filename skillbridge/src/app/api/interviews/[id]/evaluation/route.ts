import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';
import { evaluateInterview } from '@/lib/interview/interview-scoring';

/**
 * GET /api/interviews/[id]/evaluation
 * Returns structured evaluation metrics for a completed interview session.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return apiError('UNAUTHORIZED', 'Authentication required', 401);
    }

    // Fetch the interview session
    const { data: interview, error: dbErr } = await supabase
      .from('interviews')
      .select('*, interview_messages(*)')
      .eq('id', id)
      .single();

    if (dbErr || !interview) {
      return apiError('NOT_FOUND', 'Interview session not found', 404);
    }

    // Verify access: candidate themselves or recruiter/institution
    if (interview.user_id !== user.id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (!profile || (profile.role !== 'industry' && profile.role !== 'institution')) {
        return apiError('FORBIDDEN', 'Access denied to interview evaluation', 403);
      }
    }

    return apiSuccess({
      interviewId: interview.id,
      status: interview.status,
      targetRole: interview.target_role,
      interviewType: interview.interview_type,
      overallScore: interview.overall_score,
      evaluation: interview.evaluation,
      durationSeconds: interview.duration_seconds,
      startedAt: interview.started_at,
      endedAt: interview.ended_at,
      messagesCount: interview.interview_messages?.length || 0,
    });
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * POST /api/interviews/[id]/evaluation
 * Compute or re-compute structured evaluation from stored interview messages.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return apiError('UNAUTHORIZED', 'Authentication required', 401);
    }

    const { data: interview, error: fetchErr } = await supabase
      .from('interviews')
      .select('*, interview_messages(*)')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchErr || !interview) {
      return apiError('NOT_FOUND', 'Interview session not found', 404);
    }

    const messages = interview.interview_messages || [];
    if (messages.length === 0) {
      return apiError('BAD_REQUEST', 'No messages found to evaluate', 400);
    }

    const transcript = messages.map((m: any, idx: number) => ({
      id: `msg-${idx}`,
      sender: m.speaker as 'user' | 'ai',
      text: m.content,
      timestamp: new Date(m.created_at || Date.now()),
    }));

    const config = {
      targetRole: interview.target_role || 'Software Engineer',
      type: interview.interview_type || 'Technical',
      difficulty: 'Adaptive',
      duration: '15m',
      useCamera: false,
      useScreen: false,
    };

    const evaluation = await evaluateInterview(transcript, config);

    await supabase
      .from('interviews')
      .update({
        evaluation,
        overall_score: evaluation.score.overall,
        status: 'completed',
        ended_at: new Date().toISOString(),
      })
      .eq('id', id);

    return apiSuccess({
      interviewId: id,
      evaluation,
      overallScore: evaluation.score.overall,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
