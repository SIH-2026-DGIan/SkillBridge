/**
 * Gemini AI enhancer — generates rich recommendation text.
 * Falls back gracefully to template strings if API key is missing or request fails.
 */

export interface EnhancerInput {
  studentName: string;
  opportunityTitle: string;
  company: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  breakdown: {
    skillCompatibility: number;
    interestAlignment: number;
    eligibilityScore: number;
    projectRelevance: number;
  };
}

export async function generateAIRecommendation(
  input: EnhancerInput
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return generateFallbackRecommendation(input);
  }

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an AI career advisor for SkillBridge, an Academia-Industry platform.

A student has a ${input.matchScore}% match for "${input.opportunityTitle}" at ${input.company}.

Match Breakdown:
- Skill Compatibility: ${input.breakdown.skillCompatibility}%
- Interest Alignment: ${input.breakdown.interestAlignment}%
- Eligibility: ${input.breakdown.eligibilityScore}%
- Project Relevance: ${input.breakdown.projectRelevance}%

Matched Skills: ${input.matchedSkills.join(', ') || 'None yet'}
Missing Skills: ${input.missingSkills.join(', ') || 'None'}

Write a 2-3 sentence personalized recommendation for the student. Be specific, encouraging, and actionable. Focus on what makes them a strong candidate and what to improve. Keep it under 60 words.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    return text || generateFallbackRecommendation(input);
  } catch (error) {
    console.warn('Gemini API error, using fallback:', error);
    return generateFallbackRecommendation(input);
  }
}

function generateFallbackRecommendation(input: EnhancerInput): string {
  const { matchScore, matchedSkills, missingSkills, opportunityTitle } = input;

  if (matchScore >= 85) {
    return `You are a strong candidate for ${opportunityTitle}. ${
      matchedSkills.length > 0
        ? `Your expertise in ${matchedSkills.slice(0, 3).join(', ')} directly matches what this role requires.`
        : ''
    }${
      missingSkills.length > 0
        ? ` Consider building your ${missingSkills.slice(0, 2).join(' and ')} skills to become an even stronger applicant.`
        : ' Apply with confidence!'
    }`;
  }

  if (matchScore >= 65) {
    return `You have a solid foundation for ${opportunityTitle}.${
      matchedSkills.length > 0
        ? ` Your ${matchedSkills.slice(0, 2).join(' and ')} skills are highly relevant to this role.`
        : ''
    }${
      missingSkills.length > 0
        ? ` Strengthening your ${missingSkills.slice(0, 3).join(', ')} knowledge will significantly boost your profile.`
        : ''
    }`;
  }

  return `This is a growth opportunity for you. ${
    missingSkills.length > 0
      ? `Focus on developing ${missingSkills.slice(0, 3).join(', ')} through our recommended learning resources to improve your match for ${opportunityTitle}.`
      : `Review the role requirements carefully and work on building the required skill set.`
  }`;
}
