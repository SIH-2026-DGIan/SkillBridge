import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';
import {
  CreateOpportunitySchema,
  OpportunityQuerySchema,
} from '@/lib/validations/opportunity.schema';

/**
 * GET /api/opportunities
 * Returns a paginated list of opportunities with filtering and search.
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const url = new URL(req.url);

    const queryParams = Object.fromEntries(url.searchParams.entries());
    const validated = OpportunityQuerySchema.parse(queryParams);

    const { page, limit, search, type, work_mode, location, status } = validated;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('opportunities')
      .select('*, opportunity_skills(skill_id, required_level)', { count: 'exact' });

    if (status) {
      query = query.eq('status', status);
    }
    if (type) {
      query = query.eq('type', type);
    }
    if (work_mode) {
      query = query.eq('work_mode', work_mode);
    }
    if (location) {
      query = query.ilike('location', `%${location}%`);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,company.ilike.%${search}%,description.ilike.%${search}%`);
    }

    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: opportunities, error, count } = await query;

    if (error) {
      return handleApiError(error);
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    return apiSuccess(opportunities || [], {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * POST /api/opportunities
 * Creates a new job/internship opportunity.
 * Restricted to authenticated users with role 'industry' or 'institution'.
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return apiError('UNAUTHORIZED', 'Authentication required to post opportunities', 401);
    }

    // Verify role permissions
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, company, institution')
      .eq('user_id', user.id)
      .single();

    const allowedRoles = ['industry', 'institution'];
    const userRole = profile?.role || user.user_metadata?.role;

    if (!allowedRoles.includes(userRole)) {
      return apiError('FORBIDDEN', 'Only industry recruiters and institutions can post opportunities', 403);
    }

    const body = await req.json();
    const validated = CreateOpportunitySchema.parse(body);

    const companyName =
      profile?.company ||
      profile?.institution ||
      user.user_metadata?.company ||
      'SkillBridge Partner';

    // Insert opportunity
    const { data: opp, error: oppErr } = await supabase
      .from('opportunities')
      .insert({
        title: validated.title,
        company: companyName,
        type: validated.type,
        description: validated.description,
        location: validated.location,
        work_mode: validated.work_mode,
        duration: validated.duration,
        stipend: validated.stipend,
        deadline: validated.deadline,
        category: validated.category,
        status: validated.status,
        posted_by: user.id,
      })
      .select()
      .single();

    if (oppErr) {
      return handleApiError(oppErr);
    }

    // Insert associated opportunity skills if any
    if (validated.skills && validated.skills.length > 0) {
      const skillRows = validated.skills.map((s) => ({
        opportunity_id: opp.id,
        skill_id: s.skill_id,
        required_level: s.required_level,
      }));

      const { error: skillsErr } = await supabase
        .from('opportunity_skills')
        .insert(skillRows);

      if (skillsErr) {
        console.warn('Could not insert opportunity skills:', skillsErr);
      }
    }

    return apiSuccess(opp, undefined, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
