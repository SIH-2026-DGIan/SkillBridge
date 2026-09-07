import { SKILL_MAP } from '@/lib/skills-taxonomy';

export interface UserProfile {
  skills: { skillId: string; proficiency: number }[];
  targetRoles: string[];
  education: { degree: string; branch: string; graduationYear: number };
  projects: { technologies: string[] }[];
  cgpa?: number;
}

export interface OpportunityProfile {
  id: string;
  title: string;
  company: string;
  type: 'internship' | 'job' | 'live_project';
  category?: string;
  requiredSkills: { skillId: string; requiredLevel: number }[];
  eligibility?: {
    minCgpa?: number;
    degrees?: string[];
    maxGradYear?: number;
    minGradYear?: number;
  };
}

export interface MatchResult {
  opportunityId: string;
  score: number; // 0 - 100 based on Skills 60%, Interest 20%, Projects 20%
  breakdown: {
    skillCompatibility: number;
    interestAlignment: number;
    projectRelevance: number;
  };
  eligibility: {
    isEligible: boolean;
    status: 'eligible' | 'warning' | 'ineligible';
    criteria: { label: string; met: boolean; details?: string }[];
  };
  matchedSkills: string[];
  missingSkills: string[];
  reason: string;
}

/**
 * Core deterministic matching engine (SIH 2026 Specification)
 * 
 * Formula:
 * - Skill Compatibility: 60%
 * - Interest Alignment: 20%
 * - Project Relevance: 20%
 * 
 * Eligibility is evaluated independently as a hard filter/gate,
 * preventing arbitrary score penalties and providing transparent explanations.
 */
export function calculateMatch(
  user: UserProfile,
  opportunity: OpportunityProfile
): MatchResult {
  const userSkillMap: Record<string, number> = {};
  for (const s of user.skills) {
    userSkillMap[s.skillId] = s.proficiency;
  }

  // ── 1. Skill Compatibility (60% weight) ───────────────────────
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];
  let skillRatioSum = 0;

  for (const req of opportunity.requiredSkills) {
    const userLevel = userSkillMap[req.skillId] ?? 0;
    // Ratio of user level to required level, bounded at 1.05 for slight over-qualification bonus
    const ratio = Math.min(userLevel / req.requiredLevel, 1.05);
    skillRatioSum += ratio;

    const skillName = SKILL_MAP[req.skillId]?.name ?? req.skillId;
    if (ratio >= 0.70) {
      matchedSkills.push(skillName);
    } else {
      missingSkills.push(skillName);
    }
  }

  const rawSkillScore =
    opportunity.requiredSkills.length > 0
      ? (skillRatioSum / opportunity.requiredSkills.length) * 100
      : 70;
  const skillCompatibility = Math.min(100, Math.round(rawSkillScore));

  // ── 2. Interest / Career Goal Alignment (20% weight) ──────────
  let interestAlignment = 50; // default neutral
  const oppCategory = (opportunity.category ?? opportunity.type).toLowerCase();
  const oppTitle = opportunity.title.toLowerCase();

  for (const role of user.targetRoles) {
    const roleLower = role.toLowerCase();
    const roleWords = roleLower.split(' ');

    if (
      oppTitle.includes(roleLower) ||
      (oppCategory && roleLower.includes(oppCategory)) ||
      (roleLower.includes('machine learning') && (oppTitle.includes('ml') || oppTitle.includes('machine learning') || oppTitle.includes('ai'))) ||
      (roleLower.includes('frontend') && (oppTitle.includes('react') || oppTitle.includes('frontend') || oppTitle.includes('web'))) ||
      (roleLower.includes('data analyst') && (oppTitle.includes('data') || oppTitle.includes('analyst')))
    ) {
      interestAlignment = 95;
      break;
    }

    const matches = roleWords.filter(
      (w) => w.length > 2 && (oppTitle.includes(w) || oppCategory.includes(w))
    );
    if (matches.length >= 2) {
      interestAlignment = 85;
      break;
    } else if (matches.length === 1) {
      interestAlignment = Math.max(interestAlignment, 70);
    }
  }

  // ── 3. Project & Portfolio Relevance (20% weight) ────────────
  let projectRelevance = 50; // default base
  if (user.projects && user.projects.length > 0) {
    const requiredSkillIds = new Set(opportunity.requiredSkills.map((r) => r.skillId.toLowerCase()));
    let maxProjectMatchRatio = 0;
    let anyTechOverlapCount = 0;

    for (const project of user.projects) {
      const pTechs = project.technologies.map((t) => t.toLowerCase());
      const overlapping = pTechs.filter((t) => requiredSkillIds.has(t));
      if (overlapping.length > 0) {
        anyTechOverlapCount += overlapping.length;
        const ratio = overlapping.length / Math.max(1, requiredSkillIds.size);
        maxProjectMatchRatio = Math.max(maxProjectMatchRatio, ratio);
      }
    }

    if (maxProjectMatchRatio >= 0.5) {
      projectRelevance = 90;
    } else if (maxProjectMatchRatio > 0) {
      projectRelevance = Math.min(85, Math.round(60 + maxProjectMatchRatio * 35));
    } else if (anyTechOverlapCount > 0) {
      projectRelevance = 70;
    }
  }

  // ── 4. Eligibility Check (Hard Filter & Status Gate) ───────────
  const criteriaList: { label: string; met: boolean; details?: string }[] = [];
  let isEligible = true;

  if (opportunity.eligibility) {
    const { minCgpa, degrees, maxGradYear, minGradYear } = opportunity.eligibility;

    if (minCgpa !== undefined) {
      const meets = (user.cgpa ?? 8.0) >= minCgpa;
      criteriaList.push({
        label: `Minimum CGPA: ${minCgpa}`,
        met: meets,
        details: `Your CGPA: ${user.cgpa ?? 'N/A'}`,
      });
      if (!meets) isEligible = false;
    }

    if (maxGradYear !== undefined) {
      const meets = user.education.graduationYear <= maxGradYear;
      criteriaList.push({
        label: `Graduation Year: ≤ ${maxGradYear}`,
        met: meets,
        details: `Your Batch: ${user.education.graduationYear}`,
      });
      if (!meets) isEligible = false;
    }

    if (minGradYear !== undefined) {
      const meets = user.education.graduationYear >= minGradYear;
      criteriaList.push({
        label: `Graduation Year: ≥ ${minGradYear}`,
        met: meets,
        details: `Your Batch: ${user.education.graduationYear}`,
      });
      if (!meets) isEligible = false;
    }

    if (degrees && degrees.length > 0) {
      const meets = degrees.some(
        (d) =>
          user.education.degree.toLowerCase().includes(d.toLowerCase()) ||
          user.education.branch.toLowerCase().includes(d.toLowerCase())
      );
      criteriaList.push({
        label: `Eligible Degrees: ${degrees.join(', ')}`,
        met: meets,
        details: `${user.education.degree} in ${user.education.branch}`,
      });
      if (!meets) isEligible = false;
    }
  }

  // ── 5. Calculate Final Match Score ────────────────────────────
  // Formula: 60% Skills + 20% Interest + 20% Projects
  const calculatedScore = Math.round(
    skillCompatibility * 0.60 +
    interestAlignment * 0.20 +
    projectRelevance * 0.20
  );

  const finalScore = Math.min(99, Math.max(15, calculatedScore));

  // ── 6. Human-readable Recommendation Reason ───────────────────
  const reason = generateReason(
    matchedSkills,
    missingSkills,
    finalScore,
    opportunity.title,
    opportunity.company
  );

  return {
    opportunityId: opportunity.id,
    score: finalScore,
    breakdown: {
      skillCompatibility,
      interestAlignment,
      projectRelevance,
    },
    eligibility: {
      isEligible,
      status: isEligible ? 'eligible' : 'warning',
      criteria: criteriaList,
    },
    matchedSkills,
    missingSkills,
    reason,
  };
}

function generateReason(
  matched: string[],
  missing: string[],
  score: number,
  title: string,
  company: string
): string {
  if (score >= 85) {
    return `You are a strong candidate for ${title} at ${company}. ${
      matched.length > 0
        ? `Your ${matched.slice(0, 4).join(', ')} skills directly align with this role.`
        : ''
    }${
      missing.length > 0
        ? ` Developing ${missing.slice(0, 2).join(' and ')} will further strengthen your competitive edge.`
        : ' You meet all core requirements.'
    }`;
  }
  if (score >= 65) {
    return `You have a solid foundation for ${title}.${
      matched.length > 0
        ? ` Your ${matched.slice(0, 3).join(', ')} competencies are highly relevant.`
        : ''
    }${
      missing.length > 0
        ? ` Focus on learning ${missing.slice(0, 2).join(' and ')} to maximize your match.`
        : ''
    }`;
  }
  return `This role requires specific skills you are still acquiring.${
    missing.length > 0
      ? ` Work through recommended learning paths in ${missing.slice(0, 3).join(', ')} to qualify.`
      : ''
  }`;
}

/**
 * Rank opportunities for a user — sorted by match score
 */
export function rankOpportunities(
  user: UserProfile,
  opportunities: OpportunityProfile[]
): MatchResult[] {
  return opportunities
    .map((opp) => calculateMatch(user, opp))
    .sort((a, b) => b.score - a.score);
}

/**
 * Rank candidates for an opportunity — used by industry dashboard
 */
export function rankCandidates(
  opportunity: OpportunityProfile,
  candidates: { id: string; name: string; profile: UserProfile }[]
): { id: string; name: string; match: MatchResult }[] {
  return candidates
    .map((c) => ({
      id: c.id,
      name: c.name,
      match: calculateMatch(c.profile, opportunity),
    }))
    .sort((a, b) => b.match.score - a.match.score);
}
