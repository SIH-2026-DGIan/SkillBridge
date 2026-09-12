import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { MatchingService } from '@/backend/services/matching.service';
import { SkillService } from '@/backend/services/skill.service';

/**
 * GET /api/user/skills/gap
 * Calculates skill gaps for the authenticated user based on their target roles
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile for target roles
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('target_roles')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Get user skills
    const userSkillsRaw = await SkillService.getUserSkills(user.id);
    const userSkillMap: Record<string, number> = {};
    
    for (const us of userSkillsRaw) {
      userSkillMap[us.skill_id] = us.proficiency;
    }

    const targetRole = profile?.target_roles?.[0] || 'Software Engineer';
    
    // Find opportunities matching their target role
    const opportunities = MatchingService.findTopOpportunities(userSkillMap, targetRole);
    
    // Aggregate gaps across top 3 matching opportunities
    const topOpps = opportunities.slice(0, 3);
    const skillGaps = new Set<string>();
    
    for (const opp of topOpps) {
      if (opp.matchDetails?.missingSkills) {
        opp.matchDetails.missingSkills.forEach((skill: string) => skillGaps.add(skill));
      }
    }

    return NextResponse.json({
      targetRole,
      gaps: Array.from(skillGaps),
      basedOn: topOpps.map(opp => opp.title)
    });
  } catch (error: any) {
    console.error('Error calculating skill gaps:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to calculate skill gaps' },
      { status: 500 }
    );
  }
}
