import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateMatch,
  UserProfile,
  OpportunityProfile,
} from '../src/lib/ai/matching-engine';

test('Deterministic Matching Engine', async (t) => {
  const baseUser: UserProfile = {
    skills: [
      { skillId: 'react', proficiency: 4 },
      { skillId: 'typescript', proficiency: 4 },
      { skillId: 'nodejs', proficiency: 3 },
    ],
    targetRoles: ['Frontend Developer', 'Full Stack Developer'],
    education: { degree: 'B.Tech', branch: 'Computer Science', graduationYear: 2026 },
    projects: [
      { technologies: ['react', 'typescript', 'tailwind'] },
      { technologies: ['nodejs', 'express', 'postgresql'] },
    ],
    cgpa: 8.5,
  };

  await t.test('calculates high match score for fully matched candidate', () => {
    const opp: OpportunityProfile = {
      id: 'opp-full-match',
      title: 'Frontend Developer Intern',
      company: 'Tech Solutions',
      type: 'internship',
      requiredSkills: [
        { skillId: 'react', requiredLevel: 3 },
        { skillId: 'typescript', requiredLevel: 3 },
      ],
      eligibility: {
        minCgpa: 7.0,
        degrees: ['B.Tech', 'B.E.'],
        maxGradYear: 2027,
        minGradYear: 2025,
      },
    };

    const result = calculateMatch(baseUser, opp);
    assert.ok(result.score >= 80, `Expected score >= 80, got ${result.score}`);
    assert.equal(result.eligibility.isEligible, true);
    assert.equal(result.eligibility.status, 'eligible');
    assert.equal(result.matchedSkills.length, 2);
    assert.equal(result.missingSkills.length, 0);
  });

  await t.test('detects missing skills and penalizes score accordingly', () => {
    const opp: OpportunityProfile = {
      id: 'opp-partial-match',
      title: 'DevOps Engineer',
      company: 'Cloud Corp',
      type: 'job',
      requiredSkills: [
        { skillId: 'kubernetes', requiredLevel: 4 },
        { skillId: 'docker', requiredLevel: 4 },
        { skillId: 'aws', requiredLevel: 3 },
      ],
    };

    const result = calculateMatch(baseUser, opp);
    assert.ok(result.score < 50, `Expected score < 50, got ${result.score}`);
    assert.equal(result.missingSkills.length, 3);
  });

  await t.test('enforces hard eligibility gate on CGPA', () => {
    const lowCgpaUser: UserProfile = {
      ...baseUser,
      cgpa: 6.2,
    };

    const highRequirementOpp: OpportunityProfile = {
      id: 'opp-high-cgpa',
      title: 'Research Analyst',
      company: 'Quant Alpha',
      type: 'internship',
      requiredSkills: [{ skillId: 'react', requiredLevel: 2 }],
      eligibility: {
        minCgpa: 8.0, // Candidate has 6.2 -> should fail eligibility
      },
    };

    const result = calculateMatch(lowCgpaUser, highRequirementOpp);
    assert.equal(result.eligibility.isEligible, false);
    assert.equal(result.eligibility.status, 'warning');
    const cgpaCriteria = result.eligibility.criteria.find((c) => c.label.includes('CGPA'));
    assert.ok(cgpaCriteria);
    assert.equal(cgpaCriteria?.met, false);
  });

  await t.test('enforces hard eligibility gate on Degree qualification', () => {
    const bcaUser: UserProfile = {
      ...baseUser,
      education: { degree: 'BCA', branch: 'Computer Applications', graduationYear: 2026 },
    };

    const opp: OpportunityProfile = {
      id: 'opp-degree-gate',
      title: 'Core Systems Engineer',
      company: 'Hardware Systems',
      type: 'job',
      requiredSkills: [{ skillId: 'react', requiredLevel: 2 }],
      eligibility: {
        degrees: ['B.Tech', 'M.Tech', 'B.E.'],
      },
    };

    const result = calculateMatch(bcaUser, opp);
    assert.equal(result.eligibility.isEligible, false);
    assert.equal(result.eligibility.status, 'warning');
  });

  await t.test('handles candidate with zero skills gracefully without crashing', () => {
    const emptyUser: UserProfile = {
      skills: [],
      targetRoles: [],
      education: { degree: 'B.Tech', branch: 'Computer Science', graduationYear: 2026 },
      projects: [],
      cgpa: 7.5,
    };

    const opp: OpportunityProfile = {
      id: 'opp-standard',
      title: 'Junior Developer',
      company: 'Startup',
      type: 'internship',
      requiredSkills: [{ skillId: 'react', requiredLevel: 3 }],
    };

    const result = calculateMatch(emptyUser, opp);
    assert.ok(typeof result.score === 'number');
    assert.ok(result.score >= 0 && result.score <= 100);
    assert.equal(result.missingSkills.length, 1);
  });
});
