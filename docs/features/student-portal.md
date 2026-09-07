# 🎓 Student Portal — Feature Documentation

**Route prefix**: `/student/*`  
**Layout file**: [`src/app/student/layout.tsx`](../../skillbridge/src/app/student/layout.tsx)

The Student Portal is the primary interface for college students to assess their skills, build a portfolio, find matching opportunities, and track applications.

---

## Features

### 1. Dashboard (`/student/dashboard`)
The central hub showing:
- **Profile summary** — name, college, target role, assessment score
- **Top matching opportunities** — ranked by AI match score (60/20/20 formula)
- **Skill radar** — visual breakdown of proficiency across technical domains
- **Application status** — recent applications and their current status
- **Skill gap alerts** — top skills to develop based on desired roles

---

### 2. Skills Inventory (`/student/skills`)
- View all assessed skills with proficiency percentages
- Color-coded bars: 🟢 Expert (≥80%), 🟡 Proficient (60–79%), 🔴 Beginner (<60%)
- Filter by technical vs. soft skills
- Breakdown across domains: Programming, AI/ML, Web Dev, Cloud, DevOps

---

### 3. Skill Assessment (`/student/assessment`)
- Timed MCQ quiz across 36+ skill domains
- Questions sourced from [`src/lib/assessment-questions.ts`](../../skillbridge/src/lib/assessment-questions.ts)
- After submission, proficiency scores are calculated per skill
- Results update the student's skill profile globally

**Scoring formula**:
```
For each skill domain:
  correctAnswers / totalQuestions × 100 = proficiency %
```

---

### 4. Skill Gaps (`/student/skill-gaps`)
- Radar chart comparing student skills vs. requirements for their target role
- Lists top "missing" skills with priority levels
- Each gap links to relevant learning resources
- Data powered by `ROLE_REQUIRED_SKILLS` from the skills taxonomy

---

### 5. Opportunities (`/student/opportunities`)
- Browse all available internships, jobs, and live projects
- Each card shows:
  - Match score badge (color-coded)
  - Company, role, location, work mode
  - Matched vs. missing skills preview
- Filter by type (internship/job), category, match score
- Click to view full detail with eligibility checklist

---

### 6. Opportunity Detail (`/student/opportunities/[id]`)
- Full job description
- **Match breakdown**: Skill Compatibility, Interest Alignment, Project Relevance
- **Eligibility checklist**: CGPA, graduation year, degree requirements
- **AI Recommendation**: Personalized advice from Gemini or fallback template
- **Apply button**: Submits application (stored in localStorage / Supabase)

---

### 7. Applications (`/student/applications`)
- Track all submitted applications
- Status pipeline:
  ```
  Applied → Under Review → Shortlisted → Interviewing → Accepted / Rejected
  ```
- Filter by status
- Shows match score per application

---

### 8. Resume Builder (`/student/resume`)
- Upload plain-text resume or choose a sample CV
- Auto-parses and extracts skills via [`resume-parser.ts`](../../skillbridge/src/lib/ai/resume-parser.ts)
- Visual preview of extracted skills with proficiency bars
- Updates the student's global skill profile immediately
- Downloads parsed skills summary

---

### 9. Portfolio Builder (`/student/portfolio`)
- View and manage projects and certifications
- Each project card shows technologies used, GitHub link, live URL
- Certifications with issuer, date, and credential link
- Portfolio is publicly shareable at `/portfolio/[username]`

---

### 10. Profile (`/student/profile`)
- View and edit personal information: name, college, branch, year, CGPA
- Update target career role
- Session data is persisted to localStorage and Supabase (when connected)

---

### 11. Learning Resources (`/student/learning`)
- Curated learning paths based on skill gaps and target role
- Resources filtered by skill and experience level
- Each resource links to external platform (Coursera, YouTube, etc.)
- Difficulty badges: Beginner / Intermediate / Advanced

---

## Role Access Control

Students are restricted to `/student/*` routes only. Attempting to access `/industry/*`, `/institution/*`, or `/academician/*` redirects back to `/student/dashboard` via [`middleware.ts`](../../skillbridge/src/middleware.ts).

---

## Session Data

Student data is stored in two places:

| Data | Storage in Demo Mode | Storage in Production |
|:---|:---|:---|
| Profile | `localStorage` (`sb_user_session`) | Supabase `profiles` |
| Skills | `localStorage` (`sb_student_skills`) | Supabase `user_skills` |
| Resume | `localStorage` (`sb_parsed_resume`) | Supabase (planned) |
| Applications | `localStorage` | Supabase `applications` |
