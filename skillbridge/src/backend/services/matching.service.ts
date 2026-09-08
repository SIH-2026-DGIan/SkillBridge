/**
 * Matching Service
 * Calculates fit scores between candidate skill profiles and opportunity requirements.
 */

import { calculateMatch, type MatchResult, type UserProfile, type OpportunityProfile } from '@/lib/ai/matching-engine';
import { DEMO_OPPORTUNITIES } from '@/lib/demo-data';

export class MatchingService {
  /**
   * Calculates match percentage and detailed skill breakdown for a student profile against an opportunity.
   */
  static matchCandidateToOpportunity(user: UserProfile, opportunity: OpportunityProfile): MatchResult {
    return calculateMatch(user, opportunity);
  }

  /**
   * Matches candidate skills against all active demo opportunities and sorts by highest match score.
   */
  static findTopOpportunities(userSkills: Record<string, number>, targetRole?: string) {
    const userProfile: UserProfile = {
      skills: Object.entries(userSkills).map(([skillId, proficiency]) => ({ skillId, proficiency })),
      targetRoles: [targetRole || 'Software Engineer'],
      education: { degree: 'B.Tech', branch: 'Computer Science', graduationYear: 2027 },
      projects: [],
    };

    const matches = DEMO_OPPORTUNITIES.map((opp) => {
      const oppProfile: OpportunityProfile = {
        id: opp.id,
        title: opp.title,
        company: opp.company,
        type: (opp as any).type || 'internship',
        requiredSkills: opp.requiredSkills,
      };

      const match = calculateMatch(userProfile, oppProfile);
      return {
        ...opp,
        matchScore: match.score,
        matchDetails: match,
      };
    });

    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }
}
