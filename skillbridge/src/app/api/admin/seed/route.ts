import { NextResponse } from 'next/server';
import { DEMO_COMPANIES, DEMO_OPPORTUNITIES, DEMO_LEARNING_RESOURCES } from '@/lib/demo-data';
import { SKILLS } from '@/lib/skills-taxonomy';
import {
  checkRateLimit,
  rateLimitResponse,
  RATE_LIMITS,
} from '@/lib/rate-limit';

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(
    'admin-seed',
    RATE_LIMITS.auth
  );

  if (!rateLimit.allowed) {
    return rateLimitResponse(
      rateLimit,
      'Admin seed request limit exceeded. Please try again later.'
    );
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasSupabase = supabaseUrl && supabaseUrl !== 'your_supabase_project_url';

    if (!hasSupabase) {
      return NextResponse.json({
        success: true,
        message: 'Running in Demo Mode. Pre-seeded demo dataset is actively serving mock endpoints.',
        seededCounts: {
          skills: SKILLS.length,
          companies: DEMO_COMPANIES.length,
          opportunities: DEMO_OPPORTUNITIES.length,
          learningResources: DEMO_LEARNING_RESOURCES.length,
        },
      });
    }

    const { createClient } = await import('@/lib/supabase/client');
    const supabase = createClient();

    // 1. Seed Skills
    const skillPayload = SKILLS.map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category,
    }));
    await supabase.from('skills').upsert(skillPayload, { onConflict: 'id' });

    // 2. Seed Opportunities
    for (const opp of DEMO_OPPORTUNITIES) {
      const { data: createdOpp } = await supabase.from('opportunities').upsert({
        id: opp.id.startsWith('opp-') ? undefined : opp.id,
        company: opp.company,
        type: opp.type,
        title: opp.title,
        description: opp.description,
        location: opp.location,
        work_mode: opp.workMode,
        duration: opp.duration,
        stipend: opp.stipend,
        deadline: opp.deadline,
        category: opp.category,
        eligibility: opp.eligibility,
        status: 'active',
      }).select().single();

      if (createdOpp && opp.requiredSkills) {
        for (const req of opp.requiredSkills) {
          await supabase.from('opportunity_skills').upsert({
            opportunity_id: createdOpp.id,
            skill_id: req.skillId,
            required_level: req.requiredLevel,
          });
        }
      }
    }

    // 3. Seed Learning Resources
    for (const lr of DEMO_LEARNING_RESOURCES) {
      await supabase.from('learning_resources').upsert({
        title: lr.title,
        description: lr.description,
        skill_id: lr.skillId,
        level: lr.level,
        duration: lr.duration,
        url: lr.url,
        provider: lr.provider,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase database successfully seeded with realistic ecosystem data!',
    });
  } catch (error) {
    console.error('Seed API error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
