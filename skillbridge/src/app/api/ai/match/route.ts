import { NextResponse } from 'next/server';
import { calculateMatch, type UserProfile, type OpportunityProfile } from '@/lib/ai/matching-engine';
import { generateAIRecommendation } from '@/lib/ai/gemini-enhancer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user, opportunity, studentName } = body as {
      user: UserProfile;
      opportunity: OpportunityProfile;
      studentName?: string;
    };

    if (!user || !opportunity) {
      return NextResponse.json(
        { error: 'Missing user or opportunity profile' },
        { status: 400 }
      );
    }

    // Deterministic match calculation (works 100% offline & fast)
    const match = calculateMatch(user, opportunity);

    // Optional Gemini LLM enhancement for rich text reasoning
    let aiText = match.reason;
    if (process.env.GEMINI_API_KEY) {
      try {
        aiText = await generateAIRecommendation({
          studentName: studentName ?? 'Student',
          opportunityTitle: opportunity.title,
          company: opportunity.company,
          matchScore: match.score,
          matchedSkills: match.matchedSkills,
          missingSkills: match.missingSkills,
          breakdown: {
            skillCompatibility: match.breakdown.skillCompatibility,
            interestAlignment: match.breakdown.interestAlignment,
            eligibilityScore: match.eligibility.isEligible ? 100 : 50,
            projectRelevance: match.breakdown.projectRelevance,
          },
        });
      } catch (e) {
        console.warn('Gemini enhancement fallback triggered:', e);
      }
    }

    return NextResponse.json({
      ...match,
      aiRecommendation: aiText,
    });
  } catch (error) {
    console.error('Match API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process skill match' },
      { status: 500 }
    );
  }
}
