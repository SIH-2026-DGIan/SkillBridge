import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiSuccess, apiError, handleApiError } from '@/lib/api-response';
import {
  StudentProfileSchema,
  TpoProfileSchema,
  RecruiterProfileSchema,
  FacultyProfileSchema,
} from '@/lib/validations/profile.schema';

/**
 * GET /api/profile
 * Returns the profile of the currently authenticated user.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return apiError('UNAUTHORIZED', 'Authentication required', 401);
    }

    const { data: profile, error: dbErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (dbErr && dbErr.code !== 'PGRST116') {
      return handleApiError(dbErr);
    }

    // If profile doesn't exist yet, return basic user context from auth
    const result = profile || {
      id: user.id,
      user_id: user.id,
      name: user.user_metadata?.full_name || user.user_metadata?.name || '',
      email: user.email,
      role: user.user_metadata?.role || 'student',
      avatar_url: user.user_metadata?.avatar_url || null,
    };

    return apiSuccess(result);
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * PUT /api/profile
 * Updates the profile of the currently authenticated user with role-specific payload validation.
 */
export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !user) {
      return apiError('UNAUTHORIZED', 'Authentication required', 401);
    }

    const body = await req.json();
    const role = body.role || user.user_metadata?.role || 'student';

    let validatedData: Record<string, any>;

    switch (role) {
      case 'institution':
      case 'tpo':
        validatedData = TpoProfileSchema.parse(body);
        break;
      case 'industry':
      case 'recruiter':
        validatedData = RecruiterProfileSchema.parse(body);
        break;
      case 'academician':
      case 'faculty':
        validatedData = FacultyProfileSchema.parse(body);
        break;
      case 'student':
      default:
        validatedData = StudentProfileSchema.parse(body);
        break;
    }

    const internalRole =
      role === 'tpo' ? 'institution' :
      role === 'recruiter' ? 'industry' :
      role === 'faculty' ? 'academician' : role;

    const upsertPayload = {
      ...validatedData,
      user_id: user.id,
      role: internalRole,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedProfile, error: upsertErr } = await supabase
      .from('profiles')
      .upsert(upsertPayload, { onConflict: 'user_id' })
      .select('*')
      .single();

    if (upsertErr) {
      return handleApiError(upsertErr);
    }

    return apiSuccess(updatedProfile, undefined, 200);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: NextRequest) {
  return PUT(req);
}
