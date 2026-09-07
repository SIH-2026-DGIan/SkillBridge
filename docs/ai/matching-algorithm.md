# 🤖 AI Matching Algorithm

**File**: [`src/lib/ai/matching-engine.ts`](../../skillbridge/src/lib/ai/matching-engine.ts)

The SkillBridge matching algorithm is a **deterministic, multi-dimensional scoring engine** that computes a student-opportunity compatibility score. It works 100% offline, with no external API calls required.

---

## Scoring Formula (SIH 2026 Specification)

```
Match Score = (Skill Compatibility × 0.60)
            + (Interest Alignment    × 0.20)
            + (Project Relevance     × 0.20)
```

All three components are normalized to a **0–100 scale**.  
Final score is clamped to `[15, 99]` to avoid extreme values.

---

## Component 1: Skill Compatibility (60% weight)

**What it measures**: How well the student's proficiency in each required skill meets the job's minimum threshold.

**Algorithm**:
```
For each required skill:
  ratio = min(studentProficiency / requiredLevel, 1.05)
  
  if ratio >= 0.70 → skill is "matched"
  else             → skill is "missing"

skillCompatibility = (sum of all ratios / number of required skills) × 100
```

**Key Details**:
- A slight over-qualification bonus (`ratio` capped at 1.05) rewards proficiency above the required level.
- Skills where the student meets ≥70% of the required level count as "matched".
- If the opportunity has no required skills listed, `skillCompatibility` defaults to 70.

**Example**:
```
Required: Python at 70, TensorFlow at 60
Student:  Python at 85, TensorFlow at 45

Python ratio:     min(85/70, 1.05) = 1.05  ✅ Matched
TensorFlow ratio: min(45/60, 1.05) = 0.75  ✅ Matched (≥0.70)

skillCompatibility = ((1.05 + 0.75) / 2) × 100 = 90
```

---

## Component 2: Interest / Career Goal Alignment (20% weight)

**What it measures**: How well the student's stated target roles align with the opportunity's title and category.

**Algorithm**:
```
Default interestAlignment = 50 (neutral)

For each of the student's targetRoles:
  - Exact title match    → 95
  - Strong keyword match → 85
  - Partial word match   → 70
```

**Special mappings handled**:
- `"Machine Learning Engineer"` → matches roles with `ml`, `machine learning`, `ai`
- `"Frontend Developer"` → matches `react`, `frontend`, `web`
- `"Data Analyst"` → matches `data`, `analyst`

---

## Component 3: Project & Portfolio Relevance (20% weight)

**What it measures**: Whether the student's portfolio projects use technologies that overlap with the opportunity's required skills.

**Algorithm**:
```
Default projectRelevance = 50

For each project in student's portfolio:
  overlapping = project.technologies ∩ opportunity.requiredSkills
  
  matchRatio = overlapping.length / opportunity.requiredSkills.length
  
  if matchRatio >= 0.5 → projectRelevance = 90
  if matchRatio >  0   → projectRelevance = min(85, 60 + matchRatio × 35)
```

---

## Eligibility Check (Hard Filter)

Eligibility is evaluated **independently** as a hard gate — it does NOT modify the match score but flags the student with a status:

| Status | Meaning |
|:---|:---|
| `eligible` | All hard criteria passed |
| `warning` | One or more criteria not met |
| `ineligible` | Disqualifying criteria |

**Eligibility criteria checked**:
- **Minimum CGPA** — student's CGPA must be ≥ `minCgpa`
- **Maximum Graduation Year** — student's batch must be ≤ `maxGradYear`
- **Minimum Graduation Year** — student's batch must be ≥ `minGradYear`
- **Eligible Degrees** — student's degree/branch must match listed degrees

---

## Output Structure

```typescript
interface MatchResult {
  opportunityId: string;
  score: number;                    // Final 0-99 match score
  breakdown: {
    skillCompatibility: number;     // Component 1 score
    interestAlignment: number;      // Component 2 score
    projectRelevance: number;       // Component 3 score
  };
  eligibility: {
    isEligible: boolean;
    status: 'eligible' | 'warning' | 'ineligible';
    criteria: {
      label: string;
      met: boolean;
      details?: string;
    }[];
  };
  matchedSkills: string[];          // Skills the student has ≥70% proficiency for
  missingSkills: string[];          // Skills the student needs to develop
  reason: string;                   // Human-readable recommendation text
}
```

---

## Batch Operations

The engine also supports bulk ranking:

### Rank All Opportunities for a Student
```typescript
import { rankOpportunities } from '@/lib/ai/matching-engine';

const ranked = rankOpportunities(userProfile, allOpportunities);
// Returns: MatchResult[] sorted by score DESC
```

### Rank All Candidates for an Opportunity
```typescript
import { rankCandidates } from '@/lib/ai/matching-engine';

const ranked = rankCandidates(opportunity, allCandidates);
// Returns: { id, name, match: MatchResult }[] sorted by score DESC
// Used by Industry dashboard to find top applicants
```

---

## Score Interpretation

| Score Range | Label | Color |
|:---|:---|:---|
| 85–99 | Strong Match | 🟢 Green |
| 65–84 | Good Match | 🟡 Yellow |
| 0–64 | Needs Development | 🔴 Red |
