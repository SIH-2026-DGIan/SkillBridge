# 🏭 Industry Portal — Feature Documentation

**Route prefix**: `/industry/*`  
**Primary Users**: Recruiters, HR teams, hiring managers

The Industry Portal enables companies to post opportunities, discover qualified candidates through AI matching, and manage applicants efficiently.

---

## Features

### 1. Industry Dashboard (`/industry/dashboard`)
- **Overview metrics**: Active postings, total applicants, shortlisted candidates, hire rate
- **Top matching candidates**: Students ranked by match score for active roles
- **Recent applications**: Latest applications across all posted opportunities
- **Skill demand heatmap**: Most sought-after skills across all postings

---

### 2. Post Opportunities (`/industry/opportunities`)
- Create internship, job, or live project listings
- Specify:
  - Job title, description, location, work mode
  - Required and preferred skills with minimum proficiency thresholds
  - Eligibility criteria (CGPA, graduation year, degree)
  - Stipend / salary range, duration, application deadline

---

### 3. Candidate Discovery
- Browse student profiles ranked by match score
- Filter candidates by skills, CGPA, branch, graduation year
- View student's full portfolio and parsed resume skills
- AI match score breakdown per candidate per role

---

### 4. Applicant Management
- View all applicants per job posting
- Update application status: `Applied → Shortlisted → Interviewing → Accepted/Rejected`
- Bulk shortlisting based on minimum match score threshold
- Export candidate list

---

## Role Access Control

Industry users are restricted to `/industry/*` routes. Attempting to access student or institution routes redirects to `/industry/dashboard`.

---

## Key Differentiator

Industry partners benefit from `rankCandidates()` in the matching engine:

```typescript
import { rankCandidates } from '@/lib/ai/matching-engine';

const rankedCandidates = rankCandidates(opportunityProfile, allStudents);
// Returns students sorted by match score — no manual shortlisting needed
```
