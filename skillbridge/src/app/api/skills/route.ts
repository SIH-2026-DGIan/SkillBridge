import { NextRequest, NextResponse } from 'next/server';
import { SkillService } from '@/backend/services/skill.service';

/**
 * GET /api/skills
 * Retrieves all available skills in the platform
 */
export async function GET(req: NextRequest) {
  try {
    const skills = await SkillService.getAvailableSkills();
    return NextResponse.json(skills);
  } catch (error: any) {
    console.error('Error fetching available skills:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch available skills' },
      { status: 500 }
    );
  }
}
