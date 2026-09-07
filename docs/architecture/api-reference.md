# 🔌 SkillBridge — API Reference

**Base URL (local)**: `http://localhost:3000`  
**Base URL (production)**: `https://your-vercel-domain.vercel.app`

All API routes live under `/api/*` and are implemented as Next.js App Router **Route Handlers**.

---

## Authentication

Protected API routes check for either:
1. A valid **Supabase session** cookie (production)
2. A valid **`sb-demo-session`** cookie (demo mode)

---

## Endpoints

---

### `POST /api/ai/match`

**Description**: Computes the match score between a student profile and an opportunity using the 60/20/20 weighted formula. Optionally enhances the result with a Gemini AI recommendation.

**File**: [`src/app/api/ai/match/route.ts`](../../skillbridge/src/app/api/ai/match/route.ts)

**Request Body**:
```json
{
  "user": {
    "skills": [
      { "skillId": "python", "proficiency": 85 },
      { "skillId": "machine_learning", "proficiency": 72 }
    ],
    "targetRoles": ["Machine Learning Engineer"],
    "education": {
      "degree": "B.Tech",
      "branch": "Computer Science",
      "graduationYear": 2026
    },
    "projects": [
      { "technologies": ["python", "tensorflow", "docker"] }
    ],
    "cgpa": 8.5
  },
  "opportunity": {
    "id": "opp-001",
    "title": "ML Research Intern",
    "company": "Google DeepMind",
    "type": "internship",
    "requiredSkills": [
      { "skillId": "python", "requiredLevel": 70 },
      { "skillId": "tensorflow", "requiredLevel": 60 }
    ],
    "eligibility": {
      "minCgpa": 7.5,
      "maxGradYear": 2027
    }
  },
  "studentName": "Arav Gupta"
}
```

**Response**:
```json
{
  "opportunityId": "opp-001",
  "score": 87,
  "breakdown": {
    "skillCompatibility": 91,
    "interestAlignment": 95,
    "projectRelevance": 90
  },
  "eligibility": {
    "isEligible": true,
    "status": "eligible",
    "criteria": [
      { "label": "Minimum CGPA: 7.5", "met": true, "details": "Your CGPA: 8.5" }
    ]
  },
  "matchedSkills": ["Python", "TensorFlow"],
  "missingSkills": [],
  "aiRecommendation": "You are a strong candidate for ML Research Intern at Google DeepMind..."
}
```

**Status Codes**:
- `200` — Success
- `400` — Missing `user` or `opportunity` in body
- `500` — Internal server error

---

### `POST /api/admin/seed`

**Description**: Seeds the Supabase database with demo opportunities, skills taxonomy, and learning resources. In demo mode (no Supabase configured), returns mock counts.

**File**: [`src/app/api/admin/seed/route.ts`](../../skillbridge/src/app/api/admin/seed/route.ts)

**Request Body**: None required.

**Response (Demo Mode)**:
```json
{
  "success": true,
  "message": "Running in Demo Mode. Pre-seeded demo dataset is actively serving mock endpoints.",
  "seededCounts": {
    "skills": 36,
    "companies": 8,
    "opportunities": 10,
    "learningResources": 15
  }
}
```

**Response (Supabase Connected)**:
```json
{
  "success": true,
  "message": "Supabase database successfully seeded with realistic ecosystem data!"
}
```

**Status Codes**:
- `200` — Success
- `500` — Supabase error

---

## Planned API Routes (Not Yet Implemented)

These routes are needed for full production persistence. Currently the app uses localStorage as a fallback.

### `POST /api/auth/profile`
Save onboarding profile data (name, college, role, branch, etc.) to `profiles` table.

**Request Body**:
```json
{
  "role": "student",
  "name": "Arav Gupta",
  "college": "Dronacharya Group of Institutions",
  "degree": "B.Tech",
  "branch": "CSE",
  "graduationYear": 2026,
  "targetRole": "Machine Learning Engineer"
}
```

---

### `POST /api/assessment/submit`
Save completed skill assessment responses and computed scores to `assessments` and `user_skills` tables.

**Request Body**:
```json
{
  "answers": { "q1": 2, "q2": 0, "q3": 1 },
  "skillScores": { "python": 85, "machine_learning": 72 }
}
```

---

### `POST /api/applications/apply`
Submit a student's application to an opportunity.

**Request Body**:
```json
{
  "opportunityId": "opp-001",
  "matchScore": 87
}
```

---

### `GET /api/opportunities`
Fetch all active opportunities with their required skills from Supabase.

**Query Parameters**:
- `type` — Filter by `internship`, `job`, or `live_project`
- `category` — Filter by category (e.g., `"Machine Learning"`)
- `limit` — Number of results (default: 20)

---

### `GET /api/student/dashboard`
Fetch aggregated student dashboard data: skills, applications, match scores.

---

### `POST /api/resume/parse`
Server-side resume parsing endpoint for processing uploaded resume files.

**Request Body**: `multipart/form-data` with `file` field.

---

## Client-Side Usage Example

```typescript
// Calling /api/ai/match from a page component
const response = await fetch('/api/ai/match', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user: userProfile,
    opportunity: oppProfile,
    studentName: session.name,
  }),
});

const result = await response.json();
console.log(`Match Score: ${result.score}%`);
console.log(`AI Recommendation: ${result.aiRecommendation}`);
```
