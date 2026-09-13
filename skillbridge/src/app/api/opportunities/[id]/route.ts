import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';
import { UpdateOpportunitySchema } from '@/lib/validations/opportunity.schema';

/**
 * GET /api/opportunities/[id]
 * Fetch single opportunity details with requirements
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: opp, error } = await supabase
      .from('opportunities')
      .select('*, opportunity_skills(skill_id, required_level)')
      .eq('id', id)
      .single();

    if (error) {
      return handleApiError(error);
    }

    return apiSuccess(opp);
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * PUT /api/opportunities/[id]
 * Update an existing opportunity (restricted to creator)
 */
export async function PUT(
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

    // Verify creator ownership
    const { data: existing, error: findErr } = await supabase
      .from('opportunities')
      .select('posted_by')
      .eq('id', id)
      .single();

    if (findErr || !existing) {
      return apiError('NOT_FOUND', 'Opportunity not found', 404);
    }

    if (existing.posted_by !== user.id) {
      return apiError('FORBIDDEN', 'Only the creator can update this opportunity', 403);
    }

    const body = await req.json();
    const validated = UpdateOpportunitySchema.parse(body);

    const { skills, ...oppFields } = validated;

    const { data: updated, error: updateErr } = await supabase
      .from('opportunities')
      .update(oppFields)
      .eq('id', id)
      .select()
      .single();

    if (updateErr) {
      return handleApiError(updateErr);
    }

    if (skills && skills.length > 0) {
      await supabase.from('opportunity_skills').delete().eq('opportunity_id', id);
      const skillRows = skills.map((s) => ({
        opportunity_id: id,
        skill_id: s.skill_id,
        required_level: s.required_level,
      }));
      await supabase.from('opportunity_skills').insert(skillRows);
    }

    return apiSuccess(updated);
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * DELETE /api/opportunities/[id]
 * Close or remove an opportunity (creator only)
 */
export async function DELETE(
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

    const { data: existing } = await supabase
      .from('opportunities')
      .select('posted_by')
      .eq('id', id)
      .single();

    if (!existing) {
      return apiError('NOT_FOUND', 'Opportunity not found', 404);
    }

    if (existing.posted_by !== user.id) {
      return apiError('FORBIDDEN', 'Only creator can delete this opportunity', 403);
    }

    // Soft delete / close status
    const { error: delErr } = await supabase
      .from('opportunities')
      .update({ status: 'closed' })
      .eq('id', id);

    if (delErr) {
      return handleApiError(delErr);
    }

    return apiSuccess({ message: 'Opportunity closed successfully' });
  } catch (err) {
    return handleApiError(err);
  }
}
