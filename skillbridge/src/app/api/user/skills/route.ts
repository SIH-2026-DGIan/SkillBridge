import { NextRequest, NextResponse } from 'next/server';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server';
import { SkillService } from '@/backend/services/skill.service';
import { checkRateLimit, rateLimitResponse, RATE_LIMITS } from '@/lib/rate-limit';

/**
 * GET /api/user/skills
 * Retrieves skills for the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json([]);
    }

    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const skills = await SkillService.getUserSkills(user.id);
    return NextResponse.json(skills);
  } catch (error: any) {
    console.error('Error fetching user skills:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user skills' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/skills
 * Adds a new skill for the authenticated user
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting for adding skills
    const rateLimit = checkRateLimit(`add_skill:${user.id}`, RATE_LIMITS.general);
    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit, 'Too many requests. Please try again later.');
    }

    const body = await req.json();
    const { skillId, proficiency, source } = body;

    // Validation
    if (!skillId) {
      return NextResponse.json({ error: 'skillId is required' }, { status: 400 });
    }

    if (typeof proficiency !== 'number' || proficiency < 0 || proficiency > 100) {
      return NextResponse.json(
        { error: 'proficiency must be a number between 0 and 100' },
        { status: 400 }
      );
    }

    const newSkill = await SkillService.addUserSkill(user.id, skillId, proficiency, source || 'self');
    return NextResponse.json(newSkill, { status: 201 });
  } catch (error: any) {
    console.error('Error adding user skill:', error);
    
    // Handle unique constraint violation (user already has this skill)
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'You already have this skill added to your profile' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to add user skill' },
      { status: 400 }
    );
  }
}
