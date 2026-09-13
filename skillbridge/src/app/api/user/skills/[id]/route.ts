import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { SkillService } from '@/backend/services/skill.service';
import { checkRateLimit, rateLimitResponse, RATE_LIMITS } from '@/lib/rate-limit';

/**
 * PUT /api/user/skills/[id]
 * Updates an existing user skill (proficiency)
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting for updates
    const rateLimit = checkRateLimit(`update_skill:${user.id}`, RATE_LIMITS.api);
    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit, 'Too many requests. Please try again later.');
    }

    const body = await req.json();
    const { proficiency } = body;

    // Validation
    if (typeof proficiency !== 'number' || proficiency < 0 || proficiency > 100) {
      return NextResponse.json(
        { error: 'proficiency must be a number between 0 and 100' },
        { status: 400 }
      );
    }

    // Pass user.id to ensure users can only update their own skills
    const { id } = await params;
    const updatedSkill = await SkillService.updateUserSkill(user.id, id, proficiency);
    return NextResponse.json(updatedSkill);
  } catch (error: any) {
    console.error('Error updating user skill:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update user skill' },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/user/skills/[id]
 * Removes a skill from the user's profile
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Pass user.id to ensure users can only delete their own skills
    const { id } = await params;
    await SkillService.removeUserSkill(user.id, id);
    
    return NextResponse.json({ success: true, message: 'Skill removed successfully' });
  } catch (error: any) {
    console.error('Error removing user skill:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to remove user skill' },
      { status: 400 }
    );
  }
}
